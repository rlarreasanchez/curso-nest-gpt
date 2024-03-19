// Generated by https://quicktype.io

export interface PurchaseReceiptErpLine {
  idPedido: string;
  noRecurso: string;
  codProyecto: string;
  fase: null;
  tipo: string;
  noLinea: number;
  naturaleza: string;
  cantidad: number;
  unidadMedida: string;
  costeUnitario: number;
  descripcion: string;
  importe: number;
  fechaPedido: Date | null;
  fechaRecepcionSolicitada: Date | null;
  fechaRecepcionPrometida: Date | null;
  fechaRecepcionPlanificada: Date | null;
}

export interface PurchaseReceiptERP {
  tipoDocumento: string | null;
  idPedido: string | null;
  codigoProveedor: string | null;
  nombreProveedor: string | null;
  codigoProyecto: string | null;
  enviadoAObra: boolean;
  fechaRegistro: Date | null;
  fechaCoste: Date | null;
  fechaPedido: Date | null;
  fechaDocumento: Date | null;
}
