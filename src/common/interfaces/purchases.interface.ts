export interface PurchaseReceipt {
  proveedor?: string;
  proveedorId?: string;
  obra?: string;
  albaran?: string;
  pedido?: string;
  descripcion?: string;
  products?: PurchaseReceiptProduct[];
}

export interface PurchaseReceiptProduct {
  id: string;
  cantidad: number;
  cantidadRecibida: number;
  descripcion: string;
  precio: number;
  total: number;
  obra?: string;
}
