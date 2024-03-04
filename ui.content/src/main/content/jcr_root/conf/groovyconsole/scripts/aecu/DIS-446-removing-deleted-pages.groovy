/* DIS-446 Remove Deleted pages

Steps:
0)  INITIAL SETUP
    - define scope

    def MARKET = "/content/dhl"                                             // specify the country

1)  BEFORE:
    - show Deleted pages

    def SHOW_ONLY = true
    def CONTENT_MANIPULATION = false

2)  BACKUP:
    - create a backup package of the pages that will be affected
    - update the version of each page that will be affected

    def DRY_RUN = true / false                                              // new Versions are not created in DRY RUN mode
    def SHOW_ONLY = false
    def CONTENT_MANIPULATION = false

3)  MANIPULATION:
    - remove Deleted Pages

    def DRY_RUN = true / false
    def SHOW_ONLY = false
    def CONTENT_MANIPULATION = true


4)  AFTER:
    - show Deleted pages after update

    def SHOW_ONLY = true
    def CONTENT_MANIPULATION = false
*/
import java.text.SimpleDateFormat;

def DRY_RUN = true
def SHOW_ONLY = false
def CONTENT_MANIPULATION = false
def MARKET = "/content/dhl"

def getComponents(market) {
    return sql2Query("""
        SELECT * FROM [cq:Page] AS page
        WHERE ISDESCENDANTNODE(page, '${market}')
        AND page.[jcr:content/deleted] IS NOT NULL
    """)
}

def showDeletedPages(market) {
    def data = []

    getComponents(market).each { node ->
        data.add([
                node.path,
        ])
    }

    if (data.size > 0) {
        println "Deleted Pages"
        data.each {
            println it
        }
    } else {
        println "There is no Deleted pages"
    }

}

def removeDeletedPages(market, dryRun) {
    getComponents(market).each { node ->
        aecu.contentUpgradeBuilder()
                .forResources((String[])[node.path])
                .doDeactivateContainingPage()
                .run(dryRun)
    }

    getComponents(market).each { node ->
        aecu.contentUpgradeBuilder()
                .forResources((String[])[node.path])
                .doDeleteContainingPage()
                .run(dryRun)
    }

}
def getListAffectedPages(market) {
    def listPages = []
    def pageUtilService = getService("com.positive.dhl.core.services.PageUtilService")

    getComponents(market).each { node ->
        listPages.add(pageUtilService.getPage(getResource(node.path)).path)
    }

    return listPages;
}

def setNewPageVersion(listPages, versionName, dryRun) {
    println("----------------------------------------")
    if (dryRun) {
        println("(!) DRY RUN mode")
    }
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

def printFiltersForBackupPackage(listPages) {
    println("Results: " + listPages.size())
    if (listPages.size() > 0) {
        println("(!) Use this list of pages for preparing package:")
        listPages.each({ println("""<filter root="$it/jcr:content"/>""")})
    }
}

// MAIN
if (SHOW_ONLY) {
    showDeletedPages(MARKET)
} else {
    if (CONTENT_MANIPULATION) {
        removeDeletedPages(MARKET, DRY_RUN)
    } else {
        def listAffectedPages = getListAffectedPages(MARKET)
        printFiltersForBackupPackage(listAffectedPages)
        setNewPageVersion(listAffectedPages, "DIS-446 Remove Deleted Pages", DRY_RUN)
    }
}
