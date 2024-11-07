import groovy.transform.Field

def DRY_RUN = false;

def list = new HashSet();
def wrongPaths = []
def notPublished = []

@Field COMPONENTS = [
        "dhl/components/content/cta-banner",
        "dhl/components/content/cta-banner-with-points",
        "dhl/components/content/button",
        "dhl/components/content/cta-banner-gray",
        "dhl/components/content/marketoForm",
]

def getHomePages() {
    return sql2Query("""
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('/content/dhl')
        AND node.[cq:template] = '/conf/dhl/settings/wcm/templates/home-page'
    """).stream().map{ it.getParent().getPath() };
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

getHomePages().each{ path ->
    COMPONENTS.each {component ->
        def QUERY = """
            SELECT * FROM [nt:unstructured] AS node
            WHERE ISDESCENDANTNODE('${path}')
            AND node.[sling:resourceType] = '${component}'
        """
        sql2Query(QUERY).each {
            list.add(it.getPath().replaceAll("/jcr:content.*", ""))
        }
    }
}

def filtered = list.stream()
        .filter(path -> {
            if(getResource(path) == null) {
                wrongPaths.add(path)
                return false
            }
            if(!isPublished(path)) {
                notPublished.add(path)
                return false;
            }
            return true
        }).toList()

println("Wrong paths: $wrongPaths.size")
println("Not published: $notPublished.size")
println("Pages to publish: $filtered.size")

filtered.each({
    aecu.contentUpgradeBuilder().forResources((String[])[it])
            .doActivateResource()
            .run(DRY_RUN)
})

