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
    this.originalFormValues = {};
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
   * Simple function that determines whether we should submit the lead to hidden form via AEM and REST API or not
   * @param {Element} baseElement is the base element present in html stream, that is supposed to contain
   * the hidden form's properties (like munchkin & form IDs)
   * @return {boolean} true in case there *is* a 'hidden' form on the page and *apiSubmit* attribute is set to true, false otherwise
   */
  isValidAPISubmission(baseElement) {
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
   * form (this field is optional)
   * @return {Object} new instance of Marketo form (if request was successful) or null in case either munchkinId or
   * formId were provided as nulls
   */
  loadMarketoForm(formUrl, munchkinId, formId) {
    window.MktoForms2.loadForm(formUrl, munchkinId, formId);
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
   * which all the orchestration happens. It is simple - if this object is not submitted and the response from
   * Marketo does not indicate success, no need to do anything else.
   * @param {Element} baseElement is the main element in the HTML that contains (or, should contain) the
   * information we need to figure out the potential munchkin & form id of the 'hidden' instance.
   * @return {undefined} does not return anything
   */
  processMarketoConfigurableForm( baseElement) {
    const munchkinId = baseElement.getAttribute('munchkinid');
    const formId = baseElement.getAttribute('formid');
    const visibleFormHost = baseElement.getAttribute('formHost') !== null ? baseElement.getAttribute('formHost') : 'https://express-resource.dhl.com';
    this.loadMarketoForm(visibleFormHost, munchkinId, formId);
    window.MktoForms2.whenReady(originalForm => {
      $('#mktoForms2BaseStyle').remove();
      $('#mktoForms2ThemeStyle').remove();
      // eslint-disable-next-line no-unused-vars
      originalForm.onSuccess((values, thankYouUrl) => {
        const hiddenFormId = baseElement.getAttribute('hiddenFormId');
        const formSubmissionPath = baseElement.getAttribute('action');
        const formStart = baseElement.getAttribute('formstart');
        let needHiddenFormSubmission = this.isValidAPISubmission(baseElement);
        if (needHiddenFormSubmission &&  formStart !== null && hiddenFormId !== null && formSubmissionPath !== null && formSubmissionPath !== ' ' ) {
          let formData = this.buildFormData(values, hiddenFormId, formStart);
          shared.submitForm(formSubmissionPath, formData).then(response => {
            if (response.status == 202) {
              console.log('Second submission was a success');
            }
            this.handleRedirect(baseElement, thankYouUrl);
          });
        } else {
          this.handleRedirect(baseElement, thankYouUrl);
        }
        return false;
      });
    });
  }

  /**
    * Method that handles the redirect to the 'thank you' page. It is a simple function that creates a virtual
    * link, sets its attributes and clicks it. It can be used to trigger analytics events, for example.
    * @param {Element} baseElement is the main element in the HTML that contains (or, should contain) the
    * information we need to figure out the potential munchkin & form id of the 'hidden' instance.
    * @param {string} url is the URL to which we want to redirect the user
    * @return {undefined} does not return anything
    */

  handleRedirect(baseElement, url) {
    const virtualLink = document.createElement('a');
    virtualLink.href = url;
    virtualLink.target = '_self';
    virtualLink.style.display = 'none';

    const attributes = baseElement.getAttributeNames();
    attributes.forEach(attr => {
        virtualLink.setAttribute(attr, baseElement.getAttribute(attr));
    });

    document.body.appendChild(virtualLink);

    virtualLink.click();
  }


  /**
   * Implementation of non-configurable marketo form submission of both visible & hidden forms. Logic is slightly
   * different from 'processMarketoConfigurableForm' in the way that hidden form submission happens to the *same*
   * marketo instance.
   * @param {element} baseElement is the HTML element that contains the attributes we use to gather the data about
   * the Marketo instance(s)
   * @return {void} does not return
   */
  processMarketoNonConfigurableForm( baseElement) {
    const hiddenFormId = baseElement.getAttribute('hiddenFormId');
    const hiddenMunchkinId = baseElement.getAttribute('hiddenMunchkinId');
    const formHost = baseElement.getAttribute('formHost');
    window.MktoForms2.whenReady(marketoForm => {
      $('#mktoForms2BaseStyle').remove();
      $('#mktoForms2ThemeStyle').remove();
      const loadedFormId = marketoForm.getId();
      const formId = baseElement.getAttribute('formid');
      const isForm = loadedFormId.toString() === formId.toString();
      if (isForm) {
        marketoForm.onSuccess((e) => {
          window.MktoForms2.loadForm(formHost, hiddenMunchkinId, hiddenFormId, function (hiddenForm) {
            const submittedData = $.extend(e, hiddenForm.getValues());
            hiddenForm.addHiddenFields(submittedData);
            hiddenForm.submit();
          });
        });
      }
    });
  }


  /**
   * Provides an instance of MktoForms2 form with the provided ID
   * @param {string} hostname is the Marketo hostname
   * @param {string} munchkinId is the Marketo form's munchkin id
   * @param {string} formId is the ID of the form
   * @return {*} existing or new instance of Marketo form
   */
  getMarketoForm(hostname, munchkinId, formId) {
    let form = window.MktoForms2.getForm(formId);
    if (typeof form === 'undefined') {
      this.loadMarketoForm(hostname, munchkinId, formId, function (marketoForm) {
        return marketoForm;
      });
    }
    return form;
  }

  processMarketoSignUpForm(baseElement) {
    const hiddenFormId = baseElement.getAttribute('formId');
    const hiddenMunchkinId = baseElement.getAttribute('munchkinId');
    const formHost = baseElement.getAttribute('formHost');
    this.loadMarketoForm(formHost, hiddenMunchkinId, hiddenFormId);
    window.MktoForms2.whenReady(() => {
      $('#mktoForms2BaseStyle').remove();
      $('#mktoForms2ThemeStyle').remove();
    });
  }


  async bindEvents() {
    const baseElement = document.querySelector('div[data-marketo-form]');
    if (baseElement) {
      const source = baseElement.getAttribute('source');
      if (source !== null && source === 'noconf') {
        this.processMarketoNonConfigurableForm( baseElement);
      } else if (source !== null && source === 'conf') {
        this.processMarketoConfigurableForm( baseElement);
      } else if (source !== null && source === 'signup') {
        this.processMarketoSignUpForm(baseElement);
      }
    }
  }
}

export default new MarketForm();
