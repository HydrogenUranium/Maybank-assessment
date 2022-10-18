class ShowcasePanel {
  constructor($element) {
    this.$element = $element;
    this.sel = {
      carousel: '.animatedShowcasePanel__carousel',
      items: '.animatedShowcasePanel__carouselItem',
      stackedItems: '.animatedShowcasePanel__carouselItem:not(.animatedShowcasePanel__carouselItem--hidden)',
      navigation: '.animatedShowcasePanel__carouselNavigation',
      navigationItem: '.animatedShowcasePanel__carouselNavigationItem'
    };

    this.bindEvents = this.bindEvents.bind(this);
    this.doHide = this.doHide.bind(this);
    this.doShow = this.doShow.bind(this);
    this.showItem = this.showItem.bind(this);
    this.scaleItems = this.scaleItems.bind(this);
    this.createNavigation = this.createNavigation.bind(this);
    this.init = this.init.bind(this);
    this.init();
  }

  bindEvents() {
    this.$element.find(this.sel.items).swipe({
      swipe: (event, direction) => {
        let $item = ($(event.target).hasClass('animatedShowcasePanel__carouselItem')) ? $(event.target) : $(event.target).parents(this.sel.items);
        let index = $item.index();
        if (direction === 'left') {
          this.showItem(index + 1);
        } else if (direction === 'right') {
          this.showItem(index - 1);
        }
      },
      allowPageScroll: 'vertical'
    });
    this.$element.on('click', this.sel.navigationItem, (e) => {
      e.preventDefault();
      this.showItem($(e.target).index());
    });
  }

  doHide($item) {
    $item.addClass('animatedShowcasePanel__carouselItem--hidden');
    setTimeout(() => {
      $item.hide();
    }, 250);
    this.scaleItems();
  }

  doShow($item) {
    $item.show(() => {
      $item.removeClass('animatedShowcasePanel__carouselItem--hidden');
      this.scaleItems();
    });
  }

  showItem(index) {
    // Index can't be less than 0
    index = Math.max(index, 0);
    // Index can't be more than the number of items
    index = Math.min(index, (this.$element.find(this.sel.items).length - 1));
    // Find the current position
    let currentIndex = this.$element.find(this.sel.stackedItems).first().index();
    // Get the number of items to move
    let offset = currentIndex - index;
    // Loop the number of the offset
    for (let i = 0; i < Math.abs(offset); i++) {
      // The action to etheir show or hide depending on direction
      let action = this.doHide;
      // The item index depending on direction
      let itemIndex = currentIndex + i;
      // If should be showing items
      if (offset > 0) {
        // Change action
        action = this.doShow;
        // Change index
        itemIndex = currentIndex - (i + 1);
      }
      // Get the item at the index
      let $item = this.$element.find(this.sel.items).eq(itemIndex);
      // Run the action with a timeout
      setTimeout(action, 250 * i, $item);
    }
    // Remove active navigation item
    this.$element.find(this.sel.navigation).find('.active').removeClass('active');
    // Set the correct nagivation item to active
    this.$element.find(this.sel.navigationItem).eq(index).addClass('active');
  }

  scaleItems() {
    this.$element.find(this.sel.stackedItems).each((index, element) => {
      let $item = $(element);
      // No transform for first item
      if (index === 0) {
        $item.css('transform', 'none');
        return;
      }
      // Calculate the scale, 5% smaller for each item
      let scale = 1 - (0.05 * index);
      // Calculate how far to move the item right, should be 15px but needs to account for scale
      let translate = parseInt(15 * (1 + (0.05 * index)), 10) * index;
      // Update the item
      $item.css('transform', 'scale(' + scale + ') translateX(' + translate + 'px)');
    });
    // Add ready class to carousel
    this.$element.find(this.sel.carousel).addClass('animatedShowcasePanel__carousel--ready');
  }

  createNavigation() {
    if (this.$element.find(this.sel.navigation).length > 0) return;
    let navItems = '';
    this.$element.find(this.sel.items).each((index) => {
      navItems += '<li class="animatedShowcasePanel__carouselNavigationItem' + (index === 0 ? ' active' : '') + '"></li>';
    });
    this.$element.find(this.sel.carousel).after('<ol class="animatedShowcasePanel__carouselNavigation">' + navItems + '</ol>');
  }

  init() {
    this.bindEvents();
    this.createNavigation();
    this.scaleItems();
  }
}

class AnimatedShowcasePanel {
  constructor() {
    this.sel = {
      component: '.animatedShowcasePanel'
    };
    this.panels = [];

    this.init = this.init.bind(this);
  }

  init() {
    if ($(this.sel.component).length <= 0) return;
    // For each component, create a showcase panel
    $(this.sel.component).each((index, element) => this.panels.push(new ShowcasePanel($(element))));
  }
}

export default new AnimatedShowcasePanel();
