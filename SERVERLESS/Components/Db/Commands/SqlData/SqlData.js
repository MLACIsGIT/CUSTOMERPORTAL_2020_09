const { Table } = require("mssql");

class SqlData {
  constructor(auth, sp, comm) {
    this.auth = auth;
    this.sp = sp;
    this.comm = comm;
  }

  async _getReportParams(portalOwnersId, userId, reportId, lang, where) {
    let userParams = await this.auth.getUserParams(portalOwnersId, userId);
    let reportParamsOwnerLevel = userParams?.portalOwnerParams?.gridReports;
    let reportParamsUserLevel = userParams?.userLevelParams?.gridReports;
    let reportParamsUser = userParams?.userParams?.gridReports;

    reportParamsOwnerLevel = reportParamsOwnerLevel
      ? reportParamsOwnerLevel[reportId] || {}
      : {};
    reportParamsUserLevel = reportParamsUserLevel
      ? reportParamsUserLevel[reportId] || {}
      : {};
    reportParamsUser = userParams ? userParams[reportId] || {} : {};

    const reportParams = {
      lang: lang ? lang : "en",
      columns: reportParamsUserLevel.columns || reportParamsOwnerLevel.columns,
      sqlSelect: (
        reportParamsUser.selectedColumns ||
        reportParamsUserLevel.selectedColumns ||
        reportParamsOwnerLevel.selectedColumns
      ).join(),
      sqlTop:
        reportParamsUser.sqlTop ||
        reportParamsUserLevel.sqlTop ||
        reportParamsOwnerLevel.sqlTop,
      sqlFrom: reportParamsOwnerLevel.sqlFrom,
      sqlWhere: where,
      tableCode: reportParamsOwnerLevel.tableCode,
      filters: reportParamsUserLevel.filters || reportParamsOwnerLevel.filters,
      sqlOrderBy:
        reportParamsUser.orderBy ||
        reportParamsUserLevel.orderBy ||
        reportParamsOwnerLevel.orderBy,
      rowCountPerPage:
        reportParamsUser.rowCountPerPage ||
        reportParamsUserLevel.rowCountPerPage ||
        reportParamsOwnerLevel.rowCountPerPage,
      selectedFilters:
        reportParamsUser.selectedFilters ||
        reportParamsUserLevel.selectedFilters ||
        reportParamsOwnerLevel.selectedFilters,
      selectedColumns:
        reportParamsUser.selectedColumns ||
        reportParamsUserLevel.selectedColumns ||
        reportParamsOwnerLevel.selectedColumns,
    };

    const validSelectedColumns = reportParams.selectedColumns.filter((c) => {
      return reportParams.columns.some((validColumn) => {
        return c === validColumn.field;
      });
    });

    const validSelectedFilters = reportParams.selectedFilters.filter((c) => {
      return reportParams.columns.some((validColumn) => {
        return c === validColumn.field;
      });
    });

    reportParams.selectedColumns = validSelectedColumns.map((columnName) => {
      const columnParams = reportParams.columns.find(
        (c) => c.field === columnName
      );
      return {
        field: columnName,
        type: columnParams.type,
        options: columnParams.options,
      };
    });

    reportParams.selectedFilters = validSelectedFilters.map((columnName) => {
      const columnParams = reportParams.columns.find(
        (c) => c.field === columnName
      );
      return {
        field: columnName,
        type: columnParams.type,
        options: columnParams.options,
      };
    });

    return reportParams;
  }

  async getReportParams() {
    const portalOwnersId = this.comm.req.req.body.body.portalOwnerId;
    const tokenkey = await this.auth.getJwtTokenkey();
    if (!tokenkey) {
      this.comm.res.setResultErr();
      return;
    }

    let decodedToken = await this.auth.decodeToken(
      portalOwnersId,
      this.comm.req.req.body.header.token,
      tokenkey
    );
    if (!decodedToken.result) {
      this.comm.res.setResultErr("nok");
      return;
    }

    const userId = decodedToken.tokenData._id;
    const reportId = this.comm.req.req.body.body.reportId;
    const lang = this.comm.req.req.body.header.lang;

    const reportParams = await this._getReportParams(
      portalOwnersId,
      userId,
      reportId,
      lang
    );

    this.comm.res.setResultOk({
      columns: reportParams.columns,
      selectedColumns: reportParams.selectedColumns,
      selectedFilters: reportParams.selectedFilters,
    });

    return;
  }

  async getData() {
    let portalOwnerId = this.comm.req.req.body.body.portalOwnerId;

    let tokenkey = await this.auth.getJwtTokenkey();
    if (!tokenkey) {
      this.comm.res.setResultErr();
      return;
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
    const reqBody = this.comm.req.req.body.body;
    const lang = this.comm.req.req.body.header.lang;
    const userId = decodedToken.tokenData._id;
    const reportParams = await this._getReportParams(
      portalOwnerId,
      userId,
      reqBody.reportId,
      lang,
      reqBody.where
    );

    const outParams = await this.sp.WAT_INTERFACE_getData(
      portalOwnerId,
      userId,
      reportParams
    );
    this.comm.res.setResultOk({
      data: outParams.data,
      columns: reportParams.columns,
      selectedColumns: reportParams.selectedColumns,
    });
    return;
  }
}

module.exports.SqlData = SqlData;
