class Header {
  constructor() {
    this.lastLetter = '';
    this.allSuggestions = [];
    this.selectedIndex = -1;
    this.maxSuggestions = 0;
    this.lastVal = '';

    this.sel = {
      component: '.header, .headerV2',
      toggle: '.header__navigation, .headerV2__navigation',
      menu: '.header__meganav, .headerV2__meganav',
      overlay: '.header__overlay',
      search: '.header__desktopSearch',
      searchForm: '.header__searchform',
      searchFormForm: '.header__searchform form',
      searchFormInput: '.header__searchform .form-field',
      searchFormInputClear: '.header__searchform .form-group .clear',
      searchSuggestions: '.header__searchform .suggestions',

      country: '.header__desktopCountry',
      countryForm: '.header__countrySelectPanel',
      countrySecondary: '.header__countrySelectPanel .mob .welcomes a'
    };

    this.cookieName = 'dhl-default-language';

    this.lastScrollTop = 0;

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.showSearch = this.showSearch.bind(this);
    this.hideSearch = this.hideSearch.bind(this);
    this.toggleCountry = this.toggleCountry.bind(this);
    this.showCountry = this.showCountry.bind(this);
    this.hideCountry = this.hideCountry.bind(this);
    this.selectCountrySecondary = this.selectCountrySecondary.bind(this);
    this.bodyScrolling = this.bodyScrolling.bind(this);

    this.checkScroll = this.checkScroll.bind(this);
    this.getPathPrefix = this.getPathPrefix.bind(this);
  }

  getPathPrefix() {
    const prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
    return (prefix ? prefix : '');
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    return true;
  }

  bindEvents() {
    $(document).on('keydown', this.sel.searchFormInput, (e) => {
      // down arrow = 40
      // right arrow = 39
      // up arrow = 38
      // left arrow = 37
      // tab = 9
      if ((e.keyCode === 9 && (!e.shiftKey)) || (e.keyCode === 40) || (e.keyCode === 39)) {
        this.selectedIndex++;
        if (this.selectedIndex >= this.maxSuggestions) {
          this.selectedIndex = 0;
        }
        this.showSuggestions(true);

        e.preventDefault();
        return false;
      } else if ((e.keyCode === 9 && (e.shiftKey)) || (e.keyCode === 37) || (e.keyCode === 38)) {
        this.selectedIndex--;
        if (this.selectedIndex < 0) {
          this.selectedIndex = this.maxSuggestions - 1;
        }
        this.showSuggestions(true);

        e.preventDefault();
        return false;
      }

      return true;
    });
    $(document).on('keypress', this.sel.searchFormInput, (e) => {
      if (e.keyCode === 13) {
        var field = $(e.currentTarget);
        var paramName = $(this.sel.searchFormInput).attr('name');
        var term = field.val().trim();
        var url = $(this.sel.searchFormForm).attr('action') + '?' + paramName + '=' + encodeURIComponent(term);
        window.location = url;
      }
    });
    $(document).on('keyup', this.sel.searchFormInput, (e) => {
      if ((e.keyCode === 16) || (e.keyCode === 9) || (e.keyCode === 40) || (e.keyCode === 39) || (e.keyCode === 37) || (e.keyCode === 38)) {
        return false;
      }

      var field = $(e.currentTarget);
      if (field.val().length > 0) {
        $('.top-searches', this.sel.component).hide();
        $(this.sel.searchFormInputClear).show();
        this.checkSuggestions(field);
      } else {
        this.clearSuggestions();
        $(this.sel.searchFormInputClear).hide();
        $('.top-searches', this.sel.component).show();
      }

      return true;
    });

    $(document).on('click', this.sel.searchFormInputClear, (e) => {
      $(this.sel.searchFormInput).val('');
      $(this.sel.searchFormInputClear).hide();
      this.clearSuggestions();
      e.preventDefault();
      return false;
    });

    $(document).on('click', this.sel.toggle, (e) => {
      e.preventDefault();
      this.toggleMenu();
    });
    $(document).on('click', this.sel.overlay, this.toggleMenu);
    $(document).on('click', this.sel.search, this.toggleSearch);
    $(document).on('click', this.sel.country, this.toggleCountry);
    $(document).on('click', this.sel.countrySecondary, this.selectCountrySecondary);

    $(document).on('click', '.header__lang, .header__countrySelectPanel .langs a, .header__countrySelectPanel .countries a', (evt) => {
      let href = $(evt.currentTarget).attr('href');
      let home = $(evt.currentTarget).attr('data-home');
      if (home !== null && home.length > 0) {
        href = home;
      }

      Cookies.set(this.cookieName, href);
    });

    $(window).on('scroll', this.checkScroll);
    this.checkScroll();

    if ($(this.sel.searchFormInput).length > 0) {
      if ($(this.sel.searchFormInput).val().length > 0) {
        $(this.sel.searchFormInputClear).show();
      }
    }
  }

  checkScroll() {
    var wt = $(window).scrollTop();
    var pb = $('.page-body').offset().top;
    if (wt > pb) {
      $('.page-body').addClass('fixed');
      $(this.sel.component).addClass('fixed');
      if (wt > this.lastScrollTop) {
        $(this.sel.component).removeClass('in');
        $(this.sel.searchSuggestions).addClass('hide');
      } else {
        $(this.sel.component).addClass('in');
        $(this.sel.searchSuggestions).removeClass('hide');
      }
    } else {
      $('.page-body').removeClass('fixed');
      $(this.sel.component).removeClass('fixed');
    }

    this.lastScrollTop = wt;
  }

  toggleMenu() {
    if (!$(this.sel.menu).is(':visible')) {
      this.bodyScrolling(false);
      $(this.sel.toggle).addClass('header__navigation--open');
      $(this.sel.component).addClass('headerV2__navigation--open');
    } else {
      this.bodyScrolling(true);
      $(this.sel.toggle).removeClass('header__navigation--open');
      $(this.sel.component).removeClass('headerV2__navigation--open');
    }
    $(this.sel.menu).slideToggle(150);

    if ($(this.sel.searchForm).hasClass('header__searchform--open')) {
      $(this.sel.searchForm).removeClass('header__searchform--open');
      $(this.sel.search).closest('.header__desktopLinkItem').removeClass('header__desktopLinkItem--open');

      setTimeout(() => {
        $(this.sel.search).removeClass('header__desktopSearch--close');
      }, 150);
    }
    if ($(this.sel.countryForm).hasClass('header__countrySelectPanel--open')) {
      $(this.sel.countryForm).removeClass('header__countrySelectPanel--open');
      $(this.sel.country).closest('.header__desktopLinkItem').removeClass('header__desktopLinkItem--open');

      setTimeout(() => {
        $(this.sel.search).removeClass('header__desktopCountry--close');
      }, 150);
    }
  }

  bodyScrolling(enabled) {
    if (enabled) {
      $('body').removeClass('modal-open');
      document.documentElement.style.height = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.body.style.height = 'auto';
    } else {
      $('body').addClass('modal-open');
      let windowHeight = window.screen.availHeight;
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = windowHeight.toString() + 'px';
      document.body.style.height = windowHeight.toString() + 'px';
    }
  }

  toggleSearch(e) {
    e.preventDefault();
    if ($(this.sel.search).hasClass('header__desktopSearch--close')) {
      this.hideSearch();
    } else {
      this.showSearch();

      $('.top-searches', this.sel.component).hide();
      $('.top-searches .items', this.sel.component).empty();

      var url = '';
      if ($(this.sel.searchFormForm).attr('data-topsearches').length > 0) {
        url = $(this.sel.searchFormForm).attr('data-topsearches');
      }
      if (url.length > 0) {
        $.get(this.getPathPrefix() + url, (result) => {
          var container = $('.top-searches .items', this.sel.component);
          var paramName = $(this.sel.searchFormInput).attr('name');
          var hasTerms = false;
          for (const element of result.results) {
            hasTerms = true;
            var term = element.trim();
            var searchUrl = $(this.sel.searchFormForm).attr('action') + '?' + paramName + '=' + encodeURIComponent(term);
            container.append(`<a href='${searchUrl}' title='${term}'><span>${term}</span></a>`);
          }

          if (hasTerms) {
            $('.top-searches', this.sel.component).show();
          }
        });
      }
    }
  }

  showSearch() {
    $(this.sel.countryForm).removeClass('header__countrySelectPanel--open');
    $(this.sel.country).closest('.header__desktopLinkItem').removeClass('header__desktopLinkItem--open');

    $(this.sel.search).addClass('header__desktopSearch--close');
    $(this.sel.search).closest('.header__desktopLinkItem').addClass('header__desktopLinkItem--open');
    $(this.sel.searchForm).addClass('header__searchform--open');
    $(this.sel.searchFormInput).focus();

    if ($(this.sel.toggle).hasClass('header__navigation--open')) {
      this.bodyScrolling(true);
      $(this.sel.toggle).removeClass('header__navigation--open');
      $(this.sel.menu).slideToggle(150);
    }
  }

  hideSearch() {
    $(this.sel.searchForm).removeClass('header__searchform--open');
    $(this.sel.search).closest('.header__desktopLinkItem').removeClass('header__desktopLinkItem--open');

    setTimeout(() => {
      $(this.sel.search).removeClass('header__desktopSearch--close');
    }, 150);
    return true;
  }

  checkSuggestions(field) {
    var val = $.trim(field.val());
    var s = val.substr(0, 1);
    if (s === this.lastLetter) {
      this.showSuggestions();
    } else {
      this.clearSuggestions();
      this.lastLetter = s;
      this.selectedIndex = -1;

      var url = '';
      if ($(this.sel.searchFormForm).attr('data-suggestions').length > 0) {
        url = $(this.sel.searchFormForm).attr('data-suggestions');
      }

      $.get(this.getPathPrefix() + url, { s: s }, (result) => {
        if (result.results.length === 0) {
          this.clearSuggestions();
        } else {
          this.allSuggestions = [];
          for (const element of result.results) {
            this.allSuggestions.push(element);
          }
          this.showSuggestions();
        }
      });
    }
  }

  clearSuggestions() {
    $(this.sel.searchSuggestions).empty().hide();
  }

  showSuggestions(useLastVal) {
    this.clearSuggestions();
    var val = $.trim($(this.sel.searchFormInput).val());
    if (useLastVal) {
      val = this.lastVal;
    } else {
      this.lastVal = val;
    }

    var hasTerms = false;
    var c = 0;
    for (var i = 0; i < this.allSuggestions.length; i++) {
      var contains = false;
      var terms = val.toLowerCase().split(/\s/);

      for (var t = 0; t < terms.length; t++) {
        contains = this.allSuggestions[i].toLowerCase().includes(terms[t].trim());
        if (contains) break;
      }
      if ((val.length === 1) || contains) {
        var paramName = $(this.sel.searchFormInput).attr('name');
        var term = this.allSuggestions[i].trim();
        var url = $(this.sel.searchFormForm).attr('action') + '?' + paramName + '=' + encodeURIComponent(term);
        var cls = '';
        if (c === this.selectedIndex) {
          $(this.sel.searchFormInput).val(term);
          cls = ' class="selected"';
        }
        $(this.sel.searchSuggestions).append(`<a${cls} href='${url}' title='${term}'><span>${term}</span></a>`);
        hasTerms = true;
        c++;
      }

      if (c >= 10) break;
    }
    this.maxSuggestions = c;

    if (hasTerms) {
      $(this.sel.searchSuggestions).show();
    }
  }

  toggleCountry(e) {
    e.preventDefault();
    if ($(this.sel.country).hasClass('header__desktopCountry--close')) {
      this.hideCountry();
    } else {
      this.showCountry();
    }
  }

  showCountry() {
    $(this.sel.searchForm).removeClass('header__searchform--open');
    $(this.sel.search).closest('.header__desktopLinkItem').removeClass('header__desktopLinkItem--open');
    setTimeout(() => {
      $(this.sel.search).removeClass('header__desktopSearch--close');
    }, 150);

    $(this.sel.country).addClass('header__desktopCountry--close');
    $(this.sel.country).closest('.header__desktopLinkItem').addClass('header__desktopLinkItem--open');
    $(this.sel.countryForm).addClass('header__countrySelectPanel--open');

    if ($(this.sel.toggle).hasClass('header__navigation--open')) {
      this.bodyScrolling(true);
      $(this.sel.toggle).removeClass('header__navigation--open');
      $(this.sel.menu).slideToggle(150);
    }
  }

  hideCountry() {
    $(this.sel.countryForm).removeClass('header__countrySelectPanel--open');
    $(this.sel.country).closest('.header__desktopLinkItem').removeClass('header__desktopLinkItem--open');
    $(this.sel.countryForm).find('.mob').removeClass('open');

    setTimeout(() => {
      $(this.sel.country).removeClass('header__desktopCountry--close');
    }, 150);
    return true;
  }

  selectCountrySecondary(e) {
    e.preventDefault();
    $(this.sel.countryForm).find('.mob').addClass('open');
  }
}

export default new Header();
