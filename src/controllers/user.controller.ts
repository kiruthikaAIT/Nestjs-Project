import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '../Dto/user.dto';
// import { Users } from 'src/schemas/user.schema';
import { Userservice } from '../services/user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly UserService: Userservice) {}

  @Post('Register')
  RegisterUser(@Body() RegDetails: CreateUserDto) {
    // console.log(RegDetails);
    return this.UserService.RegisterUser(RegDetails);
  }

  @Post('login')
  LoginUser(@Body() loginDetails: LoginUserDto) {
    return this.UserService.LoginUser(loginDetails);
  }
}
