import groovy.transform.Field

@Field DRY_RUN = false;
@Field REPLICATE = true;

@Field ROOT = "/content/dhl/global/en-global/test/banner-migration";

@Field FRAGMENT_RESOURCE_TYPE = "dhl/components/content/experiencefragment";
@Field FRAGMENT_VARIATION_PROPERTY_NAME = "fragmentVariationPath";
@Field RESOURCE_TYPE = "sling:resourceType";
@Field PAGES_FOLDER = "/content";
@Field EXPERIENCE_FRAGMENTS_FOLDER = "/content/experience-fragments";
@Field EXPERIENCE_FRAGMENT_MASTER_LOCATION = "/content/experience-fragments/dhl/language-masters/en-master";

@Field pageUtilService;
pageUtilService = getService("com.dhl.discover.core.services.PageUtilService");

@Field AFFECTED_PATHS = [];

def newsletterWithPointsSQL = """
    select * from [nt:unstructured]
    where [sling:resourceType] = 'dhl/components/content/cta-banner-with-points'
    and  ISDESCENDANTNODE('${ROOT}')
    AND type = 'subscribeNewsletter'
"""

def newsletterSQL = """
    select * from [nt:unstructured]
    where [sling:resourceType] = 'dhl/components/content/cta-banner'
    and  ISDESCENDANTNODE('${ROOT}')
    AND type = 'subscribeNewsletter'
"""

def openBusinessSQL = """
    select * from [nt:unstructured]
    where [sling:resourceType] = 'dhl/components/content/cta-banner-with-points'
    and  ISDESCENDANTNODE('${ROOT}')
    AND type = 'businessAccount'
"""

def individualShipperSQL = """
    select * from [nt:unstructured]
    where [sling:resourceType] = 'dhl/components/content/cta-banner-gray'
    and  ISDESCENDANTNODE('${ROOT}')
    AND type = 'individualShipper'
"""

def getLocalizedFragment(node, fragmentPath) {
    def relativeRootPath = pageUtilService.getHomePagePath(node.getPath()).replaceFirst(PAGES_FOLDER, EXPERIENCE_FRAGMENTS_FOLDER);
    def localizedVariationPath = fragmentPath.replaceFirst(EXPERIENCE_FRAGMENT_MASTER_LOCATION, relativeRootPath);
    def localizedVariationResource = resourceResolver.getResource(localizedVariationPath);

    return localizedVariationResource != null ? localizedVariationPath : fragmentPath;
}

def isInSidebar(node) {
    node.getPath().contains('/sidebar/')
}

def updateNode(node, bodyVariation, sidebarVariation) {
    def fragment = isInSidebar(node) ? sidebarVariation : bodyVariation;
    def localizedFragment = getLocalizedFragment(node,fragment);

    node.setProperty(RESOURCE_TYPE, FRAGMENT_RESOURCE_TYPE);
    node.setProperty(FRAGMENT_VARIATION_PROPERTY_NAME, localizedFragment);
    AFFECTED_PATHS.add(node.getPath());
    println """Update ${node.getPath()}"""
}

def migrate(sql, bodyVariation, sidebarVariation) {
    sql2Query(sql).each {
        updateNode(it, bodyVariation, sidebarVariation);
    }
}

migrate(newsletterWithPointsSQL,
        '/content/experience-fragments/dhl/language-masters/en-master/banners/newsletter-subscription/master',
        '/content/experience-fragments/dhl/language-masters/en-master/banners/newsletter-subscription/sidebar-banner-with-points');

migrate(newsletterSQL,
        '/content/experience-fragments/dhl/language-masters/en-master/banners/newsletter-subscription/adaptive-banner',
        '/content/experience-fragments/dhl/language-masters/en-master/banners/newsletter-subscription/sidebar-banner');

migrate(openBusinessSQL,
        '/content/experience-fragments/dhl/language-masters/en-master/banners/open-business-account/master',
        '/content/experience-fragments/dhl/language-masters/en-master/banners/open-business-account/sidebar-banner');

migrate(individualShipperSQL,
        '/content/experience-fragments/dhl/language-masters/en-master/banners/individual-shipper/master',
        '/content/experience-fragments/dhl/language-masters/en-master/banners/individual-shipper/sidebar-banner');

def wrongPaths = []
def notPublished = []
def getJcrContent(path) {
    return pageManager.getContainingPage(path).getContentResource();
}
def isPublished(path) {
    def resource = getJcrContent(path)
    def valueMap = resource.getValueMap()
    def status = valueMap.get('cq:lastReplicationAction_publish', valueMap.get('cq:lastReplicationAction', ''))
    return status.equals('Activate')
}

def filtered = AFFECTED_PATHS.stream()
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

if(DRY_RUN) {
    session.refresh(false);
    println "Refresh Changes (---)"
} else {
    session.save();
    println "Save Changes (+++)"
    if (REPLICATE && filtered.size() > 0) {
        replicator.replicate(session, ReplicationActionType.ACTIVATE, filtered.toArray(new String[0]), null)
    }
}