# OWASP Dependency-Check

This GitHub Action runs an **OWASP Dependency-Check** scan on a Maven project, uploads the resulting reports as a workflow artifact, and provides feedback on the presence of vulnerabilities by commenting on a pull request or commit.

You can view the source `action.yaml` file [here](./action.yaml).

## Example Usage

```yaml
- name: OWASP Dependency-Check
  uses: ./.github/actions/owasp-dependency-check
```

## Action Details

This composite action integrates the OWASP Dependency-Check Maven plugin into a GitHub Actions workflow to automatically scan for known vulnerabilities in a project's dependencies.

## Required `pom.xml` Configuration ⚙️

To enable the OWASP Dependency-Check scan, add the following plugin declarations within the `<plugins>` section of your `pom.xml`. The code snippets below use placeholders to highlight customizable values.

**OWASP Dependency-Check Maven Plugin**
This plugin is the core of the vulnerability scan. It is configured to generate reports in multiple formats and uses a custom internal repository for its data feeds.

```xml
    <plugin>
        <groupId>org.owasp</groupId>
        <artifactId>dependency-check-maven</artifactId>
        <version>${dependency-check.version}</version>
        <configuration>
            <formats>
                <format>HTML</format>
                <format>JSON</format>
                <format>XML</format>
            </formats>
            <ossindexAnalyzerEnabled>false</ossindexAnalyzerEnabled>
            <assemblyAnalyzerEnabled>false</assemblyAnalyzerEnabled>
            <hostedSuppressionsEnabled>false</hostedSuppressionsEnabled>
            <retireJsUrl>https://artifactory.dhl.com/artifactory/nvd-local/jsrepository.json</retireJsUrl>
            <nvdDatafeedUrl>https://artifactory.dhl.com/artifactory/nvd-local/nvdcve-{0}.json.gz</nvdDatafeedUrl>
            <knownExploitedUrl>https://artifactory.dhl.com/artifactory/nvd-local/known_exploited_vulnerabilities.json</knownExploitedUrl>
        </configuration>
    </plugin>
```

* `${dependency-check.version}`: Replace with the preferred OWASP Dependency-Check version (e.g., `12.1.1`).

### Step-by-Step Process:

1.  **`OWASP Dependency-Check`**:
    * **Purpose**: This step executes the core security scan using the OWASP Dependency-Check Maven plugin.
    * **Methodology**: It runs the **`mvn dependency-check:check -B`** command.
        * `dependency-check:check`: The Maven goal that performs the dependency analysis. It downloads and updates the NVD (National Vulnerability Database) and scans all project dependencies for known vulnerabilities.
        * `-B`: Runs Maven in **batch mode**, which is non-interactive and suitable for CI/CD environments.
    * **Outcome**: The scan generates a set of reports in various formats (XML, HTML, JSON) within the `target` directory, which will be used in subsequent steps.

2.  **`Upload OWASP Dependency-Check results`**:
    * **Purpose**: This step ensures that the scan reports are saved as a workflow artifact, making them easily accessible for review and archival.
    * **Methodology**: It uses the **`actions/upload-artifact@v3`** action.
    * **`with` inputs**:
        * `name: dependency-check-result`: The name of the artifact under which the reports will be stored.
        * `path`: Specifies the paths to the generated reports, including `dependency-check-report.xml`, `dependency-check-report.html`, and `dependency-check-report.json`. This provides multiple formats for flexibility in how the results are consumed.

3.  **`Log OWASP Dependency-Check Result and Create Comment If Vulnerabilities Found`**:
    * **Purpose**: This step provides immediate feedback on the scan results by parsing the HTML report to determine if any vulnerabilities were found. It then fails the job and/or creates a comment on a pull request or commit.
    * **Methodology**: It uses the **`actions/github-script@v7`** to run a Node.js script.
    * **`continue-on-error: true`**: This is an important setting to ensure the step continues even if an error occurs, such as a file not being found if the previous scan step failed.
    * **Script Breakdown**:
        * The script reads the `dependency-check-report.html` file.
        * It uses regular expressions to extract key information, such as **`Scan Info`** and the **`vulnerableCount`**.
        * The `Scan Info` is added to the job summary for quick access.
        * **Conditional Logic**:
            * If `vulnerableCount` is `0`, a success message is logged.
            * If `vulnerableCount` is greater than `0`, the job is marked as failed using **`core.setFailed()`**.
        * **Commenting**:
            * The script checks if the workflow was triggered by a **`pull_request`** event.
            * If so, it creates a pull request comment using **`github.rest.issues.createComment`** to alert the author about the vulnerabilities.
            * Otherwise, it assumes a standard commit and creates a commit comment using **`github.rest.repos.createCommitComment`**.
            * Both comments include a clear message, a mention to the commit author (`@github.actor`), and a summary of the scan info.
