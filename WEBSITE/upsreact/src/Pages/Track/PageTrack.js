import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"
import GridReport from "../../_SelComponents/_SelWebComponents/GridReport/GridReport"
import * as reportTrackAndTraceLang from "./TrackAndTraceReport-lang"
import TrackAndTraceReportFilter from "./TrackAndTraceReportFilter"

export default function PageTrack(props) {
    if (props.loginData.user === null) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <div className="page-track">
            <HeaderLine
                lang={props.lang}
                selectedPage={"track"}
                loginData={props.loginData}
            />

            <GridReport
                id="REPORT_TrackAndTrace"
                lang={props.lang}
                Filters={<TrackAndTraceReportFilter />}
                report={{
                    "reportId": "REPORT_TEVA_TIG",
                    "languageElements": reportTrackAndTraceLang.langJSON(),
                    "recordset": {
                        "defaultSqlSelect": "ID, TIG_PositionNumber",
                        "defaultSqlTop": 10,
                        "sqlFrom": "U_UPS_TEVA_TIG_DATA_VW",
                        "defaultSqlOrderBy": "TIG_PositionNumber"
                    }
                }}
            />

        </div>
    )
}