import com.day.cq.replication.Replicator
import com.day.cq.replication.ReplicationActionType
import org.apache.sling.api.resource.ResourceResolverFactory
import org.osgi.framework.FrameworkUtil
import org.osgi.framework.ServiceReference
import javax.jcr.Session

def DRY_RUN = false;

def list = new HashSet();
def wrongPaths = []
def notPublished = []


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
        def QUERY = """
            SELECT * FROM [nt:unstructured] AS page
            WHERE ISDESCENDANTNODE(page, '${path}')
            AND NOT ISDESCENDANTNODE(page, '/content/dhl/language-masters')
            AND page.[cq:template] = '/conf/dhl/settings/wcm/templates/animated-page'
        """
        sql2Query(QUERY).each {
            list.add(it.getPath().replaceAll("/jcr:content.*", ""))
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

println("""Wrong paths: ${wrongPaths.size()}""")
println("""Not published: ${notPublished.size()}""")
println("""Pages to publish: ${filtered.size()}""")

def getResourceResolver() {
    def resourceResolverFactory = getService(ResourceResolverFactory)
    def authInfo = Collections.singletonMap(ResourceResolverFactory.SUBSERVICE, "yourSubServiceName")
    return resourceResolverFactory.getServiceResourceResolver(authInfo)
}

def getService(Class serviceClass) {
    def bundleContext = FrameworkUtil.getBundle(serviceClass).getBundleContext()
    ServiceReference serviceReference = bundleContext.getServiceReference(serviceClass.name)
    return bundleContext.getService(serviceReference)
}

def resourceResolver = getResourceResolver()
def replicator = getService(Replicator)

filtered.each { path ->
    if (!DRY_RUN) {
        try {
            def session = resourceResolver.adaptTo(Session)
            if (session != null) {
                replicator.replicate(session, ReplicationActionType.ACTIVATE, path)
                println("Successfully published: ${path}")
                // Verify if cq:lastReplicated is updated
                def resource = getJcrContent(path)
                def valueMap = resource.getValueMap()
                def lastReplicated = valueMap.get('cq:lastReplicated', null)
                if (lastReplicated != null) {
                    println("cq:lastReplicated for ${path} is updated to: ${lastReplicated}")
                } else {
                    println("cq:lastReplicated for ${path} is not updated")
                }
            } else {
                println("Failed to adapt resourceResolver to Session")
            }
        } catch (Exception e) {
            println("Replication failed for ${path}: ${e.message}")
        }
    }
}
if (resourceResolver != null) {
    resourceResolver.close()
}