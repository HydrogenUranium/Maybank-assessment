package com.positive.dhl.core.services.impl;

import com.day.cq.commons.jcr.JcrConstants;
import com.positive.dhl.core.services.RepositoryChecks;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;
import org.osgi.service.component.annotations.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Provides functionality to check if specific path (or paths) exist in the repository
 */
@Component(
		service = RepositoryChecks.class
)
public class RepositoryChecksImpl implements RepositoryChecks {
	@Override
	public boolean doesRepositoryPathExist(String path, ResourceResolver resourceResolver) {
		var resource = resourceResolver.getResource(path);
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

	@Override
	public String getResourceType(String path, ResourceResolver resourceResolver) {
		var resource = resourceResolver.getResource(path);
		if(null != resource){
			var properties = resource.getValueMap();
			if(properties.containsKey(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY)){
				return properties.get(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY, String.class);
			}

			if(properties.containsKey(JcrConstants.JCR_PRIMARYTYPE)){
				return properties.get(JcrConstants.JCR_PRIMARYTYPE, String.class);
			}
		}
		return null;
	}

	@Override
	public Map<String, String> getResourceTypes(String[] paths, ResourceResolver resourceResolver) {
		Map<String,String> resourceTypes = new HashMap<>();
		for (String path : paths) {
			resourceTypes.put(path,getResourceType(path,resourceResolver));
		}
		return resourceTypes;
	}
}
