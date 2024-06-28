let nameBusStop = "";
let latitudeVar = 0;
let longitudeVar = 0;
let PicTureVar = "";

const initDomJS = async () => {
  try {
    $("#inp_busstop_name").on("change", function () {
      nameBusStop = $(this).val();
    });

    $("#inp_latitudeVar").on("change", function () {
      var value = parseFloat($(this).val());
      if (!isNaN(value) && typeof value === "number") {
        latitudeVar = value;
      } else {
        $(this).val("");
        alert("Please enter a valid float number.");
      }
    });

    $("#inp_longitudeVar").on("change", function () {
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
      console.log("sdadasdasdas")
    });
  } catch (error) {
    console.log(error);
  }
};

const onClickCreateBusstop = async () => {
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
      busStop_name: nameBusStop,
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

