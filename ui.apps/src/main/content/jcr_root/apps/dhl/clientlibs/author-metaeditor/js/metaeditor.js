(function(document, $) {
    "use strict";

    const Sources = {
        UNDEFINED: "UNDEFINED",
        AI: "AI",
        HUMAN: "HUMAN",
        REVIEWED_AI: "REVIEWED AI"
    };

    $(document).on("foundation-contentloaded", function() {
        const descriptionInput = $(".discover-asset-description");
        const hiddenSourceInput = $(".discover-asset-description-source--hidden")[0];
        const displayedSourceInput = $(".discover-asset-description-source--displayed")[0];
        const descriptionSource = $(".discover-asset-description-source--displayed")[0]?.value || Sources.UNDEFINED;
        let button;

        if (descriptionSource === Sources.AI) {
          button = addButtonToInput(displayedSourceInput, "Mark as Reviewed",
            "Confirm that this AI-generated description has been reviewed and approved by a human",
            function(input, buttonWrapper) {
              $(hiddenSourceInput).val(Sources.REVIEWED_AI);
              $(displayedSourceInput).val(Sources.REVIEWED_AI);
              buttonWrapper.remove();
            });
        }

        descriptionInput.on("input", function() {
            const descriptionValue = $(this).val().trim();
            button?.remove();
            if (descriptionValue === "") {
                $(hiddenSourceInput).val(Sources.UNDEFINED);
                $(displayedSourceInput).val(Sources.UNDEFINED);
            } else {
                $(hiddenSourceInput).val(Sources.HUMAN);
                $(displayedSourceInput).val(Sources.HUMAN);
            }
        });
    });

    function addButtonToInput(input, buttonName, tooltip, handler) {
      const coralButton = new Coral.Button();
            coralButton.variant = "primary";
            coralButton.setAttribute("title", tooltip);
            coralButton.textContent = buttonName;

            const buttonWrapper = document.createElement("span");
            buttonWrapper.className = "coral-InputGroup-button discover-metaeditor-input-button-wrapper";
            buttonWrapper.appendChild(coralButton);

            coralButton.addEventListener("click", (e) => {
                e.preventDefault();
                handler(input, buttonWrapper);
            });



            input.insertAdjacentElement("beforebegin", buttonWrapper);

            return buttonWrapper;
    }
})(document, Granite.$);
