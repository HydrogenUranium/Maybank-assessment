// show/hide functionality for switch widget
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
                    if ((checked && targetValue == "checked") || (!checked && targetValue != "checked")) {
                      $(this).removeClass('hide');
                    }
                }
            });
        }
    }
})(document, Granite.$);

// show/hide functionality for dropdown that support multiple values
(function (document, $) {
    "use strict";

    // when dialog gets injected
    $(document).on("foundation-contentloaded", function (e) {
        // if there is already an inital value make sure the according target element becomes visible
        showHideHandler($(".cq-dialog-dropdown-multiple-showhide", e.target));
    });

    $(document).on("selected", ".cq-dialog-dropdown-multiple-showhide", function (e) {
        showHideHandler($(this));
    });

    function showHideHandler(el) {
        el.each(function (i, element) {
            if($(element).is("coral-select")) {
                // handle Coral3 base drop-down
                Coral.commons.ready(element, function (component) {
                    showHide(component, element);
                    component.on("change", function () {
                        showHide(component, element);
                    });
                });
            } else {
                // handle Coral2 based drop-down
                var component = $(element).data("select");
                if (component) {
                    showHide(component, element);
                }
            }
        })
    }

    function showHide(component, element) {
        // get the selector to find the target elements. its stored as data-.. attribute
        var target = $(element).data("cqDialogDropdownShowhideTarget");
        // querySelector won't create HTML objects on the fly as jquery does
        var sanitizedTarget = document.querySelectorAll(target);
        var $target = $(sanitizedTarget);

        if (sanitizedTarget.length) {
            var value;
            if (typeof component.value !== "undefined") {
                value = component.value;
            } else if (typeof component.getValue === "function") {
                value = component.getValue();
            }

            $target.each(function(index, element) {
                // make sure all unselected target elements are hidden.
                // unhide the target element that contains the selected value as data-showhidetargetvalue attribute
                var show = false;

                if (element) {
                    var targetValuesString = element.dataset.showhidetargetvalue || ""; // Default to an empty string if not present
                    var targetValuesArray = targetValuesString
                        .replace(/[\[\]\s]/g, '')  // Remove brackets and any spaces
                        .split(',')                // Split by commas
                        .filter(Boolean);          // Remove any empty strings from the array

                    show = targetValuesArray.includes(value);
                }

                setVisibilityAndHandleFieldValidation($(element), show);
            });
        }
    }

    /**
     * Shows or hides an element based on parameter "show" and toggles validations if needed. If element
     * is being shown, all VISIBLE fields inside it whose validation is false would be changed to set the validation
     * to true. If element is being hidden, all fields inside it whose validation is true would be changed to
     * set validation to false.
     *
     * @param {jQuery} $element Element to show or hide.
     * @param {Boolean} show <code>true</code> to show the element.
     */
     function setVisibilityAndHandleFieldValidation($element, show) {
         if (show) {
             $element.removeClass("hide");
             $element.find("input[aria-required=false], coral-multifield[aria-required=false], foundation-autocomplete[aria-required=false]")
             .filter(":not(.hide>input)").filter(":not(input.hide)")
             .filter(":not(foundation-autocomplete[aria-required=false] input)")
             .filter(":not(.hide>coral-multifield)").filter(":not(input.coral-multifield)").each(function(index, field) {
                 toggleValidation($(field));
             });
         } else {
             $element.addClass("hide");
             $element.find("input[aria-required=true], coral-multifield[aria-required=true], foundation-autocomplete[required]")
             .filter(":not(foundation-autocomplete[required] input)")
             .each(function(index, field) {
                 toggleValidation($(field));
             });
         }
     }

    /**
    * If the form element is not shown we have to disable the required validation for that field.
    *
    * @param {jQuery} $field To disable / enable required validation.
    */
    function toggleValidation($field) {
        var required = $field.prop("required");
        var ariaRequired = $field.attr('aria-required');
        var notRequired = ariaRequired === 'true';

        if ($field.is("foundation-autocomplete") && required !== 'undefined') {
            if (required === true) {
                $field[0].required = false;
                $field.attr('aria-required', false);
            } else if (required === false) {
                $field[0].required = true;
                $field.removeAttr('aria-required');
            }
        } else if (typeof ariaRequired !== 'undefined') {
            $field.attr('aria-required', String(!notRequired));
        }

        var api = $field.adaptTo("foundation-validation");
        if (api) {
            api.checkValidity();
            api.updateUI();
        }
    }
})(document, Granite.$);
