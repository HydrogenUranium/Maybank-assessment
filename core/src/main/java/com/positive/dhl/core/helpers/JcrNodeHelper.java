package com.positive.dhl.core.helpers;

import lombok.extern.slf4j.Slf4j;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

@Slf4j
public class JcrNodeHelper {

    public static void addLiveRelationshipMixinType(Node node) throws RepositoryException {
        if(node.canAddMixin("cq:LiveRelationship")) {
            node.addMixin("cq:LiveRelationship");
        } else {
            log.warn("Unable to add mixin cq:LiveRelationship to node: {}", node.getPath());
        }
    }

    public static void addLiveSyncCancelledMixinType(Node node) throws RepositoryException {
        addLiveRelationshipMixinType(node);
        if(node.canAddMixin("cq:LiveSyncCancelled")) {
            node.addMixin("cq:LiveSyncCancelled");
        } else {
            log.warn("Unable to add mixin cq:LiveSyncCancelled to node: {}", node.getPath());
        }
    }
}
