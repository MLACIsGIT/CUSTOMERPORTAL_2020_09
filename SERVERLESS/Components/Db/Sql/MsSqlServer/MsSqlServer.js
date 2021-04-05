const npm_mssql = require('mssql');

class Db {
    constructor() {
        this.dbConfig = {
            server: process.env.DB_server,
            user: process.env.DB_user,
            password: process.env.DB_password,
            database: process.env.DB_database,
            port: parseInt(process.env.DB_port),
            options: {
                encrypt: true
            },
            parseJSON: true
        };

        this.conn = undefined;
        this.connected = false;
    }

    isConnected() {
        return this.connected;
    }

    getNewRequest() {
        return new npm_mssql.Request(this.conn)
    }

    _pConnect() {
        try {
            return new Promise((resolve, reject) => {
                let Pool = new npm_mssql.ConnectionPool(this.dbConfig);
                Pool.connect(function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        this.connected = true;
                        resolve(Pool);
                    }
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    async connect() {
        try {
            if (!this.connected) {
                this.conn = await this._pConnect();
            }
            this.connected = true;
            console.log("-- C O N N E C T E D --")
        } catch (error) {
            this.connected = false;
        }
        return this.connected;
    }



    async disconnect() {
        if (this.connected) {
            try {
                this.conn.close();
                this.connected = false;
                console.log("-- D I S C O N N E C T E D --")
            } catch (error) {
                this.connected = false;
            }
        }
    }

    select(sqlSelect) {
        return new Promise((resolve, reject) => {
            let DB_Req = new npm_mssql.Request(DB_Conn);
            DB_Req.query(sqlSelect, function (err, recordset) {
                if (err) {
                    reject(err);
                } else {
                    resolve(recordset);
                }
            })
        })
    }

    async spExecute(dbRequest, nameOfProcedure) {
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

module.exports.Db = Db

