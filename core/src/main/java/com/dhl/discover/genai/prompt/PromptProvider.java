package com.dhl.discover.genai.prompt;

import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.LanguageManager;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.genai.exception.UnsupportedLanguageException;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.util.Locale;
import java.util.Optional;

/**
 * Provides prompts for generating descriptive alt text for images.
 */
@Component(service = PromptProvider.class)
public class PromptProvider {
    public static final String ASSET_DESCRIPTION_SYSTEM_INSTRUCTION =
            "You are an assistant that generates short, descriptive alt text for images. " +
                    "Keep the description under 150 characters. " +
                    "The user will specify the desired output language in the prompt — always respond in that language" +
                    "Focus on what is clearly visible in the image, " +
                    "but consider provided context to help determine what the image is meant to emphasize. " +
                    "Use the context only if it meaningfully guides the interpretation of the image's main subject or tone. " +
                    "Avoid making assumptions beyond what is visible.";

    private static final String ASSET_DESCRIPTION_USER_PROMPT_TEMPLATE = "Please create descriptive alt text for this image in %s language";
    private static final String ASSET_DESCRIPTION_CONTEXT_TEMPLATE = " The image appears in an article titled '%s'";

    @Reference
    private LanguageManager languageManager;

    @Reference
    private PageUtilService pageUtilService;

    public String getAssetDescriptionPrompt(Asset asset) throws UnsupportedLanguageException {
        return getAssetDescriptionPrompt(asset.adaptTo(Resource.class));
    }

    public String getAssetDescriptionPrompt(Resource resource) throws UnsupportedLanguageException {
        var locale = languageManager.getLanguage(resource);
        return getAssetDescriptionPrompt(locale) + getContext(resource);
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
                .map(r ->pageUtilService.getPage(resource))
                .map(Page::getTitle)
                .map(title -> String.format(ASSET_DESCRIPTION_CONTEXT_TEMPLATE, title))
                .orElse(StringUtils.EMPTY);
    }

    public String getAssetDescriptionPrompt(Locale locale) throws UnsupportedLanguageException {
        if (locale == null) {
            throw new UnsupportedLanguageException("Asset does not have a valid language set.");
        }
        return String.format(ASSET_DESCRIPTION_USER_PROMPT_TEMPLATE, locale);
    }
}
