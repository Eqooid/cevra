import { Module } from '@nestjs/common';
import { QdrantService } from './qdrant.service';

/**
 * QdrantModule is a NestJS module that provides the QdrantService.
 * This module can be imported into other modules to utilize the QdrantService for
 * vector database operations.
 */
@Module({
  providers: [QdrantService],
  exports: [QdrantService],
})
export class QdrantModule {}
