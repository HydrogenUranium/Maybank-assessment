package com.positive.dhl.core.services.modernize.impl;

import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.Revision;
import com.positive.dhl.core.utils.JcrNodeUtils;
import com.positive.dhl.core.services.ResourceResolverHelper;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.nodetype.NodeTypeManager;
import javax.jcr.nodetype.NodeTypeTemplate;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static com.positive.dhl.junitUtils.AssertNode.assertNodeStructureEquals;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class DiscoverPageRewriteRuleTest {

    AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    Revision revision;

    @Mock
    ResourceResolverHelper resourceResolverHelper;

    DiscoverPageRewriteRule rule = new DiscoverPageRewriteRule();

    @BeforeEach
    public void beforeEach() throws RepositoryException {
        NodeTypeManager nodeTypeManager = resourceResolver.adaptTo(Session.class).getWorkspace().getNodeTypeManager();

        // Create a new mixin node type
        NodeTypeTemplate nodeTypeTemplate = nodeTypeManager.createNodeTypeTemplate();
        nodeTypeTemplate.setName("cq:LiveRelationship");
        nodeTypeTemplate.setMixin(true);

        context.load().json("/com/positive/dhl/core/services/modernize/impl/DiscoverPageRewriteRuleTest/page-content.json", "/content/test");
        context.load().json("/com/positive/dhl/core/services/modernize/impl/DiscoverPageRewriteRuleTest/conf-template.json", "/conf/dhl/settings/wcm/templates/article");

        Map<String, Object> props = Map.of(
                "editableTemplate", "/conf/dhl/settings/wcm/templates/article",
                "staticTemplate", "/apps/dhl/templates/dhl-article-page",
                "id", "/apps/dhl/templates/dhl-article-page:/conf/dhl/settings/wcm/templates/article",
                "containerMappings", new String[]{
                        "par:root/article_container/body/responsivegrid",
                        "partwo:root/article_container_two/body/responsivegrid",
                        "parthree:root/responsivegrid"},
                "slingResourceType", "dhl/components/pages/article");
        context.registerService(ResourceResolverHelper.class, resourceResolverHelper);
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
        assertEquals("/apps/dhl/templates/dhl-article-page:/conf/dhl/settings/wcm/templates/article", rule.getId());
    }

    @Test
    void applyTo_ShouldMigratePage_WhenConditionsIsTrue() throws Exception {
        try (MockedStatic<JcrNodeUtils> mockedStatic = mockStatic(JcrNodeUtils.class)) {
            mockedStatic.when(() -> JcrNodeUtils.addLiveRelationshipMixinType(any())).thenAnswer(Answers.RETURNS_DEFAULTS);
            ResourceResolver spyResourceResolver = spy(resourceResolver);
            PageManager spyPageManager = spy(context.pageManager());
            when(resourceResolverHelper.getResourceResolver(any(Session.class))).thenReturn(spyResourceResolver);
            doReturn(spyPageManager).when(spyResourceResolver).adaptTo(PageManager.class);
            doReturn(revision).when(spyPageManager).createRevision(any(), any(), any());
            when(revision.getId()).thenReturn("1");

            Node node = getNode("/content/test/matches");
            Node rewrittenNode = rule.applyTo(node, new HashSet<>());

            Node expected = getNode("/content/test/migrated/jcr:content");
            assertNodeStructureEquals(expected, rewrittenNode);
        }
    }
}