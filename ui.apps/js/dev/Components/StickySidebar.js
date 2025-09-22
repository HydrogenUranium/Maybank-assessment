class StickySidebar {

  init() {
    this.stickySidebarEvents();
  }

  stickySidebarEvents() {
    const sidebar = document.querySelector('.cmp-article-container__sidebar-wrapper');
    const sidebarContent = sidebar.querySelector('.sidebar-cmp-with-sticky-element');
    if (!sidebar) return;

    const handleScroll = () => {
      const currentTopOffset = this.calculateTopOffset();
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;


      const sidebarRect = document.getElementsByClassName('cmp-article-container__sidebar-wrapper')[0];
      const contentHeight = sidebarContent.scrollHeight;
      const sidebarTop = sidebarRect.getBoundingClientRect().top + scrollY;

      if(scrollY >= contentHeight - viewportHeight +sidebarTop) {
        sidebarContent.style.top = `${currentTopOffset}px`;
        sidebarContent.style.overflowY = 'auto';
        sidebarContent.style.height = 'fit-content';
        sidebarContent.style.zIndex = '10';
        sidebarContent.style.scrollBehavior = 'smooth';
      } else {
        sidebarContent.style.top = '';
        sidebarContent.style.zIndex = '';
        sidebarContent.style.overflowY = '';
      }
    };
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    this.cleanup = () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }

  calculateTopOffset() {
    const header = document.querySelector('header, .header, .cmp-header, [class*="header"]');

    if (header) {
      const headerHeight = header.offsetHeight;
      const headerRect = header.getBoundingClientRect();

      if (headerRect.top < 0) {
        return 8;
      } else if (headerRect.top >= 0 && headerRect.top < headerHeight) {
        const visibleHeaderHeight = headerHeight - Math.abs(headerRect.top);
        return Math.max(visibleHeaderHeight + 4, 8);
      } else {
        return Math.max(headerHeight * 0.1, 12);
      }
    }
    return 8;
  }
}

export default new StickySidebar();
