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

            <div className="HAM_ITEM_NEWS_1_CONTAINER">
                <div className="HAM_ITEM_NEWS_1_COLUMN_1">
                    <div className="HAM_ITEM_NEWS_1_MESSAGE">
                        <h4 className="HAM_ITEM_NEWS_1_MESSAGE_DATE">10.01.2020</h4>
                        <h3 className="HAM_ITEM_NEWS_1_MESSAGE_TITLE">Lorem ipsum dolor sit amet.</h3>
                        <h4 className="HAM_ITEM_NEWS_1_MESSAGE_TEXT">Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        Deserunt recusandae vel voluptatibus repudiandae nesciunt in doloremque id sint fugit. Saepe et culpa ut
                optio commodi.</h4>
                        <h4 className="HAM_ITEM_NEWS_1_MESSAGE_LINK_AREA"><a href="">Details...</a></h4>
                    </div>

                    <div className="HAM_ITEM_NEWS_1_MESSAGE">
                        <h4 className="HAM_ITEM_NEWS_1_MESSAGE_DATE">10.01.2020</h4>
                        <h3 className="HAM_ITEM_NEWS_1_MESSAGE_TITLE">Lorem ipsum dolor sit amet.</h3>
                        <h4 className="HAM_ITEM_NEWS_1_MESSAGE_TEXT">Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        Deserunt recusandae vel voluptatibus repudiandae nesciunt in doloremque id sint fugit. Saepe et culpa ut
                optio commodi.</h4>
                        <h4 className="HAM_ITEM_NEWS_1_MESSAGE_LINK_AREA"><a href="">Details...</a></h4>
                    </div>

                    <div className="HAM_ITEM_NEWS_1_MESSAGE">
                        <h4 className="HAM_ITEM_NEWS_1_MESSAGE_DATE">10.01.2020</h4>
                        <h3 className="HAM_ITEM_NEWS_1_MESSAGE_TITLE">Lorem ipsum dolor sit amet.</h3>
                        <h4 className="HAM_ITEM_NEWS_1_MESSAGE_TEXT">Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                        Deserunt recusandae vel voluptatibus repudiandae nesciunt in doloremque id sint fugit. Saepe et culpa ut
                optio commodi.</h4>
                        <h4 className="HAM_ITEM_NEWS_1_MESSAGE_LINK_AREA"><a href="">Details...</a></h4>
                    </div>
                </div>
                <div className="HAM_ITEM_NEWS_1_COLUMN_2">

                    <img id="HAM_ITEM_NEWS_BACKGROUND_1_img"
                        src={PageHome_background_1} alt="background_1.png" />

                </div>
            </div>

        </div>


    )
}
