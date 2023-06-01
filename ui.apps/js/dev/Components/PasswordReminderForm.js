class PasswordReminderForm {
  constructor() {
    this.config = {
      urlToken: '/libs/granite/csrf/token.json',
      urlLogin: '/apps/dhl/discoverdhlapi/login/index.form.html',
      urlRequest: '/apps/dhl/discoverdhlapi/request_password/index.form.html',
      urlReset: '/apps/dhl/discoverdhlapi/reset_password/index.json'
    };

    this.sel = {
      component: '.reset-password-container'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
    this.getRealPathHome = this.getRealPathHome.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.createCookie = this.createCookie.bind(this);

    this.requestToken = this.requestToken.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
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

    var reminderPage = $(this.sel.component);
    if (reminderPage.length > 0) {
      var username = reminderPage.data('username');
      var token = reminderPage.data('token');

      if ((username !== null && typeof (username) !== 'undefined' && username.length > 0) && (token !== null && typeof (token) !== 'undefined' && token.length > 0)) {
        reminderPage.find('.step-3').show();
        reminderPage.find('.step-1').hide();
        reminderPage.find('.step-2').hide();
      } else {
        reminderPage.find('.step-1').show();
        reminderPage.find('.step-2').hide();
        reminderPage.find('.step-3').hide();
      }

      reminderPage.find('.step-1 form').validate({
        rules: {
          resetPassword__email: 'email'
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
          this.requestToken(form);
          return false;
        }
      });

      reminderPage.find('.step-3 form').validate({
        rules: {
          reset__createPassword: 'password',
          reset__confirmPassword: 'equalTo'
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
          this.resetPassword(form);
          return false;
        }
      });
    }
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

  requestToken(form) {
    var data = {
      username: $(form).find('input#resetPassword__email').val(),
      page: window.location.href
    };

    $(form).find("button[type='submit']").text('please wait...');
    $(form).find('input.forms__cta--red').val('please wait...');
    $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
      var csrftoken = tokenresponse.token;
      data.formStart = this.getRealPathHome() + '.requestpassword.json';
      $.ajax({
        url: this.getPathPrefix() + this.config.urlRequest,
        data: data,
        type: 'post',
        headers: { 'CSRF-Token': csrftoken },
        dataType: 'json',
        success: (response) => {
          if (response) {
            if (response.status === 'ok') {
              $(this.sel.component).find('.step-1').hide();
              $(this.sel.component).find('.step-2').show();
            } else {
              alert('An error occurred while attempting to request a password reset.\n' + response.error);
            }
          } else {
            alert('An unknown error occurred while attempting to request a password reset. Please try again later');
          }
          $(form).find("button[type='submit']").text('Get new password');
          $(form).find('input.forms__cta--red').val('Get new password');
        }
      });
    });
  }

  resetPassword(form) {
    var username = $(this.sel.component).data('username');
    var token = $(this.sel.component).data('token');
    var password = $(form).find('input#reset__createPassword').val();
    var data = {
      username: username,
      token: token,
      password: password
    };

    $(form).find("button[type='submit']").text('please wait...');
    $(form).find('input.forms__cta--red').val('please wait...');
    $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
      var csrftoken = tokenresponse.token;
      $.ajax({
        url: this.getPathPrefix() + this.config.urlReset,
        data: data,
        type: 'post',
        headers: { 'CSRF-Token': csrftoken },
        dataType: 'json',
        success: (response) => {
          if (response) {
            if (response.status === 'ok') {
              $.get(this.getPathPrefix() + this.config.urlToken, (nextTokenResponse) => {
                var nextcsrftoken = nextTokenResponse.token;

                $.ajax({
                  url: this.getPathPrefix() + this.config.urlLogin,
                  data: { username: username, password: password, formStart: this.getRealPathHome() + '.login.json' },
                  type: 'post',
                  headers: { 'CSRF-Token': nextcsrftoken },
                  dataType: 'json',
                  success: (loginResponse) => {
                    if (loginResponse) {
                      if (loginResponse.status === 'ok') {
                        $(window).trigger('checkauthtokens.DHL', [ loginResponse, true ]);

                        var backUrl = $(form).data('back');
                        if ($.trim(backUrl).length === 0) {
                          backUrl = this.getPathPrefix() + this.getPathHome();
                        }
                        window.location = backUrl;
                      } else {
                        alert('An error occurred while attempting to login using your updated credentials.\n' + response.error);
                      }
                    } else {
                      alert('An unknown error occurred while attempting to login using your updated credentials. Please try again later');
                    }
                    $(form).find("button[type='submit']").text('Submit');
                    $(form).find('input.forms__cta--red').val('Submit');
                  }
                });
              });
            } else {
              alert('An error occurred while attempting to request a password reset.\n' + response.error);
            }
          } else {
            alert('An unknown error occurred while attempting to request a password reset. Please try again later');
          }
        }
      });
    });
  }
}

export default new PasswordReminderForm();
