import groovy.transform.Field
import java.util.regex.Pattern

@Field DRY_RUN = true

@Field COOKIE_LABEL = "Cookie Settings"
@Field SCOPE = "/content/experience-fragments"
@Field LINK_PATH = "#cookiepref"

// Query to find all footer components
@Field QUERY = """
SELECT * FROM [nt:unstructured] as node
WHERE ISDESCENDANTNODE(node, '${SCOPE}')
AND node.[sling:resourceType] = 'dhl/components/content/footer'
"""

// Statistics tracking
def footersChecked = 0
def footersWithCompanyLinks = 0
def footersWithCookieLink = 0
def footersModified = 0
def filteredPath = []
def wrongPaths = []
def notPublished = []

@Field DICTIONARY = [
"en-IE": ["Cookie Settings": "Cookie Settings"],
"en-US": ["Cookie Settings": "Cookie Settings"],
"pt": ["Cookie Settings": "Configurações de cookies"],
"en-MM": ["Cookie Settings": "Cookie Settings"],
"en-IL": ["Cookie Settings": "Cookie Settings"],
"en-IN": ["Cookie Settings": "Cookie Settings"],
"en-ZA": ["Cookie Settings": "Cookie Settings"],
"nl-BE": ["Cookie Settings": "Cookie-instellingen"],
"zh-CN": ["Cookie Settings": "Cookie 设置"],
"hu": ["Cookie Settings": "Cookie beállítások"],
"en-IT": ["Cookie Settings": "Cookie Settings"],
"en-MY": ["Cookie Settings": "Cookie Settings"],
"en-ES": ["Cookie Settings": "Cookie Settings"],
"en-AT": ["Cookie Settings": "Cookie Settings"],
"en-AU": ["Cookie Settings": "Cookie Settings"],
"id": ["Cookie Settings": "Pengaturan Cookie"],
"en-NG": ["Cookie Settings": "Cookie Settings"],
"en-VN": ["Cookie Settings": "Cookie Settings"],
"de-CH": ["Cookie Settings": "Cookie-Einstellungen"],
"en-BD": ["Cookie Settings": "Cookie Settings"],
"en": ["Cookie Settings": "Cookie Settings"],
"it": ["Cookie Settings": "Impostazioni dei cookie"],
"en-JP": ["Cookie Settings": "Cookie Settings"],
"es": ["Cookie Settings": "Configuración de cookies"],
"zh": ["Cookie Settings": "Cookie 设置"],
"fr-CA": ["Cookie Settings": "Paramètres des témoins"],
"en-NZ": ["Cookie Settings": "Cookie Settings"],
"vi": ["Cookie Settings": "Cài đặt cookie"],
"fr-BE": ["Cookie Settings": "Paramètres des cookies"],
"ja": ["Cookie Settings": "Cookieの設定"],
"en-SG": ["Cookie Settings": "Cookie Settings"],
"it-CH": ["Cookie Settings": "Impostazioni dei cookie"],
"fr-FR": ["Cookie Settings": "Paramètres des cookies"],
"en-GB": ["Cookie Settings": "Cookie Settings"],
"en-KE": ["Cookie Settings": "Cookie Settings"],
"en-KH": ["Cookie Settings": "Cookie Settings"],
"en-CA": ["Cookie Settings": "Cookie Settings"],
"en-CH": ["Cookie Settings": "Cookie Settings"],
"en-KR": ["Cookie Settings": "Cookie Settings"],
"ar-AE": ["Cookie Settings": "إعدادات ملفات تعريف الارتباط"],
"en-CN": ["Cookie Settings": "Cookie Settings"],
"de-AT": ["Cookie Settings": "Cookie-Einstellungen"],
"fr-CH": ["Cookie Settings": "Paramètres des cookies"],
"sk": ["Cookie Settings": "Nastavenia súborov cookie"],
"en-TH": ["Cookie Settings": "Cookie Settings"],
"en-CZ": ["Cookie Settings": "Cookie Settings"],
"en-PH": ["Cookie Settings": "Cookie Settings"],
"en-PK": ["Cookie Settings": "Cookie Settings"],
"en-LK": ["Cookie Settings": "Cookie Settings"],
"zh-HK": ["Cookie Settings": "Cookie設置"],
"zh-TW": ["Cookie Settings": "Cookie 設置"],
"pt-BR": ["Cookie Settings": "Configurações de cookies"],
"ko-KR": ["Cookie Settings": "쿠키 설정"],
"en-HK": ["Cookie Settings": "Cookie Settings"],
"en-TW": ["Cookie Settings": "Cookie Settings"],
"en-PT": ["Cookie Settings": "Cookie Settings"],
"en-DK": ["Cookie Settings": "Cookie Settings"],
"cs": ["Cookie Settings": "Nastavení souborů cookie"],
"th": ["Cookie Settings": "การตั้งค่าคุกกี้"],
"sv-SE": ["Cookie Settings": "Cookie-inställningar"],
"da-DK": ["Cookie Settings": "Cookie-indstillinger"],
"he": ["Cookie Settings": "הגדרות קובצי Cookie"],
"en-ID": ["Cookie Settings": "Cookie Settings"]
]

def getLocale(resource) {
    def path = resource.getPath();
    if(path.startsWith("/content/experience-fragments")) {
        path = path.replace("/experience-fragments", "")
        def regex = "^((?:[^/]*\\/){4}[^/]*)";
        def pattern = Pattern.compile(regex);
        def matcher = pattern.matcher(path);
        path = matcher.find() ? matcher.group(1) : path
    }
    path = path.replaceAll('/jcr:content.*', "")
    def page = getPage(path)

    if (page == null){
        println """Page is not found: ${path}"""
        return new Locale("en");
    }

    return page.getLanguage();
}

def translate(phrase, locale) {
    def localeString = locale.toString();
    def language = locale.getLanguage();
    if(DICTIONARY.containsKey(localeString) && DICTIONARY[localeString].containsKey(phrase)) {
        return DICTIONARY[localeString][phrase];
    } else if (DICTIONARY.containsKey(language) && DICTIONARY[language].containsKey(phrase)) {
        return DICTIONARY[language][phrase];
    } else {
        return phrase;
    }
}

// Process each footer component
sql2Query(QUERY).each { footer ->
    footersChecked++
    def footerPath = footer.path
    println "Checking footer: ${footerPath}"

    def hasCookieLink = false
    def companyLinks = null

    // Check if footer has companyLinks node
    if (footer.hasNode("companyLinks")) {
        companyLinks = footer.getNode("companyLinks")
        footersWithCompanyLinks++
        println "  Found companyLinks at: ${companyLinks.path}"

        // Check if any item has "Cookie" linkName
        companyLinks.getNodes().each { item ->
            if (item.hasProperty("linkName")) {
                def linkName = item.getProperty("linkName").getString()
                if (linkName.toLowerCase().contains("cookie")) {
                    hasCookieLink = true
                    footersWithCookieLink++
                    println "  ✓ Found Cookie link: ${linkName} at ${item.path}"
                }
            }
        }
        filteredPath.push(footerPath.split('/root/footer')[0])
    } else {
        // CompanyLinks node doesn't exist
        println "  ✗ No companyLinks found in this footer"
        if (!DRY_RUN) {
            // Create companyLinks node if it doesn't exist
            companyLinks = footer.addNode("companyLinks", "nt:unstructured")
            println "  + Created companyLinks node"
        }
    }

    // If no cookie link was found, add one
    if (!hasCookieLink) {
        println "  ✗ No Cookie link found in companyLinks"

        if (companyLinks != null || !DRY_RUN) {
            // Get translated value for Cookie Settings
            def locale = getLocale(footer)
            def translatedValue = translate(COOKIE_LABEL, locale)

            if (!DRY_RUN) {
                // Find the next available item number
                def itemNumber = 0
                if (companyLinks.hasNodes()) {
                    def itemNames = []
                    companyLinks.getNodes().each { itemNames << it.name }

                    // Find the highest item number
                    itemNames.each { name ->
                        if (name.startsWith("item")) {
                            def num = name.substring(4).toInteger()
                            if (num >= itemNumber) {
                                itemNumber = num + 1
                            }
                        }
                    }
                }

                // Create new item
                def newItem = companyLinks.addNode("item" + itemNumber, "nt:unstructured")
                newItem.setProperty("linkName", translatedValue)
                newItem.setProperty("linkPath", LINK_PATH)

                println "  + Added new Cookie Settings link: ${translatedValue} as item${itemNumber}"
                footersModified++

                //filteredPath.push(footerPath)
            } else {
                println "  + Would add new Cookie Settings link: ${translatedValue} (DRY RUN)"
            }
        }
    }

    // Save changes if not in dry run
    if(!DRY_RUN) {
        save()
    } else {
        session.refresh(false)
    }
}

def getJcrContent(path) {
    return pageManager.getContainingPage(path).getContentResource();
}

def isPublished(path) {
    def resource = getJcrContent(path)
    def valueMap = resource.getValueMap()
    def status = valueMap.get('cq:lastReplicationAction_publish', valueMap.get('cq:lastReplicationAction', ''))
    return status.equals('Activate')
}

def filtered = filteredPath.stream()
        .filter(path -> {
            if(getResource(path) == null) {
                wrongPaths.add(path)
                return false
            }
            if(!isPublished(path)) {
                notPublished.add(path)
                return false;
            }
            return true
        }).toList()

println("""Wrong paths: ${wrongPaths.size()}""")
println("""Not published: ${notPublished.size()}""")
println("""Pages to publish: ${filtered.size()}""")

def replicator = getService("com.day.cq.replication.Replicator")


filtered.each({ path ->
    if (!DRY_RUN) {
        try {
            def session = resourceResolver.adaptTo(Session)
            if (session != null) {
                replicator.replicate(session, ReplicationActionType.ACTIVATE, path)
                println("Successfully published: ${path}")
            } else {
                println("Failed to adapt resourceResolver to Session")
            }
        } catch (Exception e) {
            println("Replication failed for ${path}: ${e.message}")
        }
    }
})

// Print summary
println "\n===== SUMMARY ====="
println "Total footers checked: ${footersChecked}"
println "Footers with companyLinks: ${footersWithCompanyLinks}"
println "Footers with Cookie links: ${footersWithCookieLink}"
println "Footers modified (added Cookie link): ${footersModified}"
println "DRY RUN: ${DRY_RUN}"
println "filterd path: ${filteredPath}"