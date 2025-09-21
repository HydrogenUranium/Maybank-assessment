class StickySidebar {

  init() {
    this.stickySidebarEvents();
  }
/*
stickySidebarEvents() {

  const sidebar = document.querySelector('.cmp-article-container__sidebar-wrapper');
  const sidebarContent = sidebar.querySelector('.sidebar-cmp-with-sticky-element');
  if (!sidebar) return;

  const containerGrid = document.querySelector('.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12');
  const originalWidth = sidebarContent.offsetWidth;
  const containerWidth = containerGrid ? containerGrid.offsetWidth : originalWidth;

  const handleScroll = () => {
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
      sidebarContent.style.top = '2rem';
      sidebarContent.style.width = `${originalWidth}px`; // Use original width instead of 125%
      sidebarContent.style.maxWidth = '100%'; // Ensure it doesn't exceed container
      sidebarContent.style.marginLeft = '0';
      sidebarContent.style.marginRight = '0';
      sidebarContent.style.overflowY = 'auto';
      sidebarContent.style.height = 'fit-content';
      sidebarContent.style.zIndex = '10';
      sidebarContent.style.boxSizing = 'border-box';
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
*/
}

export default new StickySidebar();
