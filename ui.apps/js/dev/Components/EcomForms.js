class EcomForms {
  constructor() {
    this.sel = {
      component: '.ecom-form',
      closeIcon: '.ecom-form__close',
      maxForm: '.ecom-form--max',
      minForm: '.ecom-form--min',
      submitForm: '.ecom-form input[type=submit]'
    };

    this.displayFormAfter = 5000;

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.formTimer = this.formTimer.bind(this);
    this.showHideMaxForm = this.showHideMaxForm.bind(this);
    this.showHideMinForm = this.showHideMinForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    this.formTimer();
    return true;
  }

  bindEvents() {
    $(document).on('click', this.sel.closeIcon, () => {
      this.showHideMaxForm();
      this.showHideMinForm();
    });

    $(document).on('click', this.sel.submitForm, (e) => {
      e.preventDefault();
      let form = $(e.target).closest('form');
      this.submitForm(form);
    });
  }

  formTimer() {
    setTimeout(() => {
      this.showHideMaxForm();
    }, this.displayFormAfter);
  }

  showHideMaxForm() {
    $(this.sel.maxForm).toggleClass('is-hidden');
  }

  showHideMinForm() {
    $(this.sel.minForm).toggleClass('is-shown');
  }

  submitForm(form) {
    window.location.href = form.attr('action') + '?' + form.serialize();
  }
}

export default new EcomForms();
