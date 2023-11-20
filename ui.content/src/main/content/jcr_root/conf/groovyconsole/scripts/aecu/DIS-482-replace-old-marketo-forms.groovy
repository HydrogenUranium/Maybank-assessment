/* DIS-482 Replacing old Marketo Forms - BACKUP

Steps:
1)  BACKUP:
    - create a list of filters to prepare a BackUp package with all pages that will be affected

    def UPDATE_PAGE_VERSION = false
    def CONTENT_MANIPULATION = false

2)  VERSION:
    - update the version of each page that will be affected

    def DRY_RUN = true / false
    def UPDATE_PAGE_VERSION = true
    def CONTENT_MANIPULATION = false

3)  MANIPULATION:
    - replace the old Marketo Forms with the new 'Marketo Form' component

    def DRY_RUN = true / false
    def UPDATE_PAGE_VERSION = false
    def CONTENT_MANIPULATION = true

4)  CHECK:
    - re-run the script to check the result (expectation: 'Results: 0')

    def UPDATE_PAGE_VERSION = false
    def CONTENT_MANIPULATION = false

*/
import java.text.SimpleDateFormat;

def DRY_RUN = true
def UPDATE_PAGE_VERSION = false
def CONTENT_MANIPULATION = false

def VERSION_NAME = "DIS-482 Before replacing the old Marketo Forms with the new 'Marketo Form' component on the 'Right Aligned Marketo Form (Editable)' pages"

def CONTENT_PATH = "/content/dhl"
def PAGE_RES_TYPE = "dhl/components/pages/editable-two-column-page"
def COMPONENT_RES_TYPES = [
        "dhl/components/content/inlineshipnow",
        "dhl/components/content/inlineshipnowmarketo",
        "dhl/components/content/inlineshipnowmarketoconfigurable",
        "dhl/components/content/inlineshipnowtwo",
        "dhl/components/content/subscribepanel",
        "dhl/components/content/download",
]

def getListPages(contentPath, pageResType, componentResTypes) {
    def pages = []
    componentResTypes.each({ componentResType ->
        def getPages = """
            SELECT page.* FROM [cq:Page] AS page
            INNER JOIN [nt:base] AS jcrContent ON ISCHILDNODE(jcrContent, page)
            INNER JOIN [nt:unstructured] AS oldMarketoFormComponent ON ISDESCENDANTNODE(oldMarketoFormComponent, jcrContent)
            WHERE ISDESCENDANTNODE(page, '$contentPath')
            AND NAME(jcrContent) = 'jcr:content'
            AND page.[jcr:content/sling:resourceType] = '$pageResType'
            AND oldMarketoFormComponent.[sling:resourceType] = '$componentResType'
        """
        def getPagesByQuery = session.getWorkspace().getQueryManager().createQuery(getPages, 'JCR-SQL2')
        pages += getPagesByQuery
                .execute()
                .getNodes()
                .collect{it.getPath()}
    })
    return pages.sort().unique()
}

def printFiltersForBackupPackage(listPages) {
    println("Results: " + listPages.size())
    if (listPages.size() > 0) {
        println("(!) Use this list of pages for preparing package:")
        listPages.each({ println("""<filter root="$it/jcr:content"/>""")})
    }
}

def setNewPageVersion(listPages, versionName, dryRun) {
    if (dryRun) {
        println("(!) DRY RUN mode ")
    }
    println("Results: " + listPages.size())
    println("List of pages whose version was updated:")
    if (listPages.size() > 0) {
        listPages.each({
            def isVersionExist = false

            pageManager.getRevisions(it, null, false).each({ revision ->
                if (revision.getLabel().contains(versionName)) {
                    println(">> Page Version Exist: " + it)
                    isVersionExist = true
                    return false
                }
            })

            if (!isVersionExist) {
                println(it)
                def page = getPage(it);

                def date = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss.SSS").format(new Date());
                def label = String.format("%s - %s", versionName, date);

                if (!dryRun) {
                    pageManager.createRevision(page, label, "Groovy Script version.");
                }
            }
        })
    }
}

def contentManipulation(listPages, componentResTypes, dryRun) {
    if (listPages.size() > 0) {
        listPages.each({ pagePath ->
            println ">> Page: " + pagePath

            Node newMarketoParentNode = getNode(pagePath + "/jcr:content/root/two_columns_container/right-column-body")

            def oldMarketoNodes = []
            componentResTypes.each({ componentResType ->
                def getOldMarketoNodes = """
                    SELECT oldMarketo.* FROM [nt:unstructured] AS oldMarketo
                    WHERE ISDESCENDANTNODE(oldMarketo, '$pagePath')
                    AND oldMarketo.[sling:resourceType] = '$componentResType'
                """
                def getNodesByQuery = session.getWorkspace().getQueryManager().createQuery(getOldMarketoNodes, 'JCR-SQL2')
                oldMarketoNodes += getNodesByQuery
                        .execute()
                        .getNodes()
                        .collect{it}
            })
            oldMarketoNodes.each({ oldMarketo ->
                if (oldMarketo.hasProperty("sling:resourceType")
                        && componentResTypes.contains(oldMarketo.getProperty("sling:resourceType").getString())) {

                    def newMarketoProperties = [
                            "sling:resourceType": "dhl/components/content/marketoForm",
                            "marketoformid": oldMarketo.hasProperty("marketoFormId") ? oldMarketo.getProperty("marketoFormId").getString() : "6412",
                            "marketohost": oldMarketo.hasProperty("marketoHostname") ? oldMarketo.getProperty("marketoHostname").getString() : "https://express-resource.dhl.com",
                            "marketoid": oldMarketo.hasProperty("marketoMunchkinId") ? oldMarketo.getProperty("marketoMunchkinId").getString() : "903-EZK-832",
                            "marketohiddenformid": oldMarketo.hasProperty("hiddenmarketoformid") ? oldMarketo.getProperty("hiddenmarketoformid").getString() : "6310",
                            "cq:isCancelledForChildren": true,
                    ]

                    if (newMarketoParentNode.hasNode("marketoform")) {
                        aecu.contentUpgradeBuilder()
                                .forResources((String[])[newMarketoParentNode.path + "/marketoform"])
                                .doDeleteResource()
                                .run(dryRun)
                    }

                    println "-- Creating new Marketo Form Component"
                    aecu.contentUpgradeBuilder()
                            .forResources((String[])[newMarketoParentNode.path])
                            .doCreateResource("marketoform", "nt:unstructured", newMarketoProperties)
                            .run(dryRun)

                    aecu.contentUpgradeBuilder()
                            .forResources((String[])[newMarketoParentNode.path + "/marketoform"])
                            .doAddMixin("cq:LiveRelationship")
                            .doAddMixin("cq:LiveSyncCancelled")
                            .doActivateResource()
                            .run(dryRun)

                    if (newMarketoParentNode.hasNode("marketoform")) {
                        println "-- Removing old Marketo Form Component"
                        aecu.contentUpgradeBuilder()
                                .forResources((String[])[oldMarketo.path])
                                .doDeactivateResource()
                                .doDeleteResource()
                                .run(dryRun)
                    }
                }
            })
        })
    }
}

// MAIN
def listPages = getListPages(CONTENT_PATH, PAGE_RES_TYPE, COMPONENT_RES_TYPES)
if (UPDATE_PAGE_VERSION) {
    setNewPageVersion(listPages, VERSION_NAME, DRY_RUN)
} else {
    if (CONTENT_MANIPULATION) {
        contentManipulation(listPages, COMPONENT_RES_TYPES, DRY_RUN)
    } else {
        printFiltersForBackupPackage(listPages)
    }
}
