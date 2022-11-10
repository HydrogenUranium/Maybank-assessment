class LandingPageButton {
  constructor() {
    this.sel = {
      component: '.page-body.landing-page-twocol .hero .hero__cta'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    return true;
  }

  bindEvents() {
    $(document).on('click', this.sel.component, (evt) => {
      var id = $(evt.currentTarget).attr('href');
      var offset = $(id).offset().top;
      $('html, body').animate({
        scrollTop: offset
      }, 1000, 'swing');

      return false;
    });
  }
}

export default new LandingPageButton();
