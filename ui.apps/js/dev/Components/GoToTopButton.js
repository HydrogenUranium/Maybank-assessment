class GoToTopButton {
  constructor(element) {
    this.element = element;
    console.log('GoToTopButton initialized with element:', this.element);
    this.initEventListeners();
  }

  static init() {
    const goToTopButton = document.querySelector('.js--go-to-top-button');
    if (goToTopButton) {
      new GoToTopButton(goToTopButton);
    }
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
    if (scrollPosition > 500) {
      this.element.classList.add('visible');
    } else {
      this.element.classList.remove('visible');
    }
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
