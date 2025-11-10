import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { Userservice } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Users, UserSchema } from "./user.schema";
import { Roles, RoleSchema } from "src/roles/roles.schema";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[
        MongooseModule.forFeature([{ name:Users.name, schema: UserSchema },{name:Roles.name,schema:RoleSchema}]),
         JwtModule.register({
              secret: process.env.JWT_SECRET || 'iamworkinginait',
              signOptions: { expiresIn: '1d' },
            }),
    ],
    controllers:[UserController],
    providers:[Userservice]
})

export class UserModule{}