import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"

export default function PageContact(props) {
    if (props.loginData.user === null) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <div className="page-contact">
            <HeaderLine
                lang={props.lang}
                selectedPage={"contact"}
                loginData={props.loginData}
            />

            <h1>{"Contact"}</h1>
        </div>
    )
}