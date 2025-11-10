import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RolesDocument=Roles&Document
@Schema({ timestamps: true })
export class Roles extends Document {
  @Prop({ required: true, enum: ['user', 'admin'] })
  name: string;

  @Prop({ type: [String] })
  permissions: string[];
}

export const RoleSchema=SchemaFactory.createForClass(Roles)