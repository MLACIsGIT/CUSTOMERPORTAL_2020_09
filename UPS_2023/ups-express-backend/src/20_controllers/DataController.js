import watInterfaceGetData from '../40_db/storedProcedures/watInterfaceGetData';
import checkParamsExist from '../utils/checkParamsExist';

export default class DataController {
  static async getData(req, res, next) {
    try {
      const { where } = req.body;
      // console.log(req.body);
      // console.log(req.authInfo);
      checkParamsExist({ where });

      const { data, code, message } = await watInterfaceGetData(where);
      const response = {
        selectedColumns: [
          // { field: 'ExternalSystem_ID' },
          // { field: 'ExternalSystem_TransactID' },
          { field: 'PositionNo' },
          { field: 'ItemNo' },
          { field: 'CustomerNo' },
          { field: 'DispositionNo' },
          { field: 'LoadingDate', type: 'date' },
          { field: 'LicenseNum' },
          { field: 'LoadingPlace' },
          { field: 'Consignee' },
          { field: 'UnloadingDate', type: 'date' },
          { field: 'UnloadingPlace' },
          { field: 'TransportStatus' },
        ],
        data,
        code,
        message,
      };
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  }
}
