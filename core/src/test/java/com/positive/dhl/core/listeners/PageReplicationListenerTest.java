package com.positive.dhl.core.listeners;

import com.day.cq.replication.ReplicationAction;
import com.day.cq.replication.ReplicationActionType;
import com.positive.dhl.core.config.AkamaiFlushConfigReader;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.impl.AkamaiFlush;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.JobManager;
import org.apache.sling.event.jobs.consumer.JobConsumer;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.osgi.service.event.Event;

import static com.positive.dhl.core.listeners.PageReplicationListener.KEY_REPLICATION_ACTION;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PageReplicationListenerTest {
    AemContext context = new AemContext(ResourceResolverType.RESOURCEPROVIDER_MOCK);

    @Mock
    private JobManager jobManager;

    @Mock
    AkamaiFlushConfigReader akamaiFlushConfigReader;

    @Mock
    AkamaiFlush akamaiFlush;

    @Mock
    private PageUtilService pageUtilService;

    @InjectMocks
    private PageReplicationListener listener;

    @Mock
    private Event event;

    @Mock
    private Job job;

    private static final String DUMMY_PATH = "/content/dhl/global/en-global/test-page";

    @BeforeEach
    void setUp() {
        context.registerService(AkamaiFlushConfigReader.class,akamaiFlushConfigReader);
        context.registerService(AkamaiFlush.class,akamaiFlush);
        context.registerService(PageUtilService.class, pageUtilService);
        context.registerService(JobManager.class, jobManager);
    }

    @Test
    void testHandleEvent() {
        ReplicationAction action = mock(ReplicationAction.class);
        mockStatic(ReplicationAction.class);
        when(ReplicationAction.fromEvent(event)).thenReturn(action);
        when(jobManager.addJob(eq(PageReplicationListener.JOB_TOPIC), anyMap())).thenReturn(mock(Job.class));

        listener.handleEvent(event);

        verify(jobManager).addJob(eq(PageReplicationListener.JOB_TOPIC), anyMap());
    }

    @Test
    void testProcess() {
        ReplicationAction action = new ReplicationAction(ReplicationActionType.ACTIVATE, "/content/dhl/home");
        when(job.getProperty(KEY_REPLICATION_ACTION, ReplicationAction.class)).thenReturn(action);
        when(akamaiFlushConfigReader.isEnabled()).thenReturn(true);
        when(pageUtilService.getHomePagePath("/content/dhl/home")).thenReturn("/content/dhl/home");

        assertEquals(JobConsumer.JobResult.OK, listener.process(job));
        verify(akamaiFlush).invalidateAkamaiCache("/content/dhl/home", StringUtils.EMPTY);
        verify(akamaiFlush).invalidateAkamaiCache("/content/dhl/home", "/sitemap.xml");
        verify(akamaiFlush).invalidateAkamaiCache("/content/dhl", "/sitemap-index.xml");
        verify(akamaiFlush).invalidateAkamaiCache("/content/dhl/home", ".rss.xml");
        verify(akamaiFlush).invalidateAkamaiCache("/content/dhl/home", ".rss.all.xml");
        verify(akamaiFlush).invalidateAkamaiCache("/content/dhl/home", ".rss.fullbody.xml");
        verify(akamaiFlush).invalidateAkamaiCache("/content/dhl/home", ".rss.all.fullbody.xml");
    }
}