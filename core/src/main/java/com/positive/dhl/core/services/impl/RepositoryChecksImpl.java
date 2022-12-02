package com.positive.dhl.core.services.impl;

import com.positive.dhl.core.services.RepositoryChecks;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;

import java.util.List;

/**
 * Provides functionality to check if specific path (or paths) exist in the repository
 */
@Component(
		service = RepositoryChecks.class
)
public class RepositoryChecksImpl implements RepositoryChecks {
	@Override
	public boolean doesRepositoryPathExist(String path, ResourceResolver resourceResolver) {
		Resource resource = resourceResolver.getResource(path);
		return null != resource;
	}

	@Override
	public boolean doRepositoryPathsExist(String[] paths, ResourceResolver resourceResolver) {
		for (String path : paths) {
			boolean pathExists = this.doesRepositoryPathExist(path, resourceResolver);
			if (!pathExists) {
				return false;
			}
		}
		return true;
	}

	@Override
	public boolean doRepositoryPathsExist(List<String> paths, ResourceResolver resourceResolver) {
		String[] pathsArray = paths.toArray(new String[0]);
		return this.doRepositoryPathsExist(pathsArray, resourceResolver);
	}
}
