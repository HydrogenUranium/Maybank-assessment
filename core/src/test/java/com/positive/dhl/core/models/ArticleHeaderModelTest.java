package com.positive.dhl.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleHeaderModelTest {
    public static final String TEST_RESOURCE_PATH = "/com/positive/dhl/core/models/newContentStructure.json";
    public static final String ROOT_TEST_PAGE_PATH = "/content";
    public static final String ARTICLE_WITH_ARTICLE_HEADER_RESOURCE_PATH = "/content/dhl/global/en-global/category-page/article-page-with-article-header/jcr:content/root/article_header_container/body/article-header";
    public static final String ARTICLE_WITHOUT_ARTICLE_HEADER_RESOURCE_PATH = "/content/dhl/global/en-global/category-page/article-page-without-article-header/jcr:content/root/article_header_container/body/article-header";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);
    private ResourceResolver resourceResolver;

    @BeforeEach
    void setUp() throws Exception {
        context.load().json(TEST_RESOURCE_PATH, ROOT_TEST_PAGE_PATH);
        resourceResolver = context.resourceResolver();
        context.addModelsForClasses(ArticleHeaderModel.class);
    }

    @Test
    void test_withComponentSetup() {
        Resource resource = resourceResolver.getResource(ARTICLE_WITH_ARTICLE_HEADER_RESOURCE_PATH);
        ArticleHeaderModel articleHeaderModel = context.getService(ModelFactory.class).createModel(resource, ArticleHeaderModel.class);
        assertNotNull(articleHeaderModel);

        assertEquals("WHAT IS GREEN LOGISTICS AND HOW CAN IT TRANSFORM YOUR BUSINESS?", articleHeaderModel.getArticleTitle());
        assertEquals("07 June 2023", articleHeaderModel.getPublishDate());
        assertEquals("6 min read", articleHeaderModel.getReadingDuration());
        assertEquals("Share on", articleHeaderModel.getShareOn());
        assertEquals("Share", articleHeaderModel.getSmartShareButtonsLabel());
        assertEquals("/content/dam/dhl-discover/common/icons/icons8-share (1).svg", articleHeaderModel.getSmartShareButtonsIconPath());
        assertEquals(3, articleHeaderModel.getSocialNetwork().size());
    }

    @Test
    void test_withoutComponentSetup() {
        Resource resource = resourceResolver.getResource(ARTICLE_WITHOUT_ARTICLE_HEADER_RESOURCE_PATH);
        ArticleHeaderModel articleHeaderModel = context.getService(ModelFactory.class).createModel(resource, ArticleHeaderModel.class);
        assertNotNull(articleHeaderModel);

        assertNull(articleHeaderModel.getArticleTitle());
        assertNull(articleHeaderModel.getPublishDate());
        assertNull(articleHeaderModel.getReadingDuration());
        assertNull(articleHeaderModel.getShareOn());
        assertNull(articleHeaderModel.getSmartShareButtonsLabel());
        assertNull(articleHeaderModel.getSmartShareButtonsIconPath());
        assertTrue(articleHeaderModel.getSocialNetwork().isEmpty());
    }
}