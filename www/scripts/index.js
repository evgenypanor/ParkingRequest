// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

// Initialize your app
var myApp;

// Export selectors engine
var $$;
var dataResults = [];
var viewModel = [];
var currentItemId;
var mainView;


(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    //try {
    //    alert(jQuery);
    //    alert($j);
    //}
    //catch (err) {
    //    alert(err.message);
    //}

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);



        // Initialize your app
        myApp = new Framework7();

        // Export selectors engine
        $$ = Dom7;

        //jq = jQuery.noConflict();

        mainView = myApp.addView('.view-main', {
            // Because we use fixed-through navbar we can enable dynamic navbar
            dynamicNavbar: true
        });


        //device back button support
        document.addEventListener("backbutton", function (e) {
            var page = myApp.getCurrentView().activePage;
            myApp.hidePreloader();
            if (page.name == "index") {
                if (!confirm("Do you want to Exit?")) {

                    //navigator.app.clearHistory();
                    //navigator.app.exitApp();
                    e.preventDefault();
                }
                else {
                    navigator.app.exitApp();
                    //return true;
                    //window.close();
                    //close();
                }
            }
            else {
                mainView.router.back();
                //navigator.app.backHistory();
            }
        }, false);


        myApp.onPageInit('requestsList', function (page) {
            handleLoadStarted();
            LoadTableData();
        });


        myApp.onPageInit('newRequest', function (page) {
            //alert('init');
            handleLoadStarted();
            //alert('before validate');
            try {
                jQuery('#inputContainerForm').validate({ // initialize the plugin
                    rules: {
                        firstName: {
                            required: true
                        }
                    },
                    submitHandler: function (form) {
                        //alert("submitted");
                        UploadData();
                        return false;
                    }
                });
            }
            catch (err) {
                alert(err.message);
            }
            //alert('after validate');
            LoadStreetsData();
        });

        myApp.onPageInit('newRequestSmall', function (page) {
            //alert('init');
            handleLoadStarted();
            //alert('before validate');
            try {
                jQuery('#inputContainerForm').validate({ // initialize the plugin
                    rules: {
                        firstName: {
                            required: true
                        }
                    },
                    submitHandler: function (form) {
                        //alert("submitted");
                        UploadData();
                        return false;
                    }
                });
            }
            catch (err) {
                alert(err.message);
            }
            //alert('after validate');
            LoadStreetsData();
        });


        myApp.onPageInit('viewItem', function (page) {
            //alert('init');

            handleLoadStarted();
            currentItemId = page.query.itmId;
            $$('#deleteItem').on('click', DeleteData);
            $$('#editItem').on('click', EditData);
            LoadSingleItem(page.query.itmId);

        });

        myApp.onPageInit('viewItemSmall', function (page) {
            //alert('init');

            handleLoadStarted();
            currentItemId = page.query.itmId;
            $$('#deleteItem').on('click', DeleteData);
            $$('#editItem').on('click', EditData);
            LoadSingleItem(page.query.itmId);

        });

        myApp.onPageInit('locationPage', function (page) {
            //alert('init');

            handleLoadStarted();

            //$$('#editItem').on('click', EditData);
            Locate();

        });

        myApp.onPageInit('barcodeScannerPage', function (page) {
            $$('#scan').on('click', ScanBarcode);
        });
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

})();

function handleLoadStarted() {
    myApp.showPreloader();
}

function handleLoadFinished() {
    myApp.hidePreloader();
}

function LoadSingleItem(itemId) {
    var tbl = tlvmobClient.getTable("ParkingCharacterDataTBL");
    tbl.where({
        id: itemId
    }).read().done(function (results) {

        //myApp.formFromJSON('#inputContainerForm', results);
        WinJS.UI.processAll().then(function () {
            WinJS.Binding.processAll(document.querySelector("#bindableCore"), results[0])
            .done(function () {
                // processAll is async. You can hook up a then or done handler
            });
        });

        handleLoadFinished();
    }, function (err) {
        alert("Error connecting to azure db : " + err);
        handleLoadFinished();
    });
}

function LoadTableData() {

    var tbl = tlvmobClient.getTable("ParkingCharacterDataTBL");
    tbl.take(50).read().done(function (results) {
        dataResults = results;
        var myList = myApp.virtualList('.request-items-list', {
            // Array with items data
            items: dataResults,
            renderItem: function (index, item) {
                return '<a href="AppPages/ViewItemPage/ViewItemSmall.html?itmId=' + item.id + '" class="item-link"><li class="item-content">' +
                              '<div class="item-inner">' +
                              '<div class="item-title item-title-serachable">' + item.firstname + '&nbsp;' + item.lastname + '</div>' +
                              '<div class="item-title item-title-serachable">' + item.tz + '</div>' +
                          '</div>' +
                       '</li></a>';
            },
            searchAll: function (query, items) {
                var foundItems = [];
                for (var i = 0; i < items.length; i++) {
                    // Check if title contains query string
                    if (items[i].firstnme.indexOf(query.trim()) >= 0 ||
                        items[i].lastname.indexOf(query.trim()) >= 0 ||
                        items[i].tz.indexOf(query.trim()) >= 0) {
                        foundItems.push(i);
                    }
                }
                // Return array with indexes of matched items
                return foundItems;
            }
        });

        var mySearchbar = myApp.searchbar('.searchbar', {
            searchList: '.request-items-list',
            searchIn: '.item-title-serachable'
        });

        handleLoadFinished();

    }, function (err) {
        alert("Error connecting to azure db : " + err);
        handleLoadFinished();
    });
}


function LoadStreetsData() {
    //alert('inside');
    try {
        $$.getJSON('http://mobilewebdb.cloudapp.net/MobileFacade/AnonimousServices.svc/streets', {}, function (data, status, xhr) {
            if (status == '200') {
                viewModel = data.GetStreetsResult;
                getDropDownList('#streetsSelect', viewModel);
            }
            else {
                alert('Error loading data');
            }
            handleLoadFinished();
        });
    }
    catch (err) {
        alert('error ' + err.message);
    }
}

function getDropDownList(id, optionList) {
    var combo = $$(id);

    $$.each(optionList, function (i, el) {
        combo.append("<option value='" + el.label + "'>" + el.label + "</option>");
    });
}


function UploadData() {
    myApp.showPreloader('שומר נתונים...');
    var tbl = tlvmobClient.getTable("ParkingCharacterDataTBL");

    var itm = {};
    itm["firstname"] = jQuery("#firstName").val();
    itm["lastname"] = jQuery("#lastName").val();
    itm["tz"] = jQuery("#tz").val();
    itm["carplate"] = jQuery("#carPlate").val();
    //itm["phoneNum"] = jQuery("#phoneNum").val();
    //itm["additionalPhoneNum"] = jQuery("#additionalPhoneNum").val();
    itm["email"] = jQuery("#email").val();
    //itm["arnona"] = jQuery("#arnona").val();
    itm["address"] = jQuery("#address").text();
    itm["homenum"] = jQuery("#homeNum").val();
    //itm["entrance"] = jQuery("#entrance").val();
    itm["appartments"] = jQuery("#appartments").val();
    //itm["zip"] = jQuery("#zip").val();
    itm["carownership"] = jQuery("input[name=carOwnership]:checked").val();
    itm["imgbase64"] = jQuery("#lisenceImage").attr('src');

    tbl.insert(itm).done(handleSuccess, handleError);
}

function handleSuccess() {
    myApp.hidePreloader();
    myApp.alert('נתונים נשמרו בהצלחה');
    $$('#inputContainerForm')[0].reset();
}

function handleError(error) {
    myApp.hidePreloader();
    var text = error + (error.request ? ' - ' + error.request.status : '');
    myApp.alert(text);
}

function DeleteData() {
    myApp.confirm('האם ברצונך למחוק פריט זה ?', 'מחיקת פריט', function () {
        var tbl = tlvmobClient.getTable("ParkingCharacterDataTBL");
        tbl.del({
            id: currentItemId
        }).done(function () {
            mainView.router.back(
                {
                    url: "AppPages/MainPage/MainPage.html",
                    force: true,
                });
            //mainView.router.reloadPage("AppPages/MainPage/MainPage.html");
        }, function (err) {
            alert("Error: " + err);
        });
    });
}

function EditData() {

}

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


function initializeMap(latitude, longitude) {
    var mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        animation: google.maps.Animation.DROP,
    };

    jQuery("#mapDiv").height(jQuery("#mapDiv").outerWidth());

    var mapVar = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(mapVar);

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: mapVar,
        title: "I'm here!",
        animation: google.maps.Animation.DROP
    });
}

function Locate() {

    navigator.geolocation.getCurrentPosition(function (position) {

        handleLoadFinished();
        initializeMap(position.coords.latitude, position.coords.longitude);


    }, function (error) {
        handleLoadFinished();
        alert("Unable to get location: " + error.message);
    }, {
        maximumAge: 3000, timeout: 10000, enableHighAccuracy: true
    });




}


function ScanBarcode() {
    cordova.plugins.barcodeScanner.scan(
      function (result) {
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      },
      function (error) {
          alert("Scanning failed: " + error);
      },
      {
          "preferFrontCamera": false,
          "showFlipCameraButton": true,
          "prompt": "Place a barcode inside the scan area", // supported on Android only
          "formats": "QR_CODE,PDF_417" // default: all but PDF_417 and RSS_EXPANDED
      }
   );
}
