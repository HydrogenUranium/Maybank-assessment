class ArticleGridApi {
  constructor(endpoint, pageSize = 6) {
    this.endpoint = endpoint;
    this.pageSize = pageSize;
    this.skip = 0;

    this.doRequest = this.doRequest.bind(this);
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  doRequest(callback, keyword = null) {
    $.get(this.endpoint, {
      skip: this.skip,
      pageSize: this.pageSize,
      keyword: keyword
    }, (data) => {
      this.skip += data.Items.length;
      callback(data);
    });
  }

  search(callback, keyword) {
    this.skip = 0;
    this.doRequest(callback, keyword);
  }

  loadMore(callback) {
    this.doRequest(callback);
  }
}

class ArticleGrid {
  constructor() {
    this.loading = false;
    this.hasmore = true;

    this.sel = {
      component: '.articleGrid',
      grid: '.articleGrid__grid',
      loadMore: '.articleGrid__loadMore',
      template: '#articleGrid__panelTemplate',
      nav: '.articleGrid__nav'
    };
    this.template = $($(this.sel.template).html());

    this.bindEvents = this.bindEvents.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.populateTemplates = this.populateTemplates.bind(this);
    this.init = this.init.bind(this);
    this.showSpinner = this.showSpinner.bind(this);
    this.hideSpinner = this.hideSpinner.bind(this);
    this.scrollnav = this.scrollnav.bind(this);
    this.scrollleft = this.scrollleft.bind(this);
    this.scrollright = this.scrollright.bind(this);
    this.checkScroll = this.checkScroll.bind(this);
    this.pageScroll = this.pageScroll.bind(this);
  }

  bindEvents() {
    $(window).on('scroll', this.pageScroll);
    $(document).on('click', this.sel.loadMore, this.loadMore);
    $(document).on('click', '.scrollleft', this.scrollleft);
    $(document).on('click', '.scrollright', this.scrollright);

    this.pageScroll();
  }

  pageScroll() {
    if (this.hasmore && (!this.loading)) {
      var wnd = $(window);
      var elm = $(this.sel.loadMore);

      if (elm && ($(elm).length > 0)) {
        var wst = wnd.scrollTop();
        var wh = wnd.height();
        var ot = elm.offset().top;
        var oh = elm.outerHeight();

        if ((wst + wh) > (ot + oh)) {
          this.loadMore();
        }
      }
    }
  }

  loadMore(e) {
    if (e) {
      e.preventDefault();
    }

    this.loading = true;
    // Show the loading spinner
    this.showSpinner();

    var t = 0;
    $(".articleGrid__item", this.sel.component).each((index, item) => {
      if (t < 6 && (!$(item).is(":visible"))) {
        $(item).show();
        t++;
      }
    });

    if ($(".articleGrid__item",this.sel.component).length === $(".articleGrid__item:visible",this.sel.component).length) {
      $(this.sel.loadMore).parents(".row").first().remove();
      this.hasmore = false;
    }

    // Hide the loading spinner
    this.hideSpinner();
    this.loading = false;
  }

  showSpinner() {
    $(this.sel.loadMore).addClass('articleGrid__loadMore--loading');
  }

  hideSpinner() {
    $(this.sel.loadMore).removeClass('articleGrid__loadMore--loading');
  }

  scrollnav() {
    let $scrollnav = document.querySelector(this.sel.nav);
    if ($scrollnav === null) return;
    let scrollWidth = $scrollnav.scrollWidth;
    let clientWidth = $scrollnav.clientWidth;
    if (scrollWidth > clientWidth) {
      $(this.sel.nav).after('<i class="scrollright">></i>');
    }
  }
  scrollright() {
    let self = this.sel.nav;
    let scrollWidth = document.querySelector(self).scrollWidth;
    $(self).animate({
      scrollLeft: scrollWidth + 'px'
    }, 500, function () {
      $('.scrollright').remove();
      $(self).before('<i class="scrollleft"><</i>');
    });
  }

  scrollleft() {
    let self = this.sel.nav;
    $(self).animate({
      scrollLeft: 0
    }, 500, function () {
      $('.scrollleft').remove();
      $(self).after('<i class="scrollright">></i>');
    });
  }

  checkScroll() {
    let $scrollnav = document.querySelector(this.sel.nav);
    if ($scrollnav === null) return;
    let scrollWidth = $scrollnav.scrollWidth;
    let clientWidth = $scrollnav.clientWidth;
    let scrollGap = scrollWidth - clientWidth;
    $(self).scroll(function () {
      if (this.scrollLeft === 0) {
        $('.scrollleft').remove();
        $(self).after('<i class="scrollright">></i>');
      }
      if (this.scrollLeft >= scrollGap) {
        $('.scrollright').remove();
        $(self).before('<i class="scrollleft"><</i>');
      }
    });
  }

  populateTemplates(items) {
    let output = [];
    for (let i = 0; i < items.length; i++) {
      // Clone template
      let $template = this.template.clone();
      // Get the item
      let item = items[i];
      // Set image breakpoint
      let desktopBreakpoint = 992;
      // Generate ID
      let panelId = Math.random().toString(36).substr(2, 9);
      // Populate ID
      $template.find('.articlePanel').attr('id', panelId);
      // If large panel
      if (item.IsLarge) {
        // Update image breakpoint
        desktopBreakpoint = 768;
        // Add class
        $template.find('.articlePanel').addClass('articlePanel--large');
      }
      // If video
      if (item.IsVideo) {
        // Add class
        $template.find('.articlePanel').addClass('articlePanel--video');
      }
      // Populate images
      $template.find('.articlePanel__image').attr({
        href: item.Link,
        title: item.Title
      }).attr('style', 'background-image: url(' + item.Images.Mobile + ');');
      $template.find('style')[0].innerHTML = '@media screen and (min-width: ' + desktopBreakpoint + 'px){#' + panelId + ' .articlePanel__image{background-image: url(' + item.Images.Desktop + ') !important;}}';
      // Populate link
      $template.find('.articlePanel__content > a').attr({
        href: item.Link,
        title: item.Title
      });
      // Populate title
      $template.find('.articlePanel__title').text(item.Title);
      // Populate description
      $template.find('.articlePanel__description').text(item.Description);
      // Populate category
      $template.find('.articlePanel__subTitle a:first-child').attr({
        'href': item.Category.Link,
        'title': item.Category.Name
      }).text(item.Category.Name);
      // Populate time to read
      $template.find('.articlePanel__subTitle a:last-child').attr({
        'href': item.Link,
        'title': item.Title
      }).text(item.TimeToRead);
      // Push item to output
      output.push($template);
    }
    return output;
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    let endpoint = $(this.sel.component).attr('data-endpoint');
    this.API = new ArticleGridApi(endpoint);
    this.scrollnav();
    this.bindEvents();
    this.checkScroll();
    return true;
  }
}

export default new ArticleGrid();
