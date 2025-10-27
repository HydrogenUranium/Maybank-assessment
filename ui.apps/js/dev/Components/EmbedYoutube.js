class EmbedYoutube {
  constructor() {
    this.selector = '.cmp-embed__youtube';
    this.defaultRatio = 56.25;
    this.boundContentLoaded = false;

    this.init = this.init.bind(this);
    this.enhance = this.enhance.bind(this);
    this.applyAspectRatio = this.applyAspectRatio.bind(this);
    this.handleContentLoaded = this.handleContentLoaded.bind(this);
    this.processRoot = this.processRoot.bind(this);
    this.handleMutations = this.handleMutations.bind(this);
    this.globalObserver = null;
  }

  parseRatio(value) {
    if (typeof value === 'undefined' || value === null) {
      return this.defaultRatio;
    }

    const raw = String(value).trim();
    if (!raw.length) {
      return this.defaultRatio;
    }

    const normalized = raw.replace(/:/g, '/');
    if (normalized.includes('/')) {
      const parts = normalized.split('/');
      if (parts.length === 2) {
        const width = parseFloat(parts[0]);
        const height = parseFloat(parts[1]);
        if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
          return (height / width) * 100;
        }
      }
    }

    const numeric = parseFloat(normalized);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric;
    }

    return this.defaultRatio;
  }

  applyAspectRatio($container) {
    const ratioAttr = $container.attr('data-aspect-ratio') ?? $container.attr('data-ratio');
    const ratio = this.parseRatio(ratioAttr);
    $container.css('padding-bottom', `${ratio}%`);
  }

  enhance(element) {
    const $container = $(element);
    if (!$container.length) {
      return;
    }

    this.applyAspectRatio($container);

    if (typeof MutationObserver === 'undefined') {
      return;
    }

    if ($container.data('embedYoutubeObserver')) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i += 1) {
        if (
          mutations[i].type === 'attributes'
          && (mutations[i].attributeName === 'data-aspect-ratio' || mutations[i].attributeName === 'data-ratio')
        ) {
          this.applyAspectRatio($container);
          break;
        }
      }
    });

    observer.observe($container[0], {
      attributes: true,
      attributeFilter: ['data-aspect-ratio', 'data-ratio'],
    });

    $container.data('embedYoutubeObserver', observer);
  }

  handleContentLoaded(event) {
    this.processRoot(event.target);
  }

  processRoot(root) {
    const $root = $(root);
    if (!$root.length) {
      return;
    }

    if ($root.is(this.selector)) {
      this.enhance($root[0]);
    }

    $root.find(this.selector).each((index, element) => this.enhance(element));
  }

  handleMutations(mutations) {
    for (let i = 0; i < mutations.length; i += 1) {
      const mutation = mutations[i];
      if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length) {
        for (let nodeIndex = 0; nodeIndex < mutation.addedNodes.length; nodeIndex += 1) {
          const node = mutation.addedNodes[nodeIndex];
          if (node.nodeType === 1) {
            this.processRoot(node);
          }
        }
      }
    }
  }

  init() {
    this.processRoot(document);

    if (!this.boundContentLoaded) {
      $(document).on('foundation-contentloaded', this.handleContentLoaded);
      this.boundContentLoaded = true;
    }

    if (typeof MutationObserver !== 'undefined' && !this.globalObserver) {
      this.globalObserver = new MutationObserver(this.handleMutations);
      const observeTarget = document.body || document.documentElement;
      if (observeTarget) {
        this.globalObserver.observe(observeTarget, {
          childList: true,
          subtree: true,
        });
      }
    }

    return true;
  }
}

export default new EmbedYoutube();
