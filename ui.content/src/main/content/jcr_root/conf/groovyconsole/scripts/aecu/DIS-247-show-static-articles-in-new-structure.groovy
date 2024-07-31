def RESOURCE_TYPE = "dhl/components/pages/article"

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

NEW_CONTENT_BRANCHES.each{
    printf(it)

    def query = session.getWorkspace().getQueryManager()
            .createQuery("""SELECT page.* FROM [cq:Page] AS page 
            INNER JOIN [cq:PageContent] AS jcrcontent 
            ON ISCHILDNODE(jcrcontent, page)
            WHERE ISDESCENDANTNODE(page, '$it') 
            AND jcrcontent.[sling:resourceType] = '$RESOURCE_TYPE' """, 'JCR-SQL2')

    query.setLimit(10)

    def nodes = query
            .execute()
            .getNodes().collect{it.getPath()}

    println(nodes.size ? " list: $nodes" : " empty")
    println()
}