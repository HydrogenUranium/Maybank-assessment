import com.day.cq.replication.Replicator
import com.day.cq.replication.ReplicationActionType
import org.apache.sling.api.resource.ResourceResolverFactory
import org.osgi.framework.FrameworkUtil
import org.osgi.framework.ServiceReference
import javax.jcr.Session

def DRY_RUN = true

def LIST = [
        // '/content/dhl/hk/en-hk/example-landing-page/jcr:content',
]

def wrongPaths = []
def notPublished = []

def getJcrContent(path) {
    return pageManager.getContainingPage(path).getContentResource();
}

def isPublished(path) {
    def resource = getJcrContent(path)
    def valueMap = resource.getValueMap()
    def status = valueMap.get('cq:lastReplicationAction_publish', valueMap.get('cq:lastReplicationAction', ''))
    return status.equals('Activate')
}

def filtered = LIST.stream()
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


filtered.each({
    if (!DRY_RUN) {
        replicator.replicate(resourceResolver.adaptTo(Session), ReplicationActionType.ACTIVATE, path)
    }
})