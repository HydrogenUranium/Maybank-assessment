def NEW_COUNTRIES_DATA = [
        ["country": "United Kingdom",   "code": "gb"],
        ["country": "Canada",	        "code": "ca"],
        ["country": "Italy",	        "code": "it"],
        ["country": "France",	        "code": "fr"],
        ["country": "Korea",	        "code": "kr"],
        ["country": "Thailand",	        "code": "th"],
        ["country": "Belgium",	        "code": "be"],
        ["country": "Ireland",	        "code": "ie"],
        ["country": "Spain",	        "code": "es"],
        ["country": "Pakistan",	        "code": "pk"],
        ["country": "Taiwan",	        "code": "tw"],
        ["country": "Switzerland",	    "code": "ch"],
        ["country": "Czech Republic",	"code": "cz"],
        ["country": "Vietnam",	        "code": "vn"],
        ["country": "China",	        "code": "cn"],
        ["country": "Poland",	        "code": "pl"],
        ["country": "Bangladesh",	    "code": "bd"],
        ["country": "Denmark",	        "code": "dk"]
]
println("REPOSITORY INIT")

NEW_COUNTRIES_DATA.each {
    def id = it.country.toLowerCase().replaceAll(" ", "-")
    def country = it.country
    def code = it.code
    println("""
        "create group author-$id",
        "add author-$id to group discover-base-user",
        "set properties on authorizable(author-$id)/profile\\n set givenName to \\"Author - $country\\"\\n end",
        "set ACL for author-$id\\nallow jcr:read,jcr:versionManagement,rep:write,jcr:lockManagement on /content/dhl restriction(rep:glob,/$code)\\nend",
        "set ACL for author-$id\\nallow jcr:read on home(author-$id)\\nend",

        "create group publisher-$id",
        "add publisher-$id to group discover-base-user",
        "set properties on authorizable(publisher-$id)/profile\\n set givenName to \\"Publisher - $country\\"\\n end",
        "set ACL for publisher-$id\\nallow jcr:read,jcr:versionManagement,crx:replicate,rep:write,jcr:lockManagement on /content/dhl restriction(rep:glob,/$code)\\nend",
        "set ACL for publisher-$id\\nallow jcr:read on home(publisher-$id)\\nend",
    """)
}

println("PUBLICATION REVIEW")

NEW_COUNTRIES_DATA.each {
    def id = it.country.toLowerCase().replaceAll(" ", "-")
    def code = it.code
    println("\"/content/dhl/$code:publisher-$id\",")
}
