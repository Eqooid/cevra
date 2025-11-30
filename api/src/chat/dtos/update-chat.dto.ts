import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Transform } from 'class-transformer';

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
}
