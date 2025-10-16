class Counter {
  constructor($element) {
    this.$element = $element;
    this.sel = {
      stats: '.statsPanel__statsValue',
      trigger: '.statsPanel__wrapper',
      productFill: '.boxFill'
    };
    this.animations = [];
    this.isAnimated = false;

    this.countUp = this.countUp.bind(this);
    this.runAnimations = this.runAnimations.bind(this);
    this.handleScrollOut = this.handleScrollOut.bind(this);
    this.prepareFillHeights = this.prepareFillHeights.bind(this);

    this.countUp();
    this.prepareFillHeights();
  }

  countUp() {
    let $stats = this.$element.find(this.sel.stats);
    let settings = {
      duration: parseInt(this.$element.attr('data-duration'), 10) || 2,
      separator: this.$element.attr('data-separator') || '',
      decimal: this.$element.attr('data-decimal') || '.'
    };
    let counts = [];

    $stats.each((index, element) => {
      let start = parseFloat($(element).attr('data-start')) || 0;
      let end = parseFloat($(element).attr('data-end'));
      let decimals = parseInt($(element).attr('data-decimals'), 10) || 0;
      let prefix = $(element).attr('data-prefix') || '';
      let suffix = $(element).attr('data-suffix') || '';
      let duration = parseFloat($(element).attr('data-duration')) || settings.duration;

      counts.push({
        el: $(element)[0],
        start: start,
        end: end,
        decimals: decimals,
        duration: duration,
        options: {
          prefix: prefix,
          suffix: suffix
        }
      });
    });

    for (let i = 0; i < counts.length; i++) {
      let _this = counts[i];
      let statAnim = new CountUp(
        _this.el,
        _this.start,
        _this.end,
        _this.decimals,
        _this.duration,
        {
          useEasing: false,
          separator: settings.separator,
          decimal: settings.decimal,
          prefix: _this.options.prefix,
          suffix: _this.options.suffix
        }
      );
      this.animations.push(statAnim);
    }
    this.runAnimations();
  }

  runAnimations() {
    const start = () => {
      if (this.isAnimated || !this.$element.find(this.sel.trigger).length) return;
      if (($(window).scrollTop() + (window.innerHeight * 0.75)) >= this.$element.find(this.sel.trigger).offset().top) {
        document.removeEventListener('scroll', start, {passive: true}); // Stop event from triggering more than once
        this.isAnimated = true;
        this.prepareFillHeights();
        for (let i = 0; i < this.animations.length; i++) {
          this.animations[i].start();
        }
        document.addEventListener('scroll', this.handleScrollOut, {passive: true});
        this.$element.find(this.sel.productFill).addClass('boxFill--show');
      }
    };

    setTimeout(() => {
      document.addEventListener('scroll', start, {passive: true});
      start();
    }, 500);
  }

  handleScrollOut() {
    if (!this.elementInViewport(this.$element[0])) {
      for (let i = 0; i < this.animations.length; i++) {
        this.animations[i].reset();
      }
      this.isAnimated = false;
      this.$element.find(this.sel.productFill).removeClass('boxFill--show');
      this.runAnimations();
    }
  }

  elementInViewport(el) {
    let top = el.offsetTop;
    let left = el.offsetLeft;
    let width = el.offsetWidth;
    let height = el.offsetHeight;

    while(el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top < (window.pageYOffset + window.innerHeight) &&
      left < (window.pageXOffset + window.innerWidth) &&
      (top + height) > window.pageYOffset &&
      (left + width) > window.pageXOffset
    );
  }

  prepareFillHeights() {
    const classPrefix = 'boxFill__fill--p-';
    this.$element.find(this.sel.productFill).each((index, element) => {
      const $box = $(element);
      const $fill = $box.find('.boxFill__fill').first();
      if (!$fill.length) {
        return;
      }
      const percentAttr = $box.attr('data-fill-percent') || $fill.attr('data-fill-percent');
      if (typeof percentAttr === 'undefined') {
        return;
      }
      const percent = parseFloat(percentAttr);
      if (Number.isNaN(percent)) {
        return;
      }
      const clamped = Math.max(0, Math.min(100, Math.round(percent)));
      const previousClass = $fill.data('boxFillClass');
      if (previousClass) {
        $fill.removeClass(previousClass);
      }
      const targetClass = `${classPrefix}${clamped}`;
      $fill.addClass(targetClass);
      $fill.data('boxFillClass', targetClass);
    });
  }
}

class Count {
  constructor() {
    this.sel = {
      component: '.statsPanel'
    };
    this.counters = [];

    this.init = this.init.bind(this);
  }

  init() {
    if ($(this.sel.component).length <= 0) return;
    // For each component, create a counter
    $(this.sel.component).each((index, element) => this.counters.push(new Counter($(element))));
  }
}

export default new Count();
