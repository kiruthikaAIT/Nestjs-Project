import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { LoginUserDto } from 'src/Dto/user.dto';

// Define JWT payload based on LoginUserDto
interface JwtPayload {
  userId: string;
  email: LoginUserDto['email'];
}

// Extend Express Request to include `user`
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractToken(request);
    const decoded = this.verifyToken(token);

    request.user = decoded; // type-safe assignment
    return true;
  }

  private extractToken(request: AuthenticatedRequest): string {
    const authHeader = request.headers['authorization'];
    if (!authHeader)
      throw new UnauthorizedException('Authorization header missing');

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid token format');

    return token;
  }

  private verifyToken(token: string): JwtPayload {
    const secretKey = process.env.JWT_SECRET || 'iamworkinginait';
    const decoded = jwt.verify(token, secretKey);

    if (!decoded || typeof decoded === 'string')
      throw new UnauthorizedException('Invalid token');

    return decoded as JwtPayload;
  }
}
