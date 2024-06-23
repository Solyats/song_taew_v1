let map;
let allDataShuttleBus = [];

const fetchShuttlebusData = async (routeId) => {
  try {
    const bodyRequest = {
      route_id: routeId ? routeId : "",
    };

    const response = await axios.post(
      "http://localhost:5555/api/v1/get-path2",
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

const updatePolylineStyle = (polyline, isSelected) => {
  polyline.whiteBorder.setVisible(isSelected);
  polyline.setOptions({
    zIndex: isSelected ? 1 : 0,
  });
};

const initialize = async (routeId) => {
  allDataShuttleBus = await fetchShuttlebusData(routeId);

  initDetailBus();

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

  let uuIndices = [2, 9, 27, 30, 32, 33, 34, 37, 38, 39, 41, 42, 44, 45];

  if (!routeId) {
    let set = new Set(uuIndices);
    for (let i = 1; i <= 1000; i++) {
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

  let arr = [];

  const renderMarkersAndPath = (data, iconSet) => {
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

const initDomJS = () => {
  try {
    $("#span_bus_02").click(async function () {
      await initialize("bus02");
    });

    $("#span_bus_03").click(async function () {
      await initialize("bus03");
    });

    $("#span_bus_04").click(async function () {
      await initialize("bus04");
    });

    $("#span_bus_09").click(async function () {
      await initialize("bus09");
    });

    $("#span_bus_10").click(async function () {
      await initialize("bus10");
    });
  } catch (error) {
    console.log(error);
  }
};

const initDetailBus = () => {
  try {
    let busContent = "";

    $("#detail_bus").html("");

    let uniqueBuses = [];

    if (allDataShuttleBus.length > 0) {
      allDataShuttleBus.forEach((item) => {
        if (!uniqueBuses.includes(item?.shuttleBus_id)) {
          uniqueBuses.push(item.shuttlebus);

          const shuttlebusStops = item?.detailData
            .map((stop) => stop.busStop_name)
            .join(", ");

          busContent += `
        <div class="mb-4">
          <div class="flex justify-center font-semibold ">
            <span>${item?.shuttleBus_name}</span>
          </div>
          <div class="flex justify-center font-semibold">
            <img src="${item?.shuttleBus_picture}" alt="รูปรถสาย ${item?.bus02}">
          </div>
          <div>
            <span>
              จุดจอด : ${shuttlebusStops}
            </span>
          </div>
          <br />
          <div>
            <span>รถสี : ${item?.shuttleBus_color}</span>
            <div>
              <span>เวลาทำการ : ${item?.shuttleBus_time}</span>
            </div>
            <div>
              <span>ค่าบริการ : ${item?.shuttleBus_price} บาท</span>
            </div>
          </div>
        </div>
      `;
        }
      });
    }

    $("#detail_bus").html(busContent);
  } catch (error) {
    console.log(error);
  }
};

window.onload = async function () {
  await initialize("bus02");
  initDomJS();
};
