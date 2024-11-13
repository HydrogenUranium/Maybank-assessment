/* 9fbef606107a605d69c0edbcd8029e5d */
package com.dhl.discover.core.services.impl;

import com.akamai.edgegrid.signer.ClientCredential;
import com.dhl.discover.core.components.EnvironmentConfiguration;
import com.dhl.discover.core.constants.AkamaiInvalidationResult;
import com.dhl.discover.core.constants.DiscoverConstants;
import com.dhl.discover.core.exceptions.HttpRequestException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.dhl.discover.core.config.AkamaiFlushConfigReader;
import com.dhl.discover.core.dto.akamai.ErrorResponse;
import com.dhl.discover.core.dto.akamai.FlushRequest;
import com.dhl.discover.core.dto.akamai.FlushResponse;
import com.dhl.discover.core.services.HttpCommunication;
import com.dhl.discover.core.services.InitUtil;
import com.dhl.discover.core.services.RepositoryChecks;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.dhl.discover.core.utils.LogUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.text.MessageFormat;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

	@Reference
	private HttpCommunication httpCommunication;

	@Reference
	private InitUtil initUtil;

	public AkamaiInvalidationResult invalidateAkamaiCache(String path, String pathSuffix){
		if(canWeFlush(path)){
			var finalUrlToFlush = getHostname(path) + pathSuffix;
			log.info("About to flush the following URL from Akamai: {}", finalUrlToFlush);

			FlushRequest request = FlushRequest.builder()
					.itemsToFlush(getUrlsToFlush(finalUrlToFlush))
					.build();

			FlushResponse response = invalidateItemFromAkamai(request, getAkamaiCredentials());
			if(response != null && response.getDetail().equalsIgnoreCase("request accepted")){
				return AkamaiInvalidationResult.OK;
			}

			return AkamaiInvalidationResult.REJECTED;
		}
		log.info("Skipping akamai flush for page '{}'", path);
		return AkamaiInvalidationResult.SKIPPED;
	}

	private Set<String> getUrlsToFlush(String path) {
		Set<String> urlsToFlush = new HashSet<>();
		urlsToFlush.add(path);
		return urlsToFlush;
	}

	private FlushResponse invalidateItemFromAkamai(FlushRequest flushRequest, ClientCredential credential){
		var client = initUtil.getAkamaiClient(credential);
		String apiPath = MessageFormat.format(akamaiFlushConfigReader.getApiPath(),"production");
		String finalUrl = MessageFormat.format("https://{0}{1}",akamaiFlushConfigReader.getAkamaiHost(),apiPath);

		try {
			var response = httpCommunication.sendPostMessage(finalUrl, flushRequest,client);
			if (response == null) {
				log.error("Akamai Flush: Null response from Akamai");
			} else if (response.getHttpStatus() == 400) {
				ErrorResponse errorResponse = initUtil.getObjectMapper().readValue(response.getJsonResponse(), ErrorResponse.class);
				log.error("Akamai Flush: Error response from Akamai: {}", LogUtils.encode(errorResponse.toString()));
			} else {
				log.info("Akamai Flush: Akamai response code '{}'", response.getHttpStatus());
				return initUtil.getObjectMapper().readValue(response.getJsonResponse(),FlushResponse.class);
			}
		} catch (HttpRequestException e) {
			log.error("Akamai Flush: Http request to Akamai failed with error message: {}", e.getMessage());
		} catch (JsonProcessingException e) {
			log.error("Akamai Flush: Failed to parse the json response from Akamai. Error message was: {}", e.getMessage());
		}
		return null;
	}

	/**
	 * Contains logic to determine whether provided path can be flushed from Akamai cache or not.
	 * @param path is the path (that was captured by replication listener or by other means)
	 * @return boolean {@code true} if we think the path can (and perhaps should) be flushed, {@code false} otherwise
	 */
	private boolean canWeFlush(String path){
		try(var resourceResolver = getResourceResolver()){
			List<String> allowedContentPaths = akamaiFlushConfigReader.getAllowedContentPaths();
			List<String> allowedContentTypes = akamaiFlushConfigReader.getAllowedContentTypes();
			String resourceType = repositoryChecks.getResourceType(path,resourceResolver);

			if(allowedContentTypes.isEmpty() || allowedContentPaths.isEmpty()){
				log.error("There appears to be a problem in the tool's configuration - there are no allowed content paths or not allowed content types." +
						" This will disallow any flush requests from being sent to Akamai");
				return false;
			}

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

	private String getHostname(String path){
		var hostname = DiscoverConstants.HTTPS_PREFIX + environmentConfiguration.getAkamaiHostname();
		if(StringUtils.isBlank(hostname)){
			hostname = DiscoverConstants.DEFAULT_HOSTNAME;
		}
		return MessageFormat.format("{0}{1}{2}", hostname, DiscoverConstants.DISCOVER_CONTEXT, updatePath(path));
	}

	/**
	 * Updates the path based on a simple rule - if the path leads to 'dam' (/content/dam...), we return the original value. Otherwise,
	 * we return original value without '/content/dhl/{global OR country_code}'
	 * @param path is the path as passed to the method (possibly captured by the job listening on replication requests)
	 * @return updated {@link String} that can be used to form Akamaized URL
	 */
	private String updatePath(String path){
		var regex = "/content/dhl/(global|\\w{2})/(.*)";
		return path.replaceAll(regex, "/$2");
	}

	private ResourceResolver getResourceResolver(){
		return resourceResolverHelper.getReadResourceResolver();
	}

	private ClientCredential getAkamaiCredentials(){
		return ClientCredential.builder()
				.clientSecret(akamaiFlushConfigReader.getClientSecret())
				.clientToken(akamaiFlushConfigReader.getClientToken())
				.accessToken(akamaiFlushConfigReader.getAccessToken())
				.host(akamaiFlushConfigReader.getAkamaiHost())
				.build();
	}
}
