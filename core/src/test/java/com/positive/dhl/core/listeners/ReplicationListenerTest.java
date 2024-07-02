package com.positive.dhl.core.listeners;

import com.day.cq.replication.ReplicationAction;
import com.day.cq.replication.ReplicationActionType;
import com.day.cq.replication.ReplicationStatus;
import com.day.cq.replication.Replicator;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.positive.dhl.core.config.AkamaiFlushConfigReader;
import com.positive.dhl.core.services.PageUtilService;
import com.positive.dhl.core.services.ResourceResolverHelper;
import com.positive.dhl.core.services.impl.AkamaiFlush;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.osgi.service.event.Event;

import javax.jcr.Session;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import static com.positive.dhl.core.utils.Constants.NEW_CONTENT_STRUCTURE_JSON;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ReplicationListenerTest {
	public static final String PAGE_PATH = "/content";

	AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

	@Mock
	AkamaiFlushConfigReader akamaiFlushConfigReader;

	@Mock
	AkamaiFlush akamaiFlush;

	@Mock
	private ResourceResolverHelper resourceResolverHelper;

	@Mock
	private ResourceResolver resourceResolver;

	@Mock
	private Resource resource;

	@Mock
	private Replicator replicator;

	@Mock
	private ReplicationStatus replicationStatus;

	@Mock
	private Session session;

	@Mock
	private PageManager pageManager;

	@Mock
	private PageUtilService pageUtilService;

	ReplicationListener underTest;

	public static final String DUMMY_PATH = "/content/dhl/us/es-us/category-page/article-page";

	@BeforeEach
	void setUp() {
		MockitoAnnotations.initMocks(this);

		Map<String, Object> injectedServices = new HashMap<>();
		injectedServices.putIfAbsent("akamaiFlushConfigReader", akamaiFlushConfigReader);
		injectedServices.putIfAbsent("akamaiFlush", akamaiFlush);

		context.registerService(AkamaiFlushConfigReader.class, akamaiFlushConfigReader);
		context.registerService(AkamaiFlush.class, akamaiFlush);
		context.registerService(ResourceResolverHelper.class, resourceResolverHelper);
		context.registerService(Replicator.class, replicator);
		context.registerService(PageUtilService.class, pageUtilService);

		resourceResolver = context.resourceResolver();
		context.load().json(NEW_CONTENT_STRUCTURE_JSON, PAGE_PATH);

		lenient().when(resourceResolverHelper.getWriteResourceResolver()).thenReturn(resourceResolver);

		underTest = new ReplicationListener();
		context.registerInjectActivateService(underTest, injectedServices);
	}

	@Test
	void configurationDisabled() {
		when(akamaiFlushConfigReader.isEnabled()).thenReturn(false);
		underTest.handleEvent(this.initializeEvent());
		verifyNoMoreInteractions(akamaiFlush);
	}

	@Test
	void invalidReplicationAction() {
		when(akamaiFlushConfigReader.isEnabled()).thenReturn(true);
		try (MockedStatic<ReplicationAction> replicationActionMockedStatic = mockStatic(ReplicationAction.class)) {
			replicationActionMockedStatic.when(() -> ReplicationAction.fromEvent(any(Event.class)))
					.thenReturn(new ReplicationAction(ReplicationActionType.TEST, DUMMY_PATH));

			underTest.handleEvent(mock(Event.class));
			verifyNoMoreInteractions(akamaiFlush);
		}
	}

	@Test
	void happyPathScenario() {
		resource = resourceResolver.getResource(PAGE_PATH);
		Page page = resource.adaptTo(Page.class);
		lenient().when(pageManager.getContainingPage(DUMMY_PATH)).thenReturn(page);

		when(akamaiFlushConfigReader.isEnabled()).thenReturn(true);
		try (MockedStatic<ReplicationAction> replicationActionMockedStatic = mockStatic(ReplicationAction.class)) {
			replicationActionMockedStatic.when(() -> ReplicationAction.fromEvent(any(Event.class)))
					.thenReturn(new ReplicationAction(ReplicationActionType.ACTIVATE, DUMMY_PATH));

			Event testEvent = initializeEvent();
			underTest.handleEvent(testEvent);
			verify(akamaiFlush, times(1)).invalidateAkamaiCache(DUMMY_PATH);
		}
	}

	private Event initializeEvent() {
		Map<String, Object> eventProperties = new HashMap<>();
		String[] agentIds = {"publish"};
		String[] paths = {"/content/dhl/us/es-us/category-page/article-page"};
		eventProperties.put("modificationDate", Calendar.getInstance());
		eventProperties.put("agentIds", agentIds);
		eventProperties.put("type", ReplicationActionType.ACTIVATE);
		eventProperties.put("paths", paths);
		eventProperties.put("userId", "admin");
		return new Event(ReplicationAction.EVENT_TOPIC, eventProperties);
	}
}
