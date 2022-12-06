/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.services;

import org.apache.sling.api.resource.ResourceResolver;

import java.util.List;

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
}
