def DRY_RUN = false

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
    def variation = createVariation(fragment.getPath(), "master", "Adaptive Banner With Points")
    def banner = addComponent(variation, "cta-banner-with-points", properties);
    copyMultifield(page, "/jcr:content/multifields/ctaBanner-subscribeToOurNewsletter-points", banner, "/points")
    def variationSidebar = createVariation(fragment.getPath(), "sidebar-banner-with-points", "Sidebar Banner With Points", ["isSidebarLayout": true])
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
    def variationSidebar = createVariation(fragment.getPath(), "sidebar-banner", "Sidebar Banner", ["isSidebarLayout": true])
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
    def variation = createVariation(fragment.getPath(), "master", "Adaptive Gray Banner")
    addComponent(variation, "cta-banner-gray", properties);
    def variationSidebar = createVariation(fragment.getPath(), "sidebar-banner", "Sidebar Gray Banner", ["isSidebarLayout": true])
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
    def variation = createVariation(fragment.getPath(), "adaptive-banner", "Adaptive Banner")
    addComponent(variation, "cta-banner", properties);
    def variationSidebar = createVariation(fragment.getPath(), "sidebar-banner", "Sidebar Banner", ["isSidebarLayout": true])
    addComponent(variationSidebar, "cta-banner", properties);
}

def addHeader(page, xfNode) {
    def fragment = createFragment(xfNode.getPath(), "header", "Header")
    def header = createVariation(fragment.getPath(), "master", "Header")
    def valueMap = page.getProperties();
    def headerComponent = addComponent(header, "header", [
            "sling:resourceType": "dhl/components/content/header",
            "buttonLink":valueMap.get("header-buttonLink", ""),
            "buttonName":valueMap.get("header-buttonName", ""),
            "categoryLinksLabel":valueMap.get("header-categoryLinksLabel", ""),
            "companyLinksLabel":valueMap.get("header-companyLinksLabel", ""),
            "countryFilterInputAriaLabel":valueMap.get("header-countryFilterInputAriaLabel", ""),
            "countrySelector-searchPlaceholder":valueMap.get("header-countrySelector-searchPlaceholder", ""),
            "countrySelector-title":valueMap.get("header-countrySelector-title", ""),
            "countrySelectorToggleAriaLabel":valueMap.get("header-countrySelectorToggleAriaLabel", ""),
            "homePageLabel":valueMap.get("header-homePageLabel", ""),
            "lessLinkLabel":valueMap.get("header-lessLinkLabel", ""),
            "moreLinkLabel":valueMap.get("header-moreLinkLabel", ""),
            "signInLabel":valueMap.get("header-signInLabel", ""),
            "switchLanguageAriaLabel":valueMap.get("header-switchLanguageAriaLabel", ""),
    ]);
    copyMultifield(page, "/jcr:content/multifields/header-companyLinks", headerComponent, "/companyLinks")

    def searchBar = addComponent(headerComponent, "search-bar", [
            "sling:resourceType": "dhl/components/content/search-bar",
            "articlesTitle": valueMap.get("searchBar-articlesTitle", ""),
            "closeAriaLabel": valueMap.get("searchBar-closeAriaLabel", ""),
            "openAriaLabel": valueMap.get("searchBar-openAriaLabel", ""),
            "recentSearchesTitle": valueMap.get("searchBar-recentSearchesTitle", ""),
            "searchButtonAriaLabel": valueMap.get("searchBar-searchButtonAriaLabel", ""),
            "searchInputAriaLabel": valueMap.get("searchBar-searchInputAriaLabel", ""),
            "showThumbnail": valueMap.get("searchBar-showThumbnail", false),
            "trendingTopicsTitle": valueMap.get("searchBar-trendingTopicsTitle", ""),
    ])

    def responsiveGrid = addComponent(headerComponent, "responsivegrid", [
            "sling:resourceType": "wcm/foundation/components/responsivegrid",
    ])
    def experienceFragment = addComponent(responsiveGrid, "experiencefragment", [
            "sling:resourceType": "dhl/components/content/experiencefragment",
            "fragmentVariationPath": """${xfNode.getParent().getPath()}/banners/newsletter-subscription/sidebar-banner-with-points""",
    ])

    def headerWithoutNavigation = createVariation(fragment.getPath(), "header-without-navigation", "Header Without Navigation")
    def headerComponent2 = addComponent(headerWithoutNavigation, "header", [
            "sling:resourceType": "dhl/components/content/header",
            "buttonLink":valueMap.get("header-buttonLink", ""),
            "buttonName":valueMap.get("header-buttonName", ""),
            "categoryLinksLabel":valueMap.get("header-categoryLinksLabel", ""),
            "companyLinksLabel":valueMap.get("header-companyLinksLabel", ""),
            "countryFilterInputAriaLabel":valueMap.get("header-countryFilterInputAriaLabel", ""),
            "countrySelector-searchPlaceholder":valueMap.get("header-countrySelector-searchPlaceholder", ""),
            "countrySelector-title":valueMap.get("header-countrySelector-title", ""),
            "countrySelectorToggleAriaLabel":valueMap.get("header-countrySelectorToggleAriaLabel", ""),
            "homePageLabel":valueMap.get("header-homePageLabel", ""),
            "lessLinkLabel":valueMap.get("header-lessLinkLabel", ""),
            "moreLinkLabel":valueMap.get("header-moreLinkLabel", ""),
            "signInLabel":valueMap.get("header-signInLabel", ""),
            "switchLanguageAriaLabel":valueMap.get("header-switchLanguageAriaLabel", ""),
            "hideNavigationMenu": "true"
    ]);
    copyMultifield(page, "/jcr:content/multifields/header-companyLinks", headerComponent2, "/companyLinks")

    def searchBar2 = addComponent(headerComponent2, "search-bar", [
            "sling:resourceType": "dhl/components/content/search-bar",
            "articlesTitle": valueMap.get("searchBar-articlesTitle", ""),
            "closeAriaLabel": valueMap.get("searchBar-closeAriaLabel", ""),
            "openAriaLabel": valueMap.get("searchBar-openAriaLabel", ""),
            "recentSearchesTitle": valueMap.get("searchBar-recentSearchesTitle", ""),
            "searchButtonAriaLabel": valueMap.get("searchBar-searchButtonAriaLabel", ""),
            "searchInputAriaLabel": valueMap.get("searchBar-searchInputAriaLabel", ""),
            "searchResultPage": valueMap.get("searchBar-searchResultPage", ""),
            "showThumbnail": valueMap.get("searchBar-showThumbnail", false),
            "trendingTopics": valueMap.get("searchBar-trendingTopics", ""),
            "trendingTopicsTitle": valueMap.get("searchBar-trendingTopicsTitle", ""),
    ])
    def responsiveGrid2 = addComponent(headerComponent2, "responsivegrid", [
            "sling:resourceType": "wcm/foundation/components/responsivegrid",
    ])
    def experienceFragment2 = addComponent(responsiveGrid2, "experiencefragment",[
            "sling:resourceType": "dhl/components/content/experiencefragment",
            "fragmentVariationPath": """${xfNode.getParent().getPath()}/banners/newsletter-subscription/sidebar-banner-with-points""",
    ])
}

def addFooter(page, xfNode) {
    def fragment = createFragment(xfNode.getPath(), "footer", "Footer")
    def footer = createVariation(fragment.getPath(), "master", "Footer")
    def valueMap = page.getProperties();
    def footerComponent = addComponent(footer, "footer", [
            "sling:resourceType": "dhl/components/content/footer",
            "categoryLinksLabel": valueMap.get("footer-categoryLinksLabel", ""),
            "companyLinksLabel": valueMap.get("footer-companyLinksLabel", ""),
            "invitationText": valueMap.get("footer-invitation-text", ""),
            "invitationTitle": valueMap.get("footer-invitation-title", ""),
            "logoAltText": valueMap.get("footer-logoAltText", ""),
            "logoIcon": valueMap.get("footer-logoIcon", ""),
            "logoLink": valueMap.get("footer-logoLink", ""),
            "logoTitle": valueMap.get("footer-logoTitle", ""),
            "promoText": valueMap.get("footer-promo-text", ""),
            "socialLinksLabel": valueMap.get("footer-socialLinksLabel", ""),
    ]);
    copyMultifield(page, "/jcr:content/multifields/footer-companyLinks", footerComponent, "/companyLinks")
    copyMultifield(page, "/jcr:content/multifields/footer-socialLinks", footerComponent, "/socialLinks")
}

def addArticleTemplateFragments(page, xfNode) {
    xfNodeArticle = addNode(xfNode, "Article", "sling:OrderedFolder")
    def fragment = createFragment(xfNodeArticle.getPath(), "sidebar", "Sidebar")
    def sidebar = createVariation(fragment.getPath(), "master", "Sidebar", ["isSidebarLayout": true])
    def experienceFragment = addComponent(sidebar, "experiencefragment", [
            "sling:resourceType": "dhl/components/content/experiencefragment",
            "fragmentVariationPath": """${xfNode.getParent().getPath()}/banners/open-business-account/sidebar-banner"""
    ]);

    def fragment2 = createFragment(xfNodeArticle.getPath(), "bottom", "Bottom CTA")
    def bottom = createVariation(fragment2.getPath(), "master", "Bottom CTA")
    def experienceFragment2 = addComponent(bottom, "experiencefragment", [
            "sling:resourceType": "dhl/components/content/experiencefragment",
            "fragmentVariationPath": """${xfNode.getParent().getPath()}/banners/newsletter-subscription/adaptive-banner"""
    ]);
}

def addCategoryTemplateFragments(page, xfNode) {
    xfNodeArticle = addNode(xfNode, "Category", "sling:OrderedFolder")

    def fragment = createFragment(xfNodeArticle.getPath(), "bottom", "Bottom CTA")
    def bottom = createVariation(fragment.getPath(), "master", "Bottom CTA")
    def experienceFragment2 = addComponent(bottom, "experiencefragment", [
            "sling:resourceType": "dhl/components/content/experiencefragment",
            "fragmentVariationPath": """${xfNode.getParent().getPath()}/banners/newsletter-subscription/master"""
    ]);
}

def addComponent(page, name, properties) {
    def root = getNode(page.getPath());
    if(root.isNodeType("cq:Page")) {
        root = getNode(root.getPath() + "/jcr:content/root");
    }

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
        if(!rootPath.startsWith("/content/experience-fragments/dhl/language-masters")) {
            addLiveRelationship(page.getContentResource().adaptTo(Node.class));
        }
    }
    return page;
}

def createVariation(rootPath, name, title, properties = []) {
    def templatePath = "/conf/dhl/settings/wcm/templates/experience-fragment-web-variation-template"
    def page = getPage(rootPath + "/" + name);
    if(page == null) {
        page = pageManager.create(rootPath, name, templatePath, title, true)
        contentResource = page.getContentResource().adaptTo(Node.class);
        addMixinVersionable(page.getContentResource().adaptTo(Node.class))
        if(name.equals("master")) {
            contentResource.setProperty("cq:xfMasterVariation", true);
        }
        if(!rootPath.startsWith("/content/experience-fragments/dhl/language-masters")) {
            addLiveRelationship(page.getContentResource().adaptTo(Node.class));
        }

        if(!properties.isEmpty()) {
            properties.each((key, value) -> {
                contentResource.setProperty(key, value);
            })
        }
    }
    return page;
}

def addNode(node, name, type) {
    lowerCaseName = name.toLowerCase().replaceAll(" ", "-")

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
    bannersRoot = addNode(fragmentsRoot, "Banners", "sling:OrderedFolder")
    templateFragmentsRoot = addNode(fragmentsRoot, "Template Fragments", "sling:OrderedFolder")
    templateFragmentsRoot.setProperty("jcr:title", "🛠️ Template Fragments")
    processSubscribeToOurNewsletter(page, bannersRoot);
    processOpenBusinessAccount(page, bannersRoot);
    processIndividualShipper(page, bannersRoot);
    processSubscribeFromArticle(page, bannersRoot);
    addHeader(page, templateFragmentsRoot);
    addFooter(page, templateFragmentsRoot);
    addArticleTemplateFragments(page, templateFragmentsRoot);
    addCategoryTemplateFragments(page, templateFragmentsRoot);

    save();
}

getHomePages().each{
    def page = getPage(it.getPath().replaceAll("/jcr:content", ""));
    process(page)
}
