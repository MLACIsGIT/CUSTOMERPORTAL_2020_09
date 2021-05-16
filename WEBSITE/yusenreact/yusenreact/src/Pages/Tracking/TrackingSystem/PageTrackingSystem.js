import { useState } from 'react'
import { Redirect } from "react-router-dom"
import "./PageTrackingSystem.scss"
import HeaderLine from "../../../Components/HeaderLine/HeaderLine"
import TrackingHamMenu from "../TrackingHamMenu/TrackingHamMenu"
import YusenInfobox from "../../../Components/YusenInfobox/YusenInfobox";
import TrackingSystem from "./TrackingSystem/TrackingSystem"

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

    const infobox =
        <TrackingSystem
            lang={props.lang}
        />

    return (
        <div className="page-tracking-system">
            <HeaderLine
                lang={props.lang}
                selectedPage={"tracking-system"}
                loginData={props.loginData}
                onHamClicked={onHamClicked}
            />

            <article>
                <aside>
                    <TrackingHamMenu
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

            </article>

        </div>
    )
}
