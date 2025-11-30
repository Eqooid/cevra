import { IsString, IsNotEmpty, Length, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000, { message: 'Query must be between 1 and 1000 characters' })
  @Transform(({ value }) => value?.trim())
  query: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: 'Chat ID must be a valid MongoDB ObjectId' })
  chatId: string;
}
