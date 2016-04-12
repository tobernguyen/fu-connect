import { NETWORK_STATUS, checkNetworkStatus } from './lib/connectivity_utils';

// Turn on auto relogin and monitor network by default
function initializeSettings(onDone) {
  chrome.storage.local.set({ autoRelogin: true, monitorNetwork: true }, onDone);
}

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");
        initializeSettings(() => {chrome.tabs.create({url: "options.html"})});
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

chrome.browserAction.onClicked.addListener(function(activeTab)
{
  chrome.tabs.create({ url: "login_page.html" });
});

chrome.storage.local.get(["autoRelogin", "monitorNetwork"], (items) => {
  if(items.monitorNetwork) {
    startNetworkMonitorService();
  }
  window.autoRelogin = items.autoRelogin;
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    if (key === "monitorNetwork") {
      if (changes[key].newValue) {
        startNetworkMonitorService();
      } else {
        stopNetworkMonitorService();
      }
    } else if (key === "autoRelogin") {
      window.autoRelogin = changes[key].newValue;
    }
  }
});

function startNetworkMonitorService() {
  // Check internet connectivity every 5 seconds
  if (!window.fuConnectCheckInternetInterval) {
    window.fuConnectCheckInternetInterval = window.setInterval(() => {
      console.log('Checking internet connectivity...');
      checkNetworkStatus(onUp, onDown);
    }, 5000);
  }
}

function stopNetworkMonitorService() {
  if(window.fuConnectCheckInternetInterval) {
    clearInterval(window.fuConnectCheckInternetInterval);
    window.fuConnectCheckInternetInterval = null;
  }
}

const onUp = () => {
  console.log('Online!');
  if (!window.fuConnectIsInternetAvailable) {
    window.fuConnectIsInternetAvailable = true;
    updateBrowserAction();
  }
}

const onDown = () => {
  console.log('Offline!');
  if (window.fuConnectIsInternetAvailable) {
    if (window.autoRelogin) chrome.tabs.create({url: "login_page.html"});
    window.fuConnectIsInternetAvailable = false;
    updateBrowserAction();
  }
}

const updateBrowserAction = () => {
  var iconTag = window.fuConnectIsInternetAvailable ? 'on' : 'off';
  chrome.browserAction.setIcon({
      path: {
          "16": `icon_${iconTag}16.png`,
          "48": `icon_${iconTag}48.png`,
          "128": `icon_${iconTag}128.png`
      }
  });
}