import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PurchaseReceipt } from '@common/interfaces/purchases.interface';
import { ErpService } from '@erp/erp.service';
import { GptService } from '@gpt/gpt.service';
import { getOcrText } from './helpers/tesseract.helper';
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
    let ocrObject: PurchaseReceipt = {};

    // Obtener el texto del OCR
    const ocrText = await getOcrText(file);

    // Buscar el pedido en el texto
    const found = ocrText.match(/PCO\d{2}-\d{4}/);
    const pedidoFromRegex = found ? found[0] : null;

    ocrObject = { pedido: pedidoFromRegex };

    if (withIA) {
      // Obtener el pedido de OpenAI
      const openaiObject =
        await this.gptService.purchaseReceiptHeaderFromText(ocrText);
      if (openaiObject) {
        ocrObject = { ...openaiObject };
      }
    }

    if (!ocrObject.pedido)
      throw new HttpException(
        'Error processing the image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const products = await this.erpService.getPurchaseReceiptLines(
      ocrObject.pedido,
    );

    const obras = products
      .map((product) => product.obra)
      .filter(function (v, i, self) {
        return i == self.indexOf(v);
      });

    const pedidoData = await this.erpService.getPurchaseReceiptData(
      ocrObject.pedido,
    );

    return {
      ...ocrObject,
      ...pedidoData,
      obra: obras.length === 1 ? obras[0] : null,
      products,
    };
  }
}
