import com.day.cq.commons.jcr.JcrUtil
import groovy.transform.Field

@Field OVERRIDE = true;
@Field DRY_RUN = false;
@Field REPLICATE = true;
@Field SOURCE = "root/responsivegrid";
@Field TARGET_PARENT = "root";
@Field TARGET_NAME = "container";

def getHomePages() {
    def homePagesQuery = """
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('/content/dhl/global')
        AND node.[sling:resourceType] = 'dhl/components/pages/editable-home-page'
    """

    return sql2Query(homePagesQuery)
}

def getJcrContent(path) {
    return pageManager.getContainingPage(path).getContentResource();
}

def isPublished(path) {
    def resource = getJcrContent(path)
    def valueMap = resource.getValueMap()
    def status = valueMap.get('cq:lastReplicationAction_publish', valueMap.get('cq:lastReplicationAction', ''))
    return status.equals('Activate')
}

def handlePublication(replicator, pagePath) {
    if(!REPLICATE) {
        return;
    }
    if(isPublished(pagePath)) {
        replicator.replicate(session, ReplicationActionType.ACTIVATE, pagePath)
        println "Publish $pagePath"
    } else {
        println "Page is not published $pagePath"
    }
}

def process(node) {
    def sourceNode = node.getNode(SOURCE);
    def targetParentNode = node.getNode(TARGET_PARENT);

    println "Page: ${node.getParent().getPath()}"

    if (OVERRIDE || !targetParentNode.hasNode(TARGET_NAME)) {
        def targetNode = JcrUtil.copy(sourceNode, targetParentNode, TARGET_NAME)
        targetNode.setProperty("sling:resourceType", "dhl/components/content/page-container")
        println "Node copied successfully from ${SOURCE} to ${TARGET_PARENT}/${TARGET_NAME}"
    } else {
        println "Target node already exists: ${TARGET_PARENT}/${TARGET_NAME}"
    }
}

def homePages = getHomePages();
def replicator = getService("com.day.cq.replication.Replicator");
homePages.each {
    println ""
    process(it);

    if(DRY_RUN) {
        session.refresh(false);
        println "Refresh Changes (---)"
    } else {
        session.save();
        handlePublication(replicator, it.getPath())
        println "Save Changes (+++)"
    }
}
