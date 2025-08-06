package com.dhl.discover.core.services;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.models.Article;
import com.dhl.discover.core.models.search.SearchResultEntry;
import com.dhl.discover.junitUtils.InjectorMock;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static com.dhl.discover.junitUtils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleServiceTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    private static final String HIT_PATH = "/content/home/article_1";

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private ArticleUtilService articleUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private QueryBuilder builder;

    @Mock
    private Query query;

    @Mock
    private SearchResult searchResult;

    @Mock
    private Hit hitOne;

    @Mock
    private Hit hitTwo;

    @Mock
    private ResourceResolverHelper resolverHelper;

    @Mock
    private AssetUtilService assetUtilService;

    @Captor
    private ArgumentCaptor<PredicateGroup> predicateGroupCaptor;

    @InjectMocks
    private ArticleService articleService;

    private ResourceResolver resolver;

    @Mock
    private SlingHttpServletRequest request;

    @Mock
    private Article article;

    @BeforeEach
    void setUp() throws RepositoryException {
        context.load().json("/com/dhl/discover/core/services/ArticleServiceTest/content.json", "/content");
        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(AssetUtilService.class, assetUtilService);
        context.addModelsForClasses(Article.class);

        mockInject(context, InjectorMock.INJECT_CHILD_IMAGE_MODEL, "jcr:content/cq:featuredimage", null);

        lenient().when(builder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(query);
        lenient().when(query.getResult()).thenReturn(searchResult);
        lenient().when(hitOne.getPath()).thenReturn("/content/home/article_1");
        lenient().when(hitTwo.getPath()).thenReturn("/content/home/article_2");
        lenient().when(searchResult.getHits()).thenReturn(List.of(hitOne, hitTwo));
        resolver = spy(context.resourceResolver());
        lenient().doNothing().when(resolver).close();
        lenient().when(resolverHelper.getReadResourceResolver()).thenReturn(resolver);
        when(assetUtilService.getThumbnailLink(any())).thenReturn("/thumbnail.png");

        lenient().when(pageUtilService.getLocale(any(Resource.class))).thenReturn(Locale.forLanguageTag("en"));
        lenient().when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#CategoryPage"));
        lenient().when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#CategoryPage");

        Article article1 = createArticleModel(context.resourceResolver().getResource("/content/home/article_1"));
        Article article2 = createArticleModel(context.resourceResolver().getResource("/content/home/article_2"));
        lenient().when(articleUtilService.getArticle(eq("/content/home/article_1"), any(ResourceResolver.class))).thenReturn(article1);
        lenient().when(articleUtilService.getArticle(eq("/content/home/article_2"), any(ResourceResolver.class))).thenReturn(article2);
        lenient().when(articleUtilService.getArticle(eq("/content/home/article_1"), any(SlingHttpServletRequest.class))).thenReturn(article1);
        lenient().when(articleUtilService.getArticle(eq("/content/home/article_2"), any(SlingHttpServletRequest.class))).thenReturn(article2);

        lenient().when(request.getResourceResolver()).thenReturn(resolver);

        lenient().when(hitOne.getPath()).thenReturn(HIT_PATH);
        lenient().when(articleUtilService.getArticle(HIT_PATH, request)).thenReturn(article);
        lenient().when(articleUtilService.getArticle(HIT_PATH, resolver)).thenReturn(article);
        lenient().when(article.isValid()).thenReturn(true);
        lenient().when(searchResult.getHits()).thenReturn(List.of(hitOne));
    }

    private Article createArticleModel(Resource resource) {
        return context.getService(ModelFactory.class).createModel(resource, Article.class);
    }

    void verifyQuery(String... expectedQueries) {
        verify(builder, times(expectedQueries.length)).createQuery(predicateGroupCaptor.capture(), any(Session.class));
        List<PredicateGroup> predicateGroups = predicateGroupCaptor.getAllValues();
        for (int i = 0; i < expectedQueries.length; i++) {
            String expectedQuery = expectedQueries[i].replaceAll("\\s+", "").trim();
            String actualQuery = predicateGroups.get(i).toString().replaceAll("\\s+", "").trim();
            assertEquals(expectedQuery, actualQuery, "Query mismatch at index " + i);
        }
    }

    @Test
    void getLatestArticles_ShouldBuildProperQueries() {
        String expectedFirstQuery = """
            ROOT=group: limit=2, excerpt=true[
                {group=group: or=true[
                    {1_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/article}
                    {3_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/animated-page}
                ]}
                {orderby=orderby: orderby=@jcr:content/custompublishdate, sort=desc}
                {path=path: path=/content/home}
                {type=type: type=cq:Page}
                {1_property=property: property=jcr:content/custompublishdate, operation=exists}
            ]
            """;

        String expectedSecondQuery = """
            ROOT=group: limit=2, excerpt=true[
                {group=group: or=true[
                    {1_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/article}
                    {3_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/animated-page}
                ]}
                {orderby=orderby: orderby=@jcr:content/cq:lastModified, sort=desc}
                {path=path: path=/content/home}
                {type=type: type=cq:Page}
                {1_property=property: property=jcr:content/custompublishdate, operation=not}
            ]
            """;

        String expectedThirdQuery = """
            ROOT=group: limit=2, excerpt=true[
                {group=group: or=true[
                    {1_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/article}
                    {3_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/animated-page}
                ]}
                {orderby=orderby: orderby=@jcr:content/jcr:created, sort=desc}
                {path=path: path=/content/home}
                {type=type: type=cq:Page}
                {1_property=property: property=jcr:content/custompublishdate, operation=not}
            ]
            """;

        articleService.getLatestArticles("/content/home", 2);

        verifyQuery(expectedFirstQuery, expectedSecondQuery, expectedThirdQuery);
    }

    @Test
    void getAllArticles_ShouldBuildProperQuery() {
        String expectedQuery = """
            ROOT=group: limit=-1, excerpt=true[
                {group=group: or=true[
                    {1_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/article}
                    {3_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/animated-page}
                ]}
                {path=path: path=/content/home}
                {type=type: type=cq:Page}
            ]
            """;
        articleService.getAllArticles(resolver.getResource("/content/home").adaptTo(Page.class));

        verifyQuery(expectedQuery);
    }

    @Test
    void findArticlesByPageProperties_ShouldBuildProperQuery() {
        String expectedQuery = """
        ROOT=group: limit=50, guessTotal=true[
            {orderby=orderby: orderby=@jcr:content/jcr:score, sort=desc}
            {path=path: path=/content/home}
            {type=type: type=cq:Page}
            {1_group=group: and=true, or=true[
                {1_group=group: [
                    {1_group=group: [
                        {1_containsIgnoreCase=containsIgnoreCase: property=jcr:content/jcr:title, value=dhl}
                    ]}
                ]}
                {2_group=group: not=true[
                    {property=property: property=jcr:content/cq:robotsTags, value=noindex, operation=like}
                    {1_group=group: [
                        {1_containsIgnoreCase=containsIgnoreCase: property=jcr:content/pageTitle, value=dhl}
                    ]}
                ]}
                {3_group=group: or=true[
                    {1_group=group: [
                        {1_containsIgnoreCase=containsIgnoreCase: property=jcr:content/navTitle, value=dhl}
                    ]}
                ]}
            ]}
        ]
        """;
        articleService.findArticlesByPageProperties("dhl", "/content/home", resolver);

        verifyQuery(expectedQuery);
    }

    @Test
    void findArticlesByFullText_ShouldBuildProperQueries() {
        String expectedFirstQuery = """
        ROOT=group: limit=50, guessTotal=true[
            {explain=explain: explain=true}
            {orderby=orderby: orderby=@jcr:content/jcr:score, sort=desc}
            {path=path: path=/content/home}
            {type=type: type=cq:Page}
            {1_group=group: and=true[
                {1_group=group: or=true[
                    {1_fulltext=fulltext: fulltext="business advice"}
                ]}
                {2_group=group: not=true[
                    {property=property: property=jcr:content/cq:robotsTags, value=noindex, operation=like}
                ]}
            ]}
        ]
        """;

        String expectedSecondQuery = """
        ROOT=group: limit=50, guessTotal=true[
            {explain=explain: explain=true}
            {orderby=orderby: orderby=@jcr:content/jcr:score, sort=desc}
            {path=path: path=/content/home}
            {type=type: type=cq:Page}
            {1_group=group: and=true[
                {1_group=group: or=true[
                    {1_fulltext=fulltext: fulltext=business}
                    {2_fulltext=fulltext: fulltext=advice}
                ]}
                {2_group=group: not=true[
                    {property=property: property=jcr:content/cq:robotsTags, value=noindex, operation=like}
                ]}
            ]}
        ]
        """;

        articleService.findArticlesByFullText("business advice", "/content/home", resolver);

        verifyQuery(expectedFirstQuery, expectedSecondQuery);
    }

    @Test
    void findArticlesByTag_ShouldBuildProperQuery() {
        String expectedQuery = """
        ROOT=group: limit=50, guessTotal=true[
            {orderby=orderby: orderby=@jcr:content/jcr:created, sort=desc}
            {path=path: path=/content/home}
            {type=type: type=cq:Page}
            {1_group=group: and=true[
                {1_group=group: or=true[
                    {0_property=property: property=@jcr:content/cq:tags, value=dhl:business-advice}
                    {1_property=property: property=@jcr:content/cq:tags, value=dhl:innovation}
                ]}
                {2_group=group: not=true[
                    {property=property: property=jcr:content/cq:robotsTags, value=noindex, operation=like}
                ]}
            ]}
        ]
        """;

        articleService.findArticlesByTag(List.of("dhl:business-advice", "dhl:innovation"), "/content/home", resolver);

        verifyQuery(expectedQuery);
    }

    @Test
    void testSearchArticles_WithSlingHttpServletRequest_ShouldReturnSearchResultEntries() {
        // Arrange
        Map<String, String> props = Map.of("path", "/content/home");

        // Act
        List<SearchResultEntry> result = articleService.searchArticles(props, request);

        // Assert
        assertEquals(1, result.size());
        assertEquals(article, result.get(0).getArticle());
        verify(articleUtilService).getArticle(HIT_PATH, request);
    }

    @Test
    void testSearchArticles_WithResourceResolver_ShouldReturnSearchResultEntries() {
        // Arrange
        Map<String, String> props = Map.of("path", "/content/home");

        // Act
        List<SearchResultEntry> result = articleService.searchArticles(props, resolver);

        // Assert
        assertEquals(1, result.size());
        assertEquals(article, result.get(0).getArticle());
        verify(articleUtilService).getArticle(HIT_PATH, resolver);
    }
    @Test
    void testGetSearchResultEntriesFromHits_WithResourceResolver() {

        // Act
        List<SearchResultEntry> result = articleService.getSearchResultEntriesFromHits(List.of(hitOne), resolver);

        // Assert
        assertEquals(1, result.size());
        assertEquals(article, result.get(0).getArticle());
        verify(articleUtilService).getArticle(HIT_PATH, resolver);
    }

    @Test
    void testGetSearchResultEntriesFromHits_WithRequest()  {

        // Act
        List<SearchResultEntry> result = articleService.getSearchResultEntriesFromHits(List.of(hitOne), request);

        // Assert
        assertEquals(1, result.size());
        assertEquals(article, result.get(0).getArticle());
        verify(articleUtilService).getArticle(HIT_PATH, request);
    }

    @Test
    void testGetSearchResultEntriesFromHits_WithRepositoryException() throws RepositoryException{
        // Arrange
        when(hitOne.getPath()).thenThrow(new RepositoryException("Test exception"));

        // Act
        List<SearchResultEntry> result = articleService.getSearchResultEntriesFromHits(List.of(hitOne), resolver);

        // Assert
        assertEquals(0, result.size());
        verify(articleUtilService, never()).getArticle(anyString(), any(ResourceResolver.class));
    }
}