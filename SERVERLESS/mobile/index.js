const npm_mssql = require('mssql');
const npm_seeme = require('seeme-js');

const version = 'v001.01.01';

const dh = require('./components/databaseHandler')
const tkn = require('./components/token');

const SEEME_config = {
    apiKey: process.env.SEEME_apiKey
};

let token = "";
let seeme;

mResultErr = (errcode, err) => {
    return {
        status: 400,
        body: {
            "header": {
                "version": version,
                "token": "",
                "result": errcode
            },
            'body': {
                "err": JSON.stringify(err)
            }
        }
    }
}

mResultOk = (result) => {
    return {
        status: 200,
        body: {
            "header": {
                "version": version,
                "token": token,
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
        dbConn = await dh.databaseHandler.watConnect();
        connected = true;

        //Step 2: Execute WAT Function
        onErrorErrCode = 'GATEWAY_ERROR_SQL-Statement failure'

        let tokenParams = "";
        let tokenizer;
        let tokenResults;

        switch (watFunction) {
            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_NEW_TOKEN
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_NEW_TOKEN':
                if (typeof watRequest.header.portalOwnerId == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.phoneNumber == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.registrationKey == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.password == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                tokenParams = {
                    "portalOwnerId" : watRequest.header.portalOwnerId,
                    "userName": watRequest.body.phoneNumber,
                    "registrationKey": watRequest.body.registrationKey,
                    "password": watRequest.body.password
                }
                tokenizer = new tkn.Token(tokenParams);
                await tokenizer.newToken();
                
                token = (tokenizer.token.token == undefined ? "" : tokenizer.token.token);

                context.res = this.mResultOk("");
            break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_SEND_MESSAGE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_SEND_MESSAGE':
                if (typeof watRequest.header.portalOwnerId == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.header.token == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.messageFrom == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.messageTo == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.messageType == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.message == 'undefined'){
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
                dbRequest.input('Message_FROM_WAT_User', npm_mssql.NVarChar(128), watRequest.body.messageFrom);
                dbRequest.input('Message_TO_WAT_User', npm_mssql.NVarChar(128), watRequest.body.messageTo);
                dbRequest.input('Message_Type', npm_mssql.Int, watRequest.body.messageType);
                dbRequest.input('WAT_Message', npm_mssql.NVarChar('max'), JSON.stringify(watRequest.body.message));
                dbRequest.output('OUT_WAT_Messages_ID', npm_mssql.Int);
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255));
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'));
                dbResults = await dh.databaseHandler.watSpExecute(dbRequest, 'WAT_INTERFACE_SEND_MESSAGE');
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = mResultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = mResultOk({
                        "Message_ID": dbResults.output.OUT_WAT_Messages_ID
                    });
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_RECEIVE_MESSAGE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_RECEIVE_MESSAGE':
                if (typeof watRequest.header.portalOwnerId == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.header.token == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.watUser == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.filter == 'undefined'){
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
                dbRequest.input('Filter', npm_mssql.NVarChar(128), watRequest.body.filter);
                dbRequest.output('OUT_WAT_Message', npm_mssql.NVarChar('max'));
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await dh.databaseHandler.watSpExecute(dbRequest, 'WAT_INTERFACE_RECEIVE_MESSAGE');
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = mResultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = mResultOk({
                        "Messages": JSON.parse(dbResults.output.OUT_WAT_Message)
                    });
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_MESSAGE_ACCEPT
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_MESSAGE_ACCEPT':
                if (typeof watRequest.header.portalOwnerId == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.header.token == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.watUser == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.arrayOfAcceptedMessageIds == 'undefined'){
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
                dbRequest.input('Array_of_Accepted_Message_IDs', npm_mssql.NVarChar('max'), watRequest.body.arrayOfAcceptedMessageIds);
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await dh.databaseHandler.watSpExecute(dbRequest, 'WAT_INTERFACE_MESSAGE_ACCEPT');
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = mResultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = mResultOk({
                        "Result": "OK"
                    });
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_MOBILE_GET_KEY
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_MOBILE_GET_KEY':
                if (typeof watRequest.header.portalOwnerId == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.header.token == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.phoneNumber == 'undefined'){
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
                dbRequest.input('Phone_Number', npm_mssql.NVarChar(128), watRequest.body.phoneNumber);
                dbRequest.output('OUT_WAT_Message', npm_mssql.NVarChar('max'));
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await dh.databaseHandler.watSpExecute(dbRequest, 'WAT_INTERFACE_MOBILE_GET_KEY');
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = mResultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = mResultOk(
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
                dbResults = await dh.databaseHandler.watSpExecute(dbRequest, 'WAT_INTERFACE_MOBILE_VALIDATE')
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = mResultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = mResultOk(
                        JSON.parse(dbResults.output.OUT_WAT_Message)
                    );
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_MOBILE_GET_REGISTRATION_STATE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_MOBILE_GET_REGISTRATION_STATE':
                if (typeof watRequest.header.portalOwnerId == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.header.token == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.phoneNumber == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.registrationKey == 'undefined'){
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
                dbRequest.input('Phone_Number', npm_mssql.NVarChar(128), watRequest.body.phoneNumber);
                dbRequest.input('Registration_Key', npm_mssql.NVarChar(50), watRequest.body.registrationKey);
                dbRequest.output('OUT_WAT_Message', npm_mssql.NVarChar('max'));
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await dh.databaseHandler.watSpExecute(dbRequest, 'WAT_INTERFACE_MOBILE_GET_REGISTRATION_STATE')
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = mResultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = mResultOk(
                        JSON.parse(dbResults.output.OUT_WAT_Message)
                    );
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_MOBILE_REGISTRATION_END
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_MOBILE_REGISTRATION_END':
                if (typeof watRequest.header.portalOwnerId == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.header.token == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.phoneNumber == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.password == 'undefined'){
                    context.res = mResultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                }

                if (typeof watRequest.body.registrationKey == 'undefined'){
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
                dbRequest.input('Phone_Number', npm_mssql.NVarChar(128), watRequest.body.phoneNumber);
                dbRequest.input('Password', npm_mssql.NVarChar(255), watRequest.body.password);
                dbRequest.input('Registration_Key', npm_mssql.NVarChar(50), watRequest.body.registrationKey);
                dbRequest.output('OUT_WAT_Message', npm_mssql.NVarChar('max'));
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await dh.databaseHandler.watSpExecute(dbRequest, 'WAT_INTERFACE_MOBILE_REGISTRATION_END')
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = mResultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = mResultOk(
                        JSON.parse(dbResults.output.OUT_WAT_Message)
                    );
                }
                break;

            default:
                context.res = mResultErr('GATEWAY_ERROR_unknown_function_call', { unknown_function: watFunction })
                break;
        }

    } catch (err) {
        context.res = mResultErr(onErrorErrCode, err)
    }

    // Disconnect
    if (connected) { dbConn.close() }
};
