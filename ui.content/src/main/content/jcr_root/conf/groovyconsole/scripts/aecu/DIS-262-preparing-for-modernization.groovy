/* DIS-262 Preparing for the modernization
Steps:

0)  INITIAL SETUP
    - define scope
    def MARKET = "/content/dhl"
    def TEMPLATES = ["/apps/dhl/templates/dhl-amp-article-page"]

1)  BACKUP:
    - create a backup package of the pages that will be affected
    def DRY_RUN = true
    def SHOW_LIST_FOR_PUBLISHING = false

2)  VERSION:
    - update the version of each page that will be affected
    def DRY_RUN = false
    def SHOW_LIST_FOR_PUBLISHING = false

3)  LIST FOR PUBLISHING:
    - show list affected pages for publishing them after modernization by this groovy script 'DIS-262-publish-modernized-amp-pages.groovy'
    def SHOW_LIST_FOR_PUBLISHING = true

*/
import java.text.SimpleDateFormat;

def DRY_RUN = true
def SHOW_LIST_FOR_PUBLISHING = false
def CONTENT_SCOPE = "/content/dhl"
def TEMPLATES = [
        "/apps/dhl/templates/dhl-amp-article-page",
]
def VERSION_LABEL = "Before converting to Article Editable template"

def getPagesWithRemovedTemplate(removedTemplates, contentScope) {
    def pagesWithRemovedTemplate = []
    getPage(contentScope).recurse { page ->
        if (page.path ==~ /^\/content\/dhl\/(language-masters|global|\w{2})\/.*/) {
            def template = page?.contentResource?.valueMap?.get("cq:template", "")

            if (removedTemplates.contains(template)) {
                pagesWithRemovedTemplate.add(page.path)
            }
        }
    }

    return pagesWithRemovedTemplate
}

def showListForPublishing(listPages) {
    println("Results: " + listPages.size())
    if (listPages.size() > 0) {
        println("(!) Use this list of pages for publishing:")
        listPages.each({ println(""""$it",""")})
    }
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

def getListAffectedPages(modifiedNodes) {
    return modifiedNodes
}

def printFiltersForBackupPackage(listPages) {
    println("Results: " + listPages.size())
    if (listPages.size() > 0) {
        println("(!) Use this list of pages for preparing package:")
        listPages.each({ println("""<filter root="$it/jcr:content"/>""")})
    }
}

// MAIN
def modifiedNodes = getPagesWithRemovedTemplate(TEMPLATES, CONTENT_SCOPE)
if (SHOW_LIST_FOR_PUBLISHING) {
    showListForPublishing(modifiedNodes)
} else {
    def listAffectedPages = getListAffectedPages(modifiedNodes)
    if (DRY_RUN) {
        printFiltersForBackupPackage(listAffectedPages)
    }
    setNewPageVersion(listAffectedPages, VERSION_LABEL, DRY_RUN)
}