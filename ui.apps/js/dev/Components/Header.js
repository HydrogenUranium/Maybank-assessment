class Header {
  constructor() {
    const headerIconElement = document.querySelector('#header__navigation__text');
    this.openHamburgerMenuText = headerIconElement.getAttribute('data-open-hamburger-menu-text');
    this.closeHamburgerMenuText = headerIconElement.getAttribute('data-close-hamburger-menu-text');
    this.sel = {
      component: 'header',
      wrapper: '.header-wrapper',
      toggle: '.header__navigation',
      menu: '.header__meganav',
      selectedCountry: '.header__desktopCountry',
      countryOptions: '.header-countryList',
      countrySearch: '#countrySearch',
      categories: '.navigation-row__left',
      moreLink: '.navigation-item_more-less.more',
      lessLink: '.navigation-item_more-less.less',
      body: 'body',
    };

    this.cookieName = 'dhl-default-language';

    this.header = document.querySelector(this.sel.component);
    this.lastScrollTop = window.scrollY;

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.headerScrollHandler = this.headerScrollHandler.bind(this);
    this.showCountryOptions = this.toggleCountryOptions.bind(this);
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

    $(document).on('click', this.sel.toggle, (e) => {
      e.preventDefault();
      this.toggleMenu();
    });
    $(document).on('click', this.sel.selectedCountry, this.showCountryOptions);

    $(document).on('click', '.header__lang', (evt) => {
      var href = $(evt.currentTarget).attr('href');
      var home = $(evt.currentTarget).attr('data-home');
      if (home !== null && home.length > 0) {
        href = home;
      }

      Cookies.set(this.cookieName, href);
    });

    $(window).on('scroll', this.headerScrollHandler);
    this.initHeader();

  }

  /*
    Initialize the header based on the scroll position.
    If the scroll position is greater than the height of the header, then the header is sticky and animation is turned on.
  */
  initHeader() {
    const scrollTop = window.scrollY;
    const headerHeight = this.header.offsetHeight
    if(scrollTop > headerHeight) {
      this.header.classList.add("sticky-header");
      this.header.classList.add("sticky-header--with-transition");
    }
  }

  /*
    Handle scroll behaviour for the header.
    At the top of the page the header is not sticky.
    If the user scrolls down, the sticky header is hidden.
    If the user scrolls up, the sticky header is shown.
  */
  headerScrollHandler() {
    const scrollTop = window.scrollY;
    const headerHeight = this.header.offsetHeight
    // Reset sticky header styles if the user scrolls to the top of the page.
    if(scrollTop == 0) {
      this.header.classList.remove("sticky-header--with-transition");
      this.header.classList.remove("sticky-header");
      this.header.classList.remove("sticky-header--hidden");
    }
    // If the user scrolls less than the height of the header, keep previous behaviour
    // (sticky if scroll from bottom, regular if scroll from top to bottom).
    if(scrollTop < headerHeight) {
      this.lastScrollTop = scrollTop;
      return;
    }

    // If the user scrolls down, hide the sticky header.
    if (scrollTop > this.lastScrollTop) {
      this.header.classList.add("sticky-header");
      this.header.classList.add("sticky-header--hidden");

    // If the user scrolls up, show the sticky header.
    } else if (scrollTop < this.lastScrollTop) {
      this.header.classList.add("sticky-header--with-transition");
      this.header.classList.remove("sticky-header--hidden");
    }
    // Update the last scroll position.
    this.lastScrollTop = scrollTop;
  }

  toggleMenu() {
    if (!$(this.sel.menu).is(':visible')) {
      this.bodyScrolling(false);
      $(this.sel.toggle).addClass('header__navigation--open');
      $(this.sel.wrapper).addClass('header__navigation--open');
      this.disableAnchorLinks(true);
      navigationElement.setAttribute('aria-label', this.openHamburgerMenuText);
    } else {
      this.bodyScrolling(true);
      $(this.sel.toggle).removeClass('header__navigation--open');
      $(this.sel.wrapper).removeClass('header__navigation--open');
      this.disableAnchorLinks(false);
      navigationElement.setAttribute('aria-label', this.closeHamburgerMenuText);
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

  toggleCountryOptions(e) {
    const countryOptions = document.querySelector(this.sel.countryOptions);
    const countrySearch = document.querySelector(this.sel.countrySearch);
    const selectedCountry = document.querySelector(this.sel.selectedCountry);

    const closeCountryList = () => {
      countryOptions.classList.remove('header-countryList--open');
      countryOptions.setAttribute("aria-hidden", "true");
      countryOptions.removeEventListener('keyup', inputListener)
      selectedCountry.setAttribute("aria-expanded", "false");
      document.removeEventListener('click', clickListener);
      document.removeEventListener('keyup', keyupListener);
      document.removeEventListener('scroll', globalScrollListener);
    };

    const openCountryList = () => {
      countryOptions.classList.add('header-countryList--open');
      selectedCountry.setAttribute("aria-expanded", "true");
      countryOptions.setAttribute("aria-hidden", "false");
      countryOptions.addEventListener('keyup', inputListener)
      setTimeout(() => {
         if(countryOptions.classList.contains('header-countryList--open')) {
            countrySearch.focus();
         }
      }, 300); // delay to focus on input to wait for the animation to finish
      document.addEventListener('click', clickListener);
      document.addEventListener('keyup', keyupListener);
      document.addEventListener('scroll', globalScrollListener);
    }

    const clickListener = (event) => {
      if (!event.target.closest('.header-countryList')) {
        closeCountryList();
      }
    };

    const keyupListener = (event) => {
      if (event.key === 'Escape') {
        closeCountryList();
      }
    };

    const globalScrollListener = (event) => {
        closeCountryList();
    };

    const filerCountries = (value) => {
      $("#countryList-widget .header-countryList__option").each(function() {
          const country = $(this).find(".country-name");
          const values = [
            country.text(),
            country.attr("country-code"),
            country.attr("country-name")
          ];

          const isMatch = values
            .filter(Boolean)
            .map(v => v.toLowerCase().trim())
            .some(v => v.startsWith(value));

          $(this).toggle(isMatch);
      });
    }

    const inputListener = (event) => {
      filerCountries(countrySearch.value.toLowerCase());
    }

    e.preventDefault();
    countryOptions.classList.contains('header-countryList--open')
      ? closeCountryList()
      : openCountryList()
  }

  showHideMoreLink() {
    if ($(this.sel.categories).prop('scrollHeight') > $(this.sel.categories).prop('clientHeight')) {
      $(this.sel.moreLink).show();
    } else {
      $(this.sel.moreLink).hide();
    }
  }

  showSecondRowOfCategories() {
    this.lastScrollTop = undefined;
    $(this.sel.categories).css({'overflow': 'unset', 'max-height': 'unset'});
    $(this.sel.moreLink).hide();
    $(this.sel.lessLink).show();
  }

  hideSecondRowOfCategories() {
    this.lastScrollTop = undefined;
    $(this.sel.categories).css({'overflow': 'hidden', 'max-height': '5.1rem'});
    $(this.sel.moreLink).show();
    $(this.sel.lessLink).hide();
  }

  /* this method blocks the background when toggle menu is enabled*/
  disableAnchorLinks(value) {
    const body = document.querySelector(this.sel.body);
    if (value && body) {
      const overlayDiv = document.createElement('div');
      overlayDiv.id = 'overlay';
      overlayDiv.classList.add('enableGreyOutArea');
      overlayDiv.addEventListener('click', this.toggleMenu);
      body.appendChild(overlayDiv);
    } else {
      const overlayDiv = document.getElementById('overlay');
      if (overlayDiv) {
        overlayDiv.parentNode.removeChild(overlayDiv);
      }
    }
  }
}

export default new Header();
