//DIS-721 Show activated pages without 'noindex'

import groovy.transform.Field

@Field contentScope = "/content/dhl/global"

def pagePaths = []
getPage(contentScope).recurse { page ->
    def contentPage = page.node

    if (contentPage) {
        def hasNoIndex = contentPage.get('cq:robotsTags')?.contains('noindex')
        def isPublished = contentPage.get('cq:lastReplicationAction') == 'Activate'

        if (!hasNoIndex && isPublished) {
            pagePaths.add(page.path)
        }
    }
}

println("Pages: " + pagePaths.size())
if (pagePaths.size() > 0) {
    pagePaths.each({ println(""""$it",""") })
}
