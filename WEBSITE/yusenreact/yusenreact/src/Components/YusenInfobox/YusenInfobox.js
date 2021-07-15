import "./YusenInfobox.scss";
import headerLogo from "../../PicturesForSelComponents/headerLogo.png";

export default function YusenInfobox(props) {
  return (
    <div className="yusen-infobox-container">
      <div className="yusen-infobox">
        <div className="yusen-infobox-article">
          <div className="yusen-infobox-header">
            <div className="logo-area">
              <img
                className="header-logo"
                src={headerLogo}
                height="50px"
                alt="logo"
              />
            </div>
          </div>
          <div className="yusen-infobox-main">{props.info}</div>
        </div>
      </div>
    </div>
  );
}
