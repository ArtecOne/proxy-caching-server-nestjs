import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigifyModule } from '@itgorillaz/configify';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register(),
    ConfigifyModule.forRootAsync()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
