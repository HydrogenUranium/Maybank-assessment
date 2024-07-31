// DIS-734 Publish status

def contentScope = "/content/dhl/be"
def pagePublishInfo = []
getPage(contentScope).recurse { page ->
    def contentPage = page.node
    if (contentPage) {
        pagePublishInfo.add([
                page.path,
                contentPage.get('jcr:createdBy'),
                contentPage.get('jcr:created'),
                contentPage.get('cq:lastReplicationAction') == 'Activate',
                contentPage.get('cq:lastReplicatedBy'),
                contentPage.get('cq:lastReplicated')])
    }
}
table {
    columns("Page Path", "Creator", "Creation Date", "Activated", "Activated By", "Activate Date", )
    rows(pagePublishInfo)
}