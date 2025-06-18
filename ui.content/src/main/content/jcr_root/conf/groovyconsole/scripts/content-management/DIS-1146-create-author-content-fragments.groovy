import groovy.transform.Field
import com.adobe.cq.dam.cfm.FragmentTemplate;
import org.apache.commons.lang3.StringUtils;

@Field DRY_RUN = false;
@Field CF_ROOT = '/content/dam/dhl/content-fragment';
@Field CF_MODEL = '/conf/dhl/settings/dam/cfm/models/author';
@Field CF_TEMPLATE = null;
@Field ROOT = '/content/dhl';
@Field MAP = [:];
@Field LIST = new HashSet();

CF_TEMPLATE = getResource(CF_MODEL).adaptTo(FragmentTemplate.class);

def getHomePages() {
    return sql2Query("""
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('${ROOT}')
        AND node.[cq:template] = '/conf/dhl/settings/wcm/templates/home-page'
    """).stream().map({it -> it.getParent().getPath() });
}

def getArticles(pagePath) {
    return sql2Query(
            """
        SELECT * FROM [nt:unstructured] 
        WHERE [sling:resourceType] = 'dhl/components/pages/editable-article'
        AND ISDESCENDANTNODE('${pagePath}')
    """);
}

def normalize(name) {
    return name.trim().toLowerCase().replaceAll(" ",  "_");
}

def getOrCreateNode(node, child, type) {
    return node.hasNode(child) ? node.getNode(child) : node.addNode(child, type);
}

def getLocale(pagePath) {
    return getPage(pagePath).getLanguage()
}

def getLanguage(locale) {
    def language = locale.getLanguage();
    if("en".equals(language)) {
        return "en"
    }

    return locale.toString().toLowerCase();
}


def getDisplayLanguage(locale) {
    def language = locale.getLanguage();
    if("en".equals(language)) {
        return "English [en]";
    }

    def langCode = """[${getLanguage(locale)}]""";
    def lang = locale.getDisplayLanguage();
    def country = locale.getDisplayCountry();
    def wrapedCountry = country.isBlank() ? country : """(${country})""";
    return StringUtils.joinWith(' ', lang, wrapedCountry, langCode );
}


def getOrCreateLanguageFolder(node, childNodeName, title) {
    def folder = getOrCreateNode(node, childNodeName, 'sling:Folder');
    if(!folder.hasNode("jcr:content")) {
        def jcrContent = getOrCreateNode(folder, "jcr:content", 'nt:unstructured');
        jcrContent.setProperty("jcr:title", title)
        jcrContent.setProperty("cq:isTransCreated", true)
    }
    return folder;
}

def setPropertyIfEmpty(node, property, value) {
    if(!node.hasProperty(property) || node.getProperty(property).getString().isBlank()){
        node.setProperty(property, value);
    }
}

def initStructure() {
    def node = getNode('/content/dam')
    def dhl = getOrCreateNode(node, 'dhl', 'sling:Folder');
    def contentFragment = getOrCreateNode(dhl, 'content-fragments', 'sling:Folder');
    def contentFragmentJcrContent = getOrCreateNode(contentFragment, 'jcr:content', 'nt:unstructured');
    def policies = getOrCreateNode(contentFragmentJcrContent, 'policies', 'nt:unstructured');
    def cfm = getOrCreateNode(policies, 'cfm', 'nt:unstructured');
    if(!cfm.hasProperty('policy-cfm-allowedModelsByPaths')) {
        setPropertyIfEmpty(cfm, 'policy-cfm-allowedModelsByPaths', ['/conf/dhl/settings/dam/cfm/models/author'] as String[]);
    }
}

def createAuthor(locale, name, title, description, photo) {
    def node = getNode('/content/dam/dhl/content-fragments')
    def lang = getLanguage(locale);
    def langTitle = getDisplayLanguage(locale);
    def langFolder = getOrCreateLanguageFolder(node, lang, langTitle);
    def fragmentName = normalize(name)
    def fragment;
    if(langFolder.hasNode(fragmentName)) {
        fragment = langFolder.getNode(fragmentName).getPath();
    } else {
        fragment = CF_TEMPLATE.createFragment(getResource(langFolder.getPath()), fragmentName, name).adaptTo(Resource.class).getPath();
    }
    def master = getNode(fragment + '/jcr:content/data/master')
    setPropertyIfEmpty(master, "name", name)
    setPropertyIfEmpty(master, "title", title)
    setPropertyIfEmpty(master, "description", description)
    setPropertyIfEmpty(master, "image", photo)

    return fragment;
}

def getOrCreateCfComponent(node, child) {
    if(node.hasNode(child)) {
        return node.getNode(child);
    }

    def cfComponent = node.addNode(child);
    cfComponent.setProperty('sling:resourceType', 'core/wcm/components/contentfragment/v1/contentfragment')
    cfComponent.setProperty('variationName', 'master')
    return cfComponent;
}

initStructure();

getHomePages().each{page ->
    getArticles(page).each {
        def resource = getResource(it.getPath());
        def properties = resource.adaptTo(ModifiableValueMap.class);

        def cfNode = getOrCreateCfComponent(it, 'author-cf')

        // if(cfNode.hasProperty('fragmentPath')) {
        //     return;
        // }

        def locale = getLocale(page);
        def name = properties.get("author", "")
        if(name.isBlank()) {
            return;
        }
        def title = properties.get("authortitle", "")
        def description = properties.get("authorBriefDescription", "")
        def photo = properties.get("authorimage", "")

        def fragment = createAuthor(locale, name, title, description, photo);
        cfNode.setProperty('fragmentPath', fragment)
    }
    if(DRY_RUN) {
        session.refresh(false);
    } else {
        save();
    }
}