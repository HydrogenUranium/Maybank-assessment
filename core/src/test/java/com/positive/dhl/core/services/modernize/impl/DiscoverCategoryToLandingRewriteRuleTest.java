package com.positive.dhl.core.services.modernize.impl;

import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.Revision;
import com.positive.dhl.core.helpers.JcrNodeHelper;
import com.positive.dhl.core.services.ResourceResolverHelper;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
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
import javax.jcr.Session;
import java.util.HashSet;
import java.util.Map;

import static com.positive.dhl.junitUtils.AssertNode.assertNodeStructureEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class DiscoverCategoryToLandingRewriteRuleTest {

    AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    Revision revision;

    @Mock
    ResourceResolverHelper resourceResolverHelper;

    DiscoverCategoryToLandingRewriteRule rule = new DiscoverCategoryToLandingRewriteRule();

    @BeforeEach
    public void beforeEach() {
        context.load().json("/com/positive/dhl/core/services/modernize/impl/DiscoverCategoryToLandingRewriteRule/page-content.json", "/content/test");
        context.load().json("/com/positive/dhl/core/services/modernize/impl/DiscoverCategoryToLandingRewriteRule/conf-template.json", "/conf/dhl/settings/wcm/templates/lending-page");

        Map<String, Object> props = Map.of(
                "id", "category",
                "editableTemplate", "/conf/dhl/settings/wcm/templates/lending-page",
                "staticTemplate", "/apps/dhl/templates/dhl-article-group-page",
                "containerMappings", new String[]{"parcarousel:root/column_container/first-container/responsivegrid"},
                "slingResourceType", "dhl/components/pages/articlecategory");
        context.registerService(ResourceResolverHelper.class, resourceResolverHelper);
        context.registerInjectActivateService(rule, props);
    }

    @Test
    void applyTo_ShouldMigratePage_WhenConditionsIsTrue() throws Exception {
        try (MockedStatic<JcrNodeHelper> mockedStatic = mockStatic(JcrNodeHelper.class)) {
            mockedStatic.when(() -> JcrNodeHelper.addLiveRelationshipMixinType(any())).thenAnswer(Answers.RETURNS_DEFAULTS);
            ResourceResolver spyResourceResolver = spy(resourceResolver);
            PageManager spyPageManager = spy(context.pageManager());
            when(resourceResolverHelper.getResourceResolver(any(Session.class))).thenReturn(spyResourceResolver);
            doReturn(spyPageManager).when(spyResourceResolver).adaptTo(PageManager.class);
            doReturn(revision).when(spyPageManager).createRevision(any(), any(), any());
            when(revision.getId()).thenReturn("category");

            Node node = getNode("/content/test/matches");
            Node rewrittenNode = rule.applyTo(node, new HashSet<>());

            Node expected = getNode("/content/test/migrated/jcr:content");
            assertNodeStructureEquals(expected, rewrittenNode);
        }
    }

    private Node getNode(String path) {
        return resourceResolver.getResource(path).adaptTo(Node.class);
    }

}