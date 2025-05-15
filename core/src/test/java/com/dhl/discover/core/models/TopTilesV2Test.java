package com.dhl.discover.core.models;

import com.dhl.discover.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static junit.framework.Assert.assertNotNull;
import static junit.framework.Assert.assertNull;
import static junitx.framework.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.osgi.framework.Constants.SERVICE_RANKING;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class TopTilesV2Test {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private MockSlingHttpServletRequest request = context.request();
    private ResourceResolver resolver = context.resourceResolver();

    @Mock
    private ModelFactory modelFactory;

    @Mock
    private Article article;

    @Mock
    private PageUtilService pageUtilService;

    @BeforeEach
    void setUp() {
        context.load().json("/com/dhl/discover/core/models/TopTilesV2/content.json", "/content");
        context.addModelsForClasses(TopTilesV2.class);
        context.addModelsForClasses(TopTilesV2.Tile.class);
        context.registerService(ModelFactory.class, modelFactory, SERVICE_RANKING, Integer.MAX_VALUE);
        context.registerService(PageUtilService.class, pageUtilService);
        when(modelFactory.createModelFromWrappedRequest(any(MockSlingHttpServletRequest.class), any(Resource.class), any()))
                .thenAnswer(invocation -> {
                    Resource resource = invocation.getArgument(1);
                    Class<?> modelClass = invocation.getArgument(2);
                    return mockRequest(resource).adaptTo(modelClass);
                });

        when(article.getPageTitleWithBr()).thenReturn("Article Title");
        when(article.getGroupTag()).thenReturn("#GroupTag");
        when(pageUtilService.getArticle(anyString(), any(ResourceResolver.class))).thenReturn(article);

        request.setPathInfo("/content/top_tiles");
        request.setResource(resolver.getResource("/content/top_tiles"));
    }

    private MockSlingHttpServletRequest mockRequest(Resource resource) {
        MockSlingHttpServletRequest mockRequest = new MockSlingHttpServletRequest(context.resourceResolver(), context.bundleContext());
        mockRequest.setResource(resource);
        mockRequest.setPathInfo(resource.getPath());
        return mockRequest;
    }

    @Test
    void testTopTilesV2() {
        TopTilesV2 topTiles = request.adaptTo(TopTilesV2.class);
        assertNotNull(topTiles);
        assertNotNull(topTiles.getTiles());
        assertEquals(4, topTiles.getTiles().size());

        TopTilesV2.Tile tile = topTiles.getTiles().get(0);
        assertNotNull(tile);
        assertEquals("Article Title", tile.getTitle());
        assertEquals("#GroupTag", tile.getTag());
        assertEquals("high", tile.getFetchPriority());
        assertNull(tile.getSizes());
    }
}