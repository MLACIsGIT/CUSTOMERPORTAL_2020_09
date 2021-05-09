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
        dbRequest.input("Salt", npm_mssql.NVarChar(50), params.salt);
        dbRequest.output("OUT_Result", npm_mssql.Bit);
        dbRequest.output("OUT_UserId", npm_mssql.Int);
        dbRequest.output("OUT_UserLevel", npm_mssql.NVarChar(20));
        dbRequest.output("OUT_CurrentUTC", npm_mssql.DateTime);
        dbRequest.output("OUT_ValidUntil", npm_mssql.DateTime);
        dbRequest.output("OUT_PasswordUpdateRequired", npm_mssql.Bit);
        dbRequest.output("OUT_TokenKey", npm_mssql.NVarChar(20));
        dbRequest.output("OUT_Params", npm_mssql.NVarChar('max'))

        try {
            let dbResults;
            dbResults = await this.db.spExecute(dbRequest, "WAT_INTERFACE_getUser")
            if (dbResults.output.OUT_Result && dbResults.output.OUT_UserId) {
                outParams = {
                    result: true,
                    userId: dbResults.output.OUT_UserId,
                    userLevel: dbResults.output.OUT_UserLevel,
                    currentUTC: dbResults.output.OUT_CurrentUTC,
                    validUntil: dbResults.output.OUT_ValidUntil,
                    passwordUpdateRequired: dbResults.output.OUT_PasswordUpdateRequired,
                    tokenKey: dbResults.output.OUT_TokenKey,
                    params: dbResults.output.OUT_Params
                }
            }
        } catch (error) {
            console.error(error);
        }

        return outParams;
    }

    async WAT_INTERFACE_extendTokenValidity(params) {
        let dbRequest = this.db.getNewRequest();
        let outParams = {
            result: false
        };

        dbRequest.input("WAT_Portal_Owners_ID", npm_mssql.Int, params.portalOwnersId);
        dbRequest.input("userId", npm_mssql.Int, params.userId);
        dbRequest.input("hashShorthand", npm_mssql.NVarChar(1024), params.hashShorthand);
        dbRequest.input("salt", npm_mssql.NVarChar(50), params.salt);
        dbRequest.output("OUT_Result", npm_mssql.Bit);
        dbRequest.output("OUT_CurrentUTC", npm_mssql.DateTime);
        dbRequest.output("OUT_ValidUntil", npm_mssql.DateTime);

        try {
            let dbResults;
            dbResults = await this.db.spExecute(dbRequest, "WAT_INTERFACE_extendTokenValdity")
            if (dbResults.output.OUT_Result) {
                outParams = {
                    result: true,
                    currentUTC: dbResults.output.OUT_CurrentUTC,
                    validUntil: dbResults.output.OUT_ValidUntil
                }
            }
        } catch (error) {
            console.error(error);
        }

        return outParams;
    }

    async WAT_INTERFACE_changePassword(params) {
        let dbRequest = this.db.getNewRequest();
        let outParams = {
            result: false
        };

        dbRequest.input("WAT_Portal_Owners_ID", npm_mssql.Int, params.portalOwnersId);
        dbRequest.input("userId", npm_mssql.Int, params.userId);
        dbRequest.input("currentToken_hashShorthand", npm_mssql.NVarChar(1024), params.currentToken_hashShorthand);
        dbRequest.input("currentToken_salt", npm_mssql.VarChar(50), params.currentToken_salt);
        dbRequest.input("newPassword_hash", npm_mssql.VarChar(1024), params.newPassword_hash);
        dbRequest.input("newPassword_updateRequired", npm_mssql.Bit, params.newPassword_updateRequired)

        dbRequest.output("OUT_Result", npm_mssql.Bit);

        try {
            let dbResults;
            dbResults = await this.db.spExecute(dbRequest, "WAT_INTERFACE_changePassword")
            if (dbResults.output.OUT_Result) {
                outParams = {
                    result: true,
                }
            }
        } catch (error) {
            console.error(error);
        }

        return outParams;
    }

    async WAT_INTERFACE_getJwtTokenkey(params) {
        let dbRequest = this.db.getNewRequest();

        dbRequest.input("WAT_Portal_Owners_ID", npm_mssql.Int, params.portalOwnersId);
        dbRequest.output("OUT_Result", npm_mssql.Bit);
        dbRequest.output("OUT_TokenKey", npm_mssql.NVarChar(20));

        try {
            let dbResults = await this.db.spExecute(dbRequest, "WAT_INTERFACE_getJwtTokenkey")
            if (!dbResults.output.OUT_Result) {
                return ""
            }
            return dbResults.output.OUT_TokenKey
        } catch (error) {
            return outParams;
        }
    }

    async WAT_INTERFACE_getUserParams(params) {
        let dbRequest = this.db.getNewRequest();
        let outParams = {
            result: false
        };

        dbRequest.input("WAT_Portal_Owners_ID", npm_mssql.Int, params.portalOwnersId);
        dbRequest.input("userId", npm_mssql.Int, params.userId);
        dbRequest.output("OUT_Users_Params", npm_mssql.NVarChar('max'));
        dbRequest.output("OUT_UserLevel_Params", npm_mssql.NVarChar('max'));
        dbRequest.output("OUT_Portal_Owners_Params", npm_mssql.NVarChar('max'));
        dbRequest.output("OUT_Results", npm_mssql.NVarChar(255));

        try {
            let dbResults = await this.db.spExecute(dbRequest, "WAT_Portal_Owners_ID")
            if (dbResults.output.OUT_Result === "ok") {
                outParams = {
                    result: true,
                    userParams: dbRequest.output.OUT_User_Params,
                    userLevelParams: dbRequest.output.OUT_UserLevelParams,
                    portalOwnerParams: dbRequest.output.OUT_Portal_Owners_Params
                }
            }
        } catch (error) {
            console.error(error);
        }

        return outParams;
    }

    async WAT_INTERFACE_getRecordsetParams(params) {
        let dbRequest = this.db.getNewRequest();
        let outParams = {
            result: false
        };

        let sqlTop = params.TOP ?? 0

        dbRequest.input("WAT_Portal_Owners_ID", npm_mssql.Int, params.portalOwnersId);
        dbRequest.input("UsersID", npm_mssql.Int, params.usersId);
        dbRequest.input('TableCode', npm_mssql.NVarChar(10), params.tableCode);
        dbRequest.input('TOP', npm_mssql.Int, sqlTop);
        dbRequest.input('FROM', npm_mssql.NVarChar('max'), params.FROM);
        dbRequest.input('WHERE', npm_mssql.NVarChar('max'), params.WHERE);
        dbRequest.input('GROUP_BY', npm_mssql.NVarChar('max'), params.GROUP_BY);
        dbRequest.output("OUT_countOfRows", npm_mssql.Int);
        dbRequest.output("OUT_Result", npm_mssql.NVarChar(255));

        try {
            let dbResults = await this.db.spExecute(dbRequest, "WAT_INTERFACE_GET_RECORDSET_PARAMS")

            if (dbResults.output.OUT_Result === "ok") {
                outParams = {
                    result: true,
                    countOfRecords: dbResults.output.countOfRows
                }
            }

        } catch (error) {
            console.error(error);
        }

        return outParams
    }

    async WAT_INTERFACE_getData(params, outParams) {
        let dbRequest = this.db.getNewRequest();
        outParams = {
            result: false
        };

        let sqlTop = dbRequest.body.TOP ?? 0

        dbRequest.input("WAT_Portal_Owners_ID", npm_mssql.Int, params.portalOwnersId);
        dbRequest.input("UsersID", npm_mssql.Int, params.usersId);
        dbRequest.input('Lang', npm_mssql.NVarChar('max'), params.lang);
        dbRequest.input('TableCode', npm_mssql.NVarChar(10), params.tableCode);
        dbRequest.input('SELECT', npm_mssql.NVarChar('max'), params.SELECT);
        dbRequest.input('TOP', npm_mssql.Int, sqlTop);
        dbRequest.input('FROM', npm_mssql.NVarChar('max'), params.FROM);
        dbRequest.input('WHERE', npm_mssql.NVarChar('max'), params.WHERE);
        dbRequest.input('GROUP_BY', npm_mssql.NVarChar('max'), params.GROUP_BY);
        dbRequest.input('ORDER_BY', npm_mssql.NVarChar('max'), params.ORDER_BY);
        dbRequest.input('Lang', npm_mssql.NVarChar(10), params.lang);

        dbRequest.input('PAGE_NO', npm_mssql.Int, params.pageNo);
        dbRequest.input('ROWS_PER_PAGE', npm_mssql.Int, params.rowsPerPage);

        try {
            let dbResults = await this.db.spExecute(dbRequest, "WAT_INTERFACE_GET_DATA")

            if (dbResults.output.OUT_ErrCode === "") {
                outParams = {
                    result: true,
                    countOfRecords: dbResults.recordset['length'],
                    columns: dbResults.recordset['columns'],
                    data: dbResults.recordset
                }
            } else {
                outParams = {
                    result: false
                }
            }
        } catch (error) {
            outParams = {
                result: false
            }
        }

        return outParams
    }
}

module.exports.StoredProcedures = StoredProcedures;
