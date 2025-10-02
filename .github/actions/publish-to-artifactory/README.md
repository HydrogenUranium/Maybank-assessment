# Publish to Artifactory

This GitHub Action builds, tests, and deploys a Maven artifact to an **Artifactory** registry.

You can view the source `action.yaml` file [here](./action.yaml).

## Example Usage

```yaml
- name: Publish to Artifactory
  uses: ./.github/actions/publish-to-artifactory
```

## Action Details

This composite action provides a streamlined workflow for building a Maven project, running tests, and publishing the resulting artifacts to a remote Artifactory repository.

## Required `pom.xml` Configuration ⚙️

For the `mvn deploy` command to work, your project's `pom.xml` file **must** include a `<distributionManagement>` section. This section tells Maven where to publish your artifacts.

**Important:** The `<id>` in your `pom.xml` **must match** the `<id>` declared in your `settings.xml` file, which is configured by a previous action. This is how Maven links the repository URL with the correct credentials.

### Example `pom.xml` `distributionManagement` Section

```xml
<distributionManagement>
  <repository>
    <id>your-release-repo-id</id>
    <name>Your Artifactory Release Repository</name>
    <url>[https://artifactory.your-domain.com/path-to-your-release-repo](https://artifactory.your-domain.com/path-to-your-release-repo)</url>
  </repository>
  <snapshotRepository>
    <id>your-snapshot-repo-id</id>
    <name>Your Artifactory Snapshot Repository</name>
    <url>[https://artifactory.your-domain.com/path-to-your-snapshot-repo](https://artifactory.your-domain.com/path-to-your-snapshot-repo)</url>
  </snapshotRepository>
</distributionManagement>
```

**Note:**

* Replace `your-release-repo-id` and `your-snapshot-repo-id` with the actual IDs from your `settings.xml`.

* Replace the url values with the correct URLs for your `Artifactory repositories`.

### Step-by-Step Process:

1.  **`Deploy to Artifactory`**:
    * **Purpose**: This is the central step that orchestrates the entire build, test, and deployment process.
    * **Methodology**: It runs the **`mvn clean deploy -B`** command.
        * `clean`: Ensures a clean build by removing the previous build's output.
        * `deploy`: Executes the entire Maven lifecycle up to the `deploy` phase. This includes compiling the code, running tests, packaging the application (e.g., as a JAR or WAR file), and finally uploading the artifact to the configured Artifactory repository.
        * `-B`: Runs Maven in **batch mode**, which is non-interactive and prevents any prompts during the build and deploy process, making it suitable for automation.
    * **Outcome**: A successful run results in the compiled artifact (e.g., a `.jar` file) being published to the Artifactory repository.

2.  **`Upload Maven Artifact`**:
    * **Purpose**: This step saves the compiled `.jar` file as a workflow artifact, making it available for download directly from the GitHub Actions workflow run page. This is useful for inspection, debugging, or for use in subsequent jobs.
    * **Methodology**: It uses the **`actions/upload-artifact@v3`** action.
    * **`with` inputs**:
        * `name: application-jar`: The name assigned to the artifact, making it easily identifiable.
        * `path: target/*.jar`: The path to the artifact file. The wildcard `*.jar` is used to match the compiled JAR file in the `target` directory, regardless of its specific version number.
    * **Outcome**: A workflow artifact named `application-jar` is created, containing the packaged application file.

