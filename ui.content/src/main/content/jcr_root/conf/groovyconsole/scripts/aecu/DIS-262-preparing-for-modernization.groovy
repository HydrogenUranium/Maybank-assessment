/* DIS-262 Preparing for the modernization - Blank,General,Register
Steps:

0)  INITIAL SETUP
    - define scope
    @Field contentScope = "/content/dhl"
    @Field templates = [
            "/apps/dhl/templates/dhl-blank-page",
            "/apps/dhl/templates/dhl-general-page",
            "/apps/dhl/templates/dhl-register-page",
    ]
    @Field versionAndPackageName = "before-converting-static-to-editable-template"

1) SHOW A LIST OF AFFECTED PAGES:
    - to include them in the AEM Modernize Tool using this JS: new AemModernize.createJobForm().#addChildren(['/content/dhl/global/en-global']))
    - to publish them after modernization using this groovy script 'DIS-262-publish-modernized-amp-pages.groovy'

    @Field showListAffectedPages = true

2)  BACKUP:
    - create a backup package of the pages that will be affected
    - update the version of each page that will be affected

    @Field dryRun = false
    @Field showListAffectedPages = false

*/
import java.text.SimpleDateFormat;
import groovy.transform.Field

@Field dryRun = true
@Field showListAffectedPages = true
@Field contentScope = "/content/dhl"
@Field templates = [
        "/apps/dhl/templates/dhl-blank-page",
        "/apps/dhl/templates/dhl-general-page",
        "/apps/dhl/templates/dhl-register-page",
]
@Field versionAndPackageName = "DIS-594-before-converting-static-to-editable-template"

@Field packagesPath = "/etc/packages/my_packages"
@Field packageDefinitionPath = "$packagesPath/${versionAndPackageName}.zip/jcr:content/vlt:definition"

main()

/* Methods */

// main
def main() {
    def affectedPages = getPagesWithRemovedTemplate(templates)
    if (showListAffectedPages) {
        showListPages(affectedPages)
    } else {
        createBackupPackage(affectedPages)
        setNewPageVersion(affectedPages)
    }
}

def getPagesWithRemovedTemplate(removedTemplates) {
    def pagesWithRemovedTemplate = []
    getPage(contentScope).recurse { page ->
        def content = page.node
        if (page.path ==~ /^\/content\/dhl\/(language-masters|global|\w{2})(\/.*)?/ && content && removedTemplates.contains(content.get("cq:template"))) {
            pagesWithRemovedTemplate.add(page.path)
        }
    }

    return pagesWithRemovedTemplate
}

def showListPages(listPages) {
    println("Results: " + listPages.size())
    if (listPages.size() > 0) {
        println("(!) Use this list of pages to modernize and to publish:")
        listPages.each({ println(""""$it",""") })
    }
}

def setNewPageVersion(listPages) {
    if (listPages.size() > 0) {
        println("----------------------------------------")
        if (dryRun) {
            println("(!) DRY RUN mode")
        }
        println("List of pages whose version was updated:")

        listPages.each({ pagePath ->
            println('> Page: ' + pagePath)
            def isVersionExist = false

            def page = getPage(pagePath);
            if (page?.isLocked()) {
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
