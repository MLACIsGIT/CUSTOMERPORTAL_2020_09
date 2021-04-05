import './Header.scss';
import headerLogo from "./headerLogo.png";
import LanguageSelector from "../../_SelComponents/_SelWebComponents/LanguageSelector/LanguageSelector"
import HeaderLine from "../HeaderLine/HeaderLine";

export default function Header(props) {
    function onLanguageChanged(lang) {
        props.onLanguageChanged(lang);
    }

    return (
        <header>
            <div className="main-header SEL-LAYOUT-CONTAINER">
                <div className="logo-area SEL-LAYOUT-2-COLUMNS">
                    <img className="header-logo" src={headerLogo} alt="logo" />
                </div>

                <div className="Logo_And_Header_LanguagePicker">
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

            <HeaderLine
                lang={props.lang}
                selectedPage={props.selectedPage}
            />
        </header>

    )
}