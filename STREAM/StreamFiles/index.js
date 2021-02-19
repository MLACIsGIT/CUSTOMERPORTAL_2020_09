const npm_mssql = require('mssql');
const { BlobServiceClient } = require("@azure/storage-blob");
const npm_streamifier = require('streamifier');
const npm_multipart = require('multipart-formdata');

const version = 'v001.01.01';

const storageConfig = {
    storageConnectionString: process.env.BLOB_connectionString,
    options: {
        encrypt: true
    }
}

const dbConfig = {
    server: process.env.DB_server,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    port: parseInt(process.env.DB_port),
    options: {
        encrypt: true
    }
};

let request_id = "#";

function watConnect() {
    return new Promise((resolve, reject) => {
        let Pool = new npm_mssql.ConnectionPool(dbConfig);
        Pool.connect(function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(Pool);
            }
        })
    })
}

function watSpExecute(dbRequest, procedureName) {
    return new Promise((resolve, reject) => {
        dbRequest.execute(procedureName, function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}
resultErr = (errcode, err) => {
    return {
        status: 400,
        body: {
            "header": {
                "version": version,
                "request_id": request_id,
                "result": errcode
            },
            'body': {
                "err": JSON.stringify(err)
            }
        }
    }
}

resultOk = (result) => {
    return {
        status: 200,
        body: {
            "header": {
                "version": version,
                "request_id": request_id,
                "result": "OK"
            },
            'body': result
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }
}
module.exports = async function (context, req) {
    let dbConn;
    let dbRequest;
    let dbResults;
    let onErrorErrCode = '';
    let connected = false;

    let watFunction = "";
    let inputType = req.headers['content-type']
    let contentType = '';

    try {
        contentType = inputType.substring( 0, inputType.indexOf( ';' ) );

    } catch(err) {
        contentType = '';
    }

    if (contentType !== 'multipart/form-data' || req.method !== 'POST') {
        context.res = {
            status: 200,
            body: `SELEXPED FILE STREAM SERVER VERSION ${version} is ready to go.`
        };
        return;
    }

    let boundary = npm_multipart.getBoundary(req.headers['content-type']);
    let parts = npm_multipart.parse(req.body, boundary);

    let filesArray = [];
    let messageArray = [];

    for (let iParts = 0; iParts < parts.length; iParts++) {
        if (parts[iParts].type !== false) {
            filesArray.push(parts[iParts])
        }

        if (parts[iParts].type === false && parts[iParts].name === 'message') {
            messageArray.push(parts[iParts])
        }
    }

    if (messageArray.length !== 1){
        context.res = resultErr('BLOB_ERROR', 'Invalid or missing validation data')
        return;
    }

    let watRequest = JSON.parse(messageArray[0].field);
    
    try {
        watFunction = (watRequest.function) ? watRequest.function : '';
    } catch (error) {
        // nothing to do    
    }

    try {
        //Step 1: connection
        onErrorErrCode = 'GATEWAY_ERROR_DB-Connect' // Procedure returns this errorcode if the next statement fails. 
        dbConn = await watConnect();
        connected = true;

        //Step 2: Execute WAT Function
        onErrorErrCode = 'GATEWAY_ERROR_SQL-Statement failure'

        switch (watFunction) {
            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_UPLOAD_FILE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_UPLOAD_FILE':
                if (filesArray.length == 0){
                    context.res = resultErr('BLOB_ERROR', 'No files selected')
                    break;
                }

                let folderName = (new Date()).toISOString().slice(0,10).replace(/-/g,"")
                
                let blobServiceClient;
                let containerClient;
                try {
                    blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.storageConnectionString);
                    containerClient = blobServiceClient.getContainerClient(watRequest.portalOwnerId);
                    await containerClient.create();
            
                } catch (err) {
                    if (err.code !== 'ContainerAlreadyExists'){
                        context.res = resultErr('BLOB_ERROR - Create container failure', err)
                    }
                }

                let fileName ='';
                let outputFileIds = [];
                for (let iFiles = 0; iFiles < filesArray.length; iFiles++) {
                    fileName = Math.random().toString(36);

                    let blockBlobClient = containerClient.getBlockBlobClient(folderName.concat('/',fileName));
    
                    let result;
                    try
                    {
                      result = await blockBlobClient.uploadStream(npm_streamifier.createReadStream(Buffer.from(filesArray[iFiles].data)), filesArray[iFiles].data.length);
                    }
                    catch(err)
                    {
                        context.res = resultErr('BLOB_ERROR - Stream file failure', err)
                    }
    
                    dbRequest = new npm_mssql.Request(dbConn)
                    dbRequest.input('BLOB_Account', npm_mssql.NVarChar(50), blobServiceClient.accountName);
                    dbRequest.input('BLOB_Container', npm_mssql.NVarChar(50), watRequest.portalOwnerId.toString());
                    dbRequest.input('BLOB_Folder_Name', npm_mssql.NVarChar(50), folderName);
                    dbRequest.input('BLOB_File_Name', npm_mssql.NVarChar(255), fileName);
                    dbRequest.input('BLOB_Orig_File_Name', npm_mssql.NVarChar(255), filesArray[iFiles].filename);
                    dbRequest.output('OUT_WAT_File_ID', npm_mssql.Int);
                    dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255));
                    dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'));
                    dbResults = await watSpExecute(dbRequest, 'WAT_INTERFACE_UPLOAD_FILE');
                    if (dbResults.output.OUT_ErrCode != "") {
                        context.res = resultErr(dbResults.output.OUT_ErrCode, {
                            "ReturnValues": {
                                "ReturnValue": dbResults.returnValue,
                                "ErrCode": dbResults.output.OUT_ErrCode,
                                "ErrParams": dbResults.output.OUT_ErrParams
                            }
                        })
                    } else {
                        outputFileIds.push(dbResults.output.OUT_WAT_File_ID);
                    }
    
                }

                context.res = resultOk({
                    "outputIds": JSON.stringify(outputFileIds)
                })

                break;

            default:
                context.res = resultErr('GATEWAY_ERROR_unknown_function_call', { unknown_function: WAT_function })
                break;
            }
        } catch (err) {
            context.res = resultErr(onErrorErrCode, err)
        }
    
        // Disconnect
        if (connected) { dbConn.close() }

}