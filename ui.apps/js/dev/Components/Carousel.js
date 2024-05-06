class Carousel {
  constructor() {
    this.sel = {
      component: '.article-carousel',
      indicator: '.cmp-carousel__indicator',
      previous: '.cmp-carousel__action.cmp-carousel__action--previous',
      next: '.cmp-carousel__action.cmp-carousel__action--next',
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

      var tStart = null;
      $(document).bind('touchstart', function (e) {
        tStart = (evt.touches || evt.originalEvent.touches)[0].clientX;
      });

      $(document).bind('touchend', function (e) {
        if (!tStart) {
          return;
        }
        var tEnd = e.originalEvent.changedTouches[0].clientX;
        if (tStart - tEnd > 5) {
          $(this.sel.previous).trigger('click');
        } else if (tEnd - tStart > 5) {
          $(this.sel.next).trigger('click');
        }
      }, this);
    }
  }

  init() {
    if ($(this.sel.component).length <= 0) return;
    this.bindEvents();
  }
}

export default new Carousel();
