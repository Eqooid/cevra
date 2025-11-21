import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Chat } from './chat.schema';

/**
 * Mongoose Schema for Storage collection.
 * Represents a storage entity with name and description.
 * @author Cristono Wijaya
 * @returns {StorageDocument} The Mongoose document for Storage.
 */
export type StorageDocument = HydratedDocument<Storage>;

/**
 * Mongoose Schema Definition for Storage.
 * Includes properties for name and description with validation.
 * @property {string} name - The name of the storage (max length 100, required).
 * @property {string} description - The description of the storage (max length 500, optional).
 * @author Cristono Wijaya
 */
@Schema({ collection: 'vector_storage' }) 
export class Storage {
  
  /**
   * Name of the storage.
   * @type {string}
   * @maxLength 100
   * @required
   */
  @Prop({ maxLength:100, required: true })
  name: string;

  /**
   * Description of the storage.
   * @type {string}
   * @maxLength 500
   * @optional
   */
  @Prop({ maxLength:500, required: false })
  description: string;

  /**
   * Qdrant collection name associated with the storage.
   * @type {string}
   * @required
   */
  @Prop({ required: true })
  qdrantCollectionName: string;

  /**
   * Creation date of the storage.
   * @type {Date}
   * @default Date.now
   */
  @Prop({ default: Date.now })
  createdAt: Date;
}

/**
 * Mongoose Schema Factory for Storage.
 * Generates the schema based on the Storage class definition.
 * @author Cristono Wijaya
 * @returns {Schema} The Mongoose schema for Storage.
 */
export const StorageSchema = SchemaFactory.createForClass(Storage);

/**
 * Virtual property to populate associated items in a storage.
 * Establishes a relationship between Storage and Item schemas.
 * @author Cristono Wijaya
 */
StorageSchema.virtual('items', {
  ref: 'vector_item',
  localField: '_id',
  foreignField: 'storageId',
});

/**
 * Virtual property to populate associated chats in a storage.
 * Establishes a relationship between Storage and Chat schemas.
 * @author Cristono Wijaya
 */
StorageSchema.virtual('chats', {
  ref: "Chat",
  localField: '_id',
  foreignField: 'storageId',
});
