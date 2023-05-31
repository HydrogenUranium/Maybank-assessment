class LoginForm {
  constructor() {
    this.config = {
      urlToken: '/libs/granite/csrf/token.json'
    };

    this.sel = {
      component: '.standardContent.user-account, .page-body.user-account'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.getPathHome = this.getPathHome.bind(this);
    this.getRealPathHome = this.getRealPathHome.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.readCookie = this.readCookie.bind(this);

    this.tryUpdateDetails = this.tryUpdateDetails.bind(this);
    this.completeUpdateDetails = this.completeUpdateDetails.bind(this);

    this.loggedIn = this.loggedIn.bind(this);
    this.notLoggedIn = this.notLoggedIn.bind(this);
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
    $(window).on('userloggedin.DHL', (evt, tokenData) => {
      this.loggedIn(tokenData);
    });
    $(window).on('usernotloggedin.DHL', () => {
      this.notLoggedIn();
    });

    var form = $(this.sel.component).find('form');
    if (form.length > 0) {
      jQuery.validator.addMethod('myAccountCurrentPassword', (value, element) => {
        var $parent = $(element).parents('form');
        var $currentPasswordContainer = $parent.find('.useraccount-currentpassword');
        var $newPassword = $parent.find('input[name="myAccount__newPassword"]');
        var $confirmPassword = $parent.find('input[name="myAccount__confirmPassword"]');

        return (($newPassword.val() === '' && $confirmPassword.val() === '') || ($currentPasswordContainer.is(':visible') && $(element).val() !== ''));
      }, 'You must enter your current password');

      jQuery.validator.addMethod('myAccountPassword', (value, element) => {
        if ($(element).val() === '') return true;
        return new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\W])[A-Za-z\d_\W]{8,}$/).test(value);
      }, 'Password format is not valid');

      jQuery.validator.addMethod('myAccountEqualTo', (value, element) => {
        return ($('#' + $(element).attr('data-equalTo')).val() === $(element).val());
      }, 'Passwords do not match');

      form.validate({
        rules: {
          myAccount__currentPassword: 'myAccountCurrentPassword',
          myAccount__newPassword: 'myAccountPassword',
          myAccount__confirmPassword: 'myAccountEqualTo'
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
        submitHandler: (formElement) => {
          this.tryUpdateDetails(formElement);
          return false;
        }
      });
    }
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

  tryUpdateDetails(form) {
    var frm = $(form);
    frm.find('input.forms__cta--red').val('please wait...');
    frm.find("button[type='submit']").text('please wait...');

    var cookie = this.readCookie('DHL.AuthToken');
    if (cookie !== null) {
      var split = cookie.split('|');
      if (split.length >= 2) {
        $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
          var csrftoken = tokenresponse.token;
          $.ajax({
            url: this.getRealPathHome() + '.details.json',
            data: { username: split[0], token: split[1] },
            type: 'post',
            headers: { 'CSRF-Token': csrftoken },
            dataType: 'json',
            success: (allDetailsResponse) => {
              if (allDetailsResponse) {
                if (allDetailsResponse.status === 'ok') {
                  $(window).trigger('checkauthtokens.DHL', [ allDetailsResponse, true ]);
                  this.completeUpdateDetails(form, allDetailsResponse);
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
              url: this.getRealPathHome() + '.updatetoken.json',
              data: { username: refreshSplit[0], refresh_token: refreshSplit[1] },
              type: 'post',
              headers: { 'CSRF-Token': csrftoken },
              dataType: 'json',
              success: (refreshResponse) => {
                if (refreshResponse) {
                  if (refreshResponse.status === 'ok') {
                    $(window).trigger('checkauthtokens.DHL', [ refreshResponse, true ]);
                    this.tryUpdateDetails(form);
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

  completeUpdateDetails(form, details) {
    var frm = $(form);

    var newemail = frm.find('input#myAccount__email').val();
    if (newemail.trim() === details.registration_email) {
      newemail = '';
    }

    var categories = '';
    frm.find('#glb-youraccount-categories input:checked').each((index, item) => {
      if (categories.length > 0) {
        categories += ',';
      }
      categories += $(item).val();
    });

    var data = {
      token: details.token,

      firstname: frm.find('input#myAccount__firstName').val(),
      lastname: frm.find('input#myAccount__lastName').val(),
      username: details.registration_email,
      newusername: newemail,

      password: frm.find('input#myAccount__currentPassword').val(),
      newpassword: frm.find('input#myAccount__newPassword').val(),

      position: frm.find('input#myAccount__position').val(),
      contact: frm.find('input#myAccount__phoneNumber').val(),
      size: frm.find('select#myAccount__businessSize').val(),
      sector: frm.find('select#myAccount__businessSector').val(),

      tcagree: frm.find('input#checkboxIdTCMessage').is(':checked'),

      cats: categories
    };

    if (($.trim(data.firstname).length === 0) || ($.trim(data.lastname).length === 0) || ($.trim(data.username).length === 0)) {
      alert('Please enter your name, email address and personal details.');
    } else {
      frm.find("button[type='submit'].update-btn").text('please wait...');
      frm.find('input.forms__cta--red').val('please wait...');

      $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
        var csrftoken = tokenresponse.token;
        $.ajax({
          url: this.getRealPathHome() + '.updatedetails.json',
          data: data,
          type: 'post',
          headers: { 'CSRF-Token': csrftoken },
          dataType: 'json',
          success: (updateDetailsResponse) => {
            if (updateDetailsResponse) {
              $(window).trigger('checkauthtokens.DHL', [ updateDetailsResponse, true ]);

              if (updateDetailsResponse.status === 'ok') {
                frm.find('.myAccount__message').show();

                if (data.newpassword.length > 0) {
                  frm.find('input#myAccount__email').removeAttr('readonly');
                  frm.find('.useraccount-currentpassword').show();
                }
                frm.find('input#myAccount__currentPassword').val('');
                frm.find('input#myAccount__newPassword').val('');
                frm.find('input#myAccount__confirmPassword').val('');

                $('header .header__auth--loggedin .user-firstname').text(data.firstname);
                $('.competitionDataCapture.logged-in .loggedin-name').text(data.firstname);
                $(window).scrollTop(0);
              } else {
                alert('An error occurred while attempting to update your details.\n' + updateDetailsResponse.error);
              }
            } else {
              alert('An unknown error occurred while attempting to update your details. Please try again later');
            }
            frm.find("button[type='submit'].update-btn").text('Update');
            frm.find('input.forms__cta--red').val('Update');
          }
        });
      });
    }

    frm.find("button[type='submit'].update-btn").text('Update');
    frm.find('input.forms__cta--red').val('Update');
  }

  loggedIn(tokenData) {
    if (tokenData && tokenData.status && tokenData.status === 'ok') {
      $.get(this.getPathPrefix() + this.config.urlToken, (tokenresponse) => {
        var csrftoken = tokenresponse.token;

        $.ajax({
          url: this.getRealPathHome() + '.details.json',
          data: { username: tokenData.username, token: tokenData.token },
          type: 'post',
          headers: { 'CSRF-Token': csrftoken },
          dataType: 'json',
          success: (allDetailsResponse) => {
            if (allDetailsResponse) {
              if (allDetailsResponse.status === 'ok') {
                var componentForm = $(this.sel.component);
                $(window).trigger('checkauthtokens.DHL', [ allDetailsResponse, true ]);

                componentForm.find('.loggedin-username').text(allDetailsResponse.registration_firstname);

                componentForm.find('input#myAccount__firstName').val(allDetailsResponse.registration_firstname);
                componentForm.find('input#myAccount__lastName').val(allDetailsResponse.registration_lastname);
                componentForm.find('input#myAccount__email').val(allDetailsResponse.registration_email);

                componentForm.find('input#myAccount__position').val(allDetailsResponse.registration_position);
                componentForm.find('input#myAccount__phoneNumber').val(allDetailsResponse.registration_contact);

                componentForm.find('select#myAccount__businessSize').val(allDetailsResponse.registration_size);
                componentForm.find('select#myAccount__businessSector').val(allDetailsResponse.registration_sector);

                if (allDetailsResponse.registration_tcagree === 'true') {
                  componentForm.find('input#checkboxIdTCMessage').prop('checked', true);
                } else {
                  componentForm.find('input#checkboxIdTCMessage').prop('checked', false);
                }

                componentForm.find('#glb-youraccount-categories input[type="checkbox"]').prop('checked', false);
                var categories = allDetailsResponse.registration_cats.split(',');
                for (var i = 0; i < categories.length; i++) {
                  componentForm.find('#glb-youraccount-categories input[type="checkbox"][value="' + categories[i] + '"]').prop('checked', true);
                }

                if (allDetailsResponse.registration_islinkedin === 'false') {
                  if (allDetailsResponse.full !== false) {
                    componentForm.find('.useraccount-currentpassword').show();
                  }
                } else {
                  componentForm.find('input#myAccount__email').attr('readonly', 'readonly');
                }

                componentForm.closest('.page-body-wrapper').removeClass('awaiting');
                componentForm.show();
              } else {
                alert('An unknown error occurred while attempting to display your details. Please try again later');
              }
            } else {
              alert('An unknown error occurred while attempting to display your details. Please try again later');
            }
          }
        });
      });
    }
  }

  notLoggedIn() {
    if ($(this.sel.component).hasClass('no-redirect')) {
      $(this.sel.component).show();
    } else {
      window.location = this.getPathPrefix() + this.getPathHome();
    }
  }
}

export default new LoginForm();

