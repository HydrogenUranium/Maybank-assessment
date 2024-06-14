/* DIS-737 Set 'noindex,nofollow' property value
Steps:

0)  INITIAL SETUP
    - define scope

1) AFFECTED ITEMS:
    - show a list of affected items
    - add affected items to the '@Field affectedItemPaths'
    @Field dryRun = true
    @Field contentManipulation = false

2) BACKUP:
    - create a backup package of the pages that will be affected
    - update the version of each page that will be affected
    @Field dryRun = false
    @Field contentManipulation = false

3)  MANIPULATION:
    @Field dryRun = false
    @Field contentManipulation = true

4)  CHECK:
    - remove items from '@Field affectedItemPaths'
    - check result (expected: 'Results: 0')
    @Field dryRun = true
    @Field contentManipulation = false

*/

import groovy.transform.Field
import java.text.SimpleDateFormat;

@Field dryRun = true
@Field contentManipulation = false
@Field contentScope = "/content/dhl"
@Field pageNames = [
        "legal-notice",
        "login",
        "register",
        "your-account",
        "download-thanks",
        "forgotten-password",
        "search-results",
        "terms-of-use",
        "privacy",
        "page-not-found",
        "offline",
        "page-rate-limits",
]

@Field affectedItemPaths = [

]

@Field versionAndPackageName = "DIS-737-before-setting-noindex"

@Field packagesPath = "/etc/packages/my_packages"
@Field packageDefinitionPath = "$packagesPath/${versionAndPackageName}.zip/jcr:content/vlt:definition"

main()

/* Methods */

// main
def main() {
    affectedItemPaths = getAffectedItemPaths()
    if (contentManipulation) {
        def affectedPagePaths = affectedItemPaths //getAffectedPagePaths(affectedItemPaths)
        setNoIndex(affectedItemPaths)
        publishingAffectedPages(affectedPagePaths)
    } else {
        if (dryRun) {
            showAffectedItems(affectedItemPaths)
        } else {
            def affectedPagePaths = affectedItemPaths //getAffectedPagePaths(affectedItemPaths)
            createBackupPackage(affectedPagePaths)
            setNewPageVersion(affectedPagePaths)
        }
    }
}

def getAffectedItemPaths() {
    def paths = []
    if (affectedItemPaths.size() == 0) {
        getPage(contentScope).recurse { page ->
            def pagePath = page.path
            def contentPage = page.node

            if (pagePath ==~ /^\/content\/dhl\/(language-masters|global|\w{2})(\/.*)?/
                    && pageNames.contains(page.name)
                    && contentPage) {

                def hasNoIndex = contentPage.get('cq:robotsTags')?.contains('noindex')
                def hasNoFollow = contentPage.get('cq:robotsTags')?.contains('nofollow')

                if (!hasNoIndex || !hasNoFollow) {
                    paths.add(pagePath)
                }
            }
        }

        return paths
    } else {
        return affectedItemPaths
    }
}

def setNoIndex(affectedPagePaths) {
    affectedPagePaths.each { pagePath ->
        //removing existing 'cq:robotsTags' property
        aecu.contentUpgradeBuilder()
                .forResources((String[]) [pagePath + "/jcr:content"])
                .doDeleteProperty("cq:robotsTags")
                .run(dryRun)

        //set new 'noindex,nofollow' property
        aecu.contentUpgradeBuilder()
                .forResources((String[]) [pagePath + "/jcr:content"])
                .doAddValuesToMultiValueProperty("cq:robotsTags", (String[])["noindex","nofollow"])
                .run(dryRun)
    }
}

def publishingAffectedPages(affectedPagePaths) {
    affectedPagePaths.each { pagePath ->
        aecu.contentUpgradeBuilder()
                .forResources((String[]) [pagePath + "/jcr:content"])
                .filterByProperty("cq:lastReplicationAction", "Activate")
                .doActivateContainingPage()
                .run(dryRun)
        aecu.contentUpgradeBuilder()
                .forResources((String[]) [pagePath + "/jcr:content"])
                .filterByProperty("cq:lastReplicationAction", "Deactivate")
                .doDeactivateContainingPage()
                .run(dryRun)
    }
}

def showAffectedItems(affectedItemPaths) {
    println("Affected items: " + affectedItemPaths.size())
    if (affectedItemPaths.size() > 0) {
        affectedItemPaths.each({ println(""""$it",""") })
    }
}

def getAffectedPagePaths(affectedItemPaths) {
    def listPages = []
    def pageUtilService = getService("com.positive.dhl.core.services.PageUtilService")

    affectedItemPaths.each { nodePath ->
        listPages.add(pageUtilService.getPage(getResource(nodePath)).path)
    }

    return listPages.unique();
}

def setNewPageVersion(listPages) {
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
