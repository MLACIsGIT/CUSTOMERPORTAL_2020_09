import PageHome_background_1 from "./PageHome_background_1.png"
import "./PageHome.scss";
import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"

export default function PageHome(props) {
    if (props.loginData.user === null) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <div className="page-home">
            <HeaderLine
                lang={props.lang}
                selectedPage={"home"}
                loginData={props.loginData}
            />

            <main>
                <article className="messages">
                    <div className="messages-column-1">
                        <div className="message-items">
                            <div className="message-item">
                                <h4>{"01.05.2021"}</h4>
                                <h3>{"Megkezdte működését a UPS Healthcare Customer Portal"}</h3>
                                <h4>{"Örömmel tájékoztatunk mindenkit, hogy információs weboldalunk a mai napon megkezdte működését."}</h4>
                                <a href="#">{"Részletek..."}</a>
                            </div>
                        </div>
                    </div>

                    <div className="messages-column-2">
                        <img src={PageHome_background_1} alt="background_1.png" />
                    </div>
                </article>
            </main>
        </div>
    )
}
