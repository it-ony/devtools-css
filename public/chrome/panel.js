(function (window, undefined) {

    window.start = function(cssController) {
        window.console.log = window.console.warn = window.console.err = function() {

            var args = Array.prototype.slice.call(arguments);
            if (args.length > 1) {
                cssController.log(args);
            } else {
                cssController.log(args[0]);
            }

        };

        rAppid.bootStrap("app/EditCss.xml", window.document.body, {
            cssController: cssController
        }, null, function(err, stage, application) {
            err && window.console.log(err);

            window.stage = stage;
            window.application = application;

        });
    };

})(window);
