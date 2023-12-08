package com.positive.dhl.core.models;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class CategoryListingItemTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private QueryBuilder mockQueryBuilder;

    @Mock
    private Query page1MockQuery;

    @Mock
    private SearchResult searchResult;

    @Mock
    private Hit hit;

    @Mock
    private Iterator<Resource> resourceIterator;

    @BeforeEach
    void setUp() throws Exception {
        ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
        ctx.addModelsForClasses(CategoryListingItem.class);
    }

    @Test
    void test() throws RepositoryException {
        Mockito.when(mockQueryBuilder.createQuery(any(PredicateGroup.class), any(Session.class))).thenReturn(page1MockQuery);
        ctx.currentResource("/content/dhl/country/en/culture/dhl-mo-salah");

        when(page1MockQuery.getResult()).thenReturn(searchResult);
        when(searchResult.getHits()).thenReturn(List.of(hit));
        Resource articlePageResource = ctx.resourceResolver().getResource("/content/dhl/country/en/culture/dhl-mo-salah/jcr:content");
        when(hit.getProperties()).thenReturn(articlePageResource.getValueMap());
        when(hit.getPath()).thenReturn("/content/dhl/country/en/culture/dhl-mo-salah");
        when(searchResult.getResources()).thenReturn(resourceIterator);

        CategoryListingItem categoryListingItem = new CategoryListingItem("/content/dhl/country/en/culture/dhl-mo-salah", mockQueryBuilder, ctx.resourceResolver());
        assertNotNull(categoryListingItem);

        assertEquals("Find out how DHL helped Mo Salah", categoryListingItem.getName());
        assertEquals(1, categoryListingItem.getArticles().size());

        categoryListingItem.setName("name");
        assertEquals("name", categoryListingItem.getName());

        categoryListingItem.setArticles(List.of(new Article(), new Article()));
        assertEquals(2, categoryListingItem.getArticles().size());

    }
}