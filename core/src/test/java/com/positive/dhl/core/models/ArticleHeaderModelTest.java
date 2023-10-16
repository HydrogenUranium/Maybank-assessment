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

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

import static com.positive.dhl.core.utils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleHeaderModelTest {
    public static final String TEST_RESOURCE_PATH = "/com/positive/dhl/core/models/newContentStructure.json";
    public static final String ROOT_TEST_PAGE_PATH = "/content";
    public static final String ARTICLE_WITH_NEW_ARTICLE_SETUP_RESOURCE_PATH = "/content/dhl/global/en-global/category-page/article-page-with-new-article-setup";
    public static final String ARTICLE_WITHOUT_NEW_ARTICLE_SETUP_RESOURCE_PATH = "/content/dhl/us/en-us/category-page/article-page-without-new-article-setup";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private final MockSlingHttpServletRequest request = context.request();
    private final ResourceResolver resourceResolver = context.resourceResolver();

    private final LocalDateTime localDateTime = LocalDateTime.now();

    @Mock
    private PageUtilService pageUtils;

    @InjectMocks
    private HomePropertyInjector homePropertyInjector;

    @BeforeEach
    void setUp() {

        context.registerService(Injector.class, homePropertyInjector);
        context.addModelsForClasses(ArticleHeaderModel.class);

        context.load().json(TEST_RESOURCE_PATH, ROOT_TEST_PAGE_PATH);
    }

    /**
     * Returns the today's date in the format yyyy-MM-dd
     * @return String representing today's date
     */
    private String getTodayDate() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return localDateTime.format(formatter);
    }

    /**
     * Returns the today's date in format dd month yyyy
     * @return String representing today's date
     */
    private String getTodayDateText(){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        return localDateTime.format(formatter);
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
        when(pageUtils.getHomePage(any())).thenReturn(context.resourceResolver().getResource(homePagePath).adaptTo(Page.class));
    }

    @Test
    void test_withComponentSetup() {
        initRequest(ARTICLE_WITH_NEW_ARTICLE_SETUP_RESOURCE_PATH);
        mockHomePage(ARTICLE_WITH_NEW_ARTICLE_SETUP_RESOURCE_PATH);

        ArticleHeaderModel articleHeaderModel = request.adaptTo(ArticleHeaderModel.class);
        assertNotNull(articleHeaderModel);

        assertEquals("ARTICLE PAGE", articleHeaderModel.getArticleTitle());
        assertEquals("2023-10-11", articleHeaderModel.getPublishDate());
        assertEquals("11 October 2023", articleHeaderModel.getPublishDateFriendly());
        assertEquals("6 min read", articleHeaderModel.getReadingDuration());
        assertEquals("Share on", articleHeaderModel.getShareOn());
        assertEquals("Share", articleHeaderModel.getSmartShareButtonsLabel());
        assertEquals("/content/dam/dhl-discover/common/icons/icons8-share (1).svg", articleHeaderModel.getSmartShareButtonsIconPath());
        assertEquals("Follow", articleHeaderModel.getFollowLabel());
        assertEquals("#", articleHeaderModel.getFollowPath());
        assertEquals(3, articleHeaderModel.getSocialNetwork().size());
    }

    @Test
    void test_withoutComponentSetup() {
        initRequest(ARTICLE_WITHOUT_NEW_ARTICLE_SETUP_RESOURCE_PATH);
        mockHomePage(ARTICLE_WITHOUT_NEW_ARTICLE_SETUP_RESOURCE_PATH);

        ArticleHeaderModel articleHeaderModel = request.adaptTo(ArticleHeaderModel.class);
        assertNotNull(articleHeaderModel);

        assertEquals("ARTICLE PAGE without new article setup", articleHeaderModel.getArticleTitle());
        assertEquals(getTodayDate(), articleHeaderModel.getPublishDate());
        assertEquals(getTodayDateText(), articleHeaderModel.getPublishDateFriendly());
        assertNull(articleHeaderModel.getReadingDuration());
        assertNull(articleHeaderModel.getShareOn());
        assertNull(articleHeaderModel.getSmartShareButtonsLabel());
        assertNull(articleHeaderModel.getSmartShareButtonsIconPath());
        assertNull(articleHeaderModel.getFollowLabel());
        assertNull(articleHeaderModel.getFollowPath());
        assertEquals(0, articleHeaderModel.getSocialNetwork().size());
    }
}
