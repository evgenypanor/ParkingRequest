// http://go.microsoft.com/fwlink/?LinkID=290993&clcid=0x409
var tlvmobClient;
document.addEventListener("deviceready", function () {
    tlvmobClient = new WindowsAzure.MobileServiceClient(
                    "https://tlvmob.azure-mobile.net/",
                    "jKdFOzPTuXCbEcNMoiPFlAHHqNkWxY93");
});