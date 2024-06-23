let dataShuttleBus02 = [];
let dataShuttleBus03 = [];
let dataShuttleBus04 = [];
let dataShuttleBus09 = [];
let dataShuttleBus10 = [];
let map;

const fetchShuttlebusData = async (routeId) => {
    try {

            const bodyRequest = {
                route_id: routeId ? routeId : "",
            };

        const response = await axios.post('http://localhost:5555/api/v1/get-path2', bodyRequest);

        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.data.data;
    } catch (error) {
        console.error(`Error fetching the shuttle bus data for ${routeId}:`, error);
    }
};

const fetchAllShuttlebusData = async () => {
    dataShuttleBus02 = await fetchShuttlebusData('bus02');
    dataShuttleBus03 = await fetchShuttlebusData('bus03');
    dataShuttleBus04 = await fetchShuttlebusData('bus04');
    dataShuttleBus09 = await fetchShuttlebusData('bus09');
    dataShuttleBus10 = await fetchShuttlebusData('bus10');
};

const updatePolylineStyle = (polyline, isSelected) => {
    polyline.whiteBorder.setVisible(isSelected);
    polyline.setOptions({
        zIndex: isSelected ? 1 : 0
    });
};

const initialize = async () => {
    await fetchAllShuttlebusData();

    let mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 9,
        panControl: false,
        scaleControl: false,
        mapTypeControl: false,
        streetViewControl: true,
        overviewMapControl: false,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.RIGHT_TOP
        }
    };
    map = new google.maps.Map(document.getElementById("map-bus"), mapOptions);
    let infowindow = new google.maps.InfoWindow();
    
    let uuIndices = [];

    const renderMarkersAndPath = (data, iconSet) => {
        let arr = [];
        
        $.each(data, function(i, item) {
            let iconUrl;
            let index = i + 1;
            if (index === 1) {
                iconUrl = iconSet.startIcon;
            } else if (uuIndices.includes(index)) {
                iconUrl = iconSet.makkerIcon;
            } else if (index === data.length) {
                iconUrl = iconSet.endIcon;
            } else {
                iconUrl = iconSet.middleIcon;
            }

            let marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.busStop_latitude, item.busStop_longitude),
                map: map,
                title: item.busStop_name,
                icon: {
                    url: iconUrl,
                    scaledSize: new google.maps.Size(
                        iconUrl.includes('makkerIcon.png') ? 50 : (iconUrl.includes('startIcon.png') ? 50 : (iconUrl.includes('busIcon60.png') ? 60 : 0)),
                        iconUrl.includes('makkerIcon.png') ? 50 : (iconUrl.includes('startIcon.png') ? 50 : (iconUrl.includes('busIcon60.png') ? 60 : 0))
                    )
                }
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    let contentString = '<div><p>' + item.busStop_name + '</p><img src="' + item.busStop_picture + '" width="300px"></div>';
                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);
                }
            })(marker, i));

            arr.push(marker.getPosition());
        });

        let whiteBorder = new google.maps.Polyline({
            path: arr,
            strokeColor: 'white',
            strokeOpacity: 1.0,
            strokeWeight: 12,
            map: map,
            zIndex: 0,
            visible: false
        });

        let poly = new google.maps.Polyline({
            path: arr,
            strokeColor: iconSet.polylineColor,
            strokeOpacity: 1.0,
            strokeWeight: 8,
            map: map,
            zIndex: 0  // Default zIndex
        });

        poly.originalColor = iconSet.polylineColor;
        poly.whiteBorder = whiteBorder;  // Link the white border to the polyline

        google.maps.event.addListener(poly, 'click', function() {
            // Reset all polylines zIndex and white border visibility
            allPolylines.forEach(p => updatePolylineStyle(p, false));
            // Update clicked polyline zIndex and style
            updatePolylineStyle(poly, true);
        });

        let lineSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 3,
            fillColor: iconSet.symbolColor,
            fillOpacity: 1,
            strokeColor: iconSet.symbolColor,
            strokeWeight: 2
        };

        let lineSymbolSequence = {
            icon: lineSymbol,
            offset: '0%',
            repeat: '0.7%'
        };

        poly.setOptions({
            icons: [lineSymbolSequence]
        });

        allPolylines.push(poly);  // Add to allPolylines array

        return poly;
    };

    let allPolylines = [];  // Store all polylines for resetting zIndex

    let poly02 = renderMarkersAndPath(dataShuttleBus02, {
        startIcon: 'image/2.png',
        makkerIcon: 'image/makkerIcon.png',
        endIcon: 'image/2.png',
        middleIcon: 'image/p.png',
        polylineColor: '#ffff00',
        symbolColor: '#32cd32'
    });

    let poly03 = renderMarkersAndPath(dataShuttleBus03, {
        startIcon: 'image/3.png',
        makkerIcon: 'image/makkerIcon.png',
        endIcon: 'image/3.png',
        middleIcon: 'image/p.png',
        polylineColor: '#ffff00',
        symbolColor: '#303F9F'
        
    });

    let poly04 = renderMarkersAndPath(dataShuttleBus04, {
        startIcon: 'image/4.png',
        makkerIcon: 'image/makkerIcon.png',
        endIcon: 'image/4.png',
        middleIcon: 'image/p.png',
        polylineColor: '#32cd32',
        
    });

    let poly09 = renderMarkersAndPath(dataShuttleBus09, {
        startIcon: 'image/9.png',
        makkerIcon: 'image/makkerIcon.png',
        endIcon: 'image/9.png',
        middleIcon: 'image/p.png',
        polylineColor: '#2196F3',
        
    });

    let poly10 = renderMarkersAndPath(dataShuttleBus10, {
        startIcon: 'image/10.png',
        makkerIcon: 'image/makkerIcon.png',
        endIcon: 'image/10.png',
        middleIcon: 'image/p.png',
        polylineColor: '#2196F3',
        symbolColor: '#FFFF'
    });

    setMapsToCenter(poly02);
    setMapsToCenter(poly03);
    setMapsToCenter(poly04);
    setMapsToCenter(poly09);
    setMapsToCenter(poly10);
};

function setMapsToCenter(obj) {
    let bounds = new google.maps.LatLngBounds();
    let points = obj.getPath().getArray();
    for (let n = 0; n < points.length; n++) {
        bounds.extend(points[n]);
    }
    map.fitBounds(bounds);
}

window.onload = async function() {
    await initialize();
};