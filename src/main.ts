import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable global validation pipe here
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // strips unknown properties
      forbidNonWhitelisted: true,  // throws error for unknown properties
      transform: true,             // automatically transforms payloads to DTO instances
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  // console.log(`🚀 Server running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
