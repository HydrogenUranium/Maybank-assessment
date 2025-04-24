(function(document, $) {
    "use strict";
    $(document).on("foundation-contentloaded", function(e) {
        Coral.commons.ready(function() {
            const url = window.location.href;
            if (!url.includes("createpagewizard.html")) return;
            let inputs = $(".author-cf-input", e.target)
            handler(inputs);
        });
    });

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
            const input = document.querySelector(".author-cf-input");

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
                        toast.innerHTML = `The author selection has been saved for ${branch}`;
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
