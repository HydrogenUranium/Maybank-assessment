# Azure Functions Splunk HEC Proxy
This is proxying mechanism/service for receiving AEM logs from AEMaaCS and pushing them to EventHub in Azure. From the EventHub the logs can be pulled asynchronously by consumers (Splunk farm) and the data are retained in the EventHub queue for 24h. After this time, the messages are deleted.

This application is deployed to Azure and running in the Azure Functions runtime.

## Configuration
The Function App contains the following important pieces of configuration:
* Event Hub connection string (`EVENTHUB_CONNECTION_STRING` environment variable)
* Event Hub name (`EVENTHUB_NAME_PROD`, `EVENTHUB_NAME_STAGE` environment variables)

Those configuration variables should be defined in the Function App Configuration blade. For local development, those variables have to be defined in the `local.settings.json` file (see example below).

## Requirements
* Python 3.10
* VScode with the Azure Functions extension (`ms-azuretools.vscode-azurefunctions`)
* File `local.settings.json` exists in the root folder of the Function App (this is not under version control as it contains sensitive data)
* Following Azure Resources are required
  * Function App (this is the app itself)
  * Application Insights (to allow debugging of the app running in the cloud)
  * App Service plan (Consumption plan pricing tier is sufficient)
  * Storage account (to store some Azure-managed persistent data)
  * Event Hubs Namespace with at least one Event Hub (this is where the data will be sent to)
* The System-assigned managed identity in the Azure Function app is enabled and granted an Azure Role `Azure Event Hubs Data Sender` on the resource group containing the Event Hub Namespace
* The Function App needs to have network access to the Event Hub endpoint over TCP ports 5671 and 5672 (AMQP protocol) in case the `transportType` is set to `amqpTcp`. Alternatively you can switch this to `amqpWebSockets` which then send the traffic over HTTPS port 443. See the `hots.json` file for details.

Sample content of the `local.settings.json`:
```
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_EXTENSION_VERSION": "~4",
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "APPLICATIONINSIGHTS_CONNECTION_STRING": "InstrumentationKey=...",
    "AzureWebJobsStorage": "DefaultEndpointsProtocol=https;AccountName=dhldiscoverba29;AccountKey=...",
    "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING": "DefaultEndpointsProtocol=https;AccountName=dhldiscoverba29;...",
    "WEBSITE_CONTENTSHARE": "dhl-discover-splunk-proxybf44",
    "EVENTHUB_NAME_STAGE": "splunk-dev",
    "EVENTHUB_NAME_PROD": "splunk-dev",
    "EVENTHUB_CONNECTION_STRING": "Endpoint=sb://dhl-discover-splunk-logs.servicebus.windows.net/;SharedAccessKeyName=...",
    "TOKEN_STAGE": "...",
    "TOKEN_PROD": ".."
  }
}
```

## How to

### Run the app locally
The easiest way of running/debugging this app locally is to install the official Azure Functions VScode extension (`ms-azuretools.vscode-azurefunctions`). Once you have that extension installed, and fulfill all the requirements which are stated below, you can running the main `__init__.py` file in a Python Debugger in VScode and attach the running debugger to the Azure Functions library. This will start the function endpoint on `localhost:7071` and start accepting connections.

### Deploy to Azure
The easiest way to deploy this app to Azure is to install the official Azure Functions VScode extensions (`ms-azuretools.vscode-azurefunctions`). After you login to Azure in VScode it'll load all your resources given by your roles and permissions and display the eligible Functions App to which you can deploy.

You can also deploy to a Deployment Slot from within the VScode. This then enables you to swap the slots later to perform zero-downtime deployment.
