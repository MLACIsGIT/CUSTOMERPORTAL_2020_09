const gl = require('../Components/Globals/Gl.js');
const Comm = require('../Components/Communicatons/Comm.js')
const Db = require('../Components/Db/Sql/MsSqlServer/MsSqlServer.js')
const StoredProcedures = require('../Components/Db/Sql/MsSqlServer/StoredProcedures.js')
const Auth = require('../Components/Db/Commands/Auth/Auth.js');
const Validations = require('../Components/Communicatons/FuncRequest/Validations.js');

module.exports = async function (context, req) {
    const validations = new Validations.Validations();
    const comm = new Comm.Comm(context, req, validations);
    const funcCode = comm.req.getFunctionCode();
    if (funcCode === "emptyRequest") {
        comm.res.setResultOk({
            answer: `SELEXPED CUSTOMER PORTAL SERVERLESS AZURE FUNCTION VERSION ${gl.version()} is ready to go.`
        })
        return
    }

    if (!comm.validateReq()) {
        return;
    }

    const db = new Db.Db();
    const sp = new StoredProcedures.StoredProcedures(db);
    const auth = new Auth.Auth(db, sp, comm);

    await db.connect()
    if (db.isConnected() === false) {
        comm.res.setResultErr('GATEWAY_ERROR_DB-Connect');
        return;
    }

    switch (funcCode) {
        case "hashPassword":
            await auth.getHashedPassword(comm.req.req.body.body.password);
            break;

        case "registerUser":
            await auth.registerUser();
            break;

        case "login":
            await auth.login();
            break;

        case "extendTokenValidity":
            await auth.extendTokenValidity();
            break;

        default:
            comm.res.setResultErr(`Unknown function ${funcCode}`);
            break;
    }

    db.disconnect();
};

