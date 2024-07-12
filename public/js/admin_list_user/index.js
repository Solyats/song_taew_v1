const initDataPage = async () => {
  try {
    window.customswal.showLoading();
    const response = await axios.post("api/v1/list-user");

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.data.data.length > 0) {
      listDatas = response.data.data;

     

      let divContent = '';

      listDatas.map((item) => {
        divContent += `
          <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
              ${item?.username}
            </td>
            <td class="px-6 py-4">${item?.role}</td>
            <td class="px-6 py-4"><img src="${item?.shuttleBus_picture}" height="15%" width="15%" alt=""></td>
            <td class="px-6 py-4" style="vertical-align: top;">
              
            </td>
          </tr>
        `;
      });

      $("#list_data_user").html(divContent);

     
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
