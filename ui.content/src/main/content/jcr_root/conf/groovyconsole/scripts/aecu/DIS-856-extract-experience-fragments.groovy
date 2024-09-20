def DRY_RUN = true

def getHomePages() {
    def homePagesQuery = """
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('/content/dhl')
        AND node.[sling:resourceType] = 'dhl/components/pages/editable-home-page'
    """
    
    return sql2Query(homePagesQuery)
}

def processSubscribeToOurNewsletter(page, xfNode) {
    def valueMap = page.getProperties();
    def properties = [
        "sling:resourceType": "dhl/components/content/cta-banner-with-points",
        "title": valueMap.get("ctaBanner-subscribeToOurNewsletter-title", ""),
        "mobileBackgroundImage": valueMap.get("ctaBanner-subscribeToOurNewsletter-mobileBackgroundImage", ""),
        "tabletBackgroundImage": valueMap.get("ctaBanner-subscribeToOurNewsletter-tabletBackgroundImage", ""),
        "desktopBackgroundImage": valueMap.get("ctaBanner-subscribeToOurNewsletter-desktopBackgroundImage", ""),
        "buttonName": valueMap.get("ctaBanner-subscribeToOurNewsletter-buttonName", ""),
        "buttonLink": valueMap.get("ctaBanner-subscribeToOurNewsletter-buttonLink", ""),
    ];
    
    def fragment = createFragment(xfNode.getPath(), "newsletter-subscription", "Newsletter Subscription")
    def variation = createVariation(fragment.getPath(), "master", "Adaptive Banner")
    def banner = addComponent(variation, "cta-banner-with-points", properties);
     copyMultifield(page, "/jcr:content/multifields/ctaBanner-subscribeToOurNewsletter-points", banner, "/points")
    def variationSidebar = createVariation(fragment.getPath(), "sidebar-banner", "Sidebar Banner")
    def sidebarBanner = addComponent(variationSidebar, "cta-banner-with-points", properties);
     copyMultifield(page, "/jcr:content/multifields/ctaBanner-subscribeToOurNewsletter-points", sidebarBanner, "/points")
}

def copyMultifield(page, relativePath, componentNode, destinationRelativePath) {
    def sourcePath = page.getPath() + relativePath;
    def destinationPath = componentNode.getPath() + destinationRelativePath;
    if(getResource(sourcePath) == null || getResource(destinationPath) != null) {
        return;
    }
    save()
    session.workspace.copy(sourcePath, destinationPath)
}

def processOpenBusinessAccount(page, xfNode) {
    def valueMap = page.getProperties();
    def properties = [
        "sling:resourceType": "dhl/components/content/cta-banner-with-points",
        "title": valueMap.get("ctaBanner-openBusinessAccount-title", ""),
        "mobileBackgroundImage": valueMap.get("ctaBanner-openBusinessAccount-mobileBackgroundImage", ""),
        "tabletBackgroundImage": valueMap.get("ctaBanner-openBusinessAccount-tabletBackgroundImage", ""),
        "desktopBackgroundImage": valueMap.get("ctaBanner-openBusinessAccount-desktopBackgroundImage", ""),
        "buttonName": valueMap.get("ctaBanner-openBusinessAccount-buttonName", ""),
        "buttonLink": valueMap.get("ctaBanner-openBusinessAccount-buttonLink", ""),
    ];
    
    def fragment = createFragment(xfNode.getPath(), "open-business-account", "Open a Business Account")
    def variation = createVariation(fragment.getPath(), "master", "Adaptive Banner")
    def banner = addComponent(variation, "cta-banner-with-points", properties);
     copyMultifield(page, "/jcr:content/multifields/ctaBanner-openBusinessAccount-points", banner, "/points")
    def variationSidebar = createVariation(fragment.getPath(), "sidebar-banner", "Sidebar Banner")
    def sidebarBanner = addComponent(variationSidebar, "cta-banner-with-points", properties);
     copyMultifield(page, "/jcr:content/multifields/ctaBanner-openBusinessAccount-points", sidebarBanner, "/points")
}

def processIndividualShipper(page, xfNode) {
    def valueMap = page.getProperties();
    def properties = [
        "sling:resourceType": "dhl/components/content/cta-banner-gray",
        "title": valueMap.get("ctaBannerGray-individualShipper-title", ""),
        "description": valueMap.get("ctaBannerGray-individualShipper-description", "test"),
        "buttonLink": valueMap.get("ctaBannerGray-individualShipper-buttonLink", ""),
        "buttonLabel": valueMap.get("ctaBannerGray-individualShipper-buttonLabel", "test"),
        "linkTarget": valueMap.get("ctaBannerGray-individualShipper-linkTarget", ""),
    ];
    
    def fragment = createFragment(xfNode.getPath(), "individual-shipper", "Individual Shipper")
    def variation = createVariation(fragment.getPath(), "master", "Adaptive Banner")
     addComponent(variation, "cta-banner-gray", properties);
    def variationSidebar = createVariation(fragment.getPath(), "sidebar-banner", "Sidebar Banner")
     addComponent(variationSidebar, "cta-banner-gray", properties);
}

def processSubscribeFromArticle(page, xfNode) {
    def valueMap = page.getProperties();
    def properties = [
        "sling:resourceType": "dhl/components/content/cta-banner",
        "title": valueMap.get("ctaBanner-article-subscribeToOurNewsletter-title", ""),
        "topTitle": valueMap.get("ctaBanner-article-subscribeToOurNewsletter-topTitle", ""),
        "mobileBackgroundImage": valueMap.get("ctaBanner-article-subscribeToOurNewsletter-mobileBackgroundImage", ""),
        "tabletBackgroundImage": valueMap.get("ctaBanner-article-subscribeToOurNewsletter-tabletBackgroundImage", ""),
        "desktopBackgroundImage": valueMap.get("ctaBanner-article-subscribeToOurNewsletter-desktopBackgroundImage", ""),
        "buttonName": valueMap.get("ctaBanner-article-subscribeToOurNewsletter-buttonName", ""),
        "buttonLink": valueMap.get("ctaBanner-article-subscribeToOurNewsletter-buttonLink", ""),
    ];
    
    def fragment = createFragment(xfNode.getPath(), "newsletter-subscription", "Newsletter Subscription")
    def variation = createVariation(fragment.getPath(), "adaptive-banner-v2", "Adaptive Banner v2 (Banner on Article Page)")
    addComponent(variation, "cta-banner", properties);
    def variationSidebar = createVariation(fragment.getPath(), "sidebar-banner-v2", "Sidebar Banner v2 (Banner on Article Page)")
    addComponent(variationSidebar, "cta-banner", properties);
}

def addComponent(page, name, properties) {
    def root = getNode(page.getPath() + "/jcr:content/root");
    if(root.hasNode(name)) {
        return root.getNode(name);
    }
    def node = root.addNode(name);
    properties.each {
        node.setProperty(it.key, it.value);
    }
    return node;
}

def createFragment(rootPath, name, title) {
    def templatePath = "/libs/cq/experience-fragments/components/experiencefragment/template"
    def page = getPage(rootPath + "/" + name);
    if(page == null) {
        page = pageManager.create(rootPath, name, templatePath, title, true)
        addMixinVersionable(page.getContentResource().adaptTo(Node.class))
        if(!rootPath.startsWith("/content/experience/gragments/dhl/language-masters")) {
            addLiveRelationship(page.getContentResource().adaptTo(Node.class));
        }
    }
    return page;
}

def createVariation(rootPath, name, title) {
    def templatePath = "/conf/dhl/settings/wcm/templates/experience-fragment-web-variation-template"
    def page = getPage(rootPath + "/" + name);
    if(page == null) {
        page = pageManager.create(rootPath, name, templatePath, title, true)
        addMixinVersionable(page.getContentResource().adaptTo(Node.class))
        if(name.equals("master")) {
            page.getContentResource().adaptTo(Node.class).setProperty("cq:xfMasterVariation", true);
        }
        if(!rootPath.startsWith("/content/experience/gragments/dhl/language-masters")) {
            addLiveRelationship(page.getContentResource().adaptTo(Node.class));
        }
    }
    return page;
}

def addNode(node, name, type) {
    lowerCaseName = name.toLowerCase()
    
    if(node.hasNode(lowerCaseName)) {
        node = node.getNode(lowerCaseName);
    } else {
        node = node.addNode(lowerCaseName, type);
    }
    node.setProperty("jcr:title", name)
    
    return node;
}

def addMixinVersionable(Node node) {
    if(node.canAddMixin("mix:versionable")) {
        node.addMixin("mix:versionable");
    }
}

def addLiveRelationship(Node node) {
    if(node.canAddMixin("cq:LiveRelationship")) {
        node.addMixin("cq:LiveRelationship");
    }
}

def initXfStructure(page) {
    def pathNodes = page.getPath().replaceFirst("/content", "").split("/");
    def rootNode = getNode("/content/experience-fragments");
    
    pathNodes.each {
        rootNode = addNode(rootNode, it, "sling:OrderedFolder");
    }
    
    def contentNode = page.getContentResource().adaptTo(Node.class)
    
    if(contentNode.hasNode("cq:LiveSyncConfig") && (!rootNode.hasNode("jcr:content") || !rootNode.getNode("jcr:content").hasNode("cq:LiveSyncConfig"))) {
        def pageLiveSync = contentNode.getNode("cq:LiveSyncConfig");
        def jcrContent = rootNode.hasNode("jcr:content") ? rootNode.getNode("jcr:content") : rootNode.addNode("jcr:content", "nt:unstructured");
        addLiveRelationship(jcrContent)
        def liveSync = jcrContent.addNode("cq:LiveSyncConfig", "cq:LiveCopy");
        if(pageLiveSync.hasProperty("cq:master")) {
            liveSync.setProperty("cq:master", pageLiveSync.getProperty("cq:master").getString().replaceFirst("/content", "/content/experience-fragments"))
            liveSync.setProperty("cq:rolloutConfigs", ["/libs/msm/wcm/rolloutconfigs/default"] as String[])
            liveSync.setProperty("cq:isDeep", "true")
        }
    }
    
    return rootNode;
}

def process(page) {
    println(page.getPath())
    
    def fragmentsRoot = initXfStructure(page);
    fragmentsRoot = addNode(fragmentsRoot, "Banners", "sling:OrderedFolder")
    processSubscribeToOurNewsletter(page, fragmentsRoot);
    processOpenBusinessAccount(page, fragmentsRoot);
    processIndividualShipper(page, fragmentsRoot);
    processSubscribeFromArticle(page, fragmentsRoot);
    save();
}

getHomePages().each{
    def page = getPage(it.getPath().replaceAll("/jcr:content", ""));
    process(page)
}

