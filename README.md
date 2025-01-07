# React Azure Integration

This project demonstrates a simple integration with Azure, allowing users to log in, load files from Azure storage, and save JSON data back to Azure. It is built using React and related tools.

## Features

- **Azure Integration**: Enable user authentication and interaction with Azure storage.
- **File Management**: Load and save files to Azure Blob Storage.
- **Environment Variable Support**: Simplifies configuration by using `.env` for connection strings.

## Tech Stack

- **Frontend**: React, JavaScript
- **Styling**: CSS
- **Backend Services**: Azure Blob Storage

## Setup and Installation

### Prerequisites

- **Azure Account**: An active Azure account is required for Blob Storage.
- **Node.js**: Ensure Node.js is installed.
- **Azure Storage Connection String**: Obtain the connection string from your Azure account.

### Steps to Set Up

1. Clone the repository:

   ```bash
   git clone https://github.com/doronkabaso/react-azure.git
   cd react-azure
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```env
   AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=yourAccountName;AccountKey=yourAccountKey;EndpointSuffix=core.windows.net
   ```

   Replace `yourAccountName` and `yourAccountKey` with your Azure storage credentials.

4. Start the development server:

   ```bash
   npm start
   ```

5. Access the application at `http://localhost:3000`.

## Usage

- **Login**: Authenticate with Azure using the provided credentials.
- **Load Files**: Fetch files from Azure Blob Storage.
- **Save Data**: Save JSON data back to Azure storage.

## Deployment

To deploy this project, ensure the `.env` file is set up with the correct Azure connection string, and use a cloud hosting platform or Azure App Services for deployment.

## Screenshots

Include relevant screenshots of the project functionality here.

## Feedback

For suggestions or feedback, please raise an issue in the [GitHub repository](https://github.com/doronkabaso/react-azure/issues).

