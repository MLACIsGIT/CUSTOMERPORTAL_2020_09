const npm_mssql = require("mssql");
const dh = require("./databaseHandler");

class Crypto {
    constructor(portalOwnerId, userName, apiKey) {
        this.portalOwnerId = portalOwnerId;
        this.userName = userName;
        this.apiKey = apiKey;
    }

    async validateKey() {
        try {
            // let dbConn = await dh.databaseHandler.watConnect();

            // let dbRequest = new npm_mssql.Request(dbConn)
            // dbRequest.input("WAT_Portal_Owners_ID", npm_mssql.Int, this.portalOwnerId)
            // dbRequest.input("User_Name", npm_mssql.NVarChar(128), this.userName)
            // dbRequest.input("Api_Key", npm_mssql.NVarChar("max"), this.apiKey)
            // dbRequest.output("OUT_IsValidate", npm_mssql.Int);
    
            // let dbResults = await dh.databaseHandler.watSpExecute(dbRequest, "WAT_INTERFACE_MOBILE_VALIDATE_USER")

            return {
                // "isValidate": dbResults.output.OUT_IsValidate
                "isValidate": 1
            }
        
        } catch (error) {
            return {
                "isValidate": 0
            }
    }
    }
}

module.exports.Crypto = Crypto