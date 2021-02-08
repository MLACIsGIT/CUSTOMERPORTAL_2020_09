const npm_mssql = require('mssql');
const keyGen = require('./keyGen')
const constants = require('./constants')
const DatabaseHandler = require('./databaseHandler')

class User {
    constructor(htmlReq) {
        this.mHtmlReq = htmlReq
    }

    async registration() {
        try {
            let keyGenObj = new keyGen.KeyGen(constants.KEY_TYPE_REGISTRATION_KEY, 5)
            let key = keyGenObj.getKey()

            let inputJSON = new Map();
            inputJSON['registrationKeys'] = key
            inputJSON['body'] = this.mHtmlReq.body.body
            
            let DB_Conn = await DatabaseHandler.DatabaseHandler.WAT_Connect();
            let DB_Request = new npm_mssql.Request(DB_Conn)
            
            DB_Request.input('input_JSON', npm_mssql.NVarChar('max'), JSON.stringify(inputJSON))
            DB_Request.output('OUT_result', npm_mssql.NVarChar('max'));
            let DB_Results = await DatabaseHandler.DatabaseHandler.WAT_SP_EXECUTE(DB_Request, 'IF_1001_USER_REGISTRATION')
            return JSON.parse(DB_Results.output.OUT_result);
        } catch (e) {
            let a = 'a'
        }
    }

    async registrationEnd(regKeyOverride = '') {
        try {
            let body = this.mHtmlReq.body.body;
            if (regKeyOverride !== '') {
                body.registrationKey = regKeyOverride;
            }

            let DB_Conn = await DatabaseHandler.DatabaseHandler.WAT_Connect();
            let DB_Request = new npm_mssql.Request(DB_Conn)

            DB_Request.input('input_JSON', npm_mssql.NVarChar('max'), JSON.stringify(body))
            DB_Request.output('OUT_result', npm_mssql.NVarChar('max'));
            let DB_Results = await DatabaseHandler.DatabaseHandler.WAT_SP_EXECUTE(DB_Request, 'IF_1001_USER_REGISTRATION_END')
            return JSON.parse(DB_Results.output.OUT_result);
        } catch (e) {
            let a = 'a'
        }
    }
}

module.exports.User = User