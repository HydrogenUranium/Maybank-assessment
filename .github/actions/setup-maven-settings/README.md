# Setup Maven Settings

This GitHub Action configures the Maven `settings.xml` file with Artifactory credentials, enabling subsequent Maven commands to authenticate with the registry.

You can view the source `action.yaml` file [here](./action.yaml).

## Inputs

| Name | Description | Required |
|:---|:---|:---:|
| `artifactory-username` | The username for Artifactory authentication. | Yes |
| `artifactory-password` | The password or token for Artifactory authentication. | Yes |

## Example Usage

```yaml
- name: Configure Maven for Artifactory
  uses: ./.github/actions/setup-maven-settings
  with:
    artifactory-username: ${{ secrets.ARTIFACTORY_USERNAME }}
    artifactory-password: ${{ secrets.ARTIFACTORY_PASSWORD }}
```

## Action Details

This composite action ensures that Maven is properly configured to interact with a private **Artifactory** repository. It dynamically updates a `settings.xml` file with the necessary credentials from GitHub secrets, making the credentials available for Maven commands in subsequent steps.

### Step-by-Step Process:

1.  **`Move settings.xml to root folder`**:
    * **Purpose**: This step updates an existing `settings.xml` file with the provided credentials and places it in the standard Maven configuration directory (`/root/.m2`).
    * **Methodology**: It uses a bash script to perform the following actions:
        * Reads the content of a `settings.xml` file, which is expected to be located in the action's directory.
        * Uses the `sed` command to perform a string replacement, inserting the `artifactory-username` and `artifactory-password` into the appropriate XML tags.
        * Writes the modified content back to the `settings.xml` file.
        * Creates the `~/.m2` directory if it doesn't exist.
        * Copies the updated `settings.xml` to `~/.m2`, where Maven will automatically find and use it for authentication.
    * **Outcome**: After this step, any subsequent `mvn` commands in the workflow will use the `settings.xml` file with the correct credentials, allowing them to download dependencies and deploy artifacts to Artifactory.
    * **Note**: The action assumes your `settings.xml` template is in top-level folder of the repository. If your `settings.xml` file is somewhere else in your repository, you need to tell the action where to find it.

    To do this, you just change the file path in the `cat` command.
    **Original Command:**
    ```bash
    settings_xml_content=$(cat "settings.xml")
    ```

    If your settings.xml is in a subfolder named config:
    **Examples for Different Locations**
    ```Bash
    settings_xml_content=$(cat "config/settings.xml")
    ```
