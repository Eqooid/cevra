import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import type { Document } from "@langchain/core/documents";
import { PDFParse } from 'pdf-parse';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '../../schemas/storage.schema';
import { FormStorageDto } from './dtos/form-storage.dto';
import { Item } from '../../schemas/item.schema';
import { QdrantService } from 'src/qdrant/qdrant.service';
import { StorageDto } from './dtos/storage.dto';

/**
 * VectorStorageService handles operations related to vector storage,
 * including file uploads, storage management, and interaction with the Qdrant vector database.
 * @author Cristono Wijaya
 */
@Injectable()
export class VectorStorageService {
  
  /**
   * constructor vector storage service
   * @param {Model<Storage>} storageModel Storage model
   * @param {Model<Item>} itemModel Item model
   * @param {QdrantService} qdrantService Qdrant service
   */
  constructor(
    @InjectModel(Storage.name) private storageModel: Model<Storage>,
    @InjectModel(Item.name) private itemModel: Model<Item>,
    private readonly qdrantService: QdrantService
  ) {}

  /**
   * Splits the given text into smaller chunks using TokenTextSplitter.
   * @param text The text to be split.
   * @returns An array of text chunks.
   * @author Cristono Wijaya
   */
  private async _splitterText(text: string) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    return await splitter.splitText(text);
  }
  
  /**
   * Uploads a PDF file, extracts text, splits it into chunks, and stores them in the vector database.
   * @param file The PDF file to be uploaded.
   * @param storageId The ID of the storage to associate with the uploaded file.
   * @returns A success message upon completion.
   * @author Cristono Wijaya
   */
  public async uploadFile(file: Express.Multer.File, storageId: string): Promise<string> {
    const fileData = await file.buffer;
    const storage = await this.storageModel.findById(storageId);
    if (!storage) {
      throw new Error('Storage not found');
    }
    const vectorStore = this.qdrantService.getVectorStore(storage.qdrantCollectionName);

    const fileType = file.mimetype;
    if (fileType !== 'application/pdf') {
      throw new Error('Unsupported file type. Only PDF files are allowed.');
    }

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 10) {
      throw new Error(`File size exceeds the maximum limit of 10 MB.`);
    }
    
    const item = new this.itemModel({
      name: file.originalname,
      storageId: storage._id,
      type: file.mimetype,
      size: file.size,
      status: 'On Progress'
    });
    const newItem = await item.save();

    const parser = new PDFParse({
      data: fileData
    });
  
    const result = await parser.getText();
    
    for (let page of result.pages) {
      const chunks = await this._splitterText(page.text);
      const documents:Document[] = [];

      for (let chunk of chunks) {
        const doc: Document = {
          pageContent: chunk,
          metadata: {
            source: file.originalname,
            page: page.num,
            storageId: storage._id,
            fileId: newItem._id            
          }
        };
        documents.push(doc);
      }
      
      if (documents.length > 0) {
        await vectorStore.addDocuments(documents);
      }
    }

    newItem.status = 'Success';
    await newItem.save();

    return "File uploaded successfully";
  }
  
  /**
   * Creates a new storage entry in the database.
   * @param {FormStorageDto} data The data for the new storage.
   * @returns The created Storage document.
   * @author Cristono Wijaya
   */
  public async createStorage(data: FormStorageDto): Promise<Storage> {
    try {
      const createdStorage = new this.storageModel({
        qdrantCollectionName: `${data.name}_${uuidv4()}`,
        ...data
      });
      return createdStorage.save();
    }
    catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing storage entry in the database.
   * @param {string} id The ID of the storage to update.
   * @param {Partial<FormStorageDto>} data The updated data for the storage.
   * @returns The updated Storage document.
   * @author Cristono Wijaya
   */
  public async updateStorage(id: string, data: Partial<FormStorageDto>): Promise<Storage> {
    try {
      return this.storageModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all storage entries from the database.
   * @returns An array of Storage documents.
   * @author Cristono Wijaya
   */
  public async getAllStorages(): Promise<StorageDto[]> {
    try {
      const storages:StorageDto[] = await this.storageModel.aggregate([
        {
          $lookup: {
            from: 'vector_item',
            localField: '_id',
            foreignField: 'storageId',
            as: 'items'
          }
        },
        {
          $addFields: {
          inProgress: {
            $size: {
              $filter: {
            input: '$items',
            as: 'item',
            cond: { $eq: ['$$item.status', 'On Progress'] }
              }
            }
          },
          completed: {
            $size: {
              $filter: {
            input: '$items',
            as: 'item',
            cond: { $eq: ['$$item.status', 'Success'] }
              }
            }
          },
          failed: {
            $size: {
              $filter: {
            input: '$items',
            as: 'item',
            cond: { $eq: ['$$item.status', 'Failed'] }
              }
            }
          },
          cancelled: {
            $size: {
              $filter: {
            input: '$items',
            as: 'item',
            cond: { $eq: ['$$item.status', 'Cancelled'] }
              }
            }
          },
          total: { $size: '$items' }
            }
        },
        {
          $project: {
            items: 0
          }
        }
      ]).sort({ createdAt: -1 }).exec();
      
      return storages;
    }
    catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a storage entry by its ID.
   * @param {string} id The ID of the storage to retrieve.
   * @returns The Storage document with the specified ID.
   * @author Cristono Wijaya
   */
  public async getStorageById(id: string): Promise<Storage> {
    try {
      const storage = await this.storageModel.findById(id).lean().exec();
      
      if (!storage) {
        return null;
      }
      
      const items = await this.itemModel.find({ storageId: storage._id }).lean().exec();
      
      const counts = {
        inProgress: 0,
        completed: 0,
        failed: 0,
        cancelled: 0,
        total: items.length
      };
      
      items.forEach(item => {
        switch (item.status) {
          case 'On Progress':
          counts.inProgress++;
          break;
          case 'Success':
          counts.completed++;
          break;
          case 'Failed':
          counts.failed++;
          break;
          case 'Cancelled':
          counts.cancelled++;
          break;
        }
      });
      
      return {
        ...storage,
        ...counts
      };
    }
    catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a storage entry by its ID.
   * @param {string} id The ID of the storage to delete.
   * @returns The deleted Storage document.
   * @author Cristono Wijaya
   */
  public async deleteStorage(id: string): Promise<Storage> {
    try {
      return this.storageModel.findByIdAndDelete(id).exec();
    }
    catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all file items associated with a specific storage ID.
   * @param {string} storageId The ID of the storage.
   * @returns An array of Item documents associated with the storage ID.
   * @author Cristono Wijaya
   */
  public async getFileItems(storageId: string): Promise<Item[]> {
    try {
      return this.itemModel.find({ storageId: new Types.ObjectId(storageId) }).exec();
    }
    catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a specific file item from a storage and the vector database.
   * @param {string} storageId The ID of the storage.
   * @param {string} itemId The ID of the item to delete.
   * @returns void
   * @author Cristono Wijaya
   */
  public async deleteStorageItem(storageId: string, itemId: string): Promise<void> {
    try {
      const storage = await this.storageModel.findById(storageId);
      if (!storage) {
        throw new Error('Storage not found');
      }
      const vectorStore = this.qdrantService.getVectorStore(storage.qdrantCollectionName);    
      await this.itemModel.deleteOne({ 
        _id: new Types.ObjectId(itemId), 
        storageId: new Types.ObjectId(storageId) 
      }).exec();
      await vectorStore.delete({
        filter: {
          must: [
            { 
              key: 'metadata.fileId',
              match: { value: itemId }
            },
            {
              key: 'metadata.storageId',
              match: { value: storageId }
            }
          ]
        }
      });
    }
    catch (error) {
      throw error;
    }
  }
}
