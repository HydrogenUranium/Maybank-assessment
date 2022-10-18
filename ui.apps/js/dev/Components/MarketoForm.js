
class MarketForm {
  constructor() {
    this.sel = {
      component: '[data-marketo-form]',
    };
    this.init = this.init.bind(this);
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;

    $(this.sel.component).each((index, element) => this.bindEvents(element, index));

    return true;
  }

  bindEvents(elem) {

    const $elem = $(elem);

    const $form = $elem.find('[data-marketo-visible-form]');

    // visible form
    const $marketoForm = $form.find('form');
    const marketoFormAttr = $marketoForm ? $marketoForm.attr('id') : '';
    const marketoFormId = marketoFormAttr ? marketoFormAttr.replace('mktoForm_', '') : '';

    const _public = {};

    let loadedForms = []

    const form = $elem.attr('data-marketo-form');

    const hiddenSettings = form ? JSON.parse(form) : null;

    if (marketoFormId.length !== 0) {

      MktoForms2.whenReady(function(mktoForm) {
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

            if (!hiddenSettings) {
              return
            }

            MktoForms2.loadForm("//express-resource.dhl.com", hiddenSettings.hiddenMunchkinId, hiddenSettings.hiddenFormId, function(hiddenForm) {
              
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
      MktoForms2.whenReady(function(mktoForm) {
        $('#mktoForms2BaseStyle').remove();
        $('#mktoForms2ThemeStyle').remove();
      })
    }
    return true;
  }
}

export default new MarketForm();
