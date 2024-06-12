package com.positive.dhl.core.models;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.components.EnvironmentConfiguration;
import com.positive.dhl.core.injectors.HomePropertyInjector;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.PathUtilService;
import com.positive.dhl.core.services.TagUtilService;
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

import java.text.DateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Date;
import java.util.Locale;
import java.util.Objects;

import static com.positive.dhl.core.utils.Constants.NEW_CONTENT_STRUCTURE_JSON;
import static com.positive.dhl.core.utils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticlePageTest {
	public static final String ROOT_TEST_PAGE_PATH = "/content";
	public static final String ARTICLE_WITH_NEW_ARTICLE_SETUP_RESOURCE_PATH = "/content/dhl/global/en-global/category-page/article-page-with-new-article-setup";
	public static final String ARTICLE_WITHOUT_NEW_ARTICLE_SETUP_RESOURCE_PATH = "/content/dhl/us/en-us/category-page/article-page-without-new-article-setup";

	private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
	private final MockSlingHttpServletRequest request = context.request();
	private final ResourceResolver resourceResolver = context.resourceResolver();

	private final LocalDateTime localDateTime = LocalDateTime.now();

	@Mock
	private PageUtilService pageUtilService;

	@Mock
	private TagUtilService tagUtilService;

	@Mock
	private PathUtilService pathUtilService;

	@Mock
	private EnvironmentConfiguration environmentConfiguration;

	@InjectMocks
	private HomePropertyInjector homePropertyInjector;

	@BeforeEach
	void setUp() {
		context.registerService(Injector.class, homePropertyInjector);
		context.registerService(EnvironmentConfiguration.class, environmentConfiguration);
		context.registerService(PageUtilService.class, pageUtilService);
		context.registerService(TagUtilService.class, tagUtilService);
		context.registerService(PathUtilService.class, pathUtilService);
		context.addModelsForClasses(ArticlePage.class);

		context.load().json(NEW_CONTENT_STRUCTURE_JSON, ROOT_TEST_PAGE_PATH);

		when(environmentConfiguration.getAkamaiHostname()).thenReturn("www.dhl.com");
		when(environmentConfiguration.getAssetPrefix()).thenReturn("/discover");
		when(pageUtilService.getLocale(any(Resource.class))).thenReturn(new Locale("en"));
		when(tagUtilService.getExternalTags(any(Resource.class))).thenReturn(Arrays.asList("#BusinessAdvice", "#eCommerceAdvice", "#InternationalShipping"));
		when(tagUtilService.transformToHashtag(any(String.class))).thenReturn("#SmallBusinessAdvice");
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
	 * Returns the today's date in long format
	 * @return String representing today's date
	 */
	private String getTodayDateText(Locale locale){
		return DateFormat.getDateInstance(DateFormat.LONG, locale).format(new Date());
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
		when(pageUtilService.getHomePage(any(Page.class))).thenReturn(context.resourceResolver().getResource(homePagePath).adaptTo(Page.class));
	}

	@Test
	void test() {
		initRequest(ARTICLE_WITH_NEW_ARTICLE_SETUP_RESOURCE_PATH);
		mockHomePage(ARTICLE_WITH_NEW_ARTICLE_SETUP_RESOURCE_PATH);

		ArticlePage articlePage = request.adaptTo(ArticlePage.class);
		testArticlePage(articlePage);

		Article article = articlePage.getArticle();
		testArticle(article);
	}

	@Test
	void test_withoutComponentSetup() {
		initRequest(ARTICLE_WITHOUT_NEW_ARTICLE_SETUP_RESOURCE_PATH);
		mockHomePage(ARTICLE_WITHOUT_NEW_ARTICLE_SETUP_RESOURCE_PATH);

		ArticlePage articlePage = request.adaptTo(ArticlePage.class);
		assertNotNull(articlePage);

		Article article = articlePage.getArticle();
		assertNotNull(article);

		assertEquals("ARTICLE PAGE without new article setup", article.getFullTitle());
		assertEquals(getTodayDate(), article.getCreated());
		assertEquals(getTodayDateText(new Locale("en", "us")), article.getCreatedfriendly());
		assertEquals("", article.getReadtime());
		assertNull(articlePage.getShareOn());
		assertNull(articlePage.getSmartShareButtonsLabel());
		assertEquals("", articlePage.getSmartShareButtonsIconPath());
		assertNull(articlePage.getFollowLabel());
		assertNull(articlePage.getFollowPath());
		assertEquals(0, articlePage.getSocialNetwork().size());
	}

	private void testArticlePage(ArticlePage articlePage) {
		assertNotNull(articlePage);
		assertEquals("https://www.dhl.com/discover/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/Header_AOB_Mobile_991x558.jpg", articlePage.getOgtagimage());
		assertEquals("", articlePage.getCustomStyles());

		articlePage.setOgtagimage("");
		assertEquals("", articlePage.getOgtagimage());

		articlePage.setCustomStyles("c");
		assertEquals("c", articlePage.getCustomStyles());

		assertEquals("Share on", articlePage.getShareOn());
		assertEquals("Share", articlePage.getSmartShareButtonsLabel());
		assertEquals("/content/dam/dhl-discover/common/icons/icons8-share (1).svg", articlePage.getSmartShareButtonsIconPath());
		assertEquals("Follow", articlePage.getFollowLabel());
		assertEquals("#", articlePage.getFollowPath());
		assertEquals(3, articlePage.getSocialNetwork().size());
	}

	private void testArticle(Article article) {
		assertNotNull(article);
		assertTrue(article.isValid());
		assertFalse(article.isCurrent());
		assertEquals(0, article.getIndex());
		assertFalse(article.isThird());
		assertFalse(article.isFourth());
		assertEquals(0, article.getCounter());
		assertEquals("October 11, 2023", article.getCreatedfriendly());
		assertEquals("2023-10-11", article.getCreated());
		assertEquals("article", article.getIcon());
		assertEquals("CATEGORY PAGE", article.getGrouptitle());
		assertEquals("/content/dhl/global/en-global/category-page", article.getGrouppath());
		assertEquals("ARTICLE PAGE", article.getFullTitle());
		assertEquals("ARTICLE PAGE", article.getTitle());
		assertEquals("How subscription models are changing e-commerce habits", article.getBrief());
		assertEquals("Sansa Stark", article.getAuthor());
		assertEquals("Senior Content Writer, Discover", article.getAuthortitle());
		assertEquals("/content/dam/dhl/site-image/roundels/laptop.png", article.getAuthorimage());
		assertEquals("6 min read", article.getReadtime());
		assertEquals("/content/dam/dhl/listimage.jpg", article.getListimage());
		assertEquals("/content/dam/dhl/heroimagemob.jpg", article.getHeroimagemob());
		assertEquals("/content/dam/dhl/heroimagetab.jpg", article.getHeroimagetab());
		assertEquals("/content/dam/dhl/heroimagedt.jpg", article.getHeroimagedt());
		assertEquals("", article.getYoutubeid());
		assertFalse(article.isShowshipnow());
		assertEquals(0, article.getTags().size());
	}
}
