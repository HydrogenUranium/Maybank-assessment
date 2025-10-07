# Publish to Helm

This GitHub Action packages a Helm chart and pushes it to an **Artifactory** OCI registry.

You can view the source `action.yaml` file [here](./action.yaml).

## Inputs

| Name | Description | Required |
|:---|:---|:---:|
| `git-branch-label` | The git branch to checkout. | Yes |
| `artifact-id` | Maven artifact ID, used as part of the packaged chart's name. | Yes |
| `artifact-version` | Maven artifact version, used to version the Helm chart. | Yes |
| `artifactory-username` | Artifactory username for Helm registry login. | Yes |
| `artifactory-password` | Artifactory password for Helm registry login. | Yes |
| `helm-chart-deployment-path` | Path to the directory containing the Helm chart. | Yes |
| `artifactory-helm-registry` | The URL of the Artifactory Helm OCI registry. | Yes |
| `registry-repo` | The name of the Artifactory repository. | No |

## Example Usage

```yaml
- name: Publish Helm Chart
  uses: ./.github/actions/publish-to-helm
  with:
    git-branch-label: ${{ github.ref_name }}
    artifact-id: ${{ needs.evaluate-info.outputs.artifact-id }}
    artifact-version: ${{ needs.evaluate-info.outputs.artifact-version }}
    artifactory-username: ${{ secrets.ARTIFACTORY_USERNAME }}
    artifactory-password: ${{ secrets.ARTIFACTORY_PASSWORD }}
    helm-chart-deployment-path: ./chart-directory
    artifactory-helm-registry: ${{ vars.ARTIFACTORY_HELM_REGISTRY }}
    registry-repo: ${{ vars.ARTIFACTORY_HELM_REPO }}
```

## Action Details

This composite action automates the process of packaging a Helm chart and securely pushing it to an Artifactory OCI (Open Container Initiative) registry.

### Step-by-Step Process:

1.  **`Setup Helm`**:
    * **Purpose**: This step installs the **Helm CLI** to enable subsequent packaging and pushing commands.
    * **Methodology**: It uses the `azure/setup-helm@v4.3.0` action to download and configure Helm. The action specifies a custom `downloadBaseURL` from the internal Artifactory to ensure consistent and controlled tool versions.

2.  **`Package Helm Chart`**:
    * **Purpose**: This step bundles the Helm chart directory into a single compressed `.tgz` archive.
    * **Methodology**: It executes the `helm package` command, using the `helm-chart-deployment-path` input to locate the chart directory. The `--version` flag sets the version of the packaged chart using the `artifact-version` input, ensuring the version matches the associated application artifact.

3.  **`Login to Helm Registry`**:
    * **Purpose**: Authenticates with the Artifactory OCI registry to allow for pushing the packaged chart.
    * **Methodology**: It uses the `helm registry login` command with the provided `artifactory-username`, `artifactory-password`, and `artifactory-helm-registry` to securely establish an authenticated session.

4.  **`Push Helm Chart to Registry`**:
    * **Purpose**: This is the final step that uploads the packaged `.tgz` chart to the Artifactory registry.
    * **Methodology**: It uses the `helm push` command. The command dynamically constructs the name of the `.tgz` file using the `artifact-id` and `artifact-version` inputs. The destination registry URL is formatted as an OCI path, `oci://<artifactory-helm-registry>/<registry-repo>`, with the `registry-repo` being an optional component.
