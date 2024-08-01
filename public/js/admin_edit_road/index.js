let shuttleBusIdVar = "";
let shortNameVar = "";
let subBsname = "";
let shortThname = "";
let suttlebusColor = "";
let shuttlesusTime = "";
let shuttlesusPrice = "";
let shuttlebusPicture = "";
let polylineColorVar = "";
let symbolColorVar = "";
let shuttlebusIcon = "";
let detailDataVar = [];
let listRouteAvailible = [];


const initDomJS = () => {
  try {
    $("#inp_busstop_name").on("change", function () {
      nameBusStop = $(this).val();
    });

    $(document).ready(function () {
      const $polylineColorVar = $("#polylineColorVar");
      const $symbolColorVar = $("#symbolColorVar");
      const $selectedColorpoly = $("#selectedColorpoly");
      const $selectedColor = $("#selectedColor");

      $polylineColorVar.on("change", function () {
        $selectedColorpoly.text($polylineColorVar.val());
        // Set value to input field
        $("#polylineColorVar").val($polylineColorVar.val());
      });

      $symbolColorVar.on("change", function () {
        $selectedColor.text($symbolColorVar.val());
        // Set value to input field
        $("#symbolColorVar").val($symbolColorVar.val());
      });
    });

    $("#inp_busstop_icon").on("change", function () {
      shuttlebusIcon = $(this).val();
    });

    $("#btn_edit_shuttlebus").on("click", async function () {
      await onClickUpdateShuttleBus();
    });
  } catch (error) {
    console.log(error);
  }
};

const onClickUpdateShuttleBus = async () => {
  try {
    window.customswal.showLoading();

    const bodyRequest = {
      shuttleBus_id: shuttleBusIdVar,
      shuttleBus_name: shortNameVar,
      shuttleBus_subname: subBsname,
      shuttleTHname: shortThname,
      shuttleBus_color: suttlebusColor,
      shuttleBus_time: shuttlesusTime,
      shuttleBus_price: shuttlesusPrice,
      shuttleBus_picture: shuttlebusPicture,
      polylineColor: polylineColorVar,
      symbolColor: symbolColorVar,
      icon_shuttle_bus: shuttlebusIcon,
      detailData: detailDataVar,
    };

    console.log("Request body: ", bodyRequest); // เพิ่มการ log เพื่อดูค่าที่ส่งไป

    const response = await axios.post("api/v1/edit-shuttlebus", bodyRequest);
    console.log("Response: ", response); // เพิ่มการ log เพื่อตรวจสอบการตอบสนองของเซิร์ฟเวอร์

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // window.location.href = "/admin_edit_shuttle_bus";
    window.customswal.hideLoading();
    location.reload();
  } catch (error) {
    console.log("Error: ", error); // เพิ่มการ log เพื่อดูข้อผิดพลาดที่เกิดขึ้น
    switch (error?.response?.data?.error) {
      case "busStopName_is_already_exist":
        window?.customswal?.showErrorAlert("ชื่อจุดจอดซ้ำ");
        break;
      default:
        window?.customswal?.showErrorAlert(error?.response?.data?.error);
        break;
    }
  }
};

const getShuttleBus = async (id) => {
  try {
    window.customswal.showLoading();

    const bodyRequest = {
      route_id: id,
    };

    const response = await axios.post("api/v1/fetch-shuttlebus", bodyRequest);

    if (response?.data?.data[0]) {
      const data = response?.data?.data[0];
      shortNameVar = data?.shuttleBus_name;
      subBsname = data?.shuttleBus_subname;
      shortThname = data?.shuttleTHname;
      suttlebusColor = data?.shuttleBus_color;
      shuttlesusTime = data?.shuttleBus_time;
      shuttlesusPrice = data?.shuttleBus_price;
      shuttlebusPicture = data?.shuttleBus_picture;
      polylineColorVar = data?.polylineColor;
      symbolColorVar = data?.symbolColor;
      shuttlebusIcon = data?.icon_shuttle_bus;
      detailDataVar = data?.detailData;

      $("#inp_shuttle_name").val(shortNameVar);

      $("#inp_busstop_subName").val(subBsname);

      $("#inp_busstop_thName").val(shortThname);

      $("#inp_busstop_color").val(suttlebusColor);

      $("#inp_busstop_time").val(shuttlesusTime);

      $("#inp_busstop_price").val(shuttlesusPrice);

      $("#inp_busstop_picture").on("change", async function () {
        try {
          let formData = new FormData();
          let imagefile = $("#inp_busstop_picture")[0].files[0]; // Select the file using jQuery
          formData.append("image", imagefile); // Append the file to FormData

          // Make the Axios request using async/await
          const response = await window.upload_services.UploadSingleImage(
            formData
          );

          if (response?.data?.data?.url) {
            shuttlebusPicture = response?.data?.data?.url;
            $("#previewImageShuttleBus").attr("src", shuttlebusPicture).show();
          }
        } catch (error) {
          // Handle error
          console.error("Error uploading image:", error);
        }
      });

      $("#inp_busstop_picture").val(shuttlebusPicture);

      $("#inp_busstop_polyline").val(polylineColorVar);

      $("#inp_busstop_symbol").val(symbolColorVar);

      $("#inp_busstop_icon").val(shuttlebusIcon);

      listSelectedRoute();
    }
  } catch (error) {
    console.log(error);
  } finally {
    window.customswal.hideLoading();
  }
};

const initializeSortable = () => {
  let containers = $(".draggable-zone");

  if (containers.length === 0) {
    console.log("Initializing sortable failed");
    return false;
  }

  containers.each(function () {
    new Sortable(this, {
      animation: 150,
      handle: ".draggable-handle",
      onEnd: async function (event) {
        try {
          const startIndex = event.oldIndex;
          const endIndex = event.newIndex;

          const draggedItem = detailDataVar[startIndex];
          detailDataVar.splice(startIndex, 1);
          detailDataVar.splice(endIndex, 0, draggedItem);

          const reportIdsAndSeqs = detailDataVar.map((item, index) => ({
            Road_id: item?.Road_id,
            road_id_increment: index + 1,
          }));

          listSortItem = {
            shuttleBus_id: shuttleBusIdVar,
            data: reportIdsAndSeqs,
          };

          await updateSeqDetailShuttleBus(listSortItem);
        } catch (error) {
          console.log(error);
        }
      },
    });
  });
};

const listSelectedRoute = () => {
  try {
    let contentDiv = "";
    if (Array.isArray(detailDataVar) && detailDataVar.length > 0) {
      detailDataVar.forEach((item) => {
        if (item?.Road_id && item?.busStop_name) {
          contentDiv += `
            <div class="flex justify-between gx-2 p-1 content-center" id="content_detail_var_${item.Road_id}">
              <span class="draggable-handle">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"/>
                </svg>
              </span>
              <h1>${item.busStop_name}</h1>
              <button class="btn-red" id="btn_remove_busStop_id_${item.Road_id}">ลบ</button>
            </div>
          `;
        }
      });
    } else {
      contentDiv = "<p>No data available</p>";
    }
    $("#list_route_this_id").html(contentDiv);

    // Add event listener for remove buttons
    detailDataVar.forEach((item) => {
      if (item?.Road_id) {
        $(`#btn_remove_busStop_id_${item.Road_id}`).on("click", function () {
          // Remove item logic here
          console.log(`Remove button clicked for Road ID: ${item.Road_id}`);
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const getAvailibleBusStop = async () => {
  try {
    let contentDiv = "";
    const response = await axios.post("api/v1/list-bus-stop");
    listRouteAvailible = response?.data?.data;

    const filteredList = listRouteAvailible.filter((item) => {
      return (
        !detailDataVar.some(
          (detail) => detail.busStop_id === item.busStop_id
        ) && !item.busStop_name.endsWith("*")
      );
    });

    filteredList.map((item) => {
      contentDiv += `
        <div class="col-span-2 lg:col-span-1">
          <button class="btn-main w-full h-full" id="bus_stop_${item?.busStop_id}">${item?.busStop_name}</button>
        </div>
      `;
    });

    $("#list_availible_route").html(contentDiv);
  } catch (error) {
    console.log(error);
  }
};

const getAvailibleBusStop1 = async () => {
  try {
    let contentDiv = "";
    const response = await axios.post("api/v1/list-bus-stop");
    listRouteAvailible1 = response?.data?.data;

    const filteredList1 = listRouteAvailible1.filter((item) => {
      return (
        !detailDataVar.some(
          (detail) => detail.busStop_id === item.busStop_id
        ) && item.busStop_name.endsWith("*")
      );
    });

    filteredList1.map((item) => {
      contentDiv += `
        <div class="col-span-2 lg:col-span-1">
          <button class="btn-main w-full h-full" id="bus_stop_${item?.busStop_id}">${item?.busStop_name}</button>
        </div>
      `;
    });

    $("#list_availible_route1").html(contentDiv);
  } catch (error) {
    console.log(error);
  }
};

const initButtonROute = () => {
  
  try {
    
    listRouteAvailible.forEach((item) => {
      $(`#bus_stop_${item?.busStop_id}`).on("click", () => {
        if (
          !detailDataVar.some((detail) => detail.busStop_id === item.busStop_id)
        ) {
          const bodyToAppend = {
            busStop_id: item?.busStop_id,
            busStop_name: item?.busStop_name,
            busStop_latitude: item?.busStop_latitude,
            busStop_longitude: item?.busStop_longitude,
            busStop_picture: item?.busStop_picture,
            busStop_subname: item?.busStop_subname,
          };

          $(`#bus_stop_${item?.busStop_id}`).attr("disabled", true);
          detailDataVar.push(bodyToAppend);
          listSelectedRoute();
        }
      });
    });

    listRouteAvailible1.forEach((item) => {
      $(`#bus_stop_${item?.busStop_id}`).on("click", () => {
        if (
          !detailDataVar.some((detail) => detail.busStop_id === item.busStop_id)
        ) {
          const bodyToAppend = {
            busStop_id: item?.busStop_id,
            busStop_name: item?.busStop_name,
            busStop_latitude: item?.busStop_latitude,
            busStop_longitude: item?.busStop_longitude,
            busStop_picture: item?.busStop_picture,
            busStop_subname: item?.busStop_subname,
          };

          $(`#bus_stop_${item?.busStop_id}`).attr("disabled", true);
          detailDataVar.push(bodyToAppend);
          listSelectedRoute();
        }
      });
    });

    detailDataVar.forEach((item) => {
      $(`#btn_remove_busStop_id_${item?.Road_id}`).on("click", () => {
        detailDataVar = detailDataVar.filter(
          (i) => i?.Road_id !== item.Road_id
        );
        $(`#content_detail_var_${item?.Road_id}`).remove();
        $(`#bus_stop_${item?.busStop_id}`).attr("disabled", false);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

// Initialize the button routes after loading the available bus stops
getAvailibleBusStop().then(initButtonROute);
getAvailibleBusStop1().then(initButtonROute);

const updateSeqDetailShuttleBus = async (body) => {
  try {
    window.customswal.showLoading();

    const response = await axios.post(
      "api/v1/edit-seq-shuttlebus-detail",
      body
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (err) {
    console.log(err);
  } finally {
    window.customswal.hideLoading();
  }
};

//เริ่ม Shuttle
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

  // ประกาศ uuIndices เป็นอาร์เรย์ว่าง
  let uuIndices = [];

  // ลูปเพิ่มหมายเลขจาก 1 ถึง 1000 ลงใน uuIndices
  for (let i = 1; i <= 1000; i++) {
    uuIndices.push(i);
  }

  let arr = [];

  const renderMarkersAndPath = (data, iconSet) => {
    let arr = [];
    $.each(data, function (i, item) {
      let iconUrl;
      let index = i + 1;

      if (index === 1) {
        iconUrl = iconSet.startIcon;
      } else if (index === data.length) {
        iconUrl = iconSet.endIcon; // Use endIcon for the last marker
      } else if (item.busStop_name.endsWith("*")) {
        iconUrl = iconSet.middleIcon; // Use endIcon for markers with names ending with "*"
      } else if (uuIndices.includes(index)) {
        iconUrl = iconSet.makkerIcon;
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


let nameBusStop = "";
let subnameBusStop = "";
let statusnameBusStop = "";
let latitudeVar = 0;
let longitudeVar = 0;
let PicTureVar = "";

const initDomsJS = async () => {
  try {
    // เมื่อมีการเปลี่ยนแปลงในช่องป้อนชื่อป้ายรถเมล์
    $("#inp_busstop_name").on("change", function () {
      nameBusStop = $(this).val();
    });

    $("#inp_busstop_subname").on("change", function () {
      subnameBusStop = $(this).val();
    });

    $("#inp_busstop_status").on("change", function () {
      statusnameBusStop = $(this).val();
    });


    // พิกัดเริ่มต้นของแผนที่
     // แทนที่ด้วยพิกัดเริ่มต้นของคุณ

    // สร้างแผนที่ใหม่
    $(document).ready(function() {
  var initialLatLng = { lat: 16.439755821668168, lng: 102.82750683593747 }; // Example initial position, replace with actual coordinates
  
  var map = new google.maps.Map($('#map')[0], {
    center: initialLatLng,
    zoom: 12 // Adjust as appropriate
  });

  // Create a draggable marker
  var marker = new google.maps.Marker({
    position: initialLatLng,
    map: map,
    draggable: true // Allow marker to be draggable
  });

  // Event listener for when the marker is dragged and dropped
  google.maps.event.addListener(marker, 'dragend', function(event) {
    $('#busStop_latitude').val(event.latLng.lat());
    $('#busStop_longitude').val(event.latLng.lng());
    latitudeVar = event.latLng.lat();
    longitudeVar = event.latLng.lng();
  });

  // When there is a change in the picture input field
  $("#inp_busstop_picture").on("change", async function () {
      try {
        let formData = new FormData();
        let imagefile = $("#inp_busstop_picture")[0].files[0];
        formData.append("image", imagefile);

        const response = await window.upload_services.UploadSingleImage(formData);

        if (response?.data?.data?.url) {
          PicTureVar = response?.data?.data?.url;
          $("#previewImageShuttleBus").attr("src", PicTureVar).show();
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
  });
      
      console.log("asdasdas");


    });
    


    // เมื่อมีการคลิกที่ปุ่มสร้างป้ายรถเมล์
    $("#btn_create_busstops").on("click", async function () {
      await onClickCreateBusstops()
      location.reload();;
      console.log("เริ่มสร้างป้ายรถเมล์");
    });
  } catch (error) {
    console.error(error);
  }
};

// เรียกฟังก์ชันเพื่อเริ่มต้น



let subnameCounter = 1;

const onClickCreateBusstops = async (item) => {
  try {
    window.customswal.showLoading();

    if (nameBusStop === "") {
      window.customswal.hideLoading(); // ปิด loading เมื่อเกิดข้อผิดพลาด
      return showErrorAlert("กรุณากรอก ชื่อจุดจอด");
    }

    if (latitudeVar <= 0 || latitudeVar === "") {
      window.customswal.hideLoading(); // ปิด loading เมื่อเกิดข้อผิดพลาด
      return showErrorAlert("กรุณากรอก ละติจูด");
    }

    if (longitudeVar <= 0 || longitudeVar === "") {
      window.customswal.hideLoading(); // ปิด loading เมื่อเกิดข้อผิดพลาด
      return showErrorAlert("กรุณากรอก ลองจิจูด");
    }

    const bodyRequest = {
      busStop_subname: `bp${subnameCounter}`,
      busStop_status: "จุดผ่าน",
      busStop_name: `${nameBusStop}*`,
      busStop_latitude: latitudeVar,
      busStop_longitude: longitudeVar,
      busStop_picture: PicTureVar
    };

   

          $(`#bus_stop_${item?.busStop_id}`).attr("disabled", true);
          detailDataVar.push(bodyRequest);
          listSelectedRoute();

    // เพิ่มค่า counter สำหรับ busStop_subname
    subnameCounter++;

    const response = await axios.post(
      "api/v1/create-bus-stop",
      bodyRequest
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    window.customswal.hideLoading();
    
  } catch (error) {
    window.customswal.hideLoading(); // ปิด loading เมื่อเกิดข้อผิดพลาด
    console.log(error?.response);
    switch (error?.response?.data?.error) {
      case "busStopName_is_already_exist":
        showErrorAlert("ชื่อจุดจอดซ้ำ");
        break;
      default:
        showErrorAlert(error?.response?.data?.error);
        break;
    }
  }
};


function isInt(n) {
  return typeof n === "number" && Number.isInteger(n);
}

function isFloat(n) {
  return typeof n === "number" && !Number.isInteger(n);
}

function validateFloatInput(input) {
  var value = parseFloat(input.val());
  if (!isNaN(value) && isFloat(value)) {
    return true;
  } else {
    input.val("");
    alert("Please enter a valid float number.");
    return false;
  }
}







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

$(document).ready(async function () {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const routeId = searchParams.get("routeId");
    const id = searchParams.get("id");
    listShuttleBus = await fetchShuttlebusData();

    if (id) {
      console.log(`ID: ${id}`);

      listShuttleBus = await fetchShuttlebusData(); // ดึงข้อมูล

      await initialize(id);
    }

    if (routeId) {
      console.log(`routeId: ${routeId}`);
    } else {
      console.log("routeId parameter is missing");
    }

    listShuttleBus = await fetchShuttlebusData(); // ดึงข้อมูล

    shuttleBusIdVar = searchParams.get("id");
    initDomJS();
    

    await getShuttleBus(shuttleBusIdVar);
    await getAvailibleBusStop();
    await getAvailibleBusStop1();
    initDomsJS();

    initButtonROute();
    initializeSortable();
  } catch (error) {
    console.error("An error occurred:", error);
  }
});
