import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  console.log('Antes de escutar a porta 8081');
  await app.listen(8081);
  console.log('Backend rodando na porta 8081');
}

bootstrap();
