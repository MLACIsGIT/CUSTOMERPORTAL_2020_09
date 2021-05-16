import { Redirect } from "react-router-dom"
import "./PageRegister.scss"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"
import YusenFormBorder from "../../Components/YusenFormBorder/YusenFormBorder"
import SelRegister from "../../_SelComponents/_SelWebComponents/SelRegister/SelRegister"
import * as Gl from "../../_SelComponents/_SelWebComponents/js/Gl"
import LangJSON from './PageRegister-lang'

export default function PageRegister(props) {
    const LangElements = LangJSON();
    const lang = props.lang;

    if (props.loginData.user !== null) {
        return <Redirect to='/home' />
    }

    function lng(key) {
        return Gl.LANG_GET_FormItem(LangElements, key, lang)
    }

    let regForm = <>
        <h1>{lng("form-title")}</h1>
        <SelRegister
            lang={props.lang}
        />
    </>

    return (
        <div className="page-register">
            <HeaderLine
                lang={props.lang}
                selectedPage={"greeting"}
                loginData={props.loginData}
            />
            <main className="page-register-main">
                <div className="page-register-form">
                    <YusenFormBorder
                        lang={props.lang}
                        form={regForm}
                    />
                </div>
            </main>
        </div>)
}
