(function(chrome){

    function EditCss(window) {
        this.window = window;
        this.view = window.editCssView;

        try {
            this.view.init(this);
            this.refresh();
        } catch (e) {
            this.log(e);
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

    var editCss;

    chrome.devtools.panels.create("Edit CSS", "editCss_32.png", "editCss.html", function (panel) {

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

