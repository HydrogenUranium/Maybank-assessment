(function($) {
    const foundationRegistry = $(window).adaptTo('foundation-registry');

    foundationRegistry.register('foundation.validation.validator', {
        selector: '[data-foundation-validation^=\'multifield-quantity\']',
        validate: function(el) {
            const validationSettings = el.getAttribute('data-validation');

            const matchMax = validationSettings.match(/max-([\d]+)/);
            const matchMin = validationSettings.match(/min-([\d]+)/);

            if (matchMax && el.items.length > matchMax[1]) {
                return 'Maximum amount of items is ' + matchMax[1];
            }

            if (matchMin && el.items.length < matchMin[1]) {
                return 'Minimum amount of items is ' + matchMin[1];
            }
        }
    });
})($);
