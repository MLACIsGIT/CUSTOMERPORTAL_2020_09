import GridReport from "../../../_SelComponents/_SelWebComponents/GridReport/GridReport";
import LangJSON from "./ReportInvoices01-lang";

export default function ReportInvoices01(props) {
  return (
    <div className="ReportInvoices01">
      <GridReport
        id="ReportInvoices01"
        lang={props.lang}
        loginData={props.loginData}
        db={props.db}
        report={{
          reportId: "ReportInvoices01",
          languageElements: LangJSON()
        }}
      />
    </div>
  );
}
