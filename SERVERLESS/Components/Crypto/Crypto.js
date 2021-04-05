const bcrypt = require('bcrypt');
const crypto = require('crypto');

class Crypto {
    constructor() {
        this.saltGenerated = false;
        this.salt = undefined;
    }

    async genSalt() {
        if (this.saltGenerated) {
            return true;
        }
        this.salt = await bcrypt.genSalt(10);
    }

    async getHashedPassword(password, salt) {
        let hash = crypto.createHash('sha512');
        let data = hash.update(`${salt}${password}`, 'utf-8');
        let gen_hash = (data.digest('hex')).toUpperCase();
        
        return gen_hash;

/*
        if (this.saltGenerated === false) {
            await this.genSalt();
        }
        return await bcrypt.hash(password, this.salt);
*/
    }
}

module.exports.Crypto = Crypto;
