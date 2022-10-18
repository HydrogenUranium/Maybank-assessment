class CarouselRow {
  constructor() {
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

  bindEvents() {
    $(document).on('click', this.sel.arrowNext, (e)=>{
      e.preventDefault();
      this.carousel.next();
    });
    $(document).on('click', this.sel.arrowPrev, (e)=>{
      e.preventDefault();
      this.carousel.prev();
    });
    $(this.sel.carousel).swipe({
      swipe: (event, direction) => {
        if (direction === 'left') {
          this.carousel.next();
        } else if (direction === 'right') {
          this.carousel.prev();
        }
      },
      allowPageScroll: 'vertical'
    });
  }

  initCarousel() {
    this.carousel = $(this.sel.carousel).waterwheelCarousel({
      flankingItems: 1,
      opacityMultiplier: 1,
      separation: 90,
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

  init() {
    if ($(this.sel.component).length <= 0) return;
    this.bindEvents();
    this.initCarousel();
  }
}

export default new CarouselRow();
