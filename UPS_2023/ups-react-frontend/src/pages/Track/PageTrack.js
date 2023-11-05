import "./PageTrack.scss";
import HeaderLine from "../../components/HeaderLine/HeaderLine";
import TevaTrackAndTraceFilter from "./subComponents/TevaTrackAndTraceReport/TevaTrackAndTraceFilter";
import * as TevaTrackAndTraceReportLang from "./subComponents/TevaTrackAndTraceReport/TevaTrackAndTrace-lang";
import GridReport from "../../components/GridReport/GridReport";

export default function PageTrack() {
  return (
    <div className="page-track">
      <HeaderLine selectedPage={"track"} />

      <div className="page-track-container">
        <GridReport
          id="REPORT_TrackAndTrace"
          Filters={<TevaTrackAndTraceFilter />}
          report={{
            reportId: "ReportUpsTrackTrace",
            languageElements: TevaTrackAndTraceReportLang.langJSON(),
          }}
        />
      </div>
    </div>
  );
}
