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
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                  ${item?.shuttleBus_subname}
                  </td>
                  <td class="px-6 py-4">${item?.shuttleBus_name}</td>
                
               
                  <td class="px-6 py-4"><img src="${item?.shuttleBus_picture}" height="15%" width="15%" alt=""></td>
      
                  
                  
                  <td class="px-6 py-4 flex border ">
                    <a
                      href="/admin_edit_road?id=${item?.shuttleBus_id}"
                      class="font-medium ml-2 bg-yellow-500 text-blue-600 dark:text-blue-500 hover:underline"
                      >
                      <svg class="h-8 w-8 text-red-500"  viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  <line x1="16" y1="5" x2="19" y2="8" /></svg>
                      </a
                    > 
                    
                  </td>
                </tr>
            `;
      });

      $("#list_data_bus").html(divContent);

      listDatas.map((item) => {
        $(`#btn_delete_${item?.shuttleBus_id}`).click(function () {
          Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, I want to delete",
            cancelButtonText: "Cancel",
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
};
