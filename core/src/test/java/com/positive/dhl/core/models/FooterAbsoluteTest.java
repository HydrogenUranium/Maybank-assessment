package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.jcr.Session;

import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.Mock;
import org.mockito.Mockito;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class FooterAbsoluteTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private QueryBuilder mockQueryBuilder;

    @Mock
    private Query page1MockQuery;

	@BeforeEach
	void setUp() throws Exception {
	    ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
	    ctx.addModelsForClasses(FooterAbsolute.class);
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/en/register");

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("mode", "latest");
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);

        FooterAbsolute footerAbsolute = request.adaptTo(FooterAbsolute.class);
        assertNotNull(footerAbsolute);
        assertEquals("2022 &copy; DHL. All rights reserved.", footerAbsolute.getCopyrightNotice());
        assertEquals(3, footerAbsolute.getLeftLinks().size());
        assertEquals(4, footerAbsolute.getRightLinks().size());

        footerAbsolute.setCopyrightNotice("");
        footerAbsolute.setLeftLinks(new ArrayList<Link>());
        footerAbsolute.setRightLinks(new ArrayList<Link>());

        assertEquals("", footerAbsolute.getCopyrightNotice());
        assertEquals(0, footerAbsolute.getLeftLinks().size());
        assertEquals(0, footerAbsolute.getRightLinks().size());
	}
}