import backgroundImage from "./login_world.png";
import "./PageLogin.scss"
import InputFieldSet from '../../_SelComponents/_SelWebComponents/InputFieldSet/InputFieldSet'
import LangJSON from './PageLogin-lang'

export default function PageLogin(props) {
    return (
        <div className="page-login">
            <h1>PAGE LOGIN</h1>
            <div id="LOGIN_BACKGROUND">
                    <img src={backgroundImage} alt="login_world.png" />
            </div>
        </div>
    )
}
