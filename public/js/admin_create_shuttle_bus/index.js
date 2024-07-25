let shortNameVar = "";
let shortThname = "";
let suttlebusColor = "";
let shuttlesusTime = "";
let shuttlesusSubname = "";
let shuttlesusPrice = "";
let shuttlebusPicture = "";
let polylineColorVar = "";
let symbolColorVar = "";
let shuttlesusStatus = "";
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

    $("#inp_busstop_picture").on("change", async function () {
      try {
        let formData = new FormData();
        let imagefile = $("#inp_busstop_picture")[0].files[0]; // Select the file using jQuery
        formData.append("image", imagefile); // Append the file to FormData

        // Make the Axios request using async/await
        const response = await window.upload_services.UploadSingleImage(formData);

        if (response?.data?.data?.url) {
          shuttlebusPicture = response?.data?.data?.url;
          $("#previewImageShuttleBus").attr("src", shuttlebusPicture).show();
        }
      } catch (error) {
        // Handle error
        console.error("Error uploading image:", error);
      }
    });

    $("#inp_busstop_subname").on("change", function () {
      shuttlesusSubname = $(this).val();
    });

    $("#inp_busstop_status").on("change", function () {
      shuttlesusStatus = $(this).val();
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
  } finally {
    window.customswal.hideLoading();
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
      shuttleBus_subname: shuttlesusSubname,
      shuttleBus_price: shuttlesusPrice,
      shuttleBus_picture: shuttlebusPicture,
      polylineColor: $("#polylineColorVar").val(), // รับค่าจาก input ที่มี id ว่า polylineColorVar
      symbolColor: $("#symbolColorVar").val(), // รับค่าจาก input ที่มี id ว่า symbolColorVar
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

  initDomJS();
});
