let usernameVar = "";
let passwordVar = "";

const initDomJS = async () => {
  try {
    console.log("initDomJS started"); 

    $("#username").on("change", function () {
      usernameVar = $(this).val();
    });
    
    $("#password").on("change", function () {
      passwordVar = $(this).val();
    });

    $("#btn_login").on("click", async function () {
      await onAdminlogin();
    });
  } catch (error) {
    console.log("Initialization error:", error);
  }
};

const onAdminlogin = async () => {
  try {
    const bodyRequest = {
      username: usernameVar,
      password: passwordVar,
    };

    const response = await axios.post(
      "api/v1/login",
      bodyRequest
    );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } 
    
      window.location.href = "/admin_list_shuttle_bus"
  } catch (error) {
  }
};

window.onload = async function () {
  await initDomJS(); 
};
