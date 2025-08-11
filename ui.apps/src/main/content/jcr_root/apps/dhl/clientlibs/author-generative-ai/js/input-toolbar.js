
(function(document, $) {
    "use strict";
    $(document).on("foundation-contentloaded", function(e) {
      const foundationRegistry = $(window).adaptTo('foundation-registry');

      document.addEventListener("focusin", (e) => {
        const inputEl = e.target;
        if (inputEl.tagName !== "INPUT" && inputEl.tagName !== "TEXTAREA") return;
        buildToolbar(inputEl, foundationRegistry);
      });

    });
})(document, Granite.$);

function buildButton(action, input) {
  const coralButton = new Coral.Button();
  coralButton.variant = "quiet";
  coralButton.setAttribute("title", action.title);
  coralButton.textContent = action.text;
  if (action.icon) {
    coralButton.icon = action.icon;
  }
  if (action.iconSize) {
    coralButton.iconSize = action.iconSize;
  }
  coralButton.addEventListener("click", (e) => {
                  e.preventDefault();
                  action.onClick(input);
  });
  return coralButton;
}

function buildToolbar(inputEl, foundationRegistry) {
  const inputWrapper = inputEl.parentElement;
  if(inputWrapper.querySelector("#InputToolbar")) return;

  const actions = foundationRegistry.get('input.action') || [];
  const matchingActions = actions.filter(action =>
    inputEl.matches(action.selector)
  );

  if (matchingActions.length === 0) return;

  const toolbar = document.createElement("div");
  toolbar.id = "InputToolbar";

  matchingActions.forEach(action => toolbar.appendChild(buildButton(action, inputEl)));
  toolbar.appendChild(buildButton({
      title: 'Close Toolbar',
      icon: 'close',
      iconSize: 'XS',
      onClick: (inputEl) => { toolbar.style.display = 'none'; }
  }, inputEl))

  document.addEventListener("click", function handleClick(e) {
    // If the click is outside the toolbar and input wrapper, remove the toolbar
    if (toolbar && !inputWrapper.contains(e.target)) {
      toolbar.remove();
      document.removeEventListener("click", handleClick, true);
    }
  }, true);

  inputEl.insertAdjacentElement("beforebegin", toolbar);
  positionToolbar(inputEl, inputWrapper, toolbar);
}

function positionToolbar(inputEl, inputWrapperEl, toolbar) {
  const bottomOffset = 5;

  const toolbarRect = toolbar.getBoundingClientRect();
  const inputWrapperRect = inputWrapperEl.getBoundingClientRect();
  const inputRect = inputEl.getBoundingClientRect();

  toolbar.style.top = `${inputRect.top - inputWrapperRect.top - toolbarRect.height - bottomOffset}px`;
  toolbar.style.left = `${inputRect.left - inputWrapperRect.left}px`;
}
