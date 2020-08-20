import * as GL from '../../_base/js/GL.js';

export class CP_App {
    #Settings;
    #Session;
    Lang_Selector;

    constructor(Params) {
        this.Settings = JSON.parse(sessionStorage.getItem('CP_SETTINGS'));
        console.log(this.Settings)

        let Lang_Selector_Params = {
            "Language_Selector_ID": GL.IsNull(Params["Language_Selector_ID"], ""),
            "Language_Files": GL.IsNull(Params["Language_Files"])
        }
        this.Lang_Selector = new Language_Selector(this, Lang_Selector_Params);

    }

    Settings_GET = () => { return this.Settings }
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

    Lang_CURRENT_SET = (New_Lang) => this.Current_Lang = New_Lang;

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
            OUT = (this.Lang_IsSupported(OUT) ? OUT : '')
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
                console.log(jsonData)
                for (let i = 0; i < this.Language_Files.length; i++) {
                    this.Language_Files[i].Data = jsonData[i]
                }
                console.log("+++ A003", this.Language_Files)
            })
            .catch(err => { console.error(err) })

        this._Language_Selector_INIT()
    };
}
