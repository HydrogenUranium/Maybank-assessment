package com.positive.dhl.core.models;

import static com.positive.dhl.core.utils.InjectorMock.mockInject;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.text.DateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import com.day.cq.wcm.api.Page;
import com.positive.dhl.core.injectors.AssetInjector;
import com.positive.dhl.core.injectors.HomePropertyInjector;
import com.positive.dhl.core.services.PageUtilService;
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

import com.positive.dhl.core.components.EnvironmentConfiguration;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticlePageTest {
	public static final String TEST_RESOURCE_PATH = "/com/positive/dhl/core/newContentStructure.json";
	public static final String ROOT_TEST_PAGE_PATH = "/content";
	public static final String ARTICLE_WITH_NEW_ARTICLE_SETUP_RESOURCE_PATH = "/content/dhl/global/en-global/category-page/article-page-with-new-article-setup";
	public static final String ARTICLE_WITHOUT_NEW_ARTICLE_SETUP_RESOURCE_PATH = "/content/dhl/us/en-us/category-page/article-page-without-new-article-setup";

	private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
	private final MockSlingHttpServletRequest request = context.request();
	private final ResourceResolver resourceResolver = context.resourceResolver();

	private final LocalDateTime localDateTime = LocalDateTime.now();

	@Mock
	private PageUtilService pageUtils;

	@Mock
	private EnvironmentConfiguration environmentConfiguration;

	@InjectMocks
	private HomePropertyInjector homePropertyInjector;

	@InjectMocks
	private AssetInjector assetInjector;

	@BeforeEach
	void setUp() {
		context.registerService(Injector.class, assetInjector);
		context.registerService(Injector.class, homePropertyInjector);
		context.registerService(EnvironmentConfiguration.class, environmentConfiguration);
		context.registerService(PageUtilService.class, new PageUtilService());
		context.addModelsForClasses(ArticlePage.class);

		context.load().json(TEST_RESOURCE_PATH, ROOT_TEST_PAGE_PATH);

		when(environmentConfiguration.getAkamaiHostname()).thenReturn("www.dhl.com");
		when(environmentConfiguration.getAssetPrefix()).thenReturn("/discover");
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
		when(pageUtils.getHomePage(any())).thenReturn(context.resourceResolver().getResource(homePagePath).adaptTo(Page.class));
	}

	@Test
	void test() {
		initRequest(ARTICLE_WITH_NEW_ARTICLE_SETUP_RESOURCE_PATH);
		mockHomePage(ARTICLE_WITH_NEW_ARTICLE_SETUP_RESOURCE_PATH);

		ArticlePage articlePage = request.adaptTo(ArticlePage.class);
		testArticlePage(articlePage);

		Article article = articlePage.getArticle();
		testArticle(article);

		testArticleSettersGetters();
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
		assertNull(articlePage.getSmartShareButtonsIconPath());
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
		assertNull(article.getCurrent());
		assertEquals(0, article.getIndex());
		assertNull(article.getThird());
		assertNull(article.getFourth());
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
		assertEquals("/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/1-Header-AOB-Mobile-991X558.jpg", article.getListimage());
		assertEquals("/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/1-Header-AOB-Mobile-991X558.jpg", article.getHeroimagemob());
		assertEquals("/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/1-Header-AOB-Mobile-991X558.jpg", article.getHeroimagetab());
		assertEquals("/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/Header_AOB_Desktop_1920x918_2.jpg", article.getHeroimagedt());
		assertEquals("", article.getYoutubeid());
		assertEquals(false, article.getShowshipnow());
		assertEquals(0, article.getTags().size());
	}

	private void testArticleSettersGetters() {
		Article newArticle = new Article();
		newArticle.setValid(false);
		newArticle.setCurrent(false);
		newArticle.setIndex(1);
		newArticle.setThird(true);
		newArticle.setFourth(true);
		newArticle.setCounter(2);
		assertFalse(newArticle.isValid());
		assertFalse(newArticle.getCurrent());
		assertEquals(1, newArticle.getIndex());
		assertTrue(newArticle.getThird());
		assertTrue(newArticle.getFourth());
		assertEquals(2, newArticle.getCounter());

		newArticle.setCreatedfriendly("");
		newArticle.setCreated("");
		newArticle.setIcon("");
		newArticle.setGrouptitle("");
		newArticle.setGrouppath("");
		newArticle.setFullTitle("");
		newArticle.setTitle("");
		newArticle.setBrief("");
		newArticle.setAuthor("");
		newArticle.setAuthortitle("");
		newArticle.setAuthorimage("");
		newArticle.setReadtime("");
		newArticle.setListimage("");
		newArticle.setHeroimagemob("");
		newArticle.setHeroimagetab("");
		newArticle.setHeroimagedt("");
		newArticle.setYoutubeid("");
		newArticle.setShowshipnow(true);
		newArticle.setTags(new ArrayList<TagWrapper>());

		assertEquals("", newArticle.getCreatedfriendly());
		assertEquals("", newArticle.getCreated());
		assertEquals("", newArticle.getIcon());
		assertEquals("", newArticle.getGrouptitle());
		assertEquals("", newArticle.getGrouppath());
		assertEquals("", newArticle.getFullTitle());
		assertEquals("", newArticle.getTitle());
		assertEquals("", newArticle.getBrief());
		assertEquals("", newArticle.getAuthor());
		assertEquals("", newArticle.getAuthortitle());
		assertEquals("", newArticle.getAuthorimage());
		assertEquals("", newArticle.getReadtime());
		assertEquals("", newArticle.getListimage());
		assertEquals("", newArticle.getHeroimagemob());
		assertEquals("", newArticle.getHeroimagetab());
		assertEquals("", newArticle.getHeroimagedt());
		assertEquals("", newArticle.getYoutubeid());
		assertEquals(true, newArticle.getShowshipnow());
		assertEquals(0, newArticle.getTags().size());

		List<String> items = Article.getArticlePageTypes();
		assertTrue(items.size() > 0);
	}
}
