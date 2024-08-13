let map;
let allDataShuttleBus = [];

const fetchShuttlebusData = async (routeId) => {
  try {
    const bodyRequest = {
      route_id: routeId ? routeId : "",
    };

    const response = await axios.post(
      "api/v1/fetch-shuttlebus",
      bodyRequest
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data.data;
  } catch (error) {
    console.error(`Error fetching the shuttle bus data for ${routeId}:`, error);
  }
};

const fetchAllShuttlebusData = async () => {
  allDataShuttleBus = await fetchShuttlebusData();
};

const updatePolylineStyle = (polyline, isSelected) => {
  polyline.whiteBorder.setVisible(isSelected);
  polyline.setOptions({
    zIndex: isSelected ? 1 : 0,
  });
};

const initialize = async (routeId) => {
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
      position: google.maps.ControlPosition.RIGHT_TOP,
    },
  };
  map = new google.maps.Map(document.getElementById("map-bus"), mapOptions);
  let infowindow = new google.maps.InfoWindow();

  let uuIndices = [];

  const renderMarkersAndPath = (data, iconSet) => {
    let arr = [];
    $.each(data, function (i, item) {
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
        position: new google.maps.LatLng(
          item.busStop_latitude,
          item.busStop_longitude
        ),
        map: map,
        title: item.busStop_name,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(
            iconUrl.includes("makkerIcon.png")
              ? 50
              : iconUrl.includes("startIcon.png")
              ? 50
              : iconUrl.includes("busIcon60.png")
              ? 60
              : 0,
            iconUrl.includes("makkerIcon.png")
              ? 50
              : iconUrl.includes("startIcon.png")
              ? 50
              : iconUrl.includes("busIcon60.png")
              ? 60
              : 0
          ),
        },
      });

      google.maps.event.addListener(
        marker,
        "click",
        (function (marker, i) {
          return function () {
            let contentString =
              "<div><p>" +
              item.busStop_name +
              '</p><img src="' +
              item.busStop_picture +
              '" width="300px"></div>';
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
          };
        })(marker, i)
      );

      arr.push(marker.getPosition());
    });

    let whiteBorder = new google.maps.Polyline({
      path: arr,
      strokeColor: "white",
      strokeOpacity: 1.0,
      strokeWeight: 12,
      map: map,
      zIndex: 0,
      visible: false,
    });

    let poly = new google.maps.Polyline({
      path: arr,
      strokeColor: iconSet.polylineColor,
      strokeOpacity: 1.0,
      strokeWeight: 8,
      map: map,
      zIndex: 0, // Default zIndex
    });

    poly.originalColor = iconSet.polylineColor;
    poly.whiteBorder = whiteBorder; // Link the white border to the polyline

    google.maps.event.addListener(poly, "click", function () {
      // Reset all polylines zIndex and white border visibility
      allPolylines.forEach((p) => updatePolylineStyle(p, false));
      // Update clicked polyline zIndex and style
      updatePolylineStyle(poly, true);
    });

    let lineSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 3,
      fillColor: iconSet.symbolColor,
      fillOpacity: 1,
      strokeColor: iconSet.symbolColor,
      strokeWeight: 2,
    };

    let lineSymbolSequence = {
      icon: lineSymbol,
      offset: "0%",
      repeat: "0.7%",
    };

    poly.setOptions({
      icons: [lineSymbolSequence],
    });

    allPolylines.push(poly); // Add to allPolylines array

    return poly;
  };

  let allPolylines = []; // Store all polylines for resetting zIndex

   if (!routeId) {
    let set = new Set(uuIndices);
    for (let i = 1; i <= 0; i++) {
      set.add(i);
    }
    uuIndices = Array.from(set);
    uuIndices.sort((a, b) => a - b);
  } else {
    switch (routeId) {
      case "bus02":
        uuIndices = [2, 9, 27, 30, 32, 33, 34, 37, 38, 39, 41, 42, 44, 45];
        break;
      case "bus03":
        uuIndices = [1, 2, 3];
        break;
      case "bus04":
        uuIndices = [1, 2, 3];
        break;
      case "bus09":
        uuIndices = [1, 2, 3];
        break;
      case "bus10":
        uuIndices = [1, 2, 3];
        break;
      default:
        break;
    }
  }

  if (allDataShuttleBus.length > 0) {
    allDataShuttleBus.map((item) => {
      let itemDetail = renderMarkersAndPath(item?.detailData, {
         startIcon: "image/startIcon.png",
        makkerIcon: "image/makkerIcon.png",
        endIcon: item?.shuttleBus_picture ? "image/busIcon60.png" : "image/busIcon60.png",
        middleIcon: "image/p.png",
        polylineColor: item?.polylineColor ? item?.polylineColor : "#ffff00",
        symbolColor: item?.symbolColor ? item?.symbolColor : "#32cd32",
      });

      setMapsToCenter(itemDetail);
    });
  }
};

function setMapsToCenter(obj) {
  let bounds = new google.maps.LatLngBounds();
  let points = obj.getPath().getArray();
  for (let n = 0; n < points.length; n++) {
    bounds.extend(points[n]);
  }
  map.fitBounds(bounds);
}

// Add this function after the initialize function
function setupAutocomplete() {
  const inputStart = document.getElementById('shuttlebus-search-start');
  const autocompleteListStart = document.getElementById('autocomplete-list-start');
  const inputEnd = document.getElementById('shuttlebus-search-end');
  const autocompleteListEnd = document.getElementById('autocomplete-list-end');
  const searchButton = document.getElementById('shuttlebus-search-button');

  setupAutocompleteForInput(inputStart, autocompleteListStart);
  setupAutocompleteForInput(inputEnd, autocompleteListEnd);

  searchButton.addEventListener('click', handleSearch);

  document.addEventListener('click', function(e) {
    if (e.target !== inputStart && e.target !== autocompleteListStart) {
      autocompleteListStart.style.display = 'none';
    }
    if (e.target !== inputEnd && e.target !== autocompleteListEnd) {
      autocompleteListEnd.style.display = 'none';
    }
  });
}

function setupAutocompleteForInput(input, autocompleteList) {
  input.addEventListener('input', function() {
    const inputValue = this.value.toLowerCase();
    autocompleteList.innerHTML = '';

    if (inputValue.length === 0) {
      autocompleteList.style.display = 'none';
      return;
    }

    const uniqueStops = new Set();
    const matchingStops = allDataShuttleBus.flatMap(route => 
      route.detailData
        .filter(stop => 
          stop.busStop_name.toLowerCase().includes(inputValue) &&
          !stop.busStop_name.endsWith('*')
        )
        .map(stop => stop.busStop_name)
    );

    matchingStops.forEach(stopName => uniqueStops.add(stopName));

    if (uniqueStops.size > 0) {
      autocompleteList.style.display = 'block';
      uniqueStops.forEach(stopName => {
        const item = document.createElement('div');
        item.textContent = stopName;
        item.addEventListener('click', function() {
          input.value = this.textContent;
          autocompleteList.style.display = 'none';
        });
        autocompleteList.appendChild(item);
      });
    } else {
      autocompleteList.style.display = 'none';
    }
  });
}

function handleSearch() {
  const startStop = document.getElementById('shuttlebus-search-start').value;
  const endStop = document.getElementById('shuttlebus-search-end').value;

  if (startStop && endStop) {
    const routes = findAllPossibleRoutes(startStop, endStop);
    if (routes.length > 0) {
      displayRouteInfo(routes);
      drawRoutes(routes);
    } else {
      alert('No route found with the specified stops.');
    }
  } else {
    alert('Please enter both start and end stops.');
  }
}

function findAllPossibleRoutes(startStop, endStop) {
  let allRoutes = [];

  // Check direct routes
  const directRoutes = findDirectRoutes(startStop, endStop);
  allRoutes = allRoutes.concat(directRoutes);

  // Check routes with one transfer
  const transferRoutes = findTransferRoutes(startStop, endStop);
  allRoutes = allRoutes.concat(transferRoutes);

  // Sort routes by total distance
  allRoutes.sort((a, b) => a.totalDistance - b.totalDistance);

  return allRoutes;
}

function findDirectRoutes(startStop, endStop) {
  return allDataShuttleBus.filter(route => {
    const stops = route.detailData.map(stop => stop.busStop_name);
    return stops.includes(startStop) && stops.includes(endStop);
  }).map(route => {
    const startIndex = route.detailData.findIndex(stop => stop.busStop_name === startStop);
    const endIndex = route.detailData.findIndex(stop => stop.busStop_name === endStop);
    const path = route.detailData.slice(
      Math.min(startIndex, endIndex),
      Math.max(startIndex, endIndex) + 1
    );
    const totalDistance = calculateDistance(path);
    return {
      routes: [{ name: route.shuttleBus_name, path }],
      totalDistance,
      description: [`${route.shuttleBus_name}: ${startStop} to ${endStop}`],
      transfers: []
    };
  });
}

function findTransferRoutes(startStop, endStop) {
  let transferRoutes = [];

  allDataShuttleBus.forEach(startRoute => {
    const startStops = startRoute.detailData.map(stop => stop.busStop_name);
    if (!startStops.includes(startStop)) return;

    allDataShuttleBus.forEach(endRoute => {
      if (startRoute === endRoute) return;
      const endStops = endRoute.detailData.map(stop => stop.busStop_name);
      if (!endStops.includes(endStop)) return;

      const transferStops = startStops.filter(stop => endStops.includes(stop));
      
      transferStops.forEach(transferStop => {
        const startPath = getSubPath(startRoute.detailData, startStop, transferStop);
        const endPath = getSubPath(endRoute.detailData, transferStop, endStop);
        const totalDistance = calculateDistance(startPath) + calculateDistance(endPath);

        transferRoutes.push({
          routes: [
            { name: startRoute.shuttleBus_name, path: startPath },
            { name: endRoute.shuttleBus_name, path: endPath }
          ],
          totalDistance,
          description: [
            `${startRoute.shuttleBus_name}: ${startStop} to ${transferStop}`,
            `Transfer at ${transferStop}`,
            `${endRoute.shuttleBus_name}: ${transferStop} to ${endStop}`
          ],
          transfers: [transferStop]
        });
      });
    });
  });

  return transferRoutes;
}

function getSubPath(routeData, startStop, endStop) {
  const startIndex = routeData.findIndex(stop => stop.busStop_name === startStop);
  const endIndex = routeData.findIndex(stop => stop.busStop_name === endStop);
  return routeData.slice(
    Math.min(startIndex, endIndex),
    Math.max(startIndex, endIndex) + 1
  );
}

function calculateDistance(path) {
  let distance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const start = new google.maps.LatLng(path[i].busStop_latitude, path[i].busStop_longitude);
    const end = new google.maps.LatLng(path[i+1].busStop_latitude, path[i+1].busStop_longitude);
    distance += google.maps.geometry.spherical.computeDistanceBetween(start, end);
  }
  return distance;
}

function displayRouteInfo(routes) {
  const resultDiv = document.getElementById('shuttlebus-search-result');
  let html = '<h3>Route Information</h3>';
  routes.forEach((route, index) => {
    html += `
      <div style="margin-bottom: 20px; border: 1px solid #ccc; padding: 10px;">
        <h4>Route ${index + 1}</h4>
        <p>Total Distance: ${(route.totalDistance / 1000).toFixed(2)} km</p>
        <p>Route Details:</p>
        <ul>
          ${route.description.map(desc => `<li>${desc}</li>`).join('')}
        </ul>
      </div>
    `;
  });
  resultDiv.innerHTML = html;
}

function drawRoutes(routes) {
  // Clear existing routes
  if (window.currentRoutes) {
    window.currentRoutes.forEach(route => route.setMap(null));
  }
  window.currentRoutes = [];

  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  routes.forEach((route, index) => {
    const path = [];
    let startIndex = -1;
    let endIndex = -1;

    route.detailData.forEach((stop, i) => {
      if (stop.busStop_name === startStop) startIndex = i;
      if (stop.busStop_name === endStop) endIndex = i;
    });

    if (startIndex > endIndex) [startIndex, endIndex] = [endIndex, startIndex];

    for (let i = startIndex; i <= endIndex; i++) {
      path.push(new google.maps.LatLng(
        route.detailData[i].busStop_latitude,
        route.detailData[i].busStop_longitude
      ));
    }

    const polyline = new google.maps.Polyline({
      path: path,
      strokeColor: colors[index % colors.length],
      strokeOpacity: 1.0,
      strokeWeight: 5,
      map: map,
      zIndex: 100 + index // Ensure the new routes are on top
    });

    window.currentRoutes.push(polyline);
  });

  // Fit the map to show all routes
  const bounds = new google.maps.LatLngBounds();
  window.currentRoutes.forEach(route => {
    route.getPath().forEach(latLng => bounds.extend(latLng));
  });
  map.fitBounds(bounds);
}
function calculateDistance(route, startStop, endStop) {
  let distance = 0;
  let startIndex = -1;
  let endIndex = -1;

  route.detailData.forEach((stop, index) => {
    if (stop.busStop_name === startStop) startIndex = index;
    if (stop.busStop_name === endStop) endIndex = index;
  });

  if (startIndex > endIndex) [startIndex, endIndex] = [endIndex, startIndex];

  for (let i = startIndex; i < endIndex; i++) {
    const start = new google.maps.LatLng(
      route.detailData[i].busStop_latitude,
      route.detailData[i].busStop_longitude
    );
    const end = new google.maps.LatLng(
      route.detailData[i + 1].busStop_latitude,
      route.detailData[i + 1].busStop_longitude
    );
    distance += google.maps.geometry.spherical.computeDistanceBetween(start, end);
  }

  return distance;
}

function updateMapWithRoute(routeId) {
  // Implement the logic to update the map with the selected route
  initialize(routeId);
}

function updateMapWithStop(routeId, stopId) {
  // Implement the logic to update the map with the selected stop
  initialize(routeId);
  // Additional logic to focus on the specific stop
  const route = allDataShuttleBus.find(r => r.shuttleBus_id === routeId);
  const stop = route.detailData.find(s => s.busStop_id === stopId);
  if (stop) {
    map.setCenter(new google.maps.LatLng(stop.busStop_latitude, stop.busStop_longitude));
    map.setZoom(15); // Adjust zoom level as needed
  }
}

window.onload = async function() {
  await initialize();
  setupAutocomplete();
};