/* DIS-600 Remove resource node from pages
Steps:

0)  INITIAL SETUP
    - define scope
    def CONTENT_SCOPE = "/content/dhl"
    def REMOVED_NODE_RESOURCE_TYPE = "dhl/components/content/title"
    def PAGE_TEMPLATES = [
            "/conf/dhl/settings/wcm/templates/right-aligned-marketo-form",
    ]
    def VERSION_LABEL = "Before removing Title component from 'Right Aligned Marketo Form' pages"

1)  BACKUP:
    - create a backup package of the pages that will be affected
    def DRY_RUN = true
    def CONTENT_MANIPULATION = false

2)  VERSION:
    - update the version of each page that will be affected
    def DRY_RUN = false
    def CONTENT_MANIPULATION = false

3)  MANIPULATION:
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
def CONTENT_SCOPE = "/content/dhl"
def REMOVED_NODE_RESOURCE_TYPE = "dhl/components/content/title"
def PAGE_TEMPLATES = [
        "/conf/dhl/settings/wcm/templates/right-aligned-marketo-form",
]
def VERSION_LABEL = "Before removing Title component from 'Right Aligned Marketo Form' pages"


def getAffectedNodePaths(contentScope, templates, removedNodeResType) {
    def affectedNodePaths = []
    getPage(contentScope).recurse { page ->
        if (page.path ==~ /^\/content\/dhl\/(language-masters|global|\w{2})\/.*/) {
            def template = page?.contentResource?.valueMap?.get("cq:template", "")

            if (templates.contains(template)) {
                getNode(page.path).recurse { node ->
                    if (node?.hasProperty('sling:resourceType')) {
                        def resType = node?.getProperty('sling:resourceType')?.getString()
                        if (resType && resType == removedNodeResType) {
                            affectedNodePaths.add(node.path)
                        }
                    }
                }
            }
        }
    }

    return affectedNodePaths
}

def removeNodes(affectedNodePaths, dryRun) {
    affectedNodePaths.each { nodePath ->
        aecu.contentUpgradeBuilder()
                .forResources((String[])[nodePath])
                .doDeactivateResource()
                .doDeleteResource()
                .run(dryRun)
    }
}

def getListAffectedPages(affectedNodePaths) {
    def listPages = []
    def pageUtilService = getService("com.dhl.discover.core.services.PageUtilService")

    affectedNodePaths.each { nodePath ->
        listPages.add(pageUtilService.getPage(getResource(nodePath)).path)
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
def affectedNodePaths = getAffectedNodePaths(CONTENT_SCOPE, PAGE_TEMPLATES, REMOVED_NODE_RESOURCE_TYPE)
if (CONTENT_MANIPULATION) {
    removeNodes(affectedNodePaths, DRY_RUN)
} else {
    def listAffectedPages = getListAffectedPages(affectedNodePaths)
    if (DRY_RUN) {
        printFiltersForBackupPackage(listAffectedPages)
    }
    setNewPageVersion(listAffectedPages, VERSION_LABEL, DRY_RUN)
}
