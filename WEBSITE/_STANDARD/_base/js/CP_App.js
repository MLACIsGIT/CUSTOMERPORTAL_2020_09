import * as GL from '../../_base/js/GL.js';

export class CP_App {
    #DebugMode;
    #Settings;
    #Session;
    #Credential_data = {
        login: null,
        Session: null
    };
    Lang_Selector;
    GATEWAY;

    Settings_GET = () => { return this.Settings }
    Text_GET = (type, textcode) => {
        let OUT = this.Lang_Selector.Text_GET(type, textcode);
        return OUT;
    }

    IsDEBUG = () => { return DebugMode; }

    constructor(Params) {
        //Settings
        this.Settings = JSON.parse(sessionStorage.getItem('CP_SETTINGS'));
        console.log('SETTINGS: ', this.Settings)

        //DebugMode
        this.DebugMode = (this.Settings["DEBUG"] && document.location.origin.indexOf("127.0.0.1") > 0) ? true : false;
        console.log("DebugMode: ", this.DebugMode);

        //Lang_Selector
        let Lang_Selector_Params = {
            "Language_Selector_ID": GL.IsNull(Params["Language_Selector_ID"], ""),
            "Language_Files": GL.IsNull(Params["Language_Files"])
        }
        this.Lang_Selector = new Language_Selector(this, Lang_Selector_Params);

        //GATEWAY
        this.GATEWAY = new GATEWAY(this)
    }
}

//-------------------------------------------------------------------------------------------------
// GATEWAY
//-------------------------------------------------------------------------------------------------
export class GATEWAY {
    #CP_App;
    #GATEWAY_Http;

    constructor(CP_App) {
        this.CP_App = CP_App;

        //GATEWAY_Http
        this.GATEWAY_Http = (this.CP_App.Settings_GET())["Database_Gateway"][(this.CP_App.IsDEBUG) ? 1 : 0];
        console.log("GATEWAY_Http: ", this.GATEWAY_Http)
    }

    _POST = (request_for_post, callback) => {
        let fetch_Params = {
            'method': 'POST',
            'mode': 'cors',
            'cache': 'no-cache',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(request_for_post)
        }

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

    _Request_for_post_GET = (Func, Func_Params) => {
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

    WAT_INTERFACE_SESSION_GET_NEW = (login, callback) => {
        /*
        Result: "header": {
                            version: ,
                            request_id: ,
                            result: <"OK" || dialogs.code>,
                },
                "body": {
                            Session_ID: <Session_ID encrypted>
                }
        */

        let Request = this._Request_for_post_GET('WAT_INTERFACE_SESSION_GET_NEW',
            {
                "login": login
            })
        this._POST(Request, callback)
    }

    SHA512_encrypt = (Plain_Text, callback) => {
        /*
        Result: "header": {
                            version: ,
                            request_id: ,
                            result: <"OK" || dialogs.code>,
                },
                "body": {
                            Encrypted_Text:
                }
        */

       let Request = this._Request_for_post_GET('SHA512_encrypt',
       {
           "Text": Plain_Text
       })

       this._POST(Request, callback)
    }

    AES_decrypt = (Encrypted_Text, Key, callback) => {
        /*
        Result: "header": {
                            version: ,
                            request_id: ,
                            result: <"OK" || dialogs.code>,
                },
                "body": {
                            Encrypted_Text:
                }
        */

       let Request = this._Request_for_post_GET('AES_decrypt',
       {
           "Encrypted_Text": Encrypted_Text,
           "Key": Key
       })

       this._POST(Request, callback)
    }
}

//-------------------------------------------------------------------------------------------------
// Language_Selector
//-------------------------------------------------------------------------------------------------
export class Language_Selector {
    #CP_App;
    #FPc_Language_Selector;
    #Doc_HTML;
    #Current_Lang;
    #Language_Files = [];

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
                        Doc_Item.innerHTML = Translation;
                    }
                }
            }
        }

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
            this.FPc_Language_Selector.innerHTML = '';
            let supported_languages = (this.CP_App.Settings_GET()).supported_languages;
            for (let i = 0; i < supported_languages.length; i++) {
                let c_Lang = supported_languages[i];
                let c = document.createElement("option");
                c.value = c_Lang;
                c.innerHTML = c_Lang;
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

        this.CP_App = CP_App;
        this.FPc_Language_Selector = document.getElementById(Params["Language_Selector_ID"]);
        this.Current_Lang = this.Lang_DEFAULT_GET();

        //Load language files
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
