const FuncRequest = require('./FuncRequest/FuncRequest.js');
const FuncResult = require('./FuncResult/FuncResult.js');

class Comm {
    constructor(context, req, validations) {
        this.req = new FuncRequest.FuncRequest(req, validations);
        this.res = new FuncResult.FuncResult(context, this.req.getRequestId());
    }

validateReq() {
    let validateResult = this.req.validateReq();

    if (validateResult.result === true) {
        return true;
    }

    this.res.setResultErr("INVALID_REQUEST", {
        errText: validateResult.error,
        message: validateResult.message
    });
    return false;
}
}

module.exports.Comm = Comm;
