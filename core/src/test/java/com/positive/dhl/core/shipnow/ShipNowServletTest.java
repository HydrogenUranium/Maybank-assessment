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

import com.positive.dhl.core.components.DotmailerComponent;
import com.positive.dhl.core.shipnow.models.ValidatedRequestEntry;
import com.positive.dhl.core.shipnow.services.ShipNowService;
import com.positive.dhl.core.shipnow.servlets.ShipNowServlet;

import io.wcm.testing.mock.aem.junit5.AemContext;

class ShipNowServletTest {
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
    DotmailerComponent dotmailerComponent;
    
    @Mock
    DataSourcePool dataSourcePool;
    
    @InjectMocks
    ShipNowServlet shipNowServlet = new ShipNowServlet();
    
	@BeforeEach
	public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
        
		Mockito.when(dataSourcePool.getDataSource(anyString())).thenReturn(dataSource);
		Mockito.when(dataSource.getConnection()).thenReturn(connection);
		Mockito.when(connection.prepareStatement(anyString())).thenReturn(statement);
		Mockito.when(statement.executeQuery()).thenReturn(results);
		Mockito.when(statement.executeUpdate()).thenReturn(1);
	    Mockito.when(dotmailerComponent.ExecuteShipNowWelcome(anyString(), anyString())).thenReturn(true);
	}
	
	@Test
	void test() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("home", "/content/dhl/en-global");
		params.put("email", "test@email.com");
		params.put("firstname", "user-firstname");
		params.put("lastname", "user-lastname");

		params.put("company", "user-company");
		params.put("phone", "user-phone");
		params.put("address", "user-address");
		params.put("postcode", "user-postcode");
		params.put("city", "user-city");
		params.put("country", "user-country");

		params.put("source", "user-source");
		params.put("lo", "user-lo");

        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);
        
		ValidatedRequestEntry entry = ShipNowService.PrepareFromRequest(request);
		assertTrue(entry.Validate());
		Boolean result = ShipNowService.Register(dataSourcePool, entry);
		assertTrue(result);
	}
	
	@Test
	void testActualServletValidationFail() throws IOException {
		Map<String, Object> params = new HashMap<String, Object>();
		
        MockSlingHttpServletRequest request = ctx.request();
        request.setParameterMap(params);

        SlingHttpServletResponse response = mock(SlingHttpServletResponse.class);
        
        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(writer);
        
        shipNowServlet.doPost(request, response);

		assertTrue(stringWriter.toString().contains("email not valid"));
		assertTrue(stringWriter.toString().contains("firstname not valid"));
	}
	
	@Test
	void testActualServletValidationSucceed() throws IOException {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("home", "/content/dhl/en-global");
		params.put("email", "test@email.com");
		params.put("firstname", "user-firstname");
		params.put("lastname", "user-lastname");

		params.put("company", "user-company");
		params.put("phone", "user-phone");
		params.put("address", "user-address");
		params.put("postcode", "user-postcode");
		params.put("city", "user-city");
		params.put("country", "user-country");

		params.put("source", "user-source");
		params.put("lo", "user-lo");

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