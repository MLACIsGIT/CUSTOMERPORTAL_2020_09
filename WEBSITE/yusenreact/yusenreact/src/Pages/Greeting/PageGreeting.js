import "./PageGreeting.scss";
import { Link } from 'react-router-dom';
import HeaderLine from "../../Components/HeaderLine/HeaderLine"
import YusenInfobox from "../../Components/YusenInfobox/YusenInfobox";
import * as Gl from "../../_SelComponents/_SelWebComponents/js/Gl"
import LangJSON from './PageGreeting-lang'

export default function PageGreeting(props) {
    const LangElements = LangJSON();
    const lang = props.lang;

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    const infobox = <>
        <div className="header-area">
        <h4>{lng("greeting-header")}</h4>
        </div>
        <br />
        <div className="infoText-area">
            <h6>{lng("greeting-p-01")}</h6>
        </div>
        <div className="input-field-area">
            <Link to={"/login"} className="btn btn-primary">{lng("btn-login")}</Link>
        </div>
        <div className="infoText-area">
            <h6>{lng("greeting-p-02")}</h6>
        </div>
        <div className="input-field-area">
            <Link to={"/register"} className="btn btn-primary">{lng("btn-register")}</Link>
        </div>
    </>

    return (
        <div className="page-greeting">
            <HeaderLine
                lang={props.lang}
                selectedPage={"greeting"}
                loginData={props.loginData}
            />
            <main className="page-greeting-main">
                <YusenInfobox
                    left={"150px"}
                    top={"50px"}
                    info={infobox}
                />
            </main>
        </div>)
}