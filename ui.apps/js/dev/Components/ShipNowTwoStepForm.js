class ShipNowTwoStepForm {
  constructor() {
    this.firstname = '';
    this.lastname = '';
    this.email = '';

    this.sel = {
      component: '.shipNowMulti.wysiwyg, .animatedForm',
      swingbutton: '.shipNowMulti__headcta--red',
      forms: 'form.forms.ship-now-twostep',
      form1: 'form.forms.form1.ship-now-twostep',
      form2: 'form.forms.form2.ship-now-twostep',
      countryselect: 'form.forms.form2.ship-now-twostep #shipnow_country',
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);

    this.toggleAddress = this.toggleAddress.bind(this);

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
