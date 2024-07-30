//DIS-446 Removing Deleted pages: Create Backup list pages for Package Filter
def CONTENT_BRANCHES = [
        "/content/dhl/language-masters",
        "/content/dhl/archive",
        "/content/dhl/at",
        "/content/dhl/bd",
        "/content/dhl/be",
        "/content/dhl/ch",
        "/content/dhl/cn",
        "/content/dhl/cz",
        "/content/dhl/dk",
        "/content/dhl/es",
        "/content/dhl/fr",
        "/content/dhl/gb",
        "/content/dhl/hk",
        "/content/dhl/hu",
        "/content/dhl/id",
        "/content/dhl/ie",
        "/content/dhl/in",
        "/content/dhl/is",
        "/content/dhl/it",
        "/content/dhl/kh",
        "/content/dhl/kr",
        "/content/dhl/lk",
        "/content/dhl/mm",
        "/content/dhl/my",
        "/content/dhl/nz",
        "/content/dhl/ph",
        "/content/dhl/pk",
        "/content/dhl/pl",
        "/content/dhl/pt",
        "/content/dhl/sg",
        "/content/dhl/sk",
        "/content/dhl/th",
        "/content/dhl/tw",
        "/content/dhl/us",
        "/content/dhl/vn",
]
def list = []
CONTENT_BRANCHES.each { path ->
    def getPagesByQuery = session.getWorkspace().getQueryManager()
            .createQuery("""
            SELECT * FROM [cq:Page] AS page
            WHERE ISDESCENDANTNODE(page, '$path')
            AND page.[jcr:content/deleted] IS NOT NULL
        """, 'JCR-SQL2')

    list = list + getPagesByQuery
            .execute()
            .getNodes()
            .collect{it.getPath()}

}

println("Results: " + list.size())
list.sort().each({ println("""<filter root="$it"/>""")})