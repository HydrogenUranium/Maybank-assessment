class HeaderV2 {
  constructor() {
    this.sel = {
      component: '.headerV2-wrapper',
      toggle: '.headerV2__navigation',
      menu: '.headerV2__meganav',
      selectedCountry: '.headerV2__desktopCountry',
      countryOptions: '.header-countryList',
    };

    this.cookieName = 'dhl-default-language';

    this.lastScrollTop = 0;

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.checkScroll = this.checkScroll.bind(this);
    this.showCountryOptions = this.showCountryOptions.bind(this);
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    return true;
  }

  bindEvents() {
    $(document).on('click', this.sel.toggle, (e) => {
      e.preventDefault();
      this.toggleMenu();
    });
    $(document).on('click', this.sel.selectedCountry, this.showCountryOptions);

    $(document).on('click', '.headerV2__lang', (evt) => {
      let href = $(evt.currentTarget).attr('href');
      let home = $(evt.currentTarget).attr('data-home');
      if (home !== null && home.length > 0) {
        href = home;
      }

      Cookies.set(this.cookieName, href);
    });

    $(window).on('scroll', this.checkScroll);
    this.checkScroll();
  }

  checkScroll() {
    var wt = $(window).scrollTop();
    var pb = $('.page-body').offset().top;
    if (wt > pb) {
      $('.page-body').addClass('fixed');
      $(this.sel.component).addClass('fixed');
      $(this.sel.countryOptions).hide();
      if (wt > this.lastScrollTop) {
        $(this.sel.component).removeClass('in');
      } else {
        $(this.sel.component).addClass('in');
        if ($(this.sel.countryOptions).hasClass('header-countryList--open')) {
          $(this.sel.countryOptions).show();
        }
      }
    } else {
      $('.page-body').removeClass('fixed');
      $(this.sel.component).removeClass('fixed');
      if ($(this.sel.countryOptions).hasClass('header-countryList--open')) {
        $(this.sel.countryOptions).show();
      }
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
  }

  bodyScrolling(enabled) {
    if (enabled) {
      document.documentElement.style.height = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.body.style.height = 'auto';
    } else {
      let windowHeight = window.screen.availHeight;
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = windowHeight.toString() + 'px';
      document.body.style.height = windowHeight.toString() + 'px';
    }
  }

  showCountryOptions(e) {
    e.preventDefault();
    $(this.sel.countryOptions).addClass('header-countryList--open')
    $(this.sel.countryOptions).show();

    var clickListener = (event) => {
      var $target = $(event.target);
      if (!$target.closest('.header-countryList__option').length && $('.header-countryList__option').is(':visible')) {
        $(this.sel.countryOptions).removeClass('header-countryList--open');
        $(this.sel.countryOptions).hide();
        removeClickListener();
      } else {
        var $countrySelected = $('.header-countryList__option input[name="country-option"]:checked');
        if ($countrySelected.length) {
          removeClickListener();
          $(this.sel.countryOptions).removeClass('header-countryList--open');
          $(this.sel.countryOptions).hide();
          window.location.href = $countrySelected.data("path");
        }
      }
    }

    var removeClickListener = () => {
      document.removeEventListener('click', clickListener);
    }

    document.addEventListener('click', clickListener);
  }
}

export default new HeaderV2();
