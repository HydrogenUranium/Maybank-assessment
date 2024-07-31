// DIS-660 Sitemap Content Setup

import groovy.transform.Field

@Field dryRun = true

println ">>> "
println ">>> Removed all 'sling:sitemapRoot' properties"
println ">>> "
getPage("/content/dhl").recurse { page ->
    def hasSitemapRootProperty = page.node?.get('sling:sitemapRoot')
    if (hasSitemapRootProperty) {
        aecu.contentUpgradeBuilder()
                .forResources((String[]) [page.node.path])
                .doDeleteProperty("sling:sitemapRoot")
                .run(dryRun)

        aecu.contentUpgradeBuilder()
                .forResources((String[]) [page.node.path])
                .filterByProperty("cq:lastReplicationAction", "Activate")
                .doActivateContainingPage()
                .run(dryRun)

        aecu.contentUpgradeBuilder()
                .forResources((String[]) [page.node.path])
                .filterByProperty("cq:lastReplicationAction", "Deactivate")
                .doDeactivateContainingPage()
                .run(dryRun)
    }
}

println ">>> "
println ">>> Set 'sling:sitemapRoot' properties on Home pages (Root Language Country pages)"
println ">>> "
aecu.contentUpgradeBuilder()
        .forChildResourcesOf("/content/dhl")
        .filterByNotNodeName("Archive")
        .filterByNotNodeName("language-masters")
        .filterByNotNodeName("jcr:content")
        .filterByNotNodeName("rep:policy")
        .doCustomResourceBasedAction({ rootCountryPage -> // Root Country pages: /content/dhl/global, /content/dhl/be, /content/dhl/fr ...
            aecu.contentUpgradeBuilder()
                    .forChildResourcesOf(rootCountryPage.path)
                    .filterByNotNodeName("jcr:content")
                    .filterByNotNodeName("rep:policy")
                    .doCustomResourceBasedAction({ languageCountryPage -> // Root Language Country pages: /content/dhl/global/en-global, /content/dhl/be/en-be, /content/dhl/fr/fr-fr ...
                        def languageCountryContentPagePath = languageCountryPage.path + "/jcr:content"

                        aecu.contentUpgradeBuilder()
                                .forResources((String[]) [languageCountryContentPagePath])
                                .filterByProperty("cq:template", "/conf/dhl/settings/wcm/templates/home-page")
                                .doSetProperty("sling:sitemapRoot", "true")
                                .run(dryRun)

                        aecu.contentUpgradeBuilder()
                                .forResources((String[]) [languageCountryContentPagePath])
                                .filterByProperty("cq:template", "/conf/dhl/settings/wcm/templates/home-page")
                                .filterByProperty("cq:lastReplicationAction", "Activate")
                                .doActivateContainingPage()
                                .run(dryRun)

                        aecu.contentUpgradeBuilder()
                                .forResources((String[]) [languageCountryContentPagePath])
                                .filterByProperty("cq:template", "/conf/dhl/settings/wcm/templates/home-page")
                                .filterByProperty("cq:lastReplicationAction", "Deactivate")
                                .doDeactivateContainingPage()
                                .run(dryRun)

                    })
                    .run(dryRun)
        })
        .run(dryRun)

aecu.contentUpgradeBuilder()
        .forResources((String[]) ['/content/dhl/jcr:content'])
        .doSetProperty("sling:sitemapRoot", "true")
        .doActivateContainingPage()
        .run(dryRun)
