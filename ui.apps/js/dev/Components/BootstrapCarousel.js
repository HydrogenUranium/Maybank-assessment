class BootstrapCarousel {
  constructor() {
    this.sel = {
      component: '.carousel',
      items: '.carousel-item',
      link: '.categoryHero__link'
    };
    this.init = this.init.bind(this);
    this.checkNumberSlides = this.checkNumberSlides.bind(this);
    this.touchSwipeCarousel = this.touchSwipeCarousel.bind(this);
  }

  checkNumberSlides() {
    $(this.sel.component).each((index, $elm) => {
      if ($($elm).find(this.sel.items).length <= 1) {
        $($elm).addClass('static');
      }
    });
  }

  touchSwipeCarousel() {
    let isSwipe = false;
    $(this.sel.component).swipe({
      swipe: (event, direction) => {
        let $carousel = ($(event.target).is(this.sel.component) ? $(event.target) : $(event.target).parents(this.sel.component));
        isSwipe = true;
        if (direction === 'left') {
          $carousel.carousel('next');
        } else if (direction === 'right') {
          $carousel.carousel('prev');
        }
      },
      tap: function (event) {
        // target variable represents the clicked object
        if ($('.categoryHero__link').length && window.innerWidth < 992) {
          let href = $(event.target).parents('.categoryHero__link').first().attr('data-href');
          if (href !== '') {
            window.location = href;
          }
        }
      },
      allowPageScroll: 'vertical'
    });

    $(this.sel.link).on('click', function () {
      if (!isSwipe) {
        let href = $(this).attr('data-href');
        if (href !== '') {
          window.location = href;
        }
      }
      isSwipe = false;
    });
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.touchSwipeCarousel();
    this.checkNumberSlides();
    return true;
  }
}

export default new BootstrapCarousel();
