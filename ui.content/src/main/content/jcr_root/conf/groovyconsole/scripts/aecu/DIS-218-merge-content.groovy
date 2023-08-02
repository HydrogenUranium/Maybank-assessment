boolean DRY_RUN = true

def MERGING_CONTENT_MAPPING = [
        ["sourceContentBranch" : "/content/dhl/en-master", "targetContentBranch" : "/content/dhl/language-masters/en-master"],
        ["sourceContentBranch" : "/content/dhl/en-global", "targetContentBranch" : "/content/dhl/global/en-global"],
        ["sourceContentBranch" : "/content/dhl/en-au", "targetContentBranch" : "/content/dhl/au/en-au"],
        ["sourceContentBranch" : "/content/dhl/en-in", "targetContentBranch" : "/content/dhl/in/en-in"],
        ["sourceContentBranch" : "/content/dhl/en-id", "targetContentBranch" : "/content/dhl/id/en-id"],
        ["sourceContentBranch" : "/content/dhl/en-hk", "targetContentBranch" : "/content/dhl/hk/en-hk"],
        ["sourceContentBranch" : "/content/dhl/en-my", "targetContentBranch" : "/content/dhl/my/en-my"],
        ["sourceContentBranch" : "/content/dhl/en-nz", "targetContentBranch" : "/content/dhl/nz/en-nz"],
        ["sourceContentBranch" : "/content/dhl/en-it", "targetContentBranch" : "/content/dhl/it/en-it"],
        ["sourceContentBranch" : "/content/dhl/en-ph", "targetContentBranch" : "/content/dhl/ph/en-ph"],
        ["sourceContentBranch" : "/content/dhl/en-sg", "targetContentBranch" : "/content/dhl/sg/en-sg"],
        ["sourceContentBranch" : "/content/dhl/en-us", "targetContentBranch" : "/content/dhl/us/en-us"],
        ["sourceContentBranch" : "/content/dhl/ms-my", "targetContentBranch" : "/content/dhl/ms/ms-my"],
        ["sourceContentBranch" : "/content/dhl/zh-sg", "targetContentBranch" : "/content/dhl/sg/zh-sg"],
]

MERGING_CONTENT_MAPPING.each{
    def sourceContentBranch = it.sourceContentBranch
    def targetContentBranch = it.targetContentBranch
    if (getResource(sourceContentBranch) != null && getResource(targetContentBranch) != null) {
        aecu.contentUpgradeBuilder()
                .forDescendantResourcesOf(it.sourceContentBranch)
                .filterByProperty("jcr:primaryType", "cq:Page")
                .doCustomResourceBasedAction({
                    sourceContentPage ->
                        def sourceContentPagePath = sourceContentPage.path
                        def targetContentPagePath = sourceContentPagePath.replace(sourceContentBranch, targetContentBranch)
                        if (getResource(targetContentPagePath) == null) {
                            if (!DRY_RUN) {
                                session.workspace.copy(sourceContentPagePath,targetContentPagePath)
                                activate(targetContentPagePath)
                            }
                            println "Copied ${sourceContentPagePath} to ${targetContentPagePath} and activated"
                        }
                })
                .run(DRY_RUN)
    }
}