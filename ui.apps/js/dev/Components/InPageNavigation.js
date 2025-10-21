import Strings from '../Helpers/Strings';

class InPageNavigation {
  constructor() {
    this.sel = {
      component: '.inPageNavigation',
      list: '.inPageNavigation__list',
      listItems: '.inPageNavigation__item',
      links: '.inPageNavigation__link',
      sections: '.inPageNavigationSection',
      sectionTitle: '.inPageNavigationSection__title'
    };
    this.templateMarkup = '<li class="inPageNavigation__item"><a class="inPageNavigation__link" href=""></a></li>';
    this.sectionOffsets = [];
    this.componentHeight = 0;
    this.bottomLimit = 0;

    this.bindEvents = this.bindEvents.bind(this);
    this.populateItems = this.populateItems.bind(this);
    this.addOffset = this.addOffset.bind(this);
    this.positionComponent = this.positionComponent.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.calculateValues = this.calculateValues.bind(this);
    this.init = this.init.bind(this);
  }

  bindEvents() {
    document.addEventListener('scroll', this.handleScroll, {passive: true});
    $(document).on('click', this.sel.links, this.handleLinkClick);
    $(window).on('stop.resize', this.calculateValues);
  }

  populateItems() {
    let $sections = [];
    $(this.sel.sections).each((index, elm) => {
      let randomId = Strings.id();
        $(elm).attr('id', randomId);

        let $item = $(this.templateMarkup);
        let $link = $item.find('.inPageNavigation__link');

        $link.attr('href', '#' + randomId);

        // Check if elm has data-section-title
        let sectionTitle = $(elm).data('section-title');
        if (sectionTitle) {
          $link.attr('aria-label', sectionTitle);
        }

        $sections.push($item);
        this.addOffset($(elm));
    });
    $(this.sel.list).html('').append($sections);
    $(this.sel.listItems).first().find(this.sel.links).addClass('inPageNavigation__link--active');
    this.positionComponent();
    // Sort offsets to last first
    this.sectionOffsets.sort((a, b) => {
      if (a.top > b.top) {
        return -1;
      } else if (b.top > a.top) {
        return 1;
      }
      return 0;
    });
    this.calculateValues();
  }

  calculateValues() {
    // Get the height of the component
    this.componentHeight = $(this.sel.list).height();
    // Get the maximum distance from the top of the document the component can move
    this.bottomLimit = $('footer').offset().top - 80;
  }

  addOffset($elm) {
    let top = $elm.offset().top;
    let id = $elm.attr('id');
    this.sectionOffsets.push({
      top: top,
      id: id
    });
  }

  positionComponent() {
    let topPosition = $(this.sel.sections).first().offset().top;
    $(this.sel.component).css('top', topPosition + 'px');
  }

  handleScroll() {
    // Get the current scroll position
    let scrollPosition = $(window).scrollTop();
    // Calculate the bottom position of the list using scroll position not element position.  If use element position it changes because we affix it
    let bottomPosition = scrollPosition + (window.innerHeight / 2) + (this.componentHeight / 2);
    // If the list position is on or below the limit
    if (bottomPosition >= this.bottomLimit) {
      // Affix it
      $(this.sel.component).addClass('inPageNavigation--affix').find(this.sel.list).css('top', (this.bottomLimit - this.componentHeight) + 'px');
    } else {
      // Un-affix it
      $(this.sel.component).removeClass('inPageNavigation--affix').find(this.sel.list).css('top', '');
    }
    // Get the inner height of the window
    let windowHeight = window.innerHeight;
    // For each section in the page
    for (let i = 0; i < this.sectionOffsets.length; i++) {
      // Get this section info
      let section = this.sectionOffsets[i];
      // If section is 33.33% from top of viewport, activate it's nav item
      if ((scrollPosition + (windowHeight * 0.33)) >= section.top) {
        // Remove the active class from any other nav item
        $(this.sel.links).removeClass('inPageNavigation__link--active');
        // Add active class to this item
        $(this.sel.links).filter('[href="#' + section.id + '"]').addClass('inPageNavigation__link--active');
        // Stop checking other sections, it's in reverse order
        return;
      }
    }
  }

  handleLinkClick(e) {
    e.preventDefault();
    let targetId = $(e.target).attr('href');
    let scrollPosition = $(targetId).offset().top;
    $('html,body').animate({
      scrollTop: scrollPosition
    }, 300);
  }

  init() {
    if ($(this.sel.component).length <= 0) return;
    this.bindEvents();
    this.populateItems();
  }
}

export default new InPageNavigation();
