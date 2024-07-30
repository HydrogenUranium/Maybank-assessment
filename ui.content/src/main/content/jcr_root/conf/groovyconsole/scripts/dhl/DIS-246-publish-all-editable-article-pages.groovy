boolean DRY_RUN = true

def NEW_CONTENT_BRANCHES = [
        "/content/dhl/language-masters",
        "/content/dhl/global",
        "/content/dhl/au",
        "/content/dhl/hk",
        "/content/dhl/in",
        "/content/dhl/id",
        "/content/dhl/my",
        "/content/dhl/nz",
        "/content/dhl/ph",
        "/content/dhl/sg",
        "/content/dhl/us",
]

def RESOURCE_TYPE = "dhl/components/pages/editable-article"


NEW_CONTENT_BRANCHES.each{
    aecu.contentUpgradeBuilder()
            .forResourcesBySql2Query("""SELECT page.* FROM [cq:Page] AS page 
                INNER JOIN [cq:PageContent] AS jcrcontent 
                ON ISCHILDNODE(jcrcontent, page)
                WHERE ISDESCENDANTNODE(page, '$it') 
                AND jcrcontent.[sling:resourceType] = '$RESOURCE_TYPE' """)
            .doActivateResource()
            .run(DRY_RUN)
}
