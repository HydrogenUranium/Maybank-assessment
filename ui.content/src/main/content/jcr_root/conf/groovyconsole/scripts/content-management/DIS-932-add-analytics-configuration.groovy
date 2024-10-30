import groovy.transform.Field

@Field DRY_RUN = false;

@Field getCtaBannerName = { node ->
    if(node.hasProperty("type")) {
        def type = node.getProperty("type").getString();
        switch(type) {
            case "custom":
                return node.hasProperty("title") ? node.getProperty("title").getString() : ""
            case "subscribeNewsletter":
                return "'Subscribe to News Letter' Banner"
            default:
                return ""
        }
    }

    return ""
}

@Field getCtaBannerWithPointsName = { node ->
    if(node.hasProperty("type")) {
        def type = node.getProperty("type").getString();
        switch(type) {
            case "custom":
                return node.hasProperty("title") ? node.getProperty("title").getString() : ""
            case "businessAccount":
                return "'Open A Business Account' Banner"
            case "subscribeNewsletter":
                return "'Subscribe To Our Newsletter' Banner"
            default:
                return ""
        }
    }

    return ""
}

@Field getButtonName = { node ->
    def title = node.hasProperty("jcr:title") ? node.getProperty("jcr:title").getString() : "";

    return "'${title}' Button"
}

@Field getCtaGrayBannerName = { node ->
    if(node.hasProperty("type")) {
        def type = node.getProperty("type").getString();
        switch(type) {
            case "custom":
                return node.hasProperty("title") ? node.getProperty("title").getString() : ""
            case "individualShipper":
                return "'Are you an individual shipper?' Banner"
            default:
                return ""
        }
    }

    return ""
}

@Field COMPONENTS = [
        "dhl/components/content/cta-banner": [
                "interactionType": "content",
                "trackedInteractions": "basic",
                "name": getCtaBannerName],

        "dhl/components/content/cta-banner-with-points": [
                "interactionType": "content",
                "trackedInteractions": "basic",
                "name": getCtaBannerWithPointsName],

        "dhl/components/content/button": [
                "interactionType": "content",
                "trackedInteractions": "basic",
                "name": getButtonName],

        "dhl/components/content/cta-banner-gray": [
                "interactionType": "content",
                "trackedInteractions": "basic",
                "name": getCtaGrayBannerName],
]

def setAnalyticsProperty(analyticsNode, property, value) {
    if (value instanceof Closure) {
        def extractedValue = value(analyticsNode.getParent())
        println "set ${property}: ${extractedValue}"
        analyticsNode.setProperty(property, extractedValue)
    } else if (value instanceof String) {
        println "set ${property}: ${value}"
        analyticsNode.setProperty(property, value)
    }
}

def isAnalyticsConfigured(analyticsNode) {
    return analyticsNode.hasProperty("trackedInteractions") && !"off".equals(analyticsNode.getProperty("trackedInteractions").getString());
}

def addAnalytics(node, config) {
    def analyticsNode = node.hasNode("analytics") ? node.getNode("analytics") : node.addNode("analytics");

    if(isAnalyticsConfigured(analyticsNode)) {
        println "Analytics configuration is skipped because it already configured."
        return;
    }

    config.each { key, value ->
        setAnalyticsProperty(analyticsNode, key, value);
    }
}

def getHomePages() {
    return sql2Query("""
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('/content/dhl')
        AND node.[cq:template] = '/conf/dhl/settings/wcm/templates/home-page'
    """).stream().map{ it.getParent() };
}

def updateAnalyticsUnderPath(path) {
    COMPONENTS.each { key, value ->
        def QUERY = """
            SELECT * FROM [nt:unstructured] AS node
            WHERE ISDESCENDANTNODE('${path}')
            AND node.[sling:resourceType] = '${key}'
        """

        sql2Query(QUERY).each {
            println "${it.getPath()}"
            addAnalytics(it, value)
            println()

            if(DRY_RUN) {
                session.refresh(false);
            } else {
                save();
            }
        }
    }
}

getHomePages().each{
    updateAnalyticsUnderPath(it.getPath())
}


