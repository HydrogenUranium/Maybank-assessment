class RegisterForm {
  constructor() {
    this.config = {
      urlToken: '/libs/granite/csrf/token.json',
      urlRefreshCheck: '/apps/dhl/discoverdhlapi/refresh_token/index.form.html',
      urlRegister: '/apps/dhl/discoverdhlapi/register/index.form.html',
      urlUpdateCategories: '/apps/dhl/discoverdhlapi/update_categories/index.form.html'
    };

    this.sel = {
      component: '.page-body.register, #download, .gated',
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
    this.getRealPathHome = this.getRealPathHome.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.loggedIn = this.loggedIn.bind(this);

    this.tryRegister = this.tryRegister.bind(this);

    this.executeRegister = this.executeRegister.bind(this);
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
      data.formStart = this.getRealPathHome() + '.register.json';

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
              data: { username: split[0], token: split[1], cats: categories, formStart: this.getRealPathHome() + '.updatecategories.json' },
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
                data: { username: refreshSplit[0], refresh_token: refreshSplit[1], formStart: this.getRealPathHome() + '.updatetoken.json' },
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
      window.location = this.getPathPrefix() + this.getPathHome() + '/your-account'
    }
  }
}

export default new RegisterForm();
