package com.dhl.discover.genai.prompt;

import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.LanguageManager;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.genai.exception.UnsupportedLanguageException;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class})
class PromptProviderTest {

    @Mock
    private LanguageManager languageManager;

    @Mock
    private PageUtilService pageUtilService;

    @InjectMocks
    private PromptProvider promptProvider;

    @Mock
    private Asset asset;

    @Mock
    private Resource resource;

    @Mock
    private Page page;

    @BeforeEach
    void setUp() {
        lenient().when(languageManager.getLanguage(resource)).thenReturn(Locale.ENGLISH);
        lenient().when(asset.adaptTo(Resource.class)).thenReturn(resource);
    }

    @Test
    void testGetAssetDescriptionPromptWithValidLocaleFromPage() throws UnsupportedLanguageException {
        String expectedPrompt = "Please create descriptive alt text for this image in en language " +
                "The image appears in an article titled 'Page Title'";
        when(resource.getPath()).thenReturn("/content/dhl/page");
        when(pageUtilService.getPage(any(Resource.class))).thenReturn(page);
        when(page.getTitle()).thenReturn("Page Title");

        String actualPrompt = promptProvider.getAssetDescriptionPrompt(resource);

        assertEquals(expectedPrompt, actualPrompt);
    }

    @Test
    void testGetAssetDescriptionPromptWithNullLocale() {
        when(languageManager.getLanguage(resource)).thenReturn(null);

        assertThrows(UnsupportedLanguageException.class, () -> {
            promptProvider.getAssetDescriptionPrompt(resource);
        });
    }

    @Test
    void testGetAssetDescriptionPromptWithAsset() throws UnsupportedLanguageException {
        when(asset.adaptTo(Resource.class)).thenReturn(resource);
        when(resource.getPath()).thenReturn("/content/dam/image");
        String expectedPrompt = "Please create descriptive alt text for this image in en language";

        String actualPrompt = promptProvider.getAssetDescriptionPrompt(asset);

        assertEquals(expectedPrompt, actualPrompt);
    }
}