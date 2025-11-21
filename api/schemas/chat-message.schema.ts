import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Chat } from "./chat.schema";

/**
 * Mongoose Schema for ChatMessage collection.
 * Represents a chat message entity with chatId, content, and createdAt.
 * @author Cristono Wijaya
 * @returns {ChatMessageDocument} The Mongoose document for ChatMessage.
 */
export type ChatMessageDocument = HydratedDocument<ChatMessage>;

/**
 * Mongoose Schema Definition for ChatMessage.
 * Includes properties for chatId, content, and createdAt with validation.
 * @property {string} chatId - The ID of the associated chat (required).
 * @property {string} content - The content of the chat message (required).
 * @property {Date} createdAt - The timestamp of when the message was created.
 * @author Cristono Wijaya
 */
@Schema({ collection: 'chat_message' })
export class ChatMessage {
  
  /**
   * ID of the associated chat.
   * @type {string}
   * @required
   */
  @Prop({ type: Types.ObjectId, ref: Chat.name })
  chatId: Types.ObjectId;

  /**
   * Content of the chat message.
   * @type {string}
   * @required
   */
  @Prop({ required: true })
  content: string;

  /**
   * Role of the message sender (e.g., 'user', 'bot').
   * @type {string}
   * @required
   */
  @Prop({ required: true })
  role: string;

  /**
   * Timestamp of when the message was created.
   * @type {Date}
   */
  @Prop({ required: false, default: Date.now })
  createdAt: Date;
}

/**
 * Mongoose Schema Factory for ChatMessage.
 * Generates the schema based on the ChatMessage class definition.
 * @returns {ChatMessageSchema} The Mongoose schema for ChatMessage.
 * @author Cristono Wijaya
 */
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);