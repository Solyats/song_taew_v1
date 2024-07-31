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
      confirmButtonText: "ตกลง",
      customClass: { confirmButton: "btn-main" },
    });
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      text: message,
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "ตกลง",
      customClass: { confirmButton: "btn-main" },
    });
};
  
const list_swal = {
    showLoading,
    hideLoading,
    showErrorAlert,
    showSuccessAlert,
};
  
  window.customswal = list_swal;