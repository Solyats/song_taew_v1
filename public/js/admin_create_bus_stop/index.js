let nameBusStop = "";
let latitudeVar = 0;
let longitudeVar = 0;
let PicTureVar = "";

const initDomJS = async () => {
  try {
    $("#inp_busstop_name").on("change", function () {
      nameBusStop = $(this).val();
    });

    $("#inp_latitudeVar").on("change", function (event) {
      var value = parseFloat($(this).val());
      if (!isNaN(value) && typeof value === "number") {
        latitudeVar = value;
      } else {
        $(this).val("");
        alert("Please enter a valid float number.");
      }
    });

    $("#inp_longitudeVar").on("change", function (event) {
      var value = parseFloat($(this).val());
      if (!isNaN(value) && typeof value === "number") {
        longitudeVar = value;
      } else {
        $(this).val("");
        alert("Please enter a valid float number.");
      }
    });

    $("#inp_PicTure").on("change", function () {
      PicTureVar = $(this).val();
    });

    $("#btn_create_busstop").on("click", async function () {
      await onClickCreateBusstop();
    });
  } catch (error) {
    console.log(error);
  }
};

const onClickCreateBusstop = async () => {
  try {
    showLoading();

    if (nameBusStop === "") {
      return showErrorAlert("กรุณากรอก ชื่อจุดจอด");
    }

    if (latitudeVar <= 0 || latitudeVar === "") {
      return showErrorAlert("กรุณากรอก ละติจูด");
    }

    if (longitudeVar <= 0 || longitudeVar === "") {
      return showErrorAlert("กรุณากรอก ลองจิจูด");
    }

    const bodyRequest = {
      busStop_name: nameBusStop,
      busStop_latitude: latitudeVar,
      busStop_longitude: longitudeVar,
      busStop_picture: PicTureVar,
    };

    const response = await axios.post(
      "http://localhost:5555/api/v1/create-bus-stop",
      bodyRequest
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    window.location.href = "/admin_list_bus_stop";
  } catch (error) {
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

const showLoading = () => {
  Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    showCancelButton: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading();
    },
  });
};

const hideLoading = () => {
  Swal.close();
};

const showErrorAlert = (message) => {
  Swal.fire({
    text: message,
    icon: "error",
    buttonsStyling: false,
    confirmButtonText: "Okay, i got it",
    customClass: { confirmButton: "btn-main" },
  });
};

const showSuccessAlert = (message) => {
  Swal.fire({
    text: message,
    icon: "success",
    buttonsStyling: false,
    confirmButtonText: "Okay, i got it",
    customClass: { confirmButton: "btn-main" },
  });
};

window.onload = async function () {
  initDomJS();
};
