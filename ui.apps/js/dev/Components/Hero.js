class Hero {
  constructor() {
    this.sel = {
      component: '.hero',
      trigger: '.hero__playButton, .hero__cta--video',
      iframe: '.hero .hero__video'
    };

    this.bindEvents = this.bindEvents.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.init = this.init.bind(this);
  }

  bindEvents() {
    $(document).on('click', this.sel.trigger, this.handleClick);
  }

  handleClick(e) {
    e.preventDefault();
    let videoId = this.getVideoID(e.target.href);
    $(this.sel.iframe).attr('src', 'https://www.youtube.com/embed/' + videoId + '?rel=0&amp;showinfo=0&amp;autoplay=1').addClass('hero__video--open');
  }

  getVideoID(ytUrl) {
    let id = '';
    let url = ytUrl.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      id = url[2].split(/[^0-9a-z_\-]/i);
      id = id[0];
    } else {
      id = url;
    }
    return id;
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    return true;
  }
}

export default new Hero();
