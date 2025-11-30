import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

/**
 * Custom pipe to validate MongoDB ObjectId parameters
 * Ensures that route parameters are valid MongoDB ObjectIds
 * @author Cristono Wijaya
 */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value) {
      throw new BadRequestException(`${metadata.data} is required`);
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        `${metadata.data} must be a valid MongoDB ObjectId`,
      );
    }

    return value;
  }
}
