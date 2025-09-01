(function(document, $) {
    "use strict";
    $(document).on("foundation-contentloaded", function(e) {
        Coral.commons.ready(function() {
            const url = window.location.href;
            if (!url.includes("createpagewizard.html") && !url.includes("properties.html")) return;
            try {
              const urlObj = new URL(url);
              const domain = `${urlObj.protocol}//${urlObj.hostname}${urlObj.port ? ':' + urlObj.port : ''}`;

              let contentPath;
              if (url.includes("createpagewizard.html")) {
                contentPath = url.split("createpagewizard.html")[1];
              } else if (url.includes("properties.html")) {
                contentPath = url.split("properties.html")[1];
                if (contentPath.includes("?item=")) {
                  contentPath = decodeURIComponent(contentPath.split("?item=")[1]);
                }
              }
              if (!contentPath.startsWith("/content")) return;

              let inputs = $(".author-content-fragment-input", e.target)
              if (url.includes("createpagewizard.html")) {
                handler(inputs);
              }
              if (contentPath) {
                $.ajax({
                  url: `${domain}/${contentPath}.model.json`,
                  dataType: 'json',
                  success: function (data) {
                    if (data && data.language) {
                      const pageLanguage = data.language;
                      addAuthorFragmentLink(inputs, domain, pageLanguage);
                    } else {
                      console.log("Language not found in response, use getPageLanguage()");
                    }
                  },
                  error: function (xhr, status, error) {
                    console.error("Could not fetch page properties:", error);
                  }
                });

              }
            } catch (error) {
                console.error("Error processing author functionality:", error);
              }
        });
    });

    function addAuthorFragmentLink(inputs, domain, languageCode) {
      if (!inputs || inputs.length === 0) return;

      const authorSection = inputs[0].closest("section");
      if (!authorSection) return;

      const existingLink = authorSection.querySelector('a.author-fragment-link');
      if (existingLink) return;

      const link = document.createElement("a");
      if (!languageCode || languageCode.trim() === "") {
        link.href = `${domain}/assets.html/content/dam/dhl/content-fragments`;
      } else {
        if (languageCode && languageCode.includes("-")) {
          languageCode = languageCode.split("-")[0];
        }
        link.href = `${domain}/assets.html/content/dam/dhl/content-fragments/${languageCode}`;
      }
      link.textContent = "Create a new author fragment";
      link.target = "_blank";
      link.style.display = "block";
      link.style.marginTop = "10px";
      link.classList.add("author-fragment-link");

      authorSection.appendChild(link);
    }

    function handler(el) {
        el.each(function(i, element) {
            const url = window.location.href;
            const contentPath = url.split("createpagewizard.html")[1];
            if (!contentPath.startsWith("/content")) return;

            const pathParts = contentPath.split("/").filter(Boolean);
            if (pathParts.length < 4) return;

            const branch = pathParts[3];
            const storageKey = `author-cf-selection-${branch}`;

            const preselectedValue = localStorage.getItem(storageKey);
            const input = document.querySelector(".author-content-fragment-input");

            if (input && preselectedValue) {
                input.value = preselectedValue;
            }

            // 5. Add Save button if input exists
            if (input) {

                const coralButton = new Coral.Button();
                coralButton.variant = "primary"; // Other options: 'quiet', 'warning', etc.
                coralButton.icon = "save"; // Optional: Coral icon name
                coralButton.setAttribute("title", `Save this content fragment as default for new articles under the ${branch}`);

                // Add save logic
                coralButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    const value = input.value.trim();
                    if (value) {
                        localStorage.setItem(storageKey, value);
                        const toast = document.createElement("coral-toast");
                        toast.variant = "success"; // Other options: "success", "error", "warning"
                        toast.textContent = `The author selection has been saved for ${branch}`;
                        toast.setAttribute("open", ""); // Show it
                        document.body.appendChild(toast);

                        // Optional: auto-close after 5 seconds
                        setTimeout(() => toast.remove(), 5000);
                    }
                });

                // Insert button after input
                const inputGroup = input.querySelector(".coral-InputGroup");
                if (inputGroup) {
                    // Create a wrapper span for the Coral button
                    const buttonWrapper = document.createElement("span");
                    buttonWrapper.className = "coral-InputGroup-button";

                    // Append Coral button into the wrapper
                    buttonWrapper.appendChild(coralButton);

                    // Append the wrapper to the Coral InputGroup
                    inputGroup.insertBefore(buttonWrapper, inputGroup.firstChild);
                }
            }
        });
    }

})(document, Granite.$);
