// DIS-477 Fix Rollout for Article Category Page
import javax.jcr.query.Query

boolean DRY_RUN = true

def SCOPE = "/content/dhl"

def query = """
        SELECT * FROM [cq:PageContent] AS node
        WHERE ISDESCENDANTNODE(node, '$SCOPE') 
        AND node.[sling:resourceType] = 'dhl/components/pages/editable-category-page'
        AND node.[jcr:mixinTypes] = 'cq:LiveRelationship'
""" as Object

def executeQuery(query) {
    session.workspace.queryManager.createQuery(query, Query.JCR_SQL2).execute()
}

def list = executeQuery(query).nodes.collect({it})

def addMixin(node, mixinType) {
    def path = node.getPath()
    if(node.canAddMixin(mixinType)) {
        node.addMixin(mixinType);
        println "Add mixin: $mixinType to $path"
    } else {
        println "Failded to add mixin: $mixinType to node $path"
    }
}

list.each({
    if(it == null) {
        return;
    }

    def rootNode = it.getNode("root")
    if(rootNode == null) {
        return;
    }
    addMixin(rootNode, "cq:LiveRelationship")

    def responsivegridNode = rootNode.getNode("responsivegrid")
    if(responsivegridNode == null) {
        return;
    }
    addMixin(responsivegridNode, "cq:LiveRelationship")

    def articlelistcarousel = responsivegridNode.getNode("articlelistcarousel")
    if(articlelistcarousel == null) {
        return;
    }
    addMixin(articlelistcarousel, "cq:LiveRelationship")
    addMixin(articlelistcarousel, "cq:LiveSyncCancelled")

    articlelistcarousel.getNodes().each({
        addMixin(it, "cq:LiveRelationship")
        addMixin(it, "cq:LiveSyncCancelled")
    })
})
if(DRY_RUN) {
    session.refresh(false);
} else {
    session.save();
}

