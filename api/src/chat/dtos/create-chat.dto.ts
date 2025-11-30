import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  IsMongoId,
} from 'class-validator';
import { Transform } from 'class-transformer';

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
  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'Chat name must be between 1 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Description must not exceed 500 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: 'Storage ID must be a valid MongoDB ObjectId' })
  storageId: string;
}
