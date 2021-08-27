import "./PageTrack.scss";
import { Redirect } from "react-router-dom";
import HeaderLine from "../../Components/HeaderLine/HeaderLine";
import TevaTrackAndTraceFilter from "./subComponents/TevaTrackAndTraceReport/TevaTrackAndTraceFilter";
import * as TevaTrackAndTraceReportLang from "./subComponents/TevaTrackAndTraceReport/TevaTrackAndTrace-lang";
import GridReport from "../../_SelComponents/_SelWebComponents/GridReport/GridReport";

export default function PageTrack(props) {
  if (props.loginData.user === null) {
    return <Redirect to="/" />;
  }

  return (
    <div className="page-track">
      <HeaderLine
        lang={props.lang}
        selectedPage={"track"}
        loginData={props.loginData}
      />

      <div className="page-track-container">
        <GridReport
          id="REPORT_TrackAndTrace"
          lang={props.lang}
          loginData={props.loginData}
          db={props.db}
          Filters={<TevaTrackAndTraceFilter lang={props.lang} />}
          report={{
            reportId: "ReportUpsTrackTrace",
            languageElements: TevaTrackAndTraceReportLang.langJSON(),
          }}
        />
      </div>
    </div>
  );
}
