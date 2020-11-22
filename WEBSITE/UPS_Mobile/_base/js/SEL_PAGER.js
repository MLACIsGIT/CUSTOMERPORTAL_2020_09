export class SEL_PAGE {
    #Pages = {};
    #Selected_Page_ID;

    _isID = (selector) => { return (selector.substr(0, 1) === "#") }

    _PAGE_HIDE = (Page_ID) => {
        if (this._isID(Page_ID)) {
            document.querySelector(Page_ID).style.display = "none";
        } else {
            for (let i of document.querySelectorAll(`.${Page_ID}`)) {
                i.style.display = "none";
            }
        }
    }

    _PAGE_SHOW = (Page_ID, DisplayType = "block") => {
        if (this._isID(Page_ID)) {
            document.querySelector(Page_ID).style.display = DisplayType;
        } else {
            for (let i of document.querySelectorAll(`.${Page_ID}`)) {
                i.style.display = DisplayType;
            }
        }
    }

    PAGE_ADD = (Page_ID, Params = {}) => {
        this.Pages[Page_ID] = Params;
    }

    PAGE_REMOVE = (Page_ID) => {
        delete this.Pages[Page_ID]
    }

    PAGE_SELECT = (Page_ID, DisplayType = "block") => {
        this.Selected_Page_ID = Page_ID;

        for (let C_Page_ID of Object.keys(this.Pages)) {
            let C_Display = (C_Page_ID == this.Selected_Page_ID) ? DisplayType : "none";
            if (this._isID(C_Page_ID)) {
                document.querySelector(C_Page_ID).style.display = C_Display;
            } else {
                for (let i of document.querySelectorAll(`.${C_Page_ID}`)) {
                    i.style.display = C_Display;
                }
            }
        }
    }

    PAGE_SELECT_FIRST_DISPLAYED = () => {
        for (let C_Page_ID of Object.keys(this.Pages)) {
            let C_i = document.getElementById(C_Page_ID);
            if (C_i != undefined) {
                if (C_i.style.display != "none") {
                    return C_Page_ID;
                }
            }
        }

        return undefinied;
    }

    HIDE_ALL_PAGES = () => this.PAGE_SELECT("");

    constructor(Params) {
        this.Pages = Params.Pages;
    }
}