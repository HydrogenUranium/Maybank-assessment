class Carousel {
  constructor() {
    this.sel = {
      component: '.article-carousel',
      indicator: '.cmp-carousel__indicator',
    };
    this.carousel = null;

    this.bindEvents = this.bindEvents.bind(this);
    this.init = this.init.bind(this);
  }

  bindEvents() {
    $(this.sel.indicator).each(function( index ) {
      if ('ontouchstart' in window) {
        this.addEventListener("touchstart", function() {
          this.trigger('click');
        }, false);
      }
    });
  }

  init() {
    if ($(this.sel.component).length <= 0) return;
    this.bindEvents();
  }
}

export default new Carousel();
