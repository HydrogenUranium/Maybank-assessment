boolean DRY_RUN = true
def REMOVED_SINGLE_PAGE_PROPERTIES = [
        "noindex",
        "cq:canonicalUrl",
        "cq:robotsTags",
        "jcr:language",
        "cq:isLanguageRoot",
]

def REMOVED_MULTI_PAGE_PROPERTIES = [
        ["propertyName" : "jcr:mixinTypes", "value" : "cq:ReplicationStatus2"],
]

def REMOVED_CONTENT_PAGE_NODES = [
        "canonicalitems",
]

def CONTENT_BRANCHES = [
        "/content/dhl/language-masters/en-master",
        "/content/dhl/language-masters/es",
        "/content/dhl/language-masters/th",
        "/content/dhl/language-masters/ms",
        "/content/dhl/language-masters/id",
        "/content/dhl/language-masters/hi",
        "/content/dhl/language-masters/zh",
        "/content/dhl/language-masters/it",
        "/content/dhl/global/en-global",
        "/content/dhl/au/en-au",
        "/content/dhl/nz/en-nz",
        "/content/dhl/us/en-us",
        "/content/dhl/us/es-us",
        "/content/dhl/it/en-it",
        "/content/dhl/it/it-it",
        "/content/dhl/th/en-th",
        "/content/dhl/th/th-th",
        "/content/dhl/in/en-in",
        "/content/dhl/in/hi-in",
        "/content/dhl/sg/en-sg",
        "/content/dhl/sg/zh-sg",
        "/content/dhl/hk/en-hk",
        "/content/dhl/hk/zh-hk",
        "/content/dhl/tw/en-tw",
        "/content/dhl/tw/zh-tw",
        "/content/dhl/my/en-my",
        "/content/dhl/my/ms-my",
        "/content/dhl/id/en-id",
        "/content/dhl/id/id-id",
]

def removeSinglePageProperties(contentBranches, properties, dryRun) {
    contentBranches.each {contentBranch ->
        properties.each { property ->
            String pagesWithExistingPageProperty = "SELECT child.* FROM [nt:base] AS child INNER JOIN [cq:Page] AS parent ON ISCHILDNODE(child, parent) " +
                    "WHERE (ISDESCENDANTNODE(parent, '" + contentBranch + "') AND NAME(child) = 'jcr:content') " +
                    "AND (child.[" + property + "] IS NOT NULL OR child.[" + property + "] <> '')"

            aecu.contentUpgradeBuilder()
                    .forResourcesBySql2Query(pagesWithExistingPageProperty)
                    .printProperty(property)
                    .doDeleteProperty(property)
                    .doActivateResource()
                    .run(dryRun)
        }
    }
}

def removeMultiPageProperties(contentBranches, properties, dryRun) {
    contentBranches.each {contentBranch ->
        properties.each { property ->
            String pagesWithExistingPageProperty = "SELECT child.* FROM [nt:base] AS child INNER JOIN [cq:Page] AS parent ON ISCHILDNODE(child, parent) " +
                    "WHERE (ISDESCENDANTNODE(parent, '" + contentBranch + "') AND NAME(child) = 'jcr:content') " +
                    "AND (child.[" + property.propertyName + "] IS NOT NULL OR child.[" + property.propertyName + "] <> '') " +
                    "AND child.[" + property.propertyName + "] LIKE '%" + property.value + "%'"

            aecu.contentUpgradeBuilder()
                    .forResourcesBySql2Query(pagesWithExistingPageProperty)
                    .doRemoveValuesOfMultiValueProperty(property.propertyName, (String[])[property.value])
                    .doActivateResource()
                    .run(dryRun)
        }
    }
}

def removeContentPageNodes(contentBranches, nodes, dryRun) {
    contentBranches.each {contentBranch ->
        nodes.each { node ->

            String contentPageNodes = "SELECT node.* FROM [nt:unstructured] AS node " +
                    "INNER JOIN [nt:base] AS pageContent ON ISCHILDNODE(node, pageContent) " +
                    "INNER JOIN [cq:Page] AS page ON ISCHILDNODE(pageContent, page) " +
                    "WHERE (ISDESCENDANTNODE(page, '" + contentBranch + "') AND NAME(pageContent) = 'jcr:content' " +
                    "AND NAME(node) = '" + node + "')"

            aecu.contentUpgradeBuilder()
                    .forResourcesBySql2Query(contentPageNodes)
                    .doDeactivateResource()
                    .doDeleteResource()
                    .run(dryRun)
        }
    }
}

removeSinglePageProperties(CONTENT_BRANCHES, REMOVED_SINGLE_PAGE_PROPERTIES, DRY_RUN)
removeContentPageNodes(CONTENT_BRANCHES, REMOVED_CONTENT_PAGE_NODES, DRY_RUN)
//removeMultiPageProperties(CONTENT_BRANCHES, REMOVED_MULTI_PAGE_PROPERTIES, DRY_RUN)
