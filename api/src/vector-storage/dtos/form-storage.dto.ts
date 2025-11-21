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
  name: string;
  description?: string;
}