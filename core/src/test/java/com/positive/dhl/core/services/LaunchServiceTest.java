package com.positive.dhl.core.services;

import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class LaunchServiceTest {
    private static final String LAUNCH_PATH = "/content/launches/2024/11/12/test-launch/content/dhl/global/en-global/category/article";
    private static final String ARTICLE_PATH = "/content/dhl/global/en-global/category/article";

    private final AemContext context = new AemContext();

    private LaunchService launchService = new LaunchService();
    private Page article;
    private Page launchArticle;

    @BeforeEach
    public void setUp() {
        context.load().json("/com/positive/dhl/core/services/LaunchService/content.json", "/content");
        article = context.resourceResolver().getResource(ARTICLE_PATH).adaptTo(Page.class);
        launchArticle = context.resourceResolver().getResource(LAUNCH_PATH).adaptTo(Page.class);
    }

    @Test
    void testIsLaunchPath() {
        assertTrue(launchService.isLaunchPath(LAUNCH_PATH));
        assertFalse(launchService.isLaunchPath(ARTICLE_PATH));
    }

    @Test
    void testIsLaunchPage() {
        assertTrue(launchService.isLaunchPage(launchArticle));
        assertFalse(launchService.isLaunchPage(article));
    }

    @Test
    void testIsOutOfScope() {
        assertTrue(launchService.isOutOfScope(launchArticle.getParent()));
        assertFalse(launchService.isOutOfScope(launchArticle));
    }

    @Test
    void testExtractPageRelativePath() {
        assertEquals(ARTICLE_PATH, launchService.extractPageRelativePath(LAUNCH_PATH));
        assertNull(launchService.extractPageRelativePath(ARTICLE_PATH));
    }

    @Test
    void testGetSourcePage() {
        assertEquals(article, launchService.getSourcePage(article));
        assertEquals(article, launchService.getSourcePage(launchArticle));
        assertNull(launchService.getSourcePage(null));
    }

    @Test
    void testResolveOutOfScopeLaunchPage() {
        assertEquals(launchArticle, launchService.resolveOutOfScopeLaunchPage(launchArticle));
        assertEquals(article.getParent(), launchService.resolveOutOfScopeLaunchPage(launchArticle.getParent()));
    }
}