/* DIS-561 Extra Spacing Style to Text Component on Thank You pages
Steps:

0)  INITIAL SETUP
    - define scope
    def MARKET = "/content/dhl"

1)  BACKUP:
    - create a backup package of the pages that will be affected
    def DRY_RUN = true
    def CONTENT_MANIPULATION = false

2)  VERSION:
    - update the version of each page that will be affected
    def DRY_RUN = false
    def CONTENT_MANIPULATION = false

3)  MANIPULATION:
    - add Extra Spacing Style to Text Component on Thank You pages
    def DRY_RUN = true / false
    def CONTENT_MANIPULATION = true

4)  CHECK:
    - check result (expected: 'Results: 0')
    def DRY_RUN = true
    def CONTENT_MANIPULATION = false

*/
import java.text.SimpleDateFormat;

def DRY_RUN = true
def CONTENT_MANIPULATION = false
def MARKET = "/content/dhl"

def GET_TEXT_COMPONENT_ON_THANK_YOU_PAGES = """
    SELECT component.* FROM [nt:unstructured] AS component 
    INNER JOIN [nt:base] AS contentPage ON ISDESCENDANTNODE(component, contentPage) 
    WHERE ISDESCENDANTNODE(contentPage, '${MARKET}') 
    AND NAME(contentPage) = 'jcr:content' AND contentPage.[cq:template] = '/conf/dhl/settings/wcm/templates/thank-you-page'
    AND component.[sling:resourceType] = 'dhl/components/content/text' AND NAME(component) = 'text' 
    AND component.[cq:styleIds] NOT LIKE '%1708421999909%'
    """

def getComponents(sqlQuery) {
    return sql2Query(sqlQuery)
}

def addExtraSpacingStyleToTextOnThankYouPages(sqlQuery, dryRun) {
    getComponents(sqlQuery).each { node ->
        aecu.contentUpgradeBuilder()
                .forResources((String[])[node.path])
                .doAddValuesToMultiValueProperty("cq:styleIds", (String[])["1708421999909"])
                .doActivateResource()
                .run(dryRun)
    }
}
def getListAffectedPages(sqlQuery) {
    def listPages = []
    def pageUtilService = getService("com.positive.dhl.core.services.PageUtilService")

    getComponents(sqlQuery).each { node ->
        listPages.add(pageUtilService.getPage(getResource(node.path)).path)
    }

    return listPages;
}

def setNewPageVersion(listPages, versionName, dryRun) {
    if (listPages.size() > 0) {
        println("----------------------------------------")
        if (dryRun) {
            println("(!) DRY RUN mode")
        }
        println("List of pages whose version was updated:")

        listPages.each({ pagePath ->
            println('> Page: ' + pagePath)
            def isVersionExist = false

            def page = getPage(pagePath);
            if (page.isLocked()) {
                if (!dryRun) {
                    page.unlock()
                }
                println('(!) INFO: Page was unlocked')
            }

            pageManager.getRevisions(pagePath, null, false).each({ revision ->
                if (revision.getLabel().contains(versionName)) {
                    isVersionExist = true
                    println('(!) INFO: Page Version already exists')
                    return false
                }
            })

            if (!isVersionExist) {
                def date = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss.SSS").format(new Date());
                def label = String.format("%s - %s", versionName, date);

                if (!dryRun) {
                    pageManager.createRevision(page, label, "Groovy Script version");
                }
                println('(!) INFO: New Page Version was created')
            }
        })
    }
}

def printFiltersForBackupPackage(listPages) {
    println("Results: " + listPages.size())
    if (listPages.size() > 0) {
        println("(!) Use this list of pages for preparing package:")
        listPages.each({ println("""<filter root="$it/jcr:content"/>""")})
    }
}

// MAIN
if (CONTENT_MANIPULATION) {
    addExtraSpacingStyleToTextOnThankYouPages(GET_TEXT_COMPONENT_ON_THANK_YOU_PAGES, DRY_RUN)
} else {
    def listAffectedPages = getListAffectedPages(GET_TEXT_COMPONENT_ON_THANK_YOU_PAGES)
    if (DRY_RUN) {
        printFiltersForBackupPackage(listAffectedPages)
    }
    setNewPageVersion(listAffectedPages, "DIS-561 Extra Spacing Style to Text Component", DRY_RUN)
}
