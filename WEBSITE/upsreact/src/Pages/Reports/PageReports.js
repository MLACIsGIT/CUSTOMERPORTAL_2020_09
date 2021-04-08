import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"
import GridReport from "../../_SelComponents/_SelWebComponents/GridReport/GridReport"
import * as reportTevaTigLang from "./TEVA-TIG-REPORT-lang"

export default function PageReports(props) {
    if (props.loginData.user === null) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <div className="page-reports">
            <HeaderLine
                lang={props.lang}
                selectedPage={"reports"}
                loginData={props.loginData}
            />

            <GridReport
                id="TEVA-TIG-REPORT"
                lang={props.lang}
                report={{
                    "reportId": "REPORT_TEVA_TIG",
                    "languageElements": reportTevaTigLang.langJSON(),
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
