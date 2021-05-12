import "./HamMenu.scss";
import HamMenuItem from "./HamMenuItem/HamMenuItem";

export default function HamMenu(props) {
    if (!props.show) {
        return null;
    }

    return (
        <div className="hamMenu">
            {
                props.menuItems.map(item => {
                    return (
                        <HamMenuItem
                            key={item.itemId}
                            lang={props.lang}
                            langElements={props.langElements}
                            itemId={item.itemId}
                            isSelected={item.isSelected}
                            link={item.link}
                        />

                    )
                })

            }
        </div>
    )
}