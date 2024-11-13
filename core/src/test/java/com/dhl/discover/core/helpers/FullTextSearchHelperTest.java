package com.dhl.discover.core.helpers;

import com.dhl.discover.core.utils.IndexUtils;
import com.dhl.discover.core.utils.QueryManagerUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mockStatic;

@ExtendWith(MockitoExtension.class)
class FullTextSearchHelperTest {

    @Mock
    ResourceResolver resolver;

    @Test
    void getFullTextSearchTerms() {
        var result = FullTextSearchHelper.getFullTextSearchTerms("Small Business advice");

        List<List<String>> expected = List.of(
                List.of("small business advice"),
                List.of("small business", "business advice"),
                List.of("small", "business", "advice")
        );

        assertNotNull(result);
        assertEquals(expected, result);
    }

    @Test
    void getFullTextSpellcheckedSearchTerms() {
        String string = "SmallBusiness advice";
        String searchScope = "/content/dhl/global/en-global";

        try (MockedStatic<QueryManagerUtils> queryManagerUtils = mockStatic(QueryManagerUtils.class);
             MockedStatic<IndexUtils> indexUtils = mockStatic(IndexUtils.class)) {
            queryManagerUtils.when(() -> QueryManagerUtils.getSpellcheckedWords(anyString(), anyString(), any()))
                    .thenAnswer(invocationOnMock -> {
                        if("smallbusiness".equals(invocationOnMock.getArgument(0))) {
                            return List.of("small business");
                        }
                return new ArrayList<>();
            });
            indexUtils.when(() -> IndexUtils.getSuggestionIndexName(anyString(), any()))
                    .thenReturn("someIndexName");

            var result = FullTextSearchHelper.getFullTextSpellcheckedSearchTerms(string, searchScope, resolver);
            List<List<String>> expected = List.of(
                    List.of("small business advice"),
                    List.of("business advice", "smallbusiness advice", "small business"),
                    List.of("small", "smallbusiness", "business", "advice")
            );

            assertNotNull(result);
            assertEquals(expected, result);
        }
    }
}