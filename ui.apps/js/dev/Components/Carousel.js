class Carousel {
  constructor() {
    this.sel = {
      component: '.article-carousel',
      indicator: '.cmp-carousel__indicator',
    };

    this.bindEvents = this.bindEvents.bind(this);
    this.init = this.init.bind(this);
  }

  bindEvents() {
    if ('ontouchstart' in window) {
      $(this.sel.indicator).each(function() {
        this.addEventListener("touchstart", function() {
          $(this).trigger('click');
        }, false);
      });

      $(this.sel.component).each(function() {
        var tStart = null;

        this.addEventListener("touchstart", function(e) {
          tStart = (e.touches || e.originalEvent.touches)[0].clientX;
        }, false);

        this.addEventListener("touchmove", function(e) {
          if (!tStart) {
            return;
          }
          var tEnd = e.touches[0].clientX;
          if (tStart - tEnd > 10) {
            $('.cmp-carousel__action.cmp-carousel__action--next').trigger('click');
          } else if (tEnd - tStart > 10) {
            $('.cmp-carousel__action.cmp-carousel__action--previous').trigger('click');
          }
          $('.cmp-carousel__indicator.cmp-carousel__indicator--active').trigger('click'); // to pause the playing of the Carousel
          tStart = null;
        }, false);
      });
    }
  }

  init() {
    if ($(this.sel.component).length <= 0) return;
    this.bindEvents();
  }
}

export default new Carousel();
