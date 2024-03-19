import { Module } from '@nestjs/common';

import { ErpService } from './erp.service';
import { ErpHttpAdapter } from './adapters/erp-http.adapter';

@Module({
  providers: [ErpService, ErpHttpAdapter],
  exports: [ErpService],
})
export class ErpModule {}
