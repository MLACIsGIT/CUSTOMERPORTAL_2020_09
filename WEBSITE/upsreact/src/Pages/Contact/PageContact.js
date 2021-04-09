import ContactBackground from "./PageContactBackground.png";
import "./PageContact.scss";
import { Redirect } from "react-router-dom"
import HeaderLine from "../../Components/HeaderLine/HeaderLine"

export default function PageContact(props) {
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


<div className="HAM_ITEM_CONTACT_1_CONTAINER">
          <div className="HAM_ITEM_CONTACT_1_COLUMN_1">
            <img id="PAGE_CONTACT_1_img" src={ContactBackground}
              alt="background_1.png"/>
          </div>
          <div className="HAM_ITEM_CONTACT_1_COLUMN_2">
            <h3>UPS Healthcare Hungary Zrt.</h3>
            <br/>
            <h4>2040 Budaörs</h4>
            <h4>Vasút utca 13</h4>
            <h4>Tel.: 123456789</h4>
            <h4>E-mail: <a href="mailto: email@email.hu">email@email.hu</a></h4>
          </div>
        </div>





        </div>
    )
}