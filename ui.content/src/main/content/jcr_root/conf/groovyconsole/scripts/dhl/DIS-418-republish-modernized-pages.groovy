import javax.jcr.query.Query

def SCOPE = "/content/dhl"

def query = """
        SELECT * FROM [cq:PageContent] AS node
        WHERE ISDESCENDANTNODE(node, '$SCOPE') 
        AND node.[sling:resourceType] = 'dhl/components/pages/editable-two-column-page'
        OR node.[sling:resourceType] = 'dhl/components/pages/editable-standard'
""" as Object

boolean DRY_RUN = true

boolean SHOW_ONLY_STATUS = true

def TIME = 1700124186913

def list = executeQuery(query).nodes.collect({
    it.getPath();
})

def executeQuery(query) {
    session.workspace.queryManager.createQuery(query, Query.JCR_SQL2).execute()
}

def wrongPaths = []
def notPublished = []

def filtered = list.stream()
        .filter(path -> {
            def node = getNode(path)
            if (node == null) {
                wrongPaths.add(path)
                return false
            }
            if(!node.hasProperty("cq:lastReplicationAction") || !node.getProperty("cq:lastReplicationAction").getString().equals("Activate")) {
                notPublished.add(path)
                return false
            }
            if(node.hasProperty("cq:lastReplicated")) {
                def lastModified = getNode(path).getProperty("cq:lastReplicated").getDate().getTime().getTime();
                if (lastModified > TIME) {
                    return false
                }
            }

            return true
        }).toList()

def difference = list.size - filtered.size

println("Status: republished $difference from $list.size, wrong paths: $wrongPaths.size")
println("Wrong paths: $wrongPaths.size")
println("Not Published Pages: $notPublished.size")
println((new Date()).getTime())

if(!SHOW_ONLY_STATUS) {
    filtered.each({
        aecu.contentUpgradeBuilder().forResources((String[])[it])
                .doActivateResource()
                .run(DRY_RUN)
    })
}

println("Wrong paths list: $wrongPaths")