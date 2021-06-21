const npm_multipart = require('multipart-formdata');

class multipart {
    constructor(req) {
        this.boundary = npm_multipart.getBoundary(req.headers['content-type']);
        this.parts = npm_multipart.parse(req.body, this.boundary);
    }

    async getParamsValue() {
        let filesArray = [];
        let messageArray = [];
    
        for (let iParts = 0; iParts < this.parts.length; iParts++) {
            if (this.parts[iParts].type !== false) {
                filesArray.push(this.parts[iParts])
            }
    
            if (this.parts[iParts].type === false && this.parts[iParts].name === 'message') {
                messageArray.push(this.parts[iParts])
            }
        }

        return {
            "results": {
                "filesArray": filesArray,
                "messageArray": messageArray
            }
        }
    }
}

module.exports.multipart = multipart;