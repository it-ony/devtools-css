(function(chrome){

    function EditCss(window) {
        this.window = window;

        if (window.start) {
            this.log("Start panel");
            window.start(this);
        } else {
            this.log("Start function on window not found");
        }
    }

    EditCss.prototype = {

        log: function (message) {
            try {
                this._call("log", {
                    message: message
                });
            } catch (e) {
                this.log(e);
            }
        },

        _call: function(method, parameter, callback) {

            chrome.extension.sendRequest({
                method: method,
                parameter: parameter || {}
            }, function(response) {
                response = response || {};
                callback && callback(response.error, response.data);
            });
        },

        getStyles: function (callback) {
            this._call("getStyles", null, callback);
        },

        getStyle: function (name, callback) {
            this._call("getStyle", {
                name: name
            }, callback);
        },

        search: function (action, string) {
            this.log("search");
        },

        hide: function () {
            this.log("hide");
        }
    };


    chrome.devtools.panels.create("Edit CSS", "public/img/editCss_32.png", "public/panel.html", function (panel) {

        var editCss;

        panel.onShown.addListener(function (window) {

            if (editCss) {
                return;
            }

            editCss = new EditCss(window);
        });

        panel.onSearch.addListener(function (action, string) {
            editCss && editCss.search(action, string);
        });

        panel.onHidden.addListener(function () {
            editCss && editCss.hide();
        });


    });

//    chrome.extension.onMessage.addListener(function (message){
//        editCss && editCss.log("got message" + message.type);
//
//        if (editCss && message.type === "tabUpdated") {
//            editCss.refresh();
//        }
//    });


})(chrome);

