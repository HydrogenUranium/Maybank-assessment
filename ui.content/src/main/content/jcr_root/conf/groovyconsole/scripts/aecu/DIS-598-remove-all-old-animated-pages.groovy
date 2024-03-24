def templateToArticlesMap = [:]

def homePages = sql2Query("""
SELECT * FROM [nt:unstructured] AS node
WHERE ISDESCENDANTNODE(node, '/content/dhl')
AND node.[sling:resourceType] = 'dhl/components/pages/editable-home-page'
""")

homePages.each { homePage ->
    def templates = sql2Query("""
    SELECT * FROM [nt:unstructured] AS content
    WHERE ISDESCENDANTNODE('${homePage.getParent().getPath()}')
    AND NAME(content) = 'jcr:content'
    AND (content.[cq:template] LIKE '/apps/dhl/templates/dhl-animated%')
    """).each {
        def template = null;
        if (it.hasProperty("cq:template")) {
            template = it.getProperty("cq:template")?.getString()
        }
        if (!templateToArticlesMap.containsKey(template)) {
            templateToArticlesMap[template] = []
        }
        templateToArticlesMap[template] << it.getPath()
    }
}


templateToArticlesMap.each { template, articles ->
    articles.each{
        resourceResolver.delete(getResource(it.replaceAll("/jcr:content", "")));
        session.save();
    }
}

