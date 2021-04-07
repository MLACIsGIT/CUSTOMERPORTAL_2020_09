import './Header.scss';
import headerLogo from "./headerLogo.png";
import LanguageSelector from "../../_SelComponents/_SelWebComponents/LanguageSelector/LanguageSelector"
import LoggedUser from "../../_SelComponents/_SelWebComponents/LoggedUser/LoggedUser"
export default function Header(props) {
    function onLanguageChanged(lang) {
        props.onLanguageChanged(lang);
    }

    function onLogout() {
        props.onLogout()
    }

    return (
        <header>
            <div className="main-header SEL-LAYOUT-CONTAINER">
                <div className="logo-area SEL-LAYOUT-2-COLUMNS">
                    <img className="header-logo" src={headerLogo} alt="logo" />
                </div>

                <div className="loggedUser-and-languagePicker">
                    {
                        (props.loginData.user) &&
                        <LoggedUser
                            lang={props.lang}
                            loginData={props.loginData}
                            onLogout={onLogout}
                        />
                    }

                    <LanguageSelector languages={[
                        { value: "en", text: "en" },
                        { value: "de", text: "de" },
                        { value: "hu", text: "hu" }
                    ]}
                        defaultLanguage={props.lang}
                        onLanguageChanged={lang => { onLanguageChanged(lang) }}
                    />
                </div>
            </div>
        </header>

    )
}