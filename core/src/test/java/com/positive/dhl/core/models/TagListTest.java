package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class TagListTest {
    private final AemContext ctx = new AemContext();

	@BeforeEach
	void setUp() throws Exception {
	    ctx.addModelsForClasses(TagList.class);
	    ctx.load().json("/com/positive/dhl/core/models/StandardAemPage.json", "/content");
	}

	@Test
	void test() {
		ctx.currentResource("/content/standardpage");
		
		TagList tagList = ctx.request().adaptTo(TagList.class);

		assertTrue(true);
	}

}
