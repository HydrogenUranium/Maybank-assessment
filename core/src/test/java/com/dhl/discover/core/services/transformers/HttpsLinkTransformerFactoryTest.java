package com.dhl.discover.core.services.transformers;

import org.apache.sling.rewriter.Transformer;
import org.apache.sling.rewriter.TransformerFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class HttpsLinkTransformerFactoryTest {

    @InjectMocks
    private HttpsLinkTransformerFactory factory;

    @BeforeEach
    void setUp() {
        if (factory == null) {
            factory = new HttpsLinkTransformerFactory();
        }
    }

    @Test
    void testImplementsTransformerFactory() {
        assertTrue(factory instanceof TransformerFactory,
                "Factory should implement TransformerFactory interface");
    }

    @Test
    void testCreateTransformer() {
        Transformer transformer = factory.createTransformer();

        assertNotNull(transformer, "Transformer should not be null");
        assertInstanceOf(HttpsLinkTransformer.class, transformer,
                "Should return HttpsLinkTransformer instance");
    }

    @Test
    void testOsgiComponentConfiguration() {
        Component componentAnnotation = HttpsLinkTransformerFactory.class.getAnnotation(Component.class);
        assertNull(componentAnnotation, "Should not have Component annotation");
    }

    @Test
    void testDesignateConfiguration() {
        Designate designateAnnotation = HttpsLinkTransformerFactory.class.getAnnotation(Designate.class);
        assertNull(designateAnnotation, "Should not have Designate annotation as it's not needed");
    }
}