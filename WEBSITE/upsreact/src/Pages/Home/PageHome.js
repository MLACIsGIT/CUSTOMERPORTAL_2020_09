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

            <article className="messages">
                <div className="messages-column-1">
                    <div className="message-items">
                        <div className="message-item">
                            <h4>{"10.01.2020"}</h4>
                            <h3>{"Lorem ipsum dolor sit amet."}</h3>
                            <h4>{"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt recusandae vel voluptatibus repudiandae nesciunt in doloremque id sint fugit. Saepe et culpa ut optio commodi."}</h4>
                            <a href="">{"Details..."}</a>
                        </div>

                        <div className="message-item">
                            <h4>{"10.01.2020"}</h4>
                            <h3>{"Lorem ipsum dolor sit amet."}</h3>
                            <h4>{"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt recusandae vel voluptatibus repudiandae nesciunt in doloremque id sint fugit. Saepe et culpa ut optio commodi."}</h4>
                            <a href="">{"Details..."}</a>
                        </div>

                        <div className="message-item">
                            <h4>{"10.01.2020"}</h4>
                            <h3>{"Lorem ipsum dolor sit amet."}</h3>
                            <h4>{"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt recusandae vel voluptatibus repudiandae nesciunt in doloremque id sint fugit. Saepe et culpa ut optio commodi."}</h4>
                            <a href="">{"Details..."}</a>
                        </div>
                    </div>
                </div>

                <div className="messages-column-2">
                    <img src={PageHome_background_1} alt="background_1.png" />
                </div>
            </article>
        </div>
    )
}
