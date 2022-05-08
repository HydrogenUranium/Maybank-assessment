package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class ContentBannerTest {
    private final AemContext ctx = new AemContext();

	@BeforeEach
	void setUp() throws Exception {
	    ctx.addModelsForClasses(ContentBanner.class);
	    ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/en/culture/dhl-mo-salah");
		
		ContentBanner contentBanner = ctx.request().adaptTo(ContentBanner.class);
		assert contentBanner != null;
		assertTrue(contentBanner.getHasbanner());
		assertEquals("Sign up to the Discover newsletter", contentBanner.getTitle());
		assertEquals("Receive the latest insights and advice from global business", contentBanner.getSubtitle());
		assertEquals("/content/dam/dhl/site-image/banner-images/courier_MPU.jpg", contentBanner.getImg());
		assertEquals("/content/dam/dhl/site-image/banner-images/messenger2_mobile_mpu.jpg", contentBanner.getImgmob());
		assertEquals("/content/dhl/register", contentBanner.getUrl());
		assertEquals("Subscribe now", contentBanner.getUrltitle());
		assertEquals(4, contentBanner.getPoints().size());
		
		contentBanner.setHasbanner(false);
		contentBanner.setTitle("");
		contentBanner.setSubtitle("");
		contentBanner.setImg("");
		contentBanner.setImgmob("");
		contentBanner.setUrl("");
		contentBanner.setUrltitle("");
		contentBanner.setPoints(new ArrayList<String>());

		assertFalse(contentBanner.getHasbanner());
		assertEquals("", contentBanner.getTitle());
		assertEquals("", contentBanner.getSubtitle());
		assertEquals("", contentBanner.getImg());
		assertEquals("", contentBanner.getImgmob());
		assertEquals("", contentBanner.getUrl());
		assertEquals("", contentBanner.getUrltitle());
		assertEquals(0, contentBanner.getPoints().size());
	}

}
