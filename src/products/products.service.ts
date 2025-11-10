import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product, productDocument } from './products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MESSAGES } from 'src/constants/const';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<productDocument>,
  ) {}

  // CREATE

  async CreateProduct(productDtls: Partial<Product>): Promise<string> {
    try {
      if (!productDtls.name || !productDtls.price) {
        throw new BadRequestException('Name and Price are required');
      }

      await this.productModel.create(productDtls);
      return MESSAGES.CREATED;
    } catch (error) {
      console.error('Error creating product:', error.message);
      throw error;
    }
  }

  // READ ALL
  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await this.productModel.find().exec();
      if (!products || products.length === 0) {
        throw new NotFoundException(MESSAGES.NOT_FOUND);
      }
      return products;
    } catch (error) {
      console.error('Error fetching products:', error.message);
      throw error;
    }
  }

  // READ BY ID
  async getProductById(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new NotFoundException(MESSAGES.NOT_FOUND);
      }
      return product;
    } catch (error) {
      console.error('Error fetching product by ID:', error.message);
      throw error;
    }
  }

  // UPDATE
  async updateProduct(
    id: string,
    updateData: Partial<Product>,
  ): Promise<Product> {
    try {
      const product = await this.productModel.findById(id);
      if (!product) {
        throw new NotFoundException(MESSAGES.NOT_FOUND);
      }

      const updated = await this.productModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      );
      if (!updated) {
        throw new NotFoundException(MESSAGES.NOT_FOUND);
      }
      return updated;
    } catch (error) {
      console.error('Error updating product:', error.message);
      throw error;
    }
  }

  // DELETE
  async deleteProduct(id: string): Promise<string> {
    try {
      const product = await this.productModel.findById(id);
      if (!product) {
        throw new NotFoundException(MESSAGES.NOT_FOUND);
      }

      await this.productModel.findByIdAndDelete(id);
      return MESSAGES.DELETED;
    } catch (error) {
      console.error('Error deleting product:', error.message);
      throw error;
    }
  }

  // FILTER PRODUCTS
  async filterProducts(filter: {
    name?: string;
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
    InStock?: boolean;
  }): Promise<Product[]> {
    try {
      const query: any = {};
      // Filter by name (case-insensitive partial match)
      if (filter.name) {
        query.name = { $regex: filter.name, $options: 'i' };
      }
      // Filter by created date range
      if (filter.startDate || filter.endDate) {
        query.createdAt = {};
        if (filter.startDate) {
          query.createdAt.$gte = new Date(filter.startDate);
        }
        if (filter.endDate) {
          query.createdAt.$lte = new Date(filter.endDate);
        }
      }
      console.log('stock',filter.InStock,typeof filter.InStock);
      // Filter by stock availability
      if (filter.InStock !== undefined) {
        query.InStock = filter.InStock; // true or false
      }
      console.log(query);
      const products = await this.productModel.find(query).exec();
      if (!products || products.length === 0) {
        throw new NotFoundException(MESSAGES.NOT_FOUND);
      }
      return products;
    } catch (error) {
      console.error('Error filtering products:', error.message);
      throw error;
    }
  }
}
