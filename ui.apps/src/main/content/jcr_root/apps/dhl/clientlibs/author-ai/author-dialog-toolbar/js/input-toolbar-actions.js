(function($) {
    const foundationRegistry = $(window).adaptTo('foundation-registry');

    foundationRegistry.register('input.action', {
      selector: 'input[name="./alt"], input[name="./cq:featuredimage/alt"]',
      text: 'Generate',
      icon: 'openAi',
      title: 'Generate Alt Text',
      onClick: (inputEl) => {
        const form = inputEl.closest("form");
        const inheritFeaturedImage = form.querySelector("coral-checkbox[name='./imageFromPageImage']")?.checked || false;

        const majorComponentPath = form.getAttribute("action");
        const propertyPath = inputEl.getAttribute("name");
        const match = propertyPath.match(/^\.\/(.+)\/[^/]+$/);
        const minorComponentPath = match ? `/${match[1]}` : "";
        let assetPath = "";
        if(!inheritFeaturedImage) {
          const selector = `input[name='.${minorComponentPath}/fileReference']`;
          assetPath = form.querySelector(selector)?.value;
        } else {
          assetPath = form.querySelector("coral-fileupload.cq-page-image-thumbnail .cq-FileUpload-edit")?.getAttribute("data-cq-fileupload-filereference");
        }

        const url = `${majorComponentPath}${minorComponentPath}.generateImageDescription.json?assetPath=${assetPath}`;
        if(!assetPath) {
          toast("info", "Asset Path is not configured");
          return;
        }

        const inputWrapper = inputEl.closest(".cmp-image__editor-alt");

        generateAlt(url, inputEl, inputWrapper)
       }
    });

    foundationRegistry.register('input.action', {
          selector: 'input[name="./jcr:content/metadata/dc:description"]',
          text: 'Generate',
          icon: 'openAi',
          title: 'Generate Alt Text',
          onClick: (inputEl) => {
            const currentUrl = new URL(window.location.href);
            const assetPath = currentUrl.searchParams.get("item");
            if(!assetPath) {
              return;
            }

            const locale = document.querySelector('input[name="./jcr:content/metadata/dc:language"]')?.value;
            let url = `${assetPath}.generateImageDescription.json`;
            if(locale) {
              url += `?locale=${locale}`;
            }
            if(!assetPath) {
              toast("info", "Asset Path is not configured");
              return;
            }


            const inputWrapper = inputEl.closest(".coral-Form-fieldwrapper");

            generateAlt(url, inputEl, inputWrapper, () => {
              $(".discover-asset-description-source")?.val("AI").trigger("change");
            })
           }
        });
})($);

function withLoader(inputWrapper, work, callback) {
  inputWrapper.classList.add("input-wrapper--loading");

  const loader = new Coral.Wait();
  loader.classList.add("input-generative-ai-loader");
  inputWrapper.appendChild(loader);

  const done = () => {
    inputWrapper.classList.remove("input-wrapper--loading");
    loader.remove();
  };

  return Promise.resolve()
    .then(work)
    .then(done)
    .then(callback)
    .catch((e) => {
      console.error("Error generating alt text:", e);
      done();
    });
}

function generateAlt(url, inputEl, inputWrapper, callback) {
  return withLoader(inputWrapper, () =>
    fetch(url).then((response) =>
      response.json().then((data) => {
        if (!response.ok) {
          const errorMessage = data.errorMessage || "Failed to generate alt text";
          toast("error", errorMessage);
          throw new Error(errorMessage);
        }
        inputEl.value = data.result || "";
        inputEl.dispatchEvent(new Event("change", { bubbles: true }));
      })
    ),
    () => {
      if(typeof callback === "function") {
        callback(inputEl.value);
      }
    }
  );
}

function toast(variant, text) {
    const toast = document.createElement("coral-toast");
    toast.variant = variant;
    toast.textContent = text;
    toast.setAttribute("open", "");
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 5000);
}
