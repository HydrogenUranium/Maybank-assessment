/* DIS-808 Remove 'register' pages
Steps:
0)  INITIAL SETUP
    - define scope in the @Field contentScope
    - define page name in the @Field pageNameForDeletion
    - define backup version name and backup package name in the @Field versionAndPackageName
1) AFFECTED ITEMS:
    - show a list of affected items
    - add affected items to the '@Field affectedItemPaths'
    @Field dryRun = true
    @Field contentManipulation = false
2) BACKUP:
    - create a backup items that will be affected
    @Field dryRun = false
    @Field contentManipulation = false
3)  MANIPULATION:
    @Field dryRun = false
    @Field contentManipulation = true
4)  CHECK:
    - remove items from '@Field affectedPagePaths'
    - check result (expected: 'Results: 0')
    @Field dryRun = true
    @Field contentManipulation = false
*/

import groovy.transform.Field
import java.text.SimpleDateFormat

@Field dryRun = true
@Field contentManipulation = false

@Field affectedItemPaths = [

]

@Field contentScope = "/content/dhl"
@Field pageNameForDeletion = "register"

@Field versionAndPackageName = "DIS-808-before-removing-register-pages"

@Field packagesPath = "/etc/packages/my_packages"
@Field packageDefinitionPath = "$packagesPath/${versionAndPackageName}.zip/jcr:content/vlt:definition"

main()

/* Methods */

// main
def main() {
    affectedItemPaths = getAffectedItemPaths()
    if (contentManipulation) {
        manipulations(affectedItemPaths)
    } else {
        if (dryRun) {
            showAffectedItems(affectedItemPaths)
        } else {
            createBackupPackage(affectedItemPaths)
        }
    }
}

def getAffectedItemPaths() {
    def paths = []
    if (affectedItemPaths.size() == 0) {
        getPage(contentScope).recurse { page ->
            if (page.path ==~ /^\/content\/dhl\/(language-masters|global|\w{2})(\/.*)?/ && page.name == pageNameForDeletion) {
                paths.add(page.path)
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
                .doDeactivateContainingPage()
                .doDeleteContainingPage()
                .run(dryRun)
    }
}

def showAffectedItems(affectedItemPaths) {
    println("Affected items: " + affectedItemPaths.size())
    if (affectedItemPaths.size() > 0) {
        affectedItemPaths.each({ println(""""$it",""") })
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