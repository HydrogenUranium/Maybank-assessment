/* DIS-593 Remove pages with templates
Steps:

0)  INITIAL SETUP
    - define scope
    def CONTENT_SCOPE = "/content/dhl"
    def PAGE_TEMPLATES = [
            "/conf/dhl/settings/wcm/templates/right-aligned-marketo-form",
    ]

1)  BACKUP:
    - create a backup package of the pages that will be affected
    def DRY_RUN = true
    def CONTENT_MANIPULATION = false

2)  MANIPULATION:
    def DRY_RUN = true / false
    def CONTENT_MANIPULATION = true

3)  CHECK:
    - check result (expected: 'Results: 0')
    def DRY_RUN = true
    def CONTENT_MANIPULATION = false

*/

def DRY_RUN = true
def CONTENT_MANIPULATION = false
def CONTENT_SCOPE = "/content/dhl"
def PAGE_TEMPLATES = [
        "/apps/dhl/templates/dhl-article-group-page",
]

def getAffectedPagePaths(contentScope, templates) {
    def affectedPagePaths = []
    getPage(contentScope).recurse { page ->
        def template = page?.contentResource?.valueMap?.get("cq:template", "")

        if (templates.contains(template)) {
            affectedPagePaths.add(page.path)
        }
    }

    return affectedPagePaths
}

def removePages(affectedPagePaths, dryRun) {
    affectedPagePaths.each { pagePath ->
        if (getPage(pagePath) != null) {
            aecu.contentUpgradeBuilder()
                    .forResources((String[])[pagePath])
                    .doDeactivateContainingPage()
                    .doDeleteContainingPage()
                    .run(dryRun)
        }
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
def affectedPagePaths = getAffectedPagePaths(CONTENT_SCOPE, PAGE_TEMPLATES)
if (CONTENT_MANIPULATION) {
    removePages(affectedPagePaths, DRY_RUN)
} else {
    printFiltersForBackupPackage(affectedPagePaths)
}
