window.editCssView = (function (window, document, $, undefined) {

    var editCss,
        ready = false,
        _styles = {};

    $(document).ready(function() {
        ready = true;
        registerListener();
    });

    function registerListener() {

        $("#refresh").click(function (e) {
            editCss.log("refresh");
            editCss.refresh();
        });

        $("#css").change(function(e) {
            var val = $("#css :selected").val();
            $('#content').text(_styles[val]);
        });

    }

    return {
        init: function (controller) {
            editCss = controller;
            editCss.log("init");
        },

        setStyles: function (styles) {

            if (!ready) {
                editCss.log("Styles couldn't be set because document isn't ready.");
                return;
            }

            var css = $('#css');
            css.find('option').remove();

            _styles = {};

            $.each(styles, function (key, value) {
                _styles[value.name] = value.content;

                css.append($('<option />')
                    .attr({
                        name: value.name
                    })
                    .text(value.name)
                );
            });

            css.change();

        }
    }

})(window, document, jQuery);