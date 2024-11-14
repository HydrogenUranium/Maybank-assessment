package com.dhl.discover.core.filters;

import org.apache.sling.testing.mock.sling.servlet.MockRequestDispatcherFactory;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.dhl.discover.core.components.EnvironmentConfiguration;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import javax.servlet.FilterChain;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ForwardFilterTest {
	private final AemContext context = new AemContext();

	@InjectMocks
	private ForwardFilter underTest;

	@Mock
	private EnvironmentConfiguration environmentConfiguration;

	@Mock
	FilterChain filterChain;

	@Mock
	RequestDispatcher requestDispatcher;

	@Mock
	MockRequestDispatcherFactory mockRequestDispatcherFactory;

	MockSlingHttpServletRequest slingHttpServletRequest;
	MockSlingHttpServletResponse slingHttpServletResponse;

	@BeforeEach
	void setUp() {
		slingHttpServletResponse = context.response();
		slingHttpServletRequest = context.request();
		slingHttpServletRequest.setRequestDispatcherFactory(mockRequestDispatcherFactory);
	}

	@Test
	void doFilterNegative() throws ServletException, IOException {
		when(environmentConfiguration.getAssetPrefix()).thenReturn("/discover");

		context.create().resource("/dummyLocation");
		Map<String,Object> requestMap = new HashMap<>();
		requestMap.put("formStart", "/dummyLocation");
		slingHttpServletRequest.setParameterMap(requestMap);
		underTest.doFilter(slingHttpServletRequest,slingHttpServletResponse,filterChain);

		verifyNoInteractions(requestDispatcher);
	}

	@Test
	void doFilterNonExistentResource() throws ServletException, IOException {
		when(environmentConfiguration.getAssetPrefix()).thenReturn("/discover");

		Map<String,Object> requestMap = new HashMap<>();
		requestMap.put("formStart", "/dummyLocation");
		slingHttpServletRequest.setParameterMap(requestMap);
		underTest.doFilter(slingHttpServletRequest,slingHttpServletResponse,filterChain);

		verifyNoInteractions(requestDispatcher);
	}

	@Test
	void doFilterEmptyDiscoverPrefix() throws ServletException, IOException {
		when(environmentConfiguration.getAssetPrefix()).thenReturn("");

		Map<String,Object> requestMap = new HashMap<>();
		requestMap.put("formStart", "/dummyLocation");
		slingHttpServletRequest.setParameterMap(requestMap);
		underTest.doFilter(slingHttpServletRequest,slingHttpServletResponse,filterChain);

		verifyNoInteractions(requestDispatcher);
	}

	@Test
	void doFilterNullTarget() throws ServletException, IOException {
		lenient().when(environmentConfiguration.getAssetPrefix()).thenReturn("");

		Map<String,Object> requestMap = new HashMap<>();
		slingHttpServletRequest.setParameterMap(requestMap);
		underTest.doFilter(slingHttpServletRequest,slingHttpServletResponse,filterChain);

		verifyNoInteractions(requestDispatcher);
	}
}
