let listDatas = [];
let listSortItem = {};

const initDataPage = async () => {
  try {
    window.customswal.showLoading();
    const response = await axios.post("api/v1/fetch-shuttlebus");

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.data.data.length > 0) {
      listDatas = response.data.data;

      $("#list_data_bus").html("");

      let divContent = null;

      listDatas.map((item) => {
        divContent += `
            <tr
                  class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td
                    
                    class="draggable-handle"
                  >
                  +
                  </td>
                  <td
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                  ${item?.shuttleBus_subname}
                  </td>
                  <td class="px-6 py-4">${item?.shuttleBus_name}</td>
                
                  <td class="px-6 py-4">${item?.shuttleTHname}</td>
                  <td class="px-6 py-4">${item?.shuttleBus_color}</td>
                  <td class="px-6 py-4">${item?.shuttleBus_time}</td>
                  <td class="px-6 py-4">${item?.shuttleBus_price}</td>
                  <td class="px-6 py-4"><img src="${item?.shuttleBus_picture}" height="50%" width="50%" alt=""></td>
                  <td class="px-6 ml-2 py-4" style="background-color:${item?.polylineColor};"></td>
                  <td class="px-6 ml-2 py-4" style="background-color:${item?.symbolColor};"></td>
                  
                  
                  <td class="px-6 py-4 flex border ">
                    <a
                      href="/admin_edit_shuttle_bus?id=${item?.shuttleBus_id}"
                      class="font-medium ml-2 bg-red text-blue-600 dark:text-blue-500 hover:underline"
                      >
                      <svg class="h-8 w-8  text-bt-500"  viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  <line x1="16" y1="5" x2="19" y2="8" /></svg>
                      </a
                    > 
                    <button
                      id="btn_delete_${item?.shuttleBus_id}"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      ><svg class="h-8 w-8 text-red-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="4" y1="7" x2="20" y2="7" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" />  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg></button
                    >
                  </td>
                </tr>
            `;
      });
//<td class="px-6 py-4"><img src="${item?.icon_shuttle_bus}"height="30%" width="30%" alt=""></td>
      $("#list_data_bus").html(divContent);

      listDatas.map((item) => {
        $(`#btn_delete_${item?.shuttleBus_id}`).click(function () {
          Swal.fire({
            title: "ลบข้อมูล?",
            text: "ต้องการจะลบข้อมูลหรือไม่?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "ใช่",
            cancelButtonText: "ยกเลิก",
          }).then(async (result) => {
            if (result.isConfirmed) {
              await onDeleteShuttleBus(item?.shuttleBus_id);
            }
          });
        });
      });
    }
  } catch (err) {
    console.log(err);
  } finally {
    window.customswal.hideLoading();
  }
};

const onDeleteShuttleBus = async (shuttleBus_id) => {
  try {
    window.customswal.showLoading();

    if (!shuttleBus_id) {
      return showErrorAlert("shuttleBus_id_is_missing");
    }

    const bodyRequest = {
      shuttleBus_id: shuttleBus_id,
    };

    const response = await axios.post("api/v1/delete-shuttlebus", bodyRequest);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    window.location.reload();
  } catch (error) {
    console.log(error);
    window.customswal.showErrorAlert(error);
  } finally {
    window.customswal.hideLoading();
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

          const draggedItem = listDatas[startIndex];
          listDatas.splice(startIndex, 1);
          listDatas.splice(endIndex, 0, draggedItem);

          const reportIdsAndSeqs = listDatas.map((item, index) => ({
            shuttleBus_id: item.shuttleBus_id,
            seq: index + 1,
          }));

          listSortItem = {
            data: reportIdsAndSeqs,
          };

          await updateSeqShuttleBus(listSortItem);
        } catch (error) {
          console.log(error);
        }
      },
    });
  });
};

const updateSeqShuttleBus = async (body) => {
  try {
    window.customswal.showLoading();

    const response = await axios.post("api/v1/edit-seq-shuttlebus", body);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (err) {
    console.log(err);
  } finally {
    window.customswal.hideLoading();
  }
};

window.onload = async function () {
  await initDataPage();
  initializeSortable();
};
