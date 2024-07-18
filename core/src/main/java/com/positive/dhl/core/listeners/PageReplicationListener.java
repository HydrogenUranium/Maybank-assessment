package com.positive.dhl.core.listeners;

import com.day.cq.replication.ReplicationAction;
import com.day.cq.replication.ReplicationActionType;
import com.positive.dhl.core.config.AkamaiFlushConfigReader;
import com.positive.dhl.core.constants.AkamaiInvalidationResult;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.impl.AkamaiFlush;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.JobManager;
import org.apache.sling.event.jobs.consumer.JobConsumer;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventConstants;
import org.osgi.service.event.EventHandler;

import java.util.Collections;

import static com.positive.dhl.core.services.PageUtilService.CONTENT_ROOT_PATH;
import static com.positive.dhl.core.services.PageUtilService.ROOT_PAGE_PATH;

@Slf4j
@Component(
        service = {EventHandler.class, JobConsumer.class},
        configurationPolicy = ConfigurationPolicy.OPTIONAL,
        immediate = true,
        property = {
                JobConsumer.PROPERTY_TOPICS + "=" + PageReplicationListener.JOB_TOPIC,
                EventConstants.EVENT_TOPIC + "=" + ReplicationAction.EVENT_TOPIC,
                EventConstants.EVENT_FILTER + "=(|"
                        + "(paths=/content/dhl/*))"
        })
public class PageReplicationListener implements EventHandler, JobConsumer {
    static final String JOB_TOPIC = "solr/content/replication";
    private static final String KEY_REPLICATION_ACTION = "replicationAction";

    private static final String RESULT_OF_FLUSH_REQUEST = "Akamai Flush: Result of flush request to Akamai: {} ({})";

    @Reference
    private JobManager jobManager;

    @Reference
    private AkamaiFlushConfigReader akamaiFlushConfigReader;

    @Reference
    private AkamaiFlush akamaiFlush;

    @Reference
    private PageUtilService pageUtilService;

    @Override
    public void handleEvent(Event event) {
        ReplicationAction action = ReplicationAction.fromEvent(event);
        jobManager.addJob(JOB_TOPIC, Collections.singletonMap(KEY_REPLICATION_ACTION, action));
    }

    @Override
    public JobResult process(Job job) {
        ReplicationAction action = job.getProperty(KEY_REPLICATION_ACTION, ReplicationAction.class);
        for (String resourcePath : action.getPaths()) {
            processResource(resourcePath, action.getType());
        }
        return JobResult.OK;
    }

    private void processResource(String resourcePath, ReplicationActionType replicationActionType) {
        if (replicationActionType.equals(ReplicationActionType.ACTIVATE) || replicationActionType.equals(ReplicationActionType.DEACTIVATE)) {
            processReplication(resourcePath);
        } else {
            log.info("Akamai Flush: It appears the replication TYPE was different than 'ACTIVATE' or 'DEACTIVATE'. Therefore, not sending anything to Akamai...");
        }
    }

    private void processReplication(String replicationPagePath) {
        if (akamaiFlushConfigReader.isEnabled()) {
            log.info("Akamai Flush: Akamai flush is enabled. Replication page path is {}", replicationPagePath);

            flushPageCache(replicationPagePath);
            flushSitemapCache(replicationPagePath);
            flushAllRssCache(replicationPagePath);
        } else {
            log.info("Akamai Flush: Akamai flush is disabled. To enable, verify the environment settings in Adobe Cloud Manager.");
        }
    }

    private void flushPageCache(String pagePath) {
        AkamaiInvalidationResult result = akamaiFlush.invalidateAkamaiCache(pagePath, StringUtils.EMPTY);
        log.info(RESULT_OF_FLUSH_REQUEST, result, pagePath);
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
