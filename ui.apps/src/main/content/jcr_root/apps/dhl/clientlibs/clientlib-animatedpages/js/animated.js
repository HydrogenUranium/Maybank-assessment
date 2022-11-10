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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BbmltYXRlZEZvcm0uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BbmltYXRlZFBhZ2VzSGVyby5qcyIsImpzL2Rldi9Db21wb25lbnRzL0FuaW1hdGVkUGFyYWxsYXguanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BbmltYXRlZFNob3djYXNlUGFuZWwuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9DYXJvdXNlbFJvdy5qcyIsImpzL2Rldi9Db21wb25lbnRzL0NvdW50LmpzIiwianMvZGV2L0NvbXBvbmVudHMvSGVhZGVyLmpzIiwianMvZGV2L0NvbXBvbmVudHMvSUVEZXRlY3Rvci5qcyIsImpzL2Rldi9Db21wb25lbnRzL0luUGFnZU5hdmlnYXRpb24uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9MYW5kaW5nUGFnZUJ1dHRvbi5qcyIsImpzL2Rldi9Db21wb25lbnRzL1NoaXBOb3dUd29TdGVwRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1Ntb290aFNjcm9sbC5qcyIsImpzL2Rldi9IZWxwZXJzL1N0cmluZ3MuanMiLCJqcy9kZXYvVGVzdHMvRm9udHMuanMiLCJqcy9kZXYvYW5pbWF0ZWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDQU0saUI7QUFDSiwrQkFBYztBQUFBOztBQUNaLFNBQUssR0FBTCxHQUFXO0FBQ1QsaUJBQVcsb0JBREY7QUFFVCxXQUFLLHlCQUZJO0FBR1Qsb0JBQWMsaUNBSEw7QUFJVCxhQUFPO0FBSkUsS0FBWDs7QUFPQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFwQjtBQUNBLFNBQUssT0FBTCxHQUFl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QUFyQjtBQUNBLE1BQUUsTUFBRixFQUFVLFFBQVYsQ0FBbUIsT0FBbkI7QUFDRCxHQUhELENBR0UsT0FBTyxDQUFQLEVBQVUsQ0FFWDtBQURDOztBQUVGO0FBQ0EsdUJBQVcsSUFBWDtBQUNBLG1CQUFPLElBQVA7QUFDQSxrQkFBTSxJQUFOO0FBQ0EsOEJBQWtCLElBQWxCO0FBQ0E7QUFDQSx3QkFBWSxJQUFaO0FBQ0EsNkJBQWlCLElBQWpCO0FBQ0Esa0NBQXNCLElBQXRCO0FBQ0EsNkJBQWlCLElBQWpCO0FBQ0EsK0JBQW1CLElBQW5CO0FBRUQsQ0FuQkQ7O0FBcUJBLDRCQUFrQixJQUFsQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qXG52YXIgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtJyk7XG52YXIgc2Vjb25kRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hbmltYXRlZEZvcm1fX3NlY29uZEZvcm0nKTtcbnZhciBidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0Jyk7XG5cbiAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBzZWNvbmRGb3JtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXG59KTtcbiovIiwiY2xhc3MgQW5pbWF0ZWRQYWdlc0hlcm8ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5hbmltYXRlZFBhZ2VzSGVybycsXG4gICAgICB2YW46ICcuYW5pbWF0ZWRQYWdlc0hlcm9fX3ZhbicsXG4gICAgICBhbmltYXRpb25HaWY6ICcuYW5pbWF0ZWRQYWdlc0hlcm9fX2NvbnN1bWVyR2lmJyxcbiAgICAgIHZpZGVvOiAnLmFuaW1hdGVkUGFnZXNIZXJvX192aWRlbydcbiAgICB9O1xuXG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTY3JvbGwgPSB0aGlzLmhhbmRsZVNjcm9sbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucHJlbG9hZCA9IHRoaXMucHJlbG9hZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhhbmRsZVNjcm9sbCwge3Bhc3NpdmU6IHRydWV9KTtcbiAgfVxuXG4gIHByZWxvYWQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuYW5pbWF0aW9uR2lmKS5sZW5ndGggPD0gMCkgcmV0dXJuO1xuICAgIGxldCBnaWYgPSBuZXcgSW1hZ2UoKTtcbiAgICBnaWYub25sb2FkID0gKCkgPT4ge1xuICAgICAgJCh0aGlzLnNlbC5hbmltYXRpb25HaWYpLmF0dHIoJ3NyYycsICQodGhpcy5zZWwuYW5pbWF0aW9uR2lmKS5hdHRyKCdkYXRhLXNyYycpKTtcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnYW5pbWF0ZWRQYWdlc0hlcm8tLWxvYWRlZCcpO1xuICAgIH07XG4gICAgZ2lmLnNyYyA9ICQodGhpcy5zZWwuYW5pbWF0aW9uR2lmKS5hdHRyKCdkYXRhLXNyYycpO1xuICB9XG5cbiAgaGFuZGxlU2Nyb2xsKCkge1xuICAgIGlmICgkKGRvY3VtZW50KS5zY3JvbGxUb3AoKSA+IDApIHtcbiAgICAgICQodGhpcy5zZWwudmFuKS5hZGRDbGFzcygnYW5pbWF0ZWRQYWdlc0hlcm9fX3Zhbi0tb3V0Jyk7XG4gICAgfVxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBzZXRUaW1lb3V0KHRoaXMuYmluZEV2ZW50cywgNTE2MCk7XG4gICAgdGhpcy5wcmVsb2FkKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEFuaW1hdGVkUGFnZXNIZXJvKCk7XG4iLCJjbGFzcyBBbmltYXRlZFBhcmFsbGF4IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcucGFyYWxsYXhTZWN0aW9uJyxcbiAgICAgIHRpbGVzOiAnLnBhcmFsbGF4U2VjdGlvbl9fdGlsZTpub3QoLnBhcmFsbGF4U2VjdGlvbl9fdGlsZS0tbm9QYXJhbGxheCknXG4gICAgfTtcbiAgICB0aGlzLnRpbGVzID0gW107XG5cbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVNjcm9sbCA9IHRoaXMuaGFuZGxlU2Nyb2xsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRUaWxlcyA9IHRoaXMuZ2V0VGlsZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVTY3JvbGwsIHtwYXNzaXZlOiB0cnVlfSk7XG4gICAgJCh3aW5kb3cpLm9uKCdzdG9wLnJlc2l6ZScsIHRoaXMuaGFuZGxlU2Nyb2xsKTtcbiAgfVxuXG4gIGhhbmRsZVNjcm9sbCgpIHtcbiAgICBsZXQgc2Nyb2xsUG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgbGV0IHZpc2libGVUaWxlcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50aWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHRpbGUgPSB0aGlzLnRpbGVzW2ldO1xuICAgICAgaWYgKHRpbGUub2Zmc2V0VG9wIDwgc2Nyb2xsUG9zaXRpb24pIHtcbiAgICAgICAgdmlzaWJsZVRpbGVzLnB1c2godGlsZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlzaWJsZVRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgdGlsZSA9IHZpc2libGVUaWxlc1tpXTtcbiAgICAgIGxldCBtdWx0aXBsaWVyID0gdGlsZS4kdGlsZS5oYXNDbGFzcygncGFyYWxsYXhTZWN0aW9uX190aWxlLS1mYXN0UGFyYWxsYXgnKSA/IDAuNiA6IDAuMztcbiAgICAgIGxldCBtdWx0aXBsaWVyT3ZlcnJpZGUgPSB0aWxlLiR0aWxlLmF0dHIoJ2RhdGEtbXVsdGlwbGllcicpO1xuICAgICAgaWYgKG11bHRpcGxpZXJPdmVycmlkZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG11bHRpcGxpZXIgPSBtdWx0aXBsaWVyT3ZlcnJpZGU7XG4gICAgICB9XG5cbiAgICAgIGxldCBwYXJhbGxheERpdmlkZXIgPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/IDQgOiAyO1xuICAgICAgbGV0IHBhcmFsbGF4T2Zmc2V0ID0gKHRpbGUub2Zmc2V0VG9wIC0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpKSAqIG11bHRpcGxpZXI7XG4gICAgICBpZiAodGlsZS4kdGlsZS5oYXNDbGFzcygncGFyYWxsYXhTZWN0aW9uX190aWxlLS1kb3duJykpIHtcbiAgICAgICAgcGFyYWxsYXhPZmZzZXQgPSAoKHdpbmRvdy5pbm5lckhlaWdodCArICQod2luZG93KS5zY3JvbGxUb3AoKSkgLSAodGlsZS5vZmZzZXRUb3AgKyB0aWxlLmhlaWdodCkpICogbXVsdGlwbGllcjtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld1RvcCA9ICh0aWxlLm9yaWdpbmFsVG9wICsgKHBhcmFsbGF4T2Zmc2V0IC8gcGFyYWxsYXhEaXZpZGVyKSk7XG4gICAgICBsZXQgbWF4VG9wID0gKHRpbGUuJHRpbGUuYXR0cignZGF0YS1tYXgtdG9wJykpO1xuICAgICAgbGV0IG1pblRvcCA9ICh0aWxlLiR0aWxlLmF0dHIoJ2RhdGEtbWluLXRvcCcpKTtcblxuICAgICAgaWYgKG1pblRvcCAhPT0gdW5kZWZpbmVkICYmIG5ld1RvcCA8PSBtaW5Ub3ApIHtcbiAgICAgICAgbmV3VG9wID0gbWluVG9wO1xuICAgICAgfVxuXG4gICAgICBpZiAobWF4VG9wICE9IHVuZGVmaW5lZCAmJiBuZXdUb3AgPj0gbWF4VG9wKSB7XG4gICAgICAgIG5ld1RvcCA9IG1heFRvcDtcbiAgICAgIH1cblxuICAgICAgdGlsZS4kdGlsZS5jc3MoJ3RvcCcsIG5ld1RvcCArICdweCcpO1xuICAgIH1cbiAgfVxuXG4gIGdldFRpbGVzKCkge1xuICAgICQodGhpcy5zZWwudGlsZXMpLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICBsZXQgJHRpbGUgPSAkKGVsZW1lbnQpO1xuICAgICAgbGV0IHRvcFBvc2l0aW9uID0gcGFyc2VJbnQoJHRpbGUuY3NzKCd0b3AnKSwgMTApO1xuICAgICAgbGV0IG9mZnNldFRvcCA9ICR0aWxlLm9mZnNldCgpLnRvcDtcbiAgICAgIHRoaXMudGlsZXMucHVzaCh7XG4gICAgICAgICR0aWxlOiAkdGlsZSxcbiAgICAgICAgb3JpZ2luYWxUb3A6IHRvcFBvc2l0aW9uLFxuICAgICAgICBvZmZzZXRUb3A6IG9mZnNldFRvcCxcbiAgICAgICAgaGVpZ2h0OiAkdGlsZS5vdXRlckhlaWdodCgpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuO1xuICAgIHRoaXMuZ2V0VGlsZXMoKTtcbiAgICB0aGlzLmhhbmRsZVNjcm9sbCgpO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBBbmltYXRlZFBhcmFsbGF4KCk7XG4iLCJjbGFzcyBTaG93Y2FzZVBhbmVsIHtcbiAgY29uc3RydWN0b3IoJGVsZW1lbnQpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjYXJvdXNlbDogJy5hbmltYXRlZFNob3djYXNlUGFuZWxfX2Nhcm91c2VsJyxcbiAgICAgIGl0ZW1zOiAnLmFuaW1hdGVkU2hvd2Nhc2VQYW5lbF9fY2Fyb3VzZWxJdGVtJyxcbiAgICAgIHN0YWNrZWRJdGVtczogJy5hbmltYXRlZFNob3djYXNlUGFuZWxfX2Nhcm91c2VsSXRlbTpub3QoLmFuaW1hdGVkU2hvd2Nhc2VQYW5lbF9fY2Fyb3VzZWxJdGVtLS1oaWRkZW4pJyxcbiAgICAgIG5hdmlnYXRpb246ICcuYW5pbWF0ZWRTaG93Y2FzZVBhbmVsX19jYXJvdXNlbE5hdmlnYXRpb24nLFxuICAgICAgbmF2aWdhdGlvbkl0ZW06ICcuYW5pbWF0ZWRTaG93Y2FzZVBhbmVsX19jYXJvdXNlbE5hdmlnYXRpb25JdGVtJ1xuICAgIH07XG5cbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRvSGlkZSA9IHRoaXMuZG9IaWRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5kb1Nob3cgPSB0aGlzLmRvU2hvdy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2hvd0l0ZW0gPSB0aGlzLnNob3dJdGVtLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zY2FsZUl0ZW1zID0gdGhpcy5zY2FsZUl0ZW1zLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jcmVhdGVOYXZpZ2F0aW9uID0gdGhpcy5jcmVhdGVOYXZpZ2F0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5pdGVtcykuc3dpcGUoe1xuICAgICAgc3dpcGU6IChldmVudCwgZGlyZWN0aW9uKSA9PiB7XG4gICAgICAgIGxldCAkaXRlbSA9ICgkKGV2ZW50LnRhcmdldCkuaGFzQ2xhc3MoJ2FuaW1hdGVkU2hvd2Nhc2VQYW5lbF9fY2Fyb3VzZWxJdGVtJykpID8gJChldmVudC50YXJnZXQpIDogJChldmVudC50YXJnZXQpLnBhcmVudHModGhpcy5zZWwuaXRlbXMpO1xuICAgICAgICBsZXQgaW5kZXggPSAkaXRlbS5pbmRleCgpO1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcbiAgICAgICAgICB0aGlzLnNob3dJdGVtKGluZGV4ICsgMSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgdGhpcy5zaG93SXRlbShpbmRleCAtIDEpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWxsb3dQYWdlU2Nyb2xsOiAndmVydGljYWwnXG4gICAgfSk7XG4gICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2snLCB0aGlzLnNlbC5uYXZpZ2F0aW9uSXRlbSwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuc2hvd0l0ZW0oJChlLnRhcmdldCkuaW5kZXgoKSk7XG4gICAgfSk7XG4gIH1cblxuICBkb0hpZGUoJGl0ZW0pIHtcbiAgICAkaXRlbS5hZGRDbGFzcygnYW5pbWF0ZWRTaG93Y2FzZVBhbmVsX19jYXJvdXNlbEl0ZW0tLWhpZGRlbicpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJGl0ZW0uaGlkZSgpO1xuICAgIH0sIDI1MCk7XG4gICAgdGhpcy5zY2FsZUl0ZW1zKCk7XG4gIH1cblxuICBkb1Nob3coJGl0ZW0pIHtcbiAgICAkaXRlbS5zaG93KCgpID0+IHtcbiAgICAgICRpdGVtLnJlbW92ZUNsYXNzKCdhbmltYXRlZFNob3djYXNlUGFuZWxfX2Nhcm91c2VsSXRlbS0taGlkZGVuJyk7XG4gICAgICB0aGlzLnNjYWxlSXRlbXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNob3dJdGVtKGluZGV4KSB7XG4gICAgLy8gSW5kZXggY2FuJ3QgYmUgbGVzcyB0aGFuIDBcbiAgICBpbmRleCA9IE1hdGgubWF4KGluZGV4LCAwKTtcbiAgICAvLyBJbmRleCBjYW4ndCBiZSBtb3JlIHRoYW4gdGhlIG51bWJlciBvZiBpdGVtc1xuICAgIGluZGV4ID0gTWF0aC5taW4oaW5kZXgsICh0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuaXRlbXMpLmxlbmd0aCAtIDEpKTtcbiAgICAvLyBGaW5kIHRoZSBjdXJyZW50IHBvc2l0aW9uXG4gICAgbGV0IGN1cnJlbnRJbmRleCA9IHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5zdGFja2VkSXRlbXMpLmZpcnN0KCkuaW5kZXgoKTtcbiAgICAvLyBHZXQgdGhlIG51bWJlciBvZiBpdGVtcyB0byBtb3ZlXG4gICAgbGV0IG9mZnNldCA9IGN1cnJlbnRJbmRleCAtIGluZGV4O1xuICAgIC8vIExvb3AgdGhlIG51bWJlciBvZiB0aGUgb2Zmc2V0XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmFicyhvZmZzZXQpOyBpKyspIHtcbiAgICAgIC8vIFRoZSBhY3Rpb24gdG8gZXRoZWlyIHNob3cgb3IgaGlkZSBkZXBlbmRpbmcgb24gZGlyZWN0aW9uXG4gICAgICBsZXQgYWN0aW9uID0gdGhpcy5kb0hpZGU7XG4gICAgICAvLyBUaGUgaXRlbSBpbmRleCBkZXBlbmRpbmcgb24gZGlyZWN0aW9uXG4gICAgICBsZXQgaXRlbUluZGV4ID0gY3VycmVudEluZGV4ICsgaTtcbiAgICAgIC8vIElmIHNob3VsZCBiZSBzaG93aW5nIGl0ZW1zXG4gICAgICBpZiAob2Zmc2V0ID4gMCkge1xuICAgICAgICAvLyBDaGFuZ2UgYWN0aW9uXG4gICAgICAgIGFjdGlvbiA9IHRoaXMuZG9TaG93O1xuICAgICAgICAvLyBDaGFuZ2UgaW5kZXhcbiAgICAgICAgaXRlbUluZGV4ID0gY3VycmVudEluZGV4IC0gKGkgKyAxKTtcbiAgICAgIH1cbiAgICAgIC8vIEdldCB0aGUgaXRlbSBhdCB0aGUgaW5kZXhcbiAgICAgIGxldCAkaXRlbSA9IHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5pdGVtcykuZXEoaXRlbUluZGV4KTtcbiAgICAgIC8vIFJ1biB0aGUgYWN0aW9uIHdpdGggYSB0aW1lb3V0XG4gICAgICBzZXRUaW1lb3V0KGFjdGlvbiwgMjUwICogaSwgJGl0ZW0pO1xuICAgIH1cbiAgICAvLyBSZW1vdmUgYWN0aXZlIG5hdmlnYXRpb24gaXRlbVxuICAgIHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5uYXZpZ2F0aW9uKS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIC8vIFNldCB0aGUgY29ycmVjdCBuYWdpdmF0aW9uIGl0ZW0gdG8gYWN0aXZlXG4gICAgdGhpcy4kZWxlbWVudC5maW5kKHRoaXMuc2VsLm5hdmlnYXRpb25JdGVtKS5lcShpbmRleCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgc2NhbGVJdGVtcygpIHtcbiAgICB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuc3RhY2tlZEl0ZW1zKS5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgbGV0ICRpdGVtID0gJChlbGVtZW50KTtcbiAgICAgIC8vIE5vIHRyYW5zZm9ybSBmb3IgZmlyc3QgaXRlbVxuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICRpdGVtLmNzcygndHJhbnNmb3JtJywgJ25vbmUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBzY2FsZSwgNSUgc21hbGxlciBmb3IgZWFjaCBpdGVtXG4gICAgICBsZXQgc2NhbGUgPSAxIC0gKDAuMDUgKiBpbmRleCk7XG4gICAgICAvLyBDYWxjdWxhdGUgaG93IGZhciB0byBtb3ZlIHRoZSBpdGVtIHJpZ2h0LCBzaG91bGQgYmUgMTVweCBidXQgbmVlZHMgdG8gYWNjb3VudCBmb3Igc2NhbGVcbiAgICAgIGxldCB0cmFuc2xhdGUgPSBwYXJzZUludCgxNSAqICgxICsgKDAuMDUgKiBpbmRleCkpLCAxMCkgKiBpbmRleDtcbiAgICAgIC8vIFVwZGF0ZSB0aGUgaXRlbVxuICAgICAgJGl0ZW0uY3NzKCd0cmFuc2Zvcm0nLCAnc2NhbGUoJyArIHNjYWxlICsgJykgdHJhbnNsYXRlWCgnICsgdHJhbnNsYXRlICsgJ3B4KScpO1xuICAgIH0pO1xuICAgIC8vIEFkZCByZWFkeSBjbGFzcyB0byBjYXJvdXNlbFxuICAgIHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5jYXJvdXNlbCkuYWRkQ2xhc3MoJ2FuaW1hdGVkU2hvd2Nhc2VQYW5lbF9fY2Fyb3VzZWwtLXJlYWR5Jyk7XG4gIH1cblxuICBjcmVhdGVOYXZpZ2F0aW9uKCkge1xuICAgIGlmICh0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwubmF2aWdhdGlvbikubGVuZ3RoID4gMCkgcmV0dXJuO1xuICAgIGxldCBuYXZJdGVtcyA9ICcnO1xuICAgIHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5pdGVtcykuZWFjaCgoaW5kZXgpID0+IHtcbiAgICAgIG5hdkl0ZW1zICs9ICc8bGkgY2xhc3M9XCJhbmltYXRlZFNob3djYXNlUGFuZWxfX2Nhcm91c2VsTmF2aWdhdGlvbkl0ZW0nICsgKGluZGV4ID09PSAwID8gJyBhY3RpdmUnIDogJycpICsgJ1wiPjwvbGk+JztcbiAgICB9KTtcbiAgICB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuY2Fyb3VzZWwpLmFmdGVyKCc8b2wgY2xhc3M9XCJhbmltYXRlZFNob3djYXNlUGFuZWxfX2Nhcm91c2VsTmF2aWdhdGlvblwiPicgKyBuYXZJdGVtcyArICc8L29sPicpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB0aGlzLmNyZWF0ZU5hdmlnYXRpb24oKTtcbiAgICB0aGlzLnNjYWxlSXRlbXMoKTtcbiAgfVxufVxuXG5jbGFzcyBBbmltYXRlZFNob3djYXNlUGFuZWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5hbmltYXRlZFNob3djYXNlUGFuZWwnXG4gICAgfTtcbiAgICB0aGlzLnBhbmVscyA9IFtdO1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybjtcbiAgICAvLyBGb3IgZWFjaCBjb21wb25lbnQsIGNyZWF0ZSBhIHNob3djYXNlIHBhbmVsXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB0aGlzLnBhbmVscy5wdXNoKG5ldyBTaG93Y2FzZVBhbmVsKCQoZWxlbWVudCkpKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEFuaW1hdGVkU2hvd2Nhc2VQYW5lbCgpO1xuIiwiY2xhc3MgQ2Fyb3VzZWxSb3cge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5jYXJvdXNlbFJvdycsXG4gICAgICBjYXJvdXNlbDogJy5jYXJvdXNlbFJvd19fY2Fyb3VzZWwnLFxuICAgICAgYXJyb3dOZXh0OiAnLmNhcm91c2VsUm93IC5hcnJvd05leHQnLFxuICAgICAgYXJyb3dQcmV2OiAnLmNhcm91c2VsUm93IC5hcnJvd1ByZXYnXG4gICAgfTtcbiAgICB0aGlzLmNhcm91c2VsID0gbnVsbDtcblxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5pdENhcm91c2VsID0gdGhpcy5pbml0Q2Fyb3VzZWwuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuYXJyb3dOZXh0LCAoZSk9PntcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuY2Fyb3VzZWwubmV4dCgpO1xuICAgIH0pO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmFycm93UHJldiwgKGUpPT57XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLmNhcm91c2VsLnByZXYoKTtcbiAgICB9KTtcbiAgICAkKHRoaXMuc2VsLmNhcm91c2VsKS5zd2lwZSh7XG4gICAgICBzd2lwZTogKGV2ZW50LCBkaXJlY3Rpb24pID0+IHtcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgdGhpcy5jYXJvdXNlbC5uZXh0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgdGhpcy5jYXJvdXNlbC5wcmV2KCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhbGxvd1BhZ2VTY3JvbGw6ICd2ZXJ0aWNhbCdcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRDYXJvdXNlbCgpIHtcbiAgICB0aGlzLmNhcm91c2VsID0gJCh0aGlzLnNlbC5jYXJvdXNlbCkud2F0ZXJ3aGVlbENhcm91c2VsKHtcbiAgICAgIGZsYW5raW5nSXRlbXM6IDEsXG4gICAgICBvcGFjaXR5TXVsdGlwbGllcjogMSxcbiAgICAgIHNlcGFyYXRpb246IDkwLFxuICAgICAgLyptb3ZpbmdUb0NlbnRlcjogKCRpdGVtKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtb3ZpbmdUb0NlbnRlcicsICRpdGVtKTtcbiAgICAgIH0sXG4gICAgICBtb3ZlZFRvQ2VudGVyOiAoJGl0ZW0pID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ21vdmVkVG9DZW50ZXInLCAkaXRlbSk7XG4gICAgICB9LFxuICAgICAgbW92aW5nRnJvbUNlbnRlcjogKCRpdGVtKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtb3ZpbmdGcm9tQ2VudGVyJywgJGl0ZW0pO1xuICAgICAgfSxcbiAgICAgIG1vdmVkRnJvbUNlbnRlcjogKCRpdGVtKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtb3ZlZEZyb21DZW50ZXInLCAkaXRlbSk7XG4gICAgICB9LFxuICAgICAgY2xpY2tlZENlbnRlcjogKCRpdGVtKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjbGlja2VkQ2VudGVyJywgJGl0ZW0pO1xuICAgICAgfSovXG4gICAgfSk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybjtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB0aGlzLmluaXRDYXJvdXNlbCgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDYXJvdXNlbFJvdygpO1xuIiwiY2xhc3MgQ291bnRlciB7XG4gIGNvbnN0cnVjdG9yKCRlbGVtZW50KSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgc3RhdHM6ICcuc3RhdHNQYW5lbF9fc3RhdHNWYWx1ZScsXG4gICAgICB0cmlnZ2VyOiAnLnN0YXRzUGFuZWxfX3dyYXBwZXInLFxuICAgICAgcHJvZHVjdEZpbGw6ICcuYm94RmlsbCdcbiAgICB9O1xuICAgIHRoaXMuYW5pbWF0aW9ucyA9IFtdO1xuICAgIHRoaXMuaXNBbmltYXRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5jb3VudFVwID0gdGhpcy5jb3VudFVwLmJpbmQodGhpcyk7XG4gICAgdGhpcy5ydW5BbmltYXRpb25zID0gdGhpcy5ydW5BbmltYXRpb25zLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTY3JvbGxPdXQgPSB0aGlzLmhhbmRsZVNjcm9sbE91dC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5jb3VudFVwKCk7XG4gIH1cblxuICBjb3VudFVwKCkge1xuICAgIGxldCAkc3RhdHMgPSB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuc3RhdHMpO1xuICAgIGxldCBzZXR0aW5ncyA9IHtcbiAgICAgIGR1cmF0aW9uOiBwYXJzZUludCh0aGlzLiRlbGVtZW50LmF0dHIoJ2RhdGEtZHVyYXRpb24nKSwgMTApIHx8IDIsXG4gICAgICBzZXBhcmF0b3I6IHRoaXMuJGVsZW1lbnQuYXR0cignZGF0YS1zZXBhcmF0b3InKSB8fCAnJyxcbiAgICAgIGRlY2ltYWw6IHRoaXMuJGVsZW1lbnQuYXR0cignZGF0YS1kZWNpbWFsJykgfHwgJy4nXG4gICAgfTtcbiAgICBsZXQgY291bnRzID0gW107XG5cbiAgICAkc3RhdHMuZWFjaCgoaW5kZXgsIGVsZW1lbnQpID0+IHtcbiAgICAgIGxldCBzdGFydCA9IHBhcnNlRmxvYXQoJChlbGVtZW50KS5hdHRyKCdkYXRhLXN0YXJ0JykpIHx8IDA7XG4gICAgICBsZXQgZW5kID0gcGFyc2VGbG9hdCgkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtZW5kJykpO1xuICAgICAgbGV0IGRlY2ltYWxzID0gcGFyc2VJbnQoJChlbGVtZW50KS5hdHRyKCdkYXRhLWRlY2ltYWxzJyksIDEwKSB8fCAwO1xuICAgICAgbGV0IHByZWZpeCA9ICQoZWxlbWVudCkuYXR0cignZGF0YS1wcmVmaXgnKSB8fCAnJztcbiAgICAgIGxldCBzdWZmaXggPSAkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtc3VmZml4JykgfHwgJyc7XG4gICAgICBsZXQgZHVyYXRpb24gPSBwYXJzZUZsb2F0KCQoZWxlbWVudCkuYXR0cignZGF0YS1kdXJhdGlvbicpKSB8fCBzZXR0aW5ncy5kdXJhdGlvbjtcblxuICAgICAgY291bnRzLnB1c2goe1xuICAgICAgICBlbDogJChlbGVtZW50KVswXSxcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICBlbmQ6IGVuZCxcbiAgICAgICAgZGVjaW1hbHM6IGRlY2ltYWxzLFxuICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBwcmVmaXg6IHByZWZpeCxcbiAgICAgICAgICBzdWZmaXg6IHN1ZmZpeFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgX3RoaXMgPSBjb3VudHNbaV07XG4gICAgICBsZXQgc3RhdEFuaW0gPSBuZXcgQ291bnRVcChcbiAgICAgICAgX3RoaXMuZWwsXG4gICAgICAgIF90aGlzLnN0YXJ0LFxuICAgICAgICBfdGhpcy5lbmQsXG4gICAgICAgIF90aGlzLmRlY2ltYWxzLFxuICAgICAgICBfdGhpcy5kdXJhdGlvbixcbiAgICAgICAge1xuICAgICAgICAgIHVzZUVhc2luZzogZmFsc2UsXG4gICAgICAgICAgc2VwYXJhdG9yOiBzZXR0aW5ncy5zZXBhcmF0b3IsXG4gICAgICAgICAgZGVjaW1hbDogc2V0dGluZ3MuZGVjaW1hbCxcbiAgICAgICAgICBwcmVmaXg6IF90aGlzLm9wdGlvbnMucHJlZml4LFxuICAgICAgICAgIHN1ZmZpeDogX3RoaXMub3B0aW9ucy5zdWZmaXhcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKHN0YXRBbmltKTtcbiAgICB9XG4gICAgdGhpcy5ydW5BbmltYXRpb25zKCk7XG4gIH1cblxuICBydW5BbmltYXRpb25zKCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNBbmltYXRlZCkgcmV0dXJuO1xuICAgICAgaWYgKCgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAod2luZG93LmlubmVySGVpZ2h0ICogMC43NSkpID49IHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC50cmlnZ2VyKS5vZmZzZXQoKS50b3ApIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc3RhcnQsIHtwYXNzaXZlOiB0cnVlfSk7IC8vIFN0b3AgZXZlbnQgZnJvbSB0cmlnZ2VyaW5nIG1vcmUgdGhhbiBvbmNlXG4gICAgICAgIHRoaXMuaXNBbmltYXRlZCA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hbmltYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5hbmltYXRpb25zW2ldLnN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVTY3JvbGxPdXQsIHtwYXNzaXZlOiB0cnVlfSk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5wcm9kdWN0RmlsbCkuYWRkQ2xhc3MoJ2JveEZpbGwtLXNob3cnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzdGFydCwge3Bhc3NpdmU6IHRydWV9KTtcbiAgICAgIHN0YXJ0KCk7XG4gICAgfSwgNTAwKTtcbiAgfVxuXG4gIGhhbmRsZVNjcm9sbE91dCgpIHtcbiAgICBpZiAoIXRoaXMuZWxlbWVudEluVmlld3BvcnQodGhpcy4kZWxlbWVudFswXSkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hbmltYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uc1tpXS5yZXNldCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5pc0FuaW1hdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwucHJvZHVjdEZpbGwpLnJlbW92ZUNsYXNzKCdib3hGaWxsLS1zaG93Jyk7XG4gICAgICB0aGlzLnJ1bkFuaW1hdGlvbnMoKTtcbiAgICB9XG4gIH1cblxuICBlbGVtZW50SW5WaWV3cG9ydChlbCkge1xuICAgIGxldCB0b3AgPSBlbC5vZmZzZXRUb3A7XG4gICAgbGV0IGxlZnQgPSBlbC5vZmZzZXRMZWZ0O1xuICAgIGxldCB3aWR0aCA9IGVsLm9mZnNldFdpZHRoO1xuICAgIGxldCBoZWlnaHQgPSBlbC5vZmZzZXRIZWlnaHQ7XG5cbiAgICB3aGlsZShlbC5vZmZzZXRQYXJlbnQpIHtcbiAgICAgIGVsID0gZWwub2Zmc2V0UGFyZW50O1xuICAgICAgdG9wICs9IGVsLm9mZnNldFRvcDtcbiAgICAgIGxlZnQgKz0gZWwub2Zmc2V0TGVmdDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgdG9wIDwgKHdpbmRvdy5wYWdlWU9mZnNldCArIHdpbmRvdy5pbm5lckhlaWdodCkgJiZcbiAgICAgIGxlZnQgPCAod2luZG93LnBhZ2VYT2Zmc2V0ICsgd2luZG93LmlubmVyV2lkdGgpICYmXG4gICAgICAodG9wICsgaGVpZ2h0KSA+IHdpbmRvdy5wYWdlWU9mZnNldCAmJlxuICAgICAgKGxlZnQgKyB3aWR0aCkgPiB3aW5kb3cucGFnZVhPZmZzZXRcbiAgICApO1xuICB9XG59XG5cbmNsYXNzIENvdW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuc3RhdHNQYW5lbCdcbiAgICB9O1xuICAgIHRoaXMuY291bnRlcnMgPSBbXTtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm47XG4gICAgLy8gRm9yIGVhY2ggY29tcG9uZW50LCBjcmVhdGUgYSBjb3VudGVyXG4gICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB0aGlzLmNvdW50ZXJzLnB1c2gobmV3IENvdW50ZXIoJChlbGVtZW50KSkpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ291bnQoKTtcbiIsImNsYXNzIEhlYWRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubGFzdExldHRlciA9ICcnO1xuICAgIHRoaXMuYWxsU3VnZ2VzdGlvbnMgPSBbXTtcbiAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMTtcbiAgICB0aGlzLm1heFN1Z2dlc3Rpb25zID0gMDtcbiAgICB0aGlzLmxhc3RWYWwgPSAnJztcblxuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnLmhlYWRlcicsXG4gICAgICB0b2dnbGU6ICcuaGVhZGVyX19uYXZpZ2F0aW9uJyxcbiAgICAgIG1lbnU6ICcuaGVhZGVyX19tZWdhbmF2JyxcbiAgICAgIG92ZXJsYXk6ICcuaGVhZGVyX19vdmVybGF5JyxcbiAgICAgIHNlYXJjaDogJy5oZWFkZXJfX2Rlc2t0b3BTZWFyY2gnLFxuICAgICAgc2VhcmNoRm9ybTogJy5oZWFkZXJfX3NlYXJjaGZvcm0nLFxuICAgICAgc2VhcmNoRm9ybUZvcm06ICcuaGVhZGVyX19zZWFyY2hmb3JtIGZvcm0nLFxuICAgICAgc2VhcmNoRm9ybUlucHV0OiAnLmhlYWRlcl9fc2VhcmNoZm9ybSAuZm9ybS1maWVsZCcsXG4gICAgICBzZWFyY2hGb3JtSW5wdXRDbGVhcjogJy5oZWFkZXJfX3NlYXJjaGZvcm0gLmZvcm0tZ3JvdXAgLmNsZWFyJyxcbiAgICAgIHNlYXJjaFN1Z2dlc3Rpb25zOiAnLmhlYWRlcl9fc2VhcmNoZm9ybSAuc3VnZ2VzdGlvbnMnLFxuXG4gICAgICBjb3VudHJ5OiAnLmhlYWRlcl9fZGVza3RvcENvdW50cnknLFxuICAgICAgY291bnRyeUZvcm06ICcuaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwnLFxuICAgICAgY291bnRyeVNlY29uZGFyeTogJy5oZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbCAubW9iIC53ZWxjb21lcyBhJ1xuICAgIH07XG5cbiAgICB0aGlzLmNvb2tpZU5hbWUgPSAnZGhsLWRlZmF1bHQtbGFuZ3VhZ2UnO1xuXG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gMDtcblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMudG9nZ2xlTWVudSA9IHRoaXMudG9nZ2xlTWVudS5iaW5kKHRoaXMpO1xuICAgIHRoaXMudG9nZ2xlU2VhcmNoID0gdGhpcy50b2dnbGVTZWFyY2guYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3dTZWFyY2ggPSB0aGlzLnNob3dTZWFyY2guYmluZCh0aGlzKTtcbiAgICB0aGlzLmhpZGVTZWFyY2ggPSB0aGlzLmhpZGVTZWFyY2guYmluZCh0aGlzKTtcbiAgICB0aGlzLnRvZ2dsZUNvdW50cnkgPSB0aGlzLnRvZ2dsZUNvdW50cnkuYmluZCh0aGlzKTtcbiAgICB0aGlzLnNob3dDb3VudHJ5ID0gdGhpcy5zaG93Q291bnRyeS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGlkZUNvdW50cnkgPSB0aGlzLmhpZGVDb3VudHJ5LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zZWxlY3RDb3VudHJ5U2Vjb25kYXJ5ID0gdGhpcy5zZWxlY3RDb3VudHJ5U2Vjb25kYXJ5LmJpbmQodGhpcyk7XG4gICAgdGhpcy5ib2R5U2Nyb2xsaW5nID0gdGhpcy5ib2R5U2Nyb2xsaW5nLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmNoZWNrU2Nyb2xsID0gdGhpcy5jaGVja1Njcm9sbC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duJywgdGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0LCAoZSkgPT4ge1xuICAgICAgLy8gZG93biBhcnJvdyA9IDQwXG4gICAgICAvLyByaWdodCBhcnJvdyA9IDM5XG4gICAgICAvLyB1cCBhcnJvdyA9IDM4XG4gICAgICAvLyBsZWZ0IGFycm93ID0gMzdcbiAgICAgIC8vIHRhYiA9IDlcbiAgICAgIGlmICgoZS5rZXlDb2RlID09PSA5ICYmICghZS5zaGlmdEtleSkpIHx8IChlLmtleUNvZGUgPT09IDQwKSB8fCAoZS5rZXlDb2RlID09PSAzOSkpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4Kys7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPj0gdGhpcy5tYXhTdWdnZXN0aW9ucykge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG93U3VnZ2VzdGlvbnModHJ1ZSk7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKChlLmtleUNvZGUgPT09IDkgJiYgKGUuc2hpZnRLZXkpKSB8fCAoZS5rZXlDb2RlID09PSAzNykgfHwgKGUua2V5Q29kZSA9PT0gMzgpKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleC0tO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4IDwgMCkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IHRoaXMubWF4U3VnZ2VzdGlvbnMgLSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hvd1N1Z2dlc3Rpb25zKHRydWUpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgICAkKGRvY3VtZW50KS5vbigna2V5cHJlc3MnLCB0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgICB2YXIgZmllbGQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICAgIHZhciBwYXJhbU5hbWUgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkuYXR0cignbmFtZScpO1xuICAgICAgICB2YXIgdGVybSA9IGZpZWxkLnZhbCgpLnRyaW0oKTtcbiAgICAgICAgdmFyIHVybCA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2FjdGlvbicpICsgJz8nICsgcGFyYW1OYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRlcm0pO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB1cmw7XG4gICAgICB9XG4gICAgfSk7XG4gICAgJChkb2N1bWVudCkub24oJ2tleXVwJywgdGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0LCAoZSkgPT4ge1xuICAgICAgaWYgKChlLmtleUNvZGUgPT09IDE2KSB8fCAoZS5rZXlDb2RlID09PSA5KSB8fCAoZS5rZXlDb2RlID09PSA0MCkgfHwgKGUua2V5Q29kZSA9PT0gMzkpIHx8IChlLmtleUNvZGUgPT09IDM3KSB8fCAoZS5rZXlDb2RlID09PSAzOCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmllbGQgPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICBpZiAoZmllbGQudmFsKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAkKCcudG9wLXNlYXJjaGVzJywgdGhpcy5zZWwuY29tcG9uZW50KS5oaWRlKCk7XG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0Q2xlYXIpLnNob3coKTtcbiAgICAgICAgdGhpcy5jaGVja1N1Z2dlc3Rpb25zKGZpZWxkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xlYXJTdWdnZXN0aW9ucygpO1xuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dENsZWFyKS5oaWRlKCk7XG4gICAgICAgICQoJy50b3Atc2VhcmNoZXMnLCB0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXRDbGVhciwgKGUpID0+IHtcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS52YWwoJycpO1xuICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXRDbGVhcikuaGlkZSgpO1xuICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC50b2dnbGUsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLnRvZ2dsZU1lbnUoKTtcbiAgICB9KTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5vdmVybGF5LCB0aGlzLnRvZ2dsZU1lbnUpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnNlYXJjaCwgdGhpcy50b2dnbGVTZWFyY2gpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNvdW50cnksIHRoaXMudG9nZ2xlQ291bnRyeSk7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuY291bnRyeVNlY29uZGFyeSwgdGhpcy5zZWxlY3RDb3VudHJ5U2Vjb25kYXJ5KTtcblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuaGVhZGVyX19sYW5nLCAuaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwgLmxhbmdzIGEsIC5oZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbCAuY291bnRyaWVzIGEnLCAoZXZ0KSA9PiB7XG4gICAgICBsZXQgaHJlZiA9ICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2hyZWYnKTtcbiAgICAgIGxldCBob21lID0gJChldnQuY3VycmVudFRhcmdldCkuYXR0cignZGF0YS1ob21lJyk7XG4gICAgICBpZiAoaG9tZSAhPT0gbnVsbCAmJiBob21lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaHJlZiA9IGhvbWU7XG4gICAgICB9XG5cbiAgICAgIENvb2tpZXMuc2V0KHRoaXMuY29va2llTmFtZSwgaHJlZik7XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIHRoaXMuY2hlY2tTY3JvbGwpO1xuICAgIHRoaXMuY2hlY2tTY3JvbGwoKTtcblxuICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS52YWwoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0Q2xlYXIpLnNob3coKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjaGVja1Njcm9sbCgpIHtcbiAgICB2YXIgd3QgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgdmFyIHBiID0gJCgnLnBhZ2UtYm9keScpLm9mZnNldCgpLnRvcDtcbiAgICBpZiAod3QgPiBwYikge1xuICAgICAgJCgnLnBhZ2UtYm9keScpLmFkZENsYXNzKCdmaXhlZCcpO1xuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdmaXhlZCcpO1xuICAgICAgaWYgKHd0ID4gdGhpcy5sYXN0U2Nyb2xsVG9wKSB7XG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5yZW1vdmVDbGFzcygnaW4nKTtcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hTdWdnZXN0aW9ucykuYWRkQ2xhc3MoJ2hpZGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnaW4nKTtcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hTdWdnZXN0aW9ucykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgJCgnLnBhZ2UtYm9keScpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuICAgIH1cblxuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IHd0O1xuICB9XG5cbiAgdG9nZ2xlTWVudSgpIHtcbiAgICBpZiAoISQodGhpcy5zZWwubWVudSkuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgIHRoaXMuYm9keVNjcm9sbGluZyhmYWxzZSk7XG4gICAgICAkKHRoaXMuc2VsLnRvZ2dsZSkuYWRkQ2xhc3MoJ2hlYWRlcl9fbmF2aWdhdGlvbi0tb3BlbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJvZHlTY3JvbGxpbmcodHJ1ZSk7XG4gICAgICAkKHRoaXMuc2VsLnRvZ2dsZSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fbmF2aWdhdGlvbi0tb3BlbicpO1xuICAgIH1cbiAgICAkKHRoaXMuc2VsLm1lbnUpLnNsaWRlVG9nZ2xlKDE1MCk7XG5cbiAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2hGb3JtKS5oYXNDbGFzcygnaGVhZGVyX19zZWFyY2hmb3JtLS1vcGVuJykpIHtcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpO1xuICAgICAgJCh0aGlzLnNlbC5zZWFyY2gpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2gpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BTZWFyY2gtLWNsb3NlJyk7XG4gICAgICB9LCAxNTApO1xuICAgIH1cbiAgICBpZiAoJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkuaGFzQ2xhc3MoJ2hlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsLS1vcGVuJykpIHtcbiAgICAgICQodGhpcy5zZWwuY291bnRyeUZvcm0pLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbC0tb3BlbicpO1xuICAgICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wQ291bnRyeS0tY2xvc2UnKTtcbiAgICAgIH0sIDE1MCk7XG4gICAgfVxuICB9XG5cbiAgYm9keVNjcm9sbGluZyhlbmFibGVkKSB7XG4gICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbW9kYWwtb3BlbicpO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJztcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ21vZGFsLW9wZW4nKTtcbiAgICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuc2NyZWVuLmF2YWlsSGVpZ2h0O1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gd2luZG93SGVpZ2h0LnRvU3RyaW5nKCkgKyAncHgnO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5oZWlnaHQgPSB3aW5kb3dIZWlnaHQudG9TdHJpbmcoKSArICdweCc7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlU2VhcmNoKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoKS5oYXNDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoLS1jbG9zZScpKSB7XG4gICAgICB0aGlzLmhpZGVTZWFyY2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93U2VhcmNoKCk7XG5cbiAgICAgICQoJy50b3Atc2VhcmNoZXMnLCB0aGlzLnNlbC5jb21wb25lbnQpLmhpZGUoKTtcbiAgICAgICQoJy50b3Atc2VhcmNoZXMgLml0ZW1zJywgdGhpcy5zZWwuY29tcG9uZW50KS5lbXB0eSgpO1xuXG4gICAgICB2YXIgdXJsID0gJyc7XG4gICAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignZGF0YS10b3BzZWFyY2hlcycpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdXJsID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignZGF0YS10b3BzZWFyY2hlcycpO1xuICAgICAgfVxuICAgICAgaWYgKHVybC5sZW5ndGggPiAwKSB7XG4gICAgICAgICQuZ2V0KHVybCwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHZhciBjb250YWluZXIgPSAkKCcudG9wLXNlYXJjaGVzIC5pdGVtcycsIHRoaXMuc2VsLmNvbXBvbmVudCk7XG4gICAgICAgICAgdmFyIHBhcmFtTmFtZSA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgdmFyIGhhc1Rlcm1zID0gZmFsc2U7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQucmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaGFzVGVybXMgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIHRlcm0gPSByZXN1bHQucmVzdWx0c1tpXS50cmltKCk7XG4gICAgICAgICAgICB2YXIgc2VhcmNoVXJsID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignYWN0aW9uJykgKyAnPycgKyBwYXJhbU5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodGVybSk7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kKGA8YSBocmVmPScke3NlYXJjaFVybH0nIHRpdGxlPScke3Rlcm19Jz48c3Bhbj4ke3Rlcm19PC9zcGFuPjwvYT5gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaGFzVGVybXMpIHtcbiAgICAgICAgICAgICQoJy50b3Atc2VhcmNoZXMnLCB0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNob3dTZWFyY2goKSB7XG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsLS1vcGVuJyk7XG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcblxuICAgICQodGhpcy5zZWwuc2VhcmNoKS5hZGRDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoLS1jbG9zZScpO1xuICAgICQodGhpcy5zZWwuc2VhcmNoKS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5hZGRDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcbiAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLmFkZENsYXNzKCdoZWFkZXJfX3NlYXJjaGZvcm0tLW9wZW4nKTtcbiAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkuZm9jdXMoKTtcblxuICAgIGlmICgkKHRoaXMuc2VsLnRvZ2dsZSkuaGFzQ2xhc3MoJ2hlYWRlcl9fbmF2aWdhdGlvbi0tb3BlbicpKSB7XG4gICAgICB0aGlzLmJvZHlTY3JvbGxpbmcodHJ1ZSk7XG4gICAgICAkKHRoaXMuc2VsLnRvZ2dsZSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fbmF2aWdhdGlvbi0tb3BlbicpO1xuICAgICAgJCh0aGlzLnNlbC5tZW51KS5zbGlkZVRvZ2dsZSgxNTApO1xuICAgIH1cbiAgfVxuXG4gIGhpZGVTZWFyY2goKSB7XG4gICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19zZWFyY2hmb3JtLS1vcGVuJyk7XG4gICAgJCh0aGlzLnNlbC5zZWFyY2gpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaCkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKTtcbiAgICB9LCAxNTApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY2hlY2tTdWdnZXN0aW9ucyhmaWVsZCkge1xuICAgIHZhciB2YWwgPSAkLnRyaW0oZmllbGQudmFsKCkpO1xuICAgIHZhciBzID0gdmFsLnN1YnN0cigwLCAxKTtcbiAgICBpZiAocyA9PT0gdGhpcy5sYXN0TGV0dGVyKSB7XG4gICAgICB0aGlzLnNob3dTdWdnZXN0aW9ucygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsZWFyU3VnZ2VzdGlvbnMoKTtcbiAgICAgIHRoaXMubGFzdExldHRlciA9IHM7XG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMTtcblxuICAgICAgdmFyIHVybCA9ICcnO1xuICAgICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2RhdGEtc3VnZ2VzdGlvbnMnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHVybCA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2RhdGEtc3VnZ2VzdGlvbnMnKTtcbiAgICAgIH1cblxuICAgICAgJC5nZXQodXJsLCB7IHM6IHMgfSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAocmVzdWx0LnJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hbGxTdWdnZXN0aW9ucyA9IFtdO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LnJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYWxsU3VnZ2VzdGlvbnMucHVzaChyZXN1bHQucmVzdWx0c1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2hvd1N1Z2dlc3Rpb25zKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyU3VnZ2VzdGlvbnMoKSB7XG4gICAgJCh0aGlzLnNlbC5zZWFyY2hTdWdnZXN0aW9ucykuZW1wdHkoKS5oaWRlKCk7XG4gIH1cblxuICBzaG93U3VnZ2VzdGlvbnModXNlTGFzdFZhbCkge1xuICAgIHRoaXMuY2xlYXJTdWdnZXN0aW9ucygpO1xuICAgIHZhciB2YWwgPSAkLnRyaW0oJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLnZhbCgpKTtcbiAgICBpZiAodXNlTGFzdFZhbCkge1xuICAgICAgdmFsID0gdGhpcy5sYXN0VmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxhc3RWYWwgPSB2YWw7XG4gICAgfVxuXG4gICAgdmFyIGhhc1Rlcm1zID0gZmFsc2U7XG4gICAgdmFyIGMgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hbGxTdWdnZXN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNvbnRhaW5zID0gZmFsc2U7XG4gICAgICB2YXIgdGVybXMgPSB2YWwudG9Mb3dlckNhc2UoKS5zcGxpdCgvXFxzLyk7XG5cbiAgICAgIGZvciAodmFyIHQgPSAwOyB0IDwgdGVybXMubGVuZ3RoOyB0KyspIHtcbiAgICAgICAgY29udGFpbnMgPSB0aGlzLmFsbFN1Z2dlc3Rpb25zW2ldLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGVybXNbdF0udHJpbSgpKTtcbiAgICAgICAgaWYgKGNvbnRhaW5zKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmICgodmFsLmxlbmd0aCA9PT0gMSkgfHwgY29udGFpbnMpIHtcbiAgICAgICAgdmFyIHBhcmFtTmFtZSA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS5hdHRyKCduYW1lJyk7XG4gICAgICAgIHZhciB0ZXJtID0gdGhpcy5hbGxTdWdnZXN0aW9uc1tpXS50cmltKCk7XG4gICAgICAgIHZhciB1cmwgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdhY3Rpb24nKSArICc/JyArIHBhcmFtTmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh0ZXJtKTtcbiAgICAgICAgdmFyIGNscyA9ICcnO1xuICAgICAgICBpZiAoYyA9PT0gdGhpcy5zZWxlY3RlZEluZGV4KSB7XG4gICAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLnZhbCh0ZXJtKTtcbiAgICAgICAgICBjbHMgPSAnIGNsYXNzPVwic2VsZWN0ZWRcIic7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hTdWdnZXN0aW9ucykuYXBwZW5kKGA8YSR7Y2xzfSBocmVmPScke3VybH0nIHRpdGxlPScke3Rlcm19Jz48c3Bhbj4ke3Rlcm19PC9zcGFuPjwvYT5gKTtcbiAgICAgICAgaGFzVGVybXMgPSB0cnVlO1xuICAgICAgICBjKys7XG4gICAgICB9XG5cbiAgICAgIGlmIChjID49IDEwKSBicmVhaztcbiAgICB9XG4gICAgdGhpcy5tYXhTdWdnZXN0aW9ucyA9IGM7XG5cbiAgICBpZiAoaGFzVGVybXMpIHtcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLnNob3coKTtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVDb3VudHJ5KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKCQodGhpcy5zZWwuY291bnRyeSkuaGFzQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcENvdW50cnktLWNsb3NlJykpIHtcbiAgICAgIHRoaXMuaGlkZUNvdW50cnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93Q291bnRyeSgpO1xuICAgIH1cbiAgfVxuXG4gIHNob3dDb3VudHJ5KCkge1xuICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fc2VhcmNoZm9ybS0tb3BlbicpO1xuICAgICQodGhpcy5zZWwuc2VhcmNoKS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoLS1jbG9zZScpO1xuICAgIH0sIDE1MCk7XG5cbiAgICAkKHRoaXMuc2VsLmNvdW50cnkpLmFkZENsYXNzKCdoZWFkZXJfX2Rlc2t0b3BDb3VudHJ5LS1jbG9zZScpO1xuICAgICQodGhpcy5zZWwuY291bnRyeSkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykuYWRkQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkuYWRkQ2xhc3MoJ2hlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsLS1vcGVuJyk7XG5cbiAgICBpZiAoJCh0aGlzLnNlbC50b2dnbGUpLmhhc0NsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKSkge1xuICAgICAgdGhpcy5ib2R5U2Nyb2xsaW5nKHRydWUpO1xuICAgICAgJCh0aGlzLnNlbC50b2dnbGUpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKTtcbiAgICAgICQodGhpcy5zZWwubWVudSkuc2xpZGVUb2dnbGUoMTUwKTtcbiAgICB9XG4gIH1cblxuICBoaWRlQ291bnRyeSgpIHtcbiAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5yZW1vdmVDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKTtcbiAgICAkKHRoaXMuc2VsLmNvdW50cnkpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xuICAgICQodGhpcy5zZWwuY291bnRyeUZvcm0pLmZpbmQoJy5tb2InKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAkKHRoaXMuc2VsLmNvdW50cnkpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BDb3VudHJ5LS1jbG9zZScpO1xuICAgIH0sIDE1MCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzZWxlY3RDb3VudHJ5U2Vjb25kYXJ5KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkuZmluZCgnLm1vYicpLmFkZENsYXNzKCdvcGVuJyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEhlYWRlcigpO1xuIiwiY2xhc3MgSUVEZXRlY3RvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2VsID0ge1xuICAgICAgY29tcG9uZW50OiAnYm9keSdcbiAgICB9O1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5kZXRlY3RJRSA9IHRoaXMuZGV0ZWN0SUUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHZhciB2ZXJzaW9uID0gdGhpcy5kZXRlY3RJRSgpO1xuICAgIGlmICh2ZXJzaW9uICE9PSBmYWxzZSkge1xuICAgICAgaWYgKHZlcnNpb24gPj0gMTIpIHtcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdpZS1lZGdlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoYGllLSR7dmVyc2lvbn1gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBkZXRlY3RJRSgpIHtcbiAgICB2YXIgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAvLyBUZXN0IHZhbHVlczsgVW5jb21tZW50IHRvIGNoZWNrIHJlc3VsdCDigKZcbiAgICAvLyBJRSAxMFxuICAgIC8vIHVhID0gJ01vemlsbGEvNS4wIChjb21wYXRpYmxlOyBNU0lFIDEwLjA7IFdpbmRvd3MgTlQgNi4yOyBUcmlkZW50LzYuMCknO1xuICAgIC8vIElFIDExXG4gICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgNi4zOyBUcmlkZW50LzcuMDsgcnY6MTEuMCkgbGlrZSBHZWNrbyc7ICAgIC8vIEVkZ2UgMTIgKFNwYXJ0YW4pXG4gICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV09XNjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8zOS4wLjIxNzEuNzEgU2FmYXJpLzUzNy4zNiBFZGdlLzEyLjAnICAgIC8vIEVkZ2UgMTNcbiAgICAvLyB1YSA9ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvNDYuMC4yNDg2LjAgU2FmYXJpLzUzNy4zNiBFZGdlLzEzLjEwNTg2JztcbiAgICB2YXIgbXNpZSA9IHVhLmluZGV4T2YoJ01TSUUgJyk7XG4gICAgaWYgKG1zaWUgPiAwKSB7XG4gICAgICAvLyBJRSAxMCBvciBvbGRlciA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcbiAgICAgIHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcobXNpZSArIDUsIHVhLmluZGV4T2YoJy4nLCBtc2llKSksIDEwKTtcbiAgICB9XG5cbiAgICB2YXIgdHJpZGVudCA9IHVhLmluZGV4T2YoJ1RyaWRlbnQvJyk7XG4gICAgaWYgKHRyaWRlbnQgPiAwKSB7XG4gICAgICAvLyBJRSAxMSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcbiAgICAgIHZhciBydiA9IHVhLmluZGV4T2YoJ3J2OicpO1xuICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhydiArIDMsIHVhLmluZGV4T2YoJy4nLCBydikpLCAxMCk7XG4gICAgfVxuXG4gICAgdmFyIGVkZ2UgPSB1YS5pbmRleE9mKCdFZGdlLycpO1xuICAgIGlmIChlZGdlID4gMCkge1xuICAgICAgLy8gRWRnZSAoSUUgMTIrKSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcbiAgICAgIHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcoZWRnZSArIDUsIHVhLmluZGV4T2YoJy4nLCBlZGdlKSksIDEwKTtcbiAgICB9XG5cbiAgICAvLyBvdGhlciBicm93c2VyXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBJRURldGVjdG9yKCk7XG4iLCJpbXBvcnQgU3RyaW5ncyBmcm9tICcuLi9IZWxwZXJzL1N0cmluZ3MnO1xuXG5jbGFzcyBJblBhZ2VOYXZpZ2F0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcuaW5QYWdlTmF2aWdhdGlvbicsXG4gICAgICBsaXN0OiAnLmluUGFnZU5hdmlnYXRpb25fX2xpc3QnLFxuICAgICAgbGlzdEl0ZW1zOiAnLmluUGFnZU5hdmlnYXRpb25fX2l0ZW0nLFxuICAgICAgbGlua3M6ICcuaW5QYWdlTmF2aWdhdGlvbl9fbGluaycsXG4gICAgICBzZWN0aW9uczogJy5pblBhZ2VOYXZpZ2F0aW9uU2VjdGlvbicsXG4gICAgICBzZWN0aW9uVGl0bGU6ICcuaW5QYWdlTmF2aWdhdGlvblNlY3Rpb25fX3RpdGxlJyxcbiAgICAgIHRlbXBsYXRlOiAnI2luUGFnZU5hdmlnYXRpb25fX3RlbXBsYXRlJ1xuICAgIH07XG4gICAgdGhpcy4kdGVtcGxhdGUgPSBudWxsO1xuICAgIHRoaXMuc2VjdGlvbk9mZnNldHMgPSBbXTtcbiAgICB0aGlzLmNvbXBvbmVudEhlaWdodCA9IDA7XG4gICAgdGhpcy5ib3R0b21MaW1pdCA9IDA7XG5cbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnBvcHVsYXRlSXRlbXMgPSB0aGlzLnBvcHVsYXRlSXRlbXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmFkZE9mZnNldCA9IHRoaXMuYWRkT2Zmc2V0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5wb3NpdGlvbkNvbXBvbmVudCA9IHRoaXMucG9zaXRpb25Db21wb25lbnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVNjcm9sbCA9IHRoaXMuaGFuZGxlU2Nyb2xsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVMaW5rQ2xpY2sgPSB0aGlzLmhhbmRsZUxpbmtDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2FsY3VsYXRlVmFsdWVzID0gdGhpcy5jYWxjdWxhdGVWYWx1ZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVTY3JvbGwsIHtwYXNzaXZlOiB0cnVlfSk7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwubGlua3MsIHRoaXMuaGFuZGxlTGlua0NsaWNrKTtcbiAgICAkKHdpbmRvdykub24oJ3N0b3AucmVzaXplJywgdGhpcy5jYWxjdWxhdGVWYWx1ZXMpO1xuICB9XG5cbiAgcG9wdWxhdGVJdGVtcygpIHtcbiAgICBsZXQgJHNlY3Rpb25zID0gW107XG4gICAgJCh0aGlzLnNlbC5zZWN0aW9ucykuZWFjaCgoaW5kZXgsIGVsbSkgPT4ge1xuICAgICAgbGV0IHJhbmRvbUlkID0gU3RyaW5ncy5pZCgpO1xuICAgICAgJChlbG0pLmF0dHIoJ2lkJywgcmFuZG9tSWQpO1xuICAgICAgbGV0ICRpdGVtID0gJCh0aGlzLiR0ZW1wbGF0ZS5jbG9uZSgpLmh0bWwoKSk7XG4gICAgICAkaXRlbS5maW5kKCcuaW5QYWdlTmF2aWdhdGlvbl9fbGluaycpLmF0dHIoJ2hyZWYnLCAnIycgKyByYW5kb21JZCk7XG4gICAgICAkc2VjdGlvbnMucHVzaCgkaXRlbSk7XG4gICAgICB0aGlzLmFkZE9mZnNldCgkKGVsbSkpO1xuICAgIH0pO1xuICAgICQodGhpcy5zZWwubGlzdCkuaHRtbCgnJykuYXBwZW5kKCRzZWN0aW9ucyk7XG4gICAgJCh0aGlzLnNlbC5saXN0SXRlbXMpLmZpcnN0KCkuZmluZCh0aGlzLnNlbC5saW5rcykuYWRkQ2xhc3MoJ2luUGFnZU5hdmlnYXRpb25fX2xpbmstLWFjdGl2ZScpO1xuICAgIHRoaXMucG9zaXRpb25Db21wb25lbnQoKTtcbiAgICAvLyBTb3J0IG9mZnNldHMgdG8gbGFzdCBmaXJzdFxuICAgIHRoaXMuc2VjdGlvbk9mZnNldHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKGEudG9wID4gYi50b3ApIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfSBlbHNlIGlmIChiLnRvcCA+IGEudG9wKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfSk7XG4gICAgdGhpcy5jYWxjdWxhdGVWYWx1ZXMoKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZVZhbHVlcygpIHtcbiAgICAvLyBHZXQgdGhlIGhlaWdodCBvZiB0aGUgY29tcG9uZW50XG4gICAgdGhpcy5jb21wb25lbnRIZWlnaHQgPSAkKHRoaXMuc2VsLmxpc3QpLmhlaWdodCgpO1xuICAgIC8vIEdldCB0aGUgbWF4aW11bSBkaXN0YW5jZSBmcm9tIHRoZSB0b3Agb2YgdGhlIGRvY3VtZW50IHRoZSBjb21wb25lbnQgY2FuIG1vdmVcbiAgICB0aGlzLmJvdHRvbUxpbWl0ID0gJCgnZm9vdGVyJykub2Zmc2V0KCkudG9wIC0gODA7XG4gIH1cblxuICBhZGRPZmZzZXQoJGVsbSkge1xuICAgIGxldCB0b3AgPSAkZWxtLm9mZnNldCgpLnRvcDtcbiAgICBsZXQgaWQgPSAkZWxtLmF0dHIoJ2lkJyk7XG4gICAgdGhpcy5zZWN0aW9uT2Zmc2V0cy5wdXNoKHtcbiAgICAgIHRvcDogdG9wLFxuICAgICAgaWQ6IGlkXG4gICAgfSk7XG4gIH1cblxuICBwb3NpdGlvbkNvbXBvbmVudCgpIHtcbiAgICBsZXQgdG9wUG9zaXRpb24gPSAkKHRoaXMuc2VsLnNlY3Rpb25zKS5maXJzdCgpLm9mZnNldCgpLnRvcDtcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuY3NzKCd0b3AnLCB0b3BQb3NpdGlvbiArICdweCcpO1xuICB9XG5cbiAgaGFuZGxlU2Nyb2xsKCkge1xuICAgIC8vIEdldCB0aGUgY3VycmVudCBzY3JvbGwgcG9zaXRpb25cbiAgICBsZXQgc2Nyb2xsUG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBib3R0b20gcG9zaXRpb24gb2YgdGhlIGxpc3QgdXNpbmcgc2Nyb2xsIHBvc2l0aW9uIG5vdCBlbGVtZW50IHBvc2l0aW9uLiAgSWYgdXNlIGVsZW1lbnQgcG9zaXRpb24gaXQgY2hhbmdlcyBiZWNhdXNlIHdlIGFmZml4IGl0XG4gICAgbGV0IGJvdHRvbVBvc2l0aW9uID0gc2Nyb2xsUG9zaXRpb24gKyAod2luZG93LmlubmVySGVpZ2h0IC8gMikgKyAodGhpcy5jb21wb25lbnRIZWlnaHQgLyAyKTtcbiAgICAvLyBJZiB0aGUgbGlzdCBwb3NpdGlvbiBpcyBvbiBvciBiZWxvdyB0aGUgbGltaXRcbiAgICBpZiAoYm90dG9tUG9zaXRpb24gPj0gdGhpcy5ib3R0b21MaW1pdCkge1xuICAgICAgLy8gQWZmaXggaXRcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnaW5QYWdlTmF2aWdhdGlvbi0tYWZmaXgnKS5maW5kKHRoaXMuc2VsLmxpc3QpLmNzcygndG9wJywgKHRoaXMuYm90dG9tTGltaXQgLSB0aGlzLmNvbXBvbmVudEhlaWdodCkgKyAncHgnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVW4tYWZmaXggaXRcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5yZW1vdmVDbGFzcygnaW5QYWdlTmF2aWdhdGlvbi0tYWZmaXgnKS5maW5kKHRoaXMuc2VsLmxpc3QpLmNzcygndG9wJywgJycpO1xuICAgIH1cbiAgICAvLyBHZXQgdGhlIGlubmVyIGhlaWdodCBvZiB0aGUgd2luZG93XG4gICAgbGV0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAvLyBGb3IgZWFjaCBzZWN0aW9uIGluIHRoZSBwYWdlXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNlY3Rpb25PZmZzZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBHZXQgdGhpcyBzZWN0aW9uIGluZm9cbiAgICAgIGxldCBzZWN0aW9uID0gdGhpcy5zZWN0aW9uT2Zmc2V0c1tpXTtcbiAgICAgIC8vIElmIHNlY3Rpb24gaXMgMzMuMzMlIGZyb20gdG9wIG9mIHZpZXdwb3J0LCBhY3RpdmF0ZSBpdCdzIG5hdiBpdGVtXG4gICAgICBpZiAoKHNjcm9sbFBvc2l0aW9uICsgKHdpbmRvd0hlaWdodCAqIDAuMzMpKSA+PSBzZWN0aW9uLnRvcCkge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGFjdGl2ZSBjbGFzcyBmcm9tIGFueSBvdGhlciBuYXYgaXRlbVxuICAgICAgICAkKHRoaXMuc2VsLmxpbmtzKS5yZW1vdmVDbGFzcygnaW5QYWdlTmF2aWdhdGlvbl9fbGluay0tYWN0aXZlJyk7XG4gICAgICAgIC8vIEFkZCBhY3RpdmUgY2xhc3MgdG8gdGhpcyBpdGVtXG4gICAgICAgICQodGhpcy5zZWwubGlua3MpLmZpbHRlcignW2hyZWY9XCIjJyArIHNlY3Rpb24uaWQgKyAnXCJdJykuYWRkQ2xhc3MoJ2luUGFnZU5hdmlnYXRpb25fX2xpbmstLWFjdGl2ZScpO1xuICAgICAgICAvLyBTdG9wIGNoZWNraW5nIG90aGVyIHNlY3Rpb25zLCBpdCdzIGluIHJldmVyc2Ugb3JkZXJcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUxpbmtDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCB0YXJnZXRJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2hyZWYnKTtcbiAgICBsZXQgc2Nyb2xsUG9zaXRpb24gPSAkKHRhcmdldElkKS5vZmZzZXQoKS50b3A7XG4gICAgJCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxUb3A6IHNjcm9sbFBvc2l0aW9uXG4gICAgfSwgMzAwKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuO1xuICAgIHRoaXMuJHRlbXBsYXRlID0gJCh0aGlzLnNlbC50ZW1wbGF0ZSk7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy5wb3B1bGF0ZUl0ZW1zKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEluUGFnZU5hdmlnYXRpb24oKTtcbiIsImNsYXNzIExhbmRpbmdQYWdlQnV0dG9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICcucGFnZS1ib2R5LmxhbmRpbmctcGFnZS10d29jb2wgLmhlcm8gLmhlcm9fX2N0YSdcbiAgICB9O1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuY29tcG9uZW50LCAoZXZ0KSA9PiB7XG4gICAgICB2YXIgaWQgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJyk7XG4gICAgICB2YXIgb2Zmc2V0ID0gJChpZCkub2Zmc2V0KCkudG9wO1xuICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICBzY3JvbGxUb3A6IG9mZnNldFxuICAgICAgfSwgMTAwMCwgJ3N3aW5nJyk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgTGFuZGluZ1BhZ2VCdXR0b24oKTtcbiIsImNsYXNzIFNoaXBOb3dUd29TdGVwRm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZmlyc3RuYW1lID0gJyc7XG4gICAgdGhpcy5sYXN0bmFtZSA9ICcnO1xuICAgIHRoaXMuZW1haWwgPSAnJztcblxuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgLy8gZmJBcHBJZDogJzEwMDA3NzMxNjMzMzc3OTgnLFxuICAgICAgZmJBcHBJZDogJzEwODAwMzEzMjg4MDEyMTEnLFxuICAgICAgLy8gZ29DbGllbnRJZDogJzkxMzk2MDM1MjIzNi11N3VuMGwyMnR2a21sYnBhNWJjbmYxdXFnNGNzaTdlMy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbScsXG4gICAgICBnb0NsaWVudElkOiAnMzEzNDY5ODM3NDIwLWw4ODJoMzlnZThuOG45cGI5N2xkdmprM2ZtOHBwcWdzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJ1xuICAgIH07XG5cbiAgICB0aGlzLnNlbCA9IHtcbiAgICAgIGNvbXBvbmVudDogJy5zaGlwTm93TXVsdGkud3lzaXd5ZywgLmFuaW1hdGVkRm9ybScsXG4gICAgICBzd2luZ2J1dHRvbjogJy5zaGlwTm93TXVsdGlfX2hlYWRjdGEtLXJlZCcsXG4gICAgICBmb3JtczogJ2Zvcm0uZm9ybXMuc2hpcC1ub3ctdHdvc3RlcCcsXG4gICAgICBmb3JtMTogJ2Zvcm0uZm9ybXMuZm9ybTEuc2hpcC1ub3ctdHdvc3RlcCcsXG4gICAgICBmb3JtMjogJ2Zvcm0uZm9ybXMuZm9ybTIuc2hpcC1ub3ctdHdvc3RlcCcsXG4gICAgICBjb3VudHJ5c2VsZWN0OiAnZm9ybS5mb3Jtcy5mb3JtMi5zaGlwLW5vdy10d29zdGVwICNzaGlwbm93X2NvdW50cnknLFxuXG4gICAgICBidXR0b25GYWNlYm9vazogJy5mb3Jtc19fY3RhLS1zb2NpYWwuZmFjZWJvb2snLFxuICAgICAgYnV0dG9uTGlua2VkaW46ICcuZm9ybXNfX2N0YS0tc29jaWFsLmxpbmtlZGluJyxcbiAgICAgIGJ1dHRvbkdvb2dsZVBsdXM6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmdvb2dsZSdcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzID0gdGhpcy5iaW5kRXZlbnRzLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnRvZ2dsZUFkZHJlc3MgPSB0aGlzLnRvZ2dsZUFkZHJlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEZhY2Vib29rID0gdGhpcy5zdWJtaXRGYWNlYm9vay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0TGlua2VkaW4gPSB0aGlzLnN1Ym1pdExpbmtlZGluLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zdWJtaXRHb29nbGUgPSB0aGlzLnN1Ym1pdEdvb2dsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc3VibWl0Rm9ybTEgPSB0aGlzLnN1Ym1pdEZvcm0xLmJpbmQodGhpcyk7XG4gICAgdGhpcy5uZXh0Rm9ybSA9IHRoaXMubmV4dEZvcm0uYmluZCh0aGlzKTtcbiAgICB0aGlzLnN1Ym1pdEZvcm0yID0gdGhpcy5zdWJtaXRGb3JtMi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0Rm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaG93U3VjY2VzcyA9IHRoaXMuc2hvd1N1Y2Nlc3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgZ2V0UGF0aFByZWZpeCgpIHtcbiAgICBjb25zdCBwcmVmaXggPSAkKCdoZWFkIG1ldGFbbmFtZT1cXCdkaGwtcGF0aC1wcmVmaXhcXCddJykuYXR0cignY29udGVudCcpO1xuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICAkKGRvY3VtZW50KS5vbignc3VibWl0JywgdGhpcy5zZWwuZm9ybTEsIHRoaXMuc3VibWl0Rm9ybTEpO1xuICAgICQoZG9jdW1lbnQpLm9uKCdzdWJtaXQnLCB0aGlzLnNlbC5mb3JtMiwgdGhpcy5zdWJtaXRGb3JtMik7XG4gICAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsIHRoaXMuc2VsLmNvdW50cnlzZWxlY3QsIHRoaXMudG9nZ2xlQWRkcmVzcyk7XG5cbiAgICB2YXIgY291bnRyeSA9ICQodGhpcy5zZWwuZm9ybTIpLmRhdGEoJ3ByZXNlbGVjdGNvdW50cnknKTtcbiAgICBpZiAoKGNvdW50cnkgIT09IG51bGwpICYmICQudHJpbShjb3VudHJ5KS5sZW5ndGggPiAwKSB7XG4gICAgICAkKHRoaXMuc2VsLmNvdW50cnlzZWxlY3QpLnZhbChjb3VudHJ5KS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9XG5cbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uRmFjZWJvb2spLmxlbmd0aCA+IDApIHtcbiAgICAgIHdpbmRvdy5mYkFzeW5jSW5pdCA9ICgpID0+IHtcbiAgICAgICAgd2luZG93LmZiX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5GQikgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5GQiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgd2luZG93LkZCLmluaXQoe1xuICAgICAgICAgICAgICBhcHBJZDogdGhpcy5jb25maWcuZmJBcHBJZCxcbiAgICAgICAgICAgICAgY29va2llOiB0cnVlLFxuICAgICAgICAgICAgICB4ZmJtbDogdHJ1ZSxcbiAgICAgICAgICAgICAgdmVyc2lvbjogJ3YyLjgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZmJfaW50ZXJ2YWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwKTtcbiAgICAgIH07XG5cbiAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmFjZWJvb2stanNzZGsnKSA9PT0gbnVsbCkge1xuICAgICAgICB2YXIgZmpzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICAgICAgICB2YXIganMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAganMuaWQgPSAnZmFjZWJvb2stanNzZGsnO1xuICAgICAgICBqcy5zcmMgPSAnLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9FTi9zZGsuanMnO1xuICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XG4gICAgICB9XG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xuICAgICAgICB0aGlzLnN1Ym1pdEZhY2Vib29rKGV2dCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikubGVuZ3RoID4gMCkge1xuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uTGlua2VkaW4pLm9uKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgdGhpcy5zdWJtaXRMaW5rZWRpbihldnQpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgZ29vZ2xlQnV0dG9uID0gJCh0aGlzLnNlbC5jb21wb25lbnQpLmZpbmQodGhpcy5zZWwuYnV0dG9uR29vZ2xlUGx1cyk7XG4gICAgaWYgKGdvb2dsZUJ1dHRvbi5sZW5ndGggPiAwKSB7XG4gICAgICB3aW5kb3cuZ29faW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5nYXBpKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmdhcGkgIT09IG51bGwpIHtcbiAgICAgICAgICB3aW5kb3cuZ2FwaS5sb2FkKCdhdXRoMicsICgpID0+IHtcbiAgICAgICAgICAgIHZhciBhdXRoMiA9IHdpbmRvdy5nYXBpLmF1dGgyLmluaXQoe1xuICAgICAgICAgICAgICBjbGllbnRfaWQ6IHRoaXMuY29uZmlnLmdvQ2xpZW50SWQsXG4gICAgICAgICAgICAgIGNvb2tpZXBvbGljeTogJ3NpbmdsZV9ob3N0X29yaWdpbidcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGdvb2dsZUJ1dHRvbi5nZXQoMCk7XG4gICAgICAgICAgICBhdXRoMi5hdHRhY2hDbGlja0hhbmRsZXIoZWxlbWVudCwge30sXG4gICAgICAgICAgICAgIChnb29nbGVVc2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJtaXRHb29nbGUoZ29vZ2xlVXNlcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvciAhPT0gJ3BvcHVwX2Nsb3NlZF9ieV91c2VyJykge1xuICAgICAgICAgICAgICAgICAgYWxlcnQocmVzdWx0LmVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjbGVhckludGVydmFsKHdpbmRvdy5nb19pbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMCk7XG5cbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5maW5kKHRoaXMuc2VsLmJ1dHRvbkdvb2dsZVBsdXMpLm9uKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnN3aW5nYnV0dG9uLCAoZXZ0KSA9PiB7XG4gICAgICB2YXIgaWQgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJyk7XG4gICAgICB2YXIgb2Zmc2V0ID0gJChpZCkub2Zmc2V0KCkudG9wO1xuICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICBzY3JvbGxUb3A6IG9mZnNldFxuICAgICAgfSwgMTAwMCwgJ3N3aW5nJyk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhbGlkYXRlKCkge1xuICAgICQodGhpcy5zZWwuZm9ybXMpLmVhY2goKGluZGV4LCBpdGVtKSA9PiB7XG4gICAgICAkKGl0ZW0pLnZhbGlkYXRlKHtcbiAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IChlcnJvciwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaXMoJ3NlbGVjdCcpKSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkuZmluZCgnLnNlbGVjdGJveGl0LWJ0bicpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvci5pbnNlcnRBZnRlcihlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IChsYWJlbCkgPT4ge1xuICAgICAgICAgIGxldCAkcGFyZW50ID0gJChsYWJlbCkucGFyZW50cygnZm9ybS5zaGlwLW5vdycpO1xuICAgICAgICAgIGlmICgkcGFyZW50LmZpbmQoJ3NlbGVjdCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLnNlbGVjdGJveGl0LWJ0bicpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICB0b2dnbGVBZGRyZXNzKGUpIHtcbiAgICB2YXIgdmFsID0gJCh0aGlzLnNlbC5jb3VudHJ5c2VsZWN0KS52YWwoKTtcblxuICAgIHZhciBvcHRpb25zID0gJCgnb3B0aW9uJywgdGhpcy5zZWwuY291bnRyeXNlbGVjdCk7XG4gICAgdmFyIG1hbmRhdG9yeSA9IHRydWU7XG4gICAgb3B0aW9ucy5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgaWYgKCQoaXRlbSkuYXR0cigndmFsdWUnKSA9PT0gdmFsICYmICgnJyArICQoaXRlbSkuZGF0YSgnbm9ubWFuZGF0b3J5JykpID09PSAndHJ1ZScpIHtcbiAgICAgICAgbWFuZGF0b3J5ID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobWFuZGF0b3J5KSB7XG4gICAgICAkKCcjc2hpcG5vd19hZGRyZXNzJywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdBZGRyZXNzKicpO1xuICAgICAgJCgnI3NoaXBub3dfemlwJywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdaSVAgb3IgUG9zdGNvZGUqJyk7XG4gICAgICAkKCcjc2hpcG5vd19jaXR5JywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdDaXR5KicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcjc2hpcG5vd19hZGRyZXNzJywgdGhpcy5zZWwuZm9ybSkucmVtb3ZlQXR0cigncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdBZGRyZXNzJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuY2xvc2VzdCgnZGl2JykuZmluZCgnbGFiZWwnKS5yZW1vdmUoKTtcbiAgICAgICQoJyNzaGlwbm93X3ppcCcsIHRoaXMuc2VsLmZvcm0pLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnWklQIG9yIFBvc3Rjb2RlJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJykuY2xvc2VzdCgnZGl2JykuZmluZCgnbGFiZWwnKS5yZW1vdmUoKTtcbiAgICAgICQoJyNzaGlwbm93X2NpdHknLCB0aGlzLnNlbC5mb3JtKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0NpdHknKS5yZW1vdmVDbGFzcygnZXJyb3InKS5jbG9zZXN0KCdkaXYnKS5maW5kKCdsYWJlbCcpLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHN1Ym1pdEZhY2Vib29rKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgd2luZG93LkZCLmxvZ2luKChsb2dpblJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAobG9naW5SZXNwb25zZS5hdXRoUmVzcG9uc2UpIHtcbiAgICAgICAgd2luZG93LkZCLmFwaSgnL21lJywgKGRhdGFSZXNwb25zZSkgPT4ge1xuICAgICAgICAgIHRoaXMuZmlyc3RuYW1lID0gZGF0YVJlc3BvbnNlLmZpcnN0X25hbWU7XG4gICAgICAgICAgdGhpcy5sYXN0bmFtZSA9IGRhdGFSZXNwb25zZS5sYXN0X25hbWU7XG4gICAgICAgICAgdGhpcy5lbWFpbCA9IGRhdGFSZXNwb25zZS5lbWFpbDtcblxuICAgICAgICAgIHRoaXMubmV4dEZvcm0oKTtcbiAgICAgICAgfSwgeyBmaWVsZHM6IFsgJ2lkJywgJ2VtYWlsJywgJ2ZpcnN0X25hbWUnLCAnbGFzdF9uYW1lJyBdfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSwgeyBzY29wZTogJ2VtYWlsLHB1YmxpY19wcm9maWxlJywgcmV0dXJuX3Njb3BlczogdHJ1ZSB9KTtcbiAgfVxuXG4gIHN1Ym1pdExpbmtlZGluKGV2dCkge1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgSU4uVXNlci5hdXRob3JpemUoKCkgPT4ge1xuICAgICAgSU4uQVBJLlByb2ZpbGUoJ21lJykuZmllbGRzKCdpZCcsICdmaXJzdC1uYW1lJywgJ2xhc3QtbmFtZScsICdlbWFpbC1hZGRyZXNzJykucmVzdWx0KChyZXN1bHQpID0+IHtcbiAgICAgICAgdmFyIG1lbWJlciA9IHJlc3VsdC52YWx1ZXNbMF07XG5cbiAgICAgICAgdGhpcy5maXJzdG5hbWUgPSBtZW1iZXIuZmlyc3ROYW1lO1xuICAgICAgICB0aGlzLmxhc3RuYW1lID0gbWVtYmVyLmxhc3ROYW1lO1xuICAgICAgICB0aGlzLmVtYWlsID0gbWVtYmVyLmVtYWlsQWRkcmVzcztcblxuICAgICAgICB0aGlzLm5leHRGb3JtKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cuSU4uVXNlci5pc0F1dGhvcml6ZWQoKTtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgSU4uQVBJLlByb2ZpbGUoJ21lJykuZmllbGRzKCdpZCcsICdmaXJzdC1uYW1lJywgJ2xhc3QtbmFtZScsICdlbWFpbC1hZGRyZXNzJykucmVzdWx0KChyZXN1bHQpID0+IHtcbiAgICAgICAgICB2YXIgbWVtYmVyID0gcmVzdWx0LnZhbHVlc1swXTtcbiAgXG4gICAgICAgICAgdGhpcy5maXJzdG5hbWUgPSBtZW1iZXIuZmlyc3ROYW1lO1xuICAgICAgICAgIHRoaXMubGFzdG5hbWUgPSBtZW1iZXIubGFzdE5hbWU7XG4gICAgICAgICAgdGhpcy5lbWFpbCA9IG1lbWJlci5lbWFpbEFkZHJlc3M7XG4gIFxuICAgICAgICAgIHRoaXMubmV4dEZvcm0oKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdWJtaXRHb29nbGUoZ29vZ2xlVXNlcikge1xuICAgIHZhciBiYXNpY1Byb2ZpbGUgPSBnb29nbGVVc2VyLmdldEJhc2ljUHJvZmlsZSgpO1xuXG4gICAgdGhpcy5maXJzdG5hbWUgPSBiYXNpY1Byb2ZpbGUuZ2V0R2l2ZW5OYW1lKCk7XG4gICAgdGhpcy5sYXN0bmFtZSA9IGJhc2ljUHJvZmlsZS5nZXRGYW1pbHlOYW1lKCk7XG4gICAgdGhpcy5lbWFpbCA9IGJhc2ljUHJvZmlsZS5nZXRFbWFpbCgpO1xuXG4gICAgdGhpcy5uZXh0Rm9ybSgpO1xuICB9XG5cbiAgc3VibWl0Rm9ybTEoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgJGZvcm0gPSAkKGUudGFyZ2V0KTtcbiAgICBsZXQgZm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhKCRmb3JtKTtcblxuICAgIHRoaXMuZmlyc3RuYW1lID0gZm9ybURhdGEuZmlyc3RuYW1lO1xuICAgIHRoaXMubGFzdG5hbWUgPSBmb3JtRGF0YS5sYXN0bmFtZTtcbiAgICB0aGlzLmVtYWlsID0gZm9ybURhdGEuZW1haWw7XG5cbiAgICB0aGlzLm5leHRGb3JtKCk7XG4gIH1cblxuICBuZXh0Rm9ybSgpIHtcbiAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDEnLCB0aGlzLnNlbC5jb21wb25lbnQpLmhpZGUoKTtcbiAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDInLCB0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICB9XG5cbiAgc3VibWl0Rm9ybTIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgJGZvcm0gPSAkKGUudGFyZ2V0KTtcbiAgICBsZXQgZm9ybURhdGEgPSB0aGlzLmdldEZvcm1EYXRhKCRmb3JtKTtcbiAgICBmb3JtRGF0YS5maXJzdG5hbWUgPSB0aGlzLmZpcnN0bmFtZTtcbiAgICBmb3JtRGF0YS5sYXN0bmFtZSA9IHRoaXMubGFzdG5hbWU7XG4gICAgZm9ybURhdGEuZW1haWwgPSB0aGlzLmVtYWlsO1xuXG4gICAgJC5wb3N0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgJGZvcm0uYXR0cignYWN0aW9uJyksIGZvcm1EYXRhLCAoZGF0YSkgPT4ge1xuICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnT0snKSB7XG4gICAgICAgIHRoaXMuc2hvd1N1Y2Nlc3MoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZC4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldEZvcm1EYXRhKCRmb3JtKSB7XG4gICAgbGV0IHVuaW5kZXhlZEFycmF5ID0gJGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbiAgICBsZXQgaW5kZXhlZEFycmF5ID0ge307XG4gICAgJC5tYXAodW5pbmRleGVkQXJyYXksIChuKSA9PiAoaW5kZXhlZEFycmF5W24ubmFtZV0gPSBuLnZhbHVlKSk7XG5cbiAgICBpbmRleGVkQXJyYXkuc291cmNlID0gJC50cmltKCRmb3JtLmRhdGEoJ3NvdXJjZScpKTtcbiAgICBpbmRleGVkQXJyYXkubG8gPSAkLnRyaW0oJGZvcm0uZGF0YSgnbG8nKSk7XG5cbiAgICByZXR1cm4gaW5kZXhlZEFycmF5O1xuICB9XG5cbiAgc2hvd1N1Y2Nlc3MoKSB7XG4gICAgdmFyIHRoYW5rcyA9ICQoJy5zaGlwTm93TXVsdGlfX2Zvcm1zdGVwLS1zdGVwMicsIHRoaXMuc2VsLmNvbXBvbmVudCkuZGF0YShcInRoYW5rc1wiKTtcbiAgICBpZiAoKHRoYW5rcyAhPT0gbnVsbCkgJiYgKHRoYW5rcy5sZW5ndGggPiAwKSkge1xuICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhhbmtzO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDInLCB0aGlzLnNlbC5jb21wb25lbnQpLmhpZGUoKTtcbiAgICAgICQoJy5zaGlwTm93TXVsdGlfX2Zvcm1zdGVwLS10aGFua3MnLCB0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcbiAgICB9XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFNoaXBOb3dUd29TdGVwRm9ybSgpO1xuIiwiJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuICAkKCcuYW5pbWF0ZWRQYWdlc0hlcm9fX2Fycm93Jykub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgIGxldCBuZXdUYXJnZXQgPSAkKCcuYW5pbWF0ZWRQYWdlc0hlcm8nKS5vZmZzZXQoKS50b3AgKyAkKCcuYW5pbWF0ZWRQYWdlc0hlcm8nKS5vdXRlckhlaWdodCgpO1xuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogbmV3VGFyZ2V0XG4gICAgfSwgNDAwKTtcbiAgfSk7XG5cbiAgJCgnLmZvb3Rlcl9fYmFja1RvVG9wJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgJCh0aGlzKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICQoJ2h0bWwsYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgJ3Nsb3cnKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgfSk7XG59KTtcblxuJChmdW5jdGlvbigkLCB3aW4pIHtcbiAgJC5mbi5pblZpZXdwb3J0ID0gZnVuY3Rpb24oY2IpIHtcbiAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpLGVsKXtcbiAgICAgICBmdW5jdGlvbiB2aXNQeCgpe1xuICAgICAgICAgdmFyIEggPSAkKHRoaXMpLmhlaWdodCgpLFxuICAgICAgICAgICAgIHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgdD1yLnRvcCwgYj1yLmJvdHRvbTtcbiAgICAgICAgIHJldHVybiBjYi5jYWxsKGVsLCBNYXRoLm1heCgwLCB0PjA/IEgtdCA6IChiPEg/YjpIKSkpO1xuICAgICAgIH0gdmlzUHgoKTtcbiAgICAgICAkKHdpbikub24oXCJyZXNpemUgc2Nyb2xsXCIsIHZpc1B4KTtcbiAgICAgfSk7XG4gIH07XG59KGpRdWVyeSwgd2luZG93KSk7XG5cbiQoXCIuanMtY291bnRyeS1naWZcIikuaW5WaWV3cG9ydChmdW5jdGlvbihweCl7XG4gICAgaWYocHggPjIwMCkgJCh0aGlzKS5hZGRDbGFzcyhcInZpc2libGVcIikgO1xufSk7XG5cblxuIiwiY2xhc3MgU3RyaW5ncyB7XG4gIGlkKGxlbmd0aCA9IDE2KSB7XG4gICAgY29uc3QgcG9zc2libGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XG4gICAgbGV0IHRleHQgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB0ZXh0ICs9IHBvc3NpYmxlLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZS5sZW5ndGgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFN0cmluZ3MoKTtcbiIsIigoKSA9PiB7XG4gICAgaWYgKCF3aW5kb3cucGFyZW50LndpbmRvdy50ZXN0KSByZXR1cm47XG4gICAgLy8gRGlzYWJsZSBjb25zb2xlIGxvZyBmdW5jdGlvbmFsaXR5XG4gICAgd2luZG93LmNvbnNvbGUubG9nID0gKCkgPT4ge307XG4gICAgLy8gU3RhcnQgdGVzdFxuICAgIGNvbnN0IGRhdGEgPSB3aW5kb3cucGFyZW50LndpbmRvdy50ZXN0LnJlc3VsdHM7XG4gICAgbGV0IHN0eWxlcyA9IGRhdGFbMF07XG4gICAgbGV0IHdlaWdodHMgPSBkYXRhWzFdO1xuICAgICQoJ2JvZHkgKicpLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGxldCBmYW1pbHkgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCdmb250LWZhbWlseScpO1xuICAgICAgICBpZiAoZmFtaWx5LmluZGV4T2Yod2luZG93LnBhcmVudC53aW5kb3cudGVzdC5wYXJhbXMuZmFtaWx5KSA8IDApIHJldHVybjtcbiAgICAgICAgbGV0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZSgnZm9udC1zdHlsZScpO1xuICAgICAgICBpZiAoIXN0eWxlcy5pbmNsdWRlcyhzdHlsZSkpIHN0eWxlcy5wdXNoKHN0eWxlKTtcbiAgICAgICAgbGV0IHdlaWdodCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoJ2ZvbnQtd2VpZ2h0Jyk7XG4gICAgICAgIGlmICghd2VpZ2h0cy5pbmNsdWRlcyh3ZWlnaHQpKSB3ZWlnaHRzLnB1c2god2VpZ2h0KTtcbiAgICB9KTtcbiAgICAvLyBOb3RpZnkgYXV0b21hdGVkIHRlc3Qgc2NyaXB0XG4gICAgd2luZG93LnBhcmVudC53aW5kb3cudGVzdC5sb2FkaW5nID0gZmFsc2U7XG4gICAgd2luZG93LnBhcmVudC53aW5kb3cudGVzdC5yZXN1bHRzID0gW3N0eWxlcywgd2VpZ2h0c107XG59KSgpOyIsImltcG9ydCAnLi9UZXN0cy9Gb250cyc7XG5cbi8vIEltcG9ydCBjb21wb25lbnRzXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vQ29tcG9uZW50cy9IZWFkZXInO1xuaW1wb3J0IElFRGV0ZWN0b3IgZnJvbSAnLi9Db21wb25lbnRzL0lFRGV0ZWN0b3InO1xuaW1wb3J0IExhbmRpbmdQYWdlQnV0dG9uIGZyb20gJy4vQ29tcG9uZW50cy9MYW5kaW5nUGFnZUJ1dHRvbic7XG5pbXBvcnQgQ291bnQgZnJvbSAnLi9Db21wb25lbnRzL0NvdW50JztcbmltcG9ydCBBbmltYXRlZEZvcm0gZnJvbSAnLi9Db21wb25lbnRzL0FuaW1hdGVkRm9ybSc7XG5pbXBvcnQgQ2Fyb3VzZWxSb3cgZnJvbSAnLi9Db21wb25lbnRzL0Nhcm91c2VsUm93JztcbmltcG9ydCBBbmltYXRlZFBhcmFsbGF4IGZyb20gJy4vQ29tcG9uZW50cy9BbmltYXRlZFBhcmFsbGF4JztcbmltcG9ydCBTbW9vdGhTY3JvbGwgZnJvbSAnLi9Db21wb25lbnRzL1Ntb290aFNjcm9sbCc7XG5pbXBvcnQgQW5pbWF0ZWRTaG93Y2FzZVBhbmVsIGZyb20gJy4vQ29tcG9uZW50cy9BbmltYXRlZFNob3djYXNlUGFuZWwnO1xuaW1wb3J0IEFuaW1hdGVkUGFnZXNIZXJvIGZyb20gJy4vQ29tcG9uZW50cy9BbmltYXRlZFBhZ2VzSGVybyc7XG5pbXBvcnQgSW5QYWdlTmF2aWdhdGlvbiBmcm9tICcuL0NvbXBvbmVudHMvSW5QYWdlTmF2aWdhdGlvbic7XG5pbXBvcnQgU2hpcE5vd1R3b1N0ZXBGb3JtIGZyb20gJy4vQ29tcG9uZW50cy9TaGlwTm93VHdvU3RlcEZvcm0nO1xuXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG4gIHRyeSB7XG4gICAgZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RvdWNoRXZlbnQnKTtcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3RvdWNoJyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBub3RoaW5nXG4gIH1cbiAgLy8gSW5pdGlhdGUgY29tcG9uZW50c1xuICBJRURldGVjdG9yLmluaXQoKTtcbiAgSGVhZGVyLmluaXQoKTtcbiAgQ291bnQuaW5pdCgpO1xuICBMYW5kaW5nUGFnZUJ1dHRvbi5pbml0KCk7XG4gIC8vIEFuaW1hdGVkRm9ybS5pbml0KCk7XG4gIENhcm91c2VsUm93LmluaXQoKTtcbiAgQW5pbWF0ZWRQYXJhbGxheC5pbml0KCk7XG4gIEFuaW1hdGVkU2hvd2Nhc2VQYW5lbC5pbml0KCk7XG4gIEluUGFnZU5hdmlnYXRpb24uaW5pdCgpO1xuICBTaGlwTm93VHdvU3RlcEZvcm0uaW5pdCgpO1xuXG59KTtcblxuQW5pbWF0ZWRQYWdlc0hlcm8uaW5pdCgpO1xuXG5cbiJdfQ==
