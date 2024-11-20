/* DIS-934 Add Rollout mixin properties to Feature Image nodes
Steps:
0)  INITIAL SETUP
    - define scope in the @Field contentScope
    - define backup version name and backup package name in the @Field versionAndPackageName
1) AFFECTED ITEMS:
    - show a list of affected items
    @Field dryRun = true
    @Field contentManipulation = false
2) BACKUP:
    - create a backup items that will be affected
    - update the version of each page that will be affected
    @Field dryRun = false
    @Field contentManipulation = false
3)  MANIPULATION:
    @Field dryRun = false
    @Field contentManipulation = true
4)  CHECK:
    - check result (expected: 'Affected items: 0')
    @Field dryRun = true
    @Field contentManipulation = false
*/

import groovy.transform.Field
import java.text.SimpleDateFormat;

// Capture the start time
long startTime = System.currentTimeMillis()

@Field dryRun = true
@Field contentManipulation = false

@Field contentScope = "/content/dhl"
@Field affectedItemPaths = [

]

@Field versionAndPackageName = "DIS-934-add-mixin-property-to-feature-image"
@Field packagesPath = "/etc/packages/my_packages"
@Field packageDefinitionPath = "$packagesPath/${versionAndPackageName}.zip/jcr:content/vlt:definition"

main()

/* Methods */

// main
def main() {
    def affectedItemPaths = getAffectedItemPaths()
    def affectedPagePaths = getAffectedPagePaths(affectedItemPaths)
    if (contentManipulation) {
        manipulations(affectedItemPaths)
    } else {
        if (dryRun) {
            showAffectedItems(affectedItemPaths)
        } else {
            createBackupPackage(affectedItemPaths)
            setNewPageVersion(affectedPagePaths)
        }
    }
}

def getAffectedItemPaths() {
    def paths = []
    if (affectedItemPaths.size() == 0) {
        getPage(contentScope).recurse { page ->
            def content = page.node
            if (content && getResource(content.path + "/cq:featuredimage") && page.path ==~ /^\/content\/dhl\/(language-masters|global|\w{2})(\/.*)?/) {
                def hasCancelledForChildren = getResource(content.path + "/cq:featuredimage") ? getNode(content.path + "/cq:featuredimage").get("cq:isCancelledForChildren") : ""
                if (!hasCancelledForChildren) {
                    paths.add(content.path + "/cq:featuredimage")
                }
            }
        }

        return paths
    } else {
        return affectedItemPaths
    }
}

def manipulations(affectedItemPaths) {
    affectedItemPaths.each { itemPath ->
        aecu.contentUpgradeBuilder()
                .forResources((String[]) [itemPath])
                .doSetProperty("cq:isCancelledForChildren", true)
                .doAddMixin("cq:LiveRelationship")
                .doAddMixin("cq:LiveSyncCancelled")
                .run(dryRun)
    }
}

def showAffectedItems(affectedItemPaths) {
    println(">>> INFO >>> Affected items: " + affectedItemPaths.size())
    if (affectedItemPaths.size() > 0 && affectedItemPaths.size() < 1000) {
        affectedItemPaths.each({ println(""""$it",""") })
    }
}

def getAffectedPagePaths(affectedItemPaths) {
    def listPages = []
    def pageUtilService = getService("com.dhl.discover.core.services.PageUtilService")

    affectedItemPaths.each { nodePath ->
        listPages.add(pageUtilService.getPage(getResource(nodePath))?.path)
    }

    return listPages.unique();
}

def setNewPageVersion(listPages) {
    println("----------------------------------------")
    if (dryRun) {
        println(">>> WARN >>> DRY RUN mode is enabled")
    }
    println(">>> INFO >>> List of pages whose version was updated:")
    if (listPages.size() > 0) {
        listPages.each({ pagePath ->
            println('> Page: ' + pagePath)
            def isVersionExist = false

            def page = getPage(pagePath);
            if (page.isLocked()) {
                if (!dryRun) {
                    page.unlock()
                }
                println('>>> WARN >>> Page was unlocked')
            }

            pageManager.getRevisions(pagePath, null, false).each({ revision ->
                if (revision.getLabel().contains(versionAndPackageName)) {
                    isVersionExist = true
                    println('>>> WARN >>> Page Version already exists')
                    return false
                }
            })

            if (!isVersionExist) {
                def date = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss.SSS").format(new Date());
                def label = String.format("%s - %s", versionAndPackageName, date);

                if (!dryRun) {
                    pageManager.createRevision(page, label, "Groovy Script version");
                }
                println('>>> INFO >>> New Page Version was created')
            }
        })
    }
}

//create or update the package funtion
def createOrUpdatePackage() {
    def definitionNode

    if (session.nodeExists(packageDefinitionPath)) {
        definitionNode = getNode(packageDefinitionPath)
        println ">>> WARN >>> A package with this name already exists"
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

def createBackupPackage(listItemPaths) {
    if (listPages.size() > 1000) {
        println(">>> WARN >>> Too many items: Package will NOT BE CREATED!")
        return
    }

    if (dryRun) {
        println ">>> WARN >>> DRY RUN mode is enabled"
    }

    def definitionNode = createOrUpdatePackage()
    def filterNode = packageFilterNodes(definitionNode)

    listItemPaths.eachWithIndex {
        path,
        i ->
            def f = filterNode.addNode("filter$i")

            f.set("mode", "replace")
            f.set("root", path)
            f.set("rules", new String[0])
    }

    if (!dryRun) {
        save()
    }

    println ">>> TODO >>> Please go to '/crx/packmgr/index.jsp' and build created package: " + versionAndPackageName
}
// Capture the end time
long endTime = System.currentTimeMillis()
long elapsedTimeMs = endTime - startTime
int elapsedTimeMinutesRoundedUp = (int) Math.ceil(elapsedTimeMs / 60000.0)
println(">>> INFO >>> Script execution time: ${elapsedTimeMinutesRoundedUp} minutes")

