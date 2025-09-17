
class StickySidebar {

    init() {
        this.stickySidebarEvents();
    }

    stickySidebarEvents() {
        const sidebar = document.querySelector('.cmp-article-container__sidebar-wrapper');
        if (!sidebar) return;

        const handleScroll = () => {
            const currentTopOffset = this.calculateTopOffset();
            sidebar.style.top = `${currentTopOffset}px`;

            //const sidebarRect = document.getElementsByClassName('cmp-article-container__sidebar-wrapper')[0];
            const sidebarContent = document.getElementsByClassName('cmp-experiencefragment--sidebar')[0];
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const contentHeight = sidebarContent.getBoundingClientRect().height;
            //const sidebarTop = sidebarRect.getBoundingClientRect().top + scrollY;

            if(scrollY >= contentHeight - viewportHeight) {
                sidebar.style.position = 'sticky';
                sidebar.style.maxHeight = 'calc(150vh - 4rem)';
                sidebar.style.overflowY = 'auto';
                sidebar.style.height = 'fit-content';
                sidebar.style.zIndex = '10';
                sidebar.style.transform = `translateY(-${contentHeight - viewportHeight}px)`;
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
            return headerHeight + 16;
        }
    }
}

export default new StickySidebar();
