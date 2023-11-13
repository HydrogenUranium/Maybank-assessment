// DIS-465 CREATING INITIAL PAGE VERSION
import java.text.SimpleDateFormat;

def DRY_RUN = true
// 'true'   - to check the list of pages for package whose version will be updated:
// 'false'  - to create a new version of pages

def VERSION_NAME = "Initial Page Version"

// Section for preparing list of pages
def contentPath = "/content/dhl"
def getPagesByResourceType = """
            SELECT * FROM [cq:Page] AS page
            WHERE ISDESCENDANTNODE(page, '$contentPath')
        """
def getPagesByQuery = session.getWorkspace().getQueryManager().createQuery(getPagesByResourceType, 'JCR-SQL2')
listPages = getPagesByQuery
        .execute()
        .getNodes()
        .collect{it.getPath()}
        .sort()
//END

if (DRY_RUN) {
    println(">> DRY RUN mode")
    println("Results: " + listPages.size())
    if (listPages.size() > 0) {
        println("(!) Use this list of pages for preparing package:")
        listPages.each({ println("""<filter root="$it"/>""")})
    }
} else {
    println("List of pages for the package whose version was updated:")
    def pageManager = resourceResolver.adaptTo(PageManager.class);
    listPages.each({
        println(it)
        def page = getPage(it);
        def date = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss.SSS").format(new Date());
        def label = String.format("%s - %s", VERSION_NAME, date);

        pageManager.createRevision(page, label, "Groovy Script version.");
    })
}