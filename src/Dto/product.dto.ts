import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty({ message: 'At least one image is required' })
  @IsOptional()
  images?: string[];

  @Type(() => Boolean)
  @IsBoolean({ message: 'InStock must be boolean' })
  @IsNotEmpty({ message: 'InStock is required' })
  InStock: boolean;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @IsOptional()
  price?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @Type(()=>Boolean)
  @IsBoolean({ message: 'InStock must be boolean' })
  @IsOptional()
  InStock?: boolean;
}
