import javax.jcr.query.Query

boolean DRY_RUN = true

def pagesByTemplateQuery = "SELECT * FROM [cq:Page] AS page WHERE ISDESCENDANTNODE([/content/dhl]) and (page.[jcr:content/sling:resourceType]='dhl/components/pages/usershipnowmarketo')"

resourceResolver.findResources(pagesByTemplateQuery, Query.JCR_SQL2).each { page ->
    def pagesWithProperty = "SELECT * FROM [nt:base] AS s WHERE (ISDESCENDANTNODE(s, '/content/dhl')) AND CONTAINS(s.*, '%s')"
    def pagesWithPropertyQuery = String.format(pagesWithProperty, page.path)

    resourceResolver.findResources(pagesWithPropertyQuery, Query.JCR_SQL2).each { node ->
        println ">> ATTENTION: Node '${node.path}' contains link to removed page '${page.path}'"
    }

    if (!DRY_RUN) {
        resourceResolver.delete(page)
        resourceResolver.commit()
        println ">> SUCCESS: Page '${page.path}' was removed"
    } else {
        println ">> SUCCESS: Page '${page.path}' will be removed"
    }
}
