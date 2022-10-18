class Social {
  constructor() {
    this.sel = {
      component: '.social'
    };

    this.bindEvents = this.bindEvents.bind(this);
    this.containerTop = this.containerTop.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.checkSharePos = this.checkSharePos.bind(this);
    this.debounce = this.debounce.bind(this);
    this.init = this.init.bind(this);
  }

  bindEvents() {
    window.addEventListener('scroll', this.handleScroll);
  }

  containerTop() {
    return $(this.sel.component).parent().position().top;
  }

  handleScroll() {
    if (window.innerWidth >= 992) {
      let height = $(window).scrollTop();
      let bottom = this.containerTop() + $(this.sel.component).parent().height() - $(this.sel.component).outerHeight() - 60;
      if (height >= this.containerTop() && height < bottom && !$(this.sel.component).hasClass('social--affix')) {
        $(this.sel.component)
          .addClass('social--affix')
          .css({
            'left': this.getLeftOffset($(this.sel.component)),
            'top': ''
          });
      } else if (height < this.containerTop() && $(this.sel.component).hasClass('social--affix')) {
        $(this.sel.component)
          .removeClass('social--affix')
          .css({
            'left': '',
            'top': ''
          });
      } else if (height >= bottom && $(this.sel.component).hasClass('social--affix')) {
        $(this.sel.component)
          .removeClass('social--affix')
          .css({
            'left': '',
            'top': this.getTopOffset()
          });
      }
    }
  }

  getLeftOffset($elm) {
    let parentOffset = parseInt($elm.parent().offset().left, 10);
    let myOffset = parseInt($elm.offset().left, 10);
    return (parentOffset + myOffset);
  }

  getTopOffset() {
    let parentOffset = this.containerTop();
    let scrollPos = $(window).scrollTop();
    let top = scrollPos - parentOffset + 50;
    return top;
  }

  checkSharePos() {
    if ($('.social--vertical.social--affix').length) {
      $('.social--vertical.social--affix').removeAttr('style').removeClass('social--affix');
    }
  }

  // Deboutce function
  debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    window.addEventListener('resize', this.debounce(this.checkSharePos, 100));
    return true;
  }
}

export default new Social();
