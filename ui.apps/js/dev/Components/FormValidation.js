import PasswordValidity from './PasswordValidity';

class FormValidation {
  constructor() {
    this.sel = {
      component: '.forms'
    };

    this.init = this.init.bind(this);
    this.validate = this.validate.bind(this);
    this.addPasswordCheck = this.addPasswordCheck.bind(this);
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;

    this.addPasswordCheck();
    this.validate();
    return true;
  }

  addPasswordCheck() {
    $.validator.addMethod('passwordCheck', (value) => {
      return PasswordValidity.isPasswordValid(value);
    }, 'Please enter a valid password');
  }

  validate() {
    $(this.sel.component).validate({
      rules: {
        'required': {
          required: true
        },
        'password': {
          passwordCheck: true
        }
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
      }
    });
  }
}

export default new FormValidation();
