class Password {
  constructor() {
    this.sel = {
      component: '.forms__password',
      toggle: '.forms__password input[type=checkbox]'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.togglePlainText = this.togglePlainText.bind(this);
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    return true;
  }

  bindEvents() {
    $(document).on('change', this.sel.toggle, (e) => {
      const passwordTarget = $(e.target).attr('data-field-id');
      this.togglePlainText(passwordTarget);
    });
  }

  togglePlainText(fieldId) {
    const field = $('#' + fieldId);
    switch (field.attr('type')) {
    case 'password':
      field.attr('type', 'text');
      break;

    default:
    case 'text':
      field.attr('type', 'password');
      break;
    }
  }
}

export default new Password();
