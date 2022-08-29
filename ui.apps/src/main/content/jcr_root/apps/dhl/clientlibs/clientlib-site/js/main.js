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
        window.location = this.getPathHome() + '.html';
      }
      if ($('.page-body.register').length > 0) {
        window.location = this.getPathHome() + '/your-account.html';
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
        window.location = this.getPathHome() + '.html';
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
            catchAll = this.getPathPrefix() + variant.path + '.html';
          }
          if (variant.languages.indexOf(language) >= 0) {
            url = this.getPathPrefix() + variant.path + '.html';
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
                  backUrl = _this5.getPathHome() + '.html';
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
                            backUrl = _this3.getPathHome() + '.html';
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
                      window.location = _this6.getPathHome() + '.html';
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
      navigator.serviceWorker.register('/discover/serviceworker.js').then(function () {
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

      indexedArray.source = $.trim($form.data('source'));
      indexedArray.lo = $.trim($form.data('lo'));

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
        window.location = this.getPathHome() + '.html';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BcnRpY2xlQ291bnRlci5qcyIsImpzL2Rldi9Db21wb25lbnRzL0FydGljbGVHcmlkLmpzIiwianMvZGV2L0NvbXBvbmVudHMvQXV0aGVudGljYXRpb25FdmVudHMuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9CYWNrQnV0dG9uLmpzIiwianMvZGV2L0NvbXBvbmVudHMvQm9vdHN0cmFwQ2Fyb3VzZWwuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Db21wZXRpdGlvbkZvcm0uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Db25zdGFudHMuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Db29raWVCYW5uZXIuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9EYXRhYmFzZS5qcyIsImpzL2Rldi9Db21wb25lbnRzL0RlbGV0ZUFjY291bnRGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvRWNvbUZvcm1zLmpzIiwianMvZGV2L0NvbXBvbmVudHMvRm9ybVZhbGlkYXRpb24uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9IZWFkZXIuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9IZXJvLmpzIiwianMvZGV2L0NvbXBvbmVudHMvSUVEZXRlY3Rvci5qcyIsImpzL2Rldi9Db21wb25lbnRzL0xhbmRpbmdQb2ludHMuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9MYW5ndWFnZURldGVjdC5qcyIsImpzL2Rldi9Db21wb25lbnRzL0xvZ2luRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL01hcmtldG9Gb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvT2ZmbGluZS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1Bhc3N3b3JkLmpzIiwianMvZGV2L0NvbXBvbmVudHMvUGFzc3dvcmRSZW1pbmRlckZvcm0uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9QYXNzd29yZFZhbGlkaXR5LmpzIiwianMvZGV2L0NvbXBvbmVudHMvUmVnaXN0ZXJGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2VhcmNoRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1NlcnZpY2VXb3JrZXIuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9TaGlwRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1NoaXBOb3dGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2hpcE5vd1R3b1N0ZXBGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2hvd0hpZGUuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Tb2NpYWwuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9TdWJzY3JpYmVQYW5lbC5qcyIsImpzL2Rldi9Db21wb25lbnRzL1RvYXN0LmpzIiwianMvZGV2L0NvbXBvbmVudHMvWW91ckFjY291bnRGb3JtLmpzIiwianMvZGV2L21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sYztBQUNKLDRCQUFjO0FBQUE7O0FBQ1osU0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDRDs7OztvQ0FFZTtBQUNkLFVBQU0sU0FBUyxFQUFFLHFDQUFGLEVBQXlDLElBQXpDLENBQThDLFNBQTlDLENBQWY7QUFDQSxhQUFRLFNBQVMsTUFBVCxHQUFrQixFQUExQjtBQUNEOzs7MkJBRU07QUFDTDtBQUNBO0FBQ0EsVUFBSSxjQUFjLEVBQUUsNEJBQUYsQ0FBbEI7QUFDQSxVQUFJLFlBQVksTUFBWixHQUFxQixDQUF6QixFQUE0QjtBQUMxQixZQUFJLE9BQU8sWUFBWSxJQUFaLENBQWlCLE1BQWpCLENBQVg7QUFDQSxZQUFJLEVBQUUsSUFBRixDQUFPLElBQVAsRUFBYSxNQUFiLEdBQXNCLENBQTFCLEVBQTZCO0FBQzNCLGNBQUksT0FBTztBQUNULGVBQUc7QUFETSxXQUFY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O0FBQ0QsR0FIRCxDQUdFLE9BQU8sQ0FBUCxFQUFVO0FBQ1Y7QUFDRDtBQUNELE1BQUssT0FBTyxVQUFQLENBQWtCLDRCQUFsQixFQUFnRCxPQUFqRCxJQUE4RCxPQUFPLFNBQVAsQ0FBaUIsVUFBbkYsRUFBZ0csRUFBRSxNQUFGLEVBQVUsUUFBVixDQUFtQixLQUFuQjtBQUNoRztBQUNBLDJCQUFlLElBQWY7QUFDQTtBQUNBLHVCQUFXLElBQVg7QUFDQSxtQkFBTyxJQUFQO0FBQ0EsOEJBQWtCLElBQWxCO0FBQ0Esd0JBQVksSUFBWjtBQUNBLDJCQUFlLElBQWY7QUFDQSxxQkFBUyxJQUFUO0FBQ0EsNkJBQWlCLElBQWpCO0FBQ0E7QUFDQSxxQkFBUyxJQUFUO0FBQ0EseUJBQWEsSUFBYjtBQUNBLHVCQUFXLElBQVg7QUFDQSxzQkFBVSxJQUFWO0FBQ0EscUJBQVMsSUFBVDtBQUNBLG1CQUFPLElBQVA7QUFDQSxpQkFBSyxJQUFMO0FBQ0EsNEJBQWdCLElBQWhCO0FBQ0Esd0JBQVksSUFBWjtBQUNBLCtCQUFtQixJQUFuQjtBQUNBLDRCQUFnQixJQUFoQjtBQUNBLHlCQUFhLElBQWI7QUFDQSxpQ0FBcUIsSUFBckI7QUFDQSxzQkFBVSxJQUFWO0FBQ0EsOEJBQWtCLElBQWxCO0FBQ0EsaUNBQXFCLElBQXJCO0FBQ0EsMEJBQWMsSUFBZDtBQUNBLG9CQUFRLElBQVI7QUFDQSwwQkFBYyxJQUFkO0FBQ0EsdUJBQVcsSUFBWDtBQUNBLHdCQUFZLElBQVo7QUFDRCxDQXhDRCxFLENBakNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY2xhc3MgQXJ0aWNsZUNvdW50ZXIge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldFBhdGhQcmVmaXgoKSB7XHJcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xyXG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgLy8gL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL2NvdW50ZXIvaW5kZXguanNvblxyXG4gICAgLy8gcCA9IC9jb250ZW50L2RobC9YWFhYXHJcbiAgICBsZXQgYXJ0aWNsZVBhZ2UgPSAkKCcucGFnZS1ib2R5LmFydGljbGUtY291bnRlcicpO1xyXG4gICAgaWYgKGFydGljbGVQYWdlLmxlbmd0aCA+IDApIHtcclxuICAgICAgbGV0IHBhdGggPSBhcnRpY2xlUGFnZS5kYXRhKCdwYXRoJyk7XHJcbiAgICAgIGlmICgkLnRyaW0ocGF0aCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgcDogcGF0aFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJC5wb3N0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9jb3VudGVyL2luZGV4Lmpzb24nLCBkYXRhKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEFydGljbGVDb3VudGVyKCk7XHJcbiIsImNsYXNzIEFydGljbGVHcmlkQXBpIHtcclxuICBjb25zdHJ1Y3RvcihlbmRwb2ludCwgcGFnZVNpemUgPSA2KSB7XHJcbiAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQ7XHJcbiAgICB0aGlzLnBhZ2VTaXplID0gcGFnZVNpemU7XHJcbiAgICB0aGlzLnNraXAgPSAwO1xyXG5cclxuICAgIHRoaXMuZG9SZXF1ZXN0ID0gdGhpcy5kb1JlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2VhcmNoID0gdGhpcy5zZWFyY2guYmluZCh0aGlzKTtcclxuICAgIHRoaXMubG9hZE1vcmUgPSB0aGlzLmxvYWRNb3JlLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBkb1JlcXVlc3QoY2FsbGJhY2ssIGtleXdvcmQgPSBudWxsKSB7XHJcbiAgICAkLmdldCh0aGlzLmVuZHBvaW50LCB7XHJcbiAgICAgIHNraXA6IHRoaXMuc2tpcCxcclxuICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXHJcbiAgICAgIGtleXdvcmQ6IGtleXdvcmRcclxuICAgIH0sIChkYXRhKSA9PiB7XHJcbiAgICAgIHRoaXMuc2tpcCArPSBkYXRhLkl0ZW1zLmxlbmd0aDtcclxuICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlYXJjaChjYWxsYmFjaywga2V5d29yZCkge1xyXG4gICAgdGhpcy5za2lwID0gMDtcclxuICAgIHRoaXMuZG9SZXF1ZXN0KGNhbGxiYWNrLCBrZXl3b3JkKTtcclxuICB9XHJcblxyXG4gIGxvYWRNb3JlKGNhbGxiYWNrKSB7XHJcbiAgICB0aGlzLmRvUmVxdWVzdChjYWxsYmFjayk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBBcnRpY2xlR3JpZCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuaGFzbW9yZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5hcnRpY2xlR3JpZCcsXHJcbiAgICAgIGdyaWQ6ICcuYXJ0aWNsZUdyaWRfX2dyaWQnLFxyXG4gICAgICBsb2FkTW9yZTogJy5hcnRpY2xlR3JpZF9fbG9hZE1vcmUnLFxyXG4gICAgICB0ZW1wbGF0ZTogJyNhcnRpY2xlR3JpZF9fcGFuZWxUZW1wbGF0ZScsXHJcbiAgICAgIG5hdjogJy5hcnRpY2xlR3JpZF9fbmF2J1xyXG4gICAgfTtcclxuICAgIHRoaXMudGVtcGxhdGUgPSAkKCQodGhpcy5zZWwudGVtcGxhdGUpLmh0bWwoKSk7XHJcblxyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxvYWRNb3JlID0gdGhpcy5sb2FkTW9yZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5wb3B1bGF0ZVRlbXBsYXRlcyA9IHRoaXMucG9wdWxhdGVUZW1wbGF0ZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zaG93U3Bpbm5lciA9IHRoaXMuc2hvd1NwaW5uZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaGlkZVNwaW5uZXIgPSB0aGlzLmhpZGVTcGlubmVyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNjcm9sbG5hdiA9IHRoaXMuc2Nyb2xsbmF2LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNjcm9sbGxlZnQgPSB0aGlzLnNjcm9sbGxlZnQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2Nyb2xscmlnaHQgPSB0aGlzLnNjcm9sbHJpZ2h0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoZWNrU2Nyb2xsID0gdGhpcy5jaGVja1Njcm9sbC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5wYWdlU2Nyb2xsID0gdGhpcy5wYWdlU2Nyb2xsLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCB0aGlzLnBhZ2VTY3JvbGwpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwubG9hZE1vcmUsIHRoaXMubG9hZE1vcmUpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5zY3JvbGxsZWZ0JywgdGhpcy5zY3JvbGxsZWZ0KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc2Nyb2xscmlnaHQnLCB0aGlzLnNjcm9sbHJpZ2h0KTtcclxuXHJcbiAgICB0aGlzLnBhZ2VTY3JvbGwoKTtcclxuICB9XHJcblxyXG4gIHBhZ2VTY3JvbGwoKSB7XHJcbiAgICBpZiAodGhpcy5oYXNtb3JlICYmICghdGhpcy5sb2FkaW5nKSkge1xyXG4gICAgICB2YXIgd25kID0gJCh3aW5kb3cpO1xyXG4gICAgICB2YXIgZWxtID0gJCh0aGlzLnNlbC5sb2FkTW9yZSk7XHJcblxyXG4gICAgICBpZiAoZWxtICYmICgkKGVsbSkubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICB2YXIgd3N0ID0gd25kLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgIHZhciB3aCA9IHduZC5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgb3QgPSBlbG0ub2Zmc2V0KCkudG9wO1xyXG4gICAgICAgIHZhciBvaCA9IGVsbS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgICAgICBpZiAoKHdzdCArIHdoKSA+IChvdCArIG9oKSkge1xyXG4gICAgICAgICAgdGhpcy5sb2FkTW9yZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZE1vcmUoZSkge1xyXG4gICAgaWYgKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XHJcbiAgICAvLyBTaG93IHRoZSBsb2FkaW5nIHNwaW5uZXJcclxuICAgIHRoaXMuc2hvd1NwaW5uZXIoKTtcclxuXHJcbiAgICB2YXIgdCA9IDA7XHJcbiAgICAkKFwiLmFydGljbGVHcmlkX19pdGVtXCIsIHRoaXMuc2VsLmNvbXBvbmVudCkuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgaWYgKHQgPCA2ICYmICghJChpdGVtKS5pcyhcIjp2aXNpYmxlXCIpKSkge1xyXG4gICAgICAgICQoaXRlbSkuc2hvdygpO1xyXG4gICAgICAgIHQrKztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCQoXCIuYXJ0aWNsZUdyaWRfX2l0ZW1cIix0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA9PT0gJChcIi5hcnRpY2xlR3JpZF9faXRlbTp2aXNpYmxlXCIsdGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGgpIHtcclxuICAgICAgJCh0aGlzLnNlbC5sb2FkTW9yZSkucGFyZW50cyhcIi5yb3dcIikuZmlyc3QoKS5yZW1vdmUoKTtcclxuICAgICAgdGhpcy5oYXNtb3JlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGlkZSB0aGUgbG9hZGluZyBzcGlubmVyXHJcbiAgICB0aGlzLmhpZGVTcGlubmVyKCk7XHJcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHNob3dTcGlubmVyKCkge1xyXG4gICAgJCh0aGlzLnNlbC5sb2FkTW9yZSkuYWRkQ2xhc3MoJ2FydGljbGVHcmlkX19sb2FkTW9yZS0tbG9hZGluZycpO1xyXG4gIH1cclxuXHJcbiAgaGlkZVNwaW5uZXIoKSB7XHJcbiAgICAkKHRoaXMuc2VsLmxvYWRNb3JlKS5yZW1vdmVDbGFzcygnYXJ0aWNsZUdyaWRfX2xvYWRNb3JlLS1sb2FkaW5nJyk7XHJcbiAgfVxyXG5cclxuICBzY3JvbGxuYXYoKSB7XHJcbiAgICBsZXQgJHNjcm9sbG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWwubmF2KTtcclxuICAgIGlmICgkc2Nyb2xsbmF2ID09PSBudWxsKSByZXR1cm47XHJcbiAgICBsZXQgc2Nyb2xsV2lkdGggPSAkc2Nyb2xsbmF2LnNjcm9sbFdpZHRoO1xyXG4gICAgbGV0IGNsaWVudFdpZHRoID0gJHNjcm9sbG5hdi5jbGllbnRXaWR0aDtcclxuICAgIGlmIChzY3JvbGxXaWR0aCA+IGNsaWVudFdpZHRoKSB7XHJcbiAgICAgICQodGhpcy5zZWwubmF2KS5hZnRlcignPGkgY2xhc3M9XCJzY3JvbGxyaWdodFwiPj48L2k+Jyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHNjcm9sbHJpZ2h0KCkge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzLnNlbC5uYXY7XHJcbiAgICBsZXQgc2Nyb2xsV2lkdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGYpLnNjcm9sbFdpZHRoO1xyXG4gICAgJChzZWxmKS5hbmltYXRlKHtcclxuICAgICAgc2Nyb2xsTGVmdDogc2Nyb2xsV2lkdGggKyAncHgnXHJcbiAgICB9LCA1MDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLnNjcm9sbHJpZ2h0JykucmVtb3ZlKCk7XHJcbiAgICAgICQoc2VsZikuYmVmb3JlKCc8aSBjbGFzcz1cInNjcm9sbGxlZnRcIj48PC9pPicpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzY3JvbGxsZWZ0KCkge1xyXG4gICAgbGV0IHNlbGYgPSB0aGlzLnNlbC5uYXY7XHJcbiAgICAkKHNlbGYpLmFuaW1hdGUoe1xyXG4gICAgICBzY3JvbGxMZWZ0OiAwXHJcbiAgICB9LCA1MDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLnNjcm9sbGxlZnQnKS5yZW1vdmUoKTtcclxuICAgICAgJChzZWxmKS5hZnRlcignPGkgY2xhc3M9XCJzY3JvbGxyaWdodFwiPj48L2k+Jyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoZWNrU2Nyb2xsKCkge1xyXG4gICAgbGV0ICRzY3JvbGxuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsLm5hdik7XHJcbiAgICBpZiAoJHNjcm9sbG5hdiA9PT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgbGV0IHNjcm9sbFdpZHRoID0gJHNjcm9sbG5hdi5zY3JvbGxXaWR0aDtcclxuICAgIGxldCBjbGllbnRXaWR0aCA9ICRzY3JvbGxuYXYuY2xpZW50V2lkdGg7XHJcbiAgICBsZXQgc2Nyb2xsR2FwID0gc2Nyb2xsV2lkdGggLSBjbGllbnRXaWR0aDtcclxuICAgICQoc2VsZikuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHRoaXMuc2Nyb2xsTGVmdCA9PT0gMCkge1xyXG4gICAgICAgICQoJy5zY3JvbGxsZWZ0JykucmVtb3ZlKCk7XHJcbiAgICAgICAgJChzZWxmKS5hZnRlcignPGkgY2xhc3M9XCJzY3JvbGxyaWdodFwiPj48L2k+Jyk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuc2Nyb2xsTGVmdCA+PSBzY3JvbGxHYXApIHtcclxuICAgICAgICAkKCcuc2Nyb2xscmlnaHQnKS5yZW1vdmUoKTtcclxuICAgICAgICAkKHNlbGYpLmJlZm9yZSgnPGkgY2xhc3M9XCJzY3JvbGxsZWZ0XCI+PDwvaT4nKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwb3B1bGF0ZVRlbXBsYXRlcyhpdGVtcykge1xyXG4gICAgbGV0IG91dHB1dCA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAvLyBDbG9uZSB0ZW1wbGF0ZVxyXG4gICAgICBsZXQgJHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZS5jbG9uZSgpO1xyXG4gICAgICAvLyBHZXQgdGhlIGl0ZW1cclxuICAgICAgbGV0IGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgLy8gU2V0IGltYWdlIGJyZWFrcG9pbnRcclxuICAgICAgbGV0IGRlc2t0b3BCcmVha3BvaW50ID0gOTkyO1xyXG4gICAgICAvLyBHZW5lcmF0ZSBJRFxyXG4gICAgICBsZXQgcGFuZWxJZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCA5KTtcclxuICAgICAgLy8gUG9wdWxhdGUgSURcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5hdHRyKCdpZCcsIHBhbmVsSWQpO1xyXG4gICAgICAvLyBJZiBsYXJnZSBwYW5lbFxyXG4gICAgICBpZiAoaXRlbS5Jc0xhcmdlKSB7XHJcbiAgICAgICAgLy8gVXBkYXRlIGltYWdlIGJyZWFrcG9pbnRcclxuICAgICAgICBkZXNrdG9wQnJlYWtwb2ludCA9IDc2ODtcclxuICAgICAgICAvLyBBZGQgY2xhc3NcclxuICAgICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbCcpLmFkZENsYXNzKCdhcnRpY2xlUGFuZWwtLWxhcmdlJyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gSWYgdmlkZW9cclxuICAgICAgaWYgKGl0ZW0uSXNWaWRlbykge1xyXG4gICAgICAgIC8vIEFkZCBjbGFzc1xyXG4gICAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsJykuYWRkQ2xhc3MoJ2FydGljbGVQYW5lbC0tdmlkZW8nKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBQb3B1bGF0ZSBpbWFnZXNcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2ltYWdlJykuYXR0cih7XHJcbiAgICAgICAgaHJlZjogaXRlbS5MaW5rLFxyXG4gICAgICAgIHRpdGxlOiBpdGVtLlRpdGxlXHJcbiAgICAgIH0pLmF0dHIoJ3N0eWxlJywgJ2JhY2tncm91bmQtaW1hZ2U6IHVybCgnICsgaXRlbS5JbWFnZXMuTW9iaWxlICsgJyk7Jyk7XHJcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCdzdHlsZScpWzBdLmlubmVySFRNTCA9ICdAbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAnICsgZGVza3RvcEJyZWFrcG9pbnQgKyAncHgpeyMnICsgcGFuZWxJZCArICcgLmFydGljbGVQYW5lbF9faW1hZ2V7YmFja2dyb3VuZC1pbWFnZTogdXJsKCcgKyBpdGVtLkltYWdlcy5EZXNrdG9wICsgJykgIWltcG9ydGFudDt9fSc7XHJcbiAgICAgIC8vIFBvcHVsYXRlIGxpbmtcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2NvbnRlbnQgPiBhJykuYXR0cih7XHJcbiAgICAgICAgaHJlZjogaXRlbS5MaW5rLFxyXG4gICAgICAgIHRpdGxlOiBpdGVtLlRpdGxlXHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBQb3B1bGF0ZSB0aXRsZVxyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fdGl0bGUnKS50ZXh0KGl0ZW0uVGl0bGUpO1xyXG4gICAgICAvLyBQb3B1bGF0ZSBkZXNjcmlwdGlvblxyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fZGVzY3JpcHRpb24nKS50ZXh0KGl0ZW0uRGVzY3JpcHRpb24pO1xyXG4gICAgICAvLyBQb3B1bGF0ZSBjYXRlZ29yeVxyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fc3ViVGl0bGUgYTpmaXJzdC1jaGlsZCcpLmF0dHIoe1xyXG4gICAgICAgICdocmVmJzogaXRlbS5DYXRlZ29yeS5MaW5rLFxyXG4gICAgICAgICd0aXRsZSc6IGl0ZW0uQ2F0ZWdvcnkuTmFtZVxyXG4gICAgICB9KS50ZXh0KGl0ZW0uQ2F0ZWdvcnkuTmFtZSk7XHJcbiAgICAgIC8vIFBvcHVsYXRlIHRpbWUgdG8gcmVhZFxyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fc3ViVGl0bGUgYTpsYXN0LWNoaWxkJykuYXR0cih7XHJcbiAgICAgICAgJ2hyZWYnOiBpdGVtLkxpbmssXHJcbiAgICAgICAgJ3RpdGxlJzogaXRlbS5UaXRsZVxyXG4gICAgICB9KS50ZXh0KGl0ZW0uVGltZVRvUmVhZCk7XHJcbiAgICAgIC8vIFB1c2ggaXRlbSB0byBvdXRwdXRcclxuICAgICAgb3V0cHV0LnB1c2goJHRlbXBsYXRlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgbGV0IGVuZHBvaW50ID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmF0dHIoJ2RhdGEtZW5kcG9pbnQnKTtcclxuICAgIHRoaXMuQVBJID0gbmV3IEFydGljbGVHcmlkQXBpKGVuZHBvaW50KTtcclxuICAgIHRoaXMuc2Nyb2xsbmF2KCk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHRoaXMuY2hlY2tTY3JvbGwoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEFydGljbGVHcmlkKCk7XHJcbiIsImNsYXNzIEF1dGhlbnRpY2F0aW9uRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuY29uZmlnID0ge1xyXG4gICAgICB1cmxUb2tlbjogJy9saWJzL2dyYW5pdGUvY3NyZi90b2tlbi5qc29uJyxcclxuICAgICAgdXJsQ2hlY2s6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvY2hlY2svaW5kZXguanNvbicsXHJcbiAgICAgIHVybFJlZnJlc2hDaGVjazogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZWZyZXNoX3Rva2VuL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxEb3dubG9hZEFzc2V0OiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL2Rvd25sb2FkX2Fzc2V0L2luZGV4Lmpzb24nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZ2V0UGF0aFByZWZpeCA9IHRoaXMuZ2V0UGF0aFByZWZpeC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRQYXRoSG9tZSA9IHRoaXMuZ2V0UGF0aEhvbWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMucmVhZENvb2tpZSA9IHRoaXMucmVhZENvb2tpZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jbGVhckNvb2tpZSA9IHRoaXMuY2xlYXJDb29raWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY3JlYXRlQ29va2llID0gdGhpcy5jcmVhdGVDb29raWUuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmNoZWNrTG9naW5TdGF0dXMgPSB0aGlzLmNoZWNrTG9naW5TdGF0dXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hlY2tBdXRoVG9rZW5zID0gdGhpcy5jaGVja0F1dGhUb2tlbnMuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnNob3dMb2dnZWRJbkVsZW1lbnRzID0gdGhpcy5zaG93TG9nZ2VkSW5FbGVtZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zaG93Tm90TG9nZ2VkSW5FbGVtZW50cyA9IHRoaXMuc2hvd05vdExvZ2dlZEluRWxlbWVudHMuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldFBhdGhQcmVmaXgoKSB7XHJcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xyXG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoSG9tZSgpIHtcclxuICAgIGNvbnN0IGhvbWUgPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1ob21lXFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAoaG9tZSA/IGhvbWUgOiAnJyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgJCh3aW5kb3cpLm9uKCdjaGVja2F1dGh0b2tlbnMuREhMJywgKGV2dCwgdG9rZW5EYXRhLCBza2lwRWxlbWVudHMpID0+IHtcclxuICAgICAgdGhpcy5jaGVja0F1dGhUb2tlbnModG9rZW5EYXRhLCBza2lwRWxlbWVudHMpO1xyXG4gICAgfSk7XHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJsb2dnZWRpbi5ESEwnLCAoZXZ0LCB0b2tlbkRhdGEpID0+IHtcclxuICAgICAgdGhpcy5zaG93TG9nZ2VkSW5FbGVtZW50cyh0b2tlbkRhdGEpO1xyXG4gICAgfSk7XHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJub3Rsb2dnZWRpbi5ESEwnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuc2hvd05vdExvZ2dlZEluRWxlbWVudHMoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGxvZ2dlZCBpbiBoZWFkZXIgKGxvZ291dCBsaW5rKVxyXG4gICAgdmFyIGxvZ2dlZEluSGVhZGVyID0gJCgnLmZvb3RlciAuZm9vdGVyX19jdGFzLS1sb2dnZWRpbicpO1xyXG4gICAgaWYgKGxvZ2dlZEluSGVhZGVyLmxlbmd0aCA+IDApIHtcclxuICAgICAgbG9nZ2VkSW5IZWFkZXIub24oJ2NsaWNrJywgJy5sb2dvdXQtbGluaycsICgpID0+IHtcclxuICAgICAgICB0aGlzLmNsZWFyQ29va2llKCdESEwuQXV0aFRva2VuJyk7XHJcbiAgICAgICAgdGhpcy5jbGVhckNvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicpO1xyXG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2hlY2tMb2dpblN0YXR1cygpO1xyXG4gIH1cclxuXHJcbiAgcmVhZENvb2tpZShuYW1lKSB7XHJcbiAgICB2YXIgbmFtZUVRID0gbmFtZSArICc9JztcclxuICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYS5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgYyA9IGNhW2ldO1xyXG4gICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcclxuICAgICAgaWYgKGMuaW5kZXhPZihuYW1lRVEpID09PSAwKSByZXR1cm4gYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJDb29raWUobmFtZSkge1xyXG4gICAgdGhpcy5jcmVhdGVDb29raWUobmFtZSwgJycsIC0xKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUNvb2tpZShuYW1lLCB2YWx1ZSwgZXhwaXJ5U2Vjb25kcykge1xyXG4gICAgdmFyIGV4cGlyZXMgPSAnJztcclxuICAgIGlmIChleHBpcnlTZWNvbmRzKSB7XHJcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgKGV4cGlyeVNlY29uZHMgKiAxMDAwKSk7XHJcbiAgICAgIGV4cGlyZXMgPSAnOyBleHBpcmVzPScgKyBkYXRlLnRvVVRDU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgJz0nICsgdmFsdWUgKyBleHBpcmVzICsgJzsgcGF0aD0vJztcclxuICB9XHJcblxyXG4gIGNoZWNrTG9naW5TdGF0dXMoKSB7XHJcbiAgICB2YXIgY29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuQXV0aFRva2VuJyk7XHJcbiAgICBpZiAoY29va2llICE9PSBudWxsKSB7XHJcbiAgICAgIHZhciBhdXRoU3BsaXQgPSBjb29raWUuc3BsaXQoJ3wnKTtcclxuICAgICAgaWYgKGF1dGhTcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgIHRoaXMuY2FsbFRva2VuQ2hlY2sodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxDaGVjaywge1xyXG4gICAgICAgICAgdXNlcm5hbWU6IGF1dGhTcGxpdFswXSxcclxuICAgICAgICAgIHRva2VuOiBhdXRoU3BsaXRbMV1cclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigndXNlcm5vdGxvZ2dlZGluLkRITCcpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgcmVmcmVzaENvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicpO1xyXG4gICAgICBpZiAocmVmcmVzaENvb2tpZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIHZhciByZWZyZXNoQ29va2llU3BsaXQgPSByZWZyZXNoQ29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgaWYgKHJlZnJlc2hDb29raWVTcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgdGhpcy5jYWxsVG9rZW5DaGVjayh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFJlZnJlc2hDaGVjaywge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogcmVmcmVzaENvb2tpZVNwbGl0WzBdLFxyXG4gICAgICAgICAgICByZWZyZXNoX3Rva2VuOiByZWZyZXNoQ29va2llU3BsaXRbMV1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigndXNlcm5vdGxvZ2dlZGluLkRITCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigndXNlcm5vdGxvZ2dlZGluLkRITCcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjYWxsVG9rZW5DaGVjayh1cmwsIGRhdGEpIHtcclxuICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sIChjc3JmcmVzcG9uc2UpID0+IHtcclxuICAgICAgdmFyIGNzcmZ0b2tlbiA9IGNzcmZyZXNwb25zZS50b2tlbjtcclxuXHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNoZWNrQXV0aFRva2VucyhyZXNwb25zZSwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoZWNrQXV0aFRva2Vucyh0b2tlbkRhdGEsIHNraXBFbGVtZW50cykge1xyXG4gICAgaWYgKHRva2VuRGF0YSAmJiB0b2tlbkRhdGEuc3RhdHVzICYmIHRva2VuRGF0YS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgdGhpcy5jcmVhdGVDb29raWUoJ0RITC5BdXRoVG9rZW4nLCB0b2tlbkRhdGEudXNlcm5hbWUgKyAnfCcgKyB0b2tlbkRhdGEudG9rZW4sIHRva2VuRGF0YS50dGwpO1xyXG4gICAgICB0aGlzLmNyZWF0ZUNvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicsIHRva2VuRGF0YS51c2VybmFtZSArICd8JyArIHRva2VuRGF0YS5yZWZyZXNoX3Rva2VuLCAoMjQgKiA2MCAqIDYwKSk7XHJcblxyXG4gICAgICBpZiAoc2tpcEVsZW1lbnRzICE9PSB0cnVlKSB7XHJcbiAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3VzZXJsb2dnZWRpbi5ESEwnLCB0b2tlbkRhdGEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNraXBFbGVtZW50cyAhPT0gdHJ1ZSkge1xyXG4gICAgICAkKHdpbmRvdykudHJpZ2dlcigndXNlcm5vdGxvZ2dlZGluLkRITCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2hvd0xvZ2dlZEluRWxlbWVudHModG9rZW5EYXRhKSB7XHJcbiAgICAkKCcuYmVsb3ctcmVnaXN0ZXItZm9ybSAudGFiLm1vYmlsZScpLmhpZGUoKTtcclxuXHJcbiAgICAkKCcuYmVsb3ctcmVnaXN0ZXItZm9ybSAjcmVnaXN0ZXItdGFiLTEnKS5oaWRlKCk7XHJcbiAgICAkKFwiLmJlbG93LXJlZ2lzdGVyLWZvcm0gLnRhYi1jb250ZW50cyAudGFiLWNvbnRlbnRbZGF0YS1yZWw9JyNyZWdpc3Rlci10YWItMSddXCIpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblxyXG4gICAgJCgnLmJlbG93LXJlZ2lzdGVyLWZvcm0gI3JlZ2lzdGVyLXRhYi0yJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNob3coKTtcclxuICAgICQoXCIuYmVsb3ctcmVnaXN0ZXItZm9ybSAudGFiLWNvbnRlbnRzIC50YWItY29udGVudFtkYXRhLXJlbD0nI3JlZ2lzdGVyLXRhYi0yJ11cIikuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICAkKCcuYmVsb3ctcmVnaXN0ZXItZm9ybScpLnNob3coKTtcclxuXHJcbiAgICAkKCdoZWFkZXIgLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtLmxvZ2dlZC1pbiAudXNlci1maXJzdG5hbWUsIGhlYWRlciAuaGVhZGVyX19wcmltYXJ5TGlua3MgLnVzZXItZmlyc3RuYW1lJykudGV4dCh0b2tlbkRhdGEubmFtZSk7XHJcbiAgICAkKCdoZWFkZXIgLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtLmxvZ2dlZC1pbiwgaGVhZGVyIC5oZWFkZXJfX3ByaW1hcnlMaW5rcy5sb2dnZWQtaW4nKS5zaG93KCk7XHJcbiAgICAkKCcuZm9vdGVyIC5sb2dvdXQtbGlua3MnKS5zaG93KCk7XHJcblxyXG4gICAgJCgnLmNvbXBldGl0aW9uRGF0YUNhcHR1cmUubG9nZ2VkLWluJykuc2hvdygpO1xyXG4gICAgJCgnLmNvbXBldGl0aW9uRGF0YUNhcHR1cmUubG9nZ2VkLWluIC5sb2dnZWRpbi1uYW1lJykudGV4dCh0b2tlbkRhdGEubmFtZSk7XHJcbiAgICAkKCcuY3RhLXRoaXJkLXBhbmVsLWxvZ2dlZGluJykuc2hvdygpO1xyXG5cclxuICAgICQoJy5nYXRlZCcpLmFkZENsYXNzKCd1bmxvY2tlZCcpLnJlbW92ZUNsYXNzKCdsb2NrZWQnKS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xyXG4gICAgICAkKGl0ZW0pLmNsb3Nlc3QoJ2JvZHknKS5maW5kKCcuaGVybyAuaGVyb19fY3RhLS1ncmV5Jykuc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgICAkKCcuZ2F0ZWQtaGlkZScpLmFkZENsYXNzKCd1bmxvY2tlZCcpLnJlbW92ZUNsYXNzKCdsb2NrZWQnKTtcclxuXHJcbiAgICAkKCcuYXJ0aWNsZUdyaWQgLmFydGljbGUtZ3JpZC1pdGVtLWxvZ2dlZGluJykuc2hvdygpO1xyXG5cclxuICAgIGlmICh0b2tlbkRhdGEuZnVsbCA9PT0gZmFsc2UpIHtcclxuICAgICAgJCgnLmNyZWF0ZS1wYXNzd29yZCcpLmZpbmQoJy5jcmVhdGUtcGFzc3dvcmQtbmFtZScpLnRleHQodG9rZW5EYXRhLm5hbWUpO1xyXG4gICAgICAkKHdpbmRvdykudHJpZ2dlcignc2hvdy5DcmVhdGVQYXNzd29yZE1vZGFsLkRITCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkKCcucmVzZXQtcGFzc3dvcmQtY29udGFpbmVyJykubGVuZ3RoID4gMCkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGlzLmdldFBhdGhIb21lKCkgKyAnLmh0bWwnO1xyXG4gICAgfVxyXG4gICAgaWYgKCQoJy5wYWdlLWJvZHkucmVnaXN0ZXInKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMuZ2V0UGF0aEhvbWUoKSArICcveW91ci1hY2NvdW50Lmh0bWwnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkKCcuZ2F0aW5nQXJ0aWNsZV9fYWN0aW9ucy5sb2dnZWQtaW4nKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHZhciBnYXRpbmdBcnRpY2xlRWxtMSA9ICQoJy5nYXRpbmdBcnRpY2xlX19hY3Rpb25zLmxvZ2dlZC1pbicpO1xyXG5cclxuICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybERvd25sb2FkQXNzZXQsXHJcbiAgICAgICAgICBkYXRhOiB7IGFzc2V0aW5mbzogZ2F0aW5nQXJ0aWNsZUVsbTEuZGF0YSgnYXNzZXRpbmZvJykgfSxcclxuICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgIGdhdGluZ0FydGljbGVFbG0xLmZpbmQoJy5nYXRpbmdBcnRpY2xlX19idXR0b24nKS5hdHRyKCdocmVmJywgcmVzcG9uc2UuaHJlZik7XHJcbiAgICAgICAgICAgICAgZ2F0aW5nQXJ0aWNsZUVsbTEuc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkKCcjZG93bmxvYWQgLkRITGRvd25sb2FkX19jdGFzLmxvZ2dlZC1pbicpLmxlbmd0aCA+IDApIHtcclxuICAgICAgdmFyIGdhdGluZ0FydGljbGVFbG0yID0gJCgnI2Rvd25sb2FkIC5ESExkb3dubG9hZF9fY3Rhcy5sb2dnZWQtaW4nKTtcclxuXHJcbiAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxEb3dubG9hZEFzc2V0LFxyXG4gICAgICAgICAgZGF0YTogeyBhc3NldGluZm86IGdhdGluZ0FydGljbGVFbG0yLmRhdGEoJ2Fzc2V0aW5mbycpIH0sXHJcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICBnYXRpbmdBcnRpY2xlRWxtMi5maW5kKCcuREhMZG93bmxvYWRfX2N0YS0tcmVkJykuYXR0cignaHJlZicsIHJlc3BvbnNlLmhyZWYpO1xyXG4gICAgICAgICAgICAgIGdhdGluZ0FydGljbGVFbG0yLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNob3dOb3RMb2dnZWRJbkVsZW1lbnRzKCkge1xyXG4gICAgJCgnLmJlbG93LXJlZ2lzdGVyLWZvcm0gLnRhYi1jb250YWluZXIgI3JlZ2lzdGVyLXRhYi0xJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNob3coKTtcclxuICAgICQoXCIuYmVsb3ctcmVnaXN0ZXItZm9ybSAudGFiLWNvbnRlbnRzIC50YWItY29udGVudFtkYXRhLXJlbD0nI3JlZ2lzdGVyLXRhYi0xJ11cIikuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICAkKCcuYmVsb3ctcmVnaXN0ZXItZm9ybSAjcmVnaXN0ZXItdGFiLTInKS5yZW1vdmVDbGFzcygnYWN0aXZlJykuc2hvdygpO1xyXG4gICAgJChcIi5iZWxvdy1yZWdpc3Rlci1mb3JtIC50YWItY29udGVudHMgLnRhYi1jb250ZW50W2RhdGEtcmVsPScjcmVnaXN0ZXItdGFiLTInXVwiKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cclxuICAgICQoJy5iZWxvdy1yZWdpc3Rlci1mb3JtJykuc2hvdygpO1xyXG5cclxuICAgICQoJ2hlYWRlciAuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0ubG9nZ2VkLW91dCwgaGVhZGVyIC5oZWFkZXJfX3ByaW1hcnlMaW5rcy5sb2dnZWQtb3V0Jykuc2hvdygpO1xyXG4gICAgJCgnLmZvb3RlciAubG9naW4tbGlua3MnKS5zaG93KCk7XHJcblxyXG4gICAgJCgnLmdhdGluZ0FydGljbGVfX2FjdGlvbnMubm8tbG9nZ2VkLWluJykuc2hvdygpO1xyXG4gICAgJCgnI2Rvd25sb2FkIC5ESExkb3dubG9hZF9fY3Rhcy5uby1sb2dnZWQtaW4nKS5zaG93KCk7XHJcbiAgICAkKCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZS5ub3QtbG9nZ2VkLWluJykuc2hvdygpO1xyXG4gICAgJCgnLmFydGljbGUtcGFnZS1sb2dpbi1jdGEnKS5zaG93KCk7XHJcblxyXG4gICAgJCgnLmdhdGVkJykuYWRkQ2xhc3MoJ2xvY2tlZCcpLnJlbW92ZUNsYXNzKCd1bmxvY2tlZCcpLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICQoaXRlbSkuY2xvc2VzdCgnYm9keScpLmZpbmQoJy5oZXJvIC5oZXJvX19jdGEtLWdyZXknKS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICAgICQoJy5nYXRlZC1oaWRlJykuYWRkQ2xhc3MoJ2xvY2tlZCcpLnJlbW92ZUNsYXNzKCd1bmxvY2tlZCcpO1xyXG5cclxuICAgIHZhciBuZXdzbGV0dGVyQ29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuTmV3c2xldHRlclN1YnNjcmliZWQnKTtcclxuICAgIGlmIChuZXdzbGV0dGVyQ29va2llICE9PSBudWxsKSB7XHJcbiAgICAgICQoJy5hcnRpY2xlR3JpZCAuYXJ0aWNsZS1ncmlkLWl0ZW0tbG9nZ2VkaW4nKS5zaG93KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcuYXJ0aWNsZUdyaWQgLmFydGljbGUtZ3JpZC1pdGVtLXN1YnNjcmliZScpLnNob3coKTtcclxuICAgICAgJCgnLnN1YnNjcmliZVBhbmVsJykuc2hvdygpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEF1dGhlbnRpY2F0aW9uRXZlbnRzKCk7XHJcbiIsImNsYXNzIEJhY2tCdXR0b24ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5iYWNrQnV0dG9uJyxcclxuICAgICAgYmFja0J1dHRvbjogJy5iYWNrQnV0dG9uX19idXR0b24tLWJhY2snLFxyXG4gICAgICBmb3J3YXJkQnV0dG9uOiAnLmJhY2tCdXR0b25fX2J1dHRvbi0tZm9yd2FyZCdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dCdXR0b24gPSB0aGlzLnNob3dCdXR0b24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nb0JhY2sgPSB0aGlzLmdvQmFjay5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nb0ZvcndhcmQgPSB0aGlzLmdvRm9yd2FyZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0SGVhZHJvb20gPSB0aGlzLmluaXRIZWFkcm9vbS5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc2hvd0J1dHRvbigpIHtcclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnYmFja0J1dHRvbi0tc2hvdycpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmJhY2tCdXR0b24sIHRoaXMuZ29CYWNrKTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmZvcndhcmRCdXR0b24sIHRoaXMuZ29Gb3J3YXJkKTtcclxuICB9XHJcblxyXG4gIGdvQmFjayhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBoaXN0b3J5LmJhY2soLTEpO1xyXG4gIH1cclxuXHJcbiAgZ29Gb3J3YXJkKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGhpc3RvcnkuZm9yd2FyZCgpO1xyXG4gIH1cclxuXHJcbiAgaW5pdEhlYWRyb29tKCkge1xyXG4gICAgbGV0IGNvbXBvbmVudCA9ICQodGhpcy5zZWwuY29tcG9uZW50KVswXTtcclxuICAgIGxldCBoZWFkcm9vbSAgPSBuZXcgSGVhZHJvb20oY29tcG9uZW50LCB7XHJcbiAgICAgIGNsYXNzZXM6IHtcclxuICAgICAgICBpbml0aWFsOiAnYmFja0J1dHRvbicsXHJcbiAgICAgICAgcGlubmVkOiAnYmFja0J1dHRvbi0tcGlubmVkJyxcclxuICAgICAgICB1bnBpbm5lZDogJ2JhY2tCdXR0b24tLXVucGlubmVkJyxcclxuICAgICAgICB0b3A6ICdiYWNrQnV0dG9uLS10b3AnLFxyXG4gICAgICAgIG5vdFRvcDogJ2JhY2tCdXR0b24tLW5vdC10b3AnLFxyXG4gICAgICAgIGJvdHRvbTogJ2JhY2tCdXR0b24tLWJvdHRvbScsXHJcbiAgICAgICAgbm90Qm90dG9tOiAnYmFja0J1dHRvbi0tbm90LWJvdHRvbSdcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBoZWFkcm9vbS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgbGV0IHN0YW5kYWxvbmUgPSAod2luZG93Lm1hdGNoTWVkaWEoJyhkaXNwbGF5LW1vZGU6IHN0YW5kYWxvbmUpJykubWF0Y2hlcykgfHwgKHdpbmRvdy5uYXZpZ2F0b3Iuc3RhbmRhbG9uZSk7XHJcbiAgICBpZiAoIXN0YW5kYWxvbmUpIHJldHVybjtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgdGhpcy5zaG93QnV0dG9uKCk7XHJcbiAgICB0aGlzLmluaXRIZWFkcm9vbSgpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEJhY2tCdXR0b24oKTtcclxuIiwiY2xhc3MgQm9vdHN0cmFwQ2Fyb3VzZWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5jYXJvdXNlbCcsXG4gICAgICBpdGVtczogJy5jYXJvdXNlbC1pdGVtJyxcbiAgICAgIGxpbms6ICcuY2F0ZWdvcnlIZXJvX19saW5rJ1xuICAgIH07XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5jaGVja051bWJlclNsaWRlcyA9IHRoaXMuY2hlY2tOdW1iZXJTbGlkZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRvdWNoU3dpcGVDYXJvdXNlbCA9IHRoaXMudG91Y2hTd2lwZUNhcm91c2VsLmJpbmQodGhpcyk7XG4gIH1cblxuICBjaGVja051bWJlclNsaWRlcygpIHtcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZWFjaCgoaW5kZXgsICRlbG0pID0+IHtcbiAgICAgIGlmICgkKCRlbG0pLmZpbmQodGhpcy5zZWwuaXRlbXMpLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICQoJGVsbSkuYWRkQ2xhc3MoJ3N0YXRpYycpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdG91Y2hTd2lwZUNhcm91c2VsKCkge1xuICAgIGxldCBpc1N3aXBlID0gZmFsc2U7XG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnN3aXBlKHtcbiAgICAgIHN3aXBlOiAoZXZlbnQsIGRpcmVjdGlvbikgPT4ge1xuICAgICAgICBsZXQgJGNhcm91c2VsID0gKCQoZXZlbnQudGFyZ2V0KS5pcyh0aGlzLnNlbC5jb21wb25lbnQpID8gJChldmVudC50YXJnZXQpIDogJChldmVudC50YXJnZXQpLnBhcmVudHModGhpcy5zZWwuY29tcG9uZW50KSk7XG4gICAgICAgIGlzU3dpcGUgPSB0cnVlO1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAkY2Fyb3VzZWwuY2Fyb3VzZWwoJ25leHQnKTtcbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAkY2Fyb3VzZWwuY2Fyb3VzZWwoJ3ByZXYnKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRhcDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIHRhcmdldCB2YXJpYWJsZSByZXByZXNlbnRzIHRoZSBjbGlja2VkIG9iamVjdFxuICAgICAgICBpZiAoJCgnLmNhdGVnb3J5SGVyb19fbGluaycpLmxlbmd0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8IDk5Mikge1xuICAgICAgICAgIGxldCBocmVmID0gJChldmVudC50YXJnZXQpLnBhcmVudHMoJy5jYXRlZ29yeUhlcm9fX2xpbmsnKS5maXJzdCgpLmF0dHIoJ2RhdGEtaHJlZicpO1xuICAgICAgICAgIGlmIChocmVmICE9PSAnJykge1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gaHJlZjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhbGxvd1BhZ2VTY3JvbGw6ICd2ZXJ0aWNhbCdcbiAgICB9KTtcblxuICAgICQodGhpcy5zZWwubGluaykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFpc1N3aXBlKSB7XG4gICAgICAgIGxldCBocmVmID0gJCh0aGlzKS5hdHRyKCdkYXRhLWhyZWYnKTtcbiAgICAgICAgaWYgKGhyZWYgIT09ICcnKSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gaHJlZjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaXNTd2lwZSA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy50b3VjaFN3aXBlQ2Fyb3VzZWwoKTtcbiAgICB0aGlzLmNoZWNrTnVtYmVyU2xpZGVzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEJvb3RzdHJhcENhcm91c2VsKCk7XG4iLCJjbGFzcyBDb21wZXRpdGlvbkZvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jb25maWcgPSB7XHJcbiAgICAgIHVybFRva2VuOiAnL2xpYnMvZ3Jhbml0ZS9jc3JmL3Rva2VuLmpzb24nLFxyXG4gICAgICB1cmxSZWZyZXNoQ2hlY2s6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcclxuICAgICAgdXJsR2V0QWxsRGV0YWlsczogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9nZXRkZXRhaWxzL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxDb21wZXRpdGlvbjogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9jb21wZXRpdGlvbi9pbmRleC5qc29uJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLmNvbXBldGl0aW9uRGF0YUNhcHR1cmUgZm9ybSdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZWFkQ29va2llID0gdGhpcy5yZWFkQ29va2llLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMudHJ5Q29tcGV0aXRpb25FbnRyeUxvZ2dlZEluID0gdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4uYmluZCh0aGlzKTtcclxuICAgIHRoaXMudHJ5Q29tcGV0aXRpb25FbnRyeU5vdExvZ2dlZEluID0gdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5Tm90TG9nZ2VkSW4uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY29tcGxldGVDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4gPSB0aGlzLmNvbXBsZXRlQ29tcGV0aXRpb25FbnRyeUxvZ2dlZEluLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gIH1cclxuXHJcbiAgZ2V0UGF0aFByZWZpeCgpIHtcclxuICAgIGNvbnN0IHByZWZpeCA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLXByZWZpeFxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XHJcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcclxuICB9XHJcblxyXG4gIHJlYWRDb29raWUobmFtZSkge1xyXG4gICAgdmFyIG5hbWVFUSA9IG5hbWUgKyAnPSc7XHJcbiAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGMgPSBjYVtpXTtcclxuICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XHJcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHRoaXMudmFsaWRhdGUoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGUoKSB7XHJcbiAgICB2YXIgY29tcGV0aXRpb25FbnRyeSA9ICQodGhpcy5zZWwuY29tcG9uZW50KTtcclxuXHJcbiAgICBpZiAoY29tcGV0aXRpb25FbnRyeS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGNvbXBldGl0aW9uRW50cnkuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgICBpZiAoJChpdGVtKS5jbG9zZXN0KCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZScpLmhhc0NsYXNzKCdub3QtbG9nZ2VkLWluJykpIHtcclxuICAgICAgICAgICQoaXRlbSkudmFsaWRhdGUoe1xyXG4gICAgICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICAgIHJlZ2lzdGVyX195b3VyRW1haWw6ICdlbWFpbCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VibWl0SGFuZGxlcjogKGZvcm0pID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLnRyeUNvbXBldGl0aW9uRW50cnlOb3RMb2dnZWRJbihmb3JtKTtcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGl0ZW0pLnZhbGlkYXRlKHtcclxuICAgICAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VibWl0SGFuZGxlcjogKGZvcm0pID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLnRyeUNvbXBldGl0aW9uRW50cnlMb2dnZWRJbihmb3JtKTtcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgdHJ5Q29tcGV0aXRpb25FbnRyeU5vdExvZ2dlZEluKGZvcm0pIHtcclxuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xyXG5cclxuICAgIHZhciBkYXRhID0geyB9O1xyXG4gICAgaWYgKGZybS5maW5kKCcuY29tcC1hbnN3ZXInKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgdmFyIGFuc3dlciA9IGZybS5maW5kKFwiaW5wdXRbdHlwZT0ncmFkaW8nXTpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgICBpZiAoYW5zd2VyID09PSBudWxsIHx8IGFuc3dlci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBhbGVydCgnUGxlYXNlIHNlbGVjdCBhbiBvcHRpb24nKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgZmlyc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2ZpcnN0TmFtZScpLnZhbCgpLFxyXG4gICAgICAgIGxhc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2xhc3ROYW1lJykudmFsKCksXHJcbiAgICAgICAgZW1haWw6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9feW91ckVtYWlsJykudmFsKCksXHJcblxyXG4gICAgICAgIHBvc2l0aW9uOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3Bvc2l0aW9uJykudmFsKCksXHJcbiAgICAgICAgY29udGFjdDogZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX19jb250YWN0TnVtYmVyJykudmFsKCksXHJcbiAgICAgICAgc2l6ZTogZnJtLmZpbmQoJ3NlbGVjdCNyZWdpc3Rlcl9fYnVzaW5lc3NTaXplJykudmFsKCksXHJcbiAgICAgICAgc2VjdG9yOiBmcm0uZmluZCgnc2VsZWN0I3JlZ2lzdGVyX19idXNpbmVzc1NlY3RvcicpLnZhbCgpLFxyXG5cclxuICAgICAgICBwYXRoOiBmcm0uZGF0YSgncGF0aCcpLFxyXG4gICAgICAgIGFuc3dlcjogYW5zd2VyXHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkYXRhID0ge1xyXG4gICAgICAgIGZpcnN0bmFtZTogZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX19maXJzdE5hbWUnKS52YWwoKSxcclxuICAgICAgICBsYXN0bmFtZTogZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX19sYXN0TmFtZScpLnZhbCgpLFxyXG4gICAgICAgIGVtYWlsOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3lvdXJFbWFpbCcpLnZhbCgpLFxyXG5cclxuICAgICAgICBwb3NpdGlvbjogZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX19wb3NpdGlvbicpLnZhbCgpLFxyXG4gICAgICAgIGNvbnRhY3Q6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fY29udGFjdE51bWJlcicpLnZhbCgpLFxyXG4gICAgICAgIHNpemU6IGZybS5maW5kKCdzZWxlY3QjcmVnaXN0ZXJfX2J1c2luZXNzU2l6ZScpLnZhbCgpLFxyXG4gICAgICAgIHNlY3RvcjogZnJtLmZpbmQoJ3NlbGVjdCNyZWdpc3Rlcl9fYnVzaW5lc3NTZWN0b3InKS52YWwoKSxcclxuXHJcbiAgICAgICAgcGF0aDogZnJtLmRhdGEoJ3BhdGgnKVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgZnJtLmZpbmQoJy5jb21wLWFuc3dlcicpLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgdmFyIHZhbCA9ICQoaXRlbSkudmFsKCk7XHJcbiAgICAgICAgaWYgKCQoaXRlbSkuZGF0YSgnaW5kZXgnKSA9PT0gMSkge1xyXG4gICAgICAgICAgZGF0YS5hbnN3ZXIgPSB2YWw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRhdGFbJ2Fuc3dlcicgKyAkKGl0ZW0pLmRhdGEoJ2luZGV4JyldID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoKCQudHJpbShkYXRhLmZpcnN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEubGFzdG5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShkYXRhLmVtYWlsKS5sZW5ndGggPT09IDApKSB7XHJcbiAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgeW91ciBuYW1lLCBlbWFpbCBhZGRyZXNzIGFuZCBjb21wZXRpdGlvbiBkZXRhaWxzLicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybENvbXBldGl0aW9uLFxyXG4gICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vZGFsID0gZnJtLmNsb3Nlc3QoJy5jb21wZXRpdGlvbi1jb250YWluZXInKS5maW5kKCcubW9kYWwnKTtcclxuICAgICAgICAgICAgICAgIG1vZGFsLmZpbmQoJy50aGFua3MtbmFtZScpLnRleHQoZGF0YS5maXJzdG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgLy8gbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgIG1vZGFsLnNob3coKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZybS5jbG9zZXN0KCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLlxcbicgKyByZXNwb25zZS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgnRW50ZXIgdGhlIGNvbXBldGl0aW9uJyk7XHJcbiAgICAgICAgICAgIGZybS5maW5kKFwiaW5wdXRbdHlwZT0nc3VibWl0J11cIikudmFsKCdFbnRlciB0aGUgY29tcGV0aXRpb24nKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0cnlDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4oZm9ybSkge1xyXG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XHJcbiAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgdmFyIGNvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLkF1dGhUb2tlbicpO1xyXG4gICAgaWYgKGNvb2tpZSAhPT0gbnVsbCkge1xyXG4gICAgICB2YXIgc3BsaXQgPSBjb29raWUuc3BsaXQoJ3wnKTtcclxuICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybEdldEFsbERldGFpbHMsXHJcbiAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHNwbGl0WzBdLCB0b2tlbjogc3BsaXRbMV0gfSxcclxuICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChhbGxEZXRhaWxzUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZXRlQ29tcGV0aXRpb25FbnRyeUxvZ2dlZEluKGZvcm0sIGFsbERldGFpbHNSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIHJlZnJlc2hDb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nKTtcclxuICAgICAgaWYgKHJlZnJlc2hDb29raWUgIT09IG51bGwpIHtcclxuICAgICAgICB2YXIgcmVmcmVzaFNwbGl0ID0gcmVmcmVzaENvb2tpZS5zcGxpdCgnfCcpO1xyXG4gICAgICAgIGlmIChyZWZyZXNoU3BsaXQubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxSZWZyZXNoQ2hlY2ssXHJcbiAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogcmVmcmVzaFNwbGl0WzBdLCByZWZyZXNoX3Rva2VuOiByZWZyZXNoU3BsaXRbMV0gfSxcclxuICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgc3VjY2VzczogKHJlZnJlc2hSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyByZWZyZXNoUmVzcG9uc2UsIHRydWUgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4oZm9ybSk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbXBsZXRlQ29tcGV0aXRpb25FbnRyeUxvZ2dlZEluKGZvcm0sIGRldGFpbHMpIHtcclxuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xyXG5cclxuICAgIHZhciBhbnN3ZXIgPSAnJztcclxuICAgIGlmIChmcm0uZmluZCgnLmNvbXAtYW5zd2VyJykubGVuZ3RoID4gMCkge1xyXG4gICAgICBhbnN3ZXIgPSBmcm0uZmluZCgnLmNvbXAtYW5zd2VyJykudmFsKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhbnN3ZXIgPSBmcm0uZmluZChcImlucHV0W3R5cGU9J3JhZGlvJ106Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgICAgaWYgKGFuc3dlciA9PT0gbnVsbCB8fCBhbnN3ZXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgYWxlcnQoJ1BsZWFzZSBzZWxlY3QgYW4gb3B0aW9uJyk7XHJcbiAgICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgnRW50ZXIgdGhlIGNvbXBldGl0aW9uICcgKyBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9maXJzdG5hbWUpO1xyXG4gICAgICAgIGZybS5maW5kKFwiaW5wdXRbdHlwZT0nc3VibWl0J11cIikudmFsKCdFbnRlciB0aGUgY29tcGV0aXRpb24gJyArIGRldGFpbHMucmVnaXN0cmF0aW9uX2ZpcnN0bmFtZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIGZpcnN0bmFtZTogZGV0YWlscy5yZWdpc3RyYXRpb25fZmlyc3RuYW1lLFxyXG4gICAgICBsYXN0bmFtZTogZGV0YWlscy5yZWdpc3RyYXRpb25fbGFzdG5hbWUsXHJcbiAgICAgIGVtYWlsOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9lbWFpbCxcclxuXHJcbiAgICAgIHBvc2l0aW9uOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9wb3NpdGlvbixcclxuICAgICAgY29udGFjdDogZGV0YWlscy5yZWdpc3RyYXRpb25fY29udGFjdCxcclxuICAgICAgc2l6ZTogZGV0YWlscy5yZWdpc3RyYXRpb25fc2l6ZSxcclxuICAgICAgc2VjdG9yOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9zZWN0b3IsXHJcblxyXG4gICAgICBwYXRoOiBmcm0uZGF0YSgncGF0aCcpLFxyXG4gICAgICBhbnN3ZXI6IGFuc3dlclxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoKCQudHJpbShkYXRhLmFuc3dlcikubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEuZmlyc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS5sYXN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEuZW1haWwpLmxlbmd0aCA9PT0gMCkpIHtcclxuICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciB5b3VyIG5hbWUsIGVtYWlsIGFkZHJlc3MgYW5kIGNvbXBldGl0aW9uIGRldGFpbHMuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgICBmcm0uZmluZChcImlucHV0W3R5cGU9J3N1Ym1pdCddXCIpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcclxuXHJcbiAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxDb21wZXRpdGlvbixcclxuICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtb2RhbCA9IGZybS5jbG9zZXN0KCcuY29tcGV0aXRpb24tY29udGFpbmVyJykuZmluZCgnLm1vZGFsJyk7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCcudGhhbmtzLW5hbWUnKS50ZXh0KGRhdGEuZmlyc3RuYW1lKTtcclxuICAgICAgICAgICAgICAgIC8vIG1vZGFsLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5zaG93KCkuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmcm0uY2xvc2VzdCgnLmNvbXBldGl0aW9uRGF0YUNhcHR1cmUnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0VudGVyIHRoZSBjb21wZXRpdGlvbiAnICsgZGF0YS5maXJzdG5hbWUpO1xyXG4gICAgICAgICAgICBmcm0uZmluZChcImlucHV0W3R5cGU9J3N1Ym1pdCddXCIpLnZhbCgnRW50ZXIgdGhlIGNvbXBldGl0aW9uICcgKyBkYXRhLmZpcnN0bmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0VudGVyIHRoZSBjb21wZXRpdGlvbicpO1xyXG4gICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ0VudGVyIHRoZSBjb21wZXRpdGlvbicpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IENvbXBldGl0aW9uRm9ybSgpO1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgSURCOiB7XHJcbiAgICBEQjogJ29mZmxpbmUtYXJ0aWNsZXMnLFxyXG4gICAgQVJUSUNMRVNfU1RPUkU6ICdhcnRpY2xlcydcclxuICB9XHJcbn07XHJcbiIsImNsYXNzIENvb2tpZUJhbm5lciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLmNvb2tpZS1iYW5uZXInLFxyXG4gICAgICBjbG9zZUJ1dHRvbjogJy5jb29raWUtYmFubmVyX19idXR0b24nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuY29va2llTmFtZSA9ICdkaGwtY29va2llLXdhcm5pbmcnO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmhpZGVDb29raWVCYW5uZXIgPSB0aGlzLmhpZGVDb29raWVCYW5uZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd0Nvb2tpZUJhbm5lciA9IHRoaXMuc2hvd0Nvb2tpZUJhbm5lci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kaXNwbGF5QmFubmVyID0gdGhpcy5kaXNwbGF5QmFubmVyLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICB0aGlzLmRpc3BsYXlCYW5uZXIoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNsb3NlQnV0dG9uLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuaGlkZUNvb2tpZUJhbm5lcigpO1xyXG4gICAgICBDb29raWVzLnNldCh0aGlzLmNvb2tpZU5hbWUsIHtzZWVuOiAxfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRpc3BsYXlCYW5uZXIoKSB7XHJcbiAgICBsZXQgY29va2llID0gQ29va2llcy5nZXQodGhpcy5jb29raWVOYW1lKTtcclxuXHJcbiAgICBpZiAodHlwZW9mIGNvb2tpZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGhpcy5zaG93Q29va2llQmFubmVyKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzaG93Q29va2llQmFubmVyKCkge1xyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdjb29raWUtYmFubmVyLS1kaXNwbGF5Jyk7XHJcbiAgfVxyXG5cclxuICBoaWRlQ29va2llQmFubmVyKCkge1xyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnJlbW92ZUNsYXNzKCdjb29raWUtYmFubmVyLS1kaXNwbGF5Jyk7XHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkucmVtb3ZlKCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgQ29va2llQmFubmVyKCk7XHJcbiIsImltcG9ydCBDb25zdGFudHMgZnJvbSAnLi9Db25zdGFudHMnO1xyXG5cclxuY2xhc3MgRGF0YWJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5kYXRhYmFzZSA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5pbml0aWF0ZURiID0gdGhpcy5pbml0aWF0ZURiLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmFkZEFydGljbGUgPSB0aGlzLmFkZEFydGljbGUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZGVsZXRlQXJ0aWNsZSA9IHRoaXMuZGVsZXRlQXJ0aWNsZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRBcnRpY2xlcyA9IHRoaXMuZ2V0QXJ0aWNsZXMuYmluZCh0aGlzKTtcclxuXHJcbiAgICAvLyBDcmVhdGUvZ2V0IERCXHJcbiAgICBpZiAod2luZG93LlByb21pc2UpIHtcclxuICAgICAgdGhpcy5pbml0aWF0ZURiKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0aWF0ZURiKCkge1xyXG4gICAgdGhpcy5kYXRhYmFzZSA9IGlkYi5vcGVuKENvbnN0YW50cy5JREIuREIsIDEsICh1cGdyYWRlRGIpID0+IHtcclxuICAgICAgaWYgKCF1cGdyYWRlRGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhDb25zdGFudHMuSURCLkFSVElDTEVTX1NUT1JFKSkge1xyXG4gICAgICAgIGxldCBhcnRpY2xlT1MgPSB1cGdyYWRlRGIuY3JlYXRlT2JqZWN0U3RvcmUoQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRSwge1xyXG4gICAgICAgICAga2V5UGF0aDogJ2xpbmsnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCd0aXRsZScsICd0aXRsZScsIHt1bmlxdWU6IGZhbHNlfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdsaW5rJywgJ2xpbmsnLCB7dW5pcXVlOiB0cnVlfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdkZXNjcmlwdGlvbicsICdkZXNjcmlwdGlvbicsIHt1bmlxdWU6IGZhbHNlfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdjYXRlZ29yeU5hbWUnLCAnY2F0ZWdvcnlOYW1lJywge3VuaXF1ZTogZmFsc2V9KTtcclxuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2NhdGVnb3J5TGluaycsICdjYXRlZ29yeUxpbmsnLCB7dW5pcXVlOiBmYWxzZX0pO1xyXG4gICAgICAgIGFydGljbGVPUy5jcmVhdGVJbmRleCgndGltZVRvUmVhZCcsICd0aW1lVG9SZWFkJywge3VuaXF1ZTogZmFsc2V9KTtcclxuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2ltYWdlTW9iaWxlJywgJ2ltYWdlTW9iaWxlJywge3VuaXF1ZTogZmFsc2V9KTtcclxuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2ltYWdlRGVza3RvcCcsICdpbWFnZURlc2t0b3AnLCB7dW5pcXVlOiBmYWxzZX0pO1xyXG4gICAgICAgIGFydGljbGVPUy5jcmVhdGVJbmRleCgnaXNMYXJnZScsICdpc0xhcmdlJywge3VuaXF1ZTogZmFsc2V9KTtcclxuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2lzVmlkZW8nLCAnaXNWaWRlbycsIHt1bmlxdWU6IGZhbHNlfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdjYWNoZU5hbWUnLCAnY2FjaGVOYW1lJywge3VuaXF1ZTogZmFsc2V9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkZWxldGVBcnRpY2xlKGxpbmspIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFiYXNlLnRoZW4oKGRiKSA9PiB7XHJcbiAgICAgIGxldCB0cmFuc2FjdGlvbiA9IGRiLnRyYW5zYWN0aW9uKFtDb25zdGFudHMuSURCLkFSVElDTEVTX1NUT1JFXSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgICBsZXQgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShDb25zdGFudHMuSURCLkFSVElDTEVTX1NUT1JFKTtcclxuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcclxuICAgICAgICBzdG9yZS5kZWxldGUobGluayksXHJcbiAgICAgICAgdHJhbnNhY3Rpb24uY29tcGxldGVcclxuICAgICAgXSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZEFydGljbGUodGl0bGUsIGxpbmssIGRlc2NyaXB0aW9uLCBjYXRlZ29yeU5hbWUsIGNhdGVnb3J5TGluaywgdGltZVRvUmVhZCwgaW1hZ2VNb2JpbGUsIGltYWdlRGVza3RvcCwgaXNMYXJnZSwgaXNWaWRlbywgY2FjaGVOYW1lKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZS50aGVuKChkYikgPT4ge1xyXG4gICAgICBsZXQgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihbQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRV0sICdyZWFkd3JpdGUnKTtcclxuICAgICAgbGV0IHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRSk7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgc3RvcmUuYWRkKHtcclxuICAgICAgICAgIHRpdGxlLFxyXG4gICAgICAgICAgbGluayxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgY2F0ZWdvcnlOYW1lLFxyXG4gICAgICAgICAgY2F0ZWdvcnlMaW5rLFxyXG4gICAgICAgICAgdGltZVRvUmVhZCxcclxuICAgICAgICAgIGltYWdlTW9iaWxlLFxyXG4gICAgICAgICAgaW1hZ2VEZXNrdG9wLFxyXG4gICAgICAgICAgaXNMYXJnZSxcclxuICAgICAgICAgIGlzVmlkZW8sXHJcbiAgICAgICAgICBjYWNoZU5hbWVcclxuICAgICAgICB9KSxcclxuICAgICAgICB0cmFuc2FjdGlvbi5jb21wbGV0ZVxyXG4gICAgICBdKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXJ0aWNsZXMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZS50aGVuKChkYikgPT4ge1xyXG4gICAgICBsZXQgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihbQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRV0sICdyZWFkb25seScpO1xyXG4gICAgICBsZXQgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShDb25zdGFudHMuSURCLkFSVElDTEVTX1NUT1JFKTtcclxuICAgICAgcmV0dXJuIHN0b3JlLmdldEFsbCgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgRGF0YWJhc2UoKTtcclxuIiwiY2xhc3MgRGVsZXRlQWNjb3VudEZvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jb25maWcgPSB7XHJcbiAgICAgIHVybFRva2VuOiAnL2xpYnMvZ3Jhbml0ZS9jc3JmL3Rva2VuLmpzb24nLFxyXG4gICAgICB1cmxSZWZyZXNoQ2hlY2s6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcclxuICAgICAgdXJsR2V0QWxsRGV0YWlsczogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9nZXRkZXRhaWxzL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxEZWxldGVBY2NvdW50OiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL2RlbGV0ZWFjY291bnQvaW5kZXguanNvbidcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5kZWxldGUtYWNjb3VudCdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldFBhdGhIb21lID0gdGhpcy5nZXRQYXRoSG9tZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVhZENvb2tpZSA9IHRoaXMucmVhZENvb2tpZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jbGVhckNvb2tpZSA9IHRoaXMuY2xlYXJDb29raWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY3JlYXRlQ29va2llID0gdGhpcy5jcmVhdGVDb29raWUuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnRyeURlbGV0ZUFjY291bnQgPSB0aGlzLnRyeURlbGV0ZUFjY291bnQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY29tcGxldGVEZWxldGVBY2NvdW50ID0gdGhpcy5jb21wbGV0ZURlbGV0ZUFjY291bnQuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmxvZ2dlZEluID0gdGhpcy5sb2dnZWRJbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5ub3RMb2dnZWRJbiA9IHRoaXMubm90TG9nZ2VkSW4uYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldFBhdGhQcmVmaXgoKSB7XHJcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xyXG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoSG9tZSgpIHtcclxuICAgIGNvbnN0IGhvbWUgPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1ob21lXFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAoaG9tZSA/IGhvbWUgOiAnJyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgncGFzc3dvcmQnLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJChlbGVtZW50KS5hdHRyKCdwYXR0ZXJuJykpLnRlc3QodmFsdWUpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkIGZvcm1hdCBpcyBub3QgdmFsaWQnKTtcclxuXHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnZXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICByZXR1cm4gKCQoJyMnICsgJChlbGVtZW50KS5hdHRyKCdkYXRhLWVxdWFsVG8nKSkudmFsKCkgPT09ICQoZWxlbWVudCkudmFsKCkpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnKTtcclxuXHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJsb2dnZWRpbi5ESEwnLCAoZXZ0LCB0b2tlbkRhdGEpID0+IHtcclxuICAgICAgdGhpcy5sb2dnZWRJbih0b2tlbkRhdGEpO1xyXG4gICAgfSk7XHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJub3Rsb2dnZWRpbi5ESEwnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubm90TG9nZ2VkSW4oKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCdmb3JtJykudmFsaWRhdGUoe1xyXG4gICAgICBydWxlczoge1xyXG4gICAgICAgIGxvZ2luX19maXJzdE5hbWU6ICdlbWFpbCcsXHJcbiAgICAgICAgbG9naW5fX3Bhc3N3b3JkOiAncGFzc3dvcmQnXHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IChmb3JtKSA9PiB7XHJcbiAgICAgICAgdGhpcy50cnlEZWxldGVBY2NvdW50KGZvcm0pO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZWFkQ29va2llKG5hbWUpIHtcclxuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xyXG4gICAgdmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjID0gY2FbaV07XHJcbiAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xyXG4gICAgICBpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBjbGVhckNvb2tpZShuYW1lKSB7XHJcbiAgICB0aGlzLmNyZWF0ZUNvb2tpZShuYW1lLCAnJywgLTEpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlQ29va2llKG5hbWUsIHZhbHVlLCBleHBpcnlTZWNvbmRzKSB7XHJcbiAgICB2YXIgZXhwaXJlcyA9ICcnO1xyXG4gICAgaWYgKGV4cGlyeVNlY29uZHMpIHtcclxuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoZXhwaXJ5U2Vjb25kcyAqIDEwMDApKTtcclxuICAgICAgZXhwaXJlcyA9ICc7IGV4cGlyZXM9JyArIGRhdGUudG9VVENTdHJpbmcoKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyAnPScgKyB2YWx1ZSArIGV4cGlyZXMgKyAnOyBwYXRoPS8nO1xyXG4gIH1cclxuXHJcbiAgdHJ5RGVsZXRlQWNjb3VudChmb3JtKSB7XHJcbiAgICB2YXIgZnJtID0gJChmb3JtKTtcclxuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xyXG5cclxuICAgIHZhciBjb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcclxuICAgIGlmIChjb29raWUgIT09IG51bGwpIHtcclxuICAgICAgdmFyIHNwbGl0ID0gY29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgIGlmIChzcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxHZXRBbGxEZXRhaWxzLFxyXG4gICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiBzcGxpdFswXSwgdG9rZW46IHNwbGl0WzFdIH0sXHJcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIGFsbERldGFpbHNSZXNwb25zZSwgdHJ1ZSBdKTtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGV0ZURlbGV0ZUFjY291bnQoZm9ybSwgYWxsRGV0YWlsc1Jlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZGVsZXRlIHlvdXIgYWNjb3VudCAoMSkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICgyKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICgzKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgcmVmcmVzaENvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicpO1xyXG4gICAgICBpZiAocmVmcmVzaENvb2tpZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIHZhciByZWZyZXNoU3BsaXQgPSByZWZyZXNoQ29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgaWYgKHJlZnJlc2hTcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFJlZnJlc2hDaGVjayxcclxuICAgICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiByZWZyZXNoU3BsaXRbMF0sIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hTcGxpdFsxXSB9LFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICBzdWNjZXNzOiAocmVmcmVzaFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoUmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHJlZnJlc2hSZXNwb25zZSwgdHJ1ZSBdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyeURlbGV0ZUFjY291bnQoZm9ybSk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICg0KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQgKDUpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQgKDYpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZGVsZXRlIHlvdXIgYWNjb3VudC4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb21wbGV0ZURlbGV0ZUFjY291bnQoZm9ybSwgZGV0YWlscykge1xyXG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XHJcblxyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIHRva2VuOiBkZXRhaWxzLnRva2VuLFxyXG5cclxuICAgICAgdXNlcm5hbWU6IGZybS5maW5kKCdpbnB1dCNsb2dpbl9fZmlyc3ROYW1lJykudmFsKCksXHJcbiAgICAgIHBhc3N3b3JkOiBmcm0uZmluZCgnaW5wdXQjbG9naW5fX3Bhc3N3b3JkJykudmFsKClcclxuICAgIH07XHJcblxyXG4gICAgaWYgKCgkLnRyaW0oZGF0YS51c2VybmFtZSkubGVuZ3RoID09IDApIHx8ICgkLnRyaW0oZGF0YS5wYXNzd29yZCkubGVuZ3RoID09IDApKSB7XHJcbiAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgeW91ciBlbWFpbCBhZGRyZXNzIGFuZCBwYXNzd29yZC4nKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsRGVsZXRlQWNjb3VudCxcclxuICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogKGRlbGV0ZUFjY291bnRSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGVsZXRlQWNjb3VudFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIGRlbGV0ZUFjY291bnRSZXNwb25zZSwgdHJ1ZSBdKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGRlbGV0ZUFjY291bnRSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBmcm0uZGF0YSgnc3VjY2Vzc3VybCcpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50LlxcbicgKyBkZWxldGVBY2NvdW50UmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdEZWxldGUgQWNjb3VudCcpO1xyXG4gICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdEZWxldGUgQWNjb3VudCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdEZWxldGUgQWNjb3VudCcpO1xyXG4gICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgnRGVsZXRlIEFjY291bnQnKTtcclxuICB9XHJcblxyXG4gIGxvZ2dlZEluKHRva2VuRGF0YSkge1xyXG4gICAgaWYgKHRva2VuRGF0YSAmJiB0b2tlbkRhdGEuc3RhdHVzICYmIHRva2VuRGF0YS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5vdExvZ2dlZEluKCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5oYXNDbGFzcygnbm8tcmVkaXJlY3QnKSkge1xyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5nZXRQYXRoSG9tZSgpICsgJy5odG1sJztcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBEZWxldGVBY2NvdW50Rm9ybSgpO1xyXG4iLCJjbGFzcyBFY29tRm9ybXMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5lY29tLWZvcm0nLFxuICAgICAgY2xvc2VJY29uOiAnLmVjb20tZm9ybV9fY2xvc2UnLFxuICAgICAgbWF4Rm9ybTogJy5lY29tLWZvcm0tLW1heCcsXG4gICAgICBtaW5Gb3JtOiAnLmVjb20tZm9ybS0tbWluJyxcbiAgICAgIHN1Ym1pdEZvcm06ICcuZWNvbS1mb3JtIGlucHV0W3R5cGU9c3VibWl0XSdcbiAgICB9O1xuXG4gICAgdGhpcy5kaXNwbGF5Rm9ybUFmdGVyID0gNTAwMDtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZm9ybVRpbWVyID0gdGhpcy5mb3JtVGltZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3dIaWRlTWF4Rm9ybSA9IHRoaXMuc2hvd0hpZGVNYXhGb3JtLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaG93SGlkZU1pbkZvcm0gPSB0aGlzLnNob3dIaWRlTWluRm9ybS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0Rm9ybSA9IHRoaXMuc3VibWl0Rm9ybS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy5mb3JtVGltZXIoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuY2xvc2VJY29uLCAoKSA9PiB7XG4gICAgICB0aGlzLnNob3dIaWRlTWF4Rm9ybSgpO1xuICAgICAgdGhpcy5zaG93SGlkZU1pbkZvcm0oKTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnN1Ym1pdEZvcm0sIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBsZXQgZm9ybSA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJ2Zvcm0nKTtcbiAgICAgIHRoaXMuc3VibWl0Rm9ybShmb3JtKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZvcm1UaW1lcigpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2hvd0hpZGVNYXhGb3JtKCk7XG4gICAgfSwgdGhpcy5kaXNwbGF5Rm9ybUFmdGVyKTtcbiAgfVxuXG4gIHNob3dIaWRlTWF4Rm9ybSgpIHtcbiAgICAkKHRoaXMuc2VsLm1heEZvcm0pLnRvZ2dsZUNsYXNzKCdpcy1oaWRkZW4nKTtcbiAgfVxuXG4gIHNob3dIaWRlTWluRm9ybSgpIHtcbiAgICAkKHRoaXMuc2VsLm1pbkZvcm0pLnRvZ2dsZUNsYXNzKCdpcy1zaG93bicpO1xuICB9XG5cbiAgc3VibWl0Rm9ybShmb3JtKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBmb3JtLmF0dHIoJ2FjdGlvbicpICsgJz8nICsgZm9ybS5zZXJpYWxpemUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRWNvbUZvcm1zKCk7XG4iLCJpbXBvcnQgUGFzc3dvcmRWYWxpZGl0eSBmcm9tICcuL1Bhc3N3b3JkVmFsaWRpdHknO1xuXG5jbGFzcyBGb3JtVmFsaWRhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLmZvcm1zJ1xuICAgIH07XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYWRkUGFzc3dvcmRDaGVjayA9IHRoaXMuYWRkUGFzc3dvcmRDaGVjay5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICB0aGlzLmFkZFBhc3N3b3JkQ2hlY2soKTtcbiAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhZGRQYXNzd29yZENoZWNrKCkge1xuICAgICQudmFsaWRhdG9yLmFkZE1ldGhvZCgncGFzc3dvcmRDaGVjaycsICh2YWx1ZSkgPT4ge1xuICAgICAgcmV0dXJuIFBhc3N3b3JkVmFsaWRpdHkuaXNQYXNzd29yZFZhbGlkKHZhbHVlKTtcbiAgICB9LCAnUGxlYXNlIGVudGVyIGEgdmFsaWQgcGFzc3dvcmQnKTtcbiAgfVxuXG4gIHZhbGlkYXRlKCkge1xuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS52YWxpZGF0ZSh7XG4gICAgICBydWxlczoge1xuICAgICAgICAncmVxdWlyZWQnOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgJ3Bhc3N3b3JkJzoge1xuICAgICAgICAgIHBhc3N3b3JkQ2hlY2s6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgICAgICQoZWxlbWVudCkuYXBwZW5kKGVycm9yKTtcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBGb3JtVmFsaWRhdGlvbigpO1xuIiwiY2xhc3MgSGVhZGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMubGFzdExldHRlciA9ICcnO1xyXG4gICAgdGhpcy5hbGxTdWdnZXN0aW9ucyA9IFtdO1xyXG4gICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTE7XHJcbiAgICB0aGlzLm1heFN1Z2dlc3Rpb25zID0gMDtcclxuICAgIHRoaXMubGFzdFZhbCA9ICcnO1xyXG5cclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuaGVhZGVyJyxcclxuICAgICAgdG9nZ2xlOiAnLmhlYWRlcl9fbmF2aWdhdGlvbicsXHJcbiAgICAgIG1lbnU6ICcuaGVhZGVyX19tZWdhbmF2JyxcclxuICAgICAgb3ZlcmxheTogJy5oZWFkZXJfX292ZXJsYXknLFxyXG4gICAgICBzZWFyY2g6ICcuaGVhZGVyX19kZXNrdG9wU2VhcmNoJyxcclxuICAgICAgc2VhcmNoRm9ybTogJy5oZWFkZXJfX3NlYXJjaGZvcm0nLFxyXG4gICAgICBzZWFyY2hGb3JtRm9ybTogJy5oZWFkZXJfX3NlYXJjaGZvcm0gZm9ybScsXHJcbiAgICAgIHNlYXJjaEZvcm1JbnB1dDogJy5oZWFkZXJfX3NlYXJjaGZvcm0gLmZvcm0tZmllbGQnLFxyXG4gICAgICBzZWFyY2hGb3JtSW5wdXRDbGVhcjogJy5oZWFkZXJfX3NlYXJjaGZvcm0gLmZvcm0tZ3JvdXAgLmNsZWFyJyxcclxuICAgICAgc2VhcmNoU3VnZ2VzdGlvbnM6ICcuaGVhZGVyX19zZWFyY2hmb3JtIC5zdWdnZXN0aW9ucycsXHJcblxyXG4gICAgICBjb3VudHJ5OiAnLmhlYWRlcl9fZGVza3RvcENvdW50cnknLFxyXG4gICAgICBjb3VudHJ5Rm9ybTogJy5oZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbCcsXHJcbiAgICAgIGNvdW50cnlTZWNvbmRhcnk6ICcuaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwgLm1vYiAud2VsY29tZXMgYSdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5jb29raWVOYW1lID0gJ2RobC1kZWZhdWx0LWxhbmd1YWdlJztcclxuXHJcbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSAwO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnRvZ2dsZU1lbnUgPSB0aGlzLnRvZ2dsZU1lbnUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMudG9nZ2xlU2VhcmNoID0gdGhpcy50b2dnbGVTZWFyY2guYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd1NlYXJjaCA9IHRoaXMuc2hvd1NlYXJjaC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oaWRlU2VhcmNoID0gdGhpcy5oaWRlU2VhcmNoLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnRvZ2dsZUNvdW50cnkgPSB0aGlzLnRvZ2dsZUNvdW50cnkuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd0NvdW50cnkgPSB0aGlzLnNob3dDb3VudHJ5LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmhpZGVDb3VudHJ5ID0gdGhpcy5oaWRlQ291bnRyeS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZWxlY3RDb3VudHJ5U2Vjb25kYXJ5ID0gdGhpcy5zZWxlY3RDb3VudHJ5U2Vjb25kYXJ5LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJvZHlTY3JvbGxpbmcgPSB0aGlzLmJvZHlTY3JvbGxpbmcuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmNoZWNrU2Nyb2xsID0gdGhpcy5jaGVja1Njcm9sbC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ2tleWRvd24nLCB0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQsIChlKSA9PiB7XHJcbiAgICAgIC8vIGRvd24gYXJyb3cgPSA0MFxyXG4gICAgICAvLyByaWdodCBhcnJvdyA9IDM5XHJcbiAgICAgIC8vIHVwIGFycm93ID0gMzhcclxuICAgICAgLy8gbGVmdCBhcnJvdyA9IDM3XHJcbiAgICAgIC8vIHRhYiA9IDlcclxuICAgICAgaWYgKChlLmtleUNvZGUgPT09IDkgJiYgKCFlLnNoaWZ0S2V5KSkgfHwgKGUua2V5Q29kZSA9PT0gNDApIHx8IChlLmtleUNvZGUgPT09IDM5KSkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCsrO1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPj0gdGhpcy5tYXhTdWdnZXN0aW9ucykge1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zaG93U3VnZ2VzdGlvbnModHJ1ZSk7XHJcblxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSBpZiAoKGUua2V5Q29kZSA9PT0gOSAmJiAoZS5zaGlmdEtleSkpIHx8IChlLmtleUNvZGUgPT09IDM3KSB8fCAoZS5rZXlDb2RlID09PSAzOCkpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgtLTtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4IDwgMCkge1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gdGhpcy5tYXhTdWdnZXN0aW9ucyAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2hvd1N1Z2dlc3Rpb25zKHRydWUpO1xyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0pO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2tleXByZXNzJywgdGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0LCAoZSkgPT4ge1xyXG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xyXG4gICAgICAgIHZhciBmaWVsZCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICB2YXIgcGFyYW1OYW1lID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmF0dHIoJ25hbWUnKTtcclxuICAgICAgICB2YXIgdGVybSA9IGZpZWxkLnZhbCgpLnRyaW0oKTtcclxuICAgICAgICB2YXIgdXJsID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignYWN0aW9uJykgKyAnPycgKyBwYXJhbU5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodGVybSk7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdXJsO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdrZXl1cCcsIHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCwgKGUpID0+IHtcclxuICAgICAgaWYgKChlLmtleUNvZGUgPT09IDE2KSB8fCAoZS5rZXlDb2RlID09PSA5KSB8fCAoZS5rZXlDb2RlID09PSA0MCkgfHwgKGUua2V5Q29kZSA9PT0gMzkpIHx8IChlLmtleUNvZGUgPT09IDM3KSB8fCAoZS5rZXlDb2RlID09PSAzOCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBmaWVsZCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgaWYgKGZpZWxkLnZhbCgpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkKCcudG9wLXNlYXJjaGVzJywgdGhpcy5zZWwuY29tcG9uZW50KS5oaWRlKCk7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXRDbGVhcikuc2hvdygpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tTdWdnZXN0aW9ucyhmaWVsZCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXRDbGVhcikuaGlkZSgpO1xyXG4gICAgICAgICQoJy50b3Atc2VhcmNoZXMnLCB0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXRDbGVhciwgKGUpID0+IHtcclxuICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLnZhbCgnJyk7XHJcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0Q2xlYXIpLmhpZGUoKTtcclxuICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwudG9nZ2xlLCAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMudG9nZ2xlTWVudSgpO1xyXG4gICAgfSk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5vdmVybGF5LCB0aGlzLnRvZ2dsZU1lbnUpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuc2VhcmNoLCB0aGlzLnRvZ2dsZVNlYXJjaCk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5jb3VudHJ5LCB0aGlzLnRvZ2dsZUNvdW50cnkpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuY291bnRyeVNlY29uZGFyeSwgdGhpcy5zZWxlY3RDb3VudHJ5U2Vjb25kYXJ5KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmhlYWRlcl9fbGFuZywgLmhlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsIC5sYW5ncyBhLCAuaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwgLmNvdW50cmllcyBhJywgKGV2dCkgPT4ge1xyXG4gICAgICBsZXQgaHJlZiA9ICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgbGV0IGhvbWUgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5hdHRyKCdkYXRhLWhvbWUnKTtcclxuICAgICAgaWYgKGhvbWUgIT09IG51bGwgJiYgaG9tZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgaHJlZiA9IGhvbWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIENvb2tpZXMuc2V0KHRoaXMuY29va2llTmFtZSwgaHJlZik7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIHRoaXMuY2hlY2tTY3JvbGwpO1xyXG4gICAgdGhpcy5jaGVja1Njcm9sbCgpO1xyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkubGVuZ3RoID4gMCkge1xyXG4gICAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLnZhbCgpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dENsZWFyKS5zaG93KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNoZWNrU2Nyb2xsKCkge1xyXG4gICAgdmFyIHd0ID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG4gICAgdmFyIHBiID0gJCgnLnBhZ2UtYm9keScpLm9mZnNldCgpLnRvcDtcclxuICAgIGlmICh3dCA+IHBiKSB7XHJcbiAgICAgICQoJy5wYWdlLWJvZHknKS5hZGRDbGFzcygnZml4ZWQnKTtcclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdmaXhlZCcpO1xyXG4gICAgICBpZiAod3QgPiB0aGlzLmxhc3RTY3JvbGxUb3ApIHtcclxuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkucmVtb3ZlQ2xhc3MoJ2luJyk7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hTdWdnZXN0aW9ucykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2luJyk7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hTdWdnZXN0aW9ucykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnLnBhZ2UtYm9keScpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkucmVtb3ZlQ2xhc3MoJ2ZpeGVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gd3Q7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVNZW51KCkge1xyXG4gICAgaWYgKCEkKHRoaXMuc2VsLm1lbnUpLmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgIHRoaXMuYm9keVNjcm9sbGluZyhmYWxzZSk7XHJcbiAgICAgICQodGhpcy5zZWwudG9nZ2xlKS5hZGRDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJvZHlTY3JvbGxpbmcodHJ1ZSk7XHJcbiAgICAgICQodGhpcy5zZWwudG9nZ2xlKS5yZW1vdmVDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XHJcbiAgICB9XHJcbiAgICAkKHRoaXMuc2VsLm1lbnUpLnNsaWRlVG9nZ2xlKDE1MCk7XHJcblxyXG4gICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoRm9ybSkuaGFzQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpKSB7XHJcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpO1xyXG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaCkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaCkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKTtcclxuICAgICAgfSwgMTUwKTtcclxuICAgIH1cclxuICAgIGlmICgkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5oYXNDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKSkge1xyXG4gICAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKTtcclxuICAgICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wQ291bnRyeS0tY2xvc2UnKTtcclxuICAgICAgfSwgMTUwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGJvZHlTY3JvbGxpbmcoZW5hYmxlZCkge1xyXG4gICAgaWYgKGVuYWJsZWQpIHtcclxuICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJyk7XHJcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XHJcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJztcclxuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ21vZGFsLW9wZW4nKTtcclxuICAgICAgbGV0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5zY3JlZW4uYXZhaWxIZWlnaHQ7XHJcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gd2luZG93SGVpZ2h0LnRvU3RyaW5nKCkgKyAncHgnO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmhlaWdodCA9IHdpbmRvd0hlaWdodC50b1N0cmluZygpICsgJ3B4JztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRvZ2dsZVNlYXJjaChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2gpLmhhc0NsYXNzKCdoZWFkZXJfX2Rlc2t0b3BTZWFyY2gtLWNsb3NlJykpIHtcclxuICAgICAgdGhpcy5oaWRlU2VhcmNoKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3dTZWFyY2goKTtcclxuXHJcbiAgICAgICQoJy50b3Atc2VhcmNoZXMnLCB0aGlzLnNlbC5jb21wb25lbnQpLmhpZGUoKTtcclxuICAgICAgJCgnLnRvcC1zZWFyY2hlcyAuaXRlbXMnLCB0aGlzLnNlbC5jb21wb25lbnQpLmVtcHR5KCk7XHJcblxyXG4gICAgICB2YXIgdXJsID0gJyc7XHJcbiAgICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdkYXRhLXRvcHNlYXJjaGVzJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHVybCA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2RhdGEtdG9wc2VhcmNoZXMnKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodXJsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkLmdldCh1cmwsIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgIHZhciBjb250YWluZXIgPSAkKCcudG9wLXNlYXJjaGVzIC5pdGVtcycsIHRoaXMuc2VsLmNvbXBvbmVudCk7XHJcbiAgICAgICAgICB2YXIgcGFyYW1OYW1lID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmF0dHIoJ25hbWUnKTtcclxuICAgICAgICAgIHZhciBoYXNUZXJtcyA9IGZhbHNlO1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQucmVzdWx0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBoYXNUZXJtcyA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhciB0ZXJtID0gcmVzdWx0LnJlc3VsdHNbaV0udHJpbSgpO1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoVXJsID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignYWN0aW9uJykgKyAnPycgKyBwYXJhbU5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodGVybSk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmQoYDxhIGhyZWY9JyR7c2VhcmNoVXJsfScgdGl0bGU9JyR7dGVybX0nPjxzcGFuPiR7dGVybX08L3NwYW4+PC9hPmApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChoYXNUZXJtcykge1xyXG4gICAgICAgICAgICAkKCcudG9wLXNlYXJjaGVzJywgdGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNob3dTZWFyY2goKSB7XHJcbiAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKTtcclxuICAgICQodGhpcy5zZWwuY291bnRyeSkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XHJcblxyXG4gICAgJCh0aGlzLnNlbC5zZWFyY2gpLmFkZENsYXNzKCdoZWFkZXJfX2Rlc2t0b3BTZWFyY2gtLWNsb3NlJyk7XHJcbiAgICAkKHRoaXMuc2VsLnNlYXJjaCkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykuYWRkQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XHJcbiAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLmFkZENsYXNzKCdoZWFkZXJfX3NlYXJjaGZvcm0tLW9wZW4nKTtcclxuICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS5mb2N1cygpO1xyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLnRvZ2dsZSkuaGFzQ2xhc3MoJ2hlYWRlcl9fbmF2aWdhdGlvbi0tb3BlbicpKSB7XHJcbiAgICAgIHRoaXMuYm9keVNjcm9sbGluZyh0cnVlKTtcclxuICAgICAgJCh0aGlzLnNlbC50b2dnbGUpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKTtcclxuICAgICAgJCh0aGlzLnNlbC5tZW51KS5zbGlkZVRvZ2dsZSgxNTApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGlkZVNlYXJjaCgpIHtcclxuICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpO1xyXG4gICAgJCh0aGlzLnNlbC5zZWFyY2gpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaCkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKTtcclxuICAgIH0sIDE1MCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGNoZWNrU3VnZ2VzdGlvbnMoZmllbGQpIHtcclxuICAgIHZhciB2YWwgPSAkLnRyaW0oZmllbGQudmFsKCkpO1xyXG4gICAgdmFyIHMgPSB2YWwuc3Vic3RyKDAsIDEpO1xyXG4gICAgaWYgKHMgPT09IHRoaXMubGFzdExldHRlcikge1xyXG4gICAgICB0aGlzLnNob3dTdWdnZXN0aW9ucygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XHJcbiAgICAgIHRoaXMubGFzdExldHRlciA9IHM7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xO1xyXG5cclxuICAgICAgdmFyIHVybCA9ICcnO1xyXG4gICAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignZGF0YS1zdWdnZXN0aW9ucycpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB1cmwgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdkYXRhLXN1Z2dlc3Rpb25zJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQuZ2V0KHVybCwgeyBzOiBzIH0sIChyZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAocmVzdWx0LnJlc3VsdHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICB0aGlzLmNsZWFyU3VnZ2VzdGlvbnMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5hbGxTdWdnZXN0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQucmVzdWx0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmFsbFN1Z2dlc3Rpb25zLnB1c2gocmVzdWx0LnJlc3VsdHNbaV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5zaG93U3VnZ2VzdGlvbnMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xlYXJTdWdnZXN0aW9ucygpIHtcclxuICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLmVtcHR5KCkuaGlkZSgpO1xyXG4gIH1cclxuXHJcbiAgc2hvd1N1Z2dlc3Rpb25zKHVzZUxhc3RWYWwpIHtcclxuICAgIHRoaXMuY2xlYXJTdWdnZXN0aW9ucygpO1xyXG4gICAgdmFyIHZhbCA9ICQudHJpbSgkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkudmFsKCkpO1xyXG4gICAgaWYgKHVzZUxhc3RWYWwpIHtcclxuICAgICAgdmFsID0gdGhpcy5sYXN0VmFsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5sYXN0VmFsID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBoYXNUZXJtcyA9IGZhbHNlO1xyXG4gICAgdmFyIGMgPSAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFsbFN1Z2dlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjb250YWlucyA9IGZhbHNlO1xyXG4gICAgICB2YXIgdGVybXMgPSB2YWwudG9Mb3dlckNhc2UoKS5zcGxpdCgvXFxzLyk7XHJcblxyXG4gICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IHRlcm1zLmxlbmd0aDsgdCsrKSB7XHJcbiAgICAgICAgY29udGFpbnMgPSB0aGlzLmFsbFN1Z2dlc3Rpb25zW2ldLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGVybXNbdF0udHJpbSgpKTtcclxuICAgICAgICBpZiAoY29udGFpbnMpIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICgodmFsLmxlbmd0aCA9PT0gMSkgfHwgY29udGFpbnMpIHtcclxuICAgICAgICB2YXIgcGFyYW1OYW1lID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmF0dHIoJ25hbWUnKTtcclxuICAgICAgICB2YXIgdGVybSA9IHRoaXMuYWxsU3VnZ2VzdGlvbnNbaV0udHJpbSgpO1xyXG4gICAgICAgIHZhciB1cmwgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdhY3Rpb24nKSArICc/JyArIHBhcmFtTmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh0ZXJtKTtcclxuICAgICAgICB2YXIgY2xzID0gJyc7XHJcbiAgICAgICAgaWYgKGMgPT09IHRoaXMuc2VsZWN0ZWRJbmRleCkge1xyXG4gICAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLnZhbCh0ZXJtKTtcclxuICAgICAgICAgIGNscyA9ICcgY2xhc3M9XCJzZWxlY3RlZFwiJztcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hTdWdnZXN0aW9ucykuYXBwZW5kKGA8YSR7Y2xzfSBocmVmPScke3VybH0nIHRpdGxlPScke3Rlcm19Jz48c3Bhbj4ke3Rlcm19PC9zcGFuPjwvYT5gKTtcclxuICAgICAgICBoYXNUZXJtcyA9IHRydWU7XHJcbiAgICAgICAgYysrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYyA+PSAxMCkgYnJlYWs7XHJcbiAgICB9XHJcbiAgICB0aGlzLm1heFN1Z2dlc3Rpb25zID0gYztcclxuXHJcbiAgICBpZiAoaGFzVGVybXMpIHtcclxuICAgICAgJCh0aGlzLnNlbC5zZWFyY2hTdWdnZXN0aW9ucykuc2hvdygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdG9nZ2xlQ291bnRyeShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb3VudHJ5KS5oYXNDbGFzcygnaGVhZGVyX19kZXNrdG9wQ291bnRyeS0tY2xvc2UnKSkge1xyXG4gICAgICB0aGlzLmhpZGVDb3VudHJ5KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3dDb3VudHJ5KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzaG93Q291bnRyeSgpIHtcclxuICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpO1xyXG4gICAgJCh0aGlzLnNlbC5zZWFyY2gpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoLS1jbG9zZScpO1xyXG4gICAgfSwgMTUwKTtcclxuXHJcbiAgICAkKHRoaXMuc2VsLmNvdW50cnkpLmFkZENsYXNzKCdoZWFkZXJfX2Rlc2t0b3BDb3VudHJ5LS1jbG9zZScpO1xyXG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5hZGRDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcclxuICAgICQodGhpcy5zZWwuY291bnRyeUZvcm0pLmFkZENsYXNzKCdoZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbC0tb3BlbicpO1xyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLnRvZ2dsZSkuaGFzQ2xhc3MoJ2hlYWRlcl9fbmF2aWdhdGlvbi0tb3BlbicpKSB7XHJcbiAgICAgIHRoaXMuYm9keVNjcm9sbGluZyh0cnVlKTtcclxuICAgICAgJCh0aGlzLnNlbC50b2dnbGUpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKTtcclxuICAgICAgJCh0aGlzLnNlbC5tZW51KS5zbGlkZVRvZ2dsZSgxNTApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGlkZUNvdW50cnkoKSB7XHJcbiAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKTtcclxuICAgICQodGhpcy5zZWwuY291bnRyeSkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XHJcbiAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5maW5kKCcubW9iJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wQ291bnRyeS0tY2xvc2UnKTtcclxuICAgIH0sIDE1MCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHNlbGVjdENvdW50cnlTZWNvbmRhcnkoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkuZmluZCgnLm1vYicpLmFkZENsYXNzKCdvcGVuJyk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgSGVhZGVyKCk7XHJcbiIsImNsYXNzIEhlcm8ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5oZXJvJyxcbiAgICAgIHRyaWdnZXI6ICcuaGVyb19fcGxheUJ1dHRvbiwgLmhlcm9fX2N0YS0tdmlkZW8nLFxuICAgICAgaWZyYW1lOiAnLmhlcm8gLmhlcm9fX3ZpZGVvJ1xuICAgIH07XG5cbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC50cmlnZ2VyLCB0aGlzLmhhbmRsZUNsaWNrKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0IHZpZGVvSWQgPSB0aGlzLmdldFZpZGVvSUQoZS50YXJnZXQuaHJlZik7XG4gICAgJCh0aGlzLnNlbC5pZnJhbWUpLmF0dHIoJ3NyYycsICdodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8nICsgdmlkZW9JZCArICc/cmVsPTAmYW1wO3Nob3dpbmZvPTAmYW1wO2F1dG9wbGF5PTEnKS5hZGRDbGFzcygnaGVyb19fdmlkZW8tLW9wZW4nKTtcbiAgfVxuXG4gIGdldFZpZGVvSUQoeXRVcmwpIHtcbiAgICBsZXQgaWQgPSAnJztcbiAgICBsZXQgdXJsID0geXRVcmwucmVwbGFjZSgvKD58PCkvZ2ksICcnKS5zcGxpdCgvKHZpXFwvfHY9fFxcL3ZcXC98eW91dHVcXC5iZVxcL3xcXC9lbWJlZFxcLykvKTtcbiAgICBpZiAodXJsWzJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlkID0gdXJsWzJdLnNwbGl0KC9bXjAtOWEtel9cXC1dL2kpO1xuICAgICAgaWQgPSBpZFswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgPSB1cmw7XG4gICAgfVxuICAgIHJldHVybiBpZDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBIZXJvKCk7XG4iLCJjbGFzcyBJRURldGVjdG9yIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICdib2R5J1xuICAgIH07XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRldGVjdElFID0gdGhpcy5kZXRlY3RJRS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdmFyIHZlcnNpb24gPSB0aGlzLmRldGVjdElFKCk7XG4gICAgaWYgKHZlcnNpb24gIT09IGZhbHNlKSB7XG4gICAgICBpZiAodmVyc2lvbiA+PSAxMikge1xuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2llLWVkZ2UnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcyhgaWUtJHt2ZXJzaW9ufWApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGRldGVjdElFKCkge1xuICAgIHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIC8vIFRlc3QgdmFsdWVzOyBVbmNvbW1lbnQgdG8gY2hlY2sgcmVzdWx0IOKAplxuICAgIC8vIElFIDEwXG4gICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKGNvbXBhdGlibGU7IE1TSUUgMTAuMDsgV2luZG93cyBOVCA2LjI7IFRyaWRlbnQvNi4wKSc7XG4gICAgLy8gSUUgMTFcbiAgICAvLyB1YSA9ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCA2LjM7IFRyaWRlbnQvNy4wOyBydjoxMS4wKSBsaWtlIEdlY2tvJzsgICAgLy8gRWRnZSAxMiAoU3BhcnRhbilcbiAgICAvLyB1YSA9ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXT1c2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzM5LjAuMjE3MS43MSBTYWZhcmkvNTM3LjM2IEVkZ2UvMTIuMCcgICAgLy8gRWRnZSAxM1xuICAgIC8vIHVhID0gJ01vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS80Ni4wLjI0ODYuMCBTYWZhcmkvNTM3LjM2IEVkZ2UvMTMuMTA1ODYnO1xuICAgIHZhciBtc2llID0gdWEuaW5kZXhPZignTVNJRSAnKTtcbiAgICBpZiAobXNpZSA+IDApIHtcbiAgICAgIC8vIElFIDEwIG9yIG9sZGVyID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhtc2llICsgNSwgdWEuaW5kZXhPZignLicsIG1zaWUpKSwgMTApO1xuICAgIH1cblxuICAgIHZhciB0cmlkZW50ID0gdWEuaW5kZXhPZignVHJpZGVudC8nKTtcbiAgICBpZiAodHJpZGVudCA+IDApIHtcbiAgICAgIC8vIElFIDExID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgdmFyIHJ2ID0gdWEuaW5kZXhPZigncnY6Jyk7XG4gICAgICByZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKHJ2ICsgMywgdWEuaW5kZXhPZignLicsIHJ2KSksIDEwKTtcbiAgICB9XG5cbiAgICB2YXIgZWRnZSA9IHVhLmluZGV4T2YoJ0VkZ2UvJyk7XG4gICAgaWYgKGVkZ2UgPiAwKSB7XG4gICAgICAvLyBFZGdlIChJRSAxMispID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhlZGdlICsgNSwgdWEuaW5kZXhPZignLicsIGVkZ2UpKSwgMTApO1xuICAgIH1cblxuICAgIC8vIG90aGVyIGJyb3dzZXJcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IElFRGV0ZWN0b3IoKTtcbiIsImNsYXNzIExhbmRpbmdQb2ludHMge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5sYW5kaW5ncG9pbnRzJyxcclxuICAgICAgbGFuZGluZ1BvaW50SXRlbTogJy5sYW5kaW5ncG9pbnRzIC5sYW5kaW5ncG9pbnQnLFxyXG4gICAgICBjbGlja2FibGVUaXRsZTogJy5sYW5kaW5ncG9pbnRzIC5sYW5kaW5ncG9pbnRfX3RpdGxlIGEnXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5jbGlja2FibGVUaXRsZSwgKGV2dCkgPT4ge1xyXG4gICAgICB2YXIgY29udGFpbmVyID0gJChldnQuY3VycmVudFRhcmdldCkuY2xvc2VzdCh0aGlzLnNlbC5sYW5kaW5nUG9pbnRJdGVtKTtcclxuICAgICAgaWYgKGNvbnRhaW5lci5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgY29udGFpbmVyLmZpbmQoJy5sYW5kaW5ncG9pbnRfX2NvbnRlbnQnKS5jc3MoeyBoZWlnaHQ6IDAgfSk7XHJcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJChldnQuY3VycmVudFRhcmdldCkuY2xvc2VzdCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJy5sYW5kaW5ncG9pbnQub3BlbiAubGFuZGluZ3BvaW50X19jb250ZW50JykuY3NzKHsgaGVpZ2h0OiAwIH0pO1xyXG4gICAgICAgICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcubGFuZGluZ3BvaW50JykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICBjb250YWluZXIuYWRkQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICBjb250YWluZXIuZmluZCgnLmxhbmRpbmdwb2ludF9fY29udGVudCcpLmNzcyh7IGhlaWdodDogY29udGFpbmVyLmZpbmQoJy5sYW5kaW5ncG9pbnRfX2NvbnRlbnQgcCcpLm91dGVySGVpZ2h0KCkgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IExhbmRpbmdQb2ludHMoKTtcclxuXHJcbiIsImNsYXNzIExhbmd1YWdlRGV0ZWN0IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcucm9vdF9fY291bnRyeVNlbGVjdFBhbmVsJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnJlZGlyZWN0ID0gdHJ1ZTtcclxuICAgIHRoaXMuY29va2llTmFtZSA9ICdkaGwtZGVmYXVsdC1sYW5ndWFnZSc7XHJcblxyXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldFBhdGhQcmVmaXgoKSB7XHJcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xyXG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgaWYgKCF0aGlzLnJlZGlyZWN0KSB7XHJcbiAgICAgICQoJy5tYXNrJywgdGhpcy5zZWwpLmhpZGUoKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBjb29raWUgPSBDb29raWVzLmdldCh0aGlzLmNvb2tpZU5hbWUpO1xyXG4gICAgaWYgKHR5cGVvZiBjb29raWUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIGxldCBsYW5ndWFnZSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2U7XHJcbiAgICAgIGxldCBsYW5ndWFnZXNEYXRhID0gSlNPTi5wYXJzZSgkKCcjbGFuZ3VhZ2VzRGF0YScpLmh0bWwoKSk7XHJcbiAgICAgIGxldCBjYXRjaEFsbCA9ICcnO1xyXG4gICAgICBsZXQgdXJsID0gJyc7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxhbmd1YWdlc0RhdGEudmFyaWFudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgdmFyaWFudCA9IGxhbmd1YWdlc0RhdGEudmFyaWFudHNbaV07XHJcbiAgICAgICAgaWYgKHZhcmlhbnQubGFuZ3VhZ2VzID09PSAnKicpIHtcclxuICAgICAgICAgIGNhdGNoQWxsID0gdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB2YXJpYW50LnBhdGggKyAnLmh0bWwnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFyaWFudC5sYW5ndWFnZXMuaW5kZXhPZihsYW5ndWFnZSkgPj0gMCkge1xyXG4gICAgICAgICAgdXJsID0gdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB2YXJpYW50LnBhdGggKyAnLmh0bWwnO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAodXJsICE9PSAnJykge1xyXG4gICAgICAgIENvb2tpZXMuc2V0KHRoaXMuY29va2llTmFtZSwgdXJsKTtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcclxuICAgICAgfSBlbHNlIGlmIChjYXRjaEFsbCAhPT0gJycpIHtcclxuICAgICAgICBDb29raWVzLnNldCh0aGlzLmNvb2tpZU5hbWUsIGNhdGNoQWxsKTtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGNhdGNoQWxsO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGNvb2tpZTtcclxuICAgIH1cclxuXHJcbiAgICAkKCcubWFzaycsIHRoaXMuc2VsKS5oaWRlKCk7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgTGFuZ3VhZ2VEZXRlY3QoKTtcclxuIiwiY2xhc3MgTG9naW5Gb3JtIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuY29uZmlnID0ge1xyXG4gICAgICBmYkFwcElkOiAnMTA4MDAzMTMyODgwMTIxMScsXHJcbiAgICAgIGdvQ2xpZW50SWQ6ICczMTM0Njk4Mzc0MjAtbDg4MmgzOWdlOG44bjlwYjk3bGR2amszZm04cHBxZ3MuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nLFxyXG5cclxuICAgICAgdXJsVG9rZW46ICcvbGlicy9ncmFuaXRlL2NzcmYvdG9rZW4uanNvbicsXHJcbiAgICAgIHVybExvZ2luOiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL2xvZ2luL2luZGV4Lmpzb24nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcucGFnZS1ib2R5LmxvZ2luIGZvcm0uZm9ybXMnLFxyXG4gICAgICBidXR0b25GYWNlYm9vazogJy5mb3Jtc19fY3RhLS1zb2NpYWwuZmInLFxyXG4gICAgICBidXR0b25MaW5rZWRpbjogJy5mb3Jtc19fY3RhLS1zb2NpYWwubGknLFxyXG4gICAgICBidXR0b25Hb29nbGVQbHVzOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5nbydcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldFBhdGhIb21lID0gdGhpcy5nZXRQYXRoSG9tZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnRyeUxvZ2luRmFjZWJvb2sgPSB0aGlzLnRyeUxvZ2luRmFjZWJvb2suYmluZCh0aGlzKTtcclxuICAgIHRoaXMudHJ5TG9naW5MaW5rZWRpbiA9IHRoaXMudHJ5TG9naW5MaW5rZWRpbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50cnlMb2dpbkdvb2dsZSA9IHRoaXMudHJ5TG9naW5Hb29nbGUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMudHJ5TG9naW4gPSB0aGlzLnRyeUxvZ2luLmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5leGVjdXRlTG9naW4gPSB0aGlzLmV4ZWN1dGVMb2dpbi5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMubG9nZ2VkSW4gPSB0aGlzLmxvZ2dlZEluLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoUHJlZml4KCkge1xyXG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UGF0aEhvbWUoKSB7XHJcbiAgICBjb25zdCBob21lID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtaG9tZVxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XHJcbiAgICByZXR1cm4gKGhvbWUgPyBob21lIDogJycpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgJCh3aW5kb3cpLm9uKCd1c2VybG9nZ2VkaW4uREhMJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmxvZ2dlZEluKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgncGFzc3dvcmQnLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJChlbGVtZW50KS5hdHRyKCdwYXR0ZXJuJykpLnRlc3QodmFsdWUpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkIGZvcm1hdCBpcyBub3QgdmFsaWQnKTtcclxuXHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnZXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICByZXR1cm4gKCQoJyMnICsgJChlbGVtZW50KS5hdHRyKCdkYXRhLWVxdWFsVG8nKSkudmFsKCkgPT09ICQoZWxlbWVudCkudmFsKCkpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnKTtcclxuXHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLmxlbmd0aCA+IDApIHtcclxuICAgICAgd2luZG93LmZiQXN5bmNJbml0ID0gKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5mYl9pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5GQikgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5GQiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB3aW5kb3cuRkIuaW5pdCh7XHJcbiAgICAgICAgICAgICAgYXBwSWQ6IHRoaXMuY29uZmlnLmZiQXBwSWQsXHJcbiAgICAgICAgICAgICAgY29va2llOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHhmYm1sOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZlcnNpb246ICd2Mi44J1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmZiX2ludGVydmFsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYWNlYm9vay1qc3NkaycpID09PSBudWxsKSB7XHJcbiAgICAgICAgdmFyIGZqcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgICAgICB2YXIganMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICBqcy5pZCA9ICdmYWNlYm9vay1qc3Nkayc7XHJcbiAgICAgICAganMuc3JjID0gJy8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fRU4vc2RrLmpzJztcclxuICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcbiAgICAgIH1cclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLm9uKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICB0aGlzLnRyeUxvZ2luRmFjZWJvb2soZXZ0KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikubGVuZ3RoID4gMCkge1xyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIHRoaXMudHJ5TG9naW5MaW5rZWRpbihldnQpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGdvb2dsZUJ1dHRvbiA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpO1xyXG4gICAgaWYgKGdvb2dsZUJ1dHRvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHdpbmRvdy5nb19pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mICh3aW5kb3cuZ2FwaSkgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5nYXBpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICB3aW5kb3cuZ2FwaS5sb2FkKCdhdXRoMicsICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGF1dGgyID0gd2luZG93LmdhcGkuYXV0aDIuaW5pdCh7XHJcbiAgICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNvbmZpZy5nb0NsaWVudElkLFxyXG4gICAgICAgICAgICAgIGNvb2tpZXBvbGljeTogJ3NpbmdsZV9ob3N0X29yaWdpbidcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGdvb2dsZUJ1dHRvbi5nZXQoMCk7XHJcbiAgICAgICAgICAgIGF1dGgyLmF0dGFjaENsaWNrSGFuZGxlcihlbGVtZW50LCB7fSxcclxuICAgICAgICAgICAgICAoZ29vZ2xlVXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cnlMb2dpbkdvb2dsZShnb29nbGVVc2VyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3IgIT09ICdwb3B1cF9jbG9zZWRfYnlfdXNlcicpIHtcclxuICAgICAgICAgICAgICAgICAgYWxlcnQocmVzdWx0LmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBjbGVhckludGVydmFsKHdpbmRvdy5nb19pbnRlcnZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAxMDApO1xyXG5cclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnZhbGlkYXRlKHtcclxuICAgICAgcnVsZXM6IHtcclxuICAgICAgICBsb2dpbl9fZW1haWw6ICdlbWFpbCcsXHJcbiAgICAgICAgbG9naW5fX3Bhc3N3b3JkOiAncGFzc3dvcmQnXHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IChmb3JtKSA9PiB7XHJcbiAgICAgICAgdGhpcy50cnlMb2dpbihmb3JtKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJ5TG9naW5GYWNlYm9vayhldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkZhY2Vib29rKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG5cclxuICAgIHdpbmRvdy5GQi5sb2dpbigobG9naW5SZXNwb25zZSkgPT4ge1xyXG4gICAgICBpZiAobG9naW5SZXNwb25zZS5hdXRoUmVzcG9uc2UpIHtcclxuICAgICAgICB3aW5kb3cuRkIuYXBpKCcvbWUnLCAoZGF0YVJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IGRhdGFSZXNwb25zZS5lbWFpbCxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IGRhdGFSZXNwb25zZS5pZFxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICB0aGlzLmV4ZWN1dGVMb2dpbihkYXRhLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkZhY2Vib29rKS50ZXh0KCdGYWNlYm9vaycpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSwgeyBmaWVsZHM6IFsgJ2lkJywgJ2VtYWlsJyBdfSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSwgeyBzY29wZTogJ2VtYWlsLHB1YmxpY19wcm9maWxlJywgcmV0dXJuX3Njb3BlczogdHJ1ZSB9KTtcclxuICB9XHJcblxyXG4gIHRyeUxvZ2luTGlua2VkaW4oZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuXHJcbiAgICBJTi5Vc2VyLmF1dGhvcml6ZSgoKSA9PiB7XHJcbiAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgdmFyIG1lbWJlciA9IHJlc3VsdC52YWx1ZXNbMF07XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgdXNlcm5hbWU6IG1lbWJlci5lbWFpbEFkZHJlc3MsXHJcbiAgICAgICAgICBwYXNzd29yZDogbWVtYmVyLmlkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlTG9naW4oZGF0YSwgKCkgPT4ge1xyXG4gICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLnRleHQoJ0xpbmtlZEluJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICB2YXIgcmVzdWx0ID0gd2luZG93LklOLlVzZXIuaXNBdXRob3JpemVkKCk7XHJcbiAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICBJTi5BUEkuUHJvZmlsZSgnbWUnKS5maWVsZHMoJ2lkJywgJ2ZpcnN0LW5hbWUnLCAnbGFzdC1uYW1lJywgJ2VtYWlsLWFkZHJlc3MnKS5yZXN1bHQoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgdmFyIG1lbWJlciA9IHJlc3VsdC52YWx1ZXNbMF07XHJcblxyXG4gICAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiBtZW1iZXIuZW1haWxBZGRyZXNzLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogbWVtYmVyLmlkXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHRoaXMuZXhlY3V0ZUxvZ2luKGRhdGEsICgpID0+IHtcclxuICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLnRleHQoJ0xpbmtlZEluJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMCk7XHJcblxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHRyeUxvZ2luR29vZ2xlKGdvb2dsZVVzZXIpIHtcclxuICAgIHZhciBkYXRhID0ge1xyXG4gICAgICB1c2VybmFtZTogZ29vZ2xlVXNlci5nZXRCYXNpY1Byb2ZpbGUoKS5nZXRFbWFpbCgpLFxyXG4gICAgICBwYXNzd29yZDogZ29vZ2xlVXNlci5nZXRCYXNpY1Byb2ZpbGUoKS5nZXRJZCgpXHJcbiAgICB9O1xyXG5cclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICB0aGlzLmV4ZWN1dGVMb2dpbihkYXRhLCAoKSA9PiB7XHJcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpLnRleHQoJ0dvb2dsZSsnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJ5TG9naW4oZm9ybSkge1xyXG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XHJcbiAgICB2YXIgdXNlcm5hbWUgPSBmcm0uZmluZCgnaW5wdXQjbG9naW5fX2VtYWlsJykudmFsKCk7XHJcbiAgICB2YXIgcGFzc3dvcmQgPSBmcm0uZmluZCgnaW5wdXQjbG9naW5fX3Bhc3N3b3JkJykudmFsKCk7XHJcblxyXG4gICAgaWYgKCgkLnRyaW0odXNlcm5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShwYXNzd29yZCkubGVuZ3RoID09PSAwKSkge1xyXG4gICAgICBhbGVydCgnUGxlYXNlIGVudGVyIHlvdXIgZW1haWwgYWRkcmVzcyBhbmQgcGFzc3dvcmQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgICB0aGlzLmV4ZWN1dGVMb2dpbih7IHVzZXJuYW1lOiB1c2VybmFtZSwgcGFzc3dvcmQ6IHBhc3N3b3JkIH0sICgpID0+IHtcclxuICAgICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdMb2cgSW4nKTtcclxuICAgICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdMb2dpbicpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBleGVjdXRlTG9naW4oZGF0YSwgdW53YWl0Q2FsbGJhY2spIHtcclxuICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG5cclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsTG9naW4sXHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyByZXNwb25zZSwgdHJ1ZSBdKTtcclxuXHJcbiAgICAgICAgICAgICAgdmFyIGJhY2tVcmwgPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZGF0YSgnYmFjaycpO1xyXG4gICAgICAgICAgICAgIGlmICgkLnRyaW0oYmFja1VybCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBiYWNrVXJsID0gdGhpcy5nZXRQYXRoSG9tZSgpICsgJy5odG1sJztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gYmFja1VybDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byByZWdpc3Rlci5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHJlZ2lzdGVyLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdW53YWl0Q2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBsb2dnZWRJbigpIHtcclxuICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvY29udGVudC9kaGwveW91ci1hY2NvdW50Lmh0bWwnO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IExvZ2luRm9ybSgpO1xyXG4iLCJcclxuY2xhc3MgTWFya2V0Rm9ybSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnW2RhdGEtbWFya2V0by1mb3JtXScsXHJcbiAgICB9O1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4gdGhpcy5iaW5kRXZlbnRzKGVsZW1lbnQsIGluZGV4KSk7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKGVsZW0pIHtcclxuXHJcbiAgICBjb25zdCAkZWxlbSA9ICQoZWxlbSk7XHJcblxyXG4gICAgY29uc3QgJGZvcm0gPSAkZWxlbS5maW5kKCdbZGF0YS1tYXJrZXRvLXZpc2libGUtZm9ybV0nKTtcclxuXHJcbiAgICAvLyB2aXNpYmxlIGZvcm1cclxuICAgIGNvbnN0ICRtYXJrZXRvRm9ybSA9ICRmb3JtLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGNvbnN0IG1hcmtldG9Gb3JtQXR0ciA9ICRtYXJrZXRvRm9ybSA/ICRtYXJrZXRvRm9ybS5hdHRyKCdpZCcpIDogJyc7XHJcbiAgICBjb25zdCBtYXJrZXRvRm9ybUlkID0gbWFya2V0b0Zvcm1BdHRyID8gbWFya2V0b0Zvcm1BdHRyLnJlcGxhY2UoJ21rdG9Gb3JtXycsICcnKSA6ICcnO1xyXG5cclxuICAgIGNvbnN0IF9wdWJsaWMgPSB7fTtcclxuXHJcbiAgICBsZXQgbG9hZGVkRm9ybXMgPSBbXVxyXG5cclxuICAgIGNvbnN0IGZvcm0gPSAkZWxlbS5hdHRyKCdkYXRhLW1hcmtldG8tZm9ybScpO1xyXG5cclxuICAgIGNvbnN0IGhpZGRlblNldHRpbmdzID0gZm9ybSA/IEpTT04ucGFyc2UoZm9ybSkgOiBudWxsO1xyXG5cclxuICAgIGlmIChtYXJrZXRvRm9ybUlkLmxlbmd0aCAhPT0gMCkge1xyXG5cclxuICAgICAgTWt0b0Zvcm1zMi53aGVuUmVhZHkoZnVuY3Rpb24obWt0b0Zvcm0pIHtcclxuICAgICAgICAkKCcjbWt0b0Zvcm1zMkJhc2VTdHlsZScpLnJlbW92ZSgpO1xyXG4gICAgICAgICQoJyNta3RvRm9ybXMyVGhlbWVTdHlsZScpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICBjb25zdCBmb3JtSWQgPSBta3RvRm9ybS5nZXRJZCgpO1xyXG5cclxuICAgICAgICBpZiAobG9hZGVkRm9ybXMuaW5kZXhPZihmb3JtSWQudG9TdHJpbmcoKSkgIT09IC0xKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZm9ybUlkLnRvU3RyaW5nKCkgPT09IG1hcmtldG9Gb3JtSWQudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgbG9hZGVkRm9ybXMucHVzaChmb3JtSWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpc2Zvcm0gPSBta3RvRm9ybS5nZXRJZCgpLnRvU3RyaW5nKCkgPT09IG1hcmtldG9Gb3JtSWQudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgaWYgKGlzZm9ybSkge1xyXG5cclxuICAgICAgICAgIG1rdG9Gb3JtLm9uU3VjY2VzcygoZSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFoaWRkZW5TZXR0aW5ncykge1xyXG4gICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBNa3RvRm9ybXMyLmxvYWRGb3JtKFwiLy9leHByZXNzLXJlc291cmNlLmRobC5jb21cIiwgaGlkZGVuU2V0dGluZ3MuaGlkZGVuTXVuY2hraW5JZCwgaGlkZGVuU2V0dGluZ3MuaGlkZGVuRm9ybUlkLCBmdW5jdGlvbihoaWRkZW5Gb3JtKSB7XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Zvcm1Mb2FkZWQnLCBoaWRkZW5Gb3JtLCBlKTtcclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgbWt0b0ZpZWxkc09iaiA9ICQuZXh0ZW5kKGUsIGhpZGRlbkZvcm0uZ2V0VmFsdWVzKCkpO1xyXG5cclxuICAgICAgICAgICAgICBoaWRkZW5Gb3JtLmFkZEhpZGRlbkZpZWxkcyhta3RvRmllbGRzT2JqKTtcclxuICAgICAgICAgICAgICBoaWRkZW5Gb3JtLnN1Ym1pdCgpO1xyXG5cclxuICAgICAgICAgICAgICBoaWRkZW5Gb3JtLm9uU3VibWl0KChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2Vjb25kIGZvcm0gc3VibWl0Li4uJywgZS5nZXRWYWx1ZXMoKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgIGhpZGRlbkZvcm0ub25TdWNjZXNzKChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2Vjb25kIGZvcm0gc3VjY2Vzcy4uLicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgTWt0b0Zvcm1zMi53aGVuUmVhZHkoZnVuY3Rpb24obWt0b0Zvcm0pIHtcclxuICAgICAgICAkKCcjbWt0b0Zvcm1zMkJhc2VTdHlsZScpLnJlbW92ZSgpO1xyXG4gICAgICAgICQoJyNta3RvRm9ybXMyVGhlbWVTdHlsZScpLnJlbW92ZSgpO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgTWFya2V0Rm9ybSgpO1xyXG4iLCJpbXBvcnQgVG9hc3QgZnJvbSAnLi9Ub2FzdCc7XHJcbmltcG9ydCBEYXRhYmFzZSBmcm9tICcuL0RhdGFiYXNlJztcclxuXHJcbmNsYXNzIFNhdmVGb3JPZmZsaW5lIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuaGVyb19fc2F2ZUZvck9mZmxpbmUnXHJcbiAgICB9O1xyXG4gICAgLy8gQ3JlYXRlIGFydGljbGUgY2FjaGUgbmFtZVxyXG4gICAgdGhpcy5hcnRpY2xlQ2FjaGVOYW1lID0gJ29mZmxpbmUtJyArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuXHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmRvU2F2ZSA9IHRoaXMuZG9TYXZlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmRvVW5zYXZlID0gdGhpcy5kb1Vuc2F2ZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldEhlcm9JbWFnZXMgPSB0aGlzLmdldEhlcm9JbWFnZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaXNDdXJyZW50UGFnZVNhdmVkID0gdGhpcy5pc0N1cnJlbnRQYWdlU2F2ZWQuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5jb21wb25lbnQsIHRoaXMuaGFuZGxlQ2xpY2spO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2xpY2soZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5oYXNDbGFzcygnaGVyb19fc2F2ZUZvck9mZmxpbmUtLXNhdmVkJykpIHtcclxuICAgICAgdGhpcy5kb1Vuc2F2ZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kb1NhdmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzQ3VycmVudFBhZ2VTYXZlZCgpIHtcclxuICAgIC8vIENoZWNrIGlmIGFscmVhZHkgc2F2ZWRcclxuICAgIGNhY2hlcy5rZXlzKCkudGhlbigoY2FjaGVOYW1lcykgPT4geyAvLyBHZXQgYXJyYXkgb2YgY2FjaGUgbmFtZXNcclxuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxyXG4gICAgICAgIGNhY2hlTmFtZXMuZmlsdGVyKChjYWNoZU5hbWUpID0+IHsgLy8gRmlsdGVyIGFycmF5XHJcbiAgICAgICAgICByZXR1cm4gKGNhY2hlTmFtZSA9PT0gdGhpcy5hcnRpY2xlQ2FjaGVOYW1lKTsgLy8gSWYgbWF0Y2hlcyBjdXJyZW50IHBhdGhuYW1lXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuICAgIH0pLnRoZW4oKGNhY2hlTmFtZXMpID0+IHsgLy8gT25jZSBnb3QgZmlsdGVyZWQgYXJyYXlcclxuICAgICAgaWYgKGNhY2hlTmFtZXMubGVuZ3RoID4gMCkgeyAvLyBJZiB0aGVyZSBhcmUgY2FjaGVzXHJcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdoZXJvX19zYXZlRm9yT2ZmbGluZS0tc2F2ZWQnKS5hdHRyKCd0aXRsZScsICdBcnRpY2xlIFNhdmVkJykuZmluZCgnc3BhbicpLnRleHQoJ0FydGljbGUgU2F2ZWQnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRIZXJvSW1hZ2VzKCkge1xyXG4gICAgLy8gR2V0IHRoZSBoZXJvIGltYWdlIGVsZW1lbnRcclxuICAgIGxldCAkaGVyb0ltYWdlID0gJCgnLmhlcm9fX2ltYWdlJyk7XHJcbiAgICAvLyBJZiBpdCBleGlzdHNcclxuICAgIGlmICgkaGVyb0ltYWdlLmxlbmd0aCA+IDApIHtcclxuICAgICAgLy8gQ3JlYXRlIGFycmF5IGZvciBpbWFnZXNcclxuICAgICAgbGV0IGltYWdlcyA9IFtdO1xyXG4gICAgICAvLyBBZGQgdGhlIG1vYmlsZSBpbWFnZSBVUkxcclxuICAgICAgaW1hZ2VzLnB1c2goXHJcbiAgICAgICAgJGhlcm9JbWFnZS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKS5zcGxpdCgndXJsKCcpWzFdLnNwbGl0KCcpJylbMF0ucmVwbGFjZSgvXCIvZywgJycpLnJlcGxhY2UoLycvZywgJycpXHJcbiAgICAgICk7XHJcbiAgICAgIC8vIEdldCB0aGUgZGVza3RvcCBpbWFnZSBVUkxcclxuICAgICAgbGV0IGRlc2t0b3BTdHlsZXMgPSAkaGVyb0ltYWdlLnBhcmVudHMoJy5oZXJvJykuZmluZCgnc3R5bGUnKS5odG1sKCkuc3BsaXQoJ3VybCgnKVsxXS5zcGxpdCgnKScpWzBdLnJlcGxhY2UoL1wiL2csICcnKS5yZXBsYWNlKC8nL2csICcnKTtcclxuICAgICAgLy8gQWRkIHRoZSBkZXNrdG9wIGltYWdlIHRvIHRoZSBhcnJheVxyXG4gICAgICBpbWFnZXMucHVzaChkZXNrdG9wU3R5bGVzKTtcclxuICAgICAgLy8gUmV0dXJuIHRoZSBpbWFnZXNcclxuICAgICAgcmV0dXJuIGltYWdlcztcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGRvVW5zYXZlKHBhdGhOYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKSB7XHJcbiAgICBsZXQgdG9hc3QgPSBuZXcgVG9hc3QoJ0FydGljbGUgaGFzIGJlZW4gcmVtb3ZlZCcsIDMwMDApO1xyXG4gICAgLy8gUmVtb3ZlIGFydGljbGUgZnJvbSBJREJcclxuICAgIHJldHVybiBEYXRhYmFzZS5kZWxldGVBcnRpY2xlKHBhdGhOYW1lKS50aGVuKCgpID0+IHsvLyBEZWxldGVkIGZyb20gSURCIHN1Y2Nlc3NmdWxseVxyXG4gICAgICAvLyBSZW1vdmUgYXJ0aWNsZSBjb250ZW50XHJcbiAgICAgIGNhY2hlcy5kZWxldGUoJ29mZmxpbmUtJyArIHBhdGhOYW1lKS50aGVuKCgpID0+IHtcclxuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkucmVtb3ZlQ2xhc3MoJ2hlcm9fX3NhdmVGb3JPZmZsaW5lLS1zYXZlZCcpLmF0dHIoJ3RpdGxlJywgJ1NhdmUgQXJ0aWNsZScpLmZpbmQoJ3NwYW4nKS50ZXh0KCdTYXZlIEFydGljbGUnKTtcclxuICAgICAgICB0b2FzdC5zaG93KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSkuY2F0Y2goKCkgPT4gey8vIFRoZXJlIHdhcyBhbiBlcnJvciBkZWxldGluZyBmcm9tIElEQlxyXG4gICAgICB0b2FzdC5zZXRUZXh0KCdUaGVyZSB3YXMgYSBwcm9ibGVtIGRlbGV0aW5nIHRoZSBhcnRpY2xlJyk7XHJcbiAgICAgIHRvYXN0LnNob3coKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZG9TYXZlKCkge1xyXG4gICAgLy8gQ3JlYXRlIHRvYXN0IGZvciBjb25maXJtYXRpb25cclxuICAgIGxldCB0b2FzdCA9IG5ldyBUb2FzdCgnQXJ0aWNsZSBpcyBub3cgYXZhaWxhYmxlIG9mZmxpbmUnLCAzMDAwKTtcclxuXHJcbiAgICBpZiAoJCgnI2FydGljbGVEYXRhJykubGVuZ3RoIDw9IDApIHtcclxuICAgICAgY29uc29sZS5sb2coJ1NXIEVSUk9SOiBPZmZsaW5lLmpzOjkwJyk7XHJcbiAgICAgIHRvYXN0LnNldFRleHQoJ0FydGljbGUgY291bGQgbm90IGJlIHNhdmVkIGZvciBvZmZsaW5lJyk7XHJcbiAgICAgIHRvYXN0LnNob3coKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy8gR2V0IHBhZ2UgZGF0YSBmb3IgSURCXHJcbiAgICBsZXQgcGFnZURhdGEgPSBKU09OLnBhcnNlKCQoJyNhcnRpY2xlRGF0YScpLmh0bWwoKSk7XHJcblxyXG4gICAgLy8gQWRkIGFydGljbGUgdG8gSURCXHJcbiAgICBEYXRhYmFzZS5hZGRBcnRpY2xlKFxyXG4gICAgICBwYWdlRGF0YS50aXRsZSxcclxuICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLFxyXG4gICAgICBwYWdlRGF0YS5kZXNjcmlwdGlvbixcclxuICAgICAgcGFnZURhdGEuY2F0ZWdvcnlOYW1lLFxyXG4gICAgICBwYWdlRGF0YS5jYXRlZ29yeUxpbmssXHJcbiAgICAgIHBhZ2VEYXRhLnRpbWVUb1JlYWQsXHJcbiAgICAgIHBhZ2VEYXRhLmltYWdlTW9iaWxlLFxyXG4gICAgICBwYWdlRGF0YS5pbWFnZURlc2t0b3AsXHJcbiAgICAgIHBhZ2VEYXRhLmlzTGFyZ2UsXHJcbiAgICAgIHBhZ2VEYXRhLmlzVmlkZW8sXHJcbiAgICAgIHRoaXMuYXJ0aWNsZUNhY2hlTmFtZVxyXG4gICAgKS50aGVuKCgpID0+IHsvLyBTYXZlZCBpbiBJREIgc3VjY2Vzc2Z1bGx5XHJcbiAgICAgIC8vIEJ1aWxkIGFuIGFycmF5IG9mIHRoZSBwYWdlLXNwZWNpZmljIHJlc291cmNlcy5cclxuICAgICAgbGV0IHBhZ2VSZXNvdXJjZXMgPSBbd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBwYWdlRGF0YS5pbWFnZU1vYmlsZSwgcGFnZURhdGEuaW1hZ2VEZXNrdG9wXTtcclxuXHJcbiAgICAgIC8vIEFkZCB0aGUgaGVybyBpbWFnZXNcclxuICAgICAgaWYgKCQoJy5oZXJvX19pbWFnZScpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBsZXQgaGVyb0ltYWdlcyA9IHRoaXMuZ2V0SGVyb0ltYWdlcygpO1xyXG4gICAgICAgIGlmIChoZXJvSW1hZ2VzKSBwYWdlUmVzb3VyY2VzID0gcGFnZVJlc291cmNlcy5jb25jYXQoaGVyb0ltYWdlcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFkZCB0aGUgYWNjb3VudCBhcHBseSBpbWFnZXNcclxuICAgICAgaWYgKCQoJy5hY2NvdW50YXBwbHknKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgbGV0IGFjY291bnRBcHBseUltYWdlID0gJCgnLmFjY291bnRhcHBseSAuY29udGFpbmVyJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyk7XHJcbiAgICAgICAgaWYgKGFjY291bnRBcHBseUltYWdlICE9IFwiXCIpIHtcclxuICAgICAgICAgIGFjY291bnRBcHBseUltYWdlID0gYWNjb3VudEFwcGx5SW1hZ2Uuc3BsaXQoJ3VybCgnKVsxXS5zcGxpdCgnKScpWzBdLnJlcGxhY2UoL1wiL2csICcnKS5yZXBsYWNlKC8nL2csICcnKTtcclxuICAgICAgICAgIHBhZ2VSZXNvdXJjZXMucHVzaChhY2NvdW50QXBwbHlJbWFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBBZGQgaW1hZ2VzIHRvIHRoZSBhcnJheVxyXG4gICAgICAkKCcucGFnZS1ib2R5IC53eXNpd3lnIGltZywgLmF1dGhvclBhbmVsIGltZycpLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgLy8gVHJpbSB3aGl0ZXNwYWNlIGZvcm0gc3JjXHJcbiAgICAgICAgbGV0IGltZ1NyYyA9ICQudHJpbSgkKGVsZW1lbnQpLmF0dHIoJ3NyYycpKTtcclxuICAgICAgICAvLyBJZiBlbXB0eSBzcmMgc2tpcCB0aGlzIGltYWdlXHJcbiAgICAgICAgaWYgKCEoaW1nU3JjID09PSAnJykpIHtcclxuICAgICAgICAgIC8vIEFkZCB0byBwYWdlIHJlc291cmNlc1xyXG4gICAgICAgICAgcGFnZVJlc291cmNlcy5wdXNoKCQoZWxlbWVudCkuYXR0cignc3JjJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBPcGVuIHRoZSB1bmlxdWUgY2FjaGUgZm9yIHRoaXMgVVJMXHJcbiAgICAgIGNhY2hlcy5vcGVuKHRoaXMuYXJ0aWNsZUNhY2hlTmFtZSkudGhlbigoY2FjaGUpID0+IHtcclxuICAgICAgICAvLyBVbmlxdWUgVVJMc1xyXG4gICAgICAgIGxldCB1bmlxdWVSZXNvdXJjZXMgPSBbXTtcclxuICAgICAgICAvLyBDcmVhdGUgYW5jaG9yIGVsZW1lbnQgdG8gZ2V0IGZ1bGwgVVJMc1xyXG4gICAgICAgIGxldCBhbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgLy8gRGVkdXBlIGFzc2V0c1xyXG4gICAgICAgICQuZWFjaChwYWdlUmVzb3VyY2VzLCAoaSwgZWwpID0+IHtcclxuICAgICAgICAgIC8vIExvYWQgdGhlIGN1cnJlbnQgVVJMIGludG8gdGhlIGFuY2hvclxyXG4gICAgICAgICAgYW5jaG9yLmhyZWYgPSBlbDtcclxuICAgICAgICAgIC8vIE9ubHkgY2FjaGUgVVJMcyBvbiBvdXIgZG9tYWluXHJcbiAgICAgICAgICBpZiAoYW5jaG9yLmhvc3QgIT09IHdpbmRvdy5sb2NhdGlvbi5ob3N0KSByZXR1cm47XHJcbiAgICAgICAgICAvLyBHZXQgdGhlIHJlbGF0aXZlIHBhdGhcclxuICAgICAgICAgIGxldCByZWxhdGl2ZSA9IGFuY2hvci5wYXRobmFtZSArIGFuY2hvci5zZWFyY2g7XHJcbiAgICAgICAgICAvLyBJZiBhbHJlYWR5IGluIGxpc3Qgb2YgYXNzZXRzLCBkb24ndCBpbmNsdWRlIGl0IGFnYWluXHJcbiAgICAgICAgICBpZiAoJC5pbkFycmF5KHJlbGF0aXZlLCB1bmlxdWVSZXNvdXJjZXMpID09PSAtMSkgdW5pcXVlUmVzb3VyY2VzLnB1c2gocmVsYXRpdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIENhY2hlIGFsbCByZXF1aXJlZCBhc3NldHNcclxuICAgICAgICBsZXQgdXBkYXRlQ2FjaGUgPSBjYWNoZS5hZGRBbGwodW5pcXVlUmVzb3VyY2VzKTtcclxuICAgICAgICAvLyBVcGRhdGUgVUkgdG8gaW5kaWNhdGUgc3VjY2Vzc1xyXG4gICAgICAgIC8vIE9yIGNhdGNoIGFueSBlcnJvcnMgaWYgaXQgZG9lc24ndCBzdWNjZWVkXHJcbiAgICAgICAgdXBkYXRlQ2FjaGUudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnQXJ0aWNsZSBpcyBub3cgYXZhaWxhYmxlIG9mZmxpbmUuJyk7XHJcbiAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2hlcm9fX3NhdmVGb3JPZmZsaW5lLS1zYXZlZCcpLmF0dHIoJ3RpdGxlJywgJ1NhdmVkIGZvciBvZmZsaW5lJykuZmluZCgnc3BhbicpLnRleHQoJ0FydGljbGUgU2F2ZWQnKTtcclxuICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ0FydGljbGUgY291bGQgbm90IGJlIHNhdmVkIGZvciBvZmZsaW5lLicsIGVycm9yKTtcclxuICAgICAgICAgIHRvYXN0LnNldFRleHQoJ0FydGljbGUgY291bGQgbm90IGJlIHNhdmVkIGZvciBvZmZsaW5lJyk7XHJcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0b2FzdC5zaG93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7Ly8gVGhlcmUgd2FzIGFuIGVycm9yIHNhdmluZyB0byBJREJcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgIHRvYXN0LnNldFRleHQoJ0FydGljbGUgY291bGQgbm90IGJlIHNhdmVkIGZvciBvZmZsaW5lJyk7XHJcbiAgICAgIHRvYXN0LnNob3coKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5pc0N1cnJlbnRQYWdlU2F2ZWQoKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBPZmZsaW5lQXJ0aWNsZXMge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5hcnRpY2xlR3JpZC0tc2F2ZWQnLFxyXG4gICAgICBncmlkOiAnLmFydGljbGVHcmlkLS1zYXZlZCAuYXJ0aWNsZUdyaWRfX2dyaWQnLFxyXG4gICAgICB0aXRsZTogJy5hcnRpY2xlR3JpZC0tc2F2ZWQgLmFydGljbGVHcmlkX190aXRsZScsXHJcbiAgICAgIHRlbXBsYXRlOiAnI2FydGljbGVHcmlkX19wYW5lbFRlbXBsYXRlJyxcclxuICAgICAgZWRpdFNhdmVkQXJ0aWNsZXM6ICcuaGVyb19fZWRpdFNhdmVkQXJ0aWNsZXMnLFxyXG4gICAgICBhcnRpY2xlczogJy5hcnRpY2xlR3JpZC0tc2F2ZWQgLmFydGljbGVHcmlkX19ncmlkIC5hcnRpY2xlUGFuZWwnLFxyXG4gICAgICBkZWxldGFibGVBcnRpY2xlOiAnLmFydGljbGVHcmlkLS1zYXZlZCAuYXJ0aWNsZUdyaWRfX2dyaWQgLmFydGljbGVQYW5lbC0tZGVsZXRhYmxlJ1xyXG4gICAgfTtcclxuICAgIHRoaXMuc2F2ZUZvck9mZmxpbmUgPSBuZXcgU2F2ZUZvck9mZmxpbmUoKTtcclxuICAgIHRoaXMudGVtcGxhdGUgPSAkKCQodGhpcy5zZWwudGVtcGxhdGUpLmh0bWwoKSk7XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxvYWRBcnRpY2xlcyA9IHRoaXMubG9hZEFydGljbGVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnBvcHVsYXRlVGVtcGxhdGVzID0gdGhpcy5wb3B1bGF0ZVRlbXBsYXRlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmhhbmRsZUVkaXQgPSB0aGlzLmhhbmRsZUVkaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZGVsZXRlQXJ0aWNsZSA9IHRoaXMuZGVsZXRlQXJ0aWNsZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oYW5kbGVTd2lwZSA9IHRoaXMuaGFuZGxlU3dpcGUuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGxvYWRBcnRpY2xlcygpIHtcclxuICAgIHJldHVybiBEYXRhYmFzZS5nZXRBcnRpY2xlcygpLnRoZW4oKGFydGljbGVzKSA9PiB7XHJcbiAgICAgIGxldCBpdGVtcyA9IFtdO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGFydGljbGUgPSBhcnRpY2xlc1tpXTtcclxuICAgICAgICBpdGVtcy5wdXNoKHtcclxuICAgICAgICAgIExpbms6IGFydGljbGUubGluayxcclxuICAgICAgICAgIFRpdGxlOiBhcnRpY2xlLnRpdGxlLFxyXG4gICAgICAgICAgRGVzY3JpcHRpb246IGFydGljbGUuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICBDYXRlZ29yeToge1xyXG4gICAgICAgICAgICBOYW1lOiBhcnRpY2xlLmNhdGVnb3J5TmFtZSxcclxuICAgICAgICAgICAgTGluazogYXJ0aWNsZS5jYXRlZ29yeUxpbmtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBUaW1lVG9SZWFkOiBhcnRpY2xlLnRpbWVUb1JlYWQsXHJcbiAgICAgICAgICBJbWFnZXM6IHtcclxuICAgICAgICAgICAgTW9iaWxlOiBhcnRpY2xlLmltYWdlTW9iaWxlLFxyXG4gICAgICAgICAgICBEZXNrdG9wOiBhcnRpY2xlLmltYWdlRGVza3RvcFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIElzTGFyZ2U6IGFydGljbGUuaXNMYXJnZSxcclxuICAgICAgICAgIElzVmlkZW86IGFydGljbGUuaXNWaWRlb1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5ncmlkKS5odG1sKHRoaXMucG9wdWxhdGVUZW1wbGF0ZXMoaXRlbXMpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHRoaXMuc2VsLnRpdGxlKS50ZXh0KCdZb3UgaGF2ZSBubyBzYXZlZCBhcnRpY2xlcycpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHBvcHVsYXRlVGVtcGxhdGVzKGl0ZW1zKSB7XHJcbiAgICBsZXQgb3V0cHV0ID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIC8vIENsb25lIHRlbXBsYXRlXHJcbiAgICAgIGxldCAkdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlLmNsb25lKCk7XHJcbiAgICAgIC8vIEdldCB0aGUgaXRlbVxyXG4gICAgICBsZXQgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAvLyBTZXQgaW1hZ2UgYnJlYWtwb2ludFxyXG4gICAgICBsZXQgZGVza3RvcEJyZWFrcG9pbnQgPSA5OTI7XHJcbiAgICAgIC8vIEdlbmVyYXRlIElEXHJcbiAgICAgIGxldCBwYW5lbElkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpO1xyXG4gICAgICAvLyBQb3B1bGF0ZSBJRFxyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbCcpLmF0dHIoJ2lkJywgcGFuZWxJZCk7XHJcbiAgICAgIC8vIElmIGxhcmdlIHBhbmVsXHJcbiAgICAgIGlmIChpdGVtLklzTGFyZ2UpIHtcclxuICAgICAgICAvLyBVcGRhdGUgaW1hZ2UgYnJlYWtwb2ludFxyXG4gICAgICAgIGRlc2t0b3BCcmVha3BvaW50ID0gNzY4O1xyXG4gICAgICAgIC8vIEFkZCBjbGFzc1xyXG4gICAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsJykuYWRkQ2xhc3MoJ2FydGljbGVQYW5lbC0tbGFyZ2UnKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBJZiB2aWRlb1xyXG4gICAgICBpZiAoaXRlbS5Jc1ZpZGVvKSB7XHJcbiAgICAgICAgLy8gQWRkIGNsYXNzXHJcbiAgICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5hZGRDbGFzcygnYXJ0aWNsZVBhbmVsLS12aWRlbycpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFBvcHVsYXRlIGltYWdlc1xyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9faW1hZ2UnKS5hdHRyKHtcclxuICAgICAgICBocmVmOiBpdGVtLkxpbmssXHJcbiAgICAgICAgdGl0bGU6IGl0ZW0uVGl0bGVcclxuICAgICAgfSkuYXR0cignc3R5bGUnLCAnYmFja2dyb3VuZC1pbWFnZTogdXJsKCcgKyBpdGVtLkltYWdlcy5Nb2JpbGUgKyAnKTsnKTtcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJ3N0eWxlJylbMF0uaW5uZXJIVE1MID0gJ0BtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6ICcgKyBkZXNrdG9wQnJlYWtwb2ludCArICdweCl7IycgKyBwYW5lbElkICsgJyAuYXJ0aWNsZVBhbmVsX19pbWFnZXtiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyArIGl0ZW0uSW1hZ2VzLkRlc2t0b3AgKyAnKSAhaW1wb3J0YW50O319JztcclxuICAgICAgLy8gUG9wdWxhdGUgbGlua1xyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fY29udGVudCA+IGEnKS5hdHRyKHtcclxuICAgICAgICBocmVmOiBpdGVtLkxpbmssXHJcbiAgICAgICAgdGl0bGU6IGl0ZW0uVGl0bGVcclxuICAgICAgfSk7XHJcbiAgICAgIC8vIFBvcHVsYXRlIHRpdGxlXHJcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX190aXRsZScpLnRleHQoaXRlbS5UaXRsZSk7XHJcbiAgICAgIC8vIFBvcHVsYXRlIGRlc2NyaXB0aW9uXHJcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX19kZXNjcmlwdGlvbicpLnRleHQoaXRlbS5EZXNjcmlwdGlvbik7XHJcbiAgICAgIC8vIFBvcHVsYXRlIGNhdGVnb3J5XHJcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX19zdWJUaXRsZSBhOmZpcnN0LWNoaWxkJykuYXR0cih7XHJcbiAgICAgICAgJ2hyZWYnOiBpdGVtLkNhdGVnb3J5LkxpbmssXHJcbiAgICAgICAgJ3RpdGxlJzogaXRlbS5DYXRlZ29yeS5OYW1lXHJcbiAgICAgIH0pLnRleHQoaXRlbS5DYXRlZ29yeS5OYW1lKTtcclxuICAgICAgLy8gUG9wdWxhdGUgdGltZSB0byByZWFkXHJcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX19zdWJUaXRsZSBhOmxhc3QtY2hpbGQnKS5hdHRyKHtcclxuICAgICAgICAnaHJlZic6IGl0ZW0uTGluayxcclxuICAgICAgICAndGl0bGUnOiBpdGVtLlRpdGxlXHJcbiAgICAgIH0pLnRleHQoaXRlbS5UaW1lVG9SZWFkKTtcclxuICAgICAgLy8gUHVzaCBpdGVtIHRvIG91dHB1dFxyXG4gICAgICBvdXRwdXQucHVzaCgkdGVtcGxhdGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dHB1dDtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5lZGl0U2F2ZWRBcnRpY2xlcywgdGhpcy5oYW5kbGVFZGl0KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmRlbGV0YWJsZUFydGljbGUsIHRoaXMuZGVsZXRlQXJ0aWNsZSk7XHJcbiAgICAkKHRoaXMuc2VsLmFydGljbGVzKS5zd2lwZWRldGVjdCh0aGlzLmhhbmRsZVN3aXBlKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUVkaXQoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgJCh0aGlzLnNlbC5lZGl0U2F2ZWRBcnRpY2xlcykudG9nZ2xlQ2xhc3MoJ2hlcm9fX2VkaXRTYXZlZEFydGljbGVzLS1lZGl0aW5nJyk7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5lZGl0U2F2ZWRBcnRpY2xlcykuaGFzQ2xhc3MoJ2hlcm9fX2VkaXRTYXZlZEFydGljbGVzLS1lZGl0aW5nJykpIHtcclxuICAgICAgJCh0aGlzLnNlbC5ncmlkKS5maW5kKCcuYXJ0aWNsZVBhbmVsJykuYWRkQ2xhc3MoJ2FydGljbGVQYW5lbC0tZGVsZXRhYmxlJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKHRoaXMuc2VsLmdyaWQpLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5yZW1vdmVDbGFzcygnYXJ0aWNsZVBhbmVsLS1kZWxldGFibGUnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRlbGV0ZUFydGljbGUoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0ICRhcnRpY2xlUGFuZWwgPSAkKGUudGFyZ2V0KS5wYXJlbnRzKCcuYXJ0aWNsZVBhbmVsJyk7XHJcbiAgICBpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2FydGljbGVQYW5lbCcpKSAkYXJ0aWNsZVBhbmVsID0gJChlLnRhcmdldCk7XHJcbiAgICBsZXQgdXJsID0gbmV3IFVSTCgkYXJ0aWNsZVBhbmVsLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2ltYWdlJylbMF0uaHJlZik7XHJcbiAgICB0aGlzLnNhdmVGb3JPZmZsaW5lLmRvVW5zYXZlKHVybC5wYXRobmFtZSkudGhlbigoKSA9PiB7XHJcbiAgICAgICRhcnRpY2xlUGFuZWwucGFyZW50KCkucmVtb3ZlKCk7XHJcbiAgICAgIGlmICgkKHRoaXMuc2VsLmdyaWQpLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICQodGhpcy5zZWwuZ3JpZCkuYXBwZW5kKCc8ZGl2IGNsYXNzPVwiY29sLTEyXCI+PGgyIGNsYXNzPVwiYXJ0aWNsZUdyaWRfX3RpdGxlXCI+WW91IGhhdmUgbm8gc2F2ZWQgYXJ0aWNsZXM8L2gyPjwvZGl2PicpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRWRpdCh7cHJldmVudERlZmF1bHQ6ICgpID0+IHt9fSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlU3dpcGUoc3dpcGVkaXIsIGVsZW1lbnQpIHtcclxuICAgIC8vIHN3aXBlZGlyIGNvbnRhaW5zIGVpdGhlciBcIm5vbmVcIiwgXCJsZWZ0XCIsIFwicmlnaHRcIiwgXCJ0b3BcIiwgb3IgXCJkb3duXCJcclxuICAgIGxldCBpc0RlbGV0YWJsZSA9ICQoZWxlbWVudCkuaGFzQ2xhc3MoJ2FydGljbGVQYW5lbC0tZGVsZXRhYmxlJyk7XHJcbiAgICBpZiAoc3dpcGVkaXIgPT09ICdsZWZ0JyAmJiAhaXNEZWxldGFibGUpIHtcclxuICAgICAgJCgnLmFydGljbGVQYW5lbC5hcnRpY2xlUGFuZWwtLWRlbGV0YWJsZScpLnJlbW92ZUNsYXNzKCdhcnRpY2xlUGFuZWwtLWRlbGV0YWJsZScpO1xyXG4gICAgICAkKGVsZW1lbnQpLmFkZENsYXNzKCdhcnRpY2xlUGFuZWwtLWRlbGV0YWJsZScpO1xyXG4gICAgfSBlbHNlIGlmIChzd2lwZWRpciA9PT0gJ3JpZ2h0JyAmJiBpc0RlbGV0YWJsZSkge1xyXG4gICAgICAkKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdhcnRpY2xlUGFuZWwtLWRlbGV0YWJsZScpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMubG9hZEFydGljbGVzKCkudGhlbigoKSA9PiB7XHJcbiAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIE9mZmxpbmUge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zYXZlRm9yT2ZmbGluZSA9IG5ldyBTYXZlRm9yT2ZmbGluZSgpO1xyXG4gICAgdGhpcy5vZmZsaW5lQXJ0aWNsZXMgPSBuZXcgT2ZmbGluZUFydGljbGVzKCk7XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hlY2tTdGF0dXMgPSB0aGlzLmNoZWNrU3RhdHVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmRvT25saW5lID0gdGhpcy5kb09ubGluZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kb09mZmxpbmUgPSB0aGlzLmRvT2ZmbGluZS5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tTdGF0dXMoKSB7XHJcbiAgICBpZiAobmF2aWdhdG9yLm9uTGluZSkge1xyXG4gICAgICB0aGlzLmRvT25saW5lKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRvT2ZmbGluZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZG9PbmxpbmUoKSB7XHJcbiAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ29mZmxpbmUnKTtcclxuICAgICQoJy5kaXNhYmxlLW9mZmxpbmVbdGFiaW5kZXg9XCItMVwiXSwgLmRpc2FibGUtb2ZmbGluZSAqW3RhYmluZGV4PVwiLTFcIl0nKS5yZW1vdmVBdHRyKCd0YWJpbmRleCcpO1xyXG4gIH1cclxuXHJcbiAgZG9PZmZsaW5lKCkge1xyXG4gICAgJCgnYm9keScpLmFkZENsYXNzKCdvZmZsaW5lJyk7XHJcbiAgICAkKCcuZGlzYWJsZS1vZmZsaW5lLCAuZGlzYWJsZS1vZmZsaW5lIConKS5hdHRyKCd0YWJpbmRleCcsICctMScpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvbmxpbmUnLCB0aGlzLmRvT25saW5lKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgdGhpcy5kb09mZmxpbmUpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICghKCdvbkxpbmUnIGluIG5hdmlnYXRvcikpIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuc2F2ZUZvck9mZmxpbmUuaW5pdCgpO1xyXG4gICAgdGhpcy5vZmZsaW5lQXJ0aWNsZXMuaW5pdCgpO1xyXG4gICAgdGhpcy5jaGVja1N0YXR1cygpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBPZmZsaW5lKCk7XHJcbiIsImNsYXNzIFBhc3N3b3JkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuZm9ybXNfX3Bhc3N3b3JkJyxcbiAgICAgIHRvZ2dsZTogJy5mb3Jtc19fcGFzc3dvcmQgaW5wdXRbdHlwZT1jaGVja2JveF0nXG4gICAgfTtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMudG9nZ2xlUGxhaW5UZXh0ID0gdGhpcy50b2dnbGVQbGFpblRleHQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgdGhpcy5zZWwudG9nZ2xlLCAoZSkgPT4ge1xuICAgICAgY29uc3QgcGFzc3dvcmRUYXJnZXQgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLWZpZWxkLWlkJyk7XG4gICAgICB0aGlzLnRvZ2dsZVBsYWluVGV4dChwYXNzd29yZFRhcmdldCk7XG4gICAgfSk7XG4gIH1cblxuICB0b2dnbGVQbGFpblRleHQoZmllbGRJZCkge1xuICAgIGNvbnN0IGZpZWxkID0gJCgnIycgKyBmaWVsZElkKTtcbiAgICBzd2l0Y2ggKGZpZWxkLmF0dHIoJ3R5cGUnKSkge1xuICAgIGNhc2UgJ3Bhc3N3b3JkJzpcbiAgICAgIGZpZWxkLmF0dHIoJ3R5cGUnLCAndGV4dCcpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgIGNhc2UgJ3RleHQnOlxuICAgICAgZmllbGQuYXR0cigndHlwZScsICdwYXNzd29yZCcpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBQYXNzd29yZCgpO1xuIiwiY2xhc3MgUGFzc3dvcmRSZW1pbmRlckZvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jb25maWcgPSB7XHJcbiAgICAgIHVybFRva2VuOiAnL2xpYnMvZ3Jhbml0ZS9jc3JmL3Rva2VuLmpzb24nLFxyXG4gICAgICB1cmxMb2dpbjogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9sb2dpbi9pbmRleC5qc29uJyxcclxuICAgICAgdXJsUmVxdWVzdDogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZXF1ZXN0X3Bhc3N3b3JkL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxSZXNldDogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZXNldF9wYXNzd29yZC9pbmRleC5qc29uJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLnJlc2V0LXBhc3N3b3JkLWNvbnRhaW5lcidcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldFBhdGhIb21lID0gdGhpcy5nZXRQYXRoSG9tZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY3JlYXRlQ29va2llID0gdGhpcy5jcmVhdGVDb29raWUuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnJlcXVlc3RUb2tlbiA9IHRoaXMucmVxdWVzdFRva2VuLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlc2V0UGFzc3dvcmQgPSB0aGlzLnJlc2V0UGFzc3dvcmQuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldFBhdGhQcmVmaXgoKSB7XHJcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xyXG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoSG9tZSgpIHtcclxuICAgIGNvbnN0IGhvbWUgPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1ob21lXFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAoaG9tZSA/IGhvbWUgOiAnJyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgncGFzc3dvcmQnLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJChlbGVtZW50KS5hdHRyKCdwYXR0ZXJuJykpLnRlc3QodmFsdWUpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkIGZvcm1hdCBpcyBub3QgdmFsaWQnKTtcclxuXHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnZXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICByZXR1cm4gKCQoJyMnICsgJChlbGVtZW50KS5hdHRyKCdkYXRhLWVxdWFsVG8nKSkudmFsKCkgPT09ICQoZWxlbWVudCkudmFsKCkpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnKTtcclxuXHJcbiAgICB2YXIgcmVtaW5kZXJQYWdlID0gJCh0aGlzLnNlbC5jb21wb25lbnQpO1xyXG4gICAgaWYgKHJlbWluZGVyUGFnZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHZhciB1c2VybmFtZSA9IHJlbWluZGVyUGFnZS5kYXRhKCd1c2VybmFtZScpO1xyXG4gICAgICB2YXIgdG9rZW4gPSByZW1pbmRlclBhZ2UuZGF0YSgndG9rZW4nKTtcclxuXHJcbiAgICAgIGlmICgodXNlcm5hbWUgIT09IG51bGwgJiYgdHlwZW9mICh1c2VybmFtZSkgIT09ICd1bmRlZmluZWQnICYmIHVzZXJuYW1lLmxlbmd0aCA+IDApICYmICh0b2tlbiAhPT0gbnVsbCAmJiB0eXBlb2YgKHRva2VuKSAhPT0gJ3VuZGVmaW5lZCcgJiYgdG9rZW4ubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMycpLnNob3coKTtcclxuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMScpLmhpZGUoKTtcclxuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMicpLmhpZGUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMScpLnNob3coKTtcclxuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMicpLmhpZGUoKTtcclxuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMycpLmhpZGUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTEgZm9ybScpLnZhbGlkYXRlKHtcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgcmVzZXRQYXNzd29yZF9fZW1haWw6ICdlbWFpbCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xyXG4gICAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1Ym1pdEhhbmRsZXI6IChmb3JtKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJlcXVlc3RUb2tlbihmb3JtKTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTMgZm9ybScpLnZhbGlkYXRlKHtcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgcmVzZXRfX2NyZWF0ZVBhc3N3b3JkOiAncGFzc3dvcmQnLFxyXG4gICAgICAgICAgcmVzZXRfX2NvbmZpcm1QYXNzd29yZDogJ2VxdWFsVG8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcclxuICAgICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5yZXNldFBhc3N3b3JkKGZvcm0pO1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjcmVhdGVDb29raWUobmFtZSwgdmFsdWUsIGV4cGlyeVNlY29uZHMpIHtcclxuICAgIHZhciBleHBpcmVzID0gJyc7XHJcbiAgICBpZiAoZXhwaXJ5U2Vjb25kcykge1xyXG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChleHBpcnlTZWNvbmRzICogMTAwMCkpO1xyXG4gICAgICBleHBpcmVzID0gJzsgZXhwaXJlcz0nICsgZGF0ZS50b1VUQ1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArICc9JyArIHZhbHVlICsgZXhwaXJlcyArICc7IHBhdGg9Lyc7XHJcbiAgfVxyXG5cclxuICByZXF1ZXN0VG9rZW4oZm9ybSkge1xyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIHVzZXJuYW1lOiAkKGZvcm0pLmZpbmQoJ2lucHV0I3Jlc2V0UGFzc3dvcmRfX2VtYWlsJykudmFsKCksXHJcbiAgICAgIHBhZ2U6IHdpbmRvdy5sb2NhdGlvbi5ocmVmXHJcbiAgICB9O1xyXG5cclxuICAgICQoZm9ybSkuZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgJChmb3JtKS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsUmVxdWVzdCxcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJy5zdGVwLTEnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJy5zdGVwLTInKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LlxcbicgKyByZXNwb25zZS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkKGZvcm0pLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgnR2V0IG5ldyBwYXNzd29yZCcpO1xyXG4gICAgICAgICAgJChmb3JtKS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ0dldCBuZXcgcGFzc3dvcmQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXNldFBhc3N3b3JkKGZvcm0pIHtcclxuICAgIHZhciB1c2VybmFtZSA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5kYXRhKCd1c2VybmFtZScpO1xyXG4gICAgdmFyIHRva2VuID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmRhdGEoJ3Rva2VuJyk7XHJcbiAgICB2YXIgcGFzc3dvcmQgPSAkKGZvcm0pLmZpbmQoJ2lucHV0I3Jlc2V0X19jcmVhdGVQYXNzd29yZCcpLnZhbCgpO1xyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcclxuICAgICAgdG9rZW46IHRva2VuLFxyXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmRcclxuICAgIH07XHJcblxyXG4gICAgJChmb3JtKS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICAkKGZvcm0pLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxSZXNldCxcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKG5leHRUb2tlblJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dGNzcmZ0b2tlbiA9IG5leHRUb2tlblJlc3BvbnNlLnRva2VuO1xyXG5cclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxMb2dpbixcclxuICAgICAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogdXNlcm5hbWUsIHBhc3N3b3JkOiBwYXNzd29yZCB9LFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBuZXh0Y3NyZnRva2VuIH0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChsb2dpblJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ2luUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dpblJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgbG9naW5SZXNwb25zZSwgdHJ1ZSBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiYWNrVXJsID0gJChmb3JtKS5kYXRhKCdiYWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkLnRyaW0oYmFja1VybCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja1VybCA9IHRoaXMuZ2V0UGF0aEhvbWUoKSArICcuaHRtbCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gYmFja1VybDtcclxuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGxvZ2luIHVzaW5nIHlvdXIgdXBkYXRlZCBjcmVkZW50aWFscy5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGxvZ2luIHVzaW5nIHlvdXIgdXBkYXRlZCBjcmVkZW50aWFscy4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkKGZvcm0pLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgnU3VibWl0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChmb3JtKS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ1N1Ym1pdCcpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byByZXF1ZXN0IGEgcGFzc3dvcmQgcmVzZXQuXFxuJyArIHJlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byByZXF1ZXN0IGEgcGFzc3dvcmQgcmVzZXQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgUGFzc3dvcmRSZW1pbmRlckZvcm0oKTtcclxuIiwiY2xhc3MgUGFzc3dvcmRWYWxpZGl0eUFwaSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY2hlY2tDYXNpbmcgPSB0aGlzLmNoZWNrQ2FzaW5nLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jaGVja1NwZWNpYWwgPSB0aGlzLmNoZWNrU3BlY2lhbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2hlY2tOdW1iZXIgPSB0aGlzLmNoZWNrTnVtYmVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jaGVja0xlbmd0aCA9IHRoaXMuY2hlY2tMZW5ndGguYmluZCh0aGlzKTtcbiAgICB0aGlzLmlzVmFsaWQgPSB0aGlzLmlzVmFsaWQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGlzVmFsaWQocGFzc3dvcmQpIHtcbiAgICBjb25zdCBpc0xlbmd0aFZhbGlkID0gdGhpcy5jaGVja0xlbmd0aChwYXNzd29yZCk7XG4gICAgY29uc3QgaXNDYXNpbmdWYWxpZCA9IHRoaXMuY2hlY2tDYXNpbmcocGFzc3dvcmQpO1xuICAgIGNvbnN0IGlzU3BlaWNhbFZhbGlkID0gdGhpcy5jaGVja1NwZWNpYWwocGFzc3dvcmQpO1xuICAgIGNvbnN0IGlzTnVtYmVyVmFsaWQgPSB0aGlzLmNoZWNrTnVtYmVyKHBhc3N3b3JkKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgIGlzVmFsaWQ6IGlzTGVuZ3RoVmFsaWQgJiYgaXNDYXNpbmdWYWxpZCAmJiBpc1NwZWljYWxWYWxpZCAmJiBpc051bWJlclZhbGlkLFxuICAgICAgaXNMZW5ndGhWYWxpZCxcbiAgICAgIGlzQ2FzaW5nVmFsaWQsXG4gICAgICBpc1NwZWljYWxWYWxpZCxcbiAgICAgIGlzTnVtYmVyVmFsaWRcbiAgICB9O1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGNoZWNrTGVuZ3RoKHBhc3N3b3JkKSB7XG4gICAgcmV0dXJuIHBhc3N3b3JkLmxlbmd0aCA+PSA4O1xuICB9XG5cbiAgY2hlY2tDYXNpbmcocGFzc3dvcmQpIHtcbiAgICByZXR1cm4gL14oPz0uKlthLXpdKS4rJC8udGVzdChwYXNzd29yZCkgJiYgL14oPz0uKltBLVpdKS4rJC8udGVzdChwYXNzd29yZCk7XG4gIH1cblxuICBjaGVja051bWJlcihwYXNzd29yZCkge1xuICAgIHJldHVybiAvXig/PS4qWzAtOV0pLiskLy50ZXN0KHBhc3N3b3JkKTtcbiAgfVxuXG4gIGNoZWNrU3BlY2lhbChwYXNzd29yZCkge1xuICAgIHJldHVybiAvXig/PS4qWyHCoyUmKigpPXt9QCM+PF0pLiskLy50ZXN0KHBhc3N3b3JkKTtcbiAgfVxufVxuXG5cbi8vIEkndmUgYXNzdW1lZCB0aGVyZSB3aWxsIG9ubHkgYmUgb25lIHBhc3N3b3JkIHZhbGlkaXR5IGNoZWNrZXIgb24gYSBwYWdlIGF0IG9uY2UsIGJlY2F1c2U6XG4vLyAtIHRoZSB2YWxpZGl0eSBjaGVja2VyIHdvdWxkIG9ubHkgYmUgb24gdGhlIG1haW4gcGFzc3dvcmQgZW50cnkgZmllbGQgYW5kIG5vdCB0aGUgY29uZmlybWF0aW9uXG4vLyAtIGEgdXNlciB3b3VsZG4ndCBiZSBzZXR0aW5nIG1vcmUgdGhhbiBvbmUgcGFzc3dvcmQgYXQgb25jZVxuY2xhc3MgUGFzc3dvcmRWYWxpZGl0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLnZhbGlkaXR5LWNoZWNrcydcbiAgICB9O1xuXG4gICAgdGhpcy5wYXNzd29yZEFwaSA9IG5ldyBQYXNzd29yZFZhbGlkaXR5QXBpKCk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgY29uc3QgcGFzc3dvcmRGaWVsZElkID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmF0dHIoJ2RhdGEtZmllbGQtaWQnKTtcbiAgICBjb25zdCBwYXNzd29yZEZpZWxkID0gJCgnIycgKyBwYXNzd29yZEZpZWxkSWQpO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2tleXVwIGtleXByZXNzIGNoYW5nZScsICcjJyArIHBhc3N3b3JkRmllbGRJZCwgKCkgPT4ge1xuICAgICAgbGV0IHBhc3N3b3JkID0gcGFzc3dvcmRGaWVsZC52YWwoKTtcbiAgICAgIHRoaXMuY2hlY2tQYXNzd29yZFZhbGlkaXR5KHBhc3N3b3JkKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlzUGFzc3dvcmRWYWxpZChwYXNzd29yZCkge1xuICAgIGxldCByZXN1bHQgPSB0aGlzLnBhc3N3b3JkQXBpLmlzVmFsaWQocGFzc3dvcmQpO1xuICAgIHJldHVybiByZXN1bHQuaXNWYWxpZDtcbiAgfVxuXG4gIGNoZWNrUGFzc3dvcmRWYWxpZGl0eShwYXNzd29yZCkge1xuICAgIGxldCByZXN1bHQgPSB0aGlzLnBhc3N3b3JkQXBpLmlzVmFsaWQocGFzc3dvcmQpO1xuXG4gICAgaWYgKHJlc3VsdC5pc0xlbmd0aFZhbGlkKSB7XG4gICAgICAkKCdbZGF0YS1jaGVjaz1sZW5ndGhdJykuYWRkQ2xhc3MoJ2lzLXZhbGlkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJ1tkYXRhLWNoZWNrPWxlbmd0aF0nKS5yZW1vdmVDbGFzcygnaXMtdmFsaWQnKTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0LmlzQ2FzaW5nVmFsaWQpIHtcbiAgICAgICQoJ1tkYXRhLWNoZWNrPWNhc2luZ10nKS5hZGRDbGFzcygnaXMtdmFsaWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnW2RhdGEtY2hlY2s9Y2FzaW5nXScpLnJlbW92ZUNsYXNzKCdpcy12YWxpZCcpO1xuICAgIH1cblxuICAgIGlmIChyZXN1bHQuaXNTcGVpY2FsVmFsaWQpIHtcbiAgICAgICQoJ1tkYXRhLWNoZWNrPXNwZWNpYWxdJykuYWRkQ2xhc3MoJ2lzLXZhbGlkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJ1tkYXRhLWNoZWNrPXNwZWNpYWxdJykucmVtb3ZlQ2xhc3MoJ2lzLXZhbGlkJyk7XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdC5pc051bWJlclZhbGlkKSB7XG4gICAgICAkKCdbZGF0YS1jaGVjaz1udW1iZXJdJykuYWRkQ2xhc3MoJ2lzLXZhbGlkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJ1tkYXRhLWNoZWNrPW51bWJlcl0nKS5yZW1vdmVDbGFzcygnaXMtdmFsaWQnKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFBhc3N3b3JkVmFsaWRpdHkoKTtcbiIsImNsYXNzIFJlZ2lzdGVyRm9ybSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNvbmZpZyA9IHtcclxuICAgICAgZmJBcHBJZDogJzEwODAwMzEzMjg4MDEyMTEnLFxyXG4gICAgICBnb0NsaWVudElkOiAnMzEzNDY5ODM3NDIwLWw4ODJoMzlnZThuOG45cGI5N2xkdmprM2ZtOHBwcWdzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJyxcclxuXHJcbiAgICAgIHVybFRva2VuOiAnL2xpYnMvZ3Jhbml0ZS9jc3JmL3Rva2VuLmpzb24nLFxyXG4gICAgICB1cmxSZWZyZXNoQ2hlY2s6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcclxuICAgICAgdXJsUmVnaXN0ZXI6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVnaXN0ZXIvaW5kZXguanNvbicsXHJcbiAgICAgIHVybFVwZGF0ZUNhdGVnb3JpZXM6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvdXBkYXRlX2NhdGVnb3JpZXMvaW5kZXguanNvbidcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5wYWdlLWJvZHkucmVnaXN0ZXIsICNkb3dubG9hZCwgLmdhdGVkJyxcclxuICAgICAgYnV0dG9uRmFjZWJvb2s6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmZiJyxcclxuICAgICAgYnV0dG9uTGlua2VkaW46ICcuZm9ybXNfX2N0YS0tc29jaWFsLmxpJyxcclxuICAgICAgYnV0dG9uR29vZ2xlUGx1czogJy5mb3Jtc19fY3RhLS1zb2NpYWwuZ28nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZ2V0UGF0aFByZWZpeCA9IHRoaXMuZ2V0UGF0aFByZWZpeC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRQYXRoSG9tZSA9IHRoaXMuZ2V0UGF0aEhvbWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxvZ2dlZEluID0gdGhpcy5sb2dnZWRJbi5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMudHJ5UmVnaXN0ZXJGYWNlYm9vayA9IHRoaXMudHJ5UmVnaXN0ZXJGYWNlYm9vay5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50cnlSZWdpc3RlckxpbmtlZGluID0gdGhpcy50cnlSZWdpc3RlckxpbmtlZGluLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnRyeVJlZ2lzdGVyR29vZ2xlID0gdGhpcy50cnlSZWdpc3Rlckdvb2dsZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50cnlSZWdpc3RlciA9IHRoaXMudHJ5UmVnaXN0ZXIuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmV4ZWN1dGVSZWdpc3RlciA9IHRoaXMuZXhlY3V0ZVJlZ2lzdGVyLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoUHJlZml4KCkge1xyXG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UGF0aEhvbWUoKSB7XHJcbiAgICBjb25zdCBob21lID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtaG9tZVxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XHJcbiAgICByZXR1cm4gKGhvbWUgPyBob21lIDogJycpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICByZWFkQ29va2llKG5hbWUpIHtcclxuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xyXG4gICAgdmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjID0gY2FbaV07XHJcbiAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xyXG4gICAgICBpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgJCh3aW5kb3cpLm9uKCd1c2VybG9nZ2VkaW4uREhMJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLmxvZ2dlZEluKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgncGFzc3dvcmQnLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcclxuICAgICAgaWYgKCQudHJpbSh2YWx1ZSkubGVuZ3RoID09PSAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJChlbGVtZW50KS5hdHRyKCdwYXR0ZXJuJykpLnRlc3QodmFsdWUpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkIGZvcm1hdCBpcyBub3QgdmFsaWQnKTtcclxuXHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnZXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICByZXR1cm4gKCQoJyMnICsgJChlbGVtZW50KS5hdHRyKCdkYXRhLWVxdWFsVG8nKSkudmFsKCkgPT09ICQoZWxlbWVudCkudmFsKCkpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnKTtcclxuXHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLmxlbmd0aCA+IDApIHtcclxuICAgICAgd2luZG93LmZiQXN5bmNJbml0ID0gKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5mYl9pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5GQikgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5GQiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB3aW5kb3cuRkIuaW5pdCh7XHJcbiAgICAgICAgICAgICAgYXBwSWQ6IHRoaXMuY29uZmlnLmZiQXBwSWQsXHJcbiAgICAgICAgICAgICAgY29va2llOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHhmYm1sOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZlcnNpb246ICd2Mi44J1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmZiX2ludGVydmFsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYWNlYm9vay1qc3NkaycpID09PSBudWxsKSB7XHJcbiAgICAgICAgdmFyIGZqcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgICAgICB2YXIganMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICBqcy5pZCA9ICdmYWNlYm9vay1qc3Nkayc7XHJcbiAgICAgICAganMuc3JjID0gJy8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fRU4vc2RrLmpzJztcclxuICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcbiAgICAgIH1cclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLm9uKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICB0aGlzLnRyeVJlZ2lzdGVyRmFjZWJvb2soZXZ0KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikubGVuZ3RoID4gMCkge1xyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIHRoaXMudHJ5UmVnaXN0ZXJMaW5rZWRpbihldnQpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGdvb2dsZUJ1dHRvbiA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpO1xyXG4gICAgaWYgKGdvb2dsZUJ1dHRvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHdpbmRvdy5nb19pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mICh3aW5kb3cuZ2FwaSkgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5nYXBpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICB3aW5kb3cuZ2FwaS5sb2FkKCdhdXRoMicsICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGF1dGgyID0gd2luZG93LmdhcGkuYXV0aDIuaW5pdCh7XHJcbiAgICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNvbmZpZy5nb0NsaWVudElkLFxyXG4gICAgICAgICAgICAgIGNvb2tpZXBvbGljeTogJ3NpbmdsZV9ob3N0X29yaWdpbidcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGdvb2dsZUJ1dHRvbi5nZXQoMCk7XHJcbiAgICAgICAgICAgIGF1dGgyLmF0dGFjaENsaWNrSGFuZGxlcihlbGVtZW50LCB7fSxcclxuICAgICAgICAgICAgICAoZ29vZ2xlVXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cnlSZWdpc3Rlckdvb2dsZShnb29nbGVVc2VyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3IgIT09ICdwb3B1cF9jbG9zZWRfYnlfdXNlcicpIHtcclxuICAgICAgICAgICAgICAgICAgYWxlcnQocmVzdWx0LmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBjbGVhckludGVydmFsKHdpbmRvdy5nb19pbnRlcnZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAxMDApO1xyXG5cclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJyNnbGItcmVnaXN0ZXItc3RhcnQgZm9ybSNyZWdpc3Rlci1kZXRhaWwtZm9ybScpLnZhbGlkYXRlKHtcclxuICAgICAgcnVsZXM6IHtcclxuICAgICAgICByZWdpc3Rlcl9fZW1haWw6ICdlbWFpbCcsXHJcbiAgICAgICAgcmVnaXN0ZXJfX3Bhc3N3b3JkMTogJ3Bhc3N3b3JkJ1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcclxuICAgICAgICAgICQoZWxlbWVudCkuYXBwZW5kKGVycm9yKTtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XHJcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybSkgPT4ge1xyXG4gICAgICAgIHRoaXMudHJ5UmVnaXN0ZXIoZm9ybSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnI2dsYi1yZWdpc3Rlci1jYXRlZ29yaWVzIGZvcm0gLmZvcm1zX19jdGEtLXJlZCcpLm9uKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMudHJ5Q2F0ZWdvcnlTZWxlY3Rpb24oZXZ0KTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0cnlSZWdpc3RlckZhY2Vib29rKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgd2luZG93LkZCLmxvZ2luKChsb2dpblJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGlmIChsb2dpblJlc3BvbnNlLmF1dGhSZXNwb25zZSkge1xyXG4gICAgICAgIHdpbmRvdy5GQi5hcGkoJy9tZScsIChkYXRhUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICBmaXJzdG5hbWU6IGRhdGFSZXNwb25zZS5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICBsYXN0bmFtZTogZGF0YVJlc3BvbnNlLmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgdXNlcm5hbWU6IGRhdGFSZXNwb25zZS5lbWFpbCxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IGRhdGFSZXNwb25zZS5pZCxcclxuICAgICAgICAgICAgaXNsaW5rZWRpbjogJ3RydWUnLFxyXG4gICAgICAgICAgICB0Y2FncmVlOiB0cnVlXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHRoaXMuZXhlY3V0ZVJlZ2lzdGVyKGRhdGEsICgpID0+IHtcclxuICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLnRleHQoJ0ZhY2Vib29rJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LCB7IGZpZWxkczogWyAnaWQnLCAnZW1haWwnLCAnZmlyc3RfbmFtZScsICdsYXN0X25hbWUnIF19KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LCB7IHNjb3BlOiAnZW1haWwscHVibGljX3Byb2ZpbGUnLCByZXR1cm5fc2NvcGVzOiB0cnVlIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJ5UmVnaXN0ZXJMaW5rZWRpbihldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG5cclxuICAgIElOLlVzZXIuYXV0aG9yaXplKCgpID0+IHtcclxuICAgICAgSU4uQVBJLlByb2ZpbGUoJ21lJykuZmllbGRzKCdpZCcsICdmaXJzdC1uYW1lJywgJ2xhc3QtbmFtZScsICdlbWFpbC1hZGRyZXNzJykucmVzdWx0KChyZXN1bHQpID0+IHtcclxuICAgICAgICB2YXIgbWVtYmVyID0gcmVzdWx0LnZhbHVlc1swXTtcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICBmaXJzdG5hbWU6IG1lbWJlci5maXJzdE5hbWUsXHJcbiAgICAgICAgICBsYXN0bmFtZTogbWVtYmVyLmxhc3ROYW1lLFxyXG4gICAgICAgICAgdXNlcm5hbWU6IG1lbWJlci5lbWFpbEFkZHJlc3MsXHJcbiAgICAgICAgICBwYXNzd29yZDogbWVtYmVyLmlkLFxyXG4gICAgICAgICAgaXNsaW5rZWRpbjogJ3RydWUnLFxyXG4gICAgICAgICAgdGNhZ3JlZTogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZXhlY3V0ZVJlZ2lzdGVyKGRhdGEsICgpID0+IHtcclxuICAgICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS50ZXh0KCdMaW5rZWRJbicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHdpbmRvdy5JTi5Vc2VyLmlzQXV0aG9yaXplZCgpO1xyXG4gICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgSU4uQVBJLlByb2ZpbGUoJ21lJykuZmllbGRzKCdpZCcsICdmaXJzdC1uYW1lJywgJ2xhc3QtbmFtZScsICdlbWFpbC1hZGRyZXNzJykucmVzdWx0KChyZXN1bHQpID0+IHtcclxuICAgICAgICAgIHZhciBtZW1iZXIgPSByZXN1bHQudmFsdWVzWzBdO1xyXG5cclxuICAgICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICBmaXJzdG5hbWU6IG1lbWJlci5maXJzdE5hbWUsXHJcbiAgICAgICAgICAgIGxhc3RuYW1lOiBtZW1iZXIubGFzdE5hbWUsXHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiBtZW1iZXIuZW1haWxBZGRyZXNzLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogbWVtYmVyLmlkLFxyXG4gICAgICAgICAgICBpc2xpbmtlZGluOiAndHJ1ZScsXHJcbiAgICAgICAgICAgIHRjYWdyZWU6IHRydWVcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdGhpcy5leGVjdXRlUmVnaXN0ZXIoZGF0YSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikudGV4dCgnTGlua2VkSW4nKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHRyeVJlZ2lzdGVyR29vZ2xlKGdvb2dsZVVzZXIpIHtcclxuICAgIHZhciBiYXNpY1Byb2ZpbGUgPSBnb29nbGVVc2VyLmdldEJhc2ljUHJvZmlsZSgpO1xyXG5cclxuICAgIHZhciBkYXRhID0ge1xyXG4gICAgICBmaXJzdG5hbWU6IGJhc2ljUHJvZmlsZS5nZXRHaXZlbk5hbWUoKSxcclxuICAgICAgbGFzdG5hbWU6IGJhc2ljUHJvZmlsZS5nZXRGYW1pbHlOYW1lKCksXHJcbiAgICAgIHVzZXJuYW1lOiBiYXNpY1Byb2ZpbGUuZ2V0RW1haWwoKSxcclxuICAgICAgcGFzc3dvcmQ6IGJhc2ljUHJvZmlsZS5nZXRJZCgpLFxyXG4gICAgICBpc2xpbmtlZGluOiAndHJ1ZScsXHJcbiAgICAgIHRjYWdyZWU6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cykudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgIHRoaXMuZXhlY3V0ZVJlZ2lzdGVyKGRhdGEsICgpID0+IHtcclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cykudGV4dCgnR29vZ2xlKycpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0cnlSZWdpc3Rlcihmb3JtKSB7XHJcbiAgICB2YXIgZnJtID0gJChmb3JtKTtcclxuICAgIHZhciBkYXRhID0ge1xyXG4gICAgICBmaXJzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fZmlyc3RuYW1lJykudmFsKCksXHJcbiAgICAgIGxhc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2xhc3RuYW1lJykudmFsKCksXHJcbiAgICAgIHVzZXJuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2VtYWlsJykudmFsKCksXHJcbiAgICAgIHBhc3N3b3JkOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3Bhc3N3b3JkMScpLnZhbCgpLFxyXG5cclxuICAgICAgaXNsaW5rZWRpbjogJ2ZhbHNlJyxcclxuICAgICAgdGNhZ3JlZTogZnJtLmZpbmQoJ2lucHV0I2NoZWNrYm94SWQnKS5pcygnOmNoZWNrZWQnKVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoKCQudHJpbShkYXRhLmZpcnN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEubGFzdG5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShkYXRhLnVzZXJuYW1lKS5sZW5ndGggPT09IDApKSB7XHJcbiAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgeW91ciBuYW1lIGFuZCBlbWFpbCBhZGRyZXNzLicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcclxuXHJcbiAgICAgIHRoaXMuZXhlY3V0ZVJlZ2lzdGVyKGRhdGEsICgpID0+IHtcclxuICAgICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdTdWJtaXQnKTtcclxuICAgICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdTdWJtaXQnKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZXhlY3V0ZVJlZ2lzdGVyKGRhdGEsIHVud2FpdENhbGxiYWNrKSB7XHJcbiAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuXHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFJlZ2lzdGVyLFxyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHZhciBmcm0gPSAkKCcucGFnZS1ib2R5LnJlZ2lzdGVyLCAjZG93bmxvYWQsIC5nYXRlZCcpLmZpbmQoJ2Zvcm0nKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgcmVzcG9uc2UsIHRydWUgXSk7XHJcblxyXG4gICAgICAgICAgICAgIHdpbmRvdy5kYXRhTGF5ZXIgPSB3aW5kb3cuZGF0YUxheWVyIHx8IFtdO1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5kYXRhTGF5ZXIucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAnZXZlbnQnOiAncmVnaXN0cmF0aW9uQ29tcGxldGUnXHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgIGlmICgoZnJtLmNsb3Nlc3QoJyNkb3dubG9hZCcpLmxlbmd0aCA+IDApIHx8IChmcm0uY2xvc2VzdCgnLmdhdGVkJykubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgdmFyIG1vZGFsID0gJCgnLnJlZ2lzdGVyLmJlbG93LXJlZ2lzdGVyLWZvcm0nKS5maW5kKCcubW9kYWwnKTtcclxuICAgICAgICAgICAgICB2YXIgY2F0ZWdvcnlTZWxlY3Rpb24gPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnI2dsYi1yZWdpc3Rlci1jYXRlZ29yaWVzJyk7XHJcbiAgICAgICAgICAgICAgaWYgKG1vZGFsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG1vZGFsLmZpbmQoJy50aGFua3MtbmFtZScpLnRleHQoZGF0YS5maXJzdG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgbW9kYWwuZmluZCgnYnV0dG9uJykub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgYmFja1VybCA9IGZybS5kYXRhKCdiYWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgIGlmICgkLnRyaW0oYmFja1VybCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gYmFja1VybDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNhdGVnb3J5U2VsZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcjZ2xiLXJlZ2lzdGVyLXN0YXJ0JykuaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5U2VsZWN0aW9uLmZpbmQoJy5mb3Jtc19fdGl0bGUnKS50ZXh0KCdUaGFua3MgJyArIHJlc3BvbnNlLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnlTZWxlY3Rpb24uc2hvdygpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS5lcnJvci5pbmNsdWRlcygnRW1haWwgYWRkcmVzcyBhbHJlYWR5IGV4aXN0cycpKSB7XHJcbiAgICAgICAgICAgICAgJCgnPGxhYmVsIGlkPVwicmVnaXN0ZXJfX2VtYWlsLWVycm9yXCIgY2xhc3M9XCJlcnJvclwiIGZvcj1cInJlZ2lzdGVyX19lbWFpbFwiPlRoaXMgZW1haWwgYWRkcmVzcyBhbHJlYWR5IGV4aXN0czwvbGFiZWw+JykuaW5zZXJ0QWZ0ZXIoZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX19lbWFpbCcpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byByZWdpc3Rlci5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHJlZ2lzdGVyLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdW53YWl0Q2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0cnlDYXRlZ29yeVNlbGVjdGlvbigpIHtcclxuICAgIHZhciBjYXRlZ29yaWVzID0gJyc7XHJcbiAgICB2YXIgY29udGFpbmVyID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJyNnbGItcmVnaXN0ZXItY2F0ZWdvcmllcyBmb3JtJyk7XHJcbiAgICBjb250YWluZXIuZmluZCgnaW5wdXQ6Y2hlY2tlZCcpLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgIGlmIChjYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjYXRlZ29yaWVzICs9ICcsJztcclxuICAgICAgfVxyXG4gICAgICBjYXRlZ29yaWVzICs9ICQoaXRlbSkudmFsKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoY2F0ZWdvcmllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHZhciBjb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcclxuICAgICAgaWYgKGNvb2tpZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBzcGxpdCA9IGNvb2tpZS5zcGxpdCgnfCcpO1xyXG4gICAgICAgIGlmIChzcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFVwZGF0ZUNhdGVnb3JpZXMsXHJcbiAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogc3BsaXRbMF0sIHRva2VuOiBzcGxpdFsxXSwgY2F0czogY2F0ZWdvcmllcyB9LFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICBzdWNjZXNzOiAodXBkYXRlQ2F0ZWdvcmllc1Jlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlQ2F0ZWdvcmllc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGVDYXRlZ29yaWVzUmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHVwZGF0ZUNhdGVnb3JpZXNSZXNwb25zZSwgdHJ1ZSBdKTtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGlzLmdldFBhdGhIb21lKCkgKyAnLmh0bWwnO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoMSkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICgyKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICgzKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgcmVmcmVzaENvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicpO1xyXG4gICAgICAgIGlmIChyZWZyZXNoQ29va2llICE9PSBudWxsKSB7XHJcbiAgICAgICAgICB2YXIgcmVmcmVzaFNwbGl0ID0gcmVmcmVzaENvb2tpZS5zcGxpdCgnfCcpO1xyXG4gICAgICAgICAgaWYgKHJlZnJlc2hTcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsUmVmcmVzaENoZWNrLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogcmVmcmVzaFNwbGl0WzBdLCByZWZyZXNoX3Rva2VuOiByZWZyZXNoU3BsaXRbMV0gfSxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiAocmVmcmVzaFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHJlZnJlc2hSZXNwb25zZSwgdHJ1ZSBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJ5Q2F0ZWdvcnlTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICg0KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDUpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDYpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgbG9nZ2VkSW4oKSB7XHJcbiAgICBpZiAoJCgnLnBhZ2UtYm9keS5yZWdpc3RlcicpLmxlbmd0aCA+IDApIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9jb250ZW50L2RobC95b3VyLWFjY291bnQuaHRtbCc7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgUmVnaXN0ZXJGb3JtKCk7XHJcbiIsImNsYXNzIFNlYXJjaEZvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5zZWFyY2gtZm9ybScsXG4gICAgICBjbGVhckJ1dHRvbjogJy5zZWFyY2gtZm9ybV9fY2xlYXItaWNvbicsXG4gICAgICBpbnB1dDogJy5zZWFyY2gtZm9ybV9fc2VhcmNoIGlucHV0W3R5cGU9c2VhcmNoXSdcbiAgICB9O1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jbGVhclNlYXJjaEZvcm0gPSB0aGlzLmNsZWFyU2VhcmNoRm9ybS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNsZWFyQnV0dG9uLCAoKSA9PiB7XG4gICAgICB0aGlzLmNsZWFyU2VhcmNoRm9ybSgpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xlYXJTZWFyY2hGb3JtKCkge1xuICAgICQodGhpcy5zZWwuaW5wdXQpLnZhbCgnJykuZm9jdXMoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgU2VhcmNoRm9ybSgpO1xuIiwiY2xhc3MgU2VydmljZVdvcmtlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmRlZmVycmVkUHJvbXB0ID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVnaXN0ZXIgPSB0aGlzLnJlZ2lzdGVyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmFkZFRvSG9tZVNjcmVlbiA9IHRoaXMuYWRkVG9Ib21lU2NyZWVuLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICByZWdpc3RlcigpIHtcclxuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcvc3cuanMnKS50aGVuKCgpID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ1NlcnZpY2VXb3JrZXIgc3VjY2VzZnVsbHkgcmVnaXN0ZXJlZCcpO1xyXG4gICAgfSkuY2F0Y2goKCkgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkOiAnLCBlcnIpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhZGRUb0hvbWVTY3JlZW4oKSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JlaW5zdGFsbHByb21wdCcsIChlKSA9PiB7XHJcbiAgICAgIC8vIFByZXZlbnQgQ2hyb21lIDY3IGFuZCBlYXJsaWVyIGZyb20gYXV0b21hdGljYWxseSBzaG93aW5nIHRoZSBwcm9tcHRcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAvLyBTdGFzaCB0aGUgZXZlbnQgc28gaXQgY2FuIGJlIHRyaWdnZXJlZCBsYXRlci5cclxuICAgICAgdGhpcy5kZWZlcnJlZFByb21wdCA9IGU7XHJcbiAgICAgIC8vIENoZWNrIGlmIGFscmVhZHkgZGlzbWlzc2VkXHJcbiAgICAgIGxldCBhMmhzQ29va2llID0gQ29va2llcy5nZXQoJ2EyaHMnKTtcclxuICAgICAgLy8gSWYgdGhlIGNvb2tpZSBpcyBzZXQgdG8gaWdub3JlLCBpZ25vcmUgdGhlIHByb21wdFxyXG4gICAgICBpZiAoYTJoc0Nvb2tpZSA9PT0gJ2lnbm9yZScpIHJldHVybjtcclxuICAgICAgLy8gU2hvdyB0aGUgYWRkIHRvIGhvbWUgc2NyZWVuIGJhbm5lclxyXG4gICAgICAkKCcuYWRkVG9Ib21lU2NyZWVuJykuYWRkQ2xhc3MoJ2FkZFRvSG9tZVNjcmVlbi0tb3BlbicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5hZGRUb0hvbWVTY3JlZW5fX2N0YScsIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gU2hvdyBBMkhTXHJcbiAgICAgIHRoaXMuZGVmZXJyZWRQcm9tcHQucHJvbXB0KCk7XHJcbiAgICAgIC8vIFdhaXQgZm9yIHRoZSB1c2VyIHRvIHJlc3BvbmQgdG8gdGhlIHByb21wdFxyXG4gICAgICB0aGlzLmRlZmVycmVkUHJvbXB0LnVzZXJDaG9pY2UudGhlbigoY2hvaWNlUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGNob2ljZVJlc3VsdC5vdXRjb21lID09PSAnYWNjZXB0ZWQnKSB7XHJcbiAgICAgICAgICAvLyBIaWRlIHRoZSBhZGQgdG8gaG9tZSBzY3JlZW4gYmFubmVyXHJcbiAgICAgICAgICAkKCcuYWRkVG9Ib21lU2NyZWVuJykucmVtb3ZlQ2xhc3MoJ2FkZFRvSG9tZVNjcmVlbi0tb3BlbicpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBDaGFuZ2UgY29udGVudFxyXG4gICAgICAgICAgJCgnLmFkZFRvSG9tZVNjcmVlbl9fdGl0bGUnKS50ZXh0KCdUaGF0XFwncyBhIHNoYW1lLCBtYXliZSBuZXh0IHRpbWUnKTtcclxuICAgICAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW5fX2N0YScpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgJCgnLmFkZFRvSG9tZVNjcmVlbl9fbGluaycpLnRleHQoJ0Nsb3NlJyk7XHJcbiAgICAgICAgICAvLyBTZXQgaWdub3JlIGNvb2tpZVxyXG4gICAgICAgICAgdGhpcy5jcmVhdGVBMmhzQ29va2llKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGVmZXJyZWRQcm9tcHQgPSBudWxsO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuYWRkVG9Ib21lU2NyZWVuX19saW5rJywgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAvLyBIaWRlIHRoZSBhZGQgdG8gaG9tZSBzY3JlZW4gYmFubmVyXHJcbiAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW4nKS5yZW1vdmVDbGFzcygnYWRkVG9Ib21lU2NyZWVuLS1vcGVuJyk7XHJcbiAgICAgIC8vIENsZWFyIHRoZSBwcm9tcHRcclxuICAgICAgdGhpcy5kZWZlcnJlZFByb21wdCA9IG51bGw7XHJcbiAgICAgIC8vIFNldCBpZ25vcmUgY29va2llXHJcbiAgICAgIHRoaXMuY3JlYXRlQTJoc0Nvb2tpZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVBMmhzQ29va2llKCkge1xyXG4gICAgLy8gU2V0IGlnbm9yZSBjb29raWVcclxuICAgIENvb2tpZXMuc2V0KCdhMmhzJywgJ2lnbm9yZScsIHtleHBpcmVzOiAxNH0pO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICghKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLnJlZ2lzdGVyKCk7XHJcbiAgICAvLyB0aGlzLmFkZFRvSG9tZVNjcmVlbigpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgU2VydmljZVdvcmtlcigpO1xyXG4iLCJjbGFzcyBTaGlwRm9ybSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgLy8gUVNQID0gcXVlcnlzdHJpbmcgcGFyYW1ldGVyXHJcbiAgICAgIGNvbXBvbmVudDogJy5zaGlwLW5vdycsXHJcbiAgICAgIGZpcnN0bmFtZUlucHV0OiAnI2ZpcnN0bmFtZScsIC8vIGpxdWVyeSBzZWxlY3RvciBmb3IgaW5wdXQgKGNhbiBiZSBlZyAnLmZpcnN0bmFtZSBpbnB1dCcpXHJcbiAgICAgIGZpcnN0bmFtZVFTUDogJz9maXJzdG5hbWUnLCAvLyBuZWVkID8gZm9sbG93ZWQgYnkgcGFyYW1ldGVyIG5hbWVcclxuICAgICAgbGFzdG5hbWVJbnB1dDogJyNsYXN0bmFtZScsXHJcbiAgICAgIGxhc3RuYW1lUVNQOiAnP2xhc3RuYW1lJyxcclxuICAgICAgZW1haWxJbnB1dDogJyNlbWFpbCcsXHJcbiAgICAgIGVtYWlsUVNQOiAnP2VtYWlsJyxcclxuICAgICAgdXNlckZpcnN0bmFtZUVsZW1lbnQ6ICcudXNlci1maXJzdG5hbWUnXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5wb3B1bGF0ZUZvcm0gPSB0aGlzLnBvcHVsYXRlRm9ybS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zaG93TG9nZ2VkSW5FbGVtZW50cyA9IHRoaXMuc2hvd0xvZ2dlZEluRWxlbWVudHMuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKCd1c2VybG9nZ2VkaW4uREhMJywgKGV2dCwgdG9rZW5EYXRhKSA9PiB7XHJcbiAgICAgIHRoaXMuc2hvd0xvZ2dlZEluRWxlbWVudHModG9rZW5EYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucG9wdWxhdGVGb3JtKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHBvcHVsYXRlRm9ybSgpIHtcclxuICAgIGxldCBlbWFpbCA9IHVybCh0aGlzLnNlbC5lbWFpbFFTUCk7XHJcbiAgICBsZXQgZmlyc3RuYW1lID0gdXJsKHRoaXMuc2VsLmZpcnN0bmFtZVFTUCk7XHJcbiAgICBsZXQgbGFzdG5hbWUgPSB1cmwodGhpcy5zZWwubGFzdG5hbWVRU1ApO1xyXG5cclxuICAgIGlmICh0eXBlb2YgZW1haWwgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICQodGhpcy5zZWwuZW1haWxJbnB1dCkudmFsKGVtYWlsKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGZpcnN0bmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgJCh0aGlzLnNlbC5maXJzdG5hbWVJbnB1dCkudmFsKGZpcnN0bmFtZSk7XHJcblxyXG4gICAgICBpZiAoJC50cmltKGZpcnN0bmFtZSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICQodGhpcy5zZWwudXNlckZpcnN0bmFtZUVsZW1lbnQpLnRleHQoZmlyc3RuYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgbGFzdG5hbWUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICQodGhpcy5zZWwubGFzdG5hbWVJbnB1dCkudmFsKGxhc3RuYW1lKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNob3dMb2dnZWRJbkVsZW1lbnRzKHRva2VuRGF0YSkge1xyXG4gICAgbGV0IGZpcnN0bmFtZSA9IHVybCh0aGlzLnNlbC5maXJzdG5hbWVRU1ApO1xyXG5cclxuICAgIGlmICgodHlwZW9mIGZpcnN0bmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHx8ICgkLnRyaW0oZmlyc3RuYW1lKS5sZW5ndGggPT09IDApKSB7XHJcbiAgICAgICQodGhpcy5zZWwudXNlckZpcnN0bmFtZUVsZW1lbnQpLnRleHQodG9rZW5EYXRhLm5hbWUpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IFNoaXBGb3JtKCk7XHJcbiIsImNsYXNzIFNoaXBOb3dGb3JtIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBmb3JtOiAnZm9ybS5mb3Jtcy5zaGlwLW5vdycsXHJcbiAgICAgIGNvdW50cnlzZWxlY3Q6ICdmb3JtLmZvcm1zLnNoaXAtbm93ICNzaGlwbm93X2NvdW50cnknXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZ2V0UGF0aFByZWZpeCA9IHRoaXMuZ2V0UGF0aFByZWZpeC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMudG9nZ2xlQWRkcmVzcyA9IHRoaXMudG9nZ2xlQWRkcmVzcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zdWJtaXRGb3JtID0gdGhpcy5zdWJtaXRGb3JtLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldEZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zaG93U3VjY2VzcyA9IHRoaXMuc2hvd1N1Y2Nlc3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd0Vycm9yID0gdGhpcy5zaG93RXJyb3IuYmluZCh0aGlzKTtcclxuICAgIHRoaXMudmFsaWRhdGUgPSB0aGlzLnZhbGlkYXRlLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoUHJlZml4KCkge1xyXG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjaGFuZ2UnLCB0aGlzLnNlbC5jb3VudHJ5c2VsZWN0LCB0aGlzLnRvZ2dsZUFkZHJlc3MpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ3N1Ym1pdCcsIHRoaXMuc2VsLmZvcm0sIHRoaXMuc3VibWl0Rm9ybSk7XHJcblxyXG4gICAgdmFyIGNvdW50cnkgPSAkKHRoaXMuc2VsLmZvcm0pLmRhdGEoJ3ByZXNlbGVjdGNvdW50cnknKTtcclxuICAgIGlmICgoY291bnRyeSAhPT0gbnVsbCkgJiYgJC50cmltKGNvdW50cnkpLmxlbmd0aCA+IDApIHtcclxuICAgICAgJCh0aGlzLnNlbC5jb3VudHJ5c2VsZWN0KS52YWwoY291bnRyeSkudHJpZ2dlcignY2hhbmdlJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZSgpIHtcclxuICAgICQodGhpcy5zZWwuZm9ybSkuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgJChpdGVtKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaXMoJ3NlbGVjdCcpKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLmZpbmQoJy5zZWxlY3Rib3hpdC1idG4nKS5hZGRDbGFzcygnZXJyb3InKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3VjY2VzczogKGxhYmVsKSA9PiB7XHJcbiAgICAgICAgICBsZXQgJHBhcmVudCA9ICQobGFiZWwpLnBhcmVudHMoJ2Zvcm0uc2hpcC1ub3cnKTtcclxuICAgICAgICAgIGlmICgkcGFyZW50LmZpbmQoJ3NlbGVjdCcpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJHBhcmVudC5maW5kKCcuc2VsZWN0Ym94aXQtYnRuJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlQWRkcmVzcyhlKSB7XHJcbiAgICB2YXIgdmFsID0gJCh0aGlzLnNlbC5jb3VudHJ5c2VsZWN0KS52YWwoKTtcclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9ICQoJ29wdGlvbicsIHRoaXMuc2VsLmNvdW50cnlzZWxlY3QpO1xyXG4gICAgdmFyIG1hbmRhdG9yeSA9IHRydWU7XHJcbiAgICBvcHRpb25zLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgIGlmICgkKGl0ZW0pLmF0dHIoJ3ZhbHVlJykgPT09IHZhbCAmJiAoJycgKyAkKGl0ZW0pLmRhdGEoJ25vbm1hbmRhdG9yeScpKSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgICAgbWFuZGF0b3J5ID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChtYW5kYXRvcnkpIHtcclxuICAgICAgJCgnI3NoaXBub3dfYWRkcmVzcycsIHRoaXMuc2VsLmZvcm0pLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQWRkcmVzcyonKTtcclxuICAgICAgJCgnI3NoaXBub3dfemlwJywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdaSVAgb3IgUG9zdGNvZGUqJyk7XHJcbiAgICAgICQoJyNzaGlwbm93X2NpdHknLCB0aGlzLnNlbC5mb3JtKS5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0NpdHkqJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcjc2hpcG5vd19hZGRyZXNzJywgdGhpcy5zZWwuZm9ybSkucmVtb3ZlQXR0cigncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdBZGRyZXNzJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuY2xvc2VzdCgnZGl2JykuZmluZCgnbGFiZWwnKS5yZW1vdmUoKTtcclxuICAgICAgJCgnI3NoaXBub3dfemlwJywgdGhpcy5zZWwuZm9ybSkucmVtb3ZlQXR0cigncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdaSVAgb3IgUG9zdGNvZGUnKS5yZW1vdmVDbGFzcygnZXJyb3InKS5jbG9zZXN0KCdkaXYnKS5maW5kKCdsYWJlbCcpLnJlbW92ZSgpO1xyXG4gICAgICAkKCcjc2hpcG5vd19jaXR5JywgdGhpcy5zZWwuZm9ybSkucmVtb3ZlQXR0cigncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdDaXR5JykucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuY2xvc2VzdCgnZGl2JykuZmluZCgnbGFiZWwnKS5yZW1vdmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN1Ym1pdEZvcm0oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0ICRmb3JtID0gJChlLnRhcmdldCk7XHJcbiAgICBsZXQgZm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhKCRmb3JtKTtcclxuICAgICQucG9zdCh0aGlzLmdldFBhdGhQcmVmaXgoKSArICRmb3JtLmF0dHIoJ2FjdGlvbicpLCBmb3JtRGF0YSwgKGRhdGEpID0+IHtcclxuICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnT0snKSB7XHJcbiAgICAgICAgdGhpcy5zaG93U3VjY2VzcygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2hvd0Vycm9yKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Rm9ybURhdGEoJGZvcm0pIHtcclxuICAgIGxldCB1bmluZGV4ZWRBcnJheSA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICBsZXQgaW5kZXhlZEFycmF5ID0ge307XHJcbiAgICAkLm1hcCh1bmluZGV4ZWRBcnJheSwgKG4pID0+IChpbmRleGVkQXJyYXlbbi5uYW1lXSA9IG4udmFsdWUpKTtcclxuXHJcbiAgICBpbmRleGVkQXJyYXkuc291cmNlID0gJC50cmltKCRmb3JtLmRhdGEoJ3NvdXJjZScpKTtcclxuICAgIGluZGV4ZWRBcnJheS5sbyA9ICQudHJpbSgkZm9ybS5kYXRhKCdsbycpKTtcclxuXHJcbiAgICByZXR1cm4gaW5kZXhlZEFycmF5O1xyXG4gIH1cclxuXHJcbiAgc2hvd1N1Y2Nlc3MoKSB7XHJcbiAgICB3aW5kb3cubG9jYXRpb24gPSAkKHRoaXMuc2VsLmZvcm0pLmRhdGEoJ3RoYW5rcycpO1xyXG4gIH1cclxuXHJcbiAgc2hvd0Vycm9yKCkge1xyXG4gICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmZvcm0pLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHRoaXMudmFsaWRhdGUoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IFNoaXBOb3dGb3JtKCk7XHJcbiIsImNsYXNzIFNoaXBOb3dUd29TdGVwRm9ybSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmZpcnN0bmFtZSA9ICcnO1xyXG4gICAgdGhpcy5sYXN0bmFtZSA9ICcnO1xyXG4gICAgdGhpcy5lbWFpbCA9ICcnO1xyXG5cclxuICAgIHRoaXMuY29uZmlnID0ge1xyXG4gICAgICAvLyBmYkFwcElkOiAnMTAwMDc3MzE2MzMzNzc5OCcsXHJcbiAgICAgIGZiQXBwSWQ6ICcxMDgwMDMxMzI4ODAxMjExJyxcclxuICAgICAgLy8gZ29DbGllbnRJZDogJzkxMzk2MDM1MjIzNi11N3VuMGwyMnR2a21sYnBhNWJjbmYxdXFnNGNzaTdlMy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbScsXHJcbiAgICAgIGdvQ2xpZW50SWQ6ICczMTM0Njk4Mzc0MjAtbDg4MmgzOWdlOG44bjlwYjk3bGR2amszZm04cHBxZ3MuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuc2hpcE5vd011bHRpLnd5c2l3eWcsIC5hbmltYXRlZEZvcm0nLFxyXG4gICAgICBzd2luZ2J1dHRvbjogJy5zaGlwTm93TXVsdGlfX2hlYWRjdGEtLXJlZCcsXHJcbiAgICAgIGZvcm1zOiAnZm9ybS5mb3Jtcy5zaGlwLW5vdy10d29zdGVwJyxcclxuICAgICAgZm9ybTE6ICdmb3JtLmZvcm1zLmZvcm0xLnNoaXAtbm93LXR3b3N0ZXAnLFxyXG4gICAgICBmb3JtMjogJ2Zvcm0uZm9ybXMuZm9ybTIuc2hpcC1ub3ctdHdvc3RlcCcsXHJcbiAgICAgIGNvdW50cnlzZWxlY3Q6ICdmb3JtLmZvcm1zLmZvcm0yLnNoaXAtbm93LXR3b3N0ZXAgI3NoaXBub3dfY291bnRyeScsXHJcblxyXG4gICAgICBidXR0b25GYWNlYm9vazogJy5mb3Jtc19fY3RhLS1zb2NpYWwuZmFjZWJvb2snLFxyXG4gICAgICBidXR0b25MaW5rZWRpbjogJy5mb3Jtc19fY3RhLS1zb2NpYWwubGlua2VkaW4nLFxyXG4gICAgICBidXR0b25Hb29nbGVQbHVzOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5nb29nbGUnXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZ2V0UGF0aFByZWZpeCA9IHRoaXMuZ2V0UGF0aFByZWZpeC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnRvZ2dsZUFkZHJlc3MgPSB0aGlzLnRvZ2dsZUFkZHJlc3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc3VibWl0RmFjZWJvb2sgPSB0aGlzLnN1Ym1pdEZhY2Vib29rLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnN1Ym1pdExpbmtlZGluID0gdGhpcy5zdWJtaXRMaW5rZWRpbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zdWJtaXRHb29nbGUgPSB0aGlzLnN1Ym1pdEdvb2dsZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zdWJtaXRGb3JtMSA9IHRoaXMuc3VibWl0Rm9ybTEuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubmV4dEZvcm0gPSB0aGlzLm5leHRGb3JtLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnN1Ym1pdEZvcm0yID0gdGhpcy5zdWJtaXRGb3JtMi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRGb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd1N1Y2Nlc3MgPSB0aGlzLnNob3dTdWNjZXNzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UGF0aFByZWZpeCgpIHtcclxuICAgIGNvbnN0IHByZWZpeCA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLXByZWZpeFxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XHJcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignc3VibWl0JywgdGhpcy5zZWwuZm9ybTEsIHRoaXMuc3VibWl0Rm9ybTEpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ3N1Ym1pdCcsIHRoaXMuc2VsLmZvcm0yLCB0aGlzLnN1Ym1pdEZvcm0yKTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjaGFuZ2UnLCB0aGlzLnNlbC5jb3VudHJ5c2VsZWN0LCB0aGlzLnRvZ2dsZUFkZHJlc3MpO1xyXG5cclxuICAgIHZhciBjb3VudHJ5ID0gJCh0aGlzLnNlbC5mb3JtMikuZGF0YSgncHJlc2VsZWN0Y291bnRyeScpO1xyXG4gICAgaWYgKChjb3VudHJ5ICE9PSBudWxsKSAmJiAkLnRyaW0oY291bnRyeSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAkKHRoaXMuc2VsLmNvdW50cnlzZWxlY3QpLnZhbChjb3VudHJ5KS50cmlnZ2VyKCdjaGFuZ2UnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLmxlbmd0aCA+IDApIHtcclxuICAgICAgd2luZG93LmZiQXN5bmNJbml0ID0gKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5mYl9pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5GQikgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5GQiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB3aW5kb3cuRkIuaW5pdCh7XHJcbiAgICAgICAgICAgICAgYXBwSWQ6IHRoaXMuY29uZmlnLmZiQXBwSWQsXHJcbiAgICAgICAgICAgICAgY29va2llOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHhmYm1sOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZlcnNpb246ICd2Mi44J1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmZiX2ludGVydmFsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYWNlYm9vay1qc3NkaycpID09PSBudWxsKSB7XHJcbiAgICAgICAgdmFyIGZqcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcclxuICAgICAgICB2YXIganMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICBqcy5pZCA9ICdmYWNlYm9vay1qc3Nkayc7XHJcbiAgICAgICAganMuc3JjID0gJy8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fRU4vc2RrLmpzJztcclxuICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XHJcbiAgICAgIH1cclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLm9uKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICB0aGlzLnN1Ym1pdEZhY2Vib29rKGV2dCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLmxlbmd0aCA+IDApIHtcclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLm9uKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICB0aGlzLnN1Ym1pdExpbmtlZGluKGV2dCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZ29vZ2xlQnV0dG9uID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cyk7XHJcbiAgICBpZiAoZ29vZ2xlQnV0dG9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgd2luZG93LmdvX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5nYXBpKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmdhcGkgIT09IG51bGwpIHtcclxuICAgICAgICAgIHdpbmRvdy5nYXBpLmxvYWQoJ2F1dGgyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgYXV0aDIgPSB3aW5kb3cuZ2FwaS5hdXRoMi5pbml0KHtcclxuICAgICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY29uZmlnLmdvQ2xpZW50SWQsXHJcbiAgICAgICAgICAgICAgY29va2llcG9saWN5OiAnc2luZ2xlX2hvc3Rfb3JpZ2luJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZ29vZ2xlQnV0dG9uLmdldCgwKTtcclxuICAgICAgICAgICAgYXV0aDIuYXR0YWNoQ2xpY2tIYW5kbGVyKGVsZW1lbnQsIHt9LFxyXG4gICAgICAgICAgICAgIChnb29nbGVVc2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1Ym1pdEdvb2dsZShnb29nbGVVc2VyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3IgIT09ICdwb3B1cF9jbG9zZWRfYnlfdXNlcicpIHtcclxuICAgICAgICAgICAgICAgICAgYWxlcnQocmVzdWx0LmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBjbGVhckludGVydmFsKHdpbmRvdy5nb19pbnRlcnZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAxMDApO1xyXG5cclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuc3dpbmdidXR0b24sIChldnQpID0+IHtcclxuICAgICAgdmFyIGlkID0gJChldnQuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpO1xyXG4gICAgICB2YXIgb2Zmc2V0ID0gJChpZCkub2Zmc2V0KCkudG9wO1xyXG4gICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XHJcbiAgICAgICAgc2Nyb2xsVG9wOiBvZmZzZXRcclxuICAgICAgfSwgMTAwMCwgJ3N3aW5nJyk7XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHZhbGlkYXRlKCkge1xyXG4gICAgJCh0aGlzLnNlbC5mb3JtcykuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgJChpdGVtKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaXMoJ3NlbGVjdCcpKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLmZpbmQoJy5zZWxlY3Rib3hpdC1idG4nKS5hZGRDbGFzcygnZXJyb3InKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3VjY2VzczogKGxhYmVsKSA9PiB7XHJcbiAgICAgICAgICBsZXQgJHBhcmVudCA9ICQobGFiZWwpLnBhcmVudHMoJ2Zvcm0uc2hpcC1ub3cnKTtcclxuICAgICAgICAgIGlmICgkcGFyZW50LmZpbmQoJ3NlbGVjdCcpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJHBhcmVudC5maW5kKCcuc2VsZWN0Ym94aXQtYnRuJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlQWRkcmVzcyhlKSB7XHJcbiAgICB2YXIgdmFsID0gJCh0aGlzLnNlbC5jb3VudHJ5c2VsZWN0KS52YWwoKTtcclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9ICQoJ29wdGlvbicsIHRoaXMuc2VsLmNvdW50cnlzZWxlY3QpO1xyXG4gICAgdmFyIG1hbmRhdG9yeSA9IHRydWU7XHJcbiAgICBvcHRpb25zLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgIGlmICgkKGl0ZW0pLmF0dHIoJ3ZhbHVlJykgPT09IHZhbCAmJiAoJycgKyAkKGl0ZW0pLmRhdGEoJ25vbm1hbmRhdG9yeScpKSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgICAgbWFuZGF0b3J5ID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChtYW5kYXRvcnkpIHtcclxuICAgICAgJCgnI3NoaXBub3dfYWRkcmVzcycsIHRoaXMuc2VsLmZvcm0pLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQWRkcmVzcyonKTtcclxuICAgICAgJCgnI3NoaXBub3dfemlwJywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdaSVAgb3IgUG9zdGNvZGUqJyk7XHJcbiAgICAgICQoJyNzaGlwbm93X2NpdHknLCB0aGlzLnNlbC5mb3JtKS5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0NpdHkqJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcjc2hpcG5vd19hZGRyZXNzJywgdGhpcy5zZWwuZm9ybSkucmVtb3ZlQXR0cigncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdBZGRyZXNzJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuY2xvc2VzdCgnZGl2JykuZmluZCgnbGFiZWwnKS5yZW1vdmUoKTtcclxuICAgICAgJCgnI3NoaXBub3dfemlwJywgdGhpcy5zZWwuZm9ybSkucmVtb3ZlQXR0cigncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdaSVAgb3IgUG9zdGNvZGUnKS5yZW1vdmVDbGFzcygnZXJyb3InKS5jbG9zZXN0KCdkaXYnKS5maW5kKCdsYWJlbCcpLnJlbW92ZSgpO1xyXG4gICAgICAkKCcjc2hpcG5vd19jaXR5JywgdGhpcy5zZWwuZm9ybSkucmVtb3ZlQXR0cigncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdDaXR5JykucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuY2xvc2VzdCgnZGl2JykuZmluZCgnbGFiZWwnKS5yZW1vdmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN1Ym1pdEZhY2Vib29rKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgd2luZG93LkZCLmxvZ2luKChsb2dpblJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGlmIChsb2dpblJlc3BvbnNlLmF1dGhSZXNwb25zZSkge1xyXG4gICAgICAgIHdpbmRvdy5GQi5hcGkoJy9tZScsIChkYXRhUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIHRoaXMuZmlyc3RuYW1lID0gZGF0YVJlc3BvbnNlLmZpcnN0X25hbWU7XHJcbiAgICAgICAgICB0aGlzLmxhc3RuYW1lID0gZGF0YVJlc3BvbnNlLmxhc3RfbmFtZTtcclxuICAgICAgICAgIHRoaXMuZW1haWwgPSBkYXRhUmVzcG9uc2UuZW1haWw7XHJcblxyXG4gICAgICAgICAgdGhpcy5uZXh0Rm9ybSgpO1xyXG4gICAgICAgIH0sIHsgZmllbGRzOiBbICdpZCcsICdlbWFpbCcsICdmaXJzdF9uYW1lJywgJ2xhc3RfbmFtZScgXX0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sIHsgc2NvcGU6ICdlbWFpbCxwdWJsaWNfcHJvZmlsZScsIHJldHVybl9zY29wZXM6IHRydWUgfSk7XHJcbiAgfVxyXG5cclxuICBzdWJtaXRMaW5rZWRpbihldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIElOLlVzZXIuYXV0aG9yaXplKCgpID0+IHtcclxuICAgICAgSU4uQVBJLlByb2ZpbGUoJ21lJykuZmllbGRzKCdpZCcsICdmaXJzdC1uYW1lJywgJ2xhc3QtbmFtZScsICdlbWFpbC1hZGRyZXNzJykucmVzdWx0KChyZXN1bHQpID0+IHtcclxuICAgICAgICB2YXIgbWVtYmVyID0gcmVzdWx0LnZhbHVlc1swXTtcclxuXHJcbiAgICAgICAgdGhpcy5maXJzdG5hbWUgPSBtZW1iZXIuZmlyc3ROYW1lO1xyXG4gICAgICAgIHRoaXMubGFzdG5hbWUgPSBtZW1iZXIubGFzdE5hbWU7XHJcbiAgICAgICAgdGhpcy5lbWFpbCA9IG1lbWJlci5lbWFpbEFkZHJlc3M7XHJcblxyXG4gICAgICAgIHRoaXMubmV4dEZvcm0oKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cuSU4uVXNlci5pc0F1dGhvcml6ZWQoKTtcclxuICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICB2YXIgbWVtYmVyID0gcmVzdWx0LnZhbHVlc1swXTtcclxuICBcclxuICAgICAgICAgIHRoaXMuZmlyc3RuYW1lID0gbWVtYmVyLmZpcnN0TmFtZTtcclxuICAgICAgICAgIHRoaXMubGFzdG5hbWUgPSBtZW1iZXIubGFzdE5hbWU7XHJcbiAgICAgICAgICB0aGlzLmVtYWlsID0gbWVtYmVyLmVtYWlsQWRkcmVzcztcclxuICBcclxuICAgICAgICAgIHRoaXMubmV4dEZvcm0oKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMCk7XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgc3VibWl0R29vZ2xlKGdvb2dsZVVzZXIpIHtcclxuICAgIHZhciBiYXNpY1Byb2ZpbGUgPSBnb29nbGVVc2VyLmdldEJhc2ljUHJvZmlsZSgpO1xyXG5cclxuICAgIHRoaXMuZmlyc3RuYW1lID0gYmFzaWNQcm9maWxlLmdldEdpdmVuTmFtZSgpO1xyXG4gICAgdGhpcy5sYXN0bmFtZSA9IGJhc2ljUHJvZmlsZS5nZXRGYW1pbHlOYW1lKCk7XHJcbiAgICB0aGlzLmVtYWlsID0gYmFzaWNQcm9maWxlLmdldEVtYWlsKCk7XHJcblxyXG4gICAgdGhpcy5uZXh0Rm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgc3VibWl0Rm9ybTEoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0ICRmb3JtID0gJChlLnRhcmdldCk7XHJcbiAgICBsZXQgZm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhKCRmb3JtKTtcclxuXHJcbiAgICB0aGlzLmZpcnN0bmFtZSA9IGZvcm1EYXRhLmZpcnN0bmFtZTtcclxuICAgIHRoaXMubGFzdG5hbWUgPSBmb3JtRGF0YS5sYXN0bmFtZTtcclxuICAgIHRoaXMuZW1haWwgPSBmb3JtRGF0YS5lbWFpbDtcclxuXHJcbiAgICB0aGlzLm5leHRGb3JtKCk7XHJcbiAgfVxyXG5cclxuICBuZXh0Rm9ybSgpIHtcclxuICAgICQoJy5zaGlwTm93TXVsdGlfX2Zvcm1zdGVwLS1zdGVwMScsIHRoaXMuc2VsLmNvbXBvbmVudCkuaGlkZSgpO1xyXG4gICAgJCgnLnNoaXBOb3dNdWx0aV9fZm9ybXN0ZXAtLXN0ZXAyJywgdGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIH1cclxuXHJcbiAgc3VibWl0Rm9ybTIoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgbGV0ICRmb3JtID0gJChlLnRhcmdldCk7XHJcbiAgICBsZXQgZm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhKCRmb3JtKTtcclxuICAgIGZvcm1EYXRhLmZpcnN0bmFtZSA9IHRoaXMuZmlyc3RuYW1lO1xyXG4gICAgZm9ybURhdGEubGFzdG5hbWUgPSB0aGlzLmxhc3RuYW1lO1xyXG4gICAgZm9ybURhdGEuZW1haWwgPSB0aGlzLmVtYWlsO1xyXG5cclxuICAgICQucG9zdCh0aGlzLmdldFBhdGhQcmVmaXgoKSArICRmb3JtLmF0dHIoJ2FjdGlvbicpLCBmb3JtRGF0YSwgKGRhdGEpID0+IHtcclxuICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnT0snKSB7XHJcbiAgICAgICAgdGhpcy5zaG93U3VjY2VzcygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZC4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRGb3JtRGF0YSgkZm9ybSkge1xyXG4gICAgbGV0IHVuaW5kZXhlZEFycmF5ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcclxuICAgIGxldCBpbmRleGVkQXJyYXkgPSB7fTtcclxuICAgICQubWFwKHVuaW5kZXhlZEFycmF5LCAobikgPT4gKGluZGV4ZWRBcnJheVtuLm5hbWVdID0gbi52YWx1ZSkpO1xyXG5cclxuICAgIGluZGV4ZWRBcnJheS5zb3VyY2UgPSAkLnRyaW0oJGZvcm0uZGF0YSgnc291cmNlJykpO1xyXG4gICAgaW5kZXhlZEFycmF5LmxvID0gJC50cmltKCRmb3JtLmRhdGEoJ2xvJykpO1xyXG5cclxuICAgIHJldHVybiBpbmRleGVkQXJyYXk7XHJcbiAgfVxyXG5cclxuICBzaG93U3VjY2VzcygpIHtcclxuICAgIHZhciB0aGFua3MgPSAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDInLCB0aGlzLnNlbC5jb21wb25lbnQpLmRhdGEoXCJ0aGFua3NcIik7XHJcbiAgICBpZiAoKHRoYW5rcyAhPT0gbnVsbCkgJiYgKHRoYW5rcy5sZW5ndGggPiAwKSkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGFua3M7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDInLCB0aGlzLnNlbC5jb21wb25lbnQpLmhpZGUoKTtcclxuICAgICAgJCgnLnNoaXBOb3dNdWx0aV9fZm9ybXN0ZXAtLXRoYW5rcycsIHRoaXMuc2VsLmNvbXBvbmVudCkuc2hvdygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgdGhpcy52YWxpZGF0ZSgpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgU2hpcE5vd1R3b1N0ZXBGb3JtKCk7XHJcbiIsImNsYXNzIFNob3dIaWRlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICdbZGF0YS1zaG93LWhpZGUtaWRdJyxcbiAgICAgIHRvZ2dsZTogJ1tkYXRhLXNob3ctaGlkZS10YXJnZXRdJ1xuICAgIH07XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC50b2dnbGUsIChlKSA9PiB7XG4gICAgICBjb25zdCBzaG93SGlkZVRhcmdldCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtc2hvdy1oaWRlLXRhcmdldCcpO1xuICAgICAgJCgnW2RhdGEtc2hvdy1oaWRlLWlkPScgKyBzaG93SGlkZVRhcmdldCArICddJykuc2xpZGVUb2dnbGUoKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgU2hvd0hpZGUoKTtcbiIsImNsYXNzIFNvY2lhbCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLnNvY2lhbCdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNvbnRhaW5lclRvcCA9IHRoaXMuY29udGFpbmVyVG9wLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmhhbmRsZVNjcm9sbCA9IHRoaXMuaGFuZGxlU2Nyb2xsLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoZWNrU2hhcmVQb3MgPSB0aGlzLmNoZWNrU2hhcmVQb3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZGVib3VuY2UgPSB0aGlzLmRlYm91bmNlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVTY3JvbGwpO1xyXG4gIH1cclxuXHJcbiAgY29udGFpbmVyVG9wKCkge1xyXG4gICAgcmV0dXJuICQodGhpcy5zZWwuY29tcG9uZW50KS5wYXJlbnQoKS5wb3NpdGlvbigpLnRvcDtcclxuICB9XHJcblxyXG4gIGhhbmRsZVNjcm9sbCgpIHtcclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSA5OTIpIHtcclxuICAgICAgbGV0IGhlaWdodCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuICAgICAgbGV0IGJvdHRvbSA9IHRoaXMuY29udGFpbmVyVG9wKCkgKyAkKHRoaXMuc2VsLmNvbXBvbmVudCkucGFyZW50KCkuaGVpZ2h0KCkgLSAkKHRoaXMuc2VsLmNvbXBvbmVudCkub3V0ZXJIZWlnaHQoKSAtIDYwO1xyXG4gICAgICBpZiAoaGVpZ2h0ID49IHRoaXMuY29udGFpbmVyVG9wKCkgJiYgaGVpZ2h0IDwgYm90dG9tICYmICEkKHRoaXMuc2VsLmNvbXBvbmVudCkuaGFzQ2xhc3MoJ3NvY2lhbC0tYWZmaXgnKSkge1xyXG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KVxyXG4gICAgICAgICAgLmFkZENsYXNzKCdzb2NpYWwtLWFmZml4JylcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnbGVmdCc6IHRoaXMuZ2V0TGVmdE9mZnNldCgkKHRoaXMuc2VsLmNvbXBvbmVudCkpLFxyXG4gICAgICAgICAgICAndG9wJzogJydcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2UgaWYgKGhlaWdodCA8IHRoaXMuY29udGFpbmVyVG9wKCkgJiYgJCh0aGlzLnNlbC5jb21wb25lbnQpLmhhc0NsYXNzKCdzb2NpYWwtLWFmZml4JykpIHtcclxuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudClcclxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnc29jaWFsLS1hZmZpeCcpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2xlZnQnOiAnJyxcclxuICAgICAgICAgICAgJ3RvcCc6ICcnXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmIChoZWlnaHQgPj0gYm90dG9tICYmICQodGhpcy5zZWwuY29tcG9uZW50KS5oYXNDbGFzcygnc29jaWFsLS1hZmZpeCcpKSB7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpXHJcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NvY2lhbC0tYWZmaXgnKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdsZWZ0JzogJycsXHJcbiAgICAgICAgICAgICd0b3AnOiB0aGlzLmdldFRvcE9mZnNldCgpXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0TGVmdE9mZnNldCgkZWxtKSB7XHJcbiAgICBsZXQgcGFyZW50T2Zmc2V0ID0gcGFyc2VJbnQoJGVsbS5wYXJlbnQoKS5vZmZzZXQoKS5sZWZ0LCAxMCk7XHJcbiAgICBsZXQgbXlPZmZzZXQgPSBwYXJzZUludCgkZWxtLm9mZnNldCgpLmxlZnQsIDEwKTtcclxuICAgIHJldHVybiAocGFyZW50T2Zmc2V0ICsgbXlPZmZzZXQpO1xyXG4gIH1cclxuXHJcbiAgZ2V0VG9wT2Zmc2V0KCkge1xyXG4gICAgbGV0IHBhcmVudE9mZnNldCA9IHRoaXMuY29udGFpbmVyVG9wKCk7XHJcbiAgICBsZXQgc2Nyb2xsUG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG4gICAgbGV0IHRvcCA9IHNjcm9sbFBvcyAtIHBhcmVudE9mZnNldCArIDUwO1xyXG4gICAgcmV0dXJuIHRvcDtcclxuICB9XHJcblxyXG4gIGNoZWNrU2hhcmVQb3MoKSB7XHJcbiAgICBpZiAoJCgnLnNvY2lhbC0tdmVydGljYWwuc29jaWFsLS1hZmZpeCcpLmxlbmd0aCkge1xyXG4gICAgICAkKCcuc29jaWFsLS12ZXJ0aWNhbC5zb2NpYWwtLWFmZml4JykucmVtb3ZlQXR0cignc3R5bGUnKS5yZW1vdmVDbGFzcygnc29jaWFsLS1hZmZpeCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gRGVib3V0Y2UgZnVuY3Rpb25cclxuICBkZWJvdW5jZShmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcclxuICAgIHZhciB0aW1lb3V0O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xyXG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xyXG4gICAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICB9O1xyXG4gICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XHJcbiAgICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmRlYm91bmNlKHRoaXMuY2hlY2tTaGFyZVBvcywgMTAwKSk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBTb2NpYWwoKTtcclxuIiwiY2xhc3MgU3Vic2NyaWJlUGFuZWwge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5zdWJzY3JpYmVQYW5lbCcsXHJcbiAgICAgIGZvcm06ICcuc3Vic2NyaWJlUGFuZWxfX2Zvcm0nLFxyXG4gICAgICBzdWNjZXNzT3ZlcmxheTogJy5zdWJzY3JpYmVQYW5lbF9fcmVzcG9uc2VPdmVybGF5LnN1Y2Nlc3MnLFxyXG4gICAgICBlcnJvck92ZXJsYXk6ICcuc3Vic2NyaWJlUGFuZWxfX3Jlc3BvbnNlT3ZlcmxheS5lcnJvcidcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zdWJtaXRGb3JtID0gdGhpcy5zdWJtaXRGb3JtLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldEZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zaG93U3VjY2VzcyA9IHRoaXMuc2hvd1N1Y2Nlc3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd0Vycm9yID0gdGhpcy5zaG93RXJyb3IuYmluZCh0aGlzKTtcclxuICAgIHRoaXMudmFsaWRhdGUgPSB0aGlzLnZhbGlkYXRlLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoUHJlZml4KCkge1xyXG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdzdWJtaXQnLCB0aGlzLnNlbC5mb3JtLCB0aGlzLnN1Ym1pdEZvcm0pO1xyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGUoKSB7XHJcbiAgICAkKHRoaXMuc2VsLmZvcm0pLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICQoaXRlbSkudmFsaWRhdGUoe1xyXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmlzKCdzZWxlY3QnKSkge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50LnBhcmVudCgpKTtcclxuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5maW5kKCcuc2VsZWN0Ym94aXQtYnRuJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1Y2Nlc3M6IChsYWJlbCkgPT4ge1xyXG4gICAgICAgICAgbGV0ICRwYXJlbnQgPSAkKGxhYmVsKS5wYXJlbnRzKCcuc3Vic2NyaWJlX19mb3JtRmllbGQnKTtcclxuICAgICAgICAgIGlmICgkcGFyZW50LmZpbmQoJ3NlbGVjdCcpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJHBhcmVudC5maW5kKCcuc2VsZWN0Ym94aXQtYnRuJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3VibWl0Rm9ybShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgJGZvcm0gPSAkKGUudGFyZ2V0KTtcclxuICAgIGxldCBmb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEoJGZvcm0pO1xyXG4gICAgJC5wb3N0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgJGZvcm0uYXR0cignYWN0aW9uJyksIGZvcm1EYXRhLCAoZGF0YSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdPSycpIHtcclxuICAgICAgICB0aGlzLnNob3dTdWNjZXNzKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zaG93RXJyb3IoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRGb3JtRGF0YSgkZm9ybSkge1xyXG4gICAgbGV0IHVuaW5kZXhlZEFycmF5ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcclxuICAgIGxldCBpbmRleGVkQXJyYXkgPSB7fTtcclxuICAgICQubWFwKHVuaW5kZXhlZEFycmF5LCAobikgPT4gKGluZGV4ZWRBcnJheVtuLm5hbWVdID0gbi52YWx1ZSkpO1xyXG4gICAgcmV0dXJuIGluZGV4ZWRBcnJheTtcclxuICB9XHJcblxyXG4gIHNob3dTdWNjZXNzKCkge1xyXG4gICAgJCh0aGlzLnNlbC5zdWNjZXNzT3ZlcmxheSkuYWRkQ2xhc3MoJ3N1YnNjcmliZVBhbmVsX19yZXNwb25zZU92ZXJsYXktLXNob3cnKTtcclxuICB9XHJcblxyXG4gIHNob3dFcnJvcigpIHtcclxuICAgICQodGhpcy5zZWwuZXJyb3JPdmVybGF5KS5hZGRDbGFzcygnc3Vic2NyaWJlUGFuZWxfX3Jlc3BvbnNlT3ZlcmxheS0tc2hvdycpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgdGhpcy52YWxpZGF0ZSgpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgU3Vic2NyaWJlUGFuZWwoKTtcclxuIiwiY2xhc3MgVG9hc3Qge1xyXG4gIGNvbnN0cnVjdG9yKHRleHQsIGR1cmF0aW9uKSB7XHJcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgdGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG4gICAgdGhpcy5pZCA9ICdfJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCA5KTtcclxuXHJcbiAgICB0aGlzLnNldFRleHQgPSB0aGlzLnNldFRleHQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2V0RHVyYXRpb24gPSB0aGlzLnNldER1cmF0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3cgPSB0aGlzLnNob3cuYmluZCh0aGlzKTtcclxuXHJcbiAgICBsZXQgdG9hc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRvYXN0LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkKTtcclxuICAgIHRvYXN0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndG9hc3QnKTtcclxuICAgIGxldCBpbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgaW5uZXIuc2V0QXR0cmlidXRlKCdjbGFzcycsICdpbm5lcicpO1xyXG4gICAgaW5uZXIuaW5uZXJUZXh0ID0gdGhpcy50ZXh0O1xyXG4gICAgdG9hc3QuYXBwZW5kQ2hpbGQoaW5uZXIpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b2FzdCk7XHJcbiAgICB0aGlzLiR0b2FzdCA9ICQoJyMnICsgdGhpcy5pZCk7XHJcbiAgfVxyXG5cclxuICBzZXRUZXh0KHRleHQpIHtcclxuICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICB0aGlzLiR0b2FzdC5maW5kKCcuaW5uZXInKS50ZXh0KHRoaXMudGV4dCk7XHJcbiAgfVxyXG5cclxuICBzZXREdXJhdGlvbihkdXJhdGlvbikge1xyXG4gICAgdGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG4gIH1cclxuXHJcbiAgc2hvdygpIHtcclxuICAgIHRoaXMuJHRvYXN0LmFkZENsYXNzKCdzaG93Jyk7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuJHRvYXN0LnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcbiAgICB9LCB0aGlzLmR1cmF0aW9uKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRvYXN0O1xyXG4iLCJjbGFzcyBMb2dpbkZvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jb25maWcgPSB7XHJcbiAgICAgIHVybFRva2VuOiAnL2xpYnMvZ3Jhbml0ZS9jc3JmL3Rva2VuLmpzb24nLFxyXG4gICAgICB1cmxSZWZyZXNoQ2hlY2s6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcclxuICAgICAgdXJsR2V0QWxsRGV0YWlsczogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9nZXRkZXRhaWxzL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxVcGRhdGVEZXRhaWxzOiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL3VwZGF0ZV9kZXRhaWxzL2luZGV4Lmpzb24nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuc3RhbmRhcmRDb250ZW50LnVzZXItYWNjb3VudCwgLnBhZ2UtYm9keS51c2VyLWFjY291bnQnXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZ2V0UGF0aFByZWZpeCA9IHRoaXMuZ2V0UGF0aFByZWZpeC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRQYXRoSG9tZSA9IHRoaXMuZ2V0UGF0aEhvbWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlYWRDb29raWUgPSB0aGlzLnJlYWRDb29raWUuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnRyeVVwZGF0ZURldGFpbHMgPSB0aGlzLnRyeVVwZGF0ZURldGFpbHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY29tcGxldGVVcGRhdGVEZXRhaWxzID0gdGhpcy5jb21wbGV0ZVVwZGF0ZURldGFpbHMuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmxvZ2dlZEluID0gdGhpcy5sb2dnZWRJbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5ub3RMb2dnZWRJbiA9IHRoaXMubm90TG9nZ2VkSW4uYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldFBhdGhQcmVmaXgoKSB7XHJcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xyXG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoSG9tZSgpIHtcclxuICAgIGNvbnN0IGhvbWUgPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1ob21lXFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAoaG9tZSA/IGhvbWUgOiAnJyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJsb2dnZWRpbi5ESEwnLCAoZXZ0LCB0b2tlbkRhdGEpID0+IHtcclxuICAgICAgdGhpcy5sb2dnZWRJbih0b2tlbkRhdGEpO1xyXG4gICAgfSk7XHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJub3Rsb2dnZWRpbi5ESEwnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubm90TG9nZ2VkSW4oKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBmb3JtID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJ2Zvcm0nKTtcclxuICAgIGlmIChmb3JtLmxlbmd0aCA+IDApIHtcclxuICAgICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ215QWNjb3VudEN1cnJlbnRQYXNzd29yZCcsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIHZhciAkcGFyZW50ID0gJChlbGVtZW50KS5wYXJlbnRzKCdmb3JtJyk7XHJcbiAgICAgICAgdmFyICRjdXJyZW50UGFzc3dvcmRDb250YWluZXIgPSAkcGFyZW50LmZpbmQoJy51c2VyYWNjb3VudC1jdXJyZW50cGFzc3dvcmQnKTtcclxuICAgICAgICB2YXIgJG5ld1Bhc3N3b3JkID0gJHBhcmVudC5maW5kKCdpbnB1dFtuYW1lPVwibXlBY2NvdW50X19uZXdQYXNzd29yZFwiXScpO1xyXG4gICAgICAgIHZhciAkY29uZmlybVBhc3N3b3JkID0gJHBhcmVudC5maW5kKCdpbnB1dFtuYW1lPVwibXlBY2NvdW50X19jb25maXJtUGFzc3dvcmRcIl0nKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICgoJG5ld1Bhc3N3b3JkLnZhbCgpID09PSAnJyAmJiAkY29uZmlybVBhc3N3b3JkLnZhbCgpID09PSAnJykgfHwgKCRjdXJyZW50UGFzc3dvcmRDb250YWluZXIuaXMoJzp2aXNpYmxlJykgJiYgJChlbGVtZW50KS52YWwoKSAhPT0gJycpKTtcclxuICAgICAgfSwgJ1lvdSBtdXN0IGVudGVyIHlvdXIgY3VycmVudCBwYXNzd29yZCcpO1xyXG5cclxuICAgICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ215QWNjb3VudFBhc3N3b3JkJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKCQoZWxlbWVudCkudmFsKCkgPT09ICcnKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cCgvXig/PS4qW2Etel0pKD89LipbQS1aXSkoPz0uKlxcZCkoPz0uKltfXFxXXSlbQS1aYS16XFxkX1xcV117OCx9JC8pLnRlc3QodmFsdWUpO1xyXG4gICAgICB9LCAnUGFzc3dvcmQgZm9ybWF0IGlzIG5vdCB2YWxpZCcpO1xyXG5cclxuICAgICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ215QWNjb3VudEVxdWFsVG8nLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICByZXR1cm4gKCQoJyMnICsgJChlbGVtZW50KS5hdHRyKCdkYXRhLWVxdWFsVG8nKSkudmFsKCkgPT09ICQoZWxlbWVudCkudmFsKCkpO1xyXG4gICAgICB9LCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpO1xyXG5cclxuICAgICAgZm9ybS52YWxpZGF0ZSh7XHJcbiAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgIG15QWNjb3VudF9fY3VycmVudFBhc3N3b3JkOiAnbXlBY2NvdW50Q3VycmVudFBhc3N3b3JkJyxcclxuICAgICAgICAgIG15QWNjb3VudF9fbmV3UGFzc3dvcmQ6ICdteUFjY291bnRQYXNzd29yZCcsXHJcbiAgICAgICAgICBteUFjY291bnRfX2NvbmZpcm1QYXNzd29yZDogJ215QWNjb3VudEVxdWFsVG8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcclxuICAgICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybUVsZW1lbnQpID0+IHtcclxuICAgICAgICAgIHRoaXMudHJ5VXBkYXRlRGV0YWlscyhmb3JtRWxlbWVudCk7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlYWRDb29raWUobmFtZSkge1xyXG4gICAgdmFyIG5hbWVFUSA9IG5hbWUgKyAnPSc7XHJcbiAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGMgPSBjYVtpXTtcclxuICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XHJcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHRyeVVwZGF0ZURldGFpbHMoZm9ybSkge1xyXG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XHJcbiAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuXHJcbiAgICB2YXIgY29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuQXV0aFRva2VuJyk7XHJcbiAgICBpZiAoY29va2llICE9PSBudWxsKSB7XHJcbiAgICAgIHZhciBzcGxpdCA9IGNvb2tpZS5zcGxpdCgnfCcpO1xyXG4gICAgICBpZiAoc3BsaXQubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsR2V0QWxsRGV0YWlscyxcclxuICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogc3BsaXRbMF0sIHRva2VuOiBzcGxpdFsxXSB9LFxyXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgc3VjY2VzczogKGFsbERldGFpbHNSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyBhbGxEZXRhaWxzUmVzcG9uc2UsIHRydWUgXSk7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxldGVVcGRhdGVEZXRhaWxzKGZvcm0sIGFsbERldGFpbHNSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDEpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoMikuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoMykuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIHJlZnJlc2hDb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nKTtcclxuICAgICAgaWYgKHJlZnJlc2hDb29raWUgIT09IG51bGwpIHtcclxuICAgICAgICB2YXIgcmVmcmVzaFNwbGl0ID0gcmVmcmVzaENvb2tpZS5zcGxpdCgnfCcpO1xyXG4gICAgICAgIGlmIChyZWZyZXNoU3BsaXQubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxSZWZyZXNoQ2hlY2ssXHJcbiAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogcmVmcmVzaFNwbGl0WzBdLCByZWZyZXNoX3Rva2VuOiByZWZyZXNoU3BsaXRbMV0gfSxcclxuICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgc3VjY2VzczogKHJlZnJlc2hSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyByZWZyZXNoUmVzcG9uc2UsIHRydWUgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cnlVcGRhdGVEZXRhaWxzKGZvcm0pO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoNCkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICg1KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICg2KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb21wbGV0ZVVwZGF0ZURldGFpbHMoZm9ybSwgZGV0YWlscykge1xyXG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XHJcblxyXG4gICAgdmFyIG5ld2VtYWlsID0gZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fZW1haWwnKS52YWwoKTtcclxuICAgIGlmIChuZXdlbWFpbC50cmltKCkgPT09IGRldGFpbHMucmVnaXN0cmF0aW9uX2VtYWlsKSB7XHJcbiAgICAgIG5ld2VtYWlsID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNhdGVnb3JpZXMgPSAnJztcclxuICAgIGZybS5maW5kKCcjZ2xiLXlvdXJhY2NvdW50LWNhdGVnb3JpZXMgaW5wdXQ6Y2hlY2tlZCcpLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgIGlmIChjYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjYXRlZ29yaWVzICs9ICcsJztcclxuICAgICAgfVxyXG4gICAgICBjYXRlZ29yaWVzICs9ICQoaXRlbSkudmFsKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgdG9rZW46IGRldGFpbHMudG9rZW4sXHJcblxyXG4gICAgICBmaXJzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2ZpcnN0TmFtZScpLnZhbCgpLFxyXG4gICAgICBsYXN0bmFtZTogZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fbGFzdE5hbWUnKS52YWwoKSxcclxuICAgICAgdXNlcm5hbWU6IGRldGFpbHMucmVnaXN0cmF0aW9uX2VtYWlsLFxyXG4gICAgICBuZXd1c2VybmFtZTogbmV3ZW1haWwsXHJcblxyXG4gICAgICBwYXNzd29yZDogZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fY3VycmVudFBhc3N3b3JkJykudmFsKCksXHJcbiAgICAgIG5ld3Bhc3N3b3JkOiBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19uZXdQYXNzd29yZCcpLnZhbCgpLFxyXG5cclxuICAgICAgcG9zaXRpb246IGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX3Bvc2l0aW9uJykudmFsKCksXHJcbiAgICAgIGNvbnRhY3Q6IGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX3Bob25lTnVtYmVyJykudmFsKCksXHJcbiAgICAgIHNpemU6IGZybS5maW5kKCdzZWxlY3QjbXlBY2NvdW50X19idXNpbmVzc1NpemUnKS52YWwoKSxcclxuICAgICAgc2VjdG9yOiBmcm0uZmluZCgnc2VsZWN0I215QWNjb3VudF9fYnVzaW5lc3NTZWN0b3InKS52YWwoKSxcclxuXHJcbiAgICAgIHRjYWdyZWU6IGZybS5maW5kKCdpbnB1dCNjaGVja2JveElkVENNZXNzYWdlJykuaXMoJzpjaGVja2VkJyksXHJcblxyXG4gICAgICBjYXRzOiBjYXRlZ29yaWVzXHJcbiAgICB9O1xyXG5cclxuICAgIGlmICgoJC50cmltKGRhdGEuZmlyc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS5sYXN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEudXNlcm5hbWUpLmxlbmd0aCA9PT0gMCkpIHtcclxuICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciB5b3VyIG5hbWUsIGVtYWlsIGFkZHJlc3MgYW5kIHBlcnNvbmFsIGRldGFpbHMuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXS51cGRhdGUtYnRuXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVXBkYXRlRGV0YWlscyxcclxuICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogKHVwZGF0ZURldGFpbHNSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodXBkYXRlRGV0YWlsc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHVwZGF0ZURldGFpbHNSZXNwb25zZSwgdHJ1ZSBdKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHVwZGF0ZURldGFpbHNSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgIGZybS5maW5kKCcubXlBY2NvdW50X19tZXNzYWdlJykuc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLm5ld3Bhc3N3b3JkLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fZW1haWwnKS5yZW1vdmVBdHRyKCdyZWFkb25seScpO1xyXG4gICAgICAgICAgICAgICAgICBmcm0uZmluZCgnLnVzZXJhY2NvdW50LWN1cnJlbnRwYXNzd29yZCcpLnNob3coKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2N1cnJlbnRQYXNzd29yZCcpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19uZXdQYXNzd29yZCcpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19jb25maXJtUGFzc3dvcmQnKS52YWwoJycpO1xyXG5cclxuICAgICAgICAgICAgICAgICQoJ2hlYWRlciAuaGVhZGVyX19hdXRoLS1sb2dnZWRpbiAudXNlci1maXJzdG5hbWUnKS50ZXh0KGRhdGEuZmlyc3RuYW1lKTtcclxuICAgICAgICAgICAgICAgICQoJy5jb21wZXRpdGlvbkRhdGFDYXB0dXJlLmxvZ2dlZC1pbiAubG9nZ2VkaW4tbmFtZScpLnRleHQoZGF0YS5maXJzdG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgwKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscy5cXG4nICsgdXBkYXRlRGV0YWlsc1Jlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J10udXBkYXRlLWJ0blwiKS50ZXh0KCdVcGRhdGUnKTtcclxuICAgICAgICAgICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgnVXBkYXRlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddLnVwZGF0ZS1idG5cIikudGV4dCgnVXBkYXRlJyk7XHJcbiAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdVcGRhdGUnKTtcclxuICB9XHJcblxyXG4gIGxvZ2dlZEluKHRva2VuRGF0YSkge1xyXG4gICAgaWYgKHRva2VuRGF0YSAmJiB0b2tlbkRhdGEuc3RhdHVzICYmIHRva2VuRGF0YS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxHZXRBbGxEZXRhaWxzLFxyXG4gICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogdG9rZW5EYXRhLnVzZXJuYW1lLCB0b2tlbjogdG9rZW5EYXRhLnRva2VuIH0sXHJcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogKGFsbERldGFpbHNSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnRGb3JtID0gJCh0aGlzLnNlbC5jb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIGFsbERldGFpbHNSZXNwb25zZSwgdHJ1ZSBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJy5sb2dnZWRpbi11c2VybmFtZScpLnRleHQoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9maXJzdG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19maXJzdE5hbWUnKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9maXJzdG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2xhc3ROYW1lJykudmFsKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fbGFzdG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2VtYWlsJykudmFsKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fZW1haWwpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19wb3NpdGlvbicpLnZhbChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX3Bvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19waG9uZU51bWJlcicpLnZhbChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX2NvbnRhY3QpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnc2VsZWN0I215QWNjb3VudF9fYnVzaW5lc3NTaXplJykudmFsKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ3NlbGVjdCNteUFjY291bnRfX2J1c2luZXNzU2VjdG9yJykudmFsKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fc2VjdG9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl90Y2FncmVlID09PSAndHJ1ZScpIHtcclxuICAgICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNjaGVja2JveElkVENNZXNzYWdlJykucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNjaGVja2JveElkVENNZXNzYWdlJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJyNnbGIteW91cmFjY291bnQtY2F0ZWdvcmllcyBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhdGVnb3JpZXMgPSBhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX2NhdHMuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2F0ZWdvcmllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJyNnbGIteW91cmFjY291bnQtY2F0ZWdvcmllcyBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl1bdmFsdWU9XCInICsgY2F0ZWdvcmllc1tpXSArICdcIl0nKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25faXNsaW5rZWRpbiA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLmZ1bGwgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCcudXNlcmFjY291bnQtY3VycmVudHBhc3N3b3JkJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fZW1haWwnKS5hdHRyKCdyZWFkb25seScsICdyZWFkb25seScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uY2xvc2VzdCgnLnBhZ2UtYm9keS13cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2F3YWl0aW5nJyk7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLnNob3coKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkaXNwbGF5IHlvdXIgZGV0YWlscy4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRpc3BsYXkgeW91ciBkZXRhaWxzLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBub3RMb2dnZWRJbigpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuaGFzQ2xhc3MoJ25vLXJlZGlyZWN0JykpIHtcclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMuZ2V0UGF0aEhvbWUoKSArICcuaHRtbCc7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgTG9naW5Gb3JtKCk7XHJcblxyXG4iLCIvLyBJbXBvcnQgY29tcG9uZW50c1xyXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vQ29tcG9uZW50cy9IZWFkZXInO1xyXG5pbXBvcnQgQm9vdHN0cmFwQ2Fyb3VzZWwgZnJvbSAnLi9Db21wb25lbnRzL0Jvb3RzdHJhcENhcm91c2VsJztcclxuaW1wb3J0IEFydGljbGVHcmlkIGZyb20gJy4vQ29tcG9uZW50cy9BcnRpY2xlR3JpZCc7XHJcbmltcG9ydCBTdWJzY3JpYmVQYW5lbCBmcm9tICcuL0NvbXBvbmVudHMvU3Vic2NyaWJlUGFuZWwnO1xyXG5pbXBvcnQgUGFzc3dvcmQgZnJvbSAnLi9Db21wb25lbnRzL1Bhc3N3b3JkJztcclxuaW1wb3J0IFBhc3N3b3JkVmFsaWRpdHkgZnJvbSAnLi9Db21wb25lbnRzL1Bhc3N3b3JkVmFsaWRpdHknO1xyXG5pbXBvcnQgRm9ybVZhbGlkYXRpb24gZnJvbSAnLi9Db21wb25lbnRzL0Zvcm1WYWxpZGF0aW9uJztcclxuaW1wb3J0IFNob3dIaWRlIGZyb20gJy4vQ29tcG9uZW50cy9TaG93SGlkZSc7XHJcbmltcG9ydCBDb29raWVCYW5uZXIgZnJvbSAnLi9Db21wb25lbnRzL0Nvb2tpZUJhbm5lcic7XHJcbmltcG9ydCBTZWFyY2hGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9TZWFyY2hGb3JtJztcclxuaW1wb3J0IEVjb21Gb3JtcyBmcm9tICcuL0NvbXBvbmVudHMvRWNvbUZvcm1zJztcclxuaW1wb3J0IFNoaXBGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9TaGlwRm9ybSc7XHJcbmltcG9ydCBJRURldGVjdG9yIGZyb20gJy4vQ29tcG9uZW50cy9JRURldGVjdG9yJztcclxuaW1wb3J0IFNvY2lhbCBmcm9tICcuL0NvbXBvbmVudHMvU29jaWFsJztcclxuaW1wb3J0IEhlcm8gZnJvbSAnLi9Db21wb25lbnRzL0hlcm8nO1xyXG5pbXBvcnQgQXV0aGVudGljYXRpb25FdmVudHMgZnJvbSAnLi9Db21wb25lbnRzL0F1dGhlbnRpY2F0aW9uRXZlbnRzJztcclxuaW1wb3J0IERlbGV0ZUFjY291bnRGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9EZWxldGVBY2NvdW50Rm9ybSc7XHJcbmltcG9ydCBMb2dpbkZvcm0gZnJvbSAnLi9Db21wb25lbnRzL0xvZ2luRm9ybSc7XHJcbmltcG9ydCBQYXNzd29yZFJlbWluZGVyRm9ybSBmcm9tICcuL0NvbXBvbmVudHMvUGFzc3dvcmRSZW1pbmRlckZvcm0nO1xyXG5pbXBvcnQgUmVnaXN0ZXJGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9SZWdpc3RlckZvcm0nO1xyXG5pbXBvcnQgWW91ckFjY291bnRGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9Zb3VyQWNjb3VudEZvcm0nO1xyXG5pbXBvcnQgU2hpcE5vd0Zvcm0gZnJvbSAnLi9Db21wb25lbnRzL1NoaXBOb3dGb3JtJztcclxuaW1wb3J0IFNoaXBOb3dUd29TdGVwRm9ybSBmcm9tICcuL0NvbXBvbmVudHMvU2hpcE5vd1R3b1N0ZXBGb3JtJztcclxuaW1wb3J0IENvbXBldGl0aW9uRm9ybSBmcm9tICcuL0NvbXBvbmVudHMvQ29tcGV0aXRpb25Gb3JtJztcclxuaW1wb3J0IFNlcnZpY2VXb3JrZXIgZnJvbSAnLi9Db21wb25lbnRzL1NlcnZpY2VXb3JrZXInO1xyXG5pbXBvcnQgT2ZmbGluZSBmcm9tICcuL0NvbXBvbmVudHMvT2ZmbGluZSc7XHJcbmltcG9ydCBMYW5kaW5nUG9pbnRzIGZyb20gJy4vQ29tcG9uZW50cy9MYW5kaW5nUG9pbnRzJztcclxuaW1wb3J0IEJhY2tCdXR0b24gZnJvbSAnLi9Db21wb25lbnRzL0JhY2tCdXR0b24nO1xyXG5pbXBvcnQgQXJ0aWNsZUNvdW50ZXIgZnJvbSAnLi9Db21wb25lbnRzL0FydGljbGVDb3VudGVyJztcclxuaW1wb3J0IE1hcmtldG9Gb3JtIGZyb20gJy4vQ29tcG9uZW50cy9NYXJrZXRvRm9ybSc7XHJcbmltcG9ydCBMYW5ndWFnZURldGVjdCBmcm9tICcuL0NvbXBvbmVudHMvTGFuZ3VhZ2VEZXRlY3QnO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBkb2N1bWVudC5jcmVhdGVFdmVudCgnVG91Y2hFdmVudCcpO1xyXG4gICAgJCgnYm9keScpLmFkZENsYXNzKCd0b3VjaCcpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIC8vIG5vdGhpbmdcclxuICB9XHJcbiAgaWYgKCh3aW5kb3cubWF0Y2hNZWRpYSgnKGRpc3BsYXktbW9kZTogc3RhbmRhbG9uZSknKS5tYXRjaGVzKSB8fCAod2luZG93Lm5hdmlnYXRvci5zdGFuZGFsb25lKSkgJCgnaHRtbCcpLmFkZENsYXNzKCdwd2EnKTtcclxuICAvLyBJbml0aWF0ZSBjb21wb25lbnRzXHJcbiAgTGFuZ3VhZ2VEZXRlY3QuaW5pdCgpO1xyXG4gIC8vIEFydGljbGVDb3VudGVyLmluaXQoKTtcclxuICBJRURldGVjdG9yLmluaXQoKTtcclxuICBIZWFkZXIuaW5pdCgpO1xyXG4gIEJvb3RzdHJhcENhcm91c2VsLmluaXQoKTtcclxuICBBcnRpY2xlR3JpZC5pbml0KCk7XHJcbiAgU3Vic2NyaWJlUGFuZWwuaW5pdCgpO1xyXG4gIFBhc3N3b3JkLmluaXQoKTtcclxuICBQYXNzd29yZFZhbGlkaXR5LmluaXQoKTtcclxuICAvLyBGb3JtVmFsaWRhdGlvbi5pbml0KCk7XHJcbiAgU2hvd0hpZGUuaW5pdCgpO1xyXG4gIENvb2tpZUJhbm5lci5pbml0KCk7XHJcbiAgU2VhcmNoRm9ybS5pbml0KCk7XHJcbiAgRWNvbUZvcm1zLmluaXQoKTtcclxuICBTaGlwRm9ybS5pbml0KCk7XHJcbiAgU29jaWFsLmluaXQoKTtcclxuICBIZXJvLmluaXQoKTtcclxuICBDb21wZXRpdGlvbkZvcm0uaW5pdCgpO1xyXG4gIFNoaXBOb3dGb3JtLmluaXQoKTtcclxuICBTaGlwTm93VHdvU3RlcEZvcm0uaW5pdCgpO1xyXG4gIFlvdXJBY2NvdW50Rm9ybS5pbml0KCk7XHJcbiAgUmVnaXN0ZXJGb3JtLmluaXQoKTtcclxuICBQYXNzd29yZFJlbWluZGVyRm9ybS5pbml0KCk7XHJcbiAgTG9naW5Gb3JtLmluaXQoKTtcclxuICBEZWxldGVBY2NvdW50Rm9ybS5pbml0KCk7XHJcbiAgQXV0aGVudGljYXRpb25FdmVudHMuaW5pdCgpO1xyXG4gIFNlcnZpY2VXb3JrZXIuaW5pdCgpO1xyXG4gIE9mZmxpbmUuaW5pdCgpO1xyXG4gIExhbmRpbmdQb2ludHMuaW5pdCgpO1xyXG4gIEJhY2tCdXR0b24uaW5pdCgpO1xyXG4gIE1hcmtldG9Gb3JtLmluaXQoKTtcclxufSk7XHJcbiJdfQ==
