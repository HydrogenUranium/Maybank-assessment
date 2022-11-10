(function($) {

    var timer = null;
    $(window).on('resize', function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            $(window).trigger('stop.resize');
        }, 150);
    });

})(jQuery);