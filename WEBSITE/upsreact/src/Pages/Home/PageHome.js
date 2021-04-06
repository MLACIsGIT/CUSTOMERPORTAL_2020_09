import { useHistory } from "react-router-dom"

export default function PageHome(props) {
    const history = useHistory();
    if (props.loginData.userId === null) {
        history.push("/");
    }

    return (
        <div>
            <h1>PAGE HOME</h1>
        </div>
    )
}
