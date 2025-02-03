boolean DRY_RUN = true

aecu.contentUpgradeBuilder()
    .forDescendantResourcesOf("/content/dhl/us/en-us")
    .filterByProperty("linkURL", "/content/dhl/us/en-us/open-an-account")
    .doSetProperty("linkURL","/content/dhl/us/en-us/open-an-account-usa")
    .run(DRY_RUN)
