import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Roles, RoleSchema } from '../roles/roles.schema';
import { Users, UserSchema } from '../user/user.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Roles.name, schema: RoleSchema },
      { name: Users.name, schema: UserSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
