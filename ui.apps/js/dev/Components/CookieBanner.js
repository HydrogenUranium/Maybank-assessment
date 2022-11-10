class CookieBanner {
  constructor() {
    this.sel = {
      component: '.cookie-banner',
      closeButton: '.cookie-banner__button'
    };

    this.cookieName = 'dhl-cookie-warning';

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.hideCookieBanner = this.hideCookieBanner.bind(this);
    this.showCookieBanner = this.showCookieBanner.bind(this);
    this.displayBanner = this.displayBanner.bind(this);
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    this.displayBanner();
    return true;
  }

  bindEvents() {
    $(document).on('click', this.sel.closeButton, () => {
      this.hideCookieBanner();
      Cookies.set(this.cookieName, {seen: 1});
    });
  }

  displayBanner() {
    let cookie = Cookies.get(this.cookieName);

    if (typeof cookie === 'undefined') {
      this.showCookieBanner();
    }
  }

  showCookieBanner() {
    $(this.sel.component).addClass('cookie-banner--display');
  }

  hideCookieBanner() {
    $(this.sel.component).removeClass('cookie-banner--display');
    $(this.sel.component).remove();
  }
}

export default new CookieBanner();
