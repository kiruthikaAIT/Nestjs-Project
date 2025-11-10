import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { Product } from './products.schema';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // single image upload
  @Post('single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    return { filename: file.filename, path: `/uploads/${file.filename}` };
  }

  // ✅ Multiple files upload
  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0)
      throw new BadRequestException('Files are required');
    return files.map((file) => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    }));
  }

  //   @Post('create')
  //   CreateProduct(@Body() productDtls) {
  //     return this.productService.CreateProduct(productDtls);
  //   }

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async CreateProduct(
    @Body() productDtls: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(productDtls);
    
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }
    const images = files.map((file) => `/uploads/${file.filename}`);
    productDtls.images = images;
    return this.productService.CreateProduct(productDtls);
  }


  @Get()
  async findAll() {
    return await this.productService.getAllProducts();
  }

  @Get('getsingle/:id')
  async findOne(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Product>) {
    return await this.productService.updateProduct(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }

  @Get('filter')
  async filterProducts(
    @Query('name') name?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('InStock') InStock?: string,
  ) {
    console.log(InStock);

    const products = await this.productService.filterProducts({
      name,
      startDate,
      endDate,
      InStock:
        InStock === 'true' ? true : InStock === 'false' ? false : undefined,
    });
    return products;
  }
}
