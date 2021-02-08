const npm_mssql = require('mssql');

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

class DatabaseHandler {
    
    constructor() {}

    static WAT_Connect() {
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

    static WAT_SP_EXECUTE(DB_Request, Name_of_Procedure) {
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
}

module.exports.DatabaseHandler = DatabaseHandler