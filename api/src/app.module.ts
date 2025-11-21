import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VectorStorageModule } from './vector-storage/vector-storage.module';
import { databaseConfig } from './config/database.config';
import { appConfig } from './config/app.config';
import { ChatModule } from './chat/chat.module';
import { QdrantModule } from './qdrant/qdrant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, appConfig],
      cache: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        return {
          uri: dbConfig.uri,
          ...dbConfig.options,
        };
      },
      inject: [ConfigService],
    }),
    VectorStorageModule,
    ChatModule,
    QdrantModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
