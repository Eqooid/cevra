/**
 * Data Transfer Object for Storage information.
 * @export
 * @class StorageDto
 * @typedef {Object} StorageDto
 * @property {string} [_id] - Unique identifier for the storage
 * @property {string} name - Name of the storage
 * @property {string} [description] - Optional description of the storage
 * @property {number} inProgress - Number of items in progress
 * @property {number} completed - Number of completed items
 * @property {number} failed - Number of failed items
 * @property {number} cancelled - Number of cancelled items
 * @property {number} total - Total number of items
 * @author Cristono Wijaya
 */
export class StorageDto {
  _id?: string;
  name: string;
  description?: string;
  inProgress: number;
  completed: number;
  failed: number;
  cancelled: number;
  total: number;
}