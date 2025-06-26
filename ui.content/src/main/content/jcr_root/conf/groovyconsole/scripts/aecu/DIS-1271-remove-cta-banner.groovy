import groovy.transform.Field;
import org.apache.jackrabbit.commons.JcrUtils;
import com.day.cq.replication.ReplicationActionType

@Field CTA_BANNER_TYPE = 'dhl/components/content/cta-banner';
@Field CTA_BANNER_V2_TYPE = 'dhl/components/content/cta-banner-v2';
@Field ANIMATED_PAGE_TEMPLATE = '/conf/dhl/settings/wcm/templates/animated-page';

// run it separately for /content/dhl and experience fragments
@Field ROOT = '/content/dhl';
//@Field ROOT = '/content/experience-fragments';
@Field DRY_RUN = true;
@Field PUBLISH_IT = false;

@Field list = new HashSet();
def wrongPaths = []
def notPublished = []
def getAllCtaBanners() {
    return sql2Query("""
        SELECT * FROM [nt:unstructured]
        WHERE ISDESCENDANTNODE('${ROOT}')
        AND [sling:resourceType] = '${CTA_BANNER_TYPE}'
    """)
}

def createNode(parent, nodeName) {
    return parent.hasNode(nodeName) ? parent.getNode(nodeName) : parent.addNode(nodeName);
}

def createImageNode(parent, nodeName, fileReference) {
    def image = createNode(parent, nodeName);
    image.setProperty('altValueFromDAM', 'true')
    if(fileReference != null && !fileReference.isEmpty()) {
        image.setProperty('fileReference', fileReference)
    }
    image.setProperty('sling:resourceType', CTA_BANNER_V2_TYPE)
}

def processCtaBanner(component) {
    println """Processing ${component.getPath()} """

    // Get existing image paths
    def mobileImagePath = JcrUtils.getStringProperty(component, 'mobileBackgroundImage', '');
    def desktopImagePath = JcrUtils.getStringProperty(component, 'desktopBackgroundImage', '');
    def tabletImagePath = JcrUtils.getStringProperty(component, 'tabletBackgroundImage', '');

    // Set new component properties
    component.setProperty('sling:resourceType', CTA_BANNER_V2_TYPE)
    component.setProperty('altValueFromPageImage', true)
    component.setProperty('imageFromPageImage', true)
    component.setProperty('isDecorative', false)
    // Remove old properties


    if(component.hasProperty('desktopBackgroundImage')) {
        component.getProperty('desktopBackgroundImage').remove()
    }
    if(component.hasProperty('mobileBackgroundImage')) {
        component.getProperty('mobileBackgroundImage').remove()
    }
    if(component.hasProperty('tabletBackgroundImage')) {
        component.getProperty('tabletBackgroundImage').remove()
    }

    // Create image child nodes only if paths exist
    createImageNode(component, 'desktopImage', desktopImagePath)
    createImageNode(component, 'mobileImage', mobileImagePath)
    createImageNode(component, 'tabletImage', tabletImagePath)
}

// Main execution
println "Starting CTA Banner migration to CTA Banner v2..."
println "DRY RUN mode: ${DRY_RUN}"

def banners = getAllCtaBanners()
println "Found ${banners.size()} total CTA Banner components"
def skippedCount = 0

getAllCtaBanners().each {
    processCtaBanner(it)
}



println "Skipped ${skippedCount} components on animated-page templates"
println "Processed ${banners.size() - skippedCount} components"


def getJcrContent(path) {
    return pageManager.getContainingPage(path).getContentResource();
}

def isPublished(path) {
    def resource = getJcrContent(path)
    def valueMap = resource.getValueMap()
    def status = valueMap.get('cq:lastReplicationAction_publish', valueMap.get('cq:lastReplicationAction', ''))
    return status.equals('Activate')
}

def filtered = list.stream()
        .filter(path -> {
            if(getResource(path) == null) {
                wrongPaths.add(path)
                return false
            }
            if(!isPublished(path)) {
                notPublished.add(path)
                return false;
            }
            return true
        }).toList()

println("""Wrong paths: ${wrongPaths.size()}""")
println("""Not published: ${notPublished.size()}""")
println("""Pages to publish: ${filtered.size()}""")


def replicator = getService("com.day.cq.replication.Replicator")

if (PUBLISH_IT) {
    filtered.each({
        try {
            def session = resourceResolver.adaptTo(Session)
            if (session != null) {
                replicator.replicate(session, ReplicationActionType.ACTIVATE, it)
                println("Successfully published: ${it}")
            } else {
                println("Failed to adapt resourceResolver to Session")
            }
        } catch (Exception e) {
            println("Replication failed for ${it}: ${e.message}")
        }
    })
}
    if(DRY_RUN) {
        session.refresh(false)
        println "Refreshed session - no changes saved (dry run)"
    } else {
        session.save()
        println "Changes saved successfully"
    }