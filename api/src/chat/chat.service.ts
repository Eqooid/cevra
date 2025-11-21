import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { createAgent, summarizationMiddleware } from "langchain";
import { Model } from 'mongoose';
import { MongoClient } from "mongodb";
import * as z from "zod";
import { Storage } from 'schemas/storage.schema';
import { QdrantService } from 'src/qdrant/qdrant.service';
import { SimilarityValueDto } from './dtos/similarity-value.dto';
import { tool } from '@langchain/core/tools';
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { QdrantVectorStore } from '@langchain/qdrant';
import { CreateChatDto } from './dtos/create-chat.dto';
import { Chat } from 'schemas/chat.schema';
import { UpdateChatDto } from './dtos/update-chat.dto';
import { ChatMessage } from 'schemas/chat-message.schema';
import { ChatDto } from './dtos/chat.dto';
import { ChatDetailDto } from './dtos/chat-detail.dto';

/**
 * Service for handling chat-related operations.
 * Provides methods for similarity search and chat responses using Qdrant and OpenAI.
 * @author Cristono Wijaya
 */
@Injectable()
export class ChatService {

  /**
   * Checkpointer for saving agent state to MongoDB.
   * @private
   * @author Cristono Wijaya
   */
  private readonly _checkpointer: MongoDBSaver;

  /**
   * Constructor for ChatService.
   * @param qdrantService Service for interacting with Qdrant vector store.
   * @param configService Service for accessing configuration variables.
   * @param storageModel Mongoose model for Storage schema.
   * @param chatModel Mongoose model for Chat schema.
   * @author Cristono Wijaya
   */
  constructor(
    private readonly qdrantService: QdrantService,
    private readonly configService: ConfigService,
    @InjectModel(Storage.name) private readonly storageModel: Model<Storage>,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(ChatMessage.name) private readonly chatMessageModel: Model<ChatMessage>
  ) {
    const mongoUri = this.configService.get<string>('MONGODB_URI');
    const client = new MongoClient(mongoUri);
    this._checkpointer = new MongoDBSaver({ client });
  }

  /**
   * Private method to get the Qdrant vector store for a given collection name.
   * @param collectionName The name of the Qdrant collection.
   * @returns The Qdrant vector store instance.
   * @author Cristono Wijaya
   */
  private async _getVectorStore(collectionName: string) {
    return this.qdrantService.getVectorStore(collectionName);
  }

  /**
   * Private method to create a retrieval tool for the agent.
   * @param vectorStore The Qdrant vector store to use for retrieval.
   * @returns A tool for retrieving information related to a query.
   * @author Cristono Wijaya
   */
  private _retriveTool(vectorStore: QdrantVectorStore) {
    const retrieveSchema = z.object({ query: z.string() });
    return tool(
      async ({ query }) => {
        const retrievedDocs = await vectorStore.similaritySearchWithScore(query, 2);
        const serialized = retrievedDocs
          .map(
            ([doc]) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`  
          )
          .join("\n");
        return [serialized, retrievedDocs];
      },
      {
        name: "retrieve",
        description: "Retrieve information related to a query.",
        schema: retrieveSchema,
        responseFormat: "content_and_artifact",
      }
    );
  }
  
  /**
   * Retrieves all chat sessions.
   * @returns A promise that resolves to an array of Chat objects.
   * @author Cristono Wijaya
   */
  public async getAllChats(): Promise<ChatDto[]> {
    try {
      const data = await this.chatModel.aggregate([
        {
          $lookup: {
            from: 'vector_storage',
            localField: 'storageId',
            foreignField: '_id',
            as: 'storage'
          }
        },
        {
          $unwind: '$storage'
        },
        {
          $lookup: {
            from: 'chat_message',
            localField: '_id',
            foreignField: 'chatId',
            as: 'chatMessages'
          }
        },
        { 
          $addFields: {
            countMessages: { $size: '$chatMessages' },
            lastMessage: {
              $cond: {
                if: { $gt: [{ $size: '$chatMessages' }, 0] },
                then: { 
                  role: { $arrayElemAt: ['$chatMessages.role', -1] },
                  content: { $arrayElemAt: ['$chatMessages.content', -1] }
                },
                else: null
              }
            }
          } 
        },
        {
          $project: {
            _id: '$_id',
            name: 1,
            description: 1,
            storageId: 1,
            storageName: '$storage.name',
            countMessages: 1,
            lastMessage: 1,
            createdAt: 1
          }
        }
      ]).exec();
      
      return data;
    }
    catch (error) {
      throw new Error(`Failed to get chats: ${error.message}`);
    }
  }

  /**
   * Deletes a chat session by its ID.
   * @param {string} chatId The ID of the chat to delete.
   * @returns The deleted Chat document.
   * @author Cristono Wijaya
   */
  public async deleteChat(chatId: string): Promise<Chat> {
    try {
      return this.chatModel.findByIdAndDelete(chatId).exec();
    }
    catch (error) {
      throw new Error(`Failed to delete chat: ${error.message}`);
    }
  }

  /**
   * Creates a new chat session.
   * @param {CreateChatDto} data The data required to create a chat session.
   * @returns A promise that resolves when the chat session is created.
   * @author Cristono Wijaya
   */
  public async createChat(data: CreateChatDto): Promise<Chat> {
    try {
      const storage = await this.storageModel.findById(data.storageId);
      if (!storage) {
        throw new Error('Storage not found');
      }
      const newChat = new this.chatModel({
        name: data.name,
        description: data.description,
        storageId: storage._id
      });
      return newChat.save();
    }
    catch (error) {
      throw new Error(`Failed to create chat: ${error.message}`);
    }
  }

  /**
   * Retrieves a chat session by its ID.
   * @param {string} chatId The ID of the chat to retrieve.
   * @returns The Chat document with the specified ID.
   * @author Cristono Wijaya
   */
  public async getChatById(chatId: string): Promise<ChatDetailDto> {
    try {
      const data:any = await this.chatModel.findOne({
        _id: chatId
      }).populate("chat_messages").exec();

      return {
        _id: data._id,
        name: data.name,
        description: data.description,
        storageId: data.storageId,
        createdAt: data.createdAt,
        chatMessages: data.chat_messages.map(msg => ({
          id: msg.id,
          chatId: msg.chatId,
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt
        }))
      };
    }
    catch (error) {
      throw new Error(`Failed to get chat: ${error.message}`);
    }
  }

  /**
   * Updates a chat session by its ID.
   * @param {string} chatId The ID of the chat to update.
   * @param {Partial<UpdateChatDto>} data The data to update the chat session with.
   * @returns The updated Chat document.
   * @author Cristono Wijaya
   */
  public async updateChat(chatId: string, data: Partial<UpdateChatDto>): Promise<Chat> {
    try {
      return this.chatModel.findByIdAndUpdate(chatId, data, { new: true }).exec();
    }
    catch (error) {
      throw new Error(`Failed to update chat: ${error.message}`);
    }
  }

  /**
   * Performs a similarity search on the vector store.
   * @param query The query string to search for.
   * @param storageId The ID of the storage to use for the search.
   * @returns An array of SimilarityValueDto containing similar documents and their scores.
   * @author Cristono Wijaya
   */
  public async similiaritySearch(query: string, storageId: string): Promise<SimilarityValueDto[]> {
    const storage = await this.storageModel.findById(storageId);
    if (!storage) {
      throw new Error('Storage not found');
    }
    const vectorStore = await this._getVectorStore(storage.qdrantCollectionName);
    const response = await vectorStore.similaritySearchWithScore(query, 5);
    
    return response.map(resizeTo => {
      const [doc, score] = resizeTo;
      return {
        content: doc.pageContent,
        source: doc.metadata.source,
        page: doc.metadata.page,
        fileId: doc.metadata.fileId,
        storageId: doc.metadata.storageId,
        score
      };
    });
  }

  /**
   * Generates a chat response based on the user's query and the specified storage.
   * @param query The user's query string.
   * @param storageId The ID of the storage to use for context.
   * @returns The AI-generated chat response.
   * @author Cristono Wijaya
   */
  public async chatResponse(query: string, chatId: string): Promise<any> {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }
    
    const storage = await this.storageModel.findById(chat.storageId);
    if (!storage) {
      throw new Error('Storage not found');
    }
    const vectorStore = await this._getVectorStore(storage.qdrantCollectionName);
    const retrieve = this._retriveTool(vectorStore);

    const tools = [retrieve];
    const systemPrompt =`
      You are an AI assistant that helps users by providing information based on the documents retrieved from the storage.
      Use the retrieved documents to answer the user's query as accurately as possible.
    `;
  
    const agent = createAgent({
      model: "gpt-4o-mini",
      tools,
      systemPrompt,
      checkpointer: this._checkpointer,
      middleware: [summarizationMiddleware({ 
        model: "gpt-4o-mini",  
        messagesToKeep: 5 
      })]
    });
    
    let userInput = {
      messages: [{ role: "user", content: query }]
    }

    this.chatMessageModel.create({
      chatId: chat._id,
      role: 'user',
      content: query
    });

    const result = await agent.invoke(userInput, {
      configurable: { thread_id: chatId }
    });

    const aiResponse = this.chatMessageModel.create({
      chatId: chat._id,
      role: result.messages[result.messages.length - 1].type,
      content: result.messages[result.messages.length - 1].content
    });
    
    return aiResponse;
  }
  
  /**
  * Generates a streaming chat response based on the user's query and the specified storage.
  * @param query The user's query string.
  * @param storageId The ID of the storage to use for context.
  * @returns An async generator that yields chat response chunks.
  * @author Cristono Wijaya
  */
  public async *chatStream(query: string, storageId: string): AsyncGenerator<string> {
    const storage = await this.storageModel.findById(storageId);
    if (!storage) {
      throw new Error('Storage not found');
    }
    const vectorStore = await this._getVectorStore(storage.qdrantCollectionName);
    const retrieve = this._retriveTool(vectorStore);
    const tools = [retrieve];
    const systemPrompt =`
      You are an AI assistant that helps users by providing information based on the documents retrieved from the storage.
      Use the retrieved documents to answer the user's query as accurately as possible.
    `; 

    const agent = createAgent({
      model: "gpt-4o-mini",
      tools,
      systemPrompt,
      middleware: [summarizationMiddleware({ 
        model: "gpt-4o-mini",  
        messagesToKeep: 5 
      })]
    });
    
    let agentInputs = {
      messages: [{ role: "user", content: query }]
    }

    const stream = await agent.stream(agentInputs, {
      streamMode: "values",
    });

    for await (const step of stream) {
      const lastMessage = step.messages[step.messages.length - 1];
      yield JSON.stringify({
        type: lastMessage.type,
        content: lastMessage.content
      }) + '\n';
    }
  }
}
