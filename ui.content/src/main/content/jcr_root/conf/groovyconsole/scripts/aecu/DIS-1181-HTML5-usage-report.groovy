import groovy.transform.Field

@Field contentScope = "/content/dhl/"

println("""Home Page, Page Path """)
def getJcrContent(path) {
    return pageManager.getContainingPage(path).getContentResource();
}
def isPublished(path) {
    def resource = getJcrContent(path)
    def valueMap = resource.getValueMap()
    def status = valueMap.get('cq:lastReplicationAction_publish', valueMap.get('cq:lastReplicationAction', ''))
    return status.equals('Activate')
}

def getHomePages() {
    return sql2Query("""
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE(node, '${contentScope}')
        AND node.[cq:template] = '/conf/dhl/settings/wcm/templates/home-page'
    """);
}

def encodeConfig(originalString) {
    def maxLength = 30000
    def truncatedString = originalString.length() > maxLength ? originalString.substring(0, maxLength) : originalString
    truncatedString = truncatedString.replace('"', '""')
    return "\"${truncatedString}\""
}
getHomePages().each { homePageNode ->
    def homePage = homePageNode.getParent().getPath()
    def components = sql2Query("""
        SELECT * FROM [nt:unstructured] AS s
        WHERE ISDESCENDANTNODE(s, '${homePage}')
        AND s.[sling:resourceType] = 'dhl/components/content/html5embed'
    """).each {
        def path = it.getPath();
        if(isPublished(path)) {
            def pagePath = path.replaceAll('/jcr:content.*', '')
            println("""${homePage}, ${pagePath} """)
        }
    }
}