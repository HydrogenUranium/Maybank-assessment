(function(document, $) {
    "use strict";

    $(document).on("foundation-contentloaded", function(e) {
        Coral.commons.ready(function() {
            let buttons = $(".cq-dialog-paste-button", e.target)
            buttonHandler(buttons);
        });
    });

    function buttonHandler(el) {
        el.each(function(i, element) {
            if ($(element).is("button")) {
                Coral.commons.ready(element, function(component) {
                    component.on("click", function() {
                        // Check if the Clipboard API is supported
                        if (!navigator.clipboard) {
                            alert('Clipboard API not supported');
                            return;
                        }

                        // Read text from the clipboard using promises
                        navigator.clipboard.readText()
                            .then(function(text) {
                                // Get the target field class from the button's data attribute
                                const targetFieldClass = $(element).data('paste-target');

                                // Find the target field using the class
                                const $targetField = $(`.${targetFieldClass}`);

                                // Paste the text into the target field
                                if ($targetField.length) {
                                    $targetField.val(text);
                                } else {
                                    console.error('Target field not found');
                                }
                            })
                            .catch(function(err) {
                                console.error('Failed to read clipboard contents: ', err);
                            });
                    });
                });
            }
        });
    }

})(document, Granite.$);
