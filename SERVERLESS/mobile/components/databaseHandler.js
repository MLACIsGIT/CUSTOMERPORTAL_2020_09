const npm_mssql = require('mssql');

const dbConfig = {
    server: process.env.DB_server,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    port: parseInt(process.env.DB_port),
    options: {
        encrypt: true
    }
};

class databaseHandler {
    
    constructor() {}

    static watConnect() {
        return new Promise((resolve, reject) => {
            let pool = new npm_mssql.ConnectionPool(dbConfig);
            pool.connect(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(pool);
                }
            })
        })
    }

    static watSpExecute(dbRequest, nameOfProcedure) {
        return new Promise((resolve, reject) => {
            dbRequest.execute(nameOfProcedure, function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        })
    }
}

module.exports.databaseHandler = databaseHandler