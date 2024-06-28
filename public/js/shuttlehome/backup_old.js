let dataShuttleBus = [];
let map;

const fetchShuttlebus02 = async (routeId) => {
  try {
    const bodyRequest = {
      route_id: routeId ? routeId : "",
    };

    const response = await axios.post(
      "api/v1/get-path2",
      bodyRequest
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = response.data;

    dataShuttleBus = data;
  } catch (error) {
    console.error("Error fetching the shuttle bus data:", error);
  }
};

const initialize = async (routeId) => {
  await fetchShuttlebus02(routeId);
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
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  let infowindow = new google.maps.InfoWindow();
  let arr = [];

  // Indices to use uu.png
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

  // Render markers from server-side data

  $.each(dataShuttleBus?.data, function (i, item) {
    // Determine the icon based on the marker position
    let iconUrl;
    let index = i + 1;
    if (index === 1) {
      // First marker
      iconUrl = "image/startIcon.png";
    } else if (uuIndices.includes(index)) {
      iconUrl = "image/makkerIcon.png";
    } else if (index === dataShuttleBus?.data?.length) {
      // Last marker
      iconUrl = "image/busIcon60.png";
    } else {
      // Middle markers
      iconUrl = "image/p.png";
    }

    // Create marker
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

    // Marker details
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

  // Create polyline
  let poly = new google.maps.Polyline({
    path: arr,
    strokeColor: "#ffff00",
    strokeOpacity: 1.0,
    strokeWeight: 8,
    map: map,
  });

  // Create circle symbols
  let lineSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 3,
    fillColor: "#32cd32",
    fillOpacity: 1,
    strokeColor: "#32cd32",
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

  // Focus map on polyline
  setMapsToCenter(poly);
};

const initDetailBus = () => {
  try {
    let busContent = "";

    $("#detail_bus").html("");

    let uniqueBuses = [];

    if (dataShuttleBus?.detailData.length > 0) {
      dataShuttleBus?.detailData.forEach((item) => {
        if (!uniqueBuses.includes(item?.shuttleBus_id)) {
          uniqueBuses.push(item.shuttlebus);

          const shuttlebusStops = item?.shuttlebus_stop_detail.join(", ");
          
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

window.onload = async function () {
  await initialize();
  initDomJS();
};
