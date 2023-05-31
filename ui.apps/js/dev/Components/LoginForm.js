class LoginForm {
  constructor() {
    this.config = {
      fbAppId: '1080031328801211',
      goClientId: '313469837420-l882h39ge8n8n9pb97ldvjk3fm8ppqgs.apps.googleusercontent.com',

      urlToken: '/libs/granite/csrf/token.json'
    };

    this.sel = {
      component: '.page-body.login form.forms',
      buttonFacebook: '.forms__cta--social.fb',
      buttonLinkedin: '.forms__cta--social.li',
      buttonGooglePlus: '.forms__cta--social.go'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
    this.getRealPathHome = this.getRealPathHome.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);

    this.tryLoginFacebook = this.tryLoginFacebook.bind(this);
    this.tryLoginLinkedin = this.tryLoginLinkedin.bind(this);
    this.tryLoginGoogle = this.tryLoginGoogle.bind(this);
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

    if ($(this.sel.component).find(this.sel.buttonFacebook).length > 0) {
      window.fbAsyncInit = () => {
        window.fb_interval = setInterval(() => {
          if (typeof (window.FB) !== 'undefined' && window.FB !== null) {
            window.FB.init({
              appId: this.config.fbAppId,
              cookie: true,
              xfbml: true,
              version: 'v2.8'
            });

            clearInterval(window.fb_interval);
          }
        }, 100);
      };

      if (document.getElementById('facebook-jssdk') === null) {
        var fjs = document.getElementsByTagName('script')[0];
        var js = document.createElement('script');
        js.id = 'facebook-jssdk';
        js.src = '//connect.facebook.net/en_EN/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      }
      $(this.sel.component).find(this.sel.buttonFacebook).on('click', (evt) => {
        this.tryLoginFacebook(evt);
        return false;
      });
    }

    if ($(this.sel.component).find(this.sel.buttonLinkedin).length > 0) {
      $(this.sel.component).find(this.sel.buttonLinkedin).on('click', (evt) => {
        this.tryLoginLinkedin(evt);
        return false;
      });
    }

    var googleButton = $(this.sel.component).find(this.sel.buttonGooglePlus);
    if (googleButton.length > 0) {
      window.go_interval = setInterval(() => {
        if (typeof (window.gapi) !== 'undefined' && window.gapi !== null) {
          window.gapi.load('auth2', () => {
            var auth2 = window.gapi.auth2.init({
              client_id: this.config.goClientId,
              cookiepolicy: 'single_host_origin'
            });

            var element = googleButton.get(0);
            auth2.attachClickHandler(element, {},
              (googleUser) => {
                this.tryLoginGoogle(googleUser);
                return false;
              },
              (result) => {
                if (result.error !== 'popup_closed_by_user') {
                  alert(result.error);
                }
              }
            );
          });

          clearInterval(window.go_interval);
        }
      }, 100);

      $(this.sel.component).find(this.sel.buttonGooglePlus).on('click', (evt) => {
        evt.preventDefault();
        return false;
      });
    }

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

  tryLoginFacebook(evt) {
    evt.preventDefault();

    $(this.sel.component).find(this.sel.buttonFacebook).text('please wait...');

    window.FB.login((loginResponse) => {
      if (loginResponse.authResponse) {
        window.FB.api('/me', (dataResponse) => {
          var data = {
            username: dataResponse.email,
            password: dataResponse.id
          };

          this.executeLogin(data, () => {
            $(this.sel.component).find(this.sel.buttonFacebook).text('Facebook');
          });
        }, { fields: [ 'id', 'email' ]});
      }
      return false;
    }, { scope: 'email,public_profile', return_scopes: true });
  }

  tryLoginLinkedin(evt) {
    evt.preventDefault();

    $(this.sel.component).find(this.sel.buttonLinkedin).text('please wait...');

    IN.User.authorize(() => {
      IN.API.Profile('me').fields('id', 'first-name', 'last-name', 'email-address').result((result) => {
        var member = result.values[0];

        var data = {
          username: member.emailAddress,
          password: member.id
        };

        this.executeLogin(data, () => {
          $(this.sel.component).find(this.sel.buttonLinkedin).text('LinkedIn');
        });
      });
    });

    setInterval(() => {
      var result = window.IN.User.isAuthorized();
      if (result) {
        IN.API.Profile('me').fields('id', 'first-name', 'last-name', 'email-address').result((result) => {
          var member = result.values[0];

          var data = {
            username: member.emailAddress,
            password: member.id
          };

          this.executeLogin(data, () => {
            $(this.sel.component).find(this.sel.buttonLinkedin).text('LinkedIn');
          });
        });
      }
    }, 1000);


    return false;
  }

  tryLoginGoogle(googleUser) {
    var data = {
      username: googleUser.getBasicProfile().getEmail(),
      password: googleUser.getBasicProfile().getId()
    };

    $(this.sel.component).find(this.sel.buttonGooglePlus).text('please wait...');
    this.executeLogin(data, () => {
      $(this.sel.component).find(this.sel.buttonGooglePlus).text('Google+');
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

      $.ajax({
        url: this.getRealPathHome() + '.login.json',
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
