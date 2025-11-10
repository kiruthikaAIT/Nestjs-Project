import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, Users } from './user.schema';
import { Model } from 'mongoose';
import { Roles, RolesDocument } from 'src/roles/roles.schema';
import { MESSAGES, ROLES } from 'src/constants/const';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Userservice {
  constructor(
    @InjectModel(Users.name) private readonly UsersModel: Model<UserDocument>,
    @InjectModel(Roles.name) private readonly RolesModel: Model<RolesDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async RegisterUser(RegDetails) {
    try {
      const { name, email, password } = RegDetails;

      const existingUser = await this.UsersModel.findOne({ email });
      if (existingUser) return { message: MESSAGES.USER_ALREADY_EXISTS };

      const userRole = await this.RolesModel.findOne({ name: ROLES.USER });
      if (!userRole)
        throw new InternalServerErrorException(MESSAGES.USER_NOT_FOUND);

      const user = await this.UsersModel.create({
        name,
        email,
        password,
        role: userRole._id,
      });

      return { message: MESSAGES.REGISTER_SUCCESS };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(MESSAGES.SERVER_ERROR);
    }
  }

  async LoginUser(loginDetails) {
    try {
      const { email, password } = loginDetails;
      const user = await this.UsersModel.findOne({ email });
      if (!user) throw new UnauthorizedException(MESSAGES.USER_NOT_FOUND);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        throw new UnauthorizedException(MESSAGES.INVALID_PASSWORD);

      const payload = { id: user._id, email: user.email };
      const token = this.jwtService.sign(payload);

      return { message: MESSAGES.LOGIN_SUCCESS, token };
    } catch (err) {
      console.error(err);
      if (err instanceof UnauthorizedException) throw err;
      throw new InternalServerErrorException(MESSAGES.SERVER_ERROR);
    }
  }
}
