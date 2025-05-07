import groovy.transform.Field

@Field DRY_RUN = false;
@Field ROOTS = [
        '/content/dhl/ae/ar-ae',
        '/content/dhl/ae/en-ae',
        '/content/dhl/at/de-at',
        '/content/dhl/at/en-at',
        '/content/dhl/au/en-au',
        '/content/dhl/bd/en-bd',
        '/content/dhl/be/en-be',
        '/content/dhl/be/fr-be',
        '/content/dhl/be/nl-be',
        '/content/dhl/br/en-br',
        '/content/dhl/br/pt-br',
        '/content/dhl/ca/en-ca',
        '/content/dhl/ca/fr-ca',
        '/content/dhl/ch/de-ch',
        '/content/dhl/ch/en-ch',
        '/content/dhl/ch/fr-ch',
        '/content/dhl/ch/it-ch',
        '/content/dhl/cn/en-cn',
        '/content/dhl/cn/zh-cn',
        '/content/dhl/cz/cs-cz',
        '/content/dhl/cz/en-cz',
        '/content/dhl/es/en-es',
        '/content/dhl/es/es-es',
        '/content/dhl/fr/en-fr',
        '/content/dhl/fr/fr-fr',
        '/content/dhl/gb/en-gb',
        '/content/dhl/global/en-global',
        '/content/dhl/hk/en-hk',
        '/content/dhl/hk/zh-hk',
        '/content/dhl/hu/en-hu',
        '/content/dhl/hu/hu-hu',
        '/content/dhl/id/en-id',
        '/content/dhl/id/id-id',
        '/content/dhl/ie/en-ie',
        '/content/dhl/il/en-il',
        '/content/dhl/il/he-il',
        '/content/dhl/in/en-in',
        '/content/dhl/it/en-it',
        '/content/dhl/it/it-it',
        '/content/dhl/jp/en-jp',
        '/content/dhl/jp/ja-jp',
        '/content/dhl/ke/en-ke',
        '/content/dhl/kh/en-kh',
        '/content/dhl/kr/en-kr',
        '/content/dhl/kr/ko-kr',
        '/content/dhl/lk/en-lk',
        '/content/dhl/mm/en-mm',
        '/content/dhl/my/en-my',
        '/content/dhl/ng/en-ng',
        '/content/dhl/nz/en-nz',
        '/content/dhl/ph/en-ph',
        '/content/dhl/pk/en-pk',
        '/content/dhl/pt/en-pt',
        '/content/dhl/pt/pt-pt',
        '/content/dhl/se/en-se',
        '/content/dhl/se/sv-se',
        '/content/dhl/sg/en-sg',
        '/content/dhl/sk/en-sk',
        '/content/dhl/sk/sk-sk',
        '/content/dhl/th/en-th',
        '/content/dhl/th/th-th',
        '/content/dhl/tw/en-tw',
        '/content/dhl/tw/zh-tw',
        '/content/dhl/us/en-us',
        '/content/dhl/vn/en-vn',
        '/content/dhl/vn/vi-vn',
        '/content/dhl/za/en-za'
]
@Field REPLICATOR;
REPLICATOR = getService("com.day.cq.replication.Replicator");

@Field formattedDate;

def now = new Date()
def formatter = new java.text.SimpleDateFormat("dd/MM/yyyy HH:mm:ss")
formattedDate = formatter.format(now)

def isPublished(page) {
    def resource = page.getContentResource()
    def valueMap = resource.getValueMap()
    def status = valueMap.get('cq:lastReplicationAction_publish', valueMap.get('cq:lastReplicationAction', ''))
    return status.equals('Activate')
}

def replicate(list) {
    if (!DRY_RUN) {
        REPLICATOR.replicate(session, ReplicationActionType.ACTIVATE, list.toArray(new String[0]), null)
    }
}

def updatePublicationLists(page, publishedList, notPublishedList) {
    def path = page.getPath();
    isPublished(page) ? publishedList.add(path) : notPublishedList.add(path)
    for (child in page.listChildren()) {
        updatePublicationLists(child, publishedList, notPublishedList)
    }
}

def getPublishedPages(path) {
    def page = getPage(path);
    def published = [];
    def notPublished = [];
    updatePublicationLists(page, published, notPublished);
    println """ Branch: ${path}, published: ${published.size()}, notPublished: ${notPublished.size()} """
    return published;
}

def addTimestamp(path) {
    def content = getNode(path + "/jcr:content");
    content.setProperty("lastCustomTreePublication", formattedDate)
    if(DRY_RUN) {
        session.refresh(false);
    } else {
        save();
    }
}

ROOTS.each{
    addTimestamp(it)
    def list = getPublishedPages(it);
    replicate(list);
}

