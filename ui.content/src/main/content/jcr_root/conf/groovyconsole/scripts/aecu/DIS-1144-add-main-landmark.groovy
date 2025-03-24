import com.day.cq.commons.jcr.JcrUtil
import groovy.transform.Field

@Field OVERRIDE = true;
@Field DRY_RUN = false;
@Field REPLICATE = false;
@Field LOGGING = false;
@Field ROOT = "/content/dhl"

@Field MAIN_CONTAINER_RESOURCE_TYPE = "dhl/components/content/page-container";
@Field TARGET_PARENT = "root";
@Field TARGET_NAME = "main";

def log(string) {
    if(LOGGING) {
        println string
    }
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

def handlePublication(pagePath) {
    if(!REPLICATE) {
        return;
    }
    if(isPublished(pagePath)) {
        replicator.replicate(session, ReplicationActionType.ACTIVATE, it.getPath())
        log "Publish $it.getPath()"
    } else {
        log "Page is not published $it.getPath()"
    }
}

def copyChildNodes(page, source) {
    def contentNode = page.getContentResource().adaptTo(Node.class);
    if(!contentNode.hasNode(source)) {
        return;
    }
    def sourceNode = contentNode.getNode(source);
    def targetParentNode = contentNode.getNode(TARGET_PARENT);

    log "Page: ${contentNode.getParent().getPath()}"

    if(OVERRIDE && targetParentNode.hasNode(TARGET_NAME)) {
        targetParentNode.getNode(TARGET_NAME).remove();
    }

    if (!targetParentNode.hasNode(TARGET_NAME)) {
        def targetNode = JcrUtil.copy(sourceNode, targetParentNode, TARGET_NAME)
        targetNode.setProperty("sling:resourceType", "dhl/components/content/page-container")
        log "Node copied successfully from ${source} to ${TARGET_PARENT}/${TARGET_NAME}"
    } else {
        log "Target node already exists: ${TARGET_PARENT}/${TARGET_NAME}"
    }
}

def copyNodes(page, sourcePaths) {
    def contentNode = page.getContentResource().adaptTo(Node.class);

    def sourceNodes = sourcePaths.stream()
            .filter(source -> contentNode.hasNode(source))
            .map(source -> contentNode.getNode(source))
            .toList()

    if(sourceNodes.size() < 1) {
        log "No nodes to copy"
        return;
    }

    def targetParentNode = contentNode.getNode(TARGET_PARENT);

    log "Page: ${page.getPath()}"

    if(OVERRIDE && targetParentNode.hasNode(TARGET_NAME)) {
        targetParentNode.getNode(TARGET_NAME).remove();
    }

    if (!targetParentNode.hasNode(TARGET_NAME)) {
        def targetNode = targetParentNode.addNode(TARGET_NAME, "nt:unstructured");
        targetNode.setProperty("sling:resourceType", MAIN_CONTAINER_RESOURCE_TYPE);

        sourceNodes.each{
            JcrUtil.copy(it, targetNode, it.getName())
            log "Node copied successfully from ${it.getPath()} to ${TARGET_PARENT}/${TARGET_NAME}"
        }

    } else {
        log "Target node already exists: ${TARGET_PARENT}/${TARGET_NAME}"
    }
}

def processRightAlignedMarketoForm (page) {
    log "right alighn marketo form"
}

@Field HANDLERS = [
        '/conf/dhl/settings/wcm/templates/article': (page) -> copyNodes(page, ['root/article_header_container','root/article_container','root/article_container_two','root/article_footer_container','root/related_posts','root/responsivegrid']),
        '/conf/dhl/settings/wcm/templates/category-page': (page) -> copyNodes(page, ['root/breadcrumb-responsivegrid','root/responsivegrid','root/category_container']),
        '/conf/dhl/settings/wcm/templates/thank-you-page': (page) -> copyNodes(page, ['root/breadcrumb-responsivegrid','root/container']),
        '/conf/dhl/settings/wcm/templates/right-aligned-marketo-form': (page) -> copyNodes(page, ['root/breadcrumb','root/two_columns_container','root/responsivegrid']),
        '/conf/dhl/settings/wcm/templates/error-page': (page) -> copyChildNodes(page, 'root/responsivegrid'),
        '/conf/dhl/settings/wcm/templates/landing-page': (page) -> copyNodes(page, ['root/hero_banner','root/column_container']),
        '/conf/dhl/settings/wcm/templates/blank-page': (page) -> copyNodes(page, ['root/hero_banner','root/column_container']),
        '/conf/dhl/settings/wcm/templates/general-page': (page) -> copyNodes(page, ['root/hero_banner','root/column_container']),
        '/conf/dhl/settings/wcm/templates/register-page': (page) -> copyNodes(page, ['root/hero_banner','root/column_container']),
        '/conf/dhl/settings/wcm/templates/landing-page-two-columns': (page) -> copyNodes(page, ['root/hero_banner','root/top_container','root/column_container','root/bottom_container']),
        '/conf/dhl/settings/wcm/templates/search-result-page': (page) -> copyNodes(page, ['root/search']),
        '/conf/dhl/settings/wcm/templates/animated-page': (page) -> copyChildNodes(page, 'root/responsivegrid'),
];

def processPage(page) {
    if(page == null) {
        return;
    }

    def template = Optional.ofNullable(page.getTemplate()).map(t -> t.getPath()).orElse('');
    def handler = HANDLERS[template];
    if(handler != null) {
        handler(page);
        if(DRY_RUN) {
            session.refresh(false);
            log "Refresh Changes (---)"
        } else {
            session.save();
            log "Save Changes (+++)"
        }
    } else {
        log """Handler is not found for ${page.getPath()}""";
    }

    def iterator = page.listChildren();
    while(iterator.hasNext()) {
        processPage(iterator.next());
    }
}

processPage(pageManager.getPage(ROOT));

