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

import static com.positive.dhl.core.utils.AssertNode.assertNodeStructureEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class DiscoverRightAlignedMarketoFormRewriteRuleTest {
    private final static String COMPONENT_LOCATION = "/com/positive/dhl/core/services/modernize/impl/DiscoverRightAlignedMarketoFormRewriteRule";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private Revision revision;

    @Mock
    private ResourceResolverHelper resourceResolverHelper;

    private DiscoverRightAlignedMarketoFormRewriteRule rule = new DiscoverRightAlignedMarketoFormRewriteRule();

    @BeforeEach
    public void beforeEach() {
        context.load().json(COMPONENT_LOCATION + "/page-content.json", "/content/open-an-account");
        context.load().json(COMPONENT_LOCATION + "/conf-template.json", "/conf/dhl/settings/wcm/templates/right-aligned-marketo-form");

        Map<String, Object> props = Map.of(
                "editableTemplate", "/conf/dhl/settings/wcm/templates/right-aligned-marketo-form",
                "staticTemplate", "/apps/dhl/templates/dhl-landing-page-twocol",
                "id", "right-marketo",
                "containerMappings", new String[]{
                        "par:root/two_columns_container/left-column-body/responsivegrid",
                        "partwo:root/two_columns_container/right-column-body/responsivegrid",
                        "parthree:root/responsivegrid"
                },
                "slingResourceType", "dhl/components/pages/landingtwocol");
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
            when(revision.getId()).thenReturn("right-marketo");

            Node node = getNode("/content/open-an-account/matches");
            Node rewrittenNode = rule.applyTo(node, new HashSet<>());

            Node expected = getNode("/content/open-an-account/migrated/jcr:content");
            assertNodeStructureEquals(expected, rewrittenNode);
        }
    }

    private Node getNode(String path) {
        return resourceResolver.getResource(path).adaptTo(Node.class);
    }
}