const npm_seeme = require('seeme-js');

const SEEME_config = {
    apiKey: process.env.SEEME_apiKey
};

class SMS {
    static async sendSMS(phonenumber, msg) {
        try {
            let seeme = new npm_seeme.SeeMeGateway(SEEME_config);
            return await seeme.sendSMS(phonenumber, msg);
        } catch (e) {
            let a = 'a'
        }
    }
}

module.exports.SMS = SMS;