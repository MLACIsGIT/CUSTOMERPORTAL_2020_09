const npm_mssql = require('mssql');
const { BlobServiceClient } = require('@azure/storage-blob');
const npm_streamifier = require('streamifier');
const npm_multipart = require('multipart-formdata');

const version = 'v001.01.01';

const dh = require('../mobile/components/databaseHandler')
const tkn = require('../mobile/components/token')

const storageConfig = {
    storageConnectionString: process.env.BLOB_connectionString,
    options: {
        encrypt: true
    }
}

let token = "";

async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
    });
}

sResultErr = (errcode, err) => {
    return {
        status: 400,
        body: {
            'header': {
                'version': version,
                "token": token,
                'result': errcode
            },
            'body': {
                'err': JSON.stringify(err)
            }
        }
    }
}

sResultOk = (result) => {
    return {
        status: 200,
        body: {
            'header': {
                'version': version,
                "token": token,
                'result': 'OK'
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

    let watFunction = '';
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
        context.res = sResultErr('BLOB_ERROR', 'Invalid or missing validation data')
        return;
    }

    let watRequest = JSON.parse(messageArray[0].field);
    
    try {
        watFunction = (watRequest.header.function) ? watRequest.header.function : '';
    } catch (error) {
        // nothing to do    
    }

    try {
        //Step 1: connection
        onErrorErrCode = 'GATEWAY_ERROR_DB-Connect' // Procedure returns this errorcode if the next statement fails. 
        dbConn = await dh.databaseHandler.watConnect();
        connected = true;

        //Step 2: Execute WAT Function
        onErrorErrCode = 'GATEWAY_ERROR_SQL-Statement failure'

        let blobServiceClient;
        let containerClient;
                
        try {
            blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.storageConnectionString);
            containerClient = blobServiceClient.getContainerClient(watRequest.header.portalOwnerId);
            await containerClient.create();
    
        } catch (err) {
            if (err.code !== 'ContainerAlreadyExists'){
                context.res = sResultErr('BLOB_ERROR - Create container failure', err)
            }
        }

        let tokenParams = "";
        let tokenizer;
        let tokenResults;

        switch (watFunction) {
            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_UPLOAD_FILE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_UPLOAD_FILE':
                if (filesArray.length == 0){
                    context.res = sResultErr('BLOB_ERROR', 'No files selected')
                    break;
                }
                
                if (typeof watRequest.header.portalOwnerId == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                tokenParams = {
                    "token": watRequest.header.token
                }
                tokenizer = new tkn.Token(tokenParams);
                tokenResults = await tokenizer.validateToken();

                if (tokenResults.token == ""){
                    context.res = mResultErr('GATEWAY_ERROR_invalid_token', 0)
                    return;
                }

                token = tokenizer.token.token;

                let filePath = (new Date()).toISOString().slice(0,10).replace(/-/g,'')
                let fileName = '';
                let outputFileIds = [];

                for (let iFiles = 0; iFiles < filesArray.length; iFiles++) {
                    fileName = Math.random().toString(36);

                    let blockBlobClient = containerClient.getBlockBlobClient(filePath.concat('/', fileName));
    
                    let result;
                    try
                    {
                      result = await blockBlobClient.uploadStream(npm_streamifier.createReadStream(Buffer.from(filesArray[iFiles].data)), filesArray[iFiles].data.length);
                    }
                    catch(err)
                    {
                        context.res = sResultErr('BLOB_ERROR - Stream file failure', err)
                    }
    
                    dbRequest = new npm_mssql.Request(dbConn)
                    dbRequest.input('BLOB_Account', npm_mssql.NVarChar(50), blobServiceClient.accountName);
                    dbRequest.input('BLOB_Container', npm_mssql.NVarChar(50), watRequest.header.portalOwnerId.toString());
                    dbRequest.input('BLOB_File_Path', npm_mssql.NVarChar(255), filePath);
                    dbRequest.input('BLOB_File_Name', npm_mssql.NVarChar(255), fileName);
                    dbRequest.input('BLOB_Orig_File_Name', npm_mssql.NVarChar(255), decodeURI(filesArray[iFiles].filename));
                    dbRequest.input('BLOB_Content_Type', npm_mssql.NVarChar(255), filesArray[iFiles].type);
                    dbRequest.input('BLOB_File_Length', npm_mssql.Int,filesArray[iFiles].data.length)
                    dbRequest.output('OUT_WAT_File_ID', npm_mssql.Int);
                    dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255));
                    dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'));

                    dbResults = await dh.databaseHandler.watSpExecute(dbRequest, 'WAT_INTERFACE_UPLOAD_FILE');
                    
                    if (dbResults.output.OUT_ErrCode != "") {
                        context.res = sResultErr(dbResults.output.OUT_ErrCode, {
                            'ReturnValues': {
                                'ReturnValue': dbResults.returnValue,
                                'ErrCode': dbResults.output.OUT_ErrCode,
                                'ErrParams': dbResults.output.OUT_ErrParams
                            }
                        })
                    } else {
                        outputFileIds.push(dbResults.output.OUT_WAT_File_ID);
                    }
    
                }

                context.res = sResultOk({
                    'outputIds': JSON.stringify(outputFileIds)
                })

                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_DOWNLOAD_FILE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_DOWNLOAD_FILE':
                if (typeof watRequest.header.portalOwnerId == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.watUser == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.fileId == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                tokenParams = {
                    "token": watRequest.header.token
                }
                tokenizer = new tkn.Token(tokenParams);
                tokenResults = await tokenizer.validateToken();

                if (tokenResults.token == ""){
                    context.res = mResultErr('GATEWAY_ERROR_invalid_token', 0)
                    return;
                }

                token = tokenizer.token.token;

                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(watRequest.header.portalOwnerId));
                dbRequest.input('WAT_User', npm_mssql.NVarChar(128), watRequest.body.watUser);
                dbRequest.input('BLOB_Account', npm_mssql.NVarChar(50), blobServiceClient.accountName);
                dbRequest.input('File_ID', npm_mssql.Int, watRequest.body.fileId)
                dbRequest.output('OUT_File_Meta_Data', npm_mssql.NVarChar('max'));
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255));
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'));

                dbResults = await dh.databaseHandler.watSpExecute(dbRequest, 'WAT_INTERFACE_DOWNLOAD_FILE');
                
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = sResultErr(dbResults.output.OUT_ErrCode, {
                        'ReturnValues': {
                            'ReturnValue': dbResults.returnValue,
                            'ErrCode': dbResults.output.OUT_ErrCode,
                            'ErrParams': dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    fileMetaData = JSON.parse(dbResults.output.OUT_File_Meta_Data);
                    if (fileMetaData.length == 0) {
                        context.res = Result_OK({
                            'Results': 'Nothing'
                        })
                    } else {
                        let blobName = fileMetaData[0].filePath + '/' + fileMetaData[0].fileName;
                        let blobClient = containerClient.getBlobClient(blobName);
                        let downloadBlockBlobResponse = await blobClient.download();
                        let result = (
                          await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
                        );
    
                        context.res = {
                            status: 200,
                            headers : {
                                'Cache-Control': 'no-cache',
                                'Content-Type': fileMetaData[0].contentType,
                                'Content-Length': fileMetaData[0].fileLength,
                                'Content-Disposition': 'attachment; filename=' + encodeURI(fileMetaData[0].origFileName),
                                'Creation-Date': fileMetaData[0].creationDate,
                                'File-Name': encodeURI(fileMetaData[0].origFileName),
                                'File-Type': fileMetaData[0].contentType,
                                'File-Length': fileMetaData[0].fileLength
                            },
                            body : result
                        }                    
                    }
                }

                break;

            default:
                context.res = sResultErr('GATEWAY_ERROR_unknown_function_call', { unknown_function: WAT_function })
                break;
            }
        } catch (err) {
            context.res = sResultErr(onErrorErrCode, err)
        }
    
        // Disconnect
        if (connected) { dbConn.close() }

}