/* DIS-541 Marketo components

Steps:
0)  INITIAL SETUP
    - define scope

    def MARKET = "/content/dhl/global"                                      // specify the country
    def MARKETO_COMPONENT = ALL_MARKETO_COMPONENTS.marketoForm              // specify the Marketo component

1)  BEFORE:
    - show Marketo components before update

    def SHOW_ONLY = true
    def CONTENT_MANIPULATION = false

2)  BACKUP:
    - create a backup package of the pages that will be affected
    - update the version of each page that will be affected

    def DRY_RUN = true / false                                              // new Versions are not created in DRY RUN mode
    def SHOW_ONLY = false
    def CONTENT_MANIPULATION = false

3)  MANIPULATION:
    - update Marketo components property
    - publish affected pages that was published

    def DRY_RUN = true / false
    def SHOW_ONLY = false
    def CONTENT_MANIPULATION = true

    def MARKETO_COMPONENT_PROPERTY = MARKETO_COMPONENT.marketoHiddenFormId  // specify the Marketo component property
    def MARKETO_COMPONENT_PROPERTY_VALUE = "1756"                           // specify the Marketo component property value

4)  AFTER:
    - show Marketo components after update

    def SHOW_ONLY = true
    def CONTENT_MANIPULATION = false

FILTERS:
    Filters allows users to apply conditional filtering to retrieved components.
    By setting the USE_FILTERS flag, users can control whether filtering should be applied.
    When enabled, filters defined in the FILTERS collection are sequentially applied to each component.
    If a component fails to pass any filter condition, it is excluded from the final result.

    EXAMPLES:
    - get components without configured hidden id and with marketo form id 1795
    def FILTERS = [
        (node) -> !node.hasProperty(MARKETO_COMPONENT.marketoHiddenFormId) || node.getProperty(MARKETO_COMPONENT.marketoHiddenFormId).getString().isBlank(),
        (node) -> node.getProperty(MARKETO_COMPONENT.marketoFormId).getString().equals("1795"),
    ]

    - exclude components under open-an-account page
    def FILTERS = [
        (node) -> !(node.getPath() ==~ /\/content\/dhl\/.*\/open-an-account\/jcr:content\/.+/)
    ]
*/

import java.text.SimpleDateFormat;

def ALL_MARKETO_COMPONENTS = [
        "marketoForm": [
                "resType": "dhl/components/content/marketoForm",
                "marketoFormId": "marketoformid",
                "marketoHiddenFormId": "marketohiddenformid",
                "marketoId": "marketoid",
                "marketoHost": "marketohost",
        ],
        "subscribepanel": [
                "resType": "dhl/components/content/subscribepanel",
                "marketoFormId": "marketoFormId",
                "marketoHiddenFormId": "hiddenMarketoId",
                "marketoId": "marketoMunchkinId",
                "marketoHost": "marketoHostname",
        ],
        "download": [
                "resType": "dhl/components/content/download",
                "marketoFormId": "marketoFormId",
                "marketoHiddenFormId": "hiddenMarketoId",
                "marketoId": "marketoMunchkinId",
                "marketoHost": "marketoHostname",
        ],
]

def DRY_RUN = true
def SHOW_ONLY = true
def CONTENT_MANIPULATION = false
def MARKET = "/content/dhl/global"
def MARKETO_COMPONENT = ALL_MARKETO_COMPONENTS.marketoForm
def MARKETO_COMPONENT_PROPERTY = MARKETO_COMPONENT.marketoHiddenFormId
def MARKETO_COMPONENT_PROPERTY_VALUE = "1756"
def USE_FILTERS = false

def FILTERS = [
        (node) -> node.hasProperty(MARKETO_COMPONENT.marketoHiddenFormId),
        (node) -> node.getProperty(MARKETO_COMPONENT.marketoHiddenFormId).getString().equals("6310"),
]

def getComponents(market, componentResourceType, useFilters, filters) {
    def allComponents = sql2Query("SELECT * FROM [nt:unstructured] AS node WHERE ISDESCENDANTNODE([${market}]) and (node.[sling:resourceType]='${componentResourceType}')")
    if (!useFilters) {
        return allComponents;
    }

    return allComponents.findAll { component ->
        filters.every { filter ->
            filter(component)
        }
    }
}

def showMarketoComponents(market, marketoComponent, useFilters, filters) {
    def data = []

    getComponents(market, marketoComponent.resType, useFilters, filters).each { node ->
        data.add([
                node.path,
                node.hasProperty("${marketoComponent.marketoFormId}") ? node.getProperty("${marketoComponent.marketoFormId}").getString() : '',
                node.hasProperty("${marketoComponent.marketoHiddenFormId}") ? node.getProperty("${marketoComponent.marketoHiddenFormId}").getString() : '',
                node.hasProperty("${marketoComponent.marketoId}") ? node.getProperty("${marketoComponent.marketoId}").getString() : '',
                node.hasProperty("${marketoComponent.marketoHost}") ? node.getProperty("${marketoComponent.marketoHost}").getString() : ''
        ])
    }

    table {
        columns("Component Path", "Marketo Form ID", "Marketo Hidden Form ID", "Marketo ID (Munchkin ID)", "Marketo Host")
        rows(data)
    }
}

def setMarketoComponentProperty(market, marketoComponent, marketoComponentProperty, marketoComponentPropertyValue, dryRun, useFilters, filters) {
    getComponents(market, marketoComponent.resType, useFilters, filters).each { node ->
        aecu.contentUpgradeBuilder()
                .forResources((String[])[node.path])
                .doSetProperty(marketoComponentProperty, marketoComponentPropertyValue)
                .doActivateResource()
                .run(dryRun)
    }
}
def getListAffectedPages(market, marketoComponent, useFilters, filters) {
    def listPages = []
    def pageUtilService = getService("com.dhl.discover.core.services.PageUtilService")

    getComponents(market, marketoComponent.resType, useFilters, filters).each { node ->
        listPages.add(pageUtilService.getPage(getResource(node.path)).path)
    }

    return listPages;
}

def setNewPageVersion(listPages, versionName, dryRun) {
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
                if (revision.getLabel().contains(versionName)) {
                    isVersionExist = true
                    println('(!) INFO: Page Version already exists')
                    return false
                }
            })

            if (!isVersionExist) {
                def date = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss.SSS").format(new Date());
                def label = String.format("%s - %s", versionName, date);

                if (!dryRun) {
                    pageManager.createRevision(page, label, "Groovy Script version");
                }
                println('(!) INFO: New Page Version was created')
            }
        })
    }
}

def republishPages(listPages, dryRun) {
    def wrongPaths = []
    def notPublished = []

    def filtered = listPages.stream()
            .map(path -> path + "/jcr:content")
            .filter(path -> {
                if(getResource(path) == null) {
                    wrongPaths.add(path)
                    println("(!) Page doesn't exist " + path)
                    return false
                }

                def node = getNode(path)

                if(!node.hasProperty("cq:lastReplicationAction") || !node.getProperty("cq:lastReplicationAction").getString().equals("Activate")) {
                    notPublished.add(path)
                    println("(!) Skip page republication for unpablished page ${path} ")
                    return false
                }

                return true
            }).toList()

    filtered.each({
        aecu.contentUpgradeBuilder().forResources((String[])[it])
                .doActivateResource()
                .run(dryRun)
    })
}

def printFiltersForBackupPackage(listPages) {
    println("Results: " + listPages.size())
    if (listPages.size() > 0) {
        println("(!) Use this list of pages for preparing package:")
        listPages.each({ println("""<filter root="$it/jcr:content"/>""")})
    }
}

// MAIN
if (SHOW_ONLY) {
    showMarketoComponents(MARKET, MARKETO_COMPONENT, USE_FILTERS, FILTERS)
} else {
    def listAffectedPages = getListAffectedPages(MARKET, MARKETO_COMPONENT, USE_FILTERS, FILTERS)
    if (CONTENT_MANIPULATION) {
        setMarketoComponentProperty(MARKET, MARKETO_COMPONENT, MARKETO_COMPONENT_PROPERTY, MARKETO_COMPONENT_PROPERTY_VALUE, DRY_RUN, USE_FILTERS, FILTERS)
        republishPages(listAffectedPages, DRY_RUN)
    } else {
        printFiltersForBackupPackage(listAffectedPages)
        setNewPageVersion(listAffectedPages, "DIS-541 Marketo components", DRY_RUN)
    }
}
