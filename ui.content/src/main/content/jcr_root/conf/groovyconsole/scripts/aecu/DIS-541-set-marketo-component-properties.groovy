/* DIS-541 Marketo components

Steps:
0)  INITIAL SETUP
    - define scope

    def MARKET = "/content/dhl/global"                                      // specify the country

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

    def DRY_RUN = true / false
    def SHOW_ONLY = false
    def CONTENT_MANIPULATION = true

    def MARKETO_COMPONENT = ALL_MARKETO_COMPONENTS.marketoForm              // specify the Marketo component
    def MARKETO_COMPONENT_PROPERTY = MARKETO_COMPONENT.marketoHiddenFormId  // specify the Marketo component property
    def MARKETO_COMPONENT_PROPERTY_VALUE = "1756"                           // specify the Marketo component property value

4)  AFTER:
    - show Marketo components after update

    def SHOW_ONLY = true
    def CONTENT_MANIPULATION = false
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

def getComponents(market, componentResourceType) {
    return sql2Query("SELECT * FROM [nt:unstructured] AS node WHERE ISDESCENDANTNODE([${market}]) and (node.[sling:resourceType]='${componentResourceType}')")
}

def showMarketoComponents(market, marketoComponent) {
    def data = []

    getComponents(market, marketoComponent.resType).each { node ->
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

def setMarketoComponentProperty(market, marketoComponent, marketoComponentProperty, marketoComponentPropertyValue, dryRun) {
    getComponents(market, marketoComponent.resType).each { node ->
        aecu.contentUpgradeBuilder()
                .forResources((String[])[node.path])
                .doSetProperty(marketoComponentProperty, marketoComponentPropertyValue)
                .doActivateResource()
                .run(dryRun)
    }
}
def getListAffectedPages(market, marketoComponent) {
    def listPages = []
    def pageUtilService = getService("com.positive.dhl.core.services.PageUtilService")

    getComponents(market, marketoComponent.resType).each { node ->
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

def printFiltersForBackupPackage(listPages) {
    println("Results: " + listPages.size())
    if (listPages.size() > 0) {
        println("(!) Use this list of pages for preparing package:")
        listPages.each({ println("""<filter root="$it/jcr:content"/>""")})
    }
}

// MAIN
if (SHOW_ONLY) {
    showMarketoComponents(MARKET, MARKETO_COMPONENT)
} else {
    if (CONTENT_MANIPULATION) {
        setMarketoComponentProperty(MARKET, MARKETO_COMPONENT, MARKETO_COMPONENT_PROPERTY, MARKETO_COMPONENT_PROPERTY_VALUE, DRY_RUN)
    } else {
        def listAffectedPages = getListAffectedPages(MARKET, MARKETO_COMPONENT)
        printFiltersForBackupPackage(listAffectedPages)
        setNewPageVersion(listAffectedPages, "DIS-541 Marketo components", DRY_RUN)
    }
}
