/* Simple Download Asset - show component and its current and proposed property

Steps:

0)  INITIAL SETUP
    - define scope in the @Field contentScope
    - define Component Resource Type in the @Field componentResType
    - define Component Property name in the @Field componentPropertyName
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
    - check result (expected: the 'PROPOSED change of the Property Value' column will contain an empty value or
    '!!! Local version doesn't exist for this link !!!' only)
    @Field dryRun = true
    @Field contentManipulation = false
    @Field showTable = true // to show items in the table view of the Groovy Console
*/

import groovy.transform.Field
import java.text.SimpleDateFormat

@Field dryRun = true
@Field contentManipulation = false
@Field showTable = true

@Field contentScope = "/content/dhl"
@Field componentResType = "dhl/components/content/simpledownload"
@Field componentPropertyName = "downloadurl"
@Field versionAndPackageName = "DIS-763-before-modifying-simple-download-asset"

@Field packagesPath = "/etc/packages/my_packages"
@Field packageDefinitionPath = "$packagesPath/${versionAndPackageName}.zip/jcr:content/vlt:definition"

@Field data = []
getPage(contentScope).recurse { page ->
    if (page.path ==~ /^\/content\/dhl\/(language-masters|global|\w{2})(\/.*)?/) {
        if (getResource(page.path + "/jcr:content")) {
            getNode(page.path + "/jcr:content").recurse { node ->
                if (node?.hasProperty('sling:resourceType')) {
                    def resType = node.getProperty('sling:resourceType').getString()
                    if (resType) {
                        if (resType == componentResType) {
                            def currentPropertyValue = node.hasProperty("${componentPropertyName}") ? node.getProperty("${componentPropertyName}").getString() : ''
                            def adaptedToCurrentLocalPropertyValue = ''
                            def suggestedPropertyValue = ''

                            if (currentPropertyValue != '') {
                                def isRelativePagePath = currentPropertyValue.startsWith('/content/dhl')
                                def isAbsolutePagePath = currentPropertyValue ==~ /^http(.*)(\.(com|dhl)\/discover\/\w{2}-\w{2,6})(.*)?/
                                def relativeHomePagePath = (page.path =~ /^(\/content\/dhl\/(language-masters|global|\w{2})\/(\w{2}(-|_)?(\w{2,6})?))/)[0][1]
                                if (isRelativePagePath) {
                                    adaptedToCurrentLocalPropertyValue = currentPropertyValue.replaceFirst(/^(\/content\/dhl\/(language-masters|global|\w{2})\/(\w{2}(-|_)?(\w{2,6})?))/, relativeHomePagePath)
                                } else if (isAbsolutePagePath) {
                                    adaptedToCurrentLocalPropertyValue = currentPropertyValue.replaceFirst(/^http(.*)(\.(com|dhl)\/discover\/\w{2}-\w{2,6})/, relativeHomePagePath)
                                }
                                if (adaptedToCurrentLocalPropertyValue != currentPropertyValue) {
                                    if (getResource(adaptedToCurrentLocalPropertyValue)) {
                                        suggestedPropertyValue = adaptedToCurrentLocalPropertyValue

                                        if (contentManipulation) {
                                            aecu.contentUpgradeBuilder()
                                                    .forResources((String[]) [node.path])
                                                    .doSetProperty(componentPropertyName, suggestedPropertyValue)
                                                    .run(dryRun)


                                        }
                                    } else {
                                        suggestedPropertyValue = "!!! Local version doesn't exist for this link !!!"
                                    }
                                }
                            }
                            data.add([
                                    node.path,
                                    currentPropertyValue,
                                    suggestedPropertyValue,
                            ])
                        }
                    }
                }
            }
        }
    }
}

if (!contentManipulation) {
    if (!dryRun) {
        createBackupPackage(getAffectedItemPaths())
        setNewPageVersion(getAffectedPagePaths())
    } else {
        if (showTable) {
            table {
                columns("Component Path", "CURRENT Property Value", "PROPOSED change of the Property Value")
                rows(data)
            }
        } else {
            println "Component Path,CURRENT Property Value,PROPOSED change of the Property Value"
            data.each({ println("""${it.join(',')}""") })
        }
    }
} else {
    getAffectedPagePaths().each{ pagePath ->
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

def getAffectedItemPaths() {
    def list = []
    data.each{ item ->
        list.add(item[0])
    }
    return list
}

def getAffectedPagePaths() {
    def list = []
    def pageUtilService = getService("com.dhl.discover.core.services.PageUtilService")

    data.each{ item ->
        list.add(pageUtilService.getPage(getResource(item[0])).path)
    }
    return list.unique().sort()
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
            f.set("root", path)
            f.set("rules", new String[0])
    }

    if (!dryRun) {
        save()
    }

    println "> Please go to '/crx/packmgr/index.jsp' and build created package: " + versionAndPackageName
}
