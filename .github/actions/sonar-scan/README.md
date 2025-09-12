# Sonar Scan and Quality Gate

This GitHub Action runs a **SonarQube** scan on a Maven project, including dedicated analysis for pull requests, and checks the **Quality Gate** status. It fails the workflow and/or comments on the pull request or commit if the quality gate is not passed.

You can view the source `action.yaml` file [here](./action.yaml).

## Inputs

| Name | Description | Required |
|:---|:---|:---:|
| `pull-request-number` | The pull request number for branch analysis. | No |
| `pull-request-base-ref` | The base branch of the pull request. | No |
| `pull-request-head-ref` | The head branch of the pull request. | No |
| `sonar-host-url` | The URL of the SonarQube server. | Yes |
| `sonar-token` | The authentication token for SonarQube. | Yes |
| `sonar-project-key` | The unique key for the SonarQube project. | Yes |
| `sonar-project-name` | The name of the SonarQube project. | Yes |

## Example Usage

```yaml
- name: Sonar Scan and Quality Gate
  uses: ./.github/actions/sonar-scan
  with:
    pull-request-number: ${{ github.event.pull_request.number }}
    pull-request-base-ref: ${{ github.event.pull_request.base.ref }}
    pull-request-head-ref: ${{ github.event.pull_request.head.ref }}
    sonar-host-url: ${{ vars.SONAR_HOST_URL }}
    sonar-token: ${{ secrets.SONAR_TOKEN }}
    sonar-project-key: my-maven-project-key
    sonar-project-name: my-maven-project
```

## Action Details

This composite action provides a comprehensive solution for integrating **SonarQube** analysis into a GitHub Actions workflow, with specific functionality for pull request analysis and quality gate enforcement.

### Step-by-Step Process:

1.  **`Add additional parameters for PullRequest Analysis`**:
    * **Purpose**: This conditional step sets environment variables required for SonarQube's pull request analysis feature.
    * **Methodology**: It uses an `if` condition to check if the `pull-request-number` input is provided. If it is, a string containing the required SonarQube properties (`-Dsonar.pullrequest.key`, `-Dsonar.pullrequest.base`, `-Dsonar.pullrequest.branch`) is created and stored in the `SONAR_BRANCH_ANALYSIS` environment variable. This ensures the scanner runs a dedicated pull request analysis instead of a standard branch scan.

2.  **`Sonar Scan and Quality`**:
    * **Purpose**: This step executes the actual **SonarQube scan** and waits for the quality gate to be checked.
    * **Methodology**: It uses the `mvn` command with the **`sonar-maven-plugin`** to perform the analysis. It includes a variety of command-line arguments to configure the scan:
        * `verify`: Executes the Maven lifecycle up to the `verify` phase, ensuring the project is built and tested before the scan.
        * `org.sonarsource.scanner.maven:sonar-maven-plugin:5.0.0.4389:sonar`: The specific plugin and goal for the SonarQube analysis.
        * `continue-on-error: true`: This is a crucial setting that allows the workflow to continue even if the quality gate check fails in this step. The failure is then handled by the subsequent step to provide more descriptive feedback.
        * `-Dsonar.qualitygate.wait=true` and `-Dsonar.qualitygate.timeout=600`: These properties instruct the scanner to wait for up to **10 minutes** for the quality gate status to be determined by the SonarQube server.
        * It also includes parameters for `sonar-host-url`, `sonar-token`, `sonar-project-key`, `sonar-project-name`, and various inclusion/exclusion rules for file types and code coverage reports.

3.  **`Log SonarQube Scan Result and Create GitHub Comment If SonarQube Quality Gate Failed`**:
    * **Purpose**: This step provides comprehensive feedback on the scan results by creating a summary and, if the quality gate failed, a comment on the pull request or commit.
    * **Methodology**: It uses the **`actions/github-script@v7`** to run a Node.js script.
    * **Script Breakdown**:
        * It first constructs the URL to the relevant SonarQube dashboard, dynamically adjusting it for pull requests or regular branch scans.
        * It checks the `quality-gate` step's outcome. If it was not `success`, it proceeds with the following actions:
            * It fails the GitHub Action using **`core.setFailed()`**.
            * It creates a detailed comment on the pull request or commit, including a mention to the author and a link to the SonarQube dashboard.
            * It adds a "QUALITY GATE STATUS: FAILED" entry to the GitHub job summary with a link for easy navigation.
        * If the quality gate passed, it simply adds a "QUALITY GATE STATUS: PASSED" entry to the job summary.
