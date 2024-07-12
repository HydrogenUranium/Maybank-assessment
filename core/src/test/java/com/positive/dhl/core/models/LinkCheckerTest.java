package com.positive.dhl.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.positive.dhl.junitUtils.Constants.NEW_CONTENT_STRUCTURE_JSON;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class LinkCheckerTest {
    public static final String ROOT_TEST_PAGE_PATH = "/content";
    public static final String CURRENT_RESOURCE_PATH = "/content/dhl/global/en-global";
    public static final String INTERNAL_LINK = "/content/dhl/global/en-global/any-page";
    public static final String EXTERNAL_LINK = "www.dhl.com";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);
    MockSlingHttpServletRequest request = context.request();

    @BeforeEach
    void setUp() throws Exception {
        context.load().json(NEW_CONTENT_STRUCTURE_JSON, ROOT_TEST_PAGE_PATH);
        context.addModelsForClasses(LinkChecker.class);
        context.currentResource(CURRENT_RESOURCE_PATH);
    }

    @Test
    void test_withoutLink() {
        LinkChecker linkChecker = request.adaptTo(LinkChecker.class);
        assertNotNull(linkChecker);

        assertFalse(linkChecker.isInternalLink());
    }

    @Test
    void test_withExternalLink() {
        request.setAttribute("linkPath", EXTERNAL_LINK);

        LinkChecker linkChecker = request.adaptTo(LinkChecker.class);
        assertNotNull(linkChecker);

        assertFalse(linkChecker.isInternalLink());
    }

    @Test
    void test_withInternalLink() {
        request.setAttribute("linkPath", INTERNAL_LINK);

        LinkChecker linkChecker = request.adaptTo(LinkChecker.class);
        assertNotNull(linkChecker);

        assertTrue(linkChecker.isInternalLink());
    }
}
