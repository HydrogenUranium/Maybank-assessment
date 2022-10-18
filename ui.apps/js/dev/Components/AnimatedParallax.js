class AnimatedParallax {
  constructor() {
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

  bindEvents() {
    document.addEventListener('scroll', this.handleScroll, {passive: true});
    $(window).on('stop.resize', this.handleScroll);
  }

  handleScroll() {
    let scrollPosition = $(window).scrollTop() + window.innerHeight;
    let visibleTiles = [];
    for (let i = 0; i < this.tiles.length; i++) {
      let tile = this.tiles[i];
      if (tile.offsetTop < scrollPosition) {
        visibleTiles.push(tile);
      }
    }
    for (let i = 0; i < visibleTiles.length; i++) {
      let tile = visibleTiles[i];
      let multiplier = tile.$tile.hasClass('parallaxSection__tile--fastParallax') ? 0.6 : 0.3;
      let multiplierOverride = tile.$tile.attr('data-multiplier');
      if (multiplierOverride !== undefined) {
        multiplier = multiplierOverride;
      }

      let parallaxDivider = window.innerWidth < 768 ? 4 : 2;
      let parallaxOffset = (tile.offsetTop - $(window).scrollTop()) * multiplier;
      if (tile.$tile.hasClass('parallaxSection__tile--down')) {
        parallaxOffset = ((window.innerHeight + $(window).scrollTop()) - (tile.offsetTop + tile.height)) * multiplier;
      }

      let newTop = (tile.originalTop + (parallaxOffset / parallaxDivider));
      let maxTop = (tile.$tile.attr('data-max-top'));
      let minTop = (tile.$tile.attr('data-min-top'));

      if (minTop !== undefined && newTop <= minTop) {
        newTop = minTop;
      }

      if (maxTop != undefined && newTop >= maxTop) {
        newTop = maxTop;
      }

      tile.$tile.css('top', newTop + 'px');
    }
  }

  getTiles() {
    $(this.sel.tiles).each((index, element) => {
      let $tile = $(element);
      let topPosition = parseInt($tile.css('top'), 10);
      let offsetTop = $tile.offset().top;
      this.tiles.push({
        $tile: $tile,
        originalTop: topPosition,
        offsetTop: offsetTop,
        height: $tile.outerHeight()
      });
    });
  }

  init() {
    if ($(this.sel.component).length <= 0) return;
    this.getTiles();
    this.handleScroll();
    this.bindEvents();
  }
}

export default new AnimatedParallax();
