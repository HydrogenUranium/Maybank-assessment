package com.positive.dhl.core.servlets;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class DownloadAssetServletTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    ResourceResolverFactory resourceResolverFactory;
    
	@BeforeEach
	void setUp() throws Exception {
		context.load().json("/com/positive/dhl/core/models/RegistrationsStore.json", "/content");
	}

	@Test
	void test() throws ServletException, IOException, LoginException {
		String path = "/apps/dhl/discoverdhlapi/download_asset/index.json";
		
		DownloadAssetServlet servlet = new DownloadAssetServlet();

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("assetinfo", "test");
		
        MockSlingHttpServletRequest request = context.request();
        request.setParameterMap(params);
		
		context.currentPage(context.pageManager().getPage(path));
		context.requestPathInfo().setResourcePath(path);
		servlet.doPost(request, context.response());
		
		String responseBody = context.response().getOutputAsString();
		assertTrue(responseBody.length() > 0);
	}
}