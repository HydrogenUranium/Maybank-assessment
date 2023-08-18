(function(document, $) {
    "use strict";

    $(document).on('foundation-contentloaded', function(e) {
        Coral.commons.ready(function () {
            toggleCheckBox($('.cq-dialog-checkbox-showhide'));
        });
    });

    $(document).on("dialog-ready", function(e) {
        toggleCheckBox($(".cq-dialog-bt-checkbox-showhide", e.target));
    });

    $(document).on("click", ".cq-dialog-checkbox-showhide", function(e) {
        toggleCheckBox($(this));
    });

    $(document).on("foundation-contentloaded", function(e) {
        $(".cq-dialog-dropdown-reset-linked-checkbox", e.target).each(function(i, element) {
            let target = $(element).data("cq-dialog-dropdown-reset-linked-checkbox-target");
            if (target) {
                let $target = $(target);
                Coral.commons.ready(element, function(component) {
                    component.on("change", function() {
                        $target.each(function(i, element) {
                            if(element.checked){
                                element.click();
                            }
                        });
                    });
                });
            }
        });
    });

    function toggleCheckBox(el) {
        el.each(function(i, element) {
            let $element = $(element);
            let target = $element.data("cqDialogCheckboxShowhideTarget");
            if (target) {
                let $target = $(target),
                    isChecked = $element.is(":checked");
                toggleHide($target, isChecked);
            }
        });
    }

    function toggleHide($target, isChecked) {
        $target.each(function () {
            let $self = $(this),
                id = $self.attr("id"),
                state = $self.hasClass("hide-on-check") ? isChecked : !isChecked;

                $self.toggleClass("hide", state);
                $("[aria-controls='" + id + "']").toggleClass("hide", state);
        });
    }
})(document,Granite.$);
