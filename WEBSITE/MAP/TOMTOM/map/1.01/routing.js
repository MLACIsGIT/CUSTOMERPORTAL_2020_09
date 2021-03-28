async function fetchSettings() {
    const url = 'https://selester-trial-vi-001.azurewebsites.net/api/map';
    const params = new URLSearchParams(window.location.search);

    let fetchData = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
            language: settings.mapSettings.mapLanguage
        })

    map.addControl(new tt.NavigationControl());
    map.once('load', handleShowLocationRequest);

    function handleShowLocationRequest(){
        //Add route line
        let lngLatAll = [];
        for (let iLocs = 0; iLocs < settings.locs.length; iLocs++) {
            let lngLat = [];
            for (let iPoints = 0; iPoints < settings.locs[iLocs].points.length; iPoints++) {
                lngLat[iPoints] = [settings.locs[iLocs].points[iPoints].lon, settings.locs[iLocs].points[iPoints].lat]
                lngLatAll[iPoints] = [settings.locs[iLocs].points[iPoints].lon, settings.locs[iLocs].points[iPoints].lat]
            }

            routeLayout = getRouteColor(settings.locs[iLocs].weight);

            addLayer(iLocs, lngLat, routeLayout[0], routeLayout[1]);

            lngLat = [];
        }


        //Zoom
        var bounds = new tt.LngLatBounds();
        lngLatAll.forEach(function(point) {
            bounds.extend(tt.LngLat.convert(point));
        });
        map.fitBounds(bounds, { duration: 0, padding: 150 });

        //Add markers and set up popups
        let markerslist = [];
        for (let iMarkers=0; iMarkers < settings.markers.length; iMarkers++){
            if (iMarkers == 0) {
                type = "start"
            }else if (iMarkers == settings.markers.length - 1) {
                type = "end"
            }else {
                type = "point"
            }
    
            markerslist.push({
                            id: iMarkers,
                            type: type,
                            lon: settings.markers[iMarkers].loc.split(",")[1],
                            lat: settings.markers[iMarkers].loc.split(",")[0],
                            popuphead: [settings.markers[iMarkers].popuptitle, " / ", settings.markers[iMarkers].popuphead].join(''),
                            popupbody: settings.markers[iMarkers].popupbody,
                            add: 0
                        });
        }

        for (let iMarkerslist = 0; iMarkerslist < markerslist.length; iMarkerslist++){
            if (markerslist[iMarkerslist].type == "start" || markerslist[iMarkerslist].type == "end") {
                markerslist[iMarkerslist].add = 1;
            } else {
                markerfilter = markerslist.filter(
                    function(e){
                        return e.id < markerslist[iMarkerslist].id && e.lon == markerslist[iMarkerslist].lon && e.lat == markerslist[iMarkerslist].lat && e.add == 1
                        }
                    )

                if (markerfilter.length == 0) {
                    markerslist[i].add = 1;
                } else {
                    let id = markerslist.filter(
                        function(e){
                            return e.id == markerfilter[0].id
                        }
                    )[0].id;
                    
                    markerslist[id].popuphead = [markerslist[id].popuphead, "<br>", markerslist[i].popuphead].join('');
                }
            }
        } 

        for (iMarkerslist = 0; iMarkerslist < markerslist.length; iMarkerslist++) {
            if (markerslist[iMarkerslist].add == 1) {
                if (iMarkerslist == 0) {
                    type = 'start';
                    path = ['img/', settings.mapSettings.startPointPicture.split("_")[1], '/', settings.mapSettings.startPointPicture].join('');
                    anchor = getIconAnchor(settings.mapSettings.startPointPicture);
                    size = settings.mapSettings.startIconSize;
                } else if (iMarkerslist == markerslist.length-1) {
                    type = 'end';
                    path = ['img/', settings.mapSettings.endPointPicture.split("_")[1], '/', settings.mapSettings.endPointPicture].join('');
                    anchor = getIconAnchor(settings.mapSettings.endPointPicture);
                    size = settings.mapSettings.endIconSize;
                } else {
                    type = 'point';
                    path = ['img/', settings.mapSettings.middlePointPicture.split("_")[1], '/', settings.mapSettings.middlePointPicture].join('');
                    anchor = getIconAnchor(settings.mapSettings.middlePointPicture);
                    size = settings.mapSettings.middleIconSize;
                }

                addMarkers(
                    markerslist[iMarkerslist].lon,
                    markerslist[iMarkerslist].lat,
                    type,
                    size,
                    path,
                    anchor,
                    ["#", (iMarkerslist + 1), "<br><b>", markerslist[iMarkerslist].popuphead, "</b><br>", markerslist[iMarkerslist].popupbody].join('')
                );
            }
        }



    }



    function getRouteColor(routeWeight){
        let routeLayout = [];
        let routeColor = settings.mapSettings.routeColor0;
        var routeWidth = settings.mapSettings.routeWidth0;

        if (settings.mapSettings.vehicleWeight == 0) {
            routeColor = settings.mapSettings.routeColor0;
            routeWidth = settings.mapSettings.routeWidth0;
        } else {
            perc = routeWeight / settings.mapSettings.vehicleWeight * 100

            if (perc == 0) {
                routeColor = settings.mapSettings.routeColor0;
                routeWidth = settings.mapSettings.routeWidth0;
            }
            if (perc >= 0 && perc <20 ) {
                routeColor = settings.mapSettings.routeColor1;
                routeWidth = settings.mapSettings.routeWidth1;
            }
            if (perc >= 20 && perc <40 ) {
                routeColor = settings.mapSettings.routeColor2;
                routeWidth = settings.mapSettings.routeWidth2;
            }
            if (perc >= 40 && perc < 60) {
                routeColor = settings.mapSettings.routeColor3;
                routeWidth = settings.mapSettings.routeWidth3;
            }
            if (perc >= 60 && perc < 80) {
                routeColor = settings.mapSettings.routeColor4;
                routeWidth = settings.mapSettings.routeWidth4;
            }
            if (perc >= 80 && perc < 100) {
                routeColor = settings.mapSettings.routeColor5;
                routeWidth = settings.mapSettings.routeWidth5;
            }
        }

        routeLayout.push('#'+ routeColor.substr(3,6), routeWidth);
        return routeLayout
    }



    function addLayer(num, lngLat, color, lineWidth){
        map.addLayer({
                        'id': 'route' + num,
                        'type': 'line',
                        'source': {
                            'type': 'geojson',
                            'data': {
                                'type':'FeatureCollection',
                                'features':[
                                    {
                                        'type':'Feature',
                                        'geometry':{
                                            'type':'LineString',
                                            'properties':{},
                                            'coordinates': lngLat
                                        }
                                    }
                                ]
                            }
                        },
                        'paint': {
                            'line-color': color,
                            'line-width': lineWidth
                        }
                    });
    }



    function addMarkers(lon,lat,type,size,path,anchor,popup) {
        var point=[lon,lat];
        var iconmarker = document.createElement("div");
        iconmarker.className = "marker-"+type+"-icon";
        iconmarker.style.backgroundImage="url("+path+")";
        iconmarker.style.width=size.split(";")[0];
        iconmarker.style.height=size.split(";")[1];

        var popup = new tt.Popup({offset: 35, closeOnMove: false, closeOnClick: false}).setHTML(popup);
        var marker=new tt.Marker({element: iconmarker, anchor: anchor}).setLngLat(point).setPopup(popup).addTo(map);
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
