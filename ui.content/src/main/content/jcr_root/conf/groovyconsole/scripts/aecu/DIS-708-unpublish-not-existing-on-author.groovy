/* DIS-708 Unpublish not existing on Author

Steps:

0)  INITIAL SETUP
    - define scope in the '@Field contentScope'
    - define Publish Env URL Host in the '@Field publishEnvHost'

1) AFFECTED ITEMS:
    - show a list of affected items
    @Field dryRun = true

    - add affected items to the '@Field affectedItemPaths'

2)  MANIPULATION:
    - create a package of the pages that exist on Publish but don't exist on Author
    @Field dryRun = false

    - replicate this package to remove on Publish not existing pages

3)  CHECK:
    - remove items from '@Field affectedItemPaths'
    - check result (expected: 'Results: 0')
    @Field dryRun = true
*/

import groovy.transform.Field
import groovy.json.JsonSlurper
import java.net.HttpURLConnection
import java.net.URL

@Field dryRun = true
@Field contentScope = "/content/dhl"
@Field publishEnvHost = "https://publish-p58772-e528780.adobeaemcloud.com"

@Field affectedItemPaths = [

]

@Field versionAndPackageName = "DIS-708-unpublish-not-existing-on-author"

main()

/* Methods */

// main
def main() {
    affectedItemPaths = getAffectedItemPaths()
    if (dryRun) {
        showAffectedItems(affectedItemPaths)
    } else {
        createBackupPackage(affectedItemPaths)
    }
}

def getAllPagesOnPublishEnv() {
    def url = new URL(publishEnvHost + "/content/dhl/jcr:content.published-pages.json")
    HttpURLConnection connection = (HttpURLConnection) url.openConnection()
    connection.setRequestMethod("GET")
    connection.setRequestProperty("Accept", "application/json")

    int responseCode = connection.getResponseCode()

    def responseArray = []
    if (responseCode == HttpURLConnection.HTTP_OK) {
        BufferedReader input = new BufferedReader(new InputStreamReader(connection.getInputStream()))
        String inputLine
        StringBuffer response = new StringBuffer()

        while ((inputLine = input.readLine()) != null) {
            response.append(inputLine)
        }
        input.close()

        // Parse the JSON response
        def jsonSlurper = new JsonSlurper()
        responseArray = jsonSlurper.parseText(response.toString())
    } else {
        println("GET request failed")
    }
    connection.disconnect()

    return responseArray
}

def getAffectedItemPaths() {
    def paths = []
    if (affectedItemPaths.size() == 0) {
        getAllPagesOnPublishEnv().each { pagePath ->
            if (!getPage(pagePath)) {
                paths.add(pagePath)
            }
        }

        return paths
    } else {
        return affectedItemPaths
    }
}

def showAffectedItems(affectedItemPaths) {
    println("Affected items: " + affectedItemPaths.size())
    if (affectedItemPaths.size() > 0) {
        affectedItemPaths.each({ println(""""$it",""") })
    }
}


@Field packagesPath = "/etc/packages/my_packages"
@Field packageDefinitionPath = "$packagesPath/${versionAndPackageName}.zip/jcr:content/vlt:definition"

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