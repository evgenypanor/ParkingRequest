// http://go.microsoft.com/fwlink/?LinkID=290993&clcid=0x409
var tlvmobileappClient;
document.addEventListener("deviceready", function () {
    tlvmobileappClient = new WindowsAzure.MobileServiceClient(
                    "https://tlvmobileapp.azure-mobile.net/",
                    "vBacFUoseJfKkPLjcRvVWZvKsIBEoq95");
});