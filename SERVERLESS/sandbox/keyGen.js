const constants = require('./constants')

class KeyGen {
    constructor(keyType, noOfKeys) {
        this.mKeyType = keyType
        this.mNoOfKeys = noOfKeys
    }

    getKey() {
        let keyLength = this.mKeyType == constants.KEY_TYPE_MASTER_KEY ? constants.KEY_LENGHT_MASTER_KEY : constants.KEY_LENGHT_REGISTRATION_KEY

        const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        var out = new Map();
        var i;
        for(i = 0; i < this.mNoOfKeys; i++) {
            out['key' + i] = genRanHex(keyLength)
        }
        return out;
    }
}

module.exports.KeyGen = KeyGen