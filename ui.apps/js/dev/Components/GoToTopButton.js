class GoToTopButton {
  constructor(element) {
    this.element = element;
    this.lastScrollTop = 0;
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', this.updateDeviceType.bind(this));
    this.initEventListeners();
  }

  static init() {
    const goToTopButton = document.querySelector('.js--go-to-top-button');
    if (goToTopButton) {
      new GoToTopButton(goToTopButton);
    }
  }

  updateDeviceType() {
    this.isMobile = window.innerWidth < 768;
  }

  initEventListeners() {
    if (!this.element) {
      return;
    }
    this.element.addEventListener('click', this.scrollToTop.bind(this));
    window.addEventListener('scroll', this.toggleVisibility.bind(this));
    this.toggleVisibility();
  }

  toggleVisibility() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const scrollingUp = scrollPosition < this.lastScrollTop;

    if (scrollPosition > 500) {
      // For mobile: only show when scrolling up
      if (this.isMobile) {
        if (scrollingUp) {
          this.element.classList.add('visible');
        } else {
          this.element.classList.remove('visible');
        }
      } else {
        this.element.classList.add('visible');
      }
    } else {
      this.element.classList.remove('visible');
    }

    this.lastScrollTop = scrollPosition;
  }

  scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

export default GoToTopButton;
