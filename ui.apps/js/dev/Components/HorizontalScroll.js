class HorizontalScroll {
  constructor() {
    this.sel = {
      element: '.horizontal-scroll',
    };

    this.bindEvents = this.bindEvents.bind(this);
    this.init = this.init.bind(this);
  }

  bindEvents() {
    document.querySelectorAll('.horizontal-scroll').forEach((slider) => {
      let data = {
        scrollable: false,
        isMouseDown:false,
        momentumID:0,
        scrollLeft:0,
        startX:0,
        velX:0,
      }

      slider.addEventListener('mousedown', (e) => {
        data.isMouseDown = true;
        data.startX = e.pageX - slider.offsetLeft;
        data.scrollLeft = slider.scrollLeft;
        data.velX = 0;
        cancelMomentumTracking();
      });

      slider.addEventListener('mouseleave', () => {
        data.isMouseDown = false;
        slider.classList.remove('horizontal-scroll_active');
      });

      slider.addEventListener('click', (e) => {
        slider.classList.remove('horizontal-scroll_active');
        data.isMouseDown = false;
        beginMomentumTracking();
      });

      slider.addEventListener('mouseenter', () => {
        data.scrollable = slider.scrollWidth > slider.clientWidth;
        if(data.scrollable) {
          slider.classList.add("horizontal-scroll_scrollable")
        } else {
          slider.classList.remove("horizontal-scroll_scrollable");
        }
      });

      slider.addEventListener('mousemove', (e) => {
        if (!data.isMouseDown || !data.scrollable) return;
        slider.classList.add('horizontal-scroll_active');
        const x = e.pageX - slider.offsetLeft;
        const dragDistance = (x - data.startX);
        let prevScrollLeft = slider.scrollLeft;
        slider.scrollLeft = data.scrollLeft - dragDistance;
        data.velX = 1.5 * (slider.scrollLeft - prevScrollLeft);
        e.preventDefault();
      });

      function beginMomentumTracking(){
        cancelMomentumTracking();
        data.momentumID = requestAnimationFrame(momentumLoop);
      }

      function cancelMomentumTracking(){
        cancelAnimationFrame(data.momentumID);
      }

      function momentumLoop(){
        slider.scrollLeft += data.velX;
        data.velX *= 0.97;
        if (Math.abs(data.velX) > 3){
          data.momentumID = requestAnimationFrame(momentumLoop);
        }
      }

      // Prevent click on links when scrolling.
      //React doesn't use traditional event listeners so we need to use workaround adding class to button and checking for in click event
      $('.horizontal-scroll').find('a, .horizontal-scroll__react-button').on('click', function(e) {
        if ($(this).closest('.horizontal-scroll_active').length > 0) {
          e.preventDefault();
          if(this.classList.contains('horizontal-scroll__react-button')) {
            this.classList.add('horizontal-scroll__react-button--prevent-click');
          }
        }
      })
    })
  }

  init() {
    if ($(this.sel.element).length <= 0) return false;
    this.bindEvents();
    return true;
  }
}

export default new HorizontalScroll();
