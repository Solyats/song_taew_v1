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
  var initialLatLng = { lat: 16.447, lng: 102.833 }; // Example initial position, replace with actual coordinates
  
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
  $('#inp_PicTure').on('change', function() {
    PicTureVar = $(this).val();
  });
});


    // เมื่อมีการคลิกที่ปุ่มสร้างป้ายรถเมล์
    $("#btn_create_busstop").on("click", async function () {
      await onClickCreateBusstop();
      console.log("เริ่มสร้างป้ายรถเมล์");
    });
  } catch (error) {
    console.error(error);
  }
};

// เรียกฟังก์ชันเพื่อเริ่มต้น



const onClickCreateBusstop = async () => {
  try {
    window.customswal.showLoading();

    if (  nameBusStop === "") {
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
      busStop_name: nameBusStop,
      busStop_subname: subnameBusStop,
      busStop_latitude: latitudeVar,
      busStop_longitude: longitudeVar,
      busStop_picture: PicTureVar,
    };

    const response = await axios.post(
      "api/v1/create-bus-stop",
      bodyRequest
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    window.customswal.hideLoading();
    window.location.href = "/admin_list_bus_stop"; // นำทางไปยังหน้า /admin_list_bus_stop เมื่อสำเร็จ
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


window.onload = async function () {
  console.log("Initializing DOM...");
  await initDomJS();
};

