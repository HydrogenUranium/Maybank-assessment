boolean DRY_RUN = true

def GET_HOME_PAGE_LIVE_COPY_SYNC_CONFIGS = """
        SELECT liveCopySyncConfig.* FROM [cq:LiveCopy] AS liveCopySyncConfig 
        INNER JOIN [nt:base] AS pageContent ON ISCHILDNODE(liveCopySyncConfig, pageContent) 
        WHERE (ISDESCENDANTNODE(pageContent, '/content/dhl') AND NAME(pageContent) = 'jcr:content') 
        AND (pageContent.[sling:resourceType]='dhl/components/pages/home' OR pageContent.[sling:resourceType]='dhl/components/pages/editable-home-page')
""" as Object

def MULTIFIELD_NODES = [
        "jcr:content/header-companyLinks",
        "jcr:content/ctaBanner-subscribeToOurNewsletter-points",
        "jcr:content/ctaBanner-openBusinessAccount-points",
        "jcr:content/footer-companyLinks",
        "jcr:content/footer-socialLinks",
]

aecu.contentUpgradeBuilder()
        .forResourcesBySql2Query(GET_HOME_PAGE_LIVE_COPY_SYNC_CONFIGS)
        .printPath()
        .doAddValuesToMultiValueProperty("cq:excludedPaths", (String[])MULTIFIELD_NODES)
        .run(DRY_RUN)