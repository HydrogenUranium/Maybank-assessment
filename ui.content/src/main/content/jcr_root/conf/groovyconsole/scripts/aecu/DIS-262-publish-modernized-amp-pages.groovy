/* DIS-262 Publish pages
Steps:

0)  INITIAL SETUP
    - define scope, set list of affected pages from this script: DIS-262-preparing-for-modernization.groovy
    def PAGES = [
        "/apps/dhl/templates/dhl-amp-article-page",
    ]

1)  MANIPULATION:
    - publish pages
    def DRY_RUN = true / false
    def SKIP_DEACTIVATED = true

*/

def DRY_RUN = true
def SKIP_DEACTIVATED = true     // activates the page that contains the current resource AND all subpages. If "SKIP_DEACTIVATED" is set to true then deactivated pages will be ignored and not activated

def PAGES = [
        "/apps/dhl/templates/dhl-amp-article-page",
]

PAGES.each { pagePath ->
    aecu.contentUpgradeBuilder()
            .forResources((String[])[pagePath])
            .doTreeActivateContainingPage(SKIP_DEACTIVATED)
            .run(DRY_RUN)
}
