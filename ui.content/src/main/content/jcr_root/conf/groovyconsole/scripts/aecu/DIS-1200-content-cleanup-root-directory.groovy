import groovy.transform.Field

@Field DRY_RUN = true;
@Field REPLICATE = false;
@Field LOGGING = true;
@Field ROOT = "/content/dhl"


def log(string) {
    if(LOGGING) {
        println string
    }
}

/*def getJcrContent(path) {
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
*/
def processSingleNode(page, source) {
    def contentNode = page.getContentResource().adaptTo(Node.class);

    if(!contentNode.hasNode(source)) {
        return;
    }
    def sourceNode = contentNode.getNode(source);
    processNode(sourceNode);
    log "Page: ${contentNode.getParent().getPath()}"
}

def processNodes(page, sourcePaths) {
    def contentNode = page.getContentResource().adaptTo(Node.class);

    def sourceNodes = sourcePaths.stream()
            .filter(source -> contentNode.hasNode(source))
            .map(source -> contentNode.getNode(source))
            .toList()

    if(sourceNodes.isEmpty()) {
        log "No nodes to remove"
        return;
    }
    sourceNodes.each(child -> {
        processNode(child);
    })
    log "Page: ${page.getPath()}"
}

def processNode(child) {
    def nodePath = child.getPath();
    if (session.nodeExists(nodePath)) {
        def node = session.getNode(nodePath)
        node.remove()
        log "Node removed: ${nodePath}"
    } else {
        log "Node does not exist: ${nodePath}"
    }
}


@Field HANDLERS = [
        '/conf/dhl/settings/wcm/templates/article': (page) -> processNodes(page, ['root/article_container','root/article_container_two','root/article_footer_container','root/related_posts','root/responsivegrid']),
        '/conf/dhl/settings/wcm/templates/category-page': (page) -> processNodes(page, ['root/breadcrumb-responsivegrid','root/responsivegrid','root/category_container']),
        '/conf/dhl/settings/wcm/templates/thank-you-page': (page) -> processNodes(page, ['root/breadcrumb-responsivegrid','root/container']),
        '/conf/dhl/settings/wcm/templates/right-aligned-marketo-form': (page) -> processNodes(page, ['root/breadcrumb','root/two_columns_container','root/responsivegrid']),
        '/conf/dhl/settings/wcm/templates/error-page': (page) -> processSingleNode(page, 'root/responsivegrid'),
        '/conf/dhl/settings/wcm/templates/landing-page': (page) -> processNodes(page, ['root/hero_banner','root/column_container']),
        '/conf/dhl/settings/wcm/templates/blank-page': (page) -> processNodes(page, ['root/hero_banner','root/column_container']),
        '/conf/dhl/settings/wcm/templates/general-page': (page) -> processNodes(page, ['root/hero_banner','root/column_container']),
        '/conf/dhl/settings/wcm/templates/register-page': (page) -> processNodes(page, ['root/hero_banner','root/column_container']),
        '/conf/dhl/settings/wcm/templates/landing-page-two-columns': (page) -> processNodes(page, ['root/hero_banner','root/top_container','root/column_container','root/bottom_container']),
        '/conf/dhl/settings/wcm/templates/search-result-page': (page) -> processNodes(page, ['root/search']),
        '/conf/dhl/settings/wcm/templates/animated-page': (page) -> processSingleNode(page, 'root/responsivegrid'),
        '/conf/dhl/settings/wcm/templates/home-page': (page) -> processNodes(page, ['root/responsivegrid','root/container']),
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
