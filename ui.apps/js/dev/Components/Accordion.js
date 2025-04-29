class Accordion {

  constructor() {
    this.sel = {
      component: '.cmp-accordion',
      item: '.cmp-accordion__item',
      panel: '.cmp-accordion__panel',
    };
    this.bindEvents = this.bindEvents.bind(this);
    this.init = this.init.bind(this);
  }

  bindEvents() {
    $(document).on('click', this.sel.item, (e) => {
      e.preventDefault();

      const panel = $(e.currentTarget).find(this.sel.panel);

    //calculate the max-height of the panel
      panel.css({
        'max-height': panel.prop('scrollHeight') + 'px',
      });
    })

    //when resize the window the max-height of the panel is recalculated
    $(window).on('resize', () => {
      $(this.sel.panel).each(function () {
        if (!$(this).hasClass('cmp-accordion__panel--hidden')) {
          // Recalculate max-height only for expanded panels
          $(this).css({
            'max-height': $(this).prop('scrollHeight') + 'px',
          });
        }
      });
    });
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;

    // Set max-height to 0 for all panels with the class .cmp-accordion__panel--hidden
    $(this.sel.panel).each(function () {
      if ($(this).hasClass('cmp-accordion__panel--hidden')) {
        $(this).css({
          'max-height': '0',
        });
      }
    });
    this.bindEvents();
    return true;
  }
}

export default new Accordion();
