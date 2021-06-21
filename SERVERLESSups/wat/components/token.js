const npm_mssql = require("mssql");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const dh = require("./databaseHandler")

class Token {
    constructor(params) {
        this.params = params;
    }

    async newToken() {
        this.userName = this.params.userName;
        this.registrationKey = this.params.registrationKey;
        this.token = await this.getToken(false);
    }

    async validateToken() {
        try {
            let key = await this.getTokenKey()
            let payload = jwt.verify(this.params.token, await this.getTokenKey(), {algorithm: "HS256"})
            this.userName = payload.userName
            this.registrationKey = payload.registrationKey
            this.token = await this.getToken();
        } catch (e) {
            return {
                "token": "",
                "userName": "",
                "registrationKey": ""
            }
    }

        return {
            "token": this.params.token,
            "userName": this.params.userName,
            "registrationKey": this.params.registrationKey
        }
    }

    async getTokenKey() {
        let dbConn = await dh.databaseHandler.watConnect();

        let dbRequest = new npm_mssql.Request(dbConn)
        dbRequest.input("Param_Key", npm_mssql.NVarChar(50), "TOKEN_KEY")
        dbRequest.output("OUT_Param_Value_Int", npm_mssql.Int);
        dbRequest.output("OUT_Param_Value_String", npm_mssql.NVarChar(255));

        let dbResults = await dh.databaseHandler.watSpExecute(dbRequest, "WAT_INTERFACE_GET_PARAM")

        return crypto.createHash("sha512").update(dbResults.output.OUT_Param_Value_String).digest("hex")
    }

    async generateToken() {
        try {
            let dbConn = await dh.databaseHandler.watConnect();

            let dbRequest = new npm_mssql.Request(dbConn)
            dbRequest.input("WAT_Portal_Owners_ID", npm_mssql.Int, this.params.portalOwnerId)
            dbRequest.input("User_Name", npm_mssql.NVarChar(128), this.params.userName)
            dbRequest.input("Registration_Key", npm_mssql.NVarChar(255), this.params.registrationKey)
            dbRequest.input("Password", npm_mssql.NVarChar(255), this.params.password)
            dbRequest.output("OUT_IsValidate", npm_mssql.Int);
    
            let dbResults = await dh.databaseHandler.watSpExecute(dbRequest, "WAT_INTERFACE_MOBILE_VALIDATE_USER")

            if (dbResults.output.OUT_IsValidate === 0) {
                throw "Keys not found in database"
            } else {
                let tokenKey = await this.getTokenKey()
                let payload = {
                    userName: this.params.userName,
                    registrationKey: this.params.registrationKey,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + 300 
                };
                let ret = new Map()
                ret["token"] = jwt.sign(payload, tokenKey, {algorithm: "HS256"});
                return ret;
            }
            
        } catch (error) {
            return "";
        }
    }

    async getToken(isRenewal = true) {
         if (!isRenewal) {
            return await this.generateToken();
         }

         let tokenKey = await this.getTokenKey()
         let payload = {
            userName: this.params.userName,
            registrationKey: this.params.registrationKey,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 300 
        }
        
        let ret = new Map()
        ret["token"] = jwt.sign(payload, tokenKey, {algorithm: "HS256"});
        return ret;
    }
}

module.exports.Token = Token
