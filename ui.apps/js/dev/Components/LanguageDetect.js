class LanguageDetect {
  constructor() {
    this.sel = {
      component: '.root__countrySelectPanel'
    };

    this.redirect = true;
    this.cookieName = 'dhl-default-language';

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.init = this.init.bind(this);
  }

  getPathPrefix() {
    const prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
    return (prefix ? prefix : '');
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    if (!this.redirect) {
      $('.mask', this.sel).hide();
      return false;
    }

    let cookie = Cookies.get(this.cookieName);
    if (typeof cookie === 'undefined') {
      let language = window.navigator.userLanguage || window.navigator.language;
      let languagesData = JSON.parse($('#languagesData').html());
      let catchAll = '';
      let url = '';

      for (let i = 0; i < languagesData.variants.length; i++) {
        let variant = languagesData.variants[i];
        if (variant.languages === '*') {
          catchAll = this.getPathPrefix() + variant.path;
        }
        if (variant.languages.indexOf(language) >= 0) {
          url = this.getPathPrefix() + variant.path;
        }
      }
      if (url !== '') {
        Cookies.set(this.cookieName, url);
        window.location.href = url;
      } else if (catchAll !== '') {
        Cookies.set(this.cookieName, catchAll);
        window.location.href = catchAll;
      }
    } else {
      window.location.href = cookie;
    }

    $('.mask', this.sel).hide();

    return true;
  }
}

export default new LanguageDetect();
