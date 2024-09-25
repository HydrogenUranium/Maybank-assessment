/* DIS-809 Switching from 'List Image' to 'Featured Image' properties
Steps:
0)  INITIAL SETUP
    - define scope in the @Field contentScope
    - define backup version name and backup package name in the @Field versionAndPackageName
1) AFFECTED ITEMS:
    - show a list of affected items
    @Field dryRun = true
    @Field contentManipulation = false
2) BACKUP:
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

@Field dryRun = true
@Field contentManipulation = false

@Field contentScope = "/content/dhl"
@Field affectedItemPaths = [

]

@Field versionAndPackageName = "DIS-809-before-creating-featured-images"

main()

/* Methods */

// main
def main() {
    def affectedItemPaths = getAffectedItemPaths()
    if (contentManipulation) {
        manipulations(affectedItemPaths)
    } else {
        if (dryRun) {
            showAffectedItems(affectedItemPaths)
        } else {
            setNewPageVersion(affectedItemPaths)
        }
    }
}

def getAffectedItemPaths() {
    def paths = []
    if (affectedItemPaths.size() == 0) {
        getPage(contentScope).recurse { page ->
            def content = page.node
            if (content && content.get("listimage") && page.path ==~ /^\/content\/dhl\/(language-masters|global|\w{2})(\/.*)?/) {
                if (content.get("cq:featuredimage/fileReference") != content.get("listimage")) {
                    paths.add(page.path)
                }
            }
        }

        return paths
    } else {
        return affectedItemPaths
    }
}

def manipulations(affectedItemPaths) {
    def featuredimageProps = [
            "altValueFromDAM": "true",
            "sling:resourceType": "core/wcm/components/image/v3/image"
    ]

    affectedItemPaths.each { itemPath ->
        def listimage = getNode(itemPath + '/jcr:content').get("listimage")
        aecu.contentUpgradeBuilder()
                .forResources((String[]) [itemPath + '/jcr:content'])
                .doDeleteResource("cq:featuredimage")
                .doCreateResource("cq:featuredimage", "nt:unstructured", featuredimageProps)
                .run(dryRun)

        aecu.contentUpgradeBuilder()
                .forResources((String[]) [itemPath + '/jcr:content/cq:featuredimage'])
                .doSetProperty("fileReference", listimage)
                .doActivateResource()
                .run(dryRun)
    }
}

def showAffectedItems(affectedItemPaths) {
    println("Affected items: " + affectedItemPaths.size())
    if (affectedItemPaths.size() > 0 && affectedItemPaths.size() < 1000) {
        affectedItemPaths.each({ println(""""$it",""") })
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