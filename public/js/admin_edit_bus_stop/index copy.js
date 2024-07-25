let nameBusStop = "";
let subnameBusStop ="";
let latitudeVar = 0;
let longitudeVar = 0;
let PicTureVar = "";

const initDomJS = async () => {
  try {
    // เมื่อมีการเปลี่ยนแปลงในช่องป้อนชื่อป้ายรถเมล์
    $("#inp_busstop_name").on("change", function () {
      nameBusStop = $(this).val();
    });

    $("#inp_busstop_subname").on("change", function () {
      subnameBusStop = $(this).val();
    });


    // พิกัดเริ่มต้นของแผนที่
     // แทนที่ด้วยพิกัดเริ่มต้นของคุณ

    // สร้างแผนที่ใหม่
    $(document).ready(function() {
  var initialLatLng = { latitudeVar, longitudeVar }; // Example initial position, replace with actual coordinates
  
  var map = new google.maps.Map($('#map_edit')[0], {
    center: initialLatLng,
    zoom: 12 // Adjust as appropriate
  });
      console.log(aaa);

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
  $('#inp_PicTure').on('change', function() {
    PicTureVar = $(this).val();
  });
});


    // เมื่อมีการคลิกที่ปุ่มสร้างป้ายรถเมล์
    $("#btn_update_busstop").on("click", async function () {
      await onClickUpdateBusStop();
      console.log("เริ่มสร้างป้ายรถเมล์");
    });
  } catch (error) {
    console.error(error);
  }
};


const onClickUpdateBusStop = async () => {
  try {
    window.customswal.showLoading();

    const bodyRequest = {
      busStop_name: nameBusStop,
      busStop_subname: subnameBusStop,
      busStop_status: statusnameBusStop,
      busStop_latitude: latitudeVar,
      busStop_longitude: longitudeVar,
      busStop_picture: PicTureVar,
    };

    console.log("Request body: ", bodyRequest); // Log to see the request body

    const response = await axios.post("api/v1/edit-bus-stop", bodyRequest);
    console.log("Response: ", response); // Log to see the server response

    window.location.href = "/admin_list_shuttle_bus";
  } catch (error) {
    console.log("Error: ", error); // Log to see the error
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

const getBusStop = async (id) => {
  try {
    window.customswal.showLoading();

    const bodyRequest = {
      busStop_id: id,
    };

    const response = await axios.post("api/v1/edit-bus-stop", bodyRequest);

    if (response?.data) {
      const data = response?.data?.data;
      nameBusStop = data?.busStop_name;
      subnameBusStop = data?.busStop_subname;
      latitudeVar = data?.busStop_latitude;
      longitudeVar = data?.busStop_longitude;
      PicTureVar = data?.busStop_picture;

      $("#inp_busstop_name").val(nameBusStop);
      $("#inp_busstop_subname").val(subnameBusStop);
      $("#busStop_latitude").val(latitudeVar);
      $("#busStop_longitude").val(longitudeVar);
      $("#inp_PicTure").val(PicTureVar);
    }
  } catch (error) {
    console.log(error);
  } finally {
    window.customswal.hideLoading();
  }
};

// Initialize DOM elements

$(document).ready(async () => {
  const searchParams = new URLSearchParams(window.location.search);
  busStopIdVar = searchParams.get("id");
  initDomJS();
  await getBusStop(busStopIdVar);
});
