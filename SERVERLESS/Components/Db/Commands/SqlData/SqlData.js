const { Table } = require("mssql");

class SqlData {
  constructor(auth, sp, comm) {
    this.auth = auth;
    this.sp = sp;
    this.comm = comm;
  }

  async getRecordsetParams() {
    let tokenkey = await this.auth.getJwtTokenkey();
    if (!tokenkey) {
      this.comm.res.setResultErr();
    }

    let portalOwnersId = this.comm.req.req.body.body.portalOwnerId;

    let decodedToken = await this.auth.decodeToken(
      portalOwnerId,
      this.comm.req.req.body.header.token,
      tokenkey
    );
    if (!decodedToken.result) {
      this.comm.res.setResultErr("nok");
      return;
    }

    let userParams = auth.getUserParams(portalOwnersId, decodedToken.usersId);
    let requestBody = this.comm.req.req.body.body;
    let reportParams =
      userParams?.portalOwnerParams?.gridReport[requestBody.reportId];

    if (!userParams || !reportParams) {
      this.comm.res.setResultErr("nok");
      return;
    }

    let baseDef = reportParams["base-definitions"]["recordset"];

    const outParams = await this.sp.WAT_INTERFACE_getRecordsetParams({
      portalOwnersId: portalOwnerId,
      usersId: decodedToken?.usersId,
      tableCode: baseDef.tableCode,
      TOP: reportParams["base-definitions"]?.recordset?.TOP,
      FROM: reportParams["base-definitions"]?.recordset?.FROM,
      WHERE: requestBody.where,
      GROUP_BY: baseDef.sqlGroupBy,
    });
  }

  async getData() {
    let portalOwnerId = this.comm.req.req.body.body.portalOwnerId;

    let tokenkey = await this.auth.getJwtTokenkey();
    if (!tokenkey) {
      this.comm.res.setResultErr();
    }

    let decodedToken = await this.auth.decodeToken(
      portalOwnerId,
      this.comm.req.req.body.header.token,
      tokenkey
    );
    if (!decodedToken.result) {
      this.comm.res.setResultErr("nok");
      return;
    }

    const reportId = this.comm.req.req.body.body.reportId;
    let params = {};

    if (reportId === "ReportUpsTrackTrace") {
      params.portalOwnersId = 1038470;
      params.usersId = decodedToken.tokenData._id;
      params.tableCode = "UPS_TrackTrace";
      params.whereQuery = "";
      params.select =
        "PositionNumber, ItemNo, CustomerNo, DispositionNo, LoadingDate, Loadingplace, UnloadingDate, UnloadingPlace, TransportStatus";
      params.top = 50;
      params.from = "U_UPS_TrackTrace_TEVA";
      params.where = this.comm.req.req.body.body.where;
      params.groupBy = "";
      params.orderBy = "PositionNumber";
      params.lang = "hu";
      params.pageNo = 0;
      params.rowsPerPage = 50;
    }

    const outParams = await this.sp.WAT_INTERFACE_getData(params);
    this.comm.res.setResultOk({
      data: outParams.data,
      columns: outParams.columns,
    });
    return;
  }
}

module.exports.SqlData = SqlData;
