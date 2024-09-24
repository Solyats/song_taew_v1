let listDatas = [];


let map;
let allDataShuttleBus = [];
let listShuttleBus = [];

const fetchShuttlebusData = async (routeId) => {
  try {
    const bodyRequest = {
      route_id: routeId ? routeId : "",
    };

    const response = await axios.post("api/v1/fetch-shuttlebus", bodyRequest);

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
    uuIndices = Array.from({length: 1000}, (_, i) => i + 1);
  } 

  let arr = [];

  const renderMarkersAndPath = (data, iconSet) => {
    const filteredData = data.filter((item) => !item.busStop_name.endsWith("*"));
    $.each(filteredData, function (i, item) {
      let iconUrl;
      let index = i + 1;
      if (index === 1) {
        iconUrl = iconSet.startIcon;
      } else if (uuIndices.includes(index)) {
        iconUrl = iconSet.makkerIcon;
      } else if (index === filteredData.length) {
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
          // scaledSize: new google.maps.Size(
            
          //   item?.busStop_name.endsWith("*") ? 0 : 50,
          //   item?.busStop_name.endsWith("*") ? 0 : 50
          // ),
          // origin: new google.maps.Point(0, 0), // จุดเริ่มต้นของไอคอนที่มีขนาด 50x50 pixels
          // anchor: new google.maps.Point(40, 40), // จุดที่ใช้เชื่อมต่อไอคอนกับตำแหน่งของ Marker
        },
      });

      google.maps.event.addListener(
        marker,
        "click",
        (function (marker, i) {
          return function () {
            let contentString =
              
              "<div><p>" +
              "ชื่อจุดจอด :" + item.busStop_name +
              "<div><p>" +
              "ละติจูด :" + item.busStop_latitude +
              "<div><p>" +
              "ลองจิจูด :" + item.busStop_longitude +
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
      strokeWeight: 0,
      map: map,
      zIndex: 0,
      visible: false,
    });

    let poly = new google.maps.Polyline({
      path: arr,
      strokeColor: iconSet.polylineColor,
      strokeOpacity: 0,
      strokeWeight: 0,
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
      scale: 0,
      fillColor: iconSet.symbolColor,
      fillOpacity: 1,
      strokeColor: iconSet.symbolColor,
      strokeWeight: 0,
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
        startIcon: "image/makkerIcon.png",
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
 <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 11H6V6h12m-1.5 11a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m-9 0A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 14A1.5 1.5 0 0 1 9 15.5A1.5 1.5 0 0 1 7.5 17M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4z"/></svg>
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


$(document).ready(function() {
            $('#tooltip-trigger').hover(
                function() {
                    // เมื่อเมาส์เลื่อนเข้าสู่ปุ่ม
                    $('#tooltip-default').addClass('tooltip-visible');
                },
                function() {
                    // เมื่อเมาส์ออกจากปุ่ม
                    $('#tooltip-default').removeClass('tooltip-visible');
                }
            );
        });

const initDataPage = async () => {
  try {
     window.customswal.showLoading()
    const response = await axios.post(
      "api/v1/list-bus-stop"
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response?.data?.data?.length > 0) {
      listDatas = response.data.data;

      $("#list_data_busstop").html("");

      let divContent = null;

      const listDatasVar = listDatas.filter((item) => {
      return (detail => detail.busStop_id === item.busStop_id) && !item.busStop_name.endsWith("*");
    });

      listDatasVar.map((item) => {
        divContent += `
            <tr
                  class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    ${item?.busStop_subname}
                  </td>
                  <td class="px-6 py-4">${item?.busStop_name}</td>
                  
                  <td class="px-6 py-4">${item?.busStop_latitude}</td>
                  <td class="px-6 py-4">${item?.busStop_longitude}</td>
                  <td class="px-6 py-4 " >
                  
        <img src="${item?.busStop_picture}" alt="Bus Stop Picture" class="w-40 h-28q object-cover">
    </td>
                  <td class="px-6 py-4 flex ">
                    <a
                      href="/admin_edit_bus_stop?id=${item?.busStop_id}"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      ><svg class="h-8 w-8 text-500"  viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  <line x1="16" y1="5" x2="19" y2="8" /></svg></a
                    >
                    <button
                      id="btn_delete_${item?.busStop_id}"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      ><svg class="h-8 w-8 text-red-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="4" y1="7" x2="20" y2="7" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" />  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg></button
                    >
                  </td>
                </tr>
            `;
      });
      $("#list_data_busstop").html(divContent);

      listDatas.map((item) => {
        $(`#btn_delete_${item?.busStop_id}`).click(function () {
          Swal.fire({
              title: "ต้องการลบข้อมูล?",
              text: "ต้องการที่จะลบหรือไม่?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "ใช่",
              cancelButtonText: "ยกเลิก",
            }).then(async (result) => {
              if (result.isConfirmed) {
                await onDeleteBusStop(item?.busStop_id);
              }
            });
        });
      });
    }
  } catch (err) {
    console.log(err);
  } finally {
     window.customswal.hideLoading()
  }
};

const onDeleteBusStop = async (busStop_id) => {
  try {
     window.customswal.showLoading()

    if (!busStop_id) {
      return showErrorAlert("busStop_id_is_missing")
    }

    const bodyRequest = {
      busStop_id: busStop_id,
    };

    const response = await axios.post(
      "api/v1/delete-bus-stop",
      bodyRequest
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }


    window.location.reload()
  } catch (error) {
    console.log(error)
     window.customswal.showErrorAlert(error)
  } finally {
     window.customswal.hideLoading()
  }
}

window.onload = async function () {
  initialize();
  await initDataPage();
};
