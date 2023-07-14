/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.services.impl;

import com.positive.dhl.core.components.EnvironmentConfiguration;
import com.positive.dhl.core.config.AkamaiFlushConfigReader;
import com.positive.dhl.core.constants.AkamaiInvalidationResult;
import com.positive.dhl.core.services.RepositoryChecks;
import com.positive.dhl.core.services.ResourceResolverHelper;
import lombok.extern.slf4j.Slf4j;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.util.List;

/**
 * Orchestrates the whole process of removing items from Akamai cache upon activation (or on any other request)
 */
@Slf4j
@Component(
		service = AkamaiFlush.class
)
public class AkamaiFlush {

	@Reference
	private EnvironmentConfiguration environmentConfiguration;

	@Reference
	private AkamaiFlushConfigReader akamaiFlushConfigReader;

	@Reference
	private ResourceResolverHelper resourceResolverHelper;

	@Reference
	private RepositoryChecks repositoryChecks;

	public AkamaiInvalidationResult invalidateAkamaiCache(String path){
		if(canWeFlush(path)){
			return AkamaiInvalidationResult.OK;
		}
		log.info("Skipping akamai flush for page '{}'", path);
		return AkamaiInvalidationResult.SKIPPED;
	}

	private boolean canWeFlush(String path){
		try(var resourceResolver = getResourceResolver()){
			List<String> allowedContentPaths = akamaiFlushConfigReader.getAllowedContentPaths();
			List<String> allowedContentTypes = akamaiFlushConfigReader.getAllowedContentTypes();
			String resourceType = repositoryChecks.getResourceType(path,resourceResolver);

			return allowedContentTypes.contains(resourceType) && isContentPathValid(path, allowedContentPaths);
		}
	}

	private boolean isContentPathValid(String path, List<String> contentPaths){
		for (String contentPath : contentPaths){
			if(path.startsWith(contentPath)){
				log.info("Content path '{}' is a valid Akamai flush path for '{}'", contentPath, path);
				return true;
			}
		}
		log.info("Content path '{}' is not valid Akamai flush content path", path);
		return false;
	}

	private ResourceResolver getResourceResolver(){
		return resourceResolverHelper.getReadResourceResolver();
	}
}
