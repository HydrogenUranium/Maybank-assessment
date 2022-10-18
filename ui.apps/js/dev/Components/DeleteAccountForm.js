class DeleteAccountForm {
  constructor() {
    this.config = {
      urlToken: '/libs/granite/csrf/token.json',
      urlRefreshCheck: '/apps/dhl/discoverdhlapi/refresh_token/index.json',
      urlGetAllDetails: '/apps/dhl/discoverdhlapi/getdetails/index.json',
      urlDeleteAccount: '/apps/dhl/discoverdhlapi/deleteaccount/index.json'
    };

    this.sel = {
      component: '.delete-account'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.readCookie = this.readCookie.bind(this);
    this.clearCookie = this.clearCookie.bind(this);
    this.createCookie = this.createCookie.bind(this);

    this.tryDeleteAccount = this.tryDeleteAccount.bind(this);
    this.completeDeleteAccount = this.completeDeleteAccount.bind(this);

    this.loggedIn = this.loggedIn.bind(this);
    this.notLoggedIn = this.notLoggedIn.bind(this);
  }

  getPathPrefix() {
    const prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
    return (prefix ? prefix : '');
  }

  getPathHome() {
    const home = $('head meta[name=\'dhl-path-home\']').attr('content');
    return (home ? home : '');
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    return true;
  }

  bindEvents() {
    jQuery.validator.addMethod('password', (value, element) => {
      return new RegExp($(element).attr('pattern')).test(value);
    }, 'Password format is not valid');

    jQuery.validator.addMethod('equalTo', (value, element) => {
      return ($('#' + $(element).attr('data-equalTo')).val() === $(element).val());
    }, 'Passwords do not match');

    $(window).on('userloggedin.DHL', (evt, tokenData) => {
      this.loggedIn(tokenData);
    });
    $(window).on('usernotloggedin.DHL', () => {
      this.notLoggedIn();
    });

    $(this.sel.component).find('form').validate({
      rules: {
        login__firstName: 'email',
        login__password: 'password'
      },
      errorPlacement: (error, element) => {
        if (element.attr('type') === 'checkbox') {
          error.insertAfter($(element).parent().find('label'));
        } else if (element.attr('type') === 'password') {
          $(element).append(error);
          error.insertAfter($(element).parent());
        } else if (element.attr('type') === 'search') {
          error.insertAfter($(element).parent());
        } else {
          error.insertAfter(element);
        }
      },
      submitHandler: (form) => {
        this.tryDeleteAccount(form);
        return false;
      }
    });
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

  tryDeleteAccount(form) {
    var frm = $(form);
    frm.find("button[type='submit']").text('please wait...');
    frm.find('input.forms__cta--red').val('please wait...');

    var cookie = this.readCookie('DHL.AuthToken');
    if (cookie !== null) {
      var split = cookie.split('|');
      if (split.length >= 2) {
        $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
          var csrftoken = tokenresponse.token;
          $.ajax({
            url: this.getPathPrefix() + this.config.urlGetAllDetails,
            data: { username: split[0], token: split[1] },
            type: 'post',
            headers: { 'CSRF-Token': csrftoken },
            dataType: 'json',
            success: (allDetailsResponse) => {
              if (allDetailsResponse) {
                if (allDetailsResponse.status === 'ok') {
                  $(window).trigger('checkauthtokens.DHL', [ allDetailsResponse, true ]);
                  this.completeDeleteAccount(form, allDetailsResponse);
                } else {
                  alert('An unknown error occurred while attempting to delete your account (1). Please try again later');
                }
              } else {
                alert('An unknown error occurred while attempting to delete your account (2). Please try again later');
              }
            }
          });
        });
      } else {
        alert('An unknown error occurred while attempting to delete your account (3). Please try again later');
      }
    } else {
      var refreshCookie = this.readCookie('DHL.RefreshToken');
      if (refreshCookie !== null) {
        var refreshSplit = refreshCookie.split('|');
        if (refreshSplit.length >= 2) {
          $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
            var csrftoken = tokenresponse.token;
            $.ajax({
              url: this.getPathPrefix() + this.config.urlRefreshCheck,
              data: { username: refreshSplit[0], refresh_token: refreshSplit[1] },
              type: 'post',
              headers: { 'CSRF-Token': csrftoken },
              dataType: 'json',
              success: (refreshResponse) => {
                if (refreshResponse) {
                  if (refreshResponse.status === 'ok') {
                    $(window).trigger('checkauthtokens.DHL', [ refreshResponse, true ]);
                    this.tryDeleteAccount(form);
                  } else {
                    alert('An unknown error occurred while attempting to delete your account (4). Please try again later');
                  }
                } else {
                  alert('An unknown error occurred while attempting to delete your account (5). Please try again later');
                }
              }
            });
          });
        } else {
          alert('An unknown error occurred while attempting to delete your account (6). Please try again later');
        }
      } else {
        alert('An unknown error occurred while attempting to delete your account. Please try again later');
      }
    }
  }

  completeDeleteAccount(form, details) {
    var frm = $(form);

    var data = {
      token: details.token,

      username: frm.find('input#login__firstName').val(),
      password: frm.find('input#login__password').val()
    };

    if (($.trim(data.username).length == 0) || ($.trim(data.password).length == 0)) {
      alert('Please enter your email address and password.');
    } else {
      frm.find("button[type='submit']").text('please wait...');
      frm.find('input.forms__cta--red').val('please wait...');

      $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
        var csrftoken = tokenresponse.token;
        $.ajax({
          url: this.getPathPrefix() + this.config.urlDeleteAccount,
          data: data,
          type: 'post',
          headers: { 'CSRF-Token': csrftoken },
          dataType: 'json',
          success: (deleteAccountResponse) => {
            if (deleteAccountResponse) {
              $(window).trigger('checkauthtokens.DHL', [ deleteAccountResponse, true ]);

              if (deleteAccountResponse.status === 'ok') {
                this.clearCookie('DHL.AuthToken');
                this.clearCookie('DHL.RefreshToken');

                window.location = frm.data('successurl');
              } else {
                alert('An error occurred while attempting to delete your account.\n' + deleteAccountResponse.error);
              }
            } else {
              alert('An unknown error occurred while attempting to delete your account. Please try again later');
            }
            frm.find("button[type='submit']").text('Delete Account');
            frm.find('input.forms__cta--red').val('Delete Account');
          }
        });
      });
    }

    frm.find("button[type='submit']").text('Delete Account');
    frm.find('input.forms__cta--red').val('Delete Account');
  }

  loggedIn(tokenData) {
    if (tokenData && tokenData.status && tokenData.status === 'ok') {
      $(this.sel.component).show();
    }
  }

  notLoggedIn() {
    if ($(this.sel.component).hasClass('no-redirect')) {
      $(this.sel.component).show();
    } else {
      window.location = this.getPathHome() + '.html';
    }
  }
}

export default new DeleteAccountForm();
