import { useState } from 'react'
import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"
import ContactHamMenu from "./ContactHamMenu/ContactHamMenu";

export default function PageTracking(props) {
    const [hamShowed, showHam] = useState(true)

    function onHamClicked() {
        showHam(!hamShowed);
    }

    if (props.loginData.user === null) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <div className="page-contact">
            <HeaderLine
                lang={props.lang}
                selectedPage={"contact"}
                loginData={props.loginData}
                onHamClicked={onHamClicked}
            />


            <main>
                <aside>
                    <ContactHamMenu
                        show={hamShowed}
                        lang={props.lang}
                    />
                </aside>
            </main>
        </div>
    )
}
