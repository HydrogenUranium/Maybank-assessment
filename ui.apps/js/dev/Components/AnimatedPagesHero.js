class AnimatedPagesHero {
  constructor() {
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

  bindEvents() {
    document.addEventListener('scroll', this.handleScroll, {passive: true});
  }

  preload() {
    if ($(this.sel.animationGif).length <= 0) return;
    let gif = new Image();
    gif.onload = () => {
      $(this.sel.animationGif).attr('src', $(this.sel.animationGif).attr('data-src'));
      $(this.sel.component).addClass('animatedPagesHero--loaded');
    };
    gif.src = $(this.sel.animationGif).attr('data-src');
  }

  handleScroll() {
    if ($(document).scrollTop() > 0) {
      $(this.sel.van).addClass('animatedPagesHero__van--out');
    }
  }

  init() {
    setTimeout(this.bindEvents, 5160);
    this.preload();
  }
}

export default new AnimatedPagesHero();
