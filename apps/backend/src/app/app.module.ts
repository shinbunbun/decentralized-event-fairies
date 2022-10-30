import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HasuraController } from './hasura.controller';

@Module({
  imports: [],
  controllers: [AppController, HasuraController],
  providers: [AppService],
})
export class AppModule {}
