boolean DRY_RUN = true
def NEW_CONTENT_BRANCHES = [
        "/content/dhl/language-masters",
        "/content/dhl/global",
        "/content/dhl/au",
        "/content/dhl/nz",
        "/content/dhl/us",
        "/content/dhl/it",
        "/content/dhl/th",
        "/content/dhl/in",
        "/content/dhl/sg",
        "/content/dhl/hk",
        "/content/dhl/tw",
        "/content/dhl/my",
        "/content/dhl/id",
]

def OLD_CONTENT_BRANCHES = [
        "/content/dhl/en-master",
        "/content/dhl/en-global",
        "/content/dhl/en-au",
        "/content/dhl/en-nz",
        "/content/dhl/en-us",
        "/content/dhl/en-in",
        "/content/dhl/en-sg",
        "/content/dhl/zh-sg",
        "/content/dhl/en-hk",
        "/content/dhl/en-my",
        "/content/dhl/ms-my",
        "/content/dhl/en-id",
        "/content/dhl/en-ph",
]

def deactivatePages(pages, dryRun) {
    pages.each {
        aecu.contentUpgradeBuilder()
                .forResources((String[])[it])
                .doDeactivateContainingPage()
                .run(dryRun)
    }
}

def activatePages(pages, dryRun) {
    pages.each {
        aecu.contentUpgradeBuilder()
                .forResources((String[])[it])
                .doTreeActivateContainingPage()
                .run(dryRun)
    }
}

deactivatePages(OLD_CONTENT_BRANCHES, DRY_RUN);
activatePages(NEW_CONTENT_BRANCHES, DRY_RUN);
