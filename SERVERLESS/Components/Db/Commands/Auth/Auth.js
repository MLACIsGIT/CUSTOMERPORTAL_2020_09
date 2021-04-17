const Crypto = require('../../../Crypto/Crypto.js');
const jwt = require('jsonwebtoken');

class Auth {
    constructor(db, sp, comm) {
        this.db = db;
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
                _validUntil: outParams.validUntil
            }, (outParams.tokenKey).toString());

            this.comm.res.setResultOk({
                token: token,
                currentUTC: outParams.currentUTC,
                validUntil: outParams.validUntil
            });
        } else {
            this.comm.res.setResultErr("LOGIN_FAILED");
        }
    }

    async decodeToken(portalOwnersId, token) {
        let out = { result: false }
let tokenKey;

        if (!token) {
            return out;
        }

        tokenKey = await this.sp.WAT_INTERFACE_getJwtTokenkey({
            portalOwnersId: portalOwnersId
        })

        if (!tokenKey) {
            return out;
        }

        try {
            const tokenData = jwt.verify(token, tokenKey);
            const tokenValidUntil = new Date(tokenData._validUntil)
            const currentDate = new Date()
            if ( tokenValidUntil < currentDate) {
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

    async extendTokenValidity() {
        let decodedToken = await this.decodeToken(this.comm.req.req.body.body.portalOwnerId, this.comm.req.req.body.header.token);
        this.comm.res.setResultOk({
            token: "minden nagyon király!"
        });
    }
}

module.exports.Auth = Auth;

