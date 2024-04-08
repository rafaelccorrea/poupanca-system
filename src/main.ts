import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  logger.log('Inicializando o aplicativo...');

  // CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  // Timeout
  app.useGlobalInterceptors(new TimeoutInterceptor(1000));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: false,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Prefixo das APIs
  app.setGlobalPrefix('vaquinha-v1');

  const options = new DocumentBuilder()
    .setTitle('Vaquinha')
    .setDescription('Poupança')
    .setVersion('1.0')
    .addTag('v1')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Aplicativo inicializado e ouvindo na porta ${port}.`);
}
bootstrap();
