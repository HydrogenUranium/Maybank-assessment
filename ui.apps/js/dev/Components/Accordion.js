class Accordion {

  constructor() {
    this.sel = {
      component: '.cmp-accordion',
      item: '.cmp-accordion__item',
      panel: '.cmp-accordion__panel',
    };
    this.bindEvents = this.bindEvents.bind(this);
    this.init = this.init.bind(this);
    this.calculateTransitionDuration = this.calculateTransitionDuration.bind(this);
  }

  calculateTransitionDuration(scrollHeight) {
    const min = 200;
    const max = 600;
    const factor = 15; // tune this value
    return Math.min(max, Math.max(min, Math.sqrt(scrollHeight) * factor));
  }

  bindEvents() {
    $(document).on('click', this.sel.item, (e) => {
      if ($(e.target).closest('a').length > 0) {
        // this code will allow anchor links work as expected
        return;
      }
      e.preventDefault();

      const panel = $(e.currentTarget).find(this.sel.panel);
      const scrollHeight = panel.prop('scrollHeight');
      const duration = this.calculateTransitionDuration(scrollHeight);

    //calculate the max-height of the panel
      panel.css({
        transition: `max-height ${duration}ms ease-in-out, margin ${duration}ms ease-in-out`,
        'max-height': scrollHeight + 'px',
      });
    })

    //when resize the window the max-height of the panel is recalculated
    $(window).on('resize', () => {
      $(this.sel.panel).each(function () {
        if (!$(this).hasClass('cmp-accordion__panel--hidden')) {
          // Recalculate max-height only for expanded panels
          const panel = $(this);
          const scrollHeight = panel.prop('scrollHeight');
          const duration = this.calculateTransitionDuration(scrollHeight);
          $(this).css({
            transition: `max-height ${duration}ms ease-in-out, margin ${duration}ms ease-in-out`,
            'max-height': scrollHeight + 'px',
          });
        }
      });
    });
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    const calculateTransitionDuration = this.calculateTransitionDuration;
    // Set max-height to 0 for all panels with the class .cmp-accordion__panel--hidden
    $(this.sel.panel).each(function () {
      if ($(this).hasClass('cmp-accordion__panel--hidden')) {
        // Recalculate max-height only for hidden panels
        const panel = $(this);
        const scrollHeight = panel.prop('scrollHeight');
        const duration = calculateTransitionDuration(scrollHeight);
        $(this).css({
          transition: `max-height ${duration}ms ease-in-out, margin ${duration}ms ease-in-out`,
          'max-height': scrollHeight + 'px',
        });
      }
    });
    this.bindEvents();
    return true;
  }
}

export default new Accordion();
