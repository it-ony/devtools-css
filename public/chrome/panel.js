window.editCssView = (function (window, document, undefined) {

    return {
        init: function (bootstrapper) {
            console.log = console.warn = console.err = bootstrapper.log;
            rAppid.bootStrap("editcss/EditCss.xml", document.body);
        }
    }

})(window, document);
