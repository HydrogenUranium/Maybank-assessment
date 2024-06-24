/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.listeners;

import com.day.cq.replication.*;
import com.day.cq.replication.ReplicationActionType;
import com.positive.dhl.core.config.AkamaiFlushConfigReader;
import com.positive.dhl.core.constants.AkamaiInvalidationResult;
import com.positive.dhl.core.services.ResourceResolverHelper;
import com.positive.dhl.core.services.impl.AkamaiFlush;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventConstants;
import org.osgi.service.event.EventHandler;

import javax.jcr.Session;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.positive.dhl.core.services.PageUtilService.ROOT_PAGE_PATH;

@Slf4j
@Component(
		service = EventHandler.class,
		property = {
				EventConstants.EVENT_TOPIC + "=" + ReplicationAction.EVENT_TOPIC
		}
)
public class ReplicationListener implements EventHandler {
	private static final String RESULT_OF_FLUSH_REQUEST = "Result of flush request to Akamai: {}";

	@Reference
	private AkamaiFlushConfigReader akamaiFlushConfigReader;

	@Reference
	private AkamaiFlush akamaiFlush;

	@Reference
	private ResourceResolverHelper resourceResolverHelper;

	@Reference
	private Replicator replicator;

	@Override
	public void handleEvent(Event event) {
		if(akamaiFlushConfigReader.isEnabled()){
			var replicationAction = ReplicationAction.fromEvent(event);
			if (null != replicationAction && isInScope(replicationAction)) {

				String replicationPagePath = replicationAction.getPath();

				log.info("Path: {}", replicationPagePath);
				AkamaiInvalidationResult flushReplicatedPageResult = akamaiFlush.invalidateAkamaiCache(replicationPagePath);
				log.info(RESULT_OF_FLUSH_REQUEST, flushReplicatedPageResult);

				flushSitemapAndRss(replicationPagePath);
			} else {
				log.info("It appears the replication TYPE was different than '{}' or '{}'. Therefore, not sending anything to Akamai...", ReplicationActionType.ACTIVATE, ReplicationActionType.DEACTIVATE);
			}
		}
		else {
			log.info("Akamai flush is disabled. To enable, verify the environment settings in Adobe Cloud Manager.");
		}

	}

	private boolean isInScope(ReplicationAction replicationAction){
		ReplicationActionType actionType = replicationAction.getType();
		return actionType.equals(ReplicationActionType.ACTIVATE) || actionType.equals(ReplicationActionType.DEACTIVATE);
	}

	private void flushSitemapAndRss(String pagePath) {
		try (var resourceResolver = resourceResolverHelper.getReadResourceResolver()) {
			String homePagePath = getHomePagePath(pagePath);
			if (isActivatedPage(homePagePath, resourceResolver)) {
				publishPage(homePagePath, resourceResolver);
				publishPage(ROOT_PAGE_PATH, resourceResolver);

				AkamaiInvalidationResult sitemapHomePageFlushResult = akamaiFlush.invalidateAkamaiCache(homePagePath, "/sitemap.xml");
				log.info(RESULT_OF_FLUSH_REQUEST, sitemapHomePageFlushResult);
				AkamaiInvalidationResult sitemapRootPageFlushResult = akamaiFlush.invalidateAkamaiCache(ROOT_PAGE_PATH, "/sitemap-index.xml");
				log.info(RESULT_OF_FLUSH_REQUEST, sitemapRootPageFlushResult);

				AkamaiInvalidationResult rssHomePageFlushResult = akamaiFlush.invalidateAkamaiCache(homePagePath, ".rss.xml");
				log.info(RESULT_OF_FLUSH_REQUEST, rssHomePageFlushResult);
				AkamaiInvalidationResult rssAllHomePageFlushResult = akamaiFlush.invalidateAkamaiCache(homePagePath, ".rss.all.xml");
				log.info(RESULT_OF_FLUSH_REQUEST, rssAllHomePageFlushResult);
				AkamaiInvalidationResult rssRootPageFlushResult = akamaiFlush.invalidateAkamaiCache(ROOT_PAGE_PATH, ".rss.xml");
				log.info(RESULT_OF_FLUSH_REQUEST, rssRootPageFlushResult);
				AkamaiInvalidationResult rssAllRootPageFlushResult = akamaiFlush.invalidateAkamaiCache(ROOT_PAGE_PATH, ".rss.all.xml");
				log.info(RESULT_OF_FLUSH_REQUEST, rssAllRootPageFlushResult);
			}
		} catch (Exception e) {
			log.error("Error during page replication", e);
		}
	}

	public String getHomePagePath(String pagePath) {
		return Optional.ofNullable(pagePath)
				.map(path -> Pattern.compile("^(/content/dhl/(global|\\w{2})/(\\w{2})-(global|\\w{2}))").matcher(path))
				.filter(Matcher::find)
				.map(m -> m.group(1))
				.orElse(StringUtils.EMPTY);
	}

	private boolean isActivatedPage(String pagePath, ResourceResolver resourceResolver) {
		boolean result = false;
		Resource resource = resourceResolver.getResource(pagePath);
		if (resource != null) {
			ReplicationStatus replicationStatus = resource.adaptTo(ReplicationStatus.class);
			if (replicationStatus != null) {
				result = replicationStatus.isActivated();
			} else {
				log.error("Failed to get ReplicationStatus for resource: {}", pagePath);
			}
		} else {
			log.error("Resource not found: {}", pagePath);
		}
		return result;
	}

	public void publishPage(String pagePath, ResourceResolver resourceResolver) throws ReplicationException {
		try {
			if (resourceResolver != null) {
				Session session = resourceResolver.adaptTo(Session.class);

				if (session != null) {
					ReplicationOptions replicationOptions = new ReplicationOptions();
					replicator.replicate(session, ReplicationActionType.ACTIVATE, pagePath, replicationOptions);
					log.info("Page published successfully: {}", pagePath);
				} else {
					log.error("Could not get JCR session from resource resolver.");
				}
			} else {
				log.error("Could not get service resource resolver.");
			}
		} catch ( ReplicationException e) {
			log.error("Error during replicating : {}", pagePath);
		}
	}
}
