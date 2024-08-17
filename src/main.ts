import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3001','https://comprasinteligentes.co'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  console.log(process.env.DB_HOST,process.env.DB_USERNAME,process.env.DB_PASSWORD);
  await app.listen(3000);
}
bootstrap();
