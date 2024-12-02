var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        var dialog = $("coral-dialog[trackingfeature='aem:sites:components:dialogs:core-components:image:v3'] .cq-dialog");
        if (dialog.length && dialog.is(":visible")) {
            var checkbox = $("[name='./altValueFromPageImage']");
            if (checkbox.is(":checked")) {
              // Uncheck and then re-check the checkbox to update Alt Text value in the field
              checkbox.click();
              checkbox.click();
            }
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
