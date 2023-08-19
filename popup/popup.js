
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("viewResultDetails").addEventListener("click", function () {
        chTab("view_result_details");
    });

    document.getElementById("downloadAnswers").addEventListener("click", function () {
        chTab("downloadAnswers");
    });
    document.getElementById("personalInfo").addEventListener("click", function () {
        chTab("personalInfo");
    });
});


function chTab(msg) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, { message: msg, data: "data" });
    });
}