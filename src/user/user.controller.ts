import { Body, Controller, Get, Post } from "@nestjs/common";
import { Userservice } from "./user.service";
import { Users } from "./user.schema";

@Controller('api/user')
export class UserController{
    constructor(private readonly UserService:Userservice){}

    @Post('Register')
    RegisterUser(@Body() RegDetails:Partial<Users>){
        // console.log(RegDetails);
       return this.UserService.RegisterUser(RegDetails)
    }

    @Post('login')
    LoginUser(@Body() loginDetails:Partial<Users>){
        // console.log(RegDetails);
       return this.UserService.LoginUser(loginDetails)
    }
}