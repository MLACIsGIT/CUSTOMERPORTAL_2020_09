import "./PageTrack.scss";
import { Redirect } from "react-router-dom";
import HeaderLine from "../../Components/HeaderLine/HeaderLine";
import * as Gl from "../../_SelComponents/_SelWebComponents/js/Gl";
import TevaTrckAndTraceFilter from "./subComponents/TevaTrackAndTraceFilter/TevaTrackAndTraceFilter";
import langJSON from "./PageTrack-lang";
import backgroundImage from "./PageTrack-background.png";
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
          Filters={<TevaTrckAndTraceFilter />}
          report={{
            reportId: "REPORT_TEVA_TIG",
            languageElements: langJSON(),
            recordset: {
              defaultSqlSelect: "ID, TIG_PositionNumber",
              defaultSqlTop: 10,
              sqlFrom: "U_UPS_TEVA_TIG_DATA_VW",
              defaultSqlOrderBy: "TIG_PositionNumber",
            },
          }}
        />
      </div>
    </div>
  );
}
