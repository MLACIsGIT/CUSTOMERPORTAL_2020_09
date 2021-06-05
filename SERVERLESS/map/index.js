const npm_mssql = require('mssql');
const https = require('https');

const version = 'v001.01.01';

const dbConfig = {
    server: process.env.DB_server,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
    port: parseInt(process.env.DB_port),
    options: {
        encrypt: true
    },
    parseJSON: true
};

let requestId = "#";
let portalOwnerId = 0;

function watConnect() {
    return new Promise((resolve, reject) => {
        let Pool = new npm_mssql.ConnectionPool(dbConfig);
        Pool.connect(function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(Pool);
            }
        })
    })
}

function watSpExecute(dbRequest, procedureName) {
    return new Promise((resolve, reject) => {
        dbRequest.execute(procedureName, function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

resultErr = (errcode, err) => {
    return {
        status: 400,
        body: {
            'header': {
                'version': version,
                'request_id': requestId,
                'result': errcode
            },
            'body': {
                'err': JSON.stringify(err)
            }
        }
    }
}

resultOk = (result) => {
    return {
        status: 200,
        body: {
            'header': {
                'version': version,
                'request_id': requestId,
                'result': 'OK'
            },
            'body': result
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }
}

function httpGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = []

            res.on("data", chunk => {
                data.push(chunk)
            });
                
            res.on("end", () => {
                resolve(Buffer.concat(data).toString())
            })
              
        }).on('error', err => {
            reject(err)
        })
    })
}

module.exports = async function (context, req) {
    let dbConn;
    let dbRequest;
    let dbResults;
    let onErrorErrCode = '';
    let connected = false;

    let watRequest = "";
    let watFunction = '';

    try {
        contentType = req.headers['content-type'];

    } catch(err) {
        contentType = '';
    }

    if (contentType !== 'application/json' || req.method !== 'POST') {
        context.res = {
            status: 200,
            body: `SELEXPED MAP SERVER VERSION ${version} is ready to go.`
        };
        return;
    }

    try {
        watRequest = req.body;
        watFunction = (watRequest.header.function) ? watRequest.header.function : '';
    } catch (error) {
        // nothing to do    
    }

    portalOwnerId = watRequest.header.portalOwnerId
    if (typeof portalOwnerId == 'undefined'){
        context.res = resultErr('GATEWAY_ERROR_unknown_owner_id', 0)
        return;
         }
    
    let providerData;
    
    try {
        //Step 1: connection
        onErrorErrCode = 'GATEWAY_ERROR_DB-Connect' // Procedure returns this errorcode if the next statement fails. 
        dbConn = await watConnect();
        connected = true;

        //Step 2: Execute WAT Function
        onErrorErrCode = 'GATEWAY_ERROR_SQL-Statement failure'

        let mapParams;
        let mapSettings;
        let provider;
        let url;
        let resultJSON;
        switch (watFunction) {
            //-------------------------------------------------------------------------------------------------------------------------------
            // MAP_INTERFACE_GET_RESULT
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'MAP_INTERFACE_GET_RESULT':
                let mapId = watRequest.body.mapId;
                if (typeof mapId == 'undefined'){
                    context.res = resultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                    }

                    dbRequest = new npm_mssql.Request(dbConn)
                    dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, portalOwnerId)
                    dbRequest.input('WAT_Session_ID', npm_mssql.NVarChar(255), watRequest.header.sessionId);
                    dbRequest.input('Map_ID', npm_mssql.Int, mapId)
                    dbRequest.output('OUT_Result', npm_mssql.NVarChar('max'))
                    dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                    dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                    dbResults = await watSpExecute(dbRequest, 'MAP_INTERFACE_GET_RESULT')
        
                    if (dbResults.output.OUT_ErrCode != "") {
                        context.res = resultErr(dbResults.output.OUT_ErrCode, {
                            "ReturnValues": {
                                "ReturnValue": dbResults.returnValue,
                                "ErrCode": dbResults.output.OUT_ErrCode,
                                "ErrParams": dbResults.output.OUT_ErrParams
                            }
                        })
                    } else {
                        context.res = Result_OK({
                            "result": JSON.parse(dbResults.output.OUT_Result)
                        })
                    }
    
                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // MAP_INTERFACE_SEARCH
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'MAP_INTERFACE_SEARCH':
                mapParams = watRequest.body.mapParams;
                if (typeof mapParams == 'undefined'){
                    context.res = resultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                    }
            
                mapSettings = watRequest.body.mapSettings;
                if (typeof mapSettings == 'undefined'){
                    context.res = resultErr('GATEWAY_ERROR_missing_settings', 0)
                    return;
                    }

                provider = watRequest.body.provider;
                if (typeof provider == 'undefined'){
                    context.res = resultErr('GATEWAY_ERROR_missing_or_invalid_provider', 0)
                    return;
                    }        

                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, portalOwnerId)
                dbRequest.input('WAT_Session_ID', npm_mssql.NVarChar(255), watRequest.header.sessionId);
                dbRequest.input('Provider', npm_mssql.NVarChar(50), provider)
                dbRequest.output('OUT_Providers_Data', npm_mssql.NVarChar('max'))
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await watSpExecute(dbRequest, 'MAP_INTERFACE_GET_PROVIDERS_DATA')
    
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = resultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    providerData = JSON.parse(dbResults.output.OUT_Providers_Data);
                }
    
                let query = encodeURI([mapParams.country, mapParams.zip, mapParams.city, mapParams.addr].filter(Boolean).join(' '));

                if (query == ''){
                    context.res = resultErr('GATEWAY_ERROR_missing_or_invalid_mapparams', 0)
                    return;
                }

                url = providerData[0].searchBaseUrl.concat('/', query, '.json?', '&key=', providerData[0].mapApiKey);

                let response;
                try {
                    let out = await httpGet(url);
                    response = JSON.parse(out);

                } catch (err){
                    context.res = resultErr('GATEWAY_ERROR_api_call_failed', 0)
                    return;
                }

                let exit;
                for (let iRes = 0; iRes < response.results.length; iRes++) {
                    if (response.results[iRes].type == "Point Address") {
                        exit = true;
                    }
                    if (response.results[iRes].type == "Cross Street" && exit == false) {
                        exit = true;
                    }
                    if (response.results[iRes].type == "Street" && exit == false) {
                        exit = true;
                    }
                    if (response.results[iRes].type == "Geography" && exit == false) {
                        exit = true;
                    }
                    if (response.results[iRes].type == "POI" && exit == false) {
                        exit = true;
                    }
                    if (response.results[iRes].type == "Address Range" && exit == false) {
                        exit = true;
                    }

                    if (exit == true) {
                        resultJSON = {
                            "requestId": 0,
                            "key": providerData[0].mapApiKey,
                            "type": response.results[iRes].type,
                            "popuptitle": response.results[iRes].type,
                            "popuphead": mapParams.popuphead,
                            "popupbody": mapParams.popupbody,
                            "freeformAddress": response.results[iRes].address.freeformAddress,
                            "lat": response.results[iRes].position.lat,
                            "lon": response.results[iRes].position.lon,
                            "mapSettings": mapSettings,
                            "url": ""
                        }

                        break;
                    }
                }

                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Request', npm_mssql.NVarChar('max'), JSON.stringify(watRequest))
                dbRequest.input('API_Request', npm_mssql.NVarChar('max'), url)
                dbRequest.input('Result', npm_mssql.NVarChar('max'), JSON.stringify(resultJSON))
                dbRequest.output('OUT_ID', npm_mssql.Int)
                dbRequest.output('OUT_URL', npm_mssql.NVarChar('max'))
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await watSpExecute(dbRequest, 'MAP_INTERFACE_ADD_REQUEST_TO_LOG')
    
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = resultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    resultJSON.requestId = dbResults.output.OUT_ID;
                    resultJSON.url = dbResults.output.OUT_URL;

                    context.res = Result_OK({
                        "result": resultJSON
                    })
                }

                break;

            //-------------------------------------------------------------------------------------------------------------------------------
            // MAP_INTERFACE_ROUTING
            //-------------------------------------------------------------------------------------------------------------------------------
            case 'MAP_INTERFACE_ROUTING':
                mapParams = watRequest.body.mapParams;
                if (typeof mapParams == 'undefined'){
                    context.res = resultErr('GATEWAY_ERROR_missing_parameters', 0)
                    return;
                    }
            
                mapSettings = watRequest.body.mapSettings;
                if (typeof mapSettings == 'undefined'){
                    context.res = resultErr('GATEWAY_ERROR_missing_settings', 0)
                    return;
                    }

                provider = watRequest.body.provider;
                if (typeof provider == 'undefined'){
                    context.res = resultErr('GATEWAY_ERROR_missing_or_invalid_provider', 0)
                    return;
                    }

                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Portal_Owners_ID', npm_mssql.Int, portalOwnerId)
                dbRequest.input('WAT_Session_ID', npm_mssql.NVarChar(255), watRequest.header.sessionId);
                dbRequest.input('Provider', npm_mssql.NVarChar(50), provider)
                dbRequest.output('OUT_Providers_Data', npm_mssql.NVarChar('max'))
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await watSpExecute(dbRequest, 'MAP_INTERFACE_GET_PROVIDERS_DATA')
    
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = resultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    providerData = JSON.parse(dbResults.output.OUT_Providers_Data);
                }

                let totalWeight = 0;
                let markers = [];
                let from = '';
                let to = '';
                let summary = [];
                let section = [];

                for (let iSet = 0; iSet < mapParams.length; iSet++) {
                    let routeId = mapParams[iSet].id;
                    if (typeof routeId == 'undefined'){
                        context.res = resultErr('GATEWAY_ERROR_missing_or_invalid_parameter', 0)
                        return;
                        }
    
                    let routeLoc = mapParams[iSet].loc;
                    if (typeof routeLoc == 'undefined'){
                        context.res = resultErr('GATEWAY_ERROR_missing_or_invalid_parameter', 0)
                        return;
                        }

                    markers.push({
                        "loc": mapParams[iSet].loc,
                        "popuptitle": mapParams[iSet].popuptitle,
                        "popuphead": mapParams[iSet].popuphead,
                        "popupbody": mapParams[iSet].popupbody
                    })

                    if (iSet == 0) {
                        from = mapParams[iSet].loc;
                        to = '';
                    }else{
                        from = mapParams[iSet - 1].loc;
                        to = mapParams[iSet].loc;
                    }

                    if (from != '' && to != '') {
                        totalWeight += mapParams[iSet - 1].weight;

                        if (from != to) {
                            let routeOptions = '';

                            if (typeof mapSettings.routeType != 'undefined') {
                                routeOptions = routeOptions.concat('&routeType=', mapSettings.routeType)
                            }
                            if (typeof mapSettings.travelMode != 'undefined') {
                                routeOptions = routeOptions.concat('&travelMode=', mapSettings.travelMode)
                            }
                            if (mapSettings.vehicleWeight > 0) {
                                routeOptions = routeOptions.concat('&vehicleWeight=', mapSettings.vehicleWeight)
                            }
                            if (mapSettings.vehicleCommercial == 1) {
                                routeOptions = routeOptions.concat('&vehicleCommercial=true')
                            }
                            if (mapSettings.tollRoads == 1) {
                                routeOptions = routeOptions.concat('&avoid=tollRoads')
                            }
                            if (mapSettings.motorways == 1) {
                                routeOptions = routeOptions.concat('&avoid=motorways')
                            }
                            if (mapSettings.ferries == 1) {
                                routeOptions = routeOptions.concat('&avoid=ferries')
                            }
                            if (mapSettings.unpavedRoads == 1) {
                                routeOptions = routeOptions.concat('&avoid=unpavedRoads')
                            }
                            if (mapSettings.carPools == 1) {
                                routeOptions = routeOptions.concat('&avoid=carpools')
                            }
                            if (mapSettings.borderCrossing == 1) {
                                routeOptions = routeOptions.concat('&avoid=borderCrossings')
                            }
                            if (mapSettings.vehicleMaxSpeed > 0) {
                                routeOptions = routeOptions.concat('&vehicleMaxSpeed=', mapSettings.vehicleMaxSpeed)
                            }
                            if (mapSettings.vehicleAxleWeight > 0) {
                                routeOptions = routeOptions.concat('&vehicleAxleWeight=', mapSettings.vehicleAxleWeight)
                            }
                            if (mapSettings.vehicleLength > 0) {
                                routeOptions = routeOptions.concat('&vehicleLength=', mapSettings.vehicleLength)
                            }
                            if (mapSettings.vehicleWidth > 0) {
                                routeOptions = routeOptions.concat('&vehicleWidth=', mapSettings.vehicleWidth)
                            }
                            if (mapSettings.vehicleHeight > 0) {
                                routeOptions = routeOptions.concat('&vehicleHeight=', mapSettings.vehicleHeight)
                            }
                            if (mapSettings.vehicleLoadType != '') {
                                routeOptions = routeOptions.concat('&vehicleLoadType=', mapSettings.vehicleLoadType)
                            }
                            if (mapSettings.vehicleAdrTunnel != ''){
                                routeOptions = routeOptions.concat('&vehicleAdrTunnelRestrictionCode=', mapSettings.VehicleAdrTunnel)
                            }

                            url = [providerData[0].routingBaseUrl, '/', from, ':', to, '/json?', 'instructionsType=text', '&language=', providerData[0].routingLanguage, '&key=', providerData[0].mapApiKey, routeOptions].join('');

                            let response;
                            try {
                                let out = await httpGet(url);
                                response = JSON.parse(out);
            
                            } catch (err){
                                context.res = resultErr('GATEWAY_ERROR_api_call_failed', 0)
                                return;
                            }
           
                            summary.push({
                                "id": mapParams[iSet - 1].id,
                                "lengthInMeters": response.routes[0].legs[0].summary.lengthInMeters,
                                "travelTimeInSeconds": response.routes[0].legs[0].summary.travelTimeInSeconds
                            })

                            let points = [];
                            for (let iPoints = 0; iPoints < response.routes[0].legs[0].points.length; iPoints++) {
                                points.push({
                                    "lon": response.routes[0].legs[0].points[iPoints].longitude,
                                    "lat": response.routes[0].legs[0].points[iPoints].latitude
                                })
                            }

                            section.push({
                                "section": iSet,
                                "weight": totalWeight,
                                "points": points
                            })
                        } else {
                            summary.push({
                                "id": mapParams[iSet - 1].id,
                                "lengthInMeters": 0,
                                "travelTimeInSeconds": 0
                            })
                        }
                    }
                }

                resultJSON = {
                    "requestId": 0,
                    "key": providerData[0].mapApiKey,
                    "summary": summary,
                    "locs": section,
                    "markers": markers,
                    "mapSettings": mapSettings,
                    "url": ""
                }

                dbRequest = new npm_mssql.Request(dbConn)
                dbRequest.input('WAT_Request', npm_mssql.NVarChar('max'), JSON.stringify(watRequest))
                dbRequest.input('API_Request', npm_mssql.NVarChar('max'), url)
                dbRequest.input('Result', npm_mssql.NVarChar('max'), JSON.stringify(resultJSON))
                dbRequest.output('OUT_ID', npm_mssql.Int)
                dbRequest.output('OUT_URL', npm_mssql.NVarChar('max'))
                dbRequest.output('OUT_ErrCode', npm_mssql.NVarChar(255))
                dbRequest.output('OUT_ErrParams', npm_mssql.NVarChar('max'))
                dbResults = await watSpExecute(dbRequest, 'MAP_INTERFACE_ADD_REQUEST_TO_LOG')
    
                if (dbResults.output.OUT_ErrCode != "") {
                    context.res = resultErr(dbResults.output.OUT_ErrCode, {
                        "ReturnValues": {
                            "ReturnValue": dbResults.returnValue,
                            "ErrCode": dbResults.output.OUT_ErrCode,
                            "ErrParams": dbResults.output.OUT_ErrParams
                        }
                    })
                } else {
                    resultJSON.requestId = dbResults.output.OUT_ID;
                    resultJSON.url = dbResults.output.OUT_URL;

                    context.res = Result_OK({
                        "result": resultJSON
                    })
                }

                break;

            default:
                context.res = resultErr('GATEWAY_ERROR_unknown_function_call', { unknown_function: watFunction })
                break;
        }

    } catch (err) {
        context.res = resultErr(onErrorErrCode, err)
    }

    // Disconnect
    if (connected) { dbConn.close() }

}