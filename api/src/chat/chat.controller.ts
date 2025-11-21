import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SearchQueryDto } from './dtos/search-query.dto';
import { SimilarityValueDto } from './dtos/similarity-value.dto';
import { Response } from 'express';
import { ChatQueryDto } from './dtos/chat-query.dto';
import { CreateChatDto } from './dtos/create-chat.dto';
import { UpdateChatDto } from './dtos/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Handles requests to retrieve all chat sessions.
   * @returns An array of all chat sessions.
   * @author Cristono Wijaya
   */
  @Get('all-chats')
  async getAll() {
    try {
      const chats = await this.chatService.getAllChats();
      return {
        message: 'All chats endpoint',
        data: chats
      }
    }
    catch (error) {
      return {
        message: 'Error fetching chats'
      }
    }
  }

  /**
   * Handles requests to retrieve chat session details by ID.
   * @param id The ID of the chat session.
   * @returns The chat session details.
   * @author Cristono Wijaya
   */
  @Get('chat-detail/:id')
  async getChatDetail(@Param('id') id: string) {
    try {
      const chat = await this.chatService.getChatById(id);
      return {
        message: 'Chat detail endpoint',
        data: chat
      }
    }
    catch (error) {
      return {
        message: 'Error fetching chat detail'
      }
    }
  }

  /**
   * Handles chat creation requests.
   * @param {CreateChatDto} body The data required to create a new chat session.
   * @returns The newly created chat session.
   * @author Cristono Wijaya
   */
  @Post('create-chat')
  async createChat(@Body() body: CreateChatDto) {
    try {
      const chat = await this.chatService.createChat(body);
      return {
        message: 'Create chat endpoint',
        data: chat
      }
    }
    catch (error) {
      console.log(error);
      return {
        message: 'Error creating chat'
      }
    }
  }

  /**
   * Handles chat update requests.
   * @param {string} id The ID of the chat session to update.
   * @param {Partial<UpdateChatDto>} body The data to update the chat session with.
   * @return The updated chat session.
   * @author Cristono Wijaya
   */
  @Put('update-chat/:id')
  async updateChat(@Param('id') id: string, @Body() body: Partial<UpdateChatDto>) {
    try {
      const chat = await this.chatService.updateChat(id, body);
      return {
        message: 'Update chat endpoint',
        data: chat
      }
    }
    catch (error) {
      return {
        message: 'Error updating chat'
      }
    }
  }

  /**
   * Handles chat deletion requests.
   * @param {string} id The ID of the chat session to delete.
   * @returns The deleted chat session.
   * @author Cristono Wijaya
   */
  @Delete('delete-chat/:id')
  async deleteChat(@Param('id') id: string) {
    try {
      const chat = await this.chatService.deleteChat(id);
      return {
        message: 'Delete chat endpoint',
        data: chat
      }
    }
    catch (error) {
      return {
        message: 'Error deleting chat'
      }
    }
  }
  
  /**
   * Handles similarity search requests.
   * @param query The query string to search for.
   * @param collectionName The name of the Qdrant collection to search in.
   * @returns An array of similar documents.
   * @author Cristono Wijaya
   */
  @Post('similarity-search')
  similaritySearch(@Body() body:SearchQueryDto): Promise<SimilarityValueDto[]> {
    return this.chatService.similiaritySearch(body.query, body.storageId);
  }

  /**
   * Handles chat response requests.
   * @param query The user's query string.
   * @param collectionName The name of the Qdrant collection to use for context.
   * @returns The AI-generated chat response.
   * @author Cristono Wijaya
   */
  @Post('chat-response')
  chatResponse(@Body() body:ChatQueryDto): Promise<any> {
    return this.chatService.chatResponse(body.query, body.chatId);
  }

  /**
   * Handles streaming chat response requests.
   * @param query The user's query string.
   * @param collectionName The name of the Qdrant collection to use for context.
   * @returns A stream of AI-generated chat responses.
   * @author Cristono Wijaya
   */
  @Post('chat-stream')
  async chatStream(@Body() body:ChatQueryDto, @Res() res:Response): Promise<any> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    const stream = this.chatService.chatStream(body.query, body.chatId);
    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  }
}
