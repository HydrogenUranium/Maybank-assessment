(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ArticleGridApi = function () {
  function ArticleGridApi(endpoint) {
    var pageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;

    _classCallCheck(this, ArticleGridApi);

    this.endpoint = endpoint;
    this.pageSize = pageSize;
    this.skip = 0;

    this.doRequest = this.doRequest.bind(this);
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  _createClass(ArticleGridApi, [{
    key: 'doRequest',
    value: function doRequest(callback) {
      var _this = this;

      var keyword = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      $.get(this.endpoint, {
        skip: this.skip,
        pageSize: this.pageSize,
        keyword: keyword
      }, function (data) {
        _this.skip += data.Items.length;
        callback(data);
      });
    }
  }, {
    key: 'search',
    value: function search(callback, keyword) {
      this.skip = 0;
      this.doRequest(callback, keyword);
    }
  }, {
    key: 'loadMore',
    value: function loadMore(callback) {
      this.doRequest(callback);
    }
  }]);

  return ArticleGridApi;
}();

var ArticleGrid = function () {
  function ArticleGrid() {
    _classCallCheck(this, ArticleGrid);

    this.loading = false;
    this.hasmore = true;

    this.sel = {
      component: '.articleGrid',
      grid: '.articleGrid__grid',
      loadMore: '.articleGrid__loadMore',
      template: '#articleGrid__panelTemplate',
      nav: '.articleGrid__nav'
    };
    this.template = $($(this.sel.template).html());

    this.bindEvents = this.bindEvents.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.populateTemplates = this.populateTemplates.bind(this);
    this.init = this.init.bind(this);
    this.showSpinner = this.showSpinner.bind(this);
    this.hideSpinner = this.hideSpinner.bind(this);
    this.scrollnav = this.scrollnav.bind(this);
    this.scrollleft = this.scrollleft.bind(this);
    this.scrollright = this.scrollright.bind(this);
    this.checkScroll = this.checkScroll.bind(this);
    this.pageScroll = this.pageScroll.bind(this);
  }

  _createClass(ArticleGrid, [{
    key: 'bindEvents',
    value: function bindEvents() {
      $(window).on('scroll', this.pageScroll);
      $(document).on('click', this.sel.loadMore, this.loadMore);
      $(document).on('click', '.scrollleft', this.scrollleft);
      $(document).on('click', '.scrollright', this.scrollright);

      this.pageScroll();
    }
  }, {
    key: 'pageScroll',
    value: function pageScroll() {
      if (this.hasmore && !this.loading) {
        var wnd = $(window);
        var elm = $(this.sel.loadMore);

        if (elm && $(elm).length > 0) {
          var wst = wnd.scrollTop();
          var wh = wnd.height();
          var ot = elm.offset().top;
          var oh = elm.outerHeight();

          if (wst + wh > ot + oh) {
            this.loadMore();
          }
        }
      }
    }
  }, {
    key: 'loadMore',
    value: function loadMore(e) {
      if (e) {
        e.preventDefault();
      }

      this.loading = true;
      // Show the loading spinner
      this.showSpinner();

      var t = 0;
      $(".articleGrid__item", this.sel.component).each(function (index, item) {
        if (t < 6 && !$(item).is(":visible")) {
          $(item).show();
          t++;
        }
      });

      if ($(".articleGrid__item", this.sel.component).length === $(".articleGrid__item:visible", this.sel.component).length) {
        $(this.sel.loadMore).parents(".row").first().remove();
        this.hasmore = false;
      }

      // Hide the loading spinner
      this.hideSpinner();
      this.loading = false;
    }
  }, {
    key: 'showSpinner',
    value: function showSpinner() {
      $(this.sel.loadMore).addClass('articleGrid__loadMore--loading');
    }
  }, {
    key: 'hideSpinner',
    value: function hideSpinner() {
      $(this.sel.loadMore).removeClass('articleGrid__loadMore--loading');
    }
  }, {
    key: 'scrollnav',
    value: function scrollnav() {
      var $scrollnav = document.querySelector(this.sel.nav);
      if ($scrollnav === null) return;
      var scrollWidth = $scrollnav.scrollWidth;
      var clientWidth = $scrollnav.clientWidth;
      if (scrollWidth > clientWidth) {
        $(this.sel.nav).after('<i class="scrollright">></i>');
      }
    }
  }, {
    key: 'scrollright',
    value: function scrollright() {
      var self = this.sel.nav;
      var scrollWidth = document.querySelector(self).scrollWidth;
      $(self).animate({
        scrollLeft: scrollWidth + 'px'
      }, 500, function () {
        $('.scrollright').remove();
        $(self).before('<i class="scrollleft"><</i>');
      });
    }
  }, {
    key: 'scrollleft',
    value: function scrollleft() {
      var self = this.sel.nav;
      $(self).animate({
        scrollLeft: 0
      }, 500, function () {
        $('.scrollleft').remove();
        $(self).after('<i class="scrollright">></i>');
      });
    }
  }, {
    key: 'checkScroll',
    value: function checkScroll() {
      var $scrollnav = document.querySelector(this.sel.nav);
      if ($scrollnav === null) return;
      var scrollWidth = $scrollnav.scrollWidth;
      var clientWidth = $scrollnav.clientWidth;
      var scrollGap = scrollWidth - clientWidth;
      $(self).scroll(function () {
        if (this.scrollLeft === 0) {
          $('.scrollleft').remove();
          $(self).after('<i class="scrollright">></i>');
        }
        if (this.scrollLeft >= scrollGap) {
          $('.scrollright').remove();
          $(self).before('<i class="scrollleft"><</i>');
        }
      });
    }
  }, {
    key: 'populateTemplates',
    value: function populateTemplates(items) {
      var output = [];
      for (var i = 0; i < items.length; i++) {
        // Clone template
        var $template = this.template.clone();
        // Get the item
        var item = items[i];
        // Set image breakpoint
        var desktopBreakpoint = 992;
        // Generate ID
        var panelId = Math.random().toString(36).substr(2, 9);
        // Populate ID
        $template.find('.articlePanel').attr('id', panelId);
        // If large panel
        if (item.IsLarge) {
          // Update image breakpoint
          desktopBreakpoint = 768;
          // Add class
          $template.find('.articlePanel').addClass('articlePanel--large');
        }
        // If video
        if (item.IsVideo) {
          // Add class
          $template.find('.articlePanel').addClass('articlePanel--video');
        }
        // Populate images
        $template.find('.articlePanel__image').attr({
          href: item.Link,
          title: item.Title
        }).attr('style', 'background-image: url(' + item.Images.Mobile + ');');
        $template.find('style')[0].innerHTML = '@media screen and (min-width: ' + desktopBreakpoint + 'px){#' + panelId + ' .articlePanel__image{background-image: url(' + item.Images.Desktop + ') !important;}}';
        // Populate link
        $template.find('.articlePanel__content > a').attr({
          href: item.Link,
          title: item.Title
        });
        // Populate title
        $template.find('.articlePanel__title').text(item.Title);
        // Populate description
        $template.find('.articlePanel__description').text(item.Description);
        // Populate category
        $template.find('.articlePanel__subTitle a:first-child').attr({
          'href': item.Category.Link,
          'title': item.Category.Name
        }).text(item.Category.Name);
        // Populate time to read
        $template.find('.articlePanel__subTitle a:last-child').attr({
          'href': item.Link,
          'title': item.Title
        }).text(item.TimeToRead);
        // Push item to output
        output.push($template);
      }
      return output;
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      var endpoint = $(this.sel.component).attr('data-endpoint');
      this.API = new ArticleGridApi(endpoint);
      this.scrollnav();
      this.bindEvents();
      this.checkScroll();
      return true;
    }
  }]);

  return ArticleGrid;
}();

exports.default = new ArticleGrid();

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthenticationEvents = function () {
  function AuthenticationEvents() {
    _classCallCheck(this, AuthenticationEvents);

    this.config = {
      urlToken: '/libs/granite/csrf/token.json',
      urlCheck: '/bin/dhl/check/index.json',
      urlRefreshCheck: '/bin/dhl/refresh_token/index.json',
      urlDownloadAsset: '/bin/dhl/download_asset/index.json'
    };

    this.init = this.init.bind(this);

    this.readCookie = this.readCookie.bind(this);
    this.clearCookie = this.clearCookie.bind(this);
    this.createCookie = this.createCookie.bind(this);

    this.checkLoginStatus = this.checkLoginStatus.bind(this);
    this.checkAuthTokens = this.checkAuthTokens.bind(this);

    this.showLoggedInElements = this.showLoggedInElements.bind(this);
    this.showNotLoggedInElements = this.showNotLoggedInElements.bind(this);
  }

  _createClass(AuthenticationEvents, [{
    key: 'init',
    value: function init() {
      var _this = this;

      $(window).on('checkauthtokens.DHL', function (evt, tokenData, skipElements) {
        _this.checkAuthTokens(tokenData, skipElements);
      });
      $(window).on('userloggedin.DHL', function (evt, tokenData) {
        _this.showLoggedInElements(tokenData);
      });
      $(window).on('usernotloggedin.DHL', function () {
        _this.showNotLoggedInElements();
      });

      // logged in header (logout link)
      var loggedInHeader = $('.footer .footer__ctas--loggedin');
      if (loggedInHeader.length > 0) {
        loggedInHeader.on('click', '.logout-link', function () {
          _this.clearCookie('DHL.AuthToken');
          _this.clearCookie('DHL.RefreshToken');
          location.reload();

          return false;
        });
      }

      this.checkLoginStatus();
    }
  }, {
    key: 'readCookie',
    value: function readCookie(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length);
        }if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }

      return null;
    }
  }, {
    key: 'clearCookie',
    value: function clearCookie(name) {
      this.createCookie(name, '', -1);
    }
  }, {
    key: 'createCookie',
    value: function createCookie(name, value, expirySeconds) {
      var expires = '';
      if (expirySeconds) {
        var date = new Date();
        date.setTime(date.getTime() + expirySeconds * 1000);
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + value + expires + '; path=/';
    }
  }, {
    key: 'checkLoginStatus',
    value: function checkLoginStatus() {
      var cookie = this.readCookie('DHL.AuthToken');
      if (cookie !== null) {
        var authSplit = cookie.split('|');
        if (authSplit.length >= 2) {
          this.callTokenCheck(this.config.urlCheck, {
            username: authSplit[0],
            token: authSplit[1]
          });
        } else {
          $(window).trigger('usernotloggedin.DHL');
        }
      } else {
        var refreshCookie = this.readCookie('DHL.RefreshToken');
        if (refreshCookie !== null) {
          var refreshCookieSplit = refreshCookie.split('|');
          if (refreshCookieSplit.length >= 2) {
            this.callTokenCheck(this.config.urlRefreshCheck, {
              username: refreshCookieSplit[0],
              refresh_token: refreshCookieSplit[1]
            });
          } else {
            $(window).trigger('usernotloggedin.DHL');
          }
        } else {
          $(window).trigger('usernotloggedin.DHL');
        }
      }
    }
  }, {
    key: 'callTokenCheck',
    value: function callTokenCheck(url, data) {
      var _this2 = this;

      $.get(this.config.urlToken, function (csrfresponse) {
        var csrftoken = csrfresponse.token;

        $.ajax({
          url: url,
          data: data,
          type: 'post',
          headers: { 'CSRF-Token': csrftoken },
          dataType: 'json',
          success: function success(response) {
            _this2.checkAuthTokens(response, false);
          }
        });
      });
    }
  }, {
    key: 'checkAuthTokens',
    value: function checkAuthTokens(tokenData, skipElements) {
      if (tokenData && tokenData.status && tokenData.status === 'ok') {
        this.createCookie('DHL.AuthToken', tokenData.username + '|' + tokenData.token, tokenData.ttl);
        this.createCookie('DHL.RefreshToken', tokenData.username + '|' + tokenData.refresh_token, 24 * 60 * 60);

        if (skipElements !== true) {
          $(window).trigger('userloggedin.DHL', tokenData);
        }

        return;
      }

      if (skipElements !== true) {
        $(window).trigger('usernotloggedin.DHL');
      }
    }
  }, {
    key: 'showLoggedInElements',
    value: function showLoggedInElements(tokenData) {
      var _this3 = this;

      $('.below-register-form .tab.mobile').hide();

      $('.below-register-form #register-tab-1').hide();
      $(".below-register-form .tab-contents .tab-content[data-rel='#register-tab-1']").removeClass('open');

      $('.below-register-form #register-tab-2').addClass('active').show();
      $(".below-register-form .tab-contents .tab-content[data-rel='#register-tab-2']").addClass('open');

      $('.below-register-form').show();

      $('header .header__desktopLinkItem.logged-in .user-firstname, header .header__primaryLinks .user-firstname').text(tokenData.name);
      $('header .header__desktopLinkItem.logged-in, header .header__primaryLinks.logged-in').show();
      $('.footer .logout-links').show();

      $('.competitionDataCapture.logged-in').show();
      $('.competitionDataCapture.logged-in .loggedin-name').text(tokenData.name);
      $('.cta-third-panel-loggedin').show();

      $('.gated').addClass('unlocked').removeClass('locked').each(function (index, item) {
        $(item).closest('body').find('.hero .hero__cta--grey').show();
      });
      $('.gated-hide').addClass('unlocked').removeClass('locked');

      $('.articleGrid .article-grid-item-loggedin').show();

      if (tokenData.full === false) {
        $('.create-password').find('.create-password-name').text(tokenData.name);
        $(window).trigger('show.CreatePasswordModal.DHL');
      }

      if ($('.reset-password-container').length > 0) {
        window.location = '/content/dhl.html';
      }
      if ($('.page-body.register').length > 0) {
        window.location = '/content/dhl/your-account.html';
      }

      if ($('.gatingArticle__actions.logged-in').length > 0) {
        var gatingArticleElm1 = $('.gatingArticle__actions.logged-in');

        $.get(this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;
          $.ajax({
            url: _this3.config.urlDownloadAsset,
            data: { assetinfo: gatingArticleElm1.data('assetinfo') },
            type: 'post',
            headers: { 'CSRF-Token': csrftoken },
            dataType: 'json',
            success: function success(response) {
              if (response.status === 'ok') {
                gatingArticleElm1.find('.gatingArticle__button').attr('href', response.href);
                gatingArticleElm1.show();
              }
            }
          });
        });
      }

      if ($('#download .download__ctas.logged-in').length > 0) {
        var gatingArticleElm2 = $('#download .download__ctas.logged-in');

        $.get(this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;
          $.ajax({
            url: _this3.config.urlDownloadAsset,
            data: { assetinfo: gatingArticleElm2.data('assetinfo') },
            type: 'post',
            headers: { 'CSRF-Token': csrftoken },
            dataType: 'json',
            success: function success(response) {
              if (response.status === 'ok') {
                gatingArticleElm2.find('.download__cta--red').attr('href', response.href);
                gatingArticleElm2.show();
              }
            }
          });
        });
      }
    }
  }, {
    key: 'showNotLoggedInElements',
    value: function showNotLoggedInElements() {
      $('.below-register-form .tab-container #register-tab-1').addClass('active').show();
      $(".below-register-form .tab-contents .tab-content[data-rel='#register-tab-1']").addClass('open');

      $('.below-register-form #register-tab-2').removeClass('active').show();
      $(".below-register-form .tab-contents .tab-content[data-rel='#register-tab-2']").removeClass('open');

      $('.below-register-form').show();

      $('header .header__desktopLinkItem.logged-out, header .header__primaryLinks.logged-out').show();
      $('.footer .login-links').show();

      $('.gatingArticle__actions.no-logged-in').show();
      $('#download .download__ctas.no-logged-in').show();
      $('.competitionDataCapture.not-logged-in').show();
      $('.article-page-login-cta').show();

      $('.gated').addClass('locked').removeClass('unlocked').each(function (index, item) {
        $(item).closest('body').find('.hero .hero__cta--grey').hide();
      });
      $('.gated-hide').addClass('locked').removeClass('unlocked');

      var newsletterCookie = this.readCookie('DHL.NewsletterSubscribed');
      if (newsletterCookie !== null) {
        $('.articleGrid .article-grid-item-loggedin').show();
      } else {
        $('.articleGrid .article-grid-item-subscribe').show();
        $('.subscribePanel').show();
      }
    }
  }]);

  return AuthenticationEvents;
}();

exports.default = new AuthenticationEvents();

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BackButton = function () {
  function BackButton() {
    _classCallCheck(this, BackButton);

    this.sel = {
      component: '.backButton',
      backButton: '.backButton__button--back',
      forwardButton: '.backButton__button--forward'
    };

    this.init = this.init.bind(this);
    this.showButton = this.showButton.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.initHeadroom = this.initHeadroom.bind(this);
  }

  _createClass(BackButton, [{
    key: 'showButton',
    value: function showButton() {
      $(this.sel.component).addClass('backButton--show');
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      $(document).on('click', this.sel.backButton, this.goBack);
      $(document).on('click', this.sel.forwardButton, this.goForward);
    }
  }, {
    key: 'goBack',
    value: function goBack(e) {
      e.preventDefault();
      history.back(-1);
    }
  }, {
    key: 'goForward',
    value: function goForward(e) {
      e.preventDefault();
      history.forward();
    }
  }, {
    key: 'initHeadroom',
    value: function initHeadroom() {
      var component = $(this.sel.component)[0];
      var headroom = new Headroom(component, {
        classes: {
          initial: 'backButton',
          pinned: 'backButton--pinned',
          unpinned: 'backButton--unpinned',
          top: 'backButton--top',
          notTop: 'backButton--not-top',
          bottom: 'backButton--bottom',
          notBottom: 'backButton--not-bottom'
        }
      });
      headroom.init();
    }
  }, {
    key: 'init',
    value: function init() {
      var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      if (!standalone) return;
      this.bindEvents();
      this.showButton();
      this.initHeadroom();
    }
  }]);

  return BackButton;
}();

exports.default = new BackButton();

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BootstrapCarousel = function () {
  function BootstrapCarousel() {
    _classCallCheck(this, BootstrapCarousel);

    this.sel = {
      component: '.carousel',
      items: '.carousel-item',
      link: '.categoryHero__link'
    };
    this.init = this.init.bind(this);
    this.checkNumberSlides = this.checkNumberSlides.bind(this);
    this.touchSwipeCarousel = this.touchSwipeCarousel.bind(this);
  }

  _createClass(BootstrapCarousel, [{
    key: 'checkNumberSlides',
    value: function checkNumberSlides() {
      var _this = this;

      $(this.sel.component).each(function (index, $elm) {
        if ($($elm).find(_this.sel.items).length <= 1) {
          $($elm).addClass('static');
        }
      });
    }
  }, {
    key: 'touchSwipeCarousel',
    value: function touchSwipeCarousel() {
      var _this2 = this;

      var isSwipe = false;
      $(this.sel.component).swipe({
        swipe: function swipe(event, direction) {
          var $carousel = $(event.target).is(_this2.sel.component) ? $(event.target) : $(event.target).parents(_this2.sel.component);
          isSwipe = true;
          if (direction === 'left') {
            $carousel.carousel('next');
          } else if (direction === 'right') {
            $carousel.carousel('prev');
          }
        },
        tap: function tap(event) {
          // target variable represents the clicked object
          if ($('.categoryHero__link').length && window.innerWidth < 992) {
            var href = $(event.target).parents('.categoryHero__link').first().attr('data-href');
            if (href !== '') {
              window.location = href;
            }
          }
        },
        allowPageScroll: 'vertical'
      });

      $(this.sel.link).on('click', function () {
        if (!isSwipe) {
          var href = $(this).attr('data-href');
          if (href !== '') {
            window.location = href;
          }
        }
        isSwipe = false;
      });
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.touchSwipeCarousel();
      this.checkNumberSlides();
      return true;
    }
  }]);

  return BootstrapCarousel;
}();

exports.default = new BootstrapCarousel();

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CompetitionForm = function () {
  function CompetitionForm() {
    _classCallCheck(this, CompetitionForm);

    this.config = {
      urlToken: '/libs/granite/csrf/token.json',
      urlRefreshCheck: '/bin/dhl/refresh_token/index.json',
      urlGetAllDetails: '/bin/dhl/getdetails/index.json',
      urlCompetition: '/bin/dhl/competition/index.json'
    };

    this.sel = {
      component: '.competitionDataCapture form'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.readCookie = this.readCookie.bind(this);
    this.validate = this.validate.bind(this);

    this.tryCompetitionEntryLoggedIn = this.tryCompetitionEntryLoggedIn.bind(this);
    this.tryCompetitionEntryNotLoggedIn = this.tryCompetitionEntryNotLoggedIn.bind(this);
    this.completeCompetitionEntryLoggedIn = this.completeCompetitionEntryLoggedIn.bind(this);
  }

  _createClass(CompetitionForm, [{
    key: 'bindEvents',
    value: function bindEvents() {}
  }, {
    key: 'readCookie',
    value: function readCookie(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length);
        }if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }

      return null;
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      this.validate();
      return true;
    }
  }, {
    key: 'validate',
    value: function validate() {
      var _this = this;

      var competitionEntry = $(this.sel.component);

      if (competitionEntry.length > 0) {
        competitionEntry.each(function (index, item) {
          if ($(item).closest('.competitionDataCapture').hasClass('not-logged-in')) {
            $(item).validate({
              rules: {
                register__yourEmail: 'email'
              },
              errorPlacement: function errorPlacement(error, element) {
                if (element.attr('type') === 'checkbox') {
                  error.insertAfter($(element).parent().find('label'));
                } else if (element.attr('type') === 'password') {
                  $(element).append(error);
                  error.insertAfter($(element).parent());
                } else if (element.attr('type') === 'search') {
                  error.insertAfter($(element).parent());
                } else {
                  error.insertAfter($(element).parent());
                }
              },
              submitHandler: function submitHandler(form) {
                _this.tryCompetitionEntryNotLoggedIn(form);
                return false;
              }
            });
          } else {
            $(item).validate({
              errorPlacement: function errorPlacement(error, element) {
                if (element.attr('type') === 'checkbox') {
                  error.insertAfter($(element).parent().find('label'));
                } else if (element.attr('type') === 'password') {
                  $(element).append(error);
                  error.insertAfter($(element).parent());
                } else if (element.attr('type') === 'search') {
                  error.insertAfter($(element).parent());
                } else {
                  error.insertAfter($(element).parent());
                }
              },
              submitHandler: function submitHandler(form) {
                _this.tryCompetitionEntryLoggedIn(form);
                return false;
              }
            });
          }
        });
      }
    }
  }, {
    key: 'tryCompetitionEntryNotLoggedIn',
    value: function tryCompetitionEntryNotLoggedIn(form) {
      var _this2 = this;

      var frm = $(form);

      var data = {};
      if (frm.find('.comp-answer').length === 0) {
        var answer = frm.find("input[type='radio']:checked").val();
        if (answer === null || answer.length === 0) {
          alert('Please select an option');
          return;
        }

        data = {
          firstname: frm.find('input#register__firstName').val(),
          lastname: frm.find('input#register__lastName').val(),
          email: frm.find('input#register__yourEmail').val(),

          position: frm.find('input#register__position').val(),
          contact: frm.find('input#register__contactNumber').val(),
          size: frm.find('select#register__businessSize').val(),
          sector: frm.find('select#register__businessSector').val(),

          path: frm.data('path'),
          answer: answer
        };
      } else {
        data = {
          firstname: frm.find('input#register__firstName').val(),
          lastname: frm.find('input#register__lastName').val(),
          email: frm.find('input#register__yourEmail').val(),

          position: frm.find('input#register__position').val(),
          contact: frm.find('input#register__contactNumber').val(),
          size: frm.find('select#register__businessSize').val(),
          sector: frm.find('select#register__businessSector').val(),

          path: frm.data('path')
        };

        frm.find('.comp-answer').each(function (index, item) {
          var val = $(item).val();
          if ($(item).data('index') === 1) {
            data.answer = val;
          } else {
            data['answer' + $(item).data('index')] = val;
          }
        });
      }
      if ($.trim(data.firstname).length === 0 || $.trim(data.lastname).length === 0 || $.trim(data.email).length === 0) {
        alert('Please enter your name, email address and competition details.');
      } else {
        frm.find("button[type='submit']").text('please wait...');
        frm.find("input[type='submit']").val('please wait...');

        $.get(this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;

          $.ajax({
            url: _this2.config.urlCompetition,
            data: data,
            type: 'post',
            headers: { 'CSRF-Token': csrftoken },
            dataType: 'json',
            success: function success(response) {
              if (response) {
                if (response.status === 'ok') {
                  var modal = frm.closest('.competition-container').find('.modal');
                  modal.find('.thanks-name').text(data.firstname);
                  // modal.modal('show');
                  modal.show().addClass('show');

                  frm.closest('.competitionDataCapture').hide();
                } else {
                  alert('An error occurred while attempting to enter the competition.\n' + response.error);
                }
              } else {
                alert('An unknown error occurred while attempting to enter the competition. Please try again later');
              }
              frm.find("button[type='submit']").text('Enter the competition');
              frm.find("input[type='submit']").val('Enter the competition');
            }
          });
        });
      }
    }
  }, {
    key: 'tryCompetitionEntryLoggedIn',
    value: function tryCompetitionEntryLoggedIn(form) {
      var _this3 = this;

      var frm = $(form);
      frm.find("button[type='submit']").text('please wait...');
      frm.find("input[type='submit']").val('please wait...');

      var cookie = this.readCookie('DHL.AuthToken');
      if (cookie !== null) {
        var split = cookie.split('|');
        if (split.length >= 2) {
          $.get(this.config.urlToken, function (tokenresponse) {
            var csrftoken = tokenresponse.token;
            $.ajax({
              url: _this3.config.urlGetAllDetails,
              data: { username: split[0], token: split[1] },
              type: 'post',
              headers: { 'CSRF-Token': csrftoken },
              dataType: 'json',
              success: function success(allDetailsResponse) {
                if (allDetailsResponse) {
                  if (allDetailsResponse.status === 'ok') {
                    _this3.completeCompetitionEntryLoggedIn(form, allDetailsResponse);
                  } else {
                    alert('An unknown error occurred while attempting to enter the competition. Please try again later');
                  }
                } else {
                  alert('An unknown error occurred while attempting to enter the competition. Please try again later');
                }
              }
            });
          });
        } else {
          alert('An unknown error occurred while attempting to enter the competition. Please try again later');
        }
      } else {
        var refreshCookie = this.readCookie('DHL.RefreshToken');
        if (refreshCookie !== null) {
          var refreshSplit = refreshCookie.split('|');
          if (refreshSplit.length >= 2) {
            $.get(this.config.urlToken, function (tokenresponse) {
              var csrftoken = tokenresponse.token;
              $.ajax({
                url: _this3.config.urlRefreshCheck,
                data: { username: refreshSplit[0], refresh_token: refreshSplit[1] },
                type: 'post',
                headers: { 'CSRF-Token': csrftoken },
                dataType: 'json',
                success: function success(refreshResponse) {
                  if (refreshResponse) {
                    if (refreshResponse.status === 'ok') {
                      $(window).trigger('checkauthtokens.DHL', [refreshResponse, true]);
                      _this3.tryCompetitionEntryLoggedIn(form);
                    } else {
                      alert('An unknown error occurred while attempting to enter the competition. Please try again later');
                    }
                  } else {
                    alert('An unknown error occurred while attempting to enter the competition. Please try again later');
                  }
                }
              });
            });
          } else {
            alert('An unknown error occurred while attempting to enter the competition. Please try again later');
          }
        } else {
          alert('An unknown error occurred while attempting to enter the competition. Please try again later');
        }
      }
    }
  }, {
    key: 'completeCompetitionEntryLoggedIn',
    value: function completeCompetitionEntryLoggedIn(form, details) {
      var _this4 = this;

      var frm = $(form);

      var answer = '';
      if (frm.find('.comp-answer').length > 0) {
        answer = frm.find('.comp-answer').val();
      } else {
        answer = frm.find("input[type='radio']:checked").val();
        if (answer === null || answer.length === 0) {
          alert('Please select an option');
          frm.find("button[type='submit']").text('Enter the competition ' + details.registration_firstname);
          frm.find("input[type='submit']").val('Enter the competition ' + details.registration_firstname);
          return;
        }
      }

      var data = {
        firstname: details.registration_firstname,
        lastname: details.registration_lastname,
        email: details.registration_email,

        position: details.registration_position,
        contact: details.registration_contact,
        size: details.registration_size,
        sector: details.registration_sector,

        path: frm.data('path'),
        answer: answer
      };

      if ($.trim(data.answer).length === 0 || $.trim(data.firstname).length === 0 || $.trim(data.lastname).length === 0 || $.trim(data.email).length === 0) {
        alert('Please enter your name, email address and competition details.');
      } else {
        frm.find("button[type='submit']").text('please wait...');
        frm.find("input[type='submit']").val('please wait...');

        $.get(this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;
          $.ajax({
            url: _this4.config.urlCompetition,
            data: data,
            type: 'post',
            headers: { 'CSRF-Token': csrftoken },
            dataType: 'json',
            success: function success(response) {
              if (response) {
                if (response.status === 'ok') {
                  var modal = frm.closest('.competition-container').find('.modal');
                  modal.find('.thanks-name').text(data.firstname);
                  // modal.modal('show');
                  modal.show().addClass('show');

                  frm.closest('.competitionDataCapture').hide();
                } else {
                  alert('An error occurred while attempting to enter the competition.\n' + response.error);
                }
              } else {
                alert('An unknown error occurred while attempting to enter the competition. Please try again later');
              }
              frm.find("button[type='submit']").text('Enter the competition ' + data.firstname);
              frm.find("input[type='submit']").val('Enter the competition ' + data.firstname);
            }
          });
        });
      }

      frm.find("button[type='submit']").text('Enter the competition');
      frm.find("input[type='submit']").val('Enter the competition');
    }
  }]);

  return CompetitionForm;
}();

exports.default = new CompetitionForm();

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  IDB: {
    DB: 'offline-articles',
    ARTICLES_STORE: 'articles'
  }
};

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CookieBanner = function () {
  function CookieBanner() {
    _classCallCheck(this, CookieBanner);

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

  _createClass(CookieBanner, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      this.displayBanner();
      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      $(document).on('click', this.sel.closeButton, function () {
        _this.hideCookieBanner();
        Cookies.set(_this.cookieName, { seen: 1 });
      });
    }
  }, {
    key: 'displayBanner',
    value: function displayBanner() {
      var cookie = Cookies.get(this.cookieName);

      if (typeof cookie === 'undefined') {
        this.showCookieBanner();
      }
    }
  }, {
    key: 'showCookieBanner',
    value: function showCookieBanner() {
      $(this.sel.component).addClass('cookie-banner--display');
    }
  }, {
    key: 'hideCookieBanner',
    value: function hideCookieBanner() {
      $(this.sel.component).removeClass('cookie-banner--display');
      $(this.sel.component).remove();
    }
  }]);

  return CookieBanner;
}();

exports.default = new CookieBanner();

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = require('./Constants');

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Database = function () {
  function Database() {
    _classCallCheck(this, Database);

    this.database = null;

    this.initiateDb = this.initiateDb.bind(this);
    this.addArticle = this.addArticle.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.getArticles = this.getArticles.bind(this);

    // Create/get DB
    if (window.Promise) {
      this.initiateDb();
    }
  }

  _createClass(Database, [{
    key: 'initiateDb',
    value: function initiateDb() {
      this.database = idb.open(_Constants2.default.IDB.DB, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(_Constants2.default.IDB.ARTICLES_STORE)) {
          var articleOS = upgradeDb.createObjectStore(_Constants2.default.IDB.ARTICLES_STORE, {
            keyPath: 'link'
          });
          articleOS.createIndex('title', 'title', { unique: false });
          articleOS.createIndex('link', 'link', { unique: true });
          articleOS.createIndex('description', 'description', { unique: false });
          articleOS.createIndex('categoryName', 'categoryName', { unique: false });
          articleOS.createIndex('categoryLink', 'categoryLink', { unique: false });
          articleOS.createIndex('timeToRead', 'timeToRead', { unique: false });
          articleOS.createIndex('imageMobile', 'imageMobile', { unique: false });
          articleOS.createIndex('imageDesktop', 'imageDesktop', { unique: false });
          articleOS.createIndex('isLarge', 'isLarge', { unique: false });
          articleOS.createIndex('isVideo', 'isVideo', { unique: false });
          articleOS.createIndex('cacheName', 'cacheName', { unique: false });
        }
      });
    }
  }, {
    key: 'deleteArticle',
    value: function deleteArticle(link) {
      return this.database.then(function (db) {
        var transaction = db.transaction([_Constants2.default.IDB.ARTICLES_STORE], 'readwrite');
        var store = transaction.objectStore(_Constants2.default.IDB.ARTICLES_STORE);
        return Promise.all([store.delete(link), transaction.complete]);
      });
    }
  }, {
    key: 'addArticle',
    value: function addArticle(title, link, description, categoryName, categoryLink, timeToRead, imageMobile, imageDesktop, isLarge, isVideo, cacheName) {
      return this.database.then(function (db) {
        var transaction = db.transaction([_Constants2.default.IDB.ARTICLES_STORE], 'readwrite');
        var store = transaction.objectStore(_Constants2.default.IDB.ARTICLES_STORE);
        return Promise.all([store.add({
          title: title,
          link: link,
          description: description,
          categoryName: categoryName,
          categoryLink: categoryLink,
          timeToRead: timeToRead,
          imageMobile: imageMobile,
          imageDesktop: imageDesktop,
          isLarge: isLarge,
          isVideo: isVideo,
          cacheName: cacheName
        }), transaction.complete]);
      });
    }
  }, {
    key: 'getArticles',
    value: function getArticles() {
      return this.database.then(function (db) {
        var transaction = db.transaction([_Constants2.default.IDB.ARTICLES_STORE], 'readonly');
        var store = transaction.objectStore(_Constants2.default.IDB.ARTICLES_STORE);
        return store.getAll();
      });
    }
  }]);

  return Database;
}();

exports.default = new Database();

},{"./Constants":6}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DeleteAccountForm = function () {
  function DeleteAccountForm() {
    _classCallCheck(this, DeleteAccountForm);

    this.config = {
      urlToken: '/libs/granite/csrf/token.json',
      urlRefreshCheck: '/bin/dhl/refresh_token/index.json',
      urlGetAllDetails: '/bin/dhl/getdetails/index.json',
      urlDeleteAccount: '/bin/dhl/deleteaccount/index.json'
    };

    this.sel = {
      component: '.delete-account'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.readCookie = this.readCookie.bind(this);
    this.clearCookie = this.clearCookie.bind(this);
    this.createCookie = this.createCookie.bind(this);

    this.tryDeleteAccount = this.tryDeleteAccount.bind(this);
    this.completeDeleteAccount = this.completeDeleteAccount.bind(this);

    this.loggedIn = this.loggedIn.bind(this);
    this.notLoggedIn = this.notLoggedIn.bind(this);
  }

  _createClass(DeleteAccountForm, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      jQuery.validator.addMethod('password', function (value, element) {
        return new RegExp($(element).attr('pattern')).test(value);
      }, 'Password format is not valid');

      jQuery.validator.addMethod('equalTo', function (value, element) {
        return $('#' + $(element).attr('data-equalTo')).val() === $(element).val();
      }, 'Passwords do not match');

      $(window).on('userloggedin.DHL', function (evt, tokenData) {
        _this.loggedIn(tokenData);
      });
      $(window).on('usernotloggedin.DHL', function () {
        _this.notLoggedIn();
      });

      $(this.sel.component).find('form').validate({
        rules: {
          login__firstName: 'email',
          login__password: 'password'
        },
        errorPlacement: function errorPlacement(error, element) {
          if (element.attr('type') === 'checkbox') {
            error.insertAfter($(element).parent().find('label'));
          } else if (element.attr('type') === 'password') {
            $(element).append(error);
            error.insertAfter($(element).parent());
          } else if (element.attr('type') === 'search') {
            error.insertAfter($(element).parent());
          } else {
            error.insertAfter(element);
          }
        },
        submitHandler: function submitHandler(form) {
          _this.tryDeleteAccount(form);
          return false;
        }
      });
    }
  }, {
    key: 'readCookie',
    value: function readCookie(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length);
        }if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }

      return null;
    }
  }, {
    key: 'clearCookie',
    value: function clearCookie(name) {
      this.createCookie(name, '', -1);
    }
  }, {
    key: 'createCookie',
    value: function createCookie(name, value, expirySeconds) {
      var expires = '';
      if (expirySeconds) {
        var date = new Date();
        date.setTime(date.getTime() + expirySeconds * 1000);
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + value + expires + '; path=/';
    }
  }, {
    key: 'tryDeleteAccount',
    value: function tryDeleteAccount(form) {
      var _this2 = this;

      var frm = $(form);
      frm.find("button[type='submit']").text('please wait...');
      frm.find('input.forms__cta--red').val('please wait...');

      var cookie = this.readCookie('DHL.AuthToken');
      if (cookie !== null) {
        var split = cookie.split('|');
        if (split.length >= 2) {
          $.get(this.config.urlToken, function (tokenresponse) {
            var csrftoken = tokenresponse.token;
            $.ajax({
              url: _this2.config.urlGetAllDetails,
              data: { username: split[0], token: split[1] },
              type: 'post',
              headers: { 'CSRF-Token': csrftoken },
              dataType: 'json',
              success: function success(allDetailsResponse) {
                if (allDetailsResponse) {
                  if (allDetailsResponse.status === 'ok') {
                    $(window).trigger('checkauthtokens.DHL', [allDetailsResponse, true]);
                    _this2.completeDeleteAccount(form, allDetailsResponse);
                  } else {
                    alert('An unknown error occurred while attempting to delete your account (1). Please try again later');
                  }
                } else {
                  alert('An unknown error occurred while attempting to delete your account (2). Please try again later');
                }
              }
            });
          });
        } else {
          alert('An unknown error occurred while attempting to delete your account (3). Please try again later');
        }
      } else {
        var refreshCookie = this.readCookie('DHL.RefreshToken');
        if (refreshCookie !== null) {
          var refreshSplit = refreshCookie.split('|');
          if (refreshSplit.length >= 2) {
            $.get(this.config.urlToken, function (tokenresponse) {
              var csrftoken = tokenresponse.token;
              $.ajax({
                url: _this2.config.urlRefreshCheck,
                data: { username: refreshSplit[0], refresh_token: refreshSplit[1] },
                type: 'post',
                headers: { 'CSRF-Token': csrftoken },
                dataType: 'json',
                success: function success(refreshResponse) {
                  if (refreshResponse) {
                    if (refreshResponse.status === 'ok') {
                      $(window).trigger('checkauthtokens.DHL', [refreshResponse, true]);
                      _this2.tryDeleteAccount(form);
                    } else {
                      alert('An unknown error occurred while attempting to delete your account (4). Please try again later');
                    }
                  } else {
                    alert('An unknown error occurred while attempting to delete your account (5). Please try again later');
                  }
                }
              });
            });
          } else {
            alert('An unknown error occurred while attempting to delete your account (6). Please try again later');
          }
        } else {
          alert('An unknown error occurred while attempting to delete your account. Please try again later');
        }
      }
    }
  }, {
    key: 'completeDeleteAccount',
    value: function completeDeleteAccount(form, details) {
      var _this3 = this;

      var frm = $(form);

      var data = {
        token: details.token,

        username: frm.find('input#login__firstName').val(),
        password: frm.find('input#login__password').val()
      };

      if ($.trim(data.username).length == 0 || $.trim(data.password).length == 0) {
        alert('Please enter your email address and password.');
      } else {
        frm.find("button[type='submit']").text('please wait...');
        frm.find('input.forms__cta--red').val('please wait...');

        $.get(this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;
          $.ajax({
            url: _this3.config.urlDeleteAccount,
            data: data,
            type: 'post',
            headers: { 'CSRF-Token': csrftoken },
            dataType: 'json',
            success: function success(deleteAccountResponse) {
              if (deleteAccountResponse) {
                $(window).trigger('checkauthtokens.DHL', [deleteAccountResponse, true]);

                if (deleteAccountResponse.status === 'ok') {
                  _this3.clearCookie('DHL.AuthToken');
                  _this3.clearCookie('DHL.RefreshToken');

                  window.location = frm.data('successurl');
                } else {
                  alert('An error occurred while attempting to delete your account.\n' + deleteAccountResponse.error);
                }
              } else {
                alert('An unknown error occurred while attempting to delete your account. Please try again later');
              }
              frm.find("button[type='submit']").text('Delete Account');
              frm.find('input.forms__cta--red').val('Delete Account');
            }
          });
        });
      }

      frm.find("button[type='submit']").text('Delete Account');
      frm.find('input.forms__cta--red').val('Delete Account');
    }
  }, {
    key: 'loggedIn',
    value: function loggedIn(tokenData) {
      if (tokenData && tokenData.status && tokenData.status === 'ok') {
        $(this.sel.component).show();
      }
    }
  }, {
    key: 'notLoggedIn',
    value: function notLoggedIn() {
      if ($(this.sel.component).hasClass('no-redirect')) {
        $(this.sel.component).show();
      } else {
        window.location = '/content/dhl.html';
      }
    }
  }]);

  return DeleteAccountForm;
}();

exports.default = new DeleteAccountForm();

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EcomForms = function () {
  function EcomForms() {
    _classCallCheck(this, EcomForms);

    this.sel = {
      component: '.ecom-form',
      closeIcon: '.ecom-form__close',
      maxForm: '.ecom-form--max',
      minForm: '.ecom-form--min',
      submitForm: '.ecom-form input[type=submit]'
    };

    this.displayFormAfter = 5000;

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.formTimer = this.formTimer.bind(this);
    this.showHideMaxForm = this.showHideMaxForm.bind(this);
    this.showHideMinForm = this.showHideMinForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  _createClass(EcomForms, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      this.formTimer();
      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      $(document).on('click', this.sel.closeIcon, function () {
        _this.showHideMaxForm();
        _this.showHideMinForm();
      });

      $(document).on('click', this.sel.submitForm, function (e) {
        e.preventDefault();
        var form = $(e.target).closest('form');
        _this.submitForm(form);
      });
    }
  }, {
    key: 'formTimer',
    value: function formTimer() {
      var _this2 = this;

      setTimeout(function () {
        _this2.showHideMaxForm();
      }, this.displayFormAfter);
    }
  }, {
    key: 'showHideMaxForm',
    value: function showHideMaxForm() {
      $(this.sel.maxForm).toggleClass('is-hidden');
    }
  }, {
    key: 'showHideMinForm',
    value: function showHideMinForm() {
      $(this.sel.minForm).toggleClass('is-shown');
    }
  }, {
    key: 'submitForm',
    value: function submitForm(form) {
      window.location.href = form.attr('action') + '?' + form.serialize();
    }
  }]);

  return EcomForms;
}();

exports.default = new EcomForms();

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PasswordValidity = require('./PasswordValidity');

var _PasswordValidity2 = _interopRequireDefault(_PasswordValidity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormValidation = function () {
  function FormValidation() {
    _classCallCheck(this, FormValidation);

    this.sel = {
      component: '.forms'
    };

    this.init = this.init.bind(this);
    this.validate = this.validate.bind(this);
    this.addPasswordCheck = this.addPasswordCheck.bind(this);
  }

  _createClass(FormValidation, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;

      this.addPasswordCheck();
      this.validate();
      return true;
    }
  }, {
    key: 'addPasswordCheck',
    value: function addPasswordCheck() {
      $.validator.addMethod('passwordCheck', function (value) {
        return _PasswordValidity2.default.isPasswordValid(value);
      }, 'Please enter a valid password');
    }
  }, {
    key: 'validate',
    value: function validate() {
      $(this.sel.component).validate({
        rules: {
          'required': {
            required: true
          },
          'password': {
            passwordCheck: true
          }
        },
        errorPlacement: function errorPlacement(error, element) {
          if (element.attr('type') === 'checkbox') {
            error.insertAfter($(element).parent().find('label'));
          } else if (element.attr('type') === 'password') {
            $(element).append(error);
            error.insertAfter($(element).parent());
          } else if (element.attr('type') === 'search') {
            error.insertAfter($(element).parent());
          } else {
            error.insertAfter(element);
          }
        }
      });
    }
  }]);

  return FormValidation;
}();

exports.default = new FormValidation();

},{"./PasswordValidity":20}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Header = function () {
  function Header() {
    _classCallCheck(this, Header);

    this.sel = {
      component: '.header',
      toggle: '.header__navigation',
      menu: '.header__meganav',
      overlay: '.header__overlay',
      search: '.header__desktopSearch',
      searchForm: '.header__desktopSearchForm',
      searchFormInput: '.header__desktopSearchForm .header__searchInput',
      searchFormSubmit: '.header__desktopSearchForm .header__searchButton'
    };
    this.lastScrollTop = 0;

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.showSearch = this.showSearch.bind(this);
    this.hideSearch = this.hideSearch.bind(this);
    this.bodyScrolling = this.bodyScrolling.bind(this);

    this.checkScroll = this.checkScroll.bind(this);
  }

  _createClass(Header, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      $(document).on('click', this.sel.toggle, function (e) {
        e.preventDefault();
        _this.toggleMenu();
      });
      $(document).on('click', this.sel.overlay, this.toggleMenu);
      $(document).on('click', this.sel.search, this.toggleSearch);
      $(window).on('scroll', this.checkScroll);
      this.checkScroll();
    }
  }, {
    key: 'checkScroll',
    value: function checkScroll() {
      var wt = $(window).scrollTop();
      var pb = $('.page-body').offset().top;
      if (wt > pb) {
        $('.page-body').addClass('fixed');
        $(this.sel.component).addClass('fixed');
        if (wt > this.lastScrollTop) {
          $(this.sel.component).removeClass('in');
        } else {
          $(this.sel.component).addClass('in');
        }
      } else {
        $('.page-body').removeClass('fixed');
        $(this.sel.component).removeClass('fixed');
      }

      this.lastScrollTop = wt;
    }
  }, {
    key: 'toggleMenu',
    value: function toggleMenu() {
      var _this2 = this;

      if (!$(this.sel.menu).is(':visible')) {
        this.bodyScrolling(false);
        $(this.sel.toggle).addClass('header__navigation--open');
      } else {
        this.bodyScrolling(true);
        $(this.sel.toggle).removeClass('header__navigation--open');
      }
      $(this.sel.menu).slideToggle(150);

      if ($(this.sel.searchForm).hasClass('header__desktopSearchForm--open')) {
        $(this.sel.searchForm).removeClass('header__desktopSearchForm--open');
        setTimeout(function () {
          $(_this2.sel.search).removeClass('header__desktopSearch--close');
        }, 150);
      }
    }
  }, {
    key: 'bodyScrolling',
    value: function bodyScrolling(enabled) {
      if (enabled) {
        $('body').removeClass('modal-open');
        document.documentElement.style.height = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.body.style.height = 'auto';
      } else {
        $('body').addClass('modal-open');
        var windowHeight = window.screen.availHeight;
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.height = windowHeight.toString() + 'px';
        document.body.style.height = windowHeight.toString() + 'px';
      }
    }
  }, {
    key: 'toggleSearch',
    value: function toggleSearch(e) {
      e.preventDefault();
      if ($(this.sel.search).hasClass('header__desktopSearch--close')) {
        this.hideSearch();
      } else {
        this.showSearch();
      }
    }
  }, {
    key: 'showSearch',
    value: function showSearch() {
      $(this.sel.search).addClass('header__desktopSearch--close');
      $(this.sel.searchForm).addClass('header__desktopSearchForm--open');
      $(this.sel.searchFormInput).focus();

      if ($(this.sel.toggle).hasClass('header__navigation--open')) {
        this.bodyScrolling(true);
        $(this.sel.toggle).removeClass('header__navigation--open');
        $(this.sel.menu).slideToggle(150);
      }
    }
  }, {
    key: 'hideSearch',
    value: function hideSearch() {
      var _this3 = this;

      $(this.sel.searchForm).removeClass('header__desktopSearchForm--open');
      setTimeout(function () {
        $(_this3.sel.search).removeClass('header__desktopSearch--close');
      }, 150);
      return true;
    }
  }]);

  return Header;
}();

exports.default = new Header();

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hero = function () {
  function Hero() {
    _classCallCheck(this, Hero);

    this.sel = {
      component: '.hero',
      trigger: '.hero__playButton, .hero__cta--video',
      iframe: '.hero .hero__video'
    };

    this.bindEvents = this.bindEvents.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.init = this.init.bind(this);
  }

  _createClass(Hero, [{
    key: 'bindEvents',
    value: function bindEvents() {
      $(document).on('click', this.sel.trigger, this.handleClick);
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();
      var videoId = this.getVideoID(e.target.href);
      $(this.sel.iframe).attr('src', 'https://www.youtube.com/embed/' + videoId + '?rel=0&amp;showinfo=0&amp;autoplay=1').addClass('hero__video--open');
    }
  }, {
    key: 'getVideoID',
    value: function getVideoID(ytUrl) {
      var id = '';
      var url = ytUrl.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      if (url[2] !== undefined) {
        id = url[2].split(/[^0-9a-z_\-]/i);
        id = id[0];
      } else {
        id = url;
      }
      return id;
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      return true;
    }
  }]);

  return Hero;
}();

exports.default = new Hero();

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IEDetector = function () {
  function IEDetector() {
    _classCallCheck(this, IEDetector);

    this.sel = {
      component: 'body'
    };

    this.init = this.init.bind(this);
    this.detectIE = this.detectIE.bind(this);
  }

  _createClass(IEDetector, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      var version = this.detectIE();
      if (version !== false) {
        if (version >= 12) {
          $(this.sel.component).addClass('ie-edge');
        } else {
          $(this.sel.component).addClass('ie-' + version);
        }
      }
      return true;
    }
  }, {
    key: 'detectIE',
    value: function detectIE() {
      var ua = window.navigator.userAgent;
      // Test values; Uncomment to check result …
      // IE 10
      // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
      // IE 11
      // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';    // Edge 12 (Spartan)
      // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0'    // Edge 13
      // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';
      var msie = ua.indexOf('MSIE ');
      if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }

      var trident = ua.indexOf('Trident/');
      if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }

      var edge = ua.indexOf('Edge/');
      if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      }

      // other browser
      return false;
    }
  }]);

  return IEDetector;
}();

exports.default = new IEDetector();

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LandingPoints = function () {
  function LandingPoints() {
    _classCallCheck(this, LandingPoints);

    this.sel = {
      component: '.landingpoints',
      landingPointItem: '.landingpoints .landingpoint',
      clickableTitle: '.landingpoints .landingpoint__title a'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
  }

  _createClass(LandingPoints, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      $(document).on('click', this.sel.clickableTitle, function (evt) {
        var container = $(evt.currentTarget).closest(_this.sel.landingPointItem);
        if (container.hasClass('open')) {
          container.find('.landingpoint__content').css({ height: 0 });
          container.removeClass('open');
        } else {
          $(evt.currentTarget).closest(_this.sel.component).find('.landingpoint.open .landingpoint__content').css({ height: 0 });
          $(evt.currentTarget).closest(_this.sel.component).find('.landingpoint').removeClass('open');
          container.addClass('open');
          container.find('.landingpoint__content').css({ height: container.find('.landingpoint__content p').outerHeight() });
        }

        return false;
      });
    }
  }]);

  return LandingPoints;
}();

exports.default = new LandingPoints();

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginForm = function () {
  function LoginForm() {
    _classCallCheck(this, LoginForm);

    this.config = {
      // fbAppId: '1000773163337798',
      fbAppId: '1080031328801211',
      // goClientId: '913960352236-u7un0l22tvkmlbpa5bcnf1uqg4csi7e3.apps.googleusercontent.com',
      goClientId: '313469837420-l882h39ge8n8n9pb97ldvjk3fm8ppqgs.apps.googleusercontent.com',

      urlToken: '/libs/granite/csrf/token.json',
      urlLogin: '/bin/dhl/login/index.json'
    };

    this.sel = {
      component: '.page-body.login form.forms',
      buttonFacebook: '.forms__cta--social.fb',
      buttonLinkedin: '.forms__cta--social.li',
      buttonGooglePlus: '.forms__cta--social.go'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);

    this.tryLoginFacebook = this.tryLoginFacebook.bind(this);
    this.tryLoginLinkedin = this.tryLoginLinkedin.bind(this);
    this.tryLoginGoogle = this.tryLoginGoogle.bind(this);
    this.tryLogin = this.tryLogin.bind(this);

    this.executeLogin = this.executeLogin.bind(this);

    this.loggedIn = this.loggedIn.bind(this);
  }

  _createClass(LoginForm, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      $(window).on('userloggedin.DHL', function () {
        _this.loggedIn();
      });

      jQuery.validator.addMethod('password', function (value, element) {
        return new RegExp($(element).attr('pattern')).test(value);
      }, 'Password format is not valid');

      jQuery.validator.addMethod('equalTo', function (value, element) {
        return $('#' + $(element).attr('data-equalTo')).val() === $(element).val();
      }, 'Passwords do not match');

      if ($(this.sel.component).find(this.sel.buttonFacebook).length > 0) {
        window.fbAsyncInit = function () {
          window.fb_interval = setInterval(function () {
            if (typeof window.FB !== 'undefined' && window.FB !== null) {
              window.FB.init({
                appId: _this.config.fbAppId,
                cookie: true,
                xfbml: true,
                version: 'v2.8'
              });

              clearInterval(window.fb_interval);
            }
          }, 100);
        };

        if (document.getElementById('facebook-jssdk') === null) {
          var fjs = document.getElementsByTagName('script')[0];
          var js = document.createElement('script');
          js.id = 'facebook-jssdk';
          js.src = '//connect.facebook.net/en_EN/sdk.js';
          fjs.parentNode.insertBefore(js, fjs);
        }
        $(this.sel.component).find(this.sel.buttonFacebook).on('click', function (evt) {
          _this.tryLoginFacebook(evt);
          return false;
        });
      }

      if ($(this.sel.component).find(this.sel.buttonLinkedin).length > 0) {
        $(this.sel.component).find(this.sel.buttonLinkedin).on('click', function (evt) {
          _this.tryLoginLinkedin(evt);
          return false;
        });
      }

      var googleButton = $(this.sel.component).find(this.sel.buttonGooglePlus);
      if (googleButton.length > 0) {
        window.go_interval = setInterval(function () {
          if (typeof window.gapi !== 'undefined' && window.gapi !== null) {
            window.gapi.load('auth2', function () {
              var auth2 = window.gapi.auth2.init({
                client_id: _this.config.goClientId,
                cookiepolicy: 'single_host_origin'
              });

              var element = googleButton.get(0);
              auth2.attachClickHandler(element, {}, function (googleUser) {
                _this.tryLoginGoogle(googleUser);
                return false;
              }, function (result) {
                if (result.error !== 'popup_closed_by_user') {
                  alert(result.error);
                }
              });
            });

            clearInterval(window.go_interval);
          }
        }, 100);

        $(this.sel.component).find(this.sel.buttonGooglePlus).on('click', function (evt) {
          evt.preventDefault();
          return false;
        });
      }

      $(this.sel.component).validate({
        rules: {
          login__email: 'email',
          login__password: 'password'
        },
        errorPlacement: function errorPlacement(error, element) {
          if (element.attr('type') === 'checkbox') {
            error.insertAfter($(element).parent().find('label'));
          } else if (element.attr('type') === 'password') {
            $(element).append(error);
            error.insertAfter($(element).parent());
          } else if (element.attr('type') === 'search') {
            error.insertAfter($(element).parent());
          } else {
            error.insertAfter(element);
          }
        },
        submitHandler: function submitHandler(form) {
          _this.tryLogin(form);
          return false;
        }
      });
    }
  }, {
    key: 'tryLoginFacebook',
    value: function tryLoginFacebook(evt) {
      var _this2 = this;

      evt.preventDefault();

      $(this.sel.component).find(this.sel.buttonFacebook).text('please wait...');

      window.FB.login(function (loginResponse) {
        if (loginResponse.authResponse) {
          window.FB.api('/me', function (dataResponse) {
            var data = {
              username: dataResponse.email,
              password: dataResponse.id
            };

            _this2.executeLogin(data, function () {
              $(_this2.sel.component).find(_this2.sel.buttonFacebook).text('Facebook');
            });
          }, { fields: ['id', 'email'] });
        }
        return false;
      }, { scope: 'email,public_profile', return_scopes: true });
    }
  }, {
    key: 'tryLoginLinkedin',
    value: function tryLoginLinkedin(evt) {
      var _this3 = this;

      evt.preventDefault();

      $(this.sel.component).find(this.sel.buttonLinkedin).text('please wait...');

      IN.User.authorize(function () {
        IN.API.Profile('me').fields('id', 'first-name', 'last-name', 'email-address').result(function (result) {
          var member = result.values[0];

          var data = {
            username: member.emailAddress,
            password: member.id
          };

          _this3.executeLogin(data, function () {
            $(_this3.sel.component).find(_this3.sel.buttonLinkedin).text('LinkedIn');
          });
        });
      });

      setInterval(function () {
        var result = window.IN.User.isAuthorized();
        if (result) {
          IN.API.Profile('me').fields('id', 'first-name', 'last-name', 'email-address').result(function (result) {
            var member = result.values[0];

            var data = {
              username: member.emailAddress,
              password: member.id
            };

            _this3.executeLogin(data, function () {
              $(_this3.sel.component).find(_this3.sel.buttonLinkedin).text('LinkedIn');
            });
          });
        }
      }, 1000);

      return false;
    }
  }, {
    key: 'tryLoginGoogle',
    value: function tryLoginGoogle(googleUser) {
      var _this4 = this;

      var data = {
        username: googleUser.getBasicProfile().getEmail(),
        password: googleUser.getBasicProfile().getId()
      };

      $(this.sel.component).find(this.sel.buttonGooglePlus).text('please wait...');
      this.executeLogin(data, function () {
        $(_this4.sel.component).find(_this4.sel.buttonGooglePlus).text('Google+');
      });
    }
  }, {
    key: 'tryLogin',
    value: function tryLogin(form) {
      var frm = $(form);
      var username = frm.find('input#login__email').val();
      var password = frm.find('input#login__password').val();

      if ($.trim(username).length === 0 || $.trim(password).length === 0) {
        alert('Please enter your email address and password');
      } else {
        frm.find("button[type='submit']").text('please wait...');
        frm.find('input.forms__cta--red').val('please wait...');

        this.executeLogin({ username: username, password: password }, function () {
          frm.find("button[type='submit']").text('Log In');
          frm.find('input.forms__cta--red').val('Login');
        });
      }

      return false;
    }
  }, {
    key: 'executeLogin',
    value: function executeLogin(data, unwaitCallback) {
      var _this5 = this;

      $.get(this.config.urlToken, function (tokenresponse) {
        var csrftoken = tokenresponse.token;

        $.ajax({
          url: _this5.config.urlLogin,
          data: data,
          type: 'post',
          headers: { 'CSRF-Token': csrftoken },
          dataType: 'json',
          success: function success(response) {
            if (response) {
              if (response.status === 'ok') {
                $(window).trigger('checkauthtokens.DHL', [response, true]);

                var backUrl = $(_this5.sel.component).data('back');
                if ($.trim(backUrl).length === 0) {
                  backUrl = '/content/dhl.html';
                }
                window.location = backUrl;
              } else {
                alert('An error occurred while attempting to register.\n' + response.error);
              }
            } else {
              alert('An unknown error occurred while attempting to register. Please try again later.');
            }
            unwaitCallback();
          }
        });
      });
    }
  }, {
    key: 'loggedIn',
    value: function loggedIn() {
      window.location = '/content/dhl/your-account.html';
    }
  }]);

  return LoginForm;
}();

exports.default = new LoginForm();

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Toast = require('./Toast');

var _Toast2 = _interopRequireDefault(_Toast);

var _Database = require('./Database');

var _Database2 = _interopRequireDefault(_Database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SaveForOffline = function () {
  function SaveForOffline() {
    _classCallCheck(this, SaveForOffline);

    this.sel = {
      component: '.hero__saveForOffline'
    };
    // Create article cache name
    this.articleCacheName = 'offline-' + window.location.pathname;

    this.init = this.init.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.doSave = this.doSave.bind(this);
    this.doUnsave = this.doUnsave.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.getHeroImages = this.getHeroImages.bind(this);
    this.isCurrentPageSaved = this.isCurrentPageSaved.bind(this);
  }

  _createClass(SaveForOffline, [{
    key: 'bindEvents',
    value: function bindEvents() {
      $(document).on('click', this.sel.component, this.handleClick);
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();
      if ($(this.sel.component).hasClass('hero__saveForOffline--saved')) {
        this.doUnsave();
      } else {
        this.doSave();
      }
    }
  }, {
    key: 'isCurrentPageSaved',
    value: function isCurrentPageSaved() {
      var _this = this;

      // Check if already saved
      caches.keys().then(function (cacheNames) {
        // Get array of cache names
        return Promise.all(cacheNames.filter(function (cacheName) {
          // Filter array
          return cacheName === _this.articleCacheName; // If matches current pathname
        }));
      }).then(function (cacheNames) {
        // Once got filtered array
        if (cacheNames.length > 0) {
          // If there are caches
          $(_this.sel.component).addClass('hero__saveForOffline--saved').attr('title', 'Article Saved').find('span').text('Article Saved');
        }
      });
    }
  }, {
    key: 'getHeroImages',
    value: function getHeroImages() {
      // Get the hero image element
      var $heroImage = $('.hero__image');
      // If it exists
      if ($heroImage.length > 0) {
        // Create array for images
        var images = [];
        // Add the mobile image URL
        images.push($heroImage.css('background-image').split('url(')[1].split(')')[0].replace(/"/g, '').replace(/'/g, ''));
        // Get the desktop image URL
        var desktopStyles = $heroImage.parents('.hero').find('style').html().split('url(')[1].split(')')[0].replace(/"/g, '').replace(/'/g, '');
        // Add the desktop image to the array
        images.push(desktopStyles);
        // Return the images
        return images;
      }
      return false;
    }
  }, {
    key: 'doUnsave',
    value: function doUnsave() {
      var _this2 = this;

      var pathName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.pathname;

      var toast = new _Toast2.default('Article has been removed', 3000);
      // Remove article from IDB
      return _Database2.default.deleteArticle(pathName).then(function () {
        // Deleted from IDB successfully
        // Remove article content
        caches.delete('offline-' + pathName).then(function () {
          $(_this2.sel.component).removeClass('hero__saveForOffline--saved').attr('title', 'Save Article').find('span').text('Save Article');
          toast.show();
        });
      }).catch(function () {
        // There was an error deleting from IDB
        toast.setText('There was a problem deleting the article');
        toast.show();
      });
    }
  }, {
    key: 'doSave',
    value: function doSave() {
      var _this3 = this;

      // Create toast for confirmation
      var toast = new _Toast2.default('Article is now available offline', 3000);

      if ($('#articleData').length <= 0) {
        console.log('SW ERROR: Offline.js:90');
        toast.setText('Article could not be saved for offline');
        toast.show();
        return false;
      }
      // Get page data for IDB
      var pageData = JSON.parse($('#articleData').html());

      // Add article to IDB
      _Database2.default.addArticle(pageData.title, window.location.pathname, pageData.description, pageData.categoryName, pageData.categoryLink, pageData.timeToRead, pageData.imageMobile, pageData.imageDesktop, pageData.isLarge, pageData.isVideo, this.articleCacheName).then(function () {
        // Saved in IDB successfully
        // Build an array of the page-specific resources.
        var pageResources = [window.location.pathname, pageData.imageMobile, pageData.imageDesktop];

        // Add the hero images
        if ($('.hero__image').length > 0) {
          var heroImages = _this3.getHeroImages();
          if (heroImages) pageResources = pageResources.concat(heroImages);
        }

        // Add images to the array
        $('.page-body .wysiwyg img, .authorPanel img').each(function (index, element) {
          // Trim whitespace form src
          var imgSrc = $.trim($(element).attr('src'));
          // If empty src skip this image
          if (!(imgSrc === '')) {
            // Add to page resources
            pageResources.push($(element).attr('src'));
          }
        });

        // Open the unique cache for this URL
        caches.open(_this3.articleCacheName).then(function (cache) {
          // Unique URLs
          var uniqueResources = [];
          // Create anchor element to get full URLs
          var anchor = document.createElement('a');
          // Dedupe assets
          $.each(pageResources, function (i, el) {
            // Load the current URL into the anchor
            anchor.href = el;
            // Only cache URLs on our domain
            if (anchor.host !== window.location.host) return;
            // Get the relative path
            var relative = anchor.pathname + anchor.search;
            // If already in list of assets, don't include it again
            if ($.inArray(relative, uniqueResources) === -1) uniqueResources.push(relative);
          });
          // Cache all required assets
          var updateCache = cache.addAll(uniqueResources);
          // Update UI to indicate success
          // Or catch any errors if it doesn't succeed
          updateCache.then(function () {
            // console.log('Article is now available offline.');
            $(_this3.sel.component).addClass('hero__saveForOffline--saved').attr('title', 'Saved for offline').find('span').text('Article Saved');
          }).catch(function (error) {
            console.log(error.message);
            // console.log('Article could not be saved for offline.', error);
            toast.setText('Article could not be saved for offline');
          }).then(function () {
            toast.show();
          });
        });
      }).catch(function (error) {
        // There was an error saving to IDB
        console.log(error.message);
        toast.setText('Article could not be saved for offline');
        toast.show();
      });
      return true;
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.isCurrentPageSaved();
      this.bindEvents();
      return true;
    }
  }]);

  return SaveForOffline;
}();

var OfflineArticles = function () {
  function OfflineArticles() {
    _classCallCheck(this, OfflineArticles);

    this.sel = {
      component: '.articleGrid--saved',
      grid: '.articleGrid--saved .articleGrid__grid',
      title: '.articleGrid--saved .articleGrid__title',
      template: '#articleGrid__panelTemplate',
      editSavedArticles: '.hero__editSavedArticles',
      articles: '.articleGrid--saved .articleGrid__grid .articlePanel',
      deletableArticle: '.articleGrid--saved .articleGrid__grid .articlePanel--deletable'
    };
    this.saveForOffline = new SaveForOffline();
    this.template = $($(this.sel.template).html());

    this.init = this.init.bind(this);
    this.loadArticles = this.loadArticles.bind(this);
    this.populateTemplates = this.populateTemplates.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
  }

  _createClass(OfflineArticles, [{
    key: 'loadArticles',
    value: function loadArticles() {
      var _this4 = this;

      return _Database2.default.getArticles().then(function (articles) {
        var items = [];
        for (var i = 0; i < articles.length; i++) {
          var article = articles[i];
          items.push({
            Link: article.link,
            Title: article.title,
            Description: article.description,
            Category: {
              Name: article.categoryName,
              Link: article.categoryLink
            },
            TimeToRead: article.timeToRead,
            Images: {
              Mobile: article.imageMobile,
              Desktop: article.imageDesktop
            },
            IsLarge: article.isLarge,
            IsVideo: article.isVideo
          });
        }
        if (items.length > 0) {
          $(_this4.sel.grid).html(_this4.populateTemplates(items));
        } else {
          $(_this4.sel.title).text('You have no saved articles');
        }
      });
    }
  }, {
    key: 'populateTemplates',
    value: function populateTemplates(items) {
      var output = [];
      for (var i = 0; i < items.length; i++) {
        // Clone template
        var $template = this.template.clone();
        // Get the item
        var item = items[i];
        // Set image breakpoint
        var desktopBreakpoint = 992;
        // Generate ID
        var panelId = Math.random().toString(36).substr(2, 9);
        // Populate ID
        $template.find('.articlePanel').attr('id', panelId);
        // If large panel
        if (item.IsLarge) {
          // Update image breakpoint
          desktopBreakpoint = 768;
          // Add class
          $template.find('.articlePanel').addClass('articlePanel--large');
        }
        // If video
        if (item.IsVideo) {
          // Add class
          $template.find('.articlePanel').addClass('articlePanel--video');
        }
        // Populate images
        $template.find('.articlePanel__image').attr({
          href: item.Link,
          title: item.Title
        }).attr('style', 'background-image: url(' + item.Images.Mobile + ');');
        $template.find('style')[0].innerHTML = '@media screen and (min-width: ' + desktopBreakpoint + 'px){#' + panelId + ' .articlePanel__image{background-image: url(' + item.Images.Desktop + ') !important;}}';
        // Populate link
        $template.find('.articlePanel__content > a').attr({
          href: item.Link,
          title: item.Title
        });
        // Populate title
        $template.find('.articlePanel__title').text(item.Title);
        // Populate description
        $template.find('.articlePanel__description').text(item.Description);
        // Populate category
        $template.find('.articlePanel__subTitle a:first-child').attr({
          'href': item.Category.Link,
          'title': item.Category.Name
        }).text(item.Category.Name);
        // Populate time to read
        $template.find('.articlePanel__subTitle a:last-child').attr({
          'href': item.Link,
          'title': item.Title
        }).text(item.TimeToRead);
        // Push item to output
        output.push($template);
      }
      return output;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      $(document).on('click', this.sel.editSavedArticles, this.handleEdit);
      $(document).on('click', this.sel.deletableArticle, this.deleteArticle);
      $(this.sel.articles).swipedetect(this.handleSwipe);
    }
  }, {
    key: 'handleEdit',
    value: function handleEdit(e) {
      e.preventDefault();
      $(this.sel.editSavedArticles).toggleClass('hero__editSavedArticles--editing');
      if ($(this.sel.editSavedArticles).hasClass('hero__editSavedArticles--editing')) {
        $(this.sel.grid).find('.articlePanel').addClass('articlePanel--deletable');
      } else {
        $(this.sel.grid).find('.articlePanel').removeClass('articlePanel--deletable');
      }
    }
  }, {
    key: 'deleteArticle',
    value: function deleteArticle(e) {
      var _this5 = this;

      e.preventDefault();
      var $articlePanel = $(e.target).parents('.articlePanel');
      var url = new URL($articlePanel.find('.articlePanel__image')[0].href);
      this.saveForOffline.doUnsave(url.pathname).then(function () {
        $articlePanel.parent().remove();
        if ($(_this5.sel.grid).find('.articlePanel').length <= 0) {
          $(_this5.sel.grid).append('<div class="col-12"><h2 class="articleGrid__title">You have no saved articles</h2></div>');
          _this5.handleEdit({ preventDefault: function preventDefault() {} });
        }
      });
    }
  }, {
    key: 'handleSwipe',
    value: function handleSwipe(swipedir, element) {
      // swipedir contains either "none", "left", "right", "top", or "down"
      var isDeletable = $(element).hasClass('articlePanel--deletable');
      if (swipedir === 'left' && !isDeletable) {
        $('.articlePanel.articlePanel--deletable').removeClass('articlePanel--deletable');
        $(element).addClass('articlePanel--deletable');
      } else if (swipedir === 'right' && isDeletable) {
        $(element).removeClass('articlePanel--deletable');
      }
    }
  }, {
    key: 'init',
    value: function init() {
      var _this6 = this;

      if ($(this.sel.component).length <= 0) return false;
      this.loadArticles().then(function () {
        _this6.bindEvents();
      });
      return true;
    }
  }]);

  return OfflineArticles;
}();

var Offline = function () {
  function Offline() {
    _classCallCheck(this, Offline);

    this.saveForOffline = new SaveForOffline();
    this.offlineArticles = new OfflineArticles();
    this.init = this.init.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
    this.doOnline = this.doOnline.bind(this);
    this.doOffline = this.doOffline.bind(this);
  }

  _createClass(Offline, [{
    key: 'checkStatus',
    value: function checkStatus() {
      if (navigator.onLine) {
        this.doOnline();
      } else {
        this.doOffline();
      }
    }
  }, {
    key: 'doOnline',
    value: function doOnline() {
      $('body').removeClass('offline');
      $('.disable-offline[tabindex="-1"], .disable-offline *[tabindex="-1"]').removeAttr('tabindex');
    }
  }, {
    key: 'doOffline',
    value: function doOffline() {
      $('body').addClass('offline');
      $('.disable-offline, .disable-offline *').attr('tabindex', '-1');
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      window.addEventListener('online', this.doOnline);
      window.addEventListener('offline', this.doOffline);
    }
  }, {
    key: 'init',
    value: function init() {
      if (!('onLine' in navigator)) return false;
      this.saveForOffline.init();
      this.offlineArticles.init();
      this.checkStatus();
      this.bindEvents();
      return true;
    }
  }]);

  return Offline;
}();

exports.default = new Offline();

},{"./Database":8,"./Toast":30}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Password = function () {
  function Password() {
    _classCallCheck(this, Password);

    this.sel = {
      component: '.forms__password',
      toggle: '.forms__password input[type=checkbox]'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.togglePlainText = this.togglePlainText.bind(this);
  }

  _createClass(Password, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      $(document).on('change', this.sel.toggle, function (e) {
        var passwordTarget = $(e.target).attr('data-field-id');
        _this.togglePlainText(passwordTarget);
      });
    }
  }, {
    key: 'togglePlainText',
    value: function togglePlainText(fieldId) {
      var field = $('#' + fieldId);
      switch (field.attr('type')) {
        case 'password':
          field.attr('type', 'text');
          break;

        default:
        case 'text':
          field.attr('type', 'password');
          break;
      }
    }
  }]);

  return Password;
}();

exports.default = new Password();

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PasswordReminderForm = function () {
  function PasswordReminderForm() {
    _classCallCheck(this, PasswordReminderForm);

    this.config = {
      urlToken: '/libs/granite/csrf/token.json',
      urlLogin: '/bin/dhl/login/index.json',
      urlRequest: '/bin/dhl/request_password/index.json',
      urlReset: '/bin/dhl/reset_password/index.json'
    };

    this.sel = {
      component: '.reset-password-container'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.createCookie = this.createCookie.bind(this);

    this.requestToken = this.requestToken.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  _createClass(PasswordReminderForm, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      jQuery.validator.addMethod('password', function (value, element) {
        return new RegExp($(element).attr('pattern')).test(value);
      }, 'Password format is not valid');

      jQuery.validator.addMethod('equalTo', function (value, element) {
        return $('#' + $(element).attr('data-equalTo')).val() === $(element).val();
      }, 'Passwords do not match');

      var reminderPage = $(this.sel.component);
      if (reminderPage.length > 0) {
        var username = reminderPage.data('username');
        var token = reminderPage.data('token');

        if (username !== null && typeof username !== 'undefined' && username.length > 0 && token !== null && typeof token !== 'undefined' && token.length > 0) {
          reminderPage.find('.step-3').show();
          reminderPage.find('.step-1').hide();
          reminderPage.find('.step-2').hide();
        } else {
          reminderPage.find('.step-1').show();
          reminderPage.find('.step-2').hide();
          reminderPage.find('.step-3').hide();
        }

        reminderPage.find('.step-1 form').validate({
          rules: {
            resetPassword__email: 'email'
          },
          errorPlacement: function errorPlacement(error, element) {
            if (element.attr('type') === 'checkbox') {
              error.insertAfter($(element).parent().find('label'));
            } else if (element.attr('type') === 'password') {
              $(element).append(error);
              error.insertAfter($(element).parent());
            } else if (element.attr('type') === 'search') {
              error.insertAfter($(element).parent());
            } else {
              error.insertAfter(element);
            }
          },
          submitHandler: function submitHandler(form) {
            _this.requestToken(form);
            return false;
          }
        });

        reminderPage.find('.step-3 form').validate({
          rules: {
            reset__createPassword: 'password',
            reset__confirmPassword: 'equalTo'
          },
          errorPlacement: function errorPlacement(error, element) {
            if (element.attr('type') === 'checkbox') {
              error.insertAfter($(element).parent().find('label'));
            } else if (element.attr('type') === 'password') {
              $(element).append(error);
              error.insertAfter($(element).parent());
            } else if (element.attr('type') === 'search') {
              error.insertAfter($(element).parent());
            } else {
              error.insertAfter(element);
            }
          },
          submitHandler: function submitHandler(form) {
            _this.resetPassword(form);
            return false;
          }
        });
      }
    }
  }, {
    key: 'createCookie',
    value: function createCookie(name, value, expirySeconds) {
      var expires = '';
      if (expirySeconds) {
        var date = new Date();
        date.setTime(date.getTime() + expirySeconds * 1000);
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + value + expires + '; path=/';
    }
  }, {
    key: 'requestToken',
    value: function requestToken(form) {
      var _this2 = this;

      var data = {
        username: $(form).find('input#resetPassword__email').val(),
        page: window.location.href
      };

      $(form).find("button[type='submit']").text('please wait...');
      $(form).find('input.forms__cta--red').val('please wait...');
      $.get(this.config.urlToken, function (tokenresponse) {
        var csrftoken = tokenresponse.token;
        $.ajax({
          url: _this2.config.urlRequest,
          data: data,
          type: 'post',
          headers: { 'CSRF-Token': csrftoken },
          dataType: 'json',
          success: function success(response) {
            if (response) {
              if (response.status === 'ok') {
                $(_this2.sel.component).find('.step-1').hide();
                $(_this2.sel.component).find('.step-2').show();
              } else {
                alert('An error occurred while attempting to request a password reset.\n' + response.error);
              }
            } else {
              alert('An unknown error occurred while attempting to request a password reset. Please try again later');
            }
            $(form).find("button[type='submit']").text('Get new password');
            $(form).find('input.forms__cta--red').val('Get new password');
          }
        });
      });
    }
  }, {
    key: 'resetPassword',
    value: function resetPassword(form) {
      var _this3 = this;

      var username = $(this.sel.component).data('username');
      var token = $(this.sel.component).data('token');
      var password = $(form).find('input#reset__createPassword').val();
      var data = {
        username: username,
        token: token,
        password: password
      };

      $(form).find("button[type='submit']").text('please wait...');
      $(form).find('input.forms__cta--red').val('please wait...');
      $.get(this.config.urlToken, function (tokenresponse) {
        var csrftoken = tokenresponse.token;
        $.ajax({
          url: _this3.config.urlReset,
          data: data,
          type: 'post',
          headers: { 'CSRF-Token': csrftoken },
          dataType: 'json',
          success: function success(response) {
            if (response) {
              if (response.status === 'ok') {
                $.get(_this3.config.urlToken, function (nextTokenResponse) {
                  var nextcsrftoken = nextTokenResponse.token;

                  $.ajax({
                    url: _this3.config.urlLogin,
                    data: { username: username, password: password },
                    type: 'post',
                    headers: { 'CSRF-Token': nextcsrftoken },
                    dataType: 'json',
                    success: function success(loginResponse) {
                      if (loginResponse) {
                        if (loginResponse.status === 'ok') {
                          $(window).trigger('checkauthtokens.DHL', [loginResponse, true]);

                          var backUrl = $(form).data('back');
                          if ($.trim(backUrl).length === 0) {
                            backUrl = '/content/dhl.html';
                          }
                          window.location = backUrl;
                        } else {
                          alert('An error occurred while attempting to login using your updated credentials.\n' + response.error);
                        }
                      } else {
                        alert('An unknown error occurred while attempting to login using your updated credentials. Please try again later');
                      }
                      $(form).find("button[type='submit']").text('Submit');
                      $(form).find('input.forms__cta--red').val('Submit');
                    }
                  });
                });
              } else {
                alert('An error occurred while attempting to request a password reset.\n' + response.error);
              }
            } else {
              alert('An unknown error occurred while attempting to request a password reset. Please try again later');
            }
          }
        });
      });
    }
  }]);

  return PasswordReminderForm;
}();

exports.default = new PasswordReminderForm();

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PasswordValidityApi = function () {
  function PasswordValidityApi() {
    _classCallCheck(this, PasswordValidityApi);

    this.checkCasing = this.checkCasing.bind(this);
    this.checkSpecial = this.checkSpecial.bind(this);
    this.checkNumber = this.checkNumber.bind(this);
    this.checkLength = this.checkLength.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  _createClass(PasswordValidityApi, [{
    key: 'isValid',
    value: function isValid(password) {
      var isLengthValid = this.checkLength(password);
      var isCasingValid = this.checkCasing(password);
      var isSpeicalValid = this.checkSpecial(password);
      var isNumberValid = this.checkNumber(password);

      var result = {
        isValid: isLengthValid && isCasingValid && isSpeicalValid && isNumberValid,
        isLengthValid: isLengthValid,
        isCasingValid: isCasingValid,
        isSpeicalValid: isSpeicalValid,
        isNumberValid: isNumberValid
      };

      return result;
    }
  }, {
    key: 'checkLength',
    value: function checkLength(password) {
      return password.length >= 8;
    }
  }, {
    key: 'checkCasing',
    value: function checkCasing(password) {
      return (/^(?=.*[a-z]).+$/.test(password) && /^(?=.*[A-Z]).+$/.test(password)
      );
    }
  }, {
    key: 'checkNumber',
    value: function checkNumber(password) {
      return (/^(?=.*[0-9]).+$/.test(password)
      );
    }
  }, {
    key: 'checkSpecial',
    value: function checkSpecial(password) {
      return (/^(?=.*[!£%&*()={}@#><]).+$/.test(password)
      );
    }
  }]);

  return PasswordValidityApi;
}();

// I've assumed there will only be one password validity checker on a page at once, because:
// - the validity checker would only be on the main password entry field and not the confirmation
// - a user wouldn't be setting more than one password at once


var PasswordValidity = function () {
  function PasswordValidity() {
    _classCallCheck(this, PasswordValidity);

    this.sel = {
      component: '.validity-checks'
    };

    this.passwordApi = new PasswordValidityApi();
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
  }

  _createClass(PasswordValidity, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      var passwordFieldId = $(this.sel.component).attr('data-field-id');
      var passwordField = $('#' + passwordFieldId);

      $(document).on('keyup keypress change', '#' + passwordFieldId, function () {
        var password = passwordField.val();
        _this.checkPasswordValidity(password);
      });
    }
  }, {
    key: 'isPasswordValid',
    value: function isPasswordValid(password) {
      var result = this.passwordApi.isValid(password);
      return result.isValid;
    }
  }, {
    key: 'checkPasswordValidity',
    value: function checkPasswordValidity(password) {
      var result = this.passwordApi.isValid(password);

      if (result.isLengthValid) {
        $('[data-check=length]').addClass('is-valid');
      } else {
        $('[data-check=length]').removeClass('is-valid');
      }

      if (result.isCasingValid) {
        $('[data-check=casing]').addClass('is-valid');
      } else {
        $('[data-check=casing]').removeClass('is-valid');
      }

      if (result.isSpeicalValid) {
        $('[data-check=special]').addClass('is-valid');
      } else {
        $('[data-check=special]').removeClass('is-valid');
      }

      if (result.isNumberValid) {
        $('[data-check=number]').addClass('is-valid');
      } else {
        $('[data-check=number]').removeClass('is-valid');
      }
    }
  }]);

  return PasswordValidity;
}();

exports.default = new PasswordValidity();

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RegisterForm = function () {
  function RegisterForm() {
    _classCallCheck(this, RegisterForm);

    this.config = {
      // fbAppId: '1000773163337798',
      fbAppId: '1080031328801211',
      // goClientId: '913960352236-u7un0l22tvkmlbpa5bcnf1uqg4csi7e3.apps.googleusercontent.com',
      goClientId: '313469837420-l882h39ge8n8n9pb97ldvjk3fm8ppqgs.apps.googleusercontent.com',

      urlToken: '/libs/granite/csrf/token.json',
      urlRefreshCheck: '/bin/dhl/refresh_token/index.json',
      urlRegister: '/bin/dhl/register/index.json',
      urlUpdateCategories: '/bin/dhl/update_categories/index.json'
    };

    this.sel = {
      component: '.page-body.register, #download, .gated',
      buttonFacebook: '.forms__cta--social.fb',
      buttonLinkedin: '.forms__cta--social.li',
      buttonGooglePlus: '.forms__cta--social.go'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.loggedIn = this.loggedIn.bind(this);

    this.tryRegisterFacebook = this.tryRegisterFacebook.bind(this);
    this.tryRegisterLinkedin = this.tryRegisterLinkedin.bind(this);
    this.tryRegisterGoogle = this.tryRegisterGoogle.bind(this);
    this.tryRegister = this.tryRegister.bind(this);

    this.executeRegister = this.executeRegister.bind(this);
  }

  _createClass(RegisterForm, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      return true;
    }
  }, {
    key: 'readCookie',
    value: function readCookie(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length);
        }if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }

      return null;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      $(window).on('userloggedin.DHL', function () {
        _this.loggedIn();
      });

      jQuery.validator.addMethod('password', function (value, element) {
        if ($.trim(value).length === 0) return true;
        return new RegExp($(element).attr('pattern')).test(value);
      }, 'Password format is not valid');

      jQuery.validator.addMethod('equalTo', function (value, element) {
        return $('#' + $(element).attr('data-equalTo')).val() === $(element).val();
      }, 'Passwords do not match');

      if ($(this.sel.component).find(this.sel.buttonFacebook).length > 0) {
        window.fbAsyncInit = function () {
          window.fb_interval = setInterval(function () {
            if (typeof window.FB !== 'undefined' && window.FB !== null) {
              window.FB.init({
                appId: _this.config.fbAppId,
                cookie: true,
                xfbml: true,
                version: 'v2.8'
              });

              clearInterval(window.fb_interval);
            }
          }, 100);
        };

        if (document.getElementById('facebook-jssdk') === null) {
          var fjs = document.getElementsByTagName('script')[0];
          var js = document.createElement('script');
          js.id = 'facebook-jssdk';
          js.src = '//connect.facebook.net/en_EN/sdk.js';
          fjs.parentNode.insertBefore(js, fjs);
        }
        $(this.sel.component).find(this.sel.buttonFacebook).on('click', function (evt) {
          _this.tryRegisterFacebook(evt);
          return false;
        });
      }

      if ($(this.sel.component).find(this.sel.buttonLinkedin).length > 0) {
        $(this.sel.component).find(this.sel.buttonLinkedin).on('click', function (evt) {
          _this.tryRegisterLinkedin(evt);
          return false;
        });
      }

      var googleButton = $(this.sel.component).find(this.sel.buttonGooglePlus);
      if (googleButton.length > 0) {
        window.go_interval = setInterval(function () {
          if (typeof window.gapi !== 'undefined' && window.gapi !== null) {
            window.gapi.load('auth2', function () {
              var auth2 = window.gapi.auth2.init({
                client_id: _this.config.goClientId,
                cookiepolicy: 'single_host_origin'
              });

              var element = googleButton.get(0);
              auth2.attachClickHandler(element, {}, function (googleUser) {
                _this.tryRegisterGoogle(googleUser);
                return false;
              }, function (result) {
                if (result.error !== 'popup_closed_by_user') {
                  alert(result.error);
                }
              });
            });

            clearInterval(window.go_interval);
          }
        }, 100);

        $(this.sel.component).find(this.sel.buttonGooglePlus).on('click', function (evt) {
          evt.preventDefault();
          return false;
        });
      }

      $(this.sel.component).find('#glb-register-start form#register-detail-form').validate({
        rules: {
          register__email: 'email',
          register__password1: 'password'
        },
        errorPlacement: function errorPlacement(error, element) {
          if (element.attr('type') === 'checkbox') {
            error.insertAfter($(element).parent().find('label'));
          } else if (element.attr('type') === 'password') {
            $(element).append(error);
            error.insertAfter($(element).parent());
          } else if (element.attr('type') === 'search') {
            error.insertAfter($(element).parent());
          } else {
            error.insertAfter(element);
          }
        },
        submitHandler: function submitHandler(form) {
          _this.tryRegister(form);
          return false;
        }
      });

      $(this.sel.component).find('#glb-register-categories form .forms__cta--red').on('click', function (evt) {
        evt.preventDefault();
        _this.tryCategorySelection(evt);
        return false;
      });
    }
  }, {
    key: 'tryRegisterFacebook',
    value: function tryRegisterFacebook(evt) {
      var _this2 = this;

      evt.preventDefault();

      $(this.sel.component).find(this.sel.buttonFacebook).text('please wait...');

      window.FB.login(function (loginResponse) {
        if (loginResponse.authResponse) {
          window.FB.api('/me', function (dataResponse) {
            var data = {
              firstname: dataResponse.first_name,
              lastname: dataResponse.last_name,
              username: dataResponse.email,
              password: dataResponse.id,
              islinkedin: 'true',
              tcagree: true
            };

            _this2.executeRegister(data, function () {
              $(_this2.sel.component).find(_this2.sel.buttonFacebook).text('Facebook');
            });
          }, { fields: ['id', 'email', 'first_name', 'last_name'] });
        }
        return false;
      }, { scope: 'email,public_profile', return_scopes: true });
    }
  }, {
    key: 'tryRegisterLinkedin',
    value: function tryRegisterLinkedin(evt) {
      var _this3 = this;

      evt.preventDefault();

      $(this.sel.component).find(this.sel.buttonLinkedin).text('please wait...');

      IN.User.authorize(function () {
        IN.API.Profile('me').fields('id', 'first-name', 'last-name', 'email-address').result(function (result) {
          var member = result.values[0];

          var data = {
            firstname: member.firstName,
            lastname: member.lastName,
            username: member.emailAddress,
            password: member.id,
            islinkedin: 'true',
            tcagree: true
          };

          _this3.executeRegister(data, function () {
            $(_this3.sel.component).find(_this3.sel.buttonLinkedin).text('LinkedIn');
          });
        });
      });

      setInterval(function () {
        var result = window.IN.User.isAuthorized();
        if (result) {
          IN.API.Profile('me').fields('id', 'first-name', 'last-name', 'email-address').result(function (result) {
            var member = result.values[0];

            var data = {
              firstname: member.firstName,
              lastname: member.lastName,
              username: member.emailAddress,
              password: member.id,
              islinkedin: 'true',
              tcagree: true
            };

            _this3.executeRegister(data, function () {
              $(_this3.sel.component).find(_this3.sel.buttonLinkedin).text('LinkedIn');
            });
          });
        }
      }, 1000);
      return false;
    }
  }, {
    key: 'tryRegisterGoogle',
    value: function tryRegisterGoogle(googleUser) {
      var _this4 = this;

      var basicProfile = googleUser.getBasicProfile();

      var data = {
        firstname: basicProfile.getGivenName(),
        lastname: basicProfile.getFamilyName(),
        username: basicProfile.getEmail(),
        password: basicProfile.getId(),
        islinkedin: 'true',
        tcagree: true
      };

      $(this.sel.component).find(this.sel.buttonGooglePlus).text('please wait...');
      this.executeRegister(data, function () {
        $(_this4.sel.component).find(_this4.sel.buttonGooglePlus).text('Google+');
      });
    }
  }, {
    key: 'tryRegister',
    value: function tryRegister(form) {
      var frm = $(form);
      var data = {
        firstname: frm.find('input#register__firstname').val(),
        lastname: frm.find('input#register__lastname').val(),
        username: frm.find('input#register__email').val(),
        password: frm.find('input#register__password1').val(),

        islinkedin: 'false',
        tcagree: frm.find('input#checkboxId').is(':checked')
      };

      if ($.trim(data.firstname).length === 0 || $.trim(data.lastname).length === 0 || $.trim(data.username).length === 0) {
        alert('Please enter your name and email address.');
      } else {
        frm.find("button[type='submit']").text('please wait...');
        frm.find('input.forms__cta--red').val('please wait...');

        this.executeRegister(data, function () {
          frm.find("button[type='submit']").text('Submit');
          frm.find('input.forms__cta--red').val('Submit');
        });
      }

      return false;
    }
  }, {
    key: 'executeRegister',
    value: function executeRegister(data, unwaitCallback) {
      var _this5 = this;

      $.get(this.config.urlToken, function (tokenresponse) {
        var csrftoken = tokenresponse.token;

        $.ajax({
          url: _this5.config.urlRegister,
          data: data,
          type: 'post',
          headers: { 'CSRF-Token': csrftoken },
          dataType: 'json',
          success: function success(response) {
            if (response) {
              var frm = $('.page-body.register, #download, .gated').find('form');

              if (response.status === 'ok') {
                $(window).trigger('checkauthtokens.DHL', [response, true]);

                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  'event': 'registrationComplete'
                });

                if (frm.closest('#download').length > 0 || frm.closest('.gated').length > 0) {
                  location.reload();
                  return;
                }

                var modal = $('.register.below-register-form').find('.modal');
                var categorySelection = $(_this5.sel.component).find('#glb-register-categories');
                if (modal.length > 0) {
                  modal.find('.thanks-name').text(data.firstname);
                  modal.find('button').on('click', function () {
                    var backUrl = frm.data('back');
                    if ($.trim(backUrl).length === 0) {
                      location.reload();
                    } else {
                      window.location = backUrl;
                    }
                  });

                  modal.modal('show');
                } else if (categorySelection.length > 0) {
                  $(_this5.sel.component).find('#glb-register-start').hide();

                  categorySelection.find('.forms__title').text('Thanks ' + response.name);
                  categorySelection.show();
                }
              } else if (response.error.includes('Email address already exists')) {
                $('<label id="register__email-error" class="error" for="register__email">This email address already exists</label>').insertAfter(frm.find('input#register__email'));
              } else {
                alert('An error occurred while attempting to register.\n' + response.error);
              }
            } else {
              alert('An unknown error occurred while attempting to register. Please try again later.');
            }
            unwaitCallback();
          }
        });
      });
    }
  }, {
    key: 'tryCategorySelection',
    value: function tryCategorySelection() {
      var _this6 = this;

      var categories = '';
      var container = $(this.sel.component).find('#glb-register-categories form');
      container.find('input:checked').each(function (index, item) {
        if (categories.length > 0) {
          categories += ',';
        }
        categories += $(item).val();
      });

      if (categories.length > 0) {
        var cookie = this.readCookie('DHL.AuthToken');
        if (cookie !== null) {
          var split = cookie.split('|');
          if (split.length >= 2) {
            $.get(this.config.urlToken, function (tokenresponse) {
              var csrftoken = tokenresponse.token;
              $.ajax({
                url: _this6.config.urlUpdateCategories,
                data: { username: split[0], token: split[1], cats: categories },
                type: 'post',
                headers: { 'CSRF-Token': csrftoken },
                dataType: 'json',
                success: function success(updateCategoriesResponse) {
                  if (updateCategoriesResponse) {
                    if (updateCategoriesResponse.status === 'ok') {
                      $(window).trigger('checkauthtokens.DHL', [updateCategoriesResponse, true]);
                      window.location = '/content/dhl.html';
                    } else {
                      alert('An unknown error occurred while attempting to update your details (1). Please try again later');
                    }
                  } else {
                    alert('An unknown error occurred while attempting to update your details (2). Please try again later');
                  }
                }
              });
            });
          } else {
            alert('An unknown error occurred while attempting to update your details (3). Please try again later');
          }
        } else {
          var refreshCookie = this.readCookie('DHL.RefreshToken');
          if (refreshCookie !== null) {
            var refreshSplit = refreshCookie.split('|');
            if (refreshSplit.length >= 2) {
              $.get(this.config.urlToken, function (tokenresponse) {
                var csrftoken = tokenresponse.token;
                $.ajax({
                  url: _this6.config.urlRefreshCheck,
                  data: { username: refreshSplit[0], refresh_token: refreshSplit[1] },
                  type: 'post',
                  headers: { 'CSRF-Token': csrftoken },
                  dataType: 'json',
                  success: function success(refreshResponse) {
                    if (refreshResponse) {
                      if (refreshResponse.status === 'ok') {
                        $(window).trigger('checkauthtokens.DHL', [refreshResponse, true]);
                        _this6.tryCategorySelection();
                      } else {
                        alert('An unknown error occurred while attempting to update your details (4). Please try again later');
                      }
                    } else {
                      alert('An unknown error occurred while attempting to update your details (5). Please try again later');
                    }
                  }
                });
              });
            } else {
              alert('An unknown error occurred while attempting to update your details (6). Please try again later');
            }
          } else {
            alert('An unknown error occurred while attempting to enter the competition. Please try again later');
          }
        }
      }

      return false;
    }
  }, {
    key: 'loggedIn',
    value: function loggedIn() {
      if ($('.page-body.register').length > 0) {
        window.location = '/content/dhl/your-account.html';
      }
    }
  }]);

  return RegisterForm;
}();

exports.default = new RegisterForm();

},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SearchForm = function () {
  function SearchForm() {
    _classCallCheck(this, SearchForm);

    this.sel = {
      component: '.search-form',
      clearButton: '.search-form__clear-icon',
      input: '.search-form__search input[type=search]'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.clearSearchForm = this.clearSearchForm.bind(this);
  }

  _createClass(SearchForm, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      $(document).on('click', this.sel.clearButton, function () {
        _this.clearSearchForm();
      });
    }
  }, {
    key: 'clearSearchForm',
    value: function clearSearchForm() {
      $(this.sel.input).val('').focus();
    }
  }]);

  return SearchForm;
}();

exports.default = new SearchForm();

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceWorker = function () {
  function ServiceWorker() {
    _classCallCheck(this, ServiceWorker);

    this.deferredPrompt = null;

    this.init = this.init.bind(this);
    this.register = this.register.bind(this);
    this.addToHomeScreen = this.addToHomeScreen.bind(this);
  }

  _createClass(ServiceWorker, [{
    key: 'register',
    value: function register() {
      navigator.serviceWorker.register('/etc.clientlibs/dhl/clientlibs/clientlib-site/resources/sw.js').then(function () {
        // console.log('ServiceWorker succesfully registered');
      }).catch(function () {
        // console.log('ServiceWorker registration failed: ', err);
      });
    }
  }, {
    key: 'addToHomeScreen',
    value: function addToHomeScreen() {
      var _this = this;

      window.addEventListener('beforeinstallprompt', function (e) {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        _this.deferredPrompt = e;
        // Check if already dismissed
        var a2hsCookie = Cookies.get('a2hs');
        // If the cookie is set to ignore, ignore the prompt
        if (a2hsCookie === 'ignore') return;
        // Show the add to home screen banner
        $('.addToHomeScreen').addClass('addToHomeScreen--open');
      });

      $(document).on('click', '.addToHomeScreen__cta', function (e) {
        e.preventDefault();
        // Show A2HS
        _this.deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        _this.deferredPrompt.userChoice.then(function (choiceResult) {
          if (choiceResult.outcome === 'accepted') {
            // Hide the add to home screen banner
            $('.addToHomeScreen').removeClass('addToHomeScreen--open');
          } else {
            // Change content
            $('.addToHomeScreen__title').text('That\'s a shame, maybe next time');
            $('.addToHomeScreen__cta').remove();
            $('.addToHomeScreen__link').text('Close');
            // Set ignore cookie
            _this.createA2hsCookie();
          }
          _this.deferredPrompt = null;
        });
      });

      $(document).on('click', '.addToHomeScreen__link', function (e) {
        e.preventDefault();
        // Hide the add to home screen banner
        $('.addToHomeScreen').removeClass('addToHomeScreen--open');
        // Clear the prompt
        _this.deferredPrompt = null;
        // Set ignore cookie
        _this.createA2hsCookie();
      });
    }
  }, {
    key: 'createA2hsCookie',
    value: function createA2hsCookie() {
      // Set ignore cookie
      Cookies.set('a2hs', 'ignore', { expires: 14 });
    }
  }, {
    key: 'init',
    value: function init() {
      if (!('serviceWorker' in navigator)) return false;
      this.register();
      this.addToHomeScreen();
      return true;
    }
  }]);

  return ServiceWorker;
}();

exports.default = new ServiceWorker();

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShipForm = function () {
  function ShipForm() {
    _classCallCheck(this, ShipForm);

    this.sel = {
      // QSP = querystring parameter
      component: '.ship-now',
      firstnameInput: '#firstname', // jquery selector for input (can be eg '.firstname input')
      firstnameQSP: '?firstname', // need ? followed by parameter name
      lastnameInput: '#lastname',
      lastnameQSP: '?lastname',
      emailInput: '#email',
      emailQSP: '?email',
      userFirstnameElement: '.user-firstname'
    };

    this.init = this.init.bind(this);
    this.populateForm = this.populateForm.bind(this);
    this.showLoggedInElements = this.showLoggedInElements.bind(this);
  }

  _createClass(ShipForm, [{
    key: 'init',
    value: function init() {
      var _this = this;

      if ($(this.sel.component).length <= 0) return false;

      $(window).on('userloggedin.DHL', function (evt, tokenData) {
        _this.showLoggedInElements(tokenData);
      });

      this.populateForm();
      return true;
    }
  }, {
    key: 'populateForm',
    value: function populateForm() {
      var email = url(this.sel.emailQSP);
      var firstname = url(this.sel.firstnameQSP);
      var lastname = url(this.sel.lastnameQSP);

      if (typeof email !== 'undefined') {
        $(this.sel.emailInput).val(email);
      }

      if (typeof firstname !== 'undefined') {
        $(this.sel.firstnameInput).val(firstname);

        if ($.trim(firstname).length > 0) {
          $(this.sel.userFirstnameElement).text(firstname);
        }
      }

      if (typeof lastname !== 'undefined') {
        $(this.sel.lastnameInput).val(lastname);
      }
    }
  }, {
    key: 'showLoggedInElements',
    value: function showLoggedInElements(tokenData) {
      var firstname = url(this.sel.firstnameQSP);

      if (typeof firstname === 'undefined' || $.trim(firstname).length == 0) {
        $(this.sel.userFirstnameElement).text(tokenData.name);
      }
    }
  }]);

  return ShipForm;
}();

exports.default = new ShipForm();

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShipNowForm = function () {
  function ShipNowForm() {
    _classCallCheck(this, ShipNowForm);

    this.sel = {
      form: 'form.forms.ship-now',
      countryselect: 'form.forms.ship-now #shipnow_country'
    };
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.toggleAddress = this.toggleAddress.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.validate = this.validate.bind(this);
  }

  _createClass(ShipNowForm, [{
    key: 'bindEvents',
    value: function bindEvents() {
      $(document).on('change', this.sel.countryselect, this.toggleAddress);
      $(document).on('submit', this.sel.form, this.submitForm);

      var country = $(this.sel.form).data('preselectcountry');
      if (country !== null && $.trim(country).length > 0) {
        $(this.sel.countryselect).val(country).trigger('change');
      }
    }
  }, {
    key: 'validate',
    value: function validate() {
      $(this.sel.form).each(function (index, item) {
        $(item).validate({
          errorPlacement: function errorPlacement(error, element) {
            if (element.attr('type') === 'checkbox') {
              error.insertAfter($(element).parent().find('label'));
            } else if (element.is('select')) {
              error.insertAfter(element);
              element.parent().find('.selectboxit-btn').addClass('error');
            } else {
              error.insertAfter(element);
            }
          },
          success: function success(label) {
            var $parent = $(label).parents('form.ship-now');
            if ($parent.find('select').length > 0) {
              $parent.find('.selectboxit-btn').removeClass('error');
            }
          }
        });
      });
    }
  }, {
    key: 'toggleAddress',
    value: function toggleAddress(e) {
      var val = $(this.sel.countryselect).val();

      var options = $('option', this.sel.countryselect);
      var mandatory = true;
      options.each(function (index, item) {
        if ($(item).attr('value') === val && '' + $(item).data('nonmandatory') === 'true') {
          mandatory = false;
        }
      });

      if (mandatory) {
        $('#shipnow_address', this.sel.form).attr('required', 'required').attr('placeholder', 'Address*');
        $('#shipnow_zip', this.sel.form).attr('required', 'required').attr('placeholder', 'ZIP or Postcode*');
        $('#shipnow_city', this.sel.form).attr('required', 'required').attr('placeholder', 'City*');
      } else {
        $('#shipnow_address', this.sel.form).removeAttr('required').attr('placeholder', 'Address').removeClass('error').closest('div').find('label').remove();
        $('#shipnow_zip', this.sel.form).removeAttr('required').attr('placeholder', 'ZIP or Postcode').removeClass('error').closest('div').find('label').remove();
        $('#shipnow_city', this.sel.form).removeAttr('required').attr('placeholder', 'City').removeClass('error').closest('div').find('label').remove();
      }
    }
  }, {
    key: 'submitForm',
    value: function submitForm(e) {
      var _this = this;

      e.preventDefault();
      var $form = $(e.target);
      var formData = this.getFormData($form);
      $.post($form.attr('action'), formData, function (data) {
        if (data.status === 'OK') {
          _this.showSuccess();
        } else {
          _this.showError();
        }
      });
    }
  }, {
    key: 'getFormData',
    value: function getFormData($form) {
      var unindexedArray = $form.serializeArray();
      var indexedArray = {};
      $.map(unindexedArray, function (n) {
        return indexedArray[n.name] = n.value;
      });

      indexedArray.source = $.trim($form.data('source'));

      return indexedArray;
    }
  }, {
    key: 'showSuccess',
    value: function showSuccess() {
      window.location = $(this.sel.form).data('thanks');
    }
  }, {
    key: 'showError',
    value: function showError() {
      alert('An error occurred. Please try again later.');
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.form).length <= 0) return false;
      this.bindEvents();
      this.validate();
      return true;
    }
  }]);

  return ShipNowForm;
}();

exports.default = new ShipNowForm();

},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShipNowTwoStepForm = function () {
  function ShipNowTwoStepForm() {
    _classCallCheck(this, ShipNowTwoStepForm);

    this.firstname = '';
    this.lastname = '';
    this.email = '';

    this.config = {
      // fbAppId: '1000773163337798',
      fbAppId: '1080031328801211',
      // goClientId: '913960352236-u7un0l22tvkmlbpa5bcnf1uqg4csi7e3.apps.googleusercontent.com',
      goClientId: '313469837420-l882h39ge8n8n9pb97ldvjk3fm8ppqgs.apps.googleusercontent.com'
    };

    this.sel = {
      component: '.shipNowMulti.wysiwyg, .animatedForm',
      swingbutton: '.shipNowMulti__headcta--red',
      forms: 'form.forms.ship-now-twostep',
      form1: 'form.forms.form1.ship-now-twostep',
      form2: 'form.forms.form2.ship-now-twostep',
      countryselect: 'form.forms.form2.ship-now-twostep #shipnow_country',

      buttonFacebook: '.forms__cta--social.facebook',
      buttonLinkedin: '.forms__cta--social.linkedin',
      buttonGooglePlus: '.forms__cta--social.google'
    };
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);

    this.toggleAddress = this.toggleAddress.bind(this);
    this.submitFacebook = this.submitFacebook.bind(this);
    this.submitLinkedin = this.submitLinkedin.bind(this);
    this.submitGoogle = this.submitGoogle.bind(this);
    this.submitForm1 = this.submitForm1.bind(this);
    this.nextForm = this.nextForm.bind(this);
    this.submitForm2 = this.submitForm2.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.validate = this.validate.bind(this);
  }

  _createClass(ShipNowTwoStepForm, [{
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      $(document).on('submit', this.sel.form1, this.submitForm1);
      $(document).on('submit', this.sel.form2, this.submitForm2);
      $(document).on('change', this.sel.countryselect, this.toggleAddress);

      var country = $(this.sel.form2).data('preselectcountry');
      if (country !== null && $.trim(country).length > 0) {
        $(this.sel.countryselect).val(country).trigger('change');
      }

      if ($(this.sel.component).find(this.sel.buttonFacebook).length > 0) {
        window.fbAsyncInit = function () {
          window.fb_interval = setInterval(function () {
            if (typeof window.FB !== 'undefined' && window.FB !== null) {
              window.FB.init({
                appId: _this.config.fbAppId,
                cookie: true,
                xfbml: true,
                version: 'v2.8'
              });

              clearInterval(window.fb_interval);
            }
          }, 100);
        };

        if (document.getElementById('facebook-jssdk') === null) {
          var fjs = document.getElementsByTagName('script')[0];
          var js = document.createElement('script');
          js.id = 'facebook-jssdk';
          js.src = '//connect.facebook.net/en_EN/sdk.js';
          fjs.parentNode.insertBefore(js, fjs);
        }
        $(this.sel.component).find(this.sel.buttonFacebook).on('click', function (evt) {
          _this.submitFacebook(evt);
          return false;
        });
      }

      if ($(this.sel.component).find(this.sel.buttonLinkedin).length > 0) {
        $(this.sel.component).find(this.sel.buttonLinkedin).on('click', function (evt) {
          _this.submitLinkedin(evt);
          return false;
        });
      }

      var googleButton = $(this.sel.component).find(this.sel.buttonGooglePlus);
      if (googleButton.length > 0) {
        window.go_interval = setInterval(function () {
          if (typeof window.gapi !== 'undefined' && window.gapi !== null) {
            window.gapi.load('auth2', function () {
              var auth2 = window.gapi.auth2.init({
                client_id: _this.config.goClientId,
                cookiepolicy: 'single_host_origin'
              });

              var element = googleButton.get(0);
              auth2.attachClickHandler(element, {}, function (googleUser) {
                _this.submitGoogle(googleUser);
                return false;
              }, function (result) {
                if (result.error !== 'popup_closed_by_user') {
                  alert(result.error);
                }
              });
            });

            clearInterval(window.go_interval);
          }
        }, 100);

        $(this.sel.component).find(this.sel.buttonGooglePlus).on('click', function (evt) {
          evt.preventDefault();
          return false;
        });
      }

      $(document).on('click', this.sel.swingbutton, function (evt) {
        var id = $(evt.currentTarget).attr('href');
        var offset = $(id).offset().top;
        $('html, body').animate({
          scrollTop: offset
        }, 1000, 'swing');

        return false;
      });
    }
  }, {
    key: 'validate',
    value: function validate() {
      $(this.sel.forms).each(function (index, item) {
        $(item).validate({
          errorPlacement: function errorPlacement(error, element) {
            if (element.attr('type') === 'checkbox') {
              error.insertAfter($(element).parent().find('label'));
            } else if (element.is('select')) {
              error.insertAfter(element);
              element.parent().find('.selectboxit-btn').addClass('error');
            } else {
              error.insertAfter(element);
            }
          },
          success: function success(label) {
            var $parent = $(label).parents('form.ship-now');
            if ($parent.find('select').length > 0) {
              $parent.find('.selectboxit-btn').removeClass('error');
            }
          }
        });
      });
    }
  }, {
    key: 'toggleAddress',
    value: function toggleAddress(e) {
      var val = $(this.sel.countryselect).val();

      var options = $('option', this.sel.countryselect);
      var mandatory = true;
      options.each(function (index, item) {
        if ($(item).attr('value') === val && '' + $(item).data('nonmandatory') === 'true') {
          mandatory = false;
        }
      });

      if (mandatory) {
        $('#shipnow_address', this.sel.form).attr('required', 'required').attr('placeholder', 'Address*');
        $('#shipnow_zip', this.sel.form).attr('required', 'required').attr('placeholder', 'ZIP or Postcode*');
        $('#shipnow_city', this.sel.form).attr('required', 'required').attr('placeholder', 'City*');
      } else {
        $('#shipnow_address', this.sel.form).removeAttr('required').attr('placeholder', 'Address').removeClass('error').closest('div').find('label').remove();
        $('#shipnow_zip', this.sel.form).removeAttr('required').attr('placeholder', 'ZIP or Postcode').removeClass('error').closest('div').find('label').remove();
        $('#shipnow_city', this.sel.form).removeAttr('required').attr('placeholder', 'City').removeClass('error').closest('div').find('label').remove();
      }
    }
  }, {
    key: 'submitFacebook',
    value: function submitFacebook(evt) {
      var _this2 = this;

      evt.preventDefault();

      window.FB.login(function (loginResponse) {
        if (loginResponse.authResponse) {
          window.FB.api('/me', function (dataResponse) {
            _this2.firstname = dataResponse.first_name;
            _this2.lastname = dataResponse.last_name;
            _this2.email = dataResponse.email;

            _this2.nextForm();
          }, { fields: ['id', 'email', 'first_name', 'last_name'] });
        }
        return false;
      }, { scope: 'email,public_profile', return_scopes: true });
    }
  }, {
    key: 'submitLinkedin',
    value: function submitLinkedin(evt) {
      var _this3 = this;

      evt.preventDefault();

      IN.User.authorize(function () {
        IN.API.Profile('me').fields('id', 'first-name', 'last-name', 'email-address').result(function (result) {
          var member = result.values[0];

          _this3.firstname = member.firstName;
          _this3.lastname = member.lastName;
          _this3.email = member.emailAddress;

          _this3.nextForm();
        });
      });

      setInterval(function () {
        var result = window.IN.User.isAuthorized();
        if (result) {
          IN.API.Profile('me').fields('id', 'first-name', 'last-name', 'email-address').result(function (result) {
            var member = result.values[0];

            _this3.firstname = member.firstName;
            _this3.lastname = member.lastName;
            _this3.email = member.emailAddress;

            _this3.nextForm();
          });
        }
      }, 1000);

      return false;
    }
  }, {
    key: 'submitGoogle',
    value: function submitGoogle(googleUser) {
      var basicProfile = googleUser.getBasicProfile();

      this.firstname = basicProfile.getGivenName();
      this.lastname = basicProfile.getFamilyName();
      this.email = basicProfile.getEmail();

      this.nextForm();
    }
  }, {
    key: 'submitForm1',
    value: function submitForm1(e) {
      e.preventDefault();
      var $form = $(e.target);
      var formData = this.getFormData($form);

      this.firstname = formData.firstname;
      this.lastname = formData.lastname;
      this.email = formData.email;

      this.nextForm();
    }
  }, {
    key: 'nextForm',
    value: function nextForm() {
      $('.shipNowMulti__formstep--step1', this.sel.component).hide();
      $('.shipNowMulti__formstep--step2', this.sel.component).show();
      $(this.sel.component).addClass('active');
    }
  }, {
    key: 'submitForm2',
    value: function submitForm2(e) {
      var _this4 = this;

      e.preventDefault();
      var $form = $(e.target);
      var formData = this.getFormData($form);
      formData.firstname = this.firstname;
      formData.lastname = this.lastname;
      formData.email = this.email;

      $.post($form.attr('action'), formData, function (data) {
        if (data.status === 'OK') {
          _this4.showSuccess();
        } else {
          alert('An error occurred. Please try again later.');
        }
      });
    }
  }, {
    key: 'getFormData',
    value: function getFormData($form) {
      var unindexedArray = $form.serializeArray();
      var indexedArray = {};
      $.map(unindexedArray, function (n) {
        return indexedArray[n.name] = n.value;
      });

      indexedArray.source = $.trim($form.data('source'));

      return indexedArray;
    }
  }, {
    key: 'showSuccess',
    value: function showSuccess() {
      var thanks = $('.shipNowMulti__formstep--step2', this.sel.component).data("thanks");
      if (thanks !== null && thanks.length > 0) {
        window.location = thanks;
      } else {
        $('.shipNowMulti__formstep--step2', this.sel.component).hide();
        $('.shipNowMulti__formstep--thanks', this.sel.component).show();
      }
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      this.validate();
      return true;
    }
  }]);

  return ShipNowTwoStepForm;
}();

exports.default = new ShipNowTwoStepForm();

},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowHide = function () {
  function ShowHide() {
    _classCallCheck(this, ShowHide);

    this.sel = {
      component: '[data-show-hide-id]',
      toggle: '[data-show-hide-target]'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
  }

  _createClass(ShowHide, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      $(document).on('click', this.sel.toggle, function (e) {
        var showHideTarget = $(e.target).attr('data-show-hide-target');
        $('[data-show-hide-id=' + showHideTarget + ']').slideToggle();
      });
    }
  }]);

  return ShowHide;
}();

exports.default = new ShowHide();

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Social = function () {
  function Social() {
    _classCallCheck(this, Social);

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

  _createClass(Social, [{
    key: 'bindEvents',
    value: function bindEvents() {
      window.addEventListener('scroll', this.handleScroll);
    }
  }, {
    key: 'containerTop',
    value: function containerTop() {
      return $(this.sel.component).parent().position().top;
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll() {
      if (window.innerWidth >= 992) {
        var height = $(window).scrollTop();
        var bottom = this.containerTop() + $(this.sel.component).parent().height() - $(this.sel.component).outerHeight() - 60;
        if (height >= this.containerTop() && height < bottom && !$(this.sel.component).hasClass('social--affix')) {
          $(this.sel.component).addClass('social--affix').css({
            'left': this.getLeftOffset($(this.sel.component)),
            'top': ''
          });
        } else if (height < this.containerTop() && $(this.sel.component).hasClass('social--affix')) {
          $(this.sel.component).removeClass('social--affix').css({
            'left': '',
            'top': ''
          });
        } else if (height >= bottom && $(this.sel.component).hasClass('social--affix')) {
          $(this.sel.component).removeClass('social--affix').css({
            'left': '',
            'top': this.getTopOffset()
          });
        }
      }
    }
  }, {
    key: 'getLeftOffset',
    value: function getLeftOffset($elm) {
      var parentOffset = parseInt($elm.parent().offset().left, 10);
      var myOffset = parseInt($elm.offset().left, 10);
      return parentOffset + myOffset;
    }
  }, {
    key: 'getTopOffset',
    value: function getTopOffset() {
      var parentOffset = this.containerTop();
      var scrollPos = $(window).scrollTop();
      var top = scrollPos - parentOffset + 50;
      return top;
    }
  }, {
    key: 'checkSharePos',
    value: function checkSharePos() {
      if ($('.social--vertical.social--affix').length) {
        $('.social--vertical.social--affix').removeAttr('style').removeClass('social--affix');
      }
    }

    // Deboutce function

  }, {
    key: 'debounce',
    value: function debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this;
        var args = arguments;
        var later = function later() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      window.addEventListener('resize', this.debounce(this.checkSharePos, 100));
      return true;
    }
  }]);

  return Social;
}();

exports.default = new Social();

},{}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SubscribePanel = function () {
  function SubscribePanel() {
    _classCallCheck(this, SubscribePanel);

    this.sel = {
      component: '.subscribePanel',
      form: '.subscribePanel__form',
      successOverlay: '.subscribePanel__responseOverlay.success',
      errorOverlay: '.subscribePanel__responseOverlay.error'
    };
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.validate = this.validate.bind(this);
  }

  _createClass(SubscribePanel, [{
    key: 'bindEvents',
    value: function bindEvents() {
      $(document).on('submit', this.sel.form, this.submitForm);
    }
  }, {
    key: 'validate',
    value: function validate() {
      $(this.sel.form).each(function (index, item) {
        $(item).validate({
          errorPlacement: function errorPlacement(error, element) {
            if (element.attr('type') === 'checkbox') {
              error.insertAfter($(element).parent().find('label'));
            } else if (element.is('select')) {
              error.insertAfter(element.parent());
              element.parent().find('.selectboxit-btn').addClass('error');
            } else {
              error.insertAfter(element);
            }
          },
          success: function success(label) {
            var $parent = $(label).parents('.subscribe__formField');
            if ($parent.find('select').length > 0) {
              $parent.find('.selectboxit-btn').removeClass('error');
            }
          }
        });
      });
    }
  }, {
    key: 'submitForm',
    value: function submitForm(e) {
      var _this = this;

      e.preventDefault();
      var $form = $(e.target);
      var formData = this.getFormData($form);
      $.post($form.attr('action'), formData, function (data) {
        if (data.status === 'OK') {
          _this.showSuccess();
        } else {
          _this.showError();
        }
      });
    }
  }, {
    key: 'getFormData',
    value: function getFormData($form) {
      var unindexedArray = $form.serializeArray();
      var indexedArray = {};
      $.map(unindexedArray, function (n) {
        return indexedArray[n.name] = n.value;
      });
      return indexedArray;
    }
  }, {
    key: 'showSuccess',
    value: function showSuccess() {
      $(this.sel.successOverlay).addClass('subscribePanel__responseOverlay--show');
    }
  }, {
    key: 'showError',
    value: function showError() {
      $(this.sel.errorOverlay).addClass('subscribePanel__responseOverlay--show');
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      this.validate();
      return true;
    }
  }]);

  return SubscribePanel;
}();

exports.default = new SubscribePanel();

},{}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Toast = function () {
  function Toast(text, duration) {
    _classCallCheck(this, Toast);

    this.text = text;
    this.duration = duration;
    this.id = '_' + Math.random().toString(36).substr(2, 9);

    this.setText = this.setText.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.show = this.show.bind(this);

    var toast = document.createElement('div');
    toast.setAttribute('id', this.id);
    toast.setAttribute('class', 'toast');
    var inner = document.createElement('div');
    inner.setAttribute('class', 'inner');
    inner.innerText = this.text;
    toast.appendChild(inner);
    document.body.appendChild(toast);
    this.$toast = $('#' + this.id);
  }

  _createClass(Toast, [{
    key: 'setText',
    value: function setText(text) {
      this.text = text;
      this.$toast.find('.inner').text(this.text);
    }
  }, {
    key: 'setDuration',
    value: function setDuration(duration) {
      this.duration = duration;
    }
  }, {
    key: 'show',
    value: function show() {
      var _this = this;

      this.$toast.addClass('show');

      setTimeout(function () {
        _this.$toast.removeClass('show');
      }, this.duration);
    }
  }]);

  return Toast;
}();

exports.default = Toast;

},{}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginForm = function () {
  function LoginForm() {
    _classCallCheck(this, LoginForm);

    this.config = {
      urlToken: '/libs/granite/csrf/token.json',
      urlRefreshCheck: '/bin/dhl/refresh_token/index.json',
      urlGetAllDetails: '/bin/dhl/getdetails/index.json',
      urlUpdateDetails: '/bin/dhl/update_details/index.json'
    };

    this.sel = {
      component: '.standardContent.user-account, .page-body.user-account'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.readCookie = this.readCookie.bind(this);

    this.tryUpdateDetails = this.tryUpdateDetails.bind(this);
    this.completeUpdateDetails = this.completeUpdateDetails.bind(this);

    this.loggedIn = this.loggedIn.bind(this);
    this.notLoggedIn = this.notLoggedIn.bind(this);
  }

  _createClass(LoginForm, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      $(window).on('userloggedin.DHL', function (evt, tokenData) {
        _this.loggedIn(tokenData);
      });
      $(window).on('usernotloggedin.DHL', function () {
        _this.notLoggedIn();
      });

      var form = $(this.sel.component).find('form');
      if (form.length > 0) {
        jQuery.validator.addMethod('myAccountCurrentPassword', function (value, element) {
          var $parent = $(element).parents('form');
          var $currentPasswordContainer = $parent.find('.useraccount-currentpassword');
          var $newPassword = $parent.find('input[name="myAccount__newPassword"]');
          var $confirmPassword = $parent.find('input[name="myAccount__confirmPassword"]');

          return $newPassword.val() === '' && $confirmPassword.val() === '' || $currentPasswordContainer.is(':visible') && $(element).val() !== '';
        }, 'You must enter your current password');

        jQuery.validator.addMethod('myAccountPassword', function (value, element) {
          if ($(element).val() === '') return true;
          return new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\W])[A-Za-z\d_\W]{8,}$/).test(value);
        }, 'Password format is not valid');

        jQuery.validator.addMethod('myAccountEqualTo', function (value, element) {
          return $('#' + $(element).attr('data-equalTo')).val() === $(element).val();
        }, 'Passwords do not match');

        form.validate({
          rules: {
            myAccount__currentPassword: 'myAccountCurrentPassword',
            myAccount__newPassword: 'myAccountPassword',
            myAccount__confirmPassword: 'myAccountEqualTo'
          },
          errorPlacement: function errorPlacement(error, element) {
            if (element.attr('type') === 'checkbox') {
              error.insertAfter($(element).parent().find('label'));
            } else if (element.attr('type') === 'password') {
              $(element).append(error);
              error.insertAfter($(element).parent());
            } else if (element.attr('type') === 'search') {
              error.insertAfter($(element).parent());
            } else {
              error.insertAfter(element);
            }
          },
          submitHandler: function submitHandler(formElement) {
            _this.tryUpdateDetails(formElement);
            return false;
          }
        });
      }
    }
  }, {
    key: 'readCookie',
    value: function readCookie(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length);
        }if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }

      return null;
    }
  }, {
    key: 'tryUpdateDetails',
    value: function tryUpdateDetails(form) {
      var _this2 = this;

      var frm = $(form);
      frm.find('input.forms__cta--red').val('please wait...');
      frm.find("button[type='submit']").text('please wait...');

      var cookie = this.readCookie('DHL.AuthToken');
      if (cookie !== null) {
        var split = cookie.split('|');
        if (split.length >= 2) {
          $.get(this.config.urlToken, function (tokenresponse) {
            var csrftoken = tokenresponse.token;
            $.ajax({
              url: _this2.config.urlGetAllDetails,
              data: { username: split[0], token: split[1] },
              type: 'post',
              headers: { 'CSRF-Token': csrftoken },
              dataType: 'json',
              success: function success(allDetailsResponse) {
                if (allDetailsResponse) {
                  if (allDetailsResponse.status === 'ok') {
                    $(window).trigger('checkauthtokens.DHL', [allDetailsResponse, true]);
                    _this2.completeUpdateDetails(form, allDetailsResponse);
                  } else {
                    alert('An unknown error occurred while attempting to update your details (1). Please try again later');
                  }
                } else {
                  alert('An unknown error occurred while attempting to update your details (2). Please try again later');
                }
              }
            });
          });
        } else {
          alert('An unknown error occurred while attempting to update your details (3). Please try again later');
        }
      } else {
        var refreshCookie = this.readCookie('DHL.RefreshToken');
        if (refreshCookie !== null) {
          var refreshSplit = refreshCookie.split('|');
          if (refreshSplit.length >= 2) {
            $.get(this.config.urlToken, function (tokenresponse) {
              var csrftoken = tokenresponse.token;
              $.ajax({
                url: _this2.config.urlRefreshCheck,
                data: { username: refreshSplit[0], refresh_token: refreshSplit[1] },
                type: 'post',
                headers: { 'CSRF-Token': csrftoken },
                dataType: 'json',
                success: function success(refreshResponse) {
                  if (refreshResponse) {
                    if (refreshResponse.status === 'ok') {
                      $(window).trigger('checkauthtokens.DHL', [refreshResponse, true]);
                      _this2.tryUpdateDetails(form);
                    } else {
                      alert('An unknown error occurred while attempting to update your details (4). Please try again later');
                    }
                  } else {
                    alert('An unknown error occurred while attempting to update your details (5). Please try again later');
                  }
                }
              });
            });
          } else {
            alert('An unknown error occurred while attempting to update your details (6). Please try again later');
          }
        } else {
          alert('An unknown error occurred while attempting to enter the competition. Please try again later');
        }
      }
    }
  }, {
    key: 'completeUpdateDetails',
    value: function completeUpdateDetails(form, details) {
      var _this3 = this;

      var frm = $(form);

      var newemail = frm.find('input#myAccount__email').val();
      if (newemail.trim() === details.registration_email) {
        newemail = '';
      }

      var categories = '';
      frm.find('#glb-youraccount-categories input:checked').each(function (index, item) {
        if (categories.length > 0) {
          categories += ',';
        }
        categories += $(item).val();
      });

      var data = {
        token: details.token,

        firstname: frm.find('input#myAccount__firstName').val(),
        lastname: frm.find('input#myAccount__lastName').val(),
        username: details.registration_email,
        newusername: newemail,

        password: frm.find('input#myAccount__currentPassword').val(),
        newpassword: frm.find('input#myAccount__newPassword').val(),

        position: frm.find('input#myAccount__position').val(),
        contact: frm.find('input#myAccount__phoneNumber').val(),
        size: frm.find('select#myAccount__businessSize').val(),
        sector: frm.find('select#myAccount__businessSector').val(),

        tcagree: frm.find('input#checkboxIdTCMessage').is(':checked'),

        cats: categories
      };

      if ($.trim(data.firstname).length === 0 || $.trim(data.lastname).length === 0 || $.trim(data.username).length === 0) {
        alert('Please enter your name, email address and personal details.');
      } else {
        frm.find("button[type='submit'].update-btn").text('please wait...');
        frm.find('input.forms__cta--red').val('please wait...');

        $.get(this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;
          $.ajax({
            url: _this3.config.urlUpdateDetails,
            data: data,
            type: 'post',
            headers: { 'CSRF-Token': csrftoken },
            dataType: 'json',
            success: function success(updateDetailsResponse) {
              if (updateDetailsResponse) {
                $(window).trigger('checkauthtokens.DHL', [updateDetailsResponse, true]);

                if (updateDetailsResponse.status === 'ok') {
                  frm.find('.myAccount__message').show();

                  if (data.newpassword.length > 0) {
                    frm.find('input#myAccount__email').removeAttr('readonly');
                    frm.find('.useraccount-currentpassword').show();
                  }
                  frm.find('input#myAccount__currentPassword').val('');
                  frm.find('input#myAccount__newPassword').val('');
                  frm.find('input#myAccount__confirmPassword').val('');

                  $('header .header__auth--loggedin .user-firstname').text(data.firstname);
                  $('.competitionDataCapture.logged-in .loggedin-name').text(data.firstname);
                  $(window).scrollTop(0);
                } else {
                  alert('An error occurred while attempting to update your details.\n' + updateDetailsResponse.error);
                }
              } else {
                alert('An unknown error occurred while attempting to update your details. Please try again later');
              }
              frm.find("button[type='submit'].update-btn").text('Update');
              frm.find('input.forms__cta--red').val('Update');
            }
          });
        });
      }

      frm.find("button[type='submit'].update-btn").text('Update');
      frm.find('input.forms__cta--red').val('Update');
    }
  }, {
    key: 'loggedIn',
    value: function loggedIn(tokenData) {
      var _this4 = this;

      if (tokenData && tokenData.status && tokenData.status === 'ok') {
        $.get(this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;

          $.ajax({
            url: _this4.config.urlGetAllDetails,
            data: { username: tokenData.username, token: tokenData.token },
            type: 'post',
            headers: { 'CSRF-Token': csrftoken },
            dataType: 'json',
            success: function success(allDetailsResponse) {
              if (allDetailsResponse) {
                if (allDetailsResponse.status === 'ok') {
                  var componentForm = $(_this4.sel.component);
                  $(window).trigger('checkauthtokens.DHL', [allDetailsResponse, true]);

                  componentForm.find('.loggedin-username').text(allDetailsResponse.registration_firstname);

                  componentForm.find('input#myAccount__firstName').val(allDetailsResponse.registration_firstname);
                  componentForm.find('input#myAccount__lastName').val(allDetailsResponse.registration_lastname);
                  componentForm.find('input#myAccount__email').val(allDetailsResponse.registration_email);

                  componentForm.find('input#myAccount__position').val(allDetailsResponse.registration_position);
                  componentForm.find('input#myAccount__phoneNumber').val(allDetailsResponse.registration_contact);

                  componentForm.find('select#myAccount__businessSize').val(allDetailsResponse.registration_size);
                  componentForm.find('select#myAccount__businessSector').val(allDetailsResponse.registration_sector);

                  if (allDetailsResponse.registration_tcagree === 'true') {
                    componentForm.find('input#checkboxIdTCMessage').prop('checked', true);
                  } else {
                    componentForm.find('input#checkboxIdTCMessage').prop('checked', false);
                  }

                  componentForm.find('#glb-youraccount-categories input[type="checkbox"]').prop('checked', false);
                  var categories = allDetailsResponse.registration_cats.split(',');
                  for (var i = 0; i < categories.length; i++) {
                    componentForm.find('#glb-youraccount-categories input[type="checkbox"][value="' + categories[i] + '"]').prop('checked', true);
                  }

                  if (allDetailsResponse.registration_islinkedin === 'false') {
                    if (allDetailsResponse.full !== false) {
                      componentForm.find('.useraccount-currentpassword').show();
                    }
                  } else {
                    componentForm.find('input#myAccount__email').attr('readonly', 'readonly');
                  }

                  componentForm.closest('.page-body-wrapper').removeClass('awaiting');
                  componentForm.show();
                } else {
                  alert('An unknown error occurred while attempting to display your details. Please try again later');
                }
              } else {
                alert('An unknown error occurred while attempting to display your details. Please try again later');
              }
            }
          });
        });
      }
    }
  }, {
    key: 'notLoggedIn',
    value: function notLoggedIn() {
      if ($(this.sel.component).hasClass('no-redirect')) {
        $(this.sel.component).show();
      } else {
        window.location = '/content/dhl.html';
      }
    }
  }]);

  return LoginForm;
}();

exports.default = new LoginForm();

},{}],32:[function(require,module,exports){
'use strict';

var _Header = require('./Components/Header');

var _Header2 = _interopRequireDefault(_Header);

var _BootstrapCarousel = require('./Components/BootstrapCarousel');

var _BootstrapCarousel2 = _interopRequireDefault(_BootstrapCarousel);

var _ArticleGrid = require('./Components/ArticleGrid');

var _ArticleGrid2 = _interopRequireDefault(_ArticleGrid);

var _SubscribePanel = require('./Components/SubscribePanel');

var _SubscribePanel2 = _interopRequireDefault(_SubscribePanel);

var _Password = require('./Components/Password');

var _Password2 = _interopRequireDefault(_Password);

var _PasswordValidity = require('./Components/PasswordValidity');

var _PasswordValidity2 = _interopRequireDefault(_PasswordValidity);

var _FormValidation = require('./Components/FormValidation');

var _FormValidation2 = _interopRequireDefault(_FormValidation);

var _ShowHide = require('./Components/ShowHide');

var _ShowHide2 = _interopRequireDefault(_ShowHide);

var _CookieBanner = require('./Components/CookieBanner');

var _CookieBanner2 = _interopRequireDefault(_CookieBanner);

var _SearchForm = require('./Components/SearchForm');

var _SearchForm2 = _interopRequireDefault(_SearchForm);

var _EcomForms = require('./Components/EcomForms');

var _EcomForms2 = _interopRequireDefault(_EcomForms);

var _ShipForm = require('./Components/ShipForm');

var _ShipForm2 = _interopRequireDefault(_ShipForm);

var _IEDetector = require('./Components/IEDetector');

var _IEDetector2 = _interopRequireDefault(_IEDetector);

var _Social = require('./Components/Social');

var _Social2 = _interopRequireDefault(_Social);

var _Hero = require('./Components/Hero');

var _Hero2 = _interopRequireDefault(_Hero);

var _AuthenticationEvents = require('./Components/AuthenticationEvents');

var _AuthenticationEvents2 = _interopRequireDefault(_AuthenticationEvents);

var _DeleteAccountForm = require('./Components/DeleteAccountForm');

var _DeleteAccountForm2 = _interopRequireDefault(_DeleteAccountForm);

var _LoginForm = require('./Components/LoginForm');

var _LoginForm2 = _interopRequireDefault(_LoginForm);

var _PasswordReminderForm = require('./Components/PasswordReminderForm');

var _PasswordReminderForm2 = _interopRequireDefault(_PasswordReminderForm);

var _RegisterForm = require('./Components/RegisterForm');

var _RegisterForm2 = _interopRequireDefault(_RegisterForm);

var _YourAccountForm = require('./Components/YourAccountForm');

var _YourAccountForm2 = _interopRequireDefault(_YourAccountForm);

var _ShipNowForm = require('./Components/ShipNowForm');

var _ShipNowForm2 = _interopRequireDefault(_ShipNowForm);

var _ShipNowTwoStepForm = require('./Components/ShipNowTwoStepForm');

var _ShipNowTwoStepForm2 = _interopRequireDefault(_ShipNowTwoStepForm);

var _CompetitionForm = require('./Components/CompetitionForm');

var _CompetitionForm2 = _interopRequireDefault(_CompetitionForm);

var _ServiceWorker = require('./Components/ServiceWorker');

var _ServiceWorker2 = _interopRequireDefault(_ServiceWorker);

var _Offline = require('./Components/Offline');

var _Offline2 = _interopRequireDefault(_Offline);

var _LandingPoints = require('./Components/LandingPoints');

var _LandingPoints2 = _interopRequireDefault(_LandingPoints);

var _BackButton = require('./Components/BackButton');

var _BackButton2 = _interopRequireDefault(_BackButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Import components
$(document).ready(function () {
  try {
    document.createEvent('TouchEvent');
    $('body').addClass('touch');
  } catch (e) {}
  // nothing

  // Initiate components
  _IEDetector2.default.init();
  _Header2.default.init();
  _BootstrapCarousel2.default.init();
  _ArticleGrid2.default.init();
  _SubscribePanel2.default.init();
  _Password2.default.init();
  _PasswordValidity2.default.init();
  // FormValidation.init();
  _ShowHide2.default.init();
  _CookieBanner2.default.init();
  _SearchForm2.default.init();
  _EcomForms2.default.init();
  _ShipForm2.default.init();
  _Social2.default.init();
  _Hero2.default.init();
  _CompetitionForm2.default.init();
  _ShipNowForm2.default.init();
  _ShipNowTwoStepForm2.default.init();
  _YourAccountForm2.default.init();
  _RegisterForm2.default.init();
  _PasswordReminderForm2.default.init();
  _LoginForm2.default.init();
  _DeleteAccountForm2.default.init();
  _AuthenticationEvents2.default.init();
  _ServiceWorker2.default.init();
  _Offline2.default.init();
  _LandingPoints2.default.init();
  _BackButton2.default.init();
});

},{"./Components/ArticleGrid":1,"./Components/AuthenticationEvents":2,"./Components/BackButton":3,"./Components/BootstrapCarousel":4,"./Components/CompetitionForm":5,"./Components/CookieBanner":7,"./Components/DeleteAccountForm":9,"./Components/EcomForms":10,"./Components/FormValidation":11,"./Components/Header":12,"./Components/Hero":13,"./Components/IEDetector":14,"./Components/LandingPoints":15,"./Components/LoginForm":16,"./Components/Offline":17,"./Components/Password":18,"./Components/PasswordReminderForm":19,"./Components/PasswordValidity":20,"./Components/RegisterForm":21,"./Components/SearchForm":22,"./Components/ServiceWorker":23,"./Components/ShipForm":24,"./Components/ShipNowForm":25,"./Components/ShipNowTwoStepForm":26,"./Components/ShowHide":27,"./Components/Social":28,"./Components/SubscribePanel":29,"./Components/YourAccountForm":31}]},{},[32])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BcnRpY2xlR3JpZC5qcyIsImpzL2Rldi9Db21wb25lbnRzL0F1dGhlbnRpY2F0aW9uRXZlbnRzLmpzIiwianMvZGV2L0NvbXBvbmVudHMvQmFja0J1dHRvbi5qcyIsImpzL2Rldi9Db21wb25lbnRzL0Jvb3RzdHJhcENhcm91c2VsLmpzIiwianMvZGV2L0NvbXBvbmVudHMvQ29tcGV0aXRpb25Gb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvQ29uc3RhbnRzLmpzIiwianMvZGV2L0NvbXBvbmVudHMvQ29va2llQmFubmVyLmpzIiwianMvZGV2L0NvbXBvbmVudHMvRGF0YWJhc2UuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9EZWxldGVBY2NvdW50Rm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL0Vjb21Gb3Jtcy5qcyIsImpzL2Rldi9Db21wb25lbnRzL0Zvcm1WYWxpZGF0aW9uLmpzIiwianMvZGV2L0NvbXBvbmVudHMvSGVhZGVyLmpzIiwianMvZGV2L0NvbXBvbmVudHMvSGVyby5qcyIsImpzL2Rldi9Db21wb25lbnRzL0lFRGV0ZWN0b3IuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9MYW5kaW5nUG9pbnRzLmpzIiwianMvZGV2L0NvbXBvbmVudHMvTG9naW5Gb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvT2ZmbGluZS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1Bhc3N3b3JkLmpzIiwianMvZGV2L0NvbXBvbmVudHMvUGFzc3dvcmRSZW1pbmRlckZvcm0uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9QYXNzd29yZFZhbGlkaXR5LmpzIiwianMvZGV2L0NvbXBvbmVudHMvUmVnaXN0ZXJGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2VhcmNoRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1NlcnZpY2VXb3JrZXIuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9TaGlwRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1NoaXBOb3dGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2hpcE5vd1R3b1N0ZXBGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2hvd0hpZGUuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Tb2NpYWwuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9TdWJzY3JpYmVQYW5lbC5qcyIsImpzL2Rldi9Db21wb25lbnRzL1RvYXN0LmpzIiwianMvZGV2L0NvbXBvbmVudHMvWW91ckFjY291bnRGb3JtLmpzIiwianMvZGV2L21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sYztBQUNKLDBCQUFZLFFBQVosRUFBb0M7QUFBQSxRQUFkLFFBQWMsdUVBQUgsQ0FBRzs7QUFBQTs7QUFDbEMsU0FBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsU0FBSyxJQUFMLEdBQVksQ0FBWjs7QUFFQSxTQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixJQUFwQixDQUFqQjtBQUNBLFNBQUssTUFBTCxHQUFjLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsSUFBakIsQ0FBZDtBQUNBLFNBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQWhCO0FBQ0Q7Ozs7OEJBRVMsUSxFQUEwQjtBQUFBOztBQUFBLFVBQWhCLE9BQWdCLHVFQUFOLElBQU07O0FBQ2xDLFFBQUUsR0FBRixDQUFNLEtBQUssUUFBWCxFQUFxQjtBQUNuQixjQUFNLEtBQUssSUFEUTtBQUVuQixrQkFBVSxLQUFLLFFBRkk7QUFHbkIsaUJBQVM7QUFIVSxPQUFyQixFQUlHLFVBQUMsSUFBRCxFQUFVO0FBQ1gsY0FBSyxJQUFMLElBQWEsS0FBSyxLQUFMLENBQVcsTUFBeEI7QUFDQSxpQkFBUyxJQUFUO0FBQ0QsT0FQRDtBQVFEOzs7MkJBRU0sUSxF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bkI7QUFDQSw0QkFBZ0IsSUFBaEI7QUFDQSx5QkFBYSxJQUFiO0FBQ0EsaUNBQXFCLElBQXJCO0FBQ0Esc0JBQVUsSUFBVjtBQUNBLDhCQUFrQixJQUFsQjtBQUNBLGlDQUFxQixJQUFyQjtBQUNBLDBCQUFjLElBQWQ7QUFDQSxvQkFBUSxJQUFSO0FBQ0EsMEJBQWMsSUFBZDtBQUNBLHVCQUFXLElBQVg7QUFDRCxDQXBDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNsYXNzIEFydGljbGVHcmlkQXBpIHtcclxuICBjb25zdHJ1Y3RvcihlbmRwb2ludCwgcGFnZVNpemUgPSA2KSB7XHJcbiAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQ7XHJcbiAgICB0aGlzLnBhZ2VTaXplID0gcGFnZVNpemU7XHJcbiAgICB0aGlzLnNraXAgPSAwO1xyXG5cclxuICAgIHRoaXMuZG9SZXF1ZXN0ID0gdGhpcy5kb1JlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2VhcmNoID0gdGhpcy5zZWFyY2guYmluZCh0aGlzKTtcclxuICAgIHRoaXMubG9hZE1vcmUgPSB0aGlzLmxvYWRNb3JlLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBkb1JlcXVlc3QoY2FsbGJhY2ssIGtleXdvcmQgPSBudWxsKSB7XHJcbiAgICAkLmdldCh0aGlzLmVuZHBvaW50LCB7XHJcbiAgICAgIHNraXA6IHRoaXMuc2tpcCxcclxuICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXHJcbiAgICAgIGtleXdvcmQ6IGtleXdvcmRcclxuICAgIH0sIChkYXRhKSA9PiB7XHJcbiAgICAgIHRoaXMuc2tpcCArPSBkYXRhLkl0ZW1zLmxlbmd0aDtcclxuICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlYXJjaChjYWxsYmFjaywga2V5d29yZCkge1xyXG4gICAgdGhpcy5za2lwID0gMDtcclxuICAgIHRoaXMuZG9SZXF1ZXN0KGNhbGxiYWNrLCBrZXl3b3JkKTtcclxuICB9XHJcblxyXG4gIGxvYWRNb3JlKGNhbGxiYWNrKSB7XHJcbiAgICB0aGlzLmRvUmVxdWVzdChjYWxsYmFjayk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBBcnRpY2xlR3JpZCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuaGFzbW9yZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5hcnRpY2xlR3JpZCcsXHJcbiAgICAgIGdyaWQ6ICcuYXJ0aWNsZUdyaWRfX2dyaWQnLFxyXG4gICAgICBsb2FkTW9yZTogJy5hcnRpY2xlR3JpZF9fbG9hZE1vcmUnLFxyXG4gICAgICB0ZW1wbGF0ZTogJyNhcnRpY2xlR3JpZF9fcGFuZWxUZW1wbGF0ZScsXHJcbiAgICAgIG5hdjogJy5hcnRpY2xlR3JpZF9fbmF2J1xyXG4gICAgfTtcclxuICAgIHRoaXMudGVtcGxhdGUgPSAkKCQodGhpcy5zZWwudGVtcGxhdGUpLmh0bWwoKSk7XHJcblxyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxvYWRNb3JlID0gdGhpcy5sb2FkTW9yZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5wb3B1bGF0ZVRlbXBsYXRlcyA9IHRoaXMucG9wdWxhdGVUZW1wbGF0ZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zaG93U3Bpbm5lciA9IHRoaXMuc2hvd1NwaW5uZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaGlkZVNwaW5uZXIgPSB0aGlzLmhpZGVTcGlubmVyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNjcm9sbG5hdiA9IHRoaXMuc2Nyb2xsbmF2LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNjcm9sbGxlZnQgPSB0aGlzLnNjcm9sbGxlZnQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2Nyb2xscmlnaHQgPSB0aGlzLnNjcm9sbHJpZ2h0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoZWNrU2Nyb2xsID0gdGhpcy5jaGVja1Njcm9sbC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5wYWdlU2Nyb2xsID0gdGhpcy5wYWdlU2Nyb2xsLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCB0aGlzLnBhZ2VTY3JvbGwpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwubG9hZE1vcmUsIHRoaXMubG9hZE1vcmUpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5zY3JvbGxsZWZ0JywgdGhpcy5zY3JvbGxsZWZ0KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc2Nyb2xscmlnaHQnLCB0aGlzLnNjcm9sbHJpZ2h0KTtcclxuXHJcbiAgICB0aGlzLnBhZ2VTY3JvbGwoKTtcclxuICB9XHJcblxyXG4gIHBhZ2VTY3JvbGwoKSB7XHJcbiAgICBpZiAodGhpcy5oYXNtb3JlICYmICghdGhpcy5sb2FkaW5nKSkge1xyXG4gICAgICB2YXIgd25kID0gJCh3aW5kb3cpO1xyXG4gICAgICB2YXIgZWxtID0gJCh0aGlzLnNlbC5sb2FkTW9yZSk7XHJcblxyXG4gICAgICBpZiAoZWxtICYmICgkKGVsbSkubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICB2YXIgd3N0ID0gd25kLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgIHZhciB3aCA9IHduZC5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgb3QgPSBlbG0ub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgIHZhciBvaCA9IGVsbS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICBpZiAoKHdzdCArIHdoKSA+IChvdCArIG9oKSkge1xyXG4gICAgICAgICAgdGhpcy5sb2FkTW9yZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZE1vcmUoZSkge1xyXG4gICAgaWYgKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XHJcbiAgICAvLyBTaG93IHRoZSBsb2FkaW5nIHNwaW5uZXJcclxuICAgIHRoaXMuc2hvd1NwaW5uZXIoKTtcclxuXHJcbiAgICB2YXIgdCA9IDA7XHJcbiAgICAkKFwiLmFydGljbGVHcmlkX19pdGVtXCIsIHRoaXMuc2VsLmNvbXBvbmVudCkuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgaWYgKHQgPCA2ICYmICghJChpdGVtKS5pcyhcIjp2aXNpYmxlXCIpKSkge1xyXG4gICAgICAgICQoaXRlbSkuc2hvdygpO1xyXG4gICAgICAgIHQrKztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCQoXCIuYXJ0aWNsZUdyaWRfX2l0ZW1cIix0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA9PT0gJChcIi5hcnRpY2xlR3JpZF9faXRlbTp2aXNpYmxlXCIsdGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGgpIHtcclxuICAgICAgJCh0aGlzLnNlbC5sb2FkTW9yZSkucGFyZW50cyhcIi5yb3dcIikuZmlyc3QoKS5yZW1vdmUoKTtcclxuICAgICAgdGhpcy5oYXNtb3JlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGlkZSB0aGUgbG9hZGluZyBzcGlubmVyXHJcbiAgICB0aGlzLmhpZGVTcGlubmVyKCk7XHJcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHNob3dTcGlubmVyKCkge1xyXG4gICAgJCh0aGlzLnNlbC5sb2FkTW9yZSkuYWRkQ2xhc3MoJ2FydGljbGVHcmlkX19sb2FkTW9yZS0tbG9hZGluZycpO1xyXG4gIH1cclxuXHJcbiAgaGlkZVNwaW5uZXIoKSB7XHJcbiAgICAkKHRoaXMuc2VsLmxvYWRNb3JlKS5yZW1vdmVDbGFzcygnYXJ0aWNsZUdyaWRfX2xvYWRNb3JlLS1sb2FkaW5nJyk7XHJcbiAgfVxyXG5cclxuICBzY3JvbGxuYXYoKSB7XHJcbiAgICBsZXQgJHNjcm9sbG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWwubmF2KTtcclxuICAgIGlmICgkc2Nyb2xsbmF2ID09PSBudWxsKSByZXR1cm47XHJcbiAgICBsZXQgc2Nyb2xsV2lkdGggPSAkc2Nyb2xsbmF2LnNjcm9sbFdpZHRoO1xyXG4gICAgbGV0IGNsaWVudFdpZHRoID0gJHNjcm9sbG5hdi5jbGllbnRXaWR0aDtcclxuICAgIGlmIChzY3JvbGxXaWR0aCA+IGNsaWVudFdpZHRoKSB7XHJcbiAgICAgICQodGhpcy5zZWwubmF2KS5hZnRlcignPGkgY2xhc3M9XCJzY3JvbGxyaWdodFwiPj48L2k+Jyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHNjcm9sbHJpZ2h0KCkge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzLnNlbC5uYXY7XHJcbiAgICBsZXQgc2Nyb2xsV2lkdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGYpLnNjcm9sbFdpZHRoO1xyXG4gICAgJChzZWxmKS5hbmltYXRlKHtcclxuICAgICAgc2Nyb2xsTGVmdDogc2Nyb2xsV2lkdGggKyAncHgnXHJcbiAgICB9LCA1MDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLnNjcm9sbHJpZ2h0JykucmVtb3ZlKCk7XHJcbiAgICAgICQoc2VsZikuYmVmb3JlKCc8aSBjbGFzcz1cInNjcm9sbGxlZnRcIj48PC9pPicpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzY3JvbGxsZWZ0KCkge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzLnNlbC5uYXY7XHJcbiAgICAkKHNlbGYpLmFuaW1hdGUoe1xyXG4gICAgICBzY3JvbGxMZWZ0OiAwXHJcbiAgICB9LCA1MDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLnNjcm9sbGxlZnQnKS5yZW1vdmUoKTtcclxuICAgICAgJChzZWxmKS5hZnRlcignPGkgY2xhc3M9XCJzY3JvbGxyaWdodFwiPj48L2k+Jyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoZWNrU2Nyb2xsKCkge1xyXG4gICAgbGV0ICRzY3JvbGxuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsLm5hdik7XHJcbiAgICBpZiAoJHNjcm9sbG5hdiA9PT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgbGV0IHNjcm9sbFdpZHRoID0gJHNjcm9sbG5hdi5zY3JvbGxXaWR0aDtcclxuICAgIGxldCBjbGllbnRXaWR0aCA9ICRzY3JvbGxuYXYuY2xpZW50V2lkdGg7XHJcbiAgICBsZXQgc2Nyb2xsR2FwID0gc2Nyb2xsV2lkdGggLSBjbGllbnRXaWR0aDtcclxuICAgICQoc2VsZikuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHRoaXMuc2Nyb2xsTGVmdCA9PT0gMCkge1xyXG4gICAgICAgICQoJy5zY3JvbGxsZWZ0JykucmVtb3ZlKCk7XHJcbiAgICAgICAgJChzZWxmKS5hZnRlcignPGkgY2xhc3M9XCJzY3JvbGxyaWdodFwiPj48L2k+Jyk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuc2Nyb2xsTGVmdCA+PSBzY3JvbGxHYXApIHtcclxuICAgICAgICAkKCcuc2Nyb2xscmlnaHQnKS5yZW1vdmUoKTtcclxuICAgICAgICAkKHNlbGYpLmJlZm9yZSgnPGkgY2xhc3M9XCJzY3JvbGxsZWZ0XCI+PDwvaT4nKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwb3B1bGF0ZVRlbXBsYXRlcyhpdGVtcykge1xyXG4gICAgbGV0IG91dHB1dCA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAvLyBDbG9uZSB0ZW1wbGF0ZVxyXG4gICAgICBsZXQgJHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZS5jbG9uZSgpO1xyXG4gICAgICAvLyBHZXQgdGhlIGl0ZW1cclxuICAgICAgbGV0IGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgLy8gU2V0IGltYWdlIGJyZWFrcG9pbnRcclxuICAgICAgbGV0IGRlc2t0b3BCcmVha3BvaW50ID0gOTkyO1xyXG4gICAgICAvLyBHZW5lcmF0ZSBJRFxyXG4gICAgICBsZXQgcGFuZWxJZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCA5KTtcclxuICAgICAgLy8gUG9wdWxhdGUgSURcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5hdHRyKCdpZCcsIHBhbmVsSWQpO1xyXG4gICAgICAvLyBJZiBsYXJnZSBwYW5lbFxyXG4gICAgICBpZiAoaXRlbS5Jc0xhcmdlKSB7XHJcbiAgICAgICAgLy8gVXBkYXRlIGltYWdlIGJyZWFrcG9pbnRcclxuICAgICAgICBkZXNrdG9wQnJlYWtwb2ludCA9IDc2ODtcclxuICAgICAgICAvLyBBZGQgY2xhc3NcclxuICAgICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbCcpLmFkZENsYXNzKCdhcnRpY2xlUGFuZWwtLWxhcmdlJyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gSWYgdmlkZW9cclxuICAgICAgaWYgKGl0ZW0uSXNWaWRlbykge1xyXG4gICAgICAgIC8vIEFkZCBjbGFzc1xyXG4gICAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsJykuYWRkQ2xhc3MoJ2FydGljbGVQYW5lbC0tdmlkZW8nKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBQb3B1bGF0ZSBpbWFnZXNcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2ltYWdlJykuYXR0cih7XHJcbiAgICAgICAgaHJlZjogaXRlbS5MaW5rLFxyXG4gICAgICAgIHRpdGxlOiBpdGVtLlRpdGxlXHJcbiAgICAgIH0pLmF0dHIoJ3N0eWxlJywgJ2JhY2tncm91bmQtaW1hZ2U6IHVybCgnICsgaXRlbS5JbWFnZXMuTW9iaWxlICsgJyk7Jyk7XHJcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCdzdHlsZScpWzBdLmlubmVySFRNTCA9ICdAbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAnICsgZGVza3RvcEJyZWFrcG9pbnQgKyAncHgpeyMnICsgcGFuZWxJZCArICcgLmFydGljbGVQYW5lbF9faW1hZ2V7YmFja2dyb3VuZC1pbWFnZTogdXJsKCcgKyBpdGVtLkltYWdlcy5EZXNrdG9wICsgJykgIWltcG9ydGFudDt9fSc7XHJcbiAgICAgIC8vIFBvcHVsYXRlIGxpbmtcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2NvbnRlbnQgPiBhJykuYXR0cih7XHJcbiAgICAgICAgaHJlZjogaXRlbS5MaW5rLFxyXG4gICAgICAgIHRpdGxlOiBpdGVtLlRpdGxlXHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBQb3B1bGF0ZSB0aXRsZVxyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fdGl0bGUnKS50ZXh0KGl0ZW0uVGl0bGUpO1xyXG4gICAgICAvLyBQb3B1bGF0ZSBkZXNjcmlwdGlvblxyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fZGVzY3JpcHRpb24nKS50ZXh0KGl0ZW0uRGVzY3JpcHRpb24pO1xyXG4gICAgICAvLyBQb3B1bGF0ZSBjYXRlZ29yeVxyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fc3ViVGl0bGUgYTpmaXJzdC1jaGlsZCcpLmF0dHIoe1xyXG4gICAgICAgICdocmVmJzogaXRlbS5DYXRlZ29yeS5MaW5rLFxyXG4gICAgICAgICd0aXRsZSc6IGl0ZW0uQ2F0ZWdvcnkuTmFtZVxyXG4gICAgICB9KS50ZXh0KGl0ZW0uQ2F0ZWdvcnkuTmFtZSk7XHJcbiAgICAgIC8vIFBvcHVsYXRlIHRpbWUgdG8gcmVhZFxyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fc3ViVGl0bGUgYTpsYXN0LWNoaWxkJykuYXR0cih7XHJcbiAgICAgICAgJ2hyZWYnOiBpdGVtLkxpbmssXHJcbiAgICAgICAgJ3RpdGxlJzogaXRlbS5UaXRsZVxyXG4gICAgICB9KS50ZXh0KGl0ZW0uVGltZVRvUmVhZCk7XHJcbiAgICAgIC8vIFB1c2ggaXRlbSB0byBvdXRwdXRcclxuICAgICAgb3V0cHV0LnB1c2goJHRlbXBsYXRlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgbGV0IGVuZHBvaW50ID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmF0dHIoJ2RhdGEtZW5kcG9pbnQnKTtcclxuICAgIHRoaXMuQVBJID0gbmV3IEFydGljbGVHcmlkQXBpKGVuZHBvaW50KTtcclxuICAgIHRoaXMuc2Nyb2xsbmF2KCk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHRoaXMuY2hlY2tTY3JvbGwoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEFydGljbGVHcmlkKCk7XHJcbiIsImNsYXNzIEF1dGhlbnRpY2F0aW9uRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuY29uZmlnID0ge1xyXG4gICAgICB1cmxUb2tlbjogJy9saWJzL2dyYW5pdGUvY3NyZi90b2tlbi5qc29uJyxcclxuICAgICAgdXJsQ2hlY2s6ICcvYmluL2RobC9jaGVjay9pbmRleC5qc29uJyxcclxuICAgICAgdXJsUmVmcmVzaENoZWNrOiAnL2Jpbi9kaGwvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcclxuICAgICAgdXJsRG93bmxvYWRBc3NldDogJy9iaW4vZGhsL2Rvd25sb2FkX2Fzc2V0L2luZGV4Lmpzb24nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMucmVhZENvb2tpZSA9IHRoaXMucmVhZENvb2tpZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jbGVhckNvb2tpZSA9IHRoaXMuY2xlYXJDb29raWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY3JlYXRlQ29va2llID0gdGhpcy5jcmVhdGVDb29raWUuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmNoZWNrTG9naW5TdGF0dXMgPSB0aGlzLmNoZWNrTG9naW5TdGF0dXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hlY2tBdXRoVG9rZW5zID0gdGhpcy5jaGVja0F1dGhUb2tlbnMuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnNob3dMb2dnZWRJbkVsZW1lbnRzID0gdGhpcy5zaG93TG9nZ2VkSW5FbGVtZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zaG93Tm90TG9nZ2VkSW5FbGVtZW50cyA9IHRoaXMuc2hvd05vdExvZ2dlZEluRWxlbWVudHMuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICAkKHdpbmRvdykub24oJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCAoZXZ0LCB0b2tlbkRhdGEsIHNraXBFbGVtZW50cykgPT4ge1xyXG4gICAgICB0aGlzLmNoZWNrQXV0aFRva2Vucyh0b2tlbkRhdGEsIHNraXBFbGVtZW50cyk7XHJcbiAgICB9KTtcclxuICAgICQod2luZG93KS5vbigndXNlcmxvZ2dlZGluLkRITCcsIChldnQsIHRva2VuRGF0YSkgPT4ge1xyXG4gICAgICB0aGlzLnNob3dMb2dnZWRJbkVsZW1lbnRzKHRva2VuRGF0YSk7XHJcbiAgICB9KTtcclxuICAgICQod2luZG93KS5vbigndXNlcm5vdGxvZ2dlZGluLkRITCcsICgpID0+IHtcclxuICAgICAgdGhpcy5zaG93Tm90TG9nZ2VkSW5FbGVtZW50cygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gbG9nZ2VkIGluIGhlYWRlciAobG9nb3V0IGxpbmspXHJcbiAgICB2YXIgbG9nZ2VkSW5IZWFkZXIgPSAkKCcuZm9vdGVyIC5mb290ZXJfX2N0YXMtLWxvZ2dlZGluJyk7XHJcbiAgICBpZiAobG9nZ2VkSW5IZWFkZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICBsb2dnZWRJbkhlYWRlci5vbignY2xpY2snLCAnLmxvZ291dC1saW5rJywgKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcclxuICAgICAgICB0aGlzLmNsZWFyQ29va2llKCdESEwuUmVmcmVzaFRva2VuJyk7XHJcbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jaGVja0xvZ2luU3RhdHVzKCk7XHJcbiAgfVxyXG5cclxuICByZWFkQ29va2llKG5hbWUpIHtcclxuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xyXG4gICAgdmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjID0gY2FbaV07XHJcbiAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xyXG4gICAgICBpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBjbGVhckNvb2tpZShuYW1lKSB7XHJcbiAgICB0aGlzLmNyZWF0ZUNvb2tpZShuYW1lLCAnJywgLTEpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlQ29va2llKG5hbWUsIHZhbHVlLCBleHBpcnlTZWNvbmRzKSB7XHJcbiAgICB2YXIgZXhwaXJlcyA9ICcnO1xyXG4gICAgaWYgKGV4cGlyeVNlY29uZHMpIHtcclxuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoZXhwaXJ5U2Vjb25kcyAqIDEwMDApKTtcclxuICAgICAgZXhwaXJlcyA9ICc7IGV4cGlyZXM9JyArIGRhdGUudG9VVENTdHJpbmcoKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyAnPScgKyB2YWx1ZSArIGV4cGlyZXMgKyAnOyBwYXRoPS8nO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tMb2dpblN0YXR1cygpIHtcclxuICAgIHZhciBjb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcclxuICAgIGlmIChjb29raWUgIT09IG51bGwpIHtcclxuICAgICAgdmFyIGF1dGhTcGxpdCA9IGNvb2tpZS5zcGxpdCgnfCcpO1xyXG4gICAgICBpZiAoYXV0aFNwbGl0Lmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgdGhpcy5jYWxsVG9rZW5DaGVjayh0aGlzLmNvbmZpZy51cmxDaGVjaywge1xyXG4gICAgICAgICAgdXNlcm5hbWU6IGF1dGhTcGxpdFswXSxcclxuICAgICAgICAgIHRva2VuOiBhdXRoU3BsaXRbMV1cclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigndXNlcm5vdGxvZ2dlZGluLkRITCcpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgcmVmcmVzaENvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicpO1xyXG4gICAgICBpZiAocmVmcmVzaENvb2tpZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIHZhciByZWZyZXNoQ29va2llU3BsaXQgPSByZWZyZXNoQ29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgaWYgKHJlZnJlc2hDb29raWVTcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgdGhpcy5jYWxsVG9rZW5DaGVjayh0aGlzLmNvbmZpZy51cmxSZWZyZXNoQ2hlY2ssIHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IHJlZnJlc2hDb29raWVTcGxpdFswXSxcclxuICAgICAgICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaENvb2tpZVNwbGl0WzFdXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3VzZXJub3Rsb2dnZWRpbi5ESEwnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3VzZXJub3Rsb2dnZWRpbi5ESEwnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2FsbFRva2VuQ2hlY2sodXJsLCBkYXRhKSB7XHJcbiAgICAkLmdldCh0aGlzLmNvbmZpZy51cmxUb2tlbiwgKGNzcmZyZXNwb25zZSkgPT4ge1xyXG4gICAgICB2YXIgY3NyZnRva2VuID0gY3NyZnJlc3BvbnNlLnRva2VuO1xyXG5cclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIHRoaXMuY2hlY2tBdXRoVG9rZW5zKHJlc3BvbnNlLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tBdXRoVG9rZW5zKHRva2VuRGF0YSwgc2tpcEVsZW1lbnRzKSB7XHJcbiAgICBpZiAodG9rZW5EYXRhICYmIHRva2VuRGF0YS5zdGF0dXMgJiYgdG9rZW5EYXRhLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICB0aGlzLmNyZWF0ZUNvb2tpZSgnREhMLkF1dGhUb2tlbicsIHRva2VuRGF0YS51c2VybmFtZSArICd8JyArIHRva2VuRGF0YS50b2tlbiwgdG9rZW5EYXRhLnR0bCk7XHJcbiAgICAgIHRoaXMuY3JlYXRlQ29va2llKCdESEwuUmVmcmVzaFRva2VuJywgdG9rZW5EYXRhLnVzZXJuYW1lICsgJ3wnICsgdG9rZW5EYXRhLnJlZnJlc2hfdG9rZW4sICgyNCAqIDYwICogNjApKTtcclxuXHJcbiAgICAgIGlmIChza2lwRWxlbWVudHMgIT09IHRydWUpIHtcclxuICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigndXNlcmxvZ2dlZGluLkRITCcsIHRva2VuRGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2tpcEVsZW1lbnRzICE9PSB0cnVlKSB7XHJcbiAgICAgICQod2luZG93KS50cmlnZ2VyKCd1c2Vybm90bG9nZ2VkaW4uREhMJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzaG93TG9nZ2VkSW5FbGVtZW50cyh0b2tlbkRhdGEpIHtcclxuICAgICQoJy5iZWxvdy1yZWdpc3Rlci1mb3JtIC50YWIubW9iaWxlJykuaGlkZSgpO1xyXG5cclxuICAgICQoJy5iZWxvdy1yZWdpc3Rlci1mb3JtICNyZWdpc3Rlci10YWItMScpLmhpZGUoKTtcclxuICAgICQoXCIuYmVsb3ctcmVnaXN0ZXItZm9ybSAudGFiLWNvbnRlbnRzIC50YWItY29udGVudFtkYXRhLXJlbD0nI3JlZ2lzdGVyLXRhYi0xJ11cIikucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICAkKCcuYmVsb3ctcmVnaXN0ZXItZm9ybSAjcmVnaXN0ZXItdGFiLTInKS5hZGRDbGFzcygnYWN0aXZlJykuc2hvdygpO1xyXG4gICAgJChcIi5iZWxvdy1yZWdpc3Rlci1mb3JtIC50YWItY29udGVudHMgLnRhYi1jb250ZW50W2RhdGEtcmVsPScjcmVnaXN0ZXItdGFiLTInXVwiKS5hZGRDbGFzcygnb3BlbicpO1xyXG5cclxuICAgICQoJy5iZWxvdy1yZWdpc3Rlci1mb3JtJykuc2hvdygpO1xyXG5cclxuICAgICQoJ2hlYWRlciAuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0ubG9nZ2VkLWluIC51c2VyLWZpcnN0bmFtZSwgaGVhZGVyIC5oZWFkZXJfX3ByaW1hcnlMaW5rcyAudXNlci1maXJzdG5hbWUnKS50ZXh0KHRva2VuRGF0YS5uYW1lKTtcclxuICAgICQoJ2hlYWRlciAuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0ubG9nZ2VkLWluLCBoZWFkZXIgLmhlYWRlcl9fcHJpbWFyeUxpbmtzLmxvZ2dlZC1pbicpLnNob3coKTtcclxuICAgICQoJy5mb290ZXIgLmxvZ291dC1saW5rcycpLnNob3coKTtcclxuXHJcbiAgICAkKCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZS5sb2dnZWQtaW4nKS5zaG93KCk7XHJcbiAgICAkKCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZS5sb2dnZWQtaW4gLmxvZ2dlZGluLW5hbWUnKS50ZXh0KHRva2VuRGF0YS5uYW1lKTtcclxuICAgICQoJy5jdGEtdGhpcmQtcGFuZWwtbG9nZ2VkaW4nKS5zaG93KCk7XHJcblxyXG4gICAgJCgnLmdhdGVkJykuYWRkQ2xhc3MoJ3VubG9ja2VkJykucmVtb3ZlQ2xhc3MoJ2xvY2tlZCcpLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICQoaXRlbSkuY2xvc2VzdCgnYm9keScpLmZpbmQoJy5oZXJvIC5oZXJvX19jdGEtLWdyZXknKS5zaG93KCk7XHJcbiAgICB9KTtcclxuICAgICQoJy5nYXRlZC1oaWRlJykuYWRkQ2xhc3MoJ3VubG9ja2VkJykucmVtb3ZlQ2xhc3MoJ2xvY2tlZCcpO1xyXG5cclxuICAgICQoJy5hcnRpY2xlR3JpZCAuYXJ0aWNsZS1ncmlkLWl0ZW0tbG9nZ2VkaW4nKS5zaG93KCk7XHJcblxyXG4gICAgaWYgKHRva2VuRGF0YS5mdWxsID09PSBmYWxzZSkge1xyXG4gICAgICAkKCcuY3JlYXRlLXBhc3N3b3JkJykuZmluZCgnLmNyZWF0ZS1wYXNzd29yZC1uYW1lJykudGV4dCh0b2tlbkRhdGEubmFtZSk7XHJcbiAgICAgICQod2luZG93KS50cmlnZ2VyKCdzaG93LkNyZWF0ZVBhc3N3b3JkTW9kYWwuREhMJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCQoJy5yZXNldC1wYXNzd29yZC1jb250YWluZXInKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvY29udGVudC9kaGwuaHRtbCc7XHJcbiAgICB9XHJcbiAgICBpZiAoJCgnLnBhZ2UtYm9keS5yZWdpc3RlcicpLmxlbmd0aCA+IDApIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9jb250ZW50L2RobC95b3VyLWFjY291bnQuaHRtbCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCQoJy5nYXRpbmdBcnRpY2xlX19hY3Rpb25zLmxvZ2dlZC1pbicpLmxlbmd0aCA+IDApIHtcclxuICAgICAgdmFyIGdhdGluZ0FydGljbGVFbG0xID0gJCgnLmdhdGluZ0FydGljbGVfX2FjdGlvbnMubG9nZ2VkLWluJyk7XHJcblxyXG4gICAgICAkLmdldCh0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiB0aGlzLmNvbmZpZy51cmxEb3dubG9hZEFzc2V0LFxyXG4gICAgICAgICAgZGF0YTogeyBhc3NldGluZm86IGdhdGluZ0FydGljbGVFbG0xLmRhdGEoJ2Fzc2V0aW5mbycpIH0sXHJcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICBnYXRpbmdBcnRpY2xlRWxtMS5maW5kKCcuZ2F0aW5nQXJ0aWNsZV9fYnV0dG9uJykuYXR0cignaHJlZicsIHJlc3BvbnNlLmhyZWYpO1xyXG4gICAgICAgICAgICAgIGdhdGluZ0FydGljbGVFbG0xLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJCgnI2Rvd25sb2FkIC5kb3dubG9hZF9fY3Rhcy5sb2dnZWQtaW4nKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHZhciBnYXRpbmdBcnRpY2xlRWxtMiA9ICQoJyNkb3dubG9hZCAuZG93bmxvYWRfX2N0YXMubG9nZ2VkLWluJyk7XHJcblxyXG4gICAgICAkLmdldCh0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiB0aGlzLmNvbmZpZy51cmxEb3dubG9hZEFzc2V0LFxyXG4gICAgICAgICAgZGF0YTogeyBhc3NldGluZm86IGdhdGluZ0FydGljbGVFbG0yLmRhdGEoJ2Fzc2V0aW5mbycpIH0sXHJcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICBnYXRpbmdBcnRpY2xlRWxtMi5maW5kKCcuZG93bmxvYWRfX2N0YS0tcmVkJykuYXR0cignaHJlZicsIHJlc3BvbnNlLmhyZWYpO1xyXG4gICAgICAgICAgICAgIGdhdGluZ0FydGljbGVFbG0yLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNob3dOb3RMb2dnZWRJbkVsZW1lbnRzKCkge1xyXG4gICAgJCgnLmJlbG93LXJlZ2lzdGVyLWZvcm0gLnRhYi1jb250YWluZXIgI3JlZ2lzdGVyLXRhYi0xJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNob3coKTtcclxuICAgICQoXCIuYmVsb3ctcmVnaXN0ZXItZm9ybSAudGFiLWNvbnRlbnRzIC50YWItY29udGVudFtkYXRhLXJlbD0nI3JlZ2lzdGVyLXRhYi0xJ11cIikuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICAkKCcuYmVsb3ctcmVnaXN0ZXItZm9ybSAjcmVnaXN0ZXItdGFiLTInKS5yZW1vdmVDbGFzcygnYWN0aXZlJykuc2hvdygpO1xyXG4gICAgJChcIi5iZWxvdy1yZWdpc3Rlci1mb3JtIC50YWItY29udGVudHMgLnRhYi1jb250ZW50W2RhdGEtcmVsPScjcmVnaXN0ZXItdGFiLTInXVwiKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cclxuICAgICQoJy5iZWxvdy1yZWdpc3Rlci1mb3JtJykuc2hvdygpO1xyXG5cclxuICAgICQoJ2hlYWRlciAuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0ubG9nZ2VkLW91dCwgaGVhZGVyIC5oZWFkZXJfX3ByaW1hcnlMaW5rcy5sb2dnZWQtb3V0Jykuc2hvdygpO1xyXG4gICAgJCgnLmZvb3RlciAubG9naW4tbGlua3MnKS5zaG93KCk7XHJcblxyXG4gICAgJCgnLmdhdGluZ0FydGljbGVfX2FjdGlvbnMubm8tbG9nZ2VkLWluJykuc2hvdygpO1xyXG4gICAgJCgnI2Rvd25sb2FkIC5kb3dubG9hZF9fY3Rhcy5uby1sb2dnZWQtaW4nKS5zaG93KCk7XHJcbiAgICAkKCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZS5ub3QtbG9nZ2VkLWluJykuc2hvdygpO1xyXG4gICAgJCgnLmFydGljbGUtcGFnZS1sb2dpbi1jdGEnKS5zaG93KCk7XHJcblxyXG4gICAgJCgnLmdhdGVkJykuYWRkQ2xhc3MoJ2xvY2tlZCcpLnJlbW92ZUNsYXNzKCd1bmxvY2tlZCcpLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICQoaXRlbSkuY2xvc2VzdCgnYm9keScpLmZpbmQoJy5oZXJvIC5oZXJvX19jdGEtLWdyZXknKS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICAgICQoJy5nYXRlZC1oaWRlJykuYWRkQ2xhc3MoJ2xvY2tlZCcpLnJlbW92ZUNsYXNzKCd1bmxvY2tlZCcpO1xyXG5cclxuICAgIHZhciBuZXdzbGV0dGVyQ29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuTmV3c2xldHRlclN1YnNjcmliZWQnKTtcclxuICAgIGlmIChuZXdzbGV0dGVyQ29va2llICE9PSBudWxsKSB7XHJcbiAgICAgICQoJy5hcnRpY2xlR3JpZCAuYXJ0aWNsZS1ncmlkLWl0ZW0tbG9nZ2VkaW4nKS5zaG93KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcuYXJ0aWNsZUdyaWQgLmFydGljbGUtZ3JpZC1pdGVtLXN1YnNjcmliZScpLnNob3coKTtcclxuICAgICAgJCgnLnN1YnNjcmliZVBhbmVsJykuc2hvdygpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEF1dGhlbnRpY2F0aW9uRXZlbnRzKCk7XHJcbiIsImNsYXNzIEJhY2tCdXR0b24ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5iYWNrQnV0dG9uJyxcclxuICAgICAgYmFja0J1dHRvbjogJy5iYWNrQnV0dG9uX19idXR0b24tLWJhY2snLFxyXG4gICAgICBmb3J3YXJkQnV0dG9uOiAnLmJhY2tCdXR0b25fX2J1dHRvbi0tZm9yd2FyZCdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dCdXR0b24gPSB0aGlzLnNob3dCdXR0b24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nb0JhY2sgPSB0aGlzLmdvQmFjay5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nb0ZvcndhcmQgPSB0aGlzLmdvRm9yd2FyZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0SGVhZHJvb20gPSB0aGlzLmluaXRIZWFkcm9vbS5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc2hvd0J1dHRvbigpIHtcclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnYmFja0J1dHRvbi0tc2hvdycpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmJhY2tCdXR0b24sIHRoaXMuZ29CYWNrKTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmZvcndhcmRCdXR0b24sIHRoaXMuZ29Gb3J3YXJkKTtcclxuICB9XHJcblxyXG4gIGdvQmFjayhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBoaXN0b3J5LmJhY2soLTEpO1xyXG4gIH1cclxuXHJcbiAgZ29Gb3J3YXJkKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGhpc3RvcnkuZm9yd2FyZCgpO1xyXG4gIH1cclxuXHJcbiAgaW5pdEhlYWRyb29tKCkge1xyXG4gICAgbGV0IGNvbXBvbmVudCA9ICQodGhpcy5zZWwuY29tcG9uZW50KVswXTtcclxuICAgIGxldCBoZWFkcm9vbSAgPSBuZXcgSGVhZHJvb20oY29tcG9uZW50LCB7XHJcbiAgICAgIGNsYXNzZXM6IHtcclxuICAgICAgICBpbml0aWFsOiAnYmFja0J1dHRvbicsXHJcbiAgICAgICAgcGlubmVkOiAnYmFja0J1dHRvbi0tcGlubmVkJyxcclxuICAgICAgICB1bnBpbm5lZDogJ2JhY2tCdXR0b24tLXVucGlubmVkJyxcclxuICAgICAgICB0b3A6ICdiYWNrQnV0dG9uLS10b3AnLFxyXG4gICAgICAgIG5vdFRvcDogJ2JhY2tCdXR0b24tLW5vdC10b3AnLFxyXG4gICAgICAgIGJvdHRvbTogJ2JhY2tCdXR0b24tLWJvdHRvbScsXHJcbiAgICAgICAgbm90Qm90dG9tOiAnYmFja0J1dHRvbi0tbm90LWJvdHRvbSdcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBoZWFkcm9vbS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgbGV0IHN0YW5kYWxvbmUgPSAod2luZG93Lm1hdGNoTWVkaWEoJyhkaXNwbGF5LW1vZGU6IHN0YW5kYWxvbmUpJykubWF0Y2hlcykgfHwgKHdpbmRvdy5uYXZpZ2F0b3Iuc3RhbmRhbG9uZSk7XHJcbiAgICBpZiAoIXN0YW5kYWxvbmUpIHJldHVybjtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgdGhpcy5zaG93QnV0dG9uKCk7XHJcbiAgICB0aGlzLmluaXRIZWFkcm9vbSgpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEJhY2tCdXR0b24oKTtcclxuIiwiY2xhc3MgQm9vdHN0cmFwQ2Fyb3VzZWwge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5jYXJvdXNlbCcsXHJcbiAgICAgIGl0ZW1zOiAnLmNhcm91c2VsLWl0ZW0nLFxyXG4gICAgICBsaW5rOiAnLmNhdGVnb3J5SGVyb19fbGluaydcclxuICAgIH07XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hlY2tOdW1iZXJTbGlkZXMgPSB0aGlzLmNoZWNrTnVtYmVyU2xpZGVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnRvdWNoU3dpcGVDYXJvdXNlbCA9IHRoaXMudG91Y2hTd2lwZUNhcm91c2VsLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBjaGVja051bWJlclNsaWRlcygpIHtcclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5lYWNoKChpbmRleCwgJGVsbSkgPT4ge1xyXG4gICAgICBpZiAoJCgkZWxtKS5maW5kKHRoaXMuc2VsLml0ZW1zKS5sZW5ndGggPD0gMSkge1xyXG4gICAgICAgICQoJGVsbSkuYWRkQ2xhc3MoJ3N0YXRpYycpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRvdWNoU3dpcGVDYXJvdXNlbCgpIHtcclxuICAgIGxldCBpc1N3aXBlID0gZmFsc2U7XHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuc3dpcGUoe1xyXG4gICAgICBzd2lwZTogKGV2ZW50LCBkaXJlY3Rpb24pID0+IHtcclxuICAgICAgICBsZXQgJGNhcm91c2VsID0gKCQoZXZlbnQudGFyZ2V0KS5pcyh0aGlzLnNlbC5jb21wb25lbnQpID8gJChldmVudC50YXJnZXQpIDogJChldmVudC50YXJnZXQpLnBhcmVudHModGhpcy5zZWwuY29tcG9uZW50KSk7XHJcbiAgICAgICAgaXNTd2lwZSA9IHRydWU7XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgICAkY2Fyb3VzZWwuY2Fyb3VzZWwoJ25leHQnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICAgICAgJGNhcm91c2VsLmNhcm91c2VsKCdwcmV2Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB0YXA6IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIC8vIHRhcmdldCB2YXJpYWJsZSByZXByZXNlbnRzIHRoZSBjbGlja2VkIG9iamVjdFxyXG4gICAgICAgIGlmICgkKCcuY2F0ZWdvcnlIZXJvX19saW5rJykubGVuZ3RoICYmIHdpbmRvdy5pbm5lcldpZHRoIDwgOTkyKSB7XHJcbiAgICAgICAgICBsZXQgaHJlZiA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCcuY2F0ZWdvcnlIZXJvX19saW5rJykuZmlyc3QoKS5hdHRyKCdkYXRhLWhyZWYnKTtcclxuICAgICAgICAgIGlmIChocmVmICE9PSAnJykge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBocmVmO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgYWxsb3dQYWdlU2Nyb2xsOiAndmVydGljYWwnXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKHRoaXMuc2VsLmxpbmspLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCFpc1N3aXBlKSB7XHJcbiAgICAgICAgbGV0IGhyZWYgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtaHJlZicpO1xyXG4gICAgICAgIGlmIChocmVmICE9PSAnJykge1xyXG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gaHJlZjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaXNTd2lwZSA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy50b3VjaFN3aXBlQ2Fyb3VzZWwoKTtcclxuICAgIHRoaXMuY2hlY2tOdW1iZXJTbGlkZXMoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEJvb3RzdHJhcENhcm91c2VsKCk7XHJcbiIsImNsYXNzIENvbXBldGl0aW9uRm9ybSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNvbmZpZyA9IHtcclxuICAgICAgdXJsVG9rZW46ICcvbGlicy9ncmFuaXRlL2NzcmYvdG9rZW4uanNvbicsXHJcbiAgICAgIHVybFJlZnJlc2hDaGVjazogJy9iaW4vZGhsL3JlZnJlc2hfdG9rZW4vaW5kZXguanNvbicsXHJcbiAgICAgIHVybEdldEFsbERldGFpbHM6ICcvYmluL2RobC9nZXRkZXRhaWxzL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxDb21wZXRpdGlvbjogJy9iaW4vZGhsL2NvbXBldGl0aW9uL2luZGV4Lmpzb24nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZSBmb3JtJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZWFkQ29va2llID0gdGhpcy5yZWFkQ29va2llLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMudHJ5Q29tcGV0aXRpb25FbnRyeUxvZ2dlZEluID0gdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4uYmluZCh0aGlzKTtcclxuICAgIHRoaXMudHJ5Q29tcGV0aXRpb25FbnRyeU5vdExvZ2dlZEluID0gdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5Tm90TG9nZ2VkSW4uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY29tcGxldGVDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4gPSB0aGlzLmNvbXBsZXRlQ29tcGV0aXRpb25FbnRyeUxvZ2dlZEluLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gIH1cclxuXHJcbiAgcmVhZENvb2tpZShuYW1lKSB7XHJcbiAgICB2YXIgbmFtZUVRID0gbmFtZSArICc9JztcclxuICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYS5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgYyA9IGNhW2ldO1xyXG4gICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcclxuICAgICAgaWYgKGMuaW5kZXhPZihuYW1lRVEpID09PSAwKSByZXR1cm4gYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgdGhpcy52YWxpZGF0ZSgpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZSgpIHtcclxuICAgIHZhciBjb21wZXRpdGlvbkVudHJ5ID0gJCh0aGlzLnNlbC5jb21wb25lbnQpO1xyXG5cclxuICAgIGlmIChjb21wZXRpdGlvbkVudHJ5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgY29tcGV0aXRpb25FbnRyeS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xyXG4gICAgICAgIGlmICgkKGl0ZW0pLmNsb3Nlc3QoJy5jb21wZXRpdGlvbkRhdGFDYXB0dXJlJykuaGFzQ2xhc3MoJ25vdC1sb2dnZWQtaW4nKSkge1xyXG4gICAgICAgICAgJChpdGVtKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgICAgICAgcmVnaXN0ZXJfX3lvdXJFbWFpbDogJ2VtYWlsJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcclxuICAgICAgICAgICAgICAgICQoZWxlbWVudCkuYXBwZW5kKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybSkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMudHJ5Q29tcGV0aXRpb25FbnRyeU5vdExvZ2dlZEluKGZvcm0pO1xyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoaXRlbSkudmFsaWRhdGUoe1xyXG4gICAgICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcclxuICAgICAgICAgICAgICAgICQoZWxlbWVudCkuYXBwZW5kKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybSkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMudHJ5Q29tcGV0aXRpb25FbnRyeUxvZ2dlZEluKGZvcm0pO1xyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICB0cnlDb21wZXRpdGlvbkVudHJ5Tm90TG9nZ2VkSW4oZm9ybSkge1xyXG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XHJcblxyXG4gICAgdmFyIGRhdGEgPSB7IH07XHJcbiAgICBpZiAoZnJtLmZpbmQoJy5jb21wLWFuc3dlcicpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB2YXIgYW5zd2VyID0gZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdyYWRpbyddOmNoZWNrZWRcIikudmFsKCk7XHJcbiAgICAgIGlmIChhbnN3ZXIgPT09IG51bGwgfHwgYW5zd2VyLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGFsZXJ0KCdQbGVhc2Ugc2VsZWN0IGFuIG9wdGlvbicpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YSA9IHtcclxuICAgICAgICBmaXJzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fZmlyc3ROYW1lJykudmFsKCksXHJcbiAgICAgICAgbGFzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fbGFzdE5hbWUnKS52YWwoKSxcclxuICAgICAgICBlbWFpbDogZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX195b3VyRW1haWwnKS52YWwoKSxcclxuXHJcbiAgICAgICAgcG9zaXRpb246IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fcG9zaXRpb24nKS52YWwoKSxcclxuICAgICAgICBjb250YWN0OiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2NvbnRhY3ROdW1iZXInKS52YWwoKSxcclxuICAgICAgICBzaXplOiBmcm0uZmluZCgnc2VsZWN0I3JlZ2lzdGVyX19idXNpbmVzc1NpemUnKS52YWwoKSxcclxuICAgICAgICBzZWN0b3I6IGZybS5maW5kKCdzZWxlY3QjcmVnaXN0ZXJfX2J1c2luZXNzU2VjdG9yJykudmFsKCksXHJcblxyXG4gICAgICAgIHBhdGg6IGZybS5kYXRhKCdwYXRoJyksXHJcbiAgICAgICAgYW5zd2VyOiBhbnN3ZXJcclxuICAgICAgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgZmlyc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2ZpcnN0TmFtZScpLnZhbCgpLFxyXG4gICAgICAgIGxhc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2xhc3ROYW1lJykudmFsKCksXHJcbiAgICAgICAgZW1haWw6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9feW91ckVtYWlsJykudmFsKCksXHJcblxyXG4gICAgICAgIHBvc2l0aW9uOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3Bvc2l0aW9uJykudmFsKCksXHJcbiAgICAgICAgY29udGFjdDogZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX19jb250YWN0TnVtYmVyJykudmFsKCksXHJcbiAgICAgICAgc2l6ZTogZnJtLmZpbmQoJ3NlbGVjdCNyZWdpc3Rlcl9fYnVzaW5lc3NTaXplJykudmFsKCksXHJcbiAgICAgICAgc2VjdG9yOiBmcm0uZmluZCgnc2VsZWN0I3JlZ2lzdGVyX19idXNpbmVzc1NlY3RvcicpLnZhbCgpLFxyXG5cclxuICAgICAgICBwYXRoOiBmcm0uZGF0YSgncGF0aCcpXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBmcm0uZmluZCgnLmNvbXAtYW5zd2VyJykuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgICB2YXIgdmFsID0gJChpdGVtKS52YWwoKTtcclxuICAgICAgICBpZiAoJChpdGVtKS5kYXRhKCdpbmRleCcpID09PSAxKSB7XHJcbiAgICAgICAgICBkYXRhLmFuc3dlciA9IHZhbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGF0YVsnYW5zd2VyJyArICQoaXRlbSkuZGF0YSgnaW5kZXgnKV0gPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmICgoJC50cmltKGRhdGEuZmlyc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS5sYXN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEuZW1haWwpLmxlbmd0aCA9PT0gMCkpIHtcclxuICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciB5b3VyIG5hbWUsIGVtYWlsIGFkZHJlc3MgYW5kIGNvbXBldGl0aW9uIGRldGFpbHMuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgICBmcm0uZmluZChcImlucHV0W3R5cGU9J3N1Ym1pdCddXCIpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcclxuXHJcbiAgICAgICQuZ2V0KHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiB0aGlzLmNvbmZpZy51cmxDb21wZXRpdGlvbixcclxuICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtb2RhbCA9IGZybS5jbG9zZXN0KCcuY29tcGV0aXRpb24tY29udGFpbmVyJykuZmluZCgnLm1vZGFsJyk7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCcudGhhbmtzLW5hbWUnKS50ZXh0KGRhdGEuZmlyc3RuYW1lKTtcclxuICAgICAgICAgICAgICAgIC8vIG1vZGFsLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5zaG93KCkuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmcm0uY2xvc2VzdCgnLmNvbXBldGl0aW9uRGF0YUNhcHR1cmUnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0VudGVyIHRoZSBjb21wZXRpdGlvbicpO1xyXG4gICAgICAgICAgICBmcm0uZmluZChcImlucHV0W3R5cGU9J3N1Ym1pdCddXCIpLnZhbCgnRW50ZXIgdGhlIGNvbXBldGl0aW9uJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdHJ5Q29tcGV0aXRpb25FbnRyeUxvZ2dlZEluKGZvcm0pIHtcclxuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xyXG4gICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgIGZybS5maW5kKFwiaW5wdXRbdHlwZT0nc3VibWl0J11cIikudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xyXG5cclxuICAgIHZhciBjb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcclxuICAgIGlmIChjb29raWUgIT09IG51bGwpIHtcclxuICAgICAgdmFyIHNwbGl0ID0gY29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgIGlmIChzcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICQuZ2V0KHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHRoaXMuY29uZmlnLnVybEdldEFsbERldGFpbHMsXHJcbiAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHNwbGl0WzBdLCB0b2tlbjogc3BsaXRbMV0gfSxcclxuICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChhbGxEZXRhaWxzUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZXRlQ29tcGV0aXRpb25FbnRyeUxvZ2dlZEluKGZvcm0sIGFsbERldGFpbHNSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIHJlZnJlc2hDb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nKTtcclxuICAgICAgaWYgKHJlZnJlc2hDb29raWUgIT09IG51bGwpIHtcclxuICAgICAgICB2YXIgcmVmcmVzaFNwbGl0ID0gcmVmcmVzaENvb2tpZS5zcGxpdCgnfCcpO1xyXG4gICAgICAgIGlmIChyZWZyZXNoU3BsaXQubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICQuZ2V0KHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICB1cmw6IHRoaXMuY29uZmlnLnVybFJlZnJlc2hDaGVjayxcclxuICAgICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiByZWZyZXNoU3BsaXRbMF0sIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hTcGxpdFsxXSB9LFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICBzdWNjZXNzOiAocmVmcmVzaFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoUmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHJlZnJlc2hSZXNwb25zZSwgdHJ1ZSBdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyeUNvbXBldGl0aW9uRW50cnlMb2dnZWRJbihmb3JtKTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29tcGxldGVDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4oZm9ybSwgZGV0YWlscykge1xyXG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XHJcblxyXG4gICAgdmFyIGFuc3dlciA9ICcnO1xyXG4gICAgaWYgKGZybS5maW5kKCcuY29tcC1hbnN3ZXInKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGFuc3dlciA9IGZybS5maW5kKCcuY29tcC1hbnN3ZXInKS52YWwoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFuc3dlciA9IGZybS5maW5kKFwiaW5wdXRbdHlwZT0ncmFkaW8nXTpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgICBpZiAoYW5zd2VyID09PSBudWxsIHx8IGFuc3dlci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBhbGVydCgnUGxlYXNlIHNlbGVjdCBhbiBvcHRpb24nKTtcclxuICAgICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdFbnRlciB0aGUgY29tcGV0aXRpb24gJyArIGRldGFpbHMucmVnaXN0cmF0aW9uX2ZpcnN0bmFtZSk7XHJcbiAgICAgICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ0VudGVyIHRoZSBjb21wZXRpdGlvbiAnICsgZGV0YWlscy5yZWdpc3RyYXRpb25fZmlyc3RuYW1lKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgZmlyc3RuYW1lOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9maXJzdG5hbWUsXHJcbiAgICAgIGxhc3RuYW1lOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9sYXN0bmFtZSxcclxuICAgICAgZW1haWw6IGRldGFpbHMucmVnaXN0cmF0aW9uX2VtYWlsLFxyXG5cclxuICAgICAgcG9zaXRpb246IGRldGFpbHMucmVnaXN0cmF0aW9uX3Bvc2l0aW9uLFxyXG4gICAgICBjb250YWN0OiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9jb250YWN0LFxyXG4gICAgICBzaXplOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9zaXplLFxyXG4gICAgICBzZWN0b3I6IGRldGFpbHMucmVnaXN0cmF0aW9uX3NlY3RvcixcclxuXHJcbiAgICAgIHBhdGg6IGZybS5kYXRhKCdwYXRoJyksXHJcbiAgICAgIGFuc3dlcjogYW5zd2VyXHJcbiAgICB9O1xyXG5cclxuICAgIGlmICgoJC50cmltKGRhdGEuYW5zd2VyKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS5maXJzdG5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShkYXRhLmxhc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS5lbWFpbCkubGVuZ3RoID09PSAwKSkge1xyXG4gICAgICBhbGVydCgnUGxlYXNlIGVudGVyIHlvdXIgbmFtZSwgZW1haWwgYWRkcmVzcyBhbmQgY29tcGV0aXRpb24gZGV0YWlscy4nKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICAgIGZybS5maW5kKFwiaW5wdXRbdHlwZT0nc3VibWl0J11cIikudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xyXG5cclxuICAgICAgJC5nZXQodGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdGhpcy5jb25maWcudXJsQ29tcGV0aXRpb24sXHJcbiAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbW9kYWwgPSBmcm0uY2xvc2VzdCgnLmNvbXBldGl0aW9uLWNvbnRhaW5lcicpLmZpbmQoJy5tb2RhbCcpO1xyXG4gICAgICAgICAgICAgICAgbW9kYWwuZmluZCgnLnRoYW5rcy1uYW1lJykudGV4dChkYXRhLmZpcnN0bmFtZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBtb2RhbC5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgbW9kYWwuc2hvdygpLmFkZENsYXNzKCdzaG93Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZnJtLmNsb3Nlc3QoJy5jb21wZXRpdGlvbkRhdGFDYXB0dXJlJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uXFxuJyArIHJlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdFbnRlciB0aGUgY29tcGV0aXRpb24gJyArIGRhdGEuZmlyc3RuYW1lKTtcclxuICAgICAgICAgICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ0VudGVyIHRoZSBjb21wZXRpdGlvbiAnICsgZGF0YS5maXJzdG5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdFbnRlciB0aGUgY29tcGV0aXRpb24nKTtcclxuICAgIGZybS5maW5kKFwiaW5wdXRbdHlwZT0nc3VibWl0J11cIikudmFsKCdFbnRlciB0aGUgY29tcGV0aXRpb24nKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBDb21wZXRpdGlvbkZvcm0oKTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIElEQjoge1xyXG4gICAgREI6ICdvZmZsaW5lLWFydGljbGVzJyxcclxuICAgIEFSVElDTEVTX1NUT1JFOiAnYXJ0aWNsZXMnXHJcbiAgfVxyXG59O1xyXG4iLCJjbGFzcyBDb29raWVCYW5uZXIge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5jb29raWUtYmFubmVyJyxcclxuICAgICAgY2xvc2VCdXR0b246ICcuY29va2llLWJhbm5lcl9fYnV0dG9uJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmNvb2tpZU5hbWUgPSAnZGhsLWNvb2tpZS13YXJuaW5nJztcclxuXHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oaWRlQ29va2llQmFubmVyID0gdGhpcy5oaWRlQ29va2llQmFubmVyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dDb29raWVCYW5uZXIgPSB0aGlzLnNob3dDb29raWVCYW5uZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZGlzcGxheUJhbm5lciA9IHRoaXMuZGlzcGxheUJhbm5lci5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgdGhpcy5kaXNwbGF5QmFubmVyKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5jbG9zZUJ1dHRvbiwgKCkgPT4ge1xyXG4gICAgICB0aGlzLmhpZGVDb29raWVCYW5uZXIoKTtcclxuICAgICAgQ29va2llcy5zZXQodGhpcy5jb29raWVOYW1lLCB7c2VlbjogMX0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkaXNwbGF5QmFubmVyKCkge1xyXG4gICAgbGV0IGNvb2tpZSA9IENvb2tpZXMuZ2V0KHRoaXMuY29va2llTmFtZSk7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBjb29raWUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRoaXMuc2hvd0Nvb2tpZUJhbm5lcigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2hvd0Nvb2tpZUJhbm5lcigpIHtcclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnY29va2llLWJhbm5lci0tZGlzcGxheScpO1xyXG4gIH1cclxuXHJcbiAgaGlkZUNvb2tpZUJhbm5lcigpIHtcclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5yZW1vdmVDbGFzcygnY29va2llLWJhbm5lci0tZGlzcGxheScpO1xyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnJlbW92ZSgpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IENvb2tpZUJhbm5lcigpO1xyXG4iLCJpbXBvcnQgQ29uc3RhbnRzIGZyb20gJy4vQ29uc3RhbnRzJztcclxuXHJcbmNsYXNzIERhdGFiYXNlIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuZGF0YWJhc2UgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuaW5pdGlhdGVEYiA9IHRoaXMuaW5pdGlhdGVEYi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5hZGRBcnRpY2xlID0gdGhpcy5hZGRBcnRpY2xlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmRlbGV0ZUFydGljbGUgPSB0aGlzLmRlbGV0ZUFydGljbGUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0QXJ0aWNsZXMgPSB0aGlzLmdldEFydGljbGVzLmJpbmQodGhpcyk7XHJcblxyXG4gICAgLy8gQ3JlYXRlL2dldCBEQlxyXG4gICAgaWYgKHdpbmRvdy5Qcm9taXNlKSB7XHJcbiAgICAgIHRoaXMuaW5pdGlhdGVEYigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5pdGlhdGVEYigpIHtcclxuICAgIHRoaXMuZGF0YWJhc2UgPSBpZGIub3BlbihDb25zdGFudHMuSURCLkRCLCAxLCAodXBncmFkZURiKSA9PiB7XHJcbiAgICAgIGlmICghdXBncmFkZURiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRSkpIHtcclxuICAgICAgICBsZXQgYXJ0aWNsZU9TID0gdXBncmFkZURiLmNyZWF0ZU9iamVjdFN0b3JlKENvbnN0YW50cy5JREIuQVJUSUNMRVNfU1RPUkUsIHtcclxuICAgICAgICAgIGtleVBhdGg6ICdsaW5rJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFydGljbGVPUy5jcmVhdGVJbmRleCgndGl0bGUnLCAndGl0bGUnLCB7dW5pcXVlOiBmYWxzZX0pO1xyXG4gICAgICAgIGFydGljbGVPUy5jcmVhdGVJbmRleCgnbGluaycsICdsaW5rJywge3VuaXF1ZTogdHJ1ZX0pO1xyXG4gICAgICAgIGFydGljbGVPUy5jcmVhdGVJbmRleCgnZGVzY3JpcHRpb24nLCAnZGVzY3JpcHRpb24nLCB7dW5pcXVlOiBmYWxzZX0pO1xyXG4gICAgICAgIGFydGljbGVPUy5jcmVhdGVJbmRleCgnY2F0ZWdvcnlOYW1lJywgJ2NhdGVnb3J5TmFtZScsIHt1bmlxdWU6IGZhbHNlfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdjYXRlZ29yeUxpbmsnLCAnY2F0ZWdvcnlMaW5rJywge3VuaXF1ZTogZmFsc2V9KTtcclxuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ3RpbWVUb1JlYWQnLCAndGltZVRvUmVhZCcsIHt1bmlxdWU6IGZhbHNlfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdpbWFnZU1vYmlsZScsICdpbWFnZU1vYmlsZScsIHt1bmlxdWU6IGZhbHNlfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdpbWFnZURlc2t0b3AnLCAnaW1hZ2VEZXNrdG9wJywge3VuaXF1ZTogZmFsc2V9KTtcclxuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2lzTGFyZ2UnLCAnaXNMYXJnZScsIHt1bmlxdWU6IGZhbHNlfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdpc1ZpZGVvJywgJ2lzVmlkZW8nLCB7dW5pcXVlOiBmYWxzZX0pO1xyXG4gICAgICAgIGFydGljbGVPUy5jcmVhdGVJbmRleCgnY2FjaGVOYW1lJywgJ2NhY2hlTmFtZScsIHt1bmlxdWU6IGZhbHNlfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQXJ0aWNsZShsaW5rKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZS50aGVuKChkYikgPT4ge1xyXG4gICAgICBsZXQgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihbQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRV0sICdyZWFkd3JpdGUnKTtcclxuICAgICAgbGV0IHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRSk7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgc3RvcmUuZGVsZXRlKGxpbmspLFxyXG4gICAgICAgIHRyYW5zYWN0aW9uLmNvbXBsZXRlXHJcbiAgICAgIF0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhZGRBcnRpY2xlKHRpdGxlLCBsaW5rLCBkZXNjcmlwdGlvbiwgY2F0ZWdvcnlOYW1lLCBjYXRlZ29yeUxpbmssIHRpbWVUb1JlYWQsIGltYWdlTW9iaWxlLCBpbWFnZURlc2t0b3AsIGlzTGFyZ2UsIGlzVmlkZW8sIGNhY2hlTmFtZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YWJhc2UudGhlbigoZGIpID0+IHtcclxuICAgICAgbGV0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oW0NvbnN0YW50cy5JREIuQVJUSUNMRVNfU1RPUkVdLCAncmVhZHdyaXRlJyk7XHJcbiAgICAgIGxldCBzdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKENvbnN0YW50cy5JREIuQVJUSUNMRVNfU1RPUkUpO1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgIHN0b3JlLmFkZCh7XHJcbiAgICAgICAgICB0aXRsZSxcclxuICAgICAgICAgIGxpbmssXHJcbiAgICAgICAgICBkZXNjcmlwdGlvbixcclxuICAgICAgICAgIGNhdGVnb3J5TmFtZSxcclxuICAgICAgICAgIGNhdGVnb3J5TGluayxcclxuICAgICAgICAgIHRpbWVUb1JlYWQsXHJcbiAgICAgICAgICBpbWFnZU1vYmlsZSxcclxuICAgICAgICAgIGltYWdlRGVza3RvcCxcclxuICAgICAgICAgIGlzTGFyZ2UsXHJcbiAgICAgICAgICBpc1ZpZGVvLFxyXG4gICAgICAgICAgY2FjaGVOYW1lXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgdHJhbnNhY3Rpb24uY29tcGxldGVcclxuICAgICAgXSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEFydGljbGVzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YWJhc2UudGhlbigoZGIpID0+IHtcclxuICAgICAgbGV0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oW0NvbnN0YW50cy5JREIuQVJUSUNMRVNfU1RPUkVdLCAncmVhZG9ubHknKTtcclxuICAgICAgbGV0IHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRSk7XHJcbiAgICAgIHJldHVybiBzdG9yZS5nZXRBbGwoKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IERhdGFiYXNlKCk7XHJcbiIsImNsYXNzIERlbGV0ZUFjY291bnRGb3JtIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuY29uZmlnID0ge1xyXG4gICAgICB1cmxUb2tlbjogJy9saWJzL2dyYW5pdGUvY3NyZi90b2tlbi5qc29uJyxcclxuICAgICAgdXJsUmVmcmVzaENoZWNrOiAnL2Jpbi9kaGwvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcclxuICAgICAgdXJsR2V0QWxsRGV0YWlsczogJy9iaW4vZGhsL2dldGRldGFpbHMvaW5kZXguanNvbicsXHJcbiAgICAgIHVybERlbGV0ZUFjY291bnQ6ICcvYmluL2RobC9kZWxldGVhY2NvdW50L2luZGV4Lmpzb24nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuZGVsZXRlLWFjY291bnQnXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlYWRDb29raWUgPSB0aGlzLnJlYWRDb29raWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2xlYXJDb29raWUgPSB0aGlzLmNsZWFyQ29va2llLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNyZWF0ZUNvb2tpZSA9IHRoaXMuY3JlYXRlQ29va2llLmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy50cnlEZWxldGVBY2NvdW50ID0gdGhpcy50cnlEZWxldGVBY2NvdW50LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNvbXBsZXRlRGVsZXRlQWNjb3VudCA9IHRoaXMuY29tcGxldGVEZWxldGVBY2NvdW50LmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5sb2dnZWRJbiA9IHRoaXMubG9nZ2VkSW4uYmluZCh0aGlzKTtcclxuICAgIHRoaXMubm90TG9nZ2VkSW4gPSB0aGlzLm5vdExvZ2dlZEluLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgncGFzc3dvcmQnLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJChlbGVtZW50KS5hdHRyKCdwYXR0ZXJuJykpLnRlc3QodmFsdWUpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkIGZvcm1hdCBpcyBub3QgdmFsaWQnKTtcclxuXHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnZXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICByZXR1cm4gKCQoJyMnICsgJChlbGVtZW50KS5hdHRyKCdkYXRhLWVxdWFsVG8nKSkudmFsKCkgPT09ICQoZWxlbWVudCkudmFsKCkpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnKTtcclxuXHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJsb2dnZWRpbi5ESEwnLCAoZXZ0LCB0b2tlbkRhdGEpID0+IHtcclxuICAgICAgdGhpcy5sb2dnZWRJbih0b2tlbkRhdGEpO1xyXG4gICAgfSk7XHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJub3Rsb2dnZWRpbi5ESEwnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubm90TG9nZ2VkSW4oKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCdmb3JtJykudmFsaWRhdGUoe1xyXG4gICAgICBydWxlczoge1xyXG4gICAgICAgIGxvZ2luX19maXJzdE5hbWU6ICdlbWFpbCcsXHJcbiAgICAgICAgbG9naW5fX3Bhc3N3b3JkOiAncGFzc3dvcmQnXHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IChmb3JtKSA9PiB7XHJcbiAgICAgICAgdGhpcy50cnlEZWxldGVBY2NvdW50KGZvcm0pO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZWFkQ29va2llKG5hbWUpIHtcclxuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xyXG4gICAgdmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjID0gY2FbaV07XHJcbiAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xyXG4gICAgICBpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBjbGVhckNvb2tpZShuYW1lKSB7XHJcbiAgICB0aGlzLmNyZWF0ZUNvb2tpZShuYW1lLCAnJywgLTEpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlQ29va2llKG5hbWUsIHZhbHVlLCBleHBpcnlTZWNvbmRzKSB7XHJcbiAgICB2YXIgZXhwaXJlcyA9ICcnO1xyXG4gICAgaWYgKGV4cGlyeVNlY29uZHMpIHtcclxuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoZXhwaXJ5U2Vjb25kcyAqIDEwMDApKTtcclxuICAgICAgZXhwaXJlcyA9ICc7IGV4cGlyZXM9JyArIGRhdGUudG9VVENTdHJpbmcoKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyAnPScgKyB2YWx1ZSArIGV4cGlyZXMgKyAnOyBwYXRoPS8nO1xyXG4gIH1cclxuXHJcbiAgdHJ5RGVsZXRlQWNjb3VudChmb3JtKSB7XHJcbiAgICB2YXIgZnJtID0gJChmb3JtKTtcclxuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xyXG5cclxuICAgIHZhciBjb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcclxuICAgIGlmIChjb29raWUgIT09IG51bGwpIHtcclxuICAgICAgdmFyIHNwbGl0ID0gY29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgIGlmIChzcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICQuZ2V0KHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHRoaXMuY29uZmlnLnVybEdldEFsbERldGFpbHMsXHJcbiAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHNwbGl0WzBdLCB0b2tlbjogc3BsaXRbMV0gfSxcclxuICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChhbGxEZXRhaWxzUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgYWxsRGV0YWlsc1Jlc3BvbnNlLCB0cnVlIF0pO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZXRlRGVsZXRlQWNjb3VudChmb3JtLCBhbGxEZXRhaWxzUmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICgxKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQgKDIpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQgKDMpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciByZWZyZXNoQ29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuUmVmcmVzaFRva2VuJyk7XHJcbiAgICAgIGlmIChyZWZyZXNoQ29va2llICE9PSBudWxsKSB7XHJcbiAgICAgICAgdmFyIHJlZnJlc2hTcGxpdCA9IHJlZnJlc2hDb29raWUuc3BsaXQoJ3wnKTtcclxuICAgICAgICBpZiAocmVmcmVzaFNwbGl0Lmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAkLmdldCh0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgdXJsOiB0aGlzLmNvbmZpZy51cmxSZWZyZXNoQ2hlY2ssXHJcbiAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogcmVmcmVzaFNwbGl0WzBdLCByZWZyZXNoX3Rva2VuOiByZWZyZXNoU3BsaXRbMV0gfSxcclxuICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgc3VjY2VzczogKHJlZnJlc2hSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyByZWZyZXNoUmVzcG9uc2UsIHRydWUgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cnlEZWxldGVBY2NvdW50KGZvcm0pO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZGVsZXRlIHlvdXIgYWNjb3VudCAoNCkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICg1KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICg2KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29tcGxldGVEZWxldGVBY2NvdW50KGZvcm0sIGRldGFpbHMpIHtcclxuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xyXG5cclxuICAgIHZhciBkYXRhID0ge1xyXG4gICAgICB0b2tlbjogZGV0YWlscy50b2tlbixcclxuXHJcbiAgICAgIHVzZXJuYW1lOiBmcm0uZmluZCgnaW5wdXQjbG9naW5fX2ZpcnN0TmFtZScpLnZhbCgpLFxyXG4gICAgICBwYXNzd29yZDogZnJtLmZpbmQoJ2lucHV0I2xvZ2luX19wYXNzd29yZCcpLnZhbCgpXHJcbiAgICB9O1xyXG5cclxuICAgIGlmICgoJC50cmltKGRhdGEudXNlcm5hbWUpLmxlbmd0aCA9PSAwKSB8fCAoJC50cmltKGRhdGEucGFzc3dvcmQpLmxlbmd0aCA9PSAwKSkge1xyXG4gICAgICBhbGVydCgnUGxlYXNlIGVudGVyIHlvdXIgZW1haWwgYWRkcmVzcyBhbmQgcGFzc3dvcmQuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xyXG5cclxuICAgICAgJC5nZXQodGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdGhpcy5jb25maWcudXJsRGVsZXRlQWNjb3VudCxcclxuICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogKGRlbGV0ZUFjY291bnRSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGVsZXRlQWNjb3VudFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIGRlbGV0ZUFjY291bnRSZXNwb25zZSwgdHJ1ZSBdKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGRlbGV0ZUFjY291bnRSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBmcm0uZGF0YSgnc3VjY2Vzc3VybCcpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50LlxcbicgKyBkZWxldGVBY2NvdW50UmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdEZWxldGUgQWNjb3VudCcpO1xyXG4gICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdEZWxldGUgQWNjb3VudCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdEZWxldGUgQWNjb3VudCcpO1xyXG4gICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgnRGVsZXRlIEFjY291bnQnKTtcclxuICB9XHJcblxyXG4gIGxvZ2dlZEluKHRva2VuRGF0YSkge1xyXG4gICAgaWYgKHRva2VuRGF0YSAmJiB0b2tlbkRhdGEuc3RhdHVzICYmIHRva2VuRGF0YS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5vdExvZ2dlZEluKCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5oYXNDbGFzcygnbm8tcmVkaXJlY3QnKSkge1xyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9jb250ZW50L2RobC5odG1sJztcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBEZWxldGVBY2NvdW50Rm9ybSgpO1xyXG4iLCJjbGFzcyBFY29tRm9ybXMge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5lY29tLWZvcm0nLFxyXG4gICAgICBjbG9zZUljb246ICcuZWNvbS1mb3JtX19jbG9zZScsXHJcbiAgICAgIG1heEZvcm06ICcuZWNvbS1mb3JtLS1tYXgnLFxyXG4gICAgICBtaW5Gb3JtOiAnLmVjb20tZm9ybS0tbWluJyxcclxuICAgICAgc3VibWl0Rm9ybTogJy5lY29tLWZvcm0gaW5wdXRbdHlwZT1zdWJtaXRdJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmRpc3BsYXlGb3JtQWZ0ZXIgPSA1MDAwO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmZvcm1UaW1lciA9IHRoaXMuZm9ybVRpbWVyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dIaWRlTWF4Rm9ybSA9IHRoaXMuc2hvd0hpZGVNYXhGb3JtLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dIaWRlTWluRm9ybSA9IHRoaXMuc2hvd0hpZGVNaW5Gb3JtLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnN1Ym1pdEZvcm0gPSB0aGlzLnN1Ym1pdEZvcm0uYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHRoaXMuZm9ybVRpbWVyKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5jbG9zZUljb24sICgpID0+IHtcclxuICAgICAgdGhpcy5zaG93SGlkZU1heEZvcm0oKTtcclxuICAgICAgdGhpcy5zaG93SGlkZU1pbkZvcm0oKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnN1Ym1pdEZvcm0sIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IGZvcm0gPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCdmb3JtJyk7XHJcbiAgICAgIHRoaXMuc3VibWl0Rm9ybShmb3JtKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZm9ybVRpbWVyKCkge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuc2hvd0hpZGVNYXhGb3JtKCk7XHJcbiAgICB9LCB0aGlzLmRpc3BsYXlGb3JtQWZ0ZXIpO1xyXG4gIH1cclxuXHJcbiAgc2hvd0hpZGVNYXhGb3JtKCkge1xyXG4gICAgJCh0aGlzLnNlbC5tYXhGb3JtKS50b2dnbGVDbGFzcygnaXMtaGlkZGVuJyk7XHJcbiAgfVxyXG5cclxuICBzaG93SGlkZU1pbkZvcm0oKSB7XHJcbiAgICAkKHRoaXMuc2VsLm1pbkZvcm0pLnRvZ2dsZUNsYXNzKCdpcy1zaG93bicpO1xyXG4gIH1cclxuXHJcbiAgc3VibWl0Rm9ybShmb3JtKSB7XHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGZvcm0uYXR0cignYWN0aW9uJykgKyAnPycgKyBmb3JtLnNlcmlhbGl6ZSgpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEVjb21Gb3JtcygpO1xyXG4iLCJpbXBvcnQgUGFzc3dvcmRWYWxpZGl0eSBmcm9tICcuL1Bhc3N3b3JkVmFsaWRpdHknO1xyXG5cclxuY2xhc3MgRm9ybVZhbGlkYXRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5mb3JtcydcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5hZGRQYXNzd29yZENoZWNrID0gdGhpcy5hZGRQYXNzd29yZENoZWNrLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHRoaXMuYWRkUGFzc3dvcmRDaGVjaygpO1xyXG4gICAgdGhpcy52YWxpZGF0ZSgpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBhZGRQYXNzd29yZENoZWNrKCkge1xyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdwYXNzd29yZENoZWNrJywgKHZhbHVlKSA9PiB7XHJcbiAgICAgIHJldHVybiBQYXNzd29yZFZhbGlkaXR5LmlzUGFzc3dvcmRWYWxpZCh2YWx1ZSk7XHJcbiAgICB9LCAnUGxlYXNlIGVudGVyIGEgdmFsaWQgcGFzc3dvcmQnKTtcclxuICB9XHJcblxyXG4gIHZhbGlkYXRlKCkge1xyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnZhbGlkYXRlKHtcclxuICAgICAgcnVsZXM6IHtcclxuICAgICAgICAncmVxdWlyZWQnOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ3Bhc3N3b3JkJzoge1xyXG4gICAgICAgICAgcGFzc3dvcmRDaGVjazogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XHJcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgRm9ybVZhbGlkYXRpb24oKTtcclxuIiwiY2xhc3MgSGVhZGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuaGVhZGVyJyxcclxuICAgICAgdG9nZ2xlOiAnLmhlYWRlcl9fbmF2aWdhdGlvbicsXHJcbiAgICAgIG1lbnU6ICcuaGVhZGVyX19tZWdhbmF2JyxcclxuICAgICAgb3ZlcmxheTogJy5oZWFkZXJfX292ZXJsYXknLFxyXG4gICAgICBzZWFyY2g6ICcuaGVhZGVyX19kZXNrdG9wU2VhcmNoJyxcclxuICAgICAgc2VhcmNoRm9ybTogJy5oZWFkZXJfX2Rlc2t0b3BTZWFyY2hGb3JtJyxcclxuICAgICAgc2VhcmNoRm9ybUlucHV0OiAnLmhlYWRlcl9fZGVza3RvcFNlYXJjaEZvcm0gLmhlYWRlcl9fc2VhcmNoSW5wdXQnLFxyXG4gICAgICBzZWFyY2hGb3JtU3VibWl0OiAnLmhlYWRlcl9fZGVza3RvcFNlYXJjaEZvcm0gLmhlYWRlcl9fc2VhcmNoQnV0dG9uJ1xyXG4gICAgfTtcclxuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IDA7XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMudG9nZ2xlTWVudSA9IHRoaXMudG9nZ2xlTWVudS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50b2dnbGVTZWFyY2ggPSB0aGlzLnRvZ2dsZVNlYXJjaC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zaG93U2VhcmNoID0gdGhpcy5zaG93U2VhcmNoLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmhpZGVTZWFyY2ggPSB0aGlzLmhpZGVTZWFyY2guYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYm9keVNjcm9sbGluZyA9IHRoaXMuYm9keVNjcm9sbGluZy5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuY2hlY2tTY3JvbGwgPSB0aGlzLmNoZWNrU2Nyb2xsLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC50b2dnbGUsIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdGhpcy50b2dnbGVNZW51KCk7XHJcbiAgICB9KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLm92ZXJsYXksIHRoaXMudG9nZ2xlTWVudSk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5zZWFyY2gsIHRoaXMudG9nZ2xlU2VhcmNoKTtcclxuICAgICQod2luZG93KS5vbignc2Nyb2xsJywgdGhpcy5jaGVja1Njcm9sbCk7XHJcbiAgICB0aGlzLmNoZWNrU2Nyb2xsKCk7XHJcbiAgfVxyXG5cclxuICBjaGVja1Njcm9sbCgpIHtcclxuICAgIHZhciB3dCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuICAgIHZhciBwYiA9ICQoJy5wYWdlLWJvZHknKS5vZmZzZXQoKS50b3A7XHJcbiAgICBpZiAod3QgPiBwYikge1xyXG4gICAgICAkKCcucGFnZS1ib2R5JykuYWRkQ2xhc3MoJ2ZpeGVkJyk7XHJcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnZml4ZWQnKTtcclxuICAgICAgaWYgKHd0ID4gdGhpcy5sYXN0U2Nyb2xsVG9wKSB7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnJlbW92ZUNsYXNzKCdpbicpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnaW4nKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnLnBhZ2UtYm9keScpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkucmVtb3ZlQ2xhc3MoJ2ZpeGVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gd3Q7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVNZW51KCkge1xyXG4gICAgaWYgKCEkKHRoaXMuc2VsLm1lbnUpLmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgIHRoaXMuYm9keVNjcm9sbGluZyhmYWxzZSk7XHJcbiAgICAgICQodGhpcy5zZWwudG9nZ2xlKS5hZGRDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJvZHlTY3JvbGxpbmcodHJ1ZSk7XHJcbiAgICAgICQodGhpcy5zZWwudG9nZ2xlKS5yZW1vdmVDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XHJcbiAgICB9XHJcbiAgICAkKHRoaXMuc2VsLm1lbnUpLnNsaWRlVG9nZ2xlKDE1MCk7XHJcblxyXG4gICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoRm9ybSkuaGFzQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaEZvcm0tLW9wZW4nKSkge1xyXG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BTZWFyY2hGb3JtLS1vcGVuJyk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoLS1jbG9zZScpO1xyXG4gICAgICB9LCAxNTApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYm9keVNjcm9sbGluZyhlbmFibGVkKSB7XHJcbiAgICBpZiAoZW5hYmxlZCkge1xyXG4gICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKTtcclxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcclxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnbW9kYWwtb3BlbicpO1xyXG4gICAgICBsZXQgd2luZG93SGVpZ2h0ID0gd2luZG93LnNjcmVlbi5hdmFpbEhlaWdodDtcclxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5oZWlnaHQgPSB3aW5kb3dIZWlnaHQudG9TdHJpbmcoKSArICdweCc7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuaGVpZ2h0ID0gd2luZG93SGVpZ2h0LnRvU3RyaW5nKCkgKyAncHgnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdG9nZ2xlU2VhcmNoKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaCkuaGFzQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKSkge1xyXG4gICAgICB0aGlzLmhpZGVTZWFyY2goKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2hvd1NlYXJjaCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2hvd1NlYXJjaCgpIHtcclxuICAgICQodGhpcy5zZWwuc2VhcmNoKS5hZGRDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoLS1jbG9zZScpO1xyXG4gICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtKS5hZGRDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoRm9ybS0tb3BlbicpO1xyXG4gICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmZvY3VzKCk7XHJcblxyXG4gICAgaWYgKCQodGhpcy5zZWwudG9nZ2xlKS5oYXNDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJykpIHtcclxuICAgICAgdGhpcy5ib2R5U2Nyb2xsaW5nKHRydWUpO1xyXG4gICAgICAkKHRoaXMuc2VsLnRvZ2dsZSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fbmF2aWdhdGlvbi0tb3BlbicpO1xyXG4gICAgICAkKHRoaXMuc2VsLm1lbnUpLnNsaWRlVG9nZ2xlKDE1MCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoaWRlU2VhcmNoKCkge1xyXG4gICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoRm9ybS0tb3BlbicpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoLS1jbG9zZScpO1xyXG4gICAgfSwgMTUwKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEhlYWRlcigpO1xyXG4iLCJjbGFzcyBIZXJvIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuaGVybycsXHJcbiAgICAgIHRyaWdnZXI6ICcuaGVyb19fcGxheUJ1dHRvbiwgLmhlcm9fX2N0YS0tdmlkZW8nLFxyXG4gICAgICBpZnJhbWU6ICcuaGVybyAuaGVyb19fdmlkZW8nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnRyaWdnZXIsIHRoaXMuaGFuZGxlQ2xpY2spO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2xpY2soZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0IHZpZGVvSWQgPSB0aGlzLmdldFZpZGVvSUQoZS50YXJnZXQuaHJlZik7XHJcbiAgICAkKHRoaXMuc2VsLmlmcmFtZSkuYXR0cignc3JjJywgJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLycgKyB2aWRlb0lkICsgJz9yZWw9MCZhbXA7c2hvd2luZm89MCZhbXA7YXV0b3BsYXk9MScpLmFkZENsYXNzKCdoZXJvX192aWRlby0tb3BlbicpO1xyXG4gIH1cclxuXHJcbiAgZ2V0VmlkZW9JRCh5dFVybCkge1xyXG4gICAgbGV0IGlkID0gJyc7XHJcbiAgICBsZXQgdXJsID0geXRVcmwucmVwbGFjZSgvKD58PCkvZ2ksICcnKS5zcGxpdCgvKHZpXFwvfHY9fFxcL3ZcXC98eW91dHVcXC5iZVxcL3xcXC9lbWJlZFxcLykvKTtcclxuICAgIGlmICh1cmxbMl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZCA9IHVybFsyXS5zcGxpdCgvW14wLTlhLXpfXFwtXS9pKTtcclxuICAgICAgaWQgPSBpZFswXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlkID0gdXJsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlkO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgSGVybygpO1xyXG4iLCJjbGFzcyBJRURldGVjdG9yIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICdib2R5J1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZGV0ZWN0SUUgPSB0aGlzLmRldGVjdElFLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdmFyIHZlcnNpb24gPSB0aGlzLmRldGVjdElFKCk7XHJcbiAgICBpZiAodmVyc2lvbiAhPT0gZmFsc2UpIHtcclxuICAgICAgaWYgKHZlcnNpb24gPj0gMTIpIHtcclxuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2llLWVkZ2UnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoYGllLSR7dmVyc2lvbn1gKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBkZXRlY3RJRSgpIHtcclxuICAgIHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xyXG4gICAgLy8gVGVzdCB2YWx1ZXM7IFVuY29tbWVudCB0byBjaGVjayByZXN1bHQg4oCmXHJcbiAgICAvLyBJRSAxMFxyXG4gICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKGNvbXBhdGlibGU7IE1TSUUgMTAuMDsgV2luZG93cyBOVCA2LjI7IFRyaWRlbnQvNi4wKSc7XHJcbiAgICAvLyBJRSAxMVxyXG4gICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgNi4zOyBUcmlkZW50LzcuMDsgcnY6MTEuMCkgbGlrZSBHZWNrbyc7ICAgIC8vIEVkZ2UgMTIgKFNwYXJ0YW4pXHJcbiAgICAvLyB1YSA9ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXT1c2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzM5LjAuMjE3MS43MSBTYWZhcmkvNTM3LjM2IEVkZ2UvMTIuMCcgICAgLy8gRWRnZSAxM1xyXG4gICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzQ2LjAuMjQ4Ni4wIFNhZmFyaS81MzcuMzYgRWRnZS8xMy4xMDU4Nic7XHJcbiAgICB2YXIgbXNpZSA9IHVhLmluZGV4T2YoJ01TSUUgJyk7XHJcbiAgICBpZiAobXNpZSA+IDApIHtcclxuICAgICAgLy8gSUUgMTAgb3Igb2xkZXIgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcbiAgICAgIHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcobXNpZSArIDUsIHVhLmluZGV4T2YoJy4nLCBtc2llKSksIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdHJpZGVudCA9IHVhLmluZGV4T2YoJ1RyaWRlbnQvJyk7XHJcbiAgICBpZiAodHJpZGVudCA+IDApIHtcclxuICAgICAgLy8gSUUgMTEgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcbiAgICAgIHZhciBydiA9IHVhLmluZGV4T2YoJ3J2OicpO1xyXG4gICAgICByZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKHJ2ICsgMywgdWEuaW5kZXhPZignLicsIHJ2KSksIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZWRnZSA9IHVhLmluZGV4T2YoJ0VkZ2UvJyk7XHJcbiAgICBpZiAoZWRnZSA+IDApIHtcclxuICAgICAgLy8gRWRnZSAoSUUgMTIrKSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcclxuICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhlZGdlICsgNSwgdWEuaW5kZXhPZignLicsIGVkZ2UpKSwgMTApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG90aGVyIGJyb3dzZXJcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBJRURldGVjdG9yKCk7XHJcbiIsImNsYXNzIExhbmRpbmdQb2ludHMge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5sYW5kaW5ncG9pbnRzJyxcclxuICAgICAgbGFuZGluZ1BvaW50SXRlbTogJy5sYW5kaW5ncG9pbnRzIC5sYW5kaW5ncG9pbnQnLFxyXG4gICAgICBjbGlja2FibGVUaXRsZTogJy5sYW5kaW5ncG9pbnRzIC5sYW5kaW5ncG9pbnRfX3RpdGxlIGEnXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5jbGlja2FibGVUaXRsZSwgKGV2dCkgPT4ge1xyXG4gICAgICB2YXIgY29udGFpbmVyID0gJChldnQuY3VycmVudFRhcmdldCkuY2xvc2VzdCh0aGlzLnNlbC5sYW5kaW5nUG9pbnRJdGVtKTtcclxuICAgICAgaWYgKGNvbnRhaW5lci5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgY29udGFpbmVyLmZpbmQoJy5sYW5kaW5ncG9pbnRfX2NvbnRlbnQnKS5jc3MoeyBoZWlnaHQ6IDAgfSk7XHJcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJChldnQuY3VycmVudFRhcmdldCkuY2xvc2VzdCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJy5sYW5kaW5ncG9pbnQub3BlbiAubGFuZGluZ3BvaW50X19jb250ZW50JykuY3NzKHsgaGVpZ2h0OiAwIH0pO1xyXG4gICAgICAgICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcubGFuZGluZ3BvaW50JykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICBjb250YWluZXIuYWRkQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICBjb250YWluZXIuZmluZCgnLmxhbmRpbmdwb2ludF9fY29udGVudCcpLmNzcyh7IGhlaWdodDogY29udGFpbmVyLmZpbmQoJy5sYW5kaW5ncG9pbnRfX2NvbnRlbnQgcCcpLm91dGVySGVpZ2h0KCkgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IExhbmRpbmdQb2ludHMoKTtcclxuXHJcbiIsImNsYXNzIExvZ2luRm9ybSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNvbmZpZyA9IHtcclxuICAgICAgLy8gZmJBcHBJZDogJzEwMDA3NzMxNjMzMzc3OTgnLFxyXG4gICAgICBmYkFwcElkOiAnMTA4MDAzMTMyODgwMTIxMScsXHJcbiAgICAgIC8vIGdvQ2xpZW50SWQ6ICc5MTM5NjAzNTIyMzYtdTd1bjBsMjJ0dmttbGJwYTViY25mMXVxZzRjc2k3ZTMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nLFxyXG4gICAgICBnb0NsaWVudElkOiAnMzEzNDY5ODM3NDIwLWw4ODJoMzlnZThuOG45cGI5N2xkdmprM2ZtOHBwcWdzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJyxcclxuXHJcbiAgICAgIHVybFRva2VuOiAnL2xpYnMvZ3Jhbml0ZS9jc3JmL3Rva2VuLmpzb24nLFxyXG4gICAgICB1cmxMb2dpbjogJy9iaW4vZGhsL2xvZ2luL2luZGV4Lmpzb24nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcucGFnZS1ib2R5LmxvZ2luIGZvcm0uZm9ybXMnLFxyXG4gICAgICBidXR0b25GYWNlYm9vazogJy5mb3Jtc19fY3RhLS1zb2NpYWwuZmInLFxyXG4gICAgICBidXR0b25MaW5rZWRpbjogJy5mb3Jtc19fY3RhLS1zb2NpYWwubGknLFxyXG4gICAgICBidXR0b25Hb29nbGVQbHVzOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5nbydcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnRyeUxvZ2luRmFjZWJvb2sgPSB0aGlzLnRyeUxvZ2luRmFjZWJvb2suYmluZCh0aGlzKTtcclxuICAgIHRoaXMudHJ5TG9naW5MaW5rZWRpbiA9IHRoaXMudHJ5TG9naW5MaW5rZWRpbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50cnlMb2dpbkdvb2dsZSA9IHRoaXMudHJ5TG9naW5Hb29nbGUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMudHJ5TG9naW4gPSB0aGlzLnRyeUxvZ2luLmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5leGVjdXRlTG9naW4gPSB0aGlzLmV4ZWN1dGVMb2dpbi5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMubG9nZ2VkSW4gPSB0aGlzLmxvZ2dlZEluLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJsb2dnZWRpbi5ESEwnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubG9nZ2VkSW4oKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGpRdWVyeS52YWxpZGF0b3IuYWRkTWV0aG9kKCdwYXNzd29yZCcsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cCgkKGVsZW1lbnQpLmF0dHIoJ3BhdHRlcm4nKSkudGVzdCh2YWx1ZSk7XHJcbiAgICB9LCAnUGFzc3dvcmQgZm9ybWF0IGlzIG5vdCB2YWxpZCcpO1xyXG5cclxuICAgIGpRdWVyeS52YWxpZGF0b3IuYWRkTWV0aG9kKCdlcXVhbFRvJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgIHJldHVybiAoJCgnIycgKyAkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtZXF1YWxUbycpKS52YWwoKSA9PT0gJChlbGVtZW50KS52YWwoKSk7XHJcbiAgICB9LCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpO1xyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykubGVuZ3RoID4gMCkge1xyXG4gICAgICB3aW5kb3cuZmJBc3luY0luaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LmZiX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LkZCKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LkZCICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5GQi5pbml0KHtcclxuICAgICAgICAgICAgICBhcHBJZDogdGhpcy5jb25maWcuZmJBcHBJZCxcclxuICAgICAgICAgICAgICBjb29raWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgeGZibWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmVyc2lvbjogJ3YyLjgnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZmJfaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhY2Vib29rLWpzc2RrJykgPT09IG51bGwpIHtcclxuICAgICAgICB2YXIgZmpzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xyXG4gICAgICAgIHZhciBqcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIGpzLmlkID0gJ2ZhY2Vib29rLWpzc2RrJztcclxuICAgICAgICBqcy5zcmMgPSAnLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9FTi9zZGsuanMnO1xyXG4gICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuICAgICAgfVxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIHRoaXMudHJ5TG9naW5GYWNlYm9vayhldnQpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgdGhpcy50cnlMb2dpbkxpbmtlZGluKGV2dCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZ29vZ2xlQnV0dG9uID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cyk7XHJcbiAgICBpZiAoZ29vZ2xlQnV0dG9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgd2luZG93LmdvX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5nYXBpKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmdhcGkgIT09IG51bGwpIHtcclxuICAgICAgICAgIHdpbmRvdy5nYXBpLmxvYWQoJ2F1dGgyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgYXV0aDIgPSB3aW5kb3cuZ2FwaS5hdXRoMi5pbml0KHtcclxuICAgICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY29uZmlnLmdvQ2xpZW50SWQsXHJcbiAgICAgICAgICAgICAgY29va2llcG9saWN5OiAnc2luZ2xlX2hvc3Rfb3JpZ2luJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZ29vZ2xlQnV0dG9uLmdldCgwKTtcclxuICAgICAgICAgICAgYXV0aDIuYXR0YWNoQ2xpY2tIYW5kbGVyKGVsZW1lbnQsIHt9LFxyXG4gICAgICAgICAgICAgIChnb29nbGVVc2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyeUxvZ2luR29vZ2xlKGdvb2dsZVVzZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvciAhPT0gJ3BvcHVwX2Nsb3NlZF9ieV91c2VyJykge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydChyZXN1bHQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmdvX2ludGVydmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkudmFsaWRhdGUoe1xyXG4gICAgICBydWxlczoge1xyXG4gICAgICAgIGxvZ2luX19lbWFpbDogJ2VtYWlsJyxcclxuICAgICAgICBsb2dpbl9fcGFzc3dvcmQ6ICdwYXNzd29yZCdcclxuICAgICAgfSxcclxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XHJcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgc3VibWl0SGFuZGxlcjogKGZvcm0pID0+IHtcclxuICAgICAgICB0aGlzLnRyeUxvZ2luKGZvcm0pO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0cnlMb2dpbkZhY2Vib29rKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgd2luZG93LkZCLmxvZ2luKChsb2dpblJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGlmIChsb2dpblJlc3BvbnNlLmF1dGhSZXNwb25zZSkge1xyXG4gICAgICAgIHdpbmRvdy5GQi5hcGkoJy9tZScsIChkYXRhUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogZGF0YVJlc3BvbnNlLmVtYWlsLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogZGF0YVJlc3BvbnNlLmlkXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHRoaXMuZXhlY3V0ZUxvZ2luKGRhdGEsICgpID0+IHtcclxuICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLnRleHQoJ0ZhY2Vib29rJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LCB7IGZpZWxkczogWyAnaWQnLCAnZW1haWwnIF19KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LCB7IHNjb3BlOiAnZW1haWwscHVibGljX3Byb2ZpbGUnLCByZXR1cm5fc2NvcGVzOiB0cnVlIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJ5TG9naW5MaW5rZWRpbihldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG5cclxuICAgIElOLlVzZXIuYXV0aG9yaXplKCgpID0+IHtcclxuICAgICAgSU4uQVBJLlByb2ZpbGUoJ21lJykuZmllbGRzKCdpZCcsICdmaXJzdC1uYW1lJywgJ2xhc3QtbmFtZScsICdlbWFpbC1hZGRyZXNzJykucmVzdWx0KChyZXN1bHQpID0+IHtcclxuICAgICAgICB2YXIgbWVtYmVyID0gcmVzdWx0LnZhbHVlc1swXTtcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICB1c2VybmFtZTogbWVtYmVyLmVtYWlsQWRkcmVzcyxcclxuICAgICAgICAgIHBhc3N3b3JkOiBtZW1iZXIuaWRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGVMb2dpbihkYXRhLCAoKSA9PiB7XHJcbiAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikudGV4dCgnTGlua2VkSW4nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cuSU4uVXNlci5pc0F1dGhvcml6ZWQoKTtcclxuICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICB2YXIgbWVtYmVyID0gcmVzdWx0LnZhbHVlc1swXTtcclxuICBcclxuICAgICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogbWVtYmVyLmVtYWlsQWRkcmVzcyxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IG1lbWJlci5pZFxyXG4gICAgICAgICAgfTtcclxuICBcclxuICAgICAgICAgIHRoaXMuZXhlY3V0ZUxvZ2luKGRhdGEsICgpID0+IHtcclxuICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLnRleHQoJ0xpbmtlZEluJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMCk7XHJcblxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHRyeUxvZ2luR29vZ2xlKGdvb2dsZVVzZXIpIHtcclxuICAgIHZhciBkYXRhID0ge1xyXG4gICAgICB1c2VybmFtZTogZ29vZ2xlVXNlci5nZXRCYXNpY1Byb2ZpbGUoKS5nZXRFbWFpbCgpLFxyXG4gICAgICBwYXNzd29yZDogZ29vZ2xlVXNlci5nZXRCYXNpY1Byb2ZpbGUoKS5nZXRJZCgpXHJcbiAgICB9O1xyXG5cclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICB0aGlzLmV4ZWN1dGVMb2dpbihkYXRhLCAoKSA9PiB7XHJcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpLnRleHQoJ0dvb2dsZSsnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJ5TG9naW4oZm9ybSkge1xyXG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XHJcbiAgICB2YXIgdXNlcm5hbWUgPSBmcm0uZmluZCgnaW5wdXQjbG9naW5fX2VtYWlsJykudmFsKCk7XHJcbiAgICB2YXIgcGFzc3dvcmQgPSBmcm0uZmluZCgnaW5wdXQjbG9naW5fX3Bhc3N3b3JkJykudmFsKCk7XHJcblxyXG4gICAgaWYgKCgkLnRyaW0odXNlcm5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShwYXNzd29yZCkubGVuZ3RoID09PSAwKSkge1xyXG4gICAgICBhbGVydCgnUGxlYXNlIGVudGVyIHlvdXIgZW1haWwgYWRkcmVzcyBhbmQgcGFzc3dvcmQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgICB0aGlzLmV4ZWN1dGVMb2dpbih7IHVzZXJuYW1lOiB1c2VybmFtZSwgcGFzc3dvcmQ6IHBhc3N3b3JkIH0sICgpID0+IHtcclxuICAgICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdMb2cgSW4nKTtcclxuICAgICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdMb2dpbicpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBleGVjdXRlTG9naW4oZGF0YSwgdW53YWl0Q2FsbGJhY2spIHtcclxuICAgICQuZ2V0KHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuXHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiB0aGlzLmNvbmZpZy51cmxMb2dpbixcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHJlc3BvbnNlLCB0cnVlIF0pO1xyXG5cclxuICAgICAgICAgICAgICB2YXIgYmFja1VybCA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5kYXRhKCdiYWNrJyk7XHJcbiAgICAgICAgICAgICAgaWYgKCQudHJpbShiYWNrVXJsKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGJhY2tVcmwgPSAnL2NvbnRlbnQvZGhsLmh0bWwnO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBiYWNrVXJsO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHJlZ2lzdGVyLlxcbicgKyByZXNwb25zZS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVnaXN0ZXIuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB1bndhaXRDYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGxvZ2dlZEluKCkge1xyXG4gICAgd2luZG93LmxvY2F0aW9uID0gJy9jb250ZW50L2RobC95b3VyLWFjY291bnQuaHRtbCc7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgTG9naW5Gb3JtKCk7XHJcbiIsImltcG9ydCBUb2FzdCBmcm9tICcuL1RvYXN0JztcclxuaW1wb3J0IERhdGFiYXNlIGZyb20gJy4vRGF0YWJhc2UnO1xyXG5cclxuY2xhc3MgU2F2ZUZvck9mZmxpbmUge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5oZXJvX19zYXZlRm9yT2ZmbGluZSdcclxuICAgIH07XHJcbiAgICAvLyBDcmVhdGUgYXJ0aWNsZSBjYWNoZSBuYW1lXHJcbiAgICB0aGlzLmFydGljbGVDYWNoZU5hbWUgPSAnb2ZmbGluZS0nICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZG9TYXZlID0gdGhpcy5kb1NhdmUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZG9VbnNhdmUgPSB0aGlzLmRvVW5zYXZlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0SGVyb0ltYWdlcyA9IHRoaXMuZ2V0SGVyb0ltYWdlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pc0N1cnJlbnRQYWdlU2F2ZWQgPSB0aGlzLmlzQ3VycmVudFBhZ2VTYXZlZC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNvbXBvbmVudCwgdGhpcy5oYW5kbGVDbGljayk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDbGljayhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmhhc0NsYXNzKCdoZXJvX19zYXZlRm9yT2ZmbGluZS0tc2F2ZWQnKSkge1xyXG4gICAgICB0aGlzLmRvVW5zYXZlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRvU2F2ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNDdXJyZW50UGFnZVNhdmVkKCkge1xyXG4gICAgLy8gQ2hlY2sgaWYgYWxyZWFkeSBzYXZlZFxyXG4gICAgY2FjaGVzLmtleXMoKS50aGVuKChjYWNoZU5hbWVzKSA9PiB7IC8vIEdldCBhcnJheSBvZiBjYWNoZSBuYW1lc1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgY2FjaGVOYW1lcy5maWx0ZXIoKGNhY2hlTmFtZSkgPT4geyAvLyBGaWx0ZXIgYXJyYXlcclxuICAgICAgICAgIHJldHVybiAoY2FjaGVOYW1lID09PSB0aGlzLmFydGljbGVDYWNoZU5hbWUpOyAvLyBJZiBtYXRjaGVzIGN1cnJlbnQgcGF0aG5hbWVcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSkudGhlbigoY2FjaGVOYW1lcykgPT4geyAvLyBPbmNlIGdvdCBmaWx0ZXJlZCBhcnJheVxyXG4gICAgICBpZiAoY2FjaGVOYW1lcy5sZW5ndGggPiAwKSB7IC8vIElmIHRoZXJlIGFyZSBjYWNoZXNcclxuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2hlcm9fX3NhdmVGb3JPZmZsaW5lLS1zYXZlZCcpLmF0dHIoJ3RpdGxlJywgJ0FydGljbGUgU2F2ZWQnKS5maW5kKCdzcGFuJykudGV4dCgnQXJ0aWNsZSBTYXZlZCcpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEhlcm9JbWFnZXMoKSB7XHJcbiAgICAvLyBHZXQgdGhlIGhlcm8gaW1hZ2UgZWxlbWVudFxyXG4gICAgbGV0ICRoZXJvSW1hZ2UgPSAkKCcuaGVyb19faW1hZ2UnKTtcclxuICAgIC8vIElmIGl0IGV4aXN0c1xyXG4gICAgaWYgKCRoZXJvSW1hZ2UubGVuZ3RoID4gMCkge1xyXG4gICAgICAvLyBDcmVhdGUgYXJyYXkgZm9yIGltYWdlc1xyXG4gICAgICBsZXQgaW1hZ2VzID0gW107XHJcbiAgICAgIC8vIEFkZCB0aGUgbW9iaWxlIGltYWdlIFVSTFxyXG4gICAgICBpbWFnZXMucHVzaChcclxuICAgICAgICAkaGVyb0ltYWdlLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KCd1cmwoJylbMV0uc3BsaXQoJyknKVswXS5yZXBsYWNlKC9cIi9nLCAnJykucmVwbGFjZSgvJy9nLCAnJylcclxuICAgICAgKTtcclxuICAgICAgLy8gR2V0IHRoZSBkZXNrdG9wIGltYWdlIFVSTFxyXG4gICAgICBsZXQgZGVza3RvcFN0eWxlcyA9ICRoZXJvSW1hZ2UucGFyZW50cygnLmhlcm8nKS5maW5kKCdzdHlsZScpLmh0bWwoKS5zcGxpdCgndXJsKCcpWzFdLnNwbGl0KCcpJylbMF0ucmVwbGFjZSgvXCIvZywgJycpLnJlcGxhY2UoLycvZywgJycpO1xyXG4gICAgICAvLyBBZGQgdGhlIGRlc2t0b3AgaW1hZ2UgdG8gdGhlIGFycmF5XHJcbiAgICAgIGltYWdlcy5wdXNoKGRlc2t0b3BTdHlsZXMpO1xyXG4gICAgICAvLyBSZXR1cm4gdGhlIGltYWdlc1xyXG4gICAgICByZXR1cm4gaW1hZ2VzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZG9VbnNhdmUocGF0aE5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpIHtcclxuICAgIGxldCB0b2FzdCA9IG5ldyBUb2FzdCgnQXJ0aWNsZSBoYXMgYmVlbiByZW1vdmVkJywgMzAwMCk7XHJcbiAgICAvLyBSZW1vdmUgYXJ0aWNsZSBmcm9tIElEQlxyXG4gICAgcmV0dXJuIERhdGFiYXNlLmRlbGV0ZUFydGljbGUocGF0aE5hbWUpLnRoZW4oKCkgPT4gey8vIERlbGV0ZWQgZnJvbSBJREIgc3VjY2Vzc2Z1bGx5XHJcbiAgICAgIC8vIFJlbW92ZSBhcnRpY2xlIGNvbnRlbnRcclxuICAgICAgY2FjaGVzLmRlbGV0ZSgnb2ZmbGluZS0nICsgcGF0aE5hbWUpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5yZW1vdmVDbGFzcygnaGVyb19fc2F2ZUZvck9mZmxpbmUtLXNhdmVkJykuYXR0cigndGl0bGUnLCAnU2F2ZSBBcnRpY2xlJykuZmluZCgnc3BhbicpLnRleHQoJ1NhdmUgQXJ0aWNsZScpO1xyXG4gICAgICAgIHRvYXN0LnNob3coKTtcclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaCgoKSA9PiB7Ly8gVGhlcmUgd2FzIGFuIGVycm9yIGRlbGV0aW5nIGZyb20gSURCXHJcbiAgICAgIHRvYXN0LnNldFRleHQoJ1RoZXJlIHdhcyBhIHByb2JsZW0gZGVsZXRpbmcgdGhlIGFydGljbGUnKTtcclxuICAgICAgdG9hc3Quc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkb1NhdmUoKSB7XHJcbiAgICAvLyBDcmVhdGUgdG9hc3QgZm9yIGNvbmZpcm1hdGlvblxyXG4gICAgbGV0IHRvYXN0ID0gbmV3IFRvYXN0KCdBcnRpY2xlIGlzIG5vdyBhdmFpbGFibGUgb2ZmbGluZScsIDMwMDApO1xyXG5cclxuICAgIGlmICgkKCcjYXJ0aWNsZURhdGEnKS5sZW5ndGggPD0gMCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnU1cgRVJST1I6IE9mZmxpbmUuanM6OTAnKTtcclxuICAgICAgdG9hc3Quc2V0VGV4dCgnQXJ0aWNsZSBjb3VsZCBub3QgYmUgc2F2ZWQgZm9yIG9mZmxpbmUnKTtcclxuICAgICAgdG9hc3Quc2hvdygpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvLyBHZXQgcGFnZSBkYXRhIGZvciBJREJcclxuICAgIGxldCBwYWdlRGF0YSA9IEpTT04ucGFyc2UoJCgnI2FydGljbGVEYXRhJykuaHRtbCgpKTtcclxuXHJcbiAgICAvLyBBZGQgYXJ0aWNsZSB0byBJREJcclxuICAgIERhdGFiYXNlLmFkZEFydGljbGUoXHJcbiAgICAgIHBhZ2VEYXRhLnRpdGxlLFxyXG4gICAgICB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXHJcbiAgICAgIHBhZ2VEYXRhLmRlc2NyaXB0aW9uLFxyXG4gICAgICBwYWdlRGF0YS5jYXRlZ29yeU5hbWUsXHJcbiAgICAgIHBhZ2VEYXRhLmNhdGVnb3J5TGluayxcclxuICAgICAgcGFnZURhdGEudGltZVRvUmVhZCxcclxuICAgICAgcGFnZURhdGEuaW1hZ2VNb2JpbGUsXHJcbiAgICAgIHBhZ2VEYXRhLmltYWdlRGVza3RvcCxcclxuICAgICAgcGFnZURhdGEuaXNMYXJnZSxcclxuICAgICAgcGFnZURhdGEuaXNWaWRlbyxcclxuICAgICAgdGhpcy5hcnRpY2xlQ2FjaGVOYW1lXHJcbiAgICApLnRoZW4oKCkgPT4gey8vIFNhdmVkIGluIElEQiBzdWNjZXNzZnVsbHlcclxuICAgICAgLy8gQnVpbGQgYW4gYXJyYXkgb2YgdGhlIHBhZ2Utc3BlY2lmaWMgcmVzb3VyY2VzLlxyXG4gICAgICBsZXQgcGFnZVJlc291cmNlcyA9IFt3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsIHBhZ2VEYXRhLmltYWdlTW9iaWxlLCBwYWdlRGF0YS5pbWFnZURlc2t0b3BdO1xyXG5cclxuICAgICAgLy8gQWRkIHRoZSBoZXJvIGltYWdlc1xyXG4gICAgICBpZiAoJCgnLmhlcm9fX2ltYWdlJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGxldCBoZXJvSW1hZ2VzID0gdGhpcy5nZXRIZXJvSW1hZ2VzKCk7XHJcbiAgICAgICAgaWYgKGhlcm9JbWFnZXMpIHBhZ2VSZXNvdXJjZXMgPSBwYWdlUmVzb3VyY2VzLmNvbmNhdChoZXJvSW1hZ2VzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQWRkIGltYWdlcyB0byB0aGUgYXJyYXlcclxuICAgICAgJCgnLnBhZ2UtYm9keSAud3lzaXd5ZyBpbWcsIC5hdXRob3JQYW5lbCBpbWcnKS5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIC8vIFRyaW0gd2hpdGVzcGFjZSBmb3JtIHNyY1xyXG4gICAgICAgIGxldCBpbWdTcmMgPSAkLnRyaW0oJChlbGVtZW50KS5hdHRyKCdzcmMnKSk7XHJcbiAgICAgICAgLy8gSWYgZW1wdHkgc3JjIHNraXAgdGhpcyBpbWFnZVxyXG4gICAgICAgIGlmICghKGltZ1NyYyA9PT0gJycpKSB7XHJcbiAgICAgICAgICAvLyBBZGQgdG8gcGFnZSByZXNvdXJjZXNcclxuICAgICAgICAgIHBhZ2VSZXNvdXJjZXMucHVzaCgkKGVsZW1lbnQpLmF0dHIoJ3NyYycpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gT3BlbiB0aGUgdW5pcXVlIGNhY2hlIGZvciB0aGlzIFVSTFxyXG4gICAgICBjYWNoZXMub3Blbih0aGlzLmFydGljbGVDYWNoZU5hbWUpLnRoZW4oKGNhY2hlKSA9PiB7XHJcbiAgICAgICAgLy8gVW5pcXVlIFVSTHNcclxuICAgICAgICBsZXQgdW5pcXVlUmVzb3VyY2VzID0gW107XHJcbiAgICAgICAgLy8gQ3JlYXRlIGFuY2hvciBlbGVtZW50IHRvIGdldCBmdWxsIFVSTHNcclxuICAgICAgICBsZXQgYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgIC8vIERlZHVwZSBhc3NldHNcclxuICAgICAgICAkLmVhY2gocGFnZVJlc291cmNlcywgKGksIGVsKSA9PiB7XHJcbiAgICAgICAgICAvLyBMb2FkIHRoZSBjdXJyZW50IFVSTCBpbnRvIHRoZSBhbmNob3JcclxuICAgICAgICAgIGFuY2hvci5ocmVmID0gZWw7XHJcbiAgICAgICAgICAvLyBPbmx5IGNhY2hlIFVSTHMgb24gb3VyIGRvbWFpblxyXG4gICAgICAgICAgaWYgKGFuY2hvci5ob3N0ICE9PSB3aW5kb3cubG9jYXRpb24uaG9zdCkgcmV0dXJuO1xyXG4gICAgICAgICAgLy8gR2V0IHRoZSByZWxhdGl2ZSBwYXRoXHJcbiAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBhbmNob3IucGF0aG5hbWUgKyBhbmNob3Iuc2VhcmNoO1xyXG4gICAgICAgICAgLy8gSWYgYWxyZWFkeSBpbiBsaXN0IG9mIGFzc2V0cywgZG9uJ3QgaW5jbHVkZSBpdCBhZ2FpblxyXG4gICAgICAgICAgaWYgKCQuaW5BcnJheShyZWxhdGl2ZSwgdW5pcXVlUmVzb3VyY2VzKSA9PT0gLTEpIHVuaXF1ZVJlc291cmNlcy5wdXNoKHJlbGF0aXZlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBDYWNoZSBhbGwgcmVxdWlyZWQgYXNzZXRzXHJcbiAgICAgICAgbGV0IHVwZGF0ZUNhY2hlID0gY2FjaGUuYWRkQWxsKHVuaXF1ZVJlc291cmNlcyk7XHJcbiAgICAgICAgLy8gVXBkYXRlIFVJIHRvIGluZGljYXRlIHN1Y2Nlc3NcclxuICAgICAgICAvLyBPciBjYXRjaCBhbnkgZXJyb3JzIGlmIGl0IGRvZXNuJ3Qgc3VjY2VlZFxyXG4gICAgICAgIHVwZGF0ZUNhY2hlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ0FydGljbGUgaXMgbm93IGF2YWlsYWJsZSBvZmZsaW5lLicpO1xyXG4gICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdoZXJvX19zYXZlRm9yT2ZmbGluZS0tc2F2ZWQnKS5hdHRyKCd0aXRsZScsICdTYXZlZCBmb3Igb2ZmbGluZScpLmZpbmQoJ3NwYW4nKS50ZXh0KCdBcnRpY2xlIFNhdmVkJyk7XHJcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdBcnRpY2xlIGNvdWxkIG5vdCBiZSBzYXZlZCBmb3Igb2ZmbGluZS4nLCBlcnJvcik7XHJcbiAgICAgICAgICB0b2FzdC5zZXRUZXh0KCdBcnRpY2xlIGNvdWxkIG5vdCBiZSBzYXZlZCBmb3Igb2ZmbGluZScpO1xyXG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdG9hc3Quc2hvdygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pLmNhdGNoKChlcnJvcikgPT4gey8vIFRoZXJlIHdhcyBhbiBlcnJvciBzYXZpbmcgdG8gSURCXHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICB0b2FzdC5zZXRUZXh0KCdBcnRpY2xlIGNvdWxkIG5vdCBiZSBzYXZlZCBmb3Igb2ZmbGluZScpO1xyXG4gICAgICB0b2FzdC5zaG93KCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuaXNDdXJyZW50UGFnZVNhdmVkKCk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgT2ZmbGluZUFydGljbGVzIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuYXJ0aWNsZUdyaWQtLXNhdmVkJyxcclxuICAgICAgZ3JpZDogJy5hcnRpY2xlR3JpZC0tc2F2ZWQgLmFydGljbGVHcmlkX19ncmlkJyxcclxuICAgICAgdGl0bGU6ICcuYXJ0aWNsZUdyaWQtLXNhdmVkIC5hcnRpY2xlR3JpZF9fdGl0bGUnLFxyXG4gICAgICB0ZW1wbGF0ZTogJyNhcnRpY2xlR3JpZF9fcGFuZWxUZW1wbGF0ZScsXHJcbiAgICAgIGVkaXRTYXZlZEFydGljbGVzOiAnLmhlcm9fX2VkaXRTYXZlZEFydGljbGVzJyxcclxuICAgICAgYXJ0aWNsZXM6ICcuYXJ0aWNsZUdyaWQtLXNhdmVkIC5hcnRpY2xlR3JpZF9fZ3JpZCAuYXJ0aWNsZVBhbmVsJyxcclxuICAgICAgZGVsZXRhYmxlQXJ0aWNsZTogJy5hcnRpY2xlR3JpZC0tc2F2ZWQgLmFydGljbGVHcmlkX19ncmlkIC5hcnRpY2xlUGFuZWwtLWRlbGV0YWJsZSdcclxuICAgIH07XHJcbiAgICB0aGlzLnNhdmVGb3JPZmZsaW5lID0gbmV3IFNhdmVGb3JPZmZsaW5lKCk7XHJcbiAgICB0aGlzLnRlbXBsYXRlID0gJCgkKHRoaXMuc2VsLnRlbXBsYXRlKS5odG1sKCkpO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5sb2FkQXJ0aWNsZXMgPSB0aGlzLmxvYWRBcnRpY2xlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5wb3B1bGF0ZVRlbXBsYXRlcyA9IHRoaXMucG9wdWxhdGVUZW1wbGF0ZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oYW5kbGVFZGl0ID0gdGhpcy5oYW5kbGVFZGl0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmRlbGV0ZUFydGljbGUgPSB0aGlzLmRlbGV0ZUFydGljbGUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaGFuZGxlU3dpcGUgPSB0aGlzLmhhbmRsZVN3aXBlLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBsb2FkQXJ0aWNsZXMoKSB7XHJcbiAgICByZXR1cm4gRGF0YWJhc2UuZ2V0QXJ0aWNsZXMoKS50aGVuKChhcnRpY2xlcykgPT4ge1xyXG4gICAgICBsZXQgaXRlbXMgPSBbXTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnRpY2xlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBhcnRpY2xlID0gYXJ0aWNsZXNbaV07XHJcbiAgICAgICAgaXRlbXMucHVzaCh7XHJcbiAgICAgICAgICBMaW5rOiBhcnRpY2xlLmxpbmssXHJcbiAgICAgICAgICBUaXRsZTogYXJ0aWNsZS50aXRsZSxcclxuICAgICAgICAgIERlc2NyaXB0aW9uOiBhcnRpY2xlLmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgQ2F0ZWdvcnk6IHtcclxuICAgICAgICAgICAgTmFtZTogYXJ0aWNsZS5jYXRlZ29yeU5hbWUsXHJcbiAgICAgICAgICAgIExpbms6IGFydGljbGUuY2F0ZWdvcnlMaW5rXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgVGltZVRvUmVhZDogYXJ0aWNsZS50aW1lVG9SZWFkLFxyXG4gICAgICAgICAgSW1hZ2VzOiB7XHJcbiAgICAgICAgICAgIE1vYmlsZTogYXJ0aWNsZS5pbWFnZU1vYmlsZSxcclxuICAgICAgICAgICAgRGVza3RvcDogYXJ0aWNsZS5pbWFnZURlc2t0b3BcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBJc0xhcmdlOiBhcnRpY2xlLmlzTGFyZ2UsXHJcbiAgICAgICAgICBJc1ZpZGVvOiBhcnRpY2xlLmlzVmlkZW9cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICQodGhpcy5zZWwuZ3JpZCkuaHRtbCh0aGlzLnBvcHVsYXRlVGVtcGxhdGVzKGl0ZW1zKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCh0aGlzLnNlbC50aXRsZSkudGV4dCgnWW91IGhhdmUgbm8gc2F2ZWQgYXJ0aWNsZXMnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwb3B1bGF0ZVRlbXBsYXRlcyhpdGVtcykge1xyXG4gICAgbGV0IG91dHB1dCA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAvLyBDbG9uZSB0ZW1wbGF0ZVxyXG4gICAgICBsZXQgJHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZS5jbG9uZSgpO1xyXG4gICAgICAvLyBHZXQgdGhlIGl0ZW1cclxuICAgICAgbGV0IGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgLy8gU2V0IGltYWdlIGJyZWFrcG9pbnRcclxuICAgICAgbGV0IGRlc2t0b3BCcmVha3BvaW50ID0gOTkyO1xyXG4gICAgICAvLyBHZW5lcmF0ZSBJRFxyXG4gICAgICBsZXQgcGFuZWxJZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCA5KTtcclxuICAgICAgLy8gUG9wdWxhdGUgSURcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5hdHRyKCdpZCcsIHBhbmVsSWQpO1xyXG4gICAgICAvLyBJZiBsYXJnZSBwYW5lbFxyXG4gICAgICBpZiAoaXRlbS5Jc0xhcmdlKSB7XHJcbiAgICAgICAgLy8gVXBkYXRlIGltYWdlIGJyZWFrcG9pbnRcclxuICAgICAgICBkZXNrdG9wQnJlYWtwb2ludCA9IDc2ODtcclxuICAgICAgICAvLyBBZGQgY2xhc3NcclxuICAgICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbCcpLmFkZENsYXNzKCdhcnRpY2xlUGFuZWwtLWxhcmdlJyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gSWYgdmlkZW9cclxuICAgICAgaWYgKGl0ZW0uSXNWaWRlbykge1xyXG4gICAgICAgIC8vIEFkZCBjbGFzc1xyXG4gICAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsJykuYWRkQ2xhc3MoJ2FydGljbGVQYW5lbC0tdmlkZW8nKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBQb3B1bGF0ZSBpbWFnZXNcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2ltYWdlJykuYXR0cih7XHJcbiAgICAgICAgaHJlZjogaXRlbS5MaW5rLFxyXG4gICAgICAgIHRpdGxlOiBpdGVtLlRpdGxlXHJcbiAgICAgIH0pLmF0dHIoJ3N0eWxlJywgJ2JhY2tncm91bmQtaW1hZ2U6IHVybCgnICsgaXRlbS5JbWFnZXMuTW9iaWxlICsgJyk7Jyk7XHJcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCdzdHlsZScpWzBdLmlubmVySFRNTCA9ICdAbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAnICsgZGVza3RvcEJyZWFrcG9pbnQgKyAncHgpeyMnICsgcGFuZWxJZCArICcgLmFydGljbGVQYW5lbF9faW1hZ2V7YmFja2dyb3VuZC1pbWFnZTogdXJsKCcgKyBpdGVtLkltYWdlcy5EZXNrdG9wICsgJykgIWltcG9ydGFudDt9fSc7XHJcbiAgICAgIC8vIFBvcHVsYXRlIGxpbmtcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2NvbnRlbnQgPiBhJykuYXR0cih7XHJcbiAgICAgICAgaHJlZjogaXRlbS5MaW5rLFxyXG4gICAgICAgIHRpdGxlOiBpdGVtLlRpdGxlXHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBQb3B1bGF0ZSB0aXRsZVxyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fdGl0bGUnKS50ZXh0KGl0ZW0uVGl0bGUpO1xyXG4gICAgICAvLyBQb3B1bGF0ZSBkZXNjcmlwdGlvblxyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fZGVzY3JpcHRpb24nKS50ZXh0KGl0ZW0uRGVzY3JpcHRpb24pO1xyXG4gICAgICAvLyBQb3B1bGF0ZSBjYXRlZ29yeVxyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fc3ViVGl0bGUgYTpmaXJzdC1jaGlsZCcpLmF0dHIoe1xyXG4gICAgICAgICdocmVmJzogaXRlbS5DYXRlZ29yeS5MaW5rLFxyXG4gICAgICAgICd0aXRsZSc6IGl0ZW0uQ2F0ZWdvcnkuTmFtZVxyXG4gICAgICB9KS50ZXh0KGl0ZW0uQ2F0ZWdvcnkuTmFtZSk7XHJcbiAgICAgIC8vIFBvcHVsYXRlIHRpbWUgdG8gcmVhZFxyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fc3ViVGl0bGUgYTpsYXN0LWNoaWxkJykuYXR0cih7XHJcbiAgICAgICAgJ2hyZWYnOiBpdGVtLkxpbmssXHJcbiAgICAgICAgJ3RpdGxlJzogaXRlbS5UaXRsZVxyXG4gICAgICB9KS50ZXh0KGl0ZW0uVGltZVRvUmVhZCk7XHJcbiAgICAgIC8vIFB1c2ggaXRlbSB0byBvdXRwdXRcclxuICAgICAgb3V0cHV0LnB1c2goJHRlbXBsYXRlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuZWRpdFNhdmVkQXJ0aWNsZXMsIHRoaXMuaGFuZGxlRWRpdCk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5kZWxldGFibGVBcnRpY2xlLCB0aGlzLmRlbGV0ZUFydGljbGUpO1xyXG4gICAgJCh0aGlzLnNlbC5hcnRpY2xlcykuc3dpcGVkZXRlY3QodGhpcy5oYW5kbGVTd2lwZSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVFZGl0KGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICQodGhpcy5zZWwuZWRpdFNhdmVkQXJ0aWNsZXMpLnRvZ2dsZUNsYXNzKCdoZXJvX19lZGl0U2F2ZWRBcnRpY2xlcy0tZWRpdGluZycpO1xyXG4gICAgaWYgKCQodGhpcy5zZWwuZWRpdFNhdmVkQXJ0aWNsZXMpLmhhc0NsYXNzKCdoZXJvX19lZGl0U2F2ZWRBcnRpY2xlcy0tZWRpdGluZycpKSB7XHJcbiAgICAgICQodGhpcy5zZWwuZ3JpZCkuZmluZCgnLmFydGljbGVQYW5lbCcpLmFkZENsYXNzKCdhcnRpY2xlUGFuZWwtLWRlbGV0YWJsZScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCh0aGlzLnNlbC5ncmlkKS5maW5kKCcuYXJ0aWNsZVBhbmVsJykucmVtb3ZlQ2xhc3MoJ2FydGljbGVQYW5lbC0tZGVsZXRhYmxlJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkZWxldGVBcnRpY2xlKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCAkYXJ0aWNsZVBhbmVsID0gJChlLnRhcmdldCkucGFyZW50cygnLmFydGljbGVQYW5lbCcpO1xyXG4gICAgbGV0IHVybCA9IG5ldyBVUkwoJGFydGljbGVQYW5lbC5maW5kKCcuYXJ0aWNsZVBhbmVsX19pbWFnZScpWzBdLmhyZWYpO1xyXG4gICAgdGhpcy5zYXZlRm9yT2ZmbGluZS5kb1Vuc2F2ZSh1cmwucGF0aG5hbWUpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAkYXJ0aWNsZVBhbmVsLnBhcmVudCgpLnJlbW92ZSgpO1xyXG4gICAgICBpZiAoJCh0aGlzLnNlbC5ncmlkKS5maW5kKCcuYXJ0aWNsZVBhbmVsJykubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAkKHRoaXMuc2VsLmdyaWQpLmFwcGVuZCgnPGRpdiBjbGFzcz1cImNvbC0xMlwiPjxoMiBjbGFzcz1cImFydGljbGVHcmlkX190aXRsZVwiPllvdSBoYXZlIG5vIHNhdmVkIGFydGljbGVzPC9oMj48L2Rpdj4nKTtcclxuICAgICAgICB0aGlzLmhhbmRsZUVkaXQoe3ByZXZlbnREZWZhdWx0OiAoKSA9PiB7fX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZVN3aXBlKHN3aXBlZGlyLCBlbGVtZW50KSB7XHJcbiAgICAvLyBzd2lwZWRpciBjb250YWlucyBlaXRoZXIgXCJub25lXCIsIFwibGVmdFwiLCBcInJpZ2h0XCIsIFwidG9wXCIsIG9yIFwiZG93blwiXHJcbiAgICBsZXQgaXNEZWxldGFibGUgPSAkKGVsZW1lbnQpLmhhc0NsYXNzKCdhcnRpY2xlUGFuZWwtLWRlbGV0YWJsZScpO1xyXG4gICAgaWYgKHN3aXBlZGlyID09PSAnbGVmdCcgJiYgIWlzRGVsZXRhYmxlKSB7XHJcbiAgICAgICQoJy5hcnRpY2xlUGFuZWwuYXJ0aWNsZVBhbmVsLS1kZWxldGFibGUnKS5yZW1vdmVDbGFzcygnYXJ0aWNsZVBhbmVsLS1kZWxldGFibGUnKTtcclxuICAgICAgJChlbGVtZW50KS5hZGRDbGFzcygnYXJ0aWNsZVBhbmVsLS1kZWxldGFibGUnKTtcclxuICAgIH0gZWxzZSBpZiAoc3dpcGVkaXIgPT09ICdyaWdodCcgJiYgaXNEZWxldGFibGUpIHtcclxuICAgICAgJChlbGVtZW50KS5yZW1vdmVDbGFzcygnYXJ0aWNsZVBhbmVsLS1kZWxldGFibGUnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmxvYWRBcnRpY2xlcygpLnRoZW4oKCkgPT4ge1xyXG4gICAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBPZmZsaW5lIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2F2ZUZvck9mZmxpbmUgPSBuZXcgU2F2ZUZvck9mZmxpbmUoKTtcclxuICAgIHRoaXMub2ZmbGluZUFydGljbGVzID0gbmV3IE9mZmxpbmVBcnRpY2xlcygpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoZWNrU3RhdHVzID0gdGhpcy5jaGVja1N0YXR1cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kb09ubGluZSA9IHRoaXMuZG9PbmxpbmUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZG9PZmZsaW5lID0gdGhpcy5kb09mZmxpbmUuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGNoZWNrU3RhdHVzKCkge1xyXG4gICAgaWYgKG5hdmlnYXRvci5vbkxpbmUpIHtcclxuICAgICAgdGhpcy5kb09ubGluZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kb09mZmxpbmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRvT25saW5lKCkge1xyXG4gICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdvZmZsaW5lJyk7XHJcbiAgICAkKCcuZGlzYWJsZS1vZmZsaW5lW3RhYmluZGV4PVwiLTFcIl0sIC5kaXNhYmxlLW9mZmxpbmUgKlt0YWJpbmRleD1cIi0xXCJdJykucmVtb3ZlQXR0cigndGFiaW5kZXgnKTtcclxuICB9XHJcblxyXG4gIGRvT2ZmbGluZSgpIHtcclxuICAgICQoJ2JvZHknKS5hZGRDbGFzcygnb2ZmbGluZScpO1xyXG4gICAgJCgnLmRpc2FibGUtb2ZmbGluZSwgLmRpc2FibGUtb2ZmbGluZSAqJykuYXR0cigndGFiaW5kZXgnLCAnLTEnKTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy5kb09ubGluZSk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsIHRoaXMuZG9PZmZsaW5lKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoISgnb25MaW5lJyBpbiBuYXZpZ2F0b3IpKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLnNhdmVGb3JPZmZsaW5lLmluaXQoKTtcclxuICAgIHRoaXMub2ZmbGluZUFydGljbGVzLmluaXQoKTtcclxuICAgIHRoaXMuY2hlY2tTdGF0dXMoKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgT2ZmbGluZSgpO1xyXG4iLCJjbGFzcyBQYXNzd29yZCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLmZvcm1zX19wYXNzd29yZCcsXHJcbiAgICAgIHRvZ2dsZTogJy5mb3Jtc19fcGFzc3dvcmQgaW5wdXRbdHlwZT1jaGVja2JveF0nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnRvZ2dsZVBsYWluVGV4dCA9IHRoaXMudG9nZ2xlUGxhaW5UZXh0LmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgdGhpcy5zZWwudG9nZ2xlLCAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBwYXNzd29yZFRhcmdldCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtZmllbGQtaWQnKTtcclxuICAgICAgdGhpcy50b2dnbGVQbGFpblRleHQocGFzc3dvcmRUYXJnZXQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVQbGFpblRleHQoZmllbGRJZCkge1xyXG4gICAgY29uc3QgZmllbGQgPSAkKCcjJyArIGZpZWxkSWQpO1xyXG4gICAgc3dpdGNoIChmaWVsZC5hdHRyKCd0eXBlJykpIHtcclxuICAgIGNhc2UgJ3Bhc3N3b3JkJzpcclxuICAgICAgZmllbGQuYXR0cigndHlwZScsICd0ZXh0Jyk7XHJcbiAgICAgIGJyZWFrO1xyXG5cclxuICAgIGRlZmF1bHQ6XHJcbiAgICBjYXNlICd0ZXh0JzpcclxuICAgICAgZmllbGQuYXR0cigndHlwZScsICdwYXNzd29yZCcpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBQYXNzd29yZCgpO1xyXG4iLCJjbGFzcyBQYXNzd29yZFJlbWluZGVyRm9ybSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNvbmZpZyA9IHtcclxuICAgICAgdXJsVG9rZW46ICcvbGlicy9ncmFuaXRlL2NzcmYvdG9rZW4uanNvbicsXHJcbiAgICAgIHVybExvZ2luOiAnL2Jpbi9kaGwvbG9naW4vaW5kZXguanNvbicsXHJcbiAgICAgIHVybFJlcXVlc3Q6ICcvYmluL2RobC9yZXF1ZXN0X3Bhc3N3b3JkL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxSZXNldDogJy9iaW4vZGhsL3Jlc2V0X3Bhc3N3b3JkL2luZGV4Lmpzb24nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcucmVzZXQtcGFzc3dvcmQtY29udGFpbmVyJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jcmVhdGVDb29raWUgPSB0aGlzLmNyZWF0ZUNvb2tpZS5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMucmVxdWVzdFRva2VuID0gdGhpcy5yZXF1ZXN0VG9rZW4uYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVzZXRQYXNzd29yZCA9IHRoaXMucmVzZXRQYXNzd29yZC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ3Bhc3N3b3JkJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKCQoZWxlbWVudCkuYXR0cigncGF0dGVybicpKS50ZXN0KHZhbHVlKTtcclxuICAgIH0sICdQYXNzd29yZCBmb3JtYXQgaXMgbm90IHZhbGlkJyk7XHJcblxyXG4gICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ2VxdWFsVG8nLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcclxuICAgICAgcmV0dXJuICgkKCcjJyArICQoZWxlbWVudCkuYXR0cignZGF0YS1lcXVhbFRvJykpLnZhbCgpID09PSAkKGVsZW1lbnQpLnZhbCgpKTtcclxuICAgIH0sICdQYXNzd29yZHMgZG8gbm90IG1hdGNoJyk7XHJcblxyXG4gICAgdmFyIHJlbWluZGVyUGFnZSA9ICQodGhpcy5zZWwuY29tcG9uZW50KTtcclxuICAgIGlmIChyZW1pbmRlclBhZ2UubGVuZ3RoID4gMCkge1xyXG4gICAgICB2YXIgdXNlcm5hbWUgPSByZW1pbmRlclBhZ2UuZGF0YSgndXNlcm5hbWUnKTtcclxuICAgICAgdmFyIHRva2VuID0gcmVtaW5kZXJQYWdlLmRhdGEoJ3Rva2VuJyk7XHJcblxyXG4gICAgICBpZiAoKHVzZXJuYW1lICE9PSBudWxsICYmIHR5cGVvZiAodXNlcm5hbWUpICE9PSAndW5kZWZpbmVkJyAmJiB1c2VybmFtZS5sZW5ndGggPiAwKSAmJiAodG9rZW4gIT09IG51bGwgJiYgdHlwZW9mICh0b2tlbikgIT09ICd1bmRlZmluZWQnICYmIHRva2VuLmxlbmd0aCA+IDApKSB7XHJcbiAgICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTMnKS5zaG93KCk7XHJcbiAgICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTEnKS5oaWRlKCk7XHJcbiAgICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTInKS5oaWRlKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTEnKS5zaG93KCk7XHJcbiAgICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTInKS5oaWRlKCk7XHJcbiAgICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTMnKS5oaWRlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlbWluZGVyUGFnZS5maW5kKCcuc3RlcC0xIGZvcm0nKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgIHJlc2V0UGFzc3dvcmRfX2VtYWlsOiAnZW1haWwnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcclxuICAgICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5yZXF1ZXN0VG9rZW4oZm9ybSk7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJlbWluZGVyUGFnZS5maW5kKCcuc3RlcC0zIGZvcm0nKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgIHJlc2V0X19jcmVhdGVQYXNzd29yZDogJ3Bhc3N3b3JkJyxcclxuICAgICAgICAgIHJlc2V0X19jb25maXJtUGFzc3dvcmQ6ICdlcXVhbFRvJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgICAgICAgICQoZWxlbWVudCkuYXBwZW5kKGVycm9yKTtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3VibWl0SGFuZGxlcjogKGZvcm0pID0+IHtcclxuICAgICAgICAgIHRoaXMucmVzZXRQYXNzd29yZChmb3JtKTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY3JlYXRlQ29va2llKG5hbWUsIHZhbHVlLCBleHBpcnlTZWNvbmRzKSB7XHJcbiAgICB2YXIgZXhwaXJlcyA9ICcnO1xyXG4gICAgaWYgKGV4cGlyeVNlY29uZHMpIHtcclxuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoZXhwaXJ5U2Vjb25kcyAqIDEwMDApKTtcclxuICAgICAgZXhwaXJlcyA9ICc7IGV4cGlyZXM9JyArIGRhdGUudG9VVENTdHJpbmcoKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyAnPScgKyB2YWx1ZSArIGV4cGlyZXMgKyAnOyBwYXRoPS8nO1xyXG4gIH1cclxuXHJcbiAgcmVxdWVzdFRva2VuKGZvcm0pIHtcclxuICAgIHZhciBkYXRhID0ge1xyXG4gICAgICB1c2VybmFtZTogJChmb3JtKS5maW5kKCdpbnB1dCNyZXNldFBhc3N3b3JkX19lbWFpbCcpLnZhbCgpLFxyXG4gICAgICBwYWdlOiB3aW5kb3cubG9jYXRpb24uaHJlZlxyXG4gICAgfTtcclxuXHJcbiAgICAkKGZvcm0pLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgICQoZm9ybSkuZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgJC5nZXQodGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogdGhpcy5jb25maWcudXJsUmVxdWVzdCxcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJy5zdGVwLTEnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJy5zdGVwLTInKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LlxcbicgKyByZXNwb25zZS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkKGZvcm0pLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgnR2V0IG5ldyBwYXNzd29yZCcpO1xyXG4gICAgICAgICAgJChmb3JtKS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ0dldCBuZXcgcGFzc3dvcmQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXNldFBhc3N3b3JkKGZvcm0pIHtcclxuICAgIHZhciB1c2VybmFtZSA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5kYXRhKCd1c2VybmFtZScpO1xyXG4gICAgdmFyIHRva2VuID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmRhdGEoJ3Rva2VuJyk7XHJcbiAgICB2YXIgcGFzc3dvcmQgPSAkKGZvcm0pLmZpbmQoJ2lucHV0I3Jlc2V0X19jcmVhdGVQYXNzd29yZCcpLnZhbCgpO1xyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcclxuICAgICAgdG9rZW46IHRva2VuLFxyXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmRcclxuICAgIH07XHJcblxyXG4gICAgJChmb3JtKS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICAkKGZvcm0pLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgICQuZ2V0KHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IHRoaXMuY29uZmlnLnVybFJlc2V0LFxyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAkLmdldCh0aGlzLmNvbmZpZy51cmxUb2tlbiwgKG5leHRUb2tlblJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dGNzcmZ0b2tlbiA9IG5leHRUb2tlblJlc3BvbnNlLnRva2VuO1xyXG5cclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgIHVybDogdGhpcy5jb25maWcudXJsTG9naW4sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHVzZXJuYW1lLCBwYXNzd29yZDogcGFzc3dvcmQgfSxcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogbmV4dGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgICBzdWNjZXNzOiAobG9naW5SZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2dpblJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAobG9naW5SZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIGxvZ2luUmVzcG9uc2UsIHRydWUgXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYmFja1VybCA9ICQoZm9ybSkuZGF0YSgnYmFjaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJC50cmltKGJhY2tVcmwpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tVcmwgPSAnL2NvbnRlbnQvZGhsLmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGJhY2tVcmw7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBsb2dpbiB1c2luZyB5b3VyIHVwZGF0ZWQgY3JlZGVudGlhbHMuXFxuJyArIHJlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBsb2dpbiB1c2luZyB5b3VyIHVwZGF0ZWQgY3JlZGVudGlhbHMuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJChmb3JtKS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ1N1Ym1pdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoZm9ybSkuZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdTdWJtaXQnKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LlxcbicgKyByZXNwb25zZS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IFBhc3N3b3JkUmVtaW5kZXJGb3JtKCk7XHJcbiIsImNsYXNzIFBhc3N3b3JkVmFsaWRpdHlBcGkge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jaGVja0Nhc2luZyA9IHRoaXMuY2hlY2tDYXNpbmcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hlY2tTcGVjaWFsID0gdGhpcy5jaGVja1NwZWNpYWwuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hlY2tOdW1iZXIgPSB0aGlzLmNoZWNrTnVtYmVyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoZWNrTGVuZ3RoID0gdGhpcy5jaGVja0xlbmd0aC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pc1ZhbGlkID0gdGhpcy5pc1ZhbGlkLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpc1ZhbGlkKHBhc3N3b3JkKSB7XHJcbiAgICBjb25zdCBpc0xlbmd0aFZhbGlkID0gdGhpcy5jaGVja0xlbmd0aChwYXNzd29yZCk7XHJcbiAgICBjb25zdCBpc0Nhc2luZ1ZhbGlkID0gdGhpcy5jaGVja0Nhc2luZyhwYXNzd29yZCk7XHJcbiAgICBjb25zdCBpc1NwZWljYWxWYWxpZCA9IHRoaXMuY2hlY2tTcGVjaWFsKHBhc3N3b3JkKTtcclxuICAgIGNvbnN0IGlzTnVtYmVyVmFsaWQgPSB0aGlzLmNoZWNrTnVtYmVyKHBhc3N3b3JkKTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSB7XHJcbiAgICAgIGlzVmFsaWQ6IGlzTGVuZ3RoVmFsaWQgJiYgaXNDYXNpbmdWYWxpZCAmJiBpc1NwZWljYWxWYWxpZCAmJiBpc051bWJlclZhbGlkLFxyXG4gICAgICBpc0xlbmd0aFZhbGlkLFxyXG4gICAgICBpc0Nhc2luZ1ZhbGlkLFxyXG4gICAgICBpc1NwZWljYWxWYWxpZCxcclxuICAgICAgaXNOdW1iZXJWYWxpZFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgY2hlY2tMZW5ndGgocGFzc3dvcmQpIHtcclxuICAgIHJldHVybiBwYXNzd29yZC5sZW5ndGggPj0gODtcclxuICB9XHJcblxyXG4gIGNoZWNrQ2FzaW5nKHBhc3N3b3JkKSB7XHJcbiAgICByZXR1cm4gL14oPz0uKlthLXpdKS4rJC8udGVzdChwYXNzd29yZCkgJiYgL14oPz0uKltBLVpdKS4rJC8udGVzdChwYXNzd29yZCk7XHJcbiAgfVxyXG5cclxuICBjaGVja051bWJlcihwYXNzd29yZCkge1xyXG4gICAgcmV0dXJuIC9eKD89LipbMC05XSkuKyQvLnRlc3QocGFzc3dvcmQpO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tTcGVjaWFsKHBhc3N3b3JkKSB7XHJcbiAgICByZXR1cm4gL14oPz0uKlshwqMlJiooKT17fUAjPjxdKS4rJC8udGVzdChwYXNzd29yZCk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8gSSd2ZSBhc3N1bWVkIHRoZXJlIHdpbGwgb25seSBiZSBvbmUgcGFzc3dvcmQgdmFsaWRpdHkgY2hlY2tlciBvbiBhIHBhZ2UgYXQgb25jZSwgYmVjYXVzZTpcclxuLy8gLSB0aGUgdmFsaWRpdHkgY2hlY2tlciB3b3VsZCBvbmx5IGJlIG9uIHRoZSBtYWluIHBhc3N3b3JkIGVudHJ5IGZpZWxkIGFuZCBub3QgdGhlIGNvbmZpcm1hdGlvblxyXG4vLyAtIGEgdXNlciB3b3VsZG4ndCBiZSBzZXR0aW5nIG1vcmUgdGhhbiBvbmUgcGFzc3dvcmQgYXQgb25jZVxyXG5jbGFzcyBQYXNzd29yZFZhbGlkaXR5IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcudmFsaWRpdHktY2hlY2tzJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnBhc3N3b3JkQXBpID0gbmV3IFBhc3N3b3JkVmFsaWRpdHlBcGkoKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICBjb25zdCBwYXNzd29yZEZpZWxkSWQgPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYXR0cignZGF0YS1maWVsZC1pZCcpO1xyXG4gICAgY29uc3QgcGFzc3dvcmRGaWVsZCA9ICQoJyMnICsgcGFzc3dvcmRGaWVsZElkKTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbigna2V5dXAga2V5cHJlc3MgY2hhbmdlJywgJyMnICsgcGFzc3dvcmRGaWVsZElkLCAoKSA9PiB7XHJcbiAgICAgIGxldCBwYXNzd29yZCA9IHBhc3N3b3JkRmllbGQudmFsKCk7XHJcbiAgICAgIHRoaXMuY2hlY2tQYXNzd29yZFZhbGlkaXR5KHBhc3N3b3JkKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaXNQYXNzd29yZFZhbGlkKHBhc3N3b3JkKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5wYXNzd29yZEFwaS5pc1ZhbGlkKHBhc3N3b3JkKTtcclxuICAgIHJldHVybiByZXN1bHQuaXNWYWxpZDtcclxuICB9XHJcblxyXG4gIGNoZWNrUGFzc3dvcmRWYWxpZGl0eShwYXNzd29yZCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IHRoaXMucGFzc3dvcmRBcGkuaXNWYWxpZChwYXNzd29yZCk7XHJcblxyXG4gICAgaWYgKHJlc3VsdC5pc0xlbmd0aFZhbGlkKSB7XHJcbiAgICAgICQoJ1tkYXRhLWNoZWNrPWxlbmd0aF0nKS5hZGRDbGFzcygnaXMtdmFsaWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJ1tkYXRhLWNoZWNrPWxlbmd0aF0nKS5yZW1vdmVDbGFzcygnaXMtdmFsaWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVzdWx0LmlzQ2FzaW5nVmFsaWQpIHtcclxuICAgICAgJCgnW2RhdGEtY2hlY2s9Y2FzaW5nXScpLmFkZENsYXNzKCdpcy12YWxpZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnW2RhdGEtY2hlY2s9Y2FzaW5nXScpLnJlbW92ZUNsYXNzKCdpcy12YWxpZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZXN1bHQuaXNTcGVpY2FsVmFsaWQpIHtcclxuICAgICAgJCgnW2RhdGEtY2hlY2s9c3BlY2lhbF0nKS5hZGRDbGFzcygnaXMtdmFsaWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJ1tkYXRhLWNoZWNrPXNwZWNpYWxdJykucmVtb3ZlQ2xhc3MoJ2lzLXZhbGlkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlc3VsdC5pc051bWJlclZhbGlkKSB7XHJcbiAgICAgICQoJ1tkYXRhLWNoZWNrPW51bWJlcl0nKS5hZGRDbGFzcygnaXMtdmFsaWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJ1tkYXRhLWNoZWNrPW51bWJlcl0nKS5yZW1vdmVDbGFzcygnaXMtdmFsaWQnKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBQYXNzd29yZFZhbGlkaXR5KCk7XHJcbiIsImNsYXNzIFJlZ2lzdGVyRm9ybSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNvbmZpZyA9IHtcclxuICAgICAgLy8gZmJBcHBJZDogJzEwMDA3NzMxNjMzMzc3OTgnLFxyXG4gICAgICBmYkFwcElkOiAnMTA4MDAzMTMyODgwMTIxMScsXHJcbiAgICAgIC8vIGdvQ2xpZW50SWQ6ICc5MTM5NjAzNTIyMzYtdTd1bjBsMjJ0dmttbGJwYTViY25mMXVxZzRjc2k3ZTMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nLFxyXG4gICAgICBnb0NsaWVudElkOiAnMzEzNDY5ODM3NDIwLWw4ODJoMzlnZThuOG45cGI5N2xkdmprM2ZtOHBwcWdzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJyxcclxuXHJcbiAgICAgIHVybFRva2VuOiAnL2xpYnMvZ3Jhbml0ZS9jc3JmL3Rva2VuLmpzb24nLFxyXG4gICAgICB1cmxSZWZyZXNoQ2hlY2s6ICcvYmluL2RobC9yZWZyZXNoX3Rva2VuL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxSZWdpc3RlcjogJy9iaW4vZGhsL3JlZ2lzdGVyL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxVcGRhdGVDYXRlZ29yaWVzOiAnL2Jpbi9kaGwvdXBkYXRlX2NhdGVnb3JpZXMvaW5kZXguanNvbidcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5wYWdlLWJvZHkucmVnaXN0ZXIsICNkb3dubG9hZCwgLmdhdGVkJyxcclxuICAgICAgYnV0dG9uRmFjZWJvb2s6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmZiJyxcclxuICAgICAgYnV0dG9uTGlua2VkaW46ICcuZm9ybXNfX2N0YS0tc29jaWFsLmxpJyxcclxuICAgICAgYnV0dG9uR29vZ2xlUGx1czogJy5mb3Jtc19fY3RhLS1zb2NpYWwuZ28nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxvZ2dlZEluID0gdGhpcy5sb2dnZWRJbi5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMudHJ5UmVnaXN0ZXJGYWNlYm9vayA9IHRoaXMudHJ5UmVnaXN0ZXJGYWNlYm9vay5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50cnlSZWdpc3RlckxpbmtlZGluID0gdGhpcy50cnlSZWdpc3RlckxpbmtlZGluLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnRyeVJlZ2lzdGVyR29vZ2xlID0gdGhpcy50cnlSZWdpc3Rlckdvb2dsZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50cnlSZWdpc3RlciA9IHRoaXMudHJ5UmVnaXN0ZXIuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmV4ZWN1dGVSZWdpc3RlciA9IHRoaXMuZXhlY3V0ZVJlZ2lzdGVyLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHJlYWRDb29raWUobmFtZSkge1xyXG4gICAgdmFyIG5hbWVFUSA9IG5hbWUgKyAnPSc7XHJcbiAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGMgPSBjYVtpXTtcclxuICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XHJcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJsb2dnZWRpbi5ESEwnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubG9nZ2VkSW4oKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGpRdWVyeS52YWxpZGF0b3IuYWRkTWV0aG9kKCdwYXNzd29yZCcsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICBpZiAoJC50cmltKHZhbHVlKS5sZW5ndGggPT09IDApIHJldHVybiB0cnVlO1xyXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cCgkKGVsZW1lbnQpLmF0dHIoJ3BhdHRlcm4nKSkudGVzdCh2YWx1ZSk7XHJcbiAgICB9LCAnUGFzc3dvcmQgZm9ybWF0IGlzIG5vdCB2YWxpZCcpO1xyXG5cclxuICAgIGpRdWVyeS52YWxpZGF0b3IuYWRkTWV0aG9kKCdlcXVhbFRvJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgIHJldHVybiAoJCgnIycgKyAkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtZXF1YWxUbycpKS52YWwoKSA9PT0gJChlbGVtZW50KS52YWwoKSk7XHJcbiAgICB9LCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpO1xyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykubGVuZ3RoID4gMCkge1xyXG4gICAgICB3aW5kb3cuZmJBc3luY0luaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LmZiX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LkZCKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LkZCICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5GQi5pbml0KHtcclxuICAgICAgICAgICAgICBhcHBJZDogdGhpcy5jb25maWcuZmJBcHBJZCxcclxuICAgICAgICAgICAgICBjb29raWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgeGZibWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmVyc2lvbjogJ3YyLjgnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZmJfaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhY2Vib29rLWpzc2RrJykgPT09IG51bGwpIHtcclxuICAgICAgICB2YXIgZmpzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xyXG4gICAgICAgIHZhciBqcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIGpzLmlkID0gJ2ZhY2Vib29rLWpzc2RrJztcclxuICAgICAgICBqcy5zcmMgPSAnLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9FTi9zZGsuanMnO1xyXG4gICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuICAgICAgfVxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIHRoaXMudHJ5UmVnaXN0ZXJGYWNlYm9vayhldnQpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgdGhpcy50cnlSZWdpc3RlckxpbmtlZGluKGV2dCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZ29vZ2xlQnV0dG9uID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cyk7XHJcbiAgICBpZiAoZ29vZ2xlQnV0dG9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgd2luZG93LmdvX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5nYXBpKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmdhcGkgIT09IG51bGwpIHtcclxuICAgICAgICAgIHdpbmRvdy5nYXBpLmxvYWQoJ2F1dGgyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgYXV0aDIgPSB3aW5kb3cuZ2FwaS5hdXRoMi5pbml0KHtcclxuICAgICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY29uZmlnLmdvQ2xpZW50SWQsXHJcbiAgICAgICAgICAgICAgY29va2llcG9saWN5OiAnc2luZ2xlX2hvc3Rfb3JpZ2luJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZ29vZ2xlQnV0dG9uLmdldCgwKTtcclxuICAgICAgICAgICAgYXV0aDIuYXR0YWNoQ2xpY2tIYW5kbGVyKGVsZW1lbnQsIHt9LFxyXG4gICAgICAgICAgICAgIChnb29nbGVVc2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyeVJlZ2lzdGVyR29vZ2xlKGdvb2dsZVVzZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvciAhPT0gJ3BvcHVwX2Nsb3NlZF9ieV91c2VyJykge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydChyZXN1bHQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmdvX2ludGVydmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnI2dsYi1yZWdpc3Rlci1zdGFydCBmb3JtI3JlZ2lzdGVyLWRldGFpbC1mb3JtJykudmFsaWRhdGUoe1xyXG4gICAgICBydWxlczoge1xyXG4gICAgICAgIHJlZ2lzdGVyX19lbWFpbDogJ2VtYWlsJyxcclxuICAgICAgICByZWdpc3Rlcl9fcGFzc3dvcmQxOiAncGFzc3dvcmQnXHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IChmb3JtKSA9PiB7XHJcbiAgICAgICAgdGhpcy50cnlSZWdpc3Rlcihmb3JtKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcjZ2xiLXJlZ2lzdGVyLWNhdGVnb3JpZXMgZm9ybSAuZm9ybXNfX2N0YS0tcmVkJykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdGhpcy50cnlDYXRlZ29yeVNlbGVjdGlvbihldnQpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRyeVJlZ2lzdGVyRmFjZWJvb2soZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuXHJcbiAgICB3aW5kb3cuRkIubG9naW4oKGxvZ2luUmVzcG9uc2UpID0+IHtcclxuICAgICAgaWYgKGxvZ2luUmVzcG9uc2UuYXV0aFJlc3BvbnNlKSB7XHJcbiAgICAgICAgd2luZG93LkZCLmFwaSgnL21lJywgKGRhdGFSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGZpcnN0bmFtZTogZGF0YVJlc3BvbnNlLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgIGxhc3RuYW1lOiBkYXRhUmVzcG9uc2UubGFzdF9uYW1lLFxyXG4gICAgICAgICAgICB1c2VybmFtZTogZGF0YVJlc3BvbnNlLmVtYWlsLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogZGF0YVJlc3BvbnNlLmlkLFxyXG4gICAgICAgICAgICBpc2xpbmtlZGluOiAndHJ1ZScsXHJcbiAgICAgICAgICAgIHRjYWdyZWU6IHRydWVcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdGhpcy5leGVjdXRlUmVnaXN0ZXIoZGF0YSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykudGV4dCgnRmFjZWJvb2snKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sIHsgZmllbGRzOiBbICdpZCcsICdlbWFpbCcsICdmaXJzdF9uYW1lJywgJ2xhc3RfbmFtZScgXX0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sIHsgc2NvcGU6ICdlbWFpbCxwdWJsaWNfcHJvZmlsZScsIHJldHVybl9zY29wZXM6IHRydWUgfSk7XHJcbiAgfVxyXG5cclxuICB0cnlSZWdpc3RlckxpbmtlZGluKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgSU4uVXNlci5hdXRob3JpemUoKCkgPT4ge1xyXG4gICAgICBJTi5BUEkuUHJvZmlsZSgnbWUnKS5maWVsZHMoJ2lkJywgJ2ZpcnN0LW5hbWUnLCAnbGFzdC1uYW1lJywgJ2VtYWlsLWFkZHJlc3MnKS5yZXN1bHQoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIHZhciBtZW1iZXIgPSByZXN1bHQudmFsdWVzWzBdO1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgIGZpcnN0bmFtZTogbWVtYmVyLmZpcnN0TmFtZSxcclxuICAgICAgICAgIGxhc3RuYW1lOiBtZW1iZXIubGFzdE5hbWUsXHJcbiAgICAgICAgICB1c2VybmFtZTogbWVtYmVyLmVtYWlsQWRkcmVzcyxcclxuICAgICAgICAgIHBhc3N3b3JkOiBtZW1iZXIuaWQsXHJcbiAgICAgICAgICBpc2xpbmtlZGluOiAndHJ1ZScsXHJcbiAgICAgICAgICB0Y2FncmVlOiB0cnVlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlUmVnaXN0ZXIoZGF0YSwgKCkgPT4ge1xyXG4gICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLnRleHQoJ0xpbmtlZEluJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICB2YXIgcmVzdWx0ID0gd2luZG93LklOLlVzZXIuaXNBdXRob3JpemVkKCk7XHJcbiAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICBJTi5BUEkuUHJvZmlsZSgnbWUnKS5maWVsZHMoJ2lkJywgJ2ZpcnN0LW5hbWUnLCAnbGFzdC1uYW1lJywgJ2VtYWlsLWFkZHJlc3MnKS5yZXN1bHQoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgdmFyIG1lbWJlciA9IHJlc3VsdC52YWx1ZXNbMF07XHJcbiAgXHJcbiAgICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgZmlyc3RuYW1lOiBtZW1iZXIuZmlyc3ROYW1lLFxyXG4gICAgICAgICAgICBsYXN0bmFtZTogbWVtYmVyLmxhc3ROYW1lLFxyXG4gICAgICAgICAgICB1c2VybmFtZTogbWVtYmVyLmVtYWlsQWRkcmVzcyxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IG1lbWJlci5pZCxcclxuICAgICAgICAgICAgaXNsaW5rZWRpbjogJ3RydWUnLFxyXG4gICAgICAgICAgICB0Y2FncmVlOiB0cnVlXHJcbiAgICAgICAgICB9O1xyXG4gIFxyXG4gICAgICAgICAgdGhpcy5leGVjdXRlUmVnaXN0ZXIoZGF0YSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikudGV4dCgnTGlua2VkSW4nKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHRyeVJlZ2lzdGVyR29vZ2xlKGdvb2dsZVVzZXIpIHtcclxuICAgIHZhciBiYXNpY1Byb2ZpbGUgPSBnb29nbGVVc2VyLmdldEJhc2ljUHJvZmlsZSgpO1xyXG5cclxuICAgIHZhciBkYXRhID0ge1xyXG4gICAgICBmaXJzdG5hbWU6IGJhc2ljUHJvZmlsZS5nZXRHaXZlbk5hbWUoKSxcclxuICAgICAgbGFzdG5hbWU6IGJhc2ljUHJvZmlsZS5nZXRGYW1pbHlOYW1lKCksXHJcbiAgICAgIHVzZXJuYW1lOiBiYXNpY1Byb2ZpbGUuZ2V0RW1haWwoKSxcclxuICAgICAgcGFzc3dvcmQ6IGJhc2ljUHJvZmlsZS5nZXRJZCgpLFxyXG4gICAgICBpc2xpbmtlZGluOiAndHJ1ZScsXHJcbiAgICAgIHRjYWdyZWU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cykudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgIHRoaXMuZXhlY3V0ZVJlZ2lzdGVyKGRhdGEsICgpID0+IHtcclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cykudGV4dCgnR29vZ2xlKycpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0cnlSZWdpc3Rlcihmb3JtKSB7XHJcbiAgICB2YXIgZnJtID0gJChmb3JtKTtcclxuICAgIHZhciBkYXRhID0ge1xyXG4gICAgICBmaXJzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fZmlyc3RuYW1lJykudmFsKCksXHJcbiAgICAgIGxhc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2xhc3RuYW1lJykudmFsKCksXHJcbiAgICAgIHVzZXJuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2VtYWlsJykudmFsKCksXHJcbiAgICAgIHBhc3N3b3JkOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3Bhc3N3b3JkMScpLnZhbCgpLFxyXG5cclxuICAgICAgaXNsaW5rZWRpbjogJ2ZhbHNlJyxcclxuICAgICAgdGNhZ3JlZTogZnJtLmZpbmQoJ2lucHV0I2NoZWNrYm94SWQnKS5pcygnOmNoZWNrZWQnKVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoKCQudHJpbShkYXRhLmZpcnN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEubGFzdG5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShkYXRhLnVzZXJuYW1lKS5sZW5ndGggPT09IDApKSB7XHJcbiAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgeW91ciBuYW1lIGFuZCBlbWFpbCBhZGRyZXNzLicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcclxuXHJcbiAgICAgIHRoaXMuZXhlY3V0ZVJlZ2lzdGVyKGRhdGEsICgpID0+IHtcclxuICAgICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdTdWJtaXQnKTtcclxuICAgICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdTdWJtaXQnKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZXhlY3V0ZVJlZ2lzdGVyKGRhdGEsIHVud2FpdENhbGxiYWNrKSB7XHJcbiAgICAkLmdldCh0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcblxyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogdGhpcy5jb25maWcudXJsUmVnaXN0ZXIsXHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdmFyIGZybSA9ICQoJy5wYWdlLWJvZHkucmVnaXN0ZXIsICNkb3dubG9hZCwgLmdhdGVkJykuZmluZCgnZm9ybScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyByZXNwb25zZSwgdHJ1ZSBdKTtcclxuXHJcbiAgICAgICAgICAgICAgd2luZG93LmRhdGFMYXllciA9IHdpbmRvdy5kYXRhTGF5ZXIgfHwgW107XHJcbiAgICAgICAgICAgICAgd2luZG93LmRhdGFMYXllci5wdXNoKHtcclxuICAgICAgICAgICAgICAgICdldmVudCc6ICdyZWdpc3RyYXRpb25Db21wbGV0ZSdcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKChmcm0uY2xvc2VzdCgnI2Rvd25sb2FkJykubGVuZ3RoID4gMCkgfHwgKGZybS5jbG9zZXN0KCcuZ2F0ZWQnKS5sZW5ndGggPiAwKSkge1xyXG4gICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICB2YXIgbW9kYWwgPSAkKCcucmVnaXN0ZXIuYmVsb3ctcmVnaXN0ZXItZm9ybScpLmZpbmQoJy5tb2RhbCcpO1xyXG4gICAgICAgICAgICAgIHZhciBjYXRlZ29yeVNlbGVjdGlvbiA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcjZ2xiLXJlZ2lzdGVyLWNhdGVnb3JpZXMnKTtcclxuICAgICAgICAgICAgICBpZiAobW9kYWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbW9kYWwuZmluZCgnLnRoYW5rcy1uYW1lJykudGV4dChkYXRhLmZpcnN0bmFtZSk7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCdidXR0b24nKS5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBiYWNrVXJsID0gZnJtLmRhdGEoJ2JhY2snKTtcclxuICAgICAgICAgICAgICAgICAgaWYgKCQudHJpbShiYWNrVXJsKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBiYWNrVXJsO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBtb2RhbC5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2F0ZWdvcnlTZWxlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJyNnbGItcmVnaXN0ZXItc3RhcnQnKS5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnlTZWxlY3Rpb24uZmluZCgnLmZvcm1zX190aXRsZScpLnRleHQoJ1RoYW5rcyAnICsgcmVzcG9uc2UubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeVNlbGVjdGlvbi5zaG93KCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLmVycm9yLmluY2x1ZGVzKCdFbWFpbCBhZGRyZXNzIGFscmVhZHkgZXhpc3RzJykpIHtcclxuICAgICAgICAgICAgICAkKCc8bGFiZWwgaWQ9XCJyZWdpc3Rlcl9fZW1haWwtZXJyb3JcIiBjbGFzcz1cImVycm9yXCIgZm9yPVwicmVnaXN0ZXJfX2VtYWlsXCI+VGhpcyBlbWFpbCBhZGRyZXNzIGFscmVhZHkgZXhpc3RzPC9sYWJlbD4nKS5pbnNlcnRBZnRlcihmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2VtYWlsJykpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHJlZ2lzdGVyLlxcbicgKyByZXNwb25zZS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVnaXN0ZXIuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB1bndhaXRDYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRyeUNhdGVnb3J5U2VsZWN0aW9uKCkge1xyXG4gICAgdmFyIGNhdGVnb3JpZXMgPSAnJztcclxuICAgIHZhciBjb250YWluZXIgPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnI2dsYi1yZWdpc3Rlci1jYXRlZ29yaWVzIGZvcm0nKTtcclxuICAgIGNvbnRhaW5lci5maW5kKCdpbnB1dDpjaGVja2VkJykuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgaWYgKGNhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNhdGVnb3JpZXMgKz0gJywnO1xyXG4gICAgICB9XHJcbiAgICAgIGNhdGVnb3JpZXMgKz0gJChpdGVtKS52YWwoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChjYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdmFyIGNvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLkF1dGhUb2tlbicpO1xyXG4gICAgICBpZiAoY29va2llICE9PSBudWxsKSB7XHJcbiAgICAgICAgdmFyIHNwbGl0ID0gY29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAkLmdldCh0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgdXJsOiB0aGlzLmNvbmZpZy51cmxVcGRhdGVDYXRlZ29yaWVzLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHNwbGl0WzBdLCB0b2tlbjogc3BsaXRbMV0sIGNhdHM6IGNhdGVnb3JpZXMgfSxcclxuICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgc3VjY2VzczogKHVwZGF0ZUNhdGVnb3JpZXNSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHVwZGF0ZUNhdGVnb3JpZXNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAodXBkYXRlQ2F0ZWdvcmllc1Jlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyB1cGRhdGVDYXRlZ29yaWVzUmVzcG9uc2UsIHRydWUgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9jb250ZW50L2RobC5odG1sJztcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDEpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoMikuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoMykuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIHJlZnJlc2hDb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nKTtcclxuICAgICAgICBpZiAocmVmcmVzaENvb2tpZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgdmFyIHJlZnJlc2hTcGxpdCA9IHJlZnJlc2hDb29raWUuc3BsaXQoJ3wnKTtcclxuICAgICAgICAgIGlmIChyZWZyZXNoU3BsaXQubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgJC5nZXQodGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogdGhpcy5jb25maWcudXJsUmVmcmVzaENoZWNrLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogcmVmcmVzaFNwbGl0WzBdLCByZWZyZXNoX3Rva2VuOiByZWZyZXNoU3BsaXRbMV0gfSxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiAocmVmcmVzaFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHJlZnJlc2hSZXNwb25zZSwgdHJ1ZSBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJ5Q2F0ZWdvcnlTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICg0KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDUpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDYpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgbG9nZ2VkSW4oKSB7XHJcbiAgICBpZiAoJCgnLnBhZ2UtYm9keS5yZWdpc3RlcicpLmxlbmd0aCA+IDApIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9jb250ZW50L2RobC95b3VyLWFjY291bnQuaHRtbCc7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgUmVnaXN0ZXJGb3JtKCk7XHJcbiIsImNsYXNzIFNlYXJjaEZvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5zZWFyY2gtZm9ybScsXHJcbiAgICAgIGNsZWFyQnV0dG9uOiAnLnNlYXJjaC1mb3JtX19jbGVhci1pY29uJyxcclxuICAgICAgaW5wdXQ6ICcuc2VhcmNoLWZvcm1fX3NlYXJjaCBpbnB1dFt0eXBlPXNlYXJjaF0nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNsZWFyU2VhcmNoRm9ybSA9IHRoaXMuY2xlYXJTZWFyY2hGb3JtLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5jbGVhckJ1dHRvbiwgKCkgPT4ge1xyXG4gICAgICB0aGlzLmNsZWFyU2VhcmNoRm9ybSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjbGVhclNlYXJjaEZvcm0oKSB7XHJcbiAgICAkKHRoaXMuc2VsLmlucHV0KS52YWwoJycpLmZvY3VzKCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgU2VhcmNoRm9ybSgpO1xyXG4iLCJjbGFzcyBTZXJ2aWNlV29ya2VyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuZGVmZXJyZWRQcm9tcHQgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZWdpc3RlciA9IHRoaXMucmVnaXN0ZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYWRkVG9Ib21lU2NyZWVuID0gdGhpcy5hZGRUb0hvbWVTY3JlZW4uYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyKCkge1xyXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJy9zdy5qcycpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciBzdWNjZXNmdWxseSByZWdpc3RlcmVkJyk7XHJcbiAgICB9KS5jYXRjaCgoKSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQ6ICcsIGVycik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZFRvSG9tZVNjcmVlbigpIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmVpbnN0YWxscHJvbXB0JywgKGUpID0+IHtcclxuICAgICAgLy8gUHJldmVudCBDaHJvbWUgNjcgYW5kIGVhcmxpZXIgZnJvbSBhdXRvbWF0aWNhbGx5IHNob3dpbmcgdGhlIHByb21wdFxyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIFN0YXNoIHRoZSBldmVudCBzbyBpdCBjYW4gYmUgdHJpZ2dlcmVkIGxhdGVyLlxyXG4gICAgICB0aGlzLmRlZmVycmVkUHJvbXB0ID0gZTtcclxuICAgICAgLy8gQ2hlY2sgaWYgYWxyZWFkeSBkaXNtaXNzZWRcclxuICAgICAgbGV0IGEyaHNDb29raWUgPSBDb29raWVzLmdldCgnYTJocycpO1xyXG4gICAgICAvLyBJZiB0aGUgY29va2llIGlzIHNldCB0byBpZ25vcmUsIGlnbm9yZSB0aGUgcHJvbXB0XHJcbiAgICAgIGlmIChhMmhzQ29va2llID09PSAnaWdub3JlJykgcmV0dXJuO1xyXG4gICAgICAvLyBTaG93IHRoZSBhZGQgdG8gaG9tZSBzY3JlZW4gYmFubmVyXHJcbiAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW4nKS5hZGRDbGFzcygnYWRkVG9Ib21lU2NyZWVuLS1vcGVuJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmFkZFRvSG9tZVNjcmVlbl9fY3RhJywgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAvLyBTaG93IEEySFNcclxuICAgICAgdGhpcy5kZWZlcnJlZFByb21wdC5wcm9tcHQoKTtcclxuICAgICAgLy8gV2FpdCBmb3IgdGhlIHVzZXIgdG8gcmVzcG9uZCB0byB0aGUgcHJvbXB0XHJcbiAgICAgIHRoaXMuZGVmZXJyZWRQcm9tcHQudXNlckNob2ljZS50aGVuKChjaG9pY2VSZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoY2hvaWNlUmVzdWx0Lm91dGNvbWUgPT09ICdhY2NlcHRlZCcpIHtcclxuICAgICAgICAgIC8vIEhpZGUgdGhlIGFkZCB0byBob21lIHNjcmVlbiBiYW5uZXJcclxuICAgICAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW4nKS5yZW1vdmVDbGFzcygnYWRkVG9Ib21lU2NyZWVuLS1vcGVuJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIENoYW5nZSBjb250ZW50XHJcbiAgICAgICAgICAkKCcuYWRkVG9Ib21lU2NyZWVuX190aXRsZScpLnRleHQoJ1RoYXRcXCdzIGEgc2hhbWUsIG1heWJlIG5leHQgdGltZScpO1xyXG4gICAgICAgICAgJCgnLmFkZFRvSG9tZVNjcmVlbl9fY3RhJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAkKCcuYWRkVG9Ib21lU2NyZWVuX19saW5rJykudGV4dCgnQ2xvc2UnKTtcclxuICAgICAgICAgIC8vIFNldCBpZ25vcmUgY29va2llXHJcbiAgICAgICAgICB0aGlzLmNyZWF0ZUEyaHNDb29raWUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kZWZlcnJlZFByb21wdCA9IG51bGw7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5hZGRUb0hvbWVTY3JlZW5fX2xpbmsnLCAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIEhpZGUgdGhlIGFkZCB0byBob21lIHNjcmVlbiBiYW5uZXJcclxuICAgICAgJCgnLmFkZFRvSG9tZVNjcmVlbicpLnJlbW92ZUNsYXNzKCdhZGRUb0hvbWVTY3JlZW4tLW9wZW4nKTtcclxuICAgICAgLy8gQ2xlYXIgdGhlIHByb21wdFxyXG4gICAgICB0aGlzLmRlZmVycmVkUHJvbXB0ID0gbnVsbDtcclxuICAgICAgLy8gU2V0IGlnbm9yZSBjb29raWVcclxuICAgICAgdGhpcy5jcmVhdGVBMmhzQ29va2llKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUEyaHNDb29raWUoKSB7XHJcbiAgICAvLyBTZXQgaWdub3JlIGNvb2tpZVxyXG4gICAgQ29va2llcy5zZXQoJ2EyaHMnLCAnaWdub3JlJywge2V4cGlyZXM6IDE0fSk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCEoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikpIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMucmVnaXN0ZXIoKTtcclxuICAgIHRoaXMuYWRkVG9Ib21lU2NyZWVuKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBTZXJ2aWNlV29ya2VyKCk7XHJcbiIsImNsYXNzIFNoaXBGb3JtIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICAvLyBRU1AgPSBxdWVyeXN0cmluZyBwYXJhbWV0ZXJcclxuICAgICAgY29tcG9uZW50OiAnLnNoaXAtbm93JyxcclxuICAgICAgZmlyc3RuYW1lSW5wdXQ6ICcjZmlyc3RuYW1lJywgLy8ganF1ZXJ5IHNlbGVjdG9yIGZvciBpbnB1dCAoY2FuIGJlIGVnICcuZmlyc3RuYW1lIGlucHV0JylcclxuICAgICAgZmlyc3RuYW1lUVNQOiAnP2ZpcnN0bmFtZScsIC8vIG5lZWQgPyBmb2xsb3dlZCBieSBwYXJhbWV0ZXIgbmFtZVxyXG4gICAgICBsYXN0bmFtZUlucHV0OiAnI2xhc3RuYW1lJyxcclxuICAgICAgbGFzdG5hbWVRU1A6ICc/bGFzdG5hbWUnLFxyXG4gICAgICBlbWFpbElucHV0OiAnI2VtYWlsJyxcclxuICAgICAgZW1haWxRU1A6ICc/ZW1haWwnLFxyXG4gICAgICB1c2VyRmlyc3RuYW1lRWxlbWVudDogJy51c2VyLWZpcnN0bmFtZSdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnBvcHVsYXRlRm9ybSA9IHRoaXMucG9wdWxhdGVGb3JtLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dMb2dnZWRJbkVsZW1lbnRzID0gdGhpcy5zaG93TG9nZ2VkSW5FbGVtZW50cy5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIFxyXG4gICAgJCh3aW5kb3cpLm9uKCd1c2VybG9nZ2VkaW4uREhMJywgKGV2dCwgdG9rZW5EYXRhKSA9PiB7XHJcbiAgICAgIHRoaXMuc2hvd0xvZ2dlZEluRWxlbWVudHModG9rZW5EYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucG9wdWxhdGVGb3JtKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHBvcHVsYXRlRm9ybSgpIHtcclxuICAgIGxldCBlbWFpbCA9IHVybCh0aGlzLnNlbC5lbWFpbFFTUCk7XHJcbiAgICBsZXQgZmlyc3RuYW1lID0gdXJsKHRoaXMuc2VsLmZpcnN0bmFtZVFTUCk7XHJcbiAgICBsZXQgbGFzdG5hbWUgPSB1cmwodGhpcy5zZWwubGFzdG5hbWVRU1ApO1xyXG5cclxuICAgIGlmICh0eXBlb2YgZW1haWwgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICQodGhpcy5zZWwuZW1haWxJbnB1dCkudmFsKGVtYWlsKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGZpcnN0bmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgJCh0aGlzLnNlbC5maXJzdG5hbWVJbnB1dCkudmFsKGZpcnN0bmFtZSk7XHJcblxyXG4gICAgICBpZiAoJC50cmltKGZpcnN0bmFtZSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICQodGhpcy5zZWwudXNlckZpcnN0bmFtZUVsZW1lbnQpLnRleHQoZmlyc3RuYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgbGFzdG5hbWUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICQodGhpcy5zZWwubGFzdG5hbWVJbnB1dCkudmFsKGxhc3RuYW1lKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNob3dMb2dnZWRJbkVsZW1lbnRzKHRva2VuRGF0YSkge1xyXG4gICAgbGV0IGZpcnN0bmFtZSA9IHVybCh0aGlzLnNlbC5maXJzdG5hbWVRU1ApO1xyXG5cclxuICAgIGlmICgodHlwZW9mIGZpcnN0bmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHx8ICgkLnRyaW0oZmlyc3RuYW1lKS5sZW5ndGggPT0gMCkpIHtcclxuICAgICAgJCh0aGlzLnNlbC51c2VyRmlyc3RuYW1lRWxlbWVudCkudGV4dCh0b2tlbkRhdGEubmFtZSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgU2hpcEZvcm0oKTtcclxuIiwiY2xhc3MgU2hpcE5vd0Zvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGZvcm06ICdmb3JtLmZvcm1zLnNoaXAtbm93JyxcclxuICAgICAgY291bnRyeXNlbGVjdDogJ2Zvcm0uZm9ybXMuc2hpcC1ub3cgI3NoaXBub3dfY291bnRyeSdcclxuICAgIH07XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50b2dnbGVBZGRyZXNzID0gdGhpcy50b2dnbGVBZGRyZXNzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnN1Ym1pdEZvcm0gPSB0aGlzLnN1Ym1pdEZvcm0uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Rm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dTdWNjZXNzID0gdGhpcy5zaG93U3VjY2Vzcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zaG93RXJyb3IgPSB0aGlzLnNob3dFcnJvci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy52YWxpZGF0ZSA9IHRoaXMudmFsaWRhdGUuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgdGhpcy5zZWwuY291bnRyeXNlbGVjdCwgdGhpcy50b2dnbGVBZGRyZXNzKTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdzdWJtaXQnLCB0aGlzLnNlbC5mb3JtLCB0aGlzLnN1Ym1pdEZvcm0pO1xyXG5cclxuICAgIHZhciBjb3VudHJ5ID0gJCh0aGlzLnNlbC5mb3JtKS5kYXRhKCdwcmVzZWxlY3Rjb3VudHJ5Jyk7XHJcbiAgICBpZiAoKGNvdW50cnkgIT09IG51bGwpICYmICQudHJpbShjb3VudHJ5KS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICQodGhpcy5zZWwuY291bnRyeXNlbGVjdCkudmFsKGNvdW50cnkpLnRyaWdnZXIoJ2NoYW5nZScpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGUoKSB7XHJcbiAgICAkKHRoaXMuc2VsLmZvcm0pLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICQoaXRlbSkudmFsaWRhdGUoe1xyXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmlzKCdzZWxlY3QnKSkge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5maW5kKCcuc2VsZWN0Ym94aXQtYnRuJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1Y2Nlc3M6IChsYWJlbCkgPT4ge1xyXG4gICAgICAgICAgbGV0ICRwYXJlbnQgPSAkKGxhYmVsKS5wYXJlbnRzKCdmb3JtLnNoaXAtbm93Jyk7XHJcbiAgICAgICAgICBpZiAoJHBhcmVudC5maW5kKCdzZWxlY3QnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLnNlbGVjdGJveGl0LWJ0bicpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZUFkZHJlc3MoZSkge1xyXG4gICAgdmFyIHZhbCA9ICQodGhpcy5zZWwuY291bnRyeXNlbGVjdCkudmFsKCk7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSAkKCdvcHRpb24nLCB0aGlzLnNlbC5jb3VudHJ5c2VsZWN0KTtcclxuICAgIHZhciBtYW5kYXRvcnkgPSB0cnVlO1xyXG4gICAgb3B0aW9ucy5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xyXG4gICAgICBpZiAoJChpdGVtKS5hdHRyKCd2YWx1ZScpID09PSB2YWwgJiYgKCcnICsgJChpdGVtKS5kYXRhKCdub25tYW5kYXRvcnknKSkgPT09ICd0cnVlJykge1xyXG4gICAgICAgIG1hbmRhdG9yeSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAobWFuZGF0b3J5KSB7XHJcbiAgICAgICQoJyNzaGlwbm93X2FkZHJlc3MnLCB0aGlzLnNlbC5mb3JtKS5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0FkZHJlc3MqJyk7XHJcbiAgICAgICQoJyNzaGlwbm93X3ppcCcsIHRoaXMuc2VsLmZvcm0pLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnWklQIG9yIFBvc3Rjb2RlKicpO1xyXG4gICAgICAkKCcjc2hpcG5vd19jaXR5JywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdDaXR5KicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnI3NoaXBub3dfYWRkcmVzcycsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQWRkcmVzcycpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmNsb3Nlc3QoJ2RpdicpLmZpbmQoJ2xhYmVsJykucmVtb3ZlKCk7XHJcbiAgICAgICQoJyNzaGlwbm93X3ppcCcsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnWklQIG9yIFBvc3Rjb2RlJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuY2xvc2VzdCgnZGl2JykuZmluZCgnbGFiZWwnKS5yZW1vdmUoKTtcclxuICAgICAgJCgnI3NoaXBub3dfY2l0eScsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQ2l0eScpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmNsb3Nlc3QoJ2RpdicpLmZpbmQoJ2xhYmVsJykucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdWJtaXRGb3JtKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCAkZm9ybSA9ICQoZS50YXJnZXQpO1xyXG4gICAgbGV0IGZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YSgkZm9ybSk7XHJcbiAgICAkLnBvc3QoJGZvcm0uYXR0cignYWN0aW9uJyksIGZvcm1EYXRhLCAoZGF0YSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdPSycpIHtcclxuICAgICAgICB0aGlzLnNob3dTdWNjZXNzKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zaG93RXJyb3IoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRGb3JtRGF0YSgkZm9ybSkge1xyXG4gICAgbGV0IHVuaW5kZXhlZEFycmF5ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcclxuICAgIGxldCBpbmRleGVkQXJyYXkgPSB7fTtcclxuICAgICQubWFwKHVuaW5kZXhlZEFycmF5LCAobikgPT4gKGluZGV4ZWRBcnJheVtuLm5hbWVdID0gbi52YWx1ZSkpO1xyXG5cclxuICAgIGluZGV4ZWRBcnJheS5zb3VyY2UgPSAkLnRyaW0oJGZvcm0uZGF0YSgnc291cmNlJykpO1xyXG5cclxuICAgIHJldHVybiBpbmRleGVkQXJyYXk7XHJcbiAgfVxyXG5cclxuICBzaG93U3VjY2VzcygpIHtcclxuICAgIHdpbmRvdy5sb2NhdGlvbiA9ICQodGhpcy5zZWwuZm9ybSkuZGF0YSgndGhhbmtzJyk7XHJcbiAgfVxyXG5cclxuICBzaG93RXJyb3IoKSB7XHJcbiAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuZm9ybSkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgdGhpcy52YWxpZGF0ZSgpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgU2hpcE5vd0Zvcm0oKTtcclxuIiwiY2xhc3MgU2hpcE5vd1R3b1N0ZXBGb3JtIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuZmlyc3RuYW1lID0gJyc7XHJcbiAgICB0aGlzLmxhc3RuYW1lID0gJyc7XHJcbiAgICB0aGlzLmVtYWlsID0gJyc7XHJcblxyXG4gICAgdGhpcy5jb25maWcgPSB7XHJcbiAgICAgIC8vIGZiQXBwSWQ6ICcxMDAwNzczMTYzMzM3Nzk4JyxcclxuICAgICAgZmJBcHBJZDogJzEwODAwMzEzMjg4MDEyMTEnLFxyXG4gICAgICAvLyBnb0NsaWVudElkOiAnOTEzOTYwMzUyMjM2LXU3dW4wbDIydHZrbWxicGE1YmNuZjF1cWc0Y3NpN2UzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJyxcclxuICAgICAgZ29DbGllbnRJZDogJzMxMzQ2OTgzNzQyMC1sODgyaDM5Z2U4bjhuOXBiOTdsZHZqazNmbThwcHFncy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5zaGlwTm93TXVsdGkud3lzaXd5ZywgLmFuaW1hdGVkRm9ybScsXHJcbiAgICAgIHN3aW5nYnV0dG9uOiAnLnNoaXBOb3dNdWx0aV9faGVhZGN0YS0tcmVkJyxcclxuICAgICAgZm9ybXM6ICdmb3JtLmZvcm1zLnNoaXAtbm93LXR3b3N0ZXAnLFxyXG4gICAgICBmb3JtMTogJ2Zvcm0uZm9ybXMuZm9ybTEuc2hpcC1ub3ctdHdvc3RlcCcsXHJcbiAgICAgIGZvcm0yOiAnZm9ybS5mb3Jtcy5mb3JtMi5zaGlwLW5vdy10d29zdGVwJyxcclxuICAgICAgY291bnRyeXNlbGVjdDogJ2Zvcm0uZm9ybXMuZm9ybTIuc2hpcC1ub3ctdHdvc3RlcCAjc2hpcG5vd19jb3VudHJ5JyxcclxuXHJcbiAgICAgIGJ1dHRvbkZhY2Vib29rOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5mYWNlYm9vaycsXHJcbiAgICAgIGJ1dHRvbkxpbmtlZGluOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5saW5rZWRpbicsXHJcbiAgICAgIGJ1dHRvbkdvb2dsZVBsdXM6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmdvb2dsZSdcclxuICAgIH07XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgXHJcbiAgICB0aGlzLnRvZ2dsZUFkZHJlc3MgPSB0aGlzLnRvZ2dsZUFkZHJlc3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc3VibWl0RmFjZWJvb2sgPSB0aGlzLnN1Ym1pdEZhY2Vib29rLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnN1Ym1pdExpbmtlZGluID0gdGhpcy5zdWJtaXRMaW5rZWRpbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zdWJtaXRHb29nbGUgPSB0aGlzLnN1Ym1pdEdvb2dsZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zdWJtaXRGb3JtMSA9IHRoaXMuc3VibWl0Rm9ybTEuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubmV4dEZvcm0gPSB0aGlzLm5leHRGb3JtLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnN1Ym1pdEZvcm0yID0gdGhpcy5zdWJtaXRGb3JtMi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRGb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd1N1Y2Nlc3MgPSB0aGlzLnNob3dTdWNjZXNzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdzdWJtaXQnLCB0aGlzLnNlbC5mb3JtMSwgdGhpcy5zdWJtaXRGb3JtMSk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignc3VibWl0JywgdGhpcy5zZWwuZm9ybTIsIHRoaXMuc3VibWl0Rm9ybTIpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsIHRoaXMuc2VsLmNvdW50cnlzZWxlY3QsIHRoaXMudG9nZ2xlQWRkcmVzcyk7XHJcblxyXG4gICAgdmFyIGNvdW50cnkgPSAkKHRoaXMuc2VsLmZvcm0yKS5kYXRhKCdwcmVzZWxlY3Rjb3VudHJ5Jyk7XHJcbiAgICBpZiAoKGNvdW50cnkgIT09IG51bGwpICYmICQudHJpbShjb3VudHJ5KS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICQodGhpcy5zZWwuY291bnRyeXNlbGVjdCkudmFsKGNvdW50cnkpLnRyaWdnZXIoJ2NoYW5nZScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykubGVuZ3RoID4gMCkge1xyXG4gICAgICB3aW5kb3cuZmJBc3luY0luaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LmZiX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LkZCKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LkZCICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5GQi5pbml0KHtcclxuICAgICAgICAgICAgICBhcHBJZDogdGhpcy5jb25maWcuZmJBcHBJZCxcclxuICAgICAgICAgICAgICBjb29raWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgeGZibWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmVyc2lvbjogJ3YyLjgnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZmJfaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhY2Vib29rLWpzc2RrJykgPT09IG51bGwpIHtcclxuICAgICAgICB2YXIgZmpzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xyXG4gICAgICAgIHZhciBqcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIGpzLmlkID0gJ2ZhY2Vib29rLWpzc2RrJztcclxuICAgICAgICBqcy5zcmMgPSAnLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9FTi9zZGsuanMnO1xyXG4gICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuICAgICAgfVxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc3VibWl0RmFjZWJvb2soZXZ0KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikubGVuZ3RoID4gMCkge1xyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc3VibWl0TGlua2VkaW4oZXZ0KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBnb29nbGVCdXR0b24gPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKTtcclxuICAgIGlmIChnb29nbGVCdXR0b24ubGVuZ3RoID4gMCkge1xyXG4gICAgICB3aW5kb3cuZ29faW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LmdhcGkpICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZ2FwaSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgd2luZG93LmdhcGkubG9hZCgnYXV0aDInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBhdXRoMiA9IHdpbmRvdy5nYXBpLmF1dGgyLmluaXQoe1xyXG4gICAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jb25maWcuZ29DbGllbnRJZCxcclxuICAgICAgICAgICAgICBjb29raWVwb2xpY3k6ICdzaW5nbGVfaG9zdF9vcmlnaW4nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBnb29nbGVCdXR0b24uZ2V0KDApO1xyXG4gICAgICAgICAgICBhdXRoMi5hdHRhY2hDbGlja0hhbmRsZXIoZWxlbWVudCwge30sXHJcbiAgICAgICAgICAgICAgKGdvb2dsZVVzZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VibWl0R29vZ2xlKGdvb2dsZVVzZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvciAhPT0gJ3BvcHVwX2Nsb3NlZF9ieV91c2VyJykge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydChyZXN1bHQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmdvX2ludGVydmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5zd2luZ2J1dHRvbiwgKGV2dCkgPT4ge1xyXG4gICAgICB2YXIgaWQgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJyk7XHJcbiAgICAgIHZhciBvZmZzZXQgPSAkKGlkKS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICBzY3JvbGxUb3A6IG9mZnNldFxyXG4gICAgICB9LCAxMDAwLCAnc3dpbmcnKTtcclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGUoKSB7XHJcbiAgICAkKHRoaXMuc2VsLmZvcm1zKS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xyXG4gICAgICAkKGl0ZW0pLnZhbGlkYXRlKHtcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5pcygnc2VsZWN0JykpIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkuZmluZCgnLnNlbGVjdGJveGl0LWJ0bicpLmFkZENsYXNzKCdlcnJvcicpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWNjZXNzOiAobGFiZWwpID0+IHtcclxuICAgICAgICAgIGxldCAkcGFyZW50ID0gJChsYWJlbCkucGFyZW50cygnZm9ybS5zaGlwLW5vdycpO1xyXG4gICAgICAgICAgaWYgKCRwYXJlbnQuZmluZCgnc2VsZWN0JykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkcGFyZW50LmZpbmQoJy5zZWxlY3Rib3hpdC1idG4nKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVBZGRyZXNzKGUpIHtcclxuICAgIHZhciB2YWwgPSAkKHRoaXMuc2VsLmNvdW50cnlzZWxlY3QpLnZhbCgpO1xyXG5cclxuICAgIHZhciBvcHRpb25zID0gJCgnb3B0aW9uJywgdGhpcy5zZWwuY291bnRyeXNlbGVjdCk7XHJcbiAgICB2YXIgbWFuZGF0b3J5ID0gdHJ1ZTtcclxuICAgIG9wdGlvbnMuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgaWYgKCQoaXRlbSkuYXR0cigndmFsdWUnKSA9PT0gdmFsICYmICgnJyArICQoaXRlbSkuZGF0YSgnbm9ubWFuZGF0b3J5JykpID09PSAndHJ1ZScpIHtcclxuICAgICAgICBtYW5kYXRvcnkgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG1hbmRhdG9yeSkge1xyXG4gICAgICAkKCcjc2hpcG5vd19hZGRyZXNzJywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdBZGRyZXNzKicpO1xyXG4gICAgICAkKCcjc2hpcG5vd196aXAnLCB0aGlzLnNlbC5mb3JtKS5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ1pJUCBvciBQb3N0Y29kZSonKTtcclxuICAgICAgJCgnI3NoaXBub3dfY2l0eScsIHRoaXMuc2VsLmZvcm0pLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQ2l0eSonKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJyNzaGlwbm93X2FkZHJlc3MnLCB0aGlzLnNlbC5mb3JtKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0FkZHJlc3MnKS5yZW1vdmVDbGFzcygnZXJyb3InKS5jbG9zZXN0KCdkaXYnKS5maW5kKCdsYWJlbCcpLnJlbW92ZSgpO1xyXG4gICAgICAkKCcjc2hpcG5vd196aXAnLCB0aGlzLnNlbC5mb3JtKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ1pJUCBvciBQb3N0Y29kZScpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmNsb3Nlc3QoJ2RpdicpLmZpbmQoJ2xhYmVsJykucmVtb3ZlKCk7XHJcbiAgICAgICQoJyNzaGlwbm93X2NpdHknLCB0aGlzLnNlbC5mb3JtKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0NpdHknKS5yZW1vdmVDbGFzcygnZXJyb3InKS5jbG9zZXN0KCdkaXYnKS5maW5kKCdsYWJlbCcpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3VibWl0RmFjZWJvb2soZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB3aW5kb3cuRkIubG9naW4oKGxvZ2luUmVzcG9uc2UpID0+IHtcclxuICAgICAgaWYgKGxvZ2luUmVzcG9uc2UuYXV0aFJlc3BvbnNlKSB7XHJcbiAgICAgICAgd2luZG93LkZCLmFwaSgnL21lJywgKGRhdGFSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5maXJzdG5hbWUgPSBkYXRhUmVzcG9uc2UuZmlyc3RfbmFtZTtcclxuICAgICAgICAgIHRoaXMubGFzdG5hbWUgPSBkYXRhUmVzcG9uc2UubGFzdF9uYW1lO1xyXG4gICAgICAgICAgdGhpcy5lbWFpbCA9IGRhdGFSZXNwb25zZS5lbWFpbDtcclxuXHJcbiAgICAgICAgICB0aGlzLm5leHRGb3JtKCk7XHJcbiAgICAgICAgfSwgeyBmaWVsZHM6IFsgJ2lkJywgJ2VtYWlsJywgJ2ZpcnN0X25hbWUnLCAnbGFzdF9uYW1lJyBdfSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSwgeyBzY29wZTogJ2VtYWlsLHB1YmxpY19wcm9maWxlJywgcmV0dXJuX3Njb3BlczogdHJ1ZSB9KTtcclxuICB9XHJcblxyXG4gIHN1Ym1pdExpbmtlZGluKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgSU4uVXNlci5hdXRob3JpemUoKCkgPT4ge1xyXG4gICAgICBJTi5BUEkuUHJvZmlsZSgnbWUnKS5maWVsZHMoJ2lkJywgJ2ZpcnN0LW5hbWUnLCAnbGFzdC1uYW1lJywgJ2VtYWlsLWFkZHJlc3MnKS5yZXN1bHQoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIHZhciBtZW1iZXIgPSByZXN1bHQudmFsdWVzWzBdO1xyXG5cclxuICAgICAgICB0aGlzLmZpcnN0bmFtZSA9IG1lbWJlci5maXJzdE5hbWU7XHJcbiAgICAgICAgdGhpcy5sYXN0bmFtZSA9IG1lbWJlci5sYXN0TmFtZTtcclxuICAgICAgICB0aGlzLmVtYWlsID0gbWVtYmVyLmVtYWlsQWRkcmVzcztcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0Rm9ybSgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHdpbmRvdy5JTi5Vc2VyLmlzQXV0aG9yaXplZCgpO1xyXG4gICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgSU4uQVBJLlByb2ZpbGUoJ21lJykuZmllbGRzKCdpZCcsICdmaXJzdC1uYW1lJywgJ2xhc3QtbmFtZScsICdlbWFpbC1hZGRyZXNzJykucmVzdWx0KChyZXN1bHQpID0+IHtcclxuICAgICAgICAgIHZhciBtZW1iZXIgPSByZXN1bHQudmFsdWVzWzBdO1xyXG4gIFxyXG4gICAgICAgICAgdGhpcy5maXJzdG5hbWUgPSBtZW1iZXIuZmlyc3ROYW1lO1xyXG4gICAgICAgICAgdGhpcy5sYXN0bmFtZSA9IG1lbWJlci5sYXN0TmFtZTtcclxuICAgICAgICAgIHRoaXMuZW1haWwgPSBtZW1iZXIuZW1haWxBZGRyZXNzO1xyXG4gIFxyXG4gICAgICAgICAgdGhpcy5uZXh0Rm9ybSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBzdWJtaXRHb29nbGUoZ29vZ2xlVXNlcikge1xyXG4gICAgdmFyIGJhc2ljUHJvZmlsZSA9IGdvb2dsZVVzZXIuZ2V0QmFzaWNQcm9maWxlKCk7XHJcblxyXG4gICAgdGhpcy5maXJzdG5hbWUgPSBiYXNpY1Byb2ZpbGUuZ2V0R2l2ZW5OYW1lKCk7XHJcbiAgICB0aGlzLmxhc3RuYW1lID0gYmFzaWNQcm9maWxlLmdldEZhbWlseU5hbWUoKTtcclxuICAgIHRoaXMuZW1haWwgPSBiYXNpY1Byb2ZpbGUuZ2V0RW1haWwoKTtcclxuXHJcbiAgICB0aGlzLm5leHRGb3JtKCk7XHJcbiAgfVxyXG5cclxuICBzdWJtaXRGb3JtMShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgJGZvcm0gPSAkKGUudGFyZ2V0KTtcclxuICAgIGxldCBmb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEoJGZvcm0pO1xyXG5cclxuICAgIHRoaXMuZmlyc3RuYW1lID0gZm9ybURhdGEuZmlyc3RuYW1lO1xyXG4gICAgdGhpcy5sYXN0bmFtZSA9IGZvcm1EYXRhLmxhc3RuYW1lO1xyXG4gICAgdGhpcy5lbWFpbCA9IGZvcm1EYXRhLmVtYWlsO1xyXG5cclxuICAgIHRoaXMubmV4dEZvcm0oKTtcclxuICB9XHJcblxyXG4gIG5leHRGb3JtKCkge1xyXG4gICAgJCgnLnNoaXBOb3dNdWx0aV9fZm9ybXN0ZXAtLXN0ZXAxJywgdGhpcy5zZWwuY29tcG9uZW50KS5oaWRlKCk7XHJcbiAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDInLCB0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBzdWJtaXRGb3JtMihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgJGZvcm0gPSAkKGUudGFyZ2V0KTtcclxuICAgIGxldCBmb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEoJGZvcm0pO1xyXG4gICAgZm9ybURhdGEuZmlyc3RuYW1lID0gdGhpcy5maXJzdG5hbWU7XHJcbiAgICBmb3JtRGF0YS5sYXN0bmFtZSA9IHRoaXMubGFzdG5hbWU7XHJcbiAgICBmb3JtRGF0YS5lbWFpbCA9IHRoaXMuZW1haWw7XHJcblxyXG4gICAgJC5wb3N0KCRmb3JtLmF0dHIoJ2FjdGlvbicpLCBmb3JtRGF0YSwgKGRhdGEpID0+IHtcclxuICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnT0snKSB7XHJcbiAgICAgICAgdGhpcy5zaG93U3VjY2VzcygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZC4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRGb3JtRGF0YSgkZm9ybSkge1xyXG4gICAgbGV0IHVuaW5kZXhlZEFycmF5ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcclxuICAgIGxldCBpbmRleGVkQXJyYXkgPSB7fTtcclxuICAgICQubWFwKHVuaW5kZXhlZEFycmF5LCAobikgPT4gKGluZGV4ZWRBcnJheVtuLm5hbWVdID0gbi52YWx1ZSkpO1xyXG5cclxuICAgIGluZGV4ZWRBcnJheS5zb3VyY2UgPSAkLnRyaW0oJGZvcm0uZGF0YSgnc291cmNlJykpO1xyXG5cclxuICAgIHJldHVybiBpbmRleGVkQXJyYXk7XHJcbiAgfVxyXG5cclxuICBzaG93U3VjY2VzcygpIHtcclxuICAgIHZhciB0aGFua3MgPSAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDInLCB0aGlzLnNlbC5jb21wb25lbnQpLmRhdGEoXCJ0aGFua3NcIik7XHJcbiAgICBpZiAoKHRoYW5rcyAhPT0gbnVsbCkgJiYgKHRoYW5rcy5sZW5ndGggPiAwKSkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGFua3M7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDInLCB0aGlzLnNlbC5jb21wb25lbnQpLmhpZGUoKTtcclxuICAgICAgJCgnLnNoaXBOb3dNdWx0aV9fZm9ybXN0ZXAtLXRoYW5rcycsIHRoaXMuc2VsLmNvbXBvbmVudCkuc2hvdygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgdGhpcy52YWxpZGF0ZSgpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgU2hpcE5vd1R3b1N0ZXBGb3JtKCk7XHJcbiIsImNsYXNzIFNob3dIaWRlIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICdbZGF0YS1zaG93LWhpZGUtaWRdJyxcclxuICAgICAgdG9nZ2xlOiAnW2RhdGEtc2hvdy1oaWRlLXRhcmdldF0nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC50b2dnbGUsIChlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNob3dIaWRlVGFyZ2V0ID0gJChlLnRhcmdldCkuYXR0cignZGF0YS1zaG93LWhpZGUtdGFyZ2V0Jyk7XHJcbiAgICAgICQoJ1tkYXRhLXNob3ctaGlkZS1pZD0nICsgc2hvd0hpZGVUYXJnZXQgKyAnXScpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBTaG93SGlkZSgpO1xyXG4iLCJjbGFzcyBTb2NpYWwge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5zb2NpYWwnXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jb250YWluZXJUb3AgPSB0aGlzLmNvbnRhaW5lclRvcC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oYW5kbGVTY3JvbGwgPSB0aGlzLmhhbmRsZVNjcm9sbC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGVja1NoYXJlUG9zID0gdGhpcy5jaGVja1NoYXJlUG9zLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmRlYm91bmNlID0gdGhpcy5kZWJvdW5jZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuaGFuZGxlU2Nyb2xsKTtcclxuICB9XHJcblxyXG4gIGNvbnRhaW5lclRvcCgpIHtcclxuICAgIHJldHVybiAkKHRoaXMuc2VsLmNvbXBvbmVudCkucGFyZW50KCkucG9zaXRpb24oKS50b3A7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVTY3JvbGwoKSB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gOTkyKSB7XHJcbiAgICAgIGxldCBoZWlnaHQgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcbiAgICAgIGxldCBib3R0b20gPSB0aGlzLmNvbnRhaW5lclRvcCgpICsgJCh0aGlzLnNlbC5jb21wb25lbnQpLnBhcmVudCgpLmhlaWdodCgpIC0gJCh0aGlzLnNlbC5jb21wb25lbnQpLm91dGVySGVpZ2h0KCkgLSA2MDtcclxuICAgICAgaWYgKGhlaWdodCA+PSB0aGlzLmNvbnRhaW5lclRvcCgpICYmIGhlaWdodCA8IGJvdHRvbSAmJiAhJCh0aGlzLnNlbC5jb21wb25lbnQpLmhhc0NsYXNzKCdzb2NpYWwtLWFmZml4JykpIHtcclxuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudClcclxuICAgICAgICAgIC5hZGRDbGFzcygnc29jaWFsLS1hZmZpeCcpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2xlZnQnOiB0aGlzLmdldExlZnRPZmZzZXQoJCh0aGlzLnNlbC5jb21wb25lbnQpKSxcclxuICAgICAgICAgICAgJ3RvcCc6ICcnXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmIChoZWlnaHQgPCB0aGlzLmNvbnRhaW5lclRvcCgpICYmICQodGhpcy5zZWwuY29tcG9uZW50KS5oYXNDbGFzcygnc29jaWFsLS1hZmZpeCcpKSB7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpXHJcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NvY2lhbC0tYWZmaXgnKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdsZWZ0JzogJycsXHJcbiAgICAgICAgICAgICd0b3AnOiAnJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaGVpZ2h0ID49IGJvdHRvbSAmJiAkKHRoaXMuc2VsLmNvbXBvbmVudCkuaGFzQ2xhc3MoJ3NvY2lhbC0tYWZmaXgnKSkge1xyXG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KVxyXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCdzb2NpYWwtLWFmZml4JylcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnbGVmdCc6ICcnLFxyXG4gICAgICAgICAgICAndG9wJzogdGhpcy5nZXRUb3BPZmZzZXQoKVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldExlZnRPZmZzZXQoJGVsbSkge1xyXG4gICAgbGV0IHBhcmVudE9mZnNldCA9IHBhcnNlSW50KCRlbG0ucGFyZW50KCkub2Zmc2V0KCkubGVmdCwgMTApO1xyXG4gICAgbGV0IG15T2Zmc2V0ID0gcGFyc2VJbnQoJGVsbS5vZmZzZXQoKS5sZWZ0LCAxMCk7XHJcbiAgICByZXR1cm4gKHBhcmVudE9mZnNldCArIG15T2Zmc2V0KTtcclxuICB9XHJcblxyXG4gIGdldFRvcE9mZnNldCgpIHtcclxuICAgIGxldCBwYXJlbnRPZmZzZXQgPSB0aGlzLmNvbnRhaW5lclRvcCgpO1xyXG4gICAgbGV0IHNjcm9sbFBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuICAgIGxldCB0b3AgPSBzY3JvbGxQb3MgLSBwYXJlbnRPZmZzZXQgKyA1MDtcclxuICAgIHJldHVybiB0b3A7XHJcbiAgfVxyXG5cclxuICBjaGVja1NoYXJlUG9zKCkge1xyXG4gICAgaWYgKCQoJy5zb2NpYWwtLXZlcnRpY2FsLnNvY2lhbC0tYWZmaXgnKS5sZW5ndGgpIHtcclxuICAgICAgJCgnLnNvY2lhbC0tdmVydGljYWwuc29jaWFsLS1hZmZpeCcpLnJlbW92ZUF0dHIoJ3N0eWxlJykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC0tYWZmaXgnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIERlYm91dGNlIGZ1bmN0aW9uXHJcbiAgZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XHJcbiAgICB2YXIgdGltZW91dDtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcclxuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcclxuICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgfTtcclxuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xyXG4gICAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5kZWJvdW5jZSh0aGlzLmNoZWNrU2hhcmVQb3MsIDEwMCkpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgU29jaWFsKCk7XHJcbiIsImNsYXNzIFN1YnNjcmliZVBhbmVsIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuc3Vic2NyaWJlUGFuZWwnLFxyXG4gICAgICBmb3JtOiAnLnN1YnNjcmliZVBhbmVsX19mb3JtJyxcclxuICAgICAgc3VjY2Vzc092ZXJsYXk6ICcuc3Vic2NyaWJlUGFuZWxfX3Jlc3BvbnNlT3ZlcmxheS5zdWNjZXNzJyxcclxuICAgICAgZXJyb3JPdmVybGF5OiAnLnN1YnNjcmliZVBhbmVsX19yZXNwb25zZU92ZXJsYXkuZXJyb3InXHJcbiAgICB9O1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc3VibWl0Rm9ybSA9IHRoaXMuc3VibWl0Rm9ybS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRGb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd1N1Y2Nlc3MgPSB0aGlzLnNob3dTdWNjZXNzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dFcnJvciA9IHRoaXMuc2hvd0Vycm9yLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdzdWJtaXQnLCB0aGlzLnNlbC5mb3JtLCB0aGlzLnN1Ym1pdEZvcm0pO1xyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGUoKSB7XHJcbiAgICAkKHRoaXMuc2VsLmZvcm0pLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICQoaXRlbSkudmFsaWRhdGUoe1xyXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmlzKCdzZWxlY3QnKSkge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50LnBhcmVudCgpKTtcclxuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5maW5kKCcuc2VsZWN0Ym94aXQtYnRuJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1Y2Nlc3M6IChsYWJlbCkgPT4ge1xyXG4gICAgICAgICAgbGV0ICRwYXJlbnQgPSAkKGxhYmVsKS5wYXJlbnRzKCcuc3Vic2NyaWJlX19mb3JtRmllbGQnKTtcclxuICAgICAgICAgIGlmICgkcGFyZW50LmZpbmQoJ3NlbGVjdCcpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJHBhcmVudC5maW5kKCcuc2VsZWN0Ym94aXQtYnRuJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3VibWl0Rm9ybShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgJGZvcm0gPSAkKGUudGFyZ2V0KTtcclxuICAgIGxldCBmb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEoJGZvcm0pO1xyXG4gICAgJC5wb3N0KCRmb3JtLmF0dHIoJ2FjdGlvbicpLCBmb3JtRGF0YSwgKGRhdGEpID0+IHtcclxuICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnT0snKSB7XHJcbiAgICAgICAgdGhpcy5zaG93U3VjY2VzcygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2hvd0Vycm9yKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Rm9ybURhdGEoJGZvcm0pIHtcclxuICAgIGxldCB1bmluZGV4ZWRBcnJheSA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICBsZXQgaW5kZXhlZEFycmF5ID0ge307XHJcbiAgICAkLm1hcCh1bmluZGV4ZWRBcnJheSwgKG4pID0+IChpbmRleGVkQXJyYXlbbi5uYW1lXSA9IG4udmFsdWUpKTtcclxuICAgIHJldHVybiBpbmRleGVkQXJyYXk7XHJcbiAgfVxyXG5cclxuICBzaG93U3VjY2VzcygpIHtcclxuICAgICQodGhpcy5zZWwuc3VjY2Vzc092ZXJsYXkpLmFkZENsYXNzKCdzdWJzY3JpYmVQYW5lbF9fcmVzcG9uc2VPdmVybGF5LS1zaG93Jyk7XHJcbiAgfVxyXG5cclxuICBzaG93RXJyb3IoKSB7XHJcbiAgICAkKHRoaXMuc2VsLmVycm9yT3ZlcmxheSkuYWRkQ2xhc3MoJ3N1YnNjcmliZVBhbmVsX19yZXNwb25zZU92ZXJsYXktLXNob3cnKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHRoaXMudmFsaWRhdGUoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IFN1YnNjcmliZVBhbmVsKCk7XHJcbiIsImNsYXNzIFRvYXN0IHtcclxuICBjb25zdHJ1Y3Rvcih0ZXh0LCBkdXJhdGlvbikge1xyXG4gICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuICAgIHRoaXMuaWQgPSAnXycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgOSk7XHJcblxyXG4gICAgdGhpcy5zZXRUZXh0ID0gdGhpcy5zZXRUZXh0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNldER1cmF0aW9uID0gdGhpcy5zZXREdXJhdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zaG93ID0gdGhpcy5zaG93LmJpbmQodGhpcyk7XHJcblxyXG4gICAgbGV0IHRvYXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b2FzdC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XHJcbiAgICB0b2FzdC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RvYXN0Jyk7XHJcbiAgICBsZXQgaW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGlubmVyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnaW5uZXInKTtcclxuICAgIGlubmVyLmlubmVyVGV4dCA9IHRoaXMudGV4dDtcclxuICAgIHRvYXN0LmFwcGVuZENoaWxkKGlubmVyKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9hc3QpO1xyXG4gICAgdGhpcy4kdG9hc3QgPSAkKCcjJyArIHRoaXMuaWQpO1xyXG4gIH1cclxuXHJcbiAgc2V0VGV4dCh0ZXh0KSB7XHJcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgdGhpcy4kdG9hc3QuZmluZCgnLmlubmVyJykudGV4dCh0aGlzLnRleHQpO1xyXG4gIH1cclxuXHJcbiAgc2V0RHVyYXRpb24oZHVyYXRpb24pIHtcclxuICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcclxuICB9XHJcblxyXG4gIHNob3coKSB7XHJcbiAgICB0aGlzLiR0b2FzdC5hZGRDbGFzcygnc2hvdycpO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLiR0b2FzdC5yZW1vdmVDbGFzcygnc2hvdycpO1xyXG4gICAgfSwgdGhpcy5kdXJhdGlvbik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUb2FzdDtcclxuIiwiY2xhc3MgTG9naW5Gb3JtIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuY29uZmlnID0ge1xyXG4gICAgICB1cmxUb2tlbjogJy9saWJzL2dyYW5pdGUvY3NyZi90b2tlbi5qc29uJyxcclxuICAgICAgdXJsUmVmcmVzaENoZWNrOiAnL2Jpbi9kaGwvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcclxuICAgICAgdXJsR2V0QWxsRGV0YWlsczogJy9iaW4vZGhsL2dldGRldGFpbHMvaW5kZXguanNvbicsXHJcbiAgICAgIHVybFVwZGF0ZURldGFpbHM6ICcvYmluL2RobC91cGRhdGVfZGV0YWlscy9pbmRleC5qc29uJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLnN0YW5kYXJkQ29udGVudC51c2VyLWFjY291bnQsIC5wYWdlLWJvZHkudXNlci1hY2NvdW50J1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZWFkQ29va2llID0gdGhpcy5yZWFkQ29va2llLmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy50cnlVcGRhdGVEZXRhaWxzID0gdGhpcy50cnlVcGRhdGVEZXRhaWxzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNvbXBsZXRlVXBkYXRlRGV0YWlscyA9IHRoaXMuY29tcGxldGVVcGRhdGVEZXRhaWxzLmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5sb2dnZWRJbiA9IHRoaXMubG9nZ2VkSW4uYmluZCh0aGlzKTtcclxuICAgIHRoaXMubm90TG9nZ2VkSW4gPSB0aGlzLm5vdExvZ2dlZEluLmJpbmQodGhpcyk7XHJcbiAgfVxyXG4gIFxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJsb2dnZWRpbi5ESEwnLCAoZXZ0LCB0b2tlbkRhdGEpID0+IHtcclxuICAgICAgdGhpcy5sb2dnZWRJbih0b2tlbkRhdGEpO1xyXG4gICAgfSk7XHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJub3Rsb2dnZWRpbi5ESEwnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubm90TG9nZ2VkSW4oKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBmb3JtID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGlmIChmb3JtLmxlbmd0aCA+IDApIHtcclxuICAgICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ215QWNjb3VudEN1cnJlbnRQYXNzd29yZCcsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIHZhciAkcGFyZW50ID0gJChlbGVtZW50KS5wYXJlbnRzKCdmb3JtJyk7XHJcbiAgICAgICAgdmFyICRjdXJyZW50UGFzc3dvcmRDb250YWluZXIgPSAkcGFyZW50LmZpbmQoJy51c2VyYWNjb3VudC1jdXJyZW50cGFzc3dvcmQnKTtcclxuICAgICAgICB2YXIgJG5ld1Bhc3N3b3JkID0gJHBhcmVudC5maW5kKCdpbnB1dFtuYW1lPVwibXlBY2NvdW50X19uZXdQYXNzd29yZFwiXScpO1xyXG4gICAgICAgIHZhciAkY29uZmlybVBhc3N3b3JkID0gJHBhcmVudC5maW5kKCdpbnB1dFtuYW1lPVwibXlBY2NvdW50X19jb25maXJtUGFzc3dvcmRcIl0nKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICgoJG5ld1Bhc3N3b3JkLnZhbCgpID09PSAnJyAmJiAkY29uZmlybVBhc3N3b3JkLnZhbCgpID09PSAnJykgfHwgKCRjdXJyZW50UGFzc3dvcmRDb250YWluZXIuaXMoJzp2aXNpYmxlJykgJiYgJChlbGVtZW50KS52YWwoKSAhPT0gJycpKTtcclxuICAgICAgfSwgJ1lvdSBtdXN0IGVudGVyIHlvdXIgY3VycmVudCBwYXNzd29yZCcpO1xyXG5cclxuICAgICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ215QWNjb3VudFBhc3N3b3JkJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKCQoZWxlbWVudCkudmFsKCkgPT09ICcnKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cCgvXig/PS4qW2Etel0pKD89LipbQS1aXSkoPz0uKlxcZCkoPz0uKltfXFxXXSlbQS1aYS16XFxkX1xcV117OCx9JC8pLnRlc3QodmFsdWUpO1xyXG4gICAgICB9LCAnUGFzc3dvcmQgZm9ybWF0IGlzIG5vdCB2YWxpZCcpO1xyXG5cclxuICAgICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ215QWNjb3VudEVxdWFsVG8nLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICByZXR1cm4gKCQoJyMnICsgJChlbGVtZW50KS5hdHRyKCdkYXRhLWVxdWFsVG8nKSkudmFsKCkgPT09ICQoZWxlbWVudCkudmFsKCkpO1xyXG4gICAgICB9LCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpO1xyXG5cclxuICAgICAgZm9ybS52YWxpZGF0ZSh7XHJcbiAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgIG15QWNjb3VudF9fY3VycmVudFBhc3N3b3JkOiAnbXlBY2NvdW50Q3VycmVudFBhc3N3b3JkJyxcclxuICAgICAgICAgIG15QWNjb3VudF9fbmV3UGFzc3dvcmQ6ICdteUFjY291bnRQYXNzd29yZCcsXHJcbiAgICAgICAgICBteUFjY291bnRfX2NvbmZpcm1QYXNzd29yZDogJ215QWNjb3VudEVxdWFsVG8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcclxuICAgICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybUVsZW1lbnQpID0+IHtcclxuICAgICAgICAgIHRoaXMudHJ5VXBkYXRlRGV0YWlscyhmb3JtRWxlbWVudCk7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlYWRDb29raWUobmFtZSkge1xyXG4gICAgdmFyIG5hbWVFUSA9IG5hbWUgKyAnPSc7XHJcbiAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGMgPSBjYVtpXTtcclxuICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XHJcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHRyeVVwZGF0ZURldGFpbHMoZm9ybSkge1xyXG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XHJcbiAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuXHJcbiAgICB2YXIgY29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuQXV0aFRva2VuJyk7XHJcbiAgICBpZiAoY29va2llICE9PSBudWxsKSB7XHJcbiAgICAgIHZhciBzcGxpdCA9IGNvb2tpZS5zcGxpdCgnfCcpO1xyXG4gICAgICBpZiAoc3BsaXQubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAkLmdldCh0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLmNvbmZpZy51cmxHZXRBbGxEZXRhaWxzLFxyXG4gICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiBzcGxpdFswXSwgdG9rZW46IHNwbGl0WzFdIH0sXHJcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIGFsbERldGFpbHNSZXNwb25zZSwgdHJ1ZSBdKTtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGV0ZVVwZGF0ZURldGFpbHMoZm9ybSwgYWxsRGV0YWlsc1Jlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoMSkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICgyKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICgzKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgcmVmcmVzaENvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicpO1xyXG4gICAgICBpZiAocmVmcmVzaENvb2tpZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIHZhciByZWZyZXNoU3BsaXQgPSByZWZyZXNoQ29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgaWYgKHJlZnJlc2hTcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgJC5nZXQodGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgIHVybDogdGhpcy5jb25maWcudXJsUmVmcmVzaENoZWNrLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHJlZnJlc2hTcGxpdFswXSwgcmVmcmVzaF90b2tlbjogcmVmcmVzaFNwbGl0WzFdIH0sXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZWZyZXNoUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgcmVmcmVzaFJlc3BvbnNlLCB0cnVlIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJ5VXBkYXRlRGV0YWlscyhmb3JtKTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDQpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoNSkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoNikuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29tcGxldGVVcGRhdGVEZXRhaWxzKGZvcm0sIGRldGFpbHMpIHtcclxuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xyXG5cclxuICAgIHZhciBuZXdlbWFpbCA9IGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2VtYWlsJykudmFsKCk7XHJcbiAgICBpZiAobmV3ZW1haWwudHJpbSgpID09PSBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9lbWFpbCkge1xyXG4gICAgICBuZXdlbWFpbCA9ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjYXRlZ29yaWVzID0gJyc7XHJcbiAgICBmcm0uZmluZCgnI2dsYi15b3VyYWNjb3VudC1jYXRlZ29yaWVzIGlucHV0OmNoZWNrZWQnKS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xyXG4gICAgICBpZiAoY2F0ZWdvcmllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY2F0ZWdvcmllcyArPSAnLCc7XHJcbiAgICAgIH1cclxuICAgICAgY2F0ZWdvcmllcyArPSAkKGl0ZW0pLnZhbCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIHRva2VuOiBkZXRhaWxzLnRva2VuLFxyXG5cclxuICAgICAgZmlyc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19maXJzdE5hbWUnKS52YWwoKSxcclxuICAgICAgbGFzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2xhc3ROYW1lJykudmFsKCksXHJcbiAgICAgIHVzZXJuYW1lOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9lbWFpbCxcclxuICAgICAgbmV3dXNlcm5hbWU6IG5ld2VtYWlsLFxyXG5cclxuICAgICAgcGFzc3dvcmQ6IGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2N1cnJlbnRQYXNzd29yZCcpLnZhbCgpLFxyXG4gICAgICBuZXdwYXNzd29yZDogZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fbmV3UGFzc3dvcmQnKS52YWwoKSxcclxuXHJcbiAgICAgIHBvc2l0aW9uOiBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19wb3NpdGlvbicpLnZhbCgpLFxyXG4gICAgICBjb250YWN0OiBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19waG9uZU51bWJlcicpLnZhbCgpLFxyXG4gICAgICBzaXplOiBmcm0uZmluZCgnc2VsZWN0I215QWNjb3VudF9fYnVzaW5lc3NTaXplJykudmFsKCksXHJcbiAgICAgIHNlY3RvcjogZnJtLmZpbmQoJ3NlbGVjdCNteUFjY291bnRfX2J1c2luZXNzU2VjdG9yJykudmFsKCksXHJcblxyXG4gICAgICB0Y2FncmVlOiBmcm0uZmluZCgnaW5wdXQjY2hlY2tib3hJZFRDTWVzc2FnZScpLmlzKCc6Y2hlY2tlZCcpLFxyXG5cclxuICAgICAgY2F0czogY2F0ZWdvcmllc1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoKCQudHJpbShkYXRhLmZpcnN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEubGFzdG5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShkYXRhLnVzZXJuYW1lKS5sZW5ndGggPT09IDApKSB7XHJcbiAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgeW91ciBuYW1lLCBlbWFpbCBhZGRyZXNzIGFuZCBwZXJzb25hbCBkZXRhaWxzLicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J10udXBkYXRlLWJ0blwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xyXG5cclxuICAgICAgJC5nZXQodGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdGhpcy5jb25maWcudXJsVXBkYXRlRGV0YWlscyxcclxuICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogKHVwZGF0ZURldGFpbHNSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodXBkYXRlRGV0YWlsc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHVwZGF0ZURldGFpbHNSZXNwb25zZSwgdHJ1ZSBdKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHVwZGF0ZURldGFpbHNSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgIGZybS5maW5kKCcubXlBY2NvdW50X19tZXNzYWdlJykuc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLm5ld3Bhc3N3b3JkLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fZW1haWwnKS5yZW1vdmVBdHRyKCdyZWFkb25seScpO1xyXG4gICAgICAgICAgICAgICAgICBmcm0uZmluZCgnLnVzZXJhY2NvdW50LWN1cnJlbnRwYXNzd29yZCcpLnNob3coKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2N1cnJlbnRQYXNzd29yZCcpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19uZXdQYXNzd29yZCcpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19jb25maXJtUGFzc3dvcmQnKS52YWwoJycpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoJ2hlYWRlciAuaGVhZGVyX19hdXRoLS1sb2dnZWRpbiAudXNlci1maXJzdG5hbWUnKS50ZXh0KGRhdGEuZmlyc3RuYW1lKTtcclxuICAgICAgICAgICAgICAgICQoJy5jb21wZXRpdGlvbkRhdGFDYXB0dXJlLmxvZ2dlZC1pbiAubG9nZ2VkaW4tbmFtZScpLnRleHQoZGF0YS5maXJzdG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgwKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscy5cXG4nICsgdXBkYXRlRGV0YWlsc1Jlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J10udXBkYXRlLWJ0blwiKS50ZXh0KCdVcGRhdGUnKTtcclxuICAgICAgICAgICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgnVXBkYXRlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddLnVwZGF0ZS1idG5cIikudGV4dCgnVXBkYXRlJyk7XHJcbiAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdVcGRhdGUnKTtcclxuICB9XHJcblxyXG4gIGxvZ2dlZEluKHRva2VuRGF0YSkge1xyXG4gICAgaWYgKHRva2VuRGF0YSAmJiB0b2tlbkRhdGEuc3RhdHVzICYmIHRva2VuRGF0YS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgJC5nZXQodGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6IHRoaXMuY29uZmlnLnVybEdldEFsbERldGFpbHMsXHJcbiAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiB0b2tlbkRhdGEudXNlcm5hbWUsIHRva2VuOiB0b2tlbkRhdGEudG9rZW4gfSxcclxuICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICBzdWNjZXNzOiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudEZvcm0gPSAkKHRoaXMuc2VsLmNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgYWxsRGV0YWlsc1Jlc3BvbnNlLCB0cnVlIF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnLmxvZ2dlZGluLXVzZXJuYW1lJykudGV4dChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX2ZpcnN0bmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2ZpcnN0TmFtZScpLnZhbChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX2ZpcnN0bmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fbGFzdE5hbWUnKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9sYXN0bmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fZW1haWwnKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9lbWFpbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNteUFjY291bnRfX3Bvc2l0aW9uJykudmFsKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fcG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNteUFjY291bnRfX3Bob25lTnVtYmVyJykudmFsKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fY29udGFjdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdzZWxlY3QjbXlBY2NvdW50X19idXNpbmVzc1NpemUnKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9zaXplKTtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnc2VsZWN0I215QWNjb3VudF9fYnVzaW5lc3NTZWN0b3InKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9zZWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX3RjYWdyZWUgPT09ICd0cnVlJykge1xyXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I2NoZWNrYm94SWRUQ01lc3NhZ2UnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I2NoZWNrYm94SWRUQ01lc3NhZ2UnKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnI2dsYi15b3VyYWNjb3VudC1jYXRlZ29yaWVzIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2F0ZWdvcmllcyA9IGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fY2F0cy5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXRlZ29yaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnI2dsYi15b3VyYWNjb3VudC1jYXRlZ29yaWVzIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXVt2YWx1ZT1cIicgKyBjYXRlZ29yaWVzW2ldICsgJ1wiXScpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9pc2xpbmtlZGluID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2UuZnVsbCAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJy51c2VyYWNjb3VudC1jdXJyZW50cGFzc3dvcmQnKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19lbWFpbCcpLmF0dHIoJ3JlYWRvbmx5JywgJ3JlYWRvbmx5Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5jbG9zZXN0KCcucGFnZS1ib2R5LXdyYXBwZXInKS5yZW1vdmVDbGFzcygnYXdhaXRpbmcnKTtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uc2hvdygpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRpc3BsYXkgeW91ciBkZXRhaWxzLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZGlzcGxheSB5b3VyIGRldGFpbHMuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5vdExvZ2dlZEluKCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5oYXNDbGFzcygnbm8tcmVkaXJlY3QnKSkge1xyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9jb250ZW50L2RobC5odG1sJztcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBMb2dpbkZvcm0oKTtcclxuXHJcbiIsIi8vIEltcG9ydCBjb21wb25lbnRzXHJcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi9Db21wb25lbnRzL0hlYWRlcic7XHJcbmltcG9ydCBCb290c3RyYXBDYXJvdXNlbCBmcm9tICcuL0NvbXBvbmVudHMvQm9vdHN0cmFwQ2Fyb3VzZWwnO1xyXG5pbXBvcnQgQXJ0aWNsZUdyaWQgZnJvbSAnLi9Db21wb25lbnRzL0FydGljbGVHcmlkJztcclxuaW1wb3J0IFN1YnNjcmliZVBhbmVsIGZyb20gJy4vQ29tcG9uZW50cy9TdWJzY3JpYmVQYW5lbCc7XHJcbmltcG9ydCBQYXNzd29yZCBmcm9tICcuL0NvbXBvbmVudHMvUGFzc3dvcmQnO1xyXG5pbXBvcnQgUGFzc3dvcmRWYWxpZGl0eSBmcm9tICcuL0NvbXBvbmVudHMvUGFzc3dvcmRWYWxpZGl0eSc7XHJcbmltcG9ydCBGb3JtVmFsaWRhdGlvbiBmcm9tICcuL0NvbXBvbmVudHMvRm9ybVZhbGlkYXRpb24nO1xyXG5pbXBvcnQgU2hvd0hpZGUgZnJvbSAnLi9Db21wb25lbnRzL1Nob3dIaWRlJztcclxuaW1wb3J0IENvb2tpZUJhbm5lciBmcm9tICcuL0NvbXBvbmVudHMvQ29va2llQmFubmVyJztcclxuaW1wb3J0IFNlYXJjaEZvcm0gZnJvbSAnLi9Db21wb25lbnRzL1NlYXJjaEZvcm0nO1xyXG5pbXBvcnQgRWNvbUZvcm1zIGZyb20gJy4vQ29tcG9uZW50cy9FY29tRm9ybXMnO1xyXG5pbXBvcnQgU2hpcEZvcm0gZnJvbSAnLi9Db21wb25lbnRzL1NoaXBGb3JtJztcclxuaW1wb3J0IElFRGV0ZWN0b3IgZnJvbSAnLi9Db21wb25lbnRzL0lFRGV0ZWN0b3InO1xyXG5pbXBvcnQgU29jaWFsIGZyb20gJy4vQ29tcG9uZW50cy9Tb2NpYWwnO1xyXG5pbXBvcnQgSGVybyBmcm9tICcuL0NvbXBvbmVudHMvSGVybyc7XHJcbmltcG9ydCBBdXRoZW50aWNhdGlvbkV2ZW50cyBmcm9tICcuL0NvbXBvbmVudHMvQXV0aGVudGljYXRpb25FdmVudHMnO1xyXG5pbXBvcnQgRGVsZXRlQWNjb3VudEZvcm0gZnJvbSAnLi9Db21wb25lbnRzL0RlbGV0ZUFjY291bnRGb3JtJztcclxuaW1wb3J0IExvZ2luRm9ybSBmcm9tICcuL0NvbXBvbmVudHMvTG9naW5Gb3JtJztcclxuaW1wb3J0IFBhc3N3b3JkUmVtaW5kZXJGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9QYXNzd29yZFJlbWluZGVyRm9ybSc7XHJcbmltcG9ydCBSZWdpc3RlckZvcm0gZnJvbSAnLi9Db21wb25lbnRzL1JlZ2lzdGVyRm9ybSc7XHJcbmltcG9ydCBZb3VyQWNjb3VudEZvcm0gZnJvbSAnLi9Db21wb25lbnRzL1lvdXJBY2NvdW50Rm9ybSc7XHJcbmltcG9ydCBTaGlwTm93Rm9ybSBmcm9tICcuL0NvbXBvbmVudHMvU2hpcE5vd0Zvcm0nO1xyXG5pbXBvcnQgU2hpcE5vd1R3b1N0ZXBGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9TaGlwTm93VHdvU3RlcEZvcm0nO1xyXG5pbXBvcnQgQ29tcGV0aXRpb25Gb3JtIGZyb20gJy4vQ29tcG9uZW50cy9Db21wZXRpdGlvbkZvcm0nO1xyXG5pbXBvcnQgU2VydmljZVdvcmtlciBmcm9tICcuL0NvbXBvbmVudHMvU2VydmljZVdvcmtlcic7XHJcbmltcG9ydCBPZmZsaW5lIGZyb20gJy4vQ29tcG9uZW50cy9PZmZsaW5lJztcclxuaW1wb3J0IExhbmRpbmdQb2ludHMgZnJvbSAnLi9Db21wb25lbnRzL0xhbmRpbmdQb2ludHMnO1xyXG5pbXBvcnQgQmFja0J1dHRvbiBmcm9tICcuL0NvbXBvbmVudHMvQmFja0J1dHRvbic7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3RvdWNoJyk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgLy8gbm90aGluZ1xyXG4gIH1cclxuICAvLyBJbml0aWF0ZSBjb21wb25lbnRzXHJcbiAgSUVEZXRlY3Rvci5pbml0KCk7XHJcbiAgSGVhZGVyLmluaXQoKTtcclxuICBCb290c3RyYXBDYXJvdXNlbC5pbml0KCk7XHJcbiAgQXJ0aWNsZUdyaWQuaW5pdCgpO1xyXG4gIFN1YnNjcmliZVBhbmVsLmluaXQoKTtcclxuICBQYXNzd29yZC5pbml0KCk7XHJcbiAgUGFzc3dvcmRWYWxpZGl0eS5pbml0KCk7XHJcbiAgLy8gRm9ybVZhbGlkYXRpb24uaW5pdCgpO1xyXG4gIFNob3dIaWRlLmluaXQoKTtcclxuICBDb29raWVCYW5uZXIuaW5pdCgpO1xyXG4gIFNlYXJjaEZvcm0uaW5pdCgpO1xyXG4gIEVjb21Gb3Jtcy5pbml0KCk7XHJcbiAgU2hpcEZvcm0uaW5pdCgpO1xyXG4gIFNvY2lhbC5pbml0KCk7XHJcbiAgSGVyby5pbml0KCk7XHJcbiAgQ29tcGV0aXRpb25Gb3JtLmluaXQoKTtcclxuICBTaGlwTm93Rm9ybS5pbml0KCk7XHJcbiAgU2hpcE5vd1R3b1N0ZXBGb3JtLmluaXQoKTtcclxuICBZb3VyQWNjb3VudEZvcm0uaW5pdCgpO1xyXG4gIFJlZ2lzdGVyRm9ybS5pbml0KCk7XHJcbiAgUGFzc3dvcmRSZW1pbmRlckZvcm0uaW5pdCgpO1xyXG4gIExvZ2luRm9ybS5pbml0KCk7XHJcbiAgRGVsZXRlQWNjb3VudEZvcm0uaW5pdCgpO1xyXG4gIEF1dGhlbnRpY2F0aW9uRXZlbnRzLmluaXQoKTtcclxuICBTZXJ2aWNlV29ya2VyLmluaXQoKTtcclxuICBPZmZsaW5lLmluaXQoKTtcclxuICBMYW5kaW5nUG9pbnRzLmluaXQoKTtcclxuICBCYWNrQnV0dG9uLmluaXQoKTtcclxufSk7XHJcbiJdfQ==
