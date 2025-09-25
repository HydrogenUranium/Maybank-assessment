package com.dhl.discover.core.services.impl;

import com.adobe.aem.wcm.seo.localization.LanguageAlternativesService;
import com.day.cq.wcm.api.Page;
import com.dhl.discover.core.services.PageUtilService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.*;
import org.apache.sling.fsprovider.internal.mapper.valuemap.ValueMapDecorator;
import org.apache.sling.sitemap.SitemapException;
import org.apache.sling.sitemap.builder.Sitemap;
import org.apache.sling.sitemap.builder.Url;
import org.apache.sling.sitemap.builder.extensions.AlternateLanguageExtension;
import org.apache.sling.sitemap.impl.builder.SitemapImpl;
import org.apache.sling.sitemap.impl.builder.extensions.ExtensionProviderManager;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.Writer;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.time.Instant;
import java.util.*;

import static com.adobe.aem.wcm.seo.SeoTags.PN_CANONICAL_URL;
import static com.day.cq.wcm.api.constants.NameConstants.*;
import static com.dhl.discover.core.services.impl.PageTreeSitemapGeneratorImpl.HTML_EXTENSION;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class PageTreeSitemapGeneratorImplTest {
    public static final String PAGE_PATH = "/content/dhl/page";
    public static final String EXPECTED_LOCATION = PAGE_PATH + HTML_EXTENSION;
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

        setCanonicalURL(page);
        verication(sitemap, EXPECTED_LOCATION, EXPECTED_LAST_MODIFIED);
    }

    void setCanonicalURL(Page page) {
        context.create().page("/content/test");
        page = context.pageManager().getPage("/content/test");
        Resource contentResource = page.getContentResource();
        ModifiableValueMap mvm = contentResource.adaptTo(ModifiableValueMap.class);
        mvm.put("cq:canonicalUrl", "https://www.example.com/test");
        try {
            context.resourceResolver().commit();
        } catch (PersistenceException e) {
            throw new RuntimeException(e);
        }
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

    @Test
    void testGetLastmodDt_CreatedDtOnly() throws Exception {
        Page mockPage = mock(Page.class);
        Resource mockContentResource = mock(Resource.class);
        ValueMap mockValueMap = mock(ValueMap.class);

        Calendar createdDate = Calendar.getInstance();
        createdDate.set(2022, Calendar.JANUARY, 15, 10, 30, 0);

        when(mockPage.hasContent()).thenReturn(true);
        when(mockPage.getContentResource()).thenReturn(mockContentResource);
        when(mockContentResource.getValueMap()).thenReturn(mockValueMap);
        when(mockValueMap.get(PN_CREATED, Calendar.class)).thenReturn(createdDate);
        when(mockPage.getLastModified()).thenReturn(null);

        pageTreeSitemapGenerator = createGeneratorWithConfig(
                true,
                PN_PAGE_LAST_MOD,
                false, "", false, "", false);

        Method getLastmodDateMethod = PageTreeSitemapGeneratorImpl.class.getDeclaredMethod("getLastmodDate", Page.class);
        getLastmodDateMethod.setAccessible(true);
        Calendar result = (Calendar) getLastmodDateMethod.invoke(pageTreeSitemapGenerator, mockPage);

        assertNotNull(result);
        assertEquals(createdDate, result);

        verify(mockPage).hasContent();
        verify(mockPage).getContentResource();
        verify(mockContentResource).getValueMap();
        verify(mockValueMap).get(PN_CREATED, Calendar.class);
        verify(mockPage).getLastModified();
    }

    @Test
    void testSetLanguageAlternates() throws Exception {
        Page mockPage = mock(Page.class);

        pageTreeSitemapGenerator = spy(createGeneratorWithConfig(
                true, PN_PAGE_LAST_MOD,
                false, "",
                false, "",
                true)); // Enable language alternates

        Map<Locale, String> alternateLinks = new LinkedHashMap<>();
        alternateLinks.put(Locale.ENGLISH, "https://example.com/en");
        alternateLinks.put(Locale.GERMAN, "https://example.com/de");
        doReturn(alternateLinks).when(pageTreeSitemapGenerator).getAlternateLanguageLinks(mockPage);

        Url mockUrl = mock(Url.class);

        AlternateLanguageExtension mockExtension = mock(AlternateLanguageExtension.class);
        when(mockUrl.addExtension(AlternateLanguageExtension.class)).thenReturn(mockExtension);

        Method setLanguageAlternatesMethod = PageTreeSitemapGeneratorImpl.class.getDeclaredMethod(
                "setLanguageAlternates", Url.class, Page.class);
        setLanguageAlternatesMethod.setAccessible(true);
        setLanguageAlternatesMethod.invoke(pageTreeSitemapGenerator, mockUrl, mockPage);

        verify(mockUrl, times(2)).addExtension(AlternateLanguageExtension.class); // Should be called twice, once for each locale
        verify(mockExtension).setDefaultLocale(); // Should be called for the English locale
        verify(mockExtension).setLocale(Locale.GERMAN); // Should be called for the German locale
        verify(mockExtension, times(2)).setHref(anyString()); // Should be called twice, once for each locale
        verify(mockExtension).setHref("https://example.com/en");
        verify(mockExtension).setHref("https://example.com/de");
    }
    @Test
    void testGetCanonicalUrl_WithReSrcPathInfo(){
        Page mockPage = mock(Page.class);
        Resource mockPageResource = mock(Resource.class);
        ResourceResolver mockResolver = mock(ResourceResolver.class);
        Resource mockCanonicalResource = mock(Resource.class);
        ResourceMetadata mockMetadata = new ResourceMetadata();
        mockMetadata.setResolutionPathInfo(".selector.html");

        when(mockPage.adaptTo(Resource.class)).thenReturn(mockPageResource);
        when(mockPageResource.getValueMap()).thenReturn(new ValueMapDecorator(Collections.singletonMap(
                PN_CANONICAL_URL, "/content/some/path")));
        when(mockPage.hasContent()).thenReturn(true);
        when(mockPage.getContentResource()).thenReturn(mockPageResource);
        when(mockPageResource.getResourceResolver()).thenReturn(mockResolver);
        when(mockResolver.resolve("/content/some/path")).thenReturn(mockCanonicalResource);
        when(mockCanonicalResource.getResourceMetadata()).thenReturn(mockMetadata);

        PageTreeSitemapGeneratorImpl spyGenerator = spy(pageTreeSitemapGenerator);
        doReturn("https://example.com/content/some/path.selector.html").when(spyGenerator)
                .externalize(mockCanonicalResource, ".selector.html");

        String result = spyGenerator.getCanonicalUrl(mockPage);

        assertEquals("https://example.com/content/some/path.selector.html", result);
        verify(mockCanonicalResource).getResourceMetadata();
    }

    @Test
    void testGetCanonicalUrl_WithAbsoluteUrl() {
        Page mockPage = mock(Page.class);
        Resource mockPageResource = mock(Resource.class);
        when(mockPage.adaptTo(Resource.class)).thenReturn(mockPageResource);
        when(mockPageResource.getValueMap()).thenReturn(new ValueMapDecorator(Collections.singletonMap(
                PN_CANONICAL_URL, "https://example.com/absolute/path")));

        PageTreeSitemapGeneratorImpl spyGenerator = spy(pageTreeSitemapGenerator);
        doReturn(false).when(spyGenerator).isCanonicalUrl(eq(mockPage), anyString());
        String result = spyGenerator.getCanonicalUrl(mockPage);
        assertEquals("https://example.com/absolute/path", result);
        verify(mockPage).adaptTo(Resource.class);
        verify(mockPageResource).getValueMap();
    }

    @Test
    void testGetCanonicalUrl_WithEmptyResourceResolver() {
        Page mockPage = mock(Page.class);
        Resource mockPageResource = mock(Resource.class);
        when(mockPage.adaptTo(Resource.class)).thenReturn(mockPageResource);
        when(mockPageResource.getValueMap()).thenReturn(new ValueMapDecorator(Collections.singletonMap(
                PN_CANONICAL_URL, "/content/some/path")));

        PageTreeSitemapGeneratorImpl spyGenerator = spy(pageTreeSitemapGenerator);
        doReturn(false).when(spyGenerator).isCanonicalUrl(eq(mockPage), anyString());
        doReturn(Optional.empty()).when(spyGenerator).getResourceResolver(mockPage);
        String result = spyGenerator.getCanonicalUrl(mockPage);
        assertEquals("", result);
        verify(spyGenerator).getResourceResolver(mockPage);
    }

    @Test
    void testGetCanonicalUrl_WithNonExistingResource() {
        Page mockPage = mock(Page.class);
        Resource mockPageResource = mock(Resource.class);
        ResourceResolver mockResolver = mock(ResourceResolver.class);
        Resource mockNonExistingResource = mock(Resource.class);
        when(mockPage.adaptTo(Resource.class)).thenReturn(mockPageResource);
        when(mockPageResource.getValueMap()).thenReturn(new ValueMapDecorator(Collections.singletonMap(
                PN_CANONICAL_URL, "/content/non/existing/path")));
        when(mockPage.hasContent()).thenReturn(true);
        when(mockPage.getContentResource()).thenReturn(mockPageResource);
        when(mockPageResource.getResourceResolver()).thenReturn(mockResolver);
        when(mockResolver.resolve("/content/non/existing/path")).thenReturn(mockNonExistingResource);
        try (MockedStatic<ResourceUtil> resourceUtilMock = mockStatic(ResourceUtil.class)) {
            resourceUtilMock.when(() -> ResourceUtil.isNonExistingResource(mockNonExistingResource)).thenReturn(true);

            PageTreeSitemapGeneratorImpl spyGenerator = spy(pageTreeSitemapGenerator);
            doReturn(false).when(spyGenerator).isCanonicalUrl(eq(mockPage), anyString());
            doReturn("https://example.com/content/non/existing/path.html").when(spyGenerator)
                    .externalize(eq(mockNonExistingResource), anyString());

            String result = spyGenerator.getCanonicalUrl(mockPage);
            assertEquals("https://example.com/content/non/existing/path.html", result);
            verify(spyGenerator).externalize(eq(mockNonExistingResource), anyString());
        }
    }


    @Test
    void testGetCanonicalUrl_WithNonExistingResourceWithExtension() {
        Page mockPage = mock(Page.class);
        Resource mockPageResource = mock(Resource.class);
        ResourceResolver mockResolver = mock(ResourceResolver.class);
        Resource mockNonExistingResource = mock(Resource.class);

        when(mockPage.adaptTo(Resource.class)).thenReturn(mockPageResource);
        when(mockPageResource.getValueMap()).thenReturn(new ValueMapDecorator(Collections.singletonMap(
                PN_CANONICAL_URL, "/content/path/with/extension.pdf")));

        when(mockPage.hasContent()).thenReturn(true);
        when(mockPage.getContentResource()).thenReturn(mockPageResource);
        when(mockPageResource.getResourceResolver()).thenReturn(mockResolver);

        when(mockResolver.resolve("/content/path/with/extension.pdf")).thenReturn(mockNonExistingResource);
        try (MockedStatic<ResourceUtil> resourceUtilMock = mockStatic(ResourceUtil.class)) {
            resourceUtilMock.when(() -> ResourceUtil.isNonExistingResource(mockNonExistingResource)).thenReturn(true);
            PageTreeSitemapGeneratorImpl spyGenerator = spy(pageTreeSitemapGenerator);
            doReturn(false).when(spyGenerator).isCanonicalUrl(eq(mockPage), anyString());
            doReturn("https://example.com/content/path/with/extension.pdf").when(spyGenerator)
                    .externalize(eq(mockNonExistingResource), anyString());

            String result = spyGenerator.getCanonicalUrl(mockPage);
            assertEquals("https://example.com/content/path/with/extension.pdf", result);
            verify(spyGenerator).externalize(eq(mockNonExistingResource), anyString());
        }
    }

    @Test
    void testGetCanonicalUrl_WithBlankResolutionPathInfo() {
        Page mockPage = mock(Page.class);
        Resource mockPageResource = mock(Resource.class);
        ResourceResolver mockResolver = mock(ResourceResolver.class);
        Resource mockCanonicalResource = mock(Resource.class);
        ResourceMetadata mockMetadata = new ResourceMetadata();
        when(mockPage.adaptTo(Resource.class)).thenReturn(mockPageResource);
        when(mockPageResource.getValueMap()).thenReturn(new ValueMapDecorator(Collections.singletonMap(
                PN_CANONICAL_URL, "/content/some/path")));
        when(mockPage.hasContent()).thenReturn(true);
        when(mockPage.getContentResource()).thenReturn(mockPageResource);
        when(mockPageResource.getResourceResolver()).thenReturn(mockResolver);
        when(mockResolver.resolve("/content/some/path")).thenReturn(mockCanonicalResource);

        try (MockedStatic<ResourceUtil> resourceUtilMock = mockStatic(ResourceUtil.class)) {
            resourceUtilMock.when(() -> ResourceUtil.isNonExistingResource(mockCanonicalResource)).thenReturn(false);
            when(mockCanonicalResource.getResourceMetadata()).thenReturn(mockMetadata);
            PageTreeSitemapGeneratorImpl spyGenerator = spy(pageTreeSitemapGenerator);
            doReturn(false).when(spyGenerator).isCanonicalUrl(eq(mockPage), anyString());
            doReturn("https://example.com/content/some/path.html").when(spyGenerator)
                    .externalize(mockCanonicalResource, HTML_EXTENSION);
            String result = spyGenerator.getCanonicalUrl(mockPage);
            assertEquals("https://example.com/content/some/path.html", result);
            verify(mockCanonicalResource).getResourceMetadata();
            verify(spyGenerator).externalize(mockCanonicalResource, HTML_EXTENSION);
        }
    }

    @Test
    void testAddResource_WithNonPageResource() throws SitemapException {
        Resource mockResource = mock(Resource.class);
        Sitemap mockSitemap = mock(Sitemap.class);

        when(mockResource.adaptTo(Page.class)).thenReturn(null);
        when(mockResource.getPath()).thenReturn("/content/non-page-resource");

        pageTreeSitemapGenerator.addResource("testName", mockSitemap, mockResource);

        verifyNoInteractions(mockSitemap);
        verify(mockResource).getPath();
        verify(mockResource).adaptTo(Page.class);
        verifyNoMoreInteractions(mockResource);
    }

    @Test
    void testAddResource_WithBlankLocation() throws SitemapException {
        Resource mockResource = mock(Resource.class);
        Page mockPage = mock(Page.class);
        Sitemap mockSitemap = mock(Sitemap.class);

        when(mockResource.adaptTo(Page.class)).thenReturn(mockPage);
        when(mockResource.getPath()).thenReturn("/content/test/page");

        PageTreeSitemapGeneratorImpl spyGenerator = spy(pageTreeSitemapGenerator);
        doReturn("").when(spyGenerator).getCanonicalUrl(mockPage);
        spyGenerator.addResource("testName", mockSitemap, mockResource);

        verifyNoInteractions(mockSitemap);
        verify(spyGenerator).getCanonicalUrl(mockPage);
        verify(mockResource).getPath();
    }

    @Test
    void testAddResource_WithNullLocation() throws SitemapException {
        Resource mockResource = mock(Resource.class);
        Page mockPage = mock(Page.class);
        Sitemap mockSitemap = mock(Sitemap.class);

        when(mockResource.adaptTo(Page.class)).thenReturn(mockPage);
        when(mockResource.getPath()).thenReturn("/content/test/page");

        PageTreeSitemapGeneratorImpl spyGenerator = spy(pageTreeSitemapGenerator);
        doReturn(null).when(spyGenerator).getCanonicalUrl(mockPage);

        spyGenerator.addResource("testName", mockSitemap, mockResource);

        verifyNoInteractions(mockSitemap);
        verify(spyGenerator).getCanonicalUrl(mockPage);
        verify(mockResource).getPath();
    }



}
