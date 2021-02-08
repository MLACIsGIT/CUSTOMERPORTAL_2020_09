class ErrorMsg {
    constructor(msg, statusCode = 400) {
        this.statusCode = statusCode;
        this.statusMessage = msg;
    }
}

module.exports.ErrorMsg = ErrorMsg
