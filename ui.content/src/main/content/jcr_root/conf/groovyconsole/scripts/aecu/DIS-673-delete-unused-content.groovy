import groovy.transform.Field

@Field dryRun = true
@Field root = "/content/dhl"
@Field config = [
        "dhl/components/pages/editable-standard": ["title"],
        "dhl/components/pages/editable-category-page": ["par", "parcarousel", "title"],
        "dhl/components/pages/editable-home-page":	["footer", "title", "parother", "par", "relatedPosts", "header", "ctaBanner", "relatedPost"],
        "dhl/components/pages/editable-two-column-page":	["title", "title_msm_moved"],
        "dhl/components/pages/editable-article": ["title"],
]
@Field removeStartWith = "root_msm_moved"

def remove(path) {
    aecu.contentUpgradeBuilder()
            .forResources((String[])[path])
            .doDeleteResource()
            .run(dryRun);
}

def processContent(content) {
    if(content == null) {
        return;
    }
    def nodeNames = config.containsKey(content.getResourceType()) ? config.get(content.getResourceType()) : [];
    content.getChildren().each{
        def name = it.getName();
        if(nodeNames.contains(name) || name.startsWith(removeStartWith)) {
            remove(it.getPath())
        }
    }
}

def processPage(page) {
    def content = page.getContentResource();
    processContent(content)

    page.listChildren().each{
        processPage(it);
    }
}

processPage(getPage(root))