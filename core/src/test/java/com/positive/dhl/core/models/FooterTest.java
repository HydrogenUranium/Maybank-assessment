package com.positive.dhl.core.models;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;

import com.positive.dhl.core.services.PageUtilService;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.Mock;

import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class FooterTest {
    private final AemContext ctx = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private QueryBuilder mockQueryBuilder;

    @Mock
    private Query page1MockQuery;

	@BeforeEach
	void setUp() throws Exception {
	    ctx.load().json("/com/positive/dhl/core/models/SiteContent.json", "/content");
        ctx.registerService(QueryBuilder.class, mockQueryBuilder);
		ctx.registerService(PageUtilService.class, new PageUtilService());
		ctx.addModelsForClasses(Footer.class);
	}

	@Test
	void test() {
		ctx.currentResource("/content/dhl/en");

		Footer footer = ctx.request().adaptTo(Footer.class);
		assert footer != null;
		assertEquals("Categories:", footer.getTitleColumnOne());
		assertEquals("Most Read:", footer.getTitleColumnTwo());
		assertEquals("Popular Topics:", footer.getTitleColumnTags());
		assertEquals("Follow Us:", footer.getTitleSocial());

		assertEquals(3, footer.getLinksColumnOne().size());
		assertEquals(0, footer.getLinksColumnTwo().size());
		assertEquals(0, footer.getLinksColumnTags().size());
		assertEquals(5, footer.getLinksSocial().size());

		footer.setTitleColumnOne("");
		footer.setTitleColumnTwo("");
		footer.setTitleColumnTags("");
		footer.setTitleSocial("");

		assertEquals("", footer.getTitleColumnOne());
		assertEquals("", footer.getTitleColumnTwo());
		assertEquals("", footer.getTitleColumnTags());
		assertEquals("", footer.getTitleSocial());

		footer.setLinksColumnOne(new ArrayList<Link>());
		footer.setLinksColumnTwo(new ArrayList<CategoryLink>());
		footer.setLinksColumnTags(new ArrayList<TagWrapper>());
		footer.setLinksSocial(new ArrayList<SocialLink>());

		assertEquals(0, footer.getLinksColumnOne().size());
		assertEquals(0, footer.getLinksColumnTwo().size());
		assertEquals(0, footer.getLinksColumnTags().size());
		assertEquals(0, footer.getLinksSocial().size());
	}
}