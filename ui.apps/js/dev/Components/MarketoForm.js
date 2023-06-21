import shared from './Shared';

/**
 * Class that powers up the two 'marketo' components - inlineshipnowmarketo & inlineshipnowmarketoconfigurable.
 * Contains logic to submit both kinds of form - there are subtle, but important differences in their
 * implementation. Logic in this class is tightly coupled with the HTL templates for both AEM components. You have
 * been warned.
 */
class MarketForm {
  constructor() {
    this.sel = {
      component: '[data-marketo-form]'
    };
    this.init = this.init.bind(this);
  }


  init() {
    if ($(this.sel.component).length <= 0) {
      return false;
    }

    $(this.sel.component).each(() => this.bindEvents());

    return true;
  }


  /**
   * Simple function that determines whether we have a hidden form on the page or not
   * @param {Element} baseElement is the base element present in html stream, that is supposed to contain
   * the hidden form's properties (like munchkin & form IDs)
   * @return {boolean} true in case there *is* a 'hidden' form on the page, false otherwise
   */
  isHiddenForm(baseElement) {
    if (baseElement !== null) {
      const hiddenFormId = baseElement.getAttribute('hiddenFormId');
      if (hiddenFormId !== null && hiddenFormId !== '') {
        return true;
      }
    }
    return false;
  }

  /**
   * Helper function that tries to get an instance of Marketo form identified by several fields.
   * @param {string} formUrl is the hostname where we try to download the form from
   * @param {string} munchkinId identifies the marketo 'project'
   * @param {string} formId identifies the formID at marketo
   * @param {function} callbackFunction is a function that is to be executed upon successful calling of the Marketo
   * form (this field is optional)
   * @return {Object} new instance of Marketo form (if request was successful) or null in case either munchkinId or
   * formId were provided as nulls
   */
  loadMarketoForm(formUrl, munchkinId, formId, callbackFunction) {
    if (munchkinId !== null && formId !== null) {
      return window.MktoForms2.loadForm(formUrl, munchkinId, formId, callbackFunction);
    }
    return null;
  }

  /**
   * Simple function that builds a new FormData object out of 'another' object (although we assume that 'another'
   * object is an object of Marketo fields)
   * @param {Object} visibleFormFields is an object that contains the Marketo form fields out of which we
   * want to build the FormData object
   * @param {string} formId is the hidden formID to be sent to hidden marketo instance
   * @param {string} formStart is the 'real' destination - AEM should use this value to forward the request to this
   * destination (although that is, of course, out of scope of this javascript code)
   * @return {FormData} new instance of FormData object, ready to be sent to external URL
   */
  buildFormData(visibleFormFields, formId, formStart) {
    let formData = new FormData();
    for (const [key, value] of Object.entries(visibleFormFields)) {
      if (key.toLowerCase() === 'formId'.toLowerCase() || key.toLowerCase() === 'formvid'.toLowerCase()) {
        continue;
      }
      formData.set(key, value);
    }
    const cookie = this.findMarketoCookie();
    if (cookie !== null) {
      formData.set('user_info_cookie', cookie);
    }
    formData.set('formId', formId);
    formData.set('formStart', formStart);
    return formData;
  }

  findMarketoCookie() {
    const allCookies = document.cookie.split('; ');
    let marketoCookieValue = null;
    for (let value of allCookies) {
      if (value.toLowerCase().includes('_mkto_trk')) {
        marketoCookieValue = value;
      }
    }
    return marketoCookieValue;
  }

  async submitForm(url, form) {
    let formData;
    if (form !== null) {
      formData = form;
    }

    return await fetch(url, {
      method: 'POST',
      body: formData || ''
    });
  }

  /**
   * Method that orchestrates the submission of 'original' (visible) form on the page and if needed, then
   * submission of provided fields to AEM (to be further forwarded to second Marketo instance)
   * @param {Object} visibleForm is the visible Marketo forms object that we use as the 'main' object around
   * which all the orchestration happens. It is simple - if this object is not submitted and the response from
   * Marketo does not indicate success, no need to do anything else.
   * @param {Element} baseElement is the main element in the HTML that contains (or, should contain) the
   * information we need to figure out the potential munchkin & form id of the 'hidden' instance.
   * @return {undefined} does not return anything
   */
  processMarketoConfigurableForm(visibleForm, baseElement) {
    if (visibleForm !== null) {
      visibleForm.whenReady(originalForm => {
        $('#mktoForms2BaseStyle').remove();
        $('#mktoForms2ThemeStyle').remove();
        originalForm.onSuccess((e) => {
          const hiddenFormId = baseElement.getAttribute('hiddenFormId');
          const formSubmissionPath = baseElement.getAttribute('action');
          const formStart = baseElement.getAttribute('formstart');
          let needHiddenFormSubmission = this.isHiddenForm(baseElement);
          if (needHiddenFormSubmission &&  formStart !== null && hiddenFormId !== null && formSubmissionPath !== null && formSubmissionPath !== ' ' ) {
            let formData = this.buildFormData(e, hiddenFormId, formStart);
            shared.submitForm(formSubmissionPath, formData).then(() => console.log('Submitted'));
          }
        });
      });
    }
  }


  /**
   * Implementation of non-configurable marketo form submission of both visible & hidden forms. Logic is slightly
   * different from 'processMarketoConfigurableForm' in the way that hidden form submission happens to the *same*
   * marketo instance.
   * @param {object} visibleForm is the visible form element (MktoForms2)
   * @param {element} baseElement is the HTML element that contains the attributes we use to gather the data about
   * the Marketo instance(s)
   * @param {string} visibleFormHost is the URL where we can 'find' the visible form
   * @return {void} does not return
   */
  processMarketoNonConfigurableForm(visibleForm, baseElement, visibleFormHost) {
    if (visibleForm !== null) {
      visibleForm.whenReady(originalForm => {
        $('#mktoForms2BaseStyle').remove();
        $('#mktoForms2ThemeStyle').remove();
        originalForm.onSuccess((e) => {
          const hiddenFormId = baseElement.getAttribute('hiddenFormId');
          const hiddenMunchkinId = baseElement.getAttribute('hiddenMunchkinId');
          if (hiddenFormId !== null && hiddenMunchkinId !== null) {
            let hiddenForm = this.loadMarketoForm(visibleFormHost, hiddenMunchkinId, hiddenFormId);
            let formValues = new Map();
            for (const [key, value] of Object.entries(e)) {
              if (key.toLowerCase() === 'formId'.toLowerCase() || key.toLowerCase() === 'formvid'.toLowerCase()) {
                continue;
              }
              formValues.set(key, value);
            }
            hiddenForm.addHiddenFields(formValues);
            hiddenForm.submit();
          }
        });
      });
    }
  }

  processMarketoSignUpForm(form) {
    form.whenReady(() => {
      $('#mktoForms2BaseStyle').remove();
      $('#mktoForms2ThemeStyle').remove();
    });
  }


  async bindEvents() {
    const baseElement = document.querySelector('div[data-marketo-form]');
    const visibleFormBase = document.querySelector('div[data-marketo-visible-form]');
    if (baseElement) {
      const munchkinId = baseElement.getAttribute('munchkinid');
      const formId = baseElement.getAttribute('formid');
      const source = baseElement.getAttribute('source');
      const visibleFormHost = baseElement.getAttribute('formHost') !== null ? baseElement.getAttribute('formHost') : 'https://express-resource.dhl.com';
      let visibleForm = this.loadMarketoForm(visibleFormHost, munchkinId, formId);

      if (visibleForm !== null && source !== null && source === 'noconf') {
        this.processMarketoNonConfigurableForm(visibleForm, baseElement, visibleFormHost);
      } else if (visibleForm !== null && munchkinId !== null && formId !== null && visibleFormBase !== null) {
        this.processMarketoConfigurableForm(visibleForm, baseElement);
      } else if (source !== null && source === 'signup') {
        const hiddenFormId = baseElement.getAttribute('hiddenformid');
        const hiddenMunchkinId = baseElement.getAttribute('hiddenmunchkinid');
        const formHost = baseElement.getAttribute('formHost');
        let signupForm = this.loadMarketoForm(formHost, hiddenMunchkinId, hiddenFormId);
        if (signupForm !== null) {
          this.processMarketoSignUpForm(signupForm);
        }
      }
    }
  }
}

export default new MarketForm();
