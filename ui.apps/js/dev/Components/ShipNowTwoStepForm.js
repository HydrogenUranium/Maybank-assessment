class ShipNowTwoStepForm {
  constructor() {
    this.firstname = '';
    this.lastname = '';
    this.email = '';

    this.config = {
      // fbAppId: '1000773163337798',
      fbAppId: '1080031328801211',
      // goClientId: '913960352236-u7un0l22tvkmlbpa5bcnf1uqg4csi7e3.apps.googleusercontent.com',
      goClientId: '313469837420-l882h39ge8n8n9pb97ldvjk3fm8ppqgs.apps.googleusercontent.com'
    };

    this.sel = {
      component: '.shipNowMulti.wysiwyg, .animatedForm',
      swingbutton: '.shipNowMulti__headcta--red',
      forms: 'form.forms.ship-now-twostep',
      form1: 'form.forms.form1.ship-now-twostep',
      form2: 'form.forms.form2.ship-now-twostep',
      countryselect: 'form.forms.form2.ship-now-twostep #shipnow_country',

      buttonFacebook: '.forms__cta--social.facebook',
      buttonLinkedin: '.forms__cta--social.linkedin',
      buttonGooglePlus: '.forms__cta--social.google'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);

    this.toggleAddress = this.toggleAddress.bind(this);
    this.submitFacebook = this.submitFacebook.bind(this);
    this.submitLinkedin = this.submitLinkedin.bind(this);
    this.submitGoogle = this.submitGoogle.bind(this);
    this.submitForm1 = this.submitForm1.bind(this);
    this.nextForm = this.nextForm.bind(this);
    this.submitForm2 = this.submitForm2.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.validate = this.validate.bind(this);
  }

  getPathPrefix() {
    const prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
    return (prefix ? prefix : '');
  }

  bindEvents() {
    $(document).on('submit', this.sel.form1, this.submitForm1);
    $(document).on('submit', this.sel.form2, this.submitForm2);
    $(document).on('change', this.sel.countryselect, this.toggleAddress);

    var country = $(this.sel.form2).data('preselectcountry');
    if ((country !== null) && $.trim(country).length > 0) {
      $(this.sel.countryselect).val(country).trigger('change');
    }

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
        this.submitFacebook(evt);
        return false;
      });
    }

    if ($(this.sel.component).find(this.sel.buttonLinkedin).length > 0) {
      $(this.sel.component).find(this.sel.buttonLinkedin).on('click', (evt) => {
        this.submitLinkedin(evt);
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
                this.submitGoogle(googleUser);
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

    $(document).on('click', this.sel.swingbutton, (evt) => {
      var id = $(evt.currentTarget).attr('href');
      var offset = $(id).offset().top;
      $('html, body').animate({
        scrollTop: offset
      }, 1000, 'swing');

      return false;
    });
  }

  validate() {
    $(this.sel.forms).each((index, item) => {
      $(item).validate({
        errorPlacement: (error, element) => {
          if (element.attr('type') === 'checkbox') {
            error.insertAfter($(element).parent().find('label'));
          } else if (element.is('select')) {
            error.insertAfter(element);
            element.parent().find('.selectboxit-btn').addClass('error');
          } else {
            error.insertAfter(element);
          }
        },
        success: (label) => {
          let $parent = $(label).parents('form.ship-now');
          if ($parent.find('select').length > 0) {
            $parent.find('.selectboxit-btn').removeClass('error');
          }
        }
      });
    });
  }

  toggleAddress(e) {
    var val = $(this.sel.countryselect).val();

    var options = $('option', this.sel.countryselect);
    var mandatory = true;
    options.each((index, item) => {
      if ($(item).attr('value') === val && ('' + $(item).data('nonmandatory')) === 'true') {
        mandatory = false;
      }
    });

    if (mandatory) {
      $('#shipnow_address', this.sel.form).attr('required', 'required').attr('placeholder', 'Address*');
      $('#shipnow_zip', this.sel.form).attr('required', 'required').attr('placeholder', 'ZIP or Postcode*');
      $('#shipnow_city', this.sel.form).attr('required', 'required').attr('placeholder', 'City*');
    } else {
      $('#shipnow_address', this.sel.form).removeAttr('required').attr('placeholder', 'Address').removeClass('error').closest('div').find('label').remove();
      $('#shipnow_zip', this.sel.form).removeAttr('required').attr('placeholder', 'ZIP or Postcode').removeClass('error').closest('div').find('label').remove();
      $('#shipnow_city', this.sel.form).removeAttr('required').attr('placeholder', 'City').removeClass('error').closest('div').find('label').remove();
    }
  }

  submitFacebook(evt) {
    evt.preventDefault();

    window.FB.login((loginResponse) => {
      if (loginResponse.authResponse) {
        window.FB.api('/me', (dataResponse) => {
          this.firstname = dataResponse.first_name;
          this.lastname = dataResponse.last_name;
          this.email = dataResponse.email;

          this.nextForm();
        }, { fields: [ 'id', 'email', 'first_name', 'last_name' ]});
      }
      return false;
    }, { scope: 'email,public_profile', return_scopes: true });
  }

  submitLinkedin(evt) {
    evt.preventDefault();

    IN.User.authorize(() => {
      IN.API.Profile('me').fields('id', 'first-name', 'last-name', 'email-address').result((result) => {
        var member = result.values[0];

        this.firstname = member.firstName;
        this.lastname = member.lastName;
        this.email = member.emailAddress;

        this.nextForm();
      });
    });

    setInterval(() => {
      var result = window.IN.User.isAuthorized();
      if (result) {
        IN.API.Profile('me').fields('id', 'first-name', 'last-name', 'email-address').result((result) => {
          var member = result.values[0];
  
          this.firstname = member.firstName;
          this.lastname = member.lastName;
          this.email = member.emailAddress;
  
          this.nextForm();
        });
      }
    }, 1000);

    return false;
  }

  submitGoogle(googleUser) {
    var basicProfile = googleUser.getBasicProfile();

    this.firstname = basicProfile.getGivenName();
    this.lastname = basicProfile.getFamilyName();
    this.email = basicProfile.getEmail();

    this.nextForm();
  }

  submitForm1(e) {
    e.preventDefault();
    let $form = $(e.target);
    let formData = this.getFormData($form);

    this.firstname = formData.firstname;
    this.lastname = formData.lastname;
    this.email = formData.email;

    this.nextForm();
  }

  nextForm() {
    $('.shipNowMulti__formstep--step1', this.sel.component).hide();
    $('.shipNowMulti__formstep--step2', this.sel.component).show();
    $(this.sel.component).addClass('active');
  }

  submitForm2(e) {
    e.preventDefault();
    let $form = $(e.target);
    let formData = this.getFormData($form);
    formData.firstname = this.firstname;
    formData.lastname = this.lastname;
    formData.email = this.email;

    $.post(this.getPathPrefix() + $form.attr('action'), formData, (data) => {
      if (data.status === 'OK') {
        this.showSuccess();
      } else {
        alert('An error occurred. Please try again later.');
      }
    });
  }

  getFormData($form) {
    let unindexedArray = $form.serializeArray();
    let indexedArray = {};
    $.map(unindexedArray, (n) => (indexedArray[n.name] = n.value));

    indexedArray.source = $.trim($form.data('source'));
    indexedArray.lo = $.trim($form.data('lo'));

    return indexedArray;
  }

  showSuccess() {
    var thanks = $('.shipNowMulti__formstep--step2', this.sel.component).data("thanks");
    if ((thanks !== null) && (thanks.length > 0)) {
      window.location = thanks;
    } else {
      $('.shipNowMulti__formstep--step2', this.sel.component).hide();
      $('.shipNowMulti__formstep--thanks', this.sel.component).show();
    }
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    this.validate();
    return true;
  }
}

export default new ShipNowTwoStepForm();
