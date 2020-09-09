const npm_mssql = require('mssql');
//const npm_http = require('http')
//const npm_path = require('path')

const version = 'v001.01.01';

let DB_config = {
    server: process.env.DB_server,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    port: parseInt(process.env.DB_port),
    options: {
        encrypt: true
    }
};

let request_id = "#";

Result_ERR = (errcode, err) => {
    return {
        status: 200,
        body: {
            "header": {
                "version": version,
                "request_id": request_id,
                "result": errcode
            },
            'body': {
                "err": err
            }
        }
    }
}

Result_OK = (result) => {
    return {
        status: 200,
        body: {
            "header": {
                "version": version,
                "request_id": request_id,
                "result": "OK"
            },
            'body': result
        }
    }
}

function WAT_Connect() {
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

function WAT_SELECT(DB_Conn, SQL_SELECT) {
    return new Promise((resolve, reject) => {
        let DB_Req = new npm_mssql.Request(DB_Conn);
        DB_Req.query(SQL_SELECT, function (err, recordset) {
            if (err) {
                reject(err);
            } else {
                resolve(recordset);
            }
        })
    })
}

function WAT_SP_EXECUTE(DB_Request, Name_of_Procedure) {
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

module.exports = async function (context, req) {
    let WAT_Request = req.body;
    let WAT_function = WAT_Request.header.function ? WAT_Request.header.function : '';

    let DB_Conn;
    let DB_Request;
    let DB_Results;
    let On_Error_ErrCode = '';
    let Connected = false;

    try {
        //Step 1: connection
        On_Error_ErrCode = 'GATEWAY_ERROR_DB-Connect' // Procedure returns this errorcode if the next statement fails. 
        DB_Conn = await WAT_Connect();
        Connected = true;

        //Step 2: Execute WAT Function
        On_Error_ErrCode = 'GATEWAY_ERROR_SQL-Statement failure'
        switch (WAT_function) {
            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_SESSION_GET_NEW
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_SESSION_GET_NEW':
                DB_Request = new npm_mssql.Request(DB_Conn)
                DB_Request.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(WAT_Request.header.Portal_owner_id))
                DB_Request.input('Login', npm_mssql.NVarChar(255), WAT_Request.body.Login)
                DB_Request.output('OUT_WAT_Session_ID', npm_mssql.NVarChar(255))
                DB_Request.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                DB_Request.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                DB_Results = await WAT_SP_EXECUTE(DB_Request, 'WAT_INTERFACE_SESSION_GET_NEW')

                if (DB_Results.output.OUT_ErrCode != "") {
                    context.res = Result_ERR(DB_Results.output.OUT_ErrCode, { 
                        "ReturnValues": {
                            "ReturnValue": DB_Results.returnValue,
                            "ErrCode": DB_Results.output.OUT_ErrCode,
                            "ErrParams": DB_Results.output.OUT_ErrParams
                        }
                    })
                } else {
                    context.res = Result_OK({
                        "Session_ID": JSON.parse( DB_Results.output.OUT_WAT_Session_ID )
                    })
                }
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // WAT_INTERFACE_SESSION_ENABLE
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'WAT_INTERFACE_SESSION_ENABLE':
                DB_Request = new npm_mssql.Request(DB_Conn)
                DB_Request.input('WAT_Portal_Owners_ID', npm_mssql.Int, parseInt(WAT_Request.header.Portal_owner_id))
                DB_Request.input('Login', npm_mssql.VarChar(255), WAT_Request.body.Login)
                DB_Request.input('WAT_Session_ID', npm_mssql.VarChar(255), WAT_Request.body.Session_ID)
                DB_Request.input('Code_And_Pass_hash', npm_mssql.VarChar(255), WAT_Request.body.Code_And_Pass_hash)
                DB_Request.output('OUT_IsEnabled', npm_mssql.Bit)
                DB_Results = await WAT_SP_EXECUTE(DB_Request, 'WAT_INTERFACE_SESSION_ENABLE')

                if (!DB_Results.output.OUT_IsEnabled) {
                    context.res = Result_ERR('Credential_data_Incorrect', { ReturnValue: DB_Results.returnValue, ErrParams: "" })
                } else {
                    context.res = Result_OK({})
                }
                break;

            default:
                context.res = Result_ERR('GATEWAY_ERROR_unknown_function_call', { unknown_function: WAT_function })
                break;
        }
        /*
                Pelda SELECT utasitasra:
                On_Error_ErrCode = 'GATEWAY_ERROR_SQL-Statement failure'
                DB_Recordset = await WAT_SELECT(DB_Conn, "select * from WAT_Users")
        
                //Step 3: Result_OK
                context.res = Result_OK({ DB_Recordset })
        */
    } catch (err) {
        context.res = Result_ERR(On_Error_ErrCode, err)
    }

    // Disconnect
    if (Connected) { DB_Conn.close() }
};

