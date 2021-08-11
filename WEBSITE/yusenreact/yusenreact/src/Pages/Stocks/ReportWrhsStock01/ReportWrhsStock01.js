import GridReport from "../../../_SelComponents/_SelWebComponents/GridReport/GridReport";
import LangJSON from "./ReportWrhsStock01-lang";

export default function ReportInvoices01(props) {
  return (
    <div className="ReportWrhsStock01">
      <GridReport
        id="ReportWrhsStock01"
        lang={props.lang}
        loginData={props.loginData}
        db={props.db}
        report={{
          reportId: "ReportWrhsStock01",
          languageElements: LangJSON()
        }}
      />
    </div>
  );
}
