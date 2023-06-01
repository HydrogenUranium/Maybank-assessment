class AuthenticationEvents {
  constructor() {
    this.config = {
      urlToken: '/libs/granite/csrf/token.json',
      urlCheck: '/apps/dhl/discoverdhlapi/check/index.form.html',
      urlRefreshCheck: '/apps/dhl/discoverdhlapi/refresh_token/index.form.html',
      urlDownloadAsset: '/apps/dhl/discoverdhlapi/download_asset/index.json'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
    this.getRealPathHome = this.getRealPathHome.bind(this);
    this.init = this.init.bind(this);

    this.readCookie = this.readCookie.bind(this);
    this.clearCookie = this.clearCookie.bind(this);
    this.createCookie = this.createCookie.bind(this);

    this.checkLoginStatus = this.checkLoginStatus.bind(this);
    this.checkAuthTokens = this.checkAuthTokens.bind(this);

    this.showLoggedInElements = this.showLoggedInElements.bind(this);
    this.showNotLoggedInElements = this.showNotLoggedInElements.bind(this);
  }

  getPathPrefix() {
    const prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
    return (prefix ? prefix : '');
  }

  getPathHome() {
    const home = $('head meta[name=\'dhl-path-home\']').attr('content').replace('/content/dhl', '');
    return (home ? home : '');
  }

  getRealPathHome() {
    return $('head meta[name=\'dhl-path-home\']').attr('content');
  }

  init() {
    $(window).on('checkauthtokens.DHL', (evt, tokenData, skipElements) => {
      this.checkAuthTokens(tokenData, skipElements);
    });
    $(window).on('userloggedin.DHL', (evt, tokenData) => {
      this.showLoggedInElements(tokenData);
    });
    $(window).on('usernotloggedin.DHL', () => {
      this.showNotLoggedInElements();
    });

    // logged in header (logout link)
    var loggedInHeader = $('.footer .footer__ctas--loggedin');
    if (loggedInHeader.length > 0) {
      loggedInHeader.on('click', '.logout-link', () => {
        this.clearCookie('DHL.AuthToken');
        this.clearCookie('DHL.RefreshToken');
        location.reload();

        return false;
      });
    }

    this.checkLoginStatus();
  }

  readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
  }

  clearCookie(name) {
    this.createCookie(name, '', -1);
  }

  createCookie(name, value, expirySeconds) {
    var expires = '';
    if (expirySeconds) {
      var date = new Date();
      date.setTime(date.getTime() + (expirySeconds * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  checkLoginStatus() {
    var cookie = this.readCookie('DHL.AuthToken');
    if (cookie !== null) {
      var authSplit = cookie.split('|');
      if (authSplit.length >= 2) {
        this.callTokenCheck(this.getPathPrefix() + this.config.urlCheck, {
          username: authSplit[0],
          token: authSplit[1],
          formStart: this.getRealPathHome() + '.checklogin.json',
        });
      } else {
        $(window).trigger('usernotloggedin.DHL');
      }
    } else {
      var refreshCookie = this.readCookie('DHL.RefreshToken');
      if (refreshCookie !== null) {
        var refreshCookieSplit = refreshCookie.split('|');
        if (refreshCookieSplit.length >= 2) {
          this.callTokenCheck(this.getPathPrefix() + this.config.urlRefreshCheck, {
            username: refreshCookieSplit[0],
            refresh_token: refreshCookieSplit[1],
            formStart: this.getRealPathHome() + '.updatetoken.json',
          });
        } else {
          $(window).trigger('usernotloggedin.DHL');
        }
      } else {
        $(window).trigger('usernotloggedin.DHL');
      }
    }
  }

  callTokenCheck(url, data) {
    $.get(this.getPathPrefix() + this.config.urlToken, (csrfresponse) => {
      var csrftoken = csrfresponse.token;

      $.ajax({
        url: url,
        data: data,
        type: 'post',
        headers: { 'CSRF-Token': csrftoken },
        dataType: 'json',
        success: (response) => {
          this.checkAuthTokens(response, false);
        }
      });
    });
  }

  checkAuthTokens(tokenData, skipElements) {
    if (tokenData && tokenData.status && tokenData.status === 'ok') {
      this.createCookie('DHL.AuthToken', tokenData.username + '|' + tokenData.token, tokenData.ttl);
      this.createCookie('DHL.RefreshToken', tokenData.username + '|' + tokenData.refresh_token, (24 * 60 * 60));

      if (skipElements !== true) {
        $(window).trigger('userloggedin.DHL', tokenData);
      }

      return;
    }

    if (skipElements !== true) {
      $(window).trigger('usernotloggedin.DHL');
    }
  }

  showLoggedInElements(tokenData) {
    $('.below-register-form .tab.mobile').hide();

    $('.below-register-form #register-tab-1').hide();
    $(".below-register-form .tab-contents .tab-content[data-rel='#register-tab-1']").removeClass('open');

    $('.below-register-form #register-tab-2').addClass('active').show();
    $(".below-register-form .tab-contents .tab-content[data-rel='#register-tab-2']").addClass('open');

    $('.below-register-form').show();

    $('header .header__desktopLinkItem.logged-in .user-firstname, header .header__primaryLinks .user-firstname').text(tokenData.name);
    $('header .header__desktopLinkItem.logged-in, header .header__primaryLinks.logged-in').show();
    $('.footer .logout-links').show();

    $('.competitionDataCapture.logged-in').show();
    $('.competitionDataCapture.logged-in .loggedin-name').text(tokenData.name);
    $('.cta-third-panel-loggedin').show();

    $('.gated').addClass('unlocked').removeClass('locked').each((index, item) => {
      $(item).closest('body').find('.hero .hero__cta--grey').show();
    });
    $('.gated-hide').addClass('unlocked').removeClass('locked');

    $('.articleGrid .article-grid-item-loggedin').show();

    if (tokenData.full === false) {
      $('.create-password').find('.create-password-name').text(tokenData.name);
      $(window).trigger('show.CreatePasswordModal.DHL');
    }

    if ($('.reset-password-container').length > 0) {
      window.location = this.getPathPrefix() + this.getPathHome();
    }
    if ($('.page-body.register').length > 0) {
      window.location = this.getPathPrefix() + this.getPathHome();
    }

    if ($('.gatingArticle__actions.logged-in').length > 0) {
      var gatingArticleElm1 = $('.gatingArticle__actions.logged-in');

      $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
        var csrftoken = tokenresponse.token;
        $.ajax({
          url: this.getPathPrefix() + this.config.urlDownloadAsset,
          data: { assetinfo: gatingArticleElm1.data('assetinfo') },
          type: 'post',
          headers: { 'CSRF-Token': csrftoken },
          dataType: 'json',
          success: (response) => {
            if (response.status === 'ok') {
              gatingArticleElm1.find('.gatingArticle__button').attr('href', response.href);
              gatingArticleElm1.show();
            }
          }
        });
      });
    }

    if ($('#download .DHLdownload__ctas.logged-in').length > 0) {
      var gatingArticleElm2 = $('#download .DHLdownload__ctas.logged-in');

      $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
        var csrftoken = tokenresponse.token;
        $.ajax({
          url: this.getPathPrefix() + this.config.urlDownloadAsset,
          data: { assetinfo: gatingArticleElm2.data('assetinfo') },
          type: 'post',
          headers: { 'CSRF-Token': csrftoken },
          dataType: 'json',
          success: (response) => {
            if (response.status === 'ok') {
              gatingArticleElm2.find('.DHLdownload__cta--red').attr('href', response.href);
              gatingArticleElm2.show();
            }
          }
        });
      });
    }
  }

  showNotLoggedInElements() {
    $('.below-register-form .tab-container #register-tab-1').addClass('active').show();
    $(".below-register-form .tab-contents .tab-content[data-rel='#register-tab-1']").addClass('open');

    $('.below-register-form #register-tab-2').removeClass('active').show();
    $(".below-register-form .tab-contents .tab-content[data-rel='#register-tab-2']").removeClass('open');

    $('.below-register-form').show();

    $('header .header__desktopLinkItem.logged-out, header .header__primaryLinks.logged-out').show();
    $('.footer .login-links').show();

    $('.gatingArticle__actions.no-logged-in').show();
    $('#download .DHLdownload__ctas.no-logged-in').show();
    $('.competitionDataCapture.not-logged-in').show();
    $('.article-page-login-cta').show();

    $('.gated').addClass('locked').removeClass('unlocked').each((index, item) => {
      $(item).closest('body').find('.hero .hero__cta--grey').hide();
    });
    $('.gated-hide').addClass('locked').removeClass('unlocked');

    var newsletterCookie = this.readCookie('DHL.NewsletterSubscribed');
    if (newsletterCookie !== null) {
      $('.articleGrid .article-grid-item-loggedin').show();
    } else {
      $('.articleGrid .article-grid-item-subscribe').show();
      $('.subscribePanel').show();
    }
  }
}

export default new AuthenticationEvents();
