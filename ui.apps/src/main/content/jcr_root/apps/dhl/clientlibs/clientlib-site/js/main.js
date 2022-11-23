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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BcnRpY2xlQ291bnRlci5qcyIsImpzL2Rldi9Db21wb25lbnRzL0FydGljbGVHcmlkLmpzIiwianMvZGV2L0NvbXBvbmVudHMvQXV0aGVudGljYXRpb25FdmVudHMuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9CYWNrQnV0dG9uLmpzIiwianMvZGV2L0NvbXBvbmVudHMvQm9vdHN0cmFwQ2Fyb3VzZWwuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Db21wZXRpdGlvbkZvcm0uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Db25zdGFudHMuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Db29raWVCYW5uZXIuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9EYXRhYmFzZS5qcyIsImpzL2Rldi9Db21wb25lbnRzL0RlbGV0ZUFjY291bnRGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvRWNvbUZvcm1zLmpzIiwianMvZGV2L0NvbXBvbmVudHMvRm9ybVZhbGlkYXRpb24uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9IZWFkZXIuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9IZXJvLmpzIiwianMvZGV2L0NvbXBvbmVudHMvSUVEZXRlY3Rvci5qcyIsImpzL2Rldi9Db21wb25lbnRzL0xhbmRpbmdQb2ludHMuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9MYW5ndWFnZURldGVjdC5qcyIsImpzL2Rldi9Db21wb25lbnRzL0xvZ2luRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL01hcmtldG9Gb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvT2ZmbGluZS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1Bhc3N3b3JkLmpzIiwianMvZGV2L0NvbXBvbmVudHMvUGFzc3dvcmRSZW1pbmRlckZvcm0uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9QYXNzd29yZFZhbGlkaXR5LmpzIiwianMvZGV2L0NvbXBvbmVudHMvUmVnaXN0ZXJGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2VhcmNoRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1NlcnZpY2VXb3JrZXIuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9TaGlwRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1NoaXBOb3dGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2hpcE5vd1R3b1N0ZXBGb3JtLmpzIiwianMvZGV2L0NvbXBvbmVudHMvU2hvd0hpZGUuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9Tb2NpYWwuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9TdWJzY3JpYmVQYW5lbC5qcyIsImpzL2Rldi9Db21wb25lbnRzL1RvYXN0LmpzIiwianMvZGV2L0NvbXBvbmVudHMvWW91ckFjY291bnRGb3JtLmpzIiwianMvZGV2L21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lDQU0sYztBQUNKLDRCQUFjO0FBQUE7O0FBQ1osU0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDRDs7OztvQ0FFZTtBQUNkLFVBQU0sU0FBUyxFQUFFLHFDQUFGLEVBQXlDLElBQXpDLENBQThDLFNBQTlDLENBQWY7QUFDQSxhQUFRLFNBQVMsTUFBVCxHQUFrQixFQUExQjtBQUNEOzs7MkJBRU07QUFDTDtBQUNBO0FBQ0EsVUFBSSxjQUFjLEVBQUUsNEJBQUYsQ0FBbEI7QUFDQSxVQUFJLFlBQVksTUFBWixHQUFxQixDQUF6QixFQUE0QjtBQUMxQixZQUFJLE9BQU8sWUFBWSxJQUFaLENBQWlCLE1BQWpCLENBQVg7QUFDQSxZQUFJLEVBQUUsSUFBRixDQUFPLElBQVAsRUFBYSxNQUFiLEdBQXNCLENBQTFCLEVBQTZCO0FBQzNCLGNBQUksT0FBTztBQUNULGVBQUc7QUFETSxXQUFYO0FBR0EsWUFBRSxJQUFGLENBQU8sS0FBSyxhQUFMLEtBQXVCLDZDQUE5QixFQUE2RSxJQUE3RTtBQUNEO0FBQ0Y7QUFDRjs7Ozs7O2tCQUdZLElBQUksY0FBSixFOzs7Ozs7Ozs7Ozs7O0lDM0JULGM7QUFDSiwwQkFBWSxRQUFaLEVBQW9DO0FBQUEsUUFBZCxRQUFjLHVFQUFILENBQUc7O0FBQUE7O0FBQ2xDLFNBQUssUUFBTCxHQUFnQixRQUFoQjtBQUNBLFNBQUssUUFBTCxHQUFnQixRQUFoQjtBQUNBLFNBQUssSUFBTCxHQUFZLENBQVo7O0FBRUEsU0FBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBakI7QUFDQSxTQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLElBQWpCLENBQWQ7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUFoQjtBQUNEOzs7OzhCQUVTLFEsRUFBMEI7QUFBQTs7QUFBQSxVQUFoQixPQUFnQix1RUFBTixJQUFNOztBQUNsQyxRQUFFLEdBQUYsQ0FBTSxLQUFLLFFBQVgsRUFBcUI7QUFDbkIsY0FBTSxLQUFLLElBRFE7QUFFbkIsa0JBQVUsS0FBSyxRQUZJO0FBR25CLGlCQUFTO0FBSFUsT0FBckIsRUFJRyxVQUFDLElBQUQsRUFBVTtBQUNYLGNBQUssSUFBTCxJQUFhLEtBQUssS0FBTCxDQUFXLE1BQXhCO0FBQ0EsaUJBQVMsSUFBVDtBQUNELE9BUEQ7QUFRRDs7OzJCQUVNLFEsRUFBVSxPLEVBQVM7QUFDeEIsV0FBSyxJQUFMLEdBQVksQ0FBWjtBQUNBLFdBQUssU0FBTCxDQUFlLFFBQWYsRUFBeUIsT0FBekI7QUFDRDs7OzZCQUVRLFEsRUFBVTtBQUNqQixXQUFLLFNBQUwsQ0FBZSxRQUFmO0FBQ0Q7Ozs7OztJQUdHLFc7QUFDSix5QkFBYztBQUFBOztBQUNaLFNBQUssT0FBTCxHQUFlLEtBQWY7QUFDQSxTQUFLLE9BQUwsR0FBZSxJQUFmOztBQUVBLFNBQUssR0FBTCxHQUFXO0FBQ1QsaUJBQVcsY0FERjtBQUVULFlBQU0sb0JBRkc7QUFHVCxnQkFBVSx3QkFIRDtBQUlULGdCQUFVLDZCQUpEO0FBS1QsV0FBSztBQUxJLEtBQVg7QUFPQSxTQUFLLFFBQUwsR0FBZ0IsRUFBRSxFQUFFLEtBQUssR0FBTCxDQUFTLFFBQVgsRUFBcUIsSUFBckIsRUFBRixDQUFoQjs7QUFFQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBaEI7QUFDQSxTQUFLLGlCQUFMLEdBQXlCLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBekI7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixJQUFwQixDQUFqQjtBQUNBLFNBQUssVUFBTCxHQUFrQixLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBbEI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssVUFBTCxHQUFrQixLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBbEI7QUFDRDs7OztpQ0FFWTtBQUNYLFFBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxRQUFiLEVBQXVCLEtBQUssVUFBNUI7QUFDQSxRQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsT0FBZixFQUF3QixLQUFLLEdBQUwsQ0FBUyxRQUFqQyxFQUEyQyxLQUFLLFFBQWhEO0FBQ0EsUUFBRSxRQUFGLEVBQVksRUFBWixDQUFlLE9BQWYsRUFBd0IsYUFBeEIsRUFBdUMsS0FBSyxVQUE1QztBQUNBLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLGNBQXhCLEVBQXdDLEtBQUssV0FBN0M7O0FBRUEsV0FBSyxVQUFMO0FBQ0Q7OztpQ0FFWTtBQUNYLFVBQUksS0FBSyxPQUFMLElBQWlCLENBQUMsS0FBSyxPQUEzQixFQUFxQztBQUNuQyxZQUFJLE1BQU0sRUFBRSxNQUFGLENBQVY7QUFDQSxZQUFJLE1BQU0sRUFBRSxLQUFLLEdBQUwsQ0FBUyxRQUFYLENBQVY7O0FBRUEsWUFBSSxPQUFRLEVBQUUsR0FBRixFQUFPLE1BQVAsR0FBZ0IsQ0FBNUIsRUFBZ0M7QUFDOUIsY0FBSSxNQUFNLElBQUksU0FBSixFQUFWO0FBQ0EsY0FBSSxLQUFLLElBQUksTUFBSixFQUFUO0FBQ0EsY0FBSSxLQUFLLElBQUksTUFBSixHQUFhLEdBQXRCO0FBQ0EsY0FBSSxLQUFLLElBQUksV0FBSixFQUFUOztBQUVBLGNBQUssTUFBTSxFQUFQLEdBQWMsS0FBSyxFQUF2QixFQUE0QjtBQUMxQixpQkFBSyxRQUFMO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7Ozs2QkFFUSxDLEVBQUc7QUFDVixVQUFJLENBQUosRUFBTztBQUNMLFVBQUUsY0FBRjtBQUNEOztBQUVELFdBQUssT0FBTCxHQUFlLElBQWY7QUFDQTtBQUNBLFdBQUssV0FBTDs7QUFFQSxVQUFJLElBQUksQ0FBUjtBQUNBLFFBQUUsb0JBQUYsRUFBd0IsS0FBSyxHQUFMLENBQVMsU0FBakMsRUFBNEMsSUFBNUMsQ0FBaUQsVUFBQyxLQUFELEVBQVEsSUFBUixFQUFpQjtBQUNoRSxZQUFJLElBQUksQ0FBSixJQUFVLENBQUMsRUFBRSxJQUFGLEVBQVEsRUFBUixDQUFXLFVBQVgsQ0FBZixFQUF3QztBQUN0QyxZQUFFLElBQUYsRUFBUSxJQUFSO0FBQ0E7QUFDRDtBQUNGLE9BTEQ7O0FBT0EsVUFBSSxFQUFFLG9CQUFGLEVBQXVCLEtBQUssR0FBTCxDQUFTLFNBQWhDLEVBQTJDLE1BQTNDLEtBQXNELEVBQUUsNEJBQUYsRUFBK0IsS0FBSyxHQUFMLENBQVMsU0FBeEMsRUFBbUQsTUFBN0csRUFBcUg7QUFDbkgsVUFBRSxLQUFLLEdBQUwsQ0FBUyxRQUFYLEVBQXFCLE9BQXJCLENBQTZCLE1BQTdCLEVBQXFDLEtBQXJDLEdBQTZDLE1BQTdDO0FBQ0EsYUFBSyxPQUFMLEdBQWUsS0FBZjtBQUNEOztBQUVEO0FBQ0EsV0FBSyxXQUFMO0FBQ0EsV0FBSyxPQUFMLEdBQWUsS0FBZjtBQUNEOzs7a0NBRWE7QUFDWixRQUFFLEtBQUssR0FBTCxDQUFTLFFBQVgsRUFBcUIsUUFBckIsQ0FBOEIsZ0NBQTlCO0FBQ0Q7OztrQ0FFYTtBQUNaLFFBQUUsS0FBSyxHQUFMLENBQVMsUUFBWCxFQUFxQixXQUFyQixDQUFpQyxnQ0FBakM7QUFDRDs7O2dDQUVXO0FBQ1YsVUFBSSxhQUFhLFNBQVMsYUFBVCxDQUF1QixLQUFLLEdBQUwsQ0FBUyxHQUFoQyxDQUFqQjtBQUNBLFVBQUksZUFBZSxJQUFuQixFQUF5QjtBQUN6QixVQUFJLGNBQWMsV0FBVyxXQUE3QjtBQUNBLFVBQUksY0FBYyxXQUFXLFdBQTdCO0FBQ0EsVUFBSSxjQUFjLFdBQWxCLEVBQStCO0FBQzdCLFVBQUUsS0FBSyxHQUFMLENBQVMsR0FBWCxFQUFnQixLQUFoQixDQUFzQiw4QkFBdEI7QUFDRDtBQUNGOzs7a0NBQ2E7QUFDWixVQUFJLE9BQU8sS0FBSyxHQUFMLENBQVMsR0FBcEI7QUFDQSxVQUFJLGNBQWMsU0FBUyxhQUFULENBQXVCLElBQXZCLEVBQTZCLFdBQS9DO0FBQ0EsUUFBRSxJQUFGLEVBQVEsT0FBUixDQUFnQjtBQUNkLG9CQUFZLGNBQWM7QUFEWixPQUFoQixFQUVHLEdBRkgsRUFFUSxZQUFZO0FBQ2xCLFVBQUUsY0FBRixFQUFrQixNQUFsQjtBQUNBLFVBQUUsSUFBRixFQUFRLE1BQVIsQ0FBZSw2QkFBZjtBQUNELE9BTEQ7QUFNRDs7O2lDQUVZO0FBQ1gsVUFBSSxPQUFPLEtBQUssR0FBTCxDQUFTLEdBQXBCO0FBQ0EsUUFBRSxJQUFGLEVBQVEsT0FBUixDQUFnQjtBQUNkLG9CQUFZO0FBREUsT0FBaEIsRUFFRyxHQUZILEVBRVEsWUFBWTtBQUNsQixVQUFFLGFBQUYsRUFBaUIsTUFBakI7QUFDQSxVQUFFLElBQUYsRUFBUSxLQUFSLENBQWMsOEJBQWQ7QUFDRCxPQUxEO0FBTUQ7OztrQ0FFYTtBQUNaLFVBQUksYUFBYSxTQUFTLGFBQVQsQ0FBdUIsS0FBSyxHQUFMLENBQVMsR0FBaEMsQ0FBakI7QUFDQSxVQUFJLGVBQWUsSUFBbkIsRUFBeUI7QUFDekIsVUFBSSxjQUFjLFdBQVcsV0FBN0I7QUFDQSxVQUFJLGNBQWMsV0FBVyxXQUE3QjtBQUNBLFVBQUksWUFBWSxjQUFjLFdBQTlCO0FBQ0EsUUFBRSxJQUFGLEVBQVEsTUFBUixDQUFlLFlBQVk7QUFDekIsWUFBSSxLQUFLLFVBQUwsS0FBb0IsQ0FBeEIsRUFBMkI7QUFDekIsWUFBRSxhQUFGLEVBQWlCLE1BQWpCO0FBQ0EsWUFBRSxJQUFGLEVBQVEsS0FBUixDQUFjLDhCQUFkO0FBQ0Q7QUFDRCxZQUFJLEtBQUssVUFBTCxJQUFtQixTQUF2QixFQUFrQztBQUNoQyxZQUFFLGNBQUYsRUFBa0IsTUFBbEI7QUFDQSxZQUFFLElBQUYsRUFBUSxNQUFSLENBQWUsNkJBQWY7QUFDRDtBQUNGLE9BVEQ7QUFVRDs7O3NDQUVpQixLLEVBQU87QUFDdkIsVUFBSSxTQUFTLEVBQWI7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQztBQUNBLFlBQUksWUFBWSxLQUFLLFFBQUwsQ0FBYyxLQUFkLEVBQWhCO0FBQ0E7QUFDQSxZQUFJLE9BQU8sTUFBTSxDQUFOLENBQVg7QUFDQTtBQUNBLFlBQUksb0JBQW9CLEdBQXhCO0FBQ0E7QUFDQSxZQUFJLFVBQVUsS0FBSyxNQUFMLEdBQWMsUUFBZCxDQUF1QixFQUF2QixFQUEyQixNQUEzQixDQUFrQyxDQUFsQyxFQUFxQyxDQUFyQyxDQUFkO0FBQ0E7QUFDQSxrQkFBVSxJQUFWLENBQWUsZUFBZixFQUFnQyxJQUFoQyxDQUFxQyxJQUFyQyxFQUEyQyxPQUEzQztBQUNBO0FBQ0EsWUFBSSxLQUFLLE9BQVQsRUFBa0I7QUFDaEI7QUFDQSw4QkFBb0IsR0FBcEI7QUFDQTtBQUNBLG9CQUFVLElBQVYsQ0FBZSxlQUFmLEVBQWdDLFFBQWhDLENBQXlDLHFCQUF6QztBQUNEO0FBQ0Q7QUFDQSxZQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNoQjtBQUNBLG9CQUFVLElBQVYsQ0FBZSxlQUFmLEVBQWdDLFFBQWhDLENBQXlDLHFCQUF6QztBQUNEO0FBQ0Q7QUFDQSxrQkFBVSxJQUFWLENBQWUsc0JBQWYsRUFBdUMsSUFBdkMsQ0FBNEM7QUFDMUMsZ0JBQU0sS0FBSyxJQUQrQjtBQUUxQyxpQkFBTyxLQUFLO0FBRjhCLFNBQTVDLEVBR0csSUFISCxDQUdRLE9BSFIsRUFHaUIsMkJBQTJCLEtBQUssTUFBTCxDQUFZLE1BQXZDLEdBQWdELElBSGpFO0FBSUEsa0JBQVUsSUFBVixDQUFlLE9BQWYsRUFBd0IsQ0FBeEIsRUFBMkIsU0FBM0IsR0FBdUMsbUNBQW1DLGlCQUFuQyxHQUF1RCxPQUF2RCxHQUFpRSxPQUFqRSxHQUEyRSw4Q0FBM0UsR0FBNEgsS0FBSyxNQUFMLENBQVksT0FBeEksR0FBa0osaUJBQXpMO0FBQ0E7QUFDQSxrQkFBVSxJQUFWLENBQWUsNEJBQWYsRUFBNkMsSUFBN0MsQ0FBa0Q7QUFDaEQsZ0JBQU0sS0FBSyxJQURxQztBQUVoRCxpQkFBTyxLQUFLO0FBRm9DLFNBQWxEO0FBSUE7QUFDQSxrQkFBVSxJQUFWLENBQWUsc0JBQWYsRUFBdUMsSUFBdkMsQ0FBNEMsS0FBSyxLQUFqRDtBQUNBO0FBQ0Esa0JBQVUsSUFBVixDQUFlLDRCQUFmLEVBQTZDLElBQTdDLENBQWtELEtBQUssV0FBdkQ7QUFDQTtBQUNBLGtCQUFVLElBQVYsQ0FBZSx1Q0FBZixFQUF3RCxJQUF4RCxDQUE2RDtBQUMzRCxrQkFBUSxLQUFLLFFBQUwsQ0FBYyxJQURxQztBQUUzRCxtQkFBUyxLQUFLLFFBQUwsQ0FBYztBQUZvQyxTQUE3RCxFQUdHLElBSEgsQ0FHUSxLQUFLLFFBQUwsQ0FBYyxJQUh0QjtBQUlBO0FBQ0Esa0JBQVUsSUFBVixDQUFlLHNDQUFmLEVBQXVELElBQXZELENBQTREO0FBQzFELGtCQUFRLEtBQUssSUFENkM7QUFFMUQsbUJBQVMsS0FBSztBQUY0QyxTQUE1RCxFQUdHLElBSEgsQ0FHUSxLQUFLLFVBSGI7QUFJQTtBQUNBLGVBQU8sSUFBUCxDQUFZLFNBQVo7QUFDRDtBQUNELGFBQU8sTUFBUDtBQUNEOzs7MkJBRU07QUFDTCxVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixNQUF0QixJQUFnQyxDQUFwQyxFQUF1QyxPQUFPLEtBQVA7QUFDdkMsVUFBSSxXQUFXLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixlQUEzQixDQUFmO0FBQ0EsV0FBSyxHQUFMLEdBQVcsSUFBSSxjQUFKLENBQW1CLFFBQW5CLENBQVg7QUFDQSxXQUFLLFNBQUw7QUFDQSxXQUFLLFVBQUw7QUFDQSxXQUFLLFdBQUw7QUFDQSxhQUFPLElBQVA7QUFDRDs7Ozs7O2tCQUdZLElBQUksV0FBSixFOzs7Ozs7Ozs7Ozs7O0lDNU9ULG9CO0FBQ0osa0NBQWM7QUFBQTs7QUFDWixTQUFLLE1BQUwsR0FBYztBQUNaLGdCQUFVLCtCQURFO0FBRVosZ0JBQVUsMkNBRkU7QUFHWix1QkFBaUIsbURBSEw7QUFJWix3QkFBa0I7QUFKTixLQUFkOztBQU9BLFNBQUssYUFBTCxHQUFxQixLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBckI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBWjs7QUFFQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssWUFBTCxHQUFvQixLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBcEI7O0FBRUEsU0FBSyxnQkFBTCxHQUF3QixLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBQXhCO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLEtBQUssZUFBTCxDQUFxQixJQUFyQixDQUEwQixJQUExQixDQUF2Qjs7QUFFQSxTQUFLLG9CQUFMLEdBQTRCLEtBQUssb0JBQUwsQ0FBMEIsSUFBMUIsQ0FBK0IsSUFBL0IsQ0FBNUI7QUFDQSxTQUFLLHVCQUFMLEdBQStCLEtBQUssdUJBQUwsQ0FBNkIsSUFBN0IsQ0FBa0MsSUFBbEMsQ0FBL0I7QUFDRDs7OztvQ0FFZTtBQUNkLFVBQU0sU0FBUyxFQUFFLHFDQUFGLEVBQXlDLElBQXpDLENBQThDLFNBQTlDLENBQWY7QUFDQSxhQUFRLFNBQVMsTUFBVCxHQUFrQixFQUExQjtBQUNEOzs7a0NBRWE7QUFDWixVQUFNLE9BQU8sRUFBRSxtQ0FBRixFQUF1QyxJQUF2QyxDQUE0QyxTQUE1QyxDQUFiO0FBQ0EsYUFBUSxPQUFPLElBQVAsR0FBYyxFQUF0QjtBQUNEOzs7MkJBRU07QUFBQTs7QUFDTCxRQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEscUJBQWIsRUFBb0MsVUFBQyxHQUFELEVBQU0sU0FBTixFQUFpQixZQUFqQixFQUFrQztBQUNwRSxjQUFLLGVBQUwsQ0FBcUIsU0FBckIsRUFBZ0MsWUFBaEM7QUFDRCxPQUZEO0FBR0EsUUFBRSxNQUFGLEVBQVUsRUFBVixDQUFhLGtCQUFiLEVBQWlDLFVBQUMsR0FBRCxFQUFNLFNBQU4sRUFBb0I7QUFDbkQsY0FBSyxvQkFBTCxDQUEwQixTQUExQjtBQUNELE9BRkQ7QUFHQSxRQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEscUJBQWIsRUFBb0MsWUFBTTtBQUN4QyxjQUFLLHVCQUFMO0FBQ0QsT0FGRDs7QUFJQTtBQUNBLFVBQUksaUJBQWlCLEVBQUUsaUNBQUYsQ0FBckI7QUFDQSxVQUFJLGVBQWUsTUFBZixHQUF3QixDQUE1QixFQUErQjtBQUM3Qix1QkFBZSxFQUFmLENBQWtCLE9BQWxCLEVBQTJCLGNBQTNCLEVBQTJDLFlBQU07QUFDL0MsZ0JBQUssV0FBTCxDQUFpQixlQUFqQjtBQUNBLGdCQUFLLFdBQUwsQ0FBaUIsa0JBQWpCO0FBQ0EsbUJBQVMsTUFBVDs7QUFFQSxpQkFBTyxLQUFQO0FBQ0QsU0FORDtBQU9EOztBQUVELFdBQUssZ0JBQUw7QUFDRDs7OytCQUVVLEksRUFBTTtBQUNmLFVBQUksU0FBUyxPQUFPLEdBQXBCO0FBQ0EsVUFBSSxLQUFLLFNBQVMsTUFBVCxDQUFnQixLQUFoQixDQUFzQixHQUF0QixDQUFUO0FBQ0EsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEdBQUcsTUFBdkIsRUFBK0IsR0FBL0IsRUFBb0M7QUFDbEMsWUFBSSxJQUFJLEdBQUcsQ0FBSCxDQUFSO0FBQ0EsZUFBTyxFQUFFLE1BQUYsQ0FBUyxDQUFULE1BQWdCLEdBQXZCO0FBQTRCLGNBQUksRUFBRSxTQUFGLENBQVksQ0FBWixFQUFlLEVBQUUsTUFBakIsQ0FBSjtBQUE1QixTQUNBLElBQUksRUFBRSxPQUFGLENBQVUsTUFBVixNQUFzQixDQUExQixFQUE2QixPQUFPLEVBQUUsU0FBRixDQUFZLE9BQU8sTUFBbkIsRUFBMkIsRUFBRSxNQUE3QixDQUFQO0FBQzlCOztBQUVELGFBQU8sSUFBUDtBQUNEOzs7Z0NBRVcsSSxFQUFNO0FBQ2hCLFdBQUssWUFBTCxDQUFrQixJQUFsQixFQUF3QixFQUF4QixFQUE0QixDQUFDLENBQTdCO0FBQ0Q7OztpQ0FFWSxJLEVBQU0sSyxFQUFPLGEsRUFBZTtBQUN2QyxVQUFJLFVBQVUsRUFBZDtBQUNBLFVBQUksYUFBSixFQUFtQjtBQUNqQixZQUFJLE9BQU8sSUFBSSxJQUFKLEVBQVg7QUFDQSxhQUFLLE9BQUwsQ0FBYSxLQUFLLE9BQUwsS0FBa0IsZ0JBQWdCLElBQS9DO0FBQ0Esa0JBQVUsZUFBZSxLQUFLLFdBQUwsRUFBekI7QUFDRDtBQUNELGVBQVMsTUFBVCxHQUFrQixPQUFPLEdBQVAsR0FBYSxLQUFiLEdBQXFCLE9BQXJCLEdBQStCLFVBQWpEO0FBQ0Q7Ozt1Q0FFa0I7QUFDakIsVUFBSSxTQUFTLEtBQUssVUFBTCxDQUFnQixlQUFoQixDQUFiO0FBQ0EsVUFBSSxXQUFXLElBQWYsRUFBcUI7QUFDbkIsWUFBSSxZQUFZLE9BQU8sS0FBUCxDQUFhLEdBQWIsQ0FBaEI7QUFDQSxZQUFJLFVBQVUsTUFBVixJQUFvQixDQUF4QixFQUEyQjtBQUN6QixlQUFLLGNBQUwsQ0FBb0IsS0FBSyxhQUFMLEtBQXVCLEtBQUssTUFBTCxDQUFZLFFBQXZELEVBQWlFO0FBQy9ELHNCQUFVLFVBQVUsQ0FBVixDQURxRDtBQUUvRCxtQkFBTyxVQUFVLENBQVY7QUFGd0QsV0FBakU7QUFJRCxTQUxELE1BS087QUFDTCxZQUFFLE1BQUYsRUFBVSxPQUFWLENBQWtCLHFCQUFsQjtBQUNEO0FBQ0YsT0FWRCxNQVVPO0FBQ0wsWUFBSSxnQkFBZ0IsS0FBSyxVQUFMLENBQWdCLGtCQUFoQixDQUFwQjtBQUNBLFlBQUksa0JBQWtCLElBQXRCLEVBQTRCO0FBQzFCLGNBQUkscUJBQXFCLGNBQWMsS0FBZCxDQUFvQixHQUFwQixDQUF6QjtBQUNBLGNBQUksbUJBQW1CLE1BQW5CLElBQTZCLENBQWpDLEVBQW9DO0FBQ2xDLGlCQUFLLGNBQUwsQ0FBb0IsS0FBSyxhQUFMLEtBQXVCLEtBQUssTUFBTCxDQUFZLGVBQXZELEVBQXdFO0FBQ3RFLHdCQUFVLG1CQUFtQixDQUFuQixDQUQ0RDtBQUV0RSw2QkFBZSxtQkFBbUIsQ0FBbkI7QUFGdUQsYUFBeEU7QUFJRCxXQUxELE1BS087QUFDTCxjQUFFLE1BQUYsRUFBVSxPQUFWLENBQWtCLHFCQUFsQjtBQUNEO0FBQ0YsU0FWRCxNQVVPO0FBQ0wsWUFBRSxNQUFGLEVBQVUsT0FBVixDQUFrQixxQkFBbEI7QUFDRDtBQUNGO0FBQ0Y7OzttQ0FFYyxHLEVBQUssSSxFQUFNO0FBQUE7O0FBQ3hCLFFBQUUsR0FBRixDQUFNLEtBQUssYUFBTCxLQUF1QixLQUFLLE1BQUwsQ0FBWSxRQUF6QyxFQUFtRCxVQUFDLFlBQUQsRUFBa0I7QUFDbkUsWUFBSSxZQUFZLGFBQWEsS0FBN0I7O0FBRUEsVUFBRSxJQUFGLENBQU87QUFDTCxlQUFLLEdBREE7QUFFTCxnQkFBTSxJQUZEO0FBR0wsZ0JBQU0sTUFIRDtBQUlMLG1CQUFTLEVBQUUsY0FBYyxTQUFoQixFQUpKO0FBS0wsb0JBQVUsTUFMTDtBQU1MLG1CQUFTLGlCQUFDLFFBQUQsRUFBYztBQUNyQixtQkFBSyxlQUFMLENBQXFCLFFBQXJCLEVBQStCLEtBQS9CO0FBQ0Q7QUFSSSxTQUFQO0FBVUQsT0FiRDtBQWNEOzs7b0NBRWUsUyxFQUFXLFksRUFBYztBQUN2QyxVQUFJLGFBQWEsVUFBVSxNQUF2QixJQUFpQyxVQUFVLE1BQVYsS0FBcUIsSUFBMUQsRUFBZ0U7QUFDOUQsYUFBSyxZQUFMLENBQWtCLGVBQWxCLEVBQW1DLFVBQVUsUUFBVixHQUFxQixHQUFyQixHQUEyQixVQUFVLEtBQXhFLEVBQStFLFVBQVUsR0FBekY7QUFDQSxhQUFLLFlBQUwsQ0FBa0Isa0JBQWxCLEVBQXNDLFVBQVUsUUFBVixHQUFxQixHQUFyQixHQUEyQixVQUFVLGFBQTNFLEVBQTJGLEtBQUssRUFBTCxHQUFVLEVBQXJHOztBQUVBLFlBQUksaUJBQWlCLElBQXJCLEVBQTJCO0FBQ3pCLFlBQUUsTUFBRixFQUFVLE9BQVYsQ0FBa0Isa0JBQWxCLEVBQXNDLFNBQXRDO0FBQ0Q7O0FBRUQ7QUFDRDs7QUFFRCxVQUFJLGlCQUFpQixJQUFyQixFQUEyQjtBQUN6QixVQUFFLE1BQUYsRUFBVSxPQUFWLENBQWtCLHFCQUFsQjtBQUNEO0FBQ0Y7Ozt5Q0FFb0IsUyxFQUFXO0FBQUE7O0FBQzlCLFFBQUUsa0NBQUYsRUFBc0MsSUFBdEM7O0FBRUEsUUFBRSxzQ0FBRixFQUEwQyxJQUExQztBQUNBLFFBQUUsNkVBQUYsRUFBaUYsV0FBakYsQ0FBNkYsTUFBN0Y7O0FBRUEsUUFBRSxzQ0FBRixFQUEwQyxRQUExQyxDQUFtRCxRQUFuRCxFQUE2RCxJQUE3RDtBQUNBLFFBQUUsNkVBQUYsRUFBaUYsUUFBakYsQ0FBMEYsTUFBMUY7O0FBRUEsUUFBRSxzQkFBRixFQUEwQixJQUExQjs7QUFFQSxRQUFFLHlHQUFGLEVBQTZHLElBQTdHLENBQWtILFVBQVUsSUFBNUg7QUFDQSxRQUFFLG1GQUFGLEVBQXVGLElBQXZGO0FBQ0EsUUFBRSx1QkFBRixFQUEyQixJQUEzQjs7QUFFQSxRQUFFLG1DQUFGLEVBQXVDLElBQXZDO0FBQ0EsUUFBRSxrREFBRixFQUFzRCxJQUF0RCxDQUEyRCxVQUFVLElBQXJFO0FBQ0EsUUFBRSwyQkFBRixFQUErQixJQUEvQjs7QUFFQSxRQUFFLFFBQUYsRUFBWSxRQUFaLENBQXFCLFVBQXJCLEVBQWlDLFdBQWpDLENBQTZDLFFBQTdDLEVBQXVELElBQXZELENBQTRELFVBQUMsS0FBRCxFQUFRLElBQVIsRUFBaUI7QUFDM0UsVUFBRSxJQUFGLEVBQVEsT0FBUixDQUFnQixNQUFoQixFQUF3QixJQUF4QixDQUE2Qix3QkFBN0IsRUFBdUQsSUFBdkQ7QUFDRCxPQUZEO0FBR0EsUUFBRSxhQUFGLEVBQWlCLFFBQWpCLENBQTBCLFVBQTFCLEVBQXNDLFdBQXRDLENBQWtELFFBQWxEOztBQUVBLFFBQUUsMENBQUYsRUFBOEMsSUFBOUM7O0FBRUEsVUFBSSxVQUFVLElBQVYsS0FBbUIsS0FBdkIsRUFBOEI7QUFDNUIsVUFBRSxrQkFBRixFQUFzQixJQUF0QixDQUEyQix1QkFBM0IsRUFBb0QsSUFBcEQsQ0FBeUQsVUFBVSxJQUFuRTtBQUNBLFVBQUUsTUFBRixFQUFVLE9BQVYsQ0FBa0IsOEJBQWxCO0FBQ0Q7O0FBRUQsVUFBSSxFQUFFLDJCQUFGLEVBQStCLE1BQS9CLEdBQXdDLENBQTVDLEVBQStDO0FBQzdDLGVBQU8sUUFBUCxHQUFrQixLQUFLLFdBQUwsS0FBcUIsT0FBdkM7QUFDRDtBQUNELFVBQUksRUFBRSxxQkFBRixFQUF5QixNQUF6QixHQUFrQyxDQUF0QyxFQUF5QztBQUN2QyxlQUFPLFFBQVAsR0FBa0IsS0FBSyxXQUFMLEtBQXFCLG9CQUF2QztBQUNEOztBQUVELFVBQUksRUFBRSxtQ0FBRixFQUF1QyxNQUF2QyxHQUFnRCxDQUFwRCxFQUF1RDtBQUNyRCxZQUFJLG9CQUFvQixFQUFFLG1DQUFGLENBQXhCOztBQUVBLFVBQUUsR0FBRixDQUFNLEtBQUssYUFBTCxLQUF1QixLQUFLLE1BQUwsQ0FBWSxRQUF6QyxFQUFtRCxVQUFDLGFBQUQsRUFBbUI7QUFDcEUsY0FBSSxZQUFZLGNBQWMsS0FBOUI7QUFDQSxZQUFFLElBQUYsQ0FBTztBQUNMLGlCQUFLLE9BQUssYUFBTCxLQUF1QixPQUFLLE1BQUwsQ0FBWSxnQkFEbkM7QUFFTCxrQkFBTSxFQUFFLFdBQVcsa0JBQWtCLElBQWxCLENBQXVCLFdBQXZCLENBQWIsRUFGRDtBQUdMLGtCQUFNLE1BSEQ7QUFJTCxxQkFBUyxFQUFFLGNBQWMsU0FBaEIsRUFKSjtBQUtMLHNCQUFVLE1BTEw7QUFNTCxxQkFBUyxpQkFBQyxRQUFELEVBQWM7QUFDckIsa0JBQUksU0FBUyxNQUFULEtBQW9CLElBQXhCLEVBQThCO0FBQzVCLGtDQUFrQixJQUFsQixDQUF1Qix3QkFBdkIsRUFBaUQsSUFBakQsQ0FBc0QsTUFBdEQsRUFBOEQsU0FBUyxJQUF2RTtBQUNBLGtDQUFrQixJQUFsQjtBQUNEO0FBQ0Y7QUFYSSxXQUFQO0FBYUQsU0FmRDtBQWdCRDs7QUFFRCxVQUFJLEVBQUUsd0NBQUYsRUFBNEMsTUFBNUMsR0FBcUQsQ0FBekQsRUFBNEQ7QUFDMUQsWUFBSSxvQkFBb0IsRUFBRSx3Q0FBRixDQUF4Qjs7QUFFQSxVQUFFLEdBQUYsQ0FBTSxLQUFLLGFBQUwsS0FBdUIsS0FBSyxNQUFMLENBQVksUUFBekMsRUFBbUQsVUFBQyxhQUFELEVBQW1CO0FBQ3BFLGNBQUksWUFBWSxjQUFjLEtBQTlCO0FBQ0EsWUFBRSxJQUFGLENBQU87QUFDTCxpQkFBSyxPQUFLLGFBQUwsS0FBdUIsT0FBSyxNQUFMLENBQVksZ0JBRG5DO0FBRUwsa0JBQU0sRUFBRSxXQUFXLGtCQUFrQixJQUFsQixDQUF1QixXQUF2QixDQUFiLEVBRkQ7QUFHTCxrQkFBTSxNQUhEO0FBSUwscUJBQVMsRUFBRSxjQUFjLFNBQWhCLEVBSko7QUFLTCxzQkFBVSxNQUxMO0FBTUwscUJBQVMsaUJBQUMsUUFBRCxFQUFjO0FBQ3JCLGtCQUFJLFNBQVMsTUFBVCxLQUFvQixJQUF4QixFQUE4QjtBQUM1QixrQ0FBa0IsSUFBbEIsQ0FBdUIsd0JBQXZCLEVBQWlELElBQWpELENBQXNELE1BQXRELEVBQThELFNBQVMsSUFBdkU7QUFDQSxrQ0FBa0IsSUFBbEI7QUFDRDtBQUNGO0FBWEksV0FBUDtBQWFELFNBZkQ7QUFnQkQ7QUFDRjs7OzhDQUV5QjtBQUN4QixRQUFFLHFEQUFGLEVBQXlELFFBQXpELENBQWtFLFFBQWxFLEVBQTRFLElBQTVFO0FBQ0EsUUFBRSw2RUFBRixFQUFpRixRQUFqRixDQUEwRixNQUExRjs7QUFFQSxRQUFFLHNDQUFGLEVBQTBDLFdBQTFDLENBQXNELFFBQXRELEVBQWdFLElBQWhFO0FBQ0EsUUFBRSw2RUFBRixFQUFpRixXQUFqRixDQUE2RixNQUE3Rjs7QUFFQSxRQUFFLHNCQUFGLEVBQTBCLElBQTFCOztBQUVBLFFBQUUscUZBQUYsRUFBeUYsSUFBekY7QUFDQSxRQUFFLHNCQUFGLEVBQTBCLElBQTFCOztBQUVBLFFBQUUsc0NBQUYsRUFBMEMsSUFBMUM7QUFDQSxRQUFFLDJDQUFGLEVBQStDLElBQS9DO0FBQ0EsUUFBRSx1Q0FBRixFQUEyQyxJQUEzQztBQUNBLFFBQUUseUJBQUYsRUFBNkIsSUFBN0I7O0FBRUEsUUFBRSxRQUFGLEVBQVksUUFBWixDQUFxQixRQUFyQixFQUErQixXQUEvQixDQUEyQyxVQUEzQyxFQUF1RCxJQUF2RCxDQUE0RCxVQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWlCO0FBQzNFLFVBQUUsSUFBRixFQUFRLE9BQVIsQ0FBZ0IsTUFBaEIsRUFBd0IsSUFBeEIsQ0FBNkIsd0JBQTdCLEVBQXVELElBQXZEO0FBQ0QsT0FGRDtBQUdBLFFBQUUsYUFBRixFQUFpQixRQUFqQixDQUEwQixRQUExQixFQUFvQyxXQUFwQyxDQUFnRCxVQUFoRDs7QUFFQSxVQUFJLG1CQUFtQixLQUFLLFVBQUwsQ0FBZ0IsMEJBQWhCLENBQXZCO0FBQ0EsVUFBSSxxQkFBcUIsSUFBekIsRUFBK0I7QUFDN0IsVUFBRSwwQ0FBRixFQUE4QyxJQUE5QztBQUNELE9BRkQsTUFFTztBQUNMLFVBQUUsMkNBQUYsRUFBK0MsSUFBL0M7QUFDQSxVQUFFLGlCQUFGLEVBQXFCLElBQXJCO0FBQ0Q7QUFDRjs7Ozs7O2tCQUdZLElBQUksb0JBQUosRTs7Ozs7Ozs7Ozs7OztJQ3ZRVCxVO0FBQ0osd0JBQWM7QUFBQTs7QUFDWixTQUFLLEdBQUwsR0FBVztBQUNULGlCQUFXLGFBREY7QUFFVCxrQkFBWSwyQkFGSDtBQUdULHFCQUFlO0FBSE4sS0FBWDs7QUFNQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixDQUFsQjtBQUNBLFNBQUssVUFBTCxHQUFrQixLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBbEI7QUFDQSxTQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLElBQWpCLENBQWQ7QUFDQSxTQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixJQUFwQixDQUFqQjtBQUNBLFNBQUssWUFBTCxHQUFvQixLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBcEI7QUFDRDs7OztpQ0FFWTtBQUNYLFFBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixRQUF0QixDQUErQixrQkFBL0I7QUFDRDs7O2lDQUVZO0FBQ1gsUUFBRSxRQUFGLEVBQVksRUFBWixDQUFlLE9BQWYsRUFBd0IsS0FBSyxHQUFMLENBQVMsVUFBakMsRUFBNkMsS0FBSyxNQUFsRDtBQUNBLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLEtBQUssR0FBTCxDQUFTLGFBQWpDLEVBQWdELEtBQUssU0FBckQ7QUFDRDs7OzJCQUVNLEMsRUFBRztBQUNSLFFBQUUsY0FBRjtBQUNBLGNBQVEsSUFBUixDQUFhLENBQUMsQ0FBZDtBQUNEOzs7OEJBRVMsQyxFQUFHO0FBQ1gsUUFBRSxjQUFGO0FBQ0EsY0FBUSxPQUFSO0FBQ0Q7OzttQ0FFYztBQUNiLFVBQUksWUFBWSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsQ0FBdEIsQ0FBaEI7QUFDQSxVQUFJLFdBQVksSUFBSSxRQUFKLENBQWEsU0FBYixFQUF3QjtBQUN0QyxpQkFBUztBQUNQLG1CQUFTLFlBREY7QUFFUCxrQkFBUSxvQkFGRDtBQUdQLG9CQUFVLHNCQUhIO0FBSVAsZUFBSyxpQkFKRTtBQUtQLGtCQUFRLHFCQUxEO0FBTVAsa0JBQVEsb0JBTkQ7QUFPUCxxQkFBVztBQVBKO0FBRDZCLE9BQXhCLENBQWhCO0FBV0EsZUFBUyxJQUFUO0FBQ0Q7OzsyQkFFTTtBQUNMLFVBQUksYUFBYyxPQUFPLFVBQVAsQ0FBa0IsNEJBQWxCLEVBQWdELE9BQWpELElBQThELE9BQU8sU0FBUCxDQUFpQixVQUFoRztBQUNBLFVBQUksQ0FBQyxVQUFMLEVBQWlCO0FBQ2pCLFdBQUssVUFBTDtBQUNBLFdBQUssVUFBTDtBQUNBLFdBQUssWUFBTDtBQUNEOzs7Ozs7a0JBR1ksSUFBSSxVQUFKLEU7Ozs7Ozs7Ozs7Ozs7SUM1RFQsaUI7QUFDSiwrQkFBYztBQUFBOztBQUNaLFNBQUssR0FBTCxHQUFXO0FBQ1QsaUJBQVcsV0FERjtBQUVULGFBQU8sZ0JBRkU7QUFHVCxZQUFNO0FBSEcsS0FBWDtBQUtBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDQSxTQUFLLGlCQUFMLEdBQXlCLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBekI7QUFDQSxTQUFLLGtCQUFMLEdBQTBCLEtBQUssa0JBQUwsQ0FBd0IsSUFBeEIsQ0FBNkIsSUFBN0IsQ0FBMUI7QUFDRDs7Ozt3Q0FFbUI7QUFBQTs7QUFDbEIsUUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLFVBQUMsS0FBRCxFQUFRLElBQVIsRUFBaUI7QUFDMUMsWUFBSSxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsTUFBSyxHQUFMLENBQVMsS0FBdEIsRUFBNkIsTUFBN0IsSUFBdUMsQ0FBM0MsRUFBOEM7QUFDNUMsWUFBRSxJQUFGLEVBQVEsUUFBUixDQUFpQixRQUFqQjtBQUNEO0FBQ0YsT0FKRDtBQUtEOzs7eUNBRW9CO0FBQUE7O0FBQ25CLFVBQUksVUFBVSxLQUFkO0FBQ0EsUUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLEtBQXRCLENBQTRCO0FBQzFCLGVBQU8sZUFBQyxLQUFELEVBQVEsU0FBUixFQUFzQjtBQUMzQixjQUFJLFlBQWEsRUFBRSxNQUFNLE1BQVIsRUFBZ0IsRUFBaEIsQ0FBbUIsT0FBSyxHQUFMLENBQVMsU0FBNUIsSUFBeUMsRUFBRSxNQUFNLE1BQVIsQ0FBekMsR0FBMkQsRUFBRSxNQUFNLE1BQVIsRUFBZ0IsT0FBaEIsQ0FBd0IsT0FBSyxHQUFMLENBQVMsU0FBakMsQ0FBNUU7QUFDQSxvQkFBVSxJQUFWO0FBQ0EsY0FBSSxjQUFjLE1BQWxCLEVBQTBCO0FBQ3hCLHNCQUFVLFFBQVYsQ0FBbUIsTUFBbkI7QUFDRCxXQUZELE1BRU8sSUFBSSxjQUFjLE9BQWxCLEVBQTJCO0FBQ2hDLHNCQUFVLFFBQVYsQ0FBbUIsTUFBbkI7QUFDRDtBQUNGLFNBVHlCO0FBVTFCLGFBQUssYUFBVSxLQUFWLEVBQWlCO0FBQ3BCO0FBQ0EsY0FBSSxFQUFFLHFCQUFGLEVBQXlCLE1BQXpCLElBQW1DLE9BQU8sVUFBUCxHQUFvQixHQUEzRCxFQUFnRTtBQUM5RCxnQkFBSSxPQUFPLEVBQUUsTUFBTSxNQUFSLEVBQWdCLE9BQWhCLENBQXdCLHFCQUF4QixFQUErQyxLQUEvQyxHQUF1RCxJQUF2RCxDQUE0RCxXQUE1RCxDQUFYO0FBQ0EsZ0JBQUksU0FBUyxFQUFiLEVBQWlCO0FBQ2YscUJBQU8sUUFBUCxHQUFrQixJQUFsQjtBQUNEO0FBQ0Y7QUFDRixTQWxCeUI7QUFtQjFCLHlCQUFpQjtBQW5CUyxPQUE1Qjs7QUFzQkEsUUFBRSxLQUFLLEdBQUwsQ0FBUyxJQUFYLEVBQWlCLEVBQWpCLENBQW9CLE9BQXBCLEVBQTZCLFlBQVk7QUFDdkMsWUFBSSxDQUFDLE9BQUwsRUFBYztBQUNaLGNBQUksT0FBTyxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsV0FBYixDQUFYO0FBQ0EsY0FBSSxTQUFTLEVBQWIsRUFBaUI7QUFDZixtQkFBTyxRQUFQLEdBQWtCLElBQWxCO0FBQ0Q7QUFDRjtBQUNELGtCQUFVLEtBQVY7QUFDRCxPQVJEO0FBU0Q7OzsyQkFFTTtBQUNMLFVBQUksRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLE1BQXRCLElBQWdDLENBQXBDLEVBQXVDLE9BQU8sS0FBUDtBQUN2QyxXQUFLLGtCQUFMO0FBQ0EsV0FBSyxpQkFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7a0JBR1ksSUFBSSxpQkFBSixFOzs7Ozs7Ozs7Ozs7O0lDL0RULGU7QUFDSiw2QkFBYztBQUFBOztBQUNaLFNBQUssTUFBTCxHQUFjO0FBQ1osZ0JBQVUsK0JBREU7QUFFWix1QkFBaUIsbURBRkw7QUFHWix3QkFBa0IsZ0RBSE47QUFJWixzQkFBZ0I7QUFKSixLQUFkOztBQU9BLFNBQUssR0FBTCxHQUFXO0FBQ1QsaUJBQVc7QUFERixLQUFYOztBQUlBLFNBQUssYUFBTCxHQUFxQixLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBckI7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixDQUFsQjtBQUNBLFNBQUssVUFBTCxHQUFrQixLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBbEI7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUFoQjs7QUFFQSxTQUFLLDJCQUFMLEdBQW1DLEtBQUssMkJBQUwsQ0FBaUMsSUFBakMsQ0FBc0MsSUFBdEMsQ0FBbkM7QUFDQSxTQUFLLDhCQUFMLEdBQXNDLEtBQUssOEJBQUwsQ0FBb0MsSUFBcEMsQ0FBeUMsSUFBekMsQ0FBdEM7QUFDQSxTQUFLLGdDQUFMLEdBQXdDLEtBQUssZ0NBQUwsQ0FBc0MsSUFBdEMsQ0FBMkMsSUFBM0MsQ0FBeEM7QUFDRDs7OztpQ0FFWSxDQUNaOzs7b0NBRWU7QUFDZCxVQUFNLFNBQVMsRUFBRSxxQ0FBRixFQUF5QyxJQUF6QyxDQUE4QyxTQUE5QyxDQUFmO0FBQ0EsYUFBUSxTQUFTLE1BQVQsR0FBa0IsRUFBMUI7QUFDRDs7OytCQUVVLEksRUFBTTtBQUNmLFVBQUksU0FBUyxPQUFPLEdBQXBCO0FBQ0EsVUFBSSxLQUFLLFNBQVMsTUFBVCxDQUFnQixLQUFoQixDQUFzQixHQUF0QixDQUFUO0FBQ0EsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEdBQUcsTUFBdkIsRUFBK0IsR0FBL0IsRUFBb0M7QUFDbEMsWUFBSSxJQUFJLEdBQUcsQ0FBSCxDQUFSO0FBQ0EsZUFBTyxFQUFFLE1BQUYsQ0FBUyxDQUFULE1BQWdCLEdBQXZCO0FBQTRCLGNBQUksRUFBRSxTQUFGLENBQVksQ0FBWixFQUFlLEVBQUUsTUFBakIsQ0FBSjtBQUE1QixTQUNBLElBQUksRUFBRSxPQUFGLENBQVUsTUFBVixNQUFzQixDQUExQixFQUE2QixPQUFPLEVBQUUsU0FBRixDQUFZLE9BQU8sTUFBbkIsRUFBMkIsRUFBRSxNQUE3QixDQUFQO0FBQzlCOztBQUVELGFBQU8sSUFBUDtBQUNEOzs7MkJBRU07QUFDTCxVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixNQUF0QixJQUFnQyxDQUFwQyxFQUF1QyxPQUFPLEtBQVA7QUFDdkMsV0FBSyxVQUFMO0FBQ0EsV0FBSyxRQUFMO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7OzsrQkFFVTtBQUFBOztBQUNULFVBQUksbUJBQW1CLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxDQUF2Qjs7QUFFQSxVQUFJLGlCQUFpQixNQUFqQixHQUEwQixDQUE5QixFQUFpQztBQUMvQix5QkFBaUIsSUFBakIsQ0FBc0IsVUFBQyxLQUFELEVBQVEsSUFBUixFQUFpQjtBQUNyQyxjQUFJLEVBQUUsSUFBRixFQUFRLE9BQVIsQ0FBZ0IseUJBQWhCLEVBQTJDLFFBQTNDLENBQW9ELGVBQXBELENBQUosRUFBMEU7QUFDeEUsY0FBRSxJQUFGLEVBQVEsUUFBUixDQUFpQjtBQUNmLHFCQUFPO0FBQ0wscUNBQXFCO0FBRGhCLGVBRFE7QUFJZiw4QkFBZ0Isd0JBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDbEMsb0JBQUksUUFBUSxJQUFSLENBQWEsTUFBYixNQUF5QixVQUE3QixFQUF5QztBQUN2Qyx3QkFBTSxXQUFOLENBQWtCLEVBQUUsT0FBRixFQUFXLE1BQVgsR0FBb0IsSUFBcEIsQ0FBeUIsT0FBekIsQ0FBbEI7QUFDRCxpQkFGRCxNQUVPLElBQUksUUFBUSxJQUFSLENBQWEsTUFBYixNQUF5QixVQUE3QixFQUF5QztBQUM5QyxvQkFBRSxPQUFGLEVBQVcsTUFBWCxDQUFrQixLQUFsQjtBQUNBLHdCQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxFQUFsQjtBQUNELGlCQUhNLE1BR0EsSUFBSSxRQUFRLElBQVIsQ0FBYSxNQUFiLE1BQXlCLFFBQTdCLEVBQXVDO0FBQzVDLHdCQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxFQUFsQjtBQUNELGlCQUZNLE1BRUE7QUFDTCx3QkFBTSxXQUFOLENBQWtCLEVBQUUsT0FBRixFQUFXLE1BQVgsRUFBbEI7QUFDRDtBQUNGLGVBZmM7QUFnQmYsNkJBQWUsdUJBQUMsSUFBRCxFQUFVO0FBQ3ZCLHNCQUFLLDhCQUFMLENBQW9DLElBQXBDO0FBQ0EsdUJBQU8sS0FBUDtBQUNEO0FBbkJjLGFBQWpCO0FBcUJELFdBdEJELE1Bc0JPO0FBQ0wsY0FBRSxJQUFGLEVBQVEsUUFBUixDQUFpQjtBQUNmLDhCQUFnQix3QkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNsQyxvQkFBSSxRQUFRLElBQVIsQ0FBYSxNQUFiLE1BQXlCLFVBQTdCLEVBQXlDO0FBQ3ZDLHdCQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxHQUFvQixJQUFwQixDQUF5QixPQUF6QixDQUFsQjtBQUNELGlCQUZELE1BRU8sSUFBSSxRQUFRLElBQVIsQ0FBYSxNQUFiLE1BQXlCLFVBQTdCLEVBQXlDO0FBQzlDLG9CQUFFLE9BQUYsRUFBVyxNQUFYLENBQWtCLEtBQWxCO0FBQ0Esd0JBQU0sV0FBTixDQUFrQixFQUFFLE9BQUYsRUFBVyxNQUFYLEVBQWxCO0FBQ0QsaUJBSE0sTUFHQSxJQUFJLFFBQVEsSUFBUixDQUFhLE1BQWIsTUFBeUIsUUFBN0IsRUFBdUM7QUFDNUMsd0JBQU0sV0FBTixDQUFrQixFQUFFLE9BQUYsRUFBVyxNQUFYLEVBQWxCO0FBQ0QsaUJBRk0sTUFFQTtBQUNMLHdCQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxFQUFsQjtBQUNEO0FBQ0YsZUFaYztBQWFmLDZCQUFlLHVCQUFDLElBQUQsRUFBVTtBQUN2QixzQkFBSywyQkFBTCxDQUFpQyxJQUFqQztBQUNBLHVCQUFPLEtBQVA7QUFDRDtBQWhCYyxhQUFqQjtBQWtCRDtBQUNGLFNBM0NEO0FBNENEO0FBQ0Y7OzttREFHOEIsSSxFQUFNO0FBQUE7O0FBQ25DLFVBQUksTUFBTSxFQUFFLElBQUYsQ0FBVjs7QUFFQSxVQUFJLE9BQU8sRUFBWDtBQUNBLFVBQUksSUFBSSxJQUFKLENBQVMsY0FBVCxFQUF5QixNQUF6QixLQUFvQyxDQUF4QyxFQUEyQztBQUN6QyxZQUFJLFNBQVMsSUFBSSxJQUFKLENBQVMsNkJBQVQsRUFBd0MsR0FBeEMsRUFBYjtBQUNBLFlBQUksV0FBVyxJQUFYLElBQW1CLE9BQU8sTUFBUCxLQUFrQixDQUF6QyxFQUE0QztBQUMxQyxnQkFBTSx5QkFBTjtBQUNBO0FBQ0Q7O0FBRUQsZUFBTztBQUNMLHFCQUFXLElBQUksSUFBSixDQUFTLDJCQUFULEVBQXNDLEdBQXRDLEVBRE47QUFFTCxvQkFBVSxJQUFJLElBQUosQ0FBUywwQkFBVCxFQUFxQyxHQUFyQyxFQUZMO0FBR0wsaUJBQU8sSUFBSSxJQUFKLENBQVMsMkJBQVQsRUFBc0MsR0FBdEMsRUFIRjs7QUFLTCxvQkFBVSxJQUFJLElBQUosQ0FBUywwQkFBVCxFQUFxQyxHQUFyQyxFQUxMO0FBTUwsbUJBQVMsSUFBSSxJQUFKLENBQVMsK0JBQVQsRUFBMEMsR0FBMUMsRUFOSjtBQU9MLGdCQUFNLElBQUksSUFBSixDQUFTLCtCQUFULEVBQTBDLEdBQTFDLEVBUEQ7QUFRTCxrQkFBUSxJQUFJLElBQUosQ0FBUyxpQ0FBVCxFQUE0QyxHQUE1QyxFQVJIOztBQVVMLGdCQUFNLElBQUksSUFBSixDQUFTLE1BQVQsQ0FWRDtBQVdMLGtCQUFRO0FBWEgsU0FBUDtBQWFELE9BcEJELE1Bb0JPO0FBQ0wsZUFBTztBQUNMLHFCQUFXLElBQUksSUFBSixDQUFTLDJCQUFULEVBQXNDLEdBQXRDLEVBRE47QUFFTCxvQkFBVSxJQUFJLElBQUosQ0FBUywwQkFBVCxFQUFxQyxHQUFyQyxFQUZMO0FBR0wsaUJBQU8sSUFBSSxJQUFKLENBQVMsMkJBQVQsRUFBc0MsR0FBdEMsRUFIRjs7QUFLTCxvQkFBVSxJQUFJLElBQUosQ0FBUywwQkFBVCxFQUFxQyxHQUFyQyxFQUxMO0FBTUwsbUJBQVMsSUFBSSxJQUFKLENBQVMsK0JBQVQsRUFBMEMsR0FBMUMsRUFOSjtBQU9MLGdCQUFNLElBQUksSUFBSixDQUFTLCtCQUFULEVBQTBDLEdBQTFDLEVBUEQ7QUFRTCxrQkFBUSxJQUFJLElBQUosQ0FBUyxpQ0FBVCxFQUE0QyxHQUE1QyxFQVJIOztBQVVMLGdCQUFNLElBQUksSUFBSixDQUFTLE1BQVQ7QUFWRCxTQUFQOztBQWFBLFlBQUksSUFBSixDQUFTLGNBQVQsRUFBeUIsSUFBekIsQ0FBOEIsVUFBQyxLQUFELEVBQVEsSUFBUixFQUFpQjtBQUM3QyxjQUFJLE1BQU0sRUFBRSxJQUFGLEVBQVEsR0FBUixFQUFWO0FBQ0EsY0FBSSxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsT0FBYixNQUEwQixDQUE5QixFQUFpQztBQUMvQixpQkFBSyxNQUFMLEdBQWMsR0FBZDtBQUNELFdBRkQsTUFFTztBQUNMLGlCQUFLLFdBQVcsRUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLE9BQWIsQ0FBaEIsSUFBeUMsR0FBekM7QUFDRDtBQUNGLFNBUEQ7QUFRRDtBQUNELFVBQUssRUFBRSxJQUFGLENBQU8sS0FBSyxTQUFaLEVBQXVCLE1BQXZCLEtBQWtDLENBQW5DLElBQTBDLEVBQUUsSUFBRixDQUFPLEtBQUssUUFBWixFQUFzQixNQUF0QixLQUFpQyxDQUEzRSxJQUFrRixFQUFFLElBQUYsQ0FBTyxLQUFLLEtBQVosRUFBbUIsTUFBbkIsS0FBOEIsQ0FBcEgsRUFBd0g7QUFDdEgsY0FBTSxnRUFBTjtBQUNELE9BRkQsTUFFTztBQUNMLFlBQUksSUFBSixDQUFTLHVCQUFULEVBQWtDLElBQWxDLENBQXVDLGdCQUF2QztBQUNBLFlBQUksSUFBSixDQUFTLHNCQUFULEVBQWlDLEdBQWpDLENBQXFDLGdCQUFyQzs7QUFFQSxVQUFFLEdBQUYsQ0FBTSxLQUFLLGFBQUwsS0FBdUIsS0FBSyxNQUFMLENBQVksUUFBekMsRUFBbUQsVUFBQyxhQUFELEVBQW1CO0FBQ3BFLGNBQUksWUFBWSxjQUFjLEtBQTlCOztBQUVBLFlBQUUsSUFBRixDQUFPO0FBQ0wsaUJBQUssT0FBSyxhQUFMLEtBQXVCLE9BQUssTUFBTCxDQUFZLGNBRG5DO0FBRUwsa0JBQU0sSUFGRDtBQUdMLGtCQUFNLE1BSEQ7QUFJTCxxQkFBUyxFQUFFLGNBQWMsU0FBaEIsRUFKSjtBQUtMLHNCQUFVLE1BTEw7QUFNTCxxQkFBUyxpQkFBQyxRQUFELEVBQWM7QUFDckIsa0JBQUksUUFBSixFQUFjO0FBQ1osb0JBQUksU0FBUyxNQUFULEtBQW9CLElBQXhCLEVBQThCO0FBQzVCLHNCQUFJLFFBQVEsSUFBSSxPQUFKLENBQVksd0JBQVosRUFBc0MsSUFBdEMsQ0FBMkMsUUFBM0MsQ0FBWjtBQUNBLHdCQUFNLElBQU4sQ0FBVyxjQUFYLEVBQTJCLElBQTNCLENBQWdDLEtBQUssU0FBckM7QUFDQTtBQUNBLHdCQUFNLElBQU4sR0FBYSxRQUFiLENBQXNCLE1BQXRCOztBQUVBLHNCQUFJLE9BQUosQ0FBWSx5QkFBWixFQUF1QyxJQUF2QztBQUNELGlCQVBELE1BT087QUFDTCx3QkFBTSxtRUFBbUUsU0FBUyxLQUFsRjtBQUNEO0FBQ0YsZUFYRCxNQVdPO0FBQ0wsc0JBQU0sNkZBQU47QUFDRDtBQUNELGtCQUFJLElBQUosQ0FBUyx1QkFBVCxFQUFrQyxJQUFsQyxDQUF1Qyx1QkFBdkM7QUFDQSxrQkFBSSxJQUFKLENBQVMsc0JBQVQsRUFBaUMsR0FBakMsQ0FBcUMsdUJBQXJDO0FBQ0Q7QUF2QkksV0FBUDtBQXlCRCxTQTVCRDtBQTZCRDtBQUNGOzs7Z0RBRTJCLEksRUFBTTtBQUFBOztBQUNoQyxVQUFJLE1BQU0sRUFBRSxJQUFGLENBQVY7QUFDQSxVQUFJLElBQUosQ0FBUyx1QkFBVCxFQUFrQyxJQUFsQyxDQUF1QyxnQkFBdkM7QUFDQSxVQUFJLElBQUosQ0FBUyxzQkFBVCxFQUFpQyxHQUFqQyxDQUFxQyxnQkFBckM7O0FBRUEsVUFBSSxTQUFTLEtBQUssVUFBTCxDQUFnQixlQUFoQixDQUFiO0FBQ0EsVUFBSSxXQUFXLElBQWYsRUFBcUI7QUFDbkIsWUFBSSxRQUFRLE9BQU8sS0FBUCxDQUFhLEdBQWIsQ0FBWjtBQUNBLFlBQUksTUFBTSxNQUFOLElBQWdCLENBQXBCLEVBQXVCO0FBQ3JCLFlBQUUsR0FBRixDQUFNLEtBQUssYUFBTCxLQUF1QixLQUFLLE1BQUwsQ0FBWSxRQUF6QyxFQUFtRCxVQUFDLGFBQUQsRUFBbUI7QUFDcEUsZ0JBQUksWUFBWSxjQUFjLEtBQTlCO0FBQ0EsY0FBRSxJQUFGLENBQU87QUFDTCxtQkFBSyxPQUFLLGFBQUwsS0FBdUIsT0FBSyxNQUFMLENBQVksZ0JBRG5DO0FBRUwsb0JBQU0sRUFBRSxVQUFVLE1BQU0sQ0FBTixDQUFaLEVBQXNCLE9BQU8sTUFBTSxDQUFOLENBQTdCLEVBRkQ7QUFHTCxvQkFBTSxNQUhEO0FBSUwsdUJBQVMsRUFBRSxjQUFjLFNBQWhCLEVBSko7QUFLTCx3QkFBVSxNQUxMO0FBTUwsdUJBQVMsaUJBQUMsa0JBQUQsRUFBd0I7QUFDL0Isb0JBQUksa0JBQUosRUFBd0I7QUFDdEIsc0JBQUksbUJBQW1CLE1BQW5CLEtBQThCLElBQWxDLEVBQXdDO0FBQ3RDLDJCQUFLLGdDQUFMLENBQXNDLElBQXRDLEVBQTRDLGtCQUE1QztBQUNELG1CQUZELE1BRU87QUFDTCwwQkFBTSw2RkFBTjtBQUNEO0FBQ0YsaUJBTkQsTUFNTztBQUNMLHdCQUFNLDZGQUFOO0FBQ0Q7QUFDRjtBQWhCSSxhQUFQO0FBa0JELFdBcEJEO0FBcUJELFNBdEJELE1Bc0JPO0FBQ0wsZ0JBQU0sNkZBQU47QUFDRDtBQUNGLE9BM0JELE1BMkJPO0FBQ0wsWUFBSSxnQkFBZ0IsS0FBSyxVQUFMLENBQWdCLGtCQUFoQixDQUFwQjtBQUNBLFlBQUksa0JBQWtCLElBQXRCLEVBQTRCO0FBQzFCLGNBQUksZUFBZSxjQUFjLEtBQWQsQ0FBb0IsR0FBcEIsQ0FBbkI7QUFDQSxjQUFJLGFBQWEsTUFBYixJQUF1QixDQUEzQixFQUE4QjtBQUM1QixjQUFFLEdBQUYsQ0FBTSxLQUFLLGFBQUwsS0FBdUIsS0FBSyxNQUFMLENBQVksUUFBekMsRUFBbUQsVUFBQyxhQUFELEVBQW1CO0FBQ3BFLGtCQUFJLFlBQVksY0FBYyxLQUE5QjtBQUNBLGdCQUFFLElBQUYsQ0FBTztBQUNMLHFCQUFLLE9BQUssYUFBTCxLQUF1QixPQUFLLE1BQUwsQ0FBWSxlQURuQztBQUVMLHNCQUFNLEVBQUUsVUFBVSxhQUFhLENBQWIsQ0FBWixFQUE2QixlQUFlLGFBQWEsQ0FBYixDQUE1QyxFQUZEO0FBR0wsc0JBQU0sTUFIRDtBQUlMLHlCQUFTLEVBQUUsY0FBYyxTQUFoQixFQUpKO0FBS0wsMEJBQVUsTUFMTDtBQU1MLHlCQUFTLGlCQUFDLGVBQUQsRUFBcUI7QUFDNUIsc0JBQUksZUFBSixFQUFxQjtBQUNuQix3QkFBSSxnQkFBZ0IsTUFBaEIsS0FBMkIsSUFBL0IsRUFBcUM7QUFDbkMsd0JBQUUsTUFBRixFQUFVLE9BQVYsQ0FBa0IscUJBQWxCLEVBQXlDLENBQUUsZUFBRixFQUFtQixJQUFuQixDQUF6QztBQUNBLDZCQUFLLDJCQUFMLENBQWlDLElBQWpDO0FBQ0QscUJBSEQsTUFHTztBQUNMLDRCQUFNLDZGQUFOO0FBQ0Q7QUFDRixtQkFQRCxNQU9PO0FBQ0wsMEJBQU0sNkZBQU47QUFDRDtBQUNGO0FBakJJLGVBQVA7QUFtQkQsYUFyQkQ7QUFzQkQsV0F2QkQsTUF1Qk87QUFDTCxrQkFBTSw2RkFBTjtBQUNEO0FBQ0YsU0E1QkQsTUE0Qk87QUFDTCxnQkFBTSw2RkFBTjtBQUNEO0FBQ0Y7QUFDRjs7O3FEQUVnQyxJLEVBQU0sTyxFQUFTO0FBQUE7O0FBQzlDLFVBQUksTUFBTSxFQUFFLElBQUYsQ0FBVjs7QUFFQSxVQUFJLFNBQVMsRUFBYjtBQUNBLFVBQUksSUFBSSxJQUFKLENBQVMsY0FBVCxFQUF5QixNQUF6QixHQUFrQyxDQUF0QyxFQUF5QztBQUN2QyxpQkFBUyxJQUFJLElBQUosQ0FBUyxjQUFULEVBQXlCLEdBQXpCLEVBQVQ7QUFDRCxPQUZELE1BRU87QUFDTCxpQkFBUyxJQUFJLElBQUosQ0FBUyw2QkFBVCxFQUF3QyxHQUF4QyxFQUFUO0FBQ0EsWUFBSSxXQUFXLElBQVgsSUFBbUIsT0FBTyxNQUFQLEtBQWtCLENBQXpDLEVBQTRDO0FBQzFDLGdCQUFNLHlCQUFOO0FBQ0EsY0FBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsSUFBbEMsQ0FBdUMsMkJBQTJCLFFBQVEsc0JBQTFFO0FBQ0EsY0FBSSxJQUFKLENBQVMsc0JBQVQsRUFBaUMsR0FBakMsQ0FBcUMsMkJBQTJCLFFBQVEsc0JBQXhFO0FBQ0E7QUFDRDtBQUNGOztBQUVELFVBQUksT0FBTztBQUNULG1CQUFXLFFBQVEsc0JBRFY7QUFFVCxrQkFBVSxRQUFRLHFCQUZUO0FBR1QsZUFBTyxRQUFRLGtCQUhOOztBQUtULGtCQUFVLFFBQVEscUJBTFQ7QUFNVCxpQkFBUyxRQUFRLG9CQU5SO0FBT1QsY0FBTSxRQUFRLGlCQVBMO0FBUVQsZ0JBQVEsUUFBUSxtQkFSUDs7QUFVVCxjQUFNLElBQUksSUFBSixDQUFTLE1BQVQsQ0FWRztBQVdULGdCQUFRO0FBWEMsT0FBWDs7QUFjQSxVQUFLLEVBQUUsSUFBRixDQUFPLEtBQUssTUFBWixFQUFvQixNQUFwQixLQUErQixDQUFoQyxJQUF1QyxFQUFFLElBQUYsQ0FBTyxLQUFLLFNBQVosRUFBdUIsTUFBdkIsS0FBa0MsQ0FBekUsSUFBZ0YsRUFBRSxJQUFGLENBQU8sS0FBSyxRQUFaLEVBQXNCLE1BQXRCLEtBQWlDLENBQWpILElBQXdILEVBQUUsSUFBRixDQUFPLEtBQUssS0FBWixFQUFtQixNQUFuQixLQUE4QixDQUExSixFQUE4SjtBQUM1SixjQUFNLGdFQUFOO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsSUFBbEMsQ0FBdUMsZ0JBQXZDO0FBQ0EsWUFBSSxJQUFKLENBQVMsc0JBQVQsRUFBaUMsR0FBakMsQ0FBcUMsZ0JBQXJDOztBQUVBLFVBQUUsR0FBRixDQUFNLEtBQUssYUFBTCxLQUF1QixLQUFLLE1BQUwsQ0FBWSxRQUF6QyxFQUFtRCxVQUFDLGFBQUQsRUFBbUI7QUFDcEUsY0FBSSxZQUFZLGNBQWMsS0FBOUI7QUFDQSxZQUFFLElBQUYsQ0FBTztBQUNMLGlCQUFLLE9BQUssYUFBTCxLQUF1QixPQUFLLE1BQUwsQ0FBWSxjQURuQztBQUVMLGtCQUFNLElBRkQ7QUFHTCxrQkFBTSxNQUhEO0FBSUwscUJBQVMsRUFBRSxjQUFjLFNBQWhCLEVBSko7QUFLTCxzQkFBVSxNQUxMO0FBTUwscUJBQVMsaUJBQUMsUUFBRCxFQUFjO0FBQ3JCLGtCQUFJLFFBQUosRUFBYztBQUNaLG9CQUFJLFNBQVMsTUFBVCxLQUFvQixJQUF4QixFQUE4QjtBQUM1QixzQkFBSSxRQUFRLElBQUksT0FBSixDQUFZLHdCQUFaLEVBQXNDLElBQXRDLENBQTJDLFFBQTNDLENBQVo7QUFDQSx3QkFBTSxJQUFOLENBQVcsY0FBWCxFQUEyQixJQUEzQixDQUFnQyxLQUFLLFNBQXJDO0FBQ0E7QUFDQSx3QkFBTSxJQUFOLEdBQWEsUUFBYixDQUFzQixNQUF0Qjs7QUFFQSxzQkFBSSxPQUFKLENBQVkseUJBQVosRUFBdUMsSUFBdkM7QUFDRCxpQkFQRCxNQU9PO0FBQ0wsd0JBQU0sbUVBQW1FLFNBQVMsS0FBbEY7QUFDRDtBQUNGLGVBWEQsTUFXTztBQUNMLHNCQUFNLDZGQUFOO0FBQ0Q7QUFDRCxrQkFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsSUFBbEMsQ0FBdUMsMkJBQTJCLEtBQUssU0FBdkU7QUFDQSxrQkFBSSxJQUFKLENBQVMsc0JBQVQsRUFBaUMsR0FBakMsQ0FBcUMsMkJBQTJCLEtBQUssU0FBckU7QUFDRDtBQXZCSSxXQUFQO0FBeUJELFNBM0JEO0FBNEJEOztBQUVELFVBQUksSUFBSixDQUFTLHVCQUFULEVBQWtDLElBQWxDLENBQXVDLHVCQUF2QztBQUNBLFVBQUksSUFBSixDQUFTLHNCQUFULEVBQWlDLEdBQWpDLENBQXFDLHVCQUFyQztBQUNEOzs7Ozs7a0JBR1ksSUFBSSxlQUFKLEU7Ozs7Ozs7O2tCQ3hVQTtBQUNiLE9BQUs7QUFDSCxRQUFJLGtCQUREO0FBRUgsb0JBQWdCO0FBRmI7QUFEUSxDOzs7Ozs7Ozs7Ozs7O0lDQVQsWTtBQUNKLDBCQUFjO0FBQUE7O0FBQ1osU0FBSyxHQUFMLEdBQVc7QUFDVCxpQkFBVyxnQkFERjtBQUVULG1CQUFhO0FBRkosS0FBWDs7QUFLQSxTQUFLLFVBQUwsR0FBa0Isb0JBQWxCOztBQUVBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxnQkFBTCxHQUF3QixLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBQXhCO0FBQ0EsU0FBSyxnQkFBTCxHQUF3QixLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBQXhCO0FBQ0EsU0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNEOzs7OzJCQUVNO0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxLQUFQO0FBQ3ZDLFdBQUssVUFBTDtBQUNBLFdBQUssYUFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7aUNBRVk7QUFBQTs7QUFDWCxRQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsT0FBZixFQUF3QixLQUFLLEdBQUwsQ0FBUyxXQUFqQyxFQUE4QyxZQUFNO0FBQ2xELGNBQUssZ0JBQUw7QUFDQSxnQkFBUSxHQUFSLENBQVksTUFBSyxVQUFqQixFQUE2QixFQUFDLE1BQU0sQ0FBUCxFQUE3QjtBQUNELE9BSEQ7QUFJRDs7O29DQUVlO0FBQ2QsVUFBSSxTQUFTLFFBQVEsR0FBUixDQUFZLEtBQUssVUFBakIsQ0FBYjs7QUFFQSxVQUFJLE9BQU8sTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUNqQyxhQUFLLGdCQUFMO0FBQ0Q7QUFDRjs7O3VDQUVrQjtBQUNqQixRQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsUUFBdEIsQ0FBK0Isd0JBQS9CO0FBQ0Q7Ozt1Q0FFa0I7QUFDakIsUUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLFdBQXRCLENBQWtDLHdCQUFsQztBQUNBLFFBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixNQUF0QjtBQUNEOzs7Ozs7a0JBR1ksSUFBSSxZQUFKLEU7Ozs7Ozs7Ozs7O0FDaERmOzs7Ozs7OztJQUVNLFE7QUFDSixzQkFBYztBQUFBOztBQUNaLFNBQUssUUFBTCxHQUFnQixJQUFoQjs7QUFFQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixDQUFsQjtBQUNBLFNBQUssYUFBTCxHQUFxQixLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBckI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5COztBQUVBO0FBQ0EsUUFBSSxPQUFPLE9BQVgsRUFBb0I7QUFDbEIsV0FBSyxVQUFMO0FBQ0Q7QUFDRjs7OztpQ0FFWTtBQUNYLFdBQUssUUFBTCxHQUFnQixJQUFJLElBQUosQ0FBUyxvQkFBVSxHQUFWLENBQWMsRUFBdkIsRUFBMkIsQ0FBM0IsRUFBOEIsVUFBQyxTQUFELEVBQWU7QUFDM0QsWUFBSSxDQUFDLFVBQVUsZ0JBQVYsQ0FBMkIsUUFBM0IsQ0FBb0Msb0JBQVUsR0FBVixDQUFjLGNBQWxELENBQUwsRUFBd0U7QUFDdEUsY0FBSSxZQUFZLFVBQVUsaUJBQVYsQ0FBNEIsb0JBQVUsR0FBVixDQUFjLGNBQTFDLEVBQTBEO0FBQ3hFLHFCQUFTO0FBRCtELFdBQTFELENBQWhCO0FBR0Esb0JBQVUsV0FBVixDQUFzQixPQUF0QixFQUErQixPQUEvQixFQUF3QyxFQUFDLFFBQVEsS0FBVCxFQUF4QztBQUNBLG9CQUFVLFdBQVYsQ0FBc0IsTUFBdEIsRUFBOEIsTUFBOUIsRUFBc0MsRUFBQyxRQUFRLElBQVQsRUFBdEM7QUFDQSxvQkFBVSxXQUFWLENBQXNCLGFBQXRCLEVBQXFDLGFBQXJDLEVBQW9ELEVBQUMsUUFBUSxLQUFULEVBQXBEO0FBQ0Esb0JBQVUsV0FBVixDQUFzQixjQUF0QixFQUFzQyxjQUF0QyxFQUFzRCxFQUFDLFFBQVEsS0FBVCxFQUF0RDtBQUNBLG9CQUFVLFdBQVYsQ0FBc0IsY0FBdEIsRUFBc0MsY0FBdEMsRUFBc0QsRUFBQyxRQUFRLEtBQVQsRUFBdEQ7QUFDQSxvQkFBVSxXQUFWLENBQXNCLFlBQXRCLEVBQW9DLFlBQXBDLEVBQWtELEVBQUMsUUFBUSxLQUFULEVBQWxEO0FBQ0Esb0JBQVUsV0FBVixDQUFzQixhQUF0QixFQUFxQyxhQUFyQyxFQUFvRCxFQUFDLFFBQVEsS0FBVCxFQUFwRDtBQUNBLG9CQUFVLFdBQVYsQ0FBc0IsY0FBdEIsRUFBc0MsY0FBdEMsRUFBc0QsRUFBQyxRQUFRLEtBQVQsRUFBdEQ7QUFDQSxvQkFBVSxXQUFWLENBQXNCLFNBQXRCLEVBQWlDLFNBQWpDLEVBQTRDLEVBQUMsUUFBUSxLQUFULEVBQTVDO0FBQ0Esb0JBQVUsV0FBVixDQUFzQixTQUF0QixFQUFpQyxTQUFqQyxFQUE0QyxFQUFDLFFBQVEsS0FBVCxFQUE1QztBQUNBLG9CQUFVLFdBQVYsQ0FBc0IsV0FBdEIsRUFBbUMsV0FBbkMsRUFBZ0QsRUFBQyxRQUFRLEtBQVQsRUFBaEQ7QUFDRDtBQUNGLE9BakJlLENBQWhCO0FBa0JEOzs7a0NBRWEsSSxFQUFNO0FBQ2xCLGFBQU8sS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixVQUFDLEVBQUQsRUFBUTtBQUNoQyxZQUFJLGNBQWMsR0FBRyxXQUFILENBQWUsQ0FBQyxvQkFBVSxHQUFWLENBQWMsY0FBZixDQUFmLEVBQStDLFdBQS9DLENBQWxCO0FBQ0EsWUFBSSxRQUFRLFlBQVksV0FBWixDQUF3QixvQkFBVSxHQUFWLENBQWMsY0FBdEMsQ0FBWjtBQUNBLGVBQU8sUUFBUSxHQUFSLENBQVksQ0FDakIsTUFBTSxNQUFOLENBQWEsSUFBYixDQURpQixFQUVqQixZQUFZLFFBRkssQ0FBWixDQUFQO0FBSUQsT0FQTSxDQUFQO0FBUUQ7OzsrQkFFVSxLLEVBQU8sSSxFQUFNLFcsRUFBYSxZLEVBQWMsWSxFQUFjLFUsRUFBWSxXLEVBQWEsWSxFQUFjLE8sRUFBUyxPLEVBQVMsUyxFQUFXO0FBQ25JLGFBQU8sS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixVQUFDLEVBQUQsRUFBUTtBQUNoQyxZQUFJLGNBQWMsR0FBRyxXQUFILENBQWUsQ0FBQyxvQkFBVSxHQUFWLENBQWMsY0FBZixDQUFmLEVBQStDLFdBQS9DLENBQWxCO0FBQ0EsWUFBSSxRQUFRLFlBQVksV0FBWixDQUF3QixvQkFBVSxHQUFWLENBQWMsY0FBdEMsQ0FBWjtBQUNBLGVBQU8sUUFBUSxHQUFSLENBQVksQ0FDakIsTUFBTSxHQUFOLENBQVU7QUFDUixzQkFEUTtBQUVSLG9CQUZRO0FBR1Isa0NBSFE7QUFJUixvQ0FKUTtBQUtSLG9DQUxRO0FBTVIsZ0NBTlE7QUFPUixrQ0FQUTtBQVFSLG9DQVJRO0FBU1IsMEJBVFE7QUFVUiwwQkFWUTtBQVdSO0FBWFEsU0FBVixDQURpQixFQWNqQixZQUFZLFFBZEssQ0FBWixDQUFQO0FBZ0JELE9BbkJNLENBQVA7QUFvQkQ7OztrQ0FFYTtBQUNaLGFBQU8sS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixVQUFDLEVBQUQsRUFBUTtBQUNoQyxZQUFJLGNBQWMsR0FBRyxXQUFILENBQWUsQ0FBQyxvQkFBVSxHQUFWLENBQWMsY0FBZixDQUFmLEVBQStDLFVBQS9DLENBQWxCO0FBQ0EsWUFBSSxRQUFRLFlBQVksV0FBWixDQUF3QixvQkFBVSxHQUFWLENBQWMsY0FBdEMsQ0FBWjtBQUNBLGVBQU8sTUFBTSxNQUFOLEVBQVA7QUFDRCxPQUpNLENBQVA7QUFLRDs7Ozs7O2tCQUdZLElBQUksUUFBSixFOzs7Ozs7Ozs7Ozs7O0lDakZULGlCO0FBQ0osK0JBQWM7QUFBQTs7QUFDWixTQUFLLE1BQUwsR0FBYztBQUNaLGdCQUFVLCtCQURFO0FBRVosdUJBQWlCLG1EQUZMO0FBR1osd0JBQWtCLGdEQUhOO0FBSVosd0JBQWtCO0FBSk4sS0FBZDs7QUFPQSxTQUFLLEdBQUwsR0FBVztBQUNULGlCQUFXO0FBREYsS0FBWDs7QUFJQSxTQUFLLGFBQUwsR0FBcUIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixDQUFsQjtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDQSxTQUFLLFlBQUwsR0FBb0IsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCLENBQXBCOztBQUVBLFNBQUssZ0JBQUwsR0FBd0IsS0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixJQUEzQixDQUF4QjtBQUNBLFNBQUsscUJBQUwsR0FBNkIsS0FBSyxxQkFBTCxDQUEyQixJQUEzQixDQUFnQyxJQUFoQyxDQUE3Qjs7QUFFQSxTQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUFoQjtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDRDs7OztvQ0FFZTtBQUNkLFVBQU0sU0FBUyxFQUFFLHFDQUFGLEVBQXlDLElBQXpDLENBQThDLFNBQTlDLENBQWY7QUFDQSxhQUFRLFNBQVMsTUFBVCxHQUFrQixFQUExQjtBQUNEOzs7a0NBRWE7QUFDWixVQUFNLE9BQU8sRUFBRSxtQ0FBRixFQUF1QyxJQUF2QyxDQUE0QyxTQUE1QyxDQUFiO0FBQ0EsYUFBUSxPQUFPLElBQVAsR0FBYyxFQUF0QjtBQUNEOzs7MkJBRU07QUFDTCxVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixNQUF0QixJQUFnQyxDQUFwQyxFQUF1QyxPQUFPLEtBQVA7QUFDdkMsV0FBSyxVQUFMO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7OztpQ0FFWTtBQUFBOztBQUNYLGFBQU8sU0FBUCxDQUFpQixTQUFqQixDQUEyQixVQUEzQixFQUF1QyxVQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ3pELGVBQU8sSUFBSSxNQUFKLENBQVcsRUFBRSxPQUFGLEVBQVcsSUFBWCxDQUFnQixTQUFoQixDQUFYLEVBQXVDLElBQXZDLENBQTRDLEtBQTVDLENBQVA7QUFDRCxPQUZELEVBRUcsOEJBRkg7O0FBSUEsYUFBTyxTQUFQLENBQWlCLFNBQWpCLENBQTJCLFNBQTNCLEVBQXNDLFVBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDeEQsZUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFGLEVBQVcsSUFBWCxDQUFnQixjQUFoQixDQUFSLEVBQXlDLEdBQXpDLE9BQW1ELEVBQUUsT0FBRixFQUFXLEdBQVgsRUFBM0Q7QUFDRCxPQUZELEVBRUcsd0JBRkg7O0FBSUEsUUFBRSxNQUFGLEVBQVUsRUFBVixDQUFhLGtCQUFiLEVBQWlDLFVBQUMsR0FBRCxFQUFNLFNBQU4sRUFBb0I7QUFDbkQsY0FBSyxRQUFMLENBQWMsU0FBZDtBQUNELE9BRkQ7QUFHQSxRQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEscUJBQWIsRUFBb0MsWUFBTTtBQUN4QyxjQUFLLFdBQUw7QUFDRCxPQUZEOztBQUlBLFFBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixNQUEzQixFQUFtQyxRQUFuQyxDQUE0QztBQUMxQyxlQUFPO0FBQ0wsNEJBQWtCLE9BRGI7QUFFTCwyQkFBaUI7QUFGWixTQURtQztBQUsxQyx3QkFBZ0Isd0JBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDbEMsY0FBSSxRQUFRLElBQVIsQ0FBYSxNQUFiLE1BQXlCLFVBQTdCLEVBQXlDO0FBQ3ZDLGtCQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxHQUFvQixJQUFwQixDQUF5QixPQUF6QixDQUFsQjtBQUNELFdBRkQsTUFFTyxJQUFJLFFBQVEsSUFBUixDQUFhLE1BQWIsTUFBeUIsVUFBN0IsRUFBeUM7QUFDOUMsY0FBRSxPQUFGLEVBQVcsTUFBWCxDQUFrQixLQUFsQjtBQUNBLGtCQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxFQUFsQjtBQUNELFdBSE0sTUFHQSxJQUFJLFFBQVEsSUFBUixDQUFhLE1BQWIsTUFBeUIsUUFBN0IsRUFBdUM7QUFDNUMsa0JBQU0sV0FBTixDQUFrQixFQUFFLE9BQUYsRUFBVyxNQUFYLEVBQWxCO0FBQ0QsV0FGTSxNQUVBO0FBQ0wsa0JBQU0sV0FBTixDQUFrQixPQUFsQjtBQUNEO0FBQ0YsU0FoQnlDO0FBaUIxQyx1QkFBZSx1QkFBQyxJQUFELEVBQVU7QUFDdkIsZ0JBQUssZ0JBQUwsQ0FBc0IsSUFBdEI7QUFDQSxpQkFBTyxLQUFQO0FBQ0Q7QUFwQnlDLE9BQTVDO0FBc0JEOzs7K0JBRVUsSSxFQUFNO0FBQ2YsVUFBSSxTQUFTLE9BQU8sR0FBcEI7QUFDQSxVQUFJLEtBQUssU0FBUyxNQUFULENBQWdCLEtBQWhCLENBQXNCLEdBQXRCLENBQVQ7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksR0FBRyxNQUF2QixFQUErQixHQUEvQixFQUFvQztBQUNsQyxZQUFJLElBQUksR0FBRyxDQUFILENBQVI7QUFDQSxlQUFPLEVBQUUsTUFBRixDQUFTLENBQVQsTUFBZ0IsR0FBdkI7QUFBNEIsY0FBSSxFQUFFLFNBQUYsQ0FBWSxDQUFaLEVBQWUsRUFBRSxNQUFqQixDQUFKO0FBQTVCLFNBQ0EsSUFBSSxFQUFFLE9BQUYsQ0FBVSxNQUFWLE1BQXNCLENBQTFCLEVBQTZCLE9BQU8sRUFBRSxTQUFGLENBQVksT0FBTyxNQUFuQixFQUEyQixFQUFFLE1BQTdCLENBQVA7QUFDOUI7O0FBRUQsYUFBTyxJQUFQO0FBQ0Q7OztnQ0FFVyxJLEVBQU07QUFDaEIsV0FBSyxZQUFMLENBQWtCLElBQWxCLEVBQXdCLEVBQXhCLEVBQTRCLENBQUMsQ0FBN0I7QUFDRDs7O2lDQUVZLEksRUFBTSxLLEVBQU8sYSxFQUFlO0FBQ3ZDLFVBQUksVUFBVSxFQUFkO0FBQ0EsVUFBSSxhQUFKLEVBQW1CO0FBQ2pCLFlBQUksT0FBTyxJQUFJLElBQUosRUFBWDtBQUNBLGFBQUssT0FBTCxDQUFhLEtBQUssT0FBTCxLQUFrQixnQkFBZ0IsSUFBL0M7QUFDQSxrQkFBVSxlQUFlLEtBQUssV0FBTCxFQUF6QjtBQUNEO0FBQ0QsZUFBUyxNQUFULEdBQWtCLE9BQU8sR0FBUCxHQUFhLEtBQWIsR0FBcUIsT0FBckIsR0FBK0IsVUFBakQ7QUFDRDs7O3FDQUVnQixJLEVBQU07QUFBQTs7QUFDckIsVUFBSSxNQUFNLEVBQUUsSUFBRixDQUFWO0FBQ0EsVUFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsSUFBbEMsQ0FBdUMsZ0JBQXZDO0FBQ0EsVUFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsR0FBbEMsQ0FBc0MsZ0JBQXRDOztBQUVBLFVBQUksU0FBUyxLQUFLLFVBQUwsQ0FBZ0IsZUFBaEIsQ0FBYjtBQUNBLFVBQUksV0FBVyxJQUFmLEVBQXFCO0FBQ25CLFlBQUksUUFBUSxPQUFPLEtBQVAsQ0FBYSxHQUFiLENBQVo7QUFDQSxZQUFJLE1BQU0sTUFBTixJQUFnQixDQUFwQixFQUF1QjtBQUNyQixZQUFFLEdBQUYsQ0FBTSxLQUFLLGFBQUwsS0FBdUIsS0FBSyxNQUFMLENBQVksUUFBekMsRUFBbUQsVUFBQyxhQUFELEVBQW1CO0FBQ3BFLGdCQUFJLFlBQVksY0FBYyxLQUE5QjtBQUNBLGNBQUUsSUFBRixDQUFPO0FBQ0wsbUJBQUssT0FBSyxhQUFMLEtBQXVCLE9BQUssTUFBTCxDQUFZLGdCQURuQztBQUVMLG9CQUFNLEVBQUUsVUFBVSxNQUFNLENBQU4sQ0FBWixFQUFzQixPQUFPLE1BQU0sQ0FBTixDQUE3QixFQUZEO0FBR0wsb0JBQU0sTUFIRDtBQUlMLHVCQUFTLEVBQUUsY0FBYyxTQUFoQixFQUpKO0FBS0wsd0JBQVUsTUFMTDtBQU1MLHVCQUFTLGlCQUFDLGtCQUFELEVBQXdCO0FBQy9CLG9CQUFJLGtCQUFKLEVBQXdCO0FBQ3RCLHNCQUFJLG1CQUFtQixNQUFuQixLQUE4QixJQUFsQyxFQUF3QztBQUN0QyxzQkFBRSxNQUFGLEVBQVUsT0FBVixDQUFrQixxQkFBbEIsRUFBeUMsQ0FBRSxrQkFBRixFQUFzQixJQUF0QixDQUF6QztBQUNBLDJCQUFLLHFCQUFMLENBQTJCLElBQTNCLEVBQWlDLGtCQUFqQztBQUNELG1CQUhELE1BR087QUFDTCwwQkFBTSwrRkFBTjtBQUNEO0FBQ0YsaUJBUEQsTUFPTztBQUNMLHdCQUFNLCtGQUFOO0FBQ0Q7QUFDRjtBQWpCSSxhQUFQO0FBbUJELFdBckJEO0FBc0JELFNBdkJELE1BdUJPO0FBQ0wsZ0JBQU0sK0ZBQU47QUFDRDtBQUNGLE9BNUJELE1BNEJPO0FBQ0wsWUFBSSxnQkFBZ0IsS0FBSyxVQUFMLENBQWdCLGtCQUFoQixDQUFwQjtBQUNBLFlBQUksa0JBQWtCLElBQXRCLEVBQTRCO0FBQzFCLGNBQUksZUFBZSxjQUFjLEtBQWQsQ0FBb0IsR0FBcEIsQ0FBbkI7QUFDQSxjQUFJLGFBQWEsTUFBYixJQUF1QixDQUEzQixFQUE4QjtBQUM1QixjQUFFLEdBQUYsQ0FBTSxLQUFLLGFBQUwsS0FBdUIsS0FBSyxNQUFMLENBQVksUUFBekMsRUFBbUQsVUFBQyxhQUFELEVBQW1CO0FBQ3BFLGtCQUFJLFlBQVksY0FBYyxLQUE5QjtBQUNBLGdCQUFFLElBQUYsQ0FBTztBQUNMLHFCQUFLLE9BQUssYUFBTCxLQUF1QixPQUFLLE1BQUwsQ0FBWSxlQURuQztBQUVMLHNCQUFNLEVBQUUsVUFBVSxhQUFhLENBQWIsQ0FBWixFQUE2QixlQUFlLGFBQWEsQ0FBYixDQUE1QyxFQUZEO0FBR0wsc0JBQU0sTUFIRDtBQUlMLHlCQUFTLEVBQUUsY0FBYyxTQUFoQixFQUpKO0FBS0wsMEJBQVUsTUFMTDtBQU1MLHlCQUFTLGlCQUFDLGVBQUQsRUFBcUI7QUFDNUIsc0JBQUksZUFBSixFQUFxQjtBQUNuQix3QkFBSSxnQkFBZ0IsTUFBaEIsS0FBMkIsSUFBL0IsRUFBcUM7QUFDbkMsd0JBQUUsTUFBRixFQUFVLE9BQVYsQ0FBa0IscUJBQWxCLEVBQXlDLENBQUUsZUFBRixFQUFtQixJQUFuQixDQUF6QztBQUNBLDZCQUFLLGdCQUFMLENBQXNCLElBQXRCO0FBQ0QscUJBSEQsTUFHTztBQUNMLDRCQUFNLCtGQUFOO0FBQ0Q7QUFDRixtQkFQRCxNQU9PO0FBQ0wsMEJBQU0sK0ZBQU47QUFDRDtBQUNGO0FBakJJLGVBQVA7QUFtQkQsYUFyQkQ7QUFzQkQsV0F2QkQsTUF1Qk87QUFDTCxrQkFBTSwrRkFBTjtBQUNEO0FBQ0YsU0E1QkQsTUE0Qk87QUFDTCxnQkFBTSwyRkFBTjtBQUNEO0FBQ0Y7QUFDRjs7OzBDQUVxQixJLEVBQU0sTyxFQUFTO0FBQUE7O0FBQ25DLFVBQUksTUFBTSxFQUFFLElBQUYsQ0FBVjs7QUFFQSxVQUFJLE9BQU87QUFDVCxlQUFPLFFBQVEsS0FETjs7QUFHVCxrQkFBVSxJQUFJLElBQUosQ0FBUyx3QkFBVCxFQUFtQyxHQUFuQyxFQUhEO0FBSVQsa0JBQVUsSUFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsR0FBbEM7QUFKRCxPQUFYOztBQU9BLFVBQUssRUFBRSxJQUFGLENBQU8sS0FBSyxRQUFaLEVBQXNCLE1BQXRCLElBQWdDLENBQWpDLElBQXdDLEVBQUUsSUFBRixDQUFPLEtBQUssUUFBWixFQUFzQixNQUF0QixJQUFnQyxDQUE1RSxFQUFnRjtBQUM5RSxjQUFNLCtDQUFOO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsSUFBbEMsQ0FBdUMsZ0JBQXZDO0FBQ0EsWUFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsR0FBbEMsQ0FBc0MsZ0JBQXRDOztBQUVBLFVBQUUsR0FBRixDQUFNLEtBQUssYUFBTCxLQUF1QixLQUFLLE1BQUwsQ0FBWSxRQUF6QyxFQUFtRCxVQUFDLGFBQUQsRUFBbUI7QUFDcEUsY0FBSSxZQUFZLGNBQWMsS0FBOUI7QUFDQSxZQUFFLElBQUYsQ0FBTztBQUNMLGlCQUFLLE9BQUssYUFBTCxLQUF1QixPQUFLLE1BQUwsQ0FBWSxnQkFEbkM7QUFFTCxrQkFBTSxJQUZEO0FBR0wsa0JBQU0sTUFIRDtBQUlMLHFCQUFTLEVBQUUsY0FBYyxTQUFoQixFQUpKO0FBS0wsc0JBQVUsTUFMTDtBQU1MLHFCQUFTLGlCQUFDLHFCQUFELEVBQTJCO0FBQ2xDLGtCQUFJLHFCQUFKLEVBQTJCO0FBQ3pCLGtCQUFFLE1BQUYsRUFBVSxPQUFWLENBQWtCLHFCQUFsQixFQUF5QyxDQUFFLHFCQUFGLEVBQXlCLElBQXpCLENBQXpDOztBQUVBLG9CQUFJLHNCQUFzQixNQUF0QixLQUFpQyxJQUFyQyxFQUEyQztBQUN6Qyx5QkFBSyxXQUFMLENBQWlCLGVBQWpCO0FBQ0EseUJBQUssV0FBTCxDQUFpQixrQkFBakI7O0FBRUEseUJBQU8sUUFBUCxHQUFrQixJQUFJLElBQUosQ0FBUyxZQUFULENBQWxCO0FBQ0QsaUJBTEQsTUFLTztBQUNMLHdCQUFNLGlFQUFpRSxzQkFBc0IsS0FBN0Y7QUFDRDtBQUNGLGVBWEQsTUFXTztBQUNMLHNCQUFNLDJGQUFOO0FBQ0Q7QUFDRCxrQkFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsSUFBbEMsQ0FBdUMsZ0JBQXZDO0FBQ0Esa0JBQUksSUFBSixDQUFTLHVCQUFULEVBQWtDLEdBQWxDLENBQXNDLGdCQUF0QztBQUNEO0FBdkJJLFdBQVA7QUF5QkQsU0EzQkQ7QUE0QkQ7O0FBRUQsVUFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsSUFBbEMsQ0FBdUMsZ0JBQXZDO0FBQ0EsVUFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsR0FBbEMsQ0FBc0MsZ0JBQXRDO0FBQ0Q7Ozs2QkFFUSxTLEVBQVc7QUFDbEIsVUFBSSxhQUFhLFVBQVUsTUFBdkIsSUFBaUMsVUFBVSxNQUFWLEtBQXFCLElBQTFELEVBQWdFO0FBQzlELFVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QjtBQUNEO0FBQ0Y7OztrQ0FFYTtBQUNaLFVBQUksRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLFFBQXRCLENBQStCLGFBQS9CLENBQUosRUFBbUQ7QUFDakQsVUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBTyxRQUFQLEdBQWtCLEtBQUssV0FBTCxLQUFxQixPQUF2QztBQUNEO0FBQ0Y7Ozs7OztrQkFHWSxJQUFJLGlCQUFKLEU7Ozs7Ozs7Ozs7Ozs7SUNyUFQsUztBQUNKLHVCQUFjO0FBQUE7O0FBQ1osU0FBSyxHQUFMLEdBQVc7QUFDVCxpQkFBVyxZQURGO0FBRVQsaUJBQVcsbUJBRkY7QUFHVCxlQUFTLGlCQUhBO0FBSVQsZUFBUyxpQkFKQTtBQUtULGtCQUFZO0FBTEgsS0FBWDs7QUFRQSxTQUFLLGdCQUFMLEdBQXdCLElBQXhCOztBQUVBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBakI7QUFDQSxTQUFLLGVBQUwsR0FBdUIsS0FBSyxlQUFMLENBQXFCLElBQXJCLENBQTBCLElBQTFCLENBQXZCO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLEtBQUssZUFBTCxDQUFxQixJQUFyQixDQUEwQixJQUExQixDQUF2QjtBQUNBLFNBQUssVUFBTCxHQUFrQixLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBbEI7QUFDRDs7OzsyQkFFTTtBQUNMLFVBQUksRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLE1BQXRCLElBQWdDLENBQXBDLEVBQXVDLE9BQU8sS0FBUDtBQUN2QyxXQUFLLFVBQUw7QUFDQSxXQUFLLFNBQUw7QUFDQSxhQUFPLElBQVA7QUFDRDs7O2lDQUVZO0FBQUE7O0FBQ1gsUUFBRSxRQUFGLEVBQVksRUFBWixDQUFlLE9BQWYsRUFBd0IsS0FBSyxHQUFMLENBQVMsU0FBakMsRUFBNEMsWUFBTTtBQUNoRCxjQUFLLGVBQUw7QUFDQSxjQUFLLGVBQUw7QUFDRCxPQUhEOztBQUtBLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLEtBQUssR0FBTCxDQUFTLFVBQWpDLEVBQTZDLFVBQUMsQ0FBRCxFQUFPO0FBQ2xELFVBQUUsY0FBRjtBQUNBLFlBQUksT0FBTyxFQUFFLEVBQUUsTUFBSixFQUFZLE9BQVosQ0FBb0IsTUFBcEIsQ0FBWDtBQUNBLGNBQUssVUFBTCxDQUFnQixJQUFoQjtBQUNELE9BSkQ7QUFLRDs7O2dDQUVXO0FBQUE7O0FBQ1YsaUJBQVcsWUFBTTtBQUNmLGVBQUssZUFBTDtBQUNELE9BRkQsRUFFRyxLQUFLLGdCQUZSO0FBR0Q7OztzQ0FFaUI7QUFDaEIsUUFBRSxLQUFLLEdBQUwsQ0FBUyxPQUFYLEVBQW9CLFdBQXBCLENBQWdDLFdBQWhDO0FBQ0Q7OztzQ0FFaUI7QUFDaEIsUUFBRSxLQUFLLEdBQUwsQ0FBUyxPQUFYLEVBQW9CLFdBQXBCLENBQWdDLFVBQWhDO0FBQ0Q7OzsrQkFFVSxJLEVBQU07QUFDZixhQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsR0FBdUIsS0FBSyxJQUFMLENBQVUsUUFBVixJQUFzQixHQUF0QixHQUE0QixLQUFLLFNBQUwsRUFBbkQ7QUFDRDs7Ozs7O2tCQUdZLElBQUksU0FBSixFOzs7Ozs7Ozs7OztBQzNEZjs7Ozs7Ozs7SUFFTSxjO0FBQ0osNEJBQWM7QUFBQTs7QUFDWixTQUFLLEdBQUwsR0FBVztBQUNULGlCQUFXO0FBREYsS0FBWDs7QUFJQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBaEI7QUFDQSxTQUFLLGdCQUFMLEdBQXdCLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBeEI7QUFDRDs7OzsyQkFFTTtBQUNMLFVBQUksRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLE1BQXRCLElBQWdDLENBQXBDLEVBQXVDLE9BQU8sS0FBUDs7QUFFdkMsV0FBSyxnQkFBTDtBQUNBLFdBQUssUUFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7dUNBRWtCO0FBQ2pCLFFBQUUsU0FBRixDQUFZLFNBQVosQ0FBc0IsZUFBdEIsRUFBdUMsVUFBQyxLQUFELEVBQVc7QUFDaEQsZUFBTywyQkFBaUIsZUFBakIsQ0FBaUMsS0FBakMsQ0FBUDtBQUNELE9BRkQsRUFFRywrQkFGSDtBQUdEOzs7K0JBRVU7QUFDVCxRQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsUUFBdEIsQ0FBK0I7QUFDN0IsZUFBTztBQUNMLHNCQUFZO0FBQ1Ysc0JBQVU7QUFEQSxXQURQO0FBSUwsc0JBQVk7QUFDViwyQkFBZTtBQURMO0FBSlAsU0FEc0I7QUFTN0Isd0JBQWdCLHdCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ2xDLGNBQUksUUFBUSxJQUFSLENBQWEsTUFBYixNQUF5QixVQUE3QixFQUF5QztBQUN2QyxrQkFBTSxXQUFOLENBQWtCLEVBQUUsT0FBRixFQUFXLE1BQVgsR0FBb0IsSUFBcEIsQ0FBeUIsT0FBekIsQ0FBbEI7QUFDRCxXQUZELE1BRU8sSUFBSSxRQUFRLElBQVIsQ0FBYSxNQUFiLE1BQXlCLFVBQTdCLEVBQXlDO0FBQzlDLGNBQUUsT0FBRixFQUFXLE1BQVgsQ0FBa0IsS0FBbEI7QUFDQSxrQkFBTSxXQUFOLENBQWtCLEVBQUUsT0FBRixFQUFXLE1BQVgsRUFBbEI7QUFDRCxXQUhNLE1BR0EsSUFBSSxRQUFRLElBQVIsQ0FBYSxNQUFiLE1BQXlCLFFBQTdCLEVBQXVDO0FBQzVDLGtCQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxFQUFsQjtBQUNELFdBRk0sTUFFQTtBQUNMLGtCQUFNLFdBQU4sQ0FBa0IsT0FBbEI7QUFDRDtBQUNGO0FBcEI0QixPQUEvQjtBQXNCRDs7Ozs7O2tCQUdZLElBQUksY0FBSixFOzs7Ozs7Ozs7Ozs7O0lDckRULE07QUFDSixvQkFBYztBQUFBOztBQUNaLFNBQUssVUFBTCxHQUFrQixFQUFsQjtBQUNBLFNBQUssY0FBTCxHQUFzQixFQUF0QjtBQUNBLFNBQUssYUFBTCxHQUFxQixDQUFDLENBQXRCO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLENBQXRCO0FBQ0EsU0FBSyxPQUFMLEdBQWUsRUFBZjs7QUFFQSxTQUFLLEdBQUwsR0FBVztBQUNULGlCQUFXLFNBREY7QUFFVCxjQUFRLHFCQUZDO0FBR1QsWUFBTSxrQkFIRztBQUlULGVBQVMsa0JBSkE7QUFLVCxjQUFRLHdCQUxDO0FBTVQsa0JBQVkscUJBTkg7QUFPVCxzQkFBZ0IsMEJBUFA7QUFRVCx1QkFBaUIsaUNBUlI7QUFTVCw0QkFBc0Isd0NBVGI7QUFVVCx5QkFBbUIsa0NBVlY7O0FBWVQsZUFBUyx5QkFaQTtBQWFULG1CQUFhLDZCQWJKO0FBY1Qsd0JBQWtCO0FBZFQsS0FBWDs7QUFpQkEsU0FBSyxVQUFMLEdBQWtCLHNCQUFsQjs7QUFFQSxTQUFLLGFBQUwsR0FBcUIsQ0FBckI7O0FBRUEsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBWjtBQUNBLFNBQUssVUFBTCxHQUFrQixLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBbEI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFwQjtBQUNBLFNBQUssVUFBTCxHQUFrQixLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBbEI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CO0FBQ0EsU0FBSyxzQkFBTCxHQUE4QixLQUFLLHNCQUFMLENBQTRCLElBQTVCLENBQWlDLElBQWpDLENBQTlCO0FBQ0EsU0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjs7QUFFQSxTQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CO0FBQ0Q7Ozs7MkJBRU07QUFDTCxVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixNQUF0QixJQUFnQyxDQUFwQyxFQUF1QyxPQUFPLEtBQVA7QUFDdkMsV0FBSyxVQUFMO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7OztpQ0FFWTtBQUFBOztBQUNYLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxTQUFmLEVBQTBCLEtBQUssR0FBTCxDQUFTLGVBQW5DLEVBQW9ELFVBQUMsQ0FBRCxFQUFPO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFLLEVBQUUsT0FBRixLQUFjLENBQWQsSUFBb0IsQ0FBQyxFQUFFLFFBQXhCLElBQXVDLEVBQUUsT0FBRixLQUFjLEVBQXJELElBQTZELEVBQUUsT0FBRixLQUFjLEVBQS9FLEVBQW9GO0FBQ2xGLGdCQUFLLGFBQUw7QUFDQSxjQUFJLE1BQUssYUFBTCxJQUFzQixNQUFLLGNBQS9CLEVBQStDO0FBQzdDLGtCQUFLLGFBQUwsR0FBcUIsQ0FBckI7QUFDRDtBQUNELGdCQUFLLGVBQUwsQ0FBcUIsSUFBckI7O0FBRUEsWUFBRSxjQUFGO0FBQ0EsaUJBQU8sS0FBUDtBQUNELFNBVEQsTUFTTyxJQUFLLEVBQUUsT0FBRixLQUFjLENBQWQsSUFBb0IsRUFBRSxRQUF2QixJQUFzQyxFQUFFLE9BQUYsS0FBYyxFQUFwRCxJQUE0RCxFQUFFLE9BQUYsS0FBYyxFQUE5RSxFQUFtRjtBQUN4RixnQkFBSyxhQUFMO0FBQ0EsY0FBSSxNQUFLLGFBQUwsR0FBcUIsQ0FBekIsRUFBNEI7QUFDMUIsa0JBQUssYUFBTCxHQUFxQixNQUFLLGNBQUwsR0FBc0IsQ0FBM0M7QUFDRDtBQUNELGdCQUFLLGVBQUwsQ0FBcUIsSUFBckI7O0FBRUEsWUFBRSxjQUFGO0FBQ0EsaUJBQU8sS0FBUDtBQUNEOztBQUVELGVBQU8sSUFBUDtBQUNELE9BM0JEO0FBNEJBLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxVQUFmLEVBQTJCLEtBQUssR0FBTCxDQUFTLGVBQXBDLEVBQXFELFVBQUMsQ0FBRCxFQUFPO0FBQzFELFlBQUksRUFBRSxPQUFGLEtBQWMsRUFBbEIsRUFBc0I7QUFDcEIsY0FBSSxRQUFRLEVBQUUsRUFBRSxhQUFKLENBQVo7QUFDQSxjQUFJLFlBQVksRUFBRSxNQUFLLEdBQUwsQ0FBUyxlQUFYLEVBQTRCLElBQTVCLENBQWlDLE1BQWpDLENBQWhCO0FBQ0EsY0FBSSxPQUFPLE1BQU0sR0FBTixHQUFZLElBQVosRUFBWDtBQUNBLGNBQUksTUFBTSxFQUFFLE1BQUssR0FBTCxDQUFTLGNBQVgsRUFBMkIsSUFBM0IsQ0FBZ0MsUUFBaEMsSUFBNEMsR0FBNUMsR0FBa0QsU0FBbEQsR0FBOEQsR0FBOUQsR0FBb0UsbUJBQW1CLElBQW5CLENBQTlFO0FBQ0EsaUJBQU8sUUFBUCxHQUFrQixHQUFsQjtBQUNEO0FBQ0YsT0FSRDtBQVNBLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLEtBQUssR0FBTCxDQUFTLGVBQWpDLEVBQWtELFVBQUMsQ0FBRCxFQUFPO0FBQ3ZELFlBQUssRUFBRSxPQUFGLEtBQWMsRUFBZixJQUF1QixFQUFFLE9BQUYsS0FBYyxDQUFyQyxJQUE0QyxFQUFFLE9BQUYsS0FBYyxFQUExRCxJQUFrRSxFQUFFLE9BQUYsS0FBYyxFQUFoRixJQUF3RixFQUFFLE9BQUYsS0FBYyxFQUF0RyxJQUE4RyxFQUFFLE9BQUYsS0FBYyxFQUFoSSxFQUFxSTtBQUNuSSxpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQsWUFBSSxRQUFRLEVBQUUsRUFBRSxhQUFKLENBQVo7QUFDQSxZQUFJLE1BQU0sR0FBTixHQUFZLE1BQVosR0FBcUIsQ0FBekIsRUFBNEI7QUFDMUIsWUFBRSxlQUFGLEVBQW1CLE1BQUssR0FBTCxDQUFTLFNBQTVCLEVBQXVDLElBQXZDO0FBQ0EsWUFBRSxNQUFLLEdBQUwsQ0FBUyxvQkFBWCxFQUFpQyxJQUFqQztBQUNBLGdCQUFLLGdCQUFMLENBQXNCLEtBQXRCO0FBQ0QsU0FKRCxNQUlPO0FBQ0wsZ0JBQUssZ0JBQUw7QUFDQSxZQUFFLE1BQUssR0FBTCxDQUFTLG9CQUFYLEVBQWlDLElBQWpDO0FBQ0EsWUFBRSxlQUFGLEVBQW1CLE1BQUssR0FBTCxDQUFTLFNBQTVCLEVBQXVDLElBQXZDO0FBQ0Q7O0FBRUQsZUFBTyxJQUFQO0FBQ0QsT0FqQkQ7O0FBbUJBLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLEtBQUssR0FBTCxDQUFTLG9CQUFqQyxFQUF1RCxVQUFDLENBQUQsRUFBTztBQUM1RCxVQUFFLE1BQUssR0FBTCxDQUFTLGVBQVgsRUFBNEIsR0FBNUIsQ0FBZ0MsRUFBaEM7QUFDQSxVQUFFLE1BQUssR0FBTCxDQUFTLG9CQUFYLEVBQWlDLElBQWpDO0FBQ0EsY0FBSyxnQkFBTDtBQUNBLFVBQUUsY0FBRjtBQUNBLGVBQU8sS0FBUDtBQUNELE9BTkQ7O0FBUUEsUUFBRSxRQUFGLEVBQVksRUFBWixDQUFlLE9BQWYsRUFBd0IsS0FBSyxHQUFMLENBQVMsTUFBakMsRUFBeUMsVUFBQyxDQUFELEVBQU87QUFDOUMsVUFBRSxjQUFGO0FBQ0EsY0FBSyxVQUFMO0FBQ0QsT0FIRDtBQUlBLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLEtBQUssR0FBTCxDQUFTLE9BQWpDLEVBQTBDLEtBQUssVUFBL0M7QUFDQSxRQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsT0FBZixFQUF3QixLQUFLLEdBQUwsQ0FBUyxNQUFqQyxFQUF5QyxLQUFLLFlBQTlDO0FBQ0EsUUFBRSxRQUFGLEVBQVksRUFBWixDQUFlLE9BQWYsRUFBd0IsS0FBSyxHQUFMLENBQVMsT0FBakMsRUFBMEMsS0FBSyxhQUEvQztBQUNBLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLEtBQUssR0FBTCxDQUFTLGdCQUFqQyxFQUFtRCxLQUFLLHNCQUF4RDs7QUFFQSxRQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsT0FBZixFQUF3QiwrRkFBeEIsRUFBeUgsVUFBQyxHQUFELEVBQVM7QUFDaEksWUFBSSxPQUFPLEVBQUUsSUFBSSxhQUFOLEVBQXFCLElBQXJCLENBQTBCLE1BQTFCLENBQVg7QUFDQSxZQUFJLE9BQU8sRUFBRSxJQUFJLGFBQU4sRUFBcUIsSUFBckIsQ0FBMEIsV0FBMUIsQ0FBWDtBQUNBLFlBQUksU0FBUyxJQUFULElBQWlCLEtBQUssTUFBTCxHQUFjLENBQW5DLEVBQXNDO0FBQ3BDLGlCQUFPLElBQVA7QUFDRDs7QUFFRCxnQkFBUSxHQUFSLENBQVksTUFBSyxVQUFqQixFQUE2QixJQUE3QjtBQUNELE9BUkQ7O0FBVUEsUUFBRSxNQUFGLEVBQVUsRUFBVixDQUFhLFFBQWIsRUFBdUIsS0FBSyxXQUE1QjtBQUNBLFdBQUssV0FBTDs7QUFFQSxVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsZUFBWCxFQUE0QixNQUE1QixHQUFxQyxDQUF6QyxFQUE0QztBQUMxQyxZQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsZUFBWCxFQUE0QixHQUE1QixHQUFrQyxNQUFsQyxHQUEyQyxDQUEvQyxFQUFrRDtBQUNoRCxZQUFFLEtBQUssR0FBTCxDQUFTLG9CQUFYLEVBQWlDLElBQWpDO0FBQ0Q7QUFDRjtBQUNGOzs7a0NBRWE7QUFDWixVQUFJLEtBQUssRUFBRSxNQUFGLEVBQVUsU0FBVixFQUFUO0FBQ0EsVUFBSSxLQUFLLEVBQUUsWUFBRixFQUFnQixNQUFoQixHQUF5QixHQUFsQztBQUNBLFVBQUksS0FBSyxFQUFULEVBQWE7QUFDWCxVQUFFLFlBQUYsRUFBZ0IsUUFBaEIsQ0FBeUIsT0FBekI7QUFDQSxVQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsUUFBdEIsQ0FBK0IsT0FBL0I7QUFDQSxZQUFJLEtBQUssS0FBSyxhQUFkLEVBQTZCO0FBQzNCLFlBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixXQUF0QixDQUFrQyxJQUFsQztBQUNBLFlBQUUsS0FBSyxHQUFMLENBQVMsaUJBQVgsRUFBOEIsUUFBOUIsQ0FBdUMsTUFBdkM7QUFDRCxTQUhELE1BR087QUFDTCxZQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsUUFBdEIsQ0FBK0IsSUFBL0I7QUFDQSxZQUFFLEtBQUssR0FBTCxDQUFTLGlCQUFYLEVBQThCLFdBQTlCLENBQTBDLE1BQTFDO0FBQ0Q7QUFDRixPQVZELE1BVU87QUFDTCxVQUFFLFlBQUYsRUFBZ0IsV0FBaEIsQ0FBNEIsT0FBNUI7QUFDQSxVQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsV0FBdEIsQ0FBa0MsT0FBbEM7QUFDRDs7QUFFRCxXQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDRDs7O2lDQUVZO0FBQUE7O0FBQ1gsVUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFMLENBQVMsSUFBWCxFQUFpQixFQUFqQixDQUFvQixVQUFwQixDQUFMLEVBQXNDO0FBQ3BDLGFBQUssYUFBTCxDQUFtQixLQUFuQjtBQUNBLFVBQUUsS0FBSyxHQUFMLENBQVMsTUFBWCxFQUFtQixRQUFuQixDQUE0QiwwQkFBNUI7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLLGFBQUwsQ0FBbUIsSUFBbkI7QUFDQSxVQUFFLEtBQUssR0FBTCxDQUFTLE1BQVgsRUFBbUIsV0FBbkIsQ0FBK0IsMEJBQS9CO0FBQ0Q7QUFDRCxRQUFFLEtBQUssR0FBTCxDQUFTLElBQVgsRUFBaUIsV0FBakIsQ0FBNkIsR0FBN0I7O0FBRUEsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFVBQVgsRUFBdUIsUUFBdkIsQ0FBZ0MsMEJBQWhDLENBQUosRUFBaUU7QUFDL0QsVUFBRSxLQUFLLEdBQUwsQ0FBUyxVQUFYLEVBQXVCLFdBQXZCLENBQW1DLDBCQUFuQztBQUNBLFVBQUUsS0FBSyxHQUFMLENBQVMsTUFBWCxFQUFtQixPQUFuQixDQUEyQiwwQkFBM0IsRUFBdUQsV0FBdkQsQ0FBbUUsK0JBQW5FOztBQUVBLG1CQUFXLFlBQU07QUFDZixZQUFFLE9BQUssR0FBTCxDQUFTLE1BQVgsRUFBbUIsV0FBbkIsQ0FBK0IsOEJBQS9CO0FBQ0QsU0FGRCxFQUVHLEdBRkg7QUFHRDtBQUNELFVBQUksRUFBRSxLQUFLLEdBQUwsQ0FBUyxXQUFYLEVBQXdCLFFBQXhCLENBQWlDLGtDQUFqQyxDQUFKLEVBQTBFO0FBQ3hFLFVBQUUsS0FBSyxHQUFMLENBQVMsV0FBWCxFQUF3QixXQUF4QixDQUFvQyxrQ0FBcEM7QUFDQSxVQUFFLEtBQUssR0FBTCxDQUFTLE9BQVgsRUFBb0IsT0FBcEIsQ0FBNEIsMEJBQTVCLEVBQXdELFdBQXhELENBQW9FLCtCQUFwRTs7QUFFQSxtQkFBVyxZQUFNO0FBQ2YsWUFBRSxPQUFLLEdBQUwsQ0FBUyxNQUFYLEVBQW1CLFdBQW5CLENBQStCLCtCQUEvQjtBQUNELFNBRkQsRUFFRyxHQUZIO0FBR0Q7QUFDRjs7O2tDQUVhLE8sRUFBUztBQUNyQixVQUFJLE9BQUosRUFBYTtBQUNYLFVBQUUsTUFBRixFQUFVLFdBQVYsQ0FBc0IsWUFBdEI7QUFDQSxpQkFBUyxlQUFULENBQXlCLEtBQXpCLENBQStCLE1BQS9CLEdBQXdDLE1BQXhDO0FBQ0EsaUJBQVMsZUFBVCxDQUF5QixLQUF6QixDQUErQixRQUEvQixHQUEwQyxNQUExQztBQUNBLGlCQUFTLElBQVQsQ0FBYyxLQUFkLENBQW9CLE1BQXBCLEdBQTZCLE1BQTdCO0FBQ0QsT0FMRCxNQUtPO0FBQ0wsVUFBRSxNQUFGLEVBQVUsUUFBVixDQUFtQixZQUFuQjtBQUNBLFlBQUksZUFBZSxPQUFPLE1BQVAsQ0FBYyxXQUFqQztBQUNBLGlCQUFTLGVBQVQsQ0FBeUIsS0FBekIsQ0FBK0IsUUFBL0IsR0FBMEMsUUFBMUM7QUFDQSxpQkFBUyxlQUFULENBQXlCLEtBQXpCLENBQStCLE1BQS9CLEdBQXdDLGFBQWEsUUFBYixLQUEwQixJQUFsRTtBQUNBLGlCQUFTLElBQVQsQ0FBYyxLQUFkLENBQW9CLE1BQXBCLEdBQTZCLGFBQWEsUUFBYixLQUEwQixJQUF2RDtBQUNEO0FBQ0Y7OztpQ0FFWSxDLEVBQUc7QUFBQTs7QUFDZCxRQUFFLGNBQUY7QUFDQSxVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsTUFBWCxFQUFtQixRQUFuQixDQUE0Qiw4QkFBNUIsQ0FBSixFQUFpRTtBQUMvRCxhQUFLLFVBQUw7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLLFVBQUw7O0FBRUEsVUFBRSxlQUFGLEVBQW1CLEtBQUssR0FBTCxDQUFTLFNBQTVCLEVBQXVDLElBQXZDO0FBQ0EsVUFBRSxzQkFBRixFQUEwQixLQUFLLEdBQUwsQ0FBUyxTQUFuQyxFQUE4QyxLQUE5Qzs7QUFFQSxZQUFJLE1BQU0sRUFBVjtBQUNBLFlBQUksRUFBRSxLQUFLLEdBQUwsQ0FBUyxjQUFYLEVBQTJCLElBQTNCLENBQWdDLGtCQUFoQyxFQUFvRCxNQUFwRCxHQUE2RCxDQUFqRSxFQUFvRTtBQUNsRSxnQkFBTSxFQUFFLEtBQUssR0FBTCxDQUFTLGNBQVgsRUFBMkIsSUFBM0IsQ0FBZ0Msa0JBQWhDLENBQU47QUFDRDtBQUNELFlBQUksSUFBSSxNQUFKLEdBQWEsQ0FBakIsRUFBb0I7QUFDbEIsWUFBRSxHQUFGLENBQU0sR0FBTixFQUFXLFVBQUMsTUFBRCxFQUFZO0FBQ3JCLGdCQUFJLFlBQVksRUFBRSxzQkFBRixFQUEwQixPQUFLLEdBQUwsQ0FBUyxTQUFuQyxDQUFoQjtBQUNBLGdCQUFJLFlBQVksRUFBRSxPQUFLLEdBQUwsQ0FBUyxlQUFYLEVBQTRCLElBQTVCLENBQWlDLE1BQWpDLENBQWhCO0FBQ0EsZ0JBQUksV0FBVyxLQUFmO0FBQ0EsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLE9BQVAsQ0FBZSxNQUFuQyxFQUEyQyxHQUEzQyxFQUFnRDtBQUM5Qyx5QkFBVyxJQUFYO0FBQ0Esa0JBQUksT0FBTyxPQUFPLE9BQVAsQ0FBZSxDQUFmLEVBQWtCLElBQWxCLEVBQVg7QUFDQSxrQkFBSSxZQUFZLEVBQUUsT0FBSyxHQUFMLENBQVMsY0FBWCxFQUEyQixJQUEzQixDQUFnQyxRQUFoQyxJQUE0QyxHQUE1QyxHQUFrRCxTQUFsRCxHQUE4RCxHQUE5RCxHQUFvRSxtQkFBbUIsSUFBbkIsQ0FBcEY7QUFDQSx3QkFBVSxNQUFWLGdCQUE2QixTQUE3QixtQkFBa0QsSUFBbEQsaUJBQWlFLElBQWpFO0FBQ0Q7O0FBRUQsZ0JBQUksUUFBSixFQUFjO0FBQ1osZ0JBQUUsZUFBRixFQUFtQixPQUFLLEdBQUwsQ0FBUyxTQUE1QixFQUF1QyxJQUF2QztBQUNEO0FBQ0YsV0FkRDtBQWVEO0FBQ0Y7QUFDRjs7O2lDQUVZO0FBQ1gsUUFBRSxLQUFLLEdBQUwsQ0FBUyxXQUFYLEVBQXdCLFdBQXhCLENBQW9DLGtDQUFwQztBQUNBLFFBQUUsS0FBSyxHQUFMLENBQVMsT0FBWCxFQUFvQixPQUFwQixDQUE0QiwwQkFBNUIsRUFBd0QsV0FBeEQsQ0FBb0UsK0JBQXBFOztBQUVBLFFBQUUsS0FBSyxHQUFMLENBQVMsTUFBWCxFQUFtQixRQUFuQixDQUE0Qiw4QkFBNUI7QUFDQSxRQUFFLEtBQUssR0FBTCxDQUFTLE1BQVgsRUFBbUIsT0FBbkIsQ0FBMkIsMEJBQTNCLEVBQXVELFFBQXZELENBQWdFLCtCQUFoRTtBQUNBLFFBQUUsS0FBSyxHQUFMLENBQVMsVUFBWCxFQUF1QixRQUF2QixDQUFnQywwQkFBaEM7QUFDQSxRQUFFLEtBQUssR0FBTCxDQUFTLGVBQVgsRUFBNEIsS0FBNUI7O0FBRUEsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLE1BQVgsRUFBbUIsUUFBbkIsQ0FBNEIsMEJBQTVCLENBQUosRUFBNkQ7QUFDM0QsYUFBSyxhQUFMLENBQW1CLElBQW5CO0FBQ0EsVUFBRSxLQUFLLEdBQUwsQ0FBUyxNQUFYLEVBQW1CLFdBQW5CLENBQStCLDBCQUEvQjtBQUNBLFVBQUUsS0FBSyxHQUFMLENBQVMsSUFBWCxFQUFpQixXQUFqQixDQUE2QixHQUE3QjtBQUNEO0FBQ0Y7OztpQ0FFWTtBQUFBOztBQUNYLFFBQUUsS0FBSyxHQUFMLENBQVMsVUFBWCxFQUF1QixXQUF2QixDQUFtQywwQkFBbkM7QUFDQSxRQUFFLEtBQUssR0FBTCxDQUFTLE1BQVgsRUFBbUIsT0FBbkIsQ0FBMkIsMEJBQTNCLEVBQXVELFdBQXZELENBQW1FLCtCQUFuRTs7QUFFQSxpQkFBVyxZQUFNO0FBQ2YsVUFBRSxPQUFLLEdBQUwsQ0FBUyxNQUFYLEVBQW1CLFdBQW5CLENBQStCLDhCQUEvQjtBQUNELE9BRkQsRUFFRyxHQUZIO0FBR0EsYUFBTyxJQUFQO0FBQ0Q7OztxQ0FFZ0IsSyxFQUFPO0FBQUE7O0FBQ3RCLFVBQUksTUFBTSxFQUFFLElBQUYsQ0FBTyxNQUFNLEdBQU4sRUFBUCxDQUFWO0FBQ0EsVUFBSSxJQUFJLElBQUksTUFBSixDQUFXLENBQVgsRUFBYyxDQUFkLENBQVI7QUFDQSxVQUFJLE1BQU0sS0FBSyxVQUFmLEVBQTJCO0FBQ3pCLGFBQUssZUFBTDtBQUNELE9BRkQsTUFFTztBQUNMLGFBQUssZ0JBQUw7QUFDQSxhQUFLLFVBQUwsR0FBa0IsQ0FBbEI7QUFDQSxhQUFLLGFBQUwsR0FBcUIsQ0FBQyxDQUF0Qjs7QUFFQSxZQUFJLE1BQU0sRUFBVjtBQUNBLFlBQUksRUFBRSxLQUFLLEdBQUwsQ0FBUyxjQUFYLEVBQTJCLElBQTNCLENBQWdDLGtCQUFoQyxFQUFvRCxNQUFwRCxHQUE2RCxDQUFqRSxFQUFvRTtBQUNsRSxnQkFBTSxFQUFFLEtBQUssR0FBTCxDQUFTLGNBQVgsRUFBMkIsSUFBM0IsQ0FBZ0Msa0JBQWhDLENBQU47QUFDRDs7QUFFRCxVQUFFLEdBQUYsQ0FBTSxHQUFOLEVBQVcsRUFBRSxHQUFHLENBQUwsRUFBWCxFQUFxQixVQUFDLE1BQUQsRUFBWTtBQUMvQixjQUFJLE9BQU8sT0FBUCxDQUFlLE1BQWYsS0FBMEIsQ0FBOUIsRUFBaUM7QUFDL0IsbUJBQUssZ0JBQUw7QUFDRCxXQUZELE1BRU87QUFDTCxtQkFBSyxjQUFMLEdBQXNCLEVBQXRCO0FBQ0EsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLE9BQVAsQ0FBZSxNQUFuQyxFQUEyQyxHQUEzQyxFQUFnRDtBQUM5QyxxQkFBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLE9BQU8sT0FBUCxDQUFlLENBQWYsQ0FBekI7QUFDRDtBQUNELG1CQUFLLGVBQUw7QUFDRDtBQUNGLFNBVkQ7QUFXRDtBQUNGOzs7dUNBRWtCO0FBQ2pCLFFBQUUsS0FBSyxHQUFMLENBQVMsaUJBQVgsRUFBOEIsS0FBOUIsR0FBc0MsSUFBdEM7QUFDRDs7O29DQUVlLFUsRUFBWTtBQUMxQixXQUFLLGdCQUFMO0FBQ0EsVUFBSSxNQUFNLEVBQUUsSUFBRixDQUFPLEVBQUUsS0FBSyxHQUFMLENBQVMsZUFBWCxFQUE0QixHQUE1QixFQUFQLENBQVY7QUFDQSxVQUFJLFVBQUosRUFBZ0I7QUFDZCxjQUFNLEtBQUssT0FBWDtBQUNELE9BRkQsTUFFTztBQUNMLGFBQUssT0FBTCxHQUFlLEdBQWY7QUFDRDs7QUFFRCxVQUFJLFdBQVcsS0FBZjtBQUNBLFVBQUksSUFBSSxDQUFSO0FBQ0EsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssY0FBTCxDQUFvQixNQUF4QyxFQUFnRCxHQUFoRCxFQUFxRDtBQUNuRCxZQUFJLFdBQVcsS0FBZjtBQUNBLFlBQUksUUFBUSxJQUFJLFdBQUosR0FBa0IsS0FBbEIsQ0FBd0IsSUFBeEIsQ0FBWjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQyxxQkFBVyxLQUFLLGNBQUwsQ0FBb0IsQ0FBcEIsRUFBdUIsV0FBdkIsR0FBcUMsUUFBckMsQ0FBOEMsTUFBTSxDQUFOLEVBQVMsSUFBVCxFQUE5QyxDQUFYO0FBQ0EsY0FBSSxRQUFKLEVBQWM7QUFDZjtBQUNELFlBQUssSUFBSSxNQUFKLEtBQWUsQ0FBaEIsSUFBc0IsUUFBMUIsRUFBb0M7QUFDbEMsY0FBSSxZQUFZLEVBQUUsS0FBSyxHQUFMLENBQVMsZUFBWCxFQUE0QixJQUE1QixDQUFpQyxNQUFqQyxDQUFoQjtBQUNBLGNBQUksT0FBTyxLQUFLLGNBQUwsQ0FBb0IsQ0FBcEIsRUFBdUIsSUFBdkIsRUFBWDtBQUNBLGNBQUksTUFBTSxFQUFFLEtBQUssR0FBTCxDQUFTLGNBQVgsRUFBMkIsSUFBM0IsQ0FBZ0MsUUFBaEMsSUFBNEMsR0FBNUMsR0FBa0QsU0FBbEQsR0FBOEQsR0FBOUQsR0FBb0UsbUJBQW1CLElBQW5CLENBQTlFO0FBQ0EsY0FBSSxNQUFNLEVBQVY7QUFDQSxjQUFJLE1BQU0sS0FBSyxhQUFmLEVBQThCO0FBQzVCLGNBQUUsS0FBSyxHQUFMLENBQVMsZUFBWCxFQUE0QixHQUE1QixDQUFnQyxJQUFoQztBQUNBLGtCQUFNLG1CQUFOO0FBQ0Q7QUFDRCxZQUFFLEtBQUssR0FBTCxDQUFTLGlCQUFYLEVBQThCLE1BQTlCLFFBQTBDLEdBQTFDLGdCQUF1RCxHQUF2RCxtQkFBc0UsSUFBdEUsaUJBQXFGLElBQXJGO0FBQ0EscUJBQVcsSUFBWDtBQUNBO0FBQ0Q7O0FBRUQsWUFBSSxLQUFLLEVBQVQsRUFBYTtBQUNkO0FBQ0QsV0FBSyxjQUFMLEdBQXNCLENBQXRCOztBQUVBLFVBQUksUUFBSixFQUFjO0FBQ1osVUFBRSxLQUFLLEdBQUwsQ0FBUyxpQkFBWCxFQUE4QixJQUE5QjtBQUNEO0FBQ0Y7OztrQ0FFYSxDLEVBQUc7QUFDZixRQUFFLGNBQUY7QUFDQSxVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsT0FBWCxFQUFvQixRQUFwQixDQUE2QiwrQkFBN0IsQ0FBSixFQUFtRTtBQUNqRSxhQUFLLFdBQUw7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLLFdBQUw7QUFDRDtBQUNGOzs7a0NBRWE7QUFBQTs7QUFDWixRQUFFLEtBQUssR0FBTCxDQUFTLFVBQVgsRUFBdUIsV0FBdkIsQ0FBbUMsMEJBQW5DO0FBQ0EsUUFBRSxLQUFLLEdBQUwsQ0FBUyxNQUFYLEVBQW1CLE9BQW5CLENBQTJCLDBCQUEzQixFQUF1RCxXQUF2RCxDQUFtRSwrQkFBbkU7QUFDQSxpQkFBVyxZQUFNO0FBQ2YsVUFBRSxPQUFLLEdBQUwsQ0FBUyxNQUFYLEVBQW1CLFdBQW5CLENBQStCLDhCQUEvQjtBQUNELE9BRkQsRUFFRyxHQUZIOztBQUlBLFFBQUUsS0FBSyxHQUFMLENBQVMsT0FBWCxFQUFvQixRQUFwQixDQUE2QiwrQkFBN0I7QUFDQSxRQUFFLEtBQUssR0FBTCxDQUFTLE9BQVgsRUFBb0IsT0FBcEIsQ0FBNEIsMEJBQTVCLEVBQXdELFFBQXhELENBQWlFLCtCQUFqRTtBQUNBLFFBQUUsS0FBSyxHQUFMLENBQVMsV0FBWCxFQUF3QixRQUF4QixDQUFpQyxrQ0FBakM7O0FBRUEsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLE1BQVgsRUFBbUIsUUFBbkIsQ0FBNEIsMEJBQTVCLENBQUosRUFBNkQ7QUFDM0QsYUFBSyxhQUFMLENBQW1CLElBQW5CO0FBQ0EsVUFBRSxLQUFLLEdBQUwsQ0FBUyxNQUFYLEVBQW1CLFdBQW5CLENBQStCLDBCQUEvQjtBQUNBLFVBQUUsS0FBSyxHQUFMLENBQVMsSUFBWCxFQUFpQixXQUFqQixDQUE2QixHQUE3QjtBQUNEO0FBQ0Y7OztrQ0FFYTtBQUFBOztBQUNaLFFBQUUsS0FBSyxHQUFMLENBQVMsV0FBWCxFQUF3QixXQUF4QixDQUFvQyxrQ0FBcEM7QUFDQSxRQUFFLEtBQUssR0FBTCxDQUFTLE9BQVgsRUFBb0IsT0FBcEIsQ0FBNEIsMEJBQTVCLEVBQXdELFdBQXhELENBQW9FLCtCQUFwRTtBQUNBLFFBQUUsS0FBSyxHQUFMLENBQVMsV0FBWCxFQUF3QixJQUF4QixDQUE2QixNQUE3QixFQUFxQyxXQUFyQyxDQUFpRCxNQUFqRDs7QUFFQSxpQkFBVyxZQUFNO0FBQ2YsVUFBRSxPQUFLLEdBQUwsQ0FBUyxPQUFYLEVBQW9CLFdBQXBCLENBQWdDLCtCQUFoQztBQUNELE9BRkQsRUFFRyxHQUZIO0FBR0EsYUFBTyxJQUFQO0FBQ0Q7OzsyQ0FFc0IsQyxFQUFHO0FBQ3hCLFFBQUUsY0FBRjtBQUNBLFFBQUUsS0FBSyxHQUFMLENBQVMsV0FBWCxFQUF3QixJQUF4QixDQUE2QixNQUE3QixFQUFxQyxRQUFyQyxDQUE4QyxNQUE5QztBQUNEOzs7Ozs7a0JBR1ksSUFBSSxNQUFKLEU7Ozs7Ozs7Ozs7Ozs7SUNuWVQsSTtBQUNKLGtCQUFjO0FBQUE7O0FBQ1osU0FBSyxHQUFMLEdBQVc7QUFDVCxpQkFBVyxPQURGO0FBRVQsZUFBUyxzQ0FGQTtBQUdULGNBQVE7QUFIQyxLQUFYOztBQU1BLFNBQUssVUFBTCxHQUFrQixLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBbEI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBWjtBQUNEOzs7O2lDQUVZO0FBQ1gsUUFBRSxRQUFGLEVBQVksRUFBWixDQUFlLE9BQWYsRUFBd0IsS0FBSyxHQUFMLENBQVMsT0FBakMsRUFBMEMsS0FBSyxXQUEvQztBQUNEOzs7Z0NBRVcsQyxFQUFHO0FBQ2IsUUFBRSxjQUFGO0FBQ0EsVUFBSSxVQUFVLEtBQUssVUFBTCxDQUFnQixFQUFFLE1BQUYsQ0FBUyxJQUF6QixDQUFkO0FBQ0EsUUFBRSxLQUFLLEdBQUwsQ0FBUyxNQUFYLEVBQW1CLElBQW5CLENBQXdCLEtBQXhCLEVBQStCLG1DQUFtQyxPQUFuQyxHQUE2QyxzQ0FBNUUsRUFBb0gsUUFBcEgsQ0FBNkgsbUJBQTdIO0FBQ0Q7OzsrQkFFVSxLLEVBQU87QUFDaEIsVUFBSSxLQUFLLEVBQVQ7QUFDQSxVQUFJLE1BQU0sTUFBTSxPQUFOLENBQWMsU0FBZCxFQUF5QixFQUF6QixFQUE2QixLQUE3QixDQUFtQyx1Q0FBbkMsQ0FBVjtBQUNBLFVBQUksSUFBSSxDQUFKLE1BQVcsU0FBZixFQUEwQjtBQUN4QixhQUFLLElBQUksQ0FBSixFQUFPLEtBQVAsQ0FBYSxlQUFiLENBQUw7QUFDQSxhQUFLLEdBQUcsQ0FBSCxDQUFMO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBSyxHQUFMO0FBQ0Q7QUFDRCxhQUFPLEVBQVA7QUFDRDs7OzJCQUVNO0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxLQUFQO0FBQ3ZDLFdBQUssVUFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7a0JBR1ksSUFBSSxJQUFKLEU7Ozs7Ozs7Ozs7Ozs7SUMxQ1QsVTtBQUNKLHdCQUFjO0FBQUE7O0FBQ1osU0FBSyxHQUFMLEdBQVc7QUFDVCxpQkFBVztBQURGLEtBQVg7O0FBSUEsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBWjtBQUNBLFNBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQWhCO0FBQ0Q7Ozs7MkJBRU07QUFDTCxVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixNQUF0QixJQUFnQyxDQUFwQyxFQUF1QyxPQUFPLEtBQVA7QUFDdkMsVUFBSSxVQUFVLEtBQUssUUFBTCxFQUFkO0FBQ0EsVUFBSSxZQUFZLEtBQWhCLEVBQXVCO0FBQ3JCLFlBQUksV0FBVyxFQUFmLEVBQW1CO0FBQ2pCLFlBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixRQUF0QixDQUErQixTQUEvQjtBQUNELFNBRkQsTUFFTztBQUNMLFlBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixRQUF0QixTQUFxQyxPQUFyQztBQUNEO0FBQ0Y7QUFDRCxhQUFPLElBQVA7QUFDRDs7OytCQUVVO0FBQ1QsVUFBSSxLQUFLLE9BQU8sU0FBUCxDQUFpQixTQUExQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBSSxPQUFPLEdBQUcsT0FBSCxDQUFXLE9BQVgsQ0FBWDtBQUNBLFVBQUksT0FBTyxDQUFYLEVBQWM7QUFDWjtBQUNBLGVBQU8sU0FBUyxHQUFHLFNBQUgsQ0FBYSxPQUFPLENBQXBCLEVBQXVCLEdBQUcsT0FBSCxDQUFXLEdBQVgsRUFBZ0IsSUFBaEIsQ0FBdkIsQ0FBVCxFQUF3RCxFQUF4RCxDQUFQO0FBQ0Q7O0FBRUQsVUFBSSxVQUFVLEdBQUcsT0FBSCxDQUFXLFVBQVgsQ0FBZDtBQUNBLFVBQUksVUFBVSxDQUFkLEVBQWlCO0FBQ2Y7QUFDQSxZQUFJLEtBQUssR0FBRyxPQUFILENBQVcsS0FBWCxDQUFUO0FBQ0EsZUFBTyxTQUFTLEdBQUcsU0FBSCxDQUFhLEtBQUssQ0FBbEIsRUFBcUIsR0FBRyxPQUFILENBQVcsR0FBWCxFQUFnQixFQUFoQixDQUFyQixDQUFULEVBQW9ELEVBQXBELENBQVA7QUFDRDs7QUFFRCxVQUFJLE9BQU8sR0FBRyxPQUFILENBQVcsT0FBWCxDQUFYO0FBQ0EsVUFBSSxPQUFPLENBQVgsRUFBYztBQUNaO0FBQ0EsZUFBTyxTQUFTLEdBQUcsU0FBSCxDQUFhLE9BQU8sQ0FBcEIsRUFBdUIsR0FBRyxPQUFILENBQVcsR0FBWCxFQUFnQixJQUFoQixDQUF2QixDQUFULEVBQXdELEVBQXhELENBQVA7QUFDRDs7QUFFRDtBQUNBLGFBQU8sS0FBUDtBQUNEOzs7Ozs7a0JBR1ksSUFBSSxVQUFKLEU7Ozs7Ozs7Ozs7Ozs7SUN4RFQsYTtBQUNKLDJCQUFjO0FBQUE7O0FBQ1osU0FBSyxHQUFMLEdBQVc7QUFDVCxpQkFBVyxnQkFERjtBQUVULHdCQUFrQiw4QkFGVDtBQUdULHNCQUFnQjtBQUhQLEtBQVg7O0FBTUEsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBWjtBQUNBLFNBQUssVUFBTCxHQUFrQixLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBbEI7QUFDRDs7OzsyQkFFTTtBQUNMLFVBQUksRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLE1BQXRCLElBQWdDLENBQXBDLEVBQXVDLE9BQU8sS0FBUDtBQUN2QyxXQUFLLFVBQUw7QUFDQSxhQUFPLElBQVA7QUFDRDs7O2lDQUVZO0FBQUE7O0FBQ1gsUUFBRSxRQUFGLEVBQVksRUFBWixDQUFlLE9BQWYsRUFBd0IsS0FBSyxHQUFMLENBQVMsY0FBakMsRUFBaUQsVUFBQyxHQUFELEVBQVM7QUFDeEQsWUFBSSxZQUFZLEVBQUUsSUFBSSxhQUFOLEVBQXFCLE9BQXJCLENBQTZCLE1BQUssR0FBTCxDQUFTLGdCQUF0QyxDQUFoQjtBQUNBLFlBQUksVUFBVSxRQUFWLENBQW1CLE1BQW5CLENBQUosRUFBZ0M7QUFDOUIsb0JBQVUsSUFBVixDQUFlLHdCQUFmLEVBQXlDLEdBQXpDLENBQTZDLEVBQUUsUUFBUSxDQUFWLEVBQTdDO0FBQ0Esb0JBQVUsV0FBVixDQUFzQixNQUF0QjtBQUNELFNBSEQsTUFHTztBQUNMLFlBQUUsSUFBSSxhQUFOLEVBQXFCLE9BQXJCLENBQTZCLE1BQUssR0FBTCxDQUFTLFNBQXRDLEVBQWlELElBQWpELENBQXNELDJDQUF0RCxFQUFtRyxHQUFuRyxDQUF1RyxFQUFFLFFBQVEsQ0FBVixFQUF2RztBQUNBLFlBQUUsSUFBSSxhQUFOLEVBQXFCLE9BQXJCLENBQTZCLE1BQUssR0FBTCxDQUFTLFNBQXRDLEVBQWlELElBQWpELENBQXNELGVBQXRELEVBQXVFLFdBQXZFLENBQW1GLE1BQW5GO0FBQ0Esb0JBQVUsUUFBVixDQUFtQixNQUFuQjtBQUNBLG9CQUFVLElBQVYsQ0FBZSx3QkFBZixFQUF5QyxHQUF6QyxDQUE2QyxFQUFFLFFBQVEsVUFBVSxJQUFWLENBQWUsMEJBQWYsRUFBMkMsV0FBM0MsRUFBVixFQUE3QztBQUNEOztBQUVELGVBQU8sS0FBUDtBQUNELE9BYkQ7QUFjRDs7Ozs7O2tCQUdZLElBQUksYUFBSixFOzs7Ozs7Ozs7Ozs7O0lDcENULGM7QUFDSiw0QkFBYztBQUFBOztBQUNaLFNBQUssR0FBTCxHQUFXO0FBQ1QsaUJBQVc7QUFERixLQUFYOztBQUlBLFNBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNBLFNBQUssVUFBTCxHQUFrQixzQkFBbEI7O0FBRUEsU0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDRDs7OztvQ0FFZTtBQUNkLFVBQU0sU0FBUyxFQUFFLHFDQUFGLEVBQXlDLElBQXpDLENBQThDLFNBQTlDLENBQWY7QUFDQSxhQUFRLFNBQVMsTUFBVCxHQUFrQixFQUExQjtBQUNEOzs7MkJBRU07QUFDTCxVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixNQUF0QixJQUFnQyxDQUFwQyxFQUF1QyxPQUFPLEtBQVA7QUFDdkMsVUFBSSxDQUFDLEtBQUssUUFBVixFQUFvQjtBQUNsQixVQUFFLE9BQUYsRUFBVyxLQUFLLEdBQWhCLEVBQXFCLElBQXJCO0FBQ0EsZUFBTyxLQUFQO0FBQ0Q7O0FBRUQsVUFBSSxTQUFTLFFBQVEsR0FBUixDQUFZLEtBQUssVUFBakIsQ0FBYjtBQUNBLFVBQUksT0FBTyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDLFlBQUksV0FBVyxPQUFPLFNBQVAsQ0FBaUIsWUFBakIsSUFBaUMsT0FBTyxTQUFQLENBQWlCLFFBQWpFO0FBQ0EsWUFBSSxnQkFBZ0IsS0FBSyxLQUFMLENBQVcsRUFBRSxnQkFBRixFQUFvQixJQUFwQixFQUFYLENBQXBCO0FBQ0EsWUFBSSxXQUFXLEVBQWY7QUFDQSxZQUFJLE1BQU0sRUFBVjs7QUFFQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksY0FBYyxRQUFkLENBQXVCLE1BQTNDLEVBQW1ELEdBQW5ELEVBQXdEO0FBQ3RELGNBQUksVUFBVSxjQUFjLFFBQWQsQ0FBdUIsQ0FBdkIsQ0FBZDtBQUNBLGNBQUksUUFBUSxTQUFSLEtBQXNCLEdBQTFCLEVBQStCO0FBQzdCLHVCQUFXLEtBQUssYUFBTCxLQUF1QixRQUFRLElBQS9CLEdBQXNDLE9BQWpEO0FBQ0Q7QUFDRCxjQUFJLFFBQVEsU0FBUixDQUFrQixPQUFsQixDQUEwQixRQUExQixLQUF1QyxDQUEzQyxFQUE4QztBQUM1QyxrQkFBTSxLQUFLLGFBQUwsS0FBdUIsUUFBUSxJQUEvQixHQUFzQyxPQUE1QztBQUNEO0FBQ0Y7QUFDRCxZQUFJLFFBQVEsRUFBWixFQUFnQjtBQUNkLGtCQUFRLEdBQVIsQ0FBWSxLQUFLLFVBQWpCLEVBQTZCLEdBQTdCO0FBQ0EsaUJBQU8sUUFBUCxDQUFnQixJQUFoQixHQUF1QixHQUF2QjtBQUNELFNBSEQsTUFHTyxJQUFJLGFBQWEsRUFBakIsRUFBcUI7QUFDMUIsa0JBQVEsR0FBUixDQUFZLEtBQUssVUFBakIsRUFBNkIsUUFBN0I7QUFDQSxpQkFBTyxRQUFQLENBQWdCLElBQWhCLEdBQXVCLFFBQXZCO0FBQ0Q7QUFDRixPQXRCRCxNQXNCTztBQUNMLGVBQU8sUUFBUCxDQUFnQixJQUFoQixHQUF1QixNQUF2QjtBQUNEOztBQUVELFFBQUUsT0FBRixFQUFXLEtBQUssR0FBaEIsRUFBcUIsSUFBckI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7Ozs7OztrQkFHWSxJQUFJLGNBQUosRTs7Ozs7Ozs7Ozs7OztJQzFEVCxTO0FBQ0osdUJBQWM7QUFBQTs7QUFDWixTQUFLLE1BQUwsR0FBYztBQUNaLGVBQVMsa0JBREc7QUFFWixrQkFBWSwwRUFGQTs7QUFJWixnQkFBVSwrQkFKRTtBQUtaLGdCQUFVO0FBTEUsS0FBZDs7QUFRQSxTQUFLLEdBQUwsR0FBVztBQUNULGlCQUFXLDZCQURGO0FBRVQsc0JBQWdCLHdCQUZQO0FBR1Qsc0JBQWdCLHdCQUhQO0FBSVQsd0JBQWtCO0FBSlQsS0FBWDs7QUFPQSxTQUFLLGFBQUwsR0FBcUIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCOztBQUVBLFNBQUssZ0JBQUwsR0FBd0IsS0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixJQUEzQixDQUF4QjtBQUNBLFNBQUssZ0JBQUwsR0FBd0IsS0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixJQUEzQixDQUF4QjtBQUNBLFNBQUssY0FBTCxHQUFzQixLQUFLLGNBQUwsQ0FBb0IsSUFBcEIsQ0FBeUIsSUFBekIsQ0FBdEI7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUFoQjs7QUFFQSxTQUFLLFlBQUwsR0FBb0IsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCLENBQXBCOztBQUVBLFNBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQWhCO0FBQ0Q7Ozs7b0NBRWU7QUFDZCxVQUFNLFNBQVMsRUFBRSxxQ0FBRixFQUF5QyxJQUF6QyxDQUE4QyxTQUE5QyxDQUFmO0FBQ0EsYUFBUSxTQUFTLE1BQVQsR0FBa0IsRUFBMUI7QUFDRDs7O2tDQUVhO0FBQ1osVUFBTSxPQUFPLEVBQUUsbUNBQUYsRUFBdUMsSUFBdkMsQ0FBNEMsU0FBNUMsQ0FBYjtBQUNBLGFBQVEsT0FBTyxJQUFQLEdBQWMsRUFBdEI7QUFDRDs7OzJCQUVNO0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxLQUFQO0FBQ3ZDLFdBQUssVUFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7aUNBRVk7QUFBQTs7QUFDWCxRQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsa0JBQWIsRUFBaUMsWUFBTTtBQUNyQyxjQUFLLFFBQUw7QUFDRCxPQUZEOztBQUlBLGFBQU8sU0FBUCxDQUFpQixTQUFqQixDQUEyQixVQUEzQixFQUF1QyxVQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ3pELGVBQU8sSUFBSSxNQUFKLENBQVcsRUFBRSxPQUFGLEVBQVcsSUFBWCxDQUFnQixTQUFoQixDQUFYLEVBQXVDLElBQXZDLENBQTRDLEtBQTVDLENBQVA7QUFDRCxPQUZELEVBRUcsOEJBRkg7O0FBSUEsYUFBTyxTQUFQLENBQWlCLFNBQWpCLENBQTJCLFNBQTNCLEVBQXNDLFVBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDeEQsZUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFGLEVBQVcsSUFBWCxDQUFnQixjQUFoQixDQUFSLEVBQXlDLEdBQXpDLE9BQW1ELEVBQUUsT0FBRixFQUFXLEdBQVgsRUFBM0Q7QUFDRCxPQUZELEVBRUcsd0JBRkg7O0FBSUEsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsSUFBdEIsQ0FBMkIsS0FBSyxHQUFMLENBQVMsY0FBcEMsRUFBb0QsTUFBcEQsR0FBNkQsQ0FBakUsRUFBb0U7QUFDbEUsZUFBTyxXQUFQLEdBQXFCLFlBQU07QUFDekIsaUJBQU8sV0FBUCxHQUFxQixZQUFZLFlBQU07QUFDckMsZ0JBQUksT0FBUSxPQUFPLEVBQWYsS0FBdUIsV0FBdkIsSUFBc0MsT0FBTyxFQUFQLEtBQWMsSUFBeEQsRUFBOEQ7QUFDNUQscUJBQU8sRUFBUCxDQUFVLElBQVYsQ0FBZTtBQUNiLHVCQUFPLE1BQUssTUFBTCxDQUFZLE9BRE47QUFFYix3QkFBUSxJQUZLO0FBR2IsdUJBQU8sSUFITTtBQUliLHlCQUFTO0FBSkksZUFBZjs7QUFPQSw0QkFBYyxPQUFPLFdBQXJCO0FBQ0Q7QUFDRixXQVhvQixFQVdsQixHQVhrQixDQUFyQjtBQVlELFNBYkQ7O0FBZUEsWUFBSSxTQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLE1BQThDLElBQWxELEVBQXdEO0FBQ3RELGNBQUksTUFBTSxTQUFTLG9CQUFULENBQThCLFFBQTlCLEVBQXdDLENBQXhDLENBQVY7QUFDQSxjQUFJLEtBQUssU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQVQ7QUFDQSxhQUFHLEVBQUgsR0FBUSxnQkFBUjtBQUNBLGFBQUcsR0FBSCxHQUFTLHFDQUFUO0FBQ0EsY0FBSSxVQUFKLENBQWUsWUFBZixDQUE0QixFQUE1QixFQUFnQyxHQUFoQztBQUNEO0FBQ0QsVUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLEtBQUssR0FBTCxDQUFTLGNBQXBDLEVBQW9ELEVBQXBELENBQXVELE9BQXZELEVBQWdFLFVBQUMsR0FBRCxFQUFTO0FBQ3ZFLGdCQUFLLGdCQUFMLENBQXNCLEdBQXRCO0FBQ0EsaUJBQU8sS0FBUDtBQUNELFNBSEQ7QUFJRDs7QUFFRCxVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixLQUFLLEdBQUwsQ0FBUyxjQUFwQyxFQUFvRCxNQUFwRCxHQUE2RCxDQUFqRSxFQUFvRTtBQUNsRSxVQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsSUFBdEIsQ0FBMkIsS0FBSyxHQUFMLENBQVMsY0FBcEMsRUFBb0QsRUFBcEQsQ0FBdUQsT0FBdkQsRUFBZ0UsVUFBQyxHQUFELEVBQVM7QUFDdkUsZ0JBQUssZ0JBQUwsQ0FBc0IsR0FBdEI7QUFDQSxpQkFBTyxLQUFQO0FBQ0QsU0FIRDtBQUlEOztBQUVELFVBQUksZUFBZSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsSUFBdEIsQ0FBMkIsS0FBSyxHQUFMLENBQVMsZ0JBQXBDLENBQW5CO0FBQ0EsVUFBSSxhQUFhLE1BQWIsR0FBc0IsQ0FBMUIsRUFBNkI7QUFDM0IsZUFBTyxXQUFQLEdBQXFCLFlBQVksWUFBTTtBQUNyQyxjQUFJLE9BQVEsT0FBTyxJQUFmLEtBQXlCLFdBQXpCLElBQXdDLE9BQU8sSUFBUCxLQUFnQixJQUE1RCxFQUFrRTtBQUNoRSxtQkFBTyxJQUFQLENBQVksSUFBWixDQUFpQixPQUFqQixFQUEwQixZQUFNO0FBQzlCLGtCQUFJLFFBQVEsT0FBTyxJQUFQLENBQVksS0FBWixDQUFrQixJQUFsQixDQUF1QjtBQUNqQywyQkFBVyxNQUFLLE1BQUwsQ0FBWSxVQURVO0FBRWpDLDhCQUFjO0FBRm1CLGVBQXZCLENBQVo7O0FBS0Esa0JBQUksVUFBVSxhQUFhLEdBQWIsQ0FBaUIsQ0FBakIsQ0FBZDtBQUNBLG9CQUFNLGtCQUFOLENBQXlCLE9BQXpCLEVBQWtDLEVBQWxDLEVBQ0UsVUFBQyxVQUFELEVBQWdCO0FBQ2Qsc0JBQUssY0FBTCxDQUFvQixVQUFwQjtBQUNBLHVCQUFPLEtBQVA7QUFDRCxlQUpILEVBS0UsVUFBQyxNQUFELEVBQVk7QUFDVixvQkFBSSxPQUFPLEtBQVAsS0FBaUIsc0JBQXJCLEVBQTZDO0FBQzNDLHdCQUFNLE9BQU8sS0FBYjtBQUNEO0FBQ0YsZUFUSDtBQVdELGFBbEJEOztBQW9CQSwwQkFBYyxPQUFPLFdBQXJCO0FBQ0Q7QUFDRixTQXhCb0IsRUF3QmxCLEdBeEJrQixDQUFyQjs7QUEwQkEsVUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLEtBQUssR0FBTCxDQUFTLGdCQUFwQyxFQUFzRCxFQUF0RCxDQUF5RCxPQUF6RCxFQUFrRSxVQUFDLEdBQUQsRUFBUztBQUN6RSxjQUFJLGNBQUo7QUFDQSxpQkFBTyxLQUFQO0FBQ0QsU0FIRDtBQUlEOztBQUVELFFBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixRQUF0QixDQUErQjtBQUM3QixlQUFPO0FBQ0wsd0JBQWMsT0FEVDtBQUVMLDJCQUFpQjtBQUZaLFNBRHNCO0FBSzdCLHdCQUFnQix3QkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNsQyxjQUFJLFFBQVEsSUFBUixDQUFhLE1BQWIsTUFBeUIsVUFBN0IsRUFBeUM7QUFDdkMsa0JBQU0sV0FBTixDQUFrQixFQUFFLE9BQUYsRUFBVyxNQUFYLEdBQW9CLElBQXBCLENBQXlCLE9BQXpCLENBQWxCO0FBQ0QsV0FGRCxNQUVPLElBQUksUUFBUSxJQUFSLENBQWEsTUFBYixNQUF5QixVQUE3QixFQUF5QztBQUM5QyxjQUFFLE9BQUYsRUFBVyxNQUFYLENBQWtCLEtBQWxCO0FBQ0Esa0JBQU0sV0FBTixDQUFrQixFQUFFLE9BQUYsRUFBVyxNQUFYLEVBQWxCO0FBQ0QsV0FITSxNQUdBLElBQUksUUFBUSxJQUFSLENBQWEsTUFBYixNQUF5QixRQUE3QixFQUF1QztBQUM1QyxrQkFBTSxXQUFOLENBQWtCLEVBQUUsT0FBRixFQUFXLE1BQVgsRUFBbEI7QUFDRCxXQUZNLE1BRUE7QUFDTCxrQkFBTSxXQUFOLENBQWtCLE9BQWxCO0FBQ0Q7QUFDRixTQWhCNEI7QUFpQjdCLHVCQUFlLHVCQUFDLElBQUQsRUFBVTtBQUN2QixnQkFBSyxRQUFMLENBQWMsSUFBZDtBQUNBLGlCQUFPLEtBQVA7QUFDRDtBQXBCNEIsT0FBL0I7QUFzQkQ7OztxQ0FFZ0IsRyxFQUFLO0FBQUE7O0FBQ3BCLFVBQUksY0FBSjs7QUFFQSxRQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsSUFBdEIsQ0FBMkIsS0FBSyxHQUFMLENBQVMsY0FBcEMsRUFBb0QsSUFBcEQsQ0FBeUQsZ0JBQXpEOztBQUVBLGFBQU8sRUFBUCxDQUFVLEtBQVYsQ0FBZ0IsVUFBQyxhQUFELEVBQW1CO0FBQ2pDLFlBQUksY0FBYyxZQUFsQixFQUFnQztBQUM5QixpQkFBTyxFQUFQLENBQVUsR0FBVixDQUFjLEtBQWQsRUFBcUIsVUFBQyxZQUFELEVBQWtCO0FBQ3JDLGdCQUFJLE9BQU87QUFDVCx3QkFBVSxhQUFhLEtBRGQ7QUFFVCx3QkFBVSxhQUFhO0FBRmQsYUFBWDs7QUFLQSxtQkFBSyxZQUFMLENBQWtCLElBQWxCLEVBQXdCLFlBQU07QUFDNUIsZ0JBQUUsT0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixPQUFLLEdBQUwsQ0FBUyxjQUFwQyxFQUFvRCxJQUFwRCxDQUF5RCxVQUF6RDtBQUNELGFBRkQ7QUFHRCxXQVRELEVBU0csRUFBRSxRQUFRLENBQUUsSUFBRixFQUFRLE9BQVIsQ0FBVixFQVRIO0FBVUQ7QUFDRCxlQUFPLEtBQVA7QUFDRCxPQWRELEVBY0csRUFBRSxPQUFPLHNCQUFULEVBQWlDLGVBQWUsSUFBaEQsRUFkSDtBQWVEOzs7cUNBRWdCLEcsRUFBSztBQUFBOztBQUNwQixVQUFJLGNBQUo7O0FBRUEsUUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLEtBQUssR0FBTCxDQUFTLGNBQXBDLEVBQW9ELElBQXBELENBQXlELGdCQUF6RDs7QUFFQSxTQUFHLElBQUgsQ0FBUSxTQUFSLENBQWtCLFlBQU07QUFDdEIsV0FBRyxHQUFILENBQU8sT0FBUCxDQUFlLElBQWYsRUFBcUIsTUFBckIsQ0FBNEIsSUFBNUIsRUFBa0MsWUFBbEMsRUFBZ0QsV0FBaEQsRUFBNkQsZUFBN0QsRUFBOEUsTUFBOUUsQ0FBcUYsVUFBQyxNQUFELEVBQVk7QUFDL0YsY0FBSSxTQUFTLE9BQU8sTUFBUCxDQUFjLENBQWQsQ0FBYjs7QUFFQSxjQUFJLE9BQU87QUFDVCxzQkFBVSxPQUFPLFlBRFI7QUFFVCxzQkFBVSxPQUFPO0FBRlIsV0FBWDs7QUFLQSxpQkFBSyxZQUFMLENBQWtCLElBQWxCLEVBQXdCLFlBQU07QUFDNUIsY0FBRSxPQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLE9BQUssR0FBTCxDQUFTLGNBQXBDLEVBQW9ELElBQXBELENBQXlELFVBQXpEO0FBQ0QsV0FGRDtBQUdELFNBWEQ7QUFZRCxPQWJEOztBQWVBLGtCQUFZLFlBQU07QUFDaEIsWUFBSSxTQUFTLE9BQU8sRUFBUCxDQUFVLElBQVYsQ0FBZSxZQUFmLEVBQWI7QUFDQSxZQUFJLE1BQUosRUFBWTtBQUNWLGFBQUcsR0FBSCxDQUFPLE9BQVAsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLENBQTRCLElBQTVCLEVBQWtDLFlBQWxDLEVBQWdELFdBQWhELEVBQTZELGVBQTdELEVBQThFLE1BQTlFLENBQXFGLFVBQUMsTUFBRCxFQUFZO0FBQy9GLGdCQUFJLFNBQVMsT0FBTyxNQUFQLENBQWMsQ0FBZCxDQUFiOztBQUVBLGdCQUFJLE9BQU87QUFDVCx3QkFBVSxPQUFPLFlBRFI7QUFFVCx3QkFBVSxPQUFPO0FBRlIsYUFBWDs7QUFLQSxtQkFBSyxZQUFMLENBQWtCLElBQWxCLEVBQXdCLFlBQU07QUFDNUIsZ0JBQUUsT0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixPQUFLLEdBQUwsQ0FBUyxjQUFwQyxFQUFvRCxJQUFwRCxDQUF5RCxVQUF6RDtBQUNELGFBRkQ7QUFHRCxXQVhEO0FBWUQ7QUFDRixPQWhCRCxFQWdCRyxJQWhCSDs7QUFtQkEsYUFBTyxLQUFQO0FBQ0Q7OzttQ0FFYyxVLEVBQVk7QUFBQTs7QUFDekIsVUFBSSxPQUFPO0FBQ1Qsa0JBQVUsV0FBVyxlQUFYLEdBQTZCLFFBQTdCLEVBREQ7QUFFVCxrQkFBVSxXQUFXLGVBQVgsR0FBNkIsS0FBN0I7QUFGRCxPQUFYOztBQUtBLFFBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixLQUFLLEdBQUwsQ0FBUyxnQkFBcEMsRUFBc0QsSUFBdEQsQ0FBMkQsZ0JBQTNEO0FBQ0EsV0FBSyxZQUFMLENBQWtCLElBQWxCLEVBQXdCLFlBQU07QUFDNUIsVUFBRSxPQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLE9BQUssR0FBTCxDQUFTLGdCQUFwQyxFQUFzRCxJQUF0RCxDQUEyRCxTQUEzRDtBQUNELE9BRkQ7QUFHRDs7OzZCQUVRLEksRUFBTTtBQUNiLFVBQUksTUFBTSxFQUFFLElBQUYsQ0FBVjtBQUNBLFVBQUksV0FBVyxJQUFJLElBQUosQ0FBUyxvQkFBVCxFQUErQixHQUEvQixFQUFmO0FBQ0EsVUFBSSxXQUFXLElBQUksSUFBSixDQUFTLHVCQUFULEVBQWtDLEdBQWxDLEVBQWY7O0FBRUEsVUFBSyxFQUFFLElBQUYsQ0FBTyxRQUFQLEVBQWlCLE1BQWpCLEtBQTRCLENBQTdCLElBQW9DLEVBQUUsSUFBRixDQUFPLFFBQVAsRUFBaUIsTUFBakIsS0FBNEIsQ0FBcEUsRUFBd0U7QUFDdEUsY0FBTSw4Q0FBTjtBQUNELE9BRkQsTUFFTztBQUNMLFlBQUksSUFBSixDQUFTLHVCQUFULEVBQWtDLElBQWxDLENBQXVDLGdCQUF2QztBQUNBLFlBQUksSUFBSixDQUFTLHVCQUFULEVBQWtDLEdBQWxDLENBQXNDLGdCQUF0Qzs7QUFFQSxhQUFLLFlBQUwsQ0FBa0IsRUFBRSxVQUFVLFFBQVosRUFBc0IsVUFBVSxRQUFoQyxFQUFsQixFQUE4RCxZQUFNO0FBQ2xFLGNBQUksSUFBSixDQUFTLHVCQUFULEVBQWtDLElBQWxDLENBQXVDLFFBQXZDO0FBQ0EsY0FBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsR0FBbEMsQ0FBc0MsT0FBdEM7QUFDRCxTQUhEO0FBSUQ7O0FBRUQsYUFBTyxLQUFQO0FBQ0Q7OztpQ0FFWSxJLEVBQU0sYyxFQUFnQjtBQUFBOztBQUNqQyxRQUFFLEdBQUYsQ0FBTSxLQUFLLGFBQUwsS0FBdUIsS0FBSyxNQUFMLENBQVksUUFBekMsRUFBbUQsVUFBQyxhQUFELEVBQW1CO0FBQ3BFLFlBQUksWUFBWSxjQUFjLEtBQTlCOztBQUVBLFVBQUUsSUFBRixDQUFPO0FBQ0wsZUFBSyxPQUFLLGFBQUwsS0FBdUIsT0FBSyxNQUFMLENBQVksUUFEbkM7QUFFTCxnQkFBTSxJQUZEO0FBR0wsZ0JBQU0sTUFIRDtBQUlMLG1CQUFTLEVBQUUsY0FBYyxTQUFoQixFQUpKO0FBS0wsb0JBQVUsTUFMTDtBQU1MLG1CQUFTLGlCQUFDLFFBQUQsRUFBYztBQUNyQixnQkFBSSxRQUFKLEVBQWM7QUFDWixrQkFBSSxTQUFTLE1BQVQsS0FBb0IsSUFBeEIsRUFBOEI7QUFDNUIsa0JBQUUsTUFBRixFQUFVLE9BQVYsQ0FBa0IscUJBQWxCLEVBQXlDLENBQUUsUUFBRixFQUFZLElBQVosQ0FBekM7O0FBRUEsb0JBQUksVUFBVSxFQUFFLE9BQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsSUFBdEIsQ0FBMkIsTUFBM0IsQ0FBZDtBQUNBLG9CQUFJLEVBQUUsSUFBRixDQUFPLE9BQVAsRUFBZ0IsTUFBaEIsS0FBMkIsQ0FBL0IsRUFBa0M7QUFDaEMsNEJBQVUsT0FBSyxXQUFMLEtBQXFCLE9BQS9CO0FBQ0Q7QUFDRCx1QkFBTyxRQUFQLEdBQWtCLE9BQWxCO0FBQ0QsZUFSRCxNQVFPO0FBQ0wsc0JBQU0sc0RBQXNELFNBQVMsS0FBckU7QUFDRDtBQUNGLGFBWkQsTUFZTztBQUNMLG9CQUFNLGlGQUFOO0FBQ0Q7QUFDRDtBQUNEO0FBdkJJLFNBQVA7QUF5QkQsT0E1QkQ7QUE2QkQ7OzsrQkFFVTtBQUNULGFBQU8sUUFBUCxHQUFrQixnQ0FBbEI7QUFDRDs7Ozs7O2tCQUdZLElBQUksU0FBSixFOzs7Ozs7Ozs7Ozs7O0lDL1JULFU7QUFDSix3QkFBYztBQUFBOztBQUNaLFNBQUssR0FBTCxHQUFXO0FBQ1QsaUJBQVc7QUFERixLQUFYO0FBR0EsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBWjtBQUNEOzs7OzJCQUVNO0FBQUE7O0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxLQUFQOztBQUV2QyxRQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsSUFBdEIsQ0FBMkIsVUFBQyxLQUFELEVBQVEsT0FBUjtBQUFBLGVBQW9CLE1BQUssVUFBTCxDQUFnQixPQUFoQixFQUF5QixLQUF6QixDQUFwQjtBQUFBLE9BQTNCOztBQUVBLGFBQU8sSUFBUDtBQUNEOzs7K0JBRVUsSSxFQUFNOztBQUVmLFVBQU0sUUFBUSxFQUFFLElBQUYsQ0FBZDs7QUFFQSxVQUFNLFFBQVEsTUFBTSxJQUFOLENBQVcsNkJBQVgsQ0FBZDs7QUFFQTtBQUNBLFVBQU0sZUFBZSxNQUFNLElBQU4sQ0FBVyxNQUFYLENBQXJCO0FBQ0EsVUFBTSxrQkFBa0IsZUFBZSxhQUFhLElBQWIsQ0FBa0IsSUFBbEIsQ0FBZixHQUF5QyxFQUFqRTtBQUNBLFVBQU0sZ0JBQWdCLGtCQUFrQixnQkFBZ0IsT0FBaEIsQ0FBd0IsV0FBeEIsRUFBcUMsRUFBckMsQ0FBbEIsR0FBNkQsRUFBbkY7O0FBRUEsVUFBTSxVQUFVLEVBQWhCOztBQUVBLFVBQUksY0FBYyxFQUFsQjs7QUFFQSxVQUFNLE9BQU8sTUFBTSxJQUFOLENBQVcsbUJBQVgsQ0FBYjs7QUFFQSxVQUFNLGlCQUFpQixPQUFPLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBUCxHQUEwQixJQUFqRDs7QUFFQSxVQUFJLGNBQWMsTUFBZCxLQUF5QixDQUE3QixFQUFnQzs7QUFFOUIsbUJBQVcsU0FBWCxDQUFxQixVQUFTLFFBQVQsRUFBbUI7QUFDdEMsWUFBRSxzQkFBRixFQUEwQixNQUExQjtBQUNBLFlBQUUsdUJBQUYsRUFBMkIsTUFBM0I7O0FBRUEsY0FBTSxTQUFTLFNBQVMsS0FBVCxFQUFmOztBQUVBLGNBQUksWUFBWSxPQUFaLENBQW9CLE9BQU8sUUFBUCxFQUFwQixNQUEyQyxDQUFDLENBQWhELEVBQW1EO0FBQ2pEO0FBQ0Q7O0FBRUQsY0FBSSxPQUFPLFFBQVAsT0FBc0IsY0FBYyxRQUFkLEVBQTFCLEVBQW9EO0FBQ2xELHdCQUFZLElBQVosQ0FBaUIsT0FBTyxRQUFQLEVBQWpCO0FBQ0Q7O0FBRUQsY0FBTSxTQUFTLFNBQVMsS0FBVCxHQUFpQixRQUFqQixPQUFnQyxjQUFjLFFBQWQsRUFBL0M7O0FBRUEsY0FBSSxNQUFKLEVBQVk7O0FBRVYscUJBQVMsU0FBVCxDQUFtQixVQUFDLENBQUQsRUFBTzs7QUFFeEIsa0JBQUksQ0FBQyxjQUFMLEVBQXFCO0FBQ25CO0FBQ0Q7O0FBRUQseUJBQVcsUUFBWCxDQUFvQiw0QkFBcEIsRUFBa0QsZUFBZSxnQkFBakUsRUFBbUYsZUFBZSxZQUFsRyxFQUFnSCxVQUFTLFVBQVQsRUFBcUI7O0FBRW5JLHdCQUFRLEdBQVIsQ0FBWSxZQUFaLEVBQTBCLFVBQTFCLEVBQXNDLENBQXRDOztBQUVBLG9CQUFNLGdCQUFnQixFQUFFLE1BQUYsQ0FBUyxDQUFULEVBQVksV0FBVyxTQUFYLEVBQVosQ0FBdEI7O0FBRUEsMkJBQVcsZUFBWCxDQUEyQixhQUEzQjtBQUNBLDJCQUFXLE1BQVg7O0FBRUEsMkJBQVcsUUFBWCxDQUFvQixVQUFDLENBQUQsRUFBTztBQUN6QiwwQkFBUSxHQUFSLENBQVksdUJBQVosRUFBcUMsRUFBRSxTQUFGLEVBQXJDO0FBQ0EseUJBQU8sS0FBUDtBQUNELGlCQUhEOztBQUtBLDJCQUFXLFNBQVgsQ0FBcUIsVUFBQyxDQUFELEVBQU87QUFDMUIsMEJBQVEsR0FBUixDQUFZLHdCQUFaO0FBQ0EseUJBQU8sSUFBUDtBQUNELGlCQUhEO0FBSUQsZUFsQkQ7O0FBb0JBLHFCQUFPLEtBQVA7QUFFRCxhQTVCRDtBQThCRDtBQUNGLFNBakREO0FBa0RELE9BcERELE1Bb0RPO0FBQ0wsbUJBQVcsU0FBWCxDQUFxQixVQUFTLFFBQVQsRUFBbUI7QUFDdEMsWUFBRSxzQkFBRixFQUEwQixNQUExQjtBQUNBLFlBQUUsdUJBQUYsRUFBMkIsTUFBM0I7QUFDRCxTQUhEO0FBSUQ7QUFDRCxhQUFPLElBQVA7QUFDRDs7Ozs7O2tCQUdZLElBQUksVUFBSixFOzs7Ozs7Ozs7OztBQ2xHZjs7OztBQUNBOzs7Ozs7OztJQUVNLGM7QUFDSiw0QkFBYztBQUFBOztBQUNaLFNBQUssR0FBTCxHQUFXO0FBQ1QsaUJBQVc7QUFERixLQUFYO0FBR0E7QUFDQSxTQUFLLGdCQUFMLEdBQXdCLGFBQWEsT0FBTyxRQUFQLENBQWdCLFFBQXJEOztBQUVBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CO0FBQ0EsU0FBSyxNQUFMLEdBQWMsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixJQUFqQixDQUFkO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBaEI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUssa0JBQUwsR0FBMEIsS0FBSyxrQkFBTCxDQUF3QixJQUF4QixDQUE2QixJQUE3QixDQUExQjtBQUNEOzs7O2lDQUVZO0FBQ1gsUUFBRSxRQUFGLEVBQVksRUFBWixDQUFlLE9BQWYsRUFBd0IsS0FBSyxHQUFMLENBQVMsU0FBakMsRUFBNEMsS0FBSyxXQUFqRDtBQUNEOzs7Z0NBRVcsQyxFQUFHO0FBQ2IsUUFBRSxjQUFGO0FBQ0EsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsUUFBdEIsQ0FBK0IsNkJBQS9CLENBQUosRUFBbUU7QUFDakUsYUFBSyxRQUFMO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBSyxNQUFMO0FBQ0Q7QUFDRjs7O3lDQUVvQjtBQUFBOztBQUNuQjtBQUNBLGFBQU8sSUFBUCxHQUFjLElBQWQsQ0FBbUIsVUFBQyxVQUFELEVBQWdCO0FBQUU7QUFDbkMsZUFBTyxRQUFRLEdBQVIsQ0FDTCxXQUFXLE1BQVgsQ0FBa0IsVUFBQyxTQUFELEVBQWU7QUFBRTtBQUNqQyxpQkFBUSxjQUFjLE1BQUssZ0JBQTNCLENBRCtCLENBQ2U7QUFDL0MsU0FGRCxDQURLLENBQVA7QUFLRCxPQU5ELEVBTUcsSUFOSCxDQU1RLFVBQUMsVUFBRCxFQUFnQjtBQUFFO0FBQ3hCLFlBQUksV0FBVyxNQUFYLEdBQW9CLENBQXhCLEVBQTJCO0FBQUU7QUFDM0IsWUFBRSxNQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLFFBQXRCLENBQStCLDZCQUEvQixFQUE4RCxJQUE5RCxDQUFtRSxPQUFuRSxFQUE0RSxlQUE1RSxFQUE2RixJQUE3RixDQUFrRyxNQUFsRyxFQUEwRyxJQUExRyxDQUErRyxlQUEvRztBQUNEO0FBQ0YsT0FWRDtBQVdEOzs7b0NBRWU7QUFDZDtBQUNBLFVBQUksYUFBYSxFQUFFLGNBQUYsQ0FBakI7QUFDQTtBQUNBLFVBQUksV0FBVyxNQUFYLEdBQW9CLENBQXhCLEVBQTJCO0FBQ3pCO0FBQ0EsWUFBSSxTQUFTLEVBQWI7QUFDQTtBQUNBLGVBQU8sSUFBUCxDQUNFLFdBQVcsR0FBWCxDQUFlLGtCQUFmLEVBQW1DLEtBQW5DLENBQXlDLE1BQXpDLEVBQWlELENBQWpELEVBQW9ELEtBQXBELENBQTBELEdBQTFELEVBQStELENBQS9ELEVBQWtFLE9BQWxFLENBQTBFLElBQTFFLEVBQWdGLEVBQWhGLEVBQW9GLE9BQXBGLENBQTRGLElBQTVGLEVBQWtHLEVBQWxHLENBREY7QUFHQTtBQUNBLFlBQUksZ0JBQWdCLFdBQVcsT0FBWCxDQUFtQixPQUFuQixFQUE0QixJQUE1QixDQUFpQyxPQUFqQyxFQUEwQyxJQUExQyxHQUFpRCxLQUFqRCxDQUF1RCxNQUF2RCxFQUErRCxDQUEvRCxFQUFrRSxLQUFsRSxDQUF3RSxHQUF4RSxFQUE2RSxDQUE3RSxFQUFnRixPQUFoRixDQUF3RixJQUF4RixFQUE4RixFQUE5RixFQUFrRyxPQUFsRyxDQUEwRyxJQUExRyxFQUFnSCxFQUFoSCxDQUFwQjtBQUNBO0FBQ0EsZUFBTyxJQUFQLENBQVksYUFBWjtBQUNBO0FBQ0EsZUFBTyxNQUFQO0FBQ0Q7QUFDRCxhQUFPLEtBQVA7QUFDRDs7OytCQUU2QztBQUFBOztBQUFBLFVBQXJDLFFBQXFDLHVFQUExQixPQUFPLFFBQVAsQ0FBZ0IsUUFBVTs7QUFDNUMsVUFBSSxRQUFRLElBQUksZUFBSixDQUFVLDBCQUFWLEVBQXNDLElBQXRDLENBQVo7QUFDQTtBQUNBLGFBQU8sbUJBQVMsYUFBVCxDQUF1QixRQUF2QixFQUFpQyxJQUFqQyxDQUFzQyxZQUFNO0FBQUM7QUFDbEQ7QUFDQSxlQUFPLE1BQVAsQ0FBYyxhQUFhLFFBQTNCLEVBQXFDLElBQXJDLENBQTBDLFlBQU07QUFDOUMsWUFBRSxPQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLFdBQXRCLENBQWtDLDZCQUFsQyxFQUFpRSxJQUFqRSxDQUFzRSxPQUF0RSxFQUErRSxjQUEvRSxFQUErRixJQUEvRixDQUFvRyxNQUFwRyxFQUE0RyxJQUE1RyxDQUFpSCxjQUFqSDtBQUNBLGdCQUFNLElBQU47QUFDRCxTQUhEO0FBSUQsT0FOTSxFQU1KLEtBTkksQ0FNRSxZQUFNO0FBQUM7QUFDZCxjQUFNLE9BQU4sQ0FBYywwQ0FBZDtBQUNBLGNBQU0sSUFBTjtBQUNELE9BVE0sQ0FBUDtBQVVEOzs7NkJBRVE7QUFBQTs7QUFDUDtBQUNBLFVBQUksUUFBUSxJQUFJLGVBQUosQ0FBVSxrQ0FBVixFQUE4QyxJQUE5QyxDQUFaOztBQUVBLFVBQUksRUFBRSxjQUFGLEVBQWtCLE1BQWxCLElBQTRCLENBQWhDLEVBQW1DO0FBQ2pDLGdCQUFRLEdBQVIsQ0FBWSx5QkFBWjtBQUNBLGNBQU0sT0FBTixDQUFjLHdDQUFkO0FBQ0EsY0FBTSxJQUFOO0FBQ0EsZUFBTyxLQUFQO0FBQ0Q7QUFDRDtBQUNBLFVBQUksV0FBVyxLQUFLLEtBQUwsQ0FBVyxFQUFFLGNBQUYsRUFBa0IsSUFBbEIsRUFBWCxDQUFmOztBQUVBO0FBQ0EseUJBQVMsVUFBVCxDQUNFLFNBQVMsS0FEWCxFQUVFLE9BQU8sUUFBUCxDQUFnQixRQUZsQixFQUdFLFNBQVMsV0FIWCxFQUlFLFNBQVMsWUFKWCxFQUtFLFNBQVMsWUFMWCxFQU1FLFNBQVMsVUFOWCxFQU9FLFNBQVMsV0FQWCxFQVFFLFNBQVMsWUFSWCxFQVNFLFNBQVMsT0FUWCxFQVVFLFNBQVMsT0FWWCxFQVdFLEtBQUssZ0JBWFAsRUFZRSxJQVpGLENBWU8sWUFBTTtBQUFDO0FBQ1o7QUFDQSxZQUFJLGdCQUFnQixDQUFDLE9BQU8sUUFBUCxDQUFnQixRQUFqQixFQUEyQixTQUFTLFdBQXBDLEVBQWlELFNBQVMsWUFBMUQsQ0FBcEI7O0FBRUE7QUFDQSxZQUFJLEVBQUUsY0FBRixFQUFrQixNQUFsQixHQUEyQixDQUEvQixFQUFrQztBQUNoQyxjQUFJLGFBQWEsT0FBSyxhQUFMLEVBQWpCO0FBQ0EsY0FBSSxVQUFKLEVBQWdCLGdCQUFnQixjQUFjLE1BQWQsQ0FBcUIsVUFBckIsQ0FBaEI7QUFDakI7O0FBRUQ7QUFDQSxZQUFJLEVBQUUsZUFBRixFQUFtQixNQUFuQixHQUE0QixDQUFoQyxFQUFtQztBQUNqQyxjQUFJLG9CQUFvQixFQUFFLDBCQUFGLEVBQThCLEdBQTlCLENBQWtDLGtCQUFsQyxDQUF4QjtBQUNBLGNBQUkscUJBQXFCLEVBQXpCLEVBQTZCO0FBQzNCLGdDQUFvQixrQkFBa0IsS0FBbEIsQ0FBd0IsTUFBeEIsRUFBZ0MsQ0FBaEMsRUFBbUMsS0FBbkMsQ0FBeUMsR0FBekMsRUFBOEMsQ0FBOUMsRUFBaUQsT0FBakQsQ0FBeUQsSUFBekQsRUFBK0QsRUFBL0QsRUFBbUUsT0FBbkUsQ0FBMkUsSUFBM0UsRUFBaUYsRUFBakYsQ0FBcEI7QUFDQSwwQkFBYyxJQUFkLENBQW1CLGlCQUFuQjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxVQUFFLDJDQUFGLEVBQStDLElBQS9DLENBQW9ELFVBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDdEU7QUFDQSxjQUFJLFNBQVMsRUFBRSxJQUFGLENBQU8sRUFBRSxPQUFGLEVBQVcsSUFBWCxDQUFnQixLQUFoQixDQUFQLENBQWI7QUFDQTtBQUNBLGNBQUksRUFBRSxXQUFXLEVBQWIsQ0FBSixFQUFzQjtBQUNwQjtBQUNBLDBCQUFjLElBQWQsQ0FBbUIsRUFBRSxPQUFGLEVBQVcsSUFBWCxDQUFnQixLQUFoQixDQUFuQjtBQUNEO0FBQ0YsU0FSRDs7QUFVQTtBQUNBLGVBQU8sSUFBUCxDQUFZLE9BQUssZ0JBQWpCLEVBQW1DLElBQW5DLENBQXdDLFVBQUMsS0FBRCxFQUFXO0FBQ2pEO0FBQ0EsY0FBSSxrQkFBa0IsRUFBdEI7QUFDQTtBQUNBLGNBQUksU0FBUyxTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBYjtBQUNBO0FBQ0EsWUFBRSxJQUFGLENBQU8sYUFBUCxFQUFzQixVQUFDLENBQUQsRUFBSSxFQUFKLEVBQVc7QUFDL0I7QUFDQSxtQkFBTyxJQUFQLEdBQWMsRUFBZDtBQUNBO0FBQ0EsZ0JBQUksT0FBTyxJQUFQLEtBQWdCLE9BQU8sUUFBUCxDQUFnQixJQUFwQyxFQUEwQztBQUMxQztBQUNBLGdCQUFJLFdBQVcsT0FBTyxRQUFQLEdBQWtCLE9BQU8sTUFBeEM7QUFDQTtBQUNBLGdCQUFJLEVBQUUsT0FBRixDQUFVLFFBQVYsRUFBb0IsZUFBcEIsTUFBeUMsQ0FBQyxDQUE5QyxFQUFpRCxnQkFBZ0IsSUFBaEIsQ0FBcUIsUUFBckI7QUFDbEQsV0FURDtBQVVBO0FBQ0EsY0FBSSxjQUFjLE1BQU0sTUFBTixDQUFhLGVBQWIsQ0FBbEI7QUFDQTtBQUNBO0FBQ0Esc0JBQVksSUFBWixDQUFpQixZQUFNO0FBQ3JCO0FBQ0EsY0FBRSxPQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLFFBQXRCLENBQStCLDZCQUEvQixFQUE4RCxJQUE5RCxDQUFtRSxPQUFuRSxFQUE0RSxtQkFBNUUsRUFBaUcsSUFBakcsQ0FBc0csTUFBdEcsRUFBOEcsSUFBOUcsQ0FBbUgsZUFBbkg7QUFDRCxXQUhELEVBR0csS0FISCxDQUdTLFVBQUMsS0FBRCxFQUFXO0FBQ2xCLG9CQUFRLEdBQVIsQ0FBWSxNQUFNLE9BQWxCO0FBQ0E7QUFDQSxrQkFBTSxPQUFOLENBQWMsd0NBQWQ7QUFDRCxXQVBELEVBT0csSUFQSCxDQU9RLFlBQU07QUFDWixrQkFBTSxJQUFOO0FBQ0QsV0FURDtBQVVELFNBOUJEO0FBK0JELE9BMUVELEVBMEVHLEtBMUVILENBMEVTLFVBQUMsS0FBRCxFQUFXO0FBQUM7QUFDbkIsZ0JBQVEsR0FBUixDQUFZLE1BQU0sT0FBbEI7QUFDQSxjQUFNLE9BQU4sQ0FBYyx3Q0FBZDtBQUNBLGNBQU0sSUFBTjtBQUNELE9BOUVEO0FBK0VBLGFBQU8sSUFBUDtBQUNEOzs7MkJBRU07QUFDTCxVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixNQUF0QixJQUFnQyxDQUFwQyxFQUF1QyxPQUFPLEtBQVA7QUFDdkMsV0FBSyxrQkFBTDtBQUNBLFdBQUssVUFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7SUFHRyxlO0FBQ0osNkJBQWM7QUFBQTs7QUFDWixTQUFLLEdBQUwsR0FBVztBQUNULGlCQUFXLHFCQURGO0FBRVQsWUFBTSx3Q0FGRztBQUdULGFBQU8seUNBSEU7QUFJVCxnQkFBVSw2QkFKRDtBQUtULHlCQUFtQiwwQkFMVjtBQU1ULGdCQUFVLHNEQU5EO0FBT1Qsd0JBQWtCO0FBUFQsS0FBWDtBQVNBLFNBQUssY0FBTCxHQUFzQixJQUFJLGNBQUosRUFBdEI7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsRUFBRSxFQUFFLEtBQUssR0FBTCxDQUFTLFFBQVgsRUFBcUIsSUFBckIsRUFBRixDQUFoQjs7QUFFQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFwQjtBQUNBLFNBQUssaUJBQUwsR0FBeUIsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUF6QjtBQUNBLFNBQUssVUFBTCxHQUFrQixLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBbEI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDRDs7OzttQ0FFYztBQUFBOztBQUNiLGFBQU8sbUJBQVMsV0FBVCxHQUF1QixJQUF2QixDQUE0QixVQUFDLFFBQUQsRUFBYztBQUMvQyxZQUFJLFFBQVEsRUFBWjtBQUNBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxTQUFTLE1BQTdCLEVBQXFDLEdBQXJDLEVBQTBDO0FBQ3hDLGNBQUksVUFBVSxTQUFTLENBQVQsQ0FBZDtBQUNBLGdCQUFNLElBQU4sQ0FBVztBQUNULGtCQUFNLFFBQVEsSUFETDtBQUVULG1CQUFPLFFBQVEsS0FGTjtBQUdULHlCQUFhLFFBQVEsV0FIWjtBQUlULHNCQUFVO0FBQ1Isb0JBQU0sUUFBUSxZQUROO0FBRVIsb0JBQU0sUUFBUTtBQUZOLGFBSkQ7QUFRVCx3QkFBWSxRQUFRLFVBUlg7QUFTVCxvQkFBUTtBQUNOLHNCQUFRLFFBQVEsV0FEVjtBQUVOLHVCQUFTLFFBQVE7QUFGWCxhQVRDO0FBYVQscUJBQVMsUUFBUSxPQWJSO0FBY1QscUJBQVMsUUFBUTtBQWRSLFdBQVg7QUFnQkQ7QUFDRCxZQUFJLE1BQU0sTUFBTixHQUFlLENBQW5CLEVBQXNCO0FBQ3BCLFlBQUUsT0FBSyxHQUFMLENBQVMsSUFBWCxFQUFpQixJQUFqQixDQUFzQixPQUFLLGlCQUFMLENBQXVCLEtBQXZCLENBQXRCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsWUFBRSxPQUFLLEdBQUwsQ0FBUyxLQUFYLEVBQWtCLElBQWxCLENBQXVCLDRCQUF2QjtBQUNEO0FBQ0YsT0ExQk0sQ0FBUDtBQTJCRDs7O3NDQUVpQixLLEVBQU87QUFDdkIsVUFBSSxTQUFTLEVBQWI7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQztBQUNBLFlBQUksWUFBWSxLQUFLLFFBQUwsQ0FBYyxLQUFkLEVBQWhCO0FBQ0E7QUFDQSxZQUFJLE9BQU8sTUFBTSxDQUFOLENBQVg7QUFDQTtBQUNBLFlBQUksb0JBQW9CLEdBQXhCO0FBQ0E7QUFDQSxZQUFJLFVBQVUsS0FBSyxNQUFMLEdBQWMsUUFBZCxDQUF1QixFQUF2QixFQUEyQixNQUEzQixDQUFrQyxDQUFsQyxFQUFxQyxDQUFyQyxDQUFkO0FBQ0E7QUFDQSxrQkFBVSxJQUFWLENBQWUsZUFBZixFQUFnQyxJQUFoQyxDQUFxQyxJQUFyQyxFQUEyQyxPQUEzQztBQUNBO0FBQ0EsWUFBSSxLQUFLLE9BQVQsRUFBa0I7QUFDaEI7QUFDQSw4QkFBb0IsR0FBcEI7QUFDQTtBQUNBLG9CQUFVLElBQVYsQ0FBZSxlQUFmLEVBQWdDLFFBQWhDLENBQXlDLHFCQUF6QztBQUNEO0FBQ0Q7QUFDQSxZQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNoQjtBQUNBLG9CQUFVLElBQVYsQ0FBZSxlQUFmLEVBQWdDLFFBQWhDLENBQXlDLHFCQUF6QztBQUNEO0FBQ0Q7QUFDQSxrQkFBVSxJQUFWLENBQWUsc0JBQWYsRUFBdUMsSUFBdkMsQ0FBNEM7QUFDMUMsZ0JBQU0sS0FBSyxJQUQrQjtBQUUxQyxpQkFBTyxLQUFLO0FBRjhCLFNBQTVDLEVBR0csSUFISCxDQUdRLE9BSFIsRUFHaUIsMkJBQTJCLEtBQUssTUFBTCxDQUFZLE1BQXZDLEdBQWdELElBSGpFO0FBSUEsa0JBQVUsSUFBVixDQUFlLE9BQWYsRUFBd0IsQ0FBeEIsRUFBMkIsU0FBM0IsR0FBdUMsbUNBQW1DLGlCQUFuQyxHQUF1RCxPQUF2RCxHQUFpRSxPQUFqRSxHQUEyRSw4Q0FBM0UsR0FBNEgsS0FBSyxNQUFMLENBQVksT0FBeEksR0FBa0osaUJBQXpMO0FBQ0E7QUFDQSxrQkFBVSxJQUFWLENBQWUsNEJBQWYsRUFBNkMsSUFBN0MsQ0FBa0Q7QUFDaEQsZ0JBQU0sS0FBSyxJQURxQztBQUVoRCxpQkFBTyxLQUFLO0FBRm9DLFNBQWxEO0FBSUE7QUFDQSxrQkFBVSxJQUFWLENBQWUsc0JBQWYsRUFBdUMsSUFBdkMsQ0FBNEMsS0FBSyxLQUFqRDtBQUNBO0FBQ0Esa0JBQVUsSUFBVixDQUFlLDRCQUFmLEVBQTZDLElBQTdDLENBQWtELEtBQUssV0FBdkQ7QUFDQTtBQUNBLGtCQUFVLElBQVYsQ0FBZSx1Q0FBZixFQUF3RCxJQUF4RCxDQUE2RDtBQUMzRCxrQkFBUSxLQUFLLFFBQUwsQ0FBYyxJQURxQztBQUUzRCxtQkFBUyxLQUFLLFFBQUwsQ0FBYztBQUZvQyxTQUE3RCxFQUdHLElBSEgsQ0FHUSxLQUFLLFFBQUwsQ0FBYyxJQUh0QjtBQUlBO0FBQ0Esa0JBQVUsSUFBVixDQUFlLHNDQUFmLEVBQXVELElBQXZELENBQTREO0FBQzFELGtCQUFRLEtBQUssSUFENkM7QUFFMUQsbUJBQVMsS0FBSztBQUY0QyxTQUE1RCxFQUdHLElBSEgsQ0FHUSxLQUFLLFVBSGI7QUFJQTtBQUNBLGVBQU8sSUFBUCxDQUFZLFNBQVo7QUFDRDtBQUNELGFBQU8sTUFBUDtBQUNEOzs7aUNBRVk7QUFDWCxRQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsT0FBZixFQUF3QixLQUFLLEdBQUwsQ0FBUyxpQkFBakMsRUFBb0QsS0FBSyxVQUF6RDtBQUNBLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLEtBQUssR0FBTCxDQUFTLGdCQUFqQyxFQUFtRCxLQUFLLGFBQXhEO0FBQ0EsUUFBRSxLQUFLLEdBQUwsQ0FBUyxRQUFYLEVBQXFCLFdBQXJCLENBQWlDLEtBQUssV0FBdEM7QUFDRDs7OytCQUVVLEMsRUFBRztBQUNaLFFBQUUsY0FBRjtBQUNBLFFBQUUsS0FBSyxHQUFMLENBQVMsaUJBQVgsRUFBOEIsV0FBOUIsQ0FBMEMsa0NBQTFDO0FBQ0EsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLGlCQUFYLEVBQThCLFFBQTlCLENBQXVDLGtDQUF2QyxDQUFKLEVBQWdGO0FBQzlFLFVBQUUsS0FBSyxHQUFMLENBQVMsSUFBWCxFQUFpQixJQUFqQixDQUFzQixlQUF0QixFQUF1QyxRQUF2QyxDQUFnRCx5QkFBaEQ7QUFDRCxPQUZELE1BRU87QUFDTCxVQUFFLEtBQUssR0FBTCxDQUFTLElBQVgsRUFBaUIsSUFBakIsQ0FBc0IsZUFBdEIsRUFBdUMsV0FBdkMsQ0FBbUQseUJBQW5EO0FBQ0Q7QUFDRjs7O2tDQUVhLEMsRUFBRztBQUFBOztBQUNmLFFBQUUsY0FBRjtBQUNBLFVBQUksZ0JBQWdCLEVBQUUsRUFBRSxNQUFKLEVBQVksT0FBWixDQUFvQixlQUFwQixDQUFwQjtBQUNBLFVBQUksRUFBRSxFQUFFLE1BQUosRUFBWSxRQUFaLENBQXFCLGNBQXJCLENBQUosRUFBMEMsZ0JBQWdCLEVBQUUsRUFBRSxNQUFKLENBQWhCO0FBQzFDLFVBQUksTUFBTSxJQUFJLEdBQUosQ0FBUSxjQUFjLElBQWQsQ0FBbUIsc0JBQW5CLEVBQTJDLENBQTNDLEVBQThDLElBQXRELENBQVY7QUFDQSxXQUFLLGNBQUwsQ0FBb0IsUUFBcEIsQ0FBNkIsSUFBSSxRQUFqQyxFQUEyQyxJQUEzQyxDQUFnRCxZQUFNO0FBQ3BELHNCQUFjLE1BQWQsR0FBdUIsTUFBdkI7QUFDQSxZQUFJLEVBQUUsT0FBSyxHQUFMLENBQVMsSUFBWCxFQUFpQixJQUFqQixDQUFzQixlQUF0QixFQUF1QyxNQUF2QyxJQUFpRCxDQUFyRCxFQUF3RDtBQUN0RCxZQUFFLE9BQUssR0FBTCxDQUFTLElBQVgsRUFBaUIsTUFBakIsQ0FBd0IsMEZBQXhCO0FBQ0EsaUJBQUssVUFBTCxDQUFnQixFQUFDLGdCQUFnQiwwQkFBTSxDQUFFLENBQXpCLEVBQWhCO0FBQ0Q7QUFDRixPQU5EO0FBT0Q7OztnQ0FFVyxRLEVBQVUsTyxFQUFTO0FBQzdCO0FBQ0EsVUFBSSxjQUFjLEVBQUUsT0FBRixFQUFXLFFBQVgsQ0FBb0IseUJBQXBCLENBQWxCO0FBQ0EsVUFBSSxhQUFhLE1BQWIsSUFBdUIsQ0FBQyxXQUE1QixFQUF5QztBQUN2QyxVQUFFLHVDQUFGLEVBQTJDLFdBQTNDLENBQXVELHlCQUF2RDtBQUNBLFVBQUUsT0FBRixFQUFXLFFBQVgsQ0FBb0IseUJBQXBCO0FBQ0QsT0FIRCxNQUdPLElBQUksYUFBYSxPQUFiLElBQXdCLFdBQTVCLEVBQXlDO0FBQzlDLFVBQUUsT0FBRixFQUFXLFdBQVgsQ0FBdUIseUJBQXZCO0FBQ0Q7QUFDRjs7OzJCQUVNO0FBQUE7O0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxLQUFQO0FBQ3ZDLFdBQUssWUFBTCxHQUFvQixJQUFwQixDQUF5QixZQUFNO0FBQzdCLGVBQUssVUFBTDtBQUNELE9BRkQ7QUFHQSxhQUFPLElBQVA7QUFDRDs7Ozs7O0lBR0csTztBQUNKLHFCQUFjO0FBQUE7O0FBQ1osU0FBSyxjQUFMLEdBQXNCLElBQUksY0FBSixFQUF0QjtBQUNBLFNBQUssZUFBTCxHQUF1QixJQUFJLGVBQUosRUFBdkI7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQWhCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBakI7QUFDRDs7OztrQ0FFYTtBQUNaLFVBQUksVUFBVSxNQUFkLEVBQXNCO0FBQ3BCLGFBQUssUUFBTDtBQUNELE9BRkQsTUFFTztBQUNMLGFBQUssU0FBTDtBQUNEO0FBQ0Y7OzsrQkFFVTtBQUNULFFBQUUsTUFBRixFQUFVLFdBQVYsQ0FBc0IsU0FBdEI7QUFDQSxRQUFFLG9FQUFGLEVBQXdFLFVBQXhFLENBQW1GLFVBQW5GO0FBQ0Q7OztnQ0FFVztBQUNWLFFBQUUsTUFBRixFQUFVLFFBQVYsQ0FBbUIsU0FBbkI7QUFDQSxRQUFFLHNDQUFGLEVBQTBDLElBQTFDLENBQStDLFVBQS9DLEVBQTJELElBQTNEO0FBQ0Q7OztpQ0FFWTtBQUNYLGFBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBSyxRQUF2QztBQUNBLGFBQU8sZ0JBQVAsQ0FBd0IsU0FBeEIsRUFBbUMsS0FBSyxTQUF4QztBQUNEOzs7MkJBRU07QUFDTCxVQUFJLEVBQUUsWUFBWSxTQUFkLENBQUosRUFBOEIsT0FBTyxLQUFQO0FBQzlCLFdBQUssY0FBTCxDQUFvQixJQUFwQjtBQUNBLFdBQUssZUFBTCxDQUFxQixJQUFyQjtBQUNBLFdBQUssV0FBTDtBQUNBLFdBQUssVUFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7a0JBR1ksSUFBSSxPQUFKLEU7Ozs7Ozs7Ozs7Ozs7SUN0WVQsUTtBQUNKLHNCQUFjO0FBQUE7O0FBQ1osU0FBSyxHQUFMLEdBQVc7QUFDVCxpQkFBVyxrQkFERjtBQUVULGNBQVE7QUFGQyxLQUFYOztBQUtBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLEtBQUssZUFBTCxDQUFxQixJQUFyQixDQUEwQixJQUExQixDQUF2QjtBQUNEOzs7OzJCQUVNO0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxLQUFQO0FBQ3ZDLFdBQUssVUFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7aUNBRVk7QUFBQTs7QUFDWCxRQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsUUFBZixFQUF5QixLQUFLLEdBQUwsQ0FBUyxNQUFsQyxFQUEwQyxVQUFDLENBQUQsRUFBTztBQUMvQyxZQUFNLGlCQUFpQixFQUFFLEVBQUUsTUFBSixFQUFZLElBQVosQ0FBaUIsZUFBakIsQ0FBdkI7QUFDQSxjQUFLLGVBQUwsQ0FBcUIsY0FBckI7QUFDRCxPQUhEO0FBSUQ7OztvQ0FFZSxPLEVBQVM7QUFDdkIsVUFBTSxRQUFRLEVBQUUsTUFBTSxPQUFSLENBQWQ7QUFDQSxjQUFRLE1BQU0sSUFBTixDQUFXLE1BQVgsQ0FBUjtBQUNBLGFBQUssVUFBTDtBQUNFLGdCQUFNLElBQU4sQ0FBVyxNQUFYLEVBQW1CLE1BQW5CO0FBQ0E7O0FBRUY7QUFDQSxhQUFLLE1BQUw7QUFDRSxnQkFBTSxJQUFOLENBQVcsTUFBWCxFQUFtQixVQUFuQjtBQUNBO0FBUkY7QUFVRDs7Ozs7O2tCQUdZLElBQUksUUFBSixFOzs7Ozs7Ozs7Ozs7O0lDeENULG9CO0FBQ0osa0NBQWM7QUFBQTs7QUFDWixTQUFLLE1BQUwsR0FBYztBQUNaLGdCQUFVLCtCQURFO0FBRVosZ0JBQVUsMkNBRkU7QUFHWixrQkFBWSxzREFIQTtBQUlaLGdCQUFVO0FBSkUsS0FBZDs7QUFPQSxTQUFLLEdBQUwsR0FBVztBQUNULGlCQUFXO0FBREYsS0FBWDs7QUFJQSxTQUFLLGFBQUwsR0FBcUIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFwQjs7QUFFQSxTQUFLLFlBQUwsR0FBb0IsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCLENBQXBCO0FBQ0EsU0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNEOzs7O29DQUVlO0FBQ2QsVUFBTSxTQUFTLEVBQUUscUNBQUYsRUFBeUMsSUFBekMsQ0FBOEMsU0FBOUMsQ0FBZjtBQUNBLGFBQVEsU0FBUyxNQUFULEdBQWtCLEVBQTFCO0FBQ0Q7OztrQ0FFYTtBQUNaLFVBQU0sT0FBTyxFQUFFLG1DQUFGLEVBQXVDLElBQXZDLENBQTRDLFNBQTVDLENBQWI7QUFDQSxhQUFRLE9BQU8sSUFBUCxHQUFjLEVBQXRCO0FBQ0Q7OzsyQkFFTTtBQUNMLFVBQUksRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLE1BQXRCLElBQWdDLENBQXBDLEVBQXVDLE9BQU8sS0FBUDtBQUN2QyxXQUFLLFVBQUw7QUFDQSxhQUFPLElBQVA7QUFDRDs7O2lDQUVZO0FBQUE7O0FBQ1gsYUFBTyxTQUFQLENBQWlCLFNBQWpCLENBQTJCLFVBQTNCLEVBQXVDLFVBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDekQsZUFBTyxJQUFJLE1BQUosQ0FBVyxFQUFFLE9BQUYsRUFBVyxJQUFYLENBQWdCLFNBQWhCLENBQVgsRUFBdUMsSUFBdkMsQ0FBNEMsS0FBNUMsQ0FBUDtBQUNELE9BRkQsRUFFRyw4QkFGSDs7QUFJQSxhQUFPLFNBQVAsQ0FBaUIsU0FBakIsQ0FBMkIsU0FBM0IsRUFBc0MsVUFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUN4RCxlQUFRLEVBQUUsTUFBTSxFQUFFLE9BQUYsRUFBVyxJQUFYLENBQWdCLGNBQWhCLENBQVIsRUFBeUMsR0FBekMsT0FBbUQsRUFBRSxPQUFGLEVBQVcsR0FBWCxFQUEzRDtBQUNELE9BRkQsRUFFRyx3QkFGSDs7QUFJQSxVQUFJLGVBQWUsRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLENBQW5CO0FBQ0EsVUFBSSxhQUFhLE1BQWIsR0FBc0IsQ0FBMUIsRUFBNkI7QUFDM0IsWUFBSSxXQUFXLGFBQWEsSUFBYixDQUFrQixVQUFsQixDQUFmO0FBQ0EsWUFBSSxRQUFRLGFBQWEsSUFBYixDQUFrQixPQUFsQixDQUFaOztBQUVBLFlBQUssYUFBYSxJQUFiLElBQXFCLE9BQVEsUUFBUixLQUFzQixXQUEzQyxJQUEwRCxTQUFTLE1BQVQsR0FBa0IsQ0FBN0UsSUFBb0YsVUFBVSxJQUFWLElBQWtCLE9BQVEsS0FBUixLQUFtQixXQUFyQyxJQUFvRCxNQUFNLE1BQU4sR0FBZSxDQUEzSixFQUErSjtBQUM3Six1QkFBYSxJQUFiLENBQWtCLFNBQWxCLEVBQTZCLElBQTdCO0FBQ0EsdUJBQWEsSUFBYixDQUFrQixTQUFsQixFQUE2QixJQUE3QjtBQUNBLHVCQUFhLElBQWIsQ0FBa0IsU0FBbEIsRUFBNkIsSUFBN0I7QUFDRCxTQUpELE1BSU87QUFDTCx1QkFBYSxJQUFiLENBQWtCLFNBQWxCLEVBQTZCLElBQTdCO0FBQ0EsdUJBQWEsSUFBYixDQUFrQixTQUFsQixFQUE2QixJQUE3QjtBQUNBLHVCQUFhLElBQWIsQ0FBa0IsU0FBbEIsRUFBNkIsSUFBN0I7QUFDRDs7QUFFRCxxQkFBYSxJQUFiLENBQWtCLGNBQWxCLEVBQWtDLFFBQWxDLENBQTJDO0FBQ3pDLGlCQUFPO0FBQ0wsa0NBQXNCO0FBRGpCLFdBRGtDO0FBSXpDLDBCQUFnQix3QkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNsQyxnQkFBSSxRQUFRLElBQVIsQ0FBYSxNQUFiLE1BQXlCLFVBQTdCLEVBQXlDO0FBQ3ZDLG9CQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxHQUFvQixJQUFwQixDQUF5QixPQUF6QixDQUFsQjtBQUNELGFBRkQsTUFFTyxJQUFJLFFBQVEsSUFBUixDQUFhLE1BQWIsTUFBeUIsVUFBN0IsRUFBeUM7QUFDOUMsZ0JBQUUsT0FBRixFQUFXLE1BQVgsQ0FBa0IsS0FBbEI7QUFDQSxvQkFBTSxXQUFOLENBQWtCLEVBQUUsT0FBRixFQUFXLE1BQVgsRUFBbEI7QUFDRCxhQUhNLE1BR0EsSUFBSSxRQUFRLElBQVIsQ0FBYSxNQUFiLE1BQXlCLFFBQTdCLEVBQXVDO0FBQzVDLG9CQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxFQUFsQjtBQUNELGFBRk0sTUFFQTtBQUNMLG9CQUFNLFdBQU4sQ0FBa0IsT0FBbEI7QUFDRDtBQUNGLFdBZndDO0FBZ0J6Qyx5QkFBZSx1QkFBQyxJQUFELEVBQVU7QUFDdkIsa0JBQUssWUFBTCxDQUFrQixJQUFsQjtBQUNBLG1CQUFPLEtBQVA7QUFDRDtBQW5Cd0MsU0FBM0M7O0FBc0JBLHFCQUFhLElBQWIsQ0FBa0IsY0FBbEIsRUFBa0MsUUFBbEMsQ0FBMkM7QUFDekMsaUJBQU87QUFDTCxtQ0FBdUIsVUFEbEI7QUFFTCxvQ0FBd0I7QUFGbkIsV0FEa0M7QUFLekMsMEJBQWdCLHdCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ2xDLGdCQUFJLFFBQVEsSUFBUixDQUFhLE1BQWIsTUFBeUIsVUFBN0IsRUFBeUM7QUFDdkMsb0JBQU0sV0FBTixDQUFrQixFQUFFLE9BQUYsRUFBVyxNQUFYLEdBQW9CLElBQXBCLENBQXlCLE9BQXpCLENBQWxCO0FBQ0QsYUFGRCxNQUVPLElBQUksUUFBUSxJQUFSLENBQWEsTUFBYixNQUF5QixVQUE3QixFQUF5QztBQUM5QyxnQkFBRSxPQUFGLEVBQVcsTUFBWCxDQUFrQixLQUFsQjtBQUNBLG9CQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxFQUFsQjtBQUNELGFBSE0sTUFHQSxJQUFJLFFBQVEsSUFBUixDQUFhLE1BQWIsTUFBeUIsUUFBN0IsRUFBdUM7QUFDNUMsb0JBQU0sV0FBTixDQUFrQixFQUFFLE9BQUYsRUFBVyxNQUFYLEVBQWxCO0FBQ0QsYUFGTSxNQUVBO0FBQ0wsb0JBQU0sV0FBTixDQUFrQixPQUFsQjtBQUNEO0FBQ0YsV0FoQndDO0FBaUJ6Qyx5QkFBZSx1QkFBQyxJQUFELEVBQVU7QUFDdkIsa0JBQUssYUFBTCxDQUFtQixJQUFuQjtBQUNBLG1CQUFPLEtBQVA7QUFDRDtBQXBCd0MsU0FBM0M7QUFzQkQ7QUFDRjs7O2lDQUVZLEksRUFBTSxLLEVBQU8sYSxFQUFlO0FBQ3ZDLFVBQUksVUFBVSxFQUFkO0FBQ0EsVUFBSSxhQUFKLEVBQW1CO0FBQ2pCLFlBQUksT0FBTyxJQUFJLElBQUosRUFBWDtBQUNBLGFBQUssT0FBTCxDQUFhLEtBQUssT0FBTCxLQUFrQixnQkFBZ0IsSUFBL0M7QUFDQSxrQkFBVSxlQUFlLEtBQUssV0FBTCxFQUF6QjtBQUNEO0FBQ0QsZUFBUyxNQUFULEdBQWtCLE9BQU8sR0FBUCxHQUFhLEtBQWIsR0FBcUIsT0FBckIsR0FBK0IsVUFBakQ7QUFDRDs7O2lDQUVZLEksRUFBTTtBQUFBOztBQUNqQixVQUFJLE9BQU87QUFDVCxrQkFBVSxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsNEJBQWIsRUFBMkMsR0FBM0MsRUFERDtBQUVULGNBQU0sT0FBTyxRQUFQLENBQWdCO0FBRmIsT0FBWDs7QUFLQSxRQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsdUJBQWIsRUFBc0MsSUFBdEMsQ0FBMkMsZ0JBQTNDO0FBQ0EsUUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLHVCQUFiLEVBQXNDLEdBQXRDLENBQTBDLGdCQUExQztBQUNBLFFBQUUsR0FBRixDQUFNLEtBQUssYUFBTCxLQUF1QixLQUFLLE1BQUwsQ0FBWSxRQUF6QyxFQUFtRCxVQUFDLGFBQUQsRUFBbUI7QUFDcEUsWUFBSSxZQUFZLGNBQWMsS0FBOUI7QUFDQSxVQUFFLElBQUYsQ0FBTztBQUNMLGVBQUssT0FBSyxhQUFMLEtBQXVCLE9BQUssTUFBTCxDQUFZLFVBRG5DO0FBRUwsZ0JBQU0sSUFGRDtBQUdMLGdCQUFNLE1BSEQ7QUFJTCxtQkFBUyxFQUFFLGNBQWMsU0FBaEIsRUFKSjtBQUtMLG9CQUFVLE1BTEw7QUFNTCxtQkFBUyxpQkFBQyxRQUFELEVBQWM7QUFDckIsZ0JBQUksUUFBSixFQUFjO0FBQ1osa0JBQUksU0FBUyxNQUFULEtBQW9CLElBQXhCLEVBQThCO0FBQzVCLGtCQUFFLE9BQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsSUFBdEIsQ0FBMkIsU0FBM0IsRUFBc0MsSUFBdEM7QUFDQSxrQkFBRSxPQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLFNBQTNCLEVBQXNDLElBQXRDO0FBQ0QsZUFIRCxNQUdPO0FBQ0wsc0JBQU0sc0VBQXNFLFNBQVMsS0FBckY7QUFDRDtBQUNGLGFBUEQsTUFPTztBQUNMLG9CQUFNLGdHQUFOO0FBQ0Q7QUFDRCxjQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsdUJBQWIsRUFBc0MsSUFBdEMsQ0FBMkMsa0JBQTNDO0FBQ0EsY0FBRSxJQUFGLEVBQVEsSUFBUixDQUFhLHVCQUFiLEVBQXNDLEdBQXRDLENBQTBDLGtCQUExQztBQUNEO0FBbkJJLFNBQVA7QUFxQkQsT0F2QkQ7QUF3QkQ7OztrQ0FFYSxJLEVBQU07QUFBQTs7QUFDbEIsVUFBSSxXQUFXLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixVQUEzQixDQUFmO0FBQ0EsVUFBSSxRQUFRLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixPQUEzQixDQUFaO0FBQ0EsVUFBSSxXQUFXLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSw2QkFBYixFQUE0QyxHQUE1QyxFQUFmO0FBQ0EsVUFBSSxPQUFPO0FBQ1Qsa0JBQVUsUUFERDtBQUVULGVBQU8sS0FGRTtBQUdULGtCQUFVO0FBSEQsT0FBWDs7QUFNQSxRQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsdUJBQWIsRUFBc0MsSUFBdEMsQ0FBMkMsZ0JBQTNDO0FBQ0EsUUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLHVCQUFiLEVBQXNDLEdBQXRDLENBQTBDLGdCQUExQztBQUNBLFFBQUUsR0FBRixDQUFNLEtBQUssYUFBTCxLQUF1QixLQUFLLE1BQUwsQ0FBWSxRQUF6QyxFQUFtRCxVQUFDLGFBQUQsRUFBbUI7QUFDcEUsWUFBSSxZQUFZLGNBQWMsS0FBOUI7QUFDQSxVQUFFLElBQUYsQ0FBTztBQUNMLGVBQUssT0FBSyxhQUFMLEtBQXVCLE9BQUssTUFBTCxDQUFZLFFBRG5DO0FBRUwsZ0JBQU0sSUFGRDtBQUdMLGdCQUFNLE1BSEQ7QUFJTCxtQkFBUyxFQUFFLGNBQWMsU0FBaEIsRUFKSjtBQUtMLG9CQUFVLE1BTEw7QUFNTCxtQkFBUyxpQkFBQyxRQUFELEVBQWM7QUFDckIsZ0JBQUksUUFBSixFQUFjO0FBQ1osa0JBQUksU0FBUyxNQUFULEtBQW9CLElBQXhCLEVBQThCO0FBQzVCLGtCQUFFLEdBQUYsQ0FBTSxPQUFLLGFBQUwsS0FBdUIsT0FBSyxNQUFMLENBQVksUUFBekMsRUFBbUQsVUFBQyxpQkFBRCxFQUF1QjtBQUN4RSxzQkFBSSxnQkFBZ0Isa0JBQWtCLEtBQXRDOztBQUVBLG9CQUFFLElBQUYsQ0FBTztBQUNMLHlCQUFLLE9BQUssYUFBTCxLQUF1QixPQUFLLE1BQUwsQ0FBWSxRQURuQztBQUVMLDBCQUFNLEVBQUUsVUFBVSxRQUFaLEVBQXNCLFVBQVUsUUFBaEMsRUFGRDtBQUdMLDBCQUFNLE1BSEQ7QUFJTCw2QkFBUyxFQUFFLGNBQWMsYUFBaEIsRUFKSjtBQUtMLDhCQUFVLE1BTEw7QUFNTCw2QkFBUyxpQkFBQyxhQUFELEVBQW1CO0FBQzFCLDBCQUFJLGFBQUosRUFBbUI7QUFDakIsNEJBQUksY0FBYyxNQUFkLEtBQXlCLElBQTdCLEVBQW1DO0FBQ2pDLDRCQUFFLE1BQUYsRUFBVSxPQUFWLENBQWtCLHFCQUFsQixFQUF5QyxDQUFFLGFBQUYsRUFBaUIsSUFBakIsQ0FBekM7O0FBRUEsOEJBQUksVUFBVSxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsTUFBYixDQUFkO0FBQ0EsOEJBQUksRUFBRSxJQUFGLENBQU8sT0FBUCxFQUFnQixNQUFoQixLQUEyQixDQUEvQixFQUFrQztBQUNoQyxzQ0FBVSxPQUFLLFdBQUwsS0FBcUIsT0FBL0I7QUFDRDtBQUNELGlDQUFPLFFBQVAsR0FBa0IsT0FBbEI7QUFDRCx5QkFSRCxNQVFPO0FBQ0wsZ0NBQU0sa0ZBQWtGLFNBQVMsS0FBakc7QUFDRDtBQUNGLHVCQVpELE1BWU87QUFDTCw4QkFBTSw0R0FBTjtBQUNEO0FBQ0Qsd0JBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSx1QkFBYixFQUFzQyxJQUF0QyxDQUEyQyxRQUEzQztBQUNBLHdCQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsdUJBQWIsRUFBc0MsR0FBdEMsQ0FBMEMsUUFBMUM7QUFDRDtBQXhCSSxtQkFBUDtBQTBCRCxpQkE3QkQ7QUE4QkQsZUEvQkQsTUErQk87QUFDTCxzQkFBTSxzRUFBc0UsU0FBUyxLQUFyRjtBQUNEO0FBQ0YsYUFuQ0QsTUFtQ087QUFDTCxvQkFBTSxnR0FBTjtBQUNEO0FBQ0Y7QUE3Q0ksU0FBUDtBQStDRCxPQWpERDtBQWtERDs7Ozs7O2tCQUdZLElBQUksb0JBQUosRTs7Ozs7Ozs7Ozs7OztJQzNOVCxtQjtBQUNKLGlDQUFjO0FBQUE7O0FBQ1osU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssWUFBTCxHQUFvQixLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBcEI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssT0FBTCxHQUFlLEtBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsSUFBbEIsQ0FBZjtBQUNEOzs7OzRCQUVPLFEsRUFBVTtBQUNoQixVQUFNLGdCQUFnQixLQUFLLFdBQUwsQ0FBaUIsUUFBakIsQ0FBdEI7QUFDQSxVQUFNLGdCQUFnQixLQUFLLFdBQUwsQ0FBaUIsUUFBakIsQ0FBdEI7QUFDQSxVQUFNLGlCQUFpQixLQUFLLFlBQUwsQ0FBa0IsUUFBbEIsQ0FBdkI7QUFDQSxVQUFNLGdCQUFnQixLQUFLLFdBQUwsQ0FBaUIsUUFBakIsQ0FBdEI7O0FBRUEsVUFBTSxTQUFTO0FBQ2IsaUJBQVMsaUJBQWlCLGFBQWpCLElBQWtDLGNBQWxDLElBQW9ELGFBRGhEO0FBRWIsb0NBRmE7QUFHYixvQ0FIYTtBQUliLHNDQUphO0FBS2I7QUFMYSxPQUFmOztBQVFBLGFBQU8sTUFBUDtBQUNEOzs7Z0NBRVcsUSxFQUFVO0FBQ3BCLGFBQU8sU0FBUyxNQUFULElBQW1CLENBQTFCO0FBQ0Q7OztnQ0FFVyxRLEVBQVU7QUFDcEIsYUFBTyxtQkFBa0IsSUFBbEIsQ0FBdUIsUUFBdkIsS0FBb0Msa0JBQWtCLElBQWxCLENBQXVCLFFBQXZCO0FBQTNDO0FBQ0Q7OztnQ0FFVyxRLEVBQVU7QUFDcEIsYUFBTyxtQkFBa0IsSUFBbEIsQ0FBdUIsUUFBdkI7QUFBUDtBQUNEOzs7aUNBRVksUSxFQUFVO0FBQ3JCLGFBQU8sOEJBQTZCLElBQTdCLENBQWtDLFFBQWxDO0FBQVA7QUFDRDs7Ozs7O0FBSUg7QUFDQTtBQUNBOzs7SUFDTSxnQjtBQUNKLDhCQUFjO0FBQUE7O0FBQ1osU0FBSyxHQUFMLEdBQVc7QUFDVCxpQkFBVztBQURGLEtBQVg7O0FBSUEsU0FBSyxXQUFMLEdBQW1CLElBQUksbUJBQUosRUFBbkI7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixDQUFsQjtBQUNEOzs7OzJCQUVNO0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxLQUFQO0FBQ3ZDLFdBQUssVUFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7aUNBRVk7QUFBQTs7QUFDWCxVQUFNLGtCQUFrQixFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsSUFBdEIsQ0FBMkIsZUFBM0IsQ0FBeEI7QUFDQSxVQUFNLGdCQUFnQixFQUFFLE1BQU0sZUFBUixDQUF0Qjs7QUFFQSxRQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsdUJBQWYsRUFBd0MsTUFBTSxlQUE5QyxFQUErRCxZQUFNO0FBQ25FLFlBQUksV0FBVyxjQUFjLEdBQWQsRUFBZjtBQUNBLGNBQUsscUJBQUwsQ0FBMkIsUUFBM0I7QUFDRCxPQUhEO0FBSUQ7OztvQ0FFZSxRLEVBQVU7QUFDeEIsVUFBSSxTQUFTLEtBQUssV0FBTCxDQUFpQixPQUFqQixDQUF5QixRQUF6QixDQUFiO0FBQ0EsYUFBTyxPQUFPLE9BQWQ7QUFDRDs7OzBDQUVxQixRLEVBQVU7QUFDOUIsVUFBSSxTQUFTLEtBQUssV0FBTCxDQUFpQixPQUFqQixDQUF5QixRQUF6QixDQUFiOztBQUVBLFVBQUksT0FBTyxhQUFYLEVBQTBCO0FBQ3hCLFVBQUUscUJBQUYsRUFBeUIsUUFBekIsQ0FBa0MsVUFBbEM7QUFDRCxPQUZELE1BRU87QUFDTCxVQUFFLHFCQUFGLEVBQXlCLFdBQXpCLENBQXFDLFVBQXJDO0FBQ0Q7O0FBRUQsVUFBSSxPQUFPLGFBQVgsRUFBMEI7QUFDeEIsVUFBRSxxQkFBRixFQUF5QixRQUF6QixDQUFrQyxVQUFsQztBQUNELE9BRkQsTUFFTztBQUNMLFVBQUUscUJBQUYsRUFBeUIsV0FBekIsQ0FBcUMsVUFBckM7QUFDRDs7QUFFRCxVQUFJLE9BQU8sY0FBWCxFQUEyQjtBQUN6QixVQUFFLHNCQUFGLEVBQTBCLFFBQTFCLENBQW1DLFVBQW5DO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsVUFBRSxzQkFBRixFQUEwQixXQUExQixDQUFzQyxVQUF0QztBQUNEOztBQUVELFVBQUksT0FBTyxhQUFYLEVBQTBCO0FBQ3hCLFVBQUUscUJBQUYsRUFBeUIsUUFBekIsQ0FBa0MsVUFBbEM7QUFDRCxPQUZELE1BRU87QUFDTCxVQUFFLHFCQUFGLEVBQXlCLFdBQXpCLENBQXFDLFVBQXJDO0FBQ0Q7QUFDRjs7Ozs7O2tCQUdZLElBQUksZ0JBQUosRTs7Ozs7Ozs7Ozs7OztJQzVHVCxZO0FBQ0osMEJBQWM7QUFBQTs7QUFDWixTQUFLLE1BQUwsR0FBYztBQUNaLGVBQVMsa0JBREc7QUFFWixrQkFBWSwwRUFGQTs7QUFJWixnQkFBVSwrQkFKRTtBQUtaLHVCQUFpQixtREFMTDtBQU1aLG1CQUFhLDhDQU5EO0FBT1osMkJBQXFCO0FBUFQsS0FBZDs7QUFVQSxTQUFLLEdBQUwsR0FBVztBQUNULGlCQUFXLHdDQURGO0FBRVQsc0JBQWdCLHdCQUZQO0FBR1Qsc0JBQWdCLHdCQUhQO0FBSVQsd0JBQWtCO0FBSlQsS0FBWDs7QUFPQSxTQUFLLGFBQUwsR0FBcUIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBaEI7O0FBRUEsU0FBSyxtQkFBTCxHQUEyQixLQUFLLG1CQUFMLENBQXlCLElBQXpCLENBQThCLElBQTlCLENBQTNCO0FBQ0EsU0FBSyxtQkFBTCxHQUEyQixLQUFLLG1CQUFMLENBQXlCLElBQXpCLENBQThCLElBQTlCLENBQTNCO0FBQ0EsU0FBSyxpQkFBTCxHQUF5QixLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQXpCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjs7QUFFQSxTQUFLLGVBQUwsR0FBdUIsS0FBSyxlQUFMLENBQXFCLElBQXJCLENBQTBCLElBQTFCLENBQXZCO0FBQ0Q7Ozs7b0NBRWU7QUFDZCxVQUFNLFNBQVMsRUFBRSxxQ0FBRixFQUF5QyxJQUF6QyxDQUE4QyxTQUE5QyxDQUFmO0FBQ0EsYUFBUSxTQUFTLE1BQVQsR0FBa0IsRUFBMUI7QUFDRDs7O2tDQUVhO0FBQ1osVUFBTSxPQUFPLEVBQUUsbUNBQUYsRUFBdUMsSUFBdkMsQ0FBNEMsU0FBNUMsQ0FBYjtBQUNBLGFBQVEsT0FBTyxJQUFQLEdBQWMsRUFBdEI7QUFDRDs7OzJCQUVNO0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxLQUFQO0FBQ3ZDLFdBQUssVUFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7K0JBRVUsSSxFQUFNO0FBQ2YsVUFBSSxTQUFTLE9BQU8sR0FBcEI7QUFDQSxVQUFJLEtBQUssU0FBUyxNQUFULENBQWdCLEtBQWhCLENBQXNCLEdBQXRCLENBQVQ7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksR0FBRyxNQUF2QixFQUErQixHQUEvQixFQUFvQztBQUNsQyxZQUFJLElBQUksR0FBRyxDQUFILENBQVI7QUFDQSxlQUFPLEVBQUUsTUFBRixDQUFTLENBQVQsTUFBZ0IsR0FBdkI7QUFBNEIsY0FBSSxFQUFFLFNBQUYsQ0FBWSxDQUFaLEVBQWUsRUFBRSxNQUFqQixDQUFKO0FBQTVCLFNBQ0EsSUFBSSxFQUFFLE9BQUYsQ0FBVSxNQUFWLE1BQXNCLENBQTFCLEVBQTZCLE9BQU8sRUFBRSxTQUFGLENBQVksT0FBTyxNQUFuQixFQUEyQixFQUFFLE1BQTdCLENBQVA7QUFDOUI7O0FBRUQsYUFBTyxJQUFQO0FBQ0Q7OztpQ0FFWTtBQUFBOztBQUNYLFFBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxrQkFBYixFQUFpQyxZQUFNO0FBQ3JDLGNBQUssUUFBTDtBQUNELE9BRkQ7O0FBSUEsYUFBTyxTQUFQLENBQWlCLFNBQWpCLENBQTJCLFVBQTNCLEVBQXVDLFVBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDekQsWUFBSSxFQUFFLElBQUYsQ0FBTyxLQUFQLEVBQWMsTUFBZCxLQUF5QixDQUE3QixFQUFnQyxPQUFPLElBQVA7QUFDaEMsZUFBTyxJQUFJLE1BQUosQ0FBVyxFQUFFLE9BQUYsRUFBVyxJQUFYLENBQWdCLFNBQWhCLENBQVgsRUFBdUMsSUFBdkMsQ0FBNEMsS0FBNUMsQ0FBUDtBQUNELE9BSEQsRUFHRyw4QkFISDs7QUFLQSxhQUFPLFNBQVAsQ0FBaUIsU0FBakIsQ0FBMkIsU0FBM0IsRUFBc0MsVUFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUN4RCxlQUFRLEVBQUUsTUFBTSxFQUFFLE9BQUYsRUFBVyxJQUFYLENBQWdCLGNBQWhCLENBQVIsRUFBeUMsR0FBekMsT0FBbUQsRUFBRSxPQUFGLEVBQVcsR0FBWCxFQUEzRDtBQUNELE9BRkQsRUFFRyx3QkFGSDs7QUFJQSxVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixLQUFLLEdBQUwsQ0FBUyxjQUFwQyxFQUFvRCxNQUFwRCxHQUE2RCxDQUFqRSxFQUFvRTtBQUNsRSxlQUFPLFdBQVAsR0FBcUIsWUFBTTtBQUN6QixpQkFBTyxXQUFQLEdBQXFCLFlBQVksWUFBTTtBQUNyQyxnQkFBSSxPQUFRLE9BQU8sRUFBZixLQUF1QixXQUF2QixJQUFzQyxPQUFPLEVBQVAsS0FBYyxJQUF4RCxFQUE4RDtBQUM1RCxxQkFBTyxFQUFQLENBQVUsSUFBVixDQUFlO0FBQ2IsdUJBQU8sTUFBSyxNQUFMLENBQVksT0FETjtBQUViLHdCQUFRLElBRks7QUFHYix1QkFBTyxJQUhNO0FBSWIseUJBQVM7QUFKSSxlQUFmOztBQU9BLDRCQUFjLE9BQU8sV0FBckI7QUFDRDtBQUNGLFdBWG9CLEVBV2xCLEdBWGtCLENBQXJCO0FBWUQsU0FiRDs7QUFlQSxZQUFJLFNBQVMsY0FBVCxDQUF3QixnQkFBeEIsTUFBOEMsSUFBbEQsRUFBd0Q7QUFDdEQsY0FBSSxNQUFNLFNBQVMsb0JBQVQsQ0FBOEIsUUFBOUIsRUFBd0MsQ0FBeEMsQ0FBVjtBQUNBLGNBQUksS0FBSyxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBVDtBQUNBLGFBQUcsRUFBSCxHQUFRLGdCQUFSO0FBQ0EsYUFBRyxHQUFILEdBQVMscUNBQVQ7QUFDQSxjQUFJLFVBQUosQ0FBZSxZQUFmLENBQTRCLEVBQTVCLEVBQWdDLEdBQWhDO0FBQ0Q7QUFDRCxVQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsSUFBdEIsQ0FBMkIsS0FBSyxHQUFMLENBQVMsY0FBcEMsRUFBb0QsRUFBcEQsQ0FBdUQsT0FBdkQsRUFBZ0UsVUFBQyxHQUFELEVBQVM7QUFDdkUsZ0JBQUssbUJBQUwsQ0FBeUIsR0FBekI7QUFDQSxpQkFBTyxLQUFQO0FBQ0QsU0FIRDtBQUlEOztBQUVELFVBQUksRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLEtBQUssR0FBTCxDQUFTLGNBQXBDLEVBQW9ELE1BQXBELEdBQTZELENBQWpFLEVBQW9FO0FBQ2xFLFVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixLQUFLLEdBQUwsQ0FBUyxjQUFwQyxFQUFvRCxFQUFwRCxDQUF1RCxPQUF2RCxFQUFnRSxVQUFDLEdBQUQsRUFBUztBQUN2RSxnQkFBSyxtQkFBTCxDQUF5QixHQUF6QjtBQUNBLGlCQUFPLEtBQVA7QUFDRCxTQUhEO0FBSUQ7O0FBRUQsVUFBSSxlQUFlLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixLQUFLLEdBQUwsQ0FBUyxnQkFBcEMsQ0FBbkI7QUFDQSxVQUFJLGFBQWEsTUFBYixHQUFzQixDQUExQixFQUE2QjtBQUMzQixlQUFPLFdBQVAsR0FBcUIsWUFBWSxZQUFNO0FBQ3JDLGNBQUksT0FBUSxPQUFPLElBQWYsS0FBeUIsV0FBekIsSUFBd0MsT0FBTyxJQUFQLEtBQWdCLElBQTVELEVBQWtFO0FBQ2hFLG1CQUFPLElBQVAsQ0FBWSxJQUFaLENBQWlCLE9BQWpCLEVBQTBCLFlBQU07QUFDOUIsa0JBQUksUUFBUSxPQUFPLElBQVAsQ0FBWSxLQUFaLENBQWtCLElBQWxCLENBQXVCO0FBQ2pDLDJCQUFXLE1BQUssTUFBTCxDQUFZLFVBRFU7QUFFakMsOEJBQWM7QUFGbUIsZUFBdkIsQ0FBWjs7QUFLQSxrQkFBSSxVQUFVLGFBQWEsR0FBYixDQUFpQixDQUFqQixDQUFkO0FBQ0Esb0JBQU0sa0JBQU4sQ0FBeUIsT0FBekIsRUFBa0MsRUFBbEMsRUFDRSxVQUFDLFVBQUQsRUFBZ0I7QUFDZCxzQkFBSyxpQkFBTCxDQUF1QixVQUF2QjtBQUNBLHVCQUFPLEtBQVA7QUFDRCxlQUpILEVBS0UsVUFBQyxNQUFELEVBQVk7QUFDVixvQkFBSSxPQUFPLEtBQVAsS0FBaUIsc0JBQXJCLEVBQTZDO0FBQzNDLHdCQUFNLE9BQU8sS0FBYjtBQUNEO0FBQ0YsZUFUSDtBQVdELGFBbEJEOztBQW9CQSwwQkFBYyxPQUFPLFdBQXJCO0FBQ0Q7QUFDRixTQXhCb0IsRUF3QmxCLEdBeEJrQixDQUFyQjs7QUEwQkEsVUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLEtBQUssR0FBTCxDQUFTLGdCQUFwQyxFQUFzRCxFQUF0RCxDQUF5RCxPQUF6RCxFQUFrRSxVQUFDLEdBQUQsRUFBUztBQUN6RSxjQUFJLGNBQUo7QUFDQSxpQkFBTyxLQUFQO0FBQ0QsU0FIRDtBQUlEOztBQUVELFFBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQiwrQ0FBM0IsRUFBNEUsUUFBNUUsQ0FBcUY7QUFDbkYsZUFBTztBQUNMLDJCQUFpQixPQURaO0FBRUwsK0JBQXFCO0FBRmhCLFNBRDRFO0FBS25GLHdCQUFnQix3QkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNsQyxjQUFJLFFBQVEsSUFBUixDQUFhLE1BQWIsTUFBeUIsVUFBN0IsRUFBeUM7QUFDdkMsa0JBQU0sV0FBTixDQUFrQixFQUFFLE9BQUYsRUFBVyxNQUFYLEdBQW9CLElBQXBCLENBQXlCLE9BQXpCLENBQWxCO0FBQ0QsV0FGRCxNQUVPLElBQUksUUFBUSxJQUFSLENBQWEsTUFBYixNQUF5QixVQUE3QixFQUF5QztBQUM5QyxjQUFFLE9BQUYsRUFBVyxNQUFYLENBQWtCLEtBQWxCO0FBQ0Esa0JBQU0sV0FBTixDQUFrQixFQUFFLE9BQUYsRUFBVyxNQUFYLEVBQWxCO0FBQ0QsV0FITSxNQUdBLElBQUksUUFBUSxJQUFSLENBQWEsTUFBYixNQUF5QixRQUE3QixFQUF1QztBQUM1QyxrQkFBTSxXQUFOLENBQWtCLEVBQUUsT0FBRixFQUFXLE1BQVgsRUFBbEI7QUFDRCxXQUZNLE1BRUE7QUFDTCxrQkFBTSxXQUFOLENBQWtCLE9BQWxCO0FBQ0Q7QUFDRixTQWhCa0Y7QUFpQm5GLHVCQUFlLHVCQUFDLElBQUQsRUFBVTtBQUN2QixnQkFBSyxXQUFMLENBQWlCLElBQWpCO0FBQ0EsaUJBQU8sS0FBUDtBQUNEO0FBcEJrRixPQUFyRjs7QUF1QkEsUUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLGdEQUEzQixFQUE2RSxFQUE3RSxDQUFnRixPQUFoRixFQUF5RixVQUFDLEdBQUQsRUFBUztBQUNoRyxZQUFJLGNBQUo7QUFDQSxjQUFLLG9CQUFMLENBQTBCLEdBQTFCO0FBQ0EsZUFBTyxLQUFQO0FBQ0QsT0FKRDtBQUtEOzs7d0NBRW1CLEcsRUFBSztBQUFBOztBQUN2QixVQUFJLGNBQUo7O0FBRUEsUUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLEtBQUssR0FBTCxDQUFTLGNBQXBDLEVBQW9ELElBQXBELENBQXlELGdCQUF6RDs7QUFFQSxhQUFPLEVBQVAsQ0FBVSxLQUFWLENBQWdCLFVBQUMsYUFBRCxFQUFtQjtBQUNqQyxZQUFJLGNBQWMsWUFBbEIsRUFBZ0M7QUFDOUIsaUJBQU8sRUFBUCxDQUFVLEdBQVYsQ0FBYyxLQUFkLEVBQXFCLFVBQUMsWUFBRCxFQUFrQjtBQUNyQyxnQkFBSSxPQUFPO0FBQ1QseUJBQVcsYUFBYSxVQURmO0FBRVQsd0JBQVUsYUFBYSxTQUZkO0FBR1Qsd0JBQVUsYUFBYSxLQUhkO0FBSVQsd0JBQVUsYUFBYSxFQUpkO0FBS1QsMEJBQVksTUFMSDtBQU1ULHVCQUFTO0FBTkEsYUFBWDs7QUFTQSxtQkFBSyxlQUFMLENBQXFCLElBQXJCLEVBQTJCLFlBQU07QUFDL0IsZ0JBQUUsT0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixPQUFLLEdBQUwsQ0FBUyxjQUFwQyxFQUFvRCxJQUFwRCxDQUF5RCxVQUF6RDtBQUNELGFBRkQ7QUFHRCxXQWJELEVBYUcsRUFBRSxRQUFRLENBQUUsSUFBRixFQUFRLE9BQVIsRUFBaUIsWUFBakIsRUFBK0IsV0FBL0IsQ0FBVixFQWJIO0FBY0Q7QUFDRCxlQUFPLEtBQVA7QUFDRCxPQWxCRCxFQWtCRyxFQUFFLE9BQU8sc0JBQVQsRUFBaUMsZUFBZSxJQUFoRCxFQWxCSDtBQW1CRDs7O3dDQUVtQixHLEVBQUs7QUFBQTs7QUFDdkIsVUFBSSxjQUFKOztBQUVBLFFBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixLQUFLLEdBQUwsQ0FBUyxjQUFwQyxFQUFvRCxJQUFwRCxDQUF5RCxnQkFBekQ7O0FBRUEsU0FBRyxJQUFILENBQVEsU0FBUixDQUFrQixZQUFNO0FBQ3RCLFdBQUcsR0FBSCxDQUFPLE9BQVAsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLENBQTRCLElBQTVCLEVBQWtDLFlBQWxDLEVBQWdELFdBQWhELEVBQTZELGVBQTdELEVBQThFLE1BQTlFLENBQXFGLFVBQUMsTUFBRCxFQUFZO0FBQy9GLGNBQUksU0FBUyxPQUFPLE1BQVAsQ0FBYyxDQUFkLENBQWI7O0FBRUEsY0FBSSxPQUFPO0FBQ1QsdUJBQVcsT0FBTyxTQURUO0FBRVQsc0JBQVUsT0FBTyxRQUZSO0FBR1Qsc0JBQVUsT0FBTyxZQUhSO0FBSVQsc0JBQVUsT0FBTyxFQUpSO0FBS1Qsd0JBQVksTUFMSDtBQU1ULHFCQUFTO0FBTkEsV0FBWDs7QUFTQSxpQkFBSyxlQUFMLENBQXFCLElBQXJCLEVBQTJCLFlBQU07QUFDL0IsY0FBRSxPQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLE9BQUssR0FBTCxDQUFTLGNBQXBDLEVBQW9ELElBQXBELENBQXlELFVBQXpEO0FBQ0QsV0FGRDtBQUdELFNBZkQ7QUFnQkQsT0FqQkQ7O0FBbUJBLGtCQUFZLFlBQU07QUFDaEIsWUFBSSxTQUFTLE9BQU8sRUFBUCxDQUFVLElBQVYsQ0FBZSxZQUFmLEVBQWI7QUFDQSxZQUFJLE1BQUosRUFBWTtBQUNWLGFBQUcsR0FBSCxDQUFPLE9BQVAsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLENBQTRCLElBQTVCLEVBQWtDLFlBQWxDLEVBQWdELFdBQWhELEVBQTZELGVBQTdELEVBQThFLE1BQTlFLENBQXFGLFVBQUMsTUFBRCxFQUFZO0FBQy9GLGdCQUFJLFNBQVMsT0FBTyxNQUFQLENBQWMsQ0FBZCxDQUFiOztBQUVBLGdCQUFJLE9BQU87QUFDVCx5QkFBVyxPQUFPLFNBRFQ7QUFFVCx3QkFBVSxPQUFPLFFBRlI7QUFHVCx3QkFBVSxPQUFPLFlBSFI7QUFJVCx3QkFBVSxPQUFPLEVBSlI7QUFLVCwwQkFBWSxNQUxIO0FBTVQsdUJBQVM7QUFOQSxhQUFYOztBQVNBLG1CQUFLLGVBQUwsQ0FBcUIsSUFBckIsRUFBMkIsWUFBTTtBQUMvQixnQkFBRSxPQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLE9BQUssR0FBTCxDQUFTLGNBQXBDLEVBQW9ELElBQXBELENBQXlELFVBQXpEO0FBQ0QsYUFGRDtBQUdELFdBZkQ7QUFnQkQ7QUFDRixPQXBCRCxFQW9CRyxJQXBCSDtBQXFCQSxhQUFPLEtBQVA7QUFDRDs7O3NDQUVpQixVLEVBQVk7QUFBQTs7QUFDNUIsVUFBSSxlQUFlLFdBQVcsZUFBWCxFQUFuQjs7QUFFQSxVQUFJLE9BQU87QUFDVCxtQkFBVyxhQUFhLFlBQWIsRUFERjtBQUVULGtCQUFVLGFBQWEsYUFBYixFQUZEO0FBR1Qsa0JBQVUsYUFBYSxRQUFiLEVBSEQ7QUFJVCxrQkFBVSxhQUFhLEtBQWIsRUFKRDtBQUtULG9CQUFZLE1BTEg7QUFNVCxpQkFBUztBQU5BLE9BQVg7O0FBU0EsUUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLEtBQUssR0FBTCxDQUFTLGdCQUFwQyxFQUFzRCxJQUF0RCxDQUEyRCxnQkFBM0Q7QUFDQSxXQUFLLGVBQUwsQ0FBcUIsSUFBckIsRUFBMkIsWUFBTTtBQUMvQixVQUFFLE9BQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsSUFBdEIsQ0FBMkIsT0FBSyxHQUFMLENBQVMsZ0JBQXBDLEVBQXNELElBQXRELENBQTJELFNBQTNEO0FBQ0QsT0FGRDtBQUdEOzs7Z0NBRVcsSSxFQUFNO0FBQ2hCLFVBQUksTUFBTSxFQUFFLElBQUYsQ0FBVjtBQUNBLFVBQUksT0FBTztBQUNULG1CQUFXLElBQUksSUFBSixDQUFTLDJCQUFULEVBQXNDLEdBQXRDLEVBREY7QUFFVCxrQkFBVSxJQUFJLElBQUosQ0FBUywwQkFBVCxFQUFxQyxHQUFyQyxFQUZEO0FBR1Qsa0JBQVUsSUFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsR0FBbEMsRUFIRDtBQUlULGtCQUFVLElBQUksSUFBSixDQUFTLDJCQUFULEVBQXNDLEdBQXRDLEVBSkQ7O0FBTVQsb0JBQVksT0FOSDtBQU9ULGlCQUFTLElBQUksSUFBSixDQUFTLGtCQUFULEVBQTZCLEVBQTdCLENBQWdDLFVBQWhDO0FBUEEsT0FBWDs7QUFVQSxVQUFLLEVBQUUsSUFBRixDQUFPLEtBQUssU0FBWixFQUF1QixNQUF2QixLQUFrQyxDQUFuQyxJQUEwQyxFQUFFLElBQUYsQ0FBTyxLQUFLLFFBQVosRUFBc0IsTUFBdEIsS0FBaUMsQ0FBM0UsSUFBa0YsRUFBRSxJQUFGLENBQU8sS0FBSyxRQUFaLEVBQXNCLE1BQXRCLEtBQWlDLENBQXZILEVBQTJIO0FBQ3pILGNBQU0sMkNBQU47QUFDRCxPQUZELE1BRU87QUFDTCxZQUFJLElBQUosQ0FBUyx1QkFBVCxFQUFrQyxJQUFsQyxDQUF1QyxnQkFBdkM7QUFDQSxZQUFJLElBQUosQ0FBUyx1QkFBVCxFQUFrQyxHQUFsQyxDQUFzQyxnQkFBdEM7O0FBRUEsYUFBSyxlQUFMLENBQXFCLElBQXJCLEVBQTJCLFlBQU07QUFDL0IsY0FBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsSUFBbEMsQ0FBdUMsUUFBdkM7QUFDQSxjQUFJLElBQUosQ0FBUyx1QkFBVCxFQUFrQyxHQUFsQyxDQUFzQyxRQUF0QztBQUNELFNBSEQ7QUFJRDs7QUFFRCxhQUFPLEtBQVA7QUFDRDs7O29DQUVlLEksRUFBTSxjLEVBQWdCO0FBQUE7O0FBQ3BDLFFBQUUsR0FBRixDQUFNLEtBQUssYUFBTCxLQUF1QixLQUFLLE1BQUwsQ0FBWSxRQUF6QyxFQUFtRCxVQUFDLGFBQUQsRUFBbUI7QUFDcEUsWUFBSSxZQUFZLGNBQWMsS0FBOUI7O0FBRUEsVUFBRSxJQUFGLENBQU87QUFDTCxlQUFLLE9BQUssYUFBTCxLQUF1QixPQUFLLE1BQUwsQ0FBWSxXQURuQztBQUVMLGdCQUFNLElBRkQ7QUFHTCxnQkFBTSxNQUhEO0FBSUwsbUJBQVMsRUFBRSxjQUFjLFNBQWhCLEVBSko7QUFLTCxvQkFBVSxNQUxMO0FBTUwsbUJBQVMsaUJBQUMsUUFBRCxFQUFjO0FBQ3JCLGdCQUFJLFFBQUosRUFBYztBQUNaLGtCQUFJLE1BQU0sRUFBRSx3Q0FBRixFQUE0QyxJQUE1QyxDQUFpRCxNQUFqRCxDQUFWOztBQUVBLGtCQUFJLFNBQVMsTUFBVCxLQUFvQixJQUF4QixFQUE4QjtBQUM1QixrQkFBRSxNQUFGLEVBQVUsT0FBVixDQUFrQixxQkFBbEIsRUFBeUMsQ0FBRSxRQUFGLEVBQVksSUFBWixDQUF6Qzs7QUFFQSx1QkFBTyxTQUFQLEdBQW1CLE9BQU8sU0FBUCxJQUFvQixFQUF2QztBQUNBLHVCQUFPLFNBQVAsQ0FBaUIsSUFBakIsQ0FBc0I7QUFDcEIsMkJBQVM7QUFEVyxpQkFBdEI7O0FBSUEsb0JBQUssSUFBSSxPQUFKLENBQVksV0FBWixFQUF5QixNQUF6QixHQUFrQyxDQUFuQyxJQUEwQyxJQUFJLE9BQUosQ0FBWSxRQUFaLEVBQXNCLE1BQXRCLEdBQStCLENBQTdFLEVBQWlGO0FBQy9FLDJCQUFTLE1BQVQ7QUFDQTtBQUNEOztBQUVELG9CQUFJLFFBQVEsRUFBRSwrQkFBRixFQUFtQyxJQUFuQyxDQUF3QyxRQUF4QyxDQUFaO0FBQ0Esb0JBQUksb0JBQW9CLEVBQUUsT0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQiwwQkFBM0IsQ0FBeEI7QUFDQSxvQkFBSSxNQUFNLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUNwQix3QkFBTSxJQUFOLENBQVcsY0FBWCxFQUEyQixJQUEzQixDQUFnQyxLQUFLLFNBQXJDO0FBQ0Esd0JBQU0sSUFBTixDQUFXLFFBQVgsRUFBcUIsRUFBckIsQ0FBd0IsT0FBeEIsRUFBaUMsWUFBTTtBQUNyQyx3QkFBSSxVQUFVLElBQUksSUFBSixDQUFTLE1BQVQsQ0FBZDtBQUNBLHdCQUFJLEVBQUUsSUFBRixDQUFPLE9BQVAsRUFBZ0IsTUFBaEIsS0FBMkIsQ0FBL0IsRUFBa0M7QUFDaEMsK0JBQVMsTUFBVDtBQUNELHFCQUZELE1BRU87QUFDTCw2QkFBTyxRQUFQLEdBQWtCLE9BQWxCO0FBQ0Q7QUFDRixtQkFQRDs7QUFTQSx3QkFBTSxLQUFOLENBQVksTUFBWjtBQUNELGlCQVpELE1BWU8sSUFBSSxrQkFBa0IsTUFBbEIsR0FBMkIsQ0FBL0IsRUFBa0M7QUFDdkMsb0JBQUUsT0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixxQkFBM0IsRUFBa0QsSUFBbEQ7O0FBRUEsb0NBQWtCLElBQWxCLENBQXVCLGVBQXZCLEVBQXdDLElBQXhDLENBQTZDLFlBQVksU0FBUyxJQUFsRTtBQUNBLG9DQUFrQixJQUFsQjtBQUNEO0FBQ0YsZUFqQ0QsTUFpQ08sSUFBSSxTQUFTLEtBQVQsQ0FBZSxRQUFmLENBQXdCLDhCQUF4QixDQUFKLEVBQTZEO0FBQ2xFLGtCQUFFLGlIQUFGLEVBQXFILFdBQXJILENBQWlJLElBQUksSUFBSixDQUFTLHVCQUFULENBQWpJO0FBQ0QsZUFGTSxNQUVBO0FBQ0wsc0JBQU0sc0RBQXNELFNBQVMsS0FBckU7QUFDRDtBQUNGLGFBekNELE1BeUNPO0FBQ0wsb0JBQU0saUZBQU47QUFDRDtBQUNEO0FBQ0Q7QUFwREksU0FBUDtBQXNERCxPQXpERDtBQTBERDs7OzJDQUVzQjtBQUFBOztBQUNyQixVQUFJLGFBQWEsRUFBakI7QUFDQSxVQUFJLFlBQVksRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLCtCQUEzQixDQUFoQjtBQUNBLGdCQUFVLElBQVYsQ0FBZSxlQUFmLEVBQWdDLElBQWhDLENBQXFDLFVBQUMsS0FBRCxFQUFRLElBQVIsRUFBaUI7QUFDcEQsWUFBSSxXQUFXLE1BQVgsR0FBb0IsQ0FBeEIsRUFBMkI7QUFDekIsd0JBQWMsR0FBZDtBQUNEO0FBQ0Qsc0JBQWMsRUFBRSxJQUFGLEVBQVEsR0FBUixFQUFkO0FBQ0QsT0FMRDs7QUFPQSxVQUFJLFdBQVcsTUFBWCxHQUFvQixDQUF4QixFQUEyQjtBQUN6QixZQUFJLFNBQVMsS0FBSyxVQUFMLENBQWdCLGVBQWhCLENBQWI7QUFDQSxZQUFJLFdBQVcsSUFBZixFQUFxQjtBQUNuQixjQUFJLFFBQVEsT0FBTyxLQUFQLENBQWEsR0FBYixDQUFaO0FBQ0EsY0FBSSxNQUFNLE1BQU4sSUFBZ0IsQ0FBcEIsRUFBdUI7QUFDckIsY0FBRSxHQUFGLENBQU0sS0FBSyxhQUFMLEtBQXVCLEtBQUssTUFBTCxDQUFZLFFBQXpDLEVBQW1ELFVBQUMsYUFBRCxFQUFtQjtBQUNwRSxrQkFBSSxZQUFZLGNBQWMsS0FBOUI7QUFDQSxnQkFBRSxJQUFGLENBQU87QUFDTCxxQkFBSyxPQUFLLGFBQUwsS0FBdUIsT0FBSyxNQUFMLENBQVksbUJBRG5DO0FBRUwsc0JBQU0sRUFBRSxVQUFVLE1BQU0sQ0FBTixDQUFaLEVBQXNCLE9BQU8sTUFBTSxDQUFOLENBQTdCLEVBQXVDLE1BQU0sVUFBN0MsRUFGRDtBQUdMLHNCQUFNLE1BSEQ7QUFJTCx5QkFBUyxFQUFFLGNBQWMsU0FBaEIsRUFKSjtBQUtMLDBCQUFVLE1BTEw7QUFNTCx5QkFBUyxpQkFBQyx3QkFBRCxFQUE4QjtBQUNyQyxzQkFBSSx3QkFBSixFQUE4QjtBQUM1Qix3QkFBSSx5QkFBeUIsTUFBekIsS0FBb0MsSUFBeEMsRUFBOEM7QUFDNUMsd0JBQUUsTUFBRixFQUFVLE9BQVYsQ0FBa0IscUJBQWxCLEVBQXlDLENBQUUsd0JBQUYsRUFBNEIsSUFBNUIsQ0FBekM7QUFDQSw2QkFBTyxRQUFQLEdBQWtCLE9BQUssV0FBTCxLQUFxQixPQUF2QztBQUNELHFCQUhELE1BR087QUFDTCw0QkFBTSwrRkFBTjtBQUNEO0FBQ0YsbUJBUEQsTUFPTztBQUNMLDBCQUFNLCtGQUFOO0FBQ0Q7QUFDRjtBQWpCSSxlQUFQO0FBbUJELGFBckJEO0FBc0JELFdBdkJELE1BdUJPO0FBQ0wsa0JBQU0sK0ZBQU47QUFDRDtBQUNGLFNBNUJELE1BNEJPO0FBQ0wsY0FBSSxnQkFBZ0IsS0FBSyxVQUFMLENBQWdCLGtCQUFoQixDQUFwQjtBQUNBLGNBQUksa0JBQWtCLElBQXRCLEVBQTRCO0FBQzFCLGdCQUFJLGVBQWUsY0FBYyxLQUFkLENBQW9CLEdBQXBCLENBQW5CO0FBQ0EsZ0JBQUksYUFBYSxNQUFiLElBQXVCLENBQTNCLEVBQThCO0FBQzVCLGdCQUFFLEdBQUYsQ0FBTSxLQUFLLGFBQUwsS0FBdUIsS0FBSyxNQUFMLENBQVksUUFBekMsRUFBbUQsVUFBQyxhQUFELEVBQW1CO0FBQ3BFLG9CQUFJLFlBQVksY0FBYyxLQUE5QjtBQUNBLGtCQUFFLElBQUYsQ0FBTztBQUNMLHVCQUFLLE9BQUssYUFBTCxLQUF1QixPQUFLLE1BQUwsQ0FBWSxlQURuQztBQUVMLHdCQUFNLEVBQUUsVUFBVSxhQUFhLENBQWIsQ0FBWixFQUE2QixlQUFlLGFBQWEsQ0FBYixDQUE1QyxFQUZEO0FBR0wsd0JBQU0sTUFIRDtBQUlMLDJCQUFTLEVBQUUsY0FBYyxTQUFoQixFQUpKO0FBS0wsNEJBQVUsTUFMTDtBQU1MLDJCQUFTLGlCQUFDLGVBQUQsRUFBcUI7QUFDNUIsd0JBQUksZUFBSixFQUFxQjtBQUNuQiwwQkFBSSxnQkFBZ0IsTUFBaEIsS0FBMkIsSUFBL0IsRUFBcUM7QUFDbkMsMEJBQUUsTUFBRixFQUFVLE9BQVYsQ0FBa0IscUJBQWxCLEVBQXlDLENBQUUsZUFBRixFQUFtQixJQUFuQixDQUF6QztBQUNBLCtCQUFLLG9CQUFMO0FBQ0QsdUJBSEQsTUFHTztBQUNMLDhCQUFNLCtGQUFOO0FBQ0Q7QUFDRixxQkFQRCxNQU9PO0FBQ0wsNEJBQU0sK0ZBQU47QUFDRDtBQUNGO0FBakJJLGlCQUFQO0FBbUJELGVBckJEO0FBc0JELGFBdkJELE1BdUJPO0FBQ0wsb0JBQU0sK0ZBQU47QUFDRDtBQUNGLFdBNUJELE1BNEJPO0FBQ0wsa0JBQU0sNkZBQU47QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsYUFBTyxLQUFQO0FBQ0Q7OzsrQkFFVTtBQUNULFVBQUksRUFBRSxxQkFBRixFQUF5QixNQUF6QixHQUFrQyxDQUF0QyxFQUF5QztBQUN2QyxlQUFPLFFBQVAsR0FBa0IsZ0NBQWxCO0FBQ0Q7QUFDRjs7Ozs7O2tCQUdZLElBQUksWUFBSixFOzs7Ozs7Ozs7Ozs7O0lDemJULFU7QUFDSix3QkFBYztBQUFBOztBQUNaLFNBQUssR0FBTCxHQUFXO0FBQ1QsaUJBQVcsY0FERjtBQUVULG1CQUFhLDBCQUZKO0FBR1QsYUFBTztBQUhFLEtBQVg7O0FBTUEsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBWjtBQUNBLFNBQUssVUFBTCxHQUFrQixLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBbEI7QUFDQSxTQUFLLGVBQUwsR0FBdUIsS0FBSyxlQUFMLENBQXFCLElBQXJCLENBQTBCLElBQTFCLENBQXZCO0FBQ0Q7Ozs7MkJBRU07QUFDTCxVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixNQUF0QixJQUFnQyxDQUFwQyxFQUF1QyxPQUFPLEtBQVA7QUFDdkMsV0FBSyxVQUFMO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7OztpQ0FFWTtBQUFBOztBQUNYLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLEtBQUssR0FBTCxDQUFTLFdBQWpDLEVBQThDLFlBQU07QUFDbEQsY0FBSyxlQUFMO0FBQ0QsT0FGRDtBQUdEOzs7c0NBRWlCO0FBQ2hCLFFBQUUsS0FBSyxHQUFMLENBQVMsS0FBWCxFQUFrQixHQUFsQixDQUFzQixFQUF0QixFQUEwQixLQUExQjtBQUNEOzs7Ozs7a0JBR1ksSUFBSSxVQUFKLEU7Ozs7Ozs7Ozs7Ozs7SUM5QlQsYTtBQUNKLDJCQUFjO0FBQUE7O0FBQ1osU0FBSyxjQUFMLEdBQXNCLElBQXRCOztBQUVBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUFoQjtBQUNBLFNBQUssZUFBTCxHQUF1QixLQUFLLGVBQUwsQ0FBcUIsSUFBckIsQ0FBMEIsSUFBMUIsQ0FBdkI7QUFDRDs7OzsrQkFFVTtBQUNULGdCQUFVLGFBQVYsQ0FBd0IsUUFBeEIsQ0FBaUMsaUdBQWpDLEVBQW9JLElBQXBJLENBQXlJLFlBQU07QUFDN0k7QUFDRCxPQUZELEVBRUcsS0FGSCxDQUVTLFlBQU07QUFDYixnQkFBUSxHQUFSLENBQVkscUNBQVosRUFBbUQsR0FBbkQ7QUFDRCxPQUpEO0FBS0Q7OztzQ0FFaUI7QUFBQTs7QUFDaEIsYUFBTyxnQkFBUCxDQUF3QixxQkFBeEIsRUFBK0MsVUFBQyxDQUFELEVBQU87QUFDcEQ7QUFDQSxVQUFFLGNBQUY7QUFDQTtBQUNBLGNBQUssY0FBTCxHQUFzQixDQUF0QjtBQUNBO0FBQ0EsWUFBSSxhQUFhLFFBQVEsR0FBUixDQUFZLE1BQVosQ0FBakI7QUFDQTtBQUNBLFlBQUksZUFBZSxRQUFuQixFQUE2QjtBQUM3QjtBQUNBLFVBQUUsa0JBQUYsRUFBc0IsUUFBdEIsQ0FBK0IsdUJBQS9CO0FBQ0QsT0FYRDs7QUFhQSxRQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsT0FBZixFQUF3Qix1QkFBeEIsRUFBaUQsVUFBQyxDQUFELEVBQU87QUFDdEQsVUFBRSxjQUFGO0FBQ0E7QUFDQSxjQUFLLGNBQUwsQ0FBb0IsTUFBcEI7QUFDQTtBQUNBLGNBQUssY0FBTCxDQUFvQixVQUFwQixDQUErQixJQUEvQixDQUFvQyxVQUFDLFlBQUQsRUFBa0I7QUFDcEQsY0FBSSxhQUFhLE9BQWIsS0FBeUIsVUFBN0IsRUFBeUM7QUFDdkM7QUFDQSxjQUFFLGtCQUFGLEVBQXNCLFdBQXRCLENBQWtDLHVCQUFsQztBQUNELFdBSEQsTUFHTztBQUNMO0FBQ0EsY0FBRSx5QkFBRixFQUE2QixJQUE3QixDQUFrQyxrQ0FBbEM7QUFDQSxjQUFFLHVCQUFGLEVBQTJCLE1BQTNCO0FBQ0EsY0FBRSx3QkFBRixFQUE0QixJQUE1QixDQUFpQyxPQUFqQztBQUNBO0FBQ0Esa0JBQUssZ0JBQUw7QUFDRDtBQUNELGdCQUFLLGNBQUwsR0FBc0IsSUFBdEI7QUFDRCxTQWJEO0FBY0QsT0FuQkQ7O0FBcUJBLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLHdCQUF4QixFQUFrRCxVQUFDLENBQUQsRUFBTztBQUN2RCxVQUFFLGNBQUY7QUFDQTtBQUNBLFVBQUUsa0JBQUYsRUFBc0IsV0FBdEIsQ0FBa0MsdUJBQWxDO0FBQ0E7QUFDQSxjQUFLLGNBQUwsR0FBc0IsSUFBdEI7QUFDQTtBQUNBLGNBQUssZ0JBQUw7QUFDRCxPQVJEO0FBU0Q7Ozt1Q0FFa0I7QUFDakI7QUFDQSxjQUFRLEdBQVIsQ0FBWSxNQUFaLEVBQW9CLFFBQXBCLEVBQThCLEVBQUMsU0FBUyxFQUFWLEVBQTlCO0FBQ0Q7OzsyQkFFTTtBQUNMLFVBQUksRUFBRSxtQkFBbUIsU0FBckIsQ0FBSixFQUFxQyxPQUFPLEtBQVA7QUFDckMsV0FBSyxRQUFMO0FBQ0E7QUFDQSxhQUFPLElBQVA7QUFDRDs7Ozs7O2tCQUdZLElBQUksYUFBSixFOzs7Ozs7Ozs7Ozs7O0lDNUVULFE7QUFDSixzQkFBYztBQUFBOztBQUNaLFNBQUssR0FBTCxHQUFXO0FBQ1Q7QUFDQSxpQkFBVyxXQUZGO0FBR1Qsc0JBQWdCLFlBSFAsRUFHcUI7QUFDOUIsb0JBQWMsWUFKTCxFQUltQjtBQUM1QixxQkFBZSxXQUxOO0FBTVQsbUJBQWEsV0FOSjtBQU9ULGtCQUFZLFFBUEg7QUFRVCxnQkFBVSxRQVJEO0FBU1QsNEJBQXNCO0FBVGIsS0FBWDs7QUFZQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFwQjtBQUNBLFNBQUssb0JBQUwsR0FBNEIsS0FBSyxvQkFBTCxDQUEwQixJQUExQixDQUErQixJQUEvQixDQUE1QjtBQUNEOzs7OzJCQUVNO0FBQUE7O0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxLQUFQOztBQUV2QyxRQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsa0JBQWIsRUFBaUMsVUFBQyxHQUFELEVBQU0sU0FBTixFQUFvQjtBQUNuRCxjQUFLLG9CQUFMLENBQTBCLFNBQTFCO0FBQ0QsT0FGRDs7QUFJQSxXQUFLLFlBQUw7QUFDQSxhQUFPLElBQVA7QUFDRDs7O21DQUVjO0FBQ2IsVUFBSSxRQUFRLElBQUksS0FBSyxHQUFMLENBQVMsUUFBYixDQUFaO0FBQ0EsVUFBSSxZQUFZLElBQUksS0FBSyxHQUFMLENBQVMsWUFBYixDQUFoQjtBQUNBLFVBQUksV0FBVyxJQUFJLEtBQUssR0FBTCxDQUFTLFdBQWIsQ0FBZjs7QUFFQSxVQUFJLE9BQU8sS0FBUCxLQUFpQixXQUFyQixFQUFrQztBQUNoQyxVQUFFLEtBQUssR0FBTCxDQUFTLFVBQVgsRUFBdUIsR0FBdkIsQ0FBMkIsS0FBM0I7QUFDRDs7QUFFRCxVQUFJLE9BQU8sU0FBUCxLQUFxQixXQUF6QixFQUFzQztBQUNwQyxVQUFFLEtBQUssR0FBTCxDQUFTLGNBQVgsRUFBMkIsR0FBM0IsQ0FBK0IsU0FBL0I7O0FBRUEsWUFBSSxFQUFFLElBQUYsQ0FBTyxTQUFQLEVBQWtCLE1BQWxCLEdBQTJCLENBQS9CLEVBQWtDO0FBQ2hDLFlBQUUsS0FBSyxHQUFMLENBQVMsb0JBQVgsRUFBaUMsSUFBakMsQ0FBc0MsU0FBdEM7QUFDRDtBQUNGOztBQUVELFVBQUksT0FBTyxRQUFQLEtBQW9CLFdBQXhCLEVBQXFDO0FBQ25DLFVBQUUsS0FBSyxHQUFMLENBQVMsYUFBWCxFQUEwQixHQUExQixDQUE4QixRQUE5QjtBQUNEO0FBQ0Y7Ozt5Q0FFb0IsUyxFQUFXO0FBQzlCLFVBQUksWUFBWSxJQUFJLEtBQUssR0FBTCxDQUFTLFlBQWIsQ0FBaEI7O0FBRUEsVUFBSyxPQUFPLFNBQVAsS0FBcUIsV0FBdEIsSUFBdUMsRUFBRSxJQUFGLENBQU8sU0FBUCxFQUFrQixNQUFsQixLQUE2QixDQUF4RSxFQUE0RTtBQUMxRSxVQUFFLEtBQUssR0FBTCxDQUFTLG9CQUFYLEVBQWlDLElBQWpDLENBQXNDLFVBQVUsSUFBaEQ7QUFDRDtBQUNGOzs7Ozs7a0JBR1ksSUFBSSxRQUFKLEU7Ozs7Ozs7Ozs7Ozs7SUM3RFQsVztBQUNKLHlCQUFjO0FBQUE7O0FBQ1osU0FBSyxHQUFMLEdBQVc7QUFDVCxZQUFNLHFCQURHO0FBRVQscUJBQWU7QUFGTixLQUFYOztBQUtBLFNBQUssYUFBTCxHQUFxQixLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBckI7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixDQUFsQjtBQUNBLFNBQUssYUFBTCxHQUFxQixLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBckI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixJQUFwQixDQUFqQjtBQUNBLFNBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQWhCO0FBQ0Q7Ozs7b0NBRWU7QUFDZCxVQUFNLFNBQVMsRUFBRSxxQ0FBRixFQUF5QyxJQUF6QyxDQUE4QyxTQUE5QyxDQUFmO0FBQ0EsYUFBUSxTQUFTLE1BQVQsR0FBa0IsRUFBMUI7QUFDRDs7O2lDQUVZO0FBQ1gsUUFBRSxRQUFGLEVBQVksRUFBWixDQUFlLFFBQWYsRUFBeUIsS0FBSyxHQUFMLENBQVMsYUFBbEMsRUFBaUQsS0FBSyxhQUF0RDtBQUNBLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxRQUFmLEVBQXlCLEtBQUssR0FBTCxDQUFTLElBQWxDLEVBQXdDLEtBQUssVUFBN0M7O0FBRUEsVUFBSSxVQUFVLEVBQUUsS0FBSyxHQUFMLENBQVMsSUFBWCxFQUFpQixJQUFqQixDQUFzQixrQkFBdEIsQ0FBZDtBQUNBLFVBQUssWUFBWSxJQUFiLElBQXNCLEVBQUUsSUFBRixDQUFPLE9BQVAsRUFBZ0IsTUFBaEIsR0FBeUIsQ0FBbkQsRUFBc0Q7QUFDcEQsVUFBRSxLQUFLLEdBQUwsQ0FBUyxhQUFYLEVBQTBCLEdBQTFCLENBQThCLE9BQTlCLEVBQXVDLE9BQXZDLENBQStDLFFBQS9DO0FBQ0Q7QUFDRjs7OytCQUVVO0FBQ1QsUUFBRSxLQUFLLEdBQUwsQ0FBUyxJQUFYLEVBQWlCLElBQWpCLENBQXNCLFVBQUMsS0FBRCxFQUFRLElBQVIsRUFBaUI7QUFDckMsVUFBRSxJQUFGLEVBQVEsUUFBUixDQUFpQjtBQUNmLDBCQUFnQix3QkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNsQyxnQkFBSSxRQUFRLElBQVIsQ0FBYSxNQUFiLE1BQXlCLFVBQTdCLEVBQXlDO0FBQ3ZDLG9CQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxHQUFvQixJQUFwQixDQUF5QixPQUF6QixDQUFsQjtBQUNELGFBRkQsTUFFTyxJQUFJLFFBQVEsRUFBUixDQUFXLFFBQVgsQ0FBSixFQUEwQjtBQUMvQixvQkFBTSxXQUFOLENBQWtCLE9BQWxCO0FBQ0Esc0JBQVEsTUFBUixHQUFpQixJQUFqQixDQUFzQixrQkFBdEIsRUFBMEMsUUFBMUMsQ0FBbUQsT0FBbkQ7QUFDRCxhQUhNLE1BR0E7QUFDTCxvQkFBTSxXQUFOLENBQWtCLE9BQWxCO0FBQ0Q7QUFDRixXQVZjO0FBV2YsbUJBQVMsaUJBQUMsS0FBRCxFQUFXO0FBQ2xCLGdCQUFJLFVBQVUsRUFBRSxLQUFGLEVBQVMsT0FBVCxDQUFpQixlQUFqQixDQUFkO0FBQ0EsZ0JBQUksUUFBUSxJQUFSLENBQWEsUUFBYixFQUF1QixNQUF2QixHQUFnQyxDQUFwQyxFQUF1QztBQUNyQyxzQkFBUSxJQUFSLENBQWEsa0JBQWIsRUFBaUMsV0FBakMsQ0FBNkMsT0FBN0M7QUFDRDtBQUNGO0FBaEJjLFNBQWpCO0FBa0JELE9BbkJEO0FBb0JEOzs7a0NBRWEsQyxFQUFHO0FBQ2YsVUFBSSxNQUFNLEVBQUUsS0FBSyxHQUFMLENBQVMsYUFBWCxFQUEwQixHQUExQixFQUFWOztBQUVBLFVBQUksVUFBVSxFQUFFLFFBQUYsRUFBWSxLQUFLLEdBQUwsQ0FBUyxhQUFyQixDQUFkO0FBQ0EsVUFBSSxZQUFZLElBQWhCO0FBQ0EsY0FBUSxJQUFSLENBQWEsVUFBQyxLQUFELEVBQVEsSUFBUixFQUFpQjtBQUM1QixZQUFJLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxPQUFiLE1BQTBCLEdBQTFCLElBQWtDLEtBQUssRUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLGNBQWIsQ0FBTixLQUF3QyxNQUE3RSxFQUFxRjtBQUNuRixzQkFBWSxLQUFaO0FBQ0Q7QUFDRixPQUpEOztBQU1BLFVBQUksU0FBSixFQUFlO0FBQ2IsVUFBRSxrQkFBRixFQUFzQixLQUFLLEdBQUwsQ0FBUyxJQUEvQixFQUFxQyxJQUFyQyxDQUEwQyxVQUExQyxFQUFzRCxVQUF0RCxFQUFrRSxJQUFsRSxDQUF1RSxhQUF2RSxFQUFzRixVQUF0RjtBQUNBLFVBQUUsY0FBRixFQUFrQixLQUFLLEdBQUwsQ0FBUyxJQUEzQixFQUFpQyxJQUFqQyxDQUFzQyxVQUF0QyxFQUFrRCxVQUFsRCxFQUE4RCxJQUE5RCxDQUFtRSxhQUFuRSxFQUFrRixrQkFBbEY7QUFDQSxVQUFFLGVBQUYsRUFBbUIsS0FBSyxHQUFMLENBQVMsSUFBNUIsRUFBa0MsSUFBbEMsQ0FBdUMsVUFBdkMsRUFBbUQsVUFBbkQsRUFBK0QsSUFBL0QsQ0FBb0UsYUFBcEUsRUFBbUYsT0FBbkY7QUFDRCxPQUpELE1BSU87QUFDTCxVQUFFLGtCQUFGLEVBQXNCLEtBQUssR0FBTCxDQUFTLElBQS9CLEVBQXFDLFVBQXJDLENBQWdELFVBQWhELEVBQTRELElBQTVELENBQWlFLGFBQWpFLEVBQWdGLFNBQWhGLEVBQTJGLFdBQTNGLENBQXVHLE9BQXZHLEVBQWdILE9BQWhILENBQXdILEtBQXhILEVBQStILElBQS9ILENBQW9JLE9BQXBJLEVBQTZJLE1BQTdJO0FBQ0EsVUFBRSxjQUFGLEVBQWtCLEtBQUssR0FBTCxDQUFTLElBQTNCLEVBQWlDLFVBQWpDLENBQTRDLFVBQTVDLEVBQXdELElBQXhELENBQTZELGFBQTdELEVBQTRFLGlCQUE1RSxFQUErRixXQUEvRixDQUEyRyxPQUEzRyxFQUFvSCxPQUFwSCxDQUE0SCxLQUE1SCxFQUFtSSxJQUFuSSxDQUF3SSxPQUF4SSxFQUFpSixNQUFqSjtBQUNBLFVBQUUsZUFBRixFQUFtQixLQUFLLEdBQUwsQ0FBUyxJQUE1QixFQUFrQyxVQUFsQyxDQUE2QyxVQUE3QyxFQUF5RCxJQUF6RCxDQUE4RCxhQUE5RCxFQUE2RSxNQUE3RSxFQUFxRixXQUFyRixDQUFpRyxPQUFqRyxFQUEwRyxPQUExRyxDQUFrSCxLQUFsSCxFQUF5SCxJQUF6SCxDQUE4SCxPQUE5SCxFQUF1SSxNQUF2STtBQUNEO0FBQ0Y7OzsrQkFFVSxDLEVBQUc7QUFBQTs7QUFDWixRQUFFLGNBQUY7QUFDQSxVQUFJLFFBQVEsRUFBRSxFQUFFLE1BQUosQ0FBWjtBQUNBLFVBQUksV0FBVyxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FBZjtBQUNBLFFBQUUsSUFBRixDQUFPLEtBQUssYUFBTCxLQUF1QixNQUFNLElBQU4sQ0FBVyxRQUFYLENBQTlCLEVBQW9ELFFBQXBELEVBQThELFVBQUMsSUFBRCxFQUFVO0FBQ3RFLFlBQUksS0FBSyxNQUFMLEtBQWdCLElBQXBCLEVBQTBCO0FBQ3hCLGdCQUFLLFdBQUw7QUFDRCxTQUZELE1BRU87QUFDTCxnQkFBSyxTQUFMO0FBQ0Q7QUFDRixPQU5EO0FBT0Q7OztnQ0FFVyxLLEVBQU87QUFDakIsVUFBSSxpQkFBaUIsTUFBTSxjQUFOLEVBQXJCO0FBQ0EsVUFBSSxlQUFlLEVBQW5CO0FBQ0EsUUFBRSxHQUFGLENBQU0sY0FBTixFQUFzQixVQUFDLENBQUQ7QUFBQSxlQUFRLGFBQWEsRUFBRSxJQUFmLElBQXVCLEVBQUUsS0FBakM7QUFBQSxPQUF0Qjs7QUFFQSxtQkFBYSxNQUFiLEdBQXNCLEVBQUUsSUFBRixDQUFPLE1BQU0sSUFBTixDQUFXLFFBQVgsQ0FBUCxDQUF0QjtBQUNBLG1CQUFhLEVBQWIsR0FBa0IsRUFBRSxJQUFGLENBQU8sTUFBTSxJQUFOLENBQVcsSUFBWCxDQUFQLENBQWxCOztBQUVBLGFBQU8sWUFBUDtBQUNEOzs7a0NBRWE7QUFDWixhQUFPLFFBQVAsR0FBa0IsRUFBRSxLQUFLLEdBQUwsQ0FBUyxJQUFYLEVBQWlCLElBQWpCLENBQXNCLFFBQXRCLENBQWxCO0FBQ0Q7OztnQ0FFVztBQUNWLFlBQU0sNENBQU47QUFDRDs7OzJCQUVNO0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLElBQVgsRUFBaUIsTUFBakIsSUFBMkIsQ0FBL0IsRUFBa0MsT0FBTyxLQUFQO0FBQ2xDLFdBQUssVUFBTDtBQUNBLFdBQUssUUFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7a0JBR1ksSUFBSSxXQUFKLEU7Ozs7Ozs7Ozs7Ozs7SUN0SFQsa0I7QUFDSixnQ0FBYztBQUFBOztBQUNaLFNBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFNBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFNBQUssS0FBTCxHQUFhLEVBQWI7O0FBRUEsU0FBSyxNQUFMLEdBQWM7QUFDWjtBQUNBLGVBQVMsa0JBRkc7QUFHWjtBQUNBLGtCQUFZO0FBSkEsS0FBZDs7QUFPQSxTQUFLLEdBQUwsR0FBVztBQUNULGlCQUFXLHNDQURGO0FBRVQsbUJBQWEsNkJBRko7QUFHVCxhQUFPLDZCQUhFO0FBSVQsYUFBTyxtQ0FKRTtBQUtULGFBQU8sbUNBTEU7QUFNVCxxQkFBZSxvREFOTjs7QUFRVCxzQkFBZ0IsOEJBUlA7QUFTVCxzQkFBZ0IsOEJBVFA7QUFVVCx3QkFBa0I7QUFWVCxLQUFYOztBQWFBLFNBQUssYUFBTCxHQUFxQixLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBckI7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixDQUFsQjs7QUFFQSxTQUFLLGFBQUwsR0FBcUIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLEtBQUssY0FBTCxDQUFvQixJQUFwQixDQUF5QixJQUF6QixDQUF0QjtBQUNBLFNBQUssY0FBTCxHQUFzQixLQUFLLGNBQUwsQ0FBb0IsSUFBcEIsQ0FBeUIsSUFBekIsQ0FBdEI7QUFDQSxTQUFLLFlBQUwsR0FBb0IsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCLENBQXBCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQWhCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBaEI7QUFDRDs7OztvQ0FFZTtBQUNkLFVBQU0sU0FBUyxFQUFFLHFDQUFGLEVBQXlDLElBQXpDLENBQThDLFNBQTlDLENBQWY7QUFDQSxhQUFRLFNBQVMsTUFBVCxHQUFrQixFQUExQjtBQUNEOzs7aUNBRVk7QUFBQTs7QUFDWCxRQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsUUFBZixFQUF5QixLQUFLLEdBQUwsQ0FBUyxLQUFsQyxFQUF5QyxLQUFLLFdBQTlDO0FBQ0EsUUFBRSxRQUFGLEVBQVksRUFBWixDQUFlLFFBQWYsRUFBeUIsS0FBSyxHQUFMLENBQVMsS0FBbEMsRUFBeUMsS0FBSyxXQUE5QztBQUNBLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxRQUFmLEVBQXlCLEtBQUssR0FBTCxDQUFTLGFBQWxDLEVBQWlELEtBQUssYUFBdEQ7O0FBRUEsVUFBSSxVQUFVLEVBQUUsS0FBSyxHQUFMLENBQVMsS0FBWCxFQUFrQixJQUFsQixDQUF1QixrQkFBdkIsQ0FBZDtBQUNBLFVBQUssWUFBWSxJQUFiLElBQXNCLEVBQUUsSUFBRixDQUFPLE9BQVAsRUFBZ0IsTUFBaEIsR0FBeUIsQ0FBbkQsRUFBc0Q7QUFDcEQsVUFBRSxLQUFLLEdBQUwsQ0FBUyxhQUFYLEVBQTBCLEdBQTFCLENBQThCLE9BQTlCLEVBQXVDLE9BQXZDLENBQStDLFFBQS9DO0FBQ0Q7O0FBRUQsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsSUFBdEIsQ0FBMkIsS0FBSyxHQUFMLENBQVMsY0FBcEMsRUFBb0QsTUFBcEQsR0FBNkQsQ0FBakUsRUFBb0U7QUFDbEUsZUFBTyxXQUFQLEdBQXFCLFlBQU07QUFDekIsaUJBQU8sV0FBUCxHQUFxQixZQUFZLFlBQU07QUFDckMsZ0JBQUksT0FBUSxPQUFPLEVBQWYsS0FBdUIsV0FBdkIsSUFBc0MsT0FBTyxFQUFQLEtBQWMsSUFBeEQsRUFBOEQ7QUFDNUQscUJBQU8sRUFBUCxDQUFVLElBQVYsQ0FBZTtBQUNiLHVCQUFPLE1BQUssTUFBTCxDQUFZLE9BRE47QUFFYix3QkFBUSxJQUZLO0FBR2IsdUJBQU8sSUFITTtBQUliLHlCQUFTO0FBSkksZUFBZjs7QUFPQSw0QkFBYyxPQUFPLFdBQXJCO0FBQ0Q7QUFDRixXQVhvQixFQVdsQixHQVhrQixDQUFyQjtBQVlELFNBYkQ7O0FBZUEsWUFBSSxTQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLE1BQThDLElBQWxELEVBQXdEO0FBQ3RELGNBQUksTUFBTSxTQUFTLG9CQUFULENBQThCLFFBQTlCLEVBQXdDLENBQXhDLENBQVY7QUFDQSxjQUFJLEtBQUssU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQVQ7QUFDQSxhQUFHLEVBQUgsR0FBUSxnQkFBUjtBQUNBLGFBQUcsR0FBSCxHQUFTLHFDQUFUO0FBQ0EsY0FBSSxVQUFKLENBQWUsWUFBZixDQUE0QixFQUE1QixFQUFnQyxHQUFoQztBQUNEO0FBQ0QsVUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLEtBQUssR0FBTCxDQUFTLGNBQXBDLEVBQW9ELEVBQXBELENBQXVELE9BQXZELEVBQWdFLFVBQUMsR0FBRCxFQUFTO0FBQ3ZFLGdCQUFLLGNBQUwsQ0FBb0IsR0FBcEI7QUFDQSxpQkFBTyxLQUFQO0FBQ0QsU0FIRDtBQUlEOztBQUVELFVBQUksRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLEtBQUssR0FBTCxDQUFTLGNBQXBDLEVBQW9ELE1BQXBELEdBQTZELENBQWpFLEVBQW9FO0FBQ2xFLFVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixLQUFLLEdBQUwsQ0FBUyxjQUFwQyxFQUFvRCxFQUFwRCxDQUF1RCxPQUF2RCxFQUFnRSxVQUFDLEdBQUQsRUFBUztBQUN2RSxnQkFBSyxjQUFMLENBQW9CLEdBQXBCO0FBQ0EsaUJBQU8sS0FBUDtBQUNELFNBSEQ7QUFJRDs7QUFFRCxVQUFJLGVBQWUsRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLElBQXRCLENBQTJCLEtBQUssR0FBTCxDQUFTLGdCQUFwQyxDQUFuQjtBQUNBLFVBQUksYUFBYSxNQUFiLEdBQXNCLENBQTFCLEVBQTZCO0FBQzNCLGVBQU8sV0FBUCxHQUFxQixZQUFZLFlBQU07QUFDckMsY0FBSSxPQUFRLE9BQU8sSUFBZixLQUF5QixXQUF6QixJQUF3QyxPQUFPLElBQVAsS0FBZ0IsSUFBNUQsRUFBa0U7QUFDaEUsbUJBQU8sSUFBUCxDQUFZLElBQVosQ0FBaUIsT0FBakIsRUFBMEIsWUFBTTtBQUM5QixrQkFBSSxRQUFRLE9BQU8sSUFBUCxDQUFZLEtBQVosQ0FBa0IsSUFBbEIsQ0FBdUI7QUFDakMsMkJBQVcsTUFBSyxNQUFMLENBQVksVUFEVTtBQUVqQyw4QkFBYztBQUZtQixlQUF2QixDQUFaOztBQUtBLGtCQUFJLFVBQVUsYUFBYSxHQUFiLENBQWlCLENBQWpCLENBQWQ7QUFDQSxvQkFBTSxrQkFBTixDQUF5QixPQUF6QixFQUFrQyxFQUFsQyxFQUNFLFVBQUMsVUFBRCxFQUFnQjtBQUNkLHNCQUFLLFlBQUwsQ0FBa0IsVUFBbEI7QUFDQSx1QkFBTyxLQUFQO0FBQ0QsZUFKSCxFQUtFLFVBQUMsTUFBRCxFQUFZO0FBQ1Ysb0JBQUksT0FBTyxLQUFQLEtBQWlCLHNCQUFyQixFQUE2QztBQUMzQyx3QkFBTSxPQUFPLEtBQWI7QUFDRDtBQUNGLGVBVEg7QUFXRCxhQWxCRDs7QUFvQkEsMEJBQWMsT0FBTyxXQUFyQjtBQUNEO0FBQ0YsU0F4Qm9CLEVBd0JsQixHQXhCa0IsQ0FBckI7O0FBMEJBLFVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QixDQUEyQixLQUFLLEdBQUwsQ0FBUyxnQkFBcEMsRUFBc0QsRUFBdEQsQ0FBeUQsT0FBekQsRUFBa0UsVUFBQyxHQUFELEVBQVM7QUFDekUsY0FBSSxjQUFKO0FBQ0EsaUJBQU8sS0FBUDtBQUNELFNBSEQ7QUFJRDs7QUFFRCxRQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsT0FBZixFQUF3QixLQUFLLEdBQUwsQ0FBUyxXQUFqQyxFQUE4QyxVQUFDLEdBQUQsRUFBUztBQUNyRCxZQUFJLEtBQUssRUFBRSxJQUFJLGFBQU4sRUFBcUIsSUFBckIsQ0FBMEIsTUFBMUIsQ0FBVDtBQUNBLFlBQUksU0FBUyxFQUFFLEVBQUYsRUFBTSxNQUFOLEdBQWUsR0FBNUI7QUFDQSxVQUFFLFlBQUYsRUFBZ0IsT0FBaEIsQ0FBd0I7QUFDdEIscUJBQVc7QUFEVyxTQUF4QixFQUVHLElBRkgsRUFFUyxPQUZUOztBQUlBLGVBQU8sS0FBUDtBQUNELE9BUkQ7QUFTRDs7OytCQUVVO0FBQ1QsUUFBRSxLQUFLLEdBQUwsQ0FBUyxLQUFYLEVBQWtCLElBQWxCLENBQXVCLFVBQUMsS0FBRCxFQUFRLElBQVIsRUFBaUI7QUFDdEMsVUFBRSxJQUFGLEVBQVEsUUFBUixDQUFpQjtBQUNmLDBCQUFnQix3QkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNsQyxnQkFBSSxRQUFRLElBQVIsQ0FBYSxNQUFiLE1BQXlCLFVBQTdCLEVBQXlDO0FBQ3ZDLG9CQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxHQUFvQixJQUFwQixDQUF5QixPQUF6QixDQUFsQjtBQUNELGFBRkQsTUFFTyxJQUFJLFFBQVEsRUFBUixDQUFXLFFBQVgsQ0FBSixFQUEwQjtBQUMvQixvQkFBTSxXQUFOLENBQWtCLE9BQWxCO0FBQ0Esc0JBQVEsTUFBUixHQUFpQixJQUFqQixDQUFzQixrQkFBdEIsRUFBMEMsUUFBMUMsQ0FBbUQsT0FBbkQ7QUFDRCxhQUhNLE1BR0E7QUFDTCxvQkFBTSxXQUFOLENBQWtCLE9BQWxCO0FBQ0Q7QUFDRixXQVZjO0FBV2YsbUJBQVMsaUJBQUMsS0FBRCxFQUFXO0FBQ2xCLGdCQUFJLFVBQVUsRUFBRSxLQUFGLEVBQVMsT0FBVCxDQUFpQixlQUFqQixDQUFkO0FBQ0EsZ0JBQUksUUFBUSxJQUFSLENBQWEsUUFBYixFQUF1QixNQUF2QixHQUFnQyxDQUFwQyxFQUF1QztBQUNyQyxzQkFBUSxJQUFSLENBQWEsa0JBQWIsRUFBaUMsV0FBakMsQ0FBNkMsT0FBN0M7QUFDRDtBQUNGO0FBaEJjLFNBQWpCO0FBa0JELE9BbkJEO0FBb0JEOzs7a0NBRWEsQyxFQUFHO0FBQ2YsVUFBSSxNQUFNLEVBQUUsS0FBSyxHQUFMLENBQVMsYUFBWCxFQUEwQixHQUExQixFQUFWOztBQUVBLFVBQUksVUFBVSxFQUFFLFFBQUYsRUFBWSxLQUFLLEdBQUwsQ0FBUyxhQUFyQixDQUFkO0FBQ0EsVUFBSSxZQUFZLElBQWhCO0FBQ0EsY0FBUSxJQUFSLENBQWEsVUFBQyxLQUFELEVBQVEsSUFBUixFQUFpQjtBQUM1QixZQUFJLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxPQUFiLE1BQTBCLEdBQTFCLElBQWtDLEtBQUssRUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLGNBQWIsQ0FBTixLQUF3QyxNQUE3RSxFQUFxRjtBQUNuRixzQkFBWSxLQUFaO0FBQ0Q7QUFDRixPQUpEOztBQU1BLFVBQUksU0FBSixFQUFlO0FBQ2IsVUFBRSxrQkFBRixFQUFzQixLQUFLLEdBQUwsQ0FBUyxJQUEvQixFQUFxQyxJQUFyQyxDQUEwQyxVQUExQyxFQUFzRCxVQUF0RCxFQUFrRSxJQUFsRSxDQUF1RSxhQUF2RSxFQUFzRixVQUF0RjtBQUNBLFVBQUUsY0FBRixFQUFrQixLQUFLLEdBQUwsQ0FBUyxJQUEzQixFQUFpQyxJQUFqQyxDQUFzQyxVQUF0QyxFQUFrRCxVQUFsRCxFQUE4RCxJQUE5RCxDQUFtRSxhQUFuRSxFQUFrRixrQkFBbEY7QUFDQSxVQUFFLGVBQUYsRUFBbUIsS0FBSyxHQUFMLENBQVMsSUFBNUIsRUFBa0MsSUFBbEMsQ0FBdUMsVUFBdkMsRUFBbUQsVUFBbkQsRUFBK0QsSUFBL0QsQ0FBb0UsYUFBcEUsRUFBbUYsT0FBbkY7QUFDRCxPQUpELE1BSU87QUFDTCxVQUFFLGtCQUFGLEVBQXNCLEtBQUssR0FBTCxDQUFTLElBQS9CLEVBQXFDLFVBQXJDLENBQWdELFVBQWhELEVBQTRELElBQTVELENBQWlFLGFBQWpFLEVBQWdGLFNBQWhGLEVBQTJGLFdBQTNGLENBQXVHLE9BQXZHLEVBQWdILE9BQWhILENBQXdILEtBQXhILEVBQStILElBQS9ILENBQW9JLE9BQXBJLEVBQTZJLE1BQTdJO0FBQ0EsVUFBRSxjQUFGLEVBQWtCLEtBQUssR0FBTCxDQUFTLElBQTNCLEVBQWlDLFVBQWpDLENBQTRDLFVBQTVDLEVBQXdELElBQXhELENBQTZELGFBQTdELEVBQTRFLGlCQUE1RSxFQUErRixXQUEvRixDQUEyRyxPQUEzRyxFQUFvSCxPQUFwSCxDQUE0SCxLQUE1SCxFQUFtSSxJQUFuSSxDQUF3SSxPQUF4SSxFQUFpSixNQUFqSjtBQUNBLFVBQUUsZUFBRixFQUFtQixLQUFLLEdBQUwsQ0FBUyxJQUE1QixFQUFrQyxVQUFsQyxDQUE2QyxVQUE3QyxFQUF5RCxJQUF6RCxDQUE4RCxhQUE5RCxFQUE2RSxNQUE3RSxFQUFxRixXQUFyRixDQUFpRyxPQUFqRyxFQUEwRyxPQUExRyxDQUFrSCxLQUFsSCxFQUF5SCxJQUF6SCxDQUE4SCxPQUE5SCxFQUF1SSxNQUF2STtBQUNEO0FBQ0Y7OzttQ0FFYyxHLEVBQUs7QUFBQTs7QUFDbEIsVUFBSSxjQUFKOztBQUVBLGFBQU8sRUFBUCxDQUFVLEtBQVYsQ0FBZ0IsVUFBQyxhQUFELEVBQW1CO0FBQ2pDLFlBQUksY0FBYyxZQUFsQixFQUFnQztBQUM5QixpQkFBTyxFQUFQLENBQVUsR0FBVixDQUFjLEtBQWQsRUFBcUIsVUFBQyxZQUFELEVBQWtCO0FBQ3JDLG1CQUFLLFNBQUwsR0FBaUIsYUFBYSxVQUE5QjtBQUNBLG1CQUFLLFFBQUwsR0FBZ0IsYUFBYSxTQUE3QjtBQUNBLG1CQUFLLEtBQUwsR0FBYSxhQUFhLEtBQTFCOztBQUVBLG1CQUFLLFFBQUw7QUFDRCxXQU5ELEVBTUcsRUFBRSxRQUFRLENBQUUsSUFBRixFQUFRLE9BQVIsRUFBaUIsWUFBakIsRUFBK0IsV0FBL0IsQ0FBVixFQU5IO0FBT0Q7QUFDRCxlQUFPLEtBQVA7QUFDRCxPQVhELEVBV0csRUFBRSxPQUFPLHNCQUFULEVBQWlDLGVBQWUsSUFBaEQsRUFYSDtBQVlEOzs7bUNBRWMsRyxFQUFLO0FBQUE7O0FBQ2xCLFVBQUksY0FBSjs7QUFFQSxTQUFHLElBQUgsQ0FBUSxTQUFSLENBQWtCLFlBQU07QUFDdEIsV0FBRyxHQUFILENBQU8sT0FBUCxDQUFlLElBQWYsRUFBcUIsTUFBckIsQ0FBNEIsSUFBNUIsRUFBa0MsWUFBbEMsRUFBZ0QsV0FBaEQsRUFBNkQsZUFBN0QsRUFBOEUsTUFBOUUsQ0FBcUYsVUFBQyxNQUFELEVBQVk7QUFDL0YsY0FBSSxTQUFTLE9BQU8sTUFBUCxDQUFjLENBQWQsQ0FBYjs7QUFFQSxpQkFBSyxTQUFMLEdBQWlCLE9BQU8sU0FBeEI7QUFDQSxpQkFBSyxRQUFMLEdBQWdCLE9BQU8sUUFBdkI7QUFDQSxpQkFBSyxLQUFMLEdBQWEsT0FBTyxZQUFwQjs7QUFFQSxpQkFBSyxRQUFMO0FBQ0QsU0FSRDtBQVNELE9BVkQ7O0FBWUEsa0JBQVksWUFBTTtBQUNoQixZQUFJLFNBQVMsT0FBTyxFQUFQLENBQVUsSUFBVixDQUFlLFlBQWYsRUFBYjtBQUNBLFlBQUksTUFBSixFQUFZO0FBQ1YsYUFBRyxHQUFILENBQU8sT0FBUCxDQUFlLElBQWYsRUFBcUIsTUFBckIsQ0FBNEIsSUFBNUIsRUFBa0MsWUFBbEMsRUFBZ0QsV0FBaEQsRUFBNkQsZUFBN0QsRUFBOEUsTUFBOUUsQ0FBcUYsVUFBQyxNQUFELEVBQVk7QUFDL0YsZ0JBQUksU0FBUyxPQUFPLE1BQVAsQ0FBYyxDQUFkLENBQWI7O0FBRUEsbUJBQUssU0FBTCxHQUFpQixPQUFPLFNBQXhCO0FBQ0EsbUJBQUssUUFBTCxHQUFnQixPQUFPLFFBQXZCO0FBQ0EsbUJBQUssS0FBTCxHQUFhLE9BQU8sWUFBcEI7O0FBRUEsbUJBQUssUUFBTDtBQUNELFdBUkQ7QUFTRDtBQUNGLE9BYkQsRUFhRyxJQWJIOztBQWVBLGFBQU8sS0FBUDtBQUNEOzs7aUNBRVksVSxFQUFZO0FBQ3ZCLFVBQUksZUFBZSxXQUFXLGVBQVgsRUFBbkI7O0FBRUEsV0FBSyxTQUFMLEdBQWlCLGFBQWEsWUFBYixFQUFqQjtBQUNBLFdBQUssUUFBTCxHQUFnQixhQUFhLGFBQWIsRUFBaEI7QUFDQSxXQUFLLEtBQUwsR0FBYSxhQUFhLFFBQWIsRUFBYjs7QUFFQSxXQUFLLFFBQUw7QUFDRDs7O2dDQUVXLEMsRUFBRztBQUNiLFFBQUUsY0FBRjtBQUNBLFVBQUksUUFBUSxFQUFFLEVBQUUsTUFBSixDQUFaO0FBQ0EsVUFBSSxXQUFXLEtBQUssV0FBTCxDQUFpQixLQUFqQixDQUFmOztBQUVBLFdBQUssU0FBTCxHQUFpQixTQUFTLFNBQTFCO0FBQ0EsV0FBSyxRQUFMLEdBQWdCLFNBQVMsUUFBekI7QUFDQSxXQUFLLEtBQUwsR0FBYSxTQUFTLEtBQXRCOztBQUVBLFdBQUssUUFBTDtBQUNEOzs7K0JBRVU7QUFDVCxRQUFFLGdDQUFGLEVBQW9DLEtBQUssR0FBTCxDQUFTLFNBQTdDLEVBQXdELElBQXhEO0FBQ0EsUUFBRSxnQ0FBRixFQUFvQyxLQUFLLEdBQUwsQ0FBUyxTQUE3QyxFQUF3RCxJQUF4RDtBQUNBLFFBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixRQUF0QixDQUErQixRQUEvQjtBQUNEOzs7Z0NBRVcsQyxFQUFHO0FBQUE7O0FBQ2IsUUFBRSxjQUFGO0FBQ0EsVUFBSSxRQUFRLEVBQUUsRUFBRSxNQUFKLENBQVo7QUFDQSxVQUFJLFdBQVcsS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQWY7QUFDQSxlQUFTLFNBQVQsR0FBcUIsS0FBSyxTQUExQjtBQUNBLGVBQVMsUUFBVCxHQUFvQixLQUFLLFFBQXpCO0FBQ0EsZUFBUyxLQUFULEdBQWlCLEtBQUssS0FBdEI7O0FBRUEsUUFBRSxJQUFGLENBQU8sS0FBSyxhQUFMLEtBQXVCLE1BQU0sSUFBTixDQUFXLFFBQVgsQ0FBOUIsRUFBb0QsUUFBcEQsRUFBOEQsVUFBQyxJQUFELEVBQVU7QUFDdEUsWUFBSSxLQUFLLE1BQUwsS0FBZ0IsSUFBcEIsRUFBMEI7QUFDeEIsaUJBQUssV0FBTDtBQUNELFNBRkQsTUFFTztBQUNMLGdCQUFNLDRDQUFOO0FBQ0Q7QUFDRixPQU5EO0FBT0Q7OztnQ0FFVyxLLEVBQU87QUFDakIsVUFBSSxpQkFBaUIsTUFBTSxjQUFOLEVBQXJCO0FBQ0EsVUFBSSxlQUFlLEVBQW5CO0FBQ0EsUUFBRSxHQUFGLENBQU0sY0FBTixFQUFzQixVQUFDLENBQUQ7QUFBQSxlQUFRLGFBQWEsRUFBRSxJQUFmLElBQXVCLEVBQUUsS0FBakM7QUFBQSxPQUF0Qjs7QUFFQSxtQkFBYSxNQUFiLEdBQXNCLEVBQUUsSUFBRixDQUFPLE1BQU0sSUFBTixDQUFXLFFBQVgsQ0FBUCxDQUF0QjtBQUNBLG1CQUFhLEVBQWIsR0FBa0IsRUFBRSxJQUFGLENBQU8sTUFBTSxJQUFOLENBQVcsSUFBWCxDQUFQLENBQWxCOztBQUVBLGFBQU8sWUFBUDtBQUNEOzs7a0NBRWE7QUFDWixVQUFJLFNBQVMsRUFBRSxnQ0FBRixFQUFvQyxLQUFLLEdBQUwsQ0FBUyxTQUE3QyxFQUF3RCxJQUF4RCxDQUE2RCxRQUE3RCxDQUFiO0FBQ0EsVUFBSyxXQUFXLElBQVosSUFBc0IsT0FBTyxNQUFQLEdBQWdCLENBQTFDLEVBQThDO0FBQzVDLGVBQU8sUUFBUCxHQUFrQixNQUFsQjtBQUNELE9BRkQsTUFFTztBQUNMLFVBQUUsZ0NBQUYsRUFBb0MsS0FBSyxHQUFMLENBQVMsU0FBN0MsRUFBd0QsSUFBeEQ7QUFDQSxVQUFFLGlDQUFGLEVBQXFDLEtBQUssR0FBTCxDQUFTLFNBQTlDLEVBQXlELElBQXpEO0FBQ0Q7QUFDRjs7OzJCQUVNO0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxLQUFQO0FBQ3ZDLFdBQUssVUFBTDtBQUNBLFdBQUssUUFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7a0JBR1ksSUFBSSxrQkFBSixFOzs7Ozs7Ozs7Ozs7O0lDblRULFE7QUFDSixzQkFBYztBQUFBOztBQUNaLFNBQUssR0FBTCxHQUFXO0FBQ1QsaUJBQVcscUJBREY7QUFFVCxjQUFRO0FBRkMsS0FBWDs7QUFLQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixDQUFsQjtBQUNEOzs7OzJCQUVNO0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxLQUFQO0FBQ3ZDLFdBQUssVUFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7aUNBRVk7QUFDWCxRQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsT0FBZixFQUF3QixLQUFLLEdBQUwsQ0FBUyxNQUFqQyxFQUF5QyxVQUFDLENBQUQsRUFBTztBQUM5QyxZQUFNLGlCQUFpQixFQUFFLEVBQUUsTUFBSixFQUFZLElBQVosQ0FBaUIsdUJBQWpCLENBQXZCO0FBQ0EsVUFBRSx3QkFBd0IsY0FBeEIsR0FBeUMsR0FBM0MsRUFBZ0QsV0FBaEQ7QUFDRCxPQUhEO0FBSUQ7Ozs7OztrQkFHWSxJQUFJLFFBQUosRTs7Ozs7Ozs7Ozs7OztJQ3pCVCxNO0FBQ0osb0JBQWM7QUFBQTs7QUFDWixTQUFLLEdBQUwsR0FBVztBQUNULGlCQUFXO0FBREYsS0FBWDs7QUFJQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFwQjtBQUNBLFNBQUssWUFBTCxHQUFvQixLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBcEI7QUFDQSxTQUFLLGFBQUwsR0FBcUIsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLENBQXJCO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkIsQ0FBaEI7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0Q7Ozs7aUNBRVk7QUFDWCxhQUFPLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLEtBQUssWUFBdkM7QUFDRDs7O21DQUVjO0FBQ2IsYUFBTyxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsR0FBK0IsUUFBL0IsR0FBMEMsR0FBakQ7QUFDRDs7O21DQUVjO0FBQ2IsVUFBSSxPQUFPLFVBQVAsSUFBcUIsR0FBekIsRUFBOEI7QUFDNUIsWUFBSSxTQUFTLEVBQUUsTUFBRixFQUFVLFNBQVYsRUFBYjtBQUNBLFlBQUksU0FBUyxLQUFLLFlBQUwsS0FBc0IsRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLE1BQXRCLEdBQStCLE1BQS9CLEVBQXRCLEdBQWdFLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixXQUF0QixFQUFoRSxHQUFzRyxFQUFuSDtBQUNBLFlBQUksVUFBVSxLQUFLLFlBQUwsRUFBVixJQUFpQyxTQUFTLE1BQTFDLElBQW9ELENBQUMsRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLFFBQXRCLENBQStCLGVBQS9CLENBQXpELEVBQTBHO0FBQ3hHLFlBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUNHLFFBREgsQ0FDWSxlQURaLEVBRUcsR0FGSCxDQUVPO0FBQ0gsb0JBQVEsS0FBSyxhQUFMLENBQW1CLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxDQUFuQixDQURMO0FBRUgsbUJBQU87QUFGSixXQUZQO0FBTUQsU0FQRCxNQU9PLElBQUksU0FBUyxLQUFLLFlBQUwsRUFBVCxJQUFnQyxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsUUFBdEIsQ0FBK0IsZUFBL0IsQ0FBcEMsRUFBcUY7QUFDMUYsWUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQ0csV0FESCxDQUNlLGVBRGYsRUFFRyxHQUZILENBRU87QUFDSCxvQkFBUSxFQURMO0FBRUgsbUJBQU87QUFGSixXQUZQO0FBTUQsU0FQTSxNQU9BLElBQUksVUFBVSxNQUFWLElBQW9CLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixRQUF0QixDQUErQixlQUEvQixDQUF4QixFQUF5RTtBQUM5RSxZQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFDRyxXQURILENBQ2UsZUFEZixFQUVHLEdBRkgsQ0FFTztBQUNILG9CQUFRLEVBREw7QUFFSCxtQkFBTyxLQUFLLFlBQUw7QUFGSixXQUZQO0FBTUQ7QUFDRjtBQUNGOzs7a0NBRWEsSSxFQUFNO0FBQ2xCLFVBQUksZUFBZSxTQUFTLEtBQUssTUFBTCxHQUFjLE1BQWQsR0FBdUIsSUFBaEMsRUFBc0MsRUFBdEMsQ0FBbkI7QUFDQSxVQUFJLFdBQVcsU0FBUyxLQUFLLE1BQUwsR0FBYyxJQUF2QixFQUE2QixFQUE3QixDQUFmO0FBQ0EsYUFBUSxlQUFlLFFBQXZCO0FBQ0Q7OzttQ0FFYztBQUNiLFVBQUksZUFBZSxLQUFLLFlBQUwsRUFBbkI7QUFDQSxVQUFJLFlBQVksRUFBRSxNQUFGLEVBQVUsU0FBVixFQUFoQjtBQUNBLFVBQUksTUFBTSxZQUFZLFlBQVosR0FBMkIsRUFBckM7QUFDQSxhQUFPLEdBQVA7QUFDRDs7O29DQUVlO0FBQ2QsVUFBSSxFQUFFLGlDQUFGLEVBQXFDLE1BQXpDLEVBQWlEO0FBQy9DLFVBQUUsaUNBQUYsRUFBcUMsVUFBckMsQ0FBZ0QsT0FBaEQsRUFBeUQsV0FBekQsQ0FBcUUsZUFBckU7QUFDRDtBQUNGOztBQUVEOzs7OzZCQUNTLEksRUFBTSxJLEVBQU0sUyxFQUFXO0FBQzlCLFVBQUksT0FBSjtBQUNBLGFBQU8sWUFBWTtBQUNqQixZQUFJLFVBQVUsSUFBZDtBQUNBLFlBQUksT0FBTyxTQUFYO0FBQ0EsWUFBSSxRQUFRLFNBQVIsS0FBUSxHQUFZO0FBQ3RCLG9CQUFVLElBQVY7QUFDQSxjQUFJLENBQUMsU0FBTCxFQUFnQixLQUFLLEtBQUwsQ0FBVyxPQUFYLEVBQW9CLElBQXBCO0FBQ2pCLFNBSEQ7QUFJQSxZQUFJLFVBQVUsYUFBYSxDQUFDLE9BQTVCO0FBQ0EscUJBQWEsT0FBYjtBQUNBLGtCQUFVLFdBQVcsS0FBWCxFQUFrQixJQUFsQixDQUFWO0FBQ0EsWUFBSSxPQUFKLEVBQWEsS0FBSyxLQUFMLENBQVcsT0FBWCxFQUFvQixJQUFwQjtBQUNkLE9BWEQ7QUFZRDs7OzJCQUVNO0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxLQUFQO0FBQ3ZDLFdBQUssVUFBTDtBQUNBLGFBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBSyxRQUFMLENBQWMsS0FBSyxhQUFuQixFQUFrQyxHQUFsQyxDQUFsQztBQUNBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7a0JBR1ksSUFBSSxNQUFKLEU7Ozs7Ozs7Ozs7Ozs7SUMvRlQsYztBQUNKLDRCQUFjO0FBQUE7O0FBQ1osU0FBSyxHQUFMLEdBQVc7QUFDVCxpQkFBVyxpQkFERjtBQUVULFlBQU0sdUJBRkc7QUFHVCxzQkFBZ0IsMENBSFA7QUFJVCxvQkFBYztBQUpMLEtBQVg7O0FBT0EsU0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQVo7QUFDQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixDQUFsQjtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBakI7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixDQUFoQjtBQUNEOzs7O29DQUVlO0FBQ2QsVUFBTSxTQUFTLEVBQUUscUNBQUYsRUFBeUMsSUFBekMsQ0FBOEMsU0FBOUMsQ0FBZjtBQUNBLGFBQVEsU0FBUyxNQUFULEdBQWtCLEVBQTFCO0FBQ0Q7OztpQ0FFWTtBQUNYLFFBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxRQUFmLEVBQXlCLEtBQUssR0FBTCxDQUFTLElBQWxDLEVBQXdDLEtBQUssVUFBN0M7QUFDRDs7OytCQUVVO0FBQ1QsUUFBRSxLQUFLLEdBQUwsQ0FBUyxJQUFYLEVBQWlCLElBQWpCLENBQXNCLFVBQUMsS0FBRCxFQUFRLElBQVIsRUFBaUI7QUFDckMsVUFBRSxJQUFGLEVBQVEsUUFBUixDQUFpQjtBQUNmLDBCQUFnQix3QkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNsQyxnQkFBSSxRQUFRLElBQVIsQ0FBYSxNQUFiLE1BQXlCLFVBQTdCLEVBQXlDO0FBQ3ZDLG9CQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxHQUFvQixJQUFwQixDQUF5QixPQUF6QixDQUFsQjtBQUNELGFBRkQsTUFFTyxJQUFJLFFBQVEsRUFBUixDQUFXLFFBQVgsQ0FBSixFQUEwQjtBQUMvQixvQkFBTSxXQUFOLENBQWtCLFFBQVEsTUFBUixFQUFsQjtBQUNBLHNCQUFRLE1BQVIsR0FBaUIsSUFBakIsQ0FBc0Isa0JBQXRCLEVBQTBDLFFBQTFDLENBQW1ELE9BQW5EO0FBQ0QsYUFITSxNQUdBO0FBQ0wsb0JBQU0sV0FBTixDQUFrQixPQUFsQjtBQUNEO0FBQ0YsV0FWYztBQVdmLG1CQUFTLGlCQUFDLEtBQUQsRUFBVztBQUNsQixnQkFBSSxVQUFVLEVBQUUsS0FBRixFQUFTLE9BQVQsQ0FBaUIsdUJBQWpCLENBQWQ7QUFDQSxnQkFBSSxRQUFRLElBQVIsQ0FBYSxRQUFiLEVBQXVCLE1BQXZCLEdBQWdDLENBQXBDLEVBQXVDO0FBQ3JDLHNCQUFRLElBQVIsQ0FBYSxrQkFBYixFQUFpQyxXQUFqQyxDQUE2QyxPQUE3QztBQUNEO0FBQ0Y7QUFoQmMsU0FBakI7QUFrQkQsT0FuQkQ7QUFvQkQ7OzsrQkFFVSxDLEVBQUc7QUFBQTs7QUFDWixRQUFFLGNBQUY7QUFDQSxVQUFJLFFBQVEsRUFBRSxFQUFFLE1BQUosQ0FBWjtBQUNBLFVBQUksV0FBVyxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FBZjtBQUNBLFFBQUUsSUFBRixDQUFPLEtBQUssYUFBTCxLQUF1QixNQUFNLElBQU4sQ0FBVyxRQUFYLENBQTlCLEVBQW9ELFFBQXBELEVBQThELFVBQUMsSUFBRCxFQUFVO0FBQ3RFLFlBQUksS0FBSyxNQUFMLEtBQWdCLElBQXBCLEVBQTBCO0FBQ3hCLGdCQUFLLFdBQUw7QUFDRCxTQUZELE1BRU87QUFDTCxnQkFBSyxTQUFMO0FBQ0Q7QUFDRixPQU5EO0FBT0Q7OztnQ0FFVyxLLEVBQU87QUFDakIsVUFBSSxpQkFBaUIsTUFBTSxjQUFOLEVBQXJCO0FBQ0EsVUFBSSxlQUFlLEVBQW5CO0FBQ0EsUUFBRSxHQUFGLENBQU0sY0FBTixFQUFzQixVQUFDLENBQUQ7QUFBQSxlQUFRLGFBQWEsRUFBRSxJQUFmLElBQXVCLEVBQUUsS0FBakM7QUFBQSxPQUF0QjtBQUNBLGFBQU8sWUFBUDtBQUNEOzs7a0NBRWE7QUFDWixRQUFFLEtBQUssR0FBTCxDQUFTLGNBQVgsRUFBMkIsUUFBM0IsQ0FBb0MsdUNBQXBDO0FBQ0Q7OztnQ0FFVztBQUNWLFFBQUUsS0FBSyxHQUFMLENBQVMsWUFBWCxFQUF5QixRQUF6QixDQUFrQyx1Q0FBbEM7QUFDRDs7OzJCQUVNO0FBQ0wsVUFBSSxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsTUFBdEIsSUFBZ0MsQ0FBcEMsRUFBdUMsT0FBTyxLQUFQO0FBQ3ZDLFdBQUssVUFBTDtBQUNBLFdBQUssUUFBTDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7a0JBR1ksSUFBSSxjQUFKLEU7Ozs7Ozs7Ozs7Ozs7SUN2RlQsSztBQUNKLGlCQUFZLElBQVosRUFBa0IsUUFBbEIsRUFBNEI7QUFBQTs7QUFDMUIsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFNBQUssUUFBTCxHQUFnQixRQUFoQjtBQUNBLFNBQUssRUFBTCxHQUFVLE1BQU0sS0FBSyxNQUFMLEdBQWMsUUFBZCxDQUF1QixFQUF2QixFQUEyQixNQUEzQixDQUFrQyxDQUFsQyxFQUFxQyxDQUFyQyxDQUFoQjs7QUFFQSxTQUFLLE9BQUwsR0FBZSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLElBQWxCLENBQWY7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQW5CO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBWjs7QUFFQSxRQUFJLFFBQVEsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVo7QUFDQSxVQUFNLFlBQU4sQ0FBbUIsSUFBbkIsRUFBeUIsS0FBSyxFQUE5QjtBQUNBLFVBQU0sWUFBTixDQUFtQixPQUFuQixFQUE0QixPQUE1QjtBQUNBLFFBQUksUUFBUSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWjtBQUNBLFVBQU0sWUFBTixDQUFtQixPQUFuQixFQUE0QixPQUE1QjtBQUNBLFVBQU0sU0FBTixHQUFrQixLQUFLLElBQXZCO0FBQ0EsVUFBTSxXQUFOLENBQWtCLEtBQWxCO0FBQ0EsYUFBUyxJQUFULENBQWMsV0FBZCxDQUEwQixLQUExQjtBQUNBLFNBQUssTUFBTCxHQUFjLEVBQUUsTUFBTSxLQUFLLEVBQWIsQ0FBZDtBQUNEOzs7OzRCQUVPLEksRUFBTTtBQUNaLFdBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxXQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLFFBQWpCLEVBQTJCLElBQTNCLENBQWdDLEtBQUssSUFBckM7QUFDRDs7O2dDQUVXLFEsRUFBVTtBQUNwQixXQUFLLFFBQUwsR0FBZ0IsUUFBaEI7QUFDRDs7OzJCQUVNO0FBQUE7O0FBQ0wsV0FBSyxNQUFMLENBQVksUUFBWixDQUFxQixNQUFyQjs7QUFFQSxpQkFBVyxZQUFNO0FBQ2YsY0FBSyxNQUFMLENBQVksV0FBWixDQUF3QixNQUF4QjtBQUNELE9BRkQsRUFFRyxLQUFLLFFBRlI7QUFHRDs7Ozs7O2tCQUdZLEs7Ozs7Ozs7Ozs7Ozs7SUN2Q1QsUztBQUNKLHVCQUFjO0FBQUE7O0FBQ1osU0FBSyxNQUFMLEdBQWM7QUFDWixnQkFBVSwrQkFERTtBQUVaLHVCQUFpQixtREFGTDtBQUdaLHdCQUFrQixnREFITjtBQUlaLHdCQUFrQjtBQUpOLEtBQWQ7O0FBT0EsU0FBSyxHQUFMLEdBQVc7QUFDVCxpQkFBVztBQURGLEtBQVg7O0FBSUEsU0FBSyxhQUFMLEdBQXFCLEtBQUssYUFBTCxDQUFtQixJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbkI7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUFaO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixDQUFsQjtBQUNBLFNBQUssVUFBTCxHQUFrQixLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBbEI7O0FBRUEsU0FBSyxnQkFBTCxHQUF3QixLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBQXhCO0FBQ0EsU0FBSyxxQkFBTCxHQUE2QixLQUFLLHFCQUFMLENBQTJCLElBQTNCLENBQWdDLElBQWhDLENBQTdCOztBQUVBLFNBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLENBQWhCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFuQjtBQUNEOzs7O29DQUVlO0FBQ2QsVUFBTSxTQUFTLEVBQUUscUNBQUYsRUFBeUMsSUFBekMsQ0FBOEMsU0FBOUMsQ0FBZjtBQUNBLGFBQVEsU0FBUyxNQUFULEdBQWtCLEVBQTFCO0FBQ0Q7OztrQ0FFYTtBQUNaLFVBQU0sT0FBTyxFQUFFLG1DQUFGLEVBQXVDLElBQXZDLENBQTRDLFNBQTVDLENBQWI7QUFDQSxhQUFRLE9BQU8sSUFBUCxHQUFjLEVBQXRCO0FBQ0Q7OzsyQkFFTTtBQUNMLFVBQUksRUFBRSxLQUFLLEdBQUwsQ0FBUyxTQUFYLEVBQXNCLE1BQXRCLElBQWdDLENBQXBDLEVBQXVDLE9BQU8sS0FBUDtBQUN2QyxXQUFLLFVBQUw7QUFDQSxhQUFPLElBQVA7QUFDRDs7O2lDQUVZO0FBQUE7O0FBQ1gsUUFBRSxNQUFGLEVBQVUsRUFBVixDQUFhLGtCQUFiLEVBQWlDLFVBQUMsR0FBRCxFQUFNLFNBQU4sRUFBb0I7QUFDbkQsY0FBSyxRQUFMLENBQWMsU0FBZDtBQUNELE9BRkQ7QUFHQSxRQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEscUJBQWIsRUFBb0MsWUFBTTtBQUN4QyxjQUFLLFdBQUw7QUFDRCxPQUZEOztBQUlBLFVBQUksT0FBTyxFQUFFLEtBQUssR0FBTCxDQUFTLFNBQVgsRUFBc0IsSUFBdEIsQ0FBMkIsTUFBM0IsQ0FBWDtBQUNBLFVBQUksS0FBSyxNQUFMLEdBQWMsQ0FBbEIsRUFBcUI7QUFDbkIsZUFBTyxTQUFQLENBQWlCLFNBQWpCLENBQTJCLDBCQUEzQixFQUF1RCxVQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ3pFLGNBQUksVUFBVSxFQUFFLE9BQUYsRUFBVyxPQUFYLENBQW1CLE1BQW5CLENBQWQ7QUFDQSxjQUFJLDRCQUE0QixRQUFRLElBQVIsQ0FBYSw4QkFBYixDQUFoQztBQUNBLGNBQUksZUFBZSxRQUFRLElBQVIsQ0FBYSxzQ0FBYixDQUFuQjtBQUNBLGNBQUksbUJBQW1CLFFBQVEsSUFBUixDQUFhLDBDQUFiLENBQXZCOztBQUVBLGlCQUFTLGFBQWEsR0FBYixPQUF1QixFQUF2QixJQUE2QixpQkFBaUIsR0FBakIsT0FBMkIsRUFBekQsSUFBaUUsMEJBQTBCLEVBQTFCLENBQTZCLFVBQTdCLEtBQTRDLEVBQUUsT0FBRixFQUFXLEdBQVgsT0FBcUIsRUFBMUk7QUFDRCxTQVBELEVBT0csc0NBUEg7O0FBU0EsZUFBTyxTQUFQLENBQWlCLFNBQWpCLENBQTJCLG1CQUEzQixFQUFnRCxVQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ2xFLGNBQUksRUFBRSxPQUFGLEVBQVcsR0FBWCxPQUFxQixFQUF6QixFQUE2QixPQUFPLElBQVA7QUFDN0IsaUJBQU8sSUFBSSxNQUFKLENBQVcsOERBQVgsRUFBMkUsSUFBM0UsQ0FBZ0YsS0FBaEYsQ0FBUDtBQUNELFNBSEQsRUFHRyw4QkFISDs7QUFLQSxlQUFPLFNBQVAsQ0FBaUIsU0FBakIsQ0FBMkIsa0JBQTNCLEVBQStDLFVBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDakUsaUJBQVEsRUFBRSxNQUFNLEVBQUUsT0FBRixFQUFXLElBQVgsQ0FBZ0IsY0FBaEIsQ0FBUixFQUF5QyxHQUF6QyxPQUFtRCxFQUFFLE9BQUYsRUFBVyxHQUFYLEVBQTNEO0FBQ0QsU0FGRCxFQUVHLHdCQUZIOztBQUlBLGFBQUssUUFBTCxDQUFjO0FBQ1osaUJBQU87QUFDTCx3Q0FBNEIsMEJBRHZCO0FBRUwsb0NBQXdCLG1CQUZuQjtBQUdMLHdDQUE0QjtBQUh2QixXQURLO0FBTVosMEJBQWdCLHdCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ2xDLGdCQUFJLFFBQVEsSUFBUixDQUFhLE1BQWIsTUFBeUIsVUFBN0IsRUFBeUM7QUFDdkMsb0JBQU0sV0FBTixDQUFrQixFQUFFLE9BQUYsRUFBVyxNQUFYLEdBQW9CLElBQXBCLENBQXlCLE9BQXpCLENBQWxCO0FBQ0QsYUFGRCxNQUVPLElBQUksUUFBUSxJQUFSLENBQWEsTUFBYixNQUF5QixVQUE3QixFQUF5QztBQUM5QyxnQkFBRSxPQUFGLEVBQVcsTUFBWCxDQUFrQixLQUFsQjtBQUNBLG9CQUFNLFdBQU4sQ0FBa0IsRUFBRSxPQUFGLEVBQVcsTUFBWCxFQUFsQjtBQUNELGFBSE0sTUFHQSxJQUFJLFFBQVEsSUFBUixDQUFhLE1BQWIsTUFBeUIsUUFBN0IsRUFBdUM7QUFDNUMsb0JBQU0sV0FBTixDQUFrQixFQUFFLE9BQUYsRUFBVyxNQUFYLEVBQWxCO0FBQ0QsYUFGTSxNQUVBO0FBQ0wsb0JBQU0sV0FBTixDQUFrQixPQUFsQjtBQUNEO0FBQ0YsV0FqQlc7QUFrQloseUJBQWUsdUJBQUMsV0FBRCxFQUFpQjtBQUM5QixrQkFBSyxnQkFBTCxDQUFzQixXQUF0QjtBQUNBLG1CQUFPLEtBQVA7QUFDRDtBQXJCVyxTQUFkO0FBdUJEO0FBQ0Y7OzsrQkFFVSxJLEVBQU07QUFDZixVQUFJLFNBQVMsT0FBTyxHQUFwQjtBQUNBLFVBQUksS0FBSyxTQUFTLE1BQVQsQ0FBZ0IsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FBVDtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxHQUFHLE1BQXZCLEVBQStCLEdBQS9CLEVBQW9DO0FBQ2xDLFlBQUksSUFBSSxHQUFHLENBQUgsQ0FBUjtBQUNBLGVBQU8sRUFBRSxNQUFGLENBQVMsQ0FBVCxNQUFnQixHQUF2QjtBQUE0QixjQUFJLEVBQUUsU0FBRixDQUFZLENBQVosRUFBZSxFQUFFLE1BQWpCLENBQUo7QUFBNUIsU0FDQSxJQUFJLEVBQUUsT0FBRixDQUFVLE1BQVYsTUFBc0IsQ0FBMUIsRUFBNkIsT0FBTyxFQUFFLFNBQUYsQ0FBWSxPQUFPLE1BQW5CLEVBQTJCLEVBQUUsTUFBN0IsQ0FBUDtBQUM5Qjs7QUFFRCxhQUFPLElBQVA7QUFDRDs7O3FDQUVnQixJLEVBQU07QUFBQTs7QUFDckIsVUFBSSxNQUFNLEVBQUUsSUFBRixDQUFWO0FBQ0EsVUFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsR0FBbEMsQ0FBc0MsZ0JBQXRDO0FBQ0EsVUFBSSxJQUFKLENBQVMsdUJBQVQsRUFBa0MsSUFBbEMsQ0FBdUMsZ0JBQXZDOztBQUVBLFVBQUksU0FBUyxLQUFLLFVBQUwsQ0FBZ0IsZUFBaEIsQ0FBYjtBQUNBLFVBQUksV0FBVyxJQUFmLEVBQXFCO0FBQ25CLFlBQUksUUFBUSxPQUFPLEtBQVAsQ0FBYSxHQUFiLENBQVo7QUFDQSxZQUFJLE1BQU0sTUFBTixJQUFnQixDQUFwQixFQUF1QjtBQUNyQixZQUFFLEdBQUYsQ0FBTSxLQUFLLGFBQUwsS0FBdUIsS0FBSyxNQUFMLENBQVksUUFBekMsRUFBbUQsVUFBQyxhQUFELEVBQW1CO0FBQ3BFLGdCQUFJLFlBQVksY0FBYyxLQUE5QjtBQUNBLGNBQUUsSUFBRixDQUFPO0FBQ0wsbUJBQUssT0FBSyxhQUFMLEtBQXVCLE9BQUssTUFBTCxDQUFZLGdCQURuQztBQUVMLG9CQUFNLEVBQUUsVUFBVSxNQUFNLENBQU4sQ0FBWixFQUFzQixPQUFPLE1BQU0sQ0FBTixDQUE3QixFQUZEO0FBR0wsb0JBQU0sTUFIRDtBQUlMLHVCQUFTLEVBQUUsY0FBYyxTQUFoQixFQUpKO0FBS0wsd0JBQVUsTUFMTDtBQU1MLHVCQUFTLGlCQUFDLGtCQUFELEVBQXdCO0FBQy9CLG9CQUFJLGtCQUFKLEVBQXdCO0FBQ3RCLHNCQUFJLG1CQUFtQixNQUFuQixLQUE4QixJQUFsQyxFQUF3QztBQUN0QyxzQkFBRSxNQUFGLEVBQVUsT0FBVixDQUFrQixxQkFBbEIsRUFBeUMsQ0FBRSxrQkFBRixFQUFzQixJQUF0QixDQUF6QztBQUNBLDJCQUFLLHFCQUFMLENBQTJCLElBQTNCLEVBQWlDLGtCQUFqQztBQUNELG1CQUhELE1BR087QUFDTCwwQkFBTSwrRkFBTjtBQUNEO0FBQ0YsaUJBUEQsTUFPTztBQUNMLHdCQUFNLCtGQUFOO0FBQ0Q7QUFDRjtBQWpCSSxhQUFQO0FBbUJELFdBckJEO0FBc0JELFNBdkJELE1BdUJPO0FBQ0wsZ0JBQU0sK0ZBQU47QUFDRDtBQUNGLE9BNUJELE1BNEJPO0FBQ0wsWUFBSSxnQkFBZ0IsS0FBSyxVQUFMLENBQWdCLGtCQUFoQixDQUFwQjtBQUNBLFlBQUksa0JBQWtCLElBQXRCLEVBQTRCO0FBQzFCLGNBQUksZUFBZSxjQUFjLEtBQWQsQ0FBb0IsR0FBcEIsQ0FBbkI7QUFDQSxjQUFJLGFBQWEsTUFBYixJQUF1QixDQUEzQixFQUE4QjtBQUM1QixjQUFFLEdBQUYsQ0FBTSxLQUFLLGFBQUwsS0FBdUIsS0FBSyxNQUFMLENBQVksUUFBekMsRUFBbUQsVUFBQyxhQUFELEVBQW1CO0FBQ3BFLGtCQUFJLFlBQVksY0FBYyxLQUE5QjtBQUNBLGdCQUFFLElBQUYsQ0FBTztBQUNMLHFCQUFLLE9BQUssYUFBTCxLQUF1QixPQUFLLE1BQUwsQ0FBWSxlQURuQztBQUVMLHNCQUFNLEVBQUUsVUFBVSxhQUFhLENBQWIsQ0FBWixFQUE2QixlQUFlLGFBQWEsQ0FBYixDQUE1QyxFQUZEO0FBR0wsc0JBQU0sTUFIRDtBQUlMLHlCQUFTLEVBQUUsY0FBYyxTQUFoQixFQUpKO0FBS0wsMEJBQVUsTUFMTDtBQU1MLHlCQUFTLGlCQUFDLGVBQUQsRUFBcUI7QUFDNUIsc0JBQUksZUFBSixFQUFxQjtBQUNuQix3QkFBSSxnQkFBZ0IsTUFBaEIsS0FBMkIsSUFBL0IsRUFBcUM7QUFDbkMsd0JBQUUsTUFBRixFQUFVLE9BQVYsQ0FBa0IscUJBQWxCLEVBQXlDLENBQUUsZUFBRixFQUFtQixJQUFuQixDQUF6QztBQUNBLDZCQUFLLGdCQUFMLENBQXNCLElBQXRCO0FBQ0QscUJBSEQsTUFHTztBQUNMLDRCQUFNLCtGQUFOO0FBQ0Q7QUFDRixtQkFQRCxNQU9PO0FBQ0wsMEJBQU0sK0ZBQU47QUFDRDtBQUNGO0FBakJJLGVBQVA7QUFtQkQsYUFyQkQ7QUFzQkQsV0F2QkQsTUF1Qk87QUFDTCxrQkFBTSwrRkFBTjtBQUNEO0FBQ0YsU0E1QkQsTUE0Qk87QUFDTCxnQkFBTSw2RkFBTjtBQUNEO0FBQ0Y7QUFDRjs7OzBDQUVxQixJLEVBQU0sTyxFQUFTO0FBQUE7O0FBQ25DLFVBQUksTUFBTSxFQUFFLElBQUYsQ0FBVjs7QUFFQSxVQUFJLFdBQVcsSUFBSSxJQUFKLENBQVMsd0JBQVQsRUFBbUMsR0FBbkMsRUFBZjtBQUNBLFVBQUksU0FBUyxJQUFULE9BQW9CLFFBQVEsa0JBQWhDLEVBQW9EO0FBQ2xELG1CQUFXLEVBQVg7QUFDRDs7QUFFRCxVQUFJLGFBQWEsRUFBakI7QUFDQSxVQUFJLElBQUosQ0FBUywyQ0FBVCxFQUFzRCxJQUF0RCxDQUEyRCxVQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWlCO0FBQzFFLFlBQUksV0FBVyxNQUFYLEdBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLHdCQUFjLEdBQWQ7QUFDRDtBQUNELHNCQUFjLEVBQUUsSUFBRixFQUFRLEdBQVIsRUFBZDtBQUNELE9BTEQ7O0FBT0EsVUFBSSxPQUFPO0FBQ1QsZUFBTyxRQUFRLEtBRE47O0FBR1QsbUJBQVcsSUFBSSxJQUFKLENBQVMsNEJBQVQsRUFBdUMsR0FBdkMsRUFIRjtBQUlULGtCQUFVLElBQUksSUFBSixDQUFTLDJCQUFULEVBQXNDLEdBQXRDLEVBSkQ7QUFLVCxrQkFBVSxRQUFRLGtCQUxUO0FBTVQscUJBQWEsUUFOSjs7QUFRVCxrQkFBVSxJQUFJLElBQUosQ0FBUyxrQ0FBVCxFQUE2QyxHQUE3QyxFQVJEO0FBU1QscUJBQWEsSUFBSSxJQUFKLENBQVMsOEJBQVQsRUFBeUMsR0FBekMsRUFUSjs7QUFXVCxrQkFBVSxJQUFJLElBQUosQ0FBUywyQkFBVCxFQUFzQyxHQUF0QyxFQVhEO0FBWVQsaUJBQVMsSUFBSSxJQUFKLENBQVMsOEJBQVQsRUFBeUMsR0FBekMsRUFaQTtBQWFULGNBQU0sSUFBSSxJQUFKLENBQVMsZ0NBQVQsRUFBMkMsR0FBM0MsRUFiRztBQWNULGdCQUFRLElBQUksSUFBSixDQUFTLGtDQUFULEVBQTZDLEdBQTdDLEVBZEM7O0FBZ0JULGlCQUFTLElBQUksSUFBSixDQUFTLDJCQUFULEVBQXNDLEVBQXRDLENBQXlDLFVBQXpDLENBaEJBOztBQWtCVCxjQUFNO0FBbEJHLE9BQVg7O0FBcUJBLFVBQUssRUFBRSxJQUFGLENBQU8sS0FBSyxTQUFaLEVBQXVCLE1BQXZCLEtBQWtDLENBQW5DLElBQTBDLEVBQUUsSUFBRixDQUFPLEtBQUssUUFBWixFQUFzQixNQUF0QixLQUFpQyxDQUEzRSxJQUFrRixFQUFFLElBQUYsQ0FBTyxLQUFLLFFBQVosRUFBc0IsTUFBdEIsS0FBaUMsQ0FBdkgsRUFBMkg7QUFDekgsY0FBTSw2REFBTjtBQUNELE9BRkQsTUFFTztBQUNMLFlBQUksSUFBSixDQUFTLGtDQUFULEVBQTZDLElBQTdDLENBQWtELGdCQUFsRDtBQUNBLFlBQUksSUFBSixDQUFTLHVCQUFULEVBQWtDLEdBQWxDLENBQXNDLGdCQUF0Qzs7QUFFQSxVQUFFLEdBQUYsQ0FBTSxLQUFLLGFBQUwsS0FBdUIsS0FBSyxNQUFMLENBQVksUUFBekMsRUFBbUQsVUFBQyxhQUFELEVBQW1CO0FBQ3BFLGNBQUksWUFBWSxjQUFjLEtBQTlCO0FBQ0EsWUFBRSxJQUFGLENBQU87QUFDTCxpQkFBSyxPQUFLLGFBQUwsS0FBdUIsT0FBSyxNQUFMLENBQVksZ0JBRG5DO0FBRUwsa0JBQU0sSUFGRDtBQUdMLGtCQUFNLE1BSEQ7QUFJTCxxQkFBUyxFQUFFLGNBQWMsU0FBaEIsRUFKSjtBQUtMLHNCQUFVLE1BTEw7QUFNTCxxQkFBUyxpQkFBQyxxQkFBRCxFQUEyQjtBQUNsQyxrQkFBSSxxQkFBSixFQUEyQjtBQUN6QixrQkFBRSxNQUFGLEVBQVUsT0FBVixDQUFrQixxQkFBbEIsRUFBeUMsQ0FBRSxxQkFBRixFQUF5QixJQUF6QixDQUF6Qzs7QUFFQSxvQkFBSSxzQkFBc0IsTUFBdEIsS0FBaUMsSUFBckMsRUFBMkM7QUFDekMsc0JBQUksSUFBSixDQUFTLHFCQUFULEVBQWdDLElBQWhDOztBQUVBLHNCQUFJLEtBQUssV0FBTCxDQUFpQixNQUFqQixHQUEwQixDQUE5QixFQUFpQztBQUMvQix3QkFBSSxJQUFKLENBQVMsd0JBQVQsRUFBbUMsVUFBbkMsQ0FBOEMsVUFBOUM7QUFDQSx3QkFBSSxJQUFKLENBQVMsOEJBQVQsRUFBeUMsSUFBekM7QUFDRDtBQUNELHNCQUFJLElBQUosQ0FBUyxrQ0FBVCxFQUE2QyxHQUE3QyxDQUFpRCxFQUFqRDtBQUNBLHNCQUFJLElBQUosQ0FBUyw4QkFBVCxFQUF5QyxHQUF6QyxDQUE2QyxFQUE3QztBQUNBLHNCQUFJLElBQUosQ0FBUyxrQ0FBVCxFQUE2QyxHQUE3QyxDQUFpRCxFQUFqRDs7QUFFQSxvQkFBRSxnREFBRixFQUFvRCxJQUFwRCxDQUF5RCxLQUFLLFNBQTlEO0FBQ0Esb0JBQUUsa0RBQUYsRUFBc0QsSUFBdEQsQ0FBMkQsS0FBSyxTQUFoRTtBQUNBLG9CQUFFLE1BQUYsRUFBVSxTQUFWLENBQW9CLENBQXBCO0FBQ0QsaUJBZEQsTUFjTztBQUNMLHdCQUFNLGlFQUFpRSxzQkFBc0IsS0FBN0Y7QUFDRDtBQUNGLGVBcEJELE1Bb0JPO0FBQ0wsc0JBQU0sMkZBQU47QUFDRDtBQUNELGtCQUFJLElBQUosQ0FBUyxrQ0FBVCxFQUE2QyxJQUE3QyxDQUFrRCxRQUFsRDtBQUNBLGtCQUFJLElBQUosQ0FBUyx1QkFBVCxFQUFrQyxHQUFsQyxDQUFzQyxRQUF0QztBQUNEO0FBaENJLFdBQVA7QUFrQ0QsU0FwQ0Q7QUFxQ0Q7O0FBRUQsVUFBSSxJQUFKLENBQVMsa0NBQVQsRUFBNkMsSUFBN0MsQ0FBa0QsUUFBbEQ7QUFDQSxVQUFJLElBQUosQ0FBUyx1QkFBVCxFQUFrQyxHQUFsQyxDQUFzQyxRQUF0QztBQUNEOzs7NkJBRVEsUyxFQUFXO0FBQUE7O0FBQ2xCLFVBQUksYUFBYSxVQUFVLE1BQXZCLElBQWlDLFVBQVUsTUFBVixLQUFxQixJQUExRCxFQUFnRTtBQUM5RCxVQUFFLEdBQUYsQ0FBTSxLQUFLLGFBQUwsS0FBdUIsS0FBSyxNQUFMLENBQVksUUFBekMsRUFBbUQsVUFBQyxhQUFELEVBQW1CO0FBQ3BFLGNBQUksWUFBWSxjQUFjLEtBQTlCOztBQUVBLFlBQUUsSUFBRixDQUFPO0FBQ0wsaUJBQUssT0FBSyxhQUFMLEtBQXVCLE9BQUssTUFBTCxDQUFZLGdCQURuQztBQUVMLGtCQUFNLEVBQUUsVUFBVSxVQUFVLFFBQXRCLEVBQWdDLE9BQU8sVUFBVSxLQUFqRCxFQUZEO0FBR0wsa0JBQU0sTUFIRDtBQUlMLHFCQUFTLEVBQUUsY0FBYyxTQUFoQixFQUpKO0FBS0wsc0JBQVUsTUFMTDtBQU1MLHFCQUFTLGlCQUFDLGtCQUFELEVBQXdCO0FBQy9CLGtCQUFJLGtCQUFKLEVBQXdCO0FBQ3RCLG9CQUFJLG1CQUFtQixNQUFuQixLQUE4QixJQUFsQyxFQUF3QztBQUN0QyxzQkFBSSxnQkFBZ0IsRUFBRSxPQUFLLEdBQUwsQ0FBUyxTQUFYLENBQXBCO0FBQ0Esb0JBQUUsTUFBRixFQUFVLE9BQVYsQ0FBa0IscUJBQWxCLEVBQXlDLENBQUUsa0JBQUYsRUFBc0IsSUFBdEIsQ0FBekM7O0FBRUEsZ0NBQWMsSUFBZCxDQUFtQixvQkFBbkIsRUFBeUMsSUFBekMsQ0FBOEMsbUJBQW1CLHNCQUFqRTs7QUFFQSxnQ0FBYyxJQUFkLENBQW1CLDRCQUFuQixFQUFpRCxHQUFqRCxDQUFxRCxtQkFBbUIsc0JBQXhFO0FBQ0EsZ0NBQWMsSUFBZCxDQUFtQiwyQkFBbkIsRUFBZ0QsR0FBaEQsQ0FBb0QsbUJBQW1CLHFCQUF2RTtBQUNBLGdDQUFjLElBQWQsQ0FBbUIsd0JBQW5CLEVBQTZDLEdBQTdDLENBQWlELG1CQUFtQixrQkFBcEU7O0FBRUEsZ0NBQWMsSUFBZCxDQUFtQiwyQkFBbkIsRUFBZ0QsR0FBaEQsQ0FBb0QsbUJBQW1CLHFCQUF2RTtBQUNBLGdDQUFjLElBQWQsQ0FBbUIsOEJBQW5CLEVBQW1ELEdBQW5ELENBQXVELG1CQUFtQixvQkFBMUU7O0FBRUEsZ0NBQWMsSUFBZCxDQUFtQixnQ0FBbkIsRUFBcUQsR0FBckQsQ0FBeUQsbUJBQW1CLGlCQUE1RTtBQUNBLGdDQUFjLElBQWQsQ0FBbUIsa0NBQW5CLEVBQXVELEdBQXZELENBQTJELG1CQUFtQixtQkFBOUU7O0FBRUEsc0JBQUksbUJBQW1CLG9CQUFuQixLQUE0QyxNQUFoRCxFQUF3RDtBQUN0RCxrQ0FBYyxJQUFkLENBQW1CLDJCQUFuQixFQUFnRCxJQUFoRCxDQUFxRCxTQUFyRCxFQUFnRSxJQUFoRTtBQUNELG1CQUZELE1BRU87QUFDTCxrQ0FBYyxJQUFkLENBQW1CLDJCQUFuQixFQUFnRCxJQUFoRCxDQUFxRCxTQUFyRCxFQUFnRSxLQUFoRTtBQUNEOztBQUVELGdDQUFjLElBQWQsQ0FBbUIsb0RBQW5CLEVBQXlFLElBQXpFLENBQThFLFNBQTlFLEVBQXlGLEtBQXpGO0FBQ0Esc0JBQUksYUFBYSxtQkFBbUIsaUJBQW5CLENBQXFDLEtBQXJDLENBQTJDLEdBQTNDLENBQWpCO0FBQ0EsdUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxXQUFXLE1BQS9CLEVBQXVDLEdBQXZDLEVBQTRDO0FBQzFDLGtDQUFjLElBQWQsQ0FBbUIsK0RBQStELFdBQVcsQ0FBWCxDQUEvRCxHQUErRSxJQUFsRyxFQUF3RyxJQUF4RyxDQUE2RyxTQUE3RyxFQUF3SCxJQUF4SDtBQUNEOztBQUVELHNCQUFJLG1CQUFtQix1QkFBbkIsS0FBK0MsT0FBbkQsRUFBNEQ7QUFDMUQsd0JBQUksbUJBQW1CLElBQW5CLEtBQTRCLEtBQWhDLEVBQXVDO0FBQ3JDLG9DQUFjLElBQWQsQ0FBbUIsOEJBQW5CLEVBQW1ELElBQW5EO0FBQ0Q7QUFDRixtQkFKRCxNQUlPO0FBQ0wsa0NBQWMsSUFBZCxDQUFtQix3QkFBbkIsRUFBNkMsSUFBN0MsQ0FBa0QsVUFBbEQsRUFBOEQsVUFBOUQ7QUFDRDs7QUFFRCxnQ0FBYyxPQUFkLENBQXNCLG9CQUF0QixFQUE0QyxXQUE1QyxDQUF3RCxVQUF4RDtBQUNBLGdDQUFjLElBQWQ7QUFDRCxpQkF0Q0QsTUFzQ087QUFDTCx3QkFBTSw0RkFBTjtBQUNEO0FBQ0YsZUExQ0QsTUEwQ087QUFDTCxzQkFBTSw0RkFBTjtBQUNEO0FBQ0Y7QUFwREksV0FBUDtBQXNERCxTQXpERDtBQTBERDtBQUNGOzs7a0NBRWE7QUFDWixVQUFJLEVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixRQUF0QixDQUErQixhQUEvQixDQUFKLEVBQW1EO0FBQ2pELFVBQUUsS0FBSyxHQUFMLENBQVMsU0FBWCxFQUFzQixJQUF0QjtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sUUFBUCxHQUFrQixLQUFLLFdBQUwsS0FBcUIsT0FBdkM7QUFDRDtBQUNGOzs7Ozs7a0JBR1ksSUFBSSxTQUFKLEU7Ozs7O0FDL1VmOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQU07QUFDdEIsTUFBSTtBQUNGLGFBQVMsV0FBVCxDQUFxQixZQUFyQjtBQUNBLE1BQUUsTUFBRixFQUFVLFFBQVYsQ0FBbUIsT0FBbkI7QUFDRCxHQUhELENBR0UsT0FBTyxDQUFQLEVBQVU7QUFDVjtBQUNEO0FBQ0QsTUFBSyxPQUFPLFVBQVAsQ0FBa0IsNEJBQWxCLEVBQWdELE9BQWpELElBQThELE9BQU8sU0FBUCxDQUFpQixVQUFuRixFQUFnRyxFQUFFLE1BQUYsRUFBVSxRQUFWLENBQW1CLEtBQW5CO0FBQ2hHO0FBQ0EsMkJBQWUsSUFBZjtBQUNBO0FBQ0EsdUJBQVcsSUFBWDtBQUNBLG1CQUFPLElBQVA7QUFDQSw4QkFBa0IsSUFBbEI7QUFDQSx3QkFBWSxJQUFaO0FBQ0EsMkJBQWUsSUFBZjtBQUNBLHFCQUFTLElBQVQ7QUFDQSw2QkFBaUIsSUFBakI7QUFDQTtBQUNBLHFCQUFTLElBQVQ7QUFDQSx5QkFBYSxJQUFiO0FBQ0EsdUJBQVcsSUFBWDtBQUNBLHNCQUFVLElBQVY7QUFDQSxxQkFBUyxJQUFUO0FBQ0EsbUJBQU8sSUFBUDtBQUNBLGlCQUFLLElBQUw7QUFDQSw0QkFBZ0IsSUFBaEI7QUFDQSx3QkFBWSxJQUFaO0FBQ0EsK0JBQW1CLElBQW5CO0FBQ0EsNEJBQWdCLElBQWhCO0FBQ0EseUJBQWEsSUFBYjtBQUNBLGlDQUFxQixJQUFyQjtBQUNBLHNCQUFVLElBQVY7QUFDQSw4QkFBa0IsSUFBbEI7QUFDQSxpQ0FBcUIsSUFBckI7QUFDQSwwQkFBYyxJQUFkO0FBQ0Esb0JBQVEsSUFBUjtBQUNBLDBCQUFjLElBQWQ7QUFDQSx1QkFBVyxJQUFYO0FBQ0Esd0JBQVksSUFBWjtBQUNELENBeENELEUsQ0FqQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyBBcnRpY2xlQ291bnRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZ2V0UGF0aFByZWZpeCA9IHRoaXMuZ2V0UGF0aFByZWZpeC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0UGF0aFByZWZpeCgpIHtcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvLyAvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvY291bnRlci9pbmRleC5qc29uXG4gICAgLy8gcCA9IC9jb250ZW50L2RobC9YWFhYXG4gICAgbGV0IGFydGljbGVQYWdlID0gJCgnLnBhZ2UtYm9keS5hcnRpY2xlLWNvdW50ZXInKTtcbiAgICBpZiAoYXJ0aWNsZVBhZ2UubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IHBhdGggPSBhcnRpY2xlUGFnZS5kYXRhKCdwYXRoJyk7XG4gICAgICBpZiAoJC50cmltKHBhdGgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgcDogcGF0aFxuICAgICAgICB9O1xuICAgICAgICAkLnBvc3QodGhpcy5nZXRQYXRoUHJlZml4KCkgKyAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL2NvdW50ZXIvaW5kZXguanNvbicsIGRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQXJ0aWNsZUNvdW50ZXIoKTtcbiIsImNsYXNzIEFydGljbGVHcmlkQXBpIHtcbiAgY29uc3RydWN0b3IoZW5kcG9pbnQsIHBhZ2VTaXplID0gNikge1xuICAgIHRoaXMuZW5kcG9pbnQgPSBlbmRwb2ludDtcbiAgICB0aGlzLnBhZ2VTaXplID0gcGFnZVNpemU7XG4gICAgdGhpcy5za2lwID0gMDtcblxuICAgIHRoaXMuZG9SZXF1ZXN0ID0gdGhpcy5kb1JlcXVlc3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNlYXJjaCA9IHRoaXMuc2VhcmNoLmJpbmQodGhpcyk7XG4gICAgdGhpcy5sb2FkTW9yZSA9IHRoaXMubG9hZE1vcmUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGRvUmVxdWVzdChjYWxsYmFjaywga2V5d29yZCA9IG51bGwpIHtcbiAgICAkLmdldCh0aGlzLmVuZHBvaW50LCB7XG4gICAgICBza2lwOiB0aGlzLnNraXAsXG4gICAgICBwYWdlU2l6ZTogdGhpcy5wYWdlU2l6ZSxcbiAgICAgIGtleXdvcmQ6IGtleXdvcmRcbiAgICB9LCAoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5za2lwICs9IGRhdGEuSXRlbXMubGVuZ3RoO1xuICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgfSk7XG4gIH1cblxuICBzZWFyY2goY2FsbGJhY2ssIGtleXdvcmQpIHtcbiAgICB0aGlzLnNraXAgPSAwO1xuICAgIHRoaXMuZG9SZXF1ZXN0KGNhbGxiYWNrLCBrZXl3b3JkKTtcbiAgfVxuXG4gIGxvYWRNb3JlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5kb1JlcXVlc3QoY2FsbGJhY2spO1xuICB9XG59XG5cbmNsYXNzIEFydGljbGVHcmlkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5oYXNtb3JlID0gdHJ1ZTtcblxuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLmFydGljbGVHcmlkJyxcbiAgICAgIGdyaWQ6ICcuYXJ0aWNsZUdyaWRfX2dyaWQnLFxuICAgICAgbG9hZE1vcmU6ICcuYXJ0aWNsZUdyaWRfX2xvYWRNb3JlJyxcbiAgICAgIHRlbXBsYXRlOiAnI2FydGljbGVHcmlkX19wYW5lbFRlbXBsYXRlJyxcbiAgICAgIG5hdjogJy5hcnRpY2xlR3JpZF9fbmF2J1xuICAgIH07XG4gICAgdGhpcy50ZW1wbGF0ZSA9ICQoJCh0aGlzLnNlbC50ZW1wbGF0ZSkuaHRtbCgpKTtcblxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMubG9hZE1vcmUgPSB0aGlzLmxvYWRNb3JlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wb3B1bGF0ZVRlbXBsYXRlcyA9IHRoaXMucG9wdWxhdGVUZW1wbGF0ZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3dTcGlubmVyID0gdGhpcy5zaG93U3Bpbm5lci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGlkZVNwaW5uZXIgPSB0aGlzLmhpZGVTcGlubmVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zY3JvbGxuYXYgPSB0aGlzLnNjcm9sbG5hdi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2Nyb2xsbGVmdCA9IHRoaXMuc2Nyb2xsbGVmdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2Nyb2xscmlnaHQgPSB0aGlzLnNjcm9sbHJpZ2h0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5jaGVja1Njcm9sbCA9IHRoaXMuY2hlY2tTY3JvbGwuYmluZCh0aGlzKTtcbiAgICB0aGlzLnBhZ2VTY3JvbGwgPSB0aGlzLnBhZ2VTY3JvbGwuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCB0aGlzLnBhZ2VTY3JvbGwpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmxvYWRNb3JlLCB0aGlzLmxvYWRNb3JlKTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnNjcm9sbGxlZnQnLCB0aGlzLnNjcm9sbGxlZnQpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc2Nyb2xscmlnaHQnLCB0aGlzLnNjcm9sbHJpZ2h0KTtcblxuICAgIHRoaXMucGFnZVNjcm9sbCgpO1xuICB9XG5cbiAgcGFnZVNjcm9sbCgpIHtcbiAgICBpZiAodGhpcy5oYXNtb3JlICYmICghdGhpcy5sb2FkaW5nKSkge1xuICAgICAgdmFyIHduZCA9ICQod2luZG93KTtcbiAgICAgIHZhciBlbG0gPSAkKHRoaXMuc2VsLmxvYWRNb3JlKTtcblxuICAgICAgaWYgKGVsbSAmJiAoJChlbG0pLmxlbmd0aCA+IDApKSB7XG4gICAgICAgIHZhciB3c3QgPSB3bmQuc2Nyb2xsVG9wKCk7XG4gICAgICAgIHZhciB3aCA9IHduZC5oZWlnaHQoKTtcbiAgICAgICAgdmFyIG90ID0gZWxtLm9mZnNldCgpLnRvcDtcbiAgICAgICAgdmFyIG9oID0gZWxtLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgaWYgKCh3c3QgKyB3aCkgPiAob3QgKyBvaCkpIHtcbiAgICAgICAgICB0aGlzLmxvYWRNb3JlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsb2FkTW9yZShlKSB7XG4gICAgaWYgKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgIC8vIFNob3cgdGhlIGxvYWRpbmcgc3Bpbm5lclxuICAgIHRoaXMuc2hvd1NwaW5uZXIoKTtcblxuICAgIHZhciB0ID0gMDtcbiAgICAkKFwiLmFydGljbGVHcmlkX19pdGVtXCIsIHRoaXMuc2VsLmNvbXBvbmVudCkuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgIGlmICh0IDwgNiAmJiAoISQoaXRlbSkuaXMoXCI6dmlzaWJsZVwiKSkpIHtcbiAgICAgICAgJChpdGVtKS5zaG93KCk7XG4gICAgICAgIHQrKztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICgkKFwiLmFydGljbGVHcmlkX19pdGVtXCIsdGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPT09ICQoXCIuYXJ0aWNsZUdyaWRfX2l0ZW06dmlzaWJsZVwiLHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoKSB7XG4gICAgICAkKHRoaXMuc2VsLmxvYWRNb3JlKS5wYXJlbnRzKFwiLnJvd1wiKS5maXJzdCgpLnJlbW92ZSgpO1xuICAgICAgdGhpcy5oYXNtb3JlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gSGlkZSB0aGUgbG9hZGluZyBzcGlubmVyXG4gICAgdGhpcy5oaWRlU3Bpbm5lcigpO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgc2hvd1NwaW5uZXIoKSB7XG4gICAgJCh0aGlzLnNlbC5sb2FkTW9yZSkuYWRkQ2xhc3MoJ2FydGljbGVHcmlkX19sb2FkTW9yZS0tbG9hZGluZycpO1xuICB9XG5cbiAgaGlkZVNwaW5uZXIoKSB7XG4gICAgJCh0aGlzLnNlbC5sb2FkTW9yZSkucmVtb3ZlQ2xhc3MoJ2FydGljbGVHcmlkX19sb2FkTW9yZS0tbG9hZGluZycpO1xuICB9XG5cbiAgc2Nyb2xsbmF2KCkge1xuICAgIGxldCAkc2Nyb2xsbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbC5uYXYpO1xuICAgIGlmICgkc2Nyb2xsbmF2ID09PSBudWxsKSByZXR1cm47XG4gICAgbGV0IHNjcm9sbFdpZHRoID0gJHNjcm9sbG5hdi5zY3JvbGxXaWR0aDtcbiAgICBsZXQgY2xpZW50V2lkdGggPSAkc2Nyb2xsbmF2LmNsaWVudFdpZHRoO1xuICAgIGlmIChzY3JvbGxXaWR0aCA+IGNsaWVudFdpZHRoKSB7XG4gICAgICAkKHRoaXMuc2VsLm5hdikuYWZ0ZXIoJzxpIGNsYXNzPVwic2Nyb2xscmlnaHRcIj4+PC9pPicpO1xuICAgIH1cbiAgfVxuICBzY3JvbGxyaWdodCgpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXMuc2VsLm5hdjtcbiAgICBsZXQgc2Nyb2xsV2lkdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGYpLnNjcm9sbFdpZHRoO1xuICAgICQoc2VsZikuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxMZWZ0OiBzY3JvbGxXaWR0aCArICdweCdcbiAgICB9LCA1MDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJy5zY3JvbGxyaWdodCcpLnJlbW92ZSgpO1xuICAgICAgJChzZWxmKS5iZWZvcmUoJzxpIGNsYXNzPVwic2Nyb2xsbGVmdFwiPjw8L2k+Jyk7XG4gICAgfSk7XG4gIH1cblxuICBzY3JvbGxsZWZ0KCkge1xuICAgIGxldCBzZWxmID0gdGhpcy5zZWwubmF2O1xuICAgICQoc2VsZikuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxMZWZ0OiAwXG4gICAgfSwgNTAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcuc2Nyb2xsbGVmdCcpLnJlbW92ZSgpO1xuICAgICAgJChzZWxmKS5hZnRlcignPGkgY2xhc3M9XCJzY3JvbGxyaWdodFwiPj48L2k+Jyk7XG4gICAgfSk7XG4gIH1cblxuICBjaGVja1Njcm9sbCgpIHtcbiAgICBsZXQgJHNjcm9sbG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWwubmF2KTtcbiAgICBpZiAoJHNjcm9sbG5hdiA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGxldCBzY3JvbGxXaWR0aCA9ICRzY3JvbGxuYXYuc2Nyb2xsV2lkdGg7XG4gICAgbGV0IGNsaWVudFdpZHRoID0gJHNjcm9sbG5hdi5jbGllbnRXaWR0aDtcbiAgICBsZXQgc2Nyb2xsR2FwID0gc2Nyb2xsV2lkdGggLSBjbGllbnRXaWR0aDtcbiAgICAkKHNlbGYpLnNjcm9sbChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5zY3JvbGxMZWZ0ID09PSAwKSB7XG4gICAgICAgICQoJy5zY3JvbGxsZWZ0JykucmVtb3ZlKCk7XG4gICAgICAgICQoc2VsZikuYWZ0ZXIoJzxpIGNsYXNzPVwic2Nyb2xscmlnaHRcIj4+PC9pPicpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc2Nyb2xsTGVmdCA+PSBzY3JvbGxHYXApIHtcbiAgICAgICAgJCgnLnNjcm9sbHJpZ2h0JykucmVtb3ZlKCk7XG4gICAgICAgICQoc2VsZikuYmVmb3JlKCc8aSBjbGFzcz1cInNjcm9sbGxlZnRcIj48PC9pPicpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcG9wdWxhdGVUZW1wbGF0ZXMoaXRlbXMpIHtcbiAgICBsZXQgb3V0cHV0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gQ2xvbmUgdGVtcGxhdGVcbiAgICAgIGxldCAkdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlLmNsb25lKCk7XG4gICAgICAvLyBHZXQgdGhlIGl0ZW1cbiAgICAgIGxldCBpdGVtID0gaXRlbXNbaV07XG4gICAgICAvLyBTZXQgaW1hZ2UgYnJlYWtwb2ludFxuICAgICAgbGV0IGRlc2t0b3BCcmVha3BvaW50ID0gOTkyO1xuICAgICAgLy8gR2VuZXJhdGUgSURcbiAgICAgIGxldCBwYW5lbElkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpO1xuICAgICAgLy8gUG9wdWxhdGUgSURcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsJykuYXR0cignaWQnLCBwYW5lbElkKTtcbiAgICAgIC8vIElmIGxhcmdlIHBhbmVsXG4gICAgICBpZiAoaXRlbS5Jc0xhcmdlKSB7XG4gICAgICAgIC8vIFVwZGF0ZSBpbWFnZSBicmVha3BvaW50XG4gICAgICAgIGRlc2t0b3BCcmVha3BvaW50ID0gNzY4O1xuICAgICAgICAvLyBBZGQgY2xhc3NcbiAgICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWwnKS5hZGRDbGFzcygnYXJ0aWNsZVBhbmVsLS1sYXJnZScpO1xuICAgICAgfVxuICAgICAgLy8gSWYgdmlkZW9cbiAgICAgIGlmIChpdGVtLklzVmlkZW8pIHtcbiAgICAgICAgLy8gQWRkIGNsYXNzXG4gICAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsJykuYWRkQ2xhc3MoJ2FydGljbGVQYW5lbC0tdmlkZW8nKTtcbiAgICAgIH1cbiAgICAgIC8vIFBvcHVsYXRlIGltYWdlc1xuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2ltYWdlJykuYXR0cih7XG4gICAgICAgIGhyZWY6IGl0ZW0uTGluayxcbiAgICAgICAgdGl0bGU6IGl0ZW0uVGl0bGVcbiAgICAgIH0pLmF0dHIoJ3N0eWxlJywgJ2JhY2tncm91bmQtaW1hZ2U6IHVybCgnICsgaXRlbS5JbWFnZXMuTW9iaWxlICsgJyk7Jyk7XG4gICAgICAkdGVtcGxhdGUuZmluZCgnc3R5bGUnKVswXS5pbm5lckhUTUwgPSAnQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogJyArIGRlc2t0b3BCcmVha3BvaW50ICsgJ3B4KXsjJyArIHBhbmVsSWQgKyAnIC5hcnRpY2xlUGFuZWxfX2ltYWdle2JhY2tncm91bmQtaW1hZ2U6IHVybCgnICsgaXRlbS5JbWFnZXMuRGVza3RvcCArICcpICFpbXBvcnRhbnQ7fX0nO1xuICAgICAgLy8gUG9wdWxhdGUgbGlua1xuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2NvbnRlbnQgPiBhJykuYXR0cih7XG4gICAgICAgIGhyZWY6IGl0ZW0uTGluayxcbiAgICAgICAgdGl0bGU6IGl0ZW0uVGl0bGVcbiAgICAgIH0pO1xuICAgICAgLy8gUG9wdWxhdGUgdGl0bGVcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX190aXRsZScpLnRleHQoaXRlbS5UaXRsZSk7XG4gICAgICAvLyBQb3B1bGF0ZSBkZXNjcmlwdGlvblxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX2Rlc2NyaXB0aW9uJykudGV4dChpdGVtLkRlc2NyaXB0aW9uKTtcbiAgICAgIC8vIFBvcHVsYXRlIGNhdGVnb3J5XG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fc3ViVGl0bGUgYTpmaXJzdC1jaGlsZCcpLmF0dHIoe1xuICAgICAgICAnaHJlZic6IGl0ZW0uQ2F0ZWdvcnkuTGluayxcbiAgICAgICAgJ3RpdGxlJzogaXRlbS5DYXRlZ29yeS5OYW1lXG4gICAgICB9KS50ZXh0KGl0ZW0uQ2F0ZWdvcnkuTmFtZSk7XG4gICAgICAvLyBQb3B1bGF0ZSB0aW1lIHRvIHJlYWRcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX19zdWJUaXRsZSBhOmxhc3QtY2hpbGQnKS5hdHRyKHtcbiAgICAgICAgJ2hyZWYnOiBpdGVtLkxpbmssXG4gICAgICAgICd0aXRsZSc6IGl0ZW0uVGl0bGVcbiAgICAgIH0pLnRleHQoaXRlbS5UaW1lVG9SZWFkKTtcbiAgICAgIC8vIFB1c2ggaXRlbSB0byBvdXRwdXRcbiAgICAgIG91dHB1dC5wdXNoKCR0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICBsZXQgZW5kcG9pbnQgPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYXR0cignZGF0YS1lbmRwb2ludCcpO1xuICAgIHRoaXMuQVBJID0gbmV3IEFydGljbGVHcmlkQXBpKGVuZHBvaW50KTtcbiAgICB0aGlzLnNjcm9sbG5hdigpO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHRoaXMuY2hlY2tTY3JvbGwoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQXJ0aWNsZUdyaWQoKTtcbiIsImNsYXNzIEF1dGhlbnRpY2F0aW9uRXZlbnRzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICB1cmxUb2tlbjogJy9saWJzL2dyYW5pdGUvY3NyZi90b2tlbi5qc29uJyxcbiAgICAgIHVybENoZWNrOiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL2NoZWNrL2luZGV4Lmpzb24nLFxuICAgICAgdXJsUmVmcmVzaENoZWNrOiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL3JlZnJlc2hfdG9rZW4vaW5kZXguanNvbicsXG4gICAgICB1cmxEb3dubG9hZEFzc2V0OiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL2Rvd25sb2FkX2Fzc2V0L2luZGV4Lmpzb24nXG4gICAgfTtcblxuICAgIHRoaXMuZ2V0UGF0aFByZWZpeCA9IHRoaXMuZ2V0UGF0aFByZWZpeC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0UGF0aEhvbWUgPSB0aGlzLmdldFBhdGhIb21lLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnJlYWRDb29raWUgPSB0aGlzLnJlYWRDb29raWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsZWFyQ29va2llID0gdGhpcy5jbGVhckNvb2tpZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY3JlYXRlQ29va2llID0gdGhpcy5jcmVhdGVDb29raWUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuY2hlY2tMb2dpblN0YXR1cyA9IHRoaXMuY2hlY2tMb2dpblN0YXR1cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2hlY2tBdXRoVG9rZW5zID0gdGhpcy5jaGVja0F1dGhUb2tlbnMuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuc2hvd0xvZ2dlZEluRWxlbWVudHMgPSB0aGlzLnNob3dMb2dnZWRJbkVsZW1lbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaG93Tm90TG9nZ2VkSW5FbGVtZW50cyA9IHRoaXMuc2hvd05vdExvZ2dlZEluRWxlbWVudHMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldFBhdGhQcmVmaXgoKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcbiAgfVxuXG4gIGdldFBhdGhIb21lKCkge1xuICAgIGNvbnN0IGhvbWUgPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1ob21lXFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKGhvbWUgPyBob21lIDogJycpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAkKHdpbmRvdykub24oJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCAoZXZ0LCB0b2tlbkRhdGEsIHNraXBFbGVtZW50cykgPT4ge1xuICAgICAgdGhpcy5jaGVja0F1dGhUb2tlbnModG9rZW5EYXRhLCBza2lwRWxlbWVudHMpO1xuICAgIH0pO1xuICAgICQod2luZG93KS5vbigndXNlcmxvZ2dlZGluLkRITCcsIChldnQsIHRva2VuRGF0YSkgPT4ge1xuICAgICAgdGhpcy5zaG93TG9nZ2VkSW5FbGVtZW50cyh0b2tlbkRhdGEpO1xuICAgIH0pO1xuICAgICQod2luZG93KS5vbigndXNlcm5vdGxvZ2dlZGluLkRITCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2hvd05vdExvZ2dlZEluRWxlbWVudHMoKTtcbiAgICB9KTtcblxuICAgIC8vIGxvZ2dlZCBpbiBoZWFkZXIgKGxvZ291dCBsaW5rKVxuICAgIHZhciBsb2dnZWRJbkhlYWRlciA9ICQoJy5mb290ZXIgLmZvb3Rlcl9fY3Rhcy0tbG9nZ2VkaW4nKTtcbiAgICBpZiAobG9nZ2VkSW5IZWFkZXIubGVuZ3RoID4gMCkge1xuICAgICAgbG9nZ2VkSW5IZWFkZXIub24oJ2NsaWNrJywgJy5sb2dvdXQtbGluaycsICgpID0+IHtcbiAgICAgICAgdGhpcy5jbGVhckNvb2tpZSgnREhMLkF1dGhUb2tlbicpO1xuICAgICAgICB0aGlzLmNsZWFyQ29va2llKCdESEwuUmVmcmVzaFRva2VuJyk7XG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuY2hlY2tMb2dpblN0YXR1cygpO1xuICB9XG5cbiAgcmVhZENvb2tpZShuYW1lKSB7XG4gICAgdmFyIG5hbWVFUSA9IG5hbWUgKyAnPSc7XG4gICAgdmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGMgPSBjYVtpXTtcbiAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xuICAgICAgaWYgKGMuaW5kZXhPZihuYW1lRVEpID09PSAwKSByZXR1cm4gYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY2xlYXJDb29raWUobmFtZSkge1xuICAgIHRoaXMuY3JlYXRlQ29va2llKG5hbWUsICcnLCAtMSk7XG4gIH1cblxuICBjcmVhdGVDb29raWUobmFtZSwgdmFsdWUsIGV4cGlyeVNlY29uZHMpIHtcbiAgICB2YXIgZXhwaXJlcyA9ICcnO1xuICAgIGlmIChleHBpcnlTZWNvbmRzKSB7XG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoZXhwaXJ5U2Vjb25kcyAqIDEwMDApKTtcbiAgICAgIGV4cGlyZXMgPSAnOyBleHBpcmVzPScgKyBkYXRlLnRvVVRDU3RyaW5nKCk7XG4gICAgfVxuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyAnPScgKyB2YWx1ZSArIGV4cGlyZXMgKyAnOyBwYXRoPS8nO1xuICB9XG5cbiAgY2hlY2tMb2dpblN0YXR1cygpIHtcbiAgICB2YXIgY29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuQXV0aFRva2VuJyk7XG4gICAgaWYgKGNvb2tpZSAhPT0gbnVsbCkge1xuICAgICAgdmFyIGF1dGhTcGxpdCA9IGNvb2tpZS5zcGxpdCgnfCcpO1xuICAgICAgaWYgKGF1dGhTcGxpdC5sZW5ndGggPj0gMikge1xuICAgICAgICB0aGlzLmNhbGxUb2tlbkNoZWNrKHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsQ2hlY2ssIHtcbiAgICAgICAgICB1c2VybmFtZTogYXV0aFNwbGl0WzBdLFxuICAgICAgICAgIHRva2VuOiBhdXRoU3BsaXRbMV1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigndXNlcm5vdGxvZ2dlZGluLkRITCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVmcmVzaENvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicpO1xuICAgICAgaWYgKHJlZnJlc2hDb29raWUgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIHJlZnJlc2hDb29raWVTcGxpdCA9IHJlZnJlc2hDb29raWUuc3BsaXQoJ3wnKTtcbiAgICAgICAgaWYgKHJlZnJlc2hDb29raWVTcGxpdC5sZW5ndGggPj0gMikge1xuICAgICAgICAgIHRoaXMuY2FsbFRva2VuQ2hlY2sodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxSZWZyZXNoQ2hlY2ssIHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiByZWZyZXNoQ29va2llU3BsaXRbMF0sXG4gICAgICAgICAgICByZWZyZXNoX3Rva2VuOiByZWZyZXNoQ29va2llU3BsaXRbMV1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigndXNlcm5vdGxvZ2dlZGluLkRITCcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKHdpbmRvdykudHJpZ2dlcigndXNlcm5vdGxvZ2dlZGluLkRITCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNhbGxUb2tlbkNoZWNrKHVybCwgZGF0YSkge1xuICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sIChjc3JmcmVzcG9uc2UpID0+IHtcbiAgICAgIHZhciBjc3JmdG9rZW4gPSBjc3JmcmVzcG9uc2UudG9rZW47XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgdGhpcy5jaGVja0F1dGhUb2tlbnMocmVzcG9uc2UsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjaGVja0F1dGhUb2tlbnModG9rZW5EYXRhLCBza2lwRWxlbWVudHMpIHtcbiAgICBpZiAodG9rZW5EYXRhICYmIHRva2VuRGF0YS5zdGF0dXMgJiYgdG9rZW5EYXRhLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgdGhpcy5jcmVhdGVDb29raWUoJ0RITC5BdXRoVG9rZW4nLCB0b2tlbkRhdGEudXNlcm5hbWUgKyAnfCcgKyB0b2tlbkRhdGEudG9rZW4sIHRva2VuRGF0YS50dGwpO1xuICAgICAgdGhpcy5jcmVhdGVDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nLCB0b2tlbkRhdGEudXNlcm5hbWUgKyAnfCcgKyB0b2tlbkRhdGEucmVmcmVzaF90b2tlbiwgKDI0ICogNjAgKiA2MCkpO1xuXG4gICAgICBpZiAoc2tpcEVsZW1lbnRzICE9PSB0cnVlKSB7XG4gICAgICAgICQod2luZG93KS50cmlnZ2VyKCd1c2VybG9nZ2VkaW4uREhMJywgdG9rZW5EYXRhKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChza2lwRWxlbWVudHMgIT09IHRydWUpIHtcbiAgICAgICQod2luZG93KS50cmlnZ2VyKCd1c2Vybm90bG9nZ2VkaW4uREhMJyk7XG4gICAgfVxuICB9XG5cbiAgc2hvd0xvZ2dlZEluRWxlbWVudHModG9rZW5EYXRhKSB7XG4gICAgJCgnLmJlbG93LXJlZ2lzdGVyLWZvcm0gLnRhYi5tb2JpbGUnKS5oaWRlKCk7XG5cbiAgICAkKCcuYmVsb3ctcmVnaXN0ZXItZm9ybSAjcmVnaXN0ZXItdGFiLTEnKS5oaWRlKCk7XG4gICAgJChcIi5iZWxvdy1yZWdpc3Rlci1mb3JtIC50YWItY29udGVudHMgLnRhYi1jb250ZW50W2RhdGEtcmVsPScjcmVnaXN0ZXItdGFiLTEnXVwiKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuXG4gICAgJCgnLmJlbG93LXJlZ2lzdGVyLWZvcm0gI3JlZ2lzdGVyLXRhYi0yJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNob3coKTtcbiAgICAkKFwiLmJlbG93LXJlZ2lzdGVyLWZvcm0gLnRhYi1jb250ZW50cyAudGFiLWNvbnRlbnRbZGF0YS1yZWw9JyNyZWdpc3Rlci10YWItMiddXCIpLmFkZENsYXNzKCdvcGVuJyk7XG5cbiAgICAkKCcuYmVsb3ctcmVnaXN0ZXItZm9ybScpLnNob3coKTtcblxuICAgICQoJ2hlYWRlciAuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0ubG9nZ2VkLWluIC51c2VyLWZpcnN0bmFtZSwgaGVhZGVyIC5oZWFkZXJfX3ByaW1hcnlMaW5rcyAudXNlci1maXJzdG5hbWUnKS50ZXh0KHRva2VuRGF0YS5uYW1lKTtcbiAgICAkKCdoZWFkZXIgLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtLmxvZ2dlZC1pbiwgaGVhZGVyIC5oZWFkZXJfX3ByaW1hcnlMaW5rcy5sb2dnZWQtaW4nKS5zaG93KCk7XG4gICAgJCgnLmZvb3RlciAubG9nb3V0LWxpbmtzJykuc2hvdygpO1xuXG4gICAgJCgnLmNvbXBldGl0aW9uRGF0YUNhcHR1cmUubG9nZ2VkLWluJykuc2hvdygpO1xuICAgICQoJy5jb21wZXRpdGlvbkRhdGFDYXB0dXJlLmxvZ2dlZC1pbiAubG9nZ2VkaW4tbmFtZScpLnRleHQodG9rZW5EYXRhLm5hbWUpO1xuICAgICQoJy5jdGEtdGhpcmQtcGFuZWwtbG9nZ2VkaW4nKS5zaG93KCk7XG5cbiAgICAkKCcuZ2F0ZWQnKS5hZGRDbGFzcygndW5sb2NrZWQnKS5yZW1vdmVDbGFzcygnbG9ja2VkJykuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgICQoaXRlbSkuY2xvc2VzdCgnYm9keScpLmZpbmQoJy5oZXJvIC5oZXJvX19jdGEtLWdyZXknKS5zaG93KCk7XG4gICAgfSk7XG4gICAgJCgnLmdhdGVkLWhpZGUnKS5hZGRDbGFzcygndW5sb2NrZWQnKS5yZW1vdmVDbGFzcygnbG9ja2VkJyk7XG5cbiAgICAkKCcuYXJ0aWNsZUdyaWQgLmFydGljbGUtZ3JpZC1pdGVtLWxvZ2dlZGluJykuc2hvdygpO1xuXG4gICAgaWYgKHRva2VuRGF0YS5mdWxsID09PSBmYWxzZSkge1xuICAgICAgJCgnLmNyZWF0ZS1wYXNzd29yZCcpLmZpbmQoJy5jcmVhdGUtcGFzc3dvcmQtbmFtZScpLnRleHQodG9rZW5EYXRhLm5hbWUpO1xuICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3Nob3cuQ3JlYXRlUGFzc3dvcmRNb2RhbC5ESEwnKTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLnJlc2V0LXBhc3N3b3JkLWNvbnRhaW5lcicpLmxlbmd0aCA+IDApIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMuZ2V0UGF0aEhvbWUoKSArICcuaHRtbCc7XG4gICAgfVxuICAgIGlmICgkKCcucGFnZS1ib2R5LnJlZ2lzdGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5nZXRQYXRoSG9tZSgpICsgJy95b3VyLWFjY291bnQuaHRtbCc7XG4gICAgfVxuXG4gICAgaWYgKCQoJy5nYXRpbmdBcnRpY2xlX19hY3Rpb25zLmxvZ2dlZC1pbicpLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBnYXRpbmdBcnRpY2xlRWxtMSA9ICQoJy5nYXRpbmdBcnRpY2xlX19hY3Rpb25zLmxvZ2dlZC1pbicpO1xuXG4gICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xuICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsRG93bmxvYWRBc3NldCxcbiAgICAgICAgICBkYXRhOiB7IGFzc2V0aW5mbzogZ2F0aW5nQXJ0aWNsZUVsbTEuZGF0YSgnYXNzZXRpbmZvJykgfSxcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICAgIGdhdGluZ0FydGljbGVFbG0xLmZpbmQoJy5nYXRpbmdBcnRpY2xlX19idXR0b24nKS5hdHRyKCdocmVmJywgcmVzcG9uc2UuaHJlZik7XG4gICAgICAgICAgICAgIGdhdGluZ0FydGljbGVFbG0xLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCQoJyNkb3dubG9hZCAuREhMZG93bmxvYWRfX2N0YXMubG9nZ2VkLWluJykubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGdhdGluZ0FydGljbGVFbG0yID0gJCgnI2Rvd25sb2FkIC5ESExkb3dubG9hZF9fY3Rhcy5sb2dnZWQtaW4nKTtcblxuICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybERvd25sb2FkQXNzZXQsXG4gICAgICAgICAgZGF0YTogeyBhc3NldGluZm86IGdhdGluZ0FydGljbGVFbG0yLmRhdGEoJ2Fzc2V0aW5mbycpIH0sXG4gICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICBnYXRpbmdBcnRpY2xlRWxtMi5maW5kKCcuREhMZG93bmxvYWRfX2N0YS0tcmVkJykuYXR0cignaHJlZicsIHJlc3BvbnNlLmhyZWYpO1xuICAgICAgICAgICAgICBnYXRpbmdBcnRpY2xlRWxtMi5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNob3dOb3RMb2dnZWRJbkVsZW1lbnRzKCkge1xuICAgICQoJy5iZWxvdy1yZWdpc3Rlci1mb3JtIC50YWItY29udGFpbmVyICNyZWdpc3Rlci10YWItMScpLmFkZENsYXNzKCdhY3RpdmUnKS5zaG93KCk7XG4gICAgJChcIi5iZWxvdy1yZWdpc3Rlci1mb3JtIC50YWItY29udGVudHMgLnRhYi1jb250ZW50W2RhdGEtcmVsPScjcmVnaXN0ZXItdGFiLTEnXVwiKS5hZGRDbGFzcygnb3BlbicpO1xuXG4gICAgJCgnLmJlbG93LXJlZ2lzdGVyLWZvcm0gI3JlZ2lzdGVyLXRhYi0yJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpLnNob3coKTtcbiAgICAkKFwiLmJlbG93LXJlZ2lzdGVyLWZvcm0gLnRhYi1jb250ZW50cyAudGFiLWNvbnRlbnRbZGF0YS1yZWw9JyNyZWdpc3Rlci10YWItMiddXCIpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cbiAgICAkKCcuYmVsb3ctcmVnaXN0ZXItZm9ybScpLnNob3coKTtcblxuICAgICQoJ2hlYWRlciAuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0ubG9nZ2VkLW91dCwgaGVhZGVyIC5oZWFkZXJfX3ByaW1hcnlMaW5rcy5sb2dnZWQtb3V0Jykuc2hvdygpO1xuICAgICQoJy5mb290ZXIgLmxvZ2luLWxpbmtzJykuc2hvdygpO1xuXG4gICAgJCgnLmdhdGluZ0FydGljbGVfX2FjdGlvbnMubm8tbG9nZ2VkLWluJykuc2hvdygpO1xuICAgICQoJyNkb3dubG9hZCAuREhMZG93bmxvYWRfX2N0YXMubm8tbG9nZ2VkLWluJykuc2hvdygpO1xuICAgICQoJy5jb21wZXRpdGlvbkRhdGFDYXB0dXJlLm5vdC1sb2dnZWQtaW4nKS5zaG93KCk7XG4gICAgJCgnLmFydGljbGUtcGFnZS1sb2dpbi1jdGEnKS5zaG93KCk7XG5cbiAgICAkKCcuZ2F0ZWQnKS5hZGRDbGFzcygnbG9ja2VkJykucmVtb3ZlQ2xhc3MoJ3VubG9ja2VkJykuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgICQoaXRlbSkuY2xvc2VzdCgnYm9keScpLmZpbmQoJy5oZXJvIC5oZXJvX19jdGEtLWdyZXknKS5oaWRlKCk7XG4gICAgfSk7XG4gICAgJCgnLmdhdGVkLWhpZGUnKS5hZGRDbGFzcygnbG9ja2VkJykucmVtb3ZlQ2xhc3MoJ3VubG9ja2VkJyk7XG5cbiAgICB2YXIgbmV3c2xldHRlckNvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLk5ld3NsZXR0ZXJTdWJzY3JpYmVkJyk7XG4gICAgaWYgKG5ld3NsZXR0ZXJDb29raWUgIT09IG51bGwpIHtcbiAgICAgICQoJy5hcnRpY2xlR3JpZCAuYXJ0aWNsZS1ncmlkLWl0ZW0tbG9nZ2VkaW4nKS5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJy5hcnRpY2xlR3JpZCAuYXJ0aWNsZS1ncmlkLWl0ZW0tc3Vic2NyaWJlJykuc2hvdygpO1xuICAgICAgJCgnLnN1YnNjcmliZVBhbmVsJykuc2hvdygpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQXV0aGVudGljYXRpb25FdmVudHMoKTtcbiIsImNsYXNzIEJhY2tCdXR0b24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5iYWNrQnV0dG9uJyxcbiAgICAgIGJhY2tCdXR0b246ICcuYmFja0J1dHRvbl9fYnV0dG9uLS1iYWNrJyxcbiAgICAgIGZvcndhcmRCdXR0b246ICcuYmFja0J1dHRvbl9fYnV0dG9uLS1mb3J3YXJkJ1xuICAgIH07XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3dCdXR0b24gPSB0aGlzLnNob3dCdXR0b24uYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdvQmFjayA9IHRoaXMuZ29CYWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nb0ZvcndhcmQgPSB0aGlzLmdvRm9yd2FyZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdEhlYWRyb29tID0gdGhpcy5pbml0SGVhZHJvb20uYmluZCh0aGlzKTtcbiAgfVxuXG4gIHNob3dCdXR0b24oKSB7XG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdiYWNrQnV0dG9uLS1zaG93Jyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmJhY2tCdXR0b24sIHRoaXMuZ29CYWNrKTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5mb3J3YXJkQnV0dG9uLCB0aGlzLmdvRm9yd2FyZCk7XG4gIH1cblxuICBnb0JhY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBoaXN0b3J5LmJhY2soLTEpO1xuICB9XG5cbiAgZ29Gb3J3YXJkKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaGlzdG9yeS5mb3J3YXJkKCk7XG4gIH1cblxuICBpbml0SGVhZHJvb20oKSB7XG4gICAgbGV0IGNvbXBvbmVudCA9ICQodGhpcy5zZWwuY29tcG9uZW50KVswXTtcbiAgICBsZXQgaGVhZHJvb20gID0gbmV3IEhlYWRyb29tKGNvbXBvbmVudCwge1xuICAgICAgY2xhc3Nlczoge1xuICAgICAgICBpbml0aWFsOiAnYmFja0J1dHRvbicsXG4gICAgICAgIHBpbm5lZDogJ2JhY2tCdXR0b24tLXBpbm5lZCcsXG4gICAgICAgIHVucGlubmVkOiAnYmFja0J1dHRvbi0tdW5waW5uZWQnLFxuICAgICAgICB0b3A6ICdiYWNrQnV0dG9uLS10b3AnLFxuICAgICAgICBub3RUb3A6ICdiYWNrQnV0dG9uLS1ub3QtdG9wJyxcbiAgICAgICAgYm90dG9tOiAnYmFja0J1dHRvbi0tYm90dG9tJyxcbiAgICAgICAgbm90Qm90dG9tOiAnYmFja0J1dHRvbi0tbm90LWJvdHRvbSdcbiAgICAgIH1cbiAgICB9KTtcbiAgICBoZWFkcm9vbS5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGxldCBzdGFuZGFsb25lID0gKHdpbmRvdy5tYXRjaE1lZGlhKCcoZGlzcGxheS1tb2RlOiBzdGFuZGFsb25lKScpLm1hdGNoZXMpIHx8ICh3aW5kb3cubmF2aWdhdG9yLnN0YW5kYWxvbmUpO1xuICAgIGlmICghc3RhbmRhbG9uZSkgcmV0dXJuO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHRoaXMuc2hvd0J1dHRvbigpO1xuICAgIHRoaXMuaW5pdEhlYWRyb29tKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEJhY2tCdXR0b24oKTtcbiIsImNsYXNzIEJvb3RzdHJhcENhcm91c2VsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuY2Fyb3VzZWwnLFxuICAgICAgaXRlbXM6ICcuY2Fyb3VzZWwtaXRlbScsXG4gICAgICBsaW5rOiAnLmNhdGVnb3J5SGVyb19fbGluaydcbiAgICB9O1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2hlY2tOdW1iZXJTbGlkZXMgPSB0aGlzLmNoZWNrTnVtYmVyU2xpZGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy50b3VjaFN3aXBlQ2Fyb3VzZWwgPSB0aGlzLnRvdWNoU3dpcGVDYXJvdXNlbC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY2hlY2tOdW1iZXJTbGlkZXMoKSB7XG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmVhY2goKGluZGV4LCAkZWxtKSA9PiB7XG4gICAgICBpZiAoJCgkZWxtKS5maW5kKHRoaXMuc2VsLml0ZW1zKS5sZW5ndGggPD0gMSkge1xuICAgICAgICAkKCRlbG0pLmFkZENsYXNzKCdzdGF0aWMnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHRvdWNoU3dpcGVDYXJvdXNlbCgpIHtcbiAgICBsZXQgaXNTd2lwZSA9IGZhbHNlO1xuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5zd2lwZSh7XG4gICAgICBzd2lwZTogKGV2ZW50LCBkaXJlY3Rpb24pID0+IHtcbiAgICAgICAgbGV0ICRjYXJvdXNlbCA9ICgkKGV2ZW50LnRhcmdldCkuaXModGhpcy5zZWwuY29tcG9uZW50KSA/ICQoZXZlbnQudGFyZ2V0KSA6ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKHRoaXMuc2VsLmNvbXBvbmVudCkpO1xuICAgICAgICBpc1N3aXBlID0gdHJ1ZTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgJGNhcm91c2VsLmNhcm91c2VsKCduZXh0Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgJGNhcm91c2VsLmNhcm91c2VsKCdwcmV2Jyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0YXA6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyB0YXJnZXQgdmFyaWFibGUgcmVwcmVzZW50cyB0aGUgY2xpY2tlZCBvYmplY3RcbiAgICAgICAgaWYgKCQoJy5jYXRlZ29yeUhlcm9fX2xpbmsnKS5sZW5ndGggJiYgd2luZG93LmlubmVyV2lkdGggPCA5OTIpIHtcbiAgICAgICAgICBsZXQgaHJlZiA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCcuY2F0ZWdvcnlIZXJvX19saW5rJykuZmlyc3QoKS5hdHRyKCdkYXRhLWhyZWYnKTtcbiAgICAgICAgICBpZiAoaHJlZiAhPT0gJycpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGhyZWY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWxsb3dQYWdlU2Nyb2xsOiAndmVydGljYWwnXG4gICAgfSk7XG5cbiAgICAkKHRoaXMuc2VsLmxpbmspLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghaXNTd2lwZSkge1xuICAgICAgICBsZXQgaHJlZiA9ICQodGhpcykuYXR0cignZGF0YS1ocmVmJyk7XG4gICAgICAgIGlmIChocmVmICE9PSAnJykge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGhyZWY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlzU3dpcGUgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMudG91Y2hTd2lwZUNhcm91c2VsKCk7XG4gICAgdGhpcy5jaGVja051bWJlclNsaWRlcygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBCb290c3RyYXBDYXJvdXNlbCgpO1xuIiwiY2xhc3MgQ29tcGV0aXRpb25Gb3JtIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICB1cmxUb2tlbjogJy9saWJzL2dyYW5pdGUvY3NyZi90b2tlbi5qc29uJyxcbiAgICAgIHVybFJlZnJlc2hDaGVjazogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZWZyZXNoX3Rva2VuL2luZGV4Lmpzb24nLFxuICAgICAgdXJsR2V0QWxsRGV0YWlsczogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9nZXRkZXRhaWxzL2luZGV4Lmpzb24nLFxuICAgICAgdXJsQ29tcGV0aXRpb246ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvY29tcGV0aXRpb24vaW5kZXguanNvbidcbiAgICB9O1xuXG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZSBmb3JtJ1xuICAgIH07XG5cbiAgICB0aGlzLmdldFBhdGhQcmVmaXggPSB0aGlzLmdldFBhdGhQcmVmaXguYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlYWRDb29raWUgPSB0aGlzLnJlYWRDb29raWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4gPSB0aGlzLnRyeUNvbXBldGl0aW9uRW50cnlMb2dnZWRJbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMudHJ5Q29tcGV0aXRpb25FbnRyeU5vdExvZ2dlZEluID0gdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5Tm90TG9nZ2VkSW4uYmluZCh0aGlzKTtcbiAgICB0aGlzLmNvbXBsZXRlQ29tcGV0aXRpb25FbnRyeUxvZ2dlZEluID0gdGhpcy5jb21wbGV0ZUNvbXBldGl0aW9uRW50cnlMb2dnZWRJbi5iaW5kKHRoaXMpO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgfVxuXG4gIGdldFBhdGhQcmVmaXgoKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcbiAgfVxuXG4gIHJlYWRDb29raWUobmFtZSkge1xuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xuICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjID0gY2FbaV07XG4gICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhbGlkYXRlKCkge1xuICAgIHZhciBjb21wZXRpdGlvbkVudHJ5ID0gJCh0aGlzLnNlbC5jb21wb25lbnQpO1xuXG4gICAgaWYgKGNvbXBldGl0aW9uRW50cnkubGVuZ3RoID4gMCkge1xuICAgICAgY29tcGV0aXRpb25FbnRyeS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICBpZiAoJChpdGVtKS5jbG9zZXN0KCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZScpLmhhc0NsYXNzKCdub3QtbG9nZ2VkLWluJykpIHtcbiAgICAgICAgICAkKGl0ZW0pLnZhbGlkYXRlKHtcbiAgICAgICAgICAgIHJ1bGVzOiB7XG4gICAgICAgICAgICAgIHJlZ2lzdGVyX195b3VyRW1haWw6ICdlbWFpbCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybSkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnRyeUNvbXBldGl0aW9uRW50cnlOb3RMb2dnZWRJbihmb3JtKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQoaXRlbSkudmFsaWRhdGUoe1xuICAgICAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VibWl0SGFuZGxlcjogKGZvcm0pID0+IHtcbiAgICAgICAgICAgICAgdGhpcy50cnlDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4oZm9ybSk7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cblxuICB0cnlDb21wZXRpdGlvbkVudHJ5Tm90TG9nZ2VkSW4oZm9ybSkge1xuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xuXG4gICAgdmFyIGRhdGEgPSB7IH07XG4gICAgaWYgKGZybS5maW5kKCcuY29tcC1hbnN3ZXInKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHZhciBhbnN3ZXIgPSBmcm0uZmluZChcImlucHV0W3R5cGU9J3JhZGlvJ106Y2hlY2tlZFwiKS52YWwoKTtcbiAgICAgIGlmIChhbnN3ZXIgPT09IG51bGwgfHwgYW5zd2VyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBhbGVydCgnUGxlYXNlIHNlbGVjdCBhbiBvcHRpb24nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBkYXRhID0ge1xuICAgICAgICBmaXJzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fZmlyc3ROYW1lJykudmFsKCksXG4gICAgICAgIGxhc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2xhc3ROYW1lJykudmFsKCksXG4gICAgICAgIGVtYWlsOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3lvdXJFbWFpbCcpLnZhbCgpLFxuXG4gICAgICAgIHBvc2l0aW9uOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3Bvc2l0aW9uJykudmFsKCksXG4gICAgICAgIGNvbnRhY3Q6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fY29udGFjdE51bWJlcicpLnZhbCgpLFxuICAgICAgICBzaXplOiBmcm0uZmluZCgnc2VsZWN0I3JlZ2lzdGVyX19idXNpbmVzc1NpemUnKS52YWwoKSxcbiAgICAgICAgc2VjdG9yOiBmcm0uZmluZCgnc2VsZWN0I3JlZ2lzdGVyX19idXNpbmVzc1NlY3RvcicpLnZhbCgpLFxuXG4gICAgICAgIHBhdGg6IGZybS5kYXRhKCdwYXRoJyksXG4gICAgICAgIGFuc3dlcjogYW5zd2VyXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0ge1xuICAgICAgICBmaXJzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fZmlyc3ROYW1lJykudmFsKCksXG4gICAgICAgIGxhc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2xhc3ROYW1lJykudmFsKCksXG4gICAgICAgIGVtYWlsOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3lvdXJFbWFpbCcpLnZhbCgpLFxuXG4gICAgICAgIHBvc2l0aW9uOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX3Bvc2l0aW9uJykudmFsKCksXG4gICAgICAgIGNvbnRhY3Q6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fY29udGFjdE51bWJlcicpLnZhbCgpLFxuICAgICAgICBzaXplOiBmcm0uZmluZCgnc2VsZWN0I3JlZ2lzdGVyX19idXNpbmVzc1NpemUnKS52YWwoKSxcbiAgICAgICAgc2VjdG9yOiBmcm0uZmluZCgnc2VsZWN0I3JlZ2lzdGVyX19idXNpbmVzc1NlY3RvcicpLnZhbCgpLFxuXG4gICAgICAgIHBhdGg6IGZybS5kYXRhKCdwYXRoJylcbiAgICAgIH07XG5cbiAgICAgIGZybS5maW5kKCcuY29tcC1hbnN3ZXInKS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICB2YXIgdmFsID0gJChpdGVtKS52YWwoKTtcbiAgICAgICAgaWYgKCQoaXRlbSkuZGF0YSgnaW5kZXgnKSA9PT0gMSkge1xuICAgICAgICAgIGRhdGEuYW5zd2VyID0gdmFsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGFbJ2Fuc3dlcicgKyAkKGl0ZW0pLmRhdGEoJ2luZGV4JyldID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCgkLnRyaW0oZGF0YS5maXJzdG5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShkYXRhLmxhc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS5lbWFpbCkubGVuZ3RoID09PSAwKSkge1xuICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciB5b3VyIG5hbWUsIGVtYWlsIGFkZHJlc3MgYW5kIGNvbXBldGl0aW9uIGRldGFpbHMuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgICBmcm0uZmluZChcImlucHV0W3R5cGU9J3N1Ym1pdCddXCIpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcblxuICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsQ29tcGV0aXRpb24sXG4gICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICAgIHZhciBtb2RhbCA9IGZybS5jbG9zZXN0KCcuY29tcGV0aXRpb24tY29udGFpbmVyJykuZmluZCgnLm1vZGFsJyk7XG4gICAgICAgICAgICAgICAgbW9kYWwuZmluZCgnLnRoYW5rcy1uYW1lJykudGV4dChkYXRhLmZpcnN0bmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gbW9kYWwubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5zaG93KCkuYWRkQ2xhc3MoJ3Nob3cnKTtcblxuICAgICAgICAgICAgICAgIGZybS5jbG9zZXN0KCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uXFxuJyArIHJlc3BvbnNlLmVycm9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0VudGVyIHRoZSBjb21wZXRpdGlvbicpO1xuICAgICAgICAgICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ0VudGVyIHRoZSBjb21wZXRpdGlvbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB0cnlDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4oZm9ybSkge1xuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XG5cbiAgICB2YXIgY29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuQXV0aFRva2VuJyk7XG4gICAgaWYgKGNvb2tpZSAhPT0gbnVsbCkge1xuICAgICAgdmFyIHNwbGl0ID0gY29va2llLnNwbGl0KCd8Jyk7XG4gICAgICBpZiAoc3BsaXQubGVuZ3RoID49IDIpIHtcbiAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcbiAgICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcbiAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybEdldEFsbERldGFpbHMsXG4gICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiBzcGxpdFswXSwgdG9rZW46IHNwbGl0WzFdIH0sXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgc3VjY2VzczogKGFsbERldGFpbHNSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxldGVDb21wZXRpdGlvbkVudHJ5TG9nZ2VkSW4oZm9ybSwgYWxsRGV0YWlsc1Jlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZWZyZXNoQ29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuUmVmcmVzaFRva2VuJyk7XG4gICAgICBpZiAocmVmcmVzaENvb2tpZSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgcmVmcmVzaFNwbGl0ID0gcmVmcmVzaENvb2tpZS5zcGxpdCgnfCcpO1xuICAgICAgICBpZiAocmVmcmVzaFNwbGl0Lmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFJlZnJlc2hDaGVjayxcbiAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogcmVmcmVzaFNwbGl0WzBdLCByZWZyZXNoX3Rva2VuOiByZWZyZXNoU3BsaXRbMV0gfSxcbiAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXG4gICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZWZyZXNoUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgcmVmcmVzaFJlc3BvbnNlLCB0cnVlIF0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyeUNvbXBldGl0aW9uRW50cnlMb2dnZWRJbihmb3JtKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZW50ZXIgdGhlIGNvbXBldGl0aW9uLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlQ29tcGV0aXRpb25FbnRyeUxvZ2dlZEluKGZvcm0sIGRldGFpbHMpIHtcbiAgICB2YXIgZnJtID0gJChmb3JtKTtcblxuICAgIHZhciBhbnN3ZXIgPSAnJztcbiAgICBpZiAoZnJtLmZpbmQoJy5jb21wLWFuc3dlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgIGFuc3dlciA9IGZybS5maW5kKCcuY29tcC1hbnN3ZXInKS52YWwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYW5zd2VyID0gZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdyYWRpbyddOmNoZWNrZWRcIikudmFsKCk7XG4gICAgICBpZiAoYW5zd2VyID09PSBudWxsIHx8IGFuc3dlci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYWxlcnQoJ1BsZWFzZSBzZWxlY3QgYW4gb3B0aW9uJyk7XG4gICAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0VudGVyIHRoZSBjb21wZXRpdGlvbiAnICsgZGV0YWlscy5yZWdpc3RyYXRpb25fZmlyc3RuYW1lKTtcbiAgICAgICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ0VudGVyIHRoZSBjb21wZXRpdGlvbiAnICsgZGV0YWlscy5yZWdpc3RyYXRpb25fZmlyc3RuYW1lKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBkYXRhID0ge1xuICAgICAgZmlyc3RuYW1lOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9maXJzdG5hbWUsXG4gICAgICBsYXN0bmFtZTogZGV0YWlscy5yZWdpc3RyYXRpb25fbGFzdG5hbWUsXG4gICAgICBlbWFpbDogZGV0YWlscy5yZWdpc3RyYXRpb25fZW1haWwsXG5cbiAgICAgIHBvc2l0aW9uOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9wb3NpdGlvbixcbiAgICAgIGNvbnRhY3Q6IGRldGFpbHMucmVnaXN0cmF0aW9uX2NvbnRhY3QsXG4gICAgICBzaXplOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9zaXplLFxuICAgICAgc2VjdG9yOiBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9zZWN0b3IsXG5cbiAgICAgIHBhdGg6IGZybS5kYXRhKCdwYXRoJyksXG4gICAgICBhbnN3ZXI6IGFuc3dlclxuICAgIH07XG5cbiAgICBpZiAoKCQudHJpbShkYXRhLmFuc3dlcikubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEuZmlyc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS5sYXN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEuZW1haWwpLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgIGFsZXJ0KCdQbGVhc2UgZW50ZXIgeW91ciBuYW1lLCBlbWFpbCBhZGRyZXNzIGFuZCBjb21wZXRpdGlvbiBkZXRhaWxzLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xuICAgICAgZnJtLmZpbmQoXCJpbnB1dFt0eXBlPSdzdWJtaXQnXVwiKS52YWwoJ3BsZWFzZSB3YWl0Li4uJyk7XG5cbiAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxDb21wZXRpdGlvbixcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXG4gICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZGFsID0gZnJtLmNsb3Nlc3QoJy5jb21wZXRpdGlvbi1jb250YWluZXInKS5maW5kKCcubW9kYWwnKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCcudGhhbmtzLW5hbWUnKS50ZXh0KGRhdGEuZmlyc3RuYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBtb2RhbC5tb2RhbCgnc2hvdycpO1xuICAgICAgICAgICAgICAgIG1vZGFsLnNob3coKS5hZGRDbGFzcygnc2hvdycpO1xuXG4gICAgICAgICAgICAgICAgZnJtLmNsb3Nlc3QoJy5jb21wZXRpdGlvbkRhdGFDYXB0dXJlJykuaGlkZSgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgnRW50ZXIgdGhlIGNvbXBldGl0aW9uICcgKyBkYXRhLmZpcnN0bmFtZSk7XG4gICAgICAgICAgICBmcm0uZmluZChcImlucHV0W3R5cGU9J3N1Ym1pdCddXCIpLnZhbCgnRW50ZXIgdGhlIGNvbXBldGl0aW9uICcgKyBkYXRhLmZpcnN0bmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0VudGVyIHRoZSBjb21wZXRpdGlvbicpO1xuICAgIGZybS5maW5kKFwiaW5wdXRbdHlwZT0nc3VibWl0J11cIikudmFsKCdFbnRlciB0aGUgY29tcGV0aXRpb24nKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ29tcGV0aXRpb25Gb3JtKCk7XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIElEQjoge1xuICAgIERCOiAnb2ZmbGluZS1hcnRpY2xlcycsXG4gICAgQVJUSUNMRVNfU1RPUkU6ICdhcnRpY2xlcydcbiAgfVxufTtcbiIsImNsYXNzIENvb2tpZUJhbm5lciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLmNvb2tpZS1iYW5uZXInLFxuICAgICAgY2xvc2VCdXR0b246ICcuY29va2llLWJhbm5lcl9fYnV0dG9uJ1xuICAgIH07XG5cbiAgICB0aGlzLmNvb2tpZU5hbWUgPSAnZGhsLWNvb2tpZS13YXJuaW5nJztcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGlkZUNvb2tpZUJhbm5lciA9IHRoaXMuaGlkZUNvb2tpZUJhbm5lci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvd0Nvb2tpZUJhbm5lciA9IHRoaXMuc2hvd0Nvb2tpZUJhbm5lci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZGlzcGxheUJhbm5lciA9IHRoaXMuZGlzcGxheUJhbm5lci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy5kaXNwbGF5QmFubmVyKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNsb3NlQnV0dG9uLCAoKSA9PiB7XG4gICAgICB0aGlzLmhpZGVDb29raWVCYW5uZXIoKTtcbiAgICAgIENvb2tpZXMuc2V0KHRoaXMuY29va2llTmFtZSwge3NlZW46IDF9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpc3BsYXlCYW5uZXIoKSB7XG4gICAgbGV0IGNvb2tpZSA9IENvb2tpZXMuZ2V0KHRoaXMuY29va2llTmFtZSk7XG5cbiAgICBpZiAodHlwZW9mIGNvb2tpZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuc2hvd0Nvb2tpZUJhbm5lcigpO1xuICAgIH1cbiAgfVxuXG4gIHNob3dDb29raWVCYW5uZXIoKSB7XG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdjb29raWUtYmFubmVyLS1kaXNwbGF5Jyk7XG4gIH1cblxuICBoaWRlQ29va2llQmFubmVyKCkge1xuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5yZW1vdmVDbGFzcygnY29va2llLWJhbm5lci0tZGlzcGxheScpO1xuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5yZW1vdmUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ29va2llQmFubmVyKCk7XG4iLCJpbXBvcnQgQ29uc3RhbnRzIGZyb20gJy4vQ29uc3RhbnRzJztcblxuY2xhc3MgRGF0YWJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRhdGFiYXNlID0gbnVsbDtcblxuICAgIHRoaXMuaW5pdGlhdGVEYiA9IHRoaXMuaW5pdGlhdGVEYi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYWRkQXJ0aWNsZSA9IHRoaXMuYWRkQXJ0aWNsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZGVsZXRlQXJ0aWNsZSA9IHRoaXMuZGVsZXRlQXJ0aWNsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0QXJ0aWNsZXMgPSB0aGlzLmdldEFydGljbGVzLmJpbmQodGhpcyk7XG5cbiAgICAvLyBDcmVhdGUvZ2V0IERCXG4gICAgaWYgKHdpbmRvdy5Qcm9taXNlKSB7XG4gICAgICB0aGlzLmluaXRpYXRlRGIoKTtcbiAgICB9XG4gIH1cblxuICBpbml0aWF0ZURiKCkge1xuICAgIHRoaXMuZGF0YWJhc2UgPSBpZGIub3BlbihDb25zdGFudHMuSURCLkRCLCAxLCAodXBncmFkZURiKSA9PiB7XG4gICAgICBpZiAoIXVwZ3JhZGVEYi5vYmplY3RTdG9yZU5hbWVzLmNvbnRhaW5zKENvbnN0YW50cy5JREIuQVJUSUNMRVNfU1RPUkUpKSB7XG4gICAgICAgIGxldCBhcnRpY2xlT1MgPSB1cGdyYWRlRGIuY3JlYXRlT2JqZWN0U3RvcmUoQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRSwge1xuICAgICAgICAgIGtleVBhdGg6ICdsaW5rJ1xuICAgICAgICB9KTtcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCd0aXRsZScsICd0aXRsZScsIHt1bmlxdWU6IGZhbHNlfSk7XG4gICAgICAgIGFydGljbGVPUy5jcmVhdGVJbmRleCgnbGluaycsICdsaW5rJywge3VuaXF1ZTogdHJ1ZX0pO1xuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2Rlc2NyaXB0aW9uJywgJ2Rlc2NyaXB0aW9uJywge3VuaXF1ZTogZmFsc2V9KTtcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdjYXRlZ29yeU5hbWUnLCAnY2F0ZWdvcnlOYW1lJywge3VuaXF1ZTogZmFsc2V9KTtcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdjYXRlZ29yeUxpbmsnLCAnY2F0ZWdvcnlMaW5rJywge3VuaXF1ZTogZmFsc2V9KTtcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCd0aW1lVG9SZWFkJywgJ3RpbWVUb1JlYWQnLCB7dW5pcXVlOiBmYWxzZX0pO1xuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2ltYWdlTW9iaWxlJywgJ2ltYWdlTW9iaWxlJywge3VuaXF1ZTogZmFsc2V9KTtcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdpbWFnZURlc2t0b3AnLCAnaW1hZ2VEZXNrdG9wJywge3VuaXF1ZTogZmFsc2V9KTtcbiAgICAgICAgYXJ0aWNsZU9TLmNyZWF0ZUluZGV4KCdpc0xhcmdlJywgJ2lzTGFyZ2UnLCB7dW5pcXVlOiBmYWxzZX0pO1xuICAgICAgICBhcnRpY2xlT1MuY3JlYXRlSW5kZXgoJ2lzVmlkZW8nLCAnaXNWaWRlbycsIHt1bmlxdWU6IGZhbHNlfSk7XG4gICAgICAgIGFydGljbGVPUy5jcmVhdGVJbmRleCgnY2FjaGVOYW1lJywgJ2NhY2hlTmFtZScsIHt1bmlxdWU6IGZhbHNlfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkZWxldGVBcnRpY2xlKGxpbmspIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZS50aGVuKChkYikgPT4ge1xuICAgICAgbGV0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oW0NvbnN0YW50cy5JREIuQVJUSUNMRVNfU1RPUkVdLCAncmVhZHdyaXRlJyk7XG4gICAgICBsZXQgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShDb25zdGFudHMuSURCLkFSVElDTEVTX1NUT1JFKTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgIHN0b3JlLmRlbGV0ZShsaW5rKSxcbiAgICAgICAgdHJhbnNhY3Rpb24uY29tcGxldGVcbiAgICAgIF0pO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkQXJ0aWNsZSh0aXRsZSwgbGluaywgZGVzY3JpcHRpb24sIGNhdGVnb3J5TmFtZSwgY2F0ZWdvcnlMaW5rLCB0aW1lVG9SZWFkLCBpbWFnZU1vYmlsZSwgaW1hZ2VEZXNrdG9wLCBpc0xhcmdlLCBpc1ZpZGVvLCBjYWNoZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhYmFzZS50aGVuKChkYikgPT4ge1xuICAgICAgbGV0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24oW0NvbnN0YW50cy5JREIuQVJUSUNMRVNfU1RPUkVdLCAncmVhZHdyaXRlJyk7XG4gICAgICBsZXQgc3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShDb25zdGFudHMuSURCLkFSVElDTEVTX1NUT1JFKTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgIHN0b3JlLmFkZCh7XG4gICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgbGluayxcbiAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICBjYXRlZ29yeU5hbWUsXG4gICAgICAgICAgY2F0ZWdvcnlMaW5rLFxuICAgICAgICAgIHRpbWVUb1JlYWQsXG4gICAgICAgICAgaW1hZ2VNb2JpbGUsXG4gICAgICAgICAgaW1hZ2VEZXNrdG9wLFxuICAgICAgICAgIGlzTGFyZ2UsXG4gICAgICAgICAgaXNWaWRlbyxcbiAgICAgICAgICBjYWNoZU5hbWVcbiAgICAgICAgfSksXG4gICAgICAgIHRyYW5zYWN0aW9uLmNvbXBsZXRlXG4gICAgICBdKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEFydGljbGVzKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFiYXNlLnRoZW4oKGRiKSA9PiB7XG4gICAgICBsZXQgdHJhbnNhY3Rpb24gPSBkYi50cmFuc2FjdGlvbihbQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRV0sICdyZWFkb25seScpO1xuICAgICAgbGV0IHN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoQ29uc3RhbnRzLklEQi5BUlRJQ0xFU19TVE9SRSk7XG4gICAgICByZXR1cm4gc3RvcmUuZ2V0QWxsKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IERhdGFiYXNlKCk7XG4iLCJjbGFzcyBEZWxldGVBY2NvdW50Rm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgdXJsVG9rZW46ICcvbGlicy9ncmFuaXRlL2NzcmYvdG9rZW4uanNvbicsXG4gICAgICB1cmxSZWZyZXNoQ2hlY2s6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcbiAgICAgIHVybEdldEFsbERldGFpbHM6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvZ2V0ZGV0YWlscy9pbmRleC5qc29uJyxcbiAgICAgIHVybERlbGV0ZUFjY291bnQ6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvZGVsZXRlYWNjb3VudC9pbmRleC5qc29uJ1xuICAgIH07XG5cbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5kZWxldGUtYWNjb3VudCdcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRQYXRoSG9tZSA9IHRoaXMuZ2V0UGF0aEhvbWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlYWRDb29raWUgPSB0aGlzLnJlYWRDb29raWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsZWFyQ29va2llID0gdGhpcy5jbGVhckNvb2tpZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY3JlYXRlQ29va2llID0gdGhpcy5jcmVhdGVDb29raWUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMudHJ5RGVsZXRlQWNjb3VudCA9IHRoaXMudHJ5RGVsZXRlQWNjb3VudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY29tcGxldGVEZWxldGVBY2NvdW50ID0gdGhpcy5jb21wbGV0ZURlbGV0ZUFjY291bnQuYmluZCh0aGlzKTtcblxuICAgIHRoaXMubG9nZ2VkSW4gPSB0aGlzLmxvZ2dlZEluLmJpbmQodGhpcyk7XG4gICAgdGhpcy5ub3RMb2dnZWRJbiA9IHRoaXMubm90TG9nZ2VkSW4uYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldFBhdGhQcmVmaXgoKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcbiAgfVxuXG4gIGdldFBhdGhIb21lKCkge1xuICAgIGNvbnN0IGhvbWUgPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1ob21lXFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKGhvbWUgPyBob21lIDogJycpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGpRdWVyeS52YWxpZGF0b3IuYWRkTWV0aG9kKCdwYXNzd29yZCcsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJChlbGVtZW50KS5hdHRyKCdwYXR0ZXJuJykpLnRlc3QodmFsdWUpO1xuICAgIH0sICdQYXNzd29yZCBmb3JtYXQgaXMgbm90IHZhbGlkJyk7XG5cbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnZXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xuICAgICAgcmV0dXJuICgkKCcjJyArICQoZWxlbWVudCkuYXR0cignZGF0YS1lcXVhbFRvJykpLnZhbCgpID09PSAkKGVsZW1lbnQpLnZhbCgpKTtcbiAgICB9LCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpO1xuXG4gICAgJCh3aW5kb3cpLm9uKCd1c2VybG9nZ2VkaW4uREhMJywgKGV2dCwgdG9rZW5EYXRhKSA9PiB7XG4gICAgICB0aGlzLmxvZ2dlZEluKHRva2VuRGF0YSk7XG4gICAgfSk7XG4gICAgJCh3aW5kb3cpLm9uKCd1c2Vybm90bG9nZ2VkaW4uREhMJywgKCkgPT4ge1xuICAgICAgdGhpcy5ub3RMb2dnZWRJbigpO1xuICAgIH0pO1xuXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJ2Zvcm0nKS52YWxpZGF0ZSh7XG4gICAgICBydWxlczoge1xuICAgICAgICBsb2dpbl9fZmlyc3ROYW1lOiAnZW1haWwnLFxuICAgICAgICBsb2dpbl9fcGFzc3dvcmQ6ICdwYXNzd29yZCdcbiAgICAgIH0sXG4gICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgICAgICAkKGVsZW1lbnQpLmFwcGVuZChlcnJvcik7XG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybSkgPT4ge1xuICAgICAgICB0aGlzLnRyeURlbGV0ZUFjY291bnQoZm9ybSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlYWRDb29raWUobmFtZSkge1xuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xuICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjID0gY2FbaV07XG4gICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNsZWFyQ29va2llKG5hbWUpIHtcbiAgICB0aGlzLmNyZWF0ZUNvb2tpZShuYW1lLCAnJywgLTEpO1xuICB9XG5cbiAgY3JlYXRlQ29va2llKG5hbWUsIHZhbHVlLCBleHBpcnlTZWNvbmRzKSB7XG4gICAgdmFyIGV4cGlyZXMgPSAnJztcbiAgICBpZiAoZXhwaXJ5U2Vjb25kcykge1xuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgKGV4cGlyeVNlY29uZHMgKiAxMDAwKSk7XG4gICAgICBleHBpcmVzID0gJzsgZXhwaXJlcz0nICsgZGF0ZS50b1VUQ1N0cmluZygpO1xuICAgIH1cbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgJz0nICsgdmFsdWUgKyBleHBpcmVzICsgJzsgcGF0aD0vJztcbiAgfVxuXG4gIHRyeURlbGV0ZUFjY291bnQoZm9ybSkge1xuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xuICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcblxuICAgIHZhciBjb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5BdXRoVG9rZW4nKTtcbiAgICBpZiAoY29va2llICE9PSBudWxsKSB7XG4gICAgICB2YXIgc3BsaXQgPSBjb29raWUuc3BsaXQoJ3wnKTtcbiAgICAgIGlmIChzcGxpdC5sZW5ndGggPj0gMikge1xuICAgICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xuICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xuICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsR2V0QWxsRGV0YWlscyxcbiAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHNwbGl0WzBdLCB0b2tlbjogc3BsaXRbMV0gfSxcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBzdWNjZXNzOiAoYWxsRGV0YWlsc1Jlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWxsRGV0YWlsc1Jlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIGFsbERldGFpbHNSZXNwb25zZSwgdHJ1ZSBdKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGxldGVEZWxldGVBY2NvdW50KGZvcm0sIGFsbERldGFpbHNSZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZGVsZXRlIHlvdXIgYWNjb3VudCAoMSkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICgyKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICgzKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVmcmVzaENvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicpO1xuICAgICAgaWYgKHJlZnJlc2hDb29raWUgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIHJlZnJlc2hTcGxpdCA9IHJlZnJlc2hDb29raWUuc3BsaXQoJ3wnKTtcbiAgICAgICAgaWYgKHJlZnJlc2hTcGxpdC5sZW5ndGggPj0gMikge1xuICAgICAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxSZWZyZXNoQ2hlY2ssXG4gICAgICAgICAgICAgIGRhdGE6IHsgdXNlcm5hbWU6IHJlZnJlc2hTcGxpdFswXSwgcmVmcmVzaF90b2tlbjogcmVmcmVzaFNwbGl0WzFdIH0sXG4gICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxuICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICBzdWNjZXNzOiAocmVmcmVzaFJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHJlZnJlc2hSZXNwb25zZSwgdHJ1ZSBdKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cnlEZWxldGVBY2NvdW50KGZvcm0pO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50ICg0KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQgKDUpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQgKDYpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gZGVsZXRlIHlvdXIgYWNjb3VudC4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlRGVsZXRlQWNjb3VudChmb3JtLCBkZXRhaWxzKSB7XG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XG5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIHRva2VuOiBkZXRhaWxzLnRva2VuLFxuXG4gICAgICB1c2VybmFtZTogZnJtLmZpbmQoJ2lucHV0I2xvZ2luX19maXJzdE5hbWUnKS52YWwoKSxcbiAgICAgIHBhc3N3b3JkOiBmcm0uZmluZCgnaW5wdXQjbG9naW5fX3Bhc3N3b3JkJykudmFsKClcbiAgICB9O1xuXG4gICAgaWYgKCgkLnRyaW0oZGF0YS51c2VybmFtZSkubGVuZ3RoID09IDApIHx8ICgkLnRyaW0oZGF0YS5wYXNzd29yZCkubGVuZ3RoID09IDApKSB7XG4gICAgICBhbGVydCgnUGxlYXNlIGVudGVyIHlvdXIgZW1haWwgYWRkcmVzcyBhbmQgcGFzc3dvcmQuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xuXG4gICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xuICAgICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsRGVsZXRlQWNjb3VudCxcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXG4gICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICBzdWNjZXNzOiAoZGVsZXRlQWNjb3VudFJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGVsZXRlQWNjb3VudFJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyBkZWxldGVBY2NvdW50UmVzcG9uc2UsIHRydWUgXSk7XG5cbiAgICAgICAgICAgICAgaWYgKGRlbGV0ZUFjY291bnRSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyQ29va2llKCdESEwuQXV0aFRva2VuJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhckNvb2tpZSgnREhMLlJlZnJlc2hUb2tlbicpO1xuXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZnJtLmRhdGEoJ3N1Y2Nlc3N1cmwnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkZWxldGUgeW91ciBhY2NvdW50LlxcbicgKyBkZWxldGVBY2NvdW50UmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRlbGV0ZSB5b3VyIGFjY291bnQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ0RlbGV0ZSBBY2NvdW50Jyk7XG4gICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdEZWxldGUgQWNjb3VudCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdEZWxldGUgQWNjb3VudCcpO1xuICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ0RlbGV0ZSBBY2NvdW50Jyk7XG4gIH1cblxuICBsb2dnZWRJbih0b2tlbkRhdGEpIHtcbiAgICBpZiAodG9rZW5EYXRhICYmIHRva2VuRGF0YS5zdGF0dXMgJiYgdG9rZW5EYXRhLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcbiAgICB9XG4gIH1cblxuICBub3RMb2dnZWRJbigpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmhhc0NsYXNzKCduby1yZWRpcmVjdCcpKSB7XG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuc2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGlzLmdldFBhdGhIb21lKCkgKyAnLmh0bWwnO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRGVsZXRlQWNjb3VudEZvcm0oKTtcbiIsImNsYXNzIEVjb21Gb3JtcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLmVjb20tZm9ybScsXG4gICAgICBjbG9zZUljb246ICcuZWNvbS1mb3JtX19jbG9zZScsXG4gICAgICBtYXhGb3JtOiAnLmVjb20tZm9ybS0tbWF4JyxcbiAgICAgIG1pbkZvcm06ICcuZWNvbS1mb3JtLS1taW4nLFxuICAgICAgc3VibWl0Rm9ybTogJy5lY29tLWZvcm0gaW5wdXRbdHlwZT1zdWJtaXRdJ1xuICAgIH07XG5cbiAgICB0aGlzLmRpc3BsYXlGb3JtQWZ0ZXIgPSA1MDAwO1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5mb3JtVGltZXIgPSB0aGlzLmZvcm1UaW1lci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvd0hpZGVNYXhGb3JtID0gdGhpcy5zaG93SGlkZU1heEZvcm0uYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3dIaWRlTWluRm9ybSA9IHRoaXMuc2hvd0hpZGVNaW5Gb3JtLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRGb3JtID0gdGhpcy5zdWJtaXRGb3JtLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB0aGlzLmZvcm1UaW1lcigpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5jbG9zZUljb24sICgpID0+IHtcbiAgICAgIHRoaXMuc2hvd0hpZGVNYXhGb3JtKCk7XG4gICAgICB0aGlzLnNob3dIaWRlTWluRm9ybSgpO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuc3VibWl0Rm9ybSwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGxldCBmb3JtID0gJChlLnRhcmdldCkuY2xvc2VzdCgnZm9ybScpO1xuICAgICAgdGhpcy5zdWJtaXRGb3JtKGZvcm0pO1xuICAgIH0pO1xuICB9XG5cbiAgZm9ybVRpbWVyKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zaG93SGlkZU1heEZvcm0oKTtcbiAgICB9LCB0aGlzLmRpc3BsYXlGb3JtQWZ0ZXIpO1xuICB9XG5cbiAgc2hvd0hpZGVNYXhGb3JtKCkge1xuICAgICQodGhpcy5zZWwubWF4Rm9ybSkudG9nZ2xlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICB9XG5cbiAgc2hvd0hpZGVNaW5Gb3JtKCkge1xuICAgICQodGhpcy5zZWwubWluRm9ybSkudG9nZ2xlQ2xhc3MoJ2lzLXNob3duJyk7XG4gIH1cblxuICBzdWJtaXRGb3JtKGZvcm0pIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGZvcm0uYXR0cignYWN0aW9uJykgKyAnPycgKyBmb3JtLnNlcmlhbGl6ZSgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBFY29tRm9ybXMoKTtcbiIsImltcG9ydCBQYXNzd29yZFZhbGlkaXR5IGZyb20gJy4vUGFzc3dvcmRWYWxpZGl0eSc7XG5cbmNsYXNzIEZvcm1WYWxpZGF0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuZm9ybXMnXG4gICAgfTtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMudmFsaWRhdGUgPSB0aGlzLnZhbGlkYXRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5hZGRQYXNzd29yZENoZWNrID0gdGhpcy5hZGRQYXNzd29yZENoZWNrLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcblxuICAgIHRoaXMuYWRkUGFzc3dvcmRDaGVjaygpO1xuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFkZFBhc3N3b3JkQ2hlY2soKSB7XG4gICAgJC52YWxpZGF0b3IuYWRkTWV0aG9kKCdwYXNzd29yZENoZWNrJywgKHZhbHVlKSA9PiB7XG4gICAgICByZXR1cm4gUGFzc3dvcmRWYWxpZGl0eS5pc1Bhc3N3b3JkVmFsaWQodmFsdWUpO1xuICAgIH0sICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBwYXNzd29yZCcpO1xuICB9XG5cbiAgdmFsaWRhdGUoKSB7XG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnZhbGlkYXRlKHtcbiAgICAgIHJ1bGVzOiB7XG4gICAgICAgICdyZXF1aXJlZCc6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAncGFzc3dvcmQnOiB7XG4gICAgICAgICAgcGFzc3dvcmRDaGVjazogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XG4gICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEZvcm1WYWxpZGF0aW9uKCk7XG4iLCJjbGFzcyBIZWFkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmxhc3RMZXR0ZXIgPSAnJztcbiAgICB0aGlzLmFsbFN1Z2dlc3Rpb25zID0gW107XG4gICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgdGhpcy5tYXhTdWdnZXN0aW9ucyA9IDA7XG4gICAgdGhpcy5sYXN0VmFsID0gJyc7XG5cbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5oZWFkZXInLFxuICAgICAgdG9nZ2xlOiAnLmhlYWRlcl9fbmF2aWdhdGlvbicsXG4gICAgICBtZW51OiAnLmhlYWRlcl9fbWVnYW5hdicsXG4gICAgICBvdmVybGF5OiAnLmhlYWRlcl9fb3ZlcmxheScsXG4gICAgICBzZWFyY2g6ICcuaGVhZGVyX19kZXNrdG9wU2VhcmNoJyxcbiAgICAgIHNlYXJjaEZvcm06ICcuaGVhZGVyX19zZWFyY2hmb3JtJyxcbiAgICAgIHNlYXJjaEZvcm1Gb3JtOiAnLmhlYWRlcl9fc2VhcmNoZm9ybSBmb3JtJyxcbiAgICAgIHNlYXJjaEZvcm1JbnB1dDogJy5oZWFkZXJfX3NlYXJjaGZvcm0gLmZvcm0tZmllbGQnLFxuICAgICAgc2VhcmNoRm9ybUlucHV0Q2xlYXI6ICcuaGVhZGVyX19zZWFyY2hmb3JtIC5mb3JtLWdyb3VwIC5jbGVhcicsXG4gICAgICBzZWFyY2hTdWdnZXN0aW9uczogJy5oZWFkZXJfX3NlYXJjaGZvcm0gLnN1Z2dlc3Rpb25zJyxcblxuICAgICAgY291bnRyeTogJy5oZWFkZXJfX2Rlc2t0b3BDb3VudHJ5JyxcbiAgICAgIGNvdW50cnlGb3JtOiAnLmhlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsJyxcbiAgICAgIGNvdW50cnlTZWNvbmRhcnk6ICcuaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwgLm1vYiAud2VsY29tZXMgYSdcbiAgICB9O1xuXG4gICAgdGhpcy5jb29raWVOYW1lID0gJ2RobC1kZWZhdWx0LWxhbmd1YWdlJztcblxuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IDA7XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRvZ2dsZU1lbnUgPSB0aGlzLnRvZ2dsZU1lbnUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRvZ2dsZVNlYXJjaCA9IHRoaXMudG9nZ2xlU2VhcmNoLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaG93U2VhcmNoID0gdGhpcy5zaG93U2VhcmNoLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oaWRlU2VhcmNoID0gdGhpcy5oaWRlU2VhcmNoLmJpbmQodGhpcyk7XG4gICAgdGhpcy50b2dnbGVDb3VudHJ5ID0gdGhpcy50b2dnbGVDb3VudHJ5LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaG93Q291bnRyeSA9IHRoaXMuc2hvd0NvdW50cnkuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhpZGVDb3VudHJ5ID0gdGhpcy5oaWRlQ291bnRyeS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2VsZWN0Q291bnRyeVNlY29uZGFyeSA9IHRoaXMuc2VsZWN0Q291bnRyeVNlY29uZGFyeS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYm9keVNjcm9sbGluZyA9IHRoaXMuYm9keVNjcm9sbGluZy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5jaGVja1Njcm9sbCA9IHRoaXMuY2hlY2tTY3JvbGwuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsIHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCwgKGUpID0+IHtcbiAgICAgIC8vIGRvd24gYXJyb3cgPSA0MFxuICAgICAgLy8gcmlnaHQgYXJyb3cgPSAzOVxuICAgICAgLy8gdXAgYXJyb3cgPSAzOFxuICAgICAgLy8gbGVmdCBhcnJvdyA9IDM3XG4gICAgICAvLyB0YWIgPSA5XG4gICAgICBpZiAoKGUua2V5Q29kZSA9PT0gOSAmJiAoIWUuc2hpZnRLZXkpKSB8fCAoZS5rZXlDb2RlID09PSA0MCkgfHwgKGUua2V5Q29kZSA9PT0gMzkpKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCsrO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4ID49IHRoaXMubWF4U3VnZ2VzdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hvd1N1Z2dlc3Rpb25zKHRydWUpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICgoZS5rZXlDb2RlID09PSA5ICYmIChlLnNoaWZ0S2V5KSkgfHwgKGUua2V5Q29kZSA9PT0gMzcpIHx8IChlLmtleUNvZGUgPT09IDM4KSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgtLTtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA8IDApIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSB0aGlzLm1heFN1Z2dlc3Rpb25zIC0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNob3dTdWdnZXN0aW9ucyh0cnVlKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgJChkb2N1bWVudCkub24oJ2tleXByZXNzJywgdGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0LCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgdmFyIGZpZWxkID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICB2YXIgcGFyYW1OYW1lID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgdmFyIHRlcm0gPSBmaWVsZC52YWwoKS50cmltKCk7XG4gICAgICAgIHZhciB1cmwgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdhY3Rpb24nKSArICc/JyArIHBhcmFtTmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh0ZXJtKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdXJsO1xuICAgICAgfVxuICAgIH0pO1xuICAgICQoZG9jdW1lbnQpLm9uKCdrZXl1cCcsIHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCwgKGUpID0+IHtcbiAgICAgIGlmICgoZS5rZXlDb2RlID09PSAxNikgfHwgKGUua2V5Q29kZSA9PT0gOSkgfHwgKGUua2V5Q29kZSA9PT0gNDApIHx8IChlLmtleUNvZGUgPT09IDM5KSB8fCAoZS5rZXlDb2RlID09PSAzNykgfHwgKGUua2V5Q29kZSA9PT0gMzgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZpZWxkID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgaWYgKGZpZWxkLnZhbCgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJCgnLnRvcC1zZWFyY2hlcycsIHRoaXMuc2VsLmNvbXBvbmVudCkuaGlkZSgpO1xuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dENsZWFyKS5zaG93KCk7XG4gICAgICAgIHRoaXMuY2hlY2tTdWdnZXN0aW9ucyhmaWVsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNsZWFyU3VnZ2VzdGlvbnMoKTtcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXRDbGVhcikuaGlkZSgpO1xuICAgICAgICAkKCcudG9wLXNlYXJjaGVzJywgdGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0Q2xlYXIsIChlKSA9PiB7XG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkudmFsKCcnKTtcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0Q2xlYXIpLmhpZGUoKTtcbiAgICAgIHRoaXMuY2xlYXJTdWdnZXN0aW9ucygpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwudG9nZ2xlLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy50b2dnbGVNZW51KCk7XG4gICAgfSk7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwub3ZlcmxheSwgdGhpcy50b2dnbGVNZW51KTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5zZWFyY2gsIHRoaXMudG9nZ2xlU2VhcmNoKTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5jb3VudHJ5LCB0aGlzLnRvZ2dsZUNvdW50cnkpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNvdW50cnlTZWNvbmRhcnksIHRoaXMuc2VsZWN0Q291bnRyeVNlY29uZGFyeSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmhlYWRlcl9fbGFuZywgLmhlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsIC5sYW5ncyBhLCAuaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwgLmNvdW50cmllcyBhJywgKGV2dCkgPT4ge1xuICAgICAgbGV0IGhyZWYgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJyk7XG4gICAgICBsZXQgaG9tZSA9ICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2RhdGEtaG9tZScpO1xuICAgICAgaWYgKGhvbWUgIT09IG51bGwgJiYgaG9tZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGhyZWYgPSBob21lO1xuICAgICAgfVxuXG4gICAgICBDb29raWVzLnNldCh0aGlzLmNvb2tpZU5hbWUsIGhyZWYpO1xuICAgIH0pO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCB0aGlzLmNoZWNrU2Nyb2xsKTtcbiAgICB0aGlzLmNoZWNrU2Nyb2xsKCk7XG5cbiAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkudmFsKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dENsZWFyKS5zaG93KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2hlY2tTY3JvbGwoKSB7XG4gICAgdmFyIHd0ID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgIHZhciBwYiA9ICQoJy5wYWdlLWJvZHknKS5vZmZzZXQoKS50b3A7XG4gICAgaWYgKHd0ID4gcGIpIHtcbiAgICAgICQoJy5wYWdlLWJvZHknKS5hZGRDbGFzcygnZml4ZWQnKTtcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnZml4ZWQnKTtcbiAgICAgIGlmICh3dCA+IHRoaXMubGFzdFNjcm9sbFRvcCkge1xuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkucmVtb3ZlQ2xhc3MoJ2luJyk7XG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLmFkZENsYXNzKCdoaWRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2luJyk7XG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJy5wYWdlLWJvZHknKS5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSB3dDtcbiAgfVxuXG4gIHRvZ2dsZU1lbnUoKSB7XG4gICAgaWYgKCEkKHRoaXMuc2VsLm1lbnUpLmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICB0aGlzLmJvZHlTY3JvbGxpbmcoZmFsc2UpO1xuICAgICAgJCh0aGlzLnNlbC50b2dnbGUpLmFkZENsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ib2R5U2Nyb2xsaW5nKHRydWUpO1xuICAgICAgJCh0aGlzLnNlbC50b2dnbGUpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKTtcbiAgICB9XG4gICAgJCh0aGlzLnNlbC5tZW51KS5zbGlkZVRvZ2dsZSgxNTApO1xuXG4gICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoRm9ybSkuaGFzQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpKSB7XG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLnJlbW92ZUNsYXNzKCdoZWFkZXJfX3NlYXJjaGZvcm0tLW9wZW4nKTtcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoKS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoLS1jbG9zZScpO1xuICAgICAgfSwgMTUwKTtcbiAgICB9XG4gICAgaWYgKCQodGhpcy5zZWwuY291bnRyeUZvcm0pLmhhc0NsYXNzKCdoZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbC0tb3BlbicpKSB7XG4gICAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKTtcbiAgICAgICQodGhpcy5zZWwuY291bnRyeSkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaCkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcENvdW50cnktLWNsb3NlJyk7XG4gICAgICB9LCAxNTApO1xuICAgIH1cbiAgfVxuXG4gIGJvZHlTY3JvbGxpbmcoZW5hYmxlZCkge1xuICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKTtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnYXV0byc7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdtb2RhbC1vcGVuJyk7XG4gICAgICBsZXQgd2luZG93SGVpZ2h0ID0gd2luZG93LnNjcmVlbi5hdmFpbEhlaWdodDtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLmhlaWdodCA9IHdpbmRvd0hlaWdodC50b1N0cmluZygpICsgJ3B4JztcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuaGVpZ2h0ID0gd2luZG93SGVpZ2h0LnRvU3RyaW5nKCkgKyAncHgnO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZVNlYXJjaChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaCkuaGFzQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKSkge1xuICAgICAgdGhpcy5oaWRlU2VhcmNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvd1NlYXJjaCgpO1xuXG4gICAgICAkKCcudG9wLXNlYXJjaGVzJywgdGhpcy5zZWwuY29tcG9uZW50KS5oaWRlKCk7XG4gICAgICAkKCcudG9wLXNlYXJjaGVzIC5pdGVtcycsIHRoaXMuc2VsLmNvbXBvbmVudCkuZW1wdHkoKTtcblxuICAgICAgdmFyIHVybCA9ICcnO1xuICAgICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2RhdGEtdG9wc2VhcmNoZXMnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHVybCA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2RhdGEtdG9wc2VhcmNoZXMnKTtcbiAgICAgIH1cbiAgICAgIGlmICh1cmwubGVuZ3RoID4gMCkge1xuICAgICAgICAkLmdldCh1cmwsIChyZXN1bHQpID0+IHtcbiAgICAgICAgICB2YXIgY29udGFpbmVyID0gJCgnLnRvcC1zZWFyY2hlcyAuaXRlbXMnLCB0aGlzLnNlbC5jb21wb25lbnQpO1xuICAgICAgICAgIHZhciBwYXJhbU5hbWUgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkuYXR0cignbmFtZScpO1xuICAgICAgICAgIHZhciBoYXNUZXJtcyA9IGZhbHNlO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LnJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGhhc1Rlcm1zID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciB0ZXJtID0gcmVzdWx0LnJlc3VsdHNbaV0udHJpbSgpO1xuICAgICAgICAgICAgdmFyIHNlYXJjaFVybCA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2FjdGlvbicpICsgJz8nICsgcGFyYW1OYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRlcm0pO1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZChgPGEgaHJlZj0nJHtzZWFyY2hVcmx9JyB0aXRsZT0nJHt0ZXJtfSc+PHNwYW4+JHt0ZXJtfTwvc3Bhbj48L2E+YCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGhhc1Rlcm1zKSB7XG4gICAgICAgICAgICAkKCcudG9wLXNlYXJjaGVzJywgdGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzaG93U2VhcmNoKCkge1xuICAgICQodGhpcy5zZWwuY291bnRyeUZvcm0pLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbC0tb3BlbicpO1xuICAgICQodGhpcy5zZWwuY291bnRyeSkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XG5cbiAgICAkKHRoaXMuc2VsLnNlYXJjaCkuYWRkQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKTtcbiAgICAkKHRoaXMuc2VsLnNlYXJjaCkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykuYWRkQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XG4gICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtKS5hZGRDbGFzcygnaGVhZGVyX19zZWFyY2hmb3JtLS1vcGVuJyk7XG4gICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmZvY3VzKCk7XG5cbiAgICBpZiAoJCh0aGlzLnNlbC50b2dnbGUpLmhhc0NsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKSkge1xuICAgICAgdGhpcy5ib2R5U2Nyb2xsaW5nKHRydWUpO1xuICAgICAgJCh0aGlzLnNlbC50b2dnbGUpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKTtcbiAgICAgICQodGhpcy5zZWwubWVudSkuc2xpZGVUb2dnbGUoMTUwKTtcbiAgICB9XG4gIH1cblxuICBoaWRlU2VhcmNoKCkge1xuICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpO1xuICAgICQodGhpcy5zZWwuc2VhcmNoKS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJCh0aGlzLnNlbC5zZWFyY2gpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BTZWFyY2gtLWNsb3NlJyk7XG4gICAgfSwgMTUwKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNoZWNrU3VnZ2VzdGlvbnMoZmllbGQpIHtcbiAgICB2YXIgdmFsID0gJC50cmltKGZpZWxkLnZhbCgpKTtcbiAgICB2YXIgcyA9IHZhbC5zdWJzdHIoMCwgMSk7XG4gICAgaWYgKHMgPT09IHRoaXMubGFzdExldHRlcikge1xuICAgICAgdGhpcy5zaG93U3VnZ2VzdGlvbnMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XG4gICAgICB0aGlzLmxhc3RMZXR0ZXIgPSBzO1xuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTE7XG5cbiAgICAgIHZhciB1cmwgPSAnJztcbiAgICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdkYXRhLXN1Z2dlc3Rpb25zJykubGVuZ3RoID4gMCkge1xuICAgICAgICB1cmwgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdkYXRhLXN1Z2dlc3Rpb25zJyk7XG4gICAgICB9XG5cbiAgICAgICQuZ2V0KHVybCwgeyBzOiBzIH0sIChyZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdC5yZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuY2xlYXJTdWdnZXN0aW9ucygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWxsU3VnZ2VzdGlvbnMgPSBbXTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5yZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmFsbFN1Z2dlc3Rpb25zLnB1c2gocmVzdWx0LnJlc3VsdHNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNob3dTdWdnZXN0aW9ucygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjbGVhclN1Z2dlc3Rpb25zKCkge1xuICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLmVtcHR5KCkuaGlkZSgpO1xuICB9XG5cbiAgc2hvd1N1Z2dlc3Rpb25zKHVzZUxhc3RWYWwpIHtcbiAgICB0aGlzLmNsZWFyU3VnZ2VzdGlvbnMoKTtcbiAgICB2YXIgdmFsID0gJC50cmltKCQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS52YWwoKSk7XG4gICAgaWYgKHVzZUxhc3RWYWwpIHtcbiAgICAgIHZhbCA9IHRoaXMubGFzdFZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXN0VmFsID0gdmFsO1xuICAgIH1cblxuICAgIHZhciBoYXNUZXJtcyA9IGZhbHNlO1xuICAgIHZhciBjID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYWxsU3VnZ2VzdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjb250YWlucyA9IGZhbHNlO1xuICAgICAgdmFyIHRlcm1zID0gdmFsLnRvTG93ZXJDYXNlKCkuc3BsaXQoL1xccy8pO1xuXG4gICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IHRlcm1zLmxlbmd0aDsgdCsrKSB7XG4gICAgICAgIGNvbnRhaW5zID0gdGhpcy5hbGxTdWdnZXN0aW9uc1tpXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRlcm1zW3RdLnRyaW0oKSk7XG4gICAgICAgIGlmIChjb250YWlucykgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoKHZhbC5sZW5ndGggPT09IDEpIHx8IGNvbnRhaW5zKSB7XG4gICAgICAgIHZhciBwYXJhbU5hbWUgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkuYXR0cignbmFtZScpO1xuICAgICAgICB2YXIgdGVybSA9IHRoaXMuYWxsU3VnZ2VzdGlvbnNbaV0udHJpbSgpO1xuICAgICAgICB2YXIgdXJsID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignYWN0aW9uJykgKyAnPycgKyBwYXJhbU5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodGVybSk7XG4gICAgICAgIHZhciBjbHMgPSAnJztcbiAgICAgICAgaWYgKGMgPT09IHRoaXMuc2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS52YWwodGVybSk7XG4gICAgICAgICAgY2xzID0gJyBjbGFzcz1cInNlbGVjdGVkXCInO1xuICAgICAgICB9XG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLmFwcGVuZChgPGEke2Nsc30gaHJlZj0nJHt1cmx9JyB0aXRsZT0nJHt0ZXJtfSc+PHNwYW4+JHt0ZXJtfTwvc3Bhbj48L2E+YCk7XG4gICAgICAgIGhhc1Rlcm1zID0gdHJ1ZTtcbiAgICAgICAgYysrO1xuICAgICAgfVxuXG4gICAgICBpZiAoYyA+PSAxMCkgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMubWF4U3VnZ2VzdGlvbnMgPSBjO1xuXG4gICAgaWYgKGhhc1Rlcm1zKSB7XG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaFN1Z2dlc3Rpb25zKS5zaG93KCk7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlQ291bnRyeShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICgkKHRoaXMuc2VsLmNvdW50cnkpLmhhc0NsYXNzKCdoZWFkZXJfX2Rlc2t0b3BDb3VudHJ5LS1jbG9zZScpKSB7XG4gICAgICB0aGlzLmhpZGVDb3VudHJ5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvd0NvdW50cnkoKTtcbiAgICB9XG4gIH1cblxuICBzaG93Q291bnRyeSgpIHtcbiAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLnJlbW92ZUNsYXNzKCdoZWFkZXJfX3NlYXJjaGZvcm0tLW9wZW4nKTtcbiAgICAkKHRoaXMuc2VsLnNlYXJjaCkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaCkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKTtcbiAgICB9LCAxNTApO1xuXG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5hZGRDbGFzcygnaGVhZGVyX19kZXNrdG9wQ291bnRyeS0tY2xvc2UnKTtcbiAgICAkKHRoaXMuc2VsLmNvdW50cnkpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLmFkZENsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xuICAgICQodGhpcy5zZWwuY291bnRyeUZvcm0pLmFkZENsYXNzKCdoZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbC0tb3BlbicpO1xuXG4gICAgaWYgKCQodGhpcy5zZWwudG9nZ2xlKS5oYXNDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJykpIHtcbiAgICAgIHRoaXMuYm9keVNjcm9sbGluZyh0cnVlKTtcbiAgICAgICQodGhpcy5zZWwudG9nZ2xlKS5yZW1vdmVDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XG4gICAgICAkKHRoaXMuc2VsLm1lbnUpLnNsaWRlVG9nZ2xlKDE1MCk7XG4gICAgfVxuICB9XG5cbiAgaGlkZUNvdW50cnkoKSB7XG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsLS1vcGVuJyk7XG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcbiAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5maW5kKCcubW9iJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wQ291bnRyeS0tY2xvc2UnKTtcbiAgICB9LCAxNTApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc2VsZWN0Q291bnRyeVNlY29uZGFyeShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQodGhpcy5zZWwuY291bnRyeUZvcm0pLmZpbmQoJy5tb2InKS5hZGRDbGFzcygnb3BlbicpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBIZWFkZXIoKTtcbiIsImNsYXNzIEhlcm8ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5oZXJvJyxcbiAgICAgIHRyaWdnZXI6ICcuaGVyb19fcGxheUJ1dHRvbiwgLmhlcm9fX2N0YS0tdmlkZW8nLFxuICAgICAgaWZyYW1lOiAnLmhlcm8gLmhlcm9fX3ZpZGVvJ1xuICAgIH07XG5cbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC50cmlnZ2VyLCB0aGlzLmhhbmRsZUNsaWNrKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0IHZpZGVvSWQgPSB0aGlzLmdldFZpZGVvSUQoZS50YXJnZXQuaHJlZik7XG4gICAgJCh0aGlzLnNlbC5pZnJhbWUpLmF0dHIoJ3NyYycsICdodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8nICsgdmlkZW9JZCArICc/cmVsPTAmYW1wO3Nob3dpbmZvPTAmYW1wO2F1dG9wbGF5PTEnKS5hZGRDbGFzcygnaGVyb19fdmlkZW8tLW9wZW4nKTtcbiAgfVxuXG4gIGdldFZpZGVvSUQoeXRVcmwpIHtcbiAgICBsZXQgaWQgPSAnJztcbiAgICBsZXQgdXJsID0geXRVcmwucmVwbGFjZSgvKD58PCkvZ2ksICcnKS5zcGxpdCgvKHZpXFwvfHY9fFxcL3ZcXC98eW91dHVcXC5iZVxcL3xcXC9lbWJlZFxcLykvKTtcbiAgICBpZiAodXJsWzJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlkID0gdXJsWzJdLnNwbGl0KC9bXjAtOWEtel9cXC1dL2kpO1xuICAgICAgaWQgPSBpZFswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgPSB1cmw7XG4gICAgfVxuICAgIHJldHVybiBpZDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBIZXJvKCk7XG4iLCJjbGFzcyBJRURldGVjdG9yIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICdib2R5J1xuICAgIH07XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRldGVjdElFID0gdGhpcy5kZXRlY3RJRS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdmFyIHZlcnNpb24gPSB0aGlzLmRldGVjdElFKCk7XG4gICAgaWYgKHZlcnNpb24gIT09IGZhbHNlKSB7XG4gICAgICBpZiAodmVyc2lvbiA+PSAxMikge1xuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2llLWVkZ2UnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcyhgaWUtJHt2ZXJzaW9ufWApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGRldGVjdElFKCkge1xuICAgIHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIC8vIFRlc3QgdmFsdWVzOyBVbmNvbW1lbnQgdG8gY2hlY2sgcmVzdWx0IOKAplxuICAgIC8vIElFIDEwXG4gICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKGNvbXBhdGlibGU7IE1TSUUgMTAuMDsgV2luZG93cyBOVCA2LjI7IFRyaWRlbnQvNi4wKSc7XG4gICAgLy8gSUUgMTFcbiAgICAvLyB1YSA9ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCA2LjM7IFRyaWRlbnQvNy4wOyBydjoxMS4wKSBsaWtlIEdlY2tvJzsgICAgLy8gRWRnZSAxMiAoU3BhcnRhbilcbiAgICAvLyB1YSA9ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXT1c2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzM5LjAuMjE3MS43MSBTYWZhcmkvNTM3LjM2IEVkZ2UvMTIuMCcgICAgLy8gRWRnZSAxM1xuICAgIC8vIHVhID0gJ01vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS80Ni4wLjI0ODYuMCBTYWZhcmkvNTM3LjM2IEVkZ2UvMTMuMTA1ODYnO1xuICAgIHZhciBtc2llID0gdWEuaW5kZXhPZignTVNJRSAnKTtcbiAgICBpZiAobXNpZSA+IDApIHtcbiAgICAgIC8vIElFIDEwIG9yIG9sZGVyID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhtc2llICsgNSwgdWEuaW5kZXhPZignLicsIG1zaWUpKSwgMTApO1xuICAgIH1cblxuICAgIHZhciB0cmlkZW50ID0gdWEuaW5kZXhPZignVHJpZGVudC8nKTtcbiAgICBpZiAodHJpZGVudCA+IDApIHtcbiAgICAgIC8vIElFIDExID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgdmFyIHJ2ID0gdWEuaW5kZXhPZigncnY6Jyk7XG4gICAgICByZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKHJ2ICsgMywgdWEuaW5kZXhPZignLicsIHJ2KSksIDEwKTtcbiAgICB9XG5cbiAgICB2YXIgZWRnZSA9IHVhLmluZGV4T2YoJ0VkZ2UvJyk7XG4gICAgaWYgKGVkZ2UgPiAwKSB7XG4gICAgICAvLyBFZGdlIChJRSAxMispID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhlZGdlICsgNSwgdWEuaW5kZXhPZignLicsIGVkZ2UpKSwgMTApO1xuICAgIH1cblxuICAgIC8vIG90aGVyIGJyb3dzZXJcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IElFRGV0ZWN0b3IoKTtcbiIsImNsYXNzIExhbmRpbmdQb2ludHMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5sYW5kaW5ncG9pbnRzJyxcbiAgICAgIGxhbmRpbmdQb2ludEl0ZW06ICcubGFuZGluZ3BvaW50cyAubGFuZGluZ3BvaW50JyxcbiAgICAgIGNsaWNrYWJsZVRpdGxlOiAnLmxhbmRpbmdwb2ludHMgLmxhbmRpbmdwb2ludF9fdGl0bGUgYSdcbiAgICB9O1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuY2xpY2thYmxlVGl0bGUsIChldnQpID0+IHtcbiAgICAgIHZhciBjb250YWluZXIgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KHRoaXMuc2VsLmxhbmRpbmdQb2ludEl0ZW0pO1xuICAgICAgaWYgKGNvbnRhaW5lci5oYXNDbGFzcygnb3BlbicpKSB7XG4gICAgICAgIGNvbnRhaW5lci5maW5kKCcubGFuZGluZ3BvaW50X19jb250ZW50JykuY3NzKHsgaGVpZ2h0OiAwIH0pO1xuICAgICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcubGFuZGluZ3BvaW50Lm9wZW4gLmxhbmRpbmdwb2ludF9fY29udGVudCcpLmNzcyh7IGhlaWdodDogMCB9KTtcbiAgICAgICAgJChldnQuY3VycmVudFRhcmdldCkuY2xvc2VzdCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJy5sYW5kaW5ncG9pbnQnKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICBjb250YWluZXIuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgY29udGFpbmVyLmZpbmQoJy5sYW5kaW5ncG9pbnRfX2NvbnRlbnQnKS5jc3MoeyBoZWlnaHQ6IGNvbnRhaW5lci5maW5kKCcubGFuZGluZ3BvaW50X19jb250ZW50IHAnKS5vdXRlckhlaWdodCgpIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IExhbmRpbmdQb2ludHMoKTtcblxuIiwiY2xhc3MgTGFuZ3VhZ2VEZXRlY3Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5yb290X19jb3VudHJ5U2VsZWN0UGFuZWwnXG4gICAgfTtcblxuICAgIHRoaXMucmVkaXJlY3QgPSB0cnVlO1xuICAgIHRoaXMuY29va2llTmFtZSA9ICdkaGwtZGVmYXVsdC1sYW5ndWFnZSc7XG5cbiAgICB0aGlzLmdldFBhdGhQcmVmaXggPSB0aGlzLmdldFBhdGhQcmVmaXguYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldFBhdGhQcmVmaXgoKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICghdGhpcy5yZWRpcmVjdCkge1xuICAgICAgJCgnLm1hc2snLCB0aGlzLnNlbCkuaGlkZSgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBjb29raWUgPSBDb29raWVzLmdldCh0aGlzLmNvb2tpZU5hbWUpO1xuICAgIGlmICh0eXBlb2YgY29va2llID09PSAndW5kZWZpbmVkJykge1xuICAgICAgbGV0IGxhbmd1YWdlID0gd2luZG93Lm5hdmlnYXRvci51c2VyTGFuZ3VhZ2UgfHwgd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZTtcbiAgICAgIGxldCBsYW5ndWFnZXNEYXRhID0gSlNPTi5wYXJzZSgkKCcjbGFuZ3VhZ2VzRGF0YScpLmh0bWwoKSk7XG4gICAgICBsZXQgY2F0Y2hBbGwgPSAnJztcbiAgICAgIGxldCB1cmwgPSAnJztcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYW5ndWFnZXNEYXRhLnZhcmlhbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCB2YXJpYW50ID0gbGFuZ3VhZ2VzRGF0YS52YXJpYW50c1tpXTtcbiAgICAgICAgaWYgKHZhcmlhbnQubGFuZ3VhZ2VzID09PSAnKicpIHtcbiAgICAgICAgICBjYXRjaEFsbCA9IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdmFyaWFudC5wYXRoICsgJy5odG1sJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFyaWFudC5sYW5ndWFnZXMuaW5kZXhPZihsYW5ndWFnZSkgPj0gMCkge1xuICAgICAgICAgIHVybCA9IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdmFyaWFudC5wYXRoICsgJy5odG1sJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHVybCAhPT0gJycpIHtcbiAgICAgICAgQ29va2llcy5zZXQodGhpcy5jb29raWVOYW1lLCB1cmwpO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcbiAgICAgIH0gZWxzZSBpZiAoY2F0Y2hBbGwgIT09ICcnKSB7XG4gICAgICAgIENvb2tpZXMuc2V0KHRoaXMuY29va2llTmFtZSwgY2F0Y2hBbGwpO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGNhdGNoQWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGNvb2tpZTtcbiAgICB9XG5cbiAgICAkKCcubWFzaycsIHRoaXMuc2VsKS5oaWRlKCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgTGFuZ3VhZ2VEZXRlY3QoKTtcbiIsImNsYXNzIExvZ2luRm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgZmJBcHBJZDogJzEwODAwMzEzMjg4MDEyMTEnLFxuICAgICAgZ29DbGllbnRJZDogJzMxMzQ2OTgzNzQyMC1sODgyaDM5Z2U4bjhuOXBiOTdsZHZqazNmbThwcHFncy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbScsXG5cbiAgICAgIHVybFRva2VuOiAnL2xpYnMvZ3Jhbml0ZS9jc3JmL3Rva2VuLmpzb24nLFxuICAgICAgdXJsTG9naW46ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvbG9naW4vaW5kZXguanNvbidcbiAgICB9O1xuXG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcucGFnZS1ib2R5LmxvZ2luIGZvcm0uZm9ybXMnLFxuICAgICAgYnV0dG9uRmFjZWJvb2s6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmZiJyxcbiAgICAgIGJ1dHRvbkxpbmtlZGluOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5saScsXG4gICAgICBidXR0b25Hb29nbGVQbHVzOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5nbydcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRQYXRoSG9tZSA9IHRoaXMuZ2V0UGF0aEhvbWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcblxuICAgIHRoaXMudHJ5TG9naW5GYWNlYm9vayA9IHRoaXMudHJ5TG9naW5GYWNlYm9vay5iaW5kKHRoaXMpO1xuICAgIHRoaXMudHJ5TG9naW5MaW5rZWRpbiA9IHRoaXMudHJ5TG9naW5MaW5rZWRpbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMudHJ5TG9naW5Hb29nbGUgPSB0aGlzLnRyeUxvZ2luR29vZ2xlLmJpbmQodGhpcyk7XG4gICAgdGhpcy50cnlMb2dpbiA9IHRoaXMudHJ5TG9naW4uYmluZCh0aGlzKTtcblxuICAgIHRoaXMuZXhlY3V0ZUxvZ2luID0gdGhpcy5leGVjdXRlTG9naW4uYmluZCh0aGlzKTtcblxuICAgIHRoaXMubG9nZ2VkSW4gPSB0aGlzLmxvZ2dlZEluLmJpbmQodGhpcyk7XG4gIH1cblxuICBnZXRQYXRoUHJlZml4KCkge1xuICAgIGNvbnN0IHByZWZpeCA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLXByZWZpeFxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XG4gIH1cblxuICBnZXRQYXRoSG9tZSgpIHtcbiAgICBjb25zdCBob21lID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtaG9tZVxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgcmV0dXJuIChob21lID8gaG9tZSA6ICcnKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKHdpbmRvdykub24oJ3VzZXJsb2dnZWRpbi5ESEwnLCAoKSA9PiB7XG4gICAgICB0aGlzLmxvZ2dlZEluKCk7XG4gICAgfSk7XG5cbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgncGFzc3dvcmQnLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKCQoZWxlbWVudCkuYXR0cigncGF0dGVybicpKS50ZXN0KHZhbHVlKTtcbiAgICB9LCAnUGFzc3dvcmQgZm9ybWF0IGlzIG5vdCB2YWxpZCcpO1xuXG4gICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ2VxdWFsVG8nLCAodmFsdWUsIGVsZW1lbnQpID0+IHtcbiAgICAgIHJldHVybiAoJCgnIycgKyAkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtZXF1YWxUbycpKS52YWwoKSA9PT0gJChlbGVtZW50KS52YWwoKSk7XG4gICAgfSwgJ1Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnKTtcblxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykubGVuZ3RoID4gMCkge1xuICAgICAgd2luZG93LmZiQXN5bmNJbml0ID0gKCkgPT4ge1xuICAgICAgICB3aW5kb3cuZmJfaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LkZCKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LkZCICE9PSBudWxsKSB7XG4gICAgICAgICAgICB3aW5kb3cuRkIuaW5pdCh7XG4gICAgICAgICAgICAgIGFwcElkOiB0aGlzLmNvbmZpZy5mYkFwcElkLFxuICAgICAgICAgICAgICBjb29raWU6IHRydWUsXG4gICAgICAgICAgICAgIHhmYm1sOiB0cnVlLFxuICAgICAgICAgICAgICB2ZXJzaW9uOiAndjIuOCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHdpbmRvdy5mYl9pbnRlcnZhbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAxMDApO1xuICAgICAgfTtcblxuICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYWNlYm9vay1qc3NkaycpID09PSBudWxsKSB7XG4gICAgICAgIHZhciBmanMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gICAgICAgIHZhciBqcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICBqcy5pZCA9ICdmYWNlYm9vay1qc3Nkayc7XG4gICAgICAgIGpzLnNyYyA9ICcvL2Nvbm5lY3QuZmFjZWJvb2submV0L2VuX0VOL3Nkay5qcyc7XG4gICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcbiAgICAgIH1cbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkZhY2Vib29rKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgIHRoaXMudHJ5TG9naW5GYWNlYm9vayhldnQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLmxlbmd0aCA+IDApIHtcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgIHRoaXMudHJ5TG9naW5MaW5rZWRpbihldnQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgZ29vZ2xlQnV0dG9uID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cyk7XG4gICAgaWYgKGdvb2dsZUJ1dHRvbi5sZW5ndGggPiAwKSB7XG4gICAgICB3aW5kb3cuZ29faW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5nYXBpKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmdhcGkgIT09IG51bGwpIHtcbiAgICAgICAgICB3aW5kb3cuZ2FwaS5sb2FkKCdhdXRoMicsICgpID0+IHtcbiAgICAgICAgICAgIHZhciBhdXRoMiA9IHdpbmRvdy5nYXBpLmF1dGgyLmluaXQoe1xuICAgICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY29uZmlnLmdvQ2xpZW50SWQsXG4gICAgICAgICAgICAgIGNvb2tpZXBvbGljeTogJ3NpbmdsZV9ob3N0X29yaWdpbidcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGdvb2dsZUJ1dHRvbi5nZXQoMCk7XG4gICAgICAgICAgICBhdXRoMi5hdHRhY2hDbGlja0hhbmRsZXIoZWxlbWVudCwge30sXG4gICAgICAgICAgICAgIChnb29nbGVVc2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50cnlMb2dpbkdvb2dsZShnb29nbGVVc2VyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmVycm9yICE9PSAncG9wdXBfY2xvc2VkX2J5X3VzZXInKSB7XG4gICAgICAgICAgICAgICAgICBhbGVydChyZXN1bHQuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmdvX2ludGVydmFsKTtcbiAgICAgICAgfVxuICAgICAgfSwgMTAwKTtcblxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnZhbGlkYXRlKHtcbiAgICAgIHJ1bGVzOiB7XG4gICAgICAgIGxvZ2luX19lbWFpbDogJ2VtYWlsJyxcbiAgICAgICAgbG9naW5fX3Bhc3N3b3JkOiAncGFzc3dvcmQnXG4gICAgICB9LFxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XG4gICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VibWl0SGFuZGxlcjogKGZvcm0pID0+IHtcbiAgICAgICAgdGhpcy50cnlMb2dpbihmb3JtKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdHJ5TG9naW5GYWNlYm9vayhldnQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkZhY2Vib29rKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xuXG4gICAgd2luZG93LkZCLmxvZ2luKChsb2dpblJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAobG9naW5SZXNwb25zZS5hdXRoUmVzcG9uc2UpIHtcbiAgICAgICAgd2luZG93LkZCLmFwaSgnL21lJywgKGRhdGFSZXNwb25zZSkgPT4ge1xuICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgdXNlcm5hbWU6IGRhdGFSZXNwb25zZS5lbWFpbCxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBkYXRhUmVzcG9uc2UuaWRcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdGhpcy5leGVjdXRlTG9naW4oZGF0YSwgKCkgPT4ge1xuICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLnRleHQoJ0ZhY2Vib29rJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIHsgZmllbGRzOiBbICdpZCcsICdlbWFpbCcgXX0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sIHsgc2NvcGU6ICdlbWFpbCxwdWJsaWNfcHJvZmlsZScsIHJldHVybl9zY29wZXM6IHRydWUgfSk7XG4gIH1cblxuICB0cnlMb2dpbkxpbmtlZGluKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG5cbiAgICBJTi5Vc2VyLmF1dGhvcml6ZSgoKSA9PiB7XG4gICAgICBJTi5BUEkuUHJvZmlsZSgnbWUnKS5maWVsZHMoJ2lkJywgJ2ZpcnN0LW5hbWUnLCAnbGFzdC1uYW1lJywgJ2VtYWlsLWFkZHJlc3MnKS5yZXN1bHQoKHJlc3VsdCkgPT4ge1xuICAgICAgICB2YXIgbWVtYmVyID0gcmVzdWx0LnZhbHVlc1swXTtcblxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICB1c2VybmFtZTogbWVtYmVyLmVtYWlsQWRkcmVzcyxcbiAgICAgICAgICBwYXNzd29yZDogbWVtYmVyLmlkXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5leGVjdXRlTG9naW4oZGF0YSwgKCkgPT4ge1xuICAgICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS50ZXh0KCdMaW5rZWRJbicpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgdmFyIHJlc3VsdCA9IHdpbmRvdy5JTi5Vc2VyLmlzQXV0aG9yaXplZCgpO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBJTi5BUEkuUHJvZmlsZSgnbWUnKS5maWVsZHMoJ2lkJywgJ2ZpcnN0LW5hbWUnLCAnbGFzdC1uYW1lJywgJ2VtYWlsLWFkZHJlc3MnKS5yZXN1bHQoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHZhciBtZW1iZXIgPSByZXN1bHQudmFsdWVzWzBdO1xuXG4gICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICB1c2VybmFtZTogbWVtYmVyLmVtYWlsQWRkcmVzcyxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBtZW1iZXIuaWRcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdGhpcy5leGVjdXRlTG9naW4oZGF0YSwgKCkgPT4ge1xuICAgICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLnRleHQoJ0xpbmtlZEluJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuXG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cnlMb2dpbkdvb2dsZShnb29nbGVVc2VyKSB7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICB1c2VybmFtZTogZ29vZ2xlVXNlci5nZXRCYXNpY1Byb2ZpbGUoKS5nZXRFbWFpbCgpLFxuICAgICAgcGFzc3dvcmQ6IGdvb2dsZVVzZXIuZ2V0QmFzaWNQcm9maWxlKCkuZ2V0SWQoKVxuICAgIH07XG5cbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xuICAgIHRoaXMuZXhlY3V0ZUxvZ2luKGRhdGEsICgpID0+IHtcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpLnRleHQoJ0dvb2dsZSsnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRyeUxvZ2luKGZvcm0pIHtcbiAgICB2YXIgZnJtID0gJChmb3JtKTtcbiAgICB2YXIgdXNlcm5hbWUgPSBmcm0uZmluZCgnaW5wdXQjbG9naW5fX2VtYWlsJykudmFsKCk7XG4gICAgdmFyIHBhc3N3b3JkID0gZnJtLmZpbmQoJ2lucHV0I2xvZ2luX19wYXNzd29yZCcpLnZhbCgpO1xuXG4gICAgaWYgKCgkLnRyaW0odXNlcm5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShwYXNzd29yZCkubGVuZ3RoID09PSAwKSkge1xuICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciB5b3VyIGVtYWlsIGFkZHJlc3MgYW5kIHBhc3N3b3JkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xuXG4gICAgICB0aGlzLmV4ZWN1dGVMb2dpbih7IHVzZXJuYW1lOiB1c2VybmFtZSwgcGFzc3dvcmQ6IHBhc3N3b3JkIH0sICgpID0+IHtcbiAgICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgnTG9nIEluJyk7XG4gICAgICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ0xvZ2luJyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBleGVjdXRlTG9naW4oZGF0YSwgdW53YWl0Q2FsbGJhY2spIHtcbiAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xuICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxMb2dpbixcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgcmVzcG9uc2UsIHRydWUgXSk7XG5cbiAgICAgICAgICAgICAgdmFyIGJhY2tVcmwgPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZGF0YSgnYmFjaycpO1xuICAgICAgICAgICAgICBpZiAoJC50cmltKGJhY2tVcmwpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGJhY2tVcmwgPSB0aGlzLmdldFBhdGhIb21lKCkgKyAnLmh0bWwnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGJhY2tVcmw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byByZWdpc3Rlci5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHJlZ2lzdGVyLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB1bndhaXRDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGxvZ2dlZEluKCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvY29udGVudC9kaGwveW91ci1hY2NvdW50Lmh0bWwnO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBMb2dpbkZvcm0oKTtcbiIsIlxuY2xhc3MgTWFya2V0Rm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnW2RhdGEtbWFya2V0by1mb3JtXScsXG4gICAgfTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB0aGlzLmJpbmRFdmVudHMoZWxlbWVudCwgaW5kZXgpKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYmluZEV2ZW50cyhlbGVtKSB7XG5cbiAgICBjb25zdCAkZWxlbSA9ICQoZWxlbSk7XG5cbiAgICBjb25zdCAkZm9ybSA9ICRlbGVtLmZpbmQoJ1tkYXRhLW1hcmtldG8tdmlzaWJsZS1mb3JtXScpO1xuXG4gICAgLy8gdmlzaWJsZSBmb3JtXG4gICAgY29uc3QgJG1hcmtldG9Gb3JtID0gJGZvcm0uZmluZCgnZm9ybScpO1xuICAgIGNvbnN0IG1hcmtldG9Gb3JtQXR0ciA9ICRtYXJrZXRvRm9ybSA/ICRtYXJrZXRvRm9ybS5hdHRyKCdpZCcpIDogJyc7XG4gICAgY29uc3QgbWFya2V0b0Zvcm1JZCA9IG1hcmtldG9Gb3JtQXR0ciA/IG1hcmtldG9Gb3JtQXR0ci5yZXBsYWNlKCdta3RvRm9ybV8nLCAnJykgOiAnJztcblxuICAgIGNvbnN0IF9wdWJsaWMgPSB7fTtcblxuICAgIGxldCBsb2FkZWRGb3JtcyA9IFtdXG5cbiAgICBjb25zdCBmb3JtID0gJGVsZW0uYXR0cignZGF0YS1tYXJrZXRvLWZvcm0nKTtcblxuICAgIGNvbnN0IGhpZGRlblNldHRpbmdzID0gZm9ybSA/IEpTT04ucGFyc2UoZm9ybSkgOiBudWxsO1xuXG4gICAgaWYgKG1hcmtldG9Gb3JtSWQubGVuZ3RoICE9PSAwKSB7XG5cbiAgICAgIE1rdG9Gb3JtczIud2hlblJlYWR5KGZ1bmN0aW9uKG1rdG9Gb3JtKSB7XG4gICAgICAgICQoJyNta3RvRm9ybXMyQmFzZVN0eWxlJykucmVtb3ZlKCk7XG4gICAgICAgICQoJyNta3RvRm9ybXMyVGhlbWVTdHlsZScpLnJlbW92ZSgpO1xuXG4gICAgICAgIGNvbnN0IGZvcm1JZCA9IG1rdG9Gb3JtLmdldElkKCk7XG5cbiAgICAgICAgaWYgKGxvYWRlZEZvcm1zLmluZGV4T2YoZm9ybUlkLnRvU3RyaW5nKCkpICE9PSAtMSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmb3JtSWQudG9TdHJpbmcoKSA9PT0gbWFya2V0b0Zvcm1JZC50b1N0cmluZygpKSB7XG4gICAgICAgICAgbG9hZGVkRm9ybXMucHVzaChmb3JtSWQudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpc2Zvcm0gPSBta3RvRm9ybS5nZXRJZCgpLnRvU3RyaW5nKCkgPT09IG1hcmtldG9Gb3JtSWQudG9TdHJpbmcoKTtcblxuICAgICAgICBpZiAoaXNmb3JtKSB7XG5cbiAgICAgICAgICBta3RvRm9ybS5vblN1Y2Nlc3MoKGUpID0+IHtcblxuICAgICAgICAgICAgaWYgKCFoaWRkZW5TZXR0aW5ncykge1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgTWt0b0Zvcm1zMi5sb2FkRm9ybShcIi8vZXhwcmVzcy1yZXNvdXJjZS5kaGwuY29tXCIsIGhpZGRlblNldHRpbmdzLmhpZGRlbk11bmNoa2luSWQsIGhpZGRlblNldHRpbmdzLmhpZGRlbkZvcm1JZCwgZnVuY3Rpb24oaGlkZGVuRm9ybSkge1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Zvcm1Mb2FkZWQnLCBoaWRkZW5Gb3JtLCBlKTtcblxuICAgICAgICAgICAgICBjb25zdCBta3RvRmllbGRzT2JqID0gJC5leHRlbmQoZSwgaGlkZGVuRm9ybS5nZXRWYWx1ZXMoKSk7XG5cbiAgICAgICAgICAgICAgaGlkZGVuRm9ybS5hZGRIaWRkZW5GaWVsZHMobWt0b0ZpZWxkc09iaik7XG4gICAgICAgICAgICAgIGhpZGRlbkZvcm0uc3VibWl0KCk7XG5cbiAgICAgICAgICAgICAgaGlkZGVuRm9ybS5vblN1Ym1pdCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWNvbmQgZm9ybSBzdWJtaXQuLi4nLCBlLmdldFZhbHVlcygpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGhpZGRlbkZvcm0ub25TdWNjZXNzKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlY29uZCBmb3JtIHN1Y2Nlc3MuLi4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE1rdG9Gb3JtczIud2hlblJlYWR5KGZ1bmN0aW9uKG1rdG9Gb3JtKSB7XG4gICAgICAgICQoJyNta3RvRm9ybXMyQmFzZVN0eWxlJykucmVtb3ZlKCk7XG4gICAgICAgICQoJyNta3RvRm9ybXMyVGhlbWVTdHlsZScpLnJlbW92ZSgpO1xuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IE1hcmtldEZvcm0oKTtcbiIsImltcG9ydCBUb2FzdCBmcm9tICcuL1RvYXN0JztcbmltcG9ydCBEYXRhYmFzZSBmcm9tICcuL0RhdGFiYXNlJztcblxuY2xhc3MgU2F2ZUZvck9mZmxpbmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5oZXJvX19zYXZlRm9yT2ZmbGluZSdcbiAgICB9O1xuICAgIC8vIENyZWF0ZSBhcnRpY2xlIGNhY2hlIG5hbWVcbiAgICB0aGlzLmFydGljbGVDYWNoZU5hbWUgPSAnb2ZmbGluZS0nICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmRvU2F2ZSA9IHRoaXMuZG9TYXZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5kb1Vuc2F2ZSA9IHRoaXMuZG9VbnNhdmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldEhlcm9JbWFnZXMgPSB0aGlzLmdldEhlcm9JbWFnZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmlzQ3VycmVudFBhZ2VTYXZlZCA9IHRoaXMuaXNDdXJyZW50UGFnZVNhdmVkLmJpbmQodGhpcyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNvbXBvbmVudCwgdGhpcy5oYW5kbGVDbGljayk7XG4gIH1cblxuICBoYW5kbGVDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuaGFzQ2xhc3MoJ2hlcm9fX3NhdmVGb3JPZmZsaW5lLS1zYXZlZCcpKSB7XG4gICAgICB0aGlzLmRvVW5zYXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9TYXZlKCk7XG4gICAgfVxuICB9XG5cbiAgaXNDdXJyZW50UGFnZVNhdmVkKCkge1xuICAgIC8vIENoZWNrIGlmIGFscmVhZHkgc2F2ZWRcbiAgICBjYWNoZXMua2V5cygpLnRoZW4oKGNhY2hlTmFtZXMpID0+IHsgLy8gR2V0IGFycmF5IG9mIGNhY2hlIG5hbWVzXG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICAgIGNhY2hlTmFtZXMuZmlsdGVyKChjYWNoZU5hbWUpID0+IHsgLy8gRmlsdGVyIGFycmF5XG4gICAgICAgICAgcmV0dXJuIChjYWNoZU5hbWUgPT09IHRoaXMuYXJ0aWNsZUNhY2hlTmFtZSk7IC8vIElmIG1hdGNoZXMgY3VycmVudCBwYXRobmFtZVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KS50aGVuKChjYWNoZU5hbWVzKSA9PiB7IC8vIE9uY2UgZ290IGZpbHRlcmVkIGFycmF5XG4gICAgICBpZiAoY2FjaGVOYW1lcy5sZW5ndGggPiAwKSB7IC8vIElmIHRoZXJlIGFyZSBjYWNoZXNcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdoZXJvX19zYXZlRm9yT2ZmbGluZS0tc2F2ZWQnKS5hdHRyKCd0aXRsZScsICdBcnRpY2xlIFNhdmVkJykuZmluZCgnc3BhbicpLnRleHQoJ0FydGljbGUgU2F2ZWQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldEhlcm9JbWFnZXMoKSB7XG4gICAgLy8gR2V0IHRoZSBoZXJvIGltYWdlIGVsZW1lbnRcbiAgICBsZXQgJGhlcm9JbWFnZSA9ICQoJy5oZXJvX19pbWFnZScpO1xuICAgIC8vIElmIGl0IGV4aXN0c1xuICAgIGlmICgkaGVyb0ltYWdlLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIENyZWF0ZSBhcnJheSBmb3IgaW1hZ2VzXG4gICAgICBsZXQgaW1hZ2VzID0gW107XG4gICAgICAvLyBBZGQgdGhlIG1vYmlsZSBpbWFnZSBVUkxcbiAgICAgIGltYWdlcy5wdXNoKFxuICAgICAgICAkaGVyb0ltYWdlLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KCd1cmwoJylbMV0uc3BsaXQoJyknKVswXS5yZXBsYWNlKC9cIi9nLCAnJykucmVwbGFjZSgvJy9nLCAnJylcbiAgICAgICk7XG4gICAgICAvLyBHZXQgdGhlIGRlc2t0b3AgaW1hZ2UgVVJMXG4gICAgICBsZXQgZGVza3RvcFN0eWxlcyA9ICRoZXJvSW1hZ2UucGFyZW50cygnLmhlcm8nKS5maW5kKCdzdHlsZScpLmh0bWwoKS5zcGxpdCgndXJsKCcpWzFdLnNwbGl0KCcpJylbMF0ucmVwbGFjZSgvXCIvZywgJycpLnJlcGxhY2UoLycvZywgJycpO1xuICAgICAgLy8gQWRkIHRoZSBkZXNrdG9wIGltYWdlIHRvIHRoZSBhcnJheVxuICAgICAgaW1hZ2VzLnB1c2goZGVza3RvcFN0eWxlcyk7XG4gICAgICAvLyBSZXR1cm4gdGhlIGltYWdlc1xuICAgICAgcmV0dXJuIGltYWdlcztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZG9VbnNhdmUocGF0aE5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpIHtcbiAgICBsZXQgdG9hc3QgPSBuZXcgVG9hc3QoJ0FydGljbGUgaGFzIGJlZW4gcmVtb3ZlZCcsIDMwMDApO1xuICAgIC8vIFJlbW92ZSBhcnRpY2xlIGZyb20gSURCXG4gICAgcmV0dXJuIERhdGFiYXNlLmRlbGV0ZUFydGljbGUocGF0aE5hbWUpLnRoZW4oKCkgPT4gey8vIERlbGV0ZWQgZnJvbSBJREIgc3VjY2Vzc2Z1bGx5XG4gICAgICAvLyBSZW1vdmUgYXJ0aWNsZSBjb250ZW50XG4gICAgICBjYWNoZXMuZGVsZXRlKCdvZmZsaW5lLScgKyBwYXRoTmFtZSkudGhlbigoKSA9PiB7XG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5yZW1vdmVDbGFzcygnaGVyb19fc2F2ZUZvck9mZmxpbmUtLXNhdmVkJykuYXR0cigndGl0bGUnLCAnU2F2ZSBBcnRpY2xlJykuZmluZCgnc3BhbicpLnRleHQoJ1NhdmUgQXJ0aWNsZScpO1xuICAgICAgICB0b2FzdC5zaG93KCk7XG4gICAgICB9KTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7Ly8gVGhlcmUgd2FzIGFuIGVycm9yIGRlbGV0aW5nIGZyb20gSURCXG4gICAgICB0b2FzdC5zZXRUZXh0KCdUaGVyZSB3YXMgYSBwcm9ibGVtIGRlbGV0aW5nIHRoZSBhcnRpY2xlJyk7XG4gICAgICB0b2FzdC5zaG93KCk7XG4gICAgfSk7XG4gIH1cblxuICBkb1NhdmUoKSB7XG4gICAgLy8gQ3JlYXRlIHRvYXN0IGZvciBjb25maXJtYXRpb25cbiAgICBsZXQgdG9hc3QgPSBuZXcgVG9hc3QoJ0FydGljbGUgaXMgbm93IGF2YWlsYWJsZSBvZmZsaW5lJywgMzAwMCk7XG5cbiAgICBpZiAoJCgnI2FydGljbGVEYXRhJykubGVuZ3RoIDw9IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKCdTVyBFUlJPUjogT2ZmbGluZS5qczo5MCcpO1xuICAgICAgdG9hc3Quc2V0VGV4dCgnQXJ0aWNsZSBjb3VsZCBub3QgYmUgc2F2ZWQgZm9yIG9mZmxpbmUnKTtcbiAgICAgIHRvYXN0LnNob3coKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gR2V0IHBhZ2UgZGF0YSBmb3IgSURCXG4gICAgbGV0IHBhZ2VEYXRhID0gSlNPTi5wYXJzZSgkKCcjYXJ0aWNsZURhdGEnKS5odG1sKCkpO1xuXG4gICAgLy8gQWRkIGFydGljbGUgdG8gSURCXG4gICAgRGF0YWJhc2UuYWRkQXJ0aWNsZShcbiAgICAgIHBhZ2VEYXRhLnRpdGxlLFxuICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgcGFnZURhdGEuZGVzY3JpcHRpb24sXG4gICAgICBwYWdlRGF0YS5jYXRlZ29yeU5hbWUsXG4gICAgICBwYWdlRGF0YS5jYXRlZ29yeUxpbmssXG4gICAgICBwYWdlRGF0YS50aW1lVG9SZWFkLFxuICAgICAgcGFnZURhdGEuaW1hZ2VNb2JpbGUsXG4gICAgICBwYWdlRGF0YS5pbWFnZURlc2t0b3AsXG4gICAgICBwYWdlRGF0YS5pc0xhcmdlLFxuICAgICAgcGFnZURhdGEuaXNWaWRlbyxcbiAgICAgIHRoaXMuYXJ0aWNsZUNhY2hlTmFtZVxuICAgICkudGhlbigoKSA9PiB7Ly8gU2F2ZWQgaW4gSURCIHN1Y2Nlc3NmdWxseVxuICAgICAgLy8gQnVpbGQgYW4gYXJyYXkgb2YgdGhlIHBhZ2Utc3BlY2lmaWMgcmVzb3VyY2VzLlxuICAgICAgbGV0IHBhZ2VSZXNvdXJjZXMgPSBbd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBwYWdlRGF0YS5pbWFnZU1vYmlsZSwgcGFnZURhdGEuaW1hZ2VEZXNrdG9wXTtcblxuICAgICAgLy8gQWRkIHRoZSBoZXJvIGltYWdlc1xuICAgICAgaWYgKCQoJy5oZXJvX19pbWFnZScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGhlcm9JbWFnZXMgPSB0aGlzLmdldEhlcm9JbWFnZXMoKTtcbiAgICAgICAgaWYgKGhlcm9JbWFnZXMpIHBhZ2VSZXNvdXJjZXMgPSBwYWdlUmVzb3VyY2VzLmNvbmNhdChoZXJvSW1hZ2VzKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoZSBhY2NvdW50IGFwcGx5IGltYWdlc1xuICAgICAgaWYgKCQoJy5hY2NvdW50YXBwbHknKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBhY2NvdW50QXBwbHlJbWFnZSA9ICQoJy5hY2NvdW50YXBwbHkgLmNvbnRhaW5lcicpLmNzcygnYmFja2dyb3VuZC1pbWFnZScpO1xuICAgICAgICBpZiAoYWNjb3VudEFwcGx5SW1hZ2UgIT0gXCJcIikge1xuICAgICAgICAgIGFjY291bnRBcHBseUltYWdlID0gYWNjb3VudEFwcGx5SW1hZ2Uuc3BsaXQoJ3VybCgnKVsxXS5zcGxpdCgnKScpWzBdLnJlcGxhY2UoL1wiL2csICcnKS5yZXBsYWNlKC8nL2csICcnKTtcbiAgICAgICAgICBwYWdlUmVzb3VyY2VzLnB1c2goYWNjb3VudEFwcGx5SW1hZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCBpbWFnZXMgdG8gdGhlIGFycmF5XG4gICAgICAkKCcucGFnZS1ib2R5IC53eXNpd3lnIGltZywgLmF1dGhvclBhbmVsIGltZycpLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICAgIC8vIFRyaW0gd2hpdGVzcGFjZSBmb3JtIHNyY1xuICAgICAgICBsZXQgaW1nU3JjID0gJC50cmltKCQoZWxlbWVudCkuYXR0cignc3JjJykpO1xuICAgICAgICAvLyBJZiBlbXB0eSBzcmMgc2tpcCB0aGlzIGltYWdlXG4gICAgICAgIGlmICghKGltZ1NyYyA9PT0gJycpKSB7XG4gICAgICAgICAgLy8gQWRkIHRvIHBhZ2UgcmVzb3VyY2VzXG4gICAgICAgICAgcGFnZVJlc291cmNlcy5wdXNoKCQoZWxlbWVudCkuYXR0cignc3JjJykpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gT3BlbiB0aGUgdW5pcXVlIGNhY2hlIGZvciB0aGlzIFVSTFxuICAgICAgY2FjaGVzLm9wZW4odGhpcy5hcnRpY2xlQ2FjaGVOYW1lKS50aGVuKChjYWNoZSkgPT4ge1xuICAgICAgICAvLyBVbmlxdWUgVVJMc1xuICAgICAgICBsZXQgdW5pcXVlUmVzb3VyY2VzID0gW107XG4gICAgICAgIC8vIENyZWF0ZSBhbmNob3IgZWxlbWVudCB0byBnZXQgZnVsbCBVUkxzXG4gICAgICAgIGxldCBhbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIC8vIERlZHVwZSBhc3NldHNcbiAgICAgICAgJC5lYWNoKHBhZ2VSZXNvdXJjZXMsIChpLCBlbCkgPT4ge1xuICAgICAgICAgIC8vIExvYWQgdGhlIGN1cnJlbnQgVVJMIGludG8gdGhlIGFuY2hvclxuICAgICAgICAgIGFuY2hvci5ocmVmID0gZWw7XG4gICAgICAgICAgLy8gT25seSBjYWNoZSBVUkxzIG9uIG91ciBkb21haW5cbiAgICAgICAgICBpZiAoYW5jaG9yLmhvc3QgIT09IHdpbmRvdy5sb2NhdGlvbi5ob3N0KSByZXR1cm47XG4gICAgICAgICAgLy8gR2V0IHRoZSByZWxhdGl2ZSBwYXRoXG4gICAgICAgICAgbGV0IHJlbGF0aXZlID0gYW5jaG9yLnBhdGhuYW1lICsgYW5jaG9yLnNlYXJjaDtcbiAgICAgICAgICAvLyBJZiBhbHJlYWR5IGluIGxpc3Qgb2YgYXNzZXRzLCBkb24ndCBpbmNsdWRlIGl0IGFnYWluXG4gICAgICAgICAgaWYgKCQuaW5BcnJheShyZWxhdGl2ZSwgdW5pcXVlUmVzb3VyY2VzKSA9PT0gLTEpIHVuaXF1ZVJlc291cmNlcy5wdXNoKHJlbGF0aXZlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIENhY2hlIGFsbCByZXF1aXJlZCBhc3NldHNcbiAgICAgICAgbGV0IHVwZGF0ZUNhY2hlID0gY2FjaGUuYWRkQWxsKHVuaXF1ZVJlc291cmNlcyk7XG4gICAgICAgIC8vIFVwZGF0ZSBVSSB0byBpbmRpY2F0ZSBzdWNjZXNzXG4gICAgICAgIC8vIE9yIGNhdGNoIGFueSBlcnJvcnMgaWYgaXQgZG9lc24ndCBzdWNjZWVkXG4gICAgICAgIHVwZGF0ZUNhY2hlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdBcnRpY2xlIGlzIG5vdyBhdmFpbGFibGUgb2ZmbGluZS4nKTtcbiAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2hlcm9fX3NhdmVGb3JPZmZsaW5lLS1zYXZlZCcpLmF0dHIoJ3RpdGxlJywgJ1NhdmVkIGZvciBvZmZsaW5lJykuZmluZCgnc3BhbicpLnRleHQoJ0FydGljbGUgU2F2ZWQnKTtcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ0FydGljbGUgY291bGQgbm90IGJlIHNhdmVkIGZvciBvZmZsaW5lLicsIGVycm9yKTtcbiAgICAgICAgICB0b2FzdC5zZXRUZXh0KCdBcnRpY2xlIGNvdWxkIG5vdCBiZSBzYXZlZCBmb3Igb2ZmbGluZScpO1xuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0b2FzdC5zaG93KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7Ly8gVGhlcmUgd2FzIGFuIGVycm9yIHNhdmluZyB0byBJREJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgdG9hc3Quc2V0VGV4dCgnQXJ0aWNsZSBjb3VsZCBub3QgYmUgc2F2ZWQgZm9yIG9mZmxpbmUnKTtcbiAgICAgIHRvYXN0LnNob3coKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuaXNDdXJyZW50UGFnZVNhdmVkKCk7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuY2xhc3MgT2ZmbGluZUFydGljbGVzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuYXJ0aWNsZUdyaWQtLXNhdmVkJyxcbiAgICAgIGdyaWQ6ICcuYXJ0aWNsZUdyaWQtLXNhdmVkIC5hcnRpY2xlR3JpZF9fZ3JpZCcsXG4gICAgICB0aXRsZTogJy5hcnRpY2xlR3JpZC0tc2F2ZWQgLmFydGljbGVHcmlkX190aXRsZScsXG4gICAgICB0ZW1wbGF0ZTogJyNhcnRpY2xlR3JpZF9fcGFuZWxUZW1wbGF0ZScsXG4gICAgICBlZGl0U2F2ZWRBcnRpY2xlczogJy5oZXJvX19lZGl0U2F2ZWRBcnRpY2xlcycsXG4gICAgICBhcnRpY2xlczogJy5hcnRpY2xlR3JpZC0tc2F2ZWQgLmFydGljbGVHcmlkX19ncmlkIC5hcnRpY2xlUGFuZWwnLFxuICAgICAgZGVsZXRhYmxlQXJ0aWNsZTogJy5hcnRpY2xlR3JpZC0tc2F2ZWQgLmFydGljbGVHcmlkX19ncmlkIC5hcnRpY2xlUGFuZWwtLWRlbGV0YWJsZSdcbiAgICB9O1xuICAgIHRoaXMuc2F2ZUZvck9mZmxpbmUgPSBuZXcgU2F2ZUZvck9mZmxpbmUoKTtcbiAgICB0aGlzLnRlbXBsYXRlID0gJCgkKHRoaXMuc2VsLnRlbXBsYXRlKS5odG1sKCkpO1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5sb2FkQXJ0aWNsZXMgPSB0aGlzLmxvYWRBcnRpY2xlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMucG9wdWxhdGVUZW1wbGF0ZXMgPSB0aGlzLnBvcHVsYXRlVGVtcGxhdGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVFZGl0ID0gdGhpcy5oYW5kbGVFZGl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5kZWxldGVBcnRpY2xlID0gdGhpcy5kZWxldGVBcnRpY2xlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTd2lwZSA9IHRoaXMuaGFuZGxlU3dpcGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGxvYWRBcnRpY2xlcygpIHtcbiAgICByZXR1cm4gRGF0YWJhc2UuZ2V0QXJ0aWNsZXMoKS50aGVuKChhcnRpY2xlcykgPT4ge1xuICAgICAgbGV0IGl0ZW1zID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFydGljbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBhcnRpY2xlID0gYXJ0aWNsZXNbaV07XG4gICAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICAgIExpbms6IGFydGljbGUubGluayxcbiAgICAgICAgICBUaXRsZTogYXJ0aWNsZS50aXRsZSxcbiAgICAgICAgICBEZXNjcmlwdGlvbjogYXJ0aWNsZS5kZXNjcmlwdGlvbixcbiAgICAgICAgICBDYXRlZ29yeToge1xuICAgICAgICAgICAgTmFtZTogYXJ0aWNsZS5jYXRlZ29yeU5hbWUsXG4gICAgICAgICAgICBMaW5rOiBhcnRpY2xlLmNhdGVnb3J5TGlua1xuICAgICAgICAgIH0sXG4gICAgICAgICAgVGltZVRvUmVhZDogYXJ0aWNsZS50aW1lVG9SZWFkLFxuICAgICAgICAgIEltYWdlczoge1xuICAgICAgICAgICAgTW9iaWxlOiBhcnRpY2xlLmltYWdlTW9iaWxlLFxuICAgICAgICAgICAgRGVza3RvcDogYXJ0aWNsZS5pbWFnZURlc2t0b3BcbiAgICAgICAgICB9LFxuICAgICAgICAgIElzTGFyZ2U6IGFydGljbGUuaXNMYXJnZSxcbiAgICAgICAgICBJc1ZpZGVvOiBhcnRpY2xlLmlzVmlkZW9cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAkKHRoaXMuc2VsLmdyaWQpLmh0bWwodGhpcy5wb3B1bGF0ZVRlbXBsYXRlcyhpdGVtcykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCh0aGlzLnNlbC50aXRsZSkudGV4dCgnWW91IGhhdmUgbm8gc2F2ZWQgYXJ0aWNsZXMnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHBvcHVsYXRlVGVtcGxhdGVzKGl0ZW1zKSB7XG4gICAgbGV0IG91dHB1dCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIENsb25lIHRlbXBsYXRlXG4gICAgICBsZXQgJHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZS5jbG9uZSgpO1xuICAgICAgLy8gR2V0IHRoZSBpdGVtXG4gICAgICBsZXQgaXRlbSA9IGl0ZW1zW2ldO1xuICAgICAgLy8gU2V0IGltYWdlIGJyZWFrcG9pbnRcbiAgICAgIGxldCBkZXNrdG9wQnJlYWtwb2ludCA9IDk5MjtcbiAgICAgIC8vIEdlbmVyYXRlIElEXG4gICAgICBsZXQgcGFuZWxJZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCA5KTtcbiAgICAgIC8vIFBvcHVsYXRlIElEXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbCcpLmF0dHIoJ2lkJywgcGFuZWxJZCk7XG4gICAgICAvLyBJZiBsYXJnZSBwYW5lbFxuICAgICAgaWYgKGl0ZW0uSXNMYXJnZSkge1xuICAgICAgICAvLyBVcGRhdGUgaW1hZ2UgYnJlYWtwb2ludFxuICAgICAgICBkZXNrdG9wQnJlYWtwb2ludCA9IDc2ODtcbiAgICAgICAgLy8gQWRkIGNsYXNzXG4gICAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsJykuYWRkQ2xhc3MoJ2FydGljbGVQYW5lbC0tbGFyZ2UnKTtcbiAgICAgIH1cbiAgICAgIC8vIElmIHZpZGVvXG4gICAgICBpZiAoaXRlbS5Jc1ZpZGVvKSB7XG4gICAgICAgIC8vIEFkZCBjbGFzc1xuICAgICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbCcpLmFkZENsYXNzKCdhcnRpY2xlUGFuZWwtLXZpZGVvJyk7XG4gICAgICB9XG4gICAgICAvLyBQb3B1bGF0ZSBpbWFnZXNcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX19pbWFnZScpLmF0dHIoe1xuICAgICAgICBocmVmOiBpdGVtLkxpbmssXG4gICAgICAgIHRpdGxlOiBpdGVtLlRpdGxlXG4gICAgICB9KS5hdHRyKCdzdHlsZScsICdiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyArIGl0ZW0uSW1hZ2VzLk1vYmlsZSArICcpOycpO1xuICAgICAgJHRlbXBsYXRlLmZpbmQoJ3N0eWxlJylbMF0uaW5uZXJIVE1MID0gJ0BtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6ICcgKyBkZXNrdG9wQnJlYWtwb2ludCArICdweCl7IycgKyBwYW5lbElkICsgJyAuYXJ0aWNsZVBhbmVsX19pbWFnZXtiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyArIGl0ZW0uSW1hZ2VzLkRlc2t0b3AgKyAnKSAhaW1wb3J0YW50O319JztcbiAgICAgIC8vIFBvcHVsYXRlIGxpbmtcbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX19jb250ZW50ID4gYScpLmF0dHIoe1xuICAgICAgICBocmVmOiBpdGVtLkxpbmssXG4gICAgICAgIHRpdGxlOiBpdGVtLlRpdGxlXG4gICAgICB9KTtcbiAgICAgIC8vIFBvcHVsYXRlIHRpdGxlXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fdGl0bGUnKS50ZXh0KGl0ZW0uVGl0bGUpO1xuICAgICAgLy8gUG9wdWxhdGUgZGVzY3JpcHRpb25cbiAgICAgICR0ZW1wbGF0ZS5maW5kKCcuYXJ0aWNsZVBhbmVsX19kZXNjcmlwdGlvbicpLnRleHQoaXRlbS5EZXNjcmlwdGlvbik7XG4gICAgICAvLyBQb3B1bGF0ZSBjYXRlZ29yeVxuICAgICAgJHRlbXBsYXRlLmZpbmQoJy5hcnRpY2xlUGFuZWxfX3N1YlRpdGxlIGE6Zmlyc3QtY2hpbGQnKS5hdHRyKHtcbiAgICAgICAgJ2hyZWYnOiBpdGVtLkNhdGVnb3J5LkxpbmssXG4gICAgICAgICd0aXRsZSc6IGl0ZW0uQ2F0ZWdvcnkuTmFtZVxuICAgICAgfSkudGV4dChpdGVtLkNhdGVnb3J5Lk5hbWUpO1xuICAgICAgLy8gUG9wdWxhdGUgdGltZSB0byByZWFkXG4gICAgICAkdGVtcGxhdGUuZmluZCgnLmFydGljbGVQYW5lbF9fc3ViVGl0bGUgYTpsYXN0LWNoaWxkJykuYXR0cih7XG4gICAgICAgICdocmVmJzogaXRlbS5MaW5rLFxuICAgICAgICAndGl0bGUnOiBpdGVtLlRpdGxlXG4gICAgICB9KS50ZXh0KGl0ZW0uVGltZVRvUmVhZCk7XG4gICAgICAvLyBQdXNoIGl0ZW0gdG8gb3V0cHV0XG4gICAgICBvdXRwdXQucHVzaCgkdGVtcGxhdGUpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5lZGl0U2F2ZWRBcnRpY2xlcywgdGhpcy5oYW5kbGVFZGl0KTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5kZWxldGFibGVBcnRpY2xlLCB0aGlzLmRlbGV0ZUFydGljbGUpO1xuICAgICQodGhpcy5zZWwuYXJ0aWNsZXMpLnN3aXBlZGV0ZWN0KHRoaXMuaGFuZGxlU3dpcGUpO1xuICB9XG5cbiAgaGFuZGxlRWRpdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQodGhpcy5zZWwuZWRpdFNhdmVkQXJ0aWNsZXMpLnRvZ2dsZUNsYXNzKCdoZXJvX19lZGl0U2F2ZWRBcnRpY2xlcy0tZWRpdGluZycpO1xuICAgIGlmICgkKHRoaXMuc2VsLmVkaXRTYXZlZEFydGljbGVzKS5oYXNDbGFzcygnaGVyb19fZWRpdFNhdmVkQXJ0aWNsZXMtLWVkaXRpbmcnKSkge1xuICAgICAgJCh0aGlzLnNlbC5ncmlkKS5maW5kKCcuYXJ0aWNsZVBhbmVsJykuYWRkQ2xhc3MoJ2FydGljbGVQYW5lbC0tZGVsZXRhYmxlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQodGhpcy5zZWwuZ3JpZCkuZmluZCgnLmFydGljbGVQYW5lbCcpLnJlbW92ZUNsYXNzKCdhcnRpY2xlUGFuZWwtLWRlbGV0YWJsZScpO1xuICAgIH1cbiAgfVxuXG4gIGRlbGV0ZUFydGljbGUoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgJGFydGljbGVQYW5lbCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5hcnRpY2xlUGFuZWwnKTtcbiAgICBpZiAoJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2FydGljbGVQYW5lbCcpKSAkYXJ0aWNsZVBhbmVsID0gJChlLnRhcmdldCk7XG4gICAgbGV0IHVybCA9IG5ldyBVUkwoJGFydGljbGVQYW5lbC5maW5kKCcuYXJ0aWNsZVBhbmVsX19pbWFnZScpWzBdLmhyZWYpO1xuICAgIHRoaXMuc2F2ZUZvck9mZmxpbmUuZG9VbnNhdmUodXJsLnBhdGhuYW1lKS50aGVuKCgpID0+IHtcbiAgICAgICRhcnRpY2xlUGFuZWwucGFyZW50KCkucmVtb3ZlKCk7XG4gICAgICBpZiAoJCh0aGlzLnNlbC5ncmlkKS5maW5kKCcuYXJ0aWNsZVBhbmVsJykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgJCh0aGlzLnNlbC5ncmlkKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJjb2wtMTJcIj48aDIgY2xhc3M9XCJhcnRpY2xlR3JpZF9fdGl0bGVcIj5Zb3UgaGF2ZSBubyBzYXZlZCBhcnRpY2xlczwvaDI+PC9kaXY+Jyk7XG4gICAgICAgIHRoaXMuaGFuZGxlRWRpdCh7cHJldmVudERlZmF1bHQ6ICgpID0+IHt9fSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVTd2lwZShzd2lwZWRpciwgZWxlbWVudCkge1xuICAgIC8vIHN3aXBlZGlyIGNvbnRhaW5zIGVpdGhlciBcIm5vbmVcIiwgXCJsZWZ0XCIsIFwicmlnaHRcIiwgXCJ0b3BcIiwgb3IgXCJkb3duXCJcbiAgICBsZXQgaXNEZWxldGFibGUgPSAkKGVsZW1lbnQpLmhhc0NsYXNzKCdhcnRpY2xlUGFuZWwtLWRlbGV0YWJsZScpO1xuICAgIGlmIChzd2lwZWRpciA9PT0gJ2xlZnQnICYmICFpc0RlbGV0YWJsZSkge1xuICAgICAgJCgnLmFydGljbGVQYW5lbC5hcnRpY2xlUGFuZWwtLWRlbGV0YWJsZScpLnJlbW92ZUNsYXNzKCdhcnRpY2xlUGFuZWwtLWRlbGV0YWJsZScpO1xuICAgICAgJChlbGVtZW50KS5hZGRDbGFzcygnYXJ0aWNsZVBhbmVsLS1kZWxldGFibGUnKTtcbiAgICB9IGVsc2UgaWYgKHN3aXBlZGlyID09PSAncmlnaHQnICYmIGlzRGVsZXRhYmxlKSB7XG4gICAgICAkKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdhcnRpY2xlUGFuZWwtLWRlbGV0YWJsZScpO1xuICAgIH1cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMubG9hZEFydGljbGVzKCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5jbGFzcyBPZmZsaW5lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zYXZlRm9yT2ZmbGluZSA9IG5ldyBTYXZlRm9yT2ZmbGluZSgpO1xuICAgIHRoaXMub2ZmbGluZUFydGljbGVzID0gbmV3IE9mZmxpbmVBcnRpY2xlcygpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2hlY2tTdGF0dXMgPSB0aGlzLmNoZWNrU3RhdHVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5kb09ubGluZSA9IHRoaXMuZG9PbmxpbmUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRvT2ZmbGluZSA9IHRoaXMuZG9PZmZsaW5lLmJpbmQodGhpcyk7XG4gIH1cblxuICBjaGVja1N0YXR1cygpIHtcbiAgICBpZiAobmF2aWdhdG9yLm9uTGluZSkge1xuICAgICAgdGhpcy5kb09ubGluZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvT2ZmbGluZSgpO1xuICAgIH1cbiAgfVxuXG4gIGRvT25saW5lKCkge1xuICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnb2ZmbGluZScpO1xuICAgICQoJy5kaXNhYmxlLW9mZmxpbmVbdGFiaW5kZXg9XCItMVwiXSwgLmRpc2FibGUtb2ZmbGluZSAqW3RhYmluZGV4PVwiLTFcIl0nKS5yZW1vdmVBdHRyKCd0YWJpbmRleCcpO1xuICB9XG5cbiAgZG9PZmZsaW5lKCkge1xuICAgICQoJ2JvZHknKS5hZGRDbGFzcygnb2ZmbGluZScpO1xuICAgICQoJy5kaXNhYmxlLW9mZmxpbmUsIC5kaXNhYmxlLW9mZmxpbmUgKicpLmF0dHIoJ3RhYmluZGV4JywgJy0xJyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvbmxpbmUnLCB0aGlzLmRvT25saW5lKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsIHRoaXMuZG9PZmZsaW5lKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCEoJ29uTGluZScgaW4gbmF2aWdhdG9yKSkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuc2F2ZUZvck9mZmxpbmUuaW5pdCgpO1xuICAgIHRoaXMub2ZmbGluZUFydGljbGVzLmluaXQoKTtcbiAgICB0aGlzLmNoZWNrU3RhdHVzKCk7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IE9mZmxpbmUoKTtcbiIsImNsYXNzIFBhc3N3b3JkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuZm9ybXNfX3Bhc3N3b3JkJyxcbiAgICAgIHRvZ2dsZTogJy5mb3Jtc19fcGFzc3dvcmQgaW5wdXRbdHlwZT1jaGVja2JveF0nXG4gICAgfTtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMudG9nZ2xlUGxhaW5UZXh0ID0gdGhpcy50b2dnbGVQbGFpblRleHQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgdGhpcy5zZWwudG9nZ2xlLCAoZSkgPT4ge1xuICAgICAgY29uc3QgcGFzc3dvcmRUYXJnZXQgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLWZpZWxkLWlkJyk7XG4gICAgICB0aGlzLnRvZ2dsZVBsYWluVGV4dChwYXNzd29yZFRhcmdldCk7XG4gICAgfSk7XG4gIH1cblxuICB0b2dnbGVQbGFpblRleHQoZmllbGRJZCkge1xuICAgIGNvbnN0IGZpZWxkID0gJCgnIycgKyBmaWVsZElkKTtcbiAgICBzd2l0Y2ggKGZpZWxkLmF0dHIoJ3R5cGUnKSkge1xuICAgIGNhc2UgJ3Bhc3N3b3JkJzpcbiAgICAgIGZpZWxkLmF0dHIoJ3R5cGUnLCAndGV4dCcpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgIGNhc2UgJ3RleHQnOlxuICAgICAgZmllbGQuYXR0cigndHlwZScsICdwYXNzd29yZCcpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBQYXNzd29yZCgpO1xuIiwiY2xhc3MgUGFzc3dvcmRSZW1pbmRlckZvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIHVybFRva2VuOiAnL2xpYnMvZ3Jhbml0ZS9jc3JmL3Rva2VuLmpzb24nLFxuICAgICAgdXJsTG9naW46ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvbG9naW4vaW5kZXguanNvbicsXG4gICAgICB1cmxSZXF1ZXN0OiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL3JlcXVlc3RfcGFzc3dvcmQvaW5kZXguanNvbicsXG4gICAgICB1cmxSZXNldDogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZXNldF9wYXNzd29yZC9pbmRleC5qc29uJ1xuICAgIH07XG5cbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5yZXNldC1wYXNzd29yZC1jb250YWluZXInXG4gICAgfTtcblxuICAgIHRoaXMuZ2V0UGF0aFByZWZpeCA9IHRoaXMuZ2V0UGF0aFByZWZpeC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0UGF0aEhvbWUgPSB0aGlzLmdldFBhdGhIb21lLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jcmVhdGVDb29raWUgPSB0aGlzLmNyZWF0ZUNvb2tpZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5yZXF1ZXN0VG9rZW4gPSB0aGlzLnJlcXVlc3RUb2tlbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVzZXRQYXNzd29yZCA9IHRoaXMucmVzZXRQYXNzd29yZC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0UGF0aFByZWZpeCgpIHtcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xuICB9XG5cbiAgZ2V0UGF0aEhvbWUoKSB7XG4gICAgY29uc3QgaG9tZSA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLWhvbWVcXCddJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiAoaG9tZSA/IGhvbWUgOiAnJyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ3Bhc3N3b3JkJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cCgkKGVsZW1lbnQpLmF0dHIoJ3BhdHRlcm4nKSkudGVzdCh2YWx1ZSk7XG4gICAgfSwgJ1Bhc3N3b3JkIGZvcm1hdCBpcyBub3QgdmFsaWQnKTtcblxuICAgIGpRdWVyeS52YWxpZGF0b3IuYWRkTWV0aG9kKCdlcXVhbFRvJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XG4gICAgICByZXR1cm4gKCQoJyMnICsgJChlbGVtZW50KS5hdHRyKCdkYXRhLWVxdWFsVG8nKSkudmFsKCkgPT09ICQoZWxlbWVudCkudmFsKCkpO1xuICAgIH0sICdQYXNzd29yZHMgZG8gbm90IG1hdGNoJyk7XG5cbiAgICB2YXIgcmVtaW5kZXJQYWdlID0gJCh0aGlzLnNlbC5jb21wb25lbnQpO1xuICAgIGlmIChyZW1pbmRlclBhZ2UubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gcmVtaW5kZXJQYWdlLmRhdGEoJ3VzZXJuYW1lJyk7XG4gICAgICB2YXIgdG9rZW4gPSByZW1pbmRlclBhZ2UuZGF0YSgndG9rZW4nKTtcblxuICAgICAgaWYgKCh1c2VybmFtZSAhPT0gbnVsbCAmJiB0eXBlb2YgKHVzZXJuYW1lKSAhPT0gJ3VuZGVmaW5lZCcgJiYgdXNlcm5hbWUubGVuZ3RoID4gMCkgJiYgKHRva2VuICE9PSBudWxsICYmIHR5cGVvZiAodG9rZW4pICE9PSAndW5kZWZpbmVkJyAmJiB0b2tlbi5sZW5ndGggPiAwKSkge1xuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMycpLnNob3coKTtcbiAgICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTEnKS5oaWRlKCk7XG4gICAgICAgIHJlbWluZGVyUGFnZS5maW5kKCcuc3RlcC0yJykuaGlkZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTEnKS5zaG93KCk7XG4gICAgICAgIHJlbWluZGVyUGFnZS5maW5kKCcuc3RlcC0yJykuaGlkZSgpO1xuICAgICAgICByZW1pbmRlclBhZ2UuZmluZCgnLnN0ZXAtMycpLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgcmVtaW5kZXJQYWdlLmZpbmQoJy5zdGVwLTEgZm9ybScpLnZhbGlkYXRlKHtcbiAgICAgICAgcnVsZXM6IHtcbiAgICAgICAgICByZXNldFBhc3N3b3JkX19lbWFpbDogJ2VtYWlsJ1xuICAgICAgICB9LFxuICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkuYXBwZW5kKGVycm9yKTtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybSkgPT4ge1xuICAgICAgICAgIHRoaXMucmVxdWVzdFRva2VuKGZvcm0pO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJlbWluZGVyUGFnZS5maW5kKCcuc3RlcC0zIGZvcm0nKS52YWxpZGF0ZSh7XG4gICAgICAgIHJ1bGVzOiB7XG4gICAgICAgICAgcmVzZXRfX2NyZWF0ZVBhc3N3b3JkOiAncGFzc3dvcmQnLFxuICAgICAgICAgIHJlc2V0X19jb25maXJtUGFzc3dvcmQ6ICdlcXVhbFRvJ1xuICAgICAgICB9LFxuICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkuYXBwZW5kKGVycm9yKTtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybSkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzZXRQYXNzd29yZChmb3JtKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUNvb2tpZShuYW1lLCB2YWx1ZSwgZXhwaXJ5U2Vjb25kcykge1xuICAgIHZhciBleHBpcmVzID0gJyc7XG4gICAgaWYgKGV4cGlyeVNlY29uZHMpIHtcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChleHBpcnlTZWNvbmRzICogMTAwMCkpO1xuICAgICAgZXhwaXJlcyA9ICc7IGV4cGlyZXM9JyArIGRhdGUudG9VVENTdHJpbmcoKTtcbiAgICB9XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArICc9JyArIHZhbHVlICsgZXhwaXJlcyArICc7IHBhdGg9Lyc7XG4gIH1cblxuICByZXF1ZXN0VG9rZW4oZm9ybSkge1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgdXNlcm5hbWU6ICQoZm9ybSkuZmluZCgnaW5wdXQjcmVzZXRQYXNzd29yZF9fZW1haWwnKS52YWwoKSxcbiAgICAgIHBhZ2U6IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgfTtcblxuICAgICQoZm9ybSkuZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xuICAgICQoZm9ybSkuZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xuICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XG4gICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxSZXF1ZXN0LFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcuc3RlcC0xJykuaGlkZSgpO1xuICAgICAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnLnN0ZXAtMicpLnNob3coKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHJlcXVlc3QgYSBwYXNzd29yZCByZXNldC5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHJlcXVlc3QgYSBwYXNzd29yZCByZXNldC4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkKGZvcm0pLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgnR2V0IG5ldyBwYXNzd29yZCcpO1xuICAgICAgICAgICQoZm9ybSkuZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdHZXQgbmV3IHBhc3N3b3JkJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmVzZXRQYXNzd29yZChmb3JtKSB7XG4gICAgdmFyIHVzZXJuYW1lID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmRhdGEoJ3VzZXJuYW1lJyk7XG4gICAgdmFyIHRva2VuID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmRhdGEoJ3Rva2VuJyk7XG4gICAgdmFyIHBhc3N3b3JkID0gJChmb3JtKS5maW5kKCdpbnB1dCNyZXNldF9fY3JlYXRlUGFzc3dvcmQnKS52YWwoKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgIHRva2VuOiB0b2tlbixcbiAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgIH07XG5cbiAgICAkKGZvcm0pLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J11cIikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcbiAgICAkKGZvcm0pLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcbiAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xuICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XG4gICAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsUmVzZXQsXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKG5leHRUb2tlblJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRjc3JmdG9rZW4gPSBuZXh0VG9rZW5SZXNwb25zZS50b2tlbjtcblxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsTG9naW4sXG4gICAgICAgICAgICAgICAgICBkYXRhOiB7IHVzZXJuYW1lOiB1c2VybmFtZSwgcGFzc3dvcmQ6IHBhc3N3b3JkIH0sXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogbmV4dGNzcmZ0b2tlbiB9LFxuICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChsb2dpblJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2dpblJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ2luUmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgbG9naW5SZXNwb25zZSwgdHJ1ZSBdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJhY2tVcmwgPSAkKGZvcm0pLmRhdGEoJ2JhY2snKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkLnRyaW0oYmFja1VybCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tVcmwgPSB0aGlzLmdldFBhdGhIb21lKCkgKyAnLmh0bWwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gYmFja1VybDtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gbG9naW4gdXNpbmcgeW91ciB1cGRhdGVkIGNyZWRlbnRpYWxzLlxcbicgKyByZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gbG9naW4gdXNpbmcgeW91ciB1cGRhdGVkIGNyZWRlbnRpYWxzLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJChmb3JtKS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ1N1Ym1pdCcpO1xuICAgICAgICAgICAgICAgICAgICAkKGZvcm0pLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgnU3VibWl0Jyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LlxcbicgKyByZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0LiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgUGFzc3dvcmRSZW1pbmRlckZvcm0oKTtcbiIsImNsYXNzIFBhc3N3b3JkVmFsaWRpdHlBcGkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNoZWNrQ2FzaW5nID0gdGhpcy5jaGVja0Nhc2luZy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2hlY2tTcGVjaWFsID0gdGhpcy5jaGVja1NwZWNpYWwuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNoZWNrTnVtYmVyID0gdGhpcy5jaGVja051bWJlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2hlY2tMZW5ndGggPSB0aGlzLmNoZWNrTGVuZ3RoLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pc1ZhbGlkID0gdGhpcy5pc1ZhbGlkLmJpbmQodGhpcyk7XG4gIH1cblxuICBpc1ZhbGlkKHBhc3N3b3JkKSB7XG4gICAgY29uc3QgaXNMZW5ndGhWYWxpZCA9IHRoaXMuY2hlY2tMZW5ndGgocGFzc3dvcmQpO1xuICAgIGNvbnN0IGlzQ2FzaW5nVmFsaWQgPSB0aGlzLmNoZWNrQ2FzaW5nKHBhc3N3b3JkKTtcbiAgICBjb25zdCBpc1NwZWljYWxWYWxpZCA9IHRoaXMuY2hlY2tTcGVjaWFsKHBhc3N3b3JkKTtcbiAgICBjb25zdCBpc051bWJlclZhbGlkID0gdGhpcy5jaGVja051bWJlcihwYXNzd29yZCk7XG5cbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICBpc1ZhbGlkOiBpc0xlbmd0aFZhbGlkICYmIGlzQ2FzaW5nVmFsaWQgJiYgaXNTcGVpY2FsVmFsaWQgJiYgaXNOdW1iZXJWYWxpZCxcbiAgICAgIGlzTGVuZ3RoVmFsaWQsXG4gICAgICBpc0Nhc2luZ1ZhbGlkLFxuICAgICAgaXNTcGVpY2FsVmFsaWQsXG4gICAgICBpc051bWJlclZhbGlkXG4gICAgfTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBjaGVja0xlbmd0aChwYXNzd29yZCkge1xuICAgIHJldHVybiBwYXNzd29yZC5sZW5ndGggPj0gODtcbiAgfVxuXG4gIGNoZWNrQ2FzaW5nKHBhc3N3b3JkKSB7XG4gICAgcmV0dXJuIC9eKD89LipbYS16XSkuKyQvLnRlc3QocGFzc3dvcmQpICYmIC9eKD89LipbQS1aXSkuKyQvLnRlc3QocGFzc3dvcmQpO1xuICB9XG5cbiAgY2hlY2tOdW1iZXIocGFzc3dvcmQpIHtcbiAgICByZXR1cm4gL14oPz0uKlswLTldKS4rJC8udGVzdChwYXNzd29yZCk7XG4gIH1cblxuICBjaGVja1NwZWNpYWwocGFzc3dvcmQpIHtcbiAgICByZXR1cm4gL14oPz0uKlshwqMlJiooKT17fUAjPjxdKS4rJC8udGVzdChwYXNzd29yZCk7XG4gIH1cbn1cblxuXG4vLyBJJ3ZlIGFzc3VtZWQgdGhlcmUgd2lsbCBvbmx5IGJlIG9uZSBwYXNzd29yZCB2YWxpZGl0eSBjaGVja2VyIG9uIGEgcGFnZSBhdCBvbmNlLCBiZWNhdXNlOlxuLy8gLSB0aGUgdmFsaWRpdHkgY2hlY2tlciB3b3VsZCBvbmx5IGJlIG9uIHRoZSBtYWluIHBhc3N3b3JkIGVudHJ5IGZpZWxkIGFuZCBub3QgdGhlIGNvbmZpcm1hdGlvblxuLy8gLSBhIHVzZXIgd291bGRuJ3QgYmUgc2V0dGluZyBtb3JlIHRoYW4gb25lIHBhc3N3b3JkIGF0IG9uY2VcbmNsYXNzIFBhc3N3b3JkVmFsaWRpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy52YWxpZGl0eS1jaGVja3MnXG4gICAgfTtcblxuICAgIHRoaXMucGFzc3dvcmRBcGkgPSBuZXcgUGFzc3dvcmRWYWxpZGl0eUFwaSgpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IHBhc3N3b3JkRmllbGRJZCA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5hdHRyKCdkYXRhLWZpZWxkLWlkJyk7XG4gICAgY29uc3QgcGFzc3dvcmRGaWVsZCA9ICQoJyMnICsgcGFzc3dvcmRGaWVsZElkKTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdrZXl1cCBrZXlwcmVzcyBjaGFuZ2UnLCAnIycgKyBwYXNzd29yZEZpZWxkSWQsICgpID0+IHtcbiAgICAgIGxldCBwYXNzd29yZCA9IHBhc3N3b3JkRmllbGQudmFsKCk7XG4gICAgICB0aGlzLmNoZWNrUGFzc3dvcmRWYWxpZGl0eShwYXNzd29yZCk7XG4gICAgfSk7XG4gIH1cblxuICBpc1Bhc3N3b3JkVmFsaWQocGFzc3dvcmQpIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5wYXNzd29yZEFwaS5pc1ZhbGlkKHBhc3N3b3JkKTtcbiAgICByZXR1cm4gcmVzdWx0LmlzVmFsaWQ7XG4gIH1cblxuICBjaGVja1Bhc3N3b3JkVmFsaWRpdHkocGFzc3dvcmQpIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5wYXNzd29yZEFwaS5pc1ZhbGlkKHBhc3N3b3JkKTtcblxuICAgIGlmIChyZXN1bHQuaXNMZW5ndGhWYWxpZCkge1xuICAgICAgJCgnW2RhdGEtY2hlY2s9bGVuZ3RoXScpLmFkZENsYXNzKCdpcy12YWxpZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCdbZGF0YS1jaGVjaz1sZW5ndGhdJykucmVtb3ZlQ2xhc3MoJ2lzLXZhbGlkJyk7XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdC5pc0Nhc2luZ1ZhbGlkKSB7XG4gICAgICAkKCdbZGF0YS1jaGVjaz1jYXNpbmddJykuYWRkQ2xhc3MoJ2lzLXZhbGlkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJ1tkYXRhLWNoZWNrPWNhc2luZ10nKS5yZW1vdmVDbGFzcygnaXMtdmFsaWQnKTtcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0LmlzU3BlaWNhbFZhbGlkKSB7XG4gICAgICAkKCdbZGF0YS1jaGVjaz1zcGVjaWFsXScpLmFkZENsYXNzKCdpcy12YWxpZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCdbZGF0YS1jaGVjaz1zcGVjaWFsXScpLnJlbW92ZUNsYXNzKCdpcy12YWxpZCcpO1xuICAgIH1cblxuICAgIGlmIChyZXN1bHQuaXNOdW1iZXJWYWxpZCkge1xuICAgICAgJCgnW2RhdGEtY2hlY2s9bnVtYmVyXScpLmFkZENsYXNzKCdpcy12YWxpZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCdbZGF0YS1jaGVjaz1udW1iZXJdJykucmVtb3ZlQ2xhc3MoJ2lzLXZhbGlkJyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBQYXNzd29yZFZhbGlkaXR5KCk7XG4iLCJjbGFzcyBSZWdpc3RlckZvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIGZiQXBwSWQ6ICcxMDgwMDMxMzI4ODAxMjExJyxcbiAgICAgIGdvQ2xpZW50SWQ6ICczMTM0Njk4Mzc0MjAtbDg4MmgzOWdlOG44bjlwYjk3bGR2amszZm04cHBxZ3MuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nLFxuXG4gICAgICB1cmxUb2tlbjogJy9saWJzL2dyYW5pdGUvY3NyZi90b2tlbi5qc29uJyxcbiAgICAgIHVybFJlZnJlc2hDaGVjazogJy9hcHBzL2RobC9kaXNjb3ZlcmRobGFwaS9yZWZyZXNoX3Rva2VuL2luZGV4Lmpzb24nLFxuICAgICAgdXJsUmVnaXN0ZXI6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVnaXN0ZXIvaW5kZXguanNvbicsXG4gICAgICB1cmxVcGRhdGVDYXRlZ29yaWVzOiAnL2FwcHMvZGhsL2Rpc2NvdmVyZGhsYXBpL3VwZGF0ZV9jYXRlZ29yaWVzL2luZGV4Lmpzb24nXG4gICAgfTtcblxuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLnBhZ2UtYm9keS5yZWdpc3RlciwgI2Rvd25sb2FkLCAuZ2F0ZWQnLFxuICAgICAgYnV0dG9uRmFjZWJvb2s6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmZiJyxcbiAgICAgIGJ1dHRvbkxpbmtlZGluOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5saScsXG4gICAgICBidXR0b25Hb29nbGVQbHVzOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5nbydcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRQYXRoSG9tZSA9IHRoaXMuZ2V0UGF0aEhvbWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmxvZ2dlZEluID0gdGhpcy5sb2dnZWRJbi5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy50cnlSZWdpc3RlckZhY2Vib29rID0gdGhpcy50cnlSZWdpc3RlckZhY2Vib29rLmJpbmQodGhpcyk7XG4gICAgdGhpcy50cnlSZWdpc3RlckxpbmtlZGluID0gdGhpcy50cnlSZWdpc3RlckxpbmtlZGluLmJpbmQodGhpcyk7XG4gICAgdGhpcy50cnlSZWdpc3Rlckdvb2dsZSA9IHRoaXMudHJ5UmVnaXN0ZXJHb29nbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRyeVJlZ2lzdGVyID0gdGhpcy50cnlSZWdpc3Rlci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5leGVjdXRlUmVnaXN0ZXIgPSB0aGlzLmV4ZWN1dGVSZWdpc3Rlci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0UGF0aFByZWZpeCgpIHtcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xuICB9XG5cbiAgZ2V0UGF0aEhvbWUoKSB7XG4gICAgY29uc3QgaG9tZSA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLWhvbWVcXCddJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiAoaG9tZSA/IGhvbWUgOiAnJyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlYWRDb29raWUobmFtZSkge1xuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xuICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjID0gY2FbaV07XG4gICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcbiAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJCh3aW5kb3cpLm9uKCd1c2VybG9nZ2VkaW4uREhMJywgKCkgPT4ge1xuICAgICAgdGhpcy5sb2dnZWRJbigpO1xuICAgIH0pO1xuXG4gICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ3Bhc3N3b3JkJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XG4gICAgICBpZiAoJC50cmltKHZhbHVlKS5sZW5ndGggPT09IDApIHJldHVybiB0cnVlO1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJChlbGVtZW50KS5hdHRyKCdwYXR0ZXJuJykpLnRlc3QodmFsdWUpO1xuICAgIH0sICdQYXNzd29yZCBmb3JtYXQgaXMgbm90IHZhbGlkJyk7XG5cbiAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnZXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xuICAgICAgcmV0dXJuICgkKCcjJyArICQoZWxlbWVudCkuYXR0cignZGF0YS1lcXVhbFRvJykpLnZhbCgpID09PSAkKGVsZW1lbnQpLnZhbCgpKTtcbiAgICB9LCAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCcpO1xuXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkZhY2Vib29rKS5sZW5ndGggPiAwKSB7XG4gICAgICB3aW5kb3cuZmJBc3luY0luaXQgPSAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5mYl9pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mICh3aW5kb3cuRkIpICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuRkIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHdpbmRvdy5GQi5pbml0KHtcbiAgICAgICAgICAgICAgYXBwSWQ6IHRoaXMuY29uZmlnLmZiQXBwSWQsXG4gICAgICAgICAgICAgIGNvb2tpZTogdHJ1ZSxcbiAgICAgICAgICAgICAgeGZibWw6IHRydWUsXG4gICAgICAgICAgICAgIHZlcnNpb246ICd2Mi44J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmZiX2ludGVydmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhY2Vib29rLWpzc2RrJykgPT09IG51bGwpIHtcbiAgICAgICAgdmFyIGZqcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICAgICAgdmFyIGpzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgIGpzLmlkID0gJ2ZhY2Vib29rLWpzc2RrJztcbiAgICAgICAganMuc3JjID0gJy8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fRU4vc2RrLmpzJztcbiAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xuICAgICAgfVxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLm9uKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgdGhpcy50cnlSZWdpc3RlckZhY2Vib29rKGV2dCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikubGVuZ3RoID4gMCkge1xuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLm9uKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgdGhpcy50cnlSZWdpc3RlckxpbmtlZGluKGV2dCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBnb29nbGVCdXR0b24gPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKTtcbiAgICBpZiAoZ29vZ2xlQnV0dG9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHdpbmRvdy5nb19pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LmdhcGkpICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZ2FwaSAhPT0gbnVsbCkge1xuICAgICAgICAgIHdpbmRvdy5nYXBpLmxvYWQoJ2F1dGgyJywgKCkgPT4ge1xuICAgICAgICAgICAgdmFyIGF1dGgyID0gd2luZG93LmdhcGkuYXV0aDIuaW5pdCh7XG4gICAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jb25maWcuZ29DbGllbnRJZCxcbiAgICAgICAgICAgICAgY29va2llcG9saWN5OiAnc2luZ2xlX2hvc3Rfb3JpZ2luJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZ29vZ2xlQnV0dG9uLmdldCgwKTtcbiAgICAgICAgICAgIGF1dGgyLmF0dGFjaENsaWNrSGFuZGxlcihlbGVtZW50LCB7fSxcbiAgICAgICAgICAgICAgKGdvb2dsZVVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyeVJlZ2lzdGVyR29vZ2xlKGdvb2dsZVVzZXIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3IgIT09ICdwb3B1cF9jbG9zZWRfYnlfdXNlcicpIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KHJlc3VsdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZ29faW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgICB9LCAxMDApO1xuXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnI2dsYi1yZWdpc3Rlci1zdGFydCBmb3JtI3JlZ2lzdGVyLWRldGFpbC1mb3JtJykudmFsaWRhdGUoe1xuICAgICAgcnVsZXM6IHtcbiAgICAgICAgcmVnaXN0ZXJfX2VtYWlsOiAnZW1haWwnLFxuICAgICAgICByZWdpc3Rlcl9fcGFzc3dvcmQxOiAncGFzc3dvcmQnXG4gICAgICB9LFxuICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAncGFzc3dvcmQnKSB7XG4gICAgICAgICAgJChlbGVtZW50KS5hcHBlbmQoZXJyb3IpO1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnc2VhcmNoJykge1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VibWl0SGFuZGxlcjogKGZvcm0pID0+IHtcbiAgICAgICAgdGhpcy50cnlSZWdpc3Rlcihmb3JtKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQoJyNnbGItcmVnaXN0ZXItY2F0ZWdvcmllcyBmb3JtIC5mb3Jtc19fY3RhLS1yZWQnKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMudHJ5Q2F0ZWdvcnlTZWxlY3Rpb24oZXZ0KTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIHRyeVJlZ2lzdGVyRmFjZWJvb2soZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcblxuICAgIHdpbmRvdy5GQi5sb2dpbigobG9naW5SZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKGxvZ2luUmVzcG9uc2UuYXV0aFJlc3BvbnNlKSB7XG4gICAgICAgIHdpbmRvdy5GQi5hcGkoJy9tZScsIChkYXRhUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGZpcnN0bmFtZTogZGF0YVJlc3BvbnNlLmZpcnN0X25hbWUsXG4gICAgICAgICAgICBsYXN0bmFtZTogZGF0YVJlc3BvbnNlLmxhc3RfbmFtZSxcbiAgICAgICAgICAgIHVzZXJuYW1lOiBkYXRhUmVzcG9uc2UuZW1haWwsXG4gICAgICAgICAgICBwYXNzd29yZDogZGF0YVJlc3BvbnNlLmlkLFxuICAgICAgICAgICAgaXNsaW5rZWRpbjogJ3RydWUnLFxuICAgICAgICAgICAgdGNhZ3JlZTogdHJ1ZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0aGlzLmV4ZWN1dGVSZWdpc3RlcihkYXRhLCAoKSA9PiB7XG4gICAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykudGV4dCgnRmFjZWJvb2snKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgeyBmaWVsZHM6IFsgJ2lkJywgJ2VtYWlsJywgJ2ZpcnN0X25hbWUnLCAnbGFzdF9uYW1lJyBdfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSwgeyBzY29wZTogJ2VtYWlsLHB1YmxpY19wcm9maWxlJywgcmV0dXJuX3Njb3BlczogdHJ1ZSB9KTtcbiAgfVxuXG4gIHRyeVJlZ2lzdGVyTGlua2VkaW4oZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikudGV4dCgncGxlYXNlIHdhaXQuLi4nKTtcblxuICAgIElOLlVzZXIuYXV0aG9yaXplKCgpID0+IHtcbiAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XG4gICAgICAgIHZhciBtZW1iZXIgPSByZXN1bHQudmFsdWVzWzBdO1xuXG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgIGZpcnN0bmFtZTogbWVtYmVyLmZpcnN0TmFtZSxcbiAgICAgICAgICBsYXN0bmFtZTogbWVtYmVyLmxhc3ROYW1lLFxuICAgICAgICAgIHVzZXJuYW1lOiBtZW1iZXIuZW1haWxBZGRyZXNzLFxuICAgICAgICAgIHBhc3N3b3JkOiBtZW1iZXIuaWQsXG4gICAgICAgICAgaXNsaW5rZWRpbjogJ3RydWUnLFxuICAgICAgICAgIHRjYWdyZWU6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmV4ZWN1dGVSZWdpc3RlcihkYXRhLCAoKSA9PiB7XG4gICAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLnRleHQoJ0xpbmtlZEluJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICB2YXIgcmVzdWx0ID0gd2luZG93LklOLlVzZXIuaXNBdXRob3JpemVkKCk7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgdmFyIG1lbWJlciA9IHJlc3VsdC52YWx1ZXNbMF07XG5cbiAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGZpcnN0bmFtZTogbWVtYmVyLmZpcnN0TmFtZSxcbiAgICAgICAgICAgIGxhc3RuYW1lOiBtZW1iZXIubGFzdE5hbWUsXG4gICAgICAgICAgICB1c2VybmFtZTogbWVtYmVyLmVtYWlsQWRkcmVzcyxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBtZW1iZXIuaWQsXG4gICAgICAgICAgICBpc2xpbmtlZGluOiAndHJ1ZScsXG4gICAgICAgICAgICB0Y2FncmVlOiB0cnVlXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRoaXMuZXhlY3V0ZVJlZ2lzdGVyKGRhdGEsICgpID0+IHtcbiAgICAgICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS50ZXh0KCdMaW5rZWRJbicpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LCAxMDAwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cnlSZWdpc3Rlckdvb2dsZShnb29nbGVVc2VyKSB7XG4gICAgdmFyIGJhc2ljUHJvZmlsZSA9IGdvb2dsZVVzZXIuZ2V0QmFzaWNQcm9maWxlKCk7XG5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIGZpcnN0bmFtZTogYmFzaWNQcm9maWxlLmdldEdpdmVuTmFtZSgpLFxuICAgICAgbGFzdG5hbWU6IGJhc2ljUHJvZmlsZS5nZXRGYW1pbHlOYW1lKCksXG4gICAgICB1c2VybmFtZTogYmFzaWNQcm9maWxlLmdldEVtYWlsKCksXG4gICAgICBwYXNzd29yZDogYmFzaWNQcm9maWxlLmdldElkKCksXG4gICAgICBpc2xpbmtlZGluOiAndHJ1ZScsXG4gICAgICB0Y2FncmVlOiB0cnVlXG4gICAgfTtcblxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgdGhpcy5leGVjdXRlUmVnaXN0ZXIoZGF0YSwgKCkgPT4ge1xuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cykudGV4dCgnR29vZ2xlKycpO1xuICAgIH0pO1xuICB9XG5cbiAgdHJ5UmVnaXN0ZXIoZm9ybSkge1xuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgZmlyc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2ZpcnN0bmFtZScpLnZhbCgpLFxuICAgICAgbGFzdG5hbWU6IGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fbGFzdG5hbWUnKS52YWwoKSxcbiAgICAgIHVzZXJuYW1lOiBmcm0uZmluZCgnaW5wdXQjcmVnaXN0ZXJfX2VtYWlsJykudmFsKCksXG4gICAgICBwYXNzd29yZDogZnJtLmZpbmQoJ2lucHV0I3JlZ2lzdGVyX19wYXNzd29yZDEnKS52YWwoKSxcblxuICAgICAgaXNsaW5rZWRpbjogJ2ZhbHNlJyxcbiAgICAgIHRjYWdyZWU6IGZybS5maW5kKCdpbnB1dCNjaGVja2JveElkJykuaXMoJzpjaGVja2VkJylcbiAgICB9O1xuXG4gICAgaWYgKCgkLnRyaW0oZGF0YS5maXJzdG5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShkYXRhLmxhc3RuYW1lKS5sZW5ndGggPT09IDApIHx8ICgkLnRyaW0oZGF0YS51c2VybmFtZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgYWxlcnQoJ1BsZWFzZSBlbnRlciB5b3VyIG5hbWUgYW5kIGVtYWlsIGFkZHJlc3MuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ3BsZWFzZSB3YWl0Li4uJyk7XG4gICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdwbGVhc2Ugd2FpdC4uLicpO1xuXG4gICAgICB0aGlzLmV4ZWN1dGVSZWdpc3RlcihkYXRhLCAoKSA9PiB7XG4gICAgICAgIGZybS5maW5kKFwiYnV0dG9uW3R5cGU9J3N1Ym1pdCddXCIpLnRleHQoJ1N1Ym1pdCcpO1xuICAgICAgICBmcm0uZmluZCgnaW5wdXQuZm9ybXNfX2N0YS0tcmVkJykudmFsKCdTdWJtaXQnKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGV4ZWN1dGVSZWdpc3RlcihkYXRhLCB1bndhaXRDYWxsYmFjaykge1xuICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XG4gICAgICB2YXIgY3NyZnRva2VuID0gdG9rZW5yZXNwb25zZS50b2tlbjtcblxuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFJlZ2lzdGVyLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgc3VjY2VzczogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgZnJtID0gJCgnLnBhZ2UtYm9keS5yZWdpc3RlciwgI2Rvd25sb2FkLCAuZ2F0ZWQnKS5maW5kKCdmb3JtJyk7XG5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2NoZWNrYXV0aHRva2Vucy5ESEwnLCBbIHJlc3BvbnNlLCB0cnVlIF0pO1xuXG4gICAgICAgICAgICAgIHdpbmRvdy5kYXRhTGF5ZXIgPSB3aW5kb3cuZGF0YUxheWVyIHx8IFtdO1xuICAgICAgICAgICAgICB3aW5kb3cuZGF0YUxheWVyLnB1c2goe1xuICAgICAgICAgICAgICAgICdldmVudCc6ICdyZWdpc3RyYXRpb25Db21wbGV0ZSdcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgaWYgKChmcm0uY2xvc2VzdCgnI2Rvd25sb2FkJykubGVuZ3RoID4gMCkgfHwgKGZybS5jbG9zZXN0KCcuZ2F0ZWQnKS5sZW5ndGggPiAwKSkge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBtb2RhbCA9ICQoJy5yZWdpc3Rlci5iZWxvdy1yZWdpc3Rlci1mb3JtJykuZmluZCgnLm1vZGFsJyk7XG4gICAgICAgICAgICAgIHZhciBjYXRlZ29yeVNlbGVjdGlvbiA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcjZ2xiLXJlZ2lzdGVyLWNhdGVnb3JpZXMnKTtcbiAgICAgICAgICAgICAgaWYgKG1vZGFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCcudGhhbmtzLW5hbWUnKS50ZXh0KGRhdGEuZmlyc3RuYW1lKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCdidXR0b24nKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB2YXIgYmFja1VybCA9IGZybS5kYXRhKCdiYWNrJyk7XG4gICAgICAgICAgICAgICAgICBpZiAoJC50cmltKGJhY2tVcmwpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGJhY2tVcmw7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBtb2RhbC5tb2RhbCgnc2hvdycpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNhdGVnb3J5U2VsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCgnI2dsYi1yZWdpc3Rlci1zdGFydCcpLmhpZGUoKTtcblxuICAgICAgICAgICAgICAgIGNhdGVnb3J5U2VsZWN0aW9uLmZpbmQoJy5mb3Jtc19fdGl0bGUnKS50ZXh0KCdUaGFua3MgJyArIHJlc3BvbnNlLm5hbWUpO1xuICAgICAgICAgICAgICAgIGNhdGVnb3J5U2VsZWN0aW9uLnNob3coKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS5lcnJvci5pbmNsdWRlcygnRW1haWwgYWRkcmVzcyBhbHJlYWR5IGV4aXN0cycpKSB7XG4gICAgICAgICAgICAgICQoJzxsYWJlbCBpZD1cInJlZ2lzdGVyX19lbWFpbC1lcnJvclwiIGNsYXNzPVwiZXJyb3JcIiBmb3I9XCJyZWdpc3Rlcl9fZW1haWxcIj5UaGlzIGVtYWlsIGFkZHJlc3MgYWxyZWFkeSBleGlzdHM8L2xhYmVsPicpLmluc2VydEFmdGVyKGZybS5maW5kKCdpbnB1dCNyZWdpc3Rlcl9fZW1haWwnKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byByZWdpc3Rlci5cXG4nICsgcmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHJlZ2lzdGVyLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB1bndhaXRDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHRyeUNhdGVnb3J5U2VsZWN0aW9uKCkge1xuICAgIHZhciBjYXRlZ29yaWVzID0gJyc7XG4gICAgdmFyIGNvbnRhaW5lciA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCcjZ2xiLXJlZ2lzdGVyLWNhdGVnb3JpZXMgZm9ybScpO1xuICAgIGNvbnRhaW5lci5maW5kKCdpbnB1dDpjaGVja2VkJykuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgIGlmIChjYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2F0ZWdvcmllcyArPSAnLCc7XG4gICAgICB9XG4gICAgICBjYXRlZ29yaWVzICs9ICQoaXRlbSkudmFsKCk7XG4gICAgfSk7XG5cbiAgICBpZiAoY2F0ZWdvcmllcy5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgY29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuQXV0aFRva2VuJyk7XG4gICAgICBpZiAoY29va2llICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGNvb2tpZS5zcGxpdCgnfCcpO1xuICAgICAgICBpZiAoc3BsaXQubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFRva2VuLCAodG9rZW5yZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICB1cmw6IHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVXBkYXRlQ2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogc3BsaXRbMF0sIHRva2VuOiBzcGxpdFsxXSwgY2F0czogY2F0ZWdvcmllcyB9LFxuICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgc3VjY2VzczogKHVwZGF0ZUNhdGVnb3JpZXNSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh1cGRhdGVDYXRlZ29yaWVzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGVDYXRlZ29yaWVzUmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyB1cGRhdGVDYXRlZ29yaWVzUmVzcG9uc2UsIHRydWUgXSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMuZ2V0UGF0aEhvbWUoKSArICcuaHRtbCc7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDEpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoMikuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoMykuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlZnJlc2hDb29raWUgPSB0aGlzLnJlYWRDb29raWUoJ0RITC5SZWZyZXNoVG9rZW4nKTtcbiAgICAgICAgaWYgKHJlZnJlc2hDb29raWUgIT09IG51bGwpIHtcbiAgICAgICAgICB2YXIgcmVmcmVzaFNwbGl0ID0gcmVmcmVzaENvb2tpZS5zcGxpdCgnfCcpO1xuICAgICAgICAgIGlmIChyZWZyZXNoU3BsaXQubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xuICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxSZWZyZXNoQ2hlY2ssXG4gICAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogcmVmcmVzaFNwbGl0WzBdLCByZWZyZXNoX3Rva2VuOiByZWZyZXNoU3BsaXRbMV0gfSxcbiAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogKHJlZnJlc2hSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGVja2F1dGh0b2tlbnMuREhMJywgWyByZWZyZXNoUmVzcG9uc2UsIHRydWUgXSk7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy50cnlDYXRlZ29yeVNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoNCkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICg1KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICg2KS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGVudGVyIHRoZSBjb21wZXRpdGlvbi4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbG9nZ2VkSW4oKSB7XG4gICAgaWYgKCQoJy5wYWdlLWJvZHkucmVnaXN0ZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24gPSAnL2NvbnRlbnQvZGhsL3lvdXItYWNjb3VudC5odG1sJztcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFJlZ2lzdGVyRm9ybSgpO1xuIiwiY2xhc3MgU2VhcmNoRm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLnNlYXJjaC1mb3JtJyxcbiAgICAgIGNsZWFyQnV0dG9uOiAnLnNlYXJjaC1mb3JtX19jbGVhci1pY29uJyxcbiAgICAgIGlucHV0OiAnLnNlYXJjaC1mb3JtX19zZWFyY2ggaW5wdXRbdHlwZT1zZWFyY2hdJ1xuICAgIH07XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsZWFyU2VhcmNoRm9ybSA9IHRoaXMuY2xlYXJTZWFyY2hGb3JtLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuY2xlYXJCdXR0b24sICgpID0+IHtcbiAgICAgIHRoaXMuY2xlYXJTZWFyY2hGb3JtKCk7XG4gICAgfSk7XG4gIH1cblxuICBjbGVhclNlYXJjaEZvcm0oKSB7XG4gICAgJCh0aGlzLnNlbC5pbnB1dCkudmFsKCcnKS5mb2N1cygpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTZWFyY2hGb3JtKCk7XG4iLCJjbGFzcyBTZXJ2aWNlV29ya2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kZWZlcnJlZFByb21wdCA9IG51bGw7XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlZ2lzdGVyID0gdGhpcy5yZWdpc3Rlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYWRkVG9Ib21lU2NyZWVuID0gdGhpcy5hZGRUb0hvbWVTY3JlZW4uYmluZCh0aGlzKTtcbiAgfVxuXG4gIHJlZ2lzdGVyKCkge1xuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcvZGlzY292ZXIvZXRjLmNsaWVudGxpYnMvZGhsL2NsaWVudGxpYnMvY2xpZW50bGliLXNpdGUvcmVzb3VyY2VzL3N3LmpzP3Y9ZGlzY292ZXJEaGwtMjAyMjExMTUtMScpLnRoZW4oKCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ1NlcnZpY2VXb3JrZXIgc3VjY2VzZnVsbHkgcmVnaXN0ZXJlZCcpO1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQ6ICcsIGVycik7XG4gICAgfSk7XG4gIH1cblxuICBhZGRUb0hvbWVTY3JlZW4oKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZWluc3RhbGxwcm9tcHQnLCAoZSkgPT4ge1xuICAgICAgLy8gUHJldmVudCBDaHJvbWUgNjcgYW5kIGVhcmxpZXIgZnJvbSBhdXRvbWF0aWNhbGx5IHNob3dpbmcgdGhlIHByb21wdFxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgLy8gU3Rhc2ggdGhlIGV2ZW50IHNvIGl0IGNhbiBiZSB0cmlnZ2VyZWQgbGF0ZXIuXG4gICAgICB0aGlzLmRlZmVycmVkUHJvbXB0ID0gZTtcbiAgICAgIC8vIENoZWNrIGlmIGFscmVhZHkgZGlzbWlzc2VkXG4gICAgICBsZXQgYTJoc0Nvb2tpZSA9IENvb2tpZXMuZ2V0KCdhMmhzJyk7XG4gICAgICAvLyBJZiB0aGUgY29va2llIGlzIHNldCB0byBpZ25vcmUsIGlnbm9yZSB0aGUgcHJvbXB0XG4gICAgICBpZiAoYTJoc0Nvb2tpZSA9PT0gJ2lnbm9yZScpIHJldHVybjtcbiAgICAgIC8vIFNob3cgdGhlIGFkZCB0byBob21lIHNjcmVlbiBiYW5uZXJcbiAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW4nKS5hZGRDbGFzcygnYWRkVG9Ib21lU2NyZWVuLS1vcGVuJyk7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmFkZFRvSG9tZVNjcmVlbl9fY3RhJywgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIC8vIFNob3cgQTJIU1xuICAgICAgdGhpcy5kZWZlcnJlZFByb21wdC5wcm9tcHQoKTtcbiAgICAgIC8vIFdhaXQgZm9yIHRoZSB1c2VyIHRvIHJlc3BvbmQgdG8gdGhlIHByb21wdFxuICAgICAgdGhpcy5kZWZlcnJlZFByb21wdC51c2VyQ2hvaWNlLnRoZW4oKGNob2ljZVJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAoY2hvaWNlUmVzdWx0Lm91dGNvbWUgPT09ICdhY2NlcHRlZCcpIHtcbiAgICAgICAgICAvLyBIaWRlIHRoZSBhZGQgdG8gaG9tZSBzY3JlZW4gYmFubmVyXG4gICAgICAgICAgJCgnLmFkZFRvSG9tZVNjcmVlbicpLnJlbW92ZUNsYXNzKCdhZGRUb0hvbWVTY3JlZW4tLW9wZW4nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDaGFuZ2UgY29udGVudFxuICAgICAgICAgICQoJy5hZGRUb0hvbWVTY3JlZW5fX3RpdGxlJykudGV4dCgnVGhhdFxcJ3MgYSBzaGFtZSwgbWF5YmUgbmV4dCB0aW1lJyk7XG4gICAgICAgICAgJCgnLmFkZFRvSG9tZVNjcmVlbl9fY3RhJykucmVtb3ZlKCk7XG4gICAgICAgICAgJCgnLmFkZFRvSG9tZVNjcmVlbl9fbGluaycpLnRleHQoJ0Nsb3NlJyk7XG4gICAgICAgICAgLy8gU2V0IGlnbm9yZSBjb29raWVcbiAgICAgICAgICB0aGlzLmNyZWF0ZUEyaHNDb29raWUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlZmVycmVkUHJvbXB0ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5hZGRUb0hvbWVTY3JlZW5fX2xpbmsnLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgLy8gSGlkZSB0aGUgYWRkIHRvIGhvbWUgc2NyZWVuIGJhbm5lclxuICAgICAgJCgnLmFkZFRvSG9tZVNjcmVlbicpLnJlbW92ZUNsYXNzKCdhZGRUb0hvbWVTY3JlZW4tLW9wZW4nKTtcbiAgICAgIC8vIENsZWFyIHRoZSBwcm9tcHRcbiAgICAgIHRoaXMuZGVmZXJyZWRQcm9tcHQgPSBudWxsO1xuICAgICAgLy8gU2V0IGlnbm9yZSBjb29raWVcbiAgICAgIHRoaXMuY3JlYXRlQTJoc0Nvb2tpZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlQTJoc0Nvb2tpZSgpIHtcbiAgICAvLyBTZXQgaWdub3JlIGNvb2tpZVxuICAgIENvb2tpZXMuc2V0KCdhMmhzJywgJ2lnbm9yZScsIHtleHBpcmVzOiAxNH0pO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoISgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMucmVnaXN0ZXIoKTtcbiAgICAvLyB0aGlzLmFkZFRvSG9tZVNjcmVlbigpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTZXJ2aWNlV29ya2VyKCk7XG4iLCJjbGFzcyBTaGlwRm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgLy8gUVNQID0gcXVlcnlzdHJpbmcgcGFyYW1ldGVyXG4gICAgICBjb21wb25lbnQ6ICcuc2hpcC1ub3cnLFxuICAgICAgZmlyc3RuYW1lSW5wdXQ6ICcjZmlyc3RuYW1lJywgLy8ganF1ZXJ5IHNlbGVjdG9yIGZvciBpbnB1dCAoY2FuIGJlIGVnICcuZmlyc3RuYW1lIGlucHV0JylcbiAgICAgIGZpcnN0bmFtZVFTUDogJz9maXJzdG5hbWUnLCAvLyBuZWVkID8gZm9sbG93ZWQgYnkgcGFyYW1ldGVyIG5hbWVcbiAgICAgIGxhc3RuYW1lSW5wdXQ6ICcjbGFzdG5hbWUnLFxuICAgICAgbGFzdG5hbWVRU1A6ICc/bGFzdG5hbWUnLFxuICAgICAgZW1haWxJbnB1dDogJyNlbWFpbCcsXG4gICAgICBlbWFpbFFTUDogJz9lbWFpbCcsXG4gICAgICB1c2VyRmlyc3RuYW1lRWxlbWVudDogJy51c2VyLWZpcnN0bmFtZSdcbiAgICB9O1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5wb3B1bGF0ZUZvcm0gPSB0aGlzLnBvcHVsYXRlRm9ybS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvd0xvZ2dlZEluRWxlbWVudHMgPSB0aGlzLnNob3dMb2dnZWRJbkVsZW1lbnRzLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcblxuICAgICQod2luZG93KS5vbigndXNlcmxvZ2dlZGluLkRITCcsIChldnQsIHRva2VuRGF0YSkgPT4ge1xuICAgICAgdGhpcy5zaG93TG9nZ2VkSW5FbGVtZW50cyh0b2tlbkRhdGEpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5wb3B1bGF0ZUZvcm0oKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHBvcHVsYXRlRm9ybSgpIHtcbiAgICBsZXQgZW1haWwgPSB1cmwodGhpcy5zZWwuZW1haWxRU1ApO1xuICAgIGxldCBmaXJzdG5hbWUgPSB1cmwodGhpcy5zZWwuZmlyc3RuYW1lUVNQKTtcbiAgICBsZXQgbGFzdG5hbWUgPSB1cmwodGhpcy5zZWwubGFzdG5hbWVRU1ApO1xuXG4gICAgaWYgKHR5cGVvZiBlbWFpbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICQodGhpcy5zZWwuZW1haWxJbnB1dCkudmFsKGVtYWlsKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGZpcnN0bmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICQodGhpcy5zZWwuZmlyc3RuYW1lSW5wdXQpLnZhbChmaXJzdG5hbWUpO1xuXG4gICAgICBpZiAoJC50cmltKGZpcnN0bmFtZSkubGVuZ3RoID4gMCkge1xuICAgICAgICAkKHRoaXMuc2VsLnVzZXJGaXJzdG5hbWVFbGVtZW50KS50ZXh0KGZpcnN0bmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBsYXN0bmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICQodGhpcy5zZWwubGFzdG5hbWVJbnB1dCkudmFsKGxhc3RuYW1lKTtcbiAgICB9XG4gIH1cblxuICBzaG93TG9nZ2VkSW5FbGVtZW50cyh0b2tlbkRhdGEpIHtcbiAgICBsZXQgZmlyc3RuYW1lID0gdXJsKHRoaXMuc2VsLmZpcnN0bmFtZVFTUCk7XG5cbiAgICBpZiAoKHR5cGVvZiBmaXJzdG5hbWUgPT09ICd1bmRlZmluZWQnKSB8fCAoJC50cmltKGZpcnN0bmFtZSkubGVuZ3RoID09PSAwKSkge1xuICAgICAgJCh0aGlzLnNlbC51c2VyRmlyc3RuYW1lRWxlbWVudCkudGV4dCh0b2tlbkRhdGEubmFtZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTaGlwRm9ybSgpO1xuIiwiY2xhc3MgU2hpcE5vd0Zvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGZvcm06ICdmb3JtLmZvcm1zLnNoaXAtbm93JyxcbiAgICAgIGNvdW50cnlzZWxlY3Q6ICdmb3JtLmZvcm1zLnNoaXAtbm93ICNzaGlwbm93X2NvdW50cnknXG4gICAgfTtcblxuICAgIHRoaXMuZ2V0UGF0aFByZWZpeCA9IHRoaXMuZ2V0UGF0aFByZWZpeC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMudG9nZ2xlQWRkcmVzcyA9IHRoaXMudG9nZ2xlQWRkcmVzcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0Rm9ybSA9IHRoaXMuc3VibWl0Rm9ybS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0Rm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaG93U3VjY2VzcyA9IHRoaXMuc2hvd1N1Y2Nlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3dFcnJvciA9IHRoaXMuc2hvd0Vycm9yLmJpbmQodGhpcyk7XG4gICAgdGhpcy52YWxpZGF0ZSA9IHRoaXMudmFsaWRhdGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldFBhdGhQcmVmaXgoKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsIHRoaXMuc2VsLmNvdW50cnlzZWxlY3QsIHRoaXMudG9nZ2xlQWRkcmVzcyk7XG4gICAgJChkb2N1bWVudCkub24oJ3N1Ym1pdCcsIHRoaXMuc2VsLmZvcm0sIHRoaXMuc3VibWl0Rm9ybSk7XG5cbiAgICB2YXIgY291bnRyeSA9ICQodGhpcy5zZWwuZm9ybSkuZGF0YSgncHJlc2VsZWN0Y291bnRyeScpO1xuICAgIGlmICgoY291bnRyeSAhPT0gbnVsbCkgJiYgJC50cmltKGNvdW50cnkpLmxlbmd0aCA+IDApIHtcbiAgICAgICQodGhpcy5zZWwuY291bnRyeXNlbGVjdCkudmFsKGNvdW50cnkpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH1cbiAgfVxuXG4gIHZhbGlkYXRlKCkge1xuICAgICQodGhpcy5zZWwuZm9ybSkuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgICQoaXRlbSkudmFsaWRhdGUoe1xuICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5pcygnc2VsZWN0JykpIHtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5maW5kKCcuc2VsZWN0Ym94aXQtYnRuJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogKGxhYmVsKSA9PiB7XG4gICAgICAgICAgbGV0ICRwYXJlbnQgPSAkKGxhYmVsKS5wYXJlbnRzKCdmb3JtLnNoaXAtbm93Jyk7XG4gICAgICAgICAgaWYgKCRwYXJlbnQuZmluZCgnc2VsZWN0JykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJHBhcmVudC5maW5kKCcuc2VsZWN0Ym94aXQtYnRuJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHRvZ2dsZUFkZHJlc3MoZSkge1xuICAgIHZhciB2YWwgPSAkKHRoaXMuc2VsLmNvdW50cnlzZWxlY3QpLnZhbCgpO1xuXG4gICAgdmFyIG9wdGlvbnMgPSAkKCdvcHRpb24nLCB0aGlzLnNlbC5jb3VudHJ5c2VsZWN0KTtcbiAgICB2YXIgbWFuZGF0b3J5ID0gdHJ1ZTtcbiAgICBvcHRpb25zLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XG4gICAgICBpZiAoJChpdGVtKS5hdHRyKCd2YWx1ZScpID09PSB2YWwgJiYgKCcnICsgJChpdGVtKS5kYXRhKCdub25tYW5kYXRvcnknKSkgPT09ICd0cnVlJykge1xuICAgICAgICBtYW5kYXRvcnkgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChtYW5kYXRvcnkpIHtcbiAgICAgICQoJyNzaGlwbm93X2FkZHJlc3MnLCB0aGlzLnNlbC5mb3JtKS5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0FkZHJlc3MqJyk7XG4gICAgICAkKCcjc2hpcG5vd196aXAnLCB0aGlzLnNlbC5mb3JtKS5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ1pJUCBvciBQb3N0Y29kZSonKTtcbiAgICAgICQoJyNzaGlwbm93X2NpdHknLCB0aGlzLnNlbC5mb3JtKS5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0NpdHkqJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJyNzaGlwbm93X2FkZHJlc3MnLCB0aGlzLnNlbC5mb3JtKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0FkZHJlc3MnKS5yZW1vdmVDbGFzcygnZXJyb3InKS5jbG9zZXN0KCdkaXYnKS5maW5kKCdsYWJlbCcpLnJlbW92ZSgpO1xuICAgICAgJCgnI3NoaXBub3dfemlwJywgdGhpcy5zZWwuZm9ybSkucmVtb3ZlQXR0cigncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdaSVAgb3IgUG9zdGNvZGUnKS5yZW1vdmVDbGFzcygnZXJyb3InKS5jbG9zZXN0KCdkaXYnKS5maW5kKCdsYWJlbCcpLnJlbW92ZSgpO1xuICAgICAgJCgnI3NoaXBub3dfY2l0eScsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQ2l0eScpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmNsb3Nlc3QoJ2RpdicpLmZpbmQoJ2xhYmVsJykucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgc3VibWl0Rm9ybShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCAkZm9ybSA9ICQoZS50YXJnZXQpO1xuICAgIGxldCBmb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEoJGZvcm0pO1xuICAgICQucG9zdCh0aGlzLmdldFBhdGhQcmVmaXgoKSArICRmb3JtLmF0dHIoJ2FjdGlvbicpLCBmb3JtRGF0YSwgKGRhdGEpID0+IHtcbiAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ09LJykge1xuICAgICAgICB0aGlzLnNob3dTdWNjZXNzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNob3dFcnJvcigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0Rm9ybURhdGEoJGZvcm0pIHtcbiAgICBsZXQgdW5pbmRleGVkQXJyYXkgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xuICAgIGxldCBpbmRleGVkQXJyYXkgPSB7fTtcbiAgICAkLm1hcCh1bmluZGV4ZWRBcnJheSwgKG4pID0+IChpbmRleGVkQXJyYXlbbi5uYW1lXSA9IG4udmFsdWUpKTtcblxuICAgIGluZGV4ZWRBcnJheS5zb3VyY2UgPSAkLnRyaW0oJGZvcm0uZGF0YSgnc291cmNlJykpO1xuICAgIGluZGV4ZWRBcnJheS5sbyA9ICQudHJpbSgkZm9ybS5kYXRhKCdsbycpKTtcblxuICAgIHJldHVybiBpbmRleGVkQXJyYXk7XG4gIH1cblxuICBzaG93U3VjY2VzcygpIHtcbiAgICB3aW5kb3cubG9jYXRpb24gPSAkKHRoaXMuc2VsLmZvcm0pLmRhdGEoJ3RoYW5rcycpO1xuICB9XG5cbiAgc2hvd0Vycm9yKCkge1xuICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZC4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuZm9ybSkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFNoaXBOb3dGb3JtKCk7XG4iLCJjbGFzcyBTaGlwTm93VHdvU3RlcEZvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmZpcnN0bmFtZSA9ICcnO1xuICAgIHRoaXMubGFzdG5hbWUgPSAnJztcbiAgICB0aGlzLmVtYWlsID0gJyc7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC8vIGZiQXBwSWQ6ICcxMDAwNzczMTYzMzM3Nzk4JyxcbiAgICAgIGZiQXBwSWQ6ICcxMDgwMDMxMzI4ODAxMjExJyxcbiAgICAgIC8vIGdvQ2xpZW50SWQ6ICc5MTM5NjAzNTIyMzYtdTd1bjBsMjJ0dmttbGJwYTViY25mMXVxZzRjc2k3ZTMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nLFxuICAgICAgZ29DbGllbnRJZDogJzMxMzQ2OTgzNzQyMC1sODgyaDM5Z2U4bjhuOXBiOTdsZHZqazNmbThwcHFncy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSdcbiAgICB9O1xuXG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuc2hpcE5vd011bHRpLnd5c2l3eWcsIC5hbmltYXRlZEZvcm0nLFxuICAgICAgc3dpbmdidXR0b246ICcuc2hpcE5vd011bHRpX19oZWFkY3RhLS1yZWQnLFxuICAgICAgZm9ybXM6ICdmb3JtLmZvcm1zLnNoaXAtbm93LXR3b3N0ZXAnLFxuICAgICAgZm9ybTE6ICdmb3JtLmZvcm1zLmZvcm0xLnNoaXAtbm93LXR3b3N0ZXAnLFxuICAgICAgZm9ybTI6ICdmb3JtLmZvcm1zLmZvcm0yLnNoaXAtbm93LXR3b3N0ZXAnLFxuICAgICAgY291bnRyeXNlbGVjdDogJ2Zvcm0uZm9ybXMuZm9ybTIuc2hpcC1ub3ctdHdvc3RlcCAjc2hpcG5vd19jb3VudHJ5JyxcblxuICAgICAgYnV0dG9uRmFjZWJvb2s6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmZhY2Vib29rJyxcbiAgICAgIGJ1dHRvbkxpbmtlZGluOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5saW5rZWRpbicsXG4gICAgICBidXR0b25Hb29nbGVQbHVzOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5nb29nbGUnXG4gICAgfTtcblxuICAgIHRoaXMuZ2V0UGF0aFByZWZpeCA9IHRoaXMuZ2V0UGF0aFByZWZpeC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy50b2dnbGVBZGRyZXNzID0gdGhpcy50b2dnbGVBZGRyZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRGYWNlYm9vayA9IHRoaXMuc3VibWl0RmFjZWJvb2suYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdExpbmtlZGluID0gdGhpcy5zdWJtaXRMaW5rZWRpbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0R29vZ2xlID0gdGhpcy5zdWJtaXRHb29nbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEZvcm0xID0gdGhpcy5zdWJtaXRGb3JtMS5iaW5kKHRoaXMpO1xuICAgIHRoaXMubmV4dEZvcm0gPSB0aGlzLm5leHRGb3JtLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRGb3JtMiA9IHRoaXMuc3VibWl0Rm9ybTIuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldEZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvd1N1Y2Nlc3MgPSB0aGlzLnNob3dTdWNjZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy52YWxpZGF0ZSA9IHRoaXMudmFsaWRhdGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldFBhdGhQcmVmaXgoKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJChkb2N1bWVudCkub24oJ3N1Ym1pdCcsIHRoaXMuc2VsLmZvcm0xLCB0aGlzLnN1Ym1pdEZvcm0xKTtcbiAgICAkKGRvY3VtZW50KS5vbignc3VibWl0JywgdGhpcy5zZWwuZm9ybTIsIHRoaXMuc3VibWl0Rm9ybTIpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjaGFuZ2UnLCB0aGlzLnNlbC5jb3VudHJ5c2VsZWN0LCB0aGlzLnRvZ2dsZUFkZHJlc3MpO1xuXG4gICAgdmFyIGNvdW50cnkgPSAkKHRoaXMuc2VsLmZvcm0yKS5kYXRhKCdwcmVzZWxlY3Rjb3VudHJ5Jyk7XG4gICAgaWYgKChjb3VudHJ5ICE9PSBudWxsKSAmJiAkLnRyaW0oY291bnRyeSkubGVuZ3RoID4gMCkge1xuICAgICAgJCh0aGlzLnNlbC5jb3VudHJ5c2VsZWN0KS52YWwoY291bnRyeSkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfVxuXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkZhY2Vib29rKS5sZW5ndGggPiAwKSB7XG4gICAgICB3aW5kb3cuZmJBc3luY0luaXQgPSAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5mYl9pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mICh3aW5kb3cuRkIpICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuRkIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHdpbmRvdy5GQi5pbml0KHtcbiAgICAgICAgICAgICAgYXBwSWQ6IHRoaXMuY29uZmlnLmZiQXBwSWQsXG4gICAgICAgICAgICAgIGNvb2tpZTogdHJ1ZSxcbiAgICAgICAgICAgICAgeGZibWw6IHRydWUsXG4gICAgICAgICAgICAgIHZlcnNpb246ICd2Mi44J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmZiX2ludGVydmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhY2Vib29rLWpzc2RrJykgPT09IG51bGwpIHtcbiAgICAgICAgdmFyIGZqcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICAgICAgdmFyIGpzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgIGpzLmlkID0gJ2ZhY2Vib29rLWpzc2RrJztcbiAgICAgICAganMuc3JjID0gJy8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fRU4vc2RrLmpzJztcbiAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xuICAgICAgfVxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLm9uKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgdGhpcy5zdWJtaXRGYWNlYm9vayhldnQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLmxlbmd0aCA+IDApIHtcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgIHRoaXMuc3VibWl0TGlua2VkaW4oZXZ0KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIGdvb2dsZUJ1dHRvbiA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpO1xuICAgIGlmIChnb29nbGVCdXR0b24ubGVuZ3RoID4gMCkge1xuICAgICAgd2luZG93LmdvX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mICh3aW5kb3cuZ2FwaSkgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5nYXBpICE9PSBudWxsKSB7XG4gICAgICAgICAgd2luZG93LmdhcGkubG9hZCgnYXV0aDInLCAoKSA9PiB7XG4gICAgICAgICAgICB2YXIgYXV0aDIgPSB3aW5kb3cuZ2FwaS5hdXRoMi5pbml0KHtcbiAgICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNvbmZpZy5nb0NsaWVudElkLFxuICAgICAgICAgICAgICBjb29raWVwb2xpY3k6ICdzaW5nbGVfaG9zdF9vcmlnaW4nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBnb29nbGVCdXR0b24uZ2V0KDApO1xuICAgICAgICAgICAgYXV0aDIuYXR0YWNoQ2xpY2tIYW5kbGVyKGVsZW1lbnQsIHt9LFxuICAgICAgICAgICAgICAoZ29vZ2xlVXNlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3VibWl0R29vZ2xlKGdvb2dsZVVzZXIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3IgIT09ICdwb3B1cF9jbG9zZWRfYnlfdXNlcicpIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KHJlc3VsdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZ29faW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgICB9LCAxMDApO1xuXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5zd2luZ2J1dHRvbiwgKGV2dCkgPT4ge1xuICAgICAgdmFyIGlkID0gJChldnQuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpO1xuICAgICAgdmFyIG9mZnNldCA9ICQoaWQpLm9mZnNldCgpLnRvcDtcbiAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgc2Nyb2xsVG9wOiBvZmZzZXRcbiAgICAgIH0sIDEwMDAsICdzd2luZycpO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICB2YWxpZGF0ZSgpIHtcbiAgICAkKHRoaXMuc2VsLmZvcm1zKS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgJChpdGVtKS52YWxpZGF0ZSh7XG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmlzKCdzZWxlY3QnKSkge1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLmZpbmQoJy5zZWxlY3Rib3hpdC1idG4nKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiAobGFiZWwpID0+IHtcbiAgICAgICAgICBsZXQgJHBhcmVudCA9ICQobGFiZWwpLnBhcmVudHMoJ2Zvcm0uc2hpcC1ub3cnKTtcbiAgICAgICAgICBpZiAoJHBhcmVudC5maW5kKCdzZWxlY3QnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkcGFyZW50LmZpbmQoJy5zZWxlY3Rib3hpdC1idG4nKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgdG9nZ2xlQWRkcmVzcyhlKSB7XG4gICAgdmFyIHZhbCA9ICQodGhpcy5zZWwuY291bnRyeXNlbGVjdCkudmFsKCk7XG5cbiAgICB2YXIgb3B0aW9ucyA9ICQoJ29wdGlvbicsIHRoaXMuc2VsLmNvdW50cnlzZWxlY3QpO1xuICAgIHZhciBtYW5kYXRvcnkgPSB0cnVlO1xuICAgIG9wdGlvbnMuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgIGlmICgkKGl0ZW0pLmF0dHIoJ3ZhbHVlJykgPT09IHZhbCAmJiAoJycgKyAkKGl0ZW0pLmRhdGEoJ25vbm1hbmRhdG9yeScpKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIG1hbmRhdG9yeSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG1hbmRhdG9yeSkge1xuICAgICAgJCgnI3NoaXBub3dfYWRkcmVzcycsIHRoaXMuc2VsLmZvcm0pLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQWRkcmVzcyonKTtcbiAgICAgICQoJyNzaGlwbm93X3ppcCcsIHRoaXMuc2VsLmZvcm0pLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnWklQIG9yIFBvc3Rjb2RlKicpO1xuICAgICAgJCgnI3NoaXBub3dfY2l0eScsIHRoaXMuc2VsLmZvcm0pLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQ2l0eSonKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnI3NoaXBub3dfYWRkcmVzcycsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQWRkcmVzcycpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmNsb3Nlc3QoJ2RpdicpLmZpbmQoJ2xhYmVsJykucmVtb3ZlKCk7XG4gICAgICAkKCcjc2hpcG5vd196aXAnLCB0aGlzLnNlbC5mb3JtKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ1pJUCBvciBQb3N0Y29kZScpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmNsb3Nlc3QoJ2RpdicpLmZpbmQoJ2xhYmVsJykucmVtb3ZlKCk7XG4gICAgICAkKCcjc2hpcG5vd19jaXR5JywgdGhpcy5zZWwuZm9ybSkucmVtb3ZlQXR0cigncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdDaXR5JykucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuY2xvc2VzdCgnZGl2JykuZmluZCgnbGFiZWwnKS5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICBzdWJtaXRGYWNlYm9vayhldnQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHdpbmRvdy5GQi5sb2dpbigobG9naW5SZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKGxvZ2luUmVzcG9uc2UuYXV0aFJlc3BvbnNlKSB7XG4gICAgICAgIHdpbmRvdy5GQi5hcGkoJy9tZScsIChkYXRhUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICB0aGlzLmZpcnN0bmFtZSA9IGRhdGFSZXNwb25zZS5maXJzdF9uYW1lO1xuICAgICAgICAgIHRoaXMubGFzdG5hbWUgPSBkYXRhUmVzcG9uc2UubGFzdF9uYW1lO1xuICAgICAgICAgIHRoaXMuZW1haWwgPSBkYXRhUmVzcG9uc2UuZW1haWw7XG5cbiAgICAgICAgICB0aGlzLm5leHRGb3JtKCk7XG4gICAgICAgIH0sIHsgZmllbGRzOiBbICdpZCcsICdlbWFpbCcsICdmaXJzdF9uYW1lJywgJ2xhc3RfbmFtZScgXX0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sIHsgc2NvcGU6ICdlbWFpbCxwdWJsaWNfcHJvZmlsZScsIHJldHVybl9zY29wZXM6IHRydWUgfSk7XG4gIH1cblxuICBzdWJtaXRMaW5rZWRpbihldnQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIElOLlVzZXIuYXV0aG9yaXplKCgpID0+IHtcbiAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XG4gICAgICAgIHZhciBtZW1iZXIgPSByZXN1bHQudmFsdWVzWzBdO1xuXG4gICAgICAgIHRoaXMuZmlyc3RuYW1lID0gbWVtYmVyLmZpcnN0TmFtZTtcbiAgICAgICAgdGhpcy5sYXN0bmFtZSA9IG1lbWJlci5sYXN0TmFtZTtcbiAgICAgICAgdGhpcy5lbWFpbCA9IG1lbWJlci5lbWFpbEFkZHJlc3M7XG5cbiAgICAgICAgdGhpcy5uZXh0Rm9ybSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICB2YXIgcmVzdWx0ID0gd2luZG93LklOLlVzZXIuaXNBdXRob3JpemVkKCk7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgdmFyIG1lbWJlciA9IHJlc3VsdC52YWx1ZXNbMF07XG4gIFxuICAgICAgICAgIHRoaXMuZmlyc3RuYW1lID0gbWVtYmVyLmZpcnN0TmFtZTtcbiAgICAgICAgICB0aGlzLmxhc3RuYW1lID0gbWVtYmVyLmxhc3ROYW1lO1xuICAgICAgICAgIHRoaXMuZW1haWwgPSBtZW1iZXIuZW1haWxBZGRyZXNzO1xuICBcbiAgICAgICAgICB0aGlzLm5leHRGb3JtKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3VibWl0R29vZ2xlKGdvb2dsZVVzZXIpIHtcbiAgICB2YXIgYmFzaWNQcm9maWxlID0gZ29vZ2xlVXNlci5nZXRCYXNpY1Byb2ZpbGUoKTtcblxuICAgIHRoaXMuZmlyc3RuYW1lID0gYmFzaWNQcm9maWxlLmdldEdpdmVuTmFtZSgpO1xuICAgIHRoaXMubGFzdG5hbWUgPSBiYXNpY1Byb2ZpbGUuZ2V0RmFtaWx5TmFtZSgpO1xuICAgIHRoaXMuZW1haWwgPSBiYXNpY1Byb2ZpbGUuZ2V0RW1haWwoKTtcblxuICAgIHRoaXMubmV4dEZvcm0oKTtcbiAgfVxuXG4gIHN1Ym1pdEZvcm0xKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0ICRmb3JtID0gJChlLnRhcmdldCk7XG4gICAgbGV0IGZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YSgkZm9ybSk7XG5cbiAgICB0aGlzLmZpcnN0bmFtZSA9IGZvcm1EYXRhLmZpcnN0bmFtZTtcbiAgICB0aGlzLmxhc3RuYW1lID0gZm9ybURhdGEubGFzdG5hbWU7XG4gICAgdGhpcy5lbWFpbCA9IGZvcm1EYXRhLmVtYWlsO1xuXG4gICAgdGhpcy5uZXh0Rm9ybSgpO1xuICB9XG5cbiAgbmV4dEZvcm0oKSB7XG4gICAgJCgnLnNoaXBOb3dNdWx0aV9fZm9ybXN0ZXAtLXN0ZXAxJywgdGhpcy5zZWwuY29tcG9uZW50KS5oaWRlKCk7XG4gICAgJCgnLnNoaXBOb3dNdWx0aV9fZm9ybXN0ZXAtLXN0ZXAyJywgdGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIHN1Ym1pdEZvcm0yKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0ICRmb3JtID0gJChlLnRhcmdldCk7XG4gICAgbGV0IGZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YSgkZm9ybSk7XG4gICAgZm9ybURhdGEuZmlyc3RuYW1lID0gdGhpcy5maXJzdG5hbWU7XG4gICAgZm9ybURhdGEubGFzdG5hbWUgPSB0aGlzLmxhc3RuYW1lO1xuICAgIGZvcm1EYXRhLmVtYWlsID0gdGhpcy5lbWFpbDtcblxuICAgICQucG9zdCh0aGlzLmdldFBhdGhQcmVmaXgoKSArICRmb3JtLmF0dHIoJ2FjdGlvbicpLCBmb3JtRGF0YSwgKGRhdGEpID0+IHtcbiAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ09LJykge1xuICAgICAgICB0aGlzLnNob3dTdWNjZXNzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRGb3JtRGF0YSgkZm9ybSkge1xuICAgIGxldCB1bmluZGV4ZWRBcnJheSA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG4gICAgbGV0IGluZGV4ZWRBcnJheSA9IHt9O1xuICAgICQubWFwKHVuaW5kZXhlZEFycmF5LCAobikgPT4gKGluZGV4ZWRBcnJheVtuLm5hbWVdID0gbi52YWx1ZSkpO1xuXG4gICAgaW5kZXhlZEFycmF5LnNvdXJjZSA9ICQudHJpbSgkZm9ybS5kYXRhKCdzb3VyY2UnKSk7XG4gICAgaW5kZXhlZEFycmF5LmxvID0gJC50cmltKCRmb3JtLmRhdGEoJ2xvJykpO1xuXG4gICAgcmV0dXJuIGluZGV4ZWRBcnJheTtcbiAgfVxuXG4gIHNob3dTdWNjZXNzKCkge1xuICAgIHZhciB0aGFua3MgPSAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDInLCB0aGlzLnNlbC5jb21wb25lbnQpLmRhdGEoXCJ0aGFua3NcIik7XG4gICAgaWYgKCh0aGFua3MgIT09IG51bGwpICYmICh0aGFua3MubGVuZ3RoID4gMCkpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoYW5rcztcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnLnNoaXBOb3dNdWx0aV9fZm9ybXN0ZXAtLXN0ZXAyJywgdGhpcy5zZWwuY29tcG9uZW50KS5oaWRlKCk7XG4gICAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tdGhhbmtzJywgdGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XG4gICAgfVxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTaGlwTm93VHdvU3RlcEZvcm0oKTtcbiIsImNsYXNzIFNob3dIaWRlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICdbZGF0YS1zaG93LWhpZGUtaWRdJyxcbiAgICAgIHRvZ2dsZTogJ1tkYXRhLXNob3ctaGlkZS10YXJnZXRdJ1xuICAgIH07XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC50b2dnbGUsIChlKSA9PiB7XG4gICAgICBjb25zdCBzaG93SGlkZVRhcmdldCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtc2hvdy1oaWRlLXRhcmdldCcpO1xuICAgICAgJCgnW2RhdGEtc2hvdy1oaWRlLWlkPScgKyBzaG93SGlkZVRhcmdldCArICddJykuc2xpZGVUb2dnbGUoKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgU2hvd0hpZGUoKTtcbiIsImNsYXNzIFNvY2lhbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLnNvY2lhbCdcbiAgICB9O1xuXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jb250YWluZXJUb3AgPSB0aGlzLmNvbnRhaW5lclRvcC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU2Nyb2xsID0gdGhpcy5oYW5kbGVTY3JvbGwuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNoZWNrU2hhcmVQb3MgPSB0aGlzLmNoZWNrU2hhcmVQb3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRlYm91bmNlID0gdGhpcy5kZWJvdW5jZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVTY3JvbGwpO1xuICB9XG5cbiAgY29udGFpbmVyVG9wKCkge1xuICAgIHJldHVybiAkKHRoaXMuc2VsLmNvbXBvbmVudCkucGFyZW50KCkucG9zaXRpb24oKS50b3A7XG4gIH1cblxuICBoYW5kbGVTY3JvbGwoKSB7XG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IDk5Mikge1xuICAgICAgbGV0IGhlaWdodCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICAgIGxldCBib3R0b20gPSB0aGlzLmNvbnRhaW5lclRvcCgpICsgJCh0aGlzLnNlbC5jb21wb25lbnQpLnBhcmVudCgpLmhlaWdodCgpIC0gJCh0aGlzLnNlbC5jb21wb25lbnQpLm91dGVySGVpZ2h0KCkgLSA2MDtcbiAgICAgIGlmIChoZWlnaHQgPj0gdGhpcy5jb250YWluZXJUb3AoKSAmJiBoZWlnaHQgPCBib3R0b20gJiYgISQodGhpcy5zZWwuY29tcG9uZW50KS5oYXNDbGFzcygnc29jaWFsLS1hZmZpeCcpKSB7XG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KVxuICAgICAgICAgIC5hZGRDbGFzcygnc29jaWFsLS1hZmZpeCcpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnbGVmdCc6IHRoaXMuZ2V0TGVmdE9mZnNldCgkKHRoaXMuc2VsLmNvbXBvbmVudCkpLFxuICAgICAgICAgICAgJ3RvcCc6ICcnXG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGhlaWdodCA8IHRoaXMuY29udGFpbmVyVG9wKCkgJiYgJCh0aGlzLnNlbC5jb21wb25lbnQpLmhhc0NsYXNzKCdzb2NpYWwtLWFmZml4JykpIHtcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCdzb2NpYWwtLWFmZml4JylcbiAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICdsZWZ0JzogJycsXG4gICAgICAgICAgICAndG9wJzogJydcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoaGVpZ2h0ID49IGJvdHRvbSAmJiAkKHRoaXMuc2VsLmNvbXBvbmVudCkuaGFzQ2xhc3MoJ3NvY2lhbC0tYWZmaXgnKSkge1xuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudClcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NvY2lhbC0tYWZmaXgnKVxuICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgJ2xlZnQnOiAnJyxcbiAgICAgICAgICAgICd0b3AnOiB0aGlzLmdldFRvcE9mZnNldCgpXG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0TGVmdE9mZnNldCgkZWxtKSB7XG4gICAgbGV0IHBhcmVudE9mZnNldCA9IHBhcnNlSW50KCRlbG0ucGFyZW50KCkub2Zmc2V0KCkubGVmdCwgMTApO1xuICAgIGxldCBteU9mZnNldCA9IHBhcnNlSW50KCRlbG0ub2Zmc2V0KCkubGVmdCwgMTApO1xuICAgIHJldHVybiAocGFyZW50T2Zmc2V0ICsgbXlPZmZzZXQpO1xuICB9XG5cbiAgZ2V0VG9wT2Zmc2V0KCkge1xuICAgIGxldCBwYXJlbnRPZmZzZXQgPSB0aGlzLmNvbnRhaW5lclRvcCgpO1xuICAgIGxldCBzY3JvbGxQb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgbGV0IHRvcCA9IHNjcm9sbFBvcyAtIHBhcmVudE9mZnNldCArIDUwO1xuICAgIHJldHVybiB0b3A7XG4gIH1cblxuICBjaGVja1NoYXJlUG9zKCkge1xuICAgIGlmICgkKCcuc29jaWFsLS12ZXJ0aWNhbC5zb2NpYWwtLWFmZml4JykubGVuZ3RoKSB7XG4gICAgICAkKCcuc29jaWFsLS12ZXJ0aWNhbC5zb2NpYWwtLWFmZml4JykucmVtb3ZlQXR0cignc3R5bGUnKS5yZW1vdmVDbGFzcygnc29jaWFsLS1hZmZpeCcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIERlYm91dGNlIGZ1bmN0aW9uXG4gIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0O1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgfTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgaWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmRlYm91bmNlKHRoaXMuY2hlY2tTaGFyZVBvcywgMTAwKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFNvY2lhbCgpO1xuIiwiY2xhc3MgU3Vic2NyaWJlUGFuZWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5zdWJzY3JpYmVQYW5lbCcsXG4gICAgICBmb3JtOiAnLnN1YnNjcmliZVBhbmVsX19mb3JtJyxcbiAgICAgIHN1Y2Nlc3NPdmVybGF5OiAnLnN1YnNjcmliZVBhbmVsX19yZXNwb25zZU92ZXJsYXkuc3VjY2VzcycsXG4gICAgICBlcnJvck92ZXJsYXk6ICcuc3Vic2NyaWJlUGFuZWxfX3Jlc3BvbnNlT3ZlcmxheS5lcnJvcidcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRGb3JtID0gdGhpcy5zdWJtaXRGb3JtLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRGb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3dTdWNjZXNzID0gdGhpcy5zaG93U3VjY2Vzcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvd0Vycm9yID0gdGhpcy5zaG93RXJyb3IuYmluZCh0aGlzKTtcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0UGF0aFByZWZpeCgpIHtcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKGRvY3VtZW50KS5vbignc3VibWl0JywgdGhpcy5zZWwuZm9ybSwgdGhpcy5zdWJtaXRGb3JtKTtcbiAgfVxuXG4gIHZhbGlkYXRlKCkge1xuICAgICQodGhpcy5zZWwuZm9ybSkuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgICQoaXRlbSkudmFsaWRhdGUoe1xuICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5pcygnc2VsZWN0JykpIHtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQucGFyZW50KCkpO1xuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5maW5kKCcuc2VsZWN0Ym94aXQtYnRuJykuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKGVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogKGxhYmVsKSA9PiB7XG4gICAgICAgICAgbGV0ICRwYXJlbnQgPSAkKGxhYmVsKS5wYXJlbnRzKCcuc3Vic2NyaWJlX19mb3JtRmllbGQnKTtcbiAgICAgICAgICBpZiAoJHBhcmVudC5maW5kKCdzZWxlY3QnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkcGFyZW50LmZpbmQoJy5zZWxlY3Rib3hpdC1idG4nKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc3VibWl0Rm9ybShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCAkZm9ybSA9ICQoZS50YXJnZXQpO1xuICAgIGxldCBmb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEoJGZvcm0pO1xuICAgICQucG9zdCh0aGlzLmdldFBhdGhQcmVmaXgoKSArICRmb3JtLmF0dHIoJ2FjdGlvbicpLCBmb3JtRGF0YSwgKGRhdGEpID0+IHtcbiAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ09LJykge1xuICAgICAgICB0aGlzLnNob3dTdWNjZXNzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNob3dFcnJvcigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0Rm9ybURhdGEoJGZvcm0pIHtcbiAgICBsZXQgdW5pbmRleGVkQXJyYXkgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xuICAgIGxldCBpbmRleGVkQXJyYXkgPSB7fTtcbiAgICAkLm1hcCh1bmluZGV4ZWRBcnJheSwgKG4pID0+IChpbmRleGVkQXJyYXlbbi5uYW1lXSA9IG4udmFsdWUpKTtcbiAgICByZXR1cm4gaW5kZXhlZEFycmF5O1xuICB9XG5cbiAgc2hvd1N1Y2Nlc3MoKSB7XG4gICAgJCh0aGlzLnNlbC5zdWNjZXNzT3ZlcmxheSkuYWRkQ2xhc3MoJ3N1YnNjcmliZVBhbmVsX19yZXNwb25zZU92ZXJsYXktLXNob3cnKTtcbiAgfVxuXG4gIHNob3dFcnJvcigpIHtcbiAgICAkKHRoaXMuc2VsLmVycm9yT3ZlcmxheSkuYWRkQ2xhc3MoJ3N1YnNjcmliZVBhbmVsX19yZXNwb25zZU92ZXJsYXktLXNob3cnKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgU3Vic2NyaWJlUGFuZWwoKTtcbiIsImNsYXNzIFRvYXN0IHtcbiAgY29uc3RydWN0b3IodGV4dCwgZHVyYXRpb24pIHtcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcbiAgICB0aGlzLmlkID0gJ18nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpO1xuXG4gICAgdGhpcy5zZXRUZXh0ID0gdGhpcy5zZXRUZXh0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zZXREdXJhdGlvbiA9IHRoaXMuc2V0RHVyYXRpb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3cgPSB0aGlzLnNob3cuYmluZCh0aGlzKTtcblxuICAgIGxldCB0b2FzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRvYXN0LnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLmlkKTtcbiAgICB0b2FzdC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RvYXN0Jyk7XG4gICAgbGV0IGlubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaW5uZXIuc2V0QXR0cmlidXRlKCdjbGFzcycsICdpbm5lcicpO1xuICAgIGlubmVyLmlubmVyVGV4dCA9IHRoaXMudGV4dDtcbiAgICB0b2FzdC5hcHBlbmRDaGlsZChpbm5lcik7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b2FzdCk7XG4gICAgdGhpcy4kdG9hc3QgPSAkKCcjJyArIHRoaXMuaWQpO1xuICB9XG5cbiAgc2V0VGV4dCh0ZXh0KSB7XG4gICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICB0aGlzLiR0b2FzdC5maW5kKCcuaW5uZXInKS50ZXh0KHRoaXMudGV4dCk7XG4gIH1cblxuICBzZXREdXJhdGlvbihkdXJhdGlvbikge1xuICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvbjtcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgdGhpcy4kdG9hc3QuYWRkQ2xhc3MoJ3Nob3cnKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy4kdG9hc3QucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcbiAgICB9LCB0aGlzLmR1cmF0aW9uKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUb2FzdDtcbiIsImNsYXNzIExvZ2luRm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgdXJsVG9rZW46ICcvbGlicy9ncmFuaXRlL2NzcmYvdG9rZW4uanNvbicsXG4gICAgICB1cmxSZWZyZXNoQ2hlY2s6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvcmVmcmVzaF90b2tlbi9pbmRleC5qc29uJyxcbiAgICAgIHVybEdldEFsbERldGFpbHM6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvZ2V0ZGV0YWlscy9pbmRleC5qc29uJyxcbiAgICAgIHVybFVwZGF0ZURldGFpbHM6ICcvYXBwcy9kaGwvZGlzY292ZXJkaGxhcGkvdXBkYXRlX2RldGFpbHMvaW5kZXguanNvbidcbiAgICB9O1xuXG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuc3RhbmRhcmRDb250ZW50LnVzZXItYWNjb3VudCwgLnBhZ2UtYm9keS51c2VyLWFjY291bnQnXG4gICAgfTtcblxuICAgIHRoaXMuZ2V0UGF0aFByZWZpeCA9IHRoaXMuZ2V0UGF0aFByZWZpeC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0UGF0aEhvbWUgPSB0aGlzLmdldFBhdGhIb21lLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWFkQ29va2llID0gdGhpcy5yZWFkQ29va2llLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnRyeVVwZGF0ZURldGFpbHMgPSB0aGlzLnRyeVVwZGF0ZURldGFpbHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNvbXBsZXRlVXBkYXRlRGV0YWlscyA9IHRoaXMuY29tcGxldGVVcGRhdGVEZXRhaWxzLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmxvZ2dlZEluID0gdGhpcy5sb2dnZWRJbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMubm90TG9nZ2VkSW4gPSB0aGlzLm5vdExvZ2dlZEluLmJpbmQodGhpcyk7XG4gIH1cblxuICBnZXRQYXRoUHJlZml4KCkge1xuICAgIGNvbnN0IHByZWZpeCA9ICQoJ2hlYWQgbWV0YVtuYW1lPVxcJ2RobC1wYXRoLXByZWZpeFxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiAnJyk7XG4gIH1cblxuICBnZXRQYXRoSG9tZSgpIHtcbiAgICBjb25zdCBob21lID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtaG9tZVxcJ10nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgcmV0dXJuIChob21lID8gaG9tZSA6ICcnKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKHdpbmRvdykub24oJ3VzZXJsb2dnZWRpbi5ESEwnLCAoZXZ0LCB0b2tlbkRhdGEpID0+IHtcbiAgICAgIHRoaXMubG9nZ2VkSW4odG9rZW5EYXRhKTtcbiAgICB9KTtcbiAgICAkKHdpbmRvdykub24oJ3VzZXJub3Rsb2dnZWRpbi5ESEwnLCAoKSA9PiB7XG4gICAgICB0aGlzLm5vdExvZ2dlZEluKCk7XG4gICAgfSk7XG5cbiAgICB2YXIgZm9ybSA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKCdmb3JtJyk7XG4gICAgaWYgKGZvcm0ubGVuZ3RoID4gMCkge1xuICAgICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ215QWNjb3VudEN1cnJlbnRQYXNzd29yZCcsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xuICAgICAgICB2YXIgJHBhcmVudCA9ICQoZWxlbWVudCkucGFyZW50cygnZm9ybScpO1xuICAgICAgICB2YXIgJGN1cnJlbnRQYXNzd29yZENvbnRhaW5lciA9ICRwYXJlbnQuZmluZCgnLnVzZXJhY2NvdW50LWN1cnJlbnRwYXNzd29yZCcpO1xuICAgICAgICB2YXIgJG5ld1Bhc3N3b3JkID0gJHBhcmVudC5maW5kKCdpbnB1dFtuYW1lPVwibXlBY2NvdW50X19uZXdQYXNzd29yZFwiXScpO1xuICAgICAgICB2YXIgJGNvbmZpcm1QYXNzd29yZCA9ICRwYXJlbnQuZmluZCgnaW5wdXRbbmFtZT1cIm15QWNjb3VudF9fY29uZmlybVBhc3N3b3JkXCJdJyk7XG5cbiAgICAgICAgcmV0dXJuICgoJG5ld1Bhc3N3b3JkLnZhbCgpID09PSAnJyAmJiAkY29uZmlybVBhc3N3b3JkLnZhbCgpID09PSAnJykgfHwgKCRjdXJyZW50UGFzc3dvcmRDb250YWluZXIuaXMoJzp2aXNpYmxlJykgJiYgJChlbGVtZW50KS52YWwoKSAhPT0gJycpKTtcbiAgICAgIH0sICdZb3UgbXVzdCBlbnRlciB5b3VyIGN1cnJlbnQgcGFzc3dvcmQnKTtcblxuICAgICAgalF1ZXJ5LnZhbGlkYXRvci5hZGRNZXRob2QoJ215QWNjb3VudFBhc3N3b3JkJywgKHZhbHVlLCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmICgkKGVsZW1lbnQpLnZhbCgpID09PSAnJykgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKC9eKD89LipbYS16XSkoPz0uKltBLVpdKSg/PS4qXFxkKSg/PS4qW19cXFddKVtBLVphLXpcXGRfXFxXXXs4LH0kLykudGVzdCh2YWx1ZSk7XG4gICAgICB9LCAnUGFzc3dvcmQgZm9ybWF0IGlzIG5vdCB2YWxpZCcpO1xuXG4gICAgICBqUXVlcnkudmFsaWRhdG9yLmFkZE1ldGhvZCgnbXlBY2NvdW50RXF1YWxUbycsICh2YWx1ZSwgZWxlbWVudCkgPT4ge1xuICAgICAgICByZXR1cm4gKCQoJyMnICsgJChlbGVtZW50KS5hdHRyKCdkYXRhLWVxdWFsVG8nKSkudmFsKCkgPT09ICQoZWxlbWVudCkudmFsKCkpO1xuICAgICAgfSwgJ1Bhc3N3b3JkcyBkbyBub3QgbWF0Y2gnKTtcblxuICAgICAgZm9ybS52YWxpZGF0ZSh7XG4gICAgICAgIHJ1bGVzOiB7XG4gICAgICAgICAgbXlBY2NvdW50X19jdXJyZW50UGFzc3dvcmQ6ICdteUFjY291bnRDdXJyZW50UGFzc3dvcmQnLFxuICAgICAgICAgIG15QWNjb3VudF9fbmV3UGFzc3dvcmQ6ICdteUFjY291bnRQYXNzd29yZCcsXG4gICAgICAgICAgbXlBY2NvdW50X19jb25maXJtUGFzc3dvcmQ6ICdteUFjY291bnRFcXVhbFRvJ1xuICAgICAgICB9LFxuICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQuYXR0cigndHlwZScpID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpLmZpbmQoJ2xhYmVsJykpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkuYXBwZW5kKGVycm9yKTtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdzZWFyY2gnKSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcigkKGVsZW1lbnQpLnBhcmVudCgpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzdWJtaXRIYW5kbGVyOiAoZm9ybUVsZW1lbnQpID0+IHtcbiAgICAgICAgICB0aGlzLnRyeVVwZGF0ZURldGFpbHMoZm9ybUVsZW1lbnQpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVhZENvb2tpZShuYW1lKSB7XG4gICAgdmFyIG5hbWVFUSA9IG5hbWUgKyAnPSc7XG4gICAgdmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGMgPSBjYVtpXTtcbiAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xuICAgICAgaWYgKGMuaW5kZXhPZihuYW1lRVEpID09PSAwKSByZXR1cm4gYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdHJ5VXBkYXRlRGV0YWlscyhmb3JtKSB7XG4gICAgdmFyIGZybSA9ICQoZm9ybSk7XG4gICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcbiAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xuXG4gICAgdmFyIGNvb2tpZSA9IHRoaXMucmVhZENvb2tpZSgnREhMLkF1dGhUb2tlbicpO1xuICAgIGlmIChjb29raWUgIT09IG51bGwpIHtcbiAgICAgIHZhciBzcGxpdCA9IGNvb2tpZS5zcGxpdCgnfCcpO1xuICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XG4gICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxHZXRBbGxEZXRhaWxzLFxuICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogc3BsaXRbMF0sIHRva2VuOiBzcGxpdFsxXSB9LFxuICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChhbGxEZXRhaWxzUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgYWxsRGV0YWlsc1Jlc3BvbnNlLCB0cnVlIF0pO1xuICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGV0ZVVwZGF0ZURldGFpbHMoZm9ybSwgYWxsRGV0YWlsc1Jlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byB1cGRhdGUgeW91ciBkZXRhaWxzICgxKS4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDIpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDMpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZWZyZXNoQ29va2llID0gdGhpcy5yZWFkQ29va2llKCdESEwuUmVmcmVzaFRva2VuJyk7XG4gICAgICBpZiAocmVmcmVzaENvb2tpZSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgcmVmcmVzaFNwbGl0ID0gcmVmcmVzaENvb2tpZS5zcGxpdCgnfCcpO1xuICAgICAgICBpZiAocmVmcmVzaFNwbGl0Lmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFJlZnJlc2hDaGVjayxcbiAgICAgICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogcmVmcmVzaFNwbGl0WzBdLCByZWZyZXNoX3Rva2VuOiByZWZyZXNoU3BsaXRbMV0gfSxcbiAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDU1JGLVRva2VuJzogY3NyZnRva2VuIH0sXG4gICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZWZyZXNoUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFJlc3BvbnNlLnN0YXR1cyA9PT0gJ29rJykge1xuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgcmVmcmVzaFJlc3BvbnNlLCB0cnVlIF0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyeVVwZGF0ZURldGFpbHMoZm9ybSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMgKDQpLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoNSkuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscyAoNikuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBlbnRlciB0aGUgY29tcGV0aXRpb24uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb21wbGV0ZVVwZGF0ZURldGFpbHMoZm9ybSwgZGV0YWlscykge1xuICAgIHZhciBmcm0gPSAkKGZvcm0pO1xuXG4gICAgdmFyIG5ld2VtYWlsID0gZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fZW1haWwnKS52YWwoKTtcbiAgICBpZiAobmV3ZW1haWwudHJpbSgpID09PSBkZXRhaWxzLnJlZ2lzdHJhdGlvbl9lbWFpbCkge1xuICAgICAgbmV3ZW1haWwgPSAnJztcbiAgICB9XG5cbiAgICB2YXIgY2F0ZWdvcmllcyA9ICcnO1xuICAgIGZybS5maW5kKCcjZ2xiLXlvdXJhY2NvdW50LWNhdGVnb3JpZXMgaW5wdXQ6Y2hlY2tlZCcpLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XG4gICAgICBpZiAoY2F0ZWdvcmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNhdGVnb3JpZXMgKz0gJywnO1xuICAgICAgfVxuICAgICAgY2F0ZWdvcmllcyArPSAkKGl0ZW0pLnZhbCgpO1xuICAgIH0pO1xuXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICB0b2tlbjogZGV0YWlscy50b2tlbixcblxuICAgICAgZmlyc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19maXJzdE5hbWUnKS52YWwoKSxcbiAgICAgIGxhc3RuYW1lOiBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19sYXN0TmFtZScpLnZhbCgpLFxuICAgICAgdXNlcm5hbWU6IGRldGFpbHMucmVnaXN0cmF0aW9uX2VtYWlsLFxuICAgICAgbmV3dXNlcm5hbWU6IG5ld2VtYWlsLFxuXG4gICAgICBwYXNzd29yZDogZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fY3VycmVudFBhc3N3b3JkJykudmFsKCksXG4gICAgICBuZXdwYXNzd29yZDogZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fbmV3UGFzc3dvcmQnKS52YWwoKSxcblxuICAgICAgcG9zaXRpb246IGZybS5maW5kKCdpbnB1dCNteUFjY291bnRfX3Bvc2l0aW9uJykudmFsKCksXG4gICAgICBjb250YWN0OiBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19waG9uZU51bWJlcicpLnZhbCgpLFxuICAgICAgc2l6ZTogZnJtLmZpbmQoJ3NlbGVjdCNteUFjY291bnRfX2J1c2luZXNzU2l6ZScpLnZhbCgpLFxuICAgICAgc2VjdG9yOiBmcm0uZmluZCgnc2VsZWN0I215QWNjb3VudF9fYnVzaW5lc3NTZWN0b3InKS52YWwoKSxcblxuICAgICAgdGNhZ3JlZTogZnJtLmZpbmQoJ2lucHV0I2NoZWNrYm94SWRUQ01lc3NhZ2UnKS5pcygnOmNoZWNrZWQnKSxcblxuICAgICAgY2F0czogY2F0ZWdvcmllc1xuICAgIH07XG5cbiAgICBpZiAoKCQudHJpbShkYXRhLmZpcnN0bmFtZSkubGVuZ3RoID09PSAwKSB8fCAoJC50cmltKGRhdGEubGFzdG5hbWUpLmxlbmd0aCA9PT0gMCkgfHwgKCQudHJpbShkYXRhLnVzZXJuYW1lKS5sZW5ndGggPT09IDApKSB7XG4gICAgICBhbGVydCgnUGxlYXNlIGVudGVyIHlvdXIgbmFtZSwgZW1haWwgYWRkcmVzcyBhbmQgcGVyc29uYWwgZGV0YWlscy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J10udXBkYXRlLWJ0blwiKS50ZXh0KCdwbGVhc2Ugd2FpdC4uLicpO1xuICAgICAgZnJtLmZpbmQoJ2lucHV0LmZvcm1zX19jdGEtLXJlZCcpLnZhbCgncGxlYXNlIHdhaXQuLi4nKTtcblxuICAgICAgJC5nZXQodGhpcy5nZXRQYXRoUHJlZml4KCkgKyB0aGlzLmNvbmZpZy51cmxUb2tlbiwgKHRva2VucmVzcG9uc2UpID0+IHtcbiAgICAgICAgdmFyIGNzcmZ0b2tlbiA9IHRva2VucmVzcG9uc2UudG9rZW47XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybFVwZGF0ZURldGFpbHMsXG4gICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgaGVhZGVyczogeyAnQ1NSRi1Ub2tlbic6IGNzcmZ0b2tlbiB9LFxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgc3VjY2VzczogKHVwZGF0ZURldGFpbHNSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHVwZGF0ZURldGFpbHNSZXNwb25zZSkge1xuICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgdXBkYXRlRGV0YWlsc1Jlc3BvbnNlLCB0cnVlIF0pO1xuXG4gICAgICAgICAgICAgIGlmICh1cGRhdGVEZXRhaWxzUmVzcG9uc2Uuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICAgICAgZnJtLmZpbmQoJy5teUFjY291bnRfX21lc3NhZ2UnKS5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5uZXdwYXNzd29yZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19lbWFpbCcpLnJlbW92ZUF0dHIoJ3JlYWRvbmx5Jyk7XG4gICAgICAgICAgICAgICAgICBmcm0uZmluZCgnLnVzZXJhY2NvdW50LWN1cnJlbnRwYXNzd29yZCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fY3VycmVudFBhc3N3b3JkJykudmFsKCcnKTtcbiAgICAgICAgICAgICAgICBmcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19uZXdQYXNzd29yZCcpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgZnJtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fY29uZmlybVBhc3N3b3JkJykudmFsKCcnKTtcblxuICAgICAgICAgICAgICAgICQoJ2hlYWRlciAuaGVhZGVyX19hdXRoLS1sb2dnZWRpbiAudXNlci1maXJzdG5hbWUnKS50ZXh0KGRhdGEuZmlyc3RuYW1lKTtcbiAgICAgICAgICAgICAgICAkKCcuY29tcGV0aXRpb25EYXRhQ2FwdHVyZS5sb2dnZWQtaW4gLmxvZ2dlZGluLW5hbWUnKS50ZXh0KGRhdGEuZmlyc3RuYW1lKTtcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKDApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIHVwZGF0ZSB5b3VyIGRldGFpbHMuXFxuJyArIHVwZGF0ZURldGFpbHNSZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFsZXJ0KCdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkIHdoaWxlIGF0dGVtcHRpbmcgdG8gdXBkYXRlIHlvdXIgZGV0YWlscy4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnJtLmZpbmQoXCJidXR0b25bdHlwZT0nc3VibWl0J10udXBkYXRlLWJ0blwiKS50ZXh0KCdVcGRhdGUnKTtcbiAgICAgICAgICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ1VwZGF0ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmcm0uZmluZChcImJ1dHRvblt0eXBlPSdzdWJtaXQnXS51cGRhdGUtYnRuXCIpLnRleHQoJ1VwZGF0ZScpO1xuICAgIGZybS5maW5kKCdpbnB1dC5mb3Jtc19fY3RhLS1yZWQnKS52YWwoJ1VwZGF0ZScpO1xuICB9XG5cbiAgbG9nZ2VkSW4odG9rZW5EYXRhKSB7XG4gICAgaWYgKHRva2VuRGF0YSAmJiB0b2tlbkRhdGEuc3RhdHVzICYmIHRva2VuRGF0YS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdGhpcy5jb25maWcudXJsVG9rZW4sICh0b2tlbnJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHZhciBjc3JmdG9rZW4gPSB0b2tlbnJlc3BvbnNlLnRva2VuO1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgdXJsOiB0aGlzLmdldFBhdGhQcmVmaXgoKSArIHRoaXMuY29uZmlnLnVybEdldEFsbERldGFpbHMsXG4gICAgICAgICAgZGF0YTogeyB1c2VybmFtZTogdG9rZW5EYXRhLnVzZXJuYW1lLCB0b2tlbjogdG9rZW5EYXRhLnRva2VuIH0sXG4gICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgIGhlYWRlcnM6IHsgJ0NTUkYtVG9rZW4nOiBjc3JmdG9rZW4gfSxcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgIHN1Y2Nlc3M6IChhbGxEZXRhaWxzUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZS5zdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50Rm9ybSA9ICQodGhpcy5zZWwuY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignY2hlY2thdXRodG9rZW5zLkRITCcsIFsgYWxsRGV0YWlsc1Jlc3BvbnNlLCB0cnVlIF0pO1xuXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCcubG9nZ2VkaW4tdXNlcm5hbWUnKS50ZXh0KGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fZmlyc3RuYW1lKTtcblxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19maXJzdE5hbWUnKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9maXJzdG5hbWUpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnaW5wdXQjbXlBY2NvdW50X19sYXN0TmFtZScpLnZhbChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX2xhc3RuYW1lKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fZW1haWwnKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9lbWFpbCk7XG5cbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fcG9zaXRpb24nKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCdpbnB1dCNteUFjY291bnRfX3Bob25lTnVtYmVyJykudmFsKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fY29udGFjdCk7XG5cbiAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ3NlbGVjdCNteUFjY291bnRfX2J1c2luZXNzU2l6ZScpLnZhbChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX3NpemUpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnc2VsZWN0I215QWNjb3VudF9fYnVzaW5lc3NTZWN0b3InKS52YWwoYWxsRGV0YWlsc1Jlc3BvbnNlLnJlZ2lzdHJhdGlvbl9zZWN0b3IpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fdGNhZ3JlZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I2NoZWNrYm94SWRUQ01lc3NhZ2UnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uZmluZCgnaW5wdXQjY2hlY2tib3hJZFRDTWVzc2FnZScpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCcjZ2xiLXlvdXJhY2NvdW50LWNhdGVnb3JpZXMgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB2YXIgY2F0ZWdvcmllcyA9IGFsbERldGFpbHNSZXNwb25zZS5yZWdpc3RyYXRpb25fY2F0cy5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2F0ZWdvcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCcjZ2xiLXlvdXJhY2NvdW50LWNhdGVnb3JpZXMgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdW3ZhbHVlPVwiJyArIGNhdGVnb3JpZXNbaV0gKyAnXCJdJykucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2UucmVnaXN0cmF0aW9uX2lzbGlua2VkaW4gPT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChhbGxEZXRhaWxzUmVzcG9uc2UuZnVsbCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5maW5kKCcudXNlcmFjY291bnQtY3VycmVudHBhc3N3b3JkJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjb21wb25lbnRGb3JtLmZpbmQoJ2lucHV0I215QWNjb3VudF9fZW1haWwnKS5hdHRyKCdyZWFkb25seScsICdyZWFkb25seScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEZvcm0uY2xvc2VzdCgnLnBhZ2UtYm9keS13cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ2F3YWl0aW5nJyk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50Rm9ybS5zaG93KCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgYXR0ZW1wdGluZyB0byBkaXNwbGF5IHlvdXIgZGV0YWlscy4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlcicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhbGVydCgnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSBhdHRlbXB0aW5nIHRvIGRpc3BsYXkgeW91ciBkZXRhaWxzLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5vdExvZ2dlZEluKCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuaGFzQ2xhc3MoJ25vLXJlZGlyZWN0JykpIHtcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMuZ2V0UGF0aEhvbWUoKSArICcuaHRtbCc7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBMb2dpbkZvcm0oKTtcblxuIiwiLy8gSW1wb3J0IGNvbXBvbmVudHNcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi9Db21wb25lbnRzL0hlYWRlcic7XG5pbXBvcnQgQm9vdHN0cmFwQ2Fyb3VzZWwgZnJvbSAnLi9Db21wb25lbnRzL0Jvb3RzdHJhcENhcm91c2VsJztcbmltcG9ydCBBcnRpY2xlR3JpZCBmcm9tICcuL0NvbXBvbmVudHMvQXJ0aWNsZUdyaWQnO1xuaW1wb3J0IFN1YnNjcmliZVBhbmVsIGZyb20gJy4vQ29tcG9uZW50cy9TdWJzY3JpYmVQYW5lbCc7XG5pbXBvcnQgUGFzc3dvcmQgZnJvbSAnLi9Db21wb25lbnRzL1Bhc3N3b3JkJztcbmltcG9ydCBQYXNzd29yZFZhbGlkaXR5IGZyb20gJy4vQ29tcG9uZW50cy9QYXNzd29yZFZhbGlkaXR5JztcbmltcG9ydCBGb3JtVmFsaWRhdGlvbiBmcm9tICcuL0NvbXBvbmVudHMvRm9ybVZhbGlkYXRpb24nO1xuaW1wb3J0IFNob3dIaWRlIGZyb20gJy4vQ29tcG9uZW50cy9TaG93SGlkZSc7XG5pbXBvcnQgQ29va2llQmFubmVyIGZyb20gJy4vQ29tcG9uZW50cy9Db29raWVCYW5uZXInO1xuaW1wb3J0IFNlYXJjaEZvcm0gZnJvbSAnLi9Db21wb25lbnRzL1NlYXJjaEZvcm0nO1xuaW1wb3J0IEVjb21Gb3JtcyBmcm9tICcuL0NvbXBvbmVudHMvRWNvbUZvcm1zJztcbmltcG9ydCBTaGlwRm9ybSBmcm9tICcuL0NvbXBvbmVudHMvU2hpcEZvcm0nO1xuaW1wb3J0IElFRGV0ZWN0b3IgZnJvbSAnLi9Db21wb25lbnRzL0lFRGV0ZWN0b3InO1xuaW1wb3J0IFNvY2lhbCBmcm9tICcuL0NvbXBvbmVudHMvU29jaWFsJztcbmltcG9ydCBIZXJvIGZyb20gJy4vQ29tcG9uZW50cy9IZXJvJztcbmltcG9ydCBBdXRoZW50aWNhdGlvbkV2ZW50cyBmcm9tICcuL0NvbXBvbmVudHMvQXV0aGVudGljYXRpb25FdmVudHMnO1xuaW1wb3J0IERlbGV0ZUFjY291bnRGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9EZWxldGVBY2NvdW50Rm9ybSc7XG5pbXBvcnQgTG9naW5Gb3JtIGZyb20gJy4vQ29tcG9uZW50cy9Mb2dpbkZvcm0nO1xuaW1wb3J0IFBhc3N3b3JkUmVtaW5kZXJGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9QYXNzd29yZFJlbWluZGVyRm9ybSc7XG5pbXBvcnQgUmVnaXN0ZXJGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9SZWdpc3RlckZvcm0nO1xuaW1wb3J0IFlvdXJBY2NvdW50Rm9ybSBmcm9tICcuL0NvbXBvbmVudHMvWW91ckFjY291bnRGb3JtJztcbmltcG9ydCBTaGlwTm93Rm9ybSBmcm9tICcuL0NvbXBvbmVudHMvU2hpcE5vd0Zvcm0nO1xuaW1wb3J0IFNoaXBOb3dUd29TdGVwRm9ybSBmcm9tICcuL0NvbXBvbmVudHMvU2hpcE5vd1R3b1N0ZXBGb3JtJztcbmltcG9ydCBDb21wZXRpdGlvbkZvcm0gZnJvbSAnLi9Db21wb25lbnRzL0NvbXBldGl0aW9uRm9ybSc7XG5pbXBvcnQgU2VydmljZVdvcmtlciBmcm9tICcuL0NvbXBvbmVudHMvU2VydmljZVdvcmtlcic7XG5pbXBvcnQgT2ZmbGluZSBmcm9tICcuL0NvbXBvbmVudHMvT2ZmbGluZSc7XG5pbXBvcnQgTGFuZGluZ1BvaW50cyBmcm9tICcuL0NvbXBvbmVudHMvTGFuZGluZ1BvaW50cyc7XG5pbXBvcnQgQmFja0J1dHRvbiBmcm9tICcuL0NvbXBvbmVudHMvQmFja0J1dHRvbic7XG5pbXBvcnQgQXJ0aWNsZUNvdW50ZXIgZnJvbSAnLi9Db21wb25lbnRzL0FydGljbGVDb3VudGVyJztcbmltcG9ydCBNYXJrZXRvRm9ybSBmcm9tICcuL0NvbXBvbmVudHMvTWFya2V0b0Zvcm0nO1xuaW1wb3J0IExhbmd1YWdlRGV0ZWN0IGZyb20gJy4vQ29tcG9uZW50cy9MYW5ndWFnZURldGVjdCc7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcbiAgdHJ5IHtcbiAgICBkb2N1bWVudC5jcmVhdGVFdmVudCgnVG91Y2hFdmVudCcpO1xuICAgICQoJ2JvZHknKS5hZGRDbGFzcygndG91Y2gnKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIG5vdGhpbmdcbiAgfVxuICBpZiAoKHdpbmRvdy5tYXRjaE1lZGlhKCcoZGlzcGxheS1tb2RlOiBzdGFuZGFsb25lKScpLm1hdGNoZXMpIHx8ICh3aW5kb3cubmF2aWdhdG9yLnN0YW5kYWxvbmUpKSAkKCdodG1sJykuYWRkQ2xhc3MoJ3B3YScpO1xuICAvLyBJbml0aWF0ZSBjb21wb25lbnRzXG4gIExhbmd1YWdlRGV0ZWN0LmluaXQoKTtcbiAgLy8gQXJ0aWNsZUNvdW50ZXIuaW5pdCgpO1xuICBJRURldGVjdG9yLmluaXQoKTtcbiAgSGVhZGVyLmluaXQoKTtcbiAgQm9vdHN0cmFwQ2Fyb3VzZWwuaW5pdCgpO1xuICBBcnRpY2xlR3JpZC5pbml0KCk7XG4gIFN1YnNjcmliZVBhbmVsLmluaXQoKTtcbiAgUGFzc3dvcmQuaW5pdCgpO1xuICBQYXNzd29yZFZhbGlkaXR5LmluaXQoKTtcbiAgLy8gRm9ybVZhbGlkYXRpb24uaW5pdCgpO1xuICBTaG93SGlkZS5pbml0KCk7XG4gIENvb2tpZUJhbm5lci5pbml0KCk7XG4gIFNlYXJjaEZvcm0uaW5pdCgpO1xuICBFY29tRm9ybXMuaW5pdCgpO1xuICBTaGlwRm9ybS5pbml0KCk7XG4gIFNvY2lhbC5pbml0KCk7XG4gIEhlcm8uaW5pdCgpO1xuICBDb21wZXRpdGlvbkZvcm0uaW5pdCgpO1xuICBTaGlwTm93Rm9ybS5pbml0KCk7XG4gIFNoaXBOb3dUd29TdGVwRm9ybS5pbml0KCk7XG4gIFlvdXJBY2NvdW50Rm9ybS5pbml0KCk7XG4gIFJlZ2lzdGVyRm9ybS5pbml0KCk7XG4gIFBhc3N3b3JkUmVtaW5kZXJGb3JtLmluaXQoKTtcbiAgTG9naW5Gb3JtLmluaXQoKTtcbiAgRGVsZXRlQWNjb3VudEZvcm0uaW5pdCgpO1xuICBBdXRoZW50aWNhdGlvbkV2ZW50cy5pbml0KCk7XG4gIFNlcnZpY2VXb3JrZXIuaW5pdCgpO1xuICBPZmZsaW5lLmluaXQoKTtcbiAgTGFuZGluZ1BvaW50cy5pbml0KCk7XG4gIEJhY2tCdXR0b24uaW5pdCgpO1xuICBNYXJrZXRvRm9ybS5pbml0KCk7XG59KTtcbiJdfQ==
