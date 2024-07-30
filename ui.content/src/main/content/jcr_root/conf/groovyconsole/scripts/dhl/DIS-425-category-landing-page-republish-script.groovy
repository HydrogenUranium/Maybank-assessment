boolean DRY_RUN = false

boolean SHOW_ONLY_STATUS = true

def TIMESTAMP = 1698654844572;

def RESOURCE_TYPE = "dhl/components/pages/editable-category-page"

def time = new Date().getTime();
println("Current time: $time")

def query = session.getWorkspace().getQueryManager()
        .createQuery("""
        SELECT page.* FROM [cq:Page] AS page
        INNER JOIN [cq:PageContent] AS jcrcontent ON ISCHILDNODE(jcrcontent, page)
        WHERE ISDESCENDANTNODE(page, "/content/dhl")
        AND jcrcontent.[cq:lastReplicationAction] = "Activate"
        AND jcrcontent.[sling:resourceType] = '$RESOURCE_TYPE'
    """, 'JCR-SQL2')

def republishedList = query
        .execute()
        .getNodes()
        .collect{it.getPath()}

def filtered = republishedList.stream()
        .filter(path -> {
            def resource = getResource(path + "/jcr:content")
            def lastReplicated = resource.valueMap["cq:lastReplicated"]
            if(lastReplicated == null || lastReplicated.getTime().getTime() < TIMESTAMP) {
                return true
            }
            return false
        }).toList()

def difference = republishedList.size - filtered.size
println("Status: republished $difference from $republishedList.size. List $republishedList")

if(!SHOW_ONLY_STATUS) {
    filtered.each({
        aecu.contentUpgradeBuilder().forResources((String[])[it])
                .doActivateResource()
                .run(DRY_RUN)
    })
}
