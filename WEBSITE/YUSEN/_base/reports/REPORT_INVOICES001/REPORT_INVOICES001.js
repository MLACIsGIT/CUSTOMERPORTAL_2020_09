import AgGrid from "../../js/SEL_AgGrid.js"
import Recordset from "../../js/SEL_RECORDSET.js"
import Report from "../../SEL_REPORT.js"
import * as CPApp from "../../CP_APP.js"

export default class REPORT_INVOICES001 {
constructor(CPApp) {
    this.CPApp = CPApp;
    
}

}

let CP_App = new CPApp.Language_Selector({
  supported_languages: ["hu", "en", "de"],
  default_language: "hu"
},
{
  Language_Files: ["./REPORT_INVOICES001_Lang.json"]
})

const REPORT_INVOICES001_agGrid = new AgGrid(CP_App, "REPORT_INVOICES001", "REPORT_INVOICES001-agGrid");
const REPORT_INVOICES001_rs = new Recordset({
  defaultSqlSelect: "ID, INV_InvNum",
  defaultSqlTop: 10,
  sqlFrom: "WAT_INVOICES",
  defaultSqlOrderBy: "INV_InvNum"
})

const REPORT_INVOICES001 = new Report(CP_App, "REPORT_INVOICES001", REPORT_INVOICES001_agGrid, REPORT_INVOICES001_rs, {
  btnLoadDataId: "REPORT_INVOICES001-btnLoadData",
  loadingSpinnerId: "REPORT_INVOICES001-loading-spinner",
  btnFilterSettings: "REPORT_INVOICES001_FILTER_SETTINGS",
  btnExcelExport: "REPORT_INVOICES001-excel-export"
});

