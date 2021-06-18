import "./PageTrack.scss"
import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"
import * as Gl from "../../_SelComponents/_SelWebComponents/js/Gl"
import TrackTraceSearchForm from "./subComponents/TrackTraceSearchForm/TrackTraceSearchForm"
import langJSON from "./PageTrack-lang"
import backgroundImage from "./PageTrack-background.png"

export default function PageTrack(props) {
    if (props.loginData.user === null) {
        return (
            <Redirect to="/" />
        )
    }

    const LangElements = langJSON();
    const lang = props.lang;

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    return (
        <div className="page-track">
            <HeaderLine
                lang={props.lang}
                selectedPage={"track"}
                loginData={props.loginData}
            />

            <div className="page-track-container">
                <div className="column-1">
                    <div className="UPS_search-panel">
                        <div className="UPS_search-title-area">
                            <h3>{lng("form-title")}</h3>
                        </div>

                        <div className="UPS_search-text-area">
                            <p className="UPS_search-sub-title">Waybill No. / Plate No.:</p>
                            <form className="UPS_search-form-area" name="YASHPTOP">
                                <div className="UPS_search-input">
                                    <input type="text" placeholder="UPS-formatted-No" name="T1" />
                                </div>

                                <div className="UPS_search-tracking-radio">
                                    <ul>
                                        <li>
                                            <input id="UPS_input-radio-waybill" type="radio" name="tracking" value="hbl"
                                                checked="checked" />
                                            <label for="UPS_input-radio-waybill">Waybill No.</label>
                                        </li>
                                        <li>
                                            <input id="UPS_input-radio-plateno" type="radio" name="tracking" value="cntr" />
                                            <label for="UPS_input-radio-plateno">Plate No.</label>
                                        </li>
                                    </ul>
                                </div>

                                <div className="UPS_search-tracking-submit">
                                    <button className="btn btn-success" id="UPS_search-tracking-submit" type="submit">###Search</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="column-2">
                    <div>
                        <img src={backgroundImage} alt="background_1.png" />
                    </div>
                </div>


            </div>
        </div>
    )
}