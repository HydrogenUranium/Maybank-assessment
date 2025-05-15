import groovy.transform.Field;
import org.apache.jackrabbit.commons.JcrUtils;

@Field TOP_TILES_SUPER_TYPE = 'dhl/components/content/top-tiles';
@Field TOP_TILES_V2_SUPER_TYPE = 'dhl/components/content/top-tiles-v2';

@Field ROOT = '/content/dhl/global/en-global/jcr:content';
@Field DRY_RUN = false;

def getAllTopTiles() {
    return sql2Query("""
        SELECT * FROM [nt:unstructured]
        WHERE ISDESCENDANTNODE('${ROOT}')
        AND [sling:resourceType] = '${TOP_TILES_SUPER_TYPE}'
    """)
}

def createNode(parent, nodeName) {
    return parent.hasNode(nodeName) ? parent.getNode(nodeName) : parent.addNode(nodeName);
}


def createImageNode(parent, nodeName, fileReference) {
    def image = createNode(parent, nodeName);
    image.setProperty('altValueFromDAM', 'true')
    if(fileReference != null && !fileReference.isBlank()) {
        image.setProperty('fileReference', fileReference)
    }
    image.setProperty('sling:resourceType', 'dhl/components/content/top-tiles-v2/image')
}

def processTile(parent, oldItem) {
    def articlePath = JcrUtils.getStringProperty(oldItem, 'articlePath', '');
    def mobileImagePath = JcrUtils.getStringProperty(oldItem, 'mobileImage', '');
    def desktopImagePath = JcrUtils.getStringProperty(oldItem, 'desktopImage', '');
    def item = createNode(parent, oldItem.getName())
    item.setProperty('linkURL', articlePath)
    item.setProperty('sling:resourceType', 'dhl/components/content/top-tiles-v2/image')
    createImageNode(item, 'mobileImage', mobileImagePath)
    createImageNode(item, 'desktopImage', desktopImagePath)
}

def processComponent(component) {
    println """Process ${component.getPath()} """
    if(!component.hasNode('articles')) {
        return
    }
    component.setProperty('sling:resourceType', TOP_TILES_V2_SUPER_TYPE)
    def articles = component.getNode('articles')
    def items = createNode(component, 'items')
    for(article in articles.getNodes()) {
        processTile(items, article);
    }
    articles.remove()

}

getAllTopTiles().each{
    processComponent(it);
}

if(DRY_RUN) {
    session.refresh(false);
    println "Refresh Changes (---)"
} else {
    session.save();
    println "Save Changes (+++)"
}
