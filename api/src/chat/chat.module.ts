import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { QdrantModule } from 'src/qdrant/qdrant.module';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Storage, StorageSchema } from 'schemas/storage.schema';
import { Chat, ChatSchema } from 'schemas/chat.schema';
import { ChatMessage, ChatMessageSchema } from 'schemas/chat-message.schema';

@Module({
  providers: [ChatService],
  imports: [
    MongooseModule.forFeature([
      { name: Storage.name, schema: StorageSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
    QdrantModule,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
