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
                  class="odd:bg-white odd:dark:bg-gray-900  even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  
                  <td
                   
                    class="px-6 py-4 font-medium text-gray-900  dark:text-white"
                  >
                  ${item?.shuttleBus_subname}
                  </td>
                  <td class="px-6 py-4">${item?.shuttleBus_name}</td>
                
               
                  <td class="px-6 py-4"><img src="${item?.shuttleBus_picture}" height="15%" width="15%" alt=""></td>
      
                  
                  
                  <td class="px-6 py-4  " style="vertical-align: top;">
                  
                    <a href="/admin_edit_road?id=${item?.shuttleBus_id}"
   class="font-medium ml-2 bg-bt text-black font-bold flex justify-center dark:text-blue-500 hover:bg-yellow-400 hover:text-blue-700 dark:hover:text-blue-400 dark:hover:bg-yellow-600 px-3 py-1 rounded-lg shadow-md transition-all duration-300 hover:underline">
   จัดการเส้นทาง
</a>

                    
                    
                  </td>
                </tr>
            `;
      });

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
