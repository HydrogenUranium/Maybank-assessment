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
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class RepositoryChecksImplTest {

	AemContext context = new AemContext(ResourceResolverType.RESOURCERESOLVER_MOCK);

	RepositoryChecks underTest;

	@Mock
	Resource resource;

	@Mock
	ResourceResolver resourceResolver = context.resourceResolver();

	private final static String DUMMY_PATH = "/content/dhl/dummy-path";

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
}