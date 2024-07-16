/* 9fbef606107a605d69c0edbcd8029e5d */
package com.positive.dhl.core.listeners;

import com.day.cq.replication.ReplicationAction;
import com.day.cq.replication.ReplicationActionType;
import com.positive.dhl.core.config.AkamaiFlushConfigReader;
import com.positive.dhl.core.constants.AkamaiInvalidationResult;
import com.positive.dhl.core.services.impl.AkamaiFlush;
import lombok.extern.slf4j.Slf4j;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventConstants;
import org.osgi.service.event.EventHandler;

@Slf4j
@Component(
		service = EventHandler.class,
		property = {
				EventConstants.EVENT_TOPIC + "=" + ReplicationAction.EVENT_TOPIC
		}
)
public class ReplicationListener implements EventHandler {

	@Reference
	private AkamaiFlushConfigReader akamaiFlushConfigReader;

	@Reference
	private AkamaiFlush akamaiFlush;

	@Override
	public void handleEvent(Event event) {
		if(akamaiFlushConfigReader.isEnabled()){
			var replicationAction = ReplicationAction.fromEvent(event);
			if(null != replicationAction && isInScope(replicationAction)){
				log.info("Path: {}", replicationAction.getPath());
				AkamaiInvalidationResult result = akamaiFlush.invalidateAkamaiCache(replicationAction.getPath());
				log.info("Result of flush request to Akamai: {}", result);
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
}
