import { StoredProcedure } from '@selesterkft/sel-db';
import db from '../db';

export default async function watInterfaceGetData(where) {
  const sp = new StoredProcedure('WAT_INTERFACE_GET_DATA_EXPRESS');

  // sp.input('UsersID', 'Int', userId);
  // sp.input('TableCode', 'NVarChar', reportParams.tableCode, { length: 50 });
  // sp.input('WhereQuery', 'NVarChar', reportParams.sqlWhereQuery, {
  //   length: 'max',
  // });
  // sp.input('SELECT', 'NVarChar', reportParams.sqlSelect, { length: 'max' });
  // sp.input('TOP', 'Int', reportParams.sqlTop);
  // sp.input('FROM', 'NVarChar', reportParams.sqlFrom, { length: 'max' });
  sp.input('WHERE', 'NVarChar', where, { length: 'max' });
  // sp.input('GROUP_BY', 'NVarChar', reportParams.sqlGroupBy, { length: 'max' });
  // sp.input('ORDER_BY', 'NVarChar', reportParams.sqlOrderBy, { length: 'max' });
  // sp.input('Lang', 'NVarChar', reportParams.lang, { length: 10 });
  // sp.input('PAGE_NO', 'Int', reportParams.pageNo);

  // sp.input('ROWS_PER_PAGE', 'Int', reportParams.rowsPerPage);

  sp.output('OUT_DATA', 'NVarChar', '', { length: 'max' });
  sp.output('OUT_ErrCode', 'NVarChar', '', { length: 255 });
  sp.output('OUT_ErrParams', 'NVarChar', '', { length: 'max' });

  const sqlResult = await db.callSP(sp);

  // console.log(sqlResult.output);
  const parsed = JSON.parse(sqlResult.output.OUT_DATA);
  return parsed;
  // return { ok: 'ok' };
}

// export default async function watInterfaceGetData(portalOwnerId, userId, reportParams) {
//   let dbRequest = this.db.getNewRequest();
//   let outParams = {
//     result: false,
//   };

//   let sqlTop = reportParams.sqlTop ?? 0;

//   dbRequest.input(
//     "WAT_Portal_Owners_ID",
//     npm_mssql.Int,
//     portalOwnerId
//   );
//   dbRequest.input("UsersID", npm_mssql.Int, userId);
//   dbRequest.input("TableCode", npm_mssql.NVarChar(50), reportParams.tableCode);
//   dbRequest.input("WhereQuery", npm_mssql.NVarChar("max"), reportParams.sqlWhereQuery);
//   dbRequest.input("SELECT", npm_mssql.NVarChar("max"), reportParams.sqlSelect);
//   dbRequest.input("TOP", npm_mssql.Int, sqlTop);
//   dbRequest.input("FROM", npm_mssql.NVarChar("max"), reportParams.sqlFrom);
//   dbRequest.input("WHERE", npm_mssql.NVarChar("max"), reportParams.sqlWhere);
//   dbRequest.input("GROUP_BY", npm_mssql.NVarChar("max"), reportParams.sqlGroupBy);
//   dbRequest.input("ORDER_BY", npm_mssql.NVarChar("max"), reportParams.sqlOrderBy);
//   dbRequest.input("Lang", npm_mssql.NVarChar(10), reportParams.lang);

//   dbRequest.input("PAGE_NO", npm_mssql.Int, reportParams.pageNo);
//   dbRequest.input("ROWS_PER_PAGE", npm_mssql.Int, reportParams.rowsPerPage);
//   dbRequest.output("OUT_ErrCode", npm_mssql.NVarChar(255));
//   dbRequest.output("OUT_ErrParams", npm_mssql.NVarChar("max"));

//   try {
//     let dbResults = await this.db.spExecute(
//       dbRequest,
//       "WAT_INTERFACE_GET_DATA"
//     );

//     if (dbResults.output.OUT_ErrCode === "") {
//       outParams = {
//         result: true,
//         countOfRecords: dbResults.recordset["length"],
//         columns: dbResults.recordset["columns"],
//         data: dbResults.recordset,
//       };
//     } else {
//       outParams = {
//         result: false,
//       };
//     }
//   } catch (error) {
//     outParams = {
//       result: false,
//     };
//   }

//   return outParams;
// }
