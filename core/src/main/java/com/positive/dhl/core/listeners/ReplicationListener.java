/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.listeners;

import com.day.cq.replication.ReplicationAction;
import com.day.cq.replication.ReplicationActionType;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.positive.dhl.core.config.AkamaiFlushConfigReader;
import com.positive.dhl.core.constants.AkamaiInvalidationResult;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.ResourceResolverHelper;
import com.positive.dhl.core.services.impl.AkamaiFlush;
import lombok.extern.slf4j.Slf4j;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventConstants;
import org.osgi.service.event.EventHandler;

import javax.jcr.Session;
import java.util.Optional;

import static com.positive.dhl.core.services.PageUtilService.CONTENT_ROOT_PATH;
import static com.positive.dhl.core.services.PageUtilService.ROOT_PAGE_PATH;

@Slf4j
@Component(
		service = EventHandler.class,
		property = {
				EventConstants.EVENT_TOPIC + "=" + ReplicationAction.EVENT_TOPIC
		}
)
public class ReplicationListener implements EventHandler {
	private static final String RESULT_OF_FLUSH_REQUEST = "Result of flush request to Akamai: {} ({})";

	@Reference
	private AkamaiFlushConfigReader akamaiFlushConfigReader;

	@Reference
	private AkamaiFlush akamaiFlush;

	@Reference
	private ResourceResolverHelper resourceResolverHelper;

	@Reference
	private PageUtilService pageUtilService;

	@Override
	public void handleEvent(Event event) {
		if(akamaiFlushConfigReader.isEnabled()){
			var replicationAction = ReplicationAction.fromEvent(event);
			if (null != replicationAction && isInScope(replicationAction)) {
				String replicationPagePath = replicationAction.getPath();

				flushPageCache(replicationPagePath);
				flushSitemapCache(replicationPagePath);
				flushAllRssCache(replicationPagePath);
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

	private void flushPageCache(String pagePath) {
		AkamaiInvalidationResult flushReplicatedPageResult = akamaiFlush.invalidateAkamaiCache(pagePath);
		log.info(RESULT_OF_FLUSH_REQUEST, flushReplicatedPageResult, pagePath);
	}

	private void flushSitemapCache(String pagePath) {
		AkamaiInvalidationResult sitemapHomePageFlushResult = akamaiFlush.invalidateAkamaiCache(pageUtilService.getHomePagePath(pagePath), "/sitemap.xml");
		log.info(RESULT_OF_FLUSH_REQUEST, sitemapHomePageFlushResult, pagePath + "/sitemap.xml");
		AkamaiInvalidationResult sitemapRootPageFlushResult = akamaiFlush.invalidateAkamaiCache(ROOT_PAGE_PATH, "/sitemap-index.xml");
		log.info(RESULT_OF_FLUSH_REQUEST, sitemapRootPageFlushResult, pagePath + "/sitemap-index.xml");
	}

	private void flushAllRssCache(String pagePath) {
		var resourceResolver = resourceResolverHelper.getReadResourceResolver();
		try {
			PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
			if (pageManager != null) {
				Page page = pageManager.getContainingPage(pagePath);
				if (page != null) {
					flushRssCache(page);

					Page parent = page.getParent();
					while (parent != null && !CONTENT_ROOT_PATH.equals(parent.getPath())) {
						flushRssCache(parent);
						parent = parent.getParent();
					}
				} else {
					log.error("Page not found at path: " + pagePath);
				}
			} else {
				log.error("PageManager service is unavailable");
			}
		} catch (Exception e) {
			log.error("Error during page replication", e);
		}
	}

	private void flushRssCache(Page page) {
		String pagePath = page.getPath();
		AkamaiInvalidationResult rssHomePageFlushResult = akamaiFlush.invalidateAkamaiCache(pagePath, ".rss.xml");
		log.info(RESULT_OF_FLUSH_REQUEST, rssHomePageFlushResult, pagePath);
		AkamaiInvalidationResult rssAllHomePageFlushResult = akamaiFlush.invalidateAkamaiCache(pagePath, ".rss.all.xml");
		log.info(RESULT_OF_FLUSH_REQUEST, rssAllHomePageFlushResult, pagePath);
		AkamaiInvalidationResult rssFullbodyHomePageFlushResult = akamaiFlush.invalidateAkamaiCache(pagePath, ".rss.fullbody.xml");
		log.info(RESULT_OF_FLUSH_REQUEST, rssFullbodyHomePageFlushResult, pagePath);
		AkamaiInvalidationResult rssAllFullbodyHomePageFlushResult = akamaiFlush.invalidateAkamaiCache(pagePath, ".rss.all.fullbody.xml");
		log.info(RESULT_OF_FLUSH_REQUEST, rssAllFullbodyHomePageFlushResult, pagePath);
	}
}
