import * as GL from '../../_base/js/GL.js';
import * as CP_GL from '../../_base/js/CP_App.js';

//-------------------------------------------------------------------------------
// GLOBAL VARIABLES
//-------------------------------------------------------------------------------

let CP_App = new CP_GL.CP_App(
    {
        "Language_Selector_ID": "FPc_Language_Selector",
        "Language_Files": ["./login_Lang.json"]
    }
);

let Temp_Credentials = {
    Current_Email: "",
    Code_And_Pass_hash: "",
    Session_ID: "",
    Session_ID_Encrypted: ""
}

let FPf_LOGIN = document.querySelector("#FPf_LOGIN");
let FPf_LOGIN_ALERT = document.querySelector('#FPf_LOGIN_ALERT');
FPf_LOGIN.addEventListener("submit", submit_click);

let FPc_Email = document.querySelector("#FPc_Email");
let FPc_Password = document.querySelector("#FPc_Password");

//-------------------------------------------------------------------------------
// FUNCTIONS
//-------------------------------------------------------------------------------
function ALERT_display_shortly(MyText) {
    FPf_LOGIN_ALERT.innerText = MyText;
    FPf_LOGIN_ALERT.style.display = 'block';
    setTimeout("FPf_LOGIN_ALERT.style.display = 'none'", 2000);
}

function submit_click(ev) {
    ev.preventDefault();

    let rec = grecaptcha.getResponse();
    if (rec.length == 0) {
        ALERT_display_shortly(CP_App.Text_GET('dialogs', 'ReCaptcha_empty'))
        return;
}
    else {
        Temp_Credentials.Current_Email = GL.IsNull(FPc_Email.value).trim();

        if (Temp_Credentials.Current_Email == '' || GL.IsNull(FPc_Password.value).trim() == '') {
            ALERT_display_shortly(CP_App.Text_GET('dialogs', 'Credential_data_missing_email_or_password'))
            return;
        }
        CP_App.GATEWAY.WAT_INTERFACE_SESSION_GET_NEW(Temp_Credentials.Current_Email, DoLogin_Step_02);
    }
}

function DoLogin_Step_02(DoLogin_Step_01_Result) {
    let Step_Result = GL.IsNull(DoLogin_Step_01_Result.header.result, '')
    if (Step_Result != 'OK') {
        ALERT_display_shortly(CP_App.Text_GET('dialogs', Step_Result));
        return;
    }

    Temp_Credentials.Session_ID_Encrypted = DoLogin_Step_01_Result.body.Session_ID.Session_ID_Encrypted;
    let WAT_CRYPTO_Code = DoLogin_Step_01_Result.body.Session_ID.Code;
    GL.CRYPTO_SHA512(WAT_CRYPTO_Code + GL.IsNull(FPc_Password.value).trim()).then(
        Code_And_Pass_hash => {
            Temp_Credentials.Code_And_Pass_hash = Code_And_Pass_hash
            Temp_Credentials.Session_ID = WAT_CRYPTO_Session_ID_DECRYPT(Code_And_Pass_hash, Temp_Credentials.Session_ID_Encrypted)

            CP_App.GATEWAY.WAT_INTERFACE_SESSION_ENABLE(Temp_Credentials.Current_Email, Temp_Credentials.Session_ID, Code_And_Pass_hash, DoLogin_Step_03)
        })
}

function DoLogin_Step_03(DoLogin_Step_02_Result) {
    let Step_Result = GL.IsNull(DoLogin_Step_02_Result.header.result, '')
    if (Step_Result != 'OK') {
        ALERT_display_shortly(CP_App.Text_GET('dialogs', Step_Result));
        return;
    }

    sessionStorage.setItem("Session", {
        Login: Temp_Credentials.Current_Email,
        Session_ID: Temp_Credentials.Session_ID,
    })

    console.log('--------------------------------------------------------------')
    console.log(`-- W E L C O M E   ${Temp_Credentials.Current_Email} ! ! !`)
    console.log('--------------------------------------------------------------')

    CP_App.PROCESS_HANDLER.RETURN_to_PreviousPage("messages", {})
}

function WAT_CRYPTO_Session_ID_DECRYPT(Code_And_Pass_hash, Encrypted_Session_ID) {
    let OUT = '';
    let T = [];

    if (GL.IsNull(Code_And_Pass_hash, '').trim() == '' || GL.IsNull(Encrypted_Session_ID, '').trim() == '') { return '' }

    for (let i = 0; i < Encrypted_Session_ID.length; i++) {
        T.push({
            "SeqNum": i + 1,
            "ASCII_Session_ID": 0,
            "ASCII_Encrypted": Code_And_Pass_hash.charCodeAt(i),
            "delta1": 0,
            "delta2": 0,
            "delta3": 0,
            "ASCII_Encoded": Encrypted_Session_ID.charCodeAt(i)
        })
    }

    for (let Item of T) {
        if (Item.ASCII_Encoded == 45) {
            Item.delta3 = 45;
            Item.delta2 = 45;
            Item.delta1 = 45;
            Item.ASCII_Session_ID = 45;
        } else {
            if (Item.ASCII_Encoded >= 48 && Item.ASCII_Encoded <= 57) { Item.delta3 = Item.ASCII_Encoded - 48 }
            if (Item.ASCII_Encoded >= 65 && Item.ASCII_Encoded <= 90) { Item.delta3 = Item.ASCII_Encoded - 55 }

            if (Item.ASCII_Encrypted >= 48 && Item.ASCII_Encrypted <= 57) { Item.delta2 = Item.ASCII_Encrypted - 48 }
            if (Item.ASCII_Encrypted >= 65 && Item.ASCII_Encrypted <= 90) { Item.delta2 = Item.ASCII_Encrypted - 55 }

            Item.delta1 = (Item.delta2 + Item.delta3 - Item.SeqNum + 36) % 36;

            if (Item.delta1 >= 0 && Item.delta1 <= 9) { Item.ASCII_Session_ID = Item.delta1 + 48 }
            if (Item.delta1 >= 10 && Item.delta1 <= 35) { Item.ASCII_Session_ID = Item.delta1 + 55 }
        }

        OUT += String.fromCharCode(Item.ASCII_Session_ID)
    }

    return OUT
}

