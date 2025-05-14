import groovy.transform.Field

@Field DRY_RUN = false;
@Field REPLICATE = false;
@Field LOGGING = true;

@Field ROOTS = [

        '/content/dhl/ae/en-ae',
        '/content/dhl/at/de-at',
        '/content/dhl/at/en-at',
        '/content/dhl/au/en-au',
        '/content/dhl/bd/en-bd',
        '/content/dhl/be/en-be',
        '/content/dhl/be/fr-be',
        '/content/dhl/be/nl-be',
        '/content/dhl/br/en-br',
        '/content/dhl/br/pt-br',
        '/content/dhl/ca/en-ca',
        '/content/dhl/ca/fr-ca',
        '/content/dhl/ch/de-ch',
        '/content/dhl/ch/en-ch',
        '/content/dhl/ch/fr-ch',
        '/content/dhl/ch/it-ch',
        '/content/dhl/cn/en-cn',
        '/content/dhl/cn/zh-cn',
        '/content/dhl/cz/cs-cz',
        '/content/dhl/cz/en-cz',
        '/content/dhl/es/en-es',
        '/content/dhl/es/es-es',
        '/content/dhl/fr/en-fr',
        '/content/dhl/fr/fr-fr',
        '/content/dhl/gb/en-gb',
        '/content/dhl/global/en-global',
        '/content/dhl/hk/en-hk',
        '/content/dhl/hk/zh-hk',
        '/content/dhl/hu/en-hu',
        '/content/dhl/hu/hu-hu',
        '/content/dhl/id/en-id',
        '/content/dhl/id/id-id',
        '/content/dhl/ie/en-ie',
        '/content/dhl/il/en-il',
        '/content/dhl/il/he-il',
        '/content/dhl/in/en-in',
        '/content/dhl/it/en-it',
        '/content/dhl/it/it-it',
        '/content/dhl/jp/en-jp',
        '/content/dhl/jp/ja-jp',
        '/content/dhl/ke/en-ke',
        '/content/dhl/kh/en-kh',
        '/content/dhl/kr/en-kr',
        '/content/dhl/kr/ko-kr',
        '/content/dhl/lk/en-lk',
        '/content/dhl/mm/en-mm',
        '/content/dhl/my/en-my',
        '/content/dhl/ng/en-ng',
        '/content/dhl/nz/en-nz',
        '/content/dhl/ph/en-ph',
        '/content/dhl/pk/en-pk',
        '/content/dhl/pt/en-pt',
        '/content/dhl/pt/pt-pt',
        '/content/dhl/se/en-se',
        '/content/dhl/se/sv-se',
        '/content/dhl/sg/en-sg',
        '/content/dhl/sk/en-sk',
        '/content/dhl/sk/sk-sk',
        '/content/dhl/th/en-th',
        '/content/dhl/th/th-th',
        '/content/dhl/tw/en-tw',
        '/content/dhl/tw/zh-tw',
        '/content/dhl/us/en-us',
        '/content/dhl/vn/en-vn',
        '/content/dhl/vn/vi-vn',
        '/content/dhl/za/en-za'
]

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
    def replicator = getService("com.day.cq.replication.Replicator")
    if(!REPLICATE) {
        return;
    }
    if(isPublished(pagePath)) {
        replicator.replicate(session, ReplicationActionType.ACTIVATE, pagePath)
        log "Publish $pagePath"
    } else {
        log "Page is not published $pagePath"
    }
}

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

def processPage(ROOTS) {
    for(path in ROOTS) {
        doAction(getPage(path))
    }
}

def doAction(page) {
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
            handlePublication(page.getPath())
        } else {
            session.save();
            log "Save Changes (+++)"
        }
    } else {
        log """Handler is not found for ${page.getPath()}""";
    }

    def iterator = page.listChildren();

    while(iterator.hasNext()) {
        doAction(iterator.next());
    }
}
processPage(ROOTS);

