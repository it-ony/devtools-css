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

        setStyle: function(name, content, callback) {
            this._call("setStyle", {
                name: name,
                content: content
            }, callback);
        },

        trigger: function(eventType, event, target) {

            if (this.window && this.window.stage && this.window.stage.$bus) {
                this.log("Send event " + eventType);

                this.window.stage.$bus.trigger(eventType, event, target);
                return true;
            }

            return false;
        }
    };


    chrome.devtools.panels.create("Edit CSS", "public/img/editCss_32.png", "public/panel.html", function (panel) {

        var editCss;

        panel.onShown.addListener(function (window) {

            if (!editCss) {
                editCss = new EditCss(window);
            }

            editCss && editCss.trigger("Panel.Show");

        });

        panel.onSearch.addListener(function (action, string) {

        });

        panel.onHidden.addListener(function () {
            editCss && editCss.trigger("Panel.Hide");
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

