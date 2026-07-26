import { fileSystemClient } from "../../utils/azureDataLake.js"

export class ChatService {
    
    appendMessageToLake = async (chatId, messageData) => {
       const filePath = `chat/chat_${chatId}.jsonl`
       const fileClient = fileSystemClient.getFileClient(filePath)

        const lineToAppend = JSON.stringify({
            messageId: messageData.id,
            senderId: messageData.senderId,
            text: messageData.text,
            timestamp: new Date().toISOString(),
            }) + '\n'

        const buffer = Buffer.from(lineToAppend, 'utf-8')

        if (!(await fileClient.exists())) { await fileClient.create() }

        const properties = await fileClient.getProperties()
        const currentPosition = properties.contentLength

        await fileClient.append(buffer, currentPosition, buffer.length)
        await fileClient.flush(currentPosition + buffer.length)
    }

    getChatHistoryFromLake = async (chatId) => {
        const filePath = `chat/chat_${chatId}.jsonl`
        const fileClient = fileSystemClient.getFileClient(filePath)

        if (!(await fileClient.exists())) {
            return []
        }

        const downloadResponse = await fileClient.read()
        const content = await this.streamToString(downloadResponse.readableStreamBody)
        const messages = content.trim().split('\n').filter((line) => line.length > 0).map((line) => JSON.parse(line))

        return messages
    }

    streamToString = async (readableStream) => {
        return new Promise((resolve, reject) => {
            const chunks = []
            readableStream.on('data', (data) => chunks.push(data.toString('utf-8')))
            readableStream.on('end', () => resolve(chunks.join('')))
            readableStream.on('error', reject)
        })
    }

    getFileClient = async (chatId) => {
        const filePath = `chat/chat_${chatId}.jsonl`
        return fileSystemClient.getFileClient(filePath)
    }
}

export const chatService = new ChatService()