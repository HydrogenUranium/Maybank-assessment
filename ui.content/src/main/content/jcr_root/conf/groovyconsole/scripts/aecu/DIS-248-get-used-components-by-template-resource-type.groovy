import javax.jcr.query.Query

def SCOPE = "/content/dhl/en-master"

def TEMPLATE_RESOURCE_TYPE = "dhl/components/pages/article"

def query = """
        SELECT component.* FROM [cq:PageContent] AS articleContent
        INNER JOIN [nt:unstructured] AS component ON ISDESCENDANTNODE(component, articleContent)
        WHERE articleContent.[sling:resourceType] = '$TEMPLATE_RESOURCE_TYPE' 
        AND isDescendantNode(articleContent, '$SCOPE')
""" as Object

def executeQuery(query) {
    session.workspace.queryManager.createQuery(query, Query.JCR_SQL2).execute()
}

def componentSet = executeQuery(query).nodes.collect(new HashSet(), {
    if (it.hasProperty("sling:resourceType")) {
        it.getProperty("sling:resourceType").getString()
    }
})

componentSet.remove(null)

componentSet.stream()
        .map(path -> getResource(path))
        .sorted((first, second) -> first.valueMap.get("componentGroup").compareTo(second.valueMap.get("componentGroup")))
        .forEach(resource -> {
            def valueMap = resource.valueMap
            def group = valueMap.get('componentGroup')
            def name = valueMap.get('jcr:title')
            println("Group: $group, Name: $name, path: $resource.path")
        })

