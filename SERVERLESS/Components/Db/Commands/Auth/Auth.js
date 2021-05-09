const Crypto = require('../../../Crypto/Crypto.js');
const jwt = require('jsonwebtoken');

class Auth {
    constructor(sp, comm) {
        this.sp = sp;
        this.comm = comm;
    }

    async getHashedPassword() {
        let crypto = new Crypto.Crypto();
        let password = this.comm.req.req.body.body.password
        let hashedPassword = await crypto.getHashedPassword(password);
        this.comm.res.setResultOk({
            hashedPassword: hashedPassword
        })
        return;
    }

    async registerUser() {
        let crypto = new Crypto.Crypto();
        let passwordHash = await crypto.getHashedPassword(this.comm.req.req.body.body.password);

        let result = await this.sp.WAT_INTERFACE_RegisterUser({
            portalOwnersId: 1038470,
            userLevel: this.comm.req.req.body.body.userLevel,
            name: this.comm.req.req.body.body.name,
            email: this.comm.req.req.body.body.email,
            passwordHash: passwordHash
        })

        if (result === true) {
            this.comm.res.setResultOk({});
        } else {
            this.comm.res.setResultErr("SQL ERROR");
        }
        return result;
    }

    async login() {
        let outParams = await this.sp.WAT_INTERFACE_getUser({
            portalOwnersId: this.comm.req.req.body.body.portalOwnerId,
            email: this.comm.req.req.body.body.email,
            passwordHash: this.comm.req.req.body.body.passwordHash,
            salt: this.comm.req.req.body.body.salt
        })

        if (outParams.result === true) {
            let token = jwt.sign({
                _id: outParams.userId,
                _validUntil: outParams.validUntil,
                _hashShorthand: (this.comm.req.req.body.body.passwordHash).substring(0, 6),
                _salt: this.comm.req.req.body.body.salt
            }, (outParams.tokenKey).toString());

            this.comm.res.setResultOk({
                token: token,
                userLevel: outParams.userLevel,
                currentUTC: outParams.currentUTC,
                validUntil: outParams.validUntil,
                passwordUpdateRequired: outParams.passwordUpdateRequired,
                params: outParams.params
            });
        } else {
            this.comm.res.setResultErr("LOGIN_FAILED");
        }
    }

    async getUserParams(portalOwnersId, userId) {
        return await this.sp.WAT_INTERFACE_getUserParams({portalOwnersId, userId})
    }

    async decodeToken(portalOwnersId, token, tokenkey) {
        let out = { result: false }

        if (!token) {
            return out;
        }

        try {
            const tokenData = jwt.verify(token, tokenkey);
            const tokenValidUntil = new Date(tokenData._validUntil)
            const currentDate = new Date()
            if (tokenValidUntil < currentDate) {
                return out;
            }
            return {
                result: true,
                tokenData: tokenData
            }
        } catch (error) {
            return out;
        }
    }

    async getJwtTokenkey() {
        let portalOwnersId = this.comm.req.req.body.body.portalOwnerId;
        return await this.sp.WAT_INTERFACE_getJwtTokenkey({
            portalOwnersId: portalOwnersId
        })

    }

    async extendTokenValidity() {
        let tokenkey = await this.getJwtTokenkey();
        if (!tokenkey) {
            this.comm.res.setResultErr()
        }

        let portalOwnerId = this.comm.req.req.body.body.portalOwnerId;

        let decodedToken = await this.decodeToken(portalOwnerId, this.comm.req.req.body.header.token, tokenkey);
        if (!decodedToken.result) {
            this.comm.res.setResultErr('nok');
            return;
        }

        let outParams = await this.sp.WAT_INTERFACE_extendTokenValidity({
            portalOwnersId: this.comm.req.req.body.body.portalOwnerId,
            userId: decodedToken.tokenData._id,
            hashShorthand: decodedToken.tokenData._hashShorthand,
            salt: decodedToken.tokenData._salt
        })

        if (outParams.result === true) {
            let token = jwt.sign({
                _id: decodedToken.tokenData._id,
                _validUntil: outParams.validUntil,
                _hashShorthand: decodedToken.tokenData._hashShorthand,
                _salt: decodedToken.tokenData._salt
            }, tokenkey);

            this.comm.res.setResultOk({
                token: token,
                currentUTC: outParams.currentUTC,
                validUntil: outParams.validUntil
            });
        } else {
            this.comm.res.setResultErr("nok");
        }
    }

    async changePassword() {
        let tokenkey = await this.getJwtTokenkey();
        if (!tokenkey) {
            this.comm.res.setResultErr()
        }

        let portalOwnerId = this.comm.req.req.body.body.portalOwnerId;

        let decodedToken = await this.decodeToken(portalOwnerId, this.comm.req.req.body.header.token, tokenkey);
        if (!decodedToken.result) {
            this.comm.res.setResultErr('nok');
            return;
        }

        let outParams = await this.sp.WAT_INTERFACE_changePassword({
            portalOwnersId: this.comm.req.req.body.body.portalOwnerId,
            userId: decodedToken.tokenData._id,
            currentToken_hashShorthand: decodedToken.tokenData._hashShorthand,
            currentToken_salt: decodedToken.tokenData._salt,
            newPassword_hash: this.comm.req.req.body.body.newPassword_hash,
            newPassword_updateRequired: this.comm.req.req.body.body.newPassword_updateRequired

        })
        if (outParams.result === true) {
            this.comm.res.setResultOk({})
            return;
        }

        this.comm.res.setResultErr("nok")
    }
}

module.exports.Auth = Auth;

