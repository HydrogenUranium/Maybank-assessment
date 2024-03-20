package com.positive.dhl.core.models;

import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
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
import org.junit.platform.commons.util.StringUtils;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleGridTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);

	@Mock
	private PageUtilService pageUtilService;

	@Mock
	private TagUtilService tagUtilService;

	@Mock
	private PathUtilService pathUtilService;

	@Mock
    private QueryBuilder mockQueryBuilder;

	@Mock
	private ResourceResolverHelper resourceResolverHelper;

	@Mock
	private SearchResult searchResult;

    @Mock
    private Query pageQuery;

	@Mock
	private RepositoryChecks repositoryChecks;

	@Mock
	private CategoryFinder categoryFinder;

	@Mock
	private Hit hit;

	@Mock
	private ValueMap hitProperties;

	ResourceResolver resourceResolver;

	@BeforeEach
	void setUp() throws Exception {
		resourceResolver = ctx.resourceResolver();
    	ctx.load().json("/com/positive/dhl/core/models/en-global-content.json", "/content/dhl/en-global");
		ctx.load().json("/com/positive/dhl/core/models/business-entrepreneurship.json","/content/dhl/en-global/business/entrepreneurship");
    	ctx.registerService(QueryBuilder.class, mockQueryBuilder);
		ctx.registerService(RepositoryChecks.class, repositoryChecks);
		ctx.registerService(ResourceResolverHelper.class,resourceResolverHelper);
		ctx.registerService(CategoryFinder.class, categoryFinder);
		ctx.registerService(PageUtilService.class, pageUtilService);
		ctx.registerService(TagUtilService.class, tagUtilService);
		ctx.registerService(PathUtilService.class, pathUtilService);

    	ctx.addModelsForClasses(ArticleGrid.class);
		when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resourceResolver);

		lenient().when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));
		lenient().when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#CategoryPage"));
		lenient().when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#CategoryPage");
	}

	@Test
	void verifyFallbackWithQuery() throws RepositoryException {
		Article article = createArticleModel(ctx.resourceResolver().getResource("/content/dhl/en-global/business/entrepreneurship/kulani-kinis-company-profile"));
		lenient().when(pageUtilService.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

		List<Hit> hitList = new ArrayList<>();
		hitList.add(hit);
    	when(categoryFinder.executeQuery(anyMap(),any(ResourceResolver.class))).thenReturn(searchResult);
		when(searchResult.getHits()).thenReturn(hitList);
		when(hit.getProperties()).thenReturn(hitProperties);
		when(hitProperties.get(eq("hideInNav"),anyBoolean())).thenReturn(false);
		when(hit.getPath()).thenReturn("/content/dhl/en-global/business/entrepreneurship/kulani-kinis-company-profile");

		Map<String,Object> enGlobalProps = new HashMap<>();
		enGlobalProps.put("category0","/content/dhl/en-global/business/entrepreneurship");
		enGlobalProps.put("category1","/content/dhl/en-global/e-commerce/e-commerce-advice");
		enGlobalProps.put("category2","/content/dhl/en-global/e-commerce/international-guides");
		enGlobalProps.put("category3","/content/dhl/en-global/business/managing-your-business");
		enGlobalProps.put("sling:resourceType","dhl/components/content/articlegrid");

		ctx.build().resource("/content/dhl/en-global/jcr:content/par/articlegrid",enGlobalProps);
		ctx.currentResource("/content/dhl/en-global/jcr:content/par/articlegrid");

		Map<String, Object> params = new HashMap<>();
		params.put("mode", "latest");

    	MockSlingHttpServletRequest request = ctx.request();
    	request.setParameterMap(params);

		ArticleGrid articleGrid = request.adaptTo(ArticleGrid.class);
		List<Article> articleList = Objects.requireNonNull(articleGrid).getArticles();
		assertEquals("/content/dhl/en-global/business/entrepreneurship/kulani-kinis-company-profile", articleList.get(0).path);
	}

	@Test
	void verifyModeLatest() {
		ctx.load().json("/com/positive/dhl/core/models/articelgrid.json","/content/dhl/en-global/jcr:content/par/articlegrid");
		ctx.currentResource("/content/dhl/en-global/jcr:content/par/articlegrid");

		Article article = createArticleModel(ctx.resourceResolver().getResource("/content/dhl/en-global/business/entrepreneurship/kulani-kinis-company-profile"));
		lenient().when(pageUtilService.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

		Map<String, Object> params = new HashMap<>();
		params.put("mode", "latest");

		MockSlingHttpServletRequest request = ctx.request();
		request.setParameterMap(params);

		ArticleGrid articleGrid = request.adaptTo(ArticleGrid.class);
		List<Article> articleList = Objects.requireNonNull(articleGrid).getArticles();
		assertEquals(13, articleList.size());

		articleGrid.setArticles(List.of(new Article()));
		assertEquals(1, articleGrid.getArticles().size());

		articleGrid.setCategories(List.of(new CategoryLink("category", "name", "link")));
		assertEquals(1, articleGrid.getCategories().size());

		articleGrid.setMode("mode");
		assertEquals("mode", articleGrid.getMode());

	}

	private Article createArticleModel(Resource resource) {
		return ctx.getService(ModelFactory.class).createModel(resource, Article.class);
	}
}
