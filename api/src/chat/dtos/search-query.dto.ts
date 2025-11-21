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
  query: string
  storageId: string
}