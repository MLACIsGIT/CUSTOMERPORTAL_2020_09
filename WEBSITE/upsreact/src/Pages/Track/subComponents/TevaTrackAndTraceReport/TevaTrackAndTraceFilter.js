import * as Gl from "../../../../_SelComponents/_SelWebComponents/js/Gl";
import LangJSON from './TevaTrackAndTraceFilter-lang';

export default function TevaTrackAndTraceFilter(props) {
    const LangElements = LangJSON();
    const lang = props.lang;

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    return (
        <div className="TrackAndTraceReportFilters">
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">{lng('dispositionNumber')}</label>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control reportFilter" data-sql="PositionNumber like'?%'" />
                </div>
            </div>
            <br />
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">{lng('itemId')}</label>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control reportFilter" data-sql="ItemNo like'?%'" />
                </div>
            </div>
            <br />
            <div className="row g-3 align-items-center">
                <div className="col-2">
                    <label className="col-form-label">{lng('date')}</label>
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="LoadingDate >=?" />
                </div>
                <div className="col-3">
                    <input type="date" className="form-control reportFilter" data-sql="LoadingDate <=?(2359)" />
                </div>
            </div>
        </div>
    )
}
