import "./YusenInfobox.scss";
import headerLogo from "../../PicturesForSelComponents/headerLogo.png";

export default function YusenInfobox(props) {
    const left=(props.left===undefined) ? "150px" : props.left;
    const top=(props.top===undefined) ? "50px" : props.top;

    return (
        <div className="yusen-infobox" style={{left: left, top: top}}>
            <div className="yusen-infobox-article">
                <div className="yusen-infobox-header">
                    <div className="logo-area">
                        <img className="header-logo" src={headerLogo} height="50px" alt="logo"/>
                    </div>
                </div>
                <div className="yusen-infobox-main">
                    {props.info}
                </div>
            </div>
        </div>
        )
}