(function (chrome) {

    var executeInCurrentTab = ["getStyles", "getStyle", "setStyle"],
        injectedCache = [];

    chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

        if (request.method === "log") {
            console.log(request.parameter.message);
            sendResponse();
        } else if (executeInCurrentTab.indexOf(request.method) !== -1) {

            chrome.tabs.getSelected(null, function (tab) {
                // console.log("executing method " + request.method + " on tab " + tab.url);

                var forwardRequestToTab = function () {
                    // console.log("send request", request);

                    chrome.tabs.sendMessage(tab.id, request, function (response) {
                        // console.log("got response", response);
                        sendResponse(response);
                    });
                };

                if (injectedCache.indexOf(tab.id) === -1) {
                    chrome.tabs.executeScript(tab.id, {file: 'public/chrome/content.js'}, function () {
                        // console.log("Execute script for tab " + tab.id);
                        forwardRequestToTab();
                    });
                } else {
                    forwardRequestToTab();
                }
            });
        } else {
            sendResponse({
                error: "method unknown"
            });
        }
    });

})(chrome);