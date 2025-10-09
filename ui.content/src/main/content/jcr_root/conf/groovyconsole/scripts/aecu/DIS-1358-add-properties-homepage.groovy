import groovy.transform.Field

@Field DRY_RUN = true;

@Field PROPERTIES = "chatbotId";

@Field CHATBOT_ID_MAPPING = [
        "en-au" : "express-cs-ap/discover/au/59f42cfa-64e1-4d9c-8dcc-26848dbd25ef",
        "en-bd" : "express-cs-ap/discover/bd/64102d77-0e06-4d78-89ca-75ee4be2c049",
        "en-id" : "express-cs-ap-3/discover/id/766da848-895d-4536-8b78-34483f77d977",
        "en-in" : "express-cs-ap-4/discover/in/d8473a72-b815-4d55-9cb1-8d82aedc3738",
        "en-kh" : "express-cs-ap-2/discover/kh/7eb7471e-e18d-45c9-9c77-a47c9e4c0a73",
        "en-lk" : "express-cs-ap-2/discover/lk/19599790-2b11-4fa5-bd28-da4af7ed8c4c",
        "en-mm" : "express-cs-ap-2/discover/mm/31f60456-e31c-48e9-b5fd-72f09cd9295a",
        "en-my" : "express-cs-ap-3/discover/my/1effb504-702f-4890-a6a5-74e8faec96d2",
        "en-nz" : "express-cs-ap/discover/nz/39bf44c8-3deb-442d-8cc8-7af67fc6666d",
        "en-ph" : "express-cs-ap-4/discover/ph/1b2a41b6-7af0-40a4-8d3e-84a8347743e2",
        "en-pk" : "express-cs-ap/discover/pk/040dc737-101c-4f5c-ab93-6e9f962e198b",
        "en-sg" : "express-cs-ap/discover/sg/6cc3e264-d576-4637-9af2-4002ea2113b1",
        "en-tw" : "express-cs-ap-2/discover/tw/6ba110fa-cf7f-4b7b-9821-94b45524f980",
        "en-vn" : "express-cs-ap/discover/vn/00b6cedd-661e-49e8-a1e9-35b0b2e108cf",
        "tw-zh" : "express-cs-ap-2/discover/tw/6ba110fa-cf7f-4b7b-9821-94b45524f980",
        "en-th" : "express-cs-ap-4/discover/th/9a01a47c-c7d5-47d3-bdb8-b04414bfac82",
        "th-th" : "express-cs-ap-4/discover/th/9a01a47c-c7d5-47d3-bdb8-b04414bfac82",
        "en-hk" : "express-cs-ap-3/discover/hk/503547a7-870e-4bb0-81e1-87473a511f4a",
        "en-np" : "express-cs-ap-3/discover/np/ef584d2a-6e40-4863-aa04-b1f5af0d2fed",
        "en-jp" : "express-cs-ap-2/discover/jp/0badfb82-42e3-4547-854b-548ca8818a28",
        "ja-jp" : "express-cs-ap-2/discover/jp/0badfb82-42e3-4547-854b-548ca8818a28",
        "en-kr" : "express-cs-ap-2/discover/kr/c0b27d5b-57e7-4238-9cd5-0c3d9f6bd17d",
        "ko-kr" : "express-cs-ap-2/discover/kr/c0b27d5b-57e7-4238-9cd5-0c3d9f6bd17d",
        "vi-vn" : "express-cs-ap/discover/vn/00b6cedd-661e-49e8-a1e9-35b0b2e108cf",
        "zh-hk" : "express-cs-ap-3/discover/hk/503547a7-870e-4bb0-81e1-87473a511f4a",
        "zh-tw" : "express-cs-ap-2/discover/tw/6ba110fa-cf7f-4b7b-9821-94b45524f980",
        "id-id" : "express-cs-ap-3/discover/id/766da848-895d-4536-8b78-34483f77d977"
]

@Field modifiedNodes = [];

def getHomePages() {
    return sql2Query("""
        SELECT * FROM [nt:unstructured] AS node
        WHERE ISDESCENDANTNODE('/content/dhl')
        AND node.[cq:template] = '/conf/dhl/settings/wcm/templates/home-page'
    """).stream().map{ it.getParent() };
}

def updateChatbotId() {
    def homePages = getHomePages().collect()
    def languageCountryCode = null;
    homePages.each { homePage ->
        def homePagePath = homePage.getPath();
        def homePageNodePath = homePagePath + "/jcr:content";
        // Extract language-country code from path
        def pathParts = homePagePath.split('/');
        if (pathParts.length > 4) {
            languageCountryCode = pathParts[4];
        } else {
            languageCountryCode = "default"; // Assign a default value if path is invalid
        }
        if (languageCountryCode && CHATBOT_ID_MAPPING.containsKey(languageCountryCode)) {
            def propertyValue = CHATBOT_ID_MAPPING[languageCountryCode];
            def homePageNode = session.getNode(homePageNodePath);
            homePageNode.setProperty(PROPERTIES, propertyValue);
            modifiedNodes.add(homePageNodePath);
            if(DRY_RUN) {
                println "Page: ${languageCountryCode.toString()}" + " -------- " + "Chatbot Id: ${propertyValue}";
                println "Add property '${PROPERTIES}' to '${propertyValue}' on node '${homePageNodePath}'";

            }
        }

    }
}

def main() {
    if(!DRY_RUN) {
        updateChatbotId();
        modifiedNodes.each { node ->
            println "Modified Node: ${node}";
        }
        session.save();
    } else {
        updateChatbotId();
    }
}

main()

