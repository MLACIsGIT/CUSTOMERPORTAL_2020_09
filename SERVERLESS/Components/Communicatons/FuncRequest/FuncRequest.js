const Validations = require('./Validations.js');

class FuncRequest {
    constructor(req, validations) {
        this.req = req;
        this.requestId = "#";
        this.validations = validations;
    }

    getRequestId() {
        return this.requestId;
    }

    setRequestId(newRequestId) {
        this.requestId = newRequestId;
    }

    getFunctionCode() {
        if (this?.req?.body === undefined) {
            return "emptyRequest"
        }

        let funcCode = this.req.body?.header?.function
        return ((funcCode === undefined) ? "" : funcCode);
    }

    validateReq() {
        return this.validations.validate(this.req.body.body, this.getFunctionCode());
    }
}

module.exports.FuncRequest = FuncRequest;
