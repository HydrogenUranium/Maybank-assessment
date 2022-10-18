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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BcnRpY2xlQ291bnRlci5qcyIsImpzL2Rldi9Db21wb25lbnRzL0FydGljbGVHcmlkLmpzIiwianMvZGV2L0NvbXBvbmVudHMvQXV0aGVudGljYXRpb25FdmVudHMuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9CYWNrQnV0dG9uLmpzIiwianMvZGV2L0NvbXBvbmVudHMvQm9vdHN0cmFwQ2Fyb3VzZWwuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Db21wZXRpdGlvbkZvcm0uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Db25zdGFudHMuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Db29raWVCYW5uZXIuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9EYXRhYmFzZS5qcyIsImpzL2Rldi9Db21wb25lbnRzL0RlbGV0ZUFjY291bnRGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvRWNvbUZvcm1zLmpzIiwianMvZGV2L0NvbXBvbmVudHMvRm9ybVZhbGlkYXRpb24uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9IZWFkZXIuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9IZXJvLmpzIiwianMvZGV2L0NvbXBvbmVudHMvSUVEZXRlY3Rvci5qcyIsImpzL2Rldi9Db21wb25lbnRzL0xhbmRpbmdQb2ludHMuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9MYW5ndWFnZURldGVjdC5qcyIsImpzL2Rldi9Db21wb25lbnRzL0xvZ2luRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL01hcmtldG9Gb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvT2ZmbGluZS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1Bhc3N3b3JkLmpzIiwianMvZGV2L0NvbXBvbmVudHMvUGFzc3dvcmRSZW1pbmRlckZvcm0uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9QYXNzd29yZFZhbGlkaXR5LmpzIiwianMvZGV2L0NvbXBvbmVudHMvUmVnaXN0ZXJGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2VhcmNoRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1NlcnZpY2VXb3JrZXIuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9TaGlwRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1NoaXBOb3dGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2hpcE5vd1R3b1N0ZXBGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2hvd0hpZGUuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Tb2NpYWwuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9TdWJzY3JpYmVQYW5lbC5qcyIsImpzL2Rldi9Db21wb25lbnRzL1RvYXN0LmpzIiwianMvZGV2L0NvbXBvbmVudHMvWW91ckFjY291bnRGb3JtLmpzIiwianMvZGV2L21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sYztBQUNKLDRCQUFjO0FBQUE7O0FBQ1osU0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDRDs7OztvQ0FFZTtBQUNkLFVBQU0sU0FBUyxFQUFFLHFDQUFGLEVBQXlDLElBQXpDLENBQThDLFNBQTlDLENBQWY7QUFDQSxhQUFRLFNBQVMsTUFBVCxHQUFrQixFQUExQjtBQUNEOzs7MkJBRU07QUFDTDtBQUNBO0FBQ0EsVUFBSSxjQUFjLEVBQUUsNEJBQUYsQ0FBbEI7QUFDQSxVQUFJLFlBQVksTUFBWixHQUFxQixDQUF6QixFQUE0QjtBQUMxQixZQUFJLE9BQU8sWUFBWSxJQUFaLENBQWlCLE1BQWpCLENBQVg7QUFDQSxZQUFJLEVBQUUsSUFBRixDQUFPLElBQVAsRUFBYSxNQUFiLEdBQXNCLENBQTFCLEVBQTZCO0FBQzNCLGNBQUksT0FBTztBQUNULGVBQUc7QUFETSxXQUFY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QjtBQUNELEdBSEQsQ0FHRSxPQUFPLENBQVAsRUFBVTtBQUNWO0FBQ0Q7QUFDRCxNQUFLLE9BQU8sVUFBUCxDQUFrQiw0QkFBbEIsRUFBZ0QsT0FBakQsSUFBOEQsT0FBTyxTQUFQLENBQWlCLFVBQW5GLEVBQWdHLEVBQUUsTUFBRixFQUFVLFFBQVYsQ0FBbUIsS0FBbkI7QUFDaEc7QUFDQSwyQkFBZSxJQUFmO0FBQ0E7QUFDQSx1QkFBVyxJQUFYO0FBQ0EsbUJBQU8sSUFBUDtBQUNBLDhCQUFrQixJQUFsQjtBQUNBLHdCQUFZLElBQVo7QUFDQSwyQkFBZSxJQUFmO0FBQ0EscUJBQVMsSUFBVDtBQUNBLDZCQUFpQixJQUFqQjtBQUNBO0FBQ0EscUJBQVMsSUFBVDtBQUNBLHlCQUFhLElBQWI7QUFDQSx1QkFBVyxJQUFYO0FBQ0Esc0JBQVUsSUFBVjtBQUNBLHFCQUFTLElBQVQ7QUFDQSxtQkFBTyxJQUFQO0FBQ0EsaUJBQUssSUFBTDtBQUNBLDRCQUFnQixJQUFoQjtBQUNBLHdCQUFZLElBQVo7QUFDQSwrQkFBbUIsSUFBbkI7QUFDQSw0QkFBZ0IsSUFBaEI7QUFDQSx5QkFBYSxJQUFiO0FBQ0EsaUNBQXFCLElBQXJCO0FBQ0Esc0JBQVUsSUFBVjtBQUNBLDhCQUFrQixJQUFsQjtBQUNBLGlDQUFxQixJQUFyQjtBQUNBLDBCQUFjLElBQWQ7QUFDQSxvQkFBUSxJQUFSO0FBQ0EsMEJBQWMsSUFBZDtBQUNBLHVCQUFXLElBQVg7QUFDQSx3QkFBWSxJQUFaO0FBQ0QsQ0F4Q0QsRSxDQWpDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNsYXNzIEFydGljbGVDb3VudGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuZ2V0UGF0aFByZWZpeCA9IHRoaXMuZ2V0UGF0aFByZWZpeC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoUHJlZml4KCkge1xyXG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIC8vIC9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9jb3VudGVyL2luZGV4Lmpzb25cclxuICAgIC8vIHAgPSAvY29udGVudC9kaGwvWFhYWFxyXG4gICAgbGV0IGFydGljbGVQYWdlID0gJCgnLnBhZ2UtYm9keS5hcnRpY2xlLWNvdW50ZXInKTtcclxuICAgIGlmIChhcnRpY2xlUGFnZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGxldCBwYXRoID0gYXJ0aWNsZVBhZ2UuZGF0YSgncGF0aCcpO1xyXG4gICAgICBpZiAoJC50cmltKHBhdGgpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgIHA6IHBhdGhcclxuICAgICAgICB9O1xyXG4gICAgICAgICQucG9zdCh0aGlzLmdldFBhdGhQcmVmaXgoKSArICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvY291bnRlci9pbmRleC5qc29uJywgZGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBBcnRpY2xlQ291bnRlcigpO1xyXG4iLCJjbGFzcyBBcnRpY2xlR3JpZEFwaSB7XHJcbiAgY29uc3RydWN0b3IoZW5kcG9pbnQsIHBhZ2VTaXplID0gNikge1xyXG4gICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50O1xyXG4gICAgdGhpcy5wYWdlU2l6ZSA9IHBhZ2VTaXplO1xyXG4gICAgdGhpcy5za2lwID0gMDtcclxuXHJcbiAgICB0aGlzLmRvUmVxdWVzdCA9IHRoaXMuZG9SZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNlYXJjaCA9IHRoaXMuc2VhcmNoLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxvYWRNb3JlID0gdGhpcy5sb2FkTW9yZS5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgZG9SZXF1ZXN0KGNhbGxiYWNrLCBrZXl3b3JkID0gbnVsbCkge1xyXG4gICAgJC5nZXQodGhpcy5lbmRwb2ludCwge1xyXG4gICAgICBza2lwOiB0aGlzLnNraXAsXHJcbiAgICAgIHBhZ2VTaXplOiB0aGlzLnBhZ2VTaXplLFxyXG4gICAgICBrZXl3b3JkOiBrZXl3b3JkXHJcbiAgICB9LCAoZGF0YSkgPT4ge1xyXG4gICAgICB0aGlzLnNraXAgKz0gZGF0YS5JdGVtcy5sZW5ndGg7XHJcbiAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZWFyY2goY2FsbGJhY2ssIGtleXdvcmQpIHtcclxuICAgIHRoaXMuc2tpcCA9IDA7XHJcbiAgICB0aGlzLmRvUmVxdWVzdChjYWxsYmFjaywga2V5d29yZCk7XHJcbiAgfVxyXG5cclxuICBsb2FkTW9yZShjYWxsYmFjaykge1xyXG4gICAgdGhpcy5kb1JlcXVlc3QoY2FsbGJhY2spO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgQXJ0aWNsZUdyaWQge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmhhc21vcmUgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuYXJ0aWNsZUdyaWQnLFxyXG4gICAgICBncmlkOiAnLmFydGljbGVHcmlkX19ncmlkJyxcclxuICAgICAgbG9hZE1vcmU6ICcuYXJ0aWNsZUdyaWRfX2xvYWRNb3JlJyxcclxuICAgICAgdGVtcGxhdGU6ICcjYXJ0aWNsZUdyaWRfX3BhbmVsVGVtcGxhdGUnLFxyXG4gICAgICBuYXY6ICcuYXJ0aWNsZUdyaWRfX25hdidcclxuICAgIH07XHJcbiAgICB0aGlzLnRlbXBsYXRlID0gJCgkKHRoaXMuc2VsLnRlbXBsYXRlKS5odG1sKCkpO1xyXG5cclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5sb2FkTW9yZSA9IHRoaXMubG9hZE1vcmUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucG9wdWxhdGVUZW1wbGF0ZXMgPSB0aGlzLnBvcHVsYXRlVGVtcGxhdGVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd1NwaW5uZXIgPSB0aGlzLnNob3dTcGlubmVyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmhpZGVTcGlubmVyID0gdGhpcy5oaWRlU3Bpbm5lci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zY3JvbGxuYXYgPSB0aGlzLnNjcm9sbG5hdi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zY3JvbGxsZWZ0ID0gdGhpcy5zY3JvbGxsZWZ0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNjcm9sbHJpZ2h0ID0gdGhpcy5zY3JvbGxyaWdodC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGVja1Njcm9sbCA9IHRoaXMuY2hlY2tTY3JvbGwuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucGFnZVNjcm9sbCA9IHRoaXMucGFnZVNjcm9sbC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQod2luZG93KS5vbignc2Nyb2xsJywgdGhpcy5wYWdlU2Nyb2xsKTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmxvYWRNb3JlLCB0aGlzLmxvYWRNb3JlKTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc2Nyb2xsbGVmdCcsIHRoaXMuc2Nyb2xsbGVmdCk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnNjcm9sbHJpZ2h0JywgdGhpcy5zY3JvbGxyaWdodCk7XHJcblxyXG4gICAgdGhpcy5wYWdlU2Nyb2xsKCk7XHJcbiAgfVxyXG5cclxuICBwYWdlU2Nyb2xsKCkge1xyXG4gICAgaWYgKHRoaXMuaGFzbW9yZSAmJiAoIXRoaXMubG9hZGluZykpIHtcclxuICAgICAgdmFyIHduZCA9ICQod2luZG93KTtcclxuICAgICAgdmFyIGVsbSA9ICQodGhpcy5zZWwubG9hZE1vcmUpO1xyXG5cclxuICAgICAgaWYgKGVsbSAmJiAoJChlbG0pLmxlbmd0aCA+IDApKSB7XHJcbiAgICAgICAgdmFyIHdzdCA9IHduZC5zY3JvbGxUb3AoKTtcclxuICAgICAgICB2YXIgd2ggPSB3bmQuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIG90ID0gZWxtLm9mZnNldCgpLnRvcDtcclxuICAgICAgICB2YXIgb2ggPSBlbG0ub3V0ZXJIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgaWYgKCh3c3QgKyB3aCkgPiAob3QgKyBvaCkpIHtcclxuICAgICAgICAgIHRoaXMubG9hZE1vcmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvYWRNb3JlKGUpIHtcclxuICAgIGlmIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgLy8gU2hvdyB0aGUgbG9hZGluZyBzcGlubmVyXHJcbiAgICB0aGlzLnNob3dTcGlubmVyKCk7XHJcblxyXG4gICAgdmFyIHQgPSAwO1xyXG4gICAgJChcIi5hcnRpY2xlR3JpZF9faXRlbVwiLCB0aGlzLnNlbC5jb21wb25lbnQpLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgIGlmICh0IDwgNiAmJiAoISQoaXRlbSkuaXMoXCI6dmlzaWJsZVwiKSkpIHtcclxuICAgICAgICAkKGl0ZW0pLnNob3coKTtcclxuICAgICAgICB0Kys7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICgkKFwiLmFydGljbGVHcmlkX19pdGVtXCIsdGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPT09ICQoXCIuYXJ0aWNsZUdyaWRfX2l0ZW06dmlzaWJsZVwiLHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoKSB7XHJcbiAgICAgICQodGhpcy5zZWwubG9hZE1vcmUpLnBhcmVudHMoXCIucm93XCIpLmZpcnN0KCkucmVtb3ZlKCk7XHJcbiAgICAgIHRoaXMuaGFzbW9yZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhpZGUgdGhlIGxvYWRpbmcgc3Bpbm5lclxyXG4gICAgdGhpcy5oaWRlU3Bpbm5lcigpO1xyXG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBzaG93U3Bpbm5lcigpIHtcclxuICAgICQodGhpcy5zZWwubG9hZE1vcmUpLmFkZENsYXNzKCdhcnRpY2xlR3JpZF9fbG9hZE1vcmUtLWxvYWRpbmcnKTtcclxuICB9XHJcblxyXG4gIGhpZGVTcGlubmVyKCkge1xyXG4gICAgJCh0aGlzLnNlbC5sb2FkTW9yZSkucmVtb3ZlQ2xhc3MoJ2FydGljbGVHcmlkX19sb2FkTW9yZS0tbG9hZGluZycpO1xyXG4gIH1cclxuXHJcbiAgc2Nyb2xsbmF2KCkge1xyXG4gICAgbGV0ICRzY3JvbGxuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsLm5hdik7XHJcbiAgICBpZiAoJHNjcm9sbG5hdiA9PT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgbGV0IHNjcm9sbFdpZHRoID0gJHNjcm9sbG5hdi5zY3JvbGxXaWR0aDtcclxuICAgIGxldCBjbGllbnRXaWR0aCA9ICRzY3JvbGxuYXYuY2xpZW50V2lkdGg7XHJcbiAgICBpZiAoc2Nyb2xsV2lkdGggPiBjbGllbnRXaWR0aCkge1xyXG4gICAgICAkKHRoaXMuc2VsLm5hdikuYWZ0ZXIoJzxpIGNsYXNzPVwic2Nyb2xscmlnaHRcIj4+PC9pPicpO1xyXG4gICAgfVxyXG4gIH1cclxuICBzY3JvbGxyaWdodCgpIHtcclxuICAgIGxldCBzZWxmID0gdGhpcy5zZWwubmF2O1xyXG4gICAgbGV0IHNjcm9sbFdpZHRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxmKS5zY3JvbGxXaWR0aDtcclxuICAgICQoc2VsZikuYW5pbWF0ZSh7XHJcbiAgICAgIHNjcm9sbExlZnQ6IHNjcm9sbFdpZHRoICsgJ3B4J1xyXG4gICAgfSwgNTAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoJy5zY3JvbGxyaWdodCcpLnJlbW92ZSgpO1xyXG4gICAgICAkKHNlbGYpLmJlZm9yZSgnPGkgY2xhc3M9XCJzY3JvbGxsZWZ0XCI+PDwvaT4nKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2Nyb2xsbGVmdCgpIHtcclxuICAgIGxldCBzZWxmID0gdGhpcy5zZWwubmF2O1xyXG4gICAgJChzZWxmKS5hbmltYXRlKHtcclxuICAgICAgc2Nyb2xsTGVmdDogMFxyXG4gICAgfSwgNTAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQoJy5zY3JvbGxsZWZ0JykucmVtb3ZlKCk7XHJcbiAgICAgICQoc2VsZikuYWZ0ZXIoJzxpIGNsYXNzPVwic2Nyb2xscmlnaHRcIj4+PC9pPicpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjaGVja1Njcm9sbCgpIHtcclxuICAgIGxldCAkc2Nyb2xsbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbC5uYXYpO1xyXG4gICAgaWYgKCRzY3JvbGxuYXYgPT09IG51bGwpIHJldHVybjtcclxuICAgIGxldCBzY3JvbGxXaWR0aCA9ICRzY3JvbGxuYXYuc2Nyb2xsV2lkdGg7XHJcbiAgICBsZXQgY2xpZW50V2lkdGggPSAkc2Nyb2xsbmF2LmNsaWVudFdpZHRoO1xyXG4gICAgbGV0IHNjcm9sbEdhcCA9IHNjcm9sbFdpZHRoIC0gY2xpZW50V2lkdGg7XHJcbiAgICAkKHNlbGYpLnNjcm9sbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICh0aGlzLnNjcm9sbExlZnQgPT09IDApIHtcclxuICAgICAgICAkKCcuc2Nyb2xsbGVmdCcpLnJlbW92ZSgpO1xyXG4gICAgICAgICQoc2VsZikuYWZ0ZXIoJzxpIGNsYXNzPVwic2Nyb2xscmlnaHRcIj4+PC9pPicpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLnNjcm9sbExlZnQgPj0gc2Nyb2xsR2FwKSB7XHJcbiAgICAgICAgJCgnLnNjcm9sbHJpZ2h0JykucmVtb3ZlKCk7XHJcbiAgICAgICAgJChzZWxmKS5iZWZvcmUoJzxpIGNsYXNzPVwic2Nyb2xsbGVmdFwiPjw8L2k+Jyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcG9wdWxhdGVUZW1wbGF0ZXMoaXRlbXMpIHtcclxuICAgIGxldCBvdXRwdXQgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgLy8gQ2xvbmUgdGVtcGxhdGVcclxuICAgICAgbGV0ICR0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUuY2xvbmUoKTtcclxuICAgICAgLy8gR2V0IHRoZSBpdGVtXHJcbiAgICAgIGxldCBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgIC8vIFNldCBpbWFnZSBicmVha3BvaW50XHJcbiAgICAgIGxldCBkZXNrdG9wQnJlYWtwb2ludCA9IDk5MjtcclxuICAgICAgLy8gR2VuZXJhdGUgSURcclxuICAgICAgbGV0IHBhbmVsSWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgOSk7XHJcbiAgICAgIC8vIFBvcHVsYXRlIElEXHJcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsJykuYXR0cignaWQnLCBwYW5lbElkKTtcclxuICAgICAgLy8gSWYgbGFyZ2UgcGFuZWxcclxuICAgICAgaWYgKGl0ZW0uSXNMYXJnZSkge1xyXG4gICAgICAgIC8vIFVwZGF0ZSBpbWFnZSBicmVha3BvaW50XHJcbiAgICAgICAgZGVza3RvcEJyZWFrcG9pbnQgPSA3Njg7XHJcbiAgICAgICAgLy8gQWRkIGNsYXNzXHJcbiAgICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5hZGRDbGFzcygnYXJ0aWNsZVBhbmVsLS1sYXJnZScpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIElmIHZpZGVvXHJcbiAgICAgIGlmIChpdGVtLklzVmlkZW8pIHtcclxuICAgICAgICAvLyBBZGQgY2xhc3NcclxuICAgICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbCcpLmFkZENsYXNzKCdhcnRpY2xlUGFuZWwtLXZpZGVvJyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gUG9wdWxhdGUgaW1hZ2VzXHJcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX19pbWFnZScpLmF0dHIoe1xyXG4gICAgICAgIGhyZWY6IGl0ZW0uTGluayxcclxuICAgICAgICB0aXRsZTogaXRlbS5UaXRsZVxyXG4gICAgICB9KS5hdHRyKCdzdHlsZScsICdiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyArIGl0ZW0uSW1hZ2VzLk1vYmlsZSArICcpOycpO1xyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnc3R5bGUnKVswXS5pbm5lckhUTUwgPSAnQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogJyArIGRlc2t0b3BCcmVha3BvaW50ICsgJ3B4KXsjJyArIHBhbmVsSWQgKyAnIC5hcnRpY2xlUGFuZWxfX2ltYWdle2JhY2tncm91bmQtaW1hZ2U6IHVybCgnICsgaXRlbS5JbWFnZXMuRGVza3RvcCArICcpICFpbXBvcnRhbnQ7fX0nO1xyXG4gICAgICAvLyBQb3B1bGF0ZSBsaW5rXHJcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX19jb250ZW50ID4gYScpLmF0dHIoe1xyXG4gICAgICAgIGhyZWY6IGl0ZW0uTGluayxcclxuICAgICAgICB0aXRsZTogaXRlbS5UaXRsZVxyXG4gICAgICB9KTtcclxuICAgICAgLy8gUG9wdWxhdGUgdGl0bGVcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX3RpdGxlJykudGV4dChpdGVtLlRpdGxlKTtcclxuICAgICAgLy8gUG9wdWxhdGUgZGVzY3JpcHRpb25cclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2Rlc2NyaXB0aW9uJykudGV4dChpdGVtLkRlc2NyaXB0aW9uKTtcclxuICAgICAgLy8gUG9wdWxhdGUgY2F0ZWdvcnlcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX3N1YlRpdGxlIGE6Zmlyc3QtY2hpbGQnKS5hdHRyKHtcclxuICAgICAgICAnaHJlZic6IGl0ZW0uQ2F0ZWdvcnkuTGluayxcclxuICAgICAgICAndGl0bGUnOiBpdGVtLkNhdGVnb3J5Lk5hbWVcclxuICAgICAgfSkudGV4dChpdGVtLkNhdGVnb3J5Lk5hbWUpO1xyXG4gICAgICAvLyBQb3B1bGF0ZSB0aW1lIHRvIHJlYWRcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX3N1YlRpdGxlIGE6bGFzdC1jaGlsZCcpLmF0dHIoe1xyXG4gICAgICAgICdocmVmJzogaXRlbS5MaW5rLFxyXG4gICAgICAgICd0aXRsZSc6IGl0ZW0uVGl0bGVcclxuICAgICAgfSkudGV4dChpdGVtLlRpbWVUb1JlYWQpO1xyXG4gICAgICAvLyBQdXNoIGl0ZW0gdG8gb3V0cHV0XHJcbiAgICAgIG91dHB1dC5wdXNoKCR0ZW1wbGF0ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIGxldCBlbmRwb2ludCA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5hdHRyKCdkYXRhLWVuZHBvaW50Jyk7XHJcbiAgICB0aGlzLkFQSSA9IG5ldyBBcnRpY2xlR3JpZEFwaShlbmRwb2ludCk7XHJcbiAgICB0aGlzLnNjcm9sbG5hdigpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICB0aGlzLmNoZWNrU2Nyb2xsKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBBcnRpY2xlR3JpZCgpO1xyXG4iLCJjbGFzcyBBdXRoZW50aWNhdGlvbkV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNvbmZpZyA9IHtcclxuICAgICAgdXJsVG9rZW46ICcvbGlicy9ncmFuaXRlL2NzcmYvdG9rZW4uanNvbicsXHJcbiAgICAgIHVybENoZWNrOiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL2NoZWNrL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxSZWZyZXNoQ2hlY2s6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcclxuICAgICAgdXJsRG93bmxvYWRBc3NldDogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9kb3dubG9hZF9hc3NldC9pbmRleC5qc29uJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmdldFBhdGhQcmVmaXggPSB0aGlzLmdldFBhdGhQcmVmaXguYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0UGF0aEhvbWUgPSB0aGlzLmdldFBhdGhIb21lLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnJlYWRDb29raWUgPSB0aGlzLnJlYWRDb29raWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2xlYXJDb29raWUgPSB0aGlzLmNsZWFyQ29va2llLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNyZWF0ZUNvb2tpZSA9IHRoaXMuY3JlYXRlQ29va2llLmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5jaGVja0xvZ2luU3RhdHVzID0gdGhpcy5jaGVja0xvZ2luU3RhdHVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoZWNrQXV0aFRva2VucyA9IHRoaXMuY2hlY2tBdXRoVG9rZW5zLmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5zaG93TG9nZ2VkSW5FbGVtZW50cyA9IHRoaXMuc2hvd0xvZ2dlZEluRWxlbWVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd05vdExvZ2dlZEluRWxlbWVudHMgPSB0aGlzLnNob3dOb3RMb2dnZWRJbkVsZW1lbnRzLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoUHJlZml4KCkge1xyXG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UGF0aEhvbWUoKSB7XHJcbiAgICBjb25zdCBob21lID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtaG9tZVxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XHJcbiAgICByZXR1cm4gKGhvbWUgPyBob21lIDogJycpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgICQod2luZG93KS5vbignY2hlY2thdXRodG9rZW5zLkRITCcsIChldnQsIHRva2VuRGF0YSwgc2tpcEVsZW1lbnRzKSA9PiB7XHJcbiAgICAgIHRoaXMuY2hlY2tBdXRoVG9rZW5zKHRva2VuRGF0YSwgc2tpcEVsZW1lbnRzKTtcclxuICAgIH0pO1xyXG4gICAgJCh3aW5kb3cpLm9uKCd1c2VybG9nZ2VkaW4uREhMJywgKGV2dCwgdG9rZW5EYXRhKSA9PiB7XHJcbiAgICAgIHRoaXMuc2hvd0xvZ2dlZEluRWxlbWVudHModG9rZW5EYXRhKTtcclxuICAgIH0pO1xyXG4gICAgJCh3aW5kb3cpLm9uKCd1c2Vybm90bG9nZ2VkaW4uREhMJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLnNob3dOb3RMb2dnZWRJbkVsZW1lbnRzKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBsb2dnZWQgaW4gaGVhZGVyIChsb2dvdXQgbGluaylcclxuICAgIHZhciBsb2dnZWRJbkhlYWRlciA9ICQoJy5mb290ZXIgLmZvb3Rlcl9fY3Rhcy0tbG9nZ2VkaW4nKTtcclxuICAgIGlmIChsb2dnZWRJbkhlYWRlci5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGxvZ2dlZEluSGVhZGVyLm9uKCdjbGljaycsICcubG9nb3V0LWxpbmsnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5jbGVhckNvb2tpZSgnREhMLkF1dGhUb2tlbicpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nKTtcclxuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNoZWNrTG9naW5TdGF0dXMoKTtcclxuICB9XHJcblxyXG4gIHJlYWRDb29raWUobmFtZSkge1xyXG4gICAgdmFyIG5hbWVFUSA9IG5hbWUgKyAnPSc7XHJcbiAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGMgPSBjYVtpXTtcclxuICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XHJcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIGNsZWFyQ29va2llKG5hbWUpIHtcclxuICAgIHRoaXMuY3JlYXRlQ29va2llKG5hbWUsICcnLCAtMSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVDb29raWUobmFtZSwgdmFsdWUsIGV4cGlyeVNlY29uZHMpIHtcclxuICAgIHZhciBleHBpcmVzID0gJyc7XHJcbiAgICBpZiAoZXhwaXJ5U2Vjb25kcykge1xyXG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChleHBpcnlTZWNvbmRzICogMTAwMCkpO1xyXG4gICAgICBleHBpcmVzID0gJzsgZXhwaXJlcz0nICsgZGF0ZS50b1VUQ1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArICc9JyArIHZhbHVlICsgZXhwaXJlcyArICc7IHBhdGg9Lyc7XHJcbiAgfVxyXG5cclxuICBjaGVja0xvZ2luU3RhdHVzKCkge1xyXG4gICAgdmFyIGNvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLkF1dGhUb2tlbicpO1xyXG4gICAgaWYgKGNvb2tpZSAhPT0gbnVsbCkge1xyXG4gICAgICB2YXIgYXV0aFNwbGl0ID0gY29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgIGlmIChhdXRoU3BsaXQubGVuZ3RoID49IDIpIHtcclxuICAgICAgICB0aGlzLmNhbGxUb2tlbkNoZWNrKHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsQ2hlY2ssIHtcclxuICAgICAgICAgIHVzZXJuYW1lOiBhdXRoU3BsaXRbMF0sXHJcbiAgICAgICAgICB0b2tlbjogYXV0aFNwbGl0WzFdXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3VzZXJub3Rsb2dnZWRpbi5ESEwnKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIHJlZnJlc2hDb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nKTtcclxuICAgICAgaWYgKHJlZnJlc2hDb29raWUgIT09IG51bGwpIHtcclxuICAgICAgICB2YXIgcmVmcmVzaENvb2tpZVNwbGl0ID0gcmVmcmVzaENvb2tpZS5zcGxpdCgnfCcpO1xyXG4gICAgICAgIGlmIChyZWZyZXNoQ29va2llU3BsaXQubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgIHRoaXMuY2FsbFRva2VuQ2hlY2sodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxSZWZyZXNoQ2hlY2ssIHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IHJlZnJlc2hDb29raWVTcGxpdFswXSxcclxuICAgICAgICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaENvb2tpZVNwbGl0WzFdXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3VzZXJub3Rsb2dnZWRpbi5ESEwnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3VzZXJub3Rsb2dnZWRpbi5ESEwnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2FsbFRva2VuQ2hlY2sodXJsLCBkYXRhKSB7XHJcbiAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAoY3NyZnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHZhciBjc3JmdG9rZW4gPSBjc3JmcmVzcG9uc2UudG9rZW47XHJcblxyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jaGVja0F1dGhUb2tlbnMocmVzcG9uc2UsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjaGVja0F1dGhUb2tlbnModG9rZW5EYXRhLCBza2lwRWxlbWVudHMpIHtcclxuICAgIGlmICh0b2tlbkRhdGEgJiYgdG9rZW5EYXRhLnN0YXR1cyAmJiB0b2tlbkRhdGEuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgIHRoaXMuY3JlYXRlQ29va2llKCdESEwuQXV0aFRva2VuJywgdG9rZW5EYXRhLnVzZXJuYW1lICsgJ3wnICsgdG9rZW5EYXRhLnRva2VuLCB0b2tlbkRhdGEudHRsKTtcclxuICAgICAgdGhpcy5jcmVhdGVDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nLCB0b2tlbkRhdGEudXNlcm5hbWUgKyAnfCcgKyB0b2tlbkRhdGEucmVmcmVzaF90b2tlbiwgKDI0ICogNjAgKiA2MCkpO1xyXG5cclxuICAgICAgaWYgKHNraXBFbGVtZW50cyAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICQod2luZG93KS50cmlnZ2VyKCd1c2VybG9nZ2VkaW4uREhMJywgdG9rZW5EYXRhKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChza2lwRWxlbWVudHMgIT09IHRydWUpIHtcclxuICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3VzZXJub3Rsb2dnZWRpbi5ESEwnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNob3dMb2dnZWRJbkVsZW1lbnRzKHRva2VuRGF0YSkge1xyXG4gICAgJCgnLmJlbG93LXJlZ2lzdGVyLWZvcm0gLnRhYi5tb2JpbGUnKS5oaWRlKCk7XHJcblxyXG4gICAgJCgnLmJlbG93LXJlZ2lzdGVyLWZvcm0gI3JlZ2lzdGVyLXRhYi0xJykuaGlkZSgpO1xyXG4gICAgJChcIi5iZWxvdy1yZWdpc3Rlci1mb3JtIC50YWItY29udGVudHMgLnRhYi1jb250ZW50W2RhdGEtcmVsPScjcmVnaXN0ZXItdGFiLTEnXVwiKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cclxuICAgICQoJy5iZWxvdy1yZWdpc3Rlci1mb3JtICNyZWdpc3Rlci10YWItMicpLmFkZENsYXNzKCdhY3RpdmUnKS5zaG93KCk7XHJcbiAgICAkKFwiLmJlbG93LXJlZ2lzdGVyLWZvcm0gLnRhYi1jb250ZW50cyAudGFiLWNvbnRlbnRbZGF0YS1yZWw9JyNyZWdpc3Rlci10YWItMiddXCIpLmFkZENsYXNzKCdvcGVuJyk7XHJcblxyXG4gICAgJCgnLmJlbG93LXJlZ2lzdGVyLWZvcm0nKS5zaG93KCk7XHJcblxyXG4gICAgJCgnaGVhZGVyIC5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS5sb2dnZWQtaW4gLnVzZXItZmlyc3RuYW1lLCBoZWFkZXIgLmhlYWRlcl9fcHJpbWFyeUxpbmtzIC51c2VyLWZpcnN0bmFtZScpLnRleHQodG9rZW5EYXRhLm5hbWUpO1xyXG4gICAgJCgnaGVhZGVyIC5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS5sb2dnZWQtaW4sIGhlYWRlciAuaGVhZGVyX19wcmltYXJ5TGlua3MubG9nZ2VkLWluJykuc2hvdygpO1xyXG4gICAgJCgnLmZvb3RlciAubG9nb3V0LWxpbmtzJykuc2hvdygpO1xyXG5cclxuICAgICQoJy5jb21wZXRpdGlvbkRhdGFDYXB0dXJlLmxvZ2dlZC1pbicpLnNob3coKTtcclxuICAgICQoJy5jb21wZXRpdGlvbkRhdGFDYXB0dXJlLmxvZ2dlZC1pbiAubG9nZ2VkaW4tbmFtZScpLnRleHQodG9rZW5EYXRhLm5hbWUpO1xyXG4gICAgJCgnLmN0YS10aGlyZC1wYW5lbC1sb2dnZWRpbicpLnNob3coKTtcclxuXHJcbiAgICAkKCcuZ2F0ZWQnKS5hZGRDbGFzcygndW5sb2NrZWQnKS5yZW1vdmVDbGFzcygnbG9ja2VkJykuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgJChpdGVtKS5jbG9zZXN0KCdib2R5JykuZmluZCgnLmhlcm8gLmhlcm9fX2N0YS0tZ3JleScpLnNob3coKTtcclxuICAgIH0pO1xyXG4gICAgJCgnLmdhdGVkLWhpZGUnKS5hZGRDbGFzcygndW5sb2NrZWQnKS5yZW1vdmVDbGFzcygnbG9ja2VkJyk7XHJcblxyXG4gICAgJCgnLmFydGljbGVHcmlkIC5hcnRpY2xlLWdyaWQtaXRlbS1sb2dnZWRpbicpLnNob3coKTtcclxuXHJcbiAgICBpZiAodG9rZW5EYXRhLmZ1bGwgPT09IGZhbHNlKSB7XHJcbiAgICAgICQoJy5jcmVhdGUtcGFzc3dvcmQnKS5maW5kKCcuY3JlYXRlLXBhc3N3b3JkLW5hbWUnKS50ZXh0KHRva2VuRGF0YS5uYW1lKTtcclxuICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3Nob3cuQ3JlYXRlUGFzc3dvcmRNb2RhbC5ESEwnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJCgnLnJlc2V0LXBhc3N3b3JkLWNvbnRhaW5lcicpLmxlbmd0aCA+IDApIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5nZXRQYXRoSG9tZSgpICsgJy5odG1sJztcclxuICAgIH1cclxuICAgIGlmICgkKCcucGFnZS1ib2R5LnJlZ2lzdGVyJykubGVuZ3RoID4gMCkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGlzLmdldFBhdGhIb21lKCkgKyAnL3lvdXItYWNjb3VudC5odG1sJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJCgnLmdhdGluZ0FydGljbGVfX2FjdGlvbnMubG9nZ2VkLWluJykubGVuZ3RoID4gMCkge1xyXG4gICAgICB2YXIgZ2F0aW5nQXJ0aWNsZUVsbTEgPSAkKCcuZ2F0aW5nQXJ0aWNsZV9fYWN0aW9ucy5sb2dnZWQtaW4nKTtcclxuXHJcbiAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxEb3dubG9hZEFzc2V0LFxyXG4gICAgICAgICAgZGF0YTogeyBhc3NldGluZm86IGdhdGluZ0FydGljbGVFbG0xLmRhdGEoJ2Fzc2V0aW5mbycpIH0sXHJcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICBnYXRpbmdBcnRpY2xlRWxtMS5maW5kKCcuZ2F0aW5nQXJ0aWNsZV9fYnV0dG9uJykuYXR0cignaHJlZicsIHJlc3BvbnNlLmhyZWYpO1xyXG4gICAgICAgICAgICAgIGdhdGluZ0FydGljbGVFbG0xLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJCgnI2Rvd25sb2FkIC5ESExkb3dubG9hZF9fY3Rhcy5sb2dnZWQtaW4nKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHZhciBnYXRpbmdBcnRpY2xlRWxtMiA9ICQoJyNkb3dubG9hZCAuREhMZG93bmxvYWRfX2N0YXMubG9nZ2VkLWluJyk7XHJcblxyXG4gICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsRG93bmxvYWRBc3NldCxcclxuICAgICAgICAgIGRhdGE6IHsgYXNzZXRpbmZvOiBnYXRpbmdBcnRpY2xlRWxtMi5kYXRhKCdhc3NldGluZm8nKSB9LFxyXG4gICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgZ2F0aW5nQXJ0aWNsZUVsbTIuZmluZCgnLkRITGRvd25sb2FkX19jdGEtLXJlZCcpLmF0dHIoJ2hyZWYnLCByZXNwb25zZS5ocmVmKTtcclxuICAgICAgICAgICAgICBnYXRpbmdBcnRpY2xlRWxtMi5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzaG93Tm90TG9nZ2VkSW5FbGVtZW50cygpIHtcclxuICAgICQoJy5iZWxvdy1yZWdpc3Rlci1mb3JtIC50YWItY29udGFpbmVyICNyZWdpc3Rlci10YWItMScpLmFkZENsYXNzKCdhY3RpdmUnKS5zaG93KCk7XHJcbiAgICAkKFwiLmJlbG93LXJlZ2lzdGVyLWZvcm0gLnRhYi1jb250ZW50cyAudGFiLWNvbnRlbnRbZGF0YS1yZWw9JyNyZWdpc3Rlci10YWItMSddXCIpLmFkZENsYXNzKCdvcGVuJyk7XHJcblxyXG4gICAgJCgnLmJlbG93LXJlZ2lzdGVyLWZvcm0gI3JlZ2lzdGVyLXRhYi0yJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpLnNob3coKTtcclxuICAgICQoXCIuYmVsb3ctcmVnaXN0ZXItZm9ybSAudGFiLWNvbnRlbnRzIC50YWItY29udGVudFtkYXRhLXJlbD0nI3JlZ2lzdGVyLXRhYi0yJ11cIikucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICAkKCcuYmVsb3ctcmVnaXN0ZXItZm9ybScpLnNob3coKTtcclxuXHJcbiAgICAkKCdoZWFkZXIgLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtLmxvZ2dlZC1vdXQsIGhlYWRlciAuaGVhZGVyX19wcmltYXJ5TGlua3MubG9nZ2VkLW91dCcpLnNob3coKTtcclxuICAgICQoJy5mb290ZXIgLmxvZ2luLWxpbmtzJykuc2hvdygpO1xyXG5cclxuICAgICQoJy5nYXRpbmdBcnRpY2xlX19hY3Rpb25zLm5vLWxvZ2dlZC1pbicpLnNob3coKTtcclxuICAgICQoJyNkb3dubG9hZCAuREhMZG93bmxvYWRfX2N0YXMubm8tbG9nZ2VkLWluJykuc2hvdygpO1xyXG4gICAgJCgnLmNvbXBldGl0aW9uRGF0YUNhcHR1cmUubm90LWxvZ2dlZC1pbicpLnNob3coKTtcclxuICAgICQoJy5hcnRpY2xlLXBhZ2UtbG9naW4tY3RhJykuc2hvdygpO1xyXG5cclxuICAgICQoJy5nYXRlZCcpLmFkZENsYXNzKCdsb2NrZWQnKS5yZW1vdmVDbGFzcygndW5sb2NrZWQnKS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xyXG4gICAgICAkKGl0ZW0pLmNsb3Nlc3QoJ2JvZHknKS5maW5kKCcuaGVybyAuaGVyb19fY3RhLS1ncmV5JykuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgICAkKCcuZ2F0ZWQtaGlkZScpLmFkZENsYXNzKCdsb2NrZWQnKS5yZW1vdmVDbGFzcygndW5sb2NrZWQnKTtcclxuXHJcbiAgICB2YXIgbmV3c2xldHRlckNvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLk5ld3NsZXR0ZXJTdWJzY3JpYmVkJyk7XHJcbiAgICBpZiAobmV3c2xldHRlckNvb2tpZSAhPT0gbnVsbCkge1xyXG4gICAgICAkKCcuYXJ0aWNsZUdyaWQgLmFydGljbGUtZ3JpZC1pdGVtLWxvZ2dlZGluJykuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnLmFydGljbGVHcmlkIC5hcnRpY2xlLWdyaWQtaXRlbS1zdWJzY3JpYmUnKS5zaG93KCk7XHJcbiAgICAgICQoJy5zdWJzY3JpYmVQYW5lbCcpLnNob3coKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBBdXRoZW50aWNhdGlvbkV2ZW50cygpO1xyXG4iLCJjbGFzcyBCYWNrQnV0dG9uIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuYmFja0J1dHRvbicsXHJcbiAgICAgIGJhY2tCdXR0b246ICcuYmFja0J1dHRvbl9fYnV0dG9uLS1iYWNrJyxcclxuICAgICAgZm9yd2FyZEJ1dHRvbjogJy5iYWNrQnV0dG9uX19idXR0b24tLWZvcndhcmQnXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zaG93QnV0dG9uID0gdGhpcy5zaG93QnV0dG9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ29CYWNrID0gdGhpcy5nb0JhY2suYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ29Gb3J3YXJkID0gdGhpcy5nb0ZvcndhcmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdEhlYWRyb29tID0gdGhpcy5pbml0SGVhZHJvb20uYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIHNob3dCdXR0b24oKSB7XHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2JhY2tCdXR0b24tLXNob3cnKTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5iYWNrQnV0dG9uLCB0aGlzLmdvQmFjayk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5mb3J3YXJkQnV0dG9uLCB0aGlzLmdvRm9yd2FyZCk7XHJcbiAgfVxyXG5cclxuICBnb0JhY2soZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgaGlzdG9yeS5iYWNrKC0xKTtcclxuICB9XHJcblxyXG4gIGdvRm9yd2FyZChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBoaXN0b3J5LmZvcndhcmQoKTtcclxuICB9XHJcblxyXG4gIGluaXRIZWFkcm9vbSgpIHtcclxuICAgIGxldCBjb21wb25lbnQgPSAkKHRoaXMuc2VsLmNvbXBvbmVudClbMF07XHJcbiAgICBsZXQgaGVhZHJvb20gID0gbmV3IEhlYWRyb29tKGNvbXBvbmVudCwge1xyXG4gICAgICBjbGFzc2VzOiB7XHJcbiAgICAgICAgaW5pdGlhbDogJ2JhY2tCdXR0b24nLFxyXG4gICAgICAgIHBpbm5lZDogJ2JhY2tCdXR0b24tLXBpbm5lZCcsXHJcbiAgICAgICAgdW5waW5uZWQ6ICdiYWNrQnV0dG9uLS11bnBpbm5lZCcsXHJcbiAgICAgICAgdG9wOiAnYmFja0J1dHRvbi0tdG9wJyxcclxuICAgICAgICBub3RUb3A6ICdiYWNrQnV0dG9uLS1ub3QtdG9wJyxcclxuICAgICAgICBib3R0b206ICdiYWNrQnV0dG9uLS1ib3R0b20nLFxyXG4gICAgICAgIG5vdEJvdHRvbTogJ2JhY2tCdXR0b24tLW5vdC1ib3R0b20nXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaGVhZHJvb20uaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGxldCBzdGFuZGFsb25lID0gKHdpbmRvdy5tYXRjaE1lZGlhKCcoZGlzcGxheS1tb2RlOiBzdGFuZGFsb25lKScpLm1hdGNoZXMpIHx8ICh3aW5kb3cubmF2aWdhdG9yLnN0YW5kYWxvbmUpO1xyXG4gICAgaWYgKCFzdGFuZGFsb25lKSByZXR1cm47XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHRoaXMuc2hvd0J1dHRvbigpO1xyXG4gICAgdGhpcy5pbml0SGVhZHJvb20oKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBCYWNrQnV0dG9uKCk7XHJcbiIsImNsYXNzIEJvb3RzdHJhcENhcm91c2VsIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuY2Fyb3VzZWwnLFxyXG4gICAgICBpdGVtczogJy5jYXJvdXNlbC1pdGVtJyxcclxuICAgICAgbGluazogJy5jYXRlZ29yeUhlcm9fX2xpbmsnXHJcbiAgICB9O1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoZWNrTnVtYmVyU2xpZGVzID0gdGhpcy5jaGVja051bWJlclNsaWRlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50b3VjaFN3aXBlQ2Fyb3VzZWwgPSB0aGlzLnRvdWNoU3dpcGVDYXJvdXNlbC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tOdW1iZXJTbGlkZXMoKSB7XHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZWFjaCgoaW5kZXgsICRlbG0pID0+IHtcclxuICAgICAgaWYgKCQoJGVsbSkuZmluZCh0aGlzLnNlbC5pdGVtcykubGVuZ3RoIDw9IDEpIHtcclxuICAgICAgICAkKCRlbG0pLmFkZENsYXNzKCdzdGF0aWMnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0b3VjaFN3aXBlQ2Fyb3VzZWwoKSB7XHJcbiAgICBsZXQgaXNTd2lwZSA9IGZhbHNlO1xyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnN3aXBlKHtcclxuICAgICAgc3dpcGU6IChldmVudCwgZGlyZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgbGV0ICRjYXJvdXNlbCA9ICgkKGV2ZW50LnRhcmdldCkuaXModGhpcy5zZWwuY29tcG9uZW50KSA/ICQoZXZlbnQudGFyZ2V0KSA6ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKHRoaXMuc2VsLmNvbXBvbmVudCkpO1xyXG4gICAgICAgIGlzU3dpcGUgPSB0cnVlO1xyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xyXG4gICAgICAgICAgJGNhcm91c2VsLmNhcm91c2VsKCduZXh0Jyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuICAgICAgICAgICRjYXJvdXNlbC5jYXJvdXNlbCgncHJldicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgdGFwOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAvLyB0YXJnZXQgdmFyaWFibGUgcmVwcmVzZW50cyB0aGUgY2xpY2tlZCBvYmplY3RcclxuICAgICAgICBpZiAoJCgnLmNhdGVnb3J5SGVyb19fbGluaycpLmxlbmd0aCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8IDk5Mikge1xyXG4gICAgICAgICAgbGV0IGhyZWYgPSAkKGV2ZW50LnRhcmdldCkucGFyZW50cygnLmNhdGVnb3J5SGVyb19fbGluaycpLmZpcnN0KCkuYXR0cignZGF0YS1ocmVmJyk7XHJcbiAgICAgICAgICBpZiAoaHJlZiAhPT0gJycpIHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gaHJlZjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGFsbG93UGFnZVNjcm9sbDogJ3ZlcnRpY2FsJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCh0aGlzLnNlbC5saW5rKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghaXNTd2lwZSkge1xyXG4gICAgICAgIGxldCBocmVmID0gJCh0aGlzKS5hdHRyKCdkYXRhLWhyZWYnKTtcclxuICAgICAgICBpZiAoaHJlZiAhPT0gJycpIHtcclxuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGhyZWY7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlzU3dpcGUgPSBmYWxzZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMudG91Y2hTd2lwZUNhcm91c2VsKCk7XHJcbiAgICB0aGlzLmNoZWNrTnVtYmVyU2xpZGVzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBCb290c3RyYXBDYXJvdXNlbCgpO1xyXG4iLCJjbGFzcyBDb21wZXRpdGlvbkZvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jb25maWcgPSB7XHJcbiAgICAgIHVybFRva2VuOiAnL2xpYnMvZ3Jhbml0ZS9jc3JmL3Rva2VuLmpzb24nLFxyXG4gICAgICB1cmxSZWZyZXNoQ2hlY2s6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcclxuICAgICAgdXJsR2V0QWxsRGV0YWlsczogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9nZXRkZXRhaWxzL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxDb21wZXRpdGlvbjogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9jb21wZXRpdGlvbi9pbmRleC5qc29uJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLmNvbXBldGl0aW9uRGF0YUNhcHR1cmUgZm9ybSdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZWFkQ29va2llID0gdGhpcy5yZWFkQ29va2llLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMudHJ5Q29tcGV0aXRpb25FbnRyeUxvZ2dlZEluID0gdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4uYmluZCh0aGlzKTtcclxuICAgIHRoaXMudHJ5Q29tcGV0aXRpb25FbnRyeU5vdExvZ2dlZEluID0gdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5Tm90TG9nZ2VkSW4uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY29tcGxldGVDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4gPSB0aGlzLmNvbXBsZXRlQ29tcGV0aXRpb25FbnRyeUxvZ2dlZEluLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gIH1cclxuXHJcbiAgZ2V0UGF0aFByZWZpeCgpIHtcclxuICAgIGNvbnN0IHByZWZpeCA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLXByZWZpeFxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XHJcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcclxuICB9XHJcblxyXG4gIHJlYWRDb29raWUobmFtZSkge1xyXG4gICAgdmFyIG5hbWVFUSA9IG5hbWUgKyAnPSc7XHJcbiAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGMgPSBjYVtpXTtcclxuICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XHJcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHRoaXMudmFsaWRhdGUoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGUoKSB7XHJcbiAgICB2YXIgY29tcGV0aXRpb25FbnRyeSA9ICQodGhpcy5zZWwuY29tcG9uZW50KTtcclxuXHJcbiAgICBpZiAoY29tcGV0aXRpb25FbnRyeS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGNvbXBldGl0aW9uRW50cnkuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgICBpZiAoJChpdGVtKS5jbG9zZXN0KCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZScpLmhhc0NsYXNzKCdub3QtbG9nZ2VkLWluJykpIHtcclxuICAgICAgICAgICQoaXRlbSkudmFsaWRhdGUoe1xyXG4gICAgICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICAgIHJlZ2lzdGVyX195b3VyRW1haWw6ICdlbWFpbCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VibWl0SGFuZGxlcjogKGZvcm0pID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLnRyeUNvbXBldGl0aW9uRW50cnlOb3RMb2dnZWRJbihmb3JtKTtcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGl0ZW0pLnZhbGlkYXRlKHtcclxuICAgICAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VibWl0SGFuZGxlcjogKGZvcm0pID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLnRyeUNvbXBldGl0aW9uRW50cnlMb2dnZWRJbihmb3JtKTtcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgdHJ5Q29tcGV0aXRpb25FbnRyeU5vdExvZ2dlZEluKGZvcm0pIHtcclxuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xyXG5cclxuICAgIHZhciBkYXRhID0geyB9O1xyXG4gICAgaWYgKGZybS5maW5kKCcuY29tcC1hbnN3ZXInKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgdmFyIGFuc3dlciA9IGZybS5maW5kKFwiaW5wdXRbdHlwZT0ncmFkaW8nXTpjaGVja2VkXCIpLnZhbCgpO1xyXG4gICAgICBpZiAoYW5zd2VyID09PSBudWxsIHx8IGFuc3dlci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBhbGVydCgnUGxlYXNlIHNlbGVjdCBhbiBvcHRpb24nKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgZmlyc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2ZpcnN0TmFtZScpLnZhbCgpLFxyXG4gICAgICAgIGxhc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2xhc3ROYW1lJykudmFsKCksXHJcbiAgICAgICAgZW1haWw6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9feW91ckVtYWlsJykudmFsKCksXHJcblxyXG4gICAgICAgIHBvc2l0aW9uOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3Bvc2l0aW9uJykudmFsKCksXHJcbiAgICAgICAgY29udGFjdDogZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX19jb250YWN0TnVtYmVyJykudmFsKCksXHJcbiAgICAgICAgc2l6ZTogZnJtLmZpbmQoJ3NlbGVjdCNyZWdpc3Rlcl9fYnVzaW5lc3NTaXplJykudmFsKCksXHJcbiAgICAgICAgc2VjdG9yOiBmcm0uZmluZCgnc2VsZWN0I3JlZ2lzdGVyX19idXNpbmVzc1NlY3RvcicpLnZhbCgpLFxyXG5cclxuICAgICAgICBwYXRoOiBmcm0uZGF0YSgncGF0aCcpLFxyXG4gICAgICAgIGFuc3dlcjogYW5zd2VyXHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkYXRhID0ge1xyXG4gICAgICAgIGZpcnN0bmFtZTogZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX19maXJzdE5hbWUnKS52YWwoKSxcclxuICAgICAgICBsYXN0bmFtZTogZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX19sYXN0TmFtZScpLnZhbCgpLFxyXG4gICAgICAgIGVtYWlsOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3lvdXJFbWFpbCcpLnZhbCgpLFxyXG5cclxuICAgICAgICBwb3NpdGlvbjogZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX19wb3NpdGlvbicpLnZhbCgpLFxyXG4gICAgICAgIGNvbnRhY3Q6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fY29udGFjdE51bWJlcicpLnZhbCgpLFxyXG4gICAgICAgIHNpemU6IGZybS5maW5kKCdzZWxlY3QjcmVnaXN0ZXJfX2J1c2luZXNzU2l6ZScpLnZhbCgpLFxyXG4gICAgICAgIHNlY3RvcjogZnJtLmZpbmQoJ3NlbGVjdCNyZWdpc3Rlcl9fYnVzaW5lc3NTZWN0b3InKS52YWwoKSxcclxuXHJcbiAgICAgICAgcGF0aDogZnJtLmRhdGEoJ3BhdGgnKVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgZnJtLmZpbmQoJy5jb21wLWFuc3dlcicpLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgdmFyIHZhbCA9ICQoaXRlbSkudmFsKCk7XHJcbiAgICAgICAgaWYgKCQoaXRlbSkuZGF0YSgnaW5kZXgnKSA9PT0gMSkge1xyXG4gICAgICAgICAgZGF0YS5hbnN3ZXIgPSB2YWw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRhdGFbJ2Fuc3dlcicgKyAkKGl0ZW0pLmRhdGEoJ2luZGV4JyldID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoKCQudHJpbShkYXRhLmZpcnN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEubGFzdG5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShkYXRhLmVtYWlsKS5sZW5ndGggPT09IDApKSB7XHJcbiAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgeW91ciBuYW1lLCBlbWFpbCBhZGRyZXNzIGFuZCBjb21wZXRpdGlvbiBkZXRhaWxzLicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybENvbXBldGl0aW9uLFxyXG4gICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vZGFsID0gZnJtLmNsb3Nlc3QoJy5jb21wZXRpdGlvbi1jb250YWluZXInKS5maW5kKCcubW9kYWwnKTtcclxuICAgICAgICAgICAgICAgIG1vZGFsLmZpbmQoJy50aGFua3MtbmFtZScpLnRleHQoZGF0YS5maXJzdG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgLy8gbW9kYWwubW9kYWwoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgIG1vZGFsLnNob3coKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZybS5jbG9zZXN0KCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZScpLmhpZGUoKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLlxcbicgKyByZXNwb25zZS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgnRW50ZXIgdGhlIGNvbXBldGl0aW9uJyk7XHJcbiAgICAgICAgICAgIGZybS5maW5kKFwiaW5wdXRbdHlwZT0nc3VibWl0J11cIikudmFsKCdFbnRlciB0aGUgY29tcGV0aXRpb24nKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0cnlDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4oZm9ybSkge1xyXG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XHJcbiAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgdmFyIGNvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLkF1dGhUb2tlbicpO1xyXG4gICAgaWYgKGNvb2tpZSAhPT0gbnVsbCkge1xyXG4gICAgICB2YXIgc3BsaXQgPSBjb29raWUuc3BsaXQoJ3wnKTtcclxuICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybEdldEFsbERldGFpbHMsXHJcbiAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHNwbGl0WzBdLCB0b2tlbjogc3BsaXRbMV0gfSxcclxuICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChhbGxEZXRhaWxzUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNvbXBsZXRlQ29tcGV0aXRpb25FbnRyeUxvZ2dlZEluKGZvcm0sIGFsbERldGFpbHNSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIHJlZnJlc2hDb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nKTtcclxuICAgICAgaWYgKHJlZnJlc2hDb29raWUgIT09IG51bGwpIHtcclxuICAgICAgICB2YXIgcmVmcmVzaFNwbGl0ID0gcmVmcmVzaENvb2tpZS5zcGxpdCgnfCcpO1xyXG4gICAgICAgIGlmIChyZWZyZXNoU3BsaXQubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxSZWZyZXNoQ2hlY2ssXHJcbiAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogcmVmcmVzaFNwbGl0WzBdLCByZWZyZXNoX3Rva2VuOiByZWZyZXNoU3BsaXRbMV0gfSxcclxuICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgc3VjY2VzczogKHJlZnJlc2hSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyByZWZyZXNoUmVzcG9uc2UsIHRydWUgXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4oZm9ybSk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbXBsZXRlQ29tcGV0aXRpb25FbnRyeUxvZ2dlZEluKGZvcm0sIGRldGFpbHMpIHtcclxuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xyXG5cclxuICAgIHZhciBhbnN3ZXIgPSAnJztcclxuICAgIGlmIChmcm0uZmluZCgnLmNvbXAtYW5zd2VyJykubGVuZ3RoID4gMCkge1xyXG4gICAgICBhbnN3ZXIgPSBmcm0uZmluZCgnLmNvbXAtYW5zd2VyJykudmFsKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhbnN3ZXIgPSBmcm0uZmluZChcImlucHV0W3R5cGU9J3JhZGlvJ106Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgICAgaWYgKGFuc3dlciA9PT0gbnVsbCB8fCBhbnN3ZXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgYWxlcnQoJ1BsZWFzZSBzZWxlY3QgYW4gb3B0aW9uJyk7XHJcbiAgICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgnRW50ZXIgdGhlIGNvbXBldGl0aW9uICcgKyBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9maXJzdG5hbWUpO1xyXG4gICAgICAgIGZybS5maW5kKFwiaW5wdXRbdHlwZT0nc3VibWl0J11cIikudmFsKCdFbnRlciB0aGUgY29tcGV0aXRpb24gJyArIGRldGFpbHMucmVnaXN0cmF0aW9uX2ZpcnN0bmFtZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIGZpcnN0bmFtZTogZGV0YWlscy5yZWdpc3RyYXRpb25fZmlyc3RuYW1lLFxyXG4gICAgICBsYXN0bmFtZTogZGV0YWlscy5yZWdpc3RyYXRpb25fbGFzdG5hbWUsXHJcbiAgICAgIGVtYWlsOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9lbWFpbCxcclxuXHJcbiAgICAgIHBvc2l0aW9uOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9wb3NpdGlvbixcclxuICAgICAgY29udGFjdDogZGV0YWlscy5yZWdpc3RyYXRpb25fY29udGFjdCxcclxuICAgICAgc2l6ZTogZGV0YWlscy5yZWdpc3RyYXRpb25fc2l6ZSxcclxuICAgICAgc2VjdG9yOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9zZWN0b3IsXHJcblxyXG4gICAgICBwYXRoOiBmcm0uZGF0YSgncGF0aCcpLFxyXG4gICAgICBhbnN3ZXI6IGFuc3dlclxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoKCQudHJpbShkYXRhLmFuc3dlcikubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEuZmlyc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS5sYXN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEuZW1haWwpLmxlbmd0aCA9PT0gMCkpIHtcclxuICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciB5b3VyIG5hbWUsIGVtYWlsIGFkZHJlc3MgYW5kIGNvbXBldGl0aW9uIGRldGFpbHMuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgICBmcm0uZmluZChcImlucHV0W3R5cGU9J3N1Ym1pdCddXCIpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcclxuXHJcbiAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxDb21wZXRpdGlvbixcclxuICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtb2RhbCA9IGZybS5jbG9zZXN0KCcuY29tcGV0aXRpb24tY29udGFpbmVyJykuZmluZCgnLm1vZGFsJyk7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCcudGhhbmtzLW5hbWUnKS50ZXh0KGRhdGEuZmlyc3RuYW1lKTtcclxuICAgICAgICAgICAgICAgIC8vIG1vZGFsLm1vZGFsKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5zaG93KCkuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmcm0uY2xvc2VzdCgnLmNvbXBldGl0aW9uRGF0YUNhcHR1cmUnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0VudGVyIHRoZSBjb21wZXRpdGlvbiAnICsgZGF0YS5maXJzdG5hbWUpO1xyXG4gICAgICAgICAgICBmcm0uZmluZChcImlucHV0W3R5cGU9J3N1Ym1pdCddXCIpLnZhbCgnRW50ZXIgdGhlIGNvbXBldGl0aW9uICcgKyBkYXRhLmZpcnN0bmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0VudGVyIHRoZSBjb21wZXRpdGlvbicpO1xyXG4gICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ0VudGVyIHRoZSBjb21wZXRpdGlvbicpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IENvbXBldGl0aW9uRm9ybSgpO1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgSURCOiB7XHJcbiAgICBEQjogJ29mZmxpbmUtYXJ0aWNsZXMnLFxyXG4gICAgQVJUSUNMRVNfU1RPUkU6ICdhcnRpY2xlcydcclxuICB9XHJcbn07XHJcbiIsImNsYXNzIENvb2tpZUJhbm5lciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLmNvb2tpZS1iYW5uZXInLFxyXG4gICAgICBjbG9zZUJ1dHRvbjogJy5jb29raWUtYmFubmVyX19idXR0b24nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuY29va2llTmFtZSA9ICdkaGwtY29va2llLXdhcm5pbmcnO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmhpZGVDb29raWVCYW5uZXIgPSB0aGlzLmhpZGVDb29raWVCYW5uZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd0Nvb2tpZUJhbm5lciA9IHRoaXMuc2hvd0Nvb2tpZUJhbm5lci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kaXNwbGF5QmFubmVyID0gdGhpcy5kaXNwbGF5QmFubmVyLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICB0aGlzLmRpc3BsYXlCYW5uZXIoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNsb3NlQnV0dG9uLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuaGlkZUNvb2tpZUJhbm5lcigpO1xyXG4gICAgICBDb29raWVzLnNldCh0aGlzLmNvb2tpZU5hbWUsIHtzZWVuOiAxfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRpc3BsYXlCYW5uZXIoKSB7XHJcbiAgICBsZXQgY29va2llID0gQ29va2llcy5nZXQodGhpcy5jb29raWVOYW1lKTtcclxuXHJcbiAgICBpZiAodHlwZW9mIGNvb2tpZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGhpcy5zaG93Q29va2llQmFubmVyKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzaG93Q29va2llQmFubmVyKCkge1xyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdjb29raWUtYmFubmVyLS1kaXNwbGF5Jyk7XHJcbiAgfVxyXG5cclxuICBoaWRlQ29va2llQmFubmVyKCkge1xyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnJlbW92ZUNsYXNzKCdjb29raWUtYmFubmVyLS1kaXNwbGF5Jyk7XHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkucmVtb3ZlKCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgQ29va2llQmFubmVyKCk7XHJcbiIsImltcG9ydCBDb25zdGFudHMgZnJvbSAnLi9Db25zdGFudHMnO1xyXG5cclxuY2xhc3MgRGF0YWJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5kYXRhYmFzZSA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5pbml0aWF0ZURiID0gdGhpcy5pbml0aWF0ZURiLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmFkZEFydGljbGUgPSB0aGlzLmFkZEFydGljbGUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZGVsZXRlQXJ0aWNsZSA9IHRoaXMuZGVsZXRlQXJ0aWNsZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRBcnRpY2xlcyA9IHRoaXMuZ2V0QXJ0aWNsZXMuYmluZCh0aGlzKTtcclxuXHJcbiAgICAvLyBDcmVhdGUvZ2V0IERCXHJcbiAgICBpZiAod2luZG93LlByb21pc2UpIHtcclxuICAgICAgdGhpcy5pbml0aWF0ZURiKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0aWF0ZURiKCkge1xyXG4gICAgdGhpcy5kYXRhYmFzZSA9IGlkYi5vcGVuKENvbnN0YW50cy5JREIuREIsIDEsICh1cGdyYWRlRGIpID0+IHtcclxuICAgICAgaWYgKCF1cGdyYWRlRGIub2JqZWN0U3RvcmVOYW1lcy5jb250YWlucyhDb25zdGFudHMuSURCLkFSVElDTEVTX1NUT1JFKSkge1xyXG4gICAgICAgIGxldCBhcnRpY2xlT1MgPSB1cGdyYWRlRGIuY3JlYXRlT2JqZWN0U3RvcmUoQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRSwge1xyXG4gICAgICAgICAga2V5UGF0aDogJ2xpbmsnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCd0aXRsZScsICd0aXRsZScsIHt1bmlxdWU6IGZhbHNlfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdsaW5rJywgJ2xpbmsnLCB7dW5pcXVlOiB0cnVlfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdkZXNjcmlwdGlvbicsICdkZXNjcmlwdGlvbicsIHt1bmlxdWU6IGZhbHNlfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdjYXRlZ29yeU5hbWUnLCAnY2F0ZWdvcnlOYW1lJywge3VuaXF1ZTogZmFsc2V9KTtcclxuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2NhdGVnb3J5TGluaycsICdjYXRlZ29yeUxpbmsnLCB7dW5pcXVlOiBmYWxzZX0pO1xyXG4gICAgICAgIGFydGljbGVPUy5jcmVhdGVJbmRleCgndGltZVRvUmVhZCcsICd0aW1lVG9SZWFkJywge3VuaXF1ZTogZmFsc2V9KTtcclxuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2ltYWdlTW9iaWxlJywgJ2ltYWdlTW9iaWxlJywge3VuaXF1ZTogZmFsc2V9KTtcclxuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2ltYWdlRGVza3RvcCcsICdpbWFnZURlc2t0b3AnLCB7dW5pcXVlOiBmYWxzZX0pO1xyXG4gICAgICAgIGFydGljbGVPUy5jcmVhdGVJbmRleCgnaXNMYXJnZScsICdpc0xhcmdlJywge3VuaXF1ZTogZmFsc2V9KTtcclxuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2lzVmlkZW8nLCAnaXNWaWRlbycsIHt1bmlxdWU6IGZhbHNlfSk7XHJcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdjYWNoZU5hbWUnLCAnY2FjaGVOYW1lJywge3VuaXF1ZTogZmFsc2V9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkZWxldGVBcnRpY2xlKGxpbmspIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFiYXNlLnRoZW4oKGRiKSA9PiB7XHJcbiAgICAgIGxldCB0cmFuc2FjdGlvbiA9IGRiLnRyYW5zYWN0aW9uKFtDb25zdGFudHMuSURCLkFSVElDTEVTX1NUT1JFXSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgICBsZXQgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShDb25zdGFudHMuSURCLkFSVElDTEVTX1NUT1JFKTtcclxuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcclxuICAgICAgICBzdG9yZS5kZWxldGUobGluayksXHJcbiAgICAgICAgdHJhbnNhY3Rpb24uY29tcGxldGVcclxuICAgICAgXSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZEFydGljbGUodGl0bGUsIGxpbmssIGRlc2NyaXB0aW9uLCBjYXRlZ29yeU5hbWUsIGNhdGVnb3J5TGluaywgdGltZVRvUmVhZCwgaW1hZ2VNb2JpbGUsIGltYWdlRGVza3RvcCwgaXNMYXJnZSwgaXNWaWRlbywgY2FjaGVOYW1lKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZS50aGVuKChkYikgPT4ge1xyXG4gICAgICBsZXQgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihbQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRV0sICdyZWFkd3JpdGUnKTtcclxuICAgICAgbGV0IHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRSk7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgc3RvcmUuYWRkKHtcclxuICAgICAgICAgIHRpdGxlLFxyXG4gICAgICAgICAgbGluayxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgY2F0ZWdvcnlOYW1lLFxyXG4gICAgICAgICAgY2F0ZWdvcnlMaW5rLFxyXG4gICAgICAgICAgdGltZVRvUmVhZCxcclxuICAgICAgICAgIGltYWdlTW9iaWxlLFxyXG4gICAgICAgICAgaW1hZ2VEZXNrdG9wLFxyXG4gICAgICAgICAgaXNMYXJnZSxcclxuICAgICAgICAgIGlzVmlkZW8sXHJcbiAgICAgICAgICBjYWNoZU5hbWVcclxuICAgICAgICB9KSxcclxuICAgICAgICB0cmFuc2FjdGlvbi5jb21wbGV0ZVxyXG4gICAgICBdKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXJ0aWNsZXMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZS50aGVuKChkYikgPT4ge1xyXG4gICAgICBsZXQgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihbQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRV0sICdyZWFkb25seScpO1xyXG4gICAgICBsZXQgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShDb25zdGFudHMuSURCLkFSVElDTEVTX1NUT1JFKTtcclxuICAgICAgcmV0dXJuIHN0b3JlLmdldEFsbCgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgRGF0YWJhc2UoKTtcclxuIiwiY2xhc3MgRGVsZXRlQWNjb3VudEZvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jb25maWcgPSB7XHJcbiAgICAgIHVybFRva2VuOiAnL2xpYnMvZ3Jhbml0ZS9jc3JmL3Rva2VuLmpzb24nLFxyXG4gICAgICB1cmxSZWZyZXNoQ2hlY2s6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcclxuICAgICAgdXJsR2V0QWxsRGV0YWlsczogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9nZXRkZXRhaWxzL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxEZWxldGVBY2NvdW50OiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL2RlbGV0ZWFjY291bnQvaW5kZXguanNvbidcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5kZWxldGUtYWNjb3VudCdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldFBhdGhIb21lID0gdGhpcy5nZXRQYXRoSG9tZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVhZENvb2tpZSA9IHRoaXMucmVhZENvb2tpZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jbGVhckNvb2tpZSA9IHRoaXMuY2xlYXJDb29raWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY3JlYXRlQ29va2llID0gdGhpcy5jcmVhdGVDb29raWUuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnRyeURlbGV0ZUFjY291bnQgPSB0aGlzLnRyeURlbGV0ZUFjY291bnQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY29tcGxldGVEZWxldGVBY2NvdW50ID0gdGhpcy5jb21wbGV0ZURlbGV0ZUFjY291bnQuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmxvZ2dlZEluID0gdGhpcy5sb2dnZWRJbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5ub3RMb2dnZWRJbiA9IHRoaXMubm90TG9nZ2VkSW4uYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldFBhdGhQcmVmaXgoKSB7XHJcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xyXG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoSG9tZSgpIHtcclxuICAgIGNvbnN0IGhvbWUgPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1ob21lXFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAoaG9tZSA/IGhvbWUgOiAnJyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgncGFzc3dvcmQnLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJChlbGVtZW50KS5hdHRyKCdwYXR0ZXJuJykpLnRlc3QodmFsdWUpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkIGZvcm1hdCBpcyBub3QgdmFsaWQnKTtcclxuXHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnZXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICByZXR1cm4gKCQoJyMnICsgJChlbGVtZW50KS5hdHRyKCdkYXRhLWVxdWFsVG8nKSkudmFsKCkgPT09ICQoZWxlbWVudCkudmFsKCkpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnKTtcclxuXHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJsb2dnZWRpbi5ESEwnLCAoZXZ0LCB0b2tlbkRhdGEpID0+IHtcclxuICAgICAgdGhpcy5sb2dnZWRJbih0b2tlbkRhdGEpO1xyXG4gICAgfSk7XHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJub3Rsb2dnZWRpbi5ESEwnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubm90TG9nZ2VkSW4oKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCdmb3JtJykudmFsaWRhdGUoe1xyXG4gICAgICBydWxlczoge1xyXG4gICAgICAgIGxvZ2luX19maXJzdE5hbWU6ICdlbWFpbCcsXHJcbiAgICAgICAgbG9naW5fX3Bhc3N3b3JkOiAncGFzc3dvcmQnXHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IChmb3JtKSA9PiB7XHJcbiAgICAgICAgdGhpcy50cnlEZWxldGVBY2NvdW50KGZvcm0pO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZWFkQ29va2llKG5hbWUpIHtcclxuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xyXG4gICAgdmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjID0gY2FbaV07XHJcbiAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xyXG4gICAgICBpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBjbGVhckNvb2tpZShuYW1lKSB7XHJcbiAgICB0aGlzLmNyZWF0ZUNvb2tpZShuYW1lLCAnJywgLTEpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlQ29va2llKG5hbWUsIHZhbHVlLCBleHBpcnlTZWNvbmRzKSB7XHJcbiAgICB2YXIgZXhwaXJlcyA9ICcnO1xyXG4gICAgaWYgKGV4cGlyeVNlY29uZHMpIHtcclxuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoZXhwaXJ5U2Vjb25kcyAqIDEwMDApKTtcclxuICAgICAgZXhwaXJlcyA9ICc7IGV4cGlyZXM9JyArIGRhdGUudG9VVENTdHJpbmcoKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyAnPScgKyB2YWx1ZSArIGV4cGlyZXMgKyAnOyBwYXRoPS8nO1xyXG4gIH1cclxuXHJcbiAgdHJ5RGVsZXRlQWNjb3VudChmb3JtKSB7XHJcbiAgICB2YXIgZnJtID0gJChmb3JtKTtcclxuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xyXG5cclxuICAgIHZhciBjb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcclxuICAgIGlmIChjb29raWUgIT09IG51bGwpIHtcclxuICAgICAgdmFyIHNwbGl0ID0gY29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgIGlmIChzcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxHZXRBbGxEZXRhaWxzLFxyXG4gICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiBzcGxpdFswXSwgdG9rZW46IHNwbGl0WzFdIH0sXHJcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIGFsbERldGFpbHNSZXNwb25zZSwgdHJ1ZSBdKTtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGV0ZURlbGV0ZUFjY291bnQoZm9ybSwgYWxsRGV0YWlsc1Jlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZGVsZXRlIHlvdXIgYWNjb3VudCAoMSkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICgyKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICgzKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgcmVmcmVzaENvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicpO1xyXG4gICAgICBpZiAocmVmcmVzaENvb2tpZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIHZhciByZWZyZXNoU3BsaXQgPSByZWZyZXNoQ29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgaWYgKHJlZnJlc2hTcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFJlZnJlc2hDaGVjayxcclxuICAgICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiByZWZyZXNoU3BsaXRbMF0sIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hTcGxpdFsxXSB9LFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICBzdWNjZXNzOiAocmVmcmVzaFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoUmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHJlZnJlc2hSZXNwb25zZSwgdHJ1ZSBdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyeURlbGV0ZUFjY291bnQoZm9ybSk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICg0KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQgKDUpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQgKDYpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZGVsZXRlIHlvdXIgYWNjb3VudC4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb21wbGV0ZURlbGV0ZUFjY291bnQoZm9ybSwgZGV0YWlscykge1xyXG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XHJcblxyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIHRva2VuOiBkZXRhaWxzLnRva2VuLFxyXG5cclxuICAgICAgdXNlcm5hbWU6IGZybS5maW5kKCdpbnB1dCNsb2dpbl9fZmlyc3ROYW1lJykudmFsKCksXHJcbiAgICAgIHBhc3N3b3JkOiBmcm0uZmluZCgnaW5wdXQjbG9naW5fX3Bhc3N3b3JkJykudmFsKClcclxuICAgIH07XHJcblxyXG4gICAgaWYgKCgkLnRyaW0oZGF0YS51c2VybmFtZSkubGVuZ3RoID09IDApIHx8ICgkLnRyaW0oZGF0YS5wYXNzd29yZCkubGVuZ3RoID09IDApKSB7XHJcbiAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgeW91ciBlbWFpbCBhZGRyZXNzIGFuZCBwYXNzd29yZC4nKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsRGVsZXRlQWNjb3VudCxcclxuICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogKGRlbGV0ZUFjY291bnRSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGVsZXRlQWNjb3VudFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIGRlbGV0ZUFjY291bnRSZXNwb25zZSwgdHJ1ZSBdKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGRlbGV0ZUFjY291bnRSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBmcm0uZGF0YSgnc3VjY2Vzc3VybCcpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50LlxcbicgKyBkZWxldGVBY2NvdW50UmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdEZWxldGUgQWNjb3VudCcpO1xyXG4gICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdEZWxldGUgQWNjb3VudCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdEZWxldGUgQWNjb3VudCcpO1xyXG4gICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgnRGVsZXRlIEFjY291bnQnKTtcclxuICB9XHJcblxyXG4gIGxvZ2dlZEluKHRva2VuRGF0YSkge1xyXG4gICAgaWYgKHRva2VuRGF0YSAmJiB0b2tlbkRhdGEuc3RhdHVzICYmIHRva2VuRGF0YS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5vdExvZ2dlZEluKCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5oYXNDbGFzcygnbm8tcmVkaXJlY3QnKSkge1xyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5nZXRQYXRoSG9tZSgpICsgJy5odG1sJztcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBEZWxldGVBY2NvdW50Rm9ybSgpO1xyXG4iLCJjbGFzcyBFY29tRm9ybXMge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5lY29tLWZvcm0nLFxyXG4gICAgICBjbG9zZUljb246ICcuZWNvbS1mb3JtX19jbG9zZScsXHJcbiAgICAgIG1heEZvcm06ICcuZWNvbS1mb3JtLS1tYXgnLFxyXG4gICAgICBtaW5Gb3JtOiAnLmVjb20tZm9ybS0tbWluJyxcclxuICAgICAgc3VibWl0Rm9ybTogJy5lY29tLWZvcm0gaW5wdXRbdHlwZT1zdWJtaXRdJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmRpc3BsYXlGb3JtQWZ0ZXIgPSA1MDAwO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmZvcm1UaW1lciA9IHRoaXMuZm9ybVRpbWVyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dIaWRlTWF4Rm9ybSA9IHRoaXMuc2hvd0hpZGVNYXhGb3JtLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dIaWRlTWluRm9ybSA9IHRoaXMuc2hvd0hpZGVNaW5Gb3JtLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnN1Ym1pdEZvcm0gPSB0aGlzLnN1Ym1pdEZvcm0uYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHRoaXMuZm9ybVRpbWVyKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5jbG9zZUljb24sICgpID0+IHtcclxuICAgICAgdGhpcy5zaG93SGlkZU1heEZvcm0oKTtcclxuICAgICAgdGhpcy5zaG93SGlkZU1pbkZvcm0oKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnN1Ym1pdEZvcm0sIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IGZvcm0gPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCdmb3JtJyk7XHJcbiAgICAgIHRoaXMuc3VibWl0Rm9ybShmb3JtKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZm9ybVRpbWVyKCkge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuc2hvd0hpZGVNYXhGb3JtKCk7XHJcbiAgICB9LCB0aGlzLmRpc3BsYXlGb3JtQWZ0ZXIpO1xyXG4gIH1cclxuXHJcbiAgc2hvd0hpZGVNYXhGb3JtKCkge1xyXG4gICAgJCh0aGlzLnNlbC5tYXhGb3JtKS50b2dnbGVDbGFzcygnaXMtaGlkZGVuJyk7XHJcbiAgfVxyXG5cclxuICBzaG93SGlkZU1pbkZvcm0oKSB7XHJcbiAgICAkKHRoaXMuc2VsLm1pbkZvcm0pLnRvZ2dsZUNsYXNzKCdpcy1zaG93bicpO1xyXG4gIH1cclxuXHJcbiAgc3VibWl0Rm9ybShmb3JtKSB7XHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGZvcm0uYXR0cignYWN0aW9uJykgKyAnPycgKyBmb3JtLnNlcmlhbGl6ZSgpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEVjb21Gb3JtcygpO1xyXG4iLCJpbXBvcnQgUGFzc3dvcmRWYWxpZGl0eSBmcm9tICcuL1Bhc3N3b3JkVmFsaWRpdHknO1xyXG5cclxuY2xhc3MgRm9ybVZhbGlkYXRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5mb3JtcydcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5hZGRQYXNzd29yZENoZWNrID0gdGhpcy5hZGRQYXNzd29yZENoZWNrLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIHRoaXMuYWRkUGFzc3dvcmRDaGVjaygpO1xyXG4gICAgdGhpcy52YWxpZGF0ZSgpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBhZGRQYXNzd29yZENoZWNrKCkge1xyXG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdwYXNzd29yZENoZWNrJywgKHZhbHVlKSA9PiB7XHJcbiAgICAgIHJldHVybiBQYXNzd29yZFZhbGlkaXR5LmlzUGFzc3dvcmRWYWxpZCh2YWx1ZSk7XHJcbiAgICB9LCAnUGxlYXNlIGVudGVyIGEgdmFsaWQgcGFzc3dvcmQnKTtcclxuICB9XHJcblxyXG4gIHZhbGlkYXRlKCkge1xyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnZhbGlkYXRlKHtcclxuICAgICAgcnVsZXM6IHtcclxuICAgICAgICAncmVxdWlyZWQnOiB7XHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ3Bhc3N3b3JkJzoge1xyXG4gICAgICAgICAgcGFzc3dvcmRDaGVjazogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XHJcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgRm9ybVZhbGlkYXRpb24oKTtcclxuIiwiY2xhc3MgSGVhZGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMubGFzdExldHRlciA9ICcnO1xyXG4gICAgdGhpcy5hbGxTdWdnZXN0aW9ucyA9IFtdO1xyXG4gICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTE7XHJcbiAgICB0aGlzLm1heFN1Z2dlc3Rpb25zID0gMDtcclxuICAgIHRoaXMubGFzdFZhbCA9ICcnO1xyXG5cclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuaGVhZGVyJyxcclxuICAgICAgdG9nZ2xlOiAnLmhlYWRlcl9fbmF2aWdhdGlvbicsXHJcbiAgICAgIG1lbnU6ICcuaGVhZGVyX19tZWdhbmF2JyxcclxuICAgICAgb3ZlcmxheTogJy5oZWFkZXJfX292ZXJsYXknLFxyXG4gICAgICBzZWFyY2g6ICcuaGVhZGVyX19kZXNrdG9wU2VhcmNoJyxcclxuICAgICAgc2VhcmNoRm9ybTogJy5oZWFkZXJfX3NlYXJjaGZvcm0nLFxyXG4gICAgICBzZWFyY2hGb3JtRm9ybTogJy5oZWFkZXJfX3NlYXJjaGZvcm0gZm9ybScsXHJcbiAgICAgIHNlYXJjaEZvcm1JbnB1dDogJy5oZWFkZXJfX3NlYXJjaGZvcm0gLmZvcm0tZmllbGQnLFxyXG4gICAgICBzZWFyY2hGb3JtSW5wdXRDbGVhcjogJy5oZWFkZXJfX3NlYXJjaGZvcm0gLmZvcm0tZ3JvdXAgLmNsZWFyJyxcclxuICAgICAgc2VhcmNoU3VnZ2VzdGlvbnM6ICcuaGVhZGVyX19zZWFyY2hmb3JtIC5zdWdnZXN0aW9ucycsXHJcblxyXG4gICAgICBjb3VudHJ5OiAnLmhlYWRlcl9fZGVza3RvcENvdW50cnknLFxyXG4gICAgICBjb3VudHJ5Rm9ybTogJy5oZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbCcsXHJcbiAgICAgIGNvdW50cnlTZWNvbmRhcnk6ICcuaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwgLm1vYiAud2VsY29tZXMgYSdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5jb29raWVOYW1lID0gJ2RobC1kZWZhdWx0LWxhbmd1YWdlJztcclxuXHJcbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSAwO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnRvZ2dsZU1lbnUgPSB0aGlzLnRvZ2dsZU1lbnUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMudG9nZ2xlU2VhcmNoID0gdGhpcy50b2dnbGVTZWFyY2guYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd1NlYXJjaCA9IHRoaXMuc2hvd1NlYXJjaC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oaWRlU2VhcmNoID0gdGhpcy5oaWRlU2VhcmNoLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnRvZ2dsZUNvdW50cnkgPSB0aGlzLnRvZ2dsZUNvdW50cnkuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd0NvdW50cnkgPSB0aGlzLnNob3dDb3VudHJ5LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmhpZGVDb3VudHJ5ID0gdGhpcy5oaWRlQ291bnRyeS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZWxlY3RDb3VudHJ5U2Vjb25kYXJ5ID0gdGhpcy5zZWxlY3RDb3VudHJ5U2Vjb25kYXJ5LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJvZHlTY3JvbGxpbmcgPSB0aGlzLmJvZHlTY3JvbGxpbmcuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmNoZWNrU2Nyb2xsID0gdGhpcy5jaGVja1Njcm9sbC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ2tleWRvd24nLCB0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQsIChlKSA9PiB7XHJcbiAgICAgIC8vIGRvd24gYXJyb3cgPSA0MFxyXG4gICAgICAvLyByaWdodCBhcnJvdyA9IDM5XHJcbiAgICAgIC8vIHVwIGFycm93ID0gMzhcclxuICAgICAgLy8gbGVmdCBhcnJvdyA9IDM3XHJcbiAgICAgIC8vIHRhYiA9IDlcclxuICAgICAgaWYgKChlLmtleUNvZGUgPT09IDkgJiYgKCFlLnNoaWZ0S2V5KSkgfHwgKGUua2V5Q29kZSA9PT0gNDApIHx8IChlLmtleUNvZGUgPT09IDM5KSkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCsrO1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPj0gdGhpcy5tYXhTdWdnZXN0aW9ucykge1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zaG93U3VnZ2VzdGlvbnModHJ1ZSk7XHJcblxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSBpZiAoKGUua2V5Q29kZSA9PT0gOSAmJiAoZS5zaGlmdEtleSkpIHx8IChlLmtleUNvZGUgPT09IDM3KSB8fCAoZS5rZXlDb2RlID09PSAzOCkpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgtLTtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4IDwgMCkge1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gdGhpcy5tYXhTdWdnZXN0aW9ucyAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2hvd1N1Z2dlc3Rpb25zKHRydWUpO1xyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0pO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2tleXByZXNzJywgdGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0LCAoZSkgPT4ge1xyXG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xyXG4gICAgICAgIHZhciBmaWVsZCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICB2YXIgcGFyYW1OYW1lID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmF0dHIoJ25hbWUnKTtcclxuICAgICAgICB2YXIgdGVybSA9IGZpZWxkLnZhbCgpLnRyaW0oKTtcclxuICAgICAgICB2YXIgdXJsID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignYWN0aW9uJykgKyAnPycgKyBwYXJhbU5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodGVybSk7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdXJsO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdrZXl1cCcsIHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCwgKGUpID0+IHtcclxuICAgICAgaWYgKChlLmtleUNvZGUgPT09IDE2KSB8fCAoZS5rZXlDb2RlID09PSA5KSB8fCAoZS5rZXlDb2RlID09PSA0MCkgfHwgKGUua2V5Q29kZSA9PT0gMzkpIHx8IChlLmtleUNvZGUgPT09IDM3KSB8fCAoZS5rZXlDb2RlID09PSAzOCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBmaWVsZCA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgaWYgKGZpZWxkLnZhbCgpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkKCcudG9wLXNlYXJjaGVzJywgdGhpcy5zZWwuY29tcG9uZW50KS5oaWRlKCk7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXRDbGVhcikuc2hvdygpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tTdWdnZXN0aW9ucyhmaWVsZCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXRDbGVhcikuaGlkZSgpO1xyXG4gICAgICAgICQoJy50b3Atc2VhcmNoZXMnLCB0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXRDbGVhciwgKGUpID0+IHtcclxuICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLnZhbCgnJyk7XHJcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0Q2xlYXIpLmhpZGUoKTtcclxuICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwudG9nZ2xlLCAoZSkgPT4ge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMudG9nZ2xlTWVudSgpO1xyXG4gICAgfSk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5vdmVybGF5LCB0aGlzLnRvZ2dsZU1lbnUpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuc2VhcmNoLCB0aGlzLnRvZ2dsZVNlYXJjaCk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5jb3VudHJ5LCB0aGlzLnRvZ2dsZUNvdW50cnkpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuY291bnRyeVNlY29uZGFyeSwgdGhpcy5zZWxlY3RDb3VudHJ5U2Vjb25kYXJ5KTtcclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmhlYWRlcl9fbGFuZywgLmhlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsIC5sYW5ncyBhLCAuaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwgLmNvdW50cmllcyBhJywgKGV2dCkgPT4ge1xyXG4gICAgICBsZXQgaHJlZiA9ICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgbGV0IGhvbWUgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5hdHRyKCdkYXRhLWhvbWUnKTtcclxuICAgICAgaWYgKGhvbWUgIT09IG51bGwgJiYgaG9tZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgaHJlZiA9IGhvbWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIENvb2tpZXMuc2V0KHRoaXMuY29va2llTmFtZSwgaHJlZik7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIHRoaXMuY2hlY2tTY3JvbGwpO1xyXG4gICAgdGhpcy5jaGVja1Njcm9sbCgpO1xyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkubGVuZ3RoID4gMCkge1xyXG4gICAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLnZhbCgpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dENsZWFyKS5zaG93KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNoZWNrU2Nyb2xsKCkge1xyXG4gICAgdmFyIHd0ID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG4gICAgdmFyIHBiID0gJCgnLnBhZ2UtYm9keScpLm9mZnNldCgpLnRvcDtcclxuICAgIGlmICh3dCA+IHBiKSB7XHJcbiAgICAgICQoJy5wYWdlLWJvZHknKS5hZGRDbGFzcygnZml4ZWQnKTtcclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdmaXhlZCcpO1xyXG4gICAgICBpZiAod3QgPiB0aGlzLmxhc3RTY3JvbGxUb3ApIHtcclxuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkucmVtb3ZlQ2xhc3MoJ2luJyk7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hTdWdnZXN0aW9ucykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2luJyk7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hTdWdnZXN0aW9ucykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnLnBhZ2UtYm9keScpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkucmVtb3ZlQ2xhc3MoJ2ZpeGVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gd3Q7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVNZW51KCkge1xyXG4gICAgaWYgKCEkKHRoaXMuc2VsLm1lbnUpLmlzKCc6dmlzaWJsZScpKSB7XHJcbiAgICAgIHRoaXMuYm9keVNjcm9sbGluZyhmYWxzZSk7XHJcbiAgICAgICQodGhpcy5zZWwudG9nZ2xlKS5hZGRDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJvZHlTY3JvbGxpbmcodHJ1ZSk7XHJcbiAgICAgICQodGhpcy5zZWwudG9nZ2xlKS5yZW1vdmVDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XHJcbiAgICB9XHJcbiAgICAkKHRoaXMuc2VsLm1lbnUpLnNsaWRlVG9nZ2xlKDE1MCk7XHJcblxyXG4gICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoRm9ybSkuaGFzQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpKSB7XHJcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpO1xyXG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaCkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaCkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKTtcclxuICAgICAgfSwgMTUwKTtcclxuICAgIH1cclxuICAgIGlmICgkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5oYXNDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKSkge1xyXG4gICAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKTtcclxuICAgICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wQ291bnRyeS0tY2xvc2UnKTtcclxuICAgICAgfSwgMTUwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGJvZHlTY3JvbGxpbmcoZW5hYmxlZCkge1xyXG4gICAgaWYgKGVuYWJsZWQpIHtcclxuICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJyk7XHJcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XHJcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJztcclxuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ21vZGFsLW9wZW4nKTtcclxuICAgICAgbGV0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5zY3JlZW4uYXZhaWxIZWlnaHQ7XHJcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gd2luZG93SGVpZ2h0LnRvU3RyaW5nKCkgKyAncHgnO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmhlaWdodCA9IHdpbmRvd0hlaWdodC50b1N0cmluZygpICsgJ3B4JztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRvZ2dsZVNlYXJjaChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2gpLmhhc0NsYXNzKCdoZWFkZXJfX2Rlc2t0b3BTZWFyY2gtLWNsb3NlJykpIHtcclxuICAgICAgdGhpcy5oaWRlU2VhcmNoKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3dTZWFyY2goKTtcclxuXHJcbiAgICAgICQoJy50b3Atc2VhcmNoZXMnLCB0aGlzLnNlbC5jb21wb25lbnQpLmhpZGUoKTtcclxuICAgICAgJCgnLnRvcC1zZWFyY2hlcyAuaXRlbXMnLCB0aGlzLnNlbC5jb21wb25lbnQpLmVtcHR5KCk7XHJcblxyXG4gICAgICB2YXIgdXJsID0gJyc7XHJcbiAgICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdkYXRhLXRvcHNlYXJjaGVzJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHVybCA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2RhdGEtdG9wc2VhcmNoZXMnKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodXJsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkLmdldCh1cmwsIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgIHZhciBjb250YWluZXIgPSAkKCcudG9wLXNlYXJjaGVzIC5pdGVtcycsIHRoaXMuc2VsLmNvbXBvbmVudCk7XHJcbiAgICAgICAgICB2YXIgcGFyYW1OYW1lID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmF0dHIoJ25hbWUnKTtcclxuICAgICAgICAgIHZhciBoYXNUZXJtcyA9IGZhbHNlO1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQucmVzdWx0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBoYXNUZXJtcyA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhciB0ZXJtID0gcmVzdWx0LnJlc3VsdHNbaV0udHJpbSgpO1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoVXJsID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignYWN0aW9uJykgKyAnPycgKyBwYXJhbU5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodGVybSk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmQoYDxhIGhyZWY9JyR7c2VhcmNoVXJsfScgdGl0bGU9JyR7dGVybX0nPjxzcGFuPiR7dGVybX08L3NwYW4+PC9hPmApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChoYXNUZXJtcykge1xyXG4gICAgICAgICAgICAkKCcudG9wLXNlYXJjaGVzJywgdGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNob3dTZWFyY2goKSB7XHJcbiAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKTtcclxuICAgICQodGhpcy5zZWwuY291bnRyeSkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XHJcblxyXG4gICAgJCh0aGlzLnNlbC5zZWFyY2gpLmFkZENsYXNzKCdoZWFkZXJfX2Rlc2t0b3BTZWFyY2gtLWNsb3NlJyk7XHJcbiAgICAkKHRoaXMuc2VsLnNlYXJjaCkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykuYWRkQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XHJcbiAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLmFkZENsYXNzKCdoZWFkZXJfX3NlYXJjaGZvcm0tLW9wZW4nKTtcclxuICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS5mb2N1cygpO1xyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLnRvZ2dsZSkuaGFzQ2xhc3MoJ2hlYWRlcl9fbmF2aWdhdGlvbi0tb3BlbicpKSB7XHJcbiAgICAgIHRoaXMuYm9keVNjcm9sbGluZyh0cnVlKTtcclxuICAgICAgJCh0aGlzLnNlbC50b2dnbGUpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKTtcclxuICAgICAgJCh0aGlzLnNlbC5tZW51KS5zbGlkZVRvZ2dsZSgxNTApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGlkZVNlYXJjaCgpIHtcclxuICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpO1xyXG4gICAgJCh0aGlzLnNlbC5zZWFyY2gpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaCkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKTtcclxuICAgIH0sIDE1MCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGNoZWNrU3VnZ2VzdGlvbnMoZmllbGQpIHtcclxuICAgIHZhciB2YWwgPSAkLnRyaW0oZmllbGQudmFsKCkpO1xyXG4gICAgdmFyIHMgPSB2YWwuc3Vic3RyKDAsIDEpO1xyXG4gICAgaWYgKHMgPT09IHRoaXMubGFzdExldHRlcikge1xyXG4gICAgICB0aGlzLnNob3dTdWdnZXN0aW9ucygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XHJcbiAgICAgIHRoaXMubGFzdExldHRlciA9IHM7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xO1xyXG5cclxuICAgICAgdmFyIHVybCA9ICcnO1xyXG4gICAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignZGF0YS1zdWdnZXN0aW9ucycpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB1cmwgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdkYXRhLXN1Z2dlc3Rpb25zJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQuZ2V0KHVybCwgeyBzOiBzIH0sIChyZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAocmVzdWx0LnJlc3VsdHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICB0aGlzLmNsZWFyU3VnZ2VzdGlvbnMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5hbGxTdWdnZXN0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQucmVzdWx0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmFsbFN1Z2dlc3Rpb25zLnB1c2gocmVzdWx0LnJlc3VsdHNbaV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5zaG93U3VnZ2VzdGlvbnMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xlYXJTdWdnZXN0aW9ucygpIHtcclxuICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLmVtcHR5KCkuaGlkZSgpO1xyXG4gIH1cclxuXHJcbiAgc2hvd1N1Z2dlc3Rpb25zKHVzZUxhc3RWYWwpIHtcclxuICAgIHRoaXMuY2xlYXJTdWdnZXN0aW9ucygpO1xyXG4gICAgdmFyIHZhbCA9ICQudHJpbSgkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkudmFsKCkpO1xyXG4gICAgaWYgKHVzZUxhc3RWYWwpIHtcclxuICAgICAgdmFsID0gdGhpcy5sYXN0VmFsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5sYXN0VmFsID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBoYXNUZXJtcyA9IGZhbHNlO1xyXG4gICAgdmFyIGMgPSAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFsbFN1Z2dlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBjb250YWlucyA9IGZhbHNlO1xyXG4gICAgICB2YXIgdGVybXMgPSB2YWwudG9Mb3dlckNhc2UoKS5zcGxpdCgvXFxzLyk7XHJcblxyXG4gICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IHRlcm1zLmxlbmd0aDsgdCsrKSB7XHJcbiAgICAgICAgY29udGFpbnMgPSB0aGlzLmFsbFN1Z2dlc3Rpb25zW2ldLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGVybXNbdF0udHJpbSgpKTtcclxuICAgICAgICBpZiAoY29udGFpbnMpIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICgodmFsLmxlbmd0aCA9PT0gMSkgfHwgY29udGFpbnMpIHtcclxuICAgICAgICB2YXIgcGFyYW1OYW1lID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmF0dHIoJ25hbWUnKTtcclxuICAgICAgICB2YXIgdGVybSA9IHRoaXMuYWxsU3VnZ2VzdGlvbnNbaV0udHJpbSgpO1xyXG4gICAgICAgIHZhciB1cmwgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdhY3Rpb24nKSArICc/JyArIHBhcmFtTmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh0ZXJtKTtcclxuICAgICAgICB2YXIgY2xzID0gJyc7XHJcbiAgICAgICAgaWYgKGMgPT09IHRoaXMuc2VsZWN0ZWRJbmRleCkge1xyXG4gICAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLnZhbCh0ZXJtKTtcclxuICAgICAgICAgIGNscyA9ICcgY2xhc3M9XCJzZWxlY3RlZFwiJztcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hTdWdnZXN0aW9ucykuYXBwZW5kKGA8YSR7Y2xzfSBocmVmPScke3VybH0nIHRpdGxlPScke3Rlcm19Jz48c3Bhbj4ke3Rlcm19PC9zcGFuPjwvYT5gKTtcclxuICAgICAgICBoYXNUZXJtcyA9IHRydWU7XHJcbiAgICAgICAgYysrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYyA+PSAxMCkgYnJlYWs7XHJcbiAgICB9XHJcbiAgICB0aGlzLm1heFN1Z2dlc3Rpb25zID0gYztcclxuXHJcbiAgICBpZiAoaGFzVGVybXMpIHtcclxuICAgICAgJCh0aGlzLnNlbC5zZWFyY2hTdWdnZXN0aW9ucykuc2hvdygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdG9nZ2xlQ291bnRyeShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb3VudHJ5KS5oYXNDbGFzcygnaGVhZGVyX19kZXNrdG9wQ291bnRyeS0tY2xvc2UnKSkge1xyXG4gICAgICB0aGlzLmhpZGVDb3VudHJ5KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3dDb3VudHJ5KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzaG93Q291bnRyeSgpIHtcclxuICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpO1xyXG4gICAgJCh0aGlzLnNlbC5zZWFyY2gpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoLS1jbG9zZScpO1xyXG4gICAgfSwgMTUwKTtcclxuXHJcbiAgICAkKHRoaXMuc2VsLmNvdW50cnkpLmFkZENsYXNzKCdoZWFkZXJfX2Rlc2t0b3BDb3VudHJ5LS1jbG9zZScpO1xyXG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5hZGRDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcclxuICAgICQodGhpcy5zZWwuY291bnRyeUZvcm0pLmFkZENsYXNzKCdoZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbC0tb3BlbicpO1xyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLnRvZ2dsZSkuaGFzQ2xhc3MoJ2hlYWRlcl9fbmF2aWdhdGlvbi0tb3BlbicpKSB7XHJcbiAgICAgIHRoaXMuYm9keVNjcm9sbGluZyh0cnVlKTtcclxuICAgICAgJCh0aGlzLnNlbC50b2dnbGUpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKTtcclxuICAgICAgJCh0aGlzLnNlbC5tZW51KS5zbGlkZVRvZ2dsZSgxNTApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGlkZUNvdW50cnkoKSB7XHJcbiAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKTtcclxuICAgICQodGhpcy5zZWwuY291bnRyeSkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XHJcbiAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5maW5kKCcubW9iJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wQ291bnRyeS0tY2xvc2UnKTtcclxuICAgIH0sIDE1MCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHNlbGVjdENvdW50cnlTZWNvbmRhcnkoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkuZmluZCgnLm1vYicpLmFkZENsYXNzKCdvcGVuJyk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgSGVhZGVyKCk7XHJcbiIsImNsYXNzIEhlcm8ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5oZXJvJyxcclxuICAgICAgdHJpZ2dlcjogJy5oZXJvX19wbGF5QnV0dG9uLCAuaGVyb19fY3RhLS12aWRlbycsXHJcbiAgICAgIGlmcmFtZTogJy5oZXJvIC5oZXJvX192aWRlbydcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwudHJpZ2dlciwgdGhpcy5oYW5kbGVDbGljayk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDbGljayhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgdmlkZW9JZCA9IHRoaXMuZ2V0VmlkZW9JRChlLnRhcmdldC5ocmVmKTtcclxuICAgICQodGhpcy5zZWwuaWZyYW1lKS5hdHRyKCdzcmMnLCAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJyArIHZpZGVvSWQgKyAnP3JlbD0wJmFtcDtzaG93aW5mbz0wJmFtcDthdXRvcGxheT0xJykuYWRkQ2xhc3MoJ2hlcm9fX3ZpZGVvLS1vcGVuJyk7XHJcbiAgfVxyXG5cclxuICBnZXRWaWRlb0lEKHl0VXJsKSB7XHJcbiAgICBsZXQgaWQgPSAnJztcclxuICAgIGxldCB1cmwgPSB5dFVybC5yZXBsYWNlKC8oPnw8KS9naSwgJycpLnNwbGl0KC8odmlcXC98dj18XFwvdlxcL3x5b3V0dVxcLmJlXFwvfFxcL2VtYmVkXFwvKS8pO1xyXG4gICAgaWYgKHVybFsyXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGlkID0gdXJsWzJdLnNwbGl0KC9bXjAtOWEtel9cXC1dL2kpO1xyXG4gICAgICBpZCA9IGlkWzBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWQgPSB1cmw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaWQ7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBIZXJvKCk7XHJcbiIsImNsYXNzIElFRGV0ZWN0b3Ige1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJ2JvZHknXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kZXRlY3RJRSA9IHRoaXMuZGV0ZWN0SUUuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB2YXIgdmVyc2lvbiA9IHRoaXMuZGV0ZWN0SUUoKTtcclxuICAgIGlmICh2ZXJzaW9uICE9PSBmYWxzZSkge1xyXG4gICAgICBpZiAodmVyc2lvbiA+PSAxMikge1xyXG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnaWUtZWRnZScpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcyhgaWUtJHt2ZXJzaW9ufWApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGRldGVjdElFKCkge1xyXG4gICAgdmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XHJcbiAgICAvLyBUZXN0IHZhbHVlczsgVW5jb21tZW50IHRvIGNoZWNrIHJlc3VsdCDigKZcclxuICAgIC8vIElFIDEwXHJcbiAgICAvLyB1YSA9ICdNb3ppbGxhLzUuMCAoY29tcGF0aWJsZTsgTVNJRSAxMC4wOyBXaW5kb3dzIE5UIDYuMjsgVHJpZGVudC82LjApJztcclxuICAgIC8vIElFIDExXHJcbiAgICAvLyB1YSA9ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCA2LjM7IFRyaWRlbnQvNy4wOyBydjoxMS4wKSBsaWtlIEdlY2tvJzsgICAgLy8gRWRnZSAxMiAoU3BhcnRhbilcclxuICAgIC8vIHVhID0gJ01vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdPVzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMzkuMC4yMTcxLjcxIFNhZmFyaS81MzcuMzYgRWRnZS8xMi4wJyAgICAvLyBFZGdlIDEzXHJcbiAgICAvLyB1YSA9ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvNDYuMC4yNDg2LjAgU2FmYXJpLzUzNy4zNiBFZGdlLzEzLjEwNTg2JztcclxuICAgIHZhciBtc2llID0gdWEuaW5kZXhPZignTVNJRSAnKTtcclxuICAgIGlmIChtc2llID4gMCkge1xyXG4gICAgICAvLyBJRSAxMCBvciBvbGRlciA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcclxuICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhtc2llICsgNSwgdWEuaW5kZXhPZignLicsIG1zaWUpKSwgMTApO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB0cmlkZW50ID0gdWEuaW5kZXhPZignVHJpZGVudC8nKTtcclxuICAgIGlmICh0cmlkZW50ID4gMCkge1xyXG4gICAgICAvLyBJRSAxMSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcclxuICAgICAgdmFyIHJ2ID0gdWEuaW5kZXhPZigncnY6Jyk7XHJcbiAgICAgIHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcocnYgKyAzLCB1YS5pbmRleE9mKCcuJywgcnYpKSwgMTApO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBlZGdlID0gdWEuaW5kZXhPZignRWRnZS8nKTtcclxuICAgIGlmIChlZGdlID4gMCkge1xyXG4gICAgICAvLyBFZGdlIChJRSAxMispID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxyXG4gICAgICByZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKGVkZ2UgKyA1LCB1YS5pbmRleE9mKCcuJywgZWRnZSkpLCAxMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gb3RoZXIgYnJvd3NlclxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IElFRGV0ZWN0b3IoKTtcclxuIiwiY2xhc3MgTGFuZGluZ1BvaW50cyB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLmxhbmRpbmdwb2ludHMnLFxyXG4gICAgICBsYW5kaW5nUG9pbnRJdGVtOiAnLmxhbmRpbmdwb2ludHMgLmxhbmRpbmdwb2ludCcsXHJcbiAgICAgIGNsaWNrYWJsZVRpdGxlOiAnLmxhbmRpbmdwb2ludHMgLmxhbmRpbmdwb2ludF9fdGl0bGUgYSdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNsaWNrYWJsZVRpdGxlLCAoZXZ0KSA9PiB7XHJcbiAgICAgIHZhciBjb250YWluZXIgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KHRoaXMuc2VsLmxhbmRpbmdQb2ludEl0ZW0pO1xyXG4gICAgICBpZiAoY29udGFpbmVyLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuICAgICAgICBjb250YWluZXIuZmluZCgnLmxhbmRpbmdwb2ludF9fY29udGVudCcpLmNzcyh7IGhlaWdodDogMCB9KTtcclxuICAgICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKGV2dC5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnLmxhbmRpbmdwb2ludC5vcGVuIC5sYW5kaW5ncG9pbnRfX2NvbnRlbnQnKS5jc3MoeyBoZWlnaHQ6IDAgfSk7XHJcbiAgICAgICAgJChldnQuY3VycmVudFRhcmdldCkuY2xvc2VzdCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJy5sYW5kaW5ncG9pbnQnKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcygnb3BlbicpO1xyXG4gICAgICAgIGNvbnRhaW5lci5maW5kKCcubGFuZGluZ3BvaW50X19jb250ZW50JykuY3NzKHsgaGVpZ2h0OiBjb250YWluZXIuZmluZCgnLmxhbmRpbmdwb2ludF9fY29udGVudCBwJykub3V0ZXJIZWlnaHQoKSB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgTGFuZGluZ1BvaW50cygpO1xyXG5cclxuIiwiY2xhc3MgTGFuZ3VhZ2VEZXRlY3Qge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5yb290X19jb3VudHJ5U2VsZWN0UGFuZWwnXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucmVkaXJlY3QgPSB0cnVlO1xyXG4gICAgdGhpcy5jb29raWVOYW1lID0gJ2RobC1kZWZhdWx0LWxhbmd1YWdlJztcclxuXHJcbiAgICB0aGlzLmdldFBhdGhQcmVmaXggPSB0aGlzLmdldFBhdGhQcmVmaXguYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UGF0aFByZWZpeCgpIHtcclxuICAgIGNvbnN0IHByZWZpeCA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLXByZWZpeFxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XHJcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICBpZiAoIXRoaXMucmVkaXJlY3QpIHtcclxuICAgICAgJCgnLm1hc2snLCB0aGlzLnNlbCkuaGlkZSgpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNvb2tpZSA9IENvb2tpZXMuZ2V0KHRoaXMuY29va2llTmFtZSk7XHJcbiAgICBpZiAodHlwZW9mIGNvb2tpZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgbGV0IGxhbmd1YWdlID0gd2luZG93Lm5hdmlnYXRvci51c2VyTGFuZ3VhZ2UgfHwgd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZTtcclxuICAgICAgbGV0IGxhbmd1YWdlc0RhdGEgPSBKU09OLnBhcnNlKCQoJyNsYW5ndWFnZXNEYXRhJykuaHRtbCgpKTtcclxuICAgICAgbGV0IGNhdGNoQWxsID0gJyc7XHJcbiAgICAgIGxldCB1cmwgPSAnJztcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFuZ3VhZ2VzRGF0YS52YXJpYW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCB2YXJpYW50ID0gbGFuZ3VhZ2VzRGF0YS52YXJpYW50c1tpXTtcclxuICAgICAgICBpZiAodmFyaWFudC5sYW5ndWFnZXMgPT09ICcqJykge1xyXG4gICAgICAgICAgY2F0Y2hBbGwgPSB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHZhcmlhbnQucGF0aCArICcuaHRtbCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YXJpYW50Lmxhbmd1YWdlcy5pbmRleE9mKGxhbmd1YWdlKSA+PSAwKSB7XHJcbiAgICAgICAgICB1cmwgPSB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHZhcmlhbnQucGF0aCArICcuaHRtbCc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh1cmwgIT09ICcnKSB7XHJcbiAgICAgICAgQ29va2llcy5zZXQodGhpcy5jb29raWVOYW1lLCB1cmwpO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xyXG4gICAgICB9IGVsc2UgaWYgKGNhdGNoQWxsICE9PSAnJykge1xyXG4gICAgICAgIENvb2tpZXMuc2V0KHRoaXMuY29va2llTmFtZSwgY2F0Y2hBbGwpO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gY2F0Y2hBbGw7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gY29va2llO1xyXG4gICAgfVxyXG5cclxuICAgICQoJy5tYXNrJywgdGhpcy5zZWwpLmhpZGUoKTtcclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBMYW5ndWFnZURldGVjdCgpO1xyXG4iLCJjbGFzcyBMb2dpbkZvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jb25maWcgPSB7XHJcbiAgICAgIGZiQXBwSWQ6ICcxMDgwMDMxMzI4ODAxMjExJyxcclxuICAgICAgZ29DbGllbnRJZDogJzMxMzQ2OTgzNzQyMC1sODgyaDM5Z2U4bjhuOXBiOTdsZHZqazNmbThwcHFncy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbScsXHJcblxyXG4gICAgICB1cmxUb2tlbjogJy9saWJzL2dyYW5pdGUvY3NyZi90b2tlbi5qc29uJyxcclxuICAgICAgdXJsTG9naW46ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvbG9naW4vaW5kZXguanNvbidcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5wYWdlLWJvZHkubG9naW4gZm9ybS5mb3JtcycsXHJcbiAgICAgIGJ1dHRvbkZhY2Vib29rOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5mYicsXHJcbiAgICAgIGJ1dHRvbkxpbmtlZGluOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5saScsXHJcbiAgICAgIGJ1dHRvbkdvb2dsZVBsdXM6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmdvJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmdldFBhdGhQcmVmaXggPSB0aGlzLmdldFBhdGhQcmVmaXguYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0UGF0aEhvbWUgPSB0aGlzLmdldFBhdGhIb21lLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMudHJ5TG9naW5GYWNlYm9vayA9IHRoaXMudHJ5TG9naW5GYWNlYm9vay5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50cnlMb2dpbkxpbmtlZGluID0gdGhpcy50cnlMb2dpbkxpbmtlZGluLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnRyeUxvZ2luR29vZ2xlID0gdGhpcy50cnlMb2dpbkdvb2dsZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50cnlMb2dpbiA9IHRoaXMudHJ5TG9naW4uYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLmV4ZWN1dGVMb2dpbiA9IHRoaXMuZXhlY3V0ZUxvZ2luLmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5sb2dnZWRJbiA9IHRoaXMubG9nZ2VkSW4uYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldFBhdGhQcmVmaXgoKSB7XHJcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xyXG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoSG9tZSgpIHtcclxuICAgIGNvbnN0IGhvbWUgPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1ob21lXFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAoaG9tZSA/IGhvbWUgOiAnJyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJsb2dnZWRpbi5ESEwnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubG9nZ2VkSW4oKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGpRdWVyeS52YWxpZGF0b3IuYWRkTWV0aG9kKCdwYXNzd29yZCcsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cCgkKGVsZW1lbnQpLmF0dHIoJ3BhdHRlcm4nKSkudGVzdCh2YWx1ZSk7XHJcbiAgICB9LCAnUGFzc3dvcmQgZm9ybWF0IGlzIG5vdCB2YWxpZCcpO1xyXG5cclxuICAgIGpRdWVyeS52YWxpZGF0b3IuYWRkTWV0aG9kKCdlcXVhbFRvJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgIHJldHVybiAoJCgnIycgKyAkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtZXF1YWxUbycpKS52YWwoKSA9PT0gJChlbGVtZW50KS52YWwoKSk7XHJcbiAgICB9LCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpO1xyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykubGVuZ3RoID4gMCkge1xyXG4gICAgICB3aW5kb3cuZmJBc3luY0luaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LmZiX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LkZCKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LkZCICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5GQi5pbml0KHtcclxuICAgICAgICAgICAgICBhcHBJZDogdGhpcy5jb25maWcuZmJBcHBJZCxcclxuICAgICAgICAgICAgICBjb29raWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgeGZibWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmVyc2lvbjogJ3YyLjgnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZmJfaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhY2Vib29rLWpzc2RrJykgPT09IG51bGwpIHtcclxuICAgICAgICB2YXIgZmpzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xyXG4gICAgICAgIHZhciBqcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIGpzLmlkID0gJ2ZhY2Vib29rLWpzc2RrJztcclxuICAgICAgICBqcy5zcmMgPSAnLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9FTi9zZGsuanMnO1xyXG4gICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuICAgICAgfVxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIHRoaXMudHJ5TG9naW5GYWNlYm9vayhldnQpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgdGhpcy50cnlMb2dpbkxpbmtlZGluKGV2dCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZ29vZ2xlQnV0dG9uID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cyk7XHJcbiAgICBpZiAoZ29vZ2xlQnV0dG9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgd2luZG93LmdvX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5nYXBpKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmdhcGkgIT09IG51bGwpIHtcclxuICAgICAgICAgIHdpbmRvdy5nYXBpLmxvYWQoJ2F1dGgyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgYXV0aDIgPSB3aW5kb3cuZ2FwaS5hdXRoMi5pbml0KHtcclxuICAgICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY29uZmlnLmdvQ2xpZW50SWQsXHJcbiAgICAgICAgICAgICAgY29va2llcG9saWN5OiAnc2luZ2xlX2hvc3Rfb3JpZ2luJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZ29vZ2xlQnV0dG9uLmdldCgwKTtcclxuICAgICAgICAgICAgYXV0aDIuYXR0YWNoQ2xpY2tIYW5kbGVyKGVsZW1lbnQsIHt9LFxyXG4gICAgICAgICAgICAgIChnb29nbGVVc2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyeUxvZ2luR29vZ2xlKGdvb2dsZVVzZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvciAhPT0gJ3BvcHVwX2Nsb3NlZF9ieV91c2VyJykge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydChyZXN1bHQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmdvX2ludGVydmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkudmFsaWRhdGUoe1xyXG4gICAgICBydWxlczoge1xyXG4gICAgICAgIGxvZ2luX19lbWFpbDogJ2VtYWlsJyxcclxuICAgICAgICBsb2dpbl9fcGFzc3dvcmQ6ICdwYXNzd29yZCdcclxuICAgICAgfSxcclxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XHJcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgc3VibWl0SGFuZGxlcjogKGZvcm0pID0+IHtcclxuICAgICAgICB0aGlzLnRyeUxvZ2luKGZvcm0pO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0cnlMb2dpbkZhY2Vib29rKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgd2luZG93LkZCLmxvZ2luKChsb2dpblJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGlmIChsb2dpblJlc3BvbnNlLmF1dGhSZXNwb25zZSkge1xyXG4gICAgICAgIHdpbmRvdy5GQi5hcGkoJy9tZScsIChkYXRhUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogZGF0YVJlc3BvbnNlLmVtYWlsLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogZGF0YVJlc3BvbnNlLmlkXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHRoaXMuZXhlY3V0ZUxvZ2luKGRhdGEsICgpID0+IHtcclxuICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLnRleHQoJ0ZhY2Vib29rJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LCB7IGZpZWxkczogWyAnaWQnLCAnZW1haWwnIF19KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LCB7IHNjb3BlOiAnZW1haWwscHVibGljX3Byb2ZpbGUnLCByZXR1cm5fc2NvcGVzOiB0cnVlIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJ5TG9naW5MaW5rZWRpbihldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG5cclxuICAgIElOLlVzZXIuYXV0aG9yaXplKCgpID0+IHtcclxuICAgICAgSU4uQVBJLlByb2ZpbGUoJ21lJykuZmllbGRzKCdpZCcsICdmaXJzdC1uYW1lJywgJ2xhc3QtbmFtZScsICdlbWFpbC1hZGRyZXNzJykucmVzdWx0KChyZXN1bHQpID0+IHtcclxuICAgICAgICB2YXIgbWVtYmVyID0gcmVzdWx0LnZhbHVlc1swXTtcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICB1c2VybmFtZTogbWVtYmVyLmVtYWlsQWRkcmVzcyxcclxuICAgICAgICAgIHBhc3N3b3JkOiBtZW1iZXIuaWRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmV4ZWN1dGVMb2dpbihkYXRhLCAoKSA9PiB7XHJcbiAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikudGV4dCgnTGlua2VkSW4nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cuSU4uVXNlci5pc0F1dGhvcml6ZWQoKTtcclxuICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICB2YXIgbWVtYmVyID0gcmVzdWx0LnZhbHVlc1swXTtcclxuXHJcbiAgICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IG1lbWJlci5lbWFpbEFkZHJlc3MsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBtZW1iZXIuaWRcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdGhpcy5leGVjdXRlTG9naW4oZGF0YSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikudGV4dCgnTGlua2VkSW4nKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgdHJ5TG9naW5Hb29nbGUoZ29vZ2xlVXNlcikge1xyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIHVzZXJuYW1lOiBnb29nbGVVc2VyLmdldEJhc2ljUHJvZmlsZSgpLmdldEVtYWlsKCksXHJcbiAgICAgIHBhc3N3b3JkOiBnb29nbGVVc2VyLmdldEJhc2ljUHJvZmlsZSgpLmdldElkKClcclxuICAgIH07XHJcblxyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cykudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgIHRoaXMuZXhlY3V0ZUxvZ2luKGRhdGEsICgpID0+IHtcclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cykudGV4dCgnR29vZ2xlKycpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0cnlMb2dpbihmb3JtKSB7XHJcbiAgICB2YXIgZnJtID0gJChmb3JtKTtcclxuICAgIHZhciB1c2VybmFtZSA9IGZybS5maW5kKCdpbnB1dCNsb2dpbl9fZW1haWwnKS52YWwoKTtcclxuICAgIHZhciBwYXNzd29yZCA9IGZybS5maW5kKCdpbnB1dCNsb2dpbl9fcGFzc3dvcmQnKS52YWwoKTtcclxuXHJcbiAgICBpZiAoKCQudHJpbSh1c2VybmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKHBhc3N3b3JkKS5sZW5ndGggPT09IDApKSB7XHJcbiAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgeW91ciBlbWFpbCBhZGRyZXNzIGFuZCBwYXNzd29yZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcclxuXHJcbiAgICAgIHRoaXMuZXhlY3V0ZUxvZ2luKHsgdXNlcm5hbWU6IHVzZXJuYW1lLCBwYXNzd29yZDogcGFzc3dvcmQgfSwgKCkgPT4ge1xyXG4gICAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0xvZyBJbicpO1xyXG4gICAgICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ0xvZ2luJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGV4ZWN1dGVMb2dpbihkYXRhLCB1bndhaXRDYWxsYmFjaykge1xyXG4gICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcblxyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxMb2dpbixcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHJlc3BvbnNlLCB0cnVlIF0pO1xyXG5cclxuICAgICAgICAgICAgICB2YXIgYmFja1VybCA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5kYXRhKCdiYWNrJyk7XHJcbiAgICAgICAgICAgICAgaWYgKCQudHJpbShiYWNrVXJsKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGJhY2tVcmwgPSB0aGlzLmdldFBhdGhIb21lKCkgKyAnLmh0bWwnO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBiYWNrVXJsO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHJlZ2lzdGVyLlxcbicgKyByZXNwb25zZS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVnaXN0ZXIuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB1bndhaXRDYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGxvZ2dlZEluKCkge1xyXG4gICAgd2luZG93LmxvY2F0aW9uID0gJy9jb250ZW50L2RobC95b3VyLWFjY291bnQuaHRtbCc7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgTG9naW5Gb3JtKCk7XHJcbiIsIlxyXG5jbGFzcyBNYXJrZXRGb3JtIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICdbZGF0YS1tYXJrZXRvLWZvcm1dJyxcclxuICAgIH07XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB0aGlzLmJpbmRFdmVudHMoZWxlbWVudCwgaW5kZXgpKTtcclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoZWxlbSkge1xyXG5cclxuICAgIGNvbnN0ICRlbGVtID0gJChlbGVtKTtcclxuXHJcbiAgICBjb25zdCAkZm9ybSA9ICRlbGVtLmZpbmQoJ1tkYXRhLW1hcmtldG8tdmlzaWJsZS1mb3JtXScpO1xyXG5cclxuICAgIC8vIHZpc2libGUgZm9ybVxyXG4gICAgY29uc3QgJG1hcmtldG9Gb3JtID0gJGZvcm0uZmluZCgnZm9ybScpO1xyXG4gICAgY29uc3QgbWFya2V0b0Zvcm1BdHRyID0gJG1hcmtldG9Gb3JtID8gJG1hcmtldG9Gb3JtLmF0dHIoJ2lkJykgOiAnJztcclxuICAgIGNvbnN0IG1hcmtldG9Gb3JtSWQgPSBtYXJrZXRvRm9ybUF0dHIgPyBtYXJrZXRvRm9ybUF0dHIucmVwbGFjZSgnbWt0b0Zvcm1fJywgJycpIDogJyc7XHJcblxyXG4gICAgY29uc3QgX3B1YmxpYyA9IHt9O1xyXG5cclxuICAgIGxldCBsb2FkZWRGb3JtcyA9IFtdXHJcblxyXG4gICAgY29uc3QgZm9ybSA9ICRlbGVtLmF0dHIoJ2RhdGEtbWFya2V0by1mb3JtJyk7XHJcblxyXG4gICAgY29uc3QgaGlkZGVuU2V0dGluZ3MgPSBmb3JtID8gSlNPTi5wYXJzZShmb3JtKSA6IG51bGw7XHJcblxyXG4gICAgaWYgKG1hcmtldG9Gb3JtSWQubGVuZ3RoICE9PSAwKSB7XHJcblxyXG4gICAgICBNa3RvRm9ybXMyLndoZW5SZWFkeShmdW5jdGlvbihta3RvRm9ybSkge1xyXG4gICAgICAgICQoJyNta3RvRm9ybXMyQmFzZVN0eWxlJykucmVtb3ZlKCk7XHJcbiAgICAgICAgJCgnI21rdG9Gb3JtczJUaGVtZVN0eWxlJykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGZvcm1JZCA9IG1rdG9Gb3JtLmdldElkKCk7XHJcblxyXG4gICAgICAgIGlmIChsb2FkZWRGb3Jtcy5pbmRleE9mKGZvcm1JZC50b1N0cmluZygpKSAhPT0gLTEpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmb3JtSWQudG9TdHJpbmcoKSA9PT0gbWFya2V0b0Zvcm1JZC50b1N0cmluZygpKSB7XHJcbiAgICAgICAgICBsb2FkZWRGb3Jtcy5wdXNoKGZvcm1JZC50b1N0cmluZygpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGlzZm9ybSA9IG1rdG9Gb3JtLmdldElkKCkudG9TdHJpbmcoKSA9PT0gbWFya2V0b0Zvcm1JZC50b1N0cmluZygpO1xyXG5cclxuICAgICAgICBpZiAoaXNmb3JtKSB7XHJcblxyXG4gICAgICAgICAgbWt0b0Zvcm0ub25TdWNjZXNzKChlKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWhpZGRlblNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIE1rdG9Gb3JtczIubG9hZEZvcm0oXCIvL2V4cHJlc3MtcmVzb3VyY2UuZGhsLmNvbVwiLCBoaWRkZW5TZXR0aW5ncy5oaWRkZW5NdW5jaGtpbklkLCBoaWRkZW5TZXR0aW5ncy5oaWRkZW5Gb3JtSWQsIGZ1bmN0aW9uKGhpZGRlbkZvcm0pIHtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZm9ybUxvYWRlZCcsIGhpZGRlbkZvcm0sIGUpO1xyXG5cclxuICAgICAgICAgICAgICBjb25zdCBta3RvRmllbGRzT2JqID0gJC5leHRlbmQoZSwgaGlkZGVuRm9ybS5nZXRWYWx1ZXMoKSk7XHJcblxyXG4gICAgICAgICAgICAgIGhpZGRlbkZvcm0uYWRkSGlkZGVuRmllbGRzKG1rdG9GaWVsZHNPYmopO1xyXG4gICAgICAgICAgICAgIGhpZGRlbkZvcm0uc3VibWl0KCk7XHJcblxyXG4gICAgICAgICAgICAgIGhpZGRlbkZvcm0ub25TdWJtaXQoKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWNvbmQgZm9ybSBzdWJtaXQuLi4nLCBlLmdldFZhbHVlcygpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgaGlkZGVuRm9ybS5vblN1Y2Nlc3MoKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWNvbmQgZm9ybSBzdWNjZXNzLi4uJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBNa3RvRm9ybXMyLndoZW5SZWFkeShmdW5jdGlvbihta3RvRm9ybSkge1xyXG4gICAgICAgICQoJyNta3RvRm9ybXMyQmFzZVN0eWxlJykucmVtb3ZlKCk7XHJcbiAgICAgICAgJCgnI21rdG9Gb3JtczJUaGVtZVN0eWxlJykucmVtb3ZlKCk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBNYXJrZXRGb3JtKCk7XHJcbiIsImltcG9ydCBUb2FzdCBmcm9tICcuL1RvYXN0JztcclxuaW1wb3J0IERhdGFiYXNlIGZyb20gJy4vRGF0YWJhc2UnO1xyXG5cclxuY2xhc3MgU2F2ZUZvck9mZmxpbmUge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5oZXJvX19zYXZlRm9yT2ZmbGluZSdcclxuICAgIH07XHJcbiAgICAvLyBDcmVhdGUgYXJ0aWNsZSBjYWNoZSBuYW1lXHJcbiAgICB0aGlzLmFydGljbGVDYWNoZU5hbWUgPSAnb2ZmbGluZS0nICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZG9TYXZlID0gdGhpcy5kb1NhdmUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZG9VbnNhdmUgPSB0aGlzLmRvVW5zYXZlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0SGVyb0ltYWdlcyA9IHRoaXMuZ2V0SGVyb0ltYWdlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pc0N1cnJlbnRQYWdlU2F2ZWQgPSB0aGlzLmlzQ3VycmVudFBhZ2VTYXZlZC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNvbXBvbmVudCwgdGhpcy5oYW5kbGVDbGljayk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDbGljayhlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmhhc0NsYXNzKCdoZXJvX19zYXZlRm9yT2ZmbGluZS0tc2F2ZWQnKSkge1xyXG4gICAgICB0aGlzLmRvVW5zYXZlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRvU2F2ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNDdXJyZW50UGFnZVNhdmVkKCkge1xyXG4gICAgLy8gQ2hlY2sgaWYgYWxyZWFkeSBzYXZlZFxyXG4gICAgY2FjaGVzLmtleXMoKS50aGVuKChjYWNoZU5hbWVzKSA9PiB7IC8vIEdldCBhcnJheSBvZiBjYWNoZSBuYW1lc1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgY2FjaGVOYW1lcy5maWx0ZXIoKGNhY2hlTmFtZSkgPT4geyAvLyBGaWx0ZXIgYXJyYXlcclxuICAgICAgICAgIHJldHVybiAoY2FjaGVOYW1lID09PSB0aGlzLmFydGljbGVDYWNoZU5hbWUpOyAvLyBJZiBtYXRjaGVzIGN1cnJlbnQgcGF0aG5hbWVcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG4gICAgfSkudGhlbigoY2FjaGVOYW1lcykgPT4geyAvLyBPbmNlIGdvdCBmaWx0ZXJlZCBhcnJheVxyXG4gICAgICBpZiAoY2FjaGVOYW1lcy5sZW5ndGggPiAwKSB7IC8vIElmIHRoZXJlIGFyZSBjYWNoZXNcclxuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2hlcm9fX3NhdmVGb3JPZmZsaW5lLS1zYXZlZCcpLmF0dHIoJ3RpdGxlJywgJ0FydGljbGUgU2F2ZWQnKS5maW5kKCdzcGFuJykudGV4dCgnQXJ0aWNsZSBTYXZlZCcpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEhlcm9JbWFnZXMoKSB7XHJcbiAgICAvLyBHZXQgdGhlIGhlcm8gaW1hZ2UgZWxlbWVudFxyXG4gICAgbGV0ICRoZXJvSW1hZ2UgPSAkKCcuaGVyb19faW1hZ2UnKTtcclxuICAgIC8vIElmIGl0IGV4aXN0c1xyXG4gICAgaWYgKCRoZXJvSW1hZ2UubGVuZ3RoID4gMCkge1xyXG4gICAgICAvLyBDcmVhdGUgYXJyYXkgZm9yIGltYWdlc1xyXG4gICAgICBsZXQgaW1hZ2VzID0gW107XHJcbiAgICAgIC8vIEFkZCB0aGUgbW9iaWxlIGltYWdlIFVSTFxyXG4gICAgICBpbWFnZXMucHVzaChcclxuICAgICAgICAkaGVyb0ltYWdlLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KCd1cmwoJylbMV0uc3BsaXQoJyknKVswXS5yZXBsYWNlKC9cIi9nLCAnJykucmVwbGFjZSgvJy9nLCAnJylcclxuICAgICAgKTtcclxuICAgICAgLy8gR2V0IHRoZSBkZXNrdG9wIGltYWdlIFVSTFxyXG4gICAgICBsZXQgZGVza3RvcFN0eWxlcyA9ICRoZXJvSW1hZ2UucGFyZW50cygnLmhlcm8nKS5maW5kKCdzdHlsZScpLmh0bWwoKS5zcGxpdCgndXJsKCcpWzFdLnNwbGl0KCcpJylbMF0ucmVwbGFjZSgvXCIvZywgJycpLnJlcGxhY2UoLycvZywgJycpO1xyXG4gICAgICAvLyBBZGQgdGhlIGRlc2t0b3AgaW1hZ2UgdG8gdGhlIGFycmF5XHJcbiAgICAgIGltYWdlcy5wdXNoKGRlc2t0b3BTdHlsZXMpO1xyXG4gICAgICAvLyBSZXR1cm4gdGhlIGltYWdlc1xyXG4gICAgICByZXR1cm4gaW1hZ2VzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZG9VbnNhdmUocGF0aE5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpIHtcclxuICAgIGxldCB0b2FzdCA9IG5ldyBUb2FzdCgnQXJ0aWNsZSBoYXMgYmVlbiByZW1vdmVkJywgMzAwMCk7XHJcbiAgICAvLyBSZW1vdmUgYXJ0aWNsZSBmcm9tIElEQlxyXG4gICAgcmV0dXJuIERhdGFiYXNlLmRlbGV0ZUFydGljbGUocGF0aE5hbWUpLnRoZW4oKCkgPT4gey8vIERlbGV0ZWQgZnJvbSBJREIgc3VjY2Vzc2Z1bGx5XHJcbiAgICAgIC8vIFJlbW92ZSBhcnRpY2xlIGNvbnRlbnRcclxuICAgICAgY2FjaGVzLmRlbGV0ZSgnb2ZmbGluZS0nICsgcGF0aE5hbWUpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5yZW1vdmVDbGFzcygnaGVyb19fc2F2ZUZvck9mZmxpbmUtLXNhdmVkJykuYXR0cigndGl0bGUnLCAnU2F2ZSBBcnRpY2xlJykuZmluZCgnc3BhbicpLnRleHQoJ1NhdmUgQXJ0aWNsZScpO1xyXG4gICAgICAgIHRvYXN0LnNob3coKTtcclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaCgoKSA9PiB7Ly8gVGhlcmUgd2FzIGFuIGVycm9yIGRlbGV0aW5nIGZyb20gSURCXHJcbiAgICAgIHRvYXN0LnNldFRleHQoJ1RoZXJlIHdhcyBhIHByb2JsZW0gZGVsZXRpbmcgdGhlIGFydGljbGUnKTtcclxuICAgICAgdG9hc3Quc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkb1NhdmUoKSB7XHJcbiAgICAvLyBDcmVhdGUgdG9hc3QgZm9yIGNvbmZpcm1hdGlvblxyXG4gICAgbGV0IHRvYXN0ID0gbmV3IFRvYXN0KCdBcnRpY2xlIGlzIG5vdyBhdmFpbGFibGUgb2ZmbGluZScsIDMwMDApO1xyXG5cclxuICAgIGlmICgkKCcjYXJ0aWNsZURhdGEnKS5sZW5ndGggPD0gMCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnU1cgRVJST1I6IE9mZmxpbmUuanM6OTAnKTtcclxuICAgICAgdG9hc3Quc2V0VGV4dCgnQXJ0aWNsZSBjb3VsZCBub3QgYmUgc2F2ZWQgZm9yIG9mZmxpbmUnKTtcclxuICAgICAgdG9hc3Quc2hvdygpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvLyBHZXQgcGFnZSBkYXRhIGZvciBJREJcclxuICAgIGxldCBwYWdlRGF0YSA9IEpTT04ucGFyc2UoJCgnI2FydGljbGVEYXRhJykuaHRtbCgpKTtcclxuXHJcbiAgICAvLyBBZGQgYXJ0aWNsZSB0byBJREJcclxuICAgIERhdGFiYXNlLmFkZEFydGljbGUoXHJcbiAgICAgIHBhZ2VEYXRhLnRpdGxlLFxyXG4gICAgICB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXHJcbiAgICAgIHBhZ2VEYXRhLmRlc2NyaXB0aW9uLFxyXG4gICAgICBwYWdlRGF0YS5jYXRlZ29yeU5hbWUsXHJcbiAgICAgIHBhZ2VEYXRhLmNhdGVnb3J5TGluayxcclxuICAgICAgcGFnZURhdGEudGltZVRvUmVhZCxcclxuICAgICAgcGFnZURhdGEuaW1hZ2VNb2JpbGUsXHJcbiAgICAgIHBhZ2VEYXRhLmltYWdlRGVza3RvcCxcclxuICAgICAgcGFnZURhdGEuaXNMYXJnZSxcclxuICAgICAgcGFnZURhdGEuaXNWaWRlbyxcclxuICAgICAgdGhpcy5hcnRpY2xlQ2FjaGVOYW1lXHJcbiAgICApLnRoZW4oKCkgPT4gey8vIFNhdmVkIGluIElEQiBzdWNjZXNzZnVsbHlcclxuICAgICAgLy8gQnVpbGQgYW4gYXJyYXkgb2YgdGhlIHBhZ2Utc3BlY2lmaWMgcmVzb3VyY2VzLlxyXG4gICAgICBsZXQgcGFnZVJlc291cmNlcyA9IFt3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsIHBhZ2VEYXRhLmltYWdlTW9iaWxlLCBwYWdlRGF0YS5pbWFnZURlc2t0b3BdO1xyXG5cclxuICAgICAgLy8gQWRkIHRoZSBoZXJvIGltYWdlc1xyXG4gICAgICBpZiAoJCgnLmhlcm9fX2ltYWdlJykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGxldCBoZXJvSW1hZ2VzID0gdGhpcy5nZXRIZXJvSW1hZ2VzKCk7XHJcbiAgICAgICAgaWYgKGhlcm9JbWFnZXMpIHBhZ2VSZXNvdXJjZXMgPSBwYWdlUmVzb3VyY2VzLmNvbmNhdChoZXJvSW1hZ2VzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQWRkIHRoZSBhY2NvdW50IGFwcGx5IGltYWdlc1xyXG4gICAgICBpZiAoJCgnLmFjY291bnRhcHBseScpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBsZXQgYWNjb3VudEFwcGx5SW1hZ2UgPSAkKCcuYWNjb3VudGFwcGx5IC5jb250YWluZXInKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKTtcclxuICAgICAgICBpZiAoYWNjb3VudEFwcGx5SW1hZ2UgIT0gXCJcIikge1xyXG4gICAgICAgICAgYWNjb3VudEFwcGx5SW1hZ2UgPSBhY2NvdW50QXBwbHlJbWFnZS5zcGxpdCgndXJsKCcpWzFdLnNwbGl0KCcpJylbMF0ucmVwbGFjZSgvXCIvZywgJycpLnJlcGxhY2UoLycvZywgJycpO1xyXG4gICAgICAgICAgcGFnZVJlc291cmNlcy5wdXNoKGFjY291bnRBcHBseUltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEFkZCBpbWFnZXMgdG8gdGhlIGFycmF5XHJcbiAgICAgICQoJy5wYWdlLWJvZHkgLnd5c2l3eWcgaW1nLCAuYXV0aG9yUGFuZWwgaW1nJykuZWFjaCgoaW5kZXgsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICAvLyBUcmltIHdoaXRlc3BhY2UgZm9ybSBzcmNcclxuICAgICAgICBsZXQgaW1nU3JjID0gJC50cmltKCQoZWxlbWVudCkuYXR0cignc3JjJykpO1xyXG4gICAgICAgIC8vIElmIGVtcHR5IHNyYyBza2lwIHRoaXMgaW1hZ2VcclxuICAgICAgICBpZiAoIShpbWdTcmMgPT09ICcnKSkge1xyXG4gICAgICAgICAgLy8gQWRkIHRvIHBhZ2UgcmVzb3VyY2VzXHJcbiAgICAgICAgICBwYWdlUmVzb3VyY2VzLnB1c2goJChlbGVtZW50KS5hdHRyKCdzcmMnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIE9wZW4gdGhlIHVuaXF1ZSBjYWNoZSBmb3IgdGhpcyBVUkxcclxuICAgICAgY2FjaGVzLm9wZW4odGhpcy5hcnRpY2xlQ2FjaGVOYW1lKS50aGVuKChjYWNoZSkgPT4ge1xyXG4gICAgICAgIC8vIFVuaXF1ZSBVUkxzXHJcbiAgICAgICAgbGV0IHVuaXF1ZVJlc291cmNlcyA9IFtdO1xyXG4gICAgICAgIC8vIENyZWF0ZSBhbmNob3IgZWxlbWVudCB0byBnZXQgZnVsbCBVUkxzXHJcbiAgICAgICAgbGV0IGFuY2hvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAvLyBEZWR1cGUgYXNzZXRzXHJcbiAgICAgICAgJC5lYWNoKHBhZ2VSZXNvdXJjZXMsIChpLCBlbCkgPT4ge1xyXG4gICAgICAgICAgLy8gTG9hZCB0aGUgY3VycmVudCBVUkwgaW50byB0aGUgYW5jaG9yXHJcbiAgICAgICAgICBhbmNob3IuaHJlZiA9IGVsO1xyXG4gICAgICAgICAgLy8gT25seSBjYWNoZSBVUkxzIG9uIG91ciBkb21haW5cclxuICAgICAgICAgIGlmIChhbmNob3IuaG9zdCAhPT0gd2luZG93LmxvY2F0aW9uLmhvc3QpIHJldHVybjtcclxuICAgICAgICAgIC8vIEdldCB0aGUgcmVsYXRpdmUgcGF0aFxyXG4gICAgICAgICAgbGV0IHJlbGF0aXZlID0gYW5jaG9yLnBhdGhuYW1lICsgYW5jaG9yLnNlYXJjaDtcclxuICAgICAgICAgIC8vIElmIGFscmVhZHkgaW4gbGlzdCBvZiBhc3NldHMsIGRvbid0IGluY2x1ZGUgaXQgYWdhaW5cclxuICAgICAgICAgIGlmICgkLmluQXJyYXkocmVsYXRpdmUsIHVuaXF1ZVJlc291cmNlcykgPT09IC0xKSB1bmlxdWVSZXNvdXJjZXMucHVzaChyZWxhdGl2ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gQ2FjaGUgYWxsIHJlcXVpcmVkIGFzc2V0c1xyXG4gICAgICAgIGxldCB1cGRhdGVDYWNoZSA9IGNhY2hlLmFkZEFsbCh1bmlxdWVSZXNvdXJjZXMpO1xyXG4gICAgICAgIC8vIFVwZGF0ZSBVSSB0byBpbmRpY2F0ZSBzdWNjZXNzXHJcbiAgICAgICAgLy8gT3IgY2F0Y2ggYW55IGVycm9ycyBpZiBpdCBkb2Vzbid0IHN1Y2NlZWRcclxuICAgICAgICB1cGRhdGVDYWNoZS50aGVuKCgpID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdBcnRpY2xlIGlzIG5vdyBhdmFpbGFibGUgb2ZmbGluZS4nKTtcclxuICAgICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnaGVyb19fc2F2ZUZvck9mZmxpbmUtLXNhdmVkJykuYXR0cigndGl0bGUnLCAnU2F2ZWQgZm9yIG9mZmxpbmUnKS5maW5kKCdzcGFuJykudGV4dCgnQXJ0aWNsZSBTYXZlZCcpO1xyXG4gICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnQXJ0aWNsZSBjb3VsZCBub3QgYmUgc2F2ZWQgZm9yIG9mZmxpbmUuJywgZXJyb3IpO1xyXG4gICAgICAgICAgdG9hc3Quc2V0VGV4dCgnQXJ0aWNsZSBjb3VsZCBub3QgYmUgc2F2ZWQgZm9yIG9mZmxpbmUnKTtcclxuICAgICAgICB9KS50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHRvYXN0LnNob3coKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsvLyBUaGVyZSB3YXMgYW4gZXJyb3Igc2F2aW5nIHRvIElEQlxyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuICAgICAgdG9hc3Quc2V0VGV4dCgnQXJ0aWNsZSBjb3VsZCBub3QgYmUgc2F2ZWQgZm9yIG9mZmxpbmUnKTtcclxuICAgICAgdG9hc3Quc2hvdygpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmlzQ3VycmVudFBhZ2VTYXZlZCgpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIE9mZmxpbmVBcnRpY2xlcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLmFydGljbGVHcmlkLS1zYXZlZCcsXHJcbiAgICAgIGdyaWQ6ICcuYXJ0aWNsZUdyaWQtLXNhdmVkIC5hcnRpY2xlR3JpZF9fZ3JpZCcsXHJcbiAgICAgIHRpdGxlOiAnLmFydGljbGVHcmlkLS1zYXZlZCAuYXJ0aWNsZUdyaWRfX3RpdGxlJyxcclxuICAgICAgdGVtcGxhdGU6ICcjYXJ0aWNsZUdyaWRfX3BhbmVsVGVtcGxhdGUnLFxyXG4gICAgICBlZGl0U2F2ZWRBcnRpY2xlczogJy5oZXJvX19lZGl0U2F2ZWRBcnRpY2xlcycsXHJcbiAgICAgIGFydGljbGVzOiAnLmFydGljbGVHcmlkLS1zYXZlZCAuYXJ0aWNsZUdyaWRfX2dyaWQgLmFydGljbGVQYW5lbCcsXHJcbiAgICAgIGRlbGV0YWJsZUFydGljbGU6ICcuYXJ0aWNsZUdyaWQtLXNhdmVkIC5hcnRpY2xlR3JpZF9fZ3JpZCAuYXJ0aWNsZVBhbmVsLS1kZWxldGFibGUnXHJcbiAgICB9O1xyXG4gICAgdGhpcy5zYXZlRm9yT2ZmbGluZSA9IG5ldyBTYXZlRm9yT2ZmbGluZSgpO1xyXG4gICAgdGhpcy50ZW1wbGF0ZSA9ICQoJCh0aGlzLnNlbC50ZW1wbGF0ZSkuaHRtbCgpKTtcclxuXHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubG9hZEFydGljbGVzID0gdGhpcy5sb2FkQXJ0aWNsZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucG9wdWxhdGVUZW1wbGF0ZXMgPSB0aGlzLnBvcHVsYXRlVGVtcGxhdGVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaGFuZGxlRWRpdCA9IHRoaXMuaGFuZGxlRWRpdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kZWxldGVBcnRpY2xlID0gdGhpcy5kZWxldGVBcnRpY2xlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmhhbmRsZVN3aXBlID0gdGhpcy5oYW5kbGVTd2lwZS5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgbG9hZEFydGljbGVzKCkge1xyXG4gICAgcmV0dXJuIERhdGFiYXNlLmdldEFydGljbGVzKCkudGhlbigoYXJ0aWNsZXMpID0+IHtcclxuICAgICAgbGV0IGl0ZW1zID0gW107XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ0aWNsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgYXJ0aWNsZSA9IGFydGljbGVzW2ldO1xyXG4gICAgICAgIGl0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgTGluazogYXJ0aWNsZS5saW5rLFxyXG4gICAgICAgICAgVGl0bGU6IGFydGljbGUudGl0bGUsXHJcbiAgICAgICAgICBEZXNjcmlwdGlvbjogYXJ0aWNsZS5kZXNjcmlwdGlvbixcclxuICAgICAgICAgIENhdGVnb3J5OiB7XHJcbiAgICAgICAgICAgIE5hbWU6IGFydGljbGUuY2F0ZWdvcnlOYW1lLFxyXG4gICAgICAgICAgICBMaW5rOiBhcnRpY2xlLmNhdGVnb3J5TGlua1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFRpbWVUb1JlYWQ6IGFydGljbGUudGltZVRvUmVhZCxcclxuICAgICAgICAgIEltYWdlczoge1xyXG4gICAgICAgICAgICBNb2JpbGU6IGFydGljbGUuaW1hZ2VNb2JpbGUsXHJcbiAgICAgICAgICAgIERlc2t0b3A6IGFydGljbGUuaW1hZ2VEZXNrdG9wXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgSXNMYXJnZTogYXJ0aWNsZS5pc0xhcmdlLFxyXG4gICAgICAgICAgSXNWaWRlbzogYXJ0aWNsZS5pc1ZpZGVvXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkKHRoaXMuc2VsLmdyaWQpLmh0bWwodGhpcy5wb3B1bGF0ZVRlbXBsYXRlcyhpdGVtcykpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQodGhpcy5zZWwudGl0bGUpLnRleHQoJ1lvdSBoYXZlIG5vIHNhdmVkIGFydGljbGVzJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcG9wdWxhdGVUZW1wbGF0ZXMoaXRlbXMpIHtcclxuICAgIGxldCBvdXRwdXQgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgLy8gQ2xvbmUgdGVtcGxhdGVcclxuICAgICAgbGV0ICR0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUuY2xvbmUoKTtcclxuICAgICAgLy8gR2V0IHRoZSBpdGVtXHJcbiAgICAgIGxldCBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgIC8vIFNldCBpbWFnZSBicmVha3BvaW50XHJcbiAgICAgIGxldCBkZXNrdG9wQnJlYWtwb2ludCA9IDk5MjtcclxuICAgICAgLy8gR2VuZXJhdGUgSURcclxuICAgICAgbGV0IHBhbmVsSWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgOSk7XHJcbiAgICAgIC8vIFBvcHVsYXRlIElEXHJcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsJykuYXR0cignaWQnLCBwYW5lbElkKTtcclxuICAgICAgLy8gSWYgbGFyZ2UgcGFuZWxcclxuICAgICAgaWYgKGl0ZW0uSXNMYXJnZSkge1xyXG4gICAgICAgIC8vIFVwZGF0ZSBpbWFnZSBicmVha3BvaW50XHJcbiAgICAgICAgZGVza3RvcEJyZWFrcG9pbnQgPSA3Njg7XHJcbiAgICAgICAgLy8gQWRkIGNsYXNzXHJcbiAgICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5hZGRDbGFzcygnYXJ0aWNsZVBhbmVsLS1sYXJnZScpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIElmIHZpZGVvXHJcbiAgICAgIGlmIChpdGVtLklzVmlkZW8pIHtcclxuICAgICAgICAvLyBBZGQgY2xhc3NcclxuICAgICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbCcpLmFkZENsYXNzKCdhcnRpY2xlUGFuZWwtLXZpZGVvJyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gUG9wdWxhdGUgaW1hZ2VzXHJcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX19pbWFnZScpLmF0dHIoe1xyXG4gICAgICAgIGhyZWY6IGl0ZW0uTGluayxcclxuICAgICAgICB0aXRsZTogaXRlbS5UaXRsZVxyXG4gICAgICB9KS5hdHRyKCdzdHlsZScsICdiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyArIGl0ZW0uSW1hZ2VzLk1vYmlsZSArICcpOycpO1xyXG4gICAgICAkdGVtcGxhdGUuZmluZCgnc3R5bGUnKVswXS5pbm5lckhUTUwgPSAnQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogJyArIGRlc2t0b3BCcmVha3BvaW50ICsgJ3B4KXsjJyArIHBhbmVsSWQgKyAnIC5hcnRpY2xlUGFuZWxfX2ltYWdle2JhY2tncm91bmQtaW1hZ2U6IHVybCgnICsgaXRlbS5JbWFnZXMuRGVza3RvcCArICcpICFpbXBvcnRhbnQ7fX0nO1xyXG4gICAgICAvLyBQb3B1bGF0ZSBsaW5rXHJcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX19jb250ZW50ID4gYScpLmF0dHIoe1xyXG4gICAgICAgIGhyZWY6IGl0ZW0uTGluayxcclxuICAgICAgICB0aXRsZTogaXRlbS5UaXRsZVxyXG4gICAgICB9KTtcclxuICAgICAgLy8gUG9wdWxhdGUgdGl0bGVcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX3RpdGxlJykudGV4dChpdGVtLlRpdGxlKTtcclxuICAgICAgLy8gUG9wdWxhdGUgZGVzY3JpcHRpb25cclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2Rlc2NyaXB0aW9uJykudGV4dChpdGVtLkRlc2NyaXB0aW9uKTtcclxuICAgICAgLy8gUG9wdWxhdGUgY2F0ZWdvcnlcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX3N1YlRpdGxlIGE6Zmlyc3QtY2hpbGQnKS5hdHRyKHtcclxuICAgICAgICAnaHJlZic6IGl0ZW0uQ2F0ZWdvcnkuTGluayxcclxuICAgICAgICAndGl0bGUnOiBpdGVtLkNhdGVnb3J5Lk5hbWVcclxuICAgICAgfSkudGV4dChpdGVtLkNhdGVnb3J5Lk5hbWUpO1xyXG4gICAgICAvLyBQb3B1bGF0ZSB0aW1lIHRvIHJlYWRcclxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX3N1YlRpdGxlIGE6bGFzdC1jaGlsZCcpLmF0dHIoe1xyXG4gICAgICAgICdocmVmJzogaXRlbS5MaW5rLFxyXG4gICAgICAgICd0aXRsZSc6IGl0ZW0uVGl0bGVcclxuICAgICAgfSkudGV4dChpdGVtLlRpbWVUb1JlYWQpO1xyXG4gICAgICAvLyBQdXNoIGl0ZW0gdG8gb3V0cHV0XHJcbiAgICAgIG91dHB1dC5wdXNoKCR0ZW1wbGF0ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmVkaXRTYXZlZEFydGljbGVzLCB0aGlzLmhhbmRsZUVkaXQpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuZGVsZXRhYmxlQXJ0aWNsZSwgdGhpcy5kZWxldGVBcnRpY2xlKTtcclxuICAgICQodGhpcy5zZWwuYXJ0aWNsZXMpLnN3aXBlZGV0ZWN0KHRoaXMuaGFuZGxlU3dpcGUpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlRWRpdChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAkKHRoaXMuc2VsLmVkaXRTYXZlZEFydGljbGVzKS50b2dnbGVDbGFzcygnaGVyb19fZWRpdFNhdmVkQXJ0aWNsZXMtLWVkaXRpbmcnKTtcclxuICAgIGlmICgkKHRoaXMuc2VsLmVkaXRTYXZlZEFydGljbGVzKS5oYXNDbGFzcygnaGVyb19fZWRpdFNhdmVkQXJ0aWNsZXMtLWVkaXRpbmcnKSkge1xyXG4gICAgICAkKHRoaXMuc2VsLmdyaWQpLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5hZGRDbGFzcygnYXJ0aWNsZVBhbmVsLS1kZWxldGFibGUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQodGhpcy5zZWwuZ3JpZCkuZmluZCgnLmFydGljbGVQYW5lbCcpLnJlbW92ZUNsYXNzKCdhcnRpY2xlUGFuZWwtLWRlbGV0YWJsZScpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGVsZXRlQXJ0aWNsZShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgJGFydGljbGVQYW5lbCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5hcnRpY2xlUGFuZWwnKTtcclxuICAgIGlmICgkKGUudGFyZ2V0KS5oYXNDbGFzcygnYXJ0aWNsZVBhbmVsJykpICRhcnRpY2xlUGFuZWwgPSAkKGUudGFyZ2V0KTtcclxuICAgIGxldCB1cmwgPSBuZXcgVVJMKCRhcnRpY2xlUGFuZWwuZmluZCgnLmFydGljbGVQYW5lbF9faW1hZ2UnKVswXS5ocmVmKTtcclxuICAgIHRoaXMuc2F2ZUZvck9mZmxpbmUuZG9VbnNhdmUodXJsLnBhdGhuYW1lKS50aGVuKCgpID0+IHtcclxuICAgICAgJGFydGljbGVQYW5lbC5wYXJlbnQoKS5yZW1vdmUoKTtcclxuICAgICAgaWYgKCQodGhpcy5zZWwuZ3JpZCkuZmluZCgnLmFydGljbGVQYW5lbCcpLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5ncmlkKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJjb2wtMTJcIj48aDIgY2xhc3M9XCJhcnRpY2xlR3JpZF9fdGl0bGVcIj5Zb3UgaGF2ZSBubyBzYXZlZCBhcnRpY2xlczwvaDI+PC9kaXY+Jyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVFZGl0KHtwcmV2ZW50RGVmYXVsdDogKCkgPT4ge319KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVTd2lwZShzd2lwZWRpciwgZWxlbWVudCkge1xyXG4gICAgLy8gc3dpcGVkaXIgY29udGFpbnMgZWl0aGVyIFwibm9uZVwiLCBcImxlZnRcIiwgXCJyaWdodFwiLCBcInRvcFwiLCBvciBcImRvd25cIlxyXG4gICAgbGV0IGlzRGVsZXRhYmxlID0gJChlbGVtZW50KS5oYXNDbGFzcygnYXJ0aWNsZVBhbmVsLS1kZWxldGFibGUnKTtcclxuICAgIGlmIChzd2lwZWRpciA9PT0gJ2xlZnQnICYmICFpc0RlbGV0YWJsZSkge1xyXG4gICAgICAkKCcuYXJ0aWNsZVBhbmVsLmFydGljbGVQYW5lbC0tZGVsZXRhYmxlJykucmVtb3ZlQ2xhc3MoJ2FydGljbGVQYW5lbC0tZGVsZXRhYmxlJyk7XHJcbiAgICAgICQoZWxlbWVudCkuYWRkQ2xhc3MoJ2FydGljbGVQYW5lbC0tZGVsZXRhYmxlJyk7XHJcbiAgICB9IGVsc2UgaWYgKHN3aXBlZGlyID09PSAncmlnaHQnICYmIGlzRGVsZXRhYmxlKSB7XHJcbiAgICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2FydGljbGVQYW5lbC0tZGVsZXRhYmxlJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5sb2FkQXJ0aWNsZXMoKS50aGVuKCgpID0+IHtcclxuICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgT2ZmbGluZSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNhdmVGb3JPZmZsaW5lID0gbmV3IFNhdmVGb3JPZmZsaW5lKCk7XHJcbiAgICB0aGlzLm9mZmxpbmVBcnRpY2xlcyA9IG5ldyBPZmZsaW5lQXJ0aWNsZXMoKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGVja1N0YXR1cyA9IHRoaXMuY2hlY2tTdGF0dXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZG9PbmxpbmUgPSB0aGlzLmRvT25saW5lLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmRvT2ZmbGluZSA9IHRoaXMuZG9PZmZsaW5lLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBjaGVja1N0YXR1cygpIHtcclxuICAgIGlmIChuYXZpZ2F0b3Iub25MaW5lKSB7XHJcbiAgICAgIHRoaXMuZG9PbmxpbmUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZG9PZmZsaW5lKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkb09ubGluZSgpIHtcclxuICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnb2ZmbGluZScpO1xyXG4gICAgJCgnLmRpc2FibGUtb2ZmbGluZVt0YWJpbmRleD1cIi0xXCJdLCAuZGlzYWJsZS1vZmZsaW5lICpbdGFiaW5kZXg9XCItMVwiXScpLnJlbW92ZUF0dHIoJ3RhYmluZGV4Jyk7XHJcbiAgfVxyXG5cclxuICBkb09mZmxpbmUoKSB7XHJcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ29mZmxpbmUnKTtcclxuICAgICQoJy5kaXNhYmxlLW9mZmxpbmUsIC5kaXNhYmxlLW9mZmxpbmUgKicpLmF0dHIoJ3RhYmluZGV4JywgJy0xJyk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIHRoaXMuZG9PbmxpbmUpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCB0aGlzLmRvT2ZmbGluZSk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCEoJ29uTGluZScgaW4gbmF2aWdhdG9yKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5zYXZlRm9yT2ZmbGluZS5pbml0KCk7XHJcbiAgICB0aGlzLm9mZmxpbmVBcnRpY2xlcy5pbml0KCk7XHJcbiAgICB0aGlzLmNoZWNrU3RhdHVzKCk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IE9mZmxpbmUoKTtcclxuIiwiY2xhc3MgUGFzc3dvcmQge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5mb3Jtc19fcGFzc3dvcmQnLFxyXG4gICAgICB0b2dnbGU6ICcuZm9ybXNfX3Bhc3N3b3JkIGlucHV0W3R5cGU9Y2hlY2tib3hdJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50b2dnbGVQbGFpblRleHQgPSB0aGlzLnRvZ2dsZVBsYWluVGV4dC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsIHRoaXMuc2VsLnRvZ2dsZSwgKGUpID0+IHtcclxuICAgICAgY29uc3QgcGFzc3dvcmRUYXJnZXQgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLWZpZWxkLWlkJyk7XHJcbiAgICAgIHRoaXMudG9nZ2xlUGxhaW5UZXh0KHBhc3N3b3JkVGFyZ2V0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlUGxhaW5UZXh0KGZpZWxkSWQpIHtcclxuICAgIGNvbnN0IGZpZWxkID0gJCgnIycgKyBmaWVsZElkKTtcclxuICAgIHN3aXRjaCAoZmllbGQuYXR0cigndHlwZScpKSB7XHJcbiAgICBjYXNlICdwYXNzd29yZCc6XHJcbiAgICAgIGZpZWxkLmF0dHIoJ3R5cGUnLCAndGV4dCcpO1xyXG4gICAgICBicmVhaztcclxuXHJcbiAgICBkZWZhdWx0OlxyXG4gICAgY2FzZSAndGV4dCc6XHJcbiAgICAgIGZpZWxkLmF0dHIoJ3R5cGUnLCAncGFzc3dvcmQnKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgUGFzc3dvcmQoKTtcclxuIiwiY2xhc3MgUGFzc3dvcmRSZW1pbmRlckZvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jb25maWcgPSB7XHJcbiAgICAgIHVybFRva2VuOiAnL2xpYnMvZ3Jhbml0ZS9jc3JmL3Rva2VuLmpzb24nLFxyXG4gICAgICB1cmxMb2dpbjogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9sb2dpbi9pbmRleC5qc29uJyxcclxuICAgICAgdXJsUmVxdWVzdDogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZXF1ZXN0X3Bhc3N3b3JkL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxSZXNldDogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZXNldF9wYXNzd29yZC9pbmRleC5qc29uJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLnJlc2V0LXBhc3N3b3JkLWNvbnRhaW5lcidcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldFBhdGhIb21lID0gdGhpcy5nZXRQYXRoSG9tZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY3JlYXRlQ29va2llID0gdGhpcy5jcmVhdGVDb29raWUuYmluZCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLnJlcXVlc3RUb2tlbiA9IHRoaXMucmVxdWVzdFRva2VuLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlc2V0UGFzc3dvcmQgPSB0aGlzLnJlc2V0UGFzc3dvcmQuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldFBhdGhQcmVmaXgoKSB7XHJcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xyXG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoSG9tZSgpIHtcclxuICAgIGNvbnN0IGhvbWUgPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1ob21lXFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAoaG9tZSA/IGhvbWUgOiAnJyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgncGFzc3dvcmQnLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJChlbGVtZW50KS5hdHRyKCdwYXR0ZXJuJykpLnRlc3QodmFsdWUpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkIGZvcm1hdCBpcyBub3QgdmFsaWQnKTtcclxuXHJcbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnZXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICByZXR1cm4gKCQoJyMnICsgJChlbGVtZW50KS5hdHRyKCdkYXRhLWVxdWFsVG8nKSkudmFsKCkgPT09ICQoZWxlbWVudCkudmFsKCkpO1xyXG4gICAgfSwgJ1Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnKTtcclxuXHJcbiAgICB2YXIgcmVtaW5kZXJQYWdlID0gJCh0aGlzLnNlbC5jb21wb25lbnQpO1xyXG4gICAgaWYgKHJlbWluZGVyUGFnZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHZhciB1c2VybmFtZSA9IHJlbWluZGVyUGFnZS5kYXRhKCd1c2VybmFtZScpO1xyXG4gICAgICB2YXIgdG9rZW4gPSByZW1pbmRlclBhZ2UuZGF0YSgndG9rZW4nKTtcclxuXHJcbiAgICAgIGlmICgodXNlcm5hbWUgIT09IG51bGwgJiYgdHlwZW9mICh1c2VybmFtZSkgIT09ICd1bmRlZmluZWQnICYmIHVzZXJuYW1lLmxlbmd0aCA+IDApICYmICh0b2tlbiAhPT0gbnVsbCAmJiB0eXBlb2YgKHRva2VuKSAhPT0gJ3VuZGVmaW5lZCcgJiYgdG9rZW4ubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMycpLnNob3coKTtcclxuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMScpLmhpZGUoKTtcclxuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMicpLmhpZGUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMScpLnNob3coKTtcclxuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMicpLmhpZGUoKTtcclxuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMycpLmhpZGUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTEgZm9ybScpLnZhbGlkYXRlKHtcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgcmVzZXRQYXNzd29yZF9fZW1haWw6ICdlbWFpbCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xyXG4gICAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1Ym1pdEhhbmRsZXI6IChmb3JtKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnJlcXVlc3RUb2tlbihmb3JtKTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTMgZm9ybScpLnZhbGlkYXRlKHtcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgcmVzZXRfX2NyZWF0ZVBhc3N3b3JkOiAncGFzc3dvcmQnLFxyXG4gICAgICAgICAgcmVzZXRfX2NvbmZpcm1QYXNzd29yZDogJ2VxdWFsVG8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcclxuICAgICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5yZXNldFBhc3N3b3JkKGZvcm0pO1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjcmVhdGVDb29raWUobmFtZSwgdmFsdWUsIGV4cGlyeVNlY29uZHMpIHtcclxuICAgIHZhciBleHBpcmVzID0gJyc7XHJcbiAgICBpZiAoZXhwaXJ5U2Vjb25kcykge1xyXG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChleHBpcnlTZWNvbmRzICogMTAwMCkpO1xyXG4gICAgICBleHBpcmVzID0gJzsgZXhwaXJlcz0nICsgZGF0ZS50b1VUQ1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArICc9JyArIHZhbHVlICsgZXhwaXJlcyArICc7IHBhdGg9Lyc7XHJcbiAgfVxyXG5cclxuICByZXF1ZXN0VG9rZW4oZm9ybSkge1xyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIHVzZXJuYW1lOiAkKGZvcm0pLmZpbmQoJ2lucHV0I3Jlc2V0UGFzc3dvcmRfX2VtYWlsJykudmFsKCksXHJcbiAgICAgIHBhZ2U6IHdpbmRvdy5sb2NhdGlvbi5ocmVmXHJcbiAgICB9O1xyXG5cclxuICAgICQoZm9ybSkuZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgJChmb3JtKS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsUmVxdWVzdCxcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJy5zdGVwLTEnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJy5zdGVwLTInKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LlxcbicgKyByZXNwb25zZS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkKGZvcm0pLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgnR2V0IG5ldyBwYXNzd29yZCcpO1xyXG4gICAgICAgICAgJChmb3JtKS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ0dldCBuZXcgcGFzc3dvcmQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXNldFBhc3N3b3JkKGZvcm0pIHtcclxuICAgIHZhciB1c2VybmFtZSA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5kYXRhKCd1c2VybmFtZScpO1xyXG4gICAgdmFyIHRva2VuID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmRhdGEoJ3Rva2VuJyk7XHJcbiAgICB2YXIgcGFzc3dvcmQgPSAkKGZvcm0pLmZpbmQoJ2lucHV0I3Jlc2V0X19jcmVhdGVQYXNzd29yZCcpLnZhbCgpO1xyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcclxuICAgICAgdG9rZW46IHRva2VuLFxyXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmRcclxuICAgIH07XHJcblxyXG4gICAgJChmb3JtKS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICAkKGZvcm0pLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxSZXNldCxcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKG5leHRUb2tlblJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dGNzcmZ0b2tlbiA9IG5leHRUb2tlblJlc3BvbnNlLnRva2VuO1xyXG5cclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxMb2dpbixcclxuICAgICAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogdXNlcm5hbWUsIHBhc3N3b3JkOiBwYXNzd29yZCB9LFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBuZXh0Y3NyZnRva2VuIH0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChsb2dpblJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ2luUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dpblJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgbG9naW5SZXNwb25zZSwgdHJ1ZSBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBiYWNrVXJsID0gJChmb3JtKS5kYXRhKCdiYWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkLnRyaW0oYmFja1VybCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja1VybCA9IHRoaXMuZ2V0UGF0aEhvbWUoKSArICcuaHRtbCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gYmFja1VybDtcclxuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGxvZ2luIHVzaW5nIHlvdXIgdXBkYXRlZCBjcmVkZW50aWFscy5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGxvZ2luIHVzaW5nIHlvdXIgdXBkYXRlZCBjcmVkZW50aWFscy4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkKGZvcm0pLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgnU3VibWl0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChmb3JtKS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ1N1Ym1pdCcpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byByZXF1ZXN0IGEgcGFzc3dvcmQgcmVzZXQuXFxuJyArIHJlc3BvbnNlLmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byByZXF1ZXN0IGEgcGFzc3dvcmQgcmVzZXQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgUGFzc3dvcmRSZW1pbmRlckZvcm0oKTtcclxuIiwiY2xhc3MgUGFzc3dvcmRWYWxpZGl0eUFwaSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNoZWNrQ2FzaW5nID0gdGhpcy5jaGVja0Nhc2luZy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGVja1NwZWNpYWwgPSB0aGlzLmNoZWNrU3BlY2lhbC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGVja051bWJlciA9IHRoaXMuY2hlY2tOdW1iZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hlY2tMZW5ndGggPSB0aGlzLmNoZWNrTGVuZ3RoLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmlzVmFsaWQgPSB0aGlzLmlzVmFsaWQuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGlzVmFsaWQocGFzc3dvcmQpIHtcclxuICAgIGNvbnN0IGlzTGVuZ3RoVmFsaWQgPSB0aGlzLmNoZWNrTGVuZ3RoKHBhc3N3b3JkKTtcclxuICAgIGNvbnN0IGlzQ2FzaW5nVmFsaWQgPSB0aGlzLmNoZWNrQ2FzaW5nKHBhc3N3b3JkKTtcclxuICAgIGNvbnN0IGlzU3BlaWNhbFZhbGlkID0gdGhpcy5jaGVja1NwZWNpYWwocGFzc3dvcmQpO1xyXG4gICAgY29uc3QgaXNOdW1iZXJWYWxpZCA9IHRoaXMuY2hlY2tOdW1iZXIocGFzc3dvcmQpO1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdCA9IHtcclxuICAgICAgaXNWYWxpZDogaXNMZW5ndGhWYWxpZCAmJiBpc0Nhc2luZ1ZhbGlkICYmIGlzU3BlaWNhbFZhbGlkICYmIGlzTnVtYmVyVmFsaWQsXHJcbiAgICAgIGlzTGVuZ3RoVmFsaWQsXHJcbiAgICAgIGlzQ2FzaW5nVmFsaWQsXHJcbiAgICAgIGlzU3BlaWNhbFZhbGlkLFxyXG4gICAgICBpc051bWJlclZhbGlkXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBjaGVja0xlbmd0aChwYXNzd29yZCkge1xyXG4gICAgcmV0dXJuIHBhc3N3b3JkLmxlbmd0aCA+PSA4O1xyXG4gIH1cclxuXHJcbiAgY2hlY2tDYXNpbmcocGFzc3dvcmQpIHtcclxuICAgIHJldHVybiAvXig/PS4qW2Etel0pLiskLy50ZXN0KHBhc3N3b3JkKSAmJiAvXig/PS4qW0EtWl0pLiskLy50ZXN0KHBhc3N3b3JkKTtcclxuICB9XHJcblxyXG4gIGNoZWNrTnVtYmVyKHBhc3N3b3JkKSB7XHJcbiAgICByZXR1cm4gL14oPz0uKlswLTldKS4rJC8udGVzdChwYXNzd29yZCk7XHJcbiAgfVxyXG5cclxuICBjaGVja1NwZWNpYWwocGFzc3dvcmQpIHtcclxuICAgIHJldHVybiAvXig/PS4qWyHCoyUmKigpPXt9QCM+PF0pLiskLy50ZXN0KHBhc3N3b3JkKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4vLyBJJ3ZlIGFzc3VtZWQgdGhlcmUgd2lsbCBvbmx5IGJlIG9uZSBwYXNzd29yZCB2YWxpZGl0eSBjaGVja2VyIG9uIGEgcGFnZSBhdCBvbmNlLCBiZWNhdXNlOlxyXG4vLyAtIHRoZSB2YWxpZGl0eSBjaGVja2VyIHdvdWxkIG9ubHkgYmUgb24gdGhlIG1haW4gcGFzc3dvcmQgZW50cnkgZmllbGQgYW5kIG5vdCB0aGUgY29uZmlybWF0aW9uXHJcbi8vIC0gYSB1c2VyIHdvdWxkbid0IGJlIHNldHRpbmcgbW9yZSB0aGFuIG9uZSBwYXNzd29yZCBhdCBvbmNlXHJcbmNsYXNzIFBhc3N3b3JkVmFsaWRpdHkge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy52YWxpZGl0eS1jaGVja3MnXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucGFzc3dvcmRBcGkgPSBuZXcgUGFzc3dvcmRWYWxpZGl0eUFwaSgpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgIGNvbnN0IHBhc3N3b3JkRmllbGRJZCA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5hdHRyKCdkYXRhLWZpZWxkLWlkJyk7XHJcbiAgICBjb25zdCBwYXNzd29yZEZpZWxkID0gJCgnIycgKyBwYXNzd29yZEZpZWxkSWQpO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdrZXl1cCBrZXlwcmVzcyBjaGFuZ2UnLCAnIycgKyBwYXNzd29yZEZpZWxkSWQsICgpID0+IHtcclxuICAgICAgbGV0IHBhc3N3b3JkID0gcGFzc3dvcmRGaWVsZC52YWwoKTtcclxuICAgICAgdGhpcy5jaGVja1Bhc3N3b3JkVmFsaWRpdHkocGFzc3dvcmQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpc1Bhc3N3b3JkVmFsaWQocGFzc3dvcmQpIHtcclxuICAgIGxldCByZXN1bHQgPSB0aGlzLnBhc3N3b3JkQXBpLmlzVmFsaWQocGFzc3dvcmQpO1xyXG4gICAgcmV0dXJuIHJlc3VsdC5pc1ZhbGlkO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tQYXNzd29yZFZhbGlkaXR5KHBhc3N3b3JkKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5wYXNzd29yZEFwaS5pc1ZhbGlkKHBhc3N3b3JkKTtcclxuXHJcbiAgICBpZiAocmVzdWx0LmlzTGVuZ3RoVmFsaWQpIHtcclxuICAgICAgJCgnW2RhdGEtY2hlY2s9bGVuZ3RoXScpLmFkZENsYXNzKCdpcy12YWxpZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnW2RhdGEtY2hlY2s9bGVuZ3RoXScpLnJlbW92ZUNsYXNzKCdpcy12YWxpZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZXN1bHQuaXNDYXNpbmdWYWxpZCkge1xyXG4gICAgICAkKCdbZGF0YS1jaGVjaz1jYXNpbmddJykuYWRkQ2xhc3MoJ2lzLXZhbGlkJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkKCdbZGF0YS1jaGVjaz1jYXNpbmddJykucmVtb3ZlQ2xhc3MoJ2lzLXZhbGlkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlc3VsdC5pc1NwZWljYWxWYWxpZCkge1xyXG4gICAgICAkKCdbZGF0YS1jaGVjaz1zcGVjaWFsXScpLmFkZENsYXNzKCdpcy12YWxpZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnW2RhdGEtY2hlY2s9c3BlY2lhbF0nKS5yZW1vdmVDbGFzcygnaXMtdmFsaWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVzdWx0LmlzTnVtYmVyVmFsaWQpIHtcclxuICAgICAgJCgnW2RhdGEtY2hlY2s9bnVtYmVyXScpLmFkZENsYXNzKCdpcy12YWxpZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnW2RhdGEtY2hlY2s9bnVtYmVyXScpLnJlbW92ZUNsYXNzKCdpcy12YWxpZCcpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IFBhc3N3b3JkVmFsaWRpdHkoKTtcclxuIiwiY2xhc3MgUmVnaXN0ZXJGb3JtIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuY29uZmlnID0ge1xyXG4gICAgICBmYkFwcElkOiAnMTA4MDAzMTMyODgwMTIxMScsXHJcbiAgICAgIGdvQ2xpZW50SWQ6ICczMTM0Njk4Mzc0MjAtbDg4MmgzOWdlOG44bjlwYjk3bGR2amszZm04cHBxZ3MuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nLFxyXG5cclxuICAgICAgdXJsVG9rZW46ICcvbGlicy9ncmFuaXRlL2NzcmYvdG9rZW4uanNvbicsXHJcbiAgICAgIHVybFJlZnJlc2hDaGVjazogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZWZyZXNoX3Rva2VuL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxSZWdpc3RlcjogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZWdpc3Rlci9pbmRleC5qc29uJyxcclxuICAgICAgdXJsVXBkYXRlQ2F0ZWdvcmllczogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS91cGRhdGVfY2F0ZWdvcmllcy9pbmRleC5qc29uJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLnBhZ2UtYm9keS5yZWdpc3RlciwgI2Rvd25sb2FkLCAuZ2F0ZWQnLFxyXG4gICAgICBidXR0b25GYWNlYm9vazogJy5mb3Jtc19fY3RhLS1zb2NpYWwuZmInLFxyXG4gICAgICBidXR0b25MaW5rZWRpbjogJy5mb3Jtc19fY3RhLS1zb2NpYWwubGknLFxyXG4gICAgICBidXR0b25Hb29nbGVQbHVzOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5nbydcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldFBhdGhIb21lID0gdGhpcy5nZXRQYXRoSG9tZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubG9nZ2VkSW4gPSB0aGlzLmxvZ2dlZEluLmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy50cnlSZWdpc3RlckZhY2Vib29rID0gdGhpcy50cnlSZWdpc3RlckZhY2Vib29rLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnRyeVJlZ2lzdGVyTGlua2VkaW4gPSB0aGlzLnRyeVJlZ2lzdGVyTGlua2VkaW4uYmluZCh0aGlzKTtcclxuICAgIHRoaXMudHJ5UmVnaXN0ZXJHb29nbGUgPSB0aGlzLnRyeVJlZ2lzdGVyR29vZ2xlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnRyeVJlZ2lzdGVyID0gdGhpcy50cnlSZWdpc3Rlci5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuZXhlY3V0ZVJlZ2lzdGVyID0gdGhpcy5leGVjdXRlUmVnaXN0ZXIuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldFBhdGhQcmVmaXgoKSB7XHJcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xyXG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoSG9tZSgpIHtcclxuICAgIGNvbnN0IGhvbWUgPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1ob21lXFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAoaG9tZSA/IGhvbWUgOiAnJyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHJlYWRDb29raWUobmFtZSkge1xyXG4gICAgdmFyIG5hbWVFUSA9IG5hbWUgKyAnPSc7XHJcbiAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGMgPSBjYVtpXTtcclxuICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XHJcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKHdpbmRvdykub24oJ3VzZXJsb2dnZWRpbi5ESEwnLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMubG9nZ2VkSW4oKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGpRdWVyeS52YWxpZGF0b3IuYWRkTWV0aG9kKCdwYXNzd29yZCcsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICBpZiAoJC50cmltKHZhbHVlKS5sZW5ndGggPT09IDApIHJldHVybiB0cnVlO1xyXG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cCgkKGVsZW1lbnQpLmF0dHIoJ3BhdHRlcm4nKSkudGVzdCh2YWx1ZSk7XHJcbiAgICB9LCAnUGFzc3dvcmQgZm9ybWF0IGlzIG5vdCB2YWxpZCcpO1xyXG5cclxuICAgIGpRdWVyeS52YWxpZGF0b3IuYWRkTWV0aG9kKCdlcXVhbFRvJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgIHJldHVybiAoJCgnIycgKyAkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtZXF1YWxUbycpKS52YWwoKSA9PT0gJChlbGVtZW50KS52YWwoKSk7XHJcbiAgICB9LCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpO1xyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykubGVuZ3RoID4gMCkge1xyXG4gICAgICB3aW5kb3cuZmJBc3luY0luaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LmZiX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LkZCKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LkZCICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5GQi5pbml0KHtcclxuICAgICAgICAgICAgICBhcHBJZDogdGhpcy5jb25maWcuZmJBcHBJZCxcclxuICAgICAgICAgICAgICBjb29raWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgeGZibWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmVyc2lvbjogJ3YyLjgnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZmJfaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhY2Vib29rLWpzc2RrJykgPT09IG51bGwpIHtcclxuICAgICAgICB2YXIgZmpzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xyXG4gICAgICAgIHZhciBqcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIGpzLmlkID0gJ2ZhY2Vib29rLWpzc2RrJztcclxuICAgICAgICBqcy5zcmMgPSAnLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9FTi9zZGsuanMnO1xyXG4gICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuICAgICAgfVxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIHRoaXMudHJ5UmVnaXN0ZXJGYWNlYm9vayhldnQpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgdGhpcy50cnlSZWdpc3RlckxpbmtlZGluKGV2dCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZ29vZ2xlQnV0dG9uID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cyk7XHJcbiAgICBpZiAoZ29vZ2xlQnV0dG9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgd2luZG93LmdvX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5nYXBpKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmdhcGkgIT09IG51bGwpIHtcclxuICAgICAgICAgIHdpbmRvdy5nYXBpLmxvYWQoJ2F1dGgyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgYXV0aDIgPSB3aW5kb3cuZ2FwaS5hdXRoMi5pbml0KHtcclxuICAgICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY29uZmlnLmdvQ2xpZW50SWQsXHJcbiAgICAgICAgICAgICAgY29va2llcG9saWN5OiAnc2luZ2xlX2hvc3Rfb3JpZ2luJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZ29vZ2xlQnV0dG9uLmdldCgwKTtcclxuICAgICAgICAgICAgYXV0aDIuYXR0YWNoQ2xpY2tIYW5kbGVyKGVsZW1lbnQsIHt9LFxyXG4gICAgICAgICAgICAgIChnb29nbGVVc2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyeVJlZ2lzdGVyR29vZ2xlKGdvb2dsZVVzZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvciAhPT0gJ3BvcHVwX2Nsb3NlZF9ieV91c2VyJykge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydChyZXN1bHQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmdvX2ludGVydmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnI2dsYi1yZWdpc3Rlci1zdGFydCBmb3JtI3JlZ2lzdGVyLWRldGFpbC1mb3JtJykudmFsaWRhdGUoe1xyXG4gICAgICBydWxlczoge1xyXG4gICAgICAgIHJlZ2lzdGVyX19lbWFpbDogJ2VtYWlsJyxcclxuICAgICAgICByZWdpc3Rlcl9fcGFzc3dvcmQxOiAncGFzc3dvcmQnXHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xyXG4gICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xyXG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcclxuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Ym1pdEhhbmRsZXI6IChmb3JtKSA9PiB7XHJcbiAgICAgICAgdGhpcy50cnlSZWdpc3Rlcihmb3JtKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcjZ2xiLXJlZ2lzdGVyLWNhdGVnb3JpZXMgZm9ybSAuZm9ybXNfX2N0YS0tcmVkJykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdGhpcy50cnlDYXRlZ29yeVNlbGVjdGlvbihldnQpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRyeVJlZ2lzdGVyRmFjZWJvb2soZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuXHJcbiAgICB3aW5kb3cuRkIubG9naW4oKGxvZ2luUmVzcG9uc2UpID0+IHtcclxuICAgICAgaWYgKGxvZ2luUmVzcG9uc2UuYXV0aFJlc3BvbnNlKSB7XHJcbiAgICAgICAgd2luZG93LkZCLmFwaSgnL21lJywgKGRhdGFSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGZpcnN0bmFtZTogZGF0YVJlc3BvbnNlLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgIGxhc3RuYW1lOiBkYXRhUmVzcG9uc2UubGFzdF9uYW1lLFxyXG4gICAgICAgICAgICB1c2VybmFtZTogZGF0YVJlc3BvbnNlLmVtYWlsLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogZGF0YVJlc3BvbnNlLmlkLFxyXG4gICAgICAgICAgICBpc2xpbmtlZGluOiAndHJ1ZScsXHJcbiAgICAgICAgICAgIHRjYWdyZWU6IHRydWVcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdGhpcy5leGVjdXRlUmVnaXN0ZXIoZGF0YSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykudGV4dCgnRmFjZWJvb2snKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sIHsgZmllbGRzOiBbICdpZCcsICdlbWFpbCcsICdmaXJzdF9uYW1lJywgJ2xhc3RfbmFtZScgXX0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sIHsgc2NvcGU6ICdlbWFpbCxwdWJsaWNfcHJvZmlsZScsIHJldHVybl9zY29wZXM6IHRydWUgfSk7XHJcbiAgfVxyXG5cclxuICB0cnlSZWdpc3RlckxpbmtlZGluKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcblxyXG4gICAgSU4uVXNlci5hdXRob3JpemUoKCkgPT4ge1xyXG4gICAgICBJTi5BUEkuUHJvZmlsZSgnbWUnKS5maWVsZHMoJ2lkJywgJ2ZpcnN0LW5hbWUnLCAnbGFzdC1uYW1lJywgJ2VtYWlsLWFkZHJlc3MnKS5yZXN1bHQoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIHZhciBtZW1iZXIgPSByZXN1bHQudmFsdWVzWzBdO1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgIGZpcnN0bmFtZTogbWVtYmVyLmZpcnN0TmFtZSxcclxuICAgICAgICAgIGxhc3RuYW1lOiBtZW1iZXIubGFzdE5hbWUsXHJcbiAgICAgICAgICB1c2VybmFtZTogbWVtYmVyLmVtYWlsQWRkcmVzcyxcclxuICAgICAgICAgIHBhc3N3b3JkOiBtZW1iZXIuaWQsXHJcbiAgICAgICAgICBpc2xpbmtlZGluOiAndHJ1ZScsXHJcbiAgICAgICAgICB0Y2FncmVlOiB0cnVlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5leGVjdXRlUmVnaXN0ZXIoZGF0YSwgKCkgPT4ge1xyXG4gICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLnRleHQoJ0xpbmtlZEluJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICB2YXIgcmVzdWx0ID0gd2luZG93LklOLlVzZXIuaXNBdXRob3JpemVkKCk7XHJcbiAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICBJTi5BUEkuUHJvZmlsZSgnbWUnKS5maWVsZHMoJ2lkJywgJ2ZpcnN0LW5hbWUnLCAnbGFzdC1uYW1lJywgJ2VtYWlsLWFkZHJlc3MnKS5yZXN1bHQoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgdmFyIG1lbWJlciA9IHJlc3VsdC52YWx1ZXNbMF07XHJcblxyXG4gICAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGZpcnN0bmFtZTogbWVtYmVyLmZpcnN0TmFtZSxcclxuICAgICAgICAgICAgbGFzdG5hbWU6IG1lbWJlci5sYXN0TmFtZSxcclxuICAgICAgICAgICAgdXNlcm5hbWU6IG1lbWJlci5lbWFpbEFkZHJlc3MsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBtZW1iZXIuaWQsXHJcbiAgICAgICAgICAgIGlzbGlua2VkaW46ICd0cnVlJyxcclxuICAgICAgICAgICAgdGNhZ3JlZTogdHJ1ZVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICB0aGlzLmV4ZWN1dGVSZWdpc3RlcihkYXRhLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS50ZXh0KCdMaW5rZWRJbicpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0sIDEwMDApO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgdHJ5UmVnaXN0ZXJHb29nbGUoZ29vZ2xlVXNlcikge1xyXG4gICAgdmFyIGJhc2ljUHJvZmlsZSA9IGdvb2dsZVVzZXIuZ2V0QmFzaWNQcm9maWxlKCk7XHJcblxyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIGZpcnN0bmFtZTogYmFzaWNQcm9maWxlLmdldEdpdmVuTmFtZSgpLFxyXG4gICAgICBsYXN0bmFtZTogYmFzaWNQcm9maWxlLmdldEZhbWlseU5hbWUoKSxcclxuICAgICAgdXNlcm5hbWU6IGJhc2ljUHJvZmlsZS5nZXRFbWFpbCgpLFxyXG4gICAgICBwYXNzd29yZDogYmFzaWNQcm9maWxlLmdldElkKCksXHJcbiAgICAgIGlzbGlua2VkaW46ICd0cnVlJyxcclxuICAgICAgdGNhZ3JlZTogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgdGhpcy5leGVjdXRlUmVnaXN0ZXIoZGF0YSwgKCkgPT4ge1xyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS50ZXh0KCdHb29nbGUrJyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRyeVJlZ2lzdGVyKGZvcm0pIHtcclxuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xyXG4gICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgIGZpcnN0bmFtZTogZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX19maXJzdG5hbWUnKS52YWwoKSxcclxuICAgICAgbGFzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fbGFzdG5hbWUnKS52YWwoKSxcclxuICAgICAgdXNlcm5hbWU6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fZW1haWwnKS52YWwoKSxcclxuICAgICAgcGFzc3dvcmQ6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fcGFzc3dvcmQxJykudmFsKCksXHJcblxyXG4gICAgICBpc2xpbmtlZGluOiAnZmFsc2UnLFxyXG4gICAgICB0Y2FncmVlOiBmcm0uZmluZCgnaW5wdXQjY2hlY2tib3hJZCcpLmlzKCc6Y2hlY2tlZCcpXHJcbiAgICB9O1xyXG5cclxuICAgIGlmICgoJC50cmltKGRhdGEuZmlyc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS5sYXN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEudXNlcm5hbWUpLmxlbmd0aCA9PT0gMCkpIHtcclxuICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciB5b3VyIG5hbWUgYW5kIGVtYWlsIGFkZHJlc3MuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG4gICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xyXG5cclxuICAgICAgdGhpcy5leGVjdXRlUmVnaXN0ZXIoZGF0YSwgKCkgPT4ge1xyXG4gICAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ1N1Ym1pdCcpO1xyXG4gICAgICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ1N1Ym1pdCcpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBleGVjdXRlUmVnaXN0ZXIoZGF0YSwgdW53YWl0Q2FsbGJhY2spIHtcclxuICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG5cclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsUmVnaXN0ZXIsXHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdmFyIGZybSA9ICQoJy5wYWdlLWJvZHkucmVnaXN0ZXIsICNkb3dubG9hZCwgLmdhdGVkJykuZmluZCgnZm9ybScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyByZXNwb25zZSwgdHJ1ZSBdKTtcclxuXHJcbiAgICAgICAgICAgICAgd2luZG93LmRhdGFMYXllciA9IHdpbmRvdy5kYXRhTGF5ZXIgfHwgW107XHJcbiAgICAgICAgICAgICAgd2luZG93LmRhdGFMYXllci5wdXNoKHtcclxuICAgICAgICAgICAgICAgICdldmVudCc6ICdyZWdpc3RyYXRpb25Db21wbGV0ZSdcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKChmcm0uY2xvc2VzdCgnI2Rvd25sb2FkJykubGVuZ3RoID4gMCkgfHwgKGZybS5jbG9zZXN0KCcuZ2F0ZWQnKS5sZW5ndGggPiAwKSkge1xyXG4gICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICB2YXIgbW9kYWwgPSAkKCcucmVnaXN0ZXIuYmVsb3ctcmVnaXN0ZXItZm9ybScpLmZpbmQoJy5tb2RhbCcpO1xyXG4gICAgICAgICAgICAgIHZhciBjYXRlZ29yeVNlbGVjdGlvbiA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcjZ2xiLXJlZ2lzdGVyLWNhdGVnb3JpZXMnKTtcclxuICAgICAgICAgICAgICBpZiAobW9kYWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbW9kYWwuZmluZCgnLnRoYW5rcy1uYW1lJykudGV4dChkYXRhLmZpcnN0bmFtZSk7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCdidXR0b24nKS5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBiYWNrVXJsID0gZnJtLmRhdGEoJ2JhY2snKTtcclxuICAgICAgICAgICAgICAgICAgaWYgKCQudHJpbShiYWNrVXJsKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBiYWNrVXJsO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBtb2RhbC5tb2RhbCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2F0ZWdvcnlTZWxlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJyNnbGItcmVnaXN0ZXItc3RhcnQnKS5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnlTZWxlY3Rpb24uZmluZCgnLmZvcm1zX190aXRsZScpLnRleHQoJ1RoYW5rcyAnICsgcmVzcG9uc2UubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeVNlbGVjdGlvbi5zaG93KCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLmVycm9yLmluY2x1ZGVzKCdFbWFpbCBhZGRyZXNzIGFscmVhZHkgZXhpc3RzJykpIHtcclxuICAgICAgICAgICAgICAkKCc8bGFiZWwgaWQ9XCJyZWdpc3Rlcl9fZW1haWwtZXJyb3JcIiBjbGFzcz1cImVycm9yXCIgZm9yPVwicmVnaXN0ZXJfX2VtYWlsXCI+VGhpcyBlbWFpbCBhZGRyZXNzIGFscmVhZHkgZXhpc3RzPC9sYWJlbD4nKS5pbnNlcnRBZnRlcihmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2VtYWlsJykpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHJlZ2lzdGVyLlxcbicgKyByZXNwb25zZS5lcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVnaXN0ZXIuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB1bndhaXRDYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRyeUNhdGVnb3J5U2VsZWN0aW9uKCkge1xyXG4gICAgdmFyIGNhdGVnb3JpZXMgPSAnJztcclxuICAgIHZhciBjb250YWluZXIgPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnI2dsYi1yZWdpc3Rlci1jYXRlZ29yaWVzIGZvcm0nKTtcclxuICAgIGNvbnRhaW5lci5maW5kKCdpbnB1dDpjaGVja2VkJykuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgaWYgKGNhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNhdGVnb3JpZXMgKz0gJywnO1xyXG4gICAgICB9XHJcbiAgICAgIGNhdGVnb3JpZXMgKz0gJChpdGVtKS52YWwoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChjYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdmFyIGNvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLkF1dGhUb2tlbicpO1xyXG4gICAgICBpZiAoY29va2llICE9PSBudWxsKSB7XHJcbiAgICAgICAgdmFyIHNwbGl0ID0gY29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVXBkYXRlQ2F0ZWdvcmllcyxcclxuICAgICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiBzcGxpdFswXSwgdG9rZW46IHNwbGl0WzFdLCBjYXRzOiBjYXRlZ29yaWVzIH0sXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6ICh1cGRhdGVDYXRlZ29yaWVzUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh1cGRhdGVDYXRlZ29yaWVzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHVwZGF0ZUNhdGVnb3JpZXNSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgdXBkYXRlQ2F0ZWdvcmllc1Jlc3BvbnNlLCB0cnVlIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMuZ2V0UGF0aEhvbWUoKSArICcuaHRtbCc7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICgxKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDIpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDMpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciByZWZyZXNoQ29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuUmVmcmVzaFRva2VuJyk7XHJcbiAgICAgICAgaWYgKHJlZnJlc2hDb29raWUgIT09IG51bGwpIHtcclxuICAgICAgICAgIHZhciByZWZyZXNoU3BsaXQgPSByZWZyZXNoQ29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgICBpZiAocmVmcmVzaFNwbGl0Lmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxSZWZyZXNoQ2hlY2ssXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiByZWZyZXNoU3BsaXRbMF0sIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hTcGxpdFsxXSB9LFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZWZyZXNoUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoUmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgcmVmcmVzaFJlc3BvbnNlLCB0cnVlIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy50cnlDYXRlZ29yeVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDQpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoNSkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoNikuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBsb2dnZWRJbigpIHtcclxuICAgIGlmICgkKCcucGFnZS1ib2R5LnJlZ2lzdGVyJykubGVuZ3RoID4gMCkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24gPSAnL2NvbnRlbnQvZGhsL3lvdXItYWNjb3VudC5odG1sJztcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBSZWdpc3RlckZvcm0oKTtcclxuIiwiY2xhc3MgU2VhcmNoRm9ybSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLnNlYXJjaC1mb3JtJyxcclxuICAgICAgY2xlYXJCdXR0b246ICcuc2VhcmNoLWZvcm1fX2NsZWFyLWljb24nLFxyXG4gICAgICBpbnB1dDogJy5zZWFyY2gtZm9ybV9fc2VhcmNoIGlucHV0W3R5cGU9c2VhcmNoXSdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2xlYXJTZWFyY2hGb3JtID0gdGhpcy5jbGVhclNlYXJjaEZvcm0uYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNsZWFyQnV0dG9uLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuY2xlYXJTZWFyY2hGb3JtKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNsZWFyU2VhcmNoRm9ybSgpIHtcclxuICAgICQodGhpcy5zZWwuaW5wdXQpLnZhbCgnJykuZm9jdXMoKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBTZWFyY2hGb3JtKCk7XHJcbiIsImNsYXNzIFNlcnZpY2VXb3JrZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRlZmVycmVkUHJvbXB0ID0gbnVsbDtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXIgPSB0aGlzLnJlZ2lzdGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5hZGRUb0hvbWVTY3JlZW4gPSB0aGlzLmFkZFRvSG9tZVNjcmVlbi5iaW5kKHRoaXMpO1xuICB9XG5cbiAgcmVnaXN0ZXIoKSB7XG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJy9ldGMuY2xpZW50bGlicy9kaGwvY2xpZW50bGlicy9jbGllbnRsaWItc2l0ZS9yZXNvdXJjZXMvc3cuanMnKS50aGVuKCgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTZXJ2aWNlV29ya2VyIHN1Y2Nlc2Z1bGx5IHJlZ2lzdGVyZWQnKTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkOiAnLCBlcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkVG9Ib21lU2NyZWVuKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmVpbnN0YWxscHJvbXB0JywgKGUpID0+IHtcbiAgICAgIC8vIFByZXZlbnQgQ2hyb21lIDY3IGFuZCBlYXJsaWVyIGZyb20gYXV0b21hdGljYWxseSBzaG93aW5nIHRoZSBwcm9tcHRcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIFN0YXNoIHRoZSBldmVudCBzbyBpdCBjYW4gYmUgdHJpZ2dlcmVkIGxhdGVyLlxuICAgICAgdGhpcy5kZWZlcnJlZFByb21wdCA9IGU7XG4gICAgICAvLyBDaGVjayBpZiBhbHJlYWR5IGRpc21pc3NlZFxuICAgICAgbGV0IGEyaHNDb29raWUgPSBDb29raWVzLmdldCgnYTJocycpO1xuICAgICAgLy8gSWYgdGhlIGNvb2tpZSBpcyBzZXQgdG8gaWdub3JlLCBpZ25vcmUgdGhlIHByb21wdFxuICAgICAgaWYgKGEyaHNDb29raWUgPT09ICdpZ25vcmUnKSByZXR1cm47XG4gICAgICAvLyBTaG93IHRoZSBhZGQgdG8gaG9tZSBzY3JlZW4gYmFubmVyXG4gICAgICAkKCcuYWRkVG9Ib21lU2NyZWVuJykuYWRkQ2xhc3MoJ2FkZFRvSG9tZVNjcmVlbi0tb3BlbicpO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5hZGRUb0hvbWVTY3JlZW5fX2N0YScsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyBTaG93IEEySFNcbiAgICAgIHRoaXMuZGVmZXJyZWRQcm9tcHQucHJvbXB0KCk7XG4gICAgICAvLyBXYWl0IGZvciB0aGUgdXNlciB0byByZXNwb25kIHRvIHRoZSBwcm9tcHRcbiAgICAgIHRoaXMuZGVmZXJyZWRQcm9tcHQudXNlckNob2ljZS50aGVuKChjaG9pY2VSZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKGNob2ljZVJlc3VsdC5vdXRjb21lID09PSAnYWNjZXB0ZWQnKSB7XG4gICAgICAgICAgLy8gSGlkZSB0aGUgYWRkIHRvIGhvbWUgc2NyZWVuIGJhbm5lclxuICAgICAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW4nKS5yZW1vdmVDbGFzcygnYWRkVG9Ib21lU2NyZWVuLS1vcGVuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2hhbmdlIGNvbnRlbnRcbiAgICAgICAgICAkKCcuYWRkVG9Ib21lU2NyZWVuX190aXRsZScpLnRleHQoJ1RoYXRcXCdzIGEgc2hhbWUsIG1heWJlIG5leHQgdGltZScpO1xuICAgICAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW5fX2N0YScpLnJlbW92ZSgpO1xuICAgICAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW5fX2xpbmsnKS50ZXh0KCdDbG9zZScpO1xuICAgICAgICAgIC8vIFNldCBpZ25vcmUgY29va2llXG4gICAgICAgICAgdGhpcy5jcmVhdGVBMmhzQ29va2llKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZWZlcnJlZFByb21wdCA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuYWRkVG9Ib21lU2NyZWVuX19saW5rJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIEhpZGUgdGhlIGFkZCB0byBob21lIHNjcmVlbiBiYW5uZXJcbiAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW4nKS5yZW1vdmVDbGFzcygnYWRkVG9Ib21lU2NyZWVuLS1vcGVuJyk7XG4gICAgICAvLyBDbGVhciB0aGUgcHJvbXB0XG4gICAgICB0aGlzLmRlZmVycmVkUHJvbXB0ID0gbnVsbDtcbiAgICAgIC8vIFNldCBpZ25vcmUgY29va2llXG4gICAgICB0aGlzLmNyZWF0ZUEyaHNDb29raWUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUEyaHNDb29raWUoKSB7XG4gICAgLy8gU2V0IGlnbm9yZSBjb29raWVcbiAgICBDb29raWVzLnNldCgnYTJocycsICdpZ25vcmUnLCB7ZXhwaXJlczogMTR9KTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCEoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikpIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLnJlZ2lzdGVyKCk7XG4gICAgLy8gdGhpcy5hZGRUb0hvbWVTY3JlZW4oKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgU2VydmljZVdvcmtlcigpO1xuIiwiY2xhc3MgU2hpcEZvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIC8vIFFTUCA9IHF1ZXJ5c3RyaW5nIHBhcmFtZXRlclxyXG4gICAgICBjb21wb25lbnQ6ICcuc2hpcC1ub3cnLFxyXG4gICAgICBmaXJzdG5hbWVJbnB1dDogJyNmaXJzdG5hbWUnLCAvLyBqcXVlcnkgc2VsZWN0b3IgZm9yIGlucHV0IChjYW4gYmUgZWcgJy5maXJzdG5hbWUgaW5wdXQnKVxyXG4gICAgICBmaXJzdG5hbWVRU1A6ICc/Zmlyc3RuYW1lJywgLy8gbmVlZCA/IGZvbGxvd2VkIGJ5IHBhcmFtZXRlciBuYW1lXHJcbiAgICAgIGxhc3RuYW1lSW5wdXQ6ICcjbGFzdG5hbWUnLFxyXG4gICAgICBsYXN0bmFtZVFTUDogJz9sYXN0bmFtZScsXHJcbiAgICAgIGVtYWlsSW5wdXQ6ICcjZW1haWwnLFxyXG4gICAgICBlbWFpbFFTUDogJz9lbWFpbCcsXHJcbiAgICAgIHVzZXJGaXJzdG5hbWVFbGVtZW50OiAnLnVzZXItZmlyc3RuYW1lJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucG9wdWxhdGVGb3JtID0gdGhpcy5wb3B1bGF0ZUZvcm0uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd0xvZ2dlZEluRWxlbWVudHMgPSB0aGlzLnNob3dMb2dnZWRJbkVsZW1lbnRzLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICQod2luZG93KS5vbigndXNlcmxvZ2dlZGluLkRITCcsIChldnQsIHRva2VuRGF0YSkgPT4ge1xyXG4gICAgICB0aGlzLnNob3dMb2dnZWRJbkVsZW1lbnRzKHRva2VuRGF0YSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnBvcHVsYXRlRm9ybSgpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBwb3B1bGF0ZUZvcm0oKSB7XHJcbiAgICBsZXQgZW1haWwgPSB1cmwodGhpcy5zZWwuZW1haWxRU1ApO1xyXG4gICAgbGV0IGZpcnN0bmFtZSA9IHVybCh0aGlzLnNlbC5maXJzdG5hbWVRU1ApO1xyXG4gICAgbGV0IGxhc3RuYW1lID0gdXJsKHRoaXMuc2VsLmxhc3RuYW1lUVNQKTtcclxuXHJcbiAgICBpZiAodHlwZW9mIGVtYWlsICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAkKHRoaXMuc2VsLmVtYWlsSW5wdXQpLnZhbChlbWFpbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBmaXJzdG5hbWUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICQodGhpcy5zZWwuZmlyc3RuYW1lSW5wdXQpLnZhbChmaXJzdG5hbWUpO1xyXG5cclxuICAgICAgaWYgKCQudHJpbShmaXJzdG5hbWUpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkKHRoaXMuc2VsLnVzZXJGaXJzdG5hbWVFbGVtZW50KS50ZXh0KGZpcnN0bmFtZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGxhc3RuYW1lICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAkKHRoaXMuc2VsLmxhc3RuYW1lSW5wdXQpLnZhbChsYXN0bmFtZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzaG93TG9nZ2VkSW5FbGVtZW50cyh0b2tlbkRhdGEpIHtcclxuICAgIGxldCBmaXJzdG5hbWUgPSB1cmwodGhpcy5zZWwuZmlyc3RuYW1lUVNQKTtcclxuXHJcbiAgICBpZiAoKHR5cGVvZiBmaXJzdG5hbWUgPT09ICd1bmRlZmluZWQnKSB8fCAoJC50cmltKGZpcnN0bmFtZSkubGVuZ3RoID09PSAwKSkge1xyXG4gICAgICAkKHRoaXMuc2VsLnVzZXJGaXJzdG5hbWVFbGVtZW50KS50ZXh0KHRva2VuRGF0YS5uYW1lKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBTaGlwRm9ybSgpO1xyXG4iLCJjbGFzcyBTaGlwTm93Rm9ybSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgZm9ybTogJ2Zvcm0uZm9ybXMuc2hpcC1ub3cnLFxyXG4gICAgICBjb3VudHJ5c2VsZWN0OiAnZm9ybS5mb3Jtcy5zaGlwLW5vdyAjc2hpcG5vd19jb3VudHJ5J1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmdldFBhdGhQcmVmaXggPSB0aGlzLmdldFBhdGhQcmVmaXguYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnRvZ2dsZUFkZHJlc3MgPSB0aGlzLnRvZ2dsZUFkZHJlc3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc3VibWl0Rm9ybSA9IHRoaXMuc3VibWl0Rm9ybS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRGb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd1N1Y2Nlc3MgPSB0aGlzLnNob3dTdWNjZXNzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dFcnJvciA9IHRoaXMuc2hvd0Vycm9yLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UGF0aFByZWZpeCgpIHtcclxuICAgIGNvbnN0IHByZWZpeCA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLXByZWZpeFxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XHJcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgdGhpcy5zZWwuY291bnRyeXNlbGVjdCwgdGhpcy50b2dnbGVBZGRyZXNzKTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdzdWJtaXQnLCB0aGlzLnNlbC5mb3JtLCB0aGlzLnN1Ym1pdEZvcm0pO1xyXG5cclxuICAgIHZhciBjb3VudHJ5ID0gJCh0aGlzLnNlbC5mb3JtKS5kYXRhKCdwcmVzZWxlY3Rjb3VudHJ5Jyk7XHJcbiAgICBpZiAoKGNvdW50cnkgIT09IG51bGwpICYmICQudHJpbShjb3VudHJ5KS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICQodGhpcy5zZWwuY291bnRyeXNlbGVjdCkudmFsKGNvdW50cnkpLnRyaWdnZXIoJ2NoYW5nZScpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGUoKSB7XHJcbiAgICAkKHRoaXMuc2VsLmZvcm0pLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICQoaXRlbSkudmFsaWRhdGUoe1xyXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmlzKCdzZWxlY3QnKSkge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5maW5kKCcuc2VsZWN0Ym94aXQtYnRuJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1Y2Nlc3M6IChsYWJlbCkgPT4ge1xyXG4gICAgICAgICAgbGV0ICRwYXJlbnQgPSAkKGxhYmVsKS5wYXJlbnRzKCdmb3JtLnNoaXAtbm93Jyk7XHJcbiAgICAgICAgICBpZiAoJHBhcmVudC5maW5kKCdzZWxlY3QnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLnNlbGVjdGJveGl0LWJ0bicpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZUFkZHJlc3MoZSkge1xyXG4gICAgdmFyIHZhbCA9ICQodGhpcy5zZWwuY291bnRyeXNlbGVjdCkudmFsKCk7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSAkKCdvcHRpb24nLCB0aGlzLnNlbC5jb3VudHJ5c2VsZWN0KTtcclxuICAgIHZhciBtYW5kYXRvcnkgPSB0cnVlO1xyXG4gICAgb3B0aW9ucy5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xyXG4gICAgICBpZiAoJChpdGVtKS5hdHRyKCd2YWx1ZScpID09PSB2YWwgJiYgKCcnICsgJChpdGVtKS5kYXRhKCdub25tYW5kYXRvcnknKSkgPT09ICd0cnVlJykge1xyXG4gICAgICAgIG1hbmRhdG9yeSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAobWFuZGF0b3J5KSB7XHJcbiAgICAgICQoJyNzaGlwbm93X2FkZHJlc3MnLCB0aGlzLnNlbC5mb3JtKS5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0FkZHJlc3MqJyk7XHJcbiAgICAgICQoJyNzaGlwbm93X3ppcCcsIHRoaXMuc2VsLmZvcm0pLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnWklQIG9yIFBvc3Rjb2RlKicpO1xyXG4gICAgICAkKCcjc2hpcG5vd19jaXR5JywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdDaXR5KicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnI3NoaXBub3dfYWRkcmVzcycsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQWRkcmVzcycpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmNsb3Nlc3QoJ2RpdicpLmZpbmQoJ2xhYmVsJykucmVtb3ZlKCk7XHJcbiAgICAgICQoJyNzaGlwbm93X3ppcCcsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnWklQIG9yIFBvc3Rjb2RlJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuY2xvc2VzdCgnZGl2JykuZmluZCgnbGFiZWwnKS5yZW1vdmUoKTtcclxuICAgICAgJCgnI3NoaXBub3dfY2l0eScsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQ2l0eScpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmNsb3Nlc3QoJ2RpdicpLmZpbmQoJ2xhYmVsJykucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdWJtaXRGb3JtKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCAkZm9ybSA9ICQoZS50YXJnZXQpO1xyXG4gICAgbGV0IGZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YSgkZm9ybSk7XHJcbiAgICAkLnBvc3QodGhpcy5nZXRQYXRoUHJlZml4KCkgKyAkZm9ybS5hdHRyKCdhY3Rpb24nKSwgZm9ybURhdGEsIChkYXRhKSA9PiB7XHJcbiAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ09LJykge1xyXG4gICAgICAgIHRoaXMuc2hvd1N1Y2Nlc3MoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNob3dFcnJvcigpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEZvcm1EYXRhKCRmb3JtKSB7XHJcbiAgICBsZXQgdW5pbmRleGVkQXJyYXkgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgbGV0IGluZGV4ZWRBcnJheSA9IHt9O1xyXG4gICAgJC5tYXAodW5pbmRleGVkQXJyYXksIChuKSA9PiAoaW5kZXhlZEFycmF5W24ubmFtZV0gPSBuLnZhbHVlKSk7XHJcblxyXG4gICAgaW5kZXhlZEFycmF5LnNvdXJjZSA9ICQudHJpbSgkZm9ybS5kYXRhKCdzb3VyY2UnKSk7XHJcbiAgICBpbmRleGVkQXJyYXkubG8gPSAkLnRyaW0oJGZvcm0uZGF0YSgnbG8nKSk7XHJcblxyXG4gICAgcmV0dXJuIGluZGV4ZWRBcnJheTtcclxuICB9XHJcblxyXG4gIHNob3dTdWNjZXNzKCkge1xyXG4gICAgd2luZG93LmxvY2F0aW9uID0gJCh0aGlzLnNlbC5mb3JtKS5kYXRhKCd0aGFua3MnKTtcclxuICB9XHJcblxyXG4gIHNob3dFcnJvcigpIHtcclxuICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZC4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5mb3JtKS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICB0aGlzLnZhbGlkYXRlKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBTaGlwTm93Rm9ybSgpO1xyXG4iLCJjbGFzcyBTaGlwTm93VHdvU3RlcEZvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5maXJzdG5hbWUgPSAnJztcclxuICAgIHRoaXMubGFzdG5hbWUgPSAnJztcclxuICAgIHRoaXMuZW1haWwgPSAnJztcclxuXHJcbiAgICB0aGlzLmNvbmZpZyA9IHtcclxuICAgICAgLy8gZmJBcHBJZDogJzEwMDA3NzMxNjMzMzc3OTgnLFxyXG4gICAgICBmYkFwcElkOiAnMTA4MDAzMTMyODgwMTIxMScsXHJcbiAgICAgIC8vIGdvQ2xpZW50SWQ6ICc5MTM5NjAzNTIyMzYtdTd1bjBsMjJ0dmttbGJwYTViY25mMXVxZzRjc2k3ZTMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nLFxyXG4gICAgICBnb0NsaWVudElkOiAnMzEzNDY5ODM3NDIwLWw4ODJoMzlnZThuOG45cGI5N2xkdmprM2ZtOHBwcWdzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLnNoaXBOb3dNdWx0aS53eXNpd3lnLCAuYW5pbWF0ZWRGb3JtJyxcclxuICAgICAgc3dpbmdidXR0b246ICcuc2hpcE5vd011bHRpX19oZWFkY3RhLS1yZWQnLFxyXG4gICAgICBmb3JtczogJ2Zvcm0uZm9ybXMuc2hpcC1ub3ctdHdvc3RlcCcsXHJcbiAgICAgIGZvcm0xOiAnZm9ybS5mb3Jtcy5mb3JtMS5zaGlwLW5vdy10d29zdGVwJyxcclxuICAgICAgZm9ybTI6ICdmb3JtLmZvcm1zLmZvcm0yLnNoaXAtbm93LXR3b3N0ZXAnLFxyXG4gICAgICBjb3VudHJ5c2VsZWN0OiAnZm9ybS5mb3Jtcy5mb3JtMi5zaGlwLW5vdy10d29zdGVwICNzaGlwbm93X2NvdW50cnknLFxyXG5cclxuICAgICAgYnV0dG9uRmFjZWJvb2s6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmZhY2Vib29rJyxcclxuICAgICAgYnV0dG9uTGlua2VkaW46ICcuZm9ybXNfX2N0YS0tc29jaWFsLmxpbmtlZGluJyxcclxuICAgICAgYnV0dG9uR29vZ2xlUGx1czogJy5mb3Jtc19fY3RhLS1zb2NpYWwuZ29vZ2xlJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmdldFBhdGhQcmVmaXggPSB0aGlzLmdldFBhdGhQcmVmaXguYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy50b2dnbGVBZGRyZXNzID0gdGhpcy50b2dnbGVBZGRyZXNzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnN1Ym1pdEZhY2Vib29rID0gdGhpcy5zdWJtaXRGYWNlYm9vay5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zdWJtaXRMaW5rZWRpbiA9IHRoaXMuc3VibWl0TGlua2VkaW4uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc3VibWl0R29vZ2xlID0gdGhpcy5zdWJtaXRHb29nbGUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc3VibWl0Rm9ybTEgPSB0aGlzLnN1Ym1pdEZvcm0xLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm5leHRGb3JtID0gdGhpcy5uZXh0Rm9ybS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zdWJtaXRGb3JtMiA9IHRoaXMuc3VibWl0Rm9ybTIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Rm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dTdWNjZXNzID0gdGhpcy5zaG93U3VjY2Vzcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy52YWxpZGF0ZSA9IHRoaXMudmFsaWRhdGUuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldFBhdGhQcmVmaXgoKSB7XHJcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xyXG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ3N1Ym1pdCcsIHRoaXMuc2VsLmZvcm0xLCB0aGlzLnN1Ym1pdEZvcm0xKTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdzdWJtaXQnLCB0aGlzLnNlbC5mb3JtMiwgdGhpcy5zdWJtaXRGb3JtMik7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgdGhpcy5zZWwuY291bnRyeXNlbGVjdCwgdGhpcy50b2dnbGVBZGRyZXNzKTtcclxuXHJcbiAgICB2YXIgY291bnRyeSA9ICQodGhpcy5zZWwuZm9ybTIpLmRhdGEoJ3ByZXNlbGVjdGNvdW50cnknKTtcclxuICAgIGlmICgoY291bnRyeSAhPT0gbnVsbCkgJiYgJC50cmltKGNvdW50cnkpLmxlbmd0aCA+IDApIHtcclxuICAgICAgJCh0aGlzLnNlbC5jb3VudHJ5c2VsZWN0KS52YWwoY291bnRyeSkudHJpZ2dlcignY2hhbmdlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkZhY2Vib29rKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHdpbmRvdy5mYkFzeW5jSW5pdCA9ICgpID0+IHtcclxuICAgICAgICB3aW5kb3cuZmJfaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mICh3aW5kb3cuRkIpICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuRkIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgd2luZG93LkZCLmluaXQoe1xyXG4gICAgICAgICAgICAgIGFwcElkOiB0aGlzLmNvbmZpZy5mYkFwcElkLFxyXG4gICAgICAgICAgICAgIGNvb2tpZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB4ZmJtbDogdHJ1ZSxcclxuICAgICAgICAgICAgICB2ZXJzaW9uOiAndjIuOCdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHdpbmRvdy5mYl9pbnRlcnZhbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmFjZWJvb2stanNzZGsnKSA9PT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBmanMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XHJcbiAgICAgICAgdmFyIGpzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAganMuaWQgPSAnZmFjZWJvb2stanNzZGsnO1xyXG4gICAgICAgIGpzLnNyYyA9ICcvL2Nvbm5lY3QuZmFjZWJvb2submV0L2VuX0VOL3Nkay5qcyc7XHJcbiAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xyXG4gICAgICB9XHJcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkZhY2Vib29rKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgdGhpcy5zdWJtaXRGYWNlYm9vayhldnQpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgdGhpcy5zdWJtaXRMaW5rZWRpbihldnQpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGdvb2dsZUJ1dHRvbiA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpO1xyXG4gICAgaWYgKGdvb2dsZUJ1dHRvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHdpbmRvdy5nb19pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mICh3aW5kb3cuZ2FwaSkgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5nYXBpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICB3aW5kb3cuZ2FwaS5sb2FkKCdhdXRoMicsICgpID0+IHtcclxuICAgICAgICAgICAgdmFyIGF1dGgyID0gd2luZG93LmdhcGkuYXV0aDIuaW5pdCh7XHJcbiAgICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNvbmZpZy5nb0NsaWVudElkLFxyXG4gICAgICAgICAgICAgIGNvb2tpZXBvbGljeTogJ3NpbmdsZV9ob3N0X29yaWdpbidcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGdvb2dsZUJ1dHRvbi5nZXQoMCk7XHJcbiAgICAgICAgICAgIGF1dGgyLmF0dGFjaENsaWNrSGFuZGxlcihlbGVtZW50LCB7fSxcclxuICAgICAgICAgICAgICAoZ29vZ2xlVXNlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdWJtaXRHb29nbGUoZ29vZ2xlVXNlcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yICE9PSAncG9wdXBfY2xvc2VkX2J5X3VzZXInKSB7XHJcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KHJlc3VsdC5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZ29faW50ZXJ2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgMTAwKTtcclxuXHJcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpLm9uKCdjbGljaycsIChldnQpID0+IHtcclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnN3aW5nYnV0dG9uLCAoZXZ0KSA9PiB7XHJcbiAgICAgIHZhciBpZCA9ICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgdmFyIG9mZnNldCA9ICQoaWQpLm9mZnNldCgpLnRvcDtcclxuICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgIHNjcm9sbFRvcDogb2Zmc2V0XHJcbiAgICAgIH0sIDEwMDAsICdzd2luZycpO1xyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZSgpIHtcclxuICAgICQodGhpcy5zZWwuZm9ybXMpLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XHJcbiAgICAgICQoaXRlbSkudmFsaWRhdGUoe1xyXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmlzKCdzZWxlY3QnKSkge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5maW5kKCcuc2VsZWN0Ym94aXQtYnRuJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1Y2Nlc3M6IChsYWJlbCkgPT4ge1xyXG4gICAgICAgICAgbGV0ICRwYXJlbnQgPSAkKGxhYmVsKS5wYXJlbnRzKCdmb3JtLnNoaXAtbm93Jyk7XHJcbiAgICAgICAgICBpZiAoJHBhcmVudC5maW5kKCdzZWxlY3QnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLnNlbGVjdGJveGl0LWJ0bicpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZUFkZHJlc3MoZSkge1xyXG4gICAgdmFyIHZhbCA9ICQodGhpcy5zZWwuY291bnRyeXNlbGVjdCkudmFsKCk7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSAkKCdvcHRpb24nLCB0aGlzLnNlbC5jb3VudHJ5c2VsZWN0KTtcclxuICAgIHZhciBtYW5kYXRvcnkgPSB0cnVlO1xyXG4gICAgb3B0aW9ucy5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xyXG4gICAgICBpZiAoJChpdGVtKS5hdHRyKCd2YWx1ZScpID09PSB2YWwgJiYgKCcnICsgJChpdGVtKS5kYXRhKCdub25tYW5kYXRvcnknKSkgPT09ICd0cnVlJykge1xyXG4gICAgICAgIG1hbmRhdG9yeSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAobWFuZGF0b3J5KSB7XHJcbiAgICAgICQoJyNzaGlwbm93X2FkZHJlc3MnLCB0aGlzLnNlbC5mb3JtKS5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0FkZHJlc3MqJyk7XHJcbiAgICAgICQoJyNzaGlwbm93X3ppcCcsIHRoaXMuc2VsLmZvcm0pLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnWklQIG9yIFBvc3Rjb2RlKicpO1xyXG4gICAgICAkKCcjc2hpcG5vd19jaXR5JywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdDaXR5KicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnI3NoaXBub3dfYWRkcmVzcycsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQWRkcmVzcycpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmNsb3Nlc3QoJ2RpdicpLmZpbmQoJ2xhYmVsJykucmVtb3ZlKCk7XHJcbiAgICAgICQoJyNzaGlwbm93X3ppcCcsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnWklQIG9yIFBvc3Rjb2RlJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuY2xvc2VzdCgnZGl2JykuZmluZCgnbGFiZWwnKS5yZW1vdmUoKTtcclxuICAgICAgJCgnI3NoaXBub3dfY2l0eScsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQ2l0eScpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmNsb3Nlc3QoJ2RpdicpLmZpbmQoJ2xhYmVsJykucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdWJtaXRGYWNlYm9vayhldnQpIHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHdpbmRvdy5GQi5sb2dpbigobG9naW5SZXNwb25zZSkgPT4ge1xyXG4gICAgICBpZiAobG9naW5SZXNwb25zZS5hdXRoUmVzcG9uc2UpIHtcclxuICAgICAgICB3aW5kb3cuRkIuYXBpKCcvbWUnLCAoZGF0YVJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmZpcnN0bmFtZSA9IGRhdGFSZXNwb25zZS5maXJzdF9uYW1lO1xyXG4gICAgICAgICAgdGhpcy5sYXN0bmFtZSA9IGRhdGFSZXNwb25zZS5sYXN0X25hbWU7XHJcbiAgICAgICAgICB0aGlzLmVtYWlsID0gZGF0YVJlc3BvbnNlLmVtYWlsO1xyXG5cclxuICAgICAgICAgIHRoaXMubmV4dEZvcm0oKTtcclxuICAgICAgICB9LCB7IGZpZWxkczogWyAnaWQnLCAnZW1haWwnLCAnZmlyc3RfbmFtZScsICdsYXN0X25hbWUnIF19KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LCB7IHNjb3BlOiAnZW1haWwscHVibGljX3Byb2ZpbGUnLCByZXR1cm5fc2NvcGVzOiB0cnVlIH0pO1xyXG4gIH1cclxuXHJcbiAgc3VibWl0TGlua2VkaW4oZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBJTi5Vc2VyLmF1dGhvcml6ZSgoKSA9PiB7XHJcbiAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgdmFyIG1lbWJlciA9IHJlc3VsdC52YWx1ZXNbMF07XHJcblxyXG4gICAgICAgIHRoaXMuZmlyc3RuYW1lID0gbWVtYmVyLmZpcnN0TmFtZTtcclxuICAgICAgICB0aGlzLmxhc3RuYW1lID0gbWVtYmVyLmxhc3ROYW1lO1xyXG4gICAgICAgIHRoaXMuZW1haWwgPSBtZW1iZXIuZW1haWxBZGRyZXNzO1xyXG5cclxuICAgICAgICB0aGlzLm5leHRGb3JtKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICB2YXIgcmVzdWx0ID0gd2luZG93LklOLlVzZXIuaXNBdXRob3JpemVkKCk7XHJcbiAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICBJTi5BUEkuUHJvZmlsZSgnbWUnKS5maWVsZHMoJ2lkJywgJ2ZpcnN0LW5hbWUnLCAnbGFzdC1uYW1lJywgJ2VtYWlsLWFkZHJlc3MnKS5yZXN1bHQoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgdmFyIG1lbWJlciA9IHJlc3VsdC52YWx1ZXNbMF07XHJcbiAgXHJcbiAgICAgICAgICB0aGlzLmZpcnN0bmFtZSA9IG1lbWJlci5maXJzdE5hbWU7XHJcbiAgICAgICAgICB0aGlzLmxhc3RuYW1lID0gbWVtYmVyLmxhc3ROYW1lO1xyXG4gICAgICAgICAgdGhpcy5lbWFpbCA9IG1lbWJlci5lbWFpbEFkZHJlc3M7XHJcbiAgXHJcbiAgICAgICAgICB0aGlzLm5leHRGb3JtKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0sIDEwMDApO1xyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHN1Ym1pdEdvb2dsZShnb29nbGVVc2VyKSB7XHJcbiAgICB2YXIgYmFzaWNQcm9maWxlID0gZ29vZ2xlVXNlci5nZXRCYXNpY1Byb2ZpbGUoKTtcclxuXHJcbiAgICB0aGlzLmZpcnN0bmFtZSA9IGJhc2ljUHJvZmlsZS5nZXRHaXZlbk5hbWUoKTtcclxuICAgIHRoaXMubGFzdG5hbWUgPSBiYXNpY1Byb2ZpbGUuZ2V0RmFtaWx5TmFtZSgpO1xyXG4gICAgdGhpcy5lbWFpbCA9IGJhc2ljUHJvZmlsZS5nZXRFbWFpbCgpO1xyXG5cclxuICAgIHRoaXMubmV4dEZvcm0oKTtcclxuICB9XHJcblxyXG4gIHN1Ym1pdEZvcm0xKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCAkZm9ybSA9ICQoZS50YXJnZXQpO1xyXG4gICAgbGV0IGZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YSgkZm9ybSk7XHJcblxyXG4gICAgdGhpcy5maXJzdG5hbWUgPSBmb3JtRGF0YS5maXJzdG5hbWU7XHJcbiAgICB0aGlzLmxhc3RuYW1lID0gZm9ybURhdGEubGFzdG5hbWU7XHJcbiAgICB0aGlzLmVtYWlsID0gZm9ybURhdGEuZW1haWw7XHJcblxyXG4gICAgdGhpcy5uZXh0Rm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgbmV4dEZvcm0oKSB7XHJcbiAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDEnLCB0aGlzLnNlbC5jb21wb25lbnQpLmhpZGUoKTtcclxuICAgICQoJy5zaGlwTm93TXVsdGlfX2Zvcm1zdGVwLS1zdGVwMicsIHRoaXMuc2VsLmNvbXBvbmVudCkuc2hvdygpO1xyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIHN1Ym1pdEZvcm0yKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCAkZm9ybSA9ICQoZS50YXJnZXQpO1xyXG4gICAgbGV0IGZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YSgkZm9ybSk7XHJcbiAgICBmb3JtRGF0YS5maXJzdG5hbWUgPSB0aGlzLmZpcnN0bmFtZTtcclxuICAgIGZvcm1EYXRhLmxhc3RuYW1lID0gdGhpcy5sYXN0bmFtZTtcclxuICAgIGZvcm1EYXRhLmVtYWlsID0gdGhpcy5lbWFpbDtcclxuXHJcbiAgICAkLnBvc3QodGhpcy5nZXRQYXRoUHJlZml4KCkgKyAkZm9ybS5hdHRyKCdhY3Rpb24nKSwgZm9ybURhdGEsIChkYXRhKSA9PiB7XHJcbiAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ09LJykge1xyXG4gICAgICAgIHRoaXMuc2hvd1N1Y2Nlc3MoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Rm9ybURhdGEoJGZvcm0pIHtcclxuICAgIGxldCB1bmluZGV4ZWRBcnJheSA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XHJcbiAgICBsZXQgaW5kZXhlZEFycmF5ID0ge307XHJcbiAgICAkLm1hcCh1bmluZGV4ZWRBcnJheSwgKG4pID0+IChpbmRleGVkQXJyYXlbbi5uYW1lXSA9IG4udmFsdWUpKTtcclxuXHJcbiAgICBpbmRleGVkQXJyYXkuc291cmNlID0gJC50cmltKCRmb3JtLmRhdGEoJ3NvdXJjZScpKTtcclxuICAgIGluZGV4ZWRBcnJheS5sbyA9ICQudHJpbSgkZm9ybS5kYXRhKCdsbycpKTtcclxuXHJcbiAgICByZXR1cm4gaW5kZXhlZEFycmF5O1xyXG4gIH1cclxuXHJcbiAgc2hvd1N1Y2Nlc3MoKSB7XHJcbiAgICB2YXIgdGhhbmtzID0gJCgnLnNoaXBOb3dNdWx0aV9fZm9ybXN0ZXAtLXN0ZXAyJywgdGhpcy5zZWwuY29tcG9uZW50KS5kYXRhKFwidGhhbmtzXCIpO1xyXG4gICAgaWYgKCh0aGFua3MgIT09IG51bGwpICYmICh0aGFua3MubGVuZ3RoID4gMCkpIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhhbmtzO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnLnNoaXBOb3dNdWx0aV9fZm9ybXN0ZXAtLXN0ZXAyJywgdGhpcy5zZWwuY29tcG9uZW50KS5oaWRlKCk7XHJcbiAgICAgICQoJy5zaGlwTm93TXVsdGlfX2Zvcm1zdGVwLS10aGFua3MnLCB0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHRoaXMudmFsaWRhdGUoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IFNoaXBOb3dUd29TdGVwRm9ybSgpO1xyXG4iLCJjbGFzcyBTaG93SGlkZSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnW2RhdGEtc2hvdy1oaWRlLWlkXScsXHJcbiAgICAgIHRvZ2dsZTogJ1tkYXRhLXNob3ctaGlkZS10YXJnZXRdJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwudG9nZ2xlLCAoZSkgPT4ge1xyXG4gICAgICBjb25zdCBzaG93SGlkZVRhcmdldCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtc2hvdy1oaWRlLXRhcmdldCcpO1xyXG4gICAgICAkKCdbZGF0YS1zaG93LWhpZGUtaWQ9JyArIHNob3dIaWRlVGFyZ2V0ICsgJ10nKS5zbGlkZVRvZ2dsZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgU2hvd0hpZGUoKTtcclxuIiwiY2xhc3MgU29jaWFsIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuc29jaWFsJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY29udGFpbmVyVG9wID0gdGhpcy5jb250YWluZXJUb3AuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaGFuZGxlU2Nyb2xsID0gdGhpcy5oYW5kbGVTY3JvbGwuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hlY2tTaGFyZVBvcyA9IHRoaXMuY2hlY2tTaGFyZVBvcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kZWJvdW5jZSA9IHRoaXMuZGVib3VuY2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhhbmRsZVNjcm9sbCk7XHJcbiAgfVxyXG5cclxuICBjb250YWluZXJUb3AoKSB7XHJcbiAgICByZXR1cm4gJCh0aGlzLnNlbC5jb21wb25lbnQpLnBhcmVudCgpLnBvc2l0aW9uKCkudG9wO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlU2Nyb2xsKCkge1xyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IDk5Mikge1xyXG4gICAgICBsZXQgaGVpZ2h0ID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG4gICAgICBsZXQgYm90dG9tID0gdGhpcy5jb250YWluZXJUb3AoKSArICQodGhpcy5zZWwuY29tcG9uZW50KS5wYXJlbnQoKS5oZWlnaHQoKSAtICQodGhpcy5zZWwuY29tcG9uZW50KS5vdXRlckhlaWdodCgpIC0gNjA7XHJcbiAgICAgIGlmIChoZWlnaHQgPj0gdGhpcy5jb250YWluZXJUb3AoKSAmJiBoZWlnaHQgPCBib3R0b20gJiYgISQodGhpcy5zZWwuY29tcG9uZW50KS5oYXNDbGFzcygnc29jaWFsLS1hZmZpeCcpKSB7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpXHJcbiAgICAgICAgICAuYWRkQ2xhc3MoJ3NvY2lhbC0tYWZmaXgnKVxyXG4gICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICdsZWZ0JzogdGhpcy5nZXRMZWZ0T2Zmc2V0KCQodGhpcy5zZWwuY29tcG9uZW50KSksXHJcbiAgICAgICAgICAgICd0b3AnOiAnJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaGVpZ2h0IDwgdGhpcy5jb250YWluZXJUb3AoKSAmJiAkKHRoaXMuc2VsLmNvbXBvbmVudCkuaGFzQ2xhc3MoJ3NvY2lhbC0tYWZmaXgnKSkge1xyXG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KVxyXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCdzb2NpYWwtLWFmZml4JylcclxuICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAnbGVmdCc6ICcnLFxyXG4gICAgICAgICAgICAndG9wJzogJydcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2UgaWYgKGhlaWdodCA+PSBib3R0b20gJiYgJCh0aGlzLnNlbC5jb21wb25lbnQpLmhhc0NsYXNzKCdzb2NpYWwtLWFmZml4JykpIHtcclxuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudClcclxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnc29jaWFsLS1hZmZpeCcpXHJcbiAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgJ2xlZnQnOiAnJyxcclxuICAgICAgICAgICAgJ3RvcCc6IHRoaXMuZ2V0VG9wT2Zmc2V0KClcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRMZWZ0T2Zmc2V0KCRlbG0pIHtcclxuICAgIGxldCBwYXJlbnRPZmZzZXQgPSBwYXJzZUludCgkZWxtLnBhcmVudCgpLm9mZnNldCgpLmxlZnQsIDEwKTtcclxuICAgIGxldCBteU9mZnNldCA9IHBhcnNlSW50KCRlbG0ub2Zmc2V0KCkubGVmdCwgMTApO1xyXG4gICAgcmV0dXJuIChwYXJlbnRPZmZzZXQgKyBteU9mZnNldCk7XHJcbiAgfVxyXG5cclxuICBnZXRUb3BPZmZzZXQoKSB7XHJcbiAgICBsZXQgcGFyZW50T2Zmc2V0ID0gdGhpcy5jb250YWluZXJUb3AoKTtcclxuICAgIGxldCBzY3JvbGxQb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcbiAgICBsZXQgdG9wID0gc2Nyb2xsUG9zIC0gcGFyZW50T2Zmc2V0ICsgNTA7XHJcbiAgICByZXR1cm4gdG9wO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tTaGFyZVBvcygpIHtcclxuICAgIGlmICgkKCcuc29jaWFsLS12ZXJ0aWNhbC5zb2NpYWwtLWFmZml4JykubGVuZ3RoKSB7XHJcbiAgICAgICQoJy5zb2NpYWwtLXZlcnRpY2FsLnNvY2lhbC0tYWZmaXgnKS5yZW1vdmVBdHRyKCdzdHlsZScpLnJlbW92ZUNsYXNzKCdzb2NpYWwtLWFmZml4Jyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBEZWJvdXRjZSBmdW5jdGlvblxyXG4gIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xyXG4gICAgdmFyIHRpbWVvdXQ7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XHJcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGltZW91dCA9IG51bGw7XHJcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgIH07XHJcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcclxuICAgICAgaWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuZGVib3VuY2UodGhpcy5jaGVja1NoYXJlUG9zLCAxMDApKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IFNvY2lhbCgpO1xyXG4iLCJjbGFzcyBTdWJzY3JpYmVQYW5lbCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLnN1YnNjcmliZVBhbmVsJyxcclxuICAgICAgZm9ybTogJy5zdWJzY3JpYmVQYW5lbF9fZm9ybScsXHJcbiAgICAgIHN1Y2Nlc3NPdmVybGF5OiAnLnN1YnNjcmliZVBhbmVsX19yZXNwb25zZU92ZXJsYXkuc3VjY2VzcycsXHJcbiAgICAgIGVycm9yT3ZlcmxheTogJy5zdWJzY3JpYmVQYW5lbF9fcmVzcG9uc2VPdmVybGF5LmVycm9yJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmdldFBhdGhQcmVmaXggPSB0aGlzLmdldFBhdGhQcmVmaXguYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnN1Ym1pdEZvcm0gPSB0aGlzLnN1Ym1pdEZvcm0uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0Rm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dTdWNjZXNzID0gdGhpcy5zaG93U3VjY2Vzcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zaG93RXJyb3IgPSB0aGlzLnNob3dFcnJvci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy52YWxpZGF0ZSA9IHRoaXMudmFsaWRhdGUuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldFBhdGhQcmVmaXgoKSB7XHJcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xyXG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ3N1Ym1pdCcsIHRoaXMuc2VsLmZvcm0sIHRoaXMuc3VibWl0Rm9ybSk7XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZSgpIHtcclxuICAgICQodGhpcy5zZWwuZm9ybSkuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgJChpdGVtKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaXMoJ3NlbGVjdCcpKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQucGFyZW50KCkpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLmZpbmQoJy5zZWxlY3Rib3hpdC1idG4nKS5hZGRDbGFzcygnZXJyb3InKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3VjY2VzczogKGxhYmVsKSA9PiB7XHJcbiAgICAgICAgICBsZXQgJHBhcmVudCA9ICQobGFiZWwpLnBhcmVudHMoJy5zdWJzY3JpYmVfX2Zvcm1GaWVsZCcpO1xyXG4gICAgICAgICAgaWYgKCRwYXJlbnQuZmluZCgnc2VsZWN0JykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkcGFyZW50LmZpbmQoJy5zZWxlY3Rib3hpdC1idG4nKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzdWJtaXRGb3JtKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCAkZm9ybSA9ICQoZS50YXJnZXQpO1xyXG4gICAgbGV0IGZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YSgkZm9ybSk7XHJcbiAgICAkLnBvc3QodGhpcy5nZXRQYXRoUHJlZml4KCkgKyAkZm9ybS5hdHRyKCdhY3Rpb24nKSwgZm9ybURhdGEsIChkYXRhKSA9PiB7XHJcbiAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ09LJykge1xyXG4gICAgICAgIHRoaXMuc2hvd1N1Y2Nlc3MoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNob3dFcnJvcigpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEZvcm1EYXRhKCRmb3JtKSB7XHJcbiAgICBsZXQgdW5pbmRleGVkQXJyYXkgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgbGV0IGluZGV4ZWRBcnJheSA9IHt9O1xyXG4gICAgJC5tYXAodW5pbmRleGVkQXJyYXksIChuKSA9PiAoaW5kZXhlZEFycmF5W24ubmFtZV0gPSBuLnZhbHVlKSk7XHJcbiAgICByZXR1cm4gaW5kZXhlZEFycmF5O1xyXG4gIH1cclxuXHJcbiAgc2hvd1N1Y2Nlc3MoKSB7XHJcbiAgICAkKHRoaXMuc2VsLnN1Y2Nlc3NPdmVybGF5KS5hZGRDbGFzcygnc3Vic2NyaWJlUGFuZWxfX3Jlc3BvbnNlT3ZlcmxheS0tc2hvdycpO1xyXG4gIH1cclxuXHJcbiAgc2hvd0Vycm9yKCkge1xyXG4gICAgJCh0aGlzLnNlbC5lcnJvck92ZXJsYXkpLmFkZENsYXNzKCdzdWJzY3JpYmVQYW5lbF9fcmVzcG9uc2VPdmVybGF5LS1zaG93Jyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICB0aGlzLnZhbGlkYXRlKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBTdWJzY3JpYmVQYW5lbCgpO1xyXG4iLCJjbGFzcyBUb2FzdCB7XHJcbiAgY29uc3RydWN0b3IodGV4dCwgZHVyYXRpb24pIHtcclxuICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICB0aGlzLmR1cmF0aW9uID0gZHVyYXRpb247XHJcbiAgICB0aGlzLmlkID0gJ18nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpO1xyXG5cclxuICAgIHRoaXMuc2V0VGV4dCA9IHRoaXMuc2V0VGV4dC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZXREdXJhdGlvbiA9IHRoaXMuc2V0RHVyYXRpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvdyA9IHRoaXMuc2hvdy5iaW5kKHRoaXMpO1xyXG5cclxuICAgIGxldCB0b2FzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdG9hc3Quc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuaWQpO1xyXG4gICAgdG9hc3Quc2V0QXR0cmlidXRlKCdjbGFzcycsICd0b2FzdCcpO1xyXG4gICAgbGV0IGlubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBpbm5lci5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2lubmVyJyk7XHJcbiAgICBpbm5lci5pbm5lclRleHQgPSB0aGlzLnRleHQ7XHJcbiAgICB0b2FzdC5hcHBlbmRDaGlsZChpbm5lcik7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvYXN0KTtcclxuICAgIHRoaXMuJHRvYXN0ID0gJCgnIycgKyB0aGlzLmlkKTtcclxuICB9XHJcblxyXG4gIHNldFRleHQodGV4dCkge1xyXG4gICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgIHRoaXMuJHRvYXN0LmZpbmQoJy5pbm5lcicpLnRleHQodGhpcy50ZXh0KTtcclxuICB9XHJcblxyXG4gIHNldER1cmF0aW9uKGR1cmF0aW9uKSB7XHJcbiAgICB0aGlzLmR1cmF0aW9uID0gZHVyYXRpb247XHJcbiAgfVxyXG5cclxuICBzaG93KCkge1xyXG4gICAgdGhpcy4kdG9hc3QuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy4kdG9hc3QucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuICAgIH0sIHRoaXMuZHVyYXRpb24pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVG9hc3Q7XHJcbiIsImNsYXNzIExvZ2luRm9ybSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNvbmZpZyA9IHtcclxuICAgICAgdXJsVG9rZW46ICcvbGlicy9ncmFuaXRlL2NzcmYvdG9rZW4uanNvbicsXHJcbiAgICAgIHVybFJlZnJlc2hDaGVjazogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZWZyZXNoX3Rva2VuL2luZGV4Lmpzb24nLFxyXG4gICAgICB1cmxHZXRBbGxEZXRhaWxzOiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL2dldGRldGFpbHMvaW5kZXguanNvbicsXHJcbiAgICAgIHVybFVwZGF0ZURldGFpbHM6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvdXBkYXRlX2RldGFpbHMvaW5kZXguanNvbidcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5zdGFuZGFyZENvbnRlbnQudXNlci1hY2NvdW50LCAucGFnZS1ib2R5LnVzZXItYWNjb3VudCdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldFBhdGhIb21lID0gdGhpcy5nZXRQYXRoSG9tZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVhZENvb2tpZSA9IHRoaXMucmVhZENvb2tpZS5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMudHJ5VXBkYXRlRGV0YWlscyA9IHRoaXMudHJ5VXBkYXRlRGV0YWlscy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jb21wbGV0ZVVwZGF0ZURldGFpbHMgPSB0aGlzLmNvbXBsZXRlVXBkYXRlRGV0YWlscy5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMubG9nZ2VkSW4gPSB0aGlzLmxvZ2dlZEluLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm5vdExvZ2dlZEluID0gdGhpcy5ub3RMb2dnZWRJbi5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UGF0aFByZWZpeCgpIHtcclxuICAgIGNvbnN0IHByZWZpeCA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLXByZWZpeFxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XHJcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcclxuICB9XHJcblxyXG4gIGdldFBhdGhIb21lKCkge1xyXG4gICAgY29uc3QgaG9tZSA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLWhvbWVcXCddJykuYXR0cignY29udGVudCcpO1xyXG4gICAgcmV0dXJuIChob21lID8gaG9tZSA6ICcnKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQod2luZG93KS5vbigndXNlcmxvZ2dlZGluLkRITCcsIChldnQsIHRva2VuRGF0YSkgPT4ge1xyXG4gICAgICB0aGlzLmxvZ2dlZEluKHRva2VuRGF0YSk7XHJcbiAgICB9KTtcclxuICAgICQod2luZG93KS5vbigndXNlcm5vdGxvZ2dlZGluLkRITCcsICgpID0+IHtcclxuICAgICAgdGhpcy5ub3RMb2dnZWRJbigpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdmFyIGZvcm0gPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnZm9ybScpO1xyXG4gICAgaWYgKGZvcm0ubGVuZ3RoID4gMCkge1xyXG4gICAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnbXlBY2NvdW50Q3VycmVudFBhc3N3b3JkJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgdmFyICRwYXJlbnQgPSAkKGVsZW1lbnQpLnBhcmVudHMoJ2Zvcm0nKTtcclxuICAgICAgICB2YXIgJGN1cnJlbnRQYXNzd29yZENvbnRhaW5lciA9ICRwYXJlbnQuZmluZCgnLnVzZXJhY2NvdW50LWN1cnJlbnRwYXNzd29yZCcpO1xyXG4gICAgICAgIHZhciAkbmV3UGFzc3dvcmQgPSAkcGFyZW50LmZpbmQoJ2lucHV0W25hbWU9XCJteUFjY291bnRfX25ld1Bhc3N3b3JkXCJdJyk7XHJcbiAgICAgICAgdmFyICRjb25maXJtUGFzc3dvcmQgPSAkcGFyZW50LmZpbmQoJ2lucHV0W25hbWU9XCJteUFjY291bnRfX2NvbmZpcm1QYXNzd29yZFwiXScpO1xyXG5cclxuICAgICAgICByZXR1cm4gKCgkbmV3UGFzc3dvcmQudmFsKCkgPT09ICcnICYmICRjb25maXJtUGFzc3dvcmQudmFsKCkgPT09ICcnKSB8fCAoJGN1cnJlbnRQYXNzd29yZENvbnRhaW5lci5pcygnOnZpc2libGUnKSAmJiAkKGVsZW1lbnQpLnZhbCgpICE9PSAnJykpO1xyXG4gICAgICB9LCAnWW91IG11c3QgZW50ZXIgeW91ciBjdXJyZW50IHBhc3N3b3JkJyk7XHJcblxyXG4gICAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnbXlBY2NvdW50UGFzc3dvcmQnLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICBpZiAoJChlbGVtZW50KS52YWwoKSA9PT0gJycpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKC9eKD89LipbYS16XSkoPz0uKltBLVpdKSg/PS4qXFxkKSg/PS4qW19cXFddKVtBLVphLXpcXGRfXFxXXXs4LH0kLykudGVzdCh2YWx1ZSk7XHJcbiAgICAgIH0sICdQYXNzd29yZCBmb3JtYXQgaXMgbm90IHZhbGlkJyk7XHJcblxyXG4gICAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnbXlBY2NvdW50RXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoJCgnIycgKyAkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtZXF1YWxUbycpKS52YWwoKSA9PT0gJChlbGVtZW50KS52YWwoKSk7XHJcbiAgICAgIH0sICdQYXNzd29yZHMgZG8gbm90IG1hdGNoJyk7XHJcblxyXG4gICAgICBmb3JtLnZhbGlkYXRlKHtcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgbXlBY2NvdW50X19jdXJyZW50UGFzc3dvcmQ6ICdteUFjY291bnRDdXJyZW50UGFzc3dvcmQnLFxyXG4gICAgICAgICAgbXlBY2NvdW50X19uZXdQYXNzd29yZDogJ215QWNjb3VudFBhc3N3b3JkJyxcclxuICAgICAgICAgIG15QWNjb3VudF9fY29uZmlybVBhc3N3b3JkOiAnbXlBY2NvdW50RXF1YWxUbydcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3Bhc3N3b3JkJykge1xyXG4gICAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XHJcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ3NlYXJjaCcpIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1Ym1pdEhhbmRsZXI6IChmb3JtRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy50cnlVcGRhdGVEZXRhaWxzKGZvcm1FbGVtZW50KTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVhZENvb2tpZShuYW1lKSB7XHJcbiAgICB2YXIgbmFtZUVRID0gbmFtZSArICc9JztcclxuICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYS5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgYyA9IGNhW2ldO1xyXG4gICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcclxuICAgICAgaWYgKGMuaW5kZXhPZihuYW1lRVEpID09PSAwKSByZXR1cm4gYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgdHJ5VXBkYXRlRGV0YWlscyhmb3JtKSB7XHJcbiAgICB2YXIgZnJtID0gJChmb3JtKTtcclxuICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XHJcbiAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xyXG5cclxuICAgIHZhciBjb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcclxuICAgIGlmIChjb29raWUgIT09IG51bGwpIHtcclxuICAgICAgdmFyIHNwbGl0ID0gY29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgIGlmIChzcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcclxuICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxHZXRBbGxEZXRhaWxzLFxyXG4gICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiBzcGxpdFswXSwgdG9rZW46IHNwbGl0WzFdIH0sXHJcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcclxuICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIGFsbERldGFpbHNSZXNwb25zZSwgdHJ1ZSBdKTtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGV0ZVVwZGF0ZURldGFpbHMoZm9ybSwgYWxsRGV0YWlsc1Jlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoMSkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICgyKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICgzKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgcmVmcmVzaENvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicpO1xyXG4gICAgICBpZiAocmVmcmVzaENvb2tpZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIHZhciByZWZyZXNoU3BsaXQgPSByZWZyZXNoQ29va2llLnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgaWYgKHJlZnJlc2hTcGxpdC5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFJlZnJlc2hDaGVjayxcclxuICAgICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiByZWZyZXNoU3BsaXRbMF0sIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hTcGxpdFsxXSB9LFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXHJcbiAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICBzdWNjZXNzOiAocmVmcmVzaFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoUmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHJlZnJlc2hSZXNwb25zZSwgdHJ1ZSBdKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyeVVwZGF0ZURldGFpbHMoZm9ybSk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICg0KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDUpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDYpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbXBsZXRlVXBkYXRlRGV0YWlscyhmb3JtLCBkZXRhaWxzKSB7XHJcbiAgICB2YXIgZnJtID0gJChmb3JtKTtcclxuXHJcbiAgICB2YXIgbmV3ZW1haWwgPSBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19lbWFpbCcpLnZhbCgpO1xyXG4gICAgaWYgKG5ld2VtYWlsLnRyaW0oKSA9PT0gZGV0YWlscy5yZWdpc3RyYXRpb25fZW1haWwpIHtcclxuICAgICAgbmV3ZW1haWwgPSAnJztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2F0ZWdvcmllcyA9ICcnO1xyXG4gICAgZnJtLmZpbmQoJyNnbGIteW91cmFjY291bnQtY2F0ZWdvcmllcyBpbnB1dDpjaGVja2VkJykuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgaWYgKGNhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNhdGVnb3JpZXMgKz0gJywnO1xyXG4gICAgICB9XHJcbiAgICAgIGNhdGVnb3JpZXMgKz0gJChpdGVtKS52YWwoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBkYXRhID0ge1xyXG4gICAgICB0b2tlbjogZGV0YWlscy50b2tlbixcclxuXHJcbiAgICAgIGZpcnN0bmFtZTogZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fZmlyc3ROYW1lJykudmFsKCksXHJcbiAgICAgIGxhc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19sYXN0TmFtZScpLnZhbCgpLFxyXG4gICAgICB1c2VybmFtZTogZGV0YWlscy5yZWdpc3RyYXRpb25fZW1haWwsXHJcbiAgICAgIG5ld3VzZXJuYW1lOiBuZXdlbWFpbCxcclxuXHJcbiAgICAgIHBhc3N3b3JkOiBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19jdXJyZW50UGFzc3dvcmQnKS52YWwoKSxcclxuICAgICAgbmV3cGFzc3dvcmQ6IGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX25ld1Bhc3N3b3JkJykudmFsKCksXHJcblxyXG4gICAgICBwb3NpdGlvbjogZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fcG9zaXRpb24nKS52YWwoKSxcclxuICAgICAgY29udGFjdDogZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fcGhvbmVOdW1iZXInKS52YWwoKSxcclxuICAgICAgc2l6ZTogZnJtLmZpbmQoJ3NlbGVjdCNteUFjY291bnRfX2J1c2luZXNzU2l6ZScpLnZhbCgpLFxyXG4gICAgICBzZWN0b3I6IGZybS5maW5kKCdzZWxlY3QjbXlBY2NvdW50X19idXNpbmVzc1NlY3RvcicpLnZhbCgpLFxyXG5cclxuICAgICAgdGNhZ3JlZTogZnJtLmZpbmQoJ2lucHV0I2NoZWNrYm94SWRUQ01lc3NhZ2UnKS5pcygnOmNoZWNrZWQnKSxcclxuXHJcbiAgICAgIGNhdHM6IGNhdGVnb3JpZXNcclxuICAgIH07XHJcblxyXG4gICAgaWYgKCgkLnRyaW0oZGF0YS5maXJzdG5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShkYXRhLmxhc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS51c2VybmFtZSkubGVuZ3RoID09PSAwKSkge1xyXG4gICAgICBhbGVydCgnUGxlYXNlIGVudGVyIHlvdXIgbmFtZSwgZW1haWwgYWRkcmVzcyBhbmQgcGVyc29uYWwgZGV0YWlscy4nKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddLnVwZGF0ZS1idG5cIikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcclxuICAgICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcclxuXHJcbiAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxVcGRhdGVEZXRhaWxzLFxyXG4gICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICBzdWNjZXNzOiAodXBkYXRlRGV0YWlsc1Jlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1cGRhdGVEZXRhaWxzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgdXBkYXRlRGV0YWlsc1Jlc3BvbnNlLCB0cnVlIF0pO1xyXG5cclxuICAgICAgICAgICAgICBpZiAodXBkYXRlRGV0YWlsc1Jlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgZnJtLmZpbmQoJy5teUFjY291bnRfX21lc3NhZ2UnKS5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubmV3cGFzc3dvcmQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19lbWFpbCcpLnJlbW92ZUF0dHIoJ3JlYWRvbmx5Jyk7XHJcbiAgICAgICAgICAgICAgICAgIGZybS5maW5kKCcudXNlcmFjY291bnQtY3VycmVudHBhc3N3b3JkJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fY3VycmVudFBhc3N3b3JkJykudmFsKCcnKTtcclxuICAgICAgICAgICAgICAgIGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX25ld1Bhc3N3b3JkJykudmFsKCcnKTtcclxuICAgICAgICAgICAgICAgIGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2NvbmZpcm1QYXNzd29yZCcpLnZhbCgnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnaGVhZGVyIC5oZWFkZXJfX2F1dGgtLWxvZ2dlZGluIC51c2VyLWZpcnN0bmFtZScpLnRleHQoZGF0YS5maXJzdG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmNvbXBldGl0aW9uRGF0YUNhcHR1cmUubG9nZ2VkLWluIC5sb2dnZWRpbi1uYW1lJykudGV4dChkYXRhLmZpcnN0bmFtZSk7XHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKDApO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzLlxcbicgKyB1cGRhdGVEZXRhaWxzUmVzcG9uc2UuZXJyb3IpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXS51cGRhdGUtYnRuXCIpLnRleHQoJ1VwZGF0ZScpO1xyXG4gICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdVcGRhdGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J10udXBkYXRlLWJ0blwiKS50ZXh0KCdVcGRhdGUnKTtcclxuICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ1VwZGF0ZScpO1xyXG4gIH1cclxuXHJcbiAgbG9nZ2VkSW4odG9rZW5EYXRhKSB7XHJcbiAgICBpZiAodG9rZW5EYXRhICYmIHRva2VuRGF0YS5zdGF0dXMgJiYgdG9rZW5EYXRhLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybEdldEFsbERldGFpbHMsXHJcbiAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiB0b2tlbkRhdGEudXNlcm5hbWUsIHRva2VuOiB0b2tlbkRhdGEudG9rZW4gfSxcclxuICAgICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcclxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICBzdWNjZXNzOiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudEZvcm0gPSAkKHRoaXMuc2VsLmNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgYWxsRGV0YWlsc1Jlc3BvbnNlLCB0cnVlIF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnLmxvZ2dlZGluLXVzZXJuYW1lJykudGV4dChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX2ZpcnN0bmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNteUFjY291bnRfX2ZpcnN0TmFtZScpLnZhbChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX2ZpcnN0bmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fbGFzdE5hbWUnKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9sYXN0bmFtZSk7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fZW1haWwnKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9lbWFpbCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNteUFjY291bnRfX3Bvc2l0aW9uJykudmFsKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fcG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNteUFjY291bnRfX3Bob25lTnVtYmVyJykudmFsKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fY29udGFjdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdzZWxlY3QjbXlBY2NvdW50X19idXNpbmVzc1NpemUnKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9zaXplKTtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnc2VsZWN0I215QWNjb3VudF9fYnVzaW5lc3NTZWN0b3InKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9zZWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX3RjYWdyZWUgPT09ICd0cnVlJykge1xyXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I2NoZWNrYm94SWRUQ01lc3NhZ2UnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I2NoZWNrYm94SWRUQ01lc3NhZ2UnKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnI2dsYi15b3VyYWNjb3VudC1jYXRlZ29yaWVzIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2F0ZWdvcmllcyA9IGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fY2F0cy5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXRlZ29yaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnI2dsYi15b3VyYWNjb3VudC1jYXRlZ29yaWVzIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXVt2YWx1ZT1cIicgKyBjYXRlZ29yaWVzW2ldICsgJ1wiXScpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9pc2xpbmtlZGluID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2UuZnVsbCAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJy51c2VyYWNjb3VudC1jdXJyZW50cGFzc3dvcmQnKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19lbWFpbCcpLmF0dHIoJ3JlYWRvbmx5JywgJ3JlYWRvbmx5Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5jbG9zZXN0KCcucGFnZS1ib2R5LXdyYXBwZXInKS5yZW1vdmVDbGFzcygnYXdhaXRpbmcnKTtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uc2hvdygpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRpc3BsYXkgeW91ciBkZXRhaWxzLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZGlzcGxheSB5b3VyIGRldGFpbHMuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5vdExvZ2dlZEluKCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5oYXNDbGFzcygnbm8tcmVkaXJlY3QnKSkge1xyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5nZXRQYXRoSG9tZSgpICsgJy5odG1sJztcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBMb2dpbkZvcm0oKTtcclxuXHJcbiIsIi8vIEltcG9ydCBjb21wb25lbnRzXHJcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi9Db21wb25lbnRzL0hlYWRlcic7XHJcbmltcG9ydCBCb290c3RyYXBDYXJvdXNlbCBmcm9tICcuL0NvbXBvbmVudHMvQm9vdHN0cmFwQ2Fyb3VzZWwnO1xyXG5pbXBvcnQgQXJ0aWNsZUdyaWQgZnJvbSAnLi9Db21wb25lbnRzL0FydGljbGVHcmlkJztcclxuaW1wb3J0IFN1YnNjcmliZVBhbmVsIGZyb20gJy4vQ29tcG9uZW50cy9TdWJzY3JpYmVQYW5lbCc7XHJcbmltcG9ydCBQYXNzd29yZCBmcm9tICcuL0NvbXBvbmVudHMvUGFzc3dvcmQnO1xyXG5pbXBvcnQgUGFzc3dvcmRWYWxpZGl0eSBmcm9tICcuL0NvbXBvbmVudHMvUGFzc3dvcmRWYWxpZGl0eSc7XHJcbmltcG9ydCBGb3JtVmFsaWRhdGlvbiBmcm9tICcuL0NvbXBvbmVudHMvRm9ybVZhbGlkYXRpb24nO1xyXG5pbXBvcnQgU2hvd0hpZGUgZnJvbSAnLi9Db21wb25lbnRzL1Nob3dIaWRlJztcclxuaW1wb3J0IENvb2tpZUJhbm5lciBmcm9tICcuL0NvbXBvbmVudHMvQ29va2llQmFubmVyJztcclxuaW1wb3J0IFNlYXJjaEZvcm0gZnJvbSAnLi9Db21wb25lbnRzL1NlYXJjaEZvcm0nO1xyXG5pbXBvcnQgRWNvbUZvcm1zIGZyb20gJy4vQ29tcG9uZW50cy9FY29tRm9ybXMnO1xyXG5pbXBvcnQgU2hpcEZvcm0gZnJvbSAnLi9Db21wb25lbnRzL1NoaXBGb3JtJztcclxuaW1wb3J0IElFRGV0ZWN0b3IgZnJvbSAnLi9Db21wb25lbnRzL0lFRGV0ZWN0b3InO1xyXG5pbXBvcnQgU29jaWFsIGZyb20gJy4vQ29tcG9uZW50cy9Tb2NpYWwnO1xyXG5pbXBvcnQgSGVybyBmcm9tICcuL0NvbXBvbmVudHMvSGVybyc7XHJcbmltcG9ydCBBdXRoZW50aWNhdGlvbkV2ZW50cyBmcm9tICcuL0NvbXBvbmVudHMvQXV0aGVudGljYXRpb25FdmVudHMnO1xyXG5pbXBvcnQgRGVsZXRlQWNjb3VudEZvcm0gZnJvbSAnLi9Db21wb25lbnRzL0RlbGV0ZUFjY291bnRGb3JtJztcclxuaW1wb3J0IExvZ2luRm9ybSBmcm9tICcuL0NvbXBvbmVudHMvTG9naW5Gb3JtJztcclxuaW1wb3J0IFBhc3N3b3JkUmVtaW5kZXJGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9QYXNzd29yZFJlbWluZGVyRm9ybSc7XHJcbmltcG9ydCBSZWdpc3RlckZvcm0gZnJvbSAnLi9Db21wb25lbnRzL1JlZ2lzdGVyRm9ybSc7XHJcbmltcG9ydCBZb3VyQWNjb3VudEZvcm0gZnJvbSAnLi9Db21wb25lbnRzL1lvdXJBY2NvdW50Rm9ybSc7XHJcbmltcG9ydCBTaGlwTm93Rm9ybSBmcm9tICcuL0NvbXBvbmVudHMvU2hpcE5vd0Zvcm0nO1xyXG5pbXBvcnQgU2hpcE5vd1R3b1N0ZXBGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9TaGlwTm93VHdvU3RlcEZvcm0nO1xyXG5pbXBvcnQgQ29tcGV0aXRpb25Gb3JtIGZyb20gJy4vQ29tcG9uZW50cy9Db21wZXRpdGlvbkZvcm0nO1xyXG5pbXBvcnQgU2VydmljZVdvcmtlciBmcm9tICcuL0NvbXBvbmVudHMvU2VydmljZVdvcmtlcic7XHJcbmltcG9ydCBPZmZsaW5lIGZyb20gJy4vQ29tcG9uZW50cy9PZmZsaW5lJztcclxuaW1wb3J0IExhbmRpbmdQb2ludHMgZnJvbSAnLi9Db21wb25lbnRzL0xhbmRpbmdQb2ludHMnO1xyXG5pbXBvcnQgQmFja0J1dHRvbiBmcm9tICcuL0NvbXBvbmVudHMvQmFja0J1dHRvbic7XHJcbmltcG9ydCBBcnRpY2xlQ291bnRlciBmcm9tICcuL0NvbXBvbmVudHMvQXJ0aWNsZUNvdW50ZXInO1xyXG5pbXBvcnQgTWFya2V0b0Zvcm0gZnJvbSAnLi9Db21wb25lbnRzL01hcmtldG9Gb3JtJztcclxuaW1wb3J0IExhbmd1YWdlRGV0ZWN0IGZyb20gJy4vQ29tcG9uZW50cy9MYW5ndWFnZURldGVjdCc7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3RvdWNoJyk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgLy8gbm90aGluZ1xyXG4gIH1cclxuICBpZiAoKHdpbmRvdy5tYXRjaE1lZGlhKCcoZGlzcGxheS1tb2RlOiBzdGFuZGFsb25lKScpLm1hdGNoZXMpIHx8ICh3aW5kb3cubmF2aWdhdG9yLnN0YW5kYWxvbmUpKSAkKCdodG1sJykuYWRkQ2xhc3MoJ3B3YScpO1xyXG4gIC8vIEluaXRpYXRlIGNvbXBvbmVudHNcclxuICBMYW5ndWFnZURldGVjdC5pbml0KCk7XHJcbiAgLy8gQXJ0aWNsZUNvdW50ZXIuaW5pdCgpO1xyXG4gIElFRGV0ZWN0b3IuaW5pdCgpO1xyXG4gIEhlYWRlci5pbml0KCk7XHJcbiAgQm9vdHN0cmFwQ2Fyb3VzZWwuaW5pdCgpO1xyXG4gIEFydGljbGVHcmlkLmluaXQoKTtcclxuICBTdWJzY3JpYmVQYW5lbC5pbml0KCk7XHJcbiAgUGFzc3dvcmQuaW5pdCgpO1xyXG4gIFBhc3N3b3JkVmFsaWRpdHkuaW5pdCgpO1xyXG4gIC8vIEZvcm1WYWxpZGF0aW9uLmluaXQoKTtcclxuICBTaG93SGlkZS5pbml0KCk7XHJcbiAgQ29va2llQmFubmVyLmluaXQoKTtcclxuICBTZWFyY2hGb3JtLmluaXQoKTtcclxuICBFY29tRm9ybXMuaW5pdCgpO1xyXG4gIFNoaXBGb3JtLmluaXQoKTtcclxuICBTb2NpYWwuaW5pdCgpO1xyXG4gIEhlcm8uaW5pdCgpO1xyXG4gIENvbXBldGl0aW9uRm9ybS5pbml0KCk7XHJcbiAgU2hpcE5vd0Zvcm0uaW5pdCgpO1xyXG4gIFNoaXBOb3dUd29TdGVwRm9ybS5pbml0KCk7XHJcbiAgWW91ckFjY291bnRGb3JtLmluaXQoKTtcclxuICBSZWdpc3RlckZvcm0uaW5pdCgpO1xyXG4gIFBhc3N3b3JkUmVtaW5kZXJGb3JtLmluaXQoKTtcclxuICBMb2dpbkZvcm0uaW5pdCgpO1xyXG4gIERlbGV0ZUFjY291bnRGb3JtLmluaXQoKTtcclxuICBBdXRoZW50aWNhdGlvbkV2ZW50cy5pbml0KCk7XHJcbiAgU2VydmljZVdvcmtlci5pbml0KCk7XHJcbiAgT2ZmbGluZS5pbml0KCk7XHJcbiAgTGFuZGluZ1BvaW50cy5pbml0KCk7XHJcbiAgQmFja0J1dHRvbi5pbml0KCk7XHJcbiAgTWFya2V0b0Zvcm0uaW5pdCgpO1xyXG59KTtcclxuIl19
