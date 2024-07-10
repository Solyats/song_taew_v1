let shuttleBusIdVar = "";
let shortNameVar = "";
let subBsname = "";
let shortThname = "";
let suttlebusColor = "";
let shuttlesusTime = "";
let shuttlesusPrice = "";
let shuttlebusPicture = "";
let polylineColorVar = "";
let symbolColorVar = "";
let shuttlebusIcon = "";
let detailDataVar = [];
let listRouteAvailible = [];

const initDomJS = () => {
  try {
    $("#inp_shuttle_name").on("change", function () {
      shortNameVar = $(this).val();
    });

    $("#inp_shuttle_subname").on("change", function () {
      subBsname = $(this).val();
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
        // Set value to input field
        $("#polylineColorVar").val($polylineColorVar.val());
      });

      $symbolColorVar.on("change", function () {
        $selectedColor.text($symbolColorVar.val());
        // Set value to input field
        $("#symbolColorVar").val($symbolColorVar.val());
      });
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
      shuttleBus_subname: subBsname,
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

    const response = await axios.post("api/v1/edit-shuttlebus", bodyRequest);
    console.log("Response: ", response); // เพิ่มการ log เพื่อตรวจสอบการตอบสนองของเซิร์ฟเวอร์

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // window.location.href = "/admin_edit_shuttle_bus";
    window.customswal.hideLoading();
    location.reload();
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

    const response = await axios.post("api/v1/fetch-shuttlebus", bodyRequest);

    if (response?.data?.data[0]) {
      const data = response?.data?.data[0];
      shortNameVar = data?.shuttleBus_name;
      subBsname = data?.shuttleBus_subname;
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

      $("#inp_busstop_subName").val(subBsname);

      $("#inp_busstop_thName").val(shortThname);

      $("#inp_busstop_color").val(suttlebusColor);

      $("#inp_busstop_time").val(shuttlesusTime);

      $("#inp_busstop_price").val(shuttlesusPrice);

      $("#inp_busstop_picture").on("change", async function () {
        try {
          let formData = new FormData();
          let imagefile = $("#inp_busstop_picture")[0].files[0]; // Select the file using jQuery
          formData.append("image", imagefile); // Append the file to FormData

          // Make the Axios request using async/await
          const response = await window.upload_services.UploadSingleImage(
            formData
          );

          if (response?.data?.data?.url) {
            shuttlebusPicture = response?.data?.data?.url;
            $("#previewImageShuttleBus").attr("src", shuttlebusPicture).show();
          }
        } catch (error) {
          // Handle error
          console.error("Error uploading image:", error);
        }
      });

      $("#inp_busstop_picture").val(shuttlebusPicture);

      $("#inp_busstop_polyline").val(polylineColorVar);

      $("#inp_busstop_symbol").val(symbolColorVar);

      $("#inp_busstop_icon").val(shuttlebusIcon);

      listSelectedRoute();
    }
  } catch (error) {
    console.log(error);
  } finally {
    window.customswal.hideLoading();
  }
};

const listSelectedRoute = () => {
  try {
    let contentDiv = "";
    if (detailDataVar?.length > 0) {
      detailDataVar.map((item) => {
        contentDiv += `
          <div class="flex justify-between gx-2 content-center" id="content_detail_var_${item?.Road_id}">
          <span class="draggable-handle">+</span>
           <h1>${item?.busStop_name}</h1>
        <button class="btn-red" id="btn_remove_busStop_id_${item?.Road_id}">ลบ</button>
          </div>
       
          `;
      });
    }

    $("#list_route_this_id").html(contentDiv);
  } catch (error) {
    console.log(error);
  }
};

const getAvailibleBusStop = async () => {
  try {
    let contentDiv = "";

    const response = await axios.post("api/v1/list-bus-stop");

    listRouteAvailible = response?.data?.data;

    const filteredList = listRouteAvailible.filter((item) => {
  return !detailDataVar.some(detail => detail.busStop_id === item.busStop_id);
});

    filteredList.map((item) => {
      contentDiv += `
       <div class="col-span-2 lg:col-span-1">
        <button class="btn-main w-full h-full" id="bus_stop_${item?.busStop_id}">${item?.busStop_name}</button>
      </div>
      `;
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
          busStop_id: item?.busStop_id,
           busStop_name: item?.busStop_name,
          busStop_latitude: item?.busStop_latitude,
          busStop_longitude: item?.busStop_longitude,
          busStop_picture: item?.busStop_picture,
         busStop_subname: item?.busStop_subname,
        };

        $(`#bus_stop_${item?.busStop_id}`).attr("disabled", true);

        detailDataVar.push(bodyToAppend);

        listSelectedRoute()
      });
    });

    detailDataVar.map((item) => {
      $(`#btn_remove_busStop_id_${item?.Road_id}`).on("click", () => {
        detailDataVar = detailDataVar.filter((i) => i?.Road_id != item.Road_id);

        // $(`#content_detail_var_${item?.Road_id}`).remove();

        console.log(detailDataVar);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const initializeSortable = () => {
  let containers = $(".draggable-zone");

  if (containers.length === 0) {
    console.log("Initializing sortable failed");
    return false;
  }

  containers.each(function () {
    new Sortable(this, {
      animation: 150,
      handle: ".draggable-handle",
      onEnd: async function (event) {
        try {
          const startIndex = event.oldIndex;
          const endIndex = event.newIndex;

          const draggedItem = detailDataVar[startIndex];
          detailDataVar.splice(startIndex, 1);
          detailDataVar.splice(endIndex, 0, draggedItem);

          const reportIdsAndSeqs = detailDataVar.map((item, index) => ({
            Road_id: item?.Road_id,
            road_id_increment: index + 1,
          }));

          listSortItem = {
            shuttleBus_id: shuttleBusIdVar,
            data: reportIdsAndSeqs,
          };

          await updateSeqDetailShuttleBus(listSortItem);
        } catch (error) {
          console.log(error);
        }
      },
    });
  });
};

const updateSeqDetailShuttleBus = async (body) => {
  try {
    window.customswal.showLoading();

    const response = await axios.post("api/v1/edit-seq-shuttlebus-detail", body);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (err) {
    console.log(err);
  } finally {
    window.customswal.hideLoading();
  }
};

$(document).ready(async function () {
  const searchParams = new URLSearchParams(window.location.search);

  shuttleBusIdVar = searchParams.get("id");
  initDomJS();
  await getShuttleBus(shuttleBusIdVar);
  await getAvailibleBusStop();
  initButtonROute();
  initializeSortable()
});
