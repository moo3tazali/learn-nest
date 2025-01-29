import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // use global validation pipe to validate DTOs in the controllers
  app.useGlobalPipes(
    new ValidationPipe({
      // only allow properties that are defined in the DTO
      whitelist: true,

      // transform the DTO properties to the correct type
      transform: true,
    }),
  );

  // use global prefix for all routes
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}

// run the app
bootstrap().catch(() => {});
