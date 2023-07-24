package com.positive.dhl.core.listeners;

import com.day.cq.replication.ReplicationAction;
import com.day.cq.replication.ReplicationActionType;
import com.positive.dhl.core.config.AkamaiFlushConfigReader;
import com.positive.dhl.core.services.impl.AkamaiFlush;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.osgi.service.event.Event;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ReplicationListenerTest {

	AemContext context = new AemContext(ResourceResolverType.RESOURCEPROVIDER_MOCK);

	@Mock
	AkamaiFlushConfigReader akamaiFlushConfigReader;

	@Mock
	AkamaiFlush akamaiFlush;

	ReplicationListener underTest;

	private static final String DUMMY_PATH = "/content/dummy-path";

	@BeforeEach
	void setUp() {
		Map<String,Object> injectedServices = new HashMap<>();
		injectedServices.putIfAbsent("akamaiFlushConfigReader", akamaiFlushConfigReader);
		injectedServices.putIfAbsent("akamaiFlush", akamaiFlush);

		context.registerService(AkamaiFlushConfigReader.class,akamaiFlushConfigReader);
		context.registerService(AkamaiFlush.class,akamaiFlush);

		underTest = new ReplicationListener();
		context.registerInjectActivateService(underTest,injectedServices);
	}

	@Test
	void configurationDisabled() {
		when(akamaiFlushConfigReader.getEnabled()).thenReturn(false);
		underTest.handleEvent(this.initializeEvent());
		verifyNoMoreInteractions(akamaiFlush);
	}

	@Test
	void invalidReplicationAction(){
		when(akamaiFlushConfigReader.getEnabled()).thenReturn(true);
		try (MockedStatic<ReplicationAction> replicationActionMockedStatic = mockStatic(ReplicationAction.class)){
			replicationActionMockedStatic.when(() -> ReplicationAction.fromEvent(any(Event.class)))
					.thenReturn(new ReplicationAction(ReplicationActionType.TEST,DUMMY_PATH));

			underTest.handleEvent(mock(Event.class));
			verifyNoMoreInteractions(akamaiFlush);
		}
	}

	@Test
	void happyPathScenario(){
		when(akamaiFlushConfigReader.getEnabled()).thenReturn(true);
		try (MockedStatic<ReplicationAction> replicationActionMockedStatic = mockStatic(ReplicationAction.class)){
			replicationActionMockedStatic.when(() -> ReplicationAction.fromEvent(any(Event.class)))
					.thenReturn(new ReplicationAction(ReplicationActionType.ACTIVATE,DUMMY_PATH));

			Event testEvent = initializeEvent();
			underTest.handleEvent(testEvent);
			verify(akamaiFlush, times(1)).invalidateAkamaiCache(DUMMY_PATH);
		}
	}

	private Event initializeEvent(){
		Map<String,Object> eventProperties = new HashMap<>();
		String[] agentIds = {"publish"};
		String[] paths = {"/content/dummy-path"};
		eventProperties.put("modificationDate", Calendar.getInstance());
		eventProperties.put("agentIds", agentIds);
		eventProperties.put("type", ReplicationActionType.ACTIVATE);
		eventProperties.put("paths", paths);
		eventProperties.put("userId", "admin");
		return new Event(ReplicationAction.EVENT_TOPIC, eventProperties);
	}
}
