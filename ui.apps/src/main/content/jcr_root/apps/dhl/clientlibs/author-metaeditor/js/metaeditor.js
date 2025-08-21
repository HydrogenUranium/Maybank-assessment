(function (document, $) {
  "use strict";

  const Sources = {
    UNDEFINED: "UNDEFINED",
    AI: "AI",
    HUMAN: "HUMAN",
    REVIEWED_AI: "REVIEWED AI"
  };

  $(document).on("foundation-contentloaded", function () {
    const descriptionInput = document.querySelector(".discover-asset-description");
    const sourceInputEl = document.querySelector(".discover-asset-description-source");


    if (!descriptionInput || !sourceInputEl) {
      return;
    }

    const buttonWrapper = addButtonNextToInput(
      sourceInputEl,
      "Mark as Reviewed",
      "Confirm that this AI-generated description has been reviewed and approved by a human",
      function (_input, wrapper) {
        $(sourceInputEl).val(Sources.REVIEWED_AI).trigger("change");
      }
    );

    function updateButtonVisibility() {
      const val = sourceInputEl.value || Sources.UNDEFINED;
      buttonWrapper.style.display = (val === Sources.AI) ? "" : "none";
    }

    updateButtonVisibility();

    $(sourceInputEl).on("change input", updateButtonVisibility);

    descriptionInput.on("input", function () {
      const descriptionValue = $(this).val().trim();
      if (descriptionValue === "") {
        $(sourceInputEl).val(Sources.UNDEFINED).trigger("change");
      } else {
        $(sourceInputEl).val(Sources.HUMAN).trigger("change");
      }
    });
  });

  function addButtonNextToInput(inputEl, buttonName, tooltip, handler) {
    const coralButton = new Coral.Button();
    coralButton.variant = "primary";
    coralButton.setAttribute("title", tooltip);
    coralButton.textContent = buttonName;

    const buttonWrapper = document.createElement("span");
    buttonWrapper.className = "coral-InputGroup-button discover-metaeditor-input-button-wrapper";
    buttonWrapper.appendChild(coralButton);

    coralButton.addEventListener("click", (e) => {
      e.preventDefault();
      handler(inputEl, buttonWrapper);
    });

    inputEl.insertAdjacentElement("beforebegin", buttonWrapper);
    return buttonWrapper;
  }
})(document, Granite.$);
