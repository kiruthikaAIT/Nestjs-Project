import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, productDocument } from '../schemas/products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { MESSAGES } from 'src/utils/const';
import { CreateProductDto, UpdateProductDto } from 'src/Dto/product.dto';
import { BaseService } from './base.service';
import {
  DateRangeFilter,
  FilterStrategy,
  NameFilter,
  StockFilter,
} from 'src/common/filter-statergy';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable()
export class ProductService extends BaseService<productDocument> {
  constructor(
    @InjectModel(Product.name) private productModel: Model<productDocument>,
  ) {
    super(productModel);
  }

  // CREATE

  async createProduct(productDetails: CreateProductDto) {
    return this.create(productDetails); // 👈 calling parent create() method
  }

  // READ ALL PRODUCTS (optional: add extra logic here)
  async getAllProducts() {
    return this.findAll(); // calls BaseService.findAll
  }

  // READ PRODUCT BY ID
  async getProductById(id: string) {
    return this.findById(id); // calls BaseService.findById
  }

  // UPDATE PRODUCT BY ID
  async updateProduct(id: string, updateData: UpdateProductDto) {
    return this.updateById(id, updateData); // calls BaseService.updateById
  }

  // DELETE PRODUCT BY ID
  async deleteProduct(id: string) {
    await this.deleteById(id); // calls BaseService.deleteById
    return { success: true, message: MESSAGES.DELETED };
  }

  async filterProducts(
    filter: { name?: string; startDate?: string; InStock?: boolean },
    page = 1,
    limit = 10,
  ) {
    const query: FilterQuery<productDocument> = {};

    const strategies: FilterStrategy<productDocument>[] = [];
    if (filter.name) strategies.push(new NameFilter(filter.name));
    if (filter.InStock !== undefined) strategies.push(new StockFilter(filter.InStock));
    if (filter.startDate) strategies.push(new DateRangeFilter(filter.startDate));

    strategies.forEach((strategy) => strategy.apply(query));

    const total = await this.productModel.countDocuments(query).exec();
    const products = await this.productModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    if (!products || products.length === 0) {
      throw new NotFoundException(MESSAGES.NOT_FOUND);
    }

    return { products, total };
  }

  // FILTER PRODUCTS
  // async filterProducts(filter: {
  //   name?: string;
  //   startDate?: string; // ISO date string
  //   endDate?: string; // ISO date string
  //   InStock?: boolean;
  // }): Promise<Product[]> {
  //   try {
  //     const query: any = {};
  //     // Filter by name (case-insensitive partial match)
  //     if (filter.name) {
  //       query.name = { $regex: filter.name, $options: 'i' };
  //     }
  //     // Filter by created date range
  //     if (filter.startDate || filter.endDate) {
  //       query.createdAt = {};
  //       if (filter.startDate) {
  //         query.createdAt.$gte = new Date(filter.startDate);
  //       }
  //       if (filter.endDate) {
  //         query.createdAt.$lte = new Date(filter.endDate);
  //       }
  //     }
  //     console.log('stock', filter.InStock, typeof filter.InStock);
  //     // Filter by stock availability
  //     if (filter.InStock !== undefined) {
  //       query.InStock = filter.InStock; // true or false
  //     }
  //     console.log(query);
  //     const products = await this.productModel.find(query).exec();
  //     if (!products || products.length === 0) {
  //       throw new NotFoundException(MESSAGES.NOT_FOUND);
  //     }
  //     return products;
  //   } catch (error) {
  //     console.error('Error filtering products:', error.message);
  //     throw error;
  //   }
  // }
}
