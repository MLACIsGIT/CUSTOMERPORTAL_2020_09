export function version() { return 'v001.01.01'; }

export function Settings_GET() {
    let OUT = '';
    let Settings_url = `${location.protocol}//${location.host}/_EASYSETUP/settings.json`;

    fetch(Settings_url)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            OUT = json;
        });

    return OUT;
}

export function IsNull(MyText, ValueWhenNull = "") {
    if (MyText === null || MyText === undefined) {
        return ValueWhenNull;
    }

    return MyText;
}

export function REPLACE_ALL(str, toFind, ReplaceWith) {
    return str.split(toFind).join(ReplaceWith);
}

export function REPLACE_Params_In_FileNames(FileName) {
    let OUT = FileName;

    OUT = REPLACE_ALL(OUT, "${origin}", document.location.origin);

    return OUT;
}

export function COOKIES_GET() {
    let OUT = IsNull(document.cookie, '');

    if (OUT == '') {
        return JSON.parse('{}');
    }

    OUT = document.cookie.split(";").map(c => c.split('='));
    OUT = JSON.stringify(OUT);
    OUT = REPLACE_ALL(OUT, '[" ', '["')
    OUT = REPLACE_ALL(OUT, '\",\"', '\": \"')
    OUT = REPLACE_ALL(OUT, '],[', ", ")
    OUT = REPLACE_ALL(OUT, '[[', '{');
    OUT = REPLACE_ALL(OUT, ']]', '}');
    OUT = JSON.parse(OUT);

    return OUT;
}

export function COOKIES_SET(key, value) {
    key = IsNull(key, '').trim();
    value = IsNull(value, '').trim();

    if (key == '') {
        return
    }

    document.cookie = `${key}=${value}; expires=${new Date(2050, 0, 1).toUTCString()};path=/`;
}

export function COOKIES_REMOVE(key) {
    key = IsNull(key, '').trim;

    if (key > '') {
        document.cookie = `${key}=${value}; expires=` + new Date(2001, 0, 1).toUTCString();
    }
}

export function CRYPTO_SHA512( Str ) {
    return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(Str)).then(buf => {
        return (Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('')).toUpperCase();
      });
    }
