

//WinJS.UI.Pages.define("AppPages/MainPage/MainPage.html", {
//    ready: function (element, options) {
//        handleLoadStarted();
//        LoadTableData(element);

//        //handleLoadFinished();
//    },
//    processed: function (element, options) {
//        //handleLoadStarted();
//        //LoadTableData();
//    }
//});

handleLoadStarted();

var dataResults = [];

WinJS.Namespace.define("WinJSCordova.ListView", {
    data: new WinJS.Binding.List(dataResults),
    handlers: {
        itemInvoked: WinJS.UI.eventHandler(ListViewItemPressed),
    }
});


function ListViewItemPressed(eventInfo) {
    var listView = document.querySelector("#listView").winControl;
    listView.selection.getItems().done(function (items) {
        if (items.length > 0) {
            //if (items.lengt)
            //get id of selected item
            //var itemId = items[0].data.id;
            //WinJS.Navigation.navigate("AppPages/ViewItemPage/ViewItem.html", items[0].data);
        }
    });
}

function handleLoadStarted() {
    myApp.showPreloader();
    LoadTableData();
}

function handleLoadFinished() {
    myApp.hidePreloader();
}

function LoadTableData() {

    var tbl = tlvmobileappClient.getTable("ParkingCharacterDataTBL");
    tbl.take(50).read().done(function (results) {
        dataResults = results;

        WinJSCordova.ListView.data.splice(0, WinJSCordova.ListView.data.length);

        dataResults.forEach(function (item) {
            WinJSCordova.ListView.data.push(item);
        });

        WinJS.Binding.processAll(null, WinJSCordova.ListView).done(function () {
            WinJS.UI.processAll().done(function () {
                var listView = document.querySelector("#listView");
                listView.winControl.forceLayout();
                handleLoadFinished();
            });
        });

    }, function (err) {
        alert("Error: " + err);
    });
}