/* DIS-153 Sitemap Content Setup
Steps:
0)  INITIAL SETUP
    - define scope
    @Field contentScope = "/content/dhl"
    @Field sitemapRootPages = [
            "/content/dhl",
            "/content/dhl/global",
    ]
1) AFFECTED PAGES:
    - show a list of affected pages
    @Field dryRun = true
    @Field contentManipulation = false
2) BACKUP:
    - create a backup package of the pages that will be affected
    - update the version of each page that will be affected
    @Field dryRun = false
    @Field contentManipulation = false
2)  MANIPULATION:
    @Field dryRun = true / false
    @Field contentManipulation = true
3)  CHECK:
    - check result (expected: 'Results: 0')
    @Field dryRun = true
    @Field contentManipulation = false
*/

import java.text.SimpleDateFormat;
import groovy.transform.Field

@Field dryRun = true
@Field contentManipulation = false
@Field contentScope = "/content/dhl"
@Field sitemapRootPages = [
        "/content/dhl",
        "/content/dhl/global",
        "/content/dhl/at",
        "/content/dhl/au",
        "/content/dhl/bd",
        "/content/dhl/cn",
        "/content/dhl/cz",
        "/content/dhl/es",
        "/content/dhl/fr",
        "/content/dhl/gb",
        "/content/dhl/hk",
        "/content/dhl/id",
        "/content/dhl/ie",
        "/content/dhl/in",
        "/content/dhl/it",
        "/content/dhl/jp",
        "/content/dhl/ke",
        "/content/dhl/kh",
        "/content/dhl/lk",
        "/content/dhl/mm",
        "/content/dhl/my",
        "/content/dhl/ng",
        "/content/dhl/nz",
        "/content/dhl/ph",
        "/content/dhl/pk",
        "/content/dhl/pt",
        "/content/dhl/sg",
        "/content/dhl/sk",
        "/content/dhl/th",
        "/content/dhl/tw",
        "/content/dhl/us",
        "/content/dhl/vn",
        "/content/dhl/za",
]
@Field versionAndPackageName = "DIS-624-before-sitemap-content-setup"

@Field packagesPath = "/etc/packages/my_packages"
@Field packageDefinitionPath = "$packagesPath/${versionAndPackageName}.zip/jcr:content/vlt:definition"

main()

/* Methods */

// main
def main() {
    def affectedPagePaths = getAffectedPagePaths()
    if (contentManipulation) {
        setSitemapRootProperties(affectedPagePaths)
    } else {
        if (dryRun) {
            showListPages(affectedPagePaths)
        } else {
            createBackupPackage(affectedPagePaths)
            setNewPageVersion(affectedPagePaths)
        }
    }
}

def getAffectedPagePaths() {
    def affectedPagePaths = []
    getPage(contentScope).recurse { page ->
        def isSitemapRootPage = sitemapRootPages.contains(page.path)
        def hasSitemapRootProperty = page.node?.get('sling:sitemapRoot')
        if ((isSitemapRootPage && !hasSitemapRootProperty) || (!isSitemapRootPage && hasSitemapRootProperty)) {
            affectedPagePaths.add(page.path)
        }
    }

    return affectedPagePaths
}

def showListPages(listPages) {
    println("Affected pages: " + listPages.size())
    if (listPages.size() > 0) {
        listPages.each({ println(""""$it",""") })
    }
}

def setSitemapRootProperties(affectedPagePaths) {
    affectedPagePaths.each { pagePath ->
        if (sitemapRootPages.contains(pagePath)) {
            aecu.contentUpgradeBuilder()
                    .forChildResourcesOf(pagePath)
                    .filterByNodeName("jcr:content")
                    .doSetProperty("sling:sitemapRoot", "true")
                    .doActivateContainingPage()
                    .run(dryRun)
        } else {
            aecu.contentUpgradeBuilder()
                    .forChildResourcesOf(pagePath)
                    .filterByNodeName("jcr:content")
                    .doDeleteProperty("sling:sitemapRoot")
                    .doActivateContainingPage()
                    .run(dryRun)
        }
    }
}

//create or update the package funtion
def createOrUpdatePackage() {
    def definitionNode

    if (session.nodeExists(packageDefinitionPath)) {
        definitionNode = getNode(packageDefinitionPath)
        println "(!) INFO: A package with this name already exists"
    } else {
        def fileNode = getNode(packagesPath).addNode("${versionAndPackageName}.zip", "nt:file")

        def contentNode = fileNode.addNode("jcr:content", "nt:resource")

        contentNode.addMixin("vlt:Package")
        contentNode.set("jcr:mimeType", "application/zip")

        def stream = new ByteArrayInputStream("".bytes)
        def binary = session.valueFactory.createBinary(stream)

        contentNode.set("jcr:data", binary)

        definitionNode = contentNode.addNode("vlt:definition", "vlt:PackageDefinition")
        definitionNode.set("sling:resourceType", "cq/packaging/components/pack/definition")
        definitionNode.set("name", versionAndPackageName)
        definitionNode.set("path", "$packagesPath/$versionAndPackageName")
    }

    definitionNode
}

//package filter nodes
def packageFilterNodes(definitionNode) {
    def filterNode

    if (definitionNode.hasNode("filter")) {
        filterNode = definitionNode.getNode("filter")
        filterNode.nodes.each {
            it.remove()
        }
    } else {
        filterNode = definitionNode.addNode("filter")
        filterNode.set("sling:resourceType", "cq/packaging/components/pack/definition/filterlist")
    }

    filterNode
}

def createBackupPackage(listPages) {
    if (dryRun) {
        println "(!) DRY RUN mode"
    }

    def definitionNode = createOrUpdatePackage()
    def filterNode = packageFilterNodes(definitionNode)

    listPages.eachWithIndex {
        path,
        i ->
            def f = filterNode.addNode("filter$i")

            f.set("mode", "replace")
            f.set("root", path + "/jcr:content")
            f.set("rules", new String[0])
    }

    if (!dryRun) {
        save()
    }

    println "> Please go to '/crx/packmgr/index.jsp' and build created package: " + versionAndPackageName
}

def setNewPageVersion(listPages) {
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
            if (page?.isLocked()) {
                if (!dryRun) {
                    page.unlock()
                }
                println('(!) INFO: Page was unlocked')
            }

            pageManager.getRevisions(pagePath, null, false).each({ revision ->
                if (revision.getLabel().contains(versionAndPackageName)) {
                    isVersionExist = true
                    println('(!) INFO: Page Version already exists')
                    return false
                }
            })

            if (!isVersionExist) {
                def date = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss.SSS").format(new Date());
                def label = String.format("%s - %s", versionAndPackageName, date);

                if (!dryRun) {
                    pageManager.createRevision(page, label, "Groovy Script version");
                }
                println('(!) INFO: New Page Version was created')
            }
        })
    }
}
