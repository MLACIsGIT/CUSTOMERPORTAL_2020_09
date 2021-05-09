import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"

export default function PageTracking(props) {
    if (props.loginData.user === null) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <div className="page-stocks">
            <HeaderLine
                lang={props.lang}
                selectedPage={"stocks"}
                loginData={props.loginData}
            />
        </div>
    )
}
