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
        inputWrapper.classList.add("input-wrapper--loading");

        const loader = new Coral.Wait();
        loader.classList.add("input-generative-ai-loader");
        inputWrapper.appendChild(loader);

        fetch(url).then(response => {
             return response.json().then(data => {
                 if (!response.ok) {
                     const errorMessage = data.errorMessage || "Failed to generate alt text";
                     toast("error", errorMessage);
                     throw new Error(errorMessage);
                 }
                 return data;
             });
         })
         .then(data => {
             inputEl.value = data.result;
             inputEl.dispatchEvent(new Event('change', { bubbles: true }));
             inputWrapper.classList.remove("input-wrapper--loading");
             loader.remove();
         })
         .catch(e => {
             console.error("Error fetching video data:", e);
             inputWrapper.classList.remove("input-wrapper--loading");
             loader.remove();
             return null;
         });
       }
    });
})($);

function toast(variant, text) {
    const toast = document.createElement("coral-toast");
    toast.variant = variant;
    toast.textContent = text;
    toast.setAttribute("open", "");
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 5000);
}
