(function(document, Granite, $) {
    "use strict";

    let ui = $(window).adaptTo("foundation-ui");
    let foundationRegistry = $(window).adaptTo("foundation-registry");

    const REPLICATION_URL= Granite.HTTP.externalize("/bin/replicate.json");

    foundationRegistry.register("foundation.collection.action.action", {
        name: "publish.conf.action",
        handler: function (name, el, config, collection, selections) {
            const paths = selections.map(o => o.dataset.foundationCollectionItemId);

            const titles = selections.map(function(v) {
                return $(v).find(".foundation-collection-item-title").html();
            });

            if (!paths.length) return;

            ui.wait();

            $.ajax({
                url: REPLICATION_URL,
                method: "POST",
                data: {
                    "_charset_": "utf-8",
                    "path": paths,
                    "cmd": "Activate"
                },
                success: function() {
                    if (paths.length === 1) {
                        ui.notify(undefined,
                                Granite.I18n.get("Model <b>{0}</b> scheduled for publishing.",
                                    _g.XSS.getXSSValue([titles[0]])));
                    } else {
                        ui.notify(undefined,
                                Granite.I18n.get("Selected models scheduled for publishing."));
                    }
                },
                error: function(xhr) {
                    ui.alert(Granite.I18n.get('Error'),
                            Granite.I18n.get("Could not publish selected model(s)."),
                            'error');
                },
                complete: function() {
                    ui.clearWait();
                }
            });

            $(collection).adaptTo("foundation-selections").clear();

        }
    });

    foundationRegistry.register("foundation.collection.action.action", {
        name: "unpublish.conf.action",
        handler: function (name, el, config, collection, selections) {
            const paths = selections.map(o => o.dataset.foundationCollectionItemId);

            const titles = selections.map(function(v) {
                return $(v).find(".foundation-collection-item-title").html();
            });

            if (!paths.length) return;

            ui.wait();

            $.ajax({
                url: REPLICATION_URL,
                method: "POST",
                data: {
                    "_charset_": "utf-8",
                    "path": paths,
                    "cmd": "Deactivate"
                },
                success: function() {
                    if (paths.length === 1) {
                        ui.notify(undefined,
                                Granite.I18n.get("Model <b>{0}</b> scheduled for unpublishing.",
                                    _g.XSS.getXSSValue([titles[0]])));
                    } else {
                        ui.notify(undefined,
                                Granite.I18n.get("Selected models scheduled for unpublishing."));
                    }
                },
                error: function(xhr) {
                    ui.alert(Granite.I18n.get('Error'),
                            Granite.I18n.get("Could not unpublish selected model(s)."),
                            'error');
                },
                complete: function() {
                    ui.clearWait();
                }
            });

            $(collection).adaptTo("foundation-selections").clear();

        }
    });

})(document, Granite, Granite.$);
