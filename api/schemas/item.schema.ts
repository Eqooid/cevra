import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Storage } from './storage.schema';

/**
 * Mongoose Schema for Item collection.
 * Represents an item entity with storageId, name, status, and type.
 * @author Cristono Wijaya
 * @returns {ItemDocument} The Mongoose document for Item.
 */
export type ItemDocument = HydratedDocument<Item>;

/**
 * Mongoose Schema Definition for Item.
 * Includes properties for storageId, name, status, and type with validation.
 * @property {string} storageId - The ID of the associated storage (required).
 * @property {string} name - The name of the item (required).
 * @property {string} status - The status of the item (required).
 * @property {string} type - The type of the item (required).
 * @property {string} status - The status of the item (required).
 * @author Cristono Wijaya
 */
@Schema({ collection: 'vector_item' })
export class Item {

  /**
   * ID of the associated storage.
   * @type {string}
   * @required
   */
  @Prop({ type: Types.ObjectId, ref: Storage.name })
  storageId: Types.ObjectId;
  
  /**
   * Name of the item.
   * @type {string}
   * @required
   */
  @Prop({ required: true })
  name: string;

  /**
   * Type of the item.
   * @type {string}
   * @required
   */
  @Prop({ required: true })
  type: string;

  /**
   * Status of the item (On Progress, Fail, Cancel, Success).
   * @type {string}
   * @required
   */
  @Prop({ required: true })
  status: string;

  /**
   * Size of the item in bytes.
   * @type {number}
   */
  @Prop({ required: false })
  size?: number;

  /**
   * Upload date of the item.
   * @type {Date}
   */
  @Prop({ required: false, default: Date.now })
  uploadDate: Date;
}

/**
 * Mongoose Schema Factory for Item.
 * Generates the schema based on the Item class definition.
 * @author Cristono Wijaya
 * @returns {Schema} The Mongoose schema for Item.
 */
export const ItemSchema = SchemaFactory.createForClass(Item);