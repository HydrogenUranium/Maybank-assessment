class SubscribePanel {
  constructor() {
    this.sel = {
      component: '.subscribePanel',
      form: '.subscribePanel__form',
      successOverlay: '.subscribePanel__responseOverlay.success',
      errorOverlay: '.subscribePanel__responseOverlay.error'
    };

    this.getPathPrefix = this.getPathPrefix.bind(this);
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
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
    $(document).on('submit', this.sel.form, this.submitForm);
  }

  validate() {
    $(this.sel.form).each((index, item) => {
      $(item).validate({
        errorPlacement: (error, element) => {
          if (element.attr('type') === 'checkbox') {
            error.insertAfter($(element).parent().find('label'));
          } else if (element.is('select')) {
            error.insertAfter(element.parent());
            element.parent().find('.selectboxit-btn').addClass('error');
          } else {
            error.insertAfter(element);
          }
        },
        success: (label) => {
          let $parent = $(label).parents('.subscribe__formField');
          if ($parent.find('select').length > 0) {
            $parent.find('.selectboxit-btn').removeClass('error');
          }
        }
      });
    });
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
    return indexedArray;
  }

  showSuccess() {
    $(this.sel.successOverlay).addClass('subscribePanel__responseOverlay--show');
  }

  showError() {
    $(this.sel.errorOverlay).addClass('subscribePanel__responseOverlay--show');
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    this.validate();
    return true;
  }
}

export default new SubscribePanel();
