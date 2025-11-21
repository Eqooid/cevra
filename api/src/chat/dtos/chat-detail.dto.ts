/**
 * Data Transfer Object for Chat Details
 * @export
 * @class ChatDetailDto
 * @typedef {Object} ChatDetailDto
 * @property {string} [_id] - Unique identifier for the chat
 * @property {string} name - Name of the chat
 * @property {string} [description] - Optional description of the chat
 * @property {string} storageId - Identifier for the associated storage
 * @property {string} [storageName] - Name of the associated storage
 * @property {number} [countMessages] - Optional count of messages in the chat
 * @property {string} [lastMessage] - Optional content of the last message
 * @property {Date} [createdAt] - Optional creation date of the chat
 * @property {any[]} [chatMessages] - Optional array of chat messages
 * @author Cristono Wijaya
 */
export class ChatDetailDto {
  _id?: string;
  name: string;
  description?: string;
  storageId: string;
  storageName?: string;
  countMessages?: number;
  lastMessage?: string;
  createdAt?: Date;
  chatMessages?: any[];
}