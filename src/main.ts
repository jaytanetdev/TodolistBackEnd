import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { useContainer } from 'class-validator'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config'
import { TAuthConfig } from './config/auth.config';

const compression = require('compression');
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    bodyParser: true,
    cors: {
      origin: process.env.FRONTEND_HOSTNAME || 'http://localhost:3000',
      credentials: true,
    },
    rawBody: true,
    bufferLogs: true,
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
    }),
  );
  const configSvc = app.get(ConfigService)
  const authConfig = configSvc.get<TAuthConfig>('auth')
  app.use(cookieParser(authConfig?.cookie.signedSecret))
  
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  );

  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  await app.get(MikroORM).getMigrator().up();

  const config = new DocumentBuilder()
    .setTitle('Todo list API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, documentFactory, {
    url: 'doc',
    jsonDocumentUrl: 'doc-json',
  });

  app.use(compression())
  app.getHttpAdapter().getInstance().set('etag', false)
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap().catch((err) => {
  console.log(err)
})

