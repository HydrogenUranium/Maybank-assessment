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

    const country = $(this.sel.form).data('preselectcountry');
    if ((country !== null) && $.trim(country).length > 0) {
      $(this.sel.countryselect).val(country).trigger('change');
    }
  }

  /**
   * Method that validates all the form elements
   * @return {boolean} true if all elements have been validated successfully or false if not
   */
  validate() {
    let form = document.getElementById('glb-shipnow-form');
    if (form) {
      let formElements = form.elements;

      const validationResult = new Map();
      for (const formElement of formElements ) {
        let name = formElement.getAttribute('name');
        validationResult.set(name, this.validateField(formElement));
      }
      const validationResultValues = [...validationResult.values()];
      return validationResultValues.includes(false);
    }
    return false;
  }

  /**
   * Simple method that validates the provided element according to its type, currently it recognizes these types:
   * <i>email</i> & <i>tel</i>; every other field type is treated as <i>text</i>. If the element's value is considered
   * 'invalid',
   * <b>error</b> class is added, otherwise <b>valid</b> is added
   // eslint-disable-next-line valid-jsdoc
   * @param elementToValidate DOM element we want to validate
   * @return boolean true or false depending on the validation result of one specific field
   * @param {Element|{pattern: *, flags: *, raw: *, type: string, value: *}} elementToValidate
   */
  validateField(elementToValidate) {
    let fieldType = elementToValidate.type;
    let fieldValue = elementToValidate.value.trim();

    let validationResult;
    switch (fieldType) {
    case 'email':
      validationResult = this.validateEmailField(fieldValue);
      break;
    case 'tel':
      validationResult = this.validatePhoneNumber(fieldValue);
      break;
    default:
      validationResult = this.validateTextField(fieldValue);
    }


    if (!validationResult) {
      this.failValidation(elementToValidate);
      return false;
    }
    this.completeValidation(elementToValidate);
    return true;
  }

  /**
   * Marks the validation of individual form field as 'invalid' by adding a CSS class 'error' to it. <br />If the
   * element
   * already contains css class 'valid', we replace it with error.<br /> If the element does not contain any class,
   * we simply add 'error'
   * @param element is the element we're assessing
   */
  failValidation(element) {
    this.modifyCssClass(element, 'error', 'valid');
    let labelElement = this.getLabel(element);
    if (labelElement === null) {
      element.after(this.createErrorLabel(element));
      labelElement = this.getLabel(element);
    }
    this.updateLabelMessage(element, labelElement);
  }

  updateLabelMessage(sourceElement, labelElement) {
    let sourceElementMessage = sourceElement.getAttribute('data-msg');
    if (sourceElementMessage === null) {
      sourceElementMessage = 'Field is mandatory';
    }
    if (labelElement !== null || typeof labelElement !== 'undefined') {
      labelElement.textContent = sourceElementMessage;
    }
  }

  createErrorLabel(inputElement) {
    let elementId = inputElement.id;
    let errorMessage = inputElement.getAttribute('data-msg');
    if (!errorMessage) {
      errorMessage = 'This field is mandatory!';
    }

    let labelElement = document.createElement('label');
    let labelTextNode = document.createTextNode(errorMessage);
    labelElement.classList.add('error');
    labelElement.setAttribute('for', elementId);

    labelElement.appendChild(labelTextNode);
    return labelElement;
  }

  modifyCssClass(element, classToAdd, classToRemove) {
    if (element.classList.contains(classToRemove)) {
      element.classList.replace(classToRemove, classToAdd);
    }
    element.classList.add(classToAdd);
  }

  removeCssClass(element, classToRemove) {
    if (element) {
      element.classList.remove(classToRemove);
    }
  }

  addCssClass(element, classToAdd) {
    if (element) {
      element.classList.add(classToAdd);
    }
  }

  /**
   * Marks the validation of individual form field as 'valid' by adding a CSS class 'valid' to it. <br />If the
   * element
   * already contains css class 'error', we replace it with valid.<br /> If the element does not contain any class,
   * we simply add 'valid'
   * @param element is the element we're assessing
   */
  completeValidation(element) {
    this.modifyCssClass(element, 'valid', 'error');
    let labelElement = this.getLabel(element);
    if (labelElement !== null) {
      labelElement.remove();
    }
  }

  getLabel(formInputElement) {
    let labelElement = formInputElement.nextElementSibling;
    if (labelElement) {
      let tag = labelElement.tagName;
      if (tag.toLocaleLowerCase() === 'label') {
        return labelElement;
      }
    }
    return null;
  }

  /**
   * Provides the validation of input type 'text' - in reality it 'just' checks if the provided string has
   * any value...
   * @param stringToValidate is a {@code String} value we wish to validate
   * @returns {boolean} true if we think the provided string is a valid one
   */
  validateTextField(stringToValidate) {
    return stringToValidate !== null && stringToValidate.length !== 0;
  }

  /**
   * Attempts to verify if the provided string matches the regular expression for email
   * @param emailToValidate is the string we want to validate
   * @returns {boolean} true if the provided value matches the email regular expression or false if not
   */
  validateEmailField(emailToValidate) {
    let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return !!emailToValidate.match(emailRegex);
  }

  /**
   * Validates the provided string as phone number
   * @param phoneToValidate is a String to validate (phone number can contain other characters than just digits
   * @returns {boolean} true if validate is successful, else it returns false
   */
  validatePhoneNumber(phoneToValidate) {
    let phoneRegex = new RegExp('((\\(\\d{3,4}\\)( )?)|\\d{3,4}( )?)?[- ./]?( )?\\d{3,4}?( )?[- ./]?( )?\\d{3,4}?( )?$');
    return phoneRegex.test(phoneToValidate);
  }

  toggleAddress(_e) {
    let val = $(this.sel.countryselect).val();

    let options = $('option', this.sel.countryselect);
    let mandatory = true;
    options.each((_index, item) => {
      if ($(item).attr('value') === val && ('' + $(item).data('nonmandatory')) === 'true') {
        mandatory = false;
      }
    });

    if (mandatory) {
      $('#shipnow_address', this.sel.form).attr('required', 'required').attr('placeholder', 'Address*');
      $('#shipnow_zip', this.sel.form).attr('required', 'required').attr('placeholder', 'ZIP or Postcode*');
      $('#shipnow_city', this.sel.form).attr('required', 'required').attr('placeholder', 'City*');
    } else {
      $('#shipnow_address', this.sel.form)
        .removeAttr('required')
        .attr('placeholder', 'Address')
        .removeClass('error')
        .closest('div')
        .find('label').remove();
      $('#shipnow_zip', this.sel.form)
        .removeAttr('required')
        .attr('placeholder', 'ZIP or Postcode')
        .removeClass('error')
        .closest('div')
        .find('label')
        .remove();
      $('#shipnow_city', this.sel.form)
        .removeAttr('required')
        .attr('placeholder', 'City')
        .removeClass('error')
        .closest('div')
        .find('label')
        .remove();
    }
  }

  submitForm(e) {
    e.preventDefault();
    let canSubmit = this.validate();
    if (canSubmit) {
      let $form = $(e.target);
      let formData = this.getFormData($form);
      $.post(this.getPathPrefix() + $form.attr('action'), formData, (data) => {
        if (data.status === 'OK') {
          this.showSuccess();
        } else {
          this.showError(data.fields);
        }
      });
    }
    return false;
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

  /**
   * Helper function that should go through the json response and detect if there is any error (errors should come
   * as array)
   * @param errors
   */
  showError(errors) {
    if (Array.isArray(errors)) {
      for (let error of errors) {
        let validationErrorString = error.field;
        let elementId = 'shipnow_' + this.getFirstWord(validationErrorString);
        let element = document.getElementById(elementId);
        if (element) {
          this.failValidation(element);
        }
      }
    }
  }

  getFirstWord(strintToSplit) {
    return strintToSplit.split(' ')[0];
  }

  init() {
    if ($(this.sel.form).length <= 0) {
      return false;
    }
    this.registerEventListeners();
    this.bindEvents();
    return true;
  }

  registerEventListeners() {
    const elementsToValidate = [
      'shipnow_firstname',
      'shipnow_lastname',
      'shipnow_companyname',
      'shipnow_phone',
      'shipnow_address',
      'shipnow_zip',
      'shipnow_city',
      'shipnow_email'
    ];

    for (const elementToValidate of elementsToValidate) {
      let element = document.getElementById(elementToValidate);
      if (element) {
        element.addEventListener('blur', () => {
          this.validateField(element);
        });
      }
    }
  }
}

export default new ShipNowForm();
