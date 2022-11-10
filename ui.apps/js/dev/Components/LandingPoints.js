class LandingPoints {
  constructor() {
    this.sel = {
      component: '.landingpoints',
      landingPointItem: '.landingpoints .landingpoint',
      clickableTitle: '.landingpoints .landingpoint__title a'
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
    $(document).on('click', this.sel.clickableTitle, (evt) => {
      var container = $(evt.currentTarget).closest(this.sel.landingPointItem);
      if (container.hasClass('open')) {
        container.find('.landingpoint__content').css({ height: 0 });
        container.removeClass('open');
      } else {
        $(evt.currentTarget).closest(this.sel.component).find('.landingpoint.open .landingpoint__content').css({ height: 0 });
        $(evt.currentTarget).closest(this.sel.component).find('.landingpoint').removeClass('open');
        container.addClass('open');
        container.find('.landingpoint__content').css({ height: container.find('.landingpoint__content p').outerHeight() });
      }

      return false;
    });
  }
}

export default new LandingPoints();

