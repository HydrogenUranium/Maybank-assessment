
boolean DRY_RUN = true

def RESOURCES_TO_REMOVE = [
        ["resoursePath" : "dhl/components/content/competitionfreetext"],
        ["resoursePath" : "dhl/components/content/competitionmulti"],
        ["resoursePath" : "dhl/components/content/intropanel"],
        ["resoursePath" : "dhl/components/content/quotectapanel"],
        ["resoursePath" : "dhl/components/content/social"],
]

RESOURCES_TO_REMOVE.each{
    aecu.contentUpgradeBuilder()
            .forResourcesBySql2Query("SELECT * FROM [nt:base] AS s WHERE (ISDESCENDANTNODE(s, '/content')) AND CONTAINS(s.*, '" + it.resoursePath +"')")
            .doCustomResourceBasedAction({
                resource -> println "INVALID LINK: Node '${resource.path}' contains link to removed component '${it.resoursePath}'"
            })
            .run(DRY_RUN)

    aecu.contentUpgradeBuilder()
            .forResourcesBySql2Query("SELECT * FROM [nt:unstructured] AS node WHERE ISDESCENDANTNODE([/content]) and (node.[sling:resourceType]='${it.resoursePath}')")
            .doDeleteResource()
            .run(DRY_RUN)
}
