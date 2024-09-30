import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServerConfiguration } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ServerConfiguration)
  app.enableCors();
  console.log(`
    Listening on port ${config.port}\n
    Forwarding all requests to ${config.forwardUrl}
    `);
  await app.listen(config.port);
}
bootstrap();
