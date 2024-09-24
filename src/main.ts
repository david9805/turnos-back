import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3001','https://comprasinteligentes.co'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  process.env.TZ = 'America/Bogota';  
  await app.listen(3000);
}
bootstrap();
