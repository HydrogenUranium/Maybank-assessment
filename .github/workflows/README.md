# CI/CD Pipeline Using GitHub Actions

This README provides a detailed guide on how to use the CI/CD pipeline defined in the GitHub Actions workflow.

You can view the source `main.yaml` workflow file [here](./main.yaml).

## Overview

This CI/CD pipeline automates the building, scanning, and deployment of your application. It features modular jobs for security scanning (SonarQube, OWASP, Fortify) and publishing artifacts to Artifactory, Docker, and Helm registries, with deployments to Azure/OpenShift.

The workflow is designed to be triggered both manually via `workflow_dispatch` and as a reusable workflow via `workflow_call`.

## Prerequisites

Before running the pipeline, ensure the following GitHub configuration is in place.

### Request for GitHub Action Runner

- Submit a request for a GitHub Action runner and set up the runner group in your Git organization. For more details, please refer to the following link: [Get Started with GitHub Actions](https://devsecops.dhl.com/services/build/github-actions/get-started).

### Repository Variables and Secrets

These variables and secrets should be set in your GitHub repository under **Settings > Secrets and variables > Actions**.

#### General Configuration

| Type | Key | Description |
| :--- | :--- | :--- |
| **Variable** | `ACTION_RUNNER_NAME` | The name of your self-hosted GitHub Actions runner. |
| **Variable** | `HELM_CHART_DEPLOYMENT_PATH` | The path to the Helm chart directory. |
| **Variable** | `HELM_CHART_VALUE_PATH` | The path to the Helm chart values file. |
| **Variable** | `DOCKERFILE` | The path to the Dockerfile. |

#### SonarQube Configuration

| Type | Key | Description |
| :--- | :--- | :--- |
| **Variable** | `SONAR_HOST_URL` | The URL of the SonarQube server. |
| **Variable** | `SONAR_PROJECT_KEY` | The key for the SonarQube project. |
| **Variable** | `SONAR_PROJECT_NAME` | The name of the SonarQube project. |
| **Secret** | `SONAR_TOKEN` | Token for SonarQube authentication. |

#### Artifactory Configuration

| Type | Key | Description |
| :--- | :--- | :--- |
| **Variable** | `ARTIFACTORY_DOCKER_REGISTRY` | The Artifactory registry URL for Docker images. |
| **Variable** | `ARTIFACTORY_DOCKER_REGISTRY_REPO`| The Artifactory repository name for Docker images. |
| **Variable** | `ARTIFACTORY_HELM_REGISTRY` | The Artifactory registry URL for Helm charts. |
| **Variable** | `ARTIFACTORY_HELM_REGISTRY_REPO` | The Artifactory repository name for Helm charts. |
| **Secret** | `ARTIFACTORY_USERNAME` | Username for Artifactory authentication. |
| **Secret** | `ARTIFACTORY_PASSWORD` | Password for Artifactory authentication. |

#### Deployment Configuration (Choose one: Azure AKS or OpenShift)

**Azure AKS Configuration**

| Type | Key | Description |
| :--- | :--- | :--- |
| **Variable** | `AZURE_SP_CLIENT_ID` | The Azure Service Principal client ID for AKS deployment. |
| **Variable** | `AZURE_SP_TENANT_ID` | The Azure Service Principal tenant ID for AKS deployment. |
| **Variable** | `AZURE_AKS_CLUSTER_SUBSCRIPTION_ID` | The Azure AKS cluster subscription ID. |
| **Variable** | `AZURE_AKS_CLUSTER_RESOURCE_GROUP_NAME` | The Azure AKS cluster resource group name. |
| **Variable** | `AZURE_AKS_CLUSTER_NAME` | The Azure AKS cluster name. |
| **Variable** | `AZURE_AKS_CLUSTER_NAMESPACE` | The namespace for Azure AKS deployment. |
| **Secret** | `AZURE_SP_CLIENT_SECRET` | The Azure Service Principal client secret. |

**OpenShift Configuration**

| Type | Key | Description |
| :--- | :--- | :--- |
| **Variable** | `OC_URL` | The URL of the OpenShift cluster. |
| **Variable** | `OC_NAMESPACE` | The namespace for OpenShift deployment. |
| **Secret** | `OC_TOKEN` | OpenShift authentication token. (Optional with Token OR Username & Password Access) |
| **Secret** | `OC_USERNAME` | OpenShift username. (Optional with Token OR Username & Password Access) |
| **Secret** | `OC_PASSWORD` | OpenShift password. (Optional with Token OR Username & Password Access) |

### Environment Variables

These variables should be set in your GitHub repository environments under **Settings > Environments**. The workflow uses the `environment_name` input to select the correct set of variables for a deployment.

## Workflow Configuration

The pipeline is primarily triggered manually via `workflow_dispatch` or called by other workflows via `workflow_call`.

### Inputs

| Input Name | Description | Type | Default Value | Required | Options |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `environment_name` | Target environment (dev, staging, prod) | `string` or `choice` | `dev` | **Yes** | `dev`, `staging`, `prod` |
| `git_branch_label` | The Git branch to checkout and build | `string` | `master` | **Yes** | |
| `run_sonar_scan` | Run Sonar Scan for code quality analysis | `boolean` | `false` | **Yes** | `true`, `false` |
| `run_owasp_dependency_check` | Run OWASP Dependency Check for security vulnerabilities | `boolean` | `false` | **Yes** | `true`, `false` |
| `run_fortify_scan` | Run Fortify SAST Scan for static analysis | `boolean` | `false` | **Yes** | `true`, `false` |
| `build_and_publish` | Build the application and publish artifacts to Artifactory | `boolean` | `false` | **Yes** | `true`, `false` |
| `deploy` | Deploy the application to a Kubernetes cluster | `boolean` | `false` | **Yes** | `true`, `false` |
| `pull_request_number` | The number of the pull request (for workflow_call SonarQube) | `string` | `''` | No | |
| `pull_request_base_ref` | The base branch of the pull request (for workflow_call SonarQube) | `string` | `''` | No | |
| `pull_request_head_ref` | The head branch of the pull request (for workflow_call SonarQube) | `string` | `''` | No | |

## Steps in the Pipeline

This pipeline is composed of several jobs that run based on the provided inputs.

1.  **Workflow Inputs**: Prints a summary of the inputs used for the workflow run into the job summary.
2.  **Fortify SAST Scan**: An optional, standalone job that performs a Fortify scan on the codebase.
    * **Uses**: [`security-sast-fortify`](../workflows/SAST_README.md)
3.  **Build and Scan**: The core job that builds the application, runs tests, and performs security scans. It caches Maven packages for efficiency.
    * **Uses**:
        * [`actions/checkout@v4`](https://github.com/actions/checkout)
        * [`setup-maven-settings`](../actions/setup-maven-settings/README.md)
        * [`maven-build-and-test`](../actions/maven-build-and-test/README.md)
        * [`owasp-dependency-check`](../actions/owasp-dependency-check/README.md)
        * [`sonar-scan`](../actions/sonar-scan/README.md)
        * [`evaluate-artifact-info`](../actions/evaluate-artifact-info/README.md)
        * [`publish-to-artifactory`](../actions/publish-to-artifactory/README.md)
4.  **Publish to Docker and Helm**: If enabled, this job builds a Docker image and publishes it, along with the Helm chart, to Artifactory. This job depends on the `build-and-scan` job.
    * **Uses**:
        * [`actions/checkout@v4`](https://github.com/actions/checkout)
        * [`publish-to-docker`](../actions/publish-to-docker/README.md)
        * [`publish-to-helm`](../actions/publish-to-helm/README.md)
5.  **Deploy Application to Kubernetes Cluster**: This job handles the deployment to either Azure or OpenShift. The workflow has two separate jobs for this:
    * **Deploy after build and publish**: Triggered when both `deploy` and `build_and_publish` are true. Depends on both the `build-and-scan` and `publish-docker-and-helm` jobs.
    * **Deploy only**: Triggered when `deploy` is true and `build_and_publish` is false. This scenario uses previously built artifacts. It depends only on the `build-and-scan` job to retrieve artifact information.
    * **Uses**:
        * [`actions/checkout@v4`](https://github.com/actions/checkout)
        * [`deploy-to-cluster`](../actions/deploy-to-cluster/README.md)

## Usage

To use the pipeline, navigate to the **Actions** tab of your repository, select **Main Workflow**, and click **Run workflow**. Choose the desired options from the dropdowns and checkboxes, then click **Run workflow**.

### Example Scenarios

-   **To run all security scans without deploying:**
    -   `environment_name`: `dev`
    -   `run_sonar_scan`: `true`
    -   `run_owasp_dependency_check`: `true`
    -   `run_fortify_scan`: `true`
    -   `build_and_publish`: `false`
    -   `deploy`: `false`
-   **To build, publish, and deploy a new version to staging:**
    -   `environment_name`: `staging`
    -   `run_sonar_scan`: `true`
    -   `run_owasp_dependency_check`: `true`
    -   `run_fortify_scan`: `false`
    -   `build_and_publish`: `true`
    -   `deploy`: `true`
-   **To redeploy a previously built artifact to production:**
    -   `environment_name`: `prod`
    -   `build_and_publish`: `false`
    -   `deploy`: `true`

## Workflow Trigger

The pipeline can be initiated in two ways:

1.  **Manual Trigger (`workflow_dispatch`)**: A developer manually triggers the pipeline from the GitHub Actions UI. This is useful for on-demand builds, deployments, or testing specific features.
2.  **Reusable Workflow (`workflow_call`)**: The pipeline can be called by another workflow (e.g., a pull request or push to main branch workflow). This allows for standardization and reuse of the core CI/CD logic across multiple repositories.

## Pipeline Process Flow

The pipeline is composed of the following jobs, which can be run conditionally based on the workflow inputs.

### 1. Workflow Inputs

**Purpose**: To provide visibility into the configuration of the current workflow run.

**Process**: This is the first job to execute. It simply prints a summary of all the inputs (`environment_name`, `git_branch_label`, `run_sonar_scan`, etc.) to the job summary. This helps in debugging and provides a quick overview of the run's purpose without having to inspect the YAML file.

**Conditional Logic**: This job always runs.

### 2. Fortify SAST Scan

**Purpose**: To perform a Static Application Security Testing (SAST) scan using Fortify on the codebase.

**Process**:
* The job checks out the code from the specified branch (`git_branch_label`).
* It uses a dedicated composite action, `security-sast-fortify`, which is responsible for setting up the Fortify environment and running the scan.
* The scan results are then processed and, if configured, can be uploaded to the Fortify server.

**Conditional Logic**: This job runs only when the `run_fortify_scan` input is set to `true`. This allows for selective security scanning, which is useful for faster feedback cycles in development.

### 3. Build and Scan

**Purpose**: This is the core build job. It compiles the application, runs tests, performs quality and vulnerability scans, and evaluates artifact information for subsequent jobs.

**Process**:
1.  **Checkout Code**: Checks out the code from the branch specified by `git_branch_label`.
2.  **Setup Maven**: Uses the `setup-maven-settings` action to configure Maven with Artifactory credentials and mirror settings. This ensures consistent build environments.
3.  **Build & Test**: The `maven-build-and-test` action compiles the code and runs unit tests.
4.  **OWASP Dependency Check**: If `run_owasp_dependency_check` is `true`, the `owasp-dependency-check` action is executed to scan for known vulnerabilities in third-party dependencies.
5.  **SonarQube Scan**: If `run_sonar_scan` is `true`, the `sonar-scan` action performs a quality analysis of the code. It is configured to handle both standard branch scans and pull request-specific analysis by using the `pull_request_...` inputs. The `SONAR_PROJECT_KEY` and `SONAR_PROJECT_NAME` are used to associate the scan with the correct project on the SonarQube server.
6.  **Evaluate Artifact Info**: The `evaluate-artifact-info` action parses the `pom.xml` to extract the `artifact-id` and `artifact-version`. These are crucial for subsequent steps like publishing and deploying and are made available as outputs of this job.
7.  **Publish to Artifactory**: If `build_and_publish` is `true`, the `publish-to-artifactory` action uploads the generated `.jar` or `.war` file to the Artifactory repository.

**Conditional Logic**: This job runs only if `build_and_publish`, `run_sonar_scan`, `run_owasp_dependency_check`, or `deploy` is `true`. It's a foundational job that prepares the application for further steps.

### 4. Publish to Docker and Helm

**Purpose**: To containerize the application and publish the Docker image and Helm chart to Artifactory.

**Process**:
1.  **Checkout Code**: Checks out the code.
2.  **Publish to Docker**: The `publish-to-docker` action builds a Docker image from the `Dockerfile` and pushes it to the Artifactory Docker registry. The image is tagged using the `artifact-version` obtained from the `build-and-scan` job.
3.  **Publish to Helm**: The `publish-to-helm` action packages the Helm chart located at `HELM_CHART_DEPLOYMENT_PATH` and pushes it to the Artifactory Helm registry. The chart is versioned with the `artifact-version` to maintain consistency with the Docker image.

**Conditional Logic**: This job runs only when the `build_and_publish` input is set to `true`. This step is dependent on the `build-and-scan` job being successful, as indicated by the `needs` keyword in the workflow file.

### 5. Deploy Application to Kubernetes Cluster

**Purpose**: To deploy the application to the target Kubernetes cluster (Azure AKS or OpenShift).

**Process**: This is handled by two separate jobs in the workflow, both using the `deploy-to-cluster` action, but with different `needs` dependencies.

1.  **Conditional Deployment after Build and Publish**: This job runs if both `deploy` and `build_and_publish` are `true`. It depends on the successful completion of both the `build-and-scan` and `publish-to-docker-and-helm` jobs. It retrieves the artifact information (`artifact-id` and `artifact-version`) from the `build-and-scan` job.
2.  **Conditional Deployment Only**: This job runs if `deploy` is `true` but `build_and_publish` is `false`. This is for scenarios where a previously built and published artifact needs to be redeployed. It only depends on the `build-and-scan` job to get the artifact information. The `deploy-to-cluster` action then handles the following steps:
    * **Login to Cluster**: Logs into the specified Kubernetes cluster using either Azure Service Principal credentials or OpenShift credentials (token or username/password), based on which set of inputs is provided.
    * **Pull Helm Chart**: Pulls the Helm chart from the Artifactory Helm registry using the `artifact-id` and `artifact-version`.
    * **Deploy with Helm**: Executes a `helm upgrade --install` command to deploy the application, using the `values-${environment_name}.yaml` file for environment-specific configurations.
    * **Verify Deployment**: The action checks the rollout status of the deployment and retrieves details about the pods and services for verification.
    * **Logout**: Logs out from the cluster to ensure credentials are not left active.

**Conditional Logic**: This job or its counterpart runs only when the `deploy` input is set to `true`. The specific job that runs depends on the value of `build_and_publish`.
