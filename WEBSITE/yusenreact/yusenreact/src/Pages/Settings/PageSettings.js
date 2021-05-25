import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"
import SelAddNewUser from "../../_SelComponents/_SelWebComponents/SelAddNewUser/SelAddNewUser"

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

            <SelAddNewUser 
                lang={props.lang}
                loginData={props.loginData}
            />
        </div>
    )
}
