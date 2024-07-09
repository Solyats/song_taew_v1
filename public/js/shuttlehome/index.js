let map;
let allDataShuttleBus = [];
let listShuttleBus = [];

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
        uuIndices = [3,4,5,7,24,25,46,16,33,34,39,40,42,43,2, 9, 27, 30, 32, 33, 34, 37, 38, 39, 41, 42, 44, 45];
        break;
      case "bus04":
        uuIndices = [3,4,5,7,24,25,46,16,33,34,39,40,42,43,2, 9, 27, 30, 32, 33, 34, 37, 38, 39, 41, 42, 44, 45];
        break;
      case "bus09":
        uuIndices = [3,4,5,7,24,25,46,16,33,34,39,40,42,43,2, 9, 27, 30, 32, 33, 34, 37, 38, 39, 41, 42, 44, 45];
        break;
      case "bus10":
        uuIndices = [3,4,5,7,24,25,46,16,33,34,39,40,42,43,2, 9, 27, 30, 32, 33, 34, 37, 38, 39, 41, 42, 44, 45];
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
      strokeWeight: 1,
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
        endIcon: item?.shuttleBus_picture
          ? "image/busIcon60.png"
          : "image/busIcon60.png",
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

const initDetailBus = () => {
  try {
    let busContent = "";
    let shuttleBusSidebar = "";

    $(document).ready(function() {
      const shuttlebusStops = ["สถานี1", "สถานี2", "สถานี3", "สถานี4", "สถานี5", "สถานี6", "สถานี7", "สถานี8", "สถานี9"];
      
      function generateTable(data) {
        const table = $('#shuttlebusTable');
        let row;
        data.forEach((stop, index) => {
          if (index % 3 === 0) {
            row = $('<tr></tr>').appendTo(table);
          }
          $('<td></td>').text(stop).appendTo(row);
        });
      }

      generateTable(shuttlebusStops);
    });

    $("#detail_bus").html("");
    $("#list_shuttle_bus_data").html("");

    let uniqueBuses = [];

    if (allDataShuttleBus.length > 0) {
      allDataShuttleBus.forEach((item) => {
        if (!uniqueBuses.includes(item?.shuttleBus_id)) {
          uniqueBuses.push(item.shuttlebus);

         const shuttlebusStops = item?.detailData
  .map((stop) => stop.busStop_name)
  .filter((name) => !name.endsWith('*'))
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

    if (listShuttleBus.length > 0) {
      listShuttleBus.forEach((item) => {
        if (!uniqueBuses.includes(item?.shuttleBus_id)) {
          shuttleBusSidebar += `
          <span id="item_${item?.shuttleBus_id}"
  class="flex flex-col items-center active-nav-link text-white nav-item ml-4 mr-4 my-4 hover:bg-primary cursor-pointer">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
    class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
  </svg>
  <div class="m-1 text-white text-1xl font-semibold content-center flex flex-col items-center">
    <span>${item?.shuttleTHname}</span>
  </div>
</span>
          `;
        }
      });
    }

    $("#list_shuttle_bus_data").html(shuttleBusSidebar);

    if (listShuttleBus.length > 0) {
      listShuttleBus.forEach((item) => {
        if (!uniqueBuses.includes(item?.shuttleBus_id)) {
          $(`#item_${item?.shuttleBus_id}`).on("click", async function () {
            await initialize(item?.shuttleBus_id);
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

window.onload = async function () {
  listShuttleBus = await fetchShuttlebusData();
  await initialize("bus02");
};
