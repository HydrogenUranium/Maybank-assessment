class ArticleCounter {
  constructor() {
    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.init = this.init.bind(this);
  }

  getPathPrefix() {
    const prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
    return (prefix ? prefix : '');
  }

  init() {
    // /apps/dhl/discoverdhlapi/counter/index.json
    // p = /content/dhl/XXXX
    let articlePage = $('.page-body.article-counter');
    if (articlePage.length > 0) {
      let path = articlePage.data('path');
      if ($.trim(path).length > 0) {
        let data = {
          p: path
        };
        $.post(this.getPathPrefix() + '/apps/dhl/discoverdhlapi/counter/index.json', data);
      }
    }
  }
}

export default new ArticleCounter();
