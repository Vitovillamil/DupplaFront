export type DocumentEstado =
  | 'borrador'
  | 'pendiente'
  | 'aprobado'
  | 'rechazado';

export interface Document {
  id?: number;
  tipo: string;
  monto: number;
  estado: DocumentEstado;
  fecha_creacion: string;
  meta: any;
}

