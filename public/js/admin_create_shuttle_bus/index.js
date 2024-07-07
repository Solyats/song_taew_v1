let shortNameVar = "";
let shortThname = "";
let suttlebusColor = "";
let shuttlesusTime = "";
let shuttlesusPrice = "";
let shuttlebusPicture = "";
let polylineColorVar = "";
let symbolColorVar = "";
let shuttlebusIcon = "";

const initDomJS = () => {
  try {
    $("#inp_shuttle_name").on("change", function () {
      shortNameVar = $(this).val();
    });

    $("#inp_busstop_thName").on("change", function () {
      shortThname = $(this).val();
    });

    $("#inp_busstop_color").on("change", function () {
      suttlebusColor = $(this).val();
    });

    $("#inp_busstop_time").on("change", function () {
      shuttlesusTime = $(this).val();
    });

    $("#inp_busstop_price").on("change", function () {
      shuttlesusPrice = $(this).val();
    });

    $("#inp_busstop_picture").on("change", function () {
      shuttlebusPicture = $(this).val();
    });

    $(document).ready(function () {
      const $polylineColorVar = $("#polylineColorVar");
      const $symbolColorVar = $("#symbolColorVar");
      const $selectedColorpoly = $("#selectedColorpoly");
      const $selectedColor = $("#selectedColor");

      $polylineColorVar.on("change", function () {
        $selectedColorpoly.text($polylineColorVar.val());
      });

      $symbolColorVar.on("change", function () {
        $selectedColor.text($symbolColorVar.val());
      });
    });

    $("#inp_busstop_icon").on("change", function () {
      shuttlebusIcon = $(this).val();
    });

    $("#btn_create_shuttlebus").on("click", async function () {
      console.log("Hello kuy");
      await onClickCreateShuttleBus();
    });
  } catch (error) {
    console.log(error);
  }
};

const onClickCreateShuttleBus = async () => {
  try {
    window.customswal.showLoading();

    const bodyRequest = {
      shuttleBus_name: shortNameVar,
      shuttleTHname: shortThname,
      shuttleBus_color: suttlebusColor,
      shuttleBus_time: shuttlesusTime,
      shuttleBus_price: shuttlesusPrice,
      shuttleBus_picture: shuttlebusPicture,
      polylineColor: polylineColorVar,
      symbolColor: symbolColorVar,
      icon_shuttle_bus: shuttlebusIcon,
    };

    console.log("Request body: ", bodyRequest); // เพิ่มการ log เพื่อดูค่าที่ส่งไป

    const response = await axios.post("api/v1/create-shuttlebus", bodyRequest);
    console.log("Response: ", response); // เพิ่มการ log เพื่อตรวจสอบการตอบสนองของเซิร์ฟเวอร์

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    window.location.href = "/admin_list_shuttle_bus";
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

$(document).ready(async function () {
  initDomJS();
});
