import { Module } from '@nestjs/common';
import { AppController } from './core/app/app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
