import Toast from './Toast';
import Database from './Database';

class SaveForOffline {
  constructor() {
    this.sel = {
      component: '.hero__saveForOffline'
    };
    // Create article cache name
    this.articleCacheName = 'offline-' + window.location.pathname;

    this.init = this.init.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.doSave = this.doSave.bind(this);
    this.doUnsave = this.doUnsave.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.getHeroImages = this.getHeroImages.bind(this);
    this.isCurrentPageSaved = this.isCurrentPageSaved.bind(this);
  }

  bindEvents() {
    $(document).on('click', this.sel.component, this.handleClick);
  }

  handleClick(e) {
    e.preventDefault();
    if ($(this.sel.component).hasClass('hero__saveForOffline--saved')) {
      this.doUnsave();
    } else {
      this.doSave();
    }
  }

  isCurrentPageSaved() {
    // Check if already saved
    caches.keys().then((cacheNames) => { // Get array of cache names
      return Promise.all(
        cacheNames.filter((cacheName) => { // Filter array
          return (cacheName === this.articleCacheName); // If matches current pathname
        })
      );
    }).then((cacheNames) => { // Once got filtered array
      if (cacheNames.length > 0) { // If there are caches
        $(this.sel.component).addClass('hero__saveForOffline--saved').attr('title', 'Article Saved').find('span').text('Article Saved');
      }
    });
  }

  getHeroImages() {
    // Get the hero image element
    let $heroImage = $('.hero__image');
    // If it exists
    if ($heroImage.length > 0) {
      // Create array for images
      let images = [];
      // Add the mobile image URL
      images.push(
        $heroImage.css('background-image').split('url(')[1].split(')')[0].replace(/"/g, '').replace(/'/g, '')
      );
      // Get the desktop image URL
      let desktopStyles = $heroImage.parents('.hero').find('style').html().split('url(')[1].split(')')[0].replace(/"/g, '').replace(/'/g, '');
      // Add the desktop image to the array
      images.push(desktopStyles);
      // Return the images
      return images;
    }
    return false;
  }

  doUnsave(pathName = window.location.pathname) {
    let toast = new Toast('Article has been removed', 3000);
    // Remove article from IDB
    return Database.deleteArticle(pathName).then(() => {// Deleted from IDB successfully
      // Remove article content
      caches.delete('offline-' + pathName).then(() => {
        $(this.sel.component).removeClass('hero__saveForOffline--saved').attr('title', 'Save Article').find('span').text('Save Article');
        toast.show();
      });
    }).catch(() => {// There was an error deleting from IDB
      toast.setText('There was a problem deleting the article');
      toast.show();
    });
  }

  doSave() {
    // Create toast for confirmation
    let toast = new Toast('Article is now available offline', 3000);

    if ($('#articleData').length <= 0) {
      console.log('SW ERROR: Offline.js:90');
      toast.setText('Article could not be saved for offline');
      toast.show();
      return false;
    }
    // Get page data for IDB
    let pageData = JSON.parse($('#articleData').html());

    // Add article to IDB
    Database.addArticle(
      pageData.title,
      window.location.pathname,
      pageData.description,
      pageData.categoryName,
      pageData.categoryLink,
      pageData.timeToRead,
      pageData.imageMobile,
      pageData.imageDesktop,
      pageData.isLarge,
      pageData.isVideo,
      this.articleCacheName
    ).then(() => {// Saved in IDB successfully
      // Build an array of the page-specific resources.
      let pageResources = [window.location.pathname, pageData.imageMobile, pageData.imageDesktop];

      // Add the hero images
      if ($('.hero__image').length > 0) {
        let heroImages = this.getHeroImages();
        if (heroImages) pageResources = pageResources.concat(heroImages);
      }

      // Add the account apply images
      if ($('.accountapply').length > 0) {
        let accountApplyImage = $('.accountapply .container').css('background-image');
        if (accountApplyImage != "") {
          accountApplyImage = accountApplyImage.split('url(')[1].split(')')[0].replace(/"/g, '').replace(/'/g, '');
          pageResources.push(accountApplyImage);
        }
      }

      // Add images to the array
      $('.page-body .wysiwyg img, .authorPanel img').each((index, element) => {
        // Trim whitespace form src
        let imgSrc = $.trim($(element).attr('src'));
        // If empty src skip this image
        if (!(imgSrc === '')) {
          // Add to page resources
          pageResources.push($(element).attr('src'));
        }
      });

      // Open the unique cache for this URL
      caches.open(this.articleCacheName).then((cache) => {
        // Unique URLs
        let uniqueResources = [];
        // Create anchor element to get full URLs
        let anchor = document.createElement('a');
        // Dedupe assets
        $.each(pageResources, (i, el) => {
          // Load the current URL into the anchor
          anchor.href = el;
          // Only cache URLs on our domain
          if (anchor.host !== window.location.host) return;
          // Get the relative path
          let relative = anchor.pathname + anchor.search;
          // If already in list of assets, don't include it again
          if ($.inArray(relative, uniqueResources) === -1) uniqueResources.push(relative);
        });
        // Cache all required assets
        let updateCache = cache.addAll(uniqueResources);
        // Update UI to indicate success
        // Or catch any errors if it doesn't succeed
        updateCache.then(() => {
          // console.log('Article is now available offline.');
          $(this.sel.component).addClass('hero__saveForOffline--saved').attr('title', 'Saved for offline').find('span').text('Article Saved');
        }).catch((error) => {
          console.log(error.message);
          // console.log('Article could not be saved for offline.', error);
          toast.setText('Article could not be saved for offline');
        }).then(() => {
          toast.show();
        });
      });
    }).catch((error) => {// There was an error saving to IDB
      console.log(error.message);
      toast.setText('Article could not be saved for offline');
      toast.show();
    });
    return true;
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.isCurrentPageSaved();
    this.bindEvents();
    return true;
  }
}

class OfflineArticles {
  constructor() {
    this.sel = {
      component: '.articleGrid--saved',
      grid: '.articleGrid--saved .articleGrid__grid',
      title: '.articleGrid--saved .articleGrid__title',
      template: '#articleGrid__panelTemplate',
      editSavedArticles: '.hero__editSavedArticles',
      articles: '.articleGrid--saved .articleGrid__grid .articlePanel',
      deletableArticle: '.articleGrid--saved .articleGrid__grid .articlePanel--deletable'
    };
    this.saveForOffline = new SaveForOffline();
    this.template = $($(this.sel.template).html());

    this.init = this.init.bind(this);
    this.loadArticles = this.loadArticles.bind(this);
    this.populateTemplates = this.populateTemplates.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
  }

  loadArticles() {
    return Database.getArticles().then((articles) => {
      let items = [];
      for (var i = 0; i < articles.length; i++) {
        let article = articles[i];
        items.push({
          Link: article.link,
          Title: article.title,
          Description: article.description,
          Category: {
            Name: article.categoryName,
            Link: article.categoryLink
          },
          TimeToRead: article.timeToRead,
          Images: {
            Mobile: article.imageMobile,
            Desktop: article.imageDesktop
          },
          IsLarge: article.isLarge,
          IsVideo: article.isVideo
        });
      }
      if (items.length > 0) {
        $(this.sel.grid).html(this.populateTemplates(items));
      } else {
        $(this.sel.title).text('You have no saved articles');
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

  bindEvents() {
    $(document).on('click', this.sel.editSavedArticles, this.handleEdit);
    $(document).on('click', this.sel.deletableArticle, this.deleteArticle);
    $(this.sel.articles).swipedetect(this.handleSwipe);
  }

  handleEdit(e) {
    e.preventDefault();
    $(this.sel.editSavedArticles).toggleClass('hero__editSavedArticles--editing');
    if ($(this.sel.editSavedArticles).hasClass('hero__editSavedArticles--editing')) {
      $(this.sel.grid).find('.articlePanel').addClass('articlePanel--deletable');
    } else {
      $(this.sel.grid).find('.articlePanel').removeClass('articlePanel--deletable');
    }
  }

  deleteArticle(e) {
    e.preventDefault();
    let $articlePanel = $(e.target).parents('.articlePanel');
    if ($(e.target).hasClass('articlePanel')) $articlePanel = $(e.target);
    let url = new URL($articlePanel.find('.articlePanel__image')[0].href);
    this.saveForOffline.doUnsave(url.pathname).then(() => {
      $articlePanel.parent().remove();
      if ($(this.sel.grid).find('.articlePanel').length <= 0) {
        $(this.sel.grid).append('<div class="col-12"><h2 class="articleGrid__title">You have no saved articles</h2></div>');
        this.handleEdit({preventDefault: () => {}});
      }
    });
  }

  handleSwipe(swipedir, element) {
    // swipedir contains either "none", "left", "right", "top", or "down"
    let isDeletable = $(element).hasClass('articlePanel--deletable');
    if (swipedir === 'left' && !isDeletable) {
      $('.articlePanel.articlePanel--deletable').removeClass('articlePanel--deletable');
      $(element).addClass('articlePanel--deletable');
    } else if (swipedir === 'right' && isDeletable) {
      $(element).removeClass('articlePanel--deletable');
    }
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.loadArticles().then(() => {
      this.bindEvents();
    });
    return true;
  }
}

class Offline {
  constructor() {
    this.saveForOffline = new SaveForOffline();
    this.offlineArticles = new OfflineArticles();
    this.init = this.init.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
    this.doOnline = this.doOnline.bind(this);
    this.doOffline = this.doOffline.bind(this);
  }

  checkStatus() {
    if (navigator.onLine) {
      this.doOnline();
    } else {
      this.doOffline();
    }
  }

  doOnline() {
    $('body').removeClass('offline');
    $('.disable-offline[tabindex="-1"], .disable-offline *[tabindex="-1"]').removeAttr('tabindex');
  }

  doOffline() {
    $('body').addClass('offline');
    $('.disable-offline, .disable-offline *').attr('tabindex', '-1');
  }

  bindEvents() {
    window.addEventListener('online', this.doOnline);
    window.addEventListener('offline', this.doOffline);
  }

  init() {
    if (!('onLine' in navigator)) return false;
    this.saveForOffline.init();
    this.offlineArticles.init();
    this.checkStatus();
    this.bindEvents();
    return true;
  }
}

export default new Offline();
