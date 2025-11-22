import { IsString, IsNotEmpty, Length, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Data Transfer Object for searching within a chat storage.
 * @export
 * @class SearchQueryDto
 * @typedef {Object} SearchQueryDto
 * @property {string} query - The search query string.
 * @property {string} storageId - The ID of the storage to search within.
 * @author Cristono Wijaya
 */
export class SearchQueryDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000, { message: 'Query must be between 1 and 1000 characters' })
  @Transform(({ value }) => value?.trim())
  query: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: 'Storage ID must be a valid MongoDB ObjectId' })
  storageId: string;
}