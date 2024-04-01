/* DIS-593 Remove pages with templates
Steps:

0)  INITIAL SETUP
    - define scope
    @Field contentScope = "/content/dhl"
    @Field templates = [
            "/apps/dhl/templates/dhl-blank-page",
            "/apps/dhl/templates/dhl-general-page",
            "/apps/dhl/templates/dhl-register-page",
    ]

1) AFFECTED PAGES:
    - show a list of affected pages
    @Field dryRun = true
    @Field contentManipulation = false

2) BACKUP:
    - create a backup package of the pages that will be affected
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

import groovy.transform.Field

@Field dryRun = true
@Field contentManipulation = false
@Field contentScope = "/content/dhl"
@Field templates = [
        "/apps/dhl/templates/dhl-blank-page",
        "/apps/dhl/templates/dhl-general-page",
        "/apps/dhl/templates/dhl-register-page",
]
@Field versionAndPackageName = "DIS-593-before-removing-static-pages"

@Field packagesPath = "/etc/packages/my_packages"
@Field packageDefinitionPath = "$packagesPath/${versionAndPackageName}.zip/jcr:content/vlt:definition"

main()

/* Methods */

// main
def main() {
    def affectedPagePaths = getAffectedPagePaths()
    if (contentManipulation) {
        removePages(affectedPagePaths)
    } else {
        if (dryRun) {
            showListPages(affectedPagePaths)
        } else {
            createBackupPackage(affectedPagePaths)
        }
    }
}

def getAffectedPagePaths() {
    def affectedPagePaths = []
    getPage(contentScope).recurse { page ->
        def template = page?.contentResource?.valueMap?.get("cq:template", "")

        if (templates.contains(template)) {
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

def removePages(affectedPagePaths) {
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
