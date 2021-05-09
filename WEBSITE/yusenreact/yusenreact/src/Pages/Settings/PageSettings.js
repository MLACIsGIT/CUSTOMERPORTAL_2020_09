import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"

export default function PageTracking(props) {
    if (props.loginData.user === null) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <div className="page-settings">
            <HeaderLine
                lang={props.lang}
                selectedPage={"settings"}
                loginData={props.loginData}
            />
        </div>
    )
}
