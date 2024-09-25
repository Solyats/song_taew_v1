let nameBusStop = "";
let subnameBusStop = "";
let statusnameBusStop = "";
let latitudeVar = 0;
let longitudeVar = 0;
let PicTureVar = "";

const initDomsJS = async () => {
  try {
    $("#inp_busstop_name").on("change", function () {
      nameBusStop = $(this).val();
    });

    $("#inp_busstop_subname").on("change", function () {
      subnameBusStop = $(this).val();
    });

    $("#inp_busstop_status").on("change", function () {
      statusnameBusStop = $(this).val();
    });
    $(document).ready(function() {
      var initialLatLng = { lat: 16.439755821668168, lng: 102.82750683593747 }; 
      
      // Set the height of the map to 400px
      $('#map').css('height', '400px');

      var map = new google.maps.Map($('#map')[0], {
        center: initialLatLng,
        zoom: 12
      });
      var marker = new google.maps.Marker({ 
        position: initialLatLng,
        map: map,
        draggable: true 
      });
      google.maps.event.addListener(marker, 'dragend', function(event) {
        $('#busStop_latitude').val(event.latLng.lat());
        $('#busStop_longitude').val(event.latLng.lng());
        latitudeVar = event.latLng.lat();
        longitudeVar = event.latLng.lng();
      });
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
    $("#btn_create_busstop").on("click", async function () {
      await onClickCreateBusstop();
      console.log("เริ่มสร้างป้ายรถเมล์");
    });
  } catch (error) {
    console.error(error);
  }
};
const onClickCreateBusstop = async () => {
  try {
    window.customswal.showLoading();

    if (nameBusStop === "") {
      window.customswal.hideLoading();
      return showErrorAlert("กรุณากรอก ชื่อจุดจอด");
    }

    if (subnameBusStop === "") {
      window.customswal.hideLoading();
      return showErrorAlert("กรุณากรอก ชื่อรอง");
    }

    if (statusnameBusStop === "") {
      window.customswal.hideLoading();
      return showErrorAlert("กรุณาเลือก สถานะ");
    }

    if (latitudeVar <= 0 || latitudeVar === "") {
      window.customswal.hideLoading();
      return showErrorAlert("กรุณากรอก ละติจูด");
    }

    if (longitudeVar <= 0 || longitudeVar === "") {
      window.customswal.hideLoading();
      return showErrorAlert("กรุณากรอก ลองจิจูด");
    }

    if (PicTureVar === "") {
      window.customswal.hideLoading();
      return showErrorAlert("กรุณาอัพโหลดรูปภาพ");
    }

    const bodyRequest = {
      busStop_name: nameBusStop,
      busStop_subname: subnameBusStop,
      busStop_status: statusnameBusStop,
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
  await initDomsJS();
};
