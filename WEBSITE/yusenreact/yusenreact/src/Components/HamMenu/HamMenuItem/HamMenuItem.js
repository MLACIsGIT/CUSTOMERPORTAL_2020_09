import { useState } from 'react';
import { Redirect } from "react-router-dom";
import "./HamMenuItem.scss";
import * as Gl from "../../../_SelComponents/_SelWebComponents/js/Gl";

export default function HamMenuItem({ lang, langElements, itemId, isSelected, link }) {
    const [redirected, setRedirected] = useState("");

    if (redirected) {
        return (
            <Redirect to={redirected} />
        )
    }

    function lng(key) {
        return Gl.LANG_GET_FormItem(langElements, key, lang)
    }

    function onMenuItemClicked() {
        setRedirected(link);
    }

    return (
        <div id={itemId} className={`hamMenuItem ${(isSelected) ? "selected" : ""}`} onClick={onMenuItemClicked}>
            <div className="textArea">
                <div className="title">
                    <h4>{lng(`${itemId}-title`)}</h4>
                </div>
                <div className="descr">
                    <h6>{lng(`${itemId}-descr`)}</h6>
                </div>
            </div>
        </div>
    )
}