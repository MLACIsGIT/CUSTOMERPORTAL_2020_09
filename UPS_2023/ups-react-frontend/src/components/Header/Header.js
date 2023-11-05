import "./Header.scss";
import headerLogo from "./headerLogo.png";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import LoggedUser from "../LoggedUser/LoggedUser";

export default function Header() {
  return (
    <header>
      <div className="main-header SEL-LAYOUT-CONTAINER">
        <div className="logo-area SEL-LAYOUT-2-COLUMNS">
          <img className="header-logo" src={headerLogo} alt="logo" />
        </div>
        <div className="loggedUser-and-languagePicker">
          <LoggedUser />
          <LanguageSelector
            languages={[
              { value: "en", text: "en" },
              { value: "hu", text: "hu" },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
