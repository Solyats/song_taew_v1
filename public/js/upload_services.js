const UploadSingleImage = async (formData) => {
  try {
    window.customswal.showLoading();
    const response = await axios.post("api/v1/upload-single-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  } finally {
    window.customswal.hideLoading();
  }
};

const list_services = {
    UploadSingleImage
};
  
  window.upload_services = list_services;