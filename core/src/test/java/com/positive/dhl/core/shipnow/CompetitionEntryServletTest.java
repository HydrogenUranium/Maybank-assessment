package com.positive.dhl.core.shipnow;

import com.day.commons.datasource.poolservice.DataSourcePool;
import com.positive.dhl.core.shipnow.servlets.CompetitionEntryServlet;
import com.positive.dhl.core.shipnow.servlets.NewsletterSignupServlet;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class CompetitionEntryServletTest {
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
    CompetitionEntryServlet servlet = new CompetitionEntryServlet();

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
		Map<String, Object> params = new HashMap<String, Object>();
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);

        SlingHttpServletResponse response = mock(SlingHttpServletResponse.class);

        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(writer);

        servlet.doPost(request, response);

		assertTrue(stringWriter.toString().contains("email not valid"));
	}
	
	@Test
	void test() throws IOException {
		Map<String, Object> params = new HashMap<String, Object>();
        params.put("email", "test@email.com");
        params.put("firstname", "the-firstname");
        params.put("lastname", "the-lastname");
        params.put("path", "/path/to/the/page");

        params.put("contact", "contact-details");
        params.put("position", "the-position");
        params.put("sector", "the-sector");
        params.put("size", "the-sze");

        params.put("answer", "");
        params.put("answer2", "");
        params.put("answer3", "");
        params.put("answer4", "");
        params.put("answer5", "");

        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);

        SlingHttpServletResponse response = mock(SlingHttpServletResponse.class);

        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(writer);

        servlet.doPost(request, response);

		assertEquals("{\"status\":\"OK\",\"email\":\"test@email.com\"}", stringWriter.toString());
	}
}