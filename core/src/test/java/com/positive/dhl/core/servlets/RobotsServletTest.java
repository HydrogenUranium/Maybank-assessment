package com.positive.dhl.core.servlets;

import static org.junit.jupiter.api.Assertions.*;

import java.io.IOException;

import javax.servlet.ServletException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class RobotsServletTest {
    private final AemContext context = new AemContext();

	@BeforeEach
	void setUp() throws Exception {
	    
	}

	@Test
	void test() throws ServletException, IOException {
		String path = "/apps/dhl/discoverdhlapi/robots.txt";
		
		RobotsServlet servlet = new RobotsServlet();
		
		context.currentPage(context.pageManager().getPage(path));
		context.requestPathInfo().setResourcePath(path);
		servlet.doGet(context.request(), context.response());

		String responseBody = context.response().getOutputAsString();
		assertTrue(responseBody.length() > 0);
	}
}