import org.apache.http.client.methods.HttpPost
import org.apache.http.impl.client.CloseableHttpClient
import org.apache.http.impl.client.HttpClients
import org.apache.http.entity.StringEntity
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import groovy.transform.Field

@Field SUBSCRIPTION_KEY = "<your-subscription-key>" //add your subscription key here !!!
@Field REGION = "westeurope"

// Contains a list of words/phrases that will be added to the Dictionary
def LIST = [
        "Contact Us",
        "Close",
        "Open"
]
// A map to store dictionary with placeholders by language
def DICTIONARY = [:]
def getHomePages() {
    def homePagesQuery = """
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('/content/dhl')
        AND node.[sling:resourceType] = 'dhl/components/pages/editable-home-page'
    """
    return sql2Query(homePagesQuery)
}

def translateTerms(terms, fromLang, toLang) {
    def endpoint = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${fromLang}&to=${toLang}"

    // Prepare the JSON request body
    def requestBody = JsonOutput.toJson(terms.collect { [Text: it] })

    CloseableHttpClient client = HttpClients.createDefault()
    HttpPost request = new HttpPost(endpoint)
    request.addHeader("Ocp-Apim-Subscription-Key", SUBSCRIPTION_KEY)
    request.addHeader("Ocp-Apim-Subscription-Region", REGION)
    request.addHeader("Content-Type", "application/json")
    request.setEntity(new StringEntity(requestBody, "UTF-8"))

    def response = client.execute(request)
    def responseText = response.getEntity().getContent().getText("UTF-8")
    def jsonResponse = new JsonSlurper().parseText(responseText)
    // Extract and return translated terms
    def translatedTerms = jsonResponse.collect { it.translations[0].text }
    client.close()
    return translatedTerms
}
getHomePages().stream()
        .map { node ->
            def pagePath = node.getParent().getPath()
            def language = getPage(pagePath).getLanguage().toLanguageTag()
            return language
        }
        .toSet()
        .each { language ->
            // Translate placeholders
            def translatedList = translateTerms(LIST, "en", language)
            // Create dictionary with translated terms
            DICTIONARY[language] = [ : ]  // Initialize an empty map
            LIST.withIndex().each { key, index ->
                DICTIONARY[language][key] = translatedList[index]
            }
        }
def formatMap(map, separator = ",\n") {
    if (!(map instanceof Map)) {
        return "\"${map}\"" // If not a map, simply return the value as a quoted string
    }

    return "[" + map.collect { key, value ->
        def formattedValue = formatMap(value, ", ") // Recursively format nested maps
        "\"${key}\": ${formattedValue}"
    }.join(separator) + "]"
}
println formatMap(DICTIONARY)