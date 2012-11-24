(function (chrome) {

    var _styleCache = {},
        _styles,

        methods = {
            getStyles: function(parameter, callback) {
                callback(null, getStyles());
            },
            getStyle: function(parameter, callback) {
                getStyle(parameter.name, callback);
            },
            setStyle: function(parameter, callback) {
                try {
                    setStyle(parameter.name, parameter.content);
                    callback();
                } catch (e) {
                    callback(e);
                }

            }
        };

    /**
     * @return {Array} of objects containing names and their contents
     */
    function getStyles() {
        var i,
            style,
            styleNode;

        if (!_styles) {
            _styles = [];

            var styles = document.querySelectorAll("link[rel='stylesheet']");

            for (i = 0; i < styles.length; i++) {
                var link = styles[i];
                var content = fetchCss(link.href);

                style = {
                    embedded: false,
                    name: link.href,
                    content: content
                };

                // create a style node
                styleNode = document.createElement("style");
                styleNode.setAttribute("type", "text/css");
                styleNode.setAttribute("data-style-replacement-for", link.href);
                styleNode.innerHTML = content;

                // insert the style
                link.parentNode.insertBefore(styleNode, link);
                // and remove the external css link dom node from the dom
                link.parentNode.removeChild(link);

                _styles.push(style);

                _styleCache[link.href] = {
                    node: styleNode,
                    style: style
                };
            }

            styles = document.getElementsByTagName('style');

            var innerStyleIndex = 0;

            for (i = 0; i < styles.length; i++) {

                styleNode = styles[i];

                if (!styleNode.getAttribute("data-style-replacement-for")) {

                    innerStyleIndex++;
                    var name = "inline_" + innerStyleIndex;

                    // TODO: return @import styles
                    style = {
                        embedded: true,
                        name: name,
                        content: styleNode.innerText
                    };

                    _styles.push(style);

                    _styleCache[name] = {
                        node: styleNode,
                        style: style
                    };
                }

            }
        }

        return _styles;
    }

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

    function getStyle(name, callback) {
        var styleEntry = _styleCache[name];

        if (!styleEntry) {
            callback("styleEntry not found");
        } else {
            if (styleEntry.style.embedded) {
                // refresh content
                callback(null, styleEntry.style.content);
            } else {
                if (styleEntry.style.content) {
                    callback(null, styleEntry.style.content);
                } else {
                    // fetch style

                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.status === 200 || xhr.status === 304) {
                            styleEntry.style.content = xhr.responseText;
                            callback(null, xhr.responseText);
                        } else {
                            callback(xhr);
                        }
                    };

                    xhr.open("GET", styleEntry.style.name, true);
                }
            }
        }

    }

    function setStyle(name, style) {
        var styleEntry = _styleCache[name];

        if (!styleEntry) {
            throw new Error("style entry not found");
        } else {

        }
    }

    // FIXME: dirty hack to not response
    if (chrome.extension.onMessage.listeners_.length === 0) {
        chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

            var method = methods[request.method];
            if (method) {
                try {
                    method(request.parameter, function (err, data) {
                        sendResponse({
                            error: err,
                            data: data
                        });
                    });
                } catch (e) {
                    sendResponse({
                        error: e
                    });
                }
            } else {
                sendResponse({
                    error: "Method not found"
                });
            }

        });
    }

})(chrome);

