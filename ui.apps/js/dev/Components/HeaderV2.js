class HeaderV2 {
  constructor() {
    this.sel = {
      component: '.headerV2-wrapper',
      toggle: '.headerV2__navigation',
      menu: '.headerV2__meganav',
      selectedCountry: '.headerV2__desktopCountry',
      countryOptions: '.header-countryList',
      categories: '.navigation-row__left',
      moreLink: '.navigation-item_more-less.more',
      lessLink: '.navigation-item_more-less.less',
    };

    this.cookieName = 'dhl-default-language';

    this.lastScrollTop = 0;

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.checkScroll = this.checkScroll.bind(this);
    this.showCountryOptions = this.showCountryOptions.bind(this);
    this.showHideMoreLink = this.showHideMoreLink.bind(this);
    this.showSecondRowOfCategories = this.showSecondRowOfCategories.bind(this);
    this.hideSecondRowOfCategories = this.hideSecondRowOfCategories.bind(this);

  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    this.showHideMoreLink();
    return true;
  }

  bindEvents() {
    $(window).on('stop.resize', this.showHideMoreLink);
    $(document).on('click', this.sel.moreLink, this.showSecondRowOfCategories);
    $(document).on('click', this.sel.lessLink, this.hideSecondRowOfCategories);

    $(document).ready(function(){
      $("#countrySearch").on("keyup", function() {
        const value = $(this).val().toLowerCase();
        $("#countryList-widget .header-countryList__option").filter(function() {
          $(this).toggle($(this).find(".country-name").text().toLowerCase().startsWith(value))
        });
      });
    });

    $(document).on('click', this.sel.toggle, (e) => {
      e.preventDefault();
      this.toggleMenu();
    });
    $(document).on('click', this.sel.selectedCountry, this.showCountryOptions);

    $(document).on('click', '.headerV2__lang', (evt) => {
      var href = $(evt.currentTarget).attr('href');
      var home = $(evt.currentTarget).attr('data-home');
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
      $(this.sel.selectedCountry).attr("aria-expanded", "false")
      $(this.sel.countryOptions).hide();
      if (wt > this.lastScrollTop) {
        $(this.sel.component).removeClass('in');
      } else {
        $(this.sel.component).addClass('in');
        if ($(this.sel.countryOptions).hasClass('header-countryList--open')) {
          $(this.sel.selectedCountry).attr("aria-expanded", "true")
          $(this.sel.countryOptions).show();
        }
      }
    } else {
      $('.page-body').removeClass('fixed');
      $(this.sel.component).removeClass('fixed');
      if ($(this.sel.countryOptions).hasClass('header-countryList--open')) {
        $(this.sel.selectedCountry).attr("aria-expanded", "true")
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
    if($(this.sel.countryOptions).hasClass('header-countryList--open')) {
      closeOptions();
    }

    $(this.sel.countryOptions).addClass('header-countryList--open');
    $(this.sel.selectedCountry).attr("aria-expanded", "true")
    $(this.sel.countryOptions).show();

    const clickListener = (event) => {
      const $target = $(event.target);

      if (!$target.closest('.header-countryList').length) {
        event.preventDefault();
        closeOptions();
      }
    }

    const keyupListener = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeOptions();
      }
    }

    const closeOptions = () => {
      $("#countrySearch").val("");
      $("#countrySearch").trigger("keyup");
      $(this.sel.countryOptions).removeClass('header-countryList--open');
      $(this.sel.selectedCountry).attr("aria-expanded", "false")
      $(this.sel.countryOptions).hide();
      document.removeEventListener('click', clickListener);
      document.removeEventListener('click', keyupListener);
    }

    $("#countrySearch").focus();
    document.addEventListener('click', clickListener);
    document.addEventListener('keyup', keyupListener);
  }

  showHideMoreLink() {
    if ($(this.sel.categories).prop('scrollHeight') > $(this.sel.categories).prop('clientHeight')) {
      $(this.sel.moreLink).show();
    } else {
      $(this.sel.moreLink).hide();
    }
  }

  showSecondRowOfCategories() {
    $(this.sel.categories).css({'overflow': 'unset', 'max-height': 'unset'});
    $(this.sel.moreLink).hide();
    $(this.sel.lessLink).show();
  }

  hideSecondRowOfCategories() {
    $(this.sel.categories).css({'overflow': 'hidden', 'max-height': '51px'});
    $(this.sel.moreLink).show();
    $(this.sel.lessLink).hide();
  }
}

export default new HeaderV2();
