package com.positive.dhl.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.ArrayList;

import static com.positive.dhl.junitUtils.Constants.NEW_CONTENT_STRUCTURE_JSON;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class ArticleListTest {
    private AemContext context = new AemContext();

    @BeforeEach
    void init() {
        context.addModelsForClasses(ArticleList.class);
        context.load().json(NEW_CONTENT_STRUCTURE_JSON, "/content");
    }

    @Test
    void test() {
        ArticleList list = context.resourceResolver().getResource("/content").adaptTo(ArticleList.class);

        assertNotNull(list);
        assertEquals(0, list.getArticles().size());

        list.setArticles(new ArrayList<>());

        assertEquals(0, list.getArticles().size());
    }
}