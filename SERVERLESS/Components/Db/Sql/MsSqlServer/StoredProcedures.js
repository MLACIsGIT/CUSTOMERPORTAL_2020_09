const npm_mssql = require('mssql');

class StoredProcedures {
    constructor(db) {
        this.db = db;
    }

    async WAT_INTERFACE_RegisterUser(params, outParams) {
        let dbRequest = this.db.getNewRequest();
        outParams = {};

        dbRequest.input("WAT_Portal_Owners_ID", npm_mssql.Int, params.portalOwnersId);
        dbRequest.input("WAT_UserLevels_ID", npm_mssql.Int, params.userLevel);
        dbRequest.input("Name1", npm_mssql.NVarChar(100), params.name);
        dbRequest.input("Email", npm_mssql.NVarChar(128), params.email);
        dbRequest.input("Password_hash", npm_mssql.NVarChar(1024), params.passwordHash);

        try {
            await this.db.spExecute(dbRequest, "WAT_INTERFACE_RegisterUser");
            return true;
        } catch (error) {
            return false;
        }
    }

    async WAT_INTERFACE_getUser(params) {
        let dbRequest = this.db.getNewRequest();
        let outParams = {
            result: false
        };

        dbRequest.input("WAT_Portal_Owners_ID", npm_mssql.Int, params.portalOwnersId);
        dbRequest.input("Email", npm_mssql.NVarChar(128), params.email);
        dbRequest.input("PasswordHash", npm_mssql.NVarChar(1024), params.passwordHash);
        dbRequest.input("Salt", npm_mssql.Int, params.salt);
        dbRequest.output("OUT_Result", npm_mssql.Boolean);
        dbRequest.output("OUT_UserId", npm_mssql.Int);
        dbRequest.output("OUT_UserLevel", npm_mssql.Int);
        dbRequest.output("OUT_CurrentUTC", npm_mssql.DateTime);
        dbRequest.output("OUT_ValidUntil", npm_mssql.DateTime);
        dbRequest.output("OUT_TokenKey", npm_mssql.NVarChar(20));

        try {
            let dbResults = await this.db.spExecute(dbRequest, "WAT_INTERFACE_getUser")
            outParams.result = (dbResults.output.OUT_Result) ? true : false;
            if (outParams.result === true) {
                outParams.userId = dbResults.output.OUT_UserId
                outParams.userLevel = dbResults.output.OUT_UserLevel
                outParams.currentUTC = dbResults.output.OUT_CurrentUTC
                outParams.validUntil = dbResults.output.OUT_ValidUntil
                outParams.tokenKey = dbResults.output.OUT_TokenKey

                return outParams
            }
        } catch (error) {
            return outParams;
        }
    }
}

module.exports.StoredProcedures = StoredProcedures;
