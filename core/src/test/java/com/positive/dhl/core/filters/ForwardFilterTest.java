package com.positive.dhl.core.filters;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockRequestDispatcherFactory;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.servlet.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ForwardFilterTest {
	AemContext context = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);

	@Mock
	FilterChain filterChain;

	@Mock
	RequestDispatcher requestDispatcher;
	@Mock
	MockRequestDispatcherFactory mockRequestDispatcherFactory;
	MockSlingHttpServletRequest slingHttpServletRequest;
	MockSlingHttpServletResponse slingHttpServletResponse;

	ForwardFilter underTest;

	@BeforeEach
	void setUp() {
		slingHttpServletResponse = context.response();
		slingHttpServletRequest = context.request();
		slingHttpServletRequest.setRequestDispatcherFactory(mockRequestDispatcherFactory);
		underTest = new ForwardFilter();
	}

	@Test
	void doFilterNegative() throws ServletException, IOException {
		context.create().resource("/dummyLocation");
		Map<String,Object> requestMap = new HashMap<>();
		requestMap.put("formStart", "/dummyLocation");
		slingHttpServletRequest.setParameterMap(requestMap);
		underTest.doFilter(slingHttpServletRequest,slingHttpServletResponse,filterChain);

		verifyNoInteractions(requestDispatcher);
	}

	@Test
	void doFilterNonExistentResource() throws ServletException, IOException {
		Map<String,Object> requestMap = new HashMap<>();
		requestMap.put("formStart", "/dummyLocation");
		slingHttpServletRequest.setParameterMap(requestMap);
		underTest.doFilter(slingHttpServletRequest,slingHttpServletResponse,filterChain);

		verifyNoInteractions(requestDispatcher);
	}
}
