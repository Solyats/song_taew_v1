let listDatas = [];

const initDataPage = async () => {
  try {
     window.customswal.showLoading()
    const response = await axios.post(
      "http://localhost:5555/api/v1/fetch-shuttlebus"
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.data.data.length > 0) {
        listDatas = response.data.data;
        
        $("#list_data_bus").html("")

        let divContent = null

        listDatas.map((item) => {
            divContent += `
            <tr
                  class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    ${item?.shuttleBus_id}
                  </td>
                  <td class="px-6 py-4">${item?.shuttleBus_name}</td>
                  <td class="px-6 py-4">${item?.shuttleBus_color}</td>
                  <td class="px-6 py-4">${item?.shuttleBus_time}</td>
                  <td class="px-6 py-4">${item?.shuttleBus_price}</td>
                  <td class="px-6 py-4">${item?.shuttleBus_picture}</td>
                  <td class="px-6 py-4">${item?.polylineColor}</td>
                  <td class="px-6 py-4">${item?.symbolColor}</td>
                  <td class="px-6 py-4">${item?.icon_shuttle_bus}</td>
                  <td class="px-6 py-4">
                    <a
                      href="/admin_edit_shuttle_bus?id=${item?.shuttleBus_id}"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >แก้ไข</a
                    >
                  </td>
                </tr>
            `
        })

        $("#list_data_bus").html(divContent)

    }
  } catch (err) {
    console.log(err);
  } finally {
     window.customswal.hideLoading()
  }
};

window.onload = async function () {
  await initDataPage();
};
