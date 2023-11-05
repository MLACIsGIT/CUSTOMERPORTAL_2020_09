import "./HeaderLine.scss";
// import { Link } from "react-router-dom";
// import * as Gl from "../../_SelComponents/_SelWebComponents/js/Gl"
import * as Gl from "../../common/Gl";
import * as LangJSON from "./HeaderLine-lang";
import useSettings from "../../common/SettingsContext";

export default function HeaderLine({ selectedPage }) {
  const { lang } = useSettings();

  const LangElements = LangJSON.langJSON();

  function lng(key) {
    return Gl.LANG_GET_FormItem(LangElements, key, lang);
  }

  let navbar;
  /*

    //let navItems = ["home", "track", "reports", "contact"]
    let navItems = ["home", "track", "contact"]

    if (props.loginData?.user !== null && navItems.length > 0) {
        let linkStyle = { width: `calc( 100% / ${navItems.length} - 4px )` }

        navbar =
            navItems.map(item => {
                if (item === selectedPage) {
                    return (
                        <Link key={item} to={`/${item}`} className="main-navbar-item btn btn-info" style={linkStyle}>
                            <span>{lng(`header-title-${item}`)}</span>
                        </Link>)
                }

                return (
                    <Link key={item} to={`/${item}`} className="main-navbar-item btn btn-light" style={linkStyle}>
                        <span>{lng(`header-title-${item}`)}</span>
                    </Link>)
            })
    }
*/
  return (
    <div className="header-line">
      <div className="main-navbar">{navbar}</div>
      <h1 className="HEADER_LINE">{lng(`header-title-${selectedPage}`)}</h1>
    </div>
  );
}
