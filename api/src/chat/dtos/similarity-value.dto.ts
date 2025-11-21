/**
 * Data Transfer Object representing a similarity value.
 * @export
 * @class SimilarityValueDto
 * @typedef {Object} SimilarityValueDto
 * @property {string} content - The content of the similar item.
 * @property {string} source - The source from which the content is derived.
 * @property {number} page - The page number where the content is located.
 * @property {string} fileId - The identifier of the file containing the content.
 * @property {string} storageId - The identifier of the storage containing the file.
 * @property {number} score - The similarity score.
 * @author Cristono Wijaya
 */
export class SimilarityValueDto {
  content: string
  source: string
  page: number
  fileId: string
  storageId: string
  score: number
}