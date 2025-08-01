package com.dhl.discover.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ArticleListTest {
    private AemContext context = new AemContext();

    @Mock
    private Resource linksResource;

    @Mock
    private Resource articleResource1;

    @Mock
    private Resource articleResource2;

    @Mock
    private Article article1;

    @Mock
    private Article article2;

    private ArticleList articleList;

    @BeforeEach
    void setUp() {
        context.addModelsForClasses(ArticleList.class, Article.class);
        articleList = new ArticleList();
    }

    @Test
    void testInitWithNullLinksResource() {
        setPrivateField("linksResource", null);

        articleList.init();
        assertNotNull(articleList.getArticles());
        assertTrue(articleList.getArticles().isEmpty());
    }

    @Test
    void testInitWithEmptyLinksResource() {
        setPrivateField("linksResource", linksResource);
        when(linksResource.listChildren()).thenReturn(new EmptyResourceIterator());

        articleList.init();

        assertNotNull(articleList.getArticles());
        assertTrue(articleList.getArticles().isEmpty());
    }

    @Test
    void testInitWithValidArticles() {
        setPrivateField("linksResource", linksResource);

        List<Resource> childResources = Arrays.asList(articleResource1, articleResource2);
        Iterator<Resource> resourceIterator = childResources.iterator();
        when(linksResource.listChildren()).thenReturn(resourceIterator);
        when(articleResource1.adaptTo(Article.class)).thenReturn(article1);
        when(articleResource2.adaptTo(Article.class)).thenReturn(article2);

        articleList.init();

        List<Article> articles = articleList.getArticles();
        assertEquals(2, articles.size());

        verify(article1).setIndex(0);
        verify(article1).setFourth(false);

        verify(article2).setIndex(1);
        verify(article2).setFourth(false);
    }

    @Test
    void testInitWithNullArticleResource() {
        setPrivateField("linksResource", linksResource);

        List<Resource> childResources = Arrays.asList(articleResource1, articleResource2);
        Iterator<Resource> resourceIterator = childResources.iterator();
        when(linksResource.listChildren()).thenReturn(resourceIterator);
        when(articleResource1.adaptTo(Article.class)).thenReturn(article1);
        when(articleResource2.adaptTo(Article.class)).thenReturn(null); // This returns null

        articleList.init();

        List<Article> articles = articleList.getArticles();
        assertEquals(1, articles.size());

        verify(article1).setIndex(0);
        verify(article1).setFourth(false);
    }

    /**
     * Helper method to set a private field using reflection
     */
    private void setPrivateField(String fieldName, Object value) {
        try {
            java.lang.reflect.Field field = ArticleList.class.getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(articleList, value);
        } catch (Exception e) {
            fail("Failed to set field " + fieldName + ": " + e.getMessage());
        }
    }

    /**
     * Empty iterator implementation for resource testing
     */
    private static class EmptyResourceIterator implements Iterator<Resource> {
        @Override
        public boolean hasNext() {
            return false;
        }

        @Override
        public Resource next() {
            return null;
        }
    }
    @Test
    void test() {
        ArticleList list = new ArticleList();
        list.init();

        assertNotNull(list);
        assertEquals(0, list.getArticles().size());

        list.setArticles(new ArrayList<>());

        assertEquals(0, list.getArticles().size());
    }
}