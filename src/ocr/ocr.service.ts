import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PurchaseReceipt } from '@common/interfaces/purchases.interface';
import { ErpService } from '@erp/erp.service';
import { GptService } from '@gpt/gpt.service';
import { getOcrText, getRegexPedido } from './helpers';
import { PurchaseReceiptDto } from './dtos';

@Injectable()
export class OcrService {
  constructor(
    private erpService: ErpService,
    private gptService: GptService,
  ) {}

  async purchaseReceiptOcr(
    file: Express.Multer.File,
    purchaseReceiptDto: PurchaseReceiptDto,
  ): Promise<PurchaseReceipt | null> {
    const { withIA = false } = purchaseReceiptDto;
    let ocrPurchaseReceipt: PurchaseReceipt = {};

    const ocrText = await getOcrText(file);
    const pedidoFromRegex = getRegexPedido(ocrText);

    ocrPurchaseReceipt = { pedido: pedidoFromRegex };

    if (withIA) {
      // Obtener parámetros por IA
      const iaPunchaseReceipt =
        await this.gptService.purchaseReceiptHeaderFromText(ocrText);
      if (iaPunchaseReceipt) {
        ocrPurchaseReceipt = { ...iaPunchaseReceipt };
      }
    }

    if (!ocrPurchaseReceipt.pedido)
      throw new HttpException(
        'Error processing the image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const productsFromErp = await this.erpService.getPurchaseReceiptLines(
      ocrPurchaseReceipt.pedido,
    );

    const obras = productsFromErp
      .map((product) => product.obra)
      .filter(function (v, i, self) {
        return i == self.indexOf(v);
      });

    const purchaseReceiptData = await this.erpService.getPurchaseReceiptData(
      ocrPurchaseReceipt.pedido,
    );

    return {
      ...ocrPurchaseReceipt,
      ...purchaseReceiptData,
      obra: obras.length === 1 ? obras[0] : null,
      products: productsFromErp,
    };
  }
}
