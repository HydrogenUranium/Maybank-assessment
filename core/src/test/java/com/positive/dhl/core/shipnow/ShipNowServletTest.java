package com.positive.dhl.core.shipnow;

import com.day.commons.datasource.poolservice.DataSourcePool;
import com.positive.dhl.core.components.DotmailerComponent;
import com.positive.dhl.core.services.ShipNowService;
import com.positive.dhl.core.servlets.ShipNowServlet;
import com.positive.dhl.core.helpers.ValidatedRequestEntry;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.api.SlingHttpServletRequest;
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
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

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

		@Mock
		ValidatedRequestEntry validatedRequestEntry;

		@Mock
		ShipNowService shipNowService;
    
    @InjectMocks
    ShipNowServlet underTest;

		SlingHttpServletRequest request;
		SlingHttpServletResponse response;
    
	@BeforeEach
	public void setUp() throws Exception {
    MockitoAnnotations.initMocks(this);

		Map<String,Object> injectedServices = new HashMap<>();
		injectedServices.put("shipNowService", shipNowService);
		injectedServices.put("dataSourcePool", dataSourcePool);
		injectedServices.put("dotmailerComponent", dotmailerComponent);

		request = ctx.request();
		response = ctx.response();

		ctx.registerService(ShipNowService.class,shipNowService);
		ctx.registerService(DataSourcePool.class,dataSourcePool);
		ctx.registerService(DotmailerComponent.class,dotmailerComponent);
	  underTest = new ShipNowServlet();
		ctx.registerInjectActivateService(underTest,injectedServices);
        
		Mockito.when(dataSourcePool.getDataSource(anyString())).thenReturn(dataSource);
		Mockito.when(dataSource.getConnection()).thenReturn(connection);
		Mockito.when(connection.prepareStatement(anyString())).thenReturn(statement);
		Mockito.when(statement.executeQuery()).thenReturn(results);
		Mockito.when(statement.executeUpdate()).thenReturn(1);
    Mockito.when(dotmailerComponent.ExecuteShipNowWelcome(anyString(), anyString())).thenReturn(true);
	}
	
	@Test
	void testHappyScenario() throws IOException {
		when(shipNowService.prepareFromRequest(any(SlingHttpServletRequest.class))).thenReturn(validatedRequestEntry);
		when(shipNowService.register(any(DataSourcePool.class),any(ValidatedRequestEntry.class))).thenReturn(true);
		when(validatedRequestEntry.validate()).thenReturn(true);
		when(validatedRequestEntry.get(anyString())).thenReturn("test@dhl.com");

    MockSlingHttpServletRequest request = ctx.request();

		underTest.doPost(request,response);
		String servletResponse = ctx.response().getOutputAsString();
		assertTrue(servletResponse.contains("OK"));
	}

	@Test
	void testUnHappyScenario() throws IOException {
		when(shipNowService.prepareFromRequest(any(SlingHttpServletRequest.class))).thenReturn(validatedRequestEntry);
		when(shipNowService.register(any(DataSourcePool.class),any(ValidatedRequestEntry.class))).thenReturn(true);
		when(validatedRequestEntry.validate()).thenReturn(false);
		when(validatedRequestEntry.get(anyString())).thenReturn("test@dhl.com");

		MockSlingHttpServletRequest request = ctx.request();

		underTest.doPost(request,response);
		String servletResponse = ctx.response().getOutputAsString();
		assertTrue(servletResponse.contains("Please check the inputs and try again"));
	}
	

	@Test
	void testDataSaveFailed() throws IOException {
			when(shipNowService.prepareFromRequest(any(SlingHttpServletRequest.class))).thenReturn(validatedRequestEntry);
			when(shipNowService.register(any(DataSourcePool.class),any(ValidatedRequestEntry.class))).thenReturn(false);
			when(validatedRequestEntry.validate()).thenReturn(true);
			when(validatedRequestEntry.get(anyString())).thenReturn("unhappy.tester@dhl.com");

			MockSlingHttpServletRequest request = ctx.request();

			underTest.doPost(request,response);
			String servletResponse = ctx.response().getOutputAsString();
			assertTrue(servletResponse.contains("The record could not be saved"));
	}

}