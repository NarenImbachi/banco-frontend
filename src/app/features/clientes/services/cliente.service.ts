import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cliente, ClienteResponse } from '../../../core/models/cliente.model';
import { ApiResponse } from '../../../core/response/api-response.model';
import { ClienteUpdatePayload } from '../../../core/models/cliente-update.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) {}

  listar(): Observable<ApiResponse<ClienteResponse[]>> {
    return this.http.get<ApiResponse<ClienteResponse[]>>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<ApiResponse<Cliente>> {
    return this.http.get<ApiResponse<Cliente>>(`${this.apiUrl}/${id}`);
  }

  crear(cliente: Cliente): Observable<ApiResponse<Cliente>> {
    return this.http.post<ApiResponse<Cliente>>( this.apiUrl, cliente );
  }

  actualizar(id: number, datosActualizacion: ClienteUpdatePayload ): Observable<ApiResponse<Cliente>> {
    return this.http.put<ApiResponse<Cliente>>(`${this.apiUrl}/${id}`, datosActualizacion );
  }

  eliminar(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}