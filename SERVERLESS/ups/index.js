const npm_mssql = require('mssql');

const version = 'v001.01.01';

const dbConfig = {
    server: process.env.DB_server,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    port: parseInt(process.env.DB_port),
    options: {
        encrypt: true
    },
    parseJSON: true
};

let requestId = "#";
let portalOwnerId = 0;

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
            'header': {
                'version': version,
                'request_id': requestId,
                'result': errcode
            },
            'body': {
                'err': JSON.stringify(err)
            }
        }
    }
}

resultOk = (result) => {
    return {
        status: 200,
        body: {
            'header': {
                'version': version,
                'request_id': requestId,
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

    let watRequest = "";
    let watFunction = '';

    try {
        contentType = req.headers['content-type'];

    } catch(err) {
        contentType = '';
    }

    if (contentType !== 'application/json' || req.method !== 'POST') {
        context.res = {
            status: 200,
            body: `SELEXPED UPS SERVER VERSION ${version} is ready to go.`
        };
        return;
    }

    try {
        watRequest = req.body;
        watFunction = (watRequest.header.function) ? watRequest.header.function : '';
    } catch (error) {
        // nothing to do    
    }

    portalOwnerId = watRequest.header.Portal_owner_id
    if (typeof portalOwnerId == 'undefined'){
        context.res = resultErr('GATEWAY_ERROR_unknown_owner_id', 0)
        return;
         }
    
    try {
        //Step 1: connection
        onErrorErrCode = 'GATEWAY_ERROR_DB-Connect' // Procedure returns this errorcode if the next statement fails. 
        dbConn = await watConnect();
        connected = true;

        //Step 2: Execute WAT Function
        onErrorErrCode = 'GATEWAY_ERROR_SQL-Statement failure'

        let watUser;
        switch (watFunction) {
            //-------------------------------------------------------------------------------------------------------------------------------
            // UPLOAD_ORDERS_DATA
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'UPLOAD_ORDERS_DATA':
                watUser = watRequest.body.WAT_User;
                if (typeof watUser == 'undefined'){
                    context.res = resultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                    }

                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, portalOwnerId)
                dbRequest.input('WAT_Session_ID', npm_mssql.NVarChar(255), watRequest.header.Session_ID);
                dbRequest.input('WAT_User', npm_mssql.NVarChar(50), watUser)
                dbRequest.output('OUT_WAT_Message', npm_mssql.NVarChar('max'))
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await watSpExecute(dbRequest, 'U_UPS_WAT_INTERFACE_RECEIVE_ORDERS')
    
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = resultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = Result_OK({
                        "Results": dbResults.output.OUT_WAT_Message
                    });
                }

                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // UPLOAD_TEVA_TIG_DATA
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'UPLOAD_TEVA_TIG_DATA':
                watUser = watRequest.body.WAT_User;
                if (typeof watUser == 'undefined'){
                    context.res = resultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                    }

                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, portalOwnerId)
                dbRequest.input('WAT_Session_ID', npm_mssql.NVarChar(255), watRequest.header.Session_ID);
                dbRequest.input('WAT_User', npm_mssql.NVarChar(50), watUser)
                dbRequest.output('OUT_WAT_Message', npm_mssql.NVarChar('max'))
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await watSpExecute(dbRequest, 'U_UPS_WAT_INTERFACE_RECEIVE_TEVA_TIG')
    
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = resultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = Result_OK({
                        "Results": dbResults.output.OUT_WAT_Message
                    });
                }

                break;

                default:
                    context.res = resultErr('GATEWAY_ERROR_unknown_function_call', { unknown_function: watFunction })
                    break;
            }
    
        } catch (err) {
            context.res = resultErr(onErrorErrCode, err)
        }
    
    // Disconnect
    if (connected) { dbConn.close() }
}