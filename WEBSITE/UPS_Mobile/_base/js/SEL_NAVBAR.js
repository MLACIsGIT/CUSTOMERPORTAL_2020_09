import * as M_SEL_SVG from './SEL_SVG.js'

export class SEL_NAVBAR {
    _SVG_COLORS_FROM_Params_GET (Params) {
        let SVG_COLORS = {};

        for (let k of Object.keys(Params.COLORS)) {
            SVG_COLORS[k] = Params.COLORS[k].SVG_COLORS;
        }

        return SVG_COLORS;
    }

    _COLORING_ITEM (item_id, COLOR_PALETTE) {
        if (item_id == undefined) {
            return;
        }

        let c_item = this.NAVBAR_ITEMS[item_id]

        if (c_item == undefined) {
            return;
        }

        let c_OPACITY = this.COLOR_PALETTES[COLOR_PALETTE].OPACITY;
        switch (c_OPACITY) {
            case "CSS_HOVER": c_item.style.opacity = ""; break;
            default: c_item.style.opacity = c_OPACITY; break;
        }

        c_item.style.backgroundColor = this.COLOR_PALETTES[COLOR_PALETTE].BACKGROUND_COLOR;

        let c_SVG = c_item.querySelector(".NAVBAR_ITEM_SVG")
        if (c_SVG != undefined) {
            c_SVG.style.backgroundColor = this.COLOR_PALETTES[COLOR_PALETTE].BACKGROUND_COLOR;
            this.NAVBAR_SVGs.SVG_FILL(c_SVG, COLOR_PALETTE)
        }
        let c_TEXT = c_item.querySelector(".NAVBAR_ITEM_TEXT")
        if (c_TEXT != undefined) {
            c_TEXT.style.color = this.COLOR_PALETTES[COLOR_PALETTE].TEXT_COLOR;
            c_TEXT.style.backgroundColor = this.COLOR_PALETTES[COLOR_PALETTE].BACKGROUND_COLOR;
        }
    }

    SELECTED_ITEM_ID_GET () {return this.SELECTED_ITEM_ID;}

    SELECTED_ITEM_SET (Item_id) {
        if (this.SELECTED_ITEM_ID != undefined) {
            this._COLORING_ITEM(this.SELECTED_ITEM_ID, "NORMAL");
            this.SELECTED_ITEM_ID = undefined;
        }

        this.SELECTED_ITEM_ID = Item_id;
        this._COLORING_ITEM(this.SELECTED_ITEM_ID, "SELECTED");
    }

    EVENT_NAVBAR_ITEM_CLICKED (e) {
        let Path_items_with_id = e.path.filter(p => p.id > "")
        for (let i of Path_items_with_id) {
            if (this.NAVBAR_ITEMS[i.id] != undefined) {
                let Event_detail = {
                    NAVBAR_ITEM: {
                        id: i.id,
                        e: this.NAVBAR_ITEMS[i.id]
                    }
                }
                let event_NAVBAR_ITEM_CLICKED = new CustomEvent('NAVBAR_ITEM_CLICKED', { detail: Event_detail });
                this.NAVBAR.dispatchEvent(event_NAVBAR_ITEM_CLICKED)
            }
        }
    }

    _NAVBAR_CSS_VARIABLES_SET () {
        this.NAVBAR.style.setProperty('--NAVBAR_COUNT_OF_MENUITEMS', Object.keys( this.NAVBAR_ITEMS ).length)
    }

    NAVBAR_ITEMS_ADD = (Item) => {
        this.NAVBAR_ITEMS[Item.id] = Item;
        Item.addEventListener('click', this.EVENT_NAVBAR_ITEM_CLICKED);
        this._NAVBAR_CSS_VARIABLES_SET();
    }

    constructor(Params) {
        //#SELECTED_ITEM_ID;
        this.SELECTED_ITEM_ID = undefinied;

        //#NAVBAR_ID;
        this.NAVBAR_ID = Params.NAVBAR_ID;
        
        let SVG_DEF = {
            "SVG": Params.SVG,
            "SVG_COLORS": this._SVG_COLORS_FROM_Params_GET(Params)
        }
        
        //#COLOR_PALETTES = {};
        this.COLOR_PALETTES = Params.COLORS;
        
        //#NAVBAR_SVGs;
        this.NAVBAR_SVGs = new M_SEL_SVG.SEL_SVG(SVG_DEF);
        this.NAVBAR_SVGs.SVG_PICTURES_SET_ALL(".NAVBAR_ITEM_SVG");
        
        //#NAVBAR_ITEMS = {};
        this.NAVBAR_ITEMS = {};
        
        //#NAVBAR;
        this.NAVBAR = document.getElementById(this.NAVBAR_ID)
        if (this.NAVBAR != undefined) {
            for (let i of this.NAVBAR.querySelectorAll(".SEL_NAVBAR_ITEM")) {
                this.NAVBAR_ITEMS_ADD(i)
                this._COLORING_ITEM(i.id, "NORMAL")
            }
        }
    }
}
