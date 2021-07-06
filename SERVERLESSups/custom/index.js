const npm_mssql = require('mssql');

const version = 'v001.01.01';

const dh = require('../wat/components/databaseHandler')
const crypto = require("../wat/components/crypto")

let portalOwnerId = 0;

uResultErr = (errcode, err) => {
    return {
        status: 400,
        body: {
            'header': {
                'version': version,
                'result': errcode
            },
            'body': {
                'err': JSON.stringify(err)
            }
        }
    }
}

uResultOk = (result) => {
    return {
        status: 200,
        body: {
            'header': {
                'version': version,
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

    portalOwnerId = watRequest.header.portalOwnerId
    if (typeof portalOwnerId == 'undefined'){
        context.res = uResultErr('GATEWAY_ERROR_unknown_owner_id', 0)
        return;
         }
    
    try {
        //Step 1: connection
        onErrorErrCode = 'GATEWAY_ERROR_DB-Connect' // Procedure returns this errorcode if the next statement fails. 
        dbConn = await dh.databaseHandler.watConnect();
        connected = true;

        //Step 2: Execute WAT Function
        onErrorErrCode = 'GATEWAY_ERROR_SQL-Statement failure'

        let c;
        let cResults;
        let watUser;
        switch (watFunction) {
            //-------------------------------------------------------------------------------------------------------------------------------
            // UPLOAD_ORDERS_DATA
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'UPLOAD_ORDERS_DATA':
                watUser = watRequest.body.watUser;
                if (typeof watUser == 'undefined'){
                    context.res = uResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                    }

                c = new crypto.Crypto(watRequest.header.portalOwnerId, watRequest.body.watUser, watRequest.header.apiKey);
                cResults = await c.validateKey();
    
                if(cResults.isValidate == 0) {
                    context.res = mResultErr("GATEWAY_ERROR_validation_error", 0)
                    return;
                }
    
                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, portalOwnerId)
                dbRequest.input('WAT_User', npm_mssql.NVarChar(50), watUser)
                dbRequest.output('OUT_WAT_Message', npm_mssql.NVarChar('max'))
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await dh.databaseHandler.watSpExecute(dbRequest, 'U_UPS_WAT_INTERFACE_RECEIVE_ORDERS')
    
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = uResultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = uResultOk({
                        "Results": dbResults.output.OUT_WAT_Message
                    });
                }

                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // UPLOAD_TEVA_TIG_DATA
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'UPLOAD_TEVA_TIG_DATA':
                watUser = watRequest.body.watUser;
                if (typeof watUser == 'undefined'){
                    context.res = uResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                    }

                c = new crypto.Crypto(watRequest.header.portalOwnerId, watRequest.body.watUser, watRequest.header.apiKey);
                cResults = await c.validateKey();
        
                if(cResults.isValidate == 0) {
                    context.res = mResultErr("GATEWAY_ERROR_validation_error", 0)
                    return;
                }
    
                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, portalOwnerId)
                dbRequest.input('WAT_User', npm_mssql.NVarChar(50), watUser)
                dbRequest.output('OUT_WAT_Message', npm_mssql.NVarChar('max'))
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await dh.databaseHandler.watSpExecute(dbRequest, 'U_UPS_WAT_INTERFACE_RECEIVE_TEVA_TIG')
    
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = uResultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = uResultOk({
                        "Results": dbResults.output.OUT_WAT_Message
                    });
                }

                break;

                default:
                    context.res = uResultErr('GATEWAY_ERROR_unknown_function_call', { unknown_function: watFunction })
                    break;
            }
    
        } catch (err) {
            context.res = uResultErr(onErrorErrCode, err)
        }
    
    // Disconnect
    if (connected) { dbConn.close() }
}