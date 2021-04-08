import "./PageHome.scss";
import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"

export default function PageHome(props) {
    if (props.loginData.user === null) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <div className="page-home">
            <HeaderLine
                lang={props.lang}
                selectedPage={"home"}
                loginData={props.loginData}
            />
        </div>
    )
}
