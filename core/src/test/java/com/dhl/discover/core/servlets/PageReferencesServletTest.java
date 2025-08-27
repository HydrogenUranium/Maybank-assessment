package com.dhl.discover.core.servlets;

import com.dhl.discover.core.services.ReferenceService;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, AemContextExtension.class})
class PageReferencesServletTest {

    private AemContext context = new AemContext();

    private MockSlingHttpServletRequest request = context.request();
    private MockSlingHttpServletResponse response = context.response();


    @Mock
    private ResourceResolverHelper resourceResolverHelper;

    @Mock
    private ReferenceService referenceService;

    @Mock
    private Resource resource;

    @Mock
    private ResourceResolver resourceResolver;

    @InjectMocks
    private PageReferencesServlet servlet;

    @Test
    void testDoGet() throws Exception {
        request.setResource(resource);
        request.setPathInfo("/content/dhl/test");
        when(resource.getPath()).thenReturn("/content/dhl/test");
        when(resourceResolverHelper.getReadResourceResolver()).thenReturn(resourceResolver);
        when(referenceService.search(resourceResolver, "/content/dhl/test"))
                .thenReturn(new LinkedHashSet<>(Set.of("/content/dhl/page1", "/content/dhl/page2")));

        servlet.doGet(request, response);

        ObjectMapper mapper = new ObjectMapper();
        JsonNode actual = mapper.readTree(response.getOutputAsString());

        assertEquals("ok", actual.get("status").asText());
        assertEquals("/content/dhl/test", actual.get("page").asText());

        Set<String> actualRefs = StreamSupport.stream(actual.get("references").spliterator(), false)
                .map(JsonNode::asText)
                .collect(Collectors.toSet());

        assertEquals(Set.of("/content/dhl/page1", "/content/dhl/page2"), actualRefs);
    }
}