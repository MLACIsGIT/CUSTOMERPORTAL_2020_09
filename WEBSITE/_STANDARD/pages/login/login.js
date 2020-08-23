import * as GL from '../../_base/js/GL.js';
import * as CP_GL from '../../_base/js/CP_App.js';

let CP_App = new CP_GL.CP_App(
    {
        "Language_Selector_ID": "FPc_Language_Selector",
        "Language_Files": ["./login_Lang.json"]
    }
);

let Temp_Credentials = {
    Current_Email : "",
    Current_Password : "",
    Session_ID_hash : "",
    Password_hash : ""
}

let FPf_LOGIN = document.querySelector("#FPf_LOGIN");
let FPf_LOGIN_ALERT = document.querySelector('#FPf_LOGIN_ALERT');
FPf_LOGIN.addEventListener("submit", submit_click);

let FPc_Email = document.querySelector("#FPc_Email");
let FPc_Password = document.querySelector("#FPc_Password");

function ALERT_display_shortly(MyText) {
    FPf_LOGIN_ALERT.innerHTML = MyText;
    FPf_LOGIN_ALERT.style.display = 'block';
    setTimeout("FPf_LOGIN_ALERT.style.display = 'none'", 2000);
}

function submit_click(ev) {
    ev.preventDefault();

    Temp_Credentials.Current_Email = GL.IsNull(FPc_Email.value).trim();
    Temp_Credentials.Current_Password = GL.IsNull(FPc_Password.value).trim();

    if (Temp_Credentials.Current_Email == '' || Temp_Credentials.Current_Password == '') {
        ALERT_display_shortly(CP_App.Text_GET('dialogs', 'Credential_data_missing_email_or_password'))
        return;
    }
    CP_App.GATEWAY.WAT_INTERFACE_SESSION_GET_NEW(Temp_Credentials.Current_Email, DoLogin_Step_02);
}

function DoLogin_Step_02(DoLogin_Step_01_Result) {
    let ErrCode = GL.IsNull(DoLogin_Step_01_Result.header.result, '')
    if (ErrCode != 'OK') {
        ALERT_display_shortly(CP_App.Text_GET('dialogs', ErrCode));
        return;
    }
    Temp_Credentials.Session_ID_hash = GL.IsNull(DoLogin_Step_01_Result.body.Session_ID, '')

    CP_App.GATEWAY.SHA512_encrypt(Temp_Credentials.Current_Password, DoLogin_Step_03)
}

function DoLogin_Step_03(DoLogin_Step_02_Result) {
    let ErrCode = GL.IsNull(DoLogin_Step_02_Result.header.result, '')
    if (ErrCode != 'OK') {
        ALERT_display_shortly(CP_App.Text_GET('dialogs', ErrCode));
        return;
    }

    Temp_Credentials.Password_hash = (GL.IsNull(DoLogin_Step_02_Result.body.Encrypted_Text, '')).substring(0, 8);
    CP_App.GATEWAY.AES_decrypt( Temp_Credentials.Session_ID_hash,  Temp_Credentials.Password_hash, DoLogin_Step_04)
}

function DoLogin_Step_04(DoLogin_Step_03_Result) {
    let ErrCode = GL.IsNull(DoLogin_Step_03_Result.header.result, '')
    if (ErrCode != 'OK') {
        ALERT_display_shortly(CP_App.Text_GET('dialogs', ErrCode));
        return;
    }
}

