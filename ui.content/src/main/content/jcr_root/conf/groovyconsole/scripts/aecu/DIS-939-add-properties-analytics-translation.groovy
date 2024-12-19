import groovy.transform.Field

@Field DRY_RUN = true;

@Field COMPONENTS = [
        "dhl/components/content/cta-banner",
        "dhl/components/content/cta-banner-with-points",
        "dhl/components/content/button",
        "dhl/components/content/cta-banner-gray",
        "dhl/components/content/marketoForm",
]

def getHomePages() {
    return sql2Query("""
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('/content/dhl')
        AND node.[cq:template] = '/conf/dhl/settings/wcm/templates/home-page'
    """).stream().map{ it.getParent() };
}

def updateAnalyticsUnderPath(path) {
    COMPONENTS.each { key ->
        def QUERY = """
            SELECT * FROM [nt:unstructured] AS node
            WHERE ISDESCENDANTNODE('${path}')
            AND node.[sling:resourceType] = '${key}'
        """

        sql2Query(QUERY).each {
            if(it.hasNode("analytics")) {
                def analyticsNode = it.getNode("analytics");
                analyticsNode.setProperty("sling:resourceType", "dhl/analytics-node-configuration");
            }

            if(DRY_RUN) {
                session.refresh(false);
            } else {
                save();
            }
        }
    }
}

def updateAnalytics ()  {
    getHomePages().each {
        updateAnalyticsUnderPath(it.getPath())
    }
}

def getAnalyticsPath(path) {
    int count = 0;
    COMPONENTS.each { key ->
        def QUERY = """
            SELECT * FROM [nt:unstructured] AS node
            WHERE ISDESCENDANTNODE('${path}')
            AND node.[sling:resourceType] = '${key}'
        """

        sql2Query(QUERY).each {
            if(it.hasNode("analytics")) {
                def analyticsNode = it.getNode("analytics");
                if (analyticsNode.hasProperty("sling:resourceType")) {
                    count++;
                }
            }
        }
    }
    return count;
}

def getAnalyticsCount() {
    int totalCount = 0;
    getHomePages().each {
        totalCount += getAnalyticsPath(it.getPath());
    }
    println("Total number of pages with analytics node and property 'sling:resourceType': ${totalCount}");
}

def main () {
    if (DRY_RUN) {
        getAnalyticsCount();
    } else {
        updateAnalytics();
    }
}

main()
