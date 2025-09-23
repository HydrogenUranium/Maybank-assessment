package com.dhl.discover.core.services.impl;

import com.adobe.aem.wcm.seo.localization.LanguageAlternativesService;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.sitemap.SitemapException;
import org.apache.sling.sitemap.builder.Url;
import org.apache.sling.sitemap.impl.builder.SitemapImpl;
import org.apache.sling.sitemap.impl.builder.extensions.ExtensionProviderManager;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.Writer;
import java.lang.reflect.Field;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

import static com.day.cq.wcm.api.constants.NameConstants.PN_PAGE_LAST_MOD;
import static com.day.cq.wcm.api.constants.NameConstants.PN_PAGE_LAST_REPLICATED;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class PageTreeSitemapGeneratorImplTest {
    public static final String PAGE_PATH = "/content/dhl/page";
    public static final String EXPECTED_LOCATION = PAGE_PATH + PageTreeSitemapGeneratorImpl.HTML_EXTENSION;
    public static final Instant EXPECTED_LAST_MODIFIED = Instant.parse("2021-10-18T11:21:08Z");
    public static final String TEST_RESOURCE_PATH = "/com/dhl/discover/core/services/impl/PageTreeSitemapGeneratorImplTest/page_resource.json";

    private Resource resource;
    private ResourceResolver resourceResolver;
    private SitemapImpl sitemap;

    @Mock
    private PageUtilService pageUtilService;

    @InjectMocks
    private PageTreeSitemapGeneratorImpl pageTreeSitemapGenerator;

    @Mock
    private ReplicationStatusCheck replicationStatusCheck;

    @Mock
    private LanguageAlternativesService languageAlternativesService;

    @Mock
    private Writer writer;

    @Mock
    private ExtensionProviderManager extensionProviderManager;

    AemContext context = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);

    @BeforeEach
    public void init() throws Exception {
        resourceResolver = context.resourceResolver();
        context.registerService(LanguageAlternativesService.class, languageAlternativesService);
        context.registerService(ReplicationStatusCheck.class, replicationStatusCheck);
        context.registerService(PageUtilService.class, pageUtilService);

        sitemap = spy(new SitemapImpl(writer, extensionProviderManager));
        resource = getResource(TEST_RESOURCE_PATH);

        lenient().when(replicationStatusCheck.isPublished(any(Page.class))).thenReturn(true);
    }

    @Test
    void testShouldInclude()  {
        assertTrue(pageTreeSitemapGenerator.shouldInclude(resource));
    }

    private void setPrivateField(Object target, String fieldName, Object value) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private PageTreeSitemapGeneratorImpl createGeneratorWithConfig(boolean enableLastModified, String lastModifiedSource,
            boolean enableChangefreq, String changefreqDefaultValue,
            boolean enablePriority, String priorityDefaultValue,
            boolean enableLanguageAlternates) {
        PageTreeSitemapGeneratorImpl generator = new PageTreeSitemapGeneratorImpl();
        setPrivateField(generator, "pageUtilService", pageUtilService);
        setPrivateField(generator, "replicationStatusCheck", replicationStatusCheck);
        setPrivateField(generator, "languageAlternativesService", languageAlternativesService);
        generator.activate(new PageTreeSitemapGeneratorImpl.Configuration() {
            public boolean enableLastModified() { return enableLastModified; }
            public String lastModifiedSource() { return lastModifiedSource; }
            public boolean enableChangefreq() { return enableChangefreq; }
            public String changefreqDefaultValue() { return changefreqDefaultValue; }
            public boolean enablePriority() { return enablePriority; }
            public String priorityDefaultValue() { return priorityDefaultValue; }
            public boolean enableLanguageAlternates() { return enableLanguageAlternates; }
            public Class<? extends java.lang.annotation.Annotation> annotationType() { return PageTreeSitemapGeneratorImpl.Configuration.class; }
        });
        return generator;
    }

    @Test
    void testAlternative() throws SitemapException, NoSuchFieldException, IllegalAccessException {
        Page page = resource.adaptTo(Page.class);
        Map<Locale, Page> languageAlternatives = new LinkedHashMap<>();
        languageAlternatives.put(Locale.forLanguageTag("fr"), page);
        languageAlternatives.put(Locale.forLanguageTag("de"), page);

        when(languageAlternativesService.getLanguageAlternatives(any(Page.class))).thenReturn(languageAlternatives);
        pageTreeSitemapGenerator = createGeneratorWithConfig(true, PN_PAGE_LAST_MOD, true, "always", true, "pageDepth", true);
        pageTreeSitemapGenerator.addResource(StringUtils.EMPTY, sitemap, resource);

        verication(sitemap, EXPECTED_LOCATION, EXPECTED_LAST_MODIFIED);
    }

    @Test
    void testNoAlternative() throws SitemapException, NoSuchFieldException, IllegalAccessException {
        Page mockPage = mock(Page.class);
        Map<Locale, Page> languageAlternatives = new LinkedHashMap<>();
        languageAlternatives.put(Locale.forLanguageTag("fr"), mockPage);

        when(languageAlternativesService.getLanguageAlternatives(any(Page.class))).thenReturn(languageAlternatives);
        lenient().when(mockPage.getContentResource()).thenReturn(null);
        pageTreeSitemapGenerator = createGeneratorWithConfig(true, PN_PAGE_LAST_MOD, true, "always", true, "pageDepth", true);
        pageTreeSitemapGenerator.addResource(StringUtils.EMPTY, sitemap, resource);

        verication(sitemap, EXPECTED_LOCATION, EXPECTED_LAST_MODIFIED);
    }

    @Test
    void testLastModified() throws SitemapException, NoSuchFieldException, IllegalAccessException {
        pageTreeSitemapGenerator = createGeneratorWithConfig(true, PN_PAGE_LAST_MOD, true, "always", true, "pageDepth", true);
        pageTreeSitemapGenerator.addResource(StringUtils.EMPTY, sitemap, resource);

        verication(sitemap, EXPECTED_LOCATION, EXPECTED_LAST_MODIFIED);
    }

    @Test
    void testLastReplicated() throws SitemapException, NoSuchFieldException, IllegalAccessException {
        pageTreeSitemapGenerator = createGeneratorWithConfig(true, PN_PAGE_LAST_REPLICATED, true, "always", true, "pageDepth", true);
        pageTreeSitemapGenerator.addResource(StringUtils.EMPTY, sitemap, resource);

        verication(sitemap, EXPECTED_LOCATION, null);
    }

    private Resource getResource(String path) {
        context.load().json(path, PAGE_PATH);
        return resourceResolver.getResource(PAGE_PATH);
    }

    private void verication(SitemapImpl sitemap, String expectedLocation, Instant expectedLastModified)
            throws NoSuchFieldException, IllegalAccessException {

        String actualLocation = getSitemapPrivateField(sitemap, String.class, "location");
        Instant actualLastModified = getSitemapPrivateField(sitemap, Instant.class, "lastModified");

        assertEquals(expectedLocation, actualLocation);
        assertEquals(expectedLastModified, actualLastModified);
    }

    private <T> T getSitemapPrivateField(SitemapImpl sitemap, Class<T> fieldType, String fieldName) throws NoSuchFieldException, IllegalAccessException {
        Url sitemapUrl = getSitemapPendingUrl(sitemap);
        Field field = sitemapUrl.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return fieldType.cast(field.get(sitemapUrl));
    }

    private Url getSitemapPendingUrl(SitemapImpl sitemap) throws NoSuchFieldException, IllegalAccessException {
        Field pendingUrl = sitemap.getClass().getDeclaredField("pendingUrl");
        pendingUrl.setAccessible(true);
        return (Url) pendingUrl.get(sitemap);
    }
}
