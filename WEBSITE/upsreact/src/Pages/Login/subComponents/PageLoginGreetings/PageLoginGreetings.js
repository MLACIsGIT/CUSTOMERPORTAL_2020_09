import "./PageLoginGreetings.scss";
import { HowToReg, MenuBook } from '@material-ui/icons';
import * as Gl from "../../../../_SelComponents/_SelWebComponents/js/Gl"
import LangJSON from './PageLoginGreetings-lang'

export default function PageLoginGreetings(props) {
    const LangElements = LangJSON();
    const lang = props.lang;

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    return (
        <div className="SEL-LAYOUT-2-COLUMNS SEL-NO-SHOW-320px">
            <div id="page-login-greetings" className="alert alert-success" role="alert">
                <h4 className="alert-heading">{lng(`greeting-header`)}</h4>
                <p>
                    {lng(`greeting-p-01`)}
                </p>

                <hr />

                <p className="mb-0">
                    <span>
                        {lng(`greeting-p-02`)}
                    </span>
                    <button type="button" className="btn btn-info btn-sm">
                        <span>
                            <HowToReg />
                        </span>
                    </button>
                </p>

                <hr />

                <p className="mb-0">
                    <span>
                        {lng(`greeting-p-03`)}
                    </span>
                    <button type="button" className="btn btn-info btn-sm">
                        <MenuBook />
                    </button>
                </p>
            </div>
        </div>

    )
}