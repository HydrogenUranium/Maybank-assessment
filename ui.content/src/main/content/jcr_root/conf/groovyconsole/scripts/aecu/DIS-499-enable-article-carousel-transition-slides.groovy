/* DIS-499 Enable Transition slides: BACKUP

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

def VERSION_NAME = "DIS-499 Before Enabling Transition slides in the Article Carousel component"

def CONTENT_PATH = "/content/dhl"
def PAGE_RES_TYPE = "dhl/components/pages/editable-category-page"
def COMPONENT_RES_TYPES = [
        "dhl/components/content/article-carousel",
]

def getListPages(contentPath, pageResType, componentResTypes) {
    def pages = []
    componentResTypes.each({ componentResType ->
        def getPages = """
            SELECT page.* FROM [cq:Page] AS page
            INNER JOIN [nt:base] AS jcrContent ON ISCHILDNODE(jcrContent, page)
            INNER JOIN [nt:unstructured] AS component ON ISDESCENDANTNODE(component, jcrContent)
            WHERE ISDESCENDANTNODE(page, '$contentPath')
            AND NAME(jcrContent) = 'jcr:content'
            AND page.[jcr:content/sling:resourceType] = '$pageResType'
            AND component.[sling:resourceType] = '$componentResType'
            AND ((component.[autoplay] IS NULL OR component.[autoplay] <> 'true')
                OR (component.[delay] IS NULL OR component.[delay] <> '5000')
                OR (component.[autopauseDisabled] IS NULL OR component.[autopauseDisabled] <> 'false'))
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

def contentManipulation(listPages, componentResTypes, dryRun) {
    if (listPages.size() > 0) {
        listPages.each({ pagePath ->
            println "> Page: " + pagePath

            def page = getPage(pagePath);
            if (page.isLocked()) {
                if (!dryRun) {
                    page.unlock()
                }
                println('(!) INFO: Page was unlocked')
            }

            componentResTypes.each({ componentResType ->
                aecu.contentUpgradeBuilder()
                        .forResourcesInSubtree(pagePath)
                        .filterByProperty("sling:resourceType", componentResType)
                        .doSetProperty("autoplay", "true")
                        .doSetProperty("delay", "5000")
                        .doSetProperty("autopauseDisabled", "false")
                        .doActivateResource()
                        .run(dryRun)
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