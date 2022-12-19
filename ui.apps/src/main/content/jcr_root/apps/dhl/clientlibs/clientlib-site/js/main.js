(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ArticleCounter = function () {
  function ArticleCounter() {
    _classCallCheck(this, ArticleCounter);

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.init = this.init.bind(this);
  }

  _createClass(ArticleCounter, [{
    key: 'getPathPrefix',
    value: function getPathPrefix() {
      var prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
      return prefix ? prefix : '';
    }
  }, {
    key: 'init',
    value: function init() {
      // /apps/dhl/discoverdhlapi/counter/index.json
      // p = /content/dhl/XXXX
      var articlePage = $('.page-body.article-counter');
      if (articlePage.length > 0) {
        var path = articlePage.data('path');
        if ($.trim(path).length > 0) {
          var data = {
            p: path
          };
          $.post(this.getPathPrefix() + '/apps/dhl/discoverdhlapi/counter/index.json', data);
        }
      }
    }
  }]);

  return ArticleCounter;
}();

exports.default = new ArticleCounter();

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
      urlCheck: '/apps/dhl/discoverdhlapi/check/index.json',
      urlRefreshCheck: '/apps/dhl/discoverdhlapi/refresh_token/index.json',
      urlDownloadAsset: '/apps/dhl/discoverdhlapi/download_asset/index.json'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
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
    key: 'getPathPrefix',
    value: function getPathPrefix() {
      var prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
      return prefix ? prefix : '';
    }
  }, {
    key: 'getPathHome',
    value: function getPathHome() {
      var home = $('head meta[name=\'dhl-path-home\']').attr('content');
      return home ? home : '';
    }
  }, {
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
          this.callTokenCheck(this.getPathPrefix() + this.config.urlCheck, {
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
            this.callTokenCheck(this.getPathPrefix() + this.config.urlRefreshCheck, {
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

      $.get(this.getPathPrefix() + this.config.urlToken, function (csrfresponse) {
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
        window.location = this.getPathPrefix() + this.getPathHome();
      }
      if ($('.page-body.register').length > 0) {
        window.location = this.getPathPrefix() + this.getPathHome();
      }

      if ($('.gatingArticle__actions.logged-in').length > 0) {
        var gatingArticleElm1 = $('.gatingArticle__actions.logged-in');

        $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;
          $.ajax({
            url: _this3.getPathPrefix() + _this3.config.urlDownloadAsset,
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

      if ($('#download .DHLdownload__ctas.logged-in').length > 0) {
        var gatingArticleElm2 = $('#download .DHLdownload__ctas.logged-in');

        $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;
          $.ajax({
            url: _this3.getPathPrefix() + _this3.config.urlDownloadAsset,
            data: { assetinfo: gatingArticleElm2.data('assetinfo') },
            type: 'post',
            headers: { 'CSRF-Token': csrftoken },
            dataType: 'json',
            success: function success(response) {
              if (response.status === 'ok') {
                gatingArticleElm2.find('.DHLdownload__cta--red').attr('href', response.href);
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
      $('#download .DHLdownload__ctas.no-logged-in').show();
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
      urlRefreshCheck: '/apps/dhl/discoverdhlapi/refresh_token/index.json',
      urlGetAllDetails: '/apps/dhl/discoverdhlapi/getdetails/index.json',
      urlCompetition: '/apps/dhl/discoverdhlapi/competition/index.json'
    };

    this.sel = {
      component: '.competitionDataCapture form'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
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
    key: 'getPathPrefix',
    value: function getPathPrefix() {
      var prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
      return prefix ? prefix : '';
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

        $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;

          $.ajax({
            url: _this2.getPathPrefix() + _this2.config.urlCompetition,
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
          $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
            var csrftoken = tokenresponse.token;
            $.ajax({
              url: _this3.getPathPrefix() + _this3.config.urlGetAllDetails,
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
            $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
              var csrftoken = tokenresponse.token;
              $.ajax({
                url: _this3.getPathPrefix() + _this3.config.urlRefreshCheck,
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

        $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;
          $.ajax({
            url: _this4.getPathPrefix() + _this4.config.urlCompetition,
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"./Constants":7}],10:[function(require,module,exports){
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
      urlRefreshCheck: '/apps/dhl/discoverdhlapi/refresh_token/index.json',
      urlGetAllDetails: '/apps/dhl/discoverdhlapi/getdetails/index.json',
      urlDeleteAccount: '/apps/dhl/discoverdhlapi/deleteaccount/index.json'
    };

    this.sel = {
      component: '.delete-account'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
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
    key: 'getPathPrefix',
    value: function getPathPrefix() {
      var prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
      return prefix ? prefix : '';
    }
  }, {
    key: 'getPathHome',
    value: function getPathHome() {
      var home = $('head meta[name=\'dhl-path-home\']').attr('content');
      return home ? home : '';
    }
  }, {
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
          $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
            var csrftoken = tokenresponse.token;
            $.ajax({
              url: _this2.getPathPrefix() + _this2.config.urlGetAllDetails,
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
            $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
              var csrftoken = tokenresponse.token;
              $.ajax({
                url: _this2.getPathPrefix() + _this2.config.urlRefreshCheck,
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

        $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;
          $.ajax({
            url: _this3.getPathPrefix() + _this3.config.urlDeleteAccount,
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
        window.location = this.getPathPrefix() + this.getPathHome();
      }
    }
  }]);

  return DeleteAccountForm;
}();

exports.default = new DeleteAccountForm();

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./PasswordValidity":23}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Header = function () {
  function Header() {
    _classCallCheck(this, Header);

    this.lastLetter = '';
    this.allSuggestions = [];
    this.selectedIndex = -1;
    this.maxSuggestions = 0;
    this.lastVal = '';

    this.sel = {
      component: '.header',
      toggle: '.header__navigation',
      menu: '.header__meganav',
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

      $(document).on('keydown', this.sel.searchFormInput, function (e) {
        // down arrow = 40
        // right arrow = 39
        // up arrow = 38
        // left arrow = 37
        // tab = 9
        if (e.keyCode === 9 && !e.shiftKey || e.keyCode === 40 || e.keyCode === 39) {
          _this.selectedIndex++;
          if (_this.selectedIndex >= _this.maxSuggestions) {
            _this.selectedIndex = 0;
          }
          _this.showSuggestions(true);

          e.preventDefault();
          return false;
        } else if (e.keyCode === 9 && e.shiftKey || e.keyCode === 37 || e.keyCode === 38) {
          _this.selectedIndex--;
          if (_this.selectedIndex < 0) {
            _this.selectedIndex = _this.maxSuggestions - 1;
          }
          _this.showSuggestions(true);

          e.preventDefault();
          return false;
        }

        return true;
      });
      $(document).on('keypress', this.sel.searchFormInput, function (e) {
        if (e.keyCode === 13) {
          var field = $(e.currentTarget);
          var paramName = $(_this.sel.searchFormInput).attr('name');
          var term = field.val().trim();
          var url = $(_this.sel.searchFormForm).attr('action') + '?' + paramName + '=' + encodeURIComponent(term);
          window.location = url;
        }
      });
      $(document).on('keyup', this.sel.searchFormInput, function (e) {
        if (e.keyCode === 16 || e.keyCode === 9 || e.keyCode === 40 || e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 38) {
          return false;
        }

        var field = $(e.currentTarget);
        if (field.val().length > 0) {
          $('.top-searches', _this.sel.component).hide();
          $(_this.sel.searchFormInputClear).show();
          _this.checkSuggestions(field);
        } else {
          _this.clearSuggestions();
          $(_this.sel.searchFormInputClear).hide();
          $('.top-searches', _this.sel.component).show();
        }

        return true;
      });

      $(document).on('click', this.sel.searchFormInputClear, function (e) {
        $(_this.sel.searchFormInput).val('');
        $(_this.sel.searchFormInputClear).hide();
        _this.clearSuggestions();
        e.preventDefault();
        return false;
      });

      $(document).on('click', this.sel.toggle, function (e) {
        e.preventDefault();
        _this.toggleMenu();
      });
      $(document).on('click', this.sel.overlay, this.toggleMenu);
      $(document).on('click', this.sel.search, this.toggleSearch);
      $(document).on('click', this.sel.country, this.toggleCountry);
      $(document).on('click', this.sel.countrySecondary, this.selectCountrySecondary);

      $(document).on('click', '.header__lang, .header__countrySelectPanel .langs a, .header__countrySelectPanel .countries a', function (evt) {
        var href = $(evt.currentTarget).attr('href');
        var home = $(evt.currentTarget).attr('data-home');
        if (home !== null && home.length > 0) {
          href = home;
        }

        Cookies.set(_this.cookieName, href);
      });

      $(window).on('scroll', this.checkScroll);
      this.checkScroll();

      if ($(this.sel.searchFormInput).length > 0) {
        if ($(this.sel.searchFormInput).val().length > 0) {
          $(this.sel.searchFormInputClear).show();
        }
      }
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

      if ($(this.sel.searchForm).hasClass('header__searchform--open')) {
        $(this.sel.searchForm).removeClass('header__searchform--open');
        $(this.sel.search).closest('.header__desktopLinkItem').removeClass('header__desktopLinkItem--open');

        setTimeout(function () {
          $(_this2.sel.search).removeClass('header__desktopSearch--close');
        }, 150);
      }
      if ($(this.sel.countryForm).hasClass('header__countrySelectPanel--open')) {
        $(this.sel.countryForm).removeClass('header__countrySelectPanel--open');
        $(this.sel.country).closest('.header__desktopLinkItem').removeClass('header__desktopLinkItem--open');

        setTimeout(function () {
          $(_this2.sel.search).removeClass('header__desktopCountry--close');
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
      var _this3 = this;

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
          $.get(url, function (result) {
            var container = $('.top-searches .items', _this3.sel.component);
            var paramName = $(_this3.sel.searchFormInput).attr('name');
            var hasTerms = false;
            for (var i = 0; i < result.results.length; i++) {
              hasTerms = true;
              var term = result.results[i].trim();
              var searchUrl = $(_this3.sel.searchFormForm).attr('action') + '?' + paramName + '=' + encodeURIComponent(term);
              container.append('<a href=\'' + searchUrl + '\' title=\'' + term + '\'><span>' + term + '</span></a>');
            }

            if (hasTerms) {
              $('.top-searches', _this3.sel.component).show();
            }
          });
        }
      }
    }
  }, {
    key: 'showSearch',
    value: function showSearch() {
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
  }, {
    key: 'hideSearch',
    value: function hideSearch() {
      var _this4 = this;

      $(this.sel.searchForm).removeClass('header__searchform--open');
      $(this.sel.search).closest('.header__desktopLinkItem').removeClass('header__desktopLinkItem--open');

      setTimeout(function () {
        $(_this4.sel.search).removeClass('header__desktopSearch--close');
      }, 150);
      return true;
    }
  }, {
    key: 'checkSuggestions',
    value: function checkSuggestions(field) {
      var _this5 = this;

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

        $.get(url, { s: s }, function (result) {
          if (result.results.length === 0) {
            _this5.clearSuggestions();
          } else {
            _this5.allSuggestions = [];
            for (var i = 0; i < result.results.length; i++) {
              _this5.allSuggestions.push(result.results[i]);
            }
            _this5.showSuggestions();
          }
        });
      }
    }
  }, {
    key: 'clearSuggestions',
    value: function clearSuggestions() {
      $(this.sel.searchSuggestions).empty().hide();
    }
  }, {
    key: 'showSuggestions',
    value: function showSuggestions(useLastVal) {
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
        if (val.length === 1 || contains) {
          var paramName = $(this.sel.searchFormInput).attr('name');
          var term = this.allSuggestions[i].trim();
          var url = $(this.sel.searchFormForm).attr('action') + '?' + paramName + '=' + encodeURIComponent(term);
          var cls = '';
          if (c === this.selectedIndex) {
            $(this.sel.searchFormInput).val(term);
            cls = ' class="selected"';
          }
          $(this.sel.searchSuggestions).append('<a' + cls + ' href=\'' + url + '\' title=\'' + term + '\'><span>' + term + '</span></a>');
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
  }, {
    key: 'toggleCountry',
    value: function toggleCountry(e) {
      e.preventDefault();
      if ($(this.sel.country).hasClass('header__desktopCountry--close')) {
        this.hideCountry();
      } else {
        this.showCountry();
      }
    }
  }, {
    key: 'showCountry',
    value: function showCountry() {
      var _this6 = this;

      $(this.sel.searchForm).removeClass('header__searchform--open');
      $(this.sel.search).closest('.header__desktopLinkItem').removeClass('header__desktopLinkItem--open');
      setTimeout(function () {
        $(_this6.sel.search).removeClass('header__desktopSearch--close');
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
  }, {
    key: 'hideCountry',
    value: function hideCountry() {
      var _this7 = this;

      $(this.sel.countryForm).removeClass('header__countrySelectPanel--open');
      $(this.sel.country).closest('.header__desktopLinkItem').removeClass('header__desktopLinkItem--open');
      $(this.sel.countryForm).find('.mob').removeClass('open');

      setTimeout(function () {
        $(_this7.sel.country).removeClass('header__desktopCountry--close');
      }, 150);
      return true;
    }
  }, {
    key: 'selectCountrySecondary',
    value: function selectCountrySecondary(e) {
      e.preventDefault();
      $(this.sel.countryForm).find('.mob').addClass('open');
    }
  }]);

  return Header;
}();

exports.default = new Header();

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LanguageDetect = function () {
  function LanguageDetect() {
    _classCallCheck(this, LanguageDetect);

    this.sel = {
      component: '.root__countrySelectPanel'
    };

    this.redirect = true;
    this.cookieName = 'dhl-default-language';

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.init = this.init.bind(this);
  }

  _createClass(LanguageDetect, [{
    key: 'getPathPrefix',
    value: function getPathPrefix() {
      var prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
      return prefix ? prefix : '';
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      if (!this.redirect) {
        $('.mask', this.sel).hide();
        return false;
      }

      var cookie = Cookies.get(this.cookieName);
      if (typeof cookie === 'undefined') {
        var language = window.navigator.userLanguage || window.navigator.language;
        var languagesData = JSON.parse($('#languagesData').html());
        var catchAll = '';
        var url = '';

        for (var i = 0; i < languagesData.variants.length; i++) {
          var variant = languagesData.variants[i];
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
  }]);

  return LanguageDetect;
}();

exports.default = new LanguageDetect();

},{}],18:[function(require,module,exports){
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
      fbAppId: '1080031328801211',
      goClientId: '313469837420-l882h39ge8n8n9pb97ldvjk3fm8ppqgs.apps.googleusercontent.com',

      urlToken: '/libs/granite/csrf/token.json',
      urlLogin: '/apps/dhl/discoverdhlapi/login/index.json'
    };

    this.sel = {
      component: '.page-body.login form.forms',
      buttonFacebook: '.forms__cta--social.fb',
      buttonLinkedin: '.forms__cta--social.li',
      buttonGooglePlus: '.forms__cta--social.go'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
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
    key: 'getPathPrefix',
    value: function getPathPrefix() {
      var prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
      return prefix ? prefix : '';
    }
  }, {
    key: 'getPathHome',
    value: function getPathHome() {
      var home = $('head meta[name=\'dhl-path-home\']').attr('content');
      return home ? home : '';
    }
  }, {
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

      $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
        var csrftoken = tokenresponse.token;

        $.ajax({
          url: _this5.getPathPrefix() + _this5.config.urlLogin,
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
                  backUrl = _this5.getPathPrefix() + _this5.getPathHome();
                }
                window.location = _this5.getPathPrefix() + backUrl;
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
      window.location = this.getPathPrefix() + this.getPathHome() + 'your-account';
    }
  }]);

  return LoginForm;
}();

exports.default = new LoginForm();

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MarketForm = function () {
  function MarketForm() {
    _classCallCheck(this, MarketForm);

    this.sel = {
      component: '[data-marketo-form]'
    };
    this.init = this.init.bind(this);
  }

  _createClass(MarketForm, [{
    key: 'init',
    value: function init() {
      var _this = this;

      if ($(this.sel.component).length <= 0) return false;

      $(this.sel.component).each(function (index, element) {
        return _this.bindEvents(element, index);
      });

      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents(elem) {

      var $elem = $(elem);

      var $form = $elem.find('[data-marketo-visible-form]');

      // visible form
      var $marketoForm = $form.find('form');
      var marketoFormAttr = $marketoForm ? $marketoForm.attr('id') : '';
      var marketoFormId = marketoFormAttr ? marketoFormAttr.replace('mktoForm_', '') : '';

      var _public = {};

      var loadedForms = [];

      var form = $elem.attr('data-marketo-form');

      var hiddenSettings = form ? JSON.parse(form) : null;

      if (marketoFormId.length !== 0) {

        MktoForms2.whenReady(function (mktoForm) {
          $('#mktoForms2BaseStyle').remove();
          $('#mktoForms2ThemeStyle').remove();

          var formId = mktoForm.getId();

          if (loadedForms.indexOf(formId.toString()) !== -1) {
            return;
          }

          if (formId.toString() === marketoFormId.toString()) {
            loadedForms.push(formId.toString());
          }

          var isform = mktoForm.getId().toString() === marketoFormId.toString();

          if (isform) {

            mktoForm.onSuccess(function (e) {

              if (!hiddenSettings) {
                return;
              }

              MktoForms2.loadForm("//express-resource.dhl.com", hiddenSettings.hiddenMunchkinId, hiddenSettings.hiddenFormId, function (hiddenForm) {

                console.log('formLoaded', hiddenForm, e);

                var mktoFieldsObj = $.extend(e, hiddenForm.getValues());

                hiddenForm.addHiddenFields(mktoFieldsObj);
                hiddenForm.submit();

                hiddenForm.onSubmit(function (e) {
                  console.log('second form submit...', e.getValues());
                  return false;
                });

                hiddenForm.onSuccess(function (e) {
                  console.log('second form success...');
                  return true;
                });
              });

              return false;
            });
          }
        });
      } else {
        MktoForms2.whenReady(function (mktoForm) {
          $('#mktoForms2BaseStyle').remove();
          $('#mktoForms2ThemeStyle').remove();
        });
      }
      return true;
    }
  }]);

  return MarketForm;
}();

exports.default = new MarketForm();

},{}],20:[function(require,module,exports){
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

        // Add the account apply images
        if ($('.accountapply').length > 0) {
          var accountApplyImage = $('.accountapply .container').css('background-image');
          if (accountApplyImage != "") {
            accountApplyImage = accountApplyImage.split('url(')[1].split(')')[0].replace(/"/g, '').replace(/'/g, '');
            pageResources.push(accountApplyImage);
          }
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
      if ($(e.target).hasClass('articlePanel')) $articlePanel = $(e.target);
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

},{"./Database":9,"./Toast":33}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
      urlLogin: '/apps/dhl/discoverdhlapi/login/index.json',
      urlRequest: '/apps/dhl/discoverdhlapi/request_password/index.json',
      urlReset: '/apps/dhl/discoverdhlapi/reset_password/index.json'
    };

    this.sel = {
      component: '.reset-password-container'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.createCookie = this.createCookie.bind(this);

    this.requestToken = this.requestToken.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  _createClass(PasswordReminderForm, [{
    key: 'getPathPrefix',
    value: function getPathPrefix() {
      var prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
      return prefix ? prefix : '';
    }
  }, {
    key: 'getPathHome',
    value: function getPathHome() {
      var home = $('head meta[name=\'dhl-path-home\']').attr('content');
      return home ? home : '';
    }
  }, {
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
      $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
        var csrftoken = tokenresponse.token;
        $.ajax({
          url: _this2.getPathPrefix() + _this2.config.urlRequest,
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
      $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
        var csrftoken = tokenresponse.token;
        $.ajax({
          url: _this3.getPathPrefix() + _this3.config.urlReset,
          data: data,
          type: 'post',
          headers: { 'CSRF-Token': csrftoken },
          dataType: 'json',
          success: function success(response) {
            if (response) {
              if (response.status === 'ok') {
                $.get(_this3.getPathPrefix() + _this3.config.urlToken, function (nextTokenResponse) {
                  var nextcsrftoken = nextTokenResponse.token;

                  $.ajax({
                    url: _this3.getPathPrefix() + _this3.config.urlLogin,
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
                            backUrl = _this3.getPathPrefix() + _this3.getPathHome();
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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
      fbAppId: '1080031328801211',
      goClientId: '313469837420-l882h39ge8n8n9pb97ldvjk3fm8ppqgs.apps.googleusercontent.com',

      urlToken: '/libs/granite/csrf/token.json',
      urlRefreshCheck: '/apps/dhl/discoverdhlapi/refresh_token/index.json',
      urlRegister: '/apps/dhl/discoverdhlapi/register/index.json',
      urlUpdateCategories: '/apps/dhl/discoverdhlapi/update_categories/index.json'
    };

    this.sel = {
      component: '.page-body.register, #download, .gated',
      buttonFacebook: '.forms__cta--social.fb',
      buttonLinkedin: '.forms__cta--social.li',
      buttonGooglePlus: '.forms__cta--social.go'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
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
    key: 'getPathPrefix',
    value: function getPathPrefix() {
      var prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
      return prefix ? prefix : '';
    }
  }, {
    key: 'getPathHome',
    value: function getPathHome() {
      var home = $('head meta[name=\'dhl-path-home\']').attr('content');
      return home ? home : '';
    }
  }, {
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

      $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
        var csrftoken = tokenresponse.token;

        $.ajax({
          url: _this5.getPathPrefix() + _this5.config.urlRegister,
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
            $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
              var csrftoken = tokenresponse.token;
              $.ajax({
                url: _this6.getPathPrefix() + _this6.config.urlUpdateCategories,
                data: { username: split[0], token: split[1], cats: categories },
                type: 'post',
                headers: { 'CSRF-Token': csrftoken },
                dataType: 'json',
                success: function success(updateCategoriesResponse) {
                  if (updateCategoriesResponse) {
                    if (updateCategoriesResponse.status === 'ok') {
                      $(window).trigger('checkauthtokens.DHL', [updateCategoriesResponse, true]);
                      window.location = _this6.getPathPrefix() + _this6.getPathHome();
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
              $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
                var csrftoken = tokenresponse.token;
                $.ajax({
                  url: _this6.getPathPrefix() + _this6.config.urlRefreshCheck,
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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
      navigator.serviceWorker.register('/discover/etc.clientlibs/dhl/clientlibs/clientlib-site/resources/sw.js?v=discoverDhl-20221115-1').then(function () {
        // console.log('ServiceWorker succesfully registered');
      }).catch(function () {
        console.log('ServiceWorker registration failed: ', err);
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
      // this.addToHomeScreen();
      return true;
    }
  }]);

  return ServiceWorker;
}();

exports.default = new ServiceWorker();

},{}],27:[function(require,module,exports){
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

      if (typeof firstname === 'undefined' || $.trim(firstname).length === 0) {
        $(this.sel.userFirstnameElement).text(tokenData.name);
      }
    }
  }]);

  return ShipForm;
}();

exports.default = new ShipForm();

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShipNowForm = function () {
  function ShipNowForm() {
    _classCallCheck(this, ShipNowForm);

    this.sel = {
      form: 'form.forms.ship-now',
      countryselect: 'form.forms.ship-now #shipnow_country'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
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
    key: 'getPathPrefix',
    value: function getPathPrefix() {
      var prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
      return prefix ? prefix : '';
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      $(document).on('change', this.sel.countryselect, this.toggleAddress);
      $(document).on('submit', this.sel.form, this.submitForm);

      var country = $(this.sel.form).data('preselectcountry');
      if (country !== null && $.trim(country).length > 0) {
        $(this.sel.countryselect).val(country).trigger('change');
      }
    }

    /**
     * Method that validates all the form elements
     * @return {boolean} true if all elements have been validated successfully or false if not
     */

  }, {
    key: 'validate',
    value: function validate() {
      var form = document.getElementById("glb-shipnow-form");
      if (form) {
        var formElements = form.elements;

        var validationResult = new Map();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = formElements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var formElement = _step.value;

            var name = formElement.getAttribute("name");
            validationResult.set(name, this.validateField(formElement));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        var validationResultValues = [].concat(_toConsumableArray(validationResult.values()));
        return validationResultValues.includes(false);
      }
      return false;
    }

    /**
     * Simple method that validates the provided element according to its type, currently it recognizes these types:
     * <i>email</i> & <i>tel</i>; every other field type is treated as <i>text</i>. If the element's value is considered
     * 'invalid',
     * <b>error</b> class is added, otherwise <b>valid</b> is added
     * @param elementToValidate DOM element we want to validate
     * @return boolean true or false depending on the validation result of one specific field
     */

  }, {
    key: 'validateField',
    value: function validateField(elementToValidate) {
      var fieldType = elementToValidate.type;
      var fieldValue = elementToValidate.value.trim();

      var validationResult = void 0;
      switch (fieldType) {
        case "email":
          validationResult = this.validateEmailField(fieldValue);
          break;
        case "tel":
          validationResult = this.validatePhoneNumber(fieldValue);
          break;
        default:
          validationResult = this.validateTextField(fieldValue);
      }

      if (!validationResult) {
        this.failValidation(elementToValidate);
        return false;
      } else {
        this.completeValidation(elementToValidate);
        return true;
      }
    }

    /**
     * Marks the validation of individual form field as 'invalid' by adding a CSS class 'error' to it. <br />If the
     * element
     * already contains css class 'valid', we replace it with error.<br /> If the element does not contain any class,
     * we simply add 'error'
     * @param element is the element we're assessing
     */

  }, {
    key: 'failValidation',
    value: function failValidation(element) {
      this.modifyCssClass(element, "error", "valid");
      var labelElement = this.getLabel(element);
      if (labelElement === null) {
        element.after(this.createErrorLabel(element));
        labelElement = this.getLabel(element);
      }
      this.updateLabelMessage(element, labelElement);
    }
  }, {
    key: 'updateLabelMessage',
    value: function updateLabelMessage(sourceElement, labelElement) {
      var sourceElementMessage = sourceElement.getAttribute("data-msg");
      if (sourceElementMessage === null) {
        sourceElementMessage = "Field is mandatory";
      }
      if (labelElement !== null || typeof labelElement !== 'undefined') {
        labelElement.textContent = sourceElementMessage;
      }
    }
  }, {
    key: 'createErrorLabel',
    value: function createErrorLabel(inputElement) {
      var elementId = inputElement.id;
      var errorMessage = inputElement.getAttribute("data-msg");
      if (!errorMessage) {
        errorMessage = "This field is mandatory!";
      }

      var labelElement = document.createElement("label");
      var labelTextNode = document.createTextNode(errorMessage);
      labelElement.classList.add("error");
      labelElement.setAttribute("for", elementId);

      labelElement.appendChild(labelTextNode);
      return labelElement;
    }
  }, {
    key: 'modifyCssClass',
    value: function modifyCssClass(element, classToAdd, classToRemove) {
      if (element.classList.contains(classToRemove)) {
        element.classList.replace(classToRemove, classToAdd);
      }
      element.classList.add(classToAdd);
    }
  }, {
    key: 'removeCssClass',
    value: function removeCssClass(element, classToRemove) {
      if (element) {
        element.classList.remove(classToRemove);
      }
    }
  }, {
    key: 'addCssClass',
    value: function addCssClass(element, classToAdd) {
      if (element) {
        element.classList.add(classToAdd);
      }
    }

    /**
     * Marks the validation of individual form field as 'valid' by adding a CSS class 'valid' to it. <br />If the
     * element
     * already contains css class 'error', we replace it with valid.<br /> If the element does not contain any class,
     * we simply add 'valid'
     * @param element is the element we're assessing
     */

  }, {
    key: 'completeValidation',
    value: function completeValidation(element) {
      this.modifyCssClass(element, "valid", "error");
      var labelElement = this.getLabel(element);
      if (labelElement !== null) {
        labelElement.remove();
      }
    }
  }, {
    key: 'getLabel',
    value: function getLabel(formInputElement) {
      var labelElement = formInputElement.nextElementSibling;
      if (labelElement) {
        var tag = labelElement.tagName;
        if (tag.toLocaleLowerCase() === "label") {
          return labelElement;
        }
      }
      return null;
    }

    /**
     * Provides the validation of input type 'text' - in reality it 'just' checks if the provided string has
     * any value...
     * @param stringToValidate is a {@code String} value we wish to validate
     * @returns {boolean} true if we think the provided string is a valid one
     */

  }, {
    key: 'validateTextField',
    value: function validateTextField(stringToValidate) {
      return stringToValidate !== null && stringToValidate.length !== 0;
    }

    /**
     * Attempts to verify if the provided string matches the regular expression for email
     * @param emailToValidate is the string we want to validate
     * @returns {boolean} true if the provided value matches the email regular expression or false if not
     */

  }, {
    key: 'validateEmailField',
    value: function validateEmailField(emailToValidate) {
      var emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      return !!emailToValidate.match(emailRegex);
    }

    /**
     * Validates the provided string as phone number
     * @param phoneToValidate is a String to validate (phone number can contain other characters than just digits
     * @returns {boolean} true if validate is successful, else it returns false
     */

  }, {
    key: 'validatePhoneNumber',
    value: function validatePhoneNumber(phoneToValidate) {
      var phoneRegex = new RegExp("((\\(\\d{3,4}\\)( )?)|\\d{3,4}( )?)?[- ./]?( )?\\d{3,4}?( )?[- ./]?( )?\\d{3,4}?( )?$");
      return phoneRegex.test(phoneToValidate);
    }
  }, {
    key: 'toggleAddress',
    value: function toggleAddress(_e) {
      var val = $(this.sel.countryselect).val();

      var options = $('option', this.sel.countryselect);
      var mandatory = true;
      options.each(function (_index, item) {
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
      var canSubmit = this.validate();
      if (canSubmit) {
        var $form = $(e.target);
        var formData = this.getFormData($form);
        $.post(this.getPathPrefix() + $form.attr('action'), formData, function (data) {
          if (data.status === 'OK') {
            _this.showSuccess();
          } else {
            _this.showError(data.fields);
          }
        });
      }
      return false;
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
      indexedArray.lo = $.trim($form.data('lo'));

      return indexedArray;
    }
  }, {
    key: 'showSuccess',
    value: function showSuccess() {
      window.location = $(this.sel.form).data('thanks');
    }

    /**
     * Helper function that should go through the json response and detect if there is any error (errors should come
     * as array)
     * @param errors
     */

  }, {
    key: 'showError',
    value: function showError(errors) {
      if (Array.isArray(errors)) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = errors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var error = _step2.value;

            var validationErrorString = error.field;
            var elementId = "shipnow_" + this.getFirstWord(validationErrorString);
            var element = document.getElementById(elementId);
            if (element) {
              this.failValidation(element);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }
  }, {
    key: 'getFirstWord',
    value: function getFirstWord(strintToSplit) {
      return strintToSplit.split(" ")[0];
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.form).length <= 0) {
        return false;
      }
      this.registerEventListeners();
      this.bindEvents();
      return true;
    }
  }, {
    key: 'registerEventListeners',
    value: function registerEventListeners() {
      var _this2 = this;

      var elementsToValidate = ["shipnow_firstname", "shipnow_lastname", "shipnow_companyname", "shipnow_phone", "shipnow_address", "shipnow_zip", "shipnow_city", "shipnow_email"];

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        var _loop = function _loop() {
          var elementToValidate = _step3.value;

          var element = document.getElementById(elementToValidate);
          if (element) {
            element.addEventListener("blur", function () {
              _this2.validateField(element);
            });
          }
        };

        for (var _iterator3 = elementsToValidate[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }]);

  return ShipNowForm;
}();

exports.default = new ShipNowForm();

},{}],29:[function(require,module,exports){
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

    this.getPathPrefix = this.getPathPrefix.bind(this);
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
    key: 'getPathPrefix',
    value: function getPathPrefix() {
      var prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
      return prefix ? prefix : '';
    }
  }, {
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

      $.post(this.getPathPrefix() + $form.attr('action'), formData, function (data) {
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
      indexedArray.lo = $.trim($form.data('lo'));

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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.validate = this.validate.bind(this);
  }

  _createClass(SubscribePanel, [{
    key: 'getPathPrefix',
    value: function getPathPrefix() {
      var prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
      return prefix ? prefix : '';
    }
  }, {
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
      $.post(this.getPathPrefix() + $form.attr('action'), formData, function (data) {
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

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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
      urlRefreshCheck: '/apps/dhl/discoverdhlapi/refresh_token/index.json',
      urlGetAllDetails: '/apps/dhl/discoverdhlapi/getdetails/index.json',
      urlUpdateDetails: '/apps/dhl/discoverdhlapi/update_details/index.json'
    };

    this.sel = {
      component: '.standardContent.user-account, .page-body.user-account'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.readCookie = this.readCookie.bind(this);

    this.tryUpdateDetails = this.tryUpdateDetails.bind(this);
    this.completeUpdateDetails = this.completeUpdateDetails.bind(this);

    this.loggedIn = this.loggedIn.bind(this);
    this.notLoggedIn = this.notLoggedIn.bind(this);
  }

  _createClass(LoginForm, [{
    key: 'getPathPrefix',
    value: function getPathPrefix() {
      var prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
      return prefix ? prefix : '';
    }
  }, {
    key: 'getPathHome',
    value: function getPathHome() {
      var home = $('head meta[name=\'dhl-path-home\']').attr('content');
      return home ? home : '';
    }
  }, {
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
          $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
            var csrftoken = tokenresponse.token;
            $.ajax({
              url: _this2.getPathPrefix() + _this2.config.urlGetAllDetails,
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
            $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
              var csrftoken = tokenresponse.token;
              $.ajax({
                url: _this2.getPathPrefix() + _this2.config.urlRefreshCheck,
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

        $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;
          $.ajax({
            url: _this3.getPathPrefix() + _this3.config.urlUpdateDetails,
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
        $.get(this.getPathPrefix() + this.config.urlToken, function (tokenresponse) {
          var csrftoken = tokenresponse.token;

          $.ajax({
            url: _this4.getPathPrefix() + _this4.config.urlGetAllDetails,
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
        window.location = this.getPathPrefix() + this.getPathHome();
      }
    }
  }]);

  return LoginForm;
}();

exports.default = new LoginForm();

},{}],35:[function(require,module,exports){
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

var _ArticleCounter = require('./Components/ArticleCounter');

var _ArticleCounter2 = _interopRequireDefault(_ArticleCounter);

var _MarketoForm = require('./Components/MarketoForm');

var _MarketoForm2 = _interopRequireDefault(_MarketoForm);

var _LanguageDetect = require('./Components/LanguageDetect');

var _LanguageDetect2 = _interopRequireDefault(_LanguageDetect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(document).ready(function () {
  try {
    document.createEvent('TouchEvent');
    $('body').addClass('touch');
  } catch (e) {
    // nothing
  }
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) $('html').addClass('pwa');
  // Initiate components
  _LanguageDetect2.default.init();
  // ArticleCounter.init();
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
  _MarketoForm2.default.init();
}); // Import components

},{"./Components/ArticleCounter":1,"./Components/ArticleGrid":2,"./Components/AuthenticationEvents":3,"./Components/BackButton":4,"./Components/BootstrapCarousel":5,"./Components/CompetitionForm":6,"./Components/CookieBanner":8,"./Components/DeleteAccountForm":10,"./Components/EcomForms":11,"./Components/FormValidation":12,"./Components/Header":13,"./Components/Hero":14,"./Components/IEDetector":15,"./Components/LandingPoints":16,"./Components/LanguageDetect":17,"./Components/LoginForm":18,"./Components/MarketoForm":19,"./Components/Offline":20,"./Components/Password":21,"./Components/PasswordReminderForm":22,"./Components/PasswordValidity":23,"./Components/RegisterForm":24,"./Components/SearchForm":25,"./Components/ServiceWorker":26,"./Components/ShipForm":27,"./Components/ShipNowForm":28,"./Components/ShipNowTwoStepForm":29,"./Components/ShowHide":30,"./Components/Social":31,"./Components/SubscribePanel":32,"./Components/YourAccountForm":34}]},{},[35])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BcnRpY2xlQ291bnRlci5qcyIsImpzL2Rldi9Db21wb25lbnRzL0FydGljbGVHcmlkLmpzIiwianMvZGV2L0NvbXBvbmVudHMvQXV0aGVudGljYXRpb25FdmVudHMuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9CYWNrQnV0dG9uLmpzIiwianMvZGV2L0NvbXBvbmVudHMvQm9vdHN0cmFwQ2Fyb3VzZWwuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Db21wZXRpdGlvbkZvcm0uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Db25zdGFudHMuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Db29raWVCYW5uZXIuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9EYXRhYmFzZS5qcyIsImpzL2Rldi9Db21wb25lbnRzL0RlbGV0ZUFjY291bnRGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvRWNvbUZvcm1zLmpzIiwianMvZGV2L0NvbXBvbmVudHMvRm9ybVZhbGlkYXRpb24uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9IZWFkZXIuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9IZXJvLmpzIiwianMvZGV2L0NvbXBvbmVudHMvSUVEZXRlY3Rvci5qcyIsImpzL2Rldi9Db21wb25lbnRzL0xhbmRpbmdQb2ludHMuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9MYW5ndWFnZURldGVjdC5qcyIsImpzL2Rldi9Db21wb25lbnRzL0xvZ2luRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL01hcmtldG9Gb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvT2ZmbGluZS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1Bhc3N3b3JkLmpzIiwianMvZGV2L0NvbXBvbmVudHMvUGFzc3dvcmRSZW1pbmRlckZvcm0uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9QYXNzd29yZFZhbGlkaXR5LmpzIiwianMvZGV2L0NvbXBvbmVudHMvUmVnaXN0ZXJGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2VhcmNoRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1NlcnZpY2VXb3JrZXIuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9TaGlwRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1NoaXBOb3dGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2hpcE5vd1R3b1N0ZXBGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2hvd0hpZGUuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Tb2NpYWwuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9TdWJzY3JpYmVQYW5lbC5qcyIsImpzL2Rldi9Db21wb25lbnRzL1RvYXN0LmpzIiwianMvZGV2L0NvbXBvbmVudHMvWW91ckFjY291bnRGb3JtLmpzIiwianMvZGV2L21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sYztBQUNKLDRCQUFjO0FBQUE7O0FBQ1osU0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDRDs7OztvQ0FFZTtBQUNkLFVBQU0sU0FBUyxFQUFFLHFDQUFGLEVBQXlDLElBQXpDLENBQThDLFNBQTlDLENBQWY7QUFDQSxhQUFRLFNBQVMsTUFBVCxHQUFrQixFQUExQjtBQUNEOzs7MkJBRU07QUFDTDtBQUNBO0FBQ0EsVUFBSSxjQUFjLEVBQUUsNEJBQUYsQ0FBbEI7QUFDQSxVQUFJLFlBQVksTUFBWixHQUFxQixDQUF6QixFQUE0QjtBQUMxQixZQUFJLE9BQU8sWUFBWSxJQUFaLENBQWlCLE1BQWpCLENBQVg7QUFDQSxZQUFJLEVBQUUsSUFBRixDQUFPLElBQVAsRUFBYSxNQUFiLEdBQXNCLENBQTFCLEVBQTZCO0FBQzNCLGNBQUksT0FBTztBQUNULGVBQUc7QUFETSxXQUFY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aUJBQUssSUFBTDtBQUNBLDRCQUFnQixJQUFoQjtBQUNBLHdCQUFZLElBQVo7QUFDQSwrQkFBbUIsSUFBbkI7QUFDQSw0QkFBZ0IsSUFBaEI7QUFDQSx5QkFBYSxJQUFiO0FBQ0EsaUNBQXFCLElBQXJCO0FBQ0Esc0JBQVUsSUFBVjtBQUNBLDhCQUFrQixJQUFsQjtBQUNBLGlDQUFxQixJQUFyQjtBQUNBLDBCQUFjLElBQWQ7QUFDQSxvQkFBUSxJQUFSO0FBQ0EsMEJBQWMsSUFBZDtBQUNBLHVCQUFXLElBQVg7QUFDQSx3QkFBWSxJQUFaO0FBQ0QsQ0F4Q0QsRSxDQWpDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNsYXNzIEFydGljbGVDb3VudGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gIH1cblxuICBnZXRQYXRoUHJlZml4KCkge1xuICAgIGNvbnN0IHByZWZpeCA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLXByZWZpeFxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8vIC9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9jb3VudGVyL2luZGV4Lmpzb25cbiAgICAvLyBwID0gL2NvbnRlbnQvZGhsL1hYWFhcbiAgICBsZXQgYXJ0aWNsZVBhZ2UgPSAkKCcucGFnZS1ib2R5LmFydGljbGUtY291bnRlcicpO1xuICAgIGlmIChhcnRpY2xlUGFnZS5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgcGF0aCA9IGFydGljbGVQYWdlLmRhdGEoJ3BhdGgnKTtcbiAgICAgIGlmICgkLnRyaW0ocGF0aCkubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICBwOiBwYXRoXG4gICAgICAgIH07XG4gICAgICAgICQucG9zdCh0aGlzLmdldFBhdGhQcmVmaXgoKSArICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvY291bnRlci9pbmRleC5qc29uJywgZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBBcnRpY2xlQ291bnRlcigpO1xuIiwiY2xhc3MgQXJ0aWNsZUdyaWRBcGkge1xuICBjb25zdHJ1Y3RvcihlbmRwb2ludCwgcGFnZVNpemUgPSA2KSB7XG4gICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50O1xuICAgIHRoaXMucGFnZVNpemUgPSBwYWdlU2l6ZTtcbiAgICB0aGlzLnNraXAgPSAwO1xuXG4gICAgdGhpcy5kb1JlcXVlc3QgPSB0aGlzLmRvUmVxdWVzdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2VhcmNoID0gdGhpcy5zZWFyY2guYmluZCh0aGlzKTtcbiAgICB0aGlzLmxvYWRNb3JlID0gdGhpcy5sb2FkTW9yZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZG9SZXF1ZXN0KGNhbGxiYWNrLCBrZXl3b3JkID0gbnVsbCkge1xuICAgICQuZ2V0KHRoaXMuZW5kcG9pbnQsIHtcbiAgICAgIHNraXA6IHRoaXMuc2tpcCxcbiAgICAgIHBhZ2VTaXplOiB0aGlzLnBhZ2VTaXplLFxuICAgICAga2V5d29yZDoga2V5d29yZFxuICAgIH0sIChkYXRhKSA9PiB7XG4gICAgICB0aGlzLnNraXAgKz0gZGF0YS5JdGVtcy5sZW5ndGg7XG4gICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlYXJjaChjYWxsYmFjaywga2V5d29yZCkge1xuICAgIHRoaXMuc2tpcCA9IDA7XG4gICAgdGhpcy5kb1JlcXVlc3QoY2FsbGJhY2ssIGtleXdvcmQpO1xuICB9XG5cbiAgbG9hZE1vcmUoY2FsbGJhY2spIHtcbiAgICB0aGlzLmRvUmVxdWVzdChjYWxsYmFjayk7XG4gIH1cbn1cblxuY2xhc3MgQXJ0aWNsZUdyaWQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmhhc21vcmUgPSB0cnVlO1xuXG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuYXJ0aWNsZUdyaWQnLFxuICAgICAgZ3JpZDogJy5hcnRpY2xlR3JpZF9fZ3JpZCcsXG4gICAgICBsb2FkTW9yZTogJy5hcnRpY2xlR3JpZF9fbG9hZE1vcmUnLFxuICAgICAgdGVtcGxhdGU6ICcjYXJ0aWNsZUdyaWRfX3BhbmVsVGVtcGxhdGUnLFxuICAgICAgbmF2OiAnLmFydGljbGVHcmlkX19uYXYnXG4gICAgfTtcbiAgICB0aGlzLnRlbXBsYXRlID0gJCgkKHRoaXMuc2VsLnRlbXBsYXRlKS5odG1sKCkpO1xuXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5sb2FkTW9yZSA9IHRoaXMubG9hZE1vcmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnBvcHVsYXRlVGVtcGxhdGVzID0gdGhpcy5wb3B1bGF0ZVRlbXBsYXRlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvd1NwaW5uZXIgPSB0aGlzLnNob3dTcGlubmVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oaWRlU3Bpbm5lciA9IHRoaXMuaGlkZVNwaW5uZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNjcm9sbG5hdiA9IHRoaXMuc2Nyb2xsbmF2LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zY3JvbGxsZWZ0ID0gdGhpcy5zY3JvbGxsZWZ0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zY3JvbGxyaWdodCA9IHRoaXMuc2Nyb2xscmlnaHQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNoZWNrU2Nyb2xsID0gdGhpcy5jaGVja1Njcm9sbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucGFnZVNjcm9sbCA9IHRoaXMucGFnZVNjcm9sbC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIHRoaXMucGFnZVNjcm9sbCk7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwubG9hZE1vcmUsIHRoaXMubG9hZE1vcmUpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc2Nyb2xsbGVmdCcsIHRoaXMuc2Nyb2xsbGVmdCk7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5zY3JvbGxyaWdodCcsIHRoaXMuc2Nyb2xscmlnaHQpO1xuXG4gICAgdGhpcy5wYWdlU2Nyb2xsKCk7XG4gIH1cblxuICBwYWdlU2Nyb2xsKCkge1xuICAgIGlmICh0aGlzLmhhc21vcmUgJiYgKCF0aGlzLmxvYWRpbmcpKSB7XG4gICAgICB2YXIgd25kID0gJCh3aW5kb3cpO1xuICAgICAgdmFyIGVsbSA9ICQodGhpcy5zZWwubG9hZE1vcmUpO1xuXG4gICAgICBpZiAoZWxtICYmICgkKGVsbSkubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgdmFyIHdzdCA9IHduZC5zY3JvbGxUb3AoKTtcbiAgICAgICAgdmFyIHdoID0gd25kLmhlaWdodCgpO1xuICAgICAgICB2YXIgb3QgPSBlbG0ub2Zmc2V0KCkudG9wO1xuICAgICAgICB2YXIgb2ggPSBlbG0ub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICBpZiAoKHdzdCArIHdoKSA+IChvdCArIG9oKSkge1xuICAgICAgICAgIHRoaXMubG9hZE1vcmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxvYWRNb3JlKGUpIHtcbiAgICBpZiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgLy8gU2hvdyB0aGUgbG9hZGluZyBzcGlubmVyXG4gICAgdGhpcy5zaG93U3Bpbm5lcigpO1xuXG4gICAgdmFyIHQgPSAwO1xuICAgICQoXCIuYXJ0aWNsZUdyaWRfX2l0ZW1cIiwgdGhpcy5zZWwuY29tcG9uZW50KS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgaWYgKHQgPCA2ICYmICghJChpdGVtKS5pcyhcIjp2aXNpYmxlXCIpKSkge1xuICAgICAgICAkKGl0ZW0pLnNob3coKTtcbiAgICAgICAgdCsrO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCQoXCIuYXJ0aWNsZUdyaWRfX2l0ZW1cIix0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA9PT0gJChcIi5hcnRpY2xlR3JpZF9faXRlbTp2aXNpYmxlXCIsdGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGgpIHtcbiAgICAgICQodGhpcy5zZWwubG9hZE1vcmUpLnBhcmVudHMoXCIucm93XCIpLmZpcnN0KCkucmVtb3ZlKCk7XG4gICAgICB0aGlzLmhhc21vcmUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIHRoZSBsb2FkaW5nIHNwaW5uZXJcbiAgICB0aGlzLmhpZGVTcGlubmVyKCk7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gIH1cblxuICBzaG93U3Bpbm5lcigpIHtcbiAgICAkKHRoaXMuc2VsLmxvYWRNb3JlKS5hZGRDbGFzcygnYXJ0aWNsZUdyaWRfX2xvYWRNb3JlLS1sb2FkaW5nJyk7XG4gIH1cblxuICBoaWRlU3Bpbm5lcigpIHtcbiAgICAkKHRoaXMuc2VsLmxvYWRNb3JlKS5yZW1vdmVDbGFzcygnYXJ0aWNsZUdyaWRfX2xvYWRNb3JlLS1sb2FkaW5nJyk7XG4gIH1cblxuICBzY3JvbGxuYXYoKSB7XG4gICAgbGV0ICRzY3JvbGxuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsLm5hdik7XG4gICAgaWYgKCRzY3JvbGxuYXYgPT09IG51bGwpIHJldHVybjtcbiAgICBsZXQgc2Nyb2xsV2lkdGggPSAkc2Nyb2xsbmF2LnNjcm9sbFdpZHRoO1xuICAgIGxldCBjbGllbnRXaWR0aCA9ICRzY3JvbGxuYXYuY2xpZW50V2lkdGg7XG4gICAgaWYgKHNjcm9sbFdpZHRoID4gY2xpZW50V2lkdGgpIHtcbiAgICAgICQodGhpcy5zZWwubmF2KS5hZnRlcignPGkgY2xhc3M9XCJzY3JvbGxyaWdodFwiPj48L2k+Jyk7XG4gICAgfVxuICB9XG4gIHNjcm9sbHJpZ2h0KCkge1xuICAgIGxldCBzZWxmID0gdGhpcy5zZWwubmF2O1xuICAgIGxldCBzY3JvbGxXaWR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZikuc2Nyb2xsV2lkdGg7XG4gICAgJChzZWxmKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbExlZnQ6IHNjcm9sbFdpZHRoICsgJ3B4J1xuICAgIH0sIDUwMCwgZnVuY3Rpb24gKCkge1xuICAgICAgJCgnLnNjcm9sbHJpZ2h0JykucmVtb3ZlKCk7XG4gICAgICAkKHNlbGYpLmJlZm9yZSgnPGkgY2xhc3M9XCJzY3JvbGxsZWZ0XCI+PDwvaT4nKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNjcm9sbGxlZnQoKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzLnNlbC5uYXY7XG4gICAgJChzZWxmKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbExlZnQ6IDBcbiAgICB9LCA1MDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJy5zY3JvbGxsZWZ0JykucmVtb3ZlKCk7XG4gICAgICAkKHNlbGYpLmFmdGVyKCc8aSBjbGFzcz1cInNjcm9sbHJpZ2h0XCI+PjwvaT4nKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNoZWNrU2Nyb2xsKCkge1xuICAgIGxldCAkc2Nyb2xsbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbC5uYXYpO1xuICAgIGlmICgkc2Nyb2xsbmF2ID09PSBudWxsKSByZXR1cm47XG4gICAgbGV0IHNjcm9sbFdpZHRoID0gJHNjcm9sbG5hdi5zY3JvbGxXaWR0aDtcbiAgICBsZXQgY2xpZW50V2lkdGggPSAkc2Nyb2xsbmF2LmNsaWVudFdpZHRoO1xuICAgIGxldCBzY3JvbGxHYXAgPSBzY3JvbGxXaWR0aCAtIGNsaWVudFdpZHRoO1xuICAgICQoc2VsZikuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLnNjcm9sbExlZnQgPT09IDApIHtcbiAgICAgICAgJCgnLnNjcm9sbGxlZnQnKS5yZW1vdmUoKTtcbiAgICAgICAgJChzZWxmKS5hZnRlcignPGkgY2xhc3M9XCJzY3JvbGxyaWdodFwiPj48L2k+Jyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zY3JvbGxMZWZ0ID49IHNjcm9sbEdhcCkge1xuICAgICAgICAkKCcuc2Nyb2xscmlnaHQnKS5yZW1vdmUoKTtcbiAgICAgICAgJChzZWxmKS5iZWZvcmUoJzxpIGNsYXNzPVwic2Nyb2xsbGVmdFwiPjw8L2k+Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwb3B1bGF0ZVRlbXBsYXRlcyhpdGVtcykge1xuICAgIGxldCBvdXRwdXQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBDbG9uZSB0ZW1wbGF0ZVxuICAgICAgbGV0ICR0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUuY2xvbmUoKTtcbiAgICAgIC8vIEdldCB0aGUgaXRlbVxuICAgICAgbGV0IGl0ZW0gPSBpdGVtc1tpXTtcbiAgICAgIC8vIFNldCBpbWFnZSBicmVha3BvaW50XG4gICAgICBsZXQgZGVza3RvcEJyZWFrcG9pbnQgPSA5OTI7XG4gICAgICAvLyBHZW5lcmF0ZSBJRFxuICAgICAgbGV0IHBhbmVsSWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgOSk7XG4gICAgICAvLyBQb3B1bGF0ZSBJRFxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5hdHRyKCdpZCcsIHBhbmVsSWQpO1xuICAgICAgLy8gSWYgbGFyZ2UgcGFuZWxcbiAgICAgIGlmIChpdGVtLklzTGFyZ2UpIHtcbiAgICAgICAgLy8gVXBkYXRlIGltYWdlIGJyZWFrcG9pbnRcbiAgICAgICAgZGVza3RvcEJyZWFrcG9pbnQgPSA3Njg7XG4gICAgICAgIC8vIEFkZCBjbGFzc1xuICAgICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbCcpLmFkZENsYXNzKCdhcnRpY2xlUGFuZWwtLWxhcmdlJyk7XG4gICAgICB9XG4gICAgICAvLyBJZiB2aWRlb1xuICAgICAgaWYgKGl0ZW0uSXNWaWRlbykge1xuICAgICAgICAvLyBBZGQgY2xhc3NcbiAgICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5hZGRDbGFzcygnYXJ0aWNsZVBhbmVsLS12aWRlbycpO1xuICAgICAgfVxuICAgICAgLy8gUG9wdWxhdGUgaW1hZ2VzXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9faW1hZ2UnKS5hdHRyKHtcbiAgICAgICAgaHJlZjogaXRlbS5MaW5rLFxuICAgICAgICB0aXRsZTogaXRlbS5UaXRsZVxuICAgICAgfSkuYXR0cignc3R5bGUnLCAnYmFja2dyb3VuZC1pbWFnZTogdXJsKCcgKyBpdGVtLkltYWdlcy5Nb2JpbGUgKyAnKTsnKTtcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCdzdHlsZScpWzBdLmlubmVySFRNTCA9ICdAbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAnICsgZGVza3RvcEJyZWFrcG9pbnQgKyAncHgpeyMnICsgcGFuZWxJZCArICcgLmFydGljbGVQYW5lbF9faW1hZ2V7YmFja2dyb3VuZC1pbWFnZTogdXJsKCcgKyBpdGVtLkltYWdlcy5EZXNrdG9wICsgJykgIWltcG9ydGFudDt9fSc7XG4gICAgICAvLyBQb3B1bGF0ZSBsaW5rXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fY29udGVudCA+IGEnKS5hdHRyKHtcbiAgICAgICAgaHJlZjogaXRlbS5MaW5rLFxuICAgICAgICB0aXRsZTogaXRlbS5UaXRsZVxuICAgICAgfSk7XG4gICAgICAvLyBQb3B1bGF0ZSB0aXRsZVxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX3RpdGxlJykudGV4dChpdGVtLlRpdGxlKTtcbiAgICAgIC8vIFBvcHVsYXRlIGRlc2NyaXB0aW9uXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fZGVzY3JpcHRpb24nKS50ZXh0KGl0ZW0uRGVzY3JpcHRpb24pO1xuICAgICAgLy8gUG9wdWxhdGUgY2F0ZWdvcnlcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX19zdWJUaXRsZSBhOmZpcnN0LWNoaWxkJykuYXR0cih7XG4gICAgICAgICdocmVmJzogaXRlbS5DYXRlZ29yeS5MaW5rLFxuICAgICAgICAndGl0bGUnOiBpdGVtLkNhdGVnb3J5Lk5hbWVcbiAgICAgIH0pLnRleHQoaXRlbS5DYXRlZ29yeS5OYW1lKTtcbiAgICAgIC8vIFBvcHVsYXRlIHRpbWUgdG8gcmVhZFxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX3N1YlRpdGxlIGE6bGFzdC1jaGlsZCcpLmF0dHIoe1xuICAgICAgICAnaHJlZic6IGl0ZW0uTGluayxcbiAgICAgICAgJ3RpdGxlJzogaXRlbS5UaXRsZVxuICAgICAgfSkudGV4dChpdGVtLlRpbWVUb1JlYWQpO1xuICAgICAgLy8gUHVzaCBpdGVtIHRvIG91dHB1dFxuICAgICAgb3V0cHV0LnB1c2goJHRlbXBsYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIGxldCBlbmRwb2ludCA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5hdHRyKCdkYXRhLWVuZHBvaW50Jyk7XG4gICAgdGhpcy5BUEkgPSBuZXcgQXJ0aWNsZUdyaWRBcGkoZW5kcG9pbnQpO1xuICAgIHRoaXMuc2Nyb2xsbmF2KCk7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy5jaGVja1Njcm9sbCgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBBcnRpY2xlR3JpZCgpO1xuIiwiY2xhc3MgQXV0aGVudGljYXRpb25FdmVudHMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIHVybFRva2VuOiAnL2xpYnMvZ3Jhbml0ZS9jc3JmL3Rva2VuLmpzb24nLFxuICAgICAgdXJsQ2hlY2s6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvY2hlY2svaW5kZXguanNvbicsXG4gICAgICB1cmxSZWZyZXNoQ2hlY2s6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcbiAgICAgIHVybERvd25sb2FkQXNzZXQ6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvZG93bmxvYWRfYXNzZXQvaW5kZXguanNvbidcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRQYXRoSG9tZSA9IHRoaXMuZ2V0UGF0aEhvbWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcblxuICAgIHRoaXMucmVhZENvb2tpZSA9IHRoaXMucmVhZENvb2tpZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xlYXJDb29raWUgPSB0aGlzLmNsZWFyQ29va2llLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jcmVhdGVDb29raWUgPSB0aGlzLmNyZWF0ZUNvb2tpZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5jaGVja0xvZ2luU3RhdHVzID0gdGhpcy5jaGVja0xvZ2luU3RhdHVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jaGVja0F1dGhUb2tlbnMgPSB0aGlzLmNoZWNrQXV0aFRva2Vucy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5zaG93TG9nZ2VkSW5FbGVtZW50cyA9IHRoaXMuc2hvd0xvZ2dlZEluRWxlbWVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3dOb3RMb2dnZWRJbkVsZW1lbnRzID0gdGhpcy5zaG93Tm90TG9nZ2VkSW5FbGVtZW50cy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0UGF0aFByZWZpeCgpIHtcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xuICB9XG5cbiAgZ2V0UGF0aEhvbWUoKSB7XG4gICAgY29uc3QgaG9tZSA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLWhvbWVcXCddJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiAoaG9tZSA/IGhvbWUgOiAnJyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgICQod2luZG93KS5vbignY2hlY2thdXRodG9rZW5zLkRITCcsIChldnQsIHRva2VuRGF0YSwgc2tpcEVsZW1lbnRzKSA9PiB7XG4gICAgICB0aGlzLmNoZWNrQXV0aFRva2Vucyh0b2tlbkRhdGEsIHNraXBFbGVtZW50cyk7XG4gICAgfSk7XG4gICAgJCh3aW5kb3cpLm9uKCd1c2VybG9nZ2VkaW4uREhMJywgKGV2dCwgdG9rZW5EYXRhKSA9PiB7XG4gICAgICB0aGlzLnNob3dMb2dnZWRJbkVsZW1lbnRzKHRva2VuRGF0YSk7XG4gICAgfSk7XG4gICAgJCh3aW5kb3cpLm9uKCd1c2Vybm90bG9nZ2VkaW4uREhMJywgKCkgPT4ge1xuICAgICAgdGhpcy5zaG93Tm90TG9nZ2VkSW5FbGVtZW50cygpO1xuICAgIH0pO1xuXG4gICAgLy8gbG9nZ2VkIGluIGhlYWRlciAobG9nb3V0IGxpbmspXG4gICAgdmFyIGxvZ2dlZEluSGVhZGVyID0gJCgnLmZvb3RlciAuZm9vdGVyX19jdGFzLS1sb2dnZWRpbicpO1xuICAgIGlmIChsb2dnZWRJbkhlYWRlci5sZW5ndGggPiAwKSB7XG4gICAgICBsb2dnZWRJbkhlYWRlci5vbignY2xpY2snLCAnLmxvZ291dC1saW5rJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmNsZWFyQ29va2llKCdESEwuQXV0aFRva2VuJyk7XG4gICAgICAgIHRoaXMuY2xlYXJDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nKTtcbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jaGVja0xvZ2luU3RhdHVzKCk7XG4gIH1cblxuICByZWFkQ29va2llKG5hbWUpIHtcbiAgICB2YXIgbmFtZUVRID0gbmFtZSArICc9JztcbiAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgYyA9IGNhW2ldO1xuICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XG4gICAgICBpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjbGVhckNvb2tpZShuYW1lKSB7XG4gICAgdGhpcy5jcmVhdGVDb29raWUobmFtZSwgJycsIC0xKTtcbiAgfVxuXG4gIGNyZWF0ZUNvb2tpZShuYW1lLCB2YWx1ZSwgZXhwaXJ5U2Vjb25kcykge1xuICAgIHZhciBleHBpcmVzID0gJyc7XG4gICAgaWYgKGV4cGlyeVNlY29uZHMpIHtcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChleHBpcnlTZWNvbmRzICogMTAwMCkpO1xuICAgICAgZXhwaXJlcyA9ICc7IGV4cGlyZXM9JyArIGRhdGUudG9VVENTdHJpbmcoKTtcbiAgICB9XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArICc9JyArIHZhbHVlICsgZXhwaXJlcyArICc7IHBhdGg9Lyc7XG4gIH1cblxuICBjaGVja0xvZ2luU3RhdHVzKCkge1xuICAgIHZhciBjb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcbiAgICBpZiAoY29va2llICE9PSBudWxsKSB7XG4gICAgICB2YXIgYXV0aFNwbGl0ID0gY29va2llLnNwbGl0KCd8Jyk7XG4gICAgICBpZiAoYXV0aFNwbGl0Lmxlbmd0aCA+PSAyKSB7XG4gICAgICAgIHRoaXMuY2FsbFRva2VuQ2hlY2sodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxDaGVjaywge1xuICAgICAgICAgIHVzZXJuYW1lOiBhdXRoU3BsaXRbMF0sXG4gICAgICAgICAgdG9rZW46IGF1dGhTcGxpdFsxXVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQod2luZG93KS50cmlnZ2VyKCd1c2Vybm90bG9nZ2VkaW4uREhMJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZWZyZXNoQ29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuUmVmcmVzaFRva2VuJyk7XG4gICAgICBpZiAocmVmcmVzaENvb2tpZSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgcmVmcmVzaENvb2tpZVNwbGl0ID0gcmVmcmVzaENvb2tpZS5zcGxpdCgnfCcpO1xuICAgICAgICBpZiAocmVmcmVzaENvb2tpZVNwbGl0Lmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgdGhpcy5jYWxsVG9rZW5DaGVjayh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFJlZnJlc2hDaGVjaywge1xuICAgICAgICAgICAgdXNlcm5hbWU6IHJlZnJlc2hDb29raWVTcGxpdFswXSxcbiAgICAgICAgICAgIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hDb29raWVTcGxpdFsxXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCd1c2Vybm90bG9nZ2VkaW4uREhMJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQod2luZG93KS50cmlnZ2VyKCd1c2Vybm90bG9nZ2VkaW4uREhMJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2FsbFRva2VuQ2hlY2sodXJsLCBkYXRhKSB7XG4gICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKGNzcmZyZXNwb25zZSkgPT4ge1xuICAgICAgdmFyIGNzcmZ0b2tlbiA9IGNzcmZyZXNwb25zZS50b2tlbjtcblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICB0aGlzLmNoZWNrQXV0aFRva2VucyhyZXNwb25zZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNoZWNrQXV0aFRva2Vucyh0b2tlbkRhdGEsIHNraXBFbGVtZW50cykge1xuICAgIGlmICh0b2tlbkRhdGEgJiYgdG9rZW5EYXRhLnN0YXR1cyAmJiB0b2tlbkRhdGEuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICB0aGlzLmNyZWF0ZUNvb2tpZSgnREhMLkF1dGhUb2tlbicsIHRva2VuRGF0YS51c2VybmFtZSArICd8JyArIHRva2VuRGF0YS50b2tlbiwgdG9rZW5EYXRhLnR0bCk7XG4gICAgICB0aGlzLmNyZWF0ZUNvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicsIHRva2VuRGF0YS51c2VybmFtZSArICd8JyArIHRva2VuRGF0YS5yZWZyZXNoX3Rva2VuLCAoMjQgKiA2MCAqIDYwKSk7XG5cbiAgICAgIGlmIChza2lwRWxlbWVudHMgIT09IHRydWUpIHtcbiAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3VzZXJsb2dnZWRpbi5ESEwnLCB0b2tlbkRhdGEpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHNraXBFbGVtZW50cyAhPT0gdHJ1ZSkge1xuICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3VzZXJub3Rsb2dnZWRpbi5ESEwnKTtcbiAgICB9XG4gIH1cblxuICBzaG93TG9nZ2VkSW5FbGVtZW50cyh0b2tlbkRhdGEpIHtcbiAgICAkKCcuYmVsb3ctcmVnaXN0ZXItZm9ybSAudGFiLm1vYmlsZScpLmhpZGUoKTtcblxuICAgICQoJy5iZWxvdy1yZWdpc3Rlci1mb3JtICNyZWdpc3Rlci10YWItMScpLmhpZGUoKTtcbiAgICAkKFwiLmJlbG93LXJlZ2lzdGVyLWZvcm0gLnRhYi1jb250ZW50cyAudGFiLWNvbnRlbnRbZGF0YS1yZWw9JyNyZWdpc3Rlci10YWItMSddXCIpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cbiAgICAkKCcuYmVsb3ctcmVnaXN0ZXItZm9ybSAjcmVnaXN0ZXItdGFiLTInKS5hZGRDbGFzcygnYWN0aXZlJykuc2hvdygpO1xuICAgICQoXCIuYmVsb3ctcmVnaXN0ZXItZm9ybSAudGFiLWNvbnRlbnRzIC50YWItY29udGVudFtkYXRhLXJlbD0nI3JlZ2lzdGVyLXRhYi0yJ11cIikuYWRkQ2xhc3MoJ29wZW4nKTtcblxuICAgICQoJy5iZWxvdy1yZWdpc3Rlci1mb3JtJykuc2hvdygpO1xuXG4gICAgJCgnaGVhZGVyIC5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS5sb2dnZWQtaW4gLnVzZXItZmlyc3RuYW1lLCBoZWFkZXIgLmhlYWRlcl9fcHJpbWFyeUxpbmtzIC51c2VyLWZpcnN0bmFtZScpLnRleHQodG9rZW5EYXRhLm5hbWUpO1xuICAgICQoJ2hlYWRlciAuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0ubG9nZ2VkLWluLCBoZWFkZXIgLmhlYWRlcl9fcHJpbWFyeUxpbmtzLmxvZ2dlZC1pbicpLnNob3coKTtcbiAgICAkKCcuZm9vdGVyIC5sb2dvdXQtbGlua3MnKS5zaG93KCk7XG5cbiAgICAkKCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZS5sb2dnZWQtaW4nKS5zaG93KCk7XG4gICAgJCgnLmNvbXBldGl0aW9uRGF0YUNhcHR1cmUubG9nZ2VkLWluIC5sb2dnZWRpbi1uYW1lJykudGV4dCh0b2tlbkRhdGEubmFtZSk7XG4gICAgJCgnLmN0YS10aGlyZC1wYW5lbC1sb2dnZWRpbicpLnNob3coKTtcblxuICAgICQoJy5nYXRlZCcpLmFkZENsYXNzKCd1bmxvY2tlZCcpLnJlbW92ZUNsYXNzKCdsb2NrZWQnKS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgJChpdGVtKS5jbG9zZXN0KCdib2R5JykuZmluZCgnLmhlcm8gLmhlcm9fX2N0YS0tZ3JleScpLnNob3coKTtcbiAgICB9KTtcbiAgICAkKCcuZ2F0ZWQtaGlkZScpLmFkZENsYXNzKCd1bmxvY2tlZCcpLnJlbW92ZUNsYXNzKCdsb2NrZWQnKTtcblxuICAgICQoJy5hcnRpY2xlR3JpZCAuYXJ0aWNsZS1ncmlkLWl0ZW0tbG9nZ2VkaW4nKS5zaG93KCk7XG5cbiAgICBpZiAodG9rZW5EYXRhLmZ1bGwgPT09IGZhbHNlKSB7XG4gICAgICAkKCcuY3JlYXRlLXBhc3N3b3JkJykuZmluZCgnLmNyZWF0ZS1wYXNzd29yZC1uYW1lJykudGV4dCh0b2tlbkRhdGEubmFtZSk7XG4gICAgICAkKHdpbmRvdykudHJpZ2dlcignc2hvdy5DcmVhdGVQYXNzd29yZE1vZGFsLkRITCcpO1xuICAgIH1cblxuICAgIGlmICgkKCcucmVzZXQtcGFzc3dvcmQtY29udGFpbmVyJykubGVuZ3RoID4gMCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmdldFBhdGhIb21lKCk7XG4gICAgfVxuICAgIGlmICgkKCcucGFnZS1ib2R5LnJlZ2lzdGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmdldFBhdGhIb21lKCk7XG4gICAgfVxuXG4gICAgaWYgKCQoJy5nYXRpbmdBcnRpY2xlX19hY3Rpb25zLmxvZ2dlZC1pbicpLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBnYXRpbmdBcnRpY2xlRWxtMSA9ICQoJy5nYXRpbmdBcnRpY2xlX19hY3Rpb25zLmxvZ2dlZC1pbicpO1xuXG4gICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xuICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsRG93bmxvYWRBc3NldCxcbiAgICAgICAgICBkYXRhOiB7IGFzc2V0aW5mbzogZ2F0aW5nQXJ0aWNsZUVsbTEuZGF0YSgnYXNzZXRpbmZvJykgfSxcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICAgIGdhdGluZ0FydGljbGVFbG0xLmZpbmQoJy5nYXRpbmdBcnRpY2xlX19idXR0b24nKS5hdHRyKCdocmVmJywgcmVzcG9uc2UuaHJlZik7XG4gICAgICAgICAgICAgIGdhdGluZ0FydGljbGVFbG0xLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCQoJyNkb3dubG9hZCAuREhMZG93bmxvYWRfX2N0YXMubG9nZ2VkLWluJykubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGdhdGluZ0FydGljbGVFbG0yID0gJCgnI2Rvd25sb2FkIC5ESExkb3dubG9hZF9fY3Rhcy5sb2dnZWQtaW4nKTtcblxuICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybERvd25sb2FkQXNzZXQsXG4gICAgICAgICAgZGF0YTogeyBhc3NldGluZm86IGdhdGluZ0FydGljbGVFbG0yLmRhdGEoJ2Fzc2V0aW5mbycpIH0sXG4gICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICBnYXRpbmdBcnRpY2xlRWxtMi5maW5kKCcuREhMZG93bmxvYWRfX2N0YS0tcmVkJykuYXR0cignaHJlZicsIHJlc3BvbnNlLmhyZWYpO1xuICAgICAgICAgICAgICBnYXRpbmdBcnRpY2xlRWxtMi5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNob3dOb3RMb2dnZWRJbkVsZW1lbnRzKCkge1xuICAgICQoJy5iZWxvdy1yZWdpc3Rlci1mb3JtIC50YWItY29udGFpbmVyICNyZWdpc3Rlci10YWItMScpLmFkZENsYXNzKCdhY3RpdmUnKS5zaG93KCk7XG4gICAgJChcIi5iZWxvdy1yZWdpc3Rlci1mb3JtIC50YWItY29udGVudHMgLnRhYi1jb250ZW50W2RhdGEtcmVsPScjcmVnaXN0ZXItdGFiLTEnXVwiKS5hZGRDbGFzcygnb3BlbicpO1xuXG4gICAgJCgnLmJlbG93LXJlZ2lzdGVyLWZvcm0gI3JlZ2lzdGVyLXRhYi0yJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpLnNob3coKTtcbiAgICAkKFwiLmJlbG93LXJlZ2lzdGVyLWZvcm0gLnRhYi1jb250ZW50cyAudGFiLWNvbnRlbnRbZGF0YS1yZWw9JyNyZWdpc3Rlci10YWItMiddXCIpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cbiAgICAkKCcuYmVsb3ctcmVnaXN0ZXItZm9ybScpLnNob3coKTtcblxuICAgICQoJ2hlYWRlciAuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0ubG9nZ2VkLW91dCwgaGVhZGVyIC5oZWFkZXJfX3ByaW1hcnlMaW5rcy5sb2dnZWQtb3V0Jykuc2hvdygpO1xuICAgICQoJy5mb290ZXIgLmxvZ2luLWxpbmtzJykuc2hvdygpO1xuXG4gICAgJCgnLmdhdGluZ0FydGljbGVfX2FjdGlvbnMubm8tbG9nZ2VkLWluJykuc2hvdygpO1xuICAgICQoJyNkb3dubG9hZCAuREhMZG93bmxvYWRfX2N0YXMubm8tbG9nZ2VkLWluJykuc2hvdygpO1xuICAgICQoJy5jb21wZXRpdGlvbkRhdGFDYXB0dXJlLm5vdC1sb2dnZWQtaW4nKS5zaG93KCk7XG4gICAgJCgnLmFydGljbGUtcGFnZS1sb2dpbi1jdGEnKS5zaG93KCk7XG5cbiAgICAkKCcuZ2F0ZWQnKS5hZGRDbGFzcygnbG9ja2VkJykucmVtb3ZlQ2xhc3MoJ3VubG9ja2VkJykuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgICQoaXRlbSkuY2xvc2VzdCgnYm9keScpLmZpbmQoJy5oZXJvIC5oZXJvX19jdGEtLWdyZXknKS5oaWRlKCk7XG4gICAgfSk7XG4gICAgJCgnLmdhdGVkLWhpZGUnKS5hZGRDbGFzcygnbG9ja2VkJykucmVtb3ZlQ2xhc3MoJ3VubG9ja2VkJyk7XG5cbiAgICB2YXIgbmV3c2xldHRlckNvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLk5ld3NsZXR0ZXJTdWJzY3JpYmVkJyk7XG4gICAgaWYgKG5ld3NsZXR0ZXJDb29raWUgIT09IG51bGwpIHtcbiAgICAgICQoJy5hcnRpY2xlR3JpZCAuYXJ0aWNsZS1ncmlkLWl0ZW0tbG9nZ2VkaW4nKS5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJy5hcnRpY2xlR3JpZCAuYXJ0aWNsZS1ncmlkLWl0ZW0tc3Vic2NyaWJlJykuc2hvdygpO1xuICAgICAgJCgnLnN1YnNjcmliZVBhbmVsJykuc2hvdygpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQXV0aGVudGljYXRpb25FdmVudHMoKTtcbiIsImNsYXNzIEJhY2tCdXR0b24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5iYWNrQnV0dG9uJyxcbiAgICAgIGJhY2tCdXR0b246ICcuYmFja0J1dHRvbl9fYnV0dG9uLS1iYWNrJyxcbiAgICAgIGZvcndhcmRCdXR0b246ICcuYmFja0J1dHRvbl9fYnV0dG9uLS1mb3J3YXJkJ1xuICAgIH07XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3dCdXR0b24gPSB0aGlzLnNob3dCdXR0b24uYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdvQmFjayA9IHRoaXMuZ29CYWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nb0ZvcndhcmQgPSB0aGlzLmdvRm9yd2FyZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdEhlYWRyb29tID0gdGhpcy5pbml0SGVhZHJvb20uYmluZCh0aGlzKTtcbiAgfVxuXG4gIHNob3dCdXR0b24oKSB7XG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdiYWNrQnV0dG9uLS1zaG93Jyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmJhY2tCdXR0b24sIHRoaXMuZ29CYWNrKTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5mb3J3YXJkQnV0dG9uLCB0aGlzLmdvRm9yd2FyZCk7XG4gIH1cblxuICBnb0JhY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBoaXN0b3J5LmJhY2soLTEpO1xuICB9XG5cbiAgZ29Gb3J3YXJkKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaGlzdG9yeS5mb3J3YXJkKCk7XG4gIH1cblxuICBpbml0SGVhZHJvb20oKSB7XG4gICAgbGV0IGNvbXBvbmVudCA9ICQodGhpcy5zZWwuY29tcG9uZW50KVswXTtcbiAgICBsZXQgaGVhZHJvb20gID0gbmV3IEhlYWRyb29tKGNvbXBvbmVudCwge1xuICAgICAgY2xhc3Nlczoge1xuICAgICAgICBpbml0aWFsOiAnYmFja0J1dHRvbicsXG4gICAgICAgIHBpbm5lZDogJ2JhY2tCdXR0b24tLXBpbm5lZCcsXG4gICAgICAgIHVucGlubmVkOiAnYmFja0J1dHRvbi0tdW5waW5uZWQnLFxuICAgICAgICB0b3A6ICdiYWNrQnV0dG9uLS10b3AnLFxuICAgICAgICBub3RUb3A6ICdiYWNrQnV0dG9uLS1ub3QtdG9wJyxcbiAgICAgICAgYm90dG9tOiAnYmFja0J1dHRvbi0tYm90dG9tJyxcbiAgICAgICAgbm90Qm90dG9tOiAnYmFja0J1dHRvbi0tbm90LWJvdHRvbSdcbiAgICAgIH1cbiAgICB9KTtcbiAgICBoZWFkcm9vbS5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGxldCBzdGFuZGFsb25lID0gKHdpbmRvdy5tYXRjaE1lZGlhKCcoZGlzcGxheS1tb2RlOiBzdGFuZGFsb25lKScpLm1hdGNoZXMpIHx8ICh3aW5kb3cubmF2aWdhdG9yLnN0YW5kYWxvbmUpO1xuICAgIGlmICghc3RhbmRhbG9uZSkgcmV0dXJuO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHRoaXMuc2hvd0J1dHRvbigpO1xuICAgIHRoaXMuaW5pdEhlYWRyb29tKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEJhY2tCdXR0b24oKTtcbiIsImNsYXNzIEJvb3RzdHJhcENhcm91c2VsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuY2Fyb3VzZWwnLFxuICAgICAgaXRlbXM6ICcuY2Fyb3VzZWwtaXRlbScsXG4gICAgICBsaW5rOiAnLmNhdGVnb3J5SGVyb19fbGluaydcbiAgICB9O1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2hlY2tOdW1iZXJTbGlkZXMgPSB0aGlzLmNoZWNrTnVtYmVyU2xpZGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy50b3VjaFN3aXBlQ2Fyb3VzZWwgPSB0aGlzLnRvdWNoU3dpcGVDYXJvdXNlbC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY2hlY2tOdW1iZXJTbGlkZXMoKSB7XG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmVhY2goKGluZGV4LCAkZWxtKSA9PiB7XG4gICAgICBpZiAoJCgkZWxtKS5maW5kKHRoaXMuc2VsLml0ZW1zKS5sZW5ndGggPD0gMSkge1xuICAgICAgICAkKCRlbG0pLmFkZENsYXNzKCdzdGF0aWMnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHRvdWNoU3dpcGVDYXJvdXNlbCgpIHtcbiAgICBsZXQgaXNTd2lwZSA9IGZhbHNlO1xuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5zd2lwZSh7XG4gICAgICBzd2lwZTogKGV2ZW50LCBkaXJlY3Rpb24pID0+IHtcbiAgICAgICAgbGV0ICRjYXJvdXNlbCA9ICgkKGV2ZW50LnRhcmdldCkuaXModGhpcy5zZWwuY29tcG9uZW50KSA/ICQoZXZlbnQudGFyZ2V0KSA6ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKHRoaXMuc2VsLmNvbXBvbmVudCkpO1xuICAgICAgICBpc1N3aXBlID0gdHJ1ZTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgJGNhcm91c2VsLmNhcm91c2VsKCduZXh0Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgJGNhcm91c2VsLmNhcm91c2VsKCdwcmV2Jyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0YXA6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyB0YXJnZXQgdmFyaWFibGUgcmVwcmVzZW50cyB0aGUgY2xpY2tlZCBvYmplY3RcbiAgICAgICAgaWYgKCQoJy5jYXRlZ29yeUhlcm9fX2xpbmsnKS5sZW5ndGggJiYgd2luZG93LmlubmVyV2lkdGggPCA5OTIpIHtcbiAgICAgICAgICBsZXQgaHJlZiA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCcuY2F0ZWdvcnlIZXJvX19saW5rJykuZmlyc3QoKS5hdHRyKCdkYXRhLWhyZWYnKTtcbiAgICAgICAgICBpZiAoaHJlZiAhPT0gJycpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGhyZWY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWxsb3dQYWdlU2Nyb2xsOiAndmVydGljYWwnXG4gICAgfSk7XG5cbiAgICAkKHRoaXMuc2VsLmxpbmspLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghaXNTd2lwZSkge1xuICAgICAgICBsZXQgaHJlZiA9ICQodGhpcykuYXR0cignZGF0YS1ocmVmJyk7XG4gICAgICAgIGlmIChocmVmICE9PSAnJykge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGhyZWY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlzU3dpcGUgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMudG91Y2hTd2lwZUNhcm91c2VsKCk7XG4gICAgdGhpcy5jaGVja051bWJlclNsaWRlcygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBCb290c3RyYXBDYXJvdXNlbCgpO1xuIiwiY2xhc3MgQ29tcGV0aXRpb25Gb3JtIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICB1cmxUb2tlbjogJy9saWJzL2dyYW5pdGUvY3NyZi90b2tlbi5qc29uJyxcbiAgICAgIHVybFJlZnJlc2hDaGVjazogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZWZyZXNoX3Rva2VuL2luZGV4Lmpzb24nLFxuICAgICAgdXJsR2V0QWxsRGV0YWlsczogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9nZXRkZXRhaWxzL2luZGV4Lmpzb24nLFxuICAgICAgdXJsQ29tcGV0aXRpb246ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvY29tcGV0aXRpb24vaW5kZXguanNvbidcbiAgICB9O1xuXG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZSBmb3JtJ1xuICAgIH07XG5cbiAgICB0aGlzLmdldFBhdGhQcmVmaXggPSB0aGlzLmdldFBhdGhQcmVmaXguYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlYWRDb29raWUgPSB0aGlzLnJlYWRDb29raWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4gPSB0aGlzLnRyeUNvbXBldGl0aW9uRW50cnlMb2dnZWRJbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMudHJ5Q29tcGV0aXRpb25FbnRyeU5vdExvZ2dlZEluID0gdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5Tm90TG9nZ2VkSW4uYmluZCh0aGlzKTtcbiAgICB0aGlzLmNvbXBsZXRlQ29tcGV0aXRpb25FbnRyeUxvZ2dlZEluID0gdGhpcy5jb21wbGV0ZUNvbXBldGl0aW9uRW50cnlMb2dnZWRJbi5iaW5kKHRoaXMpO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgfVxuXG4gIGdldFBhdGhQcmVmaXgoKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcbiAgfVxuXG4gIHJlYWRDb29raWUobmFtZSkge1xuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xuICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjID0gY2FbaV07XG4gICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhbGlkYXRlKCkge1xuICAgIHZhciBjb21wZXRpdGlvbkVudHJ5ID0gJCh0aGlzLnNlbC5jb21wb25lbnQpO1xuXG4gICAgaWYgKGNvbXBldGl0aW9uRW50cnkubGVuZ3RoID4gMCkge1xuICAgICAgY29tcGV0aXRpb25FbnRyeS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICBpZiAoJChpdGVtKS5jbG9zZXN0KCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZScpLmhhc0NsYXNzKCdub3QtbG9nZ2VkLWluJykpIHtcbiAgICAgICAgICAkKGl0ZW0pLnZhbGlkYXRlKHtcbiAgICAgICAgICAgIHJ1bGVzOiB7XG4gICAgICAgICAgICAgIHJlZ2lzdGVyX195b3VyRW1haWw6ICdlbWFpbCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnRyeUNvbXBldGl0aW9uRW50cnlOb3RMb2dnZWRJbihmb3JtKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQoaXRlbSkudmFsaWRhdGUoe1xuICAgICAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VibWl0SGFuZGxlcjogKGZvcm0pID0+IHtcbiAgICAgICAgICAgICAgdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4oZm9ybSk7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cblxuICB0cnlDb21wZXRpdGlvbkVudHJ5Tm90TG9nZ2VkSW4oZm9ybSkge1xuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xuXG4gICAgdmFyIGRhdGEgPSB7IH07XG4gICAgaWYgKGZybS5maW5kKCcuY29tcC1hbnN3ZXInKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHZhciBhbnN3ZXIgPSBmcm0uZmluZChcImlucHV0W3R5cGU9J3JhZGlvJ106Y2hlY2tlZFwiKS52YWwoKTtcbiAgICAgIGlmIChhbnN3ZXIgPT09IG51bGwgfHwgYW5zd2VyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBhbGVydCgnUGxlYXNlIHNlbGVjdCBhbiBvcHRpb24nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBkYXRhID0ge1xuICAgICAgICBmaXJzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fZmlyc3ROYW1lJykudmFsKCksXG4gICAgICAgIGxhc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2xhc3ROYW1lJykudmFsKCksXG4gICAgICAgIGVtYWlsOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3lvdXJFbWFpbCcpLnZhbCgpLFxuXG4gICAgICAgIHBvc2l0aW9uOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3Bvc2l0aW9uJykudmFsKCksXG4gICAgICAgIGNvbnRhY3Q6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fY29udGFjdE51bWJlcicpLnZhbCgpLFxuICAgICAgICBzaXplOiBmcm0uZmluZCgnc2VsZWN0I3JlZ2lzdGVyX19idXNpbmVzc1NpemUnKS52YWwoKSxcbiAgICAgICAgc2VjdG9yOiBmcm0uZmluZCgnc2VsZWN0I3JlZ2lzdGVyX19idXNpbmVzc1NlY3RvcicpLnZhbCgpLFxuXG4gICAgICAgIHBhdGg6IGZybS5kYXRhKCdwYXRoJyksXG4gICAgICAgIGFuc3dlcjogYW5zd2VyXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0ge1xuICAgICAgICBmaXJzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fZmlyc3ROYW1lJykudmFsKCksXG4gICAgICAgIGxhc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2xhc3ROYW1lJykudmFsKCksXG4gICAgICAgIGVtYWlsOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3lvdXJFbWFpbCcpLnZhbCgpLFxuXG4gICAgICAgIHBvc2l0aW9uOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3Bvc2l0aW9uJykudmFsKCksXG4gICAgICAgIGNvbnRhY3Q6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fY29udGFjdE51bWJlcicpLnZhbCgpLFxuICAgICAgICBzaXplOiBmcm0uZmluZCgnc2VsZWN0I3JlZ2lzdGVyX19idXNpbmVzc1NpemUnKS52YWwoKSxcbiAgICAgICAgc2VjdG9yOiBmcm0uZmluZCgnc2VsZWN0I3JlZ2lzdGVyX19idXNpbmVzc1NlY3RvcicpLnZhbCgpLFxuXG4gICAgICAgIHBhdGg6IGZybS5kYXRhKCdwYXRoJylcbiAgICAgIH07XG5cbiAgICAgIGZybS5maW5kKCcuY29tcC1hbnN3ZXInKS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICB2YXIgdmFsID0gJChpdGVtKS52YWwoKTtcbiAgICAgICAgaWYgKCQoaXRlbSkuZGF0YSgnaW5kZXgnKSA9PT0gMSkge1xuICAgICAgICAgIGRhdGEuYW5zd2VyID0gdmFsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGFbJ2Fuc3dlcicgKyAkKGl0ZW0pLmRhdGEoJ2luZGV4JyldID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCgkLnRyaW0oZGF0YS5maXJzdG5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShkYXRhLmxhc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS5lbWFpbCkubGVuZ3RoID09PSAwKSkge1xuICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciB5b3VyIG5hbWUsIGVtYWlsIGFkZHJlc3MgYW5kIGNvbXBldGl0aW9uIGRldGFpbHMuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgICBmcm0uZmluZChcImlucHV0W3R5cGU9J3N1Ym1pdCddXCIpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcblxuICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsQ29tcGV0aXRpb24sXG4gICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICAgIHZhciBtb2RhbCA9IGZybS5jbG9zZXN0KCcuY29tcGV0aXRpb24tY29udGFpbmVyJykuZmluZCgnLm1vZGFsJyk7XG4gICAgICAgICAgICAgICAgbW9kYWwuZmluZCgnLnRoYW5rcy1uYW1lJykudGV4dChkYXRhLmZpcnN0bmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gbW9kYWwubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5zaG93KCkuYWRkQ2xhc3MoJ3Nob3cnKTtcblxuICAgICAgICAgICAgICAgIGZybS5jbG9zZXN0KCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uXFxuJyArIHJlc3BvbnNlLmVycm9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0VudGVyIHRoZSBjb21wZXRpdGlvbicpO1xuICAgICAgICAgICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ0VudGVyIHRoZSBjb21wZXRpdGlvbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB0cnlDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4oZm9ybSkge1xuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XG5cbiAgICB2YXIgY29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuQXV0aFRva2VuJyk7XG4gICAgaWYgKGNvb2tpZSAhPT0gbnVsbCkge1xuICAgICAgdmFyIHNwbGl0ID0gY29va2llLnNwbGl0KCd8Jyk7XG4gICAgICBpZiAoc3BsaXQubGVuZ3RoID49IDIpIHtcbiAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcbiAgICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcbiAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybEdldEFsbERldGFpbHMsXG4gICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiBzcGxpdFswXSwgdG9rZW46IHNwbGl0WzFdIH0sXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgc3VjY2VzczogKGFsbERldGFpbHNSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxldGVDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4oZm9ybSwgYWxsRGV0YWlsc1Jlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZWZyZXNoQ29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuUmVmcmVzaFRva2VuJyk7XG4gICAgICBpZiAocmVmcmVzaENvb2tpZSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgcmVmcmVzaFNwbGl0ID0gcmVmcmVzaENvb2tpZS5zcGxpdCgnfCcpO1xuICAgICAgICBpZiAocmVmcmVzaFNwbGl0Lmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFJlZnJlc2hDaGVjayxcbiAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogcmVmcmVzaFNwbGl0WzBdLCByZWZyZXNoX3Rva2VuOiByZWZyZXNoU3BsaXRbMV0gfSxcbiAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXG4gICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZWZyZXNoUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgcmVmcmVzaFJlc3BvbnNlLCB0cnVlIF0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyeUNvbXBldGl0aW9uRW50cnlMb2dnZWRJbihmb3JtKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlQ29tcGV0aXRpb25FbnRyeUxvZ2dlZEluKGZvcm0sIGRldGFpbHMpIHtcbiAgICB2YXIgZnJtID0gJChmb3JtKTtcblxuICAgIHZhciBhbnN3ZXIgPSAnJztcbiAgICBpZiAoZnJtLmZpbmQoJy5jb21wLWFuc3dlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgIGFuc3dlciA9IGZybS5maW5kKCcuY29tcC1hbnN3ZXInKS52YWwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYW5zd2VyID0gZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdyYWRpbyddOmNoZWNrZWRcIikudmFsKCk7XG4gICAgICBpZiAoYW5zd2VyID09PSBudWxsIHx8IGFuc3dlci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYWxlcnQoJ1BsZWFzZSBzZWxlY3QgYW4gb3B0aW9uJyk7XG4gICAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0VudGVyIHRoZSBjb21wZXRpdGlvbiAnICsgZGV0YWlscy5yZWdpc3RyYXRpb25fZmlyc3RuYW1lKTtcbiAgICAgICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ0VudGVyIHRoZSBjb21wZXRpdGlvbiAnICsgZGV0YWlscy5yZWdpc3RyYXRpb25fZmlyc3RuYW1lKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkYXRhID0ge1xuICAgICAgZmlyc3RuYW1lOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9maXJzdG5hbWUsXG4gICAgICBsYXN0bmFtZTogZGV0YWlscy5yZWdpc3RyYXRpb25fbGFzdG5hbWUsXG4gICAgICBlbWFpbDogZGV0YWlscy5yZWdpc3RyYXRpb25fZW1haWwsXG5cbiAgICAgIHBvc2l0aW9uOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9wb3NpdGlvbixcbiAgICAgIGNvbnRhY3Q6IGRldGFpbHMucmVnaXN0cmF0aW9uX2NvbnRhY3QsXG4gICAgICBzaXplOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9zaXplLFxuICAgICAgc2VjdG9yOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9zZWN0b3IsXG5cbiAgICAgIHBhdGg6IGZybS5kYXRhKCdwYXRoJyksXG4gICAgICBhbnN3ZXI6IGFuc3dlclxuICAgIH07XG5cbiAgICBpZiAoKCQudHJpbShkYXRhLmFuc3dlcikubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEuZmlyc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS5sYXN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEuZW1haWwpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgeW91ciBuYW1lLCBlbWFpbCBhZGRyZXNzIGFuZCBjb21wZXRpdGlvbiBkZXRhaWxzLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xuICAgICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XG5cbiAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxDb21wZXRpdGlvbixcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXG4gICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZGFsID0gZnJtLmNsb3Nlc3QoJy5jb21wZXRpdGlvbi1jb250YWluZXInKS5maW5kKCcubW9kYWwnKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCcudGhhbmtzLW5hbWUnKS50ZXh0KGRhdGEuZmlyc3RuYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBtb2RhbC5tb2RhbCgnc2hvdycpO1xuICAgICAgICAgICAgICAgIG1vZGFsLnNob3coKS5hZGRDbGFzcygnc2hvdycpO1xuXG4gICAgICAgICAgICAgICAgZnJtLmNsb3Nlc3QoJy5jb21wZXRpdGlvbkRhdGFDYXB0dXJlJykuaGlkZSgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgnRW50ZXIgdGhlIGNvbXBldGl0aW9uICcgKyBkYXRhLmZpcnN0bmFtZSk7XG4gICAgICAgICAgICBmcm0uZmluZChcImlucHV0W3R5cGU9J3N1Ym1pdCddXCIpLnZhbCgnRW50ZXIgdGhlIGNvbXBldGl0aW9uICcgKyBkYXRhLmZpcnN0bmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0VudGVyIHRoZSBjb21wZXRpdGlvbicpO1xuICAgIGZybS5maW5kKFwiaW5wdXRbdHlwZT0nc3VibWl0J11cIikudmFsKCdFbnRlciB0aGUgY29tcGV0aXRpb24nKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ29tcGV0aXRpb25Gb3JtKCk7XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIElEQjoge1xuICAgIERCOiAnb2ZmbGluZS1hcnRpY2xlcycsXG4gICAgQVJUSUNMRVNfU1RPUkU6ICdhcnRpY2xlcydcbiAgfVxufTtcbiIsImNsYXNzIENvb2tpZUJhbm5lciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLmNvb2tpZS1iYW5uZXInLFxuICAgICAgY2xvc2VCdXR0b246ICcuY29va2llLWJhbm5lcl9fYnV0dG9uJ1xuICAgIH07XG5cbiAgICB0aGlzLmNvb2tpZU5hbWUgPSAnZGhsLWNvb2tpZS13YXJuaW5nJztcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGlkZUNvb2tpZUJhbm5lciA9IHRoaXMuaGlkZUNvb2tpZUJhbm5lci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvd0Nvb2tpZUJhbm5lciA9IHRoaXMuc2hvd0Nvb2tpZUJhbm5lci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZGlzcGxheUJhbm5lciA9IHRoaXMuZGlzcGxheUJhbm5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy5kaXNwbGF5QmFubmVyKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNsb3NlQnV0dG9uLCAoKSA9PiB7XG4gICAgICB0aGlzLmhpZGVDb29raWVCYW5uZXIoKTtcbiAgICAgIENvb2tpZXMuc2V0KHRoaXMuY29va2llTmFtZSwge3NlZW46IDF9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpc3BsYXlCYW5uZXIoKSB7XG4gICAgbGV0IGNvb2tpZSA9IENvb2tpZXMuZ2V0KHRoaXMuY29va2llTmFtZSk7XG5cbiAgICBpZiAodHlwZW9mIGNvb2tpZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuc2hvd0Nvb2tpZUJhbm5lcigpO1xuICAgIH1cbiAgfVxuXG4gIHNob3dDb29raWVCYW5uZXIoKSB7XG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdjb29raWUtYmFubmVyLS1kaXNwbGF5Jyk7XG4gIH1cblxuICBoaWRlQ29va2llQmFubmVyKCkge1xuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5yZW1vdmVDbGFzcygnY29va2llLWJhbm5lci0tZGlzcGxheScpO1xuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5yZW1vdmUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ29va2llQmFubmVyKCk7XG4iLCJpbXBvcnQgQ29uc3RhbnRzIGZyb20gJy4vQ29uc3RhbnRzJztcblxuY2xhc3MgRGF0YWJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRhdGFiYXNlID0gbnVsbDtcblxuICAgIHRoaXMuaW5pdGlhdGVEYiA9IHRoaXMuaW5pdGlhdGVEYi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYWRkQXJ0aWNsZSA9IHRoaXMuYWRkQXJ0aWNsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZGVsZXRlQXJ0aWNsZSA9IHRoaXMuZGVsZXRlQXJ0aWNsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0QXJ0aWNsZXMgPSB0aGlzLmdldEFydGljbGVzLmJpbmQodGhpcyk7XG5cbiAgICAvLyBDcmVhdGUvZ2V0IERCXG4gICAgaWYgKHdpbmRvdy5Qcm9taXNlKSB7XG4gICAgICB0aGlzLmluaXRpYXRlRGIoKTtcbiAgICB9XG4gIH1cblxuICBpbml0aWF0ZURiKCkge1xuICAgIHRoaXMuZGF0YWJhc2UgPSBpZGIub3BlbihDb25zdGFudHMuSURCLkRCLCAxLCAodXBncmFkZURiKSA9PiB7XG4gICAgICBpZiAoIXVwZ3JhZGVEYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKENvbnN0YW50cy5JREIuQVJUSUNMRVNfU1RPUkUpKSB7XG4gICAgICAgIGxldCBhcnRpY2xlT1MgPSB1cGdyYWRlRGIuY3JlYXRlT2JqZWN0U3RvcmUoQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRSwge1xuICAgICAgICAgIGtleVBhdGg6ICdsaW5rJ1xuICAgICAgICB9KTtcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCd0aXRsZScsICd0aXRsZScsIHt1bmlxdWU6IGZhbHNlfSk7XG4gICAgICAgIGFydGljbGVPUy5jcmVhdGVJbmRleCgnbGluaycsICdsaW5rJywge3VuaXF1ZTogdHJ1ZX0pO1xuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2Rlc2NyaXB0aW9uJywgJ2Rlc2NyaXB0aW9uJywge3VuaXF1ZTogZmFsc2V9KTtcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdjYXRlZ29yeU5hbWUnLCAnY2F0ZWdvcnlOYW1lJywge3VuaXF1ZTogZmFsc2V9KTtcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdjYXRlZ29yeUxpbmsnLCAnY2F0ZWdvcnlMaW5rJywge3VuaXF1ZTogZmFsc2V9KTtcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCd0aW1lVG9SZWFkJywgJ3RpbWVUb1JlYWQnLCB7dW5pcXVlOiBmYWxzZX0pO1xuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2ltYWdlTW9iaWxlJywgJ2ltYWdlTW9iaWxlJywge3VuaXF1ZTogZmFsc2V9KTtcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdpbWFnZURlc2t0b3AnLCAnaW1hZ2VEZXNrdG9wJywge3VuaXF1ZTogZmFsc2V9KTtcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdpc0xhcmdlJywgJ2lzTGFyZ2UnLCB7dW5pcXVlOiBmYWxzZX0pO1xuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2lzVmlkZW8nLCAnaXNWaWRlbycsIHt1bmlxdWU6IGZhbHNlfSk7XG4gICAgICAgIGFydGljbGVPUy5jcmVhdGVJbmRleCgnY2FjaGVOYW1lJywgJ2NhY2hlTmFtZScsIHt1bmlxdWU6IGZhbHNlfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkZWxldGVBcnRpY2xlKGxpbmspIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZS50aGVuKChkYikgPT4ge1xuICAgICAgbGV0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oW0NvbnN0YW50cy5JREIuQVJUSUNMRVNfU1RPUkVdLCAncmVhZHdyaXRlJyk7XG4gICAgICBsZXQgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShDb25zdGFudHMuSURCLkFSVElDTEVTX1NUT1JFKTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgIHN0b3JlLmRlbGV0ZShsaW5rKSxcbiAgICAgICAgdHJhbnNhY3Rpb24uY29tcGxldGVcbiAgICAgIF0pO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkQXJ0aWNsZSh0aXRsZSwgbGluaywgZGVzY3JpcHRpb24sIGNhdGVnb3J5TmFtZSwgY2F0ZWdvcnlMaW5rLCB0aW1lVG9SZWFkLCBpbWFnZU1vYmlsZSwgaW1hZ2VEZXNrdG9wLCBpc0xhcmdlLCBpc1ZpZGVvLCBjYWNoZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZS50aGVuKChkYikgPT4ge1xuICAgICAgbGV0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oW0NvbnN0YW50cy5JREIuQVJUSUNMRVNfU1RPUkVdLCAncmVhZHdyaXRlJyk7XG4gICAgICBsZXQgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShDb25zdGFudHMuSURCLkFSVElDTEVTX1NUT1JFKTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgIHN0b3JlLmFkZCh7XG4gICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgbGluayxcbiAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICBjYXRlZ29yeU5hbWUsXG4gICAgICAgICAgY2F0ZWdvcnlMaW5rLFxuICAgICAgICAgIHRpbWVUb1JlYWQsXG4gICAgICAgICAgaW1hZ2VNb2JpbGUsXG4gICAgICAgICAgaW1hZ2VEZXNrdG9wLFxuICAgICAgICAgIGlzTGFyZ2UsXG4gICAgICAgICAgaXNWaWRlbyxcbiAgICAgICAgICBjYWNoZU5hbWVcbiAgICAgICAgfSksXG4gICAgICAgIHRyYW5zYWN0aW9uLmNvbXBsZXRlXG4gICAgICBdKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEFydGljbGVzKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFiYXNlLnRoZW4oKGRiKSA9PiB7XG4gICAgICBsZXQgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihbQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRV0sICdyZWFkb25seScpO1xuICAgICAgbGV0IHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRSk7XG4gICAgICByZXR1cm4gc3RvcmUuZ2V0QWxsKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IERhdGFiYXNlKCk7XG4iLCJjbGFzcyBEZWxldGVBY2NvdW50Rm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgdXJsVG9rZW46ICcvbGlicy9ncmFuaXRlL2NzcmYvdG9rZW4uanNvbicsXG4gICAgICB1cmxSZWZyZXNoQ2hlY2s6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcbiAgICAgIHVybEdldEFsbERldGFpbHM6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvZ2V0ZGV0YWlscy9pbmRleC5qc29uJyxcbiAgICAgIHVybERlbGV0ZUFjY291bnQ6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvZGVsZXRlYWNjb3VudC9pbmRleC5qc29uJ1xuICAgIH07XG5cbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5kZWxldGUtYWNjb3VudCdcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRQYXRoSG9tZSA9IHRoaXMuZ2V0UGF0aEhvbWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlYWRDb29raWUgPSB0aGlzLnJlYWRDb29raWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsZWFyQ29va2llID0gdGhpcy5jbGVhckNvb2tpZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY3JlYXRlQ29va2llID0gdGhpcy5jcmVhdGVDb29raWUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMudHJ5RGVsZXRlQWNjb3VudCA9IHRoaXMudHJ5RGVsZXRlQWNjb3VudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY29tcGxldGVEZWxldGVBY2NvdW50ID0gdGhpcy5jb21wbGV0ZURlbGV0ZUFjY291bnQuYmluZCh0aGlzKTtcblxuICAgIHRoaXMubG9nZ2VkSW4gPSB0aGlzLmxvZ2dlZEluLmJpbmQodGhpcyk7XG4gICAgdGhpcy5ub3RMb2dnZWRJbiA9IHRoaXMubm90TG9nZ2VkSW4uYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldFBhdGhQcmVmaXgoKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcbiAgfVxuXG4gIGdldFBhdGhIb21lKCkge1xuICAgIGNvbnN0IGhvbWUgPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1ob21lXFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKGhvbWUgPyBob21lIDogJycpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGpRdWVyeS52YWxpZGF0b3IuYWRkTWV0aG9kKCdwYXNzd29yZCcsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJChlbGVtZW50KS5hdHRyKCdwYXR0ZXJuJykpLnRlc3QodmFsdWUpO1xuICAgIH0sICdQYXNzd29yZCBmb3JtYXQgaXMgbm90IHZhbGlkJyk7XG5cbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnZXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xuICAgICAgcmV0dXJuICgkKCcjJyArICQoZWxlbWVudCkuYXR0cignZGF0YS1lcXVhbFRvJykpLnZhbCgpID09PSAkKGVsZW1lbnQpLnZhbCgpKTtcbiAgICB9LCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCd1c2VybG9nZ2VkaW4uREhMJywgKGV2dCwgdG9rZW5EYXRhKSA9PiB7XG4gICAgICB0aGlzLmxvZ2dlZEluKHRva2VuRGF0YSk7XG4gICAgfSk7XG4gICAgJCh3aW5kb3cpLm9uKCd1c2Vybm90bG9nZ2VkaW4uREhMJywgKCkgPT4ge1xuICAgICAgdGhpcy5ub3RMb2dnZWRJbigpO1xuICAgIH0pO1xuXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJ2Zvcm0nKS52YWxpZGF0ZSh7XG4gICAgICBydWxlczoge1xuICAgICAgICBsb2dpbl9fZmlyc3ROYW1lOiAnZW1haWwnLFxuICAgICAgICBsb2dpbl9fcGFzc3dvcmQ6ICdwYXNzd29yZCdcbiAgICAgIH0sXG4gICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybSkgPT4ge1xuICAgICAgICB0aGlzLnRyeURlbGV0ZUFjY291bnQoZm9ybSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlYWRDb29raWUobmFtZSkge1xuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xuICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjID0gY2FbaV07XG4gICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNsZWFyQ29va2llKG5hbWUpIHtcbiAgICB0aGlzLmNyZWF0ZUNvb2tpZShuYW1lLCAnJywgLTEpO1xuICB9XG5cbiAgY3JlYXRlQ29va2llKG5hbWUsIHZhbHVlLCBleHBpcnlTZWNvbmRzKSB7XG4gICAgdmFyIGV4cGlyZXMgPSAnJztcbiAgICBpZiAoZXhwaXJ5U2Vjb25kcykge1xuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgKGV4cGlyeVNlY29uZHMgKiAxMDAwKSk7XG4gICAgICBleHBpcmVzID0gJzsgZXhwaXJlcz0nICsgZGF0ZS50b1VUQ1N0cmluZygpO1xuICAgIH1cbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgJz0nICsgdmFsdWUgKyBleHBpcmVzICsgJzsgcGF0aD0vJztcbiAgfVxuXG4gIHRyeURlbGV0ZUFjY291bnQoZm9ybSkge1xuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcblxuICAgIHZhciBjb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcbiAgICBpZiAoY29va2llICE9PSBudWxsKSB7XG4gICAgICB2YXIgc3BsaXQgPSBjb29raWUuc3BsaXQoJ3wnKTtcbiAgICAgIGlmIChzcGxpdC5sZW5ndGggPj0gMikge1xuICAgICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xuICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xuICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsR2V0QWxsRGV0YWlscyxcbiAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHNwbGl0WzBdLCB0b2tlbjogc3BsaXRbMV0gfSxcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBzdWNjZXNzOiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIGFsbERldGFpbHNSZXNwb25zZSwgdHJ1ZSBdKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxldGVEZWxldGVBY2NvdW50KGZvcm0sIGFsbERldGFpbHNSZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZGVsZXRlIHlvdXIgYWNjb3VudCAoMSkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICgyKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICgzKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVmcmVzaENvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicpO1xuICAgICAgaWYgKHJlZnJlc2hDb29raWUgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIHJlZnJlc2hTcGxpdCA9IHJlZnJlc2hDb29raWUuc3BsaXQoJ3wnKTtcbiAgICAgICAgaWYgKHJlZnJlc2hTcGxpdC5sZW5ndGggPj0gMikge1xuICAgICAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxSZWZyZXNoQ2hlY2ssXG4gICAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHJlZnJlc2hTcGxpdFswXSwgcmVmcmVzaF90b2tlbjogcmVmcmVzaFNwbGl0WzFdIH0sXG4gICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxuICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICBzdWNjZXNzOiAocmVmcmVzaFJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHJlZnJlc2hSZXNwb25zZSwgdHJ1ZSBdKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cnlEZWxldGVBY2NvdW50KGZvcm0pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICg0KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQgKDUpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQgKDYpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZGVsZXRlIHlvdXIgYWNjb3VudC4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlRGVsZXRlQWNjb3VudChmb3JtLCBkZXRhaWxzKSB7XG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XG5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIHRva2VuOiBkZXRhaWxzLnRva2VuLFxuXG4gICAgICB1c2VybmFtZTogZnJtLmZpbmQoJ2lucHV0I2xvZ2luX19maXJzdE5hbWUnKS52YWwoKSxcbiAgICAgIHBhc3N3b3JkOiBmcm0uZmluZCgnaW5wdXQjbG9naW5fX3Bhc3N3b3JkJykudmFsKClcbiAgICB9O1xuXG4gICAgaWYgKCgkLnRyaW0oZGF0YS51c2VybmFtZSkubGVuZ3RoID09IDApIHx8ICgkLnRyaW0oZGF0YS5wYXNzd29yZCkubGVuZ3RoID09IDApKSB7XG4gICAgICBhbGVydCgnUGxlYXNlIGVudGVyIHlvdXIgZW1haWwgYWRkcmVzcyBhbmQgcGFzc3dvcmQuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xuXG4gICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xuICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsRGVsZXRlQWNjb3VudCxcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXG4gICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICBzdWNjZXNzOiAoZGVsZXRlQWNjb3VudFJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGVsZXRlQWNjb3VudFJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyBkZWxldGVBY2NvdW50UmVzcG9uc2UsIHRydWUgXSk7XG5cbiAgICAgICAgICAgICAgaWYgKGRlbGV0ZUFjY291bnRSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyQ29va2llKCdESEwuQXV0aFRva2VuJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhckNvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicpO1xuXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZnJtLmRhdGEoJ3N1Y2Nlc3N1cmwnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50LlxcbicgKyBkZWxldGVBY2NvdW50UmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0RlbGV0ZSBBY2NvdW50Jyk7XG4gICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdEZWxldGUgQWNjb3VudCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdEZWxldGUgQWNjb3VudCcpO1xuICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ0RlbGV0ZSBBY2NvdW50Jyk7XG4gIH1cblxuICBsb2dnZWRJbih0b2tlbkRhdGEpIHtcbiAgICBpZiAodG9rZW5EYXRhICYmIHRva2VuRGF0YS5zdGF0dXMgJiYgdG9rZW5EYXRhLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcbiAgICB9XG4gIH1cblxuICBub3RMb2dnZWRJbigpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmhhc0NsYXNzKCduby1yZWRpcmVjdCcpKSB7XG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuZ2V0UGF0aEhvbWUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IERlbGV0ZUFjY291bnRGb3JtKCk7XG4iLCJjbGFzcyBFY29tRm9ybXMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5lY29tLWZvcm0nLFxuICAgICAgY2xvc2VJY29uOiAnLmVjb20tZm9ybV9fY2xvc2UnLFxuICAgICAgbWF4Rm9ybTogJy5lY29tLWZvcm0tLW1heCcsXG4gICAgICBtaW5Gb3JtOiAnLmVjb20tZm9ybS0tbWluJyxcbiAgICAgIHN1Ym1pdEZvcm06ICcuZWNvbS1mb3JtIGlucHV0W3R5cGU9c3VibWl0XSdcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNwbGF5Rm9ybUFmdGVyID0gNTAwMDtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZm9ybVRpbWVyID0gdGhpcy5mb3JtVGltZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3dIaWRlTWF4Rm9ybSA9IHRoaXMuc2hvd0hpZGVNYXhGb3JtLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaG93SGlkZU1pbkZvcm0gPSB0aGlzLnNob3dIaWRlTWluRm9ybS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0Rm9ybSA9IHRoaXMuc3VibWl0Rm9ybS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy5mb3JtVGltZXIoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuY2xvc2VJY29uLCAoKSA9PiB7XG4gICAgICB0aGlzLnNob3dIaWRlTWF4Rm9ybSgpO1xuICAgICAgdGhpcy5zaG93SGlkZU1pbkZvcm0oKTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnN1Ym1pdEZvcm0sIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBsZXQgZm9ybSA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJ2Zvcm0nKTtcbiAgICAgIHRoaXMuc3VibWl0Rm9ybShmb3JtKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZvcm1UaW1lcigpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2hvd0hpZGVNYXhGb3JtKCk7XG4gICAgfSwgdGhpcy5kaXNwbGF5Rm9ybUFmdGVyKTtcbiAgfVxuXG4gIHNob3dIaWRlTWF4Rm9ybSgpIHtcbiAgICAkKHRoaXMuc2VsLm1heEZvcm0pLnRvZ2dsZUNsYXNzKCdpcy1oaWRkZW4nKTtcbiAgfVxuXG4gIHNob3dIaWRlTWluRm9ybSgpIHtcbiAgICAkKHRoaXMuc2VsLm1pbkZvcm0pLnRvZ2dsZUNsYXNzKCdpcy1zaG93bicpO1xuICB9XG5cbiAgc3VibWl0Rm9ybShmb3JtKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBmb3JtLmF0dHIoJ2FjdGlvbicpICsgJz8nICsgZm9ybS5zZXJpYWxpemUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRWNvbUZvcm1zKCk7XG4iLCJpbXBvcnQgUGFzc3dvcmRWYWxpZGl0eSBmcm9tICcuL1Bhc3N3b3JkVmFsaWRpdHknO1xuXG5jbGFzcyBGb3JtVmFsaWRhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLmZvcm1zJ1xuICAgIH07XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYWRkUGFzc3dvcmRDaGVjayA9IHRoaXMuYWRkUGFzc3dvcmRDaGVjay5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICB0aGlzLmFkZFBhc3N3b3JkQ2hlY2soKTtcbiAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhZGRQYXNzd29yZENoZWNrKCkge1xuICAgICQudmFsaWRhdG9yLmFkZE1ldGhvZCgncGFzc3dvcmRDaGVjaycsICh2YWx1ZSkgPT4ge1xuICAgICAgcmV0dXJuIFBhc3N3b3JkVmFsaWRpdHkuaXNQYXNzd29yZFZhbGlkKHZhbHVlKTtcbiAgICB9LCAnUGxlYXNlIGVudGVyIGEgdmFsaWQgcGFzc3dvcmQnKTtcbiAgfVxuXG4gIHZhbGlkYXRlKCkge1xuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS52YWxpZGF0ZSh7XG4gICAgICBydWxlczoge1xuICAgICAgICAncmVxdWlyZWQnOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ3Bhc3N3b3JkJzoge1xuICAgICAgICAgIHBhc3N3b3JkQ2hlY2s6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgICAgICQoZWxlbWVudCkuYXBwZW5kKGVycm9yKTtcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBGb3JtVmFsaWRhdGlvbigpO1xuIiwiY2xhc3MgSGVhZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5sYXN0TGV0dGVyID0gJyc7XG4gICAgdGhpcy5hbGxTdWdnZXN0aW9ucyA9IFtdO1xuICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgIHRoaXMubWF4U3VnZ2VzdGlvbnMgPSAwO1xuICAgIHRoaXMubGFzdFZhbCA9ICcnO1xuXG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuaGVhZGVyJyxcbiAgICAgIHRvZ2dsZTogJy5oZWFkZXJfX25hdmlnYXRpb24nLFxuICAgICAgbWVudTogJy5oZWFkZXJfX21lZ2FuYXYnLFxuICAgICAgb3ZlcmxheTogJy5oZWFkZXJfX292ZXJsYXknLFxuICAgICAgc2VhcmNoOiAnLmhlYWRlcl9fZGVza3RvcFNlYXJjaCcsXG4gICAgICBzZWFyY2hGb3JtOiAnLmhlYWRlcl9fc2VhcmNoZm9ybScsXG4gICAgICBzZWFyY2hGb3JtRm9ybTogJy5oZWFkZXJfX3NlYXJjaGZvcm0gZm9ybScsXG4gICAgICBzZWFyY2hGb3JtSW5wdXQ6ICcuaGVhZGVyX19zZWFyY2hmb3JtIC5mb3JtLWZpZWxkJyxcbiAgICAgIHNlYXJjaEZvcm1JbnB1dENsZWFyOiAnLmhlYWRlcl9fc2VhcmNoZm9ybSAuZm9ybS1ncm91cCAuY2xlYXInLFxuICAgICAgc2VhcmNoU3VnZ2VzdGlvbnM6ICcuaGVhZGVyX19zZWFyY2hmb3JtIC5zdWdnZXN0aW9ucycsXG5cbiAgICAgIGNvdW50cnk6ICcuaGVhZGVyX19kZXNrdG9wQ291bnRyeScsXG4gICAgICBjb3VudHJ5Rm9ybTogJy5oZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbCcsXG4gICAgICBjb3VudHJ5U2Vjb25kYXJ5OiAnLmhlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsIC5tb2IgLndlbGNvbWVzIGEnXG4gICAgfTtcblxuICAgIHRoaXMuY29va2llTmFtZSA9ICdkaGwtZGVmYXVsdC1sYW5ndWFnZSc7XG5cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSAwO1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy50b2dnbGVNZW51ID0gdGhpcy50b2dnbGVNZW51LmJpbmQodGhpcyk7XG4gICAgdGhpcy50b2dnbGVTZWFyY2ggPSB0aGlzLnRvZ2dsZVNlYXJjaC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvd1NlYXJjaCA9IHRoaXMuc2hvd1NlYXJjaC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGlkZVNlYXJjaCA9IHRoaXMuaGlkZVNlYXJjaC5iaW5kKHRoaXMpO1xuICAgIHRoaXMudG9nZ2xlQ291bnRyeSA9IHRoaXMudG9nZ2xlQ291bnRyeS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvd0NvdW50cnkgPSB0aGlzLnNob3dDb3VudHJ5LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oaWRlQ291bnRyeSA9IHRoaXMuaGlkZUNvdW50cnkuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNlbGVjdENvdW50cnlTZWNvbmRhcnkgPSB0aGlzLnNlbGVjdENvdW50cnlTZWNvbmRhcnkuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJvZHlTY3JvbGxpbmcgPSB0aGlzLmJvZHlTY3JvbGxpbmcuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuY2hlY2tTY3JvbGwgPSB0aGlzLmNoZWNrU2Nyb2xsLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJChkb2N1bWVudCkub24oJ2tleWRvd24nLCB0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQsIChlKSA9PiB7XG4gICAgICAvLyBkb3duIGFycm93ID0gNDBcbiAgICAgIC8vIHJpZ2h0IGFycm93ID0gMzlcbiAgICAgIC8vIHVwIGFycm93ID0gMzhcbiAgICAgIC8vIGxlZnQgYXJyb3cgPSAzN1xuICAgICAgLy8gdGFiID0gOVxuICAgICAgaWYgKChlLmtleUNvZGUgPT09IDkgJiYgKCFlLnNoaWZ0S2V5KSkgfHwgKGUua2V5Q29kZSA9PT0gNDApIHx8IChlLmtleUNvZGUgPT09IDM5KSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgrKztcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA+PSB0aGlzLm1heFN1Z2dlc3Rpb25zKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNob3dTdWdnZXN0aW9ucyh0cnVlKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoKGUua2V5Q29kZSA9PT0gOSAmJiAoZS5zaGlmdEtleSkpIHx8IChlLmtleUNvZGUgPT09IDM3KSB8fCAoZS5rZXlDb2RlID09PSAzOCkpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4LS07XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPCAwKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gdGhpcy5tYXhTdWdnZXN0aW9ucyAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG93U3VnZ2VzdGlvbnModHJ1ZSk7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgICQoZG9jdW1lbnQpLm9uKCdrZXlwcmVzcycsIHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCwgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIHZhciBmaWVsZCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgdmFyIHBhcmFtTmFtZSA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS5hdHRyKCduYW1lJyk7XG4gICAgICAgIHZhciB0ZXJtID0gZmllbGQudmFsKCkudHJpbSgpO1xuICAgICAgICB2YXIgdXJsID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignYWN0aW9uJykgKyAnPycgKyBwYXJhbU5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodGVybSk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkKGRvY3VtZW50KS5vbigna2V5dXAnLCB0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQsIChlKSA9PiB7XG4gICAgICBpZiAoKGUua2V5Q29kZSA9PT0gMTYpIHx8IChlLmtleUNvZGUgPT09IDkpIHx8IChlLmtleUNvZGUgPT09IDQwKSB8fCAoZS5rZXlDb2RlID09PSAzOSkgfHwgKGUua2V5Q29kZSA9PT0gMzcpIHx8IChlLmtleUNvZGUgPT09IDM4KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBmaWVsZCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIGlmIChmaWVsZC52YWwoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQoJy50b3Atc2VhcmNoZXMnLCB0aGlzLnNlbC5jb21wb25lbnQpLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXRDbGVhcikuc2hvdygpO1xuICAgICAgICB0aGlzLmNoZWNrU3VnZ2VzdGlvbnMoZmllbGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0Q2xlYXIpLmhpZGUoKTtcbiAgICAgICAgJCgnLnRvcC1zZWFyY2hlcycsIHRoaXMuc2VsLmNvbXBvbmVudCkuc2hvdygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dENsZWFyLCAoZSkgPT4ge1xuICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLnZhbCgnJyk7XG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dENsZWFyKS5oaWRlKCk7XG4gICAgICB0aGlzLmNsZWFyU3VnZ2VzdGlvbnMoKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnRvZ2dsZSwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMudG9nZ2xlTWVudSgpO1xuICAgIH0pO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLm92ZXJsYXksIHRoaXMudG9nZ2xlTWVudSk7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuc2VhcmNoLCB0aGlzLnRvZ2dsZVNlYXJjaCk7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuY291bnRyeSwgdGhpcy50b2dnbGVDb3VudHJ5KTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5jb3VudHJ5U2Vjb25kYXJ5LCB0aGlzLnNlbGVjdENvdW50cnlTZWNvbmRhcnkpO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5oZWFkZXJfX2xhbmcsIC5oZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbCAubGFuZ3MgYSwgLmhlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsIC5jb3VudHJpZXMgYScsIChldnQpID0+IHtcbiAgICAgIGxldCBocmVmID0gJChldnQuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpO1xuICAgICAgbGV0IGhvbWUgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5hdHRyKCdkYXRhLWhvbWUnKTtcbiAgICAgIGlmIChob21lICE9PSBudWxsICYmIGhvbWUubGVuZ3RoID4gMCkge1xuICAgICAgICBocmVmID0gaG9tZTtcbiAgICAgIH1cblxuICAgICAgQ29va2llcy5zZXQodGhpcy5jb29raWVOYW1lLCBocmVmKTtcbiAgICB9KTtcblxuICAgICQod2luZG93KS5vbignc2Nyb2xsJywgdGhpcy5jaGVja1Njcm9sbCk7XG4gICAgdGhpcy5jaGVja1Njcm9sbCgpO1xuXG4gICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLnZhbCgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXRDbGVhcikuc2hvdygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNoZWNrU2Nyb2xsKCkge1xuICAgIHZhciB3dCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICB2YXIgcGIgPSAkKCcucGFnZS1ib2R5Jykub2Zmc2V0KCkudG9wO1xuICAgIGlmICh3dCA+IHBiKSB7XG4gICAgICAkKCcucGFnZS1ib2R5JykuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICBpZiAod3QgPiB0aGlzLmxhc3RTY3JvbGxUb3ApIHtcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnJlbW92ZUNsYXNzKCdpbicpO1xuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaFN1Z2dlc3Rpb25zKS5hZGRDbGFzcygnaGlkZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdpbicpO1xuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaFN1Z2dlc3Rpb25zKS5yZW1vdmVDbGFzcygnaGlkZScpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAkKCcucGFnZS1ib2R5JykucmVtb3ZlQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkucmVtb3ZlQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gd3Q7XG4gIH1cblxuICB0b2dnbGVNZW51KCkge1xuICAgIGlmICghJCh0aGlzLnNlbC5tZW51KS5pcygnOnZpc2libGUnKSkge1xuICAgICAgdGhpcy5ib2R5U2Nyb2xsaW5nKGZhbHNlKTtcbiAgICAgICQodGhpcy5zZWwudG9nZ2xlKS5hZGRDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYm9keVNjcm9sbGluZyh0cnVlKTtcbiAgICAgICQodGhpcy5zZWwudG9nZ2xlKS5yZW1vdmVDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XG4gICAgfVxuICAgICQodGhpcy5zZWwubWVudSkuc2xpZGVUb2dnbGUoMTUwKTtcblxuICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLmhhc0NsYXNzKCdoZWFkZXJfX3NlYXJjaGZvcm0tLW9wZW4nKSkge1xuICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19zZWFyY2hmb3JtLS1vcGVuJyk7XG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaCkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaCkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKTtcbiAgICAgIH0sIDE1MCk7XG4gICAgfVxuICAgIGlmICgkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5oYXNDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKSkge1xuICAgICAgJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsLS1vcGVuJyk7XG4gICAgICAkKHRoaXMuc2VsLmNvdW50cnkpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2gpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BDb3VudHJ5LS1jbG9zZScpO1xuICAgICAgfSwgMTUwKTtcbiAgICB9XG4gIH1cblxuICBib2R5U2Nyb2xsaW5nKGVuYWJsZWQpIHtcbiAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJyk7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnbW9kYWwtb3BlbicpO1xuICAgICAgbGV0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5zY3JlZW4uYXZhaWxIZWlnaHQ7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5oZWlnaHQgPSB3aW5kb3dIZWlnaHQudG9TdHJpbmcoKSArICdweCc7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmhlaWdodCA9IHdpbmRvd0hlaWdodC50b1N0cmluZygpICsgJ3B4JztcbiAgICB9XG4gIH1cblxuICB0b2dnbGVTZWFyY2goZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2gpLmhhc0NsYXNzKCdoZWFkZXJfX2Rlc2t0b3BTZWFyY2gtLWNsb3NlJykpIHtcbiAgICAgIHRoaXMuaGlkZVNlYXJjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNob3dTZWFyY2goKTtcblxuICAgICAgJCgnLnRvcC1zZWFyY2hlcycsIHRoaXMuc2VsLmNvbXBvbmVudCkuaGlkZSgpO1xuICAgICAgJCgnLnRvcC1zZWFyY2hlcyAuaXRlbXMnLCB0aGlzLnNlbC5jb21wb25lbnQpLmVtcHR5KCk7XG5cbiAgICAgIHZhciB1cmwgPSAnJztcbiAgICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdkYXRhLXRvcHNlYXJjaGVzJykubGVuZ3RoID4gMCkge1xuICAgICAgICB1cmwgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdkYXRhLXRvcHNlYXJjaGVzJyk7XG4gICAgICB9XG4gICAgICBpZiAodXJsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJC5nZXQodXJsLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgdmFyIGNvbnRhaW5lciA9ICQoJy50b3Atc2VhcmNoZXMgLml0ZW1zJywgdGhpcy5zZWwuY29tcG9uZW50KTtcbiAgICAgICAgICB2YXIgcGFyYW1OYW1lID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICB2YXIgaGFzVGVybXMgPSBmYWxzZTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5yZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYXNUZXJtcyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgdGVybSA9IHJlc3VsdC5yZXN1bHRzW2ldLnRyaW0oKTtcbiAgICAgICAgICAgIHZhciBzZWFyY2hVcmwgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdhY3Rpb24nKSArICc/JyArIHBhcmFtTmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh0ZXJtKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmQoYDxhIGhyZWY9JyR7c2VhcmNoVXJsfScgdGl0bGU9JyR7dGVybX0nPjxzcGFuPiR7dGVybX08L3NwYW4+PC9hPmApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChoYXNUZXJtcykge1xuICAgICAgICAgICAgJCgnLnRvcC1zZWFyY2hlcycsIHRoaXMuc2VsLmNvbXBvbmVudCkuc2hvdygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2hvd1NlYXJjaCgpIHtcbiAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKTtcbiAgICAkKHRoaXMuc2VsLmNvdW50cnkpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xuXG4gICAgJCh0aGlzLnNlbC5zZWFyY2gpLmFkZENsYXNzKCdoZWFkZXJfX2Rlc2t0b3BTZWFyY2gtLWNsb3NlJyk7XG4gICAgJCh0aGlzLnNlbC5zZWFyY2gpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLmFkZENsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xuICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybSkuYWRkQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpO1xuICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS5mb2N1cygpO1xuXG4gICAgaWYgKCQodGhpcy5zZWwudG9nZ2xlKS5oYXNDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJykpIHtcbiAgICAgIHRoaXMuYm9keVNjcm9sbGluZyh0cnVlKTtcbiAgICAgICQodGhpcy5zZWwudG9nZ2xlKS5yZW1vdmVDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XG4gICAgICAkKHRoaXMuc2VsLm1lbnUpLnNsaWRlVG9nZ2xlKDE1MCk7XG4gICAgfVxuICB9XG5cbiAgaGlkZVNlYXJjaCgpIHtcbiAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLnJlbW92ZUNsYXNzKCdoZWFkZXJfX3NlYXJjaGZvcm0tLW9wZW4nKTtcbiAgICAkKHRoaXMuc2VsLnNlYXJjaCkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoLS1jbG9zZScpO1xuICAgIH0sIDE1MCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjaGVja1N1Z2dlc3Rpb25zKGZpZWxkKSB7XG4gICAgdmFyIHZhbCA9ICQudHJpbShmaWVsZC52YWwoKSk7XG4gICAgdmFyIHMgPSB2YWwuc3Vic3RyKDAsIDEpO1xuICAgIGlmIChzID09PSB0aGlzLmxhc3RMZXR0ZXIpIHtcbiAgICAgIHRoaXMuc2hvd1N1Z2dlc3Rpb25zKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xlYXJTdWdnZXN0aW9ucygpO1xuICAgICAgdGhpcy5sYXN0TGV0dGVyID0gcztcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xO1xuXG4gICAgICB2YXIgdXJsID0gJyc7XG4gICAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignZGF0YS1zdWdnZXN0aW9ucycpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdXJsID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignZGF0YS1zdWdnZXN0aW9ucycpO1xuICAgICAgfVxuXG4gICAgICAkLmdldCh1cmwsIHsgczogcyB9LCAocmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQucmVzdWx0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLmNsZWFyU3VnZ2VzdGlvbnMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmFsbFN1Z2dlc3Rpb25zID0gW107XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQucmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5hbGxTdWdnZXN0aW9ucy5wdXNoKHJlc3VsdC5yZXN1bHRzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zaG93U3VnZ2VzdGlvbnMoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJTdWdnZXN0aW9ucygpIHtcbiAgICAkKHRoaXMuc2VsLnNlYXJjaFN1Z2dlc3Rpb25zKS5lbXB0eSgpLmhpZGUoKTtcbiAgfVxuXG4gIHNob3dTdWdnZXN0aW9ucyh1c2VMYXN0VmFsKSB7XG4gICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XG4gICAgdmFyIHZhbCA9ICQudHJpbSgkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkudmFsKCkpO1xuICAgIGlmICh1c2VMYXN0VmFsKSB7XG4gICAgICB2YWwgPSB0aGlzLmxhc3RWYWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGFzdFZhbCA9IHZhbDtcbiAgICB9XG5cbiAgICB2YXIgaGFzVGVybXMgPSBmYWxzZTtcbiAgICB2YXIgYyA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFsbFN1Z2dlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY29udGFpbnMgPSBmYWxzZTtcbiAgICAgIHZhciB0ZXJtcyA9IHZhbC50b0xvd2VyQ2FzZSgpLnNwbGl0KC9cXHMvKTtcblxuICAgICAgZm9yICh2YXIgdCA9IDA7IHQgPCB0ZXJtcy5sZW5ndGg7IHQrKykge1xuICAgICAgICBjb250YWlucyA9IHRoaXMuYWxsU3VnZ2VzdGlvbnNbaV0udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh0ZXJtc1t0XS50cmltKCkpO1xuICAgICAgICBpZiAoY29udGFpbnMpIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKCh2YWwubGVuZ3RoID09PSAxKSB8fCBjb250YWlucykge1xuICAgICAgICB2YXIgcGFyYW1OYW1lID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgdmFyIHRlcm0gPSB0aGlzLmFsbFN1Z2dlc3Rpb25zW2ldLnRyaW0oKTtcbiAgICAgICAgdmFyIHVybCA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2FjdGlvbicpICsgJz8nICsgcGFyYW1OYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRlcm0pO1xuICAgICAgICB2YXIgY2xzID0gJyc7XG4gICAgICAgIGlmIChjID09PSB0aGlzLnNlbGVjdGVkSW5kZXgpIHtcbiAgICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkudmFsKHRlcm0pO1xuICAgICAgICAgIGNscyA9ICcgY2xhc3M9XCJzZWxlY3RlZFwiJztcbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaFN1Z2dlc3Rpb25zKS5hcHBlbmQoYDxhJHtjbHN9IGhyZWY9JyR7dXJsfScgdGl0bGU9JyR7dGVybX0nPjxzcGFuPiR7dGVybX08L3NwYW4+PC9hPmApO1xuICAgICAgICBoYXNUZXJtcyA9IHRydWU7XG4gICAgICAgIGMrKztcbiAgICAgIH1cblxuICAgICAgaWYgKGMgPj0gMTApIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLm1heFN1Z2dlc3Rpb25zID0gYztcblxuICAgIGlmIChoYXNUZXJtcykge1xuICAgICAgJCh0aGlzLnNlbC5zZWFyY2hTdWdnZXN0aW9ucykuc2hvdygpO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZUNvdW50cnkoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb3VudHJ5KS5oYXNDbGFzcygnaGVhZGVyX19kZXNrdG9wQ291bnRyeS0tY2xvc2UnKSkge1xuICAgICAgdGhpcy5oaWRlQ291bnRyeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNob3dDb3VudHJ5KCk7XG4gICAgfVxuICB9XG5cbiAgc2hvd0NvdW50cnkoKSB7XG4gICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19zZWFyY2hmb3JtLS1vcGVuJyk7XG4gICAgJCh0aGlzLnNlbC5zZWFyY2gpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJCh0aGlzLnNlbC5zZWFyY2gpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BTZWFyY2gtLWNsb3NlJyk7XG4gICAgfSwgMTUwKTtcblxuICAgICQodGhpcy5zZWwuY291bnRyeSkuYWRkQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcENvdW50cnktLWNsb3NlJyk7XG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5hZGRDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcbiAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5hZGRDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKTtcblxuICAgIGlmICgkKHRoaXMuc2VsLnRvZ2dsZSkuaGFzQ2xhc3MoJ2hlYWRlcl9fbmF2aWdhdGlvbi0tb3BlbicpKSB7XG4gICAgICB0aGlzLmJvZHlTY3JvbGxpbmcodHJ1ZSk7XG4gICAgICAkKHRoaXMuc2VsLnRvZ2dsZSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fbmF2aWdhdGlvbi0tb3BlbicpO1xuICAgICAgJCh0aGlzLnNlbC5tZW51KS5zbGlkZVRvZ2dsZSgxNTApO1xuICAgIH1cbiAgfVxuXG4gIGhpZGVDb3VudHJ5KCkge1xuICAgICQodGhpcy5zZWwuY291bnRyeUZvcm0pLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbC0tb3BlbicpO1xuICAgICQodGhpcy5zZWwuY291bnRyeSkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkuZmluZCgnLm1vYicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQodGhpcy5zZWwuY291bnRyeSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcENvdW50cnktLWNsb3NlJyk7XG4gICAgfSwgMTUwKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHNlbGVjdENvdW50cnlTZWNvbmRhcnkoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5maW5kKCcubW9iJykuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSGVhZGVyKCk7XG4iLCJjbGFzcyBIZXJvIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuaGVybycsXG4gICAgICB0cmlnZ2VyOiAnLmhlcm9fX3BsYXlCdXR0b24sIC5oZXJvX19jdGEtLXZpZGVvJyxcbiAgICAgIGlmcmFtZTogJy5oZXJvIC5oZXJvX192aWRlbydcbiAgICB9O1xuXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwudHJpZ2dlciwgdGhpcy5oYW5kbGVDbGljayk7XG4gIH1cblxuICBoYW5kbGVDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCB2aWRlb0lkID0gdGhpcy5nZXRWaWRlb0lEKGUudGFyZ2V0LmhyZWYpO1xuICAgICQodGhpcy5zZWwuaWZyYW1lKS5hdHRyKCdzcmMnLCAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJyArIHZpZGVvSWQgKyAnP3JlbD0wJmFtcDtzaG93aW5mbz0wJmFtcDthdXRvcGxheT0xJykuYWRkQ2xhc3MoJ2hlcm9fX3ZpZGVvLS1vcGVuJyk7XG4gIH1cblxuICBnZXRWaWRlb0lEKHl0VXJsKSB7XG4gICAgbGV0IGlkID0gJyc7XG4gICAgbGV0IHVybCA9IHl0VXJsLnJlcGxhY2UoLyg+fDwpL2dpLCAnJykuc3BsaXQoLyh2aVxcL3x2PXxcXC92XFwvfHlvdXR1XFwuYmVcXC98XFwvZW1iZWRcXC8pLyk7XG4gICAgaWYgKHVybFsyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZCA9IHVybFsyXS5zcGxpdCgvW14wLTlhLXpfXFwtXS9pKTtcbiAgICAgIGlkID0gaWRbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkID0gdXJsO1xuICAgIH1cbiAgICByZXR1cm4gaWQ7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSGVybygpO1xuIiwiY2xhc3MgSUVEZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnYm9keSdcbiAgICB9O1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5kZXRlY3RJRSA9IHRoaXMuZGV0ZWN0SUUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHZhciB2ZXJzaW9uID0gdGhpcy5kZXRlY3RJRSgpO1xuICAgIGlmICh2ZXJzaW9uICE9PSBmYWxzZSkge1xuICAgICAgaWYgKHZlcnNpb24gPj0gMTIpIHtcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdpZS1lZGdlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoYGllLSR7dmVyc2lvbn1gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBkZXRlY3RJRSgpIHtcbiAgICB2YXIgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAvLyBUZXN0IHZhbHVlczsgVW5jb21tZW50IHRvIGNoZWNrIHJlc3VsdCDigKZcbiAgICAvLyBJRSAxMFxuICAgIC8vIHVhID0gJ01vemlsbGEvNS4wIChjb21wYXRpYmxlOyBNU0lFIDEwLjA7IFdpbmRvd3MgTlQgNi4yOyBUcmlkZW50LzYuMCknO1xuICAgIC8vIElFIDExXG4gICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgNi4zOyBUcmlkZW50LzcuMDsgcnY6MTEuMCkgbGlrZSBHZWNrbyc7ICAgIC8vIEVkZ2UgMTIgKFNwYXJ0YW4pXG4gICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV09XNjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8zOS4wLjIxNzEuNzEgU2FmYXJpLzUzNy4zNiBFZGdlLzEyLjAnICAgIC8vIEVkZ2UgMTNcbiAgICAvLyB1YSA9ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvNDYuMC4yNDg2LjAgU2FmYXJpLzUzNy4zNiBFZGdlLzEzLjEwNTg2JztcbiAgICB2YXIgbXNpZSA9IHVhLmluZGV4T2YoJ01TSUUgJyk7XG4gICAgaWYgKG1zaWUgPiAwKSB7XG4gICAgICAvLyBJRSAxMCBvciBvbGRlciA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcbiAgICAgIHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcobXNpZSArIDUsIHVhLmluZGV4T2YoJy4nLCBtc2llKSksIDEwKTtcbiAgICB9XG5cbiAgICB2YXIgdHJpZGVudCA9IHVhLmluZGV4T2YoJ1RyaWRlbnQvJyk7XG4gICAgaWYgKHRyaWRlbnQgPiAwKSB7XG4gICAgICAvLyBJRSAxMSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcbiAgICAgIHZhciBydiA9IHVhLmluZGV4T2YoJ3J2OicpO1xuICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhydiArIDMsIHVhLmluZGV4T2YoJy4nLCBydikpLCAxMCk7XG4gICAgfVxuXG4gICAgdmFyIGVkZ2UgPSB1YS5pbmRleE9mKCdFZGdlLycpO1xuICAgIGlmIChlZGdlID4gMCkge1xuICAgICAgLy8gRWRnZSAoSUUgMTIrKSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcbiAgICAgIHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcoZWRnZSArIDUsIHVhLmluZGV4T2YoJy4nLCBlZGdlKSksIDEwKTtcbiAgICB9XG5cbiAgICAvLyBvdGhlciBicm93c2VyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBJRURldGVjdG9yKCk7XG4iLCJjbGFzcyBMYW5kaW5nUG9pbnRzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcubGFuZGluZ3BvaW50cycsXG4gICAgICBsYW5kaW5nUG9pbnRJdGVtOiAnLmxhbmRpbmdwb2ludHMgLmxhbmRpbmdwb2ludCcsXG4gICAgICBjbGlja2FibGVUaXRsZTogJy5sYW5kaW5ncG9pbnRzIC5sYW5kaW5ncG9pbnRfX3RpdGxlIGEnXG4gICAgfTtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNsaWNrYWJsZVRpdGxlLCAoZXZ0KSA9PiB7XG4gICAgICB2YXIgY29udGFpbmVyID0gJChldnQuY3VycmVudFRhcmdldCkuY2xvc2VzdCh0aGlzLnNlbC5sYW5kaW5nUG9pbnRJdGVtKTtcbiAgICAgIGlmIChjb250YWluZXIuaGFzQ2xhc3MoJ29wZW4nKSkge1xuICAgICAgICBjb250YWluZXIuZmluZCgnLmxhbmRpbmdwb2ludF9fY29udGVudCcpLmNzcyh7IGhlaWdodDogMCB9KTtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKGV2dC5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnLmxhbmRpbmdwb2ludC5vcGVuIC5sYW5kaW5ncG9pbnRfX2NvbnRlbnQnKS5jc3MoeyBoZWlnaHQ6IDAgfSk7XG4gICAgICAgICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcubGFuZGluZ3BvaW50JykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgY29udGFpbmVyLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgIGNvbnRhaW5lci5maW5kKCcubGFuZGluZ3BvaW50X19jb250ZW50JykuY3NzKHsgaGVpZ2h0OiBjb250YWluZXIuZmluZCgnLmxhbmRpbmdwb2ludF9fY29udGVudCBwJykub3V0ZXJIZWlnaHQoKSB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBMYW5kaW5nUG9pbnRzKCk7XG5cbiIsImNsYXNzIExhbmd1YWdlRGV0ZWN0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcucm9vdF9fY291bnRyeVNlbGVjdFBhbmVsJ1xuICAgIH07XG5cbiAgICB0aGlzLnJlZGlyZWN0ID0gdHJ1ZTtcbiAgICB0aGlzLmNvb2tpZU5hbWUgPSAnZGhsLWRlZmF1bHQtbGFuZ3VhZ2UnO1xuXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gIH1cblxuICBnZXRQYXRoUHJlZml4KCkge1xuICAgIGNvbnN0IHByZWZpeCA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLXByZWZpeFxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIXRoaXMucmVkaXJlY3QpIHtcbiAgICAgICQoJy5tYXNrJywgdGhpcy5zZWwpLmhpZGUoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgY29va2llID0gQ29va2llcy5nZXQodGhpcy5jb29raWVOYW1lKTtcbiAgICBpZiAodHlwZW9mIGNvb2tpZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGxldCBsYW5ndWFnZSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2U7XG4gICAgICBsZXQgbGFuZ3VhZ2VzRGF0YSA9IEpTT04ucGFyc2UoJCgnI2xhbmd1YWdlc0RhdGEnKS5odG1sKCkpO1xuICAgICAgbGV0IGNhdGNoQWxsID0gJyc7XG4gICAgICBsZXQgdXJsID0gJyc7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFuZ3VhZ2VzRGF0YS52YXJpYW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgdmFyaWFudCA9IGxhbmd1YWdlc0RhdGEudmFyaWFudHNbaV07XG4gICAgICAgIGlmICh2YXJpYW50Lmxhbmd1YWdlcyA9PT0gJyonKSB7XG4gICAgICAgICAgY2F0Y2hBbGwgPSB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHZhcmlhbnQucGF0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFyaWFudC5sYW5ndWFnZXMuaW5kZXhPZihsYW5ndWFnZSkgPj0gMCkge1xuICAgICAgICAgIHVybCA9IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdmFyaWFudC5wYXRoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodXJsICE9PSAnJykge1xuICAgICAgICBDb29raWVzLnNldCh0aGlzLmNvb2tpZU5hbWUsIHVybCk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xuICAgICAgfSBlbHNlIGlmIChjYXRjaEFsbCAhPT0gJycpIHtcbiAgICAgICAgQ29va2llcy5zZXQodGhpcy5jb29raWVOYW1lLCBjYXRjaEFsbCk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gY2F0Y2hBbGw7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gY29va2llO1xuICAgIH1cblxuICAgICQoJy5tYXNrJywgdGhpcy5zZWwpLmhpZGUoKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBMYW5ndWFnZURldGVjdCgpO1xuIiwiY2xhc3MgTG9naW5Gb3JtIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBmYkFwcElkOiAnMTA4MDAzMTMyODgwMTIxMScsXG4gICAgICBnb0NsaWVudElkOiAnMzEzNDY5ODM3NDIwLWw4ODJoMzlnZThuOG45cGI5N2xkdmprM2ZtOHBwcWdzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJyxcblxuICAgICAgdXJsVG9rZW46ICcvbGlicy9ncmFuaXRlL2NzcmYvdG9rZW4uanNvbicsXG4gICAgICB1cmxMb2dpbjogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9sb2dpbi9pbmRleC5qc29uJ1xuICAgIH07XG5cbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5wYWdlLWJvZHkubG9naW4gZm9ybS5mb3JtcycsXG4gICAgICBidXR0b25GYWNlYm9vazogJy5mb3Jtc19fY3RhLS1zb2NpYWwuZmInLFxuICAgICAgYnV0dG9uTGlua2VkaW46ICcuZm9ybXNfX2N0YS0tc29jaWFsLmxpJyxcbiAgICAgIGJ1dHRvbkdvb2dsZVBsdXM6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmdvJ1xuICAgIH07XG5cbiAgICB0aGlzLmdldFBhdGhQcmVmaXggPSB0aGlzLmdldFBhdGhQcmVmaXguYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldFBhdGhIb21lID0gdGhpcy5nZXRQYXRoSG9tZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy50cnlMb2dpbkZhY2Vib29rID0gdGhpcy50cnlMb2dpbkZhY2Vib29rLmJpbmQodGhpcyk7XG4gICAgdGhpcy50cnlMb2dpbkxpbmtlZGluID0gdGhpcy50cnlMb2dpbkxpbmtlZGluLmJpbmQodGhpcyk7XG4gICAgdGhpcy50cnlMb2dpbkdvb2dsZSA9IHRoaXMudHJ5TG9naW5Hb29nbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRyeUxvZ2luID0gdGhpcy50cnlMb2dpbi5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5leGVjdXRlTG9naW4gPSB0aGlzLmV4ZWN1dGVMb2dpbi5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5sb2dnZWRJbiA9IHRoaXMubG9nZ2VkSW4uYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldFBhdGhQcmVmaXgoKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcbiAgfVxuXG4gIGdldFBhdGhIb21lKCkge1xuICAgIGNvbnN0IGhvbWUgPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1ob21lXFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKGhvbWUgPyBob21lIDogJycpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQod2luZG93KS5vbigndXNlcmxvZ2dlZGluLkRITCcsICgpID0+IHtcbiAgICAgIHRoaXMubG9nZ2VkSW4oKTtcbiAgICB9KTtcblxuICAgIGpRdWVyeS52YWxpZGF0b3IuYWRkTWV0aG9kKCdwYXNzd29yZCcsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJChlbGVtZW50KS5hdHRyKCdwYXR0ZXJuJykpLnRlc3QodmFsdWUpO1xuICAgIH0sICdQYXNzd29yZCBmb3JtYXQgaXMgbm90IHZhbGlkJyk7XG5cbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnZXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xuICAgICAgcmV0dXJuICgkKCcjJyArICQoZWxlbWVudCkuYXR0cignZGF0YS1lcXVhbFRvJykpLnZhbCgpID09PSAkKGVsZW1lbnQpLnZhbCgpKTtcbiAgICB9LCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpO1xuXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkZhY2Vib29rKS5sZW5ndGggPiAwKSB7XG4gICAgICB3aW5kb3cuZmJBc3luY0luaXQgPSAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5mYl9pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mICh3aW5kb3cuRkIpICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuRkIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHdpbmRvdy5GQi5pbml0KHtcbiAgICAgICAgICAgICAgYXBwSWQ6IHRoaXMuY29uZmlnLmZiQXBwSWQsXG4gICAgICAgICAgICAgIGNvb2tpZTogdHJ1ZSxcbiAgICAgICAgICAgICAgeGZibWw6IHRydWUsXG4gICAgICAgICAgICAgIHZlcnNpb246ICd2Mi44J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmZiX2ludGVydmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhY2Vib29rLWpzc2RrJykgPT09IG51bGwpIHtcbiAgICAgICAgdmFyIGZqcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICAgICAgdmFyIGpzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgIGpzLmlkID0gJ2ZhY2Vib29rLWpzc2RrJztcbiAgICAgICAganMuc3JjID0gJy8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fRU4vc2RrLmpzJztcbiAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xuICAgICAgfVxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLm9uKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgdGhpcy50cnlMb2dpbkZhY2Vib29rKGV2dCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikubGVuZ3RoID4gMCkge1xuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLm9uKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgdGhpcy50cnlMb2dpbkxpbmtlZGluKGV2dCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBnb29nbGVCdXR0b24gPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKTtcbiAgICBpZiAoZ29vZ2xlQnV0dG9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHdpbmRvdy5nb19pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LmdhcGkpICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZ2FwaSAhPT0gbnVsbCkge1xuICAgICAgICAgIHdpbmRvdy5nYXBpLmxvYWQoJ2F1dGgyJywgKCkgPT4ge1xuICAgICAgICAgICAgdmFyIGF1dGgyID0gd2luZG93LmdhcGkuYXV0aDIuaW5pdCh7XG4gICAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jb25maWcuZ29DbGllbnRJZCxcbiAgICAgICAgICAgICAgY29va2llcG9saWN5OiAnc2luZ2xlX2hvc3Rfb3JpZ2luJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZ29vZ2xlQnV0dG9uLmdldCgwKTtcbiAgICAgICAgICAgIGF1dGgyLmF0dGFjaENsaWNrSGFuZGxlcihlbGVtZW50LCB7fSxcbiAgICAgICAgICAgICAgKGdvb2dsZVVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyeUxvZ2luR29vZ2xlKGdvb2dsZVVzZXIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3IgIT09ICdwb3B1cF9jbG9zZWRfYnlfdXNlcicpIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KHJlc3VsdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZ29faW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgICB9LCAxMDApO1xuXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkudmFsaWRhdGUoe1xuICAgICAgcnVsZXM6IHtcbiAgICAgICAgbG9naW5fX2VtYWlsOiAnZW1haWwnLFxuICAgICAgICBsb2dpbl9fcGFzc3dvcmQ6ICdwYXNzd29yZCdcbiAgICAgIH0sXG4gICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybSkgPT4ge1xuICAgICAgICB0aGlzLnRyeUxvZ2luKGZvcm0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB0cnlMb2dpbkZhY2Vib29rKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG5cbiAgICB3aW5kb3cuRkIubG9naW4oKGxvZ2luUmVzcG9uc2UpID0+IHtcbiAgICAgIGlmIChsb2dpblJlc3BvbnNlLmF1dGhSZXNwb25zZSkge1xuICAgICAgICB3aW5kb3cuRkIuYXBpKCcvbWUnLCAoZGF0YVJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICB1c2VybmFtZTogZGF0YVJlc3BvbnNlLmVtYWlsLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IGRhdGFSZXNwb25zZS5pZFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0aGlzLmV4ZWN1dGVMb2dpbihkYXRhLCAoKSA9PiB7XG4gICAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykudGV4dCgnRmFjZWJvb2snKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgeyBmaWVsZHM6IFsgJ2lkJywgJ2VtYWlsJyBdfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSwgeyBzY29wZTogJ2VtYWlsLHB1YmxpY19wcm9maWxlJywgcmV0dXJuX3Njb3BlczogdHJ1ZSB9KTtcbiAgfVxuXG4gIHRyeUxvZ2luTGlua2VkaW4oZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcblxuICAgIElOLlVzZXIuYXV0aG9yaXplKCgpID0+IHtcbiAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XG4gICAgICAgIHZhciBtZW1iZXIgPSByZXN1bHQudmFsdWVzWzBdO1xuXG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgIHVzZXJuYW1lOiBtZW1iZXIuZW1haWxBZGRyZXNzLFxuICAgICAgICAgIHBhc3N3b3JkOiBtZW1iZXIuaWRcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmV4ZWN1dGVMb2dpbihkYXRhLCAoKSA9PiB7XG4gICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLnRleHQoJ0xpbmtlZEluJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICB2YXIgcmVzdWx0ID0gd2luZG93LklOLlVzZXIuaXNBdXRob3JpemVkKCk7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgdmFyIG1lbWJlciA9IHJlc3VsdC52YWx1ZXNbMF07XG5cbiAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiBtZW1iZXIuZW1haWxBZGRyZXNzLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IG1lbWJlci5pZFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0aGlzLmV4ZWN1dGVMb2dpbihkYXRhLCAoKSA9PiB7XG4gICAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikudGV4dCgnTGlua2VkSW4nKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG5cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyeUxvZ2luR29vZ2xlKGdvb2dsZVVzZXIpIHtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIHVzZXJuYW1lOiBnb29nbGVVc2VyLmdldEJhc2ljUHJvZmlsZSgpLmdldEVtYWlsKCksXG4gICAgICBwYXNzd29yZDogZ29vZ2xlVXNlci5nZXRCYXNpY1Byb2ZpbGUoKS5nZXRJZCgpXG4gICAgfTtcblxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgdGhpcy5leGVjdXRlTG9naW4oZGF0YSwgKCkgPT4ge1xuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cykudGV4dCgnR29vZ2xlKycpO1xuICAgIH0pO1xuICB9XG5cbiAgdHJ5TG9naW4oZm9ybSkge1xuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xuICAgIHZhciB1c2VybmFtZSA9IGZybS5maW5kKCdpbnB1dCNsb2dpbl9fZW1haWwnKS52YWwoKTtcbiAgICB2YXIgcGFzc3dvcmQgPSBmcm0uZmluZCgnaW5wdXQjbG9naW5fX3Bhc3N3b3JkJykudmFsKCk7XG5cbiAgICBpZiAoKCQudHJpbSh1c2VybmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKHBhc3N3b3JkKS5sZW5ndGggPT09IDApKSB7XG4gICAgICBhbGVydCgnUGxlYXNlIGVudGVyIHlvdXIgZW1haWwgYWRkcmVzcyBhbmQgcGFzc3dvcmQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcbiAgICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XG5cbiAgICAgIHRoaXMuZXhlY3V0ZUxvZ2luKHsgdXNlcm5hbWU6IHVzZXJuYW1lLCBwYXNzd29yZDogcGFzc3dvcmQgfSwgKCkgPT4ge1xuICAgICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdMb2cgSW4nKTtcbiAgICAgICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgnTG9naW4nKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGV4ZWN1dGVMb2dpbihkYXRhLCB1bndhaXRDYWxsYmFjaykge1xuICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XG4gICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybExvZ2luLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyByZXNwb25zZSwgdHJ1ZSBdKTtcbiAgICAgICAgICAgICAgdmFyIGJhY2tVcmwgPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZGF0YSgnYmFjaycpO1xuICAgICAgICAgICAgICBpZiAoJC50cmltKGJhY2tVcmwpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGJhY2tVcmwgPSB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuZ2V0UGF0aEhvbWUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGlzLmdldFBhdGhQcmVmaXgoKSArIGJhY2tVcmw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byByZWdpc3Rlci5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHJlZ2lzdGVyLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB1bndhaXRDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGxvZ2dlZEluKCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5nZXRQYXRoSG9tZSgpICsgJ3lvdXItYWNjb3VudCc7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IExvZ2luRm9ybSgpO1xuIiwiXG5jbGFzcyBNYXJrZXRGb3JtIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICdbZGF0YS1tYXJrZXRvLWZvcm1dJyxcbiAgICB9O1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZWFjaCgoaW5kZXgsIGVsZW1lbnQpID0+IHRoaXMuYmluZEV2ZW50cyhlbGVtZW50LCBpbmRleCkpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKGVsZW0pIHtcblxuICAgIGNvbnN0ICRlbGVtID0gJChlbGVtKTtcblxuICAgIGNvbnN0ICRmb3JtID0gJGVsZW0uZmluZCgnW2RhdGEtbWFya2V0by12aXNpYmxlLWZvcm1dJyk7XG5cbiAgICAvLyB2aXNpYmxlIGZvcm1cbiAgICBjb25zdCAkbWFya2V0b0Zvcm0gPSAkZm9ybS5maW5kKCdmb3JtJyk7XG4gICAgY29uc3QgbWFya2V0b0Zvcm1BdHRyID0gJG1hcmtldG9Gb3JtID8gJG1hcmtldG9Gb3JtLmF0dHIoJ2lkJykgOiAnJztcbiAgICBjb25zdCBtYXJrZXRvRm9ybUlkID0gbWFya2V0b0Zvcm1BdHRyID8gbWFya2V0b0Zvcm1BdHRyLnJlcGxhY2UoJ21rdG9Gb3JtXycsICcnKSA6ICcnO1xuXG4gICAgY29uc3QgX3B1YmxpYyA9IHt9O1xuXG4gICAgbGV0IGxvYWRlZEZvcm1zID0gW11cblxuICAgIGNvbnN0IGZvcm0gPSAkZWxlbS5hdHRyKCdkYXRhLW1hcmtldG8tZm9ybScpO1xuXG4gICAgY29uc3QgaGlkZGVuU2V0dGluZ3MgPSBmb3JtID8gSlNPTi5wYXJzZShmb3JtKSA6IG51bGw7XG5cbiAgICBpZiAobWFya2V0b0Zvcm1JZC5sZW5ndGggIT09IDApIHtcblxuICAgICAgTWt0b0Zvcm1zMi53aGVuUmVhZHkoZnVuY3Rpb24obWt0b0Zvcm0pIHtcbiAgICAgICAgJCgnI21rdG9Gb3JtczJCYXNlU3R5bGUnKS5yZW1vdmUoKTtcbiAgICAgICAgJCgnI21rdG9Gb3JtczJUaGVtZVN0eWxlJykucmVtb3ZlKCk7XG5cbiAgICAgICAgY29uc3QgZm9ybUlkID0gbWt0b0Zvcm0uZ2V0SWQoKTtcblxuICAgICAgICBpZiAobG9hZGVkRm9ybXMuaW5kZXhPZihmb3JtSWQudG9TdHJpbmcoKSkgIT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvcm1JZC50b1N0cmluZygpID09PSBtYXJrZXRvRm9ybUlkLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICBsb2FkZWRGb3Jtcy5wdXNoKGZvcm1JZC50b1N0cmluZygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzZm9ybSA9IG1rdG9Gb3JtLmdldElkKCkudG9TdHJpbmcoKSA9PT0gbWFya2V0b0Zvcm1JZC50b1N0cmluZygpO1xuXG4gICAgICAgIGlmIChpc2Zvcm0pIHtcblxuICAgICAgICAgIG1rdG9Gb3JtLm9uU3VjY2VzcygoZSkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIWhpZGRlblNldHRpbmdzKSB7XG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBNa3RvRm9ybXMyLmxvYWRGb3JtKFwiLy9leHByZXNzLXJlc291cmNlLmRobC5jb21cIiwgaGlkZGVuU2V0dGluZ3MuaGlkZGVuTXVuY2hraW5JZCwgaGlkZGVuU2V0dGluZ3MuaGlkZGVuRm9ybUlkLCBmdW5jdGlvbihoaWRkZW5Gb3JtKSB7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZm9ybUxvYWRlZCcsIGhpZGRlbkZvcm0sIGUpO1xuXG4gICAgICAgICAgICAgIGNvbnN0IG1rdG9GaWVsZHNPYmogPSAkLmV4dGVuZChlLCBoaWRkZW5Gb3JtLmdldFZhbHVlcygpKTtcblxuICAgICAgICAgICAgICBoaWRkZW5Gb3JtLmFkZEhpZGRlbkZpZWxkcyhta3RvRmllbGRzT2JqKTtcbiAgICAgICAgICAgICAgaGlkZGVuRm9ybS5zdWJtaXQoKTtcblxuICAgICAgICAgICAgICBoaWRkZW5Gb3JtLm9uU3VibWl0KChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlY29uZCBmb3JtIHN1Ym1pdC4uLicsIGUuZ2V0VmFsdWVzKCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgaGlkZGVuRm9ybS5vblN1Y2Nlc3MoKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2Vjb25kIGZvcm0gc3VjY2Vzcy4uLicpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgTWt0b0Zvcm1zMi53aGVuUmVhZHkoZnVuY3Rpb24obWt0b0Zvcm0pIHtcbiAgICAgICAgJCgnI21rdG9Gb3JtczJCYXNlU3R5bGUnKS5yZW1vdmUoKTtcbiAgICAgICAgJCgnI21rdG9Gb3JtczJUaGVtZVN0eWxlJykucmVtb3ZlKCk7XG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgTWFya2V0Rm9ybSgpO1xuIiwiaW1wb3J0IFRvYXN0IGZyb20gJy4vVG9hc3QnO1xuaW1wb3J0IERhdGFiYXNlIGZyb20gJy4vRGF0YWJhc2UnO1xuXG5jbGFzcyBTYXZlRm9yT2ZmbGluZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLmhlcm9fX3NhdmVGb3JPZmZsaW5lJ1xuICAgIH07XG4gICAgLy8gQ3JlYXRlIGFydGljbGUgY2FjaGUgbmFtZVxuICAgIHRoaXMuYXJ0aWNsZUNhY2hlTmFtZSA9ICdvZmZsaW5lLScgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZG9TYXZlID0gdGhpcy5kb1NhdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRvVW5zYXZlID0gdGhpcy5kb1Vuc2F2ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0SGVyb0ltYWdlcyA9IHRoaXMuZ2V0SGVyb0ltYWdlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaXNDdXJyZW50UGFnZVNhdmVkID0gdGhpcy5pc0N1cnJlbnRQYWdlU2F2ZWQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuY29tcG9uZW50LCB0aGlzLmhhbmRsZUNsaWNrKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5oYXNDbGFzcygnaGVyb19fc2F2ZUZvck9mZmxpbmUtLXNhdmVkJykpIHtcbiAgICAgIHRoaXMuZG9VbnNhdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb1NhdmUoKTtcbiAgICB9XG4gIH1cblxuICBpc0N1cnJlbnRQYWdlU2F2ZWQoKSB7XG4gICAgLy8gQ2hlY2sgaWYgYWxyZWFkeSBzYXZlZFxuICAgIGNhY2hlcy5rZXlzKCkudGhlbigoY2FjaGVOYW1lcykgPT4geyAvLyBHZXQgYXJyYXkgb2YgY2FjaGUgbmFtZXNcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgY2FjaGVOYW1lcy5maWx0ZXIoKGNhY2hlTmFtZSkgPT4geyAvLyBGaWx0ZXIgYXJyYXlcbiAgICAgICAgICByZXR1cm4gKGNhY2hlTmFtZSA9PT0gdGhpcy5hcnRpY2xlQ2FjaGVOYW1lKTsgLy8gSWYgbWF0Y2hlcyBjdXJyZW50IHBhdGhuYW1lXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pLnRoZW4oKGNhY2hlTmFtZXMpID0+IHsgLy8gT25jZSBnb3QgZmlsdGVyZWQgYXJyYXlcbiAgICAgIGlmIChjYWNoZU5hbWVzLmxlbmd0aCA+IDApIHsgLy8gSWYgdGhlcmUgYXJlIGNhY2hlc1xuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2hlcm9fX3NhdmVGb3JPZmZsaW5lLS1zYXZlZCcpLmF0dHIoJ3RpdGxlJywgJ0FydGljbGUgU2F2ZWQnKS5maW5kKCdzcGFuJykudGV4dCgnQXJ0aWNsZSBTYXZlZCcpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0SGVyb0ltYWdlcygpIHtcbiAgICAvLyBHZXQgdGhlIGhlcm8gaW1hZ2UgZWxlbWVudFxuICAgIGxldCAkaGVyb0ltYWdlID0gJCgnLmhlcm9fX2ltYWdlJyk7XG4gICAgLy8gSWYgaXQgZXhpc3RzXG4gICAgaWYgKCRoZXJvSW1hZ2UubGVuZ3RoID4gMCkge1xuICAgICAgLy8gQ3JlYXRlIGFycmF5IGZvciBpbWFnZXNcbiAgICAgIGxldCBpbWFnZXMgPSBbXTtcbiAgICAgIC8vIEFkZCB0aGUgbW9iaWxlIGltYWdlIFVSTFxuICAgICAgaW1hZ2VzLnB1c2goXG4gICAgICAgICRoZXJvSW1hZ2UuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJykuc3BsaXQoJ3VybCgnKVsxXS5zcGxpdCgnKScpWzBdLnJlcGxhY2UoL1wiL2csICcnKS5yZXBsYWNlKC8nL2csICcnKVxuICAgICAgKTtcbiAgICAgIC8vIEdldCB0aGUgZGVza3RvcCBpbWFnZSBVUkxcbiAgICAgIGxldCBkZXNrdG9wU3R5bGVzID0gJGhlcm9JbWFnZS5wYXJlbnRzKCcuaGVybycpLmZpbmQoJ3N0eWxlJykuaHRtbCgpLnNwbGl0KCd1cmwoJylbMV0uc3BsaXQoJyknKVswXS5yZXBsYWNlKC9cIi9nLCAnJykucmVwbGFjZSgvJy9nLCAnJyk7XG4gICAgICAvLyBBZGQgdGhlIGRlc2t0b3AgaW1hZ2UgdG8gdGhlIGFycmF5XG4gICAgICBpbWFnZXMucHVzaChkZXNrdG9wU3R5bGVzKTtcbiAgICAgIC8vIFJldHVybiB0aGUgaW1hZ2VzXG4gICAgICByZXR1cm4gaW1hZ2VzO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBkb1Vuc2F2ZShwYXRoTmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSkge1xuICAgIGxldCB0b2FzdCA9IG5ldyBUb2FzdCgnQXJ0aWNsZSBoYXMgYmVlbiByZW1vdmVkJywgMzAwMCk7XG4gICAgLy8gUmVtb3ZlIGFydGljbGUgZnJvbSBJREJcbiAgICByZXR1cm4gRGF0YWJhc2UuZGVsZXRlQXJ0aWNsZShwYXRoTmFtZSkudGhlbigoKSA9PiB7Ly8gRGVsZXRlZCBmcm9tIElEQiBzdWNjZXNzZnVsbHlcbiAgICAgIC8vIFJlbW92ZSBhcnRpY2xlIGNvbnRlbnRcbiAgICAgIGNhY2hlcy5kZWxldGUoJ29mZmxpbmUtJyArIHBhdGhOYW1lKS50aGVuKCgpID0+IHtcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnJlbW92ZUNsYXNzKCdoZXJvX19zYXZlRm9yT2ZmbGluZS0tc2F2ZWQnKS5hdHRyKCd0aXRsZScsICdTYXZlIEFydGljbGUnKS5maW5kKCdzcGFuJykudGV4dCgnU2F2ZSBBcnRpY2xlJyk7XG4gICAgICAgIHRvYXN0LnNob3coKTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKCgpID0+IHsvLyBUaGVyZSB3YXMgYW4gZXJyb3IgZGVsZXRpbmcgZnJvbSBJREJcbiAgICAgIHRvYXN0LnNldFRleHQoJ1RoZXJlIHdhcyBhIHByb2JsZW0gZGVsZXRpbmcgdGhlIGFydGljbGUnKTtcbiAgICAgIHRvYXN0LnNob3coKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRvU2F2ZSgpIHtcbiAgICAvLyBDcmVhdGUgdG9hc3QgZm9yIGNvbmZpcm1hdGlvblxuICAgIGxldCB0b2FzdCA9IG5ldyBUb2FzdCgnQXJ0aWNsZSBpcyBub3cgYXZhaWxhYmxlIG9mZmxpbmUnLCAzMDAwKTtcblxuICAgIGlmICgkKCcjYXJ0aWNsZURhdGEnKS5sZW5ndGggPD0gMCkge1xuICAgICAgY29uc29sZS5sb2coJ1NXIEVSUk9SOiBPZmZsaW5lLmpzOjkwJyk7XG4gICAgICB0b2FzdC5zZXRUZXh0KCdBcnRpY2xlIGNvdWxkIG5vdCBiZSBzYXZlZCBmb3Igb2ZmbGluZScpO1xuICAgICAgdG9hc3Quc2hvdygpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBHZXQgcGFnZSBkYXRhIGZvciBJREJcbiAgICBsZXQgcGFnZURhdGEgPSBKU09OLnBhcnNlKCQoJyNhcnRpY2xlRGF0YScpLmh0bWwoKSk7XG5cbiAgICAvLyBBZGQgYXJ0aWNsZSB0byBJREJcbiAgICBEYXRhYmFzZS5hZGRBcnRpY2xlKFxuICAgICAgcGFnZURhdGEudGl0bGUsXG4gICAgICB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICBwYWdlRGF0YS5kZXNjcmlwdGlvbixcbiAgICAgIHBhZ2VEYXRhLmNhdGVnb3J5TmFtZSxcbiAgICAgIHBhZ2VEYXRhLmNhdGVnb3J5TGluayxcbiAgICAgIHBhZ2VEYXRhLnRpbWVUb1JlYWQsXG4gICAgICBwYWdlRGF0YS5pbWFnZU1vYmlsZSxcbiAgICAgIHBhZ2VEYXRhLmltYWdlRGVza3RvcCxcbiAgICAgIHBhZ2VEYXRhLmlzTGFyZ2UsXG4gICAgICBwYWdlRGF0YS5pc1ZpZGVvLFxuICAgICAgdGhpcy5hcnRpY2xlQ2FjaGVOYW1lXG4gICAgKS50aGVuKCgpID0+IHsvLyBTYXZlZCBpbiBJREIgc3VjY2Vzc2Z1bGx5XG4gICAgICAvLyBCdWlsZCBhbiBhcnJheSBvZiB0aGUgcGFnZS1zcGVjaWZpYyByZXNvdXJjZXMuXG4gICAgICBsZXQgcGFnZVJlc291cmNlcyA9IFt3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsIHBhZ2VEYXRhLmltYWdlTW9iaWxlLCBwYWdlRGF0YS5pbWFnZURlc2t0b3BdO1xuXG4gICAgICAvLyBBZGQgdGhlIGhlcm8gaW1hZ2VzXG4gICAgICBpZiAoJCgnLmhlcm9fX2ltYWdlJykubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgaGVyb0ltYWdlcyA9IHRoaXMuZ2V0SGVyb0ltYWdlcygpO1xuICAgICAgICBpZiAoaGVyb0ltYWdlcykgcGFnZVJlc291cmNlcyA9IHBhZ2VSZXNvdXJjZXMuY29uY2F0KGhlcm9JbWFnZXMpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdGhlIGFjY291bnQgYXBwbHkgaW1hZ2VzXG4gICAgICBpZiAoJCgnLmFjY291bnRhcHBseScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGFjY291bnRBcHBseUltYWdlID0gJCgnLmFjY291bnRhcHBseSAuY29udGFpbmVyJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyk7XG4gICAgICAgIGlmIChhY2NvdW50QXBwbHlJbWFnZSAhPSBcIlwiKSB7XG4gICAgICAgICAgYWNjb3VudEFwcGx5SW1hZ2UgPSBhY2NvdW50QXBwbHlJbWFnZS5zcGxpdCgndXJsKCcpWzFdLnNwbGl0KCcpJylbMF0ucmVwbGFjZSgvXCIvZywgJycpLnJlcGxhY2UoLycvZywgJycpO1xuICAgICAgICAgIHBhZ2VSZXNvdXJjZXMucHVzaChhY2NvdW50QXBwbHlJbWFnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQWRkIGltYWdlcyB0byB0aGUgYXJyYXlcbiAgICAgICQoJy5wYWdlLWJvZHkgLnd5c2l3eWcgaW1nLCAuYXV0aG9yUGFuZWwgaW1nJykuZWFjaCgoaW5kZXgsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgLy8gVHJpbSB3aGl0ZXNwYWNlIGZvcm0gc3JjXG4gICAgICAgIGxldCBpbWdTcmMgPSAkLnRyaW0oJChlbGVtZW50KS5hdHRyKCdzcmMnKSk7XG4gICAgICAgIC8vIElmIGVtcHR5IHNyYyBza2lwIHRoaXMgaW1hZ2VcbiAgICAgICAgaWYgKCEoaW1nU3JjID09PSAnJykpIHtcbiAgICAgICAgICAvLyBBZGQgdG8gcGFnZSByZXNvdXJjZXNcbiAgICAgICAgICBwYWdlUmVzb3VyY2VzLnB1c2goJChlbGVtZW50KS5hdHRyKCdzcmMnKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBPcGVuIHRoZSB1bmlxdWUgY2FjaGUgZm9yIHRoaXMgVVJMXG4gICAgICBjYWNoZXMub3Blbih0aGlzLmFydGljbGVDYWNoZU5hbWUpLnRoZW4oKGNhY2hlKSA9PiB7XG4gICAgICAgIC8vIFVuaXF1ZSBVUkxzXG4gICAgICAgIGxldCB1bmlxdWVSZXNvdXJjZXMgPSBbXTtcbiAgICAgICAgLy8gQ3JlYXRlIGFuY2hvciBlbGVtZW50IHRvIGdldCBmdWxsIFVSTHNcbiAgICAgICAgbGV0IGFuY2hvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgLy8gRGVkdXBlIGFzc2V0c1xuICAgICAgICAkLmVhY2gocGFnZVJlc291cmNlcywgKGksIGVsKSA9PiB7XG4gICAgICAgICAgLy8gTG9hZCB0aGUgY3VycmVudCBVUkwgaW50byB0aGUgYW5jaG9yXG4gICAgICAgICAgYW5jaG9yLmhyZWYgPSBlbDtcbiAgICAgICAgICAvLyBPbmx5IGNhY2hlIFVSTHMgb24gb3VyIGRvbWFpblxuICAgICAgICAgIGlmIChhbmNob3IuaG9zdCAhPT0gd2luZG93LmxvY2F0aW9uLmhvc3QpIHJldHVybjtcbiAgICAgICAgICAvLyBHZXQgdGhlIHJlbGF0aXZlIHBhdGhcbiAgICAgICAgICBsZXQgcmVsYXRpdmUgPSBhbmNob3IucGF0aG5hbWUgKyBhbmNob3Iuc2VhcmNoO1xuICAgICAgICAgIC8vIElmIGFscmVhZHkgaW4gbGlzdCBvZiBhc3NldHMsIGRvbid0IGluY2x1ZGUgaXQgYWdhaW5cbiAgICAgICAgICBpZiAoJC5pbkFycmF5KHJlbGF0aXZlLCB1bmlxdWVSZXNvdXJjZXMpID09PSAtMSkgdW5pcXVlUmVzb3VyY2VzLnB1c2gocmVsYXRpdmUpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gQ2FjaGUgYWxsIHJlcXVpcmVkIGFzc2V0c1xuICAgICAgICBsZXQgdXBkYXRlQ2FjaGUgPSBjYWNoZS5hZGRBbGwodW5pcXVlUmVzb3VyY2VzKTtcbiAgICAgICAgLy8gVXBkYXRlIFVJIHRvIGluZGljYXRlIHN1Y2Nlc3NcbiAgICAgICAgLy8gT3IgY2F0Y2ggYW55IGVycm9ycyBpZiBpdCBkb2Vzbid0IHN1Y2NlZWRcbiAgICAgICAgdXBkYXRlQ2FjaGUudGhlbigoKSA9PiB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ0FydGljbGUgaXMgbm93IGF2YWlsYWJsZSBvZmZsaW5lLicpO1xuICAgICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnaGVyb19fc2F2ZUZvck9mZmxpbmUtLXNhdmVkJykuYXR0cigndGl0bGUnLCAnU2F2ZWQgZm9yIG9mZmxpbmUnKS5maW5kKCdzcGFuJykudGV4dCgnQXJ0aWNsZSBTYXZlZCcpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnQXJ0aWNsZSBjb3VsZCBub3QgYmUgc2F2ZWQgZm9yIG9mZmxpbmUuJywgZXJyb3IpO1xuICAgICAgICAgIHRvYXN0LnNldFRleHQoJ0FydGljbGUgY291bGQgbm90IGJlIHNhdmVkIGZvciBvZmZsaW5lJyk7XG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRvYXN0LnNob3coKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsvLyBUaGVyZSB3YXMgYW4gZXJyb3Igc2F2aW5nIHRvIElEQlxuICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICB0b2FzdC5zZXRUZXh0KCdBcnRpY2xlIGNvdWxkIG5vdCBiZSBzYXZlZCBmb3Igb2ZmbGluZScpO1xuICAgICAgdG9hc3Quc2hvdygpO1xuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5pc0N1cnJlbnRQYWdlU2F2ZWQoKTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5jbGFzcyBPZmZsaW5lQXJ0aWNsZXMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5hcnRpY2xlR3JpZC0tc2F2ZWQnLFxuICAgICAgZ3JpZDogJy5hcnRpY2xlR3JpZC0tc2F2ZWQgLmFydGljbGVHcmlkX19ncmlkJyxcbiAgICAgIHRpdGxlOiAnLmFydGljbGVHcmlkLS1zYXZlZCAuYXJ0aWNsZUdyaWRfX3RpdGxlJyxcbiAgICAgIHRlbXBsYXRlOiAnI2FydGljbGVHcmlkX19wYW5lbFRlbXBsYXRlJyxcbiAgICAgIGVkaXRTYXZlZEFydGljbGVzOiAnLmhlcm9fX2VkaXRTYXZlZEFydGljbGVzJyxcbiAgICAgIGFydGljbGVzOiAnLmFydGljbGVHcmlkLS1zYXZlZCAuYXJ0aWNsZUdyaWRfX2dyaWQgLmFydGljbGVQYW5lbCcsXG4gICAgICBkZWxldGFibGVBcnRpY2xlOiAnLmFydGljbGVHcmlkLS1zYXZlZCAuYXJ0aWNsZUdyaWRfX2dyaWQgLmFydGljbGVQYW5lbC0tZGVsZXRhYmxlJ1xuICAgIH07XG4gICAgdGhpcy5zYXZlRm9yT2ZmbGluZSA9IG5ldyBTYXZlRm9yT2ZmbGluZSgpO1xuICAgIHRoaXMudGVtcGxhdGUgPSAkKCQodGhpcy5zZWwudGVtcGxhdGUpLmh0bWwoKSk7XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmxvYWRBcnRpY2xlcyA9IHRoaXMubG9hZEFydGljbGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wb3B1bGF0ZVRlbXBsYXRlcyA9IHRoaXMucG9wdWxhdGVUZW1wbGF0ZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUVkaXQgPSB0aGlzLmhhbmRsZUVkaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRlbGV0ZUFydGljbGUgPSB0aGlzLmRlbGV0ZUFydGljbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVN3aXBlID0gdGhpcy5oYW5kbGVTd2lwZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgbG9hZEFydGljbGVzKCkge1xuICAgIHJldHVybiBEYXRhYmFzZS5nZXRBcnRpY2xlcygpLnRoZW4oKGFydGljbGVzKSA9PiB7XG4gICAgICBsZXQgaXRlbXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGFydGljbGUgPSBhcnRpY2xlc1tpXTtcbiAgICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgICAgTGluazogYXJ0aWNsZS5saW5rLFxuICAgICAgICAgIFRpdGxlOiBhcnRpY2xlLnRpdGxlLFxuICAgICAgICAgIERlc2NyaXB0aW9uOiBhcnRpY2xlLmRlc2NyaXB0aW9uLFxuICAgICAgICAgIENhdGVnb3J5OiB7XG4gICAgICAgICAgICBOYW1lOiBhcnRpY2xlLmNhdGVnb3J5TmFtZSxcbiAgICAgICAgICAgIExpbms6IGFydGljbGUuY2F0ZWdvcnlMaW5rXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUaW1lVG9SZWFkOiBhcnRpY2xlLnRpbWVUb1JlYWQsXG4gICAgICAgICAgSW1hZ2VzOiB7XG4gICAgICAgICAgICBNb2JpbGU6IGFydGljbGUuaW1hZ2VNb2JpbGUsXG4gICAgICAgICAgICBEZXNrdG9wOiBhcnRpY2xlLmltYWdlRGVza3RvcFxuICAgICAgICAgIH0sXG4gICAgICAgICAgSXNMYXJnZTogYXJ0aWNsZS5pc0xhcmdlLFxuICAgICAgICAgIElzVmlkZW86IGFydGljbGUuaXNWaWRlb1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICQodGhpcy5zZWwuZ3JpZCkuaHRtbCh0aGlzLnBvcHVsYXRlVGVtcGxhdGVzKGl0ZW1zKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKHRoaXMuc2VsLnRpdGxlKS50ZXh0KCdZb3UgaGF2ZSBubyBzYXZlZCBhcnRpY2xlcycpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcG9wdWxhdGVUZW1wbGF0ZXMoaXRlbXMpIHtcbiAgICBsZXQgb3V0cHV0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gQ2xvbmUgdGVtcGxhdGVcbiAgICAgIGxldCAkdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlLmNsb25lKCk7XG4gICAgICAvLyBHZXQgdGhlIGl0ZW1cbiAgICAgIGxldCBpdGVtID0gaXRlbXNbaV07XG4gICAgICAvLyBTZXQgaW1hZ2UgYnJlYWtwb2ludFxuICAgICAgbGV0IGRlc2t0b3BCcmVha3BvaW50ID0gOTkyO1xuICAgICAgLy8gR2VuZXJhdGUgSURcbiAgICAgIGxldCBwYW5lbElkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpO1xuICAgICAgLy8gUG9wdWxhdGUgSURcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsJykuYXR0cignaWQnLCBwYW5lbElkKTtcbiAgICAgIC8vIElmIGxhcmdlIHBhbmVsXG4gICAgICBpZiAoaXRlbS5Jc0xhcmdlKSB7XG4gICAgICAgIC8vIFVwZGF0ZSBpbWFnZSBicmVha3BvaW50XG4gICAgICAgIGRlc2t0b3BCcmVha3BvaW50ID0gNzY4O1xuICAgICAgICAvLyBBZGQgY2xhc3NcbiAgICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5hZGRDbGFzcygnYXJ0aWNsZVBhbmVsLS1sYXJnZScpO1xuICAgICAgfVxuICAgICAgLy8gSWYgdmlkZW9cbiAgICAgIGlmIChpdGVtLklzVmlkZW8pIHtcbiAgICAgICAgLy8gQWRkIGNsYXNzXG4gICAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsJykuYWRkQ2xhc3MoJ2FydGljbGVQYW5lbC0tdmlkZW8nKTtcbiAgICAgIH1cbiAgICAgIC8vIFBvcHVsYXRlIGltYWdlc1xuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2ltYWdlJykuYXR0cih7XG4gICAgICAgIGhyZWY6IGl0ZW0uTGluayxcbiAgICAgICAgdGl0bGU6IGl0ZW0uVGl0bGVcbiAgICAgIH0pLmF0dHIoJ3N0eWxlJywgJ2JhY2tncm91bmQtaW1hZ2U6IHVybCgnICsgaXRlbS5JbWFnZXMuTW9iaWxlICsgJyk7Jyk7XG4gICAgICAkdGVtcGxhdGUuZmluZCgnc3R5bGUnKVswXS5pbm5lckhUTUwgPSAnQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogJyArIGRlc2t0b3BCcmVha3BvaW50ICsgJ3B4KXsjJyArIHBhbmVsSWQgKyAnIC5hcnRpY2xlUGFuZWxfX2ltYWdle2JhY2tncm91bmQtaW1hZ2U6IHVybCgnICsgaXRlbS5JbWFnZXMuRGVza3RvcCArICcpICFpbXBvcnRhbnQ7fX0nO1xuICAgICAgLy8gUG9wdWxhdGUgbGlua1xuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2NvbnRlbnQgPiBhJykuYXR0cih7XG4gICAgICAgIGhyZWY6IGl0ZW0uTGluayxcbiAgICAgICAgdGl0bGU6IGl0ZW0uVGl0bGVcbiAgICAgIH0pO1xuICAgICAgLy8gUG9wdWxhdGUgdGl0bGVcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX190aXRsZScpLnRleHQoaXRlbS5UaXRsZSk7XG4gICAgICAvLyBQb3B1bGF0ZSBkZXNjcmlwdGlvblxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2Rlc2NyaXB0aW9uJykudGV4dChpdGVtLkRlc2NyaXB0aW9uKTtcbiAgICAgIC8vIFBvcHVsYXRlIGNhdGVnb3J5XG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fc3ViVGl0bGUgYTpmaXJzdC1jaGlsZCcpLmF0dHIoe1xuICAgICAgICAnaHJlZic6IGl0ZW0uQ2F0ZWdvcnkuTGluayxcbiAgICAgICAgJ3RpdGxlJzogaXRlbS5DYXRlZ29yeS5OYW1lXG4gICAgICB9KS50ZXh0KGl0ZW0uQ2F0ZWdvcnkuTmFtZSk7XG4gICAgICAvLyBQb3B1bGF0ZSB0aW1lIHRvIHJlYWRcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX19zdWJUaXRsZSBhOmxhc3QtY2hpbGQnKS5hdHRyKHtcbiAgICAgICAgJ2hyZWYnOiBpdGVtLkxpbmssXG4gICAgICAgICd0aXRsZSc6IGl0ZW0uVGl0bGVcbiAgICAgIH0pLnRleHQoaXRlbS5UaW1lVG9SZWFkKTtcbiAgICAgIC8vIFB1c2ggaXRlbSB0byBvdXRwdXRcbiAgICAgIG91dHB1dC5wdXNoKCR0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmVkaXRTYXZlZEFydGljbGVzLCB0aGlzLmhhbmRsZUVkaXQpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmRlbGV0YWJsZUFydGljbGUsIHRoaXMuZGVsZXRlQXJ0aWNsZSk7XG4gICAgJCh0aGlzLnNlbC5hcnRpY2xlcykuc3dpcGVkZXRlY3QodGhpcy5oYW5kbGVTd2lwZSk7XG4gIH1cblxuICBoYW5kbGVFZGl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJCh0aGlzLnNlbC5lZGl0U2F2ZWRBcnRpY2xlcykudG9nZ2xlQ2xhc3MoJ2hlcm9fX2VkaXRTYXZlZEFydGljbGVzLS1lZGl0aW5nJyk7XG4gICAgaWYgKCQodGhpcy5zZWwuZWRpdFNhdmVkQXJ0aWNsZXMpLmhhc0NsYXNzKCdoZXJvX19lZGl0U2F2ZWRBcnRpY2xlcy0tZWRpdGluZycpKSB7XG4gICAgICAkKHRoaXMuc2VsLmdyaWQpLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5hZGRDbGFzcygnYXJ0aWNsZVBhbmVsLS1kZWxldGFibGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCh0aGlzLnNlbC5ncmlkKS5maW5kKCcuYXJ0aWNsZVBhbmVsJykucmVtb3ZlQ2xhc3MoJ2FydGljbGVQYW5lbC0tZGVsZXRhYmxlJyk7XG4gICAgfVxuICB9XG5cbiAgZGVsZXRlQXJ0aWNsZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCAkYXJ0aWNsZVBhbmVsID0gJChlLnRhcmdldCkucGFyZW50cygnLmFydGljbGVQYW5lbCcpO1xuICAgIGlmICgkKGUudGFyZ2V0KS5oYXNDbGFzcygnYXJ0aWNsZVBhbmVsJykpICRhcnRpY2xlUGFuZWwgPSAkKGUudGFyZ2V0KTtcbiAgICBsZXQgdXJsID0gbmV3IFVSTCgkYXJ0aWNsZVBhbmVsLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2ltYWdlJylbMF0uaHJlZik7XG4gICAgdGhpcy5zYXZlRm9yT2ZmbGluZS5kb1Vuc2F2ZSh1cmwucGF0aG5hbWUpLnRoZW4oKCkgPT4ge1xuICAgICAgJGFydGljbGVQYW5lbC5wYXJlbnQoKS5yZW1vdmUoKTtcbiAgICAgIGlmICgkKHRoaXMuc2VsLmdyaWQpLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5sZW5ndGggPD0gMCkge1xuICAgICAgICAkKHRoaXMuc2VsLmdyaWQpLmFwcGVuZCgnPGRpdiBjbGFzcz1cImNvbC0xMlwiPjxoMiBjbGFzcz1cImFydGljbGVHcmlkX190aXRsZVwiPllvdSBoYXZlIG5vIHNhdmVkIGFydGljbGVzPC9oMj48L2Rpdj4nKTtcbiAgICAgICAgdGhpcy5oYW5kbGVFZGl0KHtwcmV2ZW50RGVmYXVsdDogKCkgPT4ge319KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZVN3aXBlKHN3aXBlZGlyLCBlbGVtZW50KSB7XG4gICAgLy8gc3dpcGVkaXIgY29udGFpbnMgZWl0aGVyIFwibm9uZVwiLCBcImxlZnRcIiwgXCJyaWdodFwiLCBcInRvcFwiLCBvciBcImRvd25cIlxuICAgIGxldCBpc0RlbGV0YWJsZSA9ICQoZWxlbWVudCkuaGFzQ2xhc3MoJ2FydGljbGVQYW5lbC0tZGVsZXRhYmxlJyk7XG4gICAgaWYgKHN3aXBlZGlyID09PSAnbGVmdCcgJiYgIWlzRGVsZXRhYmxlKSB7XG4gICAgICAkKCcuYXJ0aWNsZVBhbmVsLmFydGljbGVQYW5lbC0tZGVsZXRhYmxlJykucmVtb3ZlQ2xhc3MoJ2FydGljbGVQYW5lbC0tZGVsZXRhYmxlJyk7XG4gICAgICAkKGVsZW1lbnQpLmFkZENsYXNzKCdhcnRpY2xlUGFuZWwtLWRlbGV0YWJsZScpO1xuICAgIH0gZWxzZSBpZiAoc3dpcGVkaXIgPT09ICdyaWdodCcgJiYgaXNEZWxldGFibGUpIHtcbiAgICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2FydGljbGVQYW5lbC0tZGVsZXRhYmxlJyk7XG4gICAgfVxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5sb2FkQXJ0aWNsZXMoKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmNsYXNzIE9mZmxpbmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNhdmVGb3JPZmZsaW5lID0gbmV3IFNhdmVGb3JPZmZsaW5lKCk7XG4gICAgdGhpcy5vZmZsaW5lQXJ0aWNsZXMgPSBuZXcgT2ZmbGluZUFydGljbGVzKCk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5jaGVja1N0YXR1cyA9IHRoaXMuY2hlY2tTdGF0dXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRvT25saW5lID0gdGhpcy5kb09ubGluZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZG9PZmZsaW5lID0gdGhpcy5kb09mZmxpbmUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNoZWNrU3RhdHVzKCkge1xuICAgIGlmIChuYXZpZ2F0b3Iub25MaW5lKSB7XG4gICAgICB0aGlzLmRvT25saW5lKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9PZmZsaW5lKCk7XG4gICAgfVxuICB9XG5cbiAgZG9PbmxpbmUoKSB7XG4gICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdvZmZsaW5lJyk7XG4gICAgJCgnLmRpc2FibGUtb2ZmbGluZVt0YWJpbmRleD1cIi0xXCJdLCAuZGlzYWJsZS1vZmZsaW5lICpbdGFiaW5kZXg9XCItMVwiXScpLnJlbW92ZUF0dHIoJ3RhYmluZGV4Jyk7XG4gIH1cblxuICBkb09mZmxpbmUoKSB7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKCdvZmZsaW5lJyk7XG4gICAgJCgnLmRpc2FibGUtb2ZmbGluZSwgLmRpc2FibGUtb2ZmbGluZSAqJykuYXR0cigndGFiaW5kZXgnLCAnLTEnKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIHRoaXMuZG9PbmxpbmUpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgdGhpcy5kb09mZmxpbmUpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoISgnb25MaW5lJyBpbiBuYXZpZ2F0b3IpKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5zYXZlRm9yT2ZmbGluZS5pbml0KCk7XG4gICAgdGhpcy5vZmZsaW5lQXJ0aWNsZXMuaW5pdCgpO1xuICAgIHRoaXMuY2hlY2tTdGF0dXMoKTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgT2ZmbGluZSgpO1xuIiwiY2xhc3MgUGFzc3dvcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5mb3Jtc19fcGFzc3dvcmQnLFxuICAgICAgdG9nZ2xlOiAnLmZvcm1zX19wYXNzd29yZCBpbnB1dFt0eXBlPWNoZWNrYm94XSdcbiAgICB9O1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy50b2dnbGVQbGFpblRleHQgPSB0aGlzLnRvZ2dsZVBsYWluVGV4dC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjaGFuZ2UnLCB0aGlzLnNlbC50b2dnbGUsIChlKSA9PiB7XG4gICAgICBjb25zdCBwYXNzd29yZFRhcmdldCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtZmllbGQtaWQnKTtcbiAgICAgIHRoaXMudG9nZ2xlUGxhaW5UZXh0KHBhc3N3b3JkVGFyZ2V0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHRvZ2dsZVBsYWluVGV4dChmaWVsZElkKSB7XG4gICAgY29uc3QgZmllbGQgPSAkKCcjJyArIGZpZWxkSWQpO1xuICAgIHN3aXRjaCAoZmllbGQuYXR0cigndHlwZScpKSB7XG4gICAgY2FzZSAncGFzc3dvcmQnOlxuICAgICAgZmllbGQuYXR0cigndHlwZScsICd0ZXh0Jyk7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgY2FzZSAndGV4dCc6XG4gICAgICBmaWVsZC5hdHRyKCd0eXBlJywgJ3Bhc3N3b3JkJyk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFBhc3N3b3JkKCk7XG4iLCJjbGFzcyBQYXNzd29yZFJlbWluZGVyRm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgdXJsVG9rZW46ICcvbGlicy9ncmFuaXRlL2NzcmYvdG9rZW4uanNvbicsXG4gICAgICB1cmxMb2dpbjogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9sb2dpbi9pbmRleC5qc29uJyxcbiAgICAgIHVybFJlcXVlc3Q6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVxdWVzdF9wYXNzd29yZC9pbmRleC5qc29uJyxcbiAgICAgIHVybFJlc2V0OiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL3Jlc2V0X3Bhc3N3b3JkL2luZGV4Lmpzb24nXG4gICAgfTtcblxuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLnJlc2V0LXBhc3N3b3JkLWNvbnRhaW5lcidcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRQYXRoSG9tZSA9IHRoaXMuZ2V0UGF0aEhvbWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNyZWF0ZUNvb2tpZSA9IHRoaXMuY3JlYXRlQ29va2llLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnJlcXVlc3RUb2tlbiA9IHRoaXMucmVxdWVzdFRva2VuLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZXNldFBhc3N3b3JkID0gdGhpcy5yZXNldFBhc3N3b3JkLmJpbmQodGhpcyk7XG4gIH1cblxuICBnZXRQYXRoUHJlZml4KCkge1xuICAgIGNvbnN0IHByZWZpeCA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLXByZWZpeFxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XG4gIH1cblxuICBnZXRQYXRoSG9tZSgpIHtcbiAgICBjb25zdCBob21lID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtaG9tZVxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgcmV0dXJuIChob21lID8gaG9tZSA6ICcnKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgncGFzc3dvcmQnLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKCQoZWxlbWVudCkuYXR0cigncGF0dGVybicpKS50ZXN0KHZhbHVlKTtcbiAgICB9LCAnUGFzc3dvcmQgZm9ybWF0IGlzIG5vdCB2YWxpZCcpO1xuXG4gICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ2VxdWFsVG8nLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcbiAgICAgIHJldHVybiAoJCgnIycgKyAkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtZXF1YWxUbycpKS52YWwoKSA9PT0gJChlbGVtZW50KS52YWwoKSk7XG4gICAgfSwgJ1Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnKTtcblxuICAgIHZhciByZW1pbmRlclBhZ2UgPSAkKHRoaXMuc2VsLmNvbXBvbmVudCk7XG4gICAgaWYgKHJlbWluZGVyUGFnZS5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSByZW1pbmRlclBhZ2UuZGF0YSgndXNlcm5hbWUnKTtcbiAgICAgIHZhciB0b2tlbiA9IHJlbWluZGVyUGFnZS5kYXRhKCd0b2tlbicpO1xuXG4gICAgICBpZiAoKHVzZXJuYW1lICE9PSBudWxsICYmIHR5cGVvZiAodXNlcm5hbWUpICE9PSAndW5kZWZpbmVkJyAmJiB1c2VybmFtZS5sZW5ndGggPiAwKSAmJiAodG9rZW4gIT09IG51bGwgJiYgdHlwZW9mICh0b2tlbikgIT09ICd1bmRlZmluZWQnICYmIHRva2VuLmxlbmd0aCA+IDApKSB7XG4gICAgICAgIHJlbWluZGVyUGFnZS5maW5kKCcuc3RlcC0zJykuc2hvdygpO1xuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMScpLmhpZGUoKTtcbiAgICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTInKS5oaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMScpLnNob3coKTtcbiAgICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTInKS5oaWRlKCk7XG4gICAgICAgIHJlbWluZGVyUGFnZS5maW5kKCcuc3RlcC0zJykuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMSBmb3JtJykudmFsaWRhdGUoe1xuICAgICAgICBydWxlczoge1xuICAgICAgICAgIHJlc2V0UGFzc3dvcmRfX2VtYWlsOiAnZW1haWwnXG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN1Ym1pdEhhbmRsZXI6IChmb3JtKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0VG9rZW4oZm9ybSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTMgZm9ybScpLnZhbGlkYXRlKHtcbiAgICAgICAgcnVsZXM6IHtcbiAgICAgICAgICByZXNldF9fY3JlYXRlUGFzc3dvcmQ6ICdwYXNzd29yZCcsXG4gICAgICAgICAgcmVzZXRfX2NvbmZpcm1QYXNzd29yZDogJ2VxdWFsVG8nXG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN1Ym1pdEhhbmRsZXI6IChmb3JtKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNldFBhc3N3b3JkKGZvcm0pO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlQ29va2llKG5hbWUsIHZhbHVlLCBleHBpcnlTZWNvbmRzKSB7XG4gICAgdmFyIGV4cGlyZXMgPSAnJztcbiAgICBpZiAoZXhwaXJ5U2Vjb25kcykge1xuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgKGV4cGlyeVNlY29uZHMgKiAxMDAwKSk7XG4gICAgICBleHBpcmVzID0gJzsgZXhwaXJlcz0nICsgZGF0ZS50b1VUQ1N0cmluZygpO1xuICAgIH1cbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgJz0nICsgdmFsdWUgKyBleHBpcmVzICsgJzsgcGF0aD0vJztcbiAgfVxuXG4gIHJlcXVlc3RUb2tlbihmb3JtKSB7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICB1c2VybmFtZTogJChmb3JtKS5maW5kKCdpbnB1dCNyZXNldFBhc3N3b3JkX19lbWFpbCcpLnZhbCgpLFxuICAgICAgcGFnZTogd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICB9O1xuXG4gICAgJChmb3JtKS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgJChmb3JtKS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcbiAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFJlcXVlc3QsXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJy5zdGVwLTEnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcuc3RlcC0yJykuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LlxcbicgKyByZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgICQoZm9ybSkuZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdHZXQgbmV3IHBhc3N3b3JkJyk7XG4gICAgICAgICAgJChmb3JtKS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ0dldCBuZXcgcGFzc3dvcmQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXNldFBhc3N3b3JkKGZvcm0pIHtcbiAgICB2YXIgdXNlcm5hbWUgPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZGF0YSgndXNlcm5hbWUnKTtcbiAgICB2YXIgdG9rZW4gPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZGF0YSgndG9rZW4nKTtcbiAgICB2YXIgcGFzc3dvcmQgPSAkKGZvcm0pLmZpbmQoJ2lucHV0I3Jlc2V0X19jcmVhdGVQYXNzd29yZCcpLnZhbCgpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgdG9rZW46IHRva2VuLFxuICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgfTtcblxuICAgICQoZm9ybSkuZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xuICAgICQoZm9ybSkuZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xuICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XG4gICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxSZXNldCxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAobmV4dFRva2VuUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dGNzcmZ0b2tlbiA9IG5leHRUb2tlblJlc3BvbnNlLnRva2VuO1xuXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxMb2dpbixcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHVzZXJuYW1lLCBwYXNzd29yZDogcGFzc3dvcmQgfSxcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBuZXh0Y3NyZnRva2VuIH0sXG4gICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgc3VjY2VzczogKGxvZ2luUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ2luUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAobG9naW5SZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyBsb2dpblJlc3BvbnNlLCB0cnVlIF0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYmFja1VybCA9ICQoZm9ybSkuZGF0YSgnYmFjaycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQudHJpbShiYWNrVXJsKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja1VybCA9IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5nZXRQYXRoSG9tZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gYmFja1VybDtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gbG9naW4gdXNpbmcgeW91ciB1cGRhdGVkIGNyZWRlbnRpYWxzLlxcbicgKyByZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gbG9naW4gdXNpbmcgeW91ciB1cGRhdGVkIGNyZWRlbnRpYWxzLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJChmb3JtKS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ1N1Ym1pdCcpO1xuICAgICAgICAgICAgICAgICAgICAkKGZvcm0pLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgnU3VibWl0Jyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LlxcbicgKyByZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgUGFzc3dvcmRSZW1pbmRlckZvcm0oKTtcbiIsImNsYXNzIFBhc3N3b3JkVmFsaWRpdHlBcGkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNoZWNrQ2FzaW5nID0gdGhpcy5jaGVja0Nhc2luZy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2hlY2tTcGVjaWFsID0gdGhpcy5jaGVja1NwZWNpYWwuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNoZWNrTnVtYmVyID0gdGhpcy5jaGVja051bWJlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2hlY2tMZW5ndGggPSB0aGlzLmNoZWNrTGVuZ3RoLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pc1ZhbGlkID0gdGhpcy5pc1ZhbGlkLmJpbmQodGhpcyk7XG4gIH1cblxuICBpc1ZhbGlkKHBhc3N3b3JkKSB7XG4gICAgY29uc3QgaXNMZW5ndGhWYWxpZCA9IHRoaXMuY2hlY2tMZW5ndGgocGFzc3dvcmQpO1xuICAgIGNvbnN0IGlzQ2FzaW5nVmFsaWQgPSB0aGlzLmNoZWNrQ2FzaW5nKHBhc3N3b3JkKTtcbiAgICBjb25zdCBpc1NwZWljYWxWYWxpZCA9IHRoaXMuY2hlY2tTcGVjaWFsKHBhc3N3b3JkKTtcbiAgICBjb25zdCBpc051bWJlclZhbGlkID0gdGhpcy5jaGVja051bWJlcihwYXNzd29yZCk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICBpc1ZhbGlkOiBpc0xlbmd0aFZhbGlkICYmIGlzQ2FzaW5nVmFsaWQgJiYgaXNTcGVpY2FsVmFsaWQgJiYgaXNOdW1iZXJWYWxpZCxcbiAgICAgIGlzTGVuZ3RoVmFsaWQsXG4gICAgICBpc0Nhc2luZ1ZhbGlkLFxuICAgICAgaXNTcGVpY2FsVmFsaWQsXG4gICAgICBpc051bWJlclZhbGlkXG4gICAgfTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBjaGVja0xlbmd0aChwYXNzd29yZCkge1xuICAgIHJldHVybiBwYXNzd29yZC5sZW5ndGggPj0gODtcbiAgfVxuXG4gIGNoZWNrQ2FzaW5nKHBhc3N3b3JkKSB7XG4gICAgcmV0dXJuIC9eKD89LipbYS16XSkuKyQvLnRlc3QocGFzc3dvcmQpICYmIC9eKD89LipbQS1aXSkuKyQvLnRlc3QocGFzc3dvcmQpO1xuICB9XG5cbiAgY2hlY2tOdW1iZXIocGFzc3dvcmQpIHtcbiAgICByZXR1cm4gL14oPz0uKlswLTldKS4rJC8udGVzdChwYXNzd29yZCk7XG4gIH1cblxuICBjaGVja1NwZWNpYWwocGFzc3dvcmQpIHtcbiAgICByZXR1cm4gL14oPz0uKlshwqMlJiooKT17fUAjPjxdKS4rJC8udGVzdChwYXNzd29yZCk7XG4gIH1cbn1cblxuXG4vLyBJJ3ZlIGFzc3VtZWQgdGhlcmUgd2lsbCBvbmx5IGJlIG9uZSBwYXNzd29yZCB2YWxpZGl0eSBjaGVja2VyIG9uIGEgcGFnZSBhdCBvbmNlLCBiZWNhdXNlOlxuLy8gLSB0aGUgdmFsaWRpdHkgY2hlY2tlciB3b3VsZCBvbmx5IGJlIG9uIHRoZSBtYWluIHBhc3N3b3JkIGVudHJ5IGZpZWxkIGFuZCBub3QgdGhlIGNvbmZpcm1hdGlvblxuLy8gLSBhIHVzZXIgd291bGRuJ3QgYmUgc2V0dGluZyBtb3JlIHRoYW4gb25lIHBhc3N3b3JkIGF0IG9uY2VcbmNsYXNzIFBhc3N3b3JkVmFsaWRpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy52YWxpZGl0eS1jaGVja3MnXG4gICAgfTtcblxuICAgIHRoaXMucGFzc3dvcmRBcGkgPSBuZXcgUGFzc3dvcmRWYWxpZGl0eUFwaSgpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IHBhc3N3b3JkRmllbGRJZCA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5hdHRyKCdkYXRhLWZpZWxkLWlkJyk7XG4gICAgY29uc3QgcGFzc3dvcmRGaWVsZCA9ICQoJyMnICsgcGFzc3dvcmRGaWVsZElkKTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdrZXl1cCBrZXlwcmVzcyBjaGFuZ2UnLCAnIycgKyBwYXNzd29yZEZpZWxkSWQsICgpID0+IHtcbiAgICAgIGxldCBwYXNzd29yZCA9IHBhc3N3b3JkRmllbGQudmFsKCk7XG4gICAgICB0aGlzLmNoZWNrUGFzc3dvcmRWYWxpZGl0eShwYXNzd29yZCk7XG4gICAgfSk7XG4gIH1cblxuICBpc1Bhc3N3b3JkVmFsaWQocGFzc3dvcmQpIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5wYXNzd29yZEFwaS5pc1ZhbGlkKHBhc3N3b3JkKTtcbiAgICByZXR1cm4gcmVzdWx0LmlzVmFsaWQ7XG4gIH1cblxuICBjaGVja1Bhc3N3b3JkVmFsaWRpdHkocGFzc3dvcmQpIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5wYXNzd29yZEFwaS5pc1ZhbGlkKHBhc3N3b3JkKTtcblxuICAgIGlmIChyZXN1bHQuaXNMZW5ndGhWYWxpZCkge1xuICAgICAgJCgnW2RhdGEtY2hlY2s9bGVuZ3RoXScpLmFkZENsYXNzKCdpcy12YWxpZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCdbZGF0YS1jaGVjaz1sZW5ndGhdJykucmVtb3ZlQ2xhc3MoJ2lzLXZhbGlkJyk7XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdC5pc0Nhc2luZ1ZhbGlkKSB7XG4gICAgICAkKCdbZGF0YS1jaGVjaz1jYXNpbmddJykuYWRkQ2xhc3MoJ2lzLXZhbGlkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJ1tkYXRhLWNoZWNrPWNhc2luZ10nKS5yZW1vdmVDbGFzcygnaXMtdmFsaWQnKTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0LmlzU3BlaWNhbFZhbGlkKSB7XG4gICAgICAkKCdbZGF0YS1jaGVjaz1zcGVjaWFsXScpLmFkZENsYXNzKCdpcy12YWxpZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCdbZGF0YS1jaGVjaz1zcGVjaWFsXScpLnJlbW92ZUNsYXNzKCdpcy12YWxpZCcpO1xuICAgIH1cblxuICAgIGlmIChyZXN1bHQuaXNOdW1iZXJWYWxpZCkge1xuICAgICAgJCgnW2RhdGEtY2hlY2s9bnVtYmVyXScpLmFkZENsYXNzKCdpcy12YWxpZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCdbZGF0YS1jaGVjaz1udW1iZXJdJykucmVtb3ZlQ2xhc3MoJ2lzLXZhbGlkJyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBQYXNzd29yZFZhbGlkaXR5KCk7XG4iLCJjbGFzcyBSZWdpc3RlckZvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIGZiQXBwSWQ6ICcxMDgwMDMxMzI4ODAxMjExJyxcbiAgICAgIGdvQ2xpZW50SWQ6ICczMTM0Njk4Mzc0MjAtbDg4MmgzOWdlOG44bjlwYjk3bGR2amszZm04cHBxZ3MuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nLFxuXG4gICAgICB1cmxUb2tlbjogJy9saWJzL2dyYW5pdGUvY3NyZi90b2tlbi5qc29uJyxcbiAgICAgIHVybFJlZnJlc2hDaGVjazogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZWZyZXNoX3Rva2VuL2luZGV4Lmpzb24nLFxuICAgICAgdXJsUmVnaXN0ZXI6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVnaXN0ZXIvaW5kZXguanNvbicsXG4gICAgICB1cmxVcGRhdGVDYXRlZ29yaWVzOiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL3VwZGF0ZV9jYXRlZ29yaWVzL2luZGV4Lmpzb24nXG4gICAgfTtcblxuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLnBhZ2UtYm9keS5yZWdpc3RlciwgI2Rvd25sb2FkLCAuZ2F0ZWQnLFxuICAgICAgYnV0dG9uRmFjZWJvb2s6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmZiJyxcbiAgICAgIGJ1dHRvbkxpbmtlZGluOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5saScsXG4gICAgICBidXR0b25Hb29nbGVQbHVzOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5nbydcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRQYXRoSG9tZSA9IHRoaXMuZ2V0UGF0aEhvbWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmxvZ2dlZEluID0gdGhpcy5sb2dnZWRJbi5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy50cnlSZWdpc3RlckZhY2Vib29rID0gdGhpcy50cnlSZWdpc3RlckZhY2Vib29rLmJpbmQodGhpcyk7XG4gICAgdGhpcy50cnlSZWdpc3RlckxpbmtlZGluID0gdGhpcy50cnlSZWdpc3RlckxpbmtlZGluLmJpbmQodGhpcyk7XG4gICAgdGhpcy50cnlSZWdpc3Rlckdvb2dsZSA9IHRoaXMudHJ5UmVnaXN0ZXJHb29nbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRyeVJlZ2lzdGVyID0gdGhpcy50cnlSZWdpc3Rlci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5leGVjdXRlUmVnaXN0ZXIgPSB0aGlzLmV4ZWN1dGVSZWdpc3Rlci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0UGF0aFByZWZpeCgpIHtcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xuICB9XG5cbiAgZ2V0UGF0aEhvbWUoKSB7XG4gICAgY29uc3QgaG9tZSA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLWhvbWVcXCddJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiAoaG9tZSA/IGhvbWUgOiAnJyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlYWRDb29raWUobmFtZSkge1xuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xuICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjID0gY2FbaV07XG4gICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJCh3aW5kb3cpLm9uKCd1c2VybG9nZ2VkaW4uREhMJywgKCkgPT4ge1xuICAgICAgdGhpcy5sb2dnZWRJbigpO1xuICAgIH0pO1xuXG4gICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ3Bhc3N3b3JkJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XG4gICAgICBpZiAoJC50cmltKHZhbHVlKS5sZW5ndGggPT09IDApIHJldHVybiB0cnVlO1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJChlbGVtZW50KS5hdHRyKCdwYXR0ZXJuJykpLnRlc3QodmFsdWUpO1xuICAgIH0sICdQYXNzd29yZCBmb3JtYXQgaXMgbm90IHZhbGlkJyk7XG5cbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnZXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xuICAgICAgcmV0dXJuICgkKCcjJyArICQoZWxlbWVudCkuYXR0cignZGF0YS1lcXVhbFRvJykpLnZhbCgpID09PSAkKGVsZW1lbnQpLnZhbCgpKTtcbiAgICB9LCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpO1xuXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkZhY2Vib29rKS5sZW5ndGggPiAwKSB7XG4gICAgICB3aW5kb3cuZmJBc3luY0luaXQgPSAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5mYl9pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mICh3aW5kb3cuRkIpICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuRkIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHdpbmRvdy5GQi5pbml0KHtcbiAgICAgICAgICAgICAgYXBwSWQ6IHRoaXMuY29uZmlnLmZiQXBwSWQsXG4gICAgICAgICAgICAgIGNvb2tpZTogdHJ1ZSxcbiAgICAgICAgICAgICAgeGZibWw6IHRydWUsXG4gICAgICAgICAgICAgIHZlcnNpb246ICd2Mi44J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmZiX2ludGVydmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhY2Vib29rLWpzc2RrJykgPT09IG51bGwpIHtcbiAgICAgICAgdmFyIGZqcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICAgICAgdmFyIGpzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgIGpzLmlkID0gJ2ZhY2Vib29rLWpzc2RrJztcbiAgICAgICAganMuc3JjID0gJy8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fRU4vc2RrLmpzJztcbiAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xuICAgICAgfVxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLm9uKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgdGhpcy50cnlSZWdpc3RlckZhY2Vib29rKGV2dCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikubGVuZ3RoID4gMCkge1xuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLm9uKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgdGhpcy50cnlSZWdpc3RlckxpbmtlZGluKGV2dCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBnb29nbGVCdXR0b24gPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKTtcbiAgICBpZiAoZ29vZ2xlQnV0dG9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHdpbmRvdy5nb19pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LmdhcGkpICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZ2FwaSAhPT0gbnVsbCkge1xuICAgICAgICAgIHdpbmRvdy5nYXBpLmxvYWQoJ2F1dGgyJywgKCkgPT4ge1xuICAgICAgICAgICAgdmFyIGF1dGgyID0gd2luZG93LmdhcGkuYXV0aDIuaW5pdCh7XG4gICAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jb25maWcuZ29DbGllbnRJZCxcbiAgICAgICAgICAgICAgY29va2llcG9saWN5OiAnc2luZ2xlX2hvc3Rfb3JpZ2luJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZ29vZ2xlQnV0dG9uLmdldCgwKTtcbiAgICAgICAgICAgIGF1dGgyLmF0dGFjaENsaWNrSGFuZGxlcihlbGVtZW50LCB7fSxcbiAgICAgICAgICAgICAgKGdvb2dsZVVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyeVJlZ2lzdGVyR29vZ2xlKGdvb2dsZVVzZXIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3IgIT09ICdwb3B1cF9jbG9zZWRfYnlfdXNlcicpIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KHJlc3VsdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZ29faW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgICB9LCAxMDApO1xuXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnI2dsYi1yZWdpc3Rlci1zdGFydCBmb3JtI3JlZ2lzdGVyLWRldGFpbC1mb3JtJykudmFsaWRhdGUoe1xuICAgICAgcnVsZXM6IHtcbiAgICAgICAgcmVnaXN0ZXJfX2VtYWlsOiAnZW1haWwnLFxuICAgICAgICByZWdpc3Rlcl9fcGFzc3dvcmQxOiAncGFzc3dvcmQnXG4gICAgICB9LFxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XG4gICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VibWl0SGFuZGxlcjogKGZvcm0pID0+IHtcbiAgICAgICAgdGhpcy50cnlSZWdpc3Rlcihmb3JtKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJyNnbGItcmVnaXN0ZXItY2F0ZWdvcmllcyBmb3JtIC5mb3Jtc19fY3RhLS1yZWQnKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMudHJ5Q2F0ZWdvcnlTZWxlY3Rpb24oZXZ0KTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIHRyeVJlZ2lzdGVyRmFjZWJvb2soZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcblxuICAgIHdpbmRvdy5GQi5sb2dpbigobG9naW5SZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKGxvZ2luUmVzcG9uc2UuYXV0aFJlc3BvbnNlKSB7XG4gICAgICAgIHdpbmRvdy5GQi5hcGkoJy9tZScsIChkYXRhUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGZpcnN0bmFtZTogZGF0YVJlc3BvbnNlLmZpcnN0X25hbWUsXG4gICAgICAgICAgICBsYXN0bmFtZTogZGF0YVJlc3BvbnNlLmxhc3RfbmFtZSxcbiAgICAgICAgICAgIHVzZXJuYW1lOiBkYXRhUmVzcG9uc2UuZW1haWwsXG4gICAgICAgICAgICBwYXNzd29yZDogZGF0YVJlc3BvbnNlLmlkLFxuICAgICAgICAgICAgaXNsaW5rZWRpbjogJ3RydWUnLFxuICAgICAgICAgICAgdGNhZ3JlZTogdHJ1ZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0aGlzLmV4ZWN1dGVSZWdpc3RlcihkYXRhLCAoKSA9PiB7XG4gICAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykudGV4dCgnRmFjZWJvb2snKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgeyBmaWVsZHM6IFsgJ2lkJywgJ2VtYWlsJywgJ2ZpcnN0X25hbWUnLCAnbGFzdF9uYW1lJyBdfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSwgeyBzY29wZTogJ2VtYWlsLHB1YmxpY19wcm9maWxlJywgcmV0dXJuX3Njb3BlczogdHJ1ZSB9KTtcbiAgfVxuXG4gIHRyeVJlZ2lzdGVyTGlua2VkaW4oZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcblxuICAgIElOLlVzZXIuYXV0aG9yaXplKCgpID0+IHtcbiAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XG4gICAgICAgIHZhciBtZW1iZXIgPSByZXN1bHQudmFsdWVzWzBdO1xuXG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgIGZpcnN0bmFtZTogbWVtYmVyLmZpcnN0TmFtZSxcbiAgICAgICAgICBsYXN0bmFtZTogbWVtYmVyLmxhc3ROYW1lLFxuICAgICAgICAgIHVzZXJuYW1lOiBtZW1iZXIuZW1haWxBZGRyZXNzLFxuICAgICAgICAgIHBhc3N3b3JkOiBtZW1iZXIuaWQsXG4gICAgICAgICAgaXNsaW5rZWRpbjogJ3RydWUnLFxuICAgICAgICAgIHRjYWdyZWU6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmV4ZWN1dGVSZWdpc3RlcihkYXRhLCAoKSA9PiB7XG4gICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLnRleHQoJ0xpbmtlZEluJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICB2YXIgcmVzdWx0ID0gd2luZG93LklOLlVzZXIuaXNBdXRob3JpemVkKCk7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgdmFyIG1lbWJlciA9IHJlc3VsdC52YWx1ZXNbMF07XG5cbiAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGZpcnN0bmFtZTogbWVtYmVyLmZpcnN0TmFtZSxcbiAgICAgICAgICAgIGxhc3RuYW1lOiBtZW1iZXIubGFzdE5hbWUsXG4gICAgICAgICAgICB1c2VybmFtZTogbWVtYmVyLmVtYWlsQWRkcmVzcyxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBtZW1iZXIuaWQsXG4gICAgICAgICAgICBpc2xpbmtlZGluOiAndHJ1ZScsXG4gICAgICAgICAgICB0Y2FncmVlOiB0cnVlXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRoaXMuZXhlY3V0ZVJlZ2lzdGVyKGRhdGEsICgpID0+IHtcbiAgICAgICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS50ZXh0KCdMaW5rZWRJbicpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LCAxMDAwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cnlSZWdpc3Rlckdvb2dsZShnb29nbGVVc2VyKSB7XG4gICAgdmFyIGJhc2ljUHJvZmlsZSA9IGdvb2dsZVVzZXIuZ2V0QmFzaWNQcm9maWxlKCk7XG5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIGZpcnN0bmFtZTogYmFzaWNQcm9maWxlLmdldEdpdmVuTmFtZSgpLFxuICAgICAgbGFzdG5hbWU6IGJhc2ljUHJvZmlsZS5nZXRGYW1pbHlOYW1lKCksXG4gICAgICB1c2VybmFtZTogYmFzaWNQcm9maWxlLmdldEVtYWlsKCksXG4gICAgICBwYXNzd29yZDogYmFzaWNQcm9maWxlLmdldElkKCksXG4gICAgICBpc2xpbmtlZGluOiAndHJ1ZScsXG4gICAgICB0Y2FncmVlOiB0cnVlXG4gICAgfTtcblxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgdGhpcy5leGVjdXRlUmVnaXN0ZXIoZGF0YSwgKCkgPT4ge1xuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cykudGV4dCgnR29vZ2xlKycpO1xuICAgIH0pO1xuICB9XG5cbiAgdHJ5UmVnaXN0ZXIoZm9ybSkge1xuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgZmlyc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2ZpcnN0bmFtZScpLnZhbCgpLFxuICAgICAgbGFzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fbGFzdG5hbWUnKS52YWwoKSxcbiAgICAgIHVzZXJuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2VtYWlsJykudmFsKCksXG4gICAgICBwYXNzd29yZDogZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX19wYXNzd29yZDEnKS52YWwoKSxcblxuICAgICAgaXNsaW5rZWRpbjogJ2ZhbHNlJyxcbiAgICAgIHRjYWdyZWU6IGZybS5maW5kKCdpbnB1dCNjaGVja2JveElkJykuaXMoJzpjaGVja2VkJylcbiAgICB9O1xuXG4gICAgaWYgKCgkLnRyaW0oZGF0YS5maXJzdG5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShkYXRhLmxhc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS51c2VybmFtZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciB5b3VyIG5hbWUgYW5kIGVtYWlsIGFkZHJlc3MuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xuXG4gICAgICB0aGlzLmV4ZWN1dGVSZWdpc3RlcihkYXRhLCAoKSA9PiB7XG4gICAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ1N1Ym1pdCcpO1xuICAgICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdTdWJtaXQnKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGV4ZWN1dGVSZWdpc3RlcihkYXRhLCB1bndhaXRDYWxsYmFjaykge1xuICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XG4gICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFJlZ2lzdGVyLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgZnJtID0gJCgnLnBhZ2UtYm9keS5yZWdpc3RlciwgI2Rvd25sb2FkLCAuZ2F0ZWQnKS5maW5kKCdmb3JtJyk7XG5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHJlc3BvbnNlLCB0cnVlIF0pO1xuXG4gICAgICAgICAgICAgIHdpbmRvdy5kYXRhTGF5ZXIgPSB3aW5kb3cuZGF0YUxheWVyIHx8IFtdO1xuICAgICAgICAgICAgICB3aW5kb3cuZGF0YUxheWVyLnB1c2goe1xuICAgICAgICAgICAgICAgICdldmVudCc6ICdyZWdpc3RyYXRpb25Db21wbGV0ZSdcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgaWYgKChmcm0uY2xvc2VzdCgnI2Rvd25sb2FkJykubGVuZ3RoID4gMCkgfHwgKGZybS5jbG9zZXN0KCcuZ2F0ZWQnKS5sZW5ndGggPiAwKSkge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBtb2RhbCA9ICQoJy5yZWdpc3Rlci5iZWxvdy1yZWdpc3Rlci1mb3JtJykuZmluZCgnLm1vZGFsJyk7XG4gICAgICAgICAgICAgIHZhciBjYXRlZ29yeVNlbGVjdGlvbiA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcjZ2xiLXJlZ2lzdGVyLWNhdGVnb3JpZXMnKTtcbiAgICAgICAgICAgICAgaWYgKG1vZGFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCcudGhhbmtzLW5hbWUnKS50ZXh0KGRhdGEuZmlyc3RuYW1lKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCdidXR0b24nKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB2YXIgYmFja1VybCA9IGZybS5kYXRhKCdiYWNrJyk7XG4gICAgICAgICAgICAgICAgICBpZiAoJC50cmltKGJhY2tVcmwpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGJhY2tVcmw7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBtb2RhbC5tb2RhbCgnc2hvdycpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNhdGVnb3J5U2VsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnI2dsYi1yZWdpc3Rlci1zdGFydCcpLmhpZGUoKTtcblxuICAgICAgICAgICAgICAgIGNhdGVnb3J5U2VsZWN0aW9uLmZpbmQoJy5mb3Jtc19fdGl0bGUnKS50ZXh0KCdUaGFua3MgJyArIHJlc3BvbnNlLm5hbWUpO1xuICAgICAgICAgICAgICAgIGNhdGVnb3J5U2VsZWN0aW9uLnNob3coKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS5lcnJvci5pbmNsdWRlcygnRW1haWwgYWRkcmVzcyBhbHJlYWR5IGV4aXN0cycpKSB7XG4gICAgICAgICAgICAgICQoJzxsYWJlbCBpZD1cInJlZ2lzdGVyX19lbWFpbC1lcnJvclwiIGNsYXNzPVwiZXJyb3JcIiBmb3I9XCJyZWdpc3Rlcl9fZW1haWxcIj5UaGlzIGVtYWlsIGFkZHJlc3MgYWxyZWFkeSBleGlzdHM8L2xhYmVsPicpLmluc2VydEFmdGVyKGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fZW1haWwnKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byByZWdpc3Rlci5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHJlZ2lzdGVyLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB1bndhaXRDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHRyeUNhdGVnb3J5U2VsZWN0aW9uKCkge1xuICAgIHZhciBjYXRlZ29yaWVzID0gJyc7XG4gICAgdmFyIGNvbnRhaW5lciA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcjZ2xiLXJlZ2lzdGVyLWNhdGVnb3JpZXMgZm9ybScpO1xuICAgIGNvbnRhaW5lci5maW5kKCdpbnB1dDpjaGVja2VkJykuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgIGlmIChjYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2F0ZWdvcmllcyArPSAnLCc7XG4gICAgICB9XG4gICAgICBjYXRlZ29yaWVzICs9ICQoaXRlbSkudmFsKCk7XG4gICAgfSk7XG5cbiAgICBpZiAoY2F0ZWdvcmllcy5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgY29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuQXV0aFRva2VuJyk7XG4gICAgICBpZiAoY29va2llICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGNvb2tpZS5zcGxpdCgnfCcpO1xuICAgICAgICBpZiAoc3BsaXQubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVXBkYXRlQ2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogc3BsaXRbMF0sIHRva2VuOiBzcGxpdFsxXSwgY2F0czogY2F0ZWdvcmllcyB9LFxuICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgc3VjY2VzczogKHVwZGF0ZUNhdGVnb3JpZXNSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh1cGRhdGVDYXRlZ29yaWVzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGVDYXRlZ29yaWVzUmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyB1cGRhdGVDYXRlZ29yaWVzUmVzcG9uc2UsIHRydWUgXSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5nZXRQYXRoSG9tZSgpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICgxKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDIpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDMpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZWZyZXNoQ29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuUmVmcmVzaFRva2VuJyk7XG4gICAgICAgIGlmIChyZWZyZXNoQ29va2llICE9PSBudWxsKSB7XG4gICAgICAgICAgdmFyIHJlZnJlc2hTcGxpdCA9IHJlZnJlc2hDb29raWUuc3BsaXQoJ3wnKTtcbiAgICAgICAgICBpZiAocmVmcmVzaFNwbGl0Lmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcbiAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsUmVmcmVzaENoZWNrLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHJlZnJlc2hTcGxpdFswXSwgcmVmcmVzaF90b2tlbjogcmVmcmVzaFNwbGl0WzFdIH0sXG4gICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZWZyZXNoUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgcmVmcmVzaFJlc3BvbnNlLCB0cnVlIF0pO1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJ5Q2F0ZWdvcnlTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDQpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoNSkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoNikuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGxvZ2dlZEluKCkge1xuICAgIGlmICgkKCcucGFnZS1ib2R5LnJlZ2lzdGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9jb250ZW50L2RobC95b3VyLWFjY291bnQuaHRtbCc7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBSZWdpc3RlckZvcm0oKTtcbiIsImNsYXNzIFNlYXJjaEZvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5zZWFyY2gtZm9ybScsXG4gICAgICBjbGVhckJ1dHRvbjogJy5zZWFyY2gtZm9ybV9fY2xlYXItaWNvbicsXG4gICAgICBpbnB1dDogJy5zZWFyY2gtZm9ybV9fc2VhcmNoIGlucHV0W3R5cGU9c2VhcmNoXSdcbiAgICB9O1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbGVhclNlYXJjaEZvcm0gPSB0aGlzLmNsZWFyU2VhcmNoRm9ybS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNsZWFyQnV0dG9uLCAoKSA9PiB7XG4gICAgICB0aGlzLmNsZWFyU2VhcmNoRm9ybSgpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xlYXJTZWFyY2hGb3JtKCkge1xuICAgICQodGhpcy5zZWwuaW5wdXQpLnZhbCgnJykuZm9jdXMoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgU2VhcmNoRm9ybSgpO1xuIiwiY2xhc3MgU2VydmljZVdvcmtlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZGVmZXJyZWRQcm9tcHQgPSBudWxsO1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWdpc3RlciA9IHRoaXMucmVnaXN0ZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLmFkZFRvSG9tZVNjcmVlbiA9IHRoaXMuYWRkVG9Ib21lU2NyZWVuLmJpbmQodGhpcyk7XG4gIH1cblxuICByZWdpc3RlcigpIHtcbiAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignL2Rpc2NvdmVyL2V0Yy5jbGllbnRsaWJzL2RobC9jbGllbnRsaWJzL2NsaWVudGxpYi1zaXRlL3Jlc291cmNlcy9zdy5qcz92PWRpc2NvdmVyRGhsLTIwMjIxMTE1LTEnKS50aGVuKCgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTZXJ2aWNlV29ya2VyIHN1Y2Nlc2Z1bGx5IHJlZ2lzdGVyZWQnKTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkOiAnLCBlcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkVG9Ib21lU2NyZWVuKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmVpbnN0YWxscHJvbXB0JywgKGUpID0+IHtcbiAgICAgIC8vIFByZXZlbnQgQ2hyb21lIDY3IGFuZCBlYXJsaWVyIGZyb20gYXV0b21hdGljYWxseSBzaG93aW5nIHRoZSBwcm9tcHRcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIFN0YXNoIHRoZSBldmVudCBzbyBpdCBjYW4gYmUgdHJpZ2dlcmVkIGxhdGVyLlxuICAgICAgdGhpcy5kZWZlcnJlZFByb21wdCA9IGU7XG4gICAgICAvLyBDaGVjayBpZiBhbHJlYWR5IGRpc21pc3NlZFxuICAgICAgbGV0IGEyaHNDb29raWUgPSBDb29raWVzLmdldCgnYTJocycpO1xuICAgICAgLy8gSWYgdGhlIGNvb2tpZSBpcyBzZXQgdG8gaWdub3JlLCBpZ25vcmUgdGhlIHByb21wdFxuICAgICAgaWYgKGEyaHNDb29raWUgPT09ICdpZ25vcmUnKSByZXR1cm47XG4gICAgICAvLyBTaG93IHRoZSBhZGQgdG8gaG9tZSBzY3JlZW4gYmFubmVyXG4gICAgICAkKCcuYWRkVG9Ib21lU2NyZWVuJykuYWRkQ2xhc3MoJ2FkZFRvSG9tZVNjcmVlbi0tb3BlbicpO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5hZGRUb0hvbWVTY3JlZW5fX2N0YScsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyBTaG93IEEySFNcbiAgICAgIHRoaXMuZGVmZXJyZWRQcm9tcHQucHJvbXB0KCk7XG4gICAgICAvLyBXYWl0IGZvciB0aGUgdXNlciB0byByZXNwb25kIHRvIHRoZSBwcm9tcHRcbiAgICAgIHRoaXMuZGVmZXJyZWRQcm9tcHQudXNlckNob2ljZS50aGVuKChjaG9pY2VSZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKGNob2ljZVJlc3VsdC5vdXRjb21lID09PSAnYWNjZXB0ZWQnKSB7XG4gICAgICAgICAgLy8gSGlkZSB0aGUgYWRkIHRvIGhvbWUgc2NyZWVuIGJhbm5lclxuICAgICAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW4nKS5yZW1vdmVDbGFzcygnYWRkVG9Ib21lU2NyZWVuLS1vcGVuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2hhbmdlIGNvbnRlbnRcbiAgICAgICAgICAkKCcuYWRkVG9Ib21lU2NyZWVuX190aXRsZScpLnRleHQoJ1RoYXRcXCdzIGEgc2hhbWUsIG1heWJlIG5leHQgdGltZScpO1xuICAgICAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW5fX2N0YScpLnJlbW92ZSgpO1xuICAgICAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW5fX2xpbmsnKS50ZXh0KCdDbG9zZScpO1xuICAgICAgICAgIC8vIFNldCBpZ25vcmUgY29va2llXG4gICAgICAgICAgdGhpcy5jcmVhdGVBMmhzQ29va2llKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZWZlcnJlZFByb21wdCA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuYWRkVG9Ib21lU2NyZWVuX19saW5rJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIEhpZGUgdGhlIGFkZCB0byBob21lIHNjcmVlbiBiYW5uZXJcbiAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW4nKS5yZW1vdmVDbGFzcygnYWRkVG9Ib21lU2NyZWVuLS1vcGVuJyk7XG4gICAgICAvLyBDbGVhciB0aGUgcHJvbXB0XG4gICAgICB0aGlzLmRlZmVycmVkUHJvbXB0ID0gbnVsbDtcbiAgICAgIC8vIFNldCBpZ25vcmUgY29va2llXG4gICAgICB0aGlzLmNyZWF0ZUEyaHNDb29raWUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUEyaHNDb29raWUoKSB7XG4gICAgLy8gU2V0IGlnbm9yZSBjb29raWVcbiAgICBDb29raWVzLnNldCgnYTJocycsICdpZ25vcmUnLCB7ZXhwaXJlczogMTR9KTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCEoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikpIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLnJlZ2lzdGVyKCk7XG4gICAgLy8gdGhpcy5hZGRUb0hvbWVTY3JlZW4oKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgU2VydmljZVdvcmtlcigpO1xuIiwiY2xhc3MgU2hpcEZvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIC8vIFFTUCA9IHF1ZXJ5c3RyaW5nIHBhcmFtZXRlclxuICAgICAgY29tcG9uZW50OiAnLnNoaXAtbm93JyxcbiAgICAgIGZpcnN0bmFtZUlucHV0OiAnI2ZpcnN0bmFtZScsIC8vIGpxdWVyeSBzZWxlY3RvciBmb3IgaW5wdXQgKGNhbiBiZSBlZyAnLmZpcnN0bmFtZSBpbnB1dCcpXG4gICAgICBmaXJzdG5hbWVRU1A6ICc/Zmlyc3RuYW1lJywgLy8gbmVlZCA/IGZvbGxvd2VkIGJ5IHBhcmFtZXRlciBuYW1lXG4gICAgICBsYXN0bmFtZUlucHV0OiAnI2xhc3RuYW1lJyxcbiAgICAgIGxhc3RuYW1lUVNQOiAnP2xhc3RuYW1lJyxcbiAgICAgIGVtYWlsSW5wdXQ6ICcjZW1haWwnLFxuICAgICAgZW1haWxRU1A6ICc/ZW1haWwnLFxuICAgICAgdXNlckZpcnN0bmFtZUVsZW1lbnQ6ICcudXNlci1maXJzdG5hbWUnXG4gICAgfTtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucG9wdWxhdGVGb3JtID0gdGhpcy5wb3B1bGF0ZUZvcm0uYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3dMb2dnZWRJbkVsZW1lbnRzID0gdGhpcy5zaG93TG9nZ2VkSW5FbGVtZW50cy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICAkKHdpbmRvdykub24oJ3VzZXJsb2dnZWRpbi5ESEwnLCAoZXZ0LCB0b2tlbkRhdGEpID0+IHtcbiAgICAgIHRoaXMuc2hvd0xvZ2dlZEluRWxlbWVudHModG9rZW5EYXRhKTtcbiAgICB9KTtcblxuICAgIHRoaXMucG9wdWxhdGVGb3JtKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwb3B1bGF0ZUZvcm0oKSB7XG4gICAgbGV0IGVtYWlsID0gdXJsKHRoaXMuc2VsLmVtYWlsUVNQKTtcbiAgICBsZXQgZmlyc3RuYW1lID0gdXJsKHRoaXMuc2VsLmZpcnN0bmFtZVFTUCk7XG4gICAgbGV0IGxhc3RuYW1lID0gdXJsKHRoaXMuc2VsLmxhc3RuYW1lUVNQKTtcblxuICAgIGlmICh0eXBlb2YgZW1haWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAkKHRoaXMuc2VsLmVtYWlsSW5wdXQpLnZhbChlbWFpbCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBmaXJzdG5hbWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAkKHRoaXMuc2VsLmZpcnN0bmFtZUlucHV0KS52YWwoZmlyc3RuYW1lKTtcblxuICAgICAgaWYgKCQudHJpbShmaXJzdG5hbWUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJCh0aGlzLnNlbC51c2VyRmlyc3RuYW1lRWxlbWVudCkudGV4dChmaXJzdG5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbGFzdG5hbWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAkKHRoaXMuc2VsLmxhc3RuYW1lSW5wdXQpLnZhbChsYXN0bmFtZSk7XG4gICAgfVxuICB9XG5cbiAgc2hvd0xvZ2dlZEluRWxlbWVudHModG9rZW5EYXRhKSB7XG4gICAgbGV0IGZpcnN0bmFtZSA9IHVybCh0aGlzLnNlbC5maXJzdG5hbWVRU1ApO1xuXG4gICAgaWYgKCh0eXBlb2YgZmlyc3RuYW1lID09PSAndW5kZWZpbmVkJykgfHwgKCQudHJpbShmaXJzdG5hbWUpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgICQodGhpcy5zZWwudXNlckZpcnN0bmFtZUVsZW1lbnQpLnRleHQodG9rZW5EYXRhLm5hbWUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgU2hpcEZvcm0oKTtcbiIsImNsYXNzIFNoaXBOb3dGb3JtIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBmb3JtOiAnZm9ybS5mb3Jtcy5zaGlwLW5vdycsXG4gICAgICBjb3VudHJ5c2VsZWN0OiAnZm9ybS5mb3Jtcy5zaGlwLW5vdyAjc2hpcG5vd19jb3VudHJ5J1xuICAgIH07XG5cbiAgICB0aGlzLmdldFBhdGhQcmVmaXggPSB0aGlzLmdldFBhdGhQcmVmaXguYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRvZ2dsZUFkZHJlc3MgPSB0aGlzLnRvZ2dsZUFkZHJlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEZvcm0gPSB0aGlzLnN1Ym1pdEZvcm0uYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldEZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvd1N1Y2Nlc3MgPSB0aGlzLnNob3dTdWNjZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaG93RXJyb3IgPSB0aGlzLnNob3dFcnJvci5iaW5kKHRoaXMpO1xuICAgIHRoaXMudmFsaWRhdGUgPSB0aGlzLnZhbGlkYXRlLmJpbmQodGhpcyk7XG4gIH1cblxuICBnZXRQYXRoUHJlZml4KCkge1xuICAgIGNvbnN0IHByZWZpeCA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLXByZWZpeFxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjaGFuZ2UnLCB0aGlzLnNlbC5jb3VudHJ5c2VsZWN0LCB0aGlzLnRvZ2dsZUFkZHJlc3MpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdzdWJtaXQnLCB0aGlzLnNlbC5mb3JtLCB0aGlzLnN1Ym1pdEZvcm0pO1xuXG4gICAgY29uc3QgY291bnRyeSA9ICQodGhpcy5zZWwuZm9ybSkuZGF0YSgncHJlc2VsZWN0Y291bnRyeScpO1xuICAgIGlmICgoY291bnRyeSAhPT0gbnVsbCkgJiYgJC50cmltKGNvdW50cnkpLmxlbmd0aCA+IDApIHtcbiAgICAgICQodGhpcy5zZWwuY291bnRyeXNlbGVjdCkudmFsKGNvdW50cnkpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRob2QgdGhhdCB2YWxpZGF0ZXMgYWxsIHRoZSBmb3JtIGVsZW1lbnRzXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgYWxsIGVsZW1lbnRzIGhhdmUgYmVlbiB2YWxpZGF0ZWQgc3VjY2Vzc2Z1bGx5IG9yIGZhbHNlIGlmIG5vdFxuICAgKi9cbiAgdmFsaWRhdGUoKSB7XG4gICAgbGV0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdsYi1zaGlwbm93LWZvcm1cIik7XG4gICAgaWYoZm9ybSl7XG4gICAgICBsZXQgZm9ybUVsZW1lbnRzID0gZm9ybS5lbGVtZW50cztcblxuICAgICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdCA9IG5ldyBNYXAoKTtcbiAgICAgIGZvciAoY29uc3QgZm9ybUVsZW1lbnQgb2YgZm9ybUVsZW1lbnRzICl7XG4gICAgICAgIGxldCBuYW1lID0gZm9ybUVsZW1lbnQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKTtcbiAgICAgICAgdmFsaWRhdGlvblJlc3VsdC5zZXQobmFtZSx0aGlzLnZhbGlkYXRlRmllbGQoZm9ybUVsZW1lbnQpKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHZhbGlkYXRpb25SZXN1bHRWYWx1ZXMgPSBbLi4udmFsaWRhdGlvblJlc3VsdC52YWx1ZXMoKV07XG4gICAgICByZXR1cm4gdmFsaWRhdGlvblJlc3VsdFZhbHVlcy5pbmNsdWRlcyhmYWxzZSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFNpbXBsZSBtZXRob2QgdGhhdCB2YWxpZGF0ZXMgdGhlIHByb3ZpZGVkIGVsZW1lbnQgYWNjb3JkaW5nIHRvIGl0cyB0eXBlLCBjdXJyZW50bHkgaXQgcmVjb2duaXplcyB0aGVzZSB0eXBlczpcbiAgICogPGk+ZW1haWw8L2k+ICYgPGk+dGVsPC9pPjsgZXZlcnkgb3RoZXIgZmllbGQgdHlwZSBpcyB0cmVhdGVkIGFzIDxpPnRleHQ8L2k+LiBJZiB0aGUgZWxlbWVudCdzIHZhbHVlIGlzIGNvbnNpZGVyZWRcbiAgICogJ2ludmFsaWQnLFxuICAgKiA8Yj5lcnJvcjwvYj4gY2xhc3MgaXMgYWRkZWQsIG90aGVyd2lzZSA8Yj52YWxpZDwvYj4gaXMgYWRkZWRcbiAgICogQHBhcmFtIGVsZW1lbnRUb1ZhbGlkYXRlIERPTSBlbGVtZW50IHdlIHdhbnQgdG8gdmFsaWRhdGVcbiAgICogQHJldHVybiBib29sZWFuIHRydWUgb3IgZmFsc2UgZGVwZW5kaW5nIG9uIHRoZSB2YWxpZGF0aW9uIHJlc3VsdCBvZiBvbmUgc3BlY2lmaWMgZmllbGRcbiAgICovXG4gIHZhbGlkYXRlRmllbGQoZWxlbWVudFRvVmFsaWRhdGUpe1xuICAgIGxldCBmaWVsZFR5cGUgPSBlbGVtZW50VG9WYWxpZGF0ZS50eXBlO1xuICAgIGxldCBmaWVsZFZhbHVlID0gZWxlbWVudFRvVmFsaWRhdGUudmFsdWUudHJpbSgpO1xuXG4gICAgbGV0IHZhbGlkYXRpb25SZXN1bHQ7XG4gICAgc3dpdGNoIChmaWVsZFR5cGUpe1xuICAgICAgY2FzZSBcImVtYWlsXCI6XG4gICAgICAgIHZhbGlkYXRpb25SZXN1bHQgPSB0aGlzLnZhbGlkYXRlRW1haWxGaWVsZChmaWVsZFZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidGVsXCI6XG4gICAgICAgIHZhbGlkYXRpb25SZXN1bHQgPSB0aGlzLnZhbGlkYXRlUGhvbmVOdW1iZXIoZmllbGRWYWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFsaWRhdGlvblJlc3VsdCA9IHRoaXMudmFsaWRhdGVUZXh0RmllbGQoZmllbGRWYWx1ZSk7XG4gICAgfVxuXG5cbiAgICBpZighdmFsaWRhdGlvblJlc3VsdCl7XG4gICAgICB0aGlzLmZhaWxWYWxpZGF0aW9uKGVsZW1lbnRUb1ZhbGlkYXRlKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb21wbGV0ZVZhbGlkYXRpb24oZWxlbWVudFRvVmFsaWRhdGUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSB2YWxpZGF0aW9uIG9mIGluZGl2aWR1YWwgZm9ybSBmaWVsZCBhcyAnaW52YWxpZCcgYnkgYWRkaW5nIGEgQ1NTIGNsYXNzICdlcnJvcicgdG8gaXQuIDxiciAvPklmIHRoZVxuICAgKiBlbGVtZW50XG4gICAqIGFscmVhZHkgY29udGFpbnMgY3NzIGNsYXNzICd2YWxpZCcsIHdlIHJlcGxhY2UgaXQgd2l0aCBlcnJvci48YnIgLz4gSWYgdGhlIGVsZW1lbnQgZG9lcyBub3QgY29udGFpbiBhbnkgY2xhc3MsXG4gICAqIHdlIHNpbXBseSBhZGQgJ2Vycm9yJ1xuICAgKiBAcGFyYW0gZWxlbWVudCBpcyB0aGUgZWxlbWVudCB3ZSdyZSBhc3Nlc3NpbmdcbiAgICovXG4gIGZhaWxWYWxpZGF0aW9uKGVsZW1lbnQpe1xuICAgIHRoaXMubW9kaWZ5Q3NzQ2xhc3MoZWxlbWVudCxcImVycm9yXCIsXCJ2YWxpZFwiKTtcbiAgICBsZXQgbGFiZWxFbGVtZW50ID0gdGhpcy5nZXRMYWJlbChlbGVtZW50KTtcbiAgICBpZihsYWJlbEVsZW1lbnQgPT09IG51bGwpe1xuICAgICAgZWxlbWVudC5hZnRlcih0aGlzLmNyZWF0ZUVycm9yTGFiZWwoZWxlbWVudCkpO1xuICAgICAgbGFiZWxFbGVtZW50ID0gdGhpcy5nZXRMYWJlbChlbGVtZW50KTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVMYWJlbE1lc3NhZ2UoZWxlbWVudCxsYWJlbEVsZW1lbnQpO1xuICB9XG5cbiAgdXBkYXRlTGFiZWxNZXNzYWdlKHNvdXJjZUVsZW1lbnQsbGFiZWxFbGVtZW50KXtcbiAgICBsZXQgc291cmNlRWxlbWVudE1lc3NhZ2UgPSBzb3VyY2VFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbXNnXCIpO1xuICAgIGlmKHNvdXJjZUVsZW1lbnRNZXNzYWdlID09PSBudWxsKXtcbiAgICAgIHNvdXJjZUVsZW1lbnRNZXNzYWdlID0gXCJGaWVsZCBpcyBtYW5kYXRvcnlcIjtcbiAgICB9XG4gICAgaWYobGFiZWxFbGVtZW50ICE9PSBudWxsIHx8IHR5cGVvZiBsYWJlbEVsZW1lbnQgIT09ICd1bmRlZmluZWQnKXtcbiAgICAgIGxhYmVsRWxlbWVudC50ZXh0Q29udGVudCA9IHNvdXJjZUVsZW1lbnRNZXNzYWdlO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUVycm9yTGFiZWwoaW5wdXRFbGVtZW50KXtcbiAgICBsZXQgZWxlbWVudElkID0gaW5wdXRFbGVtZW50LmlkO1xuICAgIGxldCBlcnJvck1lc3NhZ2UgPSBpbnB1dEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1tc2dcIik7XG4gICAgaWYoIWVycm9yTWVzc2FnZSl7XG4gICAgICBlcnJvck1lc3NhZ2UgPSBcIlRoaXMgZmllbGQgaXMgbWFuZGF0b3J5IVwiO1xuICAgIH1cblxuICAgIGxldCBsYWJlbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgbGV0IGxhYmVsVGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShlcnJvck1lc3NhZ2UpO1xuICAgIGxhYmVsRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZXJyb3JcIik7XG4gICAgbGFiZWxFbGVtZW50LnNldEF0dHJpYnV0ZShcImZvclwiLGVsZW1lbnRJZCk7XG5cbiAgICBsYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQobGFiZWxUZXh0Tm9kZSk7XG4gICAgcmV0dXJuIGxhYmVsRWxlbWVudDtcbiAgfVxuXG4gIG1vZGlmeUNzc0NsYXNzKGVsZW1lbnQsIGNsYXNzVG9BZGQsIGNsYXNzVG9SZW1vdmUpe1xuICAgIGlmKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzVG9SZW1vdmUpKXtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlcGxhY2UoY2xhc3NUb1JlbW92ZSwgY2xhc3NUb0FkZCk7XG4gICAgfVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc1RvQWRkKTtcbiAgfVxuXG4gIHJlbW92ZUNzc0NsYXNzKGVsZW1lbnQsIGNsYXNzVG9SZW1vdmUpe1xuICAgIGlmKGVsZW1lbnQpe1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzVG9SZW1vdmUpO1xuICAgIH1cbiAgfVxuXG4gIGFkZENzc0NsYXNzKGVsZW1lbnQsY2xhc3NUb0FkZCl7XG4gICAgaWYoZWxlbWVudCl7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NUb0FkZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSB2YWxpZGF0aW9uIG9mIGluZGl2aWR1YWwgZm9ybSBmaWVsZCBhcyAndmFsaWQnIGJ5IGFkZGluZyBhIENTUyBjbGFzcyAndmFsaWQnIHRvIGl0LiA8YnIgLz5JZiB0aGVcbiAgICogZWxlbWVudFxuICAgKiBhbHJlYWR5IGNvbnRhaW5zIGNzcyBjbGFzcyAnZXJyb3InLCB3ZSByZXBsYWNlIGl0IHdpdGggdmFsaWQuPGJyIC8+IElmIHRoZSBlbGVtZW50IGRvZXMgbm90IGNvbnRhaW4gYW55IGNsYXNzLFxuICAgKiB3ZSBzaW1wbHkgYWRkICd2YWxpZCdcbiAgICogQHBhcmFtIGVsZW1lbnQgaXMgdGhlIGVsZW1lbnQgd2UncmUgYXNzZXNzaW5nXG4gICAqL1xuICBjb21wbGV0ZVZhbGlkYXRpb24oZWxlbWVudCl7XG4gICAgdGhpcy5tb2RpZnlDc3NDbGFzcyhlbGVtZW50LFwidmFsaWRcIixcImVycm9yXCIpO1xuICAgIGxldCBsYWJlbEVsZW1lbnQgPSB0aGlzLmdldExhYmVsKGVsZW1lbnQpO1xuICAgIGlmKGxhYmVsRWxlbWVudCAhPT0gbnVsbCl7XG4gICAgICBsYWJlbEVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0TGFiZWwoZm9ybUlucHV0RWxlbWVudCl7XG4gICAgbGV0IGxhYmVsRWxlbWVudCA9IGZvcm1JbnB1dEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgIGlmKGxhYmVsRWxlbWVudCl7XG4gICAgICBsZXQgdGFnID0gbGFiZWxFbGVtZW50LnRhZ05hbWU7XG4gICAgICBpZih0YWcudG9Mb2NhbGVMb3dlckNhc2UoKSA9PT0gXCJsYWJlbFwiKXtcbiAgICAgICAgcmV0dXJuIGxhYmVsRWxlbWVudDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgdGhlIHZhbGlkYXRpb24gb2YgaW5wdXQgdHlwZSAndGV4dCcgLSBpbiByZWFsaXR5IGl0ICdqdXN0JyBjaGVja3MgaWYgdGhlIHByb3ZpZGVkIHN0cmluZyBoYXNcbiAgICogYW55IHZhbHVlLi4uXG4gICAqIEBwYXJhbSBzdHJpbmdUb1ZhbGlkYXRlIGlzIGEge0Bjb2RlIFN0cmluZ30gdmFsdWUgd2Ugd2lzaCB0byB2YWxpZGF0ZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB3ZSB0aGluayB0aGUgcHJvdmlkZWQgc3RyaW5nIGlzIGEgdmFsaWQgb25lXG4gICAqL1xuICB2YWxpZGF0ZVRleHRGaWVsZChzdHJpbmdUb1ZhbGlkYXRlKXtcbiAgICByZXR1cm4gc3RyaW5nVG9WYWxpZGF0ZSAhPT0gbnVsbCAmJiBzdHJpbmdUb1ZhbGlkYXRlLmxlbmd0aCAhPT0gMDtcblxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIHZlcmlmeSBpZiB0aGUgcHJvdmlkZWQgc3RyaW5nIG1hdGNoZXMgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgZW1haWxcbiAgICogQHBhcmFtIGVtYWlsVG9WYWxpZGF0ZSBpcyB0aGUgc3RyaW5nIHdlIHdhbnQgdG8gdmFsaWRhdGVcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIHByb3ZpZGVkIHZhbHVlIG1hdGNoZXMgdGhlIGVtYWlsIHJlZ3VsYXIgZXhwcmVzc2lvbiBvciBmYWxzZSBpZiBub3RcbiAgICovXG4gIHZhbGlkYXRlRW1haWxGaWVsZChlbWFpbFRvVmFsaWRhdGUpe1xuICAgIGxldCBlbWFpbFJlZ2V4ID0gL15cXHcrKFsuLV0/XFx3KykqQFxcdysoWy4tXT9cXHcrKSooXFwuXFx3ezIsM30pKyQvO1xuICAgIHJldHVybiAhIWVtYWlsVG9WYWxpZGF0ZS5tYXRjaChlbWFpbFJlZ2V4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgdGhlIHByb3ZpZGVkIHN0cmluZyBhcyBwaG9uZSBudW1iZXJcbiAgICogQHBhcmFtIHBob25lVG9WYWxpZGF0ZSBpcyBhIFN0cmluZyB0byB2YWxpZGF0ZSAocGhvbmUgbnVtYmVyIGNhbiBjb250YWluIG90aGVyIGNoYXJhY3RlcnMgdGhhbiBqdXN0IGRpZ2l0c1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB2YWxpZGF0ZSBpcyBzdWNjZXNzZnVsLCBlbHNlIGl0IHJldHVybnMgZmFsc2VcbiAgICovXG4gIHZhbGlkYXRlUGhvbmVOdW1iZXIocGhvbmVUb1ZhbGlkYXRlKXtcbiAgICBsZXQgcGhvbmVSZWdleCA9IG5ldyBSZWdFeHAoXCIoKFxcXFwoXFxcXGR7Myw0fVxcXFwpKCApPyl8XFxcXGR7Myw0fSggKT8pP1stIC4vXT8oICk/XFxcXGR7Myw0fT8oICk/Wy0gLi9dPyggKT9cXFxcZHszLDR9PyggKT8kXCIpO1xuICAgIHJldHVybiBwaG9uZVJlZ2V4LnRlc3QocGhvbmVUb1ZhbGlkYXRlKVxuICB9XG5cbiAgdG9nZ2xlQWRkcmVzcyhfZSkge1xuICAgIGxldCB2YWwgPSAkKHRoaXMuc2VsLmNvdW50cnlzZWxlY3QpLnZhbCgpO1xuXG4gICAgbGV0IG9wdGlvbnMgPSAkKCdvcHRpb24nLCB0aGlzLnNlbC5jb3VudHJ5c2VsZWN0KTtcbiAgICBsZXQgbWFuZGF0b3J5ID0gdHJ1ZTtcbiAgICBvcHRpb25zLmVhY2goKF9pbmRleCwgaXRlbSkgPT4ge1xuICAgICAgaWYgKCQoaXRlbSkuYXR0cigndmFsdWUnKSA9PT0gdmFsICYmICgnJyArICQoaXRlbSkuZGF0YSgnbm9ubWFuZGF0b3J5JykpID09PSAndHJ1ZScpIHtcbiAgICAgICAgbWFuZGF0b3J5ID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobWFuZGF0b3J5KSB7XG4gICAgICAkKCcjc2hpcG5vd19hZGRyZXNzJywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdBZGRyZXNzKicpO1xuICAgICAgJCgnI3NoaXBub3dfemlwJywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdaSVAgb3IgUG9zdGNvZGUqJyk7XG4gICAgICAkKCcjc2hpcG5vd19jaXR5JywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdDaXR5KicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcjc2hpcG5vd19hZGRyZXNzJywgdGhpcy5zZWwuZm9ybSlcbiAgICAgICAgLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJylcbiAgICAgICAgLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0FkZHJlc3MnKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2Vycm9yJylcbiAgICAgICAgLmNsb3Nlc3QoJ2RpdicpXG4gICAgICAgIC5maW5kKCdsYWJlbCcpLnJlbW92ZSgpO1xuICAgICAgJCgnI3NoaXBub3dfemlwJywgdGhpcy5zZWwuZm9ybSlcbiAgICAgICAgLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJylcbiAgICAgICAgLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ1pJUCBvciBQb3N0Y29kZScpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnZXJyb3InKVxuICAgICAgICAuY2xvc2VzdCgnZGl2JylcbiAgICAgICAgLmZpbmQoJ2xhYmVsJylcbiAgICAgICAgLnJlbW92ZSgpO1xuICAgICAgJCgnI3NoaXBub3dfY2l0eScsIHRoaXMuc2VsLmZvcm0pXG4gICAgICAgIC5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpXG4gICAgICAgIC5hdHRyKCdwbGFjZWhvbGRlcicsICdDaXR5JylcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdlcnJvcicpXG4gICAgICAgIC5jbG9zZXN0KCdkaXYnKVxuICAgICAgICAuZmluZCgnbGFiZWwnKVxuICAgICAgICAucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgc3VibWl0Rm9ybShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCBjYW5TdWJtaXQgPSB0aGlzLnZhbGlkYXRlKCk7XG4gICAgaWYoY2FuU3VibWl0KXtcbiAgICAgIGxldCAkZm9ybSA9ICQoZS50YXJnZXQpO1xuICAgICAgbGV0IGZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YSgkZm9ybSk7XG4gICAgICAkLnBvc3QodGhpcy5nZXRQYXRoUHJlZml4KCkgKyAkZm9ybS5hdHRyKCdhY3Rpb24nKSwgZm9ybURhdGEsIChkYXRhKSA9PiB7XG4gICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ09LJykge1xuICAgICAgICAgIHRoaXMuc2hvd1N1Y2Nlc3MoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNob3dFcnJvcihkYXRhLmZpZWxkcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRGb3JtRGF0YSgkZm9ybSkge1xuICAgIGxldCB1bmluZGV4ZWRBcnJheSA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG4gICAgbGV0IGluZGV4ZWRBcnJheSA9IHt9O1xuICAgICQubWFwKHVuaW5kZXhlZEFycmF5LCAobikgPT4gKGluZGV4ZWRBcnJheVtuLm5hbWVdID0gbi52YWx1ZSkpO1xuXG4gICAgaW5kZXhlZEFycmF5LnNvdXJjZSA9ICQudHJpbSgkZm9ybS5kYXRhKCdzb3VyY2UnKSk7XG4gICAgaW5kZXhlZEFycmF5LmxvID0gJC50cmltKCRmb3JtLmRhdGEoJ2xvJykpO1xuXG4gICAgcmV0dXJuIGluZGV4ZWRBcnJheTtcbiAgfVxuXG4gIHNob3dTdWNjZXNzKCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbiA9ICQodGhpcy5zZWwuZm9ybSkuZGF0YSgndGhhbmtzJyk7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGdvIHRocm91Z2ggdGhlIGpzb24gcmVzcG9uc2UgYW5kIGRldGVjdCBpZiB0aGVyZSBpcyBhbnkgZXJyb3IgKGVycm9ycyBzaG91bGQgY29tZVxuICAgKiBhcyBhcnJheSlcbiAgICogQHBhcmFtIGVycm9yc1xuICAgKi9cbiAgc2hvd0Vycm9yKGVycm9ycykge1xuICAgIGlmKEFycmF5LmlzQXJyYXkoZXJyb3JzKSl7XG4gICAgICBmb3IgKGxldCBlcnJvciBvZiBlcnJvcnMpe1xuICAgICAgICBsZXQgdmFsaWRhdGlvbkVycm9yU3RyaW5nID0gZXJyb3IuZmllbGQ7XG4gICAgICAgIGxldCBlbGVtZW50SWQgPSBcInNoaXBub3dfXCIgKyB0aGlzLmdldEZpcnN0V29yZCh2YWxpZGF0aW9uRXJyb3JTdHJpbmcpO1xuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCk7XG4gICAgICAgIGlmKGVsZW1lbnQpe1xuICAgICAgICAgIHRoaXMuZmFpbFZhbGlkYXRpb24oZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRGaXJzdFdvcmQoc3RyaW50VG9TcGxpdCl7XG4gICAgcmV0dXJuIHN0cmludFRvU3BsaXQuc3BsaXQoXCIgXCIpWzBdO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5mb3JtKS5sZW5ndGggPD0gMCl7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMucmVnaXN0ZXJFdmVudExpc3RlbmVycygpO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmVnaXN0ZXJFdmVudExpc3RlbmVycygpe1xuICAgIGNvbnN0IGVsZW1lbnRzVG9WYWxpZGF0ZSA9IFtcbiAgICAgIFwic2hpcG5vd19maXJzdG5hbWVcIixcbiAgICAgIFwic2hpcG5vd19sYXN0bmFtZVwiLFxuICAgICAgXCJzaGlwbm93X2NvbXBhbnluYW1lXCIsXG4gICAgICBcInNoaXBub3dfcGhvbmVcIixcbiAgICAgIFwic2hpcG5vd19hZGRyZXNzXCIsXG4gICAgICBcInNoaXBub3dfemlwXCIsXG4gICAgICBcInNoaXBub3dfY2l0eVwiLFxuICAgICAgXCJzaGlwbm93X2VtYWlsXCJcbiAgICBdO1xuXG4gICAgZm9yIChjb25zdCBlbGVtZW50VG9WYWxpZGF0ZSBvZiBlbGVtZW50c1RvVmFsaWRhdGUpe1xuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50VG9WYWxpZGF0ZSk7XG4gICAgICBpZihlbGVtZW50KXtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy52YWxpZGF0ZUZpZWxkKGVsZW1lbnQpO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgU2hpcE5vd0Zvcm0oKTtcbiIsImNsYXNzIFNoaXBOb3dUd29TdGVwRm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZmlyc3RuYW1lID0gJyc7XG4gICAgdGhpcy5sYXN0bmFtZSA9ICcnO1xuICAgIHRoaXMuZW1haWwgPSAnJztcblxuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLy8gZmJBcHBJZDogJzEwMDA3NzMxNjMzMzc3OTgnLFxuICAgICAgZmJBcHBJZDogJzEwODAwMzEzMjg4MDEyMTEnLFxuICAgICAgLy8gZ29DbGllbnRJZDogJzkxMzk2MDM1MjIzNi11N3VuMGwyMnR2a21sYnBhNWJjbmYxdXFnNGNzaTdlMy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbScsXG4gICAgICBnb0NsaWVudElkOiAnMzEzNDY5ODM3NDIwLWw4ODJoMzlnZThuOG45cGI5N2xkdmprM2ZtOHBwcWdzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJ1xuICAgIH07XG5cbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5zaGlwTm93TXVsdGkud3lzaXd5ZywgLmFuaW1hdGVkRm9ybScsXG4gICAgICBzd2luZ2J1dHRvbjogJy5zaGlwTm93TXVsdGlfX2hlYWRjdGEtLXJlZCcsXG4gICAgICBmb3JtczogJ2Zvcm0uZm9ybXMuc2hpcC1ub3ctdHdvc3RlcCcsXG4gICAgICBmb3JtMTogJ2Zvcm0uZm9ybXMuZm9ybTEuc2hpcC1ub3ctdHdvc3RlcCcsXG4gICAgICBmb3JtMjogJ2Zvcm0uZm9ybXMuZm9ybTIuc2hpcC1ub3ctdHdvc3RlcCcsXG4gICAgICBjb3VudHJ5c2VsZWN0OiAnZm9ybS5mb3Jtcy5mb3JtMi5zaGlwLW5vdy10d29zdGVwICNzaGlwbm93X2NvdW50cnknLFxuXG4gICAgICBidXR0b25GYWNlYm9vazogJy5mb3Jtc19fY3RhLS1zb2NpYWwuZmFjZWJvb2snLFxuICAgICAgYnV0dG9uTGlua2VkaW46ICcuZm9ybXNfX2N0YS0tc29jaWFsLmxpbmtlZGluJyxcbiAgICAgIGJ1dHRvbkdvb2dsZVBsdXM6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmdvb2dsZSdcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnRvZ2dsZUFkZHJlc3MgPSB0aGlzLnRvZ2dsZUFkZHJlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEZhY2Vib29rID0gdGhpcy5zdWJtaXRGYWNlYm9vay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0TGlua2VkaW4gPSB0aGlzLnN1Ym1pdExpbmtlZGluLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRHb29nbGUgPSB0aGlzLnN1Ym1pdEdvb2dsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0Rm9ybTEgPSB0aGlzLnN1Ym1pdEZvcm0xLmJpbmQodGhpcyk7XG4gICAgdGhpcy5uZXh0Rm9ybSA9IHRoaXMubmV4dEZvcm0uYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEZvcm0yID0gdGhpcy5zdWJtaXRGb3JtMi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0Rm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaG93U3VjY2VzcyA9IHRoaXMuc2hvd1N1Y2Nlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0UGF0aFByZWZpeCgpIHtcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKGRvY3VtZW50KS5vbignc3VibWl0JywgdGhpcy5zZWwuZm9ybTEsIHRoaXMuc3VibWl0Rm9ybTEpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdzdWJtaXQnLCB0aGlzLnNlbC5mb3JtMiwgdGhpcy5zdWJtaXRGb3JtMik7XG4gICAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsIHRoaXMuc2VsLmNvdW50cnlzZWxlY3QsIHRoaXMudG9nZ2xlQWRkcmVzcyk7XG5cbiAgICB2YXIgY291bnRyeSA9ICQodGhpcy5zZWwuZm9ybTIpLmRhdGEoJ3ByZXNlbGVjdGNvdW50cnknKTtcbiAgICBpZiAoKGNvdW50cnkgIT09IG51bGwpICYmICQudHJpbShjb3VudHJ5KS5sZW5ndGggPiAwKSB7XG4gICAgICAkKHRoaXMuc2VsLmNvdW50cnlzZWxlY3QpLnZhbChjb3VudHJ5KS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9XG5cbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLmxlbmd0aCA+IDApIHtcbiAgICAgIHdpbmRvdy5mYkFzeW5jSW5pdCA9ICgpID0+IHtcbiAgICAgICAgd2luZG93LmZiX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5GQikgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5GQiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgd2luZG93LkZCLmluaXQoe1xuICAgICAgICAgICAgICBhcHBJZDogdGhpcy5jb25maWcuZmJBcHBJZCxcbiAgICAgICAgICAgICAgY29va2llOiB0cnVlLFxuICAgICAgICAgICAgICB4ZmJtbDogdHJ1ZSxcbiAgICAgICAgICAgICAgdmVyc2lvbjogJ3YyLjgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZmJfaW50ZXJ2YWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwKTtcbiAgICAgIH07XG5cbiAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmFjZWJvb2stanNzZGsnKSA9PT0gbnVsbCkge1xuICAgICAgICB2YXIgZmpzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgICAgICB2YXIganMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAganMuaWQgPSAnZmFjZWJvb2stanNzZGsnO1xuICAgICAgICBqcy5zcmMgPSAnLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9FTi9zZGsuanMnO1xuICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XG4gICAgICB9XG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xuICAgICAgICB0aGlzLnN1Ym1pdEZhY2Vib29rKGV2dCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikubGVuZ3RoID4gMCkge1xuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLm9uKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgdGhpcy5zdWJtaXRMaW5rZWRpbihldnQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgZ29vZ2xlQnV0dG9uID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cyk7XG4gICAgaWYgKGdvb2dsZUJ1dHRvbi5sZW5ndGggPiAwKSB7XG4gICAgICB3aW5kb3cuZ29faW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5nYXBpKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmdhcGkgIT09IG51bGwpIHtcbiAgICAgICAgICB3aW5kb3cuZ2FwaS5sb2FkKCdhdXRoMicsICgpID0+IHtcbiAgICAgICAgICAgIHZhciBhdXRoMiA9IHdpbmRvdy5nYXBpLmF1dGgyLmluaXQoe1xuICAgICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY29uZmlnLmdvQ2xpZW50SWQsXG4gICAgICAgICAgICAgIGNvb2tpZXBvbGljeTogJ3NpbmdsZV9ob3N0X29yaWdpbidcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGdvb2dsZUJ1dHRvbi5nZXQoMCk7XG4gICAgICAgICAgICBhdXRoMi5hdHRhY2hDbGlja0hhbmRsZXIoZWxlbWVudCwge30sXG4gICAgICAgICAgICAgIChnb29nbGVVc2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJtaXRHb29nbGUoZ29vZ2xlVXNlcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvciAhPT0gJ3BvcHVwX2Nsb3NlZF9ieV91c2VyJykge1xuICAgICAgICAgICAgICAgICAgYWxlcnQocmVzdWx0LmVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjbGVhckludGVydmFsKHdpbmRvdy5nb19pbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMCk7XG5cbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpLm9uKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnN3aW5nYnV0dG9uLCAoZXZ0KSA9PiB7XG4gICAgICB2YXIgaWQgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJyk7XG4gICAgICB2YXIgb2Zmc2V0ID0gJChpZCkub2Zmc2V0KCkudG9wO1xuICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICBzY3JvbGxUb3A6IG9mZnNldFxuICAgICAgfSwgMTAwMCwgJ3N3aW5nJyk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhbGlkYXRlKCkge1xuICAgICQodGhpcy5zZWwuZm9ybXMpLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XG4gICAgICAkKGl0ZW0pLnZhbGlkYXRlKHtcbiAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaXMoJ3NlbGVjdCcpKSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkuZmluZCgnLnNlbGVjdGJveGl0LWJ0bicpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IChsYWJlbCkgPT4ge1xuICAgICAgICAgIGxldCAkcGFyZW50ID0gJChsYWJlbCkucGFyZW50cygnZm9ybS5zaGlwLW5vdycpO1xuICAgICAgICAgIGlmICgkcGFyZW50LmZpbmQoJ3NlbGVjdCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLnNlbGVjdGJveGl0LWJ0bicpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICB0b2dnbGVBZGRyZXNzKGUpIHtcbiAgICB2YXIgdmFsID0gJCh0aGlzLnNlbC5jb3VudHJ5c2VsZWN0KS52YWwoKTtcblxuICAgIHZhciBvcHRpb25zID0gJCgnb3B0aW9uJywgdGhpcy5zZWwuY291bnRyeXNlbGVjdCk7XG4gICAgdmFyIG1hbmRhdG9yeSA9IHRydWU7XG4gICAgb3B0aW9ucy5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgaWYgKCQoaXRlbSkuYXR0cigndmFsdWUnKSA9PT0gdmFsICYmICgnJyArICQoaXRlbSkuZGF0YSgnbm9ubWFuZGF0b3J5JykpID09PSAndHJ1ZScpIHtcbiAgICAgICAgbWFuZGF0b3J5ID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobWFuZGF0b3J5KSB7XG4gICAgICAkKCcjc2hpcG5vd19hZGRyZXNzJywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdBZGRyZXNzKicpO1xuICAgICAgJCgnI3NoaXBub3dfemlwJywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdaSVAgb3IgUG9zdGNvZGUqJyk7XG4gICAgICAkKCcjc2hpcG5vd19jaXR5JywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdDaXR5KicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcjc2hpcG5vd19hZGRyZXNzJywgdGhpcy5zZWwuZm9ybSkucmVtb3ZlQXR0cigncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdBZGRyZXNzJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuY2xvc2VzdCgnZGl2JykuZmluZCgnbGFiZWwnKS5yZW1vdmUoKTtcbiAgICAgICQoJyNzaGlwbm93X3ppcCcsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnWklQIG9yIFBvc3Rjb2RlJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuY2xvc2VzdCgnZGl2JykuZmluZCgnbGFiZWwnKS5yZW1vdmUoKTtcbiAgICAgICQoJyNzaGlwbm93X2NpdHknLCB0aGlzLnNlbC5mb3JtKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0NpdHknKS5yZW1vdmVDbGFzcygnZXJyb3InKS5jbG9zZXN0KCdkaXYnKS5maW5kKCdsYWJlbCcpLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHN1Ym1pdEZhY2Vib29rKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgd2luZG93LkZCLmxvZ2luKChsb2dpblJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAobG9naW5SZXNwb25zZS5hdXRoUmVzcG9uc2UpIHtcbiAgICAgICAgd2luZG93LkZCLmFwaSgnL21lJywgKGRhdGFSZXNwb25zZSkgPT4ge1xuICAgICAgICAgIHRoaXMuZmlyc3RuYW1lID0gZGF0YVJlc3BvbnNlLmZpcnN0X25hbWU7XG4gICAgICAgICAgdGhpcy5sYXN0bmFtZSA9IGRhdGFSZXNwb25zZS5sYXN0X25hbWU7XG4gICAgICAgICAgdGhpcy5lbWFpbCA9IGRhdGFSZXNwb25zZS5lbWFpbDtcblxuICAgICAgICAgIHRoaXMubmV4dEZvcm0oKTtcbiAgICAgICAgfSwgeyBmaWVsZHM6IFsgJ2lkJywgJ2VtYWlsJywgJ2ZpcnN0X25hbWUnLCAnbGFzdF9uYW1lJyBdfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSwgeyBzY29wZTogJ2VtYWlsLHB1YmxpY19wcm9maWxlJywgcmV0dXJuX3Njb3BlczogdHJ1ZSB9KTtcbiAgfVxuXG4gIHN1Ym1pdExpbmtlZGluKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgSU4uVXNlci5hdXRob3JpemUoKCkgPT4ge1xuICAgICAgSU4uQVBJLlByb2ZpbGUoJ21lJykuZmllbGRzKCdpZCcsICdmaXJzdC1uYW1lJywgJ2xhc3QtbmFtZScsICdlbWFpbC1hZGRyZXNzJykucmVzdWx0KChyZXN1bHQpID0+IHtcbiAgICAgICAgdmFyIG1lbWJlciA9IHJlc3VsdC52YWx1ZXNbMF07XG5cbiAgICAgICAgdGhpcy5maXJzdG5hbWUgPSBtZW1iZXIuZmlyc3ROYW1lO1xuICAgICAgICB0aGlzLmxhc3RuYW1lID0gbWVtYmVyLmxhc3ROYW1lO1xuICAgICAgICB0aGlzLmVtYWlsID0gbWVtYmVyLmVtYWlsQWRkcmVzcztcblxuICAgICAgICB0aGlzLm5leHRGb3JtKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cuSU4uVXNlci5pc0F1dGhvcml6ZWQoKTtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgSU4uQVBJLlByb2ZpbGUoJ21lJykuZmllbGRzKCdpZCcsICdmaXJzdC1uYW1lJywgJ2xhc3QtbmFtZScsICdlbWFpbC1hZGRyZXNzJykucmVzdWx0KChyZXN1bHQpID0+IHtcbiAgICAgICAgICB2YXIgbWVtYmVyID0gcmVzdWx0LnZhbHVlc1swXTtcbiAgXG4gICAgICAgICAgdGhpcy5maXJzdG5hbWUgPSBtZW1iZXIuZmlyc3ROYW1lO1xuICAgICAgICAgIHRoaXMubGFzdG5hbWUgPSBtZW1iZXIubGFzdE5hbWU7XG4gICAgICAgICAgdGhpcy5lbWFpbCA9IG1lbWJlci5lbWFpbEFkZHJlc3M7XG4gIFxuICAgICAgICAgIHRoaXMubmV4dEZvcm0oKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdWJtaXRHb29nbGUoZ29vZ2xlVXNlcikge1xuICAgIHZhciBiYXNpY1Byb2ZpbGUgPSBnb29nbGVVc2VyLmdldEJhc2ljUHJvZmlsZSgpO1xuXG4gICAgdGhpcy5maXJzdG5hbWUgPSBiYXNpY1Byb2ZpbGUuZ2V0R2l2ZW5OYW1lKCk7XG4gICAgdGhpcy5sYXN0bmFtZSA9IGJhc2ljUHJvZmlsZS5nZXRGYW1pbHlOYW1lKCk7XG4gICAgdGhpcy5lbWFpbCA9IGJhc2ljUHJvZmlsZS5nZXRFbWFpbCgpO1xuXG4gICAgdGhpcy5uZXh0Rm9ybSgpO1xuICB9XG5cbiAgc3VibWl0Rm9ybTEoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgJGZvcm0gPSAkKGUudGFyZ2V0KTtcbiAgICBsZXQgZm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhKCRmb3JtKTtcblxuICAgIHRoaXMuZmlyc3RuYW1lID0gZm9ybURhdGEuZmlyc3RuYW1lO1xuICAgIHRoaXMubGFzdG5hbWUgPSBmb3JtRGF0YS5sYXN0bmFtZTtcbiAgICB0aGlzLmVtYWlsID0gZm9ybURhdGEuZW1haWw7XG5cbiAgICB0aGlzLm5leHRGb3JtKCk7XG4gIH1cblxuICBuZXh0Rm9ybSgpIHtcbiAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDEnLCB0aGlzLnNlbC5jb21wb25lbnQpLmhpZGUoKTtcbiAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDInLCB0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgc3VibWl0Rm9ybTIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgJGZvcm0gPSAkKGUudGFyZ2V0KTtcbiAgICBsZXQgZm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhKCRmb3JtKTtcbiAgICBmb3JtRGF0YS5maXJzdG5hbWUgPSB0aGlzLmZpcnN0bmFtZTtcbiAgICBmb3JtRGF0YS5sYXN0bmFtZSA9IHRoaXMubGFzdG5hbWU7XG4gICAgZm9ybURhdGEuZW1haWwgPSB0aGlzLmVtYWlsO1xuXG4gICAgJC5wb3N0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgJGZvcm0uYXR0cignYWN0aW9uJyksIGZvcm1EYXRhLCAoZGF0YSkgPT4ge1xuICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnT0snKSB7XG4gICAgICAgIHRoaXMuc2hvd1N1Y2Nlc3MoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZC4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldEZvcm1EYXRhKCRmb3JtKSB7XG4gICAgbGV0IHVuaW5kZXhlZEFycmF5ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbiAgICBsZXQgaW5kZXhlZEFycmF5ID0ge307XG4gICAgJC5tYXAodW5pbmRleGVkQXJyYXksIChuKSA9PiAoaW5kZXhlZEFycmF5W24ubmFtZV0gPSBuLnZhbHVlKSk7XG5cbiAgICBpbmRleGVkQXJyYXkuc291cmNlID0gJC50cmltKCRmb3JtLmRhdGEoJ3NvdXJjZScpKTtcbiAgICBpbmRleGVkQXJyYXkubG8gPSAkLnRyaW0oJGZvcm0uZGF0YSgnbG8nKSk7XG5cbiAgICByZXR1cm4gaW5kZXhlZEFycmF5O1xuICB9XG5cbiAgc2hvd1N1Y2Nlc3MoKSB7XG4gICAgdmFyIHRoYW5rcyA9ICQoJy5zaGlwTm93TXVsdGlfX2Zvcm1zdGVwLS1zdGVwMicsIHRoaXMuc2VsLmNvbXBvbmVudCkuZGF0YShcInRoYW5rc1wiKTtcbiAgICBpZiAoKHRoYW5rcyAhPT0gbnVsbCkgJiYgKHRoYW5rcy5sZW5ndGggPiAwKSkge1xuICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhhbmtzO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDInLCB0aGlzLnNlbC5jb21wb25lbnQpLmhpZGUoKTtcbiAgICAgICQoJy5zaGlwTm93TXVsdGlfX2Zvcm1zdGVwLS10aGFua3MnLCB0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcbiAgICB9XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFNoaXBOb3dUd29TdGVwRm9ybSgpO1xuIiwiY2xhc3MgU2hvd0hpZGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJ1tkYXRhLXNob3ctaGlkZS1pZF0nLFxuICAgICAgdG9nZ2xlOiAnW2RhdGEtc2hvdy1oaWRlLXRhcmdldF0nXG4gICAgfTtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnRvZ2dsZSwgKGUpID0+IHtcbiAgICAgIGNvbnN0IHNob3dIaWRlVGFyZ2V0ID0gJChlLnRhcmdldCkuYXR0cignZGF0YS1zaG93LWhpZGUtdGFyZ2V0Jyk7XG4gICAgICAkKCdbZGF0YS1zaG93LWhpZGUtaWQ9JyArIHNob3dIaWRlVGFyZ2V0ICsgJ10nKS5zbGlkZVRvZ2dsZSgpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTaG93SGlkZSgpO1xuIiwiY2xhc3MgU29jaWFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuc29jaWFsJ1xuICAgIH07XG5cbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNvbnRhaW5lclRvcCA9IHRoaXMuY29udGFpbmVyVG9wLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTY3JvbGwgPSB0aGlzLmhhbmRsZVNjcm9sbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2hlY2tTaGFyZVBvcyA9IHRoaXMuY2hlY2tTaGFyZVBvcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZGVib3VuY2UgPSB0aGlzLmRlYm91bmNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhhbmRsZVNjcm9sbCk7XG4gIH1cblxuICBjb250YWluZXJUb3AoKSB7XG4gICAgcmV0dXJuICQodGhpcy5zZWwuY29tcG9uZW50KS5wYXJlbnQoKS5wb3NpdGlvbigpLnRvcDtcbiAgfVxuXG4gIGhhbmRsZVNjcm9sbCgpIHtcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gOTkyKSB7XG4gICAgICBsZXQgaGVpZ2h0ID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgbGV0IGJvdHRvbSA9IHRoaXMuY29udGFpbmVyVG9wKCkgKyAkKHRoaXMuc2VsLmNvbXBvbmVudCkucGFyZW50KCkuaGVpZ2h0KCkgLSAkKHRoaXMuc2VsLmNvbXBvbmVudCkub3V0ZXJIZWlnaHQoKSAtIDYwO1xuICAgICAgaWYgKGhlaWdodCA+PSB0aGlzLmNvbnRhaW5lclRvcCgpICYmIGhlaWdodCA8IGJvdHRvbSAmJiAhJCh0aGlzLnNlbC5jb21wb25lbnQpLmhhc0NsYXNzKCdzb2NpYWwtLWFmZml4JykpIHtcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpXG4gICAgICAgICAgLmFkZENsYXNzKCdzb2NpYWwtLWFmZml4JylcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdsZWZ0JzogdGhpcy5nZXRMZWZ0T2Zmc2V0KCQodGhpcy5zZWwuY29tcG9uZW50KSksXG4gICAgICAgICAgICAndG9wJzogJydcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoaGVpZ2h0IDwgdGhpcy5jb250YWluZXJUb3AoKSAmJiAkKHRoaXMuc2VsLmNvbXBvbmVudCkuaGFzQ2xhc3MoJ3NvY2lhbC0tYWZmaXgnKSkge1xuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudClcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NvY2lhbC0tYWZmaXgnKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2xlZnQnOiAnJyxcbiAgICAgICAgICAgICd0b3AnOiAnJ1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChoZWlnaHQgPj0gYm90dG9tICYmICQodGhpcy5zZWwuY29tcG9uZW50KS5oYXNDbGFzcygnc29jaWFsLS1hZmZpeCcpKSB7XG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KVxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnc29jaWFsLS1hZmZpeCcpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnbGVmdCc6ICcnLFxuICAgICAgICAgICAgJ3RvcCc6IHRoaXMuZ2V0VG9wT2Zmc2V0KClcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRMZWZ0T2Zmc2V0KCRlbG0pIHtcbiAgICBsZXQgcGFyZW50T2Zmc2V0ID0gcGFyc2VJbnQoJGVsbS5wYXJlbnQoKS5vZmZzZXQoKS5sZWZ0LCAxMCk7XG4gICAgbGV0IG15T2Zmc2V0ID0gcGFyc2VJbnQoJGVsbS5vZmZzZXQoKS5sZWZ0LCAxMCk7XG4gICAgcmV0dXJuIChwYXJlbnRPZmZzZXQgKyBteU9mZnNldCk7XG4gIH1cblxuICBnZXRUb3BPZmZzZXQoKSB7XG4gICAgbGV0IHBhcmVudE9mZnNldCA9IHRoaXMuY29udGFpbmVyVG9wKCk7XG4gICAgbGV0IHNjcm9sbFBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICBsZXQgdG9wID0gc2Nyb2xsUG9zIC0gcGFyZW50T2Zmc2V0ICsgNTA7XG4gICAgcmV0dXJuIHRvcDtcbiAgfVxuXG4gIGNoZWNrU2hhcmVQb3MoKSB7XG4gICAgaWYgKCQoJy5zb2NpYWwtLXZlcnRpY2FsLnNvY2lhbC0tYWZmaXgnKS5sZW5ndGgpIHtcbiAgICAgICQoJy5zb2NpYWwtLXZlcnRpY2FsLnNvY2lhbC0tYWZmaXgnKS5yZW1vdmVBdHRyKCdzdHlsZScpLnJlbW92ZUNsYXNzKCdzb2NpYWwtLWFmZml4Jyk7XG4gICAgfVxuICB9XG5cbiAgLy8gRGVib3V0Y2UgZnVuY3Rpb25cbiAgZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQ7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICB9O1xuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuZGVib3VuY2UodGhpcy5jaGVja1NoYXJlUG9zLCAxMDApKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgU29jaWFsKCk7XG4iLCJjbGFzcyBTdWJzY3JpYmVQYW5lbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLnN1YnNjcmliZVBhbmVsJyxcbiAgICAgIGZvcm06ICcuc3Vic2NyaWJlUGFuZWxfX2Zvcm0nLFxuICAgICAgc3VjY2Vzc092ZXJsYXk6ICcuc3Vic2NyaWJlUGFuZWxfX3Jlc3BvbnNlT3ZlcmxheS5zdWNjZXNzJyxcbiAgICAgIGVycm9yT3ZlcmxheTogJy5zdWJzY3JpYmVQYW5lbF9fcmVzcG9uc2VPdmVybGF5LmVycm9yJ1xuICAgIH07XG5cbiAgICB0aGlzLmdldFBhdGhQcmVmaXggPSB0aGlzLmdldFBhdGhQcmVmaXguYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEZvcm0gPSB0aGlzLnN1Ym1pdEZvcm0uYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldEZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvd1N1Y2Nlc3MgPSB0aGlzLnNob3dTdWNjZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaG93RXJyb3IgPSB0aGlzLnNob3dFcnJvci5iaW5kKHRoaXMpO1xuICAgIHRoaXMudmFsaWRhdGUgPSB0aGlzLnZhbGlkYXRlLmJpbmQodGhpcyk7XG4gIH1cblxuICBnZXRQYXRoUHJlZml4KCkge1xuICAgIGNvbnN0IHByZWZpeCA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLXByZWZpeFxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdzdWJtaXQnLCB0aGlzLnNlbC5mb3JtLCB0aGlzLnN1Ym1pdEZvcm0pO1xuICB9XG5cbiAgdmFsaWRhdGUoKSB7XG4gICAgJCh0aGlzLnNlbC5mb3JtKS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgJChpdGVtKS52YWxpZGF0ZSh7XG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmlzKCdzZWxlY3QnKSkge1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudC5wYXJlbnQoKSk7XG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLmZpbmQoJy5zZWxlY3Rib3hpdC1idG4nKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiAobGFiZWwpID0+IHtcbiAgICAgICAgICBsZXQgJHBhcmVudCA9ICQobGFiZWwpLnBhcmVudHMoJy5zdWJzY3JpYmVfX2Zvcm1GaWVsZCcpO1xuICAgICAgICAgIGlmICgkcGFyZW50LmZpbmQoJ3NlbGVjdCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLnNlbGVjdGJveGl0LWJ0bicpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzdWJtaXRGb3JtKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0ICRmb3JtID0gJChlLnRhcmdldCk7XG4gICAgbGV0IGZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YSgkZm9ybSk7XG4gICAgJC5wb3N0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgJGZvcm0uYXR0cignYWN0aW9uJyksIGZvcm1EYXRhLCAoZGF0YSkgPT4ge1xuICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnT0snKSB7XG4gICAgICAgIHRoaXMuc2hvd1N1Y2Nlc3MoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2hvd0Vycm9yKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRGb3JtRGF0YSgkZm9ybSkge1xuICAgIGxldCB1bmluZGV4ZWRBcnJheSA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG4gICAgbGV0IGluZGV4ZWRBcnJheSA9IHt9O1xuICAgICQubWFwKHVuaW5kZXhlZEFycmF5LCAobikgPT4gKGluZGV4ZWRBcnJheVtuLm5hbWVdID0gbi52YWx1ZSkpO1xuICAgIHJldHVybiBpbmRleGVkQXJyYXk7XG4gIH1cblxuICBzaG93U3VjY2VzcygpIHtcbiAgICAkKHRoaXMuc2VsLnN1Y2Nlc3NPdmVybGF5KS5hZGRDbGFzcygnc3Vic2NyaWJlUGFuZWxfX3Jlc3BvbnNlT3ZlcmxheS0tc2hvdycpO1xuICB9XG5cbiAgc2hvd0Vycm9yKCkge1xuICAgICQodGhpcy5zZWwuZXJyb3JPdmVybGF5KS5hZGRDbGFzcygnc3Vic2NyaWJlUGFuZWxfX3Jlc3BvbnNlT3ZlcmxheS0tc2hvdycpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTdWJzY3JpYmVQYW5lbCgpO1xuIiwiY2xhc3MgVG9hc3Qge1xuICBjb25zdHJ1Y3Rvcih0ZXh0LCBkdXJhdGlvbikge1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgdGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgIHRoaXMuaWQgPSAnXycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgOSk7XG5cbiAgICB0aGlzLnNldFRleHQgPSB0aGlzLnNldFRleHQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNldER1cmF0aW9uID0gdGhpcy5zZXREdXJhdGlvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvdyA9IHRoaXMuc2hvdy5iaW5kKHRoaXMpO1xuXG4gICAgbGV0IHRvYXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdG9hc3Quc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQpO1xuICAgIHRvYXN0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndG9hc3QnKTtcbiAgICBsZXQgaW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBpbm5lci5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2lubmVyJyk7XG4gICAgaW5uZXIuaW5uZXJUZXh0ID0gdGhpcy50ZXh0O1xuICAgIHRvYXN0LmFwcGVuZENoaWxkKGlubmVyKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvYXN0KTtcbiAgICB0aGlzLiR0b2FzdCA9ICQoJyMnICsgdGhpcy5pZCk7XG4gIH1cblxuICBzZXRUZXh0KHRleHQpIHtcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIHRoaXMuJHRvYXN0LmZpbmQoJy5pbm5lcicpLnRleHQodGhpcy50ZXh0KTtcbiAgfVxuXG4gIHNldER1cmF0aW9uKGR1cmF0aW9uKSB7XG4gICAgdGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICB9XG5cbiAgc2hvdygpIHtcbiAgICB0aGlzLiR0b2FzdC5hZGRDbGFzcygnc2hvdycpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLiR0b2FzdC5yZW1vdmVDbGFzcygnc2hvdycpO1xuICAgIH0sIHRoaXMuZHVyYXRpb24pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRvYXN0O1xuIiwiY2xhc3MgTG9naW5Gb3JtIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICB1cmxUb2tlbjogJy9saWJzL2dyYW5pdGUvY3NyZi90b2tlbi5qc29uJyxcbiAgICAgIHVybFJlZnJlc2hDaGVjazogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZWZyZXNoX3Rva2VuL2luZGV4Lmpzb24nLFxuICAgICAgdXJsR2V0QWxsRGV0YWlsczogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9nZXRkZXRhaWxzL2luZGV4Lmpzb24nLFxuICAgICAgdXJsVXBkYXRlRGV0YWlsczogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS91cGRhdGVfZGV0YWlscy9pbmRleC5qc29uJ1xuICAgIH07XG5cbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5zdGFuZGFyZENvbnRlbnQudXNlci1hY2NvdW50LCAucGFnZS1ib2R5LnVzZXItYWNjb3VudCdcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRQYXRoSG9tZSA9IHRoaXMuZ2V0UGF0aEhvbWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlYWRDb29raWUgPSB0aGlzLnJlYWRDb29raWUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMudHJ5VXBkYXRlRGV0YWlscyA9IHRoaXMudHJ5VXBkYXRlRGV0YWlscy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY29tcGxldGVVcGRhdGVEZXRhaWxzID0gdGhpcy5jb21wbGV0ZVVwZGF0ZURldGFpbHMuYmluZCh0aGlzKTtcblxuICAgIHRoaXMubG9nZ2VkSW4gPSB0aGlzLmxvZ2dlZEluLmJpbmQodGhpcyk7XG4gICAgdGhpcy5ub3RMb2dnZWRJbiA9IHRoaXMubm90TG9nZ2VkSW4uYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldFBhdGhQcmVmaXgoKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcbiAgfVxuXG4gIGdldFBhdGhIb21lKCkge1xuICAgIGNvbnN0IGhvbWUgPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1ob21lXFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKGhvbWUgPyBob21lIDogJycpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQod2luZG93KS5vbigndXNlcmxvZ2dlZGluLkRITCcsIChldnQsIHRva2VuRGF0YSkgPT4ge1xuICAgICAgdGhpcy5sb2dnZWRJbih0b2tlbkRhdGEpO1xuICAgIH0pO1xuICAgICQod2luZG93KS5vbigndXNlcm5vdGxvZ2dlZGluLkRITCcsICgpID0+IHtcbiAgICAgIHRoaXMubm90TG9nZ2VkSW4oKTtcbiAgICB9KTtcblxuICAgIHZhciBmb3JtID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJ2Zvcm0nKTtcbiAgICBpZiAoZm9ybS5sZW5ndGggPiAwKSB7XG4gICAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnbXlBY2NvdW50Q3VycmVudFBhc3N3b3JkJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XG4gICAgICAgIHZhciAkcGFyZW50ID0gJChlbGVtZW50KS5wYXJlbnRzKCdmb3JtJyk7XG4gICAgICAgIHZhciAkY3VycmVudFBhc3N3b3JkQ29udGFpbmVyID0gJHBhcmVudC5maW5kKCcudXNlcmFjY291bnQtY3VycmVudHBhc3N3b3JkJyk7XG4gICAgICAgIHZhciAkbmV3UGFzc3dvcmQgPSAkcGFyZW50LmZpbmQoJ2lucHV0W25hbWU9XCJteUFjY291bnRfX25ld1Bhc3N3b3JkXCJdJyk7XG4gICAgICAgIHZhciAkY29uZmlybVBhc3N3b3JkID0gJHBhcmVudC5maW5kKCdpbnB1dFtuYW1lPVwibXlBY2NvdW50X19jb25maXJtUGFzc3dvcmRcIl0nKTtcblxuICAgICAgICByZXR1cm4gKCgkbmV3UGFzc3dvcmQudmFsKCkgPT09ICcnICYmICRjb25maXJtUGFzc3dvcmQudmFsKCkgPT09ICcnKSB8fCAoJGN1cnJlbnRQYXNzd29yZENvbnRhaW5lci5pcygnOnZpc2libGUnKSAmJiAkKGVsZW1lbnQpLnZhbCgpICE9PSAnJykpO1xuICAgICAgfSwgJ1lvdSBtdXN0IGVudGVyIHlvdXIgY3VycmVudCBwYXNzd29yZCcpO1xuXG4gICAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnbXlBY2NvdW50UGFzc3dvcmQnLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgaWYgKCQoZWxlbWVudCkudmFsKCkgPT09ICcnKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoL14oPz0uKlthLXpdKSg/PS4qW0EtWl0pKD89LipcXGQpKD89LipbX1xcV10pW0EtWmEtelxcZF9cXFddezgsfSQvKS50ZXN0KHZhbHVlKTtcbiAgICAgIH0sICdQYXNzd29yZCBmb3JtYXQgaXMgbm90IHZhbGlkJyk7XG5cbiAgICAgIGpRdWVyeS52YWxpZGF0b3IuYWRkTWV0aG9kKCdteUFjY291bnRFcXVhbFRvJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XG4gICAgICAgIHJldHVybiAoJCgnIycgKyAkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtZXF1YWxUbycpKS52YWwoKSA9PT0gJChlbGVtZW50KS52YWwoKSk7XG4gICAgICB9LCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpO1xuXG4gICAgICBmb3JtLnZhbGlkYXRlKHtcbiAgICAgICAgcnVsZXM6IHtcbiAgICAgICAgICBteUFjY291bnRfX2N1cnJlbnRQYXNzd29yZDogJ215QWNjb3VudEN1cnJlbnRQYXNzd29yZCcsXG4gICAgICAgICAgbXlBY2NvdW50X19uZXdQYXNzd29yZDogJ215QWNjb3VudFBhc3N3b3JkJyxcbiAgICAgICAgICBteUFjY291bnRfX2NvbmZpcm1QYXNzd29yZDogJ215QWNjb3VudEVxdWFsVG8nXG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN1Ym1pdEhhbmRsZXI6IChmb3JtRWxlbWVudCkgPT4ge1xuICAgICAgICAgIHRoaXMudHJ5VXBkYXRlRGV0YWlscyhmb3JtRWxlbWVudCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZWFkQ29va2llKG5hbWUpIHtcbiAgICB2YXIgbmFtZUVRID0gbmFtZSArICc9JztcbiAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgYyA9IGNhW2ldO1xuICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XG4gICAgICBpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB0cnlVcGRhdGVEZXRhaWxzKGZvcm0pIHtcbiAgICB2YXIgZnJtID0gJChmb3JtKTtcbiAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG5cbiAgICB2YXIgY29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuQXV0aFRva2VuJyk7XG4gICAgaWYgKGNvb2tpZSAhPT0gbnVsbCkge1xuICAgICAgdmFyIHNwbGl0ID0gY29va2llLnNwbGl0KCd8Jyk7XG4gICAgICBpZiAoc3BsaXQubGVuZ3RoID49IDIpIHtcbiAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcbiAgICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcbiAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybEdldEFsbERldGFpbHMsXG4gICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiBzcGxpdFswXSwgdG9rZW46IHNwbGl0WzFdIH0sXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgc3VjY2VzczogKGFsbERldGFpbHNSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyBhbGxEZXRhaWxzUmVzcG9uc2UsIHRydWUgXSk7XG4gICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZXRlVXBkYXRlRGV0YWlscyhmb3JtLCBhbGxEZXRhaWxzUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDEpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoMikuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoMykuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHJlZnJlc2hDb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nKTtcbiAgICAgIGlmIChyZWZyZXNoQ29va2llICE9PSBudWxsKSB7XG4gICAgICAgIHZhciByZWZyZXNoU3BsaXQgPSByZWZyZXNoQ29va2llLnNwbGl0KCd8Jyk7XG4gICAgICAgIGlmIChyZWZyZXNoU3BsaXQubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsUmVmcmVzaENoZWNrLFxuICAgICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiByZWZyZXNoU3BsaXRbMF0sIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hTcGxpdFsxXSB9LFxuICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgc3VjY2VzczogKHJlZnJlc2hSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoUmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyByZWZyZXNoUmVzcG9uc2UsIHRydWUgXSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJ5VXBkYXRlRGV0YWlscyhmb3JtKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoNCkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICg1KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICg2KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlVXBkYXRlRGV0YWlscyhmb3JtLCBkZXRhaWxzKSB7XG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XG5cbiAgICB2YXIgbmV3ZW1haWwgPSBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19lbWFpbCcpLnZhbCgpO1xuICAgIGlmIChuZXdlbWFpbC50cmltKCkgPT09IGRldGFpbHMucmVnaXN0cmF0aW9uX2VtYWlsKSB7XG4gICAgICBuZXdlbWFpbCA9ICcnO1xuICAgIH1cblxuICAgIHZhciBjYXRlZ29yaWVzID0gJyc7XG4gICAgZnJtLmZpbmQoJyNnbGIteW91cmFjY291bnQtY2F0ZWdvcmllcyBpbnB1dDpjaGVja2VkJykuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgIGlmIChjYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2F0ZWdvcmllcyArPSAnLCc7XG4gICAgICB9XG4gICAgICBjYXRlZ29yaWVzICs9ICQoaXRlbSkudmFsKCk7XG4gICAgfSk7XG5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIHRva2VuOiBkZXRhaWxzLnRva2VuLFxuXG4gICAgICBmaXJzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2ZpcnN0TmFtZScpLnZhbCgpLFxuICAgICAgbGFzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2xhc3ROYW1lJykudmFsKCksXG4gICAgICB1c2VybmFtZTogZGV0YWlscy5yZWdpc3RyYXRpb25fZW1haWwsXG4gICAgICBuZXd1c2VybmFtZTogbmV3ZW1haWwsXG5cbiAgICAgIHBhc3N3b3JkOiBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19jdXJyZW50UGFzc3dvcmQnKS52YWwoKSxcbiAgICAgIG5ld3Bhc3N3b3JkOiBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19uZXdQYXNzd29yZCcpLnZhbCgpLFxuXG4gICAgICBwb3NpdGlvbjogZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fcG9zaXRpb24nKS52YWwoKSxcbiAgICAgIGNvbnRhY3Q6IGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX3Bob25lTnVtYmVyJykudmFsKCksXG4gICAgICBzaXplOiBmcm0uZmluZCgnc2VsZWN0I215QWNjb3VudF9fYnVzaW5lc3NTaXplJykudmFsKCksXG4gICAgICBzZWN0b3I6IGZybS5maW5kKCdzZWxlY3QjbXlBY2NvdW50X19idXNpbmVzc1NlY3RvcicpLnZhbCgpLFxuXG4gICAgICB0Y2FncmVlOiBmcm0uZmluZCgnaW5wdXQjY2hlY2tib3hJZFRDTWVzc2FnZScpLmlzKCc6Y2hlY2tlZCcpLFxuXG4gICAgICBjYXRzOiBjYXRlZ29yaWVzXG4gICAgfTtcblxuICAgIGlmICgoJC50cmltKGRhdGEuZmlyc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS5sYXN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEudXNlcm5hbWUpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgeW91ciBuYW1lLCBlbWFpbCBhZGRyZXNzIGFuZCBwZXJzb25hbCBkZXRhaWxzLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXS51cGRhdGUtYnRuXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xuXG4gICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xuICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVXBkYXRlRGV0YWlscyxcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXG4gICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICBzdWNjZXNzOiAodXBkYXRlRGV0YWlsc1Jlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAodXBkYXRlRGV0YWlsc1Jlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyB1cGRhdGVEZXRhaWxzUmVzcG9uc2UsIHRydWUgXSk7XG5cbiAgICAgICAgICAgICAgaWYgKHVwZGF0ZURldGFpbHNSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICBmcm0uZmluZCgnLm15QWNjb3VudF9fbWVzc2FnZScpLnNob3coKTtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhLm5ld3Bhc3N3b3JkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgIGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2VtYWlsJykucmVtb3ZlQXR0cigncmVhZG9ubHknKTtcbiAgICAgICAgICAgICAgICAgIGZybS5maW5kKCcudXNlcmFjY291bnQtY3VycmVudHBhc3N3b3JkJykuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19jdXJyZW50UGFzc3dvcmQnKS52YWwoJycpO1xuICAgICAgICAgICAgICAgIGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX25ld1Bhc3N3b3JkJykudmFsKCcnKTtcbiAgICAgICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19jb25maXJtUGFzc3dvcmQnKS52YWwoJycpO1xuXG4gICAgICAgICAgICAgICAgJCgnaGVhZGVyIC5oZWFkZXJfX2F1dGgtLWxvZ2dlZGluIC51c2VyLWZpcnN0bmFtZScpLnRleHQoZGF0YS5maXJzdG5hbWUpO1xuICAgICAgICAgICAgICAgICQoJy5jb21wZXRpdGlvbkRhdGFDYXB0dXJlLmxvZ2dlZC1pbiAubG9nZ2VkaW4tbmFtZScpLnRleHQoZGF0YS5maXJzdG5hbWUpO1xuICAgICAgICAgICAgICAgICQod2luZG93KS5zY3JvbGxUb3AoMCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscy5cXG4nICsgdXBkYXRlRGV0YWlsc1Jlc3BvbnNlLmVycm9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXS51cGRhdGUtYnRuXCIpLnRleHQoJ1VwZGF0ZScpO1xuICAgICAgICAgICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgnVXBkYXRlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddLnVwZGF0ZS1idG5cIikudGV4dCgnVXBkYXRlJyk7XG4gICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgnVXBkYXRlJyk7XG4gIH1cblxuICBsb2dnZWRJbih0b2tlbkRhdGEpIHtcbiAgICBpZiAodG9rZW5EYXRhICYmIHRva2VuRGF0YS5zdGF0dXMgJiYgdG9rZW5EYXRhLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsR2V0QWxsRGV0YWlscyxcbiAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiB0b2tlbkRhdGEudXNlcm5hbWUsIHRva2VuOiB0b2tlbkRhdGEudG9rZW4gfSxcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgc3VjY2VzczogKGFsbERldGFpbHNSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZSkge1xuICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnRGb3JtID0gJCh0aGlzLnNlbC5jb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyBhbGxEZXRhaWxzUmVzcG9uc2UsIHRydWUgXSk7XG5cbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJy5sb2dnZWRpbi11c2VybmFtZScpLnRleHQoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9maXJzdG5hbWUpO1xuXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2ZpcnN0TmFtZScpLnZhbChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX2ZpcnN0bmFtZSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2xhc3ROYW1lJykudmFsKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fbGFzdG5hbWUpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19lbWFpbCcpLnZhbChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX2VtYWlsKTtcblxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19wb3NpdGlvbicpLnZhbChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX3Bvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fcGhvbmVOdW1iZXInKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9jb250YWN0KTtcblxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnc2VsZWN0I215QWNjb3VudF9fYnVzaW5lc3NTaXplJykudmFsKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fc2l6ZSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdzZWxlY3QjbXlBY2NvdW50X19idXNpbmVzc1NlY3RvcicpLnZhbChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX3NlY3Rvcik7XG5cbiAgICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl90Y2FncmVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnaW5wdXQjY2hlY2tib3hJZFRDTWVzc2FnZScpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNjaGVja2JveElkVENNZXNzYWdlJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJyNnbGIteW91cmFjY291bnQtY2F0ZWdvcmllcyBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHZhciBjYXRlZ29yaWVzID0gYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9jYXRzLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXRlZ29yaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJyNnbGIteW91cmFjY291bnQtY2F0ZWdvcmllcyBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl1bdmFsdWU9XCInICsgY2F0ZWdvcmllc1tpXSArICdcIl0nKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25faXNsaW5rZWRpbiA9PT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZS5mdWxsICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJy51c2VyYWNjb3VudC1jdXJyZW50cGFzc3dvcmQnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19lbWFpbCcpLmF0dHIoJ3JlYWRvbmx5JywgJ3JlYWRvbmx5Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5jbG9zZXN0KCcucGFnZS1ib2R5LXdyYXBwZXInKS5yZW1vdmVDbGFzcygnYXdhaXRpbmcnKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLnNob3coKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRpc3BsYXkgeW91ciBkZXRhaWxzLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZGlzcGxheSB5b3VyIGRldGFpbHMuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbm90TG9nZ2VkSW4oKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5oYXNDbGFzcygnbm8tcmVkaXJlY3QnKSkge1xuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmdldFBhdGhIb21lKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBMb2dpbkZvcm0oKTtcblxuIiwiLy8gSW1wb3J0IGNvbXBvbmVudHNcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi9Db21wb25lbnRzL0hlYWRlcic7XG5pbXBvcnQgQm9vdHN0cmFwQ2Fyb3VzZWwgZnJvbSAnLi9Db21wb25lbnRzL0Jvb3RzdHJhcENhcm91c2VsJztcbmltcG9ydCBBcnRpY2xlR3JpZCBmcm9tICcuL0NvbXBvbmVudHMvQXJ0aWNsZUdyaWQnO1xuaW1wb3J0IFN1YnNjcmliZVBhbmVsIGZyb20gJy4vQ29tcG9uZW50cy9TdWJzY3JpYmVQYW5lbCc7XG5pbXBvcnQgUGFzc3dvcmQgZnJvbSAnLi9Db21wb25lbnRzL1Bhc3N3b3JkJztcbmltcG9ydCBQYXNzd29yZFZhbGlkaXR5IGZyb20gJy4vQ29tcG9uZW50cy9QYXNzd29yZFZhbGlkaXR5JztcbmltcG9ydCBGb3JtVmFsaWRhdGlvbiBmcm9tICcuL0NvbXBvbmVudHMvRm9ybVZhbGlkYXRpb24nO1xuaW1wb3J0IFNob3dIaWRlIGZyb20gJy4vQ29tcG9uZW50cy9TaG93SGlkZSc7XG5pbXBvcnQgQ29va2llQmFubmVyIGZyb20gJy4vQ29tcG9uZW50cy9Db29raWVCYW5uZXInO1xuaW1wb3J0IFNlYXJjaEZvcm0gZnJvbSAnLi9Db21wb25lbnRzL1NlYXJjaEZvcm0nO1xuaW1wb3J0IEVjb21Gb3JtcyBmcm9tICcuL0NvbXBvbmVudHMvRWNvbUZvcm1zJztcbmltcG9ydCBTaGlwRm9ybSBmcm9tICcuL0NvbXBvbmVudHMvU2hpcEZvcm0nO1xuaW1wb3J0IElFRGV0ZWN0b3IgZnJvbSAnLi9Db21wb25lbnRzL0lFRGV0ZWN0b3InO1xuaW1wb3J0IFNvY2lhbCBmcm9tICcuL0NvbXBvbmVudHMvU29jaWFsJztcbmltcG9ydCBIZXJvIGZyb20gJy4vQ29tcG9uZW50cy9IZXJvJztcbmltcG9ydCBBdXRoZW50aWNhdGlvbkV2ZW50cyBmcm9tICcuL0NvbXBvbmVudHMvQXV0aGVudGljYXRpb25FdmVudHMnO1xuaW1wb3J0IERlbGV0ZUFjY291bnRGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9EZWxldGVBY2NvdW50Rm9ybSc7XG5pbXBvcnQgTG9naW5Gb3JtIGZyb20gJy4vQ29tcG9uZW50cy9Mb2dpbkZvcm0nO1xuaW1wb3J0IFBhc3N3b3JkUmVtaW5kZXJGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9QYXNzd29yZFJlbWluZGVyRm9ybSc7XG5pbXBvcnQgUmVnaXN0ZXJGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9SZWdpc3RlckZvcm0nO1xuaW1wb3J0IFlvdXJBY2NvdW50Rm9ybSBmcm9tICcuL0NvbXBvbmVudHMvWW91ckFjY291bnRGb3JtJztcbmltcG9ydCBTaGlwTm93Rm9ybSBmcm9tICcuL0NvbXBvbmVudHMvU2hpcE5vd0Zvcm0nO1xuaW1wb3J0IFNoaXBOb3dUd29TdGVwRm9ybSBmcm9tICcuL0NvbXBvbmVudHMvU2hpcE5vd1R3b1N0ZXBGb3JtJztcbmltcG9ydCBDb21wZXRpdGlvbkZvcm0gZnJvbSAnLi9Db21wb25lbnRzL0NvbXBldGl0aW9uRm9ybSc7XG5pbXBvcnQgU2VydmljZVdvcmtlciBmcm9tICcuL0NvbXBvbmVudHMvU2VydmljZVdvcmtlcic7XG5pbXBvcnQgT2ZmbGluZSBmcm9tICcuL0NvbXBvbmVudHMvT2ZmbGluZSc7XG5pbXBvcnQgTGFuZGluZ1BvaW50cyBmcm9tICcuL0NvbXBvbmVudHMvTGFuZGluZ1BvaW50cyc7XG5pbXBvcnQgQmFja0J1dHRvbiBmcm9tICcuL0NvbXBvbmVudHMvQmFja0J1dHRvbic7XG5pbXBvcnQgQXJ0aWNsZUNvdW50ZXIgZnJvbSAnLi9Db21wb25lbnRzL0FydGljbGVDb3VudGVyJztcbmltcG9ydCBNYXJrZXRvRm9ybSBmcm9tICcuL0NvbXBvbmVudHMvTWFya2V0b0Zvcm0nO1xuaW1wb3J0IExhbmd1YWdlRGV0ZWN0IGZyb20gJy4vQ29tcG9uZW50cy9MYW5ndWFnZURldGVjdCc7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcbiAgdHJ5IHtcbiAgICBkb2N1bWVudC5jcmVhdGVFdmVudCgnVG91Y2hFdmVudCcpO1xuICAgICQoJ2JvZHknKS5hZGRDbGFzcygndG91Y2gnKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIG5vdGhpbmdcbiAgfVxuICBpZiAoKHdpbmRvdy5tYXRjaE1lZGlhKCcoZGlzcGxheS1tb2RlOiBzdGFuZGFsb25lKScpLm1hdGNoZXMpIHx8ICh3aW5kb3cubmF2aWdhdG9yLnN0YW5kYWxvbmUpKSAkKCdodG1sJykuYWRkQ2xhc3MoJ3B3YScpO1xuICAvLyBJbml0aWF0ZSBjb21wb25lbnRzXG4gIExhbmd1YWdlRGV0ZWN0LmluaXQoKTtcbiAgLy8gQXJ0aWNsZUNvdW50ZXIuaW5pdCgpO1xuICBJRURldGVjdG9yLmluaXQoKTtcbiAgSGVhZGVyLmluaXQoKTtcbiAgQm9vdHN0cmFwQ2Fyb3VzZWwuaW5pdCgpO1xuICBBcnRpY2xlR3JpZC5pbml0KCk7XG4gIFN1YnNjcmliZVBhbmVsLmluaXQoKTtcbiAgUGFzc3dvcmQuaW5pdCgpO1xuICBQYXNzd29yZFZhbGlkaXR5LmluaXQoKTtcbiAgLy8gRm9ybVZhbGlkYXRpb24uaW5pdCgpO1xuICBTaG93SGlkZS5pbml0KCk7XG4gIENvb2tpZUJhbm5lci5pbml0KCk7XG4gIFNlYXJjaEZvcm0uaW5pdCgpO1xuICBFY29tRm9ybXMuaW5pdCgpO1xuICBTaGlwRm9ybS5pbml0KCk7XG4gIFNvY2lhbC5pbml0KCk7XG4gIEhlcm8uaW5pdCgpO1xuICBDb21wZXRpdGlvbkZvcm0uaW5pdCgpO1xuICBTaGlwTm93Rm9ybS5pbml0KCk7XG4gIFNoaXBOb3dUd29TdGVwRm9ybS5pbml0KCk7XG4gIFlvdXJBY2NvdW50Rm9ybS5pbml0KCk7XG4gIFJlZ2lzdGVyRm9ybS5pbml0KCk7XG4gIFBhc3N3b3JkUmVtaW5kZXJGb3JtLmluaXQoKTtcbiAgTG9naW5Gb3JtLmluaXQoKTtcbiAgRGVsZXRlQWNjb3VudEZvcm0uaW5pdCgpO1xuICBBdXRoZW50aWNhdGlvbkV2ZW50cy5pbml0KCk7XG4gIFNlcnZpY2VXb3JrZXIuaW5pdCgpO1xuICBPZmZsaW5lLmluaXQoKTtcbiAgTGFuZGluZ1BvaW50cy5pbml0KCk7XG4gIEJhY2tCdXR0b24uaW5pdCgpO1xuICBNYXJrZXRvRm9ybS5pbml0KCk7XG59KTtcbiJdfQ==
