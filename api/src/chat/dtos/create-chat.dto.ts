/**
 * Data Transfer Object for creating a new chat.
 * @export
 * @class CreateChatDto
 * @typedef {Object} CreateChatDto
 * @property {string} name - Name of the chat
 * @property {string} [description] - Optional description of the chat
 * @property {string} storageId - Identifier for the associated storage
 * @author Cristono Wijaya
 */
export class CreateChatDto {
  name: string;
  description?: string;
  storageId: string;
}