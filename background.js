//KEY : URL , VALUE : {url as string,trackedSeconds,lastDateValue milisec}
const allTabsObjectKey = "tabTimeObject";
//KEY : URL of the last visited tab , VALUE : {time of lastDateValue as number}
const lastActiveTabKey = "lastActiveTab";

//OnActivated : Fires when the active tab in a window changes. Note that the tab's URL may not be set at the time this event fired, but you can listen to onUpdated events so as to be notified when a URL is set.
chrome.tabs.onActivated.addListener(tabTrack);

//Object has URL,trackedseconds,lastDate values
//we need last Tab name to reset time
function tabTrack(activeInfo) {
    let tabId = activeInfo.tabId;
    let windowId = activeInfo.windowId;

    tabChange(true);
}

//Fires when the currently focused window changes
chrome.windows.onFocusChanged.addListener(function (windowId) {
    if (windowId == chrome.windows.WINDOW_ID_NONE) {
        tabChange(false);
    } else {
        tabChange(true);
    }
});

function tabChange(isWindowsActive) {
    //Gets all tabs that have the active true property
    chrome.tabs.query({ active: true }, function (tabs) {
        console.log(`\n\nis active : ${isWindowsActive}`);
        console.log(`TABS : \n ${tabs.length}`);

        if (tabs.length > 0 && tabs[0] != null) {
            let currentTab = tabs[0];
            let url = currentTab.url;
            console.log(`URL : ${url}`);

            //Either use storage.sync which stores result on browser when sync is enabled
            //or use storage.local which stores result locally even if sync is not enabled

            //2 objects one which stores everything tabTotaltime,URl,currentime and second is lastActivityDonetime with URL of last visited tab
            chrome.storage.local.get([allTabsObjectKey, lastActiveTabKey], function (result) {
                let lastActiveTabString = result[lastActiveTabKey];
                let allTabsObjectString = result[allTabsObjectKey];
                //implied global object literal
                tabTimeObject = {};
                if (allTabsObjectString != null) {
                    tabTimeObject = JSON.parse(allTabsObjectString);
                }
                lastActiveTab = {};
                if (lastActiveTabString != null) {
                    lastActiveTab = JSON.parse(lastActiveTabString);
                }
                if (lastActiveTab.hasOwnProperty("url") && lastActiveTab.hasOwnProperty("lastDateVal")) {
                    let lastUrl = lastActiveTab["url"];
                    let currentDate = Date.now();
                    let lastDate = lastActiveTab["lastDateVal"];
                    //get passedSeconds on URL in seconds format
                    let passedSeconds = (currentDate - lastDate) * 0.001

                    if (tabTimeObject.hasOwnProperty(lastUrl)) {
                        let lastUrlObjectInfo = tabTimeObject[lastUrl];
                        lastUrlObjectInfo["trackedSeconds"] = lastUrlObjectInfo.hasOwnProperty("trackedSeconds") ? lastUrlObjectInfo["trackedSeconds"] + passedSeconds : passedSeconds;
                        lastUrlObjectInfo["lastDateVal"] = currentDate;
                    } else {
                        let newUrlObj = {
                            url: lastUrl,
                            trackedSeconds: passedSeconds,
                            lastDateVal: currentDate
                        }
                        tabTimeObject[lastUrl] = newUrlObj;
                    }
                }

                let currentDateValue = Date.now();

                //store current tab info
                let lastTabInfo = {
                    "url": url,
                    "lastDateVal": currentDateValue
                }
                if (!isWindowsActive) {
                    lastTabInfo = {};
                }
                let newLastTabObject = {};
                newLastTabObject[lastActiveTabKey] = JSON.stringify(lastTabInfo);
                console.log("NEW Last Tab : " + newLastTabObject[lastActiveTabKey]);

                chrome.storage.local.set(newLastTabObject, function () {
                    const tabTimeObjectString = JSON.stringify(tabTimeObject);
                    let newTabTimeObject = {};
                    newTabTimeObject[allTabsObjectKey] = tabTimeObjectString;

                    chrome.storage.local.set(newTabTimeObject, function () {
                        console.log("newTabTimeObject stored : " + newTabTimeObject[allTabsObjectKey]);
                    });
                });
            });
        }
    });
}
