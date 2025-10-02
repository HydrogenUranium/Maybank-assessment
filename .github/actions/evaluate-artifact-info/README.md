# Evaluate Artifact Info

This GitHub Action extracts the **Maven `artifactId`** and **`version`** from a `pom.xml` file.

You can view the source `action.yaml` file [here](./action.yaml).

## Outputs

| Name | Description |
|:---|:---|
| `artifact-id` | The Maven artifact ID. |
| `artifact-version` | The Maven artifact version. |

## Example Usage

```yaml
- name: Evaluate Artifact Info
  id: get-artifact-info
  uses: ./.github/actions/evaluate-artifact-info

- name: Use Artifact Info in a later step
  run: |
    echo "Artifact ID: ${{ steps.get-artifact-info.outputs.artifact-id }}"
    echo "Artifact Version: ${{ steps.get-artifact-info.outputs.artifact-version }}"
```

## Action Details

This composite action provides a simple and effective way to programmatically retrieve key information from a Maven `pom.xml` file within a GitHub Actions workflow.

### Step-by-Step Process:

1.  **`Get Artifact Name and Version`**:
    * **Purpose**: This step is responsible for parsing the `pom.xml` to extract the artifact's unique identifier and its current version.
    * **Methodology**: It leverages **`mvn help:evaluate`**, a powerful Maven command, to read and evaluate project properties.
    * **Command breakdown**:
        * `mvn help:evaluate`: The core command to evaluate a given expression.
        * `-B`: Runs Maven in **batch mode**, which is non-interactive and ideal for automation.
        * `-Dexpression=project.artifactId`: Specifies that the expression to be evaluated is the **`artifactId`** of the project.
        * `-q`: Enables **quiet mode**, suppressing non-error messages from Maven.
        * `-DforceStdout`: Forces the output of the expression directly to standard output, making it easy to capture.
    * **Output Handling**: The output of this command is captured and assigned to the **`artifact-id`** and **`artifact-version`** outputs of the action using `>> $GITHUB_OUTPUT`. This makes the extracted values available to subsequent steps in the workflow.

2.  **`Print Artifact Information`**:
    * **Purpose**: This step provides a human-readable summary of the extracted artifact information directly in the GitHub Actions workflow run summary.
    * **Methodology**: It uses a bash script to format a markdown table containing the **`artifact-id`** and **`artifact-version`** and appends it to the **`$GITHUB_STEP_SUMMARY`** environment variable. This ensures the key outputs are easily visible without needing to inspect the raw logs.
