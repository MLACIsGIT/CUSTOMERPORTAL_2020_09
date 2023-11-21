import { StoredProcedure } from '@selesterkft/sel-db';
import db from '../db';

export default async function ping() {
  const sp = new StoredProcedure('EComm_PING');

  sp.output('OUT_HTTP_Code', 'Int');
  sp.output('OUT_HTTP_Message', 'NVarChar', '', { length: 'max' });

  const sqlResult = await db.callSP(sp);
  if (sqlResult.output.OUT_HTTP_Code !== 200) {
    const error = new Error(sqlResult.output.OUT_HTTP_Message);
    error.status = sqlResult.output.OUT_HTTP_Code;
    throw error;
  }

  return {
    dbConnection: {
      code: sqlResult.output.OUT_HTTP_Code,
      message: sqlResult.output.OUT_HTTP_Message,
    },
  };
}
