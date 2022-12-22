(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
var form = document.querySelector('.form');
var secondForm = document.querySelector('.animatedForm__secondForm');
var btn = document.getElementById('submit');

  btn.addEventListener('click', () => {
    form.style.display = 'none';
    secondForm.style.display = 'block';

});
*/
"use strict";

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimatedPagesHero = function () {
  function AnimatedPagesHero() {
    _classCallCheck(this, AnimatedPagesHero);

    this.sel = {
      component: '.animatedPagesHero',
      van: '.animatedPagesHero__van',
      animationGif: '.animatedPagesHero__consumerGif',
      video: '.animatedPagesHero__video'
    };

    this.bindEvents = this.bindEvents.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.preload = this.preload.bind(this);
    this.init = this.init.bind(this);
  }

  _createClass(AnimatedPagesHero, [{
    key: 'bindEvents',
    value: function bindEvents() {
      document.addEventListener('scroll', this.handleScroll, { passive: true });
    }
  }, {
    key: 'preload',
    value: function preload() {
      var _this = this;

      if ($(this.sel.animationGif).length <= 0) return;
      var gif = new Image();
      gif.onload = function () {
        $(_this.sel.animationGif).attr('src', $(_this.sel.animationGif).attr('data-src'));
        $(_this.sel.component).addClass('animatedPagesHero--loaded');
      };
      gif.src = $(this.sel.animationGif).attr('data-src');
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll() {
      if ($(document).scrollTop() > 0) {
        $(this.sel.van).addClass('animatedPagesHero__van--out');
      }
    }
  }, {
    key: 'init',
    value: function init() {
      setTimeout(this.bindEvents, 5160);
      this.preload();
    }
  }]);

  return AnimatedPagesHero;
}();

exports.default = new AnimatedPagesHero();

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimatedParallax = function () {
  function AnimatedParallax() {
    _classCallCheck(this, AnimatedParallax);

    this.sel = {
      component: '.parallaxSection',
      tiles: '.parallaxSection__tile:not(.parallaxSection__tile--noParallax)'
    };
    this.tiles = [];

    this.bindEvents = this.bindEvents.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.getTiles = this.getTiles.bind(this);
    this.init = this.init.bind(this);
  }

  _createClass(AnimatedParallax, [{
    key: 'bindEvents',
    value: function bindEvents() {
      document.addEventListener('scroll', this.handleScroll, { passive: true });
      $(window).on('stop.resize', this.handleScroll);
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll() {
      var scrollPosition = $(window).scrollTop() + window.innerHeight;
      var visibleTiles = [];
      for (var i = 0; i < this.tiles.length; i++) {
        var tile = this.tiles[i];
        if (tile.offsetTop < scrollPosition) {
          visibleTiles.push(tile);
        }
      }
      for (var _i = 0; _i < visibleTiles.length; _i++) {
        var _tile = visibleTiles[_i];
        var multiplier = _tile.$tile.hasClass('parallaxSection__tile--fastParallax') ? 0.6 : 0.3;
        var multiplierOverride = _tile.$tile.attr('data-multiplier');
        if (multiplierOverride !== undefined) {
          multiplier = multiplierOverride;
        }

        var parallaxDivider = window.innerWidth < 768 ? 4 : 2;
        var parallaxOffset = (_tile.offsetTop - $(window).scrollTop()) * multiplier;
        if (_tile.$tile.hasClass('parallaxSection__tile--down')) {
          parallaxOffset = (window.innerHeight + $(window).scrollTop() - (_tile.offsetTop + _tile.height)) * multiplier;
        }

        var newTop = _tile.originalTop + parallaxOffset / parallaxDivider;
        var maxTop = _tile.$tile.attr('data-max-top');
        var minTop = _tile.$tile.attr('data-min-top');

        if (minTop !== undefined && newTop <= minTop) {
          newTop = minTop;
        }

        if (maxTop != undefined && newTop >= maxTop) {
          newTop = maxTop;
        }

        _tile.$tile.css('top', newTop + 'px');
      }
    }
  }, {
    key: 'getTiles',
    value: function getTiles() {
      var _this = this;

      $(this.sel.tiles).each(function (index, element) {
        var $tile = $(element);
        var topPosition = parseInt($tile.css('top'), 10);
        var offsetTop = $tile.offset().top;
        _this.tiles.push({
          $tile: $tile,
          originalTop: topPosition,
          offsetTop: offsetTop,
          height: $tile.outerHeight()
        });
      });
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return;
      this.getTiles();
      this.handleScroll();
      this.bindEvents();
    }
  }]);

  return AnimatedParallax;
}();

exports.default = new AnimatedParallax();

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowcasePanel = function () {
  function ShowcasePanel($element) {
    _classCallCheck(this, ShowcasePanel);

    this.$element = $element;
    this.sel = {
      carousel: '.animatedShowcasePanel__carousel',
      items: '.animatedShowcasePanel__carouselItem',
      stackedItems: '.animatedShowcasePanel__carouselItem:not(.animatedShowcasePanel__carouselItem--hidden)',
      navigation: '.animatedShowcasePanel__carouselNavigation',
      navigationItem: '.animatedShowcasePanel__carouselNavigationItem'
    };

    this.bindEvents = this.bindEvents.bind(this);
    this.doHide = this.doHide.bind(this);
    this.doShow = this.doShow.bind(this);
    this.showItem = this.showItem.bind(this);
    this.scaleItems = this.scaleItems.bind(this);
    this.createNavigation = this.createNavigation.bind(this);
    this.init = this.init.bind(this);
    this.init();
  }

  _createClass(ShowcasePanel, [{
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      this.$element.find(this.sel.items).swipe({
        swipe: function swipe(event, direction) {
          var $item = $(event.target).hasClass('animatedShowcasePanel__carouselItem') ? $(event.target) : $(event.target).parents(_this.sel.items);
          var index = $item.index();
          if (direction === 'left') {
            _this.showItem(index + 1);
          } else if (direction === 'right') {
            _this.showItem(index - 1);
          }
        },
        allowPageScroll: 'vertical'
      });
      this.$element.on('click', this.sel.navigationItem, function (e) {
        e.preventDefault();
        _this.showItem($(e.target).index());
      });
    }
  }, {
    key: 'doHide',
    value: function doHide($item) {
      $item.addClass('animatedShowcasePanel__carouselItem--hidden');
      setTimeout(function () {
        $item.hide();
      }, 250);
      this.scaleItems();
    }
  }, {
    key: 'doShow',
    value: function doShow($item) {
      var _this2 = this;

      $item.show(function () {
        $item.removeClass('animatedShowcasePanel__carouselItem--hidden');
        _this2.scaleItems();
      });
    }
  }, {
    key: 'showItem',
    value: function showItem(index) {
      // Index can't be less than 0
      index = Math.max(index, 0);
      // Index can't be more than the number of items
      index = Math.min(index, this.$element.find(this.sel.items).length - 1);
      // Find the current position
      var currentIndex = this.$element.find(this.sel.stackedItems).first().index();
      // Get the number of items to move
      var offset = currentIndex - index;
      // Loop the number of the offset
      for (var i = 0; i < Math.abs(offset); i++) {
        // The action to etheir show or hide depending on direction
        var action = this.doHide;
        // The item index depending on direction
        var itemIndex = currentIndex + i;
        // If should be showing items
        if (offset > 0) {
          // Change action
          action = this.doShow;
          // Change index
          itemIndex = currentIndex - (i + 1);
        }
        // Get the item at the index
        var $item = this.$element.find(this.sel.items).eq(itemIndex);
        // Run the action with a timeout
        setTimeout(action, 250 * i, $item);
      }
      // Remove active navigation item
      this.$element.find(this.sel.navigation).find('.active').removeClass('active');
      // Set the correct nagivation item to active
      this.$element.find(this.sel.navigationItem).eq(index).addClass('active');
    }
  }, {
    key: 'scaleItems',
    value: function scaleItems() {
      this.$element.find(this.sel.stackedItems).each(function (index, element) {
        var $item = $(element);
        // No transform for first item
        if (index === 0) {
          $item.css('transform', 'none');
          return;
        }
        // Calculate the scale, 5% smaller for each item
        var scale = 1 - 0.05 * index;
        // Calculate how far to move the item right, should be 15px but needs to account for scale
        var translate = parseInt(15 * (1 + 0.05 * index), 10) * index;
        // Update the item
        $item.css('transform', 'scale(' + scale + ') translateX(' + translate + 'px)');
      });
      // Add ready class to carousel
      this.$element.find(this.sel.carousel).addClass('animatedShowcasePanel__carousel--ready');
    }
  }, {
    key: 'createNavigation',
    value: function createNavigation() {
      if (this.$element.find(this.sel.navigation).length > 0) return;
      var navItems = '';
      this.$element.find(this.sel.items).each(function (index) {
        navItems += '<li class="animatedShowcasePanel__carouselNavigationItem' + (index === 0 ? ' active' : '') + '"></li>';
      });
      this.$element.find(this.sel.carousel).after('<ol class="animatedShowcasePanel__carouselNavigation">' + navItems + '</ol>');
    }
  }, {
    key: 'init',
    value: function init() {
      this.bindEvents();
      this.createNavigation();
      this.scaleItems();
    }
  }]);

  return ShowcasePanel;
}();

var AnimatedShowcasePanel = function () {
  function AnimatedShowcasePanel() {
    _classCallCheck(this, AnimatedShowcasePanel);

    this.sel = {
      component: '.animatedShowcasePanel'
    };
    this.panels = [];

    this.init = this.init.bind(this);
  }

  _createClass(AnimatedShowcasePanel, [{
    key: 'init',
    value: function init() {
      var _this3 = this;

      if ($(this.sel.component).length <= 0) return;
      // For each component, create a showcase panel
      $(this.sel.component).each(function (index, element) {
        return _this3.panels.push(new ShowcasePanel($(element)));
      });
    }
  }]);

  return AnimatedShowcasePanel;
}();

exports.default = new AnimatedShowcasePanel();

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CarouselRow = function () {
  function CarouselRow() {
    _classCallCheck(this, CarouselRow);

    this.sel = {
      component: '.carouselRow',
      carousel: '.carouselRow__carousel',
      arrowNext: '.carouselRow .arrowNext',
      arrowPrev: '.carouselRow .arrowPrev'
    };
    this.carousel = null;

    this.bindEvents = this.bindEvents.bind(this);
    this.initCarousel = this.initCarousel.bind(this);
    this.init = this.init.bind(this);
  }

  _createClass(CarouselRow, [{
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      $(document).on('click', this.sel.arrowNext, function (e) {
        e.preventDefault();
        _this.carousel.next();
      });
      $(document).on('click', this.sel.arrowPrev, function (e) {
        e.preventDefault();
        _this.carousel.prev();
      });
      $(this.sel.carousel).swipe({
        swipe: function swipe(event, direction) {
          if (direction === 'left') {
            _this.carousel.next();
          } else if (direction === 'right') {
            _this.carousel.prev();
          }
        },
        allowPageScroll: 'vertical'
      });
    }
  }, {
    key: 'initCarousel',
    value: function initCarousel() {
      this.carousel = $(this.sel.carousel).waterwheelCarousel({
        flankingItems: 1,
        opacityMultiplier: 1,
        separation: 90
        /*movingToCenter: ($item) => {
          console.log('movingToCenter', $item);
        },
        movedToCenter: ($item) => {
          console.log('movedToCenter', $item);
        },
        movingFromCenter: ($item) => {
          console.log('movingFromCenter', $item);
        },
        movedFromCenter: ($item) => {
          console.log('movedFromCenter', $item);
        },
        clickedCenter: ($item) => {
          console.log('clickedCenter', $item);
        }*/
      });
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return;
      this.bindEvents();
      this.initCarousel();
    }
  }]);

  return CarouselRow;
}();

exports.default = new CarouselRow();

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Counter = function () {
  function Counter($element) {
    _classCallCheck(this, Counter);

    this.$element = $element;
    this.sel = {
      stats: '.statsPanel__statsValue',
      trigger: '.statsPanel__wrapper',
      productFill: '.boxFill'
    };
    this.animations = [];
    this.isAnimated = false;

    this.countUp = this.countUp.bind(this);
    this.runAnimations = this.runAnimations.bind(this);
    this.handleScrollOut = this.handleScrollOut.bind(this);

    this.countUp();
  }

  _createClass(Counter, [{
    key: 'countUp',
    value: function countUp() {
      var $stats = this.$element.find(this.sel.stats);
      var settings = {
        duration: parseInt(this.$element.attr('data-duration'), 10) || 2,
        separator: this.$element.attr('data-separator') || '',
        decimal: this.$element.attr('data-decimal') || '.'
      };
      var counts = [];

      $stats.each(function (index, element) {
        var start = parseFloat($(element).attr('data-start')) || 0;
        var end = parseFloat($(element).attr('data-end'));
        var decimals = parseInt($(element).attr('data-decimals'), 10) || 0;
        var prefix = $(element).attr('data-prefix') || '';
        var suffix = $(element).attr('data-suffix') || '';
        var duration = parseFloat($(element).attr('data-duration')) || settings.duration;

        counts.push({
          el: $(element)[0],
          start: start,
          end: end,
          decimals: decimals,
          duration: duration,
          options: {
            prefix: prefix,
            suffix: suffix
          }
        });
      });

      for (var i = 0; i < counts.length; i++) {
        var _this = counts[i];
        var statAnim = new CountUp(_this.el, _this.start, _this.end, _this.decimals, _this.duration, {
          useEasing: false,
          separator: settings.separator,
          decimal: settings.decimal,
          prefix: _this.options.prefix,
          suffix: _this.options.suffix
        });
        this.animations.push(statAnim);
      }
      this.runAnimations();
    }
  }, {
    key: 'runAnimations',
    value: function runAnimations() {
      var _this2 = this;

      var start = function start() {
        if (_this2.isAnimated) return;
        if ($(window).scrollTop() + window.innerHeight * 0.75 >= _this2.$element.find(_this2.sel.trigger).offset().top) {
          document.removeEventListener('scroll', start, { passive: true }); // Stop event from triggering more than once
          _this2.isAnimated = true;
          for (var i = 0; i < _this2.animations.length; i++) {
            _this2.animations[i].start();
          }
          document.addEventListener('scroll', _this2.handleScrollOut, { passive: true });
          _this2.$element.find(_this2.sel.productFill).addClass('boxFill--show');
        }
      };

      setTimeout(function () {
        document.addEventListener('scroll', start, { passive: true });
        start();
      }, 500);
    }
  }, {
    key: 'handleScrollOut',
    value: function handleScrollOut() {
      if (!this.elementInViewport(this.$element[0])) {
        for (var i = 0; i < this.animations.length; i++) {
          this.animations[i].reset();
        }
        this.isAnimated = false;
        this.$element.find(this.sel.productFill).removeClass('boxFill--show');
        this.runAnimations();
      }
    }
  }, {
    key: 'elementInViewport',
    value: function elementInViewport(el) {
      var top = el.offsetTop;
      var left = el.offsetLeft;
      var width = el.offsetWidth;
      var height = el.offsetHeight;

      while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
      }

      return top < window.pageYOffset + window.innerHeight && left < window.pageXOffset + window.innerWidth && top + height > window.pageYOffset && left + width > window.pageXOffset;
    }
  }]);

  return Counter;
}();

var Count = function () {
  function Count() {
    _classCallCheck(this, Count);

    this.sel = {
      component: '.statsPanel'
    };
    this.counters = [];

    this.init = this.init.bind(this);
  }

  _createClass(Count, [{
    key: 'init',
    value: function init() {
      var _this3 = this;

      if ($(this.sel.component).length <= 0) return;
      // For each component, create a counter
      $(this.sel.component).each(function (index, element) {
        return _this3.counters.push(new Counter($(element)));
      });
    }
  }]);

  return Count;
}();

exports.default = new Count();

},{}],7:[function(require,module,exports){
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
    this.getPathPrefix = this.getPathPrefix.bind(this);
  }

  _createClass(Header, [{
    key: 'getPathPrefix',
    value: function getPathPrefix() {
      var prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
      return prefix ? prefix : '';
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
          $.get(this.getPathPrefix() + url, function (result) {
            var container = $('.top-searches .items', _this3.sel.component);
            var paramName = $(_this3.sel.searchFormInput).attr('name');
            var hasTerms = false;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = result.results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var element = _step.value;

                hasTerms = true;
                var term = element.trim();
                var searchUrl = $(_this3.sel.searchFormForm).attr('action') + '?' + paramName + '=' + encodeURIComponent(term);
                container.append('<a href=\'' + searchUrl + '\' title=\'' + term + '\'><span>' + term + '</span></a>');
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

        $.get(this.getPathPrefix() + url, { s: s }, function (result) {
          if (result.results.length === 0) {
            _this5.clearSuggestions();
          } else {
            _this5.allSuggestions = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = result.results[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var element = _step2.value;

                _this5.allSuggestions.push(element);
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Strings = require('../Helpers/Strings');

var _Strings2 = _interopRequireDefault(_Strings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InPageNavigation = function () {
  function InPageNavigation() {
    _classCallCheck(this, InPageNavigation);

    this.sel = {
      component: '.inPageNavigation',
      list: '.inPageNavigation__list',
      listItems: '.inPageNavigation__item',
      links: '.inPageNavigation__link',
      sections: '.inPageNavigationSection',
      sectionTitle: '.inPageNavigationSection__title',
      template: '#inPageNavigation__template'
    };
    this.$template = null;
    this.sectionOffsets = [];
    this.componentHeight = 0;
    this.bottomLimit = 0;

    this.bindEvents = this.bindEvents.bind(this);
    this.populateItems = this.populateItems.bind(this);
    this.addOffset = this.addOffset.bind(this);
    this.positionComponent = this.positionComponent.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.calculateValues = this.calculateValues.bind(this);
    this.init = this.init.bind(this);
  }

  _createClass(InPageNavigation, [{
    key: 'bindEvents',
    value: function bindEvents() {
      document.addEventListener('scroll', this.handleScroll, { passive: true });
      $(document).on('click', this.sel.links, this.handleLinkClick);
      $(window).on('stop.resize', this.calculateValues);
    }
  }, {
    key: 'populateItems',
    value: function populateItems() {
      var _this = this;

      var $sections = [];
      $(this.sel.sections).each(function (index, elm) {
        var randomId = _Strings2.default.id();
        $(elm).attr('id', randomId);
        var $item = $(_this.$template.clone().html());
        $item.find('.inPageNavigation__link').attr('href', '#' + randomId);
        $sections.push($item);
        _this.addOffset($(elm));
      });
      $(this.sel.list).html('').append($sections);
      $(this.sel.listItems).first().find(this.sel.links).addClass('inPageNavigation__link--active');
      this.positionComponent();
      // Sort offsets to last first
      this.sectionOffsets.sort(function (a, b) {
        if (a.top > b.top) {
          return -1;
        } else if (b.top > a.top) {
          return 1;
        }
        return 0;
      });
      this.calculateValues();
    }
  }, {
    key: 'calculateValues',
    value: function calculateValues() {
      // Get the height of the component
      this.componentHeight = $(this.sel.list).height();
      // Get the maximum distance from the top of the document the component can move
      this.bottomLimit = $('footer').offset().top - 80;
    }
  }, {
    key: 'addOffset',
    value: function addOffset($elm) {
      var top = $elm.offset().top;
      var id = $elm.attr('id');
      this.sectionOffsets.push({
        top: top,
        id: id
      });
    }
  }, {
    key: 'positionComponent',
    value: function positionComponent() {
      var topPosition = $(this.sel.sections).first().offset().top;
      $(this.sel.component).css('top', topPosition + 'px');
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll() {
      // Get the current scroll position
      var scrollPosition = $(window).scrollTop();
      // Calculate the bottom position of the list using scroll position not element position.  If use element position it changes because we affix it
      var bottomPosition = scrollPosition + window.innerHeight / 2 + this.componentHeight / 2;
      // If the list position is on or below the limit
      if (bottomPosition >= this.bottomLimit) {
        // Affix it
        $(this.sel.component).addClass('inPageNavigation--affix').find(this.sel.list).css('top', this.bottomLimit - this.componentHeight + 'px');
      } else {
        // Un-affix it
        $(this.sel.component).removeClass('inPageNavigation--affix').find(this.sel.list).css('top', '');
      }
      // Get the inner height of the window
      var windowHeight = window.innerHeight;
      // For each section in the page
      for (var i = 0; i < this.sectionOffsets.length; i++) {
        // Get this section info
        var section = this.sectionOffsets[i];
        // If section is 33.33% from top of viewport, activate it's nav item
        if (scrollPosition + windowHeight * 0.33 >= section.top) {
          // Remove the active class from any other nav item
          $(this.sel.links).removeClass('inPageNavigation__link--active');
          // Add active class to this item
          $(this.sel.links).filter('[href="#' + section.id + '"]').addClass('inPageNavigation__link--active');
          // Stop checking other sections, it's in reverse order
          return;
        }
      }
    }
  }, {
    key: 'handleLinkClick',
    value: function handleLinkClick(e) {
      e.preventDefault();
      var targetId = $(e.target).attr('href');
      var scrollPosition = $(targetId).offset().top;
      $('html,body').animate({
        scrollTop: scrollPosition
      }, 300);
    }
  }, {
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return;
      this.$template = $(this.sel.template);
      this.bindEvents();
      this.populateItems();
    }
  }]);

  return InPageNavigation;
}();

exports.default = new InPageNavigation();

},{"../Helpers/Strings":13}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LandingPageButton = function () {
  function LandingPageButton() {
    _classCallCheck(this, LandingPageButton);

    this.sel = {
      component: '.page-body.landing-page-twocol .hero .hero__cta'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
  }

  _createClass(LandingPageButton, [{
    key: 'init',
    value: function init() {
      if ($(this.sel.component).length <= 0) return false;
      this.bindEvents();
      return true;
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      $(document).on('click', this.sel.component, function (evt) {
        var id = $(evt.currentTarget).attr('href');
        var offset = $(id).offset().top;
        $('html, body').animate({
          scrollTop: offset
        }, 1000, 'swing');

        return false;
      });
    }
  }]);

  return LandingPageButton;
}();

exports.default = new LandingPageButton();

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
'use strict';

$(document).ready(function () {
  $('.animatedPagesHero__arrow').on('click', function () {
    var newTarget = $('.animatedPagesHero').offset().top + $('.animatedPagesHero').outerHeight();
    $('html, body').animate({
      scrollTop: newTarget
    }, 400);
  });

  $('.footer__backToTop').each(function () {
    $(this).click(function () {
      $('html,body').animate({ scrollTop: 0 }, 'slow');
      return false;
    });
  });
});

$(function ($, win) {
  $.fn.inViewport = function (cb) {
    return this.each(function (i, el) {
      function visPx() {
        var H = $(this).height(),
            r = el.getBoundingClientRect(),
            t = r.top,
            b = r.bottom;
        return cb.call(el, Math.max(0, t > 0 ? H - t : b < H ? b : H));
      }visPx();
      $(win).on("resize scroll", visPx);
    });
  };
}(jQuery, window));

$(".js-country-gif").inViewport(function (px) {
  if (px > 200) $(this).addClass("visible");
});

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Strings = function () {
  function Strings() {
    _classCallCheck(this, Strings);
  }

  _createClass(Strings, [{
    key: 'id',
    value: function id() {
      var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;

      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      var text = '';
      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }
  }]);

  return Strings;
}();

exports.default = new Strings();

},{}],14:[function(require,module,exports){
'use strict';

(function () {
    if (!window.parent.window.test) return;
    // Disable console log functionality
    window.console.log = function () {};
    // Start test
    var data = window.parent.window.test.results;
    var styles = data[0];
    var weights = data[1];
    $('body *').each(function (index, element) {
        var family = window.getComputedStyle(element, null).getPropertyValue('font-family');
        if (family.indexOf(window.parent.window.test.params.family) < 0) return;
        var style = window.getComputedStyle(element, null).getPropertyValue('font-style');
        if (!styles.includes(style)) styles.push(style);
        var weight = window.getComputedStyle(element, null).getPropertyValue('font-weight');
        if (!weights.includes(weight)) weights.push(weight);
    });
    // Notify automated test script
    window.parent.window.test.loading = false;
    window.parent.window.test.results = [styles, weights];
})();

},{}],15:[function(require,module,exports){
'use strict';

require('./Tests/Fonts');

var _Header = require('./Components/Header');

var _Header2 = _interopRequireDefault(_Header);

var _IEDetector = require('./Components/IEDetector');

var _IEDetector2 = _interopRequireDefault(_IEDetector);

var _LandingPageButton = require('./Components/LandingPageButton');

var _LandingPageButton2 = _interopRequireDefault(_LandingPageButton);

var _Count = require('./Components/Count');

var _Count2 = _interopRequireDefault(_Count);

var _AnimatedForm = require('./Components/AnimatedForm');

var _AnimatedForm2 = _interopRequireDefault(_AnimatedForm);

var _CarouselRow = require('./Components/CarouselRow');

var _CarouselRow2 = _interopRequireDefault(_CarouselRow);

var _AnimatedParallax = require('./Components/AnimatedParallax');

var _AnimatedParallax2 = _interopRequireDefault(_AnimatedParallax);

var _SmoothScroll = require('./Components/SmoothScroll');

var _SmoothScroll2 = _interopRequireDefault(_SmoothScroll);

var _AnimatedShowcasePanel = require('./Components/AnimatedShowcasePanel');

var _AnimatedShowcasePanel2 = _interopRequireDefault(_AnimatedShowcasePanel);

var _AnimatedPagesHero = require('./Components/AnimatedPagesHero');

var _AnimatedPagesHero2 = _interopRequireDefault(_AnimatedPagesHero);

var _InPageNavigation = require('./Components/InPageNavigation');

var _InPageNavigation2 = _interopRequireDefault(_InPageNavigation);

var _ShipNowTwoStepForm = require('./Components/ShipNowTwoStepForm');

var _ShipNowTwoStepForm2 = _interopRequireDefault(_ShipNowTwoStepForm);

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
  _Count2.default.init();
  _LandingPageButton2.default.init();
  // AnimatedForm.init();
  _CarouselRow2.default.init();
  _AnimatedParallax2.default.init();
  _AnimatedShowcasePanel2.default.init();
  _InPageNavigation2.default.init();
  _ShipNowTwoStepForm2.default.init();
});

_AnimatedPagesHero2.default.init();

},{"./Components/AnimatedForm":1,"./Components/AnimatedPagesHero":2,"./Components/AnimatedParallax":3,"./Components/AnimatedShowcasePanel":4,"./Components/CarouselRow":5,"./Components/Count":6,"./Components/Header":7,"./Components/IEDetector":8,"./Components/InPageNavigation":9,"./Components/LandingPageButton":10,"./Components/ShipNowTwoStepForm":11,"./Components/SmoothScroll":12,"./Tests/Fonts":14}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BbmltYXRlZEZvcm0uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BbmltYXRlZFBhZ2VzSGVyby5qcyIsImpzL2Rldi9Db21wb25lbnRzL0FuaW1hdGVkUGFyYWxsYXguanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BbmltYXRlZFNob3djYXNlUGFuZWwuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9DYXJvdXNlbFJvdy5qcyIsImpzL2Rldi9Db21wb25lbnRzL0NvdW50LmpzIiwianMvZGV2L0NvbXBvbmVudHMvSGVhZGVyLmpzIiwianMvZGV2L0NvbXBvbmVudHMvSUVEZXRlY3Rvci5qcyIsImpzL2Rldi9Db21wb25lbnRzL0luUGFnZU5hdmlnYXRpb24uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9MYW5kaW5nUGFnZUJ1dHRvbi5qcyIsImpzL2Rldi9Db21wb25lbnRzL1NoaXBOb3dUd29TdGVwRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1Ntb290aFNjcm9sbC5qcyIsImpzL2Rldi9IZWxwZXJzL1N0cmluZ3MuanMiLCJqcy9kZXYvVGVzdHMvRm9udHMuanMiLCJqcy9kZXYvYW5pbWF0ZWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDQU0saUI7QUFDSiwrQkFBYztBQUFBOztBQUNaLFNBQUssR0FBTCxHQUFXO0FBQ1QsaUJBQVcsb0JBREY7QUFFVCxXQUFLLHlCQUZJO0FBR1Qsb0JBQWMsaUNBSEw7QUFJVCxhQUFPO0FBSkUsS0FBWDs7QUFPQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFwQjtBQUNBLFNBQUssT0FBTCxHQUFl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MUIsR0FBb0MsS0FBcEM7QUFDQSxXQUFPLE1BQVAsQ0FBYyxNQUFkLENBQXFCLElBQXJCLENBQTBCLE9BQTFCLEdBQW9DLENBQUMsTUFBRCxFQUFTLE9BQVQsQ0FBcEM7QUFDSCxDQW5CRDs7Ozs7QUNBQTs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQVpBO0FBY0EsRUFBRSxRQUFGLEVBQVksS0FBWixDQUFrQixZQUFNO0FBQ3RCLE1BQUk7QUFDRixhQUFTLFdBQVQsQ0FBcUIsWUFBckI7QUFDQSxNQUFFLE1BQUYsRUFBVSxRQUFWLENBQW1CLE9BQW5CO0FBQ0QsR0FIRCxDQUdFLE9BQU8sQ0FBUCxFQUFVLENBRVg7QUFEQzs7QUFFRjtBQUNBLHVCQUFXLElBQVg7QUFDQSxtQkFBTyxJQUFQO0FBQ0Esa0JBQU0sSUFBTjtBQUNBLDhCQUFrQixJQUFsQjtBQUNBO0FBQ0Esd0JBQVksSUFBWjtBQUNBLDZCQUFpQixJQUFqQjtBQUNBLGtDQUFzQixJQUF0QjtBQUNBLDZCQUFpQixJQUFqQjtBQUNBLCtCQUFtQixJQUFuQjtBQUVELENBbkJEOztBQXFCQSw0QkFBa0IsSUFBbEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKlxudmFyIGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybScpO1xudmFyIHNlY29uZEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYW5pbWF0ZWRGb3JtX19zZWNvbmRGb3JtJyk7XG52YXIgYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdCcpO1xuXG4gIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgc2Vjb25kRm9ybS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxufSk7XG4qLyIsImNsYXNzIEFuaW1hdGVkUGFnZXNIZXJvIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuYW5pbWF0ZWRQYWdlc0hlcm8nLFxuICAgICAgdmFuOiAnLmFuaW1hdGVkUGFnZXNIZXJvX192YW4nLFxuICAgICAgYW5pbWF0aW9uR2lmOiAnLmFuaW1hdGVkUGFnZXNIZXJvX19jb25zdW1lckdpZicsXG4gICAgICB2aWRlbzogJy5hbmltYXRlZFBhZ2VzSGVyb19fdmlkZW8nXG4gICAgfTtcblxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU2Nyb2xsID0gdGhpcy5oYW5kbGVTY3JvbGwuYmluZCh0aGlzKTtcbiAgICB0aGlzLnByZWxvYWQgPSB0aGlzLnByZWxvYWQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVTY3JvbGwsIHtwYXNzaXZlOiB0cnVlfSk7XG4gIH1cblxuICBwcmVsb2FkKCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmFuaW1hdGlvbkdpZikubGVuZ3RoIDw9IDApIHJldHVybjtcbiAgICBsZXQgZ2lmID0gbmV3IEltYWdlKCk7XG4gICAgZ2lmLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICQodGhpcy5zZWwuYW5pbWF0aW9uR2lmKS5hdHRyKCdzcmMnLCAkKHRoaXMuc2VsLmFuaW1hdGlvbkdpZikuYXR0cignZGF0YS1zcmMnKSk7XG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2FuaW1hdGVkUGFnZXNIZXJvLS1sb2FkZWQnKTtcbiAgICB9O1xuICAgIGdpZi5zcmMgPSAkKHRoaXMuc2VsLmFuaW1hdGlvbkdpZikuYXR0cignZGF0YS1zcmMnKTtcbiAgfVxuXG4gIGhhbmRsZVNjcm9sbCgpIHtcbiAgICBpZiAoJChkb2N1bWVudCkuc2Nyb2xsVG9wKCkgPiAwKSB7XG4gICAgICAkKHRoaXMuc2VsLnZhbikuYWRkQ2xhc3MoJ2FuaW1hdGVkUGFnZXNIZXJvX192YW4tLW91dCcpO1xuICAgIH1cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgc2V0VGltZW91dCh0aGlzLmJpbmRFdmVudHMsIDUxNjApO1xuICAgIHRoaXMucHJlbG9hZCgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBBbmltYXRlZFBhZ2VzSGVybygpO1xuIiwiY2xhc3MgQW5pbWF0ZWRQYXJhbGxheCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLnBhcmFsbGF4U2VjdGlvbicsXG4gICAgICB0aWxlczogJy5wYXJhbGxheFNlY3Rpb25fX3RpbGU6bm90KC5wYXJhbGxheFNlY3Rpb25fX3RpbGUtLW5vUGFyYWxsYXgpJ1xuICAgIH07XG4gICAgdGhpcy50aWxlcyA9IFtdO1xuXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTY3JvbGwgPSB0aGlzLmhhbmRsZVNjcm9sbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0VGlsZXMgPSB0aGlzLmdldFRpbGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuaGFuZGxlU2Nyb2xsLCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgICQod2luZG93KS5vbignc3RvcC5yZXNpemUnLCB0aGlzLmhhbmRsZVNjcm9sbCk7XG4gIH1cblxuICBoYW5kbGVTY3JvbGwoKSB7XG4gICAgbGV0IHNjcm9sbFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGxldCB2aXNpYmxlVGlsZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCB0aWxlID0gdGhpcy50aWxlc1tpXTtcbiAgICAgIGlmICh0aWxlLm9mZnNldFRvcCA8IHNjcm9sbFBvc2l0aW9uKSB7XG4gICAgICAgIHZpc2libGVUaWxlcy5wdXNoKHRpbGUpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpc2libGVUaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHRpbGUgPSB2aXNpYmxlVGlsZXNbaV07XG4gICAgICBsZXQgbXVsdGlwbGllciA9IHRpbGUuJHRpbGUuaGFzQ2xhc3MoJ3BhcmFsbGF4U2VjdGlvbl9fdGlsZS0tZmFzdFBhcmFsbGF4JykgPyAwLjYgOiAwLjM7XG4gICAgICBsZXQgbXVsdGlwbGllck92ZXJyaWRlID0gdGlsZS4kdGlsZS5hdHRyKCdkYXRhLW11bHRpcGxpZXInKTtcbiAgICAgIGlmIChtdWx0aXBsaWVyT3ZlcnJpZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtdWx0aXBsaWVyID0gbXVsdGlwbGllck92ZXJyaWRlO1xuICAgICAgfVxuXG4gICAgICBsZXQgcGFyYWxsYXhEaXZpZGVyID0gd2luZG93LmlubmVyV2lkdGggPCA3NjggPyA0IDogMjtcbiAgICAgIGxldCBwYXJhbGxheE9mZnNldCA9ICh0aWxlLm9mZnNldFRvcCAtICQod2luZG93KS5zY3JvbGxUb3AoKSkgKiBtdWx0aXBsaWVyO1xuICAgICAgaWYgKHRpbGUuJHRpbGUuaGFzQ2xhc3MoJ3BhcmFsbGF4U2VjdGlvbl9fdGlsZS0tZG93bicpKSB7XG4gICAgICAgIHBhcmFsbGF4T2Zmc2V0ID0gKCh3aW5kb3cuaW5uZXJIZWlnaHQgKyAkKHdpbmRvdykuc2Nyb2xsVG9wKCkpIC0gKHRpbGUub2Zmc2V0VG9wICsgdGlsZS5oZWlnaHQpKSAqIG11bHRpcGxpZXI7XG4gICAgICB9XG5cbiAgICAgIGxldCBuZXdUb3AgPSAodGlsZS5vcmlnaW5hbFRvcCArIChwYXJhbGxheE9mZnNldCAvIHBhcmFsbGF4RGl2aWRlcikpO1xuICAgICAgbGV0IG1heFRvcCA9ICh0aWxlLiR0aWxlLmF0dHIoJ2RhdGEtbWF4LXRvcCcpKTtcbiAgICAgIGxldCBtaW5Ub3AgPSAodGlsZS4kdGlsZS5hdHRyKCdkYXRhLW1pbi10b3AnKSk7XG5cbiAgICAgIGlmIChtaW5Ub3AgIT09IHVuZGVmaW5lZCAmJiBuZXdUb3AgPD0gbWluVG9wKSB7XG4gICAgICAgIG5ld1RvcCA9IG1pblRvcDtcbiAgICAgIH1cblxuICAgICAgaWYgKG1heFRvcCAhPSB1bmRlZmluZWQgJiYgbmV3VG9wID49IG1heFRvcCkge1xuICAgICAgICBuZXdUb3AgPSBtYXhUb3A7XG4gICAgICB9XG5cbiAgICAgIHRpbGUuJHRpbGUuY3NzKCd0b3AnLCBuZXdUb3AgKyAncHgnKTtcbiAgICB9XG4gIH1cblxuICBnZXRUaWxlcygpIHtcbiAgICAkKHRoaXMuc2VsLnRpbGVzKS5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgbGV0ICR0aWxlID0gJChlbGVtZW50KTtcbiAgICAgIGxldCB0b3BQb3NpdGlvbiA9IHBhcnNlSW50KCR0aWxlLmNzcygndG9wJyksIDEwKTtcbiAgICAgIGxldCBvZmZzZXRUb3AgPSAkdGlsZS5vZmZzZXQoKS50b3A7XG4gICAgICB0aGlzLnRpbGVzLnB1c2goe1xuICAgICAgICAkdGlsZTogJHRpbGUsXG4gICAgICAgIG9yaWdpbmFsVG9wOiB0b3BQb3NpdGlvbixcbiAgICAgICAgb2Zmc2V0VG9wOiBvZmZzZXRUb3AsXG4gICAgICAgIGhlaWdodDogJHRpbGUub3V0ZXJIZWlnaHQoKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybjtcbiAgICB0aGlzLmdldFRpbGVzKCk7XG4gICAgdGhpcy5oYW5kbGVTY3JvbGwoKTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQW5pbWF0ZWRQYXJhbGxheCgpO1xuIiwiY2xhc3MgU2hvd2Nhc2VQYW5lbCB7XG4gIGNvbnN0cnVjdG9yKCRlbGVtZW50KSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY2Fyb3VzZWw6ICcuYW5pbWF0ZWRTaG93Y2FzZVBhbmVsX19jYXJvdXNlbCcsXG4gICAgICBpdGVtczogJy5hbmltYXRlZFNob3djYXNlUGFuZWxfX2Nhcm91c2VsSXRlbScsXG4gICAgICBzdGFja2VkSXRlbXM6ICcuYW5pbWF0ZWRTaG93Y2FzZVBhbmVsX19jYXJvdXNlbEl0ZW06bm90KC5hbmltYXRlZFNob3djYXNlUGFuZWxfX2Nhcm91c2VsSXRlbS0taGlkZGVuKScsXG4gICAgICBuYXZpZ2F0aW9uOiAnLmFuaW1hdGVkU2hvd2Nhc2VQYW5lbF9fY2Fyb3VzZWxOYXZpZ2F0aW9uJyxcbiAgICAgIG5hdmlnYXRpb25JdGVtOiAnLmFuaW1hdGVkU2hvd2Nhc2VQYW5lbF9fY2Fyb3VzZWxOYXZpZ2F0aW9uSXRlbSdcbiAgICB9O1xuXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5kb0hpZGUgPSB0aGlzLmRvSGlkZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZG9TaG93ID0gdGhpcy5kb1Nob3cuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3dJdGVtID0gdGhpcy5zaG93SXRlbS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2NhbGVJdGVtcyA9IHRoaXMuc2NhbGVJdGVtcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY3JlYXRlTmF2aWdhdGlvbiA9IHRoaXMuY3JlYXRlTmF2aWdhdGlvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuaXRlbXMpLnN3aXBlKHtcbiAgICAgIHN3aXBlOiAoZXZlbnQsIGRpcmVjdGlvbikgPT4ge1xuICAgICAgICBsZXQgJGl0ZW0gPSAoJChldmVudC50YXJnZXQpLmhhc0NsYXNzKCdhbmltYXRlZFNob3djYXNlUGFuZWxfX2Nhcm91c2VsSXRlbScpKSA/ICQoZXZlbnQudGFyZ2V0KSA6ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKHRoaXMuc2VsLml0ZW1zKTtcbiAgICAgICAgbGV0IGluZGV4ID0gJGl0ZW0uaW5kZXgoKTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgdGhpcy5zaG93SXRlbShpbmRleCArIDEpO1xuICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgIHRoaXMuc2hvd0l0ZW0oaW5kZXggLSAxKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGFsbG93UGFnZVNjcm9sbDogJ3ZlcnRpY2FsJ1xuICAgIH0pO1xuICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrJywgdGhpcy5zZWwubmF2aWdhdGlvbkl0ZW0sIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLnNob3dJdGVtKCQoZS50YXJnZXQpLmluZGV4KCkpO1xuICAgIH0pO1xuICB9XG5cbiAgZG9IaWRlKCRpdGVtKSB7XG4gICAgJGl0ZW0uYWRkQ2xhc3MoJ2FuaW1hdGVkU2hvd2Nhc2VQYW5lbF9fY2Fyb3VzZWxJdGVtLS1oaWRkZW4nKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICRpdGVtLmhpZGUoKTtcbiAgICB9LCAyNTApO1xuICAgIHRoaXMuc2NhbGVJdGVtcygpO1xuICB9XG5cbiAgZG9TaG93KCRpdGVtKSB7XG4gICAgJGl0ZW0uc2hvdygoKSA9PiB7XG4gICAgICAkaXRlbS5yZW1vdmVDbGFzcygnYW5pbWF0ZWRTaG93Y2FzZVBhbmVsX19jYXJvdXNlbEl0ZW0tLWhpZGRlbicpO1xuICAgICAgdGhpcy5zY2FsZUl0ZW1zKCk7XG4gICAgfSk7XG4gIH1cblxuICBzaG93SXRlbShpbmRleCkge1xuICAgIC8vIEluZGV4IGNhbid0IGJlIGxlc3MgdGhhbiAwXG4gICAgaW5kZXggPSBNYXRoLm1heChpbmRleCwgMCk7XG4gICAgLy8gSW5kZXggY2FuJ3QgYmUgbW9yZSB0aGFuIHRoZSBudW1iZXIgb2YgaXRlbXNcbiAgICBpbmRleCA9IE1hdGgubWluKGluZGV4LCAodGhpcy4kZWxlbWVudC5maW5kKHRoaXMuc2VsLml0ZW1zKS5sZW5ndGggLSAxKSk7XG4gICAgLy8gRmluZCB0aGUgY3VycmVudCBwb3NpdGlvblxuICAgIGxldCBjdXJyZW50SW5kZXggPSB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuc3RhY2tlZEl0ZW1zKS5maXJzdCgpLmluZGV4KCk7XG4gICAgLy8gR2V0IHRoZSBudW1iZXIgb2YgaXRlbXMgdG8gbW92ZVxuICAgIGxldCBvZmZzZXQgPSBjdXJyZW50SW5kZXggLSBpbmRleDtcbiAgICAvLyBMb29wIHRoZSBudW1iZXIgb2YgdGhlIG9mZnNldFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5hYnMob2Zmc2V0KTsgaSsrKSB7XG4gICAgICAvLyBUaGUgYWN0aW9uIHRvIGV0aGVpciBzaG93IG9yIGhpZGUgZGVwZW5kaW5nIG9uIGRpcmVjdGlvblxuICAgICAgbGV0IGFjdGlvbiA9IHRoaXMuZG9IaWRlO1xuICAgICAgLy8gVGhlIGl0ZW0gaW5kZXggZGVwZW5kaW5nIG9uIGRpcmVjdGlvblxuICAgICAgbGV0IGl0ZW1JbmRleCA9IGN1cnJlbnRJbmRleCArIGk7XG4gICAgICAvLyBJZiBzaG91bGQgYmUgc2hvd2luZyBpdGVtc1xuICAgICAgaWYgKG9mZnNldCA+IDApIHtcbiAgICAgICAgLy8gQ2hhbmdlIGFjdGlvblxuICAgICAgICBhY3Rpb24gPSB0aGlzLmRvU2hvdztcbiAgICAgICAgLy8gQ2hhbmdlIGluZGV4XG4gICAgICAgIGl0ZW1JbmRleCA9IGN1cnJlbnRJbmRleCAtIChpICsgMSk7XG4gICAgICB9XG4gICAgICAvLyBHZXQgdGhlIGl0ZW0gYXQgdGhlIGluZGV4XG4gICAgICBsZXQgJGl0ZW0gPSB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuaXRlbXMpLmVxKGl0ZW1JbmRleCk7XG4gICAgICAvLyBSdW4gdGhlIGFjdGlvbiB3aXRoIGEgdGltZW91dFxuICAgICAgc2V0VGltZW91dChhY3Rpb24sIDI1MCAqIGksICRpdGVtKTtcbiAgICB9XG4gICAgLy8gUmVtb3ZlIGFjdGl2ZSBuYXZpZ2F0aW9uIGl0ZW1cbiAgICB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwubmF2aWdhdGlvbikuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAvLyBTZXQgdGhlIGNvcnJlY3QgbmFnaXZhdGlvbiBpdGVtIHRvIGFjdGl2ZVxuICAgIHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5uYXZpZ2F0aW9uSXRlbSkuZXEoaW5kZXgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIHNjYWxlSXRlbXMoKSB7XG4gICAgdGhpcy4kZWxlbWVudC5maW5kKHRoaXMuc2VsLnN0YWNrZWRJdGVtcykuZWFjaCgoaW5kZXgsIGVsZW1lbnQpID0+IHtcbiAgICAgIGxldCAkaXRlbSA9ICQoZWxlbWVudCk7XG4gICAgICAvLyBObyB0cmFuc2Zvcm0gZm9yIGZpcnN0IGl0ZW1cbiAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAkaXRlbS5jc3MoJ3RyYW5zZm9ybScsICdub25lJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIENhbGN1bGF0ZSB0aGUgc2NhbGUsIDUlIHNtYWxsZXIgZm9yIGVhY2ggaXRlbVxuICAgICAgbGV0IHNjYWxlID0gMSAtICgwLjA1ICogaW5kZXgpO1xuICAgICAgLy8gQ2FsY3VsYXRlIGhvdyBmYXIgdG8gbW92ZSB0aGUgaXRlbSByaWdodCwgc2hvdWxkIGJlIDE1cHggYnV0IG5lZWRzIHRvIGFjY291bnQgZm9yIHNjYWxlXG4gICAgICBsZXQgdHJhbnNsYXRlID0gcGFyc2VJbnQoMTUgKiAoMSArICgwLjA1ICogaW5kZXgpKSwgMTApICogaW5kZXg7XG4gICAgICAvLyBVcGRhdGUgdGhlIGl0ZW1cbiAgICAgICRpdGVtLmNzcygndHJhbnNmb3JtJywgJ3NjYWxlKCcgKyBzY2FsZSArICcpIHRyYW5zbGF0ZVgoJyArIHRyYW5zbGF0ZSArICdweCknKTtcbiAgICB9KTtcbiAgICAvLyBBZGQgcmVhZHkgY2xhc3MgdG8gY2Fyb3VzZWxcbiAgICB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuY2Fyb3VzZWwpLmFkZENsYXNzKCdhbmltYXRlZFNob3djYXNlUGFuZWxfX2Nhcm91c2VsLS1yZWFkeScpO1xuICB9XG5cbiAgY3JlYXRlTmF2aWdhdGlvbigpIHtcbiAgICBpZiAodGhpcy4kZWxlbWVudC5maW5kKHRoaXMuc2VsLm5hdmlnYXRpb24pLmxlbmd0aCA+IDApIHJldHVybjtcbiAgICBsZXQgbmF2SXRlbXMgPSAnJztcbiAgICB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuaXRlbXMpLmVhY2goKGluZGV4KSA9PiB7XG4gICAgICBuYXZJdGVtcyArPSAnPGxpIGNsYXNzPVwiYW5pbWF0ZWRTaG93Y2FzZVBhbmVsX19jYXJvdXNlbE5hdmlnYXRpb25JdGVtJyArIChpbmRleCA9PT0gMCA/ICcgYWN0aXZlJyA6ICcnKSArICdcIj48L2xpPic7XG4gICAgfSk7XG4gICAgdGhpcy4kZWxlbWVudC5maW5kKHRoaXMuc2VsLmNhcm91c2VsKS5hZnRlcignPG9sIGNsYXNzPVwiYW5pbWF0ZWRTaG93Y2FzZVBhbmVsX19jYXJvdXNlbE5hdmlnYXRpb25cIj4nICsgbmF2SXRlbXMgKyAnPC9vbD4nKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy5jcmVhdGVOYXZpZ2F0aW9uKCk7XG4gICAgdGhpcy5zY2FsZUl0ZW1zKCk7XG4gIH1cbn1cblxuY2xhc3MgQW5pbWF0ZWRTaG93Y2FzZVBhbmVsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuYW5pbWF0ZWRTaG93Y2FzZVBhbmVsJ1xuICAgIH07XG4gICAgdGhpcy5wYW5lbHMgPSBbXTtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm47XG4gICAgLy8gRm9yIGVhY2ggY29tcG9uZW50LCBjcmVhdGUgYSBzaG93Y2FzZSBwYW5lbFxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4gdGhpcy5wYW5lbHMucHVzaChuZXcgU2hvd2Nhc2VQYW5lbCgkKGVsZW1lbnQpKSkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBBbmltYXRlZFNob3djYXNlUGFuZWwoKTtcbiIsImNsYXNzIENhcm91c2VsUm93IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuY2Fyb3VzZWxSb3cnLFxuICAgICAgY2Fyb3VzZWw6ICcuY2Fyb3VzZWxSb3dfX2Nhcm91c2VsJyxcbiAgICAgIGFycm93TmV4dDogJy5jYXJvdXNlbFJvdyAuYXJyb3dOZXh0JyxcbiAgICAgIGFycm93UHJldjogJy5jYXJvdXNlbFJvdyAuYXJyb3dQcmV2J1xuICAgIH07XG4gICAgdGhpcy5jYXJvdXNlbCA9IG51bGw7XG5cbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXRDYXJvdXNlbCA9IHRoaXMuaW5pdENhcm91c2VsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmFycm93TmV4dCwgKGUpPT57XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLmNhcm91c2VsLm5leHQoKTtcbiAgICB9KTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5hcnJvd1ByZXYsIChlKT0+e1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5jYXJvdXNlbC5wcmV2KCk7XG4gICAgfSk7XG4gICAgJCh0aGlzLnNlbC5jYXJvdXNlbCkuc3dpcGUoe1xuICAgICAgc3dpcGU6IChldmVudCwgZGlyZWN0aW9uKSA9PiB7XG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuICAgICAgICAgIHRoaXMuY2Fyb3VzZWwubmV4dCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgIHRoaXMuY2Fyb3VzZWwucHJldigpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWxsb3dQYWdlU2Nyb2xsOiAndmVydGljYWwnXG4gICAgfSk7XG4gIH1cblxuICBpbml0Q2Fyb3VzZWwoKSB7XG4gICAgdGhpcy5jYXJvdXNlbCA9ICQodGhpcy5zZWwuY2Fyb3VzZWwpLndhdGVyd2hlZWxDYXJvdXNlbCh7XG4gICAgICBmbGFua2luZ0l0ZW1zOiAxLFxuICAgICAgb3BhY2l0eU11bHRpcGxpZXI6IDEsXG4gICAgICBzZXBhcmF0aW9uOiA5MCxcbiAgICAgIC8qbW92aW5nVG9DZW50ZXI6ICgkaXRlbSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnbW92aW5nVG9DZW50ZXInLCAkaXRlbSk7XG4gICAgICB9LFxuICAgICAgbW92ZWRUb0NlbnRlcjogKCRpdGVtKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtb3ZlZFRvQ2VudGVyJywgJGl0ZW0pO1xuICAgICAgfSxcbiAgICAgIG1vdmluZ0Zyb21DZW50ZXI6ICgkaXRlbSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnbW92aW5nRnJvbUNlbnRlcicsICRpdGVtKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlZEZyb21DZW50ZXI6ICgkaXRlbSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnbW92ZWRGcm9tQ2VudGVyJywgJGl0ZW0pO1xuICAgICAgfSxcbiAgICAgIGNsaWNrZWRDZW50ZXI6ICgkaXRlbSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnY2xpY2tlZENlbnRlcicsICRpdGVtKTtcbiAgICAgIH0qL1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm47XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy5pbml0Q2Fyb3VzZWwoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ2Fyb3VzZWxSb3coKTtcbiIsImNsYXNzIENvdW50ZXIge1xuICBjb25zdHJ1Y3RvcigkZWxlbWVudCkge1xuICAgIHRoaXMuJGVsZW1lbnQgPSAkZWxlbWVudDtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIHN0YXRzOiAnLnN0YXRzUGFuZWxfX3N0YXRzVmFsdWUnLFxuICAgICAgdHJpZ2dlcjogJy5zdGF0c1BhbmVsX193cmFwcGVyJyxcbiAgICAgIHByb2R1Y3RGaWxsOiAnLmJveEZpbGwnXG4gICAgfTtcbiAgICB0aGlzLmFuaW1hdGlvbnMgPSBbXTtcbiAgICB0aGlzLmlzQW5pbWF0ZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuY291bnRVcCA9IHRoaXMuY291bnRVcC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucnVuQW5pbWF0aW9ucyA9IHRoaXMucnVuQW5pbWF0aW9ucy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU2Nyb2xsT3V0ID0gdGhpcy5oYW5kbGVTY3JvbGxPdXQuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuY291bnRVcCgpO1xuICB9XG5cbiAgY291bnRVcCgpIHtcbiAgICBsZXQgJHN0YXRzID0gdGhpcy4kZWxlbWVudC5maW5kKHRoaXMuc2VsLnN0YXRzKTtcbiAgICBsZXQgc2V0dGluZ3MgPSB7XG4gICAgICBkdXJhdGlvbjogcGFyc2VJbnQodGhpcy4kZWxlbWVudC5hdHRyKCdkYXRhLWR1cmF0aW9uJyksIDEwKSB8fCAyLFxuICAgICAgc2VwYXJhdG9yOiB0aGlzLiRlbGVtZW50LmF0dHIoJ2RhdGEtc2VwYXJhdG9yJykgfHwgJycsXG4gICAgICBkZWNpbWFsOiB0aGlzLiRlbGVtZW50LmF0dHIoJ2RhdGEtZGVjaW1hbCcpIHx8ICcuJ1xuICAgIH07XG4gICAgbGV0IGNvdW50cyA9IFtdO1xuXG4gICAgJHN0YXRzLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICBsZXQgc3RhcnQgPSBwYXJzZUZsb2F0KCQoZWxlbWVudCkuYXR0cignZGF0YS1zdGFydCcpKSB8fCAwO1xuICAgICAgbGV0IGVuZCA9IHBhcnNlRmxvYXQoJChlbGVtZW50KS5hdHRyKCdkYXRhLWVuZCcpKTtcbiAgICAgIGxldCBkZWNpbWFscyA9IHBhcnNlSW50KCQoZWxlbWVudCkuYXR0cignZGF0YS1kZWNpbWFscycpLCAxMCkgfHwgMDtcbiAgICAgIGxldCBwcmVmaXggPSAkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtcHJlZml4JykgfHwgJyc7XG4gICAgICBsZXQgc3VmZml4ID0gJChlbGVtZW50KS5hdHRyKCdkYXRhLXN1ZmZpeCcpIHx8ICcnO1xuICAgICAgbGV0IGR1cmF0aW9uID0gcGFyc2VGbG9hdCgkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtZHVyYXRpb24nKSkgfHwgc2V0dGluZ3MuZHVyYXRpb247XG5cbiAgICAgIGNvdW50cy5wdXNoKHtcbiAgICAgICAgZWw6ICQoZWxlbWVudClbMF0sXG4gICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgIGRlY2ltYWxzOiBkZWNpbWFscyxcbiAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgcHJlZml4OiBwcmVmaXgsXG4gICAgICAgICAgc3VmZml4OiBzdWZmaXhcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IF90aGlzID0gY291bnRzW2ldO1xuICAgICAgbGV0IHN0YXRBbmltID0gbmV3IENvdW50VXAoXG4gICAgICAgIF90aGlzLmVsLFxuICAgICAgICBfdGhpcy5zdGFydCxcbiAgICAgICAgX3RoaXMuZW5kLFxuICAgICAgICBfdGhpcy5kZWNpbWFscyxcbiAgICAgICAgX3RoaXMuZHVyYXRpb24sXG4gICAgICAgIHtcbiAgICAgICAgICB1c2VFYXNpbmc6IGZhbHNlLFxuICAgICAgICAgIHNlcGFyYXRvcjogc2V0dGluZ3Muc2VwYXJhdG9yLFxuICAgICAgICAgIGRlY2ltYWw6IHNldHRpbmdzLmRlY2ltYWwsXG4gICAgICAgICAgcHJlZml4OiBfdGhpcy5vcHRpb25zLnByZWZpeCxcbiAgICAgICAgICBzdWZmaXg6IF90aGlzLm9wdGlvbnMuc3VmZml4XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICB0aGlzLmFuaW1hdGlvbnMucHVzaChzdGF0QW5pbSk7XG4gICAgfVxuICAgIHRoaXMucnVuQW5pbWF0aW9ucygpO1xuICB9XG5cbiAgcnVuQW5pbWF0aW9ucygpIHtcbiAgICBjb25zdCBzdGFydCA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzQW5pbWF0ZWQpIHJldHVybjtcbiAgICAgIGlmICgoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgKHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNzUpKSA+PSB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwudHJpZ2dlcikub2Zmc2V0KCkudG9wKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHN0YXJ0LCB7cGFzc2l2ZTogdHJ1ZX0pOyAvLyBTdG9wIGV2ZW50IGZyb20gdHJpZ2dlcmluZyBtb3JlIHRoYW4gb25jZVxuICAgICAgICB0aGlzLmlzQW5pbWF0ZWQgPSB0cnVlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYW5pbWF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uc1tpXS5zdGFydCgpO1xuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuaGFuZGxlU2Nyb2xsT3V0LCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwucHJvZHVjdEZpbGwpLmFkZENsYXNzKCdib3hGaWxsLS1zaG93Jyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc3RhcnQsIHtwYXNzaXZlOiB0cnVlfSk7XG4gICAgICBzdGFydCgpO1xuICAgIH0sIDUwMCk7XG4gIH1cblxuICBoYW5kbGVTY3JvbGxPdXQoKSB7XG4gICAgaWYgKCF0aGlzLmVsZW1lbnRJblZpZXdwb3J0KHRoaXMuJGVsZW1lbnRbMF0pKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYW5pbWF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbnNbaV0ucmVzZXQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaXNBbmltYXRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy4kZWxlbWVudC5maW5kKHRoaXMuc2VsLnByb2R1Y3RGaWxsKS5yZW1vdmVDbGFzcygnYm94RmlsbC0tc2hvdycpO1xuICAgICAgdGhpcy5ydW5BbmltYXRpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgZWxlbWVudEluVmlld3BvcnQoZWwpIHtcbiAgICBsZXQgdG9wID0gZWwub2Zmc2V0VG9wO1xuICAgIGxldCBsZWZ0ID0gZWwub2Zmc2V0TGVmdDtcbiAgICBsZXQgd2lkdGggPSBlbC5vZmZzZXRXaWR0aDtcbiAgICBsZXQgaGVpZ2h0ID0gZWwub2Zmc2V0SGVpZ2h0O1xuXG4gICAgd2hpbGUoZWwub2Zmc2V0UGFyZW50KSB7XG4gICAgICBlbCA9IGVsLm9mZnNldFBhcmVudDtcbiAgICAgIHRvcCArPSBlbC5vZmZzZXRUb3A7XG4gICAgICBsZWZ0ICs9IGVsLm9mZnNldExlZnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIHRvcCA8ICh3aW5kb3cucGFnZVlPZmZzZXQgKyB3aW5kb3cuaW5uZXJIZWlnaHQpICYmXG4gICAgICBsZWZ0IDwgKHdpbmRvdy5wYWdlWE9mZnNldCArIHdpbmRvdy5pbm5lcldpZHRoKSAmJlxuICAgICAgKHRvcCArIGhlaWdodCkgPiB3aW5kb3cucGFnZVlPZmZzZXQgJiZcbiAgICAgIChsZWZ0ICsgd2lkdGgpID4gd2luZG93LnBhZ2VYT2Zmc2V0XG4gICAgKTtcbiAgfVxufVxuXG5jbGFzcyBDb3VudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLnN0YXRzUGFuZWwnXG4gICAgfTtcbiAgICB0aGlzLmNvdW50ZXJzID0gW107XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuO1xuICAgIC8vIEZvciBlYWNoIGNvbXBvbmVudCwgY3JlYXRlIGEgY291bnRlclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4gdGhpcy5jb3VudGVycy5wdXNoKG5ldyBDb3VudGVyKCQoZWxlbWVudCkpKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IENvdW50KCk7XG4iLCJjbGFzcyBIZWFkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmxhc3RMZXR0ZXIgPSAnJztcbiAgICB0aGlzLmFsbFN1Z2dlc3Rpb25zID0gW107XG4gICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgdGhpcy5tYXhTdWdnZXN0aW9ucyA9IDA7XG4gICAgdGhpcy5sYXN0VmFsID0gJyc7XG5cbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5oZWFkZXInLFxuICAgICAgdG9nZ2xlOiAnLmhlYWRlcl9fbmF2aWdhdGlvbicsXG4gICAgICBtZW51OiAnLmhlYWRlcl9fbWVnYW5hdicsXG4gICAgICBvdmVybGF5OiAnLmhlYWRlcl9fb3ZlcmxheScsXG4gICAgICBzZWFyY2g6ICcuaGVhZGVyX19kZXNrdG9wU2VhcmNoJyxcbiAgICAgIHNlYXJjaEZvcm06ICcuaGVhZGVyX19zZWFyY2hmb3JtJyxcbiAgICAgIHNlYXJjaEZvcm1Gb3JtOiAnLmhlYWRlcl9fc2VhcmNoZm9ybSBmb3JtJyxcbiAgICAgIHNlYXJjaEZvcm1JbnB1dDogJy5oZWFkZXJfX3NlYXJjaGZvcm0gLmZvcm0tZmllbGQnLFxuICAgICAgc2VhcmNoRm9ybUlucHV0Q2xlYXI6ICcuaGVhZGVyX19zZWFyY2hmb3JtIC5mb3JtLWdyb3VwIC5jbGVhcicsXG4gICAgICBzZWFyY2hTdWdnZXN0aW9uczogJy5oZWFkZXJfX3NlYXJjaGZvcm0gLnN1Z2dlc3Rpb25zJyxcblxuICAgICAgY291bnRyeTogJy5oZWFkZXJfX2Rlc2t0b3BDb3VudHJ5JyxcbiAgICAgIGNvdW50cnlGb3JtOiAnLmhlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsJyxcbiAgICAgIGNvdW50cnlTZWNvbmRhcnk6ICcuaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwgLm1vYiAud2VsY29tZXMgYSdcbiAgICB9O1xuXG4gICAgdGhpcy5jb29raWVOYW1lID0gJ2RobC1kZWZhdWx0LWxhbmd1YWdlJztcblxuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IDA7XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRvZ2dsZU1lbnUgPSB0aGlzLnRvZ2dsZU1lbnUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRvZ2dsZVNlYXJjaCA9IHRoaXMudG9nZ2xlU2VhcmNoLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaG93U2VhcmNoID0gdGhpcy5zaG93U2VhcmNoLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oaWRlU2VhcmNoID0gdGhpcy5oaWRlU2VhcmNoLmJpbmQodGhpcyk7XG4gICAgdGhpcy50b2dnbGVDb3VudHJ5ID0gdGhpcy50b2dnbGVDb3VudHJ5LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaG93Q291bnRyeSA9IHRoaXMuc2hvd0NvdW50cnkuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhpZGVDb3VudHJ5ID0gdGhpcy5oaWRlQ291bnRyeS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2VsZWN0Q291bnRyeVNlY29uZGFyeSA9IHRoaXMuc2VsZWN0Q291bnRyeVNlY29uZGFyeS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYm9keVNjcm9sbGluZyA9IHRoaXMuYm9keVNjcm9sbGluZy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5jaGVja1Njcm9sbCA9IHRoaXMuY2hlY2tTY3JvbGwuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldFBhdGhQcmVmaXggPSB0aGlzLmdldFBhdGhQcmVmaXguYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldFBhdGhQcmVmaXgoKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKGRvY3VtZW50KS5vbigna2V5ZG93bicsIHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCwgKGUpID0+IHtcbiAgICAgIC8vIGRvd24gYXJyb3cgPSA0MFxuICAgICAgLy8gcmlnaHQgYXJyb3cgPSAzOVxuICAgICAgLy8gdXAgYXJyb3cgPSAzOFxuICAgICAgLy8gbGVmdCBhcnJvdyA9IDM3XG4gICAgICAvLyB0YWIgPSA5XG4gICAgICBpZiAoKGUua2V5Q29kZSA9PT0gOSAmJiAoIWUuc2hpZnRLZXkpKSB8fCAoZS5rZXlDb2RlID09PSA0MCkgfHwgKGUua2V5Q29kZSA9PT0gMzkpKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCsrO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4ID49IHRoaXMubWF4U3VnZ2VzdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hvd1N1Z2dlc3Rpb25zKHRydWUpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICgoZS5rZXlDb2RlID09PSA5ICYmIChlLnNoaWZ0S2V5KSkgfHwgKGUua2V5Q29kZSA9PT0gMzcpIHx8IChlLmtleUNvZGUgPT09IDM4KSkge1xuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgtLTtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA8IDApIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSB0aGlzLm1heFN1Z2dlc3Rpb25zIC0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNob3dTdWdnZXN0aW9ucyh0cnVlKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgJChkb2N1bWVudCkub24oJ2tleXByZXNzJywgdGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0LCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgdmFyIGZpZWxkID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICB2YXIgcGFyYW1OYW1lID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgdmFyIHRlcm0gPSBmaWVsZC52YWwoKS50cmltKCk7XG4gICAgICAgIHZhciB1cmwgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdhY3Rpb24nKSArICc/JyArIHBhcmFtTmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh0ZXJtKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdXJsO1xuICAgICAgfVxuICAgIH0pO1xuICAgICQoZG9jdW1lbnQpLm9uKCdrZXl1cCcsIHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCwgKGUpID0+IHtcbiAgICAgIGlmICgoZS5rZXlDb2RlID09PSAxNikgfHwgKGUua2V5Q29kZSA9PT0gOSkgfHwgKGUua2V5Q29kZSA9PT0gNDApIHx8IChlLmtleUNvZGUgPT09IDM5KSB8fCAoZS5rZXlDb2RlID09PSAzNykgfHwgKGUua2V5Q29kZSA9PT0gMzgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZpZWxkID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgaWYgKGZpZWxkLnZhbCgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJCgnLnRvcC1zZWFyY2hlcycsIHRoaXMuc2VsLmNvbXBvbmVudCkuaGlkZSgpO1xuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dENsZWFyKS5zaG93KCk7XG4gICAgICAgIHRoaXMuY2hlY2tTdWdnZXN0aW9ucyhmaWVsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNsZWFyU3VnZ2VzdGlvbnMoKTtcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXRDbGVhcikuaGlkZSgpO1xuICAgICAgICAkKCcudG9wLXNlYXJjaGVzJywgdGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0Q2xlYXIsIChlKSA9PiB7XG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkudmFsKCcnKTtcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0Q2xlYXIpLmhpZGUoKTtcbiAgICAgIHRoaXMuY2xlYXJTdWdnZXN0aW9ucygpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwudG9nZ2xlLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy50b2dnbGVNZW51KCk7XG4gICAgfSk7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwub3ZlcmxheSwgdGhpcy50b2dnbGVNZW51KTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5zZWFyY2gsIHRoaXMudG9nZ2xlU2VhcmNoKTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5jb3VudHJ5LCB0aGlzLnRvZ2dsZUNvdW50cnkpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNvdW50cnlTZWNvbmRhcnksIHRoaXMuc2VsZWN0Q291bnRyeVNlY29uZGFyeSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmhlYWRlcl9fbGFuZywgLmhlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsIC5sYW5ncyBhLCAuaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwgLmNvdW50cmllcyBhJywgKGV2dCkgPT4ge1xuICAgICAgbGV0IGhyZWYgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJyk7XG4gICAgICBsZXQgaG9tZSA9ICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2RhdGEtaG9tZScpO1xuICAgICAgaWYgKGhvbWUgIT09IG51bGwgJiYgaG9tZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGhyZWYgPSBob21lO1xuICAgICAgfVxuXG4gICAgICBDb29raWVzLnNldCh0aGlzLmNvb2tpZU5hbWUsIGhyZWYpO1xuICAgIH0pO1xuXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCB0aGlzLmNoZWNrU2Nyb2xsKTtcbiAgICB0aGlzLmNoZWNrU2Nyb2xsKCk7XG5cbiAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkudmFsKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dENsZWFyKS5zaG93KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2hlY2tTY3JvbGwoKSB7XG4gICAgdmFyIHd0ID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgIHZhciBwYiA9ICQoJy5wYWdlLWJvZHknKS5vZmZzZXQoKS50b3A7XG4gICAgaWYgKHd0ID4gcGIpIHtcbiAgICAgICQoJy5wYWdlLWJvZHknKS5hZGRDbGFzcygnZml4ZWQnKTtcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnZml4ZWQnKTtcbiAgICAgIGlmICh3dCA+IHRoaXMubGFzdFNjcm9sbFRvcCkge1xuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkucmVtb3ZlQ2xhc3MoJ2luJyk7XG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLmFkZENsYXNzKCdoaWRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2luJyk7XG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJy5wYWdlLWJvZHknKS5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSB3dDtcbiAgfVxuXG4gIHRvZ2dsZU1lbnUoKSB7XG4gICAgaWYgKCEkKHRoaXMuc2VsLm1lbnUpLmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICB0aGlzLmJvZHlTY3JvbGxpbmcoZmFsc2UpO1xuICAgICAgJCh0aGlzLnNlbC50b2dnbGUpLmFkZENsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ib2R5U2Nyb2xsaW5nKHRydWUpO1xuICAgICAgJCh0aGlzLnNlbC50b2dnbGUpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKTtcbiAgICB9XG4gICAgJCh0aGlzLnNlbC5tZW51KS5zbGlkZVRvZ2dsZSgxNTApO1xuXG4gICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoRm9ybSkuaGFzQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpKSB7XG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLnJlbW92ZUNsYXNzKCdoZWFkZXJfX3NlYXJjaGZvcm0tLW9wZW4nKTtcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoKS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoLS1jbG9zZScpO1xuICAgICAgfSwgMTUwKTtcbiAgICB9XG4gICAgaWYgKCQodGhpcy5zZWwuY291bnRyeUZvcm0pLmhhc0NsYXNzKCdoZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbC0tb3BlbicpKSB7XG4gICAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKTtcbiAgICAgICQodGhpcy5zZWwuY291bnRyeSkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaCkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcENvdW50cnktLWNsb3NlJyk7XG4gICAgICB9LCAxNTApO1xuICAgIH1cbiAgfVxuXG4gIGJvZHlTY3JvbGxpbmcoZW5hYmxlZCkge1xuICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKTtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnYXV0byc7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdtb2RhbC1vcGVuJyk7XG4gICAgICBsZXQgd2luZG93SGVpZ2h0ID0gd2luZG93LnNjcmVlbi5hdmFpbEhlaWdodDtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLmhlaWdodCA9IHdpbmRvd0hlaWdodC50b1N0cmluZygpICsgJ3B4JztcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuaGVpZ2h0ID0gd2luZG93SGVpZ2h0LnRvU3RyaW5nKCkgKyAncHgnO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZVNlYXJjaChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaCkuaGFzQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKSkge1xuICAgICAgdGhpcy5oaWRlU2VhcmNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvd1NlYXJjaCgpO1xuXG4gICAgICAkKCcudG9wLXNlYXJjaGVzJywgdGhpcy5zZWwuY29tcG9uZW50KS5oaWRlKCk7XG4gICAgICAkKCcudG9wLXNlYXJjaGVzIC5pdGVtcycsIHRoaXMuc2VsLmNvbXBvbmVudCkuZW1wdHkoKTtcblxuICAgICAgdmFyIHVybCA9ICcnO1xuICAgICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2RhdGEtdG9wc2VhcmNoZXMnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHVybCA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2RhdGEtdG9wc2VhcmNoZXMnKTtcbiAgICAgIH1cbiAgICAgIGlmICh1cmwubGVuZ3RoID4gMCkge1xuICAgICAgICAkLmdldCh0aGlzLmdldFBhdGhQcmVmaXgoKSArIHVybCwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHZhciBjb250YWluZXIgPSAkKCcudG9wLXNlYXJjaGVzIC5pdGVtcycsIHRoaXMuc2VsLmNvbXBvbmVudCk7XG4gICAgICAgICAgdmFyIHBhcmFtTmFtZSA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgdmFyIGhhc1Rlcm1zID0gZmFsc2U7XG4gICAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHJlc3VsdC5yZXN1bHRzKSB7XG4gICAgICAgICAgICBoYXNUZXJtcyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgdGVybSA9IGVsZW1lbnQudHJpbSgpO1xuICAgICAgICAgICAgdmFyIHNlYXJjaFVybCA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2FjdGlvbicpICsgJz8nICsgcGFyYW1OYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRlcm0pO1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZChgPGEgaHJlZj0nJHtzZWFyY2hVcmx9JyB0aXRsZT0nJHt0ZXJtfSc+PHNwYW4+JHt0ZXJtfTwvc3Bhbj48L2E+YCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGhhc1Rlcm1zKSB7XG4gICAgICAgICAgICAkKCcudG9wLXNlYXJjaGVzJywgdGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzaG93U2VhcmNoKCkge1xuICAgICQodGhpcy5zZWwuY291bnRyeUZvcm0pLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbC0tb3BlbicpO1xuICAgICQodGhpcy5zZWwuY291bnRyeSkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XG5cbiAgICAkKHRoaXMuc2VsLnNlYXJjaCkuYWRkQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKTtcbiAgICAkKHRoaXMuc2VsLnNlYXJjaCkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykuYWRkQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XG4gICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtKS5hZGRDbGFzcygnaGVhZGVyX19zZWFyY2hmb3JtLS1vcGVuJyk7XG4gICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmZvY3VzKCk7XG5cbiAgICBpZiAoJCh0aGlzLnNlbC50b2dnbGUpLmhhc0NsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKSkge1xuICAgICAgdGhpcy5ib2R5U2Nyb2xsaW5nKHRydWUpO1xuICAgICAgJCh0aGlzLnNlbC50b2dnbGUpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKTtcbiAgICAgICQodGhpcy5zZWwubWVudSkuc2xpZGVUb2dnbGUoMTUwKTtcbiAgICB9XG4gIH1cblxuICBoaWRlU2VhcmNoKCkge1xuICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpO1xuICAgICQodGhpcy5zZWwuc2VhcmNoKS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJCh0aGlzLnNlbC5zZWFyY2gpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BTZWFyY2gtLWNsb3NlJyk7XG4gICAgfSwgMTUwKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNoZWNrU3VnZ2VzdGlvbnMoZmllbGQpIHtcbiAgICB2YXIgdmFsID0gJC50cmltKGZpZWxkLnZhbCgpKTtcbiAgICB2YXIgcyA9IHZhbC5zdWJzdHIoMCwgMSk7XG4gICAgaWYgKHMgPT09IHRoaXMubGFzdExldHRlcikge1xuICAgICAgdGhpcy5zaG93U3VnZ2VzdGlvbnMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XG4gICAgICB0aGlzLmxhc3RMZXR0ZXIgPSBzO1xuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTE7XG5cbiAgICAgIHZhciB1cmwgPSAnJztcbiAgICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdkYXRhLXN1Z2dlc3Rpb25zJykubGVuZ3RoID4gMCkge1xuICAgICAgICB1cmwgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdkYXRhLXN1Z2dlc3Rpb25zJyk7XG4gICAgICB9XG5cbiAgICAgICQuZ2V0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgdXJsLCB7IHM6IHMgfSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAocmVzdWx0LnJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hbGxTdWdnZXN0aW9ucyA9IFtdO1xuICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiByZXN1bHQucmVzdWx0cykge1xuICAgICAgICAgICAgdGhpcy5hbGxTdWdnZXN0aW9ucy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNob3dTdWdnZXN0aW9ucygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjbGVhclN1Z2dlc3Rpb25zKCkge1xuICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLmVtcHR5KCkuaGlkZSgpO1xuICB9XG5cbiAgc2hvd1N1Z2dlc3Rpb25zKHVzZUxhc3RWYWwpIHtcbiAgICB0aGlzLmNsZWFyU3VnZ2VzdGlvbnMoKTtcbiAgICB2YXIgdmFsID0gJC50cmltKCQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS52YWwoKSk7XG4gICAgaWYgKHVzZUxhc3RWYWwpIHtcbiAgICAgIHZhbCA9IHRoaXMubGFzdFZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXN0VmFsID0gdmFsO1xuICAgIH1cblxuICAgIHZhciBoYXNUZXJtcyA9IGZhbHNlO1xuICAgIHZhciBjID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYWxsU3VnZ2VzdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjb250YWlucyA9IGZhbHNlO1xuICAgICAgdmFyIHRlcm1zID0gdmFsLnRvTG93ZXJDYXNlKCkuc3BsaXQoL1xccy8pO1xuXG4gICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IHRlcm1zLmxlbmd0aDsgdCsrKSB7XG4gICAgICAgIGNvbnRhaW5zID0gdGhpcy5hbGxTdWdnZXN0aW9uc1tpXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRlcm1zW3RdLnRyaW0oKSk7XG4gICAgICAgIGlmIChjb250YWlucykgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoKHZhbC5sZW5ndGggPT09IDEpIHx8IGNvbnRhaW5zKSB7XG4gICAgICAgIHZhciBwYXJhbU5hbWUgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkuYXR0cignbmFtZScpO1xuICAgICAgICB2YXIgdGVybSA9IHRoaXMuYWxsU3VnZ2VzdGlvbnNbaV0udHJpbSgpO1xuICAgICAgICB2YXIgdXJsID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignYWN0aW9uJykgKyAnPycgKyBwYXJhbU5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodGVybSk7XG4gICAgICAgIHZhciBjbHMgPSAnJztcbiAgICAgICAgaWYgKGMgPT09IHRoaXMuc2VsZWN0ZWRJbmRleCkge1xuICAgICAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS52YWwodGVybSk7XG4gICAgICAgICAgY2xzID0gJyBjbGFzcz1cInNlbGVjdGVkXCInO1xuICAgICAgICB9XG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLmFwcGVuZChgPGEke2Nsc30gaHJlZj0nJHt1cmx9JyB0aXRsZT0nJHt0ZXJtfSc+PHNwYW4+JHt0ZXJtfTwvc3Bhbj48L2E+YCk7XG4gICAgICAgIGhhc1Rlcm1zID0gdHJ1ZTtcbiAgICAgICAgYysrO1xuICAgICAgfVxuXG4gICAgICBpZiAoYyA+PSAxMCkgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMubWF4U3VnZ2VzdGlvbnMgPSBjO1xuXG4gICAgaWYgKGhhc1Rlcm1zKSB7XG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaFN1Z2dlc3Rpb25zKS5zaG93KCk7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlQ291bnRyeShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICgkKHRoaXMuc2VsLmNvdW50cnkpLmhhc0NsYXNzKCdoZWFkZXJfX2Rlc2t0b3BDb3VudHJ5LS1jbG9zZScpKSB7XG4gICAgICB0aGlzLmhpZGVDb3VudHJ5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvd0NvdW50cnkoKTtcbiAgICB9XG4gIH1cblxuICBzaG93Q291bnRyeSgpIHtcbiAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLnJlbW92ZUNsYXNzKCdoZWFkZXJfX3NlYXJjaGZvcm0tLW9wZW4nKTtcbiAgICAkKHRoaXMuc2VsLnNlYXJjaCkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaCkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKTtcbiAgICB9LCAxNTApO1xuXG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5hZGRDbGFzcygnaGVhZGVyX19kZXNrdG9wQ291bnRyeS0tY2xvc2UnKTtcbiAgICAkKHRoaXMuc2VsLmNvdW50cnkpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLmFkZENsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xuICAgICQodGhpcy5zZWwuY291bnRyeUZvcm0pLmFkZENsYXNzKCdoZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbC0tb3BlbicpO1xuXG4gICAgaWYgKCQodGhpcy5zZWwudG9nZ2xlKS5oYXNDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJykpIHtcbiAgICAgIHRoaXMuYm9keVNjcm9sbGluZyh0cnVlKTtcbiAgICAgICQodGhpcy5zZWwudG9nZ2xlKS5yZW1vdmVDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XG4gICAgICAkKHRoaXMuc2VsLm1lbnUpLnNsaWRlVG9nZ2xlKDE1MCk7XG4gICAgfVxuICB9XG5cbiAgaGlkZUNvdW50cnkoKSB7XG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsLS1vcGVuJyk7XG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcbiAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5maW5kKCcubW9iJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wQ291bnRyeS0tY2xvc2UnKTtcbiAgICB9LCAxNTApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc2VsZWN0Q291bnRyeVNlY29uZGFyeShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQodGhpcy5zZWwuY291bnRyeUZvcm0pLmZpbmQoJy5tb2InKS5hZGRDbGFzcygnb3BlbicpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBIZWFkZXIoKTtcbiIsImNsYXNzIElFRGV0ZWN0b3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJ2JvZHknXG4gICAgfTtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZGV0ZWN0SUUgPSB0aGlzLmRldGVjdElFLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB2YXIgdmVyc2lvbiA9IHRoaXMuZGV0ZWN0SUUoKTtcbiAgICBpZiAodmVyc2lvbiAhPT0gZmFsc2UpIHtcbiAgICAgIGlmICh2ZXJzaW9uID49IDEyKSB7XG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnaWUtZWRnZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKGBpZS0ke3ZlcnNpb259YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZGV0ZWN0SUUoKSB7XG4gICAgdmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgLy8gVGVzdCB2YWx1ZXM7IFVuY29tbWVudCB0byBjaGVjayByZXN1bHQg4oCmXG4gICAgLy8gSUUgMTBcbiAgICAvLyB1YSA9ICdNb3ppbGxhLzUuMCAoY29tcGF0aWJsZTsgTVNJRSAxMC4wOyBXaW5kb3dzIE5UIDYuMjsgVHJpZGVudC82LjApJztcbiAgICAvLyBJRSAxMVxuICAgIC8vIHVhID0gJ01vemlsbGEvNS4wIChXaW5kb3dzIE5UIDYuMzsgVHJpZGVudC83LjA7IHJ2OjExLjApIGxpa2UgR2Vja28nOyAgICAvLyBFZGdlIDEyIChTcGFydGFuKVxuICAgIC8vIHVhID0gJ01vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdPVzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMzkuMC4yMTcxLjcxIFNhZmFyaS81MzcuMzYgRWRnZS8xMi4wJyAgICAvLyBFZGdlIDEzXG4gICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzQ2LjAuMjQ4Ni4wIFNhZmFyaS81MzcuMzYgRWRnZS8xMy4xMDU4Nic7XG4gICAgdmFyIG1zaWUgPSB1YS5pbmRleE9mKCdNU0lFICcpO1xuICAgIGlmIChtc2llID4gMCkge1xuICAgICAgLy8gSUUgMTAgb3Igb2xkZXIgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXG4gICAgICByZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKG1zaWUgKyA1LCB1YS5pbmRleE9mKCcuJywgbXNpZSkpLCAxMCk7XG4gICAgfVxuXG4gICAgdmFyIHRyaWRlbnQgPSB1YS5pbmRleE9mKCdUcmlkZW50LycpO1xuICAgIGlmICh0cmlkZW50ID4gMCkge1xuICAgICAgLy8gSUUgMTEgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXG4gICAgICB2YXIgcnYgPSB1YS5pbmRleE9mKCdydjonKTtcbiAgICAgIHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcocnYgKyAzLCB1YS5pbmRleE9mKCcuJywgcnYpKSwgMTApO1xuICAgIH1cblxuICAgIHZhciBlZGdlID0gdWEuaW5kZXhPZignRWRnZS8nKTtcbiAgICBpZiAoZWRnZSA+IDApIHtcbiAgICAgIC8vIEVkZ2UgKElFIDEyKykgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXG4gICAgICByZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKGVkZ2UgKyA1LCB1YS5pbmRleE9mKCcuJywgZWRnZSkpLCAxMCk7XG4gICAgfVxuXG4gICAgLy8gb3RoZXIgYnJvd3NlclxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSUVEZXRlY3RvcigpO1xuIiwiaW1wb3J0IFN0cmluZ3MgZnJvbSAnLi4vSGVscGVycy9TdHJpbmdzJztcblxuY2xhc3MgSW5QYWdlTmF2aWdhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLmluUGFnZU5hdmlnYXRpb24nLFxuICAgICAgbGlzdDogJy5pblBhZ2VOYXZpZ2F0aW9uX19saXN0JyxcbiAgICAgIGxpc3RJdGVtczogJy5pblBhZ2VOYXZpZ2F0aW9uX19pdGVtJyxcbiAgICAgIGxpbmtzOiAnLmluUGFnZU5hdmlnYXRpb25fX2xpbmsnLFxuICAgICAgc2VjdGlvbnM6ICcuaW5QYWdlTmF2aWdhdGlvblNlY3Rpb24nLFxuICAgICAgc2VjdGlvblRpdGxlOiAnLmluUGFnZU5hdmlnYXRpb25TZWN0aW9uX190aXRsZScsXG4gICAgICB0ZW1wbGF0ZTogJyNpblBhZ2VOYXZpZ2F0aW9uX190ZW1wbGF0ZSdcbiAgICB9O1xuICAgIHRoaXMuJHRlbXBsYXRlID0gbnVsbDtcbiAgICB0aGlzLnNlY3Rpb25PZmZzZXRzID0gW107XG4gICAgdGhpcy5jb21wb25lbnRIZWlnaHQgPSAwO1xuICAgIHRoaXMuYm90dG9tTGltaXQgPSAwO1xuXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5wb3B1bGF0ZUl0ZW1zID0gdGhpcy5wb3B1bGF0ZUl0ZW1zLmJpbmQodGhpcyk7XG4gICAgdGhpcy5hZGRPZmZzZXQgPSB0aGlzLmFkZE9mZnNldC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucG9zaXRpb25Db21wb25lbnQgPSB0aGlzLnBvc2l0aW9uQ29tcG9uZW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTY3JvbGwgPSB0aGlzLmhhbmRsZVNjcm9sbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlTGlua0NsaWNrID0gdGhpcy5oYW5kbGVMaW5rQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmNhbGN1bGF0ZVZhbHVlcyA9IHRoaXMuY2FsY3VsYXRlVmFsdWVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuaGFuZGxlU2Nyb2xsLCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmxpbmtzLCB0aGlzLmhhbmRsZUxpbmtDbGljayk7XG4gICAgJCh3aW5kb3cpLm9uKCdzdG9wLnJlc2l6ZScsIHRoaXMuY2FsY3VsYXRlVmFsdWVzKTtcbiAgfVxuXG4gIHBvcHVsYXRlSXRlbXMoKSB7XG4gICAgbGV0ICRzZWN0aW9ucyA9IFtdO1xuICAgICQodGhpcy5zZWwuc2VjdGlvbnMpLmVhY2goKGluZGV4LCBlbG0pID0+IHtcbiAgICAgIGxldCByYW5kb21JZCA9IFN0cmluZ3MuaWQoKTtcbiAgICAgICQoZWxtKS5hdHRyKCdpZCcsIHJhbmRvbUlkKTtcbiAgICAgIGxldCAkaXRlbSA9ICQodGhpcy4kdGVtcGxhdGUuY2xvbmUoKS5odG1sKCkpO1xuICAgICAgJGl0ZW0uZmluZCgnLmluUGFnZU5hdmlnYXRpb25fX2xpbmsnKS5hdHRyKCdocmVmJywgJyMnICsgcmFuZG9tSWQpO1xuICAgICAgJHNlY3Rpb25zLnB1c2goJGl0ZW0pO1xuICAgICAgdGhpcy5hZGRPZmZzZXQoJChlbG0pKTtcbiAgICB9KTtcbiAgICAkKHRoaXMuc2VsLmxpc3QpLmh0bWwoJycpLmFwcGVuZCgkc2VjdGlvbnMpO1xuICAgICQodGhpcy5zZWwubGlzdEl0ZW1zKS5maXJzdCgpLmZpbmQodGhpcy5zZWwubGlua3MpLmFkZENsYXNzKCdpblBhZ2VOYXZpZ2F0aW9uX19saW5rLS1hY3RpdmUnKTtcbiAgICB0aGlzLnBvc2l0aW9uQ29tcG9uZW50KCk7XG4gICAgLy8gU29ydCBvZmZzZXRzIHRvIGxhc3QgZmlyc3RcbiAgICB0aGlzLnNlY3Rpb25PZmZzZXRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChhLnRvcCA+IGIudG9wKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH0gZWxzZSBpZiAoYi50b3AgPiBhLnRvcCkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuICAgIHRoaXMuY2FsY3VsYXRlVmFsdWVzKCk7XG4gIH1cblxuICBjYWxjdWxhdGVWYWx1ZXMoKSB7XG4gICAgLy8gR2V0IHRoZSBoZWlnaHQgb2YgdGhlIGNvbXBvbmVudFxuICAgIHRoaXMuY29tcG9uZW50SGVpZ2h0ID0gJCh0aGlzLnNlbC5saXN0KS5oZWlnaHQoKTtcbiAgICAvLyBHZXQgdGhlIG1heGltdW0gZGlzdGFuY2UgZnJvbSB0aGUgdG9wIG9mIHRoZSBkb2N1bWVudCB0aGUgY29tcG9uZW50IGNhbiBtb3ZlXG4gICAgdGhpcy5ib3R0b21MaW1pdCA9ICQoJ2Zvb3RlcicpLm9mZnNldCgpLnRvcCAtIDgwO1xuICB9XG5cbiAgYWRkT2Zmc2V0KCRlbG0pIHtcbiAgICBsZXQgdG9wID0gJGVsbS5vZmZzZXQoKS50b3A7XG4gICAgbGV0IGlkID0gJGVsbS5hdHRyKCdpZCcpO1xuICAgIHRoaXMuc2VjdGlvbk9mZnNldHMucHVzaCh7XG4gICAgICB0b3A6IHRvcCxcbiAgICAgIGlkOiBpZFxuICAgIH0pO1xuICB9XG5cbiAgcG9zaXRpb25Db21wb25lbnQoKSB7XG4gICAgbGV0IHRvcFBvc2l0aW9uID0gJCh0aGlzLnNlbC5zZWN0aW9ucykuZmlyc3QoKS5vZmZzZXQoKS50b3A7XG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmNzcygndG9wJywgdG9wUG9zaXRpb24gKyAncHgnKTtcbiAgfVxuXG4gIGhhbmRsZVNjcm9sbCgpIHtcbiAgICAvLyBHZXQgdGhlIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uXG4gICAgbGV0IHNjcm9sbFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgIC8vIENhbGN1bGF0ZSB0aGUgYm90dG9tIHBvc2l0aW9uIG9mIHRoZSBsaXN0IHVzaW5nIHNjcm9sbCBwb3NpdGlvbiBub3QgZWxlbWVudCBwb3NpdGlvbi4gIElmIHVzZSBlbGVtZW50IHBvc2l0aW9uIGl0IGNoYW5nZXMgYmVjYXVzZSB3ZSBhZmZpeCBpdFxuICAgIGxldCBib3R0b21Qb3NpdGlvbiA9IHNjcm9sbFBvc2l0aW9uICsgKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpICsgKHRoaXMuY29tcG9uZW50SGVpZ2h0IC8gMik7XG4gICAgLy8gSWYgdGhlIGxpc3QgcG9zaXRpb24gaXMgb24gb3IgYmVsb3cgdGhlIGxpbWl0XG4gICAgaWYgKGJvdHRvbVBvc2l0aW9uID49IHRoaXMuYm90dG9tTGltaXQpIHtcbiAgICAgIC8vIEFmZml4IGl0XG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2luUGFnZU5hdmlnYXRpb24tLWFmZml4JykuZmluZCh0aGlzLnNlbC5saXN0KS5jc3MoJ3RvcCcsICh0aGlzLmJvdHRvbUxpbWl0IC0gdGhpcy5jb21wb25lbnRIZWlnaHQpICsgJ3B4Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVuLWFmZml4IGl0XG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkucmVtb3ZlQ2xhc3MoJ2luUGFnZU5hdmlnYXRpb24tLWFmZml4JykuZmluZCh0aGlzLnNlbC5saXN0KS5jc3MoJ3RvcCcsICcnKTtcbiAgICB9XG4gICAgLy8gR2V0IHRoZSBpbm5lciBoZWlnaHQgb2YgdGhlIHdpbmRvd1xuICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgLy8gRm9yIGVhY2ggc2VjdGlvbiBpbiB0aGUgcGFnZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zZWN0aW9uT2Zmc2V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gR2V0IHRoaXMgc2VjdGlvbiBpbmZvXG4gICAgICBsZXQgc2VjdGlvbiA9IHRoaXMuc2VjdGlvbk9mZnNldHNbaV07XG4gICAgICAvLyBJZiBzZWN0aW9uIGlzIDMzLjMzJSBmcm9tIHRvcCBvZiB2aWV3cG9ydCwgYWN0aXZhdGUgaXQncyBuYXYgaXRlbVxuICAgICAgaWYgKChzY3JvbGxQb3NpdGlvbiArICh3aW5kb3dIZWlnaHQgKiAwLjMzKSkgPj0gc2VjdGlvbi50b3ApIHtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBhY3RpdmUgY2xhc3MgZnJvbSBhbnkgb3RoZXIgbmF2IGl0ZW1cbiAgICAgICAgJCh0aGlzLnNlbC5saW5rcykucmVtb3ZlQ2xhc3MoJ2luUGFnZU5hdmlnYXRpb25fX2xpbmstLWFjdGl2ZScpO1xuICAgICAgICAvLyBBZGQgYWN0aXZlIGNsYXNzIHRvIHRoaXMgaXRlbVxuICAgICAgICAkKHRoaXMuc2VsLmxpbmtzKS5maWx0ZXIoJ1tocmVmPVwiIycgKyBzZWN0aW9uLmlkICsgJ1wiXScpLmFkZENsYXNzKCdpblBhZ2VOYXZpZ2F0aW9uX19saW5rLS1hY3RpdmUnKTtcbiAgICAgICAgLy8gU3RvcCBjaGVja2luZyBvdGhlciBzZWN0aW9ucywgaXQncyBpbiByZXZlcnNlIG9yZGVyXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVMaW5rQ2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgdGFyZ2V0SWQgPSAkKGUudGFyZ2V0KS5hdHRyKCdocmVmJyk7XG4gICAgbGV0IHNjcm9sbFBvc2l0aW9uID0gJCh0YXJnZXRJZCkub2Zmc2V0KCkudG9wO1xuICAgICQoJ2h0bWwsYm9keScpLmFuaW1hdGUoe1xuICAgICAgc2Nyb2xsVG9wOiBzY3JvbGxQb3NpdGlvblxuICAgIH0sIDMwMCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybjtcbiAgICB0aGlzLiR0ZW1wbGF0ZSA9ICQodGhpcy5zZWwudGVtcGxhdGUpO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIHRoaXMucG9wdWxhdGVJdGVtcygpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBJblBhZ2VOYXZpZ2F0aW9uKCk7XG4iLCJjbGFzcyBMYW5kaW5nUGFnZUJ1dHRvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLnBhZ2UtYm9keS5sYW5kaW5nLXBhZ2UtdHdvY29sIC5oZXJvIC5oZXJvX19jdGEnXG4gICAgfTtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNvbXBvbmVudCwgKGV2dCkgPT4ge1xuICAgICAgdmFyIGlkID0gJChldnQuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpO1xuICAgICAgdmFyIG9mZnNldCA9ICQoaWQpLm9mZnNldCgpLnRvcDtcbiAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgc2Nyb2xsVG9wOiBvZmZzZXRcbiAgICAgIH0sIDEwMDAsICdzd2luZycpO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IExhbmRpbmdQYWdlQnV0dG9uKCk7XG4iLCJjbGFzcyBTaGlwTm93VHdvU3RlcEZvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmZpcnN0bmFtZSA9ICcnO1xuICAgIHRoaXMubGFzdG5hbWUgPSAnJztcbiAgICB0aGlzLmVtYWlsID0gJyc7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIC8vIGZiQXBwSWQ6ICcxMDAwNzczMTYzMzM3Nzk4JyxcbiAgICAgIGZiQXBwSWQ6ICcxMDgwMDMxMzI4ODAxMjExJyxcbiAgICAgIC8vIGdvQ2xpZW50SWQ6ICc5MTM5NjAzNTIyMzYtdTd1bjBsMjJ0dmttbGJwYTViY25mMXVxZzRjc2k3ZTMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nLFxuICAgICAgZ29DbGllbnRJZDogJzMxMzQ2OTgzNzQyMC1sODgyaDM5Z2U4bjhuOXBiOTdsZHZqazNmbThwcHFncy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSdcbiAgICB9O1xuXG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuc2hpcE5vd011bHRpLnd5c2l3eWcsIC5hbmltYXRlZEZvcm0nLFxuICAgICAgc3dpbmdidXR0b246ICcuc2hpcE5vd011bHRpX19oZWFkY3RhLS1yZWQnLFxuICAgICAgZm9ybXM6ICdmb3JtLmZvcm1zLnNoaXAtbm93LXR3b3N0ZXAnLFxuICAgICAgZm9ybTE6ICdmb3JtLmZvcm1zLmZvcm0xLnNoaXAtbm93LXR3b3N0ZXAnLFxuICAgICAgZm9ybTI6ICdmb3JtLmZvcm1zLmZvcm0yLnNoaXAtbm93LXR3b3N0ZXAnLFxuICAgICAgY291bnRyeXNlbGVjdDogJ2Zvcm0uZm9ybXMuZm9ybTIuc2hpcC1ub3ctdHdvc3RlcCAjc2hpcG5vd19jb3VudHJ5JyxcblxuICAgICAgYnV0dG9uRmFjZWJvb2s6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmZhY2Vib29rJyxcbiAgICAgIGJ1dHRvbkxpbmtlZGluOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5saW5rZWRpbicsXG4gICAgICBidXR0b25Hb29nbGVQbHVzOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5nb29nbGUnXG4gICAgfTtcblxuICAgIHRoaXMuZ2V0UGF0aFByZWZpeCA9IHRoaXMuZ2V0UGF0aFByZWZpeC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy50b2dnbGVBZGRyZXNzID0gdGhpcy50b2dnbGVBZGRyZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRGYWNlYm9vayA9IHRoaXMuc3VibWl0RmFjZWJvb2suYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdExpbmtlZGluID0gdGhpcy5zdWJtaXRMaW5rZWRpbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0R29vZ2xlID0gdGhpcy5zdWJtaXRHb29nbGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEZvcm0xID0gdGhpcy5zdWJtaXRGb3JtMS5iaW5kKHRoaXMpO1xuICAgIHRoaXMubmV4dEZvcm0gPSB0aGlzLm5leHRGb3JtLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRGb3JtMiA9IHRoaXMuc3VibWl0Rm9ybTIuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldEZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvd1N1Y2Nlc3MgPSB0aGlzLnNob3dTdWNjZXNzLmJpbmQodGhpcyk7XG4gICAgdGhpcy52YWxpZGF0ZSA9IHRoaXMudmFsaWRhdGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldFBhdGhQcmVmaXgoKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6ICcnKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJChkb2N1bWVudCkub24oJ3N1Ym1pdCcsIHRoaXMuc2VsLmZvcm0xLCB0aGlzLnN1Ym1pdEZvcm0xKTtcbiAgICAkKGRvY3VtZW50KS5vbignc3VibWl0JywgdGhpcy5zZWwuZm9ybTIsIHRoaXMuc3VibWl0Rm9ybTIpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjaGFuZ2UnLCB0aGlzLnNlbC5jb3VudHJ5c2VsZWN0LCB0aGlzLnRvZ2dsZUFkZHJlc3MpO1xuXG4gICAgdmFyIGNvdW50cnkgPSAkKHRoaXMuc2VsLmZvcm0yKS5kYXRhKCdwcmVzZWxlY3Rjb3VudHJ5Jyk7XG4gICAgaWYgKChjb3VudHJ5ICE9PSBudWxsKSAmJiAkLnRyaW0oY291bnRyeSkubGVuZ3RoID4gMCkge1xuICAgICAgJCh0aGlzLnNlbC5jb3VudHJ5c2VsZWN0KS52YWwoY291bnRyeSkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfVxuXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkZhY2Vib29rKS5sZW5ndGggPiAwKSB7XG4gICAgICB3aW5kb3cuZmJBc3luY0luaXQgPSAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5mYl9pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mICh3aW5kb3cuRkIpICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuRkIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHdpbmRvdy5GQi5pbml0KHtcbiAgICAgICAgICAgICAgYXBwSWQ6IHRoaXMuY29uZmlnLmZiQXBwSWQsXG4gICAgICAgICAgICAgIGNvb2tpZTogdHJ1ZSxcbiAgICAgICAgICAgICAgeGZibWw6IHRydWUsXG4gICAgICAgICAgICAgIHZlcnNpb246ICd2Mi44J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmZiX2ludGVydmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhY2Vib29rLWpzc2RrJykgPT09IG51bGwpIHtcbiAgICAgICAgdmFyIGZqcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICAgICAgdmFyIGpzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgIGpzLmlkID0gJ2ZhY2Vib29rLWpzc2RrJztcbiAgICAgICAganMuc3JjID0gJy8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fRU4vc2RrLmpzJztcbiAgICAgICAgZmpzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGpzLCBmanMpO1xuICAgICAgfVxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLm9uKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgdGhpcy5zdWJtaXRGYWNlYm9vayhldnQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLmxlbmd0aCA+IDApIHtcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkxpbmtlZGluKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgIHRoaXMuc3VibWl0TGlua2VkaW4oZXZ0KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIGdvb2dsZUJ1dHRvbiA9ICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpO1xuICAgIGlmIChnb29nbGVCdXR0b24ubGVuZ3RoID4gMCkge1xuICAgICAgd2luZG93LmdvX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mICh3aW5kb3cuZ2FwaSkgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5nYXBpICE9PSBudWxsKSB7XG4gICAgICAgICAgd2luZG93LmdhcGkubG9hZCgnYXV0aDInLCAoKSA9PiB7XG4gICAgICAgICAgICB2YXIgYXV0aDIgPSB3aW5kb3cuZ2FwaS5hdXRoMi5pbml0KHtcbiAgICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNvbmZpZy5nb0NsaWVudElkLFxuICAgICAgICAgICAgICBjb29raWVwb2xpY3k6ICdzaW5nbGVfaG9zdF9vcmlnaW4nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBnb29nbGVCdXR0b24uZ2V0KDApO1xuICAgICAgICAgICAgYXV0aDIuYXR0YWNoQ2xpY2tIYW5kbGVyKGVsZW1lbnQsIHt9LFxuICAgICAgICAgICAgICAoZ29vZ2xlVXNlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3VibWl0R29vZ2xlKGdvb2dsZVVzZXIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3IgIT09ICdwb3B1cF9jbG9zZWRfYnlfdXNlcicpIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KHJlc3VsdC5lcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZ29faW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgICB9LCAxMDApO1xuXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5zd2luZ2J1dHRvbiwgKGV2dCkgPT4ge1xuICAgICAgdmFyIGlkID0gJChldnQuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpO1xuICAgICAgdmFyIG9mZnNldCA9ICQoaWQpLm9mZnNldCgpLnRvcDtcbiAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgc2Nyb2xsVG9wOiBvZmZzZXRcbiAgICAgIH0sIDEwMDAsICdzd2luZycpO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICB2YWxpZGF0ZSgpIHtcbiAgICAkKHRoaXMuc2VsLmZvcm1zKS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgJChpdGVtKS52YWxpZGF0ZSh7XG4gICAgICAgIGVycm9yUGxhY2VtZW50OiAoZXJyb3IsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgIGVycm9yLmluc2VydEFmdGVyKCQoZWxlbWVudCkucGFyZW50KCkuZmluZCgnbGFiZWwnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmlzKCdzZWxlY3QnKSkge1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLmZpbmQoJy5zZWxlY3Rib3hpdC1idG4nKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiAobGFiZWwpID0+IHtcbiAgICAgICAgICBsZXQgJHBhcmVudCA9ICQobGFiZWwpLnBhcmVudHMoJ2Zvcm0uc2hpcC1ub3cnKTtcbiAgICAgICAgICBpZiAoJHBhcmVudC5maW5kKCdzZWxlY3QnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkcGFyZW50LmZpbmQoJy5zZWxlY3Rib3hpdC1idG4nKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgdG9nZ2xlQWRkcmVzcyhlKSB7XG4gICAgdmFyIHZhbCA9ICQodGhpcy5zZWwuY291bnRyeXNlbGVjdCkudmFsKCk7XG5cbiAgICB2YXIgb3B0aW9ucyA9ICQoJ29wdGlvbicsIHRoaXMuc2VsLmNvdW50cnlzZWxlY3QpO1xuICAgIHZhciBtYW5kYXRvcnkgPSB0cnVlO1xuICAgIG9wdGlvbnMuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgIGlmICgkKGl0ZW0pLmF0dHIoJ3ZhbHVlJykgPT09IHZhbCAmJiAoJycgKyAkKGl0ZW0pLmRhdGEoJ25vbm1hbmRhdG9yeScpKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIG1hbmRhdG9yeSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG1hbmRhdG9yeSkge1xuICAgICAgJCgnI3NoaXBub3dfYWRkcmVzcycsIHRoaXMuc2VsLmZvcm0pLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQWRkcmVzcyonKTtcbiAgICAgICQoJyNzaGlwbm93X3ppcCcsIHRoaXMuc2VsLmZvcm0pLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnWklQIG9yIFBvc3Rjb2RlKicpO1xuICAgICAgJCgnI3NoaXBub3dfY2l0eScsIHRoaXMuc2VsLmZvcm0pLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQ2l0eSonKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnI3NoaXBub3dfYWRkcmVzcycsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQWRkcmVzcycpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmNsb3Nlc3QoJ2RpdicpLmZpbmQoJ2xhYmVsJykucmVtb3ZlKCk7XG4gICAgICAkKCcjc2hpcG5vd196aXAnLCB0aGlzLnNlbC5mb3JtKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ1pJUCBvciBQb3N0Y29kZScpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmNsb3Nlc3QoJ2RpdicpLmZpbmQoJ2xhYmVsJykucmVtb3ZlKCk7XG4gICAgICAkKCcjc2hpcG5vd19jaXR5JywgdGhpcy5zZWwuZm9ybSkucmVtb3ZlQXR0cigncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdDaXR5JykucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuY2xvc2VzdCgnZGl2JykuZmluZCgnbGFiZWwnKS5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICBzdWJtaXRGYWNlYm9vayhldnQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHdpbmRvdy5GQi5sb2dpbigobG9naW5SZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKGxvZ2luUmVzcG9uc2UuYXV0aFJlc3BvbnNlKSB7XG4gICAgICAgIHdpbmRvdy5GQi5hcGkoJy9tZScsIChkYXRhUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICB0aGlzLmZpcnN0bmFtZSA9IGRhdGFSZXNwb25zZS5maXJzdF9uYW1lO1xuICAgICAgICAgIHRoaXMubGFzdG5hbWUgPSBkYXRhUmVzcG9uc2UubGFzdF9uYW1lO1xuICAgICAgICAgIHRoaXMuZW1haWwgPSBkYXRhUmVzcG9uc2UuZW1haWw7XG5cbiAgICAgICAgICB0aGlzLm5leHRGb3JtKCk7XG4gICAgICAgIH0sIHsgZmllbGRzOiBbICdpZCcsICdlbWFpbCcsICdmaXJzdF9uYW1lJywgJ2xhc3RfbmFtZScgXX0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sIHsgc2NvcGU6ICdlbWFpbCxwdWJsaWNfcHJvZmlsZScsIHJldHVybl9zY29wZXM6IHRydWUgfSk7XG4gIH1cblxuICBzdWJtaXRMaW5rZWRpbihldnQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIElOLlVzZXIuYXV0aG9yaXplKCgpID0+IHtcbiAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XG4gICAgICAgIHZhciBtZW1iZXIgPSByZXN1bHQudmFsdWVzWzBdO1xuXG4gICAgICAgIHRoaXMuZmlyc3RuYW1lID0gbWVtYmVyLmZpcnN0TmFtZTtcbiAgICAgICAgdGhpcy5sYXN0bmFtZSA9IG1lbWJlci5sYXN0TmFtZTtcbiAgICAgICAgdGhpcy5lbWFpbCA9IG1lbWJlci5lbWFpbEFkZHJlc3M7XG5cbiAgICAgICAgdGhpcy5uZXh0Rm9ybSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICB2YXIgcmVzdWx0ID0gd2luZG93LklOLlVzZXIuaXNBdXRob3JpemVkKCk7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIElOLkFQSS5Qcm9maWxlKCdtZScpLmZpZWxkcygnaWQnLCAnZmlyc3QtbmFtZScsICdsYXN0LW5hbWUnLCAnZW1haWwtYWRkcmVzcycpLnJlc3VsdCgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgdmFyIG1lbWJlciA9IHJlc3VsdC52YWx1ZXNbMF07XG4gIFxuICAgICAgICAgIHRoaXMuZmlyc3RuYW1lID0gbWVtYmVyLmZpcnN0TmFtZTtcbiAgICAgICAgICB0aGlzLmxhc3RuYW1lID0gbWVtYmVyLmxhc3ROYW1lO1xuICAgICAgICAgIHRoaXMuZW1haWwgPSBtZW1iZXIuZW1haWxBZGRyZXNzO1xuICBcbiAgICAgICAgICB0aGlzLm5leHRGb3JtKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3VibWl0R29vZ2xlKGdvb2dsZVVzZXIpIHtcbiAgICB2YXIgYmFzaWNQcm9maWxlID0gZ29vZ2xlVXNlci5nZXRCYXNpY1Byb2ZpbGUoKTtcblxuICAgIHRoaXMuZmlyc3RuYW1lID0gYmFzaWNQcm9maWxlLmdldEdpdmVuTmFtZSgpO1xuICAgIHRoaXMubGFzdG5hbWUgPSBiYXNpY1Byb2ZpbGUuZ2V0RmFtaWx5TmFtZSgpO1xuICAgIHRoaXMuZW1haWwgPSBiYXNpY1Byb2ZpbGUuZ2V0RW1haWwoKTtcblxuICAgIHRoaXMubmV4dEZvcm0oKTtcbiAgfVxuXG4gIHN1Ym1pdEZvcm0xKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0ICRmb3JtID0gJChlLnRhcmdldCk7XG4gICAgbGV0IGZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YSgkZm9ybSk7XG5cbiAgICB0aGlzLmZpcnN0bmFtZSA9IGZvcm1EYXRhLmZpcnN0bmFtZTtcbiAgICB0aGlzLmxhc3RuYW1lID0gZm9ybURhdGEubGFzdG5hbWU7XG4gICAgdGhpcy5lbWFpbCA9IGZvcm1EYXRhLmVtYWlsO1xuXG4gICAgdGhpcy5uZXh0Rm9ybSgpO1xuICB9XG5cbiAgbmV4dEZvcm0oKSB7XG4gICAgJCgnLnNoaXBOb3dNdWx0aV9fZm9ybXN0ZXAtLXN0ZXAxJywgdGhpcy5zZWwuY29tcG9uZW50KS5oaWRlKCk7XG4gICAgJCgnLnNoaXBOb3dNdWx0aV9fZm9ybXN0ZXAtLXN0ZXAyJywgdGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgfVxuXG4gIHN1Ym1pdEZvcm0yKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0ICRmb3JtID0gJChlLnRhcmdldCk7XG4gICAgbGV0IGZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YSgkZm9ybSk7XG4gICAgZm9ybURhdGEuZmlyc3RuYW1lID0gdGhpcy5maXJzdG5hbWU7XG4gICAgZm9ybURhdGEubGFzdG5hbWUgPSB0aGlzLmxhc3RuYW1lO1xuICAgIGZvcm1EYXRhLmVtYWlsID0gdGhpcy5lbWFpbDtcblxuICAgICQucG9zdCh0aGlzLmdldFBhdGhQcmVmaXgoKSArICRmb3JtLmF0dHIoJ2FjdGlvbicpLCBmb3JtRGF0YSwgKGRhdGEpID0+IHtcbiAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ09LJykge1xuICAgICAgICB0aGlzLnNob3dTdWNjZXNzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRGb3JtRGF0YSgkZm9ybSkge1xuICAgIGxldCB1bmluZGV4ZWRBcnJheSA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG4gICAgbGV0IGluZGV4ZWRBcnJheSA9IHt9O1xuICAgICQubWFwKHVuaW5kZXhlZEFycmF5LCAobikgPT4gKGluZGV4ZWRBcnJheVtuLm5hbWVdID0gbi52YWx1ZSkpO1xuXG4gICAgaW5kZXhlZEFycmF5LnNvdXJjZSA9ICQudHJpbSgkZm9ybS5kYXRhKCdzb3VyY2UnKSk7XG4gICAgaW5kZXhlZEFycmF5LmxvID0gJC50cmltKCRmb3JtLmRhdGEoJ2xvJykpO1xuXG4gICAgcmV0dXJuIGluZGV4ZWRBcnJheTtcbiAgfVxuXG4gIHNob3dTdWNjZXNzKCkge1xuICAgIHZhciB0aGFua3MgPSAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDInLCB0aGlzLnNlbC5jb21wb25lbnQpLmRhdGEoXCJ0aGFua3NcIik7XG4gICAgaWYgKCh0aGFua3MgIT09IG51bGwpICYmICh0aGFua3MubGVuZ3RoID4gMCkpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoYW5rcztcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnLnNoaXBOb3dNdWx0aV9fZm9ybXN0ZXAtLXN0ZXAyJywgdGhpcy5zZWwuY29tcG9uZW50KS5oaWRlKCk7XG4gICAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tdGhhbmtzJywgdGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XG4gICAgfVxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTaGlwTm93VHdvU3RlcEZvcm0oKTtcbiIsIiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcbiAgJCgnLmFuaW1hdGVkUGFnZXNIZXJvX19hcnJvdycpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICBsZXQgbmV3VGFyZ2V0ID0gJCgnLmFuaW1hdGVkUGFnZXNIZXJvJykub2Zmc2V0KCkudG9wICsgJCgnLmFuaW1hdGVkUGFnZXNIZXJvJykub3V0ZXJIZWlnaHQoKTtcbiAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxUb3A6IG5ld1RhcmdldFxuICAgIH0sIDQwMCk7XG4gIH0pO1xuXG4gICQoJy5mb290ZXJfX2JhY2tUb1RvcCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICQodGhpcykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICAkKCdodG1sLGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sICdzbG93Jyk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSk7XG4gIH0pO1xufSk7XG5cbiQoZnVuY3Rpb24oJCwgd2luKSB7XG4gICQuZm4uaW5WaWV3cG9ydCA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSxlbCl7XG4gICAgICAgZnVuY3Rpb24gdmlzUHgoKXtcbiAgICAgICAgIHZhciBIID0gJCh0aGlzKS5oZWlnaHQoKSxcbiAgICAgICAgICAgICByID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIHQ9ci50b3AsIGI9ci5ib3R0b207XG4gICAgICAgICByZXR1cm4gY2IuY2FsbChlbCwgTWF0aC5tYXgoMCwgdD4wPyBILXQgOiAoYjxIP2I6SCkpKTtcbiAgICAgICB9IHZpc1B4KCk7XG4gICAgICAgJCh3aW4pLm9uKFwicmVzaXplIHNjcm9sbFwiLCB2aXNQeCk7XG4gICAgIH0pO1xuICB9O1xufShqUXVlcnksIHdpbmRvdykpO1xuXG4kKFwiLmpzLWNvdW50cnktZ2lmXCIpLmluVmlld3BvcnQoZnVuY3Rpb24ocHgpe1xuICAgIGlmKHB4ID4yMDApICQodGhpcykuYWRkQ2xhc3MoXCJ2aXNpYmxlXCIpIDtcbn0pO1xuXG5cbiIsImNsYXNzIFN0cmluZ3Mge1xuICBpZChsZW5ndGggPSAxNikge1xuICAgIGNvbnN0IHBvc3NpYmxlID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xuICAgIGxldCB0ZXh0ID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdGV4dCArPSBwb3NzaWJsZS5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGUubGVuZ3RoKSk7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTdHJpbmdzKCk7XG4iLCIoKCkgPT4ge1xuICAgIGlmICghd2luZG93LnBhcmVudC53aW5kb3cudGVzdCkgcmV0dXJuO1xuICAgIC8vIERpc2FibGUgY29uc29sZSBsb2cgZnVuY3Rpb25hbGl0eVxuICAgIHdpbmRvdy5jb25zb2xlLmxvZyA9ICgpID0+IHt9O1xuICAgIC8vIFN0YXJ0IHRlc3RcbiAgICBjb25zdCBkYXRhID0gd2luZG93LnBhcmVudC53aW5kb3cudGVzdC5yZXN1bHRzO1xuICAgIGxldCBzdHlsZXMgPSBkYXRhWzBdO1xuICAgIGxldCB3ZWlnaHRzID0gZGF0YVsxXTtcbiAgICAkKCdib2R5IConKS5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICBsZXQgZmFtaWx5ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZSgnZm9udC1mYW1pbHknKTtcbiAgICAgICAgaWYgKGZhbWlseS5pbmRleE9mKHdpbmRvdy5wYXJlbnQud2luZG93LnRlc3QucGFyYW1zLmZhbWlseSkgPCAwKSByZXR1cm47XG4gICAgICAgIGxldCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoJ2ZvbnQtc3R5bGUnKTtcbiAgICAgICAgaWYgKCFzdHlsZXMuaW5jbHVkZXMoc3R5bGUpKSBzdHlsZXMucHVzaChzdHlsZSk7XG4gICAgICAgIGxldCB3ZWlnaHQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCdmb250LXdlaWdodCcpO1xuICAgICAgICBpZiAoIXdlaWdodHMuaW5jbHVkZXMod2VpZ2h0KSkgd2VpZ2h0cy5wdXNoKHdlaWdodCk7XG4gICAgfSk7XG4gICAgLy8gTm90aWZ5IGF1dG9tYXRlZCB0ZXN0IHNjcmlwdFxuICAgIHdpbmRvdy5wYXJlbnQud2luZG93LnRlc3QubG9hZGluZyA9IGZhbHNlO1xuICAgIHdpbmRvdy5wYXJlbnQud2luZG93LnRlc3QucmVzdWx0cyA9IFtzdHlsZXMsIHdlaWdodHNdO1xufSkoKTsiLCJpbXBvcnQgJy4vVGVzdHMvRm9udHMnO1xuXG4vLyBJbXBvcnQgY29tcG9uZW50c1xuaW1wb3J0IEhlYWRlciBmcm9tICcuL0NvbXBvbmVudHMvSGVhZGVyJztcbmltcG9ydCBJRURldGVjdG9yIGZyb20gJy4vQ29tcG9uZW50cy9JRURldGVjdG9yJztcbmltcG9ydCBMYW5kaW5nUGFnZUJ1dHRvbiBmcm9tICcuL0NvbXBvbmVudHMvTGFuZGluZ1BhZ2VCdXR0b24nO1xuaW1wb3J0IENvdW50IGZyb20gJy4vQ29tcG9uZW50cy9Db3VudCc7XG5pbXBvcnQgQW5pbWF0ZWRGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9BbmltYXRlZEZvcm0nO1xuaW1wb3J0IENhcm91c2VsUm93IGZyb20gJy4vQ29tcG9uZW50cy9DYXJvdXNlbFJvdyc7XG5pbXBvcnQgQW5pbWF0ZWRQYXJhbGxheCBmcm9tICcuL0NvbXBvbmVudHMvQW5pbWF0ZWRQYXJhbGxheCc7XG5pbXBvcnQgU21vb3RoU2Nyb2xsIGZyb20gJy4vQ29tcG9uZW50cy9TbW9vdGhTY3JvbGwnO1xuaW1wb3J0IEFuaW1hdGVkU2hvd2Nhc2VQYW5lbCBmcm9tICcuL0NvbXBvbmVudHMvQW5pbWF0ZWRTaG93Y2FzZVBhbmVsJztcbmltcG9ydCBBbmltYXRlZFBhZ2VzSGVybyBmcm9tICcuL0NvbXBvbmVudHMvQW5pbWF0ZWRQYWdlc0hlcm8nO1xuaW1wb3J0IEluUGFnZU5hdmlnYXRpb24gZnJvbSAnLi9Db21wb25lbnRzL0luUGFnZU5hdmlnYXRpb24nO1xuaW1wb3J0IFNoaXBOb3dUd29TdGVwRm9ybSBmcm9tICcuL0NvbXBvbmVudHMvU2hpcE5vd1R3b1N0ZXBGb3JtJztcblxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuICB0cnkge1xuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKCd0b3VjaCcpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gbm90aGluZ1xuICB9XG4gIC8vIEluaXRpYXRlIGNvbXBvbmVudHNcbiAgSUVEZXRlY3Rvci5pbml0KCk7XG4gIEhlYWRlci5pbml0KCk7XG4gIENvdW50LmluaXQoKTtcbiAgTGFuZGluZ1BhZ2VCdXR0b24uaW5pdCgpO1xuICAvLyBBbmltYXRlZEZvcm0uaW5pdCgpO1xuICBDYXJvdXNlbFJvdy5pbml0KCk7XG4gIEFuaW1hdGVkUGFyYWxsYXguaW5pdCgpO1xuICBBbmltYXRlZFNob3djYXNlUGFuZWwuaW5pdCgpO1xuICBJblBhZ2VOYXZpZ2F0aW9uLmluaXQoKTtcbiAgU2hpcE5vd1R3b1N0ZXBGb3JtLmluaXQoKTtcblxufSk7XG5cbkFuaW1hdGVkUGFnZXNIZXJvLmluaXQoKTtcblxuXG4iXX0=
