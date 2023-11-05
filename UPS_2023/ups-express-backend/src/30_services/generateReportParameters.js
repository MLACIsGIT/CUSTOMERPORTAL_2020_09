// export default generateReportParameters(remoteParams, queryParams) {

//   let userParams = await this.auth.getUserParams(portalOwnersId, userId);
//     let reportParamsOwnerLevel = userParams?.portalOwnerParams?.gridReports;
//     let reportParamsUserLevel = userParams?.userLevelParams?.gridReports;
//     let reportParamsUser = userParams?.userParams?.gridReports;

//     reportParamsOwnerLevel = reportParamsOwnerLevel
//       ? reportParamsOwnerLevel[reportId] || {}
//       : {};
//     reportParamsUserLevel = reportParamsUserLevel
//       ? reportParamsUserLevel[reportId] || {}
//       : {};
//     reportParamsUser = userParams ? userParams[reportId] || {} : {};

//     const reportParams = {
//       lang: lang ? lang : "en",
//       columns: reportParamsUserLevel.columns || reportParamsOwnerLevel.columns,
//       sqlSelect: (
//         reportParamsUser.selectedColumns ||
//         reportParamsUserLevel.selectedColumns ||
//         reportParamsOwnerLevel.selectedColumns
//       ).join(),
//       sqlTop:
//         reportParamsUser.sqlTop ||
//         reportParamsUserLevel.sqlTop ||
//         reportParamsOwnerLevel.sqlTop,
//       sqlFrom: reportParamsOwnerLevel.sqlFrom,
//       sqlWhere: where,
//       tableCode: reportParamsOwnerLevel.tableCode,
//       filters: reportParamsUserLevel.filters || reportParamsOwnerLevel.filters,
//       sqlOrderBy:
//         reportParamsUser.orderBy ||
//         reportParamsUserLevel.orderBy ||
//         reportParamsOwnerLevel.orderBy,
//       rowCountPerPage:
//         reportParamsUser.rowCountPerPage ||
//         reportParamsUserLevel.rowCountPerPage ||
//         reportParamsOwnerLevel.rowCountPerPage,
//       selectedFilters:
//         reportParamsUser.selectedFilters ||
//         reportParamsUserLevel.selectedFilters ||
//         reportParamsOwnerLevel.selectedFilters,
//       selectedColumns:
//         reportParamsUser.selectedColumns ||
//         reportParamsUserLevel.selectedColumns ||
//         reportParamsOwnerLevel.selectedColumns,
//     };

//     const validSelectedColumns = reportParams.selectedColumns.filter((c) => {
//       return reportParams.columns.some((validColumn) => {
//         return c === validColumn.field;
//       });
//     });

//     const validSelectedFilters = reportParams.selectedFilters.filter((c) => {
//       return reportParams.columns.some((validColumn) => {
//         return c === validColumn.field;
//       });
//     });

//     reportParams.selectedColumns = validSelectedColumns.map((columnName) => {
//       const columnParams = reportParams.columns.find(
//         (c) => c.field === columnName
//       );
//       return {
//         field: columnName,
//         type: columnParams.type,
//         options: columnParams.options,
//       };
//     });

//     reportParams.selectedFilters = validSelectedFilters.map((columnName) => {
//       const columnParams = reportParams.columns.find(
//         (c) => c.field === columnName
//       );
//       return {
//         field: columnName,
//         type: columnParams.type,
//         options: columnParams.options,
//       };
//     });

//     return reportParams;
// }
