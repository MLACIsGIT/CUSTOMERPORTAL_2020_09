import "./HeaderLine.scss"
import * as Gl from "../../_SelComponents/_SelWebComponents/js/Gl"
import * as LangJSON from "./HeaderLine-lang"

export default function HeaderLine(props) {
    const LangElements = LangJSON.langJSON();
    const lang = props.lang;
    const selectedPage = props.selectedPage.currentPage;

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    return (
        <h1 class="HEADER_LINE">{lng(`header-title-${selectedPage}`)}</h1>
    )
}
