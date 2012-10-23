(function (chrome) {

    chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
        if (request.type === "log") {
            console.log(request.message);
            sendResponse();
        } else if (request.type === "getStyles") {
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.executeScript(tab.id, {file: 'content.js'}, function () {
                    chrome.tabs.sendRequest(tab.id, {
                        type: "getStylesForTab"
                    }, function (response) {
                        sendResponse(response);
                    });
                });
            });
        } else {
            sendResponse({
                error: "type unknown"
            });
        }

    });

//    function checkTabChanged(tabId, changeInfo) {
//        chrome.tabs.getSelected(null, function (tab) {
//            if (tabId == tab.id) {
//                console.log("send tabUpdated");
//                chrome.extension.sendMessage({
//                    type: "tabUpdated",
//                    tabId: tabId,
//                    changeInfo: changeInfo
//                });
//            }
//        });
//    }
//
//    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//        console.log("tab updated");
//        checkTabChanged(tabId, changeInfo);
//    });
//
//    chrome.tabs.onCreated.addListener(function (tabId, changeInfo, tab) {
//        console.log("tab created");
//        checkTabChanged(tabId, changeInfo);
//    });

})(chrome);