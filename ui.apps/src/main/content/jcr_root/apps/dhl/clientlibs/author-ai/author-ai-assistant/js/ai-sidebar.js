(function ($) {
  const FIELD_SELECTORS = [
    'input.coral-Form-field',
    "div[data-cq-richtext-editable='true']",
    'textarea'
  ];
  const EXCLUDE_SELECTORS = [
    'foundation-autocomplete',
  ];


  const fieldMatcher = (el) => {
    if (!(el instanceof Element)) return null;

    if (EXCLUDE_SELECTORS.some(sel => el.matches(sel) || el.closest(sel))) {
      return null;
    }

    const joined = FIELD_SELECTORS.join(',');
    return el.matches(joined) ? el : el.closest(joined);
  };

    $(document).on("foundation-contentloaded", function (e) {
        const isEnabled = localStorage.getItem('enableAiAssistant') === 'true';
        if (!isEnabled) return;

        Coral.commons.ready(function () {
            const form = document.querySelector("form.cq-dialog:not(.form--with-columns)");
            if (!form) return;

            const aiAssistantSidebar = new AiAssistantDialogSidebar();
            addAiSidebarToggle(aiAssistantSidebar);
            aiAssistantSidebar.injectIntoForm(form);
            const formWrapper = form.querySelector(".form__main-column");
            if (!formWrapper) return;

            formWrapper.addEventListener("focusin", function (event) {
                const input = fieldMatcher(event.target);
                if (input) {
                    aiAssistantSidebar.updateActiveInput(input);
                }
            });
        });
    });
})($);

function addAiSidebarToggle(aiAssistantSidebar) {
    let buttons = document.querySelector("form.cq-dialog .cq-dialog-actions")
    if (!buttons) return;

    const chatButton = createAiButton();
    chatButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (aiAssistantSidebar.form.classList.contains("ai-asst--shown")) {
            aiAssistantSidebar.clean();
            aiAssistantSidebar.form.classList.remove("ai-asst--shown");
        } else {
            aiAssistantSidebar.form.classList.add("ai-asst--shown");
            aiAssistantSidebar.focusInput();
        }
    });

    buttons.appendChild(chatButton);
}

function createAiButton() {
    const openAiButton = new Coral.Button();
    openAiButton.variant = "minimal";
    openAiButton.setAttribute("title", "Edit with AI");
    openAiButton.icon = "openAi";
    openAiButton.classList.add("cq-dialog-header-action");
    return openAiButton;
}

function createElement(tag, className = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    return element;
}

class ChatHistory {
    constructor() {
        this.history = [];
    }
    add(role, content) {
        this.history.push({ role, content });
    }
    clear() {
        this.history = [];
    }
    getAll() {
        return this.history;
    }
}

class Component {
    constructor(tag, className) {
        this.element = createElement(tag, className);
    }

    render(parent) {
        parent.appendChild(this.element);
    }

    destroy() {
        this.element.remove();
    }
}

class MessagesDisplay extends Component {
    constructor(applySuggestion, sendSuggestedPrompt) {
        super("div", "ai-asst__messages");
        this._applySuggestion = applySuggestion;
        this._sendSuggestedPrompt = sendSuggestedPrompt;
    }

    clear() {
        this.element.innerHTML = "";
    }

    addLoader() {
        const loader = createElement("div", "ai-asst__message ai-asst__message--assistant ai-asst__loader");
        loader.textContent = "Typing...";
        this.element.appendChild(loader);
        this.element.scrollTop = this.element.scrollHeight;
    }

    removeLoader() {
        const loader = this.element.querySelector(".ai-asst__loader");
        if (loader) {
            this.element.removeChild(loader);
        }
    }

    _decorateSuggestion(suggestion) {
        const content = createElement("div", "ai-asst__field-suggestion-content");
        content.setAttribute("contenteditable", "true");
        while (suggestion.firstChild) {
            content.appendChild(suggestion.firstChild);
        }
        const toolbar = createElement("div", "ai-asst__field-suggestion-toolbar");
        const applyButton = createElement("button", "ai-asst__field-suggestion-apply-btn");
        applyButton.textContent = "Apply";
        toolbar.appendChild(applyButton);
        applyButton.addEventListener("click", (e) => {
            e.preventDefault();
            this._applySuggestion(content);
        });
        suggestion.appendChild(content);
        suggestion.appendChild(toolbar);
    }

    _decorateSuggestedPrompt(suggestion) {
        suggestion.addEventListener("click", (e) => {
            e.preventDefault();
            this._sendSuggestedPrompt(suggestion.textContent.trim());
        });
    }

    _createMessage(role, content) {
        const message = createElement("div", `ai-asst__message ai-asst__message--${role}`);
        message.innerHTML = DOMPurify.sanitize(content);
        const fieldValueSuggestions = message.querySelectorAll(".ai-asst__field-suggestion");
        fieldValueSuggestions.forEach(this._decorateSuggestion.bind(this));
        const suggestedPrompts = message.querySelectorAll(".ai-asst__action-btn");
        suggestedPrompts.forEach(this._decorateSuggestedPrompt.bind(this));
        return message;
    }

    appendMessage(role, content) {
        const message = this._createMessage(role, content);
        this.element.appendChild(message);
        this.element.scrollTop = this.element.scrollHeight;
    }

    appendPromptSuggestions(promptSuggestions) {
        const buttonList = promptSuggestions.map(text => {
            return `
                <li>
                    <div class="ai-asst__action-btn">${text}</div>
                </li>
            `;
        }).join("");
        const messageHtml = `
                <ul class="ai-asst__action-btn-list">
                    ${buttonList}
                </ul>
        `;

        this.appendMessage("assistant", messageHtml);
    }
}

class SettingsDisplay extends Component {
    constructor() {
        super("div", "ai-asst__settings-display");

        this.drawer = new Coral.Drawer();

        this.usePageBodyCheckbox = new Coral.Checkbox().set({
            label: {
                innerHTML: "Enable full page context"
            },
            value: "true"
        });

        this.drawer.content.appendChild(this.usePageBodyCheckbox);
        this.element.appendChild(this.drawer);
    }

    getUsePageBody() {
        return this.usePageBodyCheckbox.checked ? "true" : "false";
    }

}

class InputDisplay extends Component {
    constructor(handleSend) {
        super("div", "ai-asst__input-display");
        this.textarea = createElement("textarea");
        this.metaInformation = createElement("div", "ai-asst__input-meta-information");
        this.sendButton = createElement("button", "ai-asst__send-button");

        this.metaInformation.textContent = `Please click on the input field you want to edit with AI.`;
        this.textarea.setAttribute("placeholder", "Type your message here...");
        this.textarea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                handleSend(this.textarea);
            }
        });
        this.sendButton.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="icon"><path d="M8.99992 16V6.41407L5.70696 9.70704C5.31643 10.0976 4.68342 10.0976 4.29289 9.70704C3.90237 9.31652 3.90237 8.6835 4.29289 8.29298L9.29289 3.29298L9.36907 3.22462C9.76184 2.90427 10.3408 2.92686 10.707 3.29298L15.707 8.29298L15.7753 8.36915C16.0957 8.76192 16.0731 9.34092 15.707 9.70704C15.3408 10.0732 14.7618 10.0958 14.3691 9.7754L14.2929 9.70704L10.9999 6.41407V16C10.9999 16.5523 10.5522 17 9.99992 17C9.44764 17 8.99992 16.5523 8.99992 16Z"></path></svg>`;
        this.sendButton.addEventListener("click", (e) => {
            e.preventDefault();
            handleSend(this.textarea);
        });

        this.element.appendChild(this.textarea);
        this.element.appendChild(this.metaInformation);
        this.element.appendChild(this.sendButton);
    }

    setInputMetaInformation(text) {
        this.metaInformation.textContent = text;
    }

    clear() {
        this.textarea.value = "";
    }

    getValue() {
        return this.textarea.value.trim();
    }

    disableSendButton() {
        this.sendButton.disabled = true;
    }

    enableSendButton() {
        this.sendButton.disabled = false;
    }

    focusInput() {
        this.textarea.focus();
    }

}

class ChatDisplay extends Component {
    constructor(updateActiveInputValue, sendHandler) {
        super("div", "ai-asst__chat-display");
        this.sendHandler = sendHandler;
        this.isSending = false;
        this.settingsDisplay = new SettingsDisplay();
        this.chatHistory = new ChatHistory();
        this.messagesDisplay = new MessagesDisplay(
            (suggestionElem) => updateActiveInputValue(suggestionElem),
            (prompt) => this._sendSuggestedPrompt(prompt)
        );
        this.inputDisplay = new InputDisplay(() => this._sendUserInput());
        this.element.appendChild(this.settingsDisplay.element);
        this.element.appendChild(this.messagesDisplay.element);
        this.element.appendChild(this.inputDisplay.element);
    }

    clear() {
        this.messagesDisplay.clear();
        this.inputDisplay.clear();
        this.chatHistory.clear();
    }

    focusInput() {
        this.inputDisplay.focusInput();
    }

    async _sendUserInput() {
        const userInput = this.inputDisplay.getValue();
        if (!userInput || this.isSending) return;
        this.inputDisplay.clear();
        await this._handleSendInternal(userInput);
    }

    async _sendSuggestedPrompt(prompt) {
        if (!prompt || this.isSending) return;
        await this._handleSendInternal(prompt);
    }

    async _handleSendInternal(userInput) {
        this.isSending = true;
        this.inputDisplay.disableSendButton();

        this.messagesDisplay.appendMessage("user", userInput);
        this.chatHistory.add("user", userInput);

        this.messagesDisplay.addLoader();

        try {
            const response = await this.sendHandler(this.chatHistory.getAll());

            this.messagesDisplay.appendMessage("assistant", response);
            this.chatHistory.add("assistant", response);
        } catch (error) {
            console.error("Error sending chat message:", error);
            this.messagesDisplay.appendMessage("assistant", "Error: Unable to get a response.");
        } finally {
            this.inputDisplay.enableSendButton();
            this.messagesDisplay.removeLoader();
            this.isSending = false;
        }
    }
}

class DialogInput {
    constructor(input) {
        this.element = input;
    }

    isRichTextInput() {
        return this.element && this.element.dataset.cqRichtextEditable === 'true';
    }

    getInputLabel() {
        return (
            document.querySelector(`#${this.element.attributes.labelledby?.value.split(" ")[0]}`)?.textContent ||
            this.element.getAttribute("aria-label") ||
            this.element.getAttribute("placeholder") ||
            this.element.getAttribute("name")?.replace("./", "") ||
            "Field"
        );
    }

    getValue() {
        if (this.isRichTextInput()) {
            return this.element.innerHTML.trim();
        }
        return this.element.value.trim();
    }

    setValue(value) {
        if (this.isRichTextInput()) {
            this.element.innerHTML = DOMPurify.sanitize(value.innerHTML);
            const links = this.element.querySelectorAll("a");
            links.forEach(link => link.setAttribute("_rte_href", link.getAttribute("href")));

            this.element.dispatchEvent(new Event("change", { bubbles: true }));
        }
        else {
            this.element.value = value.textContent.trim();
            this.element.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }

    getTooltip() {
        const parent = this.element.closest(".coral-Form-fieldwrapper");
        if (!parent) return null;

        // Look for tooltip inside the same container
        const tooltip = parent.querySelector("coral-tooltip")?.textContent.trim();
        return tooltip || null;
    }

    highlight() {
        this.element.classList.add("ai-asst__target-input--active");
    }

    clearHighlight() {
        this.element.classList.remove("ai-asst__target-input--active");
    }
}

class AiAssistantDialogSidebar {
    constructor() {
        this.activeInput = null;
        this.chatDisplay = new ChatDisplay(
            (suggestionElem) => this.updateTargetInput(suggestionElem),
            (messages) => this._sendMessages(messages)
        );
        this.chatDisplay.inputDisplay.setInputMetaInformation("Please click on the input field you want to edit with AI.");
        this.chatDisplay.messagesDisplay.appendPromptSuggestions(this.getPromptSuggestions());
    }

    injectIntoForm(form) {
        if (!form) return;
        this.pagePath = form.attributes.action.value.replace(/\/_jcr_content.*/, '');
        this.form = form;
        this.dialogTitle = this.getDialogTitle();
        const formWrapper = createElement("div", "form__internal-wrapper form__main-column");
        const sidebarWrapper = this.chatDisplay.element;
        sidebarWrapper.classList.add("form__internal-wrapper");

        form.classList.add("form--with-columns");

        while (form.firstChild) {
            formWrapper.appendChild(form.firstChild);
        }

        form.appendChild(formWrapper);
        form.appendChild(sidebarWrapper);
    }

    getPromptSuggestions() {
        let promptSuggestions = [
            "What can you help me with?",
        ];
        if(this.activeInput) {
            const fieldSpecificSuggestions = [];
            const commonSuggestions = ([
                "Rewrite this text for clarity and tone",
                "Fix grammar, spelling, and wording",
                "Give me 3 alternative versions",
                "Format this to improve readability",
                "Is this aligned with DHL brand guidelines?"
            ]);
            promptSuggestions = [...promptSuggestions, ...commonSuggestions, ...fieldSpecificSuggestions];
        }

        return promptSuggestions;
    }

    focusInput() {
        this.chatDisplay.focusInput();
    }

    _updateInputMetaInformation() {
        if (this.activeInput) {
            this.chatDisplay.inputDisplay.setInputMetaInformation(`Active: ${this.activeInput.getInputLabel()}`);
        } else {
            this.chatDisplay.inputDisplay.setInputMetaInformation("Please click on the input field you want to edit with AI.");
        }
    }

    clean() {
        this.chatDisplay.clear();
        this.chatDisplay.messagesDisplay.appendPromptSuggestions(this.getPromptSuggestions());
        this._updateInputMetaInformation();
    }

    updateActiveInput(newInput) {
        if (!newInput || this.activeInput?.element === newInput) return;
        this.activeInput?.clearHighlight();
        this.activeInput = new DialogInput(newInput);
        this.activeInput.highlight();
        this.clean();
    }

    getDialogTitle() {
        return this.form.querySelector("coral-dialog-header")?.textContent.trim();
    }

    updateTargetInput(suggestionElem) {
       this.activeInput?.setValue(suggestionElem);
    }

    async _sendMessages(messages) {
        const csrfToken = await this._fetchCsrfToken();
        return await this._sendRequest(csrfToken, messages);
    }

    async _fetchCsrfToken() {
        const csrfResponse = await fetch("/libs/granite/csrf/token.json");
        if (!csrfResponse.ok) {
            throw new Error(`Failed to fetch CSRF token: ${csrfResponse.status}`);
        }
        const csrfData = await csrfResponse.json();
        return csrfData.token;
    }

    _getSystemInstructions() {
        const instructions = []
        const dialogTitle = this.getDialogTitle();
        if (dialogTitle) {
            instructions.push(`- Current component dialog title: ${dialogTitle}`);
        }

        if (this.activeInput) {
            const isRichText = this.activeInput.isRichTextInput();
            const inputLabel = this.activeInput.getInputLabel();
            const tooltip = this.activeInput.getTooltip();
            const inputType = isRichText ? "rich text" : "plain text";
            const value = this.activeInput.getValue();


            instructions.push(`- User is working on the ${inputLabel} field.`);
            instructions.push(`- Field type: ${inputType}`);
            if (tooltip) {
                instructions.push(`- Description of the field: ${tooltip}`);
            }
            if (value) {
                instructions.push(`- Current value of the field: ${value}`);
            } else {
                instructions.push(`- Current value of the field is empty.`);
            }
        }


        return { role: "system", content: instructions.join("\n\n") };
    }

    async _sendRequest(csrfToken, messages) {
        const additionalMessages = [{
            role: "user",
            content: "Please don't forget to wrap suggestions."
        }];

        const requestBody = {
            messages: [
                this._getSystemInstructions(),
                ...messages,
                ...additionalMessages,
            ],
        };

        const url = new URL(`${this.pagePath}.dialogAiAssistant.json`, window.location.origin);
        url.searchParams.set("addFullBodyContext", this.chatDisplay.settingsDisplay.getUsePageBody());

        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": csrfToken,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        return data.result || "No response from server.";
    }
}
