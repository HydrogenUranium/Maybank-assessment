import java.time.LocalDate
import java.time.format.DateTimeFormatter
def INACTIVE_DAYS;

/*
  Use one of three modes:
  1) SHOW ALL
  2) SHOW INACTIVE USERS with the INACTIVE_DAYS property
  3) SHOW NEWER LOGGED IN to see users who haven't logged in since before the last login feature was introduced.
 */

// def MODE = 'SHOW ALL';
def MODE = 'SHOW INACTIVE USERS'; INACTIVE_DAYS = 60;
// def MODE = 'SHOW NEWER LOGGED IN';

def MODES = [
        'SHOW ALL' : """
        SELECT node.* FROM [nt:unstructured] AS node
        INNER JOIN [rep:User] AS user ON ISCHILDNODE(node, user)
        WHERE ISDESCENDANTNODE(node, '/home/users') 
        AND NAME(node) = 'profile'
    """,
        'SHOW INACTIVE USERS' : """
        SELECT node.* FROM [nt:unstructured] AS node
        INNER JOIN [rep:User] AS user ON ISCHILDNODE(node, user)
        WHERE ISDESCENDANTNODE(node, '/home/users') 
        AND NAME(node) = 'profile'
        AND node.lastloggedin IS NOT NULL 
        AND node.lastloggedin < CAST('${getLastLoginDate(INACTIVE_DAYS)}T00:00:00.000Z' AS DATE)
    """,
        'SHOW NEWER LOGGED IN' : """
        SELECT node.* FROM [nt:unstructured] AS node
        INNER JOIN [rep:User] AS user ON ISCHILDNODE(node, user)
        WHERE ISDESCENDANTNODE(node, '/home/users') 
        AND NAME(node) = 'profile'
        AND node.lastloggedin IS NULL 
    """,
]

def getLastLoginDate(inactiveDays) {
    def currentDate = LocalDate.now()
    if (inactiveDays == null) {
        return currentDate;
    }
    def offlineDate = currentDate.minusDays(inactiveDays)
    return offlineDate.format(DateTimeFormatter.ISO_LOCAL_DATE)
}


def getProperty(node, propertyName) {
    return node.hasProperty("${propertyName}") ? node.getProperty("${propertyName}").getString() : '-';
}

def printUsers(profiles) {
    def data = []

    profiles.each { node ->
        data.add([
                [getProperty(node, 'givenName'), getProperty(node, 'familyName')].join(' '),
                getProperty(node, 'email'),
                getProperty(node.getParent(), 'rep:principalName'),
                getProperty(node, 'lastloggedin')
        ])
    }

    table {
        columns("User", "Email", "ID", "last login")
        rows(data)
    }

}

printUsers(sql2Query(MODES[MODE]))