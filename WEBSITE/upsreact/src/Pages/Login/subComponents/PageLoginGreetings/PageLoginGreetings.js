import "./PageLoginGreetings.scss";
import * as Gl from "../../../../_SelComponents/_SelWebComponents/js/Gl"
import LangJSON from './PageLoginGreetings-lang'

export default function PageLoginGreetings(props) {
    const LangElements = LangJSON();
    const lang = props.lang;

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    return (
        <div id="page-login-greetings" className="SEL-LAYOUT-2-COLUMNS SEL-NO-SHOW-320px">
            <div id="page-login-greetings-alert" className ="alert alert-success" role="alert">
                <h4 className="alert-heading">{lng(`greeting-header`)}</h4>
                <p>
                    {lng(`greeting-p-01`)}
                </p>
            </div>
        </div>

    )
}