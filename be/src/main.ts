import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      // forbidNonWhitelisted: true,
      skipMissingProperties: false,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: configService.get('FRONTEND_URL'), // allow other origin access to API
    credentials: true, //Access-Control-Allow-Credentials: true response header.
  });

  await app.listen(configService.get('PORT')|| 3000);
}
bootstrap();
