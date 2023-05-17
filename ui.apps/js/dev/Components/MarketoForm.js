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

  loadMarketoForm(formUrl, munchkinId, formId, callbackFunction) {
    return window.MktoForms2.loadForm(formUrl, munchkinId, formId, callbackFunction);
  }

  /**
   * Simple function that builds a new FormData object out of 'another' object (although we assume that 'another'
   * object is an object of Marketo fields)
   * @param {Object} visibleFormFields is an object that contains the Marketo form fields out of which we
   * want to build the FormData object
   * @param {string} formId is the hidden formID to be sent to hidden marketo instance
   * @return {FormData} new instance of FormData object, ready to be sent to external URL
   */
  buildFormData(visibleFormFields, formId) {
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
    return formData;
  }

  findMarketoCookie() {
    const allCookies = document.cookie.split('; ');
    let marketoCookieValue = null;
    for (let i = 0; i < allCookies.length; i++) {
      if (allCookies[i].toLowerCase().includes('_mkto_trk')) {
        marketoCookieValue = allCookies[i];
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
  processVisibleForm(visibleForm, baseElement) {
    visibleForm.whenReady(originalForm => {
      $('#mktoForms2BaseStyle').remove();
      $('#mktoForms2ThemeStyle').remove();
      originalForm.onSuccess((e) => {
        const hiddenFormId = baseElement.getAttribute('hiddenFormId');
        let needHiddenFormSubmission = this.isHiddenForm(baseElement);
        if (needHiddenFormSubmission &&  hiddenFormId !== null ) {
          let formData = this.buildFormData(e, hiddenFormId);
          this.submitForm('/conf/dhl/api/submit.marketo.html', formData).then(r => console.log(r));
        }
      });
    });
  }

  async bindEvents() {
    const baseElement = document.querySelector('div[data-marketo-form]');
    const visibleFormBase = document.querySelector('div[data-marketo-visible-form]');
    if (baseElement) {
      const munchkinId = baseElement.getAttribute('munchkinid');
      const formId = baseElement.getAttribute('formid');
      if (munchkinId !== null && formId !== null && visibleFormBase !== null) {
        let visibleForm = this.loadMarketoForm('https://express-resource.dhl.com', munchkinId, formId);
        this.processVisibleForm(visibleForm, baseElement);
      }
    }


    // this.getForms(visibleFormBase, hiddenFormBase, formAttributes);


    /*
    const $form = baseElement.find('[data-marketo-visible-form]');

    // visible form
    const $marketoForm = $form.find('form');
    const marketoFormAttr = $marketoForm ? $marketoForm.attr('id') : '';
    const marketoFormId = marketoFormAttr ? marketoFormAttr.replace('mktoForm_', '') : '';

    let loadedForms = [];

    const hiddenFormId = baseElement.getAttribute('hiddenFormId');
    const hiddenMunchkinId = baseElement.getAttribute('hiddenMunchkinId');
    let showHiddenForm = this.shouldShowHiddenForm(baseElement);
    if (marketoFormId.length !== 0) {
      MktoForms2.whenReady(mktoForm => {
        $('#mktoForms2BaseStyle').remove();
        $('#mktoForms2ThemeStyle').remove();

        const formId = mktoForm.getId();

        if (loadedForms.indexOf(formId.toString()) !== -1) {
          return;
        }

        if (formId.toString() === marketoFormId.toString()) {
          loadedForms.push(formId.toString());
        }

        const isform = mktoForm.getId().toString() === marketoFormId.toString();

        if (isform) {
          mktoForm.onSuccess((e) => {
            if (!showHiddenForm) {
              return;
            }

            MktoForms2.loadForm('https://express-resources.dhl.com', hiddenMunchkinId, hiddenFormId, function (hiddenForm) {
              console.log('formLoaded', hiddenForm, e);

              const mktoFieldsObj = $.extend(e, hiddenForm.getValues());

              hiddenForm.addHiddenFields(mktoFieldsObj);
              hiddenForm.submit();

              hiddenForm.onSubmit((e) => {
                console.log('second form submit...', e.getValues());
                return false;
              });

              hiddenForm.onSuccess((e) => {
                console.log('second form success...');
                return true;
              });
            });

            return false;
          });
        }
      });
    } else {
      MktoForms2.whenReady(function (mktoForm) {
        $('#mktoForms2BaseStyle').remove();
        $('#mktoForms2ThemeStyle').remove();
      });
    }
    return true;
    */
  }
}

export default new MarketForm();
