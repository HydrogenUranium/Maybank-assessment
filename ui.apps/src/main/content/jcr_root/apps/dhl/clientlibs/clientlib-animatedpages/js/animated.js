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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BbmltYXRlZEZvcm0uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BbmltYXRlZFBhZ2VzSGVyby5qcyIsImpzL2Rldi9Db21wb25lbnRzL0FuaW1hdGVkUGFyYWxsYXguanMiLCJqcy9kZXYvQ29tcG9uZW50cy9BbmltYXRlZFNob3djYXNlUGFuZWwuanMiLCJqcy9kZXYvQ29tcG9uZW50cy9DYXJvdXNlbFJvdy5qcyIsImpzL2Rldi9Db21wb25lbnRzL0NvdW50LmpzIiwianMvZGV2L0NvbXBvbmVudHMvSGVhZGVyLmpzIiwianMvZGV2L0NvbXBvbmVudHMvSUVEZXRlY3Rvci5qcyIsImpzL2Rldi9Db21wb25lbnRzL0luUGFnZU5hdmlnYXRpb24uanMiLCJqcy9kZXYvQ29tcG9uZW50cy9MYW5kaW5nUGFnZUJ1dHRvbi5qcyIsImpzL2Rldi9Db21wb25lbnRzL1NoaXBOb3dUd29TdGVwRm9ybS5qcyIsImpzL2Rldi9Db21wb25lbnRzL1Ntb290aFNjcm9sbC5qcyIsImpzL2Rldi9IZWxwZXJzL1N0cmluZ3MuanMiLCJqcy9kZXYvVGVzdHMvRm9udHMuanMiLCJqcy9kZXYvYW5pbWF0ZWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDQU0saUI7QUFDSiwrQkFBYztBQUFBOztBQUNaLFNBQUssR0FBTCxHQUFXO0FBQ1QsaUJBQVcsb0JBREY7QUFFVCxXQUFLLHlCQUZJO0FBR1Qsb0JBQWMsaUNBSEw7QUFJVCxhQUFPO0FBSkUsS0FBWDs7QUFPQSxTQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQWxCO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFwQjtBQUNBLFNBQUssT0FBTCxHQUFl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QUFyQjtBQUNBLE1BQUUsTUFBRixFQUFVLFFBQVYsQ0FBbUIsT0FBbkI7QUFDRCxHQUhELENBR0UsT0FBTyxDQUFQLEVBQVUsQ0FFWDtBQURDOztBQUVGO0FBQ0EsdUJBQVcsSUFBWDtBQUNBLG1CQUFPLElBQVA7QUFDQSxrQkFBTSxJQUFOO0FBQ0EsOEJBQWtCLElBQWxCO0FBQ0E7QUFDQSx3QkFBWSxJQUFaO0FBQ0EsNkJBQWlCLElBQWpCO0FBQ0Esa0NBQXNCLElBQXRCO0FBQ0EsNkJBQWlCLElBQWpCO0FBQ0EsK0JBQW1CLElBQW5CO0FBRUQsQ0FuQkQ7O0FBcUJBLDRCQUFrQixJQUFsQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qXHJcbnZhciBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0nKTtcclxudmFyIHNlY29uZEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYW5pbWF0ZWRGb3JtX19zZWNvbmRGb3JtJyk7XHJcbnZhciBidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0Jyk7XHJcblxyXG4gIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIHNlY29uZEZvcm0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblxyXG59KTtcclxuKi8iLCJjbGFzcyBBbmltYXRlZFBhZ2VzSGVybyB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLmFuaW1hdGVkUGFnZXNIZXJvJyxcclxuICAgICAgdmFuOiAnLmFuaW1hdGVkUGFnZXNIZXJvX192YW4nLFxyXG4gICAgICBhbmltYXRpb25HaWY6ICcuYW5pbWF0ZWRQYWdlc0hlcm9fX2NvbnN1bWVyR2lmJyxcclxuICAgICAgdmlkZW86ICcuYW5pbWF0ZWRQYWdlc0hlcm9fX3ZpZGVvJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaGFuZGxlU2Nyb2xsID0gdGhpcy5oYW5kbGVTY3JvbGwuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucHJlbG9hZCA9IHRoaXMucHJlbG9hZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVTY3JvbGwsIHtwYXNzaXZlOiB0cnVlfSk7XHJcbiAgfVxyXG5cclxuICBwcmVsb2FkKCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuYW5pbWF0aW9uR2lmKS5sZW5ndGggPD0gMCkgcmV0dXJuO1xyXG4gICAgbGV0IGdpZiA9IG5ldyBJbWFnZSgpO1xyXG4gICAgZ2lmLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgJCh0aGlzLnNlbC5hbmltYXRpb25HaWYpLmF0dHIoJ3NyYycsICQodGhpcy5zZWwuYW5pbWF0aW9uR2lmKS5hdHRyKCdkYXRhLXNyYycpKTtcclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdhbmltYXRlZFBhZ2VzSGVyby0tbG9hZGVkJyk7XHJcbiAgICB9O1xyXG4gICAgZ2lmLnNyYyA9ICQodGhpcy5zZWwuYW5pbWF0aW9uR2lmKS5hdHRyKCdkYXRhLXNyYycpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlU2Nyb2xsKCkge1xyXG4gICAgaWYgKCQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpID4gMCkge1xyXG4gICAgICAkKHRoaXMuc2VsLnZhbikuYWRkQ2xhc3MoJ2FuaW1hdGVkUGFnZXNIZXJvX192YW4tLW91dCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHNldFRpbWVvdXQodGhpcy5iaW5kRXZlbnRzLCA1MTYwKTtcclxuICAgIHRoaXMucHJlbG9hZCgpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEFuaW1hdGVkUGFnZXNIZXJvKCk7XHJcbiIsImNsYXNzIEFuaW1hdGVkUGFyYWxsYXgge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5wYXJhbGxheFNlY3Rpb24nLFxyXG4gICAgICB0aWxlczogJy5wYXJhbGxheFNlY3Rpb25fX3RpbGU6bm90KC5wYXJhbGxheFNlY3Rpb25fX3RpbGUtLW5vUGFyYWxsYXgpJ1xyXG4gICAgfTtcclxuICAgIHRoaXMudGlsZXMgPSBbXTtcclxuXHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaGFuZGxlU2Nyb2xsID0gdGhpcy5oYW5kbGVTY3JvbGwuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0VGlsZXMgPSB0aGlzLmdldFRpbGVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmhhbmRsZVNjcm9sbCwge3Bhc3NpdmU6IHRydWV9KTtcclxuICAgICQod2luZG93KS5vbignc3RvcC5yZXNpemUnLCB0aGlzLmhhbmRsZVNjcm9sbCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVTY3JvbGwoKSB7XHJcbiAgICBsZXQgc2Nyb2xsUG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICBsZXQgdmlzaWJsZVRpbGVzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IHRpbGUgPSB0aGlzLnRpbGVzW2ldO1xyXG4gICAgICBpZiAodGlsZS5vZmZzZXRUb3AgPCBzY3JvbGxQb3NpdGlvbikge1xyXG4gICAgICAgIHZpc2libGVUaWxlcy5wdXNoKHRpbGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpc2libGVUaWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgdGlsZSA9IHZpc2libGVUaWxlc1tpXTtcclxuICAgICAgbGV0IG11bHRpcGxpZXIgPSB0aWxlLiR0aWxlLmhhc0NsYXNzKCdwYXJhbGxheFNlY3Rpb25fX3RpbGUtLWZhc3RQYXJhbGxheCcpID8gMC42IDogMC4zO1xyXG4gICAgICBsZXQgbXVsdGlwbGllck92ZXJyaWRlID0gdGlsZS4kdGlsZS5hdHRyKCdkYXRhLW11bHRpcGxpZXInKTtcclxuICAgICAgaWYgKG11bHRpcGxpZXJPdmVycmlkZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgbXVsdGlwbGllciA9IG11bHRpcGxpZXJPdmVycmlkZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHBhcmFsbGF4RGl2aWRlciA9IHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4ID8gNCA6IDI7XHJcbiAgICAgIGxldCBwYXJhbGxheE9mZnNldCA9ICh0aWxlLm9mZnNldFRvcCAtICQod2luZG93KS5zY3JvbGxUb3AoKSkgKiBtdWx0aXBsaWVyO1xyXG4gICAgICBpZiAodGlsZS4kdGlsZS5oYXNDbGFzcygncGFyYWxsYXhTZWN0aW9uX190aWxlLS1kb3duJykpIHtcclxuICAgICAgICBwYXJhbGxheE9mZnNldCA9ICgod2luZG93LmlubmVySGVpZ2h0ICsgJCh3aW5kb3cpLnNjcm9sbFRvcCgpKSAtICh0aWxlLm9mZnNldFRvcCArIHRpbGUuaGVpZ2h0KSkgKiBtdWx0aXBsaWVyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgbmV3VG9wID0gKHRpbGUub3JpZ2luYWxUb3AgKyAocGFyYWxsYXhPZmZzZXQgLyBwYXJhbGxheERpdmlkZXIpKTtcclxuICAgICAgbGV0IG1heFRvcCA9ICh0aWxlLiR0aWxlLmF0dHIoJ2RhdGEtbWF4LXRvcCcpKTtcclxuICAgICAgbGV0IG1pblRvcCA9ICh0aWxlLiR0aWxlLmF0dHIoJ2RhdGEtbWluLXRvcCcpKTtcclxuXHJcbiAgICAgIGlmIChtaW5Ub3AgIT09IHVuZGVmaW5lZCAmJiBuZXdUb3AgPD0gbWluVG9wKSB7XHJcbiAgICAgICAgbmV3VG9wID0gbWluVG9wO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobWF4VG9wICE9IHVuZGVmaW5lZCAmJiBuZXdUb3AgPj0gbWF4VG9wKSB7XHJcbiAgICAgICAgbmV3VG9wID0gbWF4VG9wO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aWxlLiR0aWxlLmNzcygndG9wJywgbmV3VG9wICsgJ3B4Jyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRUaWxlcygpIHtcclxuICAgICQodGhpcy5zZWwudGlsZXMpLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XHJcbiAgICAgIGxldCAkdGlsZSA9ICQoZWxlbWVudCk7XHJcbiAgICAgIGxldCB0b3BQb3NpdGlvbiA9IHBhcnNlSW50KCR0aWxlLmNzcygndG9wJyksIDEwKTtcclxuICAgICAgbGV0IG9mZnNldFRvcCA9ICR0aWxlLm9mZnNldCgpLnRvcDtcclxuICAgICAgdGhpcy50aWxlcy5wdXNoKHtcclxuICAgICAgICAkdGlsZTogJHRpbGUsXHJcbiAgICAgICAgb3JpZ2luYWxUb3A6IHRvcFBvc2l0aW9uLFxyXG4gICAgICAgIG9mZnNldFRvcDogb2Zmc2V0VG9wLFxyXG4gICAgICAgIGhlaWdodDogJHRpbGUub3V0ZXJIZWlnaHQoKVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybjtcclxuICAgIHRoaXMuZ2V0VGlsZXMoKTtcclxuICAgIHRoaXMuaGFuZGxlU2Nyb2xsKCk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBBbmltYXRlZFBhcmFsbGF4KCk7XHJcbiIsImNsYXNzIFNob3djYXNlUGFuZWwge1xyXG4gIGNvbnN0cnVjdG9yKCRlbGVtZW50KSB7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY2Fyb3VzZWw6ICcuYW5pbWF0ZWRTaG93Y2FzZVBhbmVsX19jYXJvdXNlbCcsXHJcbiAgICAgIGl0ZW1zOiAnLmFuaW1hdGVkU2hvd2Nhc2VQYW5lbF9fY2Fyb3VzZWxJdGVtJyxcclxuICAgICAgc3RhY2tlZEl0ZW1zOiAnLmFuaW1hdGVkU2hvd2Nhc2VQYW5lbF9fY2Fyb3VzZWxJdGVtOm5vdCguYW5pbWF0ZWRTaG93Y2FzZVBhbmVsX19jYXJvdXNlbEl0ZW0tLWhpZGRlbiknLFxyXG4gICAgICBuYXZpZ2F0aW9uOiAnLmFuaW1hdGVkU2hvd2Nhc2VQYW5lbF9fY2Fyb3VzZWxOYXZpZ2F0aW9uJyxcclxuICAgICAgbmF2aWdhdGlvbkl0ZW06ICcuYW5pbWF0ZWRTaG93Y2FzZVBhbmVsX19jYXJvdXNlbE5hdmlnYXRpb25JdGVtJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZG9IaWRlID0gdGhpcy5kb0hpZGUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZG9TaG93ID0gdGhpcy5kb1Nob3cuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2hvd0l0ZW0gPSB0aGlzLnNob3dJdGVtLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNjYWxlSXRlbXMgPSB0aGlzLnNjYWxlSXRlbXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY3JlYXRlTmF2aWdhdGlvbiA9IHRoaXMuY3JlYXRlTmF2aWdhdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmluaXQoKTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudHMoKSB7XHJcbiAgICB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuaXRlbXMpLnN3aXBlKHtcclxuICAgICAgc3dpcGU6IChldmVudCwgZGlyZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgbGV0ICRpdGVtID0gKCQoZXZlbnQudGFyZ2V0KS5oYXNDbGFzcygnYW5pbWF0ZWRTaG93Y2FzZVBhbmVsX19jYXJvdXNlbEl0ZW0nKSkgPyAkKGV2ZW50LnRhcmdldCkgOiAkKGV2ZW50LnRhcmdldCkucGFyZW50cyh0aGlzLnNlbC5pdGVtcyk7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gJGl0ZW0uaW5kZXgoKTtcclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHtcclxuICAgICAgICAgIHRoaXMuc2hvd0l0ZW0oaW5kZXggKyAxKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICAgICAgdGhpcy5zaG93SXRlbShpbmRleCAtIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgYWxsb3dQYWdlU2Nyb2xsOiAndmVydGljYWwnXHJcbiAgICB9KTtcclxuICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrJywgdGhpcy5zZWwubmF2aWdhdGlvbkl0ZW0sIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdGhpcy5zaG93SXRlbSgkKGUudGFyZ2V0KS5pbmRleCgpKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZG9IaWRlKCRpdGVtKSB7XHJcbiAgICAkaXRlbS5hZGRDbGFzcygnYW5pbWF0ZWRTaG93Y2FzZVBhbmVsX19jYXJvdXNlbEl0ZW0tLWhpZGRlbicpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICRpdGVtLmhpZGUoKTtcclxuICAgIH0sIDI1MCk7XHJcbiAgICB0aGlzLnNjYWxlSXRlbXMoKTtcclxuICB9XHJcblxyXG4gIGRvU2hvdygkaXRlbSkge1xyXG4gICAgJGl0ZW0uc2hvdygoKSA9PiB7XHJcbiAgICAgICRpdGVtLnJlbW92ZUNsYXNzKCdhbmltYXRlZFNob3djYXNlUGFuZWxfX2Nhcm91c2VsSXRlbS0taGlkZGVuJyk7XHJcbiAgICAgIHRoaXMuc2NhbGVJdGVtcygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzaG93SXRlbShpbmRleCkge1xyXG4gICAgLy8gSW5kZXggY2FuJ3QgYmUgbGVzcyB0aGFuIDBcclxuICAgIGluZGV4ID0gTWF0aC5tYXgoaW5kZXgsIDApO1xyXG4gICAgLy8gSW5kZXggY2FuJ3QgYmUgbW9yZSB0aGFuIHRoZSBudW1iZXIgb2YgaXRlbXNcclxuICAgIGluZGV4ID0gTWF0aC5taW4oaW5kZXgsICh0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuaXRlbXMpLmxlbmd0aCAtIDEpKTtcclxuICAgIC8vIEZpbmQgdGhlIGN1cnJlbnQgcG9zaXRpb25cclxuICAgIGxldCBjdXJyZW50SW5kZXggPSB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuc3RhY2tlZEl0ZW1zKS5maXJzdCgpLmluZGV4KCk7XHJcbiAgICAvLyBHZXQgdGhlIG51bWJlciBvZiBpdGVtcyB0byBtb3ZlXHJcbiAgICBsZXQgb2Zmc2V0ID0gY3VycmVudEluZGV4IC0gaW5kZXg7XHJcbiAgICAvLyBMb29wIHRoZSBudW1iZXIgb2YgdGhlIG9mZnNldFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmFicyhvZmZzZXQpOyBpKyspIHtcclxuICAgICAgLy8gVGhlIGFjdGlvbiB0byBldGhlaXIgc2hvdyBvciBoaWRlIGRlcGVuZGluZyBvbiBkaXJlY3Rpb25cclxuICAgICAgbGV0IGFjdGlvbiA9IHRoaXMuZG9IaWRlO1xyXG4gICAgICAvLyBUaGUgaXRlbSBpbmRleCBkZXBlbmRpbmcgb24gZGlyZWN0aW9uXHJcbiAgICAgIGxldCBpdGVtSW5kZXggPSBjdXJyZW50SW5kZXggKyBpO1xyXG4gICAgICAvLyBJZiBzaG91bGQgYmUgc2hvd2luZyBpdGVtc1xyXG4gICAgICBpZiAob2Zmc2V0ID4gMCkge1xyXG4gICAgICAgIC8vIENoYW5nZSBhY3Rpb25cclxuICAgICAgICBhY3Rpb24gPSB0aGlzLmRvU2hvdztcclxuICAgICAgICAvLyBDaGFuZ2UgaW5kZXhcclxuICAgICAgICBpdGVtSW5kZXggPSBjdXJyZW50SW5kZXggLSAoaSArIDEpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIEdldCB0aGUgaXRlbSBhdCB0aGUgaW5kZXhcclxuICAgICAgbGV0ICRpdGVtID0gdGhpcy4kZWxlbWVudC5maW5kKHRoaXMuc2VsLml0ZW1zKS5lcShpdGVtSW5kZXgpO1xyXG4gICAgICAvLyBSdW4gdGhlIGFjdGlvbiB3aXRoIGEgdGltZW91dFxyXG4gICAgICBzZXRUaW1lb3V0KGFjdGlvbiwgMjUwICogaSwgJGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgLy8gUmVtb3ZlIGFjdGl2ZSBuYXZpZ2F0aW9uIGl0ZW1cclxuICAgIHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5uYXZpZ2F0aW9uKS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgLy8gU2V0IHRoZSBjb3JyZWN0IG5hZ2l2YXRpb24gaXRlbSB0byBhY3RpdmVcclxuICAgIHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5uYXZpZ2F0aW9uSXRlbSkuZXEoaW5kZXgpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICB9XHJcblxyXG4gIHNjYWxlSXRlbXMoKSB7XHJcbiAgICB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuc3RhY2tlZEl0ZW1zKS5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xyXG4gICAgICBsZXQgJGl0ZW0gPSAkKGVsZW1lbnQpO1xyXG4gICAgICAvLyBObyB0cmFuc2Zvcm0gZm9yIGZpcnN0IGl0ZW1cclxuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgJGl0ZW0uY3NzKCd0cmFuc2Zvcm0nLCAnbm9uZScpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICAvLyBDYWxjdWxhdGUgdGhlIHNjYWxlLCA1JSBzbWFsbGVyIGZvciBlYWNoIGl0ZW1cclxuICAgICAgbGV0IHNjYWxlID0gMSAtICgwLjA1ICogaW5kZXgpO1xyXG4gICAgICAvLyBDYWxjdWxhdGUgaG93IGZhciB0byBtb3ZlIHRoZSBpdGVtIHJpZ2h0LCBzaG91bGQgYmUgMTVweCBidXQgbmVlZHMgdG8gYWNjb3VudCBmb3Igc2NhbGVcclxuICAgICAgbGV0IHRyYW5zbGF0ZSA9IHBhcnNlSW50KDE1ICogKDEgKyAoMC4wNSAqIGluZGV4KSksIDEwKSAqIGluZGV4O1xyXG4gICAgICAvLyBVcGRhdGUgdGhlIGl0ZW1cclxuICAgICAgJGl0ZW0uY3NzKCd0cmFuc2Zvcm0nLCAnc2NhbGUoJyArIHNjYWxlICsgJykgdHJhbnNsYXRlWCgnICsgdHJhbnNsYXRlICsgJ3B4KScpO1xyXG4gICAgfSk7XHJcbiAgICAvLyBBZGQgcmVhZHkgY2xhc3MgdG8gY2Fyb3VzZWxcclxuICAgIHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5jYXJvdXNlbCkuYWRkQ2xhc3MoJ2FuaW1hdGVkU2hvd2Nhc2VQYW5lbF9fY2Fyb3VzZWwtLXJlYWR5Jyk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVOYXZpZ2F0aW9uKCkge1xyXG4gICAgaWYgKHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5uYXZpZ2F0aW9uKS5sZW5ndGggPiAwKSByZXR1cm47XHJcbiAgICBsZXQgbmF2SXRlbXMgPSAnJztcclxuICAgIHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5pdGVtcykuZWFjaCgoaW5kZXgpID0+IHtcclxuICAgICAgbmF2SXRlbXMgKz0gJzxsaSBjbGFzcz1cImFuaW1hdGVkU2hvd2Nhc2VQYW5lbF9fY2Fyb3VzZWxOYXZpZ2F0aW9uSXRlbScgKyAoaW5kZXggPT09IDAgPyAnIGFjdGl2ZScgOiAnJykgKyAnXCI+PC9saT4nO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuY2Fyb3VzZWwpLmFmdGVyKCc8b2wgY2xhc3M9XCJhbmltYXRlZFNob3djYXNlUGFuZWxfX2Nhcm91c2VsTmF2aWdhdGlvblwiPicgKyBuYXZJdGVtcyArICc8L29sPicpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgdGhpcy5jcmVhdGVOYXZpZ2F0aW9uKCk7XHJcbiAgICB0aGlzLnNjYWxlSXRlbXMoKTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIEFuaW1hdGVkU2hvd2Nhc2VQYW5lbCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLmFuaW1hdGVkU2hvd2Nhc2VQYW5lbCdcclxuICAgIH07XHJcbiAgICB0aGlzLnBhbmVscyA9IFtdO1xyXG5cclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybjtcclxuICAgIC8vIEZvciBlYWNoIGNvbXBvbmVudCwgY3JlYXRlIGEgc2hvd2Nhc2UgcGFuZWxcclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4gdGhpcy5wYW5lbHMucHVzaChuZXcgU2hvd2Nhc2VQYW5lbCgkKGVsZW1lbnQpKSkpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEFuaW1hdGVkU2hvd2Nhc2VQYW5lbCgpO1xyXG4iLCJjbGFzcyBDYXJvdXNlbFJvdyB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLmNhcm91c2VsUm93JyxcclxuICAgICAgY2Fyb3VzZWw6ICcuY2Fyb3VzZWxSb3dfX2Nhcm91c2VsJyxcclxuICAgICAgYXJyb3dOZXh0OiAnLmNhcm91c2VsUm93IC5hcnJvd05leHQnLFxyXG4gICAgICBhcnJvd1ByZXY6ICcuY2Fyb3VzZWxSb3cgLmFycm93UHJldidcclxuICAgIH07XHJcbiAgICB0aGlzLmNhcm91c2VsID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLmJpbmRFdmVudHMgPSB0aGlzLmJpbmRFdmVudHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdENhcm91c2VsID0gdGhpcy5pbml0Q2Fyb3VzZWwuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaW5pdCA9IHRoaXMuaW5pdC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmFycm93TmV4dCwgKGUpPT57XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdGhpcy5jYXJvdXNlbC5uZXh0KCk7XHJcbiAgICB9KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmFycm93UHJldiwgKGUpPT57XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdGhpcy5jYXJvdXNlbC5wcmV2KCk7XHJcbiAgICB9KTtcclxuICAgICQodGhpcy5zZWwuY2Fyb3VzZWwpLnN3aXBlKHtcclxuICAgICAgc3dpcGU6IChldmVudCwgZGlyZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgICB0aGlzLmNhcm91c2VsLm5leHQoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICAgICAgdGhpcy5jYXJvdXNlbC5wcmV2KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBhbGxvd1BhZ2VTY3JvbGw6ICd2ZXJ0aWNhbCdcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaW5pdENhcm91c2VsKCkge1xyXG4gICAgdGhpcy5jYXJvdXNlbCA9ICQodGhpcy5zZWwuY2Fyb3VzZWwpLndhdGVyd2hlZWxDYXJvdXNlbCh7XHJcbiAgICAgIGZsYW5raW5nSXRlbXM6IDEsXHJcbiAgICAgIG9wYWNpdHlNdWx0aXBsaWVyOiAxLFxyXG4gICAgICBzZXBhcmF0aW9uOiA5MCxcclxuICAgICAgLyptb3ZpbmdUb0NlbnRlcjogKCRpdGVtKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ21vdmluZ1RvQ2VudGVyJywgJGl0ZW0pO1xyXG4gICAgICB9LFxyXG4gICAgICBtb3ZlZFRvQ2VudGVyOiAoJGl0ZW0pID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnbW92ZWRUb0NlbnRlcicsICRpdGVtKTtcclxuICAgICAgfSxcclxuICAgICAgbW92aW5nRnJvbUNlbnRlcjogKCRpdGVtKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ21vdmluZ0Zyb21DZW50ZXInLCAkaXRlbSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIG1vdmVkRnJvbUNlbnRlcjogKCRpdGVtKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ21vdmVkRnJvbUNlbnRlcicsICRpdGVtKTtcclxuICAgICAgfSxcclxuICAgICAgY2xpY2tlZENlbnRlcjogKCRpdGVtKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrZWRDZW50ZXInLCAkaXRlbSk7XHJcbiAgICAgIH0qL1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICB0aGlzLmluaXRDYXJvdXNlbCgpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IENhcm91c2VsUm93KCk7XHJcbiIsImNsYXNzIENvdW50ZXIge1xyXG4gIGNvbnN0cnVjdG9yKCRlbGVtZW50KSB7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgc3RhdHM6ICcuc3RhdHNQYW5lbF9fc3RhdHNWYWx1ZScsXHJcbiAgICAgIHRyaWdnZXI6ICcuc3RhdHNQYW5lbF9fd3JhcHBlcicsXHJcbiAgICAgIHByb2R1Y3RGaWxsOiAnLmJveEZpbGwnXHJcbiAgICB9O1xyXG4gICAgdGhpcy5hbmltYXRpb25zID0gW107XHJcbiAgICB0aGlzLmlzQW5pbWF0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmNvdW50VXAgPSB0aGlzLmNvdW50VXAuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucnVuQW5pbWF0aW9ucyA9IHRoaXMucnVuQW5pbWF0aW9ucy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oYW5kbGVTY3JvbGxPdXQgPSB0aGlzLmhhbmRsZVNjcm9sbE91dC5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuY291bnRVcCgpO1xyXG4gIH1cclxuXHJcbiAgY291bnRVcCgpIHtcclxuICAgIGxldCAkc3RhdHMgPSB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwuc3RhdHMpO1xyXG4gICAgbGV0IHNldHRpbmdzID0ge1xyXG4gICAgICBkdXJhdGlvbjogcGFyc2VJbnQodGhpcy4kZWxlbWVudC5hdHRyKCdkYXRhLWR1cmF0aW9uJyksIDEwKSB8fCAyLFxyXG4gICAgICBzZXBhcmF0b3I6IHRoaXMuJGVsZW1lbnQuYXR0cignZGF0YS1zZXBhcmF0b3InKSB8fCAnJyxcclxuICAgICAgZGVjaW1hbDogdGhpcy4kZWxlbWVudC5hdHRyKCdkYXRhLWRlY2ltYWwnKSB8fCAnLidcclxuICAgIH07XHJcbiAgICBsZXQgY291bnRzID0gW107XHJcblxyXG4gICAgJHN0YXRzLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XHJcbiAgICAgIGxldCBzdGFydCA9IHBhcnNlRmxvYXQoJChlbGVtZW50KS5hdHRyKCdkYXRhLXN0YXJ0JykpIHx8IDA7XHJcbiAgICAgIGxldCBlbmQgPSBwYXJzZUZsb2F0KCQoZWxlbWVudCkuYXR0cignZGF0YS1lbmQnKSk7XHJcbiAgICAgIGxldCBkZWNpbWFscyA9IHBhcnNlSW50KCQoZWxlbWVudCkuYXR0cignZGF0YS1kZWNpbWFscycpLCAxMCkgfHwgMDtcclxuICAgICAgbGV0IHByZWZpeCA9ICQoZWxlbWVudCkuYXR0cignZGF0YS1wcmVmaXgnKSB8fCAnJztcclxuICAgICAgbGV0IHN1ZmZpeCA9ICQoZWxlbWVudCkuYXR0cignZGF0YS1zdWZmaXgnKSB8fCAnJztcclxuICAgICAgbGV0IGR1cmF0aW9uID0gcGFyc2VGbG9hdCgkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtZHVyYXRpb24nKSkgfHwgc2V0dGluZ3MuZHVyYXRpb247XHJcblxyXG4gICAgICBjb3VudHMucHVzaCh7XHJcbiAgICAgICAgZWw6ICQoZWxlbWVudClbMF0sXHJcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxyXG4gICAgICAgIGVuZDogZW5kLFxyXG4gICAgICAgIGRlY2ltYWxzOiBkZWNpbWFscyxcclxuICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXHJcbiAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgcHJlZml4OiBwcmVmaXgsXHJcbiAgICAgICAgICBzdWZmaXg6IHN1ZmZpeFxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgX3RoaXMgPSBjb3VudHNbaV07XHJcbiAgICAgIGxldCBzdGF0QW5pbSA9IG5ldyBDb3VudFVwKFxyXG4gICAgICAgIF90aGlzLmVsLFxyXG4gICAgICAgIF90aGlzLnN0YXJ0LFxyXG4gICAgICAgIF90aGlzLmVuZCxcclxuICAgICAgICBfdGhpcy5kZWNpbWFscyxcclxuICAgICAgICBfdGhpcy5kdXJhdGlvbixcclxuICAgICAgICB7XHJcbiAgICAgICAgICB1c2VFYXNpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgc2VwYXJhdG9yOiBzZXR0aW5ncy5zZXBhcmF0b3IsXHJcbiAgICAgICAgICBkZWNpbWFsOiBzZXR0aW5ncy5kZWNpbWFsLFxyXG4gICAgICAgICAgcHJlZml4OiBfdGhpcy5vcHRpb25zLnByZWZpeCxcclxuICAgICAgICAgIHN1ZmZpeDogX3RoaXMub3B0aW9ucy5zdWZmaXhcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuYW5pbWF0aW9ucy5wdXNoKHN0YXRBbmltKTtcclxuICAgIH1cclxuICAgIHRoaXMucnVuQW5pbWF0aW9ucygpO1xyXG4gIH1cclxuXHJcbiAgcnVuQW5pbWF0aW9ucygpIHtcclxuICAgIGNvbnN0IHN0YXJ0ID0gKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5pc0FuaW1hdGVkKSByZXR1cm47XHJcbiAgICAgIGlmICgoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgKHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNzUpKSA+PSB0aGlzLiRlbGVtZW50LmZpbmQodGhpcy5zZWwudHJpZ2dlcikub2Zmc2V0KCkudG9wKSB7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc3RhcnQsIHtwYXNzaXZlOiB0cnVlfSk7IC8vIFN0b3AgZXZlbnQgZnJvbSB0cmlnZ2VyaW5nIG1vcmUgdGhhbiBvbmNlXHJcbiAgICAgICAgdGhpcy5pc0FuaW1hdGVkID0gdHJ1ZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYW5pbWF0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgdGhpcy5hbmltYXRpb25zW2ldLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuaGFuZGxlU2Nyb2xsT3V0LCB7cGFzc2l2ZTogdHJ1ZX0pO1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5wcm9kdWN0RmlsbCkuYWRkQ2xhc3MoJ2JveEZpbGwtLXNob3cnKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc3RhcnQsIHtwYXNzaXZlOiB0cnVlfSk7XHJcbiAgICAgIHN0YXJ0KCk7XHJcbiAgICB9LCA1MDApO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlU2Nyb2xsT3V0KCkge1xyXG4gICAgaWYgKCF0aGlzLmVsZW1lbnRJblZpZXdwb3J0KHRoaXMuJGVsZW1lbnRbMF0pKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hbmltYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpb25zW2ldLnJlc2V0KCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5pc0FuaW1hdGVkID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCh0aGlzLnNlbC5wcm9kdWN0RmlsbCkucmVtb3ZlQ2xhc3MoJ2JveEZpbGwtLXNob3cnKTtcclxuICAgICAgdGhpcy5ydW5BbmltYXRpb25zKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBlbGVtZW50SW5WaWV3cG9ydChlbCkge1xyXG4gICAgbGV0IHRvcCA9IGVsLm9mZnNldFRvcDtcclxuICAgIGxldCBsZWZ0ID0gZWwub2Zmc2V0TGVmdDtcclxuICAgIGxldCB3aWR0aCA9IGVsLm9mZnNldFdpZHRoO1xyXG4gICAgbGV0IGhlaWdodCA9IGVsLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICB3aGlsZShlbC5vZmZzZXRQYXJlbnQpIHtcclxuICAgICAgZWwgPSBlbC5vZmZzZXRQYXJlbnQ7XHJcbiAgICAgIHRvcCArPSBlbC5vZmZzZXRUb3A7XHJcbiAgICAgIGxlZnQgKz0gZWwub2Zmc2V0TGVmdDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICB0b3AgPCAod2luZG93LnBhZ2VZT2Zmc2V0ICsgd2luZG93LmlubmVySGVpZ2h0KSAmJlxyXG4gICAgICBsZWZ0IDwgKHdpbmRvdy5wYWdlWE9mZnNldCArIHdpbmRvdy5pbm5lcldpZHRoKSAmJlxyXG4gICAgICAodG9wICsgaGVpZ2h0KSA+IHdpbmRvdy5wYWdlWU9mZnNldCAmJlxyXG4gICAgICAobGVmdCArIHdpZHRoKSA+IHdpbmRvdy5wYWdlWE9mZnNldFxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIENvdW50IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuc3RhdHNQYW5lbCdcclxuICAgIH07XHJcbiAgICB0aGlzLmNvdW50ZXJzID0gW107XHJcblxyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuO1xyXG4gICAgLy8gRm9yIGVhY2ggY29tcG9uZW50LCBjcmVhdGUgYSBjb3VudGVyXHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZWFjaCgoaW5kZXgsIGVsZW1lbnQpID0+IHRoaXMuY291bnRlcnMucHVzaChuZXcgQ291bnRlcigkKGVsZW1lbnQpKSkpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IENvdW50KCk7XHJcbiIsImNsYXNzIEhlYWRlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmxhc3RMZXR0ZXIgPSAnJztcclxuICAgIHRoaXMuYWxsU3VnZ2VzdGlvbnMgPSBbXTtcclxuICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xO1xyXG4gICAgdGhpcy5tYXhTdWdnZXN0aW9ucyA9IDA7XHJcbiAgICB0aGlzLmxhc3RWYWwgPSAnJztcclxuXHJcbiAgICB0aGlzLnNlbCA9IHtcclxuICAgICAgY29tcG9uZW50OiAnLmhlYWRlcicsXHJcbiAgICAgIHRvZ2dsZTogJy5oZWFkZXJfX25hdmlnYXRpb24nLFxyXG4gICAgICBtZW51OiAnLmhlYWRlcl9fbWVnYW5hdicsXHJcbiAgICAgIG92ZXJsYXk6ICcuaGVhZGVyX19vdmVybGF5JyxcclxuICAgICAgc2VhcmNoOiAnLmhlYWRlcl9fZGVza3RvcFNlYXJjaCcsXHJcbiAgICAgIHNlYXJjaEZvcm06ICcuaGVhZGVyX19zZWFyY2hmb3JtJyxcclxuICAgICAgc2VhcmNoRm9ybUZvcm06ICcuaGVhZGVyX19zZWFyY2hmb3JtIGZvcm0nLFxyXG4gICAgICBzZWFyY2hGb3JtSW5wdXQ6ICcuaGVhZGVyX19zZWFyY2hmb3JtIC5mb3JtLWZpZWxkJyxcclxuICAgICAgc2VhcmNoRm9ybUlucHV0Q2xlYXI6ICcuaGVhZGVyX19zZWFyY2hmb3JtIC5mb3JtLWdyb3VwIC5jbGVhcicsXHJcbiAgICAgIHNlYXJjaFN1Z2dlc3Rpb25zOiAnLmhlYWRlcl9fc2VhcmNoZm9ybSAuc3VnZ2VzdGlvbnMnLFxyXG5cclxuICAgICAgY291bnRyeTogJy5oZWFkZXJfX2Rlc2t0b3BDb3VudHJ5JyxcclxuICAgICAgY291bnRyeUZvcm06ICcuaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwnLFxyXG4gICAgICBjb3VudHJ5U2Vjb25kYXJ5OiAnLmhlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsIC5tb2IgLndlbGNvbWVzIGEnXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuY29va2llTmFtZSA9ICdkaGwtZGVmYXVsdC1sYW5ndWFnZSc7XHJcblxyXG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gMDtcclxuXHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50b2dnbGVNZW51ID0gdGhpcy50b2dnbGVNZW51LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnRvZ2dsZVNlYXJjaCA9IHRoaXMudG9nZ2xlU2VhcmNoLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dTZWFyY2ggPSB0aGlzLnNob3dTZWFyY2guYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaGlkZVNlYXJjaCA9IHRoaXMuaGlkZVNlYXJjaC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy50b2dnbGVDb3VudHJ5ID0gdGhpcy50b2dnbGVDb3VudHJ5LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNob3dDb3VudHJ5ID0gdGhpcy5zaG93Q291bnRyeS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oaWRlQ291bnRyeSA9IHRoaXMuaGlkZUNvdW50cnkuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2VsZWN0Q291bnRyeVNlY29uZGFyeSA9IHRoaXMuc2VsZWN0Q291bnRyeVNlY29uZGFyeS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5ib2R5U2Nyb2xsaW5nID0gdGhpcy5ib2R5U2Nyb2xsaW5nLmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5jaGVja1Njcm9sbCA9IHRoaXMuY2hlY2tTY3JvbGwuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duJywgdGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0LCAoZSkgPT4ge1xyXG4gICAgICAvLyBkb3duIGFycm93ID0gNDBcclxuICAgICAgLy8gcmlnaHQgYXJyb3cgPSAzOVxyXG4gICAgICAvLyB1cCBhcnJvdyA9IDM4XHJcbiAgICAgIC8vIGxlZnQgYXJyb3cgPSAzN1xyXG4gICAgICAvLyB0YWIgPSA5XHJcbiAgICAgIGlmICgoZS5rZXlDb2RlID09PSA5ICYmICghZS5zaGlmdEtleSkpIHx8IChlLmtleUNvZGUgPT09IDQwKSB8fCAoZS5rZXlDb2RlID09PSAzOSkpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgrKztcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4ID49IHRoaXMubWF4U3VnZ2VzdGlvbnMpIHtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2hvd1N1Z2dlc3Rpb25zKHRydWUpO1xyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9IGVsc2UgaWYgKChlLmtleUNvZGUgPT09IDkgJiYgKGUuc2hpZnRLZXkpKSB8fCAoZS5rZXlDb2RlID09PSAzNykgfHwgKGUua2V5Q29kZSA9PT0gMzgpKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4LS07XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA8IDApIHtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IHRoaXMubWF4U3VnZ2VzdGlvbnMgLSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNob3dTdWdnZXN0aW9ucyh0cnVlKTtcclxuXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdrZXlwcmVzcycsIHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCwgKGUpID0+IHtcclxuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcclxuICAgICAgICB2YXIgZmllbGQgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgdmFyIHBhcmFtTmFtZSA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS5hdHRyKCduYW1lJyk7XHJcbiAgICAgICAgdmFyIHRlcm0gPSBmaWVsZC52YWwoKS50cmltKCk7XHJcbiAgICAgICAgdmFyIHVybCA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2FjdGlvbicpICsgJz8nICsgcGFyYW1OYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRlcm0pO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkKGRvY3VtZW50KS5vbigna2V5dXAnLCB0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQsIChlKSA9PiB7XHJcbiAgICAgIGlmICgoZS5rZXlDb2RlID09PSAxNikgfHwgKGUua2V5Q29kZSA9PT0gOSkgfHwgKGUua2V5Q29kZSA9PT0gNDApIHx8IChlLmtleUNvZGUgPT09IDM5KSB8fCAoZS5rZXlDb2RlID09PSAzNykgfHwgKGUua2V5Q29kZSA9PT0gMzgpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZmllbGQgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICAgIGlmIChmaWVsZC52YWwoKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgJCgnLnRvcC1zZWFyY2hlcycsIHRoaXMuc2VsLmNvbXBvbmVudCkuaGlkZSgpO1xyXG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0Q2xlYXIpLnNob3coKTtcclxuICAgICAgICB0aGlzLmNoZWNrU3VnZ2VzdGlvbnMoZmllbGQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY2xlYXJTdWdnZXN0aW9ucygpO1xyXG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0Q2xlYXIpLmhpZGUoKTtcclxuICAgICAgICAkKCcudG9wLXNlYXJjaGVzJywgdGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0Q2xlYXIsIChlKSA9PiB7XHJcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS52YWwoJycpO1xyXG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dENsZWFyKS5oaWRlKCk7XHJcbiAgICAgIHRoaXMuY2xlYXJTdWdnZXN0aW9ucygpO1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnRvZ2dsZSwgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB0aGlzLnRvZ2dsZU1lbnUoKTtcclxuICAgIH0pO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwub3ZlcmxheSwgdGhpcy50b2dnbGVNZW51KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLnNlYXJjaCwgdGhpcy50b2dnbGVTZWFyY2gpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuY291bnRyeSwgdGhpcy50b2dnbGVDb3VudHJ5KTtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIHRoaXMuc2VsLmNvdW50cnlTZWNvbmRhcnksIHRoaXMuc2VsZWN0Q291bnRyeVNlY29uZGFyeSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5oZWFkZXJfX2xhbmcsIC5oZWFkZXJfX2NvdW50cnlTZWxlY3RQYW5lbCAubGFuZ3MgYSwgLmhlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsIC5jb3VudHJpZXMgYScsIChldnQpID0+IHtcclxuICAgICAgbGV0IGhyZWYgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJyk7XHJcbiAgICAgIGxldCBob21lID0gJChldnQuY3VycmVudFRhcmdldCkuYXR0cignZGF0YS1ob21lJyk7XHJcbiAgICAgIGlmIChob21lICE9PSBudWxsICYmIGhvbWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGhyZWYgPSBob21lO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBDb29raWVzLnNldCh0aGlzLmNvb2tpZU5hbWUsIGhyZWYpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCB0aGlzLmNoZWNrU2Nyb2xsKTtcclxuICAgIHRoaXMuY2hlY2tTY3JvbGwoKTtcclxuXHJcbiAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLmxlbmd0aCA+IDApIHtcclxuICAgICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS52YWwoKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXRDbGVhcikuc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjaGVja1Njcm9sbCgpIHtcclxuICAgIHZhciB3dCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuICAgIHZhciBwYiA9ICQoJy5wYWdlLWJvZHknKS5vZmZzZXQoKS50b3A7XHJcbiAgICBpZiAod3QgPiBwYikge1xyXG4gICAgICAkKCcucGFnZS1ib2R5JykuYWRkQ2xhc3MoJ2ZpeGVkJyk7XHJcbiAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnZml4ZWQnKTtcclxuICAgICAgaWYgKHd0ID4gdGhpcy5sYXN0U2Nyb2xsVG9wKSB7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnJlbW92ZUNsYXNzKCdpbicpO1xyXG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLmFkZENsYXNzKCdpbicpO1xyXG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJy5wYWdlLWJvZHknKS5yZW1vdmVDbGFzcygnZml4ZWQnKTtcclxuICAgICAgJCh0aGlzLnNlbC5jb21wb25lbnQpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IHd0O1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlTWVudSgpIHtcclxuICAgIGlmICghJCh0aGlzLnNlbC5tZW51KS5pcygnOnZpc2libGUnKSkge1xyXG4gICAgICB0aGlzLmJvZHlTY3JvbGxpbmcoZmFsc2UpO1xyXG4gICAgICAkKHRoaXMuc2VsLnRvZ2dsZSkuYWRkQ2xhc3MoJ2hlYWRlcl9fbmF2aWdhdGlvbi0tb3BlbicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5ib2R5U2Nyb2xsaW5nKHRydWUpO1xyXG4gICAgICAkKHRoaXMuc2VsLnRvZ2dsZSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fbmF2aWdhdGlvbi0tb3BlbicpO1xyXG4gICAgfVxyXG4gICAgJCh0aGlzLnNlbC5tZW51KS5zbGlkZVRvZ2dsZSgxNTApO1xyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLmhhc0NsYXNzKCdoZWFkZXJfX3NlYXJjaGZvcm0tLW9wZW4nKSkge1xyXG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLnJlbW92ZUNsYXNzKCdoZWFkZXJfX3NlYXJjaGZvcm0tLW9wZW4nKTtcclxuICAgICAgJCh0aGlzLnNlbC5zZWFyY2gpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xyXG5cclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgJCh0aGlzLnNlbC5zZWFyY2gpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BTZWFyY2gtLWNsb3NlJyk7XHJcbiAgICAgIH0sIDE1MCk7XHJcbiAgICB9XHJcbiAgICBpZiAoJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkuaGFzQ2xhc3MoJ2hlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsLS1vcGVuJykpIHtcclxuICAgICAgJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsLS1vcGVuJyk7XHJcbiAgICAgICQodGhpcy5zZWwuY291bnRyeSkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAkKHRoaXMuc2VsLnNlYXJjaCkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcENvdW50cnktLWNsb3NlJyk7XHJcbiAgICAgIH0sIDE1MCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBib2R5U2Nyb2xsaW5nKGVuYWJsZWQpIHtcclxuICAgIGlmIChlbmFibGVkKSB7XHJcbiAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbW9kYWwtb3BlbicpO1xyXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnYXV0byc7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdtb2RhbC1vcGVuJyk7XHJcbiAgICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuc2NyZWVuLmF2YWlsSGVpZ2h0O1xyXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLmhlaWdodCA9IHdpbmRvd0hlaWdodC50b1N0cmluZygpICsgJ3B4JztcclxuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5oZWlnaHQgPSB3aW5kb3dIZWlnaHQudG9TdHJpbmcoKSArICdweCc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0b2dnbGVTZWFyY2goZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoKS5oYXNDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoLS1jbG9zZScpKSB7XHJcbiAgICAgIHRoaXMuaGlkZVNlYXJjaCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaG93U2VhcmNoKCk7XHJcblxyXG4gICAgICAkKCcudG9wLXNlYXJjaGVzJywgdGhpcy5zZWwuY29tcG9uZW50KS5oaWRlKCk7XHJcbiAgICAgICQoJy50b3Atc2VhcmNoZXMgLml0ZW1zJywgdGhpcy5zZWwuY29tcG9uZW50KS5lbXB0eSgpO1xyXG5cclxuICAgICAgdmFyIHVybCA9ICcnO1xyXG4gICAgICBpZiAoJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignZGF0YS10b3BzZWFyY2hlcycpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB1cmwgPSAkKHRoaXMuc2VsLnNlYXJjaEZvcm1Gb3JtKS5hdHRyKCdkYXRhLXRvcHNlYXJjaGVzJyk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVybC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgJC5nZXQodXJsLCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICB2YXIgY29udGFpbmVyID0gJCgnLnRvcC1zZWFyY2hlcyAuaXRlbXMnLCB0aGlzLnNlbC5jb21wb25lbnQpO1xyXG4gICAgICAgICAgdmFyIHBhcmFtTmFtZSA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS5hdHRyKCduYW1lJyk7XHJcbiAgICAgICAgICB2YXIgaGFzVGVybXMgPSBmYWxzZTtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LnJlc3VsdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaGFzVGVybXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgdGVybSA9IHJlc3VsdC5yZXN1bHRzW2ldLnRyaW0oKTtcclxuICAgICAgICAgICAgdmFyIHNlYXJjaFVybCA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2FjdGlvbicpICsgJz8nICsgcGFyYW1OYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHRlcm0pO1xyXG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kKGA8YSBocmVmPScke3NlYXJjaFVybH0nIHRpdGxlPScke3Rlcm19Jz48c3Bhbj4ke3Rlcm19PC9zcGFuPjwvYT5gKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoaGFzVGVybXMpIHtcclxuICAgICAgICAgICAgJCgnLnRvcC1zZWFyY2hlcycsIHRoaXMuc2VsLmNvbXBvbmVudCkuc2hvdygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzaG93U2VhcmNoKCkge1xyXG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsLS1vcGVuJyk7XHJcbiAgICAkKHRoaXMuc2VsLmNvdW50cnkpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xyXG5cclxuICAgICQodGhpcy5zZWwuc2VhcmNoKS5hZGRDbGFzcygnaGVhZGVyX19kZXNrdG9wU2VhcmNoLS1jbG9zZScpO1xyXG4gICAgJCh0aGlzLnNlbC5zZWFyY2gpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLmFkZENsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xyXG4gICAgJCh0aGlzLnNlbC5zZWFyY2hGb3JtKS5hZGRDbGFzcygnaGVhZGVyX19zZWFyY2hmb3JtLS1vcGVuJyk7XHJcbiAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm1JbnB1dCkuZm9jdXMoKTtcclxuXHJcbiAgICBpZiAoJCh0aGlzLnNlbC50b2dnbGUpLmhhc0NsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKSkge1xyXG4gICAgICB0aGlzLmJvZHlTY3JvbGxpbmcodHJ1ZSk7XHJcbiAgICAgICQodGhpcy5zZWwudG9nZ2xlKS5yZW1vdmVDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XHJcbiAgICAgICQodGhpcy5zZWwubWVudSkuc2xpZGVUb2dnbGUoMTUwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhpZGVTZWFyY2goKSB7XHJcbiAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLnJlbW92ZUNsYXNzKCdoZWFkZXJfX3NlYXJjaGZvcm0tLW9wZW4nKTtcclxuICAgICQodGhpcy5zZWwuc2VhcmNoKS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgJCh0aGlzLnNlbC5zZWFyY2gpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BTZWFyY2gtLWNsb3NlJyk7XHJcbiAgICB9LCAxNTApO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBjaGVja1N1Z2dlc3Rpb25zKGZpZWxkKSB7XHJcbiAgICB2YXIgdmFsID0gJC50cmltKGZpZWxkLnZhbCgpKTtcclxuICAgIHZhciBzID0gdmFsLnN1YnN0cigwLCAxKTtcclxuICAgIGlmIChzID09PSB0aGlzLmxhc3RMZXR0ZXIpIHtcclxuICAgICAgdGhpcy5zaG93U3VnZ2VzdGlvbnMoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY2xlYXJTdWdnZXN0aW9ucygpO1xyXG4gICAgICB0aGlzLmxhc3RMZXR0ZXIgPSBzO1xyXG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMTtcclxuXHJcbiAgICAgIHZhciB1cmwgPSAnJztcclxuICAgICAgaWYgKCQodGhpcy5zZWwuc2VhcmNoRm9ybUZvcm0pLmF0dHIoJ2RhdGEtc3VnZ2VzdGlvbnMnKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdXJsID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignZGF0YS1zdWdnZXN0aW9ucycpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkLmdldCh1cmwsIHsgczogcyB9LCAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5yZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuYWxsU3VnZ2VzdGlvbnMgPSBbXTtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LnJlc3VsdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hbGxTdWdnZXN0aW9ucy5wdXNoKHJlc3VsdC5yZXN1bHRzW2ldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuc2hvd1N1Z2dlc3Rpb25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsZWFyU3VnZ2VzdGlvbnMoKSB7XHJcbiAgICAkKHRoaXMuc2VsLnNlYXJjaFN1Z2dlc3Rpb25zKS5lbXB0eSgpLmhpZGUoKTtcclxuICB9XHJcblxyXG4gIHNob3dTdWdnZXN0aW9ucyh1c2VMYXN0VmFsKSB7XHJcbiAgICB0aGlzLmNsZWFyU3VnZ2VzdGlvbnMoKTtcclxuICAgIHZhciB2YWwgPSAkLnRyaW0oJCh0aGlzLnNlbC5zZWFyY2hGb3JtSW5wdXQpLnZhbCgpKTtcclxuICAgIGlmICh1c2VMYXN0VmFsKSB7XHJcbiAgICAgIHZhbCA9IHRoaXMubGFzdFZhbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubGFzdFZhbCA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaGFzVGVybXMgPSBmYWxzZTtcclxuICAgIHZhciBjID0gMDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hbGxTdWdnZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgY29udGFpbnMgPSBmYWxzZTtcclxuICAgICAgdmFyIHRlcm1zID0gdmFsLnRvTG93ZXJDYXNlKCkuc3BsaXQoL1xccy8pO1xyXG5cclxuICAgICAgZm9yICh2YXIgdCA9IDA7IHQgPCB0ZXJtcy5sZW5ndGg7IHQrKykge1xyXG4gICAgICAgIGNvbnRhaW5zID0gdGhpcy5hbGxTdWdnZXN0aW9uc1tpXS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRlcm1zW3RdLnRyaW0oKSk7XHJcbiAgICAgICAgaWYgKGNvbnRhaW5zKSBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBpZiAoKHZhbC5sZW5ndGggPT09IDEpIHx8IGNvbnRhaW5zKSB7XHJcbiAgICAgICAgdmFyIHBhcmFtTmFtZSA9ICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS5hdHRyKCduYW1lJyk7XHJcbiAgICAgICAgdmFyIHRlcm0gPSB0aGlzLmFsbFN1Z2dlc3Rpb25zW2ldLnRyaW0oKTtcclxuICAgICAgICB2YXIgdXJsID0gJCh0aGlzLnNlbC5zZWFyY2hGb3JtRm9ybSkuYXR0cignYWN0aW9uJykgKyAnPycgKyBwYXJhbU5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodGVybSk7XHJcbiAgICAgICAgdmFyIGNscyA9ICcnO1xyXG4gICAgICAgIGlmIChjID09PSB0aGlzLnNlbGVjdGVkSW5kZXgpIHtcclxuICAgICAgICAgICQodGhpcy5zZWwuc2VhcmNoRm9ybUlucHV0KS52YWwodGVybSk7XHJcbiAgICAgICAgICBjbHMgPSAnIGNsYXNzPVwic2VsZWN0ZWRcIic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLmFwcGVuZChgPGEke2Nsc30gaHJlZj0nJHt1cmx9JyB0aXRsZT0nJHt0ZXJtfSc+PHNwYW4+JHt0ZXJtfTwvc3Bhbj48L2E+YCk7XHJcbiAgICAgICAgaGFzVGVybXMgPSB0cnVlO1xyXG4gICAgICAgIGMrKztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGMgPj0gMTApIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgdGhpcy5tYXhTdWdnZXN0aW9ucyA9IGM7XHJcblxyXG4gICAgaWYgKGhhc1Rlcm1zKSB7XHJcbiAgICAgICQodGhpcy5zZWwuc2VhcmNoU3VnZ2VzdGlvbnMpLnNob3coKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRvZ2dsZUNvdW50cnkoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY291bnRyeSkuaGFzQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcENvdW50cnktLWNsb3NlJykpIHtcclxuICAgICAgdGhpcy5oaWRlQ291bnRyeSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaG93Q291bnRyeSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2hvd0NvdW50cnkoKSB7XHJcbiAgICAkKHRoaXMuc2VsLnNlYXJjaEZvcm0pLnJlbW92ZUNsYXNzKCdoZWFkZXJfX3NlYXJjaGZvcm0tLW9wZW4nKTtcclxuICAgICQodGhpcy5zZWwuc2VhcmNoKS5jbG9zZXN0KCcuaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0nKS5yZW1vdmVDbGFzcygnaGVhZGVyX19kZXNrdG9wTGlua0l0ZW0tLW9wZW4nKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAkKHRoaXMuc2VsLnNlYXJjaCkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcFNlYXJjaC0tY2xvc2UnKTtcclxuICAgIH0sIDE1MCk7XHJcblxyXG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5KS5hZGRDbGFzcygnaGVhZGVyX19kZXNrdG9wQ291bnRyeS0tY2xvc2UnKTtcclxuICAgICQodGhpcy5zZWwuY291bnRyeSkuY2xvc2VzdCgnLmhlYWRlcl9fZGVza3RvcExpbmtJdGVtJykuYWRkQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcExpbmtJdGVtLS1vcGVuJyk7XHJcbiAgICAkKHRoaXMuc2VsLmNvdW50cnlGb3JtKS5hZGRDbGFzcygnaGVhZGVyX19jb3VudHJ5U2VsZWN0UGFuZWwtLW9wZW4nKTtcclxuXHJcbiAgICBpZiAoJCh0aGlzLnNlbC50b2dnbGUpLmhhc0NsYXNzKCdoZWFkZXJfX25hdmlnYXRpb24tLW9wZW4nKSkge1xyXG4gICAgICB0aGlzLmJvZHlTY3JvbGxpbmcodHJ1ZSk7XHJcbiAgICAgICQodGhpcy5zZWwudG9nZ2xlKS5yZW1vdmVDbGFzcygnaGVhZGVyX19uYXZpZ2F0aW9uLS1vcGVuJyk7XHJcbiAgICAgICQodGhpcy5zZWwubWVudSkuc2xpZGVUb2dnbGUoMTUwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhpZGVDb3VudHJ5KCkge1xyXG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fY291bnRyeVNlbGVjdFBhbmVsLS1vcGVuJyk7XHJcbiAgICAkKHRoaXMuc2VsLmNvdW50cnkpLmNsb3Nlc3QoJy5oZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbScpLnJlbW92ZUNsYXNzKCdoZWFkZXJfX2Rlc2t0b3BMaW5rSXRlbS0tb3BlbicpO1xyXG4gICAgJCh0aGlzLnNlbC5jb3VudHJ5Rm9ybSkuZmluZCgnLm1vYicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICQodGhpcy5zZWwuY291bnRyeSkucmVtb3ZlQ2xhc3MoJ2hlYWRlcl9fZGVza3RvcENvdW50cnktLWNsb3NlJyk7XHJcbiAgICB9LCAxNTApO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBzZWxlY3RDb3VudHJ5U2Vjb25kYXJ5KGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICQodGhpcy5zZWwuY291bnRyeUZvcm0pLmZpbmQoJy5tb2InKS5hZGRDbGFzcygnb3BlbicpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEhlYWRlcigpO1xyXG4iLCJjbGFzcyBJRURldGVjdG9yIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWwgPSB7XG4gICAgICBjb21wb25lbnQ6ICdib2R5J1xuICAgIH07XG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRldGVjdElFID0gdGhpcy5kZXRlY3RJRS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoJCh0aGlzLnNlbC5jb21wb25lbnQpLmxlbmd0aCA8PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgdmFyIHZlcnNpb24gPSB0aGlzLmRldGVjdElFKCk7XG4gICAgaWYgKHZlcnNpb24gIT09IGZhbHNlKSB7XG4gICAgICBpZiAodmVyc2lvbiA+PSAxMikge1xuICAgICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2llLWVkZ2UnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcyhgaWUtJHt2ZXJzaW9ufWApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGRldGVjdElFKCkge1xuICAgIHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIC8vIFRlc3QgdmFsdWVzOyBVbmNvbW1lbnQgdG8gY2hlY2sgcmVzdWx0IOKAplxuICAgIC8vIElFIDEwXG4gICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKGNvbXBhdGlibGU7IE1TSUUgMTAuMDsgV2luZG93cyBOVCA2LjI7IFRyaWRlbnQvNi4wKSc7XG4gICAgLy8gSUUgMTFcbiAgICAvLyB1YSA9ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCA2LjM7IFRyaWRlbnQvNy4wOyBydjoxMS4wKSBsaWtlIEdlY2tvJzsgICAgLy8gRWRnZSAxMiAoU3BhcnRhbilcbiAgICAvLyB1YSA9ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXT1c2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzM5LjAuMjE3MS43MSBTYWZhcmkvNTM3LjM2IEVkZ2UvMTIuMCcgICAgLy8gRWRnZSAxM1xuICAgIC8vIHVhID0gJ01vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS80Ni4wLjI0ODYuMCBTYWZhcmkvNTM3LjM2IEVkZ2UvMTMuMTA1ODYnO1xuICAgIHZhciBtc2llID0gdWEuaW5kZXhPZignTVNJRSAnKTtcbiAgICBpZiAobXNpZSA+IDApIHtcbiAgICAgIC8vIElFIDEwIG9yIG9sZGVyID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhtc2llICsgNSwgdWEuaW5kZXhPZignLicsIG1zaWUpKSwgMTApO1xuICAgIH1cblxuICAgIHZhciB0cmlkZW50ID0gdWEuaW5kZXhPZignVHJpZGVudC8nKTtcbiAgICBpZiAodHJpZGVudCA+IDApIHtcbiAgICAgIC8vIElFIDExID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgdmFyIHJ2ID0gdWEuaW5kZXhPZigncnY6Jyk7XG4gICAgICByZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKHJ2ICsgMywgdWEuaW5kZXhPZignLicsIHJ2KSksIDEwKTtcbiAgICB9XG5cbiAgICB2YXIgZWRnZSA9IHVhLmluZGV4T2YoJ0VkZ2UvJyk7XG4gICAgaWYgKGVkZ2UgPiAwKSB7XG4gICAgICAvLyBFZGdlIChJRSAxMispID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhlZGdlICsgNSwgdWEuaW5kZXhPZignLicsIGVkZ2UpKSwgMTApO1xuICAgIH1cblxuICAgIC8vIG90aGVyIGJyb3dzZXJcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IElFRGV0ZWN0b3IoKTtcbiIsImltcG9ydCBTdHJpbmdzIGZyb20gJy4uL0hlbHBlcnMvU3RyaW5ncyc7XHJcblxyXG5jbGFzcyBJblBhZ2VOYXZpZ2F0aW9uIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VsID0ge1xyXG4gICAgICBjb21wb25lbnQ6ICcuaW5QYWdlTmF2aWdhdGlvbicsXHJcbiAgICAgIGxpc3Q6ICcuaW5QYWdlTmF2aWdhdGlvbl9fbGlzdCcsXHJcbiAgICAgIGxpc3RJdGVtczogJy5pblBhZ2VOYXZpZ2F0aW9uX19pdGVtJyxcclxuICAgICAgbGlua3M6ICcuaW5QYWdlTmF2aWdhdGlvbl9fbGluaycsXHJcbiAgICAgIHNlY3Rpb25zOiAnLmluUGFnZU5hdmlnYXRpb25TZWN0aW9uJyxcclxuICAgICAgc2VjdGlvblRpdGxlOiAnLmluUGFnZU5hdmlnYXRpb25TZWN0aW9uX190aXRsZScsXHJcbiAgICAgIHRlbXBsYXRlOiAnI2luUGFnZU5hdmlnYXRpb25fX3RlbXBsYXRlJ1xyXG4gICAgfTtcclxuICAgIHRoaXMuJHRlbXBsYXRlID0gbnVsbDtcclxuICAgIHRoaXMuc2VjdGlvbk9mZnNldHMgPSBbXTtcclxuICAgIHRoaXMuY29tcG9uZW50SGVpZ2h0ID0gMDtcclxuICAgIHRoaXMuYm90dG9tTGltaXQgPSAwO1xyXG5cclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5wb3B1bGF0ZUl0ZW1zID0gdGhpcy5wb3B1bGF0ZUl0ZW1zLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmFkZE9mZnNldCA9IHRoaXMuYWRkT2Zmc2V0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnBvc2l0aW9uQ29tcG9uZW50ID0gdGhpcy5wb3NpdGlvbkNvbXBvbmVudC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oYW5kbGVTY3JvbGwgPSB0aGlzLmhhbmRsZVNjcm9sbC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oYW5kbGVMaW5rQ2xpY2sgPSB0aGlzLmhhbmRsZUxpbmtDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jYWxjdWxhdGVWYWx1ZXMgPSB0aGlzLmNhbGN1bGF0ZVZhbHVlcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5oYW5kbGVTY3JvbGwsIHtwYXNzaXZlOiB0cnVlfSk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5saW5rcywgdGhpcy5oYW5kbGVMaW5rQ2xpY2spO1xyXG4gICAgJCh3aW5kb3cpLm9uKCdzdG9wLnJlc2l6ZScsIHRoaXMuY2FsY3VsYXRlVmFsdWVzKTtcclxuICB9XHJcblxyXG4gIHBvcHVsYXRlSXRlbXMoKSB7XHJcbiAgICBsZXQgJHNlY3Rpb25zID0gW107XHJcbiAgICAkKHRoaXMuc2VsLnNlY3Rpb25zKS5lYWNoKChpbmRleCwgZWxtKSA9PiB7XHJcbiAgICAgIGxldCByYW5kb21JZCA9IFN0cmluZ3MuaWQoKTtcclxuICAgICAgJChlbG0pLmF0dHIoJ2lkJywgcmFuZG9tSWQpO1xyXG4gICAgICBsZXQgJGl0ZW0gPSAkKHRoaXMuJHRlbXBsYXRlLmNsb25lKCkuaHRtbCgpKTtcclxuICAgICAgJGl0ZW0uZmluZCgnLmluUGFnZU5hdmlnYXRpb25fX2xpbmsnKS5hdHRyKCdocmVmJywgJyMnICsgcmFuZG9tSWQpO1xyXG4gICAgICAkc2VjdGlvbnMucHVzaCgkaXRlbSk7XHJcbiAgICAgIHRoaXMuYWRkT2Zmc2V0KCQoZWxtKSk7XHJcbiAgICB9KTtcclxuICAgICQodGhpcy5zZWwubGlzdCkuaHRtbCgnJykuYXBwZW5kKCRzZWN0aW9ucyk7XHJcbiAgICAkKHRoaXMuc2VsLmxpc3RJdGVtcykuZmlyc3QoKS5maW5kKHRoaXMuc2VsLmxpbmtzKS5hZGRDbGFzcygnaW5QYWdlTmF2aWdhdGlvbl9fbGluay0tYWN0aXZlJyk7XHJcbiAgICB0aGlzLnBvc2l0aW9uQ29tcG9uZW50KCk7XHJcbiAgICAvLyBTb3J0IG9mZnNldHMgdG8gbGFzdCBmaXJzdFxyXG4gICAgdGhpcy5zZWN0aW9uT2Zmc2V0cy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgIGlmIChhLnRvcCA+IGIudG9wKSB7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICB9IGVsc2UgaWYgKGIudG9wID4gYS50b3ApIHtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5jYWxjdWxhdGVWYWx1ZXMoKTtcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZVZhbHVlcygpIHtcclxuICAgIC8vIEdldCB0aGUgaGVpZ2h0IG9mIHRoZSBjb21wb25lbnRcclxuICAgIHRoaXMuY29tcG9uZW50SGVpZ2h0ID0gJCh0aGlzLnNlbC5saXN0KS5oZWlnaHQoKTtcclxuICAgIC8vIEdldCB0aGUgbWF4aW11bSBkaXN0YW5jZSBmcm9tIHRoZSB0b3Agb2YgdGhlIGRvY3VtZW50IHRoZSBjb21wb25lbnQgY2FuIG1vdmVcclxuICAgIHRoaXMuYm90dG9tTGltaXQgPSAkKCdmb290ZXInKS5vZmZzZXQoKS50b3AgLSA4MDtcclxuICB9XHJcblxyXG4gIGFkZE9mZnNldCgkZWxtKSB7XHJcbiAgICBsZXQgdG9wID0gJGVsbS5vZmZzZXQoKS50b3A7XHJcbiAgICBsZXQgaWQgPSAkZWxtLmF0dHIoJ2lkJyk7XHJcbiAgICB0aGlzLnNlY3Rpb25PZmZzZXRzLnB1c2goe1xyXG4gICAgICB0b3A6IHRvcCxcclxuICAgICAgaWQ6IGlkXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHBvc2l0aW9uQ29tcG9uZW50KCkge1xyXG4gICAgbGV0IHRvcFBvc2l0aW9uID0gJCh0aGlzLnNlbC5zZWN0aW9ucykuZmlyc3QoKS5vZmZzZXQoKS50b3A7XHJcbiAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuY3NzKCd0b3AnLCB0b3BQb3NpdGlvbiArICdweCcpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlU2Nyb2xsKCkge1xyXG4gICAgLy8gR2V0IHRoZSBjdXJyZW50IHNjcm9sbCBwb3NpdGlvblxyXG4gICAgbGV0IHNjcm9sbFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBib3R0b20gcG9zaXRpb24gb2YgdGhlIGxpc3QgdXNpbmcgc2Nyb2xsIHBvc2l0aW9uIG5vdCBlbGVtZW50IHBvc2l0aW9uLiAgSWYgdXNlIGVsZW1lbnQgcG9zaXRpb24gaXQgY2hhbmdlcyBiZWNhdXNlIHdlIGFmZml4IGl0XHJcbiAgICBsZXQgYm90dG9tUG9zaXRpb24gPSBzY3JvbGxQb3NpdGlvbiArICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSArICh0aGlzLmNvbXBvbmVudEhlaWdodCAvIDIpO1xyXG4gICAgLy8gSWYgdGhlIGxpc3QgcG9zaXRpb24gaXMgb24gb3IgYmVsb3cgdGhlIGxpbWl0XHJcbiAgICBpZiAoYm90dG9tUG9zaXRpb24gPj0gdGhpcy5ib3R0b21MaW1pdCkge1xyXG4gICAgICAvLyBBZmZpeCBpdFxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuYWRkQ2xhc3MoJ2luUGFnZU5hdmlnYXRpb24tLWFmZml4JykuZmluZCh0aGlzLnNlbC5saXN0KS5jc3MoJ3RvcCcsICh0aGlzLmJvdHRvbUxpbWl0IC0gdGhpcy5jb21wb25lbnRIZWlnaHQpICsgJ3B4Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBVbi1hZmZpeCBpdFxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkucmVtb3ZlQ2xhc3MoJ2luUGFnZU5hdmlnYXRpb24tLWFmZml4JykuZmluZCh0aGlzLnNlbC5saXN0KS5jc3MoJ3RvcCcsICcnKTtcclxuICAgIH1cclxuICAgIC8vIEdldCB0aGUgaW5uZXIgaGVpZ2h0IG9mIHRoZSB3aW5kb3dcclxuICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICAvLyBGb3IgZWFjaCBzZWN0aW9uIGluIHRoZSBwYWdlXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VjdGlvbk9mZnNldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgLy8gR2V0IHRoaXMgc2VjdGlvbiBpbmZvXHJcbiAgICAgIGxldCBzZWN0aW9uID0gdGhpcy5zZWN0aW9uT2Zmc2V0c1tpXTtcclxuICAgICAgLy8gSWYgc2VjdGlvbiBpcyAzMy4zMyUgZnJvbSB0b3Agb2Ygdmlld3BvcnQsIGFjdGl2YXRlIGl0J3MgbmF2IGl0ZW1cclxuICAgICAgaWYgKChzY3JvbGxQb3NpdGlvbiArICh3aW5kb3dIZWlnaHQgKiAwLjMzKSkgPj0gc2VjdGlvbi50b3ApIHtcclxuICAgICAgICAvLyBSZW1vdmUgdGhlIGFjdGl2ZSBjbGFzcyBmcm9tIGFueSBvdGhlciBuYXYgaXRlbVxyXG4gICAgICAgICQodGhpcy5zZWwubGlua3MpLnJlbW92ZUNsYXNzKCdpblBhZ2VOYXZpZ2F0aW9uX19saW5rLS1hY3RpdmUnKTtcclxuICAgICAgICAvLyBBZGQgYWN0aXZlIGNsYXNzIHRvIHRoaXMgaXRlbVxyXG4gICAgICAgICQodGhpcy5zZWwubGlua3MpLmZpbHRlcignW2hyZWY9XCIjJyArIHNlY3Rpb24uaWQgKyAnXCJdJykuYWRkQ2xhc3MoJ2luUGFnZU5hdmlnYXRpb25fX2xpbmstLWFjdGl2ZScpO1xyXG4gICAgICAgIC8vIFN0b3AgY2hlY2tpbmcgb3RoZXIgc2VjdGlvbnMsIGl0J3MgaW4gcmV2ZXJzZSBvcmRlclxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlTGlua0NsaWNrKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGxldCB0YXJnZXRJZCA9ICQoZS50YXJnZXQpLmF0dHIoJ2hyZWYnKTtcclxuICAgIGxldCBzY3JvbGxQb3NpdGlvbiA9ICQodGFyZ2V0SWQpLm9mZnNldCgpLnRvcDtcclxuICAgICQoJ2h0bWwsYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICBzY3JvbGxUb3A6IHNjcm9sbFBvc2l0aW9uXHJcbiAgICB9LCAzMDApO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybjtcclxuICAgIHRoaXMuJHRlbXBsYXRlID0gJCh0aGlzLnNlbC50ZW1wbGF0ZSk7XHJcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIHRoaXMucG9wdWxhdGVJdGVtcygpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEluUGFnZU5hdmlnYXRpb24oKTtcclxuIiwiY2xhc3MgTGFuZGluZ1BhZ2VCdXR0b24ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5wYWdlLWJvZHkubGFuZGluZy1wYWdlLXR3b2NvbCAuaGVybyAuaGVyb19fY3RhJ1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkubGVuZ3RoIDw9IDApIHJldHVybiBmYWxzZTtcclxuICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBiaW5kRXZlbnRzKCkge1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgdGhpcy5zZWwuY29tcG9uZW50LCAoZXZ0KSA9PiB7XHJcbiAgICAgIHZhciBpZCA9ICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2hyZWYnKTtcclxuICAgICAgdmFyIG9mZnNldCA9ICQoaWQpLm9mZnNldCgpLnRvcDtcclxuICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgIHNjcm9sbFRvcDogb2Zmc2V0XHJcbiAgICAgIH0sIDEwMDAsICdzd2luZycpO1xyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgTGFuZGluZ1BhZ2VCdXR0b24oKTtcclxuIiwiY2xhc3MgU2hpcE5vd1R3b1N0ZXBGb3JtIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuZmlyc3RuYW1lID0gJyc7XHJcbiAgICB0aGlzLmxhc3RuYW1lID0gJyc7XHJcbiAgICB0aGlzLmVtYWlsID0gJyc7XHJcblxyXG4gICAgdGhpcy5jb25maWcgPSB7XHJcbiAgICAgIC8vIGZiQXBwSWQ6ICcxMDAwNzczMTYzMzM3Nzk4JyxcclxuICAgICAgZmJBcHBJZDogJzEwODAwMzEzMjg4MDEyMTEnLFxyXG4gICAgICAvLyBnb0NsaWVudElkOiAnOTEzOTYwMzUyMjM2LXU3dW4wbDIydHZrbWxicGE1YmNuZjF1cWc0Y3NpN2UzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJyxcclxuICAgICAgZ29DbGllbnRJZDogJzMxMzQ2OTgzNzQyMC1sODgyaDM5Z2U4bjhuOXBiOTdsZHZqazNmbThwcHFncy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZWwgPSB7XHJcbiAgICAgIGNvbXBvbmVudDogJy5zaGlwTm93TXVsdGkud3lzaXd5ZywgLmFuaW1hdGVkRm9ybScsXHJcbiAgICAgIHN3aW5nYnV0dG9uOiAnLnNoaXBOb3dNdWx0aV9faGVhZGN0YS0tcmVkJyxcclxuICAgICAgZm9ybXM6ICdmb3JtLmZvcm1zLnNoaXAtbm93LXR3b3N0ZXAnLFxyXG4gICAgICBmb3JtMTogJ2Zvcm0uZm9ybXMuZm9ybTEuc2hpcC1ub3ctdHdvc3RlcCcsXHJcbiAgICAgIGZvcm0yOiAnZm9ybS5mb3Jtcy5mb3JtMi5zaGlwLW5vdy10d29zdGVwJyxcclxuICAgICAgY291bnRyeXNlbGVjdDogJ2Zvcm0uZm9ybXMuZm9ybTIuc2hpcC1ub3ctdHdvc3RlcCAjc2hpcG5vd19jb3VudHJ5JyxcclxuXHJcbiAgICAgIGJ1dHRvbkZhY2Vib29rOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5mYWNlYm9vaycsXHJcbiAgICAgIGJ1dHRvbkxpbmtlZGluOiAnLmZvcm1zX19jdGEtLXNvY2lhbC5saW5rZWRpbicsXHJcbiAgICAgIGJ1dHRvbkdvb2dsZVBsdXM6ICcuZm9ybXNfX2N0YS0tc29jaWFsLmdvb2dsZSdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRQYXRoUHJlZml4ID0gdGhpcy5nZXRQYXRoUHJlZml4LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmluaXQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYmluZEV2ZW50cyA9IHRoaXMuYmluZEV2ZW50cy5iaW5kKHRoaXMpO1xyXG5cclxuICAgIHRoaXMudG9nZ2xlQWRkcmVzcyA9IHRoaXMudG9nZ2xlQWRkcmVzcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zdWJtaXRGYWNlYm9vayA9IHRoaXMuc3VibWl0RmFjZWJvb2suYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc3VibWl0TGlua2VkaW4gPSB0aGlzLnN1Ym1pdExpbmtlZGluLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnN1Ym1pdEdvb2dsZSA9IHRoaXMuc3VibWl0R29vZ2xlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnN1Ym1pdEZvcm0xID0gdGhpcy5zdWJtaXRGb3JtMS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5uZXh0Rm9ybSA9IHRoaXMubmV4dEZvcm0uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc3VibWl0Rm9ybTIgPSB0aGlzLnN1Ym1pdEZvcm0yLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldEZvcm1EYXRhID0gdGhpcy5nZXRGb3JtRGF0YS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zaG93U3VjY2VzcyA9IHRoaXMuc2hvd1N1Y2Nlc3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMudmFsaWRhdGUgPSB0aGlzLnZhbGlkYXRlLmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXRoUHJlZml4KCkge1xyXG4gICAgY29uc3QgcHJlZml4ID0gJCgnaGVhZCBtZXRhW25hbWU9XFwnZGhsLXBhdGgtcHJlZml4XFwnXScpLmF0dHIoJ2NvbnRlbnQnKTtcclxuICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogJycpO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50cygpIHtcclxuICAgICQoZG9jdW1lbnQpLm9uKCdzdWJtaXQnLCB0aGlzLnNlbC5mb3JtMSwgdGhpcy5zdWJtaXRGb3JtMSk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignc3VibWl0JywgdGhpcy5zZWwuZm9ybTIsIHRoaXMuc3VibWl0Rm9ybTIpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2NoYW5nZScsIHRoaXMuc2VsLmNvdW50cnlzZWxlY3QsIHRoaXMudG9nZ2xlQWRkcmVzcyk7XHJcblxyXG4gICAgdmFyIGNvdW50cnkgPSAkKHRoaXMuc2VsLmZvcm0yKS5kYXRhKCdwcmVzZWxlY3Rjb3VudHJ5Jyk7XHJcbiAgICBpZiAoKGNvdW50cnkgIT09IG51bGwpICYmICQudHJpbShjb3VudHJ5KS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICQodGhpcy5zZWwuY291bnRyeXNlbGVjdCkudmFsKGNvdW50cnkpLnRyaWdnZXIoJ2NoYW5nZScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykubGVuZ3RoID4gMCkge1xyXG4gICAgICB3aW5kb3cuZmJBc3luY0luaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LmZiX2ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LkZCKSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LkZCICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5GQi5pbml0KHtcclxuICAgICAgICAgICAgICBhcHBJZDogdGhpcy5jb25maWcuZmJBcHBJZCxcclxuICAgICAgICAgICAgICBjb29raWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgeGZibWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmVyc2lvbjogJ3YyLjgnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh3aW5kb3cuZmJfaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhY2Vib29rLWpzc2RrJykgPT09IG51bGwpIHtcclxuICAgICAgICB2YXIgZmpzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xyXG4gICAgICAgIHZhciBqcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIGpzLmlkID0gJ2ZhY2Vib29rLWpzc2RrJztcclxuICAgICAgICBqcy5zcmMgPSAnLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9FTi9zZGsuanMnO1xyXG4gICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcclxuICAgICAgfVxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25GYWNlYm9vaykub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc3VibWl0RmFjZWJvb2soZXZ0KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikubGVuZ3RoID4gMCkge1xyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25MaW5rZWRpbikub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc3VibWl0TGlua2VkaW4oZXZ0KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBnb29nbGVCdXR0b24gPSAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKTtcclxuICAgIGlmIChnb29nbGVCdXR0b24ubGVuZ3RoID4gMCkge1xyXG4gICAgICB3aW5kb3cuZ29faW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LmdhcGkpICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuZ2FwaSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgd2luZG93LmdhcGkubG9hZCgnYXV0aDInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBhdXRoMiA9IHdpbmRvdy5nYXBpLmF1dGgyLmluaXQoe1xyXG4gICAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jb25maWcuZ29DbGllbnRJZCxcclxuICAgICAgICAgICAgICBjb29raWVwb2xpY3k6ICdzaW5nbGVfaG9zdF9vcmlnaW4nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBnb29nbGVCdXR0b24uZ2V0KDApO1xyXG4gICAgICAgICAgICBhdXRoMi5hdHRhY2hDbGlja0hhbmRsZXIoZWxlbWVudCwge30sXHJcbiAgICAgICAgICAgICAgKGdvb2dsZVVzZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VibWl0R29vZ2xlKGdvb2dsZVVzZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvciAhPT0gJ3BvcHVwX2Nsb3NlZF9ieV91c2VyJykge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydChyZXN1bHQuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwod2luZG93LmdvX2ludGVydmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgICAkKHRoaXMuc2VsLmNvbXBvbmVudCkuZmluZCh0aGlzLnNlbC5idXR0b25Hb29nbGVQbHVzKS5vbignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCB0aGlzLnNlbC5zd2luZ2J1dHRvbiwgKGV2dCkgPT4ge1xyXG4gICAgICB2YXIgaWQgPSAkKGV2dC5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJyk7XHJcbiAgICAgIHZhciBvZmZzZXQgPSAkKGlkKS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICBzY3JvbGxUb3A6IG9mZnNldFxyXG4gICAgICB9LCAxMDAwLCAnc3dpbmcnKTtcclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGUoKSB7XHJcbiAgICAkKHRoaXMuc2VsLmZvcm1zKS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xyXG4gICAgICAkKGl0ZW0pLnZhbGlkYXRlKHtcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogKGVycm9yLCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCd0eXBlJykgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKCdsYWJlbCcpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5pcygnc2VsZWN0JykpIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkuZmluZCgnLnNlbGVjdGJveGl0LWJ0bicpLmFkZENsYXNzKCdlcnJvcicpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWNjZXNzOiAobGFiZWwpID0+IHtcclxuICAgICAgICAgIGxldCAkcGFyZW50ID0gJChsYWJlbCkucGFyZW50cygnZm9ybS5zaGlwLW5vdycpO1xyXG4gICAgICAgICAgaWYgKCRwYXJlbnQuZmluZCgnc2VsZWN0JykubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkcGFyZW50LmZpbmQoJy5zZWxlY3Rib3hpdC1idG4nKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVBZGRyZXNzKGUpIHtcclxuICAgIHZhciB2YWwgPSAkKHRoaXMuc2VsLmNvdW50cnlzZWxlY3QpLnZhbCgpO1xyXG5cclxuICAgIHZhciBvcHRpb25zID0gJCgnb3B0aW9uJywgdGhpcy5zZWwuY291bnRyeXNlbGVjdCk7XHJcbiAgICB2YXIgbWFuZGF0b3J5ID0gdHJ1ZTtcclxuICAgIG9wdGlvbnMuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcclxuICAgICAgaWYgKCQoaXRlbSkuYXR0cigndmFsdWUnKSA9PT0gdmFsICYmICgnJyArICQoaXRlbSkuZGF0YSgnbm9ubWFuZGF0b3J5JykpID09PSAndHJ1ZScpIHtcclxuICAgICAgICBtYW5kYXRvcnkgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG1hbmRhdG9yeSkge1xyXG4gICAgICAkKCcjc2hpcG5vd19hZGRyZXNzJywgdGhpcy5zZWwuZm9ybSkuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKS5hdHRyKCdwbGFjZWhvbGRlcicsICdBZGRyZXNzKicpO1xyXG4gICAgICAkKCcjc2hpcG5vd196aXAnLCB0aGlzLnNlbC5mb3JtKS5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ1pJUCBvciBQb3N0Y29kZSonKTtcclxuICAgICAgJCgnI3NoaXBub3dfY2l0eScsIHRoaXMuc2VsLmZvcm0pLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJykuYXR0cigncGxhY2Vob2xkZXInLCAnQ2l0eSonKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJyNzaGlwbm93X2FkZHJlc3MnLCB0aGlzLnNlbC5mb3JtKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0FkZHJlc3MnKS5yZW1vdmVDbGFzcygnZXJyb3InKS5jbG9zZXN0KCdkaXYnKS5maW5kKCdsYWJlbCcpLnJlbW92ZSgpO1xyXG4gICAgICAkKCcjc2hpcG5vd196aXAnLCB0aGlzLnNlbC5mb3JtKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ1pJUCBvciBQb3N0Y29kZScpLnJlbW92ZUNsYXNzKCdlcnJvcicpLmNsb3Nlc3QoJ2RpdicpLmZpbmQoJ2xhYmVsJykucmVtb3ZlKCk7XHJcbiAgICAgICQoJyNzaGlwbm93X2NpdHknLCB0aGlzLnNlbC5mb3JtKS5yZW1vdmVBdHRyKCdyZXF1aXJlZCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ0NpdHknKS5yZW1vdmVDbGFzcygnZXJyb3InKS5jbG9zZXN0KCdkaXYnKS5maW5kKCdsYWJlbCcpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3VibWl0RmFjZWJvb2soZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB3aW5kb3cuRkIubG9naW4oKGxvZ2luUmVzcG9uc2UpID0+IHtcclxuICAgICAgaWYgKGxvZ2luUmVzcG9uc2UuYXV0aFJlc3BvbnNlKSB7XHJcbiAgICAgICAgd2luZG93LkZCLmFwaSgnL21lJywgKGRhdGFSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5maXJzdG5hbWUgPSBkYXRhUmVzcG9uc2UuZmlyc3RfbmFtZTtcclxuICAgICAgICAgIHRoaXMubGFzdG5hbWUgPSBkYXRhUmVzcG9uc2UubGFzdF9uYW1lO1xyXG4gICAgICAgICAgdGhpcy5lbWFpbCA9IGRhdGFSZXNwb25zZS5lbWFpbDtcclxuXHJcbiAgICAgICAgICB0aGlzLm5leHRGb3JtKCk7XHJcbiAgICAgICAgfSwgeyBmaWVsZHM6IFsgJ2lkJywgJ2VtYWlsJywgJ2ZpcnN0X25hbWUnLCAnbGFzdF9uYW1lJyBdfSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSwgeyBzY29wZTogJ2VtYWlsLHB1YmxpY19wcm9maWxlJywgcmV0dXJuX3Njb3BlczogdHJ1ZSB9KTtcclxuICB9XHJcblxyXG4gIHN1Ym1pdExpbmtlZGluKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgSU4uVXNlci5hdXRob3JpemUoKCkgPT4ge1xyXG4gICAgICBJTi5BUEkuUHJvZmlsZSgnbWUnKS5maWVsZHMoJ2lkJywgJ2ZpcnN0LW5hbWUnLCAnbGFzdC1uYW1lJywgJ2VtYWlsLWFkZHJlc3MnKS5yZXN1bHQoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIHZhciBtZW1iZXIgPSByZXN1bHQudmFsdWVzWzBdO1xyXG5cclxuICAgICAgICB0aGlzLmZpcnN0bmFtZSA9IG1lbWJlci5maXJzdE5hbWU7XHJcbiAgICAgICAgdGhpcy5sYXN0bmFtZSA9IG1lbWJlci5sYXN0TmFtZTtcclxuICAgICAgICB0aGlzLmVtYWlsID0gbWVtYmVyLmVtYWlsQWRkcmVzcztcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0Rm9ybSgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHdpbmRvdy5JTi5Vc2VyLmlzQXV0aG9yaXplZCgpO1xyXG4gICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgSU4uQVBJLlByb2ZpbGUoJ21lJykuZmllbGRzKCdpZCcsICdmaXJzdC1uYW1lJywgJ2xhc3QtbmFtZScsICdlbWFpbC1hZGRyZXNzJykucmVzdWx0KChyZXN1bHQpID0+IHtcclxuICAgICAgICAgIHZhciBtZW1iZXIgPSByZXN1bHQudmFsdWVzWzBdO1xyXG4gIFxyXG4gICAgICAgICAgdGhpcy5maXJzdG5hbWUgPSBtZW1iZXIuZmlyc3ROYW1lO1xyXG4gICAgICAgICAgdGhpcy5sYXN0bmFtZSA9IG1lbWJlci5sYXN0TmFtZTtcclxuICAgICAgICAgIHRoaXMuZW1haWwgPSBtZW1iZXIuZW1haWxBZGRyZXNzO1xyXG4gIFxyXG4gICAgICAgICAgdGhpcy5uZXh0Rm9ybSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBzdWJtaXRHb29nbGUoZ29vZ2xlVXNlcikge1xyXG4gICAgdmFyIGJhc2ljUHJvZmlsZSA9IGdvb2dsZVVzZXIuZ2V0QmFzaWNQcm9maWxlKCk7XHJcblxyXG4gICAgdGhpcy5maXJzdG5hbWUgPSBiYXNpY1Byb2ZpbGUuZ2V0R2l2ZW5OYW1lKCk7XHJcbiAgICB0aGlzLmxhc3RuYW1lID0gYmFzaWNQcm9maWxlLmdldEZhbWlseU5hbWUoKTtcclxuICAgIHRoaXMuZW1haWwgPSBiYXNpY1Byb2ZpbGUuZ2V0RW1haWwoKTtcclxuXHJcbiAgICB0aGlzLm5leHRGb3JtKCk7XHJcbiAgfVxyXG5cclxuICBzdWJtaXRGb3JtMShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgJGZvcm0gPSAkKGUudGFyZ2V0KTtcclxuICAgIGxldCBmb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEoJGZvcm0pO1xyXG5cclxuICAgIHRoaXMuZmlyc3RuYW1lID0gZm9ybURhdGEuZmlyc3RuYW1lO1xyXG4gICAgdGhpcy5sYXN0bmFtZSA9IGZvcm1EYXRhLmxhc3RuYW1lO1xyXG4gICAgdGhpcy5lbWFpbCA9IGZvcm1EYXRhLmVtYWlsO1xyXG5cclxuICAgIHRoaXMubmV4dEZvcm0oKTtcclxuICB9XHJcblxyXG4gIG5leHRGb3JtKCkge1xyXG4gICAgJCgnLnNoaXBOb3dNdWx0aV9fZm9ybXN0ZXAtLXN0ZXAxJywgdGhpcy5zZWwuY29tcG9uZW50KS5oaWRlKCk7XHJcbiAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tc3RlcDInLCB0aGlzLnNlbC5jb21wb25lbnQpLnNob3coKTtcclxuICAgICQodGhpcy5zZWwuY29tcG9uZW50KS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgfVxyXG5cclxuICBzdWJtaXRGb3JtMihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBsZXQgJGZvcm0gPSAkKGUudGFyZ2V0KTtcclxuICAgIGxldCBmb3JtRGF0YSA9IHRoaXMuZ2V0Rm9ybURhdGEoJGZvcm0pO1xyXG4gICAgZm9ybURhdGEuZmlyc3RuYW1lID0gdGhpcy5maXJzdG5hbWU7XHJcbiAgICBmb3JtRGF0YS5sYXN0bmFtZSA9IHRoaXMubGFzdG5hbWU7XHJcbiAgICBmb3JtRGF0YS5lbWFpbCA9IHRoaXMuZW1haWw7XHJcblxyXG4gICAgJC5wb3N0KHRoaXMuZ2V0UGF0aFByZWZpeCgpICsgJGZvcm0uYXR0cignYWN0aW9uJyksIGZvcm1EYXRhLCAoZGF0YSkgPT4ge1xyXG4gICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdPSycpIHtcclxuICAgICAgICB0aGlzLnNob3dTdWNjZXNzKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEZvcm1EYXRhKCRmb3JtKSB7XHJcbiAgICBsZXQgdW5pbmRleGVkQXJyYXkgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgbGV0IGluZGV4ZWRBcnJheSA9IHt9O1xyXG4gICAgJC5tYXAodW5pbmRleGVkQXJyYXksIChuKSA9PiAoaW5kZXhlZEFycmF5W24ubmFtZV0gPSBuLnZhbHVlKSk7XHJcblxyXG4gICAgaW5kZXhlZEFycmF5LnNvdXJjZSA9ICQudHJpbSgkZm9ybS5kYXRhKCdzb3VyY2UnKSk7XHJcbiAgICBpbmRleGVkQXJyYXkubG8gPSAkLnRyaW0oJGZvcm0uZGF0YSgnbG8nKSk7XHJcblxyXG4gICAgcmV0dXJuIGluZGV4ZWRBcnJheTtcclxuICB9XHJcblxyXG4gIHNob3dTdWNjZXNzKCkge1xyXG4gICAgdmFyIHRoYW5rcyA9ICQoJy5zaGlwTm93TXVsdGlfX2Zvcm1zdGVwLS1zdGVwMicsIHRoaXMuc2VsLmNvbXBvbmVudCkuZGF0YShcInRoYW5rc1wiKTtcclxuICAgIGlmICgodGhhbmtzICE9PSBudWxsKSAmJiAodGhhbmtzLmxlbmd0aCA+IDApKSB7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRoYW5rcztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoJy5zaGlwTm93TXVsdGlfX2Zvcm1zdGVwLS1zdGVwMicsIHRoaXMuc2VsLmNvbXBvbmVudCkuaGlkZSgpO1xyXG4gICAgICAkKCcuc2hpcE5vd011bHRpX19mb3Jtc3RlcC0tdGhhbmtzJywgdGhpcy5zZWwuY29tcG9uZW50KS5zaG93KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgaWYgKCQodGhpcy5zZWwuY29tcG9uZW50KS5sZW5ndGggPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICB0aGlzLnZhbGlkYXRlKCk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBTaGlwTm93VHdvU3RlcEZvcm0oKTtcclxuIiwiJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xyXG4gICQoJy5hbmltYXRlZFBhZ2VzSGVyb19fYXJyb3cnKS5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICBsZXQgbmV3VGFyZ2V0ID0gJCgnLmFuaW1hdGVkUGFnZXNIZXJvJykub2Zmc2V0KCkudG9wICsgJCgnLmFuaW1hdGVkUGFnZXNIZXJvJykub3V0ZXJIZWlnaHQoKTtcclxuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgc2Nyb2xsVG9wOiBuZXdUYXJnZXRcclxuICAgIH0sIDQwMCk7XHJcbiAgfSk7XHJcblxyXG4gICQoJy5mb290ZXJfX2JhY2tUb1RvcCcpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgJCh0aGlzKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAgICAgJCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCAnc2xvdycpO1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICB9KTtcclxufSk7XHJcblxyXG4kKGZ1bmN0aW9uKCQsIHdpbikge1xyXG4gICQuZm4uaW5WaWV3cG9ydCA9IGZ1bmN0aW9uKGNiKSB7XHJcbiAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpLGVsKXtcclxuICAgICAgIGZ1bmN0aW9uIHZpc1B4KCl7XHJcbiAgICAgICAgIHZhciBIID0gJCh0aGlzKS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgIHIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgdD1yLnRvcCwgYj1yLmJvdHRvbTtcclxuICAgICAgICAgcmV0dXJuIGNiLmNhbGwoZWwsIE1hdGgubWF4KDAsIHQ+MD8gSC10IDogKGI8SD9iOkgpKSk7XHJcbiAgICAgICB9IHZpc1B4KCk7XHJcbiAgICAgICAkKHdpbikub24oXCJyZXNpemUgc2Nyb2xsXCIsIHZpc1B4KTtcclxuICAgICB9KTtcclxuICB9O1xyXG59KGpRdWVyeSwgd2luZG93KSk7XHJcblxyXG4kKFwiLmpzLWNvdW50cnktZ2lmXCIpLmluVmlld3BvcnQoZnVuY3Rpb24ocHgpe1xyXG4gICAgaWYocHggPjIwMCkgJCh0aGlzKS5hZGRDbGFzcyhcInZpc2libGVcIikgO1xyXG59KTtcclxuXHJcblxyXG4iLCJjbGFzcyBTdHJpbmdzIHtcclxuICBpZChsZW5ndGggPSAxNikge1xyXG4gICAgY29uc3QgcG9zc2libGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XHJcbiAgICBsZXQgdGV4dCA9ICcnO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICB0ZXh0ICs9IHBvc3NpYmxlLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZS5sZW5ndGgpKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0ZXh0O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IFN0cmluZ3MoKTtcclxuIiwiKCgpID0+IHtcclxuICAgIGlmICghd2luZG93LnBhcmVudC53aW5kb3cudGVzdCkgcmV0dXJuO1xyXG4gICAgLy8gRGlzYWJsZSBjb25zb2xlIGxvZyBmdW5jdGlvbmFsaXR5XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2cgPSAoKSA9PiB7fTtcclxuICAgIC8vIFN0YXJ0IHRlc3RcclxuICAgIGNvbnN0IGRhdGEgPSB3aW5kb3cucGFyZW50LndpbmRvdy50ZXN0LnJlc3VsdHM7XHJcbiAgICBsZXQgc3R5bGVzID0gZGF0YVswXTtcclxuICAgIGxldCB3ZWlnaHRzID0gZGF0YVsxXTtcclxuICAgICQoJ2JvZHkgKicpLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgbGV0IGZhbWlseSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoJ2ZvbnQtZmFtaWx5Jyk7XHJcbiAgICAgICAgaWYgKGZhbWlseS5pbmRleE9mKHdpbmRvdy5wYXJlbnQud2luZG93LnRlc3QucGFyYW1zLmZhbWlseSkgPCAwKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZSgnZm9udC1zdHlsZScpO1xyXG4gICAgICAgIGlmICghc3R5bGVzLmluY2x1ZGVzKHN0eWxlKSkgc3R5bGVzLnB1c2goc3R5bGUpO1xyXG4gICAgICAgIGxldCB3ZWlnaHQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCdmb250LXdlaWdodCcpO1xyXG4gICAgICAgIGlmICghd2VpZ2h0cy5pbmNsdWRlcyh3ZWlnaHQpKSB3ZWlnaHRzLnB1c2god2VpZ2h0KTtcclxuICAgIH0pO1xyXG4gICAgLy8gTm90aWZ5IGF1dG9tYXRlZCB0ZXN0IHNjcmlwdFxyXG4gICAgd2luZG93LnBhcmVudC53aW5kb3cudGVzdC5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICB3aW5kb3cucGFyZW50LndpbmRvdy50ZXN0LnJlc3VsdHMgPSBbc3R5bGVzLCB3ZWlnaHRzXTtcclxufSkoKTsiLCJpbXBvcnQgJy4vVGVzdHMvRm9udHMnO1xyXG5cclxuLy8gSW1wb3J0IGNvbXBvbmVudHNcclxuaW1wb3J0IEhlYWRlciBmcm9tICcuL0NvbXBvbmVudHMvSGVhZGVyJztcclxuaW1wb3J0IElFRGV0ZWN0b3IgZnJvbSAnLi9Db21wb25lbnRzL0lFRGV0ZWN0b3InO1xyXG5pbXBvcnQgTGFuZGluZ1BhZ2VCdXR0b24gZnJvbSAnLi9Db21wb25lbnRzL0xhbmRpbmdQYWdlQnV0dG9uJztcclxuaW1wb3J0IENvdW50IGZyb20gJy4vQ29tcG9uZW50cy9Db3VudCc7XHJcbmltcG9ydCBBbmltYXRlZEZvcm0gZnJvbSAnLi9Db21wb25lbnRzL0FuaW1hdGVkRm9ybSc7XHJcbmltcG9ydCBDYXJvdXNlbFJvdyBmcm9tICcuL0NvbXBvbmVudHMvQ2Fyb3VzZWxSb3cnO1xyXG5pbXBvcnQgQW5pbWF0ZWRQYXJhbGxheCBmcm9tICcuL0NvbXBvbmVudHMvQW5pbWF0ZWRQYXJhbGxheCc7XHJcbmltcG9ydCBTbW9vdGhTY3JvbGwgZnJvbSAnLi9Db21wb25lbnRzL1Ntb290aFNjcm9sbCc7XHJcbmltcG9ydCBBbmltYXRlZFNob3djYXNlUGFuZWwgZnJvbSAnLi9Db21wb25lbnRzL0FuaW1hdGVkU2hvd2Nhc2VQYW5lbCc7XHJcbmltcG9ydCBBbmltYXRlZFBhZ2VzSGVybyBmcm9tICcuL0NvbXBvbmVudHMvQW5pbWF0ZWRQYWdlc0hlcm8nO1xyXG5pbXBvcnQgSW5QYWdlTmF2aWdhdGlvbiBmcm9tICcuL0NvbXBvbmVudHMvSW5QYWdlTmF2aWdhdGlvbic7XHJcbmltcG9ydCBTaGlwTm93VHdvU3RlcEZvcm0gZnJvbSAnLi9Db21wb25lbnRzL1NoaXBOb3dUd29TdGVwRm9ybSc7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3RvdWNoJyk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgLy8gbm90aGluZ1xyXG4gIH1cclxuICAvLyBJbml0aWF0ZSBjb21wb25lbnRzXHJcbiAgSUVEZXRlY3Rvci5pbml0KCk7XHJcbiAgSGVhZGVyLmluaXQoKTtcclxuICBDb3VudC5pbml0KCk7XHJcbiAgTGFuZGluZ1BhZ2VCdXR0b24uaW5pdCgpO1xyXG4gIC8vIEFuaW1hdGVkRm9ybS5pbml0KCk7XHJcbiAgQ2Fyb3VzZWxSb3cuaW5pdCgpO1xyXG4gIEFuaW1hdGVkUGFyYWxsYXguaW5pdCgpO1xyXG4gIEFuaW1hdGVkU2hvd2Nhc2VQYW5lbC5pbml0KCk7XHJcbiAgSW5QYWdlTmF2aWdhdGlvbi5pbml0KCk7XHJcbiAgU2hpcE5vd1R3b1N0ZXBGb3JtLmluaXQoKTtcclxuXHJcbn0pO1xyXG5cclxuQW5pbWF0ZWRQYWdlc0hlcm8uaW5pdCgpO1xyXG5cclxuXHJcbiJdfQ==
