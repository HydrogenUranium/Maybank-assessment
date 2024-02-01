/* DIS-541 Show Marketo components

Steps:

1) Use MARKET variable to specify the country in which the search will be performed, for example:
def MARKET = "/content/dhl/global" // to search in Global branch only

2) Use MARKETO_COMPONENT variable to specify the Marketo Component, for example:
def MARKETO_COMPONENT = allMarketoComponents.marketoForm // to find Marketo Form component
or
def MARKETO_COMPONENT = allMarketoComponents.subscribepanel // to find Subscribe Panel component
or
def MARKETO_COMPONENT = allMarketoComponents.download // to find Download component
*/


def allMarketoComponents = [
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

def MARKET = "/content/dhl/global"
def MARKETO_COMPONENT = allMarketoComponents.marketoForm

def data = []

def components = sql2Query("SELECT * FROM [nt:unstructured] AS node WHERE ISDESCENDANTNODE([${MARKET}]) and (node.[sling:resourceType]='${MARKETO_COMPONENT.resType}')")
components.each { resource ->
    data.add([
            resource.path,
            resource.hasProperty("${MARKETO_COMPONENT.marketoFormId}") ? resource.getProperty("${MARKETO_COMPONENT.marketoFormId}").getString() : '',
            resource.hasProperty("${MARKETO_COMPONENT.marketoHiddenFormId}") ? resource.getProperty("${MARKETO_COMPONENT.marketoHiddenFormId}").getString() : '',
            resource.hasProperty("${MARKETO_COMPONENT.marketoId}") ? resource.getProperty("${MARKETO_COMPONENT.marketoId}").getString() : '',
            resource.hasProperty("${MARKETO_COMPONENT.marketoHost}") ? resource.getProperty("${MARKETO_COMPONENT.marketoHost}").getString() : ''
    ])
}

table {
    columns("Component Path", "Marketo Form ID", "Marketo Hidden Form ID", "Marketo ID (Munchkin ID)", "Marketo Host")
    rows(data)
}