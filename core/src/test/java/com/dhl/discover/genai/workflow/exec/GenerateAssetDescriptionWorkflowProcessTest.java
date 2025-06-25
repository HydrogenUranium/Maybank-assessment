package com.dhl.discover.genai.workflow.exec;

import com.day.cq.dam.api.Asset;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowData;
import com.day.cq.workflow.metadata.MetaDataMap;
import com.dhl.discover.core.services.AssetUtilService;
import com.dhl.discover.core.services.ResourceResolverHelper;
import com.dhl.discover.genai.service.AssetDescriptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.Node;
import javax.jcr.Session;

import static com.day.cq.dam.api.DamConstants.DC_DESCRIPTION;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GenerateAssetDescriptionWorkflowProcessTest {

    @Mock
    private AssetDescriptionService assetDescriptionService;

    @Mock
    private AssetUtilService assetUtilService;

    @Mock
    private ResourceResolverHelper resourceResolverHelper;

    @Mock
    private WorkflowSession workflowSession;

    @Mock
    private WorkItem workItem;

    @Mock
    private WorkflowData workflowData;

    @Mock
    private MetaDataMap metaDataMap;

    @Mock
    private Session session;

    @Mock
    private Node metadataNode;

    @Mock
    private Asset asset;

    @InjectMocks
    private GenerateAssetDescriptionWorkflowProcess workflowProcess;

    private static final String PAYLOAD_PATH = "/content/dam/image.jpg";
    private static final String GENERATED_DESCRIPTION = "Generated description";

    @BeforeEach
    void setUp() throws Exception {
        when(workItem.getWorkflowData()).thenReturn(workflowData);
        when(workflowData.getPayload()).thenReturn(PAYLOAD_PATH);
        when(workflowSession.getSession()).thenReturn(session);
        when(session.nodeExists(PAYLOAD_PATH + "/jcr:content/metadata")).thenReturn(true);
        when(session.getNode(PAYLOAD_PATH + "/jcr:content/metadata")).thenReturn(metadataNode);
        when(assetUtilService.getAsset(PAYLOAD_PATH, resourceResolverHelper.getReadResourceResolver())).thenReturn(asset);
        when(asset.getMimeType()).thenReturn("image/jpeg");
    }

    @Test
    void testExecuteWithValidPayload() throws Exception {
        when(metadataNode.hasProperty(DC_DESCRIPTION)).thenReturn(false);
        when(assetDescriptionService.generateDescription(asset)).thenReturn(GENERATED_DESCRIPTION);

        workflowProcess.execute(workItem, workflowSession, metaDataMap);

        verify(metadataNode).setProperty(DC_DESCRIPTION, GENERATED_DESCRIPTION);
        verify(metadataNode).setProperty(GenerateAssetDescriptionWorkflowProcess.DESCRIPTION_SOURCE, "AI");
        verify(session).save();
    }

    @Test
    void testExecuteWithExistingDescription() throws Exception {
        when(metadataNode.hasProperty(DC_DESCRIPTION)).thenReturn(true);

        workflowProcess.execute(workItem, workflowSession, metaDataMap);

        verify(metadataNode, never()).setProperty(anyString(), anyString());
        verify(session, never()).save();
    }
}