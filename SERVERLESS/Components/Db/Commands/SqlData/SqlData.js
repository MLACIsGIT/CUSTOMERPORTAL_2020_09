class SqlData {
    constructor(auth, sp, comm) {
        this.auth = auth;
        this.sp = sp;
        this.comm = comm;
    }

    async getRecordsetParams() {
        let tokenkey = await this.auth.getJwtTokenkey();
        if (!tokenkey) {
            this.comm.res.setResultErr()
        }

        let portalOwnersId = this.comm.req.req.body.body.portalOwnerId;

        let decodedToken = await this.auth.decodeToken(portalOwnerId, this.comm.req.req.body.header.token, tokenkey);
        if (!decodedToken.result) {
            this.comm.res.setResultErr('nok');
            return;
        }

        let userParams = auth.getUserParams(portalOwnersId, decodedToken.usersId)
        let requestBody = this.comm.req.req.body.body;
        let reportParams = userParams?.portalOwnerParams?.gridReport[requestBody.reportId];

        if (!userParams || !reportParams) {
            this.comm.res.setResultErr('nok');
            return;
        }

        let baseDef = reportParams["base-definitions"]["recordset"];

        let outParams = await this.sp.WAT_INTERFACE_getRecordsetParams({
            portalOwnersId: portalOwnerId,
            usersId: decodedToken?.usersId,
            tableCode: baseDef.tableCode,
            TOP: reportParams["base-definitions"]?.recordset?.TOP,
            FROM: reportParams["base-definitions"]?.recordset?.FROM,
            WHERE: requestBody.where,
            GROUP_BY: baseDef.sqlGroupBy
        })
    }

    async getData() {
        let tokenkey = await this.auth.getJwtTokenkey();
        if (!tokenkey) {
            this.comm.res.setResultErr()
        }

        let portalOwnerId = this.comm.req.req.body.body.portalOwnerId;

        let decodedToken = await this.auth.decodeToken(portalOwnerId, this.comm.req.req.body.header.token, tokenkey);
        if (!decodedToken.result) {
            this.comm.res.setResultErr('nok');
            return;
        }


    }
}