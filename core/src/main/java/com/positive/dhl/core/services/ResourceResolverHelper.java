/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.services;

import com.positive.dhl.core.constants.DiscoverConstants;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Session;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Helper OSGi service that's able to obtain an instance of {@code ResourceResolver} by using the system user - service mapping directly in AEM
 */
@Component(
		service = ResourceResolverHelper.class
)
public class ResourceResolverHelper {

	private static final Logger LOGGER = LoggerFactory.getLogger(ResourceResolverHelper.class);

	@Reference
	ResourceResolverFactory resourceResolverFactory;

	public ResourceResolver getUserManagerResourceResolver(){
		return getResourceResolver(DiscoverConstants.DISCOVER_USER_MANAGER_Service);
	}

	/**
	 * Provides 'read' ResourceResolver (that has no permissions to modify anything, just read).
	 * Calling code should take care to close this resolver when no longer needed (either in 'finally' block
	 * or via @clean annotation in Lombok)
	 * @return a new instance of {@link ResourceResolver} that has permissions to read or {@code null} in case an error occurred
	 */
	public ResourceResolver getReadResourceResolver(){
		return getResourceResolver(DiscoverConstants.DISCOVER_READ_SERVICE);
	}

	/**
	 * Provides 'write' ResourceResolver (that has permissions to write to /content/dhl)..Calling code
	 * should take care to close this resolver when no longer needed (either in 'finally' block
	 * or via @clean annotation in Lombok)
	 * @return a new instance of {@link ResourceResolver} that has permissions to 'write' or {@code null} in case an error occurred
	 */
	public ResourceResolver getWriteResourceResolver(){
		return getResourceResolver(DiscoverConstants.DISCOVER_WRITE_SERVICE);
	}

	private ResourceResolver getResourceResolver(String systemUser){
		try {
			final Map<String, Object> authInfo = new HashMap<>();
			authInfo.put(ResourceResolverFactory.SUBSERVICE,systemUser);

			return resourceResolverFactory.getServiceResourceResolver(authInfo);


		} catch (LoginException e) {
			LOGGER.error("Error has occurred when trying to get a ResourceResolver for user {}. More details (if available): {}", systemUser, e.getMessage());
			return null;
		}
	}

	public ResourceResolver getResourceResolver(Session session) {
		try {
			return resourceResolverFactory.getResourceResolver(Collections.singletonMap("user.jcr.session", session));
		} catch (LoginException e) {
			LOGGER.error("Error has occurred when trying to get a ResourceResolver from session");
			return null;
		}
	}
}
