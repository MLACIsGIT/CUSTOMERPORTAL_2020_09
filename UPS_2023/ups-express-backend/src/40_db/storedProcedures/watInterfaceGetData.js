import { StoredProcedure } from '@selesterkft/sel-db';
import db from '../db';

export default async function watInterfaceGetData(filters) {
  const sp = new StoredProcedure('WAT_INTERFACE_GET_DATA_EXPRESS_JSON_FILTER');
  const filtersJSON = JSON.stringify(filters);

  sp.input('FILTERS', 'NVarChar', filtersJSON, { length: 'max' });

  sp.output('OUT_DATA', 'NVarChar', '', { length: 'max' });
  sp.output('OUT_ErrCode', 'NVarChar', '', { length: 255 });
  sp.output('OUT_ErrParams', 'NVarChar', '', { length: 'max' });

  const sqlResult = await db.callSP(sp);

  if (sqlResult.output.OUT_ErrCode !== '200') {
    const error = new Error(sqlResult.output.OUT_ErrParams);
    error.status = sqlResult.output.OUT_ErrCode;
    throw error;
  }
  // console.log(sqlResult.output);
  const parsed = JSON.parse(sqlResult.output.OUT_DATA);
  return {
    data: parsed,
    code: sqlResult.output.OUT_ErrCode,
    message: sqlResult.output.OUT_ErrParams,
  };
}
