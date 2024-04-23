package com.positive.dhl.core.models;

import com.day.cq.search.QueryBuilder;
import com.positive.dhl.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class FooterAbsoluteTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private QueryBuilder mockQueryBuilder;

	@BeforeEach
	void setUp() throws Exception {
	    ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
        ctx.registerService(PageUtilService.class, new PageUtilService());
	    ctx.addModelsForClasses(FooterAbsolute.class);
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/country/en/register");

		Map<String, Object> params = new HashMap<>();
		params.put("mode", "latest");

    MockSlingHttpServletRequest request = ctx.request();
    request.setParameterMap(params);
		LocalDateTime localDateTime = LocalDateTime.now();
		int year = localDateTime.getYear();

    FooterAbsolute footerAbsolute = request.adaptTo(FooterAbsolute.class);
    assertNotNull(footerAbsolute);
		String copyrightString = MessageFormat.format("{0} &copy; DHL. All rights reserved.", String.valueOf(year));
    assertEquals(copyrightString, footerAbsolute.getCopyrightNotice());
    assertEquals(3, footerAbsolute.getLeftLinks().size());
    assertEquals(3, footerAbsolute.getRightLinks().size());

    footerAbsolute.setCopyrightNotice("");
    footerAbsolute.setLeftLinks(new ArrayList<>());
    footerAbsolute.setRightLinks(new ArrayList<>());

    assertEquals("", footerAbsolute.getCopyrightNotice());
    assertEquals(0, footerAbsolute.getLeftLinks().size());
    assertEquals(0, footerAbsolute.getRightLinks().size());
	}
}
