// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");
        chrome.tabs.create({url: "options.html"});
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

chrome.browserAction.onClicked.addListener(function(activeTab)
{
  chrome.tabs.create({ url: "login_page.html" });
});
