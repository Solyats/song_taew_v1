let nameBusStop = "";
let latitudeVar = 0;
let longitudeVar = 0;
let PicTureVar = "";

const initDomJS = async () => {
  try {
    $("#inp_busstop_name").on("change", function () {
      nameBusStop = $(this).val();
    });

    $("#inp_busStop_latitudee").on("change", function () {
      latitudeVar = $(this).val();
    });

    $("#inp_busStop_longitude").on("change", function () {
      longitudeVar = $(this).val();
    });

    $("#inp_busStop_picture").on("change", function () {
      PicTureVar = $(this).val();
    });
  } catch (error) {
    console.log(error);
  }
};

const onClickUpdateBusStop = async () => {
  try {
    window.customswal.showLoading();

    const bodyRequest = {
      busStop_name: nameBusStop,
      busStop_latitude: latitudeVar,
      busStop_longitude: longitudeVar,
      busStop_picture: PicTureVar,
    };

    console.log("Request body: ", bodyRequest); // Log to see the request body

    const response = await axios.post("api/v1/create-bus-stop", bodyRequest);
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

    const response = await axios.post("api/v1/get-bus-stop", bodyRequest);

    if (response?.data) {
      const data = response?.data?.data;
      nameBusStop = data?.busStop_name;
      latitudeVar = data?.busStop_latitude;
      longitudeVar = data?.busStop_longitude;
      PicTureVar = data?.busStop_picture;

      $("#inp_busStop_name").val(nameBusStop);
      $("#inp_busStop_latitudee").val(latitudeVar);
      $("#inp_busStop_longitude").val(longitudeVar);
      $("#inp_busStop_picture").val(PicTureVar);
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
