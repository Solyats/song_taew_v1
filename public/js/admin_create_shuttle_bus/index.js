let shortNameVar = "";

const initDomJs = () => {
  try {
    $("#inpt_short_name").on("change", function () {
      shortNameVar = $(this).val();
    });
  } catch (error) {
    console.log(error);
  }
};

window.onload = async function () {};
