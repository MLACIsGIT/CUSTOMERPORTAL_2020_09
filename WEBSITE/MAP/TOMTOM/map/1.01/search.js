async function fetchSettings() {
    const url = 'http://localhost:7071/api/map';
    const params = new URLSearchParams(window.location.search);

    let fetchData = {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
            "header": {
                "portalOwnerId": params.get('portalOwnerId'),
                "sessionId": params.get('sessionId'),
                "function": "MAP_INTERFACE_GET_RESULT"
            },
            "body": {
                "mapId": params.get('mapId')
            }
        })
    }

    const stream = await fetch(new Request(url, fetchData));
    const response = await stream.json();
    return response;
}

fetchSettings().then(response => {
    let settings = JSON.parse(response.body.result[0].result);

    let map = tt.map({
            key: settings.key,
            container: 'map',
            style: ['tomtom://', settings.mapSettings.mapType, '/1/', settings.mapSettings.mapStyle, '-', settings.mapSettings.mapNight].join(''),
            dragPan: !isMobileOrTablet(),
            center: [settings.lon, settings.lat],
            zoom: 14
        })

    map.addControl(new tt.NavigationControl());
    map.once('load', handleShowLocationRequest);

    function handleShowLocationRequest(){
        let iconmarker = document.createElement("div");

        iconmarker.className = "marker-location-icon";
        iconmarker.style.backgroundImage = ["url(", ["img/", settings.mapSettings.locationIcon.split("_")[1], "/", settings.mapSettings.locationIcon].join(''), ")"].join('');
        iconmarker.style.width = settings.mapSettings.locationIconSize.split(";")[0];
        iconmarker.style.height = settings.mapSettings.locationIconSize.split(";")[1];

        let popup = new tt.Popup({ offset: 25, closeOnMove: false, closeOnClick: false} ).setHTML([settings.popuptitle, "<br><b>", settings.popuphead, "</b><br>", settings.popupbody].join(''));
        let marker=new tt.Marker({ element: iconmarker, anchor: getIconAnchor(settings.mapSettings.locationIcon) }).setLngLat([settings.lon, settings.lat]).setPopup(popup).addTo(map);
    }

    function getIconAnchor(locationIcon){
        let params = locationIcon.split("_")
        let anchor = params[4].split(".")[0]

        if (anchor=="C"){
            return "center";
        }
        if (anchor=="T"){
            return "top";
        }
        if (anchor=="B"){
            return "bottom";
        }
        if (anchor=="L"){
            return "left";
        }
        if (anchor=="R"){
            return "right";
        }
        if (anchor=="TL"){
            return "top-left";
        }
        if (anchor=="TR"){
            return "top-right";
        }
        if (anchor=="BL"){
            return "bottom-left";
        }
        if (anchor=="BR"){
            return "bottom-right";
        }
    }
})
