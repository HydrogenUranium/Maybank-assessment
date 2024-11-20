package com.dhl.discover.core.services.schema.impl;

import com.dhl.discover.core.services.PageContentExtractorService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class FAQSchemaAdapterTest {

    private final AemContext context = new AemContext();

    @Mock
    private PageContentExtractorService extractorService;

    @InjectMocks
    private FAQSchemaAdapter adapter;

    @BeforeEach
    void init() {
        context.load().json("/com/dhl/discover/core/services/schema/impl/FAQSchemaAdapter/content.json", "/content/dhl/page");
        when(extractorService.extract(any(Resource.class))).thenReturn("<p>extracted html text<p>/n/r");
    }

    @Test
    void test() {
        Resource page = context.resourceResolver().getResource("/content/dhl/page");
        Resource accordion = context.resourceResolver().getResource("/content/dhl/page/accordion_v2");

        assertFalse(adapter.canHandle(page));
        assertTrue(adapter.canHandle(accordion));

        String stringJson = adapter.toJson(accordion, context.request()).toString();
        assertEquals("{\"@context\":\"https://schema.org\",\"@type\":\"FAQPage\",\"mainEntity\":[{\"@type\":\"Question\",\"name\":\"How do I obtain a quotation for my shipment?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"extracted html text /n/r\"}},{\"@type\":\"Question\",\"name\":\"How can I pay for my DHL Express shipments?\",\"acceptedAnswer\":{\"@type\":\"Answer\",\"text\":\"extracted html text /n/r\"}}]}", stringJson);
    }
}