const gl = require('../../Globals/Gl.js');

class FuncResult {
    constructor(context, requestId) {
        this.context = context;
        this.requestId = (requestId === undefined) ? "#" : requestId;
    }

    setResult(status, resultCode, body) {
        this.context.res = {
            status: status,
            body: {
                header: this.getHeader(resultCode),
                body: body
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }

    getHeader(resultCode) {
        return {
            "version": gl.version(),
            "requestId": this.requestId,
            "result": resultCode
        }
    }

    setResultErr(errCode, err) {
        this.setResult(400, errCode, {
            "err": err
        })
    }

    setResultOk(body) {
        this.setResult(200, "ok", body);
    }

}

module.exports.FuncResult = FuncResult;
