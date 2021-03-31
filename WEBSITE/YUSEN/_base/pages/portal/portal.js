import * as M_GL from '../../js/GL.js';
import * as M_CP_APP from '../../js/CP_App.js';
import * as M_SEL_NAVBAR from '../../js/SEL_NAVBAR.js'
import * as M_SEL_HAM from '../../js/SEL_HAM.js'
import * as M_SEL_PAGES from '../../js/SEL_PAGER.js'

let CP_App = new M_CP_APP.CP_App(
    {
        "Language_Selector_ID": "FPc_Language_Selector",
        "Language_Files": ["./portal_Lang.json"]
    }
);

let FPc_NAVBAR_MAIN = document.getElementById("NAVBAR_MAIN");
let NAVBAR_SETTINGS_URL = `${CP_App.Host_Location_url()}/_EASYSETUP/NAVBARS/NAVBAR_MAIN_DEF.json`
let NAVBAR_MAIN;
let NAVBAR_PAGES;

let p_NAVBAR_SETTINGS_GET = fetch(NAVBAR_SETTINGS_URL);

let FPc_HAM_MENU = document.getElementById("HAM_MENU");

let HAM_MENU = new M_SEL_HAM.SEL_HAM_MENU({
    HAM_ID: "HAM_MENU",
    HAM_BUTTON_ID: "FPc_HAM_MENU_BUTTON",
    HAM_display_mode: "flex"
})

let HAM_PAGES = new M_SEL_PAGES.SEL_PAGE({
    "Pages": {
        "HAM_ITEM_NEWS_1": {},
        "HAM_ITEM_NEWS_2": {},
        "HAM_ITEM_NEWS_3": {},
        "HAM_ITEM_INV_1": {},
        "HAM_ITEM_INV_2": {},
        "HAM_ITEM_STOCKS_1": {},
        "HAM_ITEM_STOCKS_2": {},
        "HAM_ITEM_FREIGHTS_1": {},
        "HAM_ITEM_FREIGHTS_2": {},
        "HAM_ITEM_SETTINGS_1": {},
        "HAM_ITEM_SETTINGS_2": {},
        "HAM_ITEM_CONTACT_1": {},
        "HAM_ITEM_CONTACT_2": {},
        "HAM_ITEM_CONTACT_3": {}
    }
})

HAM_PAGES.HIDE_ALL_PAGES()

let HAM_DESELECT_ALL = () => { HAM_MENU.DESELECT_ALL() }

let HAM_SELECT_ITEM = (HAM_ITEM_id, Do_not_hide = false) => {
    HAM_MENU.SELECTED_ITEM_SET(HAM_ITEM_id);
    if ( M_GL.IsNull(Do_not_hide, false) == false ) {
        HAM_MENU.HAM_HIDE();
    }
    HAM_PAGES.PAGE_SELECT(HAM_ITEM_id);
}

FPc_HAM_MENU.addEventListener('HAM_ITEM_CLICKED', (e) => {
    let Clicked_HAM_ITEM_id = e.detail.HAM_ITEM.id;
    HAM_SELECT_ITEM(Clicked_HAM_ITEM_id);
})

let NAVBAR_SELECT_ITEM = (NAVBAR_ITEM_id) => {
    NAVBAR_MAIN.SELECTED_ITEM_SET(NAVBAR_ITEM_id);
    NAVBAR_PAGES.PAGE_SELECT(NAVBAR_ITEM_id);

    let First_HAM_ITEM_ID = HAM_PAGES.PAGE_SELECT_FIRST_DISPLAYED();

    if (First_HAM_ITEM_ID == undefined) {
        HAM_DESELECT_ALL()
    } else {
        HAM_SELECT_ITEM(First_HAM_ITEM_ID, true)
    }
}

FPc_NAVBAR_MAIN.addEventListener('NAVBAR_ITEM_CLICKED', (e) => {
    let Clicked_NAVBAR_ITEM_id = e.detail.NAVBAR_ITEM.id;
    NAVBAR_SELECT_ITEM(Clicked_NAVBAR_ITEM_id)
})

p_NAVBAR_SETTINGS_GET
    .then(function (response) {
        return response.json();
    })
    .then(function (NAVBAR_DEF) {
        NAVBAR_MAIN = new M_SEL_NAVBAR.SEL_NAVBAR(NAVBAR_DEF);
        NAVBAR_PAGES = new M_SEL_PAGES.SEL_PAGE({
            "Pages": NAVBAR_DEF.NAVBAR_PAGES
        });
        NAVBAR_SELECT_ITEM("FPc_NAVBAR_MAIN_ITEM_NEWS")
    })
