package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.*;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.positive.dhl.core.services.CategoryFinder;
import com.positive.dhl.core.services.RepositoryChecks;
import com.positive.dhl.core.services.ResourceResolverHelper;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.Mock;
import org.mockito.Mockito;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleGridTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

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

    ctx.addModelsForClasses(ArticleGrid.class);
		when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resourceResolver);
	}

	@Test
	void verifyFallbackWithQuery() throws RepositoryException {
		List<Hit> hitList = new ArrayList<>();
		hitList.add(hit);
    when(categoryFinder.executeQuery(anyMap(),any(ResourceResolver.class))).thenReturn(searchResult);
		when(searchResult.getHits()).thenReturn(hitList);
		when(hit.getProperties()).thenReturn(hitProperties);
		when(hitProperties.get(eq("hideInNav"),anyBoolean())).thenReturn(false);
		when(hit.getPath()).thenReturn("dummy-hit-path");

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
		assertEquals(articleList.get(0).path,"dummy-hit-path");
	}

	@Test
	void verifyModeLatest() {
		ctx.load().json("/com/positive/dhl/core/models/articelgrid.json","/content/dhl/en-global/jcr:content/par/articlegrid");
		ctx.currentResource("/content/dhl/en-global/jcr:content/par/articlegrid");

		Map<String, Object> params = new HashMap<>();
		params.put("mode", "latest");

		MockSlingHttpServletRequest request = ctx.request();
		request.setParameterMap(params);

		ArticleGrid articleGrid = request.adaptTo(ArticleGrid.class);
		List<Article> articleList = Objects.requireNonNull(articleGrid).getArticles();
		assertEquals(4, articleList.size());
	}
}