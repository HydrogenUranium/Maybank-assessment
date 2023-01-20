class ServiceWorker {
  constructor() {
    this.deferredPrompt = null;

    this.init = this.init.bind(this);
    this.register = this.register.bind(this);
    this.addToHomeScreen = this.addToHomeScreen.bind(this);
  }

  register() {
    navigator.serviceWorker.register('/discover/serviceworker.js').then(() => {
      // console.log('ServiceWorker succesfully registered');
    }).catch(() => {
      //console.log('ServiceWorker registration failed: ', err);
    });
  }

  addToHomeScreen() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
      // Check if already dismissed
      let a2hsCookie = Cookies.get('a2hs');
      // If the cookie is set to ignore, ignore the prompt
      if (a2hsCookie === 'ignore') return;
      // Show the add to home screen banner
      $('.addToHomeScreen').addClass('addToHomeScreen--open');
    });

    $(document).on('click', '.addToHomeScreen__cta', (e) => {
      e.preventDefault();
      // Show A2HS
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          // Hide the add to home screen banner
          $('.addToHomeScreen').removeClass('addToHomeScreen--open');
        } else {
          // Change content
          $('.addToHomeScreen__title').text('That\'s a shame, maybe next time');
          $('.addToHomeScreen__cta').remove();
          $('.addToHomeScreen__link').text('Close');
          // Set ignore cookie
          this.createA2hsCookie();
        }
        this.deferredPrompt = null;
      });
    });

    $(document).on('click', '.addToHomeScreen__link', (e) => {
      e.preventDefault();
      // Hide the add to home screen banner
      $('.addToHomeScreen').removeClass('addToHomeScreen--open');
      // Clear the prompt
      this.deferredPrompt = null;
      // Set ignore cookie
      this.createA2hsCookie();
    });
  }

  createA2hsCookie() {
    // Set ignore cookie
    Cookies.set('a2hs', 'ignore', { expires: 14 });
  }

  init() {
    if (!('serviceWorker' in navigator)) return false;
    this.register();
    return true;
  }
}

export default new ServiceWorker();
