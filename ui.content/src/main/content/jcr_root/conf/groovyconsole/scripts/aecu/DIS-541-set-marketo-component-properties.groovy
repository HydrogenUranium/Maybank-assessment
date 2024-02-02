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
    - create a BackUp package

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
def SHOW_ONLY = false
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

def printFiltersForBackupPackage(market, marketoComponent) {
    def listPagePaths = []
    def pageUtilService = getService("com.positive.dhl.core.services.PageUtilService")

    getComponents(market, marketoComponent.resType).each { node ->
        listPagePaths.add(pageUtilService.getPage(getResource(node.path)).path)
    }

    println("Results: " + listPagePaths.size())
    if (listPagePaths.size() > 0) {
        println("(!) Use this list of pages for preparing package:")
        listPagePaths.each({ println("""<filter root="$it/jcr:content"/>""")})
    }
}

// MAIN
if (SHOW_ONLY) {
    showMarketoComponents(MARKET, MARKETO_COMPONENT)
} else {
    if (CONTENT_MANIPULATION) {
        setMarketoComponentProperty(MARKET, MARKETO_COMPONENT, MARKETO_COMPONENT_PROPERTY, MARKETO_COMPONENT_PROPERTY_VALUE, DRY_RUN)
    } else {
        printFiltersForBackupPackage(MARKET, MARKETO_COMPONENT)
    }
}
