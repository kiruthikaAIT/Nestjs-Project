import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type productDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true })
  InStock: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
