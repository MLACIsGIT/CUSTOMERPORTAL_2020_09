import * as GL from './_base/js/GL.js';
import * as CP_GL from './_base/js/CP_App.js';
import * as SEL_PAGER from './_base/js/SEL_PAGER.js';

//-------------------------------------------------------------------------------
// GLOBAL VARIABLES
//-------------------------------------------------------------------------------

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const page_login_id = "#page-login";
const page_routes_id = "#page-routes";
const container = document.querySelector(".container");
const btn_login = document.querySelector("#btn-login");
const PhoneNumberFormat = /0036(20|30|70)[0-9]{7}/
const Host_Location_url = `${location.protocol}//${location.host}`;
const Settings_url = `${Host_Location_url}/_EASYSETUP/settings.json`;

let CP_App;
let PAGES;

//Settings_GET
let p_CP_SETTINGS_GET = fetch(Settings_url);

p_CP_SETTINGS_GET
  .then(function (response) {
    return response.json();
  })
  .then(function (CP_SETTINGS) {
    console.log(CP_SETTINGS);
    sessionStorage.setItem('CP_SETTINGS', JSON.stringify(CP_SETTINGS))

    CP_App = new CP_GL.CP_App(
      {
        "Language_Selector_ID": undefined,
        "Language_Files": ["${origin}/_EASYSETUP/Pages/LOGIN/Lang_PageLogin.json"]
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
  .catch(function (message) {
    document.body.innerText = `${Settings_url} not found. Error message: ${message}`;
    console.error(`${Settings_url} not found. Error message: ${message}`)
  });

//-------------------------------------------------------------------------------
// PAGE LOGIN
//-------------------------------------------------------------------------------
let Temp_Credentials = {
  Current_Email: "",
  Current_PhoneNumber: "",
  Code_And_Pass_hash: "",
  Session_ID: "",
  Session_ID_Encrypted: ""
}

let LOGIN_PhoneNumber = document.querySelector("#LOGIN_PhoneNumber");
let LOGIN_password = document.querySelector("#LOGIN_password");

function LOGIN_Sign_in_ALERT_display_shortly(MyText) {
  PAGE_LOGIN_Sign_in_ALERT.innerText = MyText;
  PAGE_LOGIN_Sign_in_ALERT.style.display = 'block';
  setTimeout("PAGE_LOGIN_Sign_in_ALERT.style.display = 'none'", 10000);
}

let DoLogin = (ev) => {
  ev.preventDefault();

  let rec = grecaptcha.getResponse();
  if (rec.length == 0) {
    LOGIN_Sign_in_ALERT_display_shortly(CP_App.Text_GET('dialogs', 'ReCaptcha_empty'))
    return;
  } else {
    Temp_Credentials.Current_PhoneNumber = GL.IsNull(LOGIN_PhoneNumber.value).trim();
    if (Temp_Credentials.Current_PhoneNumber == '' || GL.IsNull(LOGIN_password.value).trim() == '') {
      LOGIN_Sign_in_ALERT_display_shortly(CP_App.Text_GET('dialogs', 'Credential_data_missing_phone_number_or_password'))
      return;
    }
    if (!(Temp_Credentials.Current_PhoneNumber).match(PhoneNumberFormat)) {
      LOGIN_Sign_in_ALERT_display_shortly(CP_App.Text_GET('dialogs', 'Credential_data_phone_number_incorrect_format'))
      return;
    }
    CP_App.GATEWAY.WAT_INTERFACE_SESSION_GET_NEW(Temp_Credentials.Current_PhoneNumber, DoLogin_Step_02);
  }
}

function DoLogin_Step_02(DoLogin_Step_01_Result) {
  let Step_Result = GL.IsNull(DoLogin_Step_01_Result.header.result, '')
  if (Step_Result != 'OK') {
    LOGIN_Sign_in_ALERT_display_shortly(CP_App.Text_GET('dialogs', Step_Result));
      return;
  }

  Temp_Credentials.Session_ID_Encrypted = DoLogin_Step_01_Result.body.Session_ID.Session_ID_Encrypted;
  let WAT_CRYPTO_Code = DoLogin_Step_01_Result.body.Session_ID.Code;
  GL.CRYPTO_SHA512(WAT_CRYPTO_Code + GL.IsNull(FPc_Password.value).trim()).then(
      Code_And_Pass_hash => {
          Temp_Credentials.Code_And_Pass_hash = Code_And_Pass_hash
          Temp_Credentials.Session_ID = WAT_CRYPTO_Session_ID_DECRYPT(Code_And_Pass_hash, Temp_Credentials.Session_ID_Encrypted)

          CP_App.GATEWAY.WAT_INTERFACE_SESSION_ENABLE(Temp_Credentials.Current_PhoneNumber, Temp_Credentials.Session_ID, Code_And_Pass_hash, DoLogin_Step_03)
      })
}

function DoLogin_Step_03(DoLogin_Step_02_Result) {
  let Step_Result = GL.IsNull(DoLogin_Step_02_Result.header.result, '')
  if (Step_Result != 'OK') {
    LOGIN_Sign_in_ALERT_display_shortly(CP_App.Text_GET('dialogs', Step_Result));
      return;
  }

  let Session_Params = {
      Login: Temp_Credentials.Current_PhoneNumber,
      Session_ID: Temp_Credentials.Session_ID,
      Session_Params: DoLogin_Step_02_Result.body.Session_Params
  }

  sessionStorage.setItem("Session", JSON.stringify(Session_Params))

  console.log('--------------------------------------------------------------')
  console.log(`-- W E L C O M E   ${Temp_Credentials.Current_PhoneNumber} ! ! !`)
  console.log('--------------------------------------------------------------')

  //CP_App.PROCESS_HANDLER.RETURN_to_PreviousPage("portal", {})
  PAGES.PAGE_SELECT(page_routes_id);
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

btn_login.addEventListener("click", DoLogin);
