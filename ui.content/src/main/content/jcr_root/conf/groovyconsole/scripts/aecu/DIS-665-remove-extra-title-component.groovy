/* DIS-665 Removing old extra Title component
Steps:

0)  INITIAL SETUP
    - define scope

1) AFFECTED PAGES:
    - show a list of affected pages
    - add affected pages to the '@Field affectedPagePaths'
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
@Field pageTemplates = [
        "/conf/dhl/settings/wcm/templates/general-page",
        "/conf/dhl/settings/wcm/templates/landing-page",
        "/conf/dhl/settings/wcm/templates/register-page",
]

@Field affectedPagePaths = [

]

@Field versionAndPackageName = "DIS-665-before-removing-old-extra-title-component"

@Field packagesPath = "/etc/packages/my_packages"
@Field packageDefinitionPath = "$packagesPath/${versionAndPackageName}.zip/jcr:content/vlt:definition"

main()

/* Methods */

// main
def main() {
    affectedPagePaths = getAffectedPagePaths()
    if (contentManipulation) {
        updateTitleComponents(affectedPagePaths)
    } else {
        if (dryRun) {
            showAffectedPages(affectedPagePaths)
        } else {
            createBackupPackage(affectedPagePaths)
            setNewPageVersion(affectedPagePaths)
        }
    }
}

def getAffectedPagePaths() {
    def paths = []
    if (affectedPagePaths.size() == 0) {
        getPage(contentScope).recurse { page ->
            if (page.path ==~ /^\/content\/dhl\/(language-masters|global|\w{2})(\/.*)?/) {
                def template = page?.contentResource?.valueMap?.get("cq:template", "")
                if (pageTemplates.contains(template)) {
                    def hasTitle = false
                    def hasTitleV2 = false
                    getNode(page.path + "/jcr:content").recurse { node ->
                        if (node?.hasProperty('sling:resourceType')) {
                            def resType = node.getProperty('sling:resourceType').getString()
                            if (resType) {
                                if (resType == "dhl/components/content/title") {
                                    hasTitle = true
                                } else if (resType == "dhl/components/content/title-v2") {
                                    hasTitleV2 = true
                                }
                            }
                        }
                    }
                    if (hasTitle && hasTitleV2) {
                        paths.add(page.path)
                    }
                }
            }
        }
        return paths
    } else {
        return affectedPagePaths
    }
}

def updateTitleComponents(affectedNodePaths) {
    affectedNodePaths.each { pagePath ->

        //removing old extra Title component
        aecu.contentUpgradeBuilder()
                .forDescendantResourcesOf(pagePath + "/jcr:content")
                .filterByProperty("sling:resourceType", "dhl/components/content/title")
                .doDeleteResource()
                .run(dryRun)

        //set title of the new Title v2 component
        def jcrTitlePageProperty = getPage(pagePath)?.contentResource?.valueMap?.get("jcr:title", "")
        aecu.contentUpgradeBuilder()
                .forDescendantResourcesOf(pagePath + "/jcr:content")
                .filterByProperty("sling:resourceType", "dhl/components/content/title-v2")
                .filterWith(new FilterBy(){
                    public boolean filter(Resource resource, StringBuilder output) {
                        ValueMap properties = resource.valueMap
                        String title = properties.get("jcr:title", String.class)
                        return title == null || title == ""
                    }
                })
                .doSetProperty("jcr:title", jcrTitlePageProperty)
                .run(dryRun)

        //publishing or unpublishing page
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

def showAffectedPages(affectedPagePaths) {
    println("Affected pages: " + affectedPagePaths.size())
    if (affectedPagePaths.size() > 0) {
        affectedPagePaths.each({ println(""""$it",""") })
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
