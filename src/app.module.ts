import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { GptModule } from './gpt/gpt.module';
import { ErpModule } from './erp/erp.module';
import { OcrModule } from './ocr/ocr.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    GptModule,
    ErpModule,
    OcrModule,
  ],
})
export class AppModule {}
