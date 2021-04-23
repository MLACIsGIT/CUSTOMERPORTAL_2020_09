import GridReport from "../../../_SelComponents/_SelWebComponents/GridReport/GridReport"
import LangJSON from "./ReportInvoices01-lang"
import ReportInvoices01Filter from "./ReportInvoices01Filter"

export default function ReportInvoices01(props) {
    return (
        <div className="ReportInvoices01">
            <GridReport
                id="ReportInvoices01"
                lang={props.lang}

                Filters={<ReportInvoices01Filter
                    lang={props.lang}
                    loginData={props.loginData}
                />}

                report={{
                    "reportId": "ReportInvoices01",
                    "languageElements": LangJSON(),
                    "recordset": {
                        "defaultSqlSelect": "ID, TIG_PositionNumber",
                        "defaultSqlTop": 10,
                        "sqlFrom": "WAT_INV",
                        "defaultSqlOrderBy": "Inv_Num"
                    }
                }}
            />
        </div>
    )

}
