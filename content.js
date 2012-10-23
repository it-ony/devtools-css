/**
 * @return {Array} of objects containing names and their contents
 */
function getStyles() {

    var output = [],
        i;

    var styles = document.querySelectorAll("link[rel='stylesheet']");

    for (i = 0; i < styles.length; i++) {
        var link = styles[i];

        output.push({
            embedded: false,
            name: link.href,
            content: fetchCss(link.href)
        });
    }

    styles = document.getElementsByTagName('style');
    for (i = 0; i < styles.length; i++) {
        output.push({
            embedded: true,
            name: "inline_" + i,
            content: styles[i].innerText
        });
    }

    return output;
}

/**
 * Do a synchronous XHR for the style contents
 *
 * @param {String} url URL of the style to retrieve
 * @return {String} contents of the style
 */
function fetchCss(url) {
    var response = null;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function () {
        if (xhr.status == 200) {
            response = xhr.responseText;
        }
    };
    xhr.send();
    return response;
}

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

    if (request.type === "getStylesForTab") {
        sendResponse({styles: getStyles()});
    }

});