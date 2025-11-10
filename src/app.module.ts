import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedModule } from './seed/seed.module';
import { UserModule } from './user/user.module';
import { MyUserModule } from './myuser/user.module';
import { ProductModule } from './products/products.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';


@Module({
  imports: [
    SeedModule, 
    MongooseModule.forRoot('mongodb://localhost:27017/nestjs', {
      connectionFactory: (connection) => {
        console.log('✅ MongoDB connected successfully!');
        connection.on('error', (err) =>
          console.error('MongoDB connection error:', err),
        );
        return connection;
      },
    }),
     UserModule,
    MyUserModule,
    ProductModule,
      ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
