package com.dhl.discover.core.models;


import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.injectors.HomePropertyInjector;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.core.services.PageUtilService;
import com.dhl.discover.core.services.PathUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.spi.Injector;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;


@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class FollowUsTest {

    private final static String COMPONENT_LOCATION = "/content/home/small-business-advice/article/jcr:content";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    private final MockSlingHttpServletRequest request = context.request();

    private final ResourceResolver resourceResolver = context.resourceResolver();

    @Mock
    private AssetUtilService assetUtils;

    @Mock
    private PageUtilService pageUtils;

    @Mock
    private PathUtilService pathUtilService;

    @InjectMocks
    private HomePropertyInjector homePropertyInjector;

    @BeforeEach
    void setUp() throws Exception {
        context.registerService(AssetUtilService.class, assetUtils);
        context.registerService(Injector.class, homePropertyInjector);
        context.registerService(PathUtilService.class, pathUtilService);
        context.addModelsForClasses(FollowUs.class);
    }

    private void mockHomePage() {
        when(pageUtils.getHomePage(any(Page.class))).thenReturn(context.resourceResolver().getResource("/content/home").adaptTo(Page.class));
    }

    private void initRequest(String path) {
        request.setPathInfo(path);
        request.setResource(resourceResolver.getResource(path));
    }

    @Test
    void test_withProperties() {
        context.load().json("/com/dhl/discover/core/models/FollowUs/withProperties.json", "/content");

        initRequest(COMPONENT_LOCATION );
        mockHomePage();

        FollowUs followUs = request.adaptTo(FollowUs.class);
        assertEquals("Social", followUs.getSocialLinksLabel());
        assertEquals("Facebook", followUs.getSocialLinks().get(0).getLinkName());
        assertEquals("/content/dam/dhl-discover/common/icons/icon-sc-facebook.svg", followUs.getSocialLinks().get(0).getLinkIcon());
        assertEquals("https://www.facebook.com/", followUs.getSocialLinks().get(0).getLinkPath());
    }
    @Test
    void testGetInnerLinks_withNullParentResource() {
        FollowUs followUs = new FollowUs();
        List<LinkModel> result = followUs.getInnerLinks(null);
        assertTrue(result.isEmpty(), "Expected an empty list when parentResource is null");
    }
}

