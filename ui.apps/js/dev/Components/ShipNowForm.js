class ShipNowForm {
  constructor() {
    this.sel = {
      form: 'form.forms.ship-now',
      countryselect: 'form.forms.ship-now #shipnow_country'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.toggleAddress = this.toggleAddress.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.validate = this.validate.bind(this);
  }

  getPathPrefix() {
    const prefix = $('head meta[name=\'dhl-path-prefix\']').attr('content');
    return (prefix ? prefix : '');
  }

  bindEvents() {
    $(document).on('change', this.sel.countryselect, this.toggleAddress);
    $(document).on('submit', this.sel.form, this.submitForm);

    var country = $(this.sel.form).data('preselectcountry');
    if ((country !== null) && $.trim(country).length > 0) {
      $(this.sel.countryselect).val(country).trigger('change');
    }
  }

  validate() {
    $(this.sel.form).each((index, item) => {
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

  submitForm(e) {
    e.preventDefault();
    let $form = $(e.target);
    let formData = this.getFormData($form);
    $.post(this.getPathPrefix() + $form.attr('action'), formData, (data) => {
      if (data.status === 'OK') {
        this.showSuccess();
      } else {
        this.showError();
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
    window.location = $(this.sel.form).data('thanks');
  }

  showError() {
    alert('An error occurred. Please try again later.');
  }

  init() {
    if ($(this.sel.form).length <= 0) return false;
    this.bindEvents();
    this.validate();
    return true;
  }
}

export default new ShipNowForm();
