

WinJS.UI.Pages.define("AppPages/NewRequestPage/NewRequest.html", {
    ready: function (element, options) {
        //alert("ready");
        $('#inputContainerForm').validate({ // initialize the plugin
            rules: {
                firstName: {
                    required: true
                },
                lastName: {
                    required: true
                },
                tz: {
                    required: true
                },
                homeNum: {
                    required: true
                }
            },
            submitHandler: function (form) {
                UploadData();
                return false;
            }
        });

        
        var h = $(window).height();
        h = h - 100;
        $('#inputContainerDiv').css('height', h + 'px');

        //$('#inputContainerDiv').each(function () {
        //    var parentHeight = $(this).parent().height();
        //    $(this).height(parentHeight);
        //});
        LoadStreetsData();
    }
});





function CaptureImage() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 40,
        sourceType: Camera.PictureSourceType.CAMERA,
        destinationType: Camera.DestinationType.DATA_URL,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        saveToPhotoAlbum: false
    });
}

function onSuccess(imageURI) {
    var image = document.getElementById('lisenceImage');
    image.src = "data:image/jpeg;base64," + imageURI;
    image.className = "lisenceImageVisible";
}

function onFail(message) {
    alert('Capture failed : ' + message);
}


function LoadStreetsData() {

    $.getJSON("http://tlv-spinfra.cloudapp.net/MobileFacade/AnonimousServices.svc/streets", {})
      .done(function (data) {
          viewModel = data.GetStreetsResult;

          $("#address").autocomplete({
              source: viewModel
          });
      })
      .fail(function (jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          alert(err);
          //console.log("Request Failed: " + err);
      });
}

function UploadData() {

    var contentDialog = document.querySelector("#savingDialog").winControl;
    contentDialog.show();

    var tbl = tlvmobileappClient.getTable("ParkingCharacterDataTBL");
    //var jsonRes = [];
    var itm = {};
    itm["firstName"] = $("#firstName").val();
    itm["lastName"] = $("#lastName").val();
    itm["tz"] = $("#tz").val();
    itm["carPlate"] = $("#carPlate").val();
    itm["phoneNum"] = $("#phoneNum").val();
    itm["additionalPhoneNum"] = $("#additionalPhoneNum").val();
    itm["email"] = $("#useremail").val();
    itm["arnona"] = $("#arnona").val();
    itm["address"] = $("#address").val();
    itm["homeNum"] = $("#homeNum").val();
    itm["entrance"] = $("#entrance").val();
    itm["appartments"] = $("#appartments").val();
    itm["zip"] = $("#zip").val();
    itm["carOwnership"] = $("input[name=carOwnership]:checked").val();
    itm["imgbase64"] = $("#lisenceImage").src;

    //jsonRes.push(itm);
    tbl.insert(itm).done(handleSuccess, handleError);
}

function handleSuccess() {
    var contentDialog = document.querySelector("#savingDialog").winControl;
    contentDialog.hide();
    //clean up form
    var successDialog = document.querySelector("#dataSavedConfirm").winControl;
    successDialog.show();
    $('#inputContainerForm')[0].reset()
}

function handleError(error) {
    var contentDialog = document.querySelector("#savingDialog").winControl;
    contentDialog.hide();
    var text = error + (error.request ? ' - ' + error.request.status : '');
    alert(text);
}


function RadioCahngedHandler() {
    var mode = event.target.value;
    updateCarOwnershipView(mode);
}

function updateCarOwnershipView(mode) {
    switch (mode) {
        case "privateCar":
            clearCarOwners();
            break;
        case "companyCar":
            clearCarOwners();
            setCarOwners("companyCarDiv", "companyCarDivVisible");
            break;
        case "rentalCar":
            clearCarOwners();
            setCarOwners("rentalCarDiv", "carOwnershipVisible");
            break;
        case "ownedByChild":
            clearCarOwners();
            setCarOwners("ownedByChildDiv", "ownedByChildDivVisible");
            break;
    }
}

function clearCarOwners() {
    document.getElementById("companyCarDiv").className = "companyCarDivHidden";
    document.getElementById("rentalCarDiv").className = "rentalCarDivHidden";
    document.getElementById("ownedByChildDiv").className = "ownedByChildDivHidden";
    document.getElementById("carOwnershipContainer").className = "carOwnershipHidden";
    document.getElementById("companyCarDiv").className = "lisenceImageHidden";
    document.getElementById("companyCarDiv").src = "";
}

function setCarOwners(divId, divClassName) {
    document.getElementById(divId).className = divClassName;
    document.getElementById("carOwnershipContainer").className = "carOwnershipVisible";
}