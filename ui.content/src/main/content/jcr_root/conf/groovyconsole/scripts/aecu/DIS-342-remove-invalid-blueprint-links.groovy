/* DIS-342 Removing Blueprint links from Language Masters
Steps:
0)  INITIAL SETUP
    - define scope in the @Field contentScope
    - define backup version name and backup package name in the @Field versionAndPackageName
1) AFFECTED ITEMS:
    - show a list of affected items
    @Field dryRun = true
    @Field contentManipulation = false
    @Field showTable = true // to show items in the table view of the Groovy Console
    @Field showTable = false // to show items in the text format prepared for converting to the Excel file

2) BACKUP:
    - create a backup items that will be affected
    - update the version of each page that will be affected
    @Field dryRun = false
    @Field contentManipulation = false

3)  MANIPULATION:
    @Field dryRun = false
    @Field contentManipulation = true

4)  CHECK:
    - check result (expected: 'No data available in table' OR 'Affected items: 0')
    @Field dryRun = true
    @Field contentManipulation = false
*/

import groovy.transform.Field
import java.text.SimpleDateFormat;

@Field dryRun = true
@Field contentManipulation = false
@Field showTable = true

@Field contentScope = "/content/dhl/language-masters"
@Field versionAndPackageName = "DIS-342-before-removing-blueprint-links"

@Field packagesPath = "/etc/packages/my_packages"
@Field packageDefinitionPath = "$packagesPath/${versionAndPackageName}.zip/jcr:content/vlt:definition"

main()

/* Methods */

// main
def main() {
    def affectedItemMap = getAffectedItemMap()
    def affectedItemPaths = getAffectedItemPaths(affectedItemMap)
    if (contentManipulation) {
        manipulations(affectedItemPaths)
    } else {
        if (dryRun) {
            showAffectedItems(affectedItemMap, affectedItemPaths)
        } else {
            def affectedPagePaths = getAffectedPagePaths(affectedItemPaths)
            createBackupPackage(affectedItemPaths)
            setNewPageVersion(affectedPagePaths)
        }
    }
}

def getAffectedItemMap() {
    def listForTable = []
    getPage("/content/dhl/language-masters").recurse { page ->
        def content = page.node
        if (content && content.hasNode("cq:LiveSyncConfig")) {
            def liveSyncConfigNode = content.getNode("cq:LiveSyncConfig")
            if (liveSyncConfigNode.hasProperty("cq:master") && liveSyncConfigNode.getProperty("cq:master").getString().startsWith("/content/dhl/Archive")) {
                listForTable.add([page.path, liveSyncConfigNode.getProperty("cq:master").getString()])
            }
        }
    }
    return listForTable
}

def getAffectedItemPaths(affectedItemMap) {
    def list = []
    affectedItemMap.each{ item ->
        list.add(item[0] + "/jcr:content/cq:LiveSyncConfig")
    }
    return list
}


def manipulations(affectedItemPaths) {
    affectedItemPaths.each { itemPath ->
        aecu.contentUpgradeBuilder()
                .forResources((String[]) [itemPath])
                .doDeleteResource()
                .run(dryRun)
    }
}

def showAffectedItems(affectedItemMap, affectedItemPaths) {
    if (showTable) {
        table {
            columns("Page path", "Blueprint page (Link to the Master page)")
            rows(affectedItemMap)
        }
    } else {
        println("Affected items: " + affectedItemPaths.size())
        if (affectedItemPaths.size() > 0) {
            affectedItemPaths.each({ println(""""$it",""") })
        }
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

def createBackupPackage(listItemPaths) {
    if (dryRun) {
        println "(!) DRY RUN mode"
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

    println "> Please go to '/crx/packmgr/index.jsp' and build created package: " + versionAndPackageName
}