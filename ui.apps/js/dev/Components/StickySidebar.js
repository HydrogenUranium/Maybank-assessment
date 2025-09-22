class StickySidebar {

  init() {
    this.stickySidebarEvents();
  }

  stickySidebarEvents() {
    const sidebar = document.querySelector('.cmp-article-container__sidebar-wrapper');
    const sidebarContent = sidebar.querySelector('.sidebar-cmp-with-sticky-element');
    if (!sidebar) return;

    const originalWidth = sidebarContent.offsetWidth;

    const handleScroll = () => {
      const currentTopOffset = this.calculateTopOffset();
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;


      const sidebarRect = document.getElementsByClassName('cmp-article-container__sidebar-wrapper')[0];
      //const sidebarContent = document.getElementsByClassName('cmp-experiencefragment--sidebar')[0];
      const contentHeight = sidebarContent.scrollHeight;
      const sidebarTop = sidebarRect.getBoundingClientRect().top + scrollY;

      console.log("sidebarTop::", sidebarTop);
      console.log("viewportHeight::", viewportHeight);
      console.log("contentHeight::", contentHeight);
      console.log("scrollY::", scrollY);

      if(scrollY >= contentHeight - viewportHeight +sidebarTop) {
        sidebarContent.style.position = 'sticky';
        sidebarContent.style.top = `${currentTopOffset}px`;
        sidebarContent.style.transition = 'top 0.1s ease-out, opacity 0.2s ease-out, transform 0.2s ease-out';
        //sidebarContent.style.width = `${originalWidth}px`;
        //sidebar.style.maxHeight = 'calc(150vh - 4rem)';
        //sidebar.style.width = '400px';
        sidebarContent.style.overflowY = 'auto';
        sidebarContent.style.height = 'fit-content';
        sidebarContent.style.zIndex = '10';
        sidebarContent.style.scrollBehavior = 'smooth';
        //sidebarContent.style.transform = `translateY(-${contentHeight - viewportHeight - currentTopOffset}px)`;
      } else {
        // Reset styles when not sticky
        sidebarContent.style.position = '';
        sidebarContent.style.top = '';
        sidebarContent.style.width = '';
        sidebarContent.style.zIndex = '';
        sidebarContent.style.maxHeight = '';
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
    const scrollY = window.scrollY;
    
    if (header) {
      const headerHeight = header.offsetHeight;
      const headerRect = header.getBoundingClientRect();
      console.log("headerHeight inside::", headerHeight);
      console.log("header position::", headerRect.top);
      console.log("scrollY::", scrollY);

      // Check if header is visible or hidden
      if (headerRect.top < 0) {
        // Header is scrolled out of view - use minimal spacing
        return 8;
      } else if (headerRect.top >= 0 && headerRect.top < headerHeight) {
        // Header is partially visible - use dynamic spacing
        const visibleHeaderHeight = headerHeight - Math.abs(headerRect.top);
        return Math.max(visibleHeaderHeight + 4, 8);
      } else {
        // Header is fully visible - use small spacing
        return Math.max(headerHeight * 0.1, 12);
      }
    }
    
    // No header found - use minimal spacing
    return 8;
  }
}

export default new StickySidebar();
