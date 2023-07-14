package com.positive.dhl.core.services.impl;

import com.positive.dhl.core.services.RepositoryChecks;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class RepositoryChecksImplTest {

	AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

	RepositoryChecks underTest;

	@Mock
	Resource resource;

	@Mock
	ResourceResolver resourceResolver = context.resourceResolver();

	private final static String DUMMY_PATH = "/content/dhl/dummy-path";
	private final static String ANOTHER_DUMMY_PATH = "/content/dhl/another-dummy-path";

	@BeforeEach
	void init(){
		context.create().page(DUMMY_PATH);
		underTest = new RepositoryChecksImpl();
	}

	@Test
	void doesRepositoryPathExistNegative() {
		when(resourceResolver.getResource(anyString())).thenReturn(null);
		boolean pathExists = underTest.doesRepositoryPathExist(DUMMY_PATH, resourceResolver);
		assertFalse(pathExists);
	}

	@Test
	void doesRepositoryPathExist() {
		when(resourceResolver.getResource(anyString())).thenReturn(resource);
		boolean pathExists = underTest.doesRepositoryPathExist(DUMMY_PATH, resourceResolver);
		assertTrue(pathExists);
	}

	@Test
	void doRepositoryPathsExist() {
		String[] pathsToCheck = {"/content/dhl/dummy1", "/content/dhl/dummy2"};
		when(resourceResolver.getResource(eq("/content/dhl/dummy1"))).thenReturn(mock(Resource.class));
		when(resourceResolver.getResource(eq("/content/dhl/dummy2"))).thenReturn(mock(Resource.class));
		boolean pathsExist = underTest.doRepositoryPathsExist(pathsToCheck,resourceResolver);
		assertTrue(pathsExist);
	}

	@Test
	void testDoRepositoryPathsExist() {
		List<String> pathsList = new ArrayList<>();
		pathsList.add("/content/dhl/dummy1");
		pathsList.add("/content/dhl/dummy2");
		when(resourceResolver.getResource(eq("/content/dhl/dummy1"))).thenReturn(mock(Resource.class));
		when(resourceResolver.getResource(eq("/content/dhl/dummy2"))).thenReturn(null);
		boolean pathsExist = underTest.doRepositoryPathsExist(pathsList,resourceResolver);
		assertFalse(pathsExist);
	}

	@Test
	void testGettingResourceType(){
		Map<String,Object> resourceProperties = new HashMap<>();
		resourceProperties.put("sling:resourceType", "dummy-resource-type");
		context.build().resource(DUMMY_PATH,resourceProperties);
		Resource testResource = context.currentResource(DUMMY_PATH);

		when(resourceResolver.getResource(DUMMY_PATH)).thenReturn(testResource);

		String resourceType = underTest.getResourceType(DUMMY_PATH,resourceResolver);
		assertEquals("dummy-resource-type", resourceType);
	}

	@Test
	void testGettingResourceTypeFallback(){
		Map<String,Object> resourceProperties = new HashMap<>();
		resourceProperties.put("dummy-property", "dummy-resource-type");
		context.build().resource(DUMMY_PATH,resourceProperties);
		Resource testResource = context.currentResource(DUMMY_PATH);

		when(resourceResolver.getResource(DUMMY_PATH)).thenReturn(testResource);

		String resourceType = underTest.getResourceType(DUMMY_PATH,resourceResolver);
		assertEquals(com.day.cq.wcm.api.constants.NameConstants.NT_PAGE, resourceType);
	}

	@Test
	void testGettingMultipleResourceTypes(){
		String[] paths = {DUMMY_PATH,ANOTHER_DUMMY_PATH};
		Map<String,Object> resourceProperties = new HashMap<>();
		resourceProperties.put("sling:resourceType", "dummy-resource-type");

		context.build().resource(DUMMY_PATH,resourceProperties);
		context.create().page(ANOTHER_DUMMY_PATH);

		Resource testResource = context.currentResource(DUMMY_PATH);
		Resource anotherTestResource = context.currentResource(ANOTHER_DUMMY_PATH);

		when(resourceResolver.getResource(DUMMY_PATH)).thenReturn(testResource);
		when(resourceResolver.getResource(ANOTHER_DUMMY_PATH)).thenReturn(anotherTestResource);

		Map<String,String> resourceTypes = underTest.getResourceTypes(paths,resourceResolver);
		assertEquals("dummy-resource-type",resourceTypes.get(DUMMY_PATH));
		assertEquals("cq:Page", resourceTypes.get(ANOTHER_DUMMY_PATH));
	}
}
