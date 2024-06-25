let listDatas = [];

const initDataPage = async () => {
  try {
    showLoading()
    const response = await axios.post(
      "http://localhost:5555/api/v1/list-bus-stop"
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response?.data?.data?.length > 0) {
      listDatas = response.data.data;

      $("#list_data_busstop").html("");

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
                    ${item?.busStop_id}
                  </td>
                  <td class="px-6 py-4">${item?.busStop_name}</td>
                  <td class="px-6 py-4">${item?.busStop_latitude}</td>
                  <td class="px-6 py-4">${item?.busStop_longitude}</td>
                  <td class="px-6 py-4">${item?.busStop_picture}</td>
                 
                  <td class="px-6 py-4">
                    <a
                      href="/admin_edit_shuttle_bus?id=${item?.busStop_id}"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >แก้ไข</a
                    >
                    <button
                      id="btn_delete_${item?.busStop_id}"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >ลบ</button
                    >
                  </td>
                </tr>
            `;
      });

      $("#list_data_busstop").html(divContent);

      listDatas.map((item) => {
        $(`#btn_delete_${item?.busStop_id}`).click(function () {
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
                await onDeleteBusStop(item?.busStop_id);
              }
            });
        });
      });
    }
  } catch (err) {
    console.log(err);
  } finally {
    hideLoading()
  }
};

const onDeleteBusStop = async (busStop_id) => {
  try {
    showLoading()

    if (!busStop_id) {
      return showErrorAlert("busStop_id_is_missing")
    }

    const bodyRequest = {
      busStop_id: busStop_id,
    };

    const response = await axios.post(
      "http://localhost:5555/api/v1/delete-bus-stop",
      bodyRequest
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }


    window.location.reload()
  } catch (error) {
    console.log(error)
    showErrorAlert(error)
  } finally {
    hideLoading()
  }
}

const showLoading = () => {
    Swal.fire({
      title: "Loading...",
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const hideLoading = () => {
    Swal.close();
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      text: message,
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Okay, i got it",
      customClass: { confirmButton: "btn btn-primary" },
    });
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      text: message,
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "Okay, i got it",
      customClass: { confirmButton: "btn btn-primary" },
    });
  };

window.onload = async function () {
  await initDataPage();
};
