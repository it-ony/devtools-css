(function (chrome) {

    var debug = false,
        executeInCurrentTab = ["getStyles", "getStyle", "setStyle"],
        injectedCache = [];

    chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

        if (request.method === "log") {
            console.log(request.parameter.message);
            sendResponse();
        } else if (executeInCurrentTab.indexOf(request.method) !== -1) {

            if (debug) {
                chrome.tabs.query({
                    url: "http://www.it-ony.de/"
                }, function (tabs) {
                    if (tabs.length) {
                        forwardMessageToTab(tabs[0].id);
                    } else {
                        console.log("tab not found");
                    }
                });
            } else {
                chrome.tabs.getSelected(null, function (tab) {
                    // console.log("executing method " + request.method + " on tab " + tab.url);
                    forwardMessageToTab(tab.id);
                });
            }


            function forwardMessageToTab(tabId) {
                var forwardRequestToTab = function () {
                    console.log("send request", request);

                    chrome.tabs.sendMessage(tabId, request, function (response) {
                        console.log("got response", response);
                        sendResponse(response);
                    });
                };

                if (injectedCache.indexOf(tabId) === -1) {
                    console.log("execute script on tab" + tabId);
                    chrome.tabs.executeScript(tabId, {file: 'public/chrome/content.js'}, function () {
                        injectedCache.push(tabId);
                        forwardRequestToTab();
                    });
                } else {
                    forwardRequestToTab();
                }
            }

        } else {
            sendResponse({
                error: "method unknown"
            });
        }
    });

})(chrome);