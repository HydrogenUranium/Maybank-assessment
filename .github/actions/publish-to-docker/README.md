# Publish to Docker

This GitHub Action builds and pushes a Docker image to a specified registry, handling authentication, tagging, and providing a summary of the build.

You can view the source `action.yaml` file [here](./action.yaml).

## Inputs

| Name | Description | Required |
|:---|:---|:---:|
| `artifact-id` | Maven artifact ID, used to name the Docker image. | Yes |
| `artifact-version` | Maven artifact version, used for tagging the Docker image. | Yes |
| `environment-name` | Target environment name (e.g., `dev`, `staging`), used in the image tag. | Yes |
| `artifactory-docker-registry` | The URL of the Artifactory Docker registry. | Yes |
| `registry-repo` | The name of the Artifactory repository. | No |
| `artifactory-username` | Artifactory username for registry authentication. | Yes |
| `artifactory-password` | Artifactory password for registry authentication. | Yes |
| `dockerfile` | Path to the Dockerfile to be used for the build. | Yes |

## Example Usage

```yaml
- name: Publish to Docker
  uses: ./.github/actions/publish-to-docker
  with:
    artifact-id: ${{ needs.evaluate-info.outputs.artifact-id }}
    artifact-version: ${{ needs.evaluate-info.outputs.artifact-version }}
    environment-name: ${{ inputs.environment_name }}
    artifactory-docker-registry: ${{ vars.ARTIFACTORY_DOCKER_REGISTRY }}
    registry-repo: ${{ vars.ARTIFACTORY_DOCKER_REGISTRY_REPO }}
    artifactory-username: ${{ secrets.ARTIFACTORY_USERNAME }}
    artifactory-password: ${{ secrets.ARTIFACTORY_PASSWORD }}
    dockerfile: ./Dockerfile
```

## Action Details

This composite action is designed to automate the process of building and publishing a Docker image to an **Artifactory** container registry. It ensures the image is correctly tagged and provides a summary of the build results.

### Step-by-Step Process:

1.  **`Download Maven Artifact`**:
    * **Purpose**: This step downloads the previously built Maven `.jar` file, which is a prerequisite for building the Docker image.
    * **Methodology**: It uses the **`actions/download-artifact@v3`** action to retrieve the artifact named `application-jar` and places it in the `target/` directory.

2.  **`Login to Registry`**:
    * **Purpose**: Authenticates with the target Docker registry before attempting to push the image.
    * **Methodology**: It uses the `docker login` command with the provided `artifactory-username` and `artifactory-password` inputs to securely log in to the specified `artifactory-docker-registry`.

3.  **`Build and Push Docker Container Image`**:
    * **Purpose**: This is the core step that builds the Docker image and pushes it to the registry.
    * **Methodology**: It uses a custom `dhl-actions/build-push-action-external@v6` action (which is a wrapper around `docker/build-push-action`).
    * **`with` inputs**:
        * `push: true`: Instructs the action to push the built image to the registry.
        * `tags`: Specifies the tags for the Docker image. Two tags are created:
            * `...:latest`: The image is tagged with `latest` for the specified environment.
            * `...:<artifact-version>`: The image is tagged with the specific Maven artifact version, ensuring traceability.
        * `file: ${{ inputs.dockerfile }}`: Uses the Dockerfile path provided in the inputs.
        * `context: .`: Specifies the build context as the current directory.

4.  **`Logout from Registry`**:
    * **Purpose**: As a security best practice, this step ensures that the active session with the Docker registry is terminated.
    * **Methodology**: It uses the `docker logout` command to log out from the `artifactory-docker-registry`.

5.  **`Create Build Summary`**:
    * **Purpose**: This step provides a clear, human-readable summary of the Docker image build details directly within the GitHub job summary.
    * **Methodology**: It uses the **`actions/github-script@v7`** to run a Node.js script that parses the outputs from the `build-and-push` step.
    * **Script Breakdown**:
        * It extracts the `imageid`, `digest`, and image name.
        * It constructs a markdown table and a link to the image's location in the Artifactory UI.
        * It appends this summary to the job's summary page using `core.summary`.
