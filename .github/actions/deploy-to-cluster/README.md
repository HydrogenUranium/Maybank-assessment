# Deploy to Kubernetes Cluster

This GitHub Action logs in to a Kubernetes cluster (**Azure AKS** or **OpenShift**), pulls a **Helm** chart from an **Artifactory** registry, and deploys the application.

You can view the source `action.yaml` file [here](./action.yaml).

## Inputs

| Name | Description | Required |
|:---|:---|:---:|
| `artifactory-username` | Artifactory username for Helm registry login. | Yes |
| `artifactory-password` | Artifactory password for Helm registry login. | Yes |
| `git-branch-label` | Git branch label. | Yes |
| `environment-name` | The target environment name (e.g., `dev`, `staging`, `prod`). | Yes |
| `artifact-id` | The Maven artifact ID, used as the Helm chart name and deployment name. | Yes |
| `artifact-version` | The Maven artifact version, used for pulling the Helm chart. | Yes |
| `az-client-id` | Azure Service Principal client ID for AKS authentication. | No |
| `az-client-secret` | Azure Service Principal client secret for AKS authentication. | No |
| `az-tenant-id` | Azure Service Principal tenant ID for AKS authentication. | No |
| `az-aks-sub-id` | Azure Subscription ID for the AKS cluster. | No |
| `az-aks-cluster-resource-group-name` | The resource group name of the AKS cluster. | No |
| `az-aks-cluster-name` | The name of the AKS cluster. | No |
| `oc-token` | OpenShift authentication token. | No |
| `oc-username` | OpenShift username for authentication. | No |
| `oc-password` | OpenShift password for authentication. | No |
| `oc-url` | The URL of the OpenShift cluster. | No |
| `helm-chart-deployment-path` | The local path to the Helm chart directory. | Yes |
| `helm-chart-value-path` | The local path to the Helm chart values directory. | Yes |
| `namespace` | The Kubernetes namespace for deployment. | Yes |
| `artifactory-helm-registry` | The URL of the Artifactory Helm registry. | Yes |
| `registry-repo` | The name of the Artifactory repository. | Yes |
| `artifactory-docker-registry` | The URL of the Artifactory Docker registry. | Yes |

## Example Usage

```yaml
- name: Deploy to cluster
  uses: ./.github/actions/deploy-to-cluster
  with:
    artifactory-username: ${{ secrets.ARTIFACTORY_USERNAME }}
    artifactory-password: ${{ secrets.ARTIFACTORY_PASSWORD }}
    git-branch-label: ${{ inputs.git_branch_label }}
    environment-name: ${{ inputs.environment_name }}
    artifact-id: ${{ needs.build-and-scan.outputs.artifact-id }}
    artifact-version: ${{ needs.build-and-scan.outputs.artifact-version }}
    az-client-id: ${{ vars.AZURE_SP_CLIENT_ID }}
    az-client-secret: ${{ secrets.AZURE_SP_CLIENT_SECRET }}
    az-tenant-id: ${{ vars.AZURE_SP_TENANT_ID }}
    az-aks-sub-id: ${{ vars.AZURE_AKS_CLUSTER_SUBSCRIPTION_ID }}
    az-aks-cluster-resource-group-name: ${{ vars.AZURE_AKS_CLUSTER_RESOURCE_GROUP_NAME }}
    az-aks-cluster-name: ${{ vars.AZURE_AKS_CLUSTER_NAME }}
    oc-token: ${{ secrets.OC_TOKEN }}
    oc-username: ${{ secrets.OC_USERNAME }}
    oc-password: ${{ secrets.OC_PASSWORD }}
    oc-url: ${{ vars.OC_URL }}
    helm-chart-deployment-path: ${{ vars.HELM_CHART_DEPLOYMENT_PATH }}
    helm-chart-value-path: ${{ vars.HELM_CHART_VALUE_PATH }}
    namespace: ${{ vars.AZURE_AKS_CLUSTER_NAMESPACE || vars.OC_NAMESPACE }}
    artifactory-helm-registry: ${{ vars.ARTIFACTORY_HELM_REGISTRY }}
    registry-repo: ${{ vars.ARTIFACTORY_DOCKER_REGISTRY_REPO }}
    artifactory-docker-registry: ${{ vars.ARTIFACTORY_DOCKER_REGISTRY }}
```

## Action Details

This composite action is designed to automate the deployment process for containerized applications, supporting both **Azure Kubernetes Service (AKS)** and **OpenShift** clusters. It uses **Helm** for declarative package management and relies on **Artifactory** as the central registry for both Docker images and Helm charts.

### Step-by-Step Process:

1.  **Login and Namespace Setup**:
    * **Conditional Logic**: The action first evaluates which set of cluster credentials has been provided. It checks for a complete set of Azure Service Principal details (`az-client-id`, `az-client-secret`, `az-tenant-id`, `az-aks-sub-id`) first. If these are available, it proceeds with Azure login. Otherwise, it checks for OpenShift token (`oc-token`) or username/password (`oc-username`, `oc-password`) credentials.
    * **Azure Login**:
        * `az login`: Authenticates with Azure using the provided **Service Principal credentials**.
        * `az account set`: Sets the correct Azure subscription for the AKS cluster.
        * `az aks get-credentials`: Retrieves the cluster credentials and merges them into the `kubeconfig`.
        * `kubelogin convert-kubeconfig`: Converts the `kubeconfig` for secure, token-based authentication with `kubectl`.
        * `kubectl config set-context`: Sets the current context to use the specified `namespace` for all subsequent `kubectl` commands.
    * **OpenShift Login**:
        * `oc login`: Authenticates with the OpenShift cluster using either a **token** or **username/password**.
        * `oc project`: Sets the active project (which is the equivalent of a namespace) for the current session.
    * **Error Handling**: If no valid credentials for either Azure or OpenShift are found, the action will terminate with a descriptive error message, ensuring a deployment is not attempted without proper access.

2.  **Helm Registry Login**:
    * This step authenticates with the **Artifactory Helm registry** using the `helm registry login` command.
    * It uses the provided **`artifactory-username`** and **`artifactory-password`** to securely log in to the registry specified by `artifactory-helm-registry`. This is necessary to pull the Helm chart in the next step.

3.  **Pull Helm Chart**:
    * The `helm pull` command is used to download the Helm chart from the Artifactory registry.
    * The chart's location is dynamically constructed as an OCI artifact URL: `oci://<artifactory-helm-registry>/<registry-repo>/<artifact-id>`.
    * The **`artifact-version`** input is used to specify the exact version of the chart to pull.
    * The `--untar` flag extracts the contents of the chart archive into the local file system, making it ready for deployment.

4.  **Deploy with Helm**:
    * The **`helm upgrade --install`** command is the core of the deployment process. This command is **idempotent**, meaning it can be run repeatedly without side effects.
    * **`--install`**: If a release with the name of `artifact-id` doesn't exist, it will be installed.
    * **`upgrade`**: If a release with that name already exists, it will be upgraded with the new chart.
    * **Arguments**:
        * `{{ inputs.artifact-id }}`: The name of the Helm release.
        * `{{ inputs.helm-chart-deployment-path }}/`: The path to the local Helm chart directory.
        * `--namespace`: Specifies the target namespace.
        * `--wait --timeout 10m`: Ensures the action waits up to **10 minutes** for the deployment to reach a ready state, providing robust feedback on deployment success or failure.
        * `-f`: Overrides values in the chart with a specified values file, dynamically selecting the correct file based on the **`environment-name`** input (e.g., `values-dev.yaml`).
        * `--set`: Dynamically injects the **`artifactory-docker-registry`** URL into the Helm values, ensuring the Helm chart's deployment manifest pulls the Docker image from the correct source.

5.  **Status and Details Retrieval**:
    * This step provides **post-deployment visibility and verification**.
    * **`helm history`** and **`helm status`** are used to inspect the release history and current state. The output of `helm status` is appended to the GitHub job summary for easy viewing.
    * **`kubectl rollout status`** and **`kubectl get pods/services`** are used to verify the health of the deployment and get details about the deployed pods and services.

6.  **Logout**:
    * This final cleanup step ensures that the **active login session** with the cluster is properly terminated, improving **security** by preventing lingering authenticated sessions. It logs out from either Azure or OpenShift based
