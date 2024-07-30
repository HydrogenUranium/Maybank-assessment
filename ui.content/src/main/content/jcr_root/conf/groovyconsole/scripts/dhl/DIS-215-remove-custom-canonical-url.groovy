boolean DRY_RUN = true
String propertyName = "cq:canonicalUrl"
String pagesWithExistingPageProperty = "SELECT child.* FROM [nt:base] AS child INNER JOIN [cq:Page] AS parent ON ISCHILDNODE(child, parent) " +
        "WHERE (ISDESCENDANTNODE(parent, '/content/dhl') AND NAME(child) = 'jcr:content') " +
        "AND (child.[" + propertyName + "] IS NOT NULL OR child.[" + propertyName + "] <> '')"

aecu.contentUpgradeBuilder()
        .forResourcesBySql2Query(pagesWithExistingPageProperty)
        .printProperty(propertyName)
        .doDeleteProperty(propertyName)
        .doActivateResource()
        .run(DRY_RUN)
