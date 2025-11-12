import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
// import { SeedModule } from './seed/seed.module';
// import { UserModule } from './user/user.module';
// import { MyUserModule } from './myuser/user.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './controllers/user.controller';
import { ProductController } from './controllers/products.controller';
import { SeedService } from './services/seed.service';
import { Userservice } from './services/user.service';
import { ProductService } from './services/products.service';
import { Roles, RoleSchema } from './schemas/roles.schema';
import { Users, UserSchema } from './schemas/user.schema';
import { Product, ProductSchema } from './schemas/products.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailController } from './controllers/mail.controller';
import { MailService } from './services/mail.service';
import { CronService } from './services/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
// import { EmailService } from './services/email.service';
import { EmailModule } from './email.module';
import { Connection } from 'mongoose';

@Module({
  imports: [
    // SeedModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nestjs', {
      connectionFactory: (connection: Connection) => {
        console.log('✅ MongoDB connected successfully!');
        connection.on('error', (err: Error) =>
          console.error('MongoDB connection error:', err),
        );
        return connection;
      },
    }),
    //  UserModule,
    // MyUserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'iamworkinginait',
      signOptions: { expiresIn: '1d' },
    }),

    MongooseModule.forFeature([
      { name: Roles.name, schema: RoleSchema },
      { name: Users.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL || 'kiruthika.t3910@gmail.com',
          pass: process.env.MAILPASS || 'cyab eboj jmrh ovqk',
        },
      },
      defaults: {
        from: '"My App" <kiruthika.t3910@gmail.com>',
      },
    }),

    ScheduleModule.forRoot(),

    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),

    EmailModule,
  ],
  controllers: [
    AppController,
    UserController,
    ProductController,
    MailController,
  ],
  providers: [
    AppService,
    SeedService,
    Userservice,
    ProductService,
    MailService,
    CronService,
  ],
})
export class AppModule {}
