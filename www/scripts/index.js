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

(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    try {
        alert(jQuery);
        alert($j);
    }
    catch (err) {
        alert(err.message);
    }

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.

        // Initialize your app
        myApp = new Framework7();

        try
        {
            alert(jQuery);
        }
        catch(err)
        {
            alert(err.message);
        }


        // Export selectors engine
        $$ = Dom7;

        //jq = jQuery.noConflict();

        var mainView = myApp.addView('.view-main', {
            // Because we use fixed-through navbar we can enable dynamic navbar
            dynamicNavbar: true
        });


        //$$(document).on('pageInit', function (e) {
        //    // Get page data from event data
        //    var page = e.detail.page;
        //    if(page.name == 'requestsList')
        //    {
        //        //handleLoadStarted();
        //        //LoadTableData();
        //    }

        //})

        myApp.onPageInit('requestsList', function (page) {
            handleLoadStarted();
            LoadTableData();
        });


        myApp.onPageInit('newRequest', function (page) {
            //alert('init');
            handleLoadStarted();
            //alert('before validate');
            //$$('#inputContainerForm').validate({ // initialize the plugin
            //    rules: {
            //        firstName: {
            //            required: true
            //        }
            //    },
            //    submitHandler: function (form) {
            //        UploadData();
            //        return false;
            //    }
            //});
            //alert('after validate');
            LoadStreetsData();
        });

        myApp.onPageInit('viewItem', function (page) {
            //alert('init');
            
            handleLoadStarted();
            LoadSingleItem(page.query.itmId);

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
    var tbl = tlvmobileappClient.getTable("ParkingCharacterDataTBL");
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

    var tbl = tlvmobileappClient.getTable("ParkingCharacterDataTBL");
    tbl.take(50).read().done(function (results) {
        dataResults = results;
        var myList = myApp.virtualList('.request-items-list', {
            // Array with items data
            items: dataResults,
            renderItem: function (index, item) {
                return '<a href="AppPages/ViewItemPage/ViewItem.html?itmId=' + item.id + '" class="item-link"><li class="item-content">' +
                          '<div class="item-media"><img src="' + item.imgbase64 + '"></div>' +
                          '<div class="item-inner">' +
                              '<div class="item-title item-title-serachable">' + item.firstName + '&nbsp;' + item.lastName + '</div>' +
                              '<div class="item-title item-title-serachable">' + item.tz + '</div>' +
                          '</div>' +
                       '</li></a>';
            },
            searchAll: function (query, items) {
                var foundItems = [];
                for (var i = 0; i < items.length; i++) {
                    // Check if title contains query string
                    if (items[i].firstName.indexOf(query.trim()) >= 0 ||
                        items[i].lastName.indexOf(query.trim()) >= 0 ||
                        items[i].tz.indexOf(query.trim()) >= 0) {
                        foundItems.push(i);
                    }
                }
                // Return array with indexes of matched items
                return foundItems;
            }
            //// Template 7 template to render each item
            //template: '<li class="item-content">' +
            //              '<div class="item-media"><img src="{{imgbase64}}"></div>' +
            //              '<div class="item-inner">' +
            //                  '<div class="item-title">{{firstName}}&nbsp;{{lastName}}</div>' +
            //                  '<div class="item-title">{{tz}}</div>' +
            //              '</div>' +
            //           '</li>'
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
    try
    {
        $$.getJSON('http://tlv-spinfra.cloudapp.net/MobileFacade/AnonimousServices.svc/streets', {}, function (data, status, xhr)
        {
            if(status == '200')
            {
                viewModel = data.GetStreetsResult;
                getDropDownList('#streetsSelect', viewModel);
            }
            else
            {
                alert('Error loading data');
            }
            handleLoadFinished();
        });
        //$$.getJSON('http://tlv-spinfra.cloudapp.net/MobileFacade/AnonimousServices.svc/streets', {})
        //  .done(function (data) {
        //      alert('data loaded');
        //      viewModel = data.GetStreetsResult;
        //      getDropDownList('#streetsSelect', viewModel);
        //      alert('options created');
        //      //
        //      //$$("#address").autocomplete({
        //      //    source: viewModel
        //      //});

        //      handleLoadFinished();
        //  })
        //  .fail(function ($$xhr, textStatus, error) {
        //      var err = textStatus + ", " + error;
        //      alert(err);
        //      handleLoadFinished();
        //  });
    }
    catch(err)
    {
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

    var tbl = tlvmobileappClient.getTable("ParkingCharacterDataTBL");
    //var jsonRes = [];
    var itm = {};
    itm["firstName"] = $$("#firstName").val();
    itm["lastName"] = $$("#lastName").val();
    itm["tz"] = $$("#tz").val();
    itm["carPlate"] = $$("#carPlate").val();
    itm["phoneNum"] = $$("#phoneNum").val();
    itm["additionalPhoneNum"] = $$("#additionalPhoneNum").val();
    itm["email"] = $$("#useremail").val();
    itm["arnona"] = $$("#arnona").val();
    itm["address"] = $$("#address").val();
    itm["homeNum"] = $$("#homeNum").val();
    itm["entrance"] = $$("#entrance").val();
    itm["appartments"] = $$("#appartments").val();
    itm["zip"] = $$("#zip").val();
    itm["carOwnership"] = $$("input[name=carOwnership]:checked").val();
    itm["imgbase64"] = $$("#lisenceImage").src;

    //jsonRes.push(itm);
    tbl.insert(itm).done(handleSuccess, handleError);
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