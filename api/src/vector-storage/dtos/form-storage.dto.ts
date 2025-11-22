import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO for storing form metadata.
 * Includes name and optional description.
 * @exports
 * @class FormStorageDto
 * @typedef {Object} FormStorageDto
 * @property {string} name - Name of the storage
 * @property {string} [description] - Optional description of the storage
 * @author Cristono Wijaya
 */
export class FormStorageDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'Storage name must be between 1 and 100 characters' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Description must not exceed 500 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;
}