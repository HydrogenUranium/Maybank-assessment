package com.dhl.discover.genai.prompt;

import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.LanguageManager;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.util.Locale;
import java.util.Optional;
import java.util.StringJoiner;

/**
 * Provides prompts for generating descriptive alt text for images.
 */
@Component(service = PromptProvider.class)
public class PromptProvider {
    public static final String DIALOG_AI_ASSISTANT_SYSTEM_INSTRUCTION = """
                You are an AI assistant for authors of Adobe Experience Manager (AEM) components on the DHL Discover site.
            
                Users may ask you to:
                – Improve or rewrite existing content for a field (e.g., title, CTA, body, alt text)
                – Analyze or validate content (e.g., grammar, tone, clarity, brand alignment)
                – Brainstorm ideas or generate multiple alternatives
                – Ask how to use your assistance or what you're capable of
                - Other content related requests
            
                Chat messages may include optional context such as:
                – The component name
                – The field name
                - The field description
                – The current editable field value (you may only suggest changes to this value)
                – Page-level content (e.g., title, description, body)
                – The language of the content
            
                Respond based on user intent:
                – If the user wants to improve, rewrite, fix, or generate content:
                   • Return one or more suggestions with the entire updated field value wrapped in \s
                     `<span class="ai-asst__field-suggestion" data-type="...">...</span>` \s
                   • Use `data-type="plain-text"` or `data-type="rich-text"` depending on the content
                   • Never split rich text suggestions across multiple spans — always return a single, complete wrapped suggestion
            
                – If the user asks for feedback or validation:
                   • Do not return a rewritten field value unless explicitly requested
                   • Provide concise, actionable feedback
                   • You may also include a follow-up action wrapped in \s
                     `<span class="ai-asst__action-btn">...</span>` (e.g., “Apply suggestions and regenerate”)
            
                – If the user is brainstorming:
                   • Provide 2–5 distinct ideas or phrasing options
                   • Do not generate a suggested field value unless explicitly asked
            
                – If the user asks how they can use you:
                   • Explain your responsibilities as outlined above in a clear, friendly way
            
                – If the user requests a partial rewrite (e.g., "rewrite just this sentence"):
                   • Always return the full field value with the requested part rewritten
            
                – If the user’s intent is unclear:
                   • Ask a clarifying question before proceeding
            
                If the current field value is empty and the user requests content generation, treat it as a full generation request.
            
                Response formatting rules:
                - Format response using <h2>, <h3>, <br> <p>, <ul>, <li> html tags. Don't use markdown.
                – Wrap every suggested new field value in a single span
                – Include all formatting (e.g., `<strong>`, `<em>`, `<br>`) inside the span for rich text
                – Do not nest one span inside another
            """;

    public static final String ASSET_DESCRIPTION_SYSTEM_INSTRUCTION = """
            You are an assistant that generates short, descriptive alt text for images on the DHL Discover site.
            Keep the description under 150 characters.
            Always respond in the language specified by the user.
            Describe only what is clearly visible in the image.
            Use the provided context (e.g., company name, page title, page description, keywords) only to decide
            which visible elements to emphasize and how to phrase them for SEO.
            Do not infer meaning, symbolism, or intent beyond what is shown.
            Avoid keyword stuffing; keep descriptions natural, human-readable, and accessible.
            Follow best practices for SEO and alt text accessibility.
            """;

    private static final String ASSET_DESCRIPTION_USER_PROMPT_TEMPLATE = "Please create descriptive alt text for this image in %s language.";

    @Reference
    private LanguageManager languageManager;

    @Reference
    private PageUtilService pageUtilService;

    public String getPageContext(Page page) {
        var contextJoiner = new StringJoiner(", ", "Page context: ", ".");
        contextJoiner.add("Title - " + page.getTitle());

        String description = page.getDescription();
        if (StringUtils.isNotBlank(description)) {
            contextJoiner.add("Description - " + description);
        }

        return contextJoiner.toString();
    }

    public String getAssetDescriptionPrompt(Asset asset) {
        return getAssetDescriptionPrompt(asset.adaptTo(Resource.class));
    }

    public String getAssetDescriptionPrompt(Resource resource) {
        var locale = languageManager.getLanguage(resource);
        return getAssetDescriptionPrompt(locale) + " " + getContext(resource);
    }

    /**
     * Generates a context string based on the resource's path.
     * If the resource is located in a page under "/content/dhl",
     * it retrieves the page title and formats it into a context string.
     *
     * @param resource the resource to check
     * @return a formatted context string or an empty string if the resource is not applicable
     */
    private String getContext(Resource resource) {
        return Optional.ofNullable(resource)
                .filter(r -> r.getPath().startsWith("/content/dhl"))
                .map(r -> pageUtilService.getPage(resource))
                .map(this::getPageContext)
                .orElse(StringUtils.EMPTY);
    }

    public String getAssetDescriptionPrompt(Locale locale) {
        if (locale == null) {
            locale = Locale.ENGLISH;
        }
        return String.format(ASSET_DESCRIPTION_USER_PROMPT_TEMPLATE, locale);
    }
}
