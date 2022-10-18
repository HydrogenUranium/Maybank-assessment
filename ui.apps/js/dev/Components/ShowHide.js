class ShowHide {
  constructor() {
    this.sel = {
      component: '[data-show-hide-id]',
      toggle: '[data-show-hide-target]'
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
    $(document).on('click', this.sel.toggle, (e) => {
      const showHideTarget = $(e.target).attr('data-show-hide-target');
      $('[data-show-hide-id=' + showHideTarget + ']').slideToggle();
    });
  }
}

export default new ShowHide();
