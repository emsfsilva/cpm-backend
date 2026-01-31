import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Cria a aplicação Nest
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para o frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Define a porta, primeiro tenta pegar de process.env.PORT, se não, usa 8081
  const port = process.env.PORT ? Number(process.env.PORT) : 8081;

  console.log(`Antes de escutar a porta ${port}`);

  // Inicia o servidor
  await app.listen(port);

  console.log(`Backend rodando na porta ${port}`);
}

bootstrap();
