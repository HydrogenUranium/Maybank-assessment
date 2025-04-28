import groovy.transform.Field;


/**
 * If DRY_RUN = true
 * then only node path will be printed having either title-v2 resource type or
 *
 * */
@Field DRY_RUN = true;

def getPages() {
    return sql2Query("""
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('/content/dhl')
        AND node.[cq:template] = '/conf/dhl/settings/wcm/templates/right-aligned-marketo-form'
    """).stream().map{ it.getParent().getPath() };
}

def handleTitleV2(node) {
    println "Title text V2 node : "+node.getPath()

    // if the 'type' property exists and set it to 'h2' if it is null or 'h1'
    if (!DRY_RUN && (!node.hasProperty("type") || node.getProperty("type").getString().equals("h1"))) {
        node.setProperty("type", "h2")
        println "Title text V2 updated node : " + node.getPath()
    }
}

def handleText(node) {
    // get text from component check if there is <h1>, if yes change it to h2
    // Check if the node has the 'text' property
    if (!node.hasProperty('text') || null == node.getProperty('text')) {
        println "Text description : No 'text' property found for node : " + node.getPath()
        return
    }

    // Get the original text
    def originalText = node.getProperty('text').getString()

    // Check if there is an <h1> tag in the text
    def matcher = originalText =~ /<h1>.*?<\/h1>/
    if (!matcher.find()) {
        println "Text description : No <h1> tags found in the text for node : " + node.getPath()
        return
    }

    if(!DRY_RUN) {
        // Replace <h1> with <h2> and update the property
        def resultText = originalText.replaceAll("<h1>", "<h2>").replaceAll("</h1>", "</h2>")
        node.setProperty('text', resultText)
        println "Text description updated : " +  + node.getPath()
    }
}

@Field HANDLERS = [
        'dhl/components/content/title-v2': (node) -> handleTitleV2(node),
        'dhl/components/content/text': (node) -> handleText(node),
];

def processNode(path) {
    if (getResource(path + "/jcr:content")) {
        getNode(path + "/jcr:content").recurse { node ->
            if (node?.hasProperty('sling:resourceType')) {
                def resourceType = node.getProperty('sling:resourceType').getString()

                // resourceType as the key to retrieve the handler
                def handler = HANDLERS[resourceType];
                if (handler != null) {
                    handler(node); // Call the handler
                }

                def resType = node.getProperty('sling:resourceType').getString()
                if (resType && resType == "dhl/components/pages/editable-article") {
                    processNode(node.path);
                }

            }
        }
    }
}


getPages().each {
    processNode(it)
}