package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import com.positive.dhl.core.services.PageUtilService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class MeganavBannerTest {
    private final AemContext ctx = new AemContext();

	@BeforeEach
	void setUp() throws Exception {
		ctx.registerService(PageUtilService.class, new PageUtilService());
	    ctx.addModelsForClasses(MeganavBanner.class);
	    ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/en/culture/dhl-mo-salah");
		
		MeganavBanner meganavBanner = ctx.request().adaptTo(MeganavBanner.class);
		assert meganavBanner != null;
		assertEquals("Reach 220 territories across the world", meganavBanner.getTitle());
		assertEquals("Serious about taking your brand global?", meganavBanner.getSubtitle());
		assertEquals("Shipping made easy", meganavBanner.getPoint1());
		assertEquals("Preferential business rates", meganavBanner.getPoint2());
		assertEquals("Flexible delivery options", meganavBanner.getPoint3());
		assertEquals("Trusted services", meganavBanner.getPoint4());
		assertEquals("/content/dhl/ship-now", meganavBanner.getUrl());
		assertEquals("Apply for a business account", meganavBanner.getUrltitle());
		
		meganavBanner.setTitle("");
		meganavBanner.setSubtitle("");
		meganavBanner.setPoint1("");
		meganavBanner.setPoint2("");
		meganavBanner.setPoint3("");
		meganavBanner.setPoint4("");
		meganavBanner.setUrl("");
		meganavBanner.setUrltitle("");

		assertEquals("", meganavBanner.getTitle());
		assertEquals("", meganavBanner.getPoint1());
		assertEquals("", meganavBanner.getPoint2());
		assertEquals("", meganavBanner.getPoint3());
		assertEquals("", meganavBanner.getPoint4());
		assertEquals("", meganavBanner.getUrl());
		assertEquals("", meganavBanner.getUrltitle());
	}

}
