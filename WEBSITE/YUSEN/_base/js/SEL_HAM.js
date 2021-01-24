export class SEL_HAM_MENU {
    HAM_HIDE () {
        this.HAM.style.display = 'none';
    }

    HAM_SHOW () {
        this.HAM.style.display = this.HAM_display_mode;
    }

    SELECTED_ITEM_ID_GET () {return this.SELECTED_ITEM_ID;}

    SELECTED_ITEM_SET (Item_id) {
        this.#SELECTED_ITEM_ID = Item_id;
        for (let i of Object.keys(this.HAM_ITEMS)) {
            let i_element = document.getElementById(i)
            if (i_element != null) {
                if (i_element.id == Item_id) {
                    i_element.classList.remove("SEL_NOT_SELECTED")
                    i_element.classList.add("SEL_SELECTED")
                } else {
                    i_element.classList.remove("SEL_SELECTED")
                    i_element.classList.add("SEL_NOT_SELECTED")
                }
            }
        }
    }

    DESELECT_ALL () {this.SELECTED_ITEM_SET("");}

    EVENT_HAM_ITEM_CLICKED (e) {
        let Path_items_with_id = e.path.filter(p => p.id > "")
        for (let i of Path_items_with_id) {
            if (this.HAM_ITEMS[i.id] != undefined) {
                let Event_detail = {
                    HAM_ITEM: {
                        id: i.id,
                        e: this.HAM_ITEMS[i.id]
                    }
                }
                let event_HAM_ITEM_CLICKED = new CustomEvent('HAM_ITEM_CLICKED', { detail: Event_detail });
                this.HAM.dispatchEvent(event_HAM_ITEM_CLICKED)
            }
        }
    }

    HAM_ITEMS_ADD (Item) {
        Item.addEventListener('click', this.EVENT_HAM_ITEM_CLICKED)
        this.HAM_ITEMS[Item.id] = Item
    }

    HAM_FILTER_ITEMS (ITEM_CLASS) {
        for (let k of Object.keys(this.HAM_ITEMS)) {
            this.HAM_ITEMS[k].style.display = this.HAM_ITEMS[k].classList.value.split(' ').includes(ITEM_CLASS) ? 'block' : 'none';
        }
    }

    HAM_BUTTON_CLICK () {
        this.HAM.style.display = (['', 'none'].includes(this.HAM.style.display)) ? this.HAM_display_mode : 'none';
    };

    constructor(Params) {
        //#SELECTED_ITEM_ID;
        this.SELECTED_ITEM_ID = '';
        
        //#HAM_ITEMS;
        this.HAM_ITEMS = {};
        
        //#HAM;
        this.HAM = document.getElementById(Params.HAM_ID);
        
        //#HAM_display_mode = "flex"; // a menu normal allapotban display = none; amikor lathatova akarom tenni, akkor az itt megadott parameter szerint allitja be a display-t.
        this.HAM_display_mode = Params.HAM_display_mode;
        
        //#HAM_BUTTON;
        this.HAM_BUTTON = document.getElementById(Params.HAM_BUTTON_ID);
        this.HAM_BUTTON.addEventListener("click", this.HAM_BUTTON_CLICK)

        for (let i of this.HAM.querySelectorAll(".SEL_HAM_MENU_ITEM")) {
            this.HAM_ITEMS_ADD(i);
        }
    }
}
