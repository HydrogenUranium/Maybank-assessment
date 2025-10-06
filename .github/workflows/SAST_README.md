# Fortify SAST Workflow for GitHub Actions

This workflow performs a comprehensive **Static Application Security Testing (SAST)** scan using the **Fortify Static Code Analyzer**. It is designed as a reusable workflow (`workflow_call`) to be integrated into other CI/CD pipelines.

You can view the source `security-sast-fortify.yaml` workflow file [here](sast-be.yaml).

## Overview

This workflow is a complete Fortify SAST solution that automates the entire analysis process, from source code translation to report generation and artifact archiving. It is highly configurable and provides detailed outputs, enabling other workflows to make decisions based on scan results.

### Key Features:

-   **Modular Design**: Reusable workflow (`workflow_call`) for easy integration into various pipelines.
-   **Configurable Scan Modes**: Supports both `quick` and `full` scan modes for flexibility.
-   **Scan Precision**: Allows tuning of scan depth from 1 (fast) to 5 (thorough).
-   **Artifacts and Reporting**: Generates a Fortify Project Results (`.fpr`) file and a human-readable report in multiple formats (`pdf`, `doc`, `html`, `xls`).
-   **Quality Gate**: Can be configured to fail the workflow if the number of issues exceeds a defined threshold (`maxIssuesAllowed`).
-   **Caching**: Optional caching of Fortify translation data to speed up subsequent runs.
-   **Detailed Outputs**: Provides a variety of outputs, including issue counts by severity and the status of the scan, which can be consumed by the calling workflow.
-   **Job Summary**: Creates a rich summary in the GitHub Actions UI with links to scan artifacts and severity breakdowns.

## Usage

This workflow is intended to be called from another workflow. It should not be run directly from the Actions tab.

### Example Reusable Workflow Call

Here's how to call this workflow from another `.yml` file in your repository:

```yaml
jobs:
  run-fortify-scan:
    # Use a specific runner for the Fortify scan
    runs-on: arc-small-container
    steps:
      - name: Run Fortify SAST Scan
        uses: ./.github/workflows/sast-be.yaml
        with:
          git_branch_label: ${{ github.ref_name }}
          include: 'src' # Path to your source code
          scan-mode: 'full'
          maxIssuesAllowed: 5
```

### Inputs

| Name | Description | Type | Default | Required |
|:---|:---|:---|:---|:---:|
| `runner` | The GitHub Actions runner label. | `string` | `arc-small-container` | No |
| `container` | The Docker image with Fortify tools. | `string` | `sdm-proj-prg-docker.artifactory.dhl.com/cdlib/fortify:2.latest` | No |
| `git_branch_label` | The Git branch to checkout. | `string` | `master` | Yes |
| `exclude` | Paths or patterns to exclude from translation. | `string` | `""` | No |
| `include` | Source files or paths to include for translation. | `string` | | Yes |
| `reportFormat` | Format of the generated report (`pdf`, `doc`, `html`, `xls`). | `string` | `pdf` | No |
| `reportTemplate` | Report template to use (e.g., "Developer Workbook"). | `string` | `Developer Workbook` | No |
| `scanOptions` | Additional command-line options for the scan phase. | `string` | `""` | No |
| `translationOptions` | Additional command-line options for the translation phase. | `string` | `""` | No |
| `retention-days` | Number of days to retain artifacts. | `number` | `14` | No |
| `maxIssuesAllowed` | Max number of issues before failing the workflow (`-1` for unlimited). | `number` | `-1` | No |
| `timeout-minutes` | Timeout for the job in minutes. | `number` | `60` | No |
| `cache-enabled` | Enable or disable caching of translation data. | `boolean` | `true` | No |
| `scan-mode` | Scan mode: `quick` (high/critical) or `full`. | `string` | `full` | No |
| `scan-precision` | Scan precision level (1-5). | `number` | `2` | No |

### Outputs

| Name | Description |
|:---|:---|
| `fpr_file` | URL to the generated Fortify FPR file. |
| `report_file` | URL to the generated Fortify report file. |
| `issues_found` | Number of total issues found. |
| `critical_issues` | Number of critical severity issues. |
| `high_issues` | Number of high severity issues. |
| `medium_issues` | Number of medium severity issues. |
| `low_issues` | Number of low severity issues. |
| `scan_status` | Final scan status (`success` or `failure`). |

### Pipeline Process Flow

This workflow is a single job (`sast-fortify`) that executes a sequence of steps within a Docker container equipped with the Fortify Static Code Analyzer.

#### Step-by-Step Process:

1.  **`Checkout repository`**:
    * **Purpose**: Fetches the source code from the specified `git_branch_label`.
    * **Details**: Uses `actions/checkout@v4` with `fetch-depth: 0` to ensure a full clone, which is often required for accurate static analysis.

2.  **`Validate inputs`**:
    * **Purpose**: Ensures that the provided inputs are valid before starting the resource-intensive scan.
    * **Details**: A bash script checks that `reportFormat`, `include`, `scan-precision`, and `scan-mode` inputs are within the expected values. The workflow will fail early if any validation check fails.

3.  **`Verify Fortify CLI tools`**:
    * **Purpose**: Confirms that the necessary Fortify command-line tools (`sourceanalyzer`, `FPRUtility`, `BIRTReportGenerator`) are available in the container's path.
    * **Details**: A simple bash script checks for the existence of these commands, failing the job if any are missing.

4.  **`Cache Fortify translation data`**:
    * **Purpose**: Speeds up repeated scans by caching the intermediate translation data.
    * **Details**: Uses `actions/cache@v4` to cache the `/opt/fortify/.fortify` directory, which contains translated source code information. The cache key is tied to the `github.sha` to ensure the cache is unique to each commit.

5.  **`Clean Fortify session`**:
    * **Purpose**: Ensures that the Fortify build environment is clean before starting a new translation.
    * **Details**: Executes `sourceanalyzer -b <build_id> -clean` to remove any stale analysis files.

6.  **`Translate sources`**:
    * **Purpose**: This is the first main phase of the scan, where source code is translated into an intermediate representation that Fortify can analyze.
    * **Details**: The `sourceanalyzer` command is run with the `include` and `exclude` inputs to specify which files to process.

7.  **`Show translated files`**:
    * **Purpose**: Provides visibility into which files were successfully translated.
    * **Details**: Executes `sourceanalyzer -show-files` to list all the files that will be included in the scan.

8.  **`Perform scan`**:
    * **Purpose**: Executes the core static analysis on the translated code.
    * **Details**: The `sourceanalyzer -scan` command is run with inputs for `scan-mode`, `scan-precision`, and any additional `scanOptions`. The final output is the `FPR` file.

9.  **`List issues`**:
    * **Purpose**: Creates a human-readable list of the issues found in the scan.
    * **Details**: Uses `FPRUtility` to extract and format the issues from the `.fpr` file into a CSV file.

10. **`Generate report`**:
    * **Purpose**: Generates a security report in a specified format using a template.
    * **Details**: The `BIRTReportGenerator` tool is used to create a report from the `.fpr` file, using the `reportTemplate` and `reportFormat` inputs.

11. **`List severity counts`**:
    * **Purpose**: Parses the `.fpr` file to count the number of issues by severity.
    * **Details**: A bash script uses `FPRUtility` and `grep` to count `critical`, `high`, `medium`, and `low` issues. These counts are then exported as outputs for the next step.

12. **`Upload fpr`, `Upload report`, `Upload issues`, `Upload archive results`, `Upload scan log`**:
    * **Purpose**: Archives all the generated Fortify artifacts as GitHub workflow artifacts for download and retention.
    * **Details**: The `actions/upload-artifact@v3` action is used to upload the FPR file, security report, issues CSV, a full archive of all Fortify-related files, and the scan log. The `retention-days` input controls how long these artifacts are available.

13. **`Summarize and Set Outputs`**:
    * **Purpose**: This crucial final step consolidates all the scan results, creates a rich summary, and sets the final workflow outputs.
    * **Details**: A bash script dynamically creates a markdown-formatted job summary with details about the scan mode, precision, issue counts, and links to download the artifacts. It also sets the workflow outputs, including `issues_found`, `critical_issues`, `high_issues`, `low_issues`, and the final `scan_status`.
    * **Quality Gate Enforcement**: It checks if the `maxIssuesAllowed` input is set and if the total number of issues exceeds this limit. If it does, the `scan_status` is set to `failure`, and the workflow exits with a non-zero status, effectively failing the job.
