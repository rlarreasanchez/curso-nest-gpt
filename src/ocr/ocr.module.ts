import { Module } from '@nestjs/common';

import { ErpModule } from '@erp/erp.module';
import { ErpService } from '@erp/erp.service';
import { ErpHttpAdapter } from '@erp/adapters/erp-http.adapter';
import { GptModule } from '@gpt/gpt.module';
import { GptService } from '@gpt/gpt.service';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller';

@Module({
  imports: [ErpModule, GptModule],
  controllers: [OcrController],
  providers: [OcrService, ErpService, ErpHttpAdapter, GptService],
})
export class OcrModule {}
