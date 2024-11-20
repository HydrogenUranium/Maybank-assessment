package com.dhl.discover.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.dhl.discover.junitUtils.Constants.NEW_CONTENT_STRUCTURE_JSON;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ServicePointLocatorModelTest {
    public static final String ROOT_TEST_PAGE_PATH = "/content";
    public static final String CONFIGURED_LOCATOR_COMPONENT_RESOURCE_PATH = "/content/dhl/global/en-global/landing-with-configured-locator/jcr:content/root/column_container/first-container/responsivegrid/locator";
    public static final String EMPTY_LOCATOR_COMPONENT_RESOURCE_PATH = "/content/dhl/global/en-global/landing-with-non-configured-locator/jcr:content/root/column_container/first-container/responsivegrid/locator";

    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    private ResourceResolver resourceResolver;

    @BeforeEach
    void setUp() {
        context.load().json(NEW_CONTENT_STRUCTURE_JSON, ROOT_TEST_PAGE_PATH);
        resourceResolver = context.resourceResolver();

        context.addModelsForClasses(ServicePointLocatorModel.class);
    }

    @Test
    void getUrl() {
        Resource configuredLocatorComponent = resourceResolver.getResource(CONFIGURED_LOCATOR_COMPONENT_RESOURCE_PATH);
        ServicePointLocatorModel configuredLocator = context.getService(ModelFactory.class).createModel(configuredLocatorComponent, ServicePointLocatorModel.class);
        assertNotNull(configuredLocator);
        assertEquals(
                "https://locator.dhl.com/results" +
                        "?countryCode=FR" +
                        "&address=Paris" +
                        "&maxDistance=10" +
                        "&language=fr" +
                        "&resultUom=mi" +
                        "&capability=86%2C87" +
                        "&length=30" +
                        "&width=20" +
                        "&height=10" +
                        "&dimensionsUom=cm" +
                        "&weight=10" +
                        "&weightUom=kg" +
                        "&openDay=1" +
                        "&openBefore=14%3A00" +
                        "&openAfter=15%3A00",
                configuredLocator.getUrl());

        Resource nonConfiguredLocatorComponent = resourceResolver.getResource(EMPTY_LOCATOR_COMPONENT_RESOURCE_PATH);
        ServicePointLocatorModel nonConfiguredLocator = context.getService(ModelFactory.class).createModel(nonConfiguredLocatorComponent, ServicePointLocatorModel.class);
        assertNotNull(nonConfiguredLocator);
        assertEquals(
                "",
                nonConfiguredLocator.getUrl());
    }
}
