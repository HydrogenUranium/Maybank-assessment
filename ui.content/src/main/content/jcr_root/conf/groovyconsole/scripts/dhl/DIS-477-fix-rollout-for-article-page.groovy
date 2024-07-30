// DIS-477 Fix Rollout for Article Category Page

import javax.jcr.query.Query

boolean DRY_RUN = true

def SCOPE = "/content/dhl"

def COMPONENTS = [
        "/root",
        "/root/article_container",
        "/root/article_container/body",
        "/root/article_container/body/responsivegrid",
        "/root/article_container/sidebar",
        "/root/article_container/sidebar/responsivegrid",
        "/root/article_container_two",
        "/root/article_container_two/body",
        "/root/article_container_two/body/responsivegrid",
        "/root/article_container_two/sidebar",
        "/root/article_container_two/sidebar/responsivegrid",
        "/root/responsivegrid",
]

def query = """
        SELECT * FROM [cq:PageContent] AS node
        WHERE ISDESCENDANTNODE(node, '$SCOPE') 
        AND node.[sling:resourceType] = 'dhl/components/pages/editable-article'
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

def addLiveRelationshipMixin(node) {
    if (node != null) {
        addMixin(node, "cq:LiveRelationship")
    }
}

list.each(contentNode-> {
    COMPONENTS.each({
        def path = contentNode.getPath() + it
        try {
            def node = getNode(path)
            addLiveRelationshipMixin(node);
        } catch(Exception e) {
            println "Node doesn't exist $path"
        }

    })
})

if(DRY_RUN) {
    session.refresh(false);
} else {
    session.save();
}
