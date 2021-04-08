import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"

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

            <h1>{"Track & Trace"}</h1>
        </div>
    )
}