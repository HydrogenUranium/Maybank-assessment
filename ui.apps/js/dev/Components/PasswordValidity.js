class PasswordValidityApi {
  constructor() {
    this.checkCasing = this.checkCasing.bind(this);
    this.checkSpecial = this.checkSpecial.bind(this);
    this.checkNumber = this.checkNumber.bind(this);
    this.checkLength = this.checkLength.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  isValid(password) {
    const isLengthValid = this.checkLength(password);
    const isCasingValid = this.checkCasing(password);
    const isSpeicalValid = this.checkSpecial(password);
    const isNumberValid = this.checkNumber(password);

    const result = {
      isValid: isLengthValid && isCasingValid && isSpeicalValid && isNumberValid,
      isLengthValid,
      isCasingValid,
      isSpeicalValid,
      isNumberValid
    };

    return result;
  }

  checkLength(password) {
    return password.length >= 8;
  }

  checkCasing(password) {
    return /^(?=.*[a-z]).+$/.test(password) && /^(?=.*[A-Z]).+$/.test(password);
  }

  checkNumber(password) {
    return /^(?=.*[0-9]).+$/.test(password);
  }

  checkSpecial(password) {
    return /^(?=.*[!£%&*()={}@#><]).+$/.test(password);
  }
}


// I've assumed there will only be one password validity checker on a page at once, because:
// - the validity checker would only be on the main password entry field and not the confirmation
// - a user wouldn't be setting more than one password at once
class PasswordValidity {
  constructor() {
    this.sel = {
      component: '.validity-checks'
    };

    this.passwordApi = new PasswordValidityApi();
    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    return true;
  }

  bindEvents() {
    const passwordFieldId = $(this.sel.component).attr('data-field-id');
    const passwordField = $('#' + passwordFieldId);

    $(document).on('keyup keypress change', '#' + passwordFieldId, () => {
      let password = passwordField.val();
      this.checkPasswordValidity(password);
    });
  }

  isPasswordValid(password) {
    let result = this.passwordApi.isValid(password);
    return result.isValid;
  }

  checkPasswordValidity(password) {
    let result = this.passwordApi.isValid(password);

    if (result.isLengthValid) {
      $('[data-check=length]').addClass('is-valid');
    } else {
      $('[data-check=length]').removeClass('is-valid');
    }

    if (result.isCasingValid) {
      $('[data-check=casing]').addClass('is-valid');
    } else {
      $('[data-check=casing]').removeClass('is-valid');
    }

    if (result.isSpeicalValid) {
      $('[data-check=special]').addClass('is-valid');
    } else {
      $('[data-check=special]').removeClass('is-valid');
    }

    if (result.isNumberValid) {
      $('[data-check=number]').addClass('is-valid');
    } else {
      $('[data-check=number]').removeClass('is-valid');
    }
  }
}

export default new PasswordValidity();
