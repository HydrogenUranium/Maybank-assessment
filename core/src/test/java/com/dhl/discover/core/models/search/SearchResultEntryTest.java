package com.dhl.discover.core.models.search;

import com.dhl.discover.core.models.Article;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class SearchResultEntryTest {

    @Mock
    Article article;

    @Test
    void test() {
        SearchResultEntry entry = new SearchResultEntry(article, "excerpt");

        Assertions.assertEquals(article, entry.getArticle());
        assertEquals("excerpt", entry.getExcerpt());
    }
}