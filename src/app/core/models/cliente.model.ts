export interface Cliente {
    id: number;
    nombre: string;
    genero: string;
    edad: number;
    identificacion: string;
    direccion: string;
    telefono: string;
    clienteId: string;
    contrasena: string;
    estado: boolean;
}

export interface ClienteResponse {
    id: number;
    nombre: string;
    genero: string;
    edad: number;
    identificacion: string;
    direccion: string;
    telefono: string;
    clienteId: string;
    contrasena: string;
    estado: boolean;
    estadoTexto: string;
}

export interface ClienteRequest{
    nombre: string;
    direccion: string;
    telefono: string;
    estado: boolean;
};