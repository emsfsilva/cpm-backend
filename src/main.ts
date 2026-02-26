import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://10.3.0.224:3000'],
    credentials: true,
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 8081;
  console.log(`Antes de escutar a porta ${port}`);
  await app.listen(port, '0.0.0.0');
  console.log(`Backend rodando na porta ${port}`);
}

bootstrap();
