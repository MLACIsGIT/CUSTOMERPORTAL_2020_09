import GridReport from "../../../_SelComponents/_SelWebComponents/GridReport/GridReport";
import LangJSON from "./ReportInvoices01-lang";
import ReportInvoices01Filter from "./ReportInvoices01Filter";

export default function ReportInvoices01(props) {
  return (
    <div className="ReportInvoices01">
      <GridReport
        id="ReportInvoices01"
        lang={props.lang}
        loginData={props.loginData}
        db={props.db}
        Filters={
          <ReportInvoices01Filter
            lang={props.lang}
            loginData={props.loginData}
          />
        }
        report={{
          reportId: "ReportInvoices01",
          languageElements: LangJSON()
        }}
      />
    </div>
  );
}
