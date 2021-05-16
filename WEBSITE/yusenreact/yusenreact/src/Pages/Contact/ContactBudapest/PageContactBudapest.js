import { useState } from 'react'
import { Redirect, Link } from "react-router-dom"
import './PageContactBudapest.scss';
import HeaderLine from "../../../Components/HeaderLine/HeaderLine"
import ContactHamMenu from "../ContactHamMenu/ContactHamMenu";
import YusenInfobox from "../../../Components/YusenInfobox/YusenInfobox";
import * as Gl from "../../../_SelComponents/_SelWebComponents/js/Gl"
import LangJSON from './PageContactBudapest-lang'

export default function ContactBudapest(props) {
    const LangElements = LangJSON();
    const lang = props.lang;

    const [hamShowed, showHam] = useState(false)

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    function onHamClicked() {
        showHam(!hamShowed);
    }

    if (props.loginData.user === null) {
        return (
            <Redirect to="/" />
        )
    }

    let mailTo =
        <Link to='#' onClick={(e) => {
            e.preventDefault();
            window.location = `mailto: ${lng("email")}`;
        }}
        >
            {lng("email")}
        </Link>

    const infobox = <>
        <h4>{lng("title1")}</h4>
        <h4>{lng("title2")}</h4>
        <br />
        <h6>{lng("info1")}</h6>
        <h6>{lng("info2")}</h6>
        <h6>{lng("info3")}</h6>
        <br />
        <h6>{lng("info4")}</h6>
        <h6>{lng("info5")}</h6>
        <h6>{lng("info6")}{mailTo}</h6>
    </>

    return (
        <div className="page-contact-budapest">
            <HeaderLine
                lang={props.lang}
                selectedPage={"contact"}
                loginData={props.loginData}
                onHamClicked={onHamClicked}
            />

            <aside>
                <ContactHamMenu
                    show={hamShowed}
                    lang={props.lang}
                />
            </aside>
            <main>
                <YusenInfobox
                    left={"150px"}
                    top={"50px"}
                    info={infobox}
                />
            </main>
        </div>)
}