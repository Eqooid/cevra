import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { VectorStorageService } from './vector-storage.service';
import { FormStorageDto } from './dtos/form-storage.dto';
import { ParseObjectIdPipe } from '../common/pipes/parse-objectid.pipe';
import { FileValidationPipe } from '../common/pipes/file-validation.pipe';

@Controller('vector-storage')
export class VectorStorageController {
  constructor(private readonly vectorStorageService: VectorStorageService) {}

  @Get('all-storages')
  async getAllStorages() {
    try {
      const storages = await this.vectorStorageService.getAllStorages();
      return {
        message: 'All storages endpoint',
        data: storages,
      };
    } catch {
      return { message: 'Error fetching storages' };
    }
  }

  @Get('storage-detail/:id')
  async getStorageDetail(@Param('id', new ParseObjectIdPipe()) id: string) {
    try {
      const storage = await this.vectorStorageService.getStorageById(id);
      return {
        message: 'Storage detail endpoint',
        data: storage,
      };
    } catch {
      return { message: 'Error fetching storage detail' };
    }
  }

  @Get('storage-items/:id')
  async getStorageItems(@Param('id', new ParseObjectIdPipe()) id: string) {
    try {
      const items = await this.vectorStorageService.getFileItems(id);
      return {
        message: 'Storage items endpoint',
        data: items,
      };
    } catch {
      return { message: 'Error fetching storage items' };
    }
  }

  @Post('create-storage')
  async createStorage(@Body() body: FormStorageDto) {
    try {
      const storage = await this.vectorStorageService.createStorage(body);
      return {
        message: 'Create storage endpoint',
        data: storage,
      };
    } catch {
      return { message: 'Error creating storage' };
    }
  }

  @Put('update-storage/:id')
  async updateStorage(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() body: Partial<FormStorageDto>,
  ) {
    try {
      const storage = await this.vectorStorageService.updateStorage(id, body);
      return {
        message: 'Update storage endpoint',
        data: storage,
      };
    } catch {
      return { message: 'Error updating storage' };
    }
  }

  @Delete('delete-storage/:storageId')
  async deleteStorage(
    @Param('storageId', new ParseObjectIdPipe()) storageId: string,
  ) {
    try {
      await this.vectorStorageService.deleteStorage(storageId);
      return { message: 'Storage deleted successfully' };
    } catch {
      return { message: 'Error deleting storage' };
    }
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 uploads per minute
  upload(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Param('id', new ParseObjectIdPipe()) storageId: string,
  ) {
    try {
      console.log(storageId);
      this.vectorStorageService.uploadFile(file, storageId);
      return { message: 'Upload endpoint' };
    } catch {
      return { message: 'Error uploading file' };
    }
  }

  @Delete('delete-item/:storageId/:itemId')
  async deleteStorageItem(
    @Param('storageId', new ParseObjectIdPipe()) storageId: string,
    @Param('itemId', new ParseObjectIdPipe()) itemId: string,
  ) {
    try {
      await this.vectorStorageService.deleteStorageItem(storageId, itemId);
      return { message: 'Storage item deleted successfully' };
    } catch {
      return { message: 'Error deleting storage item' };
    }
  }
}
