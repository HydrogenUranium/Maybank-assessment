package com.positive.dhl.core.helpers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JcrNodeHelperTest {

    @Mock
    private Node mockNode;

    @BeforeEach
    void init() throws RepositoryException {
        when(mockNode.canAddMixin("cq:LiveRelationship")).thenReturn(true);
    }

    @Test
    void addLiveRelationshipMixinType_shouldAddMixin_whenNodeCanAddMixin() throws RepositoryException {
        JcrNodeHelper.addLiveRelationshipMixinType(mockNode);

        verify(mockNode).addMixin("cq:LiveRelationship");
    }

    @Test
    void addLiveRelationshipMixinType_shouldNotAddMixin_whenNodeCannotAddMixin() throws RepositoryException {
        when(mockNode.canAddMixin("cq:LiveRelationship")).thenReturn(false);

        JcrNodeHelper.addLiveRelationshipMixinType(mockNode);

        verify(mockNode, times(0)).addMixin("cq:LiveRelationship");
    }

    @Test
    void addLiveSyncCancelledMixinType_shouldAddMixin_whenNodeCanAddMixin() throws RepositoryException {
        when(mockNode.canAddMixin("cq:LiveSyncCancelled")).thenReturn(true);

        JcrNodeHelper.addLiveSyncCancelledMixinType(mockNode);

        verify(mockNode).addMixin("cq:LiveSyncCancelled");
    }

    @Test
    void addLiveSyncCancelledMixinType_shouldNotAddMixin_whenNodeCannotAddMixin() throws RepositoryException {
        when(mockNode.canAddMixin("cq:LiveSyncCancelled")).thenReturn(false);

        JcrNodeHelper.addLiveSyncCancelledMixinType(mockNode);

        verify(mockNode, times(0)).addMixin("cq:LiveSyncCancelled");
    }
}