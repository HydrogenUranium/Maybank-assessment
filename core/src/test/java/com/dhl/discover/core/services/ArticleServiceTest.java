package com.dhl.discover.core.services;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.models.Article;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleServiceTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private PageUtilService pageUtilService;

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

    @BeforeEach
    void setUp() throws RepositoryException {
        context.load().json("/com/dhl/discover/core/services/ArticleServiceTest/content.json", "/content");
        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(TagUtilService.class, tagUtilService);
        context.registerService(PathUtilService.class, pathUtilService);
        context.registerService(AssetUtilService.class, assetUtilService);
        context.addModelsForClasses(Article.class);

        lenient().when(builder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(query);
        when(query.getResult()).thenReturn(searchResult);
        when(hitOne.getPath()).thenReturn("/content/home/article_1");
        when(hitTwo.getPath()).thenReturn("/content/home/article_2");
        when(searchResult.getHits()).thenReturn(List.of(hitOne, hitTwo));
        resolver = spy(context.resourceResolver());
        lenient().doNothing().when(resolver).close();
        lenient().when(resolverHelper.getReadResourceResolver()).thenReturn(resolver);
        when(assetUtilService.getThumbnailLink(any())).thenReturn("/thumbnail.png");

        lenient().when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));
        lenient().when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#CategoryPage"));
        lenient().when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#CategoryPage");

        Article article1 = createArticleModel(context.resourceResolver().getResource("/content/home/article_1"));
        Article article2 = createArticleModel(context.resourceResolver().getResource("/content/home/article_2"));
        lenient().when(pageUtilService.getArticle(eq("/content/home/article_1"), any(ResourceResolver.class))).thenReturn(article1);
        lenient().when(pageUtilService.getArticle(eq("/content/home/article_2"), any(ResourceResolver.class))).thenReturn(article2);
    }

    private Article createArticleModel(Resource resource) {
        return context.getService(ModelFactory.class).createModel(resource, Article.class);
    }

    void verifyQuery(String... expectedQueries) {
        verify(builder, times(expectedQueries.length)).createQuery(predicateGroupCaptor.capture(), any(Session.class));
        List<PredicateGroup> predicateGroups = predicateGroupCaptor.getAllValues();
        for (int i = 0; i < expectedQueries.length; i++) {
            String expectedQuery = expectedQueries[i];
            String actualQuery = predicateGroups.get(i).toString();
            assertEquals(expectedQuery, actualQuery);
        }
    }

    @Test
    void getLatestArticles_ShouldBuildProperQueries() {
        String expectedFirstQuery =
                "ROOT=group: limit=2, excerpt=true[\n" +
                        "    {group=group: or=true[\n" +
                        "        {1_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/article}\n" +
                        "        {3_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/animated-page}\n" +
                        "    ]}\n" +
                        "    {orderby=orderby: orderby=@jcr:content/custompublishdate, sort=desc}\n" +
                        "    {path=path: path=/content/home}\n" +
                        "    {type=type: type=cq:Page}\n" +
                        "    {1_property=property: property=jcr:content/custompublishdate, operation=exists}\n" +
                        "]";

        String expectedSecondQuery =
                "ROOT=group: limit=2, excerpt=true[\n" +
                        "    {group=group: or=true[\n" +
                        "        {1_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/article}\n" +
                        "        {3_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/animated-page}\n" +
                        "    ]}\n" +
                        "    {orderby=orderby: orderby=@jcr:content/jcr:created, sort=desc}\n" +
                        "    {path=path: path=/content/home}\n" +
                        "    {type=type: type=cq:Page}\n" +
                        "    {1_property=property: property=jcr:content/custompublishdate, operation=not}\n" +
                        "]";

        articleService.getLatestArticles("/content/home", 2);

        verifyQuery(expectedFirstQuery, expectedSecondQuery);
    }

    @Test
    void getAllArticles_ShouldBuildProperQuery() {
        String expectedQuery =
                "ROOT=group: limit=-1, excerpt=true[\n" +
                        "    {group=group: or=true[\n" +
                        "        {1_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/article}\n" +
                        "        {3_property=property: property=jcr:content/cq:template, value=/conf/dhl/settings/wcm/templates/animated-page}\n" +
                        "    ]}\n" +
                        "    {path=path: path=/content/home}\n" +
                        "    {type=type: type=cq:Page}\n" +
                        "]";
        articleService.getAllArticles(resolver.getResource("/content/home").adaptTo(Page.class));

        verifyQuery(expectedQuery);
    }

    @Test
    void findArticlesByPageProperties_ShouldBuildProperQuery() {
        String expectedQuery =
                "ROOT=group: limit=50, guessTotal=true[\n" +
                        "    {orderby=orderby: orderby=@jcr:content/jcr:score, sort=desc}\n" +
                        "    {path=path: path=/content/home}\n" +
                        "    {type=type: type=cq:Page}\n" +
                        "    {1_group=group: and=true, or=true[\n" +
                        "        {1_group=group: [\n" +
                        "            {1_group=group: [\n" +
                        "                {1_containsIgnoreCase=containsIgnoreCase: property=jcr:content/jcr:title, value=dhl}\n" +
                        "            ]}\n" +
                        "        ]}\n" +
                        "        {2_group=group: not=true[\n" +
                        "            {property=property: property=jcr:content/cq:robotsTags, value=noindex, operation=like}\n" +
                        "            {1_group=group: [\n" +
                        "                {1_containsIgnoreCase=containsIgnoreCase: property=jcr:content/pageTitle, value=dhl}\n" +
                        "            ]}\n" +
                        "        ]}\n" +
                        "        {3_group=group: or=true[\n" +
                        "            {1_group=group: [\n" +
                        "                {1_containsIgnoreCase=containsIgnoreCase: property=jcr:content/navTitle, value=dhl}\n" +
                        "            ]}\n" +
                        "        ]}\n" +
                        "    ]}\n" +
                        "]";
        articleService.findArticlesByPageProperties("dhl", "/content/home", resolver);

        verifyQuery(expectedQuery);
    }

    @Test
    void findArticlesByFullText_ShouldBuildProperQueries() {
        String expectedFirstQuery =
                "ROOT=group: limit=50, guessTotal=true[\n" +
                        "    {explain=explain: explain=true}\n" +
                        "    {orderby=orderby: orderby=@jcr:content/jcr:score, sort=desc}\n" +
                        "    {path=path: path=/content/home}\n" +
                        "    {type=type: type=cq:Page}\n" +
                        "    {1_group=group: and=true[\n" +
                        "        {1_group=group: or=true[\n" +
                        "            {1_fulltext=fulltext: fulltext=\"business advice\"}\n" +
                        "        ]}\n" +
                        "        {2_group=group: not=true[\n" +
                        "            {property=property: property=jcr:content/cq:robotsTags, value=noindex, operation=like}\n" +
                        "        ]}\n" +
                        "    ]}\n" +
                        "]";

        String expectedSecondQuery =
                "ROOT=group: limit=50, guessTotal=true[\n" +
                        "    {explain=explain: explain=true}\n" +
                        "    {orderby=orderby: orderby=@jcr:content/jcr:score, sort=desc}\n" +
                        "    {path=path: path=/content/home}\n" +
                        "    {type=type: type=cq:Page}\n" +
                        "    {1_group=group: and=true[\n" +
                        "        {1_group=group: or=true[\n" +
                        "            {1_fulltext=fulltext: fulltext=business}\n" +
                        "            {2_fulltext=fulltext: fulltext=advice}\n" +
                        "        ]}\n" +
                        "        {2_group=group: not=true[\n" +
                        "            {property=property: property=jcr:content/cq:robotsTags, value=noindex, operation=like}\n" +
                        "        ]}\n" +
                        "    ]}\n" +
                        "]";

        articleService.findArticlesByFullText("business advice", "/content/home", resolver);

        verifyQuery(expectedFirstQuery, expectedSecondQuery);
    }

    @Test
    void findArticlesByTag_ShouldBuildProperQuery() {
        String expectedQuery =
                "ROOT=group: limit=50, guessTotal=true[\n" +
                "    {orderby=orderby: orderby=@jcr:content/jcr:created, sort=desc}\n" +
                "    {path=path: path=/content/home}\n" +
                "    {type=type: type=cq:Page}\n" +
                "    {1_group=group: and=true[\n" +
                "        {1_group=group: or=true[\n" +
                "            {0_property=property: property=@jcr:content/cq:tags, value=dhl:business-advice}\n" +
                "            {1_property=property: property=@jcr:content/cq:tags, value=dhl:innovation}\n" +
                "        ]}\n" +
                "        {2_group=group: not=true[\n" +
                "            {property=property: property=jcr:content/cq:robotsTags, value=noindex, operation=like}\n" +
                "        ]}\n" +
                "    ]}\n" +
                "]";

        articleService.findArticlesByTag(List.of("dhl:business-advice", "dhl:innovation"), "/content/home", resolver);

        verifyQuery(expectedQuery);
    }
}