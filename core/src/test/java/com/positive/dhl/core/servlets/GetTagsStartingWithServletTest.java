package com.positive.dhl.core.servlets;

import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.TagUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class GetTagsStartingWithServletTest {
    private final AemContext context = new AemContext();

    private final MockSlingHttpServletRequest request = context.request();
    private final MockSlingHttpServletResponse response = context.response();

    @InjectMocks
    private GetTagsStartingWithServlet servlet;

    @Mock
    private PageUtilService pageUtilService;

    @Mock
    private TagUtilService tagUtilService;

    @BeforeEach
    void setUp() throws InvalidTagFormatException {
        TagManager tagManager = context.resourceResolver().adaptTo(TagManager.class);
        Tag logistics = tagManager.createTag("dhl:logistics", "Global Logistics", "Logistics");
        Tag business = tagManager.createTag("dhl:business", "Global Business", "Business");

        when(tagUtilService.getTagsByLocalizedPrefix(any(), eq("global"), anyString(), any()))
                .thenReturn(List.of(logistics, business));
        when(pageUtilService.getLocale(any(Resource.class))).thenReturn(Locale.ENGLISH);
    }

    @Test
    void test() throws IOException {
        request.setParameterMap(Map.of("s", "global", "homepagepath", "/content"));

        servlet.doGet(request, response);

        String responseBody = context.response().getOutputAsString();

        String expected = "{\"status\":\"ok\",\"term\":\"global\",\"results\":[\"Global Business\",\"Global Logistics\"]}";
        assertEquals(expected, responseBody);
    }

}