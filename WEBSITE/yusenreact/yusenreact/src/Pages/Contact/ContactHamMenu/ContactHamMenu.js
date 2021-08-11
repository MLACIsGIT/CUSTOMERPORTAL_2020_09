import HamMenu from "../../../Components/HamMenu/HamMenu";
import * as LangJSON from "./ContactHamMenu-lang";

export default function ContactHamMenu(props) {
    const LangElements = LangJSON.langJSON();

    return (
        <HamMenu
            show={props.show}
            lang={props.lang}
            langElements={LangElements}
            menuItems={
                [
                    { itemId: "BUDAPEST", link: "/contact/budapest" },
                    { itemId: "VIENNA", link: "/contact/vienna" },
                    { itemId: "KOPER", link: "/contact/koper" }
                ]
            } />
    )
}
