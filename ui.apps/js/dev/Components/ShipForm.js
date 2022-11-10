class ShipForm {
  constructor() {
    this.sel = {
      // QSP = querystring parameter
      component: '.ship-now',
      firstnameInput: '#firstname', // jquery selector for input (can be eg '.firstname input')
      firstnameQSP: '?firstname', // need ? followed by parameter name
      lastnameInput: '#lastname',
      lastnameQSP: '?lastname',
      emailInput: '#email',
      emailQSP: '?email',
      userFirstnameElement: '.user-firstname'
    };

    this.init = this.init.bind(this);
    this.populateForm = this.populateForm.bind(this);
    this.showLoggedInElements = this.showLoggedInElements.bind(this);
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;

    $(window).on('userloggedin.DHL', (evt, tokenData) => {
      this.showLoggedInElements(tokenData);
    });

    this.populateForm();
    return true;
  }

  populateForm() {
    let email = url(this.sel.emailQSP);
    let firstname = url(this.sel.firstnameQSP);
    let lastname = url(this.sel.lastnameQSP);

    if (typeof email !== 'undefined') {
      $(this.sel.emailInput).val(email);
    }

    if (typeof firstname !== 'undefined') {
      $(this.sel.firstnameInput).val(firstname);

      if ($.trim(firstname).length > 0) {
        $(this.sel.userFirstnameElement).text(firstname);
      }
    }

    if (typeof lastname !== 'undefined') {
      $(this.sel.lastnameInput).val(lastname);
    }
  }

  showLoggedInElements(tokenData) {
    let firstname = url(this.sel.firstnameQSP);

    if ((typeof firstname === 'undefined') || ($.trim(firstname).length === 0)) {
      $(this.sel.userFirstnameElement).text(tokenData.name);
    }
  }
}

export default new ShipForm();
