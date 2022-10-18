class BackButton {
  constructor() {
    this.sel = {
      component: '.backButton',
      backButton: '.backButton__button--back',
      forwardButton: '.backButton__button--forward'
    };

    this.init = this.init.bind(this);
    this.showButton = this.showButton.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.initHeadroom = this.initHeadroom.bind(this);
  }

  showButton() {
    $(this.sel.component).addClass('backButton--show');
  }

  bindEvents() {
    $(document).on('click', this.sel.backButton, this.goBack);
    $(document).on('click', this.sel.forwardButton, this.goForward);
  }

  goBack(e) {
    e.preventDefault();
    history.back(-1);
  }

  goForward(e) {
    e.preventDefault();
    history.forward();
  }

  initHeadroom() {
    let component = $(this.sel.component)[0];
    let headroom  = new Headroom(component, {
      classes: {
        initial: 'backButton',
        pinned: 'backButton--pinned',
        unpinned: 'backButton--unpinned',
        top: 'backButton--top',
        notTop: 'backButton--not-top',
        bottom: 'backButton--bottom',
        notBottom: 'backButton--not-bottom'
      }
    });
    headroom.init();
  }

  init() {
    let standalone = (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone);
    if (!standalone) return;
    this.bindEvents();
    this.showButton();
    this.initHeadroom();
  }
}

export default new BackButton();
