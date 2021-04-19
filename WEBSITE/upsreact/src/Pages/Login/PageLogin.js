import "./PageLogin.scss";
import backgroundImage from "./login_world.png";
import { Redirect } from 'react-router-dom';
import HeaderLine from "../../Components/HeaderLine/HeaderLine"
import PageLoginGreetings from './subComponents/PageLoginGreetings/PageLoginGreetings'
import SelLogin from '../../_SelComponents/_SelWebComponents/SelLogin/SelLogin'

export default function PageLogin(props) {
    function onLogin(newLoginData) {
        props.onLogin(newLoginData)
    }

    if (props.loginData.user !== null) {
        return <Redirect to='/home' />
    }

    return (
        <div id="page-login">
            <HeaderLine
                lang={props.lang}
                selectedPage={"login"}
                loginData={props.loginData}
            />

            <div className="SEL-LAYOUT-CONTAINER SEL-LAYOUT-BLOCK-600px">
                <PageLoginGreetings lang={props.lang} />

                <div className="SEL-LAYOUT-2-COLUMNS">
                    <SelLogin
                        lang={props.lang}
                        db={props.db}
                        settings={props.settings}
                        loginData={props.loginData}
                        onLogin={newLoginData => onLogin(newLoginData)}
                    />
                </div>
            </div>

            <div id="LOGIN_BACKGROUND">
                <img src={backgroundImage} alt="login_world.png" />
            </div>
        </div>
    )
}
