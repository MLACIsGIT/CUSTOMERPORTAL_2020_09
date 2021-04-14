const npm_mssql = require('mssql');
const npm_seeme = require('seeme-js');

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

const SEEME_config = {
    apiKey: process.env.SEEME_apiKey
};

let request_id = "#";
let seeme;

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

function watConnect() {
    try {
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
    } catch (error) {
        console.log(error)
    }
}

function watSpExecute(dbRequest, Name_of_Procedure) {
    return new Promise((resolve, reject) => {
        dbRequest.execute(Name_of_Procedure, function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

module.exports = async function (context, req) {
    //-------------------------------------------------------------------------------------------------------------------------------
    // SEEME SMS Send Test - Send an sms to seeme sms number and this code sends an sms to your phone number the incomming text
    //-------------------------------------------------------------------------------------------------------------------------------

    // try {
    //     const seeme = new npm_seeme.SeeMeGateway(SEEME_config);

    //     dbResults = await seeme.sendSMS('36709474387', (JSON.stringify(context.bindings.req.originalUrl)))
    //     context.res = {
    //         status: 200,
    //         body: JSON.stringify(dbResults)
    //     };

    //     return;
    // } catch (e) {
    //     console.error(e);
    // }
    // return;

    //-------------------------------------------------------------------------------------------------------------------------------
    // RECEIVE SEEME SMS
    // In Content comes the following message for example:
    // {"invocationId":"54539184-a8be-476c-b8e6-dae526015023","traceContext":{"traceparent":"00-0cb1b2a3c9de06429de68afcc574bd1c-8fd7cfe3915a2a4f-00","traceste":"","attributes":{}},"executionContext":{"invocationId":"54539184-a8be-476c-b8e6-dae526015023","functionName":"trial","functionDirectory":"D:\\hote\\wwwroot\\trial"},"bindings":{"req":{"method":"GET","url":"https://selester-trial-ml-001.azurewebsites.net/api/trial?message=WAT+1003&number=3679&destination=36303444293&timestamp=20201126153618","originalUrl":"https://selester-trial-ml-001.azurewebsites.net/api/trial?message=WAT+1003&number=36209213679&destination=36303444293&timestamp=20201126153618","headers":{"accept":"*/*","connection":"Keep-Alive","host":"selester-trial-ml-001.azurewebsits.net","max-forwards":"9","x-waws-unencoded-url":"/api/trial?message=WAT+1003&number=36209213679&destination=36303444293&timestamp=20201126153618","client-ip":"10.0.128.14:54430","x-arr-log-id":"aba65f1a-8b8a-4c97-9c41-382df5542642","x-site-deployment-id":"SELESTER-TRIAL-ML-001","was-default-hostname":"selester-trial-ml-001.azurewebsites.net","x-original-url":"/api/trial?message=WAT+1003&number=36209213679&destination=36303444293&timestamp=20201126153618","x-forwarded-for":"80.249.169.123:47364","x-arr-ssl":"2048|256|C=US, S=Washington, L=Redmond, O=Microsoft Corporation, OU=Microsoft IT, CN=Microsoft ITLS CA 5|CN=*.azurewebsites.net","x-forwarded-proto":"https","x-appservice-proto":"https","x-forwarded-tlsversion":"1.2","disguised-
    //-------------------------------------------------------------------------------------------------------------------------------

    let smsParams = {
        smsType: "NOT_VALID",
        smsPhoneNumber: "",
        smsPhoneNumberInDb: "",
        smsMessage: ""
    }

    let dbConn;
    let dbRequest;
    let dbResults;
    let onErrorErrCode = '';
    let connected = false;

    let watRequest = "";
    let watFunction = "";

    try {
        let originalUrl = context.bindings.req.originalUrl;
        let originalMessage = ((originalUrl.split("?message="))[1]).split("&");
        smsParams.smsPhoneNumber = ((originalMessage[1]).split("="))[1];
        smsParams.smsMessage = (originalMessage[0]).replace(/\+/g, " ");

        if ((smsParams.smsMessage).substr(0, 8) === "WAT APP " && smsParams.smsPhoneNumber > '') {
            smsParams.smsType = 'VALIDATION';
            watFunction = 'WAT_INTERFACE_MOBILE_VALIDATE';
            smsParams.smsPhoneNumberInDb = (smsParams.smsPhoneNumber.substr(0, 2) != "00") ? "00" + smsParams.smsPhoneNumber : smsParams.smsPhoneNumber;
        }

    } catch (error) {
        // nothing to do
    }

    if (smsParams.smsType === "NOT_VALID") {
        if (req.body == undefined) {
            context.res = {
                status: 200,
                body: `SELEXPED CUSTOMER PORTAL MOBILE AZURE FUNCTION VERSION ${version} is ready to go.`
            };
            return;
        }
    }

    try {
        watRequest = req.body;
        watFunction = (watRequest.header.function) ? watRequest.header.function : '';
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
            // WAT_INTERFACE_SEND_MESSAGE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_SEND_MESSAGE':
                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(watRequest.header.Portal_owner_id));
                dbRequest.input('WAT_Session_ID', npm_mssql.NVarChar(255), watRequest.header.Session_ID);
                dbRequest.input('Message_FROM_WAT_User', npm_mssql.NVarChar(128), watRequest.body.Message_FROM);
                dbRequest.input('Message_TO_WAT_User', npm_mssql.NVarChar(128), watRequest.body.Message_TO);
                dbRequest.input('Message_Type', npm_mssql.Int, watRequest.body.Message_Type);
                dbRequest.input('WAT_Message', npm_mssql.NVarChar('max'), JSON.stringify(watRequest.body.message));
                dbRequest.output('OUT_WAT_Messages_ID', npm_mssql.Int);
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255));
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'));
                dbResults = await watSpExecute(dbRequest, 'WAT_INTERFACE_SEND_MESSAGE');
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = resultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = resultOk({
                        "Message_ID": dbResults.output.OUT_WAT_Messages_ID
                    });
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_RECEIVE_MESSAGE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_RECEIVE_MESSAGE':
                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(watRequest.header.Portal_owner_id));
                dbRequest.input('WAT_Session_ID', npm_mssql.NVarChar(255), watRequest.header.Session_ID);
                dbRequest.input('WAT_User', npm_mssql.NVarChar(128), watRequest.body.WAT_User);
                dbRequest.input('Filter', npm_mssql.NVarChar(128), watRequest.body.filter);
                dbRequest.output('OUT_WAT_Message', npm_mssql.NVarChar('max'));
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await watSpExecute(dbRequest, 'WAT_INTERFACE_RECEIVE_MESSAGE');
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = resultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = resultOk({
                        "Messages": JSON.parse(dbResults.output.OUT_WAT_Message)
                    });
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_MESSAGE_ACCEPT
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_MESSAGE_ACCEPT':
                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(watRequest.header.Portal_owner_id));
                dbRequest.input('WAT_Session_ID', npm_mssql.NVarChar(255), watRequest.header.Session_ID);
                dbRequest.input('WAT_User', npm_mssql.NVarChar(128), watRequest.body.WAT_User);
                dbRequest.input('Array_of_Accepted_Message_IDs', npm_mssql.NVarChar('max'), watRequest.body.Array_of_Accepted_Message_IDs);
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await watSpExecute(dbRequest, 'WAT_INTERFACE_MESSAGE_ACCEPT');
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = resultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = resultOk({
                        "Result": "OK"
                    });
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_MOBILE_GET_KEY
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_MOBILE_GET_KEY':
                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(watRequest.header.Portal_owner_id));
                dbRequest.input('WAT_Session_ID', npm_mssql.NVarChar(255), watRequest.header.Session_ID);
                dbRequest.input('Phone_Number', npm_mssql.NVarChar(128), watRequest.body.phoneNumber);
                dbRequest.output('OUT_WAT_Message', npm_mssql.NVarChar('max'));
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await watSpExecute(dbRequest, 'WAT_INTERFACE_MOBILE_GET_KEY');
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = resultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = resultOk(
                        JSON.parse(dbResults.output.OUT_WAT_Message)
                    );
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_MOBILE_VALIDATE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_MOBILE_VALIDATE':
                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('PhoneNumber', npm_mssql.NVarChar(128), smsParams.smsPhoneNumberInDb)
                dbRequest.input('Validation_Text', npm_mssql.NVarChar(255), smsParams.smsMessage)
                dbRequest.output('OUT_WAT_Message', npm_mssql.NVarChar('max'));
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await watSpExecute(dbRequest, 'WAT_INTERFACE_MOBILE_VALIDATE')
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = resultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = resultOk(
                        JSON.parse(dbResults.output.OUT_WAT_Message)
                    );
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_MOBILE_GET_REGISTRATION_STATE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_MOBILE_GET_REGISTRATION_STATE':
                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(watRequest.header.Portal_owner_id));
                dbRequest.input('WAT_Session_ID', npm_mssql.NVarChar(255), watRequest.header.Session_ID);
                dbRequest.input('Phone_Number', npm_mssql.NVarChar(128), watRequest.body.phoneNumber);
                dbRequest.input('Registration_Key', npm_mssql.NVarChar(50), watRequest.body.registrationKey);
                dbRequest.output('OUT_WAT_Message', npm_mssql.NVarChar('max'));
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await watSpExecute(dbRequest, 'WAT_INTERFACE_MOBILE_GET_REGISTRATION_STATE')
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = resultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = resultOk(
                        JSON.parse(dbResults.output.OUT_WAT_Message)
                    );
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_MOBILE_REGISTRATION_END
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_MOBILE_REGISTRATION_END':
                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(watRequest.header.Portal_owner_id));
                dbRequest.input('WAT_Session_ID', npm_mssql.NVarChar(255), watRequest.header.Session_ID);
                dbRequest.input('Phone_Number', npm_mssql.NVarChar(128), watRequest.body.phoneNumber);
                dbRequest.input('Password', npm_mssql.NVarChar(255), watRequest.body.password);
                dbRequest.input('Registration_Key', npm_mssql.NVarChar(50), watRequest.body.registrationKey);
                dbRequest.output('OUT_WAT_Message', npm_mssql.NVarChar('max'));
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await watSpExecute(dbRequest, 'WAT_INTERFACE_MOBILE_REGISTRATION_END')
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = resultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = resultOk(
                        JSON.parse(dbResults.output.OUT_WAT_Message)
                    );
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
};
