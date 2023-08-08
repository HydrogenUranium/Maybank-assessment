boolean DRY_RUN = true

def COMPONENT_RESOURCE_TYPE = "dhl/components/content/subscribepanel"

def CONTENT_PROPERTIES_MAPPING = [
        ["contentBranch" : "/content/dhl/us", "formID" : "4019", "munchkinId" : "078-ERT-522", "hostname" : "https://express-resource.dhl.com"],
        //["contentBranch" : "/content/dhl/au", "formID" : "8243", "munchkinId" : "078-ERT-522", "hostname" : "https://express-resource.dhl.com"],
        //["contentBranch" : "/content/dhl/hk", "formID" : "8246", "munchkinId" : "078-ERT-522", "hostname" : "https://express-resource.dhl.com"],
        //["contentBranch" : "/content/dhl/in", "formID" : "8248", "munchkinId" : "078-ERT-522", "hostname" : "https://express-resource.dhl.com"],
        //["contentBranch" : "/content/dhl/my", "formID" : "8249", "munchkinId" : "078-ERT-522", "hostname" : "https://express-resource.dhl.com"],
        //["contentBranch" : "/content/dhl/nz", "formID" : "8250", "munchkinId" : "078-ERT-522", "hostname" : "https://express-resource.dhl.com"],
        //["contentBranch" : "/content/dhl/ph", "formID" : "8251", "munchkinId" : "078-ERT-522", "hostname" : "https://express-resource.dhl.com"],
        //["contentBranch" : "/content/dhl/sg", "formID" : "8252", "munchkinId" : "078-ERT-522", "hostname" : "https://express-resource.dhl.com"],
]

CONTENT_PROPERTIES_MAPPING.each {
    def getNodesByResourceTypeQuery = "SELECT * FROM [nt:unstructured] AS node " +
            "WHERE ISDESCENDANTNODE([" + it.contentBranch + "]) and (node.[sling:resourceType]='" + COMPONENT_RESOURCE_TYPE + "')"

    aecu.contentUpgradeBuilder()
            .forResourcesBySql2Query(getNodesByResourceTypeQuery)
            .doSetProperty("marketoFormId", it.formID)
            .doSetProperty("marketoMunchkinId", it.munchkinId)
            .doSetProperty("marketoHostname", it.hostname)
            .doActivateResource()
            .run(DRY_RUN)
}
