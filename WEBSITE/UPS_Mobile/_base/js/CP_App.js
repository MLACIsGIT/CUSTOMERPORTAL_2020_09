import * as GL from '../../_base/js/GL.js';

export class CP_App {
    Host_Location_url() { return `${location.protocol}//${location.host}` };

    Settings_GET() { return this.Settings };

    Text_GET(type, textcode) {
        let OUT = this.Lang_Selector.Text_GET(type, textcode);
        return OUT;
    };

    IsDEBUG() { return this.DebugMode; }

    _REDIRECT_to_index_html_If_Settings_NULL() {
        if (this.Settings == null) {
            console.log("Settings not found. Redirect to index.html.")

            let page_index_url = `${this.Host_Location_url()}/index.html`
            window.location.href = page_index_url
        };
    };

    Login_If_Not() {
        if (this.Redirected == false) { return this._REDIRECT_to_index_html_If_Settings_NULL() }
    }

    _HTML_Insert_from_file = () => {
        let z;
        let i;
        let elmnt;
        let file;
        let xhttp;

        z = document.getElementsByTagName("*");
        for (i = 0; i < z.length; i++) {
            elmnt = z[i];
            file = elmnt.getAttribute("from-file");
            if (file) {
                file = GL.REPLACE_Params_In_FileNames(file);
                xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                        if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                        elmnt.removeAttribute("from-file");
                        includeHTML();
                    }
                }
                xhttp.open("GET", file, true);
                xhttp.send();
                return;
            }
        }
    }

    constructor(Params) {
        //#Credential_data
        this.Credential_data = {
            login: null,
            Session: null
        };

        //#Redirected;
        this.Redirected = false;

        //#Settings
        this.Settings = JSON.parse(sessionStorage.getItem('CP_SETTINGS'));
        if (this.Redirected == false) { this._REDIRECT_to_index_html_If_Settings_NULL() }
        if (this.Redirected == true) { return }

        //#Session
        let Session_STR = GL.IsNull(sessionStorage.getItem('Session'), "{}");
        this.Session = JSON.parse(Session_STR);

        //#DebugMode;
        this.DebugMode = (this.Settings["DEBUG"] && document.location.origin.indexOf("127.0.0.1") > 0) ? true : false;

        //Html_Insert_from_file
        this._HTML_Insert_from_file();

        //Lang_Selector
        let Lang_Selector_Params = {
            "Language_Selector_ID": GL.IsNull(Params["Language_Selector_ID"], ""),
            "Language_Files": GL.IsNull(Params["Language_Files"])
        }
        this.Lang_Selector = new Language_Selector(this, Lang_Selector_Params);

        //GATEWAY
        this.GATEWAY = new GATEWAY(this)

        //PROCESS_HANDLER
        this.PROCESS_HANDLER = new PROCESS_HANDLER(this);
    }
};

//-------------------------------------------------------------------------------------------------
// PROCESS_HANDLER
//-------------------------------------------------------------------------------------------------
class PROCESS_HANDLER {
    _SAVE_STACK() { sessionStorage.setItem('Stack', Stack) };
    _SAVE_CurrentPage_Params(CurrentPage_Params) { sessionStorage.setItem('CurrentPage_Params', CurrentPage_Params) };

    GOTO_Page(NextPage_id, Params) {
        let NextPage_url = `${this.CP_App.Host_Location_url()}/${this.CP_App.Settings_GET()["page_map"][NextPage_id]}`
        this._SAVE_CurrentPage_Params(Params);

        window.location.href = NextPage_url;
    };

    CALL_Page(ThisPage_id, ThisPage_Params, NextPage_id, NextPage_Params) {
        this.Stack.push({ "Page_id": ThisPage_id, "Params": ThisPage_Params })
        this._SAVE_STACK()
        this.GOTO_Page(NextPage_id, NextPage_Params)
    };

    RETURN_to_PreviousPage(Default_Page_id, Default_Page_Params) {
        if (this.Stack.length == 0) {
            this.GOTO_Page(Default_Page_id, Default_Page_Params)
            return;
        }
        let { PrevPage_id, PrevPage_Params } = Stack.Pull();
        this._SAVE_STACK();
        this.GOTO_Page(PrevPage_id, PrevPage_Params)
    };

    constructor(CP_App) {
        //#CP_App
        this.CP_App = CP_App;

        //#Stack
        this.Stack = GL.IsNull(JSON.parse(sessionStorage.getItem('Stack')), []);
    }
}

//-------------------------------------------------------------------------------------------------
// GATEWAY
//-------------------------------------------------------------------------------------------------
export class GATEWAY {
    constructor(CP_App) {
        //#CP_App;
        this.CP_App = CP_App;

        //#GATEWAY_Http
        this.GATEWAY_Http = (this.CP_App.Settings_GET())["Database_Gateway"][(this.CP_App.IsDEBUG()) ? 1 : 0];
        console.log("GATEWAY_Http: ", this.GATEWAY_Http)
    };

    _POST(request_for_post, callback) {
        let fetch_Params = {
            'method': 'POST',
            'mode': 'cors',
            'cache': 'no-cache',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(request_for_post)
        };

        fetch(this.GATEWAY_Http, fetch_Params)
            .then(data => {
                return data.json()
            })
            .then(jsonData => {
                callback(jsonData);
            })
            .catch(err => {
                console.error(err)
            })
    }

    _Request_for_post_GET(Func, Func_Params) {
        return {
            "header": {
                CP_version: GL.version(),
                Portal_owner_id: (this.CP_App.Settings_GET()).Portal_owner_id,
                request_id: "#",           //<egyedi azonosito adhato meg, amely alapjan kesobb lekerdezheto a kommunikacio. Ha "#", akkor automatikusan generalodik es visszajon a Result-ban>
                function: Func
            },

            "body": Func_Params
        }
    }

    WAT_INTERFACE_SESSION_GET_NEW(login, callback) {
        /*
        Result: "header": {
                            version: ,
                            request_id: ,
                            result: <"OK" || dialogs.code>,
                },
                "body": {
                         "Session_ID": DB_Results.output.OUT_WAT_Session_ID,
                         "ReturnValues": {
                            "ReturnValue": DB_Results.returnValue,
                            "ErrCode": DB_Results.output.OUT_ErrCode,
                            "ErrParams": DB_Results.output.OUT_ErrParams
                }
        */

        let Request = this._Request_for_post_GET('WAT_INTERFACE_SESSION_GET_NEW',
            {
                "Login": login
            })
        this._POST(Request, callback)
    }

    WAT_INTERFACE_SESSION_ENABLE(Login, Session_ID, Code_And_Pass_hash, callback) {
        let Request = this._Request_for_post_GET("WAT_INTERFACE_SESSION_ENABLE",
            {
                "Login": Login,
                "Session_ID": Session_ID,
                "Code_And_Pass_hash": Code_And_Pass_hash
            })
        this._POST(Request, callback)
    }

    WAT_INTERFACE_PHONENUMBER_ADD(Params, callback) {
        let Request = this._Request_for_post_GET("WAT_INTERFACE_PHONENUMBER_ADD",
            Params);

        this._POST(Request, callback);
    }
}

//-------------------------------------------------------------------------------------------------
// Language_Selector
//-------------------------------------------------------------------------------------------------
export class Language_Selector {
    _RECAPTCHA_Lang_SET () {
        //set Google recaptcha language
        let All_Recaptchas = document.querySelectorAll(".g-recaptcha");
        for (let g_recaptcha of All_Recaptchas) {
            if (g_recaptcha != null) {
                let g_recaptcha_iframe = g_recaptcha.querySelector("iframe")
                if (g_recaptcha_iframe == null) {
                    setTimeout(this._RECAPTCHA_Lang_SET, 300)
                } else {
                    g_recaptcha_iframe.setAttribute("src", g_recaptcha_iframe.getAttribute("src").replace(/hl=(.*?)&/, 'hl=' + this.Current_Lang + '&'));
                    g_recaptcha_iframe.style.visibility = "visible";
                }
            }
        }
    }

    Lang_CURRENT_SET = (New_Lang) => {
        New_Lang = GL.IsNull(New_Lang, "").trim();
        New_Lang = (New_Lang == '') ? this.Lang_DEFAULT_GET() : New_Lang;
        if (!this.Lang_IsSupported(New_Lang)) {
            console.error(`Language not supported. (Language: ${New_Lang})`)
            return;
        }
        this.Current_Lang = New_Lang;

        if (this.FPc_Language_Selector) {
            this.FPc_Language_Selector.value = this.Current_Lang;
        }

        for (let c of this.Language_Files) {
            let Items = c["Data"]["form-items"];
            if (Items != null) {
                for (let k of Object.keys(Items)) {
                    let Doc_Item = document.getElementById(k)
                    let Translation = Items[k][this.Current_Lang];
                    if (Doc_Item && Translation) {
                        if (GL.IsNull(Doc_Item.placeholder, "").trim() > "") {
                            Doc_Item.placeholder = Translation;
                        } else if (Doc_Item.tagName === "INPUT" && Doc_Item.value !== undefined) {
                            Doc_Item.value = Translation;
                        } else {
                            Doc_Item.innerText = Translation;
                        }
                    }
                }
            }
        }

        this._RECAPTCHA_Lang_SET()

        GL.COOKIES_SET("Lang", New_Lang);
    }

    Text_GET = (type, textcode) => {
        let OUT = '';

        for (let c of this.Language_Files) {
            let textelement = c["Data"][type][textcode];
            if (textelement != null) {
                OUT = GL.IsNull(GL.IsNull(textelement[this.Current_Lang], textelement['en']), '')
                return OUT;
            }
        }

        return '';
    }

    Lang_CURRENT_GET = () => this.Current_Lang;

    Lang_IsSupported = (Language_to_check) => this.CP_App.Settings_GET().supported_languages.filter(Lang => Lang == Language_to_check).length == 1;

    Lang_DEFAULT_GET() {
        let OUT = 'en';

        // from cookie
        OUT = GL.IsNull(GL.COOKIES_GET()["Lang"], '').trim()
        OUT = (this.Lang_IsSupported(OUT) ? OUT : '')

        // from browser language
        if (OUT == '') {
            OUT = GL.IsNull(navigator.language || navigator.userLanguage).trim();
            if (!this.Lang_IsSupported(OUT)) { OUT = OUT.substring(0, 2); }
            OUT = (this.Lang_IsSupported(OUT) ? OUT : '');
        }

        // Settings.default_language
        if (OUT == '') {
            OUT = (this.Lang_IsSupported(OUT) ? OUT : (this.CP_App.Settings_GET()).default_language)
            OUT = (this.Lang_IsSupported(OUT) ? OUT : '')
        }

        // GB
        if (OUT == '') {
            OUT = 'en';
        }

        return OUT;
    }

    _Language_Files_ADD = (Language_File_Names) => {
        for (let Current_FileName of Language_File_Names) {
            Current_FileName = GL.REPLACE_Params_In_FileNames(Current_FileName)
            let Current_Struct = {
                "FileName": Current_FileName,
                "Data": ""
            }

            this.Language_Files.push(Current_Struct)
        }
    }

    _FPc_Language_Selector_onchange = () => {
        this.Lang_CURRENT_SET(this.FPc_Language_Selector.value)
    }

    _Language_Selector_INIT = () => {
        if (this.FPc_Language_Selector) {
            this.FPc_Language_Selector.innerText = '';
            let supported_languages = (this.CP_App.Settings_GET()).supported_languages;
            for (let i = 0; i < supported_languages.length; i++) {
                let c_Lang = supported_languages[i];
                let c = document.createElement("option");
                c.value = c_Lang;
                c.innerText = c_Lang;
                this.FPc_Language_Selector.appendChild(c);
            }
            this.FPc_Language_Selector.value = this.Current_Lang;

            this.FPc_Language_Selector.onchange = this._FPc_Language_Selector_onchange
        }
    }


    constructor(CP_App, Params) {
        /*
        Params felepitese:
     
        {
            "Language_Selector_ID": <a form-on levo language_selector (tipusa: SELECT)>
            "Language_Files": [
                                <a nyelvi elemeket tartalmazo file 1>,
                                <a nyelvi elemeket tartalmazo file 2>,
                                ...
                              ]
        }
        */


        //#CP_App;
        this.CP_App = CP_App;

        //#FPc_Language_Selector;
        this.FPc_Language_Selector = document.getElementById(Params["Language_Selector_ID"]);

        //#Current_Lang;
        this.Current_Lang = this.Lang_DEFAULT_GET();

        //Load language files
        //#Language_Files = [];
        this.Language_Files = [];
        this._Language_Files_ADD(Params["Language_Files"]);
        this._Language_Files_ADD((this.CP_App.Settings_GET()).base_language_files)

        let Promise_All_FileLoads = [];
        for (let Current_File of this.Language_Files) {
            Promise_All_FileLoads.push((fetch(Current_File.FileName)))
        }

        Promise.all(Promise_All_FileLoads)
            .then(files => { return Promise.all(files.map(file => file.json())); })
            .then(jsonData => {
                for (let i = 0; i < this.Language_Files.length; i++) {
                    this.Language_Files[i].Data = jsonData[i]
                }
                this.Lang_CURRENT_SET(this.Current_Lang);
            })
            .catch(err => { console.error(err) })

        this._Language_Selector_INIT()
    };
}
