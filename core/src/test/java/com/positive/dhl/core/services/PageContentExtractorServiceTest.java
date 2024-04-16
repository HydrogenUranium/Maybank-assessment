package com.positive.dhl.core.services;

import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.positive.dhl.core.utils.Constants.NEW_CONTENT_STRUCTURE_JSON;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PageContentExtractorServiceTest {

    private final AemContext context = new AemContext();

    @Mock
    PageContentExtractorService.Config config;

    @InjectMocks
    PageContentExtractorService service;

    @BeforeEach
    void init() {
        when(config.componentsWithProperties()).thenReturn(new String[] {
                "dhl/components/content/text::text",
                "dhl/components/content/title::jcr:title"
        });
        context.load().json(NEW_CONTENT_STRUCTURE_JSON, "/content");
    }

    @Test
    void extract_ShouldExtract_WhenExtractPage() {
        service.activate(config);
        Page page = context.resourceResolver().getResource("/content/dhl/us/es-us/category-page/article-page").adaptTo(Page.class);

        String output = service.extract(page);

        String expected = "<div class=\"component-title\">" +
                "<div class=\"jcr:title\">Title</div>" +
                "</div>" +
                "<div class=\"component-text\">" +
                "<div class=\"text\"><p>Text</p></div>" +
                "</div>";

        assertEquals(expected, output);
    }

    @Test
    void extract_ShouldExtract_WhenExtractResource() {
        service.activate(config);
        Resource resource = context.resourceResolver().getResource("/content/dhl/us/es-us/category-page/article-page");

        String output = service.extract(resource);

        String expected = "<div class=\"component-title\">" +
                "<div class=\"jcr:title\">Title</div>" +
                "</div>" +
                "<div class=\"component-text\">" +
                "<div class=\"text\"><p>Text</p></div>" +
                "</div>";

        assertEquals(expected, output);
    }
}