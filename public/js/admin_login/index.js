let usernameVar = "";
let passwordVar = "";

const initDomJS = async () => {
  try {
    let usernameVar, passwordVar;

    $("#username").on("change", function () {
      usernameVar = $(this).val();
    });

    $("#password").on("change", function () {
      passwordVar = $(this).val();
    });

    $("#btn_login").on("click", async function (event) {
      event.preventDefault();
      await onAdminlogin();
    });
  } catch (error) {
    console.log("Initialization error:", error);
  }
};

const onAdminlogin = async () => {
  try {
    const usernameVar = $("#username").val();
    const passwordVar = $("#password").val();
    $("#error_message_user").text("");
    $("#error_message_password").text("");

    if (!usernameVar) {
      $("#error_message_user").text("กรุณากรอกชื่อผู้ใช้");
      return;
    }

    if (!passwordVar) { 
    }

    window.customswal.showLoading()

    const bodyRequest = {
      username: usernameVar,
      password: passwordVar,
    };

    const response = await axios.post("api/v1/login", bodyRequest);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    window.location.href = "/admin_list_shuttle_bus";
    window.customswal.hideLoading()
  } catch (error) {
    console.log("Login error:", error?.response?.data);
    let ErrorMsg = "เกิดข้อผิดพลาด";

    switch (error?.response?.data?.error) {
      case "invalid_username":
        ErrorMsg = "ไม่พบชื่อผู้ใช้งานนี้ในระบบ";
        break;
      case "invalid_password":
        ErrorMsg = "รหัสผ่านไม่ถูกต้อง";
        break;
      default:
        ErrorMsg = "เกิดข้อผิดพลาด";
    }

    window.customswal.showErrorAlert(ErrorMsg);
  }
};

$(document).ready(function () {
  initDomJS();
});


window.onload = async function () {
  await initDomJS(); 
};
