package com.positive.dhl.core.models;

import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.services.*;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Locale;
import java.util.Date;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.anyBoolean;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.anyMap;
import static org.mockito.Mockito.eq;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleSideNavigationTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);
    private final static String PAGE_PATH = "/content/dhl/en-global/business/entrepreneurship/the-ten-minute-startup-guide";
    private final static String ARTICLE_PATH = "/content/dhl/en-global/business/entrepreneurship/effective-entrepreneurs";

    @Mock
    private QueryBuilder mockQueryBuilder;

    @Mock
    private CategoryFinder categoryFinder;

    @Mock
    private Page currentPage;

    @Mock
    private ResourceResolver resourceResolver;

    @Mock
    SearchResult searchResult;

    @Mock
    ValueMap valueMap;

    @Mock
    Hit hit;

    @Mock
    Resource articleItemsResource;

    @Mock
    private ResourceResolverHelper resourceResolverHelper;

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private AssetUtilService assetUtilService;

    @BeforeEach
    void setUp() throws Exception {
        ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
        ctx.load().json("/com/positive/dhl/core/models/articlesidenav.json", PAGE_PATH);
        ctx.load().json("/com/positive/dhl/core/models/effective-enterpreneurs.json", ARTICLE_PATH);
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
        ctx.registerService(CategoryFinder.class, categoryFinder);
        ctx.registerService(ResourceResolverHelper.class, resourceResolverHelper);
        ctx.registerService(PageUtilService.class, pageUtilService);
        ctx.registerService(TagUtilService.class, tagUtilService);
        ctx.registerService(PathUtilService.class, pathUtilService);
        ctx.registerService(AssetUtilService.class, assetUtilService);
        ctx.addModelsForClasses(ArticleSideNavigation.class);

        when(assetUtilService.getThumbnailLink(any())).thenReturn("/thumbnail.png");
        lenient().when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));
        lenient().when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#CategoryPage"));
        lenient().when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#CategoryPage");
    }

    @Test
    void idealScenarioNoItemInPage() throws RepositoryException {
        List<Hit> hitList = new ArrayList<>();
        hitList.add(hit);

        // when-then gymnastics to ensure the basic answers and decision trees actually resolve to 'ideal' scenario
        when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resourceResolver);
        when(categoryFinder.getGroupPage(anyString(), any(Page.class))).thenReturn(currentPage);
        when(categoryFinder.executeQuery(anyMap(), any(ResourceResolver.class))).thenReturn(searchResult);
        when(hit.getProperties()).thenReturn(valueMap);
        when(searchResult.getHits()).thenReturn(hitList);
        when(hit.getPath()).thenReturn("dummy-path");
        when(valueMap.get(eq("hideInNav"), anyBoolean())).thenReturn(false);
        // following when-then gymnastics is related to Article model class,that's called from ArticleSideNavigation
        Page articlePage = setUpArticlePage();

        Article article = createArticleModel(ctx.resourceResolver().getResource(articlePage.getPath()));
        when(pageUtilService.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

        ctx.currentResource("/content/dhl/country/en/culture/dhl-mo-salah");

        Map<String, Object> params = new HashMap<>();
        params.put("mode", "latest");

        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);

        ArticleSideNavigation articleSideNavigation = request.adaptTo(ArticleSideNavigation.class);
        assertNotNull(articleSideNavigation);
        assertEquals(1, articleSideNavigation.getArticles().size());
    }

    @Test
    void idealScenarioItemsInPage() {
        ctx.currentPage(PAGE_PATH);

        // when-then gymnastics to ensure the basic answers and decision trees actually resolve to 'ideal' scenario
        when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resourceResolver);

        Article article = createArticleModel(ctx.resourceResolver().getResource("/content/dhl/en-global/business/entrepreneurship/effective-entrepreneurs"));
        when(pageUtilService.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

        Map<String, Object> params = new HashMap<>();
        params.put("mode", "latest");

        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);

        ArticleSideNavigation articleSideNavigation = request.adaptTo(ArticleSideNavigation.class);
        assertNotNull(articleSideNavigation);
        assertEquals(3, articleSideNavigation.getArticles().size());
        assertEquals("/content/dhl/en-global/business/entrepreneurship/effective-entrepreneurs.html", articleSideNavigation.getArticles().get(0).path);
    }

    private Page setUpArticlePage() {
        Map<String, Object> articleSourceProperties = new HashMap<>();
        articleSourceProperties.put("custompublishdate", new Date());
        articleSourceProperties.put("mediatype", "download");
        articleSourceProperties.put("jcr:title", "article-title");
        articleSourceProperties.put("navTitle", "Article Title");
        articleSourceProperties.put("listbrief", "Hacks and shortcuts to setting up a viable small business.");
        articleSourceProperties.put("pageImage", "/content/dam/dhl/business-matters/new-launching-a-succesful-business-in-10-minutes-a-day-/Inline_370x209_Kulani Kinis Company Profile AMP_bootstrapping" +
                ".jpg");
        articleSourceProperties.put("heroimagemob", "/content/dam/dhl/business-matters/new-launching-a-succesful-business-in-10-minutes-a-day-/Inline_370x209_Kulani Kinis Company Profile " +
                "AMP_bootstrapping.jpg");
        articleSourceProperties.put("heroimagetab", "/content/dam/dhl/business-matters/new-launching-a-succesful-business-in-10-minutes-a-day-/Inline_370x209_Kulani Kinis Company Profile " +
                "AMP_bootstrapping.jpg");
        articleSourceProperties.put("heroimagedt", "/content/dam/dhl/business-matters/new-launching-a-succesful-business-in-10-minutes-a-day-/Desktop_1920x918.jpg");
        articleSourceProperties.put("readtime", "10 min read");
        articleSourceProperties.put("author", "Tomas H.");

        Page articlePage = ctx.pageManager().getPage("/content/dhl/en-global/business/entrepreneurship/the-ten-minute-startup-guide");
        if (null == articlePage) {
            return ctx.create().page("/content/dhl/en-global/business/entrepreneurship/the-ten-minute-startup-guide", "/apps/dhl/templates/dhl-article-page", articleSourceProperties);
        }
        ctx.currentPage(articlePage);
        return articlePage;
    }

    private Article createArticleModel(Resource resource) {
        return ctx.getService(ModelFactory.class).createModel(resource, Article.class);
    }
}
