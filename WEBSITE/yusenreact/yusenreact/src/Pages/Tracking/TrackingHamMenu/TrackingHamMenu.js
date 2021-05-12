import HamMenu from "../../../Components/HamMenu/HamMenu";
import * as LangJSON from "./TrackingHamMenu-lang";

export default function TrackingHamMenu(props) {
    const LangElements = LangJSON.langJSON();

    return (
        <HamMenu
            show={props.show}
            lang={props.lang}
            langElements={LangElements}
            menuItems={
                [
                    { itemId: "tracking-system", link: "/tracking/trackingsystem" },
                    { itemId: "yusen-vantage" }
                ]
            } />
    )
}
