package com.positive.dhl.core.shipnow;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.day.commons.datasource.poolservice.DataSourcePool;

import com.positive.dhl.core.servlets.NewsletterSignupServlet;

import io.wcm.testing.mock.aem.junit5.AemContext;

class NewsletterSignupServletTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    DataSource dataSource;
    
    @Mock
    Connection connection;
    
    @Mock
    PreparedStatement statement;

    @Mock
    ResultSet results;
    
    @Mock
    DataSourcePool dataSourcePool;
    
    @InjectMocks
    NewsletterSignupServlet shipNowServlet = new NewsletterSignupServlet();

	@BeforeEach
	public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
        
		Mockito.when(dataSourcePool.getDataSource(anyString())).thenReturn(dataSource);
		Mockito.when(dataSource.getConnection()).thenReturn(connection);
		Mockito.when(connection.prepareStatement(anyString())).thenReturn(statement);
		Mockito.when(statement.executeQuery()).thenReturn(results);
		Mockito.when(statement.executeUpdate()).thenReturn(1);
	}
	
	@Test
	void testFailure() throws IOException {
		Map<String, Object> params = new HashMap<>();
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);

        SlingHttpServletResponse response = mock(SlingHttpServletResponse.class);

        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(writer);
        
        shipNowServlet.doPost(request, response);

		assertTrue(stringWriter.toString().contains("email not valid"));
	}
	
	@Test
	void test() throws IOException {
		Map<String, Object> params = new HashMap<>();
        params.put("home", "/content/dhl/en-global");
        params.put("email", "test@email.com");

        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);

        SlingHttpServletResponse response = mock(SlingHttpServletResponse.class);

        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(writer);
        
        shipNowServlet.doPost(request, response);

		assertEquals("{\"status\":\"OK\",\"email\":\"test@email.com\"}", stringWriter.toString());
	}
}