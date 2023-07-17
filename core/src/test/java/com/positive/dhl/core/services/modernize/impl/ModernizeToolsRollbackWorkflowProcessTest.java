package com.positive.dhl.core.services.modernize.impl;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowData;
import com.adobe.granite.workflow.metadata.MetaDataMap;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMException;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ModernizeToolsRollbackWorkflowProcessTest {
    private final AemContext context = new AemContext(ResourceResolverType.JCR_OAK);
    private final ResourceResolver resourceResolver = context.resourceResolver();
    private final ModernizeToolsRollbackWorkflowProcess workflowProcess = new ModernizeToolsRollbackWorkflowProcess();

    @Mock
    private WorkflowSession workflowSession;

    @Mock
    private MetaDataMap metaDataMap;

    @Mock
    private WorkflowData workflowData;

    @Mock
    private WorkItem workItem;

    @Mock
    private ResourceResolver mockResourceResolver;

    @Mock
    private PageManager pageManager;

    @BeforeEach
    void setup() {
        when(workflowSession.adaptTo(ResourceResolver.class)).thenReturn(mockResourceResolver);
        when(workflowData.getPayload()).thenReturn("/content/article-migrated");
        when(workItem.getWorkflowData()).thenReturn(workflowData);

        context.load().json("/com/positive/dhl/core/services/modernize/impl/ModernizeToolsRollbackWorkflowProcessTest/content.json", "/content");
    }

    @Test
    void execute_ShouldRestorePages_WhenPagesContainsPreModernizeVersion() throws WorkflowException, WCMException {
        when(mockResourceResolver.findResources(anyString(), anyString()))
                .thenAnswer(invocation -> resourceResolver.findResources(invocation.getArgument(0, String.class), invocation.getArgument(1, String.class)));
        when(mockResourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(pageManager.getPage(anyString()))
                .thenAnswer(invocation -> resourceResolver.getResource(invocation.getArgument(0, String.class)).adaptTo(Page.class));

        workflowProcess.execute(workItem, workflowSession, metaDataMap);

        verify(pageManager, times(4)).restore(any(), any());
        verify(pageManager, times(1)).restore(eq("/content/article-migrated"), any());
        verify(pageManager, times(1)).restore(eq("/content/article-migrated/article-1-migrated"), any());
        verify(pageManager, times(1)).restore(eq("/content/article-migrated/article-1-migrated/article-1.1-migrated"), any());
        verify(pageManager, times(1)).restore(eq("/content/article-migrated/article-1-migrated/article-1.3-migrated"), any());
    }

    @Test
    void execute_ShouldThrowException_WhenResourceResolverIsNull() {
        when(workflowSession.adaptTo(ResourceResolver.class)).thenReturn(null);

        Exception exception = assertThrows(WorkflowException.class, () -> {
            workflowProcess.execute(workItem, workflowSession, metaDataMap);
        });

        assertEquals("Resource Resolver is null", exception.getMessage());
    }

    @Test
    void execute_ShouldThrowException_WhenPageManagerIsNull() {
        Exception exception = assertThrows(WorkflowException.class, () -> {
            workflowProcess.execute(workItem, workflowSession, metaDataMap);
        });

        assertEquals("Page Manager is null", exception.getMessage());
    }

    @Test
    void execute_ShouldThrowException_WhenRootPageIsNull() {
        when(mockResourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(workflowData.getPayload()).thenReturn("/content/null");

        Exception exception = assertThrows(WorkflowException.class, () -> {
            workflowProcess.execute(workItem, workflowSession, metaDataMap);
        });

        assertEquals("Root Page is null", exception.getMessage());
    }

    @Test
    void execute_ShouldThrowException_WhenNoTemplateForRollback() {
        when(mockResourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(workflowData.getPayload()).thenReturn("/content/article-migrated/article-1-migrated");
        when(pageManager.getPage(anyString()))
                .thenAnswer(invocation -> resourceResolver.getResource(invocation.getArgument(0, String.class)).adaptTo(Page.class));

        Exception exception = assertThrows(WorkflowException.class, () -> {
            workflowProcess.execute(workItem, workflowSession, metaDataMap);
        });

        assertEquals("There is no template for rollback", exception.getMessage());
    }

    @Test
    void execute_ShouldThrowException_WhenRestoreThrowException() throws WCMException {
        when(mockResourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(pageManager.restore(any(), any())).thenThrow(new WCMException(""));
        when(pageManager.getPage(anyString()))
                .thenAnswer(invocation -> resourceResolver.getResource(invocation.getArgument(0, String.class)).adaptTo(Page.class));

        Exception exception = assertThrows(WorkflowException.class, () -> {
            workflowProcess.execute(workItem, workflowSession, metaDataMap);
        });

        assertEquals("Failed to restore pages", exception.getMessage());
    }
}