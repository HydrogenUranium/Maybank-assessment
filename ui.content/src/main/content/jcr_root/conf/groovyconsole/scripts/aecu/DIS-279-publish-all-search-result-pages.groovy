boolean DRY_RUN = true
 
def query = """
    SELECT * FROM [cq:PageContent] AS page
    WHERE ISDESCENDANTNODE(page, '/content/dhl')
    AND NOT ISDESCENDANTNODE(page, '/content/dhl/language-masters')
    AND page.[cq:template] = '/conf/dhl/settings/wcm/templates/search-result-page'
    """
 
aecu.contentUpgradeBuilder().forResourcesBySql2Query(query)
    .doActivateResource()
    .run(DRY_RUN)
    
def query2 = """
    SELECT * FROM [nt:unstructured] AS page
    WHERE ISDESCENDANTNODE(page, '/content/dhl')
    AND NOT ISDESCENDANTNODE(page, '/content/dhl/language-masters')
    AND page.[cq:template] = '/conf/dhl/settings/wcm/templates/search-result-page'
    """
 
aecu.contentUpgradeBuilder().forResourcesBySql2Query(query2)
    .doActivateResource()
    .run(DRY_RUN) 