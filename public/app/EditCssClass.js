define(['js/core/Application', 'js/core/List', 'app/model/Style'], function(Application, List, Style) {
    return Application.inherit('app.EditCssClass', {
        defaults: {
            styles: List,
            selectedStyle: null,
            style: ""
        },

        start: function(parameter, callback) {
            parameter = parameter || {};

            var cssController = parameter.cssController;

            if (!cssController) {
                callback(new Error("cssController not specified"));
            } else {
                this.cssController = cssController;
                this.getStyles();
                this.callBase();
            }
        },

        refresh: function() {
            this.getStyles();
        },

        getStyles: function() {
            var self = this,
                cssController = this.cssController;

            this.set('styles', new List());

            cssController.getStyles(function (err, styles) {
                if (!err) {
                    for (var i = 0; i < styles.length; i++) {
                        var style = new Style(styles[i]);
                        style.cssController = cssController;
                        self.$.styles.add(style);
                    }
                } else {
                    cssController.log(err);
                }
            });

            this.set('selectedStyle', this.$.styles.at(0));
        },

        bus_show: function() {
            this.refresh();
        }.bus("Panel.Show")

    });
});