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
    });
  } catch (error) {
    console.log(error);
  }
};

const onClickCreateBusstop = async () => {
  try {
    showLoading();

    if (nameBusStop === "") {
      hideLoading(); // ปิด loading เมื่อเกิดข้อผิดพลาด
      return showErrorAlert("กรุณากรอก ชื่อจุดจอด");
    }

    if (latitudeVar <= 0 || latitudeVar === "") {
      hideLoading(); // ปิด loading เมื่อเกิดข้อผิดพลาด
      return showErrorAlert("กรุณากรอก ละติจูด");
    }

    if (longitudeVar <= 0 || longitudeVar === "") {
      hideLoading(); // ปิด loading เมื่อเกิดข้อผิดพลาด
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

    hideLoading();
    window.location.href = "/admin_list_bus_stop"; // นำทางไปยังหน้า /admin_list_bus_stop เมื่อสำเร็จ
  } catch (error) {
    hideLoading(); // ปิด loading เมื่อเกิดข้อผิดพลาด
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



const getBusStop = async (id) => {
  try {
    window.customswal.showLoading();

    const bodyRequest = {
      route_id: id,
    };

    const response = await axios.post(
      "api/v1/fetch-shuttlebus",
      bodyRequest
    );

    if (response?.data?.data[0]) {
      const data = response?.data?.data[0];
      shortNameVar = data?.shuttleBus_name;
      shortThname = data?.shuttleTHname;
      suttlebusColor = data?.shuttleBus_color;
      shuttlesusTime = data?.shuttleBus_time;
      shuttlesusPrice = data?.shuttleBus_price;
      shuttlebusPicture = data?.shuttleBus_picture;
      polylineColorVar = data?.polylineColor;
      symbolColorVar = data?.symbolColor;
      shuttlebusIcon = data?.icon_shuttle_bus;
      detailDataVar = data?.detailData;

      $("#inp_shuttle_name").val(shortNameVar);

      $("#inp_busstop_thName").val(shortThname);

      $("#inp_busstop_color").val(suttlebusColor);

      $("#inp_busstop_time").val(shuttlesusTime);

      $("#inp_busstop_price").val(shuttlesusPrice);

      $("#inp_busstop_picture").val(shuttlebusPicture);

      $("#inp_busstop_polyline").val(polylineColorVar);

      $("#inp_busstop_symbol").val(symbolColorVar);

      $("#inp_busstop_icon").val(shuttlebusIcon);

      $("#list_route_this_id").html(contentDiv);
    }
  } catch (error) {
    console.log(error);
  } finally {
    window.customswal.hideLoading();
  }
};