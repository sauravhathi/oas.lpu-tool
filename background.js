chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.create({url: "https://github.com/sauravhathi/oas.lpu-tool"});
});