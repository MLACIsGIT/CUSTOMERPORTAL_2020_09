import * as Gl from "../../../../common/Gl";
import useSettings from "../../../../common/SettingsContext";
import LangJSON from "./TevaTrackAndTraceFilter-lang";

export default function TevaTrackAndTraceFilter() {
  const LangElements = LangJSON();
  const { lang } = useSettings();

  function lng(key) {
    return Gl.LANG_GET_FormItem(LangElements, key, lang);
  }

  return (
    <div className="TrackAndTraceReportFilters">
      <div className="row g-3 align-items-center">
        <div className="col-2">
          <label className="col-form-label">{lng("dispositionNumber")}</label>
        </div>
        <div className="col-3">
          <input
            id="PositionNo"
            type="text"
            className="form-control reportFilter"
            data-sql="PositionNo like'?%'"
          />
        </div>
      </div>
      <br />
      <div className="row g-3 align-items-center">
        <div className="col-2">
          <label className="col-form-label">{lng("itemId")}</label>
        </div>
        <div className="col-3">
          <input
            id="ItemNo"
            type="text"
            className="form-control reportFilter"
            data-sql="ItemNo like'?%'"
          />
        </div>
      </div>
      <br />
      <div className="row g-3 align-items-center">
        <div className="col-2">
          <label className="col-form-label">{lng("date")}</label>
        </div>
        <div className="col-3">
          <input
            id="LoadingDateStart"
            type="date"
            className="form-control reportFilter"
            data-sql="LoadingDate >=?"
          />
        </div>
        <div className="col-3">
          <input
            id="LoadingDateEnd"
            type="date"
            className="form-control reportFilter"
            data-sql="LoadingDate <=?(2359)"
          />
        </div>
      </div>
    </div>
  );
}
