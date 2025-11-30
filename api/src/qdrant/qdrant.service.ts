import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';

/**
 * Service to interact with Qdrant vector store.
 * Provides methods to create and retrieve vector stores
 * based on the application configuration.
 * @class QdrantService
 * @example
 * const qdrantService = new QdrantService(configService);
 * const vectorStore = qdrantService.getVectorStore('my-collection');
 * // Use vectorStore for further operations
 * @author Cristono Wijaya
 */
@Global()
@Injectable()
export class QdrantService {
  constructor(private readonly configService: ConfigService) {}

  public getVectorStore(collectionName: string) {
    const embeddings = new OpenAIEmbeddings({
      modelName: 'text-embedding-3-small',
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    const vectorStore = new QdrantVectorStore(embeddings, {
      url: this.configService.get<string>('QDRANT_URL'),
      collectionName,
    });
    return vectorStore;
  }
}
