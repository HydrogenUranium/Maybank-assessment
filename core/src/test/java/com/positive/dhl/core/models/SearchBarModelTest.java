package com.positive.dhl.core.models;

import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.tagging.TagManager;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.positive.dhl.core.utils.InjectorMock.mockInjectHomeProperty;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class SearchBarModelTest {
    public static final String TEST_RESOURCE_PATH = "/com/positive/dhl/core/newContentStructure.json";
    public static final String ROOT_TEST_PAGE_PATH = "/content";
    public static final String ARTICLE_RESOURCE_PATH = "/content/dhl/us/en-us/category-page/article-page-without-new-article-setup";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @BeforeEach
    void setUp() throws InvalidTagFormatException {
        context.addModelsForClasses(SearchBarModel.class);
        context.load().json(TEST_RESOURCE_PATH, ROOT_TEST_PAGE_PATH);
    }

    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
    }

    private void mockTags() throws InvalidTagFormatException {
        TagManager tagManager = context.resourceResolver().adaptTo(TagManager.class);
        tagManager.createTag("dhlsuggested:Business", "Business", "Business");
        tagManager.createTag("dhlsuggested:China", "China", "China");
        tagManager.createTag("dhlsuggested:Small-business", "small business", "small business");
    }

    @Test
    void test_withValidSetup() throws InvalidTagFormatException {
        initRequest(ARTICLE_RESOURCE_PATH);

        mockTags();
        mockInjectHomeProperty(context, "searchBar-recentSearchesTitle" ,"Recent Searches");
        mockInjectHomeProperty(context, "searchBar-trendingTopicsTitle" ,"Trending Topics");
        mockInjectHomeProperty(context, "searchBar-articlesTitle" ,"Articles");

        SearchBarModel searchBarModel = request.adaptTo(SearchBarModel.class);
        assertNotNull(searchBarModel);

        assertEquals("Recent Searches", searchBarModel.getRecentSearchesTitle());
        assertEquals("Trending Topics", searchBarModel.getTrendingTopicsTitle());
        assertEquals("Articles", searchBarModel.getArticlesTitle());
        assertEquals("[\"Business\",\"China\",\"small business\"]", searchBarModel.getTrendingTopics());
    }

    @Test
    void test_withoutValidSetup() {
        initRequest(ARTICLE_RESOURCE_PATH);

        mockInjectHomeProperty(context, "searchBar-recentSearchesTitle" ,null);
        mockInjectHomeProperty(context, "searchBar-trendingTopicsTitle" ,null);
        mockInjectHomeProperty(context, "searchBar-articlesTitle" ,null);

        SearchBarModel searchBarModel = request.adaptTo(SearchBarModel.class);
        assertNotNull(searchBarModel);

        assertNull(searchBarModel.getRecentSearchesTitle());
        assertNull(searchBarModel.getTrendingTopicsTitle());
        assertNull(searchBarModel.getArticlesTitle());
        assertEquals("[]", searchBarModel.getTrendingTopics());
    }
}