import "./PageLogin.scss";
import { Redirect } from 'react-router-dom';
import HeaderLine from "../../Components/HeaderLine/HeaderLine"
import YusenInfobox from "../../Components/YusenInfobox/YusenInfobox"
import SelLogin from '../../_SelComponents/_SelWebComponents/SelLogin/SelLogin'

export default function PageLogin(props) {
    function onLogin(newLoginData) {
        props.onLogin(newLoginData)
    }

    if (props.loginData.user !== null) {
        return <Redirect to='/home' />
    }

    const infobox =
        <SelLogin
            lang={props.lang}
            db={props.db}
            settings={props.settings}
            loginData={props.loginData}
            onLogin={newLoginData => onLogin(newLoginData)}
        />

    return (
        <div className="page-login">
            <HeaderLine
                lang={props.lang}
                selectedPage={"login"}
                loginData={props.loginData}
            />

            <main>
                <YusenInfobox
                    left={"150px"}
                    top={"50px"}
                    info={infobox}
                />
            </main>
        </div>
    )
}
