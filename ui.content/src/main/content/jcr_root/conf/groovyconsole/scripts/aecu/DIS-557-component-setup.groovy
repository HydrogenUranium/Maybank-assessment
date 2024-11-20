/* DIS-557 Update SPL (Service Point Locator) component
Steps:

0)  INITIAL SETUP
    - define scope
    @Field contentScope = "/content/dhl"
    @Field componentResourceType = "dhl/components/content/locator"
    @Field propertyName = "additionalUrlParamOrSuffix"
    @Field propertyValue = "&mobile=y"

1) AFFECTED PAGES:
    - show a list of affected pages
    - add affected pages to the '@Field affectedPagePaths'
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
    - remove items from '@Field affectedPagePaths'
    - check result (expected: 'Results: 0')
    @Field dryRun = true
    @Field contentManipulation = false

*/

import groovy.transform.Field
import java.text.SimpleDateFormat;

@Field dryRun = true
@Field contentManipulation = false
@Field contentScope = "/content/dhl"
@Field componentResourceType = "dhl/components/content/locator"
@Field propertyName = "additionalUrlParamOrSuffix"
@Field propertyValue = "&mobile=y"

@Field affectedNodePaths = [
]

@Field versionAndPackageName = "DIS-557-before-updating-locator-component"

@Field packagesPath = "/etc/packages/my_packages"
@Field packageDefinitionPath = "$packagesPath/${versionAndPackageName}.zip/jcr:content/vlt:definition"

main()

/* Methods */

// main
def main() {
    affectedNodePaths = getAffectedNodePaths()
    def affectedPagePaths = getAffectedPagePaths(affectedNodePaths)
    if (contentManipulation) {
        updateComponentProperty(affectedNodePaths)
    } else {
        if (dryRun) {
            showAffectedNodes(affectedNodePaths)
        } else {
            createBackupPackage(affectedPagePaths)
            setNewPageVersion(affectedPagePaths)
        }
    }
}

def getAffectedNodePaths() {
    def paths = []
    if (affectedNodePaths.size() == 0) {
        def predicates = [
                "path": contentScope,
                "type": "nt:unstructured",
                "1_property": "sling:resourceType",
                "1_property.value": componentResourceType,
                "2_property": propertyName,
                "2_property.value": propertyValue,
                "2_property.operation": "not",
                "property.and": "true",
                "p.limit": "-1",
        ]
        createQuery(predicates).result.hits.each { hit ->
            paths.add(hit.node.path)
        }
        return paths
    } else {
        return affectedNodePaths
    }
}

def getAffectedPagePaths(affectedNodePaths) {
    def affectedPagePaths = []

    def pageUtilService = getService("com.dhl.discover.core.services.PageUtilService")

    affectedNodePaths.each { nodePath ->
        affectedPagePaths.add(pageUtilService.getPage(getResource(nodePath)).path)
    }

    return affectedPagePaths
}

def updateComponentProperty(affectedNodePaths) {
    affectedNodePaths.each { nodePath ->
        if (getResource(nodePath) != null) {
            aecu.contentUpgradeBuilder()
                    .forResources((String[])[nodePath])
                    .doSetProperty(propertyName, propertyValue)
                    .run(dryRun)

            aecu.contentUpgradeBuilder()
                    .forResources((String[]) [nodePath])
                    .filterByProperty("cq:lastReplicationAction", "Activate")
                    .doActivateContainingPage()
                    .run(dryRun)

            aecu.contentUpgradeBuilder()
                    .forResources((String[]) [nodePath])
                    .filterByProperty("cq:lastReplicationAction", "Deactivate")
                    .doDeactivateContainingPage()
                    .run(dryRun)
        }
    }
}

def showAffectedNodes(affectedNodePaths) {
    println("Affected nodes: " + affectedNodePaths.size())
    if (affectedNodePaths.size() > 0) {
        affectedNodePaths.each({ println(""""$it",""") })
    }
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

