import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Storage } from "./storage.schema";
import { ChatMessage } from "./chat-message.schema";

/**
 * Mongoose Schema for Chat collection.
 * Represents a chat entity with threadId, title, storageId, description, and createdAt.
 * @author Cristono Wijaya
 * @returns {ChatDocument} The Mongoose document for Chat.
 */
export type ChatDocument = HydratedDocument<Chat>;

/**
 * Mongoose Schema Definition for Chat.
 * Includes properties for threadId, title, storageId, description, and createdAt with validation.
 * @property {string} threadId - The ID of the chat thread (required).
 * @property {string} title - The title of the chat session (required).
 * @property {string} storageId - The ID of the associated storage (required).
 * @property {string} description - The description of the chat session (optional).
 * @property {Date} createdAt - The timestamp of when the chat was created.
 * @author Cristono Wijaya
 */
@Schema({ collection: 'chat' })
export class Chat {
  /**
   * name of the chat session.
   * @type {string}
   * @required
   */
  @Prop({ required: true })
  name: string;

  /**
   * ID of the associated storage.
   * @type {string}
   * @required
   */
  @Prop({ type: Types.ObjectId, ref: Storage.name })
  storageId: Types.ObjectId;
  
  /**
   * Description of the chat session.
   * @type {string}
   * @optional
   */
  @Prop({ required: false })
  description?: string;
  
  /**
   * Timestamp of when the chat was created.
   * @type {Date}
   */
  @Prop({ required: false, default: Date.now })
  createdAt: Date;
}

/**
 * Mongoose Schema for Chat.
 * Defines the structure and properties of chat documents in the database.
 * @author Cristono Wijaya
 * @returns {Schema} The Mongoose schema for Chat.
 */
export const ChatSchema = SchemaFactory.createForClass(Chat);

/**
 * Virtual property to populate chat messages associated with the chat.
 * Establishes a relationship between Chat and ChatMessage collections.
 * @author Cristono Wijaya
 */
ChatSchema.virtual('chat_messages', {
  ref: "ChatMessage",
  localField: '_id',
  foreignField: 'chatId',
});