import * as CP_GL from './_base/js/CP_App.js';
import * as SEL_PAGER from './_base/js/SEL_PAGER.js';

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const page_login_id = "#page-login";
const page_routes_id = "#page-routes";
const container = document.querySelector(".container");
const btn_login = document.querySelector("#btn-login");

//-------------------------------------------------------------------------------
// GLOBAL VARIABLES
//-------------------------------------------------------------------------------

let Host_Location_url = `${location.protocol}//${location.host}`;
let Settings_url = `${Host_Location_url}/_EASYSETUP/settings.json`;

let CP_App;
let PAGES;

//Settings_GET
let p_CP_SETTINGS_GET = fetch(Settings_url);

p_CP_SETTINGS_GET
.then( function(response) {
    return response.json();
})
.then( function(CP_SETTINGS) {
    console.log(CP_SETTINGS);
    sessionStorage.setItem('CP_SETTINGS', JSON.stringify(CP_SETTINGS) )

    CP_App = new CP_GL.CP_App(
      {
          "Language_Selector_ID": undefined,
          "Language_Files": []
      }
    );
    
    
    PAGES = new SEL_PAGER.SEL_PAGE({
      Pages: {
        "#page-login": {},
        "#page-routes": {}
      }
    })
    
    PAGES.PAGE_SELECT(page_login_id);

    sign_up_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });
    
    sign_in_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
})
.catch( function (message) {
    document.body.innerText=`${Settings_url} not found. Error message: ${message}`;
    console.error(`${Settings_url} not found. Error message: ${message}`)
});

let DoLogin = (ev) => {
  ev.preventDefault();
  PAGES.PAGE_SELECT(page_routes_id);
}

btn_login.addEventListener("click", DoLogin);
