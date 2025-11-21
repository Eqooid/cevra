/**
 * Data Transfer Object for updating chat details.
 * @export
 * @class UpdateChatDto
 * @typedef {Object} UpdateChatDto
 * @property {string} name - Name of the chat
 * @property {string} [description] - Optional description of the chat
 * @author Cristono Wijaya
 */
export class UpdateChatDto {
  name: string;
  description?: string;
}