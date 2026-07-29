// singleton class for azure datalake instance
import { DataLakeServiceClient } from '@azure/storage-file-datalake'

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
const serviceClient = DataLakeServiceClient.fromConnectionString(connectionString)

const fileSystemClient = serviceClient.getFileSystemClient('raw')
export { fileSystemClient }