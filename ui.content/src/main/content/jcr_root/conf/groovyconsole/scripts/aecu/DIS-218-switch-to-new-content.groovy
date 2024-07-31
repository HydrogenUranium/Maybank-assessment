boolean DRY_RUN = true

boolean ENABLE_NEW_CONTENT_AND_DISABLE_OLD_ONE = true
boolean ENABLE_OLD_CONTENT_AND_DISABLE_NEW_ONE = !ENABLE_NEW_CONTENT_AND_DISABLE_OLD_ONE

def NEW_CONTENT_BRANCHES = [
        "/content/dhl/language-masters",
        "/content/dhl/global",
        "/content/dhl/au",
        "/content/dhl/nz",
        "/content/dhl/us",
        "/content/dhl/it",
        "/content/dhl/th",
        "/content/dhl/in",
        "/content/dhl/sg",
        "/content/dhl/hk",
        "/content/dhl/tw",
        "/content/dhl/my",
        "/content/dhl/id",
        "/content/dhl/be",
        "/content/dhl/fr",
        "/content/dhl/ie",
        "/content/dhl/il",
        "/content/dhl/kr",
        "/content/dhl/gb",
        "/content/dhl/ph",
]

def disablePage = {
    page ->
        pagePath = page.path
        println ">> DISABLE: " + pagePath

        aecu.contentUpgradeBuilder()
                .forResources(pagePath)
                .doDeactivateContainingPage()
                .run(DRY_RUN)

        aecu.contentUpgradeBuilder()
                .forChildResourcesOf(pagePath)
                .filterByNodeName("jcr:content")
                .doSetProperty("hideInNav", "true")
                .doSetProperty("noIndexRobotsTagsInherit", true)
                .doDeleteProperty("cq:robotsTags")
                .doAddValuesToMultiValueProperty("cq:robotsTags", (String[])["noindex"])
                .run(DRY_RUN)
}

def disableContent(contentFilter, disablePage, dryRun) {
    aecu.contentUpgradeBuilder()
            .forChildResourcesOf("/content/dhl")
            .filterByProperty("jcr:primaryType", "cq:Page")
            .filterWith(new NOTFilter(contentFilter))
            .doCustomResourceBasedAction(disablePage)
            .run(dryRun)
}

def enablePage = {
    page ->
        pagePath = page.path
        println ">> ENABLE: " + pagePath

        aecu.contentUpgradeBuilder()
                .forChildResourcesOf(pagePath)
                .filterByNodeName("jcr:content")
                .doDeleteProperty("hideInNav")
                .doDeleteProperty("noIndexRobotsTagsInherit")
                .doDeleteProperty("cq:robotsTags")
                .run(DRY_RUN)

        if (ENABLE_NEW_CONTENT_AND_DISABLE_OLD_ONE) {
            aecu.contentUpgradeBuilder()
                    .forChildResourcesOf(pagePath)
                    .filterByNodeName("jcr:content")
                    .doAddValuesToMultiValueProperty("cq:robotsTags", (String[])["noindex"])
                    .run(DRY_RUN)
        }

        aecu.contentUpgradeBuilder()
                .forResources(pagePath)
                .doTreeActivateContainingPage()
                .run(DRY_RUN)
}

def enableContent(contentFilter, enablePage, dryRun) {
    aecu.contentUpgradeBuilder()
            .forChildResourcesOf("/content/dhl")
            .filterByProperty("jcr:primaryType", "cq:Page")
            .filterWith(contentFilter)
            .doCustomResourceBasedAction(enablePage)
            .run(dryRun)
}

def contentFilter = ENABLE_NEW_CONTENT_AND_DISABLE_OLD_ONE ? new FilterByNodeRootPaths(NEW_CONTENT_BRANCHES) : new NOTFilter(new FilterByNodeRootPaths(NEW_CONTENT_BRANCHES))

disableContent(contentFilter, disablePage, DRY_RUN)
enableContent(contentFilter, enablePage, DRY_RUN)

