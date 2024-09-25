let map;
let allDataShuttleBus = [];
let mainRoutePolylines = [];
let allMarkers = [];

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
      let iconSize;
      let index = i + 1;
      if (index === 1) {
        iconUrl = iconSet.startIcon;
        iconSize = new google.maps.Size(60, 60);
      } else if (uuIndices.includes(index)) {
        iconUrl = iconSet.makkerIcon;
        iconSize = new google.maps.Size(40, 40);
      } else if (index === data.length) {
        iconUrl = iconSet.endIcon;
        iconSize = new google.maps.Size(80, 41);
      } else {
        iconUrl = iconSet.middleIcon;
        iconSize = new google.maps.Size(30, 30);
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
          scaledSize: iconSize,
        },
        visible: index === 1 || index === data.length,
      });

      if (index === 1 || index === data.length) {
        let label = new google.maps.Marker({
          position: new google.maps.LatLng(
            item.busStop_latitude,
            item.busStop_longitude
          ),
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0
          }
        });
      }

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
      allMarkers.push(marker);
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
      zIndex: 0,
    });

    poly.originalColor = iconSet.polylineColor;
    poly.whiteBorder = whiteBorder;

    google.maps.event.addListener(poly, "click", function () {
      allPolylines.forEach((p) => updatePolylineStyle(p, false));
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

    allPolylines.push(poly);

    return poly;
  };

  let allPolylines = [];

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
    const bounds = new google.maps.LatLngBounds();
    allDataShuttleBus.forEach((item) => {
      let itemDetail = renderMarkersAndPath(item?.detailData, {
        startIcon: "image/startIcon.png",
        makkerIcon: "image/makkerIcon.png",
        endIcon: item?.shuttleBus_picture || "image/busIcon60.png",
        middleIcon: "image/p.png",
        polylineColor: item?.polylineColor || "#ffff00",
        symbolColor: item?.symbolColor || "#32cd32",
      });

      mainRoutePolylines.push(itemDetail);
      itemDetail.getPath().forEach(latLng => bounds.extend(latLng));
    });
    map.fitBounds(bounds);
  }
};

function setupAutocomplete() {
  const inputStart = document.getElementById('shuttlebus-search-start');
  const inputEnd = document.getElementById('shuttlebus-search-end');
  const searchButton = document.getElementById('shuttlebus-search-button');

  populateSelectOptions(inputStart);
  populateSelectOptions(inputEnd);

  $('.select2').select2({
    placeholder: "เลือกจุดต้นทาง",
    allowClear: true,
    language: {
      noResults: function() {
        return "ไม่พบผลลัพธ์";
      }
    }
  });

  searchButton.addEventListener('click', handleSearch);
}

function populateSelectOptions(selectElement) {
  const uniqueStops = new Set();
  allDataShuttleBus.forEach(route => {
    route.detailData.forEach(stop => {
      if (!stop.busStop_name.endsWith('*')) {
        uniqueStops.add(stop.busStop_name);
      }
    });
  });

  uniqueStops.forEach(stopName => {
    const option = document.createElement('option');
    option.value = stopName;
    option.textContent = stopName;
    selectElement.appendChild(option);
  });
}

function handleSearch() {
  const startStop = document.getElementById('shuttlebus-search-start').value;
  const endStop = document.getElementById('shuttlebus-search-end').value;

  if (startStop && endStop) {
    clearPreviousSearchResults();

    let routes = findAllPossibleRoutes(startStop, endStop);
    if (routes.length > 0) {
      // Sort routes by total distance in descending order
      routes.sort((a, b) => a.totalDistance - b.totalDistance);

      displayRouteInfo(routes);
      drawRoutes(routes); // Draw only the new routes
    } else {
      alert('No route found with the specified stops.');
    }
  } else {
    alert('Please enter both start and end stops.');
  }
}

function clearPreviousSearchResults() {
  // Hide all existing polylines
  if (window.existingPolylines) {
    window.existingPolylines.forEach(polyline => polyline.setMap(null));
  }
  window.existingPolylines = []; // Reset the existing polylines

  // Hide main route polylines
  mainRoutePolylines.forEach(polyline => polyline.setMap(null)); // ซ่อนเส้นทางหลักทั้งหมด

  // Hide all existing markers
  allMarkers.forEach(marker => marker.setMap(null));
  allMarkers = []; // Reset the existing markers

  // Clear other previous search results
  if (window.currentRoutes) {
    window.currentRoutes.forEach(route => route.forEach(polyline => polyline.setMap(null)));
  }
  window.currentRoutes = [];

  if (window.transferMarkers) {
    window.transferMarkers.forEach(markerSet => markerSet.forEach(marker => marker.setMap(null)));
  }
  window.transferMarkers = [];

  const routeList = document.getElementById('route-list');
  if (routeList) {
    routeList.remove();
  }

  const resultDiv = document.getElementById('shuttlebus-search-result');
  resultDiv.innerHTML = '';
}

function findAllPossibleRoutes(startStop, endStop) {
  const directRoutes = findDirectRoutes(startStop, endStop);
  
  if (directRoutes.length > 0) {
    return directRoutes.sort((a, b) => a.totalDistance - b.totalDistance);
  }
  
  const transferRoutes = findTransferRoutes(startStop, endStop);
  return transferRoutes.sort((a, b) => a.totalDistance - b.totalDistance);
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
      description: [
        `<div class="flex flex-col space-y-3 text-base md:text-lg lg:text-xl bg-gray-100 rounded-lg p-4 shadow-md border-2 border-indigo-500 hover:border-indigo-600 transition duration-300">
          <div class="flex items-center">
            <span class="text-blue-600 mr-3">
              <img src="${route.shuttleBus_picture}" alt="${route.shuttleTHname}" class="w-12 h-8 inline-block rounded-md shadow-sm">
            </span>
            <span class="font-semibold text-lg text-indigo-700">${route.shuttleTHname}:</span>
            <span class="ml-2 text-gray-800">${startStop}</span>
            <span class="mx-2 text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </span>
            <span class="text-gray-800">${endStop}</span>
          </div>
        </div>`
      ],
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
      
      let shortestTransferRoute = null;
      let shortestDistance = Infinity;

      transferStops.forEach(transferStop => {
        const startPath = getSubPath(startRoute.detailData, startStop, transferStop);
        const endPath = getSubPath(endRoute.detailData, transferStop, endStop);
        const totalDistance = calculateDistance(startPath) + calculateDistance(endPath);

        if (totalDistance < shortestDistance) {
          shortestDistance = totalDistance;
          shortestTransferRoute = {
            routes: [
              { name: startRoute.shuttleBus_name, path: startPath },
              { name: endRoute.shuttleBus_name, path: endPath }
            ],
            totalDistance,
            description: [
              `<div class="flex flex-col space-y-4 text-base md:text-lg lg:text-xl bg-white rounded-lg p-6 shadow-lg border border-gray-200 hover:border-gray-300 transition duration-300">
                <div class="flex items-center">
                  <span class="text-blue-600 mr-3">
                    <img src="${startRoute.shuttleBus_picture}" alt="${startRoute.shuttleTHname}" class="w-12 h-8 inline-block rounded-md shadow-sm">
                  </span>
                  <span class="font-semibold text-lg text-indigo-700">${startRoute.shuttleTHname}:</span>
                  <span class="ml-2 text-gray-800">${startStop}</span>
                  <span class="mx-2 text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                  </span>
                  <span class="text-gray-800">${transferStop}</span>
                </div>
                
                <div class="pl-8 text-gray-700 italic text-lg">

                  <span class="font-medium text-red-600">จุดเปลี่ยนรถ:</span>
                  <span class="ml-2 text-gray-800">${transferStop}</span>
                </div>
                
                <div class="flex items-center pl-8 text-gray-700 text-lg">
                  <span class="text-green-600 mr-3">
                    <img src="${endRoute.shuttleBus_picture}" alt="${endRoute.shuttleTHname}" class="w-12 h-8 inline-block rounded-md shadow-sm">
                  </span>
                  <span class="font-semibold text-lg text-indigo-700">${endRoute.shuttleTHname}:</span>
                  <span class="ml-2 text-gray-800">${transferStop}</span>
                  <span class="mx-2 text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                  </span>
                  <span class="text-gray-800">${endStop}</span>
                </div>
              </div>`,
            ],
            transfers: [transferStop]
          };
        }
      });

      if (shortestTransferRoute) {
        transferRoutes.push(shortestTransferRoute);
      }
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
  let html = '<h3 style="color: #4A90E2; font-size: 1.5em; margin-bottom: 10px;">ข้อมูลสายรถ</h3>';
  
  if (routes[0].transfers.length === 0) {
    html += `<p style="color: #2ECC71; font-size: 1.2em;">ค้นพบ ${routes.length} เส้นทางตรง</p>`;
  } else {
    html += `<p style="color: #2ECC71; font-size: 1.2em;">ค้นพบ ${routes.length} เส้นทางที่ต้องเปลี่ยนรถ</p>`;
  }
  
  resultDiv.innerHTML = html;
}

function createClickableRouteList(routes) {
  const listContainer = document.createElement('div');
  listContainer.id = 'route-list';
  listContainer.style.marginTop = '20px';

  const header = document.createElement('h4');
  header.textContent = routes[0].transfers.length === 0 ? 'เส้นทางตรง' : 'เส้นทางที่ต้องเปลี่ยนรถ';
  listContainer.appendChild(header);

  createRouteItems(routes, listContainer);

  const resultDiv = document.getElementById('shuttlebus-search-result');
  resultDiv.appendChild(listContainer);
}

function createRouteItems(routes, container) {
  routes.forEach((route, index) => {
    const routeItem = document.createElement('div');
    routeItem.className = 'route-item';
    routeItem.style.cursor = 'pointer';
    routeItem.style.padding = '10px';
    routeItem.style.border = '1px solid #ccc';
    routeItem.style.marginBottom = '5px';
    routeItem.style.borderRadius = '5px';
    routeItem.style.backgroundColor = '#f0f0f0';

    const routeTitle = document.createElement('h5');
    routeTitle.textContent = `เส้นที่ ${index + 1}`;
    routeTitle.style.fontWeight = 'bold';
    routeItem.appendChild(routeTitle);

    const routeDetails = document.createElement('p');
    routeDetails.textContent = `ระยะทางรวม: ${(route.totalDistance / 1000).toFixed(2)} km`;
    routeItem.appendChild(routeDetails);

    const routeDescription = document.createElement('div');
    route.description.forEach(desc => {
      if (desc.startsWith('<div')) {
        const descElement = document.createElement('div');
        descElement.innerHTML = desc;
        routeDescription.appendChild(descElement);
      } else {
        const p = document.createElement('p');
        p.textContent = desc;
        routeDescription.appendChild(p);
      }
    });
    routeItem.appendChild(routeDescription);

    routeItem.addEventListener('click', () => {
      document.querySelectorAll('.route-item').forEach(item => {
        item.style.backgroundColor = '#f0f0f0';
      });
      routeItem.style.backgroundColor = '#e0e0e0';
      highlightRoute(index);
    });

    container.appendChild(routeItem);
  });

  if (routes.length > 0) {
    highlightRoute(0);
    container.firstChild.style.backgroundColor = '#e0e0e0';
  }
}

function drawRoutes(routes) {
  const colors = ['#FF0000', '#00FFFF'];
  const bounds = new google.maps.LatLngBounds();

  window.currentRoutes = [];
  window.transferMarkers = [];

  // Clear existing polylines before drawing new ones
  if (window.existingPolylines) {
    window.existingPolylines.forEach(polyline => polyline.setMap(null));
  }
  window.existingPolylines = [];

  routes.forEach((route, routeIndex) => {
    const routePolylines = route.routes.map((subRoute, subRouteIndex) => {
      const path = subRoute.path.map(stop => {
        const latLng = new google.maps.LatLng(stop.busStop_latitude, stop.busStop_longitude);
        bounds.extend(latLng);
        return latLng;
      });

      const polyline = new google.maps.Polyline({
        path: path,
        strokeColor: colors[(routeIndex + subRouteIndex) % colors.length],
        strokeOpacity: 1.0,
        strokeWeight: 5,
        map: null, // Initially set to null
        zIndex: 100 + routeIndex
      });

      // Store the new polyline for future reference
      window.existingPolylines.push(polyline);
      return polyline;
    });

    window.currentRoutes.push(routePolylines);

    // Get start and end stops from input
    const startStopName = document.getElementById('shuttlebus-search-start').value;
    const endStopName = document.getElementById('shuttlebus-search-end').value;

    const startStop = route.routes[0].path.find(stop => stop.busStop_name === startStopName);
    const endStop = route.routes[0].path.find(stop => stop.busStop_name === endStopName);

    if (startStop && endStop) {
      const startMarker = new google.maps.Marker({
        position: new google.maps.LatLng(startStop.busStop_latitude, startStop.busStop_longitude),
        map: null, // Initially set to null
        icon: {
          url: 'image/startIcon.png',
          scaledSize: new google.maps.Size(30, 30)
        },
        title: 'Start Point: ' + startStop.busStop_name,
        zIndex: 150
      });

      const endMarker = new google.maps.Marker({
        position: new google.maps.LatLng(endStop.busStop_latitude, endStop.busStop_longitude),
        map: null, // Initially set to null
        icon: {
          url: 'image/endIcon.png',
          scaledSize: new google.maps.Size(30, 30)
        },
        title: 'End Point: ' + endStop.busStop_name,
        zIndex: 150
      });

      window.transferMarkers.push([startMarker, endMarker]);
    }

    if (route.transfers && route.transfers.length > 0) {
      const routeTransferMarkers = route.transfers.map(transferStop => {
        const transferPoint = route.routes[0].path.find(stop => stop.busStop_name === transferStop) ||
                              route.routes[1].path.find(stop => stop.busStop_name === transferStop);
        
        if (transferPoint) {
          const transferMarker = new google.maps.Marker({
            position: new google.maps.LatLng(transferPoint.busStop_latitude, transferPoint.busStop_longitude),
            map: null, // Initially set to null
            icon: {
              url: 'image/transferIcon.png',
              scaledSize: new google.maps.Size(30, 30)
            },
            title: 'Transfer Point: ' + transferStop,
            zIndex: 150
          });

          // Find the point farthest from the transfer point in the first route
          const startStop = route.routes[0].path.reduce((farthest, stop) => {
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(transferPoint.busStop_latitude, transferPoint.busStop_longitude),
              new google.maps.LatLng(stop.busStop_latitude, stop.busStop_longitude)
            );
            return distance > farthest.distance ? { stop, distance } : farthest;
          }, { stop: null, distance: 0 }).stop;

          const startMarker = new google.maps.Marker({
            position: new google.maps.LatLng(startStop.busStop_latitude, startStop.busStop_longitude),
            map: null, // Initially set to null
            icon: {
              url: 'image/startIcon.png',
              scaledSize: new google.maps.Size(30, 30)
            },
            title: 'Start Point: ' + startStop.busStop_name,
            zIndex: 150
          });

          // Find the point farthest from the transfer point in the second route
          const endStop = route.routes[1].path.reduce((farthest, stop) => {
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(transferPoint.busStop_latitude, transferPoint.busStop_longitude),
              new google.maps.LatLng(stop.busStop_latitude, stop.busStop_longitude)
            );
            return distance > farthest.distance ? { stop, distance } : farthest;
          }, { stop: null, distance: 0 }).stop;

          const endMarker = new google.maps.Marker({
            position: new google.maps.LatLng(endStop.busStop_latitude, endStop.busStop_longitude),
            map: null, // Initially set to null
            icon: {
              url: 'image/endIcon.png',
              scaledSize: new google.maps.Size(30, 30)
            },
            title: 'End Point: ' + endStop.busStop_name,
            zIndex: 150
          });

          return [startMarker, transferMarker, endMarker];
        }
        return null;
      }).filter(markerSet => markerSet !== null);

      window.transferMarkers.push(routeTransferMarkers.flat());
    }
  });

  map.fitBounds(bounds);
  createClickableRouteList(routes);
  
  if (routes.length > 0) {
    highlightRoute(0);
  }
}

function highlightRoute(selectedIndex) {
  window.currentRoutes.forEach((routePolylines, index) => {
    const isSelected = index === selectedIndex;
    routePolylines.forEach(polyline => {
      polyline.setMap(isSelected ? map : null);
      polyline.setOptions({
        strokeOpacity: 1.0,
        strokeWeight: isSelected ? 7 : 5,
        zIndex: isSelected ? 200 : 100 + index
      });
    });

    if (window.transferMarkers[index]) {
      window.transferMarkers[index].forEach(marker => {
        marker.setMap(isSelected ? map : null);
      });
    }
  });

  if (window.currentRoutes[selectedIndex]) {
    const bounds = new google.maps.LatLngBounds();
    window.currentRoutes[selectedIndex].forEach(polyline => {
      polyline.getPath().forEach(latLng => bounds.extend(latLng));
    });
    map.fitBounds(bounds);
  }

  updateRouteListUI(selectedIndex);
}

function updateRouteListUI(selectedIndex) {
  const routeItems = document.querySelectorAll('.route-item');
  routeItems.forEach((item, index) => {
    item.style.backgroundColor = index === selectedIndex ? '#e0e0e0' : '#f0f0f0';
  });
}

function showMainRoutes() {
  mainRoutePolylines.forEach(polyline => polyline.setMap(map));
  if (window.currentRoutes) {
    window.currentRoutes.forEach(route => route.forEach(polyline => polyline.setMap(null)));
  }
  map.fitBounds(getMainRoutesBounds());
}

function getMainRoutesBounds() {
  const bounds = new google.maps.LatLngBounds();
  mainRoutePolylines.forEach(polyline => {
    polyline.getPath().forEach(latLng => bounds.extend(latLng));
  });
  return bounds;
}

function updateMapWithRoute(routeId) {
  initialize(routeId);
}

function updateMapWithStop(routeId, stopId) {
  initialize(routeId);
  const route = allDataShuttleBus.find(r => r.shuttleBus_id === routeId);
  const stop = route.detailData.find(s => s.busStop_id === stopId);
  if (stop) {
    map.setCenter(new google.maps.LatLng(stop.busStop_latitude, stop.busStop_longitude));
    map.setZoom(15);
  }
}

window.onload = async function() {
  await initialize();
  setupAutocomplete();
  
  document.getElementById('shuttlebus-search-start').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleSearch();
  });
  document.getElementById('shuttlebus-search-end').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleSearch();
  });
  document.getElementById('shuttlebus-search-button').addEventListener('click', handleSearch);


  document.body.appendChild(showMainRoutesButton);
};