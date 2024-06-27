let shuttleBusIdVar = "";
let shortNameVar = "";
let shortThname = "";
let suttlebusColor = "";
let shuttlesusTime = "";
let shuttlesusPrice = "";
let shuttlebusPicture = "";
let polylineColorVar = "";
let symbolColorVar = "";
let shuttlebusIcon = "";
let detailDataVar = [];
let listRouteAvailible = []

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

    $("#inp_busstop_polyline").on("change", function () {
      polylineColorVar = $(this).val();
    });

    $("#inp_busstop_symbol").on("change", function () {
      symbolColorVar = $(this).val();
    });

    $("#inp_busstop_icon").on("change", function () {
      shuttlebusIcon = $(this).val();
    });

    $("#btn_edit_shuttlebus").on("click", async function () {
      await onClickUpdateShuttleBus();
    });
  } catch (error) {
    console.log(error);
  }
};

const onClickUpdateShuttleBus = async () => {
  try {
    window.customswal.showLoading();

    const bodyRequest = {
      shuttleBus_id: shuttleBusIdVar,
      shuttleBus_name: shortNameVar,
      shuttleTHname: shortThname,
      shuttleBus_color: suttlebusColor,
      shuttleBus_time: shuttlesusTime,
      shuttleBus_price: shuttlesusPrice,
      shuttleBus_picture: shuttlebusPicture,
      polylineColor: polylineColorVar,
      symbolColor: symbolColorVar,
      icon_shuttle_bus: shuttlebusIcon,
      detailData: detailDataVar,
    };

    console.log("Request body: ", bodyRequest); // เพิ่มการ log เพื่อดูค่าที่ส่งไป

    const response = await axios.post(
      "http://localhost:5555/api/v1/edit-shuttlebus",
      bodyRequest
    );
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

const getShuttleBus = async (id) => {
  try {
    window.customswal.showLoading();

    const bodyRequest = {
      route_id: id,
    };

    const response = await axios.post(
      "http://localhost:5555/api/v1/fetch-shuttlebus",
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

      let contentDiv = "";
      if (detailDataVar?.length > 0) {
        detailDataVar.map((item) => {
          contentDiv += `
          <div class="flex gx-2 content-center" id="content_detail_var_${item?.Road_id}">
           <h1>${item?.busStop_name}</h1>
        <button class="btn-red" id="btn_remove_busStop_id_${item?.Road_id}">ลบ</button>
          </div>
       
          `;
        });
      }

      $("#list_route_this_id").html(contentDiv);
    }
  } catch (error) {
    console.log(error);
  } finally {
    window.customswal.hideLoading();
  }
};

const getAvailibleBusStop = async () => {
  try {
    let contentDiv = "";

    const response = await axios.post(
      "http://localhost:5555/api/v1/list-bus-stop"
    );

    listRouteAvailible = response?.data?.data

    listRouteAvailible.map((item) => {
      contentDiv += `
      <div class="col-span-1 lg:col-span-1">
              <button class="btn-main" id="bus_stop_${item?.busStop_id}">${item?.busStop_name}</button>
            </div>
      `
    })

    $("#list_availible_route").html(contentDiv);
  } catch (error) {
    console.log(error);
  }
};

const initButtonROute = () => {
  try {

    listRouteAvailible.map((item) => {
      $(`#bus_stop_${item?.busStop_id}`).on("click", () => {
        const bodyToAppend = {
            Road_id: "",
            shuttleBus_id: shuttleBusIdVar,
            busStop_id: item?.busStop_id
        }

        $(`#bus_stop_${item?.busStop_id}`).remove()

        detailDataVar.push(bodyToAppend)

        console.log(detailDataVar)
      })
    })

    detailDataVar.map((item) => {
      $(`#btn_remove_busStop_id_${item?.Road_id}`).on("click", () => {
        detailDataVar = detailDataVar.filter((i) => i?.Road_id != item.Road_id)

        $(`#content_detail_var_${item?.Road_id}`).remove()
        
        console.log(detailDataVar)
      })
    })

  } catch (error) {
    console.log(error)
  }
}

$(document).ready(async function () {
  const searchParams = new URLSearchParams(window.location.search);

  shuttleBusIdVar = searchParams.get("id");
  initDomJS()
  await getAvailibleBusStop()
  await getShuttleBus(shuttleBusIdVar);
      initButtonROute()
});
