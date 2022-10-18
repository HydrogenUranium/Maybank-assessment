(function($) {
 
    $.fn.equalHeights = function(options) {

        var Settings = $.extend({
                currentTallest: 0,
                currentRowStart: 0,
                rowDivs: new Array(),
                $el: null,
                topPosition: 0,
                currentDiv: 0,
                allowance: 0,
                randClass: 'equalHeights-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10)
            }, options),

        _equalise = function(items) {
            var settings = $.extend(true, {}, Settings);

            $(items).each(function() {
                settings.$el = $(this).addClass(settings.randClass);
                settings.$el.css('height', 'auto');//Remove height because it will not reduce in size if not
                settings.topPosition = settings.$el.offset().top;
                var difference = (settings.currentRowStart > settings.topPosition) ? (settings.currentRowStart - settings.topPosition) : (settings.topPosition - settings.currentRowStart);
                if (settings.currentRowStart != settings.topPosition && difference > settings.allowance) {
                    // we just came to a new row.  Set all the heights on the completed row
                    for (settings.currentDiv = 0 ; settings.currentDiv < settings.rowDivs.length ; settings.currentDiv++) {
                        settings.rowDivs[settings.currentDiv].css('height', settings.currentTallest);
                    }
                    // set the variables for the new row
                    settings.rowDivs.length = 0; // empty the array
                    settings.currentRowStart = settings.topPosition;
                    settings.currentTallest = settings.$el.outerHeight();
                    settings.rowDivs.push(settings.$el);
                } else {
                    // another div on the current row. Add it to the list and check if it's taller
                    settings.rowDivs.push(settings.$el);
                    settings.currentTallest = (settings.currentTallest < settings.$el.outerHeight()) ? (settings.$el.outerHeight()) : (settings.currentTallest);
                }
                // do the last row
                for (settings.currentDiv = 0 ; settings.currentDiv < settings.rowDivs.length ; settings.currentDiv++) {
                    settings.rowDivs[settings.currentDiv].css('height', settings.currentTallest);
                }
            });

        },

        update = function() {
            $('.' + Settings.randClass).css('height', 'auto');
            _equalise($('.' + Settings.randClass));
        };

        _equalise(this);

        $(window).on('stop.resize', update);

        return {
            settings: Settings,
            update: update
        };
 
    };
 
}(jQuery));