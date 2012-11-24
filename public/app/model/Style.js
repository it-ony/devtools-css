define(['js/data/Model'], function(Model) {
    return Model.inherit("app.model.Style", {
        defaults: {
            embedded: true,
            name: "",
            content: "",
            localPath: null
        },

        fetch: function(options, callback) {
            if (!this.embedded && !this.$.content) {
                // get content for style
                var self = this;

                console.log(this.$.name);

                this.cssController.getStyle(this.$.name, function(err, content) {
                    self.set('content', content);
                    callback(err, content);
                });
            } else {
                callback(null, this, options);
            }
        }
    });
});