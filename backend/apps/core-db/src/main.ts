import { NestFactory } from '@nestjs/core';
import { CoreDbModule } from './core-db.module';

async function bootstrap() {
  const app = await NestFactory.create(CoreDbModule);
  
  // В production это приложение может не запускаться как сервер
  // Оно используется только как библиотека
  if (process.env.NODE_ENV === 'development') {
    await app.listen(3002);
    console.log('Core DB module is running on port 3002');
  }
}

bootstrap(); 