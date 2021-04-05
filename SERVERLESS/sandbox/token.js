const npm_mssql = require('mssql');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const DatabaseHandler = require('./databaseHandler')

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

class Token {
    constructor(htmlReq) {
        this.mHtmlReq = htmlReq.body;
    }

    async validateToken() {
        if (this.mHtmlReq.header.taskType === 'TKN') {
            this.mUserName = this.mHtmlReq.body.userName;
            this.mRegistrationKey = this.mHtmlReq.body.registrationKey;
            this.mToken = await this.getToken(false);
        } else {
            try {
                let token = this.mHtmlReq.token
                if (token === undefined) {
                    // TODO error message
                }
                let key = await this.getTokenKey()
                let payload = jwt.verify(token, await this.getTokenKey(), {algorithm: 'HS256'})
                this.mUserName = payload.userName
                this.mRegistrationKey = payload.registrationKey
                this.mToken = await this.getToken();
            } catch (e) {
                // TODO add error handling
            }
        }

        return {
            'token': this.mToken,
            'userName': this.mUserName,
            'registrationKey': this.mRegistrationKey
        }
    }

    async getTokenKey() {
        let DB_Conn = await DatabaseHandler.DatabaseHandler.WAT_Connect();
        let DB_Request = new npm_mssql.Request(DB_Conn)
        DB_Request.input('input_JSON', npm_mssql.NVarChar('max'), '{"ParamKey":"TOKEN_KEY"}')
        DB_Request.output('OUT_result', npm_mssql.NVarChar('max'));
        let DB_Results = await DatabaseHandler.DatabaseHandler.WAT_SP_EXECUTE(DB_Request, 'IF_1001_GET_PARAM')
        let tokenResultObj = JSON.parse(DB_Results.output.OUT_result)
        return crypto.createHash('sha512').update(tokenResultObj[0].ParamValueString).digest('hex')
    }

    async generateToken() {
        try {
            let inputParams = new Map();
            inputParams['userName'] = this.mUserName;
            inputParams['registrationKey'] = this.mRegistrationKey;
            inputParams['masterKey'] = this.mHtmlReq.body.masterKey;
            let DB_Conn = await DatabaseHandler.DatabaseHandler.WAT_Connect();
            let DB_Request = new npm_mssql.Request(DB_Conn)
            DB_Request.input('input_JSON', npm_mssql.NVarChar('max'), JSON.stringify(inputParams))
            DB_Request.output('OUT_result', npm_mssql.NVarChar('max'));
            let DB_Results = await DatabaseHandler.DatabaseHandler.WAT_SP_EXECUTE(DB_Request, 'IF_1001_VALIDATE_USER')
            let resultObj = JSON.parse(DB_Results.output.OUT_result)
            if (resultObj[0].masterKey === '' || resultObj[0].registrationKey === '') {
                throw 'Keys not found in database'
            } else {
                this.mActive = resultObj[0].mActive
                let tokenKey = await this.getTokenKey()
                let payload = {
                    userName: this.mUserName,
                    registrationKey: this.mRegistrationKey,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + 300 
                };
                let ret = new Map()
                ret['token'] = jwt.sign(payload, tokenKey, {algorithm: 'HS256'});
                return ret;
            }
            
        } catch (error) {
            return '';
        }
    }

    async getToken(isRenewal = true) {
         if (!isRenewal) {
            return await this.generateToken();
         }
         let tokenKey = await this.getTokenKey()
         let payload = {
            userName: this.mUserName,
            registrationKey: this.mRegistrationKey,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 300 
        }
        
        let ret = new Map()
        ret['token'] = jwt.sign(payload, tokenKey, {algorithm: 'HS256'});
        return ret;
    }
}

module.exports.Token = Token
