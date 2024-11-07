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

@Field getProperty = { name, defaultValue ->
    return { node ->
        return node.hasProperty(name) ? node.getProperty(name).getString() : defaultValue;
    }
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
                
        "dhl/components/content/marketoForm": [
                "interactionType": "content",
                "trackedInteractions": "basic",
                "name": "Marketo Form",
                "/customAttributes/item0/name": "Title",
                "/customAttributes/item0/value": getProperty("formTitle", "null"),
                "/customAttributes/item1/name": "Element ID",
                "/customAttributes/item1/value": getProperty("marketoid", "null"),
                "/customAttributes/item2/name": "Form ID",
                "/customAttributes/item2/value": getProperty("marketoformid", "null"),
                "/customAttributes/item3/name": "Hidden Form ID",
                "/customAttributes/item3/value": getProperty("marketohiddenformid", "null"),
                "/customAttributes/item4/name": "Hostname",
                "/customAttributes/item4/value": getProperty("marketohost", "null"),
                ],
]

def getOrCreateChildNode(node, childNodeName) {
    return node.hasNode(childNodeName) ? node.getNode(childNodeName) : node.addNode(childNodeName);
}

def getPropertyName(propertyPath) {
    return propertyPath.tokenize('/').last()
}

def getValue(componentNode, valueProvider) {
    return valueProvider instanceof Closure ? valueProvider(componentNode) : valueProvider
}

def getPropertyHolderNode(analyticsNode, propertyPath) {
    def pathParts = propertyPath.tokenize('/');
    def nodeList = pathParts.isEmpty() ? [] : pathParts.subList(0, pathParts.size() - 1);
    
    def node = analyticsNode;
    nodeList.each{
        node = getOrCreateChildNode(node, it);
    }
    
    return node;
}

def setAnalyticsProperty(analyticsNode, propertyPath, valueProvider) {
    def componentNode = analyticsNode.getParent();
    def propertyHolderNode = getPropertyHolderNode(analyticsNode, propertyPath);
    def property = getPropertyName(propertyPath);
    def value = getValue(componentNode, valueProvider);
    

    println "set ${propertyPath}: ${value}"
    propertyHolderNode.setProperty(property, value)
}

def isAnalyticsConfigured(analyticsNode) {
    return analyticsNode.hasProperty("trackedInteractions") && !"off".equals(analyticsNode.getProperty("trackedInteractions").getString());
}

def addAnalytics(node, config) {
    def analyticsNode = getOrCreateChildNode(node, "analytics");

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
