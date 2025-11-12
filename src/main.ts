import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const environment = process.env.NODE_ENV || 'development';
const envPath = path.resolve(process.cwd(), `.env.${environment}`);

// Load .env variables
dotenv.config({ path: envPath });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Server running on port ${process.env.PORT} in ${environment} mode`,
  );

  // ✅ Safely read and log only variables from the .env file
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    console.log(envConfig);
  } else {
    console.warn(`.env file not found for ${environment}: ${envPath}`);
  }
}

bootstrap().catch((err) => {
  console.error('Error starting the server:', err);
  process.exit(1);
});
