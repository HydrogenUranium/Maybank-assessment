package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class ArticlePageTest {
    private final AemContext ctx = new AemContext();

	@BeforeEach
	void setUp() throws Exception {
	    ctx.addModelsForClasses(ArticlePage.class);
	    ctx.load().json("/com/positive/dhl/core/models/StandardAemPage.json", "/content/dhl");
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/standardpage");
		
		ArticlePage articlePage = ctx.request().adaptTo(ArticlePage.class);
		assertEquals("https://discover.dhl.com/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/Header_AOB_Mobile_991x558.jpg", articlePage.getOgtagimage());
		assertEquals("", articlePage.getCustomStyles());
		
		articlePage.setOgtagimage("");
		assertEquals("", articlePage.getOgtagimage());
		
		articlePage.setCustomStyles("c");
		assertEquals("c", articlePage.getCustomStyles());
		
		Article article = articlePage.getArticle();
		assertTrue(article.getValid());
		assertNull(article.getCurrent());
		assertEquals(0, article.getIndex());
		assertNull(article.getThird());
		assertNull(article.getFourth());
		assertEquals(0, article.getCounter());
		assertEquals("28 February 2020", article.getCreatedfriendly());
		assertEquals("2020-02-28", article.getCreated());
		assertEquals("article", article.getIcon());
		assertEquals("", article.getGrouptitle());
		assertEquals("", article.getGrouppath());
		assertEquals("Consumer Insight: The Subscription Economy", article.getFullTitle());
		assertEquals("How the subscription economy changed online buying behaviour", article.getTitle());
		assertEquals("How subscription models are changing e-commerce habits", article.getBrief());
		assertEquals("Sam Steele", article.getAuthor());
		assertEquals("Senior Content Writer, Discover", article.getAuthortitle());
		assertEquals("/content/dam/dhl/site-image/roundels/laptop.png", article.getAuthorimage());
		assertEquals("4 min read", article.getReadtime());
		assertEquals("/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/1-Header-AOB-Mobile-991X558.jpg", article.getListimage());
		assertEquals("/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/1-Header-AOB-Mobile-991X558.jpg", article.getHeroimagemob());
		assertEquals("/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/1-Header-AOB-Mobile-991X558.jpg", article.getHeroimagetab());
		assertEquals("/content/dam/dhl/business-matters/4_finding-new-customers/consumer-insight--the-subscription-economy/Header_AOB_Desktop_1920x918_2.jpg", article.getHeroimagedt());
		assertEquals("", article.getYoutubeid());
		assertEquals(false, article.getShowshipnow());
		assertEquals(0, article.getTags().size());
		

		Article newArticle = new Article();
		newArticle.setValid(false);
		newArticle.setCurrent(false);
		newArticle.setIndex(1);
		newArticle.setThird(true);
		newArticle.setFourth(true);
		newArticle.setCounter(2);
		assertFalse(newArticle.getValid());
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
		
		List<String> items = Article.GetArticlePageTypes();
		assertTrue(items.size() > 0);
	}

}
