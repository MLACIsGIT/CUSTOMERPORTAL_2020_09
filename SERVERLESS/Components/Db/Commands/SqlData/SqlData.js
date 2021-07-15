const { Table } = require("mssql");

class SqlData {
  constructor(auth, sp, comm) {
    this.auth = auth;
    this.sp = sp;
    this.comm = comm;
  }

  async getReportParams(portalOwnersId, userId, reportId, lang, where) {
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

    return {
      lang: (lang) ? lang : 'en',
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
    const reqBody = this.comm.req.req.body.body;
    const lang = this.comm.req.req.body.header.lang;
    const userId = decodedToken.tokenData._id;
    const reportParams = await this.getReportParams(
      portalOwnerId,
      userId,
      reqBody.reportId,
      lang,
      reqBody.where
    );

    const validSelectedColumns = reportParams.selectedColumns.filter(c => { return reportParams.columns.some(validColumn => { return (c === validColumn.field) }) })

    const outParams = await this.sp.WAT_INTERFACE_getData(
      portalOwnerId,
      userId,
      reportParams
    );
    this.comm.res.setResultOk({
      data: outParams.data,
      columns: reportParams.columns,
      selectedColumns: validSelectedColumns.map(columnName => {
        const columnParams = reportParams.columns.find( c => (c.field === columnName) )
        return {
          field: columnName,
          type: columnParams.type
        }
      })
    });
    return;
  }
}

module.exports.SqlData = SqlData;
