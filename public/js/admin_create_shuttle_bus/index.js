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

    // Update the event listener for inp_busstop_time
    $("#inp_busstop_time").on("change", function () {
      shuttlesusTime = $(this).val();
    });

    $("#inp_busstop_price").on("change", function () {
      shuttlesusPrice = $(this).val();
    });

    $("#inp_busstop_picture").on("change", async function () {
      try {
        let formData = new FormData();
        let imagefile = $("#inp_busstop_picture")[0].files[0]; 
        formData.append("image", imagefile); 

        const response = await window.upload_services.UploadSingleImage(formData);

        if (response?.data?.data?.url) {
          shuttlebusPicture = response?.data?.data?.url;
          $("#previewImageShuttleBus").attr("src", shuttlebusPicture).show();
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    });

    $("#inp_busstop_subname").on("change", function () {
      shuttlesusSubname = $(this).val();
    });

    $("#inp_busstop_status").on("change", function () {
      shuttlesusStatus = $(this).val();
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
      shuttleBus_time: shuttlesusTime, // Ensure this value is correct
      shuttleBus_subname: shuttlesusSubname,
      shuttleBus_price: shuttlesusPrice,
      shuttleBus_picture: shuttlebusPicture,
      polylineColor: $("#polylineColorVar").val(), 
      symbolColor: $("#symbolColorVar").val(),
      icon_shuttle_bus: shuttlebusIcon,
    };

    // Check for missing required fields
    const requiredFields = [
      { field: 'shuttleBus_name', value: bodyRequest.shuttleBus_name, message: 'กรุณากรอกชื่อสายรถ' },
      { field: 'shuttleTHname', value: bodyRequest.shuttleTHname, message: 'หมายเลขสายรถ' },
      { field: 'shuttleBus_color', value: bodyRequest.shuttleBus_color, message: 'กรุณาเลือกสีรถ' },
      { field: 'shuttleBus_time', value: bodyRequest.shuttleBus_time, message: 'กรุณากรอกเวลาทำการ' },
      { field: 'shuttleBus_subname', value: bodyRequest.shuttleBus_subname, message: 'กรุณากรอกรหัสรถ' },
      { field: 'shuttleBus_price', value: bodyRequest.shuttleBus_price, message: 'กรุณากรอกค่าบริการ' },
      { field: 'shuttleBus_picture', value: bodyRequest.shuttleBus_picture, message: 'กรุณาอัปโหลดรูปรถ' },
      { field: 'polylineColor', value: bodyRequest.polylineColor, message: 'กรุณาเลือกสีเส้นรถ' },
      { field: 'symbolColor', value: bodyRequest.symbolColor, message: 'กรุณาเลือกสีสัญลักษณ์' },
    ];

    for (const { field, value, message } of requiredFields) {
      if (!value) {
        window.customswal.showErrorAlert(message);
        return;
      }
    }

    console.log("Request body: ", bodyRequest); 

    const response = await axios.post("api/v1/create-shuttlebus", bodyRequest);
    console.log("Response: ", response); 

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    window.location.href = "/admin_list_shuttle_bus";
  } catch (error) {
    console.log("Error: ", error); 
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

    $("#polylineColorVar").val($polylineColorVar.val());
  });

  $symbolColorVar.on("change", function () {
    $selectedColor.text($symbolColorVar.val());

    $("#symbolColorVar").val($symbolColorVar.val());
  });

  initDomJS();
});
