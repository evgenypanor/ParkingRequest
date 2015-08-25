
var bindingDataObject;
WinJS.UI.Pages.define("AppPages/ViewItemPage/ViewItem.html", {
    ready: function (element, options) {
        //alert("ready");
        //handleLoadStarted();
        bindingDataObject = options;
        LoadItemData(options);
        WinJS.UI.processAll().done(function ()
        {
            var contentDialog = document.querySelector("#deleteConfirmDialog").winControl;
            contentDialog.addEventListener("beforehide", dialogHidingHandler, false);
            var h = $(window).height();
            h = h - 100;
            $('#inputContainerDiv').css('height', h + 'px');
        });
    }
});

function dialogHidingHandler(evenObject) {
    if (evenObject.detail.result === WinJS.UI.ContentDialog.DismissalResult.primary) {
        deleteData();
    }
}


function deleteData() {
    var tbl = tlvmobileappClient.getTable("ParkingCharacterDataTBL");
    tbl.del({
        id: bindingDataObject.id
    }).done(function () {
        WinJS.Navigation.navigate("AppPages/MainPage/MainPage.html");
    }, function (err) {
        alert("Error: " + err);
    });
}


WinJS.Namespace.define("WinJSCordova.ToolBar", {
    outputCommand: WinJS.UI.eventHandler(function (ev) {
        var command = ev.currentTarget;
        if (command.winControl) {
            switch (command.winControl.id) {
                case "cmdEdit":

                    break;
                case "cmdDelete":
                    var contentDialog = document.querySelector("#deleteConfirmDialog").winControl;
                    contentDialog.show();
                    break;
            }
        }
    })
});

function LoadItemData(bindingSource) {
    WinJS.UI.processAll().then(function () {
        WinJS.Binding.processAll(document.querySelector("#bindableCore"), bindingSource)
        .done(function () {
            // processAll is async. You can hook up a then or done handler
        });
    });
}