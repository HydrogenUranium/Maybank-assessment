import groovy.transform.Field

@Field def DRY_RUN = true

def getHomePages() {
    def homePagesQuery = """
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('/content/dhl')
        AND node.[sling:resourceType] = 'dhl/components/pages/editable-home-page'
    """
    return sql2Query(homePagesQuery)
}
getHomePages().each{
    sql2Query("""
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('${it.getParent().getPath()}')
        AND node.[sling:resourceType] = 'dhl/components/content/hero-banner'
    """).each{
        //println it.getPath()
        it.remove()
    }
}

if(DRY_RUN) {
    session.refresh(false);
} else {
    session.save();
}