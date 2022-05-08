package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class TopBannerTest {
    private final AemContext ctx = new AemContext();

	@BeforeEach
	void setUp() throws Exception {
	    ctx.addModelsForClasses(TopBanner.class);
	    ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/en/culture/dhl-mo-salah");
		
		TopBanner topBanner = ctx.request().adaptTo(TopBanner.class);
		assert topBanner != null;
		assertTrue(topBanner.getHasbanner());
		assertEquals("Sign up to the Discover newsletter", topBanner.getTitle());
		assertEquals("Receive the latest insights and advice from global business", topBanner.getSubtitle());
		assertEquals("/content/dam/dhl/site-image/banner-images/reception2.jpg", topBanner.getImg());
		assertEquals("/content/dhl/register", topBanner.getUrl());
		assertEquals("Subscribe now", topBanner.getUrltitle());

		topBanner.setHasbanner(false);
		topBanner.setTitle("");
		topBanner.setSubtitle("");
		topBanner.setImg("");
		topBanner.setUrl("");
		topBanner.setUrltitle("");

		assertFalse(topBanner.getHasbanner());
		assertEquals("", topBanner.getTitle());
		assertEquals("", topBanner.getImg());
		assertEquals("", topBanner.getUrl());
		assertEquals("", topBanner.getUrltitle());
	}

}
