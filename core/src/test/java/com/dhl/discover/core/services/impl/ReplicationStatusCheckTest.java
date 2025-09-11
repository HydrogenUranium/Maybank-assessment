package com.dhl.discover.core.services.impl;

import com.day.cq.replication.ReplicationActionType;
import com.day.cq.replication.ReplicationStatus;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReplicationStatusCheckTest {

    private ReplicationStatusCheck replicationStatusCheck;

    @Mock
    private Page mockPage;

    @Mock
    private Resource mockResource;

    @Mock
    private ReplicationStatus mockReplicationStatus;

    @BeforeEach
    void setUp() {
        replicationStatusCheck = new ReplicationStatusCheck();
    }

    @Test
    void testIsPublishedWhenEnabled() {
        ReplicationStatusCheck.Configuration config = mock(ReplicationStatusCheck.Configuration.class);
        when(config.enabled()).thenReturn(true);
        replicationStatusCheck.activate(config);

        when(mockPage.hasContent()).thenReturn(true);
        when(mockPage.getContentResource()).thenReturn(mockResource);
        when(mockResource.adaptTo(ReplicationStatus.class)).thenReturn(mockReplicationStatus);

        when(mockReplicationStatus.getLastReplicationAction()).thenReturn(ReplicationActionType.ACTIVATE);
        assertTrue(replicationStatusCheck.isPublished(mockPage));

        when(mockReplicationStatus.getLastReplicationAction()).thenReturn(ReplicationActionType.DEACTIVATE);
        assertFalse(replicationStatusCheck.isPublished(mockPage));
    }

    @Test
    void testIsPublishedWhenDisabled() {
        ReplicationStatusCheck.Configuration config = mock(ReplicationStatusCheck.Configuration.class);
        when(config.enabled()).thenReturn(false);
        replicationStatusCheck.activate(config);
        assertTrue(replicationStatusCheck.isPublished(mockPage));

        verify(mockPage, never()).hasContent();
    }

    @Test
    void testIsPublishedWithNullPage() {

        ReplicationStatusCheck.Configuration config = mock(ReplicationStatusCheck.Configuration.class);
        when(config.enabled()).thenReturn(true);
        replicationStatusCheck.activate(config);

        assertFalse(replicationStatusCheck.isPublished(null));
    }

    @Test
    void testIsPublishedWithNoContent() {
        ReplicationStatusCheck.Configuration config = mock(ReplicationStatusCheck.Configuration.class);
        when(config.enabled()).thenReturn(true);
        replicationStatusCheck.activate(config);

        when(mockPage.hasContent()).thenReturn(false);

        assertFalse(replicationStatusCheck.isPublished(mockPage));
    }

    @Test
    void testIsPublishedWithNoReplicationStatus() {
        ReplicationStatusCheck.Configuration config = mock(ReplicationStatusCheck.Configuration.class);
        when(config.enabled()).thenReturn(true);
        replicationStatusCheck.activate(config);

        when(mockPage.hasContent()).thenReturn(true);
        when(mockPage.getContentResource()).thenReturn(mockResource);
        when(mockResource.adaptTo(ReplicationStatus.class)).thenReturn(null);

        assertFalse(replicationStatusCheck.isPublished(mockPage));
    }
}
