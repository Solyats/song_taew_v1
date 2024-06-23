let dataShuttleBus = []
let map;

const fetchShuttlebus02 = async () => {
  try {
      const bodyRequest = {
          route_id: 'bus02',
      };

      const response = await axios.post('http://localhost:5555/api/v1/get-path2', bodyRequest);

      if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;

      dataShuttleBus = data?.data; 

  } catch (error) {
      console.error('Error fetching the shuttle bus data:', error);
  }
};


const initialize = async () => {
  await fetchShuttlebus02()

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
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  let infowindow = new google.maps.InfoWindow();
  let arr = [];

  // Indices to use uu.png
  let uuIndices = [1,9,27,30,32,33,34,37,38,39,41,42,44,45];

  // Render markers from server-side data


  $.each(dataShuttleBus, function(i, item) {
    // Determine the icon based on the marker position
    let iconUrl;
    let index = i + 1;
    if (index === 1) { // First marker
      iconUrl = 'image/startIcon.png';
    } else if (uuIndices.includes(index)) {
      iconUrl = 'image/makkerIcon.png';
    } else if (index === dataShuttleBus.length) { // Last marker
      iconUrl = 'image/busIcon60.png';
    } else { // Middle markers
      iconUrl = 'image/p.png';
    }

    // Create marker
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

    // Marker details
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        let contentString = '<div><p>' + item.busStop_name + '</p><img src="' + item.busStop_picture + '" width="300px"></div>';
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
      }
    })(marker, i));

    arr.push(marker.getPosition());
  });

  // Create polyline
  let poly = new google.maps.Polyline({
    path: arr,
    strokeColor: '#ffff00',
    strokeOpacity: 1.0,
    strokeWeight: 8,
    map: map
  });

  // Create circle symbols
  let lineSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 3,
    fillColor: '#32cd32',
    fillOpacity: 1,
    strokeColor: '#32cd32',
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

  // Focus map on polyline
  setMapsToCenter(poly);
}

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
   

 }

 
