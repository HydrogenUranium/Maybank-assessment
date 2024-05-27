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

filtered.each({
    aecu.contentUpgradeBuilder().forResources((String[])[it])
            .doActivateContainingPage()
            .run(DRY_RUN)
})
