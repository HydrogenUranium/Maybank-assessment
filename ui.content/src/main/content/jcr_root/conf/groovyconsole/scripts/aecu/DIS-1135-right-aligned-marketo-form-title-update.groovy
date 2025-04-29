import groovy.transform.Field;


/**
 * If DRY_RUN = true
 * then only node path will be printed having either title-v2 resource type or
 *
 * */
@Field DRY_RUN = true;
@Field ROOT = '/content/dhl/global/en-global'

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
        println "Text description updated : " +  + node.getPath()
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
getPages().each { processNode(it)}


if(DRY_RUN) {
    session.refresh(false);
} else {
    session.save();
}