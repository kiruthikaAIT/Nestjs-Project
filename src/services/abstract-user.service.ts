import { CreateUserDto, LoginUserDto } from 'src/Dto/user.dto';

export abstract class IUserService {
  abstract RegisterUser(
    RegDetails: CreateUserDto,
  ): Promise<{ message: string }>;
  abstract LoginUser(
    loginDetails: LoginUserDto,
  ): Promise<{ message: string; token?: string }>;
}
