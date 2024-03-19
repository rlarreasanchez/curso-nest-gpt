import { Injectable } from '@nestjs/common';

import { PurchaseReceipt, PurchaseReceiptProduct } from '@common/interfaces';
import {
  PurchaseReceiptERP,
  PurchaseReceiptErpLine,
} from './interfaces/service-response.interface';
import { ErpHttpAdapter } from './adapters/erp-http.adapter';

@Injectable()
export class ErpService {
  private baseUrl = process.env.ERP_BASE_URL || 'http://localhost:3000';

  constructor(private http: ErpHttpAdapter) {}

  async getPurchaseReceiptData(pedido: string): Promise<PurchaseReceipt> {
    try {
      const purchaseReceipt = await this.http.get<PurchaseReceiptERP>(
        `${this.baseUrl}/pedidos/${pedido}`,
      );

      return {
        proveedor: purchaseReceipt.nombreProveedor,
        proveedorId: purchaseReceipt.codigoProveedor,
      } as PurchaseReceipt;
    } catch (error) {
      throw new Error('Error obteniendo el pedido');
    }
  }

  async getPurchaseReceiptLines(
    pedido: string,
  ): Promise<PurchaseReceiptProduct[]> {
    try {
      const purchaseReceiptsResponse = await this.http.get<
        PurchaseReceiptErpLine[]
      >(`${this.baseUrl}/pedidos/${pedido}/pedidos-lines`);

      return purchaseReceiptsResponse.map((line) => ({
        id: line.noLinea.toString(),
        cantidad: line.cantidad,
        descripcion: line.descripcion,
        precio: line.costeUnitario,
        total: line.importe,
        obra: line.codProyecto,
      }));
    } catch (error) {
      throw new Error('Error obteniendo las líneas del pedido');
    }
  }
}
