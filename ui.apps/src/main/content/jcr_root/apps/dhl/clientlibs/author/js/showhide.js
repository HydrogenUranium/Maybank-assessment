(function (document, $) {
    "use strict";

    $(document).on("foundation-contentloaded", function (e) {
        Coral.commons.ready(function () {
            let switches = $(".cq-dialog-switch-showhide", e.target)
            showHideHandler(switches);
        });
    });

    function showHideHandler(el) {
      el.each(function (i, element) {
        if ($(element).is("coral-switch")) {
            Coral.commons.ready(element, function (component) {
                targetShowHide(element);
                component.on("change", function () {
                    targetShowHide(element);
                });
            });
        }
    });
    }

    function targetShowHide(element) {
        let target = $(element).data("cqDialogSwitchShowhideTarget");
        let $target = $(target);
        if (target) {
            $target.each(function () {
                $(this).not(".hide").addClass("hide");
                let targetValue = $(this).data('show-if-switch');
                if (typeof targetValue !== "undefined") {
                    let idfSelect = $(this).attr("class").split(' ').filter((item) => item !== "hide")
                    let checked = $(this).parent().find("coral-switch[data-cq-dialog-switch-showhide-target='." + idfSelect + "']")[0].checked;
                    if ((checked && targetValue == "checked") || (!checked && !targetValue == "checked")) {
                      $(this).removeClass('hide');
                    }
                }
            });
        }
    }
})(document, Granite.$);
