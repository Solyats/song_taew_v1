let busDatas = [];

const getBussData = async () => {
  try {
    let respData = [];
    const response = await fetch("http://localhost:5555/api/v1/get-bus");
    const JSONData = await response.json();

    if (JSONData?.data.length > 0) {
      respData = JSONData?.data;
    }

    return respData;
  } catch (error) {
    console.log(error);
  }
};

const createAutocomplete = () => {
  let input = $("#autocomplete-input").val().toLowerCase();

  let matches = busDatas.filter(function (item) {
    return item.busStop_name.toLowerCase().includes(input);
  });

  let autocompleteList = $("#autocomplete-list");
  autocompleteList.empty();

  // เพิ่มเงื่อนไขเพื่อตรวจสอบว่ามีการกรองข้อมูลหรือไม่
  if (input !== '' && matches.length > 0) {
    // แสดงรายการ autocomplete-list ถ้ามีการกรองข้อมูลและมีข้อมูลที่ตรงตามเงื่อนไข
    autocompleteList.show(); 
    matches.forEach(function (item) {
      autocompleteList.append(
        `<li id="${item?.busStop_id}" style="cursor: pointer;">${item?.busStop_name}</li>`
      );

      $(`#${item?.busStop_id}`).click(function () {
        $("#autocomplete-input").val($(this).text());
        autocompleteList.hide();
      });
    });
  } else {
    // ซ่อนรายการ autocomplete-list ถ้าไม่มีการกรองข้อมูลหรือไม่มีข้อมูลที่ตรงตามเงื่อนไข
    autocompleteList.hide();
  }
}

const createAutocomplete1 = () => {
  let input = $("#autocomplete-input").val().toLowerCase();

  let matches = busDatas.filter(function (item) {
    return item.busStop_name.toLowerCase().includes(input);
  });

  let autocompleteList = $("#autocomplete-list");
  autocompleteList.empty();

  // เพิ่มเงื่อนไขเพื่อตรวจสอบว่ามีการกรองข้อมูลหรือไม่
  if (input !== '' && matches.length > 0) {
    // แสดงรายการ autocomplete-list ถ้ามีการกรองข้อมูลและมีข้อมูลที่ตรงตามเงื่อนไข
    autocompleteList.show(); 
    matches.forEach(function (item) {
      autocompleteList.append(
        `<li id="${item?.busStop_id}" style="cursor: pointer;">${item?.busStop_name}</li>`
      );

      $(`#${item?.busStop_id}`).click(function () {
        $("#autocomplete-input").val($(this).text());
        autocompleteList.hide();
      });
    });
  } else {
    // ซ่อนรายการ autocomplete-list ถ้าไม่มีการกรองข้อมูลหรือไม่มีข้อมูลที่ตรงตามเงื่อนไข
    autocompleteList.hide();
  }
}

const initPage = async () => {
  try {
    busDatas = await getBussData();

     if (busDatas.length > 0) {
      $("#autocomplete-input").keyup(function () {
        createAutocomplete();
      });
    } else {
      $("#autocomplete-input").prop("disabled", true); 
    }
  } catch (error) {
    console.log(error);
  }
};

$(document).ready(async function () {
  await initPage();
});


// ตัวอย่างการใช้งานใน JavaScript
var button = document.getElementById('button1');
button.addEventListener('click', function() {
  // กระบวนการที่ต้องการทำเมื่อคลิกปุ่ม
  console.log('Button clicked!');
});
