let nameBusStop = "";
let subnameBusStop = "";
let latitudeVar = 0;
let longitudeVar = 0;
let PicTureVar = "";
let statusnameBusStop = "";


const initDomJS = async () => {
  try {
    // เมื่อมีการเปลี่ยนแปลงในช่องป้อนชื่อป้ายรถเมล์
    $("#inp_busStop_name").on("change", function () {
      nameBusStop = $(this).val();
    });

    $("#inp_busStop_subname").on("change", function () {
      subnameBusStop = $(this).val();
    });

    $("#inp_busStop_status").on("change", function () {
      statusnameBusStop = $(this).val();
    });

    // พิกัดเริ่มต้นของแผนที่
    // แทนที่ด้วยพิกัดเริ่มต้นของคุณ

    // สร้างแผนที่ใหม่
    createMap();
     

      // When there is a change in the picture input field
      
    
    $("#inp_PicTure").on("change", async function () {
      try {
        let formData = new FormData();
        let imagefile = $("#inp_PicTure")[0].files[0]; // Select the file using jQuery
        formData.append("image", imagefile); // Append the file to FormData

        // Make the Axios request using async/await
        const response = await window.upload_services.UploadSingleImage(formData);

        if (response?.data?.data?.url) {
          PicTureVar = response?.data?.data?.url;
          $("#previewImageBusStop").attr("src", PicTureVar).show();
        }
      } catch (error) {
        // Handle error
        console.error("Error uploading image:", error);
      }
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


const createMap = async () => {
  try {
    await getBusStop(busStopIdVar); // Fetch bus stop data first

    // Convert latitudeVar and longitudeVar to numbers if necessary
    latitudeVar = parseFloat(latitudeVar);
    longitudeVar = parseFloat(longitudeVar);

    var initialLatLng = { lat: latitudeVar, lng: longitudeVar };

    var map = new google.maps.Map(document.getElementById("map"), {
      center: initialLatLng,
      zoom: 12,
    });

    var marker = new google.maps.Marker({
      position: initialLatLng,
      map: map,
      draggable: true,
    });

    google.maps.event.addListener(marker, "dragend", function (event) {
      $("#inp_busStop_latitude").val(event.latLng.lat());
      $("#inp_busStop_longitude").val(event.latLng.lng());
      latitudeVar = event.latLng.lat();
      longitudeVar = event.latLng.lng();
    });
  } catch (error) {
    console.error(error);
  }
};




const getBusStop = async (id) => {
  try {
    window.customswal.showLoading();


    const bodyRequest = {
      busStop_id: id,
    };

    const response = await axios.post("api/v1/get-bus-stop", bodyRequest);

    if (response?.data) {
      const data = response?.data?.data;
      
      nameBusStop = data?.busStop_name;
      subnameBusStop = data?.busStop_subname;
      statusnameBusStop = data?.busStop_status;
      latitudeVar = data?.busStop_latitude;
      longitudeVar = data?.busStop_longitude;
      PicTureVar = data?.busStop_picture;

      $("#inp_busStop_name").val(nameBusStop);
      $("#inp_busStop_subname").val(subnameBusStop);
      $("#inp_busStop_status").val(statusnameBusStop);
      $("#inp_busStop_latitude").val(latitudeVar);
      $("#inp_busStop_longitude").val(longitudeVar);
      $("#inp_PicTure").val(PicTureVar);
    }
  } catch (error) {
    console.log(error);
  } finally {
    window.customswal.hideLoading();
  }
};

const onClickUpdateBusStop = async () => {
  try {
    window.customswal.showLoading();

    const bodyRequest = {
      busStop_id: busStopIdVar,
      busStop_name: nameBusStop,
      busStop_subname: subnameBusStop,
      busStop_status: statusnameBusStop,
      busStop_latitude: latitudeVar,
      busStop_longitude: longitudeVar,
      busStop_picture: PicTureVar,
    };

   

    await axios.post("api/v1/edit-bus-stop", bodyRequest);
  

    window.location.href = "/admin_list_bus_stop";
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

$(document).ready(async () => {
  const searchParams = new URLSearchParams(window.location.search);
  busStopIdVar = searchParams.get("id");
  initDomJS();
  await getBusStop(busStopIdVar);
  
});
