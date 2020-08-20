import * as GL from '../../_base/js/GL.js';
import * as CP_GL from '../../_base/js/CP_App.js';

let gl_CP_App = new CP_GL.CP_App(
    {
        "Language_Selector_ID": "FPc_Language_Selector",
        "Language_Files": ["./login_Lang.json"]
    }
);

let FPf_LOGIN = document.querySelector("#FPf_LOGIN");
let FPf_LOGIN_ALERT = document.querySelector('#FPf_LOGIN_ALERT');
FPf_LOGIN.addEventListener("submit", DoLogin);

let FPc_Email = document.querySelector("#FPc_Email");
let FPc_Password = document.querySelector("#FPc_Password");
let FPc_btn_submit = document.querySelector('#FPc_btn_SUBMIT');


function ALERT_display_shortly(MyText) {
    FPf_LOGIN_ALERT.innerHTML = MyText;
    FPf_LOGIN_ALERT.style.display = 'block';
    setTimeout("FPf_LOGIN_ALERT.style.display = 'none'", 2000);
}

function DoLogin(ev) {
    ev.preventDefault();

    let Current_Email = GL.IsNull(FPc_Email.value).trim();
    let Current_Password = GL.IsNull(FPc_Password.value).trim();

    if (DoLogin_chkFields (Current_Email, Current_Password) == true ) {
        console.log("Minden OK")
    }
}


function DoLogin_chkFields(Current_Email, Current_Password) {
    Current_Email = GL.IsNull(Current_Email).trim();
    Current_Password = GL.IsNull(Current_Password).trim();

    if (Current_Email =='' || Current_Password == '') {
        ALERT_display_shortly('Adja meg a felhasználónevet és a jelszót!')
        return false;
    }

    return true;
}

//FPf_LOGIN_ALERT.style.display = 'none';

//TEST

/*
let LanguagePicker_PARAMS = {
    "LanguagePicker_dropdown_id": "#LanguagePicker"
}

let gl_lp = new CP_GL.LanguagePicker(LanguagePicker_PARAMS)
*/

//TEST - END

