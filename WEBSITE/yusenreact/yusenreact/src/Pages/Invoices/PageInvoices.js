import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"
import ReportInvoices01 from "./ReportInvoices01/ReportInvoices01"

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
                selectedPage={"invoices"}
                loginData={props.loginData}
            />

            <ReportInvoices01
                lang={props.lang}
                loginData={props.loginData}
                db={props.db}
            />
        </div>
    )
}
