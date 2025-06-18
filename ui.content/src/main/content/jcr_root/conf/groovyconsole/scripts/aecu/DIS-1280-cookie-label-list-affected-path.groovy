import groovy.transform.Field
import java.util.regex.Pattern

@Field DRY_RUN = true
@Field SCOPE = "/content/experience-fragments"

// Query to find all footer components
@Field QUERY = """
SELECT * FROM [nt:unstructured] as node
WHERE ISDESCENDANTNODE(node, '${SCOPE}')
AND node.[sling:resourceType] = 'dhl/components/content/footer'
"""

// Results list to store findings
def results = []
def cookieLinksFound = 0
def footersChecked = 0
def companyLinkList = []
def noCompanyLinkList = []
def cookieLinkList = []

// For each footer component found
sql2Query(QUERY).each { footerNode ->
    footersChecked++
    def footerPath = footerNode.path
    //println "Checking footer: ${footerPath}"

    // Look for companyLinks in this footer
    def hasCompanyLinks = false
    def hasCookieLink = false

    // Check if the footer has a companyLinks child node
    if (footerNode.hasNode("companyLinks")) {
        def companyLinks = footerNode.getNode("companyLinks")
        hasCompanyLinks = true

        //println "  Found companyLinks at: ${companyLinks.path}"

        companyLinkList.push(companyLinks)

        // Iterate through potential link items (item0, item1, etc.)
        companyLinks.getNodes().each { linkItem ->
            // Check for linkName property containing "Cookie"
            if (linkItem.hasProperty("linkName")) {
                def linkName = linkItem.getProperty("linkName").getString()
                if (linkName.toLowerCase().contains("Cookie")) {
                    hasCookieLink = true
                    cookieLinksFound++

                    cookieLinkList.push(linkName)
                    //println "  ✓ Found Cookie link: ${linkName} at ${linkItem.path}"
                }
            }
        }

        if (!hasCookieLink) {
            //println "  ✗ No Cookie link found in companyLinks"
        }
    } else {
        //println "  ✗ No companyLinks found in this footer"
        noCompanyLinkList.push(false)
    }

    // Add result to our list
    results.add([
            path: footerPath,
            hasCompanyLinks: hasCompanyLinks,
            hasCookieLink: hasCookieLink
    ])
}

// Print summary
println "\n===== SUMMARY ====="
//println "Total footers checked: ${footersChecked}"
//println "Footers with companyLinks: ${results.findAll { it.hasCompanyLinks }.size()}"
//println "Footers with Cookie links: ${results.findAll { it.hasCookieLink }.size()}"

println "Total Company Links: ${companyLinkList.size()}"
println "Total Cookie Links: ${cookieLinkList.size()}"
println "Total Company Links no found: ${noCompanyLinkList.size()}"
noCompanyLinkList.each()
println "not found path: ${}"
// Return results for further processing if needed
return results