import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type productDocument=Product&Document

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: String;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop([String]) 
  images: string[];

  @Prop({ required: true })
  InStock: Boolean;
}

export const ProductSchema=SchemaFactory.createForClass(Product)