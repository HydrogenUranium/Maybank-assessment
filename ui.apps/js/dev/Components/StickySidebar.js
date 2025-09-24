class StickySidebar {

  init() {
    this.stickySidebarEvents();
  }

  stickySidebarEvents() {
    const sticky = document.querySelector('.sticky');
    const header = document.querySelector('header');

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const oldClass = mutation.oldValue || "";
          const newClass = mutation.target.className;

          if (oldClass !== newClass) {
            const headerHeight = header?.offsetHeight;
            const isHeaderVisible = header && !header.classList.contains('sticky-header--hidden');
            if (isHeaderVisible) {
              sticky.style.top = `${headerHeight}px`;
            } else if (sticky) {
              sticky.style.top = '';
            }
          }
        }
      }
    });

    observer.observe(header, {
      attributes: true,
      attributeFilter: ["class"],
      attributeOldValue: true
    })

  }

}

export default new StickySidebar();
