package com.positive.dhl.core.models;

import com.day.cq.tagging.TagManager;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class ArticleTest {
    private final AemContext context = new AemContext();

    @BeforeEach
    void setUp() throws Exception {
        context.load().json("/com/positive/dhl/core/models/Article/content.json", "/content");

        TagManager tagManager = context.resourceResolver().adaptTo(TagManager.class);
        tagManager.createTag("dhl:default/dhl_internationalshipping", "International Shipping", "International Shipping");
        tagManager.createTag("dhl:default/e-commerce_advice", "e-Commerce advice", "e-Commerce advice");
        tagManager.createTag("dhl:default/business_advice", "Business Advice", "Business Advice");
    }

    @Test
    void init_ShouldInitArticle() {
        Article article = new Article("/content/home/small-business-advice/article", context.resourceResolver());

        assertArrayEquals(new String[]{"#eCommerceAdvice", "#InternationalShipping", "#BusinessAdvice"}, article.getTagsToShow().toArray());
        assertEquals("From Waybills to Export Licenses, this guide breaks down the jargon to help you navigate customs seamlessly. ", article.getBrief());
        assertEquals("What paperwork do I need for international shipping?", article.getDescription());
        assertEquals("Anna Thompson", article.getAuthor());
        assertEquals("/content/dam/global-master/8-site-images/roundels/anna_thompson.jpg", article.getAuthorimage());
        assertEquals("Discover content team", article.getAuthortitle());
        assertEquals("2023-08-04", article.getCreated());
        assertEquals("04 August 2023", article.getCreatedfriendly());
        assertEquals("What paperwork do I need for international shipping?", article.getFullTitle());
        assertEquals("#SmallBusinessAdvice", article.getGroupTag());
        assertEquals("/content/home/small-business-advice", article.getGrouppath());
        assertEquals("Small Business advice", article.getGrouptitle());
        assertEquals(true, article.getValid());
        assertNull(article.getThird());
        assertEquals("/content/dam/desktop.jpg", article.getHeroimagedt());
        assertEquals("/content/dam/mobile.jpg", article.getHeroimagemob());
        assertEquals("/content/dam/tablet.jpg", article.getHeroimagetab());
    }
}