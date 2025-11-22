import { IsString, IsNotEmpty, IsOptional, IsUrl, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Environment variables validation schema
 * Ensures all required environment variables are present and valid
 * @author Cristono Wijaya
 */
export class EnvironmentVariables {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT?: number = 3000;

  @IsOptional()
  @IsString()
  NODE_ENV?: string = 'development';

  @IsString()
  @IsNotEmpty()
  MONGODB_URI: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  QDRANT_URL: string;

  @IsString()
  @IsNotEmpty()
  OPENAI_API_KEY: string;
}