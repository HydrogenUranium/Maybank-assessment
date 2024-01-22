class LoginForm {
  constructor() {
    this.config = {
      urlToken: '/libs/granite/csrf/token.json',
      urlLogin: '/apps/dhl/discoverdhlapi/login/index.form.html'
    };

    this.sel = {
      component: '.page-body.login form.forms',
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
    this.getRealPathHome = this.getRealPathHome.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);

    this.tryLogin = this.tryLogin.bind(this);

    this.executeLogin = this.executeLogin.bind(this);

    this.loggedIn = this.loggedIn.bind(this);
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
    $(window).on('userloggedin.DHL', () => {
      this.loggedIn();
    });

    jQuery.validator.addMethod('password', (value, element) => {
      return new RegExp($(element).attr('pattern')).test(value);
    }, 'Password format is not valid');

    jQuery.validator.addMethod('equalTo', (value, element) => {
      return ($('#' + $(element).attr('data-equalTo')).val() === $(element).val());
    }, 'Passwords do not match');

    $(this.sel.component).validate({
      rules: {
        login__email: 'email',
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
        this.tryLogin(form);
        return false;
      }
    });
  }

  tryLogin(form) {
    var frm = $(form);
    var username = frm.find('input#login__email').val();
    var password = frm.find('input#login__password').val();

    if (($.trim(username).length === 0) || ($.trim(password).length === 0)) {
      alert('Please enter your email address and password');
    } else {
      frm.find("button[type='submit']").text('please wait...');
      frm.find('input.forms__cta--red').val('please wait...');

      this.executeLogin({ username: username, password: password }, () => {
        frm.find("button[type='submit']").text('Log In');
        frm.find('input.forms__cta--red').val('Login');
      });
    }

    return false;
  }

  executeLogin(data, unwaitCallback) {
    $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
      var csrftoken = tokenresponse.token;
      data.formStart = this.getRealPathHome() + '.login.json';

      $.ajax({
        url: this.getPathPrefix() + this.config.urlLogin,
        data: data,
        type: 'post',
        headers: { 'CSRF-Token': csrftoken },
        dataType: 'json',
        success: (response) => {
          if (response) {
            if (response.status === 'ok') {
              $(window).trigger('checkauthtokens.DHL', [ response, true ]);
              var backUrl = $(this.sel.component).data('back');
              if ($.trim(backUrl).length === 0) {
                backUrl = this.getPathPrefix() + this.getPathHome();
              }
              window.location = this.getPathPrefix() + backUrl;
            } else {
              alert('An error occurred while attempting to register.\n' + response.error);
            }
          } else {
            alert('An unknown error occurred while attempting to register. Please try again later.');
          }
          unwaitCallback();
        }
      });
    });
  }

  loggedIn() {
    window.location = this.getPathPrefix() + this.getPathHome() + 'your-account';
  }
}

export default new LoginForm();
