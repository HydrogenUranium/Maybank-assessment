package com.positive.dhl.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleShowcaseTest {
    private final AemContext context = new AemContext();

    @BeforeEach
    void setUp() throws Exception {
        context.addModelsForClasses(ArticleShowcase.class);
        context.load().json("/com/positive/dhl/core/models/ArticleShowcase/content.json", "/content");
    }

    @Test
    void init_ShouldInitArticles_WhenArticlesAreConfiguredToUseCustomPicks() {
        ArticleShowcase showcase = context.resourceResolver().getResource("/content/article-showcase").adaptTo(ArticleShowcase.class);

        assertEquals(4, showcase.getArticles().size());
    }
}