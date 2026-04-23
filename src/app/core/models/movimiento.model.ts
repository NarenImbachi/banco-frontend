export enum TipoMovimiento {
  DEPOSITO = 'DEPOSITO', 
  RETIRO = 'RETIRO',   
}

// Modelo para la solicitud de creación de un Movimiento 
export interface CreateMovimientoRequest {
  fecha: string; 
  tipo: TipoMovimiento;
  valor: number; 
  cuentaId: number; 
}

// Modelo para la respuesta de un Movimiento 
export interface MovimientoResponse {
  id: number; 
  fecha: string; 
  tipo: TipoMovimiento;
  valor: number; 
  saldo: number; 
  cuentaId: number; 
}

export interface MovimientoListadoResponse {
  id: number;
  fecha: string;
  numeroCuenta: string;
  tipoCuenta: string;
  saldoInicial: number;
  estado: boolean;
  movimiento: string;
  cuentaId: number;
}