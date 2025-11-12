import { FilterQuery } from 'mongoose';
import { productDocument } from 'src/schemas/products.schema';

export interface FilterStrategy<T> {
  apply(query: FilterQuery<T>): void;
}

export class NameFilter implements FilterStrategy<productDocument> {
  constructor(private name: string) {}
  apply(query: FilterQuery<productDocument>): void {
    if (this.name) query.name = { $regex: this.name, $options: 'i' };
  }
}

export class StockFilter implements FilterStrategy<productDocument> {
  constructor(private inStock: boolean) {}
  apply(query: FilterQuery<productDocument>): void {
    if (this.inStock !== undefined) query.InStock = this.inStock;
  }
}

export class DateRangeFilter implements FilterStrategy<productDocument> {
  constructor(
    private startDate?: string,
    private endDate?: string,
  ) {}

  apply(query: FilterQuery<productDocument>): void {
    const createdAtFilter: FilterQuery<productDocument['createdAt']> = {};
    if (this.startDate) createdAtFilter.$gte = new Date(this.startDate);
    if (this.endDate) createdAtFilter.$lte = new Date(this.endDate);
    if (Object.keys(createdAtFilter).length > 0) {
      query.createdAt = createdAtFilter;
    }
  }
}
