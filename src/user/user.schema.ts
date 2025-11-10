import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import * as bcrypt from 'bcrypt';
import { Roles } from "src/roles/roles.schema";

export type UserDocument=Users &Document

@Schema({timestamps:true})
export class Users extends Document{
    @Prop({required:true})
    name:string

    @Prop({required:true})
    email:string

    @Prop({required:true})
    password:string

    @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
    role: Roles | Types.ObjectId;
}

export const UserSchema=SchemaFactory.createForClass(Users)

UserSchema.pre('save',async function (next) {
      if (!this.isModified('password')) return next();
    const hash=await bcrypt.hash(this.password,10)
    this.password=hash
    next()
})