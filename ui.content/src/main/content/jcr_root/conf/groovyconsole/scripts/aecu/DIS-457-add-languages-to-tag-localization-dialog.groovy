/* DIS-457 Update Localization Languages of Tags: BEFORE

Steps:
1)  BEFORE:
    - show Localization Languages of Tags before update

    def SHOW_LOCALIZATION_LANGUAGES = true
    def CONTENT_MANIPULATION = false

2)  BACKUP:
    - create a BackUp package

    def SHOW_LOCALIZATION_LANGUAGES = false
    def CONTENT_MANIPULATION = false

3)  MANIPULATION:
    - update Localization Languages of Tags

    def DRY_RUN = true / false
    def SHOW_LOCALIZATION_LANGUAGES = false
    def CONTENT_MANIPULATION = true

4)  AFTER:
    - show Localization Languages of Tags after update

    def SHOW_LOCALIZATION_LANGUAGES = true
    def CONTENT_MANIPULATION = false
*/

def DRY_RUN = true
def SHOW_LOCALIZATION_LANGUAGES = true
def CONTENT_MANIPULATION = false

def showLocalizationLanguagesOfTags() {
    def languages = getNode("/content/cq:tags").getProperty("languages").getValues()

    println("Localization Languages of Tags: " + languages.size())
    if (languages.size() > 0) {
        languages.each({ println(it)})
    }
}

def printFiltersForBackupPackage() {
    println("Results: 1")
    println("(!) Use this list for preparing package:")
    println("""<filter root="/content/cq:tags"/>""")
}

def getHomePageLanguages() {
    def getHomePageJcrContents = """
            SELECT jcrContent.* FROM [nt:base] AS jcrContent
            INNER JOIN [cq:Page] AS countryHomePage ON ISCHILDNODE(jcrContent, countryHomePage)
            INNER JOIN [cq:Page] AS countryRootPage ON ISCHILDNODE(countryRootPage, countryHomePage)
            WHERE ISCHILDNODE(countryRootPage, '/content/dhl')
            AND NAME(jcrContent) = 'jcr:content'
            AND jcrContent.[sling:resourceType] = 'dhl/components/pages/editable-home-page'
            AND jcrContent.[jcr:language] IS NOT NULL OR jcrContent.[jcr:language] <> ''
        """
    def getHomePageJcrContentsByQuery = session.getWorkspace().getQueryManager().createQuery(getHomePageJcrContents, 'JCR-SQL2')
    return getHomePageJcrContentsByQuery
            .execute()
            .getNodes()
            .collect{it.getProperty("jcr:language").getValue()}
            .sort()
            .unique()
}

def contentManipulation(dryRun) {
    println("Localization Languages of Tags where updated: ")

    aecu.contentUpgradeBuilder()
            .forResources((String[])["/content/cq:tags"])
            .doDeleteProperty("languages")
            .doAddValuesToMultiValueProperty("languages", (String[]) getHomePageLanguages())
            .doActivateResource()
            .run(dryRun)
}

// MAIN
if (SHOW_LOCALIZATION_LANGUAGES) {
    showLocalizationLanguagesOfTags()
} else {
    if (CONTENT_MANIPULATION) {
        contentManipulation(DRY_RUN)
    } else {
        printFiltersForBackupPackage()
    }
}