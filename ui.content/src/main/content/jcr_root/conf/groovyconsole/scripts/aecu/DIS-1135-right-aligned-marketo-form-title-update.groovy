import com.day.cq.replication.ReplicationActionType
import groovy.transform.Field

import javax.jcr.Session;


/**
 * If DRY_RUN = true
 * then only node path will be printed having either title-v2 resource type or
 *
 * */
@Field DRY_RUN = false;
@Field ROOT = '/content/dhl'

@Field list = new HashSet();
def wrongPaths = []
def notPublished = []

def getPages() {
    return sql2Query("""
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('${ROOT}')
        AND node.[cq:template] = '/conf/dhl/settings/wcm/templates/right-aligned-marketo-form'
    """)
}
def handleTitleV2(node) {
    println "Title text V2 node : " + node.getPath()
    if ((!node.hasProperty("type") || node.getProperty("type").getString().equals("h1"))) {
        node.setProperty("type", "h2")
        if(!DRY_RUN) {
            println "Title text V2 updated node : " + node.getPath()
        }
    }
}
def handleText(node) {
    if (!node.hasProperty('text') || null == node.getProperty('text')) {
        println "Text description : No 'text' property found for node : " + node.getPath()
        return
    }
    def originalText = node.getProperty('text').getString()
    def matcher = originalText =~ /<h1>.*?<\/h1>/
    if (!matcher.find()) {
        println "Text description : No <h1> tags found in the text for node : " + node.getPath()
        return
    }
    def resultText = originalText.replaceAll("<h1>", "<h2>").replaceAll("</h1>", "</h2>")
    node.setProperty('text', resultText)
    if(!DRY_RUN) {
        println "Text description updated : " + node.getPath()
    }
}
@Field HANDLERS = [
        'dhl/components/content/title-v2': (node) -> handleTitleV2(node),
        'dhl/components/content/text': (node) -> handleText(node),
];
def processNode(node) {
    // def children = node.getChildren()
    if(node.hasProperty('sling:resourceType')) {
        def resourceType = node.getProperty('sling:resourceType').getString();
        def handler = HANDLERS[resourceType];
        if(handler != null) {
            handler(node);
        }
    }

    for(child in node.getNodes()) {
        processNode(child)
    }
}
getPages().each {
    processNode(it)
    list.add(it.getPath().replaceAll("/jcr:content.*", ""));
}

if(DRY_RUN) {
    session.refresh(false);
} else {
    session.save();
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

def replicator = getService("com.day.cq.replication.Replicator")


filtered.each({
    if (!DRY_RUN) {
        try {
            def session = resourceResolver.adaptTo(Session)
            if (session != null) {
                replicator.replicate(session, ReplicationActionType.ACTIVATE, it)
                println("Successfully published: ${it}")
            } else {
                println("Failed to adapt resourceResolver to Session")
            }
        } catch (Exception e) {
            println("Replication failed for ${it}: ${e.message}")
        }
    }
})