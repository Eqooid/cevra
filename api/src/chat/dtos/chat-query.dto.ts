/**
 * DTO for querying chat messages.
 * Includes the search query and the chat ID.
 * Used for filtering messages within a specific chat.
 * @export
 * @class ChatQueryDto
 * @typedef {Object} ChatQueryDto
 * @property {string} query - The search query string.
 * @property {string} chatId - The ID of the chat to query.
 * @author Cristono Wijaya
 */
export class ChatQueryDto {
  query: string
  chatId: string
}