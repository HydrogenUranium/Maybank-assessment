import groovy.transform.Field;
import org.apache.jackrabbit.commons.JcrUtils;

@Field CTA_BANNER_TYPE = 'dhl/components/content/cta-banner-with-points';
@Field CTA_BANNER_V2_TYPE = 'dhl/components/content/cta-banner-with-points-v2';
@Field ANIMATED_PAGE_TEMPLATE = '/conf/dhl/settings/wcm/templates/animated-page';

// run it separately for /content/dhl and experience fragments
@Field ROOT = '/content/dhl';
//@Field ROOT = '/content/experience-fragments';
@Field DRY_RUN = false;

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

/*def specificPath = "/content/dhl/global/en-global/small-business-advice/starting-a-business/business-plan-advice/jcr:content/root/main/article_container/body/responsivegrid_929485349/cta_banner_with_poin"

if (session.nodeExists(specificPath)) {
    def specificComponent = session.getNode(specificPath)
    processCtaBanner(specificComponent)
}*/

println "Skipped ${skippedCount} components on animated-page templates"
println "Processed ${banners.size() - skippedCount} components"

if(DRY_RUN) {
    session.refresh(false)
    println "Refreshed session - no changes saved (dry run)"
} else {
    session.save()
    println "Changes saved successfully"
}