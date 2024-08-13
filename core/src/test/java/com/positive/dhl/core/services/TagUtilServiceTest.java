package com.positive.dhl.core.services;

import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static com.positive.dhl.junitUtils.Constants.NEW_CONTENT_STRUCTURE_JSON;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class TagUtilServiceTest {
    public static final String PAGE_PATH = "/content";
    public static final String ARTICLE_WITH_TAGS_PAGE_PATH = "/content/dhl/global/en-global/category-page/article-page";
    public static final String ARTICLE_WITHOUT_TAGS_PAGE_PATH = "/content/dhl/us/es-us/category-page/article-page";

    AemContext context = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);
    ResourceResolver resolver = context.resourceResolver();

    private ResourceResolver resourceResolver;
    private Resource resource;

    @InjectMocks
    TagUtilService tagUtilService;

    @Mock
    PageUtilService pageUtilService;

    @BeforeEach
    void setUp() throws InvalidTagFormatException, PersistenceException {
        resourceResolver = context.resourceResolver();
        context.load().json(NEW_CONTENT_STRUCTURE_JSON, PAGE_PATH);
        resource = resourceResolver.getResource(PAGE_PATH);
        TagManager tagManager = resolver.adaptTo(TagManager.class);

        tagManager.createTag("dhl-article-external:default/dhl_internationalshipping", "International Shipping", "International Shipping");
        tagManager.createTag("dhl-article-external:default/e-commerce_advice", "e-Commerce advice", "e-Commerce advice");
        tagManager.createTag("dhl-article-external:default/business_advice", "Business Advice", "Business Advice");
        tagManager.createTag("dhl-article-internal:hidden", "Hidden", "Hidden");
        tagManager.createTag("dhlsuggested:Business", "Business", "Business");
        tagManager.createTag("dhlsuggested:China", "China", "China");
        tagManager.createTag("dhlsuggested:Small-business", "small business", "small business");
        tagManager.createTag("dhl-author-highlights:recommended", "recommended", "recommended");

        createTagWithLocalizedNames("dhl:logistics", "Global Logistics", Map.of("uk", "Глобальна логістика"));
    }

    private void createTagWithLocalizedNames(String TagID, String title, Map<String, String> localizedNamed) throws InvalidTagFormatException, PersistenceException {
        TagManager tagManager = resolver.adaptTo(TagManager.class);
        Tag tag = tagManager.createTag(TagID, title, title);
        Resource tagResource = resolver.getResource(tag.getPath());
        ModifiableValueMap properties = tagResource.adaptTo(ModifiableValueMap.class);

        for (Map.Entry<String, String> entry : localizedNamed.entrySet()) {
            String languageNodeName = "jcr:title." + entry.getKey();
            properties.put(languageNodeName, entry.getValue());
        }

        resolver.commit();
    }

    @Test
    void getTagsContainingWords_ShouldReturnTagWithLocalTranslation_WhenContainsNonEnglishTitle() {
        Locale locale = Locale.forLanguageTag("uk-ua");

        List<Tag> tags = tagUtilService.getTagsContainingWords(resolver, List.of("Логістика"),"dhl:",  locale);

        assertEquals(1, tags.size());
        assertEquals("dhl:logistics", tags.get(0).getTagID());
    }

    @Test
    void getTagsContainingWords_ShouldReturnTagWithDefaultTitle_WhenLocalIsEnglishButTagDoNotHaveEnglishTranslation() {
        Locale locale = Locale.forLanguageTag("en-gb");

        List<Tag> tags = tagUtilService.getTagsContainingWords(resolver, List.of("Logistics"),"dhl:",  locale);

        assertEquals(1, tags.size());
        assertEquals("dhl:logistics", tags.get(0).getTagID());
    }

    @Test
    void getTagsContainingWords_ShouldReturnEmpty_WhenLocalIsNotEnglishAndTagDoNotHaveLocalTranslation() {
        Locale locale = Locale.forLanguageTag("de");

        List<Tag> tags = tagUtilService.getTagsContainingWords(resolver, List.of("Logistics"),"dhl:",  locale);

        assertEquals(0, tags.size());
    }

    @Test
    void getTagsContainingWords_ShouldReturnEmpty_WhenWordsAreEmpty() {
        Locale locale = Locale.forLanguageTag("de");

        List<Tag> tags = tagUtilService.getTagsContainingWords(resolver, new ArrayList<>(),"dhl:",  locale);

        assertEquals(0, tags.size());
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
        Page homePage = context.resourceResolver().getResource("/content/dhl/language-masters/en-master").adaptTo(Page.class);
        when(pageUtilService.getHomePage(any(Resource.class))).thenReturn(homePage);
        when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));

        assertNotNull(tagUtilService);
        List<String> list = tagUtilService.getTrendingTopics(resource);
        assertEquals(List.of("Business", "China", "small business"), list);
    }

    @Test
    void test_getTagLocalizedSuggestionsByQuery() {
        Locale locale = Locale.forLanguageTag("uk-ua");

        List<String> suggestion = tagUtilService.getTagLocalizedSuggestionsByQuery(resolver, "Глобальна","dhl:", locale, 5);

        assertEquals(1, suggestion.size());
        assertEquals("глобальна логістика", suggestion.get(0));
    }
}
