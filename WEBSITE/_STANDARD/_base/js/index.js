let Host_Location_url = `${location.protocol}//${location.host}`;
let Settings_url = `${Host_Location_url}/_EASYSETUP/settings.json`;

//Settings_GET
let p_CP_SETTINGS_GET = fetch(Settings_url);

p_CP_SETTINGS_GET
.then( function(response) {
    return response.json();
})
.then( function(CP_SETTINGS) {
    console.log(CP_SETTINGS);
    sessionStorage.setItem('CP_SETTINGS', JSON.stringify(CP_SETTINGS) )
    
    let page_login_url = `${Host_Location_url}/${CP_SETTINGS["page_map"]["login"]}`

    //Ugras a login ablakra
    window.location.href = page_login_url;
})
.catch( function (message) {
    document.body.innerText=`${Settings_url} not found. Error message: ${message}`;
    console.error(`${Settings_url} not found. Error message: ${message}`)
});

