const npm_mssql = require('mssql');
const npm_seeme = require('seeme-js');
//const npm_http = require('http')
//const npm_path = require('path')

const version = 'v001.01.01';

const DB_config = {
    server: process.env.DB_server,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    port: parseInt(process.env.DB_port),
    options: {
        encrypt: true
    }
};

const SEEME_config = {
    apiKey: process.env.SEEME_apiKey
};

let request_id = "#";
let seeme;

Result_ERR = (errcode, err) => {
    return {
        status: 200,
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

Result_OK = (result) => {
    return {
        status: 200,
        body: {
            "header": {
                "version": version,
                "request_id": request_id,
                "result": "OK"
            },
            'body': result
        }
    }
}

function WAT_Connect() {
    return new Promise((resolve, reject) => {
        let Pool = new npm_mssql.ConnectionPool(DB_config);
        Pool.connect(function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(Pool);
            }
        })
    })
}

function WAT_SELECT(DB_Conn, SQL_SELECT) {
    return new Promise((resolve, reject) => {
        let DB_Req = new npm_mssql.Request(DB_Conn);
        DB_Req.query(SQL_SELECT, function (err, recordset) {
            if (err) {
                reject(err);
            } else {
                resolve(recordset);
            }
        })
    })
}

function WAT_SP_EXECUTE(DB_Request, Name_of_Procedure) {
    return new Promise((resolve, reject) => {
        DB_Request.execute(Name_of_Procedure, function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

module.exports = async function (context, req) {
    /*
    //-------------------------------------------------------------------------------------------------------------------------------
    // SEEME SMS Send Test - Send an sms to seeme sms number and this code sends an sms to your phone number the incomming text
    //-------------------------------------------------------------------------------------------------------------------------------

    try {
        const seeme = new npm_seeme.SeeMeGateway(SEEME_config);

        DB_Results = await seeme.sendSMS('36209213679', (JSON.stringify(context)))
        context.res = {
            status: 200,
            body: JSON.stringify(DB_Results)
        };

        return;
    } catch (e) {
        console.error(e);
    }
    return;
    */

    //-------------------------------------------------------------------------------------------------------------------------------
    // RECEIVE SEEME SMS
    // In Content comes the following message for example:
    // {"invocationId":"54539184-a8be-476c-b8e6-dae526015023","traceContext":{"traceparent":"00-0cb1b2a3c9de06429de68afcc574bd1c-8fd7cfe3915a2a4f-00","traceste":"","attributes":{}},"executionContext":{"invocationId":"54539184-a8be-476c-b8e6-dae526015023","functionName":"trial","functionDirectory":"D:\\hote\\wwwroot\\trial"},"bindings":{"req":{"method":"GET","url":"https://selester-trial-ml-001.azurewebsites.net/api/trial?message=WAT+1003&number=3679&destination=36303444293&timestamp=20201126153618","originalUrl":"https://selester-trial-ml-001.azurewebsites.net/api/trial?message=WAT+1003&number=36209213679&destination=36303444293&timestamp=20201126153618","headers":{"accept":"*/*","connection":"Keep-Alive","host":"selester-trial-ml-001.azurewebsits.net","max-forwards":"9","x-waws-unencoded-url":"/api/trial?message=WAT+1003&number=36209213679&destination=36303444293&timestamp=20201126153618","client-ip":"10.0.128.14:54430","x-arr-log-id":"aba65f1a-8b8a-4c97-9c41-382df5542642","x-site-deployment-id":"SELESTER-TRIAL-ML-001","was-default-hostname":"selester-trial-ml-001.azurewebsites.net","x-original-url":"/api/trial?message=WAT+1003&number=36209213679&destination=36303444293&timestamp=20201126153618","x-forwarded-for":"80.249.169.123:47364","x-arr-ssl":"2048|256|C=US, S=Washington, L=Redmond, O=Microsoft Corporation, OU=Microsoft IT, CN=Microsoft ITLS CA 5|CN=*.azurewebsites.net","x-forwarded-proto":"https","x-appservice-proto":"https","x-forwarded-tlsversion":"1.2","disguised-
    //-------------------------------------------------------------------------------------------------------------------------------

    let SMS_Params = {
        SMS_Type: "NOT_VALID",
        SMS_PhoneNumber: "",
        SMS_PhoneNumber_InDB: "",
        SMS_Message: ""
    }

    let DB_Conn;
    let DB_Request;
    let DB_Results;
    let On_Error_ErrCode = '';
    let Connected = false;

    let WAT_Request = "";
    let WAT_function = "";

    try {
        let originalUrl = context.bindings.req.originalUrl;
        let originalMessage = ((originalUrl.split("?message="))[1]).split("&");
        SMS_Params.SMS_PhoneNumber = ((originalMessage[1]).split("="))[1];
        SMS_Params.SMS_Message = (originalMessage[0]).replace("+", " ");

        if ((SMS_Params.SMS_Message).substr(0, 4) === "WAT " && SMS_Params.SMS_PhoneNumber > '') {
            SMS_Params.SMS_Type = 'VALIDATION';
            WAT_function = 'WAT_INTERFACE_PHONENUMBER_VALIDATE';
            SMS_Params.SMS_PhoneNumber_InDB = (SMS_Params.SMS_PhoneNumber.substr(0, 2) != "00") ? "00" + SMS_Params.SMS_PhoneNumber : SMS_Params.SMS_PhoneNumber;
        }

    } catch (error) {
        // nothing to do
    }

    if (SMS_Params.SMS_Type === "NOT_VALID") {
        if (req.body == undefined) {
            context.res = {
                status: 200,
                body: `SELEXPED CUSTOMER PORTAL SERVERLESS AZURE FUNCTION VERSION ${version} is ready to go.`
            };
            return;
        }
    }

    try {
        WAT_Request = req.body;
        WAT_function = (WAT_Request.header.function) ? WAT_Request.header.function : '';
    } catch (error) {
        // nothing to do    
    }

    try {
        //Step 1: connection
        On_Error_ErrCode = 'GATEWAY_ERROR_DB-Connect' // Procedure returns this errorcode if the next statement fails. 
        DB_Conn = await WAT_Connect();
        Connected = true;

        //Step 2: Execute WAT Function
        On_Error_ErrCode = 'GATEWAY_ERROR_SQL-Statement failure'

        switch (WAT_function) {
            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_PHONENUMBER_VALIDATE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_PHONENUMBER_VALIDATE':
                DB_Request = new npm_mssql.Request(DB_Conn)
                DB_Request.input('PhoneNumber', npm_mssql.NVarChar(128), SMS_Params.SMS_PhoneNumber_InDB)
                DB_Request.input('Validation_Text', npm_mssql.NVarChar(255), SMS_Params.SMS_Message)
                DB_Request.output('OUT_IsValidated', npm_mssql.Int)
                DB_Request.output('OUT_Lang', npm_mssql.NVarChar(3))
                DB_Request.output('OUT_URL_for_Start', npm_mssql.NVarChar('max'))
                DB_Request.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                DB_Request.output('OUT_ErrParams', npm_mssql.NVarChar('max'))

                DB_Results = await WAT_SP_EXECUTE(DB_Request, 'WAT_INTERFACE_PHONENUMBER_VALIDATE')

                context.res = Result_OK({
                    "IsValidated": true
                })

                if (DB_Results.output.OUT_ErrCode != "") {
                    context.res = Result_ERR(DB_Results.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": DB_Results.returnValue,
                            "ErrCode": DB_Results.output.OUT_ErrCode,
                            "ErrParams": DB_Results.output.OUT_ErrParams
                        }
                    })
                } else {
                    if (DB_Results.output.OUT_IsValidated == 1) {
                        let SMS_Response = '';

                        switch (DB_Results.output.OUT_Lang) {
                            case "hu":
                                SMS_Response = `Köszönjük, hogy regisztrált a Web&Trace-en! Kérjük lépjen be a következő címen: ${DB_Results.output.OUT_URL_for_Start}`
                                break;

                            default:
                                SMS_Response = `Your phonenumber was validated. Please visit ${DB_Results.output.OUT_URL_for_Start} and login!`
                        }

                        seeme = new npm_seeme.SeeMeGateway(SEEME_config);

                        DB_Results = await seeme.sendSMS(SMS_Params.SMS_PhoneNumber, SMS_Response);
                        context.res = {
                            status: 200,
                            body: JSON.stringify(DB_Results)
                        };

                        context.res = Result_OK({
                            "IsValidated": true
                        })
                    }
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_SEND_MESSAGE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_SEND_MESSAGE':
                DB_Request = new npm_mssql.Request(DB_Conn)
                DB_Request.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(WAT_Request.header.Portal_owner_id));
                DB_Request.input('WAT_Session_ID', npm_mssql.NVarChar(255), WAT_Request.header.Session_ID);
                DB_Request.input('Message_FROM_WAT_User', npm_mssql.NVarChar(128), WAT_Request.body.Message_FROM);
                DB_Request.input('Message_TO_WAT_User', npm_mssql.NVarChar(128), WAT_Request.body.Message_TO);
                DB_Request.input('Message_Type', npm_mssql.Int, WAT_Request.body.Message_Type);
                DB_Request.input('WAT_Message', npm_mssql.NVarChar('max'), WAT_Request.body.Message);
                DB_Request.output('OUT_WAT_Messages_ID', npm_mssql.Int);
                DB_Request.output('OUT_ErrCode', npm_mssql.NVarChar(255));
                DB_Request.output('OUT_ErrParams', npm_mssql.NVarChar('max'));
                DB_Results = await WAT_SP_EXECUTE(DB_Request, 'WAT_INTERFACE_SEND_MESSAGE');
                if (DB_Results.output.OUT_ErrCode != "") {
                    context.res = Result_ERR(DB_Results.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": DB_Results.returnValue,
                            "ErrCode": DB_Results.output.OUT_ErrCode,
                            "ErrParams": DB_Results.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = Result_OK({
                        "Message_ID": DB_Results.output.OUT_WAT_Messages_ID
                    });
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_RECEIVE_MESSAGE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_RECEIVE_MESSAGE':
                DB_Request = new npm_mssql.Request(DB_Conn)
                DB_Request.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(WAT_Request.header.Portal_owner_id));
                DB_Request.input('WAT_Session_ID', npm_mssql.NVarChar(255), WAT_Request.header.Session_ID);
                DB_Request.input('WAT_User', npm_mssql.NVarChar(128), WAT_Request.body.WAT_User);
                DB_Request.output('OUT_WAT_Message', npm_mssql.NVarChar('max'));
                DB_Request.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                DB_Request.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                DB_Results = await WAT_SP_EXECUTE(DB_Request, 'WAT_INTERFACE_RECEIVE_MESSAGE');
                if (DB_Results.output.OUT_ErrCode != "") {
                    context.res = Result_ERR(DB_Results.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": DB_Results.returnValue,
                            "ErrCode": DB_Results.output.OUT_ErrCode,
                            "ErrParams": DB_Results.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = Result_OK({
                        "Message": DB_Results.output.OUT_WAT_Message
                    });
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_MESSAGE_ACCEPT
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_MESSAGE_ACCEPT':
                DB_Request = new npm_mssql.Request(DB_Conn)
                DB_Request.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(WAT_Request.header.Portal_owner_id));
                DB_Request.input('WAT_Session_ID', npm_mssql.NVarChar(255), WAT_Request.header.Session_ID);
                DB_Request.input('WAT_User', npm_mssql.NVarChar(128), WAT_Request.body.WAT_User);
                DB_Request.input('Array_of_Accepted_Message_IDs', npm_mssql.NVarChar('max'), WAT_Request.body.Array_of_Accepted_Message_IDs);
                DB_Request.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                DB_Request.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                DB_Results = await WAT_SP_EXECUTE(DB_Request, 'WAT_INTERFACE_MESSAGE_ACCEPT');
                if (DB_Results.output.OUT_ErrCode != "") {
                    context.res = Result_ERR(DB_Results.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": DB_Results.returnValue,
                            "ErrCode": DB_Results.output.OUT_ErrCode,
                            "ErrParams": DB_Results.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = Result_OK({});
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_SESSION_GET_NEW
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_SESSION_GET_NEW':
                DB_Request = new npm_mssql.Request(DB_Conn)
                DB_Request.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(WAT_Request.header.Portal_owner_id))
                DB_Request.input('Login', npm_mssql.NVarChar(255), WAT_Request.body.Login)
                DB_Request.output('OUT_WAT_Session_ID', npm_mssql.NVarChar(255))
                DB_Request.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                DB_Request.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                DB_Results = await WAT_SP_EXECUTE(DB_Request, 'WAT_INTERFACE_SESSION_GET_NEW')

                if (DB_Results.output.OUT_ErrCode != "") {
                    context.res = Result_ERR(DB_Results.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": DB_Results.returnValue,
                            "ErrCode": DB_Results.output.OUT_ErrCode,
                            "ErrParams": DB_Results.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = Result_OK({
                        "Session_ID": JSON.parse(DB_Results.output.OUT_WAT_Session_ID)
                    })
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_SESSION_ENABLE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_SESSION_ENABLE':
                DB_Request = new npm_mssql.Request(DB_Conn)
                DB_Request.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(WAT_Request.header.Portal_owner_id))
                DB_Request.input('Login', npm_mssql.VarChar(255), WAT_Request.body.Login)
                DB_Request.input('WAT_Session_ID', npm_mssql.VarChar(255), WAT_Request.body.Session_ID)
                DB_Request.input('Code_And_Pass_hash', npm_mssql.VarChar(255), WAT_Request.body.Code_And_Pass_hash)
                DB_Request.output('OUT_IsEnabled', npm_mssql.Bit)
                DB_Request.output('OUT_UserLevel_Params', npm_mssql.NVarChar(npm_mssql.MAX))
                DB_Results = await WAT_SP_EXECUTE(DB_Request, 'WAT_INTERFACE_SESSION_ENABLE')

                if (!DB_Results.output.OUT_IsEnabled) {
                    context.res = Result_ERR('Credential_data_Incorrect', { ReturnValue: DB_Results.returnValue, ErrParams: "" })
                } else {
                    context.res = Result_OK({
                        "Session_Params": DB_Results.output.OUT_UserLevel_Params
                    })
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_PHONENUMBER_ADD
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_PHONENUMBER_ADD':
                DB_Request = new npm_mssql.Request(DB_Conn)
                DB_Request.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(WAT_Request.header.Portal_owner_id))
                DB_Request.input('PhoneNumber', npm_mssql.NVarChar(128), WAT_Request.body.PhoneNumber)
                DB_Request.input('Pass', npm_mssql.NVarChar(50), WAT_Request.body.Pass)
                DB_Request.input('Lang', npm_mssql.NVarChar(3), WAT_Request.body.Lang)
                DB_Request.input('GDPR_Agreement_Vers', npm_mssql.NVarChar(50), WAT_Request.body.GDPR_Agreement_Vers)
                DB_Request.output('OUT_SMS_PhoneNumber', npm_mssql.NVarChar(128))
                DB_Request.output('OUT_SMS_Text', npm_mssql.NVarChar(255))
                DB_Request.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                DB_Request.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                DB_Results = await WAT_SP_EXECUTE(DB_Request, 'WAT_INTERFACE_PHONENUMBER_ADD')

                if (DB_Results.output.OUT_ErrCode != "") {
                    context.res = Result_ERR(DB_Results.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": DB_Results.returnValue,
                            "ErrCode": DB_Results.output.OUT_ErrCode,
                            "ErrParams": DB_Results.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = Result_OK({
                        "SMS_PhoneNumber": DB_Results.output.OUT_SMS_PhoneNumber,
                        "SMS_Text": DB_Results.output.OUT_SMS_Text
                    })
                }
                break;

            default:
                context.res = Result_ERR('GATEWAY_ERROR_unknown_function_call', { unknown_function: WAT_function })
                break;
        }
        /*
                Pelda SELECT utasitasra:
                On_Error_ErrCode = 'GATEWAY_ERROR_SQL-Statement failure'
                DB_Recordset = await WAT_SELECT(DB_Conn, "select * from WAT_Users")
        
                //Step 3: Result_OK
                context.res = Result_OK({ DB_Recordset })
        */
    } catch (err) {
        context.res = Result_ERR(On_Error_ErrCode, err)
    }

    // Disconnect
    if (Connected) { DB_Conn.close() }
};

