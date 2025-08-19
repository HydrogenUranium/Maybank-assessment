package com.dhl.discover.core.services.schema.impl;

import com.adobe.cq.wcm.core.components.models.Image;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.constants.SchemaMarkupType;
import com.dhl.discover.core.models.Article;
import com.dhl.discover.core.services.ArticleUtilService;
import com.google.gson.JsonObject;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.PathUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static com.dhl.discover.core.utils.SchemaMarkupUtils.createSchema;
import static com.dhl.discover.core.utils.SchemaMarkupUtils.createType;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class BlogPostingSchemaAdapterTest {
    private static final String RESOURCE_PATH = "/content/home/category/article/jcr:content";
    private static final String ARTICLE_PATH = "/content/home/category/article";

    AemContext context = new AemContext();
    ResourceResolver resolver = context.resourceResolver();

    @Mock
    private PathUtilService pathUtilService;

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private ArticleUtilService articleUtilService;

    @InjectMocks
    private BlogPostingSchemaAdapter blogPostingSchemaAdapter;

    @Mock
    private Article article;

    @Mock
    private Image featuredImage;

    private Page homePage;

    @BeforeEach
    void setUp() {
        context.addModelsForClasses(Article.class);
        context.registerAdapter(Resource.class, Article.class, (Function<Resource, Article>) r -> article);

        homePage = context.create().page("/content//home", "", "siteregion", "Global");
    }

    @Test
    void testCanHandle() {
        context.create().page("/content/home/category", "", "cq:Page", "");

        Map<String, Object> properties = new HashMap<>();
        properties.put("mediatype", "blogPost");
        properties.put("jcr:primaryType", "cq:PageContent");
        context.create().page("/content/home/category/article", "", properties);

        assertFalse(blogPostingSchemaAdapter.canHandle(resolver.getResource("/content/home")));
        assertTrue(blogPostingSchemaAdapter.canHandle(resolver.getResource(RESOURCE_PATH)));
    }

    @Test
    void testToJson() {
        if (resolver.getResource(ARTICLE_PATH) == null) {
            context.create().page("/content/home/category/article", "", "cq:Page", "");
        }
        if (resolver.getResource(RESOURCE_PATH) == null) {
            context.create().resource(RESOURCE_PATH, "jcr:primaryType", "nt:unstructured");
        }
        Resource articleResource = resolver.getResource(ARTICLE_PATH);
        context.request().setResource(articleResource);

        when(articleUtilService.getArticle(anyString(), any(SlingHttpServletRequest.class))).thenReturn(article);
        when(article.getPath()).thenReturn(ARTICLE_PATH);
        when(article.getFeaturedImageModel()).thenReturn(featuredImage);
        when(featuredImage.getSrc()).thenReturn("/content/dam/sample.jpg");
        when(article.getTitle()).thenReturn("Sample Blog Title");
        when(article.getDescription()).thenReturn("Sample Blog Description");
        when(pathUtilService.getFullMappedPath(anyString(), any()))
                .thenAnswer(invocationOnMock -> "https://www.example.com" + invocationOnMock.getArgument(0));
        when(pageUtilService.getHomePage(any(Resource.class))).thenReturn(homePage);

        Resource resource = resolver.resolve(RESOURCE_PATH);

        JsonObject result = blogPostingSchemaAdapter.toJson(resource, context.request());
        assertNotNull(result);

        JsonObject expected = createSchema(SchemaMarkupType.BLOG_POSTING);
        JsonObject webPage = createType(SchemaMarkupType.WEB_PAGE);
        webPage.addProperty("@id", "https://www.example.com" + ARTICLE_PATH);
        expected.add("mainEntityOfPage", webPage);

        expected.addProperty("headline", "Sample Blog Title");
        expected.addProperty("description", "Sample Blog Description");
        expected.addProperty("image", "https://www.example.com/content/dam/sample.jpg");

        JsonObject author = createType(SchemaMarkupType.ORGANIZATION);
        author.addProperty("name", "DHL Global");
        author.addProperty("url", "https://www.example.com/content/home");
        expected.add("author", author);

        JsonObject publisher = createType(SchemaMarkupType.ORGANIZATION);
        publisher.addProperty("name", "DHL");

        JsonObject logo = createType(SchemaMarkupType.IMAGE_OBJECT);
        logo.addProperty("url", "https://www.dhl.com/etc.clientlibs/dhl/clientlibs/discover/resources/img/new-logo.svg");
        publisher.add("logo", logo);

        expected.add("publisher", publisher);
        expected.addProperty("datePublished", article.getCreated("yyyy-MM-dd'T'HH:mm:ss'Z'"));

        assertEquals(expected, result);
    }

}