class FloatingIconsWrapper {
  constructor() {
    this.init = this.init.bind(this);
    this.chatbotFunction = this.chatbotFunction.bind(this);
  }

  init() {
    this.createWrapper();
    this.addElementsToWrapper();
  }

  createWrapper() {
    if (!document.querySelector('.wrapper')) {
      const wrapperDiv = document.createElement('div');
      wrapperDiv.className = 'wrapper';
      document.body.appendChild(wrapperDiv);
    }
  }

  addElementsToWrapper() {
    const pageWrapper = document.querySelector('.wrapper');
    if (pageWrapper) {
      const chatbotDiv = document.createElement('div');
      chatbotDiv.className = 'chatbot';
      this.chatbotFunction(chatbotDiv);

      const arrowDiv = document.createElement('div');
      arrowDiv.className = 'arrow arrow-hidden';
      const arrowIcon = document.querySelector('.js--go-to-top-button');
      if (arrowIcon) {
        arrowDiv.appendChild(arrowIcon);
        this.synchronizeArrowVisibility(arrowDiv, arrowIcon);
      }

      pageWrapper.appendChild(chatbotDiv);
      pageWrapper.appendChild(arrowDiv);
    }
  }

  chatbotFunction(chatbotDiv) {
    const checkInterval = setInterval(() => {
      const iframe = document.getElementById('dhl-va-widget-iframe');
      if (iframe) {
        clearInterval(checkInterval);
        chatbotDiv.appendChild(iframe);
        chatbotDiv.classList.add('digital-assistant--visible');
        this.observeVisibilityChanges(iframe, chatbotDiv);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkInterval);
    }, 10000);
  }

  synchronizeArrowVisibility(arrowDiv, arrowIcon) {
    const observer = new MutationObserver(() => {
      if (arrowIcon.classList.contains('c-go-to-top-button') && arrowIcon.classList.contains('visible')) {
        arrowDiv.classList.remove('arrow-hidden');
      } else {
        arrowDiv.classList.add('arrow-hidden');
      }
    });

    observer.observe(arrowIcon, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  observeVisibilityChanges(iframe, chatbotDiv) {
    const observer = new MutationObserver(() => {
      const isVisible = window.getComputedStyle(iframe).display !== 'none';

      if (isVisible) {
        chatbotDiv.classList.add('digital-assistant--visible');
        chatbotDiv.classList.remove('digital-assistant--hidden');
      } else {
        chatbotDiv.classList.add('digital-assistant--hidden');
        chatbotDiv.classList.remove('digital-assistant--visible');
      }
    });

    // Observe attribute changes on the iframe
    observer.observe(iframe, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
}

export default new FloatingIconsWrapper();
