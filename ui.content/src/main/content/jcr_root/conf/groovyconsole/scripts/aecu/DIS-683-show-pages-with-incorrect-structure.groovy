/* DIS-683 Show Pages with Incorrect Structure

Steps:

0)  INITIAL SETUP
    - define scope (set root page in the 'contentScope' or list pages in the 'affectedPagePaths')
    - define name of the Package in the 'versionAndPackageName'

1) AFFECTED PAGES:
    - show a list of affected pages
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

@Field affectedPagePaths = [

]

@Field versionAndPackageName = "DIS-683-before-removing-static-elements-of-page"

@Field packagesPath = "/etc/packages/my_packages"
@Field packageDefinitionPath = "$packagesPath/${versionAndPackageName}.zip/jcr:content/vlt:definition"

main()

/* Methods */

// main
def main() {
    affectedPagePaths = getAffectedPagePaths()
    if (contentManipulation) {
        fixPages(affectedPagePaths)
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
            if (page.path == '/content/dhl' || page.path ==~ /^\/content\/dhl\/(language-masters|global|\w{2})(\/.*)?/) {
                def pagePath = page.path
                def contentPage = page.node
                def pageResType = contentPage?.get('sling:resourceType')
                def template = contentPage?.get('cq:template')
                def isValidPage = contentPage != null && template != null && template.startsWith('/conf/dhl/settings/wcm/templates') && pageResType != null && pageResType.startsWith('dhl/components/pages/editable')

                if (!isValidPage) {
                    paths.add(pagePath)
                }
            }
        }
        return paths
    } else {
        return affectedPagePaths
    }
}

def fixPages(affectedNodePaths) {
    affectedNodePaths.each { pagePath ->
        def page = getPage(pagePath)

        if (page != null) {
            def contentPage = page.node

            // remove pages without 'jcr:content' node (without Page Content)
            if (contentPage == null) {
                aecu.contentUpgradeBuilder()
                        .forResources((String[])[pagePath])
                        .doDeactivateContainingPage()
                        .doDeleteContainingPage()
                        .run(dryRun)
            } else {

                // set 'Landing Page' template and Resource Type
                aecu.contentUpgradeBuilder()
                        .forResources((String[])[pagePath + "/jcr:content"])
                        .doSetProperty("sling:resourceType", "dhl/components/pages/editable-standard")
                        .doSetProperty("cq:template", "/conf/dhl/settings/wcm/templates/landing-page")
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
    }
}

def showAffectedPages(affectedPagePaths) {
    def pageStucture = []
    affectedPagePaths.each { pagePath ->
        def page = getPage(pagePath)
        def contentPage = page.node

        pageStucture.add([contentPage != null, contentPage?.get('cq:template'), contentPage?.get('sling:resourceType'), page.path])
    }
    table {
        columns("Has 'jcr:content'", "Template", "Page Component", "Page Path")
        rows(pageStucture)
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
