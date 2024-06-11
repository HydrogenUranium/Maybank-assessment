package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.injectors.HomePropertyInjector;
import com.positive.dhl.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.spi.Injector;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Objects;

import static com.positive.dhl.core.utils.Constants.NEW_CONTENT_STRUCTURE_JSON;
import static com.positive.dhl.core.utils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleAuthorBannerModelTest {
    public static final String ROOT_TEST_PAGE_PATH = "/content";
    public static final String ARTICLE_WITH_NEW_ARTICLE_SETUP_RESOURCE_PATH = "/content/dhl/global/en-global/category-page/article-page-with-new-article-setup";
    public static final String ARTICLE_WITHOUT_NEW_ARTICLE_SETUP_RESOURCE_PATH = "/content/dhl/us/en-us/category-page/article-page-without-new-article-setup";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private PageUtilService pageUtils;

    @InjectMocks
    private HomePropertyInjector homePropertyInjector;

    @BeforeEach
    void setUp() {
        context.registerService(Injector.class, homePropertyInjector);
        context.addModelsForClasses(ArticleAuthorBannerModel.class);

        context.load().json(NEW_CONTENT_STRUCTURE_JSON, ROOT_TEST_PAGE_PATH);
    }

    private void initRequest(String path) {
        request.setPathInfo(path);

        Resource currentResource = resourceResolver.getResource(path);
        request.setResource(currentResource);

        Page currentPage = Objects.requireNonNull(currentResource).adaptTo(Page.class);
        mockInject(context, "currentPage", currentPage);
    }

    private void mockHomePage(String initRequestPath) {
        String homePagePath = initRequestPath.substring(0, StringUtils.ordinalIndexOf(initRequestPath, "/", 5));
        when(pageUtils.getHomePage(any(Page.class))).thenReturn(context.resourceResolver().getResource(homePagePath).adaptTo(Page.class));
    }

    @Test
    void test_withComponentSetup() {
        initRequest(ARTICLE_WITH_NEW_ARTICLE_SETUP_RESOURCE_PATH);
        mockHomePage(ARTICLE_WITH_NEW_ARTICLE_SETUP_RESOURCE_PATH);

        ArticleAuthorBannerModel articleAuthorBannerModel = request.adaptTo(ArticleAuthorBannerModel.class);
        assertNotNull(articleAuthorBannerModel);

        assertEquals("About the Author", articleAuthorBannerModel.getTitle());
        assertEquals("Small text about Author", articleAuthorBannerModel.getBrief());
        assertEquals("Follow", articleAuthorBannerModel.getFollowLabel());
        assertEquals("#", articleAuthorBannerModel.getFollowPath());
    }

    @Test
    void test_withoutComponentSetup() {
        initRequest(ARTICLE_WITHOUT_NEW_ARTICLE_SETUP_RESOURCE_PATH);
        mockHomePage(ARTICLE_WITHOUT_NEW_ARTICLE_SETUP_RESOURCE_PATH);

        ArticleAuthorBannerModel articleAuthorBannerModel = request.adaptTo(ArticleAuthorBannerModel.class);
        assertNotNull(articleAuthorBannerModel);

        assertNull(articleAuthorBannerModel.getTitle());
        assertNull(articleAuthorBannerModel.getBrief());
        assertNull(articleAuthorBannerModel.getFollowLabel());
        assertNull(articleAuthorBannerModel.getFollowPath());
    }
}
