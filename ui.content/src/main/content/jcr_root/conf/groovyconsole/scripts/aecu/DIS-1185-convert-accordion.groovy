/* DIS-731 Convert Accordion component to Accordion v.2
Steps:
0)  INITIAL SETUP
    - define scope in the @Field contentScope
    - define old Component Resource Type in the @Field oldComponentResType
    - define new Component Resource Type in the @Field newComponentResType
    - define backup version name and backup package name in the @Field versionAndPackageName
1) AFFECTED ITEMS:
    - show a list of affected items
    - add affected items to the '@Field affectedItemPaths'
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
@Field oldComponentResType = "dhl/components/content/accordion"
@Field newComponentResType = "dhl/components/content/accordion-v2"

@Field versionAndPackageName = "DIS-731-before-converting-accordion"

@Field packagesPath = "/etc/packages/my_packages"
@Field packageDefinitionPath = "$packagesPath/${versionAndPackageName}.zip/jcr:content/vlt:definition"

main()

/* Methods */

// main
def main() {
    affectedItemPaths = getAffectedItemPaths()
    if (contentManipulation) {
        def affectedPagePaths = getAffectedPagePaths(affectedItemPaths)
        manipulations(affectedItemPaths)
        publishingAffectedPages(affectedPagePaths)
    } else {
        if (dryRun) {
            showAffectedItems(affectedItemPaths)
        } else {
            def affectedPagePaths = getAffectedPagePaths(affectedItemPaths)
            createBackupPackage(affectedItemPaths)
            setNewPageVersion(affectedPagePaths)
        }
    }
}

def getAffectedItemPaths() {
    def paths = []
    if (affectedItemPaths.size() == 0) {
        getPage(contentScope).recurse { page ->
            if (page.path ==~ /^\/content\/dhl\/(language-masters|global|\w{2})(\/[\w-]+)+/) {
                if (getResource(page.path + "/jcr:content")) {
                    getNode(page.path + "/jcr:content").recurse { node ->
                        if (node?.hasProperty('sling:resourceType')) {
                            def resType = node.getProperty('sling:resourceType').getString()
                            if (resType && resType == oldComponentResType) {
                                paths.add(node.path)
                            }
                        }
                    }
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
        def accordionResource = getResource(itemPath);
        accordionResource.adaptTo(ModifiableValueMap).put("sling:resourceType", "dhl/components/content/accordion-v2")

        def resources = [];
        if(getResource(itemPath + "/items") != null) {
            resources = getResource(itemPath + "/items").getChildren()
        }

        def count = 0;

        // Get the parent node
        Node parentNode = session.getNode(accordionResource.getPath())

        for(resource in resources) {
            if (resource) {
                def valueMap = resource.adaptTo(ModifiableValueMap)
                count = count + 1;
                if (valueMap) {
                    // Rename properties
                    valueMap.get("title") != null ? valueMap.put("cq:panelTitle", valueMap.remove("title")) : valueMap.remove("title")
                    valueMap.get("content") != null ? valueMap.put("text", valueMap.remove("content")) : valueMap.remove("content")
                    valueMap.put("textIsRich", "true")
                    valueMap.put("sling:resourceType", "dhl/components/content/text")
                }

                def newNodeName = "item_"+count;

                // Create the new directory (node)
                if (!parentNode.hasNode(newNodeName)) {
                    Node newNode = parentNode.addNode(newNodeName, "nt:unstructured")
                    newNode.setProperty("cq:panelTitle", valueMap.get("cq:panelTitle"))
                    newNode.setProperty("text", valueMap.get("text"))
                    newNode.setProperty("textIsRich", valueMap.get("textIsRich"))
                    newNode.setProperty("sling:resourceType", valueMap.get("sling:resourceType"))
                } else {
                    println "Directory '${newNodeName}' already exists at path: ${parentNode}/${newNodeName}"
                }
            }
        }

        // Check if the parent node has a child node named "items"
        if (parentNode.hasNode("items") && !dryRun) {
            parentNode.getNode("items").remove()
            //println "Child node 'items' removed from parentNode."
        }

        // Replace resource type
        // Delete properties and resources
        if(accordionResource && !dryRun) {
            accordionResource.adaptTo(ModifiableValueMap).remove("textIsRich")
            //println "removed the textIsRich property from component."
        }

        // Save changes if not in dryRun mode
        if (!dryRun) {
            session.save()
        }
    }
}

def publishingAffectedPages(affectedPagePaths) {
    def replicator = getService(Replicator)

    affectedPagePaths.each { pagePath ->
        if (pagePath ==~ /^\/content\/dhl\/(language-masters|global|\w{2})(\/[\w-]+)+/) {
            try {
                if (!dryRun) {
                    replicator.replicate(session, ReplicationActionType.ACTIVATE, pagePath)
                    println("Page activated: ${pagePath}")
                } else {
                    println("DRY_RUN: Skipping activation for ${pagePath}")
                }
            } catch (Exception e) {
                println("Replication failed for ${pagePath}: ${e.message}")
            }
        }
    }
}

def showAffectedItems(affectedItemPaths) {
    println("Affected items: " + affectedItemPaths.size())
    if (affectedItemPaths.size() > 0 && affectedItemPaths.size() < 1000) {
        affectedItemPaths.each({ println(""""$it",""") })
    }
}

def getAffectedPagePaths(affectedItemPaths) {
    def listPages = []
    def pageUtilService = getService("com.dhl.discover.core.services.PageUtilService")

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