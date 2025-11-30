import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/**
 * Custom pipe to validate file uploads
 * Checks file size, type, and prevents malicious files
 * @author Cristono Wijaya
 */
@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxSize = 10 * 1024 * 1024; // 10MB
  private readonly allowedTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  transform(
    file: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Check file size
    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `File size must not exceed ${this.maxSize / (1024 * 1024)}MB`,
      );
    }

    // Check file type
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedTypes.join(', ')}`,
      );
    }

    // Check for suspicious file extensions
    const suspiciousExtensions = [
      '.exe',
      '.bat',
      '.cmd',
      '.scr',
      '.pif',
      '.com',
      '.js',
      '.vbs',
      '.sh',
    ];
    const fileExtension = file.originalname
      .toLowerCase()
      .substring(file.originalname.lastIndexOf('.'));

    if (suspiciousExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `File extension ${fileExtension} is not allowed for security reasons`,
      );
    }

    // Sanitize filename
    file.originalname = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');

    return file;
  }
}
