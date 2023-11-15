/*
DIS-472 BackUp before content manipulation

Steps:
1)  def DRY_RUN = true
    - create a list of filters to prepare a BackUp package with all pages that will be affected

2)  def DRY_RUN = false
    - update the version of each page that will be affected
*/
import java.text.SimpleDateFormat;

def DRY_RUN = true

def VERSION_NAME = "DIS-472 Before modifying on STAGE"

// Section for preparing list of pages
def contentPath = "/content/dhl"
def standardResourceType = "dhl/components/pages/standard"
def twoColumnResourceType = "dhl/components/pages/landingtwocol"

def getPagesByResourceType = """
            SELECT * FROM [cq:Page] AS page
            WHERE ISDESCENDANTNODE(page, '$contentPath')
            AND (page.[jcr:content/sling:resourceType] = '$standardResourceType'
            AND NAME(page) LIKE '%thank%') OR page.[jcr:content/sling:resourceType] = '$twoColumnResourceType'
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
        listPages.each({ println("""<filter root="$it/jcr:content"/>""")})
    }
} else {
    println("Results: " + listPages.size())
    println("List of pages whose version was updated:")
    listPages.each({
        println(it)
        def isVersionExist = false

        pageManager.getRevisions(it, null, false).each({ revision ->
            if (revision.getLabel().contains(VERSION_NAME)) {
                println(">> Page Version Exist: " + it)
                isVersionExist = true
                return false
            }
        })

        if (!isVersionExist) {
            println(it)

            def date = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss.SSS").format(new Date());
            def label = String.format("%s - %s", VERSION_NAME, date);

            pageManager.createRevision(page, label, "Groovy Script version.");
        }
    })
}