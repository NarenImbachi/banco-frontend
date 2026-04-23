import { MovimientoResponse } from "./movimiento.model";


export enum TipoCuenta {
    AHORRO = 'AHORRO',
    CORRIENTE = 'CORRIENTE',
}

// Modelo para la respuesta completa de una Cuenta (GET by ID o GET all)
export interface Cuenta {
    id: number; 
    numeroCuenta: string;
    tipo: TipoCuenta;
    saldoInicial: number; 
    saldoDisponible: number;
    estado: boolean;
    estadoTexto: string;
    clienteId: number;
    movimientos?: MovimientoResponse[]; 
}

// Modelo para la solicitud de creación de una Cuenta (POST)
export interface CreateCuentaRequest {
    numeroCuenta: string;
    tipo: TipoCuenta;
    saldoInicial: number;
    estado: boolean;
    clienteId: number;
}

// Modelo para la solicitud de actualización de una Cuenta (PUT)
export interface UpdateCuentaRequest {
    tipo?: TipoCuenta; 
    estado: boolean; 
}