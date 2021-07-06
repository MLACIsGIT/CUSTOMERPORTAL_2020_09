import "./PageTrack.scss";
import { Redirect } from "react-router-dom";
import HeaderLine from "../../Components/HeaderLine/HeaderLine";
import * as Gl from "../../_SelComponents/_SelWebComponents/js/Gl";
import TevaTrackAndTraceFilter from "./subComponents/TevaTrackAndTraceReport/TevaTrackAndTraceFilter";
import langJSON from "./PageTrack-lang";
import * as TevaTrackAndTraceReportLang from "./subComponents/TevaTrackAndTraceReport/TevaTrackAndTrace-lang";
import GridReport from "../../_SelComponents/_SelWebComponents/GridReport/GridReport";

export default function PageTrack(props) {
  if (props.loginData.user === null) {
    return <Redirect to="/" />;
  }

  const LangElements = langJSON();
  const lang = props.lang;

  function lng(key) {
    return Gl.LANG_GET_FormItem(LangElements, key, lang);
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
            columns: [
              {
                headerName: "column-positionNumber",
                field: "PositionNumber",
              },
              { field: 'itemNo'},
              { field: 'CustomerNo'},
              { field: 'DispositionNo'},
              { field: 'LoadingDate', type: 'date'},
              { field: 'LoadingPlace'},
              { field: 'UnloadingDate', type: 'date'},
              { field: 'UnloadingPlace'},
              { field: 'TransportStatus'},
            ],
          }}
        />
      </div>
    </div>
  );
}
