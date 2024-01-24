package com.positive.dhl.core.services;

import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.tagging.TagManager;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class TagUtilServiceTest {
    public static final String PAGE_PATH = "/content";
    public static final String TEST_RESOURCE_PATH = "/com/positive/dhl/core/newContentStructure.json";
    public static final String ARTICLE_WITH_TAGS_PAGE_PATH = "/content/dhl/global/en-global/category-page/article-page";
    public static final String ARTICLE_WITHOUT_TAGS_PAGE_PATH = "/content/dhl/us/es-us/category-page/article-page";

    AemContext context = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);

    private ResourceResolver resourceResolver;
    private Resource resource;

    @InjectMocks
    TagUtilService tagUtilService;

    @Mock
    PageUtilService pageUtilService;

    @BeforeEach
    void setUp() throws InvalidTagFormatException {
        resourceResolver = context.resourceResolver();
        context.load().json(TEST_RESOURCE_PATH, PAGE_PATH);
        resource = resourceResolver.getResource(PAGE_PATH);
        pageUtilService = new PageUtilService();

        TagManager tagManager = context.resourceResolver().adaptTo(TagManager.class);
        tagManager.createTag("dhl-article-external:default/dhl_internationalshipping", "International Shipping", "International Shipping");
        tagManager.createTag("dhl-article-external:default/e-commerce_advice", "e-Commerce advice", "e-Commerce advice");
        tagManager.createTag("dhl-article-external:default/business_advice", "Business Advice", "Business Advice");
        tagManager.createTag("dhl-article-internal:hidden", "Hidden", "Hidden");
        tagManager.createTag("dhlsuggested:Business", "Business", "Business");
        tagManager.createTag("dhlsuggested:China", "China", "China");
        tagManager.createTag("dhlsuggested:Small-business", "small business", "small business");
        tagManager.createTag("dhl-author-highlights:recommended", "recommended", "recommended");
    }

    @Test
    void test_getExternalTags() {
        assertNotNull(tagUtilService);

        assertArrayEquals(
                new String[]{},
                tagUtilService.getExternalTags(null).toArray());

        Resource articleWithTagsPageResource = resourceResolver.getResource(ARTICLE_WITH_TAGS_PAGE_PATH);
        assertNotNull(articleWithTagsPageResource);
        assertArrayEquals(
                new String[]{"#BusinessAdvice", "#eCommerceAdvice", "#InternationalShipping"},
                tagUtilService.getExternalTags(articleWithTagsPageResource).toArray());


        Resource articleWithoutTagsPageResource = resourceResolver.getResource(ARTICLE_WITHOUT_TAGS_PAGE_PATH);
        assertNotNull(articleWithoutTagsPageResource);
        assertArrayEquals(
                new String[]{},
                tagUtilService.getExternalTags(articleWithoutTagsPageResource).toArray());
    }

    @Test
    void test_getHighlightTags() {
        assertArrayEquals(new String[]{}, tagUtilService.getHighlightsTags(null).toArray());

        Resource article = resourceResolver.getResource(ARTICLE_WITH_TAGS_PAGE_PATH);
        assertNotNull(article);
        assertArrayEquals(new String[]{"recommended"}, tagUtilService.getHighlightsTags(article).toArray());
    }

    @Test
    void test_transformToHashtag() {
        assertNotNull(tagUtilService);

        assertEquals(
                "#eCommerce",
                tagUtilService.transformToHashtag("e-commerce"));

        assertEquals(
                "#b2beCommerceAdvice",
                tagUtilService.transformToHashtag("B2B e-commerce advice"));

        assertEquals(
                "",
                tagUtilService.transformToHashtag(""));

        assertEquals(
                "",
                tagUtilService.transformToHashtag(null));
    }

    @Test
    void test_getDefaultTrendingTopicsList() {
        assertNotNull(tagUtilService);
        List<String> list = tagUtilService.getDefaultTrendingTopicsList(resource);
        assertEquals(List.of("Business", "China", "small business"), list);
    }
}
