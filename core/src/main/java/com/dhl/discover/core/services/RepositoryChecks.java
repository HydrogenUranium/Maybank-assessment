/* 9fbef606107a605d69c0edbcd8029e5d */
package com.dhl.discover.core.services;

import org.apache.sling.api.resource.ResourceResolver;

import java.util.List;
import java.util.Map;

/**
 * Provides functionality to check if specific path (or paths) exist in the repository
 */
public interface RepositoryChecks {

	/**
	 * <b>doesRepositoryPathExist</b> is a helper method to confirm whether the provided path
	 * exists in the repository or not. <br />
	 *
	 * @param path             {@link String} representing the content path
	 * @param resourceResolver is an instance of {@link ResourceResolver}
	 * @return {@link Boolean} true if path exists in the repository, false if not
	 */
	boolean doesRepositoryPathExist(String path, ResourceResolver resourceResolver);

	/**
	 * Helper method to check a number of paths for existence within the AEM instance. Uses {@link RepositoryChecks#doesRepositoryPathExist(String, ResourceResolver)}
	 * in the background.
	 *
	 * @param paths            is an {@code Array} of {@code String}s representing the paths the calling code wishes to check for existence.
	 * @param resourceResolver is an instance of {@link ResourceResolver}, typically obtained from Sling Servlet or by some other means
	 * @return {@code true} when <b>all</b> paths actually exist or {@code false} if at least <b>one</b> path does not exist.
	 */
	boolean doRepositoryPathsExist(String[] paths, ResourceResolver resourceResolver);

	/**
	 * Helper method to check a number of paths for existence within the AEM instance. Uses {@link RepositoryChecks#doesRepositoryPathExist(String, ResourceResolver)}
	 * in the background.
	 *
	 * @param paths            is a {@code List} of {@code String}s representing the paths the calling code wishes to check for existence.
	 * @param resourceResolver is an instance of {@link ResourceResolver}, typically obtained from Sling Servlet or by some other means
	 * @return {@code true} when <b>all</b> paths actually exist or {@code false} if at least <b>one</b> path does not exist.
	 */
	boolean doRepositoryPathsExist(List<String> paths, ResourceResolver resourceResolver);

	/**
	 * Provides resource type of  'resource' as {@link String}; if not available, returns the value of jcr:primaryType
	 * @param path is a path in repository that we want to check the resource type of
	 * @param resourceResolver is an instance of {@link ResourceResolver} we leverage to access the repository
	 * @return String representation of a resourceType or {@code null if the provided path does not exist in the repository (or we cannot access it)
	 */
	String getResourceType(String path, ResourceResolver resourceResolver);

	/**
	 * Provides resource types of multiple paths provided as array of {@link String}s.
	 * @param paths is an array of strings
	 * @param resourceResolver is a {@link ResourceResolver} that we leverage to gain access to the repository
	 * @return a {@link Map} of original provides paths as keys and found resource type as value; if not found, or not identifiable, this value may be {@code null}
	 */
	Map<String,String> getResourceTypes(String[] paths, ResourceResolver resourceResolver);
}
