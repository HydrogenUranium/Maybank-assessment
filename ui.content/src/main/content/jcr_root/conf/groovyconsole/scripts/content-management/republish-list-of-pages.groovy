import com.day.cq.replication.Replicator
import com.day.cq.replication.ReplicationActionType


def DRY_RUN = false
def LIST = [

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
println("""Wrong paths: ${wrongPaths.size()}""")
println("""Not published: ${notPublished.size()}""")
println("""Pages to publish: ${filtered.size()}""")
def replicator = getService("com.day.cq.replication.Replicator")


if (!DRY_RUN) {
    replicator.replicate(session, ReplicationActionType.ACTIVATE, filtered.toArray(new String[0]), null)
}