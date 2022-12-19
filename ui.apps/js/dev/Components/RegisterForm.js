class RegisterForm {
  constructor() {
    this.config = {
      fbAppId: '1080031328801211',
      goClientId: '313469837420-l882h39ge8n8n9pb97ldvjk3fm8ppqgs.apps.googleusercontent.com',

      urlToken: '/libs/granite/csrf/token.json',
      urlRefreshCheck: '/apps/dhl/discoverdhlapi/refresh_token/index.json',
      urlRegister: '/apps/dhl/discoverdhlapi/register/index.json',
      urlUpdateCategories: '/apps/dhl/discoverdhlapi/update_categories/index.json'
    };

    this.sel = {
      component: '.page-body.register, #download, .gated',
      buttonFacebook: '.forms__cta--social.fb',
      buttonLinkedin: '.forms__cta--social.li',
      buttonGooglePlus: '.forms__cta--social.go'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.loggedIn = this.loggedIn.bind(this);

    this.tryRegisterFacebook = this.tryRegisterFacebook.bind(this);
    this.tryRegisterLinkedin = this.tryRegisterLinkedin.bind(this);
    this.tryRegisterGoogle = this.tryRegisterGoogle.bind(this);
    this.tryRegister = this.tryRegister.bind(this);

    this.executeRegister = this.executeRegister.bind(this);
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

  bindEvents() {
    $(window).on('userloggedin.DHL', () => {
      this.loggedIn();
    });

    jQuery.validator.addMethod('password', (value, element) => {
      if ($.trim(value).length === 0) return true;
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
        this.tryRegisterFacebook(evt);
        return false;
      });
    }

    if ($(this.sel.component).find(this.sel.buttonLinkedin).length > 0) {
      $(this.sel.component).find(this.sel.buttonLinkedin).on('click', (evt) => {
        this.tryRegisterLinkedin(evt);
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
                this.tryRegisterGoogle(googleUser);
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

    $(this.sel.component).find('#glb-register-start form#register-detail-form').validate({
      rules: {
        register__email: 'email',
        register__password1: 'password'
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
        this.tryRegister(form);
        return false;
      }
    });

    $(this.sel.component).find('#glb-register-categories form .forms__cta--red').on('click', (evt) => {
      evt.preventDefault();
      this.tryCategorySelection(evt);
      return false;
    });
  }

  tryRegisterFacebook(evt) {
    evt.preventDefault();

    $(this.sel.component).find(this.sel.buttonFacebook).text('please wait...');

    window.FB.login((loginResponse) => {
      if (loginResponse.authResponse) {
        window.FB.api('/me', (dataResponse) => {
          var data = {
            firstname: dataResponse.first_name,
            lastname: dataResponse.last_name,
            username: dataResponse.email,
            password: dataResponse.id,
            islinkedin: 'true',
            tcagree: true
          };

          this.executeRegister(data, () => {
            $(this.sel.component).find(this.sel.buttonFacebook).text('Facebook');
          });
        }, { fields: [ 'id', 'email', 'first_name', 'last_name' ]});
      }
      return false;
    }, { scope: 'email,public_profile', return_scopes: true });
  }

  tryRegisterLinkedin(evt) {
    evt.preventDefault();

    $(this.sel.component).find(this.sel.buttonLinkedin).text('please wait...');

    IN.User.authorize(() => {
      IN.API.Profile('me').fields('id', 'first-name', 'last-name', 'email-address').result((result) => {
        var member = result.values[0];

        var data = {
          firstname: member.firstName,
          lastname: member.lastName,
          username: member.emailAddress,
          password: member.id,
          islinkedin: 'true',
          tcagree: true
        };

        this.executeRegister(data, () => {
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
            firstname: member.firstName,
            lastname: member.lastName,
            username: member.emailAddress,
            password: member.id,
            islinkedin: 'true',
            tcagree: true
          };

          this.executeRegister(data, () => {
            $(this.sel.component).find(this.sel.buttonLinkedin).text('LinkedIn');
          });
        });
      }
    }, 1000);
    return false;
  }

  tryRegisterGoogle(googleUser) {
    var basicProfile = googleUser.getBasicProfile();

    var data = {
      firstname: basicProfile.getGivenName(),
      lastname: basicProfile.getFamilyName(),
      username: basicProfile.getEmail(),
      password: basicProfile.getId(),
      islinkedin: 'true',
      tcagree: true
    };

    $(this.sel.component).find(this.sel.buttonGooglePlus).text('please wait...');
    this.executeRegister(data, () => {
      $(this.sel.component).find(this.sel.buttonGooglePlus).text('Google+');
    });
  }

  tryRegister(form) {
    var frm = $(form);
    var data = {
      firstname: frm.find('input#register__firstname').val(),
      lastname: frm.find('input#register__lastname').val(),
      username: frm.find('input#register__email').val(),
      password: frm.find('input#register__password1').val(),

      islinkedin: 'false',
      tcagree: frm.find('input#checkboxId').is(':checked')
    };

    if (($.trim(data.firstname).length === 0) || ($.trim(data.lastname).length === 0) || ($.trim(data.username).length === 0)) {
      alert('Please enter your name and email address.');
    } else {
      frm.find("button[type='submit']").text('please wait...');
      frm.find('input.forms__cta--red').val('please wait...');

      this.executeRegister(data, () => {
        frm.find("button[type='submit']").text('Submit');
        frm.find('input.forms__cta--red').val('Submit');
      });
    }

    return false;
  }

  executeRegister(data, unwaitCallback) {
    $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
      var csrftoken = tokenresponse.token;

      $.ajax({
        url: this.getPathPrefix() + this.config.urlRegister,
        data: data,
        type: 'post',
        headers: { 'CSRF-Token': csrftoken },
        dataType: 'json',
        success: (response) => {
          if (response) {
            var frm = $('.page-body.register, #download, .gated').find('form');

            if (response.status === 'ok') {
              $(window).trigger('checkauthtokens.DHL', [ response, true ]);

              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                'event': 'registrationComplete'
              });

              if ((frm.closest('#download').length > 0) || (frm.closest('.gated').length > 0)) {
                location.reload();
                return;
              }

              var modal = $('.register.below-register-form').find('.modal');
              var categorySelection = $(this.sel.component).find('#glb-register-categories');
              if (modal.length > 0) {
                modal.find('.thanks-name').text(data.firstname);
                modal.find('button').on('click', () => {
                  var backUrl = frm.data('back');
                  if ($.trim(backUrl).length === 0) {
                    location.reload();
                  } else {
                    window.location = backUrl;
                  }
                });

                modal.modal('show');
              } else if (categorySelection.length > 0) {
                $(this.sel.component).find('#glb-register-start').hide();

                categorySelection.find('.forms__title').text('Thanks ' + response.name);
                categorySelection.show();
              }
            } else if (response.error.includes('Email address already exists')) {
              $('<label id="register__email-error" class="error" for="register__email">This email address already exists</label>').insertAfter(frm.find('input#register__email'));
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

  tryCategorySelection() {
    var categories = '';
    var container = $(this.sel.component).find('#glb-register-categories form');
    container.find('input:checked').each((index, item) => {
      if (categories.length > 0) {
        categories += ',';
      }
      categories += $(item).val();
    });

    if (categories.length > 0) {
      var cookie = this.readCookie('DHL.AuthToken');
      if (cookie !== null) {
        var split = cookie.split('|');
        if (split.length >= 2) {
          $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
            var csrftoken = tokenresponse.token;
            $.ajax({
              url: this.getPathPrefix() + this.config.urlUpdateCategories,
              data: { username: split[0], token: split[1], cats: categories },
              type: 'post',
              headers: { 'CSRF-Token': csrftoken },
              dataType: 'json',
              success: (updateCategoriesResponse) => {
                if (updateCategoriesResponse) {
                  if (updateCategoriesResponse.status === 'ok') {
                    $(window).trigger('checkauthtokens.DHL', [ updateCategoriesResponse, true ]);
                    window.location = this.getPathPrefix() + this.getPathHome();
                  } else {
                    alert('An unknown error occurred while attempting to update your details (1). Please try again later');
                  }
                } else {
                  alert('An unknown error occurred while attempting to update your details (2). Please try again later');
                }
              }
            });
          });
        } else {
          alert('An unknown error occurred while attempting to update your details (3). Please try again later');
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
                      this.tryCategorySelection();
                    } else {
                      alert('An unknown error occurred while attempting to update your details (4). Please try again later');
                    }
                  } else {
                    alert('An unknown error occurred while attempting to update your details (5). Please try again later');
                  }
                }
              });
            });
          } else {
            alert('An unknown error occurred while attempting to update your details (6). Please try again later');
          }
        } else {
          alert('An unknown error occurred while attempting to enter the competition. Please try again later');
        }
      }
    }

    return false;
  }

  loggedIn() {
    if ($('.page-body.register').length > 0) {
      window.location = '/content/dhl/your-account.html';
    }
  }
}

export default new RegisterForm();
