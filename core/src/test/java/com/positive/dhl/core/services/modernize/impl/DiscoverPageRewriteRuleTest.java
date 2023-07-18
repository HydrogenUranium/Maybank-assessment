package com.positive.dhl.core.services.modernize.impl;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import javax.jcr.Node;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static com.positive.dhl.core.utils.AssertNode.assertNodeStructureEquals;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
class DiscoverPageRewriteRuleTest {

    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private final ResourceResolver resourceResolver = context.resourceResolver();
    private final DiscoverPageRewriteRule rule = new DiscoverPageRewriteRule();

    @BeforeEach
    public void beforeEach() {
        context.load().json("/com/positive/dhl/core/services/modernize/impl/DiscoverPageRewriteRuleTest/page-content.json", "/content/test");
        context.load().json("/com/positive/dhl/core/services/modernize/impl/DiscoverPageRewriteRuleTest/conf-template.json", "/conf/dhl/settings/wcm/templates/article");

        Map<String, Object> props = Map.of(
                "editableTemplate", "/conf/dhl/settings/wcm/templates/article",
                "staticTemplate", "/apps/dhl/templates/dhl-article-page",
                "containerMappings", new String[]{
                        "par:root/article_container/body/responsivegrid",
                        "partwo:root/article_container_two/body/responsivegrid",
                        "parthree:root/responsivegrid"},
                "slingResourceType", "dhl/components/pages/article");
        context.registerInjectActivateService(rule, props);
    }

    private Node getNode(String path) {
        return resourceResolver.getResource(path).adaptTo(Node.class);
    }

    @Test
    void matches() throws Exception {
        // Test not a page
        Node node = getNode("/content/test/notAPage");
        assertFalse(rule.matches(node), "Not a page");

        // Test no page content
        node = getNode("/content/test/noPageContent");
        assertFalse(rule.matches(node), "No Page Content");

        // Test page root
        node = getNode("/content/test/matches");
        assertTrue(rule.matches(node), "cq:Page matches");

        // Page Content
        node = getNode("/content/test/matches/jcr:content");
        assertTrue(rule.matches(node), "cq:PageContent matches");

        // Doesn't match - Template
        // Test page root
        node = getNode("/content/test/doesNotMatchTemplate");
        assertFalse(rule.matches(node), "cq:Page does not match");

        // Page Content
        node = getNode("/content/test/doesNotMatchTemplate/jcr:content");
        assertFalse(rule.matches(node), "cq:PageContent does not matches");

        // Doesn't match - Sling Resource Type
        // Test page root
        node = getNode("/content/test/doesNotMatchResourceType");
        assertFalse(rule.matches(node), "cq:Page does not matches");

        // Page Content
        node = getNode("/content/test/doesNotMatchResourceType/jcr:content");
        assertFalse(rule.matches(node), "cq:PageContent does not matches");
    }

    @Test
    void findMatches() {
        Resource page = resourceResolver.getResource("/content/test/matches");
        Set<String> matches = rule.findMatches(page);

        assertEquals(1, matches.size(), "Matches length");
        assertTrue(matches.contains("/content/test/matches"), "Matches content.");

        page = resourceResolver.getResource("/content/test");
        matches = rule.findMatches(page);
        assertEquals(0, matches.size(), "Matches length");

        page = resourceResolver.getResource("/content/test/doesNotMatchTemplate");
        matches = rule.findMatches(page);
        assertEquals(0, matches.size(), "Matches length");
    }

    @Test
    void hasPattern() {
        assertTrue(rule.hasPattern("dhl/components/pages/article"));
        assertFalse(rule.hasPattern("dhl/components/pages/home"));
    }

    @Test
    void getTitle() {
        assertEquals("PageRewriteRule (/apps/dhl/templates/dhl-article-page -> /conf/dhl/settings/wcm/templates/article)", rule.getTitle());
    }

    @Test
    void getId() {
        assertEquals("com.positive.dhl.core.services.modernize.impl.DiscoverPageRewriteRule", rule.getId());
    }

    @Test
    void applyTo_ShouldMigratePage_WhenConditionsIsTrue() throws Exception {
        Node node = getNode("/content/test/matches");
        Node expected = getNode("/content/test/migrated/jcr:content");
        Node rewrittenNode = rule.applyTo(node, new HashSet<>());
        assertNodeStructureEquals(expected, rewrittenNode);
    }
}