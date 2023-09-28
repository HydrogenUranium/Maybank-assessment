package com.positive.dhl.core.models;

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
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class RelatedPostsTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @BeforeEach
    void setUp() throws Exception {
        context.load().json("/com/positive/dhl/core/models/RelatedPosts/content.json", "/content");
        context.addModelsForClasses(RelatedPosts.class);
    }

    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
    }

    @Test
    void init_ShouldInitRelatedPosts_WhenContainsCustomTitle() {
        initRequest("/content/home/jcr:content/par/related_posts_with_title");
        mockInjectHomeProperty(context, "relatedPosts-title" ,"");
        RelatedPosts relatedPosts = request.adaptTo(RelatedPosts.class);

        assertEquals("Custom Title", relatedPosts.getTitle());
        assertEquals(5, relatedPosts.getArticles().size());
    }

    @Test
    void init_ShouldInitRelatedPosts_WhenDoNotContainTitle() {
        initRequest("/content/home/jcr:content/par/related_posts_without_title");
        mockInjectHomeProperty(context, "relatedPosts-title" ,"Related Posts");
        RelatedPosts relatedPosts = request.adaptTo(RelatedPosts.class);

        assertEquals("Related Posts", relatedPosts.getTitle());
        assertEquals(5, relatedPosts.getArticles().size());
    }
}