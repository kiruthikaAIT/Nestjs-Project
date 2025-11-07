
import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { Userservice } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";

@Module(
    {
        imports:[MongooseModule.forFeature([{ name:User.name, schema: UserSchema }])],
        controllers:[UserController],
        providers:[Userservice]
    }
)
export class UserModule{}