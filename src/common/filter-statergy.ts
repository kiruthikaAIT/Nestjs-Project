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
  constructor(private startdate?: string) {} // only a single date

  apply(query: FilterQuery<productDocument>): void {
    if (this.startdate) {
      const start = new Date(this.startdate);
      start.setHours(0, 0, 0, 0); // start of day
      const end = new Date(this.startdate);
      end.setHours(23, 59, 59, 999); // end of day

      query.createdAt = { $gte: start, $lte: end };
    }
  }
}
