import "./YusenFormBorder.scss";
import headerLogo from "../../PicturesForSelComponents/headerLogo.png";

export default function YusenFormBorder(props) {
    return (
        <div className="yusen-form-border">
            <div className="yusen-form-border-article">

                <div className="yusen-form-border-header">
                    <div className="logo-area">
                        <img className="header-logo" src={headerLogo} height="50px" alt="logo" />
                    </div>
                </div>
                <div className="yusen-form-border-main">
                    {props.form}
                </div>
            </div>
        </div>
    )
}