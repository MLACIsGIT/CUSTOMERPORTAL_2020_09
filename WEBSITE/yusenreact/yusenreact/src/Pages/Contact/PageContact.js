import { useState } from 'react'
import { Redirect } from "react-router-dom"
import "./PageContact.scss"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"
import ContactHamMenu from "./ContactHamMenu/ContactHamMenu"

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
            />

            <aside>
                <ContactHamMenu
                    show={true}
                    lang={props.lang}
                />
            </aside>
            <main className="page-contact-main">
valami
            </main>
        </div>
    )
}
