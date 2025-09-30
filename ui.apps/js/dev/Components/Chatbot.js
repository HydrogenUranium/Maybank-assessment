class Chatbot {
  constructor() {
    this.sel = {
      chatbot: "meta[name='va-chatbot']",
    };
    this.init = this.init.bind(this);
    this.loadScript = this.loadScript.bind(this);
  }

  getPathSegment(index) {
    const pathnameParts = document.location.pathname.split("/");
    return pathnameParts.length > index ? pathnameParts[index] : null;
  }

  getCountryLanguageParts() {
    const countryLanguage = this.getPathSegment(2); //set 4 for localhost
    return countryLanguage ? countryLanguage.split("-") : [];
  }

  getLanguageCode() {
    const [language] = this.getCountryLanguageParts();
    return language || "N/A";
  }

  getCountryCode() {
    const [, country] = this.getCountryLanguageParts();
    return country || "N/A";
  }

  loadScript(chatbotId, countryCode, languageCode) {
    const script = document.createElement("script");
    script.setAttribute("src", "https://vawidget.dhl.com/latest/embed.js");
    script.setAttribute("id", "dhl-va-widget");

    script.addEventListener("load", () => {
      window.dhlVAWidget.init({
        id: chatbotId,
        countryCode: countryCode,
        languageCode: languageCode,
      });
    });
    document.head.appendChild(script);
  }

  getChatbotEnabled() {
    return document.querySelector(this.sel.chatbot).content;
  }

  getChatbotId() {
    return document.querySelector(this.sel.chatbot).getAttribute("data-id");
  }

  getFormattedLanguageCode(languageCode, countryCode) {
    return languageCode === "zh"
      ? `${languageCode}-${countryCode.toUpperCase()}`
      : languageCode;
  }

  init() {
    const chatbotEnabled = this.getChatbotEnabled();
    const chatbotId = this.getChatbotId();
    const countryCode = this.getCountryCode();
    const languageCode = this.getLanguageCode();

    if (chatbotEnabled === "true" && chatbotId !== "") {
      const formattedLanguageCode = this.getFormattedLanguageCode(languageCode, countryCode);
      this.loadScript(chatbotId, countryCode, formattedLanguageCode);
    }
  }
}

export default new Chatbot();




