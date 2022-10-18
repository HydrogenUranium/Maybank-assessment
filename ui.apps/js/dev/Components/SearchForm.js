class SearchForm {
  constructor() {
    this.sel = {
      component: '.search-form',
      clearButton: '.search-form__clear-icon',
      input: '.search-form__search input[type=search]'
    };

    this.init = this.init.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.clearSearchForm = this.clearSearchForm.bind(this);
  }

  init() {
    if ($(this.sel.component).length <= 0) return false;
    this.bindEvents();
    return true;
  }

  bindEvents() {
    $(document).on('click', this.sel.clearButton, () => {
      this.clearSearchForm();
    });
  }

  clearSearchForm() {
    $(this.sel.input).val('').focus();
  }
}

export default new SearchForm();
