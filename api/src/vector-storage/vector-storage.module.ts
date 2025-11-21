import { Module } from '@nestjs/common';
import { VectorStorageService } from './vector-storage.service';
import { VectorStorageController } from './vector-storage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Storage, StorageSchema } from '../../schemas/storage.schema';
import { Item, ItemSchema } from '../../schemas/item.schema';
import { QdrantModule } from 'src/qdrant/qdrant.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Storage.name, schema: StorageSchema },
      { name: Item.name, schema: ItemSchema }
    ]),
    QdrantModule
  ],
  providers: [VectorStorageService],
  controllers: [VectorStorageController]
})
export class VectorStorageModule {}
