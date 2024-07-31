boolean DRY_RUN = true

aecu.contentUpgradeBuilder()
        .forResourcesBySql2Query("SELECT child.* FROM [nt:base] AS child INNER JOIN [cq:Page] AS parent ON ISCHILDNODE(child, parent) WHERE (ISDESCENDANTNODE(parent, '/content/dhl') AND NAME(child) = 'jcr:content') AND (child.[jcr:language] IS NOT NULL OR child.[jcr:language] <> '')")
        .doDeleteProperty("jcr:language")
        .run(DRY_RUN)

aecu.contentUpgradeBuilder()
        .forResourcesBySql2Query("SELECT child.* FROM [nt:base] AS child INNER JOIN [cq:Page] AS parent ON ISCHILDNODE(child, parent) WHERE (ISDESCENDANTNODE(parent, '/content/dhl') AND NAME(child) = 'jcr:content') AND (child.[cq:isLanguageRoot] IS NOT NULL OR child.[cq:isLanguageRoot] <> '')")
        .doDeleteProperty("cq:isLanguageRoot")
        .run(DRY_RUN)