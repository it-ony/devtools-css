(function(chrome){

    function EditCss(window) {
        this.window = window;

        this.log("Constructor in EditCss");

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
                chrome.extension.sendRequest({
                    type: "log",
                    message: message
                });
            } catch (e) {
                this.log(e);
            }
        },

        refresh: function () {

            var self = this;
            chrome.extension.sendRequest({
                type: "getStyles"
            }, function (response) {
                if (response && response.styles instanceof Array) {
                    // we got styles
                    self.view.setStyles(response.styles);
                } else {
                    self.log(["Styles not found", response.error]);
                }

            });
        },

        search: function (action, string) {

        },

        hide: function () {

        }
    };


    chrome.devtools.panels.create("Edit CSS", "public/img/editCss_32.png", "public/panel.html", function (panel) {

        var editCss;

        panel.onShown.addListener(function (window) {
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

