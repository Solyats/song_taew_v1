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

  try {
    let busContent = "";
    let shuttleBusSidebar = "";

    $("#detail_bus").html("");
    $("#list_shuttle_bus_data").html("");

    let uniqueBuses = [];

    if (allDataShuttleBus.length > 0) {
      allDataShuttleBus.forEach((item) => {
        if (!uniqueBuses.includes(item?.shuttleBus_id)) {
          uniqueBuses.push(item.shuttlebus);

          const shuttlebusStops = item?.detailData
            .map((stop) => stop.busStop_name)
            .filter((name) => !name.endsWith("*"))
            .join(", ");

          busContent += `
        <div class="mb-4">
          <div class=" flex  ">

          <div class="">
  <div class=" flex mt-6 text-xl">
  <img src="${item?.shuttleBus_picture}" alt="รูปรถสาย ${item?.bus02}" class="mr-2" style="width: 15%; height: 15%;"><span>${item?.shuttleBus_name}</span>
  
  </div>


          

            
          </div>
          

          
          <br />
          
        </div>
      `;
        }
      });
    }

    $("#detail_bus").html(busContent);
  } catch (error) {
    console.log(error);
  }

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

window.onload = async function() {
  await initialize();
};
