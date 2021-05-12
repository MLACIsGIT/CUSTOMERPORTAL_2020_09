import { useState } from 'react'
import { Redirect } from "react-router-dom"
import HeaderLine from "../../../Components/HeaderLine/HeaderLine"
import TrackingHamMenu from "../TrackingHamMenu/TrackingHamMenu"

export default function PageTrackingSystem(props) {
    const [hamShowed, showHam] = useState(false)

    function onHamClicked() {
        showHam(!hamShowed);
    }

    if (props.loginData.user === null) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <div className="page-tracking-system">
            <HeaderLine
                lang={props.lang}
                selectedPage={"tracking-system"}
                loginData={props.loginData}
                onHamClicked={onHamClicked}
            />

            <main>
                <aside>
                    <TrackingHamMenu
                        show={hamShowed}
                        lang={props.lang}
                    />
                </aside>
                <div>{"TRACKING SYSTEM"}</div>
            </main>

        </div>
    )
}
