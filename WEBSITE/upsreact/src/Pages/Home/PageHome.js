import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"

export default function PageHome(props) {
    if (props.loginData.user === null) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <div>
            <HeaderLine
                lang={props.lang}
                selectedPage={"home"}
            />

            <h1>PAGE HOME</h1>
        </div>
    )
}
