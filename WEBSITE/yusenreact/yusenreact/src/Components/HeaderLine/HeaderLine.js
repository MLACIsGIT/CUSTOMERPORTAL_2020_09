import "./HeaderLine.scss";
import { Link } from "react-router-dom";
import * as Gl from "../../_SelComponents/_SelWebComponents/js/Gl";
import * as LangJSON from "./HeaderLine-lang";
import PictHandler from "./pictures/PictHandler";
import MenuOutlinedIcon from '@material-ui/icons/MenuOutlined';

export default function HeaderLine(props) {
    const LangElements = LangJSON.langJSON();
    const lang = props.lang;
    const selectedPage = props.selectedPage;
    let navbar;

    let navItems = ["home", "invoices", "stocks", "tracking", "settings", "contact"]

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    if (props.loginData!==undefined && props.loginData?.user !== null && navItems.length > 0) {
        let linkStyle = { width: `calc( 100% / ${navItems.length} - 4px )` }

        navbar =
            navItems.map(item => {
                if (item === selectedPage) {
                    return (
                        <div key={item} style={linkStyle}>
                            <Link to={`/${item}`} className="main-navbar-item btn btn-primary">
                                <PictHandler pictureCode={`${item}_selected`} />
                                <span>{lng(`header-title-${item}`)}</span>
                            </Link>
                        </div>
                    )
                }

                return (
                    <div key={item} style={linkStyle}>
                        <Link to={`/${item}`} className="main-navbar-item btn btn-light">
                            <PictHandler pictureCode={item} />
                            <span>{lng(`header-title-${item}`)}</span>
                        </Link>
                    </div>
                )
            })
    }

    return (
        <div className="header-line">
            <div className="main-navbar">
                {navbar}
            </div>
            <h1 className="header-title-bar">
                <div className="header-title-bar-column-1" onClick={props.onHamClicked}>
                    {
                        (props.onHamClicked) ? <MenuOutlinedIcon fontSize="large" /> : null
                    }
                </div>
                <div className="header-title-bar-column-2">
                    {lng(`header-title-${selectedPage}`)}
                </div>
                <div className="header-title-bar-column-3">
                </div>
            </h1>
        </div>
    )
}
