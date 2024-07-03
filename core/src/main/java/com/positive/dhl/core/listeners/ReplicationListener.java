/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.listeners;

import com.day.cq.replication.ReplicationAction;
import com.day.cq.replication.ReplicationActionType;
import com.positive.dhl.core.config.AkamaiFlushConfigReader;
import com.positive.dhl.core.constants.AkamaiInvalidationResult;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.impl.AkamaiFlush;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventConstants;
import org.osgi.service.event.EventHandler;

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
	private static final String RESULT_OF_FLUSH_REQUEST = "Akamai Flush: Result of flush request to Akamai: {} ({})";

	@Reference
	private AkamaiFlushConfigReader akamaiFlushConfigReader;

	@Reference
	private AkamaiFlush akamaiFlush;

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
				log.info("Akamai Flush: It appears the replication TYPE was different than '{}' or '{}'. Therefore, not sending anything to Akamai...", ReplicationActionType.ACTIVATE, ReplicationActionType.DEACTIVATE);
			}
		}
		else {
			log.info("Akamai Flush: Akamai flush is disabled. To enable, verify the environment settings in Adobe Cloud Manager.");
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
		while (StringUtils.isNoneBlank(pagePath) && !CONTENT_ROOT_PATH.equals(pagePath)) {
			flushRssCache(pagePath);
			pagePath = removeSubstringFromLastSlash(pagePath);
		}
	}

	private void flushRssCache(String pagePath) {
		AkamaiInvalidationResult rssHomePageFlushResult = akamaiFlush.invalidateAkamaiCache(pagePath, ".rss.xml");
		log.info(RESULT_OF_FLUSH_REQUEST, rssHomePageFlushResult, pagePath);
		AkamaiInvalidationResult rssAllHomePageFlushResult = akamaiFlush.invalidateAkamaiCache(pagePath, ".rss.all.xml");
		log.info(RESULT_OF_FLUSH_REQUEST, rssAllHomePageFlushResult, pagePath);
		AkamaiInvalidationResult rssFullbodyHomePageFlushResult = akamaiFlush.invalidateAkamaiCache(pagePath, ".rss.fullbody.xml");
		log.info(RESULT_OF_FLUSH_REQUEST, rssFullbodyHomePageFlushResult, pagePath);
		AkamaiInvalidationResult rssAllFullbodyHomePageFlushResult = akamaiFlush.invalidateAkamaiCache(pagePath, ".rss.all.fullbody.xml");
		log.info(RESULT_OF_FLUSH_REQUEST, rssAllFullbodyHomePageFlushResult, pagePath);
	}

	private String removeSubstringFromLastSlash(String s) {
		int lastSlashIndex = s.lastIndexOf('/');
		return lastSlashIndex != -1 ? s.substring(0, lastSlashIndex) : s;
	}
}
