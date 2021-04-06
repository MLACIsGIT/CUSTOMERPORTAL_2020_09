import "./PageLogin.scss";
import backgroundImage from "./login_world.png";
import PageLoginGreetings from './subComponents/PageLoginGreetings/PageLoginGreetings'
import SelLogin from '../../_SelComponents/_SelWebComponents/SelLogin/SelLogin'

export default function PageLogin(props) {
    return (
        <div id="page-login">
            <div className="SEL-LAYOUT-CONTAINER SEL-LAYOUT-BLOCK-600px">
                <PageLoginGreetings lang={props.lang} />

                <div className="SEL-LAYOUT-2-COLUMNS">
                    <SelLogin lang={props.lang} />
                </div>
            </div>

            <div id="LOGIN_BACKGROUND">
                <img src={backgroundImage} alt="login_world.png" />
            </div>
        </div>
    )
}
