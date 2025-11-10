import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Roles } from '../roles/roles.schema';
import { Users } from '../user/user.schema';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Roles.name) private readonly roleModel: Model<Roles>,
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  async onApplicationBootstrap() {
    console.log('🌱 Running database seeding...');
    await this.seed();
  }
  private async seed() {
    const roles = ['admin', 'user'];
    for (const name of roles) {
      const exists = await this.roleModel.findOne({ name });
      if (!exists) {
        await this.roleModel.create({ name });
        console.log(`✅ Role created: ${name}`);
      } else {
        console.log(`ℹ️ Role already exists: ${name}`);
      }
    }
    const adminRole = await this.roleModel.findOne({ name: 'admin' });
    const userRole = await this.roleModel.findOne({ name: 'user' });
    if (!adminRole || !userRole) throw new Error('Roles not found!');
    const users = [
      { name: 'Admin', email: 'admin@example.com', password: 'Admin@123', role: adminRole._id },
      { name: 'kiruthika', email: 'kiruthika@gmail.com', password: 'kiruthikat910', role: userRole._id },
    ];
    for (const u of users) {
      const exists = await this.userModel.findOne({ email: u.email });
      if (!exists) {
        u.password = await bcrypt.hash(u.password, 10);
        await this.userModel.create(u);
        console.log(`👤 User created: ${u.email}`);
      } else {
        console.log(`ℹ️ User already exists: ${u.email}`);
      }
    }

    console.log('🌱 Seeding completed!');
  }
}
